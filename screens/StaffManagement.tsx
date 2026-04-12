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
      <header className="sticky top-0 z-20 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('AdminDashboard')}
            className="w-10 h-10 rounded-full bg-[#141414] flex items-center justify-center text-white hover:bg-[#242424] active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">Gestión de Personal</h1>
            <p className="text-xs text-gray-400">Marzo 2026</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 pb-24 space-y-8">
         {/* Pareto KPI: Who is working right now */}
         <div className="bg-gradient-to-br from-[#141414] to-[#0A0A0A] p-5 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex justify-between items-center">
               <div>
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">En Turno Ahora</p>
                  <div className="flex items-center gap-3 mt-2">
                      <div className="relative">
                          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" className="w-12 h-12 rounded-full object-cover border-2 border-[#0A0A0A]" />
                          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0A0A0A]"></div>
                      </div>
                      <div>
                          <h3 className="text-white font-bold">Carlos Mendoza</h3>
                          <p className="text-xs text-ediflow-primary font-medium">Conserjería (Día)</p>
                      </div>
                  </div>
               </div>
               <button 
                  onClick={() => handleMessageStaff('Carlos')}
                  className="w-12 h-12 bg-ediflow-primary/10 text-ediflow-primary rounded-full flex items-center justify-center hover:bg-ediflow-primary hover:text-black transition-colors active:scale-90"
               >
                  <span className="material-symbols-outlined">chat</span>
               </button>
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-white/5 rotate-12 pointer-events-none">badge</span>
         </div>

         {/* Pareto Actions (The 20% that does the 80%) */}
         <div>
            <h2 className="text-xs font-bold text-gray-500 uppercase mb-3 ml-1">Flujo de Trabajo (Regla 80/20)</h2>
            <div className="grid grid-cols-1 gap-3">
               {/* Action 1: Anticipos */}
               <button className="bg-[#141414] hover:bg-[#1F1F1F] active:scale-[0.98] transition-all p-4 rounded-2xl border border-white/5 flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                     <span className="material-symbols-outlined text-2xl">payments</span>
                  </div>
                  <div className="text-left flex-1">
                     <h3 className="text-white font-bold text-sm">1. Aprobar Anticipos</h3>
                     <p className="text-xs text-gray-400">1 solicitud pendiente</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-600">chevron_right</span>
               </button>

               {/* Action 2: Turnos */}
               <button className="bg-[#141414] hover:bg-[#1F1F1F] active:scale-[0.98] transition-all p-4 rounded-2xl border border-white/5 flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                     <span className="material-symbols-outlined text-2xl">calendar_month</span>
                  </div>
                  <div className="text-left flex-1">
                     <h3 className="text-white font-bold text-sm">2. Asignar Turnos</h3>
                     <p className="text-xs text-gray-400">Ajustar horarios de la semana</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-600">chevron_right</span>
               </button>

               {/* Action 3: Liquidaciones */}
               <button className="bg-[#141414] hover:bg-[#1F1F1F] active:scale-[0.98] transition-all p-4 rounded-2xl border border-white/5 flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
                     <span className="material-symbols-outlined text-2xl">receipt_long</span>
                  </div>
                  <div className="text-left flex-1">
                     <h3 className="text-white font-bold text-sm">3. Liquidaciones</h3>
                     <p className="text-xs text-gray-400">Cierre de mes y sueldos</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-600">chevron_right</span>
               </button>
            </div>
         </div>

         {/* Unified Feed: What needs attention */}
         <div>
            <div className="flex justify-between items-center mb-3 ml-1">
               <h2 className="text-xs font-bold text-gray-500 uppercase">Atención Requerida</h2>
            </div>
            <div className="bg-[#141414] rounded-2xl border border-white/5 divide-y divide-white/5">
               <div className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                   <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-green-500/10 text-green-400">
                       <span className="material-symbols-outlined">payments</span>
                   </div>
                   <div className="flex-1">
                       <h4 className="text-sm font-bold text-white">Juan Pérez (Aseo)</h4>
                       <p className="text-xs text-gray-400">Solicita anticipo de $50.000</p>
                   </div>
                   <button onClick={handleApproveAdvance} className="bg-ediflow-primary text-black text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-all">
                       Aprobar
                   </button>
               </div>
               <div className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer active:bg-white/10">
                   <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-amber-500/10 text-amber-400">
                       <span className="material-symbols-outlined">warning</span>
                   </div>
                   <div className="flex-1">
                       <h4 className="text-sm font-bold text-white">Turno sin asignar</h4>
                       <p className="text-xs text-gray-400">Conserjería Noche (Mañana)</p>
                   </div>
                   <span className="material-symbols-outlined text-gray-500">chevron_right</span>
               </div>
            </div>
         </div>
      </main>
    </div>
  );
};

export default StaffManagement;
