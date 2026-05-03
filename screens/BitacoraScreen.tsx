import React, { useState, useEffect } from 'react';
import useSWRInfinite from 'swr/infinite';
import { ScreenName } from '../App';
import { UserRole } from '../src/types';
import { useAppContext } from '../src/context/AppContext';
import { supabase } from '../src/lib/supabase-client';

interface Props {
  navigate: (screen: ScreenName) => void;
  role: UserRole;
}

const PAGE_SIZE = 20;

const fetchLogs = async (tenantId: string, filter: string, page: number) => {
  let query = supabase
    .from('logs')
    .select('id, title, description, type, created_at, profiles(name)')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
  
  if (filter !== 'todos') {
    if (filter === 'seguridad') {
      query = query.in('type', ['incidente', 'emergencia']);
    } else if (filter === 'mantenimiento') {
      query = query.eq('type', 'mantenimiento');
    } else if (filter === 'paquetes') {
      query = query.eq('type', 'encomienda');
    } else if (filter === 'visitas') {
      query = query.eq('type', 'visita');
    } else if (filter === 'turno') {
      query = query.eq('type', 'turno');
    }
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

const BitacoraScreen: React.FC<Props> = ({ navigate, role }) => {
  const [filter, setFilter] = useState('todos');
  const { currentTenant } = useAppContext();

  const getKey = (pageIndex: number, previousPageData: any[]) => {
    if (!currentTenant) return null;
    if (previousPageData && !previousPageData.length) return null;
    return ['logs', currentTenant.id, filter, pageIndex];
  };

  const { data: pages = [], error, isLoading, mutate, size, setSize } = useSWRInfinite(
    getKey,
    ([, tenantId, filterVal, page]) => fetchLogs(tenantId as string, filterVal as string, page as number),
    { revalidateOnFocus: false }
  );

  const logs = pages.flat();

  useEffect(() => {
    if (!currentTenant) return;
    const logsChannel = supabase.channel('public:logs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'logs', filter: `tenant_id=eq.${currentTenant.id}` }, () => {
        mutate();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(logsChannel);
    };
  }, [currentTenant, mutate]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      setSize(size + 1);
    }
  };

  const filteredLogs = logs; // Already filtered by DB

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white font-sans overflow-hidden">
      
      {/* Premium Desktop-style Header */}
      <header className="px-6 md:px-16 pt-8 md:pt-16 pb-6 lg:pb-8 flex items-center justify-between sticky top-0 z-30 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-transparent pointer-events-none md:bg-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <button 
              onClick={() => navigate(role === 'admin' ? 'AdminDashboard' : 'ConciergeDashboard')}
              className="w-12 h-12 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 active:scale-95 transition-all shadow-lg"
          >
              <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-2xl md:text-4xl font-light tracking-tight text-white leading-none">Libro de Novedades</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1.5 uppercase font-semibold tracking-widest">Bitácora Oficial</p>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('NovedadEntry')}
          className="pointer-events-auto px-6 h-12 rounded-full bg-ediflow-primary text-black font-semibold text-sm hover:bg-blue-400 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,174,239,0.3)] flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span className="hidden md:inline">Nueva Entrada</span>
        </button>
      </header>

      {/* Main Layout Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar px-6 md:px-16 pb-32 w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-start" onScroll={handleScroll}>
        
        {/* Left Side: Desktop Filters (Sticky) & Stats Bento */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6 sticky top-0 md:top-36 z-20 bg-[#0A0A0A] md:bg-transparent pb-4 md:pb-0 border-b border-white/5 md:border-none pt-2 md:pt-0">
            {/* Context KPI Bento */}
            <div className="hidden md:flex flex-col bg-[#111] rounded-[2rem] p-6 border border-white/5 shadow-xl">
               <span className="material-symbols-outlined text-ediflow-primary text-3xl mb-4">gpp_good</span>
               <h3 className="text-3xl font-light tracking-tight text-white mb-1">Activo</h3>
               <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Turno de Día • 14:00 - 22:00</p>
            </div>

            {/* Filter Pills */}
            <div className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar py-2 md:py-0">
              {['todos', 'seguridad', 'mantenimiento', 'paquetes', 'visitas'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-3 rounded-full md:rounded-2xl text-[11px] font-semibold uppercase tracking-widest transition-all whitespace-nowrap border text-left ${
                    filter === f 
                        ? 'bg-white/10 text-white border-white/20 shadow-sm' 
                        : 'bg-transparent text-gray-500 border-white/5 hover:border-white/10 hover:text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {f === 'todos' ? 'Todas las entradas' : f}
                </button>
              ))}
            </div>
        </aside>

        {/* Right Side: Timeline Feed */}
        <div className="flex-1 w-full space-y-10">
          
          {/* Date Group */}
          <div>
              <div className="flex items-center gap-4 mb-6 sticky top-[90px] md:top-0 bg-[#0A0A0A]/90 backdrop-blur-md py-4 z-10 w-full">
                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Hoy, 24 de Octubre</h2>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
              </div>

              <div className="space-y-4">
                  {filteredLogs.map(log => {
                      // Determine visual props based on type and title
                      let icon = 'info';
                      let color = 'text-blue-400';
                      let bg = 'bg-blue-500/10';
                      let borderColor = 'border-blue-500/20';
                      let priority = 'baja';
                      
                      const upperTitle = log.title.toUpperCase();
                      if (upperTitle.includes('ALTA') || upperTitle.includes('URGENTE') || log.type === 'incidente' || log.type === 'emergencia') {
                         priority = 'alta';
                         color = 'text-red-400';
                         bg = 'bg-red-500/10';
                         borderColor = 'border-red-500/20';
                         icon = 'warning';
                      } else if (upperTitle.includes('MEDIA') || log.type === 'mantenimiento') {
                         priority = 'media';
                         color = 'text-amber-400';
                         bg = 'bg-amber-500/10';
                         borderColor = 'border-amber-500/20';
                         icon = 'engineering';
                      } else if (log.type === 'turno') {
                         color = 'text-green-400';
                         bg = 'bg-green-500/10';
                         borderColor = 'border-green-500/20';
                         icon = 'badge';
                      }

                      return (
                        <BitacoraItem 
                            key={log.id}
                            time={new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            date={new Date(log.created_at).toLocaleDateString()}
                            category={log.type.toUpperCase()}
                            title={log.title} 
                            desc={log.description}
                            icon={icon}
                            color={color}
                            bg={bg}
                            borderColor={borderColor}
                            priority={priority}
                            createdBy={log.profiles?.name || 'Sistema'}
                        />
                      );
                  })}
                  
                  {filteredLogs.length === 0 && (
                     <div className="text-gray-500 text-center py-10">No hay registros para este filtro.</div>
                  )}
              </div>
          </div>

        </div>
      </main>
    </div>
  );
};

const BitacoraItem = ({ time, category, title, desc, icon, color, bg, borderColor, priority, createdBy }: any) => (
    <div className="bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 hover:border-white/15 hover:bg-[#141414] transition-colors group relative overflow-hidden flex flex-col md:flex-row gap-6">
        
        {/* Subtle left border accent depending on priority */}
        {priority === 'alta' && (
           <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 opacity-80"></div>
        )}

        {/* Icon & Time Column (Left on Desktop, Top on Mobile) */}
        <div className="flex flex-row md:flex-col justify-between md:justify-start items-center md:items-start gap-4 md:w-32 shrink-0 border-b border-white/5 md:border-none pb-4 md:pb-0">
             <div className="flex items-center gap-3 md:gap-4 md:flex-col md:items-start">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${bg} ${borderColor} ${color}`}>
                    <span className="material-symbols-outlined text-[24px]">{icon}</span>
                </div>
                <div>
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block md:hidden mb-1">Hora GRP</p>
                   <span className="text-sm font-medium text-white px-3 py-1 bg-white/5 rounded-lg border border-white/10 md:bg-transparent md:border-none md:p-0 md:text-xl font-mono md:font-sans md:font-light md:tracking-tight">{time}</span>
                </div>
             </div>
        </div>

        {/* Content Column */}
        <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-md border ${bg} ${borderColor} ${color}`}>{category}</span>
              {priority === 'alta' && (
                <span className="flex items-center gap-1 text-[9px] font-bold text-red-500 border border-red-500/30 px-2.5 py-1 bg-red-500/10 rounded-md uppercase tracking-[0.15em]">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                  Urgente
                </span>
              )}
            </div>
            
            <h3 className="font-medium text-white text-lg tracking-tight mb-2 group-hover:text-ediflow-primary transition-colors">{title}</h3>
            <p className="text-sm text-gray-400 font-normal leading-relaxed">{desc}</p>
            
            {/* Meta Footer */}
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center w-full">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full border border-[#111] bg-white/10 flex items-center justify-center text-[10px]">{createdBy?.[0] || 'A'}</div>
                </div>
                <span className="text-[10px] font-medium text-gray-500">Registrado por <span className="text-gray-300">{createdBy}</span></span>
              </div>
              <button className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                Ver Detalles <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </button>
            </div>
        </div>
    </div>
);

export default BitacoraScreen;
