import React, { useState } from 'react';
import { ScreenName } from '../App';
import { useAppContext } from '../src/context/AppContext';
import { useVoiceAssistant } from '../src/hooks/useVoiceAssistant';
import { Button } from '../src/components/ui/Button';
import { Input } from '../src/components/ui/Input';
import { Card } from '../src/components/ui/Card';
import { LogEntry } from '../src/types';
import { NotificationDrawer } from '../src/components/notifications/NotificationDrawer';

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
    { id: '2', icon: 'person_check', color: 'text-purple-400', title: 'Visita ingresada', time: '10:30', desc: 'Para Depto 1105 (Juanito S.)', tenantId: 'tenant-1' }
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

  const handleSimulateCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          simulateCommand(e.currentTarget.value);
          e.currentTarget.value = '';
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
    <div className="flex w-full h-full bg-gray-100 dark:bg-[#000000] relative">
      {/* Toast Notification */}
      {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-[#121212] border-2 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white px-6 py-4 rounded-2xl shadow-lg font-bold text-lg flex items-center gap-3">
              <span className="material-symbols-outlined text-3xl text-ediflow-light-accent dark:text-ediflow-dark-accent">info</span>
              <p className="leading-tight">{toast}</p>
          </div>
      )}

      {/* FIXED LEFT SIDEBAR */}
      <aside className="hidden md:flex w-[300px] flex-col border-r-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] p-8 z-20 h-full">
        <div className="mb-12">
          <h1 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">EDIFLOW</h1>
          <p className="text-sm text-gray-500 font-bold tracking-widest uppercase mt-1">{currentTenant?.name || 'Comunidad'}</p>
        </div>
        
        <div className="flex items-center gap-4 mb-12 p-4 bg-gray-100 dark:bg-[#1A1A1A] rounded-2xl">
            <img 
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
              alt="Profile" 
              className="w-14 h-14 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700" 
            />
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{currentUser?.name || 'Juan Pérez'}</h2>
              <p className="text-sm text-gray-500 font-medium">Conserje</p>
            </div>
        </div>

        <nav className="flex-1 space-y-4">
          <SidebarButton icon="dashboard" label="Panel Principal" active />
          <SidebarButton icon="contacts" label="Directorio" onClick={() => navigate('ResidentDirectory')} />
          <SidebarButton icon="history" label="Bitácora" onClick={() => navigate('HistoryScreen')} />
          <SidebarButton icon="chat" label="Mensajes" onClick={() => navigate('MessagesScreen')} />
          <SidebarButton icon="settings" label="Ajustes" onClick={() => navigate('NotificationSettings')} />
        </nav>
        <div className="mt-auto pt-8 border-t-2 border-gray-200 dark:border-gray-800">
          <button onClick={() => onLogout && onLogout()} className="flex items-center gap-4 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors w-full p-4 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20">
            <span className="material-symbols-outlined text-2xl">logout</span>
            <span className="font-bold text-lg">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* CENTER CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative pb-24 md:pb-0 no-scrollbar">
        {/* Header for Mobile only */}
        <header className="md:hidden px-6 pt-10 pb-4 flex justify-between items-center sticky top-0 z-20 bg-white dark:bg-[#121212] border-b-2 border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <img 
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
              alt="Profile" 
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-gray-500 text-xs font-bold tracking-wider uppercase mb-0.5">{currentTenant?.name || 'Turno Día'}</p>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{currentUser?.name || 'Juan Pérez'}</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsNotificationDrawerOpen(true)} className="relative text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined text-3xl">notifications</span>
              <span className="absolute top-0 right-0 w-3 h-3 bg-[#00AEEF] rounded-full border-2 border-white dark:border-[#121212]"></span>
            </button>
            <button onClick={() => onLogout && onLogout()} className="text-gray-500 hover:text-red-500 transition-colors">
              <span className="material-symbols-outlined text-3xl">logout</span>
            </button>
          </div>
        </header>

        <div className="p-6 md:p-10 w-full max-w-6xl mx-auto space-y-8">
          
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">Panel de Control</h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">Seleccione una acción para registrar.</p>
            </div>
            <button 
              onClick={() => setIsNotificationDrawerOpen(true)} 
              className="hidden md:flex relative w-14 h-14 rounded-2xl bg-white dark:bg-[#121212] border-2 border-gray-200 dark:border-gray-800 items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-3xl">notifications</span>
              <span className="absolute top-3 right-3 w-3 h-3 bg-[#00AEEF] rounded-full border-2 border-white dark:border-[#121212]"></span>
            </button>
          </div>

          {/* SIMPLE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* AI Voice Assistant */}
            <Card className="text-center flex flex-col justify-center min-h-[320px] border-4 border-ediflow-light-accent dark:border-ediflow-dark-accent">
                <div className="relative z-10">
                    <h2 className="text-gray-900 dark:text-white font-black text-2xl md:text-3xl mb-4">Asistente de Voz</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">Diga: "Encomienda", "Visita", "Pago" o "Novedad"</p>
                    
                    <button 
                        onClick={handleVoiceRecord}
                        className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center transition-all duration-300 ${
                            isListening 
                                ? 'bg-red-500 text-white scale-105' 
                                : 'bg-ediflow-light-accent dark:bg-ediflow-dark-accent text-white dark:text-black hover:opacity-90'
                        }`}
                    >
                        <span className="material-symbols-outlined text-6xl">
                            {isListening ? 'mic_off' : 'mic'}
                        </span>
                    </button>

                    <div className="mt-8 min-h-[32px]">
                        {isListening ? (
                            <p className="text-gray-900 dark:text-white text-xl font-bold italic">"{transcript || 'Escuchando...'}"</p>
                        ) : (
                            <p className="text-gray-500 text-lg font-medium">Toque el micrófono para hablar</p>
                        )}
                    </div>
                </div>
            </Card>

            {/* Manual Operations */}
            <div className="flex flex-col">
                <div className="grid grid-cols-2 gap-4 flex-1">
                    <button 
                        onClick={() => setActiveOperation('encomienda')}
                        className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center gap-4 transition-all ${activeOperation === 'encomienda' ? 'bg-ediflow-light-accent/10 border-ediflow-light-accent text-ediflow-light-accent dark:bg-ediflow-dark-accent/20 dark:border-ediflow-dark-accent dark:text-ediflow-dark-accent' : 'bg-white dark:bg-[#121212] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'}`}
                    >
                        <span className="material-symbols-outlined text-5xl">package_2</span>
                        <span className="text-xl font-bold">Paquete</span>
                    </button>
                    <button 
                        onClick={() => setActiveOperation('visita')}
                        className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center gap-4 transition-all ${activeOperation === 'visita' ? 'bg-ediflow-light-accent/10 border-ediflow-light-accent text-ediflow-light-accent dark:bg-ediflow-dark-accent/20 dark:border-ediflow-dark-accent dark:text-ediflow-dark-accent' : 'bg-white dark:bg-[#121212] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'}`}
                    >
                        <span className="material-symbols-outlined text-5xl">person_add</span>
                        <span className="text-xl font-bold">Visita</span>
                    </button>
                    <button 
                        onClick={() => navigate('RegisterPayment')}
                        className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center gap-4 transition-all bg-white dark:bg-[#121212] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600`}
                    >
                        <span className="material-symbols-outlined text-5xl">payments</span>
                        <span className="text-xl font-bold">Pago GC</span>
                    </button>
                    <button 
                        onClick={() => setActiveOperation('novedad')}
                        className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center gap-4 transition-all ${activeOperation === 'novedad' ? 'bg-ediflow-light-accent/10 border-ediflow-light-accent text-ediflow-light-accent dark:bg-ediflow-dark-accent/20 dark:border-ediflow-dark-accent dark:text-ediflow-dark-accent' : 'bg-white dark:bg-[#121212] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'}`}
                    >
                        <span className="material-symbols-outlined text-5xl">warning</span>
                        <span className="text-xl font-bold">Novedad</span>
                    </button>
                </div>
            </div>
          </div>

          {/* Inline Form for Manual Entry */}
          {activeOperation && (
              <div className="bg-white dark:bg-[#121212] p-8 rounded-3xl border-2 border-gray-200 dark:border-gray-800 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                      <h3 className="text-gray-900 dark:text-white font-black text-2xl">
                          {activeOperation === 'encomienda' && 'Registrar Encomienda'}
                          {activeOperation === 'visita' && 'Registrar Visita'}
                          {activeOperation === 'novedad' && 'Reportar Novedad'}
                      </h3>
                      <button type="button" onClick={() => setActiveOperation(null)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-[#1A1A1A] p-3 rounded-full transition-colors">
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
                              />
                          )}
                          <Input 
                              label={
                                  activeOperation === 'encomienda' ? 'Empresa' : 
                                  activeOperation === 'visita' ? 'Nombre del Visitante' : 
                                  'Descripción'
                              }
                              placeholder={
                                  activeOperation === 'encomienda' ? 'Ej. MercadoLibre' : 
                                  activeOperation === 'visita' ? 'Ej. Juan Pérez' : 
                                  'Detalle la novedad...'
                              }
                              value={manualInput}
                              onChange={(e) => setManualInput(e.target.value)}
                              required
                              className={activeOperation === 'novedad' ? 'md:col-span-2' : ''}
                          />
                      </div>
                      <div className="mt-8 flex justify-end">
                        <Button type="submit" size="lg" className="w-full md:w-auto">
                            Guardar Registro
                        </Button>
                      </div>
                  </form>
              </div>
          )}

          {/* Feed Section */}
          <section className="pt-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Últimos Movimientos</h2>
              <button onClick={() => navigate('HistoryScreen')} className="text-lg font-bold text-ediflow-light-accent dark:text-ediflow-dark-accent hover:opacity-80 transition-opacity flex items-center gap-2">
                Ver bitácora completa <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>

            <div className="space-y-4">
              {logs.map((log) => (
                  <div key={log.id} className="flex items-center gap-6 p-6 bg-white dark:bg-[#121212] rounded-3xl border-2 border-gray-200 dark:border-gray-800 shadow-sm">
                     <div className={`w-16 h-16 rounded-2xl bg-gray-100 dark:bg-[#1A1A1A] flex items-center justify-center ${log.color}`}>
                        <span className="material-symbols-outlined text-3xl">{log.icon}</span>
                     </div>
                     <div className="flex-1">
                       <div className="flex justify-between items-start">
                         <h4 className="text-xl font-bold text-gray-900 dark:text-white">{log.title}</h4>
                         <span className="text-base font-mono text-gray-500 bg-gray-100 dark:bg-[#1A1A1A] px-3 py-1 rounded-lg">{log.time}</span>
                       </div>
                       <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">{log.desc}</p>
                     </div>
                  </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white dark:bg-[#121212] border-t-2 border-gray-200 dark:border-gray-800 pb-6 pt-4 px-6 flex justify-between items-center z-30">
        <NavButton icon="dashboard" label="Panel" active />
        <NavButton icon="contacts" label="Directorio" onClick={() => navigate('ResidentDirectory')} />
        <NavButton icon="history" label="Bitácora" onClick={() => navigate('HistoryScreen')} />
        <NavButton icon="chat" label="Mensajes" onClick={() => navigate('MessagesScreen')} />
        <NavButton icon="settings" label="Ajustes" onClick={() => navigate('NotificationSettings')} />
      </nav>

      <NotificationDrawer 
        isOpen={isNotificationDrawerOpen} 
        onClose={() => setIsNotificationDrawerOpen(false)} 
      />
    </div>
  );
};

const SidebarButton = ({ icon, label, active = false, onClick }: { icon: string, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-4 p-4 w-full rounded-2xl transition-all ${active ? 'bg-ediflow-light-accent dark:bg-ediflow-dark-accent text-white dark:text-black font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1A1A1A] hover:text-gray-900 dark:hover:text-white font-bold'}`}
  >
    <span className={`material-symbols-outlined text-3xl ${active ? 'fill-current' : ''}`}>{icon}</span>
    <span className="text-lg tracking-wide">{label}</span>
  </button>
);

const NavButton = ({ icon, label, active = false, onClick }: { icon: string, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 transition-all active:scale-90 ${active ? 'text-ediflow-light-accent dark:text-ediflow-dark-accent' : 'text-gray-500 hover:text-ediflow-light-title dark:hover:text-ediflow-dark-title'}`}
  >
    <span className={`material-symbols-outlined text-2xl ${active ? 'fill-current' : ''}`}>{icon}</span>
    <span className="text-[10px] font-medium tracking-wide">{label}</span>
  </button>
);

export default ConciergeDashboard;
