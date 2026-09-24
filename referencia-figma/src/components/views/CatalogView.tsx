/**
 * ============================================================================
 * COMPONENTE: src/components/views/CatalogView.tsx
 * PROYECTO: Los Turquitos - Especiera Mayorista
 * ----------------------------------------------------------------------------
 * NOTA PARA CLAUDE / DESARROLLADOR:
 * Vista de Catálogo Mayorista completa con filtrado interactivo:
 *
 * CARACTERÍSTICAS TÉCNICAS:
 * 1. Búsqueda en tiempo real por título, código o región geográfica.
 * 2. Filtrado por categoría botánica y formato (Bulto 25kg vs Kilo fraccionado).
 * 3. Ordenamiento por popularidad, menor precio y volumen.
 * 4. Adaptación de layout según dispositivo:
 *    - [📱 CELULARES]: Grilla de 2 columnas con chips horizontales y acción rápida.
 *    - [📟 TABLETS]: Grilla de 3 columnas con cabecera de resumen y banner B2B.
 *    - [💻 PC]: Grilla de 4 columnas con Sidebar lateral fija (Sticky 280px)
 *      con filtros facetados por precio, categoría y stock inmediato.
 * 5. Notificación flotante ("Toast") al agregar productos al remito.
 * ============================================================================
 */

import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '../../types.ts';
import { KARIM_CONTACT } from '../../data/mockData.ts';
import { InteractiveIndicator } from '../InteractiveIndicator.tsx';

