import React from 'react';
import { ScreenName } from '../App';

interface Props {
  navigate: (screen: ScreenName) => void;
}

const PaymentsScreen: React.FC<Props> = ({ navigate }) => {
  return (
    <div className="flex flex-col min-h-full bg-[#101c22]">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 pt-6 pb-4 bg-[#101c22] sticky top-0 z-30 border-b border-white/5">
        <button 
            onClick={() => navigate('ResidentServices')}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-90 transition-all text-white"
        >
            <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold tracking-tight text-white">Gastos Comunes</h1>
      </div>

      <div className="p-5 pb-24 space-y-6">
        
        {/* Main Card */}
        <div className="bg-gradient-to-br from-[#1c262c] to-[#151e24] p-6 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
                <p className="text-gray-400 text-sm font-medium mb-1">Total a Pagar (Noviembre)</p>
                <h2 className="text-4xl font-bold text-white mb-4">$85.400</h2>
                
                <div className="flex gap-3">
                    <button className="flex-1 bg-ediflow-primary hover:bg-yellow-400 text-black font-bold py-3 rounded-xl active:scale-95 transition-all">
                        Pagar Ahora
                    </button>
                    <button className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-xl text-white hover:bg-white/10 active:scale-90 transition-all">
                         <span className="material-symbols-outlined">download</span>
                    </button>
                </div>
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-white/5">account_balance_wallet</span>
        </div>

        {/* Details */}
        <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Detalle del Mes</h3>
            <div className="bg-[#1c262c] rounded-xl border border-white/5 divide-y divide-white/5">
                <div className="flex justify-between p-4">
                    <span className="text-gray-300 text-sm">Gasto Común Base</span>
                    <span className="text-white font-mono text-sm">$75.000</span>
                </div>
                <div className="flex justify-between p-4">
                    <span className="text-gray-300 text-sm">Fondo de Reserva</span>
                    <span className="text-white font-mono text-sm">$3.750</span>
                </div>
                <div className="flex justify-between p-4">
                    <span className="text-gray-300 text-sm">Agua Caliente</span>
                    <span className="text-white font-mono text-sm">$6.650</span>
                </div>
            </div>
        </div>

        {/* History */}
        <div>
             <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Historial de Pagos</h3>
             <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-[#1c262c] rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                            <span className="material-symbols-outlined text-lg">check</span>
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">Octubre 2023</p>
                            <p className="text-xs text-gray-500">Pagado el 05 Oct</p>
                        </div>
                    </div>
                    <span className="text-gray-300 font-mono text-sm">$82.100</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#1c262c] rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                            <span className="material-symbols-outlined text-lg">check</span>
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">Septiembre 2023</p>
                            <p className="text-xs text-gray-500">Pagado el 02 Sep</p>
                        </div>
                    </div>
                    <span className="text-gray-300 font-mono text-sm">$78.500</span>
                </div>
             </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentsScreen;