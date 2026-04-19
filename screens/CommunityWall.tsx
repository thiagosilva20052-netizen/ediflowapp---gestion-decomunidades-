import React, { useState } from 'react';
import { ScreenName } from '../App';
import { UserRole } from '../src/types';

interface Props {
  navigate: (screen: ScreenName) => void;
  role: UserRole;
}

const CommunityWall: React.FC<Props> = ({ navigate, role }) => {
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [postType, setPostType] = useState<'info' | 'urgent' | 'maintenance'>('info');

  const handleBack = () => {
      if (role === 'admin') navigate('AdminDashboard');
      else if (role === 'concierge') navigate('ConciergeDashboard');
      else navigate('ResidentServices');
  };

  const primaryAccent = role === 'admin' ? 'ediflow-primary' : '[#00AEEF]';

  return (
    <div className="flex flex-col min-h-full bg-[#0A0A0A] font-sans selection:bg-white/10">
      
      {/* Immersive Header */}
      <header className="sticky top-0 z-30 bg-[#0A0A0A]/80 backdrop-blur-3xl border-b border-white/5 px-6 py-4 transition-all">
        <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-4 md:gap-6">
                <button 
                    onClick={handleBack}
                    className="w-12 h-12 rounded-2xl bg-[#111] flex items-center justify-center text-white hover:bg-[#1A1A1A] active:scale-95 transition-all border border-white/5 hover:border-white/20"
                >
                    <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white mb-1">
                        Muro <span className={`font-semibold text-${primaryAccent}`}>Comunitario</span>.
                    </h1>
                    <p className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-widest">
                        Tablero Oficial & Avisos
                    </p>
                </div>
            </div>
            
            {role === 'admin' && (
                <button 
                    onClick={() => setShowNewPostModal(true)}
                    className="hidden md:flex items-center gap-2 px-6 h-12 rounded-2xl bg-white text-black font-bold uppercase text-[11px] tracking-widest hover:bg-gray-200 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                >
                    <span className="material-symbols-outlined text-[18px]">campaign</span>
                    Publicar Anuncio
                </button>
            )}
            {/* Mobile Action Button */}
            {role === 'admin' && (
                <button 
                    onClick={() => setShowNewPostModal(true)}
                    className="flex md:hidden w-12 h-12 rounded-2xl bg-white text-black items-center justify-center font-bold active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                    <span className="material-symbols-outlined text-[24px]">campaign</span>
                </button>
            )}
        </div>
      </header>

      <main className="flex-1 p-6 md:px-12 md:py-10 max-w-7xl mx-auto w-full space-y-12 pb-32">
        
        {/* Pareto: The 80% - Official Announcements (Bento Layout) */}
        <section>
            <div className="flex items-center justify-between mb-6 md:mb-8 px-2 md:px-0">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-gray-500 text-[24px]">flag</span>
                    <h2 className="text-[11px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Comunicados Oficiales</h2>
                </div>
                <span className="text-[9px] md:text-[10px] font-extrabold bg-[#00AEEF]/10 text-[#00AEEF] px-3 py-1.5 rounded-md border border-[#00AEEF]/20 uppercase tracking-widest">Verificados</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Urgent Announcement Bento Card */}
                <div className="bg-[#111] rounded-[2rem] border border-red-500/20 overflow-hidden group hover:border-red-500/40 hover:bg-[#141414] transition-all relative flex flex-col shadow-2xl">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/10 rounded-full blur-[60px] group-hover:bg-red-500/15 transition-colors pointer-events-none"></div>
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-red-500 to-red-600"></div>
                    
                    <div className="p-8 flex-1 flex flex-col relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-[1rem] bg-[#0A0A0A] border border-red-500/20 flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                <span className="material-symbols-outlined text-[24px]">water_drop</span>
                            </div>
                            <span className="text-[9px] font-extrabold bg-red-500/10 text-red-500 px-3 py-1.5 rounded-md border border-red-500/20 uppercase tracking-widest animate-pulse-soft">Urgente</span>
                        </div>
                        
                        <div className="mb-4">
                            <h3 className="text-lg md:text-xl font-medium text-white tracking-tight mb-2">Corte de Agua Programado</h3>
                            <p className="text-sm text-gray-400 leading-relaxed font-medium">
                                Estimados vecinos, mañana martes 14 de Abril habrá un corte de suministro desde las 10:00 hasta las 14:00 hrs por limpieza de matrices.
                            </p>
                        </div>

                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-ediflow-primary/20 flex items-center justify-center text-ediflow-primary border border-ediflow-primary/30">
                                <span className="material-symbols-outlined text-[12px]">admin_panel_settings</span>
                            </div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Hace 2 hrs • Administración</p>
                        </div>
                    </div>
                </div>

                {/* Info Announcement Bento Card */}
                <div className="bg-[#111] rounded-[2rem] border border-white/5 overflow-hidden group hover:border-[#00AEEF]/20 hover:bg-[#141414] transition-all relative flex flex-col">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#00AEEF]/5 rounded-full blur-[60px] group-hover:bg-[#00AEEF]/10 transition-colors pointer-events-none"></div>
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00AEEF] to-[#0284C7] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="p-8 flex-1 flex flex-col relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-[1rem] bg-[#0A0A0A] border border-white/10 flex items-center justify-center text-[#00AEEF] group-hover:text-[#38BDF8] group-hover:border-[#00AEEF]/30 transition-colors">
                                <span className="material-symbols-outlined text-[24px]">groups</span>
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">12 Abr</span>
                        </div>
                        
                        <div className="mb-4">
                            <h3 className="text-lg md:text-xl font-medium text-white tracking-tight mb-2">Asamblea Ordinaria Anual</h3>
                            <p className="text-sm text-gray-400 leading-relaxed font-medium">
                                Se cita a asamblea para la revisión del presupuesto anual. Asistencia obligatoria. Salón de Eventos a las 19:30 hrs.
                            </p>
                        </div>

                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-ediflow-primary/20 flex items-center justify-center text-ediflow-primary border border-ediflow-primary/30">
                                <span className="material-symbols-outlined text-[12px]">admin_panel_settings</span>
                            </div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Ayer • Administración</p>
                        </div>
                    </div>
                </div>

                {/* Maintenance Announcement Bento Card */}
                <div className="bg-[#111] rounded-[2rem] border border-white/5 overflow-hidden group hover:border-amber-500/20 hover:bg-[#141414] transition-all relative flex flex-col">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-[60px] group-hover:bg-amber-500/10 transition-colors pointer-events-none"></div>
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-amber-600 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="p-8 flex-1 flex flex-col relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-[1rem] bg-[#0A0A0A] border border-white/10 flex items-center justify-center text-amber-500 group-hover:border-amber-500/30 transition-colors">
                                <span className="material-symbols-outlined text-[24px]">elevator</span>
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">10 Abr</span>
                        </div>
                        
                        <div className="mb-4">
                            <h3 className="text-lg md:text-xl font-medium text-white tracking-tight mb-2">Mantención Ascensor B</h3>
                            <p className="text-sm text-gray-400 leading-relaxed font-medium">
                                El ascensor de carga estará temporalmente fuera de servicio por nuestro plan de mantenimiento preventivo mensual.
                            </p>
                        </div>

                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 border border-white/10">
                                <span className="material-symbols-outlined text-[12px]">build</span>
                            </div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Operaciones • 10 Abr</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Pareto: The 20% - Marketplace / Classifieds */}
        <section>
            <div className="flex items-center justify-between mb-6 md:mb-8 px-2 md:px-0">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-gray-500 text-[24px]">storefront</span>
                    <h2 className="text-[11px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Mercado Vecinal</h2>
                </div>
                {role === 'resident' && (
                    <button className={`text-${primaryAccent} text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 hover:text-white transition-colors`}>
                        <span className="material-symbols-outlined text-[16px]">add_circle</span> Crear Aviso
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Classified 1 */}
                <div className="bg-[#111] border border-white/5 rounded-[1.5rem] overflow-hidden group cursor-pointer hover:border-white/20 transition-all flex flex-col h-full shadow-lg hover:-translate-y-1">
                    <div className="h-40 md:h-36 bg-[#0A0A0A] relative overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt="Bicicleta" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent opacity-80"></div>
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg uppercase tracking-widest border border-white/10">
                            $150.000
                        </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-sm font-semibold text-white truncate mb-1 border-b border-transparent group-hover:border-white/20 inline-block w-fit transition-colors">Bicicleta Trek Aro 29</h3>
                        <p className="text-[11px] text-gray-400 truncate mb-3">Mountain Bike, casi sin uso.</p>
                        <div className="mt-auto pt-3 flex items-center gap-2 border-t border-white/5">
                            <span className="material-symbols-outlined text-[14px] text-gray-500">meeting_room</span>
                            <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Depto 402</span>
                        </div>
                    </div>
                </div>

                {/* Classified 2 */}
                <div className="bg-[#111] border border-white/5 rounded-[1.5rem] overflow-hidden group cursor-pointer hover:border-white/20 transition-all flex flex-col h-full shadow-lg hover:-translate-y-1">
                    <div className="h-40 md:h-36 bg-[#0A0A0A] relative overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1573311568358-1158b8131615?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt="Estacionamiento" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent opacity-80"></div>
                        <div className={`absolute top-3 right-3 bg-${primaryAccent} text-black text-[10px] font-extrabold px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-[0_0_10px_rgba(255,255,255,0.2)]`}>
                            Arriendo
                        </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-sm font-semibold text-white truncate mb-1 border-b border-transparent group-hover:border-white/20 inline-block w-fit transition-colors">Estacionamiento -1</h3>
                        <p className="text-[11px] text-gray-400 truncate mb-3">Mensualidad. Nivel -1 cerca del pilar.</p>
                        <div className="mt-auto pt-3 flex items-center gap-2 border-t border-white/5">
                            <span className="material-symbols-outlined text-[14px] text-gray-500">meeting_room</span>
                            <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Depto 805</span>
                        </div>
                    </div>
                </div>
                
                {/* Classified 3 */}
                <div className="bg-[#111] border border-white/5 rounded-[1.5rem] overflow-hidden group cursor-pointer hover:border-white/20 transition-all flex flex-col h-full shadow-lg hover:-translate-y-1">
                    <div className="h-40 md:h-36 bg-[#0A0A0A] relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-[#0A0A0A] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <span className="material-symbols-outlined text-[48px] text-purple-400 relative z-10 group-hover:scale-110 transition-transform duration-500">pets</span>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent opacity-80"></div>
                        <div className="absolute top-3 right-3 bg-purple-500 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg uppercase tracking-widest border border-purple-400">
                            Servicios
                        </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-sm font-semibold text-white truncate mb-1 border-b border-transparent group-hover:border-white/20 inline-block w-fit transition-colors">Paseo de Perros</h3>
                        <p className="text-[11px] text-gray-400 truncate mb-3">Tardes, con referencias del nivel 2.</p>
                        <div className="mt-auto pt-3 flex items-center gap-2 border-t border-white/5">
                            <span className="material-symbols-outlined text-[14px] text-gray-500">meeting_room</span>
                            <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Depto 201</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

      </main>

      {/* Glassmorphic Slide-Up Modal for New Official Post */}
      {showNewPostModal && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center items-center px-0 md:px-6">
              {/* Backdrop */}
              <div 
                  className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
                  onClick={() => setShowNewPostModal(false)}
              ></div>
              
              {/* Modal Content */}
              <div className="bg-[#111] w-full md:max-w-2xl rounded-t-[2.5rem] md:rounded-[2.5rem] p-8 md:p-10 border-t md:border border-white/10 shadow-[0_-20px_60px_rgba(0,0,0,0.5)] relative z-10 animate-fade-in-up">
                  
                  {/* Handle for mobile */}
                  <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8 md:hidden"></div>

                  <div className="flex justify-between items-start mb-8">
                      <div>
                          <h2 className="text-2xl font-light tracking-tight text-white mb-1">Nuevo <span className="font-medium text-white">Anuncio Oficial</span></h2>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Publicación global a comunidad</p>
                      </div>
                      <button 
                          onClick={() => setShowNewPostModal(false)} 
                          className="w-10 h-10 bg-[#0A0A0A] border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors active:scale-95"
                      >
                          <span className="material-symbols-outlined text-[20px]">close</span>
                      </button>
                  </div>
                  
                  <div className="space-y-6 mb-10">
                      <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 block pl-1">Clasificación de Prioridad</label>
                          <div className="grid grid-cols-3 gap-3">
                              <button 
                                  onClick={() => setPostType('urgent')}
                                  className={`py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border flex items-center justify-center gap-2
                                    ${postType === 'urgent' ? 'bg-red-500 text-white border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-[#0A0A0A] text-gray-500 border-white/5 hover:border-white/20'}`}
                              >
                                  <span className="material-symbols-outlined text-[16px]">water_drop</span> <span className="hidden md:inline">Urgencia</span>
                              </button>
                              <button 
                                  onClick={() => setPostType('info')}
                                  className={`py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border flex items-center justify-center gap-2
                                    ${postType === 'info' ? 'bg-[#00AEEF] text-black border-[#00AEEF] shadow-[0_0_20px_rgba(0,174,239,0.3)]' : 'bg-[#0A0A0A] text-gray-500 border-white/5 hover:border-white/20'}`}
                              >
                                  <span className="material-symbols-outlined text-[16px]">info</span> <span className="hidden md:inline">Informativo</span>
                              </button>
                              <button 
                                  onClick={() => setPostType('maintenance')}
                                  className={`py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border flex items-center justify-center gap-2
                                    ${postType === 'maintenance' ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'bg-[#0A0A0A] text-gray-500 border-white/5 hover:border-white/20'}`}
                              >
                                  <span className="material-symbols-outlined text-[16px]">build</span> <span className="hidden md:inline">Mantención</span>
                              </button>
                          </div>
                      </div>
                      <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block pl-1">Titular Corto</label>
                          <input type="text" placeholder="Ej. Corte de luz en Torre A..." className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:border-white/30 focus:shadow-[0_0_15px_rgba(255,255,255,0.05)] outline-none transition-all placeholder:text-gray-600 font-medium" />
                      </div>
                      <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block pl-1">Cuerpo del Mensaje</label>
                          <textarea placeholder="Brinde contexto al residente. Sea claro y conciso." rows={5} className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:border-white/30 focus:shadow-[0_0_15px_rgba(255,255,255,0.05)] outline-none transition-all resize-none placeholder:text-gray-600 flex-1 leading-relaxed"></textarea>
                      </div>
                  </div>

                  <button 
                      onClick={() => setShowNewPostModal(false)}
                      className="w-full bg-white text-black font-bold uppercase tracking-widest text-xs py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                  >
                      <span className="material-symbols-outlined text-[20px]">campaign</span>
                      Distribuir Anuncio
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default CommunityWall;
