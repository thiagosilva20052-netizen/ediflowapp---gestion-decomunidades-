import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenName } from '../App';

interface Props {
  navigate: (screen: ScreenName) => void;
}

const ProrrateoPage: React.FC<Props> = ({ navigate }) => {
  const [isCalculated, setIsCalculated] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setIsCalculated(true);
      showToast("Prorrateo calculado según Ley 21.442");
    }, 2500);
  };

  // Mock data for the prorrateo
  const totalEgresos = 4500000;
  const fondoReserva = totalEgresos * 0.05; // 5% reserve
  const totalProrratear = totalEgresos + fondoReserva;

  const prorrateoData = [
    { unit: '101', owner: 'Juan Pérez', aliquot: 1.20, base: totalProrratear * 0.012, agua: 15000, total: (totalProrratear * 0.012) + 15000 },
    { unit: '102', owner: 'María Gómez', aliquot: 1.50, base: totalProrratear * 0.015, agua: 22000, total: (totalProrratear * 0.015) + 22000 },
    { unit: '103', owner: 'Carlos Ruiz', aliquot: 1.10, base: totalProrratear * 0.011, agua: 8000, total: (totalProrratear * 0.011) + 8000 },
    { unit: '104', owner: 'Ana Torres', aliquot: 2.00, base: totalProrratear * 0.020, agua: 35000, total: (totalProrratear * 0.020) + 35000 },
    { unit: '201', owner: 'Luis Silva', aliquot: 1.20, base: totalProrratear * 0.012, agua: 12000, total: (totalProrratear * 0.012) + 12000 },
  ];

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
                     <h3 className="text-3xl font-light tracking-tight text-white">${totalEgresos.toLocaleString('es-CL')}</h3>
                     <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">check_circle</span> 100% Justificado</p>
                  </div>
                  <div className="md:border-l md:border-white/5 md:pl-6">
                     <p className="text-xs text-gray-400 mb-1">Fondo Reserva Ley (5%)</p>
                     <h3 className="text-3xl font-light tracking-tight text-white">+ ${fondoReserva.toLocaleString('es-CL')}</h3>
                     <p className="text-[10px] text-gray-500 mt-1">Obligatorio Ley 21.442</p>
                  </div>
                  <div className="md:border-l md:border-white/5 md:pl-6">
                     <p className="text-xs text-gray-400 mb-1">Total a Prorratear</p>
                     <h3 className="text-3xl font-bold tracking-tight text-blue-400">${totalProrratear.toLocaleString('es-CL')}</h3>
                     <p className="text-[10px] text-gray-500 mt-1">Monto base a dividir</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Action Card: Motor */}
          <div className="lg:col-span-4 bg-[#111] p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10">
               <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 mb-4 shadow-inner">
                  <span className="material-symbols-outlined {isCalculating ? 'animate-spin' : ''}">sync</span>
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
                 <button className="bg-white text-black px-6 py-3 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-gray-100 transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    Emitir Boletas (Abrir Cobranza)
                 </button>
               </div>

               <div className="bg-[#111] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                 <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm text-gray-300">
                     <thead className="text-xs text-gray-500 uppercase bg-[#1A1A1A] border-b border-white/5">
                       <tr>
                         <th className="px-6 py-4 font-semibold tracking-widest">Unidad</th>
                         <th className="px-6 py-4 font-semibold tracking-widest">Copropietario</th>
                         <th className="px-6 py-4 font-semibold tracking-widest text-right">Alícuota (%)</th>
                         <th className="px-6 py-4 font-semibold tracking-widest text-right">Gasto Base (GC)</th>
                         <th className="px-6 py-4 font-semibold tracking-widest text-right">Indiv. (Agua)</th>
                         <th className="px-6 py-4 font-semibold tracking-widest text-right text-blue-400">Total a Cobrar</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                       {prorrateoData.map((row, i) => (
                         <tr key={i} className="hover:bg-[#141414] transition-colors group">
                           <td className="px-6 py-4 font-bold text-white relative">
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              {row.unit}
                           </td>
                           <td className="px-6 py-4">{row.owner}</td>
                           <td className="px-6 py-4 text-right font-mono text-gray-400">{row.aliquot.toFixed(4)}%</td>
                           <td className="px-6 py-4 text-right font-mono text-gray-400">${row.base.toLocaleString('es-CL')}</td>
                           <td className="px-6 py-4 text-right font-mono text-gray-400">${row.agua.toLocaleString('es-CL')}</td>
                           <td className="px-6 py-4 text-right font-mono font-bold text-white text-base">${row.total.toLocaleString('es-CL')}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
                 <div className="p-4 border-t border-white/5 flex items-center justify-center bg-[#141414]">
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                       <span className="material-symbols-outlined text-[14px]">more_horiz</span>
                       Mostrando 5 de 150 unidades
                    </p>
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
};

export default ProrrateoPage;
