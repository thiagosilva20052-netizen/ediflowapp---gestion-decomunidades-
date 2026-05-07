import React, { useState, useEffect } from 'react';
import type { ScreenName } from '../App';
import { motion, AnimatePresence } from 'motion/react';
import { BuildingData, User } from '../src/types';
import { validateRut, formatRut } from '../src/lib/validations';
import { supabase } from '../src/lib/supabase-client';

interface Props {
  onComplete: (user: User) => void;
}

export const OnboardingScreen: React.FC<Props> = ({ onComplete }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [buildingData, setBuildingData] = useState<BuildingData>({ name: '', rut: '', address: '', commune: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted && session?.user) {
          setCurrentUser(session.user);
        } else if (isMounted) {
          // If no session, try getting user directly but safely
          const { data: { user } } = await supabase.auth.getUser();
          if (user) setCurrentUser(user);
        }
      } catch (err) {
        console.error("Error fetching user in Onboarding:", err);
      }
    };
    fetchUser();
    return () => { isMounted = false; };
  }, []);

  // Persistence: Save draft to Supabase on every change
  useEffect(() => {
    if (!currentUser) return;
    
    const saveDraft = async () => {
      await supabase.from('onboarding_drafts').upsert({
        user_id: currentUser.id,
        step: 1,
        building_name: buildingData.name,
        building_rut: buildingData.rut,
        building_address: buildingData.address,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    };

    const timeoutId = setTimeout(saveDraft, 2000);
    return () => clearTimeout(timeoutId);
  }, [buildingData, currentUser]);

  // Load draft on mount
  useEffect(() => {
    const loadDraft = async () => {
      if (!currentUser) return;
      
      const { data, error } = await supabase
        .from('onboarding_drafts')
        .select('*')
        .eq('user_id', currentUser.id)
        .maybeSingle();
      
      if (data && !error) {
      if (data && !error) {
        setBuildingData({
          name: data.building_name || '',
          rut: data.building_rut || '',
          address: data.building_address || '',
          commune: '' // Not in drafts schema
        });
      }
      }
    };
    loadDraft();
  }, [currentUser]);

  const finalizeOnboarding = async () => {
    // Ensure we have a user, if not try to get it one last time
    let user = currentUser;
    if (!user) {
      const { data: { user: freshUser } } = await supabase.auth.getUser();
      user = freshUser;
    }

    if (!user) {
      setErrorMsg("No se detectó una sesión activa. Por favor, reincie el proceso.");
      return;
    }
    
    setIsLoading(true);
    try {
      const newTenantId = crypto.randomUUID();
      const trialStartedAt = new Date().toISOString();

      // 1. Insert tenant
      const { error: tenantError } = await supabase.from('tenants').insert({
        id: newTenantId,
        name: buildingData.name,
        address: buildingData.address,
        rut_edificio: buildingData.rut,
        subscription_status: 'trial',
        trial_started_at: trialStartedAt
      });

      if (tenantError) throw tenantError;

      // 3. Update profile
      const { error: profileError } = await supabase.from('profiles').update({
        tenant_id: newTenantId,
        role: 'admin',
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Administrador'
      }).eq('id', user.id);

      if (profileError) throw profileError;

      // 4. Clear draft
      await supabase.from('onboarding_drafts').delete().eq('user_id', user.id);

      // 5. Complete
      onComplete({
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Administrador',
        role: 'admin',
        tenantId: newTenantId,
        trial_started_at: trialStartedAt
      });
      
    } catch (err: any) {
      console.error("Error finalizing onboarding:", err);
      setErrorMsg(err.message || "Error al finalizar el registro. Por favor intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (buildingData.rut && !validateRut(buildingData.rut)) {
      setErrorMsg("El RUT de la comunidad no es válido");
      return;
    }
    
    finalizeOnboarding();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
      <div className="absolute top-0 w-full h-1 bg-white/10">
        <motion.div 
          className="h-full bg-ediflow-primary"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <motion.div 
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-lg"
      >
        <div className="bg-[#111] border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl">
          <div className="mb-8">
            <span className="text-ediflow-primary font-mono text-sm mb-2 block">CONFIGURACIÓN INICIAL</span>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
              Datos del Condominio
            </h2>
            <p className="text-sm text-gray-400">
              Ingresa la información básica de la comunidad para comenzar.
            </p>
          </div>

          <form onSubmit={handleNext} className="space-y-5">
            <AnimatePresence mode="wait">
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
                    value={buildingData.name}
                    onChange={(e) => setBuildingData({...buildingData, name: e.target.value})}
                    placeholder="Ej: Edificio Los Leones"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-ediflow-primary/50 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">RUT Comunidad (Opcional)</label>
                    <input
                      type="text"
                      value={buildingData.rut}
                      onChange={(e) => setBuildingData({...buildingData, rut: formatRut(e.target.value)})}
                      placeholder="65.000.000-0"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-ediflow-primary/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Comuna</label>
                    <input
                      type="text"
                      required
                      value={buildingData.commune}
                      onChange={(e) => setBuildingData({...buildingData, commune: e.target.value})}
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
                    value={buildingData.address}
                    onChange={(e) => setBuildingData({...buildingData, address: e.target.value})}
                    placeholder="Av. Los Leones 2500"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-ediflow-primary/50 transition-all"
                  />
                </div>
              </>
            )}

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full font-bold py-4 rounded-xl bg-ediflow-primary text-black hover:bg-white shadow-[0_0_20px_rgba(0,174,239,0.15)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  'Finalizar Registro'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
