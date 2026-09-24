/**
 * ============================================================================
 * COMPONENTE: src/components/InteractiveIndicator.tsx
 * PROYECTO: Los Turquitos - Especiera Mayorista
 * ----------------------------------------------------------------------------
 * NOTA PARA CLAUDE / DESARROLLADOR:
 * Este componente es un contenedor informativo que resalta los elementos
 * interactivos cuando el usuario o evaluador activa el "Modo Guía".
 *
 * Indica:
 * - Nombre y acción del control (ej: "Stepper Mayorista", "Filtro de Rubro", "WhatsApp Trigger")
 * - Dispositivos en los que está activo: [📱 Celular], [📟 Tablet], [💻 PC]
 * - Comportamiento de estado (cálculo de subtotal, apertura de drawer, etc.)
 * ============================================================================
 */

import React from 'react';

interface InteractiveIndicatorProps {
  label: string;
  devices?: ('celular' | 'tablet' | 'pc')[];
  actionDesc?: string;
  isActive: boolean;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
}

export const InteractiveIndicator: React.FC<InteractiveIndicatorProps> = ({
  label,
  devices = ['celular', 'tablet', 'pc'],
  actionDesc,
  isActive,
  children,
  position = 'top',
}) => {
  if (!isActive) {
    return <>{children}</>;
  }

  const deviceIcons = devices
    .map((d) => (d === 'celular' ? '📱' : d === 'tablet' ? '📟' : '💻'))
    .join(' ');

  return (
    <div className="relative group/guide ring-2 ring-[#d6a331]/80 rounded-xl transition-all">
      <span
        className={`absolute z-30 pointer-events-none bg-[#201a12] text-[#fff8f0] text-[10px] font-mono px-2 py-0.5 rounded shadow-md flex items-center gap-1 border border-[#d6a331] whitespace-nowrap opacity-90 group-hover/guide:opacity-100 ${
          position === 'top' ? '-top-3 left-2' : '-bottom-3 right-2'
        }`}
      >
        <span className="text-[#d6a331] font-bold">⚡ INTERACTIVO</span>
        <span>|</span>
        <span className="font-semibold text-[#bceddf]">{label}</span>
        <span className="text-[9px] opacity-80">({deviceIcons})</span>
      </span>

      {children}

      {actionDesc && (
        <div className="hidden group-hover/guide:block absolute z-40 top-full left-2 mt-1 bg-[#01372e] text-[#ffffff] text-[11px] p-2 rounded-lg shadow-xl max-w-xs border border-[#a0d0c3] pointer-events-none">
          <p className="font-bold text-[#bceddf] mb-0.5">Indicación técnica:</p>
          <p className="text-xs leading-tight opacity-95">{actionDesc}</p>
        </div>
      )}
    </div>
  );
};
