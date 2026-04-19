import React, { useState, useEffect } from 'react';
import { ScreenName } from '../App';
import { Logo } from '../components/Logo';
import { useAppContext } from '../src/context/AppContext';

interface Props {
  navigate: (screen: ScreenName) => void;
  onLogout?: () => void;
}

export const ResidentServices: React.FC<Props> = ({ navigate, onLogout }) => {
  const { currentUser, setIsGlobalMenuOpen } = useAppContext();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const handleQuickPay = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaid(true);
      setIsPaying(false);
    }, 800);
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white font-sans overflow-hidden py-safe selection:bg-white/10">
      
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
                {currentUser?.name ? currentUser.name.charAt(0) : 'R'}
              </div>
              {isSidebarExpanded && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-gray-200">{currentUser?.name || "Jane Doe"}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-1">
                    Depto 402
                  </p>
                </div>
              )}
           </div>
        </div>
        
        <nav className="flex-1 space-y-4 w-full overflow-y-auto no-scrollbar pb-4 block">
          <SidebarItem icon="grid_view" label="Inicio" active expanded={isSidebarExpanded} />
          <SidebarItem icon="qr_code_2" label="Accesos & Visitas" onClick={() => navigate('QRCodeScreen')} expanded={isSidebarExpanded} />
          <SidebarItem icon="payments" label="Pagos y Boletas" onClick={() => navigate('PaymentsScreen')} expanded={isSidebarExpanded} />
          <SidebarItem icon="deck" label="Reservar Áreas" onClick={() => navigate('Reservations')} expanded={isSidebarExpanded} />
          <SidebarItem icon="forum" label="Comunidad" onClick={() => navigate('CommunityWall')} expanded={isSidebarExpanded} />
          <SidebarItem icon="apps" label="Módulos" onClick={() => setIsGlobalMenuOpen(true)} expanded={isSidebarExpanded} />
          <SidebarItem icon="assignment_late" label="Pánico" onClick={() => navigate('Emergency')} expanded={isSidebarExpanded} isDanger />
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
             <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white md:mb-2">
               Bienvenida, <span className="font-medium">{currentUser?.name ? currentUser.name.split(' ')[0] : 'Jane'}</span>. <br className="md:hidden" />
             </h1>
             <p className="text-gray-500 text-sm md:text-xl md:mt-2 block">Depto 402 al día. Todo en orden.</p>
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

        <div className="px-6 md:px-16 pb-32 md:pb-20 max-w-6xl w-full mx-auto">
          {/* Asymmetrical Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LARGE CARD: Monthly Expenses (60% visually / col-span-2) */}
            <div className="lg:col-span-2 bg-[#111] rounded-[2rem] border border-white/5 p-6 md:p-10 flex flex-col relative overflow-hidden shadow-2xl group">
               {/* Ambient Glow */}
               <div className={`absolute -top-32 -right-32 w-96 h-96 blur-[100px] rounded-full pointer-events-none transition-all duration-1000 ${isPaid ? 'bg-green-500/10' : 'bg-ediflow-primary/5 group-hover:bg-ediflow-primary/10'}`}></div>

               <div className="flex items-center justify-between mb-8 relative z-10">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                     <span className="material-symbols-outlined text-white text-[20px]">account_balance_wallet</span>
                   </div>
                   <div>
                     <h2 className="text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">Gastos Comunes</h2>
                   </div>
                 </div>
                 {isPaid && (
                   <span className="text-[10px] font-bold tracking-widest uppercase text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 hidden md:block">
                     Pagado
                   </span>
                 )}
               </div>

               <div className="mb-10 relative z-10">
                 <p className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Mes en curso (Mayo)</p>
                 <h3 className="text-5xl md:text-6xl font-light text-white tracking-tighter mb-4 flex items-baseline gap-2">
                   {isPaid ? '$0' : '$125,400'} <span className="text-xl md:text-3xl text-gray-500 font-normal">CLP</span>
                 </h3>
                 {!isPaid && (
                    <p className="text-xs md:text-sm text-gray-400 font-light flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-ediflow-primary animate-pulse shrink-0"></span> Vence el 05 de Mayo
                    </p>
                 )}
               </div>

               {/* Payment Interaction Container */}
               <div className="mt-auto relative md:h-20 min-h-[4rem] overflow-hidden rounded-2xl bg-[#0A0A0A] border border-white/5">
                 
                 {/* Success State */}
                 <div className={`absolute inset-0 flex items-center justify-center p-4 md:p-0 bg-green-500/10 border border-green-500/20 transition-all duration-[600ms] cubic-bezier(0.4, 0, 0.2, 1) ${isPaid ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
                       <div className="w-8 h-8 rounded-full bg-green-500 text-black flex items-center justify-center shrink-0">
                         <span className="material-symbols-outlined text-[18px] font-bold">done_all</span>
                       </div>
                       <span className="text-green-400 font-medium text-xs md:text-sm">Deuda saldada. Boleta enviada al correo.</span>
                    </div>
                 </div>

                 {/* Action State */}
                 <div className={`absolute inset-0 flex items-center justify-between p-2 md:p-2 gap-2 transition-all duration-[600ms] cubic-bezier(0.4, 0, 0.2, 1) ${isPaying || isPaid ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                    <div className="hidden md:flex items-center justify-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-full gap-3 text-sm text-gray-400 font-medium">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Apple_Pay_logo.svg" alt="Apple Pay" className="h-4 brightness-200" /> 
                       | Khipu | Tarjetas
                    </div>
                    <button 
                      onClick={handleQuickPay}
                      className="bg-white text-black px-6 py-4 md:py-0 w-full md:w-48 h-full rounded-xl text-sm font-bold hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      Pagar en un clic <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                 </div>

               </div>
            </div>

            {/* SMALL CARDS CONTAINER (col-span-1) */}
            <div className="flex flex-col gap-6">
              
              {/* Dynamic Action Card (E.g. Packages Waiting) */}
              <div 
                onClick={() => navigate('CommunityWall')}
                className="bg-[#111] rounded-[2rem] border border-ediflow-primary/30 p-6 md:p-8 flex-1 flex flex-col hover:border-ediflow-primary/60 transition-colors cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-ediflow-primary"></div>
                <div className="flex items-center justify-between mb-4">
                   <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 group-hover:text-gray-300">Encomiendas</h2>
                   <div className="w-8 h-8 rounded-full bg-ediflow-primary/20 text-ediflow-primary flex items-center justify-center">
                     <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                   </div>
                </div>
                <p className="text-3xl font-light text-white mb-1">1 <span className="text-lg text-gray-500 font-normal">paquete</span></p>
                <p className="text-sm font-medium text-ediflow-primary">Esperando en recepción</p>
                
                <div className="mt-auto pt-4 text-xs font-medium text-gray-500 group-hover:text-white transition-colors flex items-center justify-end gap-1 w-full">
                  Ver código de retiro <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </div>
              </div>

              {/* Quick Links Card */}
              <div className="bg-[#111] rounded-[2rem] border border-white/5 p-6 hover:border-white/10 transition-colors">
                 <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 mb-4 px-2">Acceso Rápido</h2>
                 <div className="grid grid-cols-2 gap-2">
                    <div onClick={() => navigate('Reservations')} className="bg-[#0A0A0A] border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-white/20 transition-all text-gray-400 hover:text-white active:scale-95">
                       <span className="material-symbols-outlined text-[24px]">deck</span>
                       <span className="text-[10px] font-medium text-center">Reservar<br/>Áreas</span>
                    </div>
                    <div onClick={() => navigate('MessagesScreen')} className="bg-[#0A0A0A] border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-white/20 transition-all text-gray-400 hover:text-white active:scale-95">
                       <span className="material-symbols-outlined text-[24px] text-blue-400">support_agent</span>
                       <span className="text-[10px] font-medium text-center">Chat<br/>Conserjería</span>
                    </div>
                 </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      {/* Sticky Mobile Navbar - Bottom - iOS Style */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-[#0A0A0A]/90 backdrop-blur-xl border-t border-white/5 z-50 px-6 py-4 pb-safe flex justify-between items-center text-gray-500">
         <div onClick={() => {}} className="flex flex-col items-center gap-1 cursor-pointer group text-ediflow-primary">
            <span className="material-symbols-outlined text-[24px]">grid_view</span>
            <span className="text-[10px] font-medium">Inicio</span>
         </div>
         <div onClick={() => navigate('PaymentsScreen')} className="flex flex-col items-center gap-1 cursor-pointer group hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[24px]">payments</span>
            <span className="text-[10px] font-medium">Pagos</span>
         </div>
         <div onClick={() => navigate('Reservations')} className="flex flex-col items-center gap-1 cursor-pointer group hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[24px]">deck</span>
            <span className="text-[10px] font-medium">Reservas</span>
         </div>
         <div onClick={() => setIsGlobalMenuOpen(true)} className="flex flex-col items-center gap-1 cursor-pointer group hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[24px]">apps</span>
            <span className="text-[10px] font-medium">Módulos</span>
         </div>
         <div onClick={() => navigate('UserProfile')} className="flex flex-col items-center gap-1 cursor-pointer group hover:text-white transition-colors">
            <div className="w-6 h-6 rounded-full bg-ediflow-primary/20 text-ediflow-primary flex items-center justify-center font-bold text-[10px] ring-1 ring-ediflow-primary/30">
              {currentUser?.name ? currentUser.name.charAt(0) : 'R'}
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

export default ResidentServices;
