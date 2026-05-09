import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
import dotenv from 'dotenv';
dotenv.config();

let supabaseUrl = process.env.VITE_SUPABASE_URL || '';
if (supabaseUrl) {
  supabaseUrl = supabaseUrl.trim().replace(/\/+$/, '');
  if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
      supabaseUrl = 'https://' + supabaseUrl;
  }
} else {
  supabaseUrl = 'https://mock-project.supabase.co';
}

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-key';

export const supabaseServer = createClient<any>(supabaseUrl, supabaseServiceKey);


