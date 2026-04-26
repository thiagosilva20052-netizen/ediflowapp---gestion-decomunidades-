import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';
import { FileText, Download, CheckSquare, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

interface Props {
  onNavigate?: (screen: any) => void;
}

const ChecklistLeyPage: React.FC<Props> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDownload = () => {
    // Simulated download
    alert('Iniciando descarga del Checklist Interactivo Ley 21.442 - Ediflow (.pdf)');
  };

  return (
    <div className="bg-white dark:bg-[#050505] min-h-screen text-gray-900 dark:text-white font-sans selection:bg-blue-50 selection:text-blue-900 flex flex-col transition-colors duration-500">
      
      {/* Mini Nav / Header */}
      <nav className="fixed top-0 inset-x-0 h-16 border-b border-gray-100 dark:border-white/5 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md z-50 flex items-center justify-between px-6 lg:px-16">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate && onNavigate('Landing')}>
            <Logo variant="horizontal" className="scale-[0.8] origin-left" />
        </div>
        <div className="flex items-center gap-4">
            <ThemeToggle />
            <button 
              onClick={() => onNavigate && onNavigate('Resources')}
              className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Recursos
            </button>
        </div>
      </nav>

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Copywriting */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                 Cumplimiento Legal
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-[1.05] text-gray-900 dark:text-white">
                Audita tu condominio. Evita multas con la <span className="font-serif italic font-normal text-ediflow-primary">Ley 21.442 en 5 minutos.</span>
              </h1>
              <p className="text-xl text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                Descarga nuestro Checklist interactivo gratuito. Identifica las brechas legales de tu comunidad al instante y sin formularios infinitos. El primer paso hacia una administración blindada.
              </p>
            </div>

            <div className="space-y-6">
              <button 
                onClick={handleDownload}
                className="group bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
              >
                <Download size={22} className="group-hover:translate-y-0.5 transition-transform" />
                Descargar Checklist (PDF interactivo)
              </button>

              <div className="flex flex-col gap-4">
                 <button 
                  onClick={() => onNavigate && onNavigate('Landing')}
                  className="text-gray-500 hover:text-ediflow-primary font-medium text-sm transition-colors flex items-center gap-2 group w-fit"
                 >
                   ¿Tu administrador actual no cumple con esto? Descubre cómo Ediflow lo automatiza todo
                   <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
            </div>

            {/* Steps Section */}
            <div className="pt-10 border-t border-gray-100 dark:border-white/5 space-y-8">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Cero Fricción</p>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { step: '01', title: 'Descarga', desc: 'Acceso directo sin formularios.' },
                    { step: '02', title: 'Audita', desc: 'Marca las casillas de cumplimiento.' },
                    { step: '03', title: 'Evalúa', desc: 'Descubre tu nivel de riesgo legal.' },
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                       <span className="text-sm font-serif italic text-ediflow-primary font-bold">{item.step}.</span>
                       <h4 className="text-sm font-bold">{item.title}</h4>
                       <p className="text-xs text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>

          {/* Right Column: Visual Preview */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
             <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[3rem] p-4 shadow-2xl relative overflow-hidden group">
                {/* Mockup of PDF/Document */}
                <div className="bg-white dark:bg-[#0A0A0A] rounded-[2.5rem] p-10 space-y-8 relative z-10">
                   <div className="flex items-center justify-between">
                      <FileText className="text-ediflow-primary" size={40} />
                      <div className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-[10px] font-bold uppercase tracking-widest border border-blue-100 dark:border-blue-800/30">
                         Actualizado 2026
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="h-4 bg-gray-100 dark:bg-white/5 rounded-full w-3/4" />
                      <div className="space-y-4">
                        {[
                          { text: 'Fondo de Reserva Legal (5%)', checked: true },
                          { text: 'Plan de Emergencia Actualizado', checked: true },
                          { text: 'Seguro Contra Incendio Vigente', checked: false },
                          { text: 'Mantención de Ascensores al día', checked: true },
                        ].map((check, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                             <div className={`w-5 h-5 rounded border ${check.checked ? 'bg-ediflow-primary border-ediflow-primary flex items-center justify-center' : 'border-gray-300'}`}>
                                {check.checked && <div className="w-2 h-2 bg-white rounded-full" />}
                             </div>
                             <span className={`text-xs font-medium ${check.checked ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{check.text}</span>
                          </div>
                        ))}
                      </div>
                   </div>

                   <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="text-green-500" size={16} />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Blindaje Legal Ediflow</span>
                      </div>
                      <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-xl flex items-center justify-center">
                         <span className="text-xl font-bold">75%</span>
                      </div>
                   </div>
                </div>

                {/* Subtle Glow */}
                <div className="absolute inset-0 bg-blue-50/20 dark:bg-blue-900/5 blur-[100px] pointer-events-none rounded-full" />
             </div>

             {/* Floating Info Badge */}
             <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 z-20 flex items-center gap-4"
             >
                <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                   <AlertCircle size={20} className="text-red-500" />
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Alerta de Riesgo</p>
                   <p className="text-xs font-bold leading-tight">La ley 21.442 exige <br/>plan de mantenimiento.</p>
                </div>
             </motion.div>
          </motion.div>

        </div>

        {/* The "Trojan Horse" Section */}
        <section className="mt-32 max-w-6xl mx-auto px-6 lg:px-16">
           <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[4rem] p-12 md:p-20 text-center space-y-10 relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-50/50 dark:bg-blue-900/5 blur-[120px] pointer-events-none rounded-full" />
              
              <div className="max-w-2xl mx-auto space-y-6 relative z-10">
                 <h2 className="text-3xl md:text-5xl font-bold tracking-tight">¿Cumples con el 5% del fondo de reserva obligatorio?</h2>
                 <p className="text-gray-500 dark:text-gray-400 text-lg font-light leading-relaxed">
                   La Ley 21.442 no es opcional. Nuestra plataforma automatiza el cálculo de fondos legales, seguros e inspecciones técnicas para que tú duermas tranquilo.
                 </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                 <button 
                  onClick={() => onNavigate && onNavigate('Landing')}
                  className="w-full sm:w-auto bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all"
                 >
                   Descubrir Ediflow
                   <ArrowRight size={18} />
                 </button>
                 <button 
                  onClick={() => onNavigate && onNavigate('Pricing')}
                  className="w-full sm:w-auto bg-white dark:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 px-10 py-5 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
                 >
                   Ver Planes y Precios
                 </button>
              </div>
           </div>
        </section>
      </main>

      {/* Subtle Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9999] mix-blend-overlay">
         <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <filter id="noise">
               <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
         </svg>
      </div>

    </div>
  );
};

export default ChecklistLeyPage;
