import React, { useState, useEffect } from 'react';
import { Logo } from '../components/Logo';

interface Props {
  onLoginClick: () => void;
  onNavigate?: (screen: any) => void;
}

const TermsPage: React.FC<Props> = ({ onLoginClick, onNavigate }) => {
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const [activeSection, setActiveSection] = useState('onboarding');

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const newOpacity = Math.min(currentScroll / 500, 0.9);
      setScrollOpacity(newOpacity);

      const sections = ['onboarding', 'planes', 'propiedad', 'responsabilidad'];
      let current = sections[0];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 200) {
          current = section;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 120, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#0A0A0A] text-white font-sans selection:bg-white/20 selection:text-white min-h-screen flex flex-col">
      {/* Sticky Navigation Bar */}
      <header className={`fixed top-0 inset-x-0 w-full z-50 transition-all duration-500 ease-in-out ${scrollOpacity > 0.05 ? 'bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105" onClick={() => onNavigate && onNavigate('Landing')}>
            <Logo variant="horizontal" color="#FFFFFF" className="scale-[0.8] origin-left" />
          </div>

          <nav className="hidden lg:flex items-center gap-10">
            <div onClick={() => onNavigate && onNavigate('Landing')} className="cursor-pointer text-sm font-medium text-[#A3A3A3] hover:text-white transition-colors">Inicio</div>
            <div onClick={() => onNavigate && onNavigate('Solutions')} className="group relative cursor-pointer flex items-center gap-1 text-sm font-medium text-[#A3A3A3] hover:text-white transition-colors">
              Soluciones <span className="material-symbols-outlined text-[14px] group-hover:rotate-180 transition-transform">expand_more</span>
            </div>
            <div onClick={() => onNavigate && onNavigate('Resources')} className="cursor-pointer text-sm font-medium text-[#A3A3A3] hover:text-white transition-colors">Recursos</div>
            <div onClick={() => onNavigate && onNavigate('Pricing')} className="cursor-pointer text-sm font-medium text-[#A3A3A3] hover:text-white transition-colors">Precios</div>
            <div className="cursor-pointer text-sm font-medium text-white transition-colors flex items-center gap-1 border-b border-ediflow-primary/50 pb-0.5">
               Términos <span className="material-symbols-outlined text-[14px] text-ediflow-primary">gavel</span>
            </div>
          </nav>

          <div className="flex items-center gap-6">
            <button onClick={onLoginClick} className="hidden md:block text-sm font-medium text-[#A3A3A3] hover:text-white transition-colors">Iniciar Sesión</button>
            <button onClick={() => onNavigate && onNavigate('BookDemo')} className="bg-ediflow-primary text-black px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-white transition-all shadow-[0_0_15px_rgba(0,174,239,0.15)] hover:shadow-[0_0_25px_rgba(0,174,239,0.3)]">
              Agendar Demo
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-16 pt-32 pb-24 flex flex-col md:flex-row gap-12 lg:gap-24 relative">
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-ediflow-primary/5 blur-[150px] rounded-[100%] pointer-events-none z-0"></div>

        {/* Sticky Sidebar */}
        <aside className="hidden md:block w-64 shrink-0 relative z-10">
           <div className="sticky top-32">
              <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-500 mb-6">Condiciones de Servicio</h4>
              <nav className="flex flex-col gap-1">
                 <button onClick={() => scrollToSection('onboarding')} className={`text-left text-sm py-2 px-4 transition-all border-l ${activeSection === 'onboarding' ? 'text-white border-ediflow-primary font-medium bg-gradient-to-r from-ediflow-primary/5 to-transparent' : 'text-gray-500 border-white/5 hover:text-gray-300 hover:border-white/20'}`}>
                    1. Implementación y Carga
                 </button>
                 <button onClick={() => scrollToSection('planes')} className={`text-left text-sm py-2 px-4 transition-all border-l ${activeSection === 'planes' ? 'text-white border-ediflow-primary font-medium bg-gradient-to-r from-ediflow-primary/5 to-transparent' : 'text-gray-500 border-white/5 hover:text-gray-300 hover:border-white/20'}`}>
                    2. Planes y Contratos
                 </button>
                 <button onClick={() => scrollToSection('propiedad')} className={`text-left text-sm py-2 px-4 transition-all border-l ${activeSection === 'propiedad' ? 'text-white border-ediflow-primary font-medium bg-gradient-to-r from-ediflow-primary/5 to-transparent' : 'text-gray-500 border-white/5 hover:text-gray-300 hover:border-white/20'}`}>
                    3. Propiedad de Datos
                 </button>
                 <button onClick={() => scrollToSection('responsabilidad')} className={`text-left text-sm py-2 px-4 transition-all border-l ${activeSection === 'responsabilidad' ? 'text-white border-ediflow-primary font-medium bg-gradient-to-r from-ediflow-primary/5 to-transparent' : 'text-gray-500 border-white/5 hover:text-gray-300 hover:border-white/20'}`}>
                    4. Limitación de Responsabilidad
                 </button>
              </nav>
           </div>
        </aside>

        {/* Central Narrow Column */}
        <article className="flex-1 max-w-[65ch] text-[#A3A3A3] font-light leading-relaxed space-y-12 relative z-10">
           <header className="mb-16">
              <div className="mb-8 w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center transform rotate-3 shadow-xl">
                 <span className="material-symbols-outlined text-ediflow-primary/80 text-3xl">contract</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-light text-white tracking-tight leading-tight mb-6">
                 Términos de Servicio. <br/>
                 <span className="font-serif italic font-normal text-white">Reglas claras, alianzas duraderas.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light">
                 Estos son los lineamientos que protegen a tu comunidad y garantizan la continuidad operativa de la infraestructura de Ediflow.
              </p>
           </header>

           <div className="space-y-16">
              <section id="onboarding" className="scroll-mt-32">
                 <h2 className="text-2xl font-serif italic font-medium text-white mb-6 border-b border-white/10 pb-4">1. Implementación y Carga de Datos</h2>
                 <p className="mb-4">
                    Ediflow es una plataforma de software como servicio (SaaS) diseñada para ser autogestionada (Self-Service). El administrador es el único responsable de la exactitud al cargar unidades, residentes y saldos iniciales.
                 </p>
                 <ul className="space-y-4 ml-2 mt-6">
                    <li className="flex items-start gap-4">
                       <span className="material-symbols-outlined text-[16px] text-ediflow-primary mt-1">support_agent</span>
                       <div>
                          <strong className="text-white font-medium block mb-1">Servicio de Migración Asistida (Done-For-You):</strong>
                          <p>Si el comité de administración requiere que nuestro equipo realice la migración, digitalización y configuración inicial, este servicio se cotizará como un "Fee de Implementación" independiente. Sus montos y plazos se detallarán explícitamente en la propuesta comercial adjunta al onboarding.</p>
                       </div>
                    </li>
                 </ul>
              </section>

              <section id="planes" className="scroll-mt-32">
                 <h2 className="text-2xl font-serif italic font-medium text-white mb-6 border-b border-white/10 pb-4">2. Planes, Contratos y Oferta Anual</h2>
                 <p className="mb-4">
                    Para garantizar la estabilidad financiera y el aprovisionamiento de recursos de Inteligencia Artificial (motores OCR deductivos y asistentes conversacionales en conserjería), nuestros planes operan bajo esquemas estrictos de suscripción pre-pagada.
                 </p>
                 <ul className="list-disc pl-5 space-y-3 mt-4 text-sm text-gray-400">
                    <li>Al optar por el <strong className="text-gray-200 font-medium">Plan Anual</strong> (que incluye beneficios promocionales destacados en nuestro tarifario), el cliente se compromete a un periodo de facturación de 12 meses ininterrumpidos.</li>
                    <li>Ediflow no emitirá reembolsos parciales o totales por cancelaciones anticipadas, cese de operaciones de la administración en dicho edificio, o meses no utilizados dentro de un ciclo anual previamente facturado.</li>
                 </ul>
              </section>

              <section id="propiedad" className="scroll-mt-32">
                 <h2 className="text-2xl font-serif italic font-medium text-white mb-6 border-b border-white/10 pb-4">3. Propiedad de la Información y Proceso de Baja</h2>
                 <p className="mb-4 text-white font-medium">
                    Toda la información operativa (gastos, residentes, novedades y bitácoras) pertenece irrenunciablemente a la comunidad de copropietarios.
                 </p>
                 <p className="mb-4">Nuestro compromiso fundamental es el principio SaaS de *"fácil entrar, fácil salir"*, sin secuestrar ni retener operaciones de nuestros clientes.</p>
                 
                 <div className="bg-[#111] border border-ediflow-primary/20 p-6 rounded-xl mt-6">
                    <h3 className="text-ediflow-primary text-sm uppercase tracking-widest font-semibold mb-3">Retiro de Datos y Offboarding Automático</h3>
                    <p className="text-sm text-gray-300 leading-relaxed mb-4">
                       En caso de cancelación definitiva del servicio, la administración tiene un periodo de gracia de <strong>30 días corridos</strong> para solicitar un respaldo integral de su base de datos mediando el panel de control o contactando a `soporte@ediflow.cl`.
                    </p>
                    <p className="text-sm text-gray-300 leading-relaxed">
                       Ediflow consolidará y entregará esta información en un formato estándar de la industria tabular (CSV/Excel) en un plazo no mayor a 30 días hábiles tras la validación de la solicitud. Expirado este plazo, los registros expiran y se purgarán permanentemente de nuestros servidores (Supabase) garantizando el cumplimiento íntegro de la Ley 19.628 de Protección de Datos.
                    </p>
                 </div>
              </section>

              <section id="responsabilidad" className="scroll-mt-32">
                 <div className="bg-[#111] border border-white/10 p-8 rounded-2xl">
                    <h2 className="text-2xl font-serif italic font-medium text-white mb-6 border-b border-white/10 pb-4">4. Limitación de Responsabilidad y (SLA)</h2>
                    <p className="mb-4 text-sm leading-relaxed text-gray-300">
                       La plataforma tecnológica Ediflow y sus integraciones logísticas y financieras se entregan en modalidad "tal cual" (<strong>As Is</strong>). Nos esforzamos continuamente bajo altos estándares de ingeniería para mantener un 99.9% de disponibilidad operativa de la plataforma principal.
                    </p>
                    <p className="mb-4 text-sm leading-relaxed text-gray-300">
                       Sin embargo, Ediflow SpA <strong>no se hace responsable</strong> civil o penalmente por daños indirectos, pérdida de recaudación, negligencia en la recopilación impositiva o sanciones aplicadas por terceros (incluyendo multas fiscalizadoras derivadas de la Ley 21.442) originadas por omisiones, errores de digitación de los usuarios, o caídas exógenas de proveedores externos y pasarelas de pago (Khipu, MercadoPago o retrasos en latencia de proveedores LLM).
                    </p>
                    <div className="mt-6 pt-6 border-t border-white/10">
                       <p className="text-xs text-gray-500 uppercase tracking-widest leading-relaxed">
                          Cláusula Limitativa: La responsabilidad monetaria máxima exigible a Ediflow, bajo cualquier causal o perjuicio comprobable, estará circunscrita y estrictamente limitada al total de los montos de suscripción efectivamente pagados por el cliente durante los últimos doce (12) meses previos a la notificación del incidente.
                       </p>
                    </div>
                 </div>
              </section>
           </div>
        </article>
      </main>

      {/* Footer Nav */}
      <footer className="bg-[#050505] pt-16 pb-10 border-t border-white/5 relative z-20 mt-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="border-t border-white/5 py-4 mb-4">
             <nav className="flex items-center text-[10px] text-gray-600 font-medium uppercase tracking-widest gap-2">
                 <span onClick={() => onNavigate && onNavigate('Landing')} className="hover:text-ediflow-primary transition-colors cursor-pointer">Inicio</span>
                 <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                 <span className="text-gray-400">Términos</span>
             </nav>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-gray-600 tracking-widest uppercase font-semibold">
              &copy; {new Date().getFullYear()} Ediflow. Gestión Inteligente de Comunidades.
            </p>
            <div className="flex gap-6">
              <span onClick={() => onNavigate && onNavigate('Privacy')} className="text-[10px] text-gray-500 hover:text-white uppercase tracking-widest transition-colors font-semibold cursor-pointer">Privacidad</span>
              <span className="text-[10px] text-white uppercase tracking-widest transition-colors font-semibold border-b border-white pb-0.5">Términos</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsPage;
