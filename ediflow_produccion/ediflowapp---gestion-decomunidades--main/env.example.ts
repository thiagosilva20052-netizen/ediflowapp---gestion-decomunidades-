/**
 * Ediflow - Environment Variables Example
 * Variables required for Production Deployment (Vercel / Cloud Run)
 * Copy this to a real .env file and do NOT commit your actual .env file.
 */

export const ENV_EXAMPLE = {
  // -------------------------------------------------------------
  // SUPABASE CONFIGURATION
  // -------------------------------------------------------------
  // Public URL for Supabase
  VITE_SUPABASE_URL: "https://your-project.supabase.co",
  // Public Anon Key for Frontend
  VITE_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  // Service Role Key (NEVER EXPOSE IN FRONTEND - Only for Edge Functions / Node backend)
  SUPABASE_SERVICE_ROLE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...",

  // -------------------------------------------------------------
  // NOTIFICATIONS (PUSH & EMAIL)
  // -------------------------------------------------------------
  // VAPID keys for Web Push Notifications (Service Worker)
  VITE_VAPID_PUBLIC_KEY: "BLxyz...",
  VAPID_PRIVATE_KEY: "PRIVATE_KEY_xyz...", // Private key should not have VITE_ if used in backend

  // Resend API Key for Transactional Emails (Colillas, SOS)
  RESEND_API_KEY: "re_123456789...",

  // -------------------------------------------------------------
  // APP CONFIGURATION
  // -------------------------------------------------------------
  // Base URL for links sent in emails and redirects
  VITE_BASE_URL: "https://ediflow.cl", // Or https://ediflow.vercel.app
};
