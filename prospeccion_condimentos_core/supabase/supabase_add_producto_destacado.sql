-- Los Turquitos — marca de "destacado" para el carrusel del catálogo (correr una sola vez en el SQL Editor).
-- Karim elige qué productos aparecen en el carrusel desde el panel de administración (pestaña Productos);
-- las policies de escritura/lectura ya existentes en `productos` cubren esta columna nueva sin cambios.
alter table productos add column if not exists destacado boolean not null default false;
