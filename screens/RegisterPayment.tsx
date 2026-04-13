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
      <header className="sticky top-0 z-30 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/5 p-4 flex items-center gap-4">
        <button 
          onClick={() => navigate(from || 'ConciergeDashboard')}
          className="w-10 h-10 rounded-full bg-[#141414] flex items-center justify-center text-white hover:bg-[#1F1F1F] active:scale-90 transition-all border border-white/5"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-lg font-black text-white uppercase tracking-tight">Registrar Pago Manual</h1>
          <p className="text-[10px] font-bold text-green-500 uppercase tracking-[0.2em]">Gastos Comunes</p>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-4xl mx-auto w-full pb-32">
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {error && (
            <div className="bg-red-500/10 border-2 border-red-500/50 text-red-500 p-4 rounded-2xl text-sm font-bold flex items-center gap-3">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Column: Details */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                  <span className="material-symbols-outlined text-xl">receipt_long</span>
                </div>
                <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Detalles del Pago</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Departamento *</label>
                  <input 
                    type="text" 
                    value={depto}
                    onChange={(e) => setDepto(e.target.value)}
                    placeholder="Ej. 402"
                    className="w-full bg-[#141414] border-2 border-white/5 rounded-2xl px-5 h-16 text-white placeholder-gray-700 focus:outline-none focus:border-green-500/50 transition-all text-lg font-bold"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Monto ($) *</label>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Ej. 150000"
                    className="w-full bg-[#141414] border-2 border-white/5 rounded-2xl px-5 h-16 text-white placeholder-gray-700 focus:outline-none focus:border-green-500/50 transition-all text-lg font-bold"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Método de Pago</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setMethod('cash')}
                      className={`h-16 rounded-2xl flex flex-col items-center justify-center transition-all border-2 ${
                        method === 'cash' 
                          ? 'bg-green-500/10 border-green-500 text-green-500 shadow-lg shadow-green-500/10' 
                          : 'bg-[#141414] border-transparent text-gray-500 hover:bg-[#1F1F1F]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl">payments</span>
                      <span className="text-[10px] font-black uppercase tracking-widest mt-1">Efectivo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMethod('check')}
                      className={`h-16 rounded-2xl flex flex-col items-center justify-center transition-all border-2 ${
                        method === 'check' 
                          ? 'bg-green-500/10 border-green-500 text-green-500 shadow-lg shadow-green-500/10' 
                          : 'bg-[#141414] border-transparent text-gray-500 hover:bg-[#1F1F1F]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl">account_balance</span>
                      <span className="text-[10px] font-black uppercase tracking-widest mt-1">Cheque</span>
                    </button>
                  </div>
                </div>

                {method === 'check' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-1">Número de Cheque *</label>
                    <input 
                      type="text" 
                      value={checkNumber}
                      onChange={(e) => setCheckNumber(e.target.value)}
                      placeholder="Ej. 987654321"
                      className="w-full bg-[#141414] border-2 border-white/5 rounded-2xl px-5 h-16 text-white placeholder-gray-700 focus:outline-none focus:border-green-500/50 transition-all text-lg"
                      required
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Right Column: Authorization */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                  <span className="material-symbols-outlined text-xl">draw</span>
                </div>
                <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Autorización</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-[#141414] border-2 border-white/5 rounded-2xl p-6">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Recibido por:</p>
                  <p className="text-2xl font-black text-white">{currentUser?.name}</p>
                  <p className="text-xs font-bold text-green-500 uppercase tracking-widest mt-1">Conserje en Turno</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">PIN de Conserje *</label>
                  <input 
                    type="password" 
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="****"
                    maxLength={4}
                    className="w-full bg-[#141414] border-2 border-white/5 rounded-2xl px-5 h-20 text-white text-center text-4xl tracking-[1em] focus:outline-none focus:border-green-500/50 transition-all font-mono"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Observaciones (Opcional)</label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej. Pago mes de Marzo, entregado por residente..."
                    rows={3}
                    className="w-full bg-[#141414] border-2 border-white/5 rounded-2xl px-5 py-4 text-white placeholder-gray-700 focus:outline-none focus:border-green-500/50 transition-all resize-none text-lg"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Submit Button */}
          <div className="pt-8">
            <button 
              type="submit"
              disabled={isLoading || !depto || !amount || !pin}
              className="w-full h-20 bg-green-600 hover:bg-green-500 active:scale-[0.98] text-white rounded-3xl font-black text-xl uppercase tracking-[0.1em] flex items-center justify-center gap-4 shadow-2xl shadow-green-900/40 transition-all disabled:opacity-50 disabled:active:scale-100"
            >
              {isLoading ? (
                <span className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-3xl">check_circle</span>
                  Registrar y Emitir Comprobante
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default RegisterPayment;

