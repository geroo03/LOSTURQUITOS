import { useMemo, useState } from 'react';
import { Category, CategoryFilter, Product } from '../../types';
import { waLink } from '../../lib/config';
import { ProductCard } from '../ProductCard';
import { PriceListButton } from '../PriceListButton';

interface Props {
  products: Product[];
  categories: Category[];
  selectedCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, unit: string, quantity: number) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

type Sort = 'orden' | 'precio-asc' | 'precio-desc' | 'nombre';

const minPrice = (p: Product) => Math.min(...p.variants.map((v) => v.price));
const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function CatalogView({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
  searchQuery,
  onSearchChange,
}: Props) {
  const [sortBy, setSortBy] = useState<Sort>('orden');

  // Tope del filtro de precio: el precio más alto del catálogo, redondeado hacia arriba a $500.
  const priceCeiling = useMemo(
    () => Math.max(500, Math.ceil(Math.max(0, ...products.map(minPrice)) / 500) * 500),
    [products],
  );
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const limit = maxPrice ?? priceCeiling;

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    products.forEach((p) => (m[p.categoryId] = (m[p.categoryId] ?? 0) + 1));
    return m;
  }, [products]);
  const featuredCount = products.filter((p) => p.featured || p.onSale).length;
  const saleCount = products.filter((p) => p.onSale).length;

  const filtered = useMemo(() => {
    const q = normalize(searchQuery.trim());
    const list = products.filter((p) => {
      if (selectedCategory === 'destacados' && !p.featured && !p.onSale) return false;
      if (selectedCategory === 'ofertas' && !p.onSale) return false;
      if (!['todos', 'destacados', 'ofertas'].includes(selectedCategory) && p.categoryId !== selectedCategory) return false;
      if (q && !normalize(`${p.title} ${p.categoryLabel} ${p.description ?? ''}`).includes(q)) return false;
      if (minPrice(p) > limit) return false;
      return true;
    });
    if (sortBy === 'precio-asc') list.sort((a, b) => minPrice(a) - minPrice(b));
    else if (sortBy === 'precio-desc') list.sort((a, b) => minPrice(b) - minPrice(a));
    else if (sortBy === 'nombre') list.sort((a, b) => a.title.localeCompare(b.title, 'es'));
    return list;
  }, [products, selectedCategory, searchQuery, limit, sortBy]);

  const reset = () => {
    onSelectCategory('todos');
    onSearchChange('');
    setMaxPrice(null);
  };

  const options = [
    { id: 'todos', label: 'Todas las categorías', count: products.length },
    ...(featuredCount ? [{ id: 'destacados', label: 'Ofertas y destacados', count: featuredCount }] : []),
    ...(saleCount ? [{ id: 'ofertas', label: 'Solo ofertas', count: saleCount }] : []),
    ...categories.map((c) => ({ id: c.id, label: c.label, count: counts[c.id] ?? 0 })),
  ];

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Encabezado */}
      <section className="bg-[#fff3d7] p-4 sm:p-6 rounded-2xl border border-[#efe1c2] flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#404846]">
            <span>Inicio</span>
            <span>/</span>
            <span className="text-[#01372e] font-bold">Catálogo</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faedcd] border border-[#efe1c2]">
            <span className="w-2 h-2 rounded-full bg-[#1ebe5d] animate-pulse" />
            <span className="font-mono text-[10px] sm:text-[11px] text-[#211b08] font-bold uppercase tracking-wider">
              {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#01372e] font-bold tracking-tight">
            Catálogo de condimentos y almacén
          </h1>
          <PriceListButton
            products={products}
            categories={categories}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#01372e] text-white text-xs font-semibold hover:bg-[#1f4e44] disabled:opacity-60 transition-colors shadow-xs"
          />
        </div>
      </section>

      {/* Búsqueda y orden */}
      <section className="bg-white p-3 sm:p-4 rounded-2xl border border-[#efe1c2] shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#49645c] text-[20px]">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscá comino, pimentón, nueces, orégano…"
            className="w-full pl-10 pr-4 py-2 bg-[#fff8f0] border border-[#c0c8c4] rounded-xl text-xs sm:text-sm text-[#211b08] placeholder-[#707976] focus:outline-none focus:ring-2 focus:ring-[#01372e]"
          />
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-2">
          <div className="flex items-center gap-1 text-xs text-[#404846]">
            <span className="material-symbols-outlined text-[16px] text-[#49645c]">swap_vert</span>
            <span className="hidden sm:inline font-medium">Ordenar por:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as Sort)}
            aria-label="Ordenar productos"
            className="bg-[#fff8f0] border border-[#c0c8c4] rounded-xl px-3 py-2 text-xs font-semibold text-[#01372e] focus:outline-none cursor-pointer"
          >
            <option value="orden">Orden del catálogo</option>
            <option value="nombre">Nombre (A–Z)</option>
            <option value="precio-asc">Menor precio</option>
            <option value="precio-desc">Mayor precio</option>
          </select>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
        {/* Sidebar de filtros (PC) */}
        <aside className="hidden lg:flex flex-col gap-5 sticky top-48">
          <div className="bg-white rounded-2xl p-5 border border-[#efe1c2] shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-[#efe1c2] pb-3">
              <span className="font-serif font-bold text-base text-[#01372e] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px] text-[#49645c]">tune</span>
                <span>Filtros</span>
              </span>
              <button type="button" onClick={reset} className="font-mono text-[10px] text-[#842401] hover:underline uppercase font-bold">
                Limpiar
              </button>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[10px] text-[#404846] uppercase font-bold tracking-wider block">Categorías</span>
              <div className="space-y-1 text-xs">
                {options.map((o) => (
                  <label
                    key={o.id}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedCategory === o.id ? 'bg-[#faedcd] font-bold text-[#01372e]' : 'text-[#404846] hover:bg-[#fff3d7]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="desktop-category"
                        checked={selectedCategory === o.id}
                        onChange={() => onSelectCategory(o.id)}
                        className="accent-[#01372e]"
                      />
                      <span>{o.label}</span>
                    </span>
                    <span className="font-mono text-[10px] bg-[#efe1c2] px-1.5 py-0.5 rounded text-[#707976]">{o.count}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2 border-t border-[#efe1c2] pt-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#404846] uppercase font-bold tracking-wider">Precio máximo</span>
                <span className="font-mono text-xs text-[#01372e] font-bold">${limit.toLocaleString('es-AR')}</span>
              </div>
              <input
                type="range"
                min={500}
                max={priceCeiling}
                step={500}
                value={limit}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                aria-label="Precio máximo"
                className="w-full accent-[#01372e] cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[10px] text-[#707976]">
                <span>$500</span>
                <span>${priceCeiling.toLocaleString('es-AR')}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#01372e] text-white p-5 rounded-2xl flex flex-col gap-2 border border-[#204e44] shadow-sm">
            <span className="font-mono text-[10px] text-[#bceddf] uppercase font-bold tracking-wider">Lista de precios</span>
            <h4 className="font-serif font-bold text-base">¿Buscás la lista completa?</h4>
            <p className="text-xs text-[#8ebeb1] leading-relaxed">Descargala en PDF desde el botón de arriba, o pedísela a Karim por WhatsApp.</p>
            <a
              href={waLink('Hola Karim, quiero pedir la lista de precios completa')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full py-2 bg-white hover:bg-[#fff8f0] text-[#01372e] font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px] text-[#1ebe5d]">chat</span>
              <span>Pedir lista a Karim</span>
            </a>
          </div>
        </aside>

        <div className="flex flex-col gap-4">
          {/* Chips (celular y tablet) */}
          <div className="lg:hidden flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {options.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => onSelectCategory(o.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                  selectedCategory === o.id ? 'bg-[#01372e] text-white shadow-sm' : 'bg-[#f4e7c8] text-[#211b08] hover:bg-[#efe1c2]'
                }`}
              >
                {o.id === 'todos' ? 'Todos' : o.label} ({o.count})
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-[#efe1c2] flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-[48px] text-[#707976]">inventory_2</span>
              <h3 className="font-serif text-lg font-bold text-[#01372e]">No encontramos productos con ese filtro</h3>
              <p className="text-xs text-[#404846] max-w-sm">Probá con otra palabra o limpiá los filtros para ver todo el catálogo.</p>
              <button type="button" onClick={reset} className="mt-2 px-4 py-2 bg-[#01372e] text-white rounded-xl text-xs font-semibold">
                Restablecer catálogo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} onOpen={onSelectProduct} onAdd={onAddToCart} />
              ))}
            </div>
          )}

          <div className="mt-8 p-5 rounded-2xl bg-[#01372e] text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#204e44] shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1f4e44] flex items-center justify-center text-[#bceddf] shrink-0">
                <span className="material-symbols-outlined text-[24px]">request_quote</span>
              </div>
              <div className="flex flex-col">
                <h4 className="font-serif font-bold text-base">¿Necesitás una cotización especial?</h4>
                <p className="text-xs text-[#8ebeb1] mt-0.5">Para pedidos grandes o productos que no encontrás, consultale a Karim.</p>
              </div>
            </div>
            <a
              href={waLink('Hola Karim, quiero cotizar un pedido grande')}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-4 py-2 rounded-xl bg-[#1ebe5d] hover:bg-[#19a550] text-white text-xs font-bold shadow-sm transition-all"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
