import React from 'react';
import { Button } from '../ui/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export const PushSubscriptionModal: React.FC<Props> = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-[#121212] w-full max-w-lg rounded-3xl border-2 border-gray-200 dark:border-gray-800 shadow-2xl p-8 md:p-10 animate-fade-in-up">
        <div className="w-20 h-20 rounded-full bg-[#00AEEF]/10 flex items-center justify-center mb-8 mx-auto">
          <span className="material-symbols-outlined text-5xl text-[#00AEEF]">notifications_active</span>
        </div>
        
        <h2 className="text-3xl font-black text-gray-900 dark:text-white text-center mb-4">
          Manténgase Informado
        </h2>
        
        <p className="text-xl text-gray-600 dark:text-gray-400 text-center mb-10 leading-relaxed">
          ¿Quieres que te avisemos cuando llegue alguien a la puerta o recibas una encomienda?
        </p>

        <div className="flex flex-col gap-4">
          <Button 
            onClick={onAccept}
            size="lg"
            className="bg-[#00AEEF] hover:bg-[#0090C5] text-white border-none"
          >
            Sí, avisarme
          </Button>
          <Button 
            onClick={onClose}
            variant="outline"
            size="lg"
          >
            No, gracias
          </Button>
        </div>
      </div>
    </div>
  );
};
