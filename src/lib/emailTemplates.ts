export const getWelcomeEmailHtml = (unitNumber: string, setPasswordUrl: string, tenantName: string = "Tu Comunidad", tenantRut: string = "") => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #111111;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            border: 1px solid #eaeaec;
        }
        .header {
            padding: 40px 40px 20px 40px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.02em;
        }
        .content {
            padding: 20px 40px;
            text-align: center;
        }
        .content p {
            font-size: 16px;
            color: #555555;
            margin-bottom: 30px;
        }
        .btn-container {
            margin: 30px 0;
        }
        .btn {
            display: inline-block;
            background-color: #00AEEF;
            color: white;
            padding: 14px 28px;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            font-size: 16px;
        }
        .footer {
            background-color: #141414;
            color: #888888;
            padding: 30px 40px;
            text-align: center;
            font-size: 12px;
        }
        .footer p {
            margin: 5px 0;
        }
        .footer a {
            color: #888888;
            text-decoration: underline;
        }
        .highlight {
            font-weight: 600;
            color: #111111;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Bienvenido a ${tenantName}</h1>
        </div>
        <div class="content">
            <p>Hola, has sido registrado como residente de la unidad <span class="highlight">Dpto ${unitNumber}</span>. Para acceder a tu panel de control, pagar tus gastos comunes y gestionar visitas, por favor configura tu contraseña.</p>
            <div class="btn-container">
                <a href="${setPasswordUrl}" class="btn">Configurar Mi Contraseña</a>
            </div>
            <p style="font-size: 14px; margin-top: 40px; color: #888;">Si no solicitaste esta cuenta o ya no eres residente de este edificio, puedes desvincular tu correo usando las opciones de abajo.</p>
        </div>
        <div class="footer">
            <p>Enviado por Ediflow para <strong>${tenantName}</strong> ${tenantRut ? `(RUT: ${tenantRut})` : ''}</p>
            <p>¿Problemas técnicos? <a href="#">Contactar Soporte Ediflow</a></p>
            <p style="margin-top: 15px;"><a href="#">Darse de baja / Unsubscribe</a></p>
            <p style="margin-top: 10px;">Powered by Ediflow IA &copy; ${new Date().getFullYear()}</p>
        </div>
    </div>
</body>
</html>
`;

export const getBillingEmailHtml = (unitNumber: string, period: string, amount: string, tenantName: string = "Tu Comunidad", tenantRut: string = "") => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background-color: #f9f9f9; color: #111; }
        .container { max-width: 600px; margin: 40px auto; background-color: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #eaeaec; }
        .header { padding: 40px; text-align: center; border-bottom: 1px solid #eaeaea; }
        .header h1 { margin: 0; font-size: 20px; color: #555; }
        .amount { font-size: 42px; font-weight: 800; color: #00AEEF; margin: 20px 0; font-family: monospace; }
        .content { padding: 30px 40px; text-align: center; }
        .btn { display: inline-block; background-color: #00AEEF; color: #fff; padding: 14px 28px; border-radius: 8px; font-weight: 600; text-decoration: none; margin-top: 20px; }
        .footer { background-color: #141414; color: #888; padding: 30px 40px; text-align: center; font-size: 12px; }
        .footer p { margin: 5px 0; }
        .footer a { color: #888; text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Gastos Comunes - ${period}</h1>
            <div class="amount">$${amount}</div>
            <p style="margin: 0; color: #888;">Unidad Dpto ${unitNumber}</p>
        </div>
        <div class="content">
            <p>Hola residente, ya se encuentra disponible tu colilla de cobro para el período actual.</p>
            <a href="https://ediflow.app/pagos" class="btn">Pagar Ahora</a>
        </div>
        <div class="footer">
            <p>Enviado por Ediflow para <strong>${tenantName}</strong> ${tenantRut ? `(RUT: ${tenantRut})` : ''}</p>
            <p>¿Problemas técnicos? <a href="#">Contactar Soporte Ediflow</a></p>
            <p style="margin-top: 15px;"><a href="#">Darse de baja / Unsubscribe</a></p>
        </div>
    </div>
</body>
</html>
`;
