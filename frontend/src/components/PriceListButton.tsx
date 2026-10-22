import { useState } from 'react';
import { downloadPriceList } from '../lib/priceList';
import { loadStore } from '../lib/supabase';

interface Props {
  className?: string;
  label?: string;
}

/**
 * Botón que genera y descarga la lista de precios en PDF. Los precios se piden a Supabase en el momento:
 * el catálogo puede llevar días abierto en el celular y su copia en memoria tener precios viejos.
 */
export function PriceListButton({ className = '', label = 'Descargar lista de precios (PDF)' }: Props) {
  const [state, setState] = useState<'idle' | 'busy' | 'error'>('idle');

  const run = async () => {
    setState('busy');
    try {
      const { products, categories } = await loadStore();
      await downloadPriceList(products, categories);
      setState('idle');
    } catch (e) {
      console.error('No se pudo generar la lista de precios:', e);
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    }
  };

  return (
    <button type="button" onClick={run} disabled={state === 'busy'} className={className}>
      <span className="material-symbols-outlined text-[16px]">{state === 'busy' ? 'hourglass_top' : state === 'error' ? 'error' : 'picture_as_pdf'}</span>
      <span>{state === 'busy' ? 'Generando…' : state === 'error' ? 'No se pudo, reintentá' : label}</span>
    </button>
  );
}
