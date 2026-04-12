import React, { useState } from 'react';
import { ScreenName } from '../App';
import { UserRole } from './LoginScreen';
import { Button } from '../src/components/ui/Button';
import { Card } from '../src/components/ui/Card';
import { Input } from '../src/components/ui/Input';
import { useAppContext } from '../src/context/AppContext';
import { PassType, VisitorPass } from '../src/types';

interface Props {
  navigate: (screen: ScreenName) => void;
  role: UserRole;
}

type ViewState = 'list' | 'create' | 'show_qr';

const QRCodeScreen: React.FC<Props> = ({ navigate, role }) => {
  const { currentTenant, currentUser } = useAppContext();
  const [view, setView] = useState<ViewState>('list');
  const [passes, setPasses] = useState<VisitorPass[]>([
    { id: '1', name: 'Carlos Mendoza', type: 'visita', date: 'Hoy, 19:00', status: 'active', tenantId: 'tenant-1', userId: 'user-1' },
    { id: '2', name: 'Reparación Internet', type: 'servicio', date: 'Ayer', status: 'used', tenantId: 'tenant-1', userId: 'user-1' },
  ]);

  // Form State
  const [visitorName, setVisitorName] = useState('');
  const [passType, setPassType] = useState<PassType>('visita');
  const [currentPass, setCurrentPass] = useState<VisitorPass | null>(null);

  const handleBack = () => {
    if (view === 'create' || view === 'show_qr') {
      setView('list');
      setVisitorName('');
      setPassType('visita');
    } else {
      if (role === 'admin') navigate('AdminDashboard');
      else if (role === 'concierge') navigate('ConciergeDashboard');
      else navigate('ResidentServices');
    }
  };

  const handleGeneratePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) return;

    const newPass: VisitorPass = {
      id: Math.random().toString(36).substr(2, 9),
      name: visitorName,
      type: passType,
      date: 'Hoy, Válido por 24h',
      status: 'active',
      tenantId: currentTenant?.id || '',
      userId: currentUser?.id || ''
    };

    setPasses([newPass, ...passes]);
    setCurrentPass(newPass);
    setView('show_qr');
  };

  const getIconForType = (type: PassType) => {
    switch(type) {
      case 'visita': return 'person';
      case 'delivery': return 'two_wheeler';
      case 'servicio': return 'build';
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#0A0A0A] relative">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/5 p-4 flex items-center gap-3">
        <button 
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#141414] hover:bg-[#1F1F1F] active:scale-90 transition-all text-white border border-white/5"
        >
            <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
            <h1 className="text-lg font-bold text-white leading-tight">
              {view === 'list' ? 'Pases de Visita' : view === 'create' ? 'Nuevo Pase' : 'Código de Acceso'}
            </h1>
            <p className="text-xs text-gray-400">Depto 402</p>
        </div>
      </header>

      <main className="flex-1 p-4 pb-24">
        
        {/* LIST VIEW */}
        {view === 'list' && (
          <div className="space-y-6 animate-fade-in">
            {/* Main Action */}
            <Button 
              onClick={() => setView('create')}
              fullWidth
              size="lg"
              className="flex-col gap-2 h-auto py-6"
            >
              <span className="material-symbols-outlined text-3xl">qr_code_scanner</span>
              <span className="text-lg">Generar Nuevo Pase</span>
            </Button>

            {/* Active Passes */}
            <section>
              <h2 className="text-xs font-bold text-gray-500 uppercase mb-3 ml-1">Pases Activos</h2>
              <div className="space-y-3">
                {passes.filter(p => p.status === 'active').length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No tienes pases activos.</p>
                )}
                {passes.filter(p => p.status === 'active').map(pass => (
                  <div 
                    key={pass.id} 
                    onClick={() => { setCurrentPass(pass); setView('show_qr'); }}
                    className="bg-gradient-to-r from-[#141414] to-[#0F0F0F] p-4 rounded-2xl border border-ediflow-primary/30 flex items-center justify-between active:scale-95 transition-transform cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-ediflow-primary/10 text-ediflow-primary rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined">{getIconForType(pass.type)}</span>
                      </div>
                      <div>
                        <h3 className="text-white font-bold">{pass.name}</h3>
                        <p className="text-xs text-ediflow-primary">{pass.date}</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                  </div>
                ))}
              </div>
            </section>

            {/* History */}
            <section>
              <h2 className="text-xs font-bold text-gray-500 uppercase mb-3 ml-1">Historial</h2>
              <div className="space-y-3 opacity-70">
                {passes.filter(p => p.status !== 'active').map(pass => (
                  <div key={pass.id} className="bg-[#141414] p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 text-gray-400 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined">{getIconForType(pass.type)}</span>
                      </div>
                      <div>
                        <h3 className="text-gray-300 font-bold text-sm">{pass.name}</h3>
                        <p className="text-[10px] text-gray-500">{pass.date} • {pass.status === 'used' ? 'Utilizado' : 'Expirado'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* CREATE VIEW */}
        {view === 'create' && (
          <form onSubmit={handleGeneratePass} className="space-y-6 animate-fade-in-up">
            <Card>
              <h2 className="text-white font-bold mb-4">¿Quién te visita?</h2>
              
              <div className="space-y-4">
                <Input 
                  label="Nombre del visitante / Empresa"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="Ej. Juan Pérez o PedidosYa"
                  autoFocus
                  required
                />

                <div>
                  <label className="text-xs text-gray-400 font-bold uppercase ml-1 mb-2 block">Tipo de Visita</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['visita', 'delivery', 'servicio'] as PassType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setPassType(type)}
                        className={`py-3 rounded-xl flex flex-col items-center gap-1 border transition-all ${
                          passType === type 
                            ? 'bg-ediflow-primary/10 border-ediflow-primary text-ediflow-primary' 
                            : 'bg-[#0A0A0A] border-white/5 text-gray-400 hover:bg-white/5'
                        }`}
                      >
                        <span className="material-symbols-outlined">{getIconForType(type)}</span>
                        <span className="text-[10px] font-bold capitalize">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Button 
              type="submit"
              disabled={!visitorName.trim()}
              fullWidth
            >
              Generar Código QR
            </Button>
          </form>
        )}

        {/* SHOW QR VIEW */}
        {view === 'show_qr' && currentPass && (
          <div className="flex flex-col items-center justify-center h-full animate-fade-in-up pt-4">
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl flex flex-col items-center w-full max-w-sm relative overflow-hidden">
              {/* Ticket Top Decoration */}
              <div className="absolute top-0 left-0 w-full h-3 bg-ediflow-primary"></div>
              
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-1">Pase de Acceso</p>
              <h2 className="text-2xl font-black text-black text-center leading-tight mb-6">{currentPass.name}</h2>
              
              {/* Simulated QR Code using Material Icon and styling */}
              <div className="bg-gray-100 p-4 rounded-2xl mb-6">
                <span className="material-symbols-outlined text-[180px] text-black leading-none block">qr_code_2</span>
              </div>
              
              <div className="w-full border-t-2 border-dashed border-gray-200 my-2 relative">
                <div className="absolute -left-10 -top-3 w-6 h-6 bg-[#0A0A0A] rounded-full"></div>
                <div className="absolute -right-10 -top-3 w-6 h-6 bg-[#0A0A0A] rounded-full"></div>
              </div>

              <div className="w-full flex justify-between items-center mt-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Destino</p>
                  <p className="text-black font-bold">Depto 402</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Válido</p>
                  <p className="text-green-600 font-bold">Hoy</p>
                </div>
              </div>
            </div>

            <div className="w-full max-w-sm mt-8 space-y-3">
              <button className="w-full bg-[#25D366] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-green-900/20">
                <span className="material-symbols-outlined">share</span>
                Compartir por WhatsApp
              </button>
              <Button 
                onClick={() => setView('list')}
                variant="outline"
                fullWidth
              >
                Volver a mis pases
              </Button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default QRCodeScreen;
