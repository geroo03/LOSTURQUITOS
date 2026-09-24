import { AppView, Route } from '../types';
import { WHATSAPP_DISPLAY, waLink, money } from '../lib/config';

interface HeaderProps {
  activeView: AppView;
  logoUrl: string;
  onNavigate: (route: Route) => void;
  cartCount: number;
  cartTotal: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenHowToBuy: () => void;
  onOpenFeatured: () => void;
}

const navBtn = (active: boolean) =>
  `px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
    active ? 'bg-[#1f4e44] text-white shadow-sm font-bold' : 'text-[#404846] hover:text-[#01372e] hover:bg-[#faedcd]'
  }`;

export function Header({
  activeView,
  logoUrl,
  onNavigate,
  cartCount,
  cartTotal,
  searchQuery,
  onSearchChange,
  onOpenHowToBuy,
  onOpenFeatured,
}: HeaderProps) {
  const isBackView = activeView === 'producto' || activeView === 'carrito';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#fff8f0]/95 backdrop-blur-md shadow-[0_2px_12px_rgba(1,55,46,0.06)] border-b border-[#faedcd]">
      {/* Franja superior (tablet y PC) */}
      <div className="hidden md:block bg-[#01372e] text-white py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-[#bceddf]">
            <span className="material-symbols-outlined text-[16px] text-[#ffb59e]">sell</span>
            <span>Precios de mayorista · Pedidos por WhatsApp</span>
          </span>
          <a
            href={waLink('Hola Karim, quiero hacer un pedido en Los Turquitos')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#cbe9df] hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-[#1ebe5d]">support_agent</span>
            <span>
              Atención directa: <strong className="text-white">Karim</strong>
            </span>
            <span className="hidden lg:inline font-mono text-[#8ebeb1] ml-2">{WHATSAPP_DISPLAY}</span>
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
                className="w-10 h-10 -ml-1 flex items-center justify-center rounded-full text-[#01372e] hover:bg-[#faedcd] active:scale-95 transition-all"
                aria-label="Volver al catálogo"
              >
                <span className="material-symbols-outlined text-[24px]">arrow_back</span>
              </button>
              <div className="flex flex-col min-w-0 pl-1">
                <span className="font-display font-bold text-[#01372e] text-base sm:text-lg leading-tight truncate">
                  {activeView === 'producto' ? 'Ficha de producto' : 'Tu pedido'}
                </span>
                <span className="font-mono text-[10px] text-[#49645c] uppercase">Los Turquitos</span>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate({ view: 'inicio' })}
              className="flex items-center gap-2 text-left group"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1f4e44] shrink-0 shadow-sm group-hover:bg-[#01372e] transition-colors overflow-hidden">
                <img src={logoUrl} alt="Los Turquitos" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-display font-bold text-[#01372e] text-base sm:text-lg tracking-tight leading-tight truncate">
                  Los Turquitos
                </span>
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#842401] font-semibold truncate leading-none">
                  {activeView === 'inicio' ? 'Inicio' : 'Catálogo mayorista'}
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Buscador (tablet y PC) */}
        <div className="hidden md:block flex-1 max-w-md lg:max-w-xl mx-2">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#49645c] text-[20px] pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (activeView !== 'catalogo') onNavigate({ view: 'catalogo' });
              }}
              placeholder="Buscar comino, pimentón, frutos secos, semillas…"
              className="w-full pl-10 pr-9 py-2 bg-white border border-[#c0c8c4] rounded-xl text-sm text-[#211b08] placeholder-[#707976] focus:outline-none focus:ring-2 focus:ring-[#01372e] focus:border-transparent shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#707976] hover:text-[#211b08]"
                aria-label="Borrar búsqueda"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          <a
            href={waLink('Hola Karim, quiero hacer un pedido en Los Turquitos')}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#01372e] hover:bg-[#1f4e44] text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px] text-[#1ebe5d]">chat</span>
            <span className="hidden lg:inline">WhatsApp</span>
            <span className="lg:hidden">Karim</span>
          </a>

          <button
            type="button"
            onClick={() => onNavigate({ view: 'catalogo' })}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-[#01372e] hover:bg-[#faedcd] transition-colors"
            aria-label="Ir al catálogo y buscar"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate({ view: 'carrito' })}
            className={`relative flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-xl transition-all ${
              activeView === 'carrito' ? 'bg-[#1f4e44] text-white shadow-sm' : 'bg-[#f4e7c8] hover:bg-[#efe1c2] text-[#01372e]'
            }`}
            aria-label={`Ver pedido, ${cartCount} productos`}
          >
            <div className="relative flex items-center">
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
              {/* key = cantidad: al cambiar se remonta el badge y se dispara la animación de rebote */}
              <span
                key={cartCount}
                className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 bg-[#842401] text-white font-mono text-[10px] font-bold rounded-full flex items-center justify-center leading-none animate-bump"
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
      <nav className="hidden md:block bg-[#fff3d7] border-t border-[#efe1c2]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-1 sm:gap-2 py-1.5 overflow-x-auto no-scrollbar">
            <button type="button" onClick={() => onNavigate({ view: 'inicio' })} className={navBtn(activeView === 'inicio')}>
              Inicio
            </button>
            <button type="button" onClick={() => onNavigate({ view: 'catalogo' })} className={navBtn(activeView === 'catalogo')}>
              Catálogo
            </button>
            <button type="button" onClick={onOpenFeatured} className={`${navBtn(false)} flex items-center gap-1`}>
              <span className="material-symbols-outlined text-[16px] text-[#842401]">local_fire_department</span>
              <span>Destacados</span>
            </button>
            <button type="button" onClick={onOpenHowToBuy} className={navBtn(false)}>
              Cómo comprar
            </button>
            <a
              href={waLink('Hola Karim, te contacto desde la tienda de Los Turquitos')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors text-[#01372e] hover:bg-[#faedcd] flex items-center gap-1"
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
