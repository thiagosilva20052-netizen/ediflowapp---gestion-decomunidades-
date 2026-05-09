import React, { useState } from 'react';
import { useAppContext } from '../src/context/AppContext';
import { conserjeriaService } from '../src/services/conserjeriaService';
import { ScreenName } from '../App';

interface RegisterPaymentProps {
  navigate: (screen: ScreenName) => void;
  from?: ScreenName | null;
}

const RegisterPayment: React.FC<RegisterPaymentProps> = ({ navigate, from }) => {
  const { currentUser, currentTenant } = useAppContext();
  
  const [depto, setDepto] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'cash' | 'check'>('cash');
  const [checkNumber, setCheckNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [pin, setPin] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant || !currentUser) return;
    
    if (!depto || !amount || !pin) {
      setError('Por favor complete todos los campos obligatorios.');
      return;
    }

    if (pin.length < 4) {
      setError('PIN inválido. Ingrese su PIN de conserje.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await conserjeriaService.registrarPagoManual(
        currentTenant.id,
        depto,
        parseFloat(amount),
        method,
        currentUser.name,
        method === 'check' ? checkNumber : undefined,
        notes
      );
      
      setSuccess(true);
      setTimeout(() => {
        navigate(from || 'ConciergeDashboard');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Error al registrar el pago.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full bg-[#0A0A0A] p-6 text-center">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <span className="material-symbols-outlined text-6xl text-green-500">receipt_long</span>
        </div>
        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">¡Pago Registrado!</h2>
        <p className="text-gray-400 mb-8 text-lg">El comprobante ha sido emitido para el Depto <span className="text-white font-bold">{depto}</span>.</p>
        
        {/* Simple Ticket Preview */}
        <div className="w-full max-w-xs bg-white text-black rounded-2xl p-6 mb-8 text-left shadow-2xl">
          <div className="border-b border-gray-200 pb-4 mb-4 text-center">
            <h3 className="font-black text-xl tracking-tighter uppercase">EDIFLOW</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Comprobante de Pago</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Depto:</span><span className="font-bold">{depto}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Monto:</span><span className="font-bold">${parseFloat(amount).toLocaleString('es-CL')}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Método:</span><span className="font-bold uppercase">{method === 'cash' ? 'Efectivo' : 'Cheque'}</span></div>
            <div className="flex justify-between pt-2 border-t border-gray-100"><span className="text-gray-500">Recibido por:</span><span className="font-bold">{currentUser?.name}</span></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-[#0A0A0A]">
      <header className="px-6 md:px-16 pt-8 md:pt-12 pb-6 lg:pb-8 flex items-center justify-between sticky top-0 z-30 bg-[#0A0A0A]/90 backdrop-blur-3xl border-b border-white/5">
        <div className="flex items-center gap-4 pointer-events-auto">
          <button 
            onClick={() => navigate(from || 'ConciergeDashboard')}
            className="w-10 h-10 rounded-xl bg-[#111] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1A1A1A] active:scale-95 transition-all shadow-sm group relative"
          >
            <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform relative z-10">arrow_back</span>
          </button>
          <div>
            <h2 className="text-[10px] font-bold text-green-500 uppercase tracking-[0.2em] mb-0.5">Gastos Comunes</h2>
            <h1 className="text-lg md:text-xl font-medium text-white tracking-tight flex items-center gap-2">Registrar Pago Manual</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-6 md:px-16 pt-8 pb-32 max-w-7xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto">
          
          {error && (
            <div className="bg-red-500/10 border-2 border-red-500/30 text-red-400 p-4 rounded-[1.5rem] text-sm font-medium flex items-center gap-3">
              <span className="material-symbols-outlined text-red-500">error</span>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Details */}
            <section className="bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl hover:border-white/10 transition-all group">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 shadow-inner">
                  <span className="material-symbols-outlined text-[24px]">receipt_long</span>
                </div>
                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] group-hover:text-gray-300 transition-colors">Detalles del Pago</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Unidad <span className="text-green-500 ml-1">*</span></label>
                  <input 
                    type="text" 
                    value={depto}
                    onChange={(e) => setDepto(e.target.value)}
                    placeholder="Ej. 402"
                    className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 focus:bg-[#141414] focus:ring-1 focus:ring-green-500/50 transition-all text-xl font-medium tracking-tight"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Monto ($) <span className="text-green-500 ml-1">*</span></label>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Ej. 150000"
                    className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 focus:bg-[#141414] focus:ring-1 focus:ring-green-500/50 transition-all text-xl font-medium tracking-tight"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Método de Pago</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setMethod('cash')}
                      className={`h-16 rounded-xl flex items-center justify-center gap-2 transition-all border ${
                        method === 'cash' 
                          ? 'bg-green-500/10 border-green-500/30 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
                          : 'bg-[#0A0A0A] border-white/5 text-gray-500 hover:bg-[#141414] hover:text-gray-300'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">payments</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest">Efectivo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMethod('check')}
                      className={`h-16 rounded-xl flex items-center justify-center gap-2 transition-all border ${
                        method === 'check' 
                          ? 'bg-green-500/10 border-green-500/30 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
                          : 'bg-[#0A0A0A] border-white/5 text-gray-500 hover:bg-[#141414] hover:text-gray-300'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">account_balance</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest">Cheque</span>
                    </button>
                  </div>
                </div>

                {method === 'check' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Número de Cheque <span className="text-green-500 ml-1">*</span></label>
                    <input 
                      type="text" 
                      value={checkNumber}
                      onChange={(e) => setCheckNumber(e.target.value)}
                      placeholder="Ej. 987654321"
                      className="w-full h-14 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 focus:bg-[#141414] focus:ring-1 focus:ring-green-500/50 transition-all text-sm tracking-wider font-mono"
                      required
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Right Column: Authorization */}
            <section className="bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl hover:border-white/10 transition-all group">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
                  <span className="material-symbols-outlined text-[24px]">draw</span>
                </div>
                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] group-hover:text-gray-300 transition-colors">Autorización</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-[#0A0A0A] border border-white/5 rounded-[1.5rem] p-6 flex flex-col items-center justify-center text-center">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Recibido por:</p>
                  <p className="text-xl font-medium tracking-tight text-white">{currentUser?.name}</p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full mt-3">
                     <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                     <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Conserje en Turno</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">PIN de Conserje <span className="text-green-500 ml-1">*</span></label>
                  <input 
                    type="password" 
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="****"
                    maxLength={4}
                    className="w-full h-16 bg-[#0A0A0A] border border-white/5 rounded-xl px-4 text-white text-center text-3xl tracking-[1em] focus:outline-none focus:border-blue-500/50 focus:bg-[#141414] focus:ring-1 focus:ring-blue-500/50 transition-all font-mono shadow-inner"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Observaciones (Opcional)</label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Detalles adicionales..."
                    rows={3}
                    className="w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-[#141414] focus:ring-1 focus:ring-blue-500/50 transition-all resize-none text-sm font-medium"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Submit Button */}
          <div className="pt-6 pb-12 flex flex-col items-center">
            <button 
              type="submit"
              disabled={isLoading || !depto || !amount || !pin}
              className="group w-full md:w-auto md:min-w-[400px] h-14 bg-green-500 hover:bg-white active:scale-[0.98] text-black rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all disabled:opacity-50 disabled:grayscale disabled:hover:bg-green-500 disabled:active:scale-100 disabled:cursor-not-allowed border border-transparent"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">check_circle</span>
                  Registrar y Emitir Comprobante
                </>
              )}
            </button>
             <p className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-4 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">lock</span> Transacción Segura
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};

export default RegisterPayment;

