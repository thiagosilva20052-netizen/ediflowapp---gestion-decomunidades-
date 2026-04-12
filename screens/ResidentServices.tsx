import React, { useState } from 'react';
import { ScreenName } from '../App';
import { Logo } from '../components/Logo';
import { Card } from '../src/components/ui/Card';
import { Button } from '../src/components/ui/Button';
import { NotificationDrawer } from '../src/components/notifications/NotificationDrawer';

interface Props {
  navigate: (screen: ScreenName) => void;
}

const ResidentServices: React.FC<Props> = ({ navigate }) => {
  const [isConciergeOnline, setIsConciergeOnline] = useState(true);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#000000] text-white">
      
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex flex-col w-72 bg-[#121212] border-r-2 border-gray-800 p-8 sticky top-0 h-screen">
        <Logo variant="horizontal" className="mb-12" />
        
        <nav className="flex-1 space-y-4">
          <SidebarButton icon="home" label="Inicio" onClick={() => navigate('CommunityWall')} />
          <SidebarButton icon="grid_view" label="Servicios" active />
          <SidebarButton icon="payments" label="Pagos" onClick={() => navigate('PaymentsScreen')} />
          <SidebarButton icon="chat" label="Mensajería" onClick={() => navigate('MessagesScreen')} />
          <SidebarButton icon="person" label="Mi Perfil" onClick={() => navigate('UserProfile')} />
        </nav>

        <div className="mt-auto pt-8 border-t-2 border-gray-800">
          <div className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-2xl border-2 border-gray-800">
            <div className="w-12 h-12 rounded-full bg-[#00AEEF] flex items-center justify-center font-black text-white">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">Jane Doe</p>
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Depto 402</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-full pb-24 md:pb-10">
        
        {/* Header */}
        <header className="px-6 md:px-10 pt-10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6 sticky top-0 z-20 bg-[#000000]/80 backdrop-blur-md border-b-2 border-gray-800 md:border-none">
          <div className="md:hidden flex justify-between items-center w-full">
            <Logo variant="horizontal" className="scale-90 origin-left" />
            <button onClick={() => setIsNotificationDrawerOpen(true)} className="w-12 h-12 rounded-full bg-[#121212] flex items-center justify-center border-2 border-gray-800 relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-3 right-3 w-2 h-2 bg-[#00AEEF] rounded-full"></span>
            </button>
          </div>
          
          <div className="hidden md:block">
            <h1 className="text-4xl font-black tracking-tight">Mis Servicios</h1>
            <p className="text-gray-500 font-medium mt-1">Todo lo que necesitas para tu hogar.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 bg-[#121212] border-2 border-gray-800 rounded-full px-6 py-3">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-bold uppercase tracking-widest">Residente Activo</span>
            </div>
            <button 
              onClick={() => setIsNotificationDrawerOpen(true)}
              className="hidden md:flex w-14 h-14 rounded-full bg-[#121212] border-2 border-gray-800 items-center justify-center text-gray-400 hover:text-white transition-colors relative"
            >
              <span className="material-symbols-outlined text-3xl">notifications</span>
              <span className="absolute top-4 right-4 w-3 h-3 bg-[#00AEEF] rounded-full border-2 border-[#121212]"></span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="px-6 md:px-10 py-6 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Top Row: QR & Financial */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* QR Access Card */}
            <Card className="p-8 bg-[#00AEEF] border-none text-white flex flex-col justify-between min-h-[300px] relative overflow-hidden group cursor-pointer" onClick={() => navigate('QRCodeScreen')}>
              <div className="relative z-10">
                <h2 className="text-3xl font-black mb-2">Acceso Rápido</h2>
                <p className="text-white/80 font-medium mb-8">Genera tu código QR para visitas o acceso personal.</p>
                <div className="w-32 h-32 bg-white p-2 rounded-2xl shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=EdiflowAccess" alt="QR Code" className="w-full h-full" />
                </div>
              </div>
              <div className="relative z-10 mt-8">
                <span className="inline-flex items-center gap-2 bg-white text-[#00AEEF] px-6 py-3 rounded-full font-black text-sm">
                  Abrir QR
                  <span className="material-symbols-outlined">qr_code_2</span>
                </span>
              </div>
              <span className="material-symbols-outlined absolute -right-10 -bottom-10 text-[220px] text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                qr_code_scanner
              </span>
            </Card>

            {/* Financial Status */}
            <Card className="lg:col-span-2 p-8 bg-[#121212] border-gray-800 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black">Gastos Comunes</h3>
                  <p className="text-gray-500">Estado de cuenta actual</p>
                </div>
                <span className="text-xs font-black bg-green-500/10 text-green-500 px-4 py-1.5 rounded-full border border-green-500/20">AL DÍA</span>
              </div>

              <div className="flex flex-col md:flex-row items-end gap-8">
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Total a Pagar</p>
                  <h4 className="text-5xl font-black">$125.400</h4>
                  <p className="text-xs text-gray-500 mt-2 font-medium italic">Vence el 05 de Mayo, 2026</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                  <Button onClick={() => navigate('PaymentsScreen')} className="flex-1 md:flex-none bg-white text-black border-none px-8 h-14 font-black">
                    Ver Detalle
                  </Button>
                  <Button onClick={() => navigate('PaymentsScreen')} className="flex-1 md:flex-none bg-[#00AEEF] text-white border-none px-8 h-14 font-black">
                    Pagar Ahora
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ServiceCard 
              icon="package_2" 
              label="Encomiendas" 
              value="2" 
              desc="Por retirar"
              color="text-blue-500"
              onClick={() => navigate('Emergency')} // Using Emergency as a temporary "Module in development" placeholder or just leave it
            />
            <ServiceCard 
              icon="deck" 
              label="Reservas" 
              value="1" 
              desc="Activa"
              color="text-amber-500"
              onClick={() => navigate('Reservations')}
            />
            <ServiceCard 
              icon="campaign" 
              label="Anuncios" 
              value="3" 
              desc="Nuevos"
              color="text-purple-500"
              onClick={() => navigate('CommunityWall')}
            />
            <ServiceCard 
              icon="chat" 
              label="Mensajes" 
              value="0" 
              desc="Sin leer"
              color="text-[#00AEEF]"
              onClick={() => navigate('MessagesScreen')}
            />
          </div>

          {/* Bottom Row: Concierge & Emergency */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Concierge Status */}
            <Card className="p-8 bg-[#121212] border-gray-800">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00AEEF]">support_agent</span>
                Conserje de Turno
              </h3>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&q=80&w=200" 
                    alt="Concierge" 
                    className={`w-24 h-24 rounded-2xl object-cover border-2 ${isConciergeOnline ? 'border-green-500' : 'border-gray-700 grayscale'}`}
                  />
                  <span className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-[#121212] ${isConciergeOnline ? 'bg-green-500' : 'bg-gray-700'}`}></span>
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-black">{isConciergeOnline ? 'Carlos Ramirez' : 'Fuera de Turno'}</h4>
                  <p className="text-gray-500 font-medium mb-4">Turno hasta las 20:00</p>
                  <Button 
                    onClick={() => navigate('MessagesScreen')}
                    disabled={!isConciergeOnline}
                    className={`${isConciergeOnline ? 'bg-[#00AEEF] text-white' : 'bg-gray-800 text-gray-500'} border-none px-6`}
                    icon="chat"
                  >
                    Contactar
                  </Button>
                </div>
              </div>
            </Card>

            {/* Emergency & SOS */}
            <Card className="p-8 bg-red-500/5 border-red-500/20 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-red-500 mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined">emergency</span>
                  Seguridad y Emergencia
                </h3>
                <p className="text-gray-400 font-medium mb-6">Acceso directo a servicios de emergencia y plan cuadrante.</p>
              </div>
              <div className="space-y-4">
                <button className="w-full h-14 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95">
                  <span className="material-symbols-outlined">local_police</span>
                  LLAMAR SEGURIDAD
                </button>
                <button className="w-full h-14 bg-white/5 hover:bg-white/10 text-white border-2 border-white/10 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95">
                  <span className="material-symbols-outlined">medical_services</span>
                  AMBULANCIA / BOMBEROS
                </button>
              </div>
            </Card>
          </div>

        </div>

        {/* Mobile Nav */}
        <nav className="md:hidden fixed bottom-0 w-full bg-[#121212] border-t-2 border-gray-800 pb-8 pt-4 px-6 flex justify-between items-center z-30">
          <NavButton icon="home" label="Inicio" onClick={() => navigate('CommunityWall')} />
          <NavButton icon="grid_view" label="Servicios" active />
          <NavButton icon="payments" label="Pagos" onClick={() => navigate('PaymentsScreen')} />
          <NavButton icon="person" label="Perfil" onClick={() => navigate('UserProfile')} />
        </nav>

      </main>

      <NotificationDrawer 
        isOpen={isNotificationDrawerOpen} 
        onClose={() => setIsNotificationDrawerOpen(false)} 
      />
    </div>
  );
};

const ServiceCard = ({ icon, label, value, desc, color, onClick }: any) => (
  <Card 
    onClick={onClick}
    className="p-6 bg-[#121212] border-gray-800 flex flex-col justify-between h-40 relative overflow-hidden group hover:border-[#00AEEF] transition-colors cursor-pointer"
  >
    <div className="flex justify-between items-start relative z-10">
      <div className={`w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center ${color} border-2 border-gray-800`}>
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <span className="text-2xl font-black">{value}</span>
    </div>
    <div className="relative z-10">
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xs font-bold text-white">{desc}</p>
    </div>
    <span className={`material-symbols-outlined absolute -right-4 -bottom-4 text-[100px] opacity-5 ${color} group-hover:scale-110 transition-transform duration-500`}>
      {icon}
    </span>
  </Card>
);

const SidebarButton = ({ icon, label, active = false, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${active ? 'bg-[#00AEEF] text-white shadow-lg shadow-[#00AEEF]/20' : 'text-gray-500 hover:bg-gray-800 hover:text-white'}`}
  >
    <span className={`material-symbols-outlined text-2xl ${active ? 'fill-current' : ''}`}>{icon}</span>
    <span className="text-lg font-bold">{label}</span>
  </button>
);

const NavButton = ({ icon, label, active = false, onClick }: { icon: string, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 active:scale-90 transition-all ${active ? 'text-[#00AEEF]' : 'text-gray-500 hover:text-white'}`}>
    <span className={`material-symbols-outlined text-2xl ${active ? 'fill-current' : ''}`}>{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
  </button>
);

export default ResidentServices;