import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenName } from '../App';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useAppContext } from '../src/context/AppContext';
import { supabase } from '../src/lib/supabase-client';

interface Props {
  navigate: (screen: ScreenName) => void;
}

const COLORS = ['#10B981', '#F59E0B', '#F97316', '#EF4444'];

const ReportesFinancierosPage: React.FC<Props> = ({ navigate }) => {
  const { currentTenant } = useAppContext();
  const [activeTab, setActiveTab] = useState<'Balance' | 'Reserva' | 'Presupuesto' | 'Libro de Banco'>('Balance');
  const [isExporting, setIsExporting] = useState(false);
  const [isConfiguringBudget, setIsConfiguringBudget] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const [presupuestoItems, setPresupuestoItems] = useState([
    { categoria: 'Remuneraciones y RRHH', monto: 20000000 },
    { categoria: 'Servicios Básicos (Agua, Luz)', monto: 8000000 },
    { categoria: 'Mantenciones Menores', monto: 5000000 },
    { categoria: 'Mantenciones Preventivas (Ascensores, Bombas)', monto: 1500000 },
    { categoria: 'Insumos y Limpieza', monto: 2500000 },
  ]);

  // --- Real data fetching ---
  const [balanceData, setBalanceData] = useState<any[]>([]);
  const [morosidadData, setMorosidadData] = useState<any[]>([]);
  const [kpis, setKpis] = useState({ recaudado: 0, totalCobrar: 0, egresos: 0, fondoReserva: 0 });
  const [libroBanco, setLibroBanco] = useState<any[]>([]);
  const [movimientosFondo, setMovimientosFondo] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentTenant) return;
    fetchAllData();
  }, [currentTenant]);

  const fetchAllData = async () => {
    if (!currentTenant) return;
    setLoading(true);
    const now = new Date();
    const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    try {
      // 1. Ingresos: transacciones success del mes
      const { data: ingresosData } = await supabase
        .from('transactions')
        .select('amount, created_at')
        .eq('tenant_id', currentTenant.id)
        .eq('status', 'success');

      // 2. Egresos: gastos del mes
      const { data: egresosData } = await supabase
        .from('expenses')
        .select('amount, expense_date, provider_name, category, is_reserve_fund_expense, created_at')
        .eq('tenant_id', currentTenant.id);

      // 3. Common expenses: lo que se debe cobrar este periodo
      const { data: commonExpenses } = await supabase
        .from('common_expenses')
        .select('total_amount, unit_id, period')
        .eq('tenant_id', currentTenant.id)
        .eq('period', currentPeriod);

      // 4. Unidades
      const { data: units } = await supabase
        .from('units')
        .select('id, unit_number')
        .eq('tenant_id', currentTenant.id);

      // --- Calculate KPIs ---
      const totalIngresos = ingresosData?.reduce((s: number, t: any) => s + Number(t.amount), 0) || 0;
      const totalEgresos = egresosData?.reduce((s: number, e: any) => s + Number(e.amount), 0) || 0;
      const totalCobrar = commonExpenses?.reduce((s: number, ce: any) => s + Number(ce.total_amount), 0) || 0;

      // Fondo de reserva: 5% según Ley 21.442
      const fondoReservaTotal = commonExpenses?.reduce((s: number, ce: any) => s + Number(ce.total_amount) * 0.05, 0) || 0;

      // Movimientos del fondo de reserva
      const reservaMoves = (egresosData || [])
        .filter((e: any) => e.is_reserve_fund_expense)
        .map((e: any) => ({
          date: new Date(e.expense_date || e.created_at).toLocaleDateString('es-CL'),
          description: e.provider_name || 'Gasto fondo de reserva',
          amount: Number(e.amount),
          type: 'egreso'
        }));
      // Aportes al fondo (5% de cada periodo)
      if (commonExpenses) {
        reservaMoves.push({
          date: `01-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`,
          description: `Aporte mensual (Recaudación Prorrateo periodo ${currentPeriod})`,
          amount: fondoReservaTotal,
          type: 'aporte'
        });
      }
      setMovimientosFondo(reservaMoves);

      setKpis({
        recaudado: totalIngresos,
        totalCobrar: totalCobrar > 0 ? totalCobrar : totalIngresos + totalEgresos, // fallback si no hay common_expenses
        egresos: totalEgresos,
        fondoReserva: fondoReservaTotal,
      });

      // --- Balance chart: aggregate by day ---
      const balanceMap: Record<string, any> = {};
      (ingresosData || []).forEach((t: any) => {
        const day = new Date(t.created_at).getDate().toString();
        if (!balanceMap[day]) balanceMap[day] = { name: day, ingresos: 0, egresos: 0 };
        balanceMap[day].ingresos += Number(t.amount);
      });
      (egresosData || []).forEach((e: any) => {
        const day = new Date(e.expense_date || e.created_at).getDate().toString();
        if (!balanceMap[day]) balanceMap[day] = { name: day, ingresos: 0, egresos: 0 };
        balanceMap[day].egresos += Number(e.amount);
      });
      const sorted = Object.values(balanceMap).sort((a: any, b: any) => parseInt(a.name) - parseInt(b.name));
      // Cumulative
      let cumIng = 0, cumEgr = 0;
      const cumulative = sorted.map((d: any) => {
        cumIng += d.ingresos;
        cumEgr += d.egresos;
        return { name: d.name, ingresos: cumIng, egresos: cumEgr };
      });
      setBalanceData(cumulative.length > 0 ? cumulative : [{ name: '0', ingresos: 0, egresos: 0 }]);

      // --- Morosidad: compare common_expenses vs transactions paid ---
      const unitMap: Record<string, string> = {};
      (units || []).forEach((u: any) => { unitMap[u.id] = u.unit_number; });

      const paidUnits = new Set(
        (ingresosData || []).map((t: any) => t.unit_id).filter(Boolean)
      );

      let alDia = 0, rango1 = 0, rango2 = 0, rango3 = 0;
      (commonExpenses || []).forEach((ce: any) => {
        if (paidUnits.has(ce.unit_id)) {
          alDia++;
        } else {
          // Simplified: all unpaid fall into 1-30 for now
          rango1++;
        }
      });

      const totalUnits = alDia + rango1 + rango2 + rango3;
      const morosidad = [
        { name: 'Al Día', value: totalUnits > 0 ? Math.round((alDia / totalUnits) * 100) : 100, color: COLORS[0] },
        { name: '1-30 días', value: totalUnits > 0 ? Math.round((rango1 / totalUnits) * 100) : 0, color: COLORS[1] },
        { name: '31-60 días', value: totalUnits > 0 ? Math.round((rango2 / totalUnits) * 100) : 0, color: COLORS[2] },
        { name: '60+ días', value: totalUnits > 0 ? Math.round((rango3 / totalUnits) * 100) : 0, color: COLORS[3] },
      ];
      setMorosidadData(morosidad);

      // --- Libro de Banco: merge transactions + expenses ordered by date ---
      const entries: any[] = [];
      let runningBalance = 0;
      (ingresosData || []).forEach((t: any) => {
        entries.push({
          date: new Date(t.created_at).toLocaleDateString('es-CL'),
          voucher: `DEP-${t.id?.slice(0, 4) || '0000'}`,
          description: 'Recaudación GC',
          ingreso: Number(t.amount),
          egreso: null,
        });
      });
      (egresosData || []).forEach((e: any) => {
        entries.push({
          date: new Date(e.expense_date || e.created_at).toLocaleDateString('es-CL'),
          voucher: `ING-${e.id?.slice(0, 4) || '0000'}`,
          description: e.provider_name || e.category || 'Egreso',
          ingreso: null,
          egreso: Number(e.amount),
        });
      });
      entries.sort((a, b) => new Date(b.date.split('-').reverse().join('-')).getTime() - new Date(a.date.split('-').reverse().join('-')).getTime());
      entries.forEach((e) => {
        runningBalance += (e.ingreso || 0) - (e.egreso || 0);
        e.balance = runningBalance;
      });
      setLibroBanco(entries);

    } catch (err) {
      console.error('Error fetching report data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#050505',
        logging: false,
        useCORS: true
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Add Legal DocHash overlay on the bottom right or left
      const docHash = Math.random().toString(36).substring(2, 10).toUpperCase();
      pdf.setFontSize(8);
      pdf.setTextColor(150);
      pdf.text(`DocHash: ${docHash}`, 10, pdf.internal.pageSize.getHeight() - 5);
      
      pdf.save(`Reporte_Financiero_${currentTenant?.name || 'Edificio'}.pdf`);

      // 1. Trazabilidad de Rendición
      try {
        const { data: user } = await supabase.auth.getUser();
        if (user?.user && currentTenant?.id) {
          await supabase.from('audit_logs').insert({
            tenant_id: currentTenant.id,
            user_id: user.user.id,
            action: 'Reporte Financiero',
            details: `Rendición de Cuentas generada - Hash: ${docHash}`,
            module: 'Finanzas',
            severity: 'info'
          });
        }
      } catch (err) {
        console.error("Error logging audit:", err);
      }

      showToast('Documento PDF exportado correctamente.');
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast('Error al exportar PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white font-sans overflow-hidden relative">
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-12 left-1/2 z-50 bg-ediflow-primary text-black px-6 py-3 rounded-full shadow-[0_0_20px_rgba(0,174,239,0.4)] font-bold text-sm flex items-center gap-2 whitespace-nowrap"
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
              className="w-12 h-12 rounded-[1rem] bg-[#111] border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all shadow-lg"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Reportes Financieros</h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px]">query_stats</span>
                {currentTenant?.name || 'Comunidad'} - RUT: {currentTenant?.rut_edificio || 'Sin RUT'}
              </p>
            </div>
        </div>
        <button 
           onClick={handleExportPDF}
           className="bg-white/10 text-white px-6 py-4 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center gap-2 shadow-lg active:scale-95 md:w-auto"
        >
           {isExporting ? <span className="material-symbols-outlined animate-spin">refresh</span> : <span className="material-symbols-outlined">download</span>}
           Exportar a PDF
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-6 md:px-12 py-10 max-w-7xl mx-auto w-full space-y-10" ref={reportRef}>
        
        {/* Action Tabs */}
        <div className="flex gap-4 mb-4 border-b border-white/10 pb-4 overflow-x-auto hide-scrollbar">
           {['Balance', 'Reserva', 'Libro de Banco', 'Presupuesto'].map((tab) => (
             <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-white text-black' 
                    : 'bg-[#111] text-gray-400 hover:text-white border border-white/5 hover:border-white/10'
                }`}
             >
                {tab === 'Balance' ? 'Balance Mensual' : tab === 'Reserva' ? 'Fondo de Reserva' : tab === 'Libro de Banco' ? 'Libro de Banco' : 'Presupuesto vs Real'}
             </button>
           ))}
        </div>

        <AnimatePresence mode="wait">
           {activeTab === 'Balance' && (
             <motion.div 
               key="balance"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="space-y-6"
             >
                 {/* Termómetro Recaudación */}
                 <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                     <div className="flex justify-between items-end mb-4">
                        <div>
                           <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-1 flex items-center gap-2">Termómetro de Recaudación</p>
                           <h3 className="text-4xl text-emerald-400 font-light tracking-tight mt-1">${kpis.recaudado.toLocaleString("es-CL")} <span className="text-xl text-gray-500">/ ${kpis.totalCobrar.toLocaleString("es-CL")}</span></h3>
                        </div>
                        <div className="text-right">
                           <p className="text-3xl text-white font-light tracking-tight">{kpis.totalCobrar > 0 ? Math.round((kpis.recaudado / kpis.totalCobrar) * 100) : 0}%</p>
                           <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest">Recaudado</p>
                        </div>
                     </div>
                     <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden flex relative">
                        <div className="bg-emerald-400 h-full rounded-full absolute left-0 top-0 transition-all duration-1000" style={{ width: (kpis.totalCobrar > 0 ? Math.round((kpis.recaudado / kpis.totalCobrar) * 100) : 0) + '%' }}></div>
                     </div>
                     <p className="text-xs text-gray-400 mt-4 font-medium flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-red-400"></span> Por recaudar: {(kpis.totalCobrar - kpis.recaudado).toLocaleString("es-CL")} ({(kpis.totalCobrar > 0 ? Math.round(((kpis.totalCobrar - kpis.recaudado) / kpis.totalCobrar) * 100) : 0)}%)
                     </p>
                 </div>

                 {/* KPI Summary */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2 flex items-center gap-2">Egresos Mes</p>
                        <h3 className="text-4xl text-red-400 font-light tracking-tight mt-1">${kpis.egresos.toLocaleString("es-CL")}</h3>
                        <p className="text-[10px] text-gray-500 mt-2 font-bold">-2% v/s mes anterior</p>
                    </div>
                    <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2 flex items-center gap-2">Flujo Neto</p>
                        <h3 className="text-4xl text-white font-light tracking-tight mt-1">${(kpis.recaudado - kpis.egresos).toLocaleString("es-CL")}</h3>
                        <p className="text-[10px] text-gray-500 mt-2 font-bold">{kpis.recaudado - kpis.egresos >= 0 ? "A favor" : "En contra"}</p>
                    </div>
                 </div>

                 {/* Charts Grid */}
                 <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
                    {/* Balance Chart */}
                    <div className="xl:col-span-2 bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                       <h3 className="text-xl font-bold text-white mb-2">Curva de Liquidez</h3>
                       <p className="text-xs text-gray-400 mb-6">Progresión de Ingresos Conciliados vs Egresos Pagados en el mes actual.</p>
                       <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                             <AreaChart data={balanceData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                               <defs>
                                 <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#00AEEF" stopOpacity={0.4}/>
                                   <stop offset="95%" stopColor="#00AEEF" stopOpacity={0}/>
                                 </linearGradient>
                                 <linearGradient id="colorEgresos" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                                   <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                                 </linearGradient>
                               </defs>
                               <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                               <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                               <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000000}M`} />
                               <RechartsTooltip 
                                 contentStyle={{ backgroundColor: '#141414', border: '1px solid #ffffff10', borderRadius: '1rem', color: '#fff' }}
                                 itemStyle={{ fontSize: '14px', fontWeight: 'bold' }}
                                 formatter={(value) => [`$${Number(value).toLocaleString('es-CL')}`, '']}
                               />
                               <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} iconType="circle" />
                               <Area type="monotone" dataKey="ingresos" name="Ingresos Conciliados" stroke="#00AEEF" strokeWidth={3} fillOpacity={1} fill="url(#colorIngresos)" />
                               <Area type="monotone" dataKey="egresos" name="Egresos Pagados" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorEgresos)" />
                             </AreaChart>
                          </ResponsiveContainer>
                       </div>
                    </div>

                    {/* Morosidad Pie Chart */}
                    <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl flex flex-col">
                       <h3 className="text-xl font-bold text-white mb-2">Estado de Cartera</h3>
                       <p className="text-xs text-gray-400 mb-6">Distribución de Deuda (Morosidad).</p>
                       <div className="h-[200px] w-full flex-shrink-0">
                          <ResponsiveContainer width="100%" height="100%">
                             <PieChart>
                               <Pie
                                 data={morosidadData}
                                 cx="50%"
                                 cy="50%"
                                 innerRadius={60}
                                 outerRadius={80}
                                 paddingAngle={5}
                                 dataKey="value"
                                 stroke="none"
                               >
                                 {morosidadData.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={entry.color} />
                                 ))}
                               </Pie>
                               <RechartsTooltip 
                                 contentStyle={{ backgroundColor: '#141414', border: '1px solid #ffffff10', borderRadius: '1rem', color: '#fff' }}
                                 formatter={(value) => [`${value}%`, 'Porcentaje']}
                               />
                             </PieChart>
                          </ResponsiveContainer>
                       </div>
                       
                       <div className="flex-1 mt-6 space-y-4">
                          {morosidadData.map((entry, index) => (
                             <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                   <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
                                   <span className="text-sm text-gray-300">{entry.name}</span>
                                </div>
                                <span className="text-sm text-white font-bold">{entry.value}%</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
             </motion.div>
           )}

           {activeTab === 'Reserva' && (
             <motion.div 
               key="reserva"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="space-y-6"
             >
                 <div className="bg-gradient-to-br from-[#008080]/20 to-[#111] p-10 rounded-[2.5rem] border border-[#008080]/30 shadow-2xl relative overflow-hidden">
                     <p className="text-[10px] text-[#008080] font-bold uppercase tracking-widest mb-2">Total Fondo de Reserva</p>
                     <h3 className="text-5xl text-white font-light tracking-tight mt-1">${kpis.fondoReserva.toLocaleString("es-CL")}</h3>
                     <p className="text-xs text-gray-400 mt-4 leading-relaxed max-w-xl">
                         Fondo obligatorio destinado a reparaciones urgentes e imprevistos (Art. 7 Ley 21.442). No puede ser utilizado para pago de gastos comunes ordinarios.
                     </p>
                 </div>

                 <div className="bg-[#111] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                     <div className="p-6 border-b border-white/5">
                         <h3 className="text-lg font-bold text-white">Movimientos del Fondo</h3>
                     </div>
                     <table className="w-full text-left text-sm text-gray-300">
                      <thead className="text-[10px] text-gray-500 uppercase bg-[#1A1A1A] border-b border-white/5 tracking-widest font-bold">
                        <tr>
                          <th className="px-6 py-4">Fecha</th>
                          <th className="px-6 py-4">Descripción</th>
                          <th className="px-6 py-4 text-right">Monto</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {movimientosFondo.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="px-6 py-8 text-center text-gray-500 text-xs">
                              Sin movimientos en el fondo de reserva
                            </td>
                          </tr>
                        ) : (
                          movimientosFondo.map((m, i) => (
                            <tr key={i} className="hover:bg-[#141414] transition-colors">
                              <td className="px-6 py-4 text-xs font-mono text-gray-500">{m.date}</td>
                              <td className="px-6 py-4 font-medium text-white">{m.description}</td>
                              <td className={`px-6 py-4 text-right font-mono ${m.type === 'aporte' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {m.type === 'aporte' ? '+ ' : '- '}${m.amount.toLocaleString("es-CL")}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                     </table>
                 </div>
             </motion.div>
           )}

           {activeTab === 'Libro de Banco' && (
             <motion.div 
               key="libroBanco"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="space-y-6"
             >
                 <div className="bg-[#111] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                     <div className="p-6 border-b border-white/5 flex items-center justify-between">
                         <div className="flex items-start gap-3">
                             <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-white shrink-0">
                                <span className="material-symbols-outlined">account_balance</span>
                             </div>
                             <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-lg font-bold text-white">Libro de Banco</h3>
                                  <div className="group/tt relative">
                                    <button className="w-5 h-5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center mt-0.5">
                                      <span className="material-symbols-outlined text-[12px]">info</span>
                                    </button>
                                    <div className="absolute left-0 top-7 w-64 p-3 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover/tt:opacity-100 group-hover/tt:visible transition-all z-20 text-[10px] text-gray-300 leading-relaxed font-mono font-normal">
                                      Este reporte consolida en tiempo real todos los ingresos (recaudación validada) y egresos (pagos realizados a proveedores y sueldos), simulando la cartola bancaria del condominio para ofrecer transparencia total.
                                    </div>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Cruce de Ingresos Conciliados vs Egresos Pagados</p>
                             </div>
                         </div>
                     </div>
                     <table className="w-full text-left text-sm text-gray-300">
                      <thead className="text-[10px] text-gray-500 uppercase bg-[#1A1A1A] border-b border-white/5 tracking-widest font-bold">
                        <tr>
                          <th className="px-6 py-4">Fecha</th>
                          <th className="px-6 py-4">Comprobante</th>
                          <th className="px-6 py-4">Descripción</th>
                          <th className="px-6 py-4 text-emerald-400 text-right">Ingresos</th>
                          <th className="px-6 py-4 text-red-400 text-right">Egresos</th>
                          <th className="px-6 py-4 text-right">Saldo Final</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {libroBanco.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500 text-xs">
                              Sin movimientos bancarios registrados
                            </td>
                          </tr>
                        ) : (
                          libroBanco.map((e, i) => (
                            <tr key={i} className="hover:bg-[#141414] transition-colors">
                              <td className="px-6 py-4 text-xs font-mono text-gray-500">{e.date}</td>
                              <td className="px-6 py-4"><span className="bg-white/5 px-2 py-1 rounded text-xs font-mono border border-white/10">{e.voucher}</span></td>
                              <td className="px-6 py-4 font-medium text-white max-w-[200px] truncate">{e.description}</td>
                              <td className="px-6 py-4 text-right font-mono text-white">{e.ingreso ? `+ $${e.ingreso.toLocaleString("es-CL")}` : ''}</td>
                              <td className="px-6 py-4 text-right font-mono text-white">{e.egreso ? `- $${e.egreso.toLocaleString("es-CL")}` : ''}</td>
                              <td className={`px-6 py-4 text-right font-mono font-bold ${e.balance >= 0 ? 'text-ediflow-primary' : 'text-red-400'}`}>${e.balance.toLocaleString("es-CL")}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                     </table>
                 </div>
             </motion.div>
           )}

           {activeTab === 'Presupuesto' && (
             <motion.div 
               key="presupuesto"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
             >
               {!isConfiguringBudget ? (
                 <div className="bg-[#111] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl p-16 text-center">
                   <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 text-gray-400">
                       <span className="material-symbols-outlined text-[48px]">trending_up</span>
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-2">Presupuesto Anual</h3>
                   <p className="text-gray-500 text-sm max-w-md mx-auto">
                       Define un presupuesto anual para controlar las desviaciones del Gasto Común y mantener informada a la asamblea.
                   </p>
                   <button 
                     onClick={toggleBudgetConfig}
                     className="mt-8 bg-white/10 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all text-sm"
                   >
                       Configurar Presupuesto 2026
                   </button>
                 </div>
               ) : (
                 <div className="bg-[#111] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl p-8 lg:p-12">
                    <div className="flex justify-between items-center mb-8">
                       <div>
                          <h3 className="text-2xl font-bold text-white tracking-tight">Presupuesto 2026 Estimado</h3>
                          <p className="text-gray-500 text-sm mt-1">Valores anuales proyectados para el control del gasto común.</p>
                       </div>
                       <button onClick={toggleBudgetConfig} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                          <span className="material-symbols-outlined">close</span>
                       </button>
                    </div>

                    {/* AI Suggestion */}
                    <div className="bg-ediflow-primary/10 border border-ediflow-primary/20 rounded-2xl p-6 mb-8 flex items-start gap-4">
                       <span className="material-symbols-outlined text-ediflow-primary">smart_toy</span>
                       <div>
                          <h4 className="text-sm font-bold text-ediflow-primary mb-1">AI Flow: Proyección Sugerida</h4>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            Basado en el histórico del año anterior y un reajuste inflacionario del <strong className="text-white">4.5%</strong>, hemos proyectado el presupuesto base anual. Puedes ajustar cada línea de cuenta según las cotizaciones actuales de la comunidad.
                          </p>
                       </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      {presupuestoItems.map((item, idx) => (
                        <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                           <span className="text-sm font-medium text-white">{item.categoria}</span>
                           <div className="flex items-center gap-2">
                             <span className="text-gray-500">$</span>
                             <input 
                               type="number"
                               value={item.monto}
                               onChange={(e) => {
                                 const newItems = [...presupuestoItems];
                                 newItems[idx].monto = parseInt(e.target.value) || 0;
                                 setPresupuestoItems(newItems);
                               }}
                               className="bg-[#0A0A0A] border border-white/10 text-white font-mono text-sm px-4 py-2 rounded-lg focus:outline-none focus:border-ediflow-primary/50 text-right w-40"
                             />
                           </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-white/10 gap-6">
                       <div>
                         <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Anual Proyectado</p>
                         <h4 className="text-3xl text-white font-light mt-1">
                           ${presupuestoItems.reduce((acc, curr) => acc + curr.monto, 0).toLocaleString()}
                         </h4>
                       </div>
                       <button onClick={() => {
                          setIsConfiguringBudget(false);
                          showToast('Presupuesto Anual 2026 configurado exitosamente.');
                       }} className="w-full md:w-auto bg-ediflow-primary px-8 py-4 rounded-xl text-black font-bold text-sm shadow-[0_0_20px_rgba(0,174,239,0.3)] hover:bg-white transition-all active:scale-95">
                         Guardar Presupuesto
                       </button>
                    </div>
                 </div>
               )}
             </motion.div>
           )}
        </AnimatePresence>

      </main>
    </div>
  );
};

export default ReportesFinancierosPage;
