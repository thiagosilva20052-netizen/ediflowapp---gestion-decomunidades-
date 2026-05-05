import React, { useState, useEffect } from 'react';
import { supabase } from '../src/lib/supabase-client';
import { Logo } from '../components/Logo';
import { User, UserRole } from '../src/types';

interface Props {
  onLogin: (user: User) => void;
  onBack?: () => void;
  initialMode?: 'login' | 'register';
}

const LoginScreen: React.FC<Props> = ({ onLogin, onBack, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Registration steps: 1: Email/Pass, 2: Building Info, 3: Pain Point
  const [registerStep, setRegisterStep] = useState(1);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [units, setUnits] = useState('40');
  const [painPoint, setPainPoint] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password validation
  const isPasswordValid = password.length >= 8;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      });

      if (authError) throw authError;

      if (user) {
        // Fetch profile to get role and tenantId
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        onLogin({
          id: user.id,
          email: user.email!,
          name: profile.full_name || user.email!.split('@')[0],
          role: profile.role,
          tenantId: profile.tenant_id,
          apartment: profile.apartment
        });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Error al iniciar sesión. Por favor verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerStep < 3) {
      setRegisterStep(registerStep + 1);
    } else {
      setLoading(true);
      setError(null);
      try {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.toLowerCase(),
          password: password,
          options: {
            data: {
              building_name: buildingName,
              units_count: units,
              pain_point: painPoint
            }
          }
        });
        
        if (signUpError) throw signUpError;
        
        // Wait, normally OnboardingScreen handles this correctly in our app.
        // It's better if we just alert success or login directly.
        if (data.user) {
          setError("Registro exitoso. Revisa tu correo o inicia sesión ahora.");
          setMode('login');
        }
      } catch (err: any) {
        console.error('Register error:', err);
        setError(err.message || 'Error al registrar la cuenta.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      {/* Left Column: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-32 relative z-10">
        
        {onBack && (
          <button 
            onClick={onBack}
            className="absolute top-8 left-8 sm:left-12 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        )}

        <div className="mb-12">
          <Logo variant="horizontal" color="#FFFFFF" className="scale-90 origin-left" />
        </div>

        <div className="bg-[#111] border border-white/10 p-8 sm:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden">
          {/* Subtle Glow inside Bento Box */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-ediflow-primary/5 rounded-full blur-3xl pointer-events-none"></div>

          {mode === 'login' ? (
            /* ==================== LOGIN FLOW ==================== */
            <div className="relative z-10 transition-all duration-500">
              <h1 className="text-3xl font-medium text-white tracking-tight mb-2">Bienvenido a tu Ediflow.</h1>
              <p className="text-sm text-gray-400 font-light mb-8">Ingresa tus credenciales para acceder al sistema.</p>

              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Correo Electrónico</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-ediflow-primary/50 transition-colors"
                    placeholder="ej. admin@edificio.cl"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">Contraseña</label>
                    <a href="#" className="text-xs text-ediflow-primary hover:text-white transition-colors">¿Olvidaste tu contraseña?</a>
                  </div>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-ediflow-primary/50 transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-ediflow-primary text-black font-bold tracking-tight py-3.5 rounded-xl text-sm hover:bg-white transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Iniciando sesión...' : 'Acceder al Sistema'}
                </button>
              </form>

              {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                  {error}
                </div>
              )}

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  ¿Aún no tienes cuenta?{' '}
                  <button onClick={() => setMode('register')} className="text-ediflow-primary font-medium hover:text-white transition-colors">
                    Registra tu edificio
                  </button>
                </p>
              </div>

            </div>
          ) : (
            /* ==================== REGISTER FLOW ==================== */
            <div className="relative z-10 transition-all duration-500">
              <h1 className="text-3xl font-medium text-white tracking-tight mb-2">
                El centro de comando de tu comunidad, <span className="text-ediflow-primary">listo en 60 segundos.</span>
              </h1>
              <p className="text-sm text-gray-400 font-light mb-8">
                Configura tu edificio ahora. Tus conserjes y residentes tendrán acceso inmediato a este mismo portal seguro.
              </p>

              {/* Progress indicator */}
              <div className="flex items-center gap-2 mb-8">
                {[1, 2, 3].map((step) => (
                  <div key={step} className={`h-1.5 flex-1 rounded-full transition-colors ${step <= registerStep ? 'bg-ediflow-primary' : 'bg-white/10'}`} />
                ))}
              </div>

              <form onSubmit={handleRegisterNext} className="space-y-5">
                {registerStep === 1 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Correo Electrónico (Administrador)</label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-ediflow-primary/50 transition-colors"
                        placeholder="tu@correo.com"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Crear Contraseña</label>
                      <div className="relative">
                        <input 
                          type="password" 
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`w-full bg-black/50 border rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-colors ${password.length > 0 ? (isPasswordValid ? 'border-green-500/50' : 'border-ediflow-primary/50') : 'border-white/10'}`}
                          placeholder="Mínimo 8 caracteres"
                        />
                        {password.length > 0 && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                            {isPasswordValid ? (
                              <span className="material-symbols-outlined text-green-400 text-[18px]">check_circle</span>
                            ) : (
                              <span className="material-symbols-outlined text-ediflow-primary text-[18px]">pending</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {registerStep === 2 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-8 duration-500">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Nombre del Edificio o Comunidad</label>
                      <input 
                        type="text" 
                        required
                        value={buildingName}
                        onChange={(e) => setBuildingName(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-ediflow-primary/50 transition-colors"
                        placeholder="Ej. Edificio Los Jazmines"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Cantidad de Unidades (Deptos/Casas)</label>
                      <input 
                        type="number" 
                        required
                        min="1"
                        value={units}
                        onChange={(e) => setUnits(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-ediflow-primary/50 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {registerStep === 3 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-8 duration-500">
                    <label className="block text-sm font-medium text-white mb-4">
                      Para configurar tu panel IA, ¿Cuál es tu mayor dolor de cabeza actual?
                    </label>
                    <div className="space-y-3">
                      {[
                        { id: 'packages', label: 'Sobrecarga en gestión de paquetes y encomiendas.' },
                        { id: 'expenses', label: 'Morosidad y desorden en cobro de gastos comunes.' },
                        { id: 'concierge', label: 'Falta de control e informalidad en conserjería (visitas/bitácora).' },
                      ].map((option) => (
                        <label 
                          key={option.id}
                          className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${painPoint === option.id ? 'bg-ediflow-primary/10 border-ediflow-primary' : 'bg-black/50 border-white/10 hover:border-white/30'}`}
                        >
                          <input 
                            type="radio" 
                            name="painPoint" 
                            value={option.id}
                            checked={painPoint === option.id}
                            onChange={(e) => setPainPoint(e.target.value)}
                            className="mt-0.5 accent-ediflow-primary"
                            required
                          />
                          <span className="text-sm text-gray-200">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                    {error}
                  </div>
                )}
                <div className="pt-4 flex gap-3">
                  {registerStep > 1 && (
                    <button 
                      type="button"
                      onClick={() => setRegisterStep(registerStep - 1)}
                      className="px-4 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors text-sm flex items-center justify-center"
                    >
                      Volver
                    </button>
                  )}
                  <button 
                    type="submit"
                    className="flex-1 bg-ediflow-primary text-black font-bold tracking-tight py-3.5 rounded-xl text-sm hover:bg-white transition-colors"
                  >
                    {registerStep === 3 ? 'Crear mi Edificio' : 'Continuar'}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  ¿Ya tienes tu comunidad registrada?{' '}
                  <button onClick={() => { setMode('login'); setRegisterStep(1); }} className="text-ediflow-primary font-medium hover:text-white transition-colors">
                    Iniciar Sesión
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Abstract Triad 3D Representation */}
      <div className="hidden lg:flex w-1/2 bg-[#050505] relative items-center justify-center overflow-hidden border-l border-white/5">
        {/* Glow Effects corresponding to Triad colors: Cyan (Admin), Amber (Concierge), Emerald (Resident) */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00AEEF]/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '5s' }}></div>
        
        {/* Abstract 3D/Isometric representation layer */}
        <div className="relative z-10 text-center">
           <div className="w-[400px] h-[400px] rounded-full border border-white/5 relative flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <div className="w-[300px] h-[300px] rounded-full border border-white/10 absolute animate-[spin_20s_linear_infinite]" />
              <div className="w-[200px] h-[200px] rounded-full border border-white/10 absolute animate-[spin_15s_linear_infinite_reverse]" />
              {/* Nodes */}
              <div className="absolute top-10 right-20 w-4 h-4 bg-[#00AEEF] rounded-full shadow-[0_0_20px_rgba(0,174,239,0.8)]" />
              <div className="absolute bottom-20 left-10 w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_20px_rgba(52,211,153,0.8)]" />
              <div className="absolute top-1/2 right-12 w-4 h-4 bg-amber-400 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.8)]" />
              
              <div className="flex flex-col items-center justify-center">
                 <span className="material-symbols-outlined text-white/80 text-5xl mb-4 font-light">domain</span>
                 <p className="text-white/80 font-medium tracking-widest uppercase text-xs">Ecosistema Ediflow</p>
                 <p className="text-gray-500/80 font-light text-[10px] mt-2">100% Interconectado</p>
              </div>
           </div>
        </div>

        {/* Ambient overlay lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>
    </div>
  );
};

export default LoginScreen;
