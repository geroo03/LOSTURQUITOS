import { useMemo, useState } from 'react';
import { Product } from '../../types';
import { money, shareProduct, unitLabel, waLink } from '../../lib/config';
import { ProductImage } from '../ProductImage';
import { PriceTag } from '../PriceTag';

interface Props {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, unit: string, quantity: number) => void;
}

export function ProductDetailView({ product, allProducts, onBack, onSelectProduct, onAddToCart }: Props) {
  const [imageIdx, setImageIdx] = useState(0);
  const [unit, setUnit] = useState((product.variants.find((v) => !v.soldOut) ?? product.variants[0]).unit);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const variant = product.variants.find((v) => v.unit === unit) ?? product.variants[0];
  const subtotal = variant.price * quantity;

  // Complementarios: primero los de la misma categoría, después el resto.
  const related = useMemo(() => {
    const others = allProducts.filter((p) => p.id !== product.id);
    return [...others.filter((p) => p.categoryId === product.categoryId), ...others.filter((p) => p.categoryId !== product.categoryId)].slice(0, 3);
  }, [allProducts, product]);

  const handleAdd = () => {
    onAddToCart(product, variant.unit, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const inquiry = waLink(
    `Hola Karim, me interesa ${quantity} × ${variant.unit} de ${product.title} (${money(subtotal)}). ¿Lo tenés disponible?`,
  );

  return (
    <div className="flex flex-col gap-5 sm:gap-7 pb-20">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-norte hover:text-norte-claro text-xs sm:text-sm font-semibold transition-colors py-1"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Volver al catálogo</span>
        </button>
        <div className="flex items-center gap-1.5 bg-marfil-200 px-3 py-1 rounded-full text-gris font-mono text-[10px] sm:text-xs tracking-wider uppercase border border-marfil-300">
          <span className="w-1.5 h-1.5 rounded-full bg-mostaza-oscura" />
          <span>{product.categoryLabel}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Galería */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          <div className="relative w-full rounded-2xl bg-marfil-200 p-3 shadow-sm border border-marfil-300">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-marfil-300 shadow-inner">
              <ProductImage src={product.images[imageIdx] ?? product.images[0]} alt={product.title} className="w-full h-full" />
            </div>
            {product.images.length > 1 && (
              <div className="flex items-center gap-2.5 mt-3 overflow-x-auto no-scrollbar pb-1">
                {product.images.map((url, i) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setImageIdx(i)}
                    aria-label={`Ver foto ${i + 1}`}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      imageIdx === i ? 'border-norte ring-2 ring-norte/30' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Compra */}
        <div className="lg:col-span-6 flex flex-col gap-4 sm:gap-5">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-marfil-300 shadow-sm flex flex-col gap-4">
            <div>
              <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-norte leading-tight">{product.title}</h1>
              {product.description && (
                <p className="text-xs sm:text-sm text-gris mt-2 leading-relaxed whitespace-pre-line">{product.description}</p>
              )}
            </div>

            <div className="flex items-baseline justify-between bg-marfil p-3.5 sm:p-4 rounded-xl border border-marfil-300">
              <div>
                <span className="font-mono text-[10px] text-gris-claro uppercase tracking-wider block">Precio</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <PriceTag variant={variant} className="font-mono text-2xl sm:text-3xl font-bold text-norte" />
                  {variant.listPrice && (
                    <span className="font-mono text-[10px] font-bold uppercase bg-oferta text-white px-2 py-0.5 rounded">
                      -{Math.round((1 - variant.price / variant.listPrice) * 100)}%
                    </span>
                  )}
                  <span className="font-mono text-[11px] text-salvia font-bold">por {unitLabel(variant.unit)}</span>
                </div>
              </div>
            </div>

            {product.variants.length > 1 && (
              <div className="space-y-2">
                <span className="font-semibold text-xs sm:text-sm text-norte block">Elegí la presentación:</span>
                <div className="grid grid-cols-3 gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.unit}
                      type="button"
                      onClick={() => setUnit(v.unit)}
                      className={`p-2.5 sm:p-3 rounded-xl flex flex-col items-center justify-center transition-all border ${
                        v.unit === unit
                          ? 'bg-norte text-white border-norte shadow-sm font-bold'
                          : 'bg-marfil-100 text-tinta hover:bg-marfil-200 border-marfil-300'
                      }`}
                    >
                      <span className={`font-mono text-sm sm:text-base font-bold ${v.soldOut ? 'line-through opacity-60' : ''}`}>{v.unit}</span>
                      {v.soldOut && <span className="font-mono text-[9px] uppercase font-bold text-oferta mt-0.5">Sin stock</span>}
                      <span className={`font-mono text-[10px] mt-1 ${v.unit === unit ? 'text-white/80' : 'text-gris'}`}>
                        {money(v.price)}
                        {v.listPrice && <s className="ml-1 opacity-60">{money(v.listPrice)}</s>}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {variant.soldOut ? (
              <div className="bg-marfil-200/60 p-4 rounded-xl border border-marfil-300 flex flex-col gap-3">
                <p className="text-sm text-gris">
                  <strong className="text-oferta">Sin stock</strong> en esta presentación por el momento.
                </p>
                <a
                  href={waLink(`Hola Karim, avisame cuando vuelva ${product.title} (${variant.unit})`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 rounded-xl bg-[#1ebe5d] hover:bg-[#19a550] text-white flex items-center justify-center gap-2 font-bold text-sm shadow-sm transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                  <span>Avisarme cuando vuelva</span>
                </a>
              </div>
            ) : (
              <>
            <div className="bg-marfil-200/60 p-3.5 sm:p-4 rounded-xl border border-marfil-300 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs text-gris block font-medium">Cantidad:</span>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-lg bg-white text-norte flex items-center justify-center shadow-xs font-bold text-lg hover:bg-marfil active:scale-95"
                    aria-label="Restar cantidad"
                  >
                    −
                  </button>
                  <span className="w-9 text-center font-mono text-lg font-bold text-norte">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(999, q + 1))}
                    className="w-9 h-9 rounded-lg bg-norte text-white flex items-center justify-center shadow-xs font-bold text-lg hover:bg-norte-claro active:scale-95"
                    aria-label="Sumar cantidad"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gris block font-medium">Subtotal:</span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-norte block">{money(subtotal)}</span>
                <span className="font-mono text-[10px] sm:text-xs text-salvia font-bold block uppercase">
                  {quantity} × {variant.unit}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => shareProduct(product.id, product.title)}
              className="self-start inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-norte hover:underline"
            >
              <span className="material-symbols-outlined text-[18px]">ios_share</span>
              <span>Compartir este producto</span>
            </button>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleAdd}
                className={`flex-1 h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] text-white ${
                  added ? 'bg-[#1ebe5d]' : 'bg-norte hover:bg-norte-claro'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{added ? 'check_circle' : 'shopping_bag'}</span>
                <span>{added ? '¡Agregado al pedido!' : 'Agregar al pedido'}</span>
              </button>
              <a
                href={inquiry}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 px-5 rounded-xl bg-[#1ebe5d] hover:bg-[#19a550] text-white flex items-center justify-center gap-2 font-bold text-sm shadow-sm transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
                <span>Consultar a Karim</span>
              </a>
            </div>
              </>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-4 bg-white rounded-2xl p-5 sm:p-6 border border-marfil-300 shadow-sm">
          <h3 className="font-serif font-bold text-lg text-norte mb-4">También te puede interesar</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {related.map((rel) => (
              <div
                key={rel.id}
                className="bg-marfil-100 rounded-xl p-3 flex items-center gap-3 border border-marfil-300 hover:bg-marfil-200 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => onSelectProduct(rel)}
                  aria-label={`Ver ${rel.title}`}
                  className="w-16 h-16 rounded-lg overflow-hidden bg-marfil-200 shrink-0"
                >
                  <ProductImage src={rel.images[0]} alt="" className="w-full h-full" />
                </button>
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-[9px] text-mostaza-oscura uppercase font-bold block truncate">{rel.categoryLabel}</span>
                  <h4
                    onClick={() => onSelectProduct(rel)}
                    className="font-serif font-bold text-xs sm:text-sm text-norte leading-tight truncate hover:underline cursor-pointer"
                  >
                    {rel.title}
                  </h4>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="font-mono text-xs font-bold text-norte">
                      {money(rel.variants[0].price)}
                      <span className="text-[10px] font-normal"> /{rel.variants[0].unit}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => onAddToCart(rel, rel.variants[0].unit, 1)}
                      disabled={rel.variants[0].soldOut}
                      className="disabled:opacity-40 disabled:cursor-not-allowed px-2.5 py-1 rounded-lg bg-norte text-white text-[11px] font-semibold hover:bg-norte-claro transition-colors flex items-center gap-1"
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
      )}
    </div>
  );
}
