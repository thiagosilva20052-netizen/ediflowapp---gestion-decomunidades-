import React, { useState, useEffect } from 'react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';

interface Props {
  onNavigate?: (screen: any) => void;
}

const BookDemoPage: React.FC<Props> = ({ onNavigate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Simulate video playback and calendar reveal
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress(p => {
          const newProgress = p + 1;
          if (newProgress >= 50 && !showCalendar) {
             setShowCalendar(true);
          }
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 100); // 10 seconds total simulated video for the sake of the demo
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress, showCalendar]);

  const handlePlayClick = () => {
    if (!isPlaying) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white font-sans selection:bg-ediflow-primary/10 selection:text-gray-900 min-h-screen flex flex-col transition-colors duration-300">
      
      {/* Minimal Header (Theater Mode Navigation) */}
      <header className="w-full py-6 px-6 md:px-12 lg:px-16 flex items-center justify-between border-b border-gray-100 dark:border-white/5 relative z-20">
        <button 
          onClick={() => onNavigate && onNavigate('Landing')}
          className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Volver al Inicio
        </button>
        <div className="absolute left-1/2 -translate-x-1/2">
          <Logo variant="horizontal" color="currentColor" className="scale-[0.7]" />
        </div>
        <div className="flex items-center gap-4">
           <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-16 flex flex-col items-center">
        
        {/* Copywriting */}
        <div className="text-center mb-12 space-y-6">
          <h1 className="text-3xl md:text-5xl font-light tracking-tight leading-tight text-gray-900 dark:text-white">
            Descubre cómo Ediflow elimina el caos de tu edificio en <i className="font-serif italic font-medium text-ediflow-primary">solo 5 minutos</i>.
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            Dale play al recorrido interactivo para ver a nuestra IA en acción. Si lo que ves resuelve tus problemas, elige una fecha en el calendario debajo para adaptar la plataforma a tu comunidad.
          </p>
        </div>

        {/* Video Player Mockup (Asynchronous Demo Funnel) */}
        <div className="w-full aspect-video bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl relative overflow-hidden group">
          {/* Faux Video Background/Thumbnail */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white dark:from-black via-gray-50 dark:via-[#0A0A0A] to-gray-100 dark:to-[#111] z-0 flex items-center justify-center opacity-40">
             {/* Abstract thumbnail graphic */}
             <div className="w-64 h-64 bg-ediflow-primary/10 rounded-full blur-[80px]"></div>
          </div>

          <div className="absolute inset-0 z-10 flex flex-col justify-between">
            {/* Top Bar for loom-style look */}
            <div className="w-full p-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                    <span className="material-symbols-outlined text-sm">person</span>
                 </div>
                 <span className="text-xs font-medium text-white drop-shadow-md">Demo Fundador - Ediflow 2026</span>
               </div>
               <div className="bg-black/50 backdrop-blur px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-gray-300">
                  {isPlaying ? `00:0${Math.floor(progress / 10)}` : "05:00"}
               </div>
            </div>

            {/* Huge Play Button */}
            <div className="flex-1 flex items-center justify-center">
               <button 
                 onClick={handlePlayClick}
                 className={`w-20 h-20 rounded-full bg-ediflow-primary text-black flex items-center justify-center shadow-[0_0_40px_rgba(0,174,239,0.3)] hover:scale-110 transition-transform ${isPlaying ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
               >
                 <span className="material-symbols-outlined text-4xl ml-1">play_arrow</span>
               </button>
            </div>

            {/* Custom Control Bar */}
            <div className="w-full p-4 flex items-center gap-4 bg-gradient-to-t from-black/80 to-transparent">
               <button onClick={handlePlayClick} className="text-white hover:text-ediflow-primary transition-colors">
                  <span className="material-symbols-outlined">{isPlaying ? 'pause' : 'play_arrow'}</span>
               </button>
               <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                 <div 
                    className="h-full bg-ediflow-primary relative" 
                    style={{ width: `${progress}%` }}
                 >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow blur-[1px]"></div>
                 </div>
               </div>
               <button className="text-white hover:text-ediflow-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">volume_up</span>
               </button>
               <button className="text-white hover:text-ediflow-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">fullscreen</span>
               </button>
            </div>
          </div>
        </div>
        
        {/* Helper text for impatient leads */}
        {!showCalendar && (
           <button 
             onClick={() => setShowCalendar(true)}
             className="mt-6 text-xs text-gray-500 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors underline decoration-gray-300 dark:decoration-white/20 underline-offset-4 animate-fade-in"
           >
             Ya conozco Ediflow, saltar video y agendar directamente.
           </button>
        )}

        {/* Calendar Widget (Smooth Fade-in) */}
        <div className={`w-full mt-16 transition-all duration-1000 ease-in-out ${showCalendar ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
          <div className="text-center mb-10">
             <h3 className="text-xl md:text-2xl font-light text-gray-900 dark:text-white mb-2">¿Viste el recorrido y estás listo para escalar?</h3>
             <p className="text-sm text-gray-600 dark:text-gray-400 font-light">Agenda tu sesión estratégica gratuita.</p>
          </div>

          {/* Adaptive Calendar UI Mockup (Calendly/SavvyCal Style) */}
          <div className="w-full max-w-3xl mx-auto bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 shadow-2xl relative">
             {/* Presenter Info */}
             <div className="md:w-1/3 flex flex-col border-b md:border-b-0 md:border-r border-gray-100 dark:border-white/5 pb-6 md:pb-0 md:pr-6">
                <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 mb-4 flex items-center justify-center overflow-hidden shrink-0">
                  <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-3xl">account_circle</span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-mono uppercase tracking-widest mb-1">Sesión Estratégica</p>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Demo de Ediflow</h4>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  30 min
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="material-symbols-outlined text-[16px]">videocam</span>
                  Google Meet
                </div>
                <div className="mt-auto pt-6 text-xs text-gray-400 dark:text-gray-600 font-light hidden md:block">
                  Conoceremos tu comunidad, te mostraremos cómo la IA automatiza tu carga de trabajo, y veremos si somos un match para implementarlo.
                </div>
             </div>

             {/* Date/Time Picker */}
             <div className="flex-1 flex flex-col">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Selecciona una fecha</h4>
                
                {/* Fake Calendar Grid */}
                <div className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/5 rounded-xl p-4 mb-6">
                   <div className="flex justify-between items-center mb-4">
                     <button className="w-8 h-8 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 flex items-center justify-center text-gray-400 transition-colors"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
                     <span className="text-sm font-medium text-gray-900 dark:text-white">Mayo 2026</span>
                     <button className="w-8 h-8 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 flex items-center justify-center text-gray-400 transition-colors"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
                   </div>
                   <div className="grid grid-cols-7 gap-1 text-center mb-2">
                     {['L','M','X','J','V','S','D'].map(day => <div key={day} className="text-[10px] uppercase text-gray-400 dark:text-gray-600">{day}</div>)}
                   </div>
                   <div className="grid grid-cols-7 gap-1 text-center">
                     {/* Empty cells */}
                     <div></div><div></div><div></div><div></div>
                     {/* Days */}
                     {[1,2,3,4,5,6,7,8,9,10,11,12].map(d => (
                       <button 
                         key={d} 
                         className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm transition-all focus:outline-none 
                            ${d === 8 ? 'bg-ediflow-primary/20 text-ediflow-primary border border-ediflow-primary/50 font-bold' 
                            : d < 4 ? 'text-gray-200 dark:text-gray-700 cursor-not-allowed' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-white/10'}`}
                       >
                         {d}
                       </button>
                     ))}
                   </div>
                </div>

                {/* Available Times for selected date */}
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                   {['09:00', '10:00', '11:30', '14:00', '16:00', '17:30'].map(t => (
                      <button key={t} className="w-full border border-ediflow-primary/30 text-ediflow-primary font-medium rounded-lg text-sm transition-all hover:bg-ediflow-primary hover:text-white dark:hover:text-black py-2.5">
                        {t}
                      </button>
                   ))}
                </div>
             </div>
          </div>
        </div>

      </main>

      {/* Retargeting Growth Tip Disclaimer (Visual only for instruction context) */}
      <div className="py-6 border-t border-white/5 bg-[#050505] text-center px-6">
         <p className="text-[10px] text-gray-600 max-w-2xl mx-auto uppercase tracking-widest font-mono">
            <strong>System Meta:</strong> Meta/LinkedIn Pixel tracks "Video_Play". If user drops before booking, they enter the invisible retargeting funnel with Case Study Ads.
         </p>
      </div>

    </div>
  );
};

export default BookDemoPage;
