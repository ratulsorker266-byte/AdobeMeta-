import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  theme?: 'light' | 'dark';
  onClick?: () => void;
}

export const AdobeMetaProLogo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  theme = 'light',
  onClick
}) => {
  const iconDimensions = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  }[size];

  const primaryColor = theme === 'dark' ? '#f5f5f7' : '#141517';
  const accentColor = '#c49e63'; // warm golden / champagne accent from reference

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Original Architectural Monogram Symbol */}
      <svg
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconDimensions} shrink-0 transition-transform duration-300 hover:scale-[1.03]`}
        aria-label="Adobe Meta Pro Logo"
      >
        {/* Left ascending architectural pillar / chevron leg */}
        <path
          d="M6 36L20 8H26L12 36H6Z"
          fill={primaryColor}
        />
        {/* Right apex facet with warm gold champagne transition */}
        <path
          d="M24.5 17L33.5 36H39L29 17H24.5Z"
          fill={primaryColor}
        />
        {/* Geometric cross-aperture discovery fold (the 'M' / lens connection) */}
        <path
          d="M17 26.5L25 10.5L28.5 17L20.5 33L17 26.5Z"
          fill={accentColor}
        />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none tracking-tight">
          <span
            className={`text-[12px] sm:text-[13px] font-bold tracking-[0.24em] uppercase ${
              theme === 'dark' ? 'text-neutral-100' : 'text-neutral-900'
            }`}
          >
            ADOBE
          </span>
          <span
            className={`text-[11px] sm:text-[12px] font-semibold tracking-[0.28em] uppercase ${
              theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
            }`}
          >
            META PRO
          </span>
        </div>
      )}
    </div>
  );
};
