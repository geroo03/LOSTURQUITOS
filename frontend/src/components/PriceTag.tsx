import { Variant } from '../types';
import { money } from '../lib/config';

/** Precio de una variante: si está en oferta muestra el de lista tachado al lado. */
export function PriceTag({ variant, className = '' }: { variant: Variant; className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-1.5 flex-wrap ${className}`}>
      <span className={variant.listPrice ? 'text-[#842401]' : ''}>{money(variant.price)}</span>
      {variant.listPrice && (
        <span className="text-[0.7em] font-normal text-[#707976] line-through">{money(variant.listPrice)}</span>
      )}
    </span>
  );
}
