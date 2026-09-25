import { createClient } from '@supabase/supabase-js';
import { CartItem, Category, CheckoutForm, Product, StoreConfig } from '../types';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './config';

export const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface ProductoRow {
  id: number;
  categoria_id: string;
  categoria_label: string;
  nombre: string;
  unidad: string;
  precio: number;
  imagen_url: string | null;
  descripcion: string | null;
  imagenes: string[] | null;
  destacado: boolean | null;
  precio_oferta?: number | null;
}

const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export interface StoreData {
  categories: Category[];
  products: Product[];
  config: StoreConfig;
}

export async function loadStore(): Promise<StoreData> {
  const COLS = 'id, categoria_id, categoria_label, nombre, unidad, precio, imagen_url, descripcion, imagenes, destacado';
  const fetchProductos = (cols: string) =>
    sb.from('productos').select(cols).eq('activo', true).order('id', { ascending: true });

  const [cats, prodsWithOffer, conf] = await Promise.all([
    sb.from('categorias').select('id, label').order('orden', { ascending: true }),
    fetchProductos(`${COLS}, precio_oferta`),
    sb.from('configuracion').select('logo_url, fondo_url, tagline').eq('id', 1).maybeSingle(),
  ]);
  // Si todavía no se corrió supabase_add_producto_oferta.sql, la columna no existe: el catálogo sigue andando sin ofertas.
  const prods = prodsWithOffer.error ? await fetchProductos(COLS) : prodsWithOffer;

  if (cats.error) throw new Error(cats.error.message);
  if (prods.error) throw new Error(prods.error.message);

  // La configuración es opcional: si falla, el sitio se ve igual con los valores por defecto.
  const config: StoreConfig = {
    logoUrl: conf.data?.logo_url ?? null,
    heroImageUrl: conf.data?.fondo_url ?? null,
    tagline: conf.data?.tagline ?? null,
  };

  // Las filas de `productos` son planas (una por variante); acá se agrupan por (categoría, nombre).
  const byKey = new Map<string, Product>();
  (prods.data as unknown as ProductoRow[]).forEach((row) => {
    const id = `${row.categoria_id}--${slugify(row.nombre)}`;
    let p = byKey.get(id);
    if (!p) {
      p = {
        id,
        title: row.nombre,
        categoryId: row.categoria_id,
        categoryLabel: row.categoria_label,
        description: null,
        images: [],
        variants: [],
        featured: false,
        onSale: false,
      };
      byKey.set(id, p);
    }
    const offer = row.precio_oferta;
    const onOffer = offer != null && offer < row.precio;
    p.variants.push(onOffer ? { unit: row.unidad, price: offer, listPrice: row.precio } : { unit: row.unidad, price: row.precio });
    if (onOffer) p.onSale = true;
    if (row.descripcion) p.description = row.descripcion;
    if (row.destacado) p.featured = true;
    [row.imagen_url, ...(row.imagenes ?? [])].forEach((url) => {
      if (url && !p!.images.includes(url)) p!.images.push(url);
    });
  });

  // Solo aparecen categorías que existen en la tabla `categorias`, en el orden que definió Karim.
  const categories = cats.data as Category[];
  const order = new Map(categories.map((c, i) => [c.id, i]));
  const products = Array.from(byKey.values())
    .filter((p) => order.has(p.categoryId))
    .sort((a, b) => order.get(a.categoryId)! - order.get(b.categoryId)!);

  return {
    categories: categories.filter((c) => products.some((p) => p.categoryId === c.id)),
    products,
    config,
  };
}

/** Best-effort: si falla (sin internet, etc.) el pedido igual se manda por WhatsApp. */
export function savePedido(items: CartItem[], form: CheckoutForm, total: number) {
  sb.from('pedidos')
    .insert({
      cliente_nombre: form.name || null,
      direccion: form.address || null,
      metodo_pago: form.payment || null,
      horario_entrega: form.schedule || null,
      nota: form.note || null,
      items: items.map((i) => ({
        nombre: i.product.title,
        unidad: i.variant.unit,
        precio: i.variant.price,
        cantidad: i.quantity,
      })),
      total,
      estado: 'pendiente',
    })
    .then(({ error }) => {
      if (error) console.error('No se pudo guardar el pedido en Supabase:', error.message);
    });
}
