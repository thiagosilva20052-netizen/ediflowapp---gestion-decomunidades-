import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

// KILL-SWITCH ya validado en env.ts — aquí ya tenemos valores reales
const SUPABASE_URL = env.supabaseUrl;
const SUPABASE_ANON_KEY = env.supabaseAnonKey;

// Custom Storage Adapter con limpieza automática por QuotaExceededError
// Trasplantado de B1: cascade cleanup antes de fallar
const customStorageAdapter = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error: any) {
      if (error?.name === 'QuotaExceededError') {
        localStorage.clear(); // Extreme but safe for a SaaS onboarding
        localStorage.setItem(key, value);
      }
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: customStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
