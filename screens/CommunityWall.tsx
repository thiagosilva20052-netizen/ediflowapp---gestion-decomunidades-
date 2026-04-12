import React, { useState } from 'react';
import { ScreenName } from '../App';
import { UserRole } from './LoginScreen';

interface Props {
  navigate: (screen: ScreenName) => void;
  role: UserRole;
}

const CommunityWall: React.FC<Props> = ({ navigate, role }) => {
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  const handleBack = () => {
      if (role === 'admin') navigate('AdminDashboard');
      else if (role === 'concierge') navigate('ConciergeDashboard');
      else navigate('ResidentServices');
  };

  return (
    <div className="flex flex-col min-h-full bg-[#0A0A0A]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <button 
                onClick={handleBack}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#141414] hover:bg-[#1F1F1F] active:scale-90 transition-all text-white border border-white/5"
            >
                <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
                <h1 className="text-lg font-bold text-white leading-tight">Comunidad</h1>
                <p className="text-xs text-gray-400">Tablero Oficial & Avisos</p>
            </div>
        </div>
        {role === 'admin' && (
            <button 
                onClick={() => setShowNewPostModal(true)}
                className="w-10 h-10 rounded-full bg-ediflow-primary text-black flex items-center justify-center hover:bg-yellow-400 active:scale-90 transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)]"
            >
                <span className="material-symbols-outlined">campaign</span>
            </button>
        )}
      </header>

      <main className="flex-1 p-4 pb-10 space-y-8">
        
        {/* Pareto: The 80% - Official Announcements */}
        <section>
            <div className="flex justify-between items-center mb-4 ml-1">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tablero Oficial</h2>
                <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full border border-blue-500/20">Solo Administración</span>
            </div>
            
            <div className="space-y-3">
                {/* Urgent Announcement */}
                <div className="bg-gradient-to-br from-red-500/10 to-[#141414] border border-red-500/20 p-4 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined">water_drop</span>
                        </div>
                        <div>
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="text-white font-bold text-sm">Corte de Agua Programado</h3>
                                <span className="text-[10px] text-red-400 font-bold">URGENTE</span>
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed mb-2">
                                Estimados vecinos, mañana martes 14 de Abril habrá un corte de suministro desde las 10:00 hasta las 14:00 hrs por limpieza de matrices.
                            </p>
                            <p className="text-[10px] text-gray-500 font-medium">Publicado hace 2 horas por Administración</p>
                        </div>
                    </div>
                </div>

                {/* Info Announcement */}
                <div className="bg-[#141414] border border-white/5 p-4 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined">groups</span>
                        </div>
                        <div>
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="text-white font-bold text-sm">Asamblea Ordinaria</h3>
                                <span className="text-[10px] text-gray-500">12 Abr</span>
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed mb-2">
                                Se cita a asamblea para revisión de presupuesto anual. La asistencia es obligatoria. Se realizará en el Salón de Eventos a las 19:30 hrs.
                            </p>
                            <p className="text-[10px] text-gray-500 font-medium">Publicado ayer por Administración</p>
                        </div>
                    </div>
                </div>

                {/* Maintenance Announcement */}
                <div className="bg-[#141414] border border-white/5 p-4 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined">elevator</span>
                        </div>
                        <div>
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="text-white font-bold text-sm">Mantención Ascensor Torre B</h3>
                                <span className="text-[10px] text-gray-500">10 Abr</span>
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed mb-2">
                                El ascensor de carga estará fuera de servicio por mantenimiento preventivo mensual.
                            </p>
                            <p className="text-[10px] text-gray-500 font-medium">Publicado el 10 Abr por Administración</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Pareto: The 20% - Marketplace / Classifieds */}
        <section>
            <div className="flex justify-between items-center mb-4 ml-1">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mercado Vecinal</h2>
                {role === 'resident' && (
                    <button className="text-ediflow-primary text-xs font-bold flex items-center gap-1 active:opacity-70 transition-opacity">
                        <span className="material-symbols-outlined text-[14px]">add_circle</span> Publicar
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3">
                {/* Classified 1 */}
                <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden group cursor-pointer active:scale-[0.98] transition-all">
                    <div className="h-24 bg-gray-800 relative">
                        <img src="https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=300" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                            $150.000
                        </div>
                    </div>
                    <div className="p-3">
                        <h3 className="text-xs font-bold text-white truncate mb-1">Bicicleta Trek Aro 29</h3>
                        <p className="text-[10px] text-gray-400 truncate">Depto 402 • Casi nueva</p>
                    </div>
                </div>

                {/* Classified 2 */}
                <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden group cursor-pointer active:scale-[0.98] transition-all">
                    <div className="h-24 bg-gray-800 relative">
                        <img src="https://images.unsplash.com/photo-1573311568358-1158b8131615?auto=format&fit=crop&q=80&w=300" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute top-2 right-2 bg-ediflow-primary text-black text-[10px] font-bold px-2 py-1 rounded-lg">
                            Arriendo
                        </div>
                    </div>
                    <div className="p-3">
                        <h3 className="text-xs font-bold text-white truncate mb-1">Estacionamiento -1</h3>
                        <p className="text-[10px] text-gray-400 truncate">Depto 805 • Mensual</p>
                    </div>
                </div>
                
                {/* Classified 3 */}
                <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden group cursor-pointer active:scale-[0.98] transition-all">
                    <div className="h-24 bg-[#0A0A0A] relative flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-purple-500/50">pets</span>
                        <div className="absolute top-2 right-2 bg-purple-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                            Servicio
                        </div>
                    </div>
                    <div className="p-3">
                        <h3 className="text-xs font-bold text-white truncate mb-1">Paseo de Perros</h3>
                        <p className="text-[10px] text-gray-400 truncate">Depto 201 • Tardes</p>
                    </div>
                </div>
            </div>
        </section>

      </main>

      {/* Modal for New Official Post (Admin Only) */}
      {showNewPostModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end">
              <div className="bg-[#141414] rounded-t-3xl p-6 border-t border-white/10 animate-fade-in-up">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-white">Nuevo Anuncio Oficial</h2>
                      <button onClick={() => setShowNewPostModal(false)} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                          <span className="material-symbols-outlined">close</span>
                      </button>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                      <div>
                          <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Tipo de Anuncio</label>
                          <div className="grid grid-cols-3 gap-2">
                              <button className="bg-red-500/10 text-red-400 border border-red-500/20 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all">Urgente</button>
                              <button className="bg-blue-500/10 text-blue-400 border border-blue-500/20 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all">Informativo</button>
                              <button className="bg-amber-500/10 text-amber-400 border border-amber-500/20 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all">Mantención</button>
                          </div>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Título</label>
                          <input type="text" placeholder="Ej. Corte de luz programado" className="w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:border-ediflow-primary outline-none transition-colors" />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Mensaje</label>
                          <textarea placeholder="Detalles del anuncio..." rows={4} className="w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:border-ediflow-primary outline-none transition-colors resize-none"></textarea>
                      </div>
                  </div>

                  <button 
                      onClick={() => setShowNewPostModal(false)}
                      className="w-full bg-ediflow-primary text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 active:scale-[0.98] transition-all shadow-lg shadow-yellow-500/20"
                  >
                      <span className="material-symbols-outlined">campaign</span>
                      Publicar Anuncio
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default CommunityWall;