-- Los Turquitos — lista de precios minorista (correr una sola vez en el SQL Editor).
-- El precio minorista sale de un recargo general sobre el precio mayorista (configuracion.recargo_minorista, en %),
-- salvo en las variantes donde Karim cargue un precio propio (productos.precio_minorista). Con NULL se usa el recargo.
-- Las policies existentes de cada tabla cubren las columnas nuevas.
alter table configuracion add column if not exists recargo_minorista numeric(6,2) check (recargo_minorista is null or recargo_minorista >= 0);
alter table productos add column if not exists precio_minorista int check (precio_minorista is null or precio_minorista >= 0);
