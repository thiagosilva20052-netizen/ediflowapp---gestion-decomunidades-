import React, { useState, useEffect } from 'react';
import { ScreenName } from '../App';
import { UserRole, CommonArea, Reservation } from '../src/types';
import { useAppContext } from '../src/context/AppContext';
import { supabase } from '../src/lib/supabase-client';

interface Props {
  navigate: (screen: ScreenName) => void;
  role: UserRole;
  from?: ScreenName | null;
}

const Reservations: React.FC<Props> = ({ navigate, role, from }) => {
  const { currentUser, currentTenant } = useAppContext();
  const [view, setView] = useState<'browse' | 'form' | 'my-reservations' | 'all-reservations' | 'stats'>(
    role === 'resident' ? 'browse' : 'all-reservations'
  );
  
  const [amenities, setAmenities] = useState<CommonArea[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedArea, setSelectedArea] = useState<CommonArea | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    guestsCount: 1,
  });

  useEffect(() => {
    fetchData();
  }, [currentUser, currentTenant]);

  const fetchData = async () => {
    if (!currentTenant) return;
    try {
      setIsLoading(true);
      // Fetch Amenities
      const { data: areasData, error: areasError } = await supabase
        .from('amenities')
        .select('*')
        .eq('tenant_id', currentTenant.id);
        
      if (!areasError && areasData) {
         if (areasData.length === 0) {
            // Seed amenities for demo if empty
            await seedAmenities(currentTenant.id);
         } else {
            setAmenities(areasData.map(a => ({
               id: a.id,
               name: a.name,
               icon: a.icon,
               capacity: a.capacity,
               price: Number(a.price),
               description: a.description
            })));
         }
      }

      // Fetch Reservations
      const { data: resData, error: resError } = await supabase
        .from('reservations')
        .select('*, profiles(name), amenities(name)')
        .eq('tenant_id', currentTenant.id)
        .order('reservation_date', { ascending: false });

      if (!resError && resData) {
         setReservations(resData.map((r: any) => ({
           id: r.id,
           areaId: r.amenity_id,
           areaName: r.amenities?.name || 'Area',
           userId: r.user_id,
           userName: r.profiles?.name || 'Residente',
           apartment: '---', // Could join units if needed
           date: r.reservation_date,
           startTime: r.start_time,
           endTime: r.end_time,
           guestsCount: r.guests_count,
           status: r.status,
           createdAt: r.created_at
         })));
      }
    } catch(err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const seedAmenities = async (tId: string) => {
    const defaultAreas = [
      { tenant_id: tId, name: 'Quincho Azotea', icon: 'outdoor_grill', capacity: 15, price: 15000, description: 'Quincho full equipado con parrilla de acero, mesas rústicas y vista panorámica 360°.' },
      { tenant_id: tId, name: 'Sala Multiuso', icon: 'groups', capacity: 30, price: 25000, description: 'Espacio climatizado de alta capacidad para eventos, cumpleaños y reuniones corporativas.' },
      { tenant_id: tId, name: 'Gimnasio', icon: 'fitness_center', capacity: 8, price: 0, description: 'Equipamiento profesional de musculación, TRX y zona de máquinas cardiovasculares.' },
      { tenant_id: tId, name: 'Piscina Temperada', icon: 'pool', capacity: 20, price: 0, description: 'Piscina exterior de 25m con carril de nado, reposeras y zona de hidroterapia.' },
      { tenant_id: tId, name: 'Cancha de Pádel', icon: 'sports_tennis', capacity: 4, price: 5000, description: 'Cancha de pádel estándar WPT con paredes de cristal e iluminación LED nocturna.' },
    ];
    await supabase.from('amenities').insert(defaultAreas);
    // Refetch
    const { data } = await supabase.from('amenities').select('*').eq('tenant_id', tId);
    if(data) {
       setAmenities(data.map(a => ({
          id: a.id,
          name: a.name,
          icon: a.icon,
          capacity: a.capacity,
          price: Number(a.price),
          description: a.description
       })));
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArea || !currentUser || !currentTenant) return;
    if (!formData.date) {
      alert('Por favor selecciona una fecha de uso.');
      return;
    }

    try {
      // 1. Create reservation
      const { data: newReservation, error: resError } = await supabase.from('reservations').insert({
         tenant_id: currentTenant.id,
         user_id: currentUser.id,
         amenity_id: selectedArea.id,
         reservation_date: formData.date,
         start_time: formData.startTime,
         end_time: formData.endTime,
         guests_count: formData.guestsCount,
         status: 'confirmed' // Or pending depending on business rules
      }).select().single();

      if (resError) throw resError;

      // 2. Transact if price > 0
      if (selectedArea.price && selectedArea.price > 0) {
         await supabase.from('transactions').insert({
            tenant_id: currentTenant.id,
            user_id: currentUser.id,
            amount: selectedArea.price,
            status: 'pending',
            method: 'mercadopago',
            billing_month: 'Pago Reserva',
         });
      }

      await fetchData(); // Refresh
      setView('my-reservations');
      setFormData({ date: '', startTime: '', endTime: '', guestsCount: 1 });
    } catch(err) {
      console.error('Error in handle book:', err);
      alert('Error procesando su reserva.');
    }
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
            {isLoading ? (
               <div className="flex items-center justify-center py-20">
                  <div className={`w-8 h-8 rounded-full border-2 border-${primaryAccent} border-t-transparent animate-spin`}></div>
               </div>
            ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {amenities.map((area) => (
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
            )}
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
                
                <div className="space-y-4 md:col-span-2 border border-white/5 bg-[#0A0A0A]/50 p-6 rounded-[2rem]">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 ml-1">Selecciona Fecha</label>
                  <div className="flex gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar px-1">
                    {Array.from({ length: 14 }).map((_, i) => {
                      const d = new Date();
                      d.setDate(d.getDate() + i);
                      const isSelected = formData.date === d.toISOString().split('T')[0];
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setFormData({...formData, date: d.toISOString().split('T')[0]})}
                          className={`min-w-[80px] h-24 rounded-2xl flex flex-col items-center justify-center transition-all ${
                            isSelected 
                              ? `bg-${primaryAccent} text-black scale-110 shadow-[0_0_20px_rgba(0,174,239,0.3)] z-10` 
                              : `bg-[#111] hover:bg-[#1A1A1A] text-gray-400 border border-white/5`
                          }`}
                        >
                          <span className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${isSelected ? 'text-black/60' : 'text-gray-600'}`}>
                            {d.toLocaleDateString('es-CL', { weekday: 'short' })}
                          </span>
                          <span className="text-2xl font-light">
                            {d.getDate()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
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
                <div key={res.id} className={`bg-[#111] rounded-[2rem] border border-white/5 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-white/10 hover:bg-[#141414] transition-all relative overflow-hidden shadow-lg hover:shadow-2xl`}>
                  
                  {/* Subtle Gradient bar status */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 ${res.status === 'confirmed' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : res.status === 'pending' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}></div>

                  <div className="flex items-center gap-5 md:gap-6 pl-4">
                    <div className={`w-16 h-16 rounded-[1.5rem] bg-[#0A0A0A] border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-${primaryAccent} group-hover:border-${primaryAccent}/30 transition-colors shadow-inner`}>
                      <span className="material-symbols-outlined text-[28px]">{amenities.find(a => a.id === res.areaId)?.icon || 'event'}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-medium text-white tracking-tight">{res.areaName}</h3>
                        {view === 'all-reservations' && (
                          <span className={`text-[10px] font-extrabold bg-${primaryAccent}/10 text-${primaryAccent} px-2.5 py-1 rounded-md border border-${primaryAccent}/20 uppercase tracking-widest shadow-sm`}>
                            D. {res.apartment}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2">
                        <span className={`material-symbols-outlined text-[14px] text-${primaryAccent}`}>event</span> {res.date} <span className="opacity-30">|</span> <span className="text-gray-300">{res.startTime} - {res.endTime}</span>
                      </p>
                      {view === 'all-reservations' && <p className="text-sm text-gray-400 font-medium">{res.userName}</p>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-white/5 pt-5 md:pt-0">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Aforo Permitido</p>
                      <p className="text-sm font-medium text-white flex items-center gap-1.5 justify-start md:justify-end">
                        <span className={`material-symbols-outlined text-[16px] text-${primaryAccent}`}>group</span> {res.guestsCount}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] font-extrabold px-3.5 py-1.5 rounded-lg border uppercase tracking-widest flex items-center gap-1.5 ${getStatusColor(res.status)}`}>
                        {res.status === 'confirmed' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>}
                        {res.status === 'pending' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
                        {res.status === 'cancelled' && <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>}
                        {res.status === 'confirmed' ? 'Confirmado' : res.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                      </span>
                      
                      {role === 'admin' && res.status === 'pending' && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button className="w-10 h-10 rounded-xl bg-[#0A0A0A] text-green-500 border border-green-500/20 flex items-center justify-center hover:bg-green-500 hover:text-black transition-all active:scale-95 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                            <span className="material-symbols-outlined text-[20px]">check</span>
                          </button>
                          <button className="w-10 h-10 rounded-xl bg-[#0A0A0A] text-red-500 border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                            <span className="material-symbols-outlined text-[20px]">close</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                </div>
              ))}
              
              {reservations.filter(r => view === 'my-reservations' ? (r.userId === currentUser?.id || r.userId === 'anon') : true).length === 0 && (
                 <div className="text-center py-24 bg-[#111] rounded-[2rem] border border-dashed border-white/10 hover:border-white/20 transition-colors group">
                   <div className="w-20 h-20 bg-[#0A0A0A] rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-inner group-hover:scale-110 transition-transform">
                     <span className={`material-symbols-outlined text-4xl text-gray-600 group-hover:text-${primaryAccent} transition-colors`}>event_busy</span>
                   </div>
                   <p className="text-gray-300 font-medium text-lg mb-2">No tienes reservas activas.</p>
                   <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold max-w-xs mx-auto">Explora nuestras áreas comunes y agenda tu próximo evento.</p>
                   
                   {role === 'resident' && (
                     <button 
                       onClick={() => setView('browse')}
                       className={`mt-8 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10 text-white hover:bg-${primaryAccent} hover:text-black hover:border-${primaryAccent} transition-all active:scale-95`}
                     >
                       Ir a Explorar
                     </button>
                   )}
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
              <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-[#A855F7]/30 transition-all shadow-lg hover:shadow-2xl">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#A855F7]/10 rounded-full blur-[60px] group-hover:bg-[#A855F7]/20 transition-colors pointer-events-none"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Total Reservas (Mes)</p>
                    <span className="material-symbols-outlined text-gray-600">confirmation_number</span>
                  </div>
                  <h4 className="text-5xl font-light text-white tracking-tight mb-2">124</h4>
                  <div className="mt-auto flex items-center gap-1.5 text-green-500 bg-green-500/10 w-fit px-2 py-1 rounded-md border border-green-500/20">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                    <p className="text-[10px] font-bold uppercase tracking-widest">+12% vs Anterior</p>
                  </div>
                </div>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-[#00AEEF]/30 transition-all shadow-lg hover:shadow-2xl">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#00AEEF]/5 rounded-full blur-[60px] group-hover:bg-[#00AEEF]/15 transition-colors pointer-events-none"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Área Demandada</p>
                    <span className="material-symbols-outlined text-gray-600">star</span>
                  </div>
                  <h4 className="text-3xl font-medium text-white tracking-tight mb-2">Quincho P.12</h4>
                  <div className="mt-auto flex items-center gap-1.5 text-[#00AEEF] bg-[#00AEEF]/10 w-fit px-2 py-1 rounded-md border border-[#00AEEF]/20">
                    <span className="material-symbols-outlined text-[14px]">bar_chart</span>
                    <p className="text-[10px] font-bold uppercase tracking-widest">42 agendamientos</p>
                  </div>
                </div>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-[#F59E0B]/30 transition-all shadow-lg hover:shadow-2xl">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-[#F59E0B]/5 rounded-full blur-[60px] group-hover:bg-[#F59E0B]/15 transition-colors pointer-events-none"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Ingresos Estimados</p>
                    <span className="material-symbols-outlined text-gray-600">payments</span>
                  </div>
                  <h4 className="text-3xl font-medium text-white tracking-tight mb-2">$845.000</h4>
                  <div className="mt-auto flex items-center gap-1.5 text-[#F59E0B] bg-[#F59E0B]/10 w-fit px-2 py-1 rounded-md border border-[#F59E0B]/20">
                    <span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>
                    <p className="text-[10px] font-bold uppercase tracking-widest">A descontar en GG.CC.</p>
                  </div>
                </div>
              </div>
            </div>

            <section className="bg-[#111] rounded-[2.5rem] border border-white/5 p-8 md:p-10 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <h3 className="text-sm font-semibold text-white tracking-widest uppercase flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#A855F7]/10 flex items-center justify-center border border-[#A855F7]/20 shadow-inner">
                    <span className="material-symbols-outlined text-[#A855F7] text-[20px]">analytics</span>
                  </div>
                  Uso Estructural por Espacio
                </h3>
              </div>
              <div className="space-y-6">
                {amenities.map((area, idx) => (
                  <div key={area.id} className="group">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] border border-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors shadow-inner">
                          <span className="material-symbols-outlined text-[16px]">{area.icon}</span>
                        </div>
                        <span className="font-medium text-gray-300 text-sm">{area.name}</span>
                      </div>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-md">{Math.max(10, 85 - (idx * 15))}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#0A0A0A] rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-gradient-to-r from-[#A855F7] to-[#8B5CF6] rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                        style={{ width: `${Math.max(10, 85 - (idx * 15))}%` }}
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
