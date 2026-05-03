import React, { useState, useEffect, useRef } from 'react';
import { ScreenName } from '../App';
import { useAppContext } from '../src/context/AppContext';
import { Logo } from '../components/Logo';

interface Props {
  navigate: (screen: ScreenName) => void;
  onLogout?: () => void;
}

export const ConciergeDashboard: React.FC<Props> = ({ navigate, onLogout }) => {
  const { currentUser, setIsGlobalMenuOpen, currentTenant } = useAppContext();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [parcelsCount, setParcelsCount] = useState<number>(0);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [parcels, setParcels] = useState<any[]>([]);
  
  const [activeSosAlert, setActiveSosAlert] = useState<any>(null);
  
  const [pinValue, setPinValue] = useState("");
  const [isPinSubmitting, setIsPinSubmitting] = useState(false);
  const [pinError, setPinError] = useState(false);
  const pinInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!currentTenant) return;
    
    // Check pending SOS alerts periodically since we might miss realtime events in Dev
    let isActive = true;
    const fetchSos = async () => {
      try {
         const { supabase } = await import('../src/lib/supabase-client');
         const { data, error } = await supabase
            .from('panic_alerts')
            .select('*, units(unit_number), profiles(full_name)')
            .eq('tenant_id', currentTenant.id)
            .eq('status', 'Activo')
            .order('created_at', { ascending: false })
            .limit(1);

         if (data && data.length > 0 && isActive) {
            setActiveSosAlert(data[0]);
         } else if (isActive) {
            setActiveSosAlert(null);
         }
      } catch (err) {
         console.error("Error fetching SOS", err);
      }
    };
    
    fetchSos();
    
    // Fallback polling
    const sosTimer = setInterval(fetchSos, 10000);

    // Supabase Realtime
    let channel: any;
    import('../src/lib/supabase-client').then(({ supabase }) => {
       channel = supabase.channel('public:panic_alerts')
         .on('postgres_changes', { event: '*', schema: 'public', table: 'panic_alerts', filter: `tenant_id=eq.${currentTenant.id}` }, () => {
            fetchSos();
         })
         .subscribe();
    });

    return () => {
      isActive = false;
      clearInterval(sosTimer);
      if (channel) {
         import('../src/lib/supabase-client').then(({ supabase }) => {
            supabase.removeChannel(channel);
         });
      }
    };
  }, [currentTenant]);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pinValue.length !== 4 || isPinSubmitting || !currentTenant) return;

    setIsPinSubmitting(true);
    setPinError(false);
    try {
      const { supabase } = await import('../src/lib/supabase-client');
      
      // Auto-expire pins TTL
      await supabase
         .from('visit_access')
         .update({ status: 'Expirado' })
         .eq('tenant_id', currentTenant.id)
         .eq('status', 'Pendiente')
         .lt('expires_at', new Date().toISOString());

      const { data: visitData, error: visitError } = await supabase
        .from('visit_access')
        .select('*, units(unit_number, contact_email)')
        .eq('tenant_id', currentTenant.id)
        .eq('access_pin', pinValue)
        .eq('status', 'Pendiente')
        .maybeSingle();

      if (!visitData) {
         setPinError(true);
         setTimeout(() => setPinError(false), 1000);
         setPinValue("");
         pinInputRef.current?.focus();
         setIsPinSubmitting(false);
         return;
      }

      const { data: currentUserRes } = await supabase.auth.getUser();
      const currentUserId = currentUserRes.user?.id;

      await supabase
        .from('visit_access')
        .update({ status: 'Ingresado' })
        .eq('id', visitData.id);

      await supabase
        .from('audit_logs')
        .insert({
          tenant_id: currentTenant.id,
          user_id: currentUserId,
          action: 'Ingreso Visita por PIN',
          details: `Visita ${visitData.visitor_name} (PIN: ${pinValue}) al Depto ${visitData.units?.unit_number}`,
          module: 'access_control',
          severity: 'info'
        });

      // Fire and forget notification
      fetch((import.meta as any).env.VITE_BASE_URL + '/api/notify/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           unitId: visitData.unit_id,
           tenantId: currentTenant.id,
           visitorName: visitData.visitor_name,
           unitNumber: visitData.units?.unit_number,
           tenantName: currentTenant.name,
           accessedAt: new Date().toLocaleString()
        })
      }).catch(err => console.error('Push error:', err));

      alert(`✅ Acceso Aprobado:\nVisita: ${visitData.visitor_name}\nDepto: ${visitData.units?.unit_number}`);
      setPinValue("");
      pinInputRef.current?.focus();

    } catch (err: any) {
      console.error(err);
      alert('Error validando PIN');
    } finally {
      setIsPinSubmitting(false);
    }
  };

  const resolveSos = async () => {
    if (!activeSosAlert || !currentUser || !currentTenant) return;
    try {
      const { supabase } = await import('../src/lib/supabase-client');
      
      await supabase
         .from('panic_alerts')
         .update({ status: 'Resuelto', resolved_by: currentUser.id })
         .eq('id', activeSosAlert.id);
         
      await supabase
         .from('audit_logs')
         .insert({
           tenant_id: currentTenant.id,
           user_id: currentUser.id,
           action: 'SOS Resuelto',
           details: `Emergencia atendida del Depto ${activeSosAlert.units?.unit_number}`,
           module: 'emergency',
           severity: 'warning'
         });
         
      setActiveSosAlert(null);
    } catch (err) {
      console.error(err);
      alert("Error resolviendo alerta");
    }
  };

  const fetchStats = async () => {
    if (!currentTenant) return;
    try {
      const { supabase } = await import('../src/lib/supabase-client');

      // Auto-expire pins TTL en background (sin bloquear UI)
      supabase
         .from('visit_access')
         .update({ status: 'Expirado' })
         .eq('tenant_id', currentTenant.id)
         .eq('status', 'Pendiente')
         .lt('expires_at', new Date().toISOString())
         .then(({ error }) => { if (error) console.error(error) });
      
      const { count } = await supabase
        .from('parcels')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', currentTenant.id)
        .in('status', ['Pendiente', 'received']);
        
      if (count !== null) setParcelsCount(count);

      const { data } = await supabase
        .from('parcels')
        .select('*, units(unit_number)')
        .eq('tenant_id', currentTenant.id)
        .in('status', ['Pendiente', 'received'])
        .order('created_at', { ascending: false });

      if (data) setParcels(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [currentTenant]);

  const handleDeliverPackage = async (id: string) => {
    if (!currentTenant) return;
    try {
      const { supabase } = await import('../src/lib/supabase-client');
      await supabase
        .from('parcels')
        .update({ 
          status: 'Entregado', 
          picked_up_at: new Date().toISOString() 
        })
        .eq('id', id);
        
      fetchStats();
    } catch (error) {
      console.error('Error delivering package:', error);
      alert('Error al marcar entregado');
    }
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white font-sans overflow-hidden py-safe selection:bg-white/10">
      
      {/* Sleek Collapsible Sidebar (Glassmorphism & Narrow) - Hidden Mobile */}
      <aside 
        className={`hidden md:flex flex-col bg-[#050505] border-r border-white/5 py-8 px-4 transition-all duration-300 ease-in-out relative z-40 ${isSidebarExpanded ? 'w-64' : 'w-20 items-center'}`}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <div className="mb-10 pl-2 opacity-90 transition-opacity hover:opacity-100 cursor-pointer text-[#00AEEF]">
          {isSidebarExpanded ? (
            <span className="text-xl font-bold tracking-tighter">Ediflow</span>
          ) : (
            <span className="text-2xl font-bold">E.</span>
          )}
        </div>

        {/* User Identity at the top */}
        <div className="w-full pb-6 mb-6 border-b border-white/5 flex flex-col gap-2">
           <div className={`flex items-center gap-3 py-2 px-1.5 rounded-xl border border-transparent hover:border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${isSidebarExpanded ? 'w-full' : 'justify-center'}`}>
              <div className="shrink-0 w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                {currentUser?.name ? currentUser.name.charAt(0) : 'C'}
              </div>
              {isSidebarExpanded && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-white">{currentUser?.name || "Conserje Turno"}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span> Turno Activo
                  </p>
                </div>
              )}
           </div>
        </div>
        
        <nav className="flex-1 space-y-2 w-full overflow-y-auto no-scrollbar pb-4 block">
          <SidebarItem icon="dashboard" label="Mesa de Control" active expanded={isSidebarExpanded} />
          <SidebarItem icon="inventory_2" label="Ingreso Paquete" onClick={() => navigate('PackageEntry')} expanded={isSidebarExpanded} />
          <SidebarItem icon="person_add" label="Ingreso Visita" onClick={() => navigate('ManualVisitorRegistration')} expanded={isSidebarExpanded} />
          <SidebarItem icon="menu_book" label="Libro Diario" onClick={() => navigate('BitacoraScreen')} expanded={isSidebarExpanded} />
          <SidebarItem icon="quick_reference_all" label="Directorio" onClick={() => navigate('ResidentDirectory')} expanded={isSidebarExpanded} />
          
          <div className="pt-6 mt-4 border-t border-white/5">
            <SidebarItem icon="sos" label="Pánico / Emergencia" onClick={() => navigate('Emergency')}  expanded={isSidebarExpanded} isDanger/>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar relative z-10 w-full">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="md:hidden flex items-center justify-between px-6 pt-12 pb-4 border-b border-white/5 sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-xl z-30">
           <span className="text-xl font-bold tracking-tighter text-[#00AEEF]">Ediflow</span>
           <div className="flex gap-2">
             <button title="Notificaciones" className="w-10 h-10 rounded-xl bg-[#111] border border-white/10 text-white flex items-center justify-center relative active:scale-95 transition-transform">
               <span className="material-symbols-outlined text-[20px]">notifications</span>
               <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
             </button>
           </div>
        </header>

        {/* Premium Desktop Header with Clock */}
        <header className="px-6 md:px-16 pt-8 md:pt-16 pb-8 md:pb-12 sticky top-0 z-20 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/95 to-transparent pointer-events-none md:bg-none flex justify-between items-start">
           <div className="pointer-events-auto">
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-2 leading-none flex items-center gap-4">
               Conserjería Central.
             </h1>
             {currentTime && (
               <p className="text-blue-400 text-xl md:text-2xl mt-4 block font-mono tracking-widest flex items-center gap-2 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">
                 <span className="material-symbols-outlined text-[24px]">schedule</span>
                 {currentTime} <span className="text-sm font-sans tracking-tight uppercase text-gray-400 ml-2">Turno Día</span>
               </p>
             )}
           </div>

           <div className="hidden md:flex items-center gap-5 pointer-events-auto">
              <button 
                title="Notificaciones"
                className="relative w-12 h-12 rounded-xl bg-[#111] border border-white/5 hover:border-white/10 hover:bg-[#141414] flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-95 shadow-xl"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
              </button>
              
              <button 
                onClick={onLogout}
                title="Finalizar Turno"
                className="h-12 px-6 rounded-xl bg-[#111] border border-white/5 flex items-center justify-center text-red-500/80 hover:bg-red-500/10 hover:text-red-500 transition-all active:scale-95 group font-bold tracking-widest uppercase text-[10px] gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span> Finalizar Turno
              </button>
           </div>
        </header>

        <div className="px-6 md:px-16 pb-32 md:pb-24 max-w-7xl w-full mx-auto relative z-10">
        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* SHIFT OVERVIEW (Hero Action Box) */}
          <div className="lg:col-span-2 bg-[#111] rounded-[2.5rem] border border-white/5 relative overflow-hidden shadow-2xl flex flex-col min-h-[400px] p-8 md:p-12 transition-all duration-500 hover:border-white/10 group">
             
             {/* Ambient Glow */}
             <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-1000`}></div>

             <div className="relative z-10 flex flex-col h-full w-full">
                <div className="flex items-center justify-between mb-12">
                   <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                     Estado Operativo Inmediato
                   </h2>
                   <div className="w-12 h-12 rounded-full bg-[#0A0A0A] border border-white/5 flex items-center justify-center text-blue-400 shadow-inner">
                     <span className="material-symbols-outlined text-[24px]">troubleshoot</span>
                   </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
                   <div 
                      onClick={() => setIsPackageModalOpen(true)}
                      className="bg-[#0A0A0A] p-6 rounded-[1.5rem] border border-white/5 flex flex-col items-center text-center shadow-inner cursor-pointer hover:border-blue-400/50 hover:bg-[#111] transition-colors"
                   >
                      <span className="text-4xl lg:text-5xl font-light text-white mb-2 tracking-tighter">{parcelsCount}</span>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Bodega</span>
                      <span className="material-symbols-outlined text-blue-400 mt-3 text-[20px] opacity-80">inventory_2</span>
                   </div>
                   <div className="bg-[#0A0A0A] p-6 rounded-[1.5rem] border border-white/5 flex flex-col items-center text-center shadow-inner">
                      <span className="text-4xl lg:text-5xl font-light text-white mb-2 tracking-tighter">4</span>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Visitas</span>
                      <span className="material-symbols-outlined text-purple-400 mt-3 text-[20px] opacity-80">group</span>
                   </div>
                   <div className="bg-[#0A0A0A] p-6 rounded-[1.5rem] border border-white/5 flex flex-col items-center text-center shadow-inner">
                      <span className="text-4xl lg:text-5xl font-light text-white mb-2 tracking-tighter">2</span>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Parking</span>
                      <span className="material-symbols-outlined text-green-400 mt-3 text-[20px] opacity-80">directions_car</span>
                   </div>
                   <div className="bg-[#0A0A0A] p-6 rounded-[1.5rem] border border-white/5 flex flex-col items-center text-center shadow-inner">
                      <span className="text-4xl lg:text-5xl font-light text-white mb-2 tracking-tighter">1</span>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Llaves</span>
                      <span className="material-symbols-outlined text-amber-400 mt-3 text-[20px] opacity-80">key</span>
                   </div>
                </div>

                {/* Attention Required Banner */}
                <div className="mt-auto bg-red-500/10 border border-red-500/20 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                       <span className="material-symbols-outlined text-red-500">warning</span>
                     </div>
                     <div>
                       <p className="text-sm font-bold text-white tracking-tight">Atención Crítica</p>
                       <p className="text-xs text-red-300 font-medium mt-0.5">2 paquetes del Depto 402 en bodega por más de 72 hrs.</p>
                     </div>
                   </div>
                   <button className="bg-red-500 text-white px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-[0.1em] hover:bg-red-400 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)] active:scale-95 shrink-0 whitespace-nowrap">
                     Notificar Unidad
                   </button>
                </div>
             </div>
          </div>

          {/* Quick Tools Column */}
          <div className="flex flex-col gap-6 md:gap-8">
            
            {/* Quick PIN Validation */}
            <form 
              onSubmit={handlePinSubmit}
              className={`rounded-[2.5rem] border p-8 flex flex-col justify-center relative overflow-hidden shadow-lg transition-all ${pinError ? 'bg-red-500/10 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.3)] animate-shake' : 'bg-[#111] border-white/5 focus-within:border-emerald-500/50 focus-within:shadow-[0_0_30px_rgba(16,185,129,0.15)] group'}`}
            >
               {!pinError && <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-emerald-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>}
               {pinError && <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-500/10"></div>}
               <div className="relative z-10 flex items-center justify-between mb-4">
                  <h3 className={`text-sm font-bold tracking-widest uppercase transition-colors ${pinError ? 'text-red-400' : 'text-gray-400 group-focus-within:text-emerald-400'}`}>
                    {pinError ? 'PIN INVALIDO' : 'Validación Rápida'}
                  </h3>
                  <span className={`material-symbols-outlined text-[20px] transition-colors ${pinError ? 'text-red-400' : 'text-gray-500 group-focus-within:text-emerald-400'}`}>
                    {pinError ? 'error' : 'dialpad'}
                  </span>
               </div>
               <input
                 ref={pinInputRef}
                 type="text"
                 maxLength={4}
                 value={pinValue}
                 onChange={(e) => setPinValue(e.target.value.replace(/[^0-9]/g, ''))}
                 placeholder="PIN"
                 disabled={isPinSubmitting}
                 className={`w-full bg-[#0A0A0A] border rounded-xl h-14 text-center text-2xl font-mono tracking-[0.5em] text-white focus:outline-none transition-colors disabled:opacity-50 ${pinError ? 'border-red-500/50 text-red-500' : 'border-white/10 focus:border-emerald-500/50'}`}
                 autoFocus
               />
               <p className={`mt-3 text-[10px] text-center uppercase tracking-widest transition-colors ${pinError ? 'text-red-500' : 'text-gray-500'}`}>Presione Enter para validar</p>
            </form>

            {/* Quick Record: Packages */}
            <div 
              onClick={() => navigate('PackageEntry')}
              className="bg-[#111] rounded-[2.5rem] border border-white/5 p-8 flex items-center justify-between cursor-pointer hover:bg-[#141414] hover:border-blue-400/30 transition-all group active:scale-[0.98] shadow-lg hover:shadow-[0_0_30px_rgba(96,165,250,0.15)] relative overflow-hidden"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <div className="group-hover:translate-x-2 transition-transform duration-300 relative z-10">
                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-1 group-hover:text-blue-400 transition-colors">Ingresar Paquete</h3>
                  <p className="text-xs text-gray-400 font-medium tracking-wide">Registro rápido de encomiendas</p>
               </div>
               <div className="w-16 h-16 rounded-2xl bg-[#0A0A0A] border border-white/5 flex items-center justify-center group-hover:bg-blue-400 group-hover:text-black group-hover:border-blue-400 transition-all duration-300 relative z-10">
                  <span className="material-symbols-outlined text-[32px]">inventory_2</span>
               </div>
            </div>

            {/* Quick Record: Visitors */}
            <div 
              onClick={() => navigate('ManualVisitorRegistration')}
              className="bg-[#111] rounded-[2.5rem] border border-white/5 p-8 flex items-center justify-between cursor-pointer hover:bg-[#141414] hover:border-purple-400/30 transition-all group active:scale-[0.98] shadow-lg hover:shadow-[0_0_30px_rgba(192,132,252,0.15)] relative overflow-hidden"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <div className="group-hover:translate-x-2 transition-transform duration-300 relative z-10">
                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-1 group-hover:text-purple-400 transition-colors">Ingresar Visita</h3>
                  <p className="text-xs text-gray-400 font-medium tracking-wide">Validación de identidad</p>
               </div>
               <div className="w-16 h-16 rounded-2xl bg-[#0A0A0A] border border-white/5 flex items-center justify-center text-gray-400 group-hover:bg-purple-400 group-hover:text-black group-hover:border-purple-400 transition-all duration-300 relative z-10">
                  <span className="material-symbols-outlined text-[32px]">person_add</span>
               </div>
            </div>

            {/* Logbook / Bitacora Shortcut */}
            <div 
              onClick={() => navigate('BitacoraScreen')}
              className="bg-[#111] rounded-[2.5rem] border border-white/5 p-8 flex-1 flex flex-col cursor-pointer transition-colors hover:bg-[#141414] hover:border-white/10 group"
            >
               <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 flex justify-between items-center group-hover:text-white transition-colors">
                 Novedades <span className="material-symbols-outlined text-[16px]">open_in_new</span>
               </h3>
               <div className="space-y-4">
                 <div className="flex items-center gap-3 bg-[#0A0A0A] p-3 rounded-xl border border-white/5">
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                   <p className="text-sm font-medium text-gray-300">Recepción Delivery 402</p>
                 </div>
                 <div className="flex items-center gap-3 bg-[#0A0A0A] p-3 rounded-xl border border-white/5">
                   <div className="w-2 h-2 rounded-full bg-green-500"></div>
                   <p className="text-sm font-medium text-gray-300">Ronda perimetral OK</p>
                 </div>
               </div>
               <span className="mt-auto pt-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right flex items-center justify-end gap-1 group-hover:text-white transition-colors">
                 Abrir Libro Digital <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
               </span>
            </div>

          </div>

        </div>
        </div>

      </main>

      {/* Sticky Mobile Navbar - Overrides Sidebar on small screens */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-[#050505]/95 backdrop-blur-2xl border-t border-white/5 z-50 px-6 py-4 pb-safe flex justify-between items-center text-gray-500">
         <div onClick={() => {}} className="flex flex-col items-center gap-1 cursor-pointer group text-[#00AEEF]">
            <span className="material-symbols-outlined text-[24px]">dashboard</span>
            <span className="text-[10px] font-bold">Inicio</span>
         </div>
         <div onClick={() => navigate('PackageEntry')} className="flex flex-col items-center gap-1 cursor-pointer group hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[24px]">inventory_2</span>
            <span className="text-[10px] font-medium">Paquetes</span>
         </div>
         <div onClick={() => navigate('BitacoraScreen')} className="flex flex-col items-center gap-1 cursor-pointer group hover:text-white transition-colors relative">
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-[2px] border-[#0A0A0A]"></div>
            <span className="material-symbols-outlined text-[24px]">menu_book</span>
            <span className="text-[10px] font-medium">Libro</span>
         </div>
         <div onClick={() => navigate('Emergency')} className="flex flex-col items-center gap-1 cursor-pointer group text-red-500 hover:text-red-400 transition-colors">
            <span className="material-symbols-outlined text-[24px]">sos</span>
            <span className="text-[10px] font-bold">Pánico</span>
         </div>
         <div onClick={() => {}} className="flex flex-col items-center gap-1 cursor-pointer group hover:text-white transition-colors">
            <div className="w-6 h-6 rounded-lg bg-[#111] border border-white/10 text-white flex items-center justify-center font-bold text-[10px]">
              {currentUser?.name ? currentUser.name.charAt(0) : 'C'}
            </div>
            <span className="text-[10px] font-medium">Perfil</span>
         </div>
      </nav>

      {/* Giant SOS Modal */}
      {activeSosAlert && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-red-950/90 backdrop-blur-md animate-[pulse_1.5s_infinite]">
            <div className="bg-red-600 border-4 border-red-400 rounded-[2rem] p-8 md:p-12 max-w-2xl w-full shadow-[0_0_100px_rgba(239,68,68,0.8)] relative text-center">
               <span className="material-symbols-outlined text-[80px] text-white animate-bounce mb-4">warning</span>
               <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 uppercase tracking-tighter">ALERTA SOS</h1>
               <p className="text-xl md:text-3xl text-red-100 mb-8 font-medium">Depto {activeSosAlert.units?.unit_number}</p>
               
               <div className="bg-white/10 rounded-xl p-4 mb-10 text-left backdrop-blur-sm border border-white/20">
                  <p className="text-white text-sm mb-1"><span className="opacity-70">Residente:</span> <span className="font-semibold">{activeSosAlert.profiles?.full_name || 'Desconocido'}</span></p>
                  <p className="text-white text-sm"><span className="opacity-70">Hora Activación:</span> <span className="font-semibold">{new Date(activeSosAlert.created_at).toLocaleTimeString('es-CL')}</span></p>
               </div>

               <button 
                  onClick={resolveSos}
                  className="w-full bg-white text-red-600 font-black text-xl py-6 rounded-2xl shadow-xl hover:bg-gray-100 active:scale-95 transition-all"
               >
                  HE RECIBIDO LA ALERTA
               </button>
               <p className="text-red-200 text-xs mt-4 uppercase tracking-widest font-semibold">Al presionar, confirma que está gestionando la emergencia</p>
            </div>
         </div>
      )}

      {/* Package Delivery Modal */}
      {isPackageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-6 md:p-8 max-w-2xl w-full shadow-2xl relative max-h-[85vh] flex flex-col">
              <button 
                onClick={() => setIsPackageModalOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-[#111] rounded-full flex items-center justify-center border border-white/5 hover:bg-white/10 transition-colors"
                title="Cerrar"
              >
                 <span className="material-symbols-outlined text-gray-400 hover:text-white">close</span>
              </button>

              <h2 className="text-2xl font-light text-white tracking-tight mb-2">Paquetes en <span className="font-bold">Bodega</span></h2>
              <p className="text-gray-400 text-sm mb-6">Gestiona las entregas pendientes de retiro.</p>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                 {parcels.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">No hay paquetes pendientes de entrega.</div>
                 ) : (
                    parcels.map(pkg => (
                       <div key={pkg.id} className="bg-[#111] border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center">
                                 <span className="material-symbols-outlined">inventory_2</span>
                              </div>
                              <div>
                                 <p className="text-white font-bold tracking-wide">Depto {pkg.units?.unit_number || pkg.department_number}</p>
                                 <p className="text-xs text-gray-400">{pkg.recipient_name} • {pkg.package_type}</p>
                                 <p className="text-[10px] text-gray-500 uppercase mt-0.5">{new Date(pkg.created_at).toLocaleString()}</p>
                              </div>
                           </div>
                           <button 
                             onClick={() => handleDeliverPackage(pkg.id)}
                             className="w-full sm:w-auto bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                           >
                             <span className="material-symbols-outlined text-[16px]">check_circle</span>
                             Entregar
                           </button>
                       </div>
                    ))
                 )}
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

// Sidebar Helper
interface SidebarItemProps {
  icon: string;
  label: string;
  active?: boolean;
  expanded: boolean;
  isDanger?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, expanded, isDanger, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-200 
      ${active ? 'bg-white/10 text-white border border-white/15 shadow-sm' 
        : isDanger ? 'text-red-500 hover:bg-red-500/10 hover:border-red-500/30 font-bold' 
        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'} 
      ${expanded ? 'w-full px-4' : 'justify-center w-12 h-12 mx-auto'}`}
      title={!expanded ? label : undefined}
    >
      <span className="material-symbols-outlined text-[20px] font-light">{icon}</span>
      {expanded && <span className={`text-[13px] font-medium tracking-wide truncate ${isDanger ? 'text-red-500' : ''}`}>{label}</span>}
    </div>
  );
};

const MobileNavBtn = ({ icon, active = false, onClick }: { icon: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all ${active ? 'bg-ediflow-primary/20 text-ediflow-primary' : 'text-gray-500 hover:text-white'}`}
  >
    <span className="material-symbols-outlined text-2xl">{icon}</span>
  </button>
);

export default ConciergeDashboard;
