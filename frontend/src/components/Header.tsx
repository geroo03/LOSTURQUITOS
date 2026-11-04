import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AppView, Route } from '../types';
import { WHATSAPP_DISPLAY, waLink, money } from '../lib/config';

interface HeaderProps {
  activeView: AppView;
  offersActive: boolean; // en el catálogo con el filtro "Ofertas y destacados"
  logoUrl: string;
  onNavigate: (route: Route) => void;
  cartCount: number;
  cartTotal: number;
  searchQuery: string;
  onSearchChange: (q: string) => void; // si no está en el catálogo, lo abre
  onOpenSearch: () => void; // lupa del celular: abre el buscador del catálogo
  onOpenHowToBuy: () => void;
  onOpenFeatured: () => void;
  showAccount: boolean; // las cuentas están habilitadas
  accountLabel: string | null; // primer nombre / "Mi cuenta" si hay sesión, o null si no
}

// El fondo del botón activo lo pone la "gota" que se desliza (ver DropPill), no el botón.
const navBtn = (active: boolean) =>
  `relative z-10 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors duration-300 ${
    active ? 'text-norte font-bold' : 'text-marfil/85 hover:text-marfil hover:bg-white/10'
  }`;

type NavTab = 'inicio' | 'catalogo' | 'ofertas';

/**
 * Pastilla "gota de agua" de las pestañas (tablet y PC): se desliza hasta el botón activo tomando su ancho,
 * se estira en el viaje, rebota al llegar y deja una onda. Si ninguna pestaña está activa se evapora.
 */
