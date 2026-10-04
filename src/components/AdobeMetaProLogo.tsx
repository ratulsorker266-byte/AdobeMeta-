import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  layout?: 'horizontal' | 'stacked';
  className?: string;
  theme?: 'light' | 'dark';
  subtitle?: string;
  onClick?: () => void;
}

/**
 * Brand-New Professional Graphic Designer Minimalist Crest & Wordmark
 * Engineered specifically for the Coffy.net Boutique Marketplace aesthetic:
 * - Swiss Golden-Ratio Monogram ('A' + 'M' + Vector Anchor Node)
 * - Crisp hairline geometric enclosure with dual-theme obsidian/alabaster contrast
 * - Signature Gold (#F59E0B) & Emerald (#10B981) precision accents
 */
export const AdobeMetaProLogo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  layout = 'horizontal',
  className = '',
  theme = 'light',
  subtitle = 'CREATIVE STORE MARKETPLACE',
  onClick
}) => {
  const isLight = theme === 'light';

  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14'
  }[size];

  const titleSize = {
    sm: 'text-[13px] tracking-[0.22em]',
    md: 'text-[15.5px] sm:text-[17px] tracking-[0.24em]',
    lg: 'text-[18px] sm:text-[20px] tracking-[0.26em]',
    xl: 'text-[22px] sm:text-[26px] tracking-[0.28em]'
  }[size];

  const subSize = {
    sm: 'text-[7px] tracking-[0.32em]',
    md: 'text-[7.5px] sm:text-[8px] tracking-[0.36em]',
    lg: 'text-[8.5px] tracking-[0.38em]',
    xl: 'text-[9.5px] tracking-[0.4em]'
  }[size];

  return (
    <div
      onClick={onClick}
      className={`group inline-flex ${
        layout === 'stacked' ? 'flex-col items-center text-center gap-1.5' : 'items-center gap-3 text-left'
      } select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Bespoke Graphic Designer Geometric Monogram Crest */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${iconDimensions} shrink-0 transition-transform duration-500 ease-out group-hover:scale-[1.05]`}
          aria-label="AdobeMeta Pro Official Designer Emblem"
        >
          {/* Outer Architectural Squircle Badge */}
          <rect
            x="2"
            y="2"
            width="44"
            height="44"
            rx="11"
            fill={isLight ? '#0A0B0E' : '#FFFFFF'}
            className="transition-colors duration-300"
          />

          {/* Subtle Inner Hairline Bezel */}
          <rect
            x="4.25"
            y="4.25"
            width="39.5"
            height="39.5"
            rx="8.75"
            stroke={isLight ? 'rgba(255,255,255,0.14)' : 'rgba(10,11,14,0.14)'}
            strokeWidth="0.85"
          />

          {/* Primary Architectural 'A' / 'M' Monogram Pillars */}
          <path
            d="M12.5 34.5L21.6 13.5H26.4L35.5 34.5H30.4L24 19.2L17.6 34.5H12.5Z"
            fill={isLight ? '#FFFFFF' : '#0A0B0E'}
          />

          {/* Precision Golden Ratio Vector Bezier Crossbar */}
          <path
            d="M18.2 28.5H29.8L31.4 32.2H16.6L18.2 28.5Z"
            fill="#F59E0B"
          />

          {/* Center Emerald Intelligence Prism Node */}
          <circle
            cx="24"
            cy="11.2"
            r="1.8"
            fill="#10B981"
          />
        </svg>
      </div>

      {showText && (
        <div className={`flex flex-col leading-none ${layout === 'stacked' ? 'items-center' : 'items-start'}`}>
          <div className="flex items-center gap-1.5">
            <span
              className={`${titleSize} font-black uppercase transition-opacity group-hover:opacity-85 ${
                isLight ? 'text-[#0A0B0E]' : 'text-white'
              }`}
            >
              ADOBEMETA
            </span>
            <span
              className={`text-[9px] sm:text-[10px] font-mono font-extrabold tracking-[0.18em] uppercase px-1.5 py-0.5 rounded ${
                isLight
                  ? 'bg-[#0A0B0E] text-amber-400'
                  : 'bg-white text-[#0A0B0E]'
              }`}
            >
              PRO
            </span>
          </div>
          {subtitle && (
            <span
              className={`${subSize} font-semibold uppercase text-neutral-400 mt-1`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
