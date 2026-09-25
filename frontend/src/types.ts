/**
 * Tipos del catálogo. Reflejan lo que hay en Supabase (tablas productos, categorias, configuracion, pedidos):
 * cada producto se vende en una o más "variantes" (unidad + precio, ej. KG / 500G / UNI) — no hay stock,
 * SKU ni formatos con descuento porque el negocio no los maneja.
 */

export interface Category {
  id: string;
  label: string;
}

export interface Variant {
  unit: string; // 'KG', '500G', 'UNI', ...
  price: number; // ARS por esa unidad — ya es el precio final (el de oferta si la variante está en oferta)
  listPrice?: number; // precio de lista, solo si la variante está en oferta (se muestra tachado)
  soldOut?: boolean; // marcada "sin stock" desde el panel
}

export interface Product {
  id: string; // slug estable: `${categoria_id}--${nombre}`
  title: string;
  categoryId: string;
  categoryLabel: string;
  description: string | null;
  images: string[]; // portada primero, después la galería
  variants: Variant[]; // siempre al menos una
  featured: boolean;
  onSale: boolean; // alguna variante tiene precio de oferta
  soldOut: boolean; // todas las variantes sin stock
}

/** Línea del carrito tal como se guarda (solo referencias, así los precios siempre salen del catálogo vigente). */
export interface CartLine {
  productId: string;
  unit: string;
  quantity: number;
}

export interface CartItem {
  key: string;
  product: Product;
  variant: Variant;
  quantity: number;
  subtotal: number;
}

export interface CheckoutForm {
  name: string;
  address: string;
  payment: string; // '' | 'Efectivo' | 'Transferencia' | 'A coordinar'
  schedule: string;
  note: string;
}

export interface StoreConfig {
  logoUrl: string | null;
  heroImageUrl: string | null;
  tagline: string | null;
}

// 'destacados' = ofertas + destacados (lo mismo que muestra el carrusel); 'ofertas' = solo ofertas
export type CategoryFilter = 'todos' | 'destacados' | 'ofertas' | string;

export type Route =
  | { view: 'inicio' }
  | { view: 'catalogo' }
  | { view: 'carrito' }
  | { view: 'ingresar' }
  | { view: 'cuenta' }
  | { view: 'producto'; productId: string };

export type AppView = Route['view'];

/** Resumen del último pedido enviado (guardado en el navegador) que todavía se puede repetir. */
export interface LastOrderInfo {
  count: number; // productos que siguen disponibles en el catálogo
  at: string; // ISO
}

/** Datos guardados del cliente (tabla `clientes`). */
export interface Profile {
  nombre: string;
  comercio: string;
  telefono: string;
  direccion: string;
}

/** Pedido tal como se guarda en Supabase (para "Mis pedidos"). */
export interface OrderRow {
  id: number;
  creado_en: string;
  estado: string | null;
  total: number;
  items: { nombre: string; unidad: string; precio: number; cantidad: number }[];
}