function DropPill({ active, buttons }: { active: NavTab | null; buttons: React.RefObject<Partial<Record<NavTab, HTMLButtonElement | null>>> }) {
  const [box, setBox] = useState<{ left: number; width: number } | null>(null);
  const lastActive = useRef<NavTab | null>(null);
  const cameFromNowhere = lastActive.current === null;

  useLayoutEffect(() => {
    const measure = () => {
      const el = active ? buttons.current[active] : null;
      if (el) setBox({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    document.fonts?.ready.then(measure); // las fuentes web cambian el ancho de los botones al cargar
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [active, buttons]);

  useEffect(() => {
    lastActive.current = active;
  }, [active]);

  if (!box) return null;
  return (
    <div
      aria-hidden="true"
      className={`absolute top-1.5 bottom-1.5 left-0 pointer-events-none transition-[transform,width,opacity] duration-500 ease-[cubic-bezier(.65,0,.35,1)] ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ transform: `translateX(${box.left}px)`, width: box.width }}
    >
      <span
        key={`drop-${active}`}
        className={`absolute inset-0 rounded-lg bg-mostaza shadow-[inset_0_-2px_4px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.35),0_2px_8px_rgba(0,0,0,0.25)] ${
          !active ? '' : cameFromNowhere ? 'animate-drop-in' : 'animate-drop-travel-soft'
        }`}
      />
      {active && <span key={`ripple-${active}`} className="absolute inset-0 rounded-lg border-2 border-mostaza/50 animate-drop-ripple-soft" />}
    </div>
  );
}

export function Header({
  activeView,
  offersActive,
  logoUrl,
  onNavigate,
  cartCount,
  cartTotal,
  searchQuery,
  onSearchChange,
  onOpenSearch,
  onOpenHowToBuy,
  onOpenFeatured,
  showAccount,
  accountLabel,
}: HeaderProps) {
  const isBackView = activeView === 'producto' || activeView === 'carrito';
  const tabRefs = useRef<Partial<Record<NavTab, HTMLButtonElement | null>>>({});
  const activeTab: NavTab | null =
    activeView === 'inicio'
      ? 'inicio'
      : activeView === 'catalogo' && offersActive
        ? 'ofertas'
        : activeView === 'catalogo' || activeView === 'producto'
          ? 'catalogo'
          : null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-norte/97 backdrop-blur-md shadow-[0_2px_16px_rgba(0,0,0,0.25)] border-b border-mostaza/40 text-marfil">
      {/* Franja superior (tablet y PC) */}
      <div className="hidden md:block bg-norte-hondo text-marfil py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-marfil/85 tracking-wide">
            <span className="material-symbols-outlined text-[16px] text-mostaza">eco</span>
            <span>Especias · Condimentos · Almacén — precios de mayorista y pedidos por WhatsApp</span>
          </span>
          <a
            href={waLink('Hola Karim, quiero hacer un pedido en Norte Origen')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-marfil/85 hover:text-marfil transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-[#1ebe5d]">support_agent</span>
            <span>
              Atención directa: <strong className="text-marfil">Karim</strong>
            </span>
            <span className="hidden lg:inline font-mono text-mostaza ml-2">{WHATSAPP_DISPLAY}</span>
          </a>
        </div>
      </div>

      {/* Barra principal */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {isBackView ? (
            <>
              <button
                type="button"
                onClick={() => onNavigate({ view: 'catalogo' })}
                className="w-10 h-10 -ml-1 flex items-center justify-center rounded-full text-marfil hover:bg-white/10 active:scale-95 transition-all"
                aria-label="Volver al catálogo"
              >
                <span className="material-symbols-outlined text-[24px]">arrow_back</span>
              </button>
              <div className="flex flex-col min-w-0 pl-1">
                <span className="font-serif font-bold text-marfil text-base sm:text-lg leading-tight truncate">
                  {activeView === 'producto' ? 'Ficha de producto' : 'Tu pedido'}
                </span>
                <span className="font-display text-[10px] text-mostaza uppercase tracking-[0.18em]">Norte Origen</span>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate({ view: 'inicio' })}
              className="flex items-center gap-2.5 text-left group"
            >
              <img
                src={logoUrl}
                alt="Norte Origen"
                className="w-11 h-11 sm:w-14 sm:h-14 rounded-full shrink-0 object-cover shadow-[0_0_0_1px_rgba(200,155,69,0.5)] group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-display font-semibold text-marfil text-[17px] sm:text-xl tracking-[0.06em] leading-tight truncate">
                  NORTE ORIGEN
                </span>
                <span className="font-sans text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.2em] text-mostaza font-semibold truncate leading-tight mt-0.5">
                  {activeView === 'inicio' ? 'Del origen a cada mesa' : activeView === 'cuenta' || activeView === 'ingresar' ? 'Mi cuenta' : 'Catálogo mayorista'}
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Buscador (tablet y PC) */}
        <div className="hidden md:block flex-1 max-w-md lg:max-w-xl mx-2">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-salvia text-[20px] pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              enterKeyHint="search"
              placeholder="Buscar comino, pimentón, frutos secos, semillas…"
              className="w-full pl-10 pr-9 py-2 bg-marfil border border-mostaza/40 rounded-xl text-sm text-tinta placeholder-gris-claro focus:outline-none focus:ring-2 focus:ring-mostaza focus:border-transparent shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gris-claro hover:text-tinta"
                aria-label="Borrar búsqueda"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          <a
            href={waLink('Hola Karim, quiero hacer un pedido en Norte Origen')}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-marfil/25 hover:bg-white/10 text-marfil text-xs font-semibold transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px] text-[#1ebe5d]">chat</span>
            <span className="hidden lg:inline">WhatsApp</span>
            <span className="lg:hidden">Karim</span>
          </a>

          <button
            type="button"
            onClick={onOpenSearch}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-marfil hover:bg-white/10 transition-colors"
            aria-label="Buscar productos"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          {showAccount && <button
            type="button"
            onClick={() => onNavigate(accountLabel ? { view: 'cuenta' } : { view: 'ingresar' })}
            className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
              activeView === 'cuenta' || activeView === 'ingresar' ? 'bg-marfil text-norte' : 'text-marfil hover:bg-white/10'
            }`}
            aria-label={accountLabel ? 'Mi cuenta' : 'Ingresar o crear cuenta'}
          >
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: accountLabel ? "'FILL' 1" : "'FILL' 0" }}>
              person
            </span>
            <span className="hidden lg:inline max-w-[110px] truncate">{accountLabel ?? 'Ingresar'}</span>
          </button>}

          <button
            type="button"
            onClick={() => onNavigate({ view: 'carrito' })}
            className={`relative flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-xl transition-all ${
              activeView === 'carrito' ? 'bg-marfil text-norte shadow-sm' : 'bg-mostaza hover:bg-[#d4aa58] text-norte shadow-sm'
            }`}
            aria-label={`Ver pedido, ${cartCount} productos`}
          >
            <div className="relative flex items-center">
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
              {/* key = cantidad: al cambiar se remonta el badge y se dispara la animación de rebote */}
              <span
                key={cartCount}
                className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 bg-oferta text-white font-mono text-[10px] font-bold rounded-full flex items-center justify-center leading-none animate-bump ring-2 ring-norte"
              >
                {cartCount}
              </span>
            </div>
            <div className="hidden lg:flex flex-col text-right pl-1">
              <span className="font-mono text-[10px] uppercase opacity-70 leading-none">Total</span>
              <span className="font-mono font-bold text-sm leading-tight">{money(cartTotal)}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Pestañas (tablet y PC). En celular se usa MobileBottomNav */}
      <nav className="hidden md:block bg-norte-claro/60 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="relative flex items-center gap-1 sm:gap-2 py-1.5 overflow-x-auto no-scrollbar">
            <DropPill active={activeTab} buttons={tabRefs} />
            <button
              type="button"
              ref={(el) => void (tabRefs.current.inicio = el)}
              onClick={() => onNavigate({ view: 'inicio' })}
              className={navBtn(activeTab === 'inicio')}
              aria-current={activeTab === 'inicio' ? 'page' : undefined}
            >
              Inicio
            </button>
            <button
              type="button"
              ref={(el) => void (tabRefs.current.catalogo = el)}
              onClick={() => onNavigate({ view: 'catalogo' })}
              className={navBtn(activeTab === 'catalogo')}
              aria-current={activeTab === 'catalogo' ? 'page' : undefined}
            >
              Catálogo
            </button>
            <button
              type="button"
              ref={(el) => void (tabRefs.current.ofertas = el)}
              onClick={onOpenFeatured}
              className={`${navBtn(activeTab === 'ofertas')} flex items-center gap-1`}
              aria-current={activeTab === 'ofertas' ? 'page' : undefined}
            >
              <span className={`material-symbols-outlined text-[16px] transition-colors duration-300 ${activeTab === 'ofertas' ? 'text-oferta' : 'text-mostaza'}`}>
                local_fire_department
              </span>
              <span>Ofertas y destacados</span>
            </button>
            <button type="button" onClick={onOpenHowToBuy} className={navBtn(false)}>
              Cómo comprar
            </button>
            <a
              href={waLink('Hola Karim, te contacto desde la tienda de Norte Origen')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors text-marfil/85 hover:text-marfil hover:bg-white/10 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px] text-[#1ebe5d]">chat</span>
              <span>Contacto directo con Karim</span>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
