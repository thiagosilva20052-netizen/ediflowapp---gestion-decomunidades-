import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';

// More exhaustive and realistic questions for OS10
const OS10_QUESTIONS = [
  {
    id: 1,
    question: "¿Cuál es el principal objetivo de un Guardia de Seguridad según la normativa vigente en Chile?",
    options: [
      "Detener delincuentes y procesarlos judicialmente.",
      "Portar armas de fuego para disuadir delitos de alta connotación.",
      "Protección de personas y bienes dentro de un recinto privado delimitado.",
      "Controlar el orden público en plazas y parques municipales."
    ],
    answer: 2
  },
  {
    id: 2,
    question: "Ante un amago de incendio en el edificio, ¿cuál es la primera acción protocolar?",
    options: [
      "Evacuar el edificio inmediatamente sin dar aviso.",
      "Dar la alarma interna, evaluar riesgos y llamar a Bomberos.",
      "Combatir el fuego con cualquier elemento a mano, priorizando la propiedad.",
      "Contactar al administrador para solicitar permiso de uso de extintores."
    ],
    answer: 1
  },
  {
    id: 3,
    question: "La Ley 21.442, que rige la Copropiedad Inmobiliaria, establece que el Plan de Emergencia debe:",
    options: [
      "Ser guardado bajo llave solo para conocimiento del Comité.",
      "Estar actualizado y ser conocido por todo el personal de seguridad y residentes.",
      "Ser redactado únicamente por Carabineros de Chile.",
      "Tener una vigencia máxima de 10 años sin necesidad de simulacros."
    ],
    answer: 1
  },
  {
    id: 4,
    question: "¿Qué autoridad técnica supervisa y fiscaliza a las empresas de Seguridad Privada en Chile?",
    options: [
      "Ministerio de Vivienda y Urbanismo (MINVU).",
      "Prefectura de Seguridad Privada OS10 de Carabineros.",
      "Policía de Investigaciones (PDI).",
      "Seremi de Salud."
    ],
    answer: 1
  },
  {
    id: 5,
    question: "¿Qué elemento es OBLIGATORIO para un conserje con acreditación OS10 vigente durante su turno?",
    options: [
      "Bastón retráctil y gas pimienta.",
      "Radio de comunicación de largo alcance.",
      "Credencial de identificación a la vista emitida por la autoridad fiscalizadora.",
      "Chaleco antibalas de nivel 3."
    ],
    answer: 2
  },
  {
    id: 6,
    question: "En una detención por flagrancia, el guardia de seguridad debe:",
    options: [
      "Interrogar al sospechoso para obtener una confesión.",
      "Retener al individuo y entregarlo inmediatamente a Carabineros o PDI.",
      "Trasladar al sospechoso en su vehículo particular a la comisaría.",
      "Aplicar medidas punitivas si el sospechoso se resiste."
    ],
    answer: 1
  },
  {
    id: 7,
    question: "¿Cuál es la vigencia actual del curso de formación para Guardias de Seguridad/Conserjes?",
    options: [
      "5 años.",
      "1 año.",
      "3 años.",
      "Es de por vida si no se cometen faltas."
    ],
    answer: 2
  },
  {
    id: 8,
    question: "Ante una emergencia médica de un residente en espacios comunes, el guardia debe primero:",
    options: [
      "Realizar maniobras quirúrgicas básicas.",
      "Verificar estado de consciencia y llamar al servicio de urgencias local.",
      "Mover al paciente inmediatamente a su departamento.",
      "Esperar a que llegue el Administrador para tomar contacto con la familia."
    ],
    answer: 1
  },
  {
    id: 9,
    question: "El 'Libro de Novedades' tiene carácter de:",
    options: [
      "Borrador informal para anotaciones personales.",
      "Documento oficial y comprobable ante fiscalizaciones de la autoridad.",
      "Diario de vida del conserje.",
      "Registro exclusivo para el aseo del edificio."
    ],
    answer: 1
  },
  {
    id: 10,
    question: "¿Está permitido que un guardia de seguridad realice rondas fuera del perímetro del recinto privado?",
    options: [
      "Sí, para expandir la zona de seguridad del barrio.",
      "No, sus servicios solo pueden prestarse dentro del recinto autorizado.",
      "Solo si va acompañado de un perro guardián.",
      "Solo en horario nocturno para evitar robos de autos en la calle."
    ],
    answer: 1
  },
  {
    id: 11,
    question: "La 'Legítima Defensa' en el ejercicio de la seguridad privada exige:",
    options: [
      "Que el agresor sea de menor tamaño que el guardia.",
      "Agresión ilegítima, necesidad racional del medio empleado y falta de provocación suficiente.",
      "Que el guardia haya disparado primero para advertir.",
      "Permiso escrito previo del administrador de la comunidad."
    ],
    answer: 1
  },
  {
    id: 12,
    question: "¿Cuál es el color oficial de la baliza que pueden usar los vehículos de seguridad privada en Chile?",
    options: [
      "Azul (exclusiva de la policía).",
      "Roja (exclusiva de bomberos).",
      "Ambar/Amarilla.",
      "Verde."
    ],
    answer: 2
  },
  {
    id: 13,
    question: "Si un residente se niega a registrarse al ingresar, el conserje debe:",
    options: [
      "Negar el acceso físicamente usando la fuerza.",
      "Pedir amablemente la identificación y, si persiste la negativa, informar al administrador y registrar el incidente.",
      "Llamar al GOPE inmediatamente.",
      "Ignorar el protocolo para evitar conflictos con los vecinos."
    ],
    answer: 1
  },
  {
    id: 14,
    question: "¿Qué documento debe portar obligatoriamente un conserje para trabajar legalmente como tal?",
    options: [
      "Certificado de Antecedentes para fines especiales solamente.",
      "Directiva de Funcionamiento aprobada por el OS10.",
      "Título universitario de administración.",
      "Licencia de conducir clase B."
    ],
    answer: 1
  },
  {
    id: 15,
    question: "En caso de sismo de alta intensidad, la prioridad del personal de seguridad es:",
    options: [
      "Correr hacia la zona de seguridad antes que los residentes.",
      "Mantener la calma, abrir vías de evacuación y guiar a los residentes a zonas seguras (Puntos de Encuentro).",
      "Bloquear los ascensores y esperar instrucciones por radio.",
      "Verificar que las cámaras sigan grabando el evento."
    ],
    answer: 1
  }
];

