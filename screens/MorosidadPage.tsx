import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenName } from '../App';

interface Props {
  navigate: (screen: ScreenName) => void;
}

interface Moroso {
  id: string;
  unidad: string;
  residente: string;
  deudaTotal: number;
  mesesAtraso: number;
  contactado: boolean;
  ultimaNotificacion?: string;
  estadoPlan: 'Sin Plan' | 'En Negociación' | 'Plan Activo' | 'Incumplido';
  serviciosCortables: boolean;
}

const MorosidadPage: React.FC<Props> = ({ navigate }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Pendientes' | 'Planes' | 'Cortes'>('Pendientes');

  const [morosos, setMorosos] = useState<Moroso[]>([
    { id: '1', unidad: '101', residente: 'Juan Pérez', deudaTotal: 250000, mesesAtraso: 2, contactado: false, estadoPlan: 'Sin Plan', serviciosCortables: false },
    { id: '2', unidad: '304', residente: 'María González', deudaTotal: 450000, mesesAtraso: 4, contactado: true, ultimaNotificacion: 'Hace 2 días', estadoPlan: 'En Negociación', serviciosCortables: true },
    { id: '3', unidad: '502', residente: 'Carlos Silva', deudaTotal: 125000, mesesAtraso: 1, contactado: false, estadoPlan: 'Sin Plan', serviciosCortables: false },
    { id: '4', unidad: '708', residente: 'Ana Rojas', deudaTotal: 850000, mesesAtraso: 7, contactado: true, ultimaNotificacion: 'Hace 1 mes', estadoPlan: 'Incumplido', serviciosCortables: true },
    { id: '5', unidad: '1205', residente: 'Luis Fernández', deudaTotal: 300000, mesesAtraso: 3, contactado: true, ultimaNotificacion: 'Hace 1 semana', estadoPlan: 'Plan Activo', serviciosCortables: false },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleNotifyCoprobant = (id: string) => {
    setMorosos(prev => prev.map(m => m.id === id ? { ...m, contactado: true, ultimaNotificacion: 'Recién' } : m));
    showToast('Notificación automatizada enviada con éxito.');
  };

  const handleMassNotify = () => {
    setMorosos(prev => prev.map(m => (!m.contactado ? { ...m, contactado: true, ultimaNotificacion: 'Recién' } : m)));
    showToast('Notificaciones enviadas masivamente.');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white font-sans overflow-hidden relative">
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-12 left-1/2 z-50 bg-emerald-500 text-black px-6 py-3 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] font-bold text-sm flex items-center gap-2 whitespace-nowrap"
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
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Gestión de Morosidad</h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px]">warning</span>
                Asistencia y Recaudación Preventiva
              </p>
            </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 md:px-12 py-10 max-w-7xl mx-auto w-full">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[40px] rounded-full group-hover:bg-red-500/10 transition-colors pointer-events-none"></div>
            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> Morosidad Total
            </p>
            <h3 className="text-4xl text-white font-light tracking-tight mt-1">
              ${morosos.reduce((acc, curr) => acc + curr.deudaTotal, 0).toLocaleString()}
            </h3>
          </div>

          <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-[40px] rounded-full group-hover:bg-orange-500/10 transition-colors pointer-events-none"></div>
            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span> Unidades en Mora
            </p>
            <h3 className="text-4xl text-white font-light tracking-tight mt-1">{morosos.length}</h3>
          </div>

          <button 
             onClick={handleMassNotify}
             className="bg-gradient-to-br from-[#111] to-[#1A1A1A] p-8 rounded-[2rem] border border-white/5 hover:border-red-500/30 transition-all flex flex-col items-center justify-center text-center group cursor-pointer relative overflow-hidden shadow-2xl active:scale-[0.98]"
          >
             <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-colors"></div>
             <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4 shadow-inner group-hover:scale-110 transition-transform">
               <span className="material-symbols-outlined text-[24px]">forward_to_inbox</span>
             </div>
             <h4 className="text-lg font-bold text-white mb-1">Notificar a Todos</h4>
             <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Enviar Recordatorios (IA)</p>
          </button>
        </div>

        {/* Action Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto hide-scrollbar">
           {['Pendientes', 'Planes', 'Cortes'].map((tab) => (
             <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-white text-black' 
                    : 'bg-[#111] text-gray-400 hover:text-white border border-white/5 hover:border-white/10'
                }`}
             >
                {tab}
             </button>
           ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
           {activeTab === 'Pendientes' && morosos.filter(m => m.estadoPlan === 'Sin Plan').map((moroso) => (
             <motion.div 
               key={moroso.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-[#111] p-6 lg:p-8 rounded-[2rem] border border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-red-500/20 transition-all group"
             >
               <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-[1.5rem] bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-2xl font-mono shrink-0">
                   {moroso.unidad}
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-white tracking-tight">{moroso.residente}</h3>
                   <div className="flex items-center gap-4 mt-2">
                     <span className="text-red-400 font-mono text-sm font-bold bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                       ${moroso.deudaTotal.toLocaleString()}
                     </span>
                     <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest">
                       {moroso.mesesAtraso} Meses de Atraso
                     </span>
                   </div>
                 </div>
               </div>

               <div className="flex flex-wrap items-center gap-3">
                 {!moroso.contactado ? (
                     <button 
                       onClick={() => handleNotifyCoprobant(moroso.id)}
                       className="bg-[#1A1A1A] text-white border border-white/10 px-6 py-4 rounded-xl font-bold text-sm hover:bg-white/5 active:scale-95 transition-all flex items-center gap-2 shadow-lg"
                     >
                       <span className="material-symbols-outlined text-[18px]">mail</span> 
                       Notificar
                     </button>
                 ) : (
                     <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-6 py-4 rounded-xl font-bold text-sm flex items-center gap-2">
                       <span className="material-symbols-outlined text-[18px]">check</span>
                       Notificado {moroso.ultimaNotificacion}
                     </div>
                 )}
                 <button className="bg-ediflow-primary/10 text-ediflow-primary border border-ediflow-primary/20 px-6 py-4 rounded-xl font-bold text-sm hover:bg-ediflow-primary/20 active:scale-95 transition-all flex items-center gap-2">
                   Plan de Pago
                 </button>
               </div>
             </motion.div>
           ))}

           {activeTab === 'Planes' && morosos.filter(m => m.estadoPlan !== 'Sin Plan').map((moroso) => (
             <motion.div 
               key={moroso.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-[#111] p-6 lg:p-8 rounded-[2rem] border border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-ediflow-primary/20 transition-all"
             >
               <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 text-gray-300 flex items-center justify-center font-bold text-2xl font-mono shrink-0">
                   {moroso.unidad}
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-white tracking-tight">{moroso.residente}</h3>
                   <div className="flex items-center gap-4 mt-2">
                     <span className={`font-mono text-sm font-bold px-3 py-1 rounded-full border ${
                        moroso.estadoPlan === 'Plan Activo' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        moroso.estadoPlan === 'Incumplido' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-orange-500/10 text-orange-400 border-orange-500/20'
                     }`}>
                       {moroso.estadoPlan}
                     </span>
                     <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest">
                       Deuda Restante: ${moroso.deudaTotal.toLocaleString()}
                     </span>
                   </div>
                 </div>
               </div>

               <div className="flex items-center gap-3">
                 <button className="bg-[#1A1A1A] text-white border border-white/10 px-6 py-4 rounded-xl font-bold text-sm hover:bg-white/5 active:scale-95 transition-all">
                   Ver Detalle
                 </button>
               </div>
             </motion.div>
           ))}

           {activeTab === 'Cortes' && (
             <div className="bg-[#111] p-8 rounded-[2.5rem] border border-red-500/20 text-center py-16">
               <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6 text-red-500">
                  <span className="material-symbols-outlined text-[48px]">flash_off</span>
               </div>
               <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Unidades para Corte de Servicio</h3>
               <p className="text-gray-400 max-w-lg mx-auto leading-relaxed mb-8">
                 Según la normativa vigente y luego de 3 meses de deuda, las siguientes unidades están habilitadas para el corte de suministro eléctrico.
               </p>
               
               <div className="max-w-2xl mx-auto space-y-4">
                  {morosos.filter(m => m.serviciosCortables).map((moroso) => (
                    <div key={moroso.id} className="bg-[#0A0A0A] border border-white/5 p-4 rounded-xl flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-white/5 text-white flex items-center justify-center font-bold text-sm font-mono shrink-0">
                             {moroso.unidad}
                          </div>
                          <span className="font-medium text-white">{moroso.residente}</span>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className="text-xs text-red-400 font-bold uppercase tracking-widest">{moroso.mesesAtraso} meses</span>
                          <button onClick={() => showToast('Carta de corte generada.')} className="text-xs font-bold text-black bg-white px-3 py-1.5 rounded-lg hover:bg-gray-200">Emitir Carta</button>
                       </div>
                    </div>
                  ))}
               </div>
             </div>
           )}

        </div>
      </main>
    </div>
  );
};

export default MorosidadPage;
