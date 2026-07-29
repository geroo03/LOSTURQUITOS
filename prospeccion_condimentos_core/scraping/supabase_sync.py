import json
import urllib.request
import urllib.error
from decouple import config

SUPABASE_URL = config('SUPABASE_URL', default="")
SUPABASE_SERVICE_KEY = config('SUPABASE_SERVICE_KEY', default="")

# Mapea las claves de los dicts de leads (como los arma agente_prospeccion_condimentos.py
# o como vienen de un CSV) a las columnas de la tabla `leads` en Supabase.
COLUMN_MAP = {
    "Empresa": "empresa",
    "Tipo Negocio": "tipo_negocio",
    "Categoría Producto": "categoria_producto",
    "Ciudad": "ciudad",
    "Dirección": "direccion",
    "Teléfono": "telefono",
    "Prioridad": "prioridad",
    "Score": "score",
    "Web Actual": "web_actual",
    "Diagnóstico": "diagnostico",
    "Hook de Venta": "hook_venta",
}


def to_db_row(lead):
    # empresa/telefono/ciudad forman la clave única en la tabla: nunca deben quedar en NULL,
    # porque Postgres trata cada NULL como distinto de otro NULL y el ON CONFLICT dejaría de
    # detectar duplicados (por eso un teléfono vacío se guarda como '' y no como None).
    CLAVE_UNICA = {"empresa", "telefono", "ciudad"}

    row = {}
    for src_key, db_key in COLUMN_MAP.items():
        val = lead.get(src_key)
        if db_key == "score":
            try:
                row[db_key] = int(val)
            except (TypeError, ValueError):
                row[db_key] = None
        else:
            val = (val or "").strip() if isinstance(val, str) else val
            if db_key in CLAVE_UNICA:
                row[db_key] = val or ""
            else:
                row[db_key] = val if val else None
    return row


def upsert_leads(leads, batch_size=100):
    """Sube (o actualiza si ya existe empresa+telefono+ciudad) una lista de leads a Supabase.
    `leads` puede ser una lista de dicts con las claves de COLUMN_MAP o ya en formato de columnas db."""
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        print("⚠️  Falta SUPABASE_URL o SUPABASE_SERVICE_KEY en ai/.env — se omite la sincronización con Supabase.")
        return 0

    rows = [to_db_row(l) if any(k in COLUMN_MAP for k in l) else l for l in leads]

    # Postgres no permite que un mismo INSERT ... ON CONFLICT afecte la misma fila dos veces,
    # así que deduplicamos por la clave única (empresa, telefono, ciudad) antes de mandar,
    # quedándonos con la primera aparición (los leads vienen ordenados por Score descendente).
    vistos = set()
    rows_dedup = []
    for r in rows:
        clave = (r.get('empresa'), r.get('telefono'), r.get('ciudad'))
        if clave in vistos:
            continue
        vistos.add(clave)
        rows_dedup.append(r)
    rows = rows_dedup

    url = f"{SUPABASE_URL}/rest/v1/leads?on_conflict=empresa,telefono,ciudad"
    headers = {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=minimal',
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
            print(f"  ❌ Error subiendo lote a Supabase ({e.code}): {e.read().decode('utf-8', 'ignore')}")

    return subidos
