const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY as string | undefined;

// KILL-SWITCH: Si no hay credenciales reales, la app no arranca.
// Esto evita el error silencioso "Invalid path" que ocurría con los placeholders.
function validateEnv(): void {
  const missing: string[] = [];

  if (!supabaseUrl || supabaseUrl.trim() === '' || supabaseUrl.includes('placeholder')) {
    missing.push('VITE_SUPABASE_URL');
  }

  if (!supabaseAnonKey || supabaseAnonKey.trim() === '' || supabaseAnonKey.includes('placeholder')) {
    missing.push('VITE_SUPABASE_ANON_KEY');
  }

  if (missing.length > 0) {
    const msg = `EdiFlow no puede iniciar. Variables de entorno faltantes: ${missing.join(', ')}. Configúralas en tu archivo .env o en el panel de Vercel.`;
    document.body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:#000;color:#fff;font-family:system-ui,sans-serif;padding:2rem;">
        <div style="max-width:480px;text-align:center;">
          <div style="font-size:3rem;margin-bottom:1rem;">🔧</div>
          <h1 style="font-size:1.5rem;font-weight:600;margin-bottom:0.75rem;">Configuración Pendiente</h1>
          <p style="color:#9ca3af;font-size:0.875rem;line-height:1.5;margin-bottom:1.5rem;">${msg}</p>
          <div style="background:#111;border:1px solid #1f2937;border-radius:0.75rem;padding:1rem;text-align:left;font-size:0.75rem;color:#6b7280;">
            <p style="margin-bottom:0.5rem;color:#e5e7eb;font-weight:600;">Variables requeridas:</p>
            <code style="color:#00AEEF;">VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co</code><br/>
            <code style="color:#00AEEF;">VITE_SUPABASE_ANON_KEY=eyJhbGciOi...</code>
          </div>
        </div>
      </div>
    `;
    throw new Error(msg);
  }
}

validateEnv();

export const env = {
  supabaseUrl: supabaseUrl!,
  supabaseAnonKey: supabaseAnonKey!,
  resendApiKey: (import.meta as any).env.VITE_RESEND_API_KEY || '',
  vapidPublicKey: (import.meta as any).env.VITE_VAPID_PUBLIC_KEY || '',
  vapidPrivateKey: (import.meta as any).env.VITE_VAPID_PRIVATE_KEY || '',
  isProduction: (import.meta as any).env.PROD,
  baseUrl: (import.meta as any).env.VITE_BASE_URL || 'http://localhost:3000',
};
