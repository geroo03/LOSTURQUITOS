/**
 * ============================================================================
 * COMPONENTE: src/components/views/HomeView.tsx
 * PROYECTO: Los Turquitos - Especiera Mayorista
 * ----------------------------------------------------------------------------
 * NOTA PARA CLAUDE / DESARROLLADOR:
 * Vista de Inicio / Mercado estructurada con arquitectura Bento Grid:
 *
 * SECCIONES:
 * 1. Hero Bento Card: Presentación mayorista, mínimo accesible ($15.000), y
 *    en Tablet/Desktop panel lateral de contacto directo con Karim.
 * 2. Chips de Categorías rápidas deslizables.
 * 3. Mosaico Bento de Rubros (Frutos Secos, Alicante, Pimentón Calchaquí,
 *    Aceitunas N°1 y Harinas puras).
 * 4. Bloque "¿Cómo comprar en Los Turquitos?" (3 Pasos B2B sin pasarelas).
 * 5. Grilla "Precios de Esta Semana" con steppers interactivos (- 1 +) y
 *    botón de agregar rápido con animación reactiva.
 * 6. Banner de asistencia directa WhatsApp y tarjetas de logística.
 *
 * RESPONSIVIDAD:
 * - [📱 CELULARES]: Flujo vertical fluido con carruseles horizontales.
 * - [📟 TABLETS]: Bento de 8 columnas y 2 tarjetas por fila.
 * - [💻 PC]: Bento de 12 columnas con tarjeta hero dividida (8 + 4).
 * ============================================================================
 */

import React, { useState } from 'react';
import { Product, ProductCategory } from '../../types.ts';
import { KARIM_CONTACT } from '../../data/mockData.ts';
import { InteractiveIndicator } from '../InteractiveIndicator.tsx';

