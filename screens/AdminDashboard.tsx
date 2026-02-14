import React, { useState } from 'react';
import { ScreenName } from '../App';

interface Props {
  navigate: (screen: ScreenName) => void;
}

const AdminDashboard: React.FC<Props> = ({ navigate }) => {
  return (
    <div className="flex flex-col min-h-full bg-[#101c22]">
      <div className="sticky top-0 z-20 bg-[#101c22]/95 backdrop-blur-sm px-5 py-4 flex items-center justify-between border-b border-white/5">
         <div>
            <h1 className="text-xl font-bold text-white">Panel de Control</h1>
            <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vista Administrador</span>
            </div>
         </div>
         <button onClick={() => navigate('ConciergeDashboard')} className="w-10 h-10 rounded-full bg-[#1c262c] flex items-center justify-center text-white hover:bg-[#2a363e] active:scale-90 transition-all">
            <span className="material-symbols-outlined">settings_account_box</span>
         </button>
      </div>

      <div className="p-5 pb-24 space-y-6">
        {/* Metrics */}
        <div>
            <h2 className="text-xs font-bold text-gray-500 uppercase mb-3 ml-1">Métricas en Tiempo Real</h2>
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
                <MetricCard icon="deck" color="text-[#13a4ec]" value="85%" label="Ocupación Quinchos" progress={85} progressColor="bg-[#13a4ec]" />
                <MetricCard icon="inventory_2" color="text-amber-500" value="12" label="Sin retirar (+48h)" progress={40} progressColor="bg-amber-500" warning />
                <MetricCard icon="assignment_late" color="text-purple-400" value="3" label="Reclamos Abiertos" progress={25} progressColor="bg-purple-400" />
            </div>
        </div>

        {/* Community Analytics Chart */}
        <div>
             <h2 className="text-xs font-bold text-gray-500 uppercase mb-3 ml-1">Estadísticas de la Comunidad</h2>
             <StatsChart />
        </div>

        {/* Administration */}
        <div>
             <h2 className="text-xs font-bold text-gray-500 uppercase mb-3 ml-1">Administración</h2>
             <div className="grid grid-cols-2 gap-3">
                <button className="bg-white text-[#101c22] p-4 rounded-xl shadow-lg active:scale-[0.98] transition-all flex flex-col items-start gap-3 h-32 relative overflow-hidden">
                    <div className="bg-[#101c22]/10 w-10 h-10 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">settings_b_roll</span>
                    </div>
                    <span className="text-sm font-bold leading-tight text-left">Configuración<br/>de Edificio</span>
                    <span className="material-symbols-outlined absolute -right-2 -bottom-2 text-[80px] text-black/5">apartment</span>
                </button>
                <button className="bg-[#13a4ec] text-white p-4 rounded-xl shadow-lg active:scale-[0.98] transition-all flex flex-col items-start gap-3 h-32 relative overflow-hidden">
                     <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                        <span className="material-symbols-outlined text-2xl">badge</span>
                    </div>
                    <span className="text-sm font-bold leading-tight text-left">Gestión de<br/>Personal</span>
                </button>
             </div>
        </div>

        {/* Modules Control */}
        <div>
             <div className="flex items-center justify-between mb-3 ml-1">
                 <h2 className="text-xs font-bold text-gray-500 uppercase">Control de Módulos</h2>
                 <button className="text-[#13a4ec] text-xs font-bold flex items-center gap-1 active:text-white transition-colors">
                    <span className="material-symbols-outlined text-sm">tune</span> Personalizar
                 </button>
             </div>
             <div className="space-y-3">
                <ModuleItem icon="local_shipping" title="Encomiendas" desc="25 recibidas hoy" badge="8 pendientes" badgeColor="text-red-500 bg-red-500/10" color="text-blue-500 bg-blue-500/10" />
                <ModuleItem icon="deck" title="Espacios Comunes" desc="Quinchos y Sala" badge="4 Reservas" badgeColor="text-emerald-500 bg-emerald-500/10" color="text-emerald-500 bg-emerald-500/10" />
                <ModuleItem icon="menu_book" title="Libro Novedades" desc="Bitácora Digital" color="text-gray-400 bg-gray-500/10" />
             </div>
        </div>

      </div>

      <nav className="fixed bottom-0 w-full max-w-[420px] bg-[#151e24] border-t border-white/5 pb-6 pt-2 px-6 flex justify-between items-center z-30">
        <NavButton icon="dashboard" label="Resumen" active />
        <NavButton icon="admin_panel_settings" label="Gestión" onClick={() => navigate('AccessControl')} />
        <NavButton icon="analytics" label="Finanzas" onClick={() => navigate('PaymentsScreen')} />
        <NavButton icon="forum" label="Comunidad" onClick={() => navigate('CommunityWall')} />
      </nav>

    </div>
  );
};

