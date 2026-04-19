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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0A] p-6 text-center font-sans text-white">
        <div className="w-32 h-32 bg-[#A855F7]/10 border border-[#A855F7]/20 rounded-full flex items-center justify-center mb-8 animate-bounce">
          <span className="material-symbols-outlined text-[64px] text-[#A855F7]">person_check</span>
        </div>
        <h2 className="text-4xl font-light text-white mb-3 tracking-tight">Acceso Autorizado</h2>
        <p className="text-gray-400 mb-8 text-lg font-light">La visita de <span className="text-white font-medium">{formData.name}</span> ha sido registrada.</p>
        <div className="bg-[#111] border border-white/5 px-8 py-4 rounded-[2rem] shadow-2xl">
          <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-widest mb-1.5">Unidad Destino</p>
          <p className="text-[#A855F7] font-mono font-medium text-xl tracking-wider">Depto {formData.depto}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] font-sans text-white overflow-hidden">
      {/* Premium Header */}
      <header className="px-6 md:px-16 pt-8 md:pt-16 pb-6 lg:pb-8 flex items-center justify-between sticky top-0 z-30 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-transparent pointer-events-none md:bg-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <button 
            onClick={() => navigate(from || 'AccessControl')}
            className="w-12 h-12 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 active:scale-95 transition-all shadow-lg"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-2xl md:text-4xl font-light tracking-tight text-white leading-none">Registro de Visita</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1.5 uppercase font-semibold tracking-widest">Control de Acceso</p>
          </div>
        </div>

        <div className="flex flex-col items-end pointer-events-auto">
          <button 
            onClick={() => setIsScanning(true)}
            className="hidden md:flex items-center gap-2 bg-[#A855F7]/10 border border-[#A855F7]/20 text-[#A855F7] px-6 h-12 rounded-full font-semibold text-sm hover:bg-[#A855F7] hover:text-white active:scale-95 transition-all shadow-[0_0_20px_rgba(168,85,247,0.15)]"
          >
            <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
            Escanear Pase QR
          </button>
          <button 
             onClick={() => setIsScanning(true)}
             className="md:hidden w-12 h-12 flex items-center justify-center rounded-full bg-[#A855F7]/10 border border-[#A855F7]/20 text-[#A855F7] hover:bg-[#A855F7] hover:text-white transition-all shadow-lg"
          >
              <span className="material-symbols-outlined">qr_code_scanner</span>
          </button>
        </div>
      </header>

      {/* QR SCANNER FULLSCREEN OVERLAY */}
      {isScanning && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl flex flex-col font-sans pointer-events-auto">
          <div className="absolute top-8 right-8 z-20">
            <button 
              onClick={() => setIsScanning(false)}
              className="w-12 h-12 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-white flex items-center justify-center active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="relative flex-1 flex flex-col items-center justify-center p-6">
            {cameraError ? (
              <div className="text-center bg-[#111] p-8 rounded-[2rem] border border-white/10 max-w-sm w-full">
                <span className="material-symbols-outlined text-5xl text-red-500 mb-4">videocam_off</span>
                <p className="font-light text-white mb-6 leading-relaxed">{cameraError}</p>
                <button onClick={() => setIsScanning(false)} className="w-full bg-white/5 border border-white/10 py-3 rounded-xl hover:bg-white/10 transition-all font-medium text-sm">Cerrar</button>
              </div>
            ) : (
              <div className="w-full max-w-md aspect-square relative bg-[#111] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
                 <div id="qr-reader-manual" className="absolute inset-0 w-full h-full object-cover" />
                 
                 <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-[#A855F7] rounded-tl-2xl z-10"></div>
                 <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-[#A855F7] rounded-tr-2xl z-10"></div>
                 <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-[#A855F7] rounded-bl-2xl z-10"></div>
                 <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-[#A855F7] rounded-br-2xl z-10"></div>
                 
                 <div className="absolute left-8 right-8 h-px bg-[#A855F7] shadow-[0_0_20px_rgba(168,85,247,1)] z-10 animate-[scan_2s_ease-in-out_infinite]"></div>
              </div>
            )}
            
            <div className="mt-12 text-center">
              <h3 className="text-white font-medium text-xl tracking-tight mb-2">Pase Digital QR</h3>
              <p className="text-gray-500 text-sm font-light">Enfoca el código QR enviado por el residente</p>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto no-scrollbar px-6 md:px-16 pb-32 max-w-4xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Personal Data Bento */}
          <section className="bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-xl hover:border-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                <span className="material-symbols-outlined text-[18px]">badge</span>
              </div>
              <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Identificación</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-2 flex items-center gap-2">
                  Nombre Completo <span className="text-[#A855F7]">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ej. Juan Pérez"
                  className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl px-5 h-14 text-white placeholder-gray-700 focus:outline-none focus:border-[#A855F7]/50 focus:shadow-[0_0_15px_rgba(168,85,247,0.1)] transition-all text-base font-medium"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-2 flex items-center gap-2">
                  RUT / Pasaporte <span className="text-[#A855F7]">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.rut}
                  onChange={(e) => setFormData({...formData, rut: e.target.value})}
                  placeholder="Ej. 12.345.678-9"
                  className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl px-5 h-14 text-white placeholder-gray-700 focus:outline-none focus:border-[#A855F7]/50 focus:shadow-[0_0_15px_rgba(168,85,247,0.1)] transition-all text-base font-mono tracking-wide"
                  required
                />
              </div>
            </div>
          </section>

          {/* Section 2: Destination Bento */}
          <section className="bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-xl hover:border-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                <span className="material-symbols-outlined text-[18px]">meeting_room</span>
              </div>
              <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Destino y Autorización</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-2 flex items-center gap-2">
                  Unidad <span className="text-[#A855F7]">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.depto}
                  onChange={(e) => setFormData({...formData, depto: e.target.value})}
                  placeholder="Ej. 402"
                  className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl px-5 h-16 text-white placeholder-gray-700 focus:outline-none focus:border-[#A855F7]/50 focus:shadow-[0_0_15px_rgba(168,85,247,0.1)] transition-all text-xl font-medium tracking-tight"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-2 flex items-center gap-2">
                  Motivo de la Visita
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Familiar/Amigo', 'Delivery', 'Servicio Técnico', 'Otro'].map((reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setFormData({...formData, reason})}
                      className={`h-12 rounded-xl text-[10px] font-semibold uppercase tracking-widest transition-all border ${
                        formData.reason === reason 
                          ? 'bg-[#A855F7]/10 border-[#A855F7]/30 text-white shadow-sm' 
                          : 'bg-[#0A0A0A] border-white/5 text-gray-500 hover:bg-white/5 hover:text-gray-300'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Extra Info Bento */}
          <section className="bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-xl hover:border-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                <span className="material-symbols-outlined text-[18px]">notes</span>
              </div>
              <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Información Adicional (Opcional)</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-2 flex items-center gap-2">
                  Patente Vehículo
                </label>
                <input 
                  type="text" 
                  value={formData.vehiclePlate}
                  onChange={(e) => setFormData({...formData, vehiclePlate: e.target.value})}
                  placeholder="Ej. AB CD 12"
                  className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl px-5 h-14 text-white placeholder-gray-700 focus:outline-none focus:border-[#A855F7]/50 transition-all font-mono tracking-widest uppercase text-sm"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-2 flex items-center gap-2">
                  Observaciones Rápidas
                </label>
                <input 
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Detalles del ingreso..."
                  className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl px-5 h-14 text-white placeholder-gray-700 focus:outline-none focus:border-[#A855F7]/50 transition-all text-sm font-light"
                />
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="pt-8 flex flex-col items-center">
            <button 
              type="submit"
              disabled={isSubmitting || !formData.name || !formData.rut || !formData.depto}
              className="w-full md:w-auto md:min-w-[400px] h-16 md:h-14 bg-[#A855F7] hover:bg-purple-500 active:scale-[0.98] text-white rounded-2xl font-semibold text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all disabled:opacity-50 disabled:grayscale disabled:hover:bg-[#A855F7] disabled:active:scale-100 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                  Autorizar Ingreso
                </>
              )}
            </button>
            <p className="text-center text-[10px] font-semibold text-gray-500 uppercase tracking-widest mt-4">
              Registro auditado oficialmente en sistema.
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

