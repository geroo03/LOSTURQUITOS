import { useEffect, useState } from 'react';
import { CartItem, CheckoutForm, LastOrderInfo, Profile } from '../../types';
import { money, waLink } from '../../lib/config';
import { savePedido } from '../../lib/supabase';
import { ProductImage } from '../ProductImage';

interface Props {
  items: CartItem[];
  total: number;
  onUpdateQuantity: (key: string, quantity: number) => void;
  onRemoveItem: (key: string) => void;
  onClearCart: () => void;
  onContinueShopping: () => void;
  lastOrder: LastOrderInfo | null;
  onRepeatLastOrder: () => void;
  onOrderSent: (items: CartItem[]) => void;
  loggedIn: boolean;
  accountsEnabled: boolean;
  profile: Profile | null;
  onLogin: () => void;
}

const EMPTY_FORM: CheckoutForm = { name: '', address: '', payment: '', schedule: '', note: '' };
const PAYMENTS: { id: string; icon: string }[] = [
  { id: 'Efectivo', icon: 'payments' },
  { id: 'Transferencia', icon: 'account_balance' },
  { id: 'A coordinar', icon: 'handshake' },
];

const inputCls =
  'w-full bg-[#fff8f0] border border-[#c0c8c4] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-[#211b08] focus:ring-2 focus:ring-[#01372e] focus:outline-none';

function buildMessage(items: CartItem[], total: number, f: CheckoutForm) {
  let msg = 'Hola Karim, te paso mi pedido de Los Turquitos:\n\n';
  items.forEach((i) => {
    msg += `• ${i.product.title} — ${i.quantity} × ${i.variant.unit} = ${money(i.subtotal)}\n`;
  });
  msg += `\n*Total: ${money(total)}*\n`;
  if (f.name) msg += `\nComercio / nombre: ${f.name}`;
  if (f.address) msg += `\nDirección de entrega: ${f.address}`;
  if (f.payment) msg += `\nMétodo de pago: ${f.payment}`;
  if (f.schedule) msg += `\nHorario preferido: ${f.schedule}`;
  if (f.note) msg += `\nNota: ${f.note}`;
  return msg;
}

