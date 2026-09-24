/**
 * ============================================================================
 * COMPONENTE: src/components/views/ProductDetailView.tsx
 * PROYECTO: Los Turquitos - Especiera Mayorista
 * ----------------------------------------------------------------------------
 * NOTA PARA CLAUDE / DESARROLLADOR:
 * Vista de Ficha de Producto Mayorista con arquitectura Bento técnica:
 *
 * COMPONENTES Y FLUJOS:
 * 1. Galería interactiva con miniaturas de alta resolución y etiquetas ASTA.
 * 2. Selector de formato comercial (1kg, 5kg con -10% OFF, 25kg con -20% OFF)
 *    con recálculo reactivo en tiempo real del precio unitario y subtotal.
 * 3. Stepper de bultos con cálculo simultáneo de kilos totales.
 * 4. Ficha de Trazabilidad 2x2: Origen botánico, gastronomía, acopio y canal.
 * 5. Carrusel de productos complementarios ("Combinan en este pedido / Mismo flete").
 * 6. Botones de acción directa: "Agregar al pedido" y "Consultar a Karim"
 *    con payload de WhatsApp preconfigurado con las unidades y formatos exactos.
 * ============================================================================
 */

import React, { useState } from 'react';
import { Product, ProductFormat } from '../../types.ts';
import { KARIM_CONTACT } from '../../data/mockData.ts';
import { InteractiveIndicator } from '../InteractiveIndicator.tsx';

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCartWithFormat: (product: Product, format: ProductFormat, quantity: number) => void;
  guideMode: boolean;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  allProducts,
  onBack,
  onSelectProduct,
  onAddToCartWithFormat,
  guideMode,
}) => {
  // Galería activa
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  // Formato seleccionado (1kg por defecto o el primer formato disponible)
  const [selectedFormat, setSelectedFormat] = useState<ProductFormat>(
    product.formats[0] || {
      id: 'default',
      name: '1 KG',
      weightKg: 1,
      discountPct: 0,
      pricePerKg: product.basePriceKg,
      description: 'Fraccionado estándar',
    }
  );

  // Cantidad de bultos
  const [quantity, setQuantity] = useState<number>(2);
  const [addedFeedback, setAddedFeedback] = useState<boolean>(false);

  // Cálculos reactivos
  const totalKilos = quantity * selectedFormat.weightKg;
  const subtotalPrice = totalKilos * selectedFormat.pricePerKg;

  // Manejo de steppers
  const handleAdjustQty = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(99, prev + delta)));
  };

  const handleAdd = () => {
    onAddToCartWithFormat(product, selectedFormat, quantity);
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
    }, 2000);
  };

  // Enlace directo de WhatsApp con el mensaje comercial formulado
  const whatsappInquiryUrl = `https://wa.me/${KARIM_CONTACT.phoneInternational}?text=${encodeURIComponent(
    `Hola Karim, me interesa encargar ${quantity} bulto(s) de ${selectedFormat.name} (${totalKilos} KG total) de ${product.title}. Subtotal estimado: $${subtotalPrice.toLocaleString('es-AR')}. ¿Tienen despacho inmediato?`
  )}`;

  // Productos relacionados para la sección "Combinan en este pedido"
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="flex flex-col gap-5 sm:gap-7 pb-20">
      {/* ====================================================================
          1. NAVEGACIÓN Y BADGE CONTEXTUAL
          ==================================================================== */}
      <div className="flex items-center justify-between gap-3">
        <InteractiveIndicator
          label="Retorno al Catálogo"
          devices={['celular', 'tablet', 'pc']}
          actionDesc="Regresa a la lista completa de artículos"
          isActive={guideMode}
        >
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-[#01372e] hover:text-[#1f4e44] text-xs sm:text-sm font-semibold transition-colors py-1"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Volver al catálogo</span>
          </button>
        </InteractiveIndicator>

        <div className="flex items-center gap-1.5 bg-[#f4e7c8] px-3 py-1 rounded-full text-[#404846] font-mono text-[10px] sm:text-xs tracking-wider uppercase border border-[#efe1c2]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#842401]"></span>
          <span>{product.categoryLabel}</span>
        </div>
      </div>

      {/* ====================================================================
          2. CONTENEDOR PRINCIPAL (2 Columnas en Desktop/Tablet)
          - Izquierda: Galería fotográfica con miniaturas interactivas
          - Derecha: Título, precios escalonados, formatos y steppers
          ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUMNA IZQUIERDA: Escenario Visual Bento (Span 6 en Desktop) */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          <div className="relative w-full rounded-2xl bg-[#faedcd] p-3 shadow-sm border border-[#efe1c2]">
            {/* Badges superiores de Lote y ASTA */}
            <div className="absolute top-5 left-5 z-10 flex flex-col sm:flex-row gap-1.5 items-start">
              {product.traceability.harvestYear && (
                <span className="bg-[#842401] text-white font-mono text-[10px] sm:text-[11px] uppercase px-2.5 py-1 rounded-md shadow-sm font-bold">
                  {product.traceability.harvestYear}
                </span>
              )}
            </div>

            {/* Imagen Principal Heroica */}
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#efe1c2] shadow-inner">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover transition-opacity duration-300"
              />

              {product.traceability.astaGrade && (
                <div className="absolute bottom-3 right-3 bg-[#211b08]/85 backdrop-blur-sm text-white px-2.5 py-1 rounded-md font-mono text-[10px] sm:text-xs font-bold">
                  {product.traceability.astaGrade}
                </div>
              )}
            </div>

            {/* Miniaturas Interactivas */}
            <div className="flex items-center gap-2.5 mt-3 overflow-x-auto no-scrollbar pb-1">
              {product.images.map((imgUrl, idx) => (
                <InteractiveIndicator
                  key={idx}
                  label={`Miniatura ${idx + 1}`}
                  devices={['celular', 'tablet', 'pc']}
                  actionDesc="Cambia la fotografía activa de la galería"
                  isActive={guideMode}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-[#01372e] ring-2 ring-[#01372e]/30 scale-102'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Vista ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                </InteractiveIndicator>
              ))}
            </div>
          </div>

          {/* Sello de Garantía Fitosanitaria SENASA */}
          <div className="bg-[#fff3d7] p-4 rounded-2xl border border-[#efe1c2] flex items-start gap-3 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-[#c8e6dd] flex items-center justify-center text-[#01372e] shrink-0">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
            </div>
            <div className="flex flex-col text-xs">
              <span className="font-bold text-[#01372e] text-sm">
                Certificación Fitosanitaria SENASA
              </span>
              <p className="text-[#404846] mt-0.5">
                {product.traceability.purityPct || '100% Puro sin aditivos, féculas ni conservantes'}.
              </p>
              <div className="flex gap-4 mt-1.5 font-mono text-[10px] text-[#49645c] font-semibold">
                <span>RNE: {product.traceability.senasaRne || '02-034811'}</span>
                <span>RNPA: {product.traceability.senasaRnpa || '02-581903'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Datos Comerciales, Formatos y Stepper (Span 6 en Desktop) */}
        <div className="lg:col-span-6 flex flex-col gap-4 sm:gap-5">
          {/* Tarjeta de Título & Precio Base */}
          <div className="bg-[#ffffff] rounded-2xl p-5 sm:p-6 border border-[#efe1c2] shadow-sm flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-[#49645c] font-semibold text-xs mb-1">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Línea Mayorista Certificada</span>
                </div>
                <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#01372e] leading-tight">
                  {product.title}
                </h1>
                <p className="text-xs sm:text-sm text-[#404846] mt-1.5 leading-relaxed">
                  {product.shortSubtitle}. Selección de primera pasada de molienda con alta intensidad de color y aroma.
                </p>
              </div>

              <span className="bg-[#c8e6dd] text-[#04201a] font-mono text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider shrink-0">
                EN STOCK
              </span>
            </div>

            {/* Tarifa Base y Margen B2B */}
            <div className="flex items-baseline justify-between bg-[#fff8f0] p-3.5 sm:p-4 rounded-xl border border-[#efe1c2]">
              <div>
                <span className="font-mono text-[10px] text-[#707976] uppercase tracking-wider block">
                  Precio base por kilo
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-[#01372e]">
                    ${selectedFormat.pricePerKg.toLocaleString('es-AR')}
                  </span>
                  <span className="font-mono text-[11px] text-[#49645c] font-bold">/ KG + IVA</span>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block bg-[#ffdbd0] text-[#3a0b00] font-mono text-[11px] px-2.5 py-1 rounded font-bold uppercase">
                  B2B Margen {product.suggestedMarginPct}%
                </span>
                <span className="block text-[11px] text-[#404846] mt-1">Fraccionable</span>
              </div>
            </div>

            {/* Selector de Formato Comercial */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs sm:text-sm text-[#01372e]">
                  Seleccionar Formato de Despacho:
                </span>
                <span className="font-mono text-[11px] text-[#842401] font-bold">
                  {selectedFormat.discountPct > 0
                    ? `Ahorro del ${selectedFormat.discountPct}% aplicado`
                    : 'Escala mayorista'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {product.formats.map((fmt) => {
                  const isSelected = selectedFormat.id === fmt.id;
                  return (
                    <InteractiveIndicator
                      key={fmt.id}
                      label={`Formato ${fmt.name}`}
                      devices={['celular', 'tablet', 'pc']}
                      actionDesc={`Aplica descuento por volumen de ${fmt.discountPct}% (${fmt.weightKg}kg por bulto)`}
                      isActive={guideMode}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedFormat(fmt)}
                        className={`w-full p-2.5 sm:p-3 rounded-xl flex flex-col items-center justify-center transition-all border ${
                          isSelected
                            ? 'bg-[#01372e] text-white border-[#01372e] shadow-sm scale-101 font-bold'
                            : 'bg-[#fff3d7] text-[#211b08] hover:bg-[#faedcd] border-[#efe1c2]'
                        }`}
                      >
                        <span className="font-mono text-sm sm:text-base font-bold">{fmt.name}</span>
                        <span
                          className={`font-mono text-[10px] mt-1 px-1.5 py-0.5 rounded ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : fmt.discountPct > 0
                              ? 'bg-[#842401] text-white font-bold'
                              : 'text-[#404846]'
                          }`}
                        >
                          {fmt.discountPct > 0 ? `-${fmt.discountPct}%` : 'Bolsa'}
                        </span>
                      </button>
                    </InteractiveIndicator>
                  );
                })}
              </div>
            </div>

            {/* Stepper de Unidades y Subtotal en Vivo */}
            <div className="bg-[#faedcd]/60 p-3.5 sm:p-4 rounded-xl border border-[#efe1c2] flex items-center justify-between gap-3">
              <div>
                <span className="text-xs text-[#404846] block font-medium">Cantidad bultos:</span>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <button
                    type="button"
                    onClick={() => handleAdjustQty(-1)}
                    className="w-9 h-9 rounded-lg bg-white text-[#01372e] flex items-center justify-center shadow-xs font-bold text-lg hover:bg-[#fff8f0] active:scale-95"
                    aria-label="Disminuir bultos"
                  >
                    -
                  </button>
                  <span className="w-9 text-center font-mono text-lg font-bold text-[#01372e]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAdjustQty(1)}
                    className="w-9 h-9 rounded-lg bg-[#01372e] text-white flex items-center justify-center shadow-xs font-bold text-lg hover:bg-[#1f4e44] active:scale-95"
                    aria-label="Aumentar bultos"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-[#404846] block font-medium">Subtotal estimado:</span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-[#01372e] block">
                  ${subtotalPrice.toLocaleString('es-AR')}
                </span>
                <span className="font-mono text-[10px] sm:text-xs text-[#49645c] font-bold block uppercase">
                  {totalKilos} KG TOTAL ({quantity} {quantity > 1 ? 'bultos' : 'bulto'})
                </span>
              </div>
            </div>

            {/* Botones de Compra y WhatsApp */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <InteractiveIndicator
                label="Agregar al Pedido"
                devices={['celular', 'tablet', 'pc']}
                actionDesc="Suma la selección completa al carrito y activa feedback háptico/visual"
                isActive={guideMode}
              >
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`flex-1 h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] ${
                    addedFeedback
                      ? 'bg-[#1ebe5d] text-white'
                      : 'bg-[#01372e] hover:bg-[#1f4e44] text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {addedFeedback ? 'check_circle' : 'shopping_bag'}
                  </span>
                  <span>{addedFeedback ? '¡Agregado al pedido!' : 'Agregar al pedido'}</span>
                </button>
              </InteractiveIndicator>

              <InteractiveIndicator
                label="WhatsApp Karim Directo"
                devices={['celular', 'tablet', 'pc']}
                actionDesc="Abre chat con Karim con el desglose exacto de kilos y subtotal"
                isActive={guideMode}
              >
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 px-5 rounded-xl bg-[#1ebe5d] hover:bg-[#19a550] text-white flex items-center justify-center gap-2 font-bold text-sm shadow-sm transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                  <span>Consultar a Karim</span>
                </a>
              </InteractiveIndicator>
            </div>
          </div>

          {/* ====================================================================
              3. FICHA DE CALIDAD & TRAZABILIDAD (Bento 2x2)
              ==================================================================== */}
          <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#efe1c2] shadow-sm">
            <h3 className="font-serif font-bold text-base text-[#01372e] mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#842401]">inventory_2</span>
              <span>Ficha de Calidad & Trazabilidad</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Origen */}
              <div className="bg-[#fff3d7] p-3 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#49645c] font-bold uppercase tracking-wider block">
                    Región Productiva
                  </span>
                  <h4 className="font-serif font-bold text-sm text-[#01372e] mt-0.5">
                    {product.traceability.origin}
                  </h4>
                </div>
                <p className="text-[11px] text-[#404846] mt-2 leading-snug">
                  Secado tradicional al sol, molienda criolla fina y dulce sin amargor.
                </p>
              </div>

              {/* Usos Gastronómicos */}
              <div className="bg-[#fff3d7] p-3 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#842401] font-bold uppercase tracking-wider block">
                    Aplicación Gastronómica
                  </span>
                  <h4 className="font-serif font-bold text-sm text-[#01372e] mt-0.5">
                    Cocina Criolla & Cárnica
                  </h4>
                </div>
                <p className="text-[11px] text-[#404846] mt-2 leading-snug">
                  {product.traceability.culinaryUse}
                </p>
              </div>

              {/* Conservación */}
              <div className="bg-[#fff3d7] p-3 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#49645c] font-bold uppercase tracking-wider block">
                    Acopio & Vida Útil
                  </span>
                  <h4 className="font-serif font-bold text-sm text-[#01372e] mt-0.5">
                    Lugar Seco y Oscuro
                  </h4>
                </div>
                <p className="text-[11px] text-[#404846] mt-2 leading-snug">
                  {product.traceability.shelfLife} lejos de humedad.
                </p>
              </div>

              {/* Canal Sugerido */}
              <div className="bg-[#fff3d7] p-3 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#01372e] font-bold uppercase tracking-wider block">
                    Canal Sugerido
                  </span>
                  <h4 className="font-serif font-bold text-sm text-[#01372e] mt-0.5">
                    Dietéticas y Rotiserías
                  </h4>
                </div>
                <p className="text-[11px] text-[#404846] mt-2 leading-snug">
                  {product.traceability.targetChannel} con excelente rotación.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          4. PRODUCTOS COMPLEMENTARIOS: "COMBINAN EN ESTE PEDIDO / MISMO FLETE"
          ==================================================================== */}
      <section className="mt-4 bg-[#ffffff] rounded-2xl p-5 sm:p-6 border border-[#efe1c2] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <h3 className="font-serif font-bold text-lg text-[#01372e]">
              Combinan en este pedido
            </h3>
            <span className="text-xs text-[#404846]">
              Aprovechá el mismo flete hasta el depósito del expreso
            </span>
          </div>
          <span className="font-mono text-[10px] sm:text-xs text-[#49645c] uppercase font-bold bg-[#c8e6dd] px-2.5 py-1 rounded">
            Mismo Flete
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {relatedProducts.map((rel) => (
            <div
              key={rel.id}
              className="bg-[#fff3d7] rounded-xl p-3 flex items-center gap-3 border border-[#efe1c2] hover:bg-[#faedcd] transition-colors"
            >
              <div
                onClick={() => onSelectProduct(rel)}
                className="w-16 h-16 rounded-lg overflow-hidden bg-[#faedcd] shrink-0 cursor-pointer"
              >
                <img src={rel.images[0]} alt={rel.title} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 min-w-0">
                <span className="font-mono text-[9px] text-[#5d1700] uppercase font-bold block truncate">
                  {rel.categoryLabel}
                </span>
                <h4
                  onClick={() => onSelectProduct(rel)}
                  className="font-serif font-bold text-xs sm:text-sm text-[#01372e] leading-tight truncate hover:underline cursor-pointer"
                >
                  {rel.title}
                </h4>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="font-mono text-xs font-bold text-[#01372e]">
                    ${rel.basePriceKg.toLocaleString('es-AR')}
                    <span className="text-[10px] font-normal"> /kg</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => onAddToCartWithFormat(rel, rel.formats[0], 1)}
                    className="px-2.5 py-1 rounded-lg bg-[#01372e] text-white text-[11px] font-semibold hover:bg-[#1f4e44] transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span>
                    <span>Sumar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
