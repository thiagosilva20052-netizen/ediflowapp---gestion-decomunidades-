import React, { useState, useRef, useEffect } from 'react';
import { ScreenName } from '../App';

interface Props {
  navigate: (screen: ScreenName) => void;
  from?: ScreenName | null;
}

const NovedadEntry: React.FC<Props> = ({ navigate, from }) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('mantenimiento');
  const [priority, setPriority] = useState('media');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  
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
            setDescription(prev => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + newFinalTranscript);
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

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPhoto(imageUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        navigate(from || 'ConciergeDashboard');
      }, 2000);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full bg-[#0A0A0A] p-6 text-center">
        <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <span className="material-symbols-outlined text-6xl text-amber-500">warning</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Novedad Registrada</h2>
        <p className="text-gray-400 mb-8">El evento ha sido guardado exitosamente en la bitácora digital.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-[#0A0A0A]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/5 p-4 flex items-center gap-4">
        <button 
          onClick={() => navigate(from || 'ConciergeDashboard')}
          className="w-10 h-10 rounded-full bg-[#141414] flex items-center justify-center text-white hover:bg-[#1F1F1F] active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-white">Registrar Novedad</h1>
      </header>

      <main className="flex-1 p-6 pb-24">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Category & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Categoría *</label>
              <div className="relative">
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#141414] text-white border border-white/5 rounded-xl h-14 px-4 appearance-none focus:ring-1 focus:ring-amber-500 cursor-pointer transition-colors"
                >
                  <option value="mantenimiento">Mantenimiento / Falla</option>
                  <option value="seguridad">Seguridad / Incidente</option>
                  <option value="limpieza">Limpieza / Aseo</option>
                  <option value="administrativo">Administrativo</option>
                  <option value="emergencia">Emergencia</option>
                  <option value="otro">Otro</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Prioridad *</label>
              <div className="flex gap-2">
                {[
                  { id: 'baja', label: 'Baja', color: 'bg-green-500/10 border-green-500/20 text-green-500' },
                  { id: 'media', label: 'Media', color: 'bg-amber-500/10 border-amber-500/20 text-amber-500' },
                  { id: 'alta', label: 'Alta', color: 'bg-red-500/10 border-red-500/20 text-red-500' }
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id)}
                    className={`flex-1 h-14 rounded-xl border-2 font-bold text-sm transition-all active:scale-95 ${
                      priority === p.id ? p.color.replace('border-red-500/20', 'border-red-500').replace('border-amber-500/20', 'border-amber-500').replace('border-green-500/20', 'border-green-500') : 'bg-[#141414] border-transparent text-gray-500'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Ubicación / Lugar</label>
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej. Ascensor 2, Estacionamiento -1, Pasillo Piso 5..."
              className="w-full bg-[#141414] border border-white/5 rounded-xl px-4 h-14 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Photo Evidence */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-400">Evidencia Fotográfica (Opcional)</label>
            <div className="flex gap-4 items-center">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 rounded-xl bg-[#141414] border-2 border-dashed border-[#333333] hover:border-amber-500 hover:bg-[#1F1F1F] transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group active:scale-95 overflow-hidden relative"
              >
                {photo ? (
                  <>
                    <img src={photo} alt="Evidencia" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-white">edit</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-[#292929] group-hover:bg-amber-500 group-hover:text-black flex items-center justify-center text-white/50 transition-colors">
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
                Captura una imagen del problema o evento para un reporte más detallado.
              </p>
            </div>
          </div>

          {/* Description with Voice */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-400">Descripción de la Novedad *</label>
              <button
                type="button"
                onClick={toggleRecording}
                className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full transition-all active:scale-95 ${
                  isRecording 
                    ? 'bg-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse' 
                    : 'bg-[#1F1F1F] text-amber-500 border border-amber-500/30 hover:bg-amber-500/10'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{isRecording ? 'mic' : 'mic_none'}</span>
                {isRecording ? 'Escuchando...' : 'Dictar por voz'}
              </button>
            </div>
            
            <div className="relative">
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe detalladamente lo ocurrido..."
                rows={6}
                className={`w-full bg-[#141414] border rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none transition-colors resize-none text-lg ${
                  isRecording ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-amber-500'
                }`}
                required
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

          <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-2xl flex gap-4 items-start">
            <span className="material-symbols-outlined text-amber-500 mt-0.5">info</span>
            <p className="text-sm text-amber-200/60 leading-relaxed">
              <span className="font-bold text-amber-500 uppercase text-[10px] tracking-widest block mb-1">Aviso Importante</span>
              Este registro se guardará permanentemente en la bitácora digital del edificio y será notificado automáticamente a la administración.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button 
              type="submit"
              disabled={isSubmitting || !description}
              className="w-full h-16 bg-amber-500 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-amber-400 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 shadow-xl shadow-amber-900/20 text-lg uppercase tracking-widest"
            >
              {isSubmitting ? (
                <span className="w-7 h-7 border-3 border-black/20 border-t-black rounded-full animate-spin"></span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-2xl">save</span>
                  Guardar en Bitácora
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default NovedadEntry;

