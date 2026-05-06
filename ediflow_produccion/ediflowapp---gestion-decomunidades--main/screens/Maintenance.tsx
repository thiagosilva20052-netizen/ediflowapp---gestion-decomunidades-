import React, { useState } from 'react';
import { ScreenName } from '../App';
import { UserRole } from '../src/types';
import { Logo } from '../components/Logo';

interface Props {
  navigate: (screen: ScreenName) => void;
  role: UserRole;
  from?: ScreenName | null;
}

interface MaintenanceTask {
  id: string;
  title: string;
  category: 'Ascensores' | 'Piscinas' | 'Electricidad' | 'Jardinería' | 'General';
  status: 'Programado' | 'En Proceso' | 'Completado' | 'Urgente';
  date: string;
  description: string;
  assignedTo?: string;
}

const Maintenance: React.FC<Props> = ({ navigate, role, from }) => {
  const [tasks] = useState<MaintenanceTask[]>([
    {
      id: '1',
      title: 'Mantención Preventiva Ascensor Torre A',
      category: 'Ascensores',
      status: 'Programado',
      date: '15 Abr, 09:00',
      description: 'Revisión mensual de cables y sistema de frenado por empresa Schindler.',
      assignedTo: 'Schindler Chile'
    },
    {
      id: '2',
      title: 'Limpieza y Cloración Piscina Central',
      category: 'Piscinas',
      status: 'En Proceso',
      date: 'Hoy, 08:00',
      description: 'Tratamiento químico intensivo y limpieza de filtros.',
      assignedTo: 'Staff Edificio'
    },
    {
      id: '3',
      title: 'Reparación Luminaria Estacionamiento -2',
      category: 'Electricidad',
      status: 'Urgente',
      date: 'Inmediato',
      description: 'Cambio de 4 focos LED dañados por alza de voltaje.',
      assignedTo: 'Electricista Externo'
    },
    {
      id: '4',
      title: 'Poda de Árboles Perimetrales',
      category: 'Jardinería',
      status: 'Completado',
      date: 'Ayer',
      description: 'Despeje de ramas que obstruían cámaras de seguridad.',
      assignedTo: 'Jardines Verdes'
    }
  ]);

  const handleBack = () => {
    if (from) {
      navigate(from);
    } else {
      if (role === 'admin') navigate('AdminDashboard');
      else if (role === 'concierge') navigate('ConciergeDashboard');
      else navigate('ResidentServices');
    }
  };

  const getStatusStyles = (status: MaintenanceTask['status']) => {
    switch (status) {
      case 'Programado': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'En Proceso': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Completado': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Urgente': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getCategoryIcon = (category: MaintenanceTask['category']) => {
    switch (category) {
      case 'Ascensores': return 'elevator';
      case 'Piscinas': return 'pool';
      case 'Electricidad': return 'bolt';
      case 'Jardinería': return 'yard';
      default: return 'build';
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#0A0A0A]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/5 p-4">
        <div className="flex justify-between items-center max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBack} 
              className="w-10 h-10 rounded-full bg-[#141414] flex items-center justify-center text-white hover:bg-[#1F1F1F] active:scale-90 transition-all border border-white/5"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h1 className="text-lg font-black text-white uppercase tracking-tight">Gestión de Mantención</h1>
              <p className="text-[10px] font-bold text-[#00AEEF] uppercase tracking-[0.2em]">Infraestructura y Servicios</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {role === 'admin' && (
              <button className="bg-[#00AEEF] text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-400 active:scale-95 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">add</span>
                Nueva Tarea
              </button>
            )}
            <Logo variant="icon" className="w-8 h-8 opacity-50" />
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full space-y-10 pb-32">
        
        {/* Stats Summary - Only for Admin/Concierge */}
        {(role === 'admin' || role === 'concierge') && (
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#141414] p-5 rounded-3xl border border-white/5">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Pendientes</p>
              <h4 className="text-2xl font-black text-white">8</h4>
            </div>
            <div className="bg-[#141414] p-5 rounded-3xl border border-white/5">
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">En Curso</p>
              <h4 className="text-2xl font-black text-white">3</h4>
            </div>
            <div className="bg-[#141414] p-5 rounded-3xl border border-white/5">
              <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Finalizadas</p>
              <h4 className="text-2xl font-black text-white">12</h4>
            </div>
            <div className="bg-[#141414] p-5 rounded-3xl border border-white/5">
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Urgencias</p>
              <h4 className="text-2xl font-black text-white">1</h4>
            </div>
          </section>
        )}

        {/* Tasks List */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#00AEEF]/10 flex items-center justify-center text-[#00AEEF]">
                <span className="material-symbols-outlined text-xl">engineering</span>
              </div>
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Cronograma de Actividades</h2>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-xl bg-[#141414] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <span className="material-symbols-outlined text-xl">filter_list</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {tasks.map((task) => (
              <div 
                key={task.id}
                className="bg-[#141414] rounded-[32px] border-2 border-white/5 hover:border-[#00AEEF]/30 transition-all group overflow-hidden"
              >
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center">
                  {/* Category Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gray-400 group-hover:text-[#00AEEF] group-hover:scale-110 transition-all duration-500">
                    <span className="material-symbols-outlined text-3xl">{getCategoryIcon(task.category)}</span>
                  </div>

                  {/* Task Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-lg border uppercase tracking-widest ${getStatusStyles(task.status)}`}>
                        {task.status}
                      </span>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        {task.date}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white leading-tight">{task.title}</h3>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-2xl">
                      {task.description}
                    </p>
                  </div>

                  {/* Actions / Details */}
                  <div className="flex flex-col md:items-end gap-4 md:pl-6 md:border-l border-white/5">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Responsable</p>
                      <p className="text-sm font-bold text-gray-300">{task.assignedTo || 'Por asignar'}</p>
                    </div>
                    {role !== 'resident' && (
                      <button className="w-full md:w-auto px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">
                        Gestionar
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Progress Bar for 'En Proceso' */}
                {task.status === 'En Proceso' && (
                  <div className="h-1.5 w-full bg-white/5 relative">
                    <div className="absolute top-0 left-0 h-full bg-amber-500 w-[65%] animate-pulse"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Maintenance Tips / Info for Residents */}
        {role === 'resident' && (
          <section className="bg-gradient-to-br from-[#00AEEF]/10 to-transparent p-8 rounded-[40px] border border-[#00AEEF]/20 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-black text-white mb-2">¿Sabías que?</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                Las mantenciones preventivas reducen en un 40% las fallas críticas en ascensores y bombas de agua, asegurando la continuidad de los servicios de tu edificio.
              </p>
            </div>
            <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-[120px] text-[#00AEEF]/10 rotate-12">
              info
            </span>
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="p-10 text-center border-t border-white/5 bg-black/40">
        <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">
          Sistema de Gestión de Infraestructura Diflow v1.0
        </p>
      </footer>
    </div>
  );
};

export default Maintenance;
