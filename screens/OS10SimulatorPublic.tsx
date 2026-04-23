import React, { useState, useEffect } from 'react';
import { Logo } from '../components/Logo';

interface Props {
  onNavigate?: (screen: any) => void;
}

const mockQuestions = [
  {
    id: 1,
    text: "Si durante su ronda perimetral detecta a una persona escalando la reja norte de la comunidad, el protocolo inmediato es:",
    options: [
      { id: 'A', text: "Grabar con celular en silencio y observar sin intervenir." },
      { id: 'B', text: "Activar alarma comunitaria silenciosa y llamar inmediatamente al Plan Cuadrante." },
      { id: 'C', text: "Enfrentar físicamente al intruso para defender el recinto." }
    ],
    correct: 'B'
  },
  {
    id: 2,
    text: "Según la normativa vigente de Seguridad Privada, ¿cuál es la vigencia de la credencial OS10 para conserjes?",
    options: [
      { id: 'A', text: "1 año desde su emisión." },
      { id: 'B', text: "3 años renovables." },
      { id: 'C', text: "No tiene fecha de vencimiento." }
    ],
    correct: 'B'
  },
  {
    id: 3,
    text: "¿Cuál es la jurisdicción legal de un Conserje o Guardia de Seguridad Privada dentro del condominio?",
    options: [
      { id: 'A', text: "Únicamente en los espacios comunes y límites perimetrales del recinto." },
      { id: 'B', text: "Puede ingresar a los departamentos si sospecha de un delito." },
      { id: 'C', text: "Extiende su jurisdicción hasta 100 metros fuera de la comunidad." }
    ],
    correct: 'A'
  }
];

