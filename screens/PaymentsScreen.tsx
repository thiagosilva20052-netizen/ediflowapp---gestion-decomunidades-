import React, { useState, useEffect } from 'react';
import { ScreenName } from '../App';
import { UserRole } from '../src/types';
import { Button } from '../src/components/ui/Button';
import { Card } from '../src/components/ui/Card';
import { useAppContext } from '../src/context/AppContext';
import { supabase } from '../src/lib/supabase-client';
import { jsPDF } from 'jspdf';

const resizeImage = (file: File, maxWidth: number): Promise<File> => {
   return new Promise((resolve, reject) => {
      if (file.type === 'application/pdf') {
         resolve(file);
         return;
      }
      
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
         const canvas = document.createElement('canvas');
         const scale = Math.min(maxWidth / img.width, 1);
         canvas.width = img.width * scale;
         canvas.height = img.height * scale;
         const ctx = canvas.getContext('2d');
         if (ctx) ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
         canvas.toBlob((blob) => {
             if (blob) {
                 resolve(new File([blob], file.name, { type: file.type, lastModified: Date.now() }));
             } else {
                 resolve(file);
             }
         }, file.type);
      };
      img.onerror = reject;
   });
};

interface Props {
  navigate: (screen: ScreenName) => void;
  role: UserRole;
}

