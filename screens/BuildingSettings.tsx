import React, { useState } from 'react';
import { ScreenName } from '../App';

interface Props {
  navigate: (screen: ScreenName) => void;
}

export const BuildingSettings: React.FC<Props> = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'modules'>('general');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: 'Condominio Ediflow Central',
    rut: '76.123.456-K',
    address: 'Av. Providencia 1234, Santiago',
    adminEmail: 'contacto@ediflow.cl',
    adminPhone: '+56 9 1234 5678',
    unitsCount: '120',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Configuraciones guardadas exitosamente.');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white font-sans overflow-x-hidden relative items-center selection:bg-white/10">
      <div className="w-full max-w-5xl flex flex-col h-full relative z-10">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2 animate-fade-in-up whitespace-nowrap">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            {toastMessage}
          </div>
        )}

        {/* Sticky Header */}
        <header className="px-6 pt-8 md:pt-12 pb-6 sticky top-0 z-20 bg-[#0A0A0A]/90 backdrop-blur-3xl border-b border-white/5 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 pointer-events-auto">
              <button 
                onClick={() => navigate('AdminDashboard')}
                className="w-12 h-12 rounded-xl bg-[#111] hover:bg-[#1A1A1A] active:scale-95 transition-all text-white border border-white/5 flex items-center justify-center shadow-lg group relative"
              >
                <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform relative z-10">arrow_back</span>
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-white leading-tight">Configuración</h1>
                <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-[0.2em]">Perfil de la Comunidad</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#111] p-1.5 rounded-xl border border-white/5 pointer-events-auto">
                <button 
                  onClick={() => setActiveTab('general')}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'general' ? 'bg-[#222] text-white shadow-md' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                >
                  General
                </button>
                <button 
                  onClick={() => setActiveTab('modules')}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'modules' ? 'bg-[#222] text-white shadow-md' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                >
                  Módulos
                </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-6 flex-1 overflow-y-auto no-scrollbar pb-32 pt-8 w-full">
          
          {activeTab === 'general' && (
            <form onSubmit={handleSave} className="space-y-8 animate-fade-in">
                
                {/* Brand Logo Section */}
                <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl flex flex-col md:flex-row gap-8 items-center border-l-4 border-l-ediflow-primary">
                   <div className="w-32 h-32 rounded-2xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                      <span className="material-symbols-outlined text-5xl text-white/20 group-hover:scale-110 transition-transform">domain</span>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <span className="text-[10px] uppercase tracking-widest font-bold text-white">Subir Logo</span>
                      </div>
                   </div>
                   <div className="flex-1 text-center md:text-left">
                      <h2 className="text-xl font-light tracking-tight text-white mb-2">Identidad Visual</h2>
                      <p className="text-sm text-gray-400">Sube el logo de tu edificio para personalizar las boletas de gastos comunes y la interfaz de los residentes. <br/>(Recomendado: 512x512px, PNG transparente).</p>
                   </div>
                </div>

                {/* Legal Information */}
                <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 pb-4 border-b border-white/5">Datos Administrativos</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                            Nombre del Edificio / Condominio
                          </label>
                          <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white focus:outline-none focus:border-ediflow-primary/50 focus:bg-[#141414] focus:ring-1 focus:ring-ediflow-primary/50 transition-all text-sm font-medium"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                            RUT de la Comunidad
                          </label>
                          <input 
                            type="text" 
                            value={formData.rut}
                            onChange={(e) => setFormData({...formData, rut: e.target.value})}
                            className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white focus:outline-none focus:border-white/20 focus:bg-[#141414] transition-all font-mono tracking-widest text-sm"
                            required
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                            Dirección Completa
                          </label>
                          <input 
                            type="text" 
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white focus:outline-none focus:border-white/20 focus:bg-[#141414] transition-all text-sm"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                            Cantidad de Unidades (Deptos/Casas)
                          </label>
                          <input 
                            type="number" 
                            value={formData.unitsCount}
                            onChange={(e) => setFormData({...formData, unitsCount: e.target.value})}
                            className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white focus:outline-none focus:border-white/20 focus:bg-[#141414] transition-all font-mono text-sm"
                          />
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 pb-4 border-b border-white/5">Contacto Principal (Administración)</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                            Correo Electrónico Principal
                          </label>
                          <input 
                            type="email" 
                            value={formData.adminEmail}
                            onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                            className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white focus:outline-none focus:border-white/20 focus:bg-[#141414] transition-all text-sm font-medium"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                            Teléfono Fijo / Celular Oficial
                          </label>
                          <input 
                            type="text" 
                            value={formData.adminPhone}
                            onChange={(e) => setFormData({...formData, adminPhone: e.target.value})}
                            className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white focus:outline-none focus:border-white/20 focus:bg-[#141414] transition-all font-mono tracking-widest text-sm"
                            required
                          />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                     type="submit"
                     className="px-8 py-4 rounded-xl bg-ediflow-primary text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-all active:scale-95 shadow-[0_0_20px_rgba(0,174,239,0.2)] flex items-center gap-2"
                  >
                     Guardar Configuración <span className="material-symbols-outlined text-[18px]">save</span>
                  </button>
                </div>
            </form>
          )}

          {activeTab === 'modules' && (
             <div className="space-y-6 animate-fade-in">
                <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                    <div className="flex items-center justify-between mb-2">
                       <div>
                         <h3 className="text-lg font-medium tracking-tight text-white mb-1">Módulos Activos</h3>
                         <p className="text-sm text-gray-400">Activa o desactiva las funcionalidades para los residentes y conserjes del edificio.</p>
                       </div>
                       <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-green-500/20">Suscripción SaaS Activa</span>
                    </div>

                    <div className="mt-8 space-y-4">
                       {[
                         { id: '1', name: 'Gestión de Paquetes', desc: 'Registro, trazabilidad y notificaciones de entrada/salida de encomiendas.', active: true },
                         { id: '2', name: 'Libro de Novedades (Bitácora)', desc: 'Registro digital de sucesos, con lectura mediante OCR y dictado de voz para conserjería.', active: true },
                         { id: '3', name: 'Control de Visitas', desc: 'Registro automatizado de visitas, con códigos de acceso.', active: true },
                         { id: '4', name: 'Reservas de Áreas Comunes', desc: 'Sistema de agendamiento para piscinas, quinchos y salas multiuso.', active: true },
                         { id: '5', name: 'Pago de Gastos Comunes', desc: 'Integración bancaria pasarela para residentes.', active: false },
                       ].map(module => (
                          <div key={module.id} className={`p-5 rounded-2xl border ${module.active ? 'bg-white/5 border-ediflow-primary/30' : 'bg-[#0A0A0A] border-white/5'} flex items-center justify-between transition-colors`}>
                             <div>
                               <h4 className={`text-sm font-bold ${module.active ? 'text-ediflow-primary' : 'text-gray-400'}`}>{module.name}</h4>
                               <p className="text-xs text-gray-500 mt-1">{module.desc}</p>
                             </div>
                             
                             <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${module.active ? 'bg-ediflow-primary' : 'bg-[#222]'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${module.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                             </div>
                          </div>
                       ))}
                    </div>
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default BuildingSettings;
