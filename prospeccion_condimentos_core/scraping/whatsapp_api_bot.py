import os
import csv
import json
import re
import argparse
import time
import urllib.parse
import webbrowser
import pyautogui # Reintroducimos el control del navegador para no usar Meta API oficial
import random # Agregado para randomizar tiempos y parecer humano
import groq
from decouple import config, UndefinedValueError
from tenacity import retry, wait_exponential, stop_after_attempt

# Configuramos python-decouple usando la función config estándar
# Archivo persistente para no enviar duplicados
LOG_FILE = "send_log.json"

# ========= TAREA 1: Lectura y Validación =========
def normalize_phone(phone_raw):
    """
    Limpia los caracteres y formatea el número al estándar E.164.
    """
    numero = re.sub(r'\D', '', str(phone_raw))
    if numero.startswith('0'):
        numero = numero[1:]
    if len(numero) == 10:
        numero = "549" + numero
    elif len(numero) == 12 and numero.startswith("54"):
        numero = "549" + numero[2:]
    elif not numero.startswith("54"):
        numero = "549" + numero
    return f"+{numero}"

def load_send_log():
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_send_log(log_data):
    with open(LOG_FILE, 'w', encoding='utf-8') as f:
        json.dump(log_data, f, ensure_ascii=False, indent=4)

def fetch_and_validate_contacts(file_path):
    contacts = []
    if file_path.endswith('.csv'):
        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            contacts = list(reader)
    elif file_path.endswith('.json'):
        with open(file_path, 'r', encoding='utf-8') as f:
            contacts = json.load(f)
    
    valid_contacts = []
    for c in contacts:
        # Tratamos de buscar las columnas comunes en tus CSV
        name = c.get('Nombre del Negocio') or c.get('name') or c.get('Nombre') or c.get('Negocio') or c.get('Empresa')
        phone = c.get('email_o_telefono') or c.get('Teléfono / WhatsApp') or c.get('phone') or c.get('Número Validado') or c.get('Link de WhatsApp') or c.get('Teléfono')
        
        if name and phone:
            # Si el log es de link de wpp extraemos el número
            if "phone=" in str(phone):
                phone = str(phone).split("phone=")[1].split("&")[0]
                
            # Si el contacto trae email en vez de telefono, lo skipeamos o intentamos limpiar
            if "@" in str(phone):
                continue
                
            if str(phone).strip():
                c['name_normalized'] = name
                c['phone_normalized'] = normalize_phone(phone)
                valid_contacts.append(c)
    return valid_contacts

# ========= TAREA 2: Generación con IA =========
try:
    GROQ_KEY = config('GROQ_API_KEY', default="")
    groq_client = groq.Groq(api_key=GROQ_KEY) if GROQ_KEY else None
except Exception:
    groq_client = None

