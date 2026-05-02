import React, { useState, useEffect } from 'react';
import { ScreenName } from '../App';
import { Logo } from '../components/Logo';
import { useAppContext } from '../src/context/AppContext';
import { supabase } from '../src/lib/supabase-client';

interface Props {
  navigate: (screen: ScreenName) => void;
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<Props> = ({ navigate, onLogout }) => {
  const { setIsGlobalMenuOpen, currentTenant } = useAppContext();
  const [isApproved, setIsApproved] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [maintenanceLogs, setMaintenanceLogs] = useState<any[]>([]);

  useEffect(() => {
    if (!currentTenant) return;
    const fetchMaintenance = async () => {
      const { data } = await supabase
        .from('maintenance_logs')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .order('scheduled_date', { ascending: true })
        .limit(3);
      if (data) setMaintenanceLogs(data);
    };
    fetchMaintenance();
  }, [currentTenant]);

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
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-none">
               Hola, Administrador.
             </h1>
             <p className="text-gray-400 text-lg md:text-2xl mt-4 font-light block">
               El pulso de tu comunidad.
             </p>
          </div>
          
          {/* Desktop Right Actions */}
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
               title="Cerrar Sesión"
               className="h-12 px-6 rounded-xl bg-[#111] border border-white/5 flex items-center justify-center text-red-500/80 hover:bg-red-500/10 hover:text-red-500 transition-all active:scale-95 group font-bold tracking-widest uppercase text-[10px] gap-2"
             >
               <span className="material-symbols-outlined text-[18px]">logout</span> Salir
             </button>
          </div>
        </header>

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

               <div className="flex items-start justify-between mb-12 relative z-10">
                 <div className="flex items-center gap-4 border border-white/5 bg-[#0A0A0A] p-2 pr-6 rounded-full shadow-inner">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors 
                       ${isApproved ? 'bg-green-500/10 text-green-500' : 'bg-[#00AEEF]/10 text-[#00AEEF]'}
                   `}>
                     <span className="material-symbols-outlined text-[20px]">psychology</span>
                   </div>
                   <div>
                     <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Lectura OCR</h2>
                     <p className="text-white text-xs font-medium tracking-tight mt-0.5">Pendiente de revisión</p>
                   </div>
                 </div>
               </div>

               <div className="mb-14 relative z-10 pl-2">
                 <div className="flex items-baseline gap-3 mb-4">
                     <span className="text-2xl md:text-3xl font-light text-gray-500">$</span>
                     <h3 className="text-6xl md:text-7xl lg:text-8xl font-light text-white tracking-tighter">
                       420.000
                     </h3>
                 </div>
                 <p className="text-sm text-gray-400 font-medium flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse shrink-0 shadow-[0_0_8px_rgba(234,179,8,0.8)]"></span> Requiere validación manual
                 </p>
               </div>

               {/* Micro-interaction Container */}
               <div className="mt-auto relative md:h-[88px] min-h-[5rem] overflow-hidden rounded-[1.5rem] bg-[#0A0A0A] border border-white/5 group-hover:border-white/10 transition-colors shadow-inner">
                 
                 {/* Success State (Hidden initially, slides in) */}
                 <div className={`absolute inset-0 flex items-center justify-between px-8 bg-green-500/5 transition-all duration-[800ms] cubic-bezier(0.4, 0, 0.2, 1) ${isApproved ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 border border-green-500/30">
                           <span className="material-symbols-outlined text-[16px]">done_all</span>
                       </div>
                       <span className="text-green-400 font-medium text-sm">Validado. Ingresado a contabilidad mensual.</span>
                    </div>
                 </div>

                 {/* Action State (Visible initially, slides out) */}
                 <div className={`absolute inset-0 flex flex-col md:flex-row items-center justify-between p-2 md:p-2 gap-2 transition-all duration-[600ms] cubic-bezier(0.4, 0, 0.2, 1) ${isApproving || isApproved ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                    <div className="hidden md:flex items-center bg-[#111] border border-white/5 rounded-2xl px-6 h-full gap-4 w-full">
                       <span className="material-symbols-outlined text-gray-500 shrink-0">receipt_long</span>
                       <div>
                         <p className="text-sm font-medium text-white">Factura Enel S.A.</p>
                         <p className="text-xs text-gray-500 font-mono mt-0.5">Confianza OCR: 99.8% (Exacto)</p>
                       </div>
                    </div>
                    <button 
                      onClick={handleApprove}
                      className="bg-[#00AEEF] text-black px-6 py-4 md:py-0 w-full md:w-[280px] shrink-0 h-full rounded-2xl text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-white transition-all shadow-[0_0_30px_rgba(0,174,239,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      Aprobar Captura
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
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
