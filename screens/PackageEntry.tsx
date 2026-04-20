import React, { useState, useRef, useEffect } from 'react';
import { ScreenName } from '../App';

interface Props {
  navigate: (screen: ScreenName) => void;
  from?: ScreenName | null;
}

const PackageEntry: React.FC<Props> = ({ navigate, from }) => {
  const [trackingCode, setTrackingCode] = useState('');
  const [department, setDepartment] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState('chilexpress');
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setTrackingCode(Math.floor(Math.random() * 10000000000).toString());
      setIsScanning(false);
    }, 1000);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPhoto(imageUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode || !department) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        navigate(from || 'ConciergeDashboard');
      }, 2500);
    }, 1500);
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
          
          {/* Tracking Row (The Core Actions Bento) */}
          <div className="bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 hover:border-white/10 transition-all group">
            {/* Tracking Code */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                Código de Seguimiento <span className="text-ediflow-primary ml-1">*</span>
              </label>
              <div className="flex w-full items-center bg-[#0A0A0A] rounded-xl overflow-hidden border border-white/5 focus-within:border-ediflow-primary/50 focus-within:ring-1 focus-within:ring-ediflow-primary/50 transition-all h-14">
                <input 
                  type="text" 
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  placeholder="Escanea o escribe código..."
                  className="flex-1 bg-transparent border-none text-white font-mono text-sm px-4 focus:ring-0 placeholder-gray-600 font-medium tracking-wide"
                  required
                />
                <button 
                  type="button"
                  onClick={handleSimulateScan}
                  disabled={isScanning}
                  className="w-14 h-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#141414] active:scale-95 transition-all border-l border-white/5 shrink-0"
                  title="Escanear Código"
                >
                  {isScanning ? (
                    <span className="material-symbols-outlined text-lg animate-spin text-ediflow-primary">sync</span>
                  ) : (
                    <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
                  )}
                </button>
              </div>
            </div>

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
                        <option value="" disabled className="text-gray-600">Seleccionar deudo...</option>
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

          {/* Media & Context Bento */}
          <div className="bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 hover:border-white/10 transition-all group">
            {/* Photo Evidence */}
            <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1 block">Evidencia Visual (Opcional)</label>
                 <div className="flex gap-4 items-center h-[160px]">
                     <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-full rounded-xl bg-[#0A0A0A] border border-dashed border-white/10 hover:border-white/30 hover:bg-[#141414] transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group active:scale-[0.98] overflow-hidden relative"
                     >
                         {photo ? (
                           <>
                             <img src={photo} alt="Evidencia" className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <span className="material-symbols-outlined text-white text-[24px]">edit</span>
                               <span className="text-[9px] font-bold text-white uppercase tracking-[0.2em] mt-2">Reemplazar Imagen</span>
                             </div>
                           </>
                         ) : (
                           <>
                             <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 group-hover:scale-110 group-hover:bg-white/10 group-hover:text-white flex items-center justify-center text-gray-500 transition-all">
                                <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
                             </div>
                             <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest group-hover:text-gray-400">Capturar Estado</span>
                           </>
                         )}
                     </div>
                     <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoUpload}
                     />
                 </div>
            </div>

            {/* Voice Enabled Notes */}
            <div className="space-y-2 flex flex-col h-[180px]">
                <div className="flex justify-between items-center px-1 mb-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1 block">Registrar Novedad</label>
                  
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
                    placeholder="Ej. Entregado con empaque húmedo. El conserje verificó el estado al recibir."
                    className={`w-full h-full bg-[#0A0A0A] border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition-all resize-none text-sm font-medium ${
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
              disabled={!trackingCode || !department || isSubmitting}
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
