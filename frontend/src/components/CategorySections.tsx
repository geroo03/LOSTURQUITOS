import { useEffect, useMemo, useRef, useState } from 'react';
import { Category, Product } from '../types';
import { ProductCard } from './ProductCard';

interface Props {
  products: Product[];
  categories: Category[];
  onOpen: (product: Product) => void;
  onAdd: (product: Product, unit: string, quantity: number) => void;
  onSeeCategory?: (categoryId: string) => void; // si viene, cada título tiene "Ver solo esta →"
}

export const sectionId = (categoryId: string) => `cat-${categoryId}`;

// Alto del encabezado fijo (Header): 64px celular, 80px tablet chica, 176px desde md.
const headerHeight = () => (window.innerWidth >= 768 ? 176 : window.innerWidth >= 640 ? 80 : 64);

/**
 * Productos separados por categoría (en el orden de Karim), cada una con su título fijo arriba mientras se recorre.
 * Al costado, un índice como el de Contactos: un punto por categoría unidos por una línea que se va llenando
 * al bajar; se toca o se desliza el dedo para saltar. Usado en Inicio y Catálogo.
 */
export function CategorySections({ products, categories, onOpen, onAdd, onSeeCategory }: Props) {
  const groups = useMemo(
    () =>
      categories
        .map((c) => ({ ...c, items: products.filter((p) => p.categoryId === c.id) }))
        .filter((g) => g.items.length > 0),
    [categories, products],
  );

  const wrapRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0); // 0..1 a lo largo de la línea
  const [inView, setInView] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const [dragging, setDragging] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Qué categoría se está viendo y cuánto de la línea llenar
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const wrap = wrapRef.current;
      if (!wrap || groups.length === 0) return;
      const offset = headerHeight() + 8;
      const box = wrap.getBoundingClientRect();
      setInView(box.top < window.innerHeight * 0.6 && box.bottom > offset + 120);

      const tops = groups.map((g) => document.getElementById(sectionId(g.id))?.getBoundingClientRect() ?? null);
      let idx = 0;
      tops.forEach((r, i) => {
        if (r && r.top <= offset) idx = i;
      });
      const r = tops[idx];
      const frac = r ? Math.min(1, Math.max(0, (offset - r.top) / Math.max(1, r.height))) : 0;
      setActive(idx);
      setProgress(groups.length > 1 ? Math.min(1, (idx + frac) / (groups.length - 1)) : 1);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
      setShowLabel(true);
      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setShowLabel(false), 900);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
      cancelAnimationFrame(frame);
      clearTimeout(hideTimer.current);
    };
  }, [groups]);

  const jumpTo = (i: number, smooth: boolean) =>
    document.getElementById(sectionId(groups[i].id))?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });

  // Deslizar el dedo por el índice: salta a la categoría que queda bajo el dedo
  const indexAt = (clientY: number) => {
    const r = railRef.current!.getBoundingClientRect();
    return Math.round(Math.min(1, Math.max(0, (clientY - r.top) / r.height)) * (groups.length - 1));
  };
  const lastDragIdx = useRef(-1);
  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    lastDragIdx.current = -1;
    onPointerMove(e);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const i = indexAt(e.clientY);
    if (i === lastDragIdx.current) return;
    lastDragIdx.current = i;
    navigator.vibrate?.(5);
    jumpTo(i, false);
  };
  const onPointerUp = () => setDragging(false);

  const n = groups.length;
  const pos = (i: number) => (n > 1 ? (i / (n - 1)) * 100 : 0);

  return (
    <div ref={wrapRef} className="flex flex-col gap-8 pr-5 lg:pr-7">
      {groups.map((g) => (
        <section key={g.id} id={sectionId(g.id)} className="flex flex-col gap-3 scroll-mt-16 sm:scroll-mt-20 md:scroll-mt-44">
          {/* Título fijo mientras se recorre la categoría, con línea abajo (como las letras de Contactos) */}
          <div className="sticky top-16 sm:top-20 md:top-44 z-20 -mx-1 px-1 pt-2 bg-[#fff8f0]/95 backdrop-blur-md">
            <div className="flex items-baseline justify-between gap-3 border-b-2 border-[#01372e]/15 pb-2">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#01372e] leading-tight">
                {g.label}
                <span className="ml-2 font-mono text-[11px] font-bold text-[#707976] align-middle">({g.items.length})</span>
              </h2>
              {onSeeCategory && (
                <button
                  type="button"
                  onClick={() => onSeeCategory(g.id)}
                  className="shrink-0 text-xs font-bold text-[#49645c] hover:text-[#01372e] transition-colors"
                >
                  Ver solo esta →
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {g.items.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={onOpen} onAdd={onAdd} />
            ))}
          </div>
        </section>
      ))}

      {/* Índice lateral: puntos unidos por una línea que se llena al bajar */}
      {n > 1 && (
        <nav
          aria-label="Saltar a una categoría"
          className={`fixed right-0 z-30 top-24 sm:top-28 md:top-52 bottom-[calc(144px+env(safe-area-inset-bottom))] md:bottom-28 w-7 lg:w-9 transition-opacity duration-300 ${
            inView ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div
            ref={railRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="absolute inset-y-2 left-0 right-0 touch-none cursor-pointer select-none"
          >
            {/* línea de fondo y parte recorrida */}
            <span className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] rounded-full bg-[#01372e]/15" />
            <span
              className="absolute left-1/2 -translate-x-1/2 top-0 w-[2px] rounded-full bg-[#01372e] transition-[height] duration-150"
              style={{ height: `${progress * 100}%` }}
            />
            {groups.map((g, i) => (
              <button
                key={g.id}
                type="button"
                tabIndex={inView ? 0 : -1}
                aria-label={g.label}
                aria-current={i === active ? 'true' : undefined}
                onClick={(e) => {
                  e.stopPropagation();
                  jumpTo(i, true);
                }}
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center"
                style={{ top: `${pos(i)}%` }}
              >
                <span
                  className={`rounded-full border-2 transition-all duration-200 ${
                    i === active
                      ? 'w-3.5 h-3.5 bg-[#842401] border-[#fff8f0] shadow-[0_0_0_2px_#842401]'
                      : i < active
                        ? 'w-2 h-2 bg-[#01372e] border-[#01372e]'
                        : 'w-2 h-2 bg-[#fff8f0] border-[#01372e]/40'
                  }`}
                />
              </button>
            ))}
            {/* Cartelito con el nombre de la categoría actual */}
            <span
              aria-hidden="true"
              className={`absolute right-full mr-1 -translate-y-1/2 whitespace-nowrap px-2.5 py-1 rounded-lg bg-[#01372e] text-white text-xs font-semibold shadow-md pointer-events-none transition-all duration-200 ${
                showLabel || dragging ? 'opacity-100' : 'opacity-0 translate-x-1'
              }`}
              style={{ top: `${pos(active)}%` }}
            >
              {groups[active]?.label}
            </span>
          </div>
        </nav>
      )}
    </div>
  );
}
