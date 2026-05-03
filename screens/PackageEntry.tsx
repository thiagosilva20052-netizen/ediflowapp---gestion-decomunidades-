import React, { useState, useRef, useEffect } from 'react';
import { ScreenName } from '../App';
import { supabase } from '../src/lib/supabase-client';
import { useAppContext } from '../src/context/AppContext';

interface Props {
  navigate: (screen: ScreenName) => void;
  from?: ScreenName | null;
}

interface Unit {
  id: string;
  number: string;
  block: string;
}

const PackageEntry: React.FC<Props> = ({ navigate, from }) => {
  const { currentTenant, currentUser } = useAppContext();
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState('chilexpress');
  const [packageType, setPackageType] = useState('Caja');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (currentTenant) {
      const fetchUnits = async () => {
        const { data } = await supabase
          .from('units')
          .select('id, unit_number')
          .eq('tenant_id', currentTenant.id)
          .order('unit_number');
        if (data) setUnits(data);
      };
      fetchUnits();
    }
  }, [currentTenant]);

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

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("No se pudo acceder a la cámara.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    const MAX_WIDTH = 1200;
    
    // Scale preserving aspect ratio
    let width = videoRef.current.videoWidth;
    let height = videoRef.current.videoHeight;
    
    if (width > MAX_WIDTH) {
      height = height * (MAX_WIDTH / width);
      width = MAX_WIDTH;
    }

    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(videoRef.current, 0, 0, width, height);
    
    canvas.toBlob((blob) => {
      if (blob) {
        setPhotoBlob(blob);
        setPhotoPreview(URL.createObjectURL(blob));
      }
    }, 'image/jpeg', 0.8);
    
    stopCamera();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnitId || !currentTenant || !currentUser) return;
    
    setIsSubmitting(true);
    
    try {
      let finalPhotoUrl = null;

      if (photoBlob) {
        const fileExt = 'jpg';
        const fileName = `${Date.now()}-package.${fileExt}`;
        const filePath = `${currentTenant.id}/packages/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('evidence')
          .upload(filePath, photoBlob);
          
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('evidence').getPublicUrl(filePath);
        finalPhotoUrl = data.publicUrl;
      }

      const selectedUnit = units.find(u => u.id === selectedUnitId);

      const { error } = await supabase.from('parcels').insert({
        tenant_id: currentTenant.id,
        unit_id: selectedUnitId,
        department_number: selectedUnit?.unit_number || 'S/N',
        recipient_name: recipientName || 'Residente (Recibido por Conserjería)',
        package_type: packageType,
        status: 'Pendiente',
        received_by: currentUser.id,
        photo_url: finalPhotoUrl
      });

      if (error) {
        throw error;
      }

      // Trigger Push Notification seamlessly using API (Fire and Forget to not block UI)
      try {
         fetch((import.meta as any).env.VITE_BASE_URL + '/api/notify/parcel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               unitId: selectedUnitId,
               tenantId: currentTenant.id,
               title: '📦 ¡Tenes un nuevo paquete!',
               body: `Ha llegado una encomienda (${packageType}) para el depto ${selectedUnit?.unit_number}. Pasa por conserjería a retirarlo.`,
               packageType,
               unitNumber: selectedUnit?.unit_number,
               tenantName: currentTenant.name,
               receivedAt: new Date().toLocaleString()
            })
         }).catch(err => console.error('Push error:', err));
      } catch (pushErr) {
         console.error('Push error:', pushErr);
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
    const selectedUnitNum = units.find(u => u.id === selectedUnitId)?.unit_number || '';
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0A] p-6 text-center">
        <div className="w-32 h-32 bg-[#008080]/10 border border-[#008080]/20 rounded-full flex items-center justify-center mb-8 animate-bounce">
          <span className="material-symbols-outlined text-[64px] text-[#008080]">inventory_2</span>
        </div>
        <h2 className="text-4xl font-light text-white mb-3 tracking-tight">Encomienda Segura</h2>
        <p className="text-gray-400 mb-8 text-lg font-light">Se notificó exitosamente al residente del <span className="text-white font-medium">Depto {selectedUnitNum}</span>.</p>
        <div className="bg-[#111] border border-white/5 px-8 py-4 rounded-[2rem] shadow-2xl">
          <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-widest mb-1.5">Reg. Oficial de Tracking</p>
          <p className="text-ediflow-primary font-mono font-medium text-xl tracking-wider">{trackingCode || 'S/N'}</p>
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
                      value={selectedUnitId}
                      onChange={(e) => setSelectedUnitId(e.target.value)}
                      className="w-full h-14 bg-[#0A0A0A] text-white border border-white/5 rounded-xl px-4 appearance-none focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 focus:bg-[#141414] cursor-pointer transition-all text-sm font-medium tracking-tight"
                      required
                    >
                        <option value="" disabled className="text-gray-600">Seleccionar depto...</option>
                        {units.map((u) => (
                           <option key={u.id} value={u.id}>{u.unit_number}</option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <span className="material-symbols-outlined text-[20px]">unfold_more</span>
                    </div>
                </div>
            </div>

            {/* Recipient Name (Optional) */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                Nombre del Recibe (Opcional)
              </label>
              <input 
                 type="text" 
                 value={recipientName}
                 onChange={(e) => setRecipientName(e.target.value)}
                 placeholder="Ej. Juan Pérez"
                 className="w-full h-14 bg-[#0A0A0A] rounded-xl overflow-hidden border border-white/5 focus:border-ediflow-primary/50 focus:ring-1 focus:ring-ediflow-primary/50 transition-all text-white font-medium text-sm px-4 placeholder-gray-600 tracking-wide"
              />
            </div>
            
            {/* Tracking Code (Optional Text Input) */}
            <div className="space-y-2 md:col-span-2">
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

          {/* Package Type and Carrier Bento */}
          <div className="bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl hover:border-white/10 transition-all group grid md:grid-cols-2 gap-8">
               <div className="space-y-4">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1 block">Tipo de Paquete</label>
                 <div className="flex gap-4 border border-white/5 p-2 rounded-2xl bg-[#0A0A0A]">
                   {['Caja', 'Sobre', 'Delivery Food'].map(type => (
                     <button
                       key={type}
                       type="button"
                       onClick={() => setPackageType(type)}
                       className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-all ${
                         packageType === type 
                         ? 'bg-ediflow-primary text-black shadow-lg' 
                         : 'text-gray-500 hover:text-white hover:bg-white/5'
                       }`}
                     >
                       {type}
                     </button>
                   ))}
                 </div>
               </div>

               <div className="space-y-4">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1 block">Empresa Logística</label>
                 <div className="grid grid-cols-5 gap-2">
                    {[
                        { id: 'chilexpress', name: 'Chilexpress', icon: 'local_shipping' },
                        { id: 'starken', name: 'Starken', icon: 'inventory_2' },
                        { id: 'mercadolibre', name: 'Mercado Libre', icon: 'shopping_bag' },
                        { id: 'bluexpress', name: 'Bluexpress', icon: 'delivery_dining' },
                        { id: 'otro', name: 'Otro', icon: 'box' }
                    ].map(carrier => (
                        <button
                            key={carrier.id}
                            type="button"
                            title={carrier.name}
                            onClick={() => setSelectedCarrier(carrier.id)}
                            className={`flex items-center justify-center h-14 rounded-xl border transition-all active:scale-[0.98] ${
                                selectedCarrier === carrier.id 
                                ? 'bg-ediflow-primary/10 border-ediflow-primary/30 text-ediflow-primary shadow-[0_0_15px_rgba(0,174,239,0.1)]' 
                                : 'bg-[#0A0A0A] border-white/5 text-gray-500 hover:bg-[#141414] hover:text-gray-300'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">{carrier.icon}</span>
                        </button>
                    ))}
                 </div>
               </div>
          </div>

          {/* Context and Photo Bento */}
          <div className="bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl hover:border-white/10 transition-all group grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Camera Section */}
            <div className="space-y-2">
               <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1 block">Registro Fotográfico (Comprime a 1200px)</label>
               
               {!isCameraActive && !photoPreview && (
                  <button 
                     type="button"
                     onClick={startCamera}
                     className="w-full h-32 border-2 border-dashed border-white/10 hover:border-ediflow-primary/50 bg-[#0A0A0A] rounded-xl flex flex-col items-center justify-center text-gray-500 hover:text-ediflow-primary transition-all group/cam"
                  >
                     <span className="material-symbols-outlined text-[32px] mb-2 group-hover/cam:scale-110 transition-transform">add_a_photo</span>
                     <span className="text-xs font-bold uppercase tracking-widest">Tomar Foto</span>
                  </button>
               )}

               {isCameraActive && (
                 <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black border border-ediflow-primary">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={takePhoto}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg active:scale-95"
                    >
                      <div className="w-12 h-12 border-2 border-black/20 rounded-full"></div>
                    </button>
                    <button 
                      type="button"
                      onClick={stopCamera}
                      className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full flex flex-col items-center justify-center backdrop-blur-md"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                 </div>
               )}

               {photoPreview && !isCameraActive && (
                 <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-white/10">
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => {
                        setPhotoPreview(null);
                        setPhotoBlob(null);
                        startCamera();
                      }}
                      className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 rounded-full text-xs font-bold uppercase flex items-center gap-1 shadow-lg"
                    >
                      <span className="material-symbols-outlined text-[14px]">refresh</span> Retomar
                    </button>
                 </div>
               )}
            </div>
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
              disabled={!selectedUnitId || isSubmitting}
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
