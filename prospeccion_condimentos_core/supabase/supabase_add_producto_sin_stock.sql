-- Los Turquitos — marca "sin stock" por producto (correr una sola vez en el SQL Editor).
-- Un producto sin stock sigue visible en el catálogo, pero no se puede agregar al pedido
-- (el cliente ve "Avisarme" y le escribe a Karim). Cada fila de `productos` es una presentación (KG, 500G...).
alter table productos add column if not exists sin_stock boolean not null default false;
