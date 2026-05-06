import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';
import { FileSpreadsheet, Download, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  onNavigate?: (screen: any) => void;
}

const ProrrationTemplatePage: React.FC<Props> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDownload = () => {
    // In a real app, this would be a link to a file in /public
    // For this prototype, we'll simulate the download start
    alert('Iniciando descarga de la Plantilla Maestra de Prorrateo Ediflow (.xlsx)');
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
                 Recurso Gratuito
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-[1.05] text-gray-900 dark:text-white">
                Calcula el prorrateo de tu edificio en <span className="font-serif italic font-normal text-ediflow-primary">5 minutos.</span>
              </h1>
              <p className="text-xl text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                Descarga nuestra plantilla maestra gratuita. Ingresa los gastos mensuales y deja que el sistema divida el cobro por unidad al instante. El primer paso hacia una administración libre de errores y quejas.
              </p>
            </div>

            <div className="space-y-6">
              <button 
                onClick={handleDownload}
                className="group bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
              >
                <Download size={22} className="group-hover:translate-y-0.5 transition-transform" />
                Descargar Plantilla Gratis (.xlsx)
              </button>

              <div className="flex flex-col gap-4">
                 <button 
                  onClick={() => onNavigate && onNavigate('Landing')}
                  className="text-gray-500 hover:text-ediflow-primary font-medium text-sm transition-colors flex items-center gap-2 group w-fit"
                 >
                   ¿Cansado de hacer esto a mano cada mes? Descubre cómo Ediflow lo automatiza al 100%
                   <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
            </div>

            {/* Steps Section */}
            <div className="pt-10 border-t border-gray-100 dark:border-white/5 space-y-8">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">3 Pasos Simples</p>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { step: '01', title: 'Descarga', desc: 'Sin registros ni formularios.' },
                    { step: '02', title: 'Ingresa', desc: 'Digita los gastos del mes.' },
                    { step: '03', title: 'Listo', desc: 'Prorrateo calculado al instante.' },
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

          {/* Right Column: Visual Preview (Bento/Notebook Style) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
             <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[3rem] p-1 shadow-2xl relative overflow-hidden group">
                {/* Simulated Spreadsheet Content */}
                <div className="bg-white dark:bg-[#0A0A0A] rounded-[2.8rem] p-8 space-y-8 relative z-10 transition-colors">
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-ediflow-primary flex items-center justify-center">
                            <FileSpreadsheet className="text-white" size={20} />
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ediflow Master Template</p>
                            <p className="font-bold text-sm">Cálculo de Prorrateo V2.4</p>
                         </div>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 text-[10px] font-bold uppercase tracking-widest">
                         Listo para Uso
                      </div>
                   </div>

                   <div className="space-y-4">
                      {/* Grid simulation */}
                      <div className="grid grid-cols-4 gap-2">
                         {[1,2,3,4].map(i => <div key={i} className="h-6 bg-gray-50 dark:bg-white/5 rounded-md border border-gray-100 dark:border-white/5" />)}
                         {[1,2,3,4,5,6,7,8].map(i => <div key={i} className={`h-8 rounded-md border border-gray-100 dark:border-white/5 ${i % 4 === 3 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-white/5'}`} />)}
                      </div>
                   </div>

                   <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10 space-y-4">
                      <div className="flex justify-between items-center text-xs">
                         <span className="text-gray-400 font-medium">Total Gastos Comunes</span>
                         <span className="font-bold">$4.250.000</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-sm font-bold">Unidad 402 (A)</span>
                         <span className="text-lg font-serif italic text-ediflow-primary">$142.500</span>
                      </div>
                   </div>

                   <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                      <RefreshCw size={12} className="animate-spin-slow" />
                      Fórmulas validadas por auditores especialistas.
                   </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-50/20 dark:bg-blue-900/10 blur-[120px] pointer-events-none rounded-full transition-opacity group-hover:opacity-100 opacity-50"></div>
             </div>

             {/* Badge Overlays */}
             <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -top-6 -right-6 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 z-20 flex items-center gap-3"
             >
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                   <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-xs font-bold leading-tight">Excel Premium <br/><span className="text-gray-400 font-medium">Fricción Cero</span></p>
             </motion.div>
          </motion.div>

        </div>

        {/* Value Prop Section */}
        <section className="mt-32 max-w-6xl mx-auto px-6 lg:px-16">
           <div className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[150px] pointer-events-none rounded-full"></div>
              
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                 <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Es momento de jubilar tus hojas de cálculo manuales.</h2>
                    <p className="text-gray-400 dark:text-gray-500 text-lg font-light leading-relaxed">
                       Esta plantilla es excelente para comenzar, pero toma 30 minutos llenarla cada mes. Ediflow calcula el prorrateo automáticamente en 3 segundos y envía las boletas por correo.
                    </p>
                 </div>
                 <div className="flex flex-col gap-6">
                    <button 
                      onClick={() => onNavigate && onNavigate('Landing')}
                      className="bg-ediflow-primary text-white px-8 py-5 rounded-2xl font-bold text-center hover:scale-105 active:scale-95 transition-all shadow-xl"
                    >
                      Solicitar Onboarding Gratuito
                    </button>
                    <p className="text-center text-xs text-gray-500 font-medium">
                       Pasa de 4 horas de trabajo a 4 clics. <br/>Únete a las +500 comunidades que ya automatizaron su gestión.
                    </p>
                 </div>
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

export default ProrrationTemplatePage;
