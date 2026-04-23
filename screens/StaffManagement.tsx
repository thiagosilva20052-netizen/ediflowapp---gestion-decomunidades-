import React, { useState } from 'react';
import { ScreenName } from '../App';

interface Props {
  navigate: (screen: ScreenName) => void;
}

const StaffManagement: React.FC<Props> = ({ navigate }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddingMode, setIsAddingMode] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    rut: '',
    email: '',
    password: ''
  });

  const showToast = (msg: string) => {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3000);
      setIsAddingMode(false);
  };

  const handleSaveConserje = (e: React.FormEvent) => {
      e.preventDefault();
      showToast("Conserje registrado exitosamente");
      setFormData({ name: '', rut: '', email: '', password: '' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] font-sans text-white overflow-hidden relative">
      {/* Toast Notification */}
      {toastMessage && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2 animate-fade-in-up whitespace-nowrap">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              {toastMessage}
          </div>
      )}

      {/* Header */}
      <header className="px-6 md:px-16 pt-8 md:pt-12 pb-6 lg:pb-8 flex items-center justify-between sticky top-0 z-30 bg-[#0A0A0A]/90 backdrop-blur-3xl border-b border-white/5">
        <div className="flex items-center gap-4 pointer-events-auto">
          <button 
            onClick={() => navigate('AdminDashboard')}
            className="w-10 h-10 rounded-xl bg-[#111] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1A1A1A] active:scale-95 transition-all shadow-sm group relative"
          >
            <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform relative z-10">arrow_back</span>
          </button>
          <div>
            <h2 className="text-[10px] font-bold text-ediflow-primary uppercase tracking-[0.2em] mb-0.5">Control de Edificio</h2>
            <h1 className="text-lg md:text-xl font-medium text-white tracking-tight flex items-center gap-2">Equipo de Trabajo</h1>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
             <button 
                 onClick={() => setIsAddingMode(true)}
                 className="h-10 px-5 rounded-xl bg-ediflow-primary text-black hover:bg-white active:scale-95 transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(0,174,239,0.3)]"
             >
                 <span className="material-symbols-outlined text-[18px]">person_add</span> Nuevo Conserje
             </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-6 md:px-16 pt-8 pb-32 max-w-7xl mx-auto w-full">
         
         {isAddingMode ? (
            <form onSubmit={handleSaveConserje} className="max-w-3xl mx-auto space-y-6">
               <div className="flex justify-between items-center mb-2">
                   <h2 className="text-2xl tracking-tight font-medium">Registrar Personal</h2>
                   <button 
                     type="button" 
                     onClick={() => setIsAddingMode(false)}
                     className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                   >
                     Cancelar
                   </button>
               </div>
               
               <div className="bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl group hover:border-white/10 transition-colors">
                  <div className="flex gap-6 items-center mb-8 pb-8 border-b border-white/5">
                      <div className="w-20 h-20 rounded-full bg-[#1A1A1A] border border-dashed border-white/20 flex flex-col items-center justify-center text-gray-500 hover:text-ediflow-primary hover:border-ediflow-primary/50 cursor-pointer transition-all shrink-0">
                         <span className="material-symbols-outlined text-[24px]">add_a_photo</span>
                      </div>
                      <div>
                         <p className="text-sm font-medium text-white mb-1">Fotografía (Opcional)</p>
                         <p className="text-xs text-gray-500">Visible para residentes en operaciones.</p>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                          Nombres y Apellidos <span className="text-ediflow-primary ml-1">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Ej. Juan Pérez"
                          className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white placeholder-gray-600 focus:outline-none focus:border-ediflow-primary/50 focus:bg-[#141414] focus:ring-1 focus:ring-ediflow-primary/50 transition-all text-sm font-medium"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                          RUT / ID <span className="text-ediflow-primary ml-1">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={formData.rut}
                          onChange={(e) => setFormData({...formData, rut: e.target.value})}
                          placeholder="12.345.678-9"
                          className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white placeholder-gray-600 focus:outline-none focus:border-ediflow-primary/50 focus:bg-[#141414] focus:ring-1 focus:ring-ediflow-primary/50 transition-all font-mono tracking-widest text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                          Correo Electrónico <span className="text-ediflow-primary ml-1">*</span>
                        </label>
                        <input 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="conserje@edificio.com"
                          className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white placeholder-gray-600 focus:outline-none focus:border-ediflow-primary/50 focus:bg-[#141414] focus:ring-1 focus:ring-ediflow-primary/50 transition-all text-sm font-medium"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                          Contraseña de Acceso <span className="text-ediflow-primary ml-1">*</span>
                        </label>
                        <input 
                          type="password" 
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          placeholder="••••••••"
                          className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 focus:bg-[#141414] focus:ring-1 focus:ring-red-500/50 transition-all text-sm font-medium font-mono"
                          required
                        />
                      </div>
                  </div>
               </div>
               
               <div className="flex justify-end pt-4 gap-4">
                  <button 
                     type="button" 
                     onClick={() => setIsAddingMode(false)}
                     className="px-6 py-4 rounded-xl border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                  >
                     Cancelar
                  </button>
                  <button 
                     type="submit"
                     disabled={!formData.name || !formData.rut || !formData.email || !formData.password}
                     className="px-8 py-4 rounded-xl bg-ediflow-primary text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-all active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center gap-2"
                  >
                     Crear Cuenta <span className="material-symbols-outlined text-[18px]">person_add</span>
                  </button>
               </div>
            </form>
         ) : (
            <>
               <div className="md:hidden flex justify-between items-center mb-6">
                 <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Personal Activo</h2>
                 <button 
                     onClick={() => setIsAddingMode(true)}
                     className="h-10 px-4 rounded-xl bg-ediflow-primary text-black active:scale-95 transition-all text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5"
                 >
                     <span className="material-symbols-outlined text-[16px]">add</span> Nuevo
                 </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Persona Card */}
                  <div className="bg-[#111] p-6 rounded-[2rem] border border-white/5 hover:border-white/15 hover:bg-[#141414] transition-all group flex flex-col">
                     <div className="flex items-start justify-between mb-6">
                        <div className="relative">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" className="w-16 h-16 rounded-full object-cover border border-white/10" alt="Avatar"/>
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#111]"></div>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md bg-white/5 text-gray-400 group-hover:text-white transition-colors border border-white/5">
                           Conserjería
                        </span>
                     </div>
                     <div>
                        <h3 className="text-xl font-medium text-white tracking-tight mb-1">Carlos Mendoza</h3>
                        <p className="text-sm font-mono text-gray-500 mb-6">RUT: 15.340.211-K</p>
                     </div>
                     
                     <div className="mt-auto pt-5 border-t border-white/5 flex grid grid-cols-2 gap-3">
                         <button className="flex items-center justify-center gap-2 h-10 rounded-xl bg-[#0A0A0A] border border-white/10 text-gray-400 hover:text-ediflow-primary hover:border-ediflow-primary/30 transition-all font-semibold text-[11px] uppercase tracking-wider">
                            <span className="material-symbols-outlined text-[16px]">edit</span> Editar
                         </button>
                         <button className="flex items-center justify-center gap-2 h-10 rounded-xl bg-[#0A0A0A] border border-white/10 text-gray-400 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-all font-semibold text-[11px] uppercase tracking-wider">
                            <span className="material-symbols-outlined text-[16px]">block</span> Suspender
                         </button>
                     </div>
                  </div>

                  {/* Persona Card 2 */}
                  <div className="bg-[#111] p-6 rounded-[2rem] border border-white/5 hover:border-white/15 hover:bg-[#141414] transition-all group flex flex-col">
                     <div className="flex items-start justify-between mb-6">
                        <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center text-gray-500 text-xl font-medium">
                            AM
                        </div>
                     </div>
                     <div>
                        <h3 className="text-xl font-medium text-white tracking-tight mb-1">Ana Martínez</h3>
                        <p className="text-sm font-mono text-gray-500 mb-6">RUT: 18.234.900-1</p>
                     </div>
                     
                     <div className="mt-auto pt-5 border-t border-white/5 flex grid grid-cols-2 gap-3">
                         <button className="flex items-center justify-center gap-2 h-10 rounded-xl bg-[#0A0A0A] border border-white/10 text-gray-400 hover:text-ediflow-primary hover:border-ediflow-primary/30 transition-all font-semibold text-[11px] uppercase tracking-wider">
                            <span className="material-symbols-outlined text-[16px]">edit</span> Editar
                         </button>
                         <button className="flex items-center justify-center gap-2 h-10 rounded-xl bg-[#0A0A0A] border border-white/10 text-gray-400 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-all font-semibold text-[11px] uppercase tracking-wider">
                            <span className="material-symbols-outlined text-[16px]">block</span> Suspender
                         </button>
                     </div>
                  </div>
               </div>
            </>
         )}
      </main>
    </div>
  );
};

export default StaffManagement;
