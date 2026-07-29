import sys
import time
import json
import argparse
import urllib.request
import pandas as pd
from decouple import config
from supabase_sync import upsert_leads

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding='utf-8')

# ==========================================
# CONFIGURACIÓN DEL AGENTE — PROSPECCIÓN DE CLIENTES B2B PARA KARIM / LOS TURQUITOS
# (venta mayorista de condimentos, frutos secos, especias, etc. — no tiene relación con ÆON)
# ==========================================
SERPER_API_KEY = config('SERPER_API_KEY', default="")

# Categorías de producto que definen el nicho (dentro del rubro Gastronomía)
PRODUCTOS = [
    "Condimentos", "Frutos Secos", "Frutas Disecadas", "Aceitunas",
    "Pickles", "Snacks", "Frutas", "Repostería", "Semillas",
    "Preparados", "Especias",
]

# Muestra de productos por categoría (lista de precios "Los Turquitos", junio 2026)
# usada para armar el gancho de venta con productos y precios reales.
CATALOGO = {
    "Condimentos": [
        ("Pimentón Alicante", "$4.900/kg"),
        ("Comino Especial", "$3.850/kg"),
        ("Orégano Alicante", "$5.400/kg"),
        ("Condimento p/Pizza Especial", "$3.850/kg"),
    ],
    "Frutos Secos": [
        ("Mix Premium", "$9.900/kg"),
        ("Almendras", "$23.900/kg"),
        ("Nueces Doradas Mariposa", "$13.900/kg"),
        ("Pasas de Uva sin Semilla", "$5.900/kg"),
    ],
    "Frutas Disecadas": [
        ("Ciruelas D'Agen sin Carozo", "$9.900/kg"),
        ("Pasas de Higo", "$10.700/kg"),
        ("Medallón de Durazno", "$13.500/kg"),
    ],
    "Frutas": [
        ("Fruta Mixta", "$10.600/kg"),
        ("Pelones", "$9.900/kg"),
    ],
    "Aceitunas": [
        ("Aceitunas Verdes con Carozo N°1 (1kg)", "$6.480"),
        ("Aceitunas Negras (1kg)", "$13.500"),
        ("Aceitunas Descarozada (1kg)", "$9.000"),
    ],
    "Pickles": [
        ("Pickles (1kg)", "$8.500"),
        ("Morrones (1kg)", "$8.690"),
        ("Ajíes en Vinagre (1kg)", "$6.490"),
    ],
    "Snacks": [
        ("Maní con Sal", "$4.500/kg"),
        ("Garrapiñada", "$4.500/kg"),
        ("Palitos Salados", "$4.500/kg"),
    ],
    "Repostería": [
        ("Chips de Chocolate", "$11.500/kg"),
        ("Coco Rallado", "$9.800/kg"),
        ("Cacao Amargo", "$14.900/kg"),
    ],
    "Semillas": [
        ("Chía", "$6.900/kg"),
        ("Quinoa", "$8.900/kg"),
        ("Mix de Semillas", "$6.900/kg"),
    ],
    "Preparados": [
        ("Hamburguesero", "$4.900/kg"),
        ("Chorizo Parrillero", "$4.900/kg"),
        ("Milanesero", "$4.900/kg"),
    ],
    "Especias": [
        ("Curry", "$8.900/kg"),
        ("Pesto", "$13.900/kg"),
        ("Albahaca", "$13.900/kg"),
    ],
}
CATALOGO_GENERAL = [
    ("Condimentos", "desde $3.850/kg"),
    ("Frutos secos", "desde $5.900/kg"),
    ("Especias", "desde $8.900/kg"),
    ("Aceitunas y pickles", "desde $6.480/kg"),
]

# Negocios minoristas: suelen vender variedad de estos productos, no uno solo
NEGOCIOS_MINORISTAS = [
    "dietética", "casa de especias", "almacén naturista", "tienda a granel",
]

# Negocios mayoristas/productores: suelen especializarse por producto
PLANTILLAS_MAYORISTAS = [
    "distribuidora de {producto}",
    "mayorista de {producto}",
    "fábrica de {producto}",
    "productora de {producto}",
]

