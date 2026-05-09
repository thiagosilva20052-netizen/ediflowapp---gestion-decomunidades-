import React, { useState, useRef, useEffect } from 'react';
import { ScreenName } from '../App';
import { UserRole } from '../src/types';

interface Props {
  navigate: (screen: ScreenName) => void;
  role: UserRole;
}

type ChatContact = {
    id: string;
    name: string;
    type: 'admin' | 'resident' | 'concierge';
    depto?: string;
    avatar?: string;
    icon?: string;
    online?: boolean;
    unread?: number;
    lastMessage: string;
    time: string;
};

type Message = {
    id: string;
    text: string;
    time: string;
    isMe: boolean;
};

const ALL_MOCK_CHATS: ChatContact[] = [
    {
        id: 'admin_1',
        name: 'Administración Global',
        type: 'admin',
        lastMessage: 'Información sobre la próxima asamblea.',
        time: '10:30 AM',
        unread: 1,
        icon: 'admin_panel_settings',
        online: true
    },
    {
        id: 'concierge_1',
        name: 'Conserjería Principal',
        type: 'concierge',
        lastMessage: 'Ronda nocturna completada sin novedad.',
        time: 'Ayer',
        icon: 'support_agent',
        online: true
    },
    {
        id: 'res_402',
        name: 'Familia Soto',
        type: 'resident',
        depto: '402',
        lastMessage: '¿Llegó mi encomienda?',
        time: '09:15 AM',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=100'
    },
    {
        id: 'res_805',
        name: 'Juan Pérez',
        type: 'resident',
        depto: '805',
        lastMessage: 'Solicito reserva del salón multiuso.',
        time: 'Ayer',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100'
    }
];

const MOCK_MESSAGES: Record<string, Message[]> = {
    'res_402': [
        { id: 'm1', text: 'Hola, buen día. Soy del 402.', time: '09:10 AM', isMe: false },
        { id: 'm2', text: '¿Llegó mi encomienda?', time: '09:15 AM', isMe: false },
    ],
    'admin_1': [
        { id: 'm1', text: 'Estimado residente, le recordamos el vencimiento de los gastos comunes.', time: 'Ayer', isMe: false },
        { id: 'm2', text: 'Información sobre la próxima asamblea.', time: '10:30 AM', isMe: false },
    ]
};

