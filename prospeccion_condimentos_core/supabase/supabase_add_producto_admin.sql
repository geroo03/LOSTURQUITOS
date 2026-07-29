-- Los Turquitos — permite administrar productos desde el panel de Karim (tablero), estando logueado
-- (correr una sola vez en el SQL Editor).
-- Hasta ahora `productos` solo se cargaba con la service_role key (migrate_productos_to_supabase.py)
-- o a mano en el Table Editor. El panel de administración usa la misma sesión logueada (Supabase
-- Auth) que ya usa el tablero para leads/pedidos, así que necesita sus propias policies de escritura.

-- La policy pública de select ("activo = true") no le sirve a Karim para administrar: no vería
-- los productos dados de baja. Esta policy adicional le da visibilidad completa estando logueado.
drop policy if exists "Usuarios logueados pueden ver todos los productos" on productos;
create policy "Usuarios logueados pueden ver todos los productos"
  on productos for select
  to authenticated
  using (true);

drop policy if exists "Usuarios logueados pueden crear productos" on productos;
create policy "Usuarios logueados pueden crear productos"
  on productos for insert
  to authenticated
  with check (true);

drop policy if exists "Usuarios logueados pueden editar productos" on productos;
create policy "Usuarios logueados pueden editar productos"
  on productos for update
  to authenticated
  using (true);

drop policy if exists "Usuarios logueados pueden borrar productos" on productos;
create policy "Usuarios logueados pueden borrar productos"
  on productos for delete
  to authenticated
  using (true);
