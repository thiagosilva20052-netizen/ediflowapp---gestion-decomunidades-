import { LogEntry } from '../types';
import { supabase } from '../lib/supabase-client';

export const conserjeriaService = {
  /**
   * Registra una nueva encomienda buscando primero el ID del residente
   * basado en el número de departamento y el tenant actual.
   */
  async registrarEncomienda(tenantId: string, depto: string, carrier: string, trackingCode?: string) {
    try {
      // 1. Buscar resident_id basado en el depto y tenant (Lógica 'Chile-Ready')
      const { data: resident, error: residentError } = await supabase
        .from('residents')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('department_number', depto)
        .single();

      if (residentError || !resident) {
        throw new Error(`Residente no encontrado para el departamento ${depto}`);
      }

      // 2. Insertar encomienda en la tabla real
      const { data: newPackage, error: packageError } = await supabase
        .from('packages')
        .insert({
          tenant_id: tenantId,
          resident_id: resident.id,
          carrier,
          tracking_code: trackingCode,
          status: 'pending',
          received_at: new Date().toISOString()
        })
        .select()
        .single();

      if (packageError) throw packageError;
      return newPackage;

    } catch (error) {
      console.error('Error registrando encomienda:', error);
      throw error;
    }
  },

  /**
   * Registra una nueva visita manual en la bitácora
   */
  async registrarVisita(tenantId: string, visitorName: string, visitorRut: string, depto: string): Promise<LogEntry> {
    try {
      // 1. Buscar resident_id
      const { data: resident, error: residentError } = await supabase
        .from('residents')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('department_number', depto)
        .single();

      if (residentError || !resident) {
        throw new Error(`Residente no encontrado para el departamento ${depto}`);
      }

      // 2. Insertar registro de visita (Log/Novelty)
      const { data: newVisit, error: visitError } = await supabase
        .from('novelties')
        .insert({
          tenant_id: tenantId,
          resident_id: resident.id,
          type: 'visita',
          visitor_name: visitorName,
          visitor_rut: visitorRut,
          timestamp: new Date().toISOString()
        })
        .select()
        .single();

      if (visitError) throw visitError;

      // Adaptar respuesta al tipo LogEntry del frontend
      return {
        id: newVisit.id,
        icon: 'person_check',
        color: 'text-blue-400',
        title: 'Visita ingresada',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        desc: `Para Depto ${depto} (${visitorName})`,
        tenantId: tenantId
      };

    } catch (error) {
      console.error('Error registrando visita:', error);
      throw error;
    }
  },

  /**
   * Registra un pago manual (Efectivo o Cheque) en conserjería
   */
  async registrarPagoManual(
    tenantId: string, 
    depto: string, 
    amount: number, 
    method: 'cash' | 'check', 
    conciergeName: string,
    checkNumber?: string,
    notes?: string
  ): Promise<any> {
    try {
      // 1. Buscar unit
      const { data: units, error: unitError } = await supabase
        .from('units')
        .select('id, resident_id')
        .eq('tenant_id', tenantId)
        .eq('unit_number', depto);

      if (unitError || !units || units.length === 0) {
        throw new Error(`Unidad no encontrada para el departamento ${depto}`);
      }

      // 2. Insertar registro de pago en transactions
      const { data: userProfile } = await supabase.auth.getUser();

      const { data: newPayment, error: paymentError } = await supabase
        .from('transactions')
        .insert({
          tenant_id: tenantId,
          unit_id: units[0].id,
          user_id: units[0].resident_id,
          received_by: userProfile?.user?.id || null, // Audit trace
          amount,
          status: 'success', // Pago manual en conserjería se asume exitoso/recibido
          method,
          payment_date: new Date().toISOString()
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // 3. (Opcional) Registrar también en la bitácora (novelties) para que quede el log
      await supabase.from('novelties').insert({
        tenant_id: tenantId,
        resident_id: units[0].resident_id,
        type: 'pago',
        desc: `Pago recibido por ${conciergeName} - $${amount} (${method})`,
        timestamp: new Date().toISOString()
      });

      return newPayment;

    } catch (error) {
      console.error('Error registrando pago manual:', error);
      throw error;
    }
  }
};
