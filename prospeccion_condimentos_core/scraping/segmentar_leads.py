import sys
import argparse
import os
import re
import pandas as pd

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding='utf-8')


def slug(texto):
    texto = re.sub(r'[^\w\s-]', '', str(texto)).strip()
    return re.sub(r'[\s]+', '_', texto)


def segmentar(input_file, output_dir):
    df = pd.read_csv(input_file, encoding='utf-8-sig')

    columnas_esperadas = {"Categoría Producto", "Ciudad"}
    faltantes = columnas_esperadas - set(df.columns)
    if faltantes:
        raise ValueError(f"El CSV de entrada no tiene las columnas esperadas: {faltantes}")

    os.makedirs(output_dir, exist_ok=True)
    total_archivos = 0

    for categoria, grupo_categoria in df.groupby("Categoría Producto"):
        carpeta_categoria = os.path.join(output_dir, slug(categoria))
        os.makedirs(carpeta_categoria, exist_ok=True)

        for ciudad, grupo_ciudad in grupo_categoria.groupby("Ciudad"):
            archivo = os.path.join(carpeta_categoria, f"{slug(ciudad)}.csv")
            grupo_ciudad.to_csv(archivo, index=False, encoding='utf-8-sig')
            total_archivos += 1

    print(f"✅ Segmentación completa: {total_archivos} archivos generados en '{output_dir}'.")


def main():
    parser = argparse.ArgumentParser(description="Segmenta el CSV maestro de leads por Categoría Producto y Ciudad.")
    parser.add_argument('--input', type=str, default="leads_priorizados_condimentos.csv", help="CSV maestro a segmentar.")
    parser.add_argument('--output-dir', type=str, default="LEADS_SEGMENTADOS", help="Carpeta destino de la segmentación.")
    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(f"❌ No existe el archivo {args.input}. Corré primero agente_prospeccion_condimentos.py")
        return

    segmentar(args.input, args.output_dir)


if __name__ == "__main__":
    main()
