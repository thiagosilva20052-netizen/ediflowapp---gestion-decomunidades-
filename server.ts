import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';
import path from 'path';

import { Resend } from 'resend';

dotenv.config();

// MercadoPago Config
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || 'APP_USR-mock-token' });

// Resend Config
const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // MercadoPago - Crear Preferencia
  app.post('/api/checkout/preference', async (req, res) => {
    try {
      const { title, unit_price, quantity, user_id } = req.body;
      
      const preference = new Preference(client);
      const result = await preference.create({
        body: {
          items: [
             {
               id: 'item-ID-1234',
               title: title || 'Suscripción Seguify Premium',
               quantity: quantity || 1,
               unit_price: unit_price || 9900,
               currency_id: 'CLP',
             }
          ],
          back_urls: {
            success: 'http://localhost:3000/payments/success',
            failure: 'http://localhost:3000/payments/failure',
            pending: 'http://localhost:3000/payments/pending'
          },
          auto_return: 'approved',
          external_reference: user_id || 'guest',
        }
      });
      
      res.json({ id: result.id, init_point: result.init_point });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create preference' });
    }
  });

  // MercadoPago - Webhook (Simulado/Preparado)
  app.post('/api/checkout/webhook', async (req, res) => {
    try {
      // Validar firma aquí en producción (X-Signature)
      const data = req.body;
      console.log('Webhook MP Recibido:', data);
      
      // Update en Supabase
      if (data.type === 'payment' && data.data && data.data.id) {
        try {
          const { supabaseServer } = await import('./src/lib/supabase-server.js');
          
          // You might check if external_reference is a transaction ID to update it.
          // Or just update by user_id and 'pending' status.
          // In this case, we can assume external_reference will carry 'user_id_tenant_id' or 'transaction_id' 
          // However, for One-Click, let's assume we create a 'pending' transaction FIRST in the DB before calling MP or
          // update any 'pending' transaction for that external_reference user.
          
          // Let's assume external reference is a user ID for now as per preference creation.
          const userId = data.data.external_reference;

          if (userId && userId !== 'guest') {
             // To ensure idempotency: only update if status is 'pending'
             await (supabaseServer as any)
               .from('transactions')
               .update({ status: 'success', payment_id: String(data.data.id), payment_date: new Date().toISOString() })
               .eq('external_reference', userId)
               .eq('status', 'pending');
          }

        } catch (dbError) {
          console.error('Error actualizando Supabase:', dbError);
        }
      }

      res.status(200).send('OK');
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).send('Webhook Processing Failed');
    }
  });

  // Resend - Email notifications
  app.post('/api/email/send', async (req, res) => {
    try {
      const { to, subject, html, text } = req.body;
      
      if (!to || !subject || (!html && !text)) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      console.log('Sending email with Resend:', { to, subject });

      const data = await resend.emails.send({
        from: 'Ediflow <onboarding@resend.dev>', // Update with your verified domain in production
        to,
        subject,
        html,
        text,
      });

      res.status(200).json(data);
    } catch (error) {
      console.error('Resend error:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Express 5 format for catch-all
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Seguify Server running on http://localhost:${PORT}`);
  });
}

startServer();
