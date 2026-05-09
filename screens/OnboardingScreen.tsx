import React, { useState, useEffect } from 'react';
import { ScreenName } from '../App';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../src/types';
import { validateRut, formatRut } from '../src/lib/validations';
import { supabase } from '../src/lib/supabase-client';

interface Props {
  onComplete: (user: User) => void;
  registeredEmail: string;
}

export const OnboardingScreen: React.FC<Props> = ({ onComplete, registeredEmail }) => {
  const [step, setStep] = useState(1);
  const [buildingName, setBuildingName] = useState('');
  const [buildingRut, setBuildingRut] = useState('');
  const [buildingAddress, setBuildingAddress] = useState('');
  
  // Step 2: Excel Upload
  const [fileValidationStatus, setFileValidationStatus] = useState<'idle' | 'validating' | 'success' | 'warning' | 'error'>('idle');
  
  // Step 3: Bank
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState('Corriente');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load draft from Supabase
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user?.user) return; // Need an authenticated user

        const { data, error } = await supabase
          .from('onboarding_drafts')
          .select('*')
          .eq('user_id', user.user.id)
          .single();

        if (data && !error) {
          setStep(data.step || 1);
          setBuildingName(data.building_name || '');
          setBuildingRut(data.building_rut || '');
          setBuildingAddress(data.building_address || '');
          setBankName(data.bank_name || '');
          setAccountNumber(data.account_number || '');
          setAccountType(data.account_type || 'Corriente');
        }
      } catch (err) {
        console.error("Error loading draft", err);
      }
    };
    loadDraft();
  }, []);

  // Save draft to Supabase on change
  useEffect(() => {
    const saveDraft = async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user?.user) return;

        await supabase.from('onboarding_drafts').upsert({
          user_id: user.user.id,
          step,
          building_name: buildingName,
          building_rut: buildingRut,
          building_address: buildingAddress,
          bank_name: bankName,
          account_number: accountNumber,
          account_type: accountType,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
      } catch (err) {
        console.error("Error saving draft", err);
      }
    };

    // Debounce the save operation to avoid spamming the database
    const timeoutId = setTimeout(() => {
      saveDraft();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [step, buildingName, buildingRut, buildingAddress, bankName, accountNumber, accountType]);

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBuildingRut(formatRut(e.target.value));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
       setFileValidationStatus('validating');
       setErrorMsg(null);
       
      // Simulate parsing logic
       setTimeout(() => {
          // Simulate a validation fault occasionally, but for demo let's say it's valid
          // In real life, we would use SheetJS to parse and check if aliquots sum to 100
          if (e.target.files![0].name.includes('error')) {
              setFileValidationStatus('error');
              setErrorMsg("Error: La suma de alícuotas detectada es 98.5%. Debe sumar exactamente 100%.");
          } else if (e.target.files![0].name.includes('warning') || e.target.files![0].name.includes('tolerance')) {
              // Simulate ±0.01% tolerance issue (e.g. 99.99%)
              setFileValidationStatus('warning');
              setErrorMsg("Tolerancia aceptada: La suma de alícuotas es 99.99%. Aplicando auto-ajuste de +0.01% a la unidad mayor.");
          } else {
              setFileValidationStatus('success');
          }
       }, 1500);
    }
  };

  const finalizeOnboarding = async () => {
    setIsLoading(true);
    
    // Create actual tenant in Supabase
    const newTenantId = crypto.randomUUID();
    const trialStartedAt = new Date().toISOString();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Clear supabase draft
        await supabase.from('onboarding_drafts').delete().eq('user_id', user.id);
        
        // Insert tenant
        const { error: tenantError } = await supabase.from('tenants').insert({
          id: newTenantId,
          name: buildingName,
          address: buildingAddress,
          rut_edificio: buildingRut,
          subscription_status: 'trial',
          trial_started_at: trialStartedAt,
          bank_name: bankName,
          account_number: accountNumber,
          account_type: accountType
        });
        
        if (tenantError) throw tenantError;

        // Update profile
        const { error: profileError } = await supabase.from('profiles').update({
          tenant_id: newTenantId,
          full_name: 'Comité ' + buildingName,
        }).eq('id', user.id);

        if (profileError) throw profileError;

        setIsLoading(false);
        onComplete({
          id: user.id,
          name: 'Comité ' + buildingName,
          email: user.email || registeredEmail,
          role: 'admin',
          tenantId: newTenantId,
          trial_started_at: trialStartedAt
        });
      }
    } catch (err: any) {
      console.error("Error finalizing onboarding", err);
      setErrorMsg(err.message || 'Error al completar el registro.');
      setIsLoading(false);
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (step === 1) {
      if (buildingRut && !validateRut(buildingRut)) {
        setErrorMsg("El RUT de la comunidad no es válido");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Step 2 is now optional
      setStep(3);
    } else {
      finalizeOnboarding();
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
      <div className="absolute top-0 w-full h-1 bg-white/10">
        <motion.div 
          className="h-full bg-ediflow-primary"
          initial={{ width: "0%" }}
          animate={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <motion.div 
        key={step} // Cambia la key para re-animar al cambiar de paso
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-lg"
      >
        <div className="bg-[#111] border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl">
          <div className="mb-8">
            <span className="text-ediflow-primary font-mono text-sm mb-2 block">PASO 0{step} / 03</span>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
              {step === 1 ? 'Datos del Condominio' : step === 2 ? 'Carga de Unidades' : 'Cuentas Bancarias'}
            </h2>
            <p className="text-sm text-gray-400">
              {step === 1 
                ? 'Ingresa la información legal de la comunidad.' 
                : step === 2 
                ? 'Sube el Excel con las unidades y factores de prorrateo.'
                : 'Configura la cuenta para recibir el pago de Gastos Comunes.'}
            </p>
          </div>

          <form onSubmit={handleNext} className="space-y-5">
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-lg flex items-center gap-2 mb-4"
                >
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>
            {step === 1 && (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Nombre Oficial</label>
                  <input
                    type="text"
                    required
                    value={buildingName}
                    onChange={(e) => setBuildingName(e.target.value)}
                    placeholder="Ej: Edificio Los Leones"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-ediflow-primary/50 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">RUT Comunidad (Opcional)</label>
                    <input
                      type="text"
                      value={buildingRut}
                      onChange={handleRutChange}
                      placeholder="65.000.000-0"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-ediflow-primary/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Comuna</label>
                    <input
                      type="text"
                      required
                      placeholder="Providencia"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-ediflow-primary/50 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Dirección Exacta</label>
                  <input
                    type="text"
                    required
                    value={buildingAddress}
                    onChange={(e) => setBuildingAddress(e.target.value)}
                    placeholder="Av. Los Leones 2500"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-ediflow-primary/50 transition-all"
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                 <div className="mb-4">
                     <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                        Sube un archivo Excel (.xlsx o .csv) con las columnas <strong className="text-white">Unidad</strong> y <strong className="text-white">Alícuota (%)</strong>.
                        El sistema verificará automáticamente que la suma total sea exactamente 100%.
                     </p>
                     
                     <input 
                         type="file" 
                         id="excel-upload" 
                         className="hidden" 
                         accept=".xlsx, .xls, .csv"
                         onChange={handleFileUpload}
                     />
                     <label 
                         htmlFor="excel-upload"
                         className={`cursor-pointer flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl transition-colors ${
                            fileValidationStatus === 'error' ? 'border-red-500/50 bg-red-500/5' :
                            fileValidationStatus === 'success' ? 'border-green-500/50 bg-green-500/5' :
                            fileValidationStatus === 'warning' ? 'border-amber-500/50 bg-amber-500/5' :
                            fileValidationStatus === 'validating' ? 'border-ediflow-primary/50 bg-blue-500/5' :
                            'border-white/20 hover:border-ediflow-primary hover:bg-white/5'
                         }`}
                     >
                         {fileValidationStatus === 'validating' ? (
                             <>
                                 <div className="w-8 h-8 border-2 border-ediflow-primary/30 border-t-ediflow-primary rounded-full animate-spin mb-3" />
                                 <span className="text-sm text-ediflow-primary font-medium">Validando integridad (suma = 100%)...</span>
                             </>
                         ) : fileValidationStatus === 'success' ? (
                             <>
                                 <span className="material-symbols-outlined text-green-400 text-4xl mb-2">task_alt</span>
                                 <span className="text-sm text-green-400 font-medium tracking-tight">Estructura validada (Suma = 100%)</span>
                                 <span className="text-[10px] text-gray-500 mt-1 uppercase">Listo para continuar</span>
                             </>
                         ) : fileValidationStatus === 'warning' ? (
                             <>
                                 <span className="material-symbols-outlined text-amber-500 text-4xl mb-2">warning</span>
                                 <span className="text-sm text-amber-400 font-medium">Ajuste de tolerancia aplicado (+0.01%)</span>
                                 <span className="text-[10px] text-amber-500/70 mt-1 uppercase">Listo para continuar</span>
                             </>
                         ) : fileValidationStatus === 'error' ? (
                             <>
                                 <span className="material-symbols-outlined text-red-500 text-4xl mb-2">error</span>
                                 <span className="text-sm text-red-400 font-medium">Error de validación</span>
                                 <span className="text-[10px] text-red-500/70 mt-1 uppercase">Click para reintentar</span>
                             </>
                         ) : (
                             <>
                                 <span className="material-symbols-outlined text-gray-400 text-4xl mb-2">upload_file</span>
                                 <span className="text-sm text-gray-400 font-medium">Click para cargar Excel maestro</span>
                             </>
                         )}
                     </label>
                 </div>

                 <button 
                   type="button"
                   onClick={finalizeOnboarding}
                   className="w-full py-4 text-xs font-bold text-gray-500 hover:text-white transition-all flex items-center justify-center gap-2 border border-white/5 rounded-xl hover:bg-white/5 group mt-2"
                 >
                   CONTINUAR SIN IMPORTAR
                   <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                 </button>
              </>
            )}

            {step === 3 && (
              <>
                 <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Banco</label>
                  <select
                     value={bankName}
                     onChange={(e) => setBankName(e.target.value)}
                     className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-ediflow-primary/50 transition-all appearance-none"
                  >
                     <option value="" disabled>Selecciona el banco...</option>
                     <option value="Banco de Chile">Banco de Chile</option>
                     <option value="Banco Santander">Banco Santander</option>
                     <option value="Banco BCI">Banco BCI</option>
                     <option value="Banco Itaú">Banco Itaú</option>
                     <option value="Banco Estado">Banco Estado</option>
                     <option value="Scotiabank">Scotiabank</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Tipo de Cuenta</label>
                    <select
                       value={accountType}
                       onChange={(e) => setAccountType(e.target.value)}
                       className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-ediflow-primary/50 transition-all appearance-none"
                    >
                       <option value="Corriente">Corriente</option>
                       <option value="Vista">Vista</option>
                       <option value="Ahorro">Ahorro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Número de Cuenta</label>
                    <input
                      type="text"
                      required
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="N° Cuenta"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-ediflow-primary/50 transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center gap-4 pt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="w-14 h-14 shrink-0 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading || (step === 2 && fileValidationStatus !== 'success' && fileValidationStatus !== 'warning')}
                className={`flex-1 font-bold py-4 rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
                   (step === 2 && fileValidationStatus !== 'success' && fileValidationStatus !== 'warning') 
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-ediflow-primary text-black hover:bg-white shadow-[0_0_20px_rgba(0,174,239,0.15)]'
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  step < 3 ? 'Continuar' : 'Finalizar Setup'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