# Cobertura nacional: capitales de provincia + polos comerciales relevantes, con su provincia
# para poder filtrar con --provincias (ej: solo NOA, o una región puntual) sin tener que listar
# ciudad por ciudad. Usar --ciudades, --provincias o --limit-ciudades para acotar mientras se
# prueba (cada ciudad multiplica la cantidad de consultas a la API de Serper).
CIUDADES = [
    {"ciudad": "Buenos Aires, Argentina", "provincia": "CABA"},
    {"ciudad": "La Plata, Argentina", "provincia": "Buenos Aires"},
    {"ciudad": "Mar del Plata, Argentina", "provincia": "Buenos Aires"},
    {"ciudad": "Bahía Blanca, Argentina", "provincia": "Buenos Aires"},
    {"ciudad": "Rosario, Argentina", "provincia": "Santa Fe"},
    {"ciudad": "Santa Fe, Argentina", "provincia": "Santa Fe"},
    {"ciudad": "Córdoba, Argentina", "provincia": "Córdoba"},
    {"ciudad": "Río Cuarto, Argentina", "provincia": "Córdoba"},
    {"ciudad": "Mendoza, Argentina", "provincia": "Mendoza"},
    {"ciudad": "San Juan, Argentina", "provincia": "San Juan"},
    {"ciudad": "San Luis, Argentina", "provincia": "San Luis"},
    {"ciudad": "San Miguel de Tucumán, Argentina", "provincia": "Tucumán"},
    {"ciudad": "Salta, Argentina", "provincia": "Salta"},
    {"ciudad": "San Salvador de Jujuy, Argentina", "provincia": "Jujuy"},
    {"ciudad": "Santiago del Estero, Argentina", "provincia": "Santiago del Estero"},
    {"ciudad": "Corrientes, Argentina", "provincia": "Corrientes"},
    {"ciudad": "Resistencia, Argentina", "provincia": "Chaco"},
    {"ciudad": "Posadas, Argentina", "provincia": "Misiones"},
    {"ciudad": "Neuquén, Argentina", "provincia": "Neuquén"},
    {"ciudad": "San Carlos de Bariloche, Argentina", "provincia": "Río Negro"},
    {"ciudad": "Comodoro Rivadavia, Argentina", "provincia": "Chubut"},
    {"ciudad": "Río Gallegos, Argentina", "provincia": "Santa Cruz"},
    {"ciudad": "Paraná, Argentina", "provincia": "Entre Ríos"},
    {"ciudad": "Formosa, Argentina", "provincia": "Formosa"},
    {"ciudad": "La Rioja, Argentina", "provincia": "La Rioja"},
    {"ciudad": "San Fernando del Valle de Catamarca, Argentina", "provincia": "Catamarca"},
]


def ciudades_de_provincias(provincias):
    """Devuelve las ciudades de CIUDADES cuya provincia está en `provincias` (comparación
    insensible a mayúsculas/minúsculas)."""
    provincias_norm = {p.strip().lower() for p in provincias}
    return [c["ciudad"] for c in CIUDADES if c["provincia"].lower() in provincias_norm]

MAX_LEADS_POR_CIUDAD = 40
MAX_LEADS_TOTAL = 3000


