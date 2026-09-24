/**
 * ============================================================================
 * COMPONENTE: src/components/Header.tsx
 * PROYECTO: Los Turquitos - Especiera Mayorista
 * ----------------------------------------------------------------------------
 * NOTA PARA CLAUDE / DESARROLLADOR:
 * Este componente implementa la cabecera adaptable según el dispositivo:
 *
 * 1. [📱 CELULARES (<768px)]:
 *    - Altura compacta (h-16 / h-20) con efecto backdrop-blur.
 *    - Botón de regreso contextual si la vista es 'producto' o 'carrito'.
 *    - Avatar oficial, título 'Los Turquitos' y badge de vista.
 *    - Accesos directos a buscador y carrito con contador reactivo (badge).
 *
 * 2. [📟 TABLETS (768px - 1024px)]:
 *    - Cabecera de 3 niveles: Ticker superior con beneficios mayoristas,
 *      fila de marca con buscador compacto y acceso a WhatsApp de Karim,
 *      y barra de pestañas deslizables (Inicio, Catálogo, Ofertas, etc.).
 *
 * 3. [💻 PC / ESCRITORIO (>1024px)]:
 *    - Ancho completo de 1280px con buscador expandido y barra de estado
 *      de horarios de expedición (07:00 a 16:00 hs).
 *    - Carrito con resumen monetario tabular ($48.500 / 3 ítems).
 * ============================================================================
 */

import React from 'react';
import { AppView } from '../types.ts';
import { BRAND_AVATAR_URL, KARIM_CONTACT } from '../data/mockData.ts';
import { InteractiveIndicator } from './InteractiveIndicator.tsx';

