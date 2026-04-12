import React, { useState, useRef, useEffect } from 'react';
import { ScreenName } from '../App';

interface Props {
  navigate: (screen: ScreenName) => void;
}

const PackageEntry: React.FC<Props> = ({ navigate }) => {
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

  const handleSubmit = () => {
    if (!trackingCode || !department) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        navigate('ConciergeDashboard');
      }, 2500);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full bg-[#0A0A0A] p-6 text-center">
        <div className="w-24 h-24 bg-ediflow-primary/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <span className="material-symbols-outlined text-6xl text-ediflow-primary">mark_email_read</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">¡Encomienda Registrada!</h2>
        <p className="text-gray-400 mb-2">Se ha notificado al residente del Depto {department}.</p>
        <p className="text-xs text-gray-500">Código: {trackingCode}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-[#0A0A0A]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0A0A0A]/95 backdrop-blur-sm px-4 py-4 flex items-center border-b border-white/5">
        <button 
          onClick={() => navigate('ConciergeDashboard')}
          className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-all active:scale-90"
        >
          <span className="material-symbols-outlined text-white">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold text-white flex-1 text-center pr-10">Ingreso de Encomienda</h2>
      </div>

      <div className="p-6 flex flex-col gap-6 pb-24">
        {/* Tracking Code */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white">Código de Seguimiento *</label>
          <div className="flex w-full items-center bg-[#141414] rounded-xl overflow-hidden border border-white/5 focus-within:border-ediflow-primary/50 transition-colors">
            <input 
              type="text" 
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder="Ingresa o escanea el código"
              className="flex-1 bg-transparent border-none text-white font-mono text-lg px-4 h-14 focus:ring-0 placeholder-gray-600"
            />
            <button 
              onClick={handleSimulateScan}
              disabled={isScanning}
              className="px-4 h-full flex items-center justify-center text-ediflow-primary hover:bg-white/5 active:scale-95 transition-all border-l border-white/5"
            >
              {isScanning ? (
                <span className="material-symbols-outlined text-2xl animate-spin">sync</span>
              ) : (
                <span className="material-symbols-outlined text-2xl">barcode_scanner</span>
              )}
            </button>
          </div>
        </div>

        {/* Department Selector */}
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white">Departamento Destino *</label>
            <div className="relative">
                <select 
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-[#141414] text-white border border-white/5 rounded-xl h-14 px-4 appearance-none focus:ring-1 focus:ring-ediflow-primary cursor-pointer transition-colors"
                >
                    <option value="">Seleccionar unidad...</option>
                    <option value="101">101 - Torre A</option>
                    <option value="102">102 - Torre A</option>
                    <option value="201">201 - Torre A</option>
                    <option value="402">402 - Torre B</option>
                    <option value="805">805 - Torre B</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                    <span className="material-symbols-outlined">expand_more</span>
                </div>
            </div>
        </div>

        {/* Carrier Selection */}
        <div className="flex flex-col gap-3">
             <label className="text-sm font-medium text-white">Empresa de Transporte</label>
             <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {[
                    { id: 'chilexpress', name: 'Chilexpress', icon: 'local_shipping' },
                    { id: 'starken', name: 'Starken', icon: 'package_2' },
                    { id: 'mercadolibre', name: 'Mercado Libre', icon: 'shopping_bag' },
                    { id: 'bluexpress', name: 'Bluexpress', icon: 'local_shipping' },
                    { id: 'otro', name: 'Otro', icon: 'box' }
                ].map(carrier => (
                    <button
                        key={carrier.id}
                        onClick={() => setSelectedCarrier(carrier.id)}
                        className={`flex items-center gap-2 px-4 h-12 rounded-lg border-2 transition-all whitespace-nowrap active:scale-95 ${
                            selectedCarrier === carrier.id 
                            ? 'bg-ediflow-primary/10 border-ediflow-primary text-ediflow-primary' 
                            : 'bg-[#141414] border-transparent text-white/60 hover:bg-[#1F1F1F]'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[18px]">{carrier.icon}</span>
                        <span className="text-sm font-medium">{carrier.name}</span>
                    </button>
                ))}
             </div>
        </div>

        {/* Photo Evidence */}
        <div className="flex flex-col gap-3">
             <label className="text-sm font-medium text-white">Fotografía del Paquete (Opcional)</label>
             <div className="flex gap-4 items-center">
                 <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-32 h-32 rounded-xl bg-[#141414] border-2 border-dashed border-[#333333] hover:border-ediflow-primary hover:bg-[#1F1F1F] transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group active:scale-95 overflow-hidden relative"
                 >
                     {photo ? (
                       <>
                         <img src={photo} alt="Paquete" className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <span className="material-symbols-outlined text-white">edit</span>
                         </div>
                       </>
                     ) : (
                       <>
                         <div className="w-10 h-10 rounded-full bg-[#292929] group-hover:bg-ediflow-primary group-hover:text-black flex items-center justify-center text-white/50 transition-colors">
                            <span className="material-symbols-outlined">photo_camera</span>
                         </div>
                         <span className="text-xs font-medium text-white/50 group-hover:text-white">Tomar Foto</span>
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
                 <p className="flex-1 text-sm text-white/40 leading-relaxed">
                    Captura una imagen del estado del paquete para respaldo de recepción.
                 </p>
             </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-white">Observaciones (Opcional)</label>
              <button
                type="button"
                onClick={toggleRecording}
                className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full transition-all active:scale-95 ${
                  isRecording 
                    ? 'bg-red-500/20 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)] animate-pulse' 
                    : 'bg-[#1F1F1F] text-gray-400 hover:text-white hover:bg-[#292929]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{isRecording ? 'mic' : 'mic_none'}</span>
                {isRecording ? 'Escuchando...' : 'Dictar por voz'}
              </button>
            </div>
            <div className="relative">
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Paquete con abolladuras, entregado a vecino..."
                rows={3}
                className={`w-full bg-[#141414] border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition-colors resize-none ${
                  isRecording ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-ediflow-primary'
                }`}
              />
              {isRecording && (
                <div className="absolute bottom-3 right-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              )}
            </div>
        </div>

      </div>

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-0 w-full max-w-[420px] p-4 bg-[#0A0A0A]/95 backdrop-blur-md border-t border-white/5 z-30">
        <button 
          onClick={handleSubmit}
          disabled={!trackingCode || !department || isSubmitting}
          className="w-full h-14 bg-ediflow-primary hover:bg-[#FADB14] active:bg-[#E3AF08] active:scale-[0.98] text-black rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-yellow-900/20 transition-all disabled:opacity-50 disabled:active:scale-100"
        >
            {isSubmitting ? (
              <span className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
            ) : (
              <>
                <span className="material-symbols-outlined">notifications_active</span>
                Registrar y Notificar
              </>
            )}
        </button>
      </div>

    </div>
  );
};

export default PackageEntry;