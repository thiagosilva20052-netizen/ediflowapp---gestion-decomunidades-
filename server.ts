import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';
import path from 'path';
import webpush from 'web-push';

import { Resend } from 'resend';

dotenv.config();

// Web Push Config
if (process.env.VITE_VAPID_PUBLIC_KEY && process.env.VITE_VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:admin@ediflow.cl',
    process.env.VITE_VAPID_PUBLIC_KEY,
    process.env.VITE_VAPID_PRIVATE_KEY
  );
}

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

  // Resend - Batch Email notifications (send-billing)
  app.post('/api/email/send-billing', async (req, res) => {
    try {
      const { units, tenantId, tenantName, tenantRut, billingMonth } = req.body;
      
      if (!units || !Array.isArray(units)) {
        return res.status(400).json({ error: 'Missing units array' });
      }

      console.log(`[Resend Batch] Preparing billing emails for ${units.length} units in tenant ${tenantId}. Period: ${billingMonth}`);

      // We dynamically import to avoid breaking normal flow if file not found locally
      const { getBillingEmailHtml } = await import('./src/lib/emailTemplates.js');

      // The payload structure for Resend Batch:
      const emailsToSend = units.map((u: any) => ({
        from: 'Ediflow Billing <billing@resend.dev>', // Update with verified domain
        to: u.contact_email,
        subject: `Gastos Comunes Emitidos - ${billingMonth}`,
        html: getBillingEmailHtml(u.unitNumber, billingMonth, u.totalAmount, tenantName, tenantRut)
      })).filter((emailConfig: any) => emailConfig.to); // Only those with email

      if (emailsToSend.length > 0) {
        // Chunk arrays to size of 50 to avoid Rate Limit / Payload Too Large errors
        const CHUNK_SIZE = 50;
        let successCount = 0;
        let failedCount = 0;

        for (let i = 0; i < emailsToSend.length; i += CHUNK_SIZE) {
          const chunk = emailsToSend.slice(i, i + CHUNK_SIZE);
          console.log(`[Resend Batch] Sending chunk ${i / CHUNK_SIZE + 1} (${chunk.length} emails)...`);
          
          let retries = 0;
          let success = false;
          
          while (!success && retries < 3) {
            try {
              // const data = await resend.batch.send(chunk);
              console.log(`[Resend Batch] Simulated API call for chunk ${i / CHUNK_SIZE + 1}.`);
              
              // We could also loop through 'data' checking for specific failures per-email 
              // and update 'notification_logs' accordingly here if this wasn't simulated.
              success = true;
              successCount += chunk.length;
            } catch (chunkError: any) {
              console.warn(`[Resend Batch] Chunk error:`, chunkError);
              if (chunkError?.statusCode === 429) {
                retries++;
                console.log(`[Resend Batch] Rate limited. Retrying (${retries}/3) in 2 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
              } else {
                failedCount += chunk.length;
                console.error(`[Resend Batch] Non-retryable error for chunk:`, chunkError);
                break; // Give up on this chunk
              }
            }
          }
        }
        console.log(`[Resend Batch] Finished. Success: ${successCount}. Failed: ${failedCount}`);
      }

      res.status(200).json({ success: true, attempted: emailsToSend.length });
    } catch (error) {
      console.error('Batch email error:', error);
      res.status(500).json({ error: 'Failed to send batch emails' });
    }
  });

  // Resend - Welcome Onboarding
  app.post('/api/email/send-welcome', async (req, res) => {
    try {
      const { to, unitNumber, setPasswordUrl, tenantName, tenantRut } = req.body;
      
      if (!to || !unitNumber || !setPasswordUrl) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      console.log(`[Resend Welcome] Sending onboarding email to ${to} for Dpto ${unitNumber}`);
      
      // We dynamically import to avoid breaking normal flow if file not found locally
      const { getWelcomeEmailHtml } = await import('./src/lib/emailTemplates.js');
      const html = getWelcomeEmailHtml(unitNumber, setPasswordUrl, tenantName, tenantRut);

      const data = await resend.emails.send({
        from: 'Ediflow Onboarding <onboarding@resend.dev>',
        to,
        subject: `Bienvenido a Ediflow - Configura tu acceso`,
        html,
      });

      res.status(200).json(data);
    } catch (error) {
      console.error('Welcome email error:', error);
      res.status(500).json({ error: 'Failed to send welcome email' });
    }
  });

  // Resend - Webhook (Bounces, Complaints, Deliveries)
  app.post('/api/webhooks/resend', async (req, res) => {
    try {
      const payload = req.body;
      console.log('📬 Webhook Resend Recibido:', payload.type);

      if (payload.type === 'email.bounced' || payload.type === 'email.delivered' || payload.type === 'email.complained') {
        const emailId = payload.data?.email_id;
        const status = payload.type === 'email.bounced' ? 'bounced' : payload.type === 'email.delivered' ? 'delivered' : 'complained';
        const reason = payload.data?.reason || (status === 'delivered' ? 'Entregado' : 'Rechazado');

        // We use the Supabase admin client to update the logging record using the metadata we passed
        // For example, if we stored the emailId or if we match by email target:
        const toEmail = payload.data?.to?.[0]; // Usually returned in the payload

        if (toEmail) {
          const { supabaseServer } = await import('./src/lib/supabase-server.js');
          
          await (supabaseServer as any)
            .from('notification_logs')
            .update({ status: status, details: `Resend: ${reason}` })
            .ilike('details', `%${toEmail}%`) // Very simple matching by email text stored in details
            .eq('status', 'enviando...');
        }
      }

      res.status(200).send('OK');
    } catch (error) {
      console.error('Resend Webhook error:', error);
      res.status(500).send('Webhook Failed');
    }
  });

  // Web Push and Email - Notify Resident of Parcel
  app.post('/api/notify/parcel', async (req, res) => {
    try {
      const { unitId, tenantId, title, body, packageType, unitNumber, tenantName, receivedAt } = req.body;
      console.log(`[Parcel Notification] -> Unit: ${unitId} | Title: ${title}`);
      
      const { supabaseServer } = await import('./src/lib/supabase-server.js');
      const { data: unitData } = await (supabaseServer as any)
        .from('units')
        .select('contact_email')
        .eq('id', unitId)
        .single();
        
      if (unitData && unitData.contact_email) {
         const html = `
           <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
             <h2 style="color: #00AEEF;">📦 Tienes un nuevo paquete en conserjería</h2>
             <p>Hola,</p>
             <p>Ha llegado una encomienda nueva a la conserjería de tu edificio <strong>${tenantName || 'tu comunidad'}</strong>.</p>
             <div style="background-color: #f4f4f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0 0 8px 0;"><strong>Departamento:</strong> ${unitNumber}</p>
                <p style="margin: 0 0 8px 0;"><strong>Tipo de paquete:</strong> ${packageType}</p>
                <p style="margin: 0;"><strong>Hora de Recepción:</strong> ${receivedAt}</p>
             </div>
             <p>Por favor, recuerda pasar a retirarlo cuando puedas para no saturar la bodega.</p>
             <p>Saludos,<br/>El conserje de turno via Seguify</p>
           </div>
         `;
         
         const { data: emailData, error: emailError } = await resend.emails.send({
           from: 'Conserjería Seguify <conserjeria@resend.dev>',
           to: unitData.contact_email,
           subject: `¡Nuevo paquete recibido! (${packageType})`,
           html,
         });
         
         if (emailError) {
           console.error('[Parcel Email Failed]', emailError);
           await (supabaseServer as any).from('audit_logs').insert({
             tenant_id: tenantId,
             action: 'Fallo de Notificación Email (Encomienda)',
             details: `Error al enviar notificación de paquete a Unidad ${unitNumber} (${unitData.contact_email}): ${JSON.stringify(emailError)}`,
             module: 'packages',
             severity: 'warning'
           });
         } else {
           console.log(`[Parcel Email Sent] Sent to ${unitData.contact_email}`);
         }
      }
      
      // Simulated Push
      const payload = JSON.stringify({
        title,
        body,
        icon: '/apple-touch-icon.png',
        badge: '/favicon.ico',
      });
      // webpush.sendNotification(...) logic goes here
      
      res.status(200).json({ success: true, message: 'Notification sent.' });

    } catch (error) {
       console.error('Notify Parcel error:', error);
       
       try {
         const { supabaseServer } = await import('./src/lib/supabase-server.js');
         if (req.body.tenantId && req.body.unitNumber) {
           await (supabaseServer as any).from('audit_logs').insert({
             tenant_id: req.body.tenantId,
             action: 'Fallo Crítico de Notificación (Encomienda)',
             details: `Excepción general al notificar unidad ${req.body.unitNumber}: ${error instanceof Error ? error.message : String(error)}`,
             module: 'packages',
             severity: 'critical'
           });
         }
       } catch (dbErr) {
         console.error('Failed to log critical error to audit_logs:', dbErr);
       }
       
       res.status(500).json({ error: 'Failed to send notification' });
    }
  });

  // Web Push and Email - Notify Resident of Visitor Access
  app.post('/api/notify/visit', async (req, res) => {
    try {
      const { unitId, tenantId, visitorName, unitNumber, tenantName, accessedAt } = req.body;
      console.log(`[Visit Notification] -> Unit: ${unitId} | Visitor: ${visitorName}`);
      
      res.status(200).json({ success: true, message: 'Notification job queued.' });

      (async () => {
         try {
           const { supabaseServer } = await import('./src/lib/supabase-server.js');
           const { data: unitData } = await (supabaseServer as any)
             .from('units')
             .select('contact_email')
             .eq('id', unitId)
             .single();
             
           // Email
           if (unitData && unitData.contact_email) {
              const html = `
                <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #00AEEF;">🚪 Tu visita ha ingresado</h2>
                  <p>Hola,</p>
                  <p>Tenemos un ingreso registrado en <strong>${tenantName || 'tu comunidad'}</strong>.</p>
                  <div style="background-color: #f4f4f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
                     <p style="margin: 0 0 8px 0;"><strong>Departamento:</strong> ${unitNumber}</p>
                     <p style="margin: 0 0 8px 0;"><strong>Nombre de la Visita:</strong> ${visitorName}</p>
                     <p style="margin: 0;"><strong>Hora de Ingreso:</strong> ${accessedAt}</p>
                  </div>
                  <p>Saludos,<br/>El conserje de turno via Seguify</p>
                </div>
              `;
              
              const { error: emailError } = await resend.emails.send({
                from: 'Conserjería Seguify <conserjeria@resend.dev>',
                to: unitData.contact_email,
                subject: `¡Tu visita ha ingresado! (${visitorName})`,
                html,
              });
              
              if (emailError) {
                 console.error('[Visit Email Failed]', emailError);
                 await (supabaseServer as any).from('audit_logs').insert({
                   tenant_id: tenantId,
                   action: 'Fallo de Notificación Email (Ingreso Visita)',
                   details: `Error al enviar notificación de visita a Unidad ${unitNumber}: ${JSON.stringify(emailError)}`,
                   module: 'access_control',
                   severity: 'warning'
                 });
              } else {
                 console.log(`[Visit Email Sent] Sent to ${unitData.contact_email}`);
              }
           }
           
           // Simulated Push
           const payload = JSON.stringify({
             title: '🚪 Tu visita ha ingresado',
             body: `${visitorName} ha entrado al predio.`,
             icon: '/apple-touch-icon.png',
             badge: '/favicon.ico',
           });
           
         } catch (bgError) {
           console.error('[Background Notification Error - Visit]', bgError);
         }
      })();
    } catch (error) {
       console.error('Notify Visit error:', error);
       res.status(500).json({ error: 'Failed to send notification' });
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
