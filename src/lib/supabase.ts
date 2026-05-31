import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const PROJECT_REF = new URL(supabaseUrl).hostname.split('.')[0];

const customFetch: typeof fetch = (input, init) => {
  const headers = new Headers(init?.headers);
  if (!headers.has('apikey')) {
    headers.set('apikey', supabaseAnonKey);
  }
  return fetch(input, { ...init, headers });
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: { fetch: customFetch },
});
