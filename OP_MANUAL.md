# Manual de Operaciones EdiFlow (OP MANUAL)

## 1. Actualización de Unidades
El sistema factura de manera dinámica basándose en la cantidad de unidades (departamentos) registrados en el 'Tenant' (Edificio).
- Si el edificio crece (ej. nuevas casas agregadas en un condominio horizontal):
  - El Administrador debe ir a **Edificio -> Unidades y Residentes**.
  - Crear la nueva unidad manualmente o importar un CSV.
  - En el próximo ciclo de facturación, el webhook de Mercado Pago y el Checkout calcularán automáticamente: `Math.max(cantidad_de_unidades, 40) * 2000`.

## 2. Rotación de Llaves (VAPID / API Keys)
Por seguridad, es posible que necesite rotar credenciales:

**Mercado Pago (Access Token)**
1. Inicie sesión en la cuenta Developer de Mercado Pago.
2. Revoque el token actual y genere uno nuevo.
3. Vaya a la configuración de entorno en Google AI Studio (o Vercel) y actualice la variable `MERCADOPAGO_ACCESS_TOKEN`.
4. Reinicie el servidor o haga un re-deploy.

**Resend (Email API)**
1. En Resend.com, genere un nuevo API Key y elimine el anterior.
2. Actualice la variable `RESEND_API_KEY` en el entorno.

**Push Notifications (VAPID)**
1. Si rota la llave privada VAPID (`VAPID_PRIVATE_KEY`), las suscripciones existentes de los clientes dejarán de funcionar. 
2. Si debe hacerlo, regenere las llaves, colóquelas en el `.env` (Public y Private) y notifique a la comunidad, ya que los usuarios tendrán que volver a habilitar las notificaciones push en sus dispositivos navegadores.

## 3. Resolución de Errores Comunes
- **Pagos no reflejados:** Verifique que la URL del Webhook HTTPS (`/api/checkout/webhook`) esté correctamente registrada en el dashboard de Mercado Pago, y que el servidor web sea accesible desde internet.
- **Correos no llegan:** Confirme que el dominio emisor en Resend esté verificado y que los registros DNS (DKIM/SPF) estén propagados.
