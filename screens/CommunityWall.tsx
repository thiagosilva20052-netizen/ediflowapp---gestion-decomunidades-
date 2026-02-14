import React from 'react';
import { ScreenName } from '../App';

interface Props {
  navigate: (screen: ScreenName) => void;
}

const CommunityWall: React.FC<Props> = ({ navigate }) => {
  return (
    <div className="flex flex-col min-h-full bg-[#111618]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#111618]/95 backdrop-blur-md border-b border-[#3b4b54] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <button onClick={() => navigate('ConciergeDashboard')} className="text-white p-1 active:scale-90 transition-all">
                <span className="material-symbols-outlined text-[28px]">menu</span>
            </button>
            <h2 className="text-xl font-bold tracking-tight text-white">Ediflow</h2>
        </div>
        <button className="relative p-2 text-white bg-[#1c2327] rounded-full active:scale-90 transition-all">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-[#111618]"></span>
        </button>
      </header>

      <main className="flex-1 pb-24">
        {/* Stories */}
        <section className="pt-4 pb-2 border-b border-[#3b4b54] bg-[#1c2327]/30">
            <div className="px-4 mb-3">
                <h3 className="text-xs font-bold text-[#9db0b9] uppercase tracking-wider">Anuncios Oficiales</h3>
            </div>
            <div className="flex overflow-x-auto no-scrollbar px-4 gap-4 pb-4">
                <StoryItem 
                    title="Urgente" 
                    subtitle="Corte Agua" 
                    image="https://images.unsplash.com/photo-1544979140-54e63f588694?auto=format&fit=crop&q=80&w=200" 
                    urgent 
                />
                <StoryItem 
                    title="Gastos" 
                    subtitle="Diciembre" 
                    image="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=200" 
                />
                <StoryItem 
                    title="Asamblea" 
                    subtitle="Reunión" 
                    image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=200" 
                />
                 <StoryItem 
                    title="Mantención" 
                    subtitle="Ascensores" 
                    image="https://images.unsplash.com/photo-1581092921461-eab62e97a782?auto=format&fit=crop&q=80&w=200" 
                />
            </div>
        </section>

        {/* Input */}
        <section className="p-4">
            <div className="flex gap-3 items-center bg-[#1c2327] p-3 rounded-2xl border border-[#3b4b54]">
                 <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" />
                 </div>
                 <input 
                    type="text" 
                    placeholder="¿Qué está pasando en el edificio?" 
                    className="flex-1 bg-transparent border-none text-white placeholder-gray-500 focus:ring-0"
                 />
                 <button className="bg-ediflow-primary text-black text-xs font-bold py-2 px-4 rounded-full hover:bg-yellow-400 active:scale-95 transition-all">
                    Publicar
                 </button>
            </div>
        </section>

        {/* Feed */}
        <div className="px-4 mb-2">
            <h3 className="text-xs font-bold text-[#9db0b9] uppercase tracking-wider">Actualizaciones</h3>
        </div>

        <div className="space-y-4 px-4">
            {/* Post 1 */}
            <article className="bg-[#1c2327] rounded-2xl border border-[#3b4b54] overflow-hidden">
                <div className="p-4 pb-2 flex items-center gap-3">
                    <div className="relative">
                        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" className="w-10 h-10 rounded-full border border-ediflow-primary p-0.5 object-cover" />
                        <span className="absolute -bottom-1 -right-1 bg-ediflow-primary text-black text-[9px] font-bold px-1.5 rounded-full">ADMIN</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white">Conserjería</h4>
                            <span className="text-xs text-gray-500">• 2h</span>
                        </div>
                        <p className="text-xs text-ediflow-primary font-medium">Aviso Operacional</p>
                    </div>
                </div>
                <div className="px-4 py-2">
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                        Se encontraron llaves en el hall central. Favor retirar en recepción verificando propiedad.
                    </p>
                    <div className="w-full h-48 rounded-xl bg-gray-800 overflow-hidden relative">
                         <img src="https://images.unsplash.com/photo-1582140428886-4448554972df?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover opacity-80" />
                    </div>
                </div>
                <div className="px-4 py-3 border-t border-[#3b4b54]/50 flex items-center justify-between text-gray-400">
                    <div className="flex gap-4 text-sm">
                        <button className="flex items-center gap-1 hover:text-white active:scale-105 active:text-red-500 transition-all"><span className="material-symbols-outlined text-[18px]">favorite</span> 2</button>
                        <button className="flex items-center gap-1 hover:text-white active:scale-105 transition-all"><span className="material-symbols-outlined text-[18px]">chat_bubble</span> Comentar</button>
                    </div>
                    <button className="active:scale-105 transition-all"><span className="material-symbols-outlined text-[18px]">share</span></button>
                </div>
            </article>

            {/* Post 2 */}
            <article className="bg-[#1c2327] rounded-2xl border border-[#3b4b54] overflow-hidden">
                <div className="p-4 pb-2 flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                         <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white">María González</h4>
                            <span className="text-xs text-gray-500">• 5h</span>
                        </div>
                        <p className="text-xs text-gray-500">Residente • Torre A</p>
                    </div>
                </div>
                <div className="px-4 py-2">
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                        ¡Felices Fiestas a todos los vecinos! 🎉 Espero que disfruten el fin de semana largo.
                    </p>
                </div>
                 <div className="px-4 py-3 border-t border-[#3b4b54]/50 flex items-center justify-between text-gray-400">
                    <div className="flex gap-4 text-sm">
                        <button className="flex items-center gap-1 text-red-500 active:scale-105 transition-all"><span className="material-symbols-outlined text-[18px] fill-current">favorite</span> 15</button>
                        <button className="flex items-center gap-1 hover:text-white active:scale-105 transition-all"><span className="material-symbols-outlined text-[18px]">chat_bubble</span> 3</button>
                    </div>
                </div>
            </article>
        </div>
      </main>

      <nav className="fixed bottom-0 w-full max-w-[420px] bg-[#1c2327] border-t border-[#3b4b54] flex justify-between items-center px-6 py-3 z-50">
        <NavButton icon="home" label="Muro" active />
        <NavButton icon="grid_view" label="Servicios" onClick={() => navigate('ResidentServices')} />
        <NavButton icon="chat" label="Chats" onClick={() => navigate('MessagesScreen')} />
        <NavButton icon="person" label="Perfil" onClick={() => navigate('UserProfile')} />
      </nav>
    </div>
  );
};

const StoryItem = ({ title, subtitle, image, urgent }: any) => (
    <div className="flex flex-col gap-2 w-20 shrink-0 cursor-pointer group active:scale-95 transition-all">
        <div className={`relative w-20 h-24 rounded-xl overflow-hidden p-0.5 ${urgent ? 'bg-red-500' : 'bg-[#3b4b54] group-hover:bg-ediflow-primary'} transition-colors`}>
            <div className="w-full h-full rounded-[10px] overflow-hidden relative">
                <img src={image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                {urgent && <div className="absolute bottom-1 left-1 bg-red-600 text-white text-[8px] font-bold px-1 rounded">URGENTE</div>}
            </div>
        </div>
        <p className="text-[10px] font-bold text-center text-gray-400 truncate leading-tight">{title}<br/>{subtitle}</p>
    </div>
);

const NavButton = ({ icon, label, active = false, onClick }: { icon: string, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 active:scale-90 transition-all ${active ? 'text-ediflow-primary' : 'text-[#9db0b9] hover:text-white'}`}>
    <span className={`material-symbols-outlined text-2xl ${active ? 'fill-current' : ''}`}>{icon}</span>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default CommunityWall;