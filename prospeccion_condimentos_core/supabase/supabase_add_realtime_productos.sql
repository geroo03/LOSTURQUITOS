-- Los Turquitos — activa Realtime para `productos` (correr una sola vez en el SQL Editor).
-- `leads` y `pedidos` ya lo tienen activado (se hizo a mano desde el dashboard en su momento);
-- el tablero de Karim ya se suscribe a cambios en vivo de `productos`, pero sin esto la suscripción
-- no recibe nada (no da error, solo no empuja cambios en vivo entre pestañas/dispositivos abiertos
-- a la vez). No hace falta hacer lo mismo con `configuracion`: nada se suscribe a sus cambios.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'productos'
  ) then
    alter publication supabase_realtime add table productos;
  end if;
end $$;
