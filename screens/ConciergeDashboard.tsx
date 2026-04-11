import React, { useState, useEffect, useRef } from 'react';
import { ScreenName } from '../App';

interface Props {
  navigate: (screen: ScreenName) => void;
  onLogout?: () => void;
}

type OperationType = 'encomienda' | 'visita' | 'novedad' | 'pago' | null;

interface LogEntry {
  id: string;
  icon: string;
  color: string;
  title: string;
  time: string;
  desc: string;
}

const ConciergeDashboard: React.FC<Props> = ({ navigate, onLogout }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  
  // Unified Manual Entry State
  const [activeOperation, setActiveOperation] = useState<OperationType>(null);
  const [manualInput, setManualInput] = useState('');
  const [deptoInput, setDeptoInput] = useState('');

  // Dynamic Logs State
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', icon: 'package_2', color: 'text-blue-400', title: 'Encomienda entregada', time: '10:45', desc: 'Recibido por Depto 402' },
    { id: '2', icon: 'person_check', color: 'text-purple-400', title: 'Visita ingresada', time: '10:30', desc: 'Para Depto 1105 (Juanito S.)' }
  ]);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Speech Recognition API
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'es-ES';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onend = () => {
        setIsListening(false);
        // Process the final transcript when audio stops
        if (recognitionRef.current?.finalTranscript) {
           processCommand(recognitionRef.current.finalTranscript);
           recognitionRef.current.finalTranscript = ''; // reset
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
            showToast("❌ Permiso de micrófono denegado por el navegador.");
        }
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Update ref so onend closure has access to the latest transcript
  useEffect(() => {
      if (recognitionRef.current && !isListening && transcript) {
          recognitionRef.current.finalTranscript = transcript;
      }
  }, [transcript, isListening]);


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
          desc
      };
      setLogs(prev => [newLog, ...prev]);
  };

  const processCommand = (text: string) => {
      if (!text.trim()) return;
      
      const lowerText = text.toLowerCase();
      let matched = false;

      // 1. Comando: ENCOMIENDA
      if (lowerText.includes('encomienda') || lowerText.includes('paquete')) {
          matched = true;
          // Extract all numbers (deptos)
          const deptos = text.match(/\d+/g) || [];
          if (deptos.length > 0) {
              addLog('package_2', 'text-blue-400', `${deptos.length} Encomienda(s) (Voz)`, `Deptos: ${deptos.join(', ')}`);
              showToast(`📦 Registradas encomiendas para: ${deptos.join(', ')}`);
          } else {
              showToast('❌ Comando de encomienda detectado, pero no escuché el número de departamento.');
          }
      } 
      // 2. Comando: VISITA
      else if (lowerText.includes('visita')) {
          matched = true;
          const deptoMatch = text.match(/\d+/);
          const depto = deptoMatch ? deptoMatch[0] : 'Desconocido';
          // Clean up text to get the name
          let name = lowerText.replace(/visita/g, '').replace(depto, '').replace(/al|para|el|de/g, '').trim();
          // Capitalize name
          name = name.charAt(0).toUpperCase() + name.slice(1);
          
          addLog('person_check', 'text-purple-400', 'Visita (Voz)', `${name || 'Persona'} al Depto ${depto}`);
          showToast(`👤 Visita registrada: ${name || 'Persona'} al ${depto}`);
      }
      // 3. Comando: PAGO
      else if (lowerText.includes('pago') || lowerText.includes('pagó')) {
          matched = true;
          const deptoMatch = text.match(/\d+/);
          const depto = deptoMatch ? deptoMatch[0] : 'Desconocido';
          
          addLog('payments', 'text-green-400', 'Pago GC (Voz)', `Depto ${depto} pagó en conserjería`);
          showToast(`💵 Pago registrado para Depto ${depto}`);
      }
      // 4. Comando: NOVEDAD / LIBRO DE NOVEDADES
      else if (lowerText.includes('novedad') || lowerText.includes('libro')) {
          matched = true;
          let desc = text.replace(/libro de novedades/gi, '').replace(/novedad/gi, '').replace(/registrar/gi, '').trim();
          desc = desc.charAt(0).toUpperCase() + desc.slice(1);
          
          addLog('warning', 'text-orange-400', 'Novedad (Voz)', desc || 'Sin descripción');
          showToast(`⚠️ Novedad registrada en bitácora.`);
      }

      if (!matched) {
          showToast('❌ Comando no reconocido. Inicia con: "Encomienda", "Visita", "Pago" o "Novedad".');
      }
      
      setTranscript(''); // Clear after processing
  };

  const handleVoiceRecord = () => {
    if (!recognitionRef.current) {
        showToast("❌ Tu navegador no soporta reconocimiento de voz.");
        return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Fallback for testing without mic
  const handleSimulateCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          processCommand(e.currentTarget.value);
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
    <div className="flex flex-col min-h-full pb-20 bg-[#101c22] relative">
      {/* Toast Notification */}
      {toast && (
          <div className="absolute top-24 left-4 right-4 z-50 bg-[#25323a] border border-white/10 text-white px-4 py-3 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-3 animate-fade-in-up">
              <span className="material-symbols-outlined text-2xl text-ediflow-primary">info</span>
              <p className="leading-tight">{toast}</p>
          </div>
      )}

      {/* Header */}
      <header className="px-6 pt-10 pb-4 flex justify-between items-center bg-[#101c22] sticky top-0 z-20 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => navigate('UserProfile')}
              className="w-12 h-12 rounded-full border-2 border-ediflow-primary p-0.5 active:scale-95 transition-transform"
            >
              <img 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            </button>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#101c22]"></div>
          </div>
          <div>
            <p className="text-ediflow-primary text-[10px] font-bold tracking-wider uppercase mb-0.5">Turno Día</p>
            <h1 className="text-lg font-bold text-white leading-tight">Juan Pérez</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onLogout && onLogout()}
            className="w-10 h-10 rounded-full bg-[#1c262c] flex items-center justify-center text-white/80 hover:bg-[#25323a] active:scale-90 transition-all border border-white/5"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </header>

      <main className="px-4 pt-6 space-y-6 flex-1">
        
        {/* Pareto 80/20: AI Voice Assistant */}
        <section className="bg-gradient-to-br from-[#1c262c] to-[#101c22] rounded-3xl p-6 border border-white/5 shadow-xl relative overflow-hidden text-center">
            <div className="relative z-10">
                <h2 className="text-white font-bold text-lg mb-2">Asistente de Portería IA</h2>
                <p className="text-gray-400 text-xs mb-6">Inicia con: "Encomienda", "Visita", "Pago" o "Novedad"</p>
                
                <button 
                    onClick={handleVoiceRecord}
                    className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all duration-300 shadow-2xl ${
                        isListening 
                            ? 'bg-red-500 text-white scale-110 animate-pulse shadow-red-500/50' 
                            : 'bg-ediflow-primary text-black hover:scale-105 shadow-ediflow-primary/30'
                    }`}
                >
                    <span className="material-symbols-outlined text-4xl">
                        {isListening ? 'mic_off' : 'mic'}
                    </span>
                </button>

                <div className="mt-6 min-h-[24px]">
                    {isListening ? (
                        <p className="text-white text-sm font-bold italic">"{transcript || 'Escuchando...'}"</p>
                    ) : (
                        <p className="text-gray-500 text-xs font-medium">Toca para hablar</p>
                    )}
                </div>

                {/* Fallback Input for testing if mic is blocked */}
                <div className="mt-4 pt-4 border-t border-white/5">
                    <input 
                        type="text" 
                        placeholder="O escribe el comando aquí y presiona Enter..." 
                        onKeyDown={handleSimulateCommand}
                        className="w-full bg-[#101c22] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-ediflow-primary outline-none"
                    />
                </div>
            </div>
            {/* Decorative background waves */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-10">
                <div className={`absolute inset-0 border-4 border-ediflow-primary rounded-full transition-all duration-1000 ${isListening ? 'scale-150 opacity-0 animate-ping' : 'scale-50 opacity-0'}`}></div>
            </div>
        </section>

        {/* Unified Manual Operations */}
        <section>
            <h2 className="text-xs font-bold text-gray-500 uppercase mb-3 ml-1">Registro Manual Rápido</h2>
            <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={() => setActiveOperation('encomienda')}
                    className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all active:scale-95 ${activeOperation === 'encomienda' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-[#1c262c] border-white/5 text-gray-400 hover:text-white'}`}
                >
                    <span className="material-symbols-outlined text-2xl">package_2</span>
                    <span className="text-[10px] font-bold">Paquete</span>
                </button>
                <button 
                    onClick={() => setActiveOperation('visita')}
                    className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all active:scale-95 ${activeOperation === 'visita' ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-[#1c262c] border-white/5 text-gray-400 hover:text-white'}`}
                >
                    <span className="material-symbols-outlined text-2xl">person_add</span>
                    <span className="text-[10px] font-bold">Visita</span>
                </button>
                <button 
                    onClick={() => setActiveOperation('pago')}
                    className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all active:scale-95 ${activeOperation === 'pago' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-[#1c262c] border-white/5 text-gray-400 hover:text-white'}`}
                >
                    <span className="material-symbols-outlined text-2xl">payments</span>
                    <span className="text-[10px] font-bold">Pago GC</span>
                </button>
                <button 
                    onClick={() => setActiveOperation('novedad')}
                    className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all active:scale-95 ${activeOperation === 'novedad' ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-[#1c262c] border-white/5 text-gray-400 hover:text-white'}`}
                >
                    <span className="material-symbols-outlined text-2xl">warning</span>
                    <span className="text-[10px] font-bold">Novedad</span>
                </button>
            </div>

            {/* Inline Form for Manual Entry */}
            {activeOperation && (
                <form onSubmit={handleManualSubmit} className="mt-4 bg-[#1c262c] p-4 rounded-2xl border border-white/5 animate-fade-in-up">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-bold text-sm">
                            {activeOperation === 'encomienda' && 'Registrar Encomienda'}
                            {activeOperation === 'visita' && 'Registrar Visita'}
                            {activeOperation === 'pago' && 'Registrar Pago GC'}
                            {activeOperation === 'novedad' && 'Reportar Novedad'}
                        </h3>
                        <button type="button" onClick={() => setActiveOperation(null)} className="text-gray-500 hover:text-white">
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                    
                    <div className="space-y-3">
                        {activeOperation !== 'novedad' && (
                            <input 
                                type="text" 
                                placeholder="Nº Departamento" 
                                value={deptoInput}
                                onChange={(e) => setDeptoInput(e.target.value)}
                                className="w-full bg-[#101c22] border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:border-ediflow-primary outline-none"
                                required
                            />
                        )}
                        <input 
                            type="text" 
                            placeholder={
                                activeOperation === 'encomienda' ? 'Empresa (ej. MercadoLibre)' : 
                                activeOperation === 'visita' ? 'Nombre del visitante' : 
                                activeOperation === 'pago' ? 'Monto y método (ej. $125.400 Efectivo)' :
                                'Descripción de la novedad'
                            }
                            value={manualInput}
                            onChange={(e) => setManualInput(e.target.value)}
                            className="w-full bg-[#101c22] border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:border-ediflow-primary outline-none"
                            required
                        />
                        <button type="submit" className="w-full bg-ediflow-primary text-black font-bold py-3 rounded-xl active:scale-[0.98] transition-all">
                            Guardar Registro
                        </button>
                    </div>
                </form>
            )}
        </section>

        {/* Feed Section */}
        <section className="pt-2">
          <div className="flex items-center justify-between mb-4 ml-1">
            <h2 className="text-xs font-bold text-gray-500 uppercase">Últimos Movimientos</h2>
            <button onClick={() => navigate('HistoryScreen')} className="text-xs font-bold text-ediflow-primary hover:text-white active:opacity-70 transition-all">Ver bitácora</button>
          </div>

          <div className="space-y-3 relative">
             {/* Timeline Line */}
             <div className="absolute left-[19px] top-4 bottom-4 w-[1px] bg-white/5"></div>

            {logs.map((log) => (
                <div key={log.id} className="relative flex items-center gap-4 p-3 bg-[#1c262c] rounded-2xl border border-white/5 animate-fade-in-up">
                   <div className={`relative z-10 w-10 h-10 rounded-full bg-[#101c22] border border-white/5 flex items-center justify-center ${log.color}`}>
                      <span className="material-symbols-outlined text-lg">{log.icon}</span>
                   </div>
                   <div className="flex-1">
                     <div className="flex justify-between items-start">
                       <h4 className="text-sm font-bold text-white">{log.title}</h4>
                       <span className="text-[10px] font-mono text-gray-500">{log.time}</span>
                     </div>
                     <p className="text-xs text-gray-400 mt-0.5">{log.desc}</p>
                   </div>
                </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full max-w-[420px] bg-[#151e24] border-t border-white/5 pb-6 pt-2 px-6 flex justify-between items-center z-30">
        <NavButton icon="dashboard" label="Panel" active />
        <NavButton icon="history" label="Bitácora" onClick={() => navigate('HistoryScreen')} />
        <NavButton icon="chat" label="Mensajes" onClick={() => navigate('MessagesScreen')} />
        <NavButton icon="settings" label="Ajustes" onClick={() => navigate('NotificationSettings')} />
      </nav>
    </div>
  );
};

const NavButton = ({ icon, label, active = false, onClick }: { icon: string, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 transition-all active:scale-90 ${active ? 'text-ediflow-primary' : 'text-gray-500 hover:text-white'}`}
  >
    <span className={`material-symbols-outlined text-2xl ${active ? 'fill-current' : ''}`}>{icon}</span>
    <span className="text-[10px] font-medium tracking-wide">{label}</span>
  </button>
);

export default ConciergeDashboard;
