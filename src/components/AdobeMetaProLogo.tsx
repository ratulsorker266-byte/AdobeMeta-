import React, { useId } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  layout?: 'horizontal' | 'stacked';
  className?: string;
  theme?: 'light' | 'dark';
  subtitle?: string;
  onClick?: () => void;
}

/**
 * Sovereign 10/10 Swiss Architectural Crest & Wordmark
 * - Deep Obsidian Glass (#07080C) enclosure with precision Liquid Champagne Gold (#E5C158) rim
 * - Interlocking Golden-Ratio 'A' + 'M' Architectural Prism Monogram
 * - Zero-clutter navbar presence (hides micro-subtitle in compact 'sm' header mode unless explicitly requested)
 */
export const AdobeMetaProLogo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle,
  layout = 'horizontal',
  className = '',
  theme = 'dark',
  subtitle = 'ARCHITECTURAL METADATA STUDIO',
  onClick
}) => {
  const uid = useId().replace(/:/g, '');
  const isLight = theme === 'light';

  // In compact 'sm' navbar mode, keep the header ultra-minimalist and spacious by omitting the micro-subtitle unless explicitly enabled
  const shouldShowSubtitle = showSubtitle !== undefined ? showSubtitle : size !== 'sm';

  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14'
  }[size];

  const titleSize = {
    sm: 'text-[14.5px] sm:text-[15.5px]',
    md: 'text-[16.5px] sm:text-[18px]',
    lg: 'text-[19px] sm:text-[21px]',
    xl: 'text-[24px] sm:text-[28px]'
  }[size];

  const subSize = {
    sm: 'text-[7px] tracking-[0.28em]',
    md: 'text-[7.5px] sm:text-[8px] tracking-[0.32em]',
    lg: 'text-[8.5px] tracking-[0.34em]',
    xl: 'text-[9.5px] tracking-[0.36em]'
  }[size];

  return (
    <div
      onClick={onClick}
      className={`group inline-flex ${
        layout === 'stacked' ? 'flex-col items-center text-center gap-2' : 'items-center gap-3 text-left'
      } select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Bespoke Swiss Obsidian & Champagne Gold Architectural Prism Crest */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${iconDimensions} shrink-0 transition-transform duration-500 ease-out group-hover:scale-[1.04]`}
          aria-label="AdobeMeta Pro Official Emblem"
        >
          <defs>
            {/* Deep Obsidian Architectural Surface */}
            <linearGradient id={`obsidianSurface_${uid}`} x1="4" y1="2" x2="44" y2="46" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={isLight ? '#14151A' : '#12131A'} />
              <stop offset="55%" stopColor={isLight ? '#090A0D' : '#07080B'} />
              <stop offset="100%" stopColor="#030305" />
            </linearGradient>

            {/* Liquid Champagne 24K Gold Foil */}
            <linearGradient id={`champagneFoil_${uid}`} x1="10" y1="8" x2="38" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFF6D6" />
              <stop offset="35%" stopColor="#F3E5AB" />
              <stop offset="70%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#AA8222" />
            </linearGradient>

            {/* Platinum Ivory Highlight for Primary Pillar */}
            <linearGradient id={`platinumPillar_${uid}`} x1="12" y1="11" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#F4F4F6" />
              <stop offset="100%" stopColor="#D4D4D8" />
            </linearGradient>

            {/* Outer Rim Specular Sheen */}
            <linearGradient id={`rimSheen_${uid}`} x1="2" y1="2" x2="46" y2="46" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(243, 229, 171, 0.55)" />
              <stop offset="45%" stopColor="rgba(255, 255, 255, 0.12)" />
              <stop offset="100%" stopColor="rgba(212, 175, 55, 0.38)" />
            </linearGradient>
          </defs>

          {/* Outer Architectural Squircle Enclosure */}
          <rect
            x="2"
            y="2"
            width="44"
            height="44"
            rx="12"
            fill={`url(#obsidianSurface_${uid})`}
            stroke={`url(#rimSheen_${uid})`}
            strokeWidth="1.15"
          />

          {/* Subtle Inner Optical Bezel */}
          <rect
            x="4.75"
            y="4.75"
            width="38.5"
            height="38.5"
            rx="9.25"
            stroke="rgba(243, 229, 171, 0.12)"
            strokeWidth="0.75"
          />

          {/* Top Ambient Specular Arc */}
          <path
            d="M11 5.2H37"
            stroke={`url(#champagneFoil_${uid})`}
            strokeOpacity="0.35"
            strokeWidth="0.9"
            strokeLinecap="round"
          />

          {/* Architectural 'A' Outer Sovereign Apex */}
          <path
            d="M11.8 35.2L22.1 11.8H25.9L36.2 35.2H31.5L24 17.4L16.5 35.2H11.8Z"
            fill={`url(#platinumPillar_${uid})`}
          />

          {/* Interwoven Inner 'M' / Champagne Gold Vector Prism Wing */}
          <path
            d="M17.6 35.2L24 21.2L30.4 35.2H26.7L24 28.9L21.3 35.2H17.6Z"
            fill={`url(#champagneFoil_${uid})`}
          />

          {/* Precision Vector Anchor Diamond at Sovereign Apex */}
          <path
            d="M24 7.8L26.1 9.9L24 12L21.9 9.9L24 7.8Z"
            fill={`url(#champagneFoil_${uid})`}
          />
        </svg>
      </div>

      {showText && (
        <div className={`flex flex-col leading-none ${layout === 'stacked' ? 'items-center' : 'items-start'}`}>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`${titleSize} font-bold tracking-[-0.03em] transition-opacity duration-300 group-hover:opacity-90 ${
                isLight ? 'text-[#0A0B0E]' : 'text-[#F8F8FA]'
              }`}
            >
              AdobeMeta
            </span>
            <span
              className={`font-editorial italic font-semibold tracking-[-0.01em] text-[1.16em] ${
                isLight
                  ? 'text-[#9A7018]'
                  : 'text-[#F3E5AB]'
              }`}
            >
              Pro
            </span>
          </div>
          {shouldShowSubtitle && subtitle && (
            <span
              className={`${subSize} font-mono font-medium uppercase text-neutral-400/90 mt-1.5`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

