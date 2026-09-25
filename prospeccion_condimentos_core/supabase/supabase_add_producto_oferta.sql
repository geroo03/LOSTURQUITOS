-- Los Turquitos — precio de oferta por producto (correr una sola vez en el SQL Editor).
-- Cada fila de `productos` es una variante (unidad + precio). Si `precio_oferta` tiene valor (y es menor a `precio`),
-- el catálogo muestra el precio de lista tachado, el de oferta destacado, y el producto entra al carrusel de
-- "Ofertas y destacados". Con NULL el producto no está en oferta. Las policies existentes cubren la columna nueva.
alter table productos add column if not exists precio_oferta int check (precio_oferta is null or precio_oferta >= 0);