interface HomeViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantityKg: number) => void;
  onGoToCatalog: (category?: ProductCategory) => void;
  guideMode: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onGoToCatalog,
  guideMode,
}) => {
  // Cantidades locales para los productos destacados de la semana
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'pimenton-dulce-alicante': 1,
    'comino-en-grano-puro': 2,
    'pimienta-negra-en-grano': 1,
    'mix-premium-frutos-secos': 1,
  });

  const handleAdjustQty = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[productId] ?? 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const handleQuickAdd = (product: Product) => {
    const qty = quantities[product.id] ?? 1;
    onAddToCart(product, qty);
  };

  // 4 productos destacados para la grilla semanal
  const weeklyProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col gap-6 sm:gap-8 pb-12">
      {/* ====================================================================
          1. HERO BENTO (Span 12 en Móvil, Split 8 + 4 en Tablet/Desktop)
          ==================================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Tarjeta Principal Heroica (Span 8 en Desktop) */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-2xl bg-[#f4e7c8] p-5 sm:p-7 shadow-sm flex flex-col justify-between border border-[#efe1c2]">
          {/* Brillo ambiental */}
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#1f4e44]/10 pointer-events-none blur-3xl"></div>

          <div className="flex flex-col gap-3 relative z-10">
            <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-[#ffffff] shadow-sm border border-[#efe1c2]">
              <span className="material-symbols-outlined text-[#842401] text-[16px]">verified</span>
              <span className="font-mono text-[11px] text-[#211b08] font-bold uppercase tracking-wider">
                Mínimo accesible · Desde ${KARIM_CONTACT.minOrderWholesale.toLocaleString('es-AR')}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#01372e] leading-tight font-bold">
              Condimentos, frutos secos y especias a precio de mayorista
            </h1>

            <p className="text-sm sm:text-base text-[#404846] leading-relaxed max-w-xl">
              Precios directos de molienda y fraccionado para tu almacén, dietética o restaurante.
              Pedí fácil por bulto cerrado o kilo fraccionado con despacho directo a expresos.
            </p>
          </div>

          {/* Imagen integrada y botón CTA */}
          <div className="mt-6 pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 relative z-10">
            <InteractiveIndicator
              label="Botón Catálogo Completo"
              devices={['celular', 'tablet', 'pc']}
              actionDesc="Navega a la vista de catálogo general con filtros activos"
              isActive={guideMode}
            >
              <button
                type="button"
                onClick={() => onGoToCatalog()}
                className="w-full sm:w-auto h-12 px-6 rounded-xl bg-[#01372e] hover:bg-[#1f4e44] text-[#ffffff] flex items-center justify-center gap-2 font-semibold text-sm shadow-md transition-all active:scale-[0.98]"
              >
                <span>Ver catálogo completo</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </InteractiveIndicator>

            <div className="flex items-center justify-center sm:justify-start gap-2 font-mono text-[11px] text-[#404846]">
              <span className="w-2 h-2 rounded-full bg-[#1ebe5d] animate-ping"></span>
              <span>Actualización de lista:</span>
              <strong className="text-[#01372e]">Hoy 08:30 hs</strong>
            </div>
          </div>
        </div>

        {/* Tarjeta Lateral de Atención Directa Karim (Span 4 en Desktop, oculta o apilada) */}
        <div className="lg:col-span-4 rounded-2xl bg-[#01372e] text-[#ffffff] p-5 sm:p-7 shadow-sm flex flex-col justify-between relative overflow-hidden border border-[#204e44]">
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-[#1f4e44] text-[#bceddf] font-mono text-[10px] uppercase font-bold tracking-wider">
                CANAL B2B DIRECTO
              </span>
              <span className="material-symbols-outlined text-[#bceddf] text-[22px]">badge</span>
            </div>

            <h2 className="font-serif text-xl sm:text-2xl text-[#ffffff] font-bold mt-1">
              Atención directa con Karim
            </h2>
            <p className="text-xs sm:text-sm text-[#8ebeb1] leading-relaxed">
              ¿Tenés una lista grande o necesitás cotización especial por pallet? Escribile a Karim y
              te manda el remito en 15 minutos.
            </p>
          </div>

          <div className="mt-5 pt-2 flex flex-col gap-2 relative z-10">
            <div className="bg-[#1f4e44]/80 p-2.5 rounded-xl flex items-center justify-between border border-[#a0d0c3]/20">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-[#bceddf] uppercase">WhatsApp Mayorista</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-white">
                  {KARIM_CONTACT.phoneDisplay}
                </span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-[#1ebe5d] animate-pulse"></span>
            </div>

            <InteractiveIndicator
              label="Botón WhatsApp Inmediato"
              devices={['celular', 'tablet', 'pc']}
              actionDesc="Inicia conversación directa de WhatsApp con Karim"
              isActive={guideMode}
            >
              <a
                href={`https://wa.me/${KARIM_CONTACT.phoneInternational}?text=Hola%20Karim,%20quiero%20consultar%20por%20un%20pedido%20mayorista`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-[#1ebe5d] hover:bg-[#19a550] text-[#ffffff] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Hablar con Karim ahora</span>
              </a>
            </InteractiveIndicator>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. CHIPS DE CATEGORÍAS RÁPIDAS (Scroll horizontal suave)
          ==================================================================== */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-mono text-xs uppercase text-[#842401] font-bold tracking-wider">
            Categorías Principales
          </span>
          <span className="text-xs text-[#49645c] font-medium hidden sm:inline">Deslizá →</span>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => onGoToCatalog('destacados')}
            className="shrink-0 px-4 py-2 rounded-xl bg-[#01372e] text-[#ffffff] text-xs sm:text-sm font-semibold shadow-sm flex items-center gap-1.5 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[16px] text-[#ffb59e]">bolt</span>
            <span>Destacados</span>
          </button>

          <button
            type="button"
            onClick={() => onGoToCatalog('frutos-secos')}
            className="shrink-0 px-4 py-2 rounded-xl bg-[#f4e7c8] text-[#211b08] hover:bg-[#efe1c2] text-xs sm:text-sm font-semibold shadow-sm transition-colors"
          >
            Frutos Secos
          </button>

          <button
            type="button"
            onClick={() => onGoToCatalog('alicante')}
            className="shrink-0 px-4 py-2 rounded-xl bg-[#f4e7c8] text-[#211b08] hover:bg-[#efe1c2] text-xs sm:text-sm font-semibold shadow-sm transition-colors"
          >
            Condimentos Alicante
          </button>

          <button
            type="button"
            onClick={() => onGoToCatalog('especias')}
            className="shrink-0 px-4 py-2 rounded-xl bg-[#f4e7c8] text-[#211b08] hover:bg-[#efe1c2] text-xs sm:text-sm font-semibold shadow-sm transition-colors"
          >
            Especias Puras
          </button>

          <button
            type="button"
            onClick={() => onGoToCatalog('conservas')}
            className="shrink-0 px-4 py-2 rounded-xl bg-[#f4e7c8] text-[#211b08] hover:bg-[#efe1c2] text-xs sm:text-sm font-semibold shadow-sm transition-colors"
          >
            Aceitunas y Conservas
          </button>

          <button
            type="button"
            onClick={() => onGoToCatalog('semillas-harinas')}
            className="shrink-0 px-4 py-2 rounded-xl bg-[#f4e7c8] text-[#211b08] hover:bg-[#efe1c2] text-xs sm:text-sm font-semibold shadow-sm transition-colors"
          >
            Semillas y Harinas
          </button>
        </div>
      </section>

      {/* ====================================================================
          3. MOSAICO BENTO DE RUBROS (Grid asimétrico responsive)
          - [📱 CELULAR]: 2 columnas compactas
          - [📟 TABLET]: 8 columnas
          - [💻 PC]: 12 columnas con visualización amplia
          ==================================================================== */}
      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between px-1">
          <h2 className="font-serif text-xl sm:text-2xl text-[#01372e] font-bold">Navegar por Rubro</h2>
          <button
            type="button"
            onClick={() => onGoToCatalog()}
            className="text-xs sm:text-sm font-bold text-[#49645c] hover:text-[#01372e] transition-colors"
          >
            Ver todo →
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Tile 1 Grande: Frutos Secos (Span 2 en Celular/Tablet, Span 2 en PC) */}
          <div
            onClick={() => onGoToCatalog('frutos-secos')}
            className="col-span-2 relative overflow-hidden rounded-2xl bg-[#ffffff] p-4 sm:p-5 shadow-sm hover:shadow-md transition-all cursor-pointer h-48 sm:h-52 flex flex-col justify-between border border-[#efe1c2] group"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwF-ZizsPv1Kr42D4G2AD5lXNRvgDS3vIIDJ38_J7UyVYGfbaLuC3cuWw1723ko7a_-FOm3DuCTcGAsLWo6KV4-K2RbrG2bG5v5xPR3FzliDrw9vxZULZfKGCBTGeYX0-EY0Kv2j3f9rO5ielwhDJTpd-6qt1WBL4WnGS9JBcTzZfahf_FSly9VM06EX-_EhLG3n0CT2ctijaHvJqOFpJ-4nBSxotNCpYqgmtSzZ1ueeqNht0d7eze"
              alt="Frutos Secos Mayoristas"
              className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="relative z-10 flex justify-between items-start">
              <span className="font-mono text-[10px] bg-[#842401] text-[#ffffff] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Top Ventas
              </span>
              <span className="w-8 h-8 rounded-full bg-[#faedcd]/80 backdrop-blur-sm flex items-center justify-center text-[#01372e] group-hover:bg-[#01372e] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[18px]">north_east</span>
              </span>
            </div>

            <div className="relative z-10 bg-[#ffffff]/90 backdrop-blur-md -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 p-3 sm:p-4 rounded-b-2xl flex flex-col">
              <span className="font-serif font-bold text-base sm:text-lg text-[#01372e] leading-tight">
                Frutos Secos Premium
              </span>
              <span className="text-xs text-[#404846] truncate mt-0.5">
                Almendras Nonpareil, nueces Chandler y mixes por kilo
              </span>
            </div>
          </div>

          {/* Tile 2: Alicante Mayorista */}
          <div
            onClick={() => onGoToCatalog('alicante')}
            className="col-span-1 relative overflow-hidden rounded-2xl bg-[#f4e7c8] p-3 sm:p-4 shadow-sm hover:shadow-md transition-all cursor-pointer h-44 sm:h-48 flex flex-col justify-between border border-[#efe1c2] group"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZ2dfxKZQrTzjtu4MAJJrz6RCKFlB0vX0gofxZZd5ZUfvriZ1iYi0FwnSz_JR6mhiK0wyH35IPSpjFBEuUy_lU46Tp4uacazK1PmDtxZP2nVJySmAy5W3ytII1UrYWuQJIw7dtWDAs5_BsuuRvNgEQe5_nzxr9VHtMNvffYxv3x0jeHRdMJcbS_gtswCOfGYuV0hfXEq5rxXi8iVQeYa2o4RP6Mj8q5aZRNe-RIHaEE_zqoFzktPBj"
              alt="Línea Alicante"
              className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="relative z-10 flex justify-end">
              <span className="w-7 h-7 rounded-full bg-[#ffffff]/80 flex items-center justify-center text-[#01372e]">
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </span>
            </div>
            <div className="relative z-10 flex flex-col">
              <span className="font-mono text-[9px] sm:text-[10px] text-[#5d1700] font-bold tracking-wider uppercase">
                Línea Oficial
              </span>
              <span className="font-serif text-sm sm:text-base font-bold text-[#01372e] leading-snug">
                Alicante Mayorista
              </span>
              <span className="text-[11px] text-[#404846]">Tiras y displays cerrados</span>
            </div>
          </div>

          {/* Tile 3: Pimentón & Ají */}
          <div
            onClick={() => onGoToCatalog('especias')}
            className="col-span-1 relative overflow-hidden rounded-2xl bg-[#f4e7c8] p-3 sm:p-4 shadow-sm hover:shadow-md transition-all cursor-pointer h-44 sm:h-48 flex flex-col justify-between border border-[#efe1c2] group"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7jaROJll-6FMMMFYNCvLlHx4LF8AtPaowV2mvjURSQ1wehHyr91JFYdqPzoe13SZYEVxKVF3zgb2bND1likezQoQE6kq3HNRLjrvmTbUm7-ChFLpucdK3QCmPuzXJxIKG4hlrEwGqZcLggK7WevS17f4CHzY-Ab10gcWo1F7FRJTiFSGeMmEH73pskIoaHiBm-K3actejYiTAjs6ct9hJtnOChKq7FH-eu9Ie47QIPxJ-wKBhlnEZ"
              alt="Pimentón y Ají"
              className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="relative z-10 flex justify-end">
              <span className="w-7 h-7 rounded-full bg-[#ffffff]/80 flex items-center justify-center text-[#01372e]">
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </span>
            </div>
            <div className="relative z-10 flex flex-col">
              <span className="font-mono text-[9px] sm:text-[10px] text-[#5d1700] font-bold tracking-wider uppercase">
                Valles Calchaquíes
              </span>
              <span className="font-serif text-sm sm:text-base font-bold text-[#01372e] leading-snug">
                Pimentón & Ají
              </span>
              <span className="text-[11px] text-[#404846]">Puro x bolsa</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. BENTO: CÓMO COMPRAR EN 3 PASOS (Fondo Verde Petróleo #01372e)
          ==================================================================== */}
      <section className="rounded-2xl bg-[#01372e] text-[#ffffff] p-5 sm:p-7 shadow-sm flex flex-col gap-4 relative overflow-hidden border border-[#204e44]">
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-48 h-48 rounded-full bg-[#39675c]/20 blur-3xl pointer-events-none"></div>

        <div className="flex flex-col gap-1 relative z-10">
          <div className="inline-flex items-center gap-1 text-[#bceddf]">
            <span className="material-symbols-outlined text-[16px]">help_center</span>
            <span className="font-mono text-[11px] uppercase tracking-wider font-bold">
              Sin registros engorrosos
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-[#ffffff] font-bold">
            ¿Cómo comprar en Los Turquitos?
          </h3>
          <p className="text-xs sm:text-sm text-[#8ebeb1]">
            Simple, ágil y con atención humana personalizada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10">
          {/* Paso 1 */}
          <div className="flex items-start gap-3 bg-[#1f4e44]/70 p-3.5 rounded-xl border border-[#a0d0c3]/20">
            <div className="w-8 h-8 rounded-lg bg-[#efe1c2]/20 text-white font-mono font-bold flex items-center justify-center shrink-0 text-xs">
              01
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm font-bold text-white leading-snug">
                Elegí cantidades por kilo o bulto
              </span>
              <span className="text-[11px] sm:text-xs text-[#8ebeb1] mt-0.5">
                Explorá el catálogo y sumá bolsas o fracciones directo al carrito.
              </span>
            </div>
          </div>

          {/* Paso 2 */}
          <div className="flex items-start gap-3 bg-[#1f4e44]/70 p-3.5 rounded-xl border border-[#a0d0c3]/20">
            <div className="w-8 h-8 rounded-lg bg-[#efe1c2]/20 text-white font-mono font-bold flex items-center justify-center shrink-0 text-xs">
              02
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm font-bold text-white leading-snug">
                Revisá tu resumen de compra
              </span>
              <span className="text-[11px] sm:text-xs text-[#8ebeb1] mt-0.5">
                Chequeá los kilos totales y colocá tus datos fiscales o de expreso.
              </span>
            </div>
          </div>

          {/* Paso 3 */}
          <div className="flex items-start gap-3 bg-[#1f4e44]/70 p-3.5 rounded-xl border border-[#a0d0c3]/20">
            <div className="w-8 h-8 rounded-lg bg-[#1ebe5d]/30 text-white font-mono font-bold flex items-center justify-center shrink-0 text-xs">
              <span className="material-symbols-outlined text-[16px] text-[#1ebe5d]">chat</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm font-bold text-white leading-snug">
                Karim confirma al WhatsApp
              </span>
              <span className="text-[11px] sm:text-xs text-[#8ebeb1] mt-0.5">
                Te pasamos comprobante exacto y coordinamos flete o retiro por depósito.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. PRECIOS DE ESTA SEMANA (Oportunidades con Stepper +/- y Agregar)
          ==================================================================== */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex flex-col">
            <h2 className="font-serif text-xl sm:text-2xl text-[#01372e] font-bold">
              Precios de Esta Semana
            </h2>
            <span className="text-xs text-[#404846]">Fraccionado directo de bolsas de arpillera</span>
          </div>
          <span className="font-mono text-[10px] sm:text-xs text-[#842401] font-bold uppercase bg-[#f4e7c8] px-2 py-1 rounded">
            Precios s/ IVA
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {weeklyProducts.map((prod) => {
            const currentQty = quantities[prod.id] ?? 1;

            return (
              <div
                key={prod.id}
                className="bg-[#ffffff] rounded-2xl p-3 sm:p-4 shadow-sm border border-[#efe1c2] flex flex-col justify-between relative group hover:shadow-md transition-shadow"
              >
                {/* Imagen del producto */}
                <div>
                  <div
                    onClick={() => onSelectProduct(prod)}
                    className="relative w-full h-32 sm:h-36 rounded-xl bg-[#faedcd] overflow-hidden mb-2 cursor-pointer"
                  >
                    <img
                      src={prod.images[0]}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-1.5 left-1.5 font-mono text-[10px] bg-[#49645c] text-white px-2 py-0.5 rounded font-bold uppercase">
                      {prod.unitMeasurement}
                    </span>
                  </div>

                  {/* Textos */}
                  <span className="font-mono text-[9px] sm:text-[10px] text-[#5d1700] font-bold uppercase block">
                    {prod.categoryLabel}
                  </span>
                  <h3
                    onClick={() => onSelectProduct(prod)}
                    className="font-serif text-xs sm:text-sm font-bold text-[#01372e] leading-snug line-clamp-1 hover:underline cursor-pointer"
                  >
                    {prod.title}
                  </h3>
                  <p className="text-[11px] text-[#404846] line-clamp-1 mt-0.5">
                    {prod.shortSubtitle}
                  </p>
                </div>

                {/* Precio y Stepper interactivo */}
                <div className="mt-3 pt-2 border-t border-[#efe1c2] flex flex-col gap-2">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-sm sm:text-base font-bold text-[#01372e]">
                      ${prod.basePriceKg.toLocaleString('es-AR')}
                      <span className="text-[10px] text-[#404846] font-normal"> /kg</span>
                    </span>
                  </div>

                  {/* Stepper +/- */}
                  <div className="flex items-center justify-between bg-[#f4e7c8] rounded-xl p-0.5">
                    <button
                      type="button"
                      onClick={() => handleAdjustQty(prod.id, -1)}
                      className="w-8 h-8 rounded-lg bg-[#ffffff] text-[#01372e] flex items-center justify-center font-bold text-base active:scale-95 transition-transform shadow-xs"
                      aria-label="Disminuir"
                    >
                      -
                    </button>
                    <span className="font-mono text-xs font-bold text-[#211b08] px-2">
                      {currentQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAdjustQty(prod.id, 1)}
                      className="w-8 h-8 rounded-lg bg-[#01372e] text-[#ffffff] flex items-center justify-center font-bold text-base active:scale-95 transition-transform shadow-xs"
                      aria-label="Aumentar"
                    >
                      +
                    </button>
                  </div>

                  {/* Botón Agregar */}
                  <InteractiveIndicator
                    label="Agregar al Pedido"
                    devices={['celular', 'tablet', 'pc']}
                    actionDesc="Suma la cantidad especificada de bultos/kilos al remito actual"
                    isActive={guideMode}
                  >
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(prod)}
                      className="w-full py-1.5 rounded-lg bg-[#1f4e44] hover:bg-[#01372e] text-white font-semibold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                      <span>Sumar al remito</span>
                    </button>
                  </InteractiveIndicator>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ====================================================================
          6. BANNER DE CONTACTO DIRECTO WHATSAPP KARIM
          ==================================================================== */}
      <section className="rounded-2xl bg-[#f4e7c8] p-4 sm:p-5 shadow-sm flex items-center gap-4 border border-[#efe1c2]">
        <div className="w-12 h-12 rounded-full bg-[#1ebe5d] text-white flex items-center justify-center shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-[26px]">support_agent</span>
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="font-serif text-sm sm:text-base font-bold text-[#01372e]">
            ¿Dudas o pedidos especiales?
          </h3>
          <p className="text-xs sm:text-sm text-[#404846] mt-0.5 leading-snug">
            Hablá directo con Karim por WhatsApp para coordinar listas en PDF o fletes al interior.
          </p>
          <div className="mt-2">
            <a
              href={`https://wa.me/${KARIM_CONTACT.phoneInternational}?text=Hola%20Karim,%20quisiera%20solicitar%20la%20lista%20completa%20en%20PDF`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1ebe5d] hover:underline"
            >
              <span>Abrir chat de WhatsApp</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </div>
        </div>
      </section>

      {/* ====================================================================
          7. LOGÍSTICA & DESPACHO EN EXPRESOS
          ==================================================================== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-2xl bg-[#fff3d7] p-4 flex flex-col gap-1 border border-[#efe1c2]">
          <div className="flex items-center gap-2 text-[#01372e]">
            <span className="material-symbols-outlined text-[20px] text-[#49645c]">local_shipping</span>
            <span className="font-bold text-xs sm:text-sm">Envíos a Todo el País</span>
          </div>
          <p className="text-xs text-[#404846]">
            Despacho diario en expresos de Villa Soldati y Pompeya en 24hs.
          </p>
        </div>

        <div className="rounded-2xl bg-[#fff3d7] p-4 flex flex-col gap-1 border border-[#efe1c2]">
          <div className="flex items-center gap-2 text-[#01372e]">
            <span className="material-symbols-outlined text-[20px] text-[#49645c]">store</span>
            <span className="font-bold text-xs sm:text-sm">Retiro por Depósito</span>
          </div>
          <p className="text-xs text-[#404846]">
            Sin costo mínimo avisando 1 hora antes de retirar en Parque Patricios.
          </p>
        </div>
      </section>
    </div>
  );
};
