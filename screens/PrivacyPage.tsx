import React, { useState, useEffect } from 'react';
import { Logo } from '../components/Logo';

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
              onClick={() => onNavigate && onNavigate('Pricing')}
              className="cursor-pointer text-sm font-medium text-[#A3A3A3] hover:text-white transition-colors"
            >
              Precios
            </div>
            <div 
               className="cursor-pointer text-sm font-medium text-white transition-colors flex items-center gap-1 border-b border-ediflow-primary/50 pb-0.5"
            >
               Trust Center <span className="material-symbols-outlined text-[14px] text-ediflow-primary">verified_user</span>
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

      {/* Main Content: Document Reader Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-16 pt-32 pb-24 flex flex-col md:flex-row gap-12 lg:gap-24 relative">
        
        {/* Subdued Glow Background */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-ediflow-primary/5 blur-[150px] rounded-[100%] pointer-events-none z-0"></div>

        {/* Sticky Sidebar (Table of Contents) */}
        <aside className="hidden md:block w-64 shrink-0 relative z-10">
           <div className="sticky top-32">
              <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-500 mb-6">Contenido Legal</h4>
              <nav className="flex flex-col gap-1">
                 <button 
                    onClick={() => scrollToSection('datos')}
                    className={`text-left text-sm py-2 px-4 transition-all border-l ${activeSection === 'datos' ? 'text-white border-ediflow-primary font-medium bg-gradient-to-r from-ediflow-primary/5 to-transparent' : 'text-gray-500 border-white/5 hover:text-gray-300 hover:border-white/20'}`}
                 >
                    ¿Qué datos procesamos?
                 </button>
                 <button 
                    onClick={() => scrollToSection('ia')}
                    className={`text-left text-sm py-2 px-4 transition-all border-l ${activeSection === 'ia' ? 'text-white border-ediflow-primary font-medium bg-gradient-to-r from-ediflow-primary/5 to-transparent' : 'text-gray-500 border-white/5 hover:text-gray-300 hover:border-white/20'}`}
                 >
                    El uso de Inteligencia Artificial
                 </button>
                 <button 
                    onClick={() => scrollToSection('infraestructura')}
                    className={`text-left text-sm py-2 px-4 transition-all border-l ${activeSection === 'infraestructura' ? 'text-white border-ediflow-primary font-medium bg-gradient-to-r from-ediflow-primary/5 to-transparent' : 'text-gray-500 border-white/5 hover:text-gray-300 hover:border-white/20'}`}
                 >
                    Infraestructura y Seguridad
                 </button>
                 <button 
                    onClick={() => scrollToSection('ley-chile')}
                    className={`text-left text-sm py-2 px-4 transition-all border-l ${activeSection === 'ley-chile' ? 'text-white border-ediflow-primary font-medium bg-gradient-to-r from-ediflow-primary/5 to-transparent' : 'text-gray-500 border-white/5 hover:text-gray-300 hover:border-white/20'}`}
                 >
                    Cumplimiento Ley N° 19.628 (Chile)
                 </button>
              </nav>

              <div className="mt-12 bg-[#111] border border-white/5 rounded-xl p-5 shadow-lg">
                 <div className="flex items-center gap-3 mb-3">
                    <span className="material-symbols-outlined text-green-400 text-lg">shield</span>
                    <span className="text-white text-sm font-medium">Trust Center Ediflow</span>
                 </div>
                 <p className="text-xs text-gray-400 font-light leading-relaxed mb-4">
                    Tu información es procesada en servidores encriptados, cumpliendo estrictamente con la normativa chilena.
                 </p>
              </div>
           </div>
        </aside>

        {/* Central Narrow Reading Column */}
        <article className="flex-1 max-w-[65ch] text-[#A3A3A3] font-light leading-relaxed space-y-12 relative z-10">
           
           <header className="mb-16">
              <h1 className="text-4xl md:text-5xl font-light text-white tracking-tight leading-tight mb-6">
                 Privacidad por diseño. <br/>
                 <span className="font-serif italic font-normal text-white">Tus datos, blindados.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light">
                 En Ediflow entendemos que la información de tu comunidad es crítica. No vendemos tus datos, no entrenamos modelos públicos con ellos y aplicamos seguridad de nivel bancario.
              </p>
           </header>

           <div className="space-y-16">
              
              <section id="datos" className="scroll-mt-32">
                 <h2 className="text-2xl font-serif italic font-medium text-white mb-6 border-b border-white/10 pb-4">1. ¿Qué datos procesamos?</h2>
                 <p className="mb-4">Para que nuestra Inteligencia Artificial automatice tu edificio de forma precisa y eficiente, procesamos las siguientes categorías de datos estrictamente necesarios:</p>
                 <ul className="space-y-4 ml-2">
                    <li className="flex items-start gap-4">
                       <span className="material-symbols-outlined text-[16px] text-ediflow-primary mt-1">analytics</span>
                       <div>
                          <strong className="text-white font-medium block mb-1">Datos operativos:</strong>
                          <p>Imágenes de facturas y etiquetas de paquetería (procesadas por nuestro motor OCR), transcripciones efímeras de voz de la conserjería y datos de contacto de residentes necesarios para notificaciones.</p>
                       </div>
                    </li>
                    <li className="flex items-start gap-4">
                       <span className="material-symbols-outlined text-[16px] text-ediflow-primary mt-1">account_balance</span>
                       <div>
                          <strong className="text-white font-medium block mb-1">Datos financieros:</strong>
                          <p><strong>Ediflow NO almacena de forma parcial ni total tarjetas de crédito, débito o credenciales bancarias.</strong> Toda transacción económica es encriptada y delegada nativamente a nuestros partners certificados (Khipu y MercadoPago), cumpliendo con el estándar PCI-DSS.</p>
                       </div>
                    </li>
                 </ul>
              </section>

              <section id="ia" className="scroll-mt-32">
                 <h2 className="text-2xl font-serif italic font-medium text-white mb-6 border-b border-white/10 pb-4">2. El uso de la Inteligencia Artificial</h2>
                 <p className="mb-4">
                    Ediflow utiliza Modelos de Lenguaje Grande (LLMs) y sistemas de Visión Computacional de última generación para extraer datos de gastos comunes, resumir bitácoras y redactar comunicados formales.
                 </p>
                 <div className="bg-[#111] border border-white/5 p-6 rounded-xl mt-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-ediflow-primary"></div>
                    <p className="font-medium text-gray-200">
                       La información de tu edificio se utiliza <strong className="text-white">estrictamente de forma efímera</strong> para completar la tarea operativa en curso. Esta información <strong className="text-white">NUNCA</strong> se almacena a largo plazo en memoria de IA, ni se comparte con proveedores subyacentes para entrenar modelos públicos de terceros.
                    </p>
                 </div>
              </section>

              <section id="infraestructura" className="scroll-mt-32">
                 <h2 className="text-2xl font-serif italic font-medium text-white mb-6 border-b border-white/10 pb-4">3. Infraestructura y Seguridad</h2>
                 <p className="mb-4">
                    Toda la información operativa (perfiles de residentes, registro de paquetería, libro de novedades digital) se aloja en infraestructuras altamente seguras (Supabase/Google Cloud) bajo protocolos estrictos.
                 </p>
                 <ul className="list-disc pl-5 space-y-2 mt-4 text-sm">
                    <li>Bases de datos aisladas y cifradas en tránsito (TLS 1.2+) y en reposo (AES-256).</li>
                    <li>Sistemas de autenticación robustos para cada nivel de usuario (Administrador, Conserje, Residente).</li>
                    <li>Políticas de seguridad Row Level Security (RLS) que garantizan que una comunidad no pueda acceder bajo ningún escenario a los datos de otra.</li>
                 </ul>
              </section>

              <section id="ley-chile" className="scroll-mt-32 pt-8">
                 <div className="bg-[#1c0d0d] border border-red-500/20 p-8 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl"></div>
                    
                    <div className="flex items-center gap-4 mb-6">
                       <span className="material-symbols-outlined text-red-400 text-3xl">gavel</span>
                       <h2 className="text-xl font-medium text-white">Resguardo de Datos (Ley Chilena)</h2>
                    </div>

                    <p className="mb-6 text-gray-300">
                       En estricto cumplimiento de la <strong>Ley N° 19.628 sobre Protección de la Vida Privada en Chile</strong>, Ediflow garantiza a todos los usuarios (Administradores, Conserjes y Residentes) de nuestra plataforma el ejercicio pleno de sus <strong>Derechos ARCO</strong> (Acceso, Rectificación, Cancelación y Oposición).
                    </p>

                    <ul className="space-y-4 text-sm text-gray-400">
                       <li className="flex items-start gap-3">
                          <span className="text-red-400 font-bold">•</span>
                          <span>Todo residente o usuario tiene el derecho irrenunciable a solicitar una copia de los datos que almacenamos sobre su unidad, corregirlos si son inexactos, o exigir su eliminación total de nuestros registros operativos si decide abandonar la plataforma o el edificio.</span>
                       </li>
                       <li className="flex items-start gap-3">
                          <span className="text-red-400 font-bold">•</span>
                          <span>La recolección de datos mediante el asistente de voz en conserjería, patentes de vehículos o el OCR de paquetería se realiza con el <strong>fin exclusivo de mantener la seguridad operativa y de acceso</strong> al condominio, no siendo utilizados jamás para perfilamiento comercial.</span>
                       </li>
                    </ul>
                 </div>
              </section>

           </div>

           {/* DPO Contact CTA */}
           <div className="mt-24 pt-12 border-t border-white/5 text-center px-4">
              <h3 className="text-xl text-white font-medium mb-4">¿Tienes dudas sobre cómo protegemos los datos de tu comunidad?</h3>
              <p className="text-sm text-gray-400 mb-8 max-w-md mx-auto">
                 Nuestro Data Protection Officer (DPO) está disponible para responder cualquier inquietud legal o de cumplimiento de tu comité.
              </p>
              <a 
                 href="mailto:privacidad@ediflow.cl"
                 className="inline-flex items-center justify-center gap-3 bg-transparent border border-white/20 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-white/5 transition-colors"
              >
                 Contactar al Equipo de Privacidad
                 <span className="material-symbols-outlined text-[16px]">mail</span>
              </a>
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
                 <span className="text-gray-400">Privacidad</span>
             </nav>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-gray-600 tracking-widest uppercase font-semibold">
              &copy; {new Date().getFullYear()} Ediflow. Gestión Inteligente de Comunidades.
            </p>
            <div className="flex gap-6">
              <span className="text-[10px] text-white uppercase tracking-widest transition-colors font-semibold border-b border-white pb-0.5">Privacidad</span>
              <span className="text-[10px] text-gray-500 hover:text-white uppercase tracking-widest transition-colors font-semibold cursor-pointer">Términos</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPage;
