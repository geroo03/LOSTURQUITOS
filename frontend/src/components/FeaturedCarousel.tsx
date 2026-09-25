import { useCallback, useEffect, useRef, useState } from 'react';
import { CategoryFilter, Product } from '../types';
import { unitLabel } from '../lib/config';
import { PriceTag } from './PriceTag';
import { ProductImage } from './ProductImage';

interface Props {
  products: Product[]; // ya filtrados: ofertas y destacados
  onOpen: (product: Product) => void;
  onAdd: (product: Product, unit: string, quantity: number) => void;
  onSeeAll: (filter: CategoryFilter) => void;
}

const AUTOPLAY_MS = 4500;

/** Carrusel de ofertas y destacados: scroll con snap (tocar/arrastrar), flechas y avance automático que se pausa al interactuar. */
export function FeaturedCarousel({ products, onOpen, onAdd, onSeeAll }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const [added, setAdded] = useState<string | null>(null);

  const scrollByPage = useCallback((dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: 'smooth' });
    else el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      if (!paused.current && !document.hidden) scrollByPage(1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [scrollByPage]);

  const pause = () => (paused.current = true);
  const resume = () => (paused.current = false);

  if (!products.length) return null;

  const flash = (p: Product) => {
    onAdd(p, p.variants[0].unit, 1);
    setAdded(p.id);
    setTimeout(() => setAdded((cur) => (cur === p.id ? null : cur)), 1200);
  };

  return (
    <section className="flex flex-col gap-3" aria-roledescription="carrusel" aria-label="Ofertas y destacados">
      <div className="flex items-center justify-between px-1 gap-3">
        <div className="flex flex-col">
          <h2 className="font-serif text-xl sm:text-2xl text-[#01372e] font-bold">Ofertas y destacados</h2>
          <span className="text-xs text-[#404846]">Lo que Karim recomienda esta semana</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSeeAll('destacados')}
            className="hidden sm:inline text-xs sm:text-sm font-bold text-[#49645c] hover:text-[#01372e] transition-colors mr-1"
          >
            Ver todos →
          </button>
          {(['prev', 'next'] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => scrollByPage(d === 'next' ? 1 : -1)}
              aria-label={d === 'next' ? 'Siguiente' : 'Anterior'}
              className="w-9 h-9 rounded-full bg-[#f4e7c8] hover:bg-[#efe1c2] text-[#01372e] flex items-center justify-center active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">{d === 'next' ? 'chevron_right' : 'chevron_left'}</span>
            </button>
          ))}
        </div>
      </div>

      <div
        ref={track}
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocus={pause}
        onBlur={resume}
        onTouchStart={pause}
        onTouchEnd={() => setTimeout(resume, 4000)}
        className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 -mx-1 px-1 scroll-smooth"
      >
        {products.map((p) => {
          const v = p.variants[0];
          return (
            <article
              key={p.id}
              className="snap-start shrink-0 w-[62%] sm:w-[36%] md:w-[28%] lg:w-[22%] bg-white rounded-2xl p-3 border border-[#efe1c2] shadow-sm flex flex-col gap-2 group hover:shadow-md transition-shadow"
            >
              <button
                type="button"
                onClick={() => onOpen(p)}
                aria-label={`Ver ${p.title}`}
                className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#faedcd] block"
              >
                <ProductImage src={p.images[0]} alt="" className="w-full h-full group-hover:scale-105 transition-transform duration-300" />
                <span
                  className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-white font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${
                    p.onSale ? 'bg-[#ba1a1a]' : 'bg-[#842401]'
                  }`}
                >
                  {p.onSale ? 'Oferta' : 'Destacado'}
                </span>
              </button>
              <div className="min-w-0">
                <span className="font-mono text-[9px] sm:text-[10px] text-[#5d1700] font-bold uppercase block truncate">{p.categoryLabel}</span>
                <h3
                  onClick={() => onOpen(p)}
                  className="font-serif text-xs sm:text-sm font-bold text-[#01372e] leading-snug line-clamp-2 min-h-[34px] cursor-pointer hover:underline"
                >
                  {p.title}
                </h3>
              </div>
              <div className="flex items-baseline justify-between mt-auto">
                <PriceTag variant={v} className="font-mono text-sm sm:text-base font-bold text-[#01372e]" />
                <span className="font-mono text-[10px] text-[#49645c] font-semibold">por {unitLabel(v.unit)}</span>
              </div>
              <button
                type="button"
                onClick={() => flash(p)}
                className={`w-full py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 active:scale-95 transition-all text-white ${
                  added === p.id ? 'bg-[#1ebe5d]' : 'bg-[#01372e] hover:bg-[#1f4e44]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{added === p.id ? 'check' : 'add_shopping_cart'}</span>
                <span>{added === p.id ? '¡Agregado!' : 'Agregar'}</span>
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
