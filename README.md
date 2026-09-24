# Los Turquitos

Catálogo mayorista de condimentos, frutos secos, especias y almacén de **Karim (Los Turquitos)**, más el sistema de prospección de clientes.

```
LOSTURQUITOS/
├── frontend/                   # Catálogo público (React + Vite + Tailwind) — se compila a deploy/tienda
├── referencia-figma/           # Diseño original de Figma (solo referencia, no se despliega)
├── prospeccion_condimentos_core/
│   ├── tienda/panel_tienda.html    # Panel de Karim: pedidos, productos, categorías, configuración
│   ├── scraping/                   # Prospección de leads + tablero de leads + bot de WhatsApp (Python)
│   ├── supabase/                   # SQL del esquema (correr en el SQL Editor de Supabase)
│   └── deploy/                     # Lo que se arrastra a Netlify Drop (tienda/ y scraping/)
└── netlify.toml                # Publica deploy/tienda
```

- **Datos:** Supabase (tablas `productos`, `categorias`, `configuracion`, `pedidos`, `leads` + Storage).
- **Pedidos:** el catálogo guarda el pedido en Supabase y abre WhatsApp con el mensaje armado.
- **Catálogo:** `cd frontend && npm install && npm run dev` (desarrollo) · `npm run build` (genera `deploy/tienda`).
- **Detalle de prospección, deploy y scripts:** [prospeccion_condimentos_core/README.md](prospeccion_condimentos_core/README.md).
