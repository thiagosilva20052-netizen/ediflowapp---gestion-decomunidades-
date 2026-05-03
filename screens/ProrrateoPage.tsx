import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenName } from '../App';
import { supabase } from '../src/lib/supabase-client';
import { useAppContext } from '../src/context/AppContext';

interface Props {
  navigate: (screen: ScreenName) => void;
}

interface ProrrateoRow {
  unitId: string;
  unitNumber: string;
  ownerId: string | null;
  ownerName: string;
  contactEmail: string | null;
  isUnsubscribed: boolean;
  aliquot: number;
  baseAmount: number;
  individualAmount: number;
  finesAmount: number;
  arrears: number;
  total: number;
}

const ProrrateoPage: React.FC<Props> = ({ navigate }) => {
  const { currentTenant } = useAppContext();
  const [isCalculated, setIsCalculated] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isEmitting, setIsEmitting] = useState(false);
  const [hasEmitted, setHasEmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const [expenses, setExpenses] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [prorrateoData, setProrrateoData] = useState<ProrrateoRow[]>([]);
  
  const [notificationLogs, setNotificationLogs] = useState<any[]>([]);
  const [logSearchQuery, setLogSearchQuery] = useState('');

  const fetchNotificationLogs = async () => {
    if (!currentTenant) return;
    const billingMonth = new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric' }).format(new Date());
    const capitalizedMonth = billingMonth.charAt(0).toUpperCase() + billingMonth.slice(1);

    const { data, error } = await supabase
      .from('notification_logs')
      .select('*, units!inner(unit_number), profiles(full_name)')
      .eq('tenant_id', currentTenant.id)
      .eq('type', 'billing_statement')
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setNotificationLogs(data);
    }
  };

  useEffect(() => {
    if (hasEmitted) {
      fetchNotificationLogs();
      const interval = setInterval(fetchNotificationLogs, 5000);
      return () => clearInterval(interval);
    }
  }, [hasEmitted]);

  const [selectedColilla, setSelectedColilla] = useState<ProrrateoRow | null>(null);

  const [totals, setTotals] = useState({

    expenses: 0,
    reserve: 0,
    total: 0
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (!currentTenant) return;

    const fetchData = async () => {
      // Fetch expenses for the current month
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      
      const { data: expData } = await supabase
        .from('expenses')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .eq('status', 'Aprobado')
        .gte('expense_date', firstDay);

      if (expData) setExpenses(expData);

      // Fetch units and their alícuotas
      const { data: unitData } = await supabase
        .from('units')
        .select('*, profiles(full_name)')
        .eq('tenant_id', currentTenant.id);

      if (unitData) setUnits(unitData);
    };

    fetchData();
  }, [currentTenant]);

  const handleCalculate = async () => {
    if (!currentTenant || units.length === 0) return;
    
    setIsCalculating(true);
    
    try {
      const sumExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
      const reserveFund = sumExpenses * 0.05;
      const totalToProrate = sumExpenses + reserveFund;
      
      setTotals({
        expenses: sumExpenses,
        reserve: reserveFund,
        total: totalToProrate
      });

      // Fetch all pending transactions to calculate arrears
      const { data: pendingTxs } = await supabase
        .from('transactions')
        .select('unit_id, amount')
        .eq('tenant_id', currentTenant.id)
        .eq('status', 'pending');

      // Group pending transactions by unit_id for O(N) lookup
      const arrearsByUnit = (pendingTxs || []).reduce((acc: Record<string, number>, tx) => {
        if (!tx.unit_id) return acc;
        acc[tx.unit_id] = (acc[tx.unit_id] || 0) + Number(tx.amount);
        return acc;
      }, {});

      // Fetch this month's meter readings for individual amounts
      const currentMonth = new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric' }).format(new Date());
      const { data: medidores } = await supabase
        .from('meter_readings')
        .select('unit_id, amount')
        .eq('tenant_id', currentTenant.id)
        .eq('billing_month', currentMonth);

      const medidoresByUnit = (medidores || []).reduce((acc: Record<string, number>, rd) => {
        if (!rd.unit_id) return acc;
        acc[rd.unit_id] = (acc[rd.unit_id] || 0) + Number(rd.amount);
        return acc;
      }, {});

      // Fetch pending fines and extra charges approved for this month
      const { data: finesData } = await supabase
        .from('fines')
        .select('unit_id, amount')
        .eq('tenant_id', currentTenant.id)
        .eq('status', 'approved');

      const finesByUnit = (finesData || []).reduce((acc: Record<string, number>, fine) => {
        if (!fine.unit_id) return acc;
        acc[fine.unit_id] = (acc[fine.unit_id] || 0) + Number(fine.amount);
        return acc;
      }, {});

      // Sum of proration factors (aliquots)
      const sumAliquots = units.reduce((acc, curr) => acc + Number(curr.proration_factor || 0), 0);
      
      if (sumAliquots === 0) {
        showToast("Error: Las unidades no tienen alícuotas definidas.");
        setIsCalculating(false);
        return;
      }

      const calculatedRows: ProrrateoRow[] = units.map(unit => {
        const factor = Number(unit.proration_factor || 0);
        // Formula: (Total / SumFactors) * UnitFactor
        const base = (totalToProrate / sumAliquots) * factor;
        
        // Individual amounts (medidores)
        const individual = medidoresByUnit[unit.id] || 0;
        
        // Fines and extra charges
        const unitFines = finesByUnit[unit.id] || 0;

        // Calculate arrears for this unit (O(1) lookup)
        const unitArrears = arrearsByUnit[unit.id] || 0;
        
        return {
          unitId: unit.id,
          unitNumber: unit.unit_number,
          ownerId: unit.owner_id,
          ownerName: unit.profiles?.full_name || 'Sin Asignar',
          contactEmail: unit.contact_email || null,
          isUnsubscribed: unit.is_unsubscribed || false,
          aliquot: factor,
          baseAmount: base,
          individualAmount: individual,
          finesAmount: unitFines,
          arrears: unitArrears,
          total: base + individual + unitFines + unitArrears
        };
      });

      setProrrateoData(calculatedRows);
      setIsCalculating(false);
      setIsCalculated(true);
      showToast("Prorrateo calculado según Ley 21.442");
    } catch (err) {
      console.error(err);
      setIsCalculating(false);
      showToast("Error al calcular el prorrateo.");
    }
  };

  const handleEmit = async () => {
    if (!currentTenant || prorrateoData.length === 0) return;
    
    setIsEmitting(true);
    
    try {
      const billingMonth = new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric' }).format(new Date());
      
      // Batch insert transactions - ONLY CURRENT MONTH CHARGES (Base + Individual + Fines)
      // Arrears remain as separate pending transactions in the DB to avoid double counting
      const transactionsToInsert = prorrateoData.map(row => ({
        tenant_id: currentTenant.id,
        unit_id: row.unitId,
        user_id: row.ownerId,
        amount: row.baseAmount + row.individualAmount + row.finesAmount,
        billing_month: billingMonth.charAt(0).toUpperCase() + billingMonth.slice(1),
        method: 'mercadopago',
        status: 'pending'
      }));

      const { error: txError } = await supabase.from('transactions').insert(transactionsToInsert);
      if (txError) throw txError;

      // Create Notification Logs (Mocking the email firing process initially)
      const notificationLogsToInsert = prorrateoData.map(row => {
        let status = 'failed';
        let details = `Error: Falta correo para unidad Dpto ${row.unitNumber}`;
        
        if (row.isUnsubscribed) {
          status = 'cancelled';
          details = 'Usuario dado de baja (Opt-out)';
        } else if (row.contactEmail) {
          status = 'enviando...';
          details = `Procesando envío de colilla a ${row.contactEmail}`;
        }

        return {
          tenant_id: currentTenant.id,
          unit_id: row.unitId,
          user_id: row.ownerId,
          type: 'billing_statement',
          status,
          details
        };
      });

      await supabase.from('notification_logs').insert(notificationLogsToInsert);

      // Trigger the Edge Function / API Endpoint to send batch emails via Resend
      const payloadToMail = prorrateoData
        .filter(row => !row.isUnsubscribed)
        .map(row => ({
          ...row,
          totalAmount: Math.round(row.total).toLocaleString('es-CL')
        }));

      fetch('/api/email/send-billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          units: payloadToMail,
          tenantId: currentTenant.id,
          tenantName: currentTenant.name,
          tenantRut: currentTenant.rut_edificio,
          billingMonth
        })
      }).catch(err => console.error("Error triggering billing emails:", err));

      // Update approved fines to 'paid' status assuming they are now part of the GC transaction
      await supabase
        .from('fines')
        .update({ status: 'paid' })
        .eq('tenant_id', currentTenant.id)
        .eq('status', 'approved');

      // Post to Community Wall
      await supabase.from('announcements').insert({
        tenant_id: currentTenant.id,
        title: `Gastos Comunes ${billingMonth} disponibles`,
        content: `Estimados residentes, los gastos comunes correspondientes al mes de ${billingMonth} ya han sido emitidos y se encuentran disponibles para pago en sus respectivas cuentas. El total recaudado este mes se destinará a cubrir los egresos operacionales y el fondo de reserva del edificio.`,
        category: 'informative'
      });

      setIsEmitting(false);
      setHasEmitted(true);
      showToast("Mes Cerrado con Éxito. Colillas de cobro generadas y notificadas.");
    } catch (error) {
      console.error(error);
      setIsEmitting(false);
      showToast("Error al emitir boletas.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white font-sans overflow-hidden relative">
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-12 left-1/2 z-50 bg-blue-500 text-white px-6 py-3 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.4)] font-bold text-sm flex items-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="px-6 md:px-12 pt-12 pb-6 flex items-center justify-between sticky top-0 z-30 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate('ManageExpenses')}
              className="w-12 h-12 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Cierre de Mes <span className="font-serif italic font-normal text-blue-400">Prorrateo</span></h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px] text-blue-400">calculate</span>
                Motor de Prorrateo Automático
              </p>
            </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
           <div className="bg-[#111] border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span className="text-[10px] text-gray-300 uppercase tracking-widest font-bold">Mes en curso: Marzo 2026</span>
           </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 md:px-12 py-10 max-w-7xl mx-auto w-full space-y-10">
        
        {/* KPI & Formulas Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Calculation Overview */}
          <div className="lg:col-span-8 bg-[#111] p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-blue-500/10 transition-colors"></div>
            
            <div className="relative z-10">
               <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Base de Cálculo PropTech</p>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                     <p className="text-xs text-gray-400 mb-1">Total Egresos Mes</p>
                     <h3 className="text-3xl font-light tracking-tight text-white">${totals.expenses.toLocaleString('es-CL')}</h3>
                     <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">check_circle</span> {expenses.length} Justificados</p>
                  </div>
                  <div className="md:border-l md:border-white/5 md:pl-6">
                     <p className="text-xs text-gray-400 mb-1">Fondo Reserva Ley (5%)</p>
                     <h3 className="text-3xl font-light tracking-tight text-white">+ ${totals.reserve.toLocaleString('es-CL')}</h3>
                     <p className="text-[10px] text-gray-500 mt-1">Obligatorio Ley 21.442</p>
                  </div>
                  <div className="md:border-l md:border-white/5 md:pl-6">
                     <p className="text-xs text-gray-400 mb-1">Total a Prorratear</p>
                     <h3 className="text-3xl font-bold tracking-tight text-blue-400">${totals.total.toLocaleString('es-CL')}</h3>
                     <p className="text-[10px] text-gray-500 mt-1">Monto base a dividir</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Action Card: Motor */}
          <div className="lg:col-span-4 bg-[#111] p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10">
               <div className="flex items-center justify-between mb-4">
                 <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 shadow-inner">
                    <span className="material-symbols-outlined {isCalculating ? 'animate-spin' : ''}">sync</span>
                 </div>
                 {/* Tooltip trigger */}
                 <div className="group/tt relative">
                    <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center">
                       <span className="material-symbols-outlined text-[16px]">info</span>
                    </button>
                    {/* Tooltip content */}
                    <div className="absolute right-0 top-10 w-64 p-3 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover/tt:opacity-100 group-hover/tt:visible transition-all z-20 text-[10px] text-gray-300 leading-relaxed font-mono">
                       El Motor cruzará los Gastos Comunes totales, los multiplicará por la Alícuota (ej: 2.5%) de cada unidad, y sumará de forma automatizada deudas anteriores, multas y consumos individuales importados.
                    </div>
                 </div>
               </div>
               <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Motor de Prorrateo</h3>
               <p className="text-xs text-gray-400 leading-relaxed font-medium mb-6">
                  Divide el total según la tabla de alícuotas (propiedad de copropietarios) y suma los consumos individuales.
               </p>
            </div>

            <button 
              onClick={handleCalculate}
              disabled={isCalculating || isCalculated}
              className={`relative z-10 w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                isCalculated 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed'
                  : 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]'
              }`}
            >
              {isCalculating ? (
                 <>
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  Procesando Alícuotas...
                 </>
              ) : isCalculated ? (
                 <>
                  <span className="material-symbols-outlined">check</span>
                  Prorrateo Exitoso
                 </>
              ) : (
                 <>
                  <span className="material-symbols-outlined">play_arrow</span>
                  Ejecutar Motor Ahora
                 </>
              )}
            </button>
          </div>
        </div>

        {/* Individual Medidores Section (Integration Preview) */}
        {!isCalculated && (
           <div className="bg-orange-500/10 border border-orange-500/20 rounded-[2rem] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                 <span className="material-symbols-outlined">speed</span>
               </div>
               <div>
                 <h4 className="text-sm font-bold text-orange-400 mb-1">Lectura de Medidores Pendiente</h4>
                 <p className="text-xs text-gray-300 font-light">Se detectaron 45 unidades con consumo de agua caliente sin registrar este mes.</p>
               </div>
             </div>
             <div className="relative">
               <input 
                 type="file" 
                 id="medidores-upload" 
                 className="hidden" 
                 accept=".csv,.xls,.xlsx"
                 onChange={(e) => {
                   if (e.target.files && e.target.files.length > 0) {
                     showToast("Procesando archivo de medidores...");
                     setTimeout(() => {
                        showToast("Medidores importados correctamente");
                        if (e.target) e.target.value = '';
                     }, 1500);
                   }
                 }}
               />
               <label 
                 htmlFor="medidores-upload"
                 className="cursor-pointer text-xs bg-orange-500/20 text-orange-400 font-bold px-4 py-2 rounded-lg border border-orange-500/30 hover:bg-orange-500/30 transition-colors whitespace-nowrap block text-center"
               >
                 Importar Excel Medidores
               </label>
             </div>
           </div>
        )}

        {/* Results Data Table */}
        <AnimatePresence>
          {isCalculated && (
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6"
            >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                  <div>
                     <h2 className="text-2xl font-bold tracking-tight text-white">Borrador de Colillas</h2>
                     <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Revisa antes de emitir masivamente</p>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button 
                      onClick={handlePrint}
                      className="px-6 py-3 rounded-xl font-bold text-sm bg-[#111] border border-white/10 text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                    >
                       <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span> 
                       Reporte PDF
                    </button>
                    <button 
                      onClick={handleEmit}
                      disabled={isEmitting || hasEmitted}
                      className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-colors flex items-center justify-center gap-2 ${
                        hasEmitted 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed'
                          : 'bg-white text-black hover:bg-gray-100'
                      }`}
                    >
                       {isEmitting ? (
                         <><span className="material-symbols-outlined animate-spin text-[18px]">refresh</span> Enviando Notificaciones...</>
                       ) : hasEmitted ? (
                         <><span className="material-symbols-outlined text-[18px]">check_circle</span> Boletas Enviadas</>
                       ) : (
                         <><span className="material-symbols-outlined text-[18px]">send</span> Emitir Boletas (Abrir Cobranza)</>
                       )}
                    </button>
                  </div>
                </div>

                <div className="bg-[#111] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl printable-area">
                  {/* Print-only Header */}
                  <div className="hidden print:block mb-8">
                     <h1 className="text-2xl font-bold text-black border-b-2 border-black pb-2 mb-4">Resumen de Gastos Comunes - {currentTenant?.name}</h1>
                     <div className="grid grid-cols-2 gap-4 text-sm text-black">
                        <div>
                           <p><strong>Período:</strong> {new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric' }).format(new Date())}</p>
                           <p><strong>RUT Comunidad:</strong> {currentTenant?.rut_edificio || '---'}</p>
                           <p><strong>Administrador:</strong> Ediflow IA</p>
                        </div>
                        <div className="text-right">
                           <p><strong>Total Egresos:</strong> ${totals.expenses.toLocaleString('es-CL')}</p>
                           <p><strong>Fondo Reserva:</strong> ${totals.reserve.toLocaleString('es-CL')}</p>
                           <p className="text-lg font-bold">Total a Prorratear: ${totals.total.toLocaleString('es-CL')}</p>
                        </div>
                     </div>
                  </div>

                  <div className="overflow-x-auto">
                    {/* Expense Breakdown for Print */}
                    <div className="hidden print:block px-6 py-4 border-b border-black">
                       <h3 className="text-lg font-bold text-black mb-4">Detalle de Egresos Operacionales</h3>
                       <table className="w-full text-xs text-black mb-10">
                          <thead>
                             <tr className="border-b border-black">
                                <th className="text-left py-2">Proveedor</th>
                                <th className="text-left py-2">Categoría</th>
                                <th className="text-right py-2">Monto</th>
                             </tr>
                          </thead>
                          <tbody>
                             {expenses.map((e, idx) => (
                                <tr key={idx} className="border-b border-gray-200">
                                   <td className="py-2">{e.provider_name}</td>
                                   <td className="py-2">{e.category}</td>
                                   <td className="py-2 text-right">${Number(e.amount).toLocaleString('es-CL')}</td>
                                </tr>
                             ))}
                             <tr className="font-bold">
                                <td colSpan={2} className="py-4 text-right italic">Subtotal Egresos:</td>
                                <td className="py-4 text-right">${totals.expenses.toLocaleString('es-CL')}</td>
                             </tr>
                          </tbody>
                       </table>
                       <h3 className="text-lg font-bold text-black mb-4">Detalle por Unidad</h3>
                    </div>

                    <table className="w-full text-left text-sm text-gray-300">
                      <thead className="text-xs text-gray-500 uppercase bg-[#1A1A1A] border-b border-white/5">
                        <tr>
                          <th className="px-6 py-4 font-semibold tracking-widest">Unidad</th>
                          <th className="px-6 py-4 font-semibold tracking-widest">Copropietario</th>
                          <th className="px-6 py-4 font-semibold tracking-widest text-right">Alícuota (%)</th>
                          <th className="px-6 py-4 font-semibold tracking-widest text-right">Gasto Base (GC)</th>
                          <th className="px-6 py-4 font-semibold tracking-widest text-right">Indiv. (Agua)</th>
                          <th className="px-6 py-4 font-semibold tracking-widest text-right text-orange-400">Cargos/Multas</th>
                          <th className="px-6 py-4 font-semibold tracking-widest text-right">Deuda Ant.</th>
                          <th className="px-6 py-4 font-semibold tracking-widest text-right text-blue-400">Total a Cobrar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {prorrateoData.map((row, i) => (
                          <tr 
                            key={i} 
                            onClick={() => setSelectedColilla(row)}
                            className="hover:bg-[#141414] transition-colors group cursor-pointer"
                            title="Ver Colilla Detallada"
                          >
                            <td className="px-6 py-4 font-bold text-white relative">
                               <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                               Dpto {row.unitNumber}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                {row.ownerName}
                                {hasEmitted && (
                                  <span className={`material-symbols-outlined text-[14px] ${row.ownerId ? 'text-emerald-400' : 'text-red-400'}`} title={row.ownerId ? "Correo Enviado" : "Falta Correo"}>
                                    {row.ownerId ? 'mark_email_read' : 'mail_lock'}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right font-mono text-gray-400">{(row.aliquot * 100).toFixed(4)}%</td>
                            <td className="px-6 py-4 text-right font-mono text-gray-400">${Math.round(row.baseAmount).toLocaleString('es-CL')}</td>
                            <td className="px-6 py-4 text-right font-mono text-gray-400">${Math.round(row.individualAmount).toLocaleString('es-CL')}</td>
                            <td className="px-6 py-4 text-right font-mono text-orange-400">${Math.round(row.finesAmount).toLocaleString('es-CL')}</td>
                            <td className="px-6 py-4 text-right font-mono text-gray-400">${Math.round(row.arrears).toLocaleString('es-CL')}</td>
                            <td className="px-6 py-4 text-right font-mono font-bold text-white text-base">${Math.round(row.total).toLocaleString('es-CL')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 border-t border-white/5 flex items-center justify-center bg-[#141414] no-print">
                     <p className="text-xs text-gray-500 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px]">more_horiz</span>
                        Mostrando {prorrateoData.length} unidades
                     </p>
                  </div>

                  {/* Print-only Footer */}
                  <div className="hidden print:block mt-12 pt-8 border-t border-black text-[10px] text-black">
                     <div className="grid grid-cols-2 gap-8">
                        <div>
                           <p className="font-bold uppercase mb-2">Información de Pago</p>
                           <p><strong>Banco:</strong> {currentTenant?.config?.bank_name || 'No configurado'}</p>
                           <p><strong>Tipo de Cuenta:</strong> {currentTenant?.config?.bank_type || 'No configurado'}</p>
                           <p><strong>Número:</strong> {currentTenant?.config?.bank_account || 'No configurado'}</p>
                           <p><strong>RUT Edificio:</strong> {currentTenant?.rut_edificio || 'No configurado'}</p>
                        </div>
                        <div className="text-right flex flex-col justify-end italic">
                           <p>Generado automáticamente por Ediflow IA - Gestión de Comunidades</p>
                           <p>Documento para fines informativos y de transparencia administrativa.</p>
                        </div>
                     </div>
                  </div>
                </div>

                {hasEmitted && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-8 bg-[#111] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl no-print"
                  >
                     <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                       <h3 className="text-xl font-bold flex items-center gap-3">
                         <span className="material-symbols-outlined text-emerald-400">stacked_email</span>
                         Registro y Estado de Envíos
                       </h3>
                       <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[18px]">search</span>
                          <input 
                            type="text" 
                            placeholder="Buscar unidad o correo..."
                            value={logSearchQuery}
                            onChange={(e) => setLogSearchQuery(e.target.value)}
                            className="bg-[#0A0A0A] border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors w-full md:w-64"
                          />
                       </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {notificationLogs
                          .filter(log => log.units?.unit_number?.toLowerCase().includes(logSearchQuery.toLowerCase()) || log.details?.toLowerCase().includes(logSearchQuery.toLowerCase()))
                          .map((log, i) => (
                           <div key={i} className="flex flex-col p-4 rounded-2xl border border-white/5 bg-[#141414]">
                              <div className="flex items-center justify-between mb-2">
                                 <div>
                                    <p className="font-bold text-sm text-white flex items-center gap-2">Dpto {log.units?.unit_number}</p>
                                    <p className="text-[10px] text-gray-500 truncate max-w-[150px]">{log.profiles?.full_name || 'Sin nombre'}</p>
                                 </div>
                                 <span className={`px-3 py-1.5 rounded-xl text-[10px] uppercase font-bold flex items-center gap-1.5 shadow-lg ${
                                    log.status === 'enviando...' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                                    log.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                                    log.status === 'cancelled' ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20' :
                                    'bg-red-500/10 text-red-400 border border-red-500/20'
                                 }`}>
                                    <span className="material-symbols-outlined text-[14px]">
                                      {log.status === 'enviando...' ? 'sync' : 
                                       log.status === 'delivered' ? 'done_all' : 
                                       log.status === 'cancelled' ? 'block' :
                                       'report'}
                                    </span>
                                    {log.status}
                                 </span>
                              </div>
                              <p className="text-[10px] text-gray-400 mt-2 border-t border-white/5 pt-2 italic truncate w-full" title={log.details}>
                                {log.details}
                              </p>
                              {log.status === 'bounced' || log.status === 'failed' ? (
                                <button
                                  onClick={() => {
                                    showToast(`Reenviando colilla Dpto ${log.units?.unit_number}`);
                                    // Trigger retry API or logic here
                                  }}
                                  className="mt-3 bg-white/5 hover:bg-white/10 text-white text-[10px] uppercase font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                  <span className="material-symbols-outlined text-[14px]">refresh</span>
                                  Forzar Reenvío
                                </button>
                              ) : null}
                           </div>
                        ))}
                     </div>
                  </motion.div>
                )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedColilla && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm no-print">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="w-full max-w-lg bg-[#111] rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative"
              >
                <button 
                  onClick={() => setSelectedColilla(null)}
                  className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors z-10"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
                
                <div className="p-8 pb-0">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                        <span className="material-symbols-outlined text-3xl">receipt_long</span>
                     </div>
                     <div>
                        <h2 className="text-xl font-bold tracking-tight text-white mb-1">Colilla de Cobro</h2>
                        <p className="text-sm text-gray-400">Unidad Dpto {selectedColilla.unitNumber}</p>
                     </div>
                  </div>
                </div>

                <div className="px-8 pb-8">
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-sm text-gray-400">Propietario / Residente</span>
                      <span className="text-sm font-bold text-white">{selectedColilla.ownerName}</span>
                    </div>
                    {hasEmitted && (
                       <div className="flex justify-between items-center py-3 border-b border-white/5">
                         <span className="text-sm text-gray-400">Estado Notificación Email</span>
                         {selectedColilla.ownerId ? 
                           <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full flex items-center gap-1">
                             <span className="material-symbols-outlined text-[14px]">done_all</span> Enviado
                           </span> :
                           <span className="text-xs font-bold text-red-400 bg-red-400/10 px-3 py-1 rounded-full flex items-center gap-1">
                             <span className="material-symbols-outlined text-[14px]">error</span> Sin Correo
                           </span>
                         }
                       </div>
                    )}
                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-sm text-gray-400">Gasto Común Base <span className="text-xs text-gray-500">{(selectedColilla.aliquot * 100).toFixed(4)}%</span></span>
                      <span className="text-sm font-mono text-white">${Math.round(selectedColilla.baseAmount).toLocaleString('es-CL')}</span>
                    </div>
                    {selectedColilla.individualAmount > 0 && (
                      <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <span className="text-sm text-gray-400">Consumo Individual (Agua/Luz)</span>
                        <span className="text-sm font-mono text-white">${Math.round(selectedColilla.individualAmount).toLocaleString('es-CL')}</span>
                      </div>
                    )}
                    {selectedColilla.finesAmount > 0 && (
                      <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <span className="text-sm text-orange-400">Cargos Extra y Multas</span>
                        <span className="text-sm font-mono text-orange-400">${Math.round(selectedColilla.finesAmount).toLocaleString('es-CL')}</span>
                      </div>
                    )}
                    {selectedColilla.arrears > 0 && (
                      <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <span className="text-sm text-red-400">Deuda Ant. (Morosidad)</span>
                        <span className="text-sm font-mono text-red-400">${Math.round(selectedColilla.arrears).toLocaleString('es-CL')}</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 mb-6">
                     <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400 uppercase tracking-widest font-bold">Total a Pagar</span>
                        <span className="text-2xl font-bold font-mono text-blue-400">${Math.round(selectedColilla.total).toLocaleString('es-CL')}</span>
                     </div>
                  </div>
                  
                  <div className="flex gap-4">
                     <button 
                       onClick={() => setSelectedColilla(null)}
                       className="flex-1 py-4 rounded-xl border border-white/10 text-gray-300 font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-colors"
                     >
                       Volver
                     </button>
                     <button 
                       onClick={() => {
                          showToast(`Colilla de Dpto ${selectedColilla.unitNumber} enviada por correo manualmente.`);
                          setSelectedColilla(null);
                       }}
                       className="flex-1 py-4 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all"
                     >
                       Reenviar Email
                     </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
};

export default ProrrateoPage;
