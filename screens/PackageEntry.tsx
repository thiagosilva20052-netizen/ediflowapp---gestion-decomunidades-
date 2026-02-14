import React, { useState } from 'react';
import { ScreenName } from '../App';

interface Props {
  navigate: (screen: ScreenName) => void;
}

const PackageEntry: React.FC<Props> = ({ navigate }) => {
  const [selectedCarrier, setSelectedCarrier] = useState('chilexpress');

  return (
    <div className="flex flex-col min-h-full bg-[#181811]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#181811]/95 backdrop-blur-sm px-4 py-4 flex items-center border-b border-white/5">
        <button 
          onClick={() => navigate('ConciergeDashboard')}
          className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-all active:scale-90"
        >
          <span className="material-symbols-outlined text-white">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold text-white flex-1 text-center pr-10">Confirmación de Ingreso</h2>
      </div>

      <div className="p-6 flex flex-col gap-6">
        {/* Progress */}
        <div className="flex gap-2 mb-2">
          <div className="h-1 flex-1 rounded-full bg-ediflow-primary"></div>
          <div className="h-1 flex-1 rounded-full bg-ediflow-primary"></div>
          <div className="h-1 flex-1 rounded-full bg-white/20"></div>
        </div>

        {/* Tracking Code */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white">Código de Seguimiento</label>
          <div className="flex w-full items-center bg-[#24241A] rounded-xl overflow-hidden border border-white/5 focus-within:border-ediflow-primary/50 transition-colors">
            <input 
              type="text" 
              readOnly 
              value="9283740291" 
              className="flex-1 bg-transparent border-none text-white font-mono text-lg px-4 h-14 focus:ring-0"
            />
            <div className="px-4 text-[#D1D1B0]">
              <span className="material-symbols-outlined text-2xl">check_circle</span>
            </div>
          </div>
          <p className="text-xs text-[#8A8A60]">Escaneado correctamente</p>
        </div>

        {/* Department Selector */}
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white">Departamento</label>
            <div className="relative">
                <select className="w-full bg-[#24241A] text-white border-none rounded-xl h-14 px-4 appearance-none focus:ring-2 focus:ring-ediflow-primary cursor-pointer">
                    <option value="">Seleccionar unidad...</option>
                    <option value="402">402 - Torre A</option>
                    <option value="101">101 - Torre B</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                    <span className="material-symbols-outlined">expand_more</span>
                </div>
            </div>
        </div>

        {/* Carrier Selection */}
        <div className="flex flex-col gap-3">
             <label className="text-sm font-medium text-white">Empresa de Transporte</label>
             <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {[
                    { id: 'chilexpress', name: 'Chilexpress', icon: 'local_shipping' },
                    { id: 'starken', name: 'Starken', icon: 'package_2' },
                    { id: 'mercadolibre', name: 'Mercado Libre', icon: 'shopping_bag' }
                ].map(carrier => (
                    <button
                        key={carrier.id}
                        onClick={() => setSelectedCarrier(carrier.id)}
                        className={`flex items-center gap-2 px-4 h-12 rounded-lg border-2 transition-all whitespace-nowrap active:scale-95 ${
                            selectedCarrier === carrier.id 
                            ? 'bg-ediflow-primary/10 border-ediflow-primary text-ediflow-primary' 
                            : 'bg-[#24241A] border-transparent text-white/60 hover:bg-[#2A2A20]'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[18px]">{carrier.icon}</span>
                        <span className="text-sm font-medium">{carrier.name}</span>
                    </button>
                ))}
             </div>
        </div>

        {/* Photo Evidence */}
        <div className="flex flex-col gap-3">
             <label className="text-sm font-medium text-white">Fotografía del Paquete</label>
             <div className="flex gap-4 items-center">
                 <button className="w-32 h-32 rounded-xl bg-[#24241A] border-2 border-dashed border-[#444430] hover:border-ediflow-primary hover:bg-[#2A2A20] transition-all flex flex-col items-center justify-center gap-2 group active:scale-95">
                     <div className="w-10 h-10 rounded-full bg-[#333328] group-hover:bg-ediflow-primary group-hover:text-black flex items-center justify-center text-white/50 transition-colors">
                        <span className="material-symbols-outlined">photo_camera</span>
                     </div>
                     <span className="text-xs font-medium text-white/50 group-hover:text-white">Tomar Foto</span>
                 </button>
                 <p className="flex-1 text-sm text-white/40 leading-relaxed">
                    Captura una imagen del estado del paquete para respaldo de recepción.
                 </p>
             </div>
        </div>

      </div>

      {/* Sticky Bottom Button */}
      <div className="mt-auto p-4 bg-[#181811] border-t border-white/5">
        <button className="w-full h-14 bg-ediflow-primary hover:bg-[#FADB14] active:bg-[#E3AF08] active:scale-[0.98] text-black rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-yellow-900/20 transition-all">
            <span className="material-symbols-outlined">notifications_active</span>
            Notificar al Residente
        </button>
      </div>

    </div>
  );
};

export default PackageEntry;