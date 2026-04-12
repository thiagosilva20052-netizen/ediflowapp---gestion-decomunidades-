import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  icon,
  className = '',
  ...props 
}) => {
  const baseStyles = "font-bold rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 min-h-[60px]";
  
  const variants = {
    primary: "bg-ediflow-light-accent dark:bg-ediflow-dark-accent text-white dark:text-black hover:opacity-90",
    secondary: "bg-gray-100 dark:bg-[#1A1A1A] text-ediflow-light-title dark:text-ediflow-dark-title border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-700",
    outline: "bg-transparent border-2 border-gray-300 dark:border-gray-700 text-ediflow-light-title dark:text-ediflow-dark-title hover:bg-gray-100 dark:hover:bg-[#1A1A1A]",
    ghost: "bg-transparent text-gray-600 dark:text-gray-400 hover:text-ediflow-light-title dark:hover:text-ediflow-dark-title"
  };

  const sizes = {
    sm: "py-3 px-6 text-lg",
    md: "py-4 px-8 text-xl",
    lg: "py-5 px-10 text-2xl"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="material-symbols-outlined">{icon}</span>}
      {children}
    </button>
  );
};
