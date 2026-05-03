import React, { useState, useRef } from 'react';
import { ScreenName } from '../App';
import { Logo } from '../components/Logo';
import { UserRole } from '../src/types';
import { supabase } from '../src/lib/supabase-client';
import { useAppContext } from '../src/context/AppContext';

interface Props {
  navigate: (screen: ScreenName) => void;
  from?: ScreenName | null;
  role?: UserRole;
}

const Emergency: React.FC<Props> = ({ navigate, from, role }) => {
  const { currentTenant, currentUser } = useAppContext();
  const [isPressing, setIsPressing] = useState(false);
  const pressTimeout = useRef<number | null>(null);

  const handleBack = () => {
    if (from) {
      navigate(from);
    } else {
      if (role === 'admin') navigate('AdminDashboard');
      else if (role === 'concierge') navigate('ConciergeDashboard');
      else navigate('ResidentServices');
    }
  };

  const triggerSOS = async () => {
    if (!currentTenant || !currentUser) return;
    try {
       // Find user's primary unit
       const { data: units } = await supabase
         .from('units')
         .select('id, unit_number')
         .eq('tenant_id', currentTenant.id)
         .eq('owner_id', currentUser.id)
         .limit(1);
         
       if (!units || units.length === 0) {
         alert("No tienes unidad registrada.");
         return;
       }

       const { error } = await supabase.from('panic_alerts').insert({
         tenant_id: currentTenant.id,
         unit_id: units[0].id,
         user_id: currentUser.id,
         status: 'Activo'
       });

       if (error) throw error;
       
       await supabase.from('audit_logs').insert({
          tenant_id: currentTenant.id,
          user_id: currentUser.id,
          action: 'Activación de SOS (Residente)',
          details: `SOS activado desde Depto ${units[0].unit_number}`,
          module: 'emergency',
          severity: 'critical'
       });

       // Trigger email via API
       await fetch((import.meta as any).env.VITE_BASE_URL + '/api/notify/sos', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           unitId: units[0].id,
           tenantId: currentTenant.id,
           unitNumber: units[0].unit_number,
           tenantName: currentTenant.name,
           activatedAt: new Date().toLocaleString()
         })
       }).catch(console.error);

       alert("ALERTA ENVIADA: Conserjería notificada de inmediato.");

    } catch (err: any) {
      console.error(err);
      alert("Error enviando alerta. Use el intercomunicador.");
    }
  };

  const handlePointerDown = () => {
    setIsPressing(true);
    pressTimeout.current = window.setTimeout(() => {
      triggerSOS();
      setIsPressing(false);
    }, 3000);
  };

  const handlePointerUp = () => {
    setIsPressing(false);
    if (pressTimeout.current) clearTimeout(pressTimeout.current);
  };

  const emergencyContacts = [
    { name: 'Ambulancia (SAMU)', number: '131', icon: 'medical_services', color: 'bg-red-500' },
    { name: 'Bomberos', number: '132', icon: 'fire_truck', color: 'bg-orange-500' },
    { name: 'Carabineros', number: '133', icon: 'local_police', color: 'bg-blue-600' },
    { name: 'PDI', number: '134', icon: 'shield', color: 'bg-blue-800' },
    { name: 'Seguridad Ciudadana', number: '1401', icon: 'support_agent', color: 'bg-[#1F1F1F]' },
  ];

  const protocols = [
    {
      title: 'Incendio',
      icon: 'local_fire_department',
      steps: [
        'Mantenga la calma y de aviso inmediato a conserjería.',
        'Evacue por escaleras de emergencia, nunca use el ascensor.',
        'Si hay humo, desplácese agachado o gateando.',
      ]
    },
    {
      title: 'Emergencia Médica',
      icon: 'emergency',
      steps: [
        'Llame al 131 e informe ubicación y síntomas.',
        'No mueva a la persona a menos que sea estrictamente necesario.',
        'Avise a conserjería para abrir portones a la ambulancia.',
      ]
    },
    {
      title: 'Sismo / Terremoto',
      icon: 'Tsunami',
      steps: [
        'Aléjese de ventanas u objetos que puedan caer.',
        'Ubíquese en una zona de seguridad estructural.',
        'No intente evacuar durante el movimiento.',
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#0A0A0A] font-sans selection:bg-red-500/30">
      
      {/* Immersive Header */}
      <header className="sticky top-0 z-30 bg-[#0A0A0A]/80 backdrop-blur-3xl border-b border-red-500/10 px-6 py-4 transition-all">
        <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <button 
              onClick={handleBack} 
              className="w-12 h-12 rounded-2xl bg-[#111] flex items-center justify-center text-white hover:bg-[#1A1A1A] active:scale-95 transition-all border border-white/5 hover:border-red-500/30"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white mb-1">
                Centro Clínico y <span className="font-semibold text-red-500">Crisis</span>.
              </h1>
              <p className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Red de contactos vitales
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex w-14 h-14 rounded-2xl bg-red-500/10 items-center justify-center border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <span className="material-symbols-outlined text-[28px] text-red-500 animate-pulse">emergency</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:px-12 md:py-10 max-w-7xl mx-auto w-full space-y-12 pb-32">
        
        {/* Hardware-Grade Panic Button Section */}
        <section className="relative group max-w-3xl mx-auto w-full">
          {/* Epic Ambient Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-red-600/40 to-orange-500/40 rounded-[3rem] blur-[80px] opacity-40 group-hover:opacity-70 transition duration-1000 group-hover:duration-500 pointer-events-none"></div>
          
          <div className="relative bg-[#111] border border-red-500/20 rounded-[2.5rem] p-10 md:p-14 text-center overflow-hidden shadow-2xl hover:border-red-500/40 transition-colors">
            
            {/* Glossy top highlight */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-30"></div>
            
            <div className="flex flex-col items-center">
              
              <div className="relative mb-8 text-center flex flex-col items-center">
                 {/* Ripple effect rings */}
                 <div className="absolute inset-0 rounded-full border border-red-500/30 animate-ping opacity-50 duration-1000 w-32 h-32 md:w-40 md:h-40 mx-auto"></div>
                 
                 <button 
                   onPointerDown={handlePointerDown}
                   onPointerUp={handlePointerUp}
                   onPointerLeave={handlePointerUp}
                   className={`w-32 h-32 md:w-40 md:h-40 bg-gradient-to-b from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(220,38,38,0.6),inset_0_4px_10px_rgba(255,255,255,0.3)] transition-all cursor-pointer ring-8 ring-[#1A1A1A] z-10 relative ${isPressing ? 'scale-[0.85] shadow-none brightness-110 ring-red-500/50' : 'active:scale-[0.95]'}`}
                 >
                   <span className="material-symbols-outlined text-white text-[48px] md:text-[64px] font-bold">notifications_active</span>
                 </button>
              </div>
              
              <h3 className="text-3xl md:text-5xl font-light text-white tracking-tight mb-3">
                 S.O.S <span className="font-bold">Residencial</span>
              </h3>
              <p className="text-red-400/80 text-xs md:text-sm font-medium uppercase tracking-widest max-w-sm mx-auto leading-relaxed border border-red-500/20 bg-red-500/5 px-4 py-2 rounded-xl">
                Mantenga presionado 3 seg. para alertar a conserjería.
              </p>
            </div>
          </div>
        </section>

        {/* Action Grid (Bento) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
          
          {/* Quick Call Column (Bento Cards) - span 7 */}
          <section className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex items-center gap-4 pl-2">
              <span className="material-symbols-outlined text-gray-500 text-[24px]">contact_phone</span>
              <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.2em]">Contactos de Emergencia</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emergencyContacts.map((contact, index) => (
                <a 
                  key={index}
                  href={`tel:${contact.number}`}
                  className="flex items-center justify-between p-5 bg-[#111] rounded-[1.5rem] border border-white/5 hover:border-white/20 hover:bg-[#141414] transition-all active:scale-[0.98] group relative overflow-hidden shadow-lg hover:shadow-xl"
                >
                  {/* Hover gradient subtle background */}
                  <div className={`absolute right-0 top-0 w-32 h-32 blur-[50px] opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none ${contact.color}`}></div>
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-12 h-12 ${contact.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}>
                      <span className="material-symbols-outlined text-[24px]">{contact.icon}</span>
                    </div>
                    <div className="flex flex-col">
                      <h4 className="font-semibold text-white tracking-tight text-sm md:text-base leading-none mb-1.5">{contact.name}</h4>
                      <p className="text-[10px] text-gray-500 font-mono font-bold tracking-widest">{contact.number}</p>
                    </div>
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-[#0A0A0A] border border-white/5 flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:text-black transition-colors relative z-10">
                    <span className="material-symbols-outlined text-[18px]">call</span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Protocols Column - span 5 */}
          <section className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex items-center gap-4 pl-2">
              <span className="material-symbols-outlined text-gray-500 text-[24px]">menu_book</span>
              <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.2em]">Manual de Actuación</h2>
            </div>
            
            <div className="flex flex-col gap-4">
              {protocols.map((protocol, idx) => (
                <div key={idx} className="bg-[#111] rounded-[1.5rem] border border-white/5 overflow-hidden group hover:border-white/10 transition-all flex flex-col hover:bg-[#141414] shadow-lg">
                  
                  <div className="px-6 py-4 flex items-center gap-4 border-b border-white/5 relative">
                    {/* Subtle underline glow on hover */}
                    <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-red-500/50 group-hover:w-full transition-all duration-500 ease-out"></div>
                    <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-white/5 flex items-center justify-center text-gray-400 group-hover:text-red-400 group-hover:border-red-400/30 transition-colors shadow-inner">
                      <span className="material-symbols-outlined text-[20px]">{protocol.icon}</span>
                    </div>
                    <h4 className="font-semibold text-white tracking-tight text-sm uppercase">{protocol.title}</h4>
                  </div>
                  
                  <div className="px-6 py-5 flex flex-col gap-4">
                    {protocol.steps.map((step, sIdx) => (
                      <div key={sIdx} className="flex gap-4 items-start group/step cursor-default">
                        <span className="w-6 h-6 rounded-md bg-[#0A0A0A] text-gray-400 group-hover/step:text-white flex-shrink-0 flex items-center justify-center text-[10px] font-bold border border-white/10 mt-0.5 shadow-sm transition-colors group-hover/step:border-white/30">
                          {sIdx + 1}
                        </span>
                        <p className="text-xs md:text-[13px] text-gray-400 font-medium leading-relaxed group-hover/step:text-gray-300 transition-colors">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

      </main>
    </div>
  );
};

export default Emergency;
