import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', gradient = false }) => {
  const baseStyles = "rounded-3xl p-6 md:p-8 transition-all duration-300 relative overflow-hidden";
  
  // Removed glassmorphism and gradient logic to enforce high-contrast solid colors
  const bgStyles = "bg-white dark:bg-[#121212] border-2 border-gray-200 dark:border-gray-800 shadow-sm";
  
  return (
    <div className={`${baseStyles} ${bgStyles} ${className}`}>
      {children}
    </div>
  );
};
