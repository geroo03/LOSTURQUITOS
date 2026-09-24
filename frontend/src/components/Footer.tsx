import { WHATSAPP_DISPLAY, waLink } from '../lib/config';

export function Footer({ logoUrl }: { logoUrl: string }) {
  return (
    <footer className="w-full bg-[#f4e7c8] text-[#211b08] mt-16 border-t border-[#efe1c2] pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg overflow-hidden bg-[#01372e]">
                <img src={logoUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <span className="font-serif font-bold text-lg text-[#01372e]">Los Turquitos</span>
            </div>
            <p className="text-xs sm:text-sm text-[#404846] leading-relaxed max-w-md">
              Condimentos, frutos secos, especias, aceitunas, encurtidos, repostería y semillas a precio de mayorista.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-[#01372e]">
              <span className="material-symbols-outlined text-[20px] text-[#1ebe5d]">support_agent</span>
              <h4 className="font-serif font-bold text-base">Atención directa</h4>
            </div>
            <p className="text-xs sm:text-sm text-[#404846]">
              Pedidos y consultas con <strong className="text-[#211b08]">Karim</strong> por WhatsApp.
            </p>
            <a
              href={waLink('Hola Karim, te contacto desde la tienda de Los Turquitos')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-mono text-[#01372e] font-semibold hover:text-[#1ebe5d] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">call</span>
              <span>{WHATSAPP_DISPLAY}</span>
            </a>
          </div>
        </div>

        <div className="pt-5 border-t border-[#efe1c2] text-xs text-[#404846]">
          Los precios pueden variar sin previo aviso.
        </div>
      </div>
    </footer>
  );
}
