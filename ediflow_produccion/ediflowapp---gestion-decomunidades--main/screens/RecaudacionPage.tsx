import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenName } from '../App';
import { supabase } from '../src/lib/supabase-client';
import { useAppContext } from '../src/context/AppContext';

interface Props {
  navigate: (screen: ScreenName) => void;
}

interface BankMovement {
  id: string;
  date: string;
  reference: string;
  amount: number;
  sender: string;
  suggestedUnit: string | null;
  confidence: number;
  isApproved: boolean;
  matchingReason: string | null;
  status: string;
}

const RecaudacionPage: React.FC<Props> = ({ navigate }) => {
  const { currentTenant, currentUser } = useAppContext();
  const [isConciliating, setIsConciliating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [movements, setMovements] = useState<BankMovement[]>([]);
  const [matchResult, setMatchResult] = useState<{ high: number; medium: number; low: number } | null>(null);
  const [currentPeriod, setCurrentPeriod] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth()).padStart(2, '0')}`;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch bank movements + reported payments
  useEffect(() => {
    if (!currentTenant) return;
    fetchMovements();
  }, [currentTenant, matchResult]);

  const fetchMovements = async () => {
    if (!currentTenant) return;

    // Fetch bank movements (conciliated + pending)
    const { data: bankData, error: bankError } = await supabase
      .from('bank_movements')
      .select('*, units(unit_number)')
      .eq('tenant_id', currentTenant.id)
      .order('created_at', { ascending: false });

    if (bankError) {
      console.error('Error fetching bank movements:', bankError);
      return;
    }

    // Fetch reported payments (transactions in reviewing status)
    const { data: txData, error: txError } = await supabase
      .from('transactions')
      .select('*, profiles(full_name), units(unit_number)')
      .eq('tenant_id', currentTenant.id)
      .eq('status', 'reviewing')
      .order('created_at', { ascending: false });

    if (txError) {
      console.error('Error fetching transactions:', txError);
      return;
    }

    const mapped: BankMovement[] = [];

    // Map bank movements
    if (bankData) {
      bankData.forEach((bm: any) => {
        mapped.push({
          id: bm.id,
          date: bm.movement_date
            ? new Date(bm.movement_date).toLocaleDateString('es-CL')
            : new Date(bm.created_at).toLocaleDateString('es-CL'),
          reference: bm.reference || '',
          amount: Number(bm.amount),
          sender: bm.reference || 'Movimiento bancario',
          suggestedUnit: bm.units?.unit_number || null,
          confidence: bm.confidence === 'high' ? 98 : bm.confidence === 'medium' ? 85 : 30,
          isApproved: bm.status === 'matched',
          matchingReason: bm.matching_reason,
          status: bm.status,
        });
      });
    }

    // Map reviewing transactions as pending entries
    if (txData) {
      txData.forEach((tx: any) => {
        const alreadyMapped = mapped.find(
          (m) => m.suggestedUnit === tx.units?.unit_number && m.amount === Number(tx.amount)
        );
        if (!alreadyMapped) {
          mapped.push({
            id: tx.id,
            date: new Date(tx.created_at).toLocaleDateString('es-CL'),
            reference: tx.external_reference || '',
            amount: Number(tx.amount),
            sender: tx.profiles?.full_name || 'Pago informado',
            suggestedUnit: tx.units?.unit_number || null,
            confidence: tx.units?.unit_number ? 90 : 50,
            isApproved: false,
            matchingReason: tx.units?.unit_number ? 'Pago informado por residente' : 'Sin unidad asignada',
            status: 'reviewing',
          });
        }
      });
    }

    setMovements(mapped);
  };

  // Real conciliation via RPC
  const handleConciliate = async () => {
    if (!currentTenant) {
      showToast('Error: No hay edificio seleccionado');
      return;
    }

    setIsConciliating(true);
    try {
      const { data, error } = await supabase.rpc('run_reconciliation_matching', {
        p_tenant_id: currentTenant.id,
        p_period: currentPeriod,
      });

      if (error) throw error;

      const result = data as { high_matches: number; medium_matches: number; low_matches: number };
      setMatchResult({
        high: result.high_matches,
        medium: result.medium_matches,
        low: result.low_matches,
      });

      const total = result.high_matches + result.medium_matches + result.low_matches;
      showToast(`Conciliación completada: ${total} movimientos procesados (${result.high_matches} alta, ${result.medium_matches} media, ${result.low_matches} baja)`);
    } catch (err: any) {
      console.error('Conciliation error:', err);
      showToast('Error en conciliación: ' + (err.message || 'Error desconocido'));
    } finally {
      setIsConciliating(false);
    }
  };

  // Parse CSV and insert into bank_movements
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentTenant) return;

    try {
      const text = await file.text();
      const lines = text.split('\n').filter((l) => l.trim());
      if (lines.length < 2) {
        showToast('El archivo CSV necesita al menos una fila de datos');
        return;
      }

      const header = lines[0].toLowerCase();
      const dateIdx = header.includes('fecha') ? header.split(',').findIndex((c) => c.includes('fecha')) : 0;
      const refIdx = header.includes('referencia') || header.includes('descripcion') || header.includes('glosa')
        ? header.split(',').findIndex((c) => c.includes('referencia') || c.includes('descripcion') || c.includes('glosa'))
        : 1;
      const amountIdx = header.includes('monto') || header.includes('importe')
        ? header.split(',').findIndex((c) => c.includes('monto') || c.includes('importe'))
        : 2;

      const rows = lines.slice(1).map((line) => {
        const cols = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
        return {
          movement_date: cols[dateIdx] || new Date().toISOString().split('T')[0],
          reference: cols[refIdx] || '',
          amount: parseFloat(cols[amountIdx]?.replace(/[^0-9.-]/g, '') || '0'),
        };
      }).filter((r) => r.reference && r.amount > 0);

      if (rows.length === 0) {
        showToast('No se encontraron movimientos válidos en el archivo');
        return;
      }

      const { error } = await supabase.from('bank_movements').insert(
        rows.map((r) => ({
          tenant_id: currentTenant.id,
          reference: r.reference,
          amount: r.amount,
          movement_date: r.movement_date,
          status: 'pending',
        }))
      );

      if (error) throw error;

      showToast(`${rows.length} movimientos importados correctamente`);
      await fetchMovements();
    } catch (err: any) {
      console.error('File upload error:', err);
      showToast('Error al procesar archivo: ' + (err.message || 'Formato inválido'));
    }

    // Reset file input
    e.target.value = '';
  };

  // Approve a match
  const approveMatch = async (mov: BankMovement) => {
    if (mov.status === 'reviewing') {
      // It's a transaction — update status to success
      const { error } = await supabase
        .from('transactions')
        .update({ status: 'success' })
        .eq('id', mov.id);

      if (error) {
        showToast('Error al validar pago.');
        return;
      }
    } else {
      // It's a bank movement — mark as matched
      const { error } = await supabase
        .from('bank_movements')
        .update({ status: 'matched' })
        .eq('id', mov.id);

      if (error) {
        showToast('Error al aprobar match.');
        return;
      }
    }

    // Audit log
    if (currentTenant && currentUser) {
      await supabase.from('audit_logs').insert({
        tenant_id: currentTenant.id,
        user_id: currentUser.id,
        action: 'Conciliación de Pago',
        details: `Match de ${mov.id} aprobado. Unidad ${mov.suggestedUnit || 'N/A'}, monto $${mov.amount.toLocaleString('es-CL')}.`,
        module: 'finance',
        severity: 'info',
      });
    }

    setMovements((prev) => prev.map((m) => (m.id === mov.id ? { ...m, isApproved: true } : m)));
    showToast('Pago validado correctamente.');
  };

  // KPIs calculated from real data
  const kpis = useMemo(() => {
    const allAmount = movements.reduce((sum, m) => sum + m.amount, 0);
    const matched = movements.filter((m) => m.isApproved || m.status === 'matched');
    const matchedAmount = matched.reduce((sum, m) => sum + m.amount, 0);
    const unmatchedAmount = allAmount - matchedAmount;
    const pct = allAmount > 0 ? Math.round((matchedAmount / allAmount) * 100) : 0;

    return { allAmount, matchedAmount, unmatchedAmount, pct, matchedCount: matched.length, totalCount: movements.length };
  }, [movements]);

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white font-sans overflow-hidden relative">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-12 left-1/2 z-50 bg-purple-500 text-white px-6 py-3 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] font-bold text-sm flex items-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="px-6 md:px-12 pt-12 pb-6 flex items-center justify-between sticky top-0 z-30 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate('ManageExpenses')}
            className="w-12 h-12 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
              Recaudación <span className="font-serif italic font-normal text-purple-400">Automatizada</span>
            </h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px] text-purple-400">account_balance</span>
              Conciliación Bancaria con IA
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="month"
            value={currentPeriod}
            onChange={(e) => setCurrentPeriod(e.target.value)}
            className="bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500/50"
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 md:px-12 py-10 max-w-7xl mx-auto w-full space-y-10">
        {/* KPIs reales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#111] p-6 rounded-[2rem] border border-white/5 shadow-lg relative overflow-hidden group">
            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-1">Total Movimientos</p>
            <h3 className="text-4xl font-light text-white">
              ${kpis.allAmount.toLocaleString('es-CL')}
            </h3>
            <p className="text-[10px] text-gray-400 mt-2">
              {kpis.totalCount} movimientos importados
            </p>
          </div>
          <div className="bg-[#111] p-6 rounded-[2rem] border border-white/5 shadow-lg relative overflow-hidden group border-b-2 border-b-purple-500">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-[30px] rounded-full pointer-events-none transition-colors"></div>
            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-1">Pagos Identificados</p>
            <h3 className="text-4xl font-light text-purple-400">
              ${kpis.matchedAmount.toLocaleString('es-CL')}
            </h3>
            <p className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[12px]">trending_up</span>{' '}
              {kpis.pct}% conciliado
            </p>
          </div>
          <div className="bg-[#111] p-6 rounded-[2rem] border border-white/5 shadow-lg relative overflow-hidden group">
            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-1">Pendiente</p>
            <h3 className="text-4xl font-light text-white">
              ${kpis.unmatchedAmount.toLocaleString('es-CL')}
            </h3>
            <p className="text-[10px] text-red-400 mt-2 flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[12px]">warning</span>{' '}
              {kpis.unmatchedAmount > 0 ? 'Acción requerida' : 'Todo al día'}
            </p>
          </div>
        </div>

        {/* Match results summary */}
        {matchResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-4"
          >
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-emerald-400">{matchResult.high}</p>
              <p className="text-xs text-emerald-300/70 uppercase tracking-widest font-semibold mt-1">Alta Confianza</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-amber-400">{matchResult.medium}</p>
              <p className="text-xs text-amber-300/70 uppercase tracking-widest font-semibold mt-1">Media Confianza</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-red-400">{matchResult.low}</p>
              <p className="text-xs text-red-300/70 uppercase tracking-widest font-semibold mt-1">Revisión Manual</p>
            </div>
          </motion.div>
        )}

        {/* Action Panel */}
        <div className="bg-gradient-to-br from-[#111] to-[#1A1A1A] p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest">
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                Asistente de Recaudación
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Conciliación Automática</h2>
              <p className="text-gray-400 text-sm leading-relaxed font-light">
                Importa la cartola bancaria (CSV con columnas: fecha, referencia, monto). El motor de IA emparejará cada movimiento con la unidad correspondiente según referencia, monto esperado y patrones históricos.
              </p>
            </div>
            <div className="flex flex-col w-full md:w-auto shrink-0 gap-4">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileUpload}
                accept=".csv"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer px-8 py-4 rounded-2xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-3 bg-white/10 text-white border border-white/10 hover:bg-white/20"
              >
                <span className="material-symbols-outlined">upload_file</span>
                Importar Cartola (CSV)
              </label>

              <button
                onClick={handleConciliate}
                disabled={isConciliating || movements.length === 0}
                className={`px-8 py-5 rounded-2xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-3 ${
                  isConciliating
                    ? 'bg-purple-500/50 text-white cursor-wait'
                    : movements.length === 0
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-500 text-white hover:bg-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.3)]'
                }`}
              >
                {isConciliating ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">refresh</span>
                    Procesando con IA...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">auto_awesome</span>
                    Ejecutar Conciliación
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bank Feed Table */}
        <div className="space-y-6">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] pl-2">
            Cartola Bancaria Reciente
          </h2>

          <div className="bg-[#111] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="text-xs text-gray-500 uppercase bg-[#1A1A1A] border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 font-semibold tracking-widest">Fecha</th>
                    <th className="px-6 py-4 font-semibold tracking-widest">Origen / Referencia</th>
                    <th className="px-6 py-4 font-semibold tracking-widest text-right">Monto</th>
                    <th className="px-6 py-4 font-semibold tracking-widest text-center">Match IA</th>
                    <th className="px-6 py-4 font-semibold tracking-widest text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {movements.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center text-gray-500">
                        <span className="material-symbols-outlined text-4xl mb-2 block">account_balance</span>
                        <p className="text-sm">Sin movimientos bancarios</p>
                        <p className="text-xs text-gray-600 mt-1">Importa una cartola CSV para comenzar</p>
                      </td>
                    </tr>
                  ) : (
                    movements.map((mov, i) => (
                      <tr key={i} className="hover:bg-[#141414] transition-colors group">
                        <td className="px-6 py-4 text-xs font-mono text-gray-400">{mov.date}</td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-white text-xs">{mov.sender}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{mov.reference}</p>
                          {mov.matchingReason && (
                            <p className="text-[9px] text-purple-400/70 mt-0.5 max-w-[200px] truncate">{mov.matchingReason}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-white">
                          ${mov.amount.toLocaleString('es-CL')}
                        </td>
                        <td className="px-6 py-4">
                          {mov.suggestedUnit ? (
                            <div className="flex flex-col items-center">
                              <span className="text-xs font-bold text-purple-400">Dpto {mov.suggestedUnit}</span>
                              <span className="text-[9px] text-gray-500 mt-1">{mov.confidence}% confianza</span>
                            </div>
                          ) : (
                            <span className="block text-center text-xs text-gray-600 font-medium">Buscando...</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {mov.isApproved || mov.status === 'matched' ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-sm">
                              <span className="material-symbols-outlined text-[12px]">done_all</span> Conciliado
                            </span>
                          ) : mov.suggestedUnit ? (
                            <button
                              onClick={() => approveMatch(mov)}
                              className="bg-white/10 text-white border border-white/10 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-sm hover:bg-white/20 transition-colors"
                            >
                              Aprobar Match
                            </button>
                          ) : mov.status === 'pending' ? (
                            <span className="inline-flex items-center gap-1 bg-white/5 text-gray-400 border border-white/5 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-sm">
                              Pendiente
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-white/5 text-gray-400 border border-white/5 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-sm">
                              Revisión Manual
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecaudacionPage;
