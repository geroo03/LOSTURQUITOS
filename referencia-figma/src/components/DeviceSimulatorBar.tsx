/**
 * ============================================================================
 * COMPONENTE: src/components/DeviceSimulatorBar.tsx
 * PROYECTO: Los Turquitos - Especiera Mayorista
 * ----------------------------------------------------------------------------
 * NOTA PARA CLAUDE / DESARROLLADOR:
 * Este componente responde directamente a la solicitud del usuario:
 * "indicador de los elementos interactivos y la estructura de componentes,
 * y de que si son celulares, tablets y pc y que sea responsiva para adaptar
 * el diseño a cada dispositivo".
 *
 * FUNCIONALIDADES:
 * 1. Selector de Modo de Dispositivo:
 *    - 📱 Celular (390px - Ancho iPhone/Android estándar)
 *    - 📟 Tablet (820px - Ancho iPad/Tablet estándar de los screenshots)
 *    - 💻 PC / Escritorio (1280px - Ancho completo de escritorio)
 *    - 🔄 Responsivo Real (Se adapta automáticamente al viewport del navegador)
 * 2. Interruptor "Modo Guía / Interactividad":
 *    - Muestra insignias explicativas sobre los elementos interactivos (botones,
 *      steppers, selector de embalaje, generador de WhatsApp, filtros).
 * 3. Indicador de Breakpoint en tiempo real con explicación de comportamiento.
 * ============================================================================
 */

import React from 'react';
import { DeviceViewMode } from '../types.ts';

interface DeviceSimulatorBarProps {
  deviceMode: DeviceViewMode;
  onDeviceModeChange: (mode: DeviceViewMode) => void;
  guideMode: boolean;
  onToggleGuideMode: () => void;
  activeView: string;
}

export const DeviceSimulatorBar: React.FC<DeviceSimulatorBarProps> = ({
  deviceMode,
  onDeviceModeChange,
  guideMode,
  onToggleGuideMode,
  activeView,
}) => {
  return (
    <aside
      aria-label="Panel de control de simulación responsiva y guía técnica"
      className="bg-[#00201a] text-[#fff8f0] border-b border-[#204e44] px-3 py-2 text-xs select-none sticky top-0 z-[60] shadow-md"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Lado izquierdo: Identificador y descripción del dispositivo */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#1ebe5d] animate-pulse"></span>
          <span className="font-bold tracking-wide uppercase text-[11px] text-[#bceddf]">
            Simulador de Dispositivo & Guía:
          </span>
          <span className="hidden sm:inline text-[#a0d0c3] text-[11px]">
            {deviceMode === 'mobile' && '📱 Celular (390px) · Barra inferior y flujo vertical'}
            {deviceMode === 'tablet' && '📟 Tablet (820px) · Cabecera 2 pisos y grillas 8 cols'}
            {deviceMode === 'desktop' && '💻 PC / Escritorio (1280px) · 12 columnas y filtros fijos'}
            {deviceMode === 'auto' && '🔄 Responsivo Fluido (Auto según tu pantalla)'}
          </span>
        </div>

        {/* Centro: Botones para alternar entre Celular, Tablet, PC y Auto */}
        <div className="flex items-center bg-[#01372e] rounded-lg p-0.5 border border-[#204e44]">
          <button
            type="button"
            onClick={() => onDeviceModeChange('mobile')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all ${
              deviceMode === 'mobile'
                ? 'bg-[#1f4e44] text-[#ffffff] shadow-sm font-bold ring-1 ring-[#a0d0c3]'
                : 'text-[#c0c8c4] hover:text-[#ffffff] hover:bg-[#1f4e44]/40'
            }`}
            title="Vista Móvil / Celular (390px)"
          >
            <span>📱</span>
            <span className="hidden md:inline">Celular</span>
          </button>

          <button
            type="button"
            onClick={() => onDeviceModeChange('tablet')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all ${
              deviceMode === 'tablet'
                ? 'bg-[#1f4e44] text-[#ffffff] shadow-sm font-bold ring-1 ring-[#a0d0c3]'
                : 'text-[#c0c8c4] hover:text-[#ffffff] hover:bg-[#1f4e44]/40'
            }`}
            title="Vista Tablet (820px)"
          >
            <span>📟</span>
            <span className="hidden md:inline">Tablet</span>
          </button>

          <button
            type="button"
            onClick={() => onDeviceModeChange('desktop')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all ${
              deviceMode === 'desktop'
                ? 'bg-[#1f4e44] text-[#ffffff] shadow-sm font-bold ring-1 ring-[#a0d0c3]'
                : 'text-[#c0c8c4] hover:text-[#ffffff] hover:bg-[#1f4e44]/40'
            }`}
            title="Vista Escritorio / PC (1280px)"
          >
            <span>💻</span>
            <span className="hidden md:inline">PC / Escritorio</span>
          </button>

          <button
            type="button"
            onClick={() => onDeviceModeChange('auto')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all ${
              deviceMode === 'auto'
                ? 'bg-[#1f4e44] text-[#ffffff] shadow-sm font-bold ring-1 ring-[#a0d0c3]'
                : 'text-[#c0c8c4] hover:text-[#ffffff] hover:bg-[#1f4e44]/40'
            }`}
            title="Responsivo Dinámico Natural"
          >
            <span>🔄</span>
            <span className="hidden md:inline">Auto</span>
          </button>
        </div>

        {/* Lado derecho: Interruptor de Modo Guía para Claude / Revisor */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleGuideMode}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              guideMode
                ? 'bg-[#d6a331] text-[#201a12] shadow-sm ring-2 ring-[#fff8f0]'
                : 'bg-[#1f4e44] text-[#cbe9df] hover:bg-[#204e44]'
            }`}
            title="Activar/desactivar insignias visuales sobre elementos interactivos"
          >
            <span>{guideMode ? '💡 Modo Guía ACTIVO' : '💡 Ver Indicadores'}</span>
          </button>

          <span className="text-[10px] text-[#c0c8c4] font-mono hidden lg:inline">
            Vista: <span className="text-[#bceddf] font-bold">{activeView.toUpperCase()}</span>
          </span>
        </div>
      </div>
    </aside>
  );
};
