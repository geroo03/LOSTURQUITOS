import { useMemo } from 'react';
import { Category, CategoryFilter, LastOrderInfo, Product, StoreConfig } from '../../types';
import { DEFAULT_TAGLINE, WHATSAPP_DISPLAY, waLink } from '../../lib/config';
import { FeaturedCarousel } from '../FeaturedCarousel';
import { PriceListButton } from '../PriceListButton';
import { CategorySections, sectionId } from '../CategorySections';

interface Props {
  products: Product[];
  categories: Category[];
  config: StoreConfig;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, unit: string, quantity: number) => void;
  onGoToCatalog: (category?: CategoryFilter) => void;
  lastOrder: LastOrderInfo | null;
  onRepeatLastOrder: () => void;
  onOpenHowToBuy: () => void;
  onGoToCart: () => void;
}

const STEPS = [
  { t: 'Elegí productos y presentación', d: 'Explorá el catálogo y sumá cantidades al pedido.' },
  { t: 'Revisá tu pedido', d: 'Chequeá el detalle y completá tus datos de entrega.' },
  { t: 'Karim confirma por WhatsApp', d: 'Se abre WhatsApp con todo armado y coordinamos la entrega.' },
];

export function HomeView({
  products,
  categories,
  config,
  onSelectProduct,
  onAddToCart,
  onGoToCatalog,
  lastOrder,
  onRepeatLastOrder,
  onOpenHowToBuy,
  onGoToCart,
}: Props) {
  // Carrusel: primero las ofertas, después los destacados. Si Karim no marcó ninguno, la sección no aparece.
  const spotlight = useMemo(
    () => [...products.filter((p) => p.onSale && !p.soldOut), ...products.filter((p) => p.featured && !p.onSale && !p.soldOut)].slice(0, 16),
    [products],
  );

  return (
    <div className="flex flex-col gap-6 sm:gap-8 pb-12">
      {/* 1. Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div
          className="lg:col-span-8 relative overflow-hidden rounded-2xl bg-norte text-marfil p-5 sm:p-8 shadow-[0_10px_30px_rgba(31,59,49,0.25)] flex flex-col justify-between border border-mostaza/50"
          style={
            config.heroImageUrl
              ? {
                  backgroundImage: `linear-gradient(90deg, rgba(31,59,49,.97) 45%, rgba(31,59,49,.82)), url(${JSON.stringify(config.heroImageUrl)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : undefined
          }
        >
          {/* Línea dorada interior, como el anillo del logo */}
          <div className="absolute inset-2 sm:inset-3 rounded-xl border border-mostaza/25 pointer-events-none" />
          <img
            src="/marca/productos-especias.webp"
            alt=""
            aria-hidden="true"
            className="hidden lg:block absolute right-6 top-1/2 -translate-y-1/2 w-72 h-72 pointer-events-none select-none drop-shadow-[0_12px_30px_rgba(0,0,0,0.45)]"
          />

          <div className="flex flex-col gap-3 relative z-10 lg:max-w-[58%]">
            <span className="font-display text-mostaza text-xs sm:text-sm tracking-[0.25em] uppercase">Norte Origen</span>
            <h1 className="font-serif text-[26px] sm:text-4xl lg:text-[42px] text-marfil leading-[1.12] font-bold">
              Especias, condimentos y frutos secos a precio de mayorista
            </h1>
            <div className="flex items-center gap-2 text-mostaza" aria-hidden="true">
              <span className="h-px w-10 bg-mostaza/70" />
              <span className="material-symbols-outlined text-[16px]">eco</span>
              <span className="h-px w-10 bg-mostaza/70" />
            </div>
            <p className="text-sm sm:text-base text-marfil/80 leading-relaxed max-w-xl">
              {config.tagline || DEFAULT_TAGLINE}
            </p>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 relative z-10">
            <button
              type="button"
              onClick={() => onGoToCatalog()}
              className="w-full sm:w-auto h-12 px-6 rounded-xl bg-mostaza hover:bg-[#d4aa58] text-norte flex items-center justify-center gap-2 font-bold text-sm shadow-md transition-all active:scale-[0.98]"
            >
              <span>Ver catálogo completo</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
            <div className="flex items-center justify-center sm:justify-start gap-2 font-mono text-[11px] text-marfil/75 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-oliva animate-pulse" />
              <strong className="text-marfil text-sm">{products.length}</strong>
              <span>productos en catálogo</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 rounded-2xl bg-marfil-100 text-norte p-5 sm:p-7 shadow-sm flex flex-col justify-between relative overflow-hidden border border-mostaza/40">
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-norte text-mostaza font-mono text-[10px] uppercase font-bold tracking-wider">
                Atención directa
              </span>
              <span className="material-symbols-outlined text-mostaza-oscura text-[22px]">support_agent</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold mt-1">Hablá con Karim</h2>
            <p className="text-xs sm:text-sm text-gris leading-relaxed">
              ¿Necesitás una cotización especial o tenés dudas de algún producto? Escribile por WhatsApp.
            </p>
          </div>
          <div className="mt-5 pt-2 flex flex-col gap-2 relative z-10">
            <div className="bg-white/70 p-2.5 rounded-xl flex items-center justify-between border border-marfil-300">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-salvia uppercase font-semibold tracking-wider">WhatsApp</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-norte">{WHATSAPP_DISPLAY}</span>
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

      {/* Accesos rápidos, como las historias destacadas de Instagram */}
      <nav aria-label="Accesos rápidos" className="-mx-4 sm:mx-0">
        <ul className="flex sm:justify-center gap-4 sm:gap-8 overflow-x-auto no-scrollbar px-4 sm:px-0 py-1">
          {(
            [
              { img: 'productos', label: 'Productos', onClick: () => onGoToCatalog() },
              { img: 'ofertas', label: 'Ofertas', onClick: () => onGoToCatalog('destacados') },
              { img: 'envios', label: 'Envíos', onClick: onOpenHowToBuy },
              { img: 'pedidos', label: 'Mi pedido', onClick: onGoToCart },
              { img: 'contacto', label: 'Contacto', href: waLink('Hola Karim, te contacto desde la tienda de Norte Origen') },
            ] as { img: string; label: string; onClick?: () => void; href?: string }[]
          ).map((h) => {
            const inner = (
              <>
                <span className="block rounded-full p-[3px] bg-gradient-to-br from-mostaza via-[#e3c27a] to-oliva shadow-sm group-hover:shadow-md transition-shadow">
                  <img
                    src={`/marca/${h.img}.webp`}
                    alt=""
                    className="block w-[72px] h-[72px] sm:w-24 sm:h-24 rounded-full border-2 border-marfil group-hover:scale-[1.04] group-active:scale-95 transition-transform"
                  />
                </span>
                <span className="mt-1.5 text-[11px] sm:text-xs font-semibold text-norte">{h.label}</span>
              </>
            );
            const cls = 'group flex flex-col items-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-mostaza rounded-xl';
            return (
              <li key={h.img}>
                {h.href ? (
                  <a href={h.href} target="_blank" rel="noopener noreferrer" className={cls}>
                    {inner}
                  </a>
                ) : (
                  <button type="button" onClick={h.onClick} className={cls}>
                    {inner}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Repetir último pedido */}
      {lastOrder && (
        <button
          type="button"
          onClick={onRepeatLastOrder}
          className="w-full text-left rounded-2xl bg-white border border-marfil-300 shadow-sm hover:shadow-md p-3.5 sm:p-4 flex items-center gap-3 transition-all active:scale-[0.99]"
        >
          <span className="w-10 h-10 rounded-xl bg-oliva-suave text-norte flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">history</span>
          </span>
          <span className="flex-1 min-w-0">
            <span className="block font-serif font-bold text-sm sm:text-base text-norte">Repetir mi último pedido</span>
            <span className="block text-xs text-gris">
              {lastOrder.count} {lastOrder.count === 1 ? 'producto' : 'productos'} · {new Date(lastOrder.at).toLocaleDateString('es-AR')}
            </span>
          </span>
          <span className="material-symbols-outlined text-norte">arrow_forward</span>
        </button>
      )}

      {/* 2. Carrusel de ofertas y destacados (arriba, para que se vea sin scrollear de más) */}
      <FeaturedCarousel products={spotlight} onOpen={onSelectProduct} onAdd={onAddToCart} onSeeAll={onGoToCatalog} />

      {/* 3. Catálogo completo, separado por categoría: se ve sin salir del inicio */}
      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between px-1">
          <h2 className="font-serif text-xl sm:text-2xl text-norte font-bold">Catálogo completo</h2>
          <button
            type="button"
            onClick={() => onGoToCatalog()}
            className="text-xs sm:text-sm font-bold text-salvia hover:text-norte transition-colors"
          >
            Buscar y filtrar →
          </button>
        </div>
        {/* Chips: saltan a cada categoría de abajo */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => onGoToCatalog('destacados')}
            className="shrink-0 px-4 py-2 rounded-xl bg-norte text-white text-xs sm:text-sm font-semibold shadow-sm flex items-center gap-1.5 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[16px] text-mostaza">bolt</span>
            <span>Ofertas y destacados</span>
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => document.getElementById(sectionId(c.id))?.scrollIntoView({ behavior: 'smooth' })}
              className="shrink-0 px-4 py-2 rounded-xl bg-marfil-200 text-tinta hover:bg-marfil-300 text-xs sm:text-sm font-semibold shadow-sm transition-colors"
            >
              {c.label}
            </button>
          ))}
        </div>
        <CategorySections products={products} categories={categories} onOpen={onSelectProduct} onAdd={onAddToCart} />
      </section>

      {/* 4. Cómo comprar */}
      <section className="rounded-2xl bg-norte text-white p-5 sm:p-7 shadow-sm flex flex-col gap-4 relative overflow-hidden border border-norte-medio">
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-48 h-48 rounded-full bg-norte-medio/20 blur-3xl pointer-events-none" />
        <div className="flex flex-col gap-1 relative z-10">
          <div className="inline-flex items-center gap-1 text-marfil">
            <span className="material-symbols-outlined text-[16px]">help_center</span>
            <span className="font-mono text-[11px] uppercase tracking-wider font-bold">Sin registros ni pagos online</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold">¿Cómo comprar en Norte Origen?</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10">
          {STEPS.map((s, i) => (
            <div key={s.t} className="flex items-start gap-3 bg-norte-claro/70 p-3.5 rounded-xl border border-mostaza/20">
              <div
                className={`w-8 h-8 rounded-lg font-mono font-bold flex items-center justify-center shrink-0 text-xs ${
                  i === 2 ? 'bg-[#1ebe5d]/30' : 'bg-mostaza/20 text-mostaza'
                }`}
              >
                {i === 2 ? <span className="material-symbols-outlined text-[16px] text-[#1ebe5d]">chat</span> : `0${i + 1}`}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-bold leading-snug">{s.t}</span>
                <span className="text-[11px] sm:text-xs text-salvia-clara mt-0.5">{s.d}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Contacto */}
      <section className="rounded-2xl bg-marfil-200 p-4 sm:p-5 shadow-sm flex items-center gap-4 border border-marfil-300">
        <div className="w-12 h-12 rounded-full bg-[#1ebe5d] text-white flex items-center justify-center shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-[26px]">support_agent</span>
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="font-serif text-sm sm:text-base font-bold text-norte">¿Dudas o pedidos especiales?</h3>
          <p className="text-xs sm:text-sm text-gris mt-0.5 leading-snug">
            Hablá directo con Karim por WhatsApp, o descargá la lista de precios completa.
          </p>
          <PriceListButton
            className="mt-2 mr-3 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-norte hover:underline disabled:opacity-60"
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
