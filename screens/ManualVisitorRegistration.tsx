import React, { useState } from 'react';
import { ScreenName } from '../App';

interface Props {
  navigate: (screen: ScreenName) => void;
}

const ManualVisitorRegistration: React.FC<Props> = ({ navigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    rut: '',
    depto: '',
    reason: 'Familiar/Amigo',
    vehiclePlate: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.rut || !formData.depto) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        navigate('AccessControl');
      }, 2000);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full bg-[#0A0A0A] p-6 text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-5xl text-green-500">check_circle</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Ingreso Registrado</h2>
        <p className="text-gray-400 mb-8">La visita ha sido registrada exitosamente en el sistema.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-[#0A0A0A]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/5 p-4 flex items-center gap-4">
        <button 
          onClick={() => navigate('AccessControl')}
          className="w-10 h-10 rounded-full bg-[#141414] flex items-center justify-center text-white hover:bg-[#1F1F1F] active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-white">Registro Manual</h1>
      </header>

      <main className="flex-1 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Datos del Visitante</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Nombre Completo *</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ej. Juan Pérez"
                className="w-full bg-[#141414] border border-white/5 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-ediflow-primary transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">RUT / Pasaporte *</label>
              <input 
                type="text" 
                value={formData.rut}
                onChange={(e) => setFormData({...formData, rut: e.target.value})}
                placeholder="Ej. 12.345.678-9"
                className="w-full bg-[#141414] border border-white/5 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-ediflow-primary transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Destino y Motivo</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Departamento *</label>
              <input 
                type="text" 
                value={formData.depto}
                onChange={(e) => setFormData({...formData, depto: e.target.value})}
                placeholder="Ej. 402"
                className="w-full bg-[#141414] border border-white/5 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-ediflow-primary transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Motivo de la Visita</label>
              <div className="grid grid-cols-2 gap-3">
                {['Familiar/Amigo', 'Delivery', 'Servicio Técnico', 'Otro'].map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setFormData({...formData, reason})}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all border ${
                      formData.reason === reason 
                        ? 'bg-ediflow-primary/10 border-ediflow-primary text-ediflow-primary' 
                        : 'bg-[#141414] border-white/5 text-gray-400 hover:bg-[#1F1F1F]'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Información Adicional</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Patente Vehículo (Opcional)</label>
              <input 
                type="text" 
                value={formData.vehiclePlate}
                onChange={(e) => setFormData({...formData, vehiclePlate: e.target.value})}
                placeholder="Ej. AB CD 12"
                className="w-full bg-[#141414] border border-white/5 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-ediflow-primary transition-colors uppercase"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Observaciones (Opcional)</label>
              <textarea 
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Algún detalle importante..."
                rows={3}
                className="w-full bg-[#141414] border border-white/5 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-ediflow-primary transition-colors resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-8 pb-8">
            <button 
              type="submit"
              disabled={isSubmitting || !formData.name || !formData.rut || !formData.depto}
              className="w-full bg-ediflow-primary text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-yellow-500/20"
            >
              {isSubmitting ? (
                <span className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
              ) : (
                <>
                  <span className="material-symbols-outlined">how_to_reg</span>
                  Registrar Ingreso
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ManualVisitorRegistration;
