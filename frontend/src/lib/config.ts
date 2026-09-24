export const WHATSAPP_NUMBER = '5493856149181';
export const WHATSAPP_DISPLAY = '+54 9 3856 14-9181';

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://mdjihqgyffjfeoaxiedt.supabase.co';
// Clave pública (anon): la seguridad la dan las policies RLS de Supabase, no esconder esta clave.
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_1B56mz2mbyKgQ75EEw7hqg_JgXtZHVN';

/** Logo por defecto (archivo local, carga instantánea). Si Karim sube otro desde el panel, se reemplaza. */
export const DEFAULT_LOGO_URL = `${SUPABASE_URL}/storage/v1/object/public/productos/config/logo-los-turquitos.jpg`;
export const LOCAL_LOGO = '/logo.jpg';

export const DEFAULT_TAGLINE =
  'Condimentos, frutos secos, especias, aceitunas, encurtidos, repostería y semillas a precio de mayorista. Armá tu pedido acá y te lo mandamos directo por WhatsApp.';

export const money = (n: number) => '$' + n.toLocaleString('es-AR');

export const waLink = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export const unitLabel = (unit: string) => (unit.toUpperCase() === 'UNI' ? 'unidad' : unit);
