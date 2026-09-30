import { useEffect, useRef } from 'react';
import { AppView, Route } from '../types';
import { waLink } from '../lib/config';

interface Props {
  activeView: AppView;
  offersActive: boolean; // en el catálogo con el filtro "Ofertas y destacados"
  onNavigate: (route: Route) => void;
  onOpenFeatured: () => void;
  showAccount: boolean;
}

type Tab = 'inicio' | 'catalogo' | 'ofertas' | 'cuenta' | 'karim';

export function MobileBottomNav({ activeView, offersActive, onNavigate, onOpenFeatured, showAccount }: Props) {
  const tabs: Tab[] = ['inicio', 'catalogo', 'ofertas', ...(showAccount ? (['cuenta'] as Tab[]) : []), 'karim'];
  const activeTab: Tab | null =
    activeView === 'inicio'
      ? 'inicio'
      : activeView === 'catalogo' && offersActive
        ? 'ofertas'
        : activeView === 'catalogo' || activeView === 'producto'
          ? 'catalogo'
          : activeView === 'cuenta' || activeView === 'ingresar'
            ? 'cuenta'
            : null; // carrito: ninguna pestaña, la gota se evapora
  const idx = activeTab ? tabs.indexOf(activeTab) : -1;

  // Dónde quedó la gota la última vez: si viene "de ninguna parte" cae desde arriba; si no, viaja.
  const lastIdx = useRef(-1);
  const lastShown = useRef(Math.max(0, idx));
  const cameFromNowhere = lastIdx.current === -1;
  const shownIdx = idx >= 0 ? idx : lastShown.current;
  useEffect(() => {
    lastIdx.current = idx;
    if (idx >= 0) lastShown.current = idx;
  }, [idx]);

  const isActive = (t: Tab) => t === activeTab;
  const tab = (active: boolean) =>
    `relative z-10 flex flex-col items-center justify-center flex-1 h-full transition-colors ${
      active ? 'text-[#01372e] font-bold' : 'text-[#404846] hover:text-[#01372e]'
    }`;
  const icon = (active: boolean) => `material-symbols-outlined text-[22px] ${active ? 'animate-drop-icon' : ''}`;
  const fill = (active: boolean) => ({ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" });

  return (
    <nav
      aria-label="Navegación inferior"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fff3d7]/95 backdrop-blur-xl border-t border-[#efe1c2] shadow-[0_-2px_12px_rgba(33,27,8,0.06)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="relative flex justify-around items-center h-16 px-1">
        {/* Gota: se desliza hasta la pestaña activa, se estira en el viaje y deja una onda al llegar */}
        <div
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-1 pointer-events-none transition-transform duration-500 ease-[cubic-bezier(.65,0,.35,1)]"
          style={{ width: `calc((100% - 0.5rem) / ${tabs.length})`, transform: `translateX(${shownIdx * 100}%)` }}
        >
          <div
            className={`absolute top-2 left-1/2 -ml-7 w-14 h-8 transition-opacity duration-300 ${idx >= 0 ? 'opacity-100' : 'opacity-0'}`}
          >
            {/* key = pestaña: al cambiar se remonta la gota y arranca de nuevo la animación */}
            <span
              key={`drop-${idx}`}
              className={`absolute inset-0 rounded-full bg-[#c8e6dd] shadow-[inset_0_-2px_4px_rgba(1,55,46,0.12),inset_0_2px_3px_rgba(255,255,255,0.7)] ${
                idx < 0 ? '' : cameFromNowhere ? 'animate-drop-in' : 'animate-drop-travel'
              }`}
            />
            {idx >= 0 && <span key={`ripple-${idx}`} className="absolute inset-0 rounded-full border-2 border-[#01372e]/35 animate-drop-ripple" />}
          </div>
        </div>

        <button type="button" onClick={() => onNavigate({ view: 'inicio' })} className={tab(isActive('inicio'))} aria-current={isActive('inicio') ? 'page' : undefined}>
          <span className={icon(isActive('inicio'))} style={fill(isActive('inicio'))}>storefront</span>
          <span className="text-[11px] leading-tight mt-1">Inicio</span>
        </button>

        <button type="button" onClick={() => onNavigate({ view: 'catalogo' })} className={tab(isActive('catalogo'))} aria-current={isActive('catalogo') ? 'page' : undefined}>
          <span className={icon(isActive('catalogo'))} style={fill(isActive('catalogo'))}>grid_view</span>
          <span className="text-[11px] leading-tight mt-1">Catálogo</span>
        </button>

        <button type="button" onClick={onOpenFeatured} className={tab(isActive('ofertas'))} aria-current={isActive('ofertas') ? 'page' : undefined}>
          <span className={`${icon(isActive('ofertas'))} text-[#842401]`} style={fill(isActive('ofertas'))}>local_fire_department</span>
          <span className="text-[11px] leading-tight mt-1">Ofertas</span>
        </button>

        {showAccount && (
          <button type="button" onClick={() => onNavigate({ view: 'cuenta' })} className={tab(isActive('cuenta'))} aria-current={isActive('cuenta') ? 'page' : undefined}>
            <span className={icon(isActive('cuenta'))} style={fill(isActive('cuenta'))}>person</span>
            <span className="text-[11px] leading-tight mt-1">Cuenta</span>
          </button>
        )}

        <a
          href={waLink('Hola Karim, quiero consultar por un pedido')}
          target="_blank"
          rel="noopener noreferrer"
          className={tab(false)}
        >
          <span className="material-symbols-outlined text-[22px] text-[#1ebe5d]" style={fill(true)}>chat</span>
          <span className="text-[11px] leading-tight mt-1 font-medium text-[#1ebe5d]">Karim</span>
        </a>
      </div>
    </nav>
  );
}
