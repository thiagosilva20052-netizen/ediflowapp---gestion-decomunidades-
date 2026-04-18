import React, { useState, useEffect } from 'react';
import { Logo } from '../components/Logo';

interface Props {
  onLoginClick: () => void;
  onNavigate?: (screen: any) => void;
}

const SolutionsPage: React.FC<Props> = ({ onLoginClick, onNavigate }) => {
  const [scrollOpacity, setScrollOpacity] = useState(0);

  useEffect(() => {
    // Start at top when loaded
    window.scrollTo(0, 0);
    
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const newOpacity = Math.min(currentScroll / 500, 0.9);
      setScrollOpacity(newOpacity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-[#0A0A0A] text-white font-sans selection:bg-white/20 selection:text-white min-h-screen">
      {/* Sticky Navigation Bar */}
      <header className={`fixed top-0 inset-x-0 w-full z-50 transition-all duration-500 ease-in-out ${scrollOpacity > 0.05 ? 'bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105" onClick={() => onNavigate && onNavigate('Landing')}>
            <Logo variant="horizontal" color="#FFFFFF" className="scale-[0.8] origin-left" />
          </div>

          <nav className="hidden lg:flex items-center gap-10">
            <div 
              onClick={() => onNavigate && onNavigate('Solutions')}
              className="group relative cursor-pointer flex items-center gap-1 text-sm font-medium text-white transition-colors"
            >
              Soluciones <span className="material-symbols-outlined text-[14px] group-hover:rotate-180 transition-transform">expand_more</span>
            </div>
            <div 
              onClick={() => onNavigate && onNavigate('Landing')}
              className="group relative cursor-pointer flex items-center gap-1 text-sm font-medium text-[#A3A3A3] hover:text-white transition-colors"
            >
              Inicio
            </div>
             <div 
              onClick={() => onNavigate && onNavigate('Resources')}
              className="cursor-pointer text-sm font-medium text-[#A3A3A3] hover:text-white transition-colors"
            >
              Recursos
            </div>
            <div 
              onClick={() => onNavigate && onNavigate('Pricing')}
              className="cursor-pointer text-sm font-medium text-[#A3A3A3] hover:text-white transition-colors"
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

      {/* 1. Hero Section (El Ecosistema Ediflow) */}
      <section className="pt-40 pb-20 px-6 lg:px-16 flex flex-col items-center justify-center text-center relative z-10">
        <div className="absolute inset-0 bg-gradient-radial from-white/5 to-transparent opacity-50 blur-3xl pointer-events-none"></div>
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-tight">
            Un solo ecosistema. <span className="font-serif italic text-white/50 block">Tres realidades transformadas.</span>
          </h1>
          <p className="text-base md:text-xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
            Ediflow elimina la fricción operativa para la administración, empodera a los conserjes frente a la normativa y le entrega transparencia total a los residentes.
          </p>

          {/* Role Tabs */}
          <div className="mt-16 flex flex-wrap justify-center gap-4">
            <button onClick={() => scrollToSection('admin-section')} className="px-6 py-3 rounded-full border border-white/10 bg-[#111] hover:bg-white/10 transition-colors text-sm font-medium text-white tracking-wide uppercase shadow-lg">
              Administrador
            </button>
            <button onClick={() => scrollToSection('conserje-section')} className="px-6 py-3 rounded-full border border-white/10 bg-[#111] hover:bg-white/10 transition-colors text-sm font-medium text-white tracking-wide uppercase shadow-lg">
              Conserje
            </button>
            <button onClick={() => scrollToSection('residente-section')} className="px-6 py-3 rounded-full border border-white/10 bg-[#111] hover:bg-white/10 transition-colors text-sm font-medium text-white tracking-wide uppercase shadow-lg">
              Residente
            </button>
          </div>
        </div>
      </section>

      {/* 2. Módulo 1: Para el Administrador (Control y Escala) */}
      <section id="admin-section" className="py-24 px-6 lg:px-16 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 w-full">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 tracking-tight leading-tight">
              Administra con la precisión de una <span className="font-medium text-white">Inteligencia Artificial</span>.
            </h2>
            <div className="space-y-6 mb-10">
              <p className="text-base md:text-lg text-gray-400 font-light leading-relaxed">
                Olvídate de digitar facturas a mano y calcular el prorrateo en Excel. Con Ediflow, subes el gasto y nuestra IA extrae los montos automáticamente. Mantén tus fondos de reserva impecables y audita tu gestión frente al comité sin esfuerzo.
              </p>
            </div>
            
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[16px] text-ediflow-primary">check_circle</span>
                <span className="text-gray-300 font-light">OCR de gastos comunes en 3 segundos.</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[16px] text-ediflow-primary">check_circle</span>
                <span className="text-gray-300 font-light">Generación automática de comunicados masivos con IA.</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[16px] text-ediflow-primary">check_circle</span>
                <span className="text-gray-300 font-light">Dashboard financiero alineado a la Ley 21.442.</span>
              </li>
            </ul>

            <button 
              onClick={() => onNavigate && onNavigate('BookDemo')}
              className="bg-white text-black px-8 py-4 rounded-xl font-medium hover:bg-gray-200 transition-colors shadow-lg"
            >
              Agendar Demo para Administradores
            </button>
          </div>

          <div className="flex-1 w-full relative h-[400px]">
            {/* Flat B2B UI Mockup */}
            <div className="absolute inset-0 bg-[#111] rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
              <div className="h-10 border-b border-white/5 flex items-center px-4 gap-2 bg-[#0A0A0A]">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                <div className="ml-4 text-[10px] text-gray-500 font-mono tracking-widest uppercase">AdminGastosOCR_v2.0</div>
              </div>
              <div className="p-6 flex-1 flex flex-col gap-4">
                 <div className="w-full h-8 bg-white/5 rounded-md w-1/3 mb-4"></div>
                 <div className="flex gap-4">
                    <div className="w-24 h-24 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-3xl text-gray-600">receipt_long</span>
                    </div>
                    <div className="flex-1 space-y-3">
                       <div className="w-full h-4 bg-white/10 rounded"></div>
                       <div className="w-3/4 h-4 bg-white/10 rounded"></div>
                       <div className="flex gap-2">
                         <div className="bg-ediflow-primary/20 border border-ediflow-primary/30 px-2 py-1 rounded text-[10px] text-ediflow-primary uppercase">Extracción Exitosa</div>
                       </div>
                    </div>
                 </div>
                 <div className="mt-auto w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-ediflow-primary w-[100%] rounded-full shadow-[0_0_10px_#00AEEF]"></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Módulo 2: Para el Conserje */}
      <section id="conserje-section" className="py-24 px-6 lg:px-16 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 w-full order-2 lg:order-1">
             {/* Bento Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px]">
                {/* Voice Assistant Card */}
                <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 flex flex-col shadow-xl">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-ediflow-primary text-xl">mic</span>
                  </div>
                  <h3 className="text-white text-sm font-medium mb-2">Asistente de Voz IA</h3>
                  <div className="mt-auto flex items-center gap-1 justify-center h-12 bg-black/50 rounded-xl border border-white/5">
                     {[1,2,3,4,5,6,7].map(i => (
                        <div key={i} className="w-1 bg-ediflow-primary rounded-full animate-pulse" style={{ height: `${Math.random() * 80 + 20}%`, animationDelay: `${i * 0.1}s` }}></div>
                     ))}
                  </div>
                </div>
                {/* Package OCR Card */}
                <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 flex flex-col shadow-xl">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-ediflow-primary text-xl">inventory_2</span>
                  </div>
                  <h3 className="text-white text-sm font-medium mb-2">Escaneo de Encomiendas</h3>
                  <div className="mt-auto h-20 bg-black/50 rounded-xl border border-white/5 flex items-center justify-center relative overflow-hidden">
                     <span className="material-symbols-outlined text-gray-600 text-3xl">qr_code_scanner</span>
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ediflow-primary/20 to-transparent animate-[scan_2s_ease-in-out_infinite]"></div>
                  </div>
                </div>
                {/* OS10 Simulator Card */}
                <div className="col-span-1 md:col-span-2 bg-[#111] border border-gray-800 rounded-2xl p-6 flex items-center gap-6 shadow-xl">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-ediflow-primary text-2xl">local_police</span>
                  </div>
                  <div>
                    <h3 className="text-white text-sm font-medium mb-1">Simulador OS10</h3>
                    <p className="text-xs text-gray-500 font-light">Capacitación continua con preguntas reales de Carabineros.</p>
                  </div>
                </div>
             </div>
          </div>
          
          <div className="flex-1 w-full order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 tracking-tight leading-tight">
              Tu primera línea de defensa, <span className="font-serif italic text-white/50">infalible</span>.
            </h2>
            <p className="text-base md:text-lg text-gray-400 font-light leading-relaxed mb-6">
              El libro de novedades físico es un riesgo legal y una pérdida de tiempo. Ediflow equipa a tu equipo de conserjería con herramientas de élite para que registren incidencias solo usando su voz y gestionen paquetes en segundos.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Módulo 3: Para el Residente */}
      <section id="residente-section" className="py-24 px-6 lg:px-16 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 w-full">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 tracking-tight leading-tight">
              Gastos claros, <span className="font-medium text-white">pagos sin fricción</span>.
            </h2>
            <div className="space-y-6 mb-10">
              <p className="text-base md:text-lg text-gray-400 font-light leading-relaxed">
                Se acabó la incertidumbre de no saber en qué se gasta el dinero del edificio o enviar comprobantes de transferencia por correo. Ediflow le da al residente una app impecable para pagar y estar informado.
              </p>
            </div>
            
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[16px] text-ediflow-primary">check_circle</span>
                <span className="text-gray-300 font-light">Pago a un clic integrado nativamente con <strong className="text-white font-normal">Khipu y MercadoPago</strong>.</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[16px] text-ediflow-primary">check_circle</span>
                <span className="text-gray-300 font-light">Transparencia total del prorrateo y fondo de reserva.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[16px] text-ediflow-primary mt-1">check_circle</span>
                <span className="text-gray-300 font-light">Resolución de dudas técnicas 24/7 con nuestro <strong className="text-white font-normal">Bot de Soporte IA</strong>, aliviando el trabajo del comité.</span>
              </li>
            </ul>
          </div>

          <div className="flex-1 w-full relative h-[500px] flex justify-center items-center">
             {/* Flat Mobile UI Mockup */}
             <div className="w-[300px] h-[600px] bg-[#0A0A0A] border-[8px] border-[#111] rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col">
                <div className="absolute top-0 inset-x-0 h-6 flex justify-center pt-2 z-20">
                  <div className="w-20 h-4 bg-[#111] rounded-b-xl"></div>
                </div>
                
                {/* Mobile App UI */}
                <div className="flex-1 bg-black p-6 flex flex-col pt-12 relative z-10">
                   <div className="flex items-center gap-3 mb-8">
                     <Logo color="#FFFFFF" className="scale-50 origin-left" />
                   </div>
                   <div className="bg-[#111] border border-white/5 rounded-2xl p-6 mb-6">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Total a Pagar</p>
                      <h3 className="text-3xl font-mono text-white mb-4">$124.500</h3>
                      <div className="w-full bg-[#009EE3]/10 border border-[#009EE3]/30 rounded-xl p-3 flex flex-col items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-green-400 text-3xl">check_circle</span>
                        <span className="text-white text-xs font-semibold">¡Pago Exitoso!</span>
                        <span className="text-[10px] text-gray-400">Vía MercadoPago</span>
                      </div>
                   </div>
                   <div className="space-y-3 mt-auto mb-4">
                     <div className="w-full h-12 bg-[#111] rounded-xl border border-white/5 flex items-center px-4 gap-3">
                       <span className="material-symbols-outlined text-gray-500 text-sm">receipt</span>
                       <span className="text-xs text-gray-400">Descargar Comprobante</span>
                     </div>
                     <div className="w-full h-12 bg-[#111] rounded-xl border border-white/5 flex items-center px-4 gap-3">
                       <span className="material-symbols-outlined text-ediflow-primary text-sm">smart_toy</span>
                       <span className="text-xs text-gray-400">Soporte Técnico 24/7</span>
                     </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 5. CTA Final */}
      <section className="bg-ediflow-primary py-24 px-6 lg:px-16 relative z-20 text-black text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-6 leading-tight">
            Diseñado para edificios que exigen lo mejor.
          </h2>
          <p className="text-base md:text-lg font-medium opacity-80 mb-10">
            Sin compromiso. Te mostramos cómo Ediflow se adapta a la realidad de <i>tu</i> edificio.
          </p>
          <button 
            onClick={() => onNavigate && onNavigate('BookDemo')}
            className="bg-black text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-2xl flex items-center justify-center gap-2 group"
          >
            Agendar Diagnóstico del Condominio
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* Footer (Reused from Landing) */}
      <footer className="bg-[#050505] pt-20 pb-10 border-t border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <Logo variant="horizontal" color="#FFFFFF" className="scale-75 origin-left opacity-60 mb-6" />
              <p className="text-gray-400 text-sm font-light max-w-sm leading-relaxed mb-6">
                El sistema operativo impulsado por Inteligencia Artificial que transforma la gestión de comunidades en una ventaja competitiva de principio a fin.
              </p>
            </div>
            <div>
              <h4 className="text-white text-sm font-medium mb-6">Alternativas</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-[#A3A3A3] text-sm hover:text-white hover:underline transition-colors block">Alternativa a ComunidadFeliz</a></li>
                <li><a href="#" className="text-[#A3A3A3] text-sm hover:text-white hover:underline transition-colors block">Alternativa a Edifito</a></li>
                <li><a href="#" className="text-[#A3A3A3] text-sm hover:text-white hover:underline transition-colors block">Alternativa a Kastor</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-medium mb-6">Herramientas Gratuitas</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-[#A3A3A3] text-sm hover:text-ediflow-primary transition-colors flex items-center gap-2 block"><span className="material-symbols-outlined text-[14px]">school</span> Simulador OS10</a></li>
                <li><a href="#" className="text-[#A3A3A3] text-sm hover:text-white transition-colors block">Checklist Ley 21.442</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 py-4 mb-4">
             <nav className="flex items-center text-[10px] text-gray-600 font-medium uppercase tracking-widest gap-2">
                 <span onClick={() => onNavigate && onNavigate('Landing')} className="hover:text-ediflow-primary transition-colors cursor-pointer">Inicio</span>
                 <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                 <span className="text-gray-400">Soluciones</span>
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
};

export default SolutionsPage;
