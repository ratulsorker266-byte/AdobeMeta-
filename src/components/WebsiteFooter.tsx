import React from 'react';
import { Mail, MessageCircle, ArrowUpRight } from 'lucide-react';
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
      className="w-full pb-8 pt-2 relative z-10 font-sans"
    >
      <div
        className={`rounded-3xl px-6 sm:px-10 py-7 relative overflow-hidden transition-all duration-300 sovereign-prism-card ${
          isLight
            ? 'crystal-architectural-slab-light text-neutral-600'
            : 'crystal-architectural-slab-dark text-neutral-300'
        }`}
      >
        {/* Top Specular Glass Rim Line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 inset-x-12 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"
        />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          {/* Left: Brand Logo */}
          <AdobeMetaProLogo
            size="sm"
            showText={true}
            theme={isLight ? 'light' : 'dark'}
            subtitle="CRYSTAL MONOLITH ENGINE"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />

          {/* Center: Navigation Links & Contact Support Modal Trigger */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-medium tracking-[0.04em]">
            <button
              type="button"
              onClick={onOpenMultiCsv}
              className={`lumina-directional-link cursor-pointer ${
                isLight ? 'hover:text-black' : 'hover:text-white'
              }`}
            >
              CSV Hub
            </button>
            <button
              type="button"
              onClick={onOpenEarnings}
              className={`lumina-directional-link cursor-pointer ${
                isLight ? 'hover:text-black' : 'hover:text-white'
              }`}
            >
              ROI Calculator
            </button>
            <button
              type="button"
              onClick={onOpenNicheRadar}
              className={`lumina-directional-link cursor-pointer ${
                isLight ? 'hover:text-black' : 'hover:text-white'
              }`}
            >
              Niche Radar
            </button>
            <button
              type="button"
              onClick={onOpenGuideHub}
              className={`lumina-directional-link cursor-pointer ${
                isLight ? 'hover:text-black' : 'hover:text-white'
              }`}
            >
              Masterclass
            </button>
            <button
              type="button"
              onClick={onOpenPrivacy}
              className={`lumina-directional-link cursor-pointer ${
                isLight ? 'hover:text-black' : 'hover:text-white'
              }`}
            >
              Privacy
            </button>
            <button
              type="button"
              onClick={onOpenTerms}
              className={`lumina-directional-link cursor-pointer ${
                isLight ? 'hover:text-black' : 'hover:text-white'
              }`}
            >
              Terms
            </button>
            <button
              type="button"
              onClick={onOpenDisclaimer}
              className={`lumina-directional-link cursor-pointer ${
                isLight ? 'hover:text-black' : 'hover:text-white'
              }`}
            >
              Disclaimer
            </button>
            <button
              type="button"
              onClick={onOpenContact}
              className={`lumina-tactile-button cursor-pointer flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border backdrop-blur-md font-semibold ${
                isLight
                  ? 'bg-white/80 hover:bg-white text-neutral-900 border-white/90 shadow-2xs'
                  : 'bg-white/10 hover:bg-white/15 text-white border-white/20'
              }`}
            >
              <Mail className="w-3 h-3 text-emerald-500" />
              <span>Contact Support</span>
            </button>
          </div>

          {/* Right: Copyright */}
          <div className={`text-[11px] font-medium ${
            isLight ? 'text-neutral-500' : 'text-neutral-400'
          }`}>
            © {new Date().getFullYear()} AdobeMeta Pro
          </div>
        </div>
      </div>
    </footer>
  );
};
