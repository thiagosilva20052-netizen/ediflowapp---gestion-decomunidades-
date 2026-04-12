import React, { useState } from 'react';
import { ScreenName } from '../App';
import { UserRole } from '../src/types';
import { EmailTemplatePreview } from '../src/components/notifications/EmailTemplatePreview';
import { PushSubscriptionModal } from '../src/components/notifications/PushSubscriptionModal';
import { Button } from '../src/components/ui/Button';

interface Props {
  navigate: (screen: ScreenName) => void;
  role: UserRole;
}

const NotificationSettings: React.FC<Props> = ({ navigate, role }) => {
  const [settings, setSettings] = useState({
    packages: true,
    visits: true,
    community: false,
    requests: true,
    sound: true,
    vibration: false,
    email: true,
    push: false
  });

  const [showPushModal, setShowPushModal] = useState(false);

  const toggle = (key: keyof typeof settings) => {
    if (key === 'push' && !settings.push) {
      setShowPushModal(true);
    } else {
      setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleAcceptPush = () => {
    setSettings(prev => ({ ...prev, push: true }));
    setShowPushModal(false);
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-100 dark:bg-[#000000] relative items-center">
      <div className="w-full max-w-4xl flex flex-col h-full">
        {/* Header */}
        <header className="px-6 pt-10 pb-4 flex items-center gap-4 bg-gray-100 dark:bg-[#000000] sticky top-0 z-20 border-b-2 border-gray-200 dark:border-gray-800">
          <button 
            onClick={() => {
              if (role === 'admin') navigate('AdminDashboard');
              else if (role === 'concierge') navigate('ConciergeDashboard');
              else navigate('ResidentServices');
            }}
            className="w-12 h-12 rounded-full bg-white dark:bg-[#121212] flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#1A1A1A] active:scale-90 transition-all border-2 border-gray-200 dark:border-gray-800"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Ajustes de Notificaciones</h1>
        </header>

        <div className="p-6 md:p-10 flex-1 overflow-y-auto no-scrollbar pb-32 space-y-12">
          
          {/* Main Toggles */}
          <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">¿De qué quiere que le avisemos?</h2>
              <div className="bg-white dark:bg-[#121212] rounded-3xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden divide-y-2 divide-gray-200 dark:divide-gray-800">
                  <ToggleItem 
                      icon="package_2" 
                      label="Encomiendas" 
                      description="Avisos cuando llegue un paquete."
                      active={settings.packages}
                      onToggle={() => toggle('packages')}
                  />
                  <ToggleItem 
                      icon="person_check" 
                      label="Visitas" 
                      description="Avisos de llegada de visitas o delivery."
                      active={settings.visits}
                      onToggle={() => toggle('visits')}
                  />
                   <ToggleItem 
                      icon="campaign" 
                      label="Avisos de Comunidad" 
                      description="Noticias, cortes y mantenimientos."
                      active={settings.community}
                      onToggle={() => toggle('community')}
                  />
              </div>
          </section>

          {/* Channels */}
          <section>
               <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">¿Cómo quiere recibir los avisos?</h2>
               <div className="bg-white dark:bg-[#121212] rounded-3xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden divide-y-2 divide-gray-200 dark:divide-gray-800">
                  <ToggleItem 
                      icon="smartphone" 
                      label="Alertas en el Navegador (Push)" 
                      description="Mensajes directos a su pantalla."
                      active={settings.push}
                      onToggle={() => toggle('push')}
                  />
                  <ToggleItem 
                      icon="mail" 
                      label="Correo Electrónico" 
                      description="Resumen y alertas a su email."
                      active={settings.email}
                      onToggle={() => toggle('email')}
                  />
               </div>
          </section>

          {/* Email Preview Section */}
          {settings.email && (
            <section className="pt-8 border-t-2 border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Vista Previa de Correos</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Así es como se verán los correos electrónicos que le enviaremos:
              </p>
              <EmailTemplatePreview />
            </section>
          )}

        </div>
      </div>

      <PushSubscriptionModal 
        isOpen={showPushModal} 
        onClose={() => setShowPushModal(false)} 
        onAccept={handleAcceptPush} 
      />
    </div>
  );
};

const ToggleItem = ({ icon, label, description, active, onToggle }: any) => (
    <div className="p-6 md:p-8 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#1A1A1A] transition-colors cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-colors ${active ? 'bg-[#00AEEF]/10 border-[#00AEEF] text-[#00AEEF]' : 'bg-gray-100 dark:bg-[#1A1A1A] border-gray-200 dark:border-gray-800 text-gray-500'}`}>
                <span className="material-symbols-outlined text-3xl">{icon}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 dark:text-white">{label}</span>
                <span className="text-lg text-gray-600 dark:text-gray-400 mt-1">{description}</span>
            </div>
        </div>
        
        {/* Custom Switch */}
        <button 
            className={`w-16 h-10 rounded-full relative transition-colors duration-300 border-2 ${active ? 'bg-[#00AEEF] border-[#00AEEF]' : 'bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700'}`}
        >
            <div className={`absolute top-1 left-1 w-7 h-7 rounded-full bg-white shadow-md transform transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </button>
    </div>
);

export default NotificationSettings;