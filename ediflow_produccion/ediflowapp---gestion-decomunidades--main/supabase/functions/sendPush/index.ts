// Supabase Edge Function (Deno): sendPush
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import webpush from 'https://esm.sh/web-push@3.5.0';

const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY');
const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY');

if (VAPID_PRIVATE_KEY && VAPID_PUBLIC_KEY) {
  webpush.setVapidDetails('mailto:admin@ediflow.cl', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

Deno.serve(async (req: Request) => {
  // CORS Handling
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { 
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { subscription, payload } = await req.json();

    if (!subscription) {
      return new Response(JSON.stringify({ error: 'Missing subscription' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const message = payload ? JSON.stringify(payload) : JSON.stringify({ title: 'EdiFlow Notification' });

    await webpush.sendNotification(subscription, message);

    return new Response(JSON.stringify({ success: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err) {
    console.error('Edge Function sendPush error:', err);
    return new Response(JSON.stringify({ error: String(err) }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
});
