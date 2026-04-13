import React from 'react';
import { ScreenName } from '../App';
import { Logo } from '../components/Logo';
import { UserRole } from '../src/types';

interface Props {
  navigate: (screen: ScreenName) => void;
  from?: ScreenName | null;
  role?: UserRole;
}

const Emergency: React.FC<Props> = ({ navigate, from, role }) => {
  const handleBack = () => {
    if (from) {
      navigate(from);
    } else {
      if (role === 'admin') navigate('AdminDashboard');
      else if (role === 'concierge') navigate('ConciergeDashboard');
      else navigate('ResidentServices');
    }
  };

  const emergencyContacts = [
    { name: 'Ambulancia (SAMU)', number: '131', icon: 'medical_services', color: 'bg-red-500' },
    { name: 'Bomberos', number: '132', icon: 'fire_truck', color: 'bg-orange-500' },
    { name: 'Carabineros', number: '133', icon: 'local_police', color: 'bg-blue-600' },
    { name: 'PDI', number: '134', icon: 'shield', color: 'bg-blue-800' },
    { name: 'Seguridad Ciudadana', number: '1401', icon: 'support_agent', color: 'bg-slate-700' },
  ];

  const protocols = [
    {
      title: 'Incendio',
      icon: 'local_fire_department',
      steps: [
        'Mantenga la calma y de aviso inmediato a conserjería.',
        'Evacue por las escaleras de emergencia, nunca use el ascensor.',
        'Si hay presencia de humo, desplácese agachado o gateando.',
        'No regrese al edificio hasta que bomberos lo autorice formalmente.'
      ]
    },
    {
      title: 'Emergencia Médica',
      icon: 'emergency',
      steps: [
        'Llame al 131 e informe su ubicación exacta y síntomas.',
        'No mueva a la persona afectada a menos que sea estrictamente necesario.',
        'Avise a conserjería para facilitar el acceso de la ambulancia al recinto.',
        'Mantenga las vías de acceso y ascensores despejados.'
      ]
    },
    {
      title: 'Sismo / Terremoto',
      icon: 'Tsunami',
      steps: [
        'Aléjese de ventanas, espejos y objetos que puedan caer.',
        'Ubíquese en una zona de seguridad estructural (bajo vigas o marcos).',
        'No intente evacuar durante el movimiento sísmico.',
        'Corte suministros de gas y electricidad si es seguro hacerlo.'
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#0A0A0A]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-red-500/20 p-4">
        <div className="flex justify-between items-center max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBack} 
              className="w-10 h-10 rounded-full bg-[#141414] flex items-center justify-center text-white hover:bg-[#1F1F1F] active:scale-90 transition-all border border-white/5"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h1 className="text-lg font-black text-white uppercase tracking-tight">Centro de Emergencias</h1>
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em]">Protocolos y Contactos</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
            <span className="material-symbols-outlined text-red-500 animate-pulse">emergency</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full space-y-12 pb-32">
        
        {/* Panic Button Section */}
        <section className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-[40px] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-[#141414] border-2 border-red-500/20 rounded-[40px] p-10 text-center space-y-6 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>
            
            <div className="w-24 h-24 bg-red-600 rounded-full mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.5)] active:scale-95 transition-all cursor-pointer group/btn ring-8 ring-red-600/20">
              <span className="material-symbols-outlined text-white text-5xl group-hover/btn:scale-110 transition-transform">notifications_active</span>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Botón de Pánico Digital</h3>
              <p className="text-red-400/80 text-sm font-bold uppercase tracking-widest max-w-xs mx-auto leading-tight">
                Mantenga presionado 3 segundos para alertar a todo el personal
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Quick Call Column */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                <span className="material-symbols-outlined text-xl">call</span>
              </div>
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Llamada Rápida</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {emergencyContacts.map((contact, index) => (
                <a 
                  key={index}
                  href={`tel:${contact.number}`}
                  className="flex items-center justify-between p-5 bg-[#141414] rounded-2xl border-2 border-white/5 hover:border-red-500/30 hover:bg-[#1A1A1A] transition-all active:scale-[0.98] group"
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 ${contact.color} rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform`}>
                      <span className="material-symbols-outlined text-3xl">{contact.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-black text-white uppercase tracking-tight text-lg">{contact.name}</h4>
                      <p className="text-sm text-gray-500 font-mono font-bold">{contact.number}</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-red-500 group-hover:text-white transition-all">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Protocols Column */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                <span className="material-symbols-outlined text-xl">menu_book</span>
              </div>
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Protocolos de Actuación</h2>
            </div>
            
            <div className="space-y-4">
              {protocols.map((protocol, idx) => (
                <div key={idx} className="bg-[#141414] rounded-3xl border-2 border-white/5 overflow-hidden group hover:border-white/10 transition-all">
                  <div className="p-5 flex items-center gap-4 bg-white/[0.02] border-b border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                      <span className="material-symbols-outlined">{protocol.icon}</span>
                    </div>
                    <h4 className="font-black text-white uppercase tracking-widest text-sm">{protocol.title}</h4>
                  </div>
                  <div className="p-6 space-y-4">
                    {protocol.steps.map((step, sIdx) => (
                      <div key={sIdx} className="flex gap-4 items-start">
                        <span className="w-6 h-6 rounded-lg bg-red-500/10 text-red-500 flex-shrink-0 flex items-center justify-center text-[10px] font-black mt-0.5 border border-red-500/20">
                          {sIdx + 1}
                        </span>
                        <p className="text-sm text-gray-400 font-bold leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

      </main>

      {/* Footer Info */}
      <footer className="p-10 text-center border-t border-white/5 bg-black/40">
        <Logo variant="full" className="h-6 opacity-30 mx-auto mb-4" />
        <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">
          Ediflow Emergency System v2.0 • 2024
        </p>
      </footer>
    </div>
  );
};

export default Emergency;

