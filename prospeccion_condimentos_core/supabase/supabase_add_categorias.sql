-- Los Turquitos — tabla de categorías editable desde el panel (correr una sola vez en el SQL Editor).
-- Reemplaza la lista fija que antes vivía hardcodeada en el HTML del catálogo y del panel:
-- ahora Karim puede agregar, renombrar, reordenar y borrar categorías desde la pestaña "Categorías".
create table if not exists categorias (
  id text primary key,
  label text not null,
  orden int not null default 0,
  created_at timestamptz not null default now()
);

-- Semilla con las 11 categorías que ya estaban hardcodeadas, en el mismo orden, para no perder nada.
insert into categorias (id, label, orden) values
  ('alicante',      'Condimentos Alicante',    1),
  ('especial',      'Condimentos Especial',    2),
  ('frutos-secos',  'Frutos Secos',            3),
  ('snacks',        'Snacks',                  4),
  ('frutas-secas',  'Frutas Secas',            5),
  ('reposteria',    'Repostería',              6),
  ('semillas',      'Semillas',                7),
  ('preparados',    'Preparados para Carne',   8),
  ('especias',      'Especias y Hierbas',      9),
  ('aceitunas',     'Aceitunas y Encurtidos', 10),
  ('harinas',       'Harinas Saludables',     11)
on conflict (id) do nothing;

alter table categorias enable row level security;

-- El catálogo público necesita leerlas para armar las secciones y el menú de categorías.
drop policy if exists "Cualquiera puede ver categorías" on categorias;
create policy "Cualquiera puede ver categorías"
  on categorias for select
  using (true);

drop policy if exists "Usuarios logueados pueden crear categorías" on categorias;
create policy "Usuarios logueados pueden crear categorías"
  on categorias for insert
  to authenticated
  with check (true);

drop policy if exists "Usuarios logueados pueden editar categorías" on categorias;
create policy "Usuarios logueados pueden editar categorías"
  on categorias for update
  to authenticated
  using (true);

drop policy if exists "Usuarios logueados pueden borrar categorías" on categorias;
create policy "Usuarios logueados pueden borrar categorías"
  on categorias for delete
  to authenticated
  using (true);
