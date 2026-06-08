import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const isValidHttpUrl = (s: string | undefined): s is string => {
  if (!s) return false;
  try {
    const { protocol } = new URL(s);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
};

const supabaseUrl = isValidHttpUrl(rawUrl) ? rawUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = rawKey || 'placeholder-key';

if (!isValidHttpUrl(rawUrl) || !rawKey) {
  console.warn('Supabase credentials not configured. Auth features will be disabled.');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);