@retry(wait=wait_exponential(multiplier=1, min=2, max=10), stop=stop_after_attempt(3))
def generate_ai_message(contact_data):
    # Si no hay cliente Groq configurado, usamos un generador local seguro
    if not groq_client:
        return generate_local_message(contact_data)
        
    nombre = contact_data.get('name_normalized', 'Cliente')

    # Extraemos info valiosa del CSV (categoría de producto, potencial de compra y gancho con precios) para darle a la IA
    rubro = contact_data.get('Rubro', '') or contact_data.get('Categoría Producto', '') or contact_data.get('Tipo Negocio', '')
    pain_point = contact_data.get('Pain_Point', '') or contact_data.get('Diagnóstico', '')
    propuesta = contact_data.get('Propuesta_Personalizada', '') or contact_data.get('Hook de Venta', '')

    system_prompt = (
        "Eres Karim, vendedor de Los Turquitos (marca familiar), mayorista de condimentos, frutos secos, "
        "especias, aceitunas, pickles, snacks, frutas secas, repostería y semillas. "
        "Tu única función es transformar datos crudos en un mensaje de apertura de WhatsApp "
        "persuasivo, corto y humano para ofrecer estos productos a granel/por mayor.\n\n"
        "Personalidad: El mensaje debe sonar como un proveedor local que investigó el negocio del cliente, "
        "no como spam genérico. Preséntate como 'Hola, soy Karim, de Los Turquitos' al inicio.\n\n"
        "Restricciones:\n"
        "- Prohibido hablar de automatización, software, WhatsApp Business API ni nada tecnológico: esto es venta de productos físicos.\n"
        "- El mensaje debe ser breve (máximo 3 o 4 párrafos cortos).\n"
        "- El tono debe ser profesional pero muy directo, simple y de venta.\n"
        "- NUNCA uses marcadores de posición (como corchetes o asteriscos).\n"
        "- MUY IMPORTANTE: Si consideras que la información provista es escasa o incompleta, haz lo mejor que puedas para generar un mensaje comercial válido. NUNCA te niegues a escribir el mensaje, NUNCA digas 'no tengo suficiente información' y NUNCA pidas más datos."
    )

    user_prompt = (
        f"Redacta el mensaje siguiendo esta estructura exacta:\n"
        f"1. Saludo Personalizado: Presentate como vendedor de Karim (Los Turquitos) y menciona el local '{nombre}'.\n"
        f"2. El Gancho: Menciona por qué podría interesarle: '{pain_point}'.\n"
        f"3. La Oferta: Ofrecé productos y precios concretos de nuestra lista, basándote en: '{propuesta}'.\n"
        f"4. Llamada a la Acción (CTA): Preguntá si querés mandarle la lista completa de precios actualizada (junio 2026) o coordinar un pedido.\n\n"
        f"Datos:\n"
        f"- Negocio: {nombre} ({rubro})\n"
        f"- Por qué le puede interesar: {pain_point}\n"
        f"- Oferta/productos: {propuesta}"
    )

    response = groq_client.chat.completions.create(
        model="llama-3.1-8b-instant", # Modelo actualizado de Groq que procesa súper rápido
        max_tokens=300,
        temperature=0.7,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )
    return response.choices[0].message.content.strip()


def generate_local_message(contact_data):
    """
    Generador local para cuando no hay clave de Groq o para pruebas offline.
    Se presenta como Karim, de Los Turquitos, y ofrece productos con precio.
    """
    nombre = contact_data.get('name_normalized', 'cliente')
    rubro = contact_data.get('Rubro', '') or contact_data.get('Categoría Producto', '') or contact_data.get('Tipo Negocio', '') or ''
    pain_point = contact_data.get('Pain_Point') or contact_data.get('Diagnóstico') or 'buscamos ampliar la cartera de proveedores de productos de almacén'
    propuesta = contact_data.get('Propuesta_Personalizada') or contact_data.get('Hook de Venta') or 'condimentos, frutos secos, especias y aceitunas a precio de mayorista'

    # Construimos un mensaje comercial, corto y directo
    partes = []
    partes.append(f"Hola, soy Karim, de Los Turquitos. Vimos {nombre}{(' ('+rubro+')') if rubro else ''} y creemos que podemos ser su proveedor.")
    partes.append(f"{pain_point}.")
    partes.append(f"Ofrecemos: {propuesta}.")
    partes.append("¿Querés que te pasemos la lista completa de precios actualizada (junio 2026)?")

    msg = ' '.join(partes)
    # Limpiamos saltos extra y devolvemos
    return ' '.join(msg.split())

# ========= TAREA 3: Envío usando WhatsApp Web (Navegador) =========
def send_whatsapp_web(to_phone, ai_message_text):
    """
    Envía el mensaje simulando los clics en el navegador en lugar de la API paga de Meta.
    Así no necesitas Tokens ni configurar nada de Facebook.
    """
    pitch_encoded = urllib.parse.quote(ai_message_text)
    url_ultra_nativa = f"https://web.whatsapp.com/send?phone={to_phone}&text={pitch_encoded}"
    
    print(f"  🌐 Abriendo WhatsApp Web...")
    webbrowser.open(url_ultra_nativa)
    time.sleep(10) # 10s para que cargue la interfaz
    
    # 4.5. ASEGURAR FOCO Y PRIMER PLANO:
    ancho, alto = pyautogui.size()
    pyautogui.click(ancho / 2, alto / 2)
    time.sleep(1)
    
    print("  🤖 Presionando 'Enviar'...")
    pyautogui.press('enter')
    time.sleep(1)
    pyautogui.press('enter')
    
    # Contra-medida para números inválidos
    time.sleep(1)
    pyautogui.press('enter')
    time.sleep(0.5)
    pyautogui.press('esc')
    
    time.sleep(3)
    return True, "Mensaje enviado exitosamente en Chromium."

