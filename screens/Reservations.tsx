import React, { useState } from 'react';
import { ScreenName } from '../App';
import { UserRole, CommonArea, Reservation } from '../src/types';
import { useAppContext } from '../src/context/AppContext';

interface Props {
  navigate: (screen: ScreenName) => void;
  role: UserRole;
  from?: ScreenName | null;
}

const COMMON_AREAS: CommonArea[] = [
  { id: '1', name: 'Quincho Azotea', icon: 'outdoor_grill', capacity: 15, price: 15000, description: 'Quincho full equipado con parrilla de acero, mesas rústicas y vista panorámica 360°.' },
  { id: '2', name: 'Sala Multiuso', icon: 'groups', capacity: 30, price: 25000, description: 'Espacio climatizado de alta capacidad para eventos, cumpleaños y reuniones corporativas.' },
  { id: '3', name: 'Gimnasio', icon: 'fitness_center', capacity: 8, price: 0, description: 'Equipamiento profesional de musculación, TRX y zona de máquinas cardiovasculares.' },
  { id: '4', name: 'Piscina Temperada', icon: 'pool', capacity: 20, price: 0, description: 'Piscina exterior de 25m con carril de nado, reposeras y zona de hidroterapia.' },
  { id: '5', name: 'Cancha de Pádel', icon: 'sports_tennis', capacity: 4, price: 5000, description: 'Cancha de pádel estándar WPT con paredes de cristal e iluminación LED nocturna.' },
];

const MOCK_RESERVATIONS: Reservation[] = [
  { 
    id: 'res-1', areaId: '1', areaName: 'Quincho Azotea', userId: 'user-1', userName: 'Carlos Mendoza', 
    apartment: '402', date: '2024-04-15', startTime: '18:00', endTime: '22:00', guestsCount: 10, status: 'confirmed', createdAt: '2024-04-10T10:00:00Z' 
  },
  { 
    id: 'res-2', areaId: '5', areaName: 'Cancha de Pádel', userId: 'user-2', userName: 'Ana Silva', 
    apartment: '1105', date: '2024-04-14', startTime: '10:00', endTime: '11:30', guestsCount: 4, status: 'confirmed', createdAt: '2024-04-12T15:30:00Z' 
  },
  { 
    id: 'res-3', areaId: '2', areaName: 'Sala Multiuso', userId: 'user-3', userName: 'Roberto Gómez', 
    apartment: '201', date: '2024-04-20', startTime: '15:00', endTime: '19:00', guestsCount: 20, status: 'pending', createdAt: '2024-04-13T09:15:00Z' 
  },
];

