/**
 * ============================================================================
 * COMPONENTE: src/components/views/HowToBuyModal.tsx
 * PROYECTO: Los Turquitos - Especiera Mayorista
 * ----------------------------------------------------------------------------
 * NOTA PARA CLAUDE / DESARROLLADOR:
 * Modal explicativo para compradores B2B que detalla el flujo de compra
 * transparente sin pasarelas de pago engorrosas:
 * 1. Selección de bultos o kilos fraccionados.
 * 2. Armado de lista y remito con CUIT / Expreso.
 * 3. Pesaje en balanza y confirmación por WhatsApp con Karim.
 * ============================================================================
 */

import React from 'react';
import { KARIM_CONTACT } from '../../data/mockData.ts';

interface HowToBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToCatalog: () => void;
}

export const HowToBuyModal: React.FC<HowToBuyModalProps> = ({
  isOpen,
  onClose,
  onGoToCatalog,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211b08]/50 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-[#fff8f0] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#faedcd] relative max-h-[90vh] overflow-y-auto">
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#faedcd] text-[#01372e] flex items-center justify-center hover:bg-[#efe1c2] transition-colors"
          aria-label="Cerrar modal"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-2 text-[#842401] mb-2 font-mono text-xs uppercase tracking-wider font-bold">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>Proceso Transparente B2B</span>
        </div>

        <h2 id="modal-title" className="font-serif text-2xl sm:text-3xl text-[#01372e] font-bold leading-tight">
          ¿Cómo comprar en Los Turquitos?
        </h2>
        <p className="text-sm text-[#404846] mt-1 mb-6">
          Sin registros engorrosos ni pagos adelantados con tarjeta. Atención humana directa con Karim.
        </p>

        {/* Los 3 pasos estructurados */}
        <div className="space-y-4">
          {/* Paso 1 */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-[#fff3d7] border border-[#efe1c2]">
            <div className="w-10 h-10 rounded-xl bg-[#01372e] text-[#ffffff] font-mono font-bold flex items-center justify-center shrink-0">
              01
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#01372e]">
                Elegí tus bultos o kilos fraccionados
              </h3>
              <p className="text-xs sm:text-sm text-[#404846] mt-1">
                Explorá el catálogo de especias, frutos secos, semillas y conservas. Podés pedir desde 1 kilo fraccionado hasta bolsas cerradas de 25kg con escala de descuentos.
              </p>
            </div>
          </div>

          {/* Paso 2 */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-[#fff3d7] border border-[#efe1c2]">
            <div className="w-10 h-10 rounded-xl bg-[#01372e] text-[#ffffff] font-mono font-bold flex items-center justify-center shrink-0">
              02
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#01372e]">
                Revisá tu resumen de compra
              </h3>
              <p className="text-xs sm:text-sm text-[#404846] mt-1">
                Chequeá los kilos totales en el remito. Indicá si retirás por el depósito central en Parque Patricios o a qué expreso de Villa Soldati/Pompeya te lo enviamos.
              </p>
            </div>
          </div>

          {/* Paso 3 */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-[#c8e6dd]/50 border border-[#a0d0c3]">
            <div className="w-10 h-10 rounded-xl bg-[#1ebe5d] text-[#ffffff] font-mono font-bold flex items-center justify-center shrink-0">
              03
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#01372e]">
                Karim confirma tu pedido al WhatsApp
              </h3>
              <p className="text-xs sm:text-sm text-[#404846] mt-1">
                Pesamos tu mercadería en báscula con exactitud, te enviamos el remito con número de lote y coordinamos el despacho inmediato en 24 a 48 hs.
              </p>
            </div>
          </div>
        </div>

        {/* Datos logísticos rápidos */}
        <div className="mt-6 p-4 rounded-xl bg-[#faedcd] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#01372e] text-[20px]">local_shipping</span>
            <span className="text-[#211b08] font-medium">
              Pedido mínimo mayorista: <strong>${KARIM_CONTACT.minOrderWholesale.toLocaleString('es-AR')}</strong>
            </span>
          </div>
          <span className="font-mono font-bold text-[#842401] bg-[#ffffff] px-2 py-1 rounded">
            DESPACHO DIARIO EN EXPRESOS
          </span>
        </div>

        {/* Botones de acción */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onGoToCatalog();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-[#01372e] hover:bg-[#1f4e44] text-[#ffffff] font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>Explorar catálogo ahora</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
          <a
            href={`https://wa.me/${KARIM_CONTACT.phoneInternational}?text=Hola%20Karim,%20tengo%20dudas%20sobre%20como%20comprar%20por%20mayor`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-5 rounded-xl bg-[#1ebe5d] hover:bg-[#19a550] text-[#ffffff] font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>Consultar a Karim</span>
          </a>
        </div>
      </div>
    </div>
  );
};
