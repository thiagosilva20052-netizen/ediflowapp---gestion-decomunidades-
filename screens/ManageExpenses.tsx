import React, { useState, useEffect } from 'react';
import { ScreenName } from '../App';

interface Props {
  navigate: (screen: ScreenName) => void;
}

interface ScannedInvoice {
    provider: string;
    amount: number;
    date: string;
    category: string;
}

const ManageExpenses: React.FC<Props> = ({ navigate }) => {
  // OCR State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedInvoice, setScannedInvoice] = useState<ScannedInvoice | null>(null);
  const [expenses, setExpenses] = useState<ScannedInvoice[]>([
      { provider: 'Enel Distribución', amount: 450000, date: '05-04-2026', category: 'Electricidad Común' },
      { provider: 'Aguas Andinas', amount: 280000, date: '02-04-2026', category: 'Agua Común' },
      { provider: 'Ascensores Schindler', amount: 350000, date: '01-04-2026', category: 'Mantenimiento' }
  ]);

  // Pareto UI State
  const [showProrrateoModal, setShowProrrateoModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Prorrateo State (Ley 21.442)
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0) + 1500000; // Adding base costs like salaries
  const reserveFund = totalExpenses * 0.05; // 5% Fondo de Reserva (Ley 21.442)
  const totalToApportion = totalExpenses + reserveFund;

  const startOCRScan = () => {
      setIsScanning(true);
      setScanProgress(0);
      setScannedInvoice(null);
      
      let progress = 0;
      const interval = setInterval(() => {
          progress += 10;
          setScanProgress(progress);
          if (progress >= 100) {
              clearInterval(interval);
              setTimeout(() => {
                  setScannedInvoice({
                      provider: 'Sodimac S.A.',
                      amount: 85990,
                      date: new Date().toLocaleDateString('es-CL'),
                      category: 'Materiales Reparación'
                  });
              }, 500);
          }
      }, 300);
  };

  const saveInvoice = () => {
      if (scannedInvoice) {
          setExpenses([scannedInvoice, ...expenses]);
          setIsScanning(false);
          setScannedInvoice(null);
          showToast("Factura ingresada correctamente");
      }
  };

  const handleNotify = () => {
      showToast("Notificación enviada a 12 morosos");
  };

  const handleEmitirCobros = () => {
      setShowProrrateoModal(false);
      showToast("Colillas de cobro emitidas exitosamente");
  };

  const showToast = (msg: string) => {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white font-sans overflow-y-auto no-scrollbar pb-20 md:pb-0 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
          <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-ediflow-primary text-black px-6 py-3 rounded-full shadow-[0_0_20px_rgba(0,174,239,0.4)] font-bold text-sm flex items-center gap-2 animate-fade-in-up whitespace-nowrap">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              {toastMessage}
          </div>
      )}

      {/* OCR Scanner Overlay */}
      {isScanning && (
          <div className="fixed inset-0 z-50 bg-[#0A0A0A]/95 flex flex-col items-center justify-center p-5 backdrop-blur-md">
              <button 
                  onClick={() => setIsScanning(false)}
                  className="absolute top-8 right-8 w-12 h-12 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 rounded-full flex items-center justify-center text-white active:scale-95 transition-all"
              >
                  <span className="material-symbols-outlined">close</span>
              </button>

              {!scannedInvoice ? (
                  <div className="w-full max-w-sm flex flex-col items-center">
                      <div className="w-full aspect-[3/4] border-2 border-ediflow-primary/30 rounded-[2rem] relative overflow-hidden mb-8 flex items-center justify-center bg-[#111] shadow-[0_0_50px_rgba(0,174,239,0.1)]">
                          <span className="material-symbols-outlined text-6xl text-white/5">receipt_long</span>
                          
                          {/* Scanning Laser */}
                          <div 
                              className="absolute left-0 w-full h-1 bg-ediflow-primary shadow-[0_0_20px_rgba(0,174,239,1)] transition-all duration-300"
                              style={{ top: `${scanProgress}%` }}
                          ></div>
                      </div>
                      <h3 className="text-white font-medium text-xl tracking-tight mb-2">Procesando código QR...</h3>
                      <p className="text-gray-500 text-sm mb-8 text-center uppercase tracking-widest font-semibold text-[10px]">Leyendo datos fiscales con IA</p>
                      
                      <div className="w-full h-1.5 bg-[#111] rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-ediflow-primary transition-all duration-300 relative">
                             <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 blur-sm"></div>
                          </div>
                      </div>
                  </div>
              ) : (
                  <div className="w-full max-w-sm bg-[#111] rounded-[2rem] p-8 border border-white/10 shadow-2xl animate-fade-in-up">
                      <div className="w-16 h-16 bg-ediflow-primary/10 border border-ediflow-primary/20 text-ediflow-primary rounded-full flex items-center justify-center mx-auto mb-6">
                          <span className="material-symbols-outlined text-3xl">check</span>
                      </div>
                      <h3 className="text-white font-medium text-2xl text-center mb-8 tracking-tight">Captura Exitosa</h3>
                      
                      <div className="space-y-4 mb-10">
                          <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-white/5">
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Proveedor</p>
                              <p className="text-white font-medium">{scannedInvoice.provider}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-white/5">
                                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Monto Total</p>
                                  <p className="text-ediflow-primary font-medium text-xl">${scannedInvoice.amount.toLocaleString('es-CL')}</p>
                              </div>
                              <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-white/5">
                                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Fecha</p>
                                  <p className="text-white font-medium">{scannedInvoice.date}</p>
                              </div>
                          </div>
                          <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-white/5">
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Clasificación IA</p>
                              <p className="text-white font-medium flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px] text-[#008080]">auto_awesome</span>
                                {scannedInvoice.category}
                              </p>
                          </div>
                      </div>

                      <div className="flex gap-3">
                          <button 
                              onClick={startOCRScan}
                              className="flex-1 py-4 rounded-xl font-medium text-white border border-white/10 hover:bg-white/5 transition-all text-sm"
                          >
                              Escanear otro
                          </button>
                          <button 
                              onClick={saveInvoice}
                              className="flex-1 py-4 rounded-xl font-semibold text-black bg-ediflow-primary hover:bg-blue-400 transition-all shadow-[0_0_15px_rgba(0,174,239,0.3)] text-sm"
                          >
                              Confirmar
                          </button>
                      </div>
                  </div>
              )}
          </div>
      )}

      {/* Prorrateo Modal */}
      {showProrrateoModal && (
          <div className="fixed inset-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl flex flex-col justify-end md:justify-center md:items-center p-4">
              <div className="w-full max-w-md bg-[#111] rounded-[2.5rem] p-6 md:p-8 border border-white/10 shadow-2xl animate-fade-in-up">
                  <div className="flex justify-between items-start mb-8">
                      <div>
                          <h2 className="text-2xl font-light tracking-tight text-white mb-1">Prorrateo Mensual</h2>
                          <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-500">Cierre Oficial · Ley 21.442</p>
                      </div>
                      <button onClick={() => setShowProrrateoModal(false)} className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors active:scale-95">
                          <span className="material-symbols-outlined">close</span>
                      </button>
                  </div>
                  
                  <div className="space-y-3 mb-10">
                      <div className="flex justify-between items-center bg-[#0A0A0A] p-5 rounded-2xl border border-white/5">
                          <span className="text-sm font-medium text-gray-400">Total Egresos</span>
                          <span className="text-white font-medium">${totalExpenses.toLocaleString('es-CL')}</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#0A0A0A] p-5 rounded-2xl border border-white/5">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-400">Fondo Reserva</span>
                            <span className="text-[10px] text-ediflow-primary uppercase tracking-widest font-bold mt-0.5">Min legal 5%</span>
                          </div>
                          <span className="text-white font-medium">${reserveFund.toLocaleString('es-CL')}</span>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-white/10">
                        <div className="flex justify-between items-center bg-indigo-500/10 p-6 rounded-2xl border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
                            <span className="text-sm font-semibold text-white uppercase tracking-widest text-[11px]">Total a Cobrar</span>
                            <span className="text-2xl font-light text-indigo-400">${totalToApportion.toLocaleString('es-CL')}</span>
                        </div>
                      </div>
                  </div>

                  <button 
                      onClick={handleEmitirCobros}
                      className="group w-full bg-ediflow-primary text-black font-bold tracking-tight py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-white active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,174,239,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] text-sm"
                  >
                      <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">send</span>
                      Emitir Gastos Comunes Transaccionales
                  </button>
                  <p className="text-center text-gray-500 text-[10px] mt-4 uppercase">Se enviará a 142 unidades</p>
              </div>
          </div>
      )}

      {/* Header */}
