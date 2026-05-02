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

  const [unitPath, setUnitPath] = useState<string>('Depto ...');
  const [totalDebt, setTotalDebt] = useState<number | null>(null);
  const [pendingParcelsCount, setPendingParcelsCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { supabase } = await import('../src/lib/supabase-client');
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch Unit
        const { data: units } = await supabase
          .from('units')
          .select('id, unit_number')
          .or(`owner_id.eq.${user.id},resident_id.eq.${user.id}`)
          .limit(1);

        if (units && units.length > 0) {
           setUnitPath(units[0].unit_number);
           
           // Fetch pending parcels for this unit
           const { count } = await supabase
              .from('parcels')
              .select('*', { count: 'exact', head: true })
              .eq('department_number', units[0].unit_number)
              .in('status', ['received', 'notified']);
              
           if (count !== null) setPendingParcelsCount(count);
        }

        const { data: txs } = await supabase
          .from('transactions')
          .select('amount, status')
          .eq('user_id', user.id);

        if (txs && txs.length > 0) {
           const pendingTxs = txs.filter(t => t.status === 'pending');
           const debt = pendingTxs.reduce((sum, tx) => sum + Number(tx.amount), 0);
           setTotalDebt(debt);
           setIsPaid(debt === 0);
        } else {
           setTotalDebt(0);
           setIsPaid(true); // Estás al día si no hay deudas registradas
        }
      } catch (err) {
         console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  const handleQuickPay = () => {
    navigate('PaymentsScreen');
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
              <div className="shrink-0 w-9 h-9 rounded-xl bg-[#00AEEF] text-black flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(0,174,239,0.3)]">
                {currentUser?.name ? currentUser.name.charAt(0) : 'R'}
              </div>
              {isSidebarExpanded && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-white">{currentUser?.name || "Residente"}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-1 mt-0.5">
                    {unitPath}
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
               <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#00AEEF] rounded-full shadow-[0_0_8px_rgba(0,174,239,0.5)]"></span>
             </button>
          </div>
        </header>

        {/* Premium Desktop Header */}
        <header className="px-6 md:px-16 pt-8 md:pt-16 pb-8 md:pb-12 sticky top-0 z-20 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/95 to-transparent pointer-events-none md:bg-none flex justify-between items-start">
          <div className="pointer-events-auto">
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white md:mb-2 leading-none flex items-center gap-3">
               Hola, {currentUser?.name ? currentUser.name.split(' ')[0] : 'Residente'}.
             </h1>
             <p className="text-[#00AEEF] text-xs md:text-sm md:mt-4 mt-2 block font-bold uppercase tracking-widest flex items-center gap-2">
               <span className="material-symbols-outlined text-[16px] drop-shadow-[0_0_10px_rgba(0,174,239,0.5)]">verified_user</span>
               {unitPath} — {isPaid ? 'Al día.' : 'Pendiente.'}
             </p>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-5 pointer-events-auto">
             <button 
               title="Notificaciones"
               className="relative w-12 h-12 rounded-xl bg-[#111] border border-white/5 hover:border-white/10 hover:bg-[#141414] flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-95 shadow-xl"
             >
               <span className="material-symbols-outlined text-[20px]">notifications</span>
               <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#00AEEF] rounded-full shadow-[0_0_10px_rgba(0,174,239,0.5)]"></span>
             </button>
             
             <button 
               onClick={onLogout}
               title="Cerrar Sesión"
               className="w-12 h-12 rounded-xl bg-[#111] border border-white/5 flex items-center justify-center text-red-500/80 hover:bg-red-500/10 hover:text-red-500 transition-all active:scale-95 group"
             >
               <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform">logout</span>
             </button>
          </div>
        </header>

        <div className="px-6 md:px-16 pb-32 md:pb-24 max-w-7xl w-full mx-auto relative z-10">
          
          {/* Bento Grid Platform */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            
            {/* LARGE CARD: Financial Core (col-span-2) */}
            <div className={`lg:col-span-2 rounded-[2.5rem] border p-8 md:p-12 flex flex-col relative overflow-hidden shadow-2xl transition-all duration-700 bg-[#111] group
                ${isPaid ? 'border-green-500/20' : 'border-white/5 hover:border-white/10'}
            `}>
               
               {/* Cyber Premium Ambient Glow */}
               <div className={`absolute top-0 right-0 w-[500px] h-[500px] blur-[150px] rounded-full pointer-events-none transition-all duration-[2000ms] 
                   ${isPaid ? 'bg-green-500/10' : 'bg-[#00AEEF]/10 opacity-50 group-hover:opacity-100'}
               `}></div>

               {/* Header of Bento */}
               <div className="flex items-start justify-between mb-12 relative z-10">
                 <div className="flex items-center gap-4 border border-white/5 bg-[#0A0A0A] p-2 pr-6 rounded-full shadow-inner">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors 
                       ${isPaid ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-gray-400'}
                   `}>
                     <span className="material-symbols-outlined text-[20px]">{isPaid ? 'check_circle' : 'account_balance_wallet'}</span>
                   </div>
                   <div>
                     <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Gastos Comunes</h2>
                     <p className="text-white text-xs font-medium tracking-tight mt-0.5">Octubre 2026</p>
                   </div>
                 </div>
                 
                 {isPaid && (
                   <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-green-400 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20 hidden md:flex items-center gap-2 drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]">
                     <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-[pulse_2s_ease-in-out_infinite]"></span> Saldado
                   </span>
                 )}
               </div>

               {/* Center Data */}
               <div className="mb-14 relative z-10 pl-2">
                 <div className="flex items-baseline gap-3 mb-4">
                     <span className="text-2xl md:text-3xl font-light text-gray-500">$</span>
                     <h3 className="text-6xl md:text-7xl lg:text-8xl font-light text-white tracking-tighter">
                       {totalDebt === null ? '...' : (isPaid ? '0' : totalDebt.toLocaleString('es-CL'))}
                     </h3>
                 </div>
                 {!isPaid && (
                    <p className="text-sm text-gray-400 font-medium flex items-center gap-2">
                       <span className="material-symbols-outlined text-[16px] text-red-400">warning</span> Vence en 3 días (05 Nov)
                    </p>
                 )}
                 {isPaid && (
                     <p className="text-sm text-green-400/80 font-medium flex items-center gap-2">
                       <span className="material-symbols-outlined text-[16px]">receipt_long</span> Comprobante disponible en historial.
                     </p>
                 )}
               </div>

               {/* Payment Interaction Container */}
               <div className="mt-auto relative md:h-[72px] min-h-[4rem] overflow-hidden rounded-[1.5rem] bg-[#0A0A0A] border border-white/5 group-hover:border-white/10 transition-colors">
                 
                 {/* Success State */}
                 <div className={`absolute inset-0 flex items-center justify-between px-8 bg-green-500/5 transition-all duration-[800ms] cubic-bezier(0.4, 0, 0.2, 1) ${isPaid ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 border border-green-500/30">
                           <span className="material-symbols-outlined text-[16px]">done_all</span>
                       </div>
                       <span className="text-green-400 font-medium text-sm">Pago Confirmado</span>
                    </div>
                    <button className="text-xs font-bold uppercase tracking-widest text-green-500 hover:text-green-400 hover:bg-green-500/10 px-4 py-2 rounded-lg transition-colors flex items-center gap-1">
                        Ver Recibo <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    </button>
                 </div>

                 {/* Action State */}
                 <div className={`absolute inset-0 flex items-center justify-between p-2 md:p-2 gap-2 transition-all duration-[600ms] cubic-bezier(0.4, 0, 0.2, 1) ${isPaying || isPaid ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                    <div className="hidden md:flex items-center bg-[#111] border border-white/5 rounded-2xl px-6 h-full gap-4 text-xs text-gray-500 font-medium w-full max-w-[340px]">
                       <span className="text-gray-300">Medios:</span> <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-gray-500/20 border border-gray-500/30"></span> Tarjetas</span> / <span className="font-bold text-white tracking-tighter">khipu</span>
                    </div>
                    <button 
                      onClick={handleQuickPay}
                      className="bg-[#00AEEF] text-black px-6 py-4 md:py-0 w-full md:flex-1 md:max-w-[280px] h-full rounded-2xl text-xs font-bold uppercase tracking-[0.15em] hover:bg-white transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,174,239,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                    >
                      Pagar Boleta <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                 </div>
               </div>
            </div>

            {/* SMALL CARDS CONTAINER (col-span-1) */}
            <div className="flex flex-col gap-6 md:gap-8">
              
              {/* Dynamic Action Notification */}
              <div 
                onClick={() => navigate('CommunityWall')}
                className="bg-[#111] rounded-[2.5rem] border border-[#00AEEF]/20 p-8 flex-1 flex flex-col hover:border-[#00AEEF]/50 hover:bg-[#141414] transition-all cursor-pointer group relative overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#00AEEF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="flex items-center justify-between mb-8 relative z-10">
                   <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00AEEF]">Conserjería Central</h2>
                   <div className="w-10 h-10 rounded-full bg-[#00AEEF]/10 border border-[#00AEEF]/20 text-[#00AEEF] flex items-center justify-center group-hover:scale-110 transition-transform">
                     <span className="material-symbols-outlined text-[20px] drop-shadow-[0_0_8px_rgba(0,174,239,0.6)]">inventory_2</span>
                   </div>
                </div>
                <div className="relative z-10">
                    <p className="text-5xl md:text-6xl font-light text-white tracking-tight mb-2 flex items-baseline gap-2">
                        {pendingParcelsCount} <span className="text-lg md:text-xl text-gray-500 font-normal">{pendingParcelsCount === 1 ? 'paquete' : 'paquetes'}</span>
                    </p>
                    {pendingParcelsCount > 0 ? (
                      <p className="text-xs text-gray-400 font-light mt-4 mb-2">Pendientes de retiro en conserjería.</p>
                    ) : (
                      <p className="text-xs text-gray-400 font-light mt-4 mb-2">No tienes entregas pendientes.</p>
                    )}
                </div>
                <span className="text-[10px] font-bold text-white uppercase tracking-widest mt-auto border border-white/10 bg-white/5 self-start px-4 py-2 rounded-full relative z-10 backdrop-blur-md flex items-center gap-2 group-hover:bg-white group-hover:text-black group-hover:border-white transition-colors">
                    Ver Detalles <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </div>

              {/* Quick Links Card */}
              <div className="bg-[#111] rounded-[2.5rem] border border-white/5 p-6 shadow-2xl hover:border-white/10 transition-colors">
                 <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-5 px-2">Accesos Rápidos</h2>
                 <div className="grid grid-cols-2 gap-4">
                    <div onClick={() => navigate('Reservations')} className="bg-[#0A0A0A] border border-white/5 p-6 rounded-[1.5rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-white/20 hover:bg-white/5 transition-all text-gray-400 hover:text-white active:scale-95 group shadow-inner">
                       <span className="material-symbols-outlined text-[24px] md:text-[28px] group-hover:scale-110 transition-transform group-hover:text-orange-400">deck</span>
                       <span className="text-[9px] font-bold text-center uppercase tracking-widest leading-tight">Espacios<br/>Comunes</span>
                    </div>
                    <div onClick={() => navigate('CommunityWall')} className="bg-[#0A0A0A] border border-white/5 p-6 rounded-[1.5rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-amber-500/30 hover:bg-amber-500/5 transition-all text-gray-400 hover:text-white active:scale-95 group shadow-inner">
                       <span className="material-symbols-outlined text-[24px] md:text-[28px] group-hover:scale-110 transition-transform group-hover:text-amber-500">campaign</span>
                       <span className="text-[9px] font-bold text-center uppercase tracking-widest leading-tight">Muro<br/>Oficial</span>
                    </div>
                 </div>
              </div>
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
         <div onClick={() => navigate('PaymentsScreen')} className="flex flex-col items-center gap-1 cursor-pointer group hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
            <span className="text-[10px] font-medium">Pagos</span>
         </div>
         <div onClick={() => navigate('Reservations')} className="flex flex-col items-center gap-1 cursor-pointer group hover:text-white transition-colors text-white/50 relative">
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full border-[2px] border-[#0A0A0A]"></div>
            <span className="material-symbols-outlined text-[24px]">deck</span>
            <span className="text-[10px] font-medium">Reservas</span>
         </div>
         <div onClick={() => setIsGlobalMenuOpen(true)} className="flex flex-col items-center gap-1 cursor-pointer group hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[24px]">apps</span>
            <span className="text-[10px] font-medium">Módulos</span>
         </div>
         <div onClick={() => navigate('UserProfile')} className="flex flex-col items-center gap-1 cursor-pointer group hover:text-white transition-colors">
            <div className="w-6 h-6 rounded-lg bg-[#111] border border-white/10 text-[#00AEEF] flex items-center justify-center font-bold text-[10px]">
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
