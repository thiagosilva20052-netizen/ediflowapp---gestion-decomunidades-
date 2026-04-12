import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase ml-1 mb-2 block">{label}</label>}
      <input 
        className={`w-full bg-white dark:bg-[#121212] border-2 border-gray-300 dark:border-gray-700 rounded-2xl px-6 py-4 text-lg text-gray-900 dark:text-white focus:border-ediflow-light-accent dark:focus:border-ediflow-dark-accent outline-none transition-colors min-h-[60px] ${className}`}
        {...props}
      />
    </div>
  );
};
