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
      <header className="px-6 md:px-16 pt-8 md:pt-16 pb-6 lg:pb-8 flex items-center gap-4 sticky top-0 z-30 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-transparent pointer-events-none md:bg-none">
        <button 
          onClick={() => navigate(from || 'ConciergeDashboard')}
          className="w-12 h-12 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 active:scale-95 transition-all pointer-events-auto shadow-lg"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="pointer-events-auto">
          <h1 className="text-2xl md:text-4xl font-light tracking-tight text-white leading-none">Nueva Encomienda</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1.5 uppercase font-semibold tracking-widest">Recepción de Paquetes</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-6 md:px-16 pb-32 max-w-4xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Tracking Row (The Core Actions Bento) */}
          <div className="bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 hover:border-white/10 transition-colors">
            {/* Tracking Code */}
            <div className="space-y-3">
              <label className="text-[10px] font-semibold text-gray-400 flex items-center gap-2 uppercase tracking-widest px-2">
                Código de Seguimiento <span className="text-ediflow-primary">*</span>
              </label>
              <div className="flex w-full items-center bg-[#0A0A0A] rounded-2xl overflow-hidden border border-white/5 focus-within:border-ediflow-primary/50 focus-within:shadow-[0_0_15px_rgba(0,174,239,0.1)] transition-all">
                <input 
                  type="text" 
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  placeholder="Escanea o escribe código..."
                  className="flex-1 bg-transparent border-none text-white font-mono text-lg px-5 h-16 md:h-14 focus:ring-0 placeholder-gray-700 font-medium tracking-wide"
                  required
                />
                <button 
                  type="button"
                  onClick={handleSimulateScan}
                  disabled={isScanning}
                  className="w-16 md:w-14 h-16 md:h-14 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all border-l border-white/5 shrink-0"
                  title="Escanear Código"
                >
                  {isScanning ? (
                    <span className="material-symbols-outlined text-xl animate-spin text-ediflow-primary">sync</span>
                  ) : (
                    <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
                  )}
                </button>
              </div>
            </div>

            {/* Department Selector */}
            <div className="space-y-3">
                <label className="text-[10px] font-semibold text-gray-400 flex items-center gap-2 uppercase tracking-widest px-2">
                  Destinatario (Unidad) <span className="text-ediflow-primary">*</span>
                </label>
                <div className="relative">
                    <select 
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-[#0A0A0A] text-white border border-white/5 rounded-2xl h-16 md:h-14 px-5 appearance-none focus:ring-0 focus:border-ediflow-primary/50 focus:shadow-[0_0_15px_rgba(0,174,239,0.1)] cursor-pointer transition-all text-lg md:text-base font-medium"
                      required
                    >
                        <option value="">Seleccionar deudo...</option>
                        <option value="101">101 - Torre A</option>
                        <option value="102">102 - Torre A</option>
                        <option value="201">201 - Torre A</option>
                        <option value="402">402 - Torre B</option>
                        <option value="805">805 - Torre B</option>
                        <option value="1102">1102 - Torre C</option>
                        <option value="1504">1504 - Torre C</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <span className="material-symbols-outlined text-2xl">unfold_more</span>
                    </div>
                </div>
            </div>
          </div>

          {/* Carrier Selection Bento */}
          <div className="bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-xl hover:border-white/10 transition-colors">
               <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-4 px-2 block">Empresa Logística</label>
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
                          className={`flex flex-col items-center justify-center gap-2.5 p-4 md:p-5 rounded-2xl border transition-all active:scale-[0.98] ${
                              selectedCarrier === carrier.id 
                              ? 'bg-ediflow-primary/10 border-ediflow-primary/30 text-white shadow-sm' 
                              : 'bg-[#0A0A0A] border-white/5 text-gray-500 hover:bg-white/5 hover:text-gray-300 hover:border-white/10'
                          }`}
                      >
                          <span className={`material-symbols-outlined text-3xl ${selectedCarrier === carrier.id ? 'text-ediflow-primary' : ''}`}>{carrier.icon}</span>
                          <span className={`text-[9px] uppercase tracking-widest font-semibold ${selectedCarrier === carrier.id ? 'text-white' : ''}`}>{carrier.name}</span>
                      </button>
                  ))}
               </div>
          </div>

          {/* Media & Context Bento */}
          <div className="bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 hover:border-white/10 transition-colors">
            {/* Photo Evidence */}
            <div className="space-y-3">
                 <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 block">Evidencia Visual (Opcional)</label>
                 <div className="flex gap-4 items-center h-[140px] md:h-[180px]">
                     <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-full rounded-2xl bg-[#0A0A0A] border border-dashed border-white/10 hover:border-white/30 hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group active:scale-[0.98] overflow-hidden relative"
                     >
                         {photo ? (
                           <>
                             <img src={photo} alt="Evidencia" className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <span className="material-symbols-outlined text-white text-3xl">edit</span>
                               <span className="text-[10px] font-bold text-white uppercase tracking-widest mt-2">Reemplazar Imagen</span>
                             </div>
                           </>
                         ) : (
                           <>
                             <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 group-hover:scale-110 group-hover:bg-white/10 group-hover:text-white flex items-center justify-center text-gray-500 transition-all">
                                <span className="material-symbols-outlined text-2xl">add_a_photo</span>
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
            <div className="space-y-3 flex flex-col h-[166px] md:h-[210px]">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-1">Registrar Novedad</label>
                  
                  {/* Voice Button Integration */}
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full transition-all active:scale-[0.98] ${
                      isRecording 
                        ? 'bg-red-500/20 text-red-500 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
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
                    className={`w-full h-full bg-[#0A0A0A] border rounded-2xl p-4 text-white placeholder-gray-700 focus:outline-none transition-all resize-none text-sm leading-relaxed font-light ${
                      isRecording 
                          ? 'border-red-500/30 focus:border-red-500/50 focus:shadow-[0_0_20px_rgba(239,68,68,0.1)]' 
                          : 'border-white/5 focus:border-white/20'
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
          <div className="pt-4 flex flex-col items-center">
            <button 
              type="submit"
              disabled={!trackingCode || !department || isSubmitting}
              className="w-full md:w-auto md:min-w-[400px] h-16 md:h-14 bg-[#008080] hover:bg-teal-500 active:scale-[0.98] text-white rounded-2xl font-semibold text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,128,128,0.3)] transition-all disabled:opacity-50 disabled:grayscale disabled:hover:bg-[#008080] disabled:active:scale-100 disabled:shadow-none disabled:cursor-not-allowed"
            >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">mark_email_read</span>
                    Confirmar Llegada
                  </>
                )}
            </button>
            <p className="text-center text-[10px] font-semibold text-gray-600 uppercase tracking-widest mt-4">
              La notificación automática se emitirá de inmediato.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};

export default PackageEntry;
