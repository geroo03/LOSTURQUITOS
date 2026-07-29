-- Los Turquitos — imagen de fondo del hero del catálogo (correr una sola vez en el SQL Editor).
-- Mismo criterio que logo_url: fila única en `configuracion`, lectura pública, edición solo logueado
-- (las policies de esa tabla ya cubren cualquier columna nueva, no hace falta tocarlas).
alter table configuracion add column if not exists fondo_url text;
