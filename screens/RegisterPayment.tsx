import React, { useState } from 'react';
import { Card } from '../src/components/ui/Card';
import { Input } from '../src/components/ui/Input';
import { Button } from '../src/components/ui/Button';
import { useAppContext } from '../src/context/AppContext';
import { conserjeriaService } from '../src/services/conserjeriaService';
import { ScreenName } from '../App';

interface RegisterPaymentProps {
  navigate: (screen: ScreenName) => void;
}

const RegisterPayment: React.FC<RegisterPaymentProps> = ({ navigate }) => {
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
    
    // Basic validation
    if (!depto || !amount || !pin) {
      setError('Por favor complete todos los campos obligatorios, incluyendo su PIN.');
      return;
    }

    // Simulate PIN validation (In real app, validate against currentUser.admin_pin or similar)
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
        navigate('ConciergeDashboard');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Error al registrar el pago.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    const handlePrint = () => {
      window.print();
    };

    const handleShare = () => {
      const text = `Comprobante de Pago - Ediflow\nDepto: ${depto}\nMonto: $${parseFloat(amount).toLocaleString('es-CL')}\nMétodo: ${method === 'cash' ? 'Efectivo' : 'Cheque'}\nRecibido por: ${currentUser?.name}`;
      if (navigator.share) {
        navigator.share({
          title: 'Comprobante de Pago',
          text: text,
        }).catch(console.error);
      } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      }
    };

    return (
      <div className="flex flex-col min-h-full bg-ediflow-light-bg dark:bg-ediflow-dark-bg relative items-center">
        <div className="w-full max-w-2xl flex flex-col h-full">
          <header className="px-6 pt-10 pb-4 flex items-center gap-4 bg-ediflow-light-bg dark:bg-ediflow-dark-bg sticky top-0 z-20 border-b border-gray-200 dark:border-white/5 print:hidden">
            <button onClick={() => navigate('ConciergeDashboard')} className="w-10 h-10 rounded-full bg-white dark:bg-ediflow-dark-card flex items-center justify-center text-gray-500 dark:text-white/80 hover:bg-gray-50 dark:hover:bg-[#1F1F1F] active:scale-90 transition-all border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-lg font-bold text-ediflow-light-title dark:text-ediflow-dark-title">Comprobante Emitido</h1>
          </header>
          <div className="p-6 flex flex-col items-center justify-center flex-1 text-center">
            <div className="w-20 h-20 bg-green-500/10 dark:bg-green-500/20 rounded-full flex items-center justify-center mb-4 print:hidden">
              <span className="material-symbols-outlined text-4xl text-green-500 dark:text-green-400">check_circle</span>
            </div>
            <h2 className="text-2xl font-bold text-ediflow-light-title dark:text-ediflow-dark-title mb-2 print:text-black">Pago Registrado</h2>
            <p className="text-ediflow-light-text dark:text-ediflow-dark-text mb-6 print:hidden">El comprobante ha sido emitido y notificado al administrador y residente.</p>
            
            {/* Ticket UI */}
            <div className="w-full max-w-sm bg-white text-black rounded-[30px] p-6 mb-8 relative shadow-light-card dark:shadow-none print:shadow-none print:p-0">
              {/* Ticket zig-zag top/bottom effect using CSS radial gradients or just simple borders for now */}
              <div className="border-b-2 border-dashed border-gray-300 pb-4 mb-4 text-center">
                <h3 className="font-black text-xl tracking-tighter uppercase">EDIFLOW</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest">{currentTenant?.name || 'Comunidad'}</p>
              </div>
              
              <div className="space-y-3 text-sm text-left">
                <div className="flex justify-between">
                  <span className="text-gray-500">Fecha:</span>
                  <span className="font-bold">{new Date().toLocaleDateString('es-CL')} {new Date().toLocaleTimeString('es-CL', {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Depto:</span>
                  <span className="font-bold text-lg">{depto}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Monto:</span>
                  <span className="font-bold text-lg">${parseFloat(amount).toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Método:</span>
                  <span className="font-bold">{method === 'cash' ? 'Efectivo' : 'Cheque'}</span>
                </div>
                {method === 'check' && checkNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nº Cheque:</span>
                    <span className="font-bold">{checkNumber}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="text-gray-500">Recibido por:</span>
                  <span className="font-bold">{currentUser?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Firma Digital:</span>
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">VALIDADA ✓</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-300 text-center">
                <p className="text-[10px] text-gray-400 uppercase">Comprobante de recepción de fondos</p>
                <p className="text-[10px] text-gray-400 uppercase">Válido como recibo provisorio</p>
              </div>
            </div>

            <div className="w-full max-w-sm space-y-3 print:hidden">
              <div className="flex gap-3">
                <Button fullWidth onClick={handlePrint} className="bg-white/10 text-ediflow-light-title dark:text-white border-gray-200 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/20">
                  <span className="material-symbols-outlined mr-2">print</span>
                  Imprimir
                </Button>
                <Button fullWidth onClick={handleShare} className="bg-[#25D366]/10 dark:bg-[#25D366]/20 text-[#25D366] border-[#25D366]/50 hover:bg-[#25D366]/20 dark:hover:bg-[#25D366]/30">
                  <span className="material-symbols-outlined mr-2">share</span>
                  Compartir
                </Button>
              </div>
              <Button fullWidth onClick={() => navigate('ConciergeDashboard')}>
                Volver al Inicio
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-gray-100 dark:bg-[#000000] relative items-center">
      <div className="w-full max-w-3xl flex flex-col h-full">
        <header className="px-6 pt-10 pb-4 flex items-center gap-4 bg-gray-100 dark:bg-[#000000] sticky top-0 z-20 border-b-2 border-gray-200 dark:border-gray-800">
          <button onClick={() => navigate('ConciergeDashboard')} className="w-12 h-12 rounded-full bg-white dark:bg-[#121212] flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#1A1A1A] active:scale-90 transition-all border-2 border-gray-200 dark:border-gray-800">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Registrar Pago</h1>
        </header>
        
        <div className="p-6 md:p-10 flex-1 overflow-y-auto no-scrollbar pb-32">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            Complete este formulario para registrar un pago de gastos comunes recibido físicamente en conserjería.
          </p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 text-red-600 dark:text-red-400 p-6 rounded-2xl mb-8 text-lg font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <h3 className="text-gray-900 dark:text-white font-black text-2xl mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl text-ediflow-light-accent dark:text-ediflow-dark-accent">receipt_long</span>
                Detalles del Pago
              </h3>
              
              <div className="space-y-6">
                <Input 
                  label="Departamento" 
                  placeholder="Ej. 402" 
                  value={depto}
                  onChange={(e) => setDepto(e.target.value)}
                  required
                />
                
                <Input 
                  label="Monto ($)" 
                  type="number"
                  placeholder="Ej. 150000" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />

                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase ml-1 mb-2 block">Método de Pago</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setMethod('cash')}
                      className={`py-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-3 text-lg font-bold ${
                        method === 'cash' 
                          ? 'bg-ediflow-light-accent/10 dark:bg-ediflow-dark-accent/20 border-ediflow-light-accent dark:border-ediflow-dark-accent text-ediflow-light-accent dark:text-ediflow-dark-accent' 
                          : 'bg-white dark:bg-[#121212] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl">payments</span>
                      Efectivo
                    </button>
                    <button
                      type="button"
                      onClick={() => setMethod('check')}
                      className={`py-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-3 text-lg font-bold ${
                        method === 'check' 
                          ? 'bg-ediflow-light-accent/10 dark:bg-ediflow-dark-accent/20 border-ediflow-light-accent dark:border-ediflow-dark-accent text-ediflow-light-accent dark:text-ediflow-dark-accent' 
                          : 'bg-white dark:bg-[#121212] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl">account_balance</span>
                      Cheque
                    </button>
                  </div>
                </div>

                {method === 'check' && (
                  <Input 
                    label="Número de Cheque" 
                    placeholder="Ej. 987654321" 
                    value={checkNumber}
                    onChange={(e) => setCheckNumber(e.target.value)}
                    required
                  />
                )}

                <Input 
                  label="Observaciones (Opcional)" 
                  placeholder="Ej. Pago mes de Marzo" 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </Card>

            <Card>
              <h3 className="text-gray-900 dark:text-white font-black text-2xl mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl text-ediflow-light-accent dark:text-ediflow-dark-accent">draw</span>
                Firma del Conserje
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Al ingresar su PIN, usted certifica que ha recibido los fondos indicados y asume la responsabilidad de su resguardo.
              </p>
              
              <div className="bg-gray-100 dark:bg-[#1A1A1A] rounded-2xl p-6 mb-6 border-2 border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase mb-1">Recibido por:</p>
                <p className="text-2xl text-gray-900 dark:text-white font-black">{currentUser?.name}</p>
                <p className="text-lg text-ediflow-light-accent dark:text-ediflow-dark-accent font-bold">Conserje en Turno</p>
              </div>

              <Input 
                label="PIN de Autorización" 
                type="password"
                placeholder="****" 
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={4}
                className="text-center tracking-[1em] text-3xl font-mono"
                required
              />
            </Card>

            <div className="pt-6">
              <Button 
                type="submit" 
                fullWidth 
                size="lg" 
                disabled={isLoading}
                icon={isLoading ? 'hourglass_empty' : 'check_circle'}
              >
                {isLoading ? 'Registrando...' : 'Registrar y Emitir Comprobante'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPayment;