interface Props {
  onNavigate?: (screen: any) => void;
}

const OS10SimulatorPublic: React.FC<Props> = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'quiz' | 'results'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const startQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScore(0);
    setCurrentStep('quiz');
  };

  const handleOptionSelect = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQuestionIndex < OS10_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      let finalScore = 0;
      newAnswers.forEach((ans, idx) => {
        if (ans === OS10_QUESTIONS[idx].answer) finalScore++;
      });
      setScore(finalScore);
      setCurrentStep('results');
    }
  };

  const shareOnWhatsApp = () => {
    const total = OS10_QUESTIONS.length;
    const percentage = Math.round((score / total) * 100);
    const message = `¡Acabo de sacar ${score}/${total} (${percentage}%) en el simulador del Test OS10 de Carabineros! 👮‍♂️🔥 Mide tu nivel gratis y sin dar correos aquí: ${window.location.host}/recursos/simulador-os10. Potenciado por Ediflow.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="bg-white dark:bg-[#050505] min-h-screen text-gray-900 dark:text-white font-sans selection:bg-blue-50 selection:text-blue-900 flex flex-col transition-colors duration-500">
      
      {/* Mini Nav */}
      <nav className="fixed top-0 inset-x-0 h-16 border-b border-gray-100 dark:border-white/5 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md z-50 flex items-center justify-between px-6 lg:px-16">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate && onNavigate('Landing')}>
            <Logo variant="horizontal" className="scale-[0.8] origin-left" />
        </div>
        <div className="flex items-center gap-4">
            <ThemeToggle />
            <button 
              onClick={() => onNavigate && onNavigate('Landing')}
              className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Volver
            </button>
        </div>
      </nav>

      <main className="flex-1 pt-32 pb-20 px-6 max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {currentStep === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-12"
            >
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                  Herramienta Gratuita
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight">
                  Simulador Test OS10. <br/>
                  <span className="font-serif italic font-normal text-ediflow-primary">Práctica oficial y gratuita.</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
                  Responde preguntas reales basadas en el temario de Carabineros, sin registros ni correos. Mide tu nivel profesional en 5 minutos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {[
                  { icon: 'description', title: 'Temario Real', desc: 'Preguntas sobre leyes y protocolos.' },
                  { icon: 'speed', title: 'Cero Fricción', desc: 'Empieza a practicar al instante.' },
                  { icon: 'share', title: 'Modo Viral', desc: 'Desafía a tus colegas de turno.' },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-6 rounded-3xl group hover:bg-white dark:hover:bg-white/10 transition-all shadow-sm">
                     <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 mb-4">{item.icon}</span>
                     <h3 className="font-bold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                     <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={startQuiz}
                className="w-full md:w-auto bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-ediflow-primary dark:hover:bg-ediflow-primary dark:hover:text-white transition-all shadow-xl active:scale-95"
              >
                Comenzar Práctica
              </button>
            </motion.div>
          )}

          {currentStep === 'quiz' && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Pregunta {currentQuestionIndex + 1} de {OS10_QUESTIONS.length}</span>
                    <span className="text-[10px] font-bold text-gray-400">{Math.round((currentQuestionIndex / OS10_QUESTIONS.length) * 100)}%</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                        {OS10_QUESTIONS[currentQuestionIndex].question}
                  </h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {OS10_QUESTIONS[currentQuestionIndex].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    className="w-full text-left p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-white dark:hover:bg-white/10 transition-all group flex items-start gap-4 shadow-sm"
                  >
                    <span className="w-8 h-8 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center text-xs font-bold shrink-0 group-hover:bg-blue-600 dark:group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">{option}</span>
                  </button>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex + 1) / OS10_QUESTIONS.length) * 100}%` }}
                  className="h-full bg-ediflow-primary"
                />
              </div>
            </motion.div>
          )}

          {currentStep === 'results' && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-12"
            >
              <div className="relative">
                 <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-900/10 blur-[100px] pointer-events-none rounded-full"></div>
                 <div className="relative z-10 space-y-6">
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 dark:text-white">
                      {score === OS10_QUESTIONS.length ? '¡Felicidades!' : score >= OS10_QUESTIONS.length * 0.7 ? '¡Buen trabajo!' : 'Sigue practicando'}
                    </h2>
                    <div className="inline-block bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 p-10 rounded-[3rem] shadow-2xl">
                       <span className="text-gray-400 dark:text-gray-500 font-bold block text-[10px] uppercase tracking-[0.2em] mb-4">Puntaje Final</span>
                       <div className="flex items-center justify-center gap-4">
                          <span className="text-7xl md:text-9xl font-serif italic text-ediflow-primary leading-none">{score}</span>
                          <span className="text-3xl text-gray-200 dark:text-gray-800 font-light translate-y-4">/</span>
                          <span className="text-5xl text-gray-900 dark:text-white font-bold translate-y-4">{OS10_QUESTIONS.length}</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-8">
                <p className="text-gray-600 dark:text-gray-400 font-light max-w-md mx-auto text-lg">
                  {score >= OS10_QUESTIONS.length * 0.7 
                    ? "Tu nivel de conocimientos técnicos es alto. Estás listo para certificar tu comunidad." 
                    : "No te preocupes, el examen oficial requiere práctica constante. Repasa e intenta de nuevo."}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button 
                    onClick={shareOnWhatsApp}
                    className="w-full sm:w-auto bg-[#25D366] text-white px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(37,211,102,0.3)] hover:scale-105 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined">share</span>
                    Desafiar a un colega (WhatsApp)
                  </button>
                  <button 
                    onClick={() => setCurrentStep('intro')}
                    className="w-full sm:w-auto bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white px-10 py-5 rounded-2xl font-bold border border-gray-100 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-all"
                  >
                    Repetir Test
                  </button>
                </div>
              </div>

              {/* Upsell to Ediflow */}
              <div className="pt-24 border-t border-gray-100 dark:border-white/5">
                <div className="inline-flex flex-col items-center gap-4">
                   <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Crecimiento Profesional</p>
                   <button 
                    onClick={() => onNavigate && onNavigate('Landing')}
                    className="text-gray-900 dark:text-white hover:text-ediflow-primary transition-colors flex flex-col items-center gap-2 group"
                   >
                     <span className="font-bold text-xl tracking-tight">¿Tu conserjería aún trabaja en papel?</span>
                     <span className="text-sm font-medium text-gray-500 group-hover:text-ediflow-primary transition-colors flex items-center gap-2">
                        Conoce el software para comunidades Ediflow 
                        <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                     </span>
                   </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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

export default OS10SimulatorPublic;
