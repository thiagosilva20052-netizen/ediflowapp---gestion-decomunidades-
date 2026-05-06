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
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error: any) {
      if (
        error?.name === 'QuotaExceededError' ||
        error?.message?.toLowerCase().includes('quota') ||
        error?.message?.toLowerCase().includes('cuota')
      ) {
        console.warn('localStorage quota exceeded. Cleaning up...');

        try {
          const backupKey = 'ediflow-backup-data';
          const backupData = localStorage.getItem(backupKey);
          if (backupData) {
            localStorage.removeItem(backupKey);
          }
        } catch (e) { /* ignore */ }

        try {
          const keys = Object.keys(localStorage);
          let cleaned = 0;
          keys.forEach((k) => {
            if (k.startsWith('sb-') && k.includes('-auth-token')) {
              try { localStorage.removeItem(k); cleaned++; } catch (e) { /* ignore */ }
            }
          });
          if (cleaned > 0) console.log(`Cleaned ${cleaned} old auth tokens`);
        } catch (e) { /* ignore */ }

        try {
          localStorage.setItem(key, value);
        } catch (retryError) {
          console.warn('Aggressive cleanup...');
          try {
            const keysToKeep = ['theme'];
            Object.keys(localStorage).forEach((k) => {
              if (!keysToKeep.includes(k) && k !== key) {
                try { localStorage.removeItem(k); } catch (e) { /* ignore */ }
              }
            });
            localStorage.setItem(key, value);
          } catch (finalError) {
            console.error('Falling back to sessionStorage');
            try {
              sessionStorage.setItem(key, value);
            } catch (sessionError) {
              console.error('All storage methods failed:', sessionError);
              throw sessionError;
            }
          }
        }
      } else {
        console.error('Error setting localStorage:', error);
        throw error;
      }
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: customStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});
