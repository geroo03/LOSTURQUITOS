import { FormEvent, useState } from 'react';
import { useAuth } from '../../lib/useAuth';

type Auth = ReturnType<typeof useAuth>;
type Mode = 'ingresar' | 'crear' | 'olvide';

interface Props {
  auth: Auth;
  onDone: () => void; // ya hay sesión: seguir a donde estaba yendo el cliente
  onContinueAsGuest: () => void;
}

const input =
  'w-full bg-[#fff8f0] border border-[#c0c8c4] px-3.5 py-2.5 rounded-xl text-sm text-[#211b08] focus:ring-2 focus:ring-[#01372e] focus:outline-none';
const label = 'text-xs font-bold text-[#211b08] block mb-1';

export function AuthView({ auth, onDone, onContinueAsGuest }: Props) {
  const [mode, setMode] = useState<Mode>('ingresar');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [comercio, setComercio] = useState('');
  const [telefono, setTelefono] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  // Llegó desde el mail de "olvidé mi contraseña": solo pide la contraseña nueva
  if (auth.recovery) {
    const submit = async (e: FormEvent) => {
      e.preventDefault();
      setBusy(true);
      setError('');
      const err = await auth.updatePassword(newPassword);
      setBusy(false);
      if (err) setError(err);
      else onDone();
    };
    return (
      <Card title="Elegí tu nueva contraseña" subtitle="Después de guardarla ya quedás adentro de tu cuenta.">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className={label} htmlFor="np">Nueva contraseña</label>
            <input id="np" type="password" required minLength={6} autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={input} />
          </div>
          <Feedback error={error} info="" />
          <Submit busy={busy} text="Guardar contraseña" />
        </form>
      </Card>
    );
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth.accountsReady) return setError('Las cuentas de cliente todavía no están habilitadas.');
    setBusy(true);
    setError('');
    setInfo('');
    if (mode === 'ingresar') {
      const err = await auth.signIn(email.trim(), password);
      if (err) setError(err);
      else onDone();
    } else if (mode === 'crear') {
      const res = await auth.signUp({ email: email.trim(), password, nombre: nombre.trim(), comercio: comercio.trim(), telefono: telefono.trim() });
      if ('error' in res && res.error) setError(res.error);
      else if ('confirmar' in res && res.confirmar) setInfo('¡Listo! Te mandamos un email para confirmar tu cuenta. Abrí el link y ya podés ingresar.');
      else onDone();
    } else {
      const err = await auth.resetPassword(email.trim());
      if (err) setError(err);
      else setInfo('Si ese email tiene una cuenta, te mandamos un link para elegir una contraseña nueva.');
    }
    setBusy(false);
  };

  const title = mode === 'ingresar' ? 'Ingresá a tu cuenta' : mode === 'crear' ? 'Creá tu cuenta' : 'Recuperar contraseña';
  const subtitle =
    mode === 'crear'
      ? 'Guardá tus datos y tus pedidos para repetirlos cuando quieras. Es gratis y opcional.'
      : mode === 'olvide'
        ? 'Te mandamos un link por email para elegir una nueva.'
        : 'Mirá tus pedidos anteriores y pedí de nuevo en un toque.';

  return (
    <Card title={title} subtitle={subtitle}>
      <form onSubmit={submit} className="space-y-4">
        {mode === 'crear' && (
          <>
            <div>
              <label className={label} htmlFor="a-nombre">Tu nombre</label>
              <input id="a-nombre" type="text" autoComplete="name" value={nombre} onChange={(e) => setNombre(e.target.value)} className={input} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={label} htmlFor="a-comercio">Comercio (opcional)</label>
                <input id="a-comercio" type="text" autoComplete="organization" placeholder="Ej: Dietética El Rincón" value={comercio} onChange={(e) => setComercio(e.target.value)} className={input} />
              </div>
              <div>
                <label className={label} htmlFor="a-tel">WhatsApp / teléfono</label>
                <input id="a-tel" type="tel" autoComplete="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} className={input} />
              </div>
            </div>
          </>
        )}
        <div>
          <label className={label} htmlFor="a-email">Email</label>
          <input id="a-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
        </div>
        {mode !== 'olvide' && (
          <div>
            <label className={label} htmlFor="a-pass">Contraseña</label>
            <input
              id="a-pass"
              type="password"
              required
              minLength={6}
              autoComplete={mode === 'crear' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={input}
            />
            {mode === 'crear' && <span className="text-[11px] text-[#404846]">Mínimo 6 caracteres.</span>}
          </div>
        )}
        <Feedback error={error} info={info} />
        <Submit busy={busy} text={mode === 'ingresar' ? 'Ingresar' : mode === 'crear' ? 'Crear cuenta' : 'Enviar link'} />
      </form>

      <div className="mt-5 flex flex-col gap-2 text-sm text-center">
        {mode === 'ingresar' && (
          <>
            <button type="button" onClick={() => { setMode('olvide'); setError(''); setInfo(''); }} className="text-[#01372e] font-semibold hover:underline">
              Olvidé mi contraseña
            </button>
            {auth.accountsReady ? (
              <button type="button" onClick={() => { setMode('crear'); setError(''); setInfo(''); }} className="text-[#01372e] font-semibold hover:underline">
                ¿No tenés cuenta? Creala
              </button>
            ) : (
              <span className="text-xs text-[#404846]">Las cuentas de cliente se habilitan muy pronto.</span>
            )}
          </>
        )}
        {mode !== 'ingresar' && (
          <button type="button" onClick={() => { setMode('ingresar'); setError(''); setInfo(''); }} className="text-[#01372e] font-semibold hover:underline">
            Ya tengo cuenta: ingresar
          </button>
        )}
        <button type="button" onClick={onContinueAsGuest} className="text-[#404846] hover:underline">
          Seguir sin cuenta
        </button>
      </div>
    </Card>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="max-w-md mx-auto w-full pb-20 pt-2">
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#efe1c2] shadow-sm">
        <div className="flex items-center gap-2 text-[#842401] font-mono text-xs uppercase tracking-wider font-bold mb-2">
          <span className="material-symbols-outlined text-[18px]">person</span>
          <span>Mi cuenta</span>
        </div>
        <h1 className="font-serif text-2xl text-[#01372e] font-bold leading-tight">{title}</h1>
        <p className="text-sm text-[#404846] mt-1 mb-5">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}

function Feedback({ error, info }: { error: string; info: string }) {
  if (!error && !info) return null;
  return (
    <p role="status" className={`text-sm rounded-xl px-3 py-2 ${error ? 'bg-[#ffdad6] text-[#93000a]' : 'bg-[#c8e6dd] text-[#04201a]'}`}>
      {error || info}
    </p>
  );
}

function Submit({ busy, text }: { busy: boolean; text: string }) {
  return (
    <button type="submit" disabled={busy} className="w-full py-3 rounded-xl bg-[#01372e] hover:bg-[#1f4e44] disabled:opacity-60 text-white font-bold text-sm transition-all shadow-sm">
      {busy ? 'Un momento…' : text}
    </button>
  );
}
