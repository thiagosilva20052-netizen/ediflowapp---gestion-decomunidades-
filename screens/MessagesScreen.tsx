import React, { useState, useRef, useEffect } from 'react';
import { ScreenName } from '../App';
import { UserRole } from './LoginScreen';

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
        name: 'Administración',
        type: 'admin',
        lastMessage: 'Estimado, recuerde revisar bitácora.',
        time: '10:30 AM',
        unread: 1,
        icon: 'admin_panel_settings',
        online: true
    },
    {
        id: 'concierge_1',
        name: 'Conserjería (Turno Día)',
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
        lastMessage: '¿Llegó mi paquete de MercadoLibre?',
        time: '09:15 AM',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=100'
    },
    {
        id: 'res_805',
        name: 'Juan Pérez',
        type: 'resident',
        depto: '805',
        lastMessage: 'Gracias por recibir la correspondencia.',
        time: 'Ayer',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100'
    }
];

const MOCK_MESSAGES: Record<string, Message[]> = {
    'res_402': [
        { id: 'm1', text: 'Hola, buen día.', time: '09:10 AM', isMe: false },
        { id: 'm2', text: '¿Llegó mi paquete de MercadoLibre?', time: '09:15 AM', isMe: false },
    ],
    'admin_1': [
        { id: 'm1', text: 'Estimado residente, le recordamos el vencimiento de los gastos comunes.', time: 'Ayer', isMe: false },
        { id: 'm2', text: 'Estimado, recuerde revisar bitácora.', time: '10:30 AM', isMe: false },
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

  // PARETO: Get quick replies based on context
  const getQuickReplies = () => {
      if (role === 'resident' && activeChat?.type === 'concierge') {
          return ["Autorizo la visita", "Voy bajando a buscarlo", "Emergencia en el depto"];
      }
      if (role === 'resident' && activeChat?.type === 'admin') {
          return ["Duda sobre gasto común", "Solicito reserva de quincho", "Reportar problema en áreas comunes"];
      }
      if (role === 'concierge' && activeChat?.type === 'resident') {
          return ["Tiene una encomienda en recepción", "Su visita está esperando", "Por favor, contactar a administración"];
      }
      if (role === 'admin' && activeChat?.type === 'resident') {
          return ["Recordatorio de pago", "Aviso de corte de agua", "Respuesta a su solicitud"];
      }
      return [];
  };

  // PARETO: Resident Inbox (Only 2 options, no search, no filters)
  const renderResidentInbox = () => {
      const adminChat = ALL_MOCK_CHATS.find(c => c.type === 'admin');
      const conciergeChat = ALL_MOCK_CHATS.find(c => c.type === 'concierge');

      return (
          <div className="p-5 space-y-6 animate-fade-in-up">
              <div>
                  <h2 className="text-white font-bold text-xl mb-1">Canales Oficiales</h2>
                  <p className="text-gray-400 text-sm mb-6">Comunícate directamente con el personal del edificio.</p>
                  
                  <div className="space-y-4">
                      {conciergeChat && (
                          <button 
                              onClick={() => setActiveChat(conciergeChat)}
                              className="w-full bg-gradient-to-r from-[#141414] to-[#0A0A0A] border border-ediflow-primary/20 p-5 rounded-3xl flex items-center gap-5 hover:bg-[#1F1F1F] active:scale-[0.98] transition-all group"
                          >
                              <div className="w-14 h-14 rounded-2xl bg-ediflow-primary/10 text-ediflow-primary flex items-center justify-center group-hover:bg-ediflow-primary group-hover:text-black transition-colors">
                                  <span className="material-symbols-outlined text-3xl">support_agent</span>
                              </div>
                              <div className="text-left flex-1">
                                  <h3 className="text-white font-bold text-lg">Conserjería 24/7</h3>
                                  <p className="text-xs text-gray-400 mt-1">Visitas, paquetes, emergencias</p>
                              </div>
                              <span className="material-symbols-outlined text-gray-500">chevron_right</span>
                          </button>
                      )}

                      {adminChat && (
                          <button 
                              onClick={() => setActiveChat(adminChat)}
                              className="w-full bg-gradient-to-r from-[#141414] to-[#0A0A0A] border border-blue-500/20 p-5 rounded-3xl flex items-center gap-5 hover:bg-[#1F1F1F] active:scale-[0.98] transition-all group"
                          >
                              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                  <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
                              </div>
                              <div className="text-left flex-1">
                                  <h3 className="text-white font-bold text-lg">Administración</h3>
                                  <p className="text-xs text-gray-400 mt-1">Gastos comunes, reclamos, reservas</p>
                              </div>
                              {adminChat.unread ? (
                                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                                      {adminChat.unread}
                                  </div>
                              ) : (
                                  <span className="material-symbols-outlined text-gray-500">chevron_right</span>
                              )}
                          </button>
                      )}
                  </div>
              </div>
          </div>
      );
  };

  // Staff Inbox (Admin & Concierge)
  const renderStaffInbox = () => {
      const allowedTypes = role === 'admin' ? ['resident', 'concierge'] : ['resident', 'admin'];
      const filteredChats = ALL_MOCK_CHATS.filter(chat => 
          allowedTypes.includes(chat.type) && 
          (chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || (chat.depto && chat.depto.includes(searchQuery)))
      );

      return (
          <div className="flex-1 flex flex-col">
              <div className="px-5 py-4">
                  <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-3.5 text-gray-500">search</span>
                      <input 
                          type="text" 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Buscar residente o depto..." 
                          className="w-full bg-[#141414] text-white rounded-xl py-3.5 pl-12 pr-4 text-sm focus:ring-1 focus:ring-ediflow-primary border border-white/5"
                      />
                  </div>
              </div>

              <div className="px-5 pb-24 space-y-2 overflow-y-auto">
                  {filteredChats.length > 0 ? (
                      filteredChats.map(chat => (
                          <div 
                              key={chat.id}
                              onClick={() => setActiveChat(chat)}
                              className="flex items-center gap-4 p-3 rounded-2xl bg-[#141414] border border-white/5 hover:bg-[#1F1F1F] cursor-pointer active:scale-[0.98] transition-all"
                          >
                              <div className="relative">
                                  {chat.icon ? (
                                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${chat.type === 'admin' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-ediflow-primary/10 text-ediflow-primary border-ediflow-primary/20'}`}>
                                          <span className="material-symbols-outlined">{chat.icon}</span>
                                      </div>
                                  ) : (
                                      <img src={chat.avatar} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                                  )}
                                  {chat.online && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-[2.5px] border-[#141414]"></div>}
                              </div>
                              <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-center mb-1">
                                      <h3 className="text-white font-bold text-sm truncate">
                                          {chat.name} 
                                          {chat.depto && <span className="text-ediflow-primary ml-1 text-xs font-normal">({chat.depto})</span>}
                                      </h3>
                                      <span className={`text-[10px] whitespace-nowrap ${chat.unread ? 'text-ediflow-primary font-bold' : 'text-gray-500'}`}>{chat.time}</span>
                                  </div>
                                  <p className={`text-xs truncate ${chat.unread ? 'text-white font-medium' : 'text-gray-400'}`}>{chat.lastMessage}</p>
                              </div>
                              {chat.unread && (
                                  <div className="w-5 h-5 bg-ediflow-primary rounded-full flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                                      <span className="text-[10px] font-bold text-black">{chat.unread}</span>
                                  </div>
                              )}
                          </div>
                      ))
                  ) : (
                      <div className="text-center py-10">
                          <span className="material-symbols-outlined text-4xl text-gray-600 mb-2">chat_bubble_outline</span>
                          <p className="text-gray-400 text-sm">No se encontraron chats</p>
                      </div>
                  )}
              </div>
          </div>
      );
  };

  if (activeChat) {
      const quickReplies = getQuickReplies();
      return (
          <div className="flex flex-col min-h-full bg-[#0A0A0A]">
              {/* Chat Header */}
              <div className="flex items-center gap-3 px-4 py-3 bg-[#141414] sticky top-0 z-30 border-b border-white/5 shadow-md">
                  <button 
                      onClick={handleBack}
                      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-90 transition-all text-white"
                  >
                      <span className="material-symbols-outlined">arrow_back</span>
                  </button>
                  <div className="relative">
                      {activeChat.icon ? (
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeChat.type === 'admin' ? 'bg-blue-500/20 text-blue-400' : 'bg-ediflow-primary/20 text-ediflow-primary'}`}>
                              <span className="material-symbols-outlined">{activeChat.icon}</span>
                          </div>
                      ) : (
                          <img src={activeChat.avatar} className="w-10 h-10 rounded-full object-cover" />
                      )}
                      {activeChat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#141414]"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                      <h2 className="text-white font-bold text-sm truncate">{activeChat.name}</h2>
                      <p className="text-[10px] text-gray-400 truncate">
                          {activeChat.depto ? `Depto ${activeChat.depto}` : activeChat.type === 'admin' ? 'Administración' : 'Conserjería'}
                          {activeChat.online ? ' • En línea' : ''}
                      </p>
                  </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0A0A0A]">
                  <div className="text-center text-xs text-gray-500 my-4">Hoy</div>
                  {messages.map((msg) => (
                      <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                          <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                              msg.isMe 
                                ? 'bg-ediflow-primary text-black rounded-tr-sm' 
                                : 'bg-[#1F1F1F] text-white rounded-tl-sm border border-white/5'
                          }`}>
                              {msg.text}
                          </div>
                          <span className="text-[10px] text-gray-500 mt-1 px-1">{msg.time}</span>
                      </div>
                  ))}
                  <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              {quickReplies.length > 0 && (
                  <div className="px-2 py-2 bg-[#141414] border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
                      {quickReplies.map((reply, idx) => (
                          <button 
                              key={idx}
                              onClick={() => handleSendMessage(reply)}
                              className="whitespace-nowrap bg-[#1F1F1F] hover:bg-[#292929] text-xs text-gray-300 px-3 py-1.5 rounded-full border border-white/5 active:scale-95 transition-all"
                          >
                              {reply}
                          </button>
                      ))}
                  </div>
              )}

              {/* Chat Input */}
              <div className="p-3 bg-[#141414] border-t border-white/5 flex items-end gap-2">
                  <button className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                      <span className="material-symbols-outlined">add_circle</span>
                  </button>
                  <div className="flex-1 bg-[#0A0A0A] rounded-2xl border border-white/5 flex items-center pr-1 focus-within:border-ediflow-primary/50 transition-colors">
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
                          className="w-full bg-transparent text-white text-sm px-4 py-3 max-h-32 outline-none resize-none no-scrollbar"
                          rows={1}
                      />
                      <button className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full text-gray-400 hover:text-white transition-all">
                          <span className="material-symbols-outlined text-[20px]">mic</span>
                      </button>
                  </div>
                  <button 
                      onClick={() => handleSendMessage()}
                      disabled={!newMessage.trim()}
                      className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-ediflow-primary text-black disabled:opacity-50 disabled:bg-gray-700 disabled:text-gray-500 transition-all active:scale-90"
                  >
                      <span className="material-symbols-outlined text-[20px]">send</span>
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="flex flex-col min-h-full bg-[#0A0A0A]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4 bg-[#0A0A0A] sticky top-0 z-30 border-b border-white/5">
        <div className="flex items-center gap-3">
            <button 
                onClick={handleBack}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#141414] hover:bg-[#1F1F1F] active:scale-90 transition-all text-white border border-white/5"
            >
                <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-xl font-bold tracking-tight text-white">
                {role === 'resident' ? 'Centro de Ayuda' : 'Mensajería'}
            </h1>
        </div>
      </div>

      {role === 'resident' ? renderResidentInbox() : renderStaffInbox()}
    </div>
  );
};

export default MessagesScreen;
