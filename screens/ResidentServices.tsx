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
        className={`hidden md:flex flex-col bg-[#0A0A0A]/80 backdrop-blur-3xl border-r border-white/5 py-8 px-4 transition-all duration-300 ease-in-out relative z-40 ${isSidebarExpanded ? 'w-64' : 'w-20 items-center'}`}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <div className="mb-8 pl-2">
          {isSidebarExpanded ? (
            <Logo variant="horizontal" color="#FFFFFF" className="scale-[0.85] origin-left transition-transform" />
          ) : (
            <Logo variant="icon" color="#FFFFFF" className="scale-75 transition-transform" />
          )}
        </div>

        {/* User Identity at the top */}
        <div className="w-full pb-6 mb-6 border-b border-white/5 flex flex-col gap-2">
           <div className={`flex items-center gap-3 py-2 px-1.5 rounded-xl border border-transparent hover:border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${isSidebarExpanded ? 'w-full' : 'justify-center'}`}>
              <div className="shrink-0 w-9 h-9 rounded-full bg-ediflow-primary/10 text-ediflow-primary flex items-center justify-center font-bold text-sm ring-1 ring-ediflow-primary/30">
                {currentUser?.name ? currentUser.name.charAt(0) : 'R'}
              </div>
              {isSidebarExpanded && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-gray-200">{currentUser?.name || "Jane Doe"}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-1 mt-0.5">
                    Depto 402
                  </p>
                </div>
              )}
           </div>
        </div>
        
        <nav className="flex-1 space-y-2 w-full overflow-y-auto no-scrollbar pb-4 block">
          <SidebarItem icon="grid_view" label="Inicio" active expanded={isSidebarExpanded} />
          <SidebarItem icon="qr_code_2" label="Accesos & Visitas" onClick={() => navigate('QRCodeScreen')} expanded={isSidebarExpanded} />
          <SidebarItem icon="payments" label="Pagos y Boletas" onClick={() => navigate('PaymentsScreen')} expanded={isSidebarExpanded} />
          <SidebarItem icon="deck" label="Reservar Áreas" onClick={() => navigate('Reservations')} expanded={isSidebarExpanded} />
          <SidebarItem icon="forum" label="Comunidad" onClick={() => navigate('CommunityWall')} expanded={isSidebarExpanded} />
          <SidebarItem icon="apps" label="Módulos" onClick={() => setIsGlobalMenuOpen(true)} expanded={isSidebarExpanded} />
          
          <div className="pt-6 mt-4 border-t border-white/5">
            <SidebarItem icon="assignment_late" label="Pánico" onClick={() => navigate('Emergency')} expanded={isSidebarExpanded} isDanger />
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar relative z-10 w-full">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="md:hidden flex items-center justify-between px-6 pt-12 pb-4 border-b border-white/5 sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-xl z-30">
          <Logo variant="horizontal" className="scale-[0.8] origin-left" />
          <div className="flex gap-2">
             <button title="Notificaciones" className="w-10 h-10 rounded-full bg-[#111] border border-white/10 text-white flex items-center justify-center relative active:scale-95 transition-transform">
               <span className="material-symbols-outlined text-[20px]">notifications</span>
               <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#00AEEF] rounded-full border border-[#111]"></span>
             </button>
          </div>
        </header>

        {/* Premium Desktop Header */}
        <header className="px-6 md:px-16 pt-8 md:pt-16 pb-8 md:pb-12 sticky top-0 z-20 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/95 to-transparent pointer-events-none md:bg-none flex justify-between items-start">
          <div className="pointer-events-auto">
             <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white md:mb-1 leading-none">
               Hola, <span className="font-medium text-white">{currentUser?.name ? currentUser.name.split(' ')[0] : 'Jane'}</span>.
             </h1>
             <p className="text-ediflow-primary text-xs md:text-sm md:mt-3 mt-2 block font-semibold uppercase tracking-widest flex items-center gap-1.5">
               <span className="material-symbols-outlined text-[14px]">verified_user</span>
               Depto 402 — Al día.
             </p>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-4 pointer-events-auto">
             <button 
               title="Notificaciones"
               className="relative w-12 h-12 rounded-full bg-[#111] border border-white/10 hover:border-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-95 shadow-xl"
             >
               <span className="material-symbols-outlined text-[20px]">notifications</span>
               <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-[#00AEEF] rounded-full"></span>
             </button>
             
             <button 
               onClick={onLogout}
               title="Cerrar Sesión"
               className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95"
             >
               <span className="material-symbols-outlined text-[20px]">logout</span>
             </button>
          </div>
        </header>

        <div className="px-6 md:px-16 pb-32 md:pb-24 max-w-7xl w-full mx-auto relative z-10">
          
          {/* Bento Grid Platform */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            
            {/* LARGE CARD: Financial Core (col-span-2) */}
            <div className="lg:col-span-2 bg-[#111] rounded-[2rem] md:rounded-[2.5rem] border border-white/5 p-6 md:p-10 flex flex-col relative overflow-hidden shadow-2xl group hover:border-white/10 transition-colors">
               
               {/* Cyber Premium Ambient Glow */}
               <div className={`absolute -bottom-32 -right-32 w-96 h-96 blur-[120px] rounded-full pointer-events-none transition-all duration-[1500ms] ${isPaid ? 'bg-green-500/20' : 'bg-[#00AEEF]/20'}`}></div>

               {/* Header of Bento */}
               <div className="flex items-center justify-between mb-8 relative z-10">
                 <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-colors ${isPaid ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-white/5 border-white/10 text-white'}`}>
                     <span className="material-symbols-outlined text-[24px]">{isPaid ? 'check_circle' : 'account_balance_wallet'}</span>
                   </div>
                   <div>
                     <h2 className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-gray-500">Gastos Comunes</h2>
                     <p className="text-white text-sm font-medium tracking-tight">Período de Mayo</p>
                   </div>
                 </div>
                 
                 {isPaid && (
                   <span className="text-[9px] font-bold tracking-widest uppercase text-green-400 bg-green-500/10 px-3 py-1.5 rounded-md border border-green-500/20 hidden md:block">
                     Pagado
                   </span>
                 )}
               </div>

               {/* Center Data */}
               <div className="mb-10 relative z-10">
                 <h3 className="text-6xl md:text-7xl font-light text-white tracking-tighter mb-4 flex items-baseline gap-2">
                   {isPaid ? '$0' : '$125,400'} <span className="text-xl md:text-3xl text-gray-500 font-normal">CLP</span>
                 </h3>
                 {!isPaid && (
                    <p className="text-xs md:text-sm text-gray-400 font-medium flex items-center gap-2">
                       <span className="material-symbols-outlined text-[16px] text-[#00AEEF]">schedule</span> Vence el 05 de Mayo
                    </p>
                 )}
               </div>

               {/* Payment Interaction Container */}
               <div className="mt-auto relative md:h-16 min-h-[4rem] overflow-hidden rounded-2xl bg-[#0A0A0A] border border-white/5">
                 
                 {/* Success State */}
                 <div className={`absolute inset-0 flex items-center justify-center p-4 md:p-0 bg-green-500/10 border border-green-500/20 transition-all duration-[600ms] cubic-bezier(0.4, 0, 0.2, 1) ${isPaid ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
                       <span className="material-symbols-outlined text-green-500">task_alt</span>
                       <span className="text-green-400 font-medium text-xs md:text-sm">Deuda saldada. Boleta recibida.</span>
                    </div>
                 </div>

                 {/* Action State */}
                 <div className={`absolute inset-0 flex items-center justify-between p-2 md:p-2 gap-2 transition-all duration-[600ms] cubic-bezier(0.4, 0, 0.2, 1) ${isPaying || isPaid ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                    <div className="hidden md:flex items-center justify-center bg-[#141414] rounded-xl px-6 h-full gap-4 text-xs text-gray-400 font-medium w-full max-w-[300px]">
                       <span className="text-white">Formas de Pago:</span> Tarjetas, Khipu, Apple Pay
                    </div>
                    <button 
                      onClick={handleQuickPay}
                      className="bg-[#00AEEF] text-black px-6 py-4 md:py-0 w-full md:flex-1 md:max-w-xs h-full rounded-xl text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-[#00AEEF] hover:brightness-110 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,174,239,0.3)]"
                    >
                      Pagar Boleta <span className="material-symbols-outlined text-[18px]">arrow_forward_ios</span>
                    </button>
                 </div>
               </div>
            </div>

            {/* SMALL CARDS CONTAINER (col-span-1) */}
            <div className="flex flex-col gap-6 md:gap-8">
              
              {/* Dynamic Action Notification */}
              <div 
                onClick={() => navigate('CommunityWall')}
                className="bg-[#111] rounded-[2rem] border border-ediflow-primary/30 p-6 md:p-8 flex-1 flex flex-col hover:border-ediflow-primary/60 hover:bg-[#141414] transition-colors cursor-pointer group relative overflow-hidden shadow-xl"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-ediflow-primary opacity-80 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center justify-between mb-4">
                   <h2 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 group-hover:text-gray-300">Recepción</h2>
                   <div className="w-10 h-10 rounded-xl bg-ediflow-primary/10 border border-ediflow-primary/20 text-ediflow-primary flex items-center justify-center">
                     <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                   </div>
                </div>
                <p className="text-4xl md:text-5xl font-light text-white mb-2 tracking-tight">1 <span className="text-lg text-gray-500 font-normal">paquete</span></p>
                <p className="text-xs font-semibold text-ediflow-primary uppercase tracking-widest mt-auto">Esperando Retiro</p>
              </div>

              {/* Quick Links Card */}
              <div className="bg-[#111] rounded-[2rem] border border-white/5 p-6 shadow-xl hover:border-white/10 transition-colors">
                 <h2 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 mb-4 px-2">Acceso Rápido</h2>
                 <div className="grid grid-cols-2 gap-3">
                    <div onClick={() => navigate('Reservations')} className="bg-[#0A0A0A] border border-white/5 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-white/20 transition-all text-gray-400 hover:text-white active:scale-95 group">
                       <span className="material-symbols-outlined text-[28px] group-hover:text-white transition-colors">deck</span>
                       <span className="text-[10px] font-medium text-center uppercase tracking-widest leading-tight">Zonas<br/>Comunes</span>
                    </div>
                    <div onClick={() => navigate('MessagesScreen')} className="bg-[#0A0A0A] border border-white/5 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-400/50 hover:bg-blue-400/5 transition-all text-gray-400 hover:text-white active:scale-95 group">
                       <span className="material-symbols-outlined text-[28px] text-blue-400">support_agent</span>
                       <span className="text-[10px] font-medium text-center uppercase tracking-widest leading-tight">Chat<br/>Conserje</span>
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
            <div className="w-6 h-6 rounded-full bg-[#111] border border-white/10 text-white flex items-center justify-center font-bold text-[10px]">
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
      className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-200 
      ${active ? 'bg-white/10 text-white border border-white/15 shadow-sm' 
        : isDanger ? 'text-red-500 hover:bg-red-500/10 hover:border-red-500/30' 
        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'} 
      ${expanded ? 'w-full px-4' : 'justify-center w-12 h-12 mx-auto'}`}
      title={!expanded ? label : undefined}
    >
      <span className="material-symbols-outlined text-[20px] font-light">{icon}</span>
      {expanded && <span className={`text-[13px] font-medium tracking-wide truncate ${isDanger ? 'text-red-500' : ''}`}>{label}</span>}
    </div>
  );
};

export default ResidentServices;
