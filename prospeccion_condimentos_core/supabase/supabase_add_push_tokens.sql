-- Los Turquitos — tokens de notificaciones push del panel (correr una sola vez en el SQL Editor).
-- Requiere haber corrido antes supabase_cuentas_y_seguridad.sql (usa is_admin()).
-- Cada fila es un dispositivo/navegador donde un administrador activó "Notificarme pedidos nuevos"
-- en el panel. Guarda el token de Firebase Cloud Messaging para poder mandarle un push más adelante
-- (por ejemplo desde una Edge Function que escuche los INSERT de `pedidos`).
create table if not exists push_tokens (
  token text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  creado_en timestamptz not null default now(),
  ultimo_uso timestamptz not null default now()
);
alter table push_tokens enable row level security;

drop policy if exists "Admin administra sus tokens de push" on push_tokens;
create policy "Admin administra sus tokens de push" on push_tokens for all to authenticated
  using (public.is_admin() and user_id = auth.uid())
  with check (public.is_admin() and user_id = auth.uid());
