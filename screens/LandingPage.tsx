import React, { useState, useEffect } from 'react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';
import { motion } from 'motion/react';

interface Props {
  onLoginClick: () => void;
  onNavigate?: (screen: any) => void;
}

const FadeIn = ({ children, delay, duration = 1000, className = '' }: any) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`transition-opacity ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transitionDuration: `${duration}ms`
      }}
    >
      {children}
    </div>
  );
};

const AnimatedHeading = ({ text }: { text: string }) => {
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 200);
    return () => clearTimeout(t);
  }, []);

  const lines = text.split('\n');
  const charDelay = 30;

  return (
    <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal mb-4" style={{ letterSpacing: '-0.04em' }}>
      {lines.map((line, lineIndex) => {
        const lineLength = line.length;
        return (
          <div key={lineIndex} className="block whitespace-nowrap">
            {line.split('').map((char, charIndex) => {
              const delayMs = (lineIndex * lineLength * charDelay) + (charIndex * charDelay);
              return (
                <span
                  key={charIndex}
                  className="inline-block transition-all ease-out"
                  style={{
                    opacity: started ? 1 : 0,
                    transform: started ? 'translateX(0)' : 'translateX(-18px)',
                    transitionDuration: '500ms',
                    transitionDelay: `${delayMs}ms`
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </div>
        );
      })}
    </h1>
  );
}

const LandingPage: React.FC<Props> = ({ onLoginClick, onNavigate }) => {
  const [scrollOpacity, setScrollOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      // Dim up to 90% over 500px of scrolling
      const newOpacity = Math.min(currentScroll / 500, 0.9);
      setScrollOpacity(newOpacity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white font-sans selection:bg-ediflow-primary/20 selection:text-gray-900">
      {/* Sticky Navigation Bar */}
      <header className={`fixed top-0 inset-x-0 w-full z-50 transition-all duration-500 ease-in-out ${scrollOpacity > 0.05 ? 'bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-2xl border-b border-gray-100 dark:border-white/10 py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95" onClick={() => window.scrollTo(0,0)}>
            <Logo variant="horizontal" color="currentColor" className="scale-[0.8] origin-left" />
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            <div 
              onClick={() => onNavigate && onNavigate('Solutions')}
              className="group relative cursor-pointer flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Soluciones <span className="material-symbols-outlined text-[14px] group-hover:rotate-180 transition-transform">expand_more</span>
            </div>
            <div className="group relative cursor-pointer flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              Producto <span className="material-symbols-outlined text-[14px] group-hover:rotate-180 transition-transform">expand_more</span>
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

          {/* Right: Actions */}
          <div className="flex items-center gap-4 md:gap-8">
            <ThemeToggle />
            <button 
              onClick={onLoginClick} 
              className="hidden md:block text-sm font-semibold text-gray-900 dark:text-gray-300 hover:text-ediflow-primary dark:hover:text-white transition-colors tracking-tight"
            >
              Inicia Sesión
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('Register')}
              className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold tracking-tight hover:bg-ediflow-primary transition-all shadow-lg flex items-center gap-2"
            >
              Comenzar Prueba
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden bg-white dark:bg-[#0A0A0A]">
        {/* Subtle Grid and Glow */}
        <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.02] hidden md:block">
           <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50 dark:bg-blue-900/10 blur-[150px] rounded-[100%] pointer-events-none z-0"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gray-50 dark:bg-gray-800/10 blur-[100px] rounded-[100%] pointer-events-none z-0"></div>

        {/* Main Layout Overlay */}
        <div className="relative z-10 flex flex-col pt-32 pb-16">
          {/* Hero Content */}
          <div className="px-6 md:px-12 lg:px-16 w-full max-w-7xl mx-auto">
            <div className="lg:grid lg:grid-cols-12 lg:items-center w-full gap-16">
              
              {/* Left Column (Copywriter) */}
              <div className="col-span-12 lg:col-span-6 flex flex-col items-start w-full">
                 <FadeIn delay={100} duration={1000}>
                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 py-1.5 px-3 rounded-full mb-6">
                       <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                       <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest">IA Financiera Activa</span>
                    </div>
                 </FadeIn>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium text-gray-900 dark:text-white tracking-tight leading-[1.05] mb-6">
                  Cuadra tus gastos en <span className="font-light text-ediflow-primary">segundos</span> con IA.
                </h1>
                
                <FadeIn delay={400} duration={1000}>
                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-xl leading-relaxed font-light">
                    Ediflow lee tus facturas automáticamente, permite a los conserjes reportar por voz y a los residentes pagar con 0% de comisión. El sistema operativo para edificios modernos.
                  </p>
                </FadeIn>

                <FadeIn delay={600} duration={1000} className="w-full">
                    <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 text-gray-900 dark:text-white">
                    <button 
                      onClick={() => onNavigate && onNavigate('Register')}
                      className="group bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-8 py-4 rounded-xl font-bold tracking-tight hover:bg-ediflow-primary dark:hover:bg-ediflow-primary dark:hover:text-white active:scale-95 transition-all shadow-xl w-full sm:w-auto flex justify-center items-center gap-2"
                    >
                      Comenzar Prueba Gratis
                      <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                    <button 
                      onClick={() => onNavigate && onNavigate('BookDemo')}
                      className="group bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-white/10 active:scale-95 transition-all w-full sm:w-auto flex justify-center items-center gap-3 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[20px] text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">play_circle</span>
                      <span>Ver IA en acción</span>
                    </button>
                  </div>
                  
                  {/* Social Proof */}
                  <div className="flex flex-col items-start gap-4">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Integraciones Nativas Seguras</p>
                    <div className="flex items-center gap-8 opacity-60">
                      <span className="text-sm font-bold tracking-tighter text-gray-400">khipu.</span>
                      <div className="flex items-center gap-1 text-gray-400">
                        <span className="text-sm font-bold tracking-tight">mercado<span className="font-light">pago</span></span>
                      </div>
                      <span className="text-sm font-bold tracking-tighter text-gray-400 italic">aws</span>
                    </div>
                  </div>
                </FadeIn>
              </div>

              {/* Right Column (Abstract SaaS Interface Representation) */}
              <div className="hidden lg:flex col-span-12 lg:col-span-6 items-center justify-end w-full h-full relative">
                <FadeIn delay={1000} duration={1000}>
                   <div className="relative w-[500px] h-[550px] perspective-1000">
                      {/* Floating Dashboard Card                        <div className="absolute top-10 right-0 w-[420px] bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 rounded-3xl p-6 shadow-2xl transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 z-20">
                         <div className="flex items-center justify-between mb-6 border-b border-gray-50 dark:border-white/5 pb-4">
                            <span className="text-gray-900 dark:text-white text-sm font-medium flex items-center gap-2"><span className="material-symbols-outlined text-ediflow-primary text-[18px]">auto_awesome</span> Procesamiento IA</span>
                            <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-bold">Activo</span>
                         </div>
                         <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                               <div key={i} className="flex justify-between items-center group">
                                  <div className="w-2/3 h-2.5 bg-gray-50 dark:bg-white/5 rounded overflow-hidden relative border border-gray-100 dark:border-white/10">
                                    <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-ediflow-primary to-blue-400" style={{width: `${Math.random() * 50 + 50}%`}}></div>
                                  </div>
                                  <span className="text-xs text-gray-400 font-mono group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Factura {i}</span>
                               </div>
                            ))}
                         </div>
                      </div>

                      {/* Floating Conserjería Card */}
                      <div className="absolute bottom-10 left-0 w-[300px] bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 rounded-3xl p-6 shadow-2xl transform rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500 z-30">
                          <div className="flex items-center gap-4 mb-5">
                             <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-blue-100 dark:border-blue-800/30">
                               <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg">mic</span>
                             </div>
                             <div>
                               <p className="text-gray-900 dark:text-white text-sm font-medium">Recepción por Voz</p>
                               <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest">IA NLP</p>
                             </div>
                          </div>
                          <div className="w-full bg-gray-50 dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/10">
                             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse inline-block mr-2 mb-0.5"></div>
                             <span className="text-xs text-gray-500 italic">"Analizando reporte de turno..."</span>
                          </div>
                      </div>
                      
                      {/* Floating Payment Notification */}
                      <div className="absolute top-1/2 -left-12 -translate-y-1/2 bg-gray-900 text-white px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl flex items-center gap-3 animate-float-slow z-40">
                         <span className="material-symbols-outlined text-ediflow-primary text-[18px]">verified</span>
                         Gasto Común Pagado
                      </div>
                   </div>
                </FadeIn>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Social Proof & Logo Ticker */}
      <section className="border-y border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#0D0D0D] relative z-20">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center">
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-8 text-center">
            Únete a los administradores que ya no usan Excel
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 dark:brightness-200 transition-all duration-500">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border border-gray-300 dark:border-gray-600 rounded"></div>
              <span className="text-xl font-bold tracking-tighter text-gray-900 dark:text-white">khipu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                 <span className="material-symbols-outlined text-[10px] text-gray-900 dark:text-white">handshake</span>
              </div>
              <span className="text-xl font-bold tracking-tighter text-gray-900 dark:text-white">mercado<span className="opacity-80">pago</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-2xl text-gray-900 dark:text-white">account_balance</span>
              <span className="text-xl font-medium tracking-tight text-gray-900 dark:text-white">Banco Integrado</span>
            </div>
          </div>
        </div>
      </section>

      {/* Superpowers Section (PAS Formula) */}
      <section id="superpoderes" className="py-32 px-6 lg:px-16 max-w-7xl mx-auto bg-white dark:bg-[#0A0A0A] relative z-20">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-[10px] bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 px-3 py-1 rounded-full uppercase tracking-widest text-blue-600 dark:text-blue-400 font-bold">Características Clave</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-5xl font-medium mb-6 tracking-tight text-gray-900 dark:text-white">Superpoderes en tu equipo.</h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">Resolviendo los dolores reales de la administración moderna con tecnología que funciona sola.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Gastos */}
          <div className="p-10 bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-white/10 hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-500 flex flex-col h-full rounded-[2.5rem] shadow-sm hover:shadow-xl group">
            <div className="w-14 h-14 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover:text-ediflow-primary group-hover:scale-110 transition-all mb-8 shadow-sm">
              <span className="material-symbols-outlined text-2xl">receipt_long</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight group-hover:text-ediflow-primary transition-colors">1. Gastos Automatizados</h3>
            <div className="space-y-6 flex-1 text-sm">
              <div>
                <span className="inline-block text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Problema</span>
                <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">¿Pasas horas digitando facturas manualmente a fin de mes?</p>
              </div>
              <div className="pt-6 border-t border-gray-100 dark:border-white/5">
                <span className="inline-block text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Solución IA</span>
                <p className="text-gray-700 dark:text-gray-300 font-light leading-relaxed">
                  Sube una foto. Nuestra IA extrae los montos, proveedores y cuadra los fondos en <strong className="text-gray-900 dark:text-white font-bold">3 segundos</strong>, listo para revisión.
                </p>
              </div>
            </div>
          </div>

          {/* Conserjería */}
          <div className="p-10 bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-white/10 hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-500 flex flex-col h-full rounded-[2.5rem] shadow-sm hover:shadow-xl group">
            <div className="w-14 h-14 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover:text-ediflow-primary group-hover:scale-110 transition-all mb-8 shadow-sm">
              <span className="material-symbols-outlined text-2xl">mic</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight group-hover:text-ediflow-primary transition-colors">2. Conserjería IA</h3>
            <div className="space-y-6 flex-1 text-sm">
              <div>
                <span className="inline-block text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Problema</span>
                <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">Libros de novedades ilegibles e información que se pierde entre turnos.</p>
              </div>
              <div className="pt-6 border-t border-gray-100 dark:border-white/5">
                <span className="inline-block text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Solución IA</span>
                <p className="text-gray-700 dark:text-gray-300 font-light leading-relaxed">
                  Tu equipo solo debe hablarle a la app. La IA transcribe reportes perfectos, detecta anomalías y capacita con el <strong className="text-gray-900 dark:text-white font-bold">Simulador OS10</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Cobros */}
          <div className="p-10 bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-white/10 hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-500 flex flex-col h-full rounded-[2.5rem] shadow-sm hover:shadow-xl group">
            <div className="w-14 h-14 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover:text-ediflow-primary group-hover:scale-110 transition-all mb-8 shadow-sm">
              <span className="material-symbols-outlined text-2xl">payments</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight group-hover:text-ediflow-primary transition-colors">3. Cobros Sin Fricción</h3>
            <div className="space-y-6 flex-1 text-sm">
              <div>
                <span className="inline-block text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Problema</span>
                <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">Alta morosidad y roces constantes por el cobro de gastos comunes.</p>
              </div>
              <div className="pt-6 border-t border-gray-100 dark:border-white/5">
                <span className="inline-block text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Solución IA</span>
                <p className="text-gray-700 dark:text-gray-300 font-light leading-relaxed">
                  Notificaciones push al celular. Pagan vía <strong className="text-gray-900 dark:text-white font-bold">Khipu o MercadoPago en 1 clic</strong> y el sistema concilia el banco.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contabilidad Autonoma */}
      <section className="bg-gray-50 dark:bg-[#0D0D0D] py-32 px-6 lg:px-16 border-t border-gray-100 dark:border-white/5 relative z-20 overflow-hidden text-gray-900 dark:text-white">
        <div className="absolute top-1/2 -left-1/4 w-[600px] h-[600px] bg-blue-100/30 dark:bg-blue-900/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          {/* Left: Text */}
          <div className="flex-1 w-full relative z-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-8 tracking-tight leading-[1.1]">
              Tu contabilidad cuadra sola en <span className="font-light text-ediflow-primary">3 segundos</span>.
            </h2>
            {/* PAS Formula */}
            <div className="space-y-8 mt-12 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-xl">
              <div>
                 <span className="inline-block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Problema Común</span>
                 <p className="text-gray-600 dark:text-gray-400 font-light text-base md:text-lg leading-relaxed">¿Pasas horas digitando facturas y cuadrando excels a fin de mes?</p>
              </div>
              <div className="pt-6 border-t border-gray-50 dark:border-white/5">
                 <span className="inline-block text-[10px] font-bold text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 px-3 py-1 rounded-full uppercase tracking-widest mb-3 bg-red-50 dark:bg-red-950/20">Riesgo Financiero</span>
                 <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed text-base">Un error de tipeo no solo genera reclamos por parte de la comunidad, te expone a <strong className="text-gray-900 dark:text-white font-bold">sanciones y multas legales</strong>.</p>
              </div>
              <div className="pt-6 border-t border-gray-50 dark:border-white/5">
                 <span className="inline-block text-[10px] font-bold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 tracking-widest mb-3 uppercase flex items-center gap-1.5 w-fit">
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span> Solución Ediflow
                 </span>
                 <p className="text-gray-700 dark:text-gray-300 font-light leading-relaxed text-base">Sube la foto del gasto: nuestro motor OCR extrae los montos, identifica al proveedor y calcula el prorrateo al instante.</p>
              </div>
            </div>
          </div>

          {/* Right: Mockup */}
          <div className="flex-1 w-full relative z-10 lg:pl-10">
            <div className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl group">
              {/* Header Mockup */}
              <div className="px-8 py-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-ediflow-primary text-xl">document_scanner</span>
                  <span className="text-sm font-bold">Motor OCR Inteligente</span>
                </div>
                <span className="text-[10px] bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800/30 px-3 py-1 rounded-full uppercase tracking-widest font-bold flex items-center gap-1">
                  En Línea
                </span>
              </div>

              {/* Content Mockup */}
              <div className="p-8 grid grid-cols-2 gap-8 relative">
                {/* Receipt Visual */}
                <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center relative overflow-hidden h-56 shadow-inner">
                  {/* Simulated receipt text with scanning line */}
                  <div className="w-28 h-40 bg-white dark:bg-gray-800 p-3 flex flex-col gap-2 rounded-lg shadow-sm justify-between">
                     <div>
                       <div className="h-1.5 bg-gray-100 dark:bg-gray-700 w-3/4 rounded mb-3"></div>
                       <div className="h-1.5 bg-gray-100 dark:bg-gray-700 w-1/2 rounded mb-5"></div>
                       <div className="h-1.5 bg-gray-50 dark:bg-gray-700/50 w-full rounded mt-3"></div>
                       <div className="h-1.5 bg-gray-50 dark:bg-gray-700/50 w-5/6 rounded mt-3"></div>
                       <div className="h-1.5 bg-gray-50 dark:bg-gray-700/50 w-4/6 rounded mt-3"></div>
                     </div>
                     <div className="text-[11px] font-mono text-gray-900 dark:text-white mt-auto self-end font-bold tracking-tight">$45.000</div>
                  </div>
                  {/* Scanning Laser */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-500 shadow-[0_0_20px_#3b82f6] animate-[scan_2.5s_ease-in-out_infinite]">
                  </div>
                </div>

                {/* Data Visual */}
                <div className="flex flex-col gap-4 justify-center">
                   <div className="flex flex-col gap-1.5 transition-all duration-700 delay-100 opacity-100">
                     <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">Proveedor Extraído</span>
                     <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl py-3 px-4 flex items-center justify-between shadow-sm">
                       <span className="text-xs font-bold">Enel Distribución</span>
                       <span className="material-symbols-outlined text-[16px] text-blue-500">check_circle</span>
                     </div>
                   </div>
                   <div className="flex flex-col gap-1.5 transition-all duration-700 delay-300 opacity-100">
                     <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">Monto Detectado</span>
                     <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl py-3 px-4 flex items-center justify-between shadow-sm">
                       <span className="text-xs font-mono font-bold">$45.000</span>
                       <span className="material-symbols-outlined text-[16px] text-blue-500">check_circle</span>
                     </div>
                   </div>
                   <div className="flex flex-col gap-1.5 transition-all duration-700 delay-500 opacity-100">
                     <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">Clasificación IA</span>
                     <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl py-3 px-4 flex items-center justify-between shadow-sm">
                       <span className="text-xs font-bold">Gastos Básicos</span>
                       <span className="material-symbols-outlined text-[16px] text-ediflow-primary">auto_awesome</span>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Legal Shield (El Escudo Legal) */}
      <section className="bg-white dark:bg-[#0A0A0A] py-24 px-6 lg:px-16 border-t border-gray-100 dark:border-white/5 relative z-20 text-gray-900 dark:text-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          {/* Left: Copywriting */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 tracking-tight leading-tight">
              Tu conserjería a prueba de multas. Tu comunidad en <span className="font-serif italic font-normal text-ediflow-primary">paz</span>.
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-light mb-10 leading-relaxed">
              La rotación de personal y las fiscalizaciones son un riesgo constante. Ediflow es el único software con un Simulador OS10 integrado que capacita a tu equipo con preguntas reales, mientras nuestro Bot de Soporte IA atiende las dudas cotidianas de los residentes por ti.
            </p>
            
            <ul className="space-y-4 mb-12">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800/30">
                  <span className="material-symbols-outlined text-[10px] text-blue-600 dark:text-blue-400">check</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-light text-sm font-medium">Módulo de capacitación OS10 integrado.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800/30">
                  <span className="material-symbols-outlined text-[10px] text-blue-600 dark:text-blue-400">check</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-light text-sm font-medium">Bot de soporte IA 24/7 para residentes.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800/30">
                  <span className="material-symbols-outlined text-[10px] text-blue-600 dark:text-blue-400">check</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-light text-sm font-medium">Gestión de paquetería con OCR ultrarrápido.</span>
              </li>
            </ul>

            <div className="bg-gray-50 dark:bg-[#111] p-6 border-l-4 border-ediflow-primary italic text-gray-600 dark:text-gray-400 rounded-r-2xl shadow-sm">
              "Desde que usamos el simulador de Ediflow, pasamos la inspección de Carabineros sin una sola observación."
            </div>
          </div>

          {/* Right: Static Mockup */}
          <div className="flex-1 w-full relative">
            <div className="w-full aspect-square md:aspect-[4/3] bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-6 flex flex-col shadow-2xl relative overflow-hidden group">
              {/* Decorative gradients */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-50"></div>

              {/* Bot Mockup header */}
              <div className="flex items-center gap-4 mb-8 border-b border-gray-100 dark:border-white/5 pb-6">
                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-blue-100 dark:border-blue-800/30">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl">smart_toy</span>
                </div>
                <div>
                  <h3 className="text-gray-900 dark:text-white font-bold">Asistente OS10</h3>
                  <p className="text-[10px] text-green-600 dark:text-green-400 uppercase tracking-widest font-bold flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                  </p>
                </div>
              </div>

              {/* Chat flow mockup */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="self-end bg-gray-100 dark:bg-white/5 rounded-2xl rounded-tr-sm p-4 max-w-[80%] shadow-sm">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">¿Qué debo hacer si encuentro un paquete sospechoso en recepción?</p>
                </div>
                
                <div className="self-start bg-blue-600 rounded-2xl rounded-tl-sm p-4 max-w-[85%] relative shadow-lg">
                  <div className="absolute -left-2 -top-2 w-5 h-5 rounded-full bg-white dark:bg-gray-800 border border-blue-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[10px] text-blue-600 dark:text-blue-400">smart_toy</span>
                  </div>
                  <p className="text-sm font-medium text-white leading-relaxed">
                    Según el protocolo OS10: No manipular el objeto, aislar la zona inmediata, evacuar parcialmente si es necesario y contactar inmediatamente a GOPE Carabineros indicando la ubicación exacta.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[10px] text-blue-100 uppercase tracking-widest font-bold">
                    <span className="material-symbols-outlined text-[12px]">verified</span>
                    Respuesta Certificada
                  </div>
                </div>
              </div>

              {/* Overlay gradient */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-[#111] to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Recaudacion Inmediata */}
      <section className="bg-gray-50 dark:bg-[#0D0D0D] py-24 px-6 lg:px-16 border-t border-gray-100 dark:border-white/5 relative z-20 text-gray-900 dark:text-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          {/* Left: Text & CTA */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-light mb-6 tracking-tight leading-tight">
              Elimina la morosidad con pagos a un <span className="font-bold">clic</span>.
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-light mb-10 leading-relaxed max-w-xl">
              Si pagar es fácil, la recaudación se acelera. Tus residentes pagan directamente desde su teléfono con Khipu o MercadoPago. La conciliación bancaria se hace sola.
            </p>
            
            <button 
              onClick={() => onNavigate && onNavigate('Register')}
              className="group bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-8 py-5 rounded-2xl font-bold tracking-tight hover:bg-ediflow-primary dark:hover:bg-ediflow-primary dark:hover:text-white active:scale-[0.98] transition-all w-full md:w-auto shadow-xl flex items-center justify-center gap-3"
            >
              Agendar Diagnóstico de mi Edificio
              <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-4 tracking-widest uppercase font-bold">Agenda disponible en 2 minutos.</p>
          </div>

          {/* Right: Abstract UI Mockup */}
          <div className="flex-1 w-full relative">
            <div className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col gap-6">
               {/* Gradients */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-30"></div>
               
               <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-6">
                 <div>
                   <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mb-1">Gasto Común - Octubre</p>
                   <h3 className="text-2xl font-mono font-bold">$124.500</h3>
                 </div>
                 <span className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/30 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold">Por vencer</span>
               </div>

               <div className="space-y-4">
                 <button className="w-full bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 p-4 rounded-2xl flex items-center justify-center gap-3 transition-colors group">
                    <div className="w-6 h-6 border border-gray-300 dark:border-gray-600 rounded group-hover:border-gray-900 dark:group-hover:border-white transition-colors"></div>
                    <span className="font-bold tracking-tighter">khipu</span>
                 </button>
                 <button className="w-full bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 p-4 rounded-2xl flex items-center justify-center gap-3 transition-colors">
                    <div className="w-6 h-6 rounded-full border border-blue-300 dark:border-blue-700 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[10px] text-blue-600 dark:text-blue-400 font-bold">handshake</span>
                    </div>
                    <span className="font-bold tracking-tighter">mercado<span className="opacity-80">pago</span></span>
                 </button>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* OS10 Gated Content - Glassmorphism Edition */}
      <section className="bg-white dark:bg-[#0A0A0C] py-32 px-6 lg:px-16 border-t border-gray-100 dark:border-white/5 relative z-20 transition-colors overflow-hidden">
        {/* Luces Ambientales (El Secreto del Vidrio) - Ajustadas para visibilidad en ambos modos */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 dark:bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 translate-x-1/2 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative group">
          {/* La Tarjeta Glassmorphic */}
          <div className="relative z-10 mx-auto max-w-4xl rounded-[3rem] bg-gray-50/50 dark:bg-white/5 backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-10 md:p-16 lg:p-20 shadow-2xl overflow-hidden">
             {/* Decorative Grain */}
             <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>
             
             <div className="relative z-20 flex flex-col items-center text-center">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full mb-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-[0.2em]">Simulador de Certificación</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-5xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 tracking-tight text-balance leading-tight">
                    ¿Pasaría tu equipo el test OS10 hoy?
                  </h2>
                  
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                    Evita multas y vulnerabilidades. Envía a tus conserjes a practicar en nuestro simulador oficial gratuito y blinda la seguridad de tu comunidad sin costo inicial.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onNavigate && onNavigate('OS10Simulator')}
                      className="group bg-black text-white dark:bg-white dark:text-black px-10 py-5 rounded-2xl font-bold tracking-tight shadow-xl hover:shadow-2xl transition-all flex items-center gap-3"
                    >
                      <span>⚡ Iniciar Prueba a Conserjes</span>
                      <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </motion.button>
                    
                    <div className="flex flex-col items-center sm:items-start gap-1">
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#111] bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?u=ediflow-${i}`} alt="User" referrerPolicy="no-referrer" />
                          </div>
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#111] bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-[10px] font-bold text-gray-400">
                          +50
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-2">
                        <span className="text-green-500 inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                        Administradores activos hoy
                      </p>
                    </div>
                  </div>
                </motion.div>
             </div>
          </div>
          
          {/* Isometric Decorative Element (Subtle) */}
          <div className="absolute -bottom-10 -right-10 md:right-0 z-0 opacity-10 dark:opacity-20 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-700">
             <div className="w-64 h-80 bg-gradient-to-br from-gray-200 dark:from-white/10 to-transparent rounded-3xl border border-gray-200 dark:border-white/10 transform rotate-12 skew-x-12 blur-[1px]"></div>
          </div>
        </div>
      </section>


      {/* Expanded SEO B2B Footer */}
      <footer className="bg-gray-50 dark:bg-[#050505] pt-20 pb-10 border-t border-gray-200 dark:border-white/5 relative z-20 text-gray-900 dark:text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          
          {/* Main Footer Links */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <Logo variant="horizontal" color="currentColor" className="scale-75 origin-left opacity-80 mb-6" />
              <p className="text-gray-500 dark:text-gray-400 text-sm font-light max-w-sm leading-relaxed mb-6">
                El sistema operativo impulsado por Inteligencia Artificial que transforma la gestión de comunidades en una ventaja competitiva de principio a fin.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-900 dark:hover:border-white/20 transition-colors cursor-pointer border border-gray-200 dark:border-white/10">
                  <span className="material-symbols-outlined text-[16px]">public</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-900 dark:hover:border-white/20 transition-colors cursor-pointer border border-gray-200 dark:border-white/10">
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                </div>
              </div>
            </div>

            {/* Silo: Alternativas (SEO Capture) */}
            <div>
              <h4 className="font-bold mb-6">Alternativas</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-500 dark:text-gray-400 text-sm hover:text-gray-900 dark:hover:text-white hover:underline transition-colors block">Alternativa a ComunidadFeliz</a></li>
                <li><a href="#" className="text-gray-500 dark:text-gray-400 text-sm hover:text-gray-900 dark:hover:text-white hover:underline transition-colors block">Alternativa a Edifito</a></li>
                <li><a href="#" className="text-gray-500 dark:text-gray-400 text-sm hover:text-gray-900 dark:hover:text-white hover:underline transition-colors block">Alternativa a Kastor</a></li>
              </ul>
            </div>

            {/* Silo: Recursos */}
            <div>
              <h4 className="font-bold mb-6">Herramientas Gratuitas</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-500 dark:text-gray-400 text-sm hover:text-ediflow-primary transition-colors flex items-center gap-2 block"><span className="material-symbols-outlined text-[14px]">school</span> Simulador OS10</a></li>
                <li><a href="#" className="text-gray-500 dark:text-gray-400 text-sm hover:text-gray-900 dark:hover:text-white transition-colors block">Checklist Ley 21.442</a></li>
                <li><a href="#" className="text-gray-500 dark:text-gray-400 text-sm hover:text-gray-900 dark:hover:text-white transition-colors block">Blog y Casos de Uso</a></li>
              </ul>
            </div>
          </div>

          {/* Breadcrumbs (SEO Structural Requirement) */}
          <div className="border-t border-gray-200 dark:border-white/5 py-4 mb-4">
             <nav className="flex items-center text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest gap-2">
                 <a href="#" className="hover:text-ediflow-primary transition-colors">Inicio</a>
                 <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                 <a href="#" className="hover:text-ediflow-primary transition-colors">Software</a>
                 <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                 <span className="text-gray-900 dark:text-white">EdiFlow SaaS</span>
             </nav>
          </div>

          {/* Copyright & Legal */}
          <div className="border-t border-gray-200 dark:border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-900 dark:text-white">
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
};

export default LandingPage;
