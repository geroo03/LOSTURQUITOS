import { useState } from 'react';
import { Product } from '../types';
import { unitLabel, waLink } from '../lib/config';
import { PriceTag } from './PriceTag';
import { ProductImage } from './ProductImage';

interface Props {
  product: Product;
  onOpen: (product: Product) => void;
  onAdd: (product: Product, unit: string, quantity: number) => void;
}

/** Tarjeta de producto compartida por Inicio (destacados) y Catálogo: variantes, cantidad y "Agregar". */
export function ProductCard({ product, onOpen, onAdd }: Props) {
  const [unit, setUnit] = useState((product.variants.find((v) => !v.soldOut) ?? product.variants[0]).unit);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const variant = product.variants.find((v) => v.unit === unit) ?? product.variants[0];

  const handleAdd = () => {
    onAdd(product, variant.unit, qty);
    setQty(1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="bg-white rounded-2xl p-3 sm:p-3.5 border border-[#efe1c2] shadow-sm flex flex-col justify-between relative group hover:shadow-md transition-all">
      {variant.soldOut ? (
        <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-[#404846] text-white font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-xs">
          Sin stock
        </span>
      ) : (product.onSale || product.featured) && (
        <span
          className={`absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-white font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-xs ${
            product.onSale ? 'bg-[#ba1a1a]' : 'bg-[#842401]'
          }`}
        >
          {product.onSale ? 'Oferta' : 'Destacado'}
        </span>
      )}

      <div>
        <button
          type="button"
          onClick={() => onOpen(product)}
          className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#faedcd] mb-2 block cursor-pointer"
          aria-label={`Ver detalle de ${product.title}`}
        >
          <ProductImage
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </button>

        <span className="font-mono text-[9px] sm:text-[10px] text-[#5d1700] font-bold uppercase block truncate">
          {product.categoryLabel}
        </span>
        <h3
          onClick={() => onOpen(product)}
          className="font-serif text-xs sm:text-sm font-bold text-[#01372e] leading-snug line-clamp-2 hover:underline cursor-pointer min-h-[34px]"
        >
          {product.title}
        </h3>
      </div>

      <div className="mt-3 pt-2 border-t border-[#efe1c2] flex flex-col gap-2">
        {product.variants.length > 1 && (
          <div className="flex flex-wrap gap-1">
            {product.variants.map((v) => (
              <button
                key={v.unit}
                type="button"
                onClick={() => setUnit(v.unit)}
                className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold transition-colors ${
                  v.unit === unit ? 'bg-[#01372e] text-white' : 'bg-[#f4e7c8] text-[#211b08] hover:bg-[#efe1c2]'
                } ${v.soldOut ? 'line-through opacity-60' : ''}`}
              >
                {v.unit}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-baseline justify-between">
          <PriceTag variant={variant} className="font-mono text-sm sm:text-base font-bold text-[#01372e]" />
          <span className="font-mono text-[10px] text-[#49645c] font-semibold">por {unitLabel(variant.unit)}</span>
        </div>

        {variant.soldOut ? (
          <a
            href={waLink(`Hola Karim, avisame cuando vuelva ${product.title} (${variant.unit})`)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 bg-[#efe1c2] hover:bg-[#faedcd] text-[#01372e] rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-[#842401]">notifications</span>
            <span>Avisarme</span>
          </a>
        ) : (
          <>
        <div className="flex items-center justify-between bg-[#f4e7c8] rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-7 h-7 flex items-center justify-center rounded bg-white text-[#01372e] font-bold text-sm shadow-xs hover:bg-[#fff8f0] active:scale-95"
            aria-label="Restar cantidad"
          >
            −
          </button>
          <span className="font-mono text-xs font-bold text-[#211b08] px-2">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(999, q + 1))}
            className="w-7 h-7 flex items-center justify-center rounded bg-[#01372e] text-white font-bold text-sm shadow-xs hover:bg-[#1f4e44] active:scale-95"
            aria-label="Sumar cantidad"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={`w-full py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 active:scale-95 transition-all shadow-xs text-white ${
            added ? 'bg-[#1ebe5d]' : 'bg-[#01372e] hover:bg-[#1f4e44]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">{added ? 'check' : 'add_shopping_cart'}</span>
          <span>{added ? '¡Agregado!' : 'Agregar'}</span>
        </button>
          </>
        )}
      </div>
    </article>
  );
}
