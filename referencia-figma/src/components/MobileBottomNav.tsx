/**
 * ============================================================================
 * COMPONENTE: src/components/MobileBottomNav.tsx
 * PROYECTO: Los Turquitos - Especiera Mayorista
 * ----------------------------------------------------------------------------
 * NOTA PARA CLAUDE / DESARROLLADOR:
 * Este componente proporciona la barra de navegación persistente inferior para:
 * - [📱 CELULARES (<768px)]:
 *   Pestañas de acceso rápido: Inicio, Catálogo, Ofertas y Canal Karim con
 *   ícono verde oficial de WhatsApp (#1ebe5d).
 * - En [📟 TABLET] y [💻 PC], se oculta automáticamente (`md:hidden`), ya que
 *   la navegación reside en la barra superior.
 * ============================================================================
 */

import React from 'react';
import { AppView } from '../types.ts';
import { KARIM_CONTACT } from '../data/mockData.ts';

interface MobileBottomNavProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeView,
  onNavigate,
}) => {
  return (
    <nav
      aria-label="Navegación inferior para celular"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fff3d7]/95 backdrop-blur-xl border-t border-[#efe1c2] shadow-[0_-2px_12px_rgba(33,27,8,0.06)]"
    >
      <div className="flex justify-around items-center h-16 px-1">
        {/* Tab 1: Inicio */}
        <button
          type="button"
          onClick={() => onNavigate('inicio')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeView === 'inicio'
              ? 'text-[#01372e] font-bold'
              : 'text-[#404846] hover:text-[#01372e]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: activeView === 'inicio' ? "'FILL' 1" : "'FILL' 0" }}
          >
            storefront
          </span>
          <span className="text-[11px] leading-tight mt-0.5">Inicio</span>
        </button>

        {/* Tab 2: Catálogo */}
        <button
          type="button"
          onClick={() => onNavigate('catalogo')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeView === 'catalogo'
              ? 'text-[#01372e] font-bold'
              : 'text-[#404846] hover:text-[#01372e]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: activeView === 'catalogo' ? "'FILL' 1" : "'FILL' 0" }}
          >
            grid_view
          </span>
          <span className="text-[11px] leading-tight mt-0.5">Catálogo</span>
        </button>

        {/* Tab 3: Ofertas */}
        <button
          type="button"
          onClick={() => onNavigate('catalogo')}
          className="flex flex-col items-center justify-center flex-1 h-full text-[#404846] hover:text-[#01372e] transition-colors"
        >
          <span className="material-symbols-outlined text-[22px] text-[#842401]">
            local_fire_department
          </span>
          <span className="text-[11px] leading-tight mt-0.5">Ofertas</span>
        </button>

        {/* Tab 4: Karim WhatsApp */}
        <a
          href={`https://wa.me/${KARIM_CONTACT.phoneInternational}?text=Hola%20Karim,%20quiero%20consultar%20por%20un%20pedido%20mayorista`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center flex-1 h-full text-[#404846] hover:text-[#01372e] transition-colors"
        >
          <span
            className="material-symbols-outlined text-[22px] text-[#1ebe5d]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            chat
          </span>
          <span className="text-[11px] leading-tight mt-0.5 font-medium text-[#1ebe5d]">
            Karim
          </span>
        </a>
      </div>
    </nav>
  );
};
