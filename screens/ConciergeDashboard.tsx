import React, { useState } from 'react';
import { ScreenName } from '../App';
import { useAppContext } from '../src/context/AppContext';
import { useVoiceAssistant } from '../src/hooks/useVoiceAssistant';
import { Button } from '../src/components/ui/Button';
import { Input } from '../src/components/ui/Input';
import { Card } from '../src/components/ui/Card';
import { LogEntry } from '../src/types';
import { NotificationDrawer } from '../src/components/notifications/NotificationDrawer';
import { Logo } from '../components/Logo';

interface Props {
  navigate: (screen: ScreenName) => void;
  onLogout?: () => void;
}

type OperationType = 'encomienda' | 'visita' | 'novedad' | 'pago' | null;

const ConciergeDashboard: React.FC<Props> = ({ navigate, onLogout }) => {
  const { currentUser, currentTenant } = useAppContext();
  const [toast, setToast] = useState<string | null>(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  
  // Unified Manual Entry State
  const [activeOperation, setActiveOperation] = useState<OperationType>(null);
  const [manualInput, setManualInput] = useState('');
  const [deptoInput, setDeptoInput] = useState('');

  // Dynamic Logs State
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', icon: 'package_2', color: 'text-blue-400', title: 'Encomienda entregada', time: '10:45', desc: 'Recibido por Depto 402', tenantId: 'tenant-1' },
    { id: '2', icon: 'person_check', color: 'text-purple-400', title: 'Visita ingresada', time: '10:30', desc: 'Para Depto 1105 (Juanito S.)', tenantId: 'tenant-1' },
    { id: '3', icon: 'warning', color: 'text-amber-400', title: 'Novedad registrada', time: '09:15', desc: 'Falla en luminaria pasillo 3', tenantId: 'tenant-1' }
  ]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const addLog = (icon: string, color: string, title: string, desc: string) => {
      const newLog: LogEntry = {
          id: Date.now().toString(),
          icon,
          color,
          title,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          desc,
          tenantId: currentTenant?.id || ''
      };
      setLogs(prev => [newLog, ...prev]);
  };

  const handleCommandMatch = (operation: OperationType, details: any) => {
    if (operation === 'encomienda') {
        if (details.deptos.length > 0) {
            addLog('package_2', 'text-blue-400', `${details.deptos.length} Encomienda(s) (Voz)`, `Deptos: ${details.deptos.join(', ')}`);
            showToast(`📦 Registradas encomiendas para: ${details.deptos.join(', ')}`);
        } else {
            showToast('❌ Comando de encomienda detectado, pero no escuché el número de departamento.');
        }
    } else if (operation === 'visita') {
        addLog('person_check', 'text-purple-400', 'Visita (Voz)', `${details.name || 'Persona'} al Depto ${details.depto}`);
        showToast(`👤 Visita registrada: ${details.name || 'Persona'} al ${details.depto}`);
    } else if (operation === 'pago') {
        addLog('payments', 'text-green-400', 'Pago GC (Voz)', `Depto ${details.depto} pagó en conserjería`);
        showToast(`💵 Pago registrado para Depto ${details.depto}`);
    } else if (operation === 'novedad') {
        addLog('warning', 'text-orange-400', 'Novedad (Voz)', details.desc || 'Sin descripción');
        showToast(`⚠️ Novedad registrada en bitácora.`);
    } else {
        showToast('❌ Comando no reconocido. Inicia con: "Encomienda", "Visita", "Pago" o "Novedad".');
    }
  };

  const { isListening, transcript, startListening, stopListening, simulateCommand, error } = useVoiceAssistant(handleCommandMatch);

  const handleVoiceRecord = () => {
    if (error) {
        showToast(`❌ ${error}`);
        return;
    }
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput) return;
    
    if (activeOperation === 'encomienda') {
        addLog('package_2', 'text-blue-400', 'Encomienda Manual', `Depto ${deptoInput} - ${manualInput}`);
        showToast(`📦 Encomienda registrada para Depto ${deptoInput}`);
    }
    if (activeOperation === 'visita') {
        addLog('person_check', 'text-purple-400', 'Visita Manual', `${manualInput} al Depto ${deptoInput}`);
        showToast(`👤 Visita registrada para Depto ${deptoInput}`);
    }
    if (activeOperation === 'pago') {
        addLog('payments', 'text-green-400', 'Pago GC Manual', `Depto ${deptoInput} - ${manualInput}`);
        showToast(`💵 Pago registrado para Depto ${deptoInput}`);
    }
    if (activeOperation === 'novedad') {
        addLog('warning', 'text-orange-400', 'Novedad Manual', manualInput);
        showToast(`⚠️ Novedad registrada en bitácora`);
    }
    
    setActiveOperation(null);
    setManualInput('');
    setDeptoInput('');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#000000] text-white">
      
      {/* Toast Notification */}
      {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-white text-black px-8 py-4 rounded-2xl shadow-2xl font-black text-lg flex items-center gap-4 animate-bounce">
              <span className="material-symbols-outlined text-3xl text-[#00AEEF]">info</span>
              <p className="leading-tight">{toast}</p>
          </div>
      )}

      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex flex-col w-72 bg-[#121212] border-r-2 border-gray-800 p-8 sticky top-0 h-screen">
        <Logo variant="horizontal" className="mb-12" />
        
        <nav className="flex-1 space-y-4">
          <SidebarButton icon="dashboard" label="Resumen" active />
          <SidebarButton icon="contacts" label="Directorio" onClick={() => navigate('ResidentDirectory')} />
          <SidebarButton icon="history" label="Bitácora" onClick={() => navigate('HistoryScreen')} />
          <SidebarButton icon="chat" label="Mensajería" onClick={() => navigate('MessagesScreen')} />
        </nav>

        <div className="mt-auto pt-8 border-t-2 border-gray-800">
          <div className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-2xl border-2 border-gray-800 mb-6">
            <img 
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
              alt="Profile" 
              className="w-12 h-12 rounded-full object-cover border-2 border-[#00AEEF]" 
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{currentUser?.name || 'Juan Pérez'}</p>
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Conserje</p>
            </div>
          </div>
          <button onClick={() => onLogout && onLogout()} className="flex items-center gap-4 text-gray-500 hover:text-red-500 transition-colors w-full p-4 rounded-2xl hover:bg-red-500/10">
            <span className="material-symbols-outlined text-2xl">logout</span>
            <span className="font-bold">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-full pb-24 md:pb-10">
        
        {/* Header */}
        <header className="px-6 md:px-10 pt-10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6 sticky top-0 z-20 bg-[#000000]/80 backdrop-blur-md border-b-2 border-gray-800 md:border-none">
          <div className="md:hidden flex justify-between items-center w-full">
            <Logo variant="horizontal" className="scale-90 origin-left" />
            <div className="flex items-center gap-4">
              <button onClick={() => setIsNotificationDrawerOpen(true)} className="w-12 h-12 rounded-full bg-[#121212] flex items-center justify-center border-2 border-gray-800 relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-3 right-3 w-2 h-2 bg-[#00AEEF] rounded-full"></span>
              </button>
              <button onClick={() => onLogout && onLogout()} className="w-12 h-12 rounded-full bg-[#121212] flex items-center justify-center border-2 border-gray-800">
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          </div>
          
          <div className="hidden md:block flex-1 max-w-2xl">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00AEEF] transition-colors">search</span>
              <input 
                type="text"
                placeholder="Buscar residente, departamento o patente..."
                onClick={() => navigate('ResidentDirectory')}
                className="w-full h-14 pl-16 pr-6 rounded-full bg-[#121212] border-2 border-gray-800 focus:border-[#00AEEF] outline-none font-bold text-lg transition-all cursor-pointer"
                readOnly
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 bg-[#121212] border-2 border-gray-800 rounded-full px-6 py-3">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-bold uppercase tracking-widest">Turno Activo</span>
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
          
          {/* Status Monitor Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatusMonitorCard label="Paquetes" value="12" icon="package_2" color="text-blue-500" />
            <StatusMonitorCard label="Visitas Hoy" value="24" icon="group" color="text-purple-500" />
            <StatusMonitorCard label="Novedades" value="3" icon="warning" color="text-amber-500" />
            <StatusMonitorCard label="Mensajes" value="5" icon="chat" color="text-[#00AEEF]" />
          </div>

          {/* Core Action Hub */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Voice & Main Actions */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ActionCard 
                  icon="package_2" 
                  title="Ingresar Paquete" 
                  desc="Registra encomiendas de MercadoLibre, Amazon, etc."
                  onClick={() => navigate('PackageEntry')}
                  color="bg-blue-500/10 text-blue-500 border-blue-500/20"
                />
                <ActionCard 
                  icon="person_add" 
                  title="Control de Visitas" 
                  desc="Registra ingresos de visitas y delivery."
                  onClick={() => navigate('ManualVisitorRegistration')}
                  color="bg-purple-500/10 text-purple-500 border-purple-500/20"
                />
                <ActionCard 
                  icon="warning" 
                  title="Registrar Novedad" 
                  desc="Reporta fallas, ruidos o eventos en bitácora."
                  onClick={() => setActiveOperation('novedad')}
                  color="bg-amber-500/10 text-amber-500 border-amber-500/20"
                />
                <ActionCard 
                  icon="payments" 
                  title="Recibir Pago" 
                  desc="Registra pagos de gastos comunes en efectivo/POS."
                  onClick={() => navigate('RegisterPayment')}
                  color="bg-green-500/10 text-green-500 border-green-500/20"
                />
              </div>

              {/* Inline Form for Manual Entry */}
              {activeOperation && (
                  <Card className="p-8 bg-[#121212] border-[#00AEEF] border-2 animate-fade-in">
                      <div className="flex justify-between items-center mb-8">
                          <h3 className="text-white font-black text-2xl flex items-center gap-3">
                              <span className="material-symbols-outlined text-[#00AEEF]">
                                {activeOperation === 'encomienda' ? 'package_2' : activeOperation === 'visita' ? 'person_add' : 'warning'}
                              </span>
                              {activeOperation === 'encomienda' && 'Registrar Encomienda'}
                              {activeOperation === 'visita' && 'Registrar Visita'}
                              {activeOperation === 'novedad' && 'Reportar Novedad'}
                          </h3>
                          <button type="button" onClick={() => setActiveOperation(null)} className="text-gray-500 hover:text-white bg-gray-900 p-3 rounded-full transition-colors">
                              <span className="material-symbols-outlined text-xl">close</span>
                          </button>
                      </div>
                      
                      <form onSubmit={handleManualSubmit} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {activeOperation !== 'novedad' && (
                                  <Input 
                                      label="Nº Departamento"
                                      placeholder="Ej. 402" 
                                      value={deptoInput}
                                      onChange={(e) => setDeptoInput(e.target.value)}
                                      required
                                      className="bg-black border-gray-800"
                                  />
                              )}
                              <Input 
                                  label={
                                      activeOperation === 'encomienda' ? 'Empresa / Detalle' : 
                                      activeOperation === 'visita' ? 'Nombre del Visitante' : 
                                      'Descripción de la Novedad'
                                  }
                                  placeholder={
                                      activeOperation === 'encomienda' ? 'Ej. MercadoLibre' : 
                                      activeOperation === 'visita' ? 'Ej. Juan Pérez' : 
                                      'Detalle lo ocurrido...'
                                  }
                                  value={manualInput}
                                  onChange={(e) => setManualInput(e.target.value)}
                                  required
                                  className={`bg-black border-gray-800 ${activeOperation === 'novedad' ? 'md:col-span-2' : ''}`}
                              />
                          </div>
                          <div className="mt-8 flex justify-end">
                            <Button type="submit" className="bg-[#00AEEF] hover:bg-[#0090C5] text-white border-none px-12 h-14 text-lg">
                                Guardar Registro
                            </Button>
                          </div>
                      </form>
                  </Card>
              )}
            </div>

            {/* Voice Assistant Widget */}
            <div className="space-y-8">
              <Card className="p-8 bg-gradient-to-br from-[#121212] to-[#000000] border-gray-800 text-center flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
                <div className="relative z-10 w-full">
                  <h3 className="text-2xl font-black mb-2">Asistente de Voz</h3>
                  <p className="text-gray-500 font-medium mb-8">Diga el comando y el departamento</p>
                  
                  <button 
                    onClick={handleVoiceRecord}
                    className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 relative ${
                      isListening ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-[#00AEEF] shadow-[0_0_30px_rgba(0,174,239,0.3)] hover:scale-105'
                    }`}
                  >
                    {isListening && (
                      <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20"></span>
                    )}
                    <span className="material-symbols-outlined text-6xl text-white">
                      {isListening ? 'mic_off' : 'mic'}
                    </span>
                  </button>

                  <div className="mt-10 h-16 flex items-center justify-center">
                    {isListening ? (
                      <div className="flex flex-col items-center">
                        <div className="flex gap-1 mb-2">
                          {[1,2,3,4,5].map(i => (
                            <div key={i} className="w-1 bg-[#00AEEF] rounded-full animate-pulse" style={{ height: `${Math.random() * 20 + 10}px`, animationDelay: `${i * 0.1}s` }}></div>
                          ))}
                        </div>
                        <p className="text-lg font-bold italic text-white">"{transcript || 'Escuchando...'}"</p>
                      </div>
                    ) : (
                      <p className="text-gray-500 font-bold">Toque para hablar</p>
                    )}
                  </div>
                </div>
                
                {/* Decorative background element */}
                <span className="material-symbols-outlined absolute -right-10 -bottom-10 text-[200px] text-white/5 rotate-12">
                  graphic_eq
                </span>
              </Card>

              {/* Emergency Quick Contact */}
              <Card className="p-6 bg-red-500/10 border-red-500/30 flex items-center justify-between group cursor-pointer hover:bg-red-500/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center text-white">
                    <span className="material-symbols-outlined">emergency</span>
                  </div>
                  <div>
                    <h4 className="font-black text-red-500 uppercase tracking-widest text-xs">Emergencia</h4>
                    <p className="font-bold text-white">Llamar a Seguridad</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-red-500 group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </Card>
            </div>

          </div>

          {/* Recent Activity Feed */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black flex items-center gap-3">
                <span className="material-symbols-outlined text-[#00AEEF]">history</span>
                Últimos Movimientos
              </h2>
              <button onClick={() => navigate('HistoryScreen')} className="text-sm font-black text-[#00AEEF] uppercase tracking-widest hover:underline flex items-center gap-2">
                Ver Bitácora <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {logs.map((log) => (
                <ActivityItem 
                  key={log.id}
                  icon={log.icon}
                  title={log.title}
                  desc={log.desc}
                  time={log.time}
                  color={log.color.replace('text-', 'bg-').replace('400', '500/10') + ' ' + log.color}
                />
              ))}
            </div>
          </section>

        </div>

        {/* Mobile Nav */}
        <nav className="md:hidden fixed bottom-0 w-full bg-[#121212] border-t-2 border-gray-800 pb-8 pt-4 px-6 flex justify-between items-center z-30">
          <NavButton icon="dashboard" label="Panel" active />
          <NavButton icon="contacts" label="Directorio" onClick={() => navigate('ResidentDirectory')} />
          <NavButton icon="history" label="Bitácora" onClick={() => navigate('HistoryScreen')} />
          <NavButton icon="chat" label="Mensajes" onClick={() => navigate('MessagesScreen')} />
        </nav>

      </main>

      <NotificationDrawer 
        isOpen={isNotificationDrawerOpen} 
        onClose={() => setIsNotificationDrawerOpen(false)} 
      />
    </div>
  );
};

const StatusMonitorCard = ({ label, value, icon, color }: any) => (
  <Card className="p-6 bg-[#121212] border-gray-800 flex flex-col justify-between h-32 relative overflow-hidden group hover:border-[#00AEEF] transition-colors">
    <div className="flex justify-between items-start relative z-10">
      <span className={`material-symbols-outlined text-2xl ${color}`}>{icon}</span>
      <span className="text-2xl font-black">{value}</span>
    </div>
    <div className="relative z-10">
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</p>
    </div>
  </Card>
);

const ActionCard = ({ icon, title, desc, onClick, color }: any) => (
  <Card 
    onClick={onClick}
    className={`p-6 flex flex-col items-start gap-4 cursor-pointer transition-all active:scale-[0.98] hover:brightness-125 group relative overflow-hidden ${color}`}
  >
    <div className="bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
      <span className="material-symbols-outlined text-3xl">{icon}</span>
    </div>
    <div>
      <h3 className="text-xl font-black mb-1">{title}</h3>
      <p className="text-sm opacity-70 font-medium leading-tight">{desc}</p>
    </div>
    <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[80px] opacity-5 group-hover:scale-110 transition-transform duration-500">
      {icon}
    </span>
  </Card>
);

const ActivityItem = ({ icon, title, desc, time, color }: any) => (
  <div className="flex items-center gap-4 p-4 bg-[#121212] rounded-2xl border-2 border-gray-800 group cursor-pointer hover:border-gray-600 transition-colors">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 border-transparent group-hover:border-current transition-colors ${color}`}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-bold truncate">{title}</h4>
      <p className="text-xs text-gray-500 truncate">{desc}</p>
    </div>
    <span className="text-[10px] font-black text-gray-600 uppercase whitespace-nowrap">{time}</span>
  </div>
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

export default ConciergeDashboard;
