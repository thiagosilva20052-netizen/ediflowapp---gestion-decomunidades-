import React, { useState, useEffect } from 'react';
import { ScreenName } from '../App';
import { useAppContext } from '../src/context/AppContext';
import { Logo } from '../components/Logo';

interface Props {
  navigate: (screen: ScreenName) => void;
  onLogout?: () => void;
}

export const ConciergeDashboard: React.FC<Props> = ({ navigate, onLogout }) => {
  const { currentUser, setIsGlobalMenuOpen } = useAppContext();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white font-sans overflow-hidden py-safe selection:bg-white/10">
      
      {/* Sleek Collapsible Sidebar (Glassmorphism & Narrow) */}
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
              <div className="shrink-0 w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs ring-1 ring-blue-500/30">
                {currentUser?.name ? currentUser.name.charAt(0) : 'C'}
              </div>
              {isSidebarExpanded && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-gray-200">{currentUser?.name || "Conserje Turno"}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> En línea
                  </p>
                </div>
              )}
           </div>
        </div>
        
        <nav className="flex-1 space-y-4 w-full overflow-y-auto no-scrollbar pb-4 block">
          <SidebarItem icon="home" label="Consola Principal" active expanded={isSidebarExpanded} />
          <SidebarItem icon="inventory_2" label="Paquetería OCR" onClick={() => navigate('PackageEntry')} expanded={isSidebarExpanded} />
          <SidebarItem icon="badge" label="Registro Visitas" onClick={() => navigate('ManualVisitorRegistration')} expanded={isSidebarExpanded} />
          <SidebarItem icon="menu_book" label="Libro Novedades" onClick={() => navigate('BitacoraScreen')} expanded={isSidebarExpanded} />
          <SidebarItem icon="apps" label="Módulos" onClick={() => setIsGlobalMenuOpen(true)} expanded={isSidebarExpanded} />
          <SidebarItem icon="assignment_late" label="Pánico" onClick={() => navigate('Emergency')}  expanded={isSidebarExpanded} isDanger/>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar relative z-10 px-4 md:px-10 pb-20 pt-8 md:pt-12 max-w-6xl mx-auto w-full">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="md:hidden flex justify-between items-center mb-6 px-2">
           <Logo variant="horizontal" className="scale-[0.8] origin-left" />
           <div className="flex gap-3">
             <button title="Notificaciones" className="relative w-10 h-10 rounded-full bg-[#111] border border-white/10 text-white flex items-center justify-center">
               <span className="material-symbols-outlined text-[20px]">notifications</span>
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-[#111] rounded-full"></span>
             </button>
             <button onClick={onLogout} title="Cerrar Sesión" className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20">
               <span className="material-symbols-outlined text-[20px]">logout</span>
             </button>
           </div>
        </header>

        <header className="mb-8 px-2 flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
           <div>
             <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white mb-2">
               Turno: <span className="font-medium text-white">Día</span>.
             </h1>
             {currentTime && (
               <p className="text-xl md:text-2xl font-mono text-gray-500">{currentTime}</p>
             )}
           </div>

           <div className="hidden md:flex items-center gap-4">
              <button 
                title="Notificaciones"
                className="relative w-12 h-12 rounded-full bg-[#111] border border-white/10 hover:border-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[24px]">notifications</span>
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-[#111] rounded-full"></span>
              </button>
              
              <button 
                onClick={onLogout}
                title="Finalizar Turno / Cerrar Sesión"
                className="px-6 h-12 rounded-full bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-500 transition-all font-semibold uppercase tracking-wider text-[11px] flex items-center gap-2 active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Finalizar Turno
              </button>
           </div>
        </header>

        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* SHIFT OVERVIEW (Hero Action Box) */}
          <div className="lg:col-span-2 bg-[#111] rounded-[2.5rem] border border-white/5 relative overflow-hidden shadow-2xl flex flex-col min-h-[400px] p-8 md:p-10 transition-all duration-500 hover:border-white/10">
             
             {/* Ambient Glow */}
             <div className={`absolute -bottom-32 -right-32 bg-blue-500/10 blur-[100px] w-96 h-96 rounded-full pointer-events-none`}></div>

             <div className="relative z-10 flex flex-col h-full w-full">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
                     Estado Operativo del Condominio
                   </h2>
                   <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                     <span className="material-symbols-outlined text-gray-400 text-[20px]">dashboard</span>
                   </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-auto">
                   <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-white/5 flex flex-col">
                      <span className="material-symbols-outlined text-blue-400 mb-4">inventory_2</span>
                      <span className="text-3xl font-light text-white mb-1">12</span>
                      <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Paquetes en Bodega</span>
                   </div>
                   <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-white/5 flex flex-col">
                      <span className="material-symbols-outlined text-purple-400 mb-4">group</span>
                      <span className="text-3xl font-light text-white mb-1">4</span>
                      <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Visitas Activas</span>
                   </div>
                   <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-white/5 flex flex-col">
                      <span className="material-symbols-outlined text-green-400 mb-4">directions_car</span>
                      <span className="text-3xl font-light text-white mb-1">2</span>
                      <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Estacionam. Libres</span>
                   </div>
                   <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-white/5 flex flex-col">
                      <span className="material-symbols-outlined text-amber-400 mb-4">key</span>
                      <span className="text-3xl font-light text-white mb-1">1</span>
                      <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Llave Prestada</span>
                   </div>
                </div>

                {/* Attention Required Banner */}
                <div className="mt-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <span className="material-symbols-outlined text-red-400">warning</span>
                     <div>
                       <p className="text-sm font-medium text-white">Atención Requerida</p>
                       <p className="text-xs text-red-200">2 paquetes de Depto 402 llevan más de 72 hrs sin retirar.</p>
                     </div>
                   </div>
                   <button className="text-xs font-semibold bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                     Notificar
                   </button>
                </div>
             </div>
          </div>

          {/* Quick Tools Column */}
          <div className="flex flex-col gap-6">
            
            {/* Quick Record: Packages */}
            <div 
              onClick={() => navigate('PackageEntry')}
              className="bg-[#111] rounded-[2rem] border border-white/5 p-6 md:p-8 flex items-center justify-between cursor-pointer hover:bg-ediflow-primary/5 hover:border-ediflow-primary/30 transition-all group"
            >
               <div>
                  <h3 className="text-lg font-medium text-white mb-1 group-hover:text-ediflow-primary transition-colors">Escanear Paquete</h3>
                  <p className="text-xs text-gray-500">Extraer datos con cámara (OCR)</p>
               </div>
               <div className="w-12 h-12 rounded-2xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center group-hover:bg-ediflow-primary group-hover:text-black transition-all">
                  <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
               </div>
            </div>

            {/* Quick Record: Visitors */}
            <div 
              onClick={() => navigate('ManualVisitorRegistration')}
              className="bg-[#111] rounded-[2rem] border border-white/5 p-6 md:p-8 flex items-center justify-between cursor-pointer hover:bg-white/5 hover:border-white/20 transition-all group"
            >
               <div>
                  <h3 className="text-lg font-medium text-white mb-1">Registrar Visita</h3>
                  <p className="text-xs text-gray-500">Ingreso manual RUT/Pasaporte</p>
               </div>
               <div className="w-12 h-12 rounded-2xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-black transition-all">
                  <span className="material-symbols-outlined text-2xl">person_add</span>
               </div>
            </div>

            {/* Logbook Timeline Snippet */}
            <div className="bg-[#111] rounded-[2rem] border border-white/5 p-6 md:p-8 flex-1 flex flex-col">
               <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 mb-6">Últimos Registros</h3>
               <div className="space-y-5 flex-1 line-clamp-3 overflow-hidden">
                  <div className="flex items-start gap-4">
                     <span className="material-symbols-outlined text-blue-400 text-[18px]">inventory_2</span>
                     <div>
                        <p className="text-sm font-medium text-gray-200">Paquete Amazon</p>
                        <p className="text-[10px] text-gray-500">Depto 402 - Hace 5 min</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-4">
                     <span className="material-symbols-outlined text-purple-400 text-[18px]">badge</span>
                     <div>
                        <p className="text-sm font-medium text-gray-200">Visita: Camila T.</p>
                        <p className="text-[10px] text-gray-500">Depto 1004 - Hace 45 min</p>
                     </div>
                  </div>
               </div>
               <button onClick={() => navigate('BitacoraScreen')} className="mt-4 text-[#008080] text-xs font-medium hover:text-white transition-colors text-right flex items-center justify-end gap-1 w-full">
                  Ver Bitácora Diaria <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
               </button>
            </div>

          </div>

        </div>

      </main>

      {/* Sticky Mobile Navbar - Overrides Sidebar on small screens */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 h-20 bg-[#0A0A0A]/90 backdrop-blur-xl border-t border-white/5 z-50 px-6 py-4 pb-safe flex justify-between items-center text-gray-500">
         <div onClick={() => {}} className="flex flex-col items-center gap-1 cursor-pointer group text-ediflow-primary">
            <span className="material-symbols-outlined text-[24px]">dashboard</span>
            <span className="text-[10px] font-medium">Inicio</span>
         </div>
         <div onClick={() => navigate('PackageEntry')} className="flex flex-col items-center gap-1 cursor-pointer group hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[24px]">inventory_2</span>
            <span className="text-[10px] font-medium">Bodega</span>
         </div>
         <div onClick={() => navigate('BitacoraScreen')} className="flex flex-col items-center gap-1 cursor-pointer group hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[24px]">menu_book</span>
            <span className="text-[10px] font-medium">Novedades</span>
         </div>
         <div onClick={() => setIsGlobalMenuOpen(true)} className="flex flex-col items-center gap-1 cursor-pointer group hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[24px]">apps</span>
            <span className="text-[10px] font-medium">Módulos</span>
         </div>
         <div onClick={() => {}} className="flex flex-col items-center gap-1 cursor-pointer group hover:text-white transition-colors">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px] ring-1 ring-blue-500/30">
              {currentUser?.name ? currentUser.name.charAt(0) : 'C'}
            </div>
            <span className="text-[10px] font-medium">Perfil</span>
         </div>
      </nav>

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
      className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all duration-200 
      ${active ? 'bg-ediflow-primary/10 text-ediflow-primary border border-ediflow-primary/20' 
        : isDanger ? 'text-red-500 hover:bg-red-500/10 hover:border-red-500/30' 
        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'} 
      ${expanded ? 'w-full px-4' : 'justify-center w-12 h-12 mx-auto'}`}
      title={!expanded ? label : undefined}
    >
      <span className="material-symbols-outlined text-[20px] font-light">{icon}</span>
      {expanded && <span className={`text-sm font-medium tracking-wide truncate ${isDanger ? 'text-red-500' : ''}`}>{label}</span>}
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
