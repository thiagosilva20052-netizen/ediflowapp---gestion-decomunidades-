import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenName } from '../App';
import { useAppContext } from '../src/context/AppContext';
import { supabase } from '../src/lib/supabase-client';

interface Props {
  navigate: (screen: ScreenName) => void;
}

interface Multa {
  id: string;
  unit_number: string;
  residente: string;
  amount: number;
  description: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  evidence_url?: string;
}

const MultasPage: React.FC<Props> = ({ navigate }) => {
  const { currentTenant, currentUser } = useAppContext();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'historial'>('pending');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [multas, setMultas] = useState<Multa[]>([]);
  const [units, setUnits] = useState<any[]>([]);

  useEffect(() => {
    if (!currentTenant) return;

    const fetchUnits = async () => {
      const { data } = await supabase.from('units').select('id, unit_number, profiles!units_owner_id_fkey(name)').eq('tenant_id', currentTenant.id);
      if (data) setUnits(data);
    };

    const fetchFines = async () => {
      const { data } = await supabase
         .from('fines')
         .select('*, units(unit_number), profiles(name)')
         .eq('tenant_id', currentTenant.id)
         .order('created_at', { ascending: false });
      
      if (data) {
        setMultas(data.map((m: any) => ({
          ...m,
          unit_number: m.units?.unit_number || '?',
          residente: m.profiles?.name || 'Propietario',
        })));
      }
    };

    fetchUnits();
    fetchFines();

    const channel = supabase.channel('public:fines')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fines', filter: `tenant_id=eq.${currentTenant.id}` }, () => {
        fetchFines();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentTenant]);

  const [formData, setFormData] = useState({
    unit_id: '',
    motivo: '',
    monto: '',
    observacion: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
      showToast("Archivo listo para subir.");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSubmit = async () => {
    if (!formData.unit_id || !formData.motivo || !formData.monto || !currentTenant || !currentUser) {
      showToast("Faltan campos por llenar");
      return;
    }
    
    setIsSubmitting(true);
    try {
        let personalEvidenceUrl = null;

        // 1. Upload File to Supabase Storage if exists
        if (selectedFile) {
          const fileExt = selectedFile.name.split('.').pop();
          const filePath = `${currentTenant.id}/fines/${Date.now()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('evidence')
            .upload(filePath, selectedFile);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('evidence')
            .getPublicUrl(filePath);
          
          personalEvidenceUrl = publicUrl;
        }

        const { data: unitData } = await supabase.from('units').select('owner_id').eq('id', formData.unit_id).single();

        const { error } = await supabase.from('fines').insert({
          tenant_id: currentTenant.id,
          unit_id: formData.unit_id,
          user_id: unitData?.owner_id,
          amount: parseFloat(formData.monto),
          description: formData.motivo + (formData.observacion ? ` - ${formData.observacion}` : ''),
          status: 'pending',
          evidence_url: personalEvidenceUrl
        });

        if (error) throw error;

        setShowModal(false);
        setFormData({ unit_id: '', motivo: '', monto: '', observacion: '' });
        setFileName(null);
        setSelectedFile(null);
        showToast("Infracción registrada con éxito.");
    } catch(err) {
        console.error(err);
        showToast("Error al registrar infracción");
    } finally {
        setIsSubmitting(false);
    }
  };

  const approveFine = async (fineId: string) => {
     try {
        const { error } = await supabase.from('fines').update({ status: 'approved' }).eq('id', fineId);
        if (error) throw error;
        showToast("Multa aprobada, cobro generado.");
     } catch(err) {
        console.error(err);
     }
  };

  const filteredMultas = activeTab === 'pending' 
    ? multas.filter(m => m.status === 'pending')
    : multas.filter(m => m.status !== 'pending');

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white font-sans overflow-hidden relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-12 left-1/2 z-50 bg-ediflow-primary text-black px-6 py-3 rounded-full shadow-[0_0_20px_rgba(0,174,239,0.4)] font-bold text-sm flex items-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="px-6 md:px-12 pt-12 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate('ManageExpenses')}
              className="w-12 h-12 rounded-[1rem] bg-[#111] border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all shadow-lg"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Cargos Extra y Multas</h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px]">gavel</span>
                Infracciones al Reglamento
              </p>
            </div>
        </div>
        <button 
           onClick={() => setShowModal(true)}
           className="bg-ediflow-primary text-black px-6 py-4 rounded-xl font-bold hover:bg-white transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,174,239,0.3)] active:scale-95 md:w-auto"
        >
           <span className="material-symbols-outlined">add</span>
           Registrar Cargo / Multa
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-6 md:px-12 py-10 max-w-7xl mx-auto w-full">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-[40px] rounded-full group-hover:bg-orange-500/10 transition-colors pointer-events-none"></div>
            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span> Multas Pendientes
            </p>
            <h3 className="text-4xl text-white font-light tracking-tight mt-1">
              {multas.filter(m => m.status === 'pending').length}
            </h3>
          </div>

          <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-ediflow-primary/5 blur-[40px] rounded-full group-hover:bg-ediflow-primary/10 transition-colors pointer-events-none"></div>
            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-ediflow-primary"></span> Total por Recaudar
            </p>
            <h3 className="text-4xl text-white font-light tracking-tight mt-1">
              ${multas.filter(m => m.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('es-CL')}
            </h3>
          </div>

          <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[40px] rounded-full group-hover:bg-emerald-500/10 transition-colors pointer-events-none"></div>
            <p className="text-sm text-gray-300 font-medium mb-4">Las multas impagas se cargarán automáticamente al próximo Gasto Común de la unidad.</p>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
               <span className="material-symbols-outlined text-[14px]">sync</span>
               Sincronización Automática
            </div>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto hide-scrollbar">
           {[
             { id: 'pending', label: 'Pendientes' }, 
             { id: 'historial', label: 'Historial' }
           ].map((tab) => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-white text-black' 
                    : 'bg-[#111] text-gray-400 hover:text-white border border-white/5 hover:border-white/10'
                }`}
             >
                {tab.label}
             </button>
           ))}
        </div>

        {/* List */}
        <div className="space-y-4">
           {filteredMultas.map((multa) => (
             <motion.div 
               key={multa.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-[#111] p-6 lg:p-8 rounded-[2rem] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-ediflow-primary/20 transition-all group"
             >
               <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-[1.5rem] bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-2xl font-mono shrink-0">
                   {multa.unit_number}
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                     {multa.description}
                     {multa.status === 'rejected' && (
                        <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full uppercase tracking-widest border border-red-500/20">
                          Rechazada
                        </span>
                     )}
                   </h3>
                   <div className="flex items-center gap-4 mt-2">
                     <span className="text-white font-mono text-sm font-bold bg-white/5 px-3 py-1 rounded-full border border-white/10">
                       ${multa.amount.toLocaleString('es-CL')}
                     </span>
                     <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest flex items-center gap-1">
                       <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                       {new Date(multa.created_at).toLocaleDateString('es-CL')}
                     </span>
                     {multa.evidence_url && (
                        <a href={multa.evidence_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-xs flex items-center gap-1">
                           <span className="material-symbols-outlined text-[14px]">attach_file</span> Evidencia
                        </a>
                     )}
                   </div>
                 </div>
               </div>

               <div className="flex items-center gap-3">
                 {multa.status === 'pending' ? (
                     <button onClick={() => approveFine(multa.id)} className="bg-[#1A1A1A] text-white border border-white/10 px-6 py-4 rounded-xl font-bold text-sm hover:bg-white/5 active:scale-95 transition-all shadow-lg text-amber-500 group-hover:border-amber-500/50">
                       Aprobar Cobro
                     </button>
                 ) : (
                     <div className="text-emerald-400 text-sm font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px]">{multa.status === 'rejected' ? 'close' : 'check_circle'}</span>
                        {multa.status === 'paid' ? 'Pagada' : multa.status === 'approved' ? 'Aprobada' : 'Rechazada'}
                     </div>
                 )}
               </div>
             </motion.div>
           ))}

           {filteredMultas.length === 0 && (
              <div className="text-center py-20 bg-[#111] rounded-[2rem] border border-white/5">
                 <span className="material-symbols-outlined text-6xl text-white/5 mb-4">check_circle</span>
                 <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Todo en orden</h3>
                 <p className="text-gray-500 text-sm">No hay multas o infracciones en esta vista.</p>
              </div>
           )}
        </div>
      </main>

      {/* Modern Modal for New Multa */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-xl flex items-center justify-center p-4 lg:p-6"
          >
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="w-full max-w-2xl bg-[#111] p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-y-auto max-h-[90vh]"
             >
                <button 
                  onClick={() => {
                    setShowModal(false);
                    setFileName(null);
                  }}
                  className="absolute top-8 right-8 w-12 h-12 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 rounded-full flex items-center justify-center text-white active:scale-95 transition-all z-50"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>

                <h3 className="text-3xl font-bold tracking-tight text-white mb-2 text-center">Registrar Cargo o Multa</h3>
                <p className="text-gray-400 text-sm mb-10 text-center font-medium">Asigna un cargo extra o multa a una unidad.</p>
                
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Unidad (Depto)</label>
                         <select 
                           value={formData.unit_id}
                           onChange={(e) => setFormData({...formData, unit_id: e.target.value})}
                           className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ediflow-primary/50 transition-colors appearance-none font-mono"
                         >
                           <option value="">Seleccione Depto...</option>
                           {units.map((u) => (
                              <option key={u.id} value={u.id}>{u.unit_number} - {u.profiles?.name || 'Propietario'}</option>
                           ))}
                         </select>
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Concepto / Motivo</label>
                         <select
                           value={formData.motivo}
                           onChange={(e) => setFormData({...formData, motivo: e.target.value})}
                           className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ediflow-primary/50 transition-colors appearance-none"
                         >
                           <option value="">Selecciona el motivo...</option>
                           <optgroup label="Multas Estándar">
                             <option value="Ruidos molestos">Ruidos molestos</option>
                             <option value="Mal estacionado">Mal estacionado</option>
                             <option value="Basura en áreas comunes">Basura en áreas comunes</option>
                             <option value="Mascota sin correa">Mascota sin correa</option>
                             <option value="Uso indebido de piscina">Uso indebido de piscina o quinchos</option>
                           </optgroup>
                           <optgroup label="Cargos Operacionales y Daños">
                             <option value="Reparación de vidrios comunes">Reparación de vidrios comunes</option>
                             <option value="Daños a infraestructura">Daños a infraestructura</option>
                             <option value="Reposición de tarjeta/llave">Reposición de tarjeta/llave</option>
                             <option value="Arriendo Salón de Eventos">Arriendo Salón de Eventos</option>
                             <option value="Cargo por mudanza">Cargo por mudanza</option>
                             <option value="Otro">Otro Cargo Manual (Especificar abajo)</option>
                           </optgroup>
                         </select>
                       </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Monto de la Infracción ($ CLP)</label>
                      <input 
                        type="number" 
                        placeholder="Ej. 25000"
                        value={formData.monto}
                        onChange={(e) => setFormData({...formData, monto: e.target.value})}
                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ediflow-primary/50 transition-colors font-mono text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-between px-1">
                         <span>Evidencia / Observación</span>
                         <span className="text-gray-600">(Opcional)</span>
                      </label>
                      <textarea 
                        rows={3}
                        placeholder="Detalles sobre la infracción..."
                        value={formData.observacion}
                        onChange={(e) => setFormData({...formData, observacion: e.target.value})}
                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ediflow-primary/50 transition-colors resize-none"
                      />
                    </div>
                    
                    <div className="bg-[#0A0A0A] border border-white/5 p-4 rounded-xl flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-gray-400">attach_file</span>
                       </div>
                       <div className="flex-1 w-full min-w-0">
                          <p className="text-xs text-white font-semibold">Adjuntar Evidencia (PDF, JPG)</p>
                          <p className="text-[10px] text-gray-500 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                            {fileName ? fileName : "Sube multas cursadas, fotos del incidente, etc."}
                          </p>
                       </div>
                       <div className="relative shrink-0">
                         <input 
                           type="file" 
                           id="evidencia-upload" 
                           className="hidden" 
                           accept=".pdf,.jpg,.jpeg,.png"
                           onChange={handleFileChange}
                         />
                         <label 
                           htmlFor="evidencia-upload"
                           className="cursor-pointer text-xs bg-white/10 text-white font-bold px-4 py-2 rounded-lg hover:bg-white/20 transition-colors block text-center"
                         >
                           {fileName ? 'Cambiar' : 'Explorar'}
                         </label>
                       </div>
                    </div>

                    <button 
                       onClick={handleSubmit}
                       disabled={isSubmitting}
                       className="w-full bg-ediflow-primary text-black font-bold text-sm tracking-tight py-4 rounded-xl mt-4 hover:bg-white active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,174,239,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] disabled:opacity-50"
                    >
                       {isSubmitting ? 'Procesando...' : 'Confirmar Cargo / Multa'}
                    </button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MultasPage;
