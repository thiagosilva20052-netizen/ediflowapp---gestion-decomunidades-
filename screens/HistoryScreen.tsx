import React from 'react';
import { ScreenName } from '../App';

interface Props {
  navigate: (screen: ScreenName) => void;
}

const HistoryScreen: React.FC<Props> = ({ navigate }) => {
  return (
    <div className="flex flex-col min-h-full bg-[#181811]">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 pt-6 pb-4 bg-[#181811] sticky top-0 z-30 border-b border-white/5">
        <button 
            onClick={() => navigate('ConciergeDashboard')}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-90 transition-all text-white"
        >
            <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold tracking-tight text-white">Historial de Turno</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-24 space-y-6">
        
        {/* Date Group */}
        <div>
            <h2 className="text-xs font-bold text-gray-500 uppercase mb-4 sticky top-16 bg-[#181811] py-2 z-20">Hoy, 24 Octubre</h2>
            <div className="relative pl-4 space-y-6 border-l border-white/10">
                
                <TimelineItem 
                    time="14:30" 
                    title="Entrega de Paquete" 
                    desc="Chilexpress entregado a Depto 402."
                    icon="package_2"
                    iconColor="text-blue-400"
                    bg="bg-blue-500/10"
                />
                 <TimelineItem 
                    time="13:15" 
                    title="Ingreso Visita" 
                    desc="Juan Pablo Díaz para Depto 1402."
                    icon="person_check"
                    iconColor="text-green-400"
                    bg="bg-green-500/10"
                />
                 <TimelineItem 
                    time="11:00" 
                    title="Reporte Mantención" 
                    desc="Técnico de ascensores ingresa a torre B."
                    icon="engineering"
                    iconColor="text-orange-400"
                    bg="bg-orange-500/10"
                />
            </div>
        </div>

         {/* Date Group */}
         <div>
            <h2 className="text-xs font-bold text-gray-500 uppercase mb-4 sticky top-16 bg-[#181811] py-2 z-20">Ayer, 23 Octubre</h2>
            <div className="relative pl-4 space-y-6 border-l border-white/10">
                <TimelineItem 
                    time="22:00" 
                    title="Cierre de Quincho" 
                    desc="Revisión final de zona de quinchos. Todo en orden."
                    icon="deck"
                    iconColor="text-purple-400"
                    bg="bg-purple-500/10"
                />
                 <TimelineItem 
                    time="18:45" 
                    title="Reclamo Ruidos" 
                    desc="Aviso de ruidos molestos piso 8."
                    icon="volume_up"
                    iconColor="text-red-400"
                    bg="bg-red-500/10"
                />
            </div>
        </div>

      </div>
    </div>
  );
};

const TimelineItem = ({ time, title, desc, icon, iconColor, bg }: any) => (
    <div className="relative">
        <div className={`absolute -left-[25px] top-0 w-5 h-5 rounded-full ${bg} border border-[#181811] flex items-center justify-center z-10`}>
            <div className={`w-2 h-2 rounded-full ${iconColor.replace('text', 'bg')}`}></div>
        </div>
        <div className="bg-[#24241A] p-4 rounded-xl border border-white/5 active:scale-[0.99] transition-all">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-lg ${iconColor}`}>{icon}</span>
                    <h3 className="font-bold text-white text-sm">{title}</h3>
                </div>
                <span className="text-xs font-mono text-gray-500">{time}</span>
            </div>
            <p className="text-sm text-gray-400">{desc}</p>
        </div>
    </div>
);

export default HistoryScreen;