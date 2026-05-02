import React, { useState, useRef, useEffect } from 'react';
import { ScreenName } from '../App';
import { supabase } from '../src/lib/supabase-client';
import { useAppContext } from '../src/context/AppContext';

interface Props {
  navigate: (screen: ScreenName) => void;
  from?: ScreenName | null;
}

const PackageEntry: React.FC<Props> = ({ navigate, from }) => {
  const { currentTenant, currentUser } = useAppContext();
  const [department, setDepartment] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState('chilexpress');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'es-ES';

        recognitionRef.current.onresult = (event: any) => {
          let newFinalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              newFinalTranscript += event.results[i][0].transcript + ' ';
            }
          }
          if (newFinalTranscript) {
            setNotes(prev => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + newFinalTranscript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Tu navegador no soporta reconocimiento de voz.");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!department || !currentTenant || !currentUser) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('parcels').insert({
        tenant_id: currentTenant.id,
        department_number: department,
        tracking_provider: selectedCarrier,
        status: 'received',
        received_by: currentUser.id,
        photo_url: notes // Can use notes to hold extra info as MVP
      });

      if (error) {
        throw error;
      }

      setShowSuccess(true);
      setTimeout(() => {
        navigate(from || 'ConciergeDashboard');
      }, 2500);

    } catch (err) {
      console.error('Error recording parcel:', err);
      alert('Error al registrar paquete.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0A] p-6 text-center">
        <div className="w-32 h-32 bg-[#008080]/10 border border-[#008080]/20 rounded-full flex items-center justify-center mb-8 animate-bounce">
          <span className="material-symbols-outlined text-[64px] text-[#008080]">inventory_2</span>
        </div>
        <h2 className="text-4xl font-light text-white mb-3 tracking-tight">Encomienda Segura</h2>
        <p className="text-gray-400 mb-8 text-lg font-light">Se notificó exitosamente al residente del <span className="text-white font-medium">Depto {department}</span>.</p>
        <div className="bg-[#111] border border-white/5 px-8 py-4 rounded-[2rem] shadow-2xl">
          <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-widest mb-1.5">Reg. Oficial de Tracking</p>
          <p className="text-ediflow-primary font-mono font-medium text-xl tracking-wider">{trackingCode}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] font-sans text-white overflow-hidden">
      {/* Premium Header */}
      <header className="px-6 md:px-16 pt-8 md:pt-12 pb-6 lg:pb-8 flex items-center justify-between sticky top-0 z-30 bg-[#0A0A0A]/90 backdrop-blur-3xl border-b border-white/5">
        <div className="flex items-center gap-4 pointer-events-auto">
          <button 
            onClick={() => navigate(from || 'ConciergeDashboard')}
            className="w-10 h-10 rounded-xl bg-[#111] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1A1A1A] active:scale-95 transition-all shadow-sm group relative"
          >
            <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform relative z-10">arrow_back</span>
          </button>
          <div>
            <h2 className="text-[10px] font-bold text-ediflow-primary uppercase tracking-[0.2em] mb-0.5">Recepción de Paquetes</h2>
            <h1 className="text-lg md:text-xl font-medium text-white tracking-tight flex items-center gap-2">Nueva Encomienda</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-6 md:px-16 pt-8 pb-32 max-w-7xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto">
          
          {/* Main Info Bento */}
          <div className="bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 hover:border-white/10 transition-all group">

            {/* Department Selector */}
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                  Destinatario (Unidad) <span className="text-amber-500 ml-1">*</span>
                </label>
                <div className="relative">
                    <select 
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full h-14 bg-[#0A0A0A] text-white border border-white/5 rounded-xl px-4 appearance-none focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 focus:bg-[#141414] cursor-pointer transition-all text-sm font-medium tracking-tight"
                      required
                    >
                        <option value="" disabled className="text-gray-600">Seleccionar depto...</option>
                        <option value="101">101 - Torre A</option>
                        <option value="102">102 - Torre A</option>
                        <option value="201">201 - Torre A</option>
                        <option value="402">402 - Torre B</option>
                        <option value="805">805 - Torre B</option>
                        <option value="1102">1102 - Torre C</option>
                        <option value="1504">1504 - Torre C</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <span className="material-symbols-outlined text-[20px]">unfold_more</span>
                    </div>
                </div>
            </div>

            {/* Tracking Code (Optional Text Input) */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                Código de Seguimiento (Opcional)
              </label>
              <input 
                 type="text" 
                 value={trackingCode}
                 onChange={(e) => setTrackingCode(e.target.value)}
                 placeholder="Ej. 123456789"
                 className="w-full h-14 bg-[#0A0A0A] rounded-xl overflow-hidden border border-white/5 focus:border-ediflow-primary/50 focus:ring-1 focus:ring-ediflow-primary/50 transition-all text-white font-mono text-sm px-4 placeholder-gray-600 font-medium tracking-wide"
              />
            </div>
          </div>

          {/* Carrier Selection Bento */}
          <div className="bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl hover:border-white/10 transition-all group">
               <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-1 block">Empresa Logística</label>
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {[
                      { id: 'chilexpress', name: 'Chilexpress', icon: 'local_shipping' },
                      { id: 'starken', name: 'Starken', icon: 'inventory_2' },
                      { id: 'mercadolibre', name: 'Mercado Libre', icon: 'shopping_bag' },
                      { id: 'bluexpress', name: 'Bluexpress', icon: 'delivery_dining' },
                      { id: 'otro', name: 'Otro/Delivery', icon: 'box' }
                  ].map(carrier => (
                      <button
                          key={carrier.id}
                          type="button"
                          onClick={() => setSelectedCarrier(carrier.id)}
                          className={`flex flex-col items-center justify-center gap-2 h-24 rounded-xl border transition-all active:scale-[0.98] ${
                              selectedCarrier === carrier.id 
                              ? 'bg-ediflow-primary/10 border-ediflow-primary/30 text-ediflow-primary shadow-[0_0_15px_rgba(0,174,239,0.1)]' 
                              : 'bg-[#0A0A0A] border-white/5 text-gray-500 hover:bg-[#141414] hover:text-gray-300'
                          }`}
                      >
                          <span className="material-symbols-outlined text-[24px]">{carrier.icon}</span>
                          <span className="text-[9px] font-bold uppercase tracking-widest mt-1">{carrier.name}</span>
                      </button>
                  ))}
               </div>
          </div>

          {/* Context Bento */}
          <div className="bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl hover:border-white/10 transition-all group">
            {/* Voice Enabled Notes */}
            <div className="space-y-2 flex flex-col min-h-[140px]">
                <div className="flex justify-between items-center px-1 mb-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1 block">Observaciones adicionales</label>
                  
                  {/* Voice Button Integration */}
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full transition-all active:scale-[0.98] ${
                      isRecording 
                        ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                        : 'bg-[#0A0A0A] text-gray-500 border border-white/5 hover:bg-[#141414] hover:text-gray-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {isRecording ? 'mic' : 'mic_none'}
                    </span>
                    {isRecording ? 'Grabando...' : 'Dictar Vía Voz'}
                  </button>
                </div>
                
                <div className="relative flex-1">
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej. Entregado a conserje de turno."
                    className={`w-full h-full min-h-[100px] bg-[#0A0A0A] border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition-all resize-none text-sm font-medium ${
                      isRecording 
                          ? 'border-red-500/50 focus:ring-1 focus:ring-red-500/50 bg-[#141414]' 
                          : 'border-white/5 focus:border-ediflow-primary/50 focus:ring-1 focus:ring-ediflow-primary/50 focus:bg-[#141414]'
                    }`}
                  />
                  {isRecording && (
                    <div className="absolute bottom-4 right-4 flex items-center gap-1">
                       <div className="h-3 w-0.5 bg-red-500 rounded-full animate-[pulse_1s_ease-in-out_infinite_0s]"></div>
                       <div className="h-4 w-0.5 bg-red-500 rounded-full animate-[pulse_1s_ease-in-out_infinite_0.2s]"></div>
                       <div className="h-2 w-0.5 bg-red-500 rounded-full animate-[pulse_1s_ease-in-out_infinite_0.4s]"></div>
                       <div className="h-5 w-0.5 bg-red-500 rounded-full animate-[pulse_1s_ease-in-out_infinite_0.6s]"></div>
                    </div>
                  )}
                </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 pb-12 flex flex-col items-center">
             <button 
              type="submit"
              disabled={!department || isSubmitting}
              className="group w-full md:w-auto md:min-w-[400px] h-14 bg-ediflow-primary hover:bg-white active:scale-[0.98] text-black rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,174,239,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all disabled:opacity-50 disabled:grayscale disabled:hover:bg-ediflow-primary disabled:active:scale-100 disabled:cursor-not-allowed border border-transparent"
            >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                ) : (
                  <>
                    Confirmar Llegada
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </>
                )}
            </button>
            <p className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-4 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">lock</span> Notificación Inmediata al Residente
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};

export default PackageEntry;
