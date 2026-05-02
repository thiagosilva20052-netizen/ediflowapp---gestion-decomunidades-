import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenName } from '../App';

interface Props {
  navigate: (screen: ScreenName) => void;
}

const MapConfigPage: React.FC<Props> = ({ navigate }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleImport = () => {
    setIsImporting(true);
    setTimeout(() => {
      setIsImporting(false);
      showToast("Plantilla Excel importada: 150 unidades configuradas.");
    }, 2000);
  };

  const mapData = [
    { unit: '101', type: 'Departamento', aliquot: 1.2000, owner: 'Juan Pérez', email: 'juan@email.com', status: 'Configurado' },
    { unit: '102', type: 'Departamento', aliquot: 1.5000, owner: 'María Gómez', email: 'maria@email.com', status: 'Configurado' },
    { unit: '103', type: 'Departamento', aliquot: 1.1000, owner: 'Carlos Ruiz', email: 'carlos@email.com', status: 'Configurado' },
    { unit: 'B-12', type: 'Bodega', aliquot: 0.1500, owner: 'Juan Pérez', email: 'juan@email.com', status: 'Configurado' },
    { unit: 'E-45', type: 'Estacionamiento', aliquot: 0.2500, owner: 'Ana Torres', email: 'ana@email.com', status: 'Falta Email' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white font-sans overflow-hidden relative">
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-12 left-1/2 z-50 bg-emerald-500 text-black px-6 py-3 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] font-bold text-sm flex items-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="px-6 md:px-12 pt-12 pb-6 flex items-center justify-between sticky top-0 z-30 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate('ManageExpenses')}
              className="w-12 h-12 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Configuración Inicial <span className="font-serif italic font-normal text-gray-400">El Mapa</span></h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px] text-gray-400">map</span>
                Unidades, Copropietarios y Alícuotas
              </p>
            </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 md:px-12 py-10 max-w-7xl mx-auto w-full space-y-10">
        
        {/* KPI Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#111] p-6 rounded-[2rem] border border-white/5 shadow-lg relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-[30px] rounded-full pointer-events-none group-hover:bg-blue-500/10 transition-colors"></div>
             <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-1 shadow-sm">Total Unidades</p>
             <h3 className="text-4xl font-light text-white">150</h3>
             <p className="text-xs text-gray-400 mt-2">Dptos, Bodegas, Estac.</p>
          </div>
          <div className="bg-[#111] p-6 rounded-[2rem] border border-white/5 shadow-lg relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-[30px] rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors"></div>
             <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-1 shadow-sm">Suma Alícuotas</p>
             <h3 className="text-4xl font-light text-white">100.00%</h3>
             <p className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1 font-bold">
               <span className="material-symbols-outlined text-[12px]">verified</span> Cuadratura Perfecta
             </p>
          </div>
          <div className="bg-[#111] p-6 rounded-[2rem] border border-white/5 shadow-lg relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-[30px] rounded-full pointer-events-none group-hover:bg-purple-500/10 transition-colors"></div>
             <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-1 shadow-sm">Copropietarios</p>
             <h3 className="text-4xl font-light text-white">112</h3>
             <p className="text-[10px] text-amber-400 mt-2 flex items-center gap-1 font-bold">
               <span className="material-symbols-outlined text-[12px]">warning</span> 5 sin email registrado
             </p>
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-gradient-to-br from-[#111] to-[#1A1A1A] p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>
           
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="space-y-4 max-w-xl">
                 <h2 className="text-2xl font-bold tracking-tight text-white">Carga Masiva desde Excel</h2>
                 <p className="text-gray-400 text-sm leading-relaxed">
                    Si estás migrando de otro sistema o empezando de cero, la forma más rápida de configurar "El Mapa" de tu comunidad es subir nuestra plantilla Excel con las unidades y alícuotas.
                 </p>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
                 <button className="bg-white/5 text-white border border-white/10 px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Descargar Plantilla Vacía
                 </button>
                 <button 
                  onClick={handleImport}
                  disabled={isImporting}
                  className="bg-ediflow-primary text-black px-6 py-3 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(0,174,239,0.3)] hover:shadow-[0_0_30px_rgba(0,174,239,0.5)] hover:bg-white transition-all flex items-center justify-center gap-2"
                 >
                    {isImporting ? <span className="material-symbols-outlined animate-spin">sync</span> : <span className="material-symbols-outlined">upload</span>}
                    {isImporting ? 'Importando...' : 'Subir Archivo Excel'}
                 </button>
              </div>
           </div>
        </div>

        {/* Units Table */}
        <div>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] pl-2">Listado de Unidades</h2>
            <div className="flex gap-2">
               <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">search</span>
               </button>
               <button 
                 onClick={() => navigate('ResidentDirectory')}
                 className="bg-white/5 border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold hover:bg-white/10 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">add</span> Añadir Unidad
               </button>
            </div>
          </div>
          
          <div className="bg-[#111] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="text-xs text-gray-500 uppercase bg-[#1A1A1A] border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 font-semibold tracking-widest">Unidad</th>
                    <th className="px-6 py-4 font-semibold tracking-widest">Tipo</th>
                    <th className="px-6 py-4 font-semibold tracking-widest text-right">Alícuota (%)</th>
                    <th className="px-6 py-4 font-semibold tracking-widest">Copropietario</th>
                    <th className="px-6 py-4 font-semibold tracking-widest">Email</th>
                    <th className="px-6 py-4 font-semibold tracking-widest text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {mapData.map((row, i) => (
                    <tr key={i} className="hover:bg-[#141414] transition-colors group cursor-pointer">
                      <td className="px-6 py-4 font-bold text-white relative">
                         <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         {row.unit}
                      </td>
                      <td className="px-6 py-4">
                         <span className="bg-white/5 px-2 py-1 rounded text-xs border border-white/5">{row.type}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-gray-400">{row.aliquot.toFixed(4)}%</td>
                      <td className="px-6 py-4">{row.owner}</td>
                      <td className="px-6 py-4 text-xs font-mono text-gray-500">{row.email}</td>
                      <td className="px-6 py-4 text-center">
                         <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${
                           row.status === 'Configurado' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                         }`}>
                           {row.status}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-white/5 flex items-center justify-center bg-[#141414]">
               <p className="text-xs text-gray-500 flex items-center gap-2 hover:text-white cursor-pointer transition-colors">
                  <span className="material-symbols-outlined text-[14px]">more_horiz</span>
                  Ver todas las unidades
               </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default MapConfigPage;
