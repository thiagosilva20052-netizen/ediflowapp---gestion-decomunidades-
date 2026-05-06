import React, { useState, useEffect } from 'react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  Server, 
  Database, 
  FileText, 
  ShieldAlert, 
  Cpu, 
  ChevronRight,
  Download,
  CheckCircle2,
  LockKeyhole
} from 'lucide-react';

interface Props {
  onLoginClick: () => void;
  onNavigate?: (screen: any) => void;
}

const TermsPage: React.FC<Props> = ({ onLoginClick, onNavigate }) => {
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

  const bentoCards = [
    {
      title: "Términos de Servicio",
      description: "Nuestros lineamientos legales para el uso de la plataforma, planes y contratos.",
      icon: <FileText className="w-8 h-8 text-ediflow-primary" />,
      tag: "Contractual",
      id: "terms-content",
      details: ["Migración Asistida", "Planes Anuales", "Retiro de Datos"]
    },
    {
      title: "Privacidad de Datos",
      description: "Qué información guardamos, cómo la procesamos y tus derechos ARCO.",
      icon: <UserCheck className="w-8 h-8 text-ediflow-primary" />,
      tag: "Seguridad",
      id: "privacy-content",
      details: ["Encriptación AES-256", "Cero perfilamiento", "Propiedad irrenunciable"]
    },
    {
      title: "Infraestructura",
      description: "Cómo operamos en la nube para garantizar un 99.9% de disponibilidad.",
      icon: <Server className="w-8 h-8 text-ediflow-primary" />,
      tag: "Cloud",
      id: "infra-content",
      details: ["Google Cloud / AWS", "SLA Garantizado", "Backups redundantes"]
    }
  ];

  return (
    <div className="bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white font-sans selection:bg-ediflow-primary/10 selection:text-gray-900 min-h-screen flex flex-col overflow-x-hidden transition-colors duration-300">
      {/* Sticky Navigation Bar */}
      <header className={`fixed top-0 inset-x-0 w-full z-50 transition-all duration-500 ease-in-out ${scrollOpacity > 0.05 ? 'bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105" onClick={() => onNavigate && onNavigate('Landing')}>
            <Logo variant="horizontal" color="currentColor" className="scale-[0.8] origin-left" />
          </div>

          <nav className="hidden lg:flex items-center gap-10 text-[13px] font-medium tracking-tight">
            <div onClick={() => onNavigate && onNavigate('Landing')} className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Inicio</div>
            <div onClick={() => onNavigate && onNavigate('Solutions')} className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Soluciones</div>
            <div onClick={() => onNavigate && onNavigate('Resources')} className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Recursos</div>
            <div onClick={() => onNavigate && onNavigate('Pricing')} className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Precios</div>
            <div className="text-gray-900 dark:text-white transition-colors flex items-center gap-2 bg-gray-50 dark:bg-white/5 px-3 py-1 rounded-full border border-gray-100 dark:border-white/10">
               <ShieldCheck size={14} className="text-ediflow-primary" />
               Trust Center
            </div>
          </nav>

          <div className="flex items-center gap-4 lg:gap-6">
            <ThemeToggle />
            <button onClick={onLoginClick} className="hidden md:block text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all">Iniciar Sesión</button>
            <button onClick={() => onNavigate && onNavigate('BookDemo')} className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-ediflow-primary dark:hover:bg-ediflow-primary dark:hover:text-white transition-all shadow-xl active:scale-95">
              Agendar Demo
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 relative">
        {/* Hero Section */}
        <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 px-6 lg:px-16 max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-50/50 dark:bg-blue-900/10 blur-[150px] -z-10 rounded-full"></div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 text-blue-600 dark:text-blue-400 text-[11px] font-bold uppercase tracking-widest mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
            Centro de Confianza & Seguridad
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 dark:text-white mb-8 leading-[1.05]"
          >
            Seguridad de grado bancario.<br/>
            <span className="text-ediflow-primary">Transparencia total.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-light max-w-2xl mb-12"
          >
            Tus datos financieros, la privacidad de tus residentes y la operación de tu conserjería están blindados por estándares internacionales. Conoce cómo protegemos tu comunidad.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <button className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-8 py-4 rounded-xl font-bold text-sm tracking-tight hover:bg-ediflow-primary transition-all shadow-xl flex items-center gap-3 group">
              <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" />
              Descargar Políticas (PDF)
            </button>
            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">Versión 2.4 — Actualizada hace 15 días</span>
          </motion.div>
        </section>

        {/* The 3 Pillars */}
        <section className="px-6 lg:px-16 max-w-7xl mx-auto pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gray-50 dark:bg-white/5 p-8 rounded-3xl border border-gray-100 dark:border-white/10 relative overflow-hidden group shadow-sm hover:shadow-xl transition-all"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/20 dark:bg-blue-900/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-12 h-12 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-gray-100 dark:border-white/10 shadow-sm">
                <LockKeyhole className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Encriptación Absoluta</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-light leading-relaxed">
                Toda la información viaja cifrada de extremo a extremo mediante TLS 1.3 y se almacena bajo el estándar AES-256 de grado bancario.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gray-50 dark:bg-white/5 p-8 rounded-3xl border border-gray-100 dark:border-white/10 relative overflow-hidden group shadow-sm hover:shadow-xl transition-all"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/20 dark:bg-blue-900/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-12 h-12 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-gray-100 dark:border-white/10 shadow-sm">
                <UserCheck className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Control de Accesos</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-light leading-relaxed">
                Tú decides qué ve el conserje y qué ve el residente. Políticas RLS estrictas para que tus datos sean compartimentados y seguros.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gray-50 dark:bg-white/5 p-8 rounded-3xl border border-gray-100 dark:border-white/10 relative overflow-hidden group shadow-sm hover:shadow-xl transition-all"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/20 dark:bg-blue-900/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-12 h-12 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-gray-100 dark:border-white/10 shadow-sm">
                <ShieldCheck className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Privacidad Garantizada</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-light leading-relaxed">
                Nunca venderemos los datos de tu comunidad a terceros ni los usaremos para perfilar usuarios comercialmente. Tu data es tuya.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Bento Grid Legal Section */}
        <section className="px-6 lg:px-16 max-w-7xl mx-auto py-24 border-t border-gray-100 dark:border-white/5">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Lineamientos Legales</h2>
            <p className="text-gray-600 dark:text-gray-400 font-light">Explora nuestros protocolos y compromisos organizados para una lectura rápida.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bentoCards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white dark:bg-[#111] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/10 flex flex-col h-full relative group overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 dark:bg-blue-900/10 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex justify-between items-start mb-10">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center p-4 border border-gray-100 dark:border-white/10 translate-x-[-10px] transform -rotate-3 group-hover:rotate-0 transition-transform">
                    {card.icon}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800/30">
                    {card.tag}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">{card.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 font-light text-sm mb-10 leading-relaxed">
                  {card.description}
                </p>

                <div className="mt-auto space-y-3">
                  {card.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-medium">
                      <div className="w-1 h-1 rounded-full bg-blue-500 dark:bg-blue-400"></div>
                      {detail}
                    </div>
                  ))}
                </div>

                <button className="mt-10 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white group/btn">
                  Leer ahora 
                  <ChevronRight size={16} className="text-blue-600 dark:text-blue-400 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Compliance / Social Proof Section */}
        <section className="px-6 lg:px-16 max-w-7xl mx-auto py-24 border-t border-gray-100 dark:border-white/5">
          <div className="bg-gray-50 dark:bg-white/5 rounded-[3rem] p-12 md:p-16 border border-gray-100 dark:border-white/10 flex flex-col items-center shadow-inner">
            <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-16 text-center">Infraestructura & Cumplimiento Empresarial</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-x-24 opacity-60 grayscale hover:grayscale-0 dark:grayscale-0 dark:opacity-100 transition-all duration-700">
              <div className="flex flex-col items-center gap-4">
                <Database className="w-10 h-10 text-gray-900 dark:text-white" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400">Supabase DB</span>
              </div>
              <div className="flex flex-col items-center gap-4">
                <Cpu className="w-10 h-10 text-gray-900 dark:text-white" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400">AWS / Cloud</span>
              </div>
              <div className="flex flex-col items-center gap-4">
                <ShieldAlert className="w-10 h-10 text-gray-900 dark:text-white" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400">AES-256 Auth</span>
              </div>
              <div className="flex flex-col items-center gap-4">
                <Lock className="w-10 h-10 text-gray-900 dark:text-white" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400">TLS 1.3 Proto</span>
              </div>
            </div>

            <div className="mt-20 pt-10 border-t border-gray-200 dark:border-white/10 w-full flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex items-center gap-4 text-left">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full border border-blue-100 dark:border-blue-800/30">
                    <CheckCircle2 className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-bold tracking-tight">Resguardo de Datos (Ley Chilena)</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Cumplimiento íntegro de la Ley N° 19.628</p>
                  </div>
               </div>
               <button className="text-blue-600 dark:text-blue-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-bold underline underline-offset-4 pointer-events-none">
                  Ver Certificaciones →
               </button>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="px-6 lg:px-16 max-w-7xl mx-auto py-24 mb-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">¿Tienes dudas sobre seguridad?</h2>
            <p className="text-gray-600 dark:text-gray-400 font-light mb-10 leading-relaxed">
              Nuestro Data Protection Officer (DPO) está disponible para responder cualquier inquietud legal o de cumplimiento de tu comité de administración.
            </p>
            <a 
               href="mailto:seguridad@ediflow.cl"
               className="inline-flex items-center gap-3 bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-10 py-4 rounded-xl font-bold text-sm tracking-tight hover:bg-ediflow-primary transition-all shadow-xl active:scale-[0.98]"
            >
              Contactar al Equipo DPO
              <ChevronRight size={16} />
            </a>
          </div>
        </section>
      </main>

      {/* Footer Nav */}
      <footer className="bg-gray-50 dark:bg-[#050505] pt-16 pb-12 border-t border-gray-200 dark:border-white/5 relative z-20 text-gray-900 dark:text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <Logo variant="horizontal" color="currentColor" className="scale-[0.7] opacity-60 grayscale dark:grayscale-0 dark:opacity-100" />
            <div className="flex gap-8 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              <span onClick={() => onNavigate && onNavigate('Privacy')} className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">Privacidad</span>
              <span className="text-gray-900 dark:text-white border-b border-ediflow-primary pb-1">Trust Center</span>
              <span onClick={() => onNavigate && onNavigate('Landing')} className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">Inicio</span>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 tracking-[0.2em] uppercase font-bold text-center border-t border-gray-200 dark:border-white/5 pt-12">
            &copy; {new Date().getFullYear()} Ediflow. Todos los derechos reservados. Seguridad Bancaria para tu Comunidad.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TermsPage;

