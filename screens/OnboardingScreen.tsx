import React, { useState } from 'react';
import { ScreenName } from '../App';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../src/types';
import { validateRut, formatRut } from '../src/lib/validations';

interface Props {
  onComplete: (user: User) => void;
  registeredEmail: string;
}

export const OnboardingScreen: React.FC<Props> = ({ onComplete, registeredEmail }) => {
  const [step, setStep] = useState(1);
  const [buildingName, setBuildingName] = useState('');
  const [buildingRut, setBuildingRut] = useState('');
  const [buildingAddress, setBuildingAddress] = useState('');
  const [units, setUnits] = useState('40');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBuildingRut(formatRut(e.target.value));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (step === 1) {
      if (!validateRut(buildingRut)) {
        setErrorMsg("El RUT de la comunidad no es válido");
        return;
      }
      setStep(step + 1);
    } else {
      setIsLoading(true);
      // Simulate Database Insertion for Tenant
      setTimeout(() => {
        setIsLoading(false);
        // Creamos la sesión para la cuenta maestra, que tiene rol 'admin' (Comité/Dueño)
        onComplete({
          id: 'user-' + Math.random(),
          name: 'Comité ' + buildingName,
          email: registeredEmail,
          role: 'admin',
          tenantId: 'tenant-new-' + Math.random() // Simulation of generated UUID
        });
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
      <div className="absolute top-0 w-full h-1 bg-white/10">
        <motion.div 
          className="h-full bg-ediflow-primary"
          initial={{ width: "0%" }}
          animate={{ width: step === 1 ? "50%" : "100%" }}
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
            <span className="text-ediflow-primary font-mono text-sm mb-2 block">PASO 0{step} / 02</span>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
              {step === 1 ? 'Datos del Condominio' : 'Estructura'}
            </h2>
            <p className="text-sm text-gray-400">
              {step === 1 
                ? 'Ingresa la información legal de la comunidad.' 
                : 'Configura las unidades para establecer base de datos.'}
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
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">RUT Comunidad</label>
                    <input
                      type="text"
                      required
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
                 <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Cantidad de Departamentos / Casas</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="500"
                      value={units}
                      onChange={(e) => setUnits(e.target.value)}
                      className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-ediflow-primary"
                    />
                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-20 text-center shrink-0">
                      <span className="text-lg font-bold text-white">{units}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-4">
                  <span className="material-symbols-outlined text-ediflow-primary">admin_panel_settings</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">Delegación de Accesos</h4>
                    <p className="text-xs text-gray-400 mt-1">Una vez finalizado, podrás enviar invitaciones al Administrador de turno y a tu equipo de Conserjes.</p>
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
                disabled={isLoading}
                className="flex-1 bg-ediflow-primary text-black font-bold py-4 rounded-xl hover:bg-white active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,174,239,0.15)] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  step === 1 ? 'Continuar' : 'Finalizar Setup'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
