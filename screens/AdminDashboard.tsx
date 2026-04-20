import React, { useState, useEffect } from 'react';
import { ScreenName } from '../App';
import { Logo } from '../components/Logo';
import { useAppContext } from '../src/context/AppContext';

interface Props {
  navigate: (screen: ScreenName) => void;
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<Props> = ({ navigate, onLogout }) => {
  const { setIsGlobalMenuOpen } = useAppContext();
  const [isApproved, setIsApproved] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

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
        className={`hidden md:flex flex-col bg-[#111]/40 backdrop-blur-3xl border-r border-white/5 py-8 px-4 transition-all duration-300 ease-in-out relative z-40 ${isSidebarExpanded ? 'w-64' : 'w-20 items-center'}`}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <div className="mb-8 pl-2">
          {isSidebarExpanded ? (
            <Logo variant="horizontal" color="#FFFFFF" className="scale-[0.85] origin-left" />
          ) : (
            <Logo variant="icon" color="#FFFFFF" className="scale-75" />
          )}
        </div>
        
        {/* User Identity at the top */}
        <div className="w-full pb-6 mb-6 border-b border-white/5 flex flex-col gap-2">
           <div className={`flex items-center gap-3 p-2 rounded-xl border border-transparent hover:border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${isSidebarExpanded ? 'w-full' : 'justify-center'}`}>
              <div className="shrink-0 w-8 h-8 rounded-full bg-ediflow-primary/20 text-ediflow-primary flex items-center justify-center font-bold text-xs ring-1 ring-ediflow-primary/30">
                A
              </div>
              {isSidebarExpanded && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-gray-200">Admin Juan</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                  </p>
                </div>
              )}
           </div>
        </div>

        <nav className="flex-1 space-y-4 w-full overflow-y-auto no-scrollbar pb-4 block">
          <SidebarItem icon="grid_view" label="Dashboard" active expanded={isSidebarExpanded} />
          <SidebarItem icon="document_scanner" label="Finanzas & OCR" onClick={() => navigate('ManageExpenses')} expanded={isSidebarExpanded} />
          <SidebarItem icon="storefront" label="Conserjería" onClick={() => navigate('BitacoraScreen')} expanded={isSidebarExpanded} />
          <SidebarItem icon="group" label="Residentes" onClick={() => navigate('ResidentDirectory')} expanded={isSidebarExpanded} />
          <SidebarItem icon="apps" label="Módulos" onClick={() => setIsGlobalMenuOpen(true)} expanded={isSidebarExpanded} />
          <SidebarItem icon="settings" label="Configuración" expanded={isSidebarExpanded} />
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar relative z-10 w-full">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="md:hidden flex items-center justify-between px-6 pt-12 pb-4">
          <Logo variant="horizontal" className="scale-[0.8] origin-left" />
          <div className="flex gap-3">
             <button title="Notificaciones" className="w-10 h-10 rounded-full bg-[#111] border border-white/10 text-white flex items-center justify-center relative">
               <span className="material-symbols-outlined text-[20px]">notifications</span>
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#111]"></span>
             </button>
             <button onClick={onLogout} title="Cerrar Sesión" className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20 active:scale-95 transition-transform">
               <span className="material-symbols-outlined text-[20px]">logout</span>
             </button>
          </div>
        </header>

