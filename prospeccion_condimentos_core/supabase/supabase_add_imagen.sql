-- Agrega soporte de foto a cada producto (opcional: puede quedar vacía)
alter table productos add column if not exists imagen_url text;
