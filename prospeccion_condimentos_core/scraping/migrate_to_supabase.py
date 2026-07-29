import sys
import csv
import argparse
from supabase_sync import upsert_leads

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding='utf-8')


def leer_csv(path):
    with open(path, encoding='utf-8-sig') as f:
        return list(csv.DictReader(f))


def main():
    parser = argparse.ArgumentParser(description="Migra un CSV de leads (formato Karim) a la tabla `leads` de Supabase.")
    parser.add_argument('--file', type=str, default='leads_karim.csv', help="CSV a migrar.")
    args = parser.parse_args()

    leads = leer_csv(args.file)
    print(f"Leyendo {len(leads)} leads de '{args.file}'...")

    subidos = upsert_leads(leads)
    print(f"✅ {subidos} leads subidos/actualizados en Supabase.")


if __name__ == "__main__":
    main()
