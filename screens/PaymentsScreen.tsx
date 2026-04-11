import React, { useState } from 'react';
import { ScreenName } from '../App';
import { UserRole } from './LoginScreen';

interface Props {
  navigate: (screen: ScreenName) => void;
  role: UserRole;
}

const PaymentsScreen: React.FC<Props> = ({ navigate, role }) => {
  const [showKhipuModal, setShowKhipuModal] = useState(false);
  const [showCashModal, setShowCashModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success'>('pending');

  const handleBack = () => {
    if (role === 'admin') navigate('AdminDashboard');
    else if (role === 'concierge') navigate('ConciergeDashboard');
    else navigate('ResidentServices');
  };

  const simulateKhipuPayment = () => {
      setPaymentStatus('processing');
      setTimeout(() => {
          setPaymentStatus('success');
          setTimeout(() => {
              setShowKhipuModal(false);
          }, 2000);
      }, 3000);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#101c22] relative">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#101c22]/95 backdrop-blur-md border-b border-white/5 p-4 flex items-center gap-3">
        <button 
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1c262c] hover:bg-[#25323a] active:scale-90 transition-all text-white border border-white/5"
        >
            <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
            <h1 className="text-lg font-bold text-white leading-tight">Gastos Comunes</h1>
            <p className="text-xs text-gray-400">Depto 402</p>
        </div>
      </header>

      <main className="flex-1 p-4 pb-24 space-y-6">
        
        {/* Pareto 80/20: The Main Action (Pay Current Debt) */}
        <section>
            <div className="bg-gradient-to-br from-[#1c262c] to-[#101c22] rounded-3xl p-6 border border-white/5 shadow-xl relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-ediflow-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col items-center text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total a Pagar • Abril 2026</p>
                    
                    {paymentStatus === 'success' ? (
                        <div className="flex flex-col items-center animate-fade-in-up">
                            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-3">
                                <span className="material-symbols-outlined text-4xl">check_circle</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-1">$0</h2>
                            <p className="text-sm text-green-400 font-medium">¡Estás al día!</p>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-4xl font-bold text-white mb-1 tracking-tight">$125.400</h2>
                            <p className="text-xs text-red-400 font-medium mb-6">Vence el 05 de Mayo</p>
                            
                            {/* 80% - Digital Transfer */}
                            <button 
                                onClick={() => setShowKhipuModal(true)}
                                className="w-full bg-ediflow-primary text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 active:scale-[0.98] transition-all shadow-lg shadow-yellow-500/20"
                            >
                                <span className="material-symbols-outlined">account_balance</span>
                                Pagar con Transferencia
                            </button>
                            
                            {/* 20% - Manual/Cash Payment Alternative */}
                            <button 
                                onClick={() => setShowCashModal(true)}
                                className="w-full mt-3 bg-transparent border border-white/10 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 active:scale-[0.98] transition-all"
                            >
                                <span className="material-symbols-outlined text-lg">payments</span>
                                Pagar en Conserjería
                            </button>

                            <p className="text-[10px] text-gray-500 mt-4 flex items-center justify-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">lock</span>
                                Pagos seguros y registrados
                            </p>
                        </>
                    )}
                </div>
            </div>
        </section>

        {/* Pareto 20%: Payment History */}
        <section>
            <h2 className="text-xs font-bold text-gray-500 uppercase mb-3 ml-1">Historial de Pagos</h2>
            <div className="bg-[#1c262c] rounded-2xl border border-white/5 divide-y divide-white/5">
                
                {paymentStatus === 'success' && (
                    <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors animate-fade-in-up">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                                <span className="material-symbols-outlined">receipt_long</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">Abril 2026</h4>
                                <p className="text-[10px] text-gray-400">Pagado hoy • Transferencia</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-white">$125.400</span>
                            <button className="text-ediflow-primary hover:text-white transition-colors active:scale-90">
                                <span className="material-symbols-outlined text-xl">download</span>
                            </button>
                        </div>
                    </div>
                )}

                <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                            <span className="material-symbols-outlined">receipt_long</span>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white">Marzo 2026</h4>
                            <p className="text-[10px] text-gray-400">Pagado el 02 Mar • Conserjería</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-white">$122.100</span>
                        <button className="text-ediflow-primary hover:text-white transition-colors active:scale-90">
                            <span className="material-symbols-outlined text-xl">download</span>
                        </button>
                    </div>
                </div>

                <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                            <span className="material-symbols-outlined">receipt_long</span>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white">Febrero 2026</h4>
                            <p className="text-[10px] text-gray-400">Pagado el 04 Feb • Transferencia</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-white">$118.500</span>
                        <button className="text-ediflow-primary hover:text-white transition-colors active:scale-90">
                            <span className="material-symbols-outlined text-xl">download</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>

      </main>

      {/* Cash Payment Instructions Modal */}
      {showCashModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-center items-center p-4 animate-fade-in">
              <div className="bg-[#1c262c] rounded-3xl p-6 w-full max-w-sm border border-white/10 animate-fade-in-up text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-ediflow-primary"></div>
                  <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                      <span className="material-symbols-outlined text-3xl">storefront</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Pago Presencial</h3>
                  <p className="text-sm text-gray-300 leading-relaxed mb-6">
                      Acércate a la conserjería de tu edificio e indica que deseas pagar los Gastos Comunes del <strong className="text-white">Depto 402</strong>.
                      <br/><br/>
                      Puedes pagar con <strong className="text-white">Efectivo</strong> o <strong className="text-white">Cheque</strong>. El conserje registrará tu pago inmediatamente en el sistema y recibirás tu comprobante.
                  </p>
                  <button 
                      onClick={() => setShowCashModal(false)}
                      className="w-full bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 active:scale-95 transition-all"
                  >
                      Entendido
                  </button>
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
                          <h2 className="text-xl font-bold text-black mb-4">Comunidad Edificio Central</h2>
                          <div className="text-4xl font-bold text-black">$125.400</div>
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
                              <p className="text-gray-500 text-sm text-center mt-2">El pago se ha enviado directamente a la cuenta de la comunidad.</p>
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
