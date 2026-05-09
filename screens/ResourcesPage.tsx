import React, { useState, useEffect } from 'react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';
import { Volume2, ArrowRight, FileSpreadsheet, CheckSquare } from 'lucide-react';

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
    <div className="bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white font-sans selection:bg-ediflow-primary/10 selection:text-gray-900 min-h-screen transition-colors duration-300">
      {/* Sticky Navigation Bar */}
      <header className={`fixed top-0 inset-x-0 w-full z-50 transition-all duration-500 ease-in-out ${scrollOpacity > 0.05 ? 'bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105" onClick={() => onNavigate && onNavigate('Landing')}>
            <Logo variant="horizontal" color="currentColor" className="scale-[0.8] origin-left" />
          </div>

          <nav className="hidden lg:flex items-center gap-10">
            <div 
              onClick={() => onNavigate && onNavigate('Landing')}
              className="group relative cursor-pointer flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
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
              className="cursor-pointer text-sm font-bold text-gray-900 dark:text-white transition-colors"
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

      {/* 1. Hero Section: La Promesa de Valor */}
      <section className="pt-40 pb-20 px-6 lg:px-16 flex flex-col items-center justify-center text-center relative z-10">
        <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-900/10 blur-3xl pointer-events-none"></div>
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-gray-900 dark:text-white leading-none">
            Capacitación de élite para tu conserjería.<br/>
            <span className="font-serif italic font-normal text-ediflow-primary block mt-2">Totalmente gratis.</span>
          </h1>
          <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 font-light max-w-3xl mx-auto leading-relaxed mt-8">
            Herramientas, simuladores y guías legales diseñadas para proteger a tu comunidad de las multas de la Ley 21.442. Usa nuestros recursos hoy, mejora tu edificio mañana.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={scrollToOs10}
              className="w-full sm:w-auto bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-ediflow-primary transition-colors shadow-xl active:scale-95 text-sm"
            >
              Ir al Simulador OS10
            </button>
            <button 
              onClick={scrollToLibrary}
              className="w-full sm:w-auto bg-white dark:bg-white/5 dark:text-white border border-gray-100 dark:border-white/10 text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shadow-sm text-sm"
            >
              Ver Biblioteca de Capacitación
            </button>
          </div>
        </div>
      </section>

      {/* 2. Módulo Principal: El Test OS10 */}
      <section id="os10-simulator" className="py-24 px-6 lg:px-16 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#0D0D0D]">
        <div className="max-w-6xl mx-auto bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 rounded-[3rem] p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-16 shadow-2xl relative overflow-hidden text-gray-900 dark:text-white">
           
           {/* Left Copy */}
           <div className="flex-1 relative z-10 w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                 <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                 </span>
                 Lead Magnet Interactivo
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-[1.1]">
                ¿Pasaría tu equipo una fiscalización <i className="font-serif italic font-normal text-ediflow-primary">hoy</i>?
              </h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-8">
                No dejes la seguridad de tu edificio al azar. Evalúa el conocimiento de tus conserjes con nuestro Simulador OS10 Oficial, basado en 50 preguntas reales de Carabineros de Chile.
              </p>
              
              <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-6 flex items-start gap-4 mb-8 shadow-inner text-gray-900 dark:text-white">
                 <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 mt-0.5">verified_user</span>
                 <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    <strong>Growth Tip (Activo):</strong> Al finalizar el simulador, el sistema genera automáticamente un reporte de áreas de mejora que puedes compartir con tu comité de administración.
                 </p>
              </div>
           </div>

           {/* Right: CTA to Public Simulator */}
           <div className="flex-1 w-full max-w-md lg:max-w-none relative z-10 flex items-center justify-center">
              {/* Subtle ambient glow behind */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50 dark:bg-blue-900/10 blur-[100px] pointer-events-none rounded-full opacity-50"></div>
              
              <div className="bg-white dark:bg-[#151515] border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 text-center w-full shadow-2xl relative">
                  <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-blue-100 dark:border-blue-800/30 rotate-3 group-hover:rotate-0 transition-transform">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-5xl">local_police</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Simulador Test OS10</h3>
                  <p className="text-gray-500 dark:text-gray-400 font-medium mb-10 max-w-sm mx-auto leading-relaxed">
                    El simulador oficial gratuito para preparar a tu conserjería en 10 minutos. Libre acceso.
                  </p>
                  <button 
                    onClick={() => onNavigate && onNavigate('OS10Simulator')}
                    className="w-full bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-ediflow-primary dark:hover:bg-ediflow-primary dark:hover:text-white text-white px-8 py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 group shadow-xl active:scale-95"
                  >
                    Abrir Herramienta Gratuita
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">launch</span>
                  </button>
              </div>
           </div>
        </div>
      </section>

      {/* 3. Módulo de Capacitación: La Academia Ediflow */}
      <section id="library" className="py-24 px-6 lg:px-16 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6 text-gray-900 dark:text-white">
              Biblioteca de <i className="font-serif italic font-normal text-ediflow-primary underline decoration-blue-100 dark:decoration-blue-900 underline-offset-8">Cumplimiento</i>.
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
              Descarga manuales de emergencia, plantillas para asambleas de copropietarios y accede a mini-clases para profesionalizar tu comité.
            </p>
          </div>

          {/* Bento Grid layout for resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             
             {/* Card 1: Excel Template */}
             <div 
               onClick={() => onNavigate && onNavigate('ProrrationTemplate')}
               className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2rem] p-10 flex flex-col hover:bg-white dark:hover:bg-white/10 hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 dark:bg-green-900/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  <FileSpreadsheet className="text-3xl text-green-500 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">Plantilla: Cálculo de Prorrateo</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed flex-1">
                  Descarga nuestra herramienta maestra en Excel para automatizar la división de gastos comunes por unidad.
                </p>
                <div className="mt-10 pt-6 border-t border-gray-100 dark:border-white/10 flex items-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest gap-2 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                   <ArrowRight className="w-4 h-4" /> Ir a Descarga
                </div>
             </div>

             {/* Card 4: Checklist Ley 21.442 */}
             <div 
               onClick={() => onNavigate && onNavigate('ChecklistLey')}
               className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2rem] p-10 flex flex-col hover:bg-white dark:hover:bg-white/10 hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  <CheckSquare className="text-3xl text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">Checklist: Ley 21.442</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed flex-1">
                  Audita tu condominio en 5 minutos. Identifica brechas legales y evita multas con nuestro checklist oficial.
                </p>
                <div className="mt-10 pt-6 border-t border-gray-100 dark:border-white/10 flex items-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest gap-2 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                   <ArrowRight className="w-4 h-4" /> Realizar Auditoría
                </div>
             </div>

             {/* Card 2: Legal Guide */}
             <div 
               onClick={() => onNavigate && onNavigate('NoiseGuide')}
               className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2rem] p-10 flex flex-col hover:bg-white dark:hover:bg-white/10 hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  <Volume2 className="text-3xl text-gray-700 dark:text-gray-300" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">Guía: Ruidos Molestos</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed flex-1">
                  Protocolo de acción paso a paso para el comité de administración y conserjería ante denuncias.
                </p>
                <div className="mt-10 pt-6 border-t border-gray-100 dark:border-white/10 flex items-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest gap-2 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                   <ArrowRight className="w-4 h-4" /> Leer Protocolo
                </div>
             </div>

             {/* Card 3: Video Course */}
             <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2rem] p-10 flex flex-col hover:bg-white dark:hover:bg-white/10 hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl text-blue-600 dark:text-blue-400">play_circle</span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">Registro de Encomiendas</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed flex-1">
                  Mini-clase en video: Cómo registrar y entregar paquetes sin perder el control del inventario.
                </p>
                <div className="mt-10 pt-6 border-t border-gray-100 dark:border-white/10 flex items-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest gap-2 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                   <span className="material-symbols-outlined text-[16px]">smart_display</span> Ver Video
                </div>
             </div>

          </div>
        </div>
      </section>

      {/* 4. Footer Interactivo (Upsell) */}
      <section className="bg-gray-900 py-32 px-6 lg:px-16 text-center relative z-20 overflow-hidden text-white">
         <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/5 blur-[150px] pointer-events-none"></div>
         <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-8 leading-tight">
               Si nuestras herramientas gratuitas te ahorran tiempo, imagina tener a nuestra IA trabajando para ti <span className="text-ediflow-primary">24/7</span>.
            </h2>
            <p className="text-base md:text-xl text-gray-400 dark:text-gray-500 font-light mb-12 leading-relaxed max-w-2xl">
               Ediflow automatiza todo esto y más: desde el escaneo de facturas hasta la recaudación con Khipu. Deja las herramientas aisladas y pasa al sistema operativo definitivo.
            </p>
            <button 
              onClick={() => onNavigate && onNavigate('BookDemo')}
              className="bg-white text-gray-900 px-10 py-5 rounded-2xl font-bold hover:bg-ediflow-primary hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3 group active:scale-95"
            >
              Agendar Demo del Software
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
         </div>
      </section>

      {/* Footer Nav */}
      <footer className="bg-gray-50 dark:bg-[#050505] pt-20 pb-12 border-t border-gray-200 dark:border-white/5 relative z-20 text-gray-900 dark:text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="border-t border-gray-200 dark:border-white/5 py-4 mb-4">
             <nav className="flex items-center text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.2em] gap-2">
                 <span onClick={() => onNavigate && onNavigate('Landing')} className="hover:text-ediflow-primary transition-colors cursor-pointer">Inicio</span>
                 <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                 <span className="text-gray-900 dark:text-white">Recursos</span>
             </nav>
          </div>
          <div className="border-t border-gray-200 dark:border-white/5 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <p className="text-[10px] text-gray-400 dark:text-gray-500 tracking-[0.2em] uppercase font-bold">
              &copy; {new Date().getFullYear()} Ediflow. Todos los derechos reservados.
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
}

export default ResourcesPage;