class AgenteAuditorCondimentos:
    def __init__(self):
        self.leads_priorizados = []

    def analizar_comercio(self, local, ciudad, tipo_negocio, categoria):
        direccion = local.get('direccion', '')
        website = local.get('website', '')

        rating = local.get("rating", 0)
        rating_count = local.get("ratingCount", 0)

        # Scoring pensado en potencial de compra (no en digitalización): un mayorista
        # compra en volumen recurrente, y más reseñas suele indicar más movimiento/tamaño.
        score = 50
        if tipo_negocio == "Mayorista":
            score += 30
        if rating_count > 50:
            score += 20
        elif rating_count > 10:
            score += 10

        if score >= 90:
            prioridad = "ALTA"
        elif score >= 60:
            prioridad = "MEDIA"
        else:
            prioridad = "BAJA"

        rubro_desc = f"{tipo_negocio} de {categoria.lower()}" if categoria != "General" else tipo_negocio
        diagnostico = (
            f"{rubro_desc}. {rating_count} reseñas en Google (rating {rating}). "
            f"{'Buen candidato a pedido recurrente por volumen B2B.' if tipo_negocio == 'Mayorista' else 'Candidato a compra de reposición para su local.'}"
        )

        productos_muestra = CATALOGO.get(categoria, CATALOGO_GENERAL)
        detalle_productos = ", ".join(f"{nombre} a {precio}" for nombre, precio in productos_muestra[:2])

        if tipo_negocio == "Mayorista":
            hook = (
                f"Hola {local['nombre']}, soy Karim, de Los Turquitos. Somos mayoristas de {categoria.lower()} y otros productos de almacén. "
                f"Tenemos, por ejemplo, {detalle_productos} (lista actualizada junio 2026). "
                f"¿Les interesa que les pasemos la lista completa de precios por mayor?"
            )
        else:
            hook = (
                f"Hola {local['nombre']}, soy Karim, de Los Turquitos. Somos proveedores mayoristas de condimentos, frutos secos, "
                f"especias, aceitunas y productos de almacén para dietéticas y comercios como el tuyo. "
                f"Por ejemplo tenemos {detalle_productos}. ¿Querés que te pasemos la lista de precios actualizada?"
            )

        self.leads_priorizados.append({
            "Empresa": local['nombre'],
            "Tipo Negocio": tipo_negocio,
            "Categoría Producto": categoria,
            "Ciudad": ciudad,
            "Dirección": direccion,
            "Teléfono": local.get('telefono', ''),
            "Prioridad": prioridad,
            "Score": score,
            "Web Actual": website if website else "NINGUNA",
            "Diagnóstico": diagnostico,
            "Hook de Venta": hook,
        })

    def exportar_leads(self, output_file="leads_karim.csv"):
        if not self.leads_priorizados:
            print("No hay leads para exportar.")
            return

        df = pd.DataFrame(self.leads_priorizados)
        df = df.sort_values(by="Score", ascending=False)
        df = df.drop_duplicates(subset=['Empresa', 'Dirección'])
        df.to_csv(output_file, index=False, encoding='utf-8-sig')
        print(f"\n✅ Archivo '{output_file}' generado con {len(df)} leads únicos auditados (respaldo local).")

        print("☁️  Subiendo leads a Supabase...")
        subidos = upsert_leads(df.to_dict(orient='records'))
        print(f"✅ {subidos} leads subidos/actualizados en Supabase.")


def buscar_negocios(query, ciudad):
    url = "https://google.serper.dev/places"
    payload = json.dumps({"q": query, "location": ciudad, "gl": "ar", "hl": "es"}).encode('utf-8')
    headers = {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json',
    }

    try:
        req = urllib.request.Request(url, data=payload, headers=headers)
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read()).get("places", [])
    except Exception as e:
        print(f"Error buscando '{query}' en '{ciudad}': {e}")
        return []


def construir_queries(incluir_minoristas=True, incluir_mayoristas=True):
    """Devuelve lista de tuplas (query, tipo_negocio, categoria)."""
    queries = []
    if incluir_minoristas:
        for negocio in NEGOCIOS_MINORISTAS:
            queries.append((negocio, "Minorista", "General"))
    if incluir_mayoristas:
        for producto in PRODUCTOS:
            for plantilla in PLANTILLAS_MAYORISTAS:
                queries.append((plantilla.format(producto=producto.lower()), "Mayorista", producto))
    return queries


