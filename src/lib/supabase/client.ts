import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types.ts';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') &&
  supabaseUrl.startsWith('https://')
);

// Create client if configured, otherwise null
export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

if (!isSupabaseConfigured) {
  console.info(
    '[NewEra Shop] Running in Stage 1 architecture mode with in-memory service layer. To connect live Supabase, provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in settings or .env.'
  );
}
