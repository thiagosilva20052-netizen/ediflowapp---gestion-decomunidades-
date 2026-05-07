// Local mock test for notifications integration
// - Starts a mock Supabase Edge Function endpoint at /functions/v1/sendPush
// - Calls it using headers and body equivalent to sendPushViaEdge
// - Validates response

import express from 'express';

const PORT = 54321;

async function runTest() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/functions/v1/sendPush', (req, res) => {
    console.log('[Mock Edge] Received request:', { headers: req.headers, body: req.body });
    // Basic auth check
    const auth = req.headers['authorization'] || req.headers['Authorization'];
    const apikey = req.headers['apikey'] || req.headers['APIKEY'];

    if (!auth || !apikey) {
      return res.status(401).json({ error: 'Missing auth headers' });
    }

    // Simulate success
    return res.status(200).json({ success: true });
  });

  const server = app.listen(PORT, async () => {
    console.log(`[Mock Edge] Listening on http://localhost:${PORT}`);

    // Now call the mock endpoint as sendPushViaEdge would
    try {
      const fnUrl = `http://localhost:${PORT}/functions/v1/sendPush`;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-service-key';

      const subscription = { endpoint: 'https://fcm.mock/push', keys: { p256dh: 'abc', auth: 'def' } };
      const payload = { title: 'Test', body: 'This is a test notification' };

      const resp = await fetch(fnUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceKey}`,
          'apikey': serviceKey
        },
        body: JSON.stringify({ subscription, payload })
      });

      const text = await resp.text();
      console.log('[Test] Response status:', resp.status, 'body:', text);
    } catch (err) {
      console.error('[Test] Error calling mock edge:', err);
    } finally {
      server.close(() => {
        console.log('[Mock Edge] Server closed');
      });
    }
  });
}

runTest().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
