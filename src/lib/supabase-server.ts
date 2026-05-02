import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://mock-project.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-key';

export const supabaseServer = createClient<any>(supabaseUrl, supabaseServiceKey);

