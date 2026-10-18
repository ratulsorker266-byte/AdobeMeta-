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
 * Ultra-Refined Swiss Architectural Brand Emblem & Wordmark (Google / Apple Grade)
 * - Balanced, non-bulky geometric 'A' + 'M' prism crest with razor-sharp precision lines
 * - Sophisticated typography: Swiss Sans paired with Editorial Serif 'Pro' and Cyan Micro-Dot
 * - High optical clarity from a distance without excessive bold weight or loud clutter
 */
export const AdobeMetaProLogo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle,
  layout = 'horizontal',
  className = '',
  theme = 'dark',
  subtitle = 'GLOBAL STOCK & MONETIZATION ATELIER',
  onClick
}) => {
  const uid = useId().replace(/:/g, '');
  const isLight = theme === 'light';

  // Subtitle visibility: subtle and omitted in compact 'sm' mode unless explicitly enabled
  const shouldShowSubtitle = showSubtitle !== undefined ? showSubtitle : size !== 'sm';

  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14'
  }[size];

  const titleSize = {
    sm: 'text-[15px] sm:text-[15.5px]',
    md: 'text-[16.5px] sm:text-[17.5px]',
    lg: 'text-[20px] sm:text-[22px]',
    xl: 'text-[26px] sm:text-[29px]'
  }[size];

  const subSize = {
    sm: 'text-[7px] tracking-[0.24em]',
    md: 'text-[7.5px] sm:text-[8px] tracking-[0.26em]',
    lg: 'text-[9px] tracking-[0.28em]',
    xl: 'text-[10.5px] tracking-[0.30em]'
  }[size];

  return (
    <div
      onClick={onClick}
      className={`group inline-flex ${
        layout === 'stacked' ? 'flex-col items-center text-center gap-2' : 'items-center gap-2.5 sm:gap-3 text-left'
      } select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Precision Architectural Emblem Mark */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${iconDimensions} shrink-0 transition-transform duration-300 ease-out group-hover:scale-[1.03]`}
          aria-label="AdobeMeta Pro Official Emblem"
        >
          <defs>
            {/* Deep Obsidian Enclosure */}
            <linearGradient id={`obsidianSurface_${uid}`} x1="4" y1="2" x2="44" y2="46" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={isLight ? '#1a1c24' : '#10131c'} />
              <stop offset="60%" stopColor={isLight ? '#0c0d12' : '#07090f'} />
              <stop offset="100%" stopColor="#030407" />
            </linearGradient>

            {/* Razor-Sharp Cyan & Platinum Specular Rim */}
            <linearGradient id={`rimSheen_${uid}`} x1="2" y1="2" x2="46" y2="46" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(0, 240, 255, 0.75)" />
              <stop offset="40%" stopColor="rgba(255, 255, 255, 0.45)" />
              <stop offset="75%" stopColor="rgba(56, 189, 248, 0.5)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.2)" />
            </linearGradient>

            {/* Pure Luminous White Primary Apex Pillar */}
            <linearGradient id={`whitePillar_${uid}`} x1="12" y1="10" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>

            {/* Electric Cyan Prismatic Accent Facet */}
            <linearGradient id={`cyanFacet_${uid}`} x1="16" y1="18" x2="32" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#67E8F9" />
              <stop offset="80%" stopColor="#00F0FF" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>

          {/* Outer Squircle Base with Precision Hairline Rim */}
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

          {/* Fine Optical Bezel */}
          <rect
            x="4.75"
            y="4.75"
            width="38.5"
            height="38.5"
            rx="9.25"
            stroke="rgba(0, 240, 255, 0.15)"
            strokeWidth="0.75"
          />

          {/* Top Specular Starlight Horizon */}
          <path
            d="M12 5.2H36"
            stroke="url(#rimSheen_${uid})"
            strokeOpacity="0.45"
            strokeWidth="0.8"
            strokeLinecap="round"
          />

          {/* Architectural 'A' Apex Monolith (Clean, Balanced Line Weights) */}
          <path
            d="M12.2 35L22.2 11.5H25.8L35.8 35H31.2L24 17.5L16.8 35H12.2Z"
            fill={`url(#whitePillar_${uid})`}
          />

          {/* Interlocking 'M' Prism Core with Cyan Starlight Sheen */}
          <path
            d="M17.8 35L24 20.8L30.2 35H26.8L24 28.5L21.2 35H17.8Z"
            fill={`url(#cyanFacet_${uid})`}
          />

          {/* Precision Starlight Diamond at Sovereign Apex */}
          <path
            d="M24 7.2L25.9 9.1L24 11L22.1 9.1L24 7.2Z"
            fill="#00F0FF"
          />
        </svg>
      </div>

      {showText && (
        <div className={`flex flex-col leading-none ${layout === 'stacked' ? 'items-center' : 'items-start'}`}>
          <div className="flex items-baseline gap-1.5">
            {/* Clean, Refined Swiss Sans Wordmark (Never Overly Bold) */}
            <span
              className={`${titleSize} font-sans font-semibold tracking-[-0.02em] transition-opacity duration-300 group-hover:opacity-90 ${
                isLight ? 'text-[#0A0B0E]' : 'text-white'
              }`}
            >
              AdobeMeta
            </span>

            {/* Elegant Editorial Serif 'Pro' */}
            <span
              className={`font-serif italic font-normal text-[1.12em] tracking-normal ${
                isLight ? 'text-neutral-600' : 'text-zinc-300'
              }`}
            >
              Pro
            </span>

            {/* Subtle Electric Cyan Status Accent Dot */}
            <span
              aria-hidden="true"
              className="w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-80 shrink-0 self-center ml-0.5"
            />
          </div>

          {shouldShowSubtitle && subtitle && (
            <span
              className={`${subSize} font-mono font-medium uppercase ${
                isLight ? 'text-neutral-500' : 'text-neutral-400'
              } mt-1.5`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
