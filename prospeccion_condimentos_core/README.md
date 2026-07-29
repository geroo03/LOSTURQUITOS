# prospeccion_condimentos_core

Pipeline de prospección de **clientes B2B para Karim (Los Turquitos)** — venta mayorista de condimentos, frutos secos, especias, aceitunas, pickles, snacks, frutas secas, repostería y semillas. **No tiene relación con ÆON ni con venta de automatización**: acá el objetivo es encontrar negocios que le puedan **comprar** productos a Karim, y ofrecerles la lista de precios (junio 2026).

Reutiliza la arquitectura de `auditoria_y_prospeccion_core` (ver [../README.md](../README.md): scraper → CSV → segmentación → envío por WhatsApp) pero con scoring y mensajes de venta de productos, no de digitalización.

## Qué busca

Dos tipos de negocio, combinados:

- **Minoristas**: dietéticas, casas de especias, almacenes naturistas, tiendas a granel — comprarían variedad de estos productos para revender.
- **Mayoristas/productores**: distribuidoras, mayoristas, fábricas y productoras — potenciales compradores de mayor volumen, suelen especializarse por producto (ej. "distribuidora de frutos secos"), por eso se generan queries cruzando cada una de las 11 categorías de producto con 4 plantillas de negocio mayorista.

Zona: 26 ciudades de Argentina (capitales de provincia + polos comerciales) definidas en `CIUDADES` dentro de `scraping/agente_prospeccion_condimentos.py`, cada una con su provincia — se puede acotar la corrida a una o varias provincias con `--provincias` (ver `--listar-provincias` para las opciones disponibles).

## Estructura de carpetas

```
prospeccion_condimentos_core/
├── supabase/     # esquema de la base — correr cada .sql una sola vez en el SQL Editor, en este orden:
│                 #   supabase_setup*.sql (tablas base) → supabase_add_*.sql (columnas/policies agregadas después)
├── scraping/     # prospección de leads + outreach por WhatsApp, más su panel de leads
│   ├── agente_prospeccion_condimentos.py, segmentar_leads.py, whatsapp_api_bot.py, etc.
│   ├── tablero_leads.html            # panel de leads (kanban + mensaje editable por WhatsApp)
│   └── LEADS_SEGMENTADOS/
├── tienda/       # catálogo público + su panel de administración
│   ├── catalogo_los_turquitos.html   # catálogo público
│   └── panel_tienda.html             # panel de Karim: Pedidos, Productos, Configuración (logo)
└── deploy/       # tres carpetas, cada una para su sitio de Netlify ya existente (deployados por Netlify Drop)
    ├── tienda/
    │   ├── index.html   # copia de tienda/catalogo_los_turquitos.html   → sitio Netlify "losturquitos"
    │   └── admin.html   # copia de tienda/panel_tienda.html             → mismo sitio, en /admin.html
    └── scraping/index.html   # copia de scraping/tablero_leads.html     → sitio Netlify "pospreccion-losturquitos"
```

Hay dos paneles de administración separados, cada uno pensado para el dominio al que pertenece:

- **`tienda/panel_tienda.html`** — Pedidos, Productos y Configuración (logo). Vive en el mismo sitio Netlify que el catálogo (`losturquitos.netlify.app/admin.html`), porque administra justamente lo que se ve en ese catálogo.
- **`scraping/tablero_leads.html`** — el tablero de leads (kanban por estado, con el mensaje de WhatsApp editable antes de enviar). Vive en el sitio separado **pospreccion-losturquitos**, porque es prospección, no la tienda.

Los archivos en `deploy/` son copias exactas de sus fuentes — cualquier cambio en `tienda/catalogo_los_turquitos.html`, `tienda/panel_tienda.html` o `scraping/tablero_leads.html` hay que copiarlo también a su archivo correspondiente en `deploy/` antes de subir. Netlify Drop no sigue una carpeta local automáticamente: para redeployar hay que arrastrar el contenido de `deploy/tienda/` al sitio **losturquitos** y el de `deploy/scraping/` al sitio **pospreccion-losturquitos**, cada uno por separado, desde el dashboard de Netlify (drag & drop sobre el sitio ya existente, no crear uno nuevo).

## Archivos

- `scraping/agente_prospeccion_condimentos.py` — scraper vía Serper API (Google Places) + scoring + export a CSV.
  - `CATALOGO`: muestra de productos y precios por categoría (tomada de la lista de precios "Los Turquitos" junio 2026), usada para armar el gancho de venta con productos y precios reales en vez de un pitch genérico.
  - Scoring pensado en **potencial de compra**, no en digitalización: base 50, +30 si es Mayorista (compra recurrente en volumen), +20/+10 según cantidad de reseñas en Google (proxy de tamaño/movimiento del local). `Prioridad`: ALTA ≥90, MEDIA ≥60, BAJA el resto.
  - `Hook de Venta` ofrece 2 productos de muestra de la categoría de ese lead con precio, e invita a pedir la lista completa.