export const OS10SimulatorPublic: React.FC<Props> = ({ onNavigate }) => {
  const [step, setStep] = useState<'start' | 'questions' | 'success'>('start');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);

  useEffect(() => {
    document.title = "Simulador Test OS10 Gratis para Conserjes | Ediflow";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Practica para la certificación OS10 con el simulador 100% gratuito de Ediflow. Sin registros, resultados inmediatos.");
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = "Practica para la certificación OS10 con el simulador 100% gratuito de Ediflow. Sin registros, resultados inmediatos.";
      document.head.appendChild(meta);
    }
    window.scrollTo(0, 0);
  }, []);

  const currentQ = mockQuestions[currentQIndex];

  const handleSelect = (optionId: string) => {
    if (selectedAnswers[currentQ.id]) return; // Already answered

    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: optionId }));
    
    if (optionId === currentQ.correct) {
      setScore(prev => prev + 1);
    }
    
    // Short delay before next question
    setTimeout(() => {
      if (currentQIndex < mockQuestions.length - 1) {
        setCurrentQIndex(currentQIndex + 1);
      } else {
        setStep('success');
      }
    }, 1500);
  };

  const reset = () => {
    setStep('start');
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setScore(0);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-gray-900 font-sans selection:bg-ediflow-primary/30">
      <header className="bg-white border-b border-gray-200 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
        <div className="cursor-pointer" onClick={() => onNavigate && onNavigate('Landing')}>
          <Logo variant="horizontal" color="#0A0A0A" className="scale-[0.8] origin-left" />
        </div>
        <button 
          onClick={() => onNavigate && onNavigate('Register')}
          className="text-sm font-medium text-ediflow-primary hover:text-blue-700 transition-colors"
        >
          Probar Ediflow
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-24">
        {step === 'start' && (
          <div className="text-center animate-fade-in flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-widest mb-6">
              Simulador Gratuito
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-gray-900">
              Domina el test OS10 en minutos, sin registros ni correos molestos.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 font-light max-w-2xl mx-auto mb-12">
              El simulador gratuito más rápido de Chile. En solo 3 pasos: entra, responde casos reales y obtén tu puntaje al instante. Diseñado para que asegures tu certificación.
            </p>
            <button 
              onClick={() => setStep('questions')}
              className="bg-ediflow-primary hover:bg-[#009EE3] text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              ⚡ Iniciar Simulador Gratuito
            </button>
          </div>
        )}

        {step === 'questions' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-sm text-gray-500 font-medium uppercase tracking-widest">
                Pregunta {currentQIndex + 1} de {mockQuestions.length}
              </h4>
              <span className="text-sm font-bold text-ediflow-primary">
                {Math.round(((currentQIndex) / mockQuestions.length) * 100)}% Completado
              </span>
            </div>
            
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-10">
               <div 
                  className="h-full bg-ediflow-primary transition-all duration-500" 
                  style={{ width: `${((currentQIndex) / mockQuestions.length) * 100}%` }}
               ></div>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-sm mb-8">
              <p className="text-2xl text-gray-900 font-medium leading-relaxed mb-8">
                {currentQ.text}
              </p>

              <div className="space-y-4">
                {currentQ.options.map((opt) => {
                  const isAnswered = !!selectedAnswers[currentQ.id];
                  const isSelected = selectedAnswers[currentQ.id] === opt.id;
                  const isCorrect = opt.id === currentQ.correct;
                  
                  let buttonClass = 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100';
                  let iconClass = 'border-gray-300';
                  
                  if (isAnswered) {
                    if (isSelected && isCorrect) {
                       buttonClass = 'bg-green-50 border-green-500 text-green-800 shadow-sm';
                       iconClass = 'bg-green-500 border-green-500 text-white';
                    } else if (isSelected && !isCorrect) {
                       buttonClass = 'bg-red-50 border-red-500 text-red-800 shadow-sm';
                       iconClass = 'bg-red-500 border-red-500 text-white';
                    } else if (!isSelected && isCorrect) {
                       buttonClass = 'bg-green-50/50 border-green-500/50 text-green-800/80';
                       iconClass = 'border-green-500/50 text-green-800/80';
                    } else {
                       buttonClass = 'bg-gray-50 border-gray-200 text-gray-400 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect(opt.id)}
                      disabled={isAnswered}
                      className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-start gap-4 ${buttonClass}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border-2 mt-0.5 transition-colors ${iconClass}`}>
                        <span className="text-sm font-bold">{opt.id}</span>
                      </div>
                      <span className="leading-relaxed text-lg font-medium">{opt.text}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="animate-fade-in max-w-2xl mx-auto text-center">
            <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-16 shadow-sm mb-12">
               <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                 <span className="material-symbols-outlined text-green-600 text-5xl">verified</span>
               </div>
               <h2 className="text-4xl font-extrabold text-gray-900 mb-4">¡Test Finalizado!</h2>
               <p className="text-xl text-gray-600 mb-8">
                 Tu calificación es: <strong className="text-gray-900">{score} de {mockQuestions.length}</strong> aciertos.
               </p>
               <div className="flex justify-center gap-4">
                 <button 
                    onClick={reset}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-4 rounded-xl font-bold transition-colors"
                 >
                   Reintentar Test
                 </button>
               </div>
            </div>
            
            {/* Subtle Upsell Banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative">
               <div className="absolute top-0 right-0 w-64 h-64 bg-ediflow-primary/10 rounded-full blur-3xl opacity-50"></div>
               <div className="text-left relative z-10">
                 <h3 className="text-lg font-bold text-blue-900 mb-1">¿Tu edificio aún usa libros de papel?</h3>
                 <p className="text-blue-700 text-sm">Organiza tu conserjería, encomiendas y visitas 100% digital.</p>
               </div>
               <button 
                  onClick={() => onNavigate && onNavigate('Landing')}
                  className="bg-ediflow-primary hover:bg-[#009EE3] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all whitespace-nowrap relative z-10 hover:-translate-y-0.5"
               >
                 Conoce Ediflow
               </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OS10SimulatorPublic;