def ejecutar_extraccion(ciudades, queries, max_leads_ciudad, max_leads_total, output_file):
    if not SERPER_API_KEY:
        print("❌ Falta SERPER_API_KEY. Configurala en el archivo .env (ai/.env).")
        return

    auditor = AgenteAuditorCondimentos()
    total_obtenidos = 0
    total_queries_estimadas = len(ciudades) * len(queries)

    print("🤖 Iniciando prospección de clientes B2B — Karim / Los Turquitos (condimentos, frutos secos, especias)")
    print(f"📍 Ciudades objetivo: {len(ciudades)}  |  🔎 Queries por ciudad: {len(queries)}  |  📊 Total consultas estimadas: {total_queries_estimadas}\n")

    for ciudad in ciudades:
        if total_obtenidos >= max_leads_total:
            break
        obtenidos_ciudad = 0

        for query, tipo_negocio, categoria in queries:
            if total_obtenidos >= max_leads_total or obtenidos_ciudad >= max_leads_ciudad:
                break

            print(f"🔍 [{ciudad}] Auditando: {query}")
            resultados = buscar_negocios(query, ciudad)

            for p in resultados:
                if total_obtenidos >= max_leads_total or obtenidos_ciudad >= max_leads_ciudad:
                    break

                local = {
                    "nombre": p.get("title", ""),
                    "direccion": p.get("address", ""),
                    "telefono": p.get("phoneNumber", ""),
                    "website": p.get("website", ""),
                    "rating": p.get("rating", 0),
                    "ratingCount": p.get("ratingCount", 0),
                }

                auditor.analizar_comercio(local, ciudad, tipo_negocio, categoria)
                total_obtenidos += 1
                obtenidos_ciudad += 1

            time.sleep(1.5)

        print(f"  └ ✅ Leads acumulados: {total_obtenidos} (ciudad '{ciudad}': {obtenidos_ciudad})")

    auditor.exportar_leads(output_file)


def main():
    parser = argparse.ArgumentParser(description="Prospección de dietéticas/distribuidoras de condimentos, frutos secos, etc.")
    parser.add_argument('--ciudades', type=str, default="", help="Lista de ciudades separadas por coma (ej: 'Córdoba, Argentina,Rosario, Argentina'). Tiene prioridad sobre --provincias si se pasan los dos.")
    parser.add_argument('--provincias', type=str, default="", help="Lista de provincias separadas por coma (ej: 'Córdoba,Santa Fe'). Filtra CIUDADES por provincia. Ver --listar-provincias para las opciones disponibles.")
    parser.add_argument('--listar-provincias', action='store_true', help="Imprime las provincias disponibles (con la cantidad de ciudades en cada una) y termina, sin llamar a la API.")
    parser.add_argument('--limit-ciudades', type=int, default=0, help="Usar solo las primeras N ciudades de la lista ya filtrada (0 = todas).")
    parser.add_argument('--max-por-ciudad', type=int, default=MAX_LEADS_POR_CIUDAD, help="Tope de leads por ciudad.")
    parser.add_argument('--max-total', type=int, default=MAX_LEADS_TOTAL, help="Tope total de leads.")
    parser.add_argument('--solo-minoristas', action='store_true', help="No buscar mayoristas/distribuidoras, solo dietéticas/casas de especias.")
    parser.add_argument('--solo-mayoristas', action='store_true', help="No buscar minoristas, solo distribuidoras/mayoristas/fábricas.")
    parser.add_argument('--out', type=str, default="leads_karim.csv", help="Nombre del CSV de salida.")
    parser.add_argument('--dry-count', action='store_true', help="Solo imprime cuántas consultas se harían, sin llamar a la API.")
    args = parser.parse_args()

    if args.listar_provincias:
        conteo = {}
        for c in CIUDADES:
            conteo[c["provincia"]] = conteo.get(c["provincia"], 0) + 1
        for provincia, n in sorted(conteo.items()):
            print(f"{provincia}: {n} ciudad(es)")
        return

    ciudades = [c["ciudad"] for c in CIUDADES]
    if args.provincias:
        provincias = [p.strip() for p in args.provincias.split(",") if p.strip()]
        ciudades = ciudades_de_provincias(provincias)
        if not ciudades:
            disponibles = ", ".join(sorted({c["provincia"] for c in CIUDADES}))
            print(f"⚠️  Ninguna ciudad coincide con esas provincias. Provincias disponibles: {disponibles}")
            return
    if args.ciudades:
        ciudades = [c.strip() for c in args.ciudades.split(",") if c.strip()]
    if args.limit_ciudades:
        ciudades = ciudades[:args.limit_ciudades]

    incluir_minoristas = not args.solo_mayoristas
    incluir_mayoristas = not args.solo_minoristas
    queries = construir_queries(incluir_minoristas, incluir_mayoristas)

    if args.dry_count:
        print(f"Ciudades: {len(ciudades)}")
        print(f"Queries por ciudad: {len(queries)}")
        print(f"Consultas totales a la API: {len(ciudades) * len(queries)}")
        return

    ejecutar_extraccion(ciudades, queries, args.max_por_ciudad, args.max_total, args.out)


if __name__ == "__main__":
    main()
