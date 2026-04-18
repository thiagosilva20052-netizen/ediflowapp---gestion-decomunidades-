import React, { useState, useEffect, useRef } from 'react';
import { ScreenName } from '../App';
import { Html5Qrcode } from 'html5-qrcode';
import { Logo } from '../components/Logo';

interface Props {
  navigate: (screen: ScreenName) => void;
}

const AccessControl: React.FC<Props> = ({ navigate }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Handle Camera Stream
  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;

    if (isScanning) {
      // Small delay to ensure the DOM element is rendered
      const timer = setTimeout(() => {
        html5QrCode = new Html5Qrcode("qr-reader");
        html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {
            setScanResult(decodedText);
            if (html5QrCode) {
              try {
                html5QrCode.stop().catch(console.error);
              } catch (e) {
                console.error(e);
              }
            }
            setTimeout(() => {
              setIsScanning(false);
              setScanResult(null);
            }, 3000);
          },
          (errorMessage) => {
            // Ignore parse errors
          }
        ).catch((err) => {
          console.error("Error accessing camera:", err);
          setCameraError("No se pudo acceder a la cámara. Verifique los permisos.");
        });
      }, 100);

      return () => {
        clearTimeout(timer);
        if (html5QrCode) {
          try {
            html5QrCode.stop().catch(console.error);
          } catch (err) {
            console.error(err);
          }
        }
      };
    }
  }, [isScanning]);

  return (
    <div className="flex flex-col min-h-screen bg-black">
      
      {/* SCANNER OVERLAY */}
      {isScanning && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
           {/* Close Button */}
           <div className="absolute top-4 right-4 z-20">
              <button 
                onClick={() => setIsScanning(false)}
                className="w-12 h-12 bg-black/50 backdrop-blur-md rounded-full text-white flex items-center justify-center border border-white/20 active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
           </div>

           {/* Camera Feed */}
           <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-black">
              {cameraError ? (
                <div className="text-white text-center p-6">
                  <span className="material-symbols-outlined text-4xl text-red-500 mb-2">videocam_off</span>
                  <p>{cameraError}</p>
                </div>
              ) : (
                <div id="qr-reader" className="absolute inset-0 w-full h-full opacity-80" />
              )}

              {/* Scanning UI / Viewfinder */}
              <div className="relative z-10 w-64 h-64 border-2 border-ediflow-primary/50 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                  {/* Corner Markers */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-ediflow-primary rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-ediflow-primary rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-ediflow-primary rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-ediflow-primary rounded-br-lg"></div>
                  
                  {/* Scanning Laser Animation */}
                  <div className="absolute inset-x-0 h-1 bg-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>

                  {!scanResult && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-white/70 text-xs bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">Apunta al código QR</p>
                    </div>
                  )}
              </div>

              {/* Success Feedback Popup */}
              {scanResult && (
                 <div className="absolute bottom-32 z-20 animate-fade-in-up">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined">check</span>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-green-100">Lectura Exitosa</p>
                            <p className="font-bold text-sm">{scanResult}</p>
                        </div>
                    </div>
                 </div>
              )}
           </div>

           {/* Bottom Instructions */}
           <div className="h-24 bg-[#0A0A0A] p-4 flex flex-col items-center justify-center border-t border-white/10">
              <p className="text-gray-400 text-sm">Escaneando código de visita...</p>
           </div>
        </div>
      )}


      {/* Header */}
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-white/5 p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate('UserProfile')} className="w-10 h-10 rounded-full border border-[#00AEEF]/30 p-0.5 active:scale-90 transition-all">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" className="w-full h-full rounded-full object-cover" />
                </button>
                <div>
                    <h2 className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Hola, Juan</h2>
                    <h1 className="text-lg font-light text-white">Control de Acceso</h1>
                </div>
            </div>
            <Logo variant="icon" className="w-6 h-6" />
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24">
        
        {/* Left Column: Actions & Expected */}
        <div className="lg:col-span-7 space-y-6">
          {/* Search & Quick Actions */}
          <section className="bg-[#0A0A0A] p-5 rounded-[24px] border border-white/5">
            <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors text-xl">search</span>
                <input 
                  type="text" 
                  placeholder="Buscar residente o depto..." 
                  className="w-full bg-black border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:border-white/20 focus:ring-0 transition-all outline-none font-light"
                />
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => navigate('ManualVisitorRegistration')}
                  className="flex-1 bg-white hover:bg-gray-200 text-black font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all text-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">person_add</span>
                  Registro Manual
                </button>
                <button 
                  onClick={() => setIsScanning(true)}
                  className="w-12 bg-black border border-white/10 text-white rounded-xl flex items-center justify-center hover:border-[#00AEEF] hover:text-[#00AEEF] active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
                </button>
              </div>
            </div>
          </section>

          {/* Expected Visitors */}
          <section>
            <div className="flex justify-between items-end mb-4 px-1">
              <div>
                <h3 className="text-xl font-light text-white">Visitas Esperadas</h3>
                <p className="text-[11px] text-gray-500 font-medium tracking-wide">Para hoy</p>
              </div>
              <span className="bg-[#00AEEF]/10 text-[#00AEEF] px-3 py-1 rounded-full text-[10px] font-semibold border border-[#00AEEF]/20 uppercase tracking-widest">
                3 PENDIENTES
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <VisitorCard 
                name="María González" 
                rut="12.345.xxx-k" 
                depto="604" 
                time="10:00 - 12:00" 
                img="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100"
              />
              <VisitorCard 
                name="Juan Pablo Díaz" 
                rut="15.822.xxx-9" 
                depto="1402" 
                time="11:30" 
                initials="JP"
              />
              <VisitorCard 
                name="Soporte Técnico VTR" 
                rut="Empresa" 
                depto="201" 
                time="15:00" 
                icon="router"
              />
            </div>
          </section>
        </div>

        {/* Right Column: History & Stats */}
        <div className="lg:col-span-5 space-y-6">
          {/* Stats Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-[20px]">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Ingresos</p>
              <h4 className="text-2xl font-light text-white">24</h4>
            </div>
            <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-[20px]">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Salidas</p>
              <h4 className="text-2xl font-light text-white">18</h4>
            </div>
          </div>

          {/* History Feed */}
          <section className="bg-[#0A0A0A] rounded-[24px] border border-white/5 overflow-hidden flex flex-col h-full max-h-[500px]">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black">
              <h3 className="font-semibold text-gray-300 uppercase tracking-widest text-[10px]">Historial Reciente</h3>
              <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
              </button>
            </div>
            <div className="divide-y divide-white/5 overflow-y-auto no-scrollbar">
              <HistoryItem 
                name="Pedro Soto (Delivery)" 
                detail="Depto 201 • Rut Verificado" 
                time="10:45" 
                status="INGRESADO" 
                statusColor="bg-green-500/10 text-green-500 border-green-500/20"
                icon="local_shipping"
                iconColor="text-orange-400 bg-orange-500/10"
              />
              <HistoryItem 
                name="Camila Soto" 
                detail="Depto 1102 • Rut Verificado" 
                time="09:30" 
                status="SALIDO" 
                statusColor="bg-white/5 text-gray-400 border-white/10"
                icon="person"
                iconColor="text-blue-400 bg-blue-500/20"
              />
              <HistoryItem 
                name="Roberto Gómez" 
                detail="Depto 405 • QR Code" 
                time="08:15" 
                status="INGRESADO" 
                statusColor="bg-green-500/10 text-green-500 border-green-500/20"
                icon="person"
                iconColor="text-blue-400 bg-blue-500/20"
              />
              <HistoryItem 
                name="Ana María Rojas" 
                detail="Depto 803 • Invitado" 
                time="07:45" 
                status="SALIDO" 
                statusColor="bg-black text-gray-400 border-white/10"
                icon="person"
                iconColor="text-purple-400 bg-purple-500/10 border border-purple-500/20"
              />
            </div>
            <button className="p-3 text-[10px] font-semibold text-gray-500 hover:text-white transition-colors border-t border-white/5 bg-black uppercase tracking-widest text-center">
              Ver bitácora completa
            </button>
          </section>
        </div>
      </main>

      <nav className="fixed bottom-0 w-full bg-black/90 backdrop-blur-xl border-t border-white/5 px-6 pt-3 pb-6 z-50 flex justify-center">
        <div className="max-w-lg w-full flex justify-between items-center">
          <NavButton icon="shield_person" label="Control" active />
          <NavButton icon="inventory_2" label="Paquetes" onClick={() => navigate('PackageEntry')} />
          <NavButton icon="dashboard" label="Panel" onClick={() => navigate('ConciergeDashboard')} />
          <NavButton icon="manage_accounts" label="Perfil" onClick={() => navigate('UserProfile')} />
        </div>
      </nav>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        #qr-reader {
          width: 100%;
          height: 100%;
          border: none !important;
        }
        #qr-reader video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>
    </div>
  );
};

