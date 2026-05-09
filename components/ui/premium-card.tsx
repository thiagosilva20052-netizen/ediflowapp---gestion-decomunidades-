import React from 'react';
import { motion } from 'motion/react';

interface PremiumCardProps {
  title: string;
  description: string;
  price: string;
  features: string[];
  onSubscribe: () => void;
  isPopular?: boolean;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({
  title,
  description,
  price,
  features,
  onSubscribe,
  isPopular = false,
}) => {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className={`relative bg-[#111] rounded-[2.5rem] p-8 md:p-12 border ${
        isPopular ? 'border-ediflow-primary/50 shadow-[0_0_50px_rgba(0,174,239,0.15)]' : 'border-white/10 shadow-2xl'
      } overflow-hidden group flex flex-col h-full`}
    >
      {/* Decorative Blur */}
      {isPopular && (
         <div className="absolute top-0 right-0 w-64 h-64 bg-ediflow-primary/10 blur-[100px] rounded-full pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>
      )}

      {isPopular && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 bg-ediflow-primary text-black text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-b-xl z-20">
          Más Elegido
        </span>
      )}

      <div className="relative z-10 flex-1">
        <h3 className="text-3xl font-bold text-white tracking-tight mb-2">{title}</h3>
        <p className="text-sm text-gray-400 font-medium mb-8 leading-relaxed max-w-sm">{description}</p>
        
        <div className="mb-8 flex items-baseline gap-2">
          <span className="text-5xl font-light text-white tracking-tighter">{price}</span>
          <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">/ mes</span>
        </div>

        <ul className="space-y-4 mb-10 text-sm">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className={`material-symbols-outlined text-[20px] shrink-0 ${isPopular ? 'text-ediflow-primary' : 'text-gray-400'}`}>
                check_circle
              </span>
              <span className="text-gray-300 leading-snug">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onSubscribe}
        className={`relative z-10 w-full py-4 rounded-xl font-bold transition-all ${
          isPopular 
            ? 'bg-ediflow-primary text-black hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] shadow-[0_0_20px_rgba(0,174,239,0.2)]' 
            : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
        }`}
      >
        Suscribirse Ahora
      </button>
    </motion.div>
  );
};
