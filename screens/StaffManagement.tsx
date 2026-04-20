import React, { useState } from 'react';
import { ScreenName } from '../App';

interface Props {
  navigate: (screen: ScreenName) => void;
}

const StaffManagement: React.FC<Props> = ({ navigate }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApproveAdvance = () => {
      showToast("Anticipo aprobado exitosamente");
  };

  const handleMessageStaff = (name: string) => {
      navigate('MessagesScreen');
  };

  return (
    <div className="flex flex-col min-h-full bg-[#0A0A0A] relative">
      {/* Toast Notification */}
      {toastMessage && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2 animate-fade-in-up whitespace-nowrap">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              {toastMessage}
          </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#0A0A0A]/90 backdrop-blur-3xl border-b border-white/5 p-4 md:px-8 py-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('AdminDashboard')}
            className="w-10 h-10 rounded-xl bg-[#111] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1A1A1A] active:scale-95 transition-all shadow-sm group relative"
          >
            <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform relative z-10">arrow_back</span>
          </button>
          <div>
            <h2 className="text-[10px] font-bold text-ediflow-primary uppercase tracking-[0.2em] mb-0.5">Recursos Humanos</h2>
            <h1 className="text-lg md:text-xl font-medium text-white tracking-tight flex items-center gap-2">Gestión de Personal</h1>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
             <button className="h-10 px-4 rounded-xl bg-[#111] border border-white/5 text-gray-400 hover:text-white hover:bg-[#1A1A1A] transition-all text-xs font-semibold uppercase tracking-widest flex items-center gap-2">
                 <span className="material-symbols-outlined text-[16px]">download</span> Exportar
             </button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-10 pb-24 space-y-10 max-w-5xl mx-auto w-full">
         {/* Pareto KPI: Who is working right now */}
         <div className="bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-ediflow-primary/30 transition-all">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-ediflow-primary/5 blur-[100px] rounded-full group-hover:opacity-100 transition-opacity pointer-events-none opacity-50"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-6">
               <div className="flex items-center gap-6">
                   <div className="relative">
                       <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" className="w-16 h-16 rounded-[1.25rem] object-cover border border-white/10 shadow-inner" />
                       <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-green-500 rounded-full border-[3px] border-[#111] shadow-[0_0_15px_rgba(34,197,94,0.4)]"></div>
                   </div>
                   <div>
                       <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">En Turno Ahora</p>
                       <h3 className="text-white font-medium text-2xl tracking-tight leading-none mb-2">Carlos Mendoza</h3>
                       <p className="text-sm text-ediflow-primary font-medium flex items-center gap-1.5">
                           <span className="material-symbols-outlined text-[16px]">sunny</span>
                           Conserjería (Turno Día)
                       </p>
                   </div>
               </div>
               
               <button 
                  onClick={() => handleMessageStaff('Carlos')}
                  className="w-full md:w-auto h-12 px-6 bg-white/5 border border-white/10 text-white font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-ediflow-primary hover:text-black hover:border-ediflow-primary transition-all active:scale-[0.98] mt-2 md:mt-0"
               >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                  Contactar
               </button>
            </div>
         </div>

         {/* Pareto Actions (The 20% that does the 80%) */}
         <div>
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 pl-2">Flujo de Trabajo (Reglas de Negocio)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {/* Action 1: Anticipos */}
               <button className="flex flex-col text-left bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 hover:bg-[#141414] hover:border-green-500/30 transition-all active:scale-[0.98] group relative overflow-hidden shadow-lg h-full">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-[40px] group-hover:bg-green-500/10 transition-colors pointer-events-none"></div>
                  
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center mb-12 relative z-10 transition-all border border-green-500/20 group-hover:bg-green-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                     <span className="material-symbols-outlined text-[24px]">payments</span>
                  </div>
                  
                  <div className="relative z-10 mt-auto">
                     <h3 className="text-white font-medium text-lg tracking-tight mb-2">Aprobar Anticipos</h3>
                     <p className="text-sm text-gray-500 leading-relaxed font-medium">1 solicitud pendiente</p>
                  </div>
                  
                  <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-[#0A0A0A] group-hover:bg-white group-hover:border-transparent group-hover:text-black transition-all">
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </div>
               </button>

               {/* Action 2: Turnos */}
               <button className="flex flex-col text-left bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 hover:bg-[#141414] hover:border-blue-500/30 transition-all active:scale-[0.98] group relative overflow-hidden shadow-lg h-full">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[40px] group-hover:bg-blue-500/10 transition-colors pointer-events-none"></div>
                  
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-12 relative z-10 transition-all border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                     <span className="material-symbols-outlined text-[24px]">calendar_month</span>
                  </div>
                  
                  <div className="relative z-10 mt-auto">
                     <h3 className="text-white font-medium text-lg tracking-tight mb-2">Asignar Turnos</h3>
                     <p className="text-sm text-gray-500 leading-relaxed font-medium">Ajustar horarios de la semana</p>
                  </div>
                  
                  <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-[#0A0A0A] group-hover:bg-white group-hover:border-transparent group-hover:text-black transition-all">
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </div>
               </button>

               {/* Action 3: Liquidaciones */}
               <button className="flex flex-col text-left bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 hover:bg-[#141414] hover:border-ediflow-primary/30 transition-all active:scale-[0.98] group relative overflow-hidden shadow-lg h-full">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-ediflow-primary/5 rounded-full blur-[40px] group-hover:bg-ediflow-primary/10 transition-colors pointer-events-none"></div>
                  
                  <div className="w-12 h-12 rounded-xl bg-ediflow-primary/10 text-ediflow-primary flex items-center justify-center mb-12 relative z-10 transition-all border border-ediflow-primary/20 group-hover:bg-ediflow-primary group-hover:text-black group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                     <span className="material-symbols-outlined text-[24px]">receipt_long</span>
                  </div>
                  
                  <div className="relative z-10 mt-auto">
                     <h3 className="text-white font-medium text-lg tracking-tight mb-2">Liquidaciones</h3>
                     <p className="text-sm text-gray-500 leading-relaxed font-medium">Cierre de mes y sueldos</p>
                  </div>
                  
                  <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-[#0A0A0A] group-hover:bg-white group-hover:border-transparent group-hover:text-black transition-all">
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </div>
               </button>
            </div>
         </div>

         {/* Unified Feed: What needs attention */}
         <div>
            <div className="flex justify-between items-center mb-4 pl-2">
               <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Atención Requerida</h2>
            </div>
            <div className="bg-[#111] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
               <div className="p-6 md:p-8 flex items-center justify-between gap-4 hover:bg-[#141414] transition-colors border-b border-white/5 group relative">
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <div className="flex items-start md:items-center gap-5 w-full">
                       <div className="w-12 h-12 rounded-[1.25rem] flex items-center justify-center shrink-0 bg-green-500/10 text-green-400 border border-green-500/20 mt-1 md:mt-0">
                           <span className="material-symbols-outlined text-[20px]">payments</span>
                       </div>
                       <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                           <div>
                               <h4 className="text-base font-semibold text-white tracking-tight">Juan Pérez <span className="text-gray-500 font-normal ml-1">(Aseo)</span></h4>
                               <p className="text-sm text-gray-400">Solicita anticipo de <span className="text-white font-medium">$50.000</span></p>
                           </div>
                           <button onClick={handleApproveAdvance} className="w-full md:w-auto bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-black border border-green-500/20 text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                               <span className="material-symbols-outlined text-[16px]">check</span> Aprobar
                           </button>
                       </div>
                   </div>
               </div>
               
               <div className="p-6 md:p-8 flex items-center gap-5 hover:bg-[#141414] transition-colors cursor-pointer group relative">
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <div className="w-12 h-12 rounded-[1.25rem] flex items-center justify-center shrink-0 bg-amber-500/10 text-amber-400 border border-amber-500/20">
                       <span className="material-symbols-outlined text-[20px]">warning</span>
                   </div>
                   <div className="flex-1">
                       <h4 className="text-base font-semibold text-white tracking-tight mb-0.5">Turno sin asignar</h4>
                       <p className="text-sm text-gray-400">Conserjería Noche (Mañana)</p>
                   </div>
                   <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-600 group-hover:text-white group-hover:bg-[#1A1A1A] group-hover:border-transparent transition-all">
                      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                   </div>
               </div>
            </div>
         </div>
      </main>
    </div>
  );
};

export default StaffManagement;
