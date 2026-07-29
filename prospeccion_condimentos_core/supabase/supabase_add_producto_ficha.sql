-- Los Turquitos — ficha de producto ampliada (correr una sola vez en el SQL Editor)
-- imagen_url (ya existente) sigue siendo la foto de portada que se ve en la grilla del catálogo;
-- estas columnas nuevas alimentan el modal de detalle ("ficha de producto").
alter table productos add column if not exists descripcion text;
alter table productos add column if not exists imagenes jsonb not null default '[]'::jsonb;

-- Nada de esto requiere tocar la RLS de `productos`: sigue siendo lectura pública
-- para activo = true y carga solo por service_role (script) o Table Editor, como ya estaba.
