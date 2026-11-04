import { WHATSAPP_DISPLAY, waLink } from '../lib/config';

export function Footer({ logoUrl }: { logoUrl: string }) {
  return (
    <footer className="w-full bg-norte text-marfil mt-16 border-t-2 border-mostaza/60 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="" className="w-14 h-14 rounded-full object-cover shadow-[0_0_0_1px_rgba(200,155,69,0.5)]" />
              <div className="flex flex-col">
                <span className="font-display font-semibold text-xl tracking-[0.06em] text-marfil">NORTE ORIGEN</span>
                <span className="text-[10.5px] uppercase tracking-[0.2em] text-mostaza font-semibold">Del origen a cada mesa</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-marfil/75 leading-relaxed max-w-md">
              Especias, condimentos, frutos secos, aceitunas, encurtidos, repostería y semillas a precio de mayorista.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[20px] text-mostaza">support_agent</span>
              <h4 className="font-serif font-bold text-base text-marfil">Atención directa</h4>
            </div>
            <p className="text-xs sm:text-sm text-marfil/75">
              Pedidos y consultas con <strong className="text-marfil">Karim</strong> por WhatsApp.
            </p>
            <a
              href={waLink('Hola Karim, te contacto desde la tienda de Norte Origen')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-mono text-mostaza font-semibold hover:text-[#1ebe5d] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">call</span>
              <span>{WHATSAPP_DISPLAY}</span>
            </a>
          </div>
        </div>

        <div className="pt-5 border-t border-mostaza/25 flex flex-wrap items-center justify-between gap-2 text-xs text-marfil/60">
          <span>Los precios pueden variar sin previo aviso.</span>
          <span className="flex items-center gap-1 text-mostaza/80">
            <span className="material-symbols-outlined text-[14px]">eco</span>
            <span>Especias · Condimentos · Almacén</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
