-- Los Turquitos — checkout completo + seguimiento de pedidos (correr una sola vez en el SQL Editor)
-- Datos de entrega/pago que ahora pide el carrito del catálogo, más un estado para que
-- Karim pueda hacer seguimiento de cada pedido desde el tablero (pestaña "Pedidos").
alter table pedidos add column if not exists direccion text;
alter table pedidos add column if not exists metodo_pago text;
alter table pedidos add column if not exists horario_entrega text;
alter table pedidos add column if not exists estado text not null default 'pendiente'
  check (estado in ('pendiente','confirmado','entregado','cancelado'));

-- Hasta ahora `pedidos` solo tenía policy de insert (público) y select (logueado).
-- Karim necesita además poder cambiar el estado del pedido desde el tablero.
drop policy if exists "Solo usuarios logueados pueden actualizar pedidos" on pedidos;
create policy "Solo usuarios logueados pueden actualizar pedidos"
  on pedidos for update
  using (auth.role() = 'authenticated');
