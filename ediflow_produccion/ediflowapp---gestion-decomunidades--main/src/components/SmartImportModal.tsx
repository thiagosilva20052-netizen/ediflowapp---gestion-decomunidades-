import React, { useState, useEffect } from 'react';

export interface ImportedResident {
  name: string;
  depto: string;
  phone: string;
  email: string;
  bodega?: string;
  parking?: string;
}

interface ImportRow extends ImportedResident {
  _id: string;
  rowNumber: number;
  errors: string[];
  warnings: string[];
  duplicateOf?: string; // ID of existing resident or another row
  action: 'import' | 'skip' | 'replace';
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImport: (residents: ImportedResident[]) => void;
  existingResidents: { id: string; name: string; depto: string }[];
}

const SmartImportModal: React.FC<Props> = ({ isOpen, onClose, onImport, existingResidents }) => {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'review' | 'success'>('upload');
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [resolvingDuplicate, setResolvingDuplicate] = useState<ImportRow | null>(null);

  if (!isOpen) return null;

  const analyzeData = (data: any[]) => {
    setStep('analyzing');
    
    // Process data (AI-like validation)
    const analyzedRows: ImportRow[] = data.map((item, index) => {
      const errors: string[] = [];
      const warnings: string[] = [];
      let duplicateOf: string | undefined = undefined;

      // 1. Validate Required Fields
      if (!item.name || item.name.trim() === '') errors.push('Falta el nombre');
      if (!item.depto || item.depto.trim() === '') errors.push('Falta el departamento');

      // 2. Validate Formats
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (item.email && !emailRegex.test(item.email)) {
        errors.push('Formato de correo inválido');
      }

      // 3. Check Duplicates against existing residents
      const existingMatch = existingResidents.find(
        r => r.name.toLowerCase() === item.name?.toLowerCase() || 
             (r.depto === item.depto && item.depto !== '')
      );

      if (existingMatch) {
        warnings.push(`Posible duplicado con residente existente: ${existingMatch.name} (Depto ${existingMatch.depto})`);
        duplicateOf = existingMatch.id;
      }

      // 4. Check Duplicates within the import file itself
      const fileMatchIndex = data.findIndex((r, i) => i < index && r.name?.toLowerCase() === item.name?.toLowerCase());
      if (fileMatchIndex !== -1) {
        warnings.push(`Nombre repetido en la fila ${fileMatchIndex + 1} de este archivo`);
      }

      return {
        ...item,
        _id: crypto.randomUUID(),
        rowNumber: index + 1,
        errors,
        warnings,
        duplicateOf,
        action: errors.length > 0 ? 'skip' : 'import'
      };
    });

    setRows(analyzedRows);
    setStep('review');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      // Basic CSV Parser
      const lines = text.split(/\r?\n/);
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const parsedData = lines.slice(1).filter(line => line.trim() !== '').map(line => {
        const values = line.split(',').map(v => v.trim());
        const entry: any = {};
        headers.forEach((header, i) => {
          // Map headers to internal keys
          if (header.includes('nombre')) entry.name = values[i];
          else if (header.includes('depto') || header.includes('unidad')) entry.depto = values[i];
          else if (header.includes('tel') || header.includes('fono')) entry.phone = values[i];
          else if (header.includes('mail') || header.includes('correo')) entry.email = values[i];
          else if (header.includes('bodega')) entry.bodega = values[i];
          else if (header.includes('estac')) entry.parking = values[i];
        });
        return entry;
      });

      analyzeData(parsedData);
    };
    reader.readAsText(file);
  };

  const loadDemoData = () => {
    const messyData = [
      { name: 'Roberto Gómez', depto: '501', phone: '+56 9 1111 2222', email: 'roberto@mail.com', parking: 'E-10' },
      { name: '', depto: '502', phone: '+56 9 3333 4444', email: 'sin-nombre@mail.com' },
      { name: 'Lucía Fernández', depto: '', phone: '+56 9 5555 6666', email: 'lucia@mail.com' },
      { name: 'Pedro Pascal', depto: '601', phone: '12345', email: 'pedro.pascal.com' },
      { name: 'María González', depto: '402', phone: '+56 9 1234 5678', email: 'maria.g@example.com' },
      { name: 'Roberto Gómez', depto: '501', phone: '+56 9 1111 2222', email: 'roberto2@mail.com' },
    ];
    analyzeData(messyData);
  };

  const updateRow = (id: string, field: keyof ImportRow, value: any) => {
    setRows(prev => prev.map(row => {
      if (row._id === id) {
        const updatedRow = { ...row, [field]: value };
        // Re-validate row
        const newErrors = [];
        if (!updatedRow.name) newErrors.push('Falta el nombre');
        if (!updatedRow.depto) newErrors.push('Falta el departamento');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (updatedRow.email && !emailRegex.test(updatedRow.email)) newErrors.push('Formato de correo inválido');
        
        updatedRow.errors = newErrors;
        if (newErrors.length === 0 && updatedRow.action === 'skip') {
          updatedRow.action = 'import'; // Auto-include if fixed
        }
        return updatedRow;
      }
      return row;
    }));
  };

  const handleFinalImport = () => {
    const validRowsToImport = rows.filter(r => r.action === 'import' || r.action === 'replace');
    onImport(validRowsToImport);
    setStep('success');
    setTimeout(() => {
      onClose();
      setStep('upload');
    }, 2000);
  };

  const hasErrors = rows.some(r => r.errors.length > 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-[#0A0A0A]/90 backdrop-blur-md animate-fade-in">
      <div className="bg-[#111] w-full max-w-6xl rounded-[2rem] border border-white/10 shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 md:p-8 border-b border-white/5 bg-[#0A0A0A]">
          <div>
            <h2 className="text-2xl md:text-3xl font-light tracking-tight text-white flex items-center gap-3 mb-1">
              <span className="material-symbols-outlined text-ediflow-primary text-4xl">auto_awesome</span>
              Importación Inteligente
            </h2>
            <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">
              {step === 'upload' && 'Sube tu archivo Excel o CSV para comenzar.'}
              {step === 'analyzing' && 'Analizando datos y buscando posibles errores...'}
              {step === 'review' && 'Revisa y corrige los datos antes de importar.'}
              {step === 'success' && '¡Importación completada con éxito!'}
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors active:scale-95">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-8">
          
          {/* STEP 1: UPLOAD */}
          {step === 'upload' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="border border-dashed border-white/20 rounded-[2rem] p-12 text-center hover:border-ediflow-primary transition-colors cursor-pointer bg-[#0A0A0A] w-full max-w-2xl relative group overflow-hidden">
                <input 
                  type="file" 
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleFileUpload}
                />
                {/* Ambient glow inside dropzone */}
                <div className="absolute inset-0 bg-ediflow-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                
                <div className="group-hover:scale-110 transition-transform duration-300 relative z-10">
                  <span className="material-symbols-outlined text-6xl text-ediflow-primary mb-6">upload_file</span>
                </div>
                <h3 className="text-2xl font-light tracking-tight text-white mb-2 relative z-10">Arrastra tu archivo aquí</h3>
                <p className="text-sm text-gray-500 font-medium mb-8 relative z-10">Soporta Excel (.xlsx) y CSV</p>
                
                <div className="inline-flex items-center gap-2 bg-ediflow-primary/10 text-ediflow-primary px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest relative z-10 border border-ediflow-primary/20">
                  <span className="material-symbols-outlined text-[16px]">ads_click</span>
                  O haz clic para explorar
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="text-gray-500 mb-4 text-[10px] uppercase tracking-widest font-bold">¿Quieres ver cómo funciona la IA predictiva?</p>
                <button onClick={loadDemoData} className="px-6 py-3.5 rounded-xl border border-white/10 hover:border-white/30 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all text-center flex items-center justify-center gap-2 mx-auto">
                  <span className="material-symbols-outlined text-[16px]">science</span>
                  Cargar Datos de Prueba (Con Errores)
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ANALYZING */}
          {step === 'analyzing' && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 border-2 border-white/10 border-t-ediflow-primary rounded-full animate-spin mb-8"></div>
              <h3 className="text-2xl font-light tracking-tight text-white mb-2">La IA está revisando tu archivo...</h3>
              <p className="text-sm text-gray-500">Buscando duplicados, formatos incorrectos y datos faltantes.</p>
            </div>
          )}

          {/* STEP 3: REVIEW */}
          {step === 'review' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                    <span className="material-symbols-outlined text-2xl">check_circle</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Listos para importar</p>
                    <p className="text-2xl font-light text-white">{rows.filter(r => r.errors.length === 0 && r.warnings.length === 0).length}</p>
                  </div>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                    <span className="material-symbols-outlined text-2xl">error</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Errores detectados</p>
                    <p className="text-2xl font-light text-white">{rows.filter(r => r.errors.length > 0).length}</p>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                    <span className="material-symbols-outlined text-2xl">warning</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest">Duplicados / Alertas</p>
                    <p className="text-2xl font-light text-white">{rows.filter(r => r.warnings.length > 0 && r.errors.length === 0).length}</p>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-[#0A0A0A] rounded-2xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#111] border-b border-white/5">
                        <th className="p-4 font-bold text-gray-400 uppercase text-[10px] tracking-widest w-16 text-center">Fila</th>
                        <th className="p-4 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Estado / IA Predictiva</th>
                        <th className="p-4 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Nombre</th>
                        <th className="p-4 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Depto</th>
                        <th className="p-4 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Correo</th>
                        <th className="p-4 font-bold text-gray-400 uppercase text-[10px] tracking-widest text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {rows.map((row) => (
                        <tr key={row._id} className={`
                          transition-colors
                          ${row.errors.length > 0 ? 'bg-red-500/5' : ''}
                          ${row.warnings.length > 0 && row.errors.length === 0 ? 'bg-yellow-500/5' : 'hover:bg-[#111]'}
                        `}>
                          <td className="p-4 text-center font-mono text-sm text-gray-500">{row.rowNumber}</td>
                          <td className="p-4">
                            {row.errors.length === 0 && row.warnings.length === 0 && (
                              <span className="inline-flex items-center gap-1 text-green-400 font-bold text-xs uppercase tracking-widest bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-lg">
                                <span className="material-symbols-outlined text-[14px]">check_circle</span> Correcto
                              </span>
                            )}
                            {row.errors.map((err, i) => (
                              <div key={i} className="flex items-center gap-1 text-red-400 font-bold text-[10px] uppercase tracking-widest mb-1 bg-red-400/10 px-2 py-1 rounded-lg border border-red-400/20 w-fit">
                                <span className="material-symbols-outlined text-[12px]">error</span> {err}
                              </div>
                            ))}
                            {row.warnings.map((warn, i) => (
                              <div key={i} className="flex items-center gap-1 text-yellow-400 font-bold text-[10px] uppercase tracking-widest mb-1 bg-yellow-400/10 px-2 py-1 rounded-lg border border-yellow-400/20 w-fit">
                                <span className="material-symbols-outlined text-[12px]">warning</span> {warn}
                              </div>
                            ))}
                          </td>
                          <td className="p-4">
                            <input 
                              type="text" 
                              value={row.name} 
                              onChange={(e) => updateRow(row._id, 'name', e.target.value)}
                              className={`w-full bg-transparent border-b text-sm focus:outline-none focus:border-ediflow-primary transition-colors font-medium text-white ${row.errors.includes('Falta el nombre') ? 'border-red-500 placeholder-red-400' : 'border-transparent'}`}
                              placeholder="Ingresar nombre..."
                            />
                          </td>
                          <td className="p-4">
                            <input 
                              type="text" 
                              value={row.depto} 
                              onChange={(e) => updateRow(row._id, 'depto', e.target.value)}
                              className={`w-24 bg-transparent border-b text-sm focus:outline-none focus:border-ediflow-primary transition-colors font-bold text-white ${row.errors.includes('Falta el departamento') ? 'border-red-500 placeholder-red-400' : 'border-transparent'}`}
                              placeholder="Depto..."
                            />
                          </td>
                          <td className="p-4">
                            <input 
                              type="text" 
                              value={row.email} 
                              onChange={(e) => updateRow(row._id, 'email', e.target.value)}
                              className={`w-full bg-transparent border-b text-sm focus:outline-none focus:border-ediflow-primary transition-colors text-white ${row.errors.includes('Formato de correo inválido') ? 'border-red-500 text-red-500' : 'border-transparent'}`}
                              placeholder="correo@ejemplo.com"
                            />
                          </td>
                          <td className="p-4 text-center">
                            {row.warnings.length > 0 && row.errors.length === 0 ? (
                              <button 
                                onClick={() => setResolvingDuplicate(row)}
                                className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-bold px-4 py-2 rounded-xl hover:bg-yellow-500/20 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 mx-auto active:scale-95"
                              >
                                <span className="material-symbols-outlined text-[16px]">call_split</span>
                                Resolver
                              </button>
                            ) : (
                              <select 
                                value={row.action}
                                onChange={(e) => updateRow(row._id, 'action', e.target.value)}
                                className={`font-bold text-[10px] uppercase tracking-widest rounded-xl px-3 py-2 border outline-none cursor-pointer appearance-none text-center w-full ${
                                  row.action === 'import' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 
                                  'bg-white/5 border-white/10 text-gray-400'
                                }`}
                                disabled={row.errors.length > 0}
                              >
                                <option value="import" className="bg-[#111] text-white">Importar</option>
                                <option value="skip" className="bg-[#111] text-white">Omitir</option>
                              </select>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
              <div className="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-6xl text-green-500">check_circle</span>
              </div>
              <h3 className="text-3xl font-light tracking-tight text-white mb-2">¡Importación Exitosa!</h3>
              <p className="text-sm font-medium text-gray-500">Los residentes han sido agregados al directorio.</p>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        {step === 'review' && (
          <div className="p-6 md:p-8 border-t border-white/5 bg-[#0A0A0A] flex justify-between items-center">
            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">
              {hasErrors ? (
                <span className="text-red-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  Corrige los errores en rojo para poder importar esas filas.
                </span>
              ) : (
                "Revisa que todo esté correcto antes de finalizar."
              )}
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setStep('upload')}
                className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400 font-bold uppercase tracking-widest text-xs transition-all active:scale-[0.98]"
              >
                Volver
              </button>
              <button 
                onClick={handleFinalImport}
                className="bg-ediflow-primary text-black hover:bg-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-[0_0_15px_rgba(0,174,239,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] active:scale-[0.98]"
              >
                Importar {rows.filter(r => r.action === 'import' || r.action === 'replace').length} Registros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Duplicate Resolution Sub-Modal */}
      {resolvingDuplicate && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#111] w-full max-w-lg rounded-[2.5rem] border border-white/10 shadow-2xl p-8">
            <div className="flex items-center gap-4 mb-6 text-yellow-400">
              <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center">
                 <span className="material-symbols-outlined text-[24px]">warning</span>
              </div>
              <h3 className="text-2xl font-light tracking-tight text-white">Resolver Conflicto</h3>
            </div>
            
            <p className="text-sm text-gray-400 leading-relaxed mb-6 font-medium">
              El sistema detectó que <strong className="text-white">{resolvingDuplicate.name}</strong> (Depto {resolvingDuplicate.depto}) podría ser un registro duplicado. ¿Qué deseas hacer?
            </p>

            <div className="space-y-3">
              <button 
                onClick={() => {
                  updateRow(resolvingDuplicate._id, 'action', 'import');
                  updateRow(resolvingDuplicate._id, 'warnings', []); // Clear warnings to show as resolved
                  setResolvingDuplicate(null);
                }}
                className="w-full p-4 rounded-2xl border border-white/10 hover:border-ediflow-primary/50 hover:bg-ediflow-primary/5 transition-all text-left flex flex-col gap-1 group active:scale-[0.98]"
              >
                <div className="font-bold text-white text-sm uppercase tracking-widest group-hover:text-ediflow-primary transition-colors">Crear como nuevo</div>
                <div className="text-gray-500 text-xs">Mantener ambos registros en el sistema.</div>
              </button>

              <button 
                onClick={() => {
                  updateRow(resolvingDuplicate._id, 'action', 'replace');
                  updateRow(resolvingDuplicate._id, 'warnings', []);
                  setResolvingDuplicate(null);
                }}
                className="w-full p-4 rounded-2xl border border-ediflow-primary bg-ediflow-primary/10 transition-all text-left flex flex-col gap-1 active:scale-[0.98]"
              >
                <div className="font-bold text-ediflow-primary text-sm uppercase tracking-widest flex items-center justify-between">
                  Actualizar existente
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                </div>
                <div className="text-gray-400 text-xs">Reemplazar los datos del residente actual con esta nueva información.</div>
              </button>

              <button 
                onClick={() => {
                  updateRow(resolvingDuplicate._id, 'action', 'skip');
                  updateRow(resolvingDuplicate._id, 'warnings', []);
                  setResolvingDuplicate(null);
                }}
                className="w-full p-4 rounded-2xl border border-white/10 hover:border-red-500/50 hover:bg-red-500/5 transition-all text-left flex flex-col gap-1 group active:scale-[0.98]"
              >
                <div className="font-bold text-white text-sm uppercase tracking-widest group-hover:text-red-400 transition-colors">Omitir este registro</div>
                <div className="text-gray-500 text-xs">No importar esta fila.</div>
              </button>
            </div>

            <div className="mt-8 text-center pt-6 border-t border-white/5">
              <button 
                onClick={() => setResolvingDuplicate(null)} 
                className="text-gray-500 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors p-2"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SmartImportModal;