        <header className="px-6 md:px-16 pt-4 md:pt-16 pb-8 sticky top-0 z-30 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-transparent pointer-events-none md:bg-none flex justify-between items-start">
          <div className="pointer-events-auto">
             <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white md:mb-2">
               Hola Juan. <br className="md:hidden" />
               <span className="text-gray-500 text-lg md:text-3xl mt-1 md:mt-0 block md:inline">El pulso de tu comunidad.</span>
             </h1>
          </div>
          
          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-4 pointer-events-auto">
             <button 
               title="Notificaciones"
               className="relative w-12 h-12 rounded-full bg-[#111] border border-white/10 hover:border-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-95"
             >
               <span className="material-symbols-outlined text-[24px]">notifications</span>
               <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-[#111] rounded-full"></span>
             </button>
             
             <button 
               onClick={onLogout}
               title="Cerrar Sesión"
               className="px-6 h-12 rounded-full bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-500 transition-all font-semibold uppercase tracking-wider text-[11px] flex items-center gap-2 active:scale-95"
             >
               <span className="material-symbols-outlined text-[18px]">logout</span>
               Salir
             </button>
          </div>
        </header>

        <div className="px-6 md:px-16 pb-32 md:pb-24 max-w-7xl w-full mx-auto">
          {/* Asymmetrical Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            
            {/* LARGE CARD: Pending Payments & AI OCR Expenses (60% visually / col-span-2) */}
            <div className="lg:col-span-2 bg-[#111] rounded-[2rem] border border-white/5 p-6 md:p-10 flex flex-col relative overflow-hidden shadow-2xl group">
               {/* Ambient Glow */}
               <div className="absolute -top-32 -right-32 w-96 h-96 bg-ediflow-primary/5 blur-[100px] rounded-full pointer-events-none transition-opacity group-hover:opacity-100 opacity-60"></div>

               <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 rounded-xl bg-ediflow-primary/10 border border-ediflow-primary/20 flex items-center justify-center shrink-0">
                   <span className="material-symbols-outlined text-ediflow-primary text-[20px]">psychology</span>
                 </div>
                 <div>
                   <h2 className="text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">Acción Requerida</h2>
                 </div>
               </div>

               <div className="mb-10">
                 <h3 className="text-4xl md:text-5xl font-light text-white tracking-tighter mb-4">
                   $1,540,000 <span className="text-lg md:text-2xl text-gray-500 font-normal">CLP</span>
                 </h3>
                 <p className="text-xs md:text-sm text-gray-400 font-light flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse shrink-0"></span> pendientes de revisión mediante IA.
                 </p>
               </div>

               {/* Micro-interaction Container */}
               <div className="mt-auto relative md:h-24 min-h-[5rem] overflow-hidden rounded-2xl bg-[#0A0A0A] border border-white/5">
                 
                 {/* Success State (Hidden initially, slides in) */}
                 <div className={`absolute inset-0 flex items-center justify-center p-4 md:p-0 bg-green-500/10 border border-green-500/20 transition-all duration-[600ms] cubic-bezier(0.4, 0, 0.2, 1) ${isApproved ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
                       <div className="w-8 h-8 rounded-full bg-green-500 text-black flex items-center justify-center shrink-0">
                         <span className="material-symbols-outlined text-[18px] font-bold">check</span>
                       </div>
                       <span className="text-green-400 font-medium text-xs md:text-sm">Gasto procesado y cuadrado en la contabilidad.</span>
                    </div>
                 </div>

                 {/* Action State (Visible initially, slides out) */}
                 <div className={`absolute inset-0 flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:px-6 gap-4 md:gap-2 transition-all duration-[600ms] cubic-bezier(0.4, 0, 0.2, 1) ${isApproving || isApproved ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                    <div className="flex items-center gap-4">
                       <span className="material-symbols-outlined text-gray-400 shrink-0">receipt_long</span>
                       <div>
                         <p className="text-sm font-medium text-white">Factura Enel S.A.</p>
                         <p className="text-xs text-gray-500 font-mono">Lectura: $420,000 (Sin discrepancias)</p>
                       </div>
                    </div>
                    <button 
                      onClick={handleApprove}
                      className="group bg-ediflow-primary text-black px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(0,174,239,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-[0.98] w-full md:w-auto flex items-center justify-center gap-2"
                    >
                      <span>Aprobar Captura</span>
                      <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                 </div>

               </div>
            </div>

            {/* SMALL CARDS CONTAINER (col-span-1) */}
            <div className="flex flex-col gap-6">
              
              {/* SMALL CARD 1: Logbook updates */}
              <div className="bg-[#111] rounded-[2rem] border border-white/5 p-6 md:p-8 flex-1 flex flex-col hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-6">
                   <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">Libro de Novedades</h2>
                   <span className="material-symbols-outlined text-gray-600 text-[18px]">menu_book</span>
                </div>
                <div className="space-y-4">
                   <div className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                      <div>
                         <p className="text-sm text-gray-200 font-medium leading-snug">Filtración de agua reportada</p>
                         <p className="text-[10px] text-gray-500">Unidad 1204 • Hace 15 min</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-1.5 shrink-0"></span>
                      <div>
                         <p className="text-sm text-gray-400 leading-snug hover:text-gray-200 transition-colors cursor-pointer">Cambio de turno conserjería</p>
                         <p className="text-[10px] text-gray-600">Turno Día • Hace 2 horas</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-1.5 shrink-0"></span>
                      <div>
                         <p className="text-sm text-gray-400 leading-snug hover:text-gray-200 transition-colors cursor-pointer">Recepción de encomiendas OK</p>
                         <p className="text-[10px] text-gray-600">Recepción • Hace 3 horas</p>
                      </div>
                   </div>
                </div>
                <button 
                  onClick={() => navigate('BitacoraScreen')}
                  className="mt-auto pt-5 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors flex items-center justify-end gap-2 w-full group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Ver Bitácora Diaria</span> <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>

              {/* SMALL CARD 2: Packages */}
              <div className="bg-[#111] rounded-[2rem] border border-white/5 p-6 md:p-8 hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-4">
                   <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">Paquetería</h2>
                   <span className="material-symbols-outlined text-gray-600 text-[18px]">inventory_2</span>
                </div>
                <div className="flex items-end gap-2 mb-2">
                   <span className="text-3xl font-light text-white">12</span>
                   <span className="text-sm text-gray-500 mb-1">sin entregar</span>
                </div>
                <div className="w-full h-1 bg-[#0A0A0A] rounded-full overflow-hidden mt-4">
                  <div className="w-1/3 h-full bg-yellow-500/50 rounded-full"></div>
                </div>
                <p className="text-[10px] text-gray-500 mt-2 text-right">4 requieren atención (+48 hrs)</p>
              </div>

            </div>

          </div>
        </div>
      </main>

      {/* Sticky Mobile Navbar - Bottom - iOS Style */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-[#0A0A0A]/90 backdrop-blur-xl border-t border-white/5 z-50 px-6 py-4 pb-safe flex justify-between items-center">
         <div onClick={() => {}} className="flex flex-col items-center gap-1 cursor-pointer group text-ediflow-primary">
            <span className="material-symbols-outlined text-[24px]">grid_view</span>
            <span className="text-[10px] font-medium">Inicio</span>
         </div>
         <div onClick={() => navigate('ManageExpenses')} className="flex flex-col items-center gap-1 cursor-pointer group text-gray-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[24px]">document_scanner</span>
            <span className="text-[10px] font-medium">Gastos</span>
         </div>
         <div onClick={() => navigate('BitacoraScreen')} className="flex flex-col items-center gap-1 cursor-pointer group text-gray-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[24px]">storefront</span>
            <span className="text-[10px] font-medium">Conserje</span>
         </div>
         <div onClick={() => setIsGlobalMenuOpen(true)} className="flex flex-col items-center gap-1 cursor-pointer group text-gray-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[24px]">apps</span>
            <span className="text-[10px] font-medium">Módulos</span>
         </div>
         <div onClick={() => {}} className="flex flex-col items-center gap-1 cursor-pointer group text-gray-500 hover:text-white transition-colors">
            <div className="w-6 h-6 rounded-full bg-ediflow-primary/20 text-ediflow-primary flex items-center justify-center font-bold text-[10px] ring-1 ring-ediflow-primary/30">
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
      className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all duration-200 ${active ? 'bg-ediflow-primary/10 text-ediflow-primary border border-ediflow-primary/20' : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'} ${expanded ? 'w-full px-4' : 'justify-center w-12 h-12 mx-auto'}`}
      title={!expanded ? label : undefined}
    >
      <span className="material-symbols-outlined text-[20px] font-light">{icon}</span>
      {expanded && <span className="text-sm font-medium tracking-wide truncate">{label}</span>}
    </div>
  );
};

export default AdminDashboard;
