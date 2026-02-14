import React, { useState, useEffect, useRef } from 'react';
import { ScreenName } from '../App';

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
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      if (isScanning) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setCameraError(null);
        } catch (err) {
          console.error("Error accessing camera:", err);
          setCameraError("No se pudo acceder a la cámara. Verifique los permisos.");
        }
      }
    };

    if (isScanning) {
      startCamera();
    }

    // Cleanup function to stop tracks when component unmounts or scanning stops
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isScanning]);

  // Simulate a scan success (since we don't have a QR decoder library installed)
  const handleSimulateScan = () => {
    setScanResult("Juan Pérez - Depto 402 (Acceso Autorizado)");
    setTimeout(() => {
      setIsScanning(false);
      setScanResult(null);
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#101c22]">
      
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
           <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-black" onClick={handleSimulateScan}>
              {cameraError ? (
                <div className="text-white text-center p-6">
                  <span className="material-symbols-outlined text-4xl text-red-500 mb-2">videocam_off</span>
                  <p>{cameraError}</p>
                </div>
              ) : (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
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
           <div className="h-24 bg-[#101c22] p-4 flex flex-col items-center justify-center border-t border-white/10">
              <p className="text-gray-400 text-sm">Escaneando código de visita...</p>
           </div>
        </div>
      )}


      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#101c22]/95 backdrop-blur-md border-b border-gray-800 p-4">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate('UserProfile')} className="w-10 h-10 rounded-full border border-ediflow-primary p-0.5 active:scale-90 transition-all">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" className="w-full h-full rounded-full object-cover" />
                </button>
                <div>
                    <h2 className="text-xs text-gray-400">Hola, Juan</h2>
                    <h1 className="text-lg font-bold text-white">Control de Acceso</h1>
                </div>
            </div>
            <span className="text-ediflow-primary font-bold">Ediflow</span>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-6 pb-24">
        {/* Search & Actions */}
        <div className="space-y-3">
            <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-3.5 text-gray-500">search</span>
                <input 
                    type="text" 
                    placeholder="Buscar depto (ej. 402, Torre A)..." 
                    className="w-full bg-[#1c262c] border-none rounded-xl py-3.5 pl-12 text-white placeholder-gray-500 focus:ring-2 focus:ring-ediflow-primary"
                />
            </div>
            
            <div className="grid grid-cols-[1fr_auto] gap-3">
                <button className="bg-[#1c262c] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 border border-white/5 hover:bg-[#25323a] active:scale-[0.98] transition-all">
                    <span className="material-symbols-outlined text-gray-400">edit_square</span>
                    Registro Manual
                </button>
                <button 
                    onClick={() => setIsScanning(true)}
                    className="aspect-square bg-ediflow-primary text-black rounded-xl flex items-center justify-center hover:bg-yellow-400 active:scale-[0.90] transition-all shadow-lg shadow-yellow-500/20"
                >
                    <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
                </button>
            </div>
        </div>

        {/* Expected */}
        <section>
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-white text-lg">Visitas Esperadas <span className="text-ediflow-primary text-sm ml-1">(3)</span></h3>
                <button className="text-ediflow-primary text-sm hover:text-white active:opacity-70 transition-all">Ver todas</button>
            </div>
            <div className="space-y-3">
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
            </div>
        </section>

        {/* History */}
         <section>
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-white text-lg">Historial de Hoy</h3>
                <button className="text-gray-500 active:scale-90 transition-all"><span className="material-symbols-outlined">filter_list</span></button>
            </div>
            <div className="bg-[#1c262c] rounded-xl border border-gray-800 divide-y divide-gray-800">
                <HistoryItem 
                    name="Pedro Soto (Delivery)" 
                    detail="Depto 201 • Rut Verificado" 
                    time="10:45 AM" 
                    status="INGRESADO" 
                    statusColor="bg-green-500/20 text-green-400 border-green-500/30"
                    icon="local_shipping"
                    iconColor="text-orange-400 bg-orange-500/20"
                />
                <HistoryItem 
                    name="Camila Soto" 
                    detail="Depto 1102 • Rut Verificado" 
                    time="09:30 AM" 
                    status="SALIDO" 
                    statusColor="bg-gray-700 text-gray-300 border-gray-600"
                    icon="person"
                    iconColor="text-blue-400 bg-blue-500/20"
                />
                 <HistoryItem 
                    name="Roberto Gómez" 
                    detail="Depto 405 • QR Code" 
                    time="08:15 AM" 
                    status="INGRESADO" 
                    statusColor="bg-green-500/20 text-green-400 border-green-500/30"
                    icon="person"
                    iconColor="text-blue-400 bg-blue-500/20"
                />
            </div>
         </section>
      </main>

      <nav className="fixed bottom-0 w-full max-w-[420px] bg-[#1c262c]/95 backdrop-blur border-t border-gray-800 px-2 pt-2 pb-6 z-50">
        <div className="flex justify-around">
            <NavButton icon="shield_person" label="Control" active />
            <NavButton icon="inventory_2" label="Encomiendas" onClick={() => navigate('PackageEntry')} />
            <NavButton icon="apartment" label="Espacios" onClick={() => navigate('ResidentServices')} />
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
      `}</style>
    </div>
  );
};

const VisitorCard = ({ name, rut, depto, time, img, initials }: any) => (
    <div className="bg-[#1c262c] p-4 rounded-xl border border-gray-800">
        <div className="flex justify-between items-start mb-4">
            <div className="flex gap-3 items-center">
                {img ? (
                    <img src={img} className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                    <div className="w-12 h-12 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-lg">{initials}</div>
                )}
                <div>
                    <h4 className="font-bold text-white">{name}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                        <span className="material-symbols-outlined text-[14px]">badge</span> {rut}
                    </div>
                </div>
            </div>
            <span className="bg-[#13a4ec]/10 text-[#13a4ec] px-2 py-1 rounded text-xs font-bold">Depto {depto}</span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-800">
            <span className="text-xs text-gray-400 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> Esperada: {time}</span>
            <button className="bg-[#13a4ec] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-400 active:scale-95 transition-all flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">login</span> Check-in
            </button>
        </div>
    </div>
);

const HistoryItem = ({ name, detail, time, status, statusColor, icon, iconColor }: any) => (
    <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconColor}`}>
                <span className="material-symbols-outlined text-lg">{icon}</span>
            </div>
            <div>
                <h4 className="font-bold text-white text-sm">{name}</h4>
                <p className="text-xs text-gray-400">{detail}</p>
            </div>
        </div>
        <div className="flex flex-col items-end gap-1">
            <span className="text-xs font-mono text-gray-500">{time}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusColor}`}>{status}</span>
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