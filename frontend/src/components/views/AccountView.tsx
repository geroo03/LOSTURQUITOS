import { FormEvent, useEffect, useState } from 'react';
import { OrderRow, Profile } from '../../types';
import { money } from '../../lib/config';
import { fetchMyOrders, useAuth } from '../../lib/useAuth';

type Auth = ReturnType<typeof useAuth>;

interface Props {
  auth: Auth;
  onRepeatOrder: (order: OrderRow) => void;
  onGoToCatalog: () => void;
}

const ESTADOS: Record<string, { label: string; cls: string }> = {
  pendiente: { label: 'Pendiente', cls: 'bg-marfil-100 text-mostaza-oscura' },
  confirmado: { label: 'Confirmado', cls: 'bg-oliva-suave text-norte' },
  entregado: { label: 'Entregado', cls: 'bg-oliva-suave text-oliva-oscura' },
  cancelado: { label: 'Cancelado', cls: 'bg-oferta-suave text-oferta-oscura' },
};

const input =
  'w-full bg-marfil border border-marfil-400 px-3.5 py-2.5 rounded-xl text-sm text-tinta focus:ring-2 focus:ring-norte focus:outline-none';

export function AccountView({ auth, onRepeatOrder, onGoToCatalog }: Props) {
  const { user, profile, saveProfile, signOut } = auth;
  const [form, setForm] = useState<Profile>({ nombre: '', comercio: '', telefono: '', direccion: '' });
  const [saved, setSaved] = useState<'' | 'ok' | string>('');
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [ordersError, setOrdersError] = useState('');

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  useEffect(() => {
    fetchMyOrders().then(({ orders, error }) => {
      setOrders(orders);
      if (error) setOrdersError(error);
    });
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const err = await saveProfile(form);
    setSaved(err ?? 'ok');
    setTimeout(() => setSaved(''), 3000);
  };
  const set = (patch: Partial<Profile>) => setForm((f) => ({ ...f, ...patch }));

  return (
    <div className="max-w-3xl mx-auto w-full pb-20 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="min-w-0">
          <h1 className="font-serif text-xl sm:text-2xl text-norte font-bold">Mi cuenta</h1>
          <p className="text-xs text-gris truncate">{user?.email}</p>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="text-mostaza-oscura hover:text-mostaza-oscura text-xs sm:text-sm font-semibold flex items-center gap-1 py-1.5 px-3 rounded-lg hover:bg-marfil-200 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Cerrar sesión</span>
        </button>
      </div>

      <section className="bg-white rounded-2xl p-5 sm:p-6 border border-marfil-300 shadow-sm">
        <h2 className="font-serif font-bold text-base text-norte">Mis datos</h2>
        <p className="text-xs text-gris mb-4">Se completan solos cuando hacés un pedido.</p>
        <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field id="c-nombre" label="Nombre" value={form.nombre} onChange={(v) => set({ nombre: v })} />
          <Field id="c-comercio" label="Comercio" value={form.comercio} onChange={(v) => set({ comercio: v })} />
          <Field id="c-tel" label="WhatsApp / teléfono" value={form.telefono} onChange={(v) => set({ telefono: v })} type="tel" />
          <Field id="c-dir" label="Dirección de entrega" value={form.direccion} onChange={(v) => set({ direccion: v })} />
          <div className="sm:col-span-2 flex items-center gap-3">
            <button type="submit" className="px-5 py-2.5 bg-norte hover:bg-norte-claro text-white rounded-xl text-sm font-semibold transition-all shadow-sm">
              Guardar datos
            </button>
            {saved === 'ok' && <span className="text-sm text-oliva-oscura font-semibold">¡Guardado!</span>}
            {saved && saved !== 'ok' && <span className="text-sm text-oferta-oscura">No se pudo guardar: {saved}</span>}
          </div>
        </form>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-serif font-bold text-lg text-norte">Mis pedidos</h2>
        {orders === null && <p className="text-sm text-gris">Cargando…</p>}
        {ordersError && <p className="text-sm text-oferta-oscura">No se pudieron cargar tus pedidos: {ordersError}</p>}
        {orders && !orders.length && !ordersError && (
          <div className="bg-white rounded-2xl p-8 text-center border border-marfil-300 flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[40px] text-gris-claro">receipt_long</span>
            <p className="text-sm text-gris">Todavía no hiciste pedidos con esta cuenta.</p>
            <button type="button" onClick={onGoToCatalog} className="mt-1 px-4 py-2 rounded-xl bg-norte text-white text-xs font-semibold">
              Ir al catálogo
            </button>
          </div>
        )}
        {orders?.map((o) => {
          const st = ESTADOS[o.estado ?? 'pendiente'] ?? ESTADOS.pendiente;
          const items = Array.isArray(o.items) ? o.items : [];
          return (
            <article key={o.id} className="bg-white rounded-2xl p-4 sm:p-5 border border-marfil-300 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-mono text-xs text-gris">
                    {new Date(o.creado_en).toLocaleDateString('es-AR')} · Pedido #{o.id}
                  </div>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${st.cls}`}>{st.label}</span>
                </div>
                <div className="font-mono text-lg font-bold text-norte">{money(o.total)}</div>
              </div>
              <ul className="mt-3 text-sm text-gris space-y-0.5">
                {items.map((it, i) => (
                  <li key={i}>
                    {it.cantidad} × {it.unidad} — {it.nombre}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => onRepeatOrder(o)}
                className="mt-4 px-4 py-2 bg-[#1ebe5d] hover:bg-[#19a550] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">history</span>
                <span>Repetir este pedido</span>
              </button>
            </article>
          );
        })}
      </section>
    </div>
  );
}

function Field({ id, label, value, onChange, type = 'text' }: { id: string; label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-bold text-tinta block mb-1">{label}</label>
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} className={input} />
    </div>
  );
}
