import React, { useState, useEffect } from 'react';
import { Logo } from '../components/Logo';

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
    <div className="bg-black text-white font-sans selection:bg-white/20 selection:text-white">
      {/* Sticky Navigation Bar */}
      <header className={`fixed top-0 inset-x-0 w-full z-50 transition-all duration-500 ease-in-out ${scrollOpacity > 0.05 ? 'bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105" onClick={() => window.scrollTo(0,0)}>
            <Logo variant="horizontal" color="#FFFFFF" className="scale-[0.8] origin-left" />
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            <div 
              onClick={() => onNavigate && onNavigate('Solutions')}
              className="group relative cursor-pointer flex items-center gap-1 text-sm font-medium text-[#A3A3A3] hover:text-white transition-colors"
            >
              Soluciones <span className="material-symbols-outlined text-[14px] group-hover:rotate-180 transition-transform">expand_more</span>
            </div>
            <div className="group relative cursor-pointer flex items-center gap-1 text-sm font-medium text-[#A3A3A3] hover:text-white transition-colors">
              Producto <span className="material-symbols-outlined text-[14px] group-hover:rotate-180 transition-transform">expand_more</span>
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

          {/* Right: Actions */}
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

      {/* Hero Section */}
      <section className="relative w-full h-screen flex flex-col overflow-hidden bg-[#0A0A0A]">
        {/* Subtle Grid and Glow instead of Video/Image of buildings */}
        <div className="absolute inset-0 z-0 opacity-20">
           <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-ediflow-primary/10 blur-[150px] rounded-[100%] pointer-events-none z-0 mix-blend-screen"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-[100%] pointer-events-none z-0 mix-blend-screen"></div>

        {/* Gradient Transition to next section */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#050505] to-transparent z-0 pointer-events-none" />

        {/* Main Layout Overlay */}
        <div className="relative z-10 flex flex-col h-full pt-20">
          {/* Hero Content */}
          <div className="px-6 md:px-12 lg:px-16 flex-1 flex flex-col justify-center lg:justify-end pb-12 lg:pb-16 w-full max-w-7xl mx-auto">
            <div className="lg:grid lg:grid-cols-2 lg:items-center w-full gap-12">
              
              {/* Left Column (Copywriter) */}
              <div className="flex flex-col items-start w-full">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight leading-[1.1] mb-4">
                  Cuadra tus gastos comunes en <span className="font-medium text-ediflow-primary">3 segundos</span> usando IA.
                </h1>
                <h2 className="text-xl md:text-2xl text-white font-medium mb-6 font-serif italic">
                  Sin pelear con Excel ni arriesgar multas.
                </h2>
                
                <FadeIn delay={400} duration={1000}>
                  <p className="text-base md:text-lg text-gray-300 mb-8 max-w-xl leading-relaxed">
                    Ediflow lee tus facturas automáticamente, permite a los conserjes reportar por voz y a los residentes pagar con 0% de comisión. Tu condominio en piloto automático, cumpliendo con la Ley chilena.
                  </p>
                </FadeIn>

                <FadeIn delay={800} duration={1000} className="w-full">
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <button 
                      onClick={() => onNavigate && onNavigate('Pricing')}
                      className="bg-ediflow-primary text-black px-8 py-3.5 rounded-xl font-semibold hover:bg-white transition-all shadow-[0_0_20px_rgba(0,174,239,0.2)] md:w-auto w-full flex justify-center items-center gap-2"
                    >
                      Empezar Prueba Gratis
                    </button>
                    <button 
                      onClick={() => onNavigate && onNavigate('BookDemo')}
                      className="border border-white/20 text-white bg-transparent px-8 py-3.5 rounded-xl font-medium hover:bg-white/5 transition-all md:w-auto w-full flex justify-center items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">play_circle</span> Ver IA en acción (3 min)
                    </button>
                  </div>
                  
                  {/* Social Proof */}
                  <div className="flex flex-col items-start gap-3 border-t border-white/10 pt-6">
                    <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-[0.2em]">Integración nativa y segura con</p>
                    <div className="flex items-center gap-6 opacity-70">
                      <span className="text-sm font-bold tracking-tighter text-white">khipu</span>
                      <div className="flex items-center gap-1 text-white">
                        <span className="material-symbols-outlined text-[10px]">handshake</span>
                        <span className="text-sm font-bold tracking-tighter">mercado<span className="opacity-80 font-normal">pago</span></span>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </div>

              {/* Right Column (Abstract SaaS Interface Representation) */}
              <div className="hidden lg:flex items-center justify-end w-full h-[500px]">
                <FadeIn delay={1400} duration={1000}>
                   <div className="relative w-[500px] h-[400px]">
                      {/* Floating Dashboard Card */}
                      <div className="absolute top-0 right-0 w-[380px] h-[220px] bg-[#111] border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur transform -rotate-2 hover:rotate-0 transition-transform duration-500 z-20">
                         <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                            <span className="text-white text-sm font-medium">Lectura OCR de Gastos</span>
                            <span className="bg-green-500/10 text-green-400 text-[10px] px-2 py-1 rounded-full uppercase tracking-widest font-semibold">+ 42 procesadas</span>
                         </div>
                         <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                               <div key={i} className="flex justify-between items-center group">
                                  <div className="w-1/2 h-2 bg-white/10 rounded overflow-hidden relative">
                                    <div className="absolute top-0 left-0 h-full bg-ediflow-primary/70 animate-[pulse_2s_ease-in-out_infinite]" style={{width: `${Math.random() * 50 + 50}%`}}></div>
                                  </div>
                                  <span className="text-xs text-gray-400 font-mono group-hover:text-white transition-colors">Enel S.A.</span>
                               </div>
                            ))}
                         </div>
                      </div>

                      {/* Floating Conserjería Card */}
                      <div className="absolute bottom-0 left-0 w-[280px] h-[180px] bg-[#0A0A0A] border border-white/5 rounded-2xl p-5 shadow-2xl backdrop-blur-md transform rotate-3 hover:rotate-0 transition-transform duration-500 z-30">
                          <div className="flex items-center gap-3 mb-4">
                             <div className="w-8 h-8 rounded-full bg-ediflow-primary/20 flex items-center justify-center">
                               <span className="material-symbols-outlined text-ediflow-primary text-sm">mic</span>
                             </div>
                             <div>
                               <p className="text-white text-xs font-medium">Asistente de Voz</p>
                               <p className="text-[10px] text-gray-500 uppercase tracking-widest">Activo 24/7</p>
                             </div>
                          </div>
                          <div className="w-full bg-white/5 rounded-lg p-3 border border-white/5">
                             <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce inline-block mr-2"></div>
                             <span className="text-xs text-gray-400 italic">"Registrando encomienda Depto 402..."</span>
                          </div>
                      </div>
                      
                      {/* Floating Payment Notification */}
                      <div className="absolute -right-8 bottom-12 bg-white text-black px-4 py-2 rounded-xl text-xs font-medium shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center gap-2 animate-[pulse_4s_ease-in-out_infinite]">
                         <span className="material-symbols-outlined text-green-500 text-[14px]">check_circle</span>
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
      <section className="border-b border-white/10 bg-[#050505] relative z-20">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-[0.2em] mb-8 text-center">
            Únete a los administradores que ya no usan Excel
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border border-white/20 rounded"></div>
              <span className="text-xl font-bold tracking-tighter">khipu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center">
                 <span className="material-symbols-outlined text-[10px]">handshake</span>
              </div>
              <span className="text-xl font-bold tracking-tighter">mercado<span className="opacity-80">pago</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-2xl">account_balance</span>
              <span className="text-xl font-medium tracking-tight">Banco Integrado</span>
            </div>
          </div>
        </div>
      </section>

      {/* Superpowers Section (PAS Formula) */}
      <section id="superpoderes" className="py-24 px-6 lg:px-16 max-w-7xl mx-auto bg-black relative z-20">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 tracking-tight">Superpoderes en tu equipo.</h2>
          <p className="text-base md:text-lg text-gray-400 font-light max-w-2xl mx-auto">Resolviendo los dolores reales de la administración moderna con tecnología que funciona sola.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gastos */}
          <div className="p-8 bg-[#0A0A0A] border border-white/10 hover:border-white/20 transition-colors duration-500 flex flex-col h-full rounded-[24px]">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white mb-6">
              <span className="material-symbols-outlined text-xl">receipt_long</span>
            </div>
            <h3 className="text-lg font-medium text-white mb-8 tracking-wide">1. Gastos</h3>
            <div className="space-y-6 flex-1 text-sm">
              <div>
                <span className="inline-block text-[10px] font-semibold text-white/40 border border-white/10 px-2 py-1 rounded-full uppercase tracking-widest mb-3">Problema</span>
                <p className="text-gray-300">¿Pasas horas digitando facturas manualmente a fin de mes?</p>
              </div>
              <div>
                <span className="inline-block text-[10px] font-semibold text-white/40 border border-white/10 px-2 py-1 rounded-full uppercase tracking-widest mb-3">Solución IA</span>
                <p className="text-gray-400 leading-relaxed">
                  Sube una foto. Nuestra Inteligencia Artificial extrae los montos, proveedores y cuadra los fondos en <strong className="text-white font-normal">3 segundos</strong>, listo para revisión.
                </p>
              </div>
            </div>
          </div>

          {/* Conserjería */}
          <div className="p-8 bg-[#0A0A0A] border border-white/10 hover:border-white/20 transition-colors duration-500 flex flex-col h-full rounded-[24px]">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white mb-6">
              <span className="material-symbols-outlined text-xl">mic</span>
            </div>
            <h3 className="text-lg font-medium text-white mb-8 tracking-wide">2. Conserjería</h3>
            <div className="space-y-6 flex-1 text-sm">
              <div>
                <span className="inline-block text-[10px] font-semibold text-white/40 border border-white/10 px-2 py-1 rounded-full uppercase tracking-widest mb-3">Problema</span>
                <p className="text-gray-300">Libros de novedades ilegibles e información que se pierde entre turnos.</p>
              </div>
              <div>
                <span className="inline-block text-[10px] font-semibold text-white/40 border border-white/10 px-2 py-1 rounded-full uppercase tracking-widest mb-3">Solución IA</span>
                <p className="text-gray-400 leading-relaxed">
                  Tu equipo solo debe hablarle a la app. La IA transcribe reportes perfectos, detecta anomalías y los capacita con el <strong className="text-white font-normal">Simulador OS10</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Cobros */}
          <div className="p-8 bg-[#0A0A0A] border border-white/10 hover:border-white/20 transition-colors duration-500 flex flex-col h-full rounded-[24px]">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white mb-6">
              <span className="material-symbols-outlined text-xl">payments</span>
            </div>
            <h3 className="text-lg font-medium text-white mb-8 tracking-wide">3. Cobros</h3>
            <div className="space-y-6 flex-1 text-sm">
              <div>
                <span className="inline-block text-[10px] font-semibold text-white/40 border border-white/10 px-2 py-1 rounded-full uppercase tracking-widest mb-3">Problema</span>
                <p className="text-gray-300">Alta morosidad y roces constantes por el cobro de gastos comunes.</p>
              </div>
              <div>
                <span className="inline-block text-[10px] font-semibold text-white/40 border border-white/10 px-2 py-1 rounded-full uppercase tracking-widest mb-3">Solución IA</span>
                <p className="text-gray-400 leading-relaxed">
                  Notificaciones automáticas al celular. Pagan con <strong className="text-white font-normal">Khipu o MercadoPago en 1 clic</strong> y el sistema concilia el banco por ti.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contabilidad Autonoma */}
      <section className="bg-[#050505] py-24 px-6 lg:px-16 border-t border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          {/* Left: Text */}
          <div className="flex-1 w-full relative">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 tracking-tight leading-tight">
              Tu contabilidad cuadra sola en <span className="font-medium text-white">3 segundos</span>.
            </h2>
            {/* PAS Formula */}
            <div className="space-y-6 mb-8 mt-12">
              <div>
                 <span className="inline-block text-[10px] font-semibold text-white/40 border border-white/10 px-2 py-1 rounded-full uppercase tracking-widest mb-3">Problema</span>
                 <p className="text-gray-300 font-light text-base md:text-lg leading-relaxed">¿Pasas horas digitando facturas a fin de mes?</p>
              </div>
              <div>
                 <span className="inline-block text-[10px] font-semibold text-red-400/60 border border-red-500/20 px-2 py-1 rounded-full text-red-400 uppercase tracking-widest mb-3 bg-red-500/5">Agitación</span>
                 <p className="text-gray-400 font-light leading-relaxed">Un error de tipeo no solo genera reclamos por parte de la comunidad, te expone a <strong className="text-white font-normal">sanciones legales</strong>.</p>
              </div>
              <div>
                 <span className="inline-block text-[10px] font-semibold text-ediflow-primary/80 border border-ediflow-primary/30 px-2 py-1 rounded-full text-ediflow-primary tracking-widest mb-3 bg-ediflow-primary/5 uppercase">Solución</span>
                 <p className="text-gray-300 font-light leading-relaxed">Sube la foto del gasto: nuestro OCR extrae los montos, identifica al proveedor y calcula el prorrateo al instante.</p>
              </div>
            </div>

            {/* SEO Text */}
            <div className="sr-only">
              Alternativas a Edipro en Chile. Alternativas a ComunidadFeliz en Chile. Alternativas a Kastor en Chile. Software de gastos comunes líder en automatización e inteligencia artificial.
            </div>
            <p className="text-[9px] text-gray-600/50 uppercase tracking-widest font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[12px]">search</span>
              Alternativas a software de gastos comunes
            </p>
          </div>

          {/* Right: Mockup */}
          <div className="flex-1 w-full relative">
            {/* Decorative */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-ediflow-primary/5 rounded-full blur-3xl opacity-50"></div>
            
            <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-[32px] overflow-hidden flex flex-col shadow-2xl group">
              {/* Header Mockup */}
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-black/50">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gray-400 text-xl">document_scanner</span>
                  <span className="text-sm font-medium text-white">Scanner Inteligente OCR</span>
                </div>
                <span className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded uppercase tracking-widest font-semibold flex items-center gap-1">
                  Sincronizado
                </span>
              </div>

              {/* Content Mockup */}
              <div className="p-6 grid grid-cols-2 gap-6 relative">
                {/* Receipt Visual */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden h-48">
                  {/* Simulated receipt text with scanning line */}
                  <div className="w-24 h-36 bg-black border border-white/20 p-2 flex flex-col gap-2 rounded shadow-inner justify-between">
                     <div>
                       <div className="h-1 lg:h-1.5 bg-white/20 w-3/4 rounded mb-2"></div>
                       <div className="h-1 lg:h-1.5 bg-white/20 w-1/2 rounded mb-4"></div>
                       <div className="h-1 lg:h-1.5 bg-white/10 w-full rounded mt-4"></div>
                       <div className="h-1 lg:h-1.5 bg-white/10 w-5/6 rounded mt-2"></div>
                       <div className="h-1 lg:h-1.5 bg-white/10 w-4/6 rounded mt-2"></div>
                     </div>
                     <div className="text-[10px] font-mono text-gray-300 mt-auto self-end font-bold">$45.000</div>
                  </div>
                  {/* Scanning Laser */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-ediflow-primary shadow-[0_0_15px_#00AEEF] animate-[scan_2s_ease-in-out_infinite]">
                     <style>{`
                       @keyframes scan {
                         0% { top: 10%; opacity: 0; }
                         15% { opacity: 1; }
                         85% { opacity: 1; }
                         100% { top: 90%; opacity: 0; }
                       }
                     `}</style>
                  </div>
                </div>

                {/* Data Visual */}
                <div className="flex flex-col gap-3 justify-center">
                   <div className="flex flex-col gap-1 transition-all duration-700 delay-100 opacity-100">
                     <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">Proveedor</span>
                     <div className="bg-black border border-ediflow-primary/30 rounded py-2.5 px-3 flex items-center justify-between shadow-[0_0_15px_rgba(0,174,239,0.1)]">
                       <span className="text-xs text-white">Enel Distribución</span>
                       <span className="material-symbols-outlined text-[14px] text-ediflow-primary">check_circle</span>
                     </div>
                   </div>
                   <div className="flex flex-col gap-1 transition-all duration-700 delay-300 opacity-100">
                     <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">Monto Total</span>
                     <div className="bg-black border border-ediflow-primary/30 rounded py-2.5 px-3 flex items-center justify-between shadow-[0_0_15px_rgba(0,174,239,0.1)]">
                       <span className="text-xs text-white font-mono">$45.000</span>
                       <span className="material-symbols-outlined text-[14px] text-ediflow-primary">check_circle</span>
                     </div>
                   </div>
                   <div className="flex flex-col gap-1 transition-all duration-700 delay-500 opacity-100">
                     <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">Categoría</span>
                     <div className="bg-black border border-ediflow-primary/30 rounded py-2.5 px-3 flex items-center justify-between shadow-[0_0_15px_rgba(0,174,239,0.1)]">
                       <span className="text-xs text-white">Gastos Básicos</span>
                       <span className="material-symbols-outlined text-[14px] text-ediflow-primary">check_circle</span>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Legal Shield (El Escudo Legal) */}
      <section className="bg-black py-24 px-6 lg:px-16 border-t border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          {/* Left: Copywriting */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 tracking-tight leading-tight">
              Tu conserjería a prueba de multas. Tu comunidad en <span className="font-serif italic font-normal text-white">paz</span>.
            </h2>
            <p className="text-base md:text-lg text-gray-400 font-light mb-10 leading-relaxed">
              La rotación de personal y las fiscalizaciones son un riesgo constante. Ediflow es el único software con un Simulador OS10 integrado que capacita a tu equipo con preguntas reales, mientras nuestro Bot de Soporte IA atiende las dudas cotidianas de los residentes por ti.
            </p>
            
            <ul className="space-y-4 mb-12">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[10px] text-white">check</span>
                </div>
                <span className="text-gray-300 font-light">Módulo de capacitación OS10 integrado.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[10px] text-white">check</span>
                </div>
                <span className="text-gray-300 font-light">Bot de soporte IA 24/7 para residentes.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[10px] text-white">check</span>
                </div>
                <span className="text-gray-300 font-light">Gestión de paquetería con OCR ultrarrápido.</span>
              </li>
            </ul>

            <div className="bg-[#0A0A0A] p-6 border-l-2 border-white/20 italic text-gray-400 rounded-r-2xl">
              "Desde que usamos el simulador de Ediflow, pasamos la inspección de Carabineros sin una sola observación."
            </div>
          </div>

          {/* Right: Static Mockup */}
          <div className="flex-1 w-full relative">
            <div className="w-full aspect-square md:aspect-[4/3] bg-[#0A0A0A] border border-white/10 rounded-[32px] p-6 flex flex-col shadow-2xl relative overflow-hidden group">
              {/* Decorative gradients */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-ediflow-primary/5 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl opacity-50"></div>

              {/* Bot Mockup header */}
              <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ediflow-primary/20 to-transparent flex items-center justify-center border border-ediflow-primary/30">
                  <span className="material-symbols-outlined text-ediflow-primary text-xl">smart_toy</span>
                </div>
                <div>
                  <h3 className="text-white font-medium">Asistente OS10</h3>
                  <p className="text-[10px] text-green-400 uppercase tracking-widest font-semibold flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                  </p>
                </div>
              </div>

              {/* Chat flow mockup */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="self-end bg-white/10 border border-white/5 rounded-2xl rounded-tr-sm p-4 max-w-[80%]">
                  <p className="text-sm font-light text-gray-300">¿Qué debo hacer si encuentro un paquete sospechoso en recepción?</p>
                </div>
                
                <div className="self-start bg-black border border-white/10 rounded-2xl rounded-tl-sm p-4 max-w-[85%] relative">
                  <div className="absolute -left-2 -top-2 w-5 h-5 rounded-full bg-black border border-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[10px] text-ediflow-primary">smart_toy</span>
                  </div>
                  <p className="text-sm font-light text-gray-300 leading-relaxed">
                    Según el protocolo OS10: No manipular el objeto, aislar la zona inmediata, evacuar parcialmente si es necesario y contactar inmediatamente a GOPE Carabineros indicando la ubicación exacta.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[10px] text-ediflow-primary uppercase tracking-widest font-semibold">
                    <span className="material-symbols-outlined text-[12px]">verified</span>
                    Respuesta Certificada
                  </div>
                </div>
              </div>

              {/* Overlay pulse to make it feel alive without animation aggressiveness */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Recaudacion Inmediata (Closing) */}
      <section className="bg-[#050505] py-24 px-6 lg:px-16 border-t border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          {/* Left: Text & CTA */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-light mb-6 tracking-tight leading-tight">
              Elimina la morosidad con pagos a un <span className="font-medium text-white">clic</span>.
            </h2>
            <p className="text-base md:text-lg text-gray-400 font-light mb-10 leading-relaxed max-w-xl">
              Si pagar es fácil, la recaudación se acelera. Tus residentes pagan directamente desde su teléfono con Khipu o MercadoPago. La conciliación bancaria se hace sola.
            </p>
            
            <button 
              onClick={() => onNavigate && onNavigate('BookDemo')}
              className="bg-ediflow-primary text-black px-8 py-4 rounded-xl font-medium hover:bg-white hover:text-black transition-colors w-full md:w-auto shadow-[0_0_20px_rgba(0,174,239,0.2)]"
            >
              Agendar Diagnóstico de mi Edificio
            </button>
            <p className="text-[10px] text-gray-500 mt-4 tracking-widest uppercase">Agenda disponible en 2 minutos.</p>
          </div>

          {/* Right: Abstract UI Mockup */}
          <div className="flex-1 w-full relative">
            <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col gap-6">
               {/* Gradients */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-ediflow-primary/10 rounded-full blur-3xl opacity-30"></div>
               
               <div className="flex items-center justify-between border-b border-white/10 pb-6">
                 <div>
                   <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Gasto Común - Octubre</p>
                   <h3 className="text-2xl text-white font-mono">$124.500</h3>
                 </div>
                 <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold">Por vencer</span>
               </div>

               <div className="space-y-4">
                 <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl flex items-center justify-center gap-3 transition-colors group">
                    <div className="w-6 h-6 border border-white/20 rounded group-hover:border-white transition-colors"></div>
                    <span className="text-white font-bold tracking-tighter">khipu</span>
                 </button>
                 <button className="w-full bg-[#009EE3]/10 hover:bg-[#009EE3]/20 border border-[#009EE3]/30 p-4 rounded-2xl flex items-center justify-center gap-3 transition-colors">
                    <div className="w-6 h-6 rounded-full border border-[#009EE3]/50 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[10px] text-[#009EE3]">handshake</span>
                    </div>
                    <span className="text-white font-bold tracking-tighter">mercado<span className="opacity-80">pago</span></span>
                 </button>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* OS10 Gated Content (Lead Capture) */}
      <section className="bg-black py-24 px-6 lg:px-16 border-t border-white/5 relative z-20">
        <div className="max-w-6xl mx-auto bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
          
          {/* Subtle Grain overlay */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>

          {/* Left Column: Text & Capture */}
          <div className="flex-1 p-10 md:p-14 lg:p-20 relative z-10 flex flex-col justify-center">
            <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6 leading-tight">
              ¿Pasarían tus conserjes una fiscalización hoy? <span className="font-serif italic text-white/50 block mt-2 tracking-normal">Descúbrelo en 2 minutos.</span>
            </h2>
            <p className="text-base md:text-lg font-light text-gray-400 mb-10 leading-relaxed">
              Las multas de la Ley 21.442 no perdonan. Evalúa a tu equipo gratis con nuestro <strong className="text-white font-normal hover:text-ediflow-primary transition-colors cursor-default">Simulador OS10 oficial</strong> (basado en 50 preguntas reales de Carabineros de Chile).
            </p>
            
            <form className="w-full max-w-md flex flex-col gap-4" onSubmit={(e) => {
              e.preventDefault();
              alert('Lead capturado. Iniciando simulación OS10 y retargeting pixel tag...');
            }}>
              <input 
                type="email" 
                placeholder="Tu correo corporativo" 
                className="w-full bg-[#0A0A0A] border border-white/10 text-white px-6 h-14 rounded-xl outline-none font-light placeholder:text-gray-600 focus:border-ediflow-primary/50 focus:ring-1 focus:ring-ediflow-primary/50 transition-all"
                required
              />
              <button 
                type="submit"
                className="w-full h-14 bg-white hover:bg-gray-200 text-black font-medium rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 text-sm group"
              >
                Iniciar Evaluación Gratuita
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </form>
            
            <div className="mt-8 flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <p className="text-[10px] text-gray-500 font-semibold tracking-widest uppercase">
                12 Administradores tomando el test
              </p>
            </div>
          </div>

          {/* Right Column: Isometric Mockup */}
          <div className="flex-1 bg-[#0A0A0A] relative flex items-center justify-center p-10 md:p-16 overflow-hidden min-h-[400px]">
            {/* Dark abstract glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-radial from-ediflow-primary/5 to-transparent blur-3xl opacity-50"></div>
            
            {/* Deep perspective container for Isometric effect */}
            <div className="relative z-10 w-full max-w-sm shrink-0 perspective-[1000px]">
              {/* Floating Badge (100% Pass) */}
              <div className="absolute -top-6 -right-6 z-20 bg-black/80 backdrop-blur-md border border-green-500/30 px-4 py-2 rounded-xl shadow-[0_0_30px_rgba(74,222,128,0.2)] flex items-center gap-2 animate-[pulse_4s_ease-in-out_infinite] transform translate-translate-z-10 rotate-3">
                <span className="material-symbols-outlined text-green-400 text-lg">hotel_class</span>
                <span className="text-white text-xs font-bold font-mono">100% APROBADO</span>
              </div>

              {/* Tablet Hardware Shell (Isometric Rotation) */}
              <div 
                className="w-full aspect-[3/4] bg-[#1a1a1a] rounded-[2rem] border-4 border-[#333] shadow-[-20px_20px_40px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden relative transition-transform duration-1000"
                style={{ transform: 'rotateX(10deg) rotateY(-15deg) rotateZ(5deg)' }}
              >
                {/* Screen Reflection overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none z-30"></div>
                
                {/* OS10 Software Header */}
                <div className="bg-[#050505] p-4 border-b border-white/5 flex items-center justify-between z-10 shrink-0">
                  <span className="text-[9px] text-gray-500 font-mono tracking-widest uppercase">Módulo OS10</span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  </div>
                </div>

                {/* Software Body */}
                <div className="flex-1 bg-black p-5 flex flex-col gap-6 relative z-10">
                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2">
                       <span>Pregunta 14/50</span>
                       <span className="text-ediflow-primary">Tiempo: 12:45</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className="w-[28%] h-full bg-ediflow-primary rounded-full"></div>
                    </div>
                  </div>

                  {/* Question */}
                  <h4 className="text-white text-sm font-medium leading-relaxed">
                    Si durante su ronda perimetral detecta una persona escalando la reja norte de la comunidad, el protocolo inmediato es:
                  </h4>

                  {/* Options */}
                  <div className="space-y-3 mt-auto">
                    <div className="w-full bg-[#111] border border-white/10 rounded-lg p-3 py-2 flex items-center gap-3">
                      <div className="w-5 h-5 rounded-md border border-white/20 flex items-center justify-center shrink-0">
                        <span className="text-[10px] text-gray-400 font-bold">A</span>
                      </div>
                      <span className="text-xs text-gray-400 font-light truncate">Grabar con celular y observar.</span>
                    </div>
                    <div className="w-full bg-ediflow-primary/10 border border-ediflow-primary/50 shadow-[0_0_15px_rgba(0,174,239,0.1)] rounded-lg p-3 py-2 flex items-center gap-3 relative overflow-hidden">
                      <div className="w-5 h-5 rounded-md bg-ediflow-primary flex items-center justify-center shrink-0">
                        <span className="text-[10px] text-black font-bold">B</span>
                      </div>
                      <span className="text-xs text-white font-medium truncate">Activar alarma y llamar al Plan Cuadrante.</span>
                      <span className="material-symbols-outlined text-ediflow-primary text-[14px] absolute right-3">check_circle</span>
                    </div>
                    <div className="w-full bg-[#111] border border-white/10 rounded-lg p-3 py-2 flex items-center gap-3">
                      <div className="w-5 h-5 rounded-md border border-white/20 flex items-center justify-center shrink-0">
                        <span className="text-[10px] text-gray-400 font-bold">C</span>
                      </div>
                      <span className="text-xs text-gray-400 font-light truncate">Enfrentar directamente al intruso.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expanded SEO B2B Footer */}
      <footer className="bg-[#050505] pt-20 pb-10 border-t border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          
          {/* Main Footer Links */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <Logo variant="horizontal" color="#FFFFFF" className="scale-75 origin-left opacity-60 mb-6" />
              <p className="text-gray-400 text-sm font-light max-w-sm leading-relaxed mb-6">
                El sistema operativo impulsado por Inteligencia Artificial que transforma la gestión de comunidades en una ventaja competitiva de principio a fin.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                  <span className="material-symbols-outlined text-[16px]">public</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                </div>
              </div>
            </div>

            {/* Silo: Alternativas (SEO Capture) */}
            <div>
              <h4 className="text-white text-sm font-medium mb-6">Alternativas</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-[#A3A3A3] text-sm hover:text-white hover:underline transition-colors block">Alternativa a ComunidadFeliz</a></li>
                <li><a href="#" className="text-[#A3A3A3] text-sm hover:text-white hover:underline transition-colors block">Alternativa a Edifito</a></li>
                <li><a href="#" className="text-[#A3A3A3] text-sm hover:text-white hover:underline transition-colors block">Alternativa a Kastor</a></li>
              </ul>
            </div>

            {/* Silo: Recursos */}
            <div>
              <h4 className="text-white text-sm font-medium mb-6">Herramientas Gratuitas</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-[#A3A3A3] text-sm hover:text-ediflow-primary transition-colors flex items-center gap-2 block"><span className="material-symbols-outlined text-[14px]">school</span> Simulador OS10</a></li>
                <li><a href="#" className="text-[#A3A3A3] text-sm hover:text-white transition-colors block">Checklist Ley 21.442</a></li>
                <li><a href="#" className="text-[#A3A3A3] text-sm hover:text-white transition-colors block">Blog y Casos de Uso</a></li>
              </ul>
            </div>
          </div>

          {/* Breadcrumbs (SEO Structural Requirement) */}
          <div className="border-t border-white/5 py-4 mb-4">
             <nav className="flex items-center text-[10px] text-gray-600 font-medium uppercase tracking-widest gap-2">
                 <a href="#" className="hover:text-ediflow-primary transition-colors">Inicio</a>
                 <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                 <a href="#" className="hover:text-ediflow-primary transition-colors">Software</a>
                 <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                 <span className="text-gray-400">EdiFlow SaaS</span>
             </nav>
          </div>

          {/* Copyright & Legal */}
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

export default LandingPage;
