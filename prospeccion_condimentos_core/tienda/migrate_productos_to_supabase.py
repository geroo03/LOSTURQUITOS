import sys
import json
import urllib.request
import urllib.error
from decouple import config

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding='utf-8')

SUPABASE_URL = config('SUPABASE_URL', default="")
SUPABASE_SERVICE_KEY = config('SUPABASE_SERVICE_KEY', default="")


def cargar_filas(path):
    with open(path, encoding='utf-8') as f:
        return json.load(f)


def borrar_todo():
    """Limpia la tabla antes de recargar, para evitar duplicados si se corre más de una vez."""
    url = f"{SUPABASE_URL}/rest/v1/productos?id=gt.0"
    headers = {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}',
        'Prefer': 'return=minimal',
    }
    req = urllib.request.Request(url, headers=headers, method='DELETE')
    with urllib.request.urlopen(req) as resp:
        return resp.status


def insertar(rows, batch_size=100):
    url = f"{SUPABASE_URL}/rest/v1/productos"
    headers = {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
    }
    subidos = 0
    for i in range(0, len(rows), batch_size):
        batch = rows[i:i + batch_size]
        payload = json.dumps(batch).encode('utf-8')
        req = urllib.request.Request(url, data=payload, headers=headers, method='POST')
        try:
            with urllib.request.urlopen(req) as resp:
                resp.read()
                subidos += len(batch)
        except urllib.error.HTTPError as e:
            print(f"  ❌ Error en lote: {e.code} {e.read().decode('utf-8', 'ignore')}")
    return subidos


def main():
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        print("❌ Falta SUPABASE_URL o SUPABASE_SERVICE_KEY en ai/.env")
        return

    print("⚠️  ATENCIÓN: este script BORRA todos los productos actuales antes de recargar.")
    print("   Si ya subiste fotos a mano en el Table Editor (columna imagen_url), se pierden.")
    print("   Este archivo (productos_data.json) tampoco tiene fotos, así que quedarían vacías.")
    respuesta = input("   ¿Continuar de todas formas? Escribí 'si' para confirmar: ").strip().lower()
    if respuesta != 'si':
        print("Cancelado. No se modificó nada.")
        return

    path = sys.argv[1] if len(sys.argv) > 1 else 'productos_data.json'
    rows = cargar_filas(path)
    print(f"Leyendo {len(rows)} filas de '{path}'...")

    print("Limpiando tabla productos...")
    borrar_todo()

    subidos = insertar(rows)
    print(f"✅ {subidos} productos cargados en Supabase.")


if __name__ == "__main__":
    main()
