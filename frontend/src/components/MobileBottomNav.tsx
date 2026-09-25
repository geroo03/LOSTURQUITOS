import { AppView, Route } from '../types';
import { waLink } from '../lib/config';

interface Props {
  activeView: AppView;
  onNavigate: (route: Route) => void;
  onOpenFeatured: () => void;
  showAccount: boolean;
}

export function MobileBottomNav({ activeView, onNavigate, onOpenFeatured, showAccount }: Props) {
  const tab = (active: boolean) =>
    `flex flex-col items-center justify-center flex-1 h-full transition-colors ${
      active ? 'text-[#01372e] font-bold' : 'text-[#404846] hover:text-[#01372e]'
    }`;
  const fill = (active: boolean) => ({ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" });

  return (
    <nav
      aria-label="Navegación inferior"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fff3d7]/95 backdrop-blur-xl border-t border-[#efe1c2] shadow-[0_-2px_12px_rgba(33,27,8,0.06)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex justify-around items-center h-16 px-1">
        <button type="button" onClick={() => onNavigate({ view: 'inicio' })} className={tab(activeView === 'inicio')}>
          <span className="material-symbols-outlined text-[22px]" style={fill(activeView === 'inicio')}>storefront</span>
          <span className="text-[11px] leading-tight mt-0.5">Inicio</span>
        </button>

        <button type="button" onClick={() => onNavigate({ view: 'catalogo' })} className={tab(activeView === 'catalogo')}>
          <span className="material-symbols-outlined text-[22px]" style={fill(activeView === 'catalogo')}>grid_view</span>
          <span className="text-[11px] leading-tight mt-0.5">Catálogo</span>
        </button>

        <button type="button" onClick={onOpenFeatured} className={tab(false)}>
          <span className="material-symbols-outlined text-[22px] text-[#842401]">local_fire_department</span>
          <span className="text-[11px] leading-tight mt-0.5">Ofertas</span>
        </button>

        {showAccount && <button
          type="button"
          onClick={() => onNavigate({ view: 'cuenta' })}
          className={tab(activeView === 'cuenta' || activeView === 'ingresar')}
        >
          <span className="material-symbols-outlined text-[22px]" style={fill(activeView === 'cuenta' || activeView === 'ingresar')}>person</span>
          <span className="text-[11px] leading-tight mt-0.5">Cuenta</span>
        </button>}

        <a
          href={waLink('Hola Karim, quiero consultar por un pedido')}
          target="_blank"
          rel="noopener noreferrer"
          className={tab(false)}
        >
          <span className="material-symbols-outlined text-[22px] text-[#1ebe5d]" style={fill(true)}>chat</span>
          <span className="text-[11px] leading-tight mt-0.5 font-medium text-[#1ebe5d]">Karim</span>
        </a>
      </div>
    </nav>
  );
}
