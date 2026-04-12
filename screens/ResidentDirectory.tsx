import React, { useState } from 'react';
import { ScreenName } from '../App';
import { UserRole } from '../src/types';
import { Button } from '../src/components/ui/Button';
import { Input } from '../src/components/ui/Input';
import { Card } from '../src/components/ui/Card';
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
    <div className="flex flex-col min-h-full bg-gray-100 dark:bg-[#000000] relative items-center">
      <div className="w-full max-w-7xl flex flex-col h-full">
        
        {/* Sticky Header & Search */}
        <header className="px-6 pt-10 pb-6 bg-gray-100 dark:bg-[#000000] sticky top-0 z-20 border-b-2 border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  if (role === 'admin') navigate('AdminDashboard');
                  else navigate('ConciergeDashboard');
                }}
                className="w-12 h-12 rounded-full bg-white dark:bg-[#121212] flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#1A1A1A] active:scale-90 transition-all border-2 border-gray-200 dark:border-gray-800"
              >
                <span className="material-symbols-outlined text-2xl">arrow_back</span>
              </button>
              <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">Directorio</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">Gestión de Residentes</p>
              </div>
            </div>

            {role === 'admin' && (
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsImportModalOpen(true)}
                  icon="upload_file"
                >
                  Importar Excel
                </Button>
                <Button 
                  onClick={() => setIsAddModalOpen(true)}
                  icon="add"
                  className="bg-[#00AEEF] hover:bg-[#0090C5] text-white border-none"
                >
                  Nuevo
                </Button>
              </div>
            )}
          </div>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-3xl text-gray-400">search</span>
            <input 
              type="text"
              placeholder="Buscar por nombre, depto o patente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 pl-16 pr-6 rounded-full border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] text-xl text-gray-900 dark:text-white focus:border-[#00AEEF] focus:ring-0 transition-colors"
            />
          </div>
        </header>

        {/* Content */}
        <div className="p-6 md:p-10 flex-1 overflow-y-auto no-scrollbar pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResidents.map(resident => (
              <Card key={resident.id} className="flex flex-col h-full">
                <div className="flex items-start gap-4 mb-6">
                  <img 
                    src={resident.photoUrl} 
                    alt={resident.name} 
                    className="w-20 h-20 rounded-full object-cover border-4 border-[#00AEEF]"
                  />
                  <div>
                    <h3 className="text-4xl font-black text-[#00AEEF] leading-none mb-1">{resident.depto}</h3>
                    <p className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{resident.name}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {resident.bodega && (
                    <span className="bg-gray-100 dark:bg-[#1A1A1A] px-3 py-1.5 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-800 flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">inventory_2</span> {resident.bodega}
                    </span>
                  )}
                  {resident.parking && (
                    <span className="bg-gray-100 dark:bg-[#1A1A1A] px-3 py-1.5 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-800 flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">directions_car</span> {resident.parking}
                    </span>
                  )}
                  {resident.pets && (
                    <span className="bg-gray-100 dark:bg-[#1A1A1A] px-3 py-1.5 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-800 flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">pets</span> {resident.pets}
                    </span>
                  )}
                </div>

                <div className="mt-auto space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1A1A1A] rounded-xl border-2 border-gray-200 dark:border-gray-800">
                    <span className="text-sm font-bold text-gray-500 uppercase">Cuenta Web</span>
                    {resident.hasAccount ? (
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold text-sm">
                        <span className="material-symbols-outlined text-base">check_circle</span> Activa
                      </span>
                    ) : (
                      <button className="text-[#00AEEF] font-bold text-sm hover:underline flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">send</span> Invitar
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 dark:bg-[#1A1A1A] hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-bold transition-colors border-2 border-gray-200 dark:border-gray-800">
                      <span className="material-symbols-outlined">call</span>
                      Llamar
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] font-bold transition-colors border-2 border-[#25D366]/30">
                      <span className="material-symbols-outlined">chat</span>
                      WhatsApp
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {filteredResidents.length === 0 && (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700 mb-4">search_off</span>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">No se encontraron residentes</h3>
              <p className="text-lg text-gray-500">Intente con otro término de búsqueda.</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#121212] w-full max-w-2xl rounded-3xl border-2 border-gray-200 dark:border-gray-800 shadow-2xl p-8 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Nuevo Residente</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                <span className="material-symbols-outlined text-3xl">close</span>
              </button>
            </div>
            
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
              <div className="flex flex-col items-center mb-8">
                <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-[#1A1A1A] border-4 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center mb-4 cursor-pointer hover:border-[#00AEEF] transition-colors">
                  <span className="material-symbols-outlined text-4xl text-gray-400">add_a_photo</span>
                </div>
                <span className="text-sm font-bold text-[#00AEEF]">Subir Foto</span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-gray-800 pb-2">Datos Personales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Nombre Completo" placeholder="Ej. Juan Pérez" required />
                <Input label="Teléfono" placeholder="Ej. +56 9 1234 5678" required />
                <Input label="Correo Electrónico" type="email" placeholder="Ej. juan@correo.com" className="md:col-span-2" required />
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-gray-800 pb-2 mt-8">Datos de Unidad</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Nº Departamento" placeholder="Ej. 402" required />
                <Input label="Bodega (Opcional)" placeholder="Ej. B-12" />
                <Input label="Estacionamiento (Opcional)" placeholder="Ej. E-45" />
                <Input label="Mascotas (Opcional)" placeholder="Ej. 1 Perro" />
              </div>

              <div className="mt-10 flex justify-end gap-4 pt-6 border-t-2 border-gray-200 dark:border-gray-800">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-[#00AEEF] hover:bg-[#0090C5] text-white border-none">Guardar Residente</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ResidentDirectory;
