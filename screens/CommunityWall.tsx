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
      <header className="sticky top-0 z-30 bg-[#0A0A0A]/90 backdrop-blur-3xl border-b border-white/5 px-6 md:px-16 pt-8 md:pt-12 pb-6 lg:pb-8 flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-6">
                <button 
                    onClick={handleBack}
                    className="w-10 h-10 rounded-xl bg-[#111] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1A1A1A] active:scale-95 transition-all shadow-sm group relative"
                >
                    <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform relative z-10">arrow_back</span>
                </button>
                <div>
                     <h2 className="text-[10px] font-bold text-ediflow-primary uppercase tracking-[0.2em] mb-0.5">Tablero Oficial</h2>
                    <h1 className="text-lg md:text-xl font-medium text-white tracking-tight flex items-center gap-2">
                        Muro Comunitario
                    </h1>
                </div>
            </div>
            
            {role === 'admin' && (
                <button 
                    onClick={() => setShowNewPostModal(true)}
                    className="hidden md:flex items-center gap-2 bg-[#111] border border-white/5 text-gray-400 px-6 h-10 rounded-xl font-semibold text-xs uppercase tracking-widest hover:bg-ediflow-primary hover:text-black hover:border-transparent active:scale-95 transition-all group relative overflow-hidden"
                >
                    <span className="material-symbols-outlined text-[16px] group-hover:scale-110 transition-transform relative z-10">campaign</span>
                    Publicar Anuncio
                </button>
            )}
            {/* Mobile Action Button */}
            {role === 'admin' && (
                <button 
                    onClick={() => setShowNewPostModal(true)}
                    className="flex md:hidden w-10 h-10 items-center justify-center rounded-xl bg-[#111] border border-white/5 text-gray-400 hover:bg-ediflow-primary hover:text-black hover:border-transparent transition-all shadow-lg active:scale-95 group relative overflow-hidden"
                >
                    <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform relative z-10">campaign</span>
                </button>
            )}
      </header>

      <main className="flex-1 p-6 md:px-16 pt-8 pb-32 max-w-7xl mx-auto w-full space-y-12">
        
        {/* Pareto: The 80% - Official Announcements (Bento Layout) */}
        <section>
            <div className="flex items-center justify-between mb-6 md:mb-8 px-2 md:px-0">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-gray-500 text-[20px]">flag</span>
                    <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Comunicados Oficiales</h2>
                </div>
                <span className="text-[9px] font-bold bg-ediflow-primary/10 text-ediflow-primary px-3 py-1 rounded-full border border-ediflow-primary/20 uppercase tracking-widest flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">verified</span> Verificados
                </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Urgent Announcement Bento Card */}
                <div className="bg-[#111] rounded-[2rem] border border-white/5 overflow-hidden group hover:border-red-500/30 hover:bg-[#141414] transition-all relative flex flex-col shadow-2xl h-[340px]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[40px] group-hover:bg-red-500/20 transition-colors pointer-events-none"></div>
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-red-500 to-red-600"></div>
                    
                    <div className="p-6 md:p-8 flex-1 flex flex-col relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-inner group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[24px]">water_drop</span>
                            </div>
                            <span className="text-[9px] font-bold bg-red-500/10 text-red-500 px-3 py-1 rounded-full border border-red-500/20 uppercase tracking-widest animate-pulse-soft">Urgente</span>
                        </div>
                        
                        <div className="mb-4">
                            <h3 className="text-lg md:text-xl font-medium text-white tracking-tight mb-2 group-hover:text-red-400 transition-colors">Corte de Agua Programado</h3>
                            <p className="text-sm text-gray-400 leading-relaxed font-light line-clamp-3">
                                Estimados vecinos, mañana martes 14 de Abril habrá un corte de suministro desde las 10:00 hasta las 14:00 hrs por limpieza de matrices.
                            </p>
                        </div>

                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-gray-400 border border-white/10">
                                  <span className="material-symbols-outlined text-[12px]">admin_panel_settings</span>
                              </div>
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Administración</p>
                            </div>
                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-0.5">Hace 2 hrs</p>
                        </div>
                    </div>
                </div>

                {/* Info Announcement Bento Card */}
                <div className="bg-[#111] rounded-[2rem] border border-white/5 overflow-hidden group hover:border-[#00AEEF]/30 hover:bg-[#141414] transition-all relative flex flex-col shadow-2xl h-[340px]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#00AEEF]/5 rounded-full blur-[40px] group-hover:bg-[#00AEEF]/15 transition-colors pointer-events-none"></div>
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#00AEEF] to-[#0284C7] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="p-6 md:p-8 flex-1 flex flex-col relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-xl bg-[#00AEEF]/10 border border-[#00AEEF]/20 flex items-center justify-center text-[#00AEEF] shadow-inner group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[24px]">groups</span>
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">12 Abr</span>
                        </div>
                        
                        <div className="mb-4">
                            <h3 className="text-lg md:text-xl font-medium text-white tracking-tight mb-2 group-hover:text-[#00AEEF] transition-colors">Asamblea Ordinaria Anual</h3>
                            <p className="text-sm text-gray-400 leading-relaxed font-light line-clamp-3">
                                Se cita a asamblea para la revisión del presupuesto anual. Asistencia obligatoria. Salón de Eventos a las 19:30 hrs.
                            </p>
                        </div>

                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-gray-400 border border-white/10">
                                  <span className="material-symbols-outlined text-[12px]">admin_panel_settings</span>
                              </div>
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Administración</p>
                            </div>
                             <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-0.5">Ayer</p>
                        </div>
                    </div>
                </div>

                {/* Maintenance Announcement Bento Card */}
                <div className="bg-[#111] rounded-[2rem] border border-white/5 overflow-hidden group hover:border-amber-500/30 hover:bg-[#141414] transition-all relative flex flex-col shadow-2xl h-[340px]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-[40px] group-hover:bg-amber-500/15 transition-colors pointer-events-none"></div>
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-400 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="p-6 md:p-8 flex-1 flex flex-col relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-inner group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[24px]">elevator</span>
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">10 Abr</span>
                        </div>
                        
                        <div className="mb-4">
                            <h3 className="text-lg md:text-xl font-medium text-white tracking-tight mb-2 group-hover:text-amber-500 transition-colors">Mantención Ascensor B</h3>
                            <p className="text-sm text-gray-400 leading-relaxed font-light line-clamp-3">
                                El ascensor de carga estará temporalmente fuera de servicio por nuestro plan de mantenimiento preventivo mensual.
                            </p>
                        </div>

                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                           <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-gray-400 border border-white/10">
                                  <span className="material-symbols-outlined text-[12px]">build</span>
                              </div>
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Operaciones</p>
                           </div>
                           <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-0.5">10 Abr</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Pareto: The 20% - Marketplace / Classifieds */}
        <section className="pt-8">
            <div className="flex items-center justify-between mb-6 md:mb-8 px-2 md:px-0">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-gray-500 text-[20px]">storefront</span>
                    <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Mercado Vecinal</h2>
                </div>
                {role === 'resident' && (
                    <button className="text-ediflow-primary text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 hover:text-white transition-colors group">
                        <span className="material-symbols-outlined text-[16px] group-hover:rotate-90 transition-transform">add_circle</span> Crear Aviso
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Classified 1 */}
                <div className="bg-[#111] border border-white/5 rounded-[1.5rem] overflow-hidden group hover:border-white/10 transition-all flex flex-col h-[280px] shadow-2xl hover:-translate-y-1">
                    <div className="h-[140px] bg-[#0A0A0A] relative overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt="Bicicleta" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent"></div>
                        <div className="absolute top-3 right-3 bg-[#0A0A0A]/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-widest border border-white/10 shadow-lg">
                            $150.000
                        </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col relative z-20 -mt-4 bg-[#111]">
                        <h3 className="text-sm font-medium text-white line-clamp-1 mb-1 group-hover:text-ediflow-primary transition-colors">Bicicleta Trek Aro 29</h3>
                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed font-light">Mountain Bike, casi sin uso. Mantenciones al día.</p>
                        <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                            <div className="flex items-center gap-1.5 object-cover">
                              <span className="material-symbols-outlined text-[14px] text-gray-500">meeting_room</span>
                              <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">Depto 402</span>
                            </div>
                            <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Classified 2 */}
                <div className="bg-[#111] border border-white/5 rounded-[1.5rem] overflow-hidden group hover:border-white/10 transition-all flex flex-col h-[280px] shadow-2xl hover:-translate-y-1">
                    <div className="h-[140px] bg-[#0A0A0A] relative overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1573311568358-1158b8131615?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt="Estacionamiento" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent"></div>
                        <div className="absolute top-3 right-3 bg-white text-black text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-lg">
                            Arriendo
                        </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col relative z-20 -mt-4 bg-[#111]">
                        <h3 className="text-sm font-medium text-white line-clamp-1 mb-1 group-hover:text-white transition-colors">Estacionamiento -1</h3>
                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed font-light">Se arrienda estacionamiento nivel -1, excelente ubicación.</p>
                        <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                             <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[14px] text-gray-500">meeting_room</span>
                              <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">Depto 805</span>
                            </div>
                            <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                            </span>
                        </div>
                    </div>
                </div>
                
                {/* Classified 3 */}
                <div className="bg-[#111] border border-white/5 rounded-[1.5rem] overflow-hidden group hover:border-purple-500/20 transition-all flex flex-col h-[280px] shadow-2xl hover:-translate-y-1">
                    <div className="h-[140px] bg-[#0A0A0A] relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-[#0A0A0A] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <span className="material-symbols-outlined text-[40px] text-purple-400/50 group-hover:text-purple-400 relative z-10 group-hover:scale-110 transition-all duration-500">pets</span>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent"></div>
                        <div className="absolute top-3 right-3 bg-purple-500/10 text-purple-400 text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-widest border border-purple-500/20 backdrop-blur-md">
                            Servicios
                        </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col relative z-20 -mt-4 bg-[#111]">
                        <h3 className="text-sm font-medium text-white line-clamp-1 mb-1 group-hover:text-purple-400 transition-colors">Paseo de Perros</h3>
                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed font-light">Servicio de paseo para perros en las tardes, plazas cercanas.</p>
                        <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                             <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[14px] text-gray-500">meeting_room</span>
                              <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">Depto 201</span>
                            </div>
                            <span className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                            </span>
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
                          <h2 className="text-2xl md:text-3xl font-light text-white tracking-tight mb-2">Nuevo Comunicado</h2>
                          <p className="text-xs text-gray-400 font-medium">Publicarás como Administrador.</p>
                      </div>
                      <button 
                          onClick={() => setShowNewPostModal(false)}
                          className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                          <span className="material-symbols-outlined text-[20px]">close</span>
                      </button>
                  </div>
                  
                  <div className="space-y-8 mb-10">
                      <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 block pl-1">Clasificación de Prioridad</label>
                          <div className="grid grid-cols-3 gap-4">
                              <button 
                                  onClick={() => setPostType('urgent')}
                                  className={`flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl border transition-all ${
                                      postType === 'urgent' 
                                      ? 'bg-red-500/10 border-red-500/30 text-red-500' 
                                      : 'bg-[#0A0A0A] border-white/5 text-gray-500 hover:bg-white/5 hover:text-gray-300'
                                  }`}
                              >
                                  <span className="material-symbols-outlined text-[28px] md:text-[32px] mb-3">campaign</span>
                                  <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">Urgencia</span>
                              </button>
                              
                              <button 
                                  onClick={() => setPostType('info')}
                                  className={`flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl border transition-all ${
                                      postType === 'info' 
                                      ? 'bg-[#00AEEF]/10 border-[#00AEEF]/30 text-[#00AEEF]' 
                                      : 'bg-[#0A0A0A] border-white/5 text-gray-500 hover:bg-white/5 hover:text-gray-300'
                                  }`}
                              >
                                  <span className="material-symbols-outlined text-[28px] md:text-[32px] mb-3">groups</span>
                                  <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">Informativo</span>
                              </button>

                              <button 
                                  onClick={() => setPostType('maintenance')}
                                  className={`flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl border transition-all ${
                                      postType === 'maintenance' 
                                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
                                      : 'bg-[#0A0A0A] border-white/5 text-gray-500 hover:bg-white/5 hover:text-gray-300'
                                  }`}
                              >
                                  <span className="material-symbols-outlined text-[28px] md:text-[32px] mb-3">build</span>
                                  <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">Mantención</span>
                              </button>
                          </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-1 mb-2 block">Título del Comunicado</label>
                            <input 
                                type="text" 
                                placeholder="Ej. Mantención de Ascensores"
                                className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-700 focus:outline-none focus:border-ediflow-primary/50 transition-all font-light text-sm focus:ring-1 focus:ring-ediflow-primary/50"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-1 mb-2 block">Contenido</label>
                            <textarea 
                                placeholder="Describe los detalles de la publicación..." 
                                rows={5} 
                                className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-700 focus:outline-none focus:border-ediflow-primary/50 transition-all resize-none text-sm font-light leading-relaxed focus:ring-1 focus:ring-ediflow-primary/50"
                            ></textarea>
                        </div>
                      </div>
                  </div>

                  <button 
                      onClick={() => setShowNewPostModal(false)}
                      className={`w-full h-14 ${postType === 'urgent' ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:bg-red-400' : postType === 'maintenance' ? 'bg-amber-500 hover:bg-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'bg-ediflow-primary hover:bg-[#38BDF8] shadow-[0_0_20px_rgba(0,174,239,0.3)]'} text-black rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors active:scale-[0.98] group`}
                  >
                      Publicar a la Comunidad
                      <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">send</span>
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default CommunityWall;
