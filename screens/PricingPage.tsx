import React, { useState, useEffect } from 'react';
import { Logo } from '../components/Logo';

interface Props {
  onLoginClick: () => void;
  onNavigate?: (screen: any) => void;
}

const PricingPage: React.FC<Props> = ({ onLoginClick, onNavigate }) => {
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const [isAnnual, setIsAnnual] = useState(false);

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
    <div className="bg-[#0A0A0A] text-white font-sans selection:bg-white/20 selection:text-white min-h-screen flex flex-col">
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
              onClick={() => onNavigate && onNavigate('BookDemo')}
              className="bg-ediflow-primary text-black px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-white transition-all shadow-[0_0_15px_rgba(0,174,239,0.15)] hover:shadow-[0_0_25px_rgba(0,174,239,0.3)]"
            >
              Agendar Demo
            </button>
          </div>
        </div>
      </header>

      {/* Main Pricing Section */}
      <section className="pt-40 pb-20 px-6 lg:px-16 flex-1 flex flex-col items-center relative z-10">
        
        {/* Subdued Glow Background */}
        <div className="absolute top-40 inset-x-0 mx-auto w-[800px] h-[300px] bg-ediflow-primary/5 blur-[120px] rounded-[100%] pointer-events-none z-0"></div>

        <div className="max-w-4xl mx-auto space-y-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-tight">
            Precios claros y escalables. <br/>
            <span className="font-serif italic text-white/60">Sin impuestos a tu éxito.</span>
          </h1>
          <p className="text-base md:text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed mt-6">
            Paga solo por el tamaño de tu comunidad. Cero cobros de implementación, cero contratos forzosos y la Inteligencia Artificial viene incluida desde el primer día.
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

        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-16 relative z-10 w-full items-start">
          
          {/* Tier 1: Básico */}
          <div className="bg-[#111] border border-white/5 rounded-3xl p-8 flex flex-col h-full hover:border-white/20 transition-all shadow-xl">
             <div className="mb-8">
               <h3 className="text-xl font-medium text-white mb-2">Básico</h3>
               <p className="text-sm text-gray-400 font-light h-10">Ideal para empezar a digitalizar tu comunidad.</p>
             </div>
             <div className="mb-6 flex items-baseline gap-2">
               <span className="text-4xl font-light text-white">${isAnnual ? '10.000' : '1.000'}</span>
               <span className="text-sm text-gray-500">CLP / depto{isAnnual && '/año'}</span>
             </div>
             <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-8 border-b border-white/5 pb-4">
               Mínimo 40 unidades
             </p>
             <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8">
               <div className="flex gap-3">
                 <span className="material-symbols-outlined text-green-400 text-lg">money_off</span>
                 <div>
                   <p className="text-sm font-medium text-white mb-1 leading-tight">0% de comisión por transacciones.</p>
                   <p className="text-xs text-gray-400 font-light">Tú recaudas el 100% de tus gastos comunes.</p>
                 </div>
               </div>
             </div>
             <ul className="space-y-4 mb-10 flex-1">
               <li className="flex items-start gap-3">
                 <span className="material-symbols-outlined text-[16px] text-white/30 mt-0.5">check</span>
                 <span className="text-sm text-gray-300 font-light">Gestión contable básica</span>
               </li>
               <li className="flex items-start gap-3">
                 <span className="material-symbols-outlined text-[16px] text-white/30 mt-0.5">check</span>
                 <span className="text-sm text-gray-300 font-light">App para residentes</span>
               </li>
               <li className="flex items-start gap-3">
                 <span className="material-symbols-outlined text-[16px] text-white/30 mt-0.5">check</span>
                 <span className="text-sm text-gray-300 font-light">Pagos integrados con Khipu y MercadoPago</span>
               </li>
             </ul>
             <button className="w-full bg-transparent border border-white/20 text-white rounded-xl py-3.5 text-sm font-medium hover:bg-white/5 transition-colors mt-auto">
               Comenzar Gratis
             </button>
          </div>

          {/* Tier 2: Pro (Highlighted) */}
          <div className="bg-[#111] border border-ediflow-primary/50 relative rounded-3xl p-8 flex flex-col h-full shadow-[0_0_40px_rgba(0,174,239,0.1)] transform md:-translate-y-4">
             {/* Badge */}
             <div className="absolute -top-3.5 inset-x-0 flex justify-center">
                <span className="bg-ediflow-primary text-black text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                  Más Elegido
                </span>
             </div>
             <div className="mb-8">
               <h3 className="text-xl font-medium text-white mb-2">Pro</h3>
               <p className="text-sm text-gray-400 font-light h-10">Automatización total para administradores que escalan.</p>
             </div>
             <div className="mb-6 flex items-baseline gap-2">
               <span className="text-4xl font-light text-white">${isAnnual ? '15.000' : '1.500'}</span>
               <span className="text-sm text-gray-500">CLP / depto{isAnnual && '/año'}</span>
             </div>
             <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-8 border-b border-white/10 pb-4">
               Mínimo 40 unidades
             </p>
             <div className="bg-ediflow-primary/10 border border-ediflow-primary/20 rounded-xl p-4 mb-8">
               <div className="flex gap-3">
                 <span className="material-symbols-outlined text-ediflow-primary text-lg">psychology</span>
                 <div>
                   <p className="text-sm font-medium text-white mb-1 leading-tight">Toda la Inteligencia Artificial incluida.</p>
                   <p className="text-xs text-ediflow-primary/70 font-light">No cobramos extras por usar nuestro motor OCR.</p>
                 </div>
               </div>
             </div>
             <ul className="space-y-4 mb-10 flex-1">
               <li className="flex items-start gap-3">
                 <span className="material-symbols-outlined text-[16px] text-ediflow-primary mt-0.5">check</span>
                 <span className="text-sm text-white font-medium">Todo lo del plan Básico, más:</span>
               </li>
               <li className="flex items-start gap-3">
                 <span className="material-symbols-outlined text-[16px] text-ediflow-primary mt-0.5">check</span>
                 <span className="text-sm text-gray-300 font-light">OCR automático de Gastos Comunes en 3s</span>
               </li>
               <li className="flex items-start gap-3">
                 <span className="material-symbols-outlined text-[16px] text-ediflow-primary mt-0.5">check</span>
                 <span className="text-sm text-gray-300 font-light">Asistente de voz para conserjería</span>
               </li>
               <li className="flex items-start gap-3">
                 <span className="material-symbols-outlined text-[16px] text-ediflow-primary mt-0.5">check</span>
                 <span className="text-sm text-gray-300 font-light">Redacción de comunicados masivos con IA</span>
               </li>
             </ul>
             <button 
               onClick={() => onNavigate && onNavigate('BookDemo')}
               className="w-full bg-ediflow-primary text-black rounded-xl py-3.5 text-sm font-semibold hover:bg-white transition-colors mt-auto shadow-[0_0_15px_rgba(0,174,239,0.3)]"
             >
               Agendar Demo Pro
             </button>
          </div>

          {/* Tier 3: Full */}
          <div className="bg-[#111] border border-white/5 rounded-3xl p-8 flex flex-col h-full hover:border-white/20 transition-all shadow-xl">
             <div className="mb-8">
               <h3 className="text-xl font-medium text-white mb-2">Full</h3>
               <p className="text-sm text-gray-400 font-light h-10">Seguridad y control legal absoluto (Ley 21.442).</p>
             </div>
             <div className="mb-6 flex items-baseline gap-2">
               <span className="text-4xl font-light text-white">${isAnnual ? '20.000' : '2.000'}</span>
               <span className="text-sm text-gray-500">CLP / depto{isAnnual && '/año'}</span>
             </div>
             <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-8 border-b border-white/5 pb-4">
               Mínimo 40 unidades
             </p>
             <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8">
               <div className="flex gap-3">
                 <span className="material-symbols-outlined text-white text-lg">lock_open</span>
                 <div>
                   <p className="text-sm font-medium text-white mb-1 leading-tight">Sin cobros de implementación.</p>
                   <p className="text-xs text-gray-400 font-light">Ni contratos amarrados. Te vas cuando quieras.</p>
                 </div>
               </div>
             </div>
             <ul className="space-y-4 mb-10 flex-1">
               <li className="flex items-start gap-3">
                 <span className="material-symbols-outlined text-[16px] text-white/30 mt-0.5">check</span>
                 <span className="text-sm text-white font-medium">Todo lo del plan Pro, más:</span>
               </li>
               <li className="flex items-start gap-3">
                 <span className="material-symbols-outlined text-[16px] text-white/30 mt-0.5">check</span>
                 <span className="text-sm text-gray-300 font-light">Simulador OS10 integrado para conserjes</span>
               </li>
               <li className="flex items-start gap-3">
                 <span className="material-symbols-outlined text-[16px] text-white/30 mt-0.5">check</span>
                 <span className="text-sm text-gray-300 font-light">Bot de Soporte IA 24/7 para residentes</span>
               </li>
               <li className="flex items-start gap-3">
                 <span className="material-symbols-outlined text-[16px] text-white/30 mt-0.5">check</span>
                 <span className="text-sm text-gray-300 font-light">Soporte técnico y legal prioritario</span>
               </li>
             </ul>
             <button 
               onClick={() => onNavigate && onNavigate('BookDemo')}
               className="w-full bg-transparent border border-white/20 text-white rounded-xl py-3.5 text-sm font-medium hover:bg-white/5 transition-colors mt-auto"
             >
               Hablar con Ventas
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
