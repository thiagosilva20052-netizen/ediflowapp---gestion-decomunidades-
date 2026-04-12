import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

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

  // Simulate AI Analysis and Validation
  const analyzeData = (data: any[]) => {
    setStep('analyzing');
    
    setTimeout(() => {
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
          _id: Math.random().toString(36).substr(2, 9),
          rowNumber: index + 1,
          errors,
          warnings,
          duplicateOf,
          action: errors.length > 0 ? 'skip' : 'import' // Skip by default if errors exist
        };
      });

      setRows(analyzedRows);
      setStep('review');
    }, 1500); // Simulate processing time
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, we would parse the CSV/Excel here.
    // For this demo, we will load a predefined "messy" dataset to showcase the AI features.
    loadDemoData();
  };

  const loadDemoData = () => {
    const messyData = [
      { name: 'Roberto Gómez', depto: '501', phone: '+56 9 1111 2222', email: 'roberto@mail.com', parking: 'E-10' }, // Valid
      { name: '', depto: '502', phone: '+56 9 3333 4444', email: 'sin-nombre@mail.com' }, // Error: No name
      { name: 'Lucía Fernández', depto: '', phone: '+56 9 5555 6666', email: 'lucia@mail.com' }, // Error: No depto
      { name: 'Pedro Pascal', depto: '601', phone: '12345', email: 'pedro.pascal.com' }, // Error: Invalid email
      { name: 'María González', depto: '402', phone: '+56 9 1234 5678', email: 'maria.g@example.com' }, // Warning: Duplicate with existing
      { name: 'Roberto Gómez', depto: '501', phone: '+56 9 1111 2222', email: 'roberto2@mail.com' }, // Warning: Duplicate in file
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#121212] w-full max-w-6xl rounded-3xl border-2 border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 md:p-8 border-b-2 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1A1A1A]">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <span className="material-symbols-outlined text-[#00AEEF] text-4xl">auto_awesome</span>
              Importación Inteligente
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
              {step === 'upload' && 'Sube tu archivo Excel o CSV para comenzar.'}
              {step === 'analyzing' && 'Analizando datos y buscando posibles errores...'}
              {step === 'review' && 'Revisa y corrige los datos antes de importar.'}
              {step === 'success' && '¡Importación completada con éxito!'}
            </p>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-8">
          
          {/* STEP 1: UPLOAD */}
          {step === 'upload' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="border-4 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-12 text-center hover:border-[#00AEEF] dark:hover:border-[#00AEEF] transition-colors cursor-pointer bg-gray-50 dark:bg-[#1A1A1A] w-full max-w-2xl relative group">
                <input 
                  type="file" 
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleFileUpload}
                />
                <div className="group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-8xl text-[#00AEEF] mb-6">upload_file</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Arrastra tu archivo aquí</h3>
                <p className="text-lg text-gray-500 font-medium mb-8">Soporta Excel (.xlsx) y CSV</p>
                
                <div className="inline-flex items-center gap-2 bg-[#00AEEF]/10 text-[#00AEEF] px-6 py-3 rounded-full font-bold">
                  <span className="material-symbols-outlined">ads_click</span>
                  O haz clic para explorar
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="text-gray-500 mb-4 font-medium">¿Quieres ver cómo funciona la IA predictiva?</p>
                <Button onClick={loadDemoData} className="bg-gray-900 dark:bg-white text-white dark:text-black border-none shadow-lg">
                  <span className="material-symbols-outlined mr-2">science</span>
                  Cargar Datos de Prueba (Con Errores)
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: ANALYZING */}
          {step === 'analyzing' && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 border-8 border-gray-200 border-t-[#00AEEF] rounded-full animate-spin mb-8"></div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">La IA está revisando tu archivo...</h3>
              <p className="text-lg text-gray-500">Buscando duplicados, formatos incorrectos y datos faltantes.</p>
            </div>
          )}

          {/* STEP 3: REVIEW */}
          {step === 'review' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-800/50 flex items-center justify-center text-green-600 dark:text-green-400">
                    <span className="material-symbols-outlined text-2xl">check_circle</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-600 dark:text-green-400 uppercase">Listos para importar</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{rows.filter(r => r.errors.length === 0 && r.warnings.length === 0).length}</p>
                  </div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-800/50 flex items-center justify-center text-red-600 dark:text-red-400">
                    <span className="material-symbols-outlined text-2xl">error</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-red-600 dark:text-red-400 uppercase">Errores detectados</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{rows.filter(r => r.errors.length > 0).length}</p>
                  </div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-800/50 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                    <span className="material-symbols-outlined text-2xl">warning</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400 uppercase">Duplicados / Alertas</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{rows.filter(r => r.warnings.length > 0 && r.errors.length === 0).length}</p>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white dark:bg-[#121212] rounded-2xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-[#1A1A1A] border-b-2 border-gray-200 dark:border-gray-800">
                        <th className="p-4 font-bold text-gray-500 uppercase text-sm w-16 text-center">Fila</th>
                        <th className="p-4 font-bold text-gray-500 uppercase text-sm">Estado / IA Predictiva</th>
                        <th className="p-4 font-bold text-gray-500 uppercase text-sm">Nombre</th>
                        <th className="p-4 font-bold text-gray-500 uppercase text-sm">Depto</th>
                        <th className="p-4 font-bold text-gray-500 uppercase text-sm">Correo</th>
                        <th className="p-4 font-bold text-gray-500 uppercase text-sm text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-gray-100 dark:divide-gray-800">
                      {rows.map((row) => (
                        <tr key={row._id} className={`
                          transition-colors
                          ${row.errors.length > 0 ? 'bg-red-50/50 dark:bg-red-900/10' : ''}
                          ${row.warnings.length > 0 && row.errors.length === 0 ? 'bg-yellow-50/50 dark:bg-yellow-900/10' : ''}
                        `}>
                          <td className="p-4 text-center font-bold text-gray-400">{row.rowNumber}</td>
                          <td className="p-4">
                            {row.errors.length === 0 && row.warnings.length === 0 && (
                              <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-bold text-sm bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                                <span className="material-symbols-outlined text-base">check_circle</span> Correcto
                              </span>
                            )}
                            {row.errors.map((err, i) => (
                              <div key={i} className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold text-sm mb-1">
                                <span className="material-symbols-outlined text-base">error</span> {err}
                              </div>
                            ))}
                            {row.warnings.map((warn, i) => (
                              <div key={i} className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 font-bold text-sm mb-1">
                                <span className="material-symbols-outlined text-base">warning</span> {warn}
                              </div>
                            ))}
                          </td>
                          <td className="p-4">
                            <input 
                              type="text" 
                              value={row.name} 
                              onChange={(e) => updateRow(row._id, 'name', e.target.value)}
                              className={`w-full bg-transparent border-b-2 focus:outline-none focus:border-[#00AEEF] transition-colors font-medium text-gray-900 dark:text-white ${row.errors.includes('Falta el nombre') ? 'border-red-500 placeholder-red-300' : 'border-transparent'}`}
                              placeholder="Ingresar nombre..."
                            />
                          </td>
                          <td className="p-4">
                            <input 
                              type="text" 
                              value={row.depto} 
                              onChange={(e) => updateRow(row._id, 'depto', e.target.value)}
                              className={`w-24 bg-transparent border-b-2 focus:outline-none focus:border-[#00AEEF] transition-colors font-bold text-gray-900 dark:text-white ${row.errors.includes('Falta el departamento') ? 'border-red-500 placeholder-red-300' : 'border-transparent'}`}
                              placeholder="Depto..."
                            />
                          </td>
                          <td className="p-4">
                            <input 
                              type="text" 
                              value={row.email} 
                              onChange={(e) => updateRow(row._id, 'email', e.target.value)}
                              className={`w-full bg-transparent border-b-2 focus:outline-none focus:border-[#00AEEF] transition-colors text-gray-900 dark:text-white ${row.errors.includes('Formato de correo inválido') ? 'border-red-500 text-red-500' : 'border-transparent'}`}
                              placeholder="correo@ejemplo.com"
                            />
                          </td>
                          <td className="p-4 text-center">
                            {row.warnings.length > 0 && row.errors.length === 0 ? (
                              <button 
                                onClick={() => setResolvingDuplicate(row)}
                                className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-bold px-4 py-2 rounded-xl hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors text-sm flex items-center gap-2 mx-auto"
                              >
                                <span className="material-symbols-outlined text-base">call_split</span>
                                Resolver
                              </button>
                            ) : (
                              <select 
                                value={row.action}
                                onChange={(e) => updateRow(row._id, 'action', e.target.value)}
                                className={`font-bold text-sm rounded-xl px-3 py-2 border-2 outline-none cursor-pointer ${
                                  row.action === 'import' ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' : 
                                  'bg-gray-100 border-gray-200 text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                                }`}
                                disabled={row.errors.length > 0}
                              >
                                <option value="import">Importar</option>
                                <option value="skip">Omitir</option>
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
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-6xl text-green-500">check_circle</span>
              </div>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">¡Importación Exitosa!</h3>
              <p className="text-xl text-gray-500">Los residentes han sido agregados al directorio.</p>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        {step === 'review' && (
          <div className="p-6 md:p-8 border-t-2 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1A1A1A] flex justify-between items-center">
            <p className="text-gray-500 font-medium">
              {hasErrors ? (
                <span className="text-red-500 flex items-center gap-2">
                  <span className="material-symbols-outlined">error</span>
                  Corrige los errores en rojo para poder importar esas filas.
                </span>
              ) : (
                "Revisa que todo esté correcto antes de finalizar."
              )}
            </p>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep('upload')}>Volver</Button>
              <Button 
                onClick={handleFinalImport}
                className="bg-[#00AEEF] hover:bg-[#0090C5] text-white border-none px-8 text-lg"
              >
                Importar {rows.filter(r => r.action === 'import' || r.action === 'replace').length} Registros
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Duplicate Resolution Sub-Modal */}
      {resolvingDuplicate && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#121212] w-full max-w-lg rounded-3xl border-2 border-gray-200 dark:border-gray-800 shadow-2xl p-8">
            <div className="flex items-center gap-4 mb-6 text-yellow-600 dark:text-yellow-400">
              <span className="material-symbols-outlined text-4xl">warning</span>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">Resolver Conflicto</h3>
            </div>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              El sistema detectó que <strong>{resolvingDuplicate.name}</strong> (Depto {resolvingDuplicate.depto}) podría ser un registro duplicado. ¿Qué deseas hacer?
            </p>

            <div className="space-y-4">
              <button 
                onClick={() => {
                  updateRow(resolvingDuplicate._id, 'action', 'import');
                  updateRow(resolvingDuplicate._id, 'warnings', []); // Clear warnings to show as resolved
                  setResolvingDuplicate(null);
                }}
                className="w-full p-4 rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:border-[#00AEEF] hover:bg-[#00AEEF]/5 transition-all text-left group"
              >
                <div className="font-black text-gray-900 dark:text-white text-lg group-hover:text-[#00AEEF]">Crear como nuevo</div>
                <div className="text-gray-500 text-sm">Mantener ambos registros en el sistema.</div>
              </button>

              <button 
                onClick={() => {
                  updateRow(resolvingDuplicate._id, 'action', 'replace');
                  updateRow(resolvingDuplicate._id, 'warnings', []);
                  setResolvingDuplicate(null);
                }}
                className="w-full p-4 rounded-2xl border-2 border-[#00AEEF] bg-[#00AEEF]/10 transition-all text-left"
              >
                <div className="font-black text-[#00AEEF] text-lg flex items-center justify-between">
                  Actualizar existente
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm">Reemplazar los datos del residente actual con esta nueva información.</div>
              </button>

              <button 
                onClick={() => {
                  updateRow(resolvingDuplicate._id, 'action', 'skip');
                  updateRow(resolvingDuplicate._id, 'warnings', []);
                  setResolvingDuplicate(null);
                }}
                className="w-full p-4 rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-left group"
              >
                <div className="font-black text-gray-900 dark:text-white text-lg group-hover:text-red-500">Omitir este registro</div>
                <div className="text-gray-500 text-sm">No importar esta fila.</div>
              </button>
            </div>

            <div className="mt-8 text-center">
              <button onClick={() => setResolvingDuplicate(null)} className="text-gray-500 font-bold hover:text-gray-900 dark:hover:text-white">
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
