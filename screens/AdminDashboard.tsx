import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenName } from '../App';
import { Logo } from '../components/Logo';
import { useAppContext } from '../src/context/AppContext';
import { supabase } from '../src/lib/supabase-client';

interface Props {
  navigate: (screen: ScreenName) => void;
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<Props> = ({ navigate, onLogout }) => {
  const { setIsGlobalMenuOpen, currentTenant, demoMode, setDemoMode, setCurrentTenant } = useAppContext();
  const [isApproved, setIsApproved] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'tenant' | 'consolidated'>('tenant');
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  const [migrationData, setMigrationData] = useState({ unitId: '', amount: '', description: '' });
  const [unitsList, setUnitsList] = useState<any[]>([]);
  const [globalSOS, setGlobalSOS] = useState<any[]>([]);
  const [failedLogs, setFailedLogs] = useState<any[]>([]);
  
  // Available Communities Mock (Simulating Multi-Tenant)
  const availableCommunities = [
     { id: currentTenant?.id || '1', name: currentTenant?.name || 'Edificio Principal', role: 'admin' },
     { id: '2', name: 'Torre Reñaca (Demo)', role: 'admin' },
     { id: '3', name: 'Condominio El Bosque (Demo)', role: 'concierge' } 
  ];

  const handleSelectCommunity = (tenantId: string) => {
     if (tenantId === 'consolidated') {
         setViewMode('consolidated');
     } else {
         const community = availableCommunities.find(c => c.id === tenantId);
         if (community && currentTenant?.id !== community.id) {
           setCurrentTenant({ ...currentTenant, id: community.id, name: community.name } as any);
         }
         setViewMode('tenant');
     }
  };

  const [maintenanceLogs, setMaintenanceLogs] = useState<any[]>([]);
  const [financialStats, setFinancialStats] = useState({ totalCollected: 0, pendingAmount: 0, totalEmitted: 0 });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Check if it's the first time
    const hasVisited = localStorage.getItem('ediflow_welcome_shown');
    if (!hasVisited) {
      setShowWelcome(true);
    }
  }, []);

  const closeWelcome = () => {
    localStorage.setItem('ediflow_welcome_shown', 'true');
    setShowWelcome(false);
  };

  useEffect(() => {
    if (!currentTenant) return;
    const fetchMaintenance = async () => {
      const { data } = await supabase
        .from('maintenance_logs')
        .select('id, equipment_name, provider, scheduled_date, status')
        .eq('tenant_id', currentTenant.id)
        .order('scheduled_date', { ascending: true })
        .limit(3);
      if (data) setMaintenanceLogs(data);
    };

    const fetchFinancialStats = async () => {
      setIsLoadingStats(true);
      const { data } = await supabase
        .from('transactions')
        .select('amount, status')
        .eq('tenant_id', currentTenant.id);

      if (data) {
        const collected = data.filter(t => t.status === 'success')
                              .reduce((acc, curr) => acc + Number(curr.amount), 0);
        const pending = data.filter(t => t.status === 'pending')
                             .reduce((acc, curr) => acc + Number(curr.amount), 0);
        const total = collected + pending;
        
        setFinancialStats({
          totalCollected: collected,
          pendingAmount: pending,
          totalEmitted: total
        });
      }
      setIsLoadingStats(false);
    };

    const fetchUnits = async () => {
       const { data } = await supabase.from('units').select('id, unit_number').eq('tenant_id', currentTenant.id).order('unit_number');
       if (data) setUnitsList(data);
    };

    const fetchGlobalAlertsAndLogs = async () => {
       // Fetch active SOS for the tenant
       const { data: sosData } = await supabase.from('panic_alerts').select('id, status, units(unit_number)').eq('tenant_id', currentTenant.id).eq('status', 'Activo');
       if (sosData) setGlobalSOS(sosData);

       // Fetch failed notifications from audit logs
       const { data: failData } = await supabase.from('audit_logs').select('id').eq('tenant_id', currentTenant.id).in('severity', ['warning', 'critical']).order('created_at', { ascending: false }).limit(5);
       if (failData) setFailedLogs(failData);
    };

    fetchMaintenance();
    fetchFinancialStats();
    fetchUnits();
    fetchGlobalAlertsAndLogs();

    const sosSubscription = supabase.channel('global-sos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'panic_alerts', filter: `tenant_id=eq.${currentTenant.id}` }, () => {
        fetchGlobalAlertsAndLogs();
      }).subscribe();

    return () => {
       supabase.removeChannel(sosSubscription);
    };
  }, [currentTenant]);

  const handleMigrationSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!currentTenant || !migrationData.unitId || !migrationData.amount) return;
     
     try {
       await supabase.from('transactions').insert({
         tenant_id: currentTenant.id,
         unit_id: migrationData.unitId,
         amount: parseFloat(migrationData.amount),
         method: 'Migration',
         status: 'pending',
         billing_month: 'Saldo Anterior'
       });
       
       await supabase.from('audit_logs').insert({
         tenant_id: currentTenant.id,
         action: 'Migración Histórica',
         details: `Se cargó deuda de arrastre por $${migrationData.amount} a la unidad ID: ${migrationData.unitId}`,
         severity: 'info',
         module: 'finance'
       });

       setShowMigrationModal(false);
       setMigrationData({ unitId: '', amount: '', description: '' });
       alert("Saldo inicial cargado exitosamente.");
     } catch (err) {
       console.error(err);
       alert("Error al cargar saldo histórico");
     }
  };

  const delinquencyRate = financialStats.totalEmitted > 0 
    ? (financialStats.pendingAmount / financialStats.totalEmitted) * 100 
    : 0;

  const handleApprove = () => {
    setIsApproving(true);
    setTimeout(() => {
      setIsApproved(true);
      setIsApproving(false);
    }, 600); // Animation duration
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white font-sans overflow-hidden selection:bg-white/10">
      
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
           <div onClick={() => navigate('UserProfile')} className={`flex items-center gap-3 py-2 px-1.5 rounded-xl border border-transparent hover:border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${isSidebarExpanded ? 'w-full' : 'justify-center'}`}>
              <div className="shrink-0 w-9 h-9 rounded-xl bg-[#00AEEF] text-black flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(0,174,239,0.3)]">
                A
              </div>
              {isSidebarExpanded && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-white">Administrador</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span> Online
                  </p>
                </div>
              )}
           </div>
        </div>

        <nav className="flex-1 space-y-2 w-full overflow-y-auto no-scrollbar pb-4 block">
          <SidebarItem icon="grid_view" label="Dashboard" active expanded={isSidebarExpanded} />
          <SidebarItem icon="quick_reference_all" label="Unidades & Residentes" onClick={() => navigate('ResidentDirectory')} expanded={isSidebarExpanded} />
          <SidebarItem icon="account_balance_wallet" label="Finanzas" onClick={() => navigate('ManageExpenses')} expanded={isSidebarExpanded} />
          <SidebarItem icon="deck" label="Espacios Comunes" onClick={() => navigate('Reservations')} expanded={isSidebarExpanded} />
          <SidebarItem icon="groups" label="Equipo de Trabajo" onClick={() => navigate('StaffManagement')} expanded={isSidebarExpanded} />
          <SidebarItem icon="campaign" label="Comunicaciones" onClick={() => navigate('CommunityWall')} expanded={isSidebarExpanded} />
          <SidebarItem icon="policy" label="Auditoría" onClick={() => navigate('AuditLogs')} expanded={isSidebarExpanded} />
          
          <div className="pt-6 mt-4 border-t border-white/5">
            <SidebarItem icon="domain" label="Perfil del Edificio" onClick={() => navigate('BuildingSettings')} expanded={isSidebarExpanded} />
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar relative z-10 w-full">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="md:hidden flex items-center justify-between px-6 pt-12 pb-4 border-b border-white/5 sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-xl z-30">
          <span className="text-xl font-bold tracking-tighter text-[#00AEEF]">Ediflow</span>
          <div className="flex gap-2">
             <button 
                title="Modo Demo" 
                onClick={() => setDemoMode(!demoMode)}
                className={`w-10 h-10 rounded-xl border flex items-center justify-center relative active:scale-95 transition-all ${demoMode ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-[#111] text-gray-500 border-white/10'}`}
             >
               <span className="material-symbols-outlined text-[20px]">science</span>
             </button>
             <button title="Notificaciones" className="w-10 h-10 rounded-xl bg-[#111] border border-white/10 text-white flex items-center justify-center relative active:scale-95 transition-transform">
               <span className="material-symbols-outlined text-[20px]">notifications</span>
               <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
             </button>
             <button onClick={onLogout} title="Cerrar Sesión" className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20 active:scale-95 transition-transform">
               <span className="material-symbols-outlined text-[20px]">logout</span>
             </button>
          </div>
        </header>

        {/* Premium Desktop Header */}
        <header className="px-6 md:px-16 pt-8 md:pt-16 pb-8 md:pb-12 sticky top-0 z-20 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/95 to-transparent pointer-events-none md:bg-none flex flex-col md:flex-row justify-between md:items-start gap-6 md:gap-0">
          <div className="pointer-events-auto">
             <h1 className="text-4xl md:text-5xl lg:text-3xl font-medium tracking-tight text-white leading-none">
               {viewMode === 'consolidated' ? 'Portafolio Global' : currentTenant?.name}
             </h1>
             <p className="text-gray-400 text-sm md:text-lg mt-2 font-light">
               Hola, Administrador. {viewMode === 'consolidated' ? 'Resumen general de tus comunidades.' : 'Estado actual de tu edificio.'}
             </p>
          </div>
          
          {/* Desktop Right Actions */}
          <div className="hidden flex-wrap md:flex items-center gap-5 pointer-events-auto">
             
             {/* Multi-Tenant Selector */}
             <div className="relative group/selector z-50">
                <button className="h-12 px-5 rounded-xl border border-white/10 bg-[#111] hover:bg-[#141414] hover:border-white/20 transition-all shadow-xl flex items-center gap-3">
                   <div className="w-6 h-6 rounded-md bg-ediflow-primary/20 text-ediflow-primary border border-ediflow-primary/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">domain</span>
                   </div>
                   <span className="text-sm font-semibold text-white whitespace-nowrap">
                      {viewMode === 'consolidated' ? '🏢 Portafolio Global (3)' : currentTenant?.name}
                   </span>
                   <span className="material-symbols-outlined text-gray-500 text-[20px]">expand_more</span>
                </button>
                <div className="absolute top-14 right-0 w-64 bg-[#141414] border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover/selector:opacity-100 group-hover/selector:visible transition-all flex flex-col py-2 overflow-hidden backdrop-blur-2xl">
                   <p className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 mb-1">Tu Portafolio</p>
                   <button 
                      onClick={() => handleSelectCommunity('consolidated')}
                      className={`px-4 py-3 text-sm text-left transition-colors flex items-center gap-3 w-full ${viewMode === 'consolidated' ? 'bg-white/5 text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                   >
                     <span className="material-symbols-outlined text-[18px]">dashboard</span> Vista Consolidada
                   </button>
                   {availableCommunities.map(c => (
                      <button 
                        key={c.id} 
                        onClick={() => handleSelectCommunity(c.id)}
                        className={`px-4 py-3 text-sm text-left transition-colors flex items-center gap-3 w-full border-t border-white/5 ${viewMode === 'tenant' && currentTenant?.id === c.id ? 'bg-white/5 text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                      >
                         <span className="material-symbols-outlined text-[18px]">{c.role === 'admin' ? 'admin_panel_settings' : 'badge'}</span>
                         <div className="flex flex-col">
                            <span>{c.name}</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest">{c.role === 'admin' ? 'Administrador' : 'Conserje'}</span>
                         </div>
                      </button>
                   ))}
                   <button className="px-4 py-3 text-sm text-left text-ediflow-primary hover:bg-ediflow-primary/10 transition-colors flex items-center gap-3 w-full border-t border-white/5 font-bold">
                     <span className="material-symbols-outlined text-[18px]">add_circle</span> Crear Comunidad
                   </button>
                </div>
             </div>

             <button 
                onClick={() => setDemoMode(!demoMode)}
                title="Modo Demo"
                className={`h-12 px-6 rounded-xl border flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-xl ${demoMode ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-[#111] text-gray-400 border-white/5 hover:border-white/10 hover:text-white'}`}
             >
                <span className="material-symbols-outlined text-[16px]">science</span>
                {demoMode ? 'Demo: ON' : 'Demo: OFF'}
             </button>
             <button 
                title="Notificaciones"
                className="relative w-12 h-12 rounded-xl bg-[#111] border border-white/5 hover:border-white/10 hover:bg-[#141414] flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-95 shadow-xl"
             >
               <span className="material-symbols-outlined text-[20px]">notifications</span>
               <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
             </button>
             
             <button 
               onClick={onLogout}
               title="Cerrar Sesión"
               className="h-12 px-6 rounded-xl bg-[#111] border border-white/5 flex items-center justify-center text-red-500/80 hover:bg-red-500/10 hover:text-red-500 transition-all active:scale-95 group font-bold tracking-widest uppercase text-[10px] gap-2"
             >
               <span className="material-symbols-outlined text-[18px]">logout</span> Salir
             </button>
          </div>
        </header>

        {viewMode === 'consolidated' ? (
           <ConsolidatedDashboardStats 
              availableCommunities={availableCommunities} 
              navigate={navigate}
              financialStats={financialStats}
              globalSOS={globalSOS}
              failedLogs={failedLogs}
           />
        ) : (
           <div className="px-6 md:px-16 pb-32 md:pb-24 max-w-7xl w-full mx-auto relative z-10">
           {/* Asymmetrical Bento Grid */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            
            {/* LARGE CARD: Pending Payments & AI OCR Expenses (60% visually / col-span-2) */}
            <div className={`lg:col-span-2 rounded-[2.5rem] border p-8 md:p-12 flex flex-col relative overflow-hidden shadow-2xl transition-all duration-700 bg-[#111] group
                ${isApproved ? 'border-green-500/20' : 'border-[#00AEEF]/20 hover:border-[#00AEEF]/40'}
            `}>
               {/* Ambient Glow */}
               <div className={`absolute top-0 right-0 w-[500px] h-[500px] blur-[150px] rounded-full pointer-events-none transition-all duration-[2000ms] 
                   ${isApproved ? 'bg-green-500/10' : 'bg-[#00AEEF]/10 opacity-50 group-hover:opacity-100'}
               `}></div>

               <div className="flex flex-wrap items-start justify-between mb-12 relative z-10 gap-4">
                 <div className="flex items-center gap-4 border border-white/5 bg-[#0A0A0A] p-2 pr-6 rounded-full shadow-inner">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors 
                       ${isApproved ? 'bg-green-500/10 text-green-500' : 'bg-[#00AEEF]/10 text-[#00AEEF]'}
                   `}>
                     <span className="material-symbols-outlined text-[20px]">analytics</span>
                   </div>
                   <div>
                     <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Salud Financiera</h2>
                     <p className="text-white text-xs font-medium tracking-tight mt-0.5">Recaudación del mes</p>
                   </div>
                 </div>
                 
                 <button onClick={() => setShowMigrationModal(true)} className="flex items-center gap-2 bg-[#1A1A1A] border border-white/10 hover:bg-[#222] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest text-ediflow-primary transition-colors">
                    <span className="material-symbols-outlined text-[16px]">history</span> Cargar Deuda Arrastre
                 </button>
               </div>

               <div className="mb-14 relative z-10 pl-2">
                 <div className="flex items-baseline gap-3 mb-4">
                     <span className="text-2xl md:text-3xl font-light text-gray-500">$</span>
                     <h3 className="text-6xl md:text-7xl lg:text-8xl font-light text-white tracking-tighter">
                       {financialStats.totalCollected.toLocaleString('es-CL')}
                     </h3>
                 </div>
                 <div className="flex flex-col md:flex-row gap-6 md:items-center">
                    <p className="text-sm text-gray-400 font-medium flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0 shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span> Ingresos confirmados
                    </p>
                    <p className="text-sm text-gray-400 font-medium flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.8)] ${delinquencyRate > 15 ? 'bg-red-500' : 'bg-amber-500'}`}></span> Morosidad: {delinquencyRate.toFixed(1)}%
                    </p>
                 </div>
               </div>

               <div className="mt-auto grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                  <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
                     <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Por Recaudar</p>
                     <p className="text-xl font-mono text-amber-500 font-bold">${financialStats.pendingAmount.toLocaleString('es-CL')}</p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
                     <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Emitido</p>
                     <p className="text-xl font-mono text-white font-bold">${financialStats.totalEmitted.toLocaleString('es-CL')}</p>
                  </div>
               </div>
            </div>

            {/* SMALL CARDS CONTAINER (col-span-1) */}
            <div className="flex flex-col gap-6 md:gap-8">
              
              {/* SMALL CARD 1: Logbook updates */}
              <div 
                onClick={() => navigate('BitacoraScreen')}
                className="bg-[#111] rounded-[2.5rem] border border-white/5 p-8 flex-1 flex flex-col hover:border-white/20 hover:bg-[#141414] transition-all cursor-pointer group shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-white opacity-20 group-hover:opacity-40 transition-opacity"></div>
                
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Libro Novedades</h2>
                   <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                     <span className="material-symbols-outlined text-[20px]">menu_book</span>
                   </div>
                </div>
                <div className="space-y-5">
                   <div className="flex items-start gap-4">
                      <span className="w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(248,113,113,0.8)]"></span>
                      <div>
                         <p className="text-sm text-gray-200 font-medium leading-tight">Filtración reportada P4</p>
                         <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Hace 15 min</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-4">
                      <span className="w-2 h-2 rounded-full bg-white/20 mt-1.5 shrink-0"></span>
                      <div>
                         <p className="text-sm text-gray-400 leading-tight">Turno Día Finalizado</p>
                         <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">Hace 2 horas</p>
                      </div>
                   </div>
                </div>
                <span className="mt-auto pt-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 group-hover:text-white transition-colors">
                  Ir al Libro Digital <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </div>

              {/* SMALL CARD 2: Packages Alert */}
              <div 
                onClick={() => navigate('BitacoraScreen')}
                className="bg-[#111] rounded-[2.5rem] border border-amber-500/20 p-8 hover:border-amber-500/50 hover:bg-[#141414] transition-all cursor-pointer group shadow-2xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="flex items-center justify-between mb-6 relative z-10">
                   <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500">Alerta Paquetes</h2>
                   <span className="material-symbols-outlined text-amber-500/50 group-hover:text-amber-500 transition-colors text-[20px]">inventory_2</span>
                </div>
                <div className="flex items-baseline gap-2 mb-2 relative z-10">
                   <span className="text-5xl font-light text-white tracking-tight">4</span>
                   <span className="text-sm text-gray-500 font-medium">sin retirar</span>
                </div>
                <div className="w-full h-1 bg-[#0A0A0A] rounded-full overflow-hidden mt-4 mb-3 relative z-10">
                  <div className="w-2/3 h-full bg-amber-500/50 rounded-full"></div>
                </div>
                <p className="text-[10px] font-bold text-amber-400/80 tracking-widest uppercase relative z-10">+48 hrs en bodega</p>
              </div>

            </div>

          </div>

          <div className="mt-8 md:mt-12 bg-[#111] rounded-[2.5rem] border border-white/5 p-8 flex flex-col shadow-2xl relative overflow-hidden group hover:border-[#00AEEF]/20 transition-all">
            <div className="flex items-center justify-between mb-8 relative z-10 w-full">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#00AEEF]/10 border border-[#00AEEF]/20 text-[#00AEEF] flex items-center justify-center shadow-inner">
                     <span className="material-symbols-outlined text-[24px]">verified</span>
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-light text-white tracking-tight">Próximos Hitos</h2>
                    <p className="text-sm text-gray-500 mt-1">Certificaciones y Mantenimiento Preventivo</p>
                  </div>
               </div>
               <button 
                  onClick={() => navigate('Maintenance')} 
                  className="bg-[#0A0A0A] border border-white/10 hover:bg-white hover:text-black transition-colors rounded-xl px-4 py-2 text-[10px] uppercase font-bold tracking-widest hidden md:flex"
               >
                  Ver Todo
               </button>
            </div>
            
            <div className="flex flex-col gap-4 relative z-10 w-full">
               {maintenanceLogs.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 text-sm bg-[#0A0A0A] rounded-2xl border border-white/5">
                    No hay hitos programados próximos.
                  </div>
               ) : (
                 maintenanceLogs.map(log => {
                   const isOverdue = log.status === 'overdue' || new Date(log.scheduled_date) < new Date();
                   return (
                     <div key={log.id} className="flex items-center justify-between p-4 md:p-6 rounded-2xl border border-white/5 bg-[#0A0A0A] hover:bg-[#0f0f0f] transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isOverdue ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-gray-400'}`}>
                             <span className="material-symbols-outlined text-[20px]">{log.equipment_name.toLowerCase().includes('ascensor') ? 'elevator' : log.equipment_name.toLowerCase().includes('gas') ? 'fire_extinguisher' : 'engineering'}</span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{log.equipment_name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{log.provider || 'Sin proveedor asignado'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                           <p className={`text-sm font-bold ${isOverdue ? 'text-red-500' : 'text-white'}`}>{new Date(log.scheduled_date).toLocaleDateString()}</p>
                           <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{isOverdue ? 'Vencido' : 'Programado'}</p>
                        </div>
                     </div>
                   );
                 })
               )}
            </div>
          </div>

        </div>
        )}
      </main>

      {/* Sticky Mobile Navbar - Bottom - iOS Style */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-[#050505]/95 backdrop-blur-2xl border-t border-white/5 z-50 px-6 py-4 pb-safe flex justify-between items-center text-gray-500">
         <div onClick={() => {}} className="flex flex-col items-center gap-1 cursor-pointer group text-[#00AEEF]">
            <span className="material-symbols-outlined text-[24px]">grid_view</span>
            <span className="text-[10px] font-bold">Inicio</span>
         </div>
         <div onClick={() => navigate('ManageExpenses')} className="flex flex-col items-center gap-1 cursor-pointer group hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
            <span className="text-[10px] font-medium">Finanzas</span>
         </div>
         <div onClick={() => navigate('StaffManagement')} className="flex flex-col items-center gap-1 cursor-pointer group hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[24px]">groups</span>
            <span className="text-[10px] font-medium">Equipo</span>
         </div>
         <div onClick={() => setIsGlobalMenuOpen(true)} className="flex flex-col items-center gap-1 cursor-pointer group hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[24px]">apps</span>
            <span className="text-[10px] font-medium">Módulos</span>
         </div>
         <div onClick={() => navigate('UserProfile')} className="flex flex-col items-center gap-1 cursor-pointer group hover:text-white transition-colors">
            <div className="w-6 h-6 rounded-lg bg-[#111] border border-white/10 text-[#00AEEF] flex items-center justify-center font-bold text-[10px]">
              A
            </div>
            <span className="text-[10px] font-medium">Perfil</span>
         </div>
      </nav>

      <AnimatePresence>
        {showWelcome && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeWelcome}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-[#111] rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="h-40 bg-gradient-to-br from-[#00AEEF] to-[#005F82] relative flex items-center justify-center">
                 <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                 <div className="relative text-center">
                    <span className="material-symbols-outlined text-6xl text-white mb-2">waving_hand</span>
                    <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Bienvenido a Ediflow</h2>
                 </div>
              </div>
              <div className="p-8">
                 <p className="text-gray-300 text-center mb-8 leading-relaxed">
                   Estamos felices de tenerte aquí. Ediflow es tu nuevo aliado en la gestión de comunidades. Para comenzar con el pie derecho, te recomendamos realizar los siguientes pasos:
                 </p>
                 <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                       <span className="material-symbols-outlined text-blue-400">domain</span>
                       <div>
                          <p className="font-bold text-sm text-white">Configura tu Edificio</p>
                          <p className="text-[10px] text-gray-500">Carga el RUT, logo y cuentas bancarias en Ajustes.</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                       <span className="material-symbols-outlined text-emerald-400">group_add</span>
                       <div>
                          <p className="font-bold text-sm text-white">Importa Unidades</p>
                          <p className="text-[10px] text-gray-500">Usa nuestra herramienta de Excel para subir residentes masivamente.</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                       <span className="material-symbols-outlined text-amber-400">account_balance_wallet</span>
                       <div>
                          <p className="font-bold text-sm text-white">Registra un Egreso</p>
                          <p className="text-[10px] text-gray-500">Sube tu primera factura y deja que nuestra IA haga el resto.</p>
                       </div>
                    </div>
                 </div>
                 <button 
                   onClick={closeWelcome}
                   className="w-full py-4 rounded-xl bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-[#00AEEF] hover:text-white transition-all shadow-xl"
                 >
                   Comenzar mi Experiencia
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Migration Modal */}
      <AnimatePresence>
        {showMigrationModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowMigrationModal(false)}
               className="absolute inset-0 bg-black/80 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="relative w-full max-w-lg bg-[#111] rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]"
             >
                <div className="p-8 border-b border-white/5 flex items-center gap-4 bg-gradient-to-br from-[#1A1A1A] to-[#111]">
                   <div className="w-12 h-12 rounded-2xl bg-ediflow-primary/10 text-ediflow-primary border border-ediflow-primary/20 flex items-center justify-center shadow-inner">
                      <span className="material-symbols-outlined text-[24px]">history</span>
                   </div>
                   <div>
                      <h2 className="text-xl font-bold text-white tracking-tight">Cargar Deuda de Arrastre</h2>
                      <p className="text-sm text-gray-500">Migración histórica manual.</p>
                   </div>
                </div>
                <div className="p-8 overflow-y-auto custom-scrollbar">
                   <form id="migration-form" onSubmit={handleMigrationSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Unidad Afectada</label>
                        <select 
                           value={migrationData.unitId} 
                           onChange={(e) => setMigrationData({...migrationData, unitId: e.target.value})}
                           className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF] transition-all outline-none"
                           required
                        >
                           <option value="">Selecciona una unidad...</option>
                           {unitsList.map(u => (
                              <option key={u.id} value={u.id}>Unidad {u.unit_number}</option>
                           ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Monto ($)</label>
                        <input 
                           type="number"
                           value={migrationData.amount} 
                           onChange={(e) => setMigrationData({...migrationData, amount: e.target.value})}
                           className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF] transition-all outline-none font-mono"
                           placeholder="Ej: 45000"
                           required
                           min="1"
                        />
                      </div>
                   </form>
                </div>
                <div className="p-6 border-t border-white/5 bg-[#0A0A0A] flex justify-end gap-3 shrink-0">
                   <button 
                     type="button" 
                     onClick={() => setShowMigrationModal(false)}
                     className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-widest"
                   >
                      Cancelar
                   </button>
                   <button 
                     type="submit" 
                     form="migration-form"
                     className="px-6 py-3 rounded-xl bg-[#00AEEF] hover:bg-[#0098D1] text-white transition-all shadow-[0_0_15px_rgba(0,174,239,0.3)] hover:shadow-[0_0_25px_rgba(0,174,239,0.5)] text-sm font-bold uppercase tracking-widest"
                   >
                      Cargar Saldo
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

// Subcomponent for Sidebar Items
interface SidebarItemProps {
  icon: string;
  label: string;
  active?: boolean;
  expanded: boolean;
  onClick?: () => void;
}

const ConsolidatedDashboardStats: React.FC<{ 
   availableCommunities: any[], 
   navigate: any,
   financialStats: any,
   globalSOS: any[],
   failedLogs: any[]
}> = ({ availableCommunities, navigate, financialStats, globalSOS, failedLogs }) => {
  const totalMorosidad = financialStats.pendingAmount + 1300000; // Mocking other buildings
  const totalEgresos = 14200000;
  
  return (
     <div className="px-6 md:px-16 pb-32 md:pb-24 max-w-7xl w-full mx-auto relative z-10 animate-fade-in text-gray-300">
        <div className="mb-8 flex justify-between items-end">
           <div>
             <h2 className="text-2xl font-light text-white tracking-tight mb-2">Torre de Control</h2>
             <p className="text-sm text-gray-400">Resumen global de todos tus condominios activos.</p>
           </div>
        </div>

        {globalSOS.length > 0 && (
          <div className="mb-8 p-6 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-between border-l-4 border-l-red-500 animate-pulse-slow shadow-[0_0_20px_rgba(239,68,68,0.2)] cursor-pointer" onClick={() => navigate('ConciergeDashboard')}>
             <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-red-500 text-3xl">emergency</span>
                <div>
                   <h3 className="text-red-400 font-bold text-lg">¡ALERTA GLOBAL SOS ACTIVA!</h3>
                   <p className="text-sm text-red-400/80">Se requiere asistencia inmediata en <strong>{availableCommunities[0].name}</strong>, Unidad {globalSOS[0]?.units?.unit_number || 'Desconocida'}.</p>
                </div>
             </div>
             <button className="bg-red-500 text-white font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-widest shadow-lg">Ir a Conserjería</button>
          </div>
        )}

        {/* Global KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-red-500/20 transition-all">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#00AEEF]/5 blur-[40px] rounded-full pointer-events-none"></div>
               <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2 flex items-center gap-2">Morosidad Global</p>
               <h3 className="text-4xl text-red-400 font-light tracking-tight mt-1">${totalMorosidad.toLocaleString('es-CL')}</h3>
               <p className="text-[10px] text-gray-500 mt-2 font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">warning</span> En {availableCommunities.length} comunidades
               </p>
            </div>
            <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-emerald-500/20 transition-all">
               <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2 flex items-center gap-2">Egresos Totales</p>
               <h3 className="text-4xl text-emerald-400 font-light tracking-tight mt-1">${totalEgresos.toLocaleString('es-CL')}</h3>
               <p className="text-[10px] text-gray-500 mt-2 font-bold">Mes en curso</p>
            </div>
            <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-amber-500/20 transition-all cursor-pointer" onClick={() => navigate('AuditLogs')}>
               <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2 flex items-center gap-2">Estado Notificaciones</p>
               <div className="flex items-end gap-3 mt-1">
                 <h3 className="text-4xl text-white font-light tracking-tight">{failedLogs.length}</h3>
                 <span className="text-sm font-medium text-amber-500 pb-1">Fallos de Envío</span>
               </div>
               <p className="text-[10px] text-ediflow-primary mt-2 font-bold flex items-center gap-1">Ver Audit Logs <span className="material-symbols-outlined text-[14px]">arrow_forward</span></p>
            </div>
        </div>

        {/* Communities List */}
        <div className="bg-[#111] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl mb-8">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                   <span className="material-symbols-outlined text-gray-400">domain</span> Portafolio Activo
                </h3>
            </div>
            <table className="w-full text-left text-sm text-gray-300">
             <thead className="text-[10px] text-gray-500 uppercase bg-[#1A1A1A] border-b border-white/5 tracking-widest font-bold">
               <tr>
                 <th className="px-6 py-4">Edificio</th>
                 <th className="px-6 py-4">Rol</th>
                 <th className="px-6 py-4 text-right">Recaudación</th>
                 <th className="px-6 py-4 text-right">Morosidad</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-white/5">
                <tr className="hover:bg-[#141414] transition-colors cursor-pointer" onClick={() => {}}>
                   <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                          <span className="text-xs">{(availableCommunities[0].name.substring(0, 2)).toUpperCase()}</span>
                       </div>
                       {availableCommunities[0].name}
                   </td>
                   <td className="px-6 py-4">
                      <span className="bg-ediflow-primary/10 text-ediflow-primary px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest border border-ediflow-primary/20">Admin</span>
                   </td>
                   <td className="px-6 py-4 text-right">
                      <span className="text-emerald-400 font-mono">
                        {financialStats.totalEmitted > 0 ? ((financialStats.totalCollected / financialStats.totalEmitted) * 100).toFixed(0) : '0'}%
                      </span>
                   </td>
                   <td className="px-6 py-4 text-right text-white font-mono">${financialStats.pendingAmount.toLocaleString('es-CL')}</td>
                </tr>
                {availableCommunities.slice(1).map((c) => (
                  <tr key={c.id} className="hover:bg-[#141414] transition-colors cursor-pointer" onClick={() => {}}>
                     <td className="px-6 py-4 font-medium text-gray-400 flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <span className="text-xs">{(c.name.substring(0, 2)).toUpperCase()}</span>
                         </div>
                         {c.name}
                     </td>
                     <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest border border-gray-500/20 ${c.role === 'admin' ? 'bg-ediflow-primary/10 text-ediflow-primary' : 'bg-gray-500/10 text-gray-400'}`}>{c.role}</span>
                     </td>
                     <td className="px-6 py-4 text-right">
                        <span className="text-gray-500 font-mono">--</span>
                     </td>
                     <td className="px-6 py-4 text-right text-gray-500 font-mono">--</td>
                  </tr>
                ))}
             </tbody>
            </table>
        </div>
     </div>
  );
};

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, expanded, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-200 
      ${active ? 'bg-white/10 text-white border border-white/15 shadow-sm' 
        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'} 
      ${expanded ? 'w-full px-4' : 'justify-center w-12 h-12 mx-auto'}`}
      title={!expanded ? label : undefined}
    >
      <span className="material-symbols-outlined text-[20px] font-light">{icon}</span>
      {expanded && <span className="text-[13px] font-medium tracking-wide truncate">{label}</span>}
    </div>
  );
};

export default AdminDashboard;
