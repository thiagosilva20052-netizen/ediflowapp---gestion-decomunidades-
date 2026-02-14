import React from 'react';
import { ScreenName } from '../App';

interface Props {
  navigate: (screen: ScreenName) => void;
}

const QRCodeScreen: React.FC<Props> = ({ navigate }) => {
  return (
    <div className="flex flex-col min-h-full bg-ediflow-dark">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-ediflow-dark border-b border-white/10 sticky top-0 z-10">
            <button onClick={() => navigate('ResidentServices')} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-all active:scale-90">
                <span className="material-symbols-outlined text-white">arrow_back</span>
            </button>
            <h1 className="text-lg font-bold text-white">Código de Retiro</h1>
            <div className="w-10"></div>
        </header>

        <main className="flex-1 flex flex-col items-center p-6 w-full max-w-sm mx-auto">
            {/* QR Card */}
            <div className="w-full bg-[#1E1E1E] rounded-2xl p-8 flex flex-col items-center border border-white/5 shadow-2xl">
                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-white">Tu Código QR</h2>
                    <p className="text-sm text-gray-400">Muestra este código al conserje</p>
                </div>

                <div className="bg-white p-4 rounded-xl w-full aspect-square flex items-center justify-center mb-6 shadow-inner">
                    <div className="w-full h-full bg-black/5 relative overflow-hidden rounded grid grid-cols-7 grid-rows-7 gap-1 p-2">
                        {/* Fake QR Pattern */}
                        <div className="col-span-3 row-span-3 bg-black rounded-sm"></div>
                        <div className="col-span-1"></div>
                        <div className="col-span-3 row-span-3 bg-black rounded-sm"></div>
                        <div className="col-start-1 row-start-5 col-span-3 row-span-3 bg-black rounded-sm"></div>
                        <div className="col-start-5 row-start-5 bg-black rounded-sm"></div>
                        <div className="col-start-6 row-start-6 bg-black rounded-sm"></div>
                        <div className="col-start-7 row-start-5 bg-black rounded-sm"></div>
                        <div className="col-start-5 row-start-7 bg-black rounded-sm"></div>
                    </div>
                </div>

                <div className="w-full space-y-3 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Departamento</span>
                        <span className="text-white font-bold text-lg">402</span>
                    </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Seguimiento</span>
                        <span className="text-white font-mono">9938210023</span>
                    </div>
                </div>
            </div>

            {/* Warning */}
            <div className="mt-6 w-full flex gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <span className="material-symbols-outlined text-yellow-500">shield_lock</span>
                <div>
                    <p className="text-white font-bold text-sm">Aviso de Seguridad</p>
                    <p className="text-white/60 text-xs mt-1">Este código es de un solo uso y expirará tras el escaneo.</p>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-8 w-full flex flex-col gap-3">
                <button className="w-full bg-ediflow-primary text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 active:scale-[0.98] transition-all">
                    <span className="material-symbols-outlined">download</span>
                    Descargar QR
                </button>
                 <button className="w-full bg-transparent border border-white/20 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 active:scale-[0.98] transition-all">
                    <span className="material-symbols-outlined">share</span>
                    Compartir
                </button>
            </div>
        </main>
    </div>
  );
};

export default QRCodeScreen;