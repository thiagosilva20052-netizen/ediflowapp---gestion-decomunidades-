import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';
import { ShieldCheck, Info, Clock, Volume2, Users, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Props {
  onNavigate?: (screen: any) => void;
}

const NoiseGuidePage: React.FC<Props> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        {/* 1. Hero Section: PAS Hook */}
        <section className="px-6 max-w-4xl mx-auto mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest">
               Guía de Convivencia
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[1.1] text-gray-900 dark:text-white">
              Recupera tu tranquilidad. <br/>
              <span className="font-serif italic font-normal text-ediflow-primary">Guía práctica para resolver ruidos molestos en tu edificio.</span>
            </h1>
            
            <div className="space-y-6 text-lg md:text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed">
              <p>
                Sabemos que tu departamento en Santiago es tu refugio. Perder horas de sueño o concentración porque un vecino decidió subir el volumen a las 3 AM o usar el taladro un domingo por la mañana, es una invasión directa a tu espacio personal. 
              </p>
              <p>
                A nivel neurológico, el ruido constante dispara tus niveles de cortisol, generando estrés crónico. Y lo peor no es solo el ruido, es la frustración de no saber a quién acudir o el desgaste de pelear en el grupo de WhatsApp de la comunidad.
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                En Ediflow, entendemos que tu bienestar, tu descanso y tu paz mental no son negociables. Por eso, hemos diseñado esta guía para devolverte el control de tu entorno, sin fricciones ni confrontaciones innecesarias.
              </p>
            </div>
          </motion.div>
        </section>

        {/* 2. Visual Content: Apartment Scene mockup */}
        <section className="px-6 max-w-5xl mx-auto mb-24">
           <div className="relative group overflow-hidden rounded-[3rem] aspect-video md:aspect-[21/9] bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1628172851212-be9bcbe80572?auto=format&fit=crop&q=80&w=2000" 
                alt="Minimalist Apartment"
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000 grayscale-[0.2]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-[#050505]"></div>
              
              <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row items-end justify-between gap-4">
                 <div className="bg-white/90 dark:bg-black/80 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl max-w-xs transition-transform hover:-translate-y-1">
                    <p className="text-[10px] font-bold text-ediflow-primary uppercase tracking-widest mb-1">Estado de Confort</p>
                    <p className="text-sm font-medium dark:text-white">Tu comunidad gestionada por Ediflow reduce dramáticamente las fricciones por ruidos molestos.</p>
                 </div>
              </div>
           </div>
        </section>

        {/* 3. Identifica el tipo de ruido (La Normativa): Bento Grid */}
        <section className="px-6 max-w-6xl mx-auto mb-32">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">1. Identifica el tipo de ruido (La Normativa)</h2>
            <p className="text-gray-500 font-medium">Para actuar con eficacia, tu cerebro necesita claridad. Conocer estas categorías te da el poder de la objetividad.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Social Noise */}
            <div className="md:col-span-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-10 hover:bg-white dark:hover:bg-white/10 transition-all shadow-sm overflow-hidden relative">
              <div className="flex items-center gap-4 mb-6 relative z-10">
                 <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center border border-blue-100 dark:border-blue-800/30">
                    <Volume2 className="text-blue-600 dark:text-blue-400" />
                 </div>
                 <h3 className="text-xl font-bold">Música y Fiestas</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm relative z-10">
                <div className="space-y-3">
                  <p className="text-gray-500 uppercase text-[10px] font-bold tracking-[0.1em]">Protocolo Nocturno</p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    Superar el límite de decibeles permitidos (generalmente <span className="text-gray-900 dark:text-white font-bold">55 dB</span> de día y <span className="text-gray-900 dark:text-white font-bold">45 dB</span> en horario nocturno, de 21:00 a 07:00 hrs).
                  </p>
                </div>
                <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-white/10 p-4 aspect-video flex flex-col items-center justify-center text-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                        <Clock size={18} className="text-red-500" />
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Visual: Horario Crítico</p>
                </div>
              </div>
            </div>

            {/* Card 2: Construction */}
            <div className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-[2.5rem] p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden">
               <div className="space-y-4 relative z-10">
                  <Clock className="text-ediflow-primary" size={32} />
                  <h3 className="text-xl font-bold">Remodelaciones</h3>
                  <p className="text-gray-400 dark:text-gray-500 text-sm font-medium leading-relaxed">
                    Uso de taladros o martillos fuera del horario hábil establecido (estrictamente prohibidos los fines de semana y festivos).
                  </p>
               </div>
               <div className="mt-8 pt-6 border-t border-white/10 dark:border-gray-100/10 text-[10px] font-bold uppercase tracking-widest text-ediflow-primary relative z-10">
                  Visual: Calendario Restringido
               </div>
            </div>

            {/* Card 3: Pets */}
            <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-10 hover:bg-white dark:hover:bg-white/10 transition-all shadow-sm">
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center border border-orange-100 dark:border-orange-800/30">
                    <Users className="text-orange-600 dark:text-orange-400" />
                 </div>
                 <h3 className="text-xl font-bold">Mascotas Desatendidas</h3>
               </div>
               <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-6">
                 Ladridos prolongados debido a mascotas que quedan solas en los departamentos durante largas jornadas. No solo es ruido, es bienestar animal.
               </p>
               <div className="p-4 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 text-[10px] font-bold text-center text-gray-400 uppercase tracking-widest">
                  Visual: Icono Mascota & Alerta
               </div>
            </div>

            {/* Card 4: Tips */}
            <div className="md:col-span-2 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-10">
               <div className="flex-1 space-y-4">
                  <h3 className="text-xl font-bold text-blue-900 dark:text-blue-400 tracking-tight">2. Solución Diplomática en 3 Pasos</h3>
                  <p className="text-blue-800/80 dark:text-blue-300 font-medium text-sm leading-relaxed">
                     La neurociencia demuestra que reaccionar "en caliente" solo escala el conflicto. Sigue este protocolo de fricción cero para recuperar el control.
                  </p>
               </div>
               <div className="w-32 h-32 md:w-40 md:h-40 bg-white dark:bg-white/10 rounded-full flex items-center justify-center shadow-xl border border-blue-100 dark:border-blue-800/30 shrink-0">
                  <ShieldCheck size={64} className="text-blue-600 dark:text-blue-400" />
               </div>
            </div>
          </div>
        </section>

        {/* 4. Plan de Acción en 3 Pasos */}
        <section className="px-6 max-w-4xl mx-auto mb-32">
          <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-green-50/30 dark:bg-green-900/10 blur-[120px] pointer-events-none rounded-full"></div>
             
             <div className="relative z-10 space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Recupera el Control</h2>
                  <p className="text-gray-500 font-medium">Protocolo de fricción cero para una resolución efectiva.</p>
                </div>

                <div className="space-y-12">
                  {[
                    { step: '01', title: 'Documenta la evidencia', desc: 'En lugar de enojarte, toma tu celular y graba un video corto donde se perciba claramente la intensidad del ruido y la hora. La evidencia objetiva elimina el debate.' },
                    { step: '02', title: 'Evita la confrontación directa', desc: 'No te expongas. El anonimato y la mediación de un tercero (el administrador) son la vía más efectiva para resolver conflictos en comunidades de alta densidad.' },
                    { step: '03', title: 'Delega la carga profesional / Ediflow', desc: 'Aquí es donde la tecnología debe trabajar para ti y quitarte el peso de los hombros. Reporta de forma confidencial y deja que el sistema gestione la solución.' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-8 group">
                      <div className="text-3xl font-serif italic text-ediflow-primary/30 font-bold group-hover:text-ediflow-primary transition-colors">{item.step}</div>
                      <div className="space-y-2">
                        <h4 className="text-lg font-bold">{item.title}</h4>
                        <p className="text-gray-500 font-medium text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </section>

        {/* 5. Footer CTA: Solución Ediflow */}
        <section className="px-6 max-w-4xl mx-auto text-center space-y-12">
           <div className="space-y-6">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">La Solución Ediflow</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Tu tranquilidad a un clic.</h2>
              <div className="text-gray-500 font-light text-lg max-w-2xl mx-auto leading-relaxed space-y-4 text-left md:text-center">
                <p>
                    Creemos que la tecnología debe protegerte. Si tu edificio cuenta con nuestro ecosistema, ya no tienes que bajar a conserjería en pijama ni enviar correos que nadie responde.
                </p>
                <p>
                    Simplemente abres tu portal de Ediflow, seleccionas <span className="font-bold text-gray-900 dark:text-white">"Reportar Incidente"</span>, adjuntas tu evidencia y listo. Nuestro sistema enruta tu queja de forma confidencial y en tiempo real.
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                    Nosotros absorbemos el conflicto, gestionamos el papeleo y aplicamos las reglas. Tú solo ocúpate de recuperar tu silencio.
                </p>
              </div>
           </div>

           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <button 
              onClick={() => onNavigate && onNavigate('Landing')}
              className="w-full sm:w-auto bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all text-lg"
             >
               Descubrir Ediflow
               <ArrowRight size={18} />
             </button>
             <button 
              onClick={() => onNavigate && onNavigate('BookDemo')}
              className="w-full sm:w-auto bg-white dark:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 px-10 py-5 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-white/10 transition-all text-lg"
             >
               Agendar Demo
             </button>
           </div>

           <div className="pt-20">
              <div className="inline-flex flex-col items-center gap-4 bg-blue-50 dark:bg-blue-900/10 p-10 rounded-[3rem] border border-blue-100 dark:border-blue-800/30">
                 <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-ediflow-primary" />
                    ¿Tu edificio usa Ediflow?
                 </p>
                 <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-sm italic">
                    "Reporta este incidente en 1 clic aquí de forma anónima."
                 </p>
                 <button 
                  onClick={() => onNavigate && onNavigate('Login')}
                  className="bg-ediflow-primary text-white px-8 py-3 rounded-xl font-bold text-sm tracking-tight hover:scale-105 active:scale-95 transition-all shadow-lg"
                 >
                   Reportar en mi Portal
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

export default NoiseGuidePage;
