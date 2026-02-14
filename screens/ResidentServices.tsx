import React, { useState } from 'react';
import { ScreenName } from '../App';

interface Props {
  navigate: (screen: ScreenName) => void;
}

const ResidentServices: React.FC<Props> = ({ navigate }) => {
  const [isConciergeOnline, setIsConciergeOnline] = useState(true);

  return (
    <div className="flex flex-col min-h-full bg-[#101c22]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4 bg-[#101c22] sticky top-0 z-30">
        <h1 className="text-2xl font-bold tracking-tight text-white">Servicios</h1>
        <button 
            onClick={() => navigate('NotificationSettings')} 
            className="w-10 h-10 rounded-full bg-[#1c262c] text-white flex items-center justify-center hover:bg-gray-700 active:scale-90 transition-all border border-white/5"
            title="Configuración de Notificaciones"
        >
            <span className="material-symbols-outlined">notifications</span>
        </button>
      </div>

      {/* Ticker */}
      <div className="w-full overflow-x-auto no-scrollbar px-5 pb-4">
        <div className="flex gap-3">
             <div className="flex items-center gap-2 bg-[#13a4ec]/10 border border-[#13a4ec]/20 text-[#13a4ec] px-3 py-1.5 rounded-full shrink-0">
                <span className="material-symbols-outlined text-[18px]">package_2</span>
                <span className="text-xs font-bold">2 Encomiendas</span>
            </div>
             <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-3 py-1.5 rounded-full shrink-0">
                <span className="material-symbols-outlined text-[18px]">history</span>
                <span className="text-xs font-bold">Visita registrada</span>
            </div>
        </div>
      </div>

      <div className="px-5 space-y-6 pb-24">
        {/* Concierge Card */}
        <div>
            <h2 className="text-lg font-bold text-white mb-3">Conserje de Turno</h2>
            <div className="flex justify-between gap-4 rounded-2xl bg-[#1c262c] p-4 border border-white/5 relative overflow-hidden">
                <div className="flex flex-col justify-between gap-3 relative z-10">
                    <div>
                        {/* Status Indicator */}
                        <div 
                            className="flex items-center gap-2 mb-1 cursor-pointer w-fit"
                            onClick={() => setIsConciergeOnline(!isConciergeOnline)}
                            title="Click para cambiar estado (Demo)"
                        >
                            <span className="relative flex h-2 w-2">
                                {isConciergeOnline && (
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                )}
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${isConciergeOnline ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isConciergeOnline ? 'text-green-500' : 'text-gray-500'}`}>
                                {isConciergeOnline ? 'En línea' : 'Offline'}
                            </span>
                        </div>
                        
                        <p className="text-white text-lg font-bold">Carlos Ramirez</p>
                        <p className="text-gray-400 text-xs">Turno hasta las 20:00</p>
                    </div>
                    
                    <button 
                        onClick={() => navigate('MessagesScreen')}
                        disabled={!isConciergeOnline}
                        className={`text-white text-sm font-bold py-2 px-4 rounded-lg flex items-center gap-2 w-fit active:scale-95 transition-all ${
                            isConciergeOnline 
                            ? 'bg-[#13a4ec] hover:bg-blue-400' 
                            : 'bg-gray-700 cursor-not-allowed opacity-50'
                        }`}>
                        <span className="material-symbols-outlined text-[18px]">call</span>
                        {isConciergeOnline ? 'Contactar' : 'No disponible'}
                    </button>
                </div>
                <div className="relative">
                    <img 
                        src="https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&q=80&w=200" 
                        className={`w-24 h-32 object-cover rounded-xl transition-all ${!isConciergeOnline ? 'grayscale opacity-50' : ''}`}
                    />
                    {!isConciergeOnline && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-3xl drop-shadow-lg">cloud_off</span>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Grid */}
        <div>
            <h2 className="text-lg font-bold text-white mb-4">Accesos Rápidos</h2>
            <div className="grid grid-cols-2 gap-4">
                <ServiceCard 
                    icon="package_2" 
                    title="2" 
                    subtitle="Por retirar" 
                    color="text-[#13a4ec]" 
                    bgColor="bg-[#13a4ec]/10"
                    onClick={() => navigate('PackageEntry')}
                />
                <ServiceCard 
                    icon="qr_code_scanner" 
                    title="Gestionar Visitas" 
                    subtitle="QR y Registro" 
                    color="text-purple-400" 
                    bgColor="bg-purple-500/10"
                    onClick={() => navigate('AccessControl')}
                />
                <ServiceCard 
                    icon="deck" 
                    title="Reservas" 
                    subtitle="Quincho y Sala" 
                    color="text-amber-400" 
                    bgColor="bg-amber-500/10"
                />
                <ServiceCard 
                    icon="menu_book" 
                    title="Novedades" 
                    subtitle="Bitácora" 
                    color="text-emerald-400" 
                    bgColor="bg-emerald-500/10"
                />
            </div>
        </div>

        {/* SOS */}
        <button className="w-full bg-red-500/10 hover:bg-red-500/20 active:scale-[0.98] border border-red-500/30 text-red-500 rounded-xl p-4 flex items-center justify-center gap-2 transition-all">
            <span className="material-symbols-outlined text-2xl fill-1">local_police</span>
            <span className="font-bold">Emergencia / Plan Cuadrante</span>
        </button>

      </div>

       <nav className="fixed bottom-0 w-full max-w-[420px] bg-[#151e24] border-t border-white/5 pb-6 pt-2 px-6 flex justify-between items-center z-30">
        <NavButton icon="home" label="Inicio" onClick={() => navigate('CommunityWall')} />
        <NavButton icon="grid_view" label="Servicios" active />
        <NavButton icon="payments" label="Pagos" onClick={() => navigate('PaymentsScreen')} />
        <NavButton icon="person" label="Perfil" onClick={() => navigate('UserProfile')} />
      </nav>
    </div>
  );
};

const ServiceCard = ({ icon, title, subtitle, color, bgColor, onClick }: any) => (
    <button onClick={onClick} className="bg-[#1c262c] hover:bg-[#25323a] active:scale-[0.98] transition-all p-4 rounded-2xl border border-white/5 flex flex-col justify-between items-start h-36 relative overflow-hidden group">
        <div className={`absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
             <span className={`material-symbols-outlined text-[100px] ${color}`}>{icon}</span>
        </div>
        <div className={`w-10 h-10 rounded-xl ${bgColor} ${color} flex items-center justify-center mb-2`}>
            <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div className="text-left relative z-10">
            <span className={`block font-bold text-white ${title.length < 3 ? 'text-2xl' : 'text-sm'}`}>{title}</span>
            <span className="text-xs text-gray-400">{subtitle}</span>
        </div>
    </button>
);

const NavButton = ({ icon, label, active = false, onClick }: { icon: string, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 active:scale-90 transition-all ${active ? 'text-[#13a4ec]' : 'text-slate-400 hover:text-white'}`}>
    <span className={`material-symbols-outlined text-2xl ${active ? 'fill-current' : ''}`}>{icon}</span>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default ResidentServices;