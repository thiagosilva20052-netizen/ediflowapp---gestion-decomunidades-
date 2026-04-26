import React, { useState, useEffect } from 'react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';

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
    <div className="bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white font-sans selection:bg-ediflow-primary/10 selection:text-gray-900 min-h-screen transition-colors duration-300">
      {/* Sticky Navigation Bar */}
      <header className={`fixed top-0 inset-x-0 w-full z-50 transition-all duration-500 ease-in-out ${scrollOpacity > 0.05 ? 'bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105" onClick={() => onNavigate && onNavigate('Landing')}>
            <Logo variant="horizontal" color="currentColor" className="scale-[0.8] origin-left" />
          </div>

          <nav className="hidden lg:flex items-center gap-10">
            <div 
              onClick={() => onNavigate && onNavigate('Solutions')}
              className="group relative cursor-pointer flex items-center gap-1 text-sm font-bold text-gray-900 dark:text-white transition-colors"
            >
              Soluciones <span className="material-symbols-outlined text-[14px] group-hover:rotate-180 transition-transform">expand_more</span>
            </div>
            <div 
              onClick={() => onNavigate && onNavigate('Landing')}
              className="group relative cursor-pointer flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Inicio
            </div>
             <div 
              onClick={() => onNavigate && onNavigate('Resources')}
              className="cursor-pointer text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Recursos
            </div>
            <div 
              onClick={() => onNavigate && onNavigate('Pricing')}
              className="cursor-pointer text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
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
              onClick={() => onNavigate && onNavigate('BookDemo')}
              className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-ediflow-primary dark:hover:bg-ediflow-primary dark:hover:text-white transition-all shadow-xl active:scale-95"
            >
              Agendar Demo
            </button>
          </div>
        </div>
      </header>

      {/* 1. Hero Section (El Ecosistema Ediflow) */}
      <section className="pt-40 pb-20 px-6 lg:px-16 flex flex-col items-center justify-center text-center relative z-10">
        <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-900/10 blur-3xl pointer-events-none"></div>
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-gray-900 dark:text-white leading-none">
            Un solo ecosistema. <span className="font-serif italic font-normal text-ediflow-primary block mt-2">Tres realidades transformadas.</span>
          </h1>
          <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 font-light max-w-3xl mx-auto leading-relaxed mt-8">
            Ediflow elimina la fricción operativa para la administración, empodera a los conserjes frente a la normativa y le entrega transparencia total a los residentes.
          </p>

          {/* Role Tabs */}
          <div className="mt-16 flex flex-wrap justify-center gap-4">
            <button onClick={() => scrollToSection('admin-section')} className="px-8 py-3 rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-all text-xs font-bold text-gray-900 dark:text-white tracking-widest uppercase shadow-sm active:scale-95">
              Administrador
            </button>
            <button onClick={() => scrollToSection('conserje-section')} className="px-8 py-3 rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-all text-xs font-bold text-gray-900 dark:text-white tracking-widest uppercase shadow-sm active:scale-95">
              Conserje
            </button>
            <button onClick={() => scrollToSection('residente-section')} className="px-8 py-3 rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-all text-xs font-bold text-gray-900 dark:text-white tracking-widest uppercase shadow-sm active:scale-95">
              Residente
            </button>
          </div>
        </div>
      </section>

      {/* 2. Módulo 1: Para el Administrador (Control y Escala) */}
      <section id="admin-section" className="py-24 px-6 lg:px-16 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 w-full">
            <div className="w-12 h-1 h-bg-ediflow-primary bg-ediflow-primary mb-8 rounded-full"></div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-none">
              Administra con la precisión de una <span className="text-blue-600 dark:text-blue-400">Inteligencia Artificial</span>.
            </h2>
            <div className="space-y-6 mb-10">
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                Olvídate de digitar facturas a mano y calcular el prorrateo en Excel. Con Ediflow, subes el gasto y nuestra IA extrae los montos automáticamente. Mantén tus fondos de reserva impecables y audita tu gestión frente al comité sin esfuerzo.
              </p>
            </div>
            
            <ul className="space-y-4 mb-10 font-medium">
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px] text-blue-600 dark:text-blue-400">check_circle</span>
                <span className="text-gray-700 dark:text-gray-300">OCR de gastos comunes en 3 segundos.</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px] text-blue-600 dark:text-blue-400">check_circle</span>
                <span className="text-gray-700 dark:text-gray-300">Generación automática de comunicados masivos con IA.</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px] text-blue-600 dark:text-blue-400">check_circle</span>
                <span className="text-gray-700 dark:text-gray-300">Dashboard financiero alineado a la Ley 21.442.</span>
              </li>
            </ul>

            <button 
              onClick={() => onNavigate && onNavigate('BookDemo')}
              className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-ediflow-primary dark:hover:bg-ediflow-primary dark:hover:text-white transition-all shadow-xl active:scale-95"
            >
              Agendar Demo para Administradores
            </button>
          </div>

          <div className="flex-1 w-full relative h-[450px]">
             {/* Bento Style UI Mockup */}
             <div className="absolute inset-0 bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col group hover:shadow-blue-500/10 transition-all duration-500">
               <div className="h-12 border-b border-gray-100 dark:border-white/5 flex items-center px-6 gap-2 bg-white dark:bg-white/5">
                 <div className="flex gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                 </div>
                 <div className="ml-4 text-[10px] text-gray-400 dark:text-gray-500 font-bold tracking-widest uppercase">AdminGastosOCR_v2.0</div>
               </div>
               <div className="p-8 flex-1 flex flex-col gap-6">
                  <div className="w-32 h-6 bg-gray-200 dark:bg-gray-800 rounded-full mb-2"></div>
                  <div className="flex gap-6">
                     <div className="w-20 h-20 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 flex items-center justify-center shrink-0 shadow-sm">
                       <span className="material-symbols-outlined text-3xl text-gray-400 dark:text-gray-500">receipt_long</span>
                     </div>
                     <div className="flex-1 space-y-3">
                        <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                        <div className="w-3/4 h-3 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                        <div className="flex gap-2 pt-2">
                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 px-3 py-1 rounded-full text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-tighter">Extracción Exitosa</div>
                        </div>
                     </div>
                  </div>
                  <div className="mt-auto w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 w-[100%] rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                  </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* 3. Módulo 2: Para el Conserje */}
      <section id="conserje-section" className="py-24 px-6 lg:px-16 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 w-full order-2 lg:order-1">
             {/* Bento Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[450px]">
                {/* Voice Assistant Card */}
                <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 rounded-[2rem] p-8 flex flex-col shadow-sm hover:shadow-xl transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-6 border border-blue-100 dark:border-blue-800/30">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">mic</span>
                  </div>
                  <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-2 tracking-tight">Asistente de Voz IA</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 font-medium">Basta con hablar para registrar novedades en el libro digital.</p>
                  <div className="mt-auto flex items-center gap-1.5 justify-center h-16 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
                     {[1,2,3,4,5,6,7,8,9,10].map(i => (
                        <div key={i} className="w-1 bg-blue-500 rounded-full animate-pulse" style={{ height: `${Math.random() * 80 + 20}%`, animationDelay: `${i * 0.1}s` }}></div>
                     ))}
                  </div>
                </div>
                {/* Package OCR Card */}
                <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 rounded-[2rem] p-8 flex flex-col shadow-sm hover:shadow-xl transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-6 border border-blue-100 dark:border-blue-800/30">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">inventory_2</span>
                  </div>
                  <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-2 tracking-tight">Escaneo de Encomiendas</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 font-medium">Lee etiquetas automáticamente y notifica al residente.</p>
                  <div className="mt-auto h-24 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 flex items-center justify-center relative overflow-hidden">
                     <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-4xl">qr_code_scanner</span>
                     <div className="absolute inset-x-0 h-0.5 bg-blue-500/30 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                  </div>
                </div>
                {/* OS10 Simulator Card */}
                <div className="col-span-1 md:col-span-2 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 rounded-[2rem] p-8 flex items-center gap-8 shadow-sm hover:shadow-xl transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800/30">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-3xl">local_police</span>
                  </div>
                  <div>
                    <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-1 tracking-tight">Simulador OS10 de Élite</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Capacitación continua con preguntas reales de Carabineros directamente en el panel de conserjería.</p>
                  </div>
                </div>
             </div>
          </div>
          
          <div className="flex-1 w-full order-1 lg:order-2">
            <div className="w-12 h-1 bg-ediflow-primary mb-8 rounded-full"></div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-none">
              Tu primera línea de defensa, <span className="font-serif italic font-normal text-ediflow-primary">infalible</span>.
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-10">
              El libro de novedades físico es un riesgo legal y una pérdida de tiempo. Ediflow equipa a tu equipo de conserjería con herramientas de élite para que registren incidencias solo usando su voz y gestionen paquetes en segundos, blindando el condominio.
            </p>
            <button className="text-gray-900 dark:text-white font-bold border-b-2 border-ediflow-primary pb-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
               Ver herramientas de seguridad →
            </button>
          </div>
        </div>
      </section>

      {/* 4. Módulo 3: Para el Residente */}
      <section id="residente-section" className="py-24 px-6 lg:px-16 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 w-full">
            <div className="w-12 h-1 bg-ediflow-primary mb-8 rounded-full"></div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-none">
              Gastos claros, <span className="text-blue-600 dark:text-blue-400">pagos sin fricción</span>.
            </h2>
            <div className="space-y-6 mb-10">
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                Se acabó la incertidumbre de no saber en qué se gasta el dinero del edificio o enviar comprobantes de transferencia por correo. Ediflow le da al residente una app impecable para pagar y estar informado.
              </p>
            </div>
            
            <ul className="space-y-4 mb-10 font-medium">
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px] text-blue-600 dark:text-blue-400">check_circle</span>
                <span className="text-gray-700 dark:text-gray-300">Pago a un clic integrado con <strong className="text-gray-900 dark:text-white">Khipu y MercadoPago</strong>.</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px] text-blue-600 dark:text-blue-400">check_circle</span>
                <span className="text-gray-700 dark:text-gray-300">Transparencia total del prorrateo y fondo de reserva.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[18px] text-blue-600 dark:text-blue-400 mt-1">check_circle</span>
                <span className="text-gray-700 dark:text-gray-300">Soporte 24/7 con nuestro <strong className="text-gray-900 dark:text-white">Bot de Soporte IA</strong> dedicado.</span>
              </li>
            </ul>
          </div>

          <div className="flex-1 w-full relative h-[500px] flex justify-center items-center">
             {/* Flat Mobile UI Mockup */}
             <div className="w-[300px] h-[600px] bg-white dark:bg-[#111] border-[10px] border-gray-900 dark:border-gray-800 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]">
                {/* Mobile Internal */}
                <div className="flex-1 bg-white dark:bg-[#111] p-6 flex flex-col pt-12 relative z-10">
                   <div className="flex items-center gap-3 mb-8">
                     <Logo color="currentColor" className="scale-50 origin-left" />
                   </div>
                   <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-6 mb-6 shadow-sm">
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mb-1">Total a Pagar</p>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-none">$124.500</h3>
                      <div className="w-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-3xl">check_circle</span>
                        <span className="text-gray-900 dark:text-white text-sm font-bold tracking-tight">¡Pago Exitoso!</span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-tight">Vía MercadoPago</span>
                      </div>
                   </div>
                   <div className="space-y-3 mt-auto mb-4">
                     <div className="w-full h-12 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 flex items-center px-4 gap-3 shadow-sm">
                       <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-sm">receipt</span>
                       <span className="text-xs text-gray-600 dark:text-gray-400 font-bold">Descargar Comprobante</span>
                     </div>
                     <div className="w-full h-12 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 flex items-center px-4 gap-3 shadow-sm">
                       <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-sm">smart_toy</span>
                       <span className="text-xs text-gray-600 dark:text-gray-400 font-bold">Soporte Técnico 24/7</span>
                     </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 5. CTA Final */}
      <section className="bg-gray-900 py-24 px-6 lg:px-16 relative z-20 text-white text-center">
         <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/5 blur-[120px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-8 leading-none">
            Diseñado para edificios que exigen <span className="text-ediflow-primary underline decoration-blue-500/20 underline-offset-8">lo mejor</span>.
          </h2>
          <p className="text-base md:text-xl font-light text-gray-400 dark:text-gray-500 max-w-2xl mb-12 leading-relaxed">
            Sin compromiso. Te mostramos cómo Ediflow se adapta a la realidad específica de tu edificio y comunidad.
          </p>
          <button 
            onClick={() => onNavigate && onNavigate('BookDemo')}
            className="bg-white text-gray-900 px-10 py-5 rounded-2xl font-bold hover:bg-ediflow-primary hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3 group active:scale-95"
          >
            Agendar Diagnóstico del Condominio
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-[#050505] pt-20 pb-12 border-t border-gray-200 dark:border-white/5 relative z-20 text-gray-900 dark:text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="md:col-span-2">
              <Logo variant="horizontal" color="currentColor" className="scale-75 origin-left opacity-30 mb-8" />
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium max-w-sm leading-relaxed font-sans">
                El sistema operativo impulsado por Inteligencia Artificial que transforma la gestión de comunidades en una ventaja competitiva empresarial de principio a fin.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-8">Alternativas</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-gray-900 dark:hover:text-white transition-colors">Alternativa a ComunidadFeliz</a></li>
                <li><a href="#" className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-gray-900 dark:hover:text-white transition-colors">Alternativa a Edifito</a></li>
                <li><a href="#" className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-gray-900 dark:hover:text-white transition-colors">Alternativa a Kastor</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-8">Ecosistema</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-blue-600 transition-colors flex items-center gap-2 font-bold"><span className="material-symbols-outlined text-[16px]">school</span> Simulador OS10</a></li>
                <li><a href="#" className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-gray-900 dark:hover:text-white transition-colors">Checklist Ley 21.442</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-white/5 py-6 mb-4">
             <nav className="flex items-center text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.2em] gap-2">
                 <span onClick={() => onNavigate && onNavigate('Landing')} className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">Inicio</span>
                 <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                 <span className="text-gray-900 dark:text-white">Soluciones</span>
             </nav>
          </div>
          <div className="border-t border-gray-200 dark:border-white/5 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[10px] text-gray-400 dark:text-gray-500 tracking-[0.2em] uppercase font-bold">
              &copy; {new Date().getFullYear()} Ediflow. Gestión Inteligente de Comunidades.
            </p>
            <div className="flex gap-8">
              <span onClick={() => onNavigate && onNavigate('Privacy')} className="text-[10px] text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white uppercase tracking-widest transition-colors font-bold cursor-pointer">Privacidad</span>
              <span onClick={() => onNavigate && onNavigate('Terms')} className="text-[10px] text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white uppercase tracking-widest transition-colors font-bold cursor-pointer">Términos</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SolutionsPage;
