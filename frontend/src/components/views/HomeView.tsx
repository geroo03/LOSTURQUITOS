import { useMemo } from 'react';
import { Category, CategoryFilter, LastOrderInfo, Product, StoreConfig } from '../../types';
import { DEFAULT_TAGLINE, WHATSAPP_DISPLAY, waLink } from '../../lib/config';
import { FeaturedCarousel } from '../FeaturedCarousel';
import { PriceListButton } from '../PriceListButton';

interface Props {
  products: Product[];
  categories: Category[];
  config: StoreConfig;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, unit: string, quantity: number) => void;
  onGoToCatalog: (category?: CategoryFilter) => void;
  lastOrder: LastOrderInfo | null;
  onRepeatLastOrder: () => void;
}

const STEPS = [
  { t: 'Elegí productos y presentación', d: 'Explorá el catálogo y sumá cantidades al pedido.' },
  { t: 'Revisá tu pedido', d: 'Chequeá el detalle y completá tus datos de entrega.' },
  { t: 'Karim confirma por WhatsApp', d: 'Se abre WhatsApp con todo armado y coordinamos la entrega.' },
];

export function HomeView({ products, categories, config, onSelectProduct, onAddToCart, onGoToCatalog, lastOrder, onRepeatLastOrder }: Props) {
  // Carrusel: primero las ofertas, después los destacados. Si Karim no marcó ninguno, la sección no aparece.
  const spotlight = useMemo(
    () => [...products.filter((p) => p.onSale && !p.soldOut), ...products.filter((p) => p.featured && !p.onSale && !p.soldOut)].slice(0, 16),
    [products],
  );

  // Mosaico de rubros: la portada de cada rubro es la primera foto de sus productos.
  const tiles = useMemo(
    () =>
      categories.slice(0, 3).map((c) => {
        const inCat = products.filter((p) => p.categoryId === c.id);
        return { ...c, count: inCat.length, image: inCat.find((p) => p.images[0])?.images[0] };
      }),
    [categories, products],
  );

  return (
    <div className="flex flex-col gap-6 sm:gap-8 pb-12">
      {/* 1. Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div
          className="lg:col-span-8 relative overflow-hidden rounded-2xl bg-[#f4e7c8] p-5 sm:p-7 shadow-sm flex flex-col justify-between border border-[#efe1c2]"
          style={
            config.heroImageUrl
              ? {
                  backgroundImage: `linear-gradient(180deg, rgba(244,231,200,.9), rgba(244,231,200,.94)), url(${JSON.stringify(config.heroImageUrl)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : undefined
          }
        >
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#1f4e44]/10 pointer-events-none blur-3xl" />

          <div className="flex flex-col gap-3 relative z-10">
            <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-white shadow-sm border border-[#efe1c2]">
              <span className="material-symbols-outlined text-[#842401] text-[16px]">verified</span>
              <span className="font-mono text-[11px] text-[#211b08] font-bold uppercase tracking-wider">
                Mayorista de condimentos y almacén
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#01372e] leading-tight font-bold">
              Condimentos, frutos secos y especias a precio de mayorista
            </h1>
            <p className="text-sm sm:text-base text-[#404846] leading-relaxed max-w-xl">
              {config.tagline || DEFAULT_TAGLINE}
            </p>
          </div>

          <div className="mt-6 pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 relative z-10">
            <button
              type="button"
              onClick={() => onGoToCatalog()}
              className="w-full sm:w-auto h-12 px-6 rounded-xl bg-[#01372e] hover:bg-[#1f4e44] text-white flex items-center justify-center gap-2 font-semibold text-sm shadow-md transition-all active:scale-[0.98]"
            >
              <span>Ver catálogo completo</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
            <div className="flex items-center justify-center sm:justify-start gap-2 font-mono text-[11px] text-[#404846]">
              <span className="w-2 h-2 rounded-full bg-[#1ebe5d] animate-pulse" />
              <strong className="text-[#01372e]">{products.length}</strong>
              <span>productos en catálogo</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 rounded-2xl bg-[#01372e] text-white p-5 sm:p-7 shadow-sm flex flex-col justify-between relative overflow-hidden border border-[#204e44]">
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-[#1f4e44] text-[#bceddf] font-mono text-[10px] uppercase font-bold tracking-wider">
                Atención directa
              </span>
              <span className="material-symbols-outlined text-[#bceddf] text-[22px]">badge</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold mt-1">Hablá con Karim</h2>
            <p className="text-xs sm:text-sm text-[#8ebeb1] leading-relaxed">
              ¿Necesitás una cotización especial o tenés dudas de algún producto? Escribile por WhatsApp.
            </p>
          </div>
          <div className="mt-5 pt-2 flex flex-col gap-2 relative z-10">
            <div className="bg-[#1f4e44]/80 p-2.5 rounded-xl flex items-center justify-between border border-[#a0d0c3]/20">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-[#bceddf] uppercase">WhatsApp</span>
                <span className="font-mono text-xs sm:text-sm font-bold">{WHATSAPP_DISPLAY}</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-[#1ebe5d] animate-pulse" />
            </div>
            <a
              href={waLink('Hola Karim, quiero consultar por un pedido')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-[#1ebe5d] hover:bg-[#19a550] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>Hablar con Karim ahora</span>
            </a>
          </div>
        </div>
      </section>

      {/* Repetir último pedido */}
      {lastOrder && (
        <button
          type="button"
          onClick={onRepeatLastOrder}
          className="w-full text-left rounded-2xl bg-white border border-[#efe1c2] shadow-sm hover:shadow-md p-3.5 sm:p-4 flex items-center gap-3 transition-all active:scale-[0.99]"
        >
          <span className="w-10 h-10 rounded-xl bg-[#c8e6dd] text-[#01372e] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">history</span>
          </span>
          <span className="flex-1 min-w-0">
            <span className="block font-serif font-bold text-sm sm:text-base text-[#01372e]">Repetir mi último pedido</span>
            <span className="block text-xs text-[#404846]">
              {lastOrder.count} {lastOrder.count === 1 ? 'producto' : 'productos'} · {new Date(lastOrder.at).toLocaleDateString('es-AR')}
            </span>
          </span>
          <span className="material-symbols-outlined text-[#01372e]">arrow_forward</span>
        </button>
      )}

      {/* 2. Carrusel de ofertas y destacados (arriba, para que se vea sin scrollear de más) */}
      <FeaturedCarousel products={spotlight} onOpen={onSelectProduct} onAdd={onAddToCart} onSeeAll={onGoToCatalog} />

      {/* 3. Chips de categorías */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-mono text-xs uppercase text-[#842401] font-bold tracking-wider">Categorías</span>
          <span className="text-xs text-[#49645c] font-medium hidden sm:inline">Deslizá →</span>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => onGoToCatalog('destacados')}
            className="shrink-0 px-4 py-2 rounded-xl bg-[#01372e] text-white text-xs sm:text-sm font-semibold shadow-sm flex items-center gap-1.5 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[16px] text-[#ffb59e]">bolt</span>
            <span>Ofertas y destacados</span>
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onGoToCatalog(c.id)}
              className="shrink-0 px-4 py-2 rounded-xl bg-[#f4e7c8] text-[#211b08] hover:bg-[#efe1c2] text-xs sm:text-sm font-semibold shadow-sm transition-colors"
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Mosaico de rubros */}
      {tiles.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between px-1">
            <h2 className="font-serif text-xl sm:text-2xl text-[#01372e] font-bold">Navegar por rubro</h2>
            <button
              type="button"
              onClick={() => onGoToCatalog()}
              className="text-xs sm:text-sm font-bold text-[#49645c] hover:text-[#01372e] transition-colors"
            >
              Ver todo →
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {tiles.map((t, i) => {
              const big = i === 0;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onGoToCatalog(t.id)}
                  className={`text-left relative overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between border border-[#efe1c2] group ${
                    big ? 'col-span-2 bg-white p-4 sm:p-5 h-48 sm:h-52' : 'col-span-1 bg-[#f4e7c8] p-3 sm:p-4 h-44 sm:h-48'
                  }`}
                >
                  {t.image && (
                    <img
                      src={t.image}
                      alt=""
                      loading="lazy"
                      className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                        big ? 'opacity-35' : 'opacity-25'
                      }`}
                    />
                  )}
                  <div className="relative z-10 flex justify-between items-start w-full">
                    {big ? (
                      <span className="font-mono text-[10px] bg-[#842401] text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        Rubro principal
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="w-8 h-8 rounded-full bg-[#faedcd]/80 backdrop-blur-sm flex items-center justify-center text-[#01372e] group-hover:bg-[#01372e] group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[18px]">north_east</span>
                    </span>
                  </div>
                  <div
                    className={`relative z-10 flex flex-col ${
                      big ? 'bg-white/90 backdrop-blur-md -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 p-3 sm:p-4 rounded-b-2xl' : ''
                    }`}
                  >
                    <span className="font-mono text-[9px] sm:text-[10px] text-[#5d1700] font-bold tracking-wider uppercase">
                      {t.count} productos
                    </span>
                    <span className="font-serif text-sm sm:text-base lg:text-lg font-bold text-[#01372e] leading-snug">
                      {t.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Cómo comprar */}
      <section className="rounded-2xl bg-[#01372e] text-white p-5 sm:p-7 shadow-sm flex flex-col gap-4 relative overflow-hidden border border-[#204e44]">
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-48 h-48 rounded-full bg-[#39675c]/20 blur-3xl pointer-events-none" />
        <div className="flex flex-col gap-1 relative z-10">
          <div className="inline-flex items-center gap-1 text-[#bceddf]">
            <span className="material-symbols-outlined text-[16px]">help_center</span>
            <span className="font-mono text-[11px] uppercase tracking-wider font-bold">Sin registros ni pagos online</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold">¿Cómo comprar en Los Turquitos?</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10">
          {STEPS.map((s, i) => (
            <div key={s.t} className="flex items-start gap-3 bg-[#1f4e44]/70 p-3.5 rounded-xl border border-[#a0d0c3]/20">
              <div
                className={`w-8 h-8 rounded-lg font-mono font-bold flex items-center justify-center shrink-0 text-xs ${
                  i === 2 ? 'bg-[#1ebe5d]/30' : 'bg-[#efe1c2]/20'
                }`}
              >
                {i === 2 ? <span className="material-symbols-outlined text-[16px] text-[#1ebe5d]">chat</span> : `0${i + 1}`}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-bold leading-snug">{s.t}</span>
                <span className="text-[11px] sm:text-xs text-[#8ebeb1] mt-0.5">{s.d}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Contacto */}
      <section className="rounded-2xl bg-[#f4e7c8] p-4 sm:p-5 shadow-sm flex items-center gap-4 border border-[#efe1c2]">
        <div className="w-12 h-12 rounded-full bg-[#1ebe5d] text-white flex items-center justify-center shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-[26px]">support_agent</span>
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="font-serif text-sm sm:text-base font-bold text-[#01372e]">¿Dudas o pedidos especiales?</h3>
          <p className="text-xs sm:text-sm text-[#404846] mt-0.5 leading-snug">
            Hablá directo con Karim por WhatsApp, o descargá la lista de precios completa.
          </p>
          <PriceListButton
            products={products}
            categories={categories}
            className="mt-2 mr-3 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#01372e] hover:underline disabled:opacity-60"
          />
          <a
            href={waLink('Hola Karim, quisiera solicitar la lista de precios completa')}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1a9c4d] hover:underline"
          >
            <span>Abrir chat de WhatsApp</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </a>
        </div>
      </section>
    </div>
  );
}
