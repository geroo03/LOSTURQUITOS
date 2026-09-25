import { useCallback, useEffect, useState } from 'react';
import { Route } from '../types';

function parse(hash: string): Route {
  const [, view, id] = hash.replace(/^#/, '').split('/');
  if (view === 'catalogo') return { view: 'catalogo' };
  if (view === 'carrito') return { view: 'carrito' };
  if (view === 'ingresar') return { view: 'ingresar' };
  if (view === 'cuenta') return { view: 'cuenta' };
  if (view === 'producto' && id) return { view: 'producto', productId: decodeURIComponent(id) };
  return { view: 'inicio' };
}

export const routeHref = (r: Route) =>
  r.view === 'inicio' ? '#/' : r.view === 'producto' ? `#/producto/${encodeURIComponent(r.productId)}` : `#/${r.view}`;

/** Ruteo por hash (#/catalogo, #/producto/<id>, #/carrito): funciona en Netlify sin reglas de redirect y anda el botón "atrás". */
export function useRoute() {
  const [route, setRoute] = useState<Route>(() => parse(window.location.hash));

  useEffect(() => {
    const onChange = () => {
      setRoute(parse(window.location.hash));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((r: Route) => {
    window.location.hash = routeHref(r);
  }, []);

  return { route, navigate };
}
