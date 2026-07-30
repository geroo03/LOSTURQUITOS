-- Los Turquitos — descripción editable de la portada del catálogo (correr una sola vez en el SQL Editor).
-- Mismo criterio que logo_url/fondo_url: fila única en `configuracion`, lectura pública, edición solo logueado.
alter table configuracion add column if not exists tagline text;