const Reservations: React.FC<Props> = ({ navigate, role, from }) => {
  const { currentUser } = useAppContext();
  const [view, setView] = useState<'browse' | 'form' | 'my-reservations' | 'all-reservations' | 'stats'>(
    role === 'resident' ? 'browse' : 'all-reservations'
  );
  const [selectedArea, setSelectedArea] = useState<CommonArea | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
  
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
      case 'confirmed': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'pending': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'cancelled': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const primaryAccent = role === 'admin' ? 'ediflow-primary' : '[#00AEEF]';
  const primaryHex = role === 'admin' ? '#A855F7' : '#00AEEF';

  return (
    <div className="flex flex-col min-h-full bg-[#0A0A0A] font-sans selection:bg-white/10">
      {/* Immersive Header */}
      <header className="sticky top-0 z-30 bg-[#0A0A0A]/80 backdrop-blur-3xl border-b border-white/5 px-6 py-4">
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
                Áreas <span className={`font-semibold text-${primaryAccent}`}>Comunes</span>.
              </h1>
              <p className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Sistema de Agendamiento
              </p>
            </div>
          </div>
          <div className={`hidden md:flex w-14 h-14 rounded-2xl bg-${primaryAccent}/10 items-center justify-center border border-${primaryAccent}/20 shadow-[0_0_15px_rgba(0,174,239,0.15)]`}>
            <span className={`material-symbols-outlined text-[28px] text-${primaryAccent}`}>calendar_month</span>
          </div>
        </div>
      </header>

      {/* Sub-navigation Menu */}
      <nav className="bg-[#0A0A0A] border-b border-white/5 px-6 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex gap-6 md:gap-10">
          {role === 'resident' && (
            <>
              <button 
                onClick={() => setView('browse')}
                className={`py-5 text-xs font-semibold uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${view === 'browse' || view === 'form' ? `text-${primaryAccent} border-${primaryAccent}` : 'text-gray-500 border-transparent hover:text-gray-300'}`}
              >
                Explorar Áreas
              </button>
              <button 
                onClick={() => setView('my-reservations')}
                className={`py-5 text-xs font-semibold uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${view === 'my-reservations' ? `text-${primaryAccent} border-${primaryAccent}` : 'text-gray-500 border-transparent hover:text-gray-300'}`}
              >
                Mis Reservas
              </button>
            </>
          )}
          {(role === 'concierge' || role === 'admin') && (
            <button 
              onClick={() => setView('all-reservations')}
              className={`py-5 text-xs font-semibold uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${view === 'all-reservations' ? `text-${primaryAccent} border-${primaryAccent}` : 'text-gray-500 border-transparent hover:text-gray-300'}`}
            >
              Agenda Global
            </button>
          )}
          {role === 'admin' && (
            <button 
              onClick={() => setView('stats')}
              className={`py-5 text-xs font-semibold uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${view === 'stats' ? `text-${primaryAccent} border-${primaryAccent}` : 'text-gray-500 border-transparent hover:text-gray-300'}`}
            >
              Métricas y Uso
            </button>
          )}
        </div>
      </nav>

      <main className="flex-1 p-6 md:px-12 md:py-10 max-w-7xl mx-auto w-full pb-32">
        
        {/* BROWSE AREAS (Premium Bento Grid) */}
        {view === 'browse' && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {COMMON_AREAS.map((area) => (
                <div key={area.id} className="bg-[#111] rounded-[2rem] border border-white/5 overflow-hidden group hover:border-[#00AEEF]/30 hover:bg-[#141414] transition-all relative flex flex-col shadow-xl">
                  {/* Subtle Top Glow */}
                  <div className={`absolute top-0 right-0 w-48 h-48 bg-[#00AEEF]/5 rounded-full blur-[60px] group-hover:bg-[#00AEEF]/10 transition-colors pointer-events-none`}></div>
                  
                  <div className="p-8 pb-6 flex-1 flex flex-col relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-[#00AEEF] group-hover:border-[#00AEEF]/30 transition-colors mb-6 shadow-sm">
                      <span className="material-symbols-outlined text-3xl">{area.icon}</span>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-xl md:text-2xl font-medium text-white tracking-tight mb-2">{area.name}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed font-medium">
                        {area.description}
                      </p>
                    </div>

                    <div className="mt-auto pt-6 flex items-end justify-between border-t border-white/5">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <span className="material-symbols-outlined text-[14px]">group</span>
                          Max {area.capacity} pers
                        </div>
                        {area.price! > 0 ? (
                          <div className="flex items-center gap-2 text-[11px] font-bold text-[#00AEEF] uppercase tracking-widest">
                            <span className="material-symbols-outlined text-[14px]">payments</span>
                            ${area.price?.toLocaleString()} CLP
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                            <span className="material-symbols-outlined text-[14px]">sell</span>
                            Sin Costo
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleBook(area)}
                    className="w-full py-5 bg-[#00AEEF] hover:bg-[#00AEEF] hover:brightness-110 text-black font-bold uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-2"
                  >
                    Agendar Espacio <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESERVATION FORM */}
        {view === 'form' && selectedArea && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
            <div className={`p-8 bg-gradient-to-r from-[#111] to-[#141414] rounded-[2rem] border border-white/5 relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 w-64 h-64 bg-${primaryAccent}/5 rounded-full blur-[60px] pointer-events-none`}></div>
              
              <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
                <div className={`w-20 h-20 rounded-[1.5rem] bg-[#0A0A0A] border border-white/10 flex items-center justify-center text-${primaryAccent} shadow-lg`}>
                  <span className="material-symbols-outlined text-[40px]">{selectedArea.icon}</span>
                </div>
                <div>
                  <h2 className="text-3xl font-light text-white tracking-tight mb-2">{selectedArea.name}</h2>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-[#0A0A0A] border border-white/10 px-3 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase text-gray-400">
                      Capacidad Max: {selectedArea.capacity}
                    </span>
                    <span className={`bg-[#0A0A0A] border border-white/10 px-3 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase text-${primaryAccent}`}>
                      {selectedArea.price! > 0 ? `$${selectedArea.price?.toLocaleString()} CLP` : 'Costo $0'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-[#111] p-8 md:p-10 rounded-[2rem] border border-white/5 space-y-8">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-2">Detalles de la Reserva</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 ml-1">Fecha de Uso</label>
                  <input 
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                    className={`w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:border-${primaryAccent} focus:ring-1 focus:ring-${primaryAccent} outline-none transition-all placeholder:text-gray-600`}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 ml-1">Cant. Invitados</label>
                  <input 
                    type="number"
                    min={1}
                    max={selectedArea.capacity}
                    value={formData.guestsCount}
                    onChange={(e) => setFormData({...formData, guestsCount: parseInt(e.target.value)})}
                    required
                    className={`w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:border-${primaryAccent} focus:ring-1 focus:ring-${primaryAccent} outline-none transition-all placeholder:text-gray-600`}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 ml-1">Hora Inicio</label>
                  <input 
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    required
                    className={`w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:border-${primaryAccent} focus:ring-1 focus:ring-${primaryAccent} outline-none transition-all placeholder:text-gray-600`}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 ml-1">Hora Fin</label>
                  <input 
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    required
                    className={`w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:border-${primaryAccent} focus:ring-1 focus:ring-${primaryAccent} outline-none transition-all placeholder:text-gray-600`}
                  />
                </div>
              </div>

              {selectedArea.price! > 0 && (
                <div className="p-6 bg-[#0A0A0A] rounded-2xl border border-white/5 mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-400">Total a Pagar</span>
                    <span className="text-2xl font-light text-white">${selectedArea.price?.toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    * El costo será integrado automáticamente a su próximo Gasto Común.
                  </p>
                </div>
              )}

              <button 
                type="submit" 
                className={`w-full py-5 bg-${primaryAccent} hover:brightness-110 text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(0,174,239,0.3)] transition-all active:scale-[0.98] mt-8`}
              >
                Confirmar Disponibilidad
              </button>
            </form>
          </div>
        )}

        {/* MY RESERVATIONS (Resident) / ALL RESERVATIONS (Staff) : unified list style */}
        {(view === 'my-reservations' || view === 'all-reservations') && (
          <div className="space-y-6 md:space-y-8 animate-fade-in-up">
            
            {(view === 'all-reservations') && (
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">search</span>
                  <input 
                    type="text" 
                    placeholder="Buscar por Depto o Nombre..."
                    className={`w-full h-14 pl-12 pr-4 bg-[#111] border border-white/5 rounded-2xl text-white outline-none focus:border-${primaryAccent}/50 focus:ring-1 focus:ring-${primaryAccent}/50 transition-all text-sm`}
                  />
                </div>
                <div className="flex gap-2">
                  <button className="px-6 h-14 bg-[#111] border border-white/5 rounded-2xl text-[11px] font-bold text-white uppercase tracking-widest hover:bg-[#141414] active:scale-95 transition-all">Hoy</button>
                  <button className="px-6 h-14 bg-[#111] border border-white/5 rounded-2xl text-[11px] font-bold text-gray-500 uppercase tracking-widest hover:bg-[#141414] hover:text-white active:scale-95 transition-all">Histórico</button>
                </div>
              </div>
            )}

            {/* List */}
            <div className="flex flex-col gap-4">
              {reservations
                .filter(r => view === 'my-reservations' ? (r.userId === currentUser?.id || r.userId === 'anon') : true)
                .map((res) => (
                <div key={res.id} className={`bg-[#111] rounded-[2rem] border border-white/5 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-white/10 hover:bg-[#141414] transition-all relative overflow-hidden`}>
                  
                  {/* Subtle Gradient bar status */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${res.status === 'confirmed' ? 'bg-green-500' : res.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'}`}></div>

                  <div className="flex items-center gap-5 md:gap-6 pl-2">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-[#0A0A0A] border border-white/10 flex items-center justify-center text-gray-400">
                      <span className="material-symbols-outlined text-[28px]">{COMMON_AREAS.find(a => a.id === res.areaId)?.icon || 'event'}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-medium text-white tracking-tight">{res.areaName}</h3>
                        {view === 'all-reservations' && (
                          <span className={`text-[10px] font-extrabold bg-${primaryAccent}/10 text-${primaryAccent} px-2 py-1 rounded border border-${primaryAccent}/20 uppercase tracking-widest`}>
                            D. {res.apartment}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px]">event</span> {res.date} <span className="opacity-30">|</span> {res.startTime} - {res.endTime}
                      </p>
                      {view === 'all-reservations' && <p className="text-sm text-gray-400 font-medium">{res.userName}</p>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-white/5 pt-5 md:pt-0">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-1">Aforo</p>
                      <p className="text-sm font-medium text-white flex items-center gap-1.5 justify-start md:justify-end">
                        <span className="material-symbols-outlined text-[16px] text-gray-500">group</span> {res.guestsCount}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] font-extrabold px-3.5 py-1.5 rounded-lg border uppercase tracking-widest ${getStatusColor(res.status)}`}>
                        {res.status === 'confirmed' ? 'Confirmado' : res.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                      </span>
                      
                      {role === 'admin' && res.status === 'pending' && (
                        <div className="flex gap-2">
                          <button className="w-10 h-10 rounded-xl bg-[#0A0A0A] text-green-500 border border-green-500/20 flex items-center justify-center hover:bg-green-500 hover:text-black transition-all active:scale-95 cursor-pointer">
                            <span className="material-symbols-outlined text-[20px]">check</span>
                          </button>
                          <button className="w-10 h-10 rounded-xl bg-[#0A0A0A] text-red-500 border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-95 cursor-pointer">
                            <span className="material-symbols-outlined text-[20px]">close</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                </div>
              ))}
              
              {reservations.filter(r => view === 'my-reservations' ? (r.userId === currentUser?.id || r.userId === 'anon') : true).length === 0 && (
                 <div className="text-center py-24 bg-[#111] rounded-[2rem] border border-dashed border-white/10">
                   <div className="w-20 h-20 bg-[#0A0A0A] rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                     <span className="material-symbols-outlined text-4xl text-gray-600">event_busy</span>
                   </div>
                   <p className="text-gray-400 font-medium text-lg mb-2">No hay reservas activas.</p>
                   <p className="text-gray-600 text-sm">Explora las áreas comunes para programar un evento.</p>
                 </div>
              )}
            </div>
          </div>
        )}

        {/* STATS VIEW (Admin ONLY) */}
        {view === 'stats' && (
          <div className="space-y-10 animate-fade-in-up">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stat Card 1 */}
              <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-[#A855F7]/30 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#A855F7]/10 rounded-full blur-[40px]"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Total Reservas (Mes)</p>
                  <h4 className="text-5xl font-light text-white tracking-tight mb-2">124</h4>
                  <p className="text-[11px] text-green-500 font-bold uppercase tracking-widest mt-auto">+12% vs Anterior</p>
                </div>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all">
                <div className="relative z-10 flex flex-col h-full">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Área más Demandada</p>
                  <h4 className="text-3xl font-medium text-white tracking-tight mb-2">Quincho P.12</h4>
                  <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-auto">42 agendamientos</p>
                </div>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all">
                <div className="relative z-10 flex flex-col h-full">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Ingresos Estimados</p>
                  <h4 className="text-3xl font-medium text-white tracking-tight mb-2">$845.000</h4>
                  <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-auto">A descontar en GG.CC.</p>
                </div>
              </div>
            </div>

            <section className="bg-[#111] rounded-[2rem] border border-white/5 p-8 md:p-10">
              <h3 className="text-base font-semibold text-white tracking-widest uppercase mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#A855F7] text-[20px]">analytics</span>
                Uso Estructural por Espacio
              </h3>
              <div className="space-y-6">
                {COMMON_AREAS.map((area, idx) => (
                  <div key={area.id} className="group">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] border border-white/5 flex items-center justify-center text-gray-500 group-hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-[16px]">{area.icon}</span>
                        </div>
                        <span className="font-medium text-gray-300 text-sm">{area.name}</span>
                      </div>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{85 - (idx * 15)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#0A0A0A] rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-gradient-to-r from-[#A855F7] to-[#8B5CF6] rounded-full transition-all duration-1000 ease-out" 
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
    </div>
  );
};

export default Reservations;
