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
      <div className="flex flex-col items-center justify-center min-h-full bg-[#0A0A0A] p-6 text-center">
        <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <span className="material-symbols-outlined text-6xl text-blue-500">package_2</span>
        </div>
        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">¡Encomienda Registrada!</h2>
        <p className="text-gray-400 mb-2 text-lg">Se ha notificado al residente del Depto <span className="text-white font-bold">{department}</span>.</p>
        <div className="bg-white/5 px-4 py-2 rounded-lg mt-4">
          <p className="text-xs text-gray-500 uppercase font-black tracking-widest">Código de Seguimiento</p>
          <p className="text-blue-400 font-mono font-bold">{trackingCode}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-[#0A0A0A]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/5 p-4 flex items-center gap-4">
        <button 
          onClick={() => navigate(from || 'ConciergeDashboard')}
          className="w-10 h-10 rounded-full bg-[#141414] flex items-center justify-center text-white hover:bg-[#1F1F1F] active:scale-90 transition-all border border-white/5"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-lg font-black text-white uppercase tracking-tight">Ingreso de Encomienda</h1>
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">Recepción de Paquetes</p>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-4xl mx-auto w-full pb-32">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Tracking & Dept Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tracking Code */}
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Código de Seguimiento *</label>
              <div className="flex w-full items-center bg-[#141414] rounded-2xl overflow-hidden border-2 border-white/5 focus-within:border-blue-500/50 transition-all shadow-inner">
                <input 
                  type="text" 
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  placeholder="Ingresa o escanea el código"
                  className="flex-1 bg-transparent border-none text-white font-mono text-xl px-5 h-16 focus:ring-0 placeholder-gray-700"
                  required
                />
                <button 
                  type="button"
                  onClick={handleSimulateScan}
                  disabled={isScanning}
                  className="w-16 h-16 flex items-center justify-center text-blue-500 hover:bg-blue-500/10 active:scale-90 transition-all border-l border-white/5"
                  title="Escanear Código"
                >
                  {isScanning ? (
                    <span className="material-symbols-outlined text-2xl animate-spin">sync</span>
                  ) : (
                    <span className="material-symbols-outlined text-3xl">barcode_scanner</span>
                  )}
                </button>
              </div>
            </div>

            {/* Department Selector */}
            <div className="space-y-3">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Departamento Destino *</label>
                <div className="relative">
                    <select 
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-[#141414] text-white border-2 border-white/5 rounded-2xl h-16 px-5 appearance-none focus:ring-0 focus:border-blue-500/50 cursor-pointer transition-all text-lg font-bold"
                      required
                    >
                        <option value="">Seleccionar unidad...</option>
                        <option value="101">101 - Torre A</option>
                        <option value="102">102 - Torre A</option>
                        <option value="201">201 - Torre A</option>
                        <option value="402">402 - Torre B</option>
                        <option value="805">805 - Torre B</option>
                        <option value="1102">1102 - Torre C</option>
                        <option value="1504">1504 - Torre C</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                        <span className="material-symbols-outlined text-3xl">expand_more</span>
                    </div>
                </div>
            </div>
          </div>

          {/* Carrier Selection */}
          <div className="space-y-4">
               <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Empresa de Transporte</label>
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {[
                      { id: 'chilexpress', name: 'Chilexpress', icon: 'local_shipping' },
                      { id: 'starken', name: 'Starken', icon: 'package_2' },
                      { id: 'mercadolibre', name: 'Mercado Libre', icon: 'shopping_bag' },
                      { id: 'bluexpress', name: 'Bluexpress', icon: 'delivery_dining' },
                      { id: 'otro', name: 'Otro', icon: 'box' }
                  ].map(carrier => (
                      <button
                          key={carrier.id}
                          type="button"
                          onClick={() => setSelectedCarrier(carrier.id)}
                          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all active:scale-95 ${
                              selectedCarrier === carrier.id 
                              ? 'bg-blue-500/10 border-blue-500 text-blue-500 shadow-lg shadow-blue-500/10' 
                              : 'bg-[#141414] border-transparent text-gray-500 hover:bg-[#1F1F1F] hover:text-gray-300'
                          }`}
                      >
                          <span className="material-symbols-outlined text-3xl">{carrier.icon}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest">{carrier.name}</span>
                      </button>
                  ))}
               </div>
          </div>

          {/* Photo & Notes Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Photo Evidence */}
            <div className="space-y-3">
                 <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Evidencia Fotográfica</label>
                 <div className="flex gap-4 items-center">
                     <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-40 rounded-2xl bg-[#141414] border-2 border-dashed border-white/5 hover:border-blue-500/50 hover:bg-[#1F1F1F] transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group active:scale-95 overflow-hidden relative shadow-inner"
                     >
                         {photo ? (
                           <>
                             <img src={photo} alt="Paquete" className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <span className="material-symbols-outlined text-white text-3xl">edit</span>
                               <span className="text-[10px] font-black text-white uppercase mt-2">Cambiar Foto</span>
                             </div>
                           </>
                         ) : (
                           <>
                             <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-blue-500 group-hover:text-black flex items-center justify-center text-gray-500 transition-all">
                                <span className="material-symbols-outlined text-3xl">photo_camera</span>
                             </div>
                             <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-white">Capturar Paquete</span>
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

            {/* Notes */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Observaciones</label>
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all active:scale-95 ${
                      isRecording 
                        ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse' 
                        : 'bg-[#1F1F1F] text-blue-500 border border-blue-500/20 hover:bg-blue-500/10'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{isRecording ? 'mic' : 'mic_none'}</span>
                    {isRecording ? 'Escuchando...' : 'Dictar Notas'}
                  </button>
                </div>
                <div className="relative h-40">
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej. Paquete con abolladuras, entregado a vecino, frágil..."
                    className={`w-full h-full bg-[#141414] border-2 rounded-2xl px-5 py-4 text-white placeholder-gray-700 focus:outline-none transition-all resize-none text-lg leading-relaxed ${
                      isRecording ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-blue-500/50'
                    }`}
                  />
                  {isRecording && (
                    <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  )}
                </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button 
              type="submit"
              disabled={!trackingCode || !department || isSubmitting}
              className="w-full h-20 bg-blue-500 hover:bg-blue-400 active:scale-[0.98] text-white rounded-3xl font-black text-xl uppercase tracking-[0.1em] flex items-center justify-center gap-4 shadow-2xl shadow-blue-900/40 transition-all disabled:opacity-50 disabled:active:scale-100"
            >
                {isSubmitting ? (
                  <span className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-3xl">notifications_active</span>
                    Registrar y Notificar
                  </>
                )}
            </button>
            <p className="text-center text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mt-6">
              Al registrar, se enviará una notificación push y correo al residente.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};

export default PackageEntry;
