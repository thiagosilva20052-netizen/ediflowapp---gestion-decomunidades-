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
                  className="w-10 h-10 mb-6 flex items-center justify-center rounded-xl bg-[#111] hover:bg-[#1A1A1A] active:scale-95 transition-all text-white border border-white/5"
              >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>

              <div className="mb-12">
                  <h2 className="text-[11px] md:text-xs font-semibold uppercase tracking-widest text-[#00AEEF] mb-2">Comunicaciones</h2>
                  <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white leading-tight">
                      Canales <span className="font-medium">Seguros</span>.
                  </h1>
                  <p className="text-gray-500 text-sm md:text-base mt-2 max-w-lg">
                      Conexión encriptada y directa con el equipo operativo de la comunidad. 
                  </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  {conciergeChat && (
                      <button 
                          onClick={() => setActiveChat(conciergeChat)}
                          className="flex flex-col text-left bg-[#111] p-8 rounded-[2rem] border border-white/5 hover:bg-[#141414] hover:border-[#00AEEF]/50 transition-all active:scale-[0.98] group relative overflow-hidden shadow-2xl"
                      >
                          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00AEEF]/5 rounded-full blur-[80px] group-hover:bg-[#00AEEF]/10 transition-colors pointer-events-none"></div>
                          
                          <div className="w-14 h-14 rounded-2xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center mb-16 relative z-10 transition-colors group-hover:border-[#00AEEF]/30 group-hover:bg-[#00AEEF]/10 group-hover:shadow-[0_0_20px_rgba(0,174,239,0.15)]">
                              <span className="material-symbols-outlined text-3xl text-gray-400 group-hover:text-[#00AEEF] transition-colors">support_agent</span>
                          </div>
                          <div className="relative z-10 flex-1 flex flex-col justify-end w-full">
                              <div className="flex items-center justify-between w-full mb-2">
                                <h3 className="text-white font-medium text-2xl tracking-tight">Conserjería</h3>
                                <span className="material-symbols-outlined text-white/20 group-hover:text-[#00AEEF] transition-colors">arrow_forward</span>
                              </div>
                              <p className="text-sm text-gray-500 tracking-wide">Visitas, paquetes y emergencias (24/7)</p>
                          </div>
                      </button>
                  )}

                  {adminChat && (
                      <button 
                          onClick={() => setActiveChat(adminChat)}
                          className="flex flex-col text-left bg-[#111] p-8 rounded-[2rem] border border-white/5 hover:bg-[#141414] hover:border-ediflow-primary/50 transition-all active:scale-[0.98] group relative overflow-hidden shadow-2xl"
                      >
                          <div className="absolute top-0 right-0 w-64 h-64 bg-ediflow-primary/5 rounded-full blur-[80px] group-hover:bg-ediflow-primary/10 transition-colors pointer-events-none"></div>

                          <div className="flex w-full justify-between items-start relative z-10 mb-16">
                            <div className="w-14 h-14 rounded-2xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center transition-colors group-hover:border-ediflow-primary/30 group-hover:bg-ediflow-primary/10 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                                <span className="material-symbols-outlined text-3xl text-gray-400 group-hover:text-ediflow-primary transition-colors">admin_panel_settings</span>
                            </div>
                            {adminChat.unread ? (
                                <div className="w-8 h-8 rounded-full bg-ediflow-primary text-black flex items-center justify-center text-sm font-bold shadow-[0_0_15px_rgba(168,85,247,0.6)] animate-pulse-soft">
                                    {adminChat.unread}
                                </div>
                            ) : null}
                          </div>

                          <div className="relative z-10 flex-1 flex flex-col justify-end w-full">
                              <div className="flex items-center justify-between w-full mb-2">
                                <h3 className="text-white font-medium text-2xl tracking-tight">Administración</h3>
                                <span className="material-symbols-outlined text-white/20 group-hover:text-ediflow-primary transition-colors">arrow_forward</span>
                              </div>
                              <p className="text-sm text-gray-500 tracking-wide">Facturación, reclamos y documentación</p>
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
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
                <div>
                  <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white leading-tight mb-2">
                      Comunicaciones.
                  </h1>
                  <p className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-[#00AEEF]">Centro de Operaciones</p>
                </div>
                
                <div className="w-full md:w-96 relative">
                    <span className="material-symbols-outlined absolute left-4 top-3.5 text-gray-500">search</span>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar residente, depto o área..." 
                        className="w-full bg-[#111] text-white rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-ediflow-primary border border-white/5 shadow-inner placeholder:text-gray-600 transition-shadow"
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
                              className={`flex items-center gap-5 p-4 rounded-2xl bg-[#0F0F0F] border hover:bg-[#141414] cursor-pointer active:scale-[0.99] transition-all
                                ${chat.unread ? 'border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]' : 'border-transparent'}`}
                          >
                              {/* Avatar & Status */}
                              <div className="relative shrink-0">
                                  {chat.icon ? (
                                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${chat.type === 'admin' ? 'bg-[#111] text-blue-400 border-white/5' : 'bg-[#111] text-[#00AEEF] border-white/5'}`}>
                                          <span className="material-symbols-outlined text-[24px]">{chat.icon}</span>
                                      </div>
                                  ) : (
                                      <img src={chat.avatar} className="w-14 h-14 rounded-2xl object-cover border border-white/5" />
                                  )}
                                  {chat.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-[#0F0F0F]"></div>}
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-center mb-1">
                                      <h3 className="text-white font-medium text-sm md:text-base tracking-tight truncate flex items-center gap-2">
                                          {chat.name} 
                                          {chat.depto && <span className="bg-white/10 text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-widest">DEPTO {chat.depto}</span>}
                                      </h3>
                                      <span className={`text-[10px] font-semibold tracking-widest uppercase ${chat.unread ? 'text-ediflow-primary' : 'text-gray-600'}`}>{chat.time}</span>
                                  </div>
                                  <p className={`text-xs md:text-sm truncate w-full pr-4 ${chat.unread ? 'text-gray-300 font-medium' : 'text-gray-500'}`}>{chat.lastMessage}</p>
                              </div>

                              {/* Indicators */}
                              {chat.unread ? (
                                  <div className="w-6 h-6 bg-ediflow-primary rounded-full flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                                      <span className="text-[10px] font-bold text-black">{chat.unread}</span>
                                  </div>
                              ) : (
                                  <span className="material-symbols-outlined text-gray-700 text-[20px] hidden md:block">chevron_right</span>
                              )}
                          </div>
                      ))
                  ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                          <div className="w-16 h-16 rounded-full bg-[#111] border border-white/5 flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-3xl text-gray-600">search_off</span>
                          </div>
                          <p className="text-gray-400 font-medium">No se encontraron resultados.</p>
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
              <div className="flex items-center gap-4 px-4 md:px-8 py-4 bg-[#0A0A0A]/90 backdrop-blur-2xl sticky top-0 z-30 border-b border-white/5">
                  <button 
                      onClick={handleBack}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#111] hover:bg-[#1A1A1A] active:scale-95 transition-all text-white border border-white/5"
                  >
                      <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                  </button>

                  <div className="relative shrink-0">
                      {activeChat.icon ? (
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-[#111] border border-white/5 text-white`}>
                              <span className="material-symbols-outlined text-[20px]">{activeChat.icon}</span>
                          </div>
                      ) : (
                          <img src={activeChat.avatar} className="w-10 h-10 rounded-xl object-cover border border-white/5" />
                      )}
                      {activeChat.online && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-[3px] border-[#0A0A0A]"></div>}
                  </div>

                  <div className="flex-1 min-w-0">
                      <h2 className="text-white font-medium text-sm md:text-base tracking-tight truncate flex items-center gap-2">
                        {activeChat.name}
                        {activeChat.type === 'admin' && <span className="material-symbols-outlined text-[14px] text-blue-400">verified</span>}
                      </h2>
                      <p className="text-[10px] font-semibold text-gray-500 tracking-widest uppercase truncate">
                          {activeChat.depto ? `Depto ${activeChat.depto}` : activeChat.type === 'admin' ? 'Soporte Global' : 'Base de Control'}
                      </p>
                  </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-[#0A0A0A]">
                  <div className="flex items-center justify-center my-6">
                      <span className="px-3 py-1 bg-[#111] border border-white/5 rounded-full text-[10px] uppercase tracking-widest font-semibold text-gray-600">Conexión Segura (Hoy)</span>
                  </div>

                  {messages.map((msg) => (
                      <div key={msg.id} className={`flex flex-col w-full ${msg.isMe ? 'items-end' : 'items-start'}`}>
                          <div className={`relative max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-3 text-sm md:text-base leading-relaxed ${
                              msg.isMe 
                                ? `${accentColor} border border-[transparent] rounded-tr-[4px]` 
                                : 'bg-[#141414] text-gray-200 border border-white/5 rounded-tl-[4px]'
                          }`}>
                              {msg.text}
                          </div>
                          <span className="text-[10px] font-semibold tracking-widest text-gray-600 mt-2 px-1">{msg.time}</span>
                      </div>
                  ))}
                  <div ref={messagesEndRef} className="h-4" />
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
              <div className="p-4 md:p-6 bg-[#0A0A0A] border-t border-white/5 flex gap-3 pb-safe">
                  <div className="flex-1 bg-[#111] rounded-2xl border border-white/10 flex items-end p-1.5 focus-within:border-gray-500 focus-within:bg-[#141414] transition-all shadow-inner">
                      <button className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-transparent text-gray-500 hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-[20px]">add</span>
                      </button>
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
                          className="flex-1 bg-transparent text-white text-sm px-2 py-3 max-h-32 outline-none resize-none no-scrollbar placeholder:text-gray-600 font-medium"
                          rows={1}
                      />
                      <button className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl text-gray-500 hover:text-white transition-colors mr-1">
                          <span className="material-symbols-outlined text-[20px]">mic</span>
                      </button>
                  </div>

                  <button 
                      onClick={() => handleSendMessage()}
                      disabled={!newMessage.trim()}
                      className={`w-[52px] h-[52px] shrink-0 flex items-center justify-center rounded-2xl transition-all active:scale-[0.95]
                        ${newMessage.trim() 
                          ? `${accentColor} shadow-[0_0_15px_rgba(168,85,247,0.3)]` 
                          : 'bg-[#111] text-gray-600 border border-white/5 cursor-not-allowed'}`}
                  >
                      <span className="material-symbols-outlined text-[20px] ml-1">send</span>
                  </button>
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
