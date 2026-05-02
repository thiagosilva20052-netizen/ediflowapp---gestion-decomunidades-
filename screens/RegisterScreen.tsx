import React, { useState } from 'react';
import { ScreenName } from '../App';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../components/Logo';
import { validateEmail, validatePassword } from '../src/lib/validations';

interface Props {
  onRegisterDetails: (details: any) => void;
  navigate: (screen: ScreenName) => void;
}

export const RegisterScreen: React.FC<Props> = ({ onRegisterDetails, navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!validateEmail(email)) {
      setErrorMsg("Formato de correo inválido");
      return;
    }

    const { isValid, message } = validatePassword(password);
    if (!isValid) {
      setErrorMsg(message);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden");
      return;
    }
    
    setIsLoading(true);
    // Simular registro en Supabase Auth
    setTimeout(() => {
      setIsLoading(false);
      // Avanzamos al Onboarding del Edificio
      onRegisterDetails({ email });
      navigate('Onboarding');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4 selection:bg-ediflow-primary/20">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-ediflow-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex justify-center mb-10 cursor-pointer" onClick={() => navigate('Landing')}>
          <Logo />
        </div>

        <div className="bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Crear Comunidad</h2>
            <p className="text-sm text-gray-400">
              Usa el correo oficial del comité o edificio. La comunidad será la dueña de los datos.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
                Correo Institucional
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="comite@edificio.cl"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-ediflow-primary/50 focus:border-ediflow-primary transition-all"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-ediflow-primary/50 focus:border-ediflow-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-ediflow-primary/50 focus:border-ediflow-primary transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-ediflow-primary text-black font-bold py-4 rounded-xl mt-6 hover:bg-white active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,174,239,0.15)] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                'Blindar Edificio'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-8">
            ¿Ya tienes tu comunidad registrada?{' '}
            <button onClick={() => navigate('Login')} className="text-ediflow-primary hover:text-white font-bold transition-colors">
              Iniciar Sesión
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