interface CatalogViewProps {
  products: Product[];
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantityKg: number) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  guideMode: boolean;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
  searchQuery,
  onSearchChange,
  guideMode,
}) => {
  // Estados interactivos para filtros y ordenamiento
  const [sortBy, setSortBy] = useState<'populares' | 'precio-asc' | 'precio-desc'>('populares');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [formatFilter, setFormatFilter] = useState<'todos' | '1kg' | 'bulto'>('todos');
  const [maxPrice, setMaxPrice] = useState<number>(35000);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cantidades individuales en tarjetas
  const [cardQuantities, setCardQuantities] = useState<Record<string, number>>({});

  const handleAdjustCardQty = (prodId: string, delta: number) => {
    setCardQuantities((prev) => {
      const current = prev[prodId] ?? 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [prodId]: next };
    });
  };

  const handleAddFromCard = (product: Product) => {
    const qty = cardQuantities[product.id] ?? 1;
    onAddToCart(product, qty);

    // Micro feedback Toast
    setToastMessage(`+${qty} ${product.title} agregado al remito`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // Filtrado de productos en memoria
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Filtro de categoría
      if (selectedCategory !== 'todos') {
        if (selectedCategory === 'destacados' && !prod.isBestSeller && !prod.isSpecialOffer) {
          return false;
        }
        if (selectedCategory !== 'destacados' && prod.category !== selectedCategory) {
          return false;
        }
      }

      // Filtro de texto de búsqueda
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = prod.title.toLowerCase().includes(q);
        const matchesOrigin = prod.traceability.origin.toLowerCase().includes(q);
        const matchesSku = prod.sku.toLowerCase().includes(q);
        if (!matchesTitle && !matchesOrigin && !matchesSku) {
          return false;
        }
      }

      // Filtro solo stock inmediato
      if (onlyInStock && prod.stockStatus === 'out_of_stock') {
        return false;
      }

      // Filtro de precio máximo
      if (prod.basePriceKg > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'precio-asc') return a.basePriceKg - b.basePriceKg;
      if (sortBy === 'precio-desc') return b.basePriceKg - a.basePriceKg;
      return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, onlyInStock, maxPrice, sortBy]);

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Toast de confirmación de agregados */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#01372e] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-xs font-mono border border-[#a0d0c3] animate-fade-in">
          <span className="material-symbols-outlined text-[#1ebe5d] text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ====================================================================
          1. ENCABEZADO DE CATÁLOGO & METADATOS B2B
          ==================================================================== */}
      <section className="bg-[#fff3d7] p-4 sm:p-6 rounded-2xl border border-[#efe1c2] flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#404846]">
            <span>Inicio</span>
            <span>/</span>
            <span className="text-[#01372e] font-bold">Catálogo Mayorista de Especias</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faedcd] border border-[#efe1c2]">
            <span className="w-2 h-2 rounded-full bg-[#1ebe5d] animate-pulse"></span>
            <span className="font-mono text-[10px] sm:text-[11px] text-[#211b08] font-bold uppercase tracking-wider">
              {filteredProducts.length} productos disponibles · Precios actualizados hoy
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#01372e] font-bold tracking-tight">
            Catálogo de Especias y Condimentos
          </h1>

          <a
            href={`https://wa.me/${KARIM_CONTACT.phoneInternational}?text=Hola%20Karim,%20quiero%20descargar%20la%20lista%20de%20precios%20completa%20en%20PDF`}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#01372e] text-white text-xs font-semibold hover:bg-[#1f4e44] transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Descargar Lista PDF</span>
          </a>
        </div>
      </section>

      {/* ====================================================================
          2. BARRA DE HERRAMIENTAS: Búsqueda y Ordenamiento
          ==================================================================== */}
      <section className="bg-[#ffffff] p-3 sm:p-4 rounded-2xl border border-[#efe1c2] shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Buscador */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#49645c] text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscá comino, pimentón, nueces, orégano..."
            className="w-full pl-10 pr-4 py-2 bg-[#fff8f0] border border-[#c0c8c4] rounded-xl text-xs sm:text-sm text-[#211b08] placeholder-[#707976] focus:outline-none focus:ring-2 focus:ring-[#01372e]"
          />
        </div>

        {/* Ordenador */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          <div className="flex items-center gap-1 text-xs text-[#404846]">
            <span className="material-symbols-outlined text-[16px] text-[#49645c]">swap_vert</span>
            <span className="hidden sm:inline font-medium">Ordenar por:</span>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#fff8f0] border border-[#c0c8c4] rounded-xl px-3 py-2 text-xs font-semibold text-[#01372e] focus:outline-none cursor-pointer"
          >
            <option value="populares">Más vendidos</option>
            <option value="precio-asc">Menor precio/kg</option>
            <option value="precio-desc">Mayor precio/kg</option>
          </select>
        </div>
      </section>

      {/* ====================================================================
          3. LAYOUT PRINCIPAL:
          - [💻 PC]: Sidebar fija de 280px a la izquierda + Grilla de 4 columnas.
          - [📟 TABLET]: Grilla de 3 columnas con chips superiores.
          - [📱 CELULAR]: Grilla de 2 columnas con chips horizontales.
          ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
        {/* SIDEBAR LATERAL (Visible en Desktop / PC, oculta en Celulares/Tablets) */}
        <aside className="hidden lg:flex flex-col gap-5 sticky top-44">
          {/* Tarjeta de Filtros */}
          <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#efe1c2] shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-[#efe1c2] pb-3">
              <span className="font-serif font-bold text-base text-[#01372e] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px] text-[#49645c]">tune</span>
                <span>Filtros</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  onSelectCategory('todos');
                  setOnlyInStock(false);
                  setMaxPrice(35000);
                  onSearchChange('');
                }}
                className="font-mono text-[10px] text-[#842401] hover:underline uppercase font-bold"
              >
                Limpiar
              </button>
            </div>

            {/* Categorías */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] text-[#404846] uppercase font-bold tracking-wider block">
                Categorías
              </span>
              <div className="space-y-1 text-xs">
                {[
                  { id: 'todos', label: 'Todas las Categorías', count: 64 },
                  { id: 'alicante', label: 'Condimentos Alicante', count: 18 },
                  { id: 'especias', label: 'Especias Puras', count: 16 },
                  { id: 'frutos-secos', label: 'Frutos Secos', count: 14 },
                  { id: 'conservas', label: 'Aceitunas y Conservas', count: 6 },
                  { id: 'semillas-harinas', label: 'Semillas y Harinas', count: 10 },
                ].map((cat) => (
                  <label
                    key={cat.id}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-[#faedcd] font-bold text-[#01372e]'
                        : 'text-[#404846] hover:bg-[#fff3d7]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="desktop-category"
                        checked={selectedCategory === cat.id}
                        onChange={() => onSelectCategory(cat.id as ProductCategory)}
                        className="accent-[#01372e]"
                      />
                      <span>{cat.label}</span>
                    </span>
                    <span className="font-mono text-[10px] bg-[#efe1c2] px-1.5 py-0.5 rounded text-[#707976]">
                      {cat.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro Rango de Precio */}
            <div className="space-y-2 border-t border-[#efe1c2] pt-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#404846] uppercase font-bold tracking-wider">
                  Precio Máximo x KG
                </span>
                <span className="font-mono text-xs text-[#01372e] font-bold">
                  ${maxPrice.toLocaleString('es-AR')}
                </span>
              </div>
              <input
                type="range"
                min="3000"
                max="35000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#01372e] cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[10px] text-[#707976]">
                <span>$3.000</span>
                <span>$35.000+</span>
              </div>
            </div>

            {/* Checkbox solo stock */}
            <div className="border-t border-[#efe1c2] pt-4">
              <label className="flex items-start gap-2 p-2.5 rounded-xl bg-[#fff3d7] cursor-pointer hover:bg-[#faedcd] transition-colors">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="accent-[#01372e] mt-0.5"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#01372e]">Solo Stock Inmediato</span>
                  <span className="text-[10px] text-[#404846]">Despacho en 24h garantizado</span>
                </div>
              </label>
            </div>
          </div>

          {/* Tarjeta de Lista Mayorista PDF */}
          <div className="bg-[#01372e] text-white p-5 rounded-2xl flex flex-col gap-2 border border-[#204e44] shadow-sm">
            <span className="font-mono text-[10px] text-[#bceddf] uppercase font-bold tracking-wider">
              NOMENCLADOR MAYORISTA
            </span>
            <h4 className="font-serif font-bold text-base text-white">¿Buscás lista completa en PDF?</h4>
            <p className="text-xs text-[#8ebeb1] leading-relaxed">
              Descargá el nomenclador comercial semanal con descuentos escalonados por tonelada.
            </p>
            <a
              href={`https://wa.me/${KARIM_CONTACT.phoneInternational}?text=Hola%20Karim,%20solicito%20el%20PDF%20con%20descuentos%20por%20tonelada`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full py-2 bg-[#ffffff] hover:bg-[#fff8f0] text-[#01372e] font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px] text-[#1ebe5d]">chat</span>
              <span>Pedir PDF a Karim</span>
            </a>
          </div>
        </aside>

        {/* COLUMNA DERECHA: Grilla de Productos Responsiva */}
        <div className="flex flex-col gap-4">
          {/* Chips horizontales para Móvil y Tablet */}
          <div className="lg:hidden flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'todos', label: 'Todos (64)' },
              { id: 'alicante', label: 'Alicante (18)' },
              { id: 'especias', label: 'Especias (16)' },
              { id: 'frutos-secos', label: 'Frutos Secos (14)' },
              { id: 'conservas', label: 'Conservas (6)' },
              { id: 'semillas-harinas', label: 'Semillas & Harinas (10)' },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => onSelectCategory(chip.id as ProductCategory)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                  selectedCategory === chip.id
                    ? 'bg-[#01372e] text-white shadow-sm'
                    : 'bg-[#f4e7c8] text-[#211b08] hover:bg-[#efe1c2]'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Estado vacío si no hay coincidencias */}
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-[#ffffff] rounded-2xl border border-[#efe1c2] flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-[48px] text-[#707976]">inventory_2</span>
              <h3 className="font-serif text-lg font-bold text-[#01372e]">
                No encontramos productos con ese filtro
              </h3>
              <p className="text-xs text-[#404846] max-w-sm">
                Probá buscando por otro término o limpiando los filtros para ver todos los artículos disponibles.
              </p>
              <button
                type="button"
                onClick={() => {
                  onSelectCategory('todos');
                  onSearchChange('');
                  setOnlyInStock(false);
                  setMaxPrice(35000);
                }}
                className="mt-2 px-4 py-2 bg-[#01372e] text-white rounded-xl text-xs font-semibold"
              >
                Restablecer catálogo
              </button>
            </div>
          ) : (
            /* Grilla adaptable: 2 columnas en Móvil, 3 en Tablet, 4 en Desktop */
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredProducts.map((product) => {
                const qty = cardQuantities[product.id] ?? 1;
                const isOutOfStock = product.stockStatus === 'out_of_stock';

                return (
                  <article
                    key={product.id}
                    className={`bg-[#ffffff] rounded-2xl p-3 sm:p-3.5 border border-[#efe1c2] shadow-sm flex flex-col justify-between relative group hover:shadow-md transition-all ${
                      isOutOfStock ? 'opacity-85' : ''
                    }`}
                  >
                    {/* Badge de estado superior */}
                    {product.isBestSeller && !isOutOfStock && (
                      <div className="absolute top-2 left-2 z-10">
                        <span className="px-2 py-0.5 rounded-full bg-[#842401] text-white font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-xs">
                          MÁS PEDIDO
                        </span>
                      </div>
                    )}

                    {isOutOfStock && (
                      <div className="absolute top-2 left-2 z-10">
                        <span className="px-2 py-0.5 rounded-full bg-[#ba1a1a] text-white font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          SIN STOCK
                        </span>
                      </div>
                    )}

                    {/* Imagen del producto */}
                    <div>
                      <div
                        onClick={() => onSelectProduct(product)}
                        className={`relative w-full aspect-square rounded-xl overflow-hidden bg-[#faedcd] mb-2 cursor-pointer ${
                          isOutOfStock ? 'grayscale-[40%]' : ''
                        }`}
                      >
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-[#211b08]/80 text-[#ffffff] font-mono text-[10px] backdrop-blur-xs font-bold">
                          {product.unitMeasurement}
                        </span>
                      </div>

                      {/* Textos */}
                      <span className="font-mono text-[9px] sm:text-[10px] text-[#5d1700] font-bold uppercase block truncate">
                        {product.categoryLabel}
                      </span>
                      <h3
                        onClick={() => onSelectProduct(product)}
                        className="font-serif text-xs sm:text-sm font-bold text-[#01372e] leading-snug line-clamp-2 hover:underline cursor-pointer min-h-[34px]"
                      >
                        {product.title}
                      </h3>
                      <p className="text-[11px] text-[#404846] line-clamp-1 mt-0.5">
                        {product.shortSubtitle}
                      </p>
                    </div>

                    {/* Fila de precio y acciones */}
                    <div className="mt-3 pt-2 border-t border-[#efe1c2] flex flex-col gap-2">
                      <div className="flex items-baseline justify-between">
                        <span className="font-mono text-sm sm:text-base font-bold text-[#01372e]">
                          ${product.basePriceKg.toLocaleString('es-AR')}
                        </span>
                        <span className="font-mono text-[10px] text-[#49645c] font-semibold">
                          x {product.unitMeasurement}
                        </span>
                      </div>

                      {isOutOfStock ? (
                        <a
                          href={`https://wa.me/${KARIM_CONTACT.phoneInternational}?text=Hola%20Karim,%20quiero%20que%20me%20avisen%20cuando%20reingrese%20${encodeURIComponent(product.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 bg-[#efe1c2] hover:bg-[#faedcd] text-[#01372e] rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px] text-[#842401]">notifications</span>
                          <span>Avisarme</span>
                        </a>
                      ) : (
                        <>
                          {/* Stepper interactivo */}
                          <div className="flex items-center justify-between bg-[#f4e7c8] rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() => handleAdjustCardQty(product.id, -1)}
                              className="w-7 h-7 flex items-center justify-center rounded bg-white text-[#01372e] font-bold text-sm shadow-xs hover:bg-[#fff8f0] active:scale-95"
                              aria-label="Restar unidad"
                            >
                              -
                            </button>
                            <span className="font-mono text-xs font-bold text-[#211b08] px-2">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleAdjustCardQty(product.id, 1)}
                              className="w-7 h-7 flex items-center justify-center rounded bg-[#01372e] text-white font-bold text-sm shadow-xs hover:bg-[#1f4e44] active:scale-95"
                              aria-label="Sumar unidad"
                            >
                              +
                            </button>
                          </div>

                          {/* Botón de agregar con animación */}
                          <InteractiveIndicator
                            label="Botón Agregar"
                            devices={['celular', 'tablet', 'pc']}
                            actionDesc="Agrega el ítem al remito y genera alerta visual instantánea"
                            isActive={guideMode}
                          >
                            <button
                              type="button"
                              onClick={() => handleAddFromCard(product)}
                              className="w-full py-1.5 px-2 bg-[#01372e] hover:bg-[#1f4e44] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 active:scale-95 transition-all shadow-xs"
                            >
                              <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                              <span>Agregar</span>
                            </button>
                          </InteractiveIndicator>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Banner de Tarimas y Pallets Completos B2B */}
          <div className="mt-8 p-5 rounded-2xl bg-[#01372e] text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#204e44] shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1f4e44] flex items-center justify-center text-[#bceddf] shrink-0">
                <span className="material-symbols-outlined text-[24px]">pallet</span>
              </div>
              <div className="flex flex-col">
                <h4 className="font-serif font-bold text-base text-white">
                  Escala por Tarimas y Pallets Completos
                </h4>
                <p className="text-xs text-[#8ebeb1] mt-0.5">
                  Pedidos mayores a <strong>250 KG</strong> acceden a flete bonificado en CABA y transporte con seguro bonificado al interior.
                </p>
              </div>
            </div>
            <a
              href={`https://wa.me/${KARIM_CONTACT.phoneInternational}?text=Hola%20Karim,%20quiero%20cotizar%20tarima%20completa%20mayor%20a%20250kg`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-4 py-2 rounded-xl bg-[#1ebe5d] hover:bg-[#19a550] text-white text-xs font-bold shadow-sm transition-all"
            >
              Consultar Fletes Expresos
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