interface HeaderProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  cartCount: number;
  cartTotal: number;
  guideMode: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenHowToBuy: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigate,
  cartCount,
  cartTotal,
  guideMode,
  searchQuery,
  onSearchChange,
  onOpenHowToBuy,
}) => {
  const isBackView = activeView === 'producto' || activeView === 'carrito';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#fff8f0]/95 backdrop-blur-md shadow-[0_2px_12px_rgba(1,55,46,0.06)] border-b border-[#faedcd]">
      {/* ====================================================================
          NIVEL 1: TICKER SUPERIOR MAYORISTA (Visible en Tablet y PC / Desktop)
          Comportamiento: [📟 TABLET] y [💻 PC]. Oculto en [📱 CELULARES].
          ==================================================================== */}
      <div className="hidden md:block bg-[#01372e] text-[#ffffff] py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#bceddf]">
              <span className="material-symbols-outlined text-[16px] text-[#ffb59e]">local_shipping</span>
              <span>Envíos mayoristas a todo el país</span>
            </span>
            <span className="font-mono text-[#a0d0c3] uppercase tracking-wider text-[11px] font-bold">
              PEDIDO MÍNIMO: ${KARIM_CONTACT.minOrderWholesale.toLocaleString('es-AR')}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href={`https://wa.me/${KARIM_CONTACT.phoneInternational}?text=Hola%20Karim,%20quiero%20hacer%20un%20pedido%20mayorista`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#cbe9df] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-[#1ebe5d]">support_agent</span>
              <span>Atención directa: <strong className="text-white">Karim</strong></span>
            </a>
            <span className="hidden lg:inline text-[#8ebeb1]">
              {KARIM_CONTACT.dispatchHours}
            </span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          NIVEL 2: BARRA PRINCIPAL (Logo, Buscador, Carrito & WhatsApp)
          Adaptación:
          - [📱 CELULAR]: Modo compacto h-16 o h-20 con botón atrás o logo
          - [📟 TABLET]: Modo intermedio con buscador y badges
          - [💻 PC]: Modo extendido completo
          ==================================================================== */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Identidad / Botón Volver */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {isBackView ? (
            <InteractiveIndicator
              label="Botón Volver"
              devices={['celular', 'tablet']}
              actionDesc="Regresa al catálogo o vista previa"
              isActive={guideMode}
            >
              <button
                type="button"
                onClick={() => onNavigate('catalogo')}
                className="w-10 h-10 -ml-1 flex items-center justify-center rounded-full text-[#01372e] hover:bg-[#faedcd] active:scale-95 transition-all"
                aria-label="Volver al catálogo"
              >
                <span className="material-symbols-outlined text-[24px]">arrow_back</span>
              </button>
            </InteractiveIndicator>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('inicio')}
              className="flex items-center gap-2 text-left group"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1f4e44] text-[#ffffff] flex items-center justify-center font-bold text-sm sm:text-base shrink-0 shadow-sm group-hover:bg-[#01372e] transition-colors overflow-hidden">
                <img
                  src={BRAND_AVATAR_URL}
                  alt="Los Turquitos Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-display font-bold text-[#01372e] text-base sm:text-lg tracking-tight leading-tight truncate">
                  Los Turquitos
                </span>
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#842401] font-semibold truncate leading-none">
                  {activeView === 'inicio' ? 'Inicio Mercado' : activeView === 'catalogo' ? 'Catálogo Mayorista' : 'Guía de Compra'}
                </span>
              </div>
            </button>
          )}

          {isBackView && (
            <div className="flex flex-col min-w-0 pl-1">
              <span className="font-display font-bold text-[#01372e] text-base sm:text-lg leading-tight truncate">
                {activeView === 'producto' ? 'Ficha De Producto' : 'Resumen Pedido'}
              </span>
              <span className="font-mono text-[10px] text-[#49645c] uppercase">
                Los Turquitos Mayorista
              </span>
            </div>
          )}
        </div>

        {/* Buscador Central (Desktop y Tablet) */}
        <div className="hidden md:block flex-1 max-w-md lg:max-w-xl mx-2">
          <InteractiveIndicator
            label="Buscador en Tiempo Real"
            devices={['tablet', 'pc']}
            actionDesc="Filtra dinámicamente por nombre de especia, origen o código botánico"
            isActive={guideMode}
          >
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#49645c] text-[20px] pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (activeView !== 'catalogo') onNavigate('catalogo');
                }}
                placeholder="Buscar comino, pimentón, frutos secos, semillas por bulto..."
                className="w-full pl-10 pr-4 py-2 bg-[#ffffff] border border-[#c0c8c4] rounded-xl text-sm text-[#211b08] placeholder-[#707976] focus:outline-none focus:ring-2 focus:ring-[#01372e] focus:border-transparent shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#707976] hover:text-[#211b08]"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>
          </InteractiveIndicator>
        </div>

        {/* Acciones de la derecha: WhatsApp directo, Carrito y Perfil */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          {/* Botón WhatsApp Mayorista (Desktop y Tablet) */}
          <InteractiveIndicator
            label="Contacto WhatsApp Directo"
            devices={['tablet', 'pc']}
            actionDesc="Abre chat directo con Karim con saludo institucional preparado"
            isActive={guideMode}
          >
            <a
              href={`https://wa.me/${KARIM_CONTACT.phoneInternational}?text=Hola%20Karim,%20quiero%20hacer%20un%20pedido%20mayorista%20en%20Los%20Turquitos`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#01372e] hover:bg-[#1f4e44] text-[#ffffff] text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px] text-[#1ebe5d]">chat</span>
              <span className="hidden lg:inline">WhatsApp Mayorista</span>
              <span className="lg:hidden">Karim</span>
            </a>
          </InteractiveIndicator>

          {/* Botón Búsqueda Rápida en Móvil */}
          <button
            type="button"
            onClick={() => onNavigate('catalogo')}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-[#01372e] hover:bg-[#faedcd] transition-colors"
            aria-label="Ir al catálogo y buscar"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          {/* Carrito de Compra con Contador y Precio */}
          <InteractiveIndicator
            label="Acceso a Carrito / Remito"
            devices={['celular', 'tablet', 'pc']}
            actionDesc="Abre el resumen de ítems, cálculo de bultos cerrados y datos del remito"
            isActive={guideMode}
          >
            <button
              type="button"
              onClick={() => onNavigate('carrito')}
              className={`relative flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-xl transition-all ${
                activeView === 'carrito'
                  ? 'bg-[#1f4e44] text-[#ffffff] shadow-sm'
                  : 'bg-[#f4e7c8] hover:bg-[#efe1c2] text-[#01372e]'
              }`}
              aria-label="Ver carrito mayorista"
            >
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
                <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 bg-[#842401] text-[#ffffff] font-mono text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {cartCount}
                </span>
              </div>
              <div className="hidden lg:flex flex-col text-right pl-1">
                <span className="font-mono text-[10px] uppercase text-[#404846] leading-none">
                  Total
                </span>
                <span className="font-mono font-bold text-sm text-[#01372e] leading-tight">
                  ${cartTotal.toLocaleString('es-AR')}
                </span>
              </div>
            </button>
          </InteractiveIndicator>

          {/* Avatar oficial */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden ring-2 ring-[#01372e]/20 shrink-0">
            <img
              src={BRAND_AVATAR_URL}
              alt="Perfil Los Turquitos"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* ====================================================================
          NIVEL 3: BARRA DE NAVEGACIÓN EN PESTAÑAS (Visible en Tablet y PC)
          Comportamiento: [📟 TABLET] y [💻 PC]. En [📱 CELULARES] se usa
          la barra inferior 'MobileBottomNav'.
          ==================================================================== */}
      <nav className="hidden md:block bg-[#fff3d7] border-t border-[#efe1c2]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-1 sm:gap-2 py-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => onNavigate('inicio')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeView === 'inicio'
                  ? 'bg-[#1f4e44] text-[#ffffff] shadow-sm font-bold'
                  : 'text-[#404846] hover:text-[#01372e] hover:bg-[#faedcd]'
              }`}
            >
              Inicio
            </button>

            <button
              type="button"
              onClick={() => onNavigate('catalogo')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeView === 'catalogo'
                  ? 'bg-[#1f4e44] text-[#ffffff] shadow-sm font-bold'
                  : 'text-[#404846] hover:text-[#01372e] hover:bg-[#faedcd]'
              }`}
            >
              Catálogo Mayorista
            </button>

            <button
              type="button"
              onClick={() => {
                onNavigate('catalogo');
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors text-[#404846] hover:text-[#01372e] hover:bg-[#faedcd] flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px] text-[#842401]">local_fire_department</span>
              <span>Ofertas de la Semana</span>
            </button>

            <button
              type="button"
              onClick={onOpenHowToBuy}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeView === 'como-comprar'
                  ? 'bg-[#1f4e44] text-[#ffffff] shadow-sm font-bold'
                  : 'text-[#404846] hover:text-[#01372e] hover:bg-[#faedcd]'
              }`}
            >
              Cómo Comprar
            </button>

            <a
              href={`https://wa.me/${KARIM_CONTACT.phoneInternational}?text=Hola%20Karim,%20te%20contacto%20desde%20la%20plataforma%20de%20Los%20Turquitos`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors text-[#01372e] hover:bg-[#faedcd] flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px] text-[#1ebe5d]">chat</span>
              <span>Contacto directo Karim</span>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};
