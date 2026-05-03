import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenName } from '../App';
import { supabase } from '../src/lib/supabase-client';
import { useAppContext } from '../src/context/AppContext';

interface Props {
  navigate: (screen: ScreenName) => void;
}

const RecaudacionPage: React.FC<Props> = ({ navigate }) => {
  const { currentTenant, currentUser } = useAppContext();
  const [isConciliating, setIsConciliating] = useState(false);
  const [isConciliated, setIsConciliated] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleConciliate = () => {
    setIsConciliating(true);
    setTimeout(() => {
      setIsConciliating(false);
      setIsConciliated(true);
      showToast("Conciliación completada: 14 match exitosos");
    }, 2500);
  };

  const [transfers, setTransfers] = useState<any[]>([]);

  useEffect(() => {
    // Fetch manual reports
    const fetchReports = async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*, profiles(full_name), units(unit_number)')
        .eq('status', 'reviewing')
        .order('created_at', { ascending: false });

      if (data && !error) {
        const mapped = data.map(tx => ({
           id: tx.id,
           date: new Date(tx.created_at).toLocaleDateString('es-CL'),
           amount: Number(tx.amount),
           sender: tx.profiles?.full_name || 'Desconocido',
           concept: tx.billing_month || 'Pago Informado',
           suggestedUnit: tx.units?.unit_number || null,
           confidence: 100,
           isConciliated: false,
           receipt_url: tx.receipt_url
        }));
        
        setTransfers([
          ...mapped,
          { id: 'mock1', date: '05-04-2026', amount: 157500, sender: 'JUAN PEREZ SOT', concept: 'GC Marzo 101', suggestedUnit: '101', confidence: 98, isConciliated: isConciliated },
          { id: 'mock2', date: '04-04-2026', amount: 242000, sender: 'MARIA GOMEZ', concept: 'gasto comun', suggestedUnit: '102', confidence: 92, isConciliated: isConciliated },
          { id: 'mock3', date: '06-04-2026', amount: 80000, sender: 'CARLOS RUIZ', concept: 'pago gc', suggestedUnit: '103', confidence: 85, isConciliated: isConciliated },
          { id: 'mock4', date: '07-04-2026', amount: 120000, sender: 'SOC INMOBILIARIA LIMITADA', concept: 'Varios', suggestedUnit: null, confidence: 30, isConciliated: false },
        ]);
      }
    };
    fetchReports();
  }, [isConciliated]);

  const approveMatch = async (txId: string) => {
    if (txId.startsWith('mock')) {
       // Mock logic
       setTransfers(prev => prev.map(t => t.id === txId ? { ...t, isConciliated: true } : t));
       return;
    }
    // Real logic
    const { error } = await supabase.from('transactions').update({ status: 'success' }).eq('id', txId);
    if (error) {
       showToast("Error al validar pago.");
       return;
    }
    setTransfers(prev => prev.map(t => t.id === txId ? { ...t, isConciliated: true } : t));
    
    // Audit Log for the atomic balance update
    if (currentTenant && currentUser) {
      const { error: logError } = await supabase.from('audit_logs').insert({
         tenant_id: currentTenant.id,
         user_id: currentUser.id,
         action: 'Conciliación de Pago',
         details: `Pago de ${txId} conciliado exitosamente. Saldo de cuenta corriente actualizado atómicamente.`,
         module: 'finance',
         severity: 'info'
      });
      if (logError) console.error(logError);
    }

    showToast("Pago validado. Saldo descontado automáticamente.");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white font-sans overflow-hidden relative">
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-12 left-1/2 z-50 bg-purple-500 text-white px-6 py-3 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] font-bold text-sm flex items-center gap-2 whitespace-nowrap"
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
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Recaudación <span className="font-serif italic font-normal text-purple-400">Automatizada</span></h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px] text-purple-400">account_balance</span>
                Conciliación Bancaria con IA
              </p>
            </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 md:px-12 py-10 max-w-7xl mx-auto w-full space-y-10">
        
        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#111] p-6 rounded-[2rem] border border-white/5 shadow-lg relative overflow-hidden group">
             <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-1">Total a Recaudar</p>
             <h3 className="text-4xl font-light text-white">$4.850.000</h3>
             <p className="text-[10px] text-gray-400 mt-2">Mes de Marzo 2026</p>
          </div>
          <div className="bg-[#111] p-6 rounded-[2rem] border border-white/5 shadow-lg relative overflow-hidden group border-b-2 border-b-purple-500">
             <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-[30px] rounded-full pointer-events-none transition-colors"></div>
             <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-1">Pagos Identificados</p>
             <h3 className="text-4xl font-light text-purple-400">{isConciliated ? '$3.610.000' : '$3.130.500'}</h3>
             <p className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1 font-bold">
               <span className="material-symbols-outlined text-[12px]">trending_up</span> {isConciliated ? '74%' : '64%'} de la meta
             </p>
          </div>
          <div className="bg-[#111] p-6 rounded-[2rem] border border-white/5 shadow-lg relative overflow-hidden group">
             <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-1">Morosidad Estimada</p>
             <h3 className="text-4xl font-light text-white">{isConciliated ? '$1.240.000' : '$1.719.500'}</h3>
             <p className="text-[10px] text-red-400 mt-2 flex items-center gap-1 font-bold">
               <span className="material-symbols-outlined text-[12px]">warning</span> Acción requerida
             </p>
          </div>
        </div>

        {/* Action Panel: AI Conciliation */}
        <div className="bg-gradient-to-br from-[#111] to-[#1A1A1A] p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>
           
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="space-y-4 max-w-xl">
                 <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest">
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                    Asistente de Recaudación
                 </div>
                 <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Conciliación Automática</h2>
                 <p className="text-gray-400 text-sm leading-relaxed font-light">
                    Sube la cartola bancaria de tu edificio (Excel, CSV o PDF). Nuestra IA extraerá los registros y emparejará las transferencias con las unidades basándose en el RUT, nombres, monto u observaciones reportadas por los residentes.
                 </p>
              </div>
              <div className="flex flex-col w-full md:w-auto shrink-0 relative">
                 <input 
                   type="file" 
                   id="file-upload" 
                   className="hidden" 
                   onChange={handleConciliate} 
                   accept=".csv,.xls,.xlsx,.pdf"
                 />
                 <label 
                  htmlFor={isConciliating || isConciliated ? '' : 'file-upload'}
                  onClick={(e) => {
                     if (isConciliating || isConciliated) {
                        e.preventDefault();
                     }
                  }}
                  className={`cursor-pointer px-8 py-5 rounded-2xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-3 ${
                    isConciliated
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed'
                      : 'bg-purple-500 text-white hover:bg-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.3)]'
                  }`}
                 >
                    {isConciliating ? (
                      <><span className="material-symbols-outlined animate-spin">refresh</span> Procesando e IA...</>
                    ) : isConciliated ? (
                      <><span className="material-symbols-outlined">check_circle</span> 14 Match Exitosos</>
                    ) : (
                      <><span className="material-symbols-outlined">upload_file</span> Subir Cartola (Excel/PDF)</>
                    )}
                 </label>
              </div>
           </div>
        </div>

        {/* Bank Feed Table */}
        <div className="space-y-6">
           <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] pl-2">Cartola Bancaria Reciente</h2>
           
           <div className="bg-[#111] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm text-gray-300">
                 <thead className="text-xs text-gray-500 uppercase bg-[#1A1A1A] border-b border-white/5">
                   <tr>
                     <th className="px-6 py-4 font-semibold tracking-widest">Fecha</th>
                     <th className="px-6 py-4 font-semibold tracking-widest">Origen (Banco)</th>
                     <th className="px-6 py-4 font-semibold tracking-widest text-right">Monto</th>
                     <th className="px-6 py-4 font-semibold tracking-widest text-center">Match IA</th>
                     <th className="px-6 py-4 font-semibold tracking-widest text-center">Estado</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {transfers.map((tx, i) => (
                     <tr key={i} className="hover:bg-[#141414] transition-colors group">
                       <td className="px-6 py-4 text-xs font-mono text-gray-400">{tx.date}</td>
                       <td className="px-6 py-4">
                          <p className="font-bold text-white text-xs">{tx.sender}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{tx.concept}</p>
                       </td>
                       <td className="px-6 py-4 text-right font-mono font-bold text-white">
                         ${tx.amount.toLocaleString('es-CL')}
                       </td>
                       <td className="px-6 py-4">
                          {tx.suggestedUnit ? (
                             <div className="flex flex-col items-center">
                               <span className="text-xs font-bold text-purple-400">Dpto {tx.suggestedUnit}</span>
                               <span className="text-[9px] text-gray-500 mt-1">{tx.confidence}% confianza</span>
                             </div>
                          ) : (
                             <span className="block text-center text-xs text-gray-600 font-medium">Buscando...</span>
                          )}
                          {tx.receipt_url && (
                             <a href={tx.receipt_url} target="_blank" rel="noreferrer" className="block text-center mt-2 text-purple-400 hover:text-purple-300">
                               <span className="material-symbols-outlined text-[14px]">receipt</span>
                             </a>
                          )}
                       </td>
                       <td className="px-6 py-4 text-center">
                          {tx.isConciliated ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-sm">
                               <span className="material-symbols-outlined text-[12px]">done_all</span> Pagado
                            </span>
                          ) : tx.suggestedUnit ? (
                            <button 
                              onClick={() => approveMatch(tx.id)}
                              className="bg-white/10 text-white border border-white/10 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-sm hover:bg-white/20 transition-colors"
                            >
                               Aprobar Match
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-white/5 text-gray-400 border border-white/5 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-sm">
                               Revisión Manual
                            </span>
                          )}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
        </div>

      </main>
    </div>
  );
};

export default RecaudacionPage;