# ========= TAREA 4: Orquestador Script Puro =========
def main():
    parser = argparse.ArgumentParser(description="Ejecuta campaña de WhatsApp con Groq API.")
    parser.add_argument('--file', type=str, required=True, help="Ruta al CSV o JSON de contactos.")
    parser.add_argument('--dry-run', action='store_true', help="Simular sin enviar a la API de WhatsApp.")
    parser.add_argument('--start', type=int, default=0, help="Fila desde donde empezar (0 es completo).")
    args = parser.parse_args()

    print(f"📁 Cargando contactos desde {args.file}...")
    if not os.path.exists(args.file):
        print(f"❌ El archivo {args.file} no existe.")
        return

    contacts = fetch_and_validate_contacts(args.file)
    print(f"✅ Se encontraron {len(contacts)} contactos válidos con número de teléfono.")
    
    logs = load_send_log()
    stats = {"sent": 0, "failed": 0, "pending": 0, "skipped": 0}
    
    LIMITE_DE_ENVIOS = 50
    LIMITE_TANDA = 25
    tanda_actual = 0

    # Nos saltamos los n primeros si nos pasaron --start (ej: --start 213)
    contacts_to_process = contacts[args.start:]

    for idx, c in enumerate(contacts_to_process, start=args.start):
        if stats["sent"] >= LIMITE_DE_ENVIOS:
            print(f"\n✋ Límite de seguridad alcanzado ({LIMITE_DE_ENVIOS} mensajes). Deteniendo envíos.")
            break
            
        phone_norm = c['phone_normalized']
        
        # Ignorar si el contacto ya fue enviado con éxito en rondas anteriores
        if logs.get(phone_norm, {}).get('status') == 'sent':
            stats["skipped"] += 1
            continue
            
        print(f"\n👤 Procesando contacto: {c['name_normalized']} ({phone_norm})")
        
        try:
            print("  🤖 Generando texto con Groq IA...")
            msg = generate_ai_message(c)
            # Reemplazar comillas raras y retornos de carro
            msg = msg.replace('\"', '').replace('"', '').replace('\n', ' ')
            
            if args.dry_run:
                print("  ⚠️ [DRY RUN] Mensaje generado absteniendo envío:")
                print(f"       > {msg[:150]}...")
                logs[phone_norm] = {"status": "pending", "ai_message": msg}
                stats["pending"] += 1
            else:
                print("  🚀 Despachando a WhatsApp...")
                time.sleep(3) 
                
                # Reemplazamos la Meta API por el envío Web gratuito
                ok, res_text = send_whatsapp_web(phone_norm, msg)
                
                if ok:
                    print("  ✅ [EXITO] Mensaje puesto en cola.")
                    logs[phone_norm] = {"status": "sent", "ai_message": msg}
                    stats["sent"] += 1
                    tanda_actual += 1
                else:
                    print(f"  ❌ [FALLO] Ocurrió un error en Chromium: {res_text}")
                    logs[phone_norm] = {"status": "failed", "error": str(res_text)}
                    stats["failed"] += 1
                
                # ==========================================
                # = REGlas ANTI BAN IMPUESTAS (Delays)     =
                # ==========================================
                if tanda_actual >= LIMITE_TANDA:
                    descanso = random.randint(300, 600)
                    minutos = descanso // 60
                    print(f"\n🛑 TANDA DE {LIMITE_TANDA} COMPLETADA. Descanso largo de {minutos} min ({descanso} seg)...")
                    time.sleep(descanso)
                    tanda_actual = 0
                elif stats["sent"] < LIMITE_DE_ENVIOS:
                    pausa = random.randint(20, 45)
                    print(f"  ⏱️ Pausa corta activada: Esperando {pausa}s para enviar el próximo...")
                    time.sleep(pausa)
                    
        except Exception as e:
            print(f"  🔥 [ERROR CLÍTICO]: {e}")
            logs[phone_norm] = {"status": "failed", "error": str(e)}
            stats["failed"] += 1
            
        save_send_log(logs)

    print("\n==================================")
    print("📊 REPORTE DE CAMPAÑA FINALIZADA")
    print("==================================")
    print(f"✅ Enviados reales: {stats['sent']}")
    print(f"❌ Fallidos: {stats['failed']}")
    print(f"⏭️ Saltados / Previamente enviados: {stats['skipped']}")
    print(f"👁️ Pendientes (Dry-run mode): {stats['pending']}")

if __name__ == '__main__':
    main()