import React from 'react';
import { ScreenName } from '../App';

interface Props {
  navigate: (screen: ScreenName) => void;
}

const ConciergeDashboard: React.FC<Props> = ({ navigate }) => {
  return (
    <div className="flex flex-col min-h-full pb-20 bg-[#181811]">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex justify-between items-center bg-gradient-to-b from-[#181811] to-[#181811]">
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => navigate('UserProfile')}
              className="w-14 h-14 rounded-full border-2 border-ediflow-primary p-0.5 active:scale-95 transition-transform"
            >
              <img 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            </button>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#181811]"></div>
          </div>
          <div>
            <p className="text-ediflow-primary text-xs font-bold tracking-wider uppercase mb-0.5">En Turno</p>
            <h1 className="text-2xl font-bold text-white">Juan Pérez</h1>
          </div>
        </div>
        <button className="w-10 h-10 rounded-xl bg-[#2A2A20] flex items-center justify-center text-white/80 hover:bg-[#333328] active:scale-90 transition-all">
          <span className="material-symbols-outlined">logout</span>
        </button>
      </header>

      <main className="px-4 space-y-4 flex-1">
        {/* Main Action - Registrar Novedad */}
        <button className="w-full bg-[#24241A] hover:bg-[#2A2A20] active:scale-[0.98] transition-all rounded-3xl p-5 flex items-center justify-between border border-white/5 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
              <span className="material-symbols-outlined text-2xl">notifications_active</span>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-white group-hover:text-ediflow-primary transition-colors">Registrar Novedad</h3>
              <p className="text-sm text-white/40">Reportar incidencia o problema</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-white/20">chevron_right</span>
        </button>

        <div className="grid grid-cols-2 gap-4">
          {/* Ingresar Encomienda */}
          <button 
            onClick={() => navigate('PackageEntry')}
            className="bg-[#24241A] hover:bg-[#2A2A20] active:scale-[0.98] transition-all rounded-3xl p-5 flex flex-col items-start gap-4 border border-white/5 h-44 relative overflow-hidden group"
          >
            <div className="w-12 h-12 rounded-2xl bg-ediflow-primary flex items-center justify-center text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              <span className="material-symbols-outlined text-2xl">package_2</span>
            </div>
            <div className="text-left mt-auto relative z-10">
              <h3 className="text-lg font-bold text-white leading-tight group-hover:text-ediflow-primary transition-colors">Ingresar<br/>Encomienda</h3>
              <p className="text-xs text-white/40 mt-1">Recibir paquete</p>
            </div>
          </button>

          {/* Control Visitas */}
          <button 
             onClick={() => navigate('AccessControl')}
            className="bg-[#24241A] hover:bg-[#2A2A20] active:scale-[0.98] transition-all rounded-3xl p-5 flex flex-col items-start gap-4 border border-white/5 h-44 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <span className="material-symbols-outlined text-2xl">badge</span>
            </div>
            <div className="text-left mt-auto">
              <h3 className="text-lg font-bold text-white leading-tight group-hover:text-blue-400 transition-colors">Control de<br/>Visitas</h3>
              <p className="text-xs text-white/40 mt-1">Registrar ingreso</p>
            </div>
          </button>
        </div>

        {/* Feed Section */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              Últimos Movimientos
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ediflow-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-ediflow-primary"></span>
              </span>
            </h2>
            <button onClick={() => navigate('HistoryScreen')} className="text-xs font-bold text-ediflow-primary hover:text-white active:opacity-70 transition-all">Ver todo</button>
          </div>

          <div className="space-y-3 relative">
             {/* Timeline Line */}
             <div className="absolute left-[19px] top-4 bottom-4 w-[1px] bg-white/10"></div>

            {/* Item 1 */}
            <div className="relative flex items-center gap-4 p-3 bg-[#1F1F18] rounded-2xl border border-white/5">
               <div className="relative z-10 w-10 h-10 rounded-full bg-[#2A2A20] border-2 border-[#1F1F18] flex items-center justify-center text-ediflow-primary">
                  <span className="material-symbols-outlined text-lg">package_2</span>
               </div>
               <div className="flex-1">
                 <div className="flex justify-between items-start">
                   <h4 className="text-sm font-bold text-white">Encomienda entregada</h4>
                   <span className="text-xs font-mono text-white/40">10:45</span>
                 </div>
                 <p className="text-xs text-white/50 mt-0.5">Recibido por Depto 402</p>
               </div>
            </div>

            {/* Item 2 */}
            <div className="relative flex items-center gap-4 p-3 bg-[#1F1F18] rounded-2xl border border-white/5">
               <div className="relative z-10 w-10 h-10 rounded-full bg-[#2A2A20] border-2 border-[#1F1F18] flex items-center justify-center text-blue-400">
                  <span className="material-symbols-outlined text-lg">person_check</span>
               </div>
               <div className="flex-1">
                 <div className="flex justify-between items-start">
                   <h4 className="text-sm font-bold text-white">Visita ingresada</h4>
                   <span className="text-xs font-mono text-white/40">10:30</span>
                 </div>
                 <p className="text-xs text-white/50 mt-0.5">Para Depto 1105 (Juanito S.)</p>
               </div>
            </div>

             {/* Item 3 */}
             <div className="relative flex items-center gap-4 p-3 bg-[#1F1F18] rounded-2xl border border-white/5">
               <div className="relative z-10 w-10 h-10 rounded-full bg-[#2A2A20] border-2 border-[#1F1F18] flex items-center justify-center text-red-500">
                  <span className="material-symbols-outlined text-lg">warning</span>
               </div>
               <div className="flex-1">
                 <div className="flex justify-between items-start">
                   <h4 className="text-sm font-bold text-white">Novedad registrada</h4>
                   <span className="text-xs font-mono text-white/40">09:15</span>
                 </div>
                 <p className="text-xs text-white/50 mt-0.5">Ascensor 2 en mantención</p>
               </div>
            </div>

          </div>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full max-w-[420px] bg-[#1F1F18]/95 backdrop-blur-md border-t border-white/5 pb-6 pt-2 px-6 flex justify-between items-center z-30">
        <NavButton icon="dashboard" label="Panel" active />
        <NavButton icon="history" label="Historial" onClick={() => navigate('HistoryScreen')} />
        <NavButton icon="chat" label="Mensajes" onClick={() => navigate('MessagesScreen')} />
        <NavButton icon="settings" label="Ajustes" onClick={() => navigate('NotificationSettings')} />
      </nav>
    </div>
  );
};

const NavButton = ({ icon, label, active = false, onClick }: { icon: string, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 transition-all active:scale-90 ${active ? 'text-ediflow-primary' : 'text-white/40 hover:text-white'}`}
  >
    <span className={`material-symbols-outlined text-2xl ${active ? 'fill-current' : ''}`}>{icon}</span>
    <span className="text-[10px] font-medium tracking-wide">{label}</span>
  </button>
);

export default ConciergeDashboard;