import { AppView, Route } from '../types';
import { money } from '../lib/config';

interface Props {
  cartCount: number;
  cartTotal: number;
  activeView: AppView;
  onNavigate: (route: Route) => void;
}

/** Resumen flotante del pedido: barra sobre el tab bar en celular, widget en la esquina en tablet/PC. */
export function FloatingCartBar({ cartCount, cartTotal, activeView, onNavigate }: Props) {
  if (activeView === 'carrito' || cartCount === 0) return null;
  const open = () => onNavigate({ view: 'carrito' });

  return (
    <>
      <div className="md:hidden fixed bottom-[calc(74px+env(safe-area-inset-bottom))] left-0 right-0 z-40 px-4 pointer-events-none">
        <div className="max-w-[420px] mx-auto pointer-events-auto">
          <button
            type="button"
            onClick={open}
            className="w-full bg-[#1f4e44] hover:bg-[#01372e] text-white py-2.5 px-4 rounded-xl shadow-[0_4px_16px_rgba(1,55,46,0.3)] flex items-center justify-between transition-transform active:scale-[0.98]"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#efe1c2]/20 flex items-center justify-center font-mono text-xs font-bold">
                {cartCount}
              </span>
              <span className="font-semibold text-sm">Ver pedido</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-mono font-bold text-base text-[#f4e7c8]">{money(cartTotal)}</span>
              <span className="material-symbols-outlined text-[#f4e7c8] text-[20px]">chevron_right</span>
            </div>
          </button>
        </div>
      </div>

      <aside
        aria-label="Resumen del pedido"
        className="hidden md:flex fixed bottom-6 left-6 z-40 items-center gap-4 p-2.5 pl-4 bg-[#211b08] text-[#fdf0d0] rounded-2xl shadow-[0_12px_28px_rgba(1,55,46,0.35)] border border-[#404846]/40 max-w-md animate-fade-in"
      >
        <div className="flex items-center gap-3 pr-3 border-r border-[#707976]/40">
          <div className="relative">
            <span className="material-symbols-outlined text-[#bceddf] text-[26px]">inventory_2</span>
            <span className="absolute -top-1 -right-1.5 bg-[#842401] text-white font-mono text-[10px] min-w-4 h-4 px-0.5 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#c0c8c4] uppercase tracking-wider font-semibold">Total del pedido</span>
            <span className="font-mono text-base font-bold text-white">{money(cartTotal)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={open}
          className="px-4 py-1.5 rounded-xl bg-[#01372e] hover:bg-[#1f4e44] text-white font-semibold text-xs transition-transform active:scale-95 flex items-center gap-1.5 shadow-sm"
        >
          <span>Ver pedido</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </aside>
    </>
  );
}
