import React, { useState, useEffect } from 'react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';

interface Props {
  onLoginClick: () => void;
  onNavigate?: (screen: any) => void;
}

const PrivacyPage: React.FC<Props> = ({ onLoginClick, onNavigate }) => {
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const [activeSection, setActiveSection] = useState('datos');

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const newOpacity = Math.min(currentScroll / 500, 0.9);
      setScrollOpacity(newOpacity);

      // Simple scrollspy logic
      const sections = ['datos', 'ia', 'infraestructura', 'ley-chile'];
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
    <div className="bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white font-sans selection:bg-ediflow-primary/10 selection:text-gray-900 min-h-screen flex flex-col transition-colors duration-300">
      {/* Sticky Navigation Bar */}
      <header className={`fixed top-0 inset-x-0 w-full z-50 transition-all duration-500 ease-in-out ${scrollOpacity > 0.05 ? 'bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105" onClick={() => onNavigate && onNavigate('Landing')}>
            <Logo variant="horizontal" color="currentColor" className="scale-[0.8] origin-left" />
          </div>

          <nav className="hidden lg:flex items-center gap-10">
            <div 
              onClick={() => onNavigate && onNavigate('Landing')}
              className="cursor-pointer text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
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
              onClick={() => onNavigate && onNavigate('Pricing')}
              className="cursor-pointer text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Precios
            </div>
            <div 
               className="cursor-pointer text-sm font-medium text-gray-900 dark:text-white transition-colors flex items-center gap-1 border-b border-ediflow-primary/50 pb-0.5"
            >
               Trust Center <span className="material-symbols-outlined text-[14px] text-ediflow-primary">verified_user</span>
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
              className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-ediflow-primary dark:hover:bg-ediflow-primary dark:hover:text-white transition-all shadow-xl active:scale-95"
            >
              Agendar Demo
            </button>
          </div>
        </div>
      </header>

      {/* Main Content: Document Reader Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-16 pt-32 pb-24 flex flex-col md:flex-row gap-12 lg:gap-24 relative">
        
        {/* Subdued Glow Background */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-blue-50 dark:bg-blue-900/10 blur-[150px] rounded-[100%] pointer-events-none z-0"></div>

        {/* Sticky Sidebar (Table of Contents) */}
        <aside className="hidden md:block w-64 shrink-0 relative z-10">
           <div className="sticky top-32">
              <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400 dark:text-gray-500 mb-6">Contenido Legal</h4>
              <nav className="flex flex-col gap-1">
                 <button 
                    onClick={() => scrollToSection('datos')}
                    className={`text-left text-sm py-2 px-4 transition-all border-l ${activeSection === 'datos' ? 'text-gray-900 dark:text-white border-ediflow-primary font-bold bg-blue-50/50 dark:bg-blue-900/10' : 'text-gray-500 border-gray-100 dark:border-white/5 hover:text-gray-900 dark:hover:text-white hover:border-gray-200 dark:hover:border-white/10'}`}
                 >
                    ¿Qué datos procesamos?
                 </button>
                 <button 
                    onClick={() => scrollToSection('ia')}
                    className={`text-left text-sm py-2 px-4 transition-all border-l ${activeSection === 'ia' ? 'text-gray-900 dark:text-white border-ediflow-primary font-bold bg-blue-50/50 dark:bg-blue-900/10' : 'text-gray-500 border-gray-100 dark:border-white/5 hover:text-gray-900 dark:hover:text-white hover:border-gray-200 dark:hover:border-white/10'}`}
                 >
                    El uso de Inteligencia Artificial
                 </button>
                 <button 
                    onClick={() => scrollToSection('infraestructura')}
                    className={`text-left text-sm py-2 px-4 transition-all border-l ${activeSection === 'infraestructura' ? 'text-gray-900 dark:text-white border-ediflow-primary font-bold bg-blue-50/50 dark:bg-blue-900/10' : 'text-gray-500 border-gray-100 dark:border-white/5 hover:text-gray-900 dark:hover:text-white hover:border-gray-200 dark:hover:border-white/10'}`}
                 >
                    Infraestructura y Seguridad
                 </button>
                 <button 
                    onClick={() => scrollToSection('ley-chile')}
                    className={`text-left text-sm py-2 px-4 transition-all border-l ${activeSection === 'ley-chile' ? 'text-gray-900 dark:text-white border-ediflow-primary font-bold bg-blue-50/50 dark:bg-blue-900/10' : 'text-gray-500 border-gray-100 dark:border-white/5 hover:text-gray-900 dark:hover:text-white hover:border-gray-200 dark:hover:border-white/10'}`}
                 >
                    Cumplimiento Ley N° 19.628 (Chile)
                 </button>
              </nav>

              <div className="mt-12 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-5 shadow-sm">
                 <div className="flex items-center gap-3 mb-3">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg">shield</span>
                    <span className="text-gray-900 dark:text-white text-sm font-bold tracking-tight">Trust Center Ediflow</span>
                 </div>
                 <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-4">
                    Tu información es procesada en servidores encriptados, cumpliendo estrictamente con la normativa chilena.
                 </p>
              </div>
           </div>
        </aside>

        {/* Central Narrow Reading Column */}
        <article className="flex-1 max-w-[65ch] text-gray-600 dark:text-gray-400 font-light leading-relaxed space-y-12 relative z-10">
           
           <header className="mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight mb-6">
                 Privacidad por diseño. <br/>
                 <span className="font-serif italic font-normal text-ediflow-primary underline decoration-blue-100 dark:decoration-blue-900 underline-offset-8">Tus datos, blindados.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                 En Ediflow entendemos que la información de tu comunidad es crítica. No vendemos tus datos, no entrenamos modelos públicos con ellos y aplicamos seguridad de nivel bancario.
              </p>
           </header>

           <div className="space-y-16">
              
              <section id="datos" className="scroll-mt-32">
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-white/10 pb-4 tracking-tight">1. ¿Qué datos procesamos?</h2>
                 <p className="mb-4">Para que nuestra Inteligencia Artificial automatice tu edificio de forma precisa y eficiente, procesamos las siguientes categorías de datos estrictamente necesarios:</p>
                 <ul className="space-y-4 ml-2">
                    <li className="flex items-start gap-4">
                       <span className="material-symbols-outlined text-[16px] text-blue-600 dark:text-blue-400 mt-1">analytics</span>
                       <div>
                          <strong className="text-gray-900 dark:text-white font-bold block mb-1 tracking-tight">Datos operativos:</strong>
                          <p>Imágenes de facturas y etiquetas de paquetería (procesadas por nuestro motor OCR), transcripciones efímeras de voz de la conserjería y datos de contacto de residentes necesarios para notificaciones.</p>
                       </div>
                    </li>
                    <li className="flex items-start gap-4">
                       <span className="material-symbols-outlined text-[16px] text-blue-600 dark:text-blue-400 mt-1">account_balance</span>
                       <div>
                          <strong className="text-gray-900 dark:text-white font-bold block mb-1 tracking-tight">Datos financieros:</strong>
                          <p><strong>Ediflow NO almacena de forma parcial ni total tarjetas de crédito, débito o credenciales bancarias.</strong> Toda transacción económica es encriptada y delegada nativamente a nuestros partners certificados (Khipu y MercadoPago), cumpliendo con el estándar PCI-DSS.</p>
                       </div>
                    </li>
                 </ul>
              </section>

              <section id="ia" className="scroll-mt-32">
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-white/10 pb-4 tracking-tight">2. El uso de la Inteligencia Artificial</h2>
                 <p className="mb-4 text-gray-600 dark:text-gray-400">
                    Ediflow utiliza Modelos de Lenguaje Grande (LLMs) y sistemas de Visión Computacional de última generación para extraer datos de gastos comunes, resumir bitácoras y redactar comunicados formales.
                 </p>
                 <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-6 rounded-2xl mt-6 relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 dark:bg-blue-400"></div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">
                       La información de tu edificio se utiliza <strong className="text-gray-900 dark:text-white">estrictamente de forma efímera</strong> para completar la tarea operativa en curso. Esta información <strong className="text-gray-900 dark:text-white font-bold">NUNCA</strong> se almacena a largo plazo en memoria de IA, ni se comparte con proveedores subyacentes para entrenar modelos públicos de terceros.
                    </p>
                 </div>
              </section>

              <section id="infraestructura" className="scroll-mt-32">
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-white/10 pb-4 tracking-tight">3. Infraestructura y Seguridad</h2>
                 <p className="mb-4 text-gray-600 dark:text-gray-400">
                    Toda la información operativa (perfiles de residentes, registro de paquetería, libro de novedades digital) se aloja en infraestructuras altamente seguras (Supabase/Google Cloud) bajo protocolos estrictos.
                 </p>
                 <ul className="list-disc pl-5 space-y-2 mt-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    <li className="dark:text-gray-400">Bases de datos aisladas y cifradas en tránsito (TLS 1.2+) y en reposo (AES-256).</li>
                    <li className="dark:text-gray-400">Sistemas de autenticación robustos para cada nivel de usuario (Administrador, Conserje, Residente).</li>
                    <li className="dark:text-gray-400">Políticas de seguridad Row Level Security (RLS) que garantizan que una comunidad no pueda acceder bajo ningún escenario a los datos de otra.</li>
                 </ul>
              </section>

              <section id="ley-chile" className="scroll-mt-32 pt-8">
                 <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/20 p-8 rounded-3xl relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/20 dark:bg-blue-400/5 rounded-full blur-2xl"></div>
                    
                    <div className="flex items-center gap-4 mb-6">
                       <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-3xl">gavel</span>
                       <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Resguardo de Datos (Ley Chilena)</h2>
                    </div>

                    <p className="mb-6 text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                       En estricto cumplimiento de la <strong>Ley N° 19.628 sobre Protección de la Vida Privada en Chile</strong>, Ediflow garantiza a todos los usuarios de nuestra plataforma el ejercicio pleno de sus <strong>Derechos ARCO</strong> (Acceso, Rectificación, Cancelación y Oposición).
                    </p>

                    <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                       <li className="flex items-start gap-3">
                          <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                          <span className="dark:text-gray-400">Todo residente o usuario tiene el derecho irrenunciable a solicitar una copia de los datos que almacenamos sobre su unidad, corregirlos si son inexactos, o exigir su eliminación total de nuestros registros operativos.</span>
                       </li>
                       <li className="flex items-start gap-3">
                          <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                          <span className="dark:text-gray-400">La recolección de datos se realiza con el <strong>fin exclusivo de mantener la seguridad operativa y de acceso</strong> al condominio, no siendo utilizados jamás para perfilamiento comercial.</span>
                       </li>
                    </ul>
                 </div>
              </section>

           </div>

           {/* DPO Contact CTA */}
           <div className="mt-24 pt-12 border-t border-gray-100 dark:border-white/5 text-center px-4">
              <h3 className="text-xl text-gray-900 dark:text-white font-bold tracking-tight mb-4 leading-tight">¿Tienes dudas sobre cómo protegemos los datos de tu comunidad?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-8 max-w-md mx-auto leading-relaxed">
                 Nuestro Data Protection Officer (DPO) está disponible para responder cualquier inquietud legal o de cumplimiento de tu comité.
              </p>
              <a 
                 href="mailto:privacidad@ediflow.cl"
                 className="inline-flex items-center justify-center gap-3 bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-ediflow-primary dark:hover:bg-ediflow-primary dark:hover:text-white transition-all shadow-lg active:scale-95"
              >
                 Contactar al Equipo de Privacidad
                 <span className="material-symbols-outlined text-[16px]">mail</span>
              </a>
           </div>

        </article>
      </main>

      {/* Footer Nav */}
      <footer className="bg-gray-50 dark:bg-[#050505] pt-16 pb-10 border-t border-gray-200 dark:border-white/5 relative z-20 mt-auto text-gray-900 dark:text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="border-t border-gray-200 dark:border-white/5 py-4 mb-4">
             <nav className="flex items-center text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.2em] gap-2">
                 <span onClick={() => onNavigate && onNavigate('Landing')} className="hover:text-ediflow-primary transition-colors cursor-pointer">Inicio</span>
                 <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                 <span className="text-gray-900 dark:text-white">Privacidad</span>
             </nav>
          </div>
          <div className="border-t border-gray-200 dark:border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-gray-400 dark:text-gray-500 tracking-[0.2em] uppercase font-bold">
              &copy; {new Date().getFullYear()} Ediflow. Gestión Inteligente de Comunidades.
            </p>
            <div className="flex gap-6">
              <span className="text-[10px] text-gray-900 dark:text-white uppercase tracking-widest transition-colors font-bold border-b border-gray-900 dark:border-white pb-0.5">Privacidad</span>
              <span onClick={() => onNavigate && onNavigate('Terms')} className="text-[10px] text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white uppercase tracking-widest transition-colors font-bold cursor-pointer">Términos</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPage;
