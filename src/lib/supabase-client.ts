import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

const rawUrl = env.supabaseUrl || '';
let cleanUrl = typeof rawUrl === 'string' && rawUrl.trim() !== '' 
  ? rawUrl.trim().replace(/\/+$/, '') 
  : 'https://placeholder.supabase.co';

if (cleanUrl !== 'https://placeholder.supabase.co' && !cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
  cleanUrl = 'https://' + cleanUrl;
}

try {
  // Validate URL to avoid "Invalid path specified in request URL" errors from supabase-js
  new URL(cleanUrl);
} catch (e) {
  console.error("Invalid Supabase URL generated:", cleanUrl);
  cleanUrl = 'https://placeholder.supabase.co';
}

console.log("Supabase Client Init URL:", cleanUrl);

export const supabase = createClient<any>(cleanUrl, env.supabaseAnonKey || 'placeholder');

