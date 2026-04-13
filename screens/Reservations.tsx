import React, { useState } from 'react';
import { ScreenName } from '../App';
import { UserRole, CommonArea, Reservation } from '../src/types';
import { useAppContext } from '../src/context/AppContext';
import { Logo } from '../components/Logo';
import { Card } from '../src/components/ui/Card';
import { Button } from '../src/components/ui/Button';
import { Input } from '../src/components/ui/Input';

interface Props {
  navigate: (screen: ScreenName) => void;
  role: UserRole;
  from?: ScreenName | null;
}

const COMMON_AREAS: CommonArea[] = [
  { id: '1', name: 'Quincho Azotea', icon: 'outdoor_grill', capacity: 15, price: 15000, description: 'Quincho equipado con parrilla, mesas y vista panorámica.' },
  { id: '2', name: 'Sala Multiuso', icon: 'groups', capacity: 30, price: 25000, description: 'Espacio climatizado para eventos, cumpleaños y reuniones.' },
  { id: '3', name: 'Gimnasio', icon: 'fitness_center', capacity: 8, price: 0, description: 'Equipamiento completo de pesas y máquinas de cardio.' },
  { id: '4', name: 'Piscina', icon: 'pool', capacity: 20, price: 0, description: 'Piscina exterior con reposeras y zona de descanso.' },
  { id: '5', name: 'Cancha de Pádel', icon: 'sports_tennis', capacity: 4, price: 5000, description: 'Cancha de pádel profesional con iluminación nocturna.' },
];

const MOCK_RESERVATIONS: Reservation[] = [
  { 
    id: 'res-1', 
    areaId: '1', 
    areaName: 'Quincho Azotea', 
    userId: 'user-1', 
    userName: 'Carlos Mendoza', 
    apartment: '402', 
    date: '2024-04-15', 
    startTime: '18:00', 
    endTime: '22:00', 
    guestsCount: 10, 
    status: 'confirmed', 
    createdAt: '2024-04-10T10:00:00Z' 
  },
  { 
    id: 'res-2', 
    areaId: '5', 
    areaName: 'Cancha de Pádel', 
    userId: 'user-2', 
    userName: 'Ana Silva', 
    apartment: '1105', 
    date: '2024-04-14', 
    startTime: '10:00', 
    endTime: '11:30', 
    guestsCount: 4, 
    status: 'confirmed', 
    createdAt: '2024-04-12T15:30:00Z' 
  },
  { 
    id: 'res-3', 
    areaId: '2', 
    areaName: 'Sala Multiuso', 
    userId: 'user-3', 
    userName: 'Roberto Gómez', 
    apartment: '201', 
    date: '2024-04-20', 
    startTime: '15:00', 
    endTime: '19:00', 
    guestsCount: 20, 
    status: 'pending', 
    createdAt: '2024-04-13T09:15:00Z' 
  },
];