export function CartView({ items, total, onUpdateQuantity, onRemoveItem, onClearCart, onContinueShopping, lastOrder, onRepeatLastOrder, onOrderSent, loggedIn, accountsEnabled, profile, onLogin }: Props) {
  const [form, setForm] = useState<CheckoutForm>(EMPTY_FORM);
  const [sent, setSent] = useState(false);
  // Con cuenta, nombre/comercio y dirección se completan solos con los datos guardados
  useEffect(() => {
    if (!profile) return;
    setForm((f) => ({ ...f, name: f.name || profile.comercio || profile.nombre, address: f.address || profile.direccion }));
  }, [profile, sent]);
  const set = (patch: Partial<CheckoutForm>) => setForm((f) => ({ ...f, ...patch }));

  const totalUnits = items.reduce((n, i) => n + i.quantity, 0);

  const sendOrder = () => {
    if (!items.length) return;
    savePedido(items, form, total);
    onOrderSent(items);
    window.open(waLink(buildMessage(items, total, form)), '_blank');
    onClearCart();
    setForm(EMPTY_FORM);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="max-w-md mx-auto w-full pb-20 pt-6">
        <div className="bg-white rounded-2xl p-8 text-center border border-[#efe1c2] shadow-sm flex flex-col items-center gap-3 animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-[#1ebe5d] text-white flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[30px]">check</span>
          </div>
          <h2 className="font-serif text-xl font-bold text-[#01372e]">¡Pedido enviado!</h2>
          <p className="text-sm text-[#404846]">
            Se abrió WhatsApp con tu pedido listo para mandar. Karim te va a responder ahí para coordinar la entrega.
          </p>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              onContinueShopping();
            }}
            className="mt-2 px-5 py-2.5 bg-[#01372e] hover:bg-[#1f4e44] text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
          >
            Seguir comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 sm:gap-6 pb-20 max-w-3xl mx-auto w-full">
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#01372e] text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            shopping_bag
          </span>
          <h1 className="font-serif text-xl sm:text-2xl text-[#01372e] font-bold">Tu pedido</h1>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={() => window.confirm('¿Querés vaciar todo el pedido?') && onClearCart()}
            className="text-[#842401] hover:text-[#5d1700] text-xs sm:text-sm font-semibold flex items-center gap-1 transition-colors py-1 px-2 rounded-lg hover:bg-[#faedcd]"
          >
            <span className="material-symbols-outlined text-[18px]">remove_shopping_cart</span>
            <span>Vaciar</span>
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-[#efe1c2] flex flex-col items-center justify-center gap-3">
          <span className="material-symbols-outlined text-[48px] text-[#707976]">shopping_basket</span>
          <h3 className="font-serif text-lg font-bold text-[#01372e]">Tu pedido está vacío</h3>
          <p className="text-xs text-[#404846] max-w-sm">Explorá el catálogo y sumá productos para armar tu pedido.</p>
          {lastOrder && (
            <button
              type="button"
              onClick={onRepeatLastOrder}
              className="mt-2 px-5 py-2.5 bg-[#1ebe5d] hover:bg-[#19a550] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">history</span>
              <span>
                Repetir mi último pedido ({lastOrder.count} {lastOrder.count === 1 ? 'producto' : 'productos'} · {new Date(lastOrder.at).toLocaleDateString('es-AR')})
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={onContinueShopping}
            className={`${lastOrder ? '' : 'mt-2 '}px-5 py-2.5 bg-[#01372e] hover:bg-[#1f4e44] text-white rounded-xl text-xs font-semibold transition-all shadow-sm`}
          >
            Ir al catálogo
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.key}
                className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#efe1c2] shadow-sm flex items-center gap-3 sm:gap-4"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#faedcd] shrink-0">
                  <ProductImage src={item.product.images[0]} alt={item.product.title} className="w-full h-full" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-serif text-xs sm:text-base font-bold text-[#01372e] truncate">{item.product.title}</h3>
                      <span className="font-mono text-[10px] sm:text-xs text-[#01372e] bg-[#f4e7c8] px-2 py-0.5 rounded font-bold uppercase">
                        {money(item.variant.price)} / {item.variant.unit}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.key)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#707976] hover:text-[#ba1a1a] hover:bg-[#ffdad6] active:scale-90 transition-all shrink-0"
                      aria-label={`Quitar ${item.product.title}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-1">
                    <div className="flex items-center bg-[#f4e7c8] rounded-xl p-0.5">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.key, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-[#01372e] font-bold text-sm shadow-xs active:scale-90 select-none hover:bg-[#fff8f0]"
                        aria-label="Restar cantidad"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-mono text-xs sm:text-sm font-bold text-[#01372e]">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.key, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-[#01372e] font-bold text-sm shadow-xs active:scale-90 select-none hover:bg-[#fff8f0]"
                        aria-label="Sumar cantidad"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-mono text-sm sm:text-base font-bold text-[#01372e]">{money(item.subtotal)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#fff3d7] rounded-2xl p-4 sm:p-5 border border-[#efe1c2] shadow-sm flex justify-between items-baseline">
            <div>
              <span className="font-serif text-base sm:text-lg font-bold text-[#01372e] block">Total</span>
              <span className="text-[11px] text-[#404846]">
                {totalUnits} {totalUnits === 1 ? 'unidad' : 'unidades'} · precios sujetos a confirmación de Karim
              </span>
            </div>
            <span className="font-mono text-2xl sm:text-3xl font-bold text-[#01372e]">{money(total)}</span>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#efe1c2] shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#c8e6dd] flex items-center justify-center text-[#01372e]">
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#01372e]">Datos de entrega</h3>
                <p className="text-xs text-[#404846]">Sin pago online. Karim confirma y coordina la entrega por WhatsApp.</p>
              </div>
            </div>

            {!accountsEnabled ? null : loggedIn ? (
              <p className="text-xs text-[#0f6b34] bg-[#d8f5e3] rounded-lg px-3 py-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Este pedido se guarda en tu cuenta, así lo podés repetir cuando quieras.
              </p>
            ) : (
              <p className="text-xs text-[#404846] bg-[#fff3d7] rounded-lg px-3 py-2">
                ¿Pedís seguido?{' '}
                <button type="button" onClick={onLogin} className="font-bold text-[#01372e] underline">
                  Ingresá o creá tu cuenta
                </button>{' '}
                para guardar tus datos y tus pedidos. Si no, podés seguir sin cuenta.
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="cust-name" className="text-xs font-bold text-[#211b08] block">Tu nombre / comercio</label>
                <input id="cust-name" type="text" value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="Ej: Dietética El Rincón" className={inputCls} />
              </div>
              <div className="space-y-1">
                <label htmlFor="cust-address" className="text-xs font-bold text-[#211b08] block">Dirección de entrega</label>
                <input id="cust-address" type="text" value={form.address} onChange={(e) => set({ address: e.target.value })} placeholder="Calle, número, localidad" className={inputCls} />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <span className="text-xs font-bold text-[#211b08] block">Método de pago</span>
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENTS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => set({ payment: form.payment === p.id ? '' : p.id })}
                      aria-pressed={form.payment === p.id}
                      className={`p-3 rounded-xl flex flex-col items-center justify-center transition-all border ${
                        form.payment === p.id
                          ? 'bg-[#01372e] text-white border-[#01372e] shadow-sm font-bold'
                          : 'bg-[#fff3d7] text-[#211b08] hover:bg-[#faedcd] border-[#efe1c2]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px] mb-1">{p.icon}</span>
                      <span className="text-xs">{p.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label htmlFor="cust-schedule" className="text-xs font-bold text-[#211b08] block">Horario preferido</label>
                <input id="cust-schedule" type="text" value={form.schedule} onChange={(e) => set({ schedule: e.target.value })} placeholder="Ej: Tardes" className={inputCls} />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label htmlFor="cust-note" className="text-xs font-bold text-[#211b08] block">Nota (opcional)</label>
                <textarea id="cust-note" rows={2} value={form.note} onChange={(e) => set({ note: e.target.value })} placeholder="Alguna aclaración para tu pedido" className={`${inputCls} resize-none`} />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={sendOrder}
              className="w-full bg-[#1ebe5d] hover:bg-[#19a550] active:scale-[0.98] text-white py-3.5 px-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_4px_16px_rgba(30,190,93,0.35)] transition-all"
            >
              <span className="material-symbols-outlined text-[22px]">chat</span>
              <span>Enviar pedido por WhatsApp · {money(total)}</span>
            </button>
            <button
              type="button"
              onClick={onContinueShopping}
              className="w-full bg-transparent hover:bg-[#faedcd] text-[#01372e] py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Seguir sumando productos</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
