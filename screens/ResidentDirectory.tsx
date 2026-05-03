import React, { useState, useEffect } from 'react';
import { ScreenName } from '../App';
import { UserRole } from '../src/types';

import { useAppContext } from '../src/context/AppContext';
import { supabase } from '../src/lib/supabase-client';

interface Props {
  navigate: (screen: ScreenName) => void;
  role: UserRole;
}

const ResidentDirectory: React.FC<Props> = ({ navigate, role }) => {
  const { currentTenant } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [units, setUnits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddMode, setIsAddMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!currentTenant) return;

    const fetchUnits = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('units')
        .select(`
          *,
          profiles:owner_id (
            id,
            full_name,
            email,
            metadata,
            role
          )
        `)
        .eq('tenant_id', currentTenant.id)
        .order('unit_number', { ascending: true });

      if (data) {
        setUnits(data);
      }
      setIsLoading(false);
    };

    fetchUnits();

    const channel = supabase.channel('public:units')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'units', filter: `tenant_id=eq.${currentTenant.id}` }, () => {
        fetchUnits();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentTenant]);

  const [formData, setFormData] = useState({
    name: '',
    depto: '',
    email: '', // Note: Email logic usually needs edge functions or auth service
    phone: '',
    bodega: '',
    parking: '',
    aliquot: '',
    unitType: 'Departamento'
  });

  const showToast = (msg: string) => {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3000);
      setIsAddMode(false);
  };

  const handleSaveResident = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentTenant) return;
      
      try {
        // En una implementación real, aquí se crearía el usuario en Auth y luego el Perfil.
        // Por ahora simulamos la inserción en units vinculando a un perfil si existe o creando uno básico.
        
        // 1. (Simulado) Crear o Buscar Perfil
        // ... (Generalmente esto se hace vía Función de Borde para asegurar integridad de Auth)
        
        const { error } = await supabase.from('units').insert({
          tenant_id: currentTenant.id,
          unit_number: formData.depto,
          contact_email: formData.email ? formData.email : null,
          proration_factor: formData.aliquot ? parseFloat(formData.aliquot) : null
          // owner_id: ...
        });

        if (error) throw error;

        if (formData.email) {
          fetch('/api/email/send-welcome', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: formData.email,
              unitNumber: formData.depto,
              setPasswordUrl: window.location.origin + '/register',
              tenantName: currentTenant.name,
              tenantRut: currentTenant.rut_edificio
            })
          }).catch(err => console.error("Error sending welcome email:", err));
        }

        showToast("Unidad registrada exitosamente.");
        setFormData({ name: '', depto: '', email: '', phone: '', bodega: '', parking: '', aliquot: '', unitType: 'Departamento' });
      } catch (err) {
        console.error(err);
        showToast("Error al registrar unidad.");
      }
  };

  const filteredUnits = units.filter(u => 
    u.unit_number.includes(searchQuery) ||
    u.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white font-sans overflow-x-hidden relative items-center selection:bg-white/10">
      <div className="w-full max-w-7xl flex flex-col h-full relative z-10">
        
        {/* Toast Notification */}
        {toastMessage && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2 animate-fade-in-up whitespace-nowrap">
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                {toastMessage}
            </div>
        )}

        {/* Sticky Header */}
        <header className="px-6 md:px-10 pt-8 md:pt-12 pb-6 sticky top-0 z-20 bg-[#0A0A0A]/90 backdrop-blur-3xl border-b border-white/5 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 pointer-events-auto">
              <button 
                onClick={() => {
                  if (role === 'admin') navigate('AdminDashboard');
                  else navigate('ConciergeDashboard');
                }}
                className="w-12 h-12 rounded-xl bg-[#111] hover:bg-[#1A1A1A] active:scale-95 transition-all text-white border border-white/5 flex items-center justify-center shadow-lg group relative"
              >
                <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform relative z-10">arrow_back</span>
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-white leading-tight">Comunidad</h1>
                <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-[0.2em]">Gestión de Unidades</p>
              </div>
            </div>

            {role === 'admin' && !isAddMode && (
              <div className="flex gap-3 pointer-events-auto relative overflow-hidden">
                <input 
                  type="file" 
                  id="csv-upload" 
                  className="hidden" 
                  accept=".csv"
                  onChange={async (e) => {
                    if (!e.target.files || e.target.files.length === 0 || !currentTenant) return;
                    
                    const file = e.target.files[0];
                    const reader = new FileReader();

                    reader.onload = async (event) => {
                      try {
                        const text = event.target?.result as string;
                        // Format expected: UnitNumber,ProrationFactor,Email
                        const lines = text.split('\n').filter(l => l.trim() !== '');
                        
                        const payload = [];
                        for (const line of lines) {
                          const [unitNum, factorStr, email] = line.split(',');
                          if (unitNum) {
                            payload.push({
                              tenant_id: currentTenant.id,
                              unit_number: unitNum.trim(),
                              proration_factor: factorStr ? parseFloat(factorStr.trim()) : null,
                              contact_email: email ? email.trim() : null
                            });
                          }
                        }

                        const { error } = await supabase.from('units').insert(payload);
                        if (error) throw error;

                        showToast("Unidades y correos importados correctamente del CSV.");

                      } catch (err) {
                        console.error(err);
                        showToast("Error procesando Archivo CSV");
                      } finally {
                        if (e.target) e.target.value = '';
                      }
                    };
                    reader.readAsText(file);
                  }}
                />
                <label 
                  htmlFor="csv-upload"
                  className="cursor-pointer bg-[#111] hover:bg-[#1A1A1A] border border-white/5 text-gray-400 hover:text-white rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] flex items-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">table_chart</span>
                  Importar CSV/Excel
                </label>
                <button 
                  onClick={() => setIsAddMode(true)}
                  className="bg-ediflow-primary text-black hover:bg-white text-xs font-bold uppercase tracking-widest rounded-xl px-5 py-3 transition-all shadow-[0_0_15px_rgba(0,174,239,0.3)] active:scale-[0.98] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Crear Unidad
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="px-6 md:px-10 flex-1 overflow-y-auto no-scrollbar pb-32 pt-6 w-full">
          
          {isAddMode ? (
             <form onSubmit={handleSaveResident} className="max-w-3xl mx-auto space-y-6">
                 <div className="flex justify-between items-center mb-2">
                     <h2 className="text-2xl tracking-tight font-medium">Registrar Unidad</h2>
                     <button 
                       type="button" 
                       onClick={() => setIsAddMode(false)}
                       className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                     >
                       Cancelar
                     </button>
                 </div>
                 
                 <div className="bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl group hover:border-white/10 transition-colors">
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Identificación Principal (Contacto)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                            Depto / Casa <span className="text-ediflow-primary ml-1">*</span>
                          </label>
                          <input 
                            type="text" 
                            value={formData.depto}
                            onChange={(e) => setFormData({...formData, depto: e.target.value})}
                            placeholder="Ej. 1402"
                            className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white placeholder-gray-600 focus:outline-none focus:border-ediflow-primary/50 focus:bg-[#141414] focus:ring-1 focus:ring-ediflow-primary/50 transition-all font-mono tracking-widest text-sm"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                            Responsable Titular <span className="text-ediflow-primary ml-1">*</span>
                          </label>
                          <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Nombres y Apellidos"
                            className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white placeholder-gray-600 focus:outline-none focus:border-ediflow-primary/50 focus:bg-[#141414] focus:ring-1 focus:ring-ediflow-primary/50 transition-all text-sm font-medium"
                            required
                          />
                        </div>
                        <div className="space-y-2 lg:col-span-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                            Correo de Acceso (App) <span className="text-ediflow-primary ml-1">*</span>
                          </label>
                          <input 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="correo@ejemplo.com"
                            className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white placeholder-gray-600 focus:outline-none focus:border-ediflow-primary/50 focus:bg-[#141414] focus:ring-1 focus:ring-ediflow-primary/50 transition-all text-sm font-medium"
                            required
                          />
                          <p className="text-[10px] text-gray-500 px-1 pt-1 opacity-70">El sistema enviará una clave de acceso única a este correo.</p>
                        </div>
                    </div>
                 </div>

                 {role === 'admin' && (
                 <div className="bg-gradient-to-tr from-[#111] to-[#141414] p-6 md:p-8 rounded-[2rem] border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.05)] group hover:border-blue-500/40 transition-colors relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 blur-[40px] rounded-full pointer-events-none"></div>
                    <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-6 border-b border-blue-500/10 pb-4 flex items-center gap-2">
                       <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
                       Ficha Financiera (Mapa)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                            Tipo de Unidad
                          </label>
                          <select 
                            value={formData.unitType}
                            onChange={(e) => setFormData({...formData, unitType: e.target.value})}
                            className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white focus:outline-none focus:border-blue-500/50 focus:bg-[#141414] transition-all text-sm appearance-none"
                          >
                            <option value="Departamento">Departamento</option>
                            <option value="Casa">Casa</option>
                            <option value="Oficina">Oficina</option>
                            <option value="Local Comercial">Local Comercial</option>
                            <option value="Bodega">Bodega</option>
                            <option value="Estacionamiento">Estacionamiento</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                            Alícuota de Prorrateo (%)
                          </label>
                          <div className="relative">
                            <input 
                              type="number" 
                              step="0.0001"
                              value={formData.aliquot}
                              onChange={(e) => setFormData({...formData, aliquot: e.target.value})}
                              placeholder="Ej: 1.2000"
                              className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-[#141414] transition-all font-mono text-sm"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono">%</span>
                          </div>
                          <p className="text-[10px] text-gray-500 px-1 mt-1">Porcentaje del gasto común que le corresponde pagar.</p>
                        </div>
                    </div>
                 </div>
                 )}

                 <div className="bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl group hover:border-white/10 transition-colors">
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Datos Operativos (Visibles Conserjería)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                            Celular Contacto
                          </label>
                          <input 
                            type="text" 
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="+56 9 •••• ••••"
                            className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-[#141414] transition-all text-sm font-medium"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                                Bodega
                              </label>
                              <input 
                                type="text" 
                                value={formData.bodega}
                                onChange={(e) => setFormData({...formData, bodega: e.target.value})}
                                placeholder="Ej: B-12"
                                className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-[#141414] transition-all font-mono tracking-widest text-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                                Estac.
                              </label>
                              <input 
                                type="text" 
                                value={formData.parking}
                                onChange={(e) => setFormData({...formData, parking: e.target.value})}
                                placeholder="Ej: E-45"
                                className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-[#141414] transition-all font-mono tracking-widest text-sm"
                              />
                            </div>
                        </div>
                    </div>
                 </div>
                 
                 <div className="flex justify-end pt-4 gap-4">
                    <button 
                       type="submit"
                       disabled={!formData.name || !formData.depto || !formData.email}
                       className="px-8 py-4 rounded-xl bg-ediflow-primary text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-all active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center gap-2"
                    >
                       Guardar y Enviar Acceso <span className="material-symbols-outlined text-[18px]">send</span>
                    </button>
                 </div>
              </form>
          ) : (
            <>
              {/* Search Bar */}
              <div className="relative mb-8 w-full max-w-2xl">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-xl text-gray-500">search</span>
                <input 
                  type="text"
                  placeholder="Buscar depto, residente o estacionamiento..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-6 rounded-xl border border-white/5 bg-[#111] focus:bg-[#141414] text-sm text-white focus:border-ediflow-primary/50 outline-none transition-all shadow-inner"
                />
              </div>

              {/* Grid view */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                 {isLoading ? (
                    [1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                      <div key={i} className="bg-[#111] border border-white/5 rounded-3xl p-6 animate-pulse flex flex-col items-center">
                         <div className="w-24 h-24 rounded-full bg-white/5 mb-4"></div>
                         <div className="h-4 bg-white/5 w-1/2 rounded mb-2"></div>
                         <div className="h-3 bg-white/5 w-1/3 rounded"></div>
                      </div>
                    ))
                 ) : (
                    filteredUnits.map(unit => (
                       <div key={unit.id} className="bg-[#111] border border-white/5 rounded-[2rem] p-6 flex flex-col items-center text-center shadow-lg hover:border-white/10 hover:shadow-xl transition-all group relative overflow-hidden">
                          {/* Top Tag */}
                          <div className="absolute top-4 right-4 bg-white/5 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest text-gray-400">
                             Dpto {unit.unit_number}
                          </div>

                          {/* Avatar */}
                          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#1A1A1A] border-2 border-white/10 mb-4 overflow-hidden relative shadow-inner group-hover:scale-105 transition-transform duration-500">
                             {unit.profiles?.metadata?.avatar_url ? (
                                <img src={unit.profiles.metadata.avatar_url} alt="Resident Avatar" className="w-full h-full object-cover" />
                             ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 bg-gradient-to-tr from-[#0A0A0A] to-[#141414]">
                                   <span className="material-symbols-outlined text-[32px] md:text-[40px] opacity-50">person</span>
                                </div>
                             )}
                          </div>

                          {/* Details */}
                          <h3 className="font-semibold text-white tracking-tight mb-1">{unit.profiles?.full_name || 'Sin asignación'}</h3>
                          <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-6 truncate max-w-full px-2">
                             {unit.contact_email || unit.profiles?.email || 'Sin correo asociado'}
                          </p>

                          {/* Quick Call Action */}
                          <div className="w-full mt-auto">
                              {unit.profiles?.metadata?.phone ? (
                                <a 
                                  href={`tel:${unit.profiles.metadata.phone}`}
                                  className="w-full py-3 bg-white/5 hover:bg-ediflow-primary hover:text-black border border-white/5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-all shadow-sm group/btn active:scale-95"
                                >
                                  <span className="material-symbols-outlined text-[18px]">call</span>
                                  Llamada Rápida
                                </a>
                              ) : (
                                <button disabled className="w-full py-3 bg-black/50 border border-white/5 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest opacity-50 cursor-not-allowed">
                                  <span className="material-symbols-outlined text-[16px]">phone_disabled</span>
                                  Sin Número
                                </button>
                              )}
                          </div>
                          
                          {/* Admin Only tools */}
                          {role === 'admin' && (
                             <div className="absolute top-4 left-4">
                                <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 text-gray-500 hover:text-white transition-colors">
                                   <span className="material-symbols-outlined text-[16px]">edit</span>
                                </button>
                             </div>
                          )}
                       </div>
                    ))
                 )}
              </div>
              
              {!isLoading && filteredUnits.length === 0 && (
                <div className="text-center py-20 px-6">
                  <span className="material-symbols-outlined text-4xl text-gray-600 mb-3 opacity-50">quick_reference_all</span>
                  <h3 className="text-lg font-light tracking-tight text-white">No hay registros</h3>
                  <p className="text-xs text-gray-500 mt-1">Busque otro término o cree una unidad nueva.</p>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default ResidentDirectory;
