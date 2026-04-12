import React, { useState, useEffect, useRef } from 'react';
import { ScreenName } from '../App';

interface Props {
  navigate: (screen: ScreenName) => void;
}

const RegisterNovelty: React.FC<Props> = ({ navigate }) => {
  const [type, setType] = useState('Mantenimiento');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('Media');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        navigate('ConciergeDashboard');
      }, 2000);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full bg-[#0A0A0A] p-6 text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-5xl text-green-500">check_circle</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Novedad Registrada</h2>
        <p className="text-gray-400 mb-8">La incidencia ha sido reportada exitosamente al administrador.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-[#0A0A0A]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/5 p-4 flex items-center gap-4">
        <button 
          onClick={() => navigate('ConciergeDashboard')}
          className="w-10 h-10 rounded-full bg-[#1F1F1F] flex items-center justify-center text-white hover:bg-[#292929] active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-white">Registrar Novedad</h1>
      </header>

      <main className="flex-1 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Novedad */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Tipo de Incidencia</label>
            <div className="grid grid-cols-2 gap-3">
              {['Mantenimiento', 'Seguridad', 'Convivencia', 'Otro'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition-all border ${
                    type === t 
                      ? 'bg-ediflow-primary/10 border-ediflow-primary text-ediflow-primary' 
                      : 'bg-[#141414] border-white/5 text-gray-400 hover:bg-[#1F1F1F]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Título */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Título</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Ascensor 2 no funciona"
              className="w-full bg-[#141414] border border-white/5 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-ediflow-primary transition-colors"
              required
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-400">Descripción Detallada</label>
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe el problema o situación..."
                rows={4}
                className={`w-full bg-[#141414] border rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none transition-colors resize-none ${
                  isRecording ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-ediflow-primary'
                }`}
                required
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

          {/* Adjuntar Foto */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Evidencia (Opcional)</label>
            <button type="button" className="w-full border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-gray-500 hover:bg-[#141414] hover:border-white/20 transition-all">
              <span className="material-symbols-outlined text-3xl">add_a_photo</span>
              <span className="text-sm font-medium">Tomar o subir foto</span>
            </button>
          </div>

          {/* Nivel de Urgencia */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Nivel de Urgencia</label>
            <div className="flex gap-3">
              {[
                { level: 'Baja', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/30' },
                { level: 'Media', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
                { level: 'Alta', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' }
              ].map((u) => (
                <button
                  key={u.level}
                  type="button"
                  onClick={() => setUrgency(u.level)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border ${
                    urgency === u.level 
                      ? `${u.bg} ${u.border} ${u.color}` 
                      : 'bg-[#141414] border-white/5 text-gray-500 hover:bg-[#1F1F1F]'
                  }`}
                >
                  {u.level}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 pb-8">
            <button 
              type="submit"
              disabled={isSubmitting || !title || !description}
              className="w-full bg-ediflow-primary text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-yellow-500/20"
            >
              {isSubmitting ? (
                <span className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
              ) : (
                <>
                  <span className="material-symbols-outlined">send</span>
                  Enviar Reporte
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default RegisterNovelty;
