import React, { useState, useEffect } from 'react';
import { ScreenName } from '../App';

interface Props {
  navigate: (screen: ScreenName) => void;
}

const NotificationSettings: React.FC<Props> = ({ navigate }) => {
  const [settings, setSettings] = useState({
    packages: true,
    visits: true,
    community: false,
    requests: true,
    sound: true,
    vibration: false,
    email: true,
    push: true
  });

  const [showTestNotification, setShowTestNotification] = useState(false);

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const triggerTest = () => {
    setShowTestNotification(true);
    setTimeout(() => setShowTestNotification(false), 4000);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#101c22] relative">
      
      {/* Test Notification Popup */}
      <div className={`fixed top-4 left-4 right-4 z-50 transform transition-all duration-500 ${showTestNotification ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
        <div className="bg-[#1c262c]/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-ediflow-primary/20 flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-ediflow-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-black">notifications_active</span>
            </div>
            <div>
                <h4 className="font-bold text-white text-sm">Nueva Encomienda</h4>
                <p className="text-xs text-gray-300">Ha llegado un paquete de Chilexpress para Depto 402.</p>
            </div>
        </div>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#101c22]/95 backdrop-blur-sm px-5 py-4 flex items-center border-b border-white/5">
        <button 
          onClick={() => navigate('ResidentServices')}
          className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-all active:scale-90 mr-3"
        >
          <span className="material-symbols-outlined text-white">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold text-white">Notificaciones</h1>
      </div>

      <div className="p-5 pb-24 space-y-8">
        
        {/* Main Toggles */}
        <section>
            <h2 className="text-xs font-bold text-gray-500 uppercase mb-4 ml-1 tracking-wider">Eventos Importantes</h2>
            <div className="bg-[#1c262c] rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
                <ToggleItem 
                    icon="package_2" 
                    iconColor="text-blue-400" 
                    label="Encomiendas" 
                    description="Recibe alertas cuando llegue un paquete."
                    active={settings.packages}
                    onToggle={() => toggle('packages')}
                />
                <ToggleItem 
                    icon="person_check" 
                    iconColor="text-purple-400" 
                    label="Visitas" 
                    description="Avisos de llegada de visitas o delivery."
                    active={settings.visits}
                    onToggle={() => toggle('visits')}
                />
                 <ToggleItem 
                    icon="campaign" 
                    iconColor="text-amber-400" 
                    label="Avisos Comunidad" 
                    description="Noticias, cortes y mantenimientos."
                    active={settings.community}
                    onToggle={() => toggle('community')}
                />
                 <ToggleItem 
                    icon="assignment" 
                    iconColor="text-emerald-400" 
                    label="Solicitudes" 
                    description="Actualizaciones de tus reclamos o reservas."
                    active={settings.requests}
                    onToggle={() => toggle('requests')}
                />
            </div>
        </section>

        {/* Channels */}
        <section>
             <h2 className="text-xs font-bold text-gray-500 uppercase mb-4 ml-1 tracking-wider">Canales de Envío</h2>
             <div className="bg-[#1c262c] rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
                <ToggleItem 
                    icon="smartphone" 
                    label="Notificaciones Push" 
                    description="Envia alertas a tu dispositivo móvil."
                    active={settings.push}
                    onToggle={() => toggle('push')}
                />
                <ToggleItem 
                    icon="mail" 
                    label="Correo Electrónico" 
                    description="Resumen diario de actividad."
                    active={settings.email}
                    onToggle={() => toggle('email')}
                />
             </div>
        </section>

         {/* Preferences */}
         <section>
             <h2 className="text-xs font-bold text-gray-500 uppercase mb-4 ml-1 tracking-wider">Preferencias</h2>
             <div className="flex gap-3">
                <button 
                    onClick={() => toggle('sound')}
                    className={`flex-1 p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${settings.sound ? 'bg-ediflow-primary/10 border-ediflow-primary text-ediflow-primary' : 'bg-[#1c262c] border-transparent text-gray-500'}`}
                >
                    <span className="material-symbols-outlined text-2xl">{settings.sound ? 'volume_up' : 'volume_off'}</span>
                    <span className="text-xs font-bold">Sonido</span>
                </button>
                <button 
                    onClick={() => toggle('vibration')}
                    className={`flex-1 p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${settings.vibration ? 'bg-ediflow-primary/10 border-ediflow-primary text-ediflow-primary' : 'bg-[#1c262c] border-transparent text-gray-500'}`}
                >
                    <span className="material-symbols-outlined text-2xl">{settings.vibration ? 'vibration' : 'smartphone'}</span>
                    <span className="text-xs font-bold">Vibración</span>
                </button>
             </div>
        </section>

        {/* Test Action */}
        <button 
            onClick={triggerTest}
            className="w-full py-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
            <span className="material-symbols-outlined">send_to_mobile</span>
            Simular Notificación de Prueba
        </button>

      </div>
    </div>
  );
};

const ToggleItem = ({ icon, iconColor = "text-gray-400", label, description, active, onToggle }: any) => (
    <div className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full bg-[#101c22] border border-white/5 flex items-center justify-center ${iconColor}`}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-bold text-white">{label}</span>
                <span className="text-[11px] text-gray-500">{description}</span>
            </div>
        </div>
        
        {/* Custom Switch */}
        <button 
            onClick={onToggle}
            className={`w-12 h-7 rounded-full relative transition-colors duration-300 active:scale-105 ${active ? 'bg-ediflow-primary' : 'bg-gray-700'}`}
        >
            <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${active ? 'translate-x-5' : 'translate-x-0'}`}></div>
        </button>
    </div>
);

export default NotificationSettings;