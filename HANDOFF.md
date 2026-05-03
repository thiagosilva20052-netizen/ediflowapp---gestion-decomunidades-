# Ediflow - Technical Handoff Document (Antigravity)

## 1. Jerarquía de Roles (Role Hierarchy)

Ediflow implementa un sistema Role-Based Access Control (RBAC) estructurado en la tabla `profiles` de Supabase mediante la columna `role`. 

### A. Admin (Administrador)
- **Alcance**: Tiene acceso absoluto a todos los módulos del `tenant_id` al que pertenece.
- **Vistas Exclusivas**: `AdminDashboard.tsx`, Reportes Financieros, Emisión de Prorrateos, Auditorías (Audit Logs).
- **Escritura**: Puede modificar Gastos (Egresos), aprobar transacciones de MercadoPago, y modificar metadata del edificio.

### B. Concierge (Conserje)
- **Alcance**: Rol operacional con foco en el control del edificio en tiempo real. 
- **Vistas Exclusivas**: `ConciergeDashboard.tsx`, Gestión de Encomiendas, Visitas (QR y códigos PIN), y Monitoreo del Muro.
- **Restricciones**: No tiene acceso a módulos financieros (`EgresosPage.tsx`, `ProrrateoPage.tsx`) ni a configuraciones de pago.

### C. Resident (Residente / Copropietario)
- **Alcance**: Usuario final. Solo tiene acceso a su información o la de su unidad (`owner_id` en `units`).
- **Seguridad RLS (Row Level Security)**: Las políticas de Supabase restringen estrictamente que un residente solo pueda consultar en su dashboard `Transactions`, `Fines`, `Visitor_Passes` donde `user_id` u `owner_id` coincida con su `auth.uid()`. Se endureció la política en la tabla `profiles` para asegurar que ningún residente pueda ver el email privado de cobro de sus vecinos.

---

## 2. Flujo de Edge Functions: Emergencias (SOS) y Notificaciones

Para garantizar que un evento crítico (SOS o llegada de paquetes) opere sin depender un dispositivo cliente, Ediflow delega las notificaciones push y correos al ecosistema Backend/Edge Functions.

### Flujo SOS (Botón de Pánico)
1. **Disparador**: El residente presiona el botón SOS en su app (insert en `panic_alerts`).
2. **Trigger/Webhook de Supabase**: Se detecta el `INSERT` y Supabase llama a la Edge Function `notify-sos`.
3. **Ejecución Edge**: 
   - Se consulta a todos los conserjes y admins del `tenant_id` (vía `SUPABASE_SERVICE_ROLE_KEY` para saltar RLS y buscar dispositivos).
   - Se procesa un Web Push múltiple a los conserjes (utilizando las llaves `VAPID`).
   - El Conserje Dashboard, suscrito mediante `supabase.channel`, recibe un Websocket instantáneo en frontend (para hacer parpadear alarmas sin recargar).
4. **Registro Log**: Cualquier fallo en Resend/VAPID se registra en el log global con severidad `critical` que el Admin ve en la "Torre de Control".

### Flujo de Encomiendas (Parcels)
1. **Disparador**: Conserjería recibe un paquete y anota la Unidad (insert en `parcels` con estado `Pendiente`).
2. **Post-Hook**: La inserción gatilla una Edge Function `notify-parcel`.
3. **Ejecución Edge**: 
   - Busca el `owner_id` asociado a esa `unit_number`.
   - Llama a **Resend API** usando el `contact_email` del residente para notificar *"Tienes un paquete en conserjería"*.
4. **Acuse de recibo**: Cuando el conserje cambia el estado a `Entregado`, el registro queda sellado y grabado en los `Audit Logs` para trazabilidad de administración.
