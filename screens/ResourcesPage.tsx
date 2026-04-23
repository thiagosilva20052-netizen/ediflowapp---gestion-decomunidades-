import React, { useState, useEffect } from 'react';
import { Logo } from '../components/Logo';

interface Props {
  onLoginClick: () => void;
  onNavigate?: (screen: any) => void;
}

const ResourcesPage: React.FC<Props> = ({ onLoginClick, onNavigate }) => {
  const [scrollOpacity, setScrollOpacity] = useState(0);

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

  const scrollToOs10 = () => {
    const el = document.getElementById('os10-simulator');
    if (el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    }
  };

  const scrollToLibrary = () => {
    const el = document.getElementById('library');
    if (el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
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
              onClick={() => onNavigate && onNavigate('Landing')}
              className="group relative cursor-pointer flex items-center gap-1 text-sm font-medium text-[#A3A3A3] hover:text-white transition-colors"
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
              className="cursor-pointer text-sm font-medium text-white transition-colors"
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

      {/* 1. Hero Section: La Promesa de Valor */}
      <section className="pt-40 pb-20 px-6 lg:px-16 flex flex-col items-center justify-center text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-tight">
            Capacitación de élite para tu conserjería.<br/>
            <span className="font-serif italic text-white/60">Totalmente gratis.</span>
          </h1>
          <p className="text-base md:text-xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed mt-6">
            Herramientas, simuladores y guías legales diseñadas para proteger a tu comunidad de las multas de la Ley 21.442. Usa nuestros recursos hoy, mejora tu edificio mañana.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={scrollToOs10}
              className="w-full sm:w-auto bg-ediflow-primary text-black px-8 py-4 rounded-xl font-medium hover:bg-white transition-colors shadow-lg"
            >
              Ir al Simulador OS10
            </button>
            <button 
              onClick={scrollToLibrary}
              className="w-full sm:w-auto bg-transparent border border-white/10 text-white px-8 py-4 rounded-xl font-medium hover:bg-white/5 transition-colors"
            >
              Ver Biblioteca de Capacitación
            </button>
          </div>
        </div>
      </section>

      {/* 2. Módulo Principal: El Test OS10 */}
      <section id="os10-simulator" className="py-24 px-6 lg:px-16 border-t border-white/5 bg-black">
        <div className="max-w-6xl mx-auto bg-[#111] border border-gray-800 rounded-3xl p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-16 shadow-2xl relative overflow-hidden">
           
           {/* Left Copy */}
           <div className="flex-1 relative z-10 w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ediflow-primary/10 border border-ediflow-primary/20 text-ediflow-primary text-xs font-semibold uppercase tracking-widest mb-6">
                 <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ediflow-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-ediflow-primary"></span>
                 </span>
                 Lead Magnet Interactivo
              </div>
              <h2 className="text-3xl md:text-5xl font-light mb-6 tracking-tight leading-tight">
                ¿Pasaría tu equipo una fiscalización <i className="font-serif italic opacity-70">hoy</i>?
              </h2>
              <p className="text-base md:text-lg text-gray-400 font-light leading-relaxed mb-6">
                No dejes la seguridad de tu edificio al azar. Evalúa el conocimiento de tus conserjes con nuestro Simulador OS10 Oficial, basado en 50 preguntas reales de Carabineros de Chile.
              </p>
              
              <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4 flex items-start gap-4 mb-8">
                 <span className="material-symbols-outlined text-ediflow-primary mt-0.5">mark_email_read</span>
                 <p className="text-sm text-gray-400 font-light leading-relaxed">
                   <strong>Growth Tip (Activo):</strong> Responde las preguntas en el simulador adjunto. Al finalizar, recibirás la nota y el análisis de errores directamente en tu correo <span className="opacity-50">(Captura de Lead sin fricción)</span>.
                 </p>
              </div>
           </div>

           {/* Right: CTA to Public Simulator */}
           <div className="flex-1 w-full max-w-md lg:max-w-none relative z-10 flex items-center justify-center">
              {/* Subtle ambient glow behind */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-ediflow-primary/10 blur-[100px] pointer-events-none rounded-full"></div>
              
              <div className="bg-[#1A1A1A] border border-white/10 rounded-3xl p-8 md:p-12 text-center w-full shadow-2xl relative">
                  <div className="w-20 h-20 bg-ediflow-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-ediflow-primary text-4xl">local_police</span>
                  </div>
                  <h3 className="text-2xl font-medium text-white mb-4">Simulador Test OS10</h3>
                  <p className="text-gray-400 font-light mb-8 max-w-sm mx-auto">
                    El simulador oficial gratuito para preparar a tu conserjería en 10 minutos. Sin registros.
                  </p>
                  <button 
                    onClick={() => onNavigate && onNavigate('OS10Simulator')}
                    className="w-full bg-ediflow-primary hover:bg-white text-black px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(0,174,239,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                  >
                    Abrir Herramienta Gratuita
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">launch</span>
                  </button>
              </div>
           </div>
        </div>
      </section>

      {/* 3. Módulo de Capacitación: La Academia Ediflow */}
      <section id="library" className="py-24 px-6 lg:px-16 border-t border-white/5 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-4">
              Biblioteca de <i className="font-serif italic text-white/70">Cumplimiento</i>.
            </h2>
            <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto">
              Descarga manuales de emergencia, plantillas para asambleas de copropietarios y accede a mini-clases en video para profesionalizar a tu comité de administración.
            </p>
          </div>

          {/* Bento Grid layout for resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             
             {/* Card 1: Excel Template */}
             <div className="bg-[#111] border border-white/5 rounded-2xl p-8 flex flex-col hover:border-white/20 transition-all cursor-pointer group shadow-xl">
                <div className="w-16 h-16 rounded-xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center mb-6 relative overflow-hidden group-hover:scale-110 transition-transform duration-500">
                  <span className="material-symbols-outlined text-3xl text-green-400">table_view</span>
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-400/10 to-transparent pointer-events-none"></div>
                </div>
                <h3 className="text-lg font-medium text-white mb-2 group-hover:text-ediflow-primary transition-colors">Cálculo de Prorrateo 2026</h3>
                <p className="text-sm text-gray-400 font-light leading-relaxed flex-1">
                  Plantilla Excel automatizada para calcular cuotas de gastos comunes según la nueva normativa.
                </p>
                <div className="mt-8 pt-4 border-t border-white/5 flex items-center text-xs font-semibold text-gray-300 uppercase tracking-widest gap-2">
                   <span className="material-symbols-outlined text-[14px]">download</span> Descargar PDF
                </div>
             </div>

             {/* Card 2: Legal Guide */}
             <div className="bg-[#111] border border-white/5 rounded-2xl p-8 flex flex-col hover:border-white/20 transition-all cursor-pointer group shadow-xl">
                <div className="w-16 h-16 rounded-xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center mb-6 relative overflow-hidden group-hover:scale-110 transition-transform duration-500">
                  <span className="material-symbols-outlined text-3xl text-gray-200">shield_person</span>
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                </div>
                <h3 className="text-lg font-medium text-white mb-2 group-hover:text-ediflow-primary transition-colors">Guía: Ruidos Molestos</h3>
                <p className="text-sm text-gray-400 font-light leading-relaxed flex-1">
                  Protocolo de acción paso a paso para el comité de administración y conserjería ante denuncias.
                </p>
                <div className="mt-8 pt-4 border-t border-white/5 flex items-center text-xs font-semibold text-gray-300 uppercase tracking-widest gap-2">
                   <span className="material-symbols-outlined text-[14px]">menu_book</span> Leer Artículo
                </div>
             </div>

             {/* Card 3: Video Course */}
             <div className="bg-[#111] border border-white/5 rounded-2xl p-8 flex flex-col hover:border-white/20 transition-all cursor-pointer group shadow-xl">
                <div className="w-16 h-16 rounded-xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center mb-6 relative overflow-hidden group-hover:scale-110 transition-transform duration-500">
                  <span className="material-symbols-outlined text-3xl text-ediflow-primary">play_circle</span>
                  <div className="absolute inset-0 bg-gradient-to-tr from-ediflow-primary/20 to-transparent pointer-events-none"></div>
                </div>
                <h3 className="text-lg font-medium text-white mb-2 group-hover:text-ediflow-primary transition-colors">Registro de Encomiendas</h3>
                <p className="text-sm text-gray-400 font-light leading-relaxed flex-1">
                  Mini-clase en video: Cómo registrar y entregar paquetes sin perder el control del inventario.
                </p>
                <div className="mt-8 pt-4 border-t border-white/5 flex items-center text-xs font-semibold text-gray-300 uppercase tracking-widest gap-2">
                   <span className="material-symbols-outlined text-[14px]">smart_display</span> Ver Video
                </div>
             </div>

          </div>
        </div>
      </section>

      {/* 4. Footer Interactivo (Upsell) */}
      <section className="bg-black py-24 px-6 lg:px-16 border-t border-white/5 text-center relative z-20">
         <div className="max-w-3xl mx-auto flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6 leading-tight">
               Si nuestras herramientas gratuitas te ahorran tiempo, imagina tener a nuestra IA trabajando para ti <span className="font-medium">24/7</span>.
            </h2>
            <p className="text-base md:text-lg text-gray-400 font-light mb-10 leading-relaxed">
               Ediflow automatiza todo esto y más: desde el escaneo de facturas hasta la recaudación con Khipu. Deja las herramientas aisladas y pasa al sistema operativo definitivo.
            </p>
            <button 
              onClick={() => onNavigate && onNavigate('BookDemo')}
              className="bg-white text-black px-8 py-4 rounded-xl font-medium hover:bg-gray-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3 text-sm group"
            >
              Agendar Demo del Software
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
         </div>
      </section>

      {/* Footer Nav */}
      <footer className="bg-[#050505] pt-16 pb-10 border-t border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="border-t border-white/5 py-4 mb-4">
             <nav className="flex items-center text-[10px] text-gray-600 font-medium uppercase tracking-widest gap-2">
                 <span onClick={() => onNavigate && onNavigate('Landing')} className="hover:text-ediflow-primary transition-colors cursor-pointer">Inicio</span>
                 <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                 <span className="text-gray-400">Recursos</span>
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

export default ResourcesPage;
