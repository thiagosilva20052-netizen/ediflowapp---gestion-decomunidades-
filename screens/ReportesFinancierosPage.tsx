import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenName } from '../App';

interface Props {
  navigate: (screen: ScreenName) => void;
}

const ReportesFinancierosPage: React.FC<Props> = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState<'Balance' | 'Reserva' | 'Presupuesto'>('Balance');
  const [isExporting, setIsExporting] = useState(false);
  const [isConfiguringBudget, setIsConfiguringBudget] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [presupuestoItems, setPresupuestoItems] = useState([
    { categoria: 'Remuneraciones y RRHH', monto: 20000000 },
    { categoria: 'Servicios Básicos (Agua, Luz)', monto: 8000000 },
    { categoria: 'Mantenciones Menores', monto: 5000000 },
    { categoria: 'Mantenciones Preventivas (Ascensores, Bombas)', monto: 1500000 },
    { categoria: 'Insumos y Limpieza', monto: 2500000 },
  ]);

  const toggleBudgetConfig = () => setIsConfiguringBudget(!isConfiguringBudget);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 2000);
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
                Transparencia y Comité
              </p>
            </div>
        </div>
        <button 
           onClick={handleExport}
           className="bg-white/10 text-white px-6 py-4 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center gap-2 shadow-lg active:scale-95 md:w-auto"
        >
           {isExporting ? <span className="material-symbols-outlined animate-spin">refresh</span> : <span className="material-symbols-outlined">download</span>}
           Exportar a Excel
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-6 md:px-12 py-10 max-w-7xl mx-auto w-full space-y-10">
        
        {/* Action Tabs */}
        <div className="flex gap-4 mb-4 border-b border-white/10 pb-4 overflow-x-auto hide-scrollbar">
           {['Balance', 'Reserva', 'Presupuesto'].map((tab) => (
             <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-white text-black' 
                    : 'bg-[#111] text-gray-400 hover:text-white border border-white/5 hover:border-white/10'
                }`}
             >
                {tab === 'Balance' ? 'Balance Mensual' : tab === 'Reserva' ? 'Fondo de Reserva' : 'Presupuesto vs Real'}
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
                 {/* KPI Summary */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2 flex items-center gap-2">Ingresos Mes</p>
                        <h3 className="text-4xl text-emerald-400 font-light tracking-tight mt-1">$4.200.000</h3>
                        <p className="text-[10px] text-emerald-500 mt-2 font-bold">+15% v/s mes anterior</p>
                    </div>
                    <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2 flex items-center gap-2">Egresos Mes</p>
                        <h3 className="text-4xl text-red-400 font-light tracking-tight mt-1">$3.950.000</h3>
                        <p className="text-[10px] text-gray-500 mt-2 font-bold">-2% v/s mes anterior</p>
                    </div>
                    <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2 flex items-center gap-2">Flujo Neto</p>
                        <h3 className="text-4xl text-white font-light tracking-tight mt-1">$250.000</h3>
                        <p className="text-[10px] text-gray-500 mt-2 font-bold">A favor</p>
                    </div>
                 </div>

                 {/* Detailed Breakdown */}
                 <div className="bg-[#111] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl p-8">
                     <h3 className="text-xl font-bold text-white mb-6">Desglose de Egresos</h3>
                     <div className="space-y-4">
                         {[
                             { name: 'Remuneraciones y Leyes Sociales', amount: 1800000, percent: 45 },
                             { name: 'Mantención Ascensores (Schindler)', amount: 450000, percent: 11 },
                             { name: 'Consumo Agua (Aguas Andinas)', amount: 600000, percent: 15 },
                             { name: 'Consumo Luz Áreas Comunes (Enel)', amount: 400000, percent: 10 },
                             { name: 'Limpieza e Insumos', amount: 200000, percent: 5 },
                             { name: 'Seguros Espacios Comunes', amount: 500000, percent: 13 },
                         ].map((item, idx) => (
                             <div key={idx} className="flex flex-col gap-2">
                                 <div className="flex justify-between items-center text-sm font-medium">
                                     <span className="text-gray-300">{item.name}</span>
                                     <span className="text-white">${item.amount.toLocaleString()}</span>
                                 </div>
                                 <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden flex">
                                     <div className="bg-ediflow-primary h-full rounded-full" style={{ width: `${item.percent}%` }}></div>
                                 </div>
                             </div>
                         ))}
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
                     <h3 className="text-5xl text-white font-light tracking-tight mt-1">$1.650.000</h3>
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
                        <tr className="hover:bg-[#141414] transition-colors">
                            <td className="px-6 py-4 text-xs font-mono text-gray-500">01-04-2026</td>
                            <td className="px-6 py-4 font-medium text-white">Aporte mensual (Recaudación Prorrateo Marzo)</td>
                            <td className="px-6 py-4 text-right font-mono text-emerald-400">+ $220.000</td>
                        </tr>
                        <tr className="hover:bg-[#141414] transition-colors">
                            <td className="px-6 py-4 text-xs font-mono text-gray-500">15-03-2026</td>
                            <td className="px-6 py-4 font-medium text-white">Reparación bomba de agua de emergencia</td>
                            <td className="px-6 py-4 text-right font-mono text-red-400">- $450.000</td>
                        </tr>
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
