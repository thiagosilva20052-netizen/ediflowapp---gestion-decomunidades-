import React, { useState, useEffect } from 'react';
import { ScreenName } from '../App';
import { UserRole } from '../src/types';
import { sendEmailNotification } from '../src/lib/email-service';
import { AnimatePresence, motion } from 'motion/react';
import { useAppContext } from '../src/context/AppContext';
import { supabase } from '../src/lib/supabase-client';

interface Props {
  navigate: (screen: ScreenName) => void;
  role: UserRole;
}

const CommunityWall: React.FC<Props> = ({ navigate, role }) => {
  const { currentTenant, currentUser } = useAppContext();
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [postType, setPostType] = useState<'info' | 'urgent' | 'event'>('info');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [reads, setReads] = useState<string[]>([]); // Array of read announcement IDs

  useEffect(() => {
    if (!currentTenant || !currentUser) return;

    const fetchAnnouncements = async () => {
      // Fetch announcements
      const { data } = await supabase
        .from('announcements')
        .select('*, profiles(name), announcement_reads:announcement_reads(count)')
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false });

      if (data) {
         setAnnouncements(data.map(ann => ({
           ...ann,
           readsCount: ann.announcement_reads?.[0]?.count || 0
         })));
      }

      // Fetch reads for current user
      const { data: readData } = await supabase
        .from('announcement_reads')
        .select('announcement_id')
        .eq('user_id', currentUser.id);

      if (readData) setReads(readData.map(r => r.announcement_id));
    };

    fetchAnnouncements();

    const channel = supabase.channel('public:announcements')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements', filter: `tenant_id=eq.${currentTenant.id}` }, payload => {
        fetchAnnouncements();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentTenant, currentUser]);

  const markAsRead = async (id: string) => {
    if (reads.includes(id) || !currentUser) return;
    setReads(prev => [...prev, id]); // optimistic
    await supabase.from('announcement_reads').insert({
      announcement_id: id,
      user_id: currentUser.id
    });
  };

  const handleBack = () => {
      if (role === 'admin') navigate('AdminDashboard');
      else if (role === 'concierge') navigate('ConciergeDashboard');
      else navigate('ResidentServices');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePublish = async () => {
    if (!title || !content || !currentTenant || !currentUser) {
      showToast('Asegúrate de llenar el título y contenido.');
      return;
    }
    setIsPublishing(true);
    try {
      const { error } = await supabase.from('announcements').insert({
        tenant_id: currentTenant.id,
        title,
        content,
        category: postType === 'info' ? 'informative' : postType,
        created_by: currentUser.id
      });
      if (error) throw error;
      
      await sendEmailNotification({
        to: 'thiagosilva20052@gmail.com', // Sending email to user for testing purposes
        subject: `[Seguify] Anuncio: ${title}`,
        text: `Se ha publicado un nuevo anuncio en tu comunidad.\n\nContenido:\n${content}\n\nTipo: ${postType}`,
      });
      showToast('Publicado con éxito y correos enviados a Resend.');
      setShowNewPostModal(false);
      setTitle('');
      setContent('');
    } catch (e) {
      console.error(e);
      showToast('Error al publicar el anuncio.');
    } finally {
      setIsPublishing(false);
    }
  };

  const primaryAccent = role === 'admin' ? 'ediflow-primary' : '[#00AEEF]';

  return (
    <div className="flex flex-col min-h-full bg-[#0A0A0A] font-sans selection:bg-white/10">
      
      {/* Immersive Header */}
      <header className="sticky top-0 z-30 bg-[#0A0A0A]/90 backdrop-blur-3xl border-b border-white/5 px-6 md:px-16 pt-8 md:pt-12 pb-6 lg:pb-8 flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-6">
                <button 
                    onClick={handleBack}
                    className="w-10 h-10 rounded-xl bg-[#111] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1A1A1A] active:scale-95 transition-all shadow-sm group relative"
                >
                    <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform relative z-10">arrow_back</span>
                </button>
                <div>
                     <h2 className="text-[10px] font-bold text-ediflow-primary uppercase tracking-[0.2em] mb-0.5">Tablero Oficial</h2>
                    <h1 className="text-lg md:text-xl font-medium text-white tracking-tight flex items-center gap-2">
                        Muro Comunitario
                    </h1>
                </div>
            </div>
            
            {role === 'admin' && (
                <button 
                    onClick={() => setShowNewPostModal(true)}
                    className="hidden md:flex items-center gap-2 bg-[#111] border border-white/5 text-gray-400 px-6 h-10 rounded-xl font-semibold text-xs uppercase tracking-widest hover:bg-ediflow-primary hover:text-black hover:border-transparent active:scale-95 transition-all group relative overflow-hidden"
                >
                    <span className="material-symbols-outlined text-[16px] group-hover:scale-110 transition-transform relative z-10">campaign</span>
                    Publicar Anuncio
                </button>
            )}
            {/* Mobile Action Button */}
            {role === 'admin' && (
                <button 
                    onClick={() => setShowNewPostModal(true)}
                    className="flex md:hidden w-10 h-10 items-center justify-center rounded-xl bg-[#111] border border-white/5 text-gray-400 hover:bg-ediflow-primary hover:text-black hover:border-transparent transition-all shadow-lg active:scale-95 group relative overflow-hidden"
                >
                    <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform relative z-10">campaign</span>
                </button>
            )}
      </header>

      <main className="flex-1 p-6 md:px-16 pt-8 pb-32 max-w-7xl mx-auto w-full space-y-12">
        
        {/* Toast */}
        <AnimatePresence>
            {toastMessage && (
                <motion.div 
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-white text-black px-6 py-3 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)] font-bold text-sm tracking-wide flex items-center gap-3 border border-black/10"
                >
                    <span className="material-symbols-outlined text-[20px] text-green-500">check_circle</span>
                    {toastMessage}
                </motion.div>
            )}
        </AnimatePresence>

        {/* Pareto: The 80% - Official Announcements (Bento Layout) */}
        <section>
            <div className="flex items-center justify-between mb-6 md:mb-8 px-2 md:px-0">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-gray-500 text-[20px]">flag</span>
                    <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Comunicados Oficiales</h2>
                </div>
                <span className="text-[9px] font-bold bg-ediflow-primary/10 text-ediflow-primary px-3 py-1 rounded-full border border-ediflow-primary/20 uppercase tracking-widest flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">verified</span> Verificados
                </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {announcements.map(ann => {
                    const isUrgent = ann.category === 'urgent';
                    const isEvent = ann.category === 'event';
                    const isInfo = ann.category === 'informative';
                    
                    const isRead = reads.includes(ann.id);

                    let bgClass = 'bg-[#111] hover:bg-[#141414] border-white/5';
                    let accentColor = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
                    let icon = 'groups';
                    let titleOverlay = 'group-hover:text-blue-500';
                    let pulse = false;

                    if (isUrgent) {
                        bgClass = 'bg-[#111] hover:bg-[#141414] hover:border-red-500/30 border-white/5';
                        accentColor = 'bg-red-500/10 text-red-500 border-red-500/20';
                        icon = 'water_drop'; // fallback icon
                        titleOverlay = 'group-hover:text-red-400';
                        pulse = true;
                    } else if (isEvent) {
                        bgClass = 'bg-[#111] hover:bg-[#141414] hover:border-green-500/30 border-white/5';
                        accentColor = 'bg-green-500/10 text-green-500 border-green-500/20';
                        icon = 'event';
                        titleOverlay = 'group-hover:text-green-500';
                    } else {
                        bgClass = 'bg-[#111] hover:bg-[#141414] hover:border-[#00AEEF]/30 border-white/5';
                        accentColor = 'bg-[#00AEEF]/10 text-[#00AEEF] border-[#00AEEF]/20';
                        icon = 'campaign';
                        titleOverlay = 'group-hover:text-[#00AEEF]';
                    }

                    return (
                        <div key={ann.id} className={`${bgClass} rounded-[2rem] border overflow-hidden group transition-all relative flex flex-col shadow-2xl h-[340px] opacity-${isRead ? '75' : '100'}`}>
                            {isUrgent && <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[40px] group-hover:bg-red-500/20 transition-colors pointer-events-none"></div>}
                            {isUrgent && <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-red-500 to-red-600"></div>}
                            {isEvent && <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-green-400 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>}
                            {isInfo && <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#00AEEF] to-[#0284C7] opacity-0 group-hover:opacity-100 transition-opacity"></div>}
                            
                            <div className="p-6 md:p-8 flex-1 flex flex-col relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-12 h-12 rounded-xl ${accentColor} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                                        <span className="material-symbols-outlined text-[24px]">{icon}</span>
                                    </div>
                                    <span className={`text-[9px] font-bold ${accentColor} px-3 py-1 rounded-full uppercase tracking-widest ${pulse ? 'animate-pulse-soft' : ''}`}>
                                        {ann.category === 'urgent' ? 'Urgente' : ann.category === 'event' ? 'Evento' : 'Info'}
                                    </span>
                                </div>
                                
                                <div className="mb-4 flex-1">
                                    <h3 className={`text-lg md:text-xl font-medium text-white tracking-tight mb-2 ${titleOverlay} transition-colors line-clamp-2`}>{ann.title}</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed font-light line-clamp-3">
                                        {ann.content}
                                    </p>
                                </div>

                                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-gray-400 border border-white/10 text-[10px]">
                                          {ann.profiles?.name?.[0] || 'A'}
                                      </div>
                                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{ann.profiles?.name || 'Administración'}</p>
                                    </div>
                                    <div className="flex gap-4">
                                      {role === 'admin' && (
                                        <div className="flex flex-col items-end">
                                          <span className="text-white text-xs font-bold leading-none">{ann.readsCount}</span>
                                          <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Leídos</span>
                                        </div>
                                      )}
                                      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-0.5">
                                          {new Date(ann.created_at).toLocaleDateString()}
                                      </p>
                                    </div>
                                </div>

                                {!isRead && role !== 'admin' && (
                                   <button 
                                      onClick={() => markAsRead(ann.id)}
                                      className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-md transition-colors border border-white/10"
                                      title="Marcar como leído"
                                   >
                                      <span className="material-symbols-outlined text-[16px]">done</span>
                                   </button>
                                )}
                            </div>
                        </div>
                    );
                })}

                {announcements.length === 0 && (
                    <div className="text-gray-500 col-span-full py-10 text-center">No hay comunicados publicados aún.</div>
                )}
            </div>
        </section>

      </main>

      {/* Glassmorphic Slide-Up Modal for New Official Post */}
      {showNewPostModal && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center items-center px-0 md:px-6">
              {/* Backdrop */}
              <div 
                  className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
                  onClick={() => setShowNewPostModal(false)}
              ></div>
              
              {/* Modal Content */}
              <div className="bg-[#111] w-full md:max-w-2xl rounded-t-[2.5rem] md:rounded-[2.5rem] p-8 md:p-10 border-t md:border border-white/10 shadow-[0_-20px_60px_rgba(0,0,0,0.5)] relative z-10 animate-fade-in-up">
                  
                  {/* Handle for mobile */}
                  <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8 md:hidden"></div>

                  <div className="flex justify-between items-start mb-8">
                      <div>
                          <h2 className="text-2xl md:text-3xl font-light text-white tracking-tight mb-2">Nuevo Comunicado</h2>
                          <p className="text-xs text-gray-400 font-medium">Publicarás como Administrador.</p>
                      </div>
                      <button 
                          onClick={() => setShowNewPostModal(false)}
                          className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                          <span className="material-symbols-outlined text-[20px]">close</span>
                      </button>
                  </div>
                  
                  <div className="space-y-8 mb-10">
                      <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 block pl-1">Clasificación de Prioridad</label>
                          <div className="grid grid-cols-3 gap-4">
                              <button 
                                  onClick={() => setPostType('urgent')}
                                  className={`flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl border transition-all ${
                                      postType === 'urgent' 
                                      ? 'bg-red-500/10 border-red-500/30 text-red-500' 
                                      : 'bg-[#0A0A0A] border-white/5 text-gray-500 hover:bg-white/5 hover:text-gray-300'
                                  }`}
                              >
                                  <span className="material-symbols-outlined text-[28px] md:text-[32px] mb-3">campaign</span>
                                  <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">Urgencia</span>
                              </button>
                              
                              <button 
                                  onClick={() => setPostType('info')}
                                  className={`flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl border transition-all ${
                                      postType === 'info' 
                                      ? 'bg-[#00AEEF]/10 border-[#00AEEF]/30 text-[#00AEEF]' 
                                      : 'bg-[#0A0A0A] border-white/5 text-gray-500 hover:bg-white/5 hover:text-gray-300'
                                  }`}
                              >
                                  <span className="material-symbols-outlined text-[28px] md:text-[32px] mb-3">groups</span>
                                  <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">Informativo</span>
                              </button>

                              <button 
                                  onClick={() => setPostType('event')}
                                  className={`flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl border transition-all ${
                                      postType === 'event' 
                                      ? 'bg-green-500/10 border-green-500/30 text-green-500' 
                                      : 'bg-[#0A0A0A] border-white/5 text-gray-500 hover:bg-white/5 hover:text-gray-300'
                                  }`}
                              >
                                  <span className="material-symbols-outlined text-[28px] md:text-[32px] mb-3">event</span>
                                  <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">Evento</span>
                              </button>
                          </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-1 mb-2 block">Título del Comunicado</label>
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={isPublishing}
                                placeholder="Ej. Mantención de Ascensores"
                                className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-700 focus:outline-none focus:border-ediflow-primary/50 transition-all font-light text-sm focus:ring-1 focus:ring-ediflow-primary/50"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-1 mb-2 block">Contenido</label>
                            <textarea 
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                disabled={isPublishing}
                                placeholder="Describe los detalles de la publicación..." 
                                rows={5} 
                                className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-700 focus:outline-none focus:border-ediflow-primary/50 transition-all resize-none text-sm font-light leading-relaxed focus:ring-1 focus:ring-ediflow-primary/50"
                            ></textarea>
                        </div>
                      </div>
                  </div>

                  <button 
                      onClick={handlePublish}
                      disabled={isPublishing}
                      className={`w-full h-14 ${postType === 'urgent' ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:bg-red-400' : postType === 'event' ? 'bg-green-500 hover:bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-ediflow-primary hover:bg-[#38BDF8] shadow-[0_0_20px_rgba(0,174,239,0.3)]'} text-black rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors active:scale-[0.98] group`}
                  >
                      {isPublishing ? 'Procesando...' : 'Publicar a la Comunidad'}
                      {!isPublishing && <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">send</span>}
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default CommunityWall;
