import React, { useState, useEffect } from 'react';
import { ScreenName } from '../App';
import { Html5Qrcode } from 'html5-qrcode';

interface Props {
  navigate: (screen: ScreenName) => void;
  from?: ScreenName | null;
}

const ManualVisitorRegistration: React.FC<Props> = ({ navigate, from }) => {
  const [formData, setFormData] = useState({
    name: '',
    rut: '',
    depto: '',
    reason: 'Familiar/Amigo',
    vehiclePlate: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // QR Scanner Logic
  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;

    if (isScanning) {
      const timer = setTimeout(() => {
        html5QrCode = new Html5Qrcode("qr-reader-manual");
        html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {
            // Success Feedback
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
            audio.play().catch(() => {});

            // Simulate parsing QR data
            try {
              const data = JSON.parse(decodedText);
              setFormData(prev => ({
                ...prev,
                name: data.name || prev.name,
                rut: data.rut || prev.rut,
                depto: data.depto || prev.depto,
                reason: data.reason || prev.reason
              }));
            } catch (e) {
              setFormData(prev => ({ ...prev, name: decodedText }));
            }
            
            if (html5QrCode) {
              html5QrCode.stop().then(() => {
                setIsScanning(false);
                // If we have enough data, maybe show a quick preview before auto-submitting
              }).catch(console.error);
            }
          },
          () => {}
        ).catch((err) => {
          console.error(err);
          setCameraError("No se pudo acceder a la cámara. Verifique los permisos.");
        });
      }, 100);

      return () => {
        clearTimeout(timer);
        if (html5QrCode) {
          html5QrCode.stop().catch(console.error);
        }
      };
    }
  }, [isScanning]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.rut || !formData.depto) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        navigate(from || 'AccessControl');
      }, 2000);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full bg-[#0A0A0A] p-6 text-center">
        <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <span className="material-symbols-outlined text-6xl text-purple-500">person_check</span>
        </div>
        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">¡Ingreso Registrado!</h2>
        <p className="text-gray-400 mb-8 text-lg">La visita de <span className="text-white font-bold">{formData.name}</span> ha sido autorizada y registrada.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-[#0A0A0A]">
      {/* QR SCANNER OVERLAY */}
      {isScanning && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="absolute top-6 right-6 z-20">
            <button 
              onClick={() => setIsScanning(false)}
              className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full text-white flex items-center justify-center border border-white/20 active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center bg-black">
            {cameraError ? (
              <div className="text-white text-center p-6">
                <span className="material-symbols-outlined text-4xl text-red-500 mb-2">videocam_off</span>
                <p className="font-bold">{cameraError}</p>
                <button onClick={() => setIsScanning(false)} className="mt-4 text-purple-500 font-black uppercase tracking-widest">Cerrar</button>
              </div>
            ) : (
              <div id="qr-reader-manual" className="absolute inset-0 w-full h-full" />
            )}
            
            <div className="relative z-10 w-64 h-64 border-2 border-purple-500/50 rounded-3xl overflow-hidden">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-purple-500 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-purple-500 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-purple-500 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-purple-500 rounded-br-lg"></div>
              <div className="absolute inset-x-0 h-1 bg-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
          
          <div className="p-8 bg-[#0A0A0A] text-center border-t border-white/10">
            <p className="text-white font-black uppercase tracking-widest text-sm">Escanee el código del residente</p>
            <p className="text-gray-500 text-xs mt-1">Los datos se completarán automáticamente</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(from || 'AccessControl')}
            className="w-10 h-10 rounded-full bg-[#141414] flex items-center justify-center text-white hover:bg-[#1F1F1F] active:scale-90 transition-all border border-white/5"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-lg font-black text-white uppercase tracking-tight">Registro de Visita</h1>
            <p className="text-[10px] font-bold text-purple-500 uppercase tracking-[0.2em]">Control de Acceso</p>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <button 
            onClick={() => setIsScanning(true)}
            className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-400 active:scale-95 transition-all shadow-lg shadow-purple-500/20"
          >
            <span className="material-symbols-outlined text-lg">qr_code_scanner</span>
            Escanear QR
          </button>
          <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mt-1 mr-1">Pase de Residente</p>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-4xl mx-auto w-full pb-32">
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Section 1: Personal Data */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-500 shadow-lg shadow-purple-500/10">
                <span className="material-symbols-outlined text-2xl">person</span>
              </div>
              <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Datos del Visitante</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nombre Completo *</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ej. Juan Pérez"
                  className="w-full bg-[#111111] border-2 border-white/5 rounded-2xl px-6 h-16 text-white placeholder-gray-700 focus:outline-none focus:border-purple-500/50 transition-all text-lg font-bold"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">RUT / Pasaporte *</label>
                <input 
                  type="text" 
                  value={formData.rut}
                  onChange={(e) => setFormData({...formData, rut: e.target.value})}
                  placeholder="Ej. 12.345.678-9"
                  className="w-full bg-[#111111] border-2 border-white/5 rounded-2xl px-6 h-16 text-white placeholder-gray-700 focus:outline-none focus:border-purple-500/50 transition-all text-lg font-mono font-bold"
                  required
                />
              </div>
            </div>
          </section>

          {/* Section 2: Destination */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-500 shadow-lg shadow-purple-500/10">
                <span className="material-symbols-outlined text-2xl">apartment</span>
              </div>
              <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Destino y Motivo</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Departamento *</label>
                <input 
                  type="text" 
                  value={formData.depto}
                  onChange={(e) => setFormData({...formData, depto: e.target.value})}
                  placeholder="Ej. 402"
                  className="w-full bg-[#111111] border-2 border-white/5 rounded-2xl px-6 h-20 text-white placeholder-gray-700 focus:outline-none focus:border-purple-500/50 transition-all text-2xl font-black"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Motivo de la Visita</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Familiar/Amigo', 'Delivery', 'Servicio Técnico', 'Otro'].map((reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setFormData({...formData, reason})}
                      className={`h-16 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all border-2 ${
                        formData.reason === reason 
                          ? 'bg-purple-500/10 border-purple-500 text-purple-500 shadow-xl shadow-purple-500/10' 
                          : 'bg-[#111111] border-transparent text-gray-600 hover:bg-[#1A1A1A] hover:text-gray-400'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Extra Info */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-500 shadow-lg shadow-purple-500/10">
                <span className="material-symbols-outlined text-2xl">more_horiz</span>
              </div>
              <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Información Adicional</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Patente Vehículo (Opcional)</label>
                <input 
                  type="text" 
                  value={formData.vehiclePlate}
                  onChange={(e) => setFormData({...formData, vehiclePlate: e.target.value})}
                  placeholder="Ej. AB CD 12"
                  className="w-full bg-[#111111] border-2 border-white/5 rounded-2xl px-6 h-16 text-white placeholder-gray-700 focus:outline-none focus:border-purple-500/50 transition-all text-lg uppercase font-black tracking-widest"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Observaciones (Opcional)</label>
                <textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Algún detalle importante..."
                  rows={1}
                  className="w-full bg-[#111111] border-2 border-white/5 rounded-2xl px-6 py-4 text-white placeholder-gray-700 focus:outline-none focus:border-purple-500/50 transition-all resize-none h-16 text-lg font-medium"
                />
              </div>
            </div>
          </section>


          {/* Submit Button */}
          <div className="pt-8">
            <button 
              type="submit"
              disabled={isSubmitting || !formData.name || !formData.rut || !formData.depto}
              className="w-full h-20 bg-purple-600 hover:bg-purple-500 active:scale-[0.98] text-white rounded-3xl font-black text-xl uppercase tracking-[0.1em] flex items-center justify-center gap-4 shadow-2xl shadow-purple-900/40 transition-all disabled:opacity-50 disabled:active:scale-100"
            >
              {isSubmitting ? (
                <span className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-3xl">how_to_reg</span>
                  Registrar Ingreso
                </>
              )}
            </button>
            <p className="text-center text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mt-6">
              El ingreso quedará registrado en el historial de visitas del edificio.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ManualVisitorRegistration;

const styles = `
  @keyframes scan {
    0%, 100% { top: 0%; }
    50% { top: 100%; }
  }
  #qr-reader-manual video {
    object-fit: cover !important;
    width: 100% !important;
    height: 100% !important;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

