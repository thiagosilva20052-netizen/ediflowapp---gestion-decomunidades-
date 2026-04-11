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
    <div className="flex flex-col min-h-full bg-[#101c22] relative">
      {/* Toast Notification */}
      {toastMessage && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2 animate-fade-in-up whitespace-nowrap">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              {toastMessage}
          </div>
      )}

      {/* OCR Scanner Overlay */}
      {isScanning && (
          <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-5">
              <button 
                  onClick={() => setIsScanning(false)}
                  className="absolute top-6 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white active:scale-90 transition-all"
              >
                  <span className="material-symbols-outlined">close</span>
              </button>

              {!scannedInvoice ? (
                  <div className="w-full max-w-sm flex flex-col items-center">
                      <div className="w-full aspect-[3/4] border-2 border-ediflow-primary/50 rounded-2xl relative overflow-hidden mb-6 flex items-center justify-center bg-[#1c262c]">
                          <span className="material-symbols-outlined text-6xl text-gray-600">receipt</span>
                          
                          {/* Scanning Laser */}
                          <div 
                              className="absolute left-0 w-full h-1 bg-ediflow-primary shadow-[0_0_15px_rgba(234,179,8,0.8)] transition-all duration-300"
                              style={{ top: `${scanProgress}%` }}
                          ></div>
                      </div>
                      <h3 className="text-white font-bold text-lg mb-2">Escaneando Factura...</h3>
                      <p className="text-gray-400 text-sm mb-6 text-center">Procesando con IA (OCR) para extraer datos automáticamente.</p>
                      
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-ediflow-primary transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
                      </div>
                  </div>
              ) : (
                  <div className="w-full max-w-sm bg-[#1c262c] rounded-2xl p-6 border border-white/10 animate-fade-in-up">
                      <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="material-symbols-outlined text-3xl">check</span>
                      </div>
                      <h3 className="text-white font-bold text-xl text-center mb-6">Datos Extraídos</h3>
                      
                      <div className="space-y-4 mb-8">
                          <div className="bg-[#101c22] p-3 rounded-xl border border-white/5">
                              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Proveedor</p>
                              <p className="text-white font-bold">{scannedInvoice.provider}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                              <div className="bg-[#101c22] p-3 rounded-xl border border-white/5">
                                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Monto Total</p>
                                  <p className="text-ediflow-primary font-bold text-lg">${scannedInvoice.amount.toLocaleString('es-CL')}</p>
                              </div>
                              <div className="bg-[#101c22] p-3 rounded-xl border border-white/5">
                                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Fecha</p>
                                  <p className="text-white font-bold">{scannedInvoice.date}</p>
                              </div>
                          </div>
                          <div className="bg-[#101c22] p-3 rounded-xl border border-white/5">
                              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Categoría Sugerida</p>
                              <p className="text-white font-bold">{scannedInvoice.category}</p>
                          </div>
                      </div>

                      <div className="flex gap-3">
                          <button 
                              onClick={startOCRScan}
                              className="flex-1 py-3 rounded-xl font-bold text-white bg-white/5 hover:bg-white/10 transition-all"
                          >
                              Reintentar
                          </button>
                          <button 
                              onClick={saveInvoice}
                              className="flex-1 py-3 rounded-xl font-bold text-black bg-ediflow-primary hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20"
                          >
                              Guardar
                          </button>
                      </div>
                  </div>
              )}
          </div>
      )}

      {/* Prorrateo Modal */}
      {showProrrateoModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end">
              <div className="bg-[#1c262c] rounded-t-3xl p-6 border-t border-white/10 animate-fade-in-up">
                  <div className="flex justify-between items-center mb-6">
                      <div>
                          <h2 className="text-xl font-bold text-white">Cerrar Mes y Prorratear</h2>
                          <p className="text-xs text-ediflow-primary font-bold mt-1">Según Ley 21.442 (Chile)</p>
                      </div>
                      <button onClick={() => setShowProrrateoModal(false)} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                          <span className="material-symbols-outlined">close</span>
                      </button>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                      <div className="flex justify-between items-center bg-[#101c22] p-4 rounded-xl border border-white/5">
                          <span className="text-sm text-gray-400">Total Egresos Ordinarios</span>
                          <span className="text-white font-bold">${totalExpenses.toLocaleString('es-CL')}</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#101c22] p-4 rounded-xl border border-white/5">
                          <span className="text-sm text-gray-400">Fondo de Reserva (5% min)</span>
                          <span className="text-white font-bold">${reserveFund.toLocaleString('es-CL')}</span>
                      </div>
                      <div className="flex justify-between items-center bg-ediflow-primary/10 p-4 rounded-xl border border-ediflow-primary/20">
                          <span className="text-sm font-bold text-ediflow-primary">Total a Prorratear</span>
                          <span className="text-xl font-bold text-ediflow-primary">${totalToApportion.toLocaleString('es-CL')}</span>
                      </div>
                  </div>

                  <button 
                      onClick={handleEmitirCobros}
                      className="w-full bg-ediflow-primary text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 active:scale-[0.98] transition-all shadow-lg shadow-yellow-500/20"
                  >
                      <span className="material-symbols-outlined">send</span>
                      Emitir Colillas de Cobro
                  </button>
              </div>
          </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#101c22]/95 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('AdminDashboard')}
            className="w-10 h-10 rounded-full bg-[#1c262c] flex items-center justify-center text-white hover:bg-[#2a363e] active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">Gastos Comunes</h1>
            <p className="text-xs text-gray-400">Marzo 2026</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 pb-24 space-y-8">
         {/* Pareto KPI */}
         <div className="bg-gradient-to-br from-[#1c262c] to-[#101c22] p-5 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex justify-between items-end">
               <div>
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Fondo Común (Marzo)</p>
                  <h2 className="text-3xl font-bold text-white">$4.500.000</h2>
                  <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-bold">
                     <span className="material-symbols-outlined text-[14px]">trending_up</span>
                     75% Recaudado
                  </p>
               </div>
               <div className="text-right">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Por Recaudar</p>
                  <h3 className="text-xl font-bold text-amber-400">$1.500.000</h3>
               </div>
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-white/5 rotate-12 pointer-events-none">account_balance_wallet</span>
         </div>

         {/* Pareto Actions (The 20% that does the 80%) */}
         <div>
            <h2 className="text-xs font-bold text-gray-500 uppercase mb-3 ml-1">Flujo de Trabajo (Regla 80/20)</h2>
            <div className="grid grid-cols-1 gap-3">
               {/* Action 1: OCR */}
               <button onClick={startOCRScan} className="bg-[#1c262c] hover:bg-[#25323a] active:scale-[0.98] transition-all p-4 rounded-2xl border border-white/5 flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                     <span className="material-symbols-outlined text-2xl">document_scanner</span>
                  </div>
                  <div className="text-left flex-1">
                     <h3 className="text-white font-bold text-sm">1. Ingresar Gasto (OCR)</h3>
                     <p className="text-xs text-gray-400">Escanea la factura con IA</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-600">chevron_right</span>
               </button>

               {/* Action 2: Prorrateo */}
               <button onClick={() => setShowProrrateoModal(true)} className="bg-[#1c262c] hover:bg-[#25323a] active:scale-[0.98] transition-all p-4 rounded-2xl border border-white/5 flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
                     <span className="material-symbols-outlined text-2xl">calculate</span>
                  </div>
                  <div className="text-left flex-1">
                     <h3 className="text-white font-bold text-sm">2. Cerrar Mes y Prorratear</h3>
                     <p className="text-xs text-gray-400">Cálculo automático Ley 21.442</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-600">chevron_right</span>
               </button>

               {/* Action 3: Cobranza */}
               <button onClick={handleNotify} className="bg-[#1c262c] hover:bg-[#25323a] active:scale-[0.98] transition-all p-4 rounded-2xl border border-white/5 flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                     <span className="material-symbols-outlined text-2xl">notifications_active</span>
                  </div>
                  <div className="text-left flex-1">
                     <h3 className="text-white font-bold text-sm">3. Cobranza Automática</h3>
                     <p className="text-xs text-gray-400">Notificar a 12 morosos con 1 clic</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-600">chevron_right</span>
               </button>
            </div>
         </div>

         {/* Unified Feed: What needs attention */}
         <div>
            <div className="flex justify-between items-center mb-3 ml-1">
               <h2 className="text-xs font-bold text-gray-500 uppercase">Atención Requerida</h2>
               <button className="text-ediflow-primary text-xs font-bold active:opacity-70 transition-opacity">Ver todo</button>
            </div>
            <div className="bg-[#1c262c] rounded-2xl border border-white/5 divide-y divide-white/5">
               <AttentionItem icon="warning" color="text-red-400" bg="bg-red-500/10" title="Depto 103 atrasado" desc="2 meses pendientes ($170.000)" />
               <AttentionItem icon="receipt" color="text-blue-400" bg="bg-blue-500/10" title="Factura Enel ingresada" desc="Por $450.000 (Pendiente de pago)" />
               <AttentionItem icon="warning" color="text-amber-400" bg="bg-amber-500/10" title="Depto 102 pendiente" desc="Vence en 2 días ($92.500)" />
            </div>
         </div>
      </main>
    </div>
  );
};

const AttentionItem = ({ icon, color, bg, title, desc }: any) => (
    <div className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer active:bg-white/10">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bg} ${color}`}>
            <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div className="flex-1">
            <h4 className="text-sm font-bold text-white">{title}</h4>
            <p className="text-xs text-gray-400">{desc}</p>
        </div>
        <button className="text-gray-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined">chevron_right</span>
        </button>
    </div>
);

export default ManageExpenses;
