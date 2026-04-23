import React, { useState } from 'react';
import { ScreenName } from '../App';
import { UserRole } from '../src/types';

interface Props {
  navigate: (screen: ScreenName) => void;
  role: UserRole;
}

interface Resident {
  id: string;
  name: string;
  depto: string;
  phone?: string;
  email: string;
  bodega?: string;
  parking?: string;
  hasAccount: boolean;
}

const DUMMY_RESIDENTS: Resident[] = [
  {
    id: '1',
    name: 'María González',
    depto: '402',
    phone: '+56 9 1234 5678',
    email: 'maria.g@ediflow.cl',
    bodega: 'B-12',
    parking: 'E-45',
    hasAccount: true
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    depto: '1105',
    phone: '+56 9 8765 4321',
    email: 'carlos.r@ediflow.cl',
    parking: 'E-12',
    hasAccount: false
  },
  {
    id: '3',
    name: 'Ana Silva',
    depto: '201',
    phone: '+56 9 5555 6666',
    email: 'ana.s@ediflow.cl',
    bodega: 'B-05',
    hasAccount: true
  }
];

const ResidentDirectory: React.FC<Props> = ({ navigate, role }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [residents, setResidents] = useState<Resident[]>(DUMMY_RESIDENTS);
  const [isAddMode, setIsAddMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    depto: '',
    email: '',
    phone: '',
    bodega: '',
    parking: ''
  });

  const showToast = (msg: string) => {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3000);
      setIsAddMode(false);
  };

  const handleSaveResident = (e: React.FormEvent) => {
      e.preventDefault();
      
      const newResident: Resident = {
          id: Math.random().toString(),
          name: formData.name,
          depto: formData.depto,
          email: formData.email,
          phone: formData.phone || undefined,
          bodega: formData.bodega || undefined,
          parking: formData.parking || undefined,
          hasAccount: true
      };

      setResidents(prev => [newResident, ...prev]);
      showToast("Unidad registrada exitosamente. Acceso enviado al correo.");
      setFormData({ name: '', depto: '', email: '', phone: '', bodega: '', parking: '' });
  };

  const filteredResidents = residents.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.depto.includes(searchQuery) ||
    (r.parking && r.parking.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white font-sans overflow-x-hidden relative items-center selection:bg-white/10">
      <div className="w-full max-w-7xl flex flex-col h-full relative z-10">
        
        {/* Toast Notification */}
        {toastMessage && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2 animate-fade-in-up whitespace-nowrap">
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                {toastMessage}
            </div>
        )}

        {/* Sticky Header */}
        <header className="px-6 md:px-10 pt-8 md:pt-12 pb-6 sticky top-0 z-20 bg-[#0A0A0A]/90 backdrop-blur-3xl border-b border-white/5 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 pointer-events-auto">
              <button 
                onClick={() => {
                  if (role === 'admin') navigate('AdminDashboard');
                  else navigate('ConciergeDashboard');
                }}
                className="w-12 h-12 rounded-xl bg-[#111] hover:bg-[#1A1A1A] active:scale-95 transition-all text-white border border-white/5 flex items-center justify-center shadow-lg group relative"
              >
                <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform relative z-10">arrow_back</span>
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-white leading-tight">Comunidad</h1>
                <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-[0.2em]">Gestión de Unidades</p>
              </div>
            </div>

            {role === 'admin' && !isAddMode && (
              <div className="flex gap-3 pointer-events-auto">
                <button 
                  onClick={() => alert('Simulación: Importar desde Excel')}
                  className="bg-[#111] hover:bg-[#1A1A1A] border border-white/5 text-gray-400 hover:text-white rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] flex items-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">table_chart</span>
                  Importar CSV/Excel
                </button>
                <button 
                  onClick={() => setIsAddMode(true)}
                  className="bg-ediflow-primary text-black hover:bg-white text-xs font-bold uppercase tracking-widest rounded-xl px-5 py-3 transition-all shadow-[0_0_15px_rgba(0,174,239,0.3)] active:scale-[0.98] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Crear Unidad
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="px-6 md:px-10 flex-1 overflow-y-auto no-scrollbar pb-32 pt-6 w-full">
          
          {isAddMode ? (
             <form onSubmit={handleSaveResident} className="max-w-3xl mx-auto space-y-6">
                 <div className="flex justify-between items-center mb-2">
                     <h2 className="text-2xl tracking-tight font-medium">Registrar Unidad</h2>
                     <button 
                       type="button" 
                       onClick={() => setIsAddMode(false)}
                       className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                     >
                       Cancelar
                     </button>
                 </div>
                 
                 <div className="bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl group hover:border-white/10 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                            Depto / Casa <span className="text-ediflow-primary ml-1">*</span>
                          </label>
                          <input 
                            type="text" 
                            value={formData.depto}
                            onChange={(e) => setFormData({...formData, depto: e.target.value})}
                            placeholder="Ej. 1402"
                            className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white placeholder-gray-600 focus:outline-none focus:border-ediflow-primary/50 focus:bg-[#141414] focus:ring-1 focus:ring-ediflow-primary/50 transition-all font-mono tracking-widest text-sm"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                            Responsable Titular <span className="text-ediflow-primary ml-1">*</span>
                          </label>
                          <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Nombres y Apellidos"
                            className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white placeholder-gray-600 focus:outline-none focus:border-ediflow-primary/50 focus:bg-[#141414] focus:ring-1 focus:ring-ediflow-primary/50 transition-all text-sm font-medium"
                            required
                          />
                        </div>
                        <div className="space-y-2 lg:col-span-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                            Correo de Acceso (App) <span className="text-ediflow-primary ml-1">*</span>
                          </label>
                          <input 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="correo@ejemplo.com"
                            className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white placeholder-gray-600 focus:outline-none focus:border-ediflow-primary/50 focus:bg-[#141414] focus:ring-1 focus:ring-ediflow-primary/50 transition-all text-sm font-medium"
                            required
                          />
                          <p className="text-[10px] text-gray-500 px-1 pt-1 opacity-70">El sistema enviará una clave de acceso única a este correo.</p>
                        </div>
                    </div>
                 </div>

                 <div className="bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl group hover:border-white/10 transition-colors">
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Datos Operativos (Visibles Conserjería)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                            Celular Contacto
                          </label>
                          <input 
                            type="text" 
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="+56 9 •••• ••••"
                            className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-[#141414] transition-all text-sm font-medium"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                                Bodega
                              </label>
                              <input 
                                type="text" 
                                value={formData.bodega}
                                onChange={(e) => setFormData({...formData, bodega: e.target.value})}
                                placeholder="Ej: B-12"
                                className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-[#141414] transition-all font-mono tracking-widest text-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                                Estac.
                              </label>
                              <input 
                                type="text" 
                                value={formData.parking}
                                onChange={(e) => setFormData({...formData, parking: e.target.value})}
                                placeholder="Ej: E-45"
                                className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-[#141414] transition-all font-mono tracking-widest text-sm"
                              />
                            </div>
                        </div>
                    </div>
                 </div>
                 
                 <div className="flex justify-end pt-4 gap-4">
                    <button 
                       type="submit"
                       disabled={!formData.name || !formData.depto || !formData.email}
                       className="px-8 py-4 rounded-xl bg-ediflow-primary text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-all active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center gap-2"
                    >
                       Guardar y Enviar Acceso <span className="material-symbols-outlined text-[18px]">send</span>
                    </button>
                 </div>
              </form>
          ) : (
            <>
              {/* Search Bar */}
              <div className="relative mb-8 w-full max-w-2xl">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-xl text-gray-500">search</span>
                <input 
                  type="text"
                  placeholder="Buscar depto, residente o estacionamiento..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-6 rounded-xl border border-white/5 bg-[#111] focus:bg-[#141414] text-sm text-white focus:border-ediflow-primary/50 outline-none transition-all shadow-inner"
                />
              </div>

              {/* Data Table Approach (List view) */}
              <div className="w-full bg-[#111] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-5 border-b border-white/5 bg-[#0A0A0A]/50">
                   <div className="col-span-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Unidad</div>
                   <div className="col-span-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Titular & Contacto</div>
                   <div className="col-span-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Anexos Operativos</div>
                   <div className="col-span-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Cuenta App</div>
                </div>

                <div className="divide-y divide-white/5">
                  {filteredResidents.map(resident => (
                    <div key={resident.id} className="p-6 md:px-8 md:py-6 hover:bg-[#141414] transition-colors grid grid-cols-1 md:grid-cols-12 gap-4 items-center group">
                       
                       <div className="col-span-2 flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                             <span className="text-xl font-light text-ediflow-primary tracking-tighter">{resident.depto}</span>
                          </div>
                          <span className="md:hidden text-[10px] font-bold uppercase tracking-widest text-gray-500">Unidad</span>
                       </div>

                       <div className="col-span-4 flex flex-col mt-2 md:mt-0">
                          <span className="text-sm font-medium text-white">{resident.name}</span>
                          <span className="text-xs text-gray-500 mt-0.5">{resident.email}</span>
                          {resident.phone && (
                            <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-mono flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">smartphone</span> {resident.phone}
                            </span>
                          )}
                       </div>

                       <div className="col-span-3 flex flex-wrap gap-2 mt-2 md:mt-0">
                         {resident.bodega && (
                            <span className="px-2.5 py-1 bg-[#0A0A0A] border border-white/5 rounded text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                              Bod: {resident.bodega}
                            </span>
                         )}
                         {resident.parking && (
                            <span className="px-2.5 py-1 bg-[#0A0A0A] border border-white/5 rounded text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                              Est: {resident.parking}
                            </span>
                         )}
                         {!resident.bodega && !resident.parking && (
                            <span className="text-[10px] text-gray-600 uppercase tracking-widest italic">N/A</span>
                         )}
                       </div>

                       <div className="col-span-3 flex items-center justify-start md:justify-end gap-3 mt-4 md:mt-0">
                          {resident.hasAccount ? (
                             <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                               <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Vinculado
                             </span>
                          ) : (
                             <button className="px-3 py-1.5 bg-[#0A0A0A] border border-white/10 text-gray-400 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:text-white hover:border-white/30 hover:bg-white/5 transition-all outline-none">
                               Enviar Acceso
                             </button>
                          )}
                          
                          {role === 'admin' && (
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors outline-none shrink-0 border border-transparent hover:border-white/10">
                                <span className="material-symbols-outlined text-[18px]">more_vert</span>
                            </button>
                          )}
                       </div>

                    </div>
                  ))}
                  
                  {filteredResidents.length === 0 && (
                    <div className="text-center py-20 px-6">
                      <span className="material-symbols-outlined text-4xl text-gray-600 mb-3 opacity-50">quick_reference_all</span>
                      <h3 className="text-lg font-light tracking-tight text-white">No hay registros</h3>
                      <p className="text-xs text-gray-500 mt-1">Busque otro término o cree una unidad nueva.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default ResidentDirectory;
