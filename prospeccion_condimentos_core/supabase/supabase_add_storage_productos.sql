-- Los Turquitos — bucket de Storage para las fotos de productos que se suben desde el panel de
-- administración (correr una sola vez en el SQL Editor).
insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;

-- Lectura pública: el catálogo y la ficha de producto muestran las fotos sin que el cliente esté logueado.
drop policy if exists "Fotos de productos: lectura pública" on storage.objects;
create policy "Fotos de productos: lectura pública"
  on storage.objects for select
  using (bucket_id = 'productos');

-- Solo Karim (logueado) puede subir, reemplazar o borrar fotos desde el panel de administración.
drop policy if exists "Fotos de productos: solo usuarios logueados suben" on storage.objects;
create policy "Fotos de productos: solo usuarios logueados suben"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'productos');

drop policy if exists "Fotos de productos: solo usuarios logueados actualizan" on storage.objects;
create policy "Fotos de productos: solo usuarios logueados actualizan"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'productos');

drop policy if exists "Fotos de productos: solo usuarios logueados borran" on storage.objects;
create policy "Fotos de productos: solo usuarios logueados borran"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'productos');
