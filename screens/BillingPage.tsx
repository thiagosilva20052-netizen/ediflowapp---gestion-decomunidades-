import React, { useState, useEffect } from 'react';
import { useAppContext } from '../src/context/AppContext';
import { supabase } from '../src/lib/supabase-client';

export const BillingPage: React.FC<{ onLogout: () => void, navigate: any }> = ({ onLogout, navigate }) => {
  const { currentTenant } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [unitsCount, setUnitsCount] = useState<number>(0);
  const [isLoadingCount, setIsLoadingCount] = useState(true);

  useEffect(() => {
    const fetchUnits = async () => {
      if (!currentTenant) return;
      setIsLoadingCount(true);
      try {
        const { count, error } = await supabase
          .from('units')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', currentTenant.id);
        
        if (error) throw error;
        setUnitsCount(count || 0);
      } catch (err) {
        console.error("Error fetching units count:", err);
      } finally {
        setIsLoadingCount(false);
      }
    };
    fetchUnits();
  }, [currentTenant]);

  const billedUnits = Math.max(unitsCount, 40);
  const currentPrice = billedUnits * 2000;

  const handlePaymentClick = async () => {
    setIsProcessing(true);
    try {
      // Create MercadoPago preference checkout
      const response = await fetch('/api/checkout/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tenantId: currentTenant?.id
        })
      });

      if (!response.ok) {
         throw new Error("No pudimos conectar con Mercado Pago");
      }
      
      const { init_point } = await response.json();
      window.location.href = init_point;
    } catch (e) {
      console.error(e);
      alert("Error al inicializar pago. El Servidor Express debe estar corriendo.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="max-w-md w-full bg-[#111] border border-white/10 rounded-[2rem] p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00AEEF]/10 blur-[40px] rounded-full pointer-events-none"></div>
        <div className="mb-6 mx-auto w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center rounded-full animate-pulse-slow">
           <span className="material-symbols-outlined text-[32px]">timer_off</span>
        </div>
        <h1 className="text-3xl font-light tracking-tight mb-2">Tu prueba ha finalizado</h1>
        <p className="text-gray-400 text-sm mb-4">Para continuar utilizando el sistema operativo para tu edificio, selecciona un plan y asegura la membresía mensual.</p>

        {isLoadingCount ? (
          <div className="text-sm text-gray-500 my-8 animate-pulse">Calculando plan...</div>
        ) : (
          <div className="border border-white/5 bg-white/5 rounded-2xl p-6 mb-8 text-left relative">
             <div className="absolute -top-3 -right-3 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.4)] border border-green-400">
               Cero Comisiones por Transferencia
             </div>
             <h3 className="text-xl font-bold mb-1">Plan Pro</h3>
             <p className="text-sm text-gray-400 mb-2">Tu comunidad tiene {unitsCount} unidades registradas.</p>
             <p className="text-[#00AEEF] text-3xl font-light tracking-tight mb-4">${currentPrice.toLocaleString('es-CL')} <span className="text-sm text-gray-500 font-normal">CLP /mes</span></p>
             <ul className="text-sm text-gray-400 space-y-3 font-medium">
               <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[#00AEEF] text-[16px]">check</span> Torre de control Ilimitada</li>
               <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[#00AEEF] text-[16px]">check</span> Soporte Prioritario AI</li>
               <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[#00AEEF] text-[16px]">check</span> Edge Functions Integradas</li>
               <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[#00AEEF] text-[16px]">check</span> Cero comisiones por transferencia</li>
             </ul>
          </div>
        )}

        <button 
           onClick={handlePaymentClick} 
           disabled={isProcessing || isLoadingCount}
           className="w-full bg-[#00AEEF] hover:bg-[#0098D1] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_15px_rgba(0,174,239,0.3)] hover:shadow-[0_0_25px_rgba(0,174,239,0.5)] disabled:opacity-50"
        >
          {isProcessing ? 'Conectando seguro...' : 'Pagar con Mercado Pago'}
        </button>

        <button onClick={onLogout} className="mt-6 text-xs text-gray-500 hover:text-white uppercase tracking-widest font-bold transition-colors">
           Volver al Inicio
        </button>
      </div>
    </div>
  );
};
