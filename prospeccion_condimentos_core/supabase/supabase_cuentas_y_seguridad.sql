-- Los Turquitos — cuentas de cliente + separación administrador / cliente (correr UNA vez, entero, en el SQL Editor).
--
-- ⚠️ Correr esto ANTES de publicar el front con cuentas. Hasta ahora "usuario logueado" = Karim. Con registro
-- libre, cualquier cliente sería "usuario logueado", así que las reglas pasan a preguntar si el usuario es ADMIN.
-- Los usuarios que existen HOY en Authentication (Karim / vos) quedan como administradores.

-- 1) Administradores ------------------------------------------------------------------------------------------
create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  creado_en timestamptz not null default now()
);
alter table admins enable row level security;

insert into admins (user_id) select id from auth.users on conflict (user_id) do nothing;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "Cada usuario ve si es admin" on admins;
create policy "Cada usuario ve si es admin" on admins for select to authenticated using (user_id = auth.uid());
-- (sin policies de escritura: los admins se agregan solo desde el SQL Editor)

-- 2) Perfil de cliente ----------------------------------------------------------------------------------------
create table if not exists clientes (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  nombre text,
  comercio text,
  telefono text,
  direccion text,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);
alter table clientes enable row level security;

drop policy if exists "Cliente ve su perfil y admin ve todos" on clientes;
create policy "Cliente ve su perfil y admin ve todos" on clientes for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists "Cliente crea su perfil" on clientes;
create policy "Cliente crea su perfil" on clientes for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "Cliente edita su perfil" on clientes;
create policy "Cliente edita su perfil" on clientes for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Al registrarse alguien, se le crea el perfil solo (con los datos que mandó el formulario de registro).
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.clientes (user_id, email, nombre, comercio, telefono)
  values (new.id, new.email, new.raw_user_meta_data->>'nombre', new.raw_user_meta_data->>'comercio', new.raw_user_meta_data->>'telefono')
  on conflict (user_id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- 3) Pedidos y presupuestos: vínculos ---------------------------------------------------------------------------
alter table pedidos add column if not exists user_id uuid references auth.users(id) on delete set null default auth.uid();
alter table pedidos add column if not exists presupuesto_id bigint;  -- si el pedido salió de un presupuesto
alter table presupuestos add column if not exists pedido_id bigint;  -- si el presupuesto salió de un pedido, o ya se pasó a pedido

-- 4) Reglas de acceso: se rehacen todas con is_admin() ----------------------------------------------------------
-- Se borran las policies actuales de estas tablas (y las de fotos del bucket `productos`) y se crean de nuevo.
do $$
declare r record;
begin
  for r in
    select schemaname, tablename, policyname from pg_policies
    where (schemaname = 'public' and tablename in ('productos','categorias','configuracion','pedidos','presupuestos','leads'))
       or (schemaname = 'storage' and tablename = 'objects' and policyname like 'Fotos de productos%')
  loop
    execute format('drop policy if exists %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

-- Productos: el público ve solo los activos; el admin ve y edita todo
create policy "Publico ve productos activos" on productos for select using (activo = true);
create policy "Admin ve todos los productos" on productos for select to authenticated using (public.is_admin());
create policy "Admin crea productos" on productos for insert to authenticated with check (public.is_admin());
create policy "Admin edita productos" on productos for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admin borra productos" on productos for delete to authenticated using (public.is_admin());

-- Categorías
create policy "Publico ve categorias" on categorias for select using (true);
create policy "Admin crea categorias" on categorias for insert to authenticated with check (public.is_admin());
create policy "Admin edita categorias" on categorias for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admin borra categorias" on categorias for delete to authenticated using (public.is_admin());

-- Configuración (logo, fondo, texto de portada)
create policy "Publico ve configuracion" on configuracion for select using (true);
create policy "Admin edita configuracion" on configuracion for update to authenticated
  using (id = 1 and public.is_admin()) with check (id = 1 and public.is_admin());

-- Pedidos: cualquiera puede crear uno (con o sin cuenta); cada cliente ve los suyos; el admin ve y actualiza todos
create policy "Cualquiera crea pedidos" on pedidos for insert to anon, authenticated
  with check (user_id is null or user_id = auth.uid());
create policy "Cliente ve sus pedidos y admin ve todos" on pedidos for select to authenticated
  using (public.is_admin() or user_id = auth.uid());
create policy "Admin actualiza pedidos" on pedidos for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admin borra pedidos" on pedidos for delete to authenticated using (public.is_admin());

-- Presupuestos: solo admin
create policy "Admin administra presupuestos" on presupuestos for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Leads (tablero de prospección): solo admin
create policy "Admin ve leads" on leads for select to authenticated using (public.is_admin());
create policy "Admin actualiza leads" on leads for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Fotos de productos (Storage): lectura pública, escritura solo admin
create policy "Fotos de productos: lectura pública" on storage.objects for select using (bucket_id = 'productos');
create policy "Fotos de productos: admin sube" on storage.objects for insert to authenticated
  with check (bucket_id = 'productos' and public.is_admin());
create policy "Fotos de productos: admin actualiza" on storage.objects for update to authenticated
  using (bucket_id = 'productos' and public.is_admin());
create policy "Fotos de productos: admin borra" on storage.objects for delete to authenticated
  using (bucket_id = 'productos' and public.is_admin());

-- 5) Verificación (tiene que listar a Karim en admins) --------------------------------------------------------
select u.email, (a.user_id is not null) as es_admin
from auth.users u left join admins a on a.user_id = u.id
order by u.created_at;