const Reservations: React.FC<Props> = ({ navigate, role, from }) => {
  const { currentUser } = useAppContext();
  const [view, setView] = useState<'browse' | 'form' | 'my-reservations' | 'all-reservations' | 'stats'>(
    role === 'resident' ? 'browse' : 'all-reservations'
  );
  const [selectedArea, setSelectedArea] = useState<CommonArea | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
  
  // Form state
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    guestsCount: 1,
  });

  const handleBack = () => {
    if (view === 'form') {
      setView('browse');
      return;
    }
    if (from) {
      navigate(from);
    } else {
      if (role === 'admin') navigate('AdminDashboard');
      else if (role === 'concierge') navigate('ConciergeDashboard');
      else navigate('ResidentServices');
    }
  };

  const handleBook = (area: CommonArea) => {
    setSelectedArea(area);
    setView('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      areaId: selectedArea!.id,
      areaName: selectedArea!.name,
      userId: currentUser?.id || 'anon',
      userName: currentUser?.name || 'Residente',
      apartment: currentUser?.apartment || 'N/A',
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      guestsCount: formData.guestsCount,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setReservations([newRes, ...reservations]);
    setView('my-reservations');
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'pending': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#0A0A0A]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/5 p-4">
        <div className="flex justify-between items-center max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBack} 
              className="w-10 h-10 rounded-full bg-[#141414] flex items-center justify-center text-white hover:bg-[#1F1F1F] active:scale-90 transition-all border border-white/5"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h1 className="text-lg font-black text-white uppercase tracking-tight">Módulo de Reservas</h1>
              <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em]">Áreas Comunes y Disponibilidad</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Logo variant="icon" className="w-8 h-8 opacity-50" />
          </div>
        </div>
      </header>

      {/* Sub-navigation */}
      <nav className="bg-[#111111] border-b border-white/5 px-4 overflow-x-auto no-scrollbar">
        <div className="max-w-5xl mx-auto flex gap-6">
          {role === 'resident' && (
            <>
              <button 
                onClick={() => setView('browse')}
                className={`py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${view === 'browse' || view === 'form' ? 'text-orange-500 border-orange-500' : 'text-gray-500 border-transparent'}`}
              >
                Explorar Áreas
              </button>
              <button 
                onClick={() => setView('my-reservations')}
                className={`py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${view === 'my-reservations' ? 'text-orange-500 border-orange-500' : 'text-gray-500 border-transparent'}`}
              >
                Mis Reservas
              </button>
            </>
          )}
          {(role === 'concierge' || role === 'admin') && (
            <button 
              onClick={() => setView('all-reservations')}
              className={`py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${view === 'all-reservations' ? 'text-orange-500 border-orange-500' : 'text-gray-500 border-transparent'}`}
            >
              Todas las Reservas
            </button>
          )}
          {role === 'admin' && (
            <button 
              onClick={() => setView('stats')}
              className={`py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${view === 'stats' ? 'text-orange-500 border-orange-500' : 'text-gray-500 border-transparent'}`}
            >
              Estadísticas de Uso
            </button>
          )}
        </div>
      </nav>

      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full pb-32">
        
        {/* BROWSE AREAS */}
        {view === 'browse' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {COMMON_AREAS.map((area) => (
                <Card key={area.id} className="p-0 overflow-hidden group border-white/5 hover:border-orange-500/30 transition-all">
                  <div className="p-6 space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform duration-500">
                      <span className="material-symbols-outlined text-3xl">{area.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">{area.name}</h3>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed mt-1">
                        {area.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <span className="material-symbols-outlined text-sm">group</span>
                          {area.capacity} pers.
                        </div>
                        {area.price! > 0 && (
                          <div className="flex items-center gap-1 text-[10px] font-black text-orange-500 uppercase tracking-widest">
                            <span className="material-symbols-outlined text-sm">payments</span>
                            ${area.price?.toLocaleString()}
                          </div>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-orange-500 hover:bg-orange-400 text-white font-black uppercase text-[10px] tracking-widest rounded-xl"
                        onClick={() => handleBook(area)}
                      >
                        Reservar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* RESERVATION FORM */}
        {view === 'form' && selectedArea && (
          <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 p-6 bg-orange-500/5 rounded-[32px] border border-orange-500/20">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                <span className="material-symbols-outlined text-4xl">{selectedArea.icon}</span>
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">{selectedArea.name}</h2>
                <p className="text-sm text-gray-400 font-medium">Capacidad máxima: {selectedArea.capacity} personas</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="Fecha de Reserva"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
                <Input 
                  label="Cantidad de Invitados"
                  type="number"
                  min={1}
                  max={selectedArea.capacity}
                  value={formData.guestsCount}
                  onChange={(e) => setFormData({...formData, guestsCount: parseInt(e.target.value)})}
                  required
                />
                <Input 
                  label="Hora Inicio"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  required
                />
                <Input 
                  label="Hora Fin"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  required
                />
              </div>

              <div className="p-6 bg-[#141414] rounded-3xl border border-white/5 space-y-4">
                <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">Resumen de Costos</h4>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400 font-medium">Uso de {selectedArea.name}</span>
                  <span className="text-lg font-black text-white">${selectedArea.price?.toLocaleString() || '0'}</span>
                </div>
                <p className="text-[10px] text-gray-600 font-bold uppercase leading-relaxed">
                  * El costo será cargado a su próximo gasto común una vez confirmada la reserva.
                </p>
              </div>

              <Button 
                type="submit" 
                fullWidth 
                className="h-16 bg-orange-500 hover:bg-orange-400 text-white font-black text-lg uppercase tracking-widest rounded-2xl shadow-xl shadow-orange-900/20"
              >
                Confirmar Solicitud
              </Button>
            </form>
          </div>
        )}

        {/* MY RESERVATIONS (Resident) */}
        {view === 'my-reservations' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {reservations.filter(r => r.userId === currentUser?.id || r.userId === 'anon').length === 0 ? (
              <div className="text-center py-20 bg-[#141414] rounded-[40px] border border-dashed border-white/10">
                <span className="material-symbols-outlined text-6xl text-gray-700 mb-4">event_busy</span>
                <p className="text-gray-500 font-bold">No tienes reservas activas.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {reservations.filter(r => r.userId === currentUser?.id || r.userId === 'anon').map((res) => (
                  <Card key={res.id} className="p-6 bg-[#141414] border-white/5 hover:border-orange-500/20 transition-all rounded-[32px]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                          <span className="material-symbols-outlined">{COMMON_AREAS.find(a => a.id === res.areaId)?.icon || 'event'}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-white">{res.areaName}</h3>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{res.date} • {res.startTime} - {res.endTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-[10px] font-black px-3 py-1 rounded-lg border uppercase tracking-widest ${getStatusColor(res.status)}`}>
                          {res.status}
                        </span>
                        <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ALL RESERVATIONS (Concierge / Admin) */}
        {view === 'all-reservations' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Search / Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">search</span>
                <input 
                  type="text" 
                  placeholder="Buscar por departamento o nombre..."
                  className="w-full h-12 pl-12 pr-4 bg-[#141414] border border-white/5 rounded-xl text-white outline-none focus:border-orange-500/50 transition-all"
                />
              </div>
              <div className="flex gap-2">
                <button className="px-4 h-12 bg-[#141414] border border-white/5 rounded-xl text-xs font-black text-gray-400 uppercase tracking-widest hover:text-white">Hoy</button>
                <button className="px-4 h-12 bg-[#141414] border border-white/5 rounded-xl text-xs font-black text-gray-400 uppercase tracking-widest hover:text-white">Mañana</button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {reservations.map((res) => (
                <div key={res.id} className="bg-[#141414] rounded-[32px] border border-white/5 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-orange-500/20 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center text-gray-500 group-hover:text-orange-500 transition-colors">
                      <span className="material-symbols-outlined text-3xl">{COMMON_AREAS.find(a => a.id === res.areaId)?.icon || 'event'}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-black text-white">{res.areaName}</h3>
                        <span className="text-[10px] font-black bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded uppercase">Depto {res.apartment}</span>
                      </div>
                      <p className="text-sm text-gray-400 font-bold">{res.userName}</p>
                      <p className="text-xs text-gray-600 font-bold uppercase tracking-widest mt-1">{res.date} • {res.startTime} - {res.endTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                    <div className="text-right hidden md:block mr-4">
                      <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Invitados</p>
                      <p className="text-sm font-black text-white">{res.guestsCount}</p>
                    </div>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-lg border uppercase tracking-widest ${getStatusColor(res.status)}`}>
                      {res.status}
                    </span>
                    {role === 'admin' && res.status === 'pending' && (
                      <div className="flex gap-2">
                        <button className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all">
                          <span className="material-symbols-outlined">check</span>
                        </button>
                        <button className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                          <span className="material-symbols-outlined">close</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STATS VIEW (Admin) */}
        {view === 'stats' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-orange-500/10 to-transparent p-8 rounded-[40px] border border-orange-500/20">
                <p className="text-xs font-black text-orange-500 uppercase tracking-widest mb-2">Total Reservas Mes</p>
                <h4 className="text-4xl font-black text-white">124</h4>
                <p className="text-xs text-green-500 font-bold mt-2">+12% vs mes anterior</p>
              </div>
              <div className="bg-[#141414] p-8 rounded-[40px] border border-white/5">
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Área más Popular</p>
                <h4 className="text-2xl font-black text-white">Quincho Azotea</h4>
                <p className="text-xs text-gray-600 font-bold mt-2">42 reservas este mes</p>
              </div>
              <div className="bg-[#141414] p-8 rounded-[40px] border border-white/5">
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Ingresos Estimados</p>
                <h4 className="text-2xl font-black text-white">$845.000</h4>
                <p className="text-xs text-gray-600 font-bold mt-2">Cargos a Gastos Comunes</p>
              </div>
            </div>

            <section className="space-y-6">
              <h3 className="text-lg font-black text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-orange-500">analytics</span>
                Uso por Espacio
              </h3>
              <div className="space-y-4">
                {COMMON_AREAS.map((area, idx) => (
                  <div key={area.id} className="bg-[#141414] p-6 rounded-3xl border border-white/5">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-gray-500">{area.icon}</span>
                        <span className="font-black text-white">{area.name}</span>
                      </div>
                      <span className="text-xs font-black text-gray-500 uppercase tracking-widest">{85 - (idx * 15)}% de ocupación</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full" 
                        style={{ width: `${85 - (idx * 15)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="p-10 text-center border-t border-white/5 bg-black/40">
        <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">
          Sistema de Reservas Diflow • Gestión de Espacios Comunes
        </p>
      </footer>
    </div>
  );
};

export default Reservations;