// Imports unchanged...

      <header className="px-6 md:px-16 pt-8 md:pt-16 pb-6 lg:pb-8 flex items-center justify-between sticky top-0 z-20 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-transparent pointer-events-none md:bg-none">
        <div className="flex items-center gap-4">
            <button 
            onClick={() => navigate('AdminDashboard')}
            className="w-12 h-12 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 active:scale-95 transition-all pointer-events-auto shadow-lg"
            >
            <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="pointer-events-auto">
            <h1 className="text-2xl md:text-4xl font-light tracking-tight text-white leading-none">Finanzas Core <span className="font-serif italic font-normal text-ediflow-primary text-xl md:text-3xl">80/20</span></h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1.5 uppercase font-semibold tracking-widest">Estándar PropTech Chile</p>
            </div>
        </div>
        <div className="pointer-events-auto hidden md:block">
           <div className="bg-[#111] border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] text-gray-300 uppercase tracking-widest font-bold">Motor IA Activo</span>
           </div>
        </div>
      </header>

      <main className="flex-1 px-6 md:px-16 pb-12 max-w-7xl mx-auto w-full space-y-12">
         
         {/* Dashboard de Control (Top Metrics) */}
         <section className="space-y-4">
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] pl-2">Dashboard de Control</h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Caja Disponible */}
                <div className="col-span-1 lg:col-span-8 bg-[#111] p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-lg relative overflow-hidden group hover:border-white/10 transition-colors">
                    <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#008080]/5 blur-[120px] rounded-full pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 h-full">
                        <div className="flex-1">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#008080]"></span>
                            Caja Disponible
                        </p>
                        <h2 className="text-5xl md:text-6xl font-light text-white tracking-tight">$4.850.000</h2>
                        <div className="flex flex-wrap gap-2 mt-6">
                            <div className="bg-[#008080]/10 border border-[#008080]/20 text-[#008080] px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px]">account_balance</span>
                                <span className="text-xs font-bold uppercase tracking-widest">$3.200.000 Cta. Corriente</span>
                            </div>
                            <div className="bg-ediflow-primary/10 border border-ediflow-primary/20 text-ediflow-primary px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px]">savings</span>
                                <span className="text-xs font-bold uppercase tracking-widest">$1.650.000 Fondo Reserva</span>
                            </div>
                        </div>
                        </div>
                    </div>
                    <span className="material-symbols-outlined absolute -right-10 -bottom-10 text-[180px] text-white/5 -rotate-12 pointer-events-none">account_balance_wallet</span>
                </div>

                {/* Termómetro de Morosidad */}
                <div className="col-span-1 lg:col-span-4 bg-[#111] p-8 md:p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden flex flex-col justify-between shadow-lg hover:border-white/10 transition-colors group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[40px] rounded-full group-hover:bg-red-500/10 transition-colors pointer-events-none"></div>
                    <div>
                        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            Termómetro Morosidad
                        </p>
                        <h3 className="text-4xl text-white font-light tracking-tight mt-1">$1.240.000</h3>
                    </div>
                    <div className="mt-8 relative z-10">
                        <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium">
                            <span>Deuda Total (15%)</span>
                            <span className="text-red-400 font-bold">Crítico</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="w-[15%] h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full"></div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                           <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold text-center mt-1">12 Deptos en mora</p>
                           <button onClick={handleNotify} className="text-[10px] bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-1 rounded hover:bg-red-500/20 transition-colors font-bold uppercase tracking-widest">
                             Notificar
                           </button>
                        </div>
                    </div>
                </div>
            </div>
         </section>

         {/* Flujo de Trabajo (The 4 Steps) */}
         <section className="space-y-4">
            <div className="flex justify-between items-center pb-2 pl-2">
               <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">El Flujo del Administrador (Pilar 80/20)</h2>
               <button 
                onClick={() => navigate('FinanceCommunicationsPage')}
                className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-white flex items-center gap-1 transition-colors"
               >
                  <span className="material-symbols-outlined text-[14px]">outgoing_mail</span> Settings de Correos
               </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
                
                {/* Connecting Line for lg screens */}
                <div className="hidden lg:block absolute top-[4.5rem] left-[10%] right-[10%] h-[2px] bg-white/5 border-t border-dashed border-white/10 z-0 pointer-events-none"></div>

                {/* Paso 1: Configurar Mapa */}
                <button onClick={() => navigate('MapConfigPage')} className="relative z-10 flex flex-col text-left bg-[#111] p-6 lg:p-8 rounded-[2rem] border border-white/5 hover:border-gray-500/30 transition-all group shadow-lg cursor-pointer">
                    <div className="w-6 h-6 rounded-full bg-[#1A1A1A] border border-white/10 text-gray-500 text-[10px] font-bold flex items-center justify-center absolute -top-3 left-8 z-20 group-hover:bg-gray-400 group-hover:text-black group-hover:border-transparent transition-all">1</div>
                    <div className="w-14 h-14 rounded-2xl bg-gray-500/10 border border-gray-500/20 text-gray-400 flex items-center justify-center shrink-0 mb-6 group-hover:scale-110 group-hover:bg-gray-500/20 transition-all shadow-inner">
                        <span className="material-symbols-outlined text-[28px]">map</span>
                    </div>
                    <div>
                        <h3 className="text-white font-medium text-lg tracking-tight mb-2">Configurar "Mapa"</h3>
                        <p className="text-[11px] text-gray-500 leading-relaxed font-medium">Unidades, copropietarios y tabla de alícuotas (%).</p>
                    </div>
                </button>

                {/* Paso 2: La Billetera (Egresos) */}
                <button onClick={() => navigate('EgresosPage')} className="relative z-10 flex flex-col text-left bg-[#111] p-6 lg:p-8 rounded-[2rem] border border-white/5 hover:border-emerald-500/30 transition-all active:scale-[0.98] group shadow-lg text-left h-full">
                    <div className="w-6 h-6 rounded-full bg-[#1A1A1A] border border-white/10 text-gray-500 text-[10px] font-bold flex items-center justify-center absolute -top-3 left-8 z-20 group-hover:bg-emerald-400 group-hover:text-black group-hover:border-transparent transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]">2</div>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all shadow-inner">
                        <span className="material-symbols-outlined text-[28px]">receipt_long</span>
                    </div>
                    <div>
                        <h3 className="text-white font-medium text-lg tracking-tight mb-2">Subir Egresos</h3>
                        <p className="text-[11px] text-gray-500 leading-relaxed font-medium">IA procesa facturas (OCR) y categoriza automáticamente.</p>
                    </div>
                </button>

                {/* Paso 3: Cierre de Mes (Prorrateo) */}
                <button onClick={() => navigate('ProrrateoPage')} className="relative z-10 flex flex-col text-left bg-[#111] p-6 lg:p-8 rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all active:scale-[0.98] group shadow-lg text-left h-full">
                    <div className="w-6 h-6 rounded-full bg-[#1A1A1A] border border-white/10 text-gray-500 text-[10px] font-bold flex items-center justify-center absolute -top-3 left-8 z-20 group-hover:bg-blue-400 group-hover:text-black group-hover:border-transparent transition-all shadow-[0_0_10px_rgba(59,130,246,0.2)]">3</div>
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all shadow-inner">
                        <span className="material-symbols-outlined text-[28px]">calculate</span>
                    </div>
                    <div>
                        <h3 className="text-white font-medium text-lg tracking-tight mb-2">Cierre de Mes</h3>
                        <p className="text-[11px] text-gray-500 leading-relaxed font-medium">Prorrateo 21.442, fondo de reserva y medidores.</p>
                    </div>
                </button>

                {/* Paso 4: Recaudación */}
                <button onClick={() => navigate('RecaudacionPage')} className="relative z-10 flex flex-col text-left bg-[#111] p-6 lg:p-8 rounded-[2rem] border border-white/5 hover:border-purple-500/30 transition-all active:scale-[0.98] group shadow-lg text-left h-full">
                    <div className="w-6 h-6 rounded-full bg-[#1A1A1A] border border-white/10 text-gray-500 text-[10px] font-bold flex items-center justify-center absolute -top-3 left-8 z-20 group-hover:bg-purple-400 group-hover:text-black group-hover:border-transparent transition-all shadow-[0_0_10px_rgba(168,85,247,0.2)]">4</div>
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mb-6 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all shadow-inner">
                        <span className="material-symbols-outlined text-[28px]">account_balance</span>
                    </div>
                    <div>
                        <h3 className="text-white font-medium text-lg tracking-tight mb-2">Recaudación</h3>
                        <p className="text-[11px] text-gray-500 leading-relaxed font-medium">Conciliación bancaria y emisión masiva de colillas.</p>
                    </div>
                </button>
            </div>
         </section>

         {/* Tareas Pendientes (Feed List) */}
         <section className="pt-4">
            <div className="flex justify-between items-center mb-4 pl-2">
               <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Tareas Pendientes</h2>
            </div>
            <div className="bg-[#111] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
               <AttentionItem 
                 icon="warning" 
                 color="text-red-400" 
                 bg="bg-red-500/10" 
                 border="border-red-500/20" 
                 title="Depto 103 crítico" 
                 desc="2 meses pendientes ($170.000)" 
                 action="Ver caso" 
                 accent="bg-red-500/50" 
               />
               <AttentionItem 
                 icon="receipt" 
                 color="text-blue-400" 
                 bg="bg-blue-500/10" 
                 border="border-blue-500/20" 
                 title="Factura Enel ingresada" 
                 desc="Por $450.000 (Pendiente de pago)" 
                 action="Revisar" 
                 accent="bg-blue-500/50" 
               />
               <AttentionItem 
                 icon="pending_actions" 
                 color="text-amber-400" 
                 bg="bg-amber-500/10" 
                 border="border-amber-500/20" 
                 title="Depto 102 por vencer" 
                 desc="Vence en 2 días ($92.500)" 
                 action="Recordar" 
                 accent="bg-amber-500/50" 
               />
            </div>
         </section>
      </main>
    </div>
  );
};

const AttentionItem = ({ icon, color, bg, border, title, desc, action, accent }: any) => (
    <div className="p-6 md:p-8 flex items-center justify-between gap-4 hover:bg-[#141414] transition-colors border-b border-white/5 group relative cursor-pointer">
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${accent} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
        <div className="flex items-start md:items-center gap-5 w-full">
            <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center shrink-0 ${bg} ${border} border ${color} mt-1 md:mt-0`}>
                <span className="material-symbols-outlined text-[20px]">{icon}</span>
            </div>
            <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h4 className="text-base font-semibold text-white tracking-tight leading-snug">{title}</h4>
                    <p className="text-sm text-gray-400">{desc}</p>
                </div>
                <button className="w-full md:w-auto h-10 px-5 bg-white/5 border border-white/10 text-white font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-white hover:text-black hover:border-transparent transition-all active:scale-[0.98]">
                    {action} <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
            </div>
        </div>
    </div>
);

export default ManageExpenses;
