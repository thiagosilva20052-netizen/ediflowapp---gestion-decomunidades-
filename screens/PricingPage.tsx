import React, { useState, useEffect } from 'react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';

interface Props {
  onLoginClick: () => void;
  onNavigate?: (screen: any) => void;
}

const PricingPage: React.FC<Props> = ({ onLoginClick, onNavigate }) => {
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const [isAnnual, setIsAnnual] = useState(false);
  const [unitsCount, setUnitsCount] = useState<number>(40);

  // Dynamic price calculation
  const getMonthlyPrice = () => {
    const billableUnits = Math.max(40, unitsCount);
    return billableUnits * 2000;
  };

  const getAnnualPrice = () => {
    // 2 months free = 10 months of billing per year
    const billableUnits = Math.max(40, unitsCount);
    return billableUnits * 2000 * 10;
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('es-CL');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const newOpacity = Math.min(currentScroll / 500, 0.9);
      setScrollOpacity(newOpacity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white font-sans selection:bg-ediflow-primary/10 selection:text-gray-900 min-h-screen flex flex-col overflow-x-hidden transition-colors duration-300">
      {/* Sticky Navigation Bar */}
      <header className={`fixed top-0 inset-x-0 w-full z-50 transition-all duration-500 ease-in-out ${scrollOpacity > 0.05 ? 'bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105" onClick={() => onNavigate && onNavigate('Landing')}>
            <Logo variant="horizontal" color="currentColor" className="scale-[0.8] origin-left" />
          </div>

          <nav className="hidden lg:flex items-center gap-10">
            <div 
              onClick={() => onNavigate && onNavigate('Landing')}
              className="cursor-pointer text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Inicio
            </div>
            <div 
              onClick={() => onNavigate && onNavigate('Solutions')}
              className="group relative cursor-pointer flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Soluciones <span className="material-symbols-outlined text-[14px] group-hover:rotate-180 transition-transform">expand_more</span>
            </div>
            <div 
              onClick={() => onNavigate && onNavigate('Resources')}
              className="cursor-pointer text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Recursos
            </div>
            <div 
              className="cursor-pointer text-sm font-bold text-gray-900 dark:text-white transition-colors"
            >
              Precios
            </div>
          </nav>

          <div className="flex items-center gap-4 lg:gap-6">
            <ThemeToggle />
            <button 
              onClick={onLoginClick} 
              className="hidden md:block text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Iniciar Sesión
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('Register')}
              className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold tracking-tight hover:bg-ediflow-primary transition-all shadow-xl flex items-center gap-2"
            >
              Comenzar Prueba
            </button>
          </div>
        </div>
      </header>

      {/* Main Pricing Section */}
      <section className="pt-40 pb-20 px-6 lg:px-16 flex-1 flex flex-col items-center relative z-10 w-full overflow-hidden text-gray-900 dark:text-white">
        
        {/* Subdued Glow Background */}
        <div className="absolute top-40 inset-x-0 mx-auto w-full max-w-[800px] h-[300px] bg-blue-50 dark:bg-blue-900/10 blur-[120px] rounded-[100%] pointer-events-none z-0"></div>

        <div className="max-w-4xl mx-auto space-y-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-tight">
            Planes transparentes. <br/>
            <span className="font-serif italic text-ediflow-primary">Privacidad blindada.</span>
          </h1>
          <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 font-light max-w-2xl mx-auto leading-relaxed mt-6">
            Elige el plan ideal según el tamaño de tu comunidad. Todos los planes incluyen nuestro protocolo de privacidad estricto y protección de datos financieros de nivel empresarial.
          </p>

          {/* Billing Toggle */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <span className={`text-sm font-bold transition-colors uppercase tracking-widest ${!isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>Mensual</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-7 bg-gray-100 dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10 relative transition-colors focus:outline-none focus:ring-2 focus:ring-ediflow-primary/50"
            >
              <div className={`w-5 h-5 shadow-sm border border-gray-200 dark:border-white/10 rounded-full absolute top-[3px] transition-all duration-300 ease-in-out ${isAnnual ? 'translate-x-[26px] bg-ediflow-primary border-ediflow-primary' : 'translate-x-[3px] bg-white'}`}></div>
            </button>
            <span className={`text-sm font-bold transition-colors flex items-center gap-2 uppercase tracking-widest ${isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
              Anual <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-800/30 italic">2 Meses Gratis</span>
            </span>
          </div>
        </div>

        {/* Pricing Card (Bento Box Style) */}
        <div className="max-w-3xl mx-auto mt-16 relative z-10 w-full mb-12 text-left">
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 relative rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden">
             
             {/* Dynamic Setup & Price */}
             <div className="flex flex-col mb-10 border-b border-gray-100 dark:border-white/5 pb-10">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                 
                 {/* Slider Area */}
                 <div className="flex-1">
                   <h3 className="text-2xl font-bold mb-2 tracking-tight">Tamaño de la Comunidad</h3>
                   <p className="text-sm text-gray-500 dark:text-gray-400 font-light mb-6">Selecciona la cantidad de departamentos o casas.</p>
                   
                   <div className="flex items-center gap-4">
                     <input 
                        type="range" 
                        min="1" 
                        max="500" 
                        value={unitsCount} 
                        onChange={(e) => setUnitsCount(Number(e.target.value))}
                        className="w-full h-2 bg-gray-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-ediflow-primary"
                     />
                     <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 w-24 text-center shrink-0">
                        <span className="text-xl font-bold">{unitsCount}</span>
                     </div>
                   </div>
                   {unitsCount < 40 && (
                      <p className="text-[10px] text-ediflow-primary font-bold uppercase tracking-widest mt-3">
                        * Facturación base de 40 unidades aplicada.
                      </p>
                   )}
                 </div>

                 {/* Calculated Price */}
                 <div className="flex flex-col items-start md:items-end md:pl-8 md:border-l md:border-gray-100 dark:border-white/5">
                   <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold mb-1 uppercase tracking-widest">Total Estimado</span>
                   <div className="flex items-baseline gap-2">
                     <span className="text-5xl md:text-6xl font-light tracking-tighter">${formatPrice(isAnnual ? getAnnualPrice() : getMonthlyPrice())}</span>
                   </div>
                   <span className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-bold uppercase tracking-widest">{isAnnual ? 'Facturado Anualmente' : 'Mensual + IVA'}</span>
                 </div>
               </div>
             </div>

             {/* Features Bento */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
               <div>
                 <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6 px-1">Módulo Todo Incluido</h4>
                 <ul className="space-y-4">
                   <li className="flex items-start gap-4">
                     <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800/30">
                       <span className="material-symbols-outlined text-[12px] text-blue-600 dark:text-blue-400 font-bold">check</span>
                     </div>
                     <div>
                       <p className="text-sm font-bold">Automatización Activa</p>
                       <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Conciliación bancaria y OCR ilimitado.</p>
                     </div>
                   </li>
                   <li className="flex items-start gap-4">
                     <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800/30">
                       <span className="material-symbols-outlined text-[12px] text-blue-600 dark:text-blue-400 font-bold">check</span>
                     </div>
                     <div>
                       <p className="text-sm font-bold">Conserjería Inteligente</p>
                       <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Control de acceso, bitácora y visitas.</p>
                     </div>
                   </li>
                   <li className="flex items-start gap-4">
                     <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800/30">
                       <span className="material-symbols-outlined text-[12px] text-blue-600 dark:text-blue-400 font-bold">check</span>
                     </div>
                     <div>
                       <p className="text-sm font-bold">App Residente & Pagos</p>
                       <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Súper App con pasarela (0% comisión Ediflow).</p>
                     </div>
                   </li>
                 </ul>
               </div>

               <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-6 h-full flex flex-col justify-center">
                   <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl mb-3">verified_user</span>
                   <p className="text-sm font-bold mb-1 tracking-tight">Privacidad Certificada</p>
                   <p className="text-xs text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                     Sin cobros sorpresa por "nube". Tu información financiera está encriptada y protegida bajo convenios de confidencialidad estricta para la tranquilidad de la comunidad.
                   </p>
               </div>
             </div>

             <button 
               onClick={() => onNavigate && onNavigate('Register')}
               className="group w-full bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-2xl py-5 text-sm font-bold uppercase tracking-widest hover:bg-ediflow-primary dark:hover:bg-ediflow-primary dark:hover:text-white active:scale-[0.98] transition-all shadow-xl flex flex-col items-center justify-center gap-1 mx-auto"
             >
               <div className="flex items-center gap-2">
                 Comenzar 14 días gratis
                 <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
               </div>
             </button>
             <p className="text-center mt-6 text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">
                🔒 Tus datos están respaldados por nuestro Trust Center.
             </p>
          </div>
        </div>

        {/* Trust Center Section */}
        <div className="max-w-3xl mx-auto w-full mb-24 relative z-10 flex flex-col items-center">
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-full px-6 py-2 flex items-center gap-3 mb-6 shadow-sm">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[18px]">verified</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Trust Center Ediflow</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-lg mb-8 font-light leading-relaxed">
              La seguridad de los datos financieros y personales de tu comunidad es nuestra prioridad #1. Cumplimos con estándares SOC 2 y garantizamos la encriptación de grado bancario.
            </p>
            <div className="flex gap-4">
               <button 
                 onClick={() => onNavigate && onNavigate('Privacy')}
                 className="px-6 py-2 rounded-xl bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-xs font-bold transition-all shadow-sm"
               >
                 Términos y Privacidad
               </button>
            </div>
        </div>

        {/* Lo que odiamos de la industria */}
        <div className="max-w-4xl mx-auto w-full mt-24 border-t border-gray-100 dark:border-white/5 pt-12 text-center">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 dark:text-gray-500 mb-8 px-4">Por qué Ediflow es diferente (Lo que odiamos de la industria)</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-12 px-6">
               <div className="flex items-center gap-2">
                 <div className="w-5 h-5 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[10px] text-red-500 dark:text-red-400 font-bold">close</span>
                 </div>
                 <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Sin cobros ocultos por implementación.</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-5 h-5 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[10px] text-red-500 dark:text-red-400 font-bold">close</span>
                 </div>
                 <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Sin comisiones extra por pagos.</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-5 h-5 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[10px] text-red-500 dark:text-red-400 font-bold">close</span>
                 </div>
                 <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Sin límites en módulos de IA.</span>
               </div>
            </div>
        </div>
      </section>

      {/* Expanded SEO B2B Footer */}
      <footer className="bg-gray-50 dark:bg-[#050505] pt-16 pb-10 border-t border-gray-200 dark:border-white/5 relative z-20 mt-auto text-gray-900 dark:text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <Logo variant="horizontal" color="currentColor" className="scale-75 origin-left opacity-80 mb-6" />
              <p className="text-gray-500 dark:text-gray-400 text-sm font-light max-w-sm leading-relaxed mb-6">
                El sistema operativo impulsado por Inteligencia Artificial que transforma la gestión de comunidades en una ventaja competitiva de principio a fin.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Comparativas</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-500 dark:text-gray-400 text-sm hover:text-gray-900 dark:hover:text-white transition-colors block">Alternativa a ComunidadFeliz</a></li>
                <li><a href="#" className="text-gray-500 dark:text-gray-400 text-sm hover:text-gray-900 dark:hover:text-white transition-colors block">Ediflow vs Edifito</a></li>
                <li><a href="#" className="text-gray-500 dark:text-gray-400 text-sm hover:text-gray-900 dark:hover:text-white transition-colors block">Migrar desde Kastor</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Herramientas</h4>
              <ul className="space-y-4">
                <li><div onClick={() => onNavigate && onNavigate('Resources')} className="cursor-pointer text-gray-500 dark:text-gray-400 text-sm hover:text-ediflow-primary transition-colors flex items-center gap-2 block font-medium"><span className="material-symbols-outlined text-[16px]">school</span> Simulador OS10</div></li>
                <li><div onClick={() => onNavigate && onNavigate('Solutions')} className="cursor-pointer text-gray-500 dark:text-gray-400 text-sm hover:text-gray-900 dark:hover:text-white transition-colors block">Soluciones Avanzadas</div></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-white/5 py-4 mb-4">
             <nav className="flex items-center text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest gap-2">
                 <span onClick={() => onNavigate && onNavigate('Landing')} className="hover:text-ediflow-primary transition-colors cursor-pointer">Inicio</span>
                 <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                 <span className="text-gray-900 dark:text-white">Precios</span>
             </nav>
          </div>
          <div className="border-t border-gray-200 dark:border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-gray-400 dark:text-gray-500 tracking-widest uppercase font-bold">
              &copy; {new Date().getFullYear()} Ediflow. Gestión Inteligente de Comunidades.
            </p>
            <div className="flex gap-6">
              <span onClick={() => onNavigate && onNavigate('Privacy')} className="text-[10px] text-gray-500 hover:text-gray-900 dark:hover:text-white uppercase tracking-widest transition-colors font-bold cursor-pointer">Privacidad</span>
              <a href="#" className="text-[10px] text-gray-500 hover:text-gray-900 dark:hover:text-white uppercase tracking-widest transition-colors font-bold">Términos</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PricingPage;
