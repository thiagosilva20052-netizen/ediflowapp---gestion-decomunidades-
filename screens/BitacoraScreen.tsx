import React, { useState } from 'react';
import { ScreenName } from '../App';
import { UserRole } from '../src/types';

interface Props {
  navigate: (screen: ScreenName) => void;
  role: UserRole;
}

const BitacoraScreen: React.FC<Props> = ({ navigate, role }) => {
  const [filter, setFilter] = useState('todos');

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4 bg-black sticky top-0 z-30 border-b border-white/5 backdrop-blur-xl bg-opacity-80">
        <div className="flex items-center gap-3">
          <button 
              onClick={() => navigate(role === 'admin' ? 'AdminDashboard' : 'ConciergeDashboard')}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0A0A0A] hover:bg-white/5 active:scale-90 transition-all text-gray-400 hover:text-white border border-white/5"
          >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <h1 className="text-xl font-light tracking-tight text-white">Bitácora Digital</h1>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mt-0.5">Registro Oficial del Edificio</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('NovedadEntry')}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-black active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
        </button>
      </div>

      {/* Filters */}
      <div className="px-5 py-3 flex gap-2 overflow-x-auto no-scrollbar border-b border-white/5">
        {['todos', 'seguridad', 'mantenimiento', 'paquetes', 'visitas'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-widest transition-all whitespace-nowrap border ${
              filter === f ? 'bg-white text-black border-white' : 'bg-transparent text-gray-500 border-white/10 hover:border-white/20 hover:text-gray-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-3xl mx-auto w-full pb-24 space-y-8">
        
        {/* Date Group */}
        <div>
            <div className="flex items-center gap-4 mb-4 sticky top-0 bg-black py-2 z-20">
              <div className="h-[1px] flex-1 bg-white/5"></div>
              <h2 className="text-[9px] font-semibold text-gray-500 uppercase tracking-widest">Hoy, 24 de Octubre</h2>
              <div className="h-[1px] flex-1 bg-white/5"></div>
            </div>

            <div className="space-y-3">
                <BitacoraItem 
                    time="14:30" 
                    category="PAQUETE"
                    title="Entrega de Encomienda" 
                    desc="Chilexpress entregado a Depto 402. Firma registrada."
                    icon="package_2"
                    color="text-blue-400"
                    priority="baja"
                />
                <BitacoraItem 
                    time="13:15" 
                    category="VISITA"
                    title="Ingreso de Visita" 
                    desc="Juan Pablo Díaz para Depto 1402. Identidad verificada."
                    icon="person_check"
                    color="text-purple-400"
                    priority="baja"
                />
                <BitacoraItem 
                    time="11:00" 
                    category="MANTENCIÓN"
                    title="Falla en Ascensor 2" 
                    desc="Se reporta ruido extraño en motor de ascensor 2. Se contacta a empresa técnica."
                    icon="engineering"
                    color="text-amber-400"
                    priority="alta"
                />
            </div>
        </div>

         {/* Date Group */}
         <div>
            <div className="flex items-center gap-4 mb-4 sticky top-0 bg-black py-2 z-20">
              <div className="h-[1px] flex-1 bg-white/5"></div>
              <h2 className="text-[9px] font-semibold text-gray-500 uppercase tracking-widest">Ayer, 23 de Octubre</h2>
              <div className="h-[1px] flex-1 bg-white/5"></div>
            </div>

            <div className="space-y-3">
                <BitacoraItem 
                    time="22:00" 
                    category="SEGURIDAD"
                    title="Ronda de Cierre" 
                    desc="Revisión final de zona de quinchos y perímetros. Todo en orden."
                    icon="shield"
                    color="text-green-400"
                    priority="baja"
                />
                <BitacoraItem 
                    time="18:45" 
                    category="SEGURIDAD"
                    title="Incidente de Ruidos" 
                    desc="Aviso de ruidos molestos en Depto 803. Se solicita bajar volumen."
                    icon="volume_up"
                    color="text-red-400"
                    priority="media"
                />
            </div>
        </div>

      </div>
    </div>
  );
};

const BitacoraItem = ({ time, category, title, desc, icon, color, priority }: any) => (
    <div className="bg-[#0A0A0A] p-4 rounded-[20px] border border-white/5 hover:border-white/10 transition-all group">
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 ${color}`}>
                    <span className="material-symbols-outlined text-[20px]">{icon}</span>
                </div>
                <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded border border-[#141414] bg-white/5 ${color}`}>{category}</span>
                      {priority === 'alta' && (
                        <span className="flex items-center gap-1 text-[8px] font-semibold text-red-500 border border-red-500/20 px-2 py-0.5 bg-red-500/10 rounded uppercase tracking-widest">
                          Urgente
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium text-white text-sm mt-1.5">{title}</h3>
                </div>
            </div>
            <span className="text-[10px] font-medium text-gray-500 px-2 py-1">{time}</span>
        </div>
        <p className="text-xs text-gray-400 font-light leading-relaxed pl-13 pr-4">{desc}</p>
        
        <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center px-1">
          <div className="flex -space-x-1.5">
            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=50" className="w-5 h-5 rounded-full border border-black" />
            <div className="w-5 h-5 rounded-full bg-white/10 border border-black flex items-center justify-center">
              <span className="text-[7px] font-medium text-gray-300">JP</span>
            </div>
          </div>
          <button className="text-[9px] font-semibold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
            Ver Detalles
          </button>
        </div>
    </div>
);

export default BitacoraScreen;
