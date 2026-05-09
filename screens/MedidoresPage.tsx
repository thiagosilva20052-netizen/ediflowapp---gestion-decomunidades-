import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ScreenName } from '../App';
import { supabase } from '../src/lib/supabase-client';
import { useAppContext } from '../src/context/AppContext';

interface Props {
  navigate: (screen: ScreenName) => void;
}

interface MeterRow {
  unit_id: string;
  unidad: string;
  mesAnterior: number;
  mesActual: number;
}

const MedidoresPage: React.FC<Props> = ({ navigate }) => {
  const { currentTenant } = useAppContext();
  const [costoUnitario, setCostoUnitario] = useState(2500); // Costo por M3 Agua Caliente
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Lista de medidores por departamento
  const [lecturas, setLecturas] = useState<MeterRow[]>([]);

  useEffect(() => {
    if (!currentTenant) return;

    const fetchUnitsAndReadings = async () => {
      setIsLoading(true);
      try {
        // Fetch all units for tenant
        const { data: unitsData, error: unitsError } = await supabase
          .from('units')
          .select('id, unit_number')
          .eq('tenant_id', currentTenant.id)
          .order('unit_number');

        if (unitsError) throw unitsError;

        // Fetch this month's meter readings (simplified lookup for MVP)
        const currentMonth = new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric' }).format(new Date());

        const { data: readingsData, error: readingsError } = await supabase
          .from('meter_readings')
          .select('unit_id, current_reading, previous_reading')
          .eq('tenant_id', currentTenant.id)
          .eq('billing_month', currentMonth)
          .eq('type', 'Agua Caliente');

        if (readingsError) throw readingsError;

        // Map readings to units
        const readingsMap: Record<string, { prev: number, curr: number }> = {};
        if (readingsData) {
          readingsData.forEach(r => {
            readingsMap[r.unit_id] = { prev: r.previous_reading, curr: r.current_reading };
          });
        }

        const formattedLecturas: MeterRow[] = (unitsData || []).map(u => ({
          unit_id: u.id,
          unidad: `Dpto ${u.unit_number}`,
          mesAnterior: readingsMap[u.id]?.prev || 0,
          mesActual: readingsMap[u.id]?.curr || 0
        }));

        setLecturas(formattedLecturas);
      } catch (err) {
        console.error(err);
        showToast("Error al cargar unidades y lecturas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnitsAndReadings();
  }, [currentTenant]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLecturaChange = (id: string, prop: 'mesAnterior' | 'mesActual', value: string) => {
    const val = parseInt(value) || 0;
    setLecturas(prev => prev.map(item => {
      if (item.unit_id === id) {
        return { ...item, [prop]: val };
      }
      return item;
    }));
  };

  const handleSave = async () => {
    if (!currentTenant) return;
    setIsSaving(true);
    
    try {
       const currentMonth = new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric' }).format(new Date());
       
       // Prepare upsert payload
       const payload = lecturas.map(row => {
          const consumo = row.mesActual - row.mesAnterior;
          const monto = (consumo > 0 ? consumo : 0) * costoUnitario;
          return {
            tenant_id: currentTenant.id,
            unit_id: row.unit_id,
            type: 'Agua Caliente',
            previous_reading: row.mesAnterior,
            current_reading: row.mesActual,
            amount: monto,
            billing_month: currentMonth
          };
       });

       // Wipe existing this-month data to avoid duplicates, then insert
       // (Real upsert requires a unique constraint on unit_id + month + type + tenant)
       await supabase.from('meter_readings')
          .delete()
          .eq('tenant_id', currentTenant.id)
          .eq('billing_month', currentMonth)
          .eq('type', 'Agua Caliente');

       const { error } = await supabase.from('meter_readings').insert(payload);
       if (error) throw error;

       showToast("¡Consumos guardados en Base de Datos!");
       setTimeout(() => {
         setIsSaving(false);
         navigate('ManageExpenses');
       }, 1500);
    } catch (err) {
       console.error(err);
       setIsSaving(false);
       showToast("Error al guardar en Supabase");
    }
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !currentTenant) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        // Format expected: UnitNumber,PreviousReading,CurrentReading
        const lines = text.split('\n').filter(l => l.trim() !== '');
        
        const mappedData: Record<string, { prev: number, curr: number }> = {};
        lines.forEach(line => {
           const [unitNum, prev, curr] = line.split(',');
           if (unitNum && prev && curr) {
             mappedData[unitNum.trim()] = {
                prev: parseFloat(prev.trim()),
                curr: parseFloat(curr.trim())
             };
           }
        });

        // Update local state by mapping unit numbers
        setLecturas(prevList => prevList.map(item => {
           const unitNum = item.unidad.replace('Dpto ', '');
           if (mappedData[unitNum]) {
              return { 
                ...item, 
                mesAnterior: mappedData[unitNum].prev, 
                mesActual: mappedData[unitNum].curr 
              };
           }
           return item;
        }));

        showToast("Datos importados del CSV correctamente");

      } catch (err) {
         console.error(err);
         showToast("Error procesando Archivo CSV");
      } finally {
         if (e.target) e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  const totalConsumoMes = lecturas.reduce((acc, curr) => {
    const diff = curr.mesActual - curr.mesAnterior;
    return acc + (diff > 0 ? diff : 0);
  }, 0);

  const totalDineroMes = totalConsumoMes * costoUnitario;


  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white font-sans overflow-hidden relative">
      <header className="px-6 md:px-12 pt-12 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between sticky top-0 z-30 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 gap-6">
        <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate('ManageExpenses')}
              className="w-12 h-12 rounded-[1rem] bg-[#111] border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all shadow-lg"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Lectura de Medidores</h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px] text-cyan-400">water_drop</span>
                Consumo Individual
              </p>
            </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-3 bg-[#111] border border-white/5 px-4 py-3 rounded-xl flex-1 md:flex-none">
               <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Costo por M³</span>
               <div className="flex items-center gap-1">
                 <span className="text-gray-400">$</span>
                 <input 
                   type="number" 
                   value={costoUnitario}
                   onChange={e => setCostoUnitario(parseInt(e.target.value) || 0)}
                   className="bg-transparent border-none text-white font-mono text-sm focus:outline-none w-20"
                 />
               </div>
            </div>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-ediflow-primary text-black px-8 py-3.5 rounded-xl font-bold shadow-[0_0_20px_rgba(0,174,239,0.3)] hover:bg-white transition-all active:scale-95 flex items-center gap-2 shrink-0"
            >
              {isSaving ? <span className="material-symbols-outlined animate-spin">refresh</span> : <span className="material-symbols-outlined">save</span>}
              {isSaving ? 'Guardando...' : 'Guardar y Continuar'}
            </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 md:px-12 py-10 max-w-7xl mx-auto w-full">
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
           <div className="bg-[#111] border border-white/5 rounded-[2rem] p-8 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Total Consumo Facturado</p>
                <h3 className="text-4xl text-white font-light tracking-tight">{totalConsumoMes} <span className="text-xl text-gray-500">M³</span></h3>
              </div>
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                 <span className="material-symbols-outlined text-[32px]">water</span>
              </div>
           </div>
           <div className="bg-[#111] border border-white/5 rounded-[2rem] p-8 flex items-center justify-between relative overflow-hidden group">
              <div className="absolute -right-32 -top-32 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity"></div>
              <div className="relative z-10">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Total a Recaudar</p>
                <h3 className="text-4xl text-emerald-400 font-light tracking-tight">${totalDineroMes.toLocaleString()}</h3>
                <p className="text-xs text-gray-500 mt-2 font-medium">Se cobrará prorrateado por consumo en el GC.</p>
              </div>
           </div>
        </div>

        {/* Data Grid */}
        <div className="bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
           <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#1A1A1A]">
             <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-gray-400">table_chart</span>
                Mes de {new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric' }).format(new Date())}: Agua Caliente
             </h3>
             <div className="relative overflow-hidden">
                <input 
                  type="file" 
                  id="csv-upload" 
                  className="hidden" 
                  accept=".csv"
                  onChange={handleImportExcel}
                />
                <label htmlFor="csv-upload" className="cursor-pointer text-xs bg-ediflow-primary/10 text-ediflow-primary border border-ediflow-primary/20 px-4 py-2 rounded-lg font-bold tracking-wide hover:bg-ediflow-primary/20 transition-colors flex items-center gap-2">
                   <span className="material-symbols-outlined text-[14px]">upload_file</span>
                   Importar CSV
                </label>
             </div>
           </div>
           
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                <thead className="bg-[#141414] border-b border-white/5">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-1/4">Unidad</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-1/4">Lectura Anterior</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-1/4 bg-white/[0.02]">Lectura Actual</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-1/4 text-right">Consumo (M³)</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-1/4 text-right">Cobro Generado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {lecturas.map((item) => {
                    const diff = item.mesActual - item.mesAnterior;
                    const consumo = diff > 0 ? diff : 0;
                    const monto = consumo * costoUnitario;
                    
                    return (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-4 font-bold text-white tabular-nums">{item.unidad}</td>
                        <td className="px-8 py-4">
                           <input 
                             type="number" 
                             value={item.mesAnterior}
                             onChange={(e) => handleLecturaChange(item.id, 'mesAnterior', e.target.value)}
                             className="bg-transparent border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none focus:border-white/30 text-gray-400 font-mono text-sm w-24"
                           />
                        </td>
                        <td className="px-8 py-4 bg-white/[0.01]">
                           <input 
                             type="number" 
                             value={item.mesActual}
                             onChange={(e) => handleLecturaChange(item.id, 'mesActual', e.target.value)}
                             className={`bg-[#0A0A0A] border rounded-lg px-3 py-1.5 focus:outline-none font-mono text-sm w-24 transition-colors ${
                               diff < 0 ? 'border-red-500/50 text-red-400' : 'border-ediflow-primary/30 focus:border-ediflow-primary text-white'
                             }`}
                           />
                           {diff < 0 && <span className="text-[10px] text-red-500 absolute ml-3 mt-2 block">Cálculo negativo</span>}
                        </td>
                        <td className="px-8 py-4 text-right font-mono text-white">
                           {consumo} M³
                        </td>
                        <td className="px-8 py-4 text-right font-mono font-bold text-emerald-400">
                           ${monto.toLocaleString()}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
             </table>
           </div>
        </div>
      </main>
    </div>
  );
};

export default MedidoresPage;
