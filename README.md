# auditoria_y_prospeccion_core — Resumen técnico

Documentación de lo relevado en `ai/auditoria_y_prospeccion_core/`. Sirve como referencia rápida para retomar o replicar este flujo.

> Réplica de la arquitectura de este pipeline (scraper → CSV → segmentación → WhatsApp), adaptada para vender los productos de **Karim (Los Turquitos)** — condimentos, frutos secos, especias, aceitunas, etc. — a dietéticas y distribuidoras a nivel país. No tiene relación con ÆON. Ver [prospeccion_condimentos_core/README.md](prospeccion_condimentos_core/README.md).

## Objetivo del sistema

Pipeline de **prospección + outreach automatizado por WhatsApp** para vender automatización (catálogos/pedidos por WhatsApp) a comercios de Córdoba Capital, bajo la marca ÆON, usando "Fabricio" como persona de ventas en los mensajes.

Flujo end-to-end: **buscar negocios (Serper/Google Places) → auditar y priorizar → segmentar por rubro/zona → generar mensaje personalizado con IA → enviar por WhatsApp Web con controles anti-ban.**

## Estructura de la carpeta

```
auditoria_y_prospeccion_core/
├── agente_prospeccion.py              # Scraper + scoring de leads
├── whatsapp_api_bot.py                # Generador de mensajes IA + envío WhatsApp Web
├── leads_priorizados_MASTER.csv       # 392 leads consolidados (salida del agente)
├── minimarkets_10_to_send.csv         # Subset de prueba (10 minimarkets)
├── minimarkets_additional_messages.csv# Mensajes ya generados para ese subset
└── LEADS_SEGMENTADOS/                 # Leads organizados en subcarpetas por Rubro/Zona
    ├── Gastronomía/{Centro,Córdoba_Capital,Güemes}.csv
    ├── Minimarkets/...
    ├── Clínicas/...
    └── ... (18 rubros en total)
```

## 1. `agente_prospeccion.py` — auditoría/scraping de leads

- Clase `AgenteAuditorCBA`.
- Fuente de datos: **Serper API** (`https://google.serper.dev/places`), key hardcodeada en el código (línea 12) — **riesgo de seguridad**, debería moverse a variable de entorno (mismo patrón que se aplicó en el proyecto `puertaapuerta-main` para las keys de Supabase).
- Itera **18 rubros** (`Gastronomía, Minimarkets, Distribuidoras, Químicas, Inmobiliarias, Logística, Educación, Clínicas, Gimnasios, Estéticas, Ferreterías, Indumentaria, Peluquerías, Estudios Contables, Estudios Jurídicos, Mecánicos, Odontología, Pet Shops`) × **4 zonas** (`Nueva Córdoba, Güemes, General Paz, Centro`), tope `MAX_LEADS = 500`.
- Por cada negocio (`analizar_comercio`):
  - Detecta si tiene web propia válida (excluye `negocio.site`, facebook, instagram como "web real").
  - `Score`: 100 si NO tiene web, 40 si tiene web; +10 si rating < 4.0 con reseñas.
  - `Prioridad`: `CRÍTICA` (sin web) o `BAJA` (con web).
  - Genera `Diagnóstico` (texto sobre falta de digitalización / bajo rating) y `Hook de Venta` (mensaje de apertura personalizado con el nombre del barrio).
  - Extrae barrio desde la dirección con matching de substrings (`BARRIOS_TARGET`).
- `exportar_leads()`: arma un DataFrame, ordena por Score desc, dedupe por `Empresa`, exporta a `leads_priorizados_nvcba.csv`.
- Es un script standalone (`ejectuar_extraccion()` al final), corre con `time.sleep(1.5)` entre queries para no saturar la API.

## 2. `LEADS_SEGMENTADOS/`

Los mismos leads pre-clasificados en subcarpetas por rubro → archivo por zona. **No existe en la carpeta el script que genera esta segmentación** a partir del master CSV — se hizo con otro proceso (manual o script externo no presente). Total ≈ 400 filas repartidas de forma muy despareja (algunas combinaciones rubro/zona tienen 2 filas, otras hasta 39).

