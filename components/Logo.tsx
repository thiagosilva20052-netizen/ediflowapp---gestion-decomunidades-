import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'vertical' | 'horizontal' | 'icon';
  color?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "", variant = 'vertical', color = "#00AEEF" }) => {
  const svgIcon = (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* House Outline */}
      <path 
        d="M 125 160 L 150 160 L 150 90 L 100 40 L 50 90" 
        stroke={color} 
        strokeWidth="14" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      {/* Outer Wifi Arc */}
      <path 
        d="M 50 110 A 50 50 0 0 1 100 160" 
        stroke={color} 
        strokeWidth="14" 
        strokeLinecap="round"
      />
      {/* Inner Wifi Arc */}
      <path 
        d="M 50 135 A 25 25 0 0 1 75 160" 
        stroke={color} 
        strokeWidth="14" 
        strokeLinecap="round"
      />
      {/* Wifi Dot */}
      <circle cx="50" cy="160" r="7" fill={color} />
      
      {/* Windows */}
      <rect x="86" y="75" width="11" height="11" fill={color} />
      <rect x="103" y="75" width="11" height="11" fill={color} />
      <rect x="86" y="92" width="11" height="11" fill={color} />
      <rect x="103" y="92" width="11" height="11" fill={color} />
    </svg>
  );

  if (variant === 'icon') {
    return <div className={className}>{svgIcon}</div>;
  }

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-8 h-8 shrink-0">{svgIcon}</div>
        <div className="text-xl tracking-wide flex items-center" style={{ color: color }}>
          <span className="font-normal">Edi</span>
          <span className="font-bold">flow</span>
        </div>
      </div>
    );
  }

  // vertical (default)
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="w-32 h-32">{svgIcon}</div>
      <div className="text-4xl mt-2 tracking-wide flex items-center" style={{ color: color }}>
        <span className="font-normal">Edi</span>
        <span className="font-bold">flow</span>
      </div>
    </div>
  );
};
