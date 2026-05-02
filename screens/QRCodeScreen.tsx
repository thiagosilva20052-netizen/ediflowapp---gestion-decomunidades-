import React, { useState, useEffect } from 'react';
import { ScreenName } from '../App';
import { UserRole } from '../src/types';
import { useAppContext } from '../src/context/AppContext';
import { PassType, VisitorPass } from '../src/types';
import { supabase } from '../src/lib/supabase-client';
import QRCode from 'react-qr-code';

interface Props {
  navigate: (screen: ScreenName) => void;
  role: UserRole;
}

type ViewState = 'list' | 'create' | 'show_qr';

const QRCodeScreen: React.FC<Props> = ({ navigate, role }) => {
  const { currentTenant, currentUser } = useAppContext();
  const [view, setView] = useState<ViewState>('list');
  const [passes, setPasses] = useState<VisitorPass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [visitorName, setVisitorName] = useState('');
  const [passType, setPassType] = useState<PassType>('visita');
  const [currentPass, setCurrentPass] = useState<VisitorPass | null>(null);

  useEffect(() => {
    fetchPasses();
  }, [currentUser]);

  const fetchPasses = async () => {
    if (!currentUser) return;
    try {
      const { data, error } = await supabase
        .from('visitor_passes')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data) {
        setPasses(data.map((p: any) => ({
          id: p.qr_code_data, // we use qr_code_data as the key/id for the pass view
          name: p.visitor_name,
          type: p.pass_type as PassType,
          date: new Date(p.created_at).toLocaleString('es-CL', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' }),
          status: p.status,
          tenantId: p.tenant_id,
          userId: p.user_id,
          qrPayload: p.qr_code_data
        })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (view === 'create' || view === 'show_qr') {
      setView('list');
      setVisitorName('');
      setPassType('visita');
      fetchPasses();
    } else {
      if (role === 'admin') navigate('AdminDashboard');
      else if (role === 'concierge') navigate('ConciergeDashboard');
      else navigate('ResidentServices');
    }
  };

  const handleGeneratePass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !currentUser || !currentTenant) return;

    // Generate unique payload for QR
    const payload = crypto.randomUUID();
    // Expiration: 24 hs from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    try {
      const { data, error } = await supabase.from('visitor_passes').insert({
        tenant_id: currentTenant.id,
        user_id: currentUser.id,
        visitor_name: visitorName,
        pass_type: passType,
        qr_code_data: payload,
        expires_at: expiresAt.toISOString(),
        status: 'active'
      }).select().single();

      if (error) throw error;

      const newPass: VisitorPass = {
        id: payload,
        name: visitorName,
        type: passType,
        date: 'Hoy, Válido por 24h',
        status: 'active',
        tenantId: currentTenant.id,
        userId: currentUser.id
      };

      setPasses([newPass, ...passes]);
      setCurrentPass(newPass);
      setView('show_qr');

    } catch (err) {
      console.error('Error generating pass:', err);
      alert('Hubo un error al generar el pase.');
    }
  };

  const getTypeStyles = (type: PassType) => {
    switch(type) {
      case 'visita': return { icon: 'person', color: 'text-[#00AEEF]', bg: 'bg-[#00AEEF]/10', border: 'border-[#00AEEF]/20', glow: 'group-hover:bg-[#00AEEF]/20' };
      case 'delivery': return { icon: 'takeout_dining', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', glow: 'group-hover:bg-orange-500/20' };
      case 'servicio': return { icon: 'build', color: 'text-[#A855F7]', bg: 'bg-[#A855F7]/10', border: 'border-[#A855F7]/20', glow: 'group-hover:bg-[#A855F7]/20' };
      default: return { icon: 'badge', color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', glow: 'group-hover:bg-gray-500/20' };
    }
  };

  const primaryAccent = role === 'admin' ? 'ediflow-primary' : '[#00AEEF]';

  return (
    <div className="flex flex-col min-h-full bg-[#0A0A0A] font-sans selection:bg-white/10">
      
      {/* Immersive Header */}
      <header className="sticky top-0 z-30 bg-[#0A0A0A]/80 backdrop-blur-3xl border-b border-white/5 px-6 py-4 transition-all">
        <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-4 md:gap-6">
                <button 
                    onClick={handleBack}
                    className="w-12 h-12 rounded-2xl bg-[#111] flex items-center justify-center text-white hover:bg-[#1A1A1A] active:scale-95 transition-all border border-white/5 hover:border-white/20"
                >
                    <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </button>
                <div className="animate-fade-in">
                    <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white mb-1">
                      {view === 'list' ? <>Tus <span className={`font-semibold text-${primaryAccent}`}>Invitados</span>.</> : 
                       view === 'create' ? <>Nuevo <span className={`font-semibold text-${primaryAccent}`}>Pase</span>.</> : 
                       <>Código <span className={`font-semibold text-${primaryAccent}`}>QR</span>.</>}
                    </h1>
                    <p className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                       <span className={`w-1.5 h-1.5 rounded-full bg-${primaryAccent}`}></span>
                       Unidad {currentUser?.apartment || '402'}
                    </p>
                </div>
            </div>
            
            <div className="hidden md:flex w-14 h-14 rounded-2xl bg-[#111] items-center justify-center border border-white/5 shadow-lg">
                <span className={`material-symbols-outlined text-[28px] text-gray-400`}>qr_code_scanner</span>
            </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:px-12 md:py-10 max-w-4xl mx-auto w-full pb-32">
        
        {/* LIST VIEW */}
        {view === 'list' && (
          <div className="space-y-10 animate-fade-in-up">
            
            {/* Generate Pass CTA (Hero Bento) */}
            <div 
              onClick={() => setView('create')}
              className="bg-[#111] rounded-[2rem] border border-white/5 p-8 relative overflow-hidden group cursor-pointer hover:border-[#00AEEF]/30 transition-all shadow-2xl active:scale-[0.98]"
            >
               {/* Cyber Premium Ambient Glow */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#00AEEF]/5 rounded-full blur-[80px] group-hover:bg-[#00AEEF]/15 transition-colors pointer-events-none"></div>
               <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#00AEEF] to-[#0284C7] opacity-60 group-hover:opacity-100 transition-opacity"></div>
               
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-[#0A0A0A] border border-[#00AEEF]/20 flex items-center justify-center text-[#00AEEF] shadow-[0_0_20px_rgba(0,174,239,0.15)] group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[32px]">qr_code_2</span>
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-light text-white tracking-tight mb-1">Generar Pase Rápido</h2>
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Acceso VIP sin esperas en portería</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#0A0A0A] flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-colors self-end md:self-auto">
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Active Passes Section */}
                <section>
                <div className="flex items-center gap-3 mb-6 pl-1">
                    <span className="material-symbols-outlined text-gray-500 text-[20px]">how_to_reg</span>
                    <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Pases Vigentes</h2>
                </div>
                
                <div className="space-y-4">
                    {passes.filter(p => p.status === 'active').length === 0 && (
                        <div className="bg-[#111] border border-dashed border-white/10 rounded-[1.5rem] p-8 text-center">
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">No hay visitas programadas</p>
                        </div>
                    )}
                    {passes.filter(p => p.status === 'active').map(pass => {
                        const style = getTypeStyles(pass.type);
                        return (
                            <div 
                                key={pass.id} 
                                onClick={() => { setCurrentPass(pass); setView('show_qr'); }}
                                className={`bg-[#111] p-5 rounded-[1.5rem] border ${style.border} flex items-center justify-between active:scale-95 transition-all cursor-pointer hover:bg-[#141414] group shadow-lg`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 ${style.bg} ${style.color} rounded-xl flex items-center justify-center ${style.glow} transition-colors`}>
                                        <span className="material-symbols-outlined text-[24px]">{style.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-white tracking-tight mb-0.5">{pass.name}</h3>
                                        <p className={`text-[10px] ${style.color} font-bold uppercase tracking-widest`}>{pass.type} • {pass.date}</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-gray-500 group-hover:text-white transition-colors">qr_code_scanner</span>
                            </div>
                        );
                    })}
                </div>
                </section>

                {/* History Section */}
                <section>
                <div className="flex items-center gap-3 mb-6 pl-1">
                    <span className="material-symbols-outlined text-gray-500 text-[20px]">history</span>
                    <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Registro Histórico</h2>
                </div>
                
                <div className="space-y-3 opacity-60">
                    {passes.filter(p => p.status !== 'active').map(pass => {
                        const style = getTypeStyles(pass.type);
                        return (
                            <div key={pass.id} className="bg-[#0A0A0A] p-4 rounded-2xl border border-white/5 flex items-center justify-between hover:opacity-100 transition-opacity">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[#111] text-gray-500 rounded-xl flex items-center justify-center border border-white/5">
                                        <span className="material-symbols-outlined text-[20px]">{style.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-gray-300 font-medium text-xs mb-0.5">{pass.name}</h3>
                                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">{pass.date} • {pass.status === 'used' ? 'Ingresó' : 'Expiró'}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                </section>
            </div>
          </div>
        )}

        {/* CREATE VIEW */}
        {view === 'create' && (
          <form onSubmit={handleGeneratePass} className="space-y-8 animate-fade-in-up max-w-xl mx-auto">
            
            <div className="bg-[#111] p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00AEEF]/5 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="space-y-3 relative z-10">
                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 block">Identificación del Visitante</label>
                    <input 
                        type="text" 
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        placeholder="Nombre y Apellido, o Empresa..."
                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-5 py-4 text-white text-base focus:border-[#00AEEF]/50 focus:ring-1 focus:ring-[#00AEEF]/50 outline-none transition-all placeholder:text-gray-600 font-medium shadow-inner"
                        autoFocus
                        required
                    />
                </div>

                <div className="space-y-4 relative z-10">
                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 block">Motivo de Acceso</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {(['visita', 'delivery', 'servicio'] as PassType[]).map((type) => {
                            const style = getTypeStyles(type);
                            const isSelected = passType === type;
                            return (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setPassType(type)}
                                    className={`py-4 md:py-6 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all active:scale-[0.98] border ${
                                        isSelected 
                                        ? `${style.bg} ${style.border} ${style.color} shadow-[0_0_20px_rgba(255,255,255,0.05)] scale-105 sm:scale-100` 
                                        : 'bg-[#0A0A0A] border-white/5 text-gray-500 hover:bg-[#141414] hover:text-gray-300'
                                    }`}
                                >
                                    <span className={`material-symbols-outlined ${isSelected ? 'text-[32px]' : 'text-[28px]'} transition-all`}>{style.icon}</span>
                                    <span className={`text-[10px] font-extrabold uppercase tracking-widest ${isSelected ? '' : 'opacity-70'}`}>{type}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="p-5 bg-[#0A0A0A] border border-white/5 rounded-2xl relative z-10 flex gap-4 items-start">
                    <span className="material-symbols-outlined text-gray-500 text-[20px] shrink-0 mt-0.5">info</span>
                    <p className="text-xs text-gray-400 leading-relaxed font-medium">Este pase será válido por <span className="text-white">24 horas</span> desde su creación. El visitante debe presentarlo al guardia desde su celular.</p>
                </div>
            </div>

            <button 
                type="submit"
                disabled={!visitorName.trim()}
                className="w-full bg-[#00AEEF] hover:bg-white text-black font-bold uppercase tracking-widest text-sm py-5 rounded-2xl transition-all shadow-[0_0_30px_rgba(0,174,239,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed disabled:hover:bg-[#00AEEF]"
            >
                Generar Clave de Entrada
            </button>
          </form>
        )}

        {/* SHOW QR VIEW (Wallet Style Ticket) */}
        {view === 'show_qr' && currentPass && (
          <div className="flex flex-col items-center justify-center h-full animate-fade-in-up mt-4 md:mt-8">
            
            {/* Dark Glass Ticket */}
            <div className="w-full max-w-sm bg-[#111] rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden border border-white/10 group">
                {/* Glowing Aura inside Ticket */}
                <div className={`absolute top-0 inset-x-0 h-48 bg-gradient-to-b ${getTypeStyles(currentPass.type).color.includes('orange') ? 'from-[#f97316]/20' : currentPass.type === 'servicio' ? 'from-[#A855F7]/20' : 'from-[#00AEEF]/20'} to-transparent opacity-50`}></div>
                
                {/* Visual perforations for ticket feel */}
                <div className="absolute top-1/2 -left-4 w-8 h-8 rounded-full bg-[#0A0A0A] border-r border-[#0A0A0A] inset-y-0 my-auto shadow-inner"></div>
                <div className="absolute top-1/2 -right-4 w-8 h-8 rounded-full bg-[#0A0A0A] border-l border-[#0A0A0A] inset-y-0 my-auto shadow-inner"></div>
                <div className="absolute top-1/2 left-4 right-4 h-px border-t-2 border-dashed border-white/10 my-auto"></div>

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className={`w-14 h-14 rounded-2xl ${getTypeStyles(currentPass.type).bg} ${getTypeStyles(currentPass.type).color} border ${getTypeStyles(currentPass.type).border} flex items-center justify-center mb-6`}>
                        <span className="material-symbols-outlined text-[28px]">{getTypeStyles(currentPass.type).icon}</span>
                    </div>

                    <h2 className="text-2xl font-light text-white tracking-tight mb-2 leading-none">{currentPass.name}</h2>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-10">Pase de Autorización</p>
                    
                    {/* The QR Code Graphic Area */}
                    <div className="bg-white p-4 rounded-3xl mb-12 shadow-[0_0_40px_rgba(255,255,255,0.1)] relative">
                        {/* Decorative scan line animation */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00AEEF]/20 to-transparent opacity-0 animate-[scan_3s_ease-in-out_infinite]"></div>
                        <div className="flex justify-center items-center">
                          {currentPass?.qrPayload ? (
                            <QRCode
                                value={currentPass.qrPayload}
                                size={180}
                                level="H"
                                bgColor="#ffffff"
                                fgColor="#000000"
                            />
                          ) : (
                            <span className="material-symbols-outlined text-[180px] text-black leading-none block">qr_code_2</span>
                          )}
                        </div>
                    </div>
                </div>

                {/* Ticket Details (Below dashed line) */}
                <div className="relative z-10 w-full mt-2 grid grid-cols-2 gap-4">
                    <div className="text-left">
                        <p className="text-[9px] text-gray-500 font-semibold uppercase tracking-widest mb-1">Destino</p>
                        <p className="text-white font-medium text-sm">Unidad 402</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] text-gray-500 font-semibold uppercase tracking-widest mb-1">Vigencia</p>
                        <p className="text-green-400 font-medium text-sm">Válido 24h</p>
                    </div>
                </div>
            </div>

            {/* Actions for the Ticket */}
            <div className="w-full max-w-sm mt-8 space-y-4">
              <button className="w-full bg-[#111] border border-white/10 hover:bg-white text-white hover:text-black font-bold py-5 rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-xl group">
                <span className="material-symbols-outlined text-[#25D366] group-hover:text-[#1FAF53] transition-colors">share</span>
                <span className="text-xs uppercase tracking-widest">Enviar por WhatsApp</span>
              </button>
              
              <button 
                onClick={() => setView('list')}
                className="w-full text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest py-4 transition-colors"
              >
                Volver a la Agenda
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default QRCodeScreen;