const MessagesScreen: React.FC<Props> = ({ navigate, role }) => {
  const [activeChat, setActiveChat] = useState<ChatContact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if (activeChat) {
          setMessages(MOCK_MESSAGES[activeChat.id] || []);
      }
  }, [activeChat]);

  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleBack = () => {
    if (activeChat) {
        setActiveChat(null);
    } else {
        if (role === 'admin') navigate('AdminDashboard');
        else if (role === 'concierge') navigate('ConciergeDashboard');
        else navigate('ResidentServices');
    }
  };

  const handleSendMessage = (text: string = newMessage) => {
      if (!text.trim() || !activeChat) return;
      
      const newMsg: Message = {
          id: Date.now().toString(),
          text: text.trim(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: true
      };
      
      setMessages([...messages, newMsg]);
      setNewMessage('');
  };

  const getQuickReplies = () => {
      if (role === 'resident' && activeChat?.type === 'concierge') {
          return ["Autorizo la visita", "Voy bajando", "Solicitar Asistencia"];
      }
      if (role === 'resident' && activeChat?.type === 'admin') {
          return ["Duda Gasto Común", "Reserva de Áreas", "Reportar Problema"];
      }
      if (role === 'concierge' && activeChat?.type === 'resident') {
          return ["Encomienda en recepción", "Visita esperando", "Favor contactar admin"];
      }
      if (role === 'admin' && activeChat?.type === 'resident') {
          return ["Recordatorio de Pago", "Aviso Mantenimiento", "Respuesta Solicitud"];
      }
      return [];
  };

  // Resident View: Crystal clear channels
  const renderResidentInbox = () => {
      const adminChat = ALL_MOCK_CHATS.find(c => c.type === 'admin');
      const conciergeChat = ALL_MOCK_CHATS.find(c => c.type === 'concierge');

      return (
          <div className="flex-1 w-full max-w-4xl mx-auto px-6 md:px-12 py-8 animate-fade-in-up">
              {/* Back button strictly for mobile or custom exits */}
              <button 
                  onClick={handleBack}
                  className="w-10 h-10 mb-6 flex items-center justify-center rounded-xl bg-[#111] hover:bg-[#1A1A1A] active:scale-95 transition-all text-gray-400 hover:text-white border border-white/5 shadow-sm group"
              >
                  <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
              </button>

              <div className="mb-12 relative">
                  <div className="absolute -top-10 -left-10 w-48 h-48 bg-[#00AEEF]/10 rounded-full blur-[80px] pointer-events-none"></div>
                  <h2 className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.2em] text-[#00AEEF] mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">forum</span>
                    Comunicaciones
                  </h2>
                  <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white leading-tight">
                      Canales <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00AEEF]">Seguros</span>.
                  </h1>
                  <p className="text-gray-400 text-sm md:text-base mt-4 max-w-lg leading-relaxed mix-blend-plus-lighter">
                      Conexión encriptada y directa con el equipo operativo de la comunidad. 
                  </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full relative z-10">
                  {conciergeChat && (
                      <button 
                          onClick={() => setActiveChat(conciergeChat)}
                          className="flex flex-col text-left bg-[#111] p-8 rounded-[2rem] border border-white/5 hover:bg-[#141414] hover:border-[#00AEEF]/50 transition-all active:scale-[0.98] group relative overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(0,174,239,0.15)]"
                      >
                          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00AEEF]/5 rounded-full blur-[80px] group-hover:bg-[#00AEEF]/15 transition-colors pointer-events-none"></div>
                          
                          <div className="w-14 h-14 rounded-[1.25rem] bg-[#0A0A0A] border border-white/10 flex items-center justify-center mb-16 relative z-10 transition-all group-hover:border-[#00AEEF]/40 group-hover:bg-[#00AEEF]/10 group-hover:shadow-[inset_0_0_20px_rgba(0,174,239,0.2)]">
                              <span className="material-symbols-outlined text-3xl text-gray-400 group-hover:text-[#00AEEF] transition-colors">support_agent</span>
                          </div>
                          <div className="relative z-10 flex-1 flex flex-col justify-end w-full">
                              <div className="flex items-center justify-between w-full mb-3">
                                <h3 className="text-white font-medium text-2xl tracking-tight">Conserjería</h3>
                                <div className="w-8 h-8 rounded-full bg-[#0A0A0A] border border-white/5 flex items-center justify-center text-gray-600 group-hover:bg-white group-hover:text-black group-hover:border-transparent transition-all">
                                   <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-400 font-medium tracking-wide leading-relaxed">Visitas, paquetes y emergencias (24/7)</p>
                          </div>
                      </button>
                  )}

                  {adminChat && (
                      <button 
                          onClick={() => setActiveChat(adminChat)}
                          className="flex flex-col text-left bg-[#111] p-8 rounded-[2rem] border border-white/5 hover:bg-[#141414] hover:border-ediflow-primary/50 transition-all active:scale-[0.98] group relative overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]"
                      >
                          <div className="absolute top-0 right-0 w-64 h-64 bg-ediflow-primary/5 rounded-full blur-[80px] group-hover:bg-ediflow-primary/15 transition-colors pointer-events-none"></div>

                          <div className="flex w-full justify-between items-start relative z-10 mb-16">
                            <div className="w-14 h-14 rounded-[1.25rem] bg-[#0A0A0A] border border-white/10 flex items-center justify-center transition-all group-hover:border-ediflow-primary/40 group-hover:bg-ediflow-primary/10 group-hover:shadow-[inset_0_0_20px_rgba(168,85,247,0.2)]">
                                <span className="material-symbols-outlined text-3xl text-gray-400 group-hover:text-ediflow-primary transition-colors">admin_panel_settings</span>
                            </div>
                            {adminChat.unread ? (
                                <div className="w-8 h-8 rounded-full bg-ediflow-primary text-black flex items-center justify-center text-sm font-bold shadow-[0_0_20px_rgba(168,85,247,0.8)] animate-pulse-soft border border-black">
                                    {adminChat.unread}
                                </div>
                            ) : null}
                          </div>

                          <div className="relative z-10 flex-1 flex flex-col justify-end w-full">
                              <div className="flex items-center justify-between w-full mb-3">
                                <h3 className="text-white font-medium text-2xl tracking-tight">Administración</h3>
                                <div className="w-8 h-8 rounded-full bg-[#0A0A0A] border border-white/5 flex items-center justify-center text-gray-600 group-hover:bg-white group-hover:text-black group-hover:border-transparent transition-all">
                                   <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-400 font-medium tracking-wide leading-relaxed">Facturación, reclamos y documentación</p>
                          </div>
                      </button>
                  )}
              </div>
          </div>
      );
  };

  // Staff View: High-density, fast-action inbox
  const renderStaffInbox = () => {
      const allowedTypes = role === 'admin' ? ['resident', 'concierge'] : ['resident', 'admin'];
      const filteredChats = ALL_MOCK_CHATS.filter(chat => 
          allowedTypes.includes(chat.type) && 
          (chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || (chat.depto && chat.depto.includes(searchQuery)))
      );

      return (
          <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto px-6 py-6 md:py-10">
              
              <button 
                  onClick={handleBack}
                  className="w-10 h-10 mb-4 flex items-center justify-center rounded-xl bg-[#111] hover:bg-[#1A1A1A] active:scale-95 transition-all text-white border border-white/5"
              >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>

              {/* Header Box */}
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 relative">
                 <div className="absolute -top-20 -left-20 w-48 h-48 bg-ediflow-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="relative z-10">
                  <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white leading-tight mb-3">
                      Comunicaciones.
                  </h1>
                  <p className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-ediflow-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">headset_mic</span>
                    Centro de Operaciones
                  </p>
                </div>
                
                <div className="w-full md:w-96 relative z-10 group">
                    <span className="material-symbols-outlined absolute left-4 top-3.5 text-gray-500 group-focus-within:text-ediflow-primary transition-colors">search</span>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar residente, depto o área..." 
                        className="w-full bg-[#111] text-white rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-ediflow-primary focus:border-ediflow-primary/50 border border-white/5 shadow-inner placeholder:text-gray-600 transition-all hover:border-white/10"
                    />
                </div>
              </div>

              {/* Chat List - Bento Grid Style List */}
              <div className="flex flex-col gap-3 pb-24 overflow-y-auto w-full">
                  {filteredChats.length > 0 ? (
                      filteredChats.map((chat, idx) => (
                          <div 
                              key={chat.id}
                              onClick={() => setActiveChat(chat)}
                              className={`flex items-center gap-5 p-4 rounded-2xl bg-[#0A0A0A] border hover:bg-[#111] cursor-pointer active:scale-[0.99] transition-all group overflow-hidden relative
                                ${chat.unread ? 'border-ediflow-primary/30 shadow-[0_0_20px_rgba(168,85,247,0.1)]' : 'border-white/5 hover:border-white/10'}`}
                          >
                              {/* Hover background effect */}
                              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 opacity-0 group-hover:opacity-100 blur-[40px] transition-opacity pointer-events-none"></div>

                              {/* Avatar & Status */}
                              <div className="relative shrink-0 z-10">
                                  {chat.icon ? (
                                      <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center border shadow-inner ${chat.type === 'admin' ? 'bg-[#141414] text-blue-400 border-white/5' : 'bg-[#141414] text-[#00AEEF] border-white/5'}`}>
                                          <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">{chat.icon}</span>
                                      </div>
                                  ) : (
                                      <img src={chat.avatar} className="w-14 h-14 rounded-[1.25rem] object-cover border border-white/5 shadow-inner" />
                                  )}
                                  {chat.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-[3px] border-[#0A0A0A] shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>}
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0 z-10">
                                  <div className="flex justify-between items-center mb-1.5">
                                      <h3 className={`text-sm md:text-base tracking-tight truncate flex items-center gap-2 ${chat.unread ? 'text-white font-semibold' : 'text-gray-300 font-medium'}`}>
                                          {chat.name} 
                                          {chat.depto && <span className="bg-[#141414] border border-white/10 text-gray-400 px-2.5 py-0.5 rounded-md text-[9px] font-bold tracking-[0.15em] uppercase">Dep. {chat.depto}</span>}
                                      </h3>
                                      <span className={`text-[10px] font-bold tracking-widest uppercase ${chat.unread ? 'text-ediflow-primary' : 'text-gray-600'}`}>{chat.time}</span>
                                  </div>
                                  <p className={`text-xs md:text-sm truncate w-full pr-4 ${chat.unread ? 'text-white font-medium' : 'text-gray-500'}`}>{chat.lastMessage}</p>
                              </div>

                              {/* Indicators */}
                              <div className="z-10">
                                {chat.unread ? (
                                    <div className="w-6 h-6 bg-ediflow-primary rounded-full flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-black">
                                        <span className="text-[10px] font-bold text-black">{chat.unread}</span>
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full border border-transparent group-hover:border-white/10 flex items-center justify-center transition-all bg-transparent group-hover:bg-[#1A1A1A]">
                                        <span className="material-symbols-outlined text-gray-700 text-[18px] group-hover:text-white transition-colors">chevron_right</span>
                                    </div>
                                )}
                              </div>
                          </div>
                      ))
                  ) : (
                      <div className="flex flex-col items-center justify-center py-24 text-center bg-[#111] rounded-[2rem] border border-dashed border-white/10 mx-2 mt-4">
                          <div className="w-20 h-20 rounded-full bg-[#0A0A0A] border border-white/5 flex items-center justify-center mb-6 shadow-inner">
                            <span className="material-symbols-outlined text-4xl text-gray-600">search_off</span>
                          </div>
                          <p className="text-gray-300 font-medium text-lg mb-2">No se encontraron resultados.</p>
                          <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold max-w-xs mx-auto">Revisa los términos de búsqueda e intenta nuevamente.</p>
                      </div>
                  )}
              </div>
          </div>
      );
  };

  // Active Chat interface - Immersive Glassmorphism
  if (activeChat) {
      const quickReplies = getQuickReplies();
      // Role specific accent colors
      const accentColor = role === 'resident' 
          ? (activeChat.type === 'admin' ? 'bg-ediflow-primary text-black' : 'bg-[#00AEEF] text-black') 
          : 'bg-ediflow-primary text-black';
      
      const borderAccent = role === 'resident' 
          ? (activeChat.type === 'admin' ? 'border-ediflow-primary/30 text-ediflow-primary hover:bg-ediflow-primary/10' : 'border-[#00AEEF]/30 text-[#00AEEF] hover:bg-[#00AEEF]/10')
          : 'border-ediflow-primary/30 text-ediflow-primary hover:bg-ediflow-primary/10';

      return (
          <div className="flex flex-col h-full bg-[#0A0A0A] relative z-50">
              {/* Premium Chat Header */}
              <div className="flex items-center gap-4 px-6 md:px-8 py-5 bg-[#0A0A0A]/90 backdrop-blur-3xl sticky top-0 z-30 border-b border-white/5 shadow-sm">
                  <button 
                      onClick={handleBack}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#111] hover:bg-[#1A1A1A] active:scale-95 transition-all text-gray-400 hover:text-white border border-white/5 shadow-sm group"
                  >
                      <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                  </button>

                  <div className="relative shrink-0 ml-2">
                      {activeChat.icon ? (
                          <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center bg-[#111] border border-white/5 shadow-inner ${activeChat.type === 'admin' ? 'text-blue-400' : 'text-[#00AEEF]'}`}>
                              <span className="material-symbols-outlined text-[24px]">{activeChat.icon}</span>
                          </div>
                      ) : (
                          <img src={activeChat.avatar} className="w-12 h-12 rounded-[1.25rem] object-cover border border-white/5 shadow-inner" />
                      )}
                      {activeChat.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-[3px] border-[#0A0A0A] shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center ml-1">
                      <h2 className="text-white font-medium text-base md:text-lg tracking-tight truncate flex items-center gap-2">
                        {activeChat.name}
                        {activeChat.type === 'admin' && <span className="material-symbols-outlined text-[16px] text-blue-400">verified</span>}
                      </h2>
                      <p className="text-[10px] font-bold text-gray-500 tracking-[0.15em] uppercase truncate mt-0.5">
                          {activeChat.depto ? `Depto ${activeChat.depto}` : activeChat.type === 'admin' ? 'Soporte Global' : 'Base de Control'}
                      </p>
                  </div>
                  
                  {/* Optional Right Action (e.g., info or call) */}
                  <button className="w-10 h-10 rounded-full bg-transparent flex items-center justify-center text-gray-600 hover:text-white hover:bg-white/5 transition-colors">
                     <span className="material-symbols-outlined text-[22px]">more_vert</span>
                  </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-[#0A0A0A] relative">
                  {/* Subtle Background Pattern/Glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.02] via-transparent to-transparent pointer-events-none"></div>

                  <div className="flex items-center justify-center my-8 relative z-10">
                      <span className="px-4 py-1.5 bg-[#141414] border border-white/10 rounded-full text-[9px] uppercase tracking-[0.2em] font-bold text-gray-500 shadow-sm flex items-center gap-1.5">
                         <span className="material-symbols-outlined text-[12px]">lock</span> Conexión Segura (Hoy)
                      </span>
                  </div>

                  <div className="relative z-10 space-y-6 flex flex-col justify-end min-h-[50%]">
                      {messages.map((msg) => (
                          <div key={msg.id} className={`flex flex-col w-full ${msg.isMe ? 'items-end' : 'items-start'} animate-fade-in-up`}>
                              <div className={`relative max-w-[85%] md:max-w-[65%] rounded-2xl px-5 py-3.5 text-sm md:text-base leading-relaxed shadow-md ${
                                  msg.isMe 
                                    ? `${accentColor} border ${role === 'resident' && activeChat.type !== 'admin' ? 'border-[#0089bd]' : 'border-ediflow-primary/80'} rounded-tr-sm` 
                                    : 'bg-[#141414] text-gray-200 border border-white/10 rounded-tl-sm'
                              }`}>
                                  {msg.text}
                              </div>
                              <div className={`flex items-center justify-end gap-1 mt-1.5 px-1 ${msg.isMe ? 'text-right' : 'text-left'}`}>
                                  <span className="text-[10px] font-bold tracking-widest text-gray-600">{msg.time}</span>
                                  {msg.isMe && <span className={`material-symbols-outlined text-[14px] ${role === 'resident' && activeChat.type === 'admin' ? 'text-ediflow-primary' : 'text-[#00AEEF]'}`}>done_all</span>}
                              </div>
                          </div>
                      ))}
                      <div ref={messagesEndRef} className="h-4" />
                  </div>
              </div>

              {/* Quick Replies - Glassy pills */}
              {quickReplies.length > 0 && (
                  <div className="px-4 py-3 bg-gradient-to-t from-[#0A0A0A] to-transparent flex gap-3 overflow-x-auto no-scrollbar pb-2">
                      {quickReplies.map((reply, idx) => (
                          <button 
                              key={idx}
                              onClick={() => handleSendMessage(reply)}
                              className={`whitespace-nowrap bg-[#111] text-xs font-semibold px-4 py-2.5 rounded-full border border-white/5 hover:${borderAccent} active:scale-95 transition-all shadow-lg tracking-wide`}
                          >
                              {reply}
                          </button>
                      ))}
                  </div>
              )}

              {/* Sleek Input Tool */}
              <div className="p-4 md:p-6 bg-[#0A0A0A] border-t border-white/5 flex flex-col gap-3 pb-safe z-30 relative shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                  {/* Action Bar (Attachments, Photos) */}
                  <div className="flex items-center gap-4 px-2 mb-1">
                      <button className="text-gray-500 hover:text-white transition-colors active:scale-95 tooltip-trigger group flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[20px]">attach_file</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">Adjuntar</span>
                      </button>
                      <button className="text-gray-500 hover:text-white transition-colors active:scale-95 tooltip-trigger group flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[20px]">image</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">Galería</span>
                      </button>
                  </div>

                  <div className="flex gap-3">
                      <div className="flex-1 bg-[#111] rounded-2xl border border-white/10 flex items-end p-1 focus-within:border-white/30 focus-within:bg-[#141414] transition-all shadow-inner group">
                          <textarea 
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                      e.preventDefault();
                                      handleSendMessage();
                                  }
                              }}
                              placeholder="Escribe un mensaje..."
                              className="flex-1 bg-transparent text-white text-sm px-4 py-3.5 max-h-32 outline-none resize-none no-scrollbar placeholder:text-gray-600 font-medium"
                              rows={1}
                          />
                          <button className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl text-gray-500 hover:text-white focus:text-white transition-colors m-1">
                              <span className="material-symbols-outlined text-[20px]">mic</span>
                          </button>
                      </div>

                      <button 
                          onClick={() => handleSendMessage()}
                          disabled={!newMessage.trim()}
                          className={`w-14 h-14 shrink-0 flex items-center justify-center rounded-2xl transition-all active:scale-[0.95] ${
                              newMessage.trim() 
                                ? `${accentColor} shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:brightness-110` 
                                : 'bg-[#111] text-gray-600 border border-white/5 cursor-not-allowed'
                          }`}
                      >
                          <span className="material-symbols-outlined text-[24px] ml-1">send</span>
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="flex h-screen w-full bg-[#0A0A0A]">
      {role === 'resident' ? renderResidentInbox() : renderStaffInbox()}
    </div>
  );
};

export default MessagesScreen;