const PaymentsScreen: React.FC<Props> = ({ navigate, role }) => {
  const { currentTenant } = useAppContext();
  const [showKhipuModal, setShowKhipuModal] = useState(false);
  const [showCashModal, setShowCashModal] = useState(false);
  const [showInformModal, setShowInformModal] = useState(false);
  const [informFile, setInformFile] = useState<File | null>(null);
  const [informAmount, setInformAmount] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'reviewing'>('pending');

  const [unitPath, setUnitPath] = useState<string>('Depto ...');

  const [unitId, setUnitId] = useState<string | null>(null);
  const [totalDebt, setTotalDebt] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [pastTransactions, setPastTransactions] = useState<any[]>([]);
  const [pendingTransactions, setPendingTransactions] = useState<{regular: any[], fines: any[]}>({ regular: [], fines: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentTenant) return;

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

        // Fetch all transactions related to this unit, joining with fines to get evidence
        const { data: txs } = await supabase
          .from('transactions')
          .select('*, fines(evidence_url)')
          .eq('tenant_id', currentTenant.id)
          .eq('unit_id', currentUnitId);

        if (txs) {
           const pendingTxs = txs.filter(t => t.status === 'pending');
           const debt = pendingTxs.reduce((sum, tx) => sum + Number(tx.amount), 0);
           
           const pendingFines = pendingTxs.filter(t => t.billing_month?.startsWith('Multa')).map(t => ({
              ...t,
              evidence_url: t.fines?.[0]?.evidence_url || null // Handle the join structure
           }));
           
           const pendingRegular = pendingTxs.filter(t => !t.billing_month?.startsWith('Multa'));
           
           setPendingTransactions({ regular: pendingRegular, fines: pendingFines });
           setTotalDebt(debt);
           
           const paidTxs = txs.filter(t => t.status !== 'pending')
             .map(t => ({
                ...t,
                evidence_url: t.fines?.[0]?.evidence_url || null
             }))
             .sort((a, b) => {
               return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });
           setPastTransactions(paidTxs);
        }

      } catch (err) {
         console.error('Error fetching debt:', err);
      } finally {
         setIsLoading(false);
      }
    };

    fetchDebt();

    // Realtime integration
    const channel = supabase.channel('public:transactions')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'transactions',
        filter: `tenant_id=eq.${currentTenant.id}`
      }, () => {
        fetchDebt();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentTenant]);

  const handleBack = () => {
    if (role === 'admin') navigate('AdminDashboard');
    else if (role === 'concierge') navigate('ConciergeDashboard');
    else navigate('ResidentServices');
  };

  const handleDirectTransfer = async () => {
    // Reemplazamos la lógica de simulación por validación real
    if (totalDebt === 0) {
       return; // No hay deuda que pagar
    }
    setShowKhipuModal(true);
  };

  const simulateKhipuPayment = async () => {
      setPaymentStatus('processing');
      
      try {
        // ... Khipu code ...
        setTimeout(async () => {
            if (userId && currentTenant && unitId) {
               await supabase
                 .from('transactions')
                 .update({ status: 'success', payment_date: new Date().toISOString() })
                 .eq('tenant_id', currentTenant.id)
                 .eq('unit_id', unitId)
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

  const handleInformPayment = async () => {
    if (!informFile || !userId || !currentTenant || !unitId || !informAmount) return;

    const numericAmount = parseFloat(informAmount.replace(/[^0-9]/g, ''));
    if (numericAmount !== totalDebt && totalDebt > 0) {
      const confirmProceed = window.confirm(`El monto ingresado ($${numericAmount}) es diferente a tu deuda actual ($${totalDebt}). ¿Deseas continuar?`);
      if (!confirmProceed) return;
    }

    setPaymentStatus('processing');
    try {
      const resizedFile = await resizeImage(informFile, 1200);
      const fakeReceiptUrl = URL.createObjectURL(resizedFile);

      await supabase
         .from('transactions')
         .update({ 
           status: 'reviewing',
           payment_date: new Date().toISOString(),
           receipt_url: fakeReceiptUrl,
           amount: numericAmount // update the transaction amount to what the user reported, or keep original? Keeping as user reported makes conciliation clearer.
         })
         .eq('tenant_id', currentTenant.id)
         .eq('unit_id', unitId)
         .eq('status', 'pending');

      setPaymentStatus('reviewing');
      setShowInformModal(false);
      setInformFile(null);
      setInformAmount('');
    } catch (err) {
      console.error(err);
      setPaymentStatus('pending');
    }
  };

  const handleDownloadPDF = async (tx: any) => {
    try {
       const doc = new jsPDF();
       const title = `Comprobante de Pago - ${currentTenant?.name || 'Ediflow'}`;
       
       // Generate Verification Hash
       const hashData = `${tx.id}-${tx.amount}-${tx.payment_date}`;
       const msgBuffer = new TextEncoder().encode(hashData);
       const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
       const hashArray = Array.from(new Uint8Array(hashBuffer));
       const verificationHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16).toUpperCase();

       // Styling the header
       doc.setFillColor(10, 10, 10);
       doc.rect(0, 0, 210, 40, 'F');
       
       doc.setTextColor(255, 255, 255);
       doc.setFontSize(22);
       doc.text("EDIFLOW", 20, 25);
       
       doc.setFontSize(10);
       doc.text("Transparencia en tu comunidad", 140, 25);

       doc.setTextColor(0, 0, 0);
       doc.setFontSize(18);
       doc.text(title, 20, 60);

       doc.setFontSize(12);
       doc.text(`Edificio RUT: ${currentTenant?.rut_edificio || 'N/A'}`, 20, 75);
       doc.text(`Unidad: Dpto ${unitPath.split(' - ')[1] || unitPath}`, 20, 85);
       doc.text(`Mes Facturado: ${tx.billing_month || 'N/A'}`, 20, 95);
       doc.text(`Fecha de Pago: ${tx.payment_date ? new Date(tx.payment_date).toLocaleDateString('es-CL') : 'N/A'}`, 20, 105);
       
       doc.setFontSize(14);
       doc.text(`Monto Pagado: $${Number(tx.amount).toLocaleString('es-CL')}`, 20, 125);
       doc.text(`Estado: PAGADO`, 20, 135);
       doc.text(`Referencia: ${tx.id.split('-')[0]}`, 20, 145);

       // Validation Hash
       doc.setTextColor(100, 100, 100);
       doc.setFontSize(8);
       doc.text(`DocHash: ${verificationHash}`, 20, 165);
       doc.text(`Verificable en: ediflow.cl/verify`, 20, 170);

       doc.save(`Comprobante_Pago_${tx.billing_month || 'GC'}.pdf`);
    } catch (e) {
       console.error("Error generating PDF", e);
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
                    
                    {totalDebt === 0 && paymentStatus !== 'success' && paymentStatus !== 'reviewing' ? (
                        <div className="flex flex-col items-center animate-fade-in-up">
                            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4 border border-green-500/20">
                                <span className="material-symbols-outlined text-4xl">check_circle</span>
                            </div>
                            <h2 className="text-4xl font-light text-white mb-2">$0</h2>
                            <p className="text-sm text-green-400 font-bold uppercase tracking-widest">¡Estás al día!</p>
                        </div>
                    ) : paymentStatus === 'success' ? (
                        <div className="flex flex-col items-center animate-fade-in-up">
                            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4 border border-green-500/20">
                                <span className="material-symbols-outlined text-4xl">check_circle</span>
                            </div>
                            <h2 className="text-4xl font-light text-white mb-2">$0</h2>
                            <p className="text-sm text-green-400 font-bold uppercase tracking-widest">¡Pagado con éxito!</p>
                        </div>
                    ) : paymentStatus === 'reviewing' ? (
                        <div className="flex flex-col items-center animate-fade-in-up">
                            <div className="w-20 h-20 bg-purple-500/10 text-purple-400 rounded-full flex items-center justify-center mb-4 border border-purple-500/20">
                                <span className="material-symbols-outlined text-4xl">hourglass_empty</span>
                            </div>
                            <h2 className="text-4xl font-light text-white mb-2">En Revisión</h2>
                            <p className="text-sm text-purple-400 font-bold uppercase tracking-widest">Tu pago está siendo verificado</p>
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
                                                {fine.evidence_url && (
                                                   <a 
                                                     href={fine.evidence_url} 
                                                     target="_blank" 
                                                     rel="noreferrer"
                                                     className="text-[9px] text-amber-500 font-bold hover:underline flex items-center gap-1 mt-1 uppercase tracking-wider"
                                                   >
                                                      <span className="material-symbols-outlined text-[12px]">visibility</span>
                                                      Ver Evidencia
                                                   </a>
                                                )}
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
                                onClick={() => setShowInformModal(true)}
                                className="w-full h-16 bg-[#111] hover:bg-white/10 text-white font-bold uppercase tracking-widest text-sm rounded-2xl transition-all border border-white/10 flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                <span className="material-symbols-outlined">upload_file</span>
                                Informar Pago (Comprobante)
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
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                tx.status === 'success' ? 'bg-green-500/10 text-green-500' :
                                tx.status === 'reviewing' ? 'bg-purple-500/10 text-purple-400' :
                                'bg-red-500/10 text-red-500'
                            }`}>
                                <span className="material-symbols-outlined">
                                    {tx.status === 'success' ? 'receipt_long' :
                                     tx.status === 'reviewing' ? 'hourglass_empty' : 'cancel'}
                                </span>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white mb-0.5">
                                    {tx.billing_month || 'Pago de Gastos Comunes'}
                                    {tx.status === 'reviewing' && <span className="ml-2 text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full inline-block">EN REVISIÓN</span>}
                                </h4>
                                <p className="text-[10px] text-gray-400 capitalize flex items-center gap-1 mt-0.5">
                                    <span className="material-symbols-outlined text-[12px]">{tx.status === 'reviewing' ? 'pending_actions' : 'event_available'}</span>
                                    {tx.payment_date ? `${tx.status === 'reviewing' ? 'Informado' : 'Pagado'} el ${new Date(tx.payment_date).toLocaleDateString('es-CL')} • ` : ''} 
                                    {tx.receipt_url ? 'Comprobante Subido' : tx.method || 'Digital'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-white">${Number(tx.amount).toLocaleString('es-CL')}</span>
                            <div className="flex items-center gap-2">
                                {tx.evidence_url && (
                                   <a 
                                      href={tx.evidence_url} 
                                      target="_blank" 
                                      rel="noreferrer"
                                      className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-amber-500 hover:bg-white/10 transition-colors"
                                      title="Ver Evidencia de Multa"
                                   >
                                       <span className="material-symbols-outlined text-[18px]">visibility</span>
                                   </a>
                                )}
                                {tx.receipt_url && (
                                    <a 
                                        href={tx.receipt_url} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-purple-400 hover:bg-white/10 transition-colors"
                                        title="Ver Comprobante Subido"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">receipt</span>
                                    </a>
                                )}
                                {tx.status === 'success' && (
                                    <button 
                                        onClick={() => {
                                           handleDownloadPDF(tx);
                                        }}
                                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-ediflow-primary hover:bg-white/10 transition-colors active:scale-90" 
                                        title="Descargar Boleta/Recibo PDF"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">download</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Add Knowledge Base / FAQ Section */}
        <section className="mt-8 px-6 md:px-0">
             <div className="bg-[#111] rounded-[2rem] border border-white/5 p-6 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#00AEEF]/5 rounded-full blur-[50px] pointer-events-none"></div>
                 <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00AEEF]">help</span>
                    Preguntas Frecuentes
                 </h3>
                 <div className="space-y-4">
                     <details className="group/faq cursor-pointer border-b border-white/5 pb-4 last:border-0 last:pb-0">
                         <summary className="text-sm text-gray-300 font-medium flex items-center justify-between hover:text-white transition-colors list-none">
                             ¿Cómo descargo y valido mi boleta?
                             <span className="material-symbols-outlined text-gray-500 group-open/faq:rotate-180 transition-transform">expand_more</span>
                         </summary>
                         <p className="text-[11px] text-gray-500 mt-2 leading-relaxed pl-2 border-l border-white/10">
                             En el historial de pagos, busca los pagos con estado verde y presiona el ícono de descarga. Todos los PDFs incluyen un <strong className="text-gray-300">DocHash de seguridad</strong> que garantiza su autenticidad.
                         </p>
                     </details>
                     <details className="group/faq cursor-pointer border-b border-white/5 pb-4 last:border-0 last:pb-0">
                         <summary className="text-sm text-gray-300 font-medium flex items-center justify-between hover:text-white transition-colors list-none">
                             ¿Qué significa que mi pago esté "En Revisión"?
                             <span className="material-symbols-outlined text-gray-500 group-open/faq:rotate-180 transition-transform">expand_more</span>
                         </summary>
                         <p className="text-[11px] text-gray-500 mt-2 leading-relaxed pl-2 border-l border-white/10">
                             Cuando informas un pago subiendo el comprobante, este entra en cola para que el Administrador valide los fondos en el Libro de Banco real del edificio. Esto suele tomar menos de 24 horas hábiles.
                         </p>
                     </details>
                     <details className="group/faq cursor-pointer border-b border-white/5 pb-4 last:border-0 last:pb-0">
                         <summary className="text-sm text-gray-300 font-medium flex items-center justify-between hover:text-white transition-colors list-none">
                             Tengo un saldo anterior que no reconozco
                             <span className="material-symbols-outlined text-gray-500 group-open/faq:rotate-180 transition-transform">expand_more</span>
                         </summary>
                         <p className="text-[11px] text-gray-500 mt-2 leading-relaxed pl-2 border-l border-white/10">
                             Los saldos anteriores pueden incluir multas, fondos de reserva pendientes o deudas arrastradas. Puedes contactar al comité en la sección de Comunicaciones del Edificio si necesitas que revisen tu caso puntual.
                         </p>
                     </details>
                 </div>
             </div>
        </section>

      </main>

      {/* Cash Payment Instructions Modal */}
      {showInformModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-center items-center p-4 animate-fade-in">
              <div className="bg-[#141414] rounded-3xl p-6 w-full max-w-sm border border-white/10 animate-fade-in-up text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-ediflow-primary"></div>
                  <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                      <span className="material-symbols-outlined text-3xl">upload_file</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Informar Pago</h3>
                  <p className="text-sm text-gray-300 leading-relaxed mb-6">
                      Sube una foto o PDF de tu comprobante de transferencia para que la administración lo valide.
                  </p>
                  
                  <div className="mb-6 text-left">
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-2 block">Monto Pagado ($)</label>
                      <input 
                         type="text"
                         placeholder={`Ej. ${totalDebt}`}
                         value={informAmount}
                         onChange={(e) => setInformAmount(e.target.value)}
                         className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ediflow-primary transition-colors font-mono"
                      />
                  </div>

                  <input 
                      type="file" 
                      id="receipt-upload" 
                      className="hidden" 
                      accept="image/*,.pdf"
                      onChange={(e) => {
                         if (e.target.files && e.target.files.length > 0) {
                            setInformFile(e.target.files[0]);
                         }
                      }}
                  />
                  <label 
                      htmlFor="receipt-upload"
                      className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl hover:border-ediflow-primary hover:bg-white/5 transition-colors mb-6"
                  >
                      {informFile ? (
                          <>
                              <span className="material-symbols-outlined text-green-400 text-3xl mb-2">check_circle</span>
                              <span className="text-sm text-white font-medium">{informFile.name}</span>
                          </>
                      ) : (
                          <>
                              <span className="material-symbols-outlined text-gray-400 text-3xl mb-2">add_photo_alternate</span>
                              <span className="text-sm text-gray-400 font-medium">Click para seleccionar</span>
                          </>
                      )}
                  </label>

                  <div className="flex gap-3">
                      <Button 
                          onClick={() => {
                             setShowInformModal(false);
                             setInformFile(null);
                          }}
                          variant="secondary"
                          className="flex-1"
                      >
                          Cancelar
                      </Button>
                      <Button 
                          onClick={handleInformPayment}
                          variant="primary"
                          className="flex-1"
                          disabled={!informFile || !informAmount}
                      >
                          Enviar
                      </Button>
                  </div>
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
