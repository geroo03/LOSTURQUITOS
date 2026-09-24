/**
 * ============================================================================
 * COMPONENTE: src/components/Footer.tsx
 * PROYECTO: Los Turquitos - Especiera Mayorista
 * ----------------------------------------------------------------------------
 * NOTA PARA CLAUDE / DESARROLLADOR:
 * Este componente implementa el pie de página mayorista con información
 * operativa crítica para compradores B2B:
 * - Contacto comercial con Karim.
 * - Logística y despachos a expresos (Villa Soldati, Pompeya, Parque Patricios).
 * - Garantías botánicas, análisis SENASA y horarios de expedición.
 *
 * RESPONSIVIDAD:
 * - [📱 CELULARES]: Se apila en 1 sola columna con espaciado cómodo.
 * - [📟 TABLETS]: 3 columnas equilibradas con divisores limpios.
 * - [💻 PC / ESCRITORIO]: 4 columnas completas con bloque de marca y horarios.
 * ============================================================================
 */

import React from 'react';
import { KARIM_CONTACT } from '../data/mockData.ts';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#f4e7c8] text-[#211b08] mt-16 border-t border-[#efe1c2] shadow-[0_-4px_24px_rgba(1,55,46,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Grilla responsiva de columnas informativas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Columna 1: Identidad & Depósito */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#01372e] flex items-center justify-center text-white font-serif font-bold text-sm">
                LT
              </div>
              <span className="font-serif font-bold text-lg text-[#01372e]">
                Los Turquitos
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#404846] leading-relaxed">
              Abastecimiento mayorista de especias, condimentos puros, semillas y frutos secos para
              gastronomía, distribuidores y dietéticas de todo el país.
            </p>
            <div className="inline-block px-2.5 py-1 rounded bg-[#faedcd] text-[#01372e] font-mono text-[11px] font-semibold">
              DEPÓSITO CENTRAL: {KARIM_CONTACT.depositoAddress.toUpperCase()}
            </div>
          </div>

          {/* Columna 2: Atención Karim */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-[#01372e]">
              <span className="material-symbols-outlined text-[20px] text-[#1ebe5d]">support_agent</span>
              <h4 className="font-serif font-bold text-base">Atención Mayorista</h4>
            </div>
            <p className="text-xs sm:text-sm text-[#404846]">
              <strong className="text-[#211b08]">Karim y Equipo Comercial</strong>
              <br />
              Venta por bolsa cerrada, medio saco y bulto cerrado fraccionado.
            </p>
            <div className="pt-1 space-y-1 text-xs sm:text-sm font-mono text-[#01372e] font-semibold">
              <a
                href={`https://wa.me/${KARIM_CONTACT.phoneInternational}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-[#1ebe5d] transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">call</span>
                <span>{KARIM_CONTACT.phoneDisplay}</span>
              </a>
              <p className="flex items-center gap-1 text-[#404846]">
                <span className="material-symbols-outlined text-[16px]">mail</span>
                <span>ventas@losturquitos.com.ar</span>
              </p>
            </div>
          </div>

          {/* Columna 3: Logística de Expresos */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-[#01372e]">
              <span className="material-symbols-outlined text-[20px] text-[#49645c]">local_shipping</span>
              <h4 className="font-serif font-bold text-base">Logística de Expresos</h4>
            </div>
            <ul className="text-xs sm:text-sm text-[#404846] space-y-1">
              <li>• Despachos diarios a expresos en Villa Soldati y Pompeya</li>
              <li>• Entregas coordinadas en depósitos del interior del país</li>
              <li>• Precintos de seguridad numerados en cada bulto</li>
              <li>• Pallets completos bonificados desde 250 KG</li>
            </ul>
            <span className="inline-block font-mono text-[10px] uppercase font-bold text-[#49645c] bg-[#c8e6dd] px-2 py-0.5 rounded">
              DESPACHO EN 24/48 HS
            </span>
          </div>

          {/* Columna 4: Garantía de Calidad & Horarios */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-[#01372e]">
              <span className="material-symbols-outlined text-[20px] text-[#842401]">verified</span>
              <h4 className="font-serif font-bold text-base">Garantía de Calidad</h4>
            </div>
            <p className="text-xs sm:text-sm text-[#404846]">
              Lotes frescos con rotación semanal. Molido propio de pimentón, comino y ají molido de Cachi, Salta.
            </p>
            <div className="p-3 rounded-lg bg-[#fff3d7] border border-[#efe1c2]">
              <span className="block font-mono text-[10px] text-[#1f4e44] uppercase font-bold mb-1">
                HORARIO DE EXPEDICIÓN
              </span>
              <span className="text-xs text-[#211b08] block leading-tight">
                Lunes a Viernes: 07:00 - 16:00 hs
                <br />
                Sábados: 07:00 - 12:30 hs
              </span>
            </div>
          </div>
        </div>

        {/* Barra legal inferior */}
        <div className="pt-6 border-t border-[#efe1c2] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#404846]">
          <p>© 2025 Los Turquitos Especiera Mayorista. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-wider">
            <span>Precios sin IVA expresados en ARS</span>
            <span>•</span>
            <span>Venta exclusiva a comercios y profesionales</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