## 3. `leads_priorizados_MASTER.csv`

Columnas: `Empresa, Rubro, Dirección, Teléfono, Prioridad, Score, Barrio, Web Actual, Diagnóstico, Hook de Venta`. 392 leads, es la salida consolidada del agente de prospección (fuente de verdad antes de segmentar).

## 4. `minimarkets_10_to_send.csv` / `minimarkets_additional_messages.csv`

Subconjuntos chicos usados para probar la campaña de envío antes de escalar (10 minimarkets con teléfono ya normalizado a `+549...`; el segundo archivo trae mensajes (`ai_message`) ya generados para ese mismo subset, formato más liviano: `Empresa, Rubro, Teléfono, Prioridad, ai_message`).

## 5. `whatsapp_api_bot.py` — generación de mensaje + envío

**Tarea 1 — Lectura/validación de contactos** (`fetch_and_validate_contacts`)
- Soporta CSV o JSON.
- Busca nombre/teléfono en varias columnas posibles (compatibilidad con distintos formatos de CSV usados en el proyecto).
- `normalize_phone`: normaliza a E.164 argentino con prefijo `+549`.
- Descarta contactos con email en vez de teléfono.

**Tarea 2 — Generación de mensaje con IA** (`generate_ai_message`)
- Usa **Groq** (`llama-3.1-8b-instant`) vía `groq` SDK, key leída con `python-decouple` (`GROQ_API_KEY`, no hardcodeada — bien).
- Si no hay `GROQ_API_KEY` configurada, cae a `generate_local_message` (plantilla fija en Python, sin IA), garantizando que el script nunca se rompe por falta de key.
- Prompt define persona "Fabricio" de ÆON, estructura fija: saludo + gancho (pain point) + solución + metodología (3 hitos: Plan/Prueba/Entrega) + CTA. Prohíbe jerga técnica y placeholders sin rellenar.
- Reintentos con `tenacity` (`retry`, backoff exponencial, 3 intentos).

**Tarea 3 — Envío** (`send_whatsapp_web`)
- **No usa la API oficial de Meta/WhatsApp Business.** Abre `web.whatsapp.com/send?phone=...&text=...` en el navegador y usa `pyautogui` para clickear el centro de la pantalla y simular `Enter` para enviar. Requiere sesión de WhatsApp Web ya logueada y que el navegador quede en foco (riesgo de fallo si el usuario toca el mouse/teclado durante el envío).

**Tarea 4 — Orquestador** (`main`, CLI con `argparse`)
- Flags: `--file` (requerido), `--dry-run`, `--start N`.
- Filtra por rubro no objetivo (jurídico, gimnasios) aunque estén en el CSV de entrada — filtro hardcodeado por texto (`skip_terms`).
- Log persistente `send_log.json` (no existe todavía en disco) para no reenviar a quien ya recibió mensaje exitosamente.
- Controles anti-ban:
  - Límite duro de **50 envíos** por corrida (`LIMITE_DE_ENVIOS`).
  - Tandas de **25 envíos** (`LIMITE_TANDA`) con descanso random de 5–10 min entre tandas.
  - Pausa random de 20–45s entre cada envío individual.
- Al final imprime reporte: enviados, fallidos, saltados, pendientes (dry-run).

## Puntos a tener en cuenta / posibles mejoras

1. **`SERPER_API_KEY` hardcodeada** en `agente_prospeccion.py` — mover a `.env` + `python-decouple` (mismo patrón ya usado en `whatsapp_api_bot.py` para Groq).
2. El envío por `pyautogui` sobre WhatsApp Web es frágil (depende del foco de ventana, resolución de pantalla, que no haya popups) y no oficial — riesgo de baneo de número si Meta detecta patrón de bot, pese a las pausas.
3. No hay script visible que genere `LEADS_SEGMENTADOS/` desde el master — si se necesita regenerar, hay que reconstruirlo o documentar cómo se hizo.
4. No hay `requirements.txt` dentro de la carpeta — dependencias detectadas por imports: `pandas`, `pyautogui`, `groq`, `python-decouple`, `tenacity`.
