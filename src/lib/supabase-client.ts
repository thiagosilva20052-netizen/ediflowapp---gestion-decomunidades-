import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

export const supabase = createClient<any>(env.supabaseUrl, env.supabaseAnonKey);

