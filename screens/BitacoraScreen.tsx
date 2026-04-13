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
    <div className="flex flex-col min-h-full bg-[#0A0A0A]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-8 pb-6 bg-[#0A0A0A] sticky top-0 z-30 border-b border-white/5 backdrop-blur-md bg-opacity-90">
        <div className="flex items-center gap-4">
          <button 
              onClick={() => navigate(role === 'admin' ? 'AdminDashboard' : 'ConciergeDashboard')}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#141414] hover:bg-white/10 active:scale-90 transition-all text-white border border-white/5"
          >
              <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white uppercase">Bitácora Digital</h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Registro Oficial del Edificio</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('NovedadEntry')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-500 text-black active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>

      {/* Filters */}
      <div className="px-5 py-4 flex gap-2 overflow-x-auto no-scrollbar border-b border-white/5">
        {['todos', 'seguridad', 'mantenimiento', 'paquetes', 'visitas'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              filter === f ? 'bg-white text-black' : 'bg-[#141414] text-gray-500 border border-white/5'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-24 space-y-8">
        
        {/* Date Group */}
        <div>
            <div className="flex items-center gap-4 mb-6 sticky top-0 bg-[#0A0A0A] py-2 z-20">
              <div className="h-[1px] flex-1 bg-white/10"></div>
              <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Hoy, 24 de Octubre</h2>
              <div className="h-[1px] flex-1 bg-white/10"></div>
            </div>

            <div className="space-y-4">
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
            <div className="flex items-center gap-4 mb-6 sticky top-0 bg-[#0A0A0A] py-2 z-20">
              <div className="h-[1px] flex-1 bg-white/10"></div>
              <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Ayer, 23 de Octubre</h2>
              <div className="h-[1px] flex-1 bg-white/10"></div>
            </div>

            <div className="space-y-4">
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
    <div className="bg-[#141414] p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
                    <span className="material-symbols-outlined text-2xl">{icon}</span>
                </div>
                <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-white/5 ${color}`}>{category}</span>
                      {priority === 'alta' && (
                        <span className="flex items-center gap-1 text-[9px] font-black text-red-500 uppercase tracking-widest">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                          Urgente
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-white text-base mt-1">{title}</h3>
                </div>
            </div>
            <span className="text-[11px] font-mono text-gray-600 bg-black/40 px-2 py-1 rounded-md">{time}</span>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed pl-13">{desc}</p>
        
        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
          <div className="flex -space-x-2">
            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=50" className="w-6 h-6 rounded-full border border-[#141414]" />
            <div className="w-6 h-6 rounded-full bg-gray-800 border border-[#141414] flex items-center justify-center">
              <span className="text-[8px] font-bold text-white">JP</span>
            </div>
          </div>
          <button className="text-[10px] font-black text-gray-600 uppercase tracking-widest hover:text-white transition-colors">
            Ver Detalles
          </button>
        </div>
    </div>
);

export default BitacoraScreen;
