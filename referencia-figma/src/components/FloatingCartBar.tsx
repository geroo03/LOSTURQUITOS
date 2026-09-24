/**
 * ============================================================================
 * COMPONENTE: src/components/FloatingCartBar.tsx
 * PROYECTO: Los Turquitos - Especiera Mayorista
 * ----------------------------------------------------------------------------
 * NOTA PARA CLAUDE / DESARROLLADOR:
 * Este componente implementa la barra flotante de resumen de pedido que se
 * aprecia en los prototipos de Celular, Tablet y PC.
 *
 * COMPORTAMIENTOS RESPONSIVOS:
 * - [📱 CELULARES]:
 *   Flota a 74px del fondo (por encima de la barra de tabs 'MobileBottomNav').
 *   Ancho máximo 390px centrado.
 * - [📟 TABLETS]:
 *   Flota en la parte inferior centrada o en la esquina con resumen de kilos.
 * - [💻 PC / ESCRITORIO]:
 *   Aparece como widget lateral flotante en la esquina inferior izquierda
 *   con desglose de presupuesto y botón 'Ver Carrito'.
 * ============================================================================
 */

import React from 'react';
import { AppView } from '../types.ts';
import { InteractiveIndicator } from './InteractiveIndicator.tsx';

interface FloatingCartBarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  activeView: AppView;
  guideMode: boolean;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  activeView,
  guideMode,
}) => {
  // No mostrar la barra si ya estamos en la pantalla de carrito/resumen o si el carrito está vacío
  if (activeView === 'carrito' || cartCount === 0) {
    return null;
  }

  return (
    <>
      {/* ====================================================================
          1. VERSIÓN CELULAR (<768px): Flotante por encima del tab bar
          ==================================================================== */}
      <div className="md:hidden fixed bottom-[74px] left-0 right-0 z-40 px-4 pointer-events-none">
        <div className="max-w-[390px] mx-auto pointer-events-auto">
          <InteractiveIndicator
            label="Barra Flotante Móvil"
            devices={['celular']}
            actionDesc="Acceso directo al resumen con subtotal acumulado en vivo"
            isActive={guideMode}
          >
            <button
              type="button"
              onClick={onOpenCart}
              className="w-full bg-[#1f4e44] hover:bg-[#01372e] text-[#ffffff] py-2.5 px-4 rounded-xl shadow-[0_4px_16px_rgba(1,55,46,0.3)] flex items-center justify-between transition-transform active:scale-[0.98]"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#efe1c2]/20 text-[#ffffff] flex items-center justify-center font-mono text-xs font-bold">
                  {cartCount}
                </span>
                <span className="font-semibold text-sm">Ver Pedido</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-mono font-bold text-base text-[#f4e7c8]">
                  ${cartTotal.toLocaleString('es-AR')}
                </span>
                <span className="material-symbols-outlined text-[#f4e7c8] text-[20px]">
                  chevron_right
                </span>
              </div>
            </button>
          </InteractiveIndicator>
        </div>
      </div>

      {/* ====================================================================
          2. VERSIÓN DESKTOP Y TABLET (>=768px): Widget lateral fijo
          ==================================================================== */}
      <aside
        aria-label="Resumen de pedido flotante escritorio"
        className="hidden md:flex fixed bottom-6 left-6 z-40 items-center gap-4 p-2.5 pl-4 bg-[#211b08] text-[#fdf0d0] rounded-2xl shadow-[0_12px_28px_rgba(1,55,46,0.35)] border border-[#404846]/40 max-w-md animate-fade-in"
      >
        <InteractiveIndicator
          label="Widget Flotante Escritorio"
          devices={['tablet', 'pc']}
          actionDesc="Muestra el presupuesto acumulado y permite abrir el drawer / vista de remito"
          isActive={guideMode}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pr-3 border-r border-[#707976]/40">
              <div className="relative">
                <span className="material-symbols-outlined text-[#bceddf] text-[26px]">
                  inventory_2
                </span>
                <span className="absolute -top-1 -right-1.5 bg-[#842401] text-white font-mono text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-[#c0c8c4] uppercase tracking-wider font-semibold">
                  Total Presupuesto
                </span>
                <span className="font-mono text-base font-bold text-[#ffffff]">
                  ${cartTotal.toLocaleString('es-AR')}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenCart}
              className="px-4 py-1.5 rounded-xl bg-[#01372e] hover:bg-[#1f4e44] text-white font-semibold text-xs transition-transform active:scale-95 flex items-center gap-1.5 shadow-sm"
            >
              <span>Ver Carrito</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </InteractiveIndicator>
      </aside>
    </>
  );
};
