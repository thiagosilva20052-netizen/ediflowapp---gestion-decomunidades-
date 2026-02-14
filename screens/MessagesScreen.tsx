import React from 'react';
import { ScreenName } from '../App';

interface Props {
  navigate: (screen: ScreenName) => void;
}

const MessagesScreen: React.FC<Props> = ({ navigate }) => {
  return (
    <div className="flex flex-col min-h-full bg-[#101c22]">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 pt-6 pb-4 bg-[#101c22] sticky top-0 z-30 border-b border-white/5">
        <button 
            onClick={() => navigate('ConciergeDashboard')}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-90 transition-all text-white"
        >
            <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold tracking-tight text-white">Mensajería</h1>
        <div className="ml-auto w-8"></div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Search */}
        <div className="px-5 py-4">
            <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-500 text-[20px]">search</span>
                <input 
                    type="text" 
                    placeholder="Buscar chat..." 
                    className="w-full bg-[#1c262c] text-white rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-ediflow-primary border-none"
                />
            </div>
        </div>

        {/* Chats List */}
        <div className="px-5 pb-24 space-y-4">
            <ChatItem 
                name="Administración" 
                message="Estimado, recuerde revisar bitácora." 
                time="10:30 AM" 
                unread={2} 
                avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100"
                online
            />
            <ChatItem 
                name="Depto 402 (Familia Soto)" 
                message="¿Llegó mi paquete de MercadoLibre?" 
                time="09:15 AM" 
                avatar="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=100"
            />
             <ChatItem 
                name="Seguridad" 
                message="Ronda nocturna completada sin novedad." 
                time="Ayer" 
                avatar="local_police"
                isIcon
            />
             <ChatItem 
                name="Depto 805" 
                message="Gracias por recibir la correspondencia." 
                time="Ayer" 
                avatar="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100"
            />
        </div>
      </div>
    </div>
  );
};

const ChatItem = ({ name, message, time, unread, avatar, isIcon, online }: any) => (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer active:scale-[0.98] transition-all">
        <div className="relative">
            {isIcon ? (
                <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <span className="material-symbols-outlined">{avatar}</span>
                </div>
            ) : (
                <img src={avatar} className="w-12 h-12 rounded-full object-cover" />
            )}
            {online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#101c22]"></div>}
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-0.5">
                <h3 className="text-white font-bold text-sm truncate">{name}</h3>
                <span className="text-[10px] text-gray-500 whitespace-nowrap">{time}</span>
            </div>
            <p className={`text-xs truncate ${unread ? 'text-white font-medium' : 'text-gray-400'}`}>{message}</p>
        </div>
        {unread && (
            <div className="w-5 h-5 bg-ediflow-primary rounded-full flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-black">{unread}</span>
            </div>
        )}
    </div>
);

export default MessagesScreen;