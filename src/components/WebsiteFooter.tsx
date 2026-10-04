import React from 'react';
import { Mail } from 'lucide-react';
import { AdobeMetaProLogo } from './AdobeMetaProLogo';

interface WebsiteFooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenDisclaimer: () => void;
  onOpenContact: () => void;
  onOpenEarnings: () => void;
  onOpenNicheRadar: () => void;
  onOpenGuideHub: () => void;
  onOpenMultiCsv: () => void;
  themeMode?: 'light' | 'dark';
}

export const WebsiteFooter: React.FC<WebsiteFooterProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenDisclaimer,
  onOpenContact,
  onOpenEarnings,
  onOpenNicheRadar,
  onOpenGuideHub,
  onOpenMultiCsv,
  themeMode = 'light',
}) => {
  const isLight = themeMode === 'light';

  return (
    <footer
      id="coffy-contact"
      className={`w-full mt-12 py-10 border-t ${
        isLight
          ? 'border-neutral-100 bg-white text-neutral-600'
          : 'border-neutral-900 bg-[#08090b] text-neutral-400'
      } relative z-10 transition-colors duration-200 font-sans`}
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Minimalist Coffy Studio Designer Logo */}
        <AdobeMetaProLogo
          size="sm"
          showText={true}
          theme={isLight ? 'light' : 'dark'}
          subtitle="CREATIVE MARKETPLACE"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        />

        {/* Center: Clean Unboxed Store & Legal Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10.5px] font-bold tracking-[0.18em] uppercase">
          <button
            type="button"
            onClick={onOpenMultiCsv}
            className={`transition cursor-pointer ${
              isLight ? 'hover:text-black' : 'hover:text-white'
            }`}
          >
            CSV HUB
          </button>
          <button
            type="button"
            onClick={onOpenEarnings}
            className={`transition cursor-pointer ${
              isLight ? 'hover:text-black' : 'hover:text-white'
            }`}
          >
            ROI CALCULATOR
          </button>
          <button
            type="button"
            onClick={onOpenNicheRadar}
            className={`transition cursor-pointer ${
              isLight ? 'hover:text-black' : 'hover:text-white'
            }`}
          >
            NICHE RADAR
          </button>
          <button
            type="button"
            onClick={onOpenGuideHub}
            className={`transition cursor-pointer ${
              isLight ? 'hover:text-black' : 'hover:text-white'
            }`}
          >
            MASTERCLASS
          </button>
          <button
            type="button"
            onClick={onOpenPrivacy}
            className={`transition cursor-pointer ${
              isLight ? 'hover:text-black' : 'hover:text-white'
            }`}
          >
            PRIVACY
          </button>
          <button
            type="button"
            onClick={onOpenTerms}
            className={`transition cursor-pointer ${
              isLight ? 'hover:text-black' : 'hover:text-white'
            }`}
          >
            TERMS
          </button>
          <button
            type="button"
            onClick={onOpenDisclaimer}
            className={`transition cursor-pointer ${
              isLight ? 'hover:text-black' : 'hover:text-white'
            }`}
          >
            DISCLAIMER
          </button>
          <button
            type="button"
            onClick={onOpenContact}
            className={`transition cursor-pointer flex items-center gap-1.5 ${
              isLight ? 'hover:text-black' : 'hover:text-white'
            }`}
          >
            <Mail className="w-3 h-3" />
            <span>CONTACT</span>
          </button>
        </div>

        {/* Right: Copyright */}
        <div className="text-[10.5px] font-medium tracking-[0.14em] uppercase text-neutral-400">
          © {new Date().getFullYear()} ADOBEMETA PRO
        </div>

      </div>
    </footer>
  );
};
