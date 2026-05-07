Supabase Edge Function: sendPush

Purpose:
- Provide a secure server-side endpoint to send Web Push notifications using VAPID keys.

Setup:
1. Set secrets in Supabase for the VAPID keys:

   supabase secrets set VAPID_PRIVATE_KEY="<your-private-key>" VAPID_PUBLIC_KEY="<your-public-key>"

2. Deploy the function with the Supabase CLI.

Usage:
- POST to the function endpoint with JSON body:
  {
    "subscription": { /* PushSubscription object from client */ },
    "payload": { "title": "Hello", "body": "World" }
  }

Notes:
- Keep the private key only in server-side secrets; never expose it to the client or in client bundles.
- The example imports `web-push` from esm.sh; for production pin a specific version and audit dependencies.
