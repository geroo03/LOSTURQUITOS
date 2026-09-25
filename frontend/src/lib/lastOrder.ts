import { CartLine } from '../types';

const KEY = 'losturquitos-last-order-v1';

export interface LastOrder {
  lines: CartLine[];
  at: string; // ISO
}

export function loadLastOrder(): LastOrder | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.lines) && parsed.lines.length ? parsed : null;
  } catch {
    return null;
  }
}

export function saveLastOrder(lines: CartLine[]): LastOrder {
  const order: LastOrder = { lines, at: new Date().toISOString() };
  try {
    localStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    /* storage bloqueado: solo se pierde la función "repetir pedido" */
  }
  return order;
}
