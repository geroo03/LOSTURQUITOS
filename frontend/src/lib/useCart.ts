import { useCallback, useEffect, useMemo, useState } from 'react';
import { CartItem, CartLine, Product } from '../types';

const STORAGE_KEY = 'losturquitos-cart-v1';

function readStored(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Carrito guardado en localStorage como referencias (productId + unidad + cantidad).
 * Los precios y nombres se resuelven contra el catálogo vigente, y las líneas de productos
 * que ya no existen se descartan solas.
 */
export function useCart(products: Product[]) {
  const [lines, setLines] = useState<CartLine[]>(readStored);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* modo privado / storage bloqueado: el carrito sigue funcionando en memoria */
    }
  }, [lines]);

  const items: CartItem[] = useMemo(() => {
    const byId = new Map(products.map((p) => [p.id, p]));
    const out: CartItem[] = [];
    lines.forEach((l) => {
      const product = byId.get(l.productId);
      const variant = product?.variants.find((v) => v.unit === l.unit);
      if (!product || !variant || variant.soldOut) return;
      out.push({
        key: `${l.productId}|${l.unit}`,
        product,
        variant,
        quantity: l.quantity,
        subtotal: variant.price * l.quantity,
      });
    });
    return out;
  }, [lines, products]);

  const count = items.reduce((n, i) => n + i.quantity, 0);
  const total = items.reduce((n, i) => n + i.subtotal, 0);

  const add = useCallback((productId: string, unit: string, quantity: number) => {
    setLines((prev) => {
      const idx = prev.findIndex((l) => l.productId === productId && l.unit === unit);
      if (idx === -1) return [...prev, { productId, unit, quantity }];
      const next = [...prev];
      next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
      return next;
    });
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setLines((prev) =>
      prev
        .map((l) => (`${l.productId}|${l.unit}` === key ? { ...l, quantity } : l))
        .filter((l) => l.quantity > 0),
    );
  }, []);

  const remove = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => `${l.productId}|${l.unit}` !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  return { items, count, total, add, setQuantity, remove, clear };
}
