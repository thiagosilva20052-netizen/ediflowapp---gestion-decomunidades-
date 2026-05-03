import React, { useState, useEffect } from 'react';
import { ScreenName } from '../App';
import { Html5Qrcode } from 'html5-qrcode';
import { useAppContext } from '../src/context/AppContext';
import { supabase } from '../src/lib/supabase-client';

interface Props {
  navigate: (screen: ScreenName) => void;
  from?: ScreenName | null;
}

const ManualVisitorRegistration: React.FC<Props> = ({ navigate, from }) => {
  const { currentTenant, currentUser } = useAppContext();
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
    if (!formData.name || !formData.rut || !formData.depto || !currentTenant) return;
    
    // Actualización optimista: cambiar UI inmediatamente sin esperar la BD
    setShowSuccess(true);
    
    setTimeout(() => {
      navigate(from || 'AccessControl');
    }, 2000);

    // Insertar logs de forma asíncrona en segundo plano
    const payload = {
        tenant_id: currentTenant.id,
        user_id: currentUser?.id,
        action: 'Ingreso Visita',
        details: `Recepción de visita: ${formData.name} a depto: ${formData.depto}`,
        module: 'access',
        severity: 'info'
    };
    supabase.from('audit_logs').insert(payload).catch(console.error);

    const logPayload = {
        tenant_id: currentTenant.id,
        type: 'visita',
        title: `Ingreso Visita ${formData.depto}`,
        description: `Rut: ${formData.rut}, Nombre: ${formData.name}, Motivo: ${formData.reason}`,
        user_id: currentUser?.id
    };
    supabase.from('logs').insert(logPayload).catch(console.error);
  };

    if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0A] p-6 text-center font-sans text-white">
        <div className="w-32 h-32 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-8 animate-bounce">
          <span className="material-symbols-outlined text-[64px] text-green-500">person_check</span>
        </div>
        <h2 className="text-4xl font-light text-white mb-3 tracking-tight">Acceso Autorizado</h2>
        <p className="text-gray-400 mb-8 text-lg font-light">La visita de <span className="text-white font-medium">{formData.name}</span> ha sido registrada.</p>
        <div className="bg-[#111] border border-white/10 px-8 py-5 rounded-[2rem] shadow-2xl">
          <p className="text-xs text-gray-500 uppercase font-semibold tracking-widest mb-2">Unidad Destino</p>
          <p className="text-ediflow-primary font-mono font-bold text-2xl tracking-wider">Depto {formData.depto}</p>
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
            onClick={() => navigate(from || 'AccessControl')}
            className="w-10 h-10 rounded-xl bg-[#111] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1A1A1A] active:scale-95 transition-all shadow-sm group relative"
          >
            <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform relative z-10">arrow_back</span>
          </button>
          <div>
            <h2 className="text-[10px] font-bold text-ediflow-primary uppercase tracking-[0.2em] mb-0.5">Control de Acceso</h2>
            <h1 className="text-lg md:text-xl font-medium text-white tracking-tight flex items-center gap-2">Registro de Visita</h1>
          </div>
        </div>

        <div className="flex flex-col items-end pointer-events-auto">
          <button 
            onClick={() => setIsScanning(true)}
            className="hidden md:flex items-center gap-2 bg-[#111] border border-white/5 text-gray-400 px-6 h-10 rounded-xl font-semibold text-xs uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-white active:scale-95 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-ediflow-primary/5 rounded-full blur-[20px] group-hover:bg-ediflow-primary/10 transition-colors pointer-events-none"></div>
            <span className="material-symbols-outlined text-[16px] group-hover:scale-110 transition-transform relative z-10">qr_code_scanner</span>
            <span className="relative z-10">Escanear Pase QR</span>
          </button>
          <button 
             onClick={() => setIsScanning(true)}
             className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-[#111] border border-white/5 text-gray-400 hover:bg-[#1A1A1A] hover:text-white transition-all shadow-lg active:scale-95 group relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-10 h-10 bg-ediflow-primary/5 rounded-full blur-[15px] group-hover:bg-ediflow-primary/10 transition-colors pointer-events-none"></div>
              <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform relative z-10">qr_code_scanner</span>
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
                 
                 <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-ediflow-primary rounded-tl-2xl z-10"></div>
                 <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-ediflow-primary rounded-tr-2xl z-10"></div>
                 <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-ediflow-primary rounded-bl-2xl z-10"></div>
                 <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-ediflow-primary rounded-br-2xl z-10"></div>
                 
                 <div className="absolute left-8 right-8 h-px bg-ediflow-primary shadow-[0_0_20px_rgba(0,174,239,1)] z-10 animate-[scan_2s_ease-in-out_infinite]"></div>
              </div>
            )}
            
            <div className="mt-12 text-center">
              <h3 className="text-white font-medium text-xl tracking-tight mb-2">Pase Digital QR</h3>
              <p className="text-gray-500 text-sm font-light">Enfoca el código QR enviado por el residente</p>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto no-scrollbar px-6 md:px-16 pt-8 pb-32 max-w-7xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
          
          {/* Section 1: Personal Data Bento */}
          <section className="bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl hover:border-white/10 transition-all group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-ediflow-primary/10 border border-ediflow-primary/20 flex items-center justify-center text-ediflow-primary shadow-inner">
                <span className="material-symbols-outlined text-[24px]">badge</span>
              </div>
              <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] group-hover:text-gray-300 transition-colors">Identificación</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                  Nombre Completo <span className="text-ediflow-primary ml-1">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ej. Juan Pérez"
                  className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white placeholder-gray-600 focus:outline-none focus:border-ediflow-primary/50 focus:bg-[#141414] focus:ring-1 focus:ring-ediflow-primary/50 transition-all text-sm font-medium"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                  RUT / Pasaporte <span className="text-ediflow-primary ml-1">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.rut}
                  onChange={(e) => setFormData({...formData, rut: e.target.value})}
                  placeholder="12.345.678-9"
                  className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white placeholder-gray-600 focus:outline-none focus:border-ediflow-primary/50 focus:bg-[#141414] focus:ring-1 focus:ring-ediflow-primary/50 transition-all text-sm font-mono tracking-widest"
                  required
                />
              </div>
            </div>
          </section>

          {/* Section 2: Destination Bento */}
          <section className="bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl hover:border-white/10 transition-all group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-inner">
                <span className="material-symbols-outlined text-[24px]">meeting_room</span>
              </div>
              <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] group-hover:text-gray-300 transition-colors">Destino y Autorización</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                  Unidad <span className="text-amber-500 ml-1">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.depto}
                  onChange={(e) => setFormData({...formData, depto: e.target.value})}
                  placeholder="Ej. 402"
                  className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:bg-[#141414] focus:ring-1 focus:ring-amber-500/50 transition-all text-xl font-medium tracking-tight"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                  Motivo de la Visita
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Familiar/Amigo', 'Delivery', 'Servicio Técnico', 'Otro'].map((reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setFormData({...formData, reason})}
                      className={`h-10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                        formData.reason === reason 
                          ? 'bg-amber-500 border-transparent text-black shadow-sm' 
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
          <section className="bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl hover:border-white/10 transition-all group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
                <span className="material-symbols-outlined text-[24px]">notes</span>
              </div>
              <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] group-hover:text-gray-300 transition-colors">Información Opcional</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                  Patente Vehículo
                </label>
                <input 
                  type="text" 
                  value={formData.vehiclePlate}
                  onChange={(e) => setFormData({...formData, vehiclePlate: e.target.value})}
                  placeholder="Ej. AB CD 12"
                  className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-[#141414] focus:ring-1 focus:ring-blue-500/50 transition-all font-mono tracking-widest uppercase text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                  Observaciones
                </label>
                <input 
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Detalles adicionales..."
                  className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-[#141414] focus:ring-1 focus:ring-blue-500/50 transition-all text-sm font-medium"
                />
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="pt-6 pb-12 flex flex-col items-center">
            <button 
              type="submit"
              disabled={isSubmitting || !formData.name || !formData.rut || !formData.depto}
              className="group w-full md:w-auto md:min-w-[400px] h-14 bg-ediflow-primary hover:bg-white active:scale-[0.98] text-black rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,174,239,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all disabled:opacity-50 disabled:grayscale disabled:hover:bg-ediflow-primary disabled:active:scale-100 disabled:cursor-not-allowed border border-transparent"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
              ) : (
                <>
                  Autorizar Ingreso
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </>
              )}
            </button>
            <p className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-4 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">lock</span> Registro Auditado Automáticamente
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

