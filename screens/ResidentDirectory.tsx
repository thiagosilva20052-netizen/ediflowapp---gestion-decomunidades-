import React, { useState } from 'react';
import { ScreenName } from '../App';
import { UserRole } from '../src/types';
import SmartImportModal, { ImportedResident } from '../src/components/SmartImportModal';

interface Props {
  navigate: (screen: ScreenName) => void;
  role: UserRole;
}

interface Resident {
  id: string;
  name: string;
  depto: string;
  phone: string;
  email: string;
  bodega?: string;
  parking?: string;
  pets?: string;
  hasAccount: boolean;
  photoUrl: string;
}

const DUMMY_RESIDENTS: Resident[] = [
  {
    id: '1',
    name: 'María González',
    depto: '402',
    phone: '+56 9 1234 5678',
    email: 'maria.g@example.com',
    bodega: 'B-12',
    parking: 'E-45',
    pets: '1 Perro',
    hasAccount: true,
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    depto: '1105',
    phone: '+56 9 8765 4321',
    email: 'carlos.r@example.com',
    parking: 'E-12',
    hasAccount: false,
    photoUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: '3',
    name: 'Ana Silva',
    depto: '201',
    phone: '+56 9 5555 6666',
    email: 'ana.s@example.com',
    bodega: 'B-05',
    pets: '2 Gatos',
    hasAccount: true,
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: '4',
    name: 'Familia Soto',
    depto: '804',
    phone: '+56 9 9999 0000',
    email: 'fsoto@example.com',
    parking: 'E-88',
    hasAccount: false,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
];

const ResidentDirectory: React.FC<Props> = ({ navigate, role }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [residents, setResidents] = useState<Resident[]>(DUMMY_RESIDENTS);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleImport = (importedData: ImportedResident[]) => {
    const newResidents: Resident[] = importedData.map(data => ({
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      depto: data.depto,
      phone: data.phone,
      email: data.email,
      bodega: data.bodega,
      parking: data.parking,
      hasAccount: false,
      photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=00AEEF&color=fff&size=256`
    }));

    setResidents(prev => [...newResidents, ...prev]);
  };

  const filteredResidents = residents.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.depto.includes(searchQuery) ||
    (r.parking && r.parking.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white font-sans overflow-x-hidden relative items-center selection:bg-white/10">
      <div className="w-full max-w-7xl flex flex-col h-full relative z-10">
        
        {/* Sticky Header & Search */}
        <header className="px-6 md:px-10 pt-8 md:pt-12 pb-6 sticky top-0 z-20 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-transparent pointer-events-none md:bg-none">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-4 pointer-events-auto">
              <button 
                onClick={() => {
                  if (role === 'admin') navigate('AdminDashboard');
                  else navigate('ConciergeDashboard');
                }}
                className="w-12 h-12 rounded-full bg-[#111] hover:bg-white/10 active:scale-95 transition-all text-white border border-white/10 flex items-center justify-center shadow-lg hover:border-white/20"
              >
                <span className="material-symbols-outlined text-2xl">arrow_back</span>
              </button>
              <div>
                <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white leading-tight">Directorio</h1>
                <p className="text-xs md:text-sm text-gray-500 mt-1 uppercase font-semibold tracking-widest">Gestión de Residentes</p>
              </div>
            </div>

            {role === 'admin' && (
              <div className="flex gap-4 pointer-events-auto">
                <button 
                  onClick={() => setIsImportModalOpen(true)}
                  className="bg-[#111] hover:bg-white/10 border border-white/20 text-white rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">upload_file</span>
                  Importar Excel
                </button>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-ediflow-primary text-black hover:bg-white border text-xs font-bold uppercase tracking-widest rounded-xl px-5 py-3 transition-all shadow-[0_0_15px_rgba(0,174,239,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] active:scale-[0.98] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Nuevo
                </button>
              </div>
            )}
          </div>

          <div className="relative pointer-events-auto">
            <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-2xl text-gray-400">search</span>
            <input 
              type="text"
              placeholder="Buscar por nombre, depto o patente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-14 pr-6 rounded-2xl border border-white/10 bg-[#111] focus:bg-[#141414] text-sm text-white focus:border-ediflow-primary/50 focus:ring-0 outline-none transition-all shadow-inner"
            />
          </div>
        </header>

        {/* Content */}
        <div className="px-6 md:px-10 flex-1 overflow-y-auto no-scrollbar pb-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResidents.map(resident => (
              <div key={resident.id} className="bg-[#111] border border-white/5 rounded-[2rem] p-6 flex flex-col h-full hover:border-white/10 transition-all shadow-xl relative overflow-hidden group">
                {/* Minimal Glow Component */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-ediflow-primary/10 rounded-full blur-[50px] pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity"></div>
                
                <div className="flex items-start gap-4 mb-6 relative z-10">
                  <div className="relative shrink-0">
                    <img 
                      src={resident.photoUrl} 
                      alt={resident.name} 
                      className="w-16 h-16 rounded-2xl object-cover border border-white/10"
                    />
                    {resident.hasAccount && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#111] rounded-full flex items-center justify-center"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-light text-ediflow-primary leading-none mb-1">{resident.depto}</h3>
                    <p className="text-base font-medium text-white leading-tight">{resident.name}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{resident.phone}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                  {resident.bodega && (
                    <span className="bg-[#0A0A0A] px-2 py-1 rounded-lg text-[10px] font-semibold text-gray-400 border border-white/5 flex items-center gap-1 uppercase tracking-widest">
                      <span className="material-symbols-outlined text-[12px]">inventory_2</span> B. {resident.bodega}
                    </span>
                  )}
                  {resident.parking && (
                    <span className="bg-[#0A0A0A] px-2 py-1 rounded-lg text-[10px] font-semibold text-gray-400 border border-white/5 flex items-center gap-1 uppercase tracking-widest">
                      <span className="material-symbols-outlined text-[12px]">directions_car</span> E. {resident.parking}
                    </span>
                  )}
                  {resident.pets && (
                    <span className="bg-[#0A0A0A] px-2 py-1 rounded-lg text-[10px] font-semibold text-gray-400 border border-white/5 flex items-center gap-1 uppercase tracking-widest">
                      <span className="material-symbols-outlined text-[12px]">pets</span> {resident.pets}
                    </span>
                  )}
                </div>

                <div className="mt-auto space-y-3 relative z-10">
                  {!resident.hasAccount && (
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cuenta Web</span>
                      <button className="text-ediflow-primary font-bold text-[10px] uppercase tracking-widest flex items-center gap-1 hover:text-white transition-colors active:scale-95">
                        <span className="material-symbols-outlined text-[14px]">send</span> Invitar
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-white/10 text-white font-medium text-xs transition-all border border-white/5 active:scale-[0.98]">
                      <span className="material-symbols-outlined text-[16px]">call</span>
                      Llamar
                    </button>
                    <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] font-medium text-xs transition-all border border-[#25D366]/30 active:scale-[0.98]">
                      <span className="material-symbols-outlined text-[16px]">chat</span>
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredResidents.length === 0 && (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-gray-600 mb-4 opacity-50">search_off</span>
              <h3 className="text-xl font-light tracking-tight text-white">No se encontraron residentes</h3>
              <p className="text-sm text-gray-500 mt-2">Intente con otro término de búsqueda.</p>
            </div>
          )}
        </div>
      </div>

      {/* Import Modal */}
      <SmartImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onImport={handleImport}
        existingResidents={residents}
      />

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-[#0A0A0A]/90 backdrop-blur-md animate-fade-in">
          <div className="bg-[#111] w-full max-w-2xl rounded-[2.5rem] border border-white/10 shadow-2xl p-6 md:p-10 max-h-[90vh] overflow-y-auto custom-scrollbar animate-fade-in-up">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-light tracking-tight text-white mb-1">Nuevo Residente</h2>
                <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-500">Añadir Manualmente</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors active:scale-95">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
              <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center mb-3 cursor-pointer hover:border-ediflow-primary/50 transition-colors group">
                  <span className="material-symbols-outlined text-3xl text-gray-500 group-hover:text-ediflow-primary transition-colors">add_a_photo</span>
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Subir Foto</span>
              </div>

              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2 mb-4">Datos Personales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1 pt-2">Nombre Completo</label>
                   <input className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-ediflow-primary outline-none transition-colors" placeholder="Ej. Juan Pérez" required />
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1 pt-2">Teléfono</label>
                   <input className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-ediflow-primary outline-none transition-colors" placeholder="Ej. +56 9 1234 5678" required />
                </div>
                <div className="md:col-span-2">
                   <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1 pt-2">Correo Electrónico</label>
                   <input type="email" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-ediflow-primary outline-none transition-colors" placeholder="Ej. juan@correo.com" required />
                </div>
              </div>

              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2 mt-8 mb-4">Datos de Unidad</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1 pt-2">Nº Depto</label>
                   <input className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-ediflow-primary outline-none transition-colors" placeholder="Ej. 402" required />
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1 pt-2">Bodega</label>
                   <input className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-ediflow-primary outline-none transition-colors" placeholder="Ej. B-01" />
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1 pt-2">Estacionamiento</label>
                   <input className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-ediflow-primary outline-none transition-colors" placeholder="Ej. E-01" />
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1 pt-2">Mascotas</label>
                   <input className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-ediflow-primary outline-none transition-colors" placeholder="Ej. 1 Perro" />
                </div>
              </div>

              <div className="mt-10 flex flex-col md:flex-row justify-end gap-3 pt-6 border-t border-white/5">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="w-full md:w-auto px-6 py-3.5 rounded-xl border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all text-center">Cancelar</button>
                <button type="submit" className="w-full md:w-auto bg-ediflow-primary text-black hover:bg-white px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(0,174,239,0.3)] text-center">Guardar Residente</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ResidentDirectory;
