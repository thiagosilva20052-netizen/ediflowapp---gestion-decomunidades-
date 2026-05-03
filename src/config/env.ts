export const env = {
  supabaseUrl: (import.meta as any).env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
  supabaseAnonKey: (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'placeholder_anon_key',
  resendApiKey: (import.meta as any).env.VITE_RESEND_API_KEY || '',
  vapidPublicKey: (import.meta as any).env.VITE_VAPID_PUBLIC_KEY || '',
  vapidPrivateKey: (import.meta as any).env.VITE_VAPID_PRIVATE_KEY || '',
  isProduction: (import.meta as any).env.PROD,
  baseUrl: (import.meta as any).env.VITE_BASE_URL || 'http://localhost:3000',
};
