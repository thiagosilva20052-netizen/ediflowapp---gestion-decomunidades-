import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenName } from '../App';

interface Props {
  navigate: (screen: ScreenName) => void;
}

type TemplateType = 'egreso' | 'emision' | 'pago' | 'morosidad';

const FinanceCommunicationsPage: React.FC<Props> = ({ navigate }) => {
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>('emision');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const templates = {
    emision: {
      id: 'emision',
      title: 'Emisión de Gasto Común',
      trigger: 'Después del Prorrateo Mensual',
      subject: 'Tu Gasto Común de Marzo 2026 ya está disponible',
      content: 'Hola {Nombre},\n\nEl detalle de tu Gasto Común correspondiente al mes de Marzo 2026 para la unidad {Unidad} ya está listo.\n\nTotal a pagar: {Monto}\nVencimiento: 05 de Abril, 2026\n\nRecuerda que ahora puedes revisar el respaldo de cada factura directamente en la app.',
      color: 'blue'
    },
    pago: {
      id: 'pago',
      title: 'Confirmación de Pago',
      trigger: 'Tras Conciliación Automática (IA)',
      subject: '¡Hemos recibido tu pago!',
      content: 'Hola {Nombre},\n\nHemos confirmado exitosamente el pago de {Monto} para tu unidad {Unidad}.\n\nTu saldo actual es $0. ¡Gracias por mantenerte al día y contribuir a nuestra comunidad!',
      color: 'purple'
    },
    morosidad: {
      id: 'morosidad',
      title: 'Aviso de Morosidad',
      trigger: 'Automático a los 5 días de atraso',
      subject: 'Aviso amigable: Saldo pendiente en tu unidad',
      content: 'Hola {Nombre},\n\nEsperamos que estés muy bien. Te escribimos para recordarte que tu unidad {Unidad} presenta un saldo pendiente de {Monto}.\n\nPara evitar el cálculo de intereses o cortes de servicio, te invitamos a regularizar este monto a la brevedad. Si ya pagaste, por favor ignora este mensaje.',
      color: 'red'
    },
    egreso: {
      id: 'egreso',
      title: 'Transparencia de Egresos',
      trigger: 'Solo para gastos > $1.000.000',
      subject: 'Transparencia: Nuevo Mantenimiento de Ascensores',
      content: 'Estimada Comunidad,\n\nEn pro de la transparencia, les informamos que se ha registrado un nuevo gasto extraordinario por {Monto} correspondiente a {Proveedor}.\n\nPueden revisar la factura y el detalle técnico ingresando a la sección de Transparencia en su app Ediflow.',
      color: 'emerald'
    }
  };

  const activeData = templates[activeTemplate];

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white font-sans overflow-hidden relative">
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-12 left-1/2 z-50 bg-emerald-500 text-black px-6 py-3 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] font-bold text-sm flex items-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="px-6 md:px-12 pt-12 pb-6 flex items-center justify-between sticky top-0 z-30 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate('ManageExpenses')}
              className="w-12 h-12 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all shadow-lg"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Comunicaciones <span className="font-serif italic font-normal text-gray-400">Automatizadas</span></h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px]">outgoing_mail</span>
                Flujos de Correos a Residentes
              </p>
            </div>
        </div>
        <div className="hidden md:flex">
             <button 
                onClick={() => showToast('Configuración guardada exitosamente')}
                className="bg-white text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
             >
                Guardar Cambios
             </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 md:px-12 py-10 max-w-7xl mx-auto w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Sidebar: Triggers */}
           <div className="lg:col-span-4 space-y-4">
              <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] pl-2 mb-4">Eventos del Flujo</h2>
              
              {Object.values(templates).map((tpl) => (
                <button 
                  key={tpl.id}
                  onClick={() => setActiveTemplate(tpl.id as TemplateType)}
                  className={`w-full text-left p-6 rounded-[2rem] border transition-all relative overflow-hidden group ${
                    activeTemplate === tpl.id 
                      ? `bg-[#111] border-${tpl.color}-500/50 shadow-[0_0_30px_rgba(var(--color-${tpl.color}-500),0.1)]` 
                      : 'bg-[#0A0A0A] border-white/5 hover:bg-[#111]'
                  }`}
                >
                  {activeTemplate === tpl.id && (
                     <div className={`absolute top-0 right-0 w-32 h-32 bg-${tpl.color}-500/10 blur-[40px] rounded-full pointer-events-none`}></div>
                  )}
                  <div className="flex items-center gap-4 relative z-10">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                       activeTemplate === tpl.id ? `bg-${tpl.color}-500/20 text-${tpl.color}-400` : 'bg-white/5 text-gray-500'
                     }`}>
                        <span className="material-symbols-outlined">
                           {tpl.id === 'emision' ? 'receipt_long' : tpl.id === 'pago' ? 'task_alt' : tpl.id === 'morosidad' ? 'warning' : 'campaign'}
                        </span>
                     </div>
                     <div>
                        <h3 className={`font-bold ${activeTemplate === tpl.id ? 'text-white' : 'text-gray-400'}`}>{tpl.title}</h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-medium">{tpl.trigger}</p>
                     </div>
                  </div>
                </button>
              ))}
           </div>

           {/* Content: Editor & Preview */}
           <div className="lg:col-span-8 space-y-8">
              
              <div className="bg-[#111] p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative">
                  <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                     <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-400">edit_document</span>
                        Configuración de la Plantilla
                     </h2>
                     <div className="flex items-center gap-2">
                        <span className="bg-white/10 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-sm">Variables Disponibles: {'{Nombre}'}, {'{Unidad}'}, {'{Monto}'}</span>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Asunto del Correo</label>
                        <input 
                          type="text" 
                          defaultValue={activeData.subject}
                          className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Cuerpo del Mensaje</label>
                        <textarea 
                          defaultValue={activeData.content}
                          rows={6}
                          className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-white/30 transition-colors resize-none leading-relaxed"
                        />
                     </div>
                  </div>
              </div>

              {/* Email Preview */}
              <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl text-black relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                 
                 <div className="max-w-xl mx-auto">
                    <div className="flex items-center justify-center mb-8">
                       <span className="font-serif italic font-bold text-3xl tracking-tighter">Ediflow</span>
                    </div>
                    
                    <h1 className="text-2xl font-bold mb-6 tracking-tight">{activeData.subject}</h1>
                    
                    <div className="space-y-4 text-gray-800 leading-relaxed font-medium text-base mb-8 whitespace-pre-wrap">
                       {activeData.content.replace('{Nombre}', 'Juan Pérez').replace('{Unidad}', 'Dpto 101').replace('{Monto}', '$125.000').replace('{Proveedor}', 'Otis S.A.')}
                    </div>

                    {activeTemplate === 'emision' && (
                       <button className="w-full bg-black text-white rounded-xl py-4 font-bold tracking-wide hover:bg-gray-800 transition-colors mb-8">
                          Pagar $125.000 Ahora
                       </button>
                    )}

                    <div className="border-t border-gray-200 pt-6 text-center">
                       <p className="text-xs text-gray-500">Este es un mensaje automático de tu comunidad administrativa.</p>
                       <p className="text-xs text-gray-400 mt-1">Impulsado por Ediflow</p>
                    </div>
                 </div>
              </div>

           </div>
        </div>
      </main>
    </div>
  );
};

export default FinanceCommunicationsPage;
