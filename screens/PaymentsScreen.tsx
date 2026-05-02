import React, { useState, useEffect } from 'react';
import { ScreenName } from '../App';
import { UserRole } from '../src/types';
import { Button } from '../src/components/ui/Button';
import { Card } from '../src/components/ui/Card';
import { useAppContext } from '../src/context/AppContext';
import { supabase } from '../src/lib/supabase-client';

interface Props {
  navigate: (screen: ScreenName) => void;
  role: UserRole;
}

const PaymentsScreen: React.FC<Props> = ({ navigate, role }) => {
  const { currentTenant } = useAppContext();
  const [showKhipuModal, setShowKhipuModal] = useState(false);
  const [showCashModal, setShowCashModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success'>('pending');

  const [unitPath, setUnitPath] = useState<string>('Depto ...');
  const [unitId, setUnitId] = useState<string | null>(null);
  const [totalDebt, setTotalDebt] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [pastTransactions, setPastTransactions] = useState<any[]>([]);
  const [pendingTransactions, setPendingTransactions] = useState<{regular: any[], fines: any[]}>({ regular: [], fines: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDebt = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setUserId(user.id);

        // Fetch Unit
        const { data: units } = await supabase
          .from('units')
          .select('id, unit_number')
          .or(`owner_id.eq.${user.id},resident_id.eq.${user.id}`)
          .limit(1);

        let currentUnitId = null;
        if (units && units.length > 0) {
           setUnitPath(units[0].unit_number);
           currentUnitId = units[0].id;
           setUnitId(units[0].id);
        } else {
           setUnitPath('Depto (Sin Asignar)');
        }

        // We can either fetch existing pending transactions, or calculate from expenses 
        // For 'One-Click' MVP, if no pending transactions, let's auto-generate a sample debt for demo purposes if 0,
        // or just read from 'transactions' where status = 'pending'.
        const { data: txs } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id);

        if (txs && txs.length > 0) {
           const pendingTxs = txs.filter(t => t.status === 'pending');
           const debt = pendingTxs.reduce((sum, tx) => sum + Number(tx.amount), 0);
           
           const pendingFines = pendingTxs.filter(t => t.billing_month?.startsWith('Multa'));
           const pendingRegular = pendingTxs.filter(t => !t.billing_month?.startsWith('Multa'));
           
           setPendingTransactions({ regular: pendingRegular, fines: pendingFines });
           setTotalDebt(debt);
           
           const paidTxs = txs.filter(t => t.status === 'success' || t.status === 'failure').sort((a, b) => {
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
           });
           setPastTransactions(paidTxs);
        } else {
           // Si no hay deuda, mostrar 0. Pero para demo podemos inyectar una si está vacío y es la primera vez.
           setTotalDebt(0);
           setPendingTransactions({ regular: [], fines: [] });
           setPastTransactions([]);
        }

      } catch (err) {
         console.error('Error fetching debt:', err);
      } finally {
         setIsLoading(false);
      }
    };
    fetchDebt();
  }, []);

  const handleBack = () => {
    if (role === 'admin') navigate('AdminDashboard');
    else if (role === 'concierge') navigate('ConciergeDashboard');
    else navigate('ResidentServices');
  };

  const handleDirectTransfer = async () => {
    // If debt is 0, let's create a demo transaction first
    if (totalDebt === 0) {
       if (!userId || !currentTenant) return;
       const sampleDebt = 125400;
       
       const { data: newTx } = await supabase.from('transactions').insert({
          tenant_id: currentTenant.id,
          unit_id: unitId,
          user_id: userId,
          amount: sampleDebt,
          status: 'pending',
          billing_month: 'Abril 2026',
       }).select().single();
       if (newTx) setPendingTransactions(prev => ({ ...prev, regular: [...prev.regular, newTx] }));
       setTotalDebt(sampleDebt);
       setShowKhipuModal(true);
       return;
    }

    setShowKhipuModal(true);
  };

  const simulateKhipuPayment = async () => {
      setPaymentStatus('processing');
      
      try {
        // En un flujo real llamaríamos a MercadoPago API
        // const response = await fetch('/api/checkout/preference', { ... })
        // const { init_point } = await response.json();
        // window.location.href = init_point;
        
        // Simulación: Esperar 2s y actualizar base de datos a success
        setTimeout(async () => {
            if (userId) {
               await supabase
                 .from('transactions')
                 .update({ status: 'success', payment_date: new Date().toISOString() })
                 .eq('user_id', userId)
                 .eq('status', 'pending');
            }
            
            setPaymentStatus('success');
            setTimeout(() => {
                setShowKhipuModal(false);
                setTotalDebt(0);
            }, 2000);
        }, 3000);

      } catch (err) {
        console.error(err);
        setPaymentStatus('pending');
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
            <h1 className="text-lg font-bold text-white leading-tight">Gastos Comunes</h1>
            <p className="text-xs text-gray-400">{unitPath}</p>
        </div>
      </header>

      <main className="flex-1 p-6 md:px-12 pb-24 md:pb-12 max-w-4xl mx-auto w-full space-y-8">
        
        {/* Pareto 80/20: The Main Action (Pay Current Debt) */}
        <section className="animate-fade-in-up">
            <Card gradient className="text-center group border border-white/5 hover:border-[#00AEEF]/30 transition-all shadow-2xl relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00AEEF]/5 rounded-full blur-[80px] group-hover:bg-[#00AEEF]/15 transition-colors pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col items-center text-center py-6">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Total a Pagar • Abril 2026</p>
                    
                    {totalDebt === 0 && paymentStatus !== 'success' ? (
                        <div className="flex flex-col items-center animate-fade-in-up">
                            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4 border border-green-500/20">
                                <span className="material-symbols-outlined text-4xl">check_circle</span>
                            </div>
                            <h2 className="text-4xl font-light text-white mb-2">$0</h2>
                            <p className="text-sm text-green-400 font-bold uppercase tracking-widest">¡Estás al día!</p>
                            <button 
                                onClick={handleDirectTransfer}
                                className="mt-4 text-xs text-gray-500 underline"
                            >
                                Simular Nueva Deuda (Demo)
                            </button>
                        </div>
                    ) : paymentStatus === 'success' ? (
                        <div className="flex flex-col items-center animate-fade-in-up">
                            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4 border border-green-500/20">
                                <span className="material-symbols-outlined text-4xl">check_circle</span>
                            </div>
                            <h2 className="text-4xl font-light text-white mb-2">$0</h2>
                            <p className="text-sm text-green-400 font-bold uppercase tracking-widest">¡Estás al día!</p>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-5xl md:text-6xl font-light text-white mb-2 tracking-tight">
                                ${totalDebt.toLocaleString('es-CL')}
                            </h2>
                            <p className="text-xs text-red-400 font-bold uppercase tracking-widest mb-8">Vence el 05 de Mayo</p>
                            
                            {/* Detailed Breakdown */}
                            <div className="w-full bg-[#141414] rounded-2xl border border-white/5 p-5 mb-4 text-left relative group-hover:border-white/10 transition-colors">
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-3 mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[14px]">receipt_long</span> Detalle del Cobro
                                </h3>
                                <div className="space-y-3">
                                    {pendingTransactions.regular.map((tx, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm">
                                            <span className="text-gray-400">{tx.billing_month || 'Gasto Común'}</span>
                                            <span className="text-white font-mono">${Number(tx.amount).toLocaleString('es-CL')}</span>
                                        </div>
                                    ))}
                                    {pendingTransactions.regular.length === 0 && (
                                       <div className="text-gray-500 text-sm">No hay gastos regulares pendientes.</div>
                                    )}
                                </div>
                            </div>

                            {pendingTransactions.fines.length > 0 && (
                               <div className="w-full bg-[#111] rounded-2xl border border-amber-500/30 p-5 mb-8 text-left relative overflow-hidden group-hover:border-amber-500/50 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.05)]">
                                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-[40px] pointer-events-none"></div>
                                  <h3 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest border-b border-amber-500/20 pb-3 mb-3 flex items-center gap-2">
                                      <span className="material-symbols-outlined text-[14px]">warning</span> Multas Pendientes
                                  </h3>
                                  <div className="space-y-3">
                                      {pendingTransactions.fines.map((fine, idx) => (
                                         <div key={idx} className="flex justify-between items-start text-sm">
                                             <div className="flex flex-col">
                                                <span className="text-gray-300">{fine.billing_month}</span>
                                             </div>
                                             <span className="text-amber-400 font-mono">${Number(fine.amount).toLocaleString('es-CL')}</span>
                                         </div>
                                      ))}
                                  </div>
                               </div>
                            )}
                            
                            {/* 80% - Digital Transfer */}
                            <button 
                                onClick={handleDirectTransfer}
                                className="w-full h-16 bg-[#00AEEF] hover:bg-white text-black font-bold uppercase tracking-widest text-sm rounded-2xl transition-all shadow-[0_0_30px_rgba(0,174,239,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3 active:scale-[0.98] mb-4"
                            >
                                <span className="material-symbols-outlined">account_balance</span>
                                Pagar con Transferencia
                            </button>
                            
                            {/* 20% - Manual/Cash Payment Alternative */}
                            <button 
                                onClick={() => setShowCashModal(true)}
                                className="w-full h-16 bg-[#111] hover:bg-white/10 text-white font-bold uppercase tracking-widest text-sm rounded-2xl transition-all border border-white/10 flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                <span className="material-symbols-outlined">payments</span>
                                Pagar en Conserjería
                            </button>

                            <p className="text-[10px] text-gray-500 mt-6 flex flex-col items-center justify-center gap-1 font-semibold tracking-widest text-center">
                                <span className="flex items-center gap-1.5 uppercase"><span className="material-symbols-outlined text-[14px]">lock</span> Transferencia protegida por Khipu</span>
                                <span className="text-gray-600 text-[9px] uppercase tracking-wider">Ediflow no manipula fondos de la comunidad</span>
                            </p>
                        </>
                    )}
                </div>
            </Card>
        </section>

        {/* Pareto 20%: Payment History */}
        <section>
            <h2 className="text-xs font-bold text-gray-500 uppercase mb-3 ml-1">Historial de Pagos</h2>
            <div className="bg-[#141414] rounded-2xl border border-white/5 divide-y divide-white/5">
                
                {paymentStatus === 'success' && (
                    <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors animate-fade-in-up">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                                <span className="material-symbols-outlined">receipt_long</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">Último Pago</h4>
                                <p className="text-[10px] text-gray-400">Pagado hoy • Transferencia</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-white">Verificando...</span>
                        </div>
                    </div>
                )}

                {pastTransactions.length === 0 && paymentStatus !== 'success' && (
                    <div className="p-8 text-center text-gray-500 text-sm">
                        No hay pagos registrados
                    </div>
                )}

                {pastTransactions.map((tx: any) => (
                    <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.status === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                <span className="material-symbols-outlined">{tx.status === 'success' ? 'receipt_long' : 'cancel'}</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">{tx.billing_month || 'Pago de Gastos Comunes'}</h4>
                                <p className="text-[10px] text-gray-400 capitalize">
                                    {tx.payment_date ? `Pagado el ${new Date(tx.payment_date).toLocaleDateString('es-CL')} • ` : ''} 
                                    {tx.method || 'Digital'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-white">${Number(tx.amount).toLocaleString('es-CL')}</span>
                            <button className="text-ediflow-primary hover:text-white transition-colors active:scale-90">
                                <span className="material-symbols-outlined text-xl">download</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>

      </main>

      {/* Cash Payment Instructions Modal */}
      {showCashModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-center items-center p-4 animate-fade-in">
              <div className="bg-[#141414] rounded-3xl p-6 w-full max-w-sm border border-white/10 animate-fade-in-up text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-ediflow-primary"></div>
                  <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                      <span className="material-symbols-outlined text-3xl">storefront</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Pago Presencial</h3>
                  <p className="text-sm text-gray-300 leading-relaxed mb-6">
                      Acércate a la conserjería de tu edificio e indica que deseas pagar los Gastos Comunes del <strong className="text-white">{unitPath}</strong>.
                      <br/><br/>
                      Puedes pagar con <strong className="text-white">Efectivo</strong> o <strong className="text-white">Cheque</strong>. El conserje registrará tu pago inmediatamente en el sistema y recibirás tu comprobante.
                  </p>
                  <Button 
                      onClick={() => setShowCashModal(false)}
                      variant="secondary"
                      fullWidth
                  >
                      Entendido
                  </Button>
              </div>
          </div>
      )}

      {/* Khipu / Direct Transfer Modal Simulation */}
      {showKhipuModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end animate-fade-in">
              <div className="bg-white rounded-t-3xl h-[80vh] flex flex-col animate-fade-in-up">
                  {/* Khipu Header */}
                  <div className="bg-[#0047FF] p-4 rounded-t-3xl flex items-center justify-between text-white">
                      <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined">lock</span>
                          <span className="font-bold tracking-tight">khipu</span>
                      </div>
                      <button onClick={() => setShowKhipuModal(false)} className="active:scale-90 transition-transform">
                          <span className="material-symbols-outlined">close</span>
                      </button>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                      <div className="text-center mb-8">
                          <p className="text-gray-500 text-sm mb-1">Estás pagando a</p>
                          <h2 className="text-xl font-bold text-black mb-4">{currentTenant?.name || 'Comunidad Edificio Central'}</h2>
                          <div className="text-4xl font-bold text-black">${totalDebt.toLocaleString('es-CL')}</div>
                      </div>

                      {paymentStatus === 'pending' && (
                          <div className="space-y-4 flex-1">
                              <p className="text-sm font-bold text-gray-700 mb-2">Selecciona tu banco para transferir:</p>
                              <button onClick={simulateKhipuPayment} className="w-full border-2 border-gray-200 p-4 rounded-xl flex items-center gap-4 hover:border-[#0047FF] transition-colors active:scale-[0.98] group">
                                  <div className="w-10 h-10 bg-red-600 rounded-lg"></div>
                                  <span className="font-bold text-gray-700 group-hover:text-black">Banco Santander</span>
                              </button>
                              <button onClick={simulateKhipuPayment} className="w-full border-2 border-gray-200 p-4 rounded-xl flex items-center gap-4 hover:border-[#0047FF] transition-colors active:scale-[0.98] group">
                                  <div className="w-10 h-10 bg-blue-600 rounded-lg"></div>
                                  <span className="font-bold text-gray-700 group-hover:text-black">Banco de Chile</span>
                              </button>
                              <button onClick={simulateKhipuPayment} className="w-full border-2 border-gray-200 p-4 rounded-xl flex items-center gap-4 hover:border-[#0047FF] transition-colors active:scale-[0.98] group">
                                  <div className="w-10 h-10 bg-green-600 rounded-lg"></div>
                                  <span className="font-bold text-gray-700 group-hover:text-black">Banco Estado</span>
                              </button>
                          </div>
                      )}

                      {paymentStatus === 'processing' && (
                          <div className="flex-1 flex flex-col items-center justify-center">
                              <div className="w-16 h-16 border-4 border-gray-200 border-t-[#0047FF] rounded-full animate-spin mb-4"></div>
                              <h3 className="font-bold text-black text-lg">Procesando transferencia...</h3>
                              <p className="text-gray-500 text-sm text-center mt-2">Conectando de forma segura con tu banco.</p>
                          </div>
                      )}

                      {paymentStatus === 'success' && (
                          <div className="flex-1 flex flex-col items-center justify-center">
                              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                  <span className="material-symbols-outlined text-5xl">check_circle</span>
                              </div>
                              <h3 className="font-bold text-black text-xl">¡Transferencia Exitosa!</h3>
                              <p className="text-gray-500 text-sm text-center mt-2 max-w-xs">El pago se ha enviado directamente a la cuenta bancaria de la comunidad a través de Khipu. Ediflow no retiene ni administra fondos de la comunidad.</p>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default PaymentsScreen;