const VisitorCard = ({ name, rut, depto, time, img, initials, icon }: any) => (
    <div className="bg-[#0A0A0A] p-4 rounded-[20px] border border-white/5 hover:border-white/10 transition-all group">
        <div className="flex justify-between items-start mb-4">
            <div className="flex gap-3 items-center">
                {img ? (
                    <img src={img} className="w-10 h-10 rounded-lg object-cover border border-white/5" />
                ) : icon ? (
                    <div className="w-10 h-10 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-400">
                        <span className="material-symbols-outlined text-[20px]">{icon}</span>
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded-lg bg-purple-500/5 border border-purple-500/10 flex items-center justify-center text-purple-400 font-medium text-sm">{initials}</div>
                )}
                <div>
                    <h4 className="font-semibold text-white text-sm leading-tight">{name}</h4>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-1 font-medium">
                        <span className="material-symbols-outlined text-[12px]">badge</span> {rut}
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                <span className="bg-black text-white px-2 py-0.5 rounded-md text-[9px] font-semibold border border-white/5 uppercase tracking-widest">Depto {depto}</span>
            </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <div className="flex flex-col">
                <span className="text-[9px] font-semibold text-gray-600 uppercase tracking-widest mb-0.5">Llegada Estimada</span>
                <span className="text-xs text-gray-300 font-medium flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-gray-500 text-[14px]">schedule</span> 
                    {time}
                </span>
            </div>
            <button className="bg-white text-black text-[10px] font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 active:scale-95 transition-all flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">login</span> 
                CHECK-IN
            </button>
        </div>
    </div>
);

const HistoryItem = ({ name, detail, time, status, statusColor, icon, iconColor }: any) => (
    <div className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
        <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${iconColor}`}>
                <span className="material-symbols-outlined text-[18px]">{icon}</span>
            </div>
            <div>
                <h4 className="font-medium text-white text-xs leading-tight">{name}</h4>
                <p className="text-[10px] text-gray-500 font-light mt-0.5">{detail}</p>
            </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
            <span className="text-[9px] font-semibold text-gray-600 uppercase tracking-widest">{time}</span>
            <span className={`text-[8px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${statusColor}`}>{status}</span>
        </div>
    </div>
);

const NavButton = ({ icon, label, active = false, onClick }: { icon: string, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 w-full active:scale-90 transition-all ${active ? 'text-[#13a4ec]' : 'text-slate-400 hover:text-white'}`}>
    <span className={`material-symbols-outlined text-2xl ${active ? 'fill-current' : ''}`}>{icon}</span>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default AccessControl;