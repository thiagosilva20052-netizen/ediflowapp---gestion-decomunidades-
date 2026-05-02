import React, { useState, useRef, useEffect } from 'react';
import { ScreenName } from '../App';
import { useAppContext } from '../src/context/AppContext';

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

  const { currentUser, currentTenant } = useAppContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !currentTenant || !currentUser) return;
    
    setIsSubmitting(true);
    try {
      const { supabase } = await import('../src/lib/supabase-client');
      // type: 'visita', 'encomienda', 'incidente', 'mantenimiento', 'turno'
      // mapped from local 'category'
      const { error } = await supabase.from('logs').insert({
         tenant_id: currentTenant.id,
         type: category === 'mantenimiento' ? 'mantenimiento' : category === 'limpieza' ? 'incidente' : category === 'emergencia' ? 'incidente' : category === 'administrativo' ? 'turno' : 'incidente',
         title: `${category.toUpperCase()} - Prioridad ${priority.toUpperCase()}`,
         description: `${location ? `[${location}] ` : ''}${description}`,
         created_by: currentUser.id,
         status: 'active'
      });
      if (error) throw error;
      
      setShowSuccess(true);
      setTimeout(() => {
        navigate(from || 'ConciergeDashboard');
      }, 2000);
    } catch(err) {
      console.error(err);
      alert('Error guardando en bitacora');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full bg-[#0A0A0A] p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent"></div>
        <div className="w-32 h-32 bg-[#111] border border-amber-500/30 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(245,158,11,0.2)] animate-pulse-soft relative z-10">
          <span className="material-symbols-outlined text-6xl text-amber-500">task_alt</span>
        </div>
        <h2 className="text-3xl font-light tracking-tight text-white mb-3 relative z-10">Novedad Registrada.</h2>
        <p className="text-sm font-medium tracking-wide text-gray-500 mb-8 max-w-xs relative z-10">El evento ha sido guardado exitosamente y reportado en el centro de operaciones.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-[#0A0A0A]">
      {/* Premium Header */}
      <header className="sticky top-0 z-20 bg-[#0A0A0A]/90 backdrop-blur-3xl border-b border-white/5 p-4 md:px-8 py-5 flex items-center gap-4 shadow-sm">
        <button 
          onClick={() => navigate(from || 'ConciergeDashboard')}
          className="w-10 h-10 rounded-xl bg-[#111] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1A1A1A] active:scale-95 transition-all shadow-sm group"
        >
          <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
        </button>
        <div className="flex-1">
            <h2 className="text-[10px] font-bold text-[#00AEEF] uppercase tracking-[0.2em] mb-0.5">Bitácora Digital</h2>
            <h1 className="text-lg md:text-xl font-medium text-white tracking-tight flex items-center gap-2">
                Registrar Novedad
            </h1>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#00AEEF]/10 border border-[#00AEEF]/20 flex items-center justify-center text-[#00AEEF] shadow-inner">
            <span className="material-symbols-outlined text-[20px]">edit_document</span>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10 pb-24 max-w-4xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Category & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Categoría *</label>
              <div className="relative group">
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#111] text-white border border-white/10 rounded-2xl h-14 px-5 appearance-none focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500/50 cursor-pointer transition-all hover:border-white/20 shadow-inner group-hover:bg-[#141414]"
                >
                  <option value="mantenimiento">Mantenimiento / Falla</option>
                  <option value="seguridad">Seguridad / Incidente</option>
                  <option value="limpieza">Limpieza / Aseo</option>
                  <option value="administrativo">Administrativo</option>
                  <option value="emergencia">Emergencia</option>
                  <option value="otro">Otro</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Prioridad *</label>
              <div className="flex gap-3">
                {[
                  { id: 'baja', label: 'Baja', color: 'bg-green-500/10 border-green-500/30 text-green-500' },
                  { id: 'media', label: 'Media', color: 'bg-amber-500/10 border-amber-500/30 text-amber-500' },
                  { id: 'alta', label: 'Alta', color: 'bg-red-500/10 border-red-500/30 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' }
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id)}
                    className={`flex-1 h-14 rounded-2xl border font-bold text-xs uppercase tracking-wider transition-all active:scale-95 ${
                      priority === p.id 
                        ? p.color.replace('border-red-500/30', 'border-red-500').replace('border-amber-500/30', 'border-amber-500').replace('border-green-500/30', 'border-green-500') 
                        : 'bg-[#111] border-white/5 text-gray-500 hover:bg-[#141414] hover:text-gray-300 hover:border-white/10'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Ubicación / Lugar</label>
            <div className="relative group">
               <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-500 transition-colors">pin_drop</span>
               <input 
                 type="text" 
                 value={location}
                 onChange={(e) => setLocation(e.target.value)}
                 placeholder="Ej. Ascensor 2, Estacionamiento -1, Pasillo Piso 5..."
                 className="w-full bg-[#111] border border-white/10 rounded-2xl pl-12 pr-5 h-14 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500/50 transition-all shadow-inner hover:border-white/20 group-hover:bg-[#141414] focus:bg-[#141414]"
               />
            </div>
          </div>

          {/* Photo Evidence */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Evidencia Fotográfica (Opcional)</label>
            <div className="flex gap-6 items-center bg-[#111] p-6 rounded-[2rem] border border-white/5 shadow-inner">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 rounded-[1.5rem] bg-[#0A0A0A] border-2 border-dashed border-white/10 hover:border-amber-500 hover:bg-[#141414] transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group active:scale-95 overflow-hidden relative shadow-lg"
              >
                {photo ? (
                  <>
                    <img src={photo} alt="Evidencia" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                      <span className="material-symbols-outlined text-white text-[32px]">edit</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-[#111] border border-white/5 group-hover:bg-amber-500/10 group-hover:border-amber-500/30 group-hover:text-amber-500 flex items-center justify-center text-gray-500 transition-all shadow-inner">
                      <span className="material-symbols-outlined text-[24px]">photo_camera</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-amber-500 transition-colors">Tomar Foto</span>
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
              <div className="flex-1">
                <h4 className="text-sm font-medium text-white mb-1">Adjuntar evidencia visual</h4>
                <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
                  Captura una imagen del problema o evento para un reporte más detallado y rápido.
                </p>
              </div>
            </div>
          </div>

          {/* Description with Voice */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Descripción de la Novedad *</label>
              <button
                type="button"
                onClick={toggleRecording}
                className={`flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-lg transition-all active:scale-95 border ${
                  isRecording 
                    ? 'bg-red-500/20 text-red-500 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse' 
                    : 'bg-[#111] text-amber-500 border-amber-500/30 hover:bg-amber-500/10 hover:border-amber-500/50'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{isRecording ? 'mic' : 'mic_none'}</span>
                {isRecording ? 'Escuchando...' : 'Dictar por voz'}
              </button>
            </div>
            
            <div className="relative group">
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe detalladamente lo ocurrido..."
                rows={6}
                className={`w-full bg-[#111] rounded-[2rem] px-6 py-6 text-white placeholder-gray-600 focus:outline-none transition-all resize-none text-base border shadow-inner group-hover:bg-[#141414] focus:bg-[#141414] ${
                  isRecording ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-amber-500/50 hover:border-white/20 focus:ring-1 focus:ring-amber-500'
                }`}
                required
              />
              {isRecording && (
                <div className="absolute bottom-6 right-6 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-[1.5rem] flex gap-4 items-start shadow-inner my-8">
            <span className="material-symbols-outlined text-amber-500 mt-0.5">info</span>
            <p className="text-sm text-amber-200/60 leading-relaxed">
              <span className="font-bold text-amber-500 uppercase text-[10px] tracking-[0.2em] block mb-1">Aviso Importante</span>
              Este registro se guardará permanentemente en la bitácora digital del edificio y será notificado automáticamente a la administración.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button 
              type="submit"
              disabled={isSubmitting || !description}
              className="w-full h-16 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black py-4 rounded-[1.5rem] flex items-center justify-center gap-3 hover:from-amber-500 hover:to-amber-400 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] text-[13px] uppercase tracking-[0.2em] group relative overflow-hidden"
            >
              {/* Shine effect on hover */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine"></div>

              {isSubmitting ? (
                <span className="w-6 h-6 border-[3px] border-black/20 border-t-black rounded-full animate-spin"></span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">save</span>
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

