import { useEffect } from 'react';
import { waLink } from '../lib/config';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onGoToCatalog: () => void;
}

const STEPS = [
  { title: 'Elegí productos y presentación', text: 'Explorá el catálogo, elegí la unidad (KG, 500G, UNI…) y sumá las cantidades al pedido.' },
  { title: 'Revisá tu pedido', text: 'Chequeá el detalle y el total en el carrito, y completá tus datos de entrega.' },
  { title: 'Enviá el pedido por WhatsApp', text: 'Se abre WhatsApp con todo armado. Karim te responde ahí para coordinar la entrega.' },
];

export function HowToBuyModal({ isOpen, onClose, onGoToCatalog }: Props) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#211b08]/50 backdrop-blur-sm animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#fff8f0] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#faedcd] relative max-h-[90vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#faedcd] text-[#01372e] flex items-center justify-center hover:bg-[#efe1c2] transition-colors"
          aria-label="Cerrar"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-2 text-[#842401] mb-2 font-mono text-xs uppercase tracking-wider font-bold">
          <span className="material-symbols-outlined text-[18px]">help_center</span>
          <span>Comprar es simple</span>
        </div>
        <h2 id="modal-title" className="font-serif text-2xl sm:text-3xl text-[#01372e] font-bold leading-tight">
          ¿Cómo comprar en Los Turquitos?
        </h2>
        <p className="text-sm text-[#404846] mt-1 mb-6">Sin registros ni pagos online. Atención directa con Karim.</p>

        <div className="space-y-4">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className={`flex items-start gap-4 p-4 rounded-xl border ${
                i === 2 ? 'bg-[#c8e6dd]/50 border-[#a0d0c3]' : 'bg-[#fff3d7] border-[#efe1c2]'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl text-white font-mono font-bold flex items-center justify-center shrink-0 ${
                  i === 2 ? 'bg-[#1ebe5d]' : 'bg-[#01372e]'
                }`}
              >
                0{i + 1}
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#01372e]">{s.title}</h3>
                <p className="text-xs sm:text-sm text-[#404846] mt-1">{s.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onGoToCatalog();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-[#01372e] hover:bg-[#1f4e44] text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>Explorar el catálogo</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
          <a
            href={waLink('Hola Karim, tengo una duda sobre cómo comprar')}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-5 rounded-xl bg-[#1ebe5d] hover:bg-[#19a550] text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>Consultar a Karim</span>
          </a>
        </div>
      </div>
    </div>
  );
}