const StatsChart = () => {
    const [activeTab, setActiveTab] = useState<'packages' | 'visitors' | 'requests'>('packages');

    const data = {
        packages: [12, 19, 15, 25, 22, 30, 18],
        visitors: [8, 12, 10, 15, 20, 25, 15],
        requests: [2, 5, 3, 4, 1, 2, 6]
    };
    
    const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    
    const currentData = data[activeTab];
    const maxVal = Math.max(...currentData) * 1.2; // Scaling
    
    const getBarColor = () => {
        if(activeTab === 'packages') return 'bg-blue-500';
        if(activeTab === 'visitors') return 'bg-purple-500';
        return 'bg-amber-500';
    }

    const getTitle = () => {
        if(activeTab === 'packages') return 'Encomiendas Entregadas';
        if(activeTab === 'visitors') return 'Visitas Totales';
        return 'Solicitudes de Servicio';
    }

    return (
        <div className="bg-[#1c262c] p-5 rounded-2xl border border-white/5 shadow-lg">
             <div className="flex justify-between items-center mb-6">
                <div>
                     <h2 className="text-sm font-bold text-white">{getTitle()}</h2>
                     <p className="text-[10px] text-gray-500">Últimos 7 días</p>
                </div>
                <div className="flex bg-[#101c22] rounded-lg p-0.5 border border-white/5">
                    <button 
                        onClick={() => setActiveTab('packages')}
                        className={`p-1.5 rounded-md transition-all active:scale-95 ${activeTab === 'packages' ? 'bg-[#1c262c] text-blue-400 shadow-sm ring-1 ring-white/10' : 'text-gray-500 hover:text-white'}`}
                        title="Encomiendas"
                    >
                        <span className="material-symbols-outlined text-[18px]">package_2</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('visitors')}
                        className={`p-1.5 rounded-md transition-all active:scale-95 ${activeTab === 'visitors' ? 'bg-[#1c262c] text-purple-400 shadow-sm ring-1 ring-white/10' : 'text-gray-500 hover:text-white'}`}
                        title="Visitas"
                    >
                        <span className="material-symbols-outlined text-[18px]">group</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('requests')}
                        className={`p-1.5 rounded-md transition-all active:scale-95 ${activeTab === 'requests' ? 'bg-[#1c262c] text-amber-400 shadow-sm ring-1 ring-white/10' : 'text-gray-500 hover:text-white'}`}
                        title="Solicitudes"
                    >
                        <span className="material-symbols-outlined text-[18px]">assignment</span>
                    </button>
                </div>
            </div>

            {/* Chart Area */}
            <div className="flex items-end justify-between h-32 gap-3 px-1">
                {currentData.map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative">
                        <div className="w-full flex items-end justify-center h-full relative">
                             {/* Background rail */}
                             <div className="absolute bottom-0 w-[6px] h-full bg-white/5 rounded-full"></div>
                            
                            {/* Value Bar */}
                            <div 
                                className={`w-full max-w-[6px] rounded-full opacity-80 group-hover:opacity-100 transition-all duration-500 ease-out ${getBarColor()} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
                                style={{ height: `${Math.max((value / maxVal) * 100, 10)}%` }}
                            ></div>
                            
                            {/* Tooltip on hover */}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-[#101c22] text-[10px] font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 z-10 pointer-events-none whitespace-nowrap">
                                {value}
                                <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 group-hover:text-white transition-colors">{days[index]}</span>
                    </div>
                ))}
            </div>
            
            <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-500 font-medium">
                 <div className="flex items-center gap-2">
                     <span className={`w-2 h-2 rounded-full ${activeTab === 'packages' ? 'bg-blue-500' : activeTab === 'visitors' ? 'bg-purple-500' : 'bg-amber-500'}`}></span>
                     <span>Promedio: <span className="text-white font-bold">{Math.round(currentData.reduce((a, b) => a + b, 0) / 7)}</span> / día</span>
                 </div>
                 <button className="flex items-center gap-1 hover:text-white transition-colors active:scale-95">
                    Detalles <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                 </button>
            </div>
        </div>
    );
};

const MetricCard = ({ icon, color, value, label, progress, progressColor, warning }: any) => (
    <div className="min-w-[140px] bg-[#1c262c] p-4 rounded-xl border border-white/5 flex flex-col justify-between h-32 relative overflow-hidden">
        <div className="flex justify-between items-start z-10">
            <span className={`material-symbols-outlined ${color}`}>{icon}</span>
            {warning && <span className="text-[10px] font-bold bg-amber-500/20 text-amber-500 px-1.5 rounded">!</span>}
        </div>
        <div className="z-10">
            <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
            <div className="text-[10px] text-gray-400 font-medium truncate">{label}</div>
            <div className="h-1.5 w-full bg-gray-700 rounded-full mt-2 overflow-hidden">
                <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${progress}%` }}></div>
            </div>
        </div>
        <span className={`material-symbols-outlined absolute -right-2 -top-2 text-[60px] opacity-5 ${color}`}>{icon}</span>
    </div>
);

const ModuleItem = ({ icon, title, desc, badge, badgeColor, color }: any) => (
    <div className="flex items-center justify-between p-3 bg-[#1c262c] rounded-xl border border-white/5">
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <div>
                <h3 className="text-sm font-bold text-white">{title}</h3>
                <p className="text-xs text-gray-500">{desc}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            {badge && <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${badgeColor}`}>{badge}</span>}
            <button className="text-gray-500 hover:text-white active:scale-90 active:text-white transition-all"><span className="material-symbols-outlined">edit_square</span></button>
        </div>
    </div>
);

const NavButton = ({ icon, label, active = false, onClick }: { icon: string, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 active:scale-90 transition-all ${active ? 'text-[#13a4ec]' : 'text-slate-400 hover:text-white'}`}>
    <span className={`material-symbols-outlined text-2xl ${active ? 'fill-current' : ''}`}>{icon}</span>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default AdminDashboard;