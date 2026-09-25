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

const SPEED_PX_PER_S = 38; // velocidad del desplazamiento continuo
const REDUCED_STEP_MS = 4500; // con "Reducir movimiento": salto de a una página, sin deslizar
const MIN_FOR_LOOP = 4; // con menos tarjetas no hay bucle: no alcanzan para llenar el ancho

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Carrusel de ofertas y destacados. Se desplaza de forma continua y suave (como una cinta) en bucle infinito;
 * se frena al pasar el mouse, tocar o enfocar, y tiene botón de pausa y flechas. Con "Reducir movimiento"
 * activado en el sistema, en vez de deslizar avanza de a una página sin animación.
 */
export function FeaturedCarousel({ products, onOpen, onAdd, onSeeAll }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const hoverPaused = useRef(false);
  const userPaused = useRef(false);
  const holdUntil = useRef(0); // tras tocar/usar flechas se espera un momento antes de retomar
  const pos = useRef(0); // posición con decimales (scrollLeft se redondea en algunos navegadores)
  const [playing, setPlaying] = useState(true);
  const [added, setAdded] = useState<string | null>(null);

  const loop = products.length >= MIN_FOR_LOOP;
  const items = loop ? [...products, ...products] : products;

  const halfWidth = () => (track.current ? track.current.scrollWidth / 2 : 0);
  const hold = (ms: number) => (holdUntil.current = performance.now() + ms);

  // Movimiento continuo con requestAnimationFrame
  useEffect(() => {
    const el = track.current;
    if (!el || !loop || prefersReducedMotion()) return;
    let raf = 0;
    let last = performance.now();
    pos.current = el.scrollLeft;

    const tick = (now: number) => {
      const dt = Math.min(now - last, 50); // si la pestaña estuvo oculta no pegar un salto
      last = now;
      const idle = hoverPaused.current || userPaused.current || now < holdUntil.current || document.hidden;
      if (!idle) {
        pos.current += (SPEED_PX_PER_S * dt) / 1000;
        const half = halfWidth();
        if (half > 0 && pos.current >= half) pos.current -= half; // empalme invisible: la 2ª copia es idéntica a la 1ª
        el.scrollLeft = pos.current;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [loop]);

  // Con "Reducir movimiento": avance por páginas, instantáneo
  useEffect(() => {
    const el = track.current;
    if (!el || !prefersReducedMotion()) return;
    const id = setInterval(() => {
      if (hoverPaused.current || userPaused.current || document.hidden) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      if (atEnd) el.scrollTo({ left: 0, behavior: 'auto' });
      else el.scrollBy({ left: el.clientWidth * 0.8, behavior: 'auto' });
    }, REDUCED_STEP_MS);
    return () => clearInterval(id);
  }, []);

  // Cuando el usuario mueve el carrusel (touch, trackpad, flechas) se toma la posición real y se mantiene el bucle
  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const idle = hoverPaused.current || userPaused.current || performance.now() < holdUntil.current;
    if (loop) {
      // La 2ª copia es idéntica a la 1ª, así que restar `half` no se nota. Se deja una franja de un ancho de pantalla
      // (zona de aterrizaje del botón "anterior") antes de empalmar, para que ese salto no se deshaga solo.
      const half = halfWidth();
      if (half > 0 && el.scrollLeft >= half + el.clientWidth) el.scrollLeft -= half;
    }
    if (idle) pos.current = el.scrollLeft;
  };

  const scrollByPage = useCallback(
    (dir: 1 | -1) => {
      const el = track.current;
      if (!el) return;
      hold(1500);
      const reduced = prefersReducedMotion();
      const behavior = reduced ? 'auto' : 'smooth';
      if (loop && dir === -1 && el.scrollLeft < el.clientWidth * 0.8) {
        el.scrollLeft += halfWidth(); // saltar a la 2ª copia (idéntica) para poder retroceder sin llegar al tope
      }
      el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior });
    },
    [loop],
  );

  const togglePlaying = () => {
    userPaused.current = !userPaused.current;
    setPlaying(!userPaused.current);
    if (!userPaused.current && track.current) pos.current = track.current.scrollLeft;
  };

  const onEnter = () => (hoverPaused.current = true);
  const onLeave = () => {
    hoverPaused.current = false;
    if (track.current) pos.current = track.current.scrollLeft;
  };

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
          <button
            type="button"
            onClick={togglePlaying}
            aria-label={playing ? 'Pausar carrusel' : 'Reproducir carrusel'}
            className="w-9 h-9 rounded-full bg-[#f4e7c8] hover:bg-[#efe1c2] text-[#01372e] flex items-center justify-center active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">{playing ? 'pause' : 'play_arrow'}</span>
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
        onScroll={onScroll}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onFocus={onEnter}
        onBlur={onLeave}
        onTouchStart={() => {
          hoverPaused.current = true;
        }}
        onTouchEnd={() => {
          hold(2500);
          hoverPaused.current = false;
          if (track.current) pos.current = track.current.scrollLeft;
        }}
        className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1"
      >
        {items.map((p, i) => {
          const v = p.variants[0];
          const isCopy = loop && i >= products.length; // 2ª copia del bucle: solo decorativa
          return (
            <article
              key={`${p.id}-${isCopy ? 'b' : 'a'}`}
              inert={isCopy}
              aria-hidden={isCopy || undefined}
              className="shrink-0 w-[62%] sm:w-[36%] md:w-[28%] lg:w-[22%] bg-white rounded-2xl p-3 border border-[#efe1c2] shadow-sm flex flex-col gap-2 group hover:shadow-md transition-shadow"
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
