import React, { useState } from 'react';
import { ScreenName } from '../App';
import { supabase } from '../src/lib/supabase-client';
import { useAppContext } from '../src/context/AppContext';

interface Props {
  navigate: (screen: ScreenName) => void;
}

export const BuildingSettings: React.FC<Props> = ({ navigate }) => {
  const { currentTenant, updateTenant } = useAppContext();
  const [activeTab, setActiveTab] = useState<'general' | 'modules'>('general');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: currentTenant?.name || '',
    rut: currentTenant?.rut_edificio || '',
    address: currentTenant?.address || '',
    bankAccount: currentTenant?.config?.bank_account || '',
    bankName: currentTenant?.config?.bank_name || '',
    bankType: currentTenant?.config?.bank_type || 'Corriente',
    adminEmail: currentTenant?.config?.admin_email || '',
    adminPhone: currentTenant?.config?.admin_phone || '',
    unitsCount: currentTenant?.config?.units_count || '120',
  });

  const formatRUT = (value: string) => {
    let clean = value.replace(/[^0-9kK]/g, '');
    if (clean.length <= 1) return clean;
    
    let result = '';
    let dv = clean.slice(-1);
    let numbers = clean.slice(0, -1);
    
    // Reverse numbers to add dots every 3 digits
    let count = 0;
    for (let i = numbers.length - 1; i >= 0; i--) {
      result = numbers[i] + result;
      count++;
      if (count === 3 && i !== 0) {
        result = '.' + result;
        count = 0;
      }
    }
    
    return result + '-' + dv.toUpperCase();
  };

  const handleRUTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Only format if adding characters
    if (raw.length < formData.rut.length) {
        setFormData({...formData, rut: raw});
        return;
    }
    const formatted = formatRUT(raw);
    setFormData({...formData, rut: formatted});
  };

  const [isImporting, setIsImporting] = useState(false);
  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !currentTenant) return;
    
    setIsImporting(true);
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(l => l.trim() !== '');
        
        // Expecting: UnitNumber,Aliquot (e.g. 101,0.0125)
        const unitsToInsert = lines.map(line => {
          const [num, factor] = line.split(',');
          return {
            tenant_id: currentTenant.id,
            unit_number: num.trim(),
            proration_factor: parseFloat(factor.trim()),
            status: 'active'
          };
        });

        const { error } = await supabase.from('units').insert(unitsToInsert);
        if (error) throw error;

        showToast(`${unitsToInsert.length} unidades importadas con éxito.`);
      } catch (err) {
        console.error(err);
        showToast("Error en formato CSV. Use: NumeroUnidad,Alicuota");
      } finally {
        setIsImporting(false);
        if (e.target) e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    setIsSaving(true);
    try {
      const { error } = await supabase.from('tenants').update({
        name: formData.name,
        address: formData.address,
        rut_edificio: formData.rut,
        config: {
          ...currentTenant.config,
          bank_account: formData.bankAccount,
          bank_name: formData.bankName,
          bank_type: formData.bankType,
          admin_email: formData.adminEmail,
          admin_phone: formData.adminPhone,
          units_count: formData.unitsCount
        }
      }).eq('id', currentTenant.id);

      if (error) throw error;
      
      showToast('Configuraciones guardadas exitosamente.');
      // Ideally refresh the global context here
    } catch (err) {
      console.error(err);
      showToast('Error al guardar configuraciones.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white font-sans overflow-x-hidden relative items-center selection:bg-white/10">
      <div className="w-full max-w-5xl flex flex-col h-full relative z-10">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2 animate-fade-in-up whitespace-nowrap">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            {toastMessage}
          </div>
        )}

        {/* Sticky Header */}
        <header className="px-6 pt-8 md:pt-12 pb-6 sticky top-0 z-20 bg-[#0A0A0A]/90 backdrop-blur-3xl border-b border-white/5 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 pointer-events-auto">
              <button 
                onClick={() => navigate('AdminDashboard')}
                className="w-12 h-12 rounded-xl bg-[#111] hover:bg-[#1A1A1A] active:scale-95 transition-all text-white border border-white/5 flex items-center justify-center shadow-lg group relative"
              >
                <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform relative z-10">arrow_back</span>
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-white leading-tight">Configuración</h1>
                <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-[0.2em]">Perfil de la Comunidad</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#111] p-1.5 rounded-xl border border-white/5 pointer-events-auto">
                <button 
                  onClick={() => setActiveTab('general')}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'general' ? 'bg-[#222] text-white shadow-md' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                >
                  General
                </button>
                <button 
                  onClick={() => setActiveTab('modules')}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'modules' ? 'bg-[#222] text-white shadow-md' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                >
                  Módulos
                </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-6 flex-1 overflow-y-auto no-scrollbar pb-32 pt-8 w-full">
          
          {activeTab === 'general' && (
            <form onSubmit={handleSave} className="space-y-8 animate-fade-in">
                
                {/* Brand Logo Section */}
                <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl flex flex-col md:flex-row gap-8 items-center border-l-4 border-l-ediflow-primary">
                   <div className="w-32 h-32 rounded-2xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                      <span className="material-symbols-outlined text-5xl text-white/20 group-hover:scale-110 transition-transform">domain</span>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <span className="text-[10px] uppercase tracking-widest font-bold text-white">Subir Logo</span>
                      </div>
                   </div>
                   <div className="flex-1 text-center md:text-left">
                      <h2 className="text-xl font-light tracking-tight text-white mb-2">Identidad Visual</h2>
                      <p className="text-sm text-gray-400">Sube el logo de tu edificio para personalizar las boletas de gastos comunes y la interfaz de los residentes. <br/>(Recomendado: 512x512px, PNG transparente).</p>
                   </div>
                </div>

                {/* Legal Information */}
                <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 pb-4 border-b border-white/5">Datos Administrativos</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                            Nombre del Edificio / Condominio
                          </label>
                          <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white focus:outline-none focus:border-ediflow-primary/50 focus:bg-[#141414] focus:ring-1 focus:ring-ediflow-primary/50 transition-all text-sm font-medium"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                            RUT de la Comunidad (Opcional)
                          </label>
                          <input 
                            type="text" 
                            placeholder="Ej: 76.123.456-K"
                            value={formData.rut}
                            onChange={handleRUTChange}
                            maxLength={12}
                            className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white focus:outline-none focus:border-white/20 focus:bg-[#141414] transition-all font-mono tracking-widest text-sm"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                            Dirección Completa
                          </label>
                          <input 
                            type="text" 
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white focus:outline-none focus:border-white/20 focus:bg-[#141414] transition-all text-sm"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                            Cantidad de Unidades (Deptos/Casas)
                          </label>
                          <input 
                            type="number" 
                            value={formData.unitsCount}
                            onChange={(e) => setFormData({...formData, unitsCount: e.target.value})}
                            className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white focus:outline-none focus:border-white/20 focus:bg-[#141414] transition-all font-mono text-sm"
                          />
                        </div>
                    </div>
                </div>

                {/* Bulk Import Section */}
                <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl border-l-4 border-l-blue-500 overflow-hidden relative group">
                    <div className="absolute right-[-20px] top-[-20px] opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="material-symbols-outlined text-[120px]">upload_file</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="max-w-md">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">database</span>
                                Carga Masiva de Unidades
                            </h3>
                            <p className="text-sm text-gray-400">
                                Sube un archivo CSV con la lista de departamentos y sus alícuotas para configurar el edificio rápidamente.
                            </p>
                            <p className="text-[10px] text-gray-600 mt-2 font-mono">Formato: NumeroUnidad,FactorProrrateo (Ej: 101,0.0085)</p>
                        </div>
                        <label className={`cursor-pointer px-8 py-4 rounded-xl font-bold text-xs flex items-center gap-3 transition-all ${
                          isImporting ? 'bg-gray-800 text-gray-500' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                        }`}>
                            <span className="material-symbols-outlined text-[20px]">{isImporting ? 'sync' : 'cloud_upload'}</span>
                            {isImporting ? 'PROCESANDO...' : 'SUBIR LISTA CSV'}
                            <input 
                              type="file" 
                              accept=".csv" 
                              className="hidden" 
                              onChange={handleCSVImport}
                              disabled={isImporting}
                            />
                        </label>
                    </div>
                </div>

                {/* Bank Information (New Section) */}
                <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl border-l-4 border-l-amber-500">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 pb-4 border-b border-white/5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">account_balance</span>
                        Cuenta Bancaria de la Comunidad
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                            Banco
                          </label>
                          <input 
                            type="text" 
                            placeholder="Ej: Banco Estado"
                            value={formData.bankName}
                            onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                            className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white focus:outline-none focus:border-white/20 focus:bg-[#141414] transition-all text-sm font-medium"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                            Tipo de Cuenta
                          </label>
                          <select 
                            value={formData.bankType}
                            onChange={(e) => setFormData({...formData, bankType: e.target.value})}
                            className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white focus:outline-none focus:border-white/20 focus:bg-[#141414] transition-all text-sm font-medium appearance-none"
                          >
                            <option value="Corriente">Cuenta Corriente</option>
                            <option value="Vista">Cuenta Vista / RUT</option>
                            <option value="Ahorro">Cuenta de Ahorro</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                            Número de Cuenta
                          </label>
                          <input 
                            type="text" 
                            placeholder="Ej: 123456789"
                            value={formData.bankAccount}
                            onChange={(e) => setFormData({...formData, bankAccount: e.target.value})}
                            className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white focus:outline-none focus:border-white/20 focus:bg-[#141414] transition-all font-mono tracking-widest text-sm"
                          />
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 pb-4 border-b border-white/5">Contacto Principal (Administración)</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                            Correo Electrónico Principal
                          </label>
                          <input 
                            type="email" 
                            value={formData.adminEmail}
                            onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                            className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white focus:outline-none focus:border-white/20 focus:bg-[#141414] transition-all text-sm font-medium"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                            Teléfono Fijo / Celular Oficial
                          </label>
                          <input 
                            type="text" 
                            value={formData.adminPhone}
                            onChange={(e) => setFormData({...formData, adminPhone: e.target.value})}
                            className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white focus:outline-none focus:border-white/20 focus:bg-[#141414] transition-all font-mono tracking-widest text-sm"
                            required
                          />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                     type="submit"
                     className="px-8 py-4 rounded-xl bg-ediflow-primary text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-all active:scale-95 shadow-[0_0_20px_rgba(0,174,239,0.2)] flex items-center gap-2"
                  >
                     Guardar Configuración <span className="material-symbols-outlined text-[18px]">save</span>
                  </button>
                </div>
            </form>
          )}

          {activeTab === 'modules' && (
             <div className="space-y-6 animate-fade-in">
                <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                    <div className="flex items-center justify-between mb-2">
                       <div>
                         <h3 className="text-lg font-medium tracking-tight text-white mb-1">Módulos Activos</h3>
                         <p className="text-sm text-gray-400">Activa o desactiva las funcionalidades para los residentes y conserjes del edificio.</p>
                       </div>
                       <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-green-500/20">Suscripción SaaS Activa</span>
                    </div>

                    <div className="mt-8 space-y-4">
                       {[
                         { id: '1', name: 'Gestión de Paquetes', desc: 'Registro, trazabilidad y notificaciones de entrada/salida de encomiendas.', active: true },
                         { id: '2', name: 'Libro de Novedades (Bitácora)', desc: 'Registro digital de sucesos, con lectura mediante OCR y dictado de voz para conserjería.', active: true },
                         { id: '3', name: 'Control de Visitas', desc: 'Registro automatizado de visitas, con códigos de acceso.', active: true },
                         { id: '4', name: 'Reservas de Áreas Comunes', desc: 'Sistema de agendamiento para piscinas, quinchos y salas multiuso.', active: true },
                         { id: '5', name: 'Pago de Gastos Comunes', desc: 'Integración bancaria pasarela para residentes.', active: false },
                       ].map(module => (
                          <div key={module.id} className={`p-5 rounded-2xl border ${module.active ? 'bg-white/5 border-ediflow-primary/30' : 'bg-[#0A0A0A] border-white/5'} flex items-center justify-between transition-colors`}>
                             <div>
                               <h4 className={`text-sm font-bold ${module.active ? 'text-ediflow-primary' : 'text-gray-400'}`}>{module.name}</h4>
                               <p className="text-xs text-gray-500 mt-1">{module.desc}</p>
                             </div>
                             
                             <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${module.active ? 'bg-ediflow-primary' : 'bg-[#222]'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${module.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                             </div>
                          </div>
                       ))}
                    </div>
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default BuildingSettings;
