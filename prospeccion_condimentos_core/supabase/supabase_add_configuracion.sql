-- Los Turquitos — configuración general del negocio (por ahora: el logo de la marca que se
-- muestra en el catálogo). Fila única (id=1) que Karim edita desde la pestaña "Configuración"
-- del tablero (correr una sola vez en el SQL Editor).
create table if not exists configuracion (
  id int primary key default 1,
  logo_url text,
  updated_at timestamptz not null default now(),
  constraint configuracion_singleton check (id = 1)
);
insert into configuracion (id) values (1) on conflict (id) do nothing;

alter table configuracion enable row level security;

-- Lectura pública: el catálogo muestra el logo sin que el cliente esté logueado.
drop policy if exists "Cualquiera puede ver la configuración" on configuracion;
create policy "Cualquiera puede ver la configuración"
  on configuracion for select
  using (true);

-- Solo Karim (logueado) puede cambiar el logo desde el tablero.
drop policy if exists "Usuarios logueados pueden editar la configuración" on configuracion;
create policy "Usuarios logueados pueden editar la configuración"
  on configuracion for update
  to authenticated
  using (id = 1);

-- El logo se sube al mismo bucket de Storage que las fotos de producto (`productos`, creado en
-- supabase_add_storage_productos.sql) bajo la carpeta config/, así que no hace falta otro bucket.
