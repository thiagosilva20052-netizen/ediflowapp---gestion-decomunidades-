import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../src/context/AppContext';

interface Props {
  navigate: (screen: string) => void;
}

const mockAuditLogs = [
  {
    id: 1,
    date: '2026-05-03T14:30:00Z',
    user: 'Administrador (T. Silva)',
    action: 'Tolerancia de Alícuota',
    details: 'Ajuste automático de +0.01% aplicado a la unidad 502 por error de redondeo en importación.',
    module: 'Onboarding',
    severity: 'warning'
  },
  {
    id: 2,
    date: '2026-05-02T09:15:00Z',
    user: 'Comité (A. Rojas)',
    action: 'Aprobación de Gasto',
    details: 'Se aprobó la factura folio #40552 por concepto de "Mantención Ascensores".',
    module: 'Finanzas',
    severity: 'info'
  },
  {
    id: 3,
    date: '2026-05-01T16:45:00Z',
    user: 'Conserje (L. Pérez)',
    action: 'Registro de Paquete',
    details: 'Recepción de encomienda MercadoLibre para Dpto 402.',
    module: 'Conserjería',
    severity: 'info'
  },
  {
    id: 4,
    date: '2026-04-28T11:20:00Z',
    user: 'Administrador (T. Silva)',
    action: 'Modificación de Residente',
    details: 'Se actualizó el correo electrónico del propietario Dpto 301.',
    module: 'Residentes',
    severity: 'warning'
  },
  {
    id: 5,
    date: '2026-04-25T18:00:00Z',
    user: 'Sistema Automático',
    action: 'Cierre de Mes',
    details: 'Cierre de bases y emisión masiva de Gastos Comunes - Abril 2026.',
    module: 'Prorrateo',
    severity: 'critical'
  }
];

export const AuditLogsPage: React.FC<Props> = ({ navigate }) => {
  const { currentTenant } = useAppContext();
  const [filter, setFilter] = useState('all');

  const filteredLogs = mockAuditLogs.filter(log => {
      if (filter === 'all') return true;
      return log.module.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] text-white overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-ediflow-primary/5 blur-[120px] rounded-full mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full mix-blend-screen"></div>
      </div>

      <header className="px-6 md:px-12 pt-12 pb-6 border-b border-white/5 sticky top-0 bg-[#0A0A0A]/80 backdrop-blur-xl z-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 text-ediflow-primary mb-2">
              <span className="material-symbols-outlined text-sm">policy</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Gobernanza y Transparencia</span>
            </div>
            <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-3">
              Historial de Auditoría
            </h1>
            <p className="text-gray-400 mt-1 text-sm font-medium">
              Trazabilidad inmutable de las operaciones en {currentTenant?.name || 'la comunidad'}.
            </p>
          </div>
          <button 
             onClick={() => navigate('AdminDashboard')}
             className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Volver al Dashboard
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-8">
             <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm transition-colors border ${filter === 'all' ? 'bg-white/10 text-white border-white/20' : 'bg-transparent text-gray-500 border-white/5 hover:text-white'}`}>Todos</button>
             <button onClick={() => setFilter('onboarding')} className={`px-4 py-2 rounded-lg text-sm transition-colors border ${filter === 'onboarding' ? 'bg-white/10 text-white border-white/20' : 'bg-transparent text-gray-500 border-white/5 hover:text-white'}`}>Setup & Tolerancias</button>
             <button onClick={() => setFilter('finanzas')} className={`px-4 py-2 rounded-lg text-sm transition-colors border ${filter === 'finanzas' ? 'bg-white/10 text-white border-white/20' : 'bg-transparent text-gray-500 border-white/5 hover:text-white'}`}>Finanzas</button>
             <button onClick={() => setFilter('residentes')} className={`px-4 py-2 rounded-lg text-sm transition-colors border ${filter === 'residentes' ? 'bg-white/10 text-white border-white/20' : 'bg-transparent text-gray-500 border-white/5 hover:text-white'}`}>Residentes</button>
          </div>

          {/* Timeline / Logs */}
          <div className="bg-[#111] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl relative overflow-hidden">
             
             {/* Security Badge */}
             <div className="absolute top-6 right-6 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Logs Encriptados</span>
             </div>

             <div className="space-y-8 mt-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                {filteredLogs.map((log, i) => (
                  <motion.div 
                    key={log.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                  >
                     {/* Icon centered */}
                     <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#111] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-xl z-10 ${
                        log.severity === 'critical' ? 'bg-indigo-500/20 text-indigo-400' :
                        log.severity === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-ediflow-primary/20 text-ediflow-primary'
                     }`}>
                        <span className="material-symbols-outlined text-[16px]">
                           {log.severity === 'critical' ? 'generating_tokens' : log.severity === 'warning' ? 'warning' : 'task_alt'}
                        </span>
                     </div>
                     
                     {/* Card */}
                     <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#141414] p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors shadow-lg">
                        <div className="flex items-start justify-between mb-2">
                           <span className="text-xs font-mono text-gray-500">{new Date(log.date).toLocaleString('es-CL')}</span>
                           <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 text-gray-400">{log.module}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1.5">{log.action}</h4>
                        <p className="text-xs text-gray-400 leading-relaxed mb-3">{log.details}</p>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest border-t border-white/5 pt-3">
                           <span className="material-symbols-outlined text-[14px]">person</span>
                           Por: <span className="text-gray-300 font-bold">{log.user}</span>
                        </div>
                     </div>
                  </motion.div>
                ))}
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};
