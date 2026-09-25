import { useCallback, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { OrderRow, Profile } from '../types';
import { sb } from './supabase';

const EMPTY_PROFILE: Profile = { nombre: '', comercio: '', telefono: '', direccion: '' };

export interface SignUpData extends Partial<Profile> {
  email: string;
  password: string;
}

/**
 * Sesión del cliente (Supabase Auth) + su perfil (tabla `clientes`). Todo es opcional: sin cuenta se puede pedir igual.
 * Si todavía no se corrió el SQL de cuentas, el perfil queda vacío y el resto del sitio anda igual.
 */
export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [recovery, setRecovery] = useState(false); // llegó desde el mail de "olvidé mi contraseña"
  const [profile, setProfile] = useState<Profile | null>(null);
  // Las cuentas solo se ofrecen si ya se aplicó supabase_cuentas_y_seguridad.sql (existe la tabla `admins`):
  // sin esas reglas, cualquier registrado tendría acceso de administrador.
  const [accountsReady, setAccountsReady] = useState(false);

  const user: User | null = session?.user ?? null;

  useEffect(() => {
    sb.from('admins').select('user_id').limit(1).then(({ error }) => setAccountsReady(!error));
  }, []);

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = sb.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === 'PASSWORD_RECOVERY') setRecovery(true);
      if (event === 'SIGNED_OUT') setProfile(null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const userId = user?.id;
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    sb.from('clientes')
      .select('nombre, comercio, telefono, direccion')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setProfile(data ? { ...EMPTY_PROFILE, ...Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v ?? ''])) } : EMPTY_PROFILE);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await sb.auth.signInWithPassword({ email, password });
    return error ? traducir(error.message) : null;
  }, []);

  /** Devuelve { error } o { confirmar: true } si hay que confirmar el mail antes de entrar. */
  const signUp = useCallback(async (d: SignUpData) => {
    const { data, error } = await sb.auth.signUp({
      email: d.email,
      password: d.password,
      options: {
        emailRedirectTo: window.location.origin + '/',
        data: { nombre: d.nombre ?? '', comercio: d.comercio ?? '', telefono: d.telefono ?? '' },
      },
    });
    if (error) return { error: traducir(error.message) };
    return { confirmar: !data.session };
  }, []);

  const signOut = useCallback(async () => {
    await sb.auth.signOut();
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/' });
    return error ? traducir(error.message) : null;
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    const { error } = await sb.auth.updateUser({ password });
    if (!error) setRecovery(false);
    return error ? traducir(error.message) : null;
  }, []);

  const saveProfile = useCallback(
    async (p: Profile) => {
      if (!userId) return 'No hay sesión iniciada.';
      const { error } = await sb
        .from('clientes')
        .upsert({ user_id: userId, email: user?.email, ...p, actualizado_en: new Date().toISOString() });
      if (error) return error.message;
      setProfile(p);
      return null;
    },
    [userId, user?.email],
  );

  return { accountsReady, user, profile, loading, recovery, signIn, signUp, signOut, resetPassword, updatePassword, saveProfile };
}

export async function fetchMyOrders(): Promise<{ orders: OrderRow[]; error?: string }> {
  const { data, error } = await sb
    .from('pedidos')
    .select('id, creado_en, estado, total, items')
    .order('creado_en', { ascending: false })
    .limit(50);
  if (error) return { orders: [], error: error.message };
  return { orders: (data as OrderRow[]) ?? [] };
}

function traducir(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('invalid login')) return 'Email o contraseña incorrectos.';
  if (m.includes('already registered') || m.includes('already been registered')) return 'Ese email ya tiene una cuenta. Probá ingresar.';
  if (m.includes('email not confirmed')) return 'Todavía no confirmaste tu email. Revisá tu casilla (y spam).';
  if (m.includes('password') && m.includes('at least')) return 'La contraseña tiene que tener al menos 6 caracteres.';
  if (m.includes('rate limit') || m.includes('too many')) return 'Demasiados intentos. Esperá unos minutos y probá de nuevo.';
  if (m.includes('valid email') || m.includes('invalid email')) return 'Ese email no parece válido.';
  return msg;
}