- `scraping/segmentar_leads.py` — parte el CSV maestro en `LEADS_SEGMENTADOS/{Categoría}/{Ciudad}.csv`.
- `scraping/whatsapp_api_bot.py` — copia del bot original de envío (WhatsApp Web + pyautogui, sin API oficial de Meta), reescrito para vender productos de Karim en vez del pitch de automatización de ÆON:
  - `generate_ai_message` / `generate_local_message`: el prompt de Groq y el fallback local ahora presentan al vendedor como representante de **Karim (Los Turquitos)** y ofrecen productos/precios, con prohibición explícita de mencionar automatización o software.
  - Reconoce las columnas de este CSV (`Empresa`/`Teléfono` para nombre/teléfono; `Diagnóstico`/`Hook de Venta`/`Categoría Producto` como fuente de contexto para la IA) — el bot original solo reconocía columnas como `Nombre del Negocio` o `Pain_Point`, que no existen en ningún CSV real del proyecto; sin este fix habría descartado todos los leads en silencio.
  - Se sacó el filtro de rubros "no objetivo" (jurídico/gimnasios) que era específico del negocio de ÆON y no aplica acá.
- `scraping/tablero_leads.html` — panel de leads de Karim (login con Supabase Auth): kanban por estado (arrastrar para cambiar), y por cada lead un mensaje de WhatsApp editable (precargado con el "Hook de Venta", con botón para restablecerlo) antes de copiarlo o abrirlo en WhatsApp.
- `tienda/catalogo_los_turquitos.html` — catálogo público: búsqueda, categorías, ficha de producto (modal con galería y descripción), carrito y checkout (dirección, método de pago, horario) por WhatsApp + registro en Supabase.
- `tienda/panel_tienda.html` — panel de administración de la tienda (login con Supabase Auth): pestañas Pedidos (con estado y descarga de PDF), Productos (alta/baja/edición + subida de fotos) y Configuración (logo del negocio).

## ⚠️ Costo de la API antes de correr en serio

Con las 26 ciudades y las 48 queries (4 minoristas + 11 productos × 4 plantillas mayoristas) esto son **1248 llamadas** a Serper en una corrida completa. Antes de lanzarlo entero:

```bash
cd scraping
python agente_prospeccion_condimentos.py --dry-count
```

Esto solo imprime el conteo, no llama a la API. Para probar en chico primero:

```bash
python agente_prospeccion_condimentos.py --limit-ciudades 3 --max-por-ciudad 10 --max-total 50
```

## Uso típico

```bash
cd scraping

# 1. Prospección (usa SERPER_API_KEY del .env en ai/.env)
python agente_prospeccion_condimentos.py --out leads_karim.csv

# 2. Segmentar por categoría/ciudad
python segmentar_leads.py --input leads_karim.csv

# 3. Generar y enviar mensajes (dry-run primero)
python whatsapp_api_bot.py --file leads_karim.csv --dry-run
python whatsapp_api_bot.py --file leads_karim.csv
```

Todos los scripts usan `python-decouple` para leer `SERPER_API_KEY` y `GROQ_API_KEY` desde `ai/.env` — no hay keys hardcodeadas en el código (a diferencia del script original, donde `SERPER_API_KEY` estaba hardcodeada).

## Flags disponibles en `scraping/agente_prospeccion_condimentos.py`

| Flag | Descripción |
|---|---|
| `--ciudades "Córdoba, Argentina,Rosario, Argentina"` | Lista de ciudades a usar en vez de las 26 por defecto (tiene prioridad sobre `--provincias`) |
| `--provincias "Córdoba,Santa Fe"` | Filtra las 26 ciudades por provincia. Ver `--listar-provincias` para los nombres exactos |
| `--listar-provincias` | Imprime las provincias disponibles y cuántas ciudades tiene cada una, no llama a la API |
| `--limit-ciudades N` | Usa solo las primeras N ciudades de la lista ya filtrada |
| `--max-por-ciudad N` | Tope de leads por ciudad (default 40) |
| `--max-total N` | Tope total de leads (default 3000) |
| `--solo-minoristas` | No busca mayoristas/distribuidoras |
| `--solo-mayoristas` | No busca dietéticas/casas de especias |
| `--out archivo.csv` | Nombre del CSV de salida (default `leads_karim.csv`) |
| `--dry-count` | Solo cuenta consultas, no llama a la API |

## Columnas del CSV de salida

`Empresa, Tipo Negocio (Minorista/Mayorista), Categoría Producto, Ciudad, Dirección, Teléfono, Prioridad, Score, Web Actual, Diagnóstico, Hook de Venta`

## Validado

Se corrió un smoke test real (1 ciudad, tope 5) contra la API de Serper y contra `segmentar_leads.py` — ambos scripts funcionan de punta a punta y el `Hook de Venta` generado ofrece productos y precios reales de la lista de Karim. También se instaló `pandas` en `ai/.venv` (faltaba, y es requerido tanto por este script como por el original `agente_prospeccion.py`).
