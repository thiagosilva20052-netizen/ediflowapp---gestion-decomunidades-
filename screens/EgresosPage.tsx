import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenName } from '../App';
import { Logo } from '../components/Logo';
import { supabase } from '../src/lib/supabase-client';

interface Props {
  navigate: (screen: ScreenName) => void;
}

interface Expense {
  id: string;
  provider: string;
  amount: number;
  date: string;
  category: string;
  status: 'Aprobado' | 'Pendiente';
  aiMatched?: boolean;
  receipt_url?: string | null;
  is_reserve_fund_expense?: boolean;
}

const EgresosPage: React.FC<Props> = ({ navigate }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState<string>('Extrayendo datos con IA');
  const [scannedInvoice, setScannedInvoice] = useState<Expense | null>(null);
  
  const [isImportingSueldos, setIsImportingSueldos] = useState(false);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tenantId, setTenantId] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isManualFormActive, setIsManualFormActive] = useState(false);
  const [manualFormData, setManualFormData] = useState({ provider: '', rut: '', amount: '', date: '', category: '', isReserveFund: false });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => stopCamera(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const init = async () => {
       const { data: { user } } = await supabase.auth.getUser();
       if (user) {
          const { data: profile } = await supabase.from('profiles').select('tenant_id').eq('id', user.id).single();
          if (profile) setTenantId(profile.tenant_id);
       }
       fetchExpenses();
    };
    init();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
         .from('expenses')
         .select('*')
         .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching expenses:', error);
        return;
      }
      if (data && data.length > 0) {
        const formatted = data.map(e => ({
          id: e.id,
          provider: e.description || 'Proveedor Genérico',
          amount: e.amount,
          date: new Date(e.date + 'T12:00:00Z').toLocaleDateString('es-CL'),
          category: e.category || 'Gastos Administrativos',
          status: (e.status as 'Aprobado' | 'Pendiente') || 'Aprobado',
          aiMatched: false,
          receipt_url: e.evidence_url
        }));
        setExpenses(formatted);
      } else {
        // Fallback or empty state mock
        setExpenses([
          { id: '1', provider: 'Enel Distribución', amount: 450000, date: '05-04-2026', category: 'Servicios Básicos', status: 'Aprobado', aiMatched: true },
          { id: '2', provider: 'Aguas Andinas', amount: 280000, date: '02-04-2026', category: 'Servicios Básicos', status: 'Aprobado', aiMatched: true },
          { id: '3', provider: 'Ascensores Schindler', amount: 350000, date: '01-04-2026', category: 'Mantenimiento', status: 'Aprobado', aiMatched: false },
          { id: '4', provider: 'Sueldos Conserjería', amount: 1200000, date: '28-03-2026', category: 'Remuneraciones', status: 'Aprobado', aiMatched: true },
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (err) {
      console.error("Error accessing camera:", err);
      showToast("No se pudo acceder a la cámara. Usa la subida manual.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const takePhoto = () => {
    stopCamera();
    setShowUploadModal(false);
    startOCRScan();
  };

  const handleManualUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setShowUploadModal(false);
      
      setIsScanning(true);
      setScanProgress(10);
      setScanStatus('Subiendo factura a Supabase Storage...');
      
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExt}`;
        const filePath = `${tenantId}/facturas/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('evidence') // Using 'evidence' bucket as configured in previous step
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('evidence')
          .getPublicUrl(filePath);

        setScanProgress(50);
        setScanStatus('Extrayendo datos con IA');
        
        // Simulating OCR extraction after upload
        setTimeout(() => {
          setScanProgress(100);
          setScannedInvoice({
            id: Date.now().toString(),
            provider: 'Mantención Jardines S.A.',
            amount: 125000,
            date: new Date().toLocaleDateString('es-CL'),
            category: 'Áreas Verdes',
            status: 'Pendiente',
            aiMatched: true,
            receipt_url: publicUrl
          });
        }, 1500);
        
      } catch (err) {
        console.error("Error subiendo a Supabase:", err);
        showToast("Error subiendo el archivo.");
        setIsScanning(false);
      }
      
      if (e.target) e.target.value = '';
    }
  };

  const handleManualSubmit = async () => {
    if (!manualFormData.provider || !manualFormData.amount || !manualFormData.category || !manualFormData.date) {
      showToast("Por favor, completa los campos requeridos.");
      return;
    }
    
    if (!tenantId) {
       showToast("Error de Tenant: Recarga la página por favor.");
       return;
    }

    const expenseAmount = parseFloat(manualFormData.amount);

    try {
      const { data: userProfile } = await supabase.auth.getUser();
      
      const { error } = await supabase.from('expenses').insert({
        tenant_id: tenantId,
        description: manualFormData.provider,
        amount: expenseAmount,
        date: manualFormData.date,
        category: manualFormData.category,
        status: 'Aprobado',
        created_by: userProfile?.user?.id || null,
      });

      if (error) throw error;
      
      showToast("Egreso registrado exitosamente.");
      setIsManualFormActive(false);
      setShowUploadModal(false);
      setManualFormData({ provider: '', rut: '', amount: '', date: '', category: '', isReserveFund: false });
      fetchExpenses();

    } catch (err) {
      console.error(err);
      showToast("Error al intentar registrar.");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSueldos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setIsImportingSueldos(true);
      showToast("Subiendo planilla a Supabase...");

      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `sueldos-${Date.now()}.${fileExt}`;
        const filePath = `${tenantId}/remuneraciones/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('evidence')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;

        const { data: { user } } = await supabase.auth.getUser();
        const today = new Date().toISOString().split('T')[0];

        if (tenantId) {
          await supabase.from('expenses').insert([
            {
                tenant_id: tenantId,
                description: 'Sueldos Líquidos (Nómina Bancaria)',
                amount: 2850000,
                date: today,
                category: 'Remuneraciones',
                status: 'Pendiente',
                created_by: user?.id || null
            }
          ]);
        }
        setIsImportingSueldos(false);
        showToast("Nómina importada correctamente.");
        fetchExpenses();
      } catch (err) {
        console.error(err);
        setIsImportingSueldos(false);
        showToast("Error al importar nómina.");
      }

      if (e.target) e.target.value = '';
    }
  };

  const startOCRScan = (initialProgress = 0) => {
    setIsScanning(true);
    setScanProgress(initialProgress);
    setScannedInvoice(null);
    setScanStatus('Extrayendo datos con IA');
    
    let progress = initialProgress;
    const interval = setInterval(() => {
      progress += 5;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setScannedInvoice({
            id: Date.now().toString(),
            provider: 'Mantención Jardines S.A.',
            amount: 125000,
            date: new Date().toLocaleDateString('es-CL'),
            category: 'Áreas Verdes',
            status: 'Pendiente',
            aiMatched: true
          });
        }, 600);
      }
    }, 100);
  };

  const saveInvoice = async () => {
    if (scannedInvoice && tenantId) {
      try {
        const { data: userProfile } = await supabase.auth.getUser();
        let isoDate = new Date().toISOString().split('T')[0];
        if (scannedInvoice.date.includes('/')) {
            const parts = scannedInvoice.date.split('/');
            if(parts.length === 3 && parts[2].length === 4) {
               isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`; 
            }
        }

        const { error } = await supabase.from('expenses').insert({
          tenant_id: tenantId,
          description: scannedInvoice.provider,
          amount: scannedInvoice.amount,
          date: isoDate,
          category: scannedInvoice.category,
          status: 'Aprobado',
          evidence_url: scannedInvoice.receipt_url || null,
          created_by: userProfile?.user?.id || null,
        });

        if (error) throw error;

        setIsScanning(false);
        setScannedInvoice(null);
        showToast("Factura registrada exitosamente.");
        fetchExpenses();
      } catch(err) {
         console.error(err);
         showToast("Error al guardar factura.");
      }
    }
  };

  const totalEgresos = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white font-sans overflow-hidden relative">
      
      {/* Upload Method Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6"
          >
            <button 
              onClick={() => {
                setShowUploadModal(false);
                setIsManualFormActive(false);
                if (isCameraActive) stopCamera();
              }}
              className="absolute top-8 right-8 w-12 h-12 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 rounded-full flex items-center justify-center text-white active:scale-95 transition-all z-50"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {isCameraActive ? (
              <div className="w-full max-w-sm flex flex-col items-center relative">
                <div className="w-full aspect-[3/4] border border-ediflow-primary/30 rounded-[2rem] relative overflow-hidden mb-8 bg-[#0A0A0A] shadow-[0_0_80px_rgba(0,174,239,0.15)]">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                  {/* Scanning Overlay */}
                  <div className="absolute inset-0 pointer-events-none border-[12px] border-[#0A0A0A]/50 flex p-4">
                     <div className="w-full h-full border-2 border-ediflow-primary/50 border-dashed rounded-lg" />
                  </div>
                </div>
                <button 
                  onClick={takePhoto}
                  className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl border-4 border-white pb-[2px]"
                >
                   <div className="w-16 h-16 rounded-full border border-black/20 bg-gray-200"></div>
                </button>
                <p className="mt-4 text-xs text-gray-400 font-bold uppercase tracking-widest">Enfoca la factura y captura</p>
              </div>
            ) : (
                 <div className="w-full max-w-4xl bg-[#111] p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-y-auto max-h-[90vh]">
                  <h3 className="text-3xl font-bold tracking-tight text-white mb-2 text-center">Registrar Egreso</h3>
                  <p className="text-gray-400 text-sm mb-10 text-center font-medium">Selecciona el método de captura de la factura.</p>
                  
                  {isManualFormActive ? (
                     <div className="space-y-6 max-w-2xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Proveedor (Razón Social)</label>
                             <input 
                               type="text" 
                               value={manualFormData.provider}
                               onChange={(e) => setManualFormData({...manualFormData, provider: e.target.value})}
                               className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ediflow-primary/50 transition-colors"
                             />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">RUT Proveedor</label>
                             <input 
                               type="text" 
                               value={manualFormData.rut}
                               onChange={(e) => setManualFormData({...manualFormData, rut: e.target.value})}
                               className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ediflow-primary/50 transition-colors"
                             />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Monto ($)</label>
                             <input 
                               type="number" 
                               value={manualFormData.amount}
                               onChange={(e) => setManualFormData({...manualFormData, amount: e.target.value})}
                               className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ediflow-primary/50 transition-colors font-mono"
                             />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Fecha</label>
                             <input 
                               type="date" 
                               value={manualFormData.date}
                               onChange={(e) => setManualFormData({...manualFormData, date: e.target.value})}
                               className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ediflow-primary/50 transition-colors"
                             />
                           </div>
                           <div className="space-y-2 md:col-span-2">
                             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Categoría</label>
                             <select
                               value={manualFormData.category}
                               onChange={(e) => setManualFormData({...manualFormData, category: e.target.value})}
                               className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ediflow-primary/50 transition-colors appearance-none"
                             >
                               <option value="">Seleccione categoría...</option>
                               <option value="Mantenimiento">Mantenimiento</option>
                               <option value="Servicios Básicos">Servicios Básicos</option>
                               <option value="Gastos Administrativos">Gastos Administrativos</option>
                               <option value="Remuneraciones">Remuneraciones</option>
                               <option value="Seguros">Seguros</option>
                             </select>
                           </div>
                           <div className="space-y-2 md:col-span-2">
                             <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border transition-colors bg-[#0A0A0A] border-white/10 hover:border-white/20">
                               <input 
                                 type="checkbox" 
                                 checked={manualFormData.isReserveFund}
                                 onChange={(e) => setManualFormData({...manualFormData, isReserveFund: e.target.checked})}
                                 className="w-5 h-5 rounded border-gray-600 bg-transparent text-ediflow-primary focus:ring-ediflow-primary focus:ring-offset-0 transition-colors"
                               />
                               <span className="text-sm font-medium text-gray-300">Este saldo se cubrirá con el Fondo de Reserva</span>
                             </label>
                           </div>
                        </div>
                        <div className="flex gap-4 pt-6">
                           <button 
                              onClick={() => setIsManualFormActive(false)}
                              className="flex-1 border border-white/10 bg-transparent text-white px-6 py-4 rounded-xl font-bold hover:bg-white/5 transition-colors"
                           >
                              Volver
                           </button>
                           <button 
                              onClick={handleManualSubmit}
                              className="flex-[2] bg-ediflow-primary text-black px-6 py-4 rounded-xl font-bold hover:bg-ediflow-primary/90 transition-colors shadow-[0_0_20px_rgba(0,174,239,0.3)]"
                           >
                              Guardar Egreso
                           </button>
                        </div>
                     </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <button 
                          onClick={startCamera}
                          className="bg-gradient-to-br from-[#111] to-[#1A1A1A] p-8 rounded-[2rem] border border-white/5 hover:border-ediflow-primary/30 transition-all flex flex-col items-center justify-center text-center group cursor-pointer relative overflow-hidden"
                       >
                          <div className="absolute inset-0 bg-ediflow-primary/5 opacity-0 group-hover:opacity-100 transition-colors"></div>
                          <div className="w-16 h-16 rounded-full bg-ediflow-primary/10 text-ediflow-primary flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[28px]">photo_camera</span>
                          </div>
                          <h4 className="text-xl font-bold text-white mb-2">Cámara / Scan</h4>
                          <p className="text-xs text-gray-400">Toma una foto de la factura con tu dispositivo.</p>
                       </button>
                       
                       <div className="relative">
                          <input 
                             type="file" 
                             id="manual-upload" 
                             className="hidden" 
                             onChange={handleManualUpload} 
                             accept=".pdf,image/*"
                          />
                          <label 
                             htmlFor="manual-upload"
                             className="h-full bg-gradient-to-br from-[#111] to-[#1A1A1A] p-8 rounded-[2rem] border border-white/5 hover:border-purple-500/30 transition-all flex flex-col items-center justify-center text-center group cursor-pointer relative overflow-hidden"
                          >
                             <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-colors"></div>
                             <div className="w-16 h-16 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                               <span className="material-symbols-outlined text-[28px]">upload_file</span>
                             </div>
                             <h4 className="text-xl font-bold text-white mb-2">Subida Archivo</h4>
                             <p className="text-xs text-gray-400">Sube un archivo PDF o imagen desde tu equipo.</p>
                          </label>
                       </div>

                       <button 
                          onClick={() => setIsManualFormActive(true)}
                          className="bg-gradient-to-br from-[#111] to-[#1A1A1A] p-8 rounded-[2rem] border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col items-center justify-center text-center group cursor-pointer relative overflow-hidden"
                       >
                          <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-colors"></div>
                          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[28px]">edit_document</span>
                          </div>
                          <h4 className="text-xl font-bold text-white mb-2">Formulario Manual</h4>
                          <p className="text-xs text-gray-400">Digita los datos del egreso sin usar IA.</p>
                       </button>
                    </div>
                  )}
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-12 left-1/2 z-50 bg-emerald-500 text-black px-6 py-3 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] font-bold text-sm flex items-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="px-6 md:px-12 pt-12 pb-6 flex items-center justify-between sticky top-0 z-30 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 no-print">
        <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate('AdminDashboard')}
              className="w-12 h-12 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all shadow-lg"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Egresos <span className="font-serif italic font-normal text-ediflow-primary">y Facturas</span></h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px] text-ediflow-primary">finance_mode</span>
                La Billetera de la Comunidad
              </p>
            </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
           <button 
             onClick={() => navigate('ProrrateoPage')}
             className="px-6 py-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all text-xs font-bold flex items-center gap-2"
           >
             <span className="material-symbols-outlined text-[18px]">calculate</span>
             Cierre de Mes
           </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 md:px-12 py-10 max-w-7xl mx-auto w-full">
        
        {/* KPI & Flow Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
          
          {/* Main Hero Card */}
          <div className="lg:col-span-2 bg-[#111] p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-ediflow-primary/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-ediflow-primary/10 transition-colors"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 h-full">
              <div className="flex-1">
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-ediflow-primary"></span>
                  Gasto Mensual Acumulado
                </p>
                <h2 className="text-5xl md:text-6xl font-light text-white tracking-tight">${totalEgresos.toLocaleString('es-CL')}</h2>
                
                <div className="flex items-center gap-4 mt-6 flex-wrap">
                  <div className="bg-[#1A1A1A] border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Reserva (5%)</span>
                    <span className="text-sm font-bold text-emerald-400">${(totalEgresos * 0.05).toLocaleString('es-CL')}</span>
                  </div>
                </div>
              </div>
            </div>
            <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-[180px] text-white/5 -rotate-12 pointer-events-none">money_off</span>
          </div>

          {/* AI Scanner Trigger */}
          <button 
            onClick={() => setShowUploadModal(true)} 
            className="col-span-1 bg-gradient-to-br from-[#111] to-[#1A1A1A] p-6 lg:p-8 rounded-[2.5rem] border border-white/5 hover:border-ediflow-primary/30 active:scale-[0.98] transition-all flex flex-col justify-center items-center text-center group relative overflow-hidden shadow-xl"
          >
            <div className="absolute inset-0 bg-ediflow-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-16 h-16 rounded-full bg-ediflow-primary/10 text-ediflow-primary flex items-center justify-center mb-4 shadow-inner group-hover:scale-110 transition-transform group-hover:shadow-[0_0_30px_rgba(0,174,239,0.3)]">
              <span className="material-symbols-outlined text-[28px]">document_scanner</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Registrar Egreso</h3>
            <p className="text-[10px] text-gray-400 font-medium leading-relaxed max-w-[200px] mx-auto hidden lg:block">
              Sube PDF, captura foto o ingresa manualmente.
            </p>
          </button>

          {/* Previred Trigger */}
          <div className="col-span-1 relative flex">
             <input 
                 type="file" 
                 id="sueldos-upload" 
                 className="hidden" 
                 onChange={handleSueldos} 
                 accept=".csv,.xls,.xlsx"
             />
             <label 
               htmlFor={isImportingSueldos ? '' : 'sueldos-upload'}
               onClick={(e) => {
                  if (isImportingSueldos) e.preventDefault();
               }}
               className={`w-full cursor-pointer bg-gradient-to-br from-[#111] to-[#1A1A1A] p-6 lg:p-8 rounded-[2.5rem] border border-white/5 ${isImportingSueldos ? 'opacity-50 cursor-not-allowed' : 'hover:border-emerald-500/30 active:scale-[0.98]'} transition-all flex flex-col justify-center items-center text-center group relative overflow-hidden shadow-xl`}
             >
               <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 shadow-inner group-hover:scale-110 transition-transform group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                 <span className={`material-symbols-outlined text-[28px] ${isImportingSueldos ? 'animate-spin' : ''}`}>{isImportingSueldos ? 'sync' : 'group'}</span>
               </div>
               <h3 className="text-lg font-bold text-white mb-2">{isImportingSueldos ? 'Subiendo a Supabase...' : 'Sueldos (RRHH)'}</h3>
               <p className="text-[10px] text-gray-400 font-medium leading-relaxed max-w-[200px] mx-auto hidden lg:block">
                 Sube tú planilla Previred o Nomina Excel.
               </p>
             </label>
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-[2rem] p-6 mb-10 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <span className="material-symbols-outlined">lightbulb</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-blue-400 mb-1">Predicción de Flujo de Caja</h4>
            <p className="text-sm text-gray-300 leading-relaxed font-light">
              Basado en el historial, proyectamos un aumento del <strong>15% en consumo de gas</strong> para el próximo mes debido a calefacción. Se sugiere reservar $400.000 extra temporales en el presupuesto.
            </p>
          </div>
        </div>

        {/* Expenses List */}
        <div>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] pl-2">Detalle de Egresos</h2>
            <button className="text-xs text-ediflow-primary font-bold hover:underline">Ver Historial</button>
          </div>
          
          <div className="bg-[#111] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
            {expenses.map((expense) => (
              <div key={expense.id} className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-[#141414] transition-colors border-b border-white/5 last:border-0 group cursor-pointer relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-center gap-5 w-full md:w-auto">
                  <div className="w-12 h-12 rounded-[1.25rem] bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors shrink-0">
                    <span className="material-symbols-outlined">receipt</span>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                      {expense.provider}
                      {expense.aiMatched && (
                        <span className="bg-ediflow-primary/20 text-ediflow-primary text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-sm font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[10px]">auto_awesome</span> IA
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">{expense.category} · {expense.date}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full md:w-auto gap-8">
                  <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${expense.status === 'Aprobado' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {expense.status}
                  </span>
                  <div className="text-right">
                    <span className="text-xl font-medium text-white block">${expense.amount.toLocaleString('es-CL')}</span>
                    {expense.receipt_url && (
                      <a 
                        href={expense.receipt_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[10px] text-ediflow-primary font-bold hover:underline flex items-center gap-1 justify-end mt-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">visibility</span>
                        Ver Comprobante
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* OCR Scanner Overlay Modal */}
      <AnimatePresence>
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6"
          >
            <button 
              onClick={() => setIsScanning(false)}
              className="absolute top-8 right-8 w-12 h-12 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 rounded-full flex items-center justify-center text-white active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {!scannedInvoice ? (
              <div className="w-full max-w-sm flex flex-col items-center">
                <div className="w-full aspect-[3/4] border border-ediflow-primary/30 rounded-[2rem] relative overflow-hidden mb-8 flex items-center justify-center bg-[#0A0A0A] shadow-[0_0_80px_rgba(0,174,239,0.15)]">
                  <span className="material-symbols-outlined text-[80px] text-white/5">receipt_long</span>
                  
                  {/* Scanning Laser */}
                  <motion.div 
                    animate={{ top: [`0%`, `100%`, `0%`] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute left-0 w-full h-[2px] bg-ediflow-primary shadow-[0_0_20px_rgba(0,174,239,1)]"
                  />
                  <div 
                    className="absolute bottom-0 left-0 w-full bg-ediflow-primary/20 transition-all duration-100"
                    style={{ height: `${100 - scanProgress}%` }}
                  />
                </div>
                <h3 className="text-white font-bold text-2xl tracking-tight mb-2">Procesando Documento</h3>
                <p className="text-ediflow-primary text-sm mb-8 text-center uppercase tracking-widest font-bold text-[10px] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">
                    {scanStatus.includes('Supabase') ? 'cloud_upload' : 'auto_awesome'}
                  </span> 
                  {scanStatus}
                </p>
                
                <div className="w-full h-1 bg-[#111] rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-ediflow-primary transition-all duration-150 relative"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-md bg-[#111] rounded-[2.5rem] p-8 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute -top-32 -left-32 w-[250px] h-[250px] bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none"></div>
                
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-emerald-500/20">
                  <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
                
                <h3 className="text-white font-bold text-3xl text-center mb-8 tracking-tight">Lectura Exitosa</h3>
                
                <div className="space-y-4 mb-10 relative z-10">
                  <div className="bg-[#050505] p-5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Proveedor (RUT Encontrado)</p>
                    <p className="text-white font-medium text-lg">{scannedInvoice.provider}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#050505] p-5 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Monto Líquido</p>
                      <p className="text-ediflow-primary font-bold text-2xl">${scannedInvoice.amount.toLocaleString('es-CL')}</p>
                    </div>
                    <div className="bg-[#050505] p-5 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Fecha Emisión</p>
                      <p className="text-white font-medium text-lg">{scannedInvoice.date}</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#050505] p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Categoría</p>
                      <p className="text-white font-medium text-lg">{scannedInvoice.category}</p>
                    </div>
                    <span className="bg-ediflow-primary/20 text-ediflow-primary text-[10px] uppercase font-bold px-3 py-1 rounded-sm">Sugerencia IA</span>
                  </div>
                </div>

                <div className="flex gap-4 relative z-10">
                  <button 
                    onClick={() => setIsScanning(false)}
                    className="flex-1 py-4 rounded-xl font-bold text-gray-400 border border-white/10 hover:text-white hover:bg-white/5 transition-all text-sm"
                  >
                    Descartar
                  </button>
                  <button 
                    onClick={saveInvoice}
                    className="flex-[2] py-4 rounded-xl font-bold text-black bg-ediflow-primary hover:bg-white transition-all shadow-[0_0_20px_rgba(0,174,239,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] text-sm"
                  >
                    Confirmar Gasto
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EgresosPage;
