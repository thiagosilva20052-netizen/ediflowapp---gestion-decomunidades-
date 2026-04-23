import React, { useState, useEffect } from 'react';
import { Logo } from '../components/Logo';

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
    <div className="bg-[#0A0A0A] text-white font-sans selection:bg-ediflow-primary/20 selection:text-white min-h-screen flex flex-col overflow-x-hidden">
      {/* Sticky Navigation Bar */}
      <header className={`fixed top-0 inset-x-0 w-full z-50 transition-all duration-500 ease-in-out ${scrollOpacity > 0.05 ? 'bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105" onClick={() => onNavigate && onNavigate('Landing')}>
            <Logo variant="horizontal" color="#FFFFFF" className="scale-[0.8] origin-left" />
          </div>

          <nav className="hidden lg:flex items-center gap-10">
            <div 
              onClick={() => onNavigate && onNavigate('Landing')}
              className="cursor-pointer text-sm font-medium text-[#A3A3A3] hover:text-white transition-colors"
            >
              Inicio
            </div>
            <div 
              onClick={() => onNavigate && onNavigate('Solutions')}
              className="group relative cursor-pointer flex items-center gap-1 text-sm font-medium text-[#A3A3A3] hover:text-white transition-colors"
            >
              Soluciones <span className="material-symbols-outlined text-[14px] group-hover:rotate-180 transition-transform">expand_more</span>
            </div>
            <div 
              onClick={() => onNavigate && onNavigate('Resources')}
              className="cursor-pointer text-sm font-medium text-[#A3A3A3] hover:text-white transition-colors"
            >
              Recursos
            </div>
            <div 
              className="cursor-pointer text-sm font-medium text-white transition-colors"
            >
              Precios
            </div>
          </nav>

          <div className="flex items-center gap-6">
            <button 
              onClick={onLoginClick} 
              className="hidden md:block text-sm font-medium text-[#A3A3A3] hover:text-white transition-colors"
            >
              Iniciar Sesión
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('Register')}
              className="bg-white text-black px-6 py-2.5 rounded-xl text-sm font-bold tracking-tight hover:bg-gray-200 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center gap-2"
            >
              Comenzar Prueba
            </button>
          </div>
        </div>
      </header>

      {/* Main Pricing Section */}
      <section className="pt-40 pb-20 px-6 lg:px-16 flex-1 flex flex-col items-center relative z-10 w-full overflow-hidden">
        
        {/* Subdued Glow Background */}
        <div className="absolute top-40 inset-x-0 mx-auto w-full max-w-[800px] h-[300px] bg-ediflow-primary/10 blur-[120px] rounded-[100%] pointer-events-none z-0 mix-blend-screen"></div>

        <div className="max-w-4xl mx-auto space-y-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-tight">
            Planes transparentes. <br/>
            <span className="font-serif italic text-white/60">Privacidad blindada.</span>
          </h1>
          <p className="text-base md:text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed mt-6">
            Elige el plan ideal según el tamaño de tu comunidad. Todos los planes incluyen nuestro protocolo de privacidad estricto y protección de datos financieros para la total tranquilidad de tus residentes.
          </p>

          {/* Billing Toggle */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-white' : 'text-gray-500'}`}>Mensual</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-7 bg-[#111] rounded-full border border-white/10 relative transition-colors focus:outline-none focus:ring-2 focus:ring-ediflow-primary/50"
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-[3px] transition-transform duration-300 ease-in-out ${isAnnual ? 'translate-x-[26px] bg-ediflow-primary' : 'translate-x-[3px]'}`}></div>
            </button>
            <span className={`text-sm font-medium transition-colors flex items-center gap-2 ${isAnnual ? 'text-white' : 'text-gray-500'}`}>
              Anual <span className="bg-ediflow-primary/20 text-ediflow-primary text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border border-ediflow-primary/30">2 Meses Gratis</span>
            </span>
          </div>
        </div>

        {/* Pricing Card (Bento Box Style) */}
        <div className="max-w-3xl mx-auto mt-16 relative z-10 w-full mb-12 text-left">
          <div className="bg-[#111] border border-white/10 relative rounded-[2rem] p-8 md:p-12 shadow-[0_40px_80px_rgba(0,0,0,0.5)] overflow-hidden">
             
             {/* Dynamic Setup & Price */}
             <div className="flex flex-col mb-10 border-b border-white/10 pb-10">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                 
                 {/* Slider Area */}
                 <div className="flex-1">
                   <h3 className="text-2xl font-medium text-white mb-2">Tamaño de la Comunidad</h3>
                   <p className="text-sm text-gray-400 font-light mb-6">Selecciona la cantidad de departamentos o casas.</p>
                   
                   <div className="flex items-center gap-4">
                     <input 
                        type="range" 
                        min="1" 
                        max="500" 
                        value={unitsCount} 
                        onChange={(e) => setUnitsCount(Number(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-ediflow-primary"
                     />
                     <div className="bg-[#222] border border-white/10 rounded-xl px-4 py-2 w-24 text-center">
                        <span className="text-xl font-medium text-white">{unitsCount}</span>
                     </div>
                   </div>
                   {unitsCount < 40 && (
                      <p className="text-[10px] text-ediflow-primary font-bold uppercase tracking-widest mt-3">
                        * Facturación base de 40 unidades aplicada.
                      </p>
                   )}
                 </div>

                 {/* Calculated Price */}
                 <div className="flex flex-col items-start md:items-end md:pl-8 md:border-l md:border-white/10">
                   <span className="text-sm text-gray-500 font-medium mb-1 uppercase tracking-widest">Total a Pagar</span>
                   <div className="flex items-baseline gap-2 text-ediflow-primary">
                     <span className="text-5xl md:text-6xl font-light tracking-tighter">${formatPrice(isAnnual ? getAnnualPrice() : getMonthlyPrice())}</span>
                   </div>
                   <span className="text-xs text-gray-400 mt-2 font-medium">CLP {isAnnual ? 'Facturado Anualmente' : '/ mes'}</span>
                 </div>
               </div>
             </div>

             {/* Features Bento */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
               <div>
                 <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Módulo Todo Incluido</h4>
                 <ul className="space-y-4">
                   <li className="flex items-start gap-4">
                     <span className="material-symbols-outlined text-[18px] text-white/50 mt-0.5">check_circle</span>
                     <div>
                       <p className="text-sm text-white font-medium">Automatización Activa</p>
                       <p className="text-xs text-gray-400 mt-0.5">Conciliación con bancos y OCR automático.</p>
                     </div>
                   </li>
                   <li className="flex items-start gap-4">
                     <span className="material-symbols-outlined text-[18px] text-white/50 mt-0.5">check_circle</span>
                     <div>
                       <p className="text-sm text-white font-medium">Conserjería Inteligente (IA)</p>
                       <p className="text-xs text-gray-400 mt-0.5">Asistente de voz, bitácora y visitas.</p>
                     </div>
                   </li>
                   <li className="flex items-start gap-4">
                     <span className="material-symbols-outlined text-[18px] text-white/50 mt-0.5">check_circle</span>
                     <div>
                       <p className="text-sm text-white font-medium">App Residente & Pagos</p>
                       <p className="text-xs text-gray-400 mt-0.5">Súper App con pasarela integrada (0% setup).</p>
                     </div>
                   </li>
                 </ul>
               </div>

               <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 h-full flex flex-col justify-center">
                   <span className="material-symbols-outlined text-white/30 text-2xl mb-3">data_usage</span>
                   <p className="text-sm font-bold text-white mb-1 tracking-tight">Política de Sobregiro Transparente</p>
                   <p className="text-xs text-gray-400 font-light leading-relaxed">
                     Sin cobros sorpresa. Si tu comunidad supera drásticamente los límites de almacenamiento cloud o cuotas de IA, notificaremos previamente al administrador para aprobar paquetes de expansión de bajo costo.
                   </p>
               </div>
             </div>

             <button 
               onClick={() => onNavigate && onNavigate('Register')}
               className="group w-full bg-ediflow-primary text-black rounded-xl py-4 text-sm font-bold uppercase tracking-widest hover:bg-white active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(0,174,239,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] flex flex-col items-center justify-center gap-1 mx-auto"
             >
               <div className="flex items-center gap-2">
                 Comenzar Prueba Gratuita
                 <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
               </div>
             </button>
             <p className="text-center mt-4 text-[10px] text-gray-500 font-medium">
                🔒 Tus datos están respaldados por nuestro Centro de Confianza. Consulta nuestros Convenios y Privacidad.
             </p>
          </div>
        </div>

        {/* Trust Center Section */}
        <div className="max-w-3xl mx-auto w-full mb-24 relative z-10 flex flex-col items-center">
            <div className="bg-[#0A0A0A] border border-white/5 rounded-full px-6 py-2 flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-green-400 text-[18px]">gpp_good</span>
                <span className="text-xs font-bold text-white uppercase tracking-widest">Centro de Confianza Ediflow</span>
            </div>
            <p className="text-sm text-gray-400 text-center max-w-lg mb-8 font-light">
              La protección de los datos financieros y personales de tu comunidad no es opcional. Cumplimos con normativas estrictas de seguridad (SOC 2, ISO 27001) y garantizamos la encriptación end-to-end.
            </p>
            <div className="flex gap-4">
               <button 
                 onClick={() => onNavigate && onNavigate('Privacy')}
                 className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-colors"
               >
                 Términos y Privacidad
               </button>
            </div>
        </div>

        {/* Lo que odiamos de la industria */}
        <div className="max-w-4xl mx-auto w-full mt-24 border-t border-white/5 pt-12 text-center">
            <h3 className="text-sm uppercase tracking-widest font-semibold text-gray-500 mb-8">Por qué Ediflow es diferente (Lo que odiamos de la industria)</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-12 text-gray-400">
               <div className="flex items-center gap-2">
                 <span className="border border-white/10 rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-50">❌</span>
                 <span className="text-sm font-light">Sin cobros por implementación.</span>
               </div>
               <div className="flex items-center gap-2">
                 <span className="border border-white/10 rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-50">❌</span>
                 <span className="text-sm font-light">Sin comisiones por transacciones.</span>
               </div>
               <div className="flex items-center gap-2">
                 <span className="border border-white/10 rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-50">❌</span>
                 <span className="text-sm font-light">Sin módulos IA cobrados por separado.</span>
               </div>
            </div>
        </div>
      </section>

      {/* Footer Nav & Comparisons (AEO/SEO Silos) */}
      <footer className="bg-[#050505] pt-16 pb-10 border-t border-white/5 relative z-20 mt-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <Logo variant="horizontal" color="#FFFFFF" className="scale-75 origin-left opacity-60 mb-6" />
              <p className="text-gray-400 text-sm font-light max-w-sm leading-relaxed mb-6">
                El sistema operativo impulsado por Inteligencia Artificial que transforma la gestión de comunidades en una ventaja competitiva de principio a fin.
              </p>
            </div>
            <div>
              <h4 className="text-white text-sm font-medium mb-6">Comparativas (Descubre la verdad)</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-[#A3A3A3] text-sm hover:text-white hover:underline transition-colors block">Alternativa a ComunidadFeliz en Chile</a></li>
                <li><a href="#" className="text-[#A3A3A3] text-sm hover:text-white hover:underline transition-colors block">Ediflow vs Edifito: Reseña 2026</a></li>
                <li><a href="#" className="text-[#A3A3A3] text-sm hover:text-white hover:underline transition-colors block">Por qué migrar desde Kastor</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-medium mb-6">Herramientas</h4>
              <ul className="space-y-4">
                <li><div onClick={() => onNavigate && onNavigate('Resources')} className="cursor-pointer text-[#A3A3A3] text-sm hover:text-ediflow-primary transition-colors flex items-center gap-2 block"><span className="material-symbols-outlined text-[14px]">school</span> Simulador OS10</div></li>
                <li><div onClick={() => onNavigate && onNavigate('Solutions')} className="cursor-pointer text-[#A3A3A3] text-sm hover:text-white transition-colors block">Soluciones Avanzadas</div></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 py-4 mb-4">
             <nav className="flex items-center text-[10px] text-gray-600 font-medium uppercase tracking-widest gap-2">
                 <span onClick={() => onNavigate && onNavigate('Landing')} className="hover:text-ediflow-primary transition-colors cursor-pointer">Inicio</span>
                 <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                 <span className="text-gray-400">Precios</span>
             </nav>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-gray-600 tracking-widest uppercase font-semibold">
              &copy; {new Date().getFullYear()} Ediflow. Gestión Inteligente de Comunidades.
            </p>
            <div className="flex gap-6">
              <span onClick={() => onNavigate && onNavigate('Privacy')} className="text-[10px] text-gray-500 hover:text-white uppercase tracking-widest transition-colors font-semibold cursor-pointer">Privacidad</span>
              <a href="#" className="text-[10px] text-gray-500 hover:text-white uppercase tracking-widest transition-colors font-semibold">Términos</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PricingPage;
