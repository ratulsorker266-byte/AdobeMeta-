import React from 'react';
import { DollarSign, Shield, FileText, Mail, Sparkles, TrendingUp, Layers, ExternalLink } from 'lucide-react';
import { GoogleAdSenseBanner } from './GoogleAdSenseBanner';

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
  themeMode = 'dark',
}) => {
  const isLight = themeMode === 'light';

  return (
    <footer className={`w-full mt-16 pt-10 pb-8 border-t ${
      isLight ? 'border-slate-200 bg-white/90 text-slate-800' : 'border-slate-800/80 bg-slate-950/80 text-slate-100'
    } backdrop-blur-xl relative z-10 transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Bottom Leaderboard Ad Banner (Policy Compliant) */}
        <div className="w-full">
          <GoogleAdSenseBanner format="leaderboard" themeMode={themeMode} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                AM
              </div>
              <span className={`text-lg font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                AdobeMeta <span className="text-indigo-500">Pro</span>
              </span>
            </div>
            <p className={`text-xs leading-relaxed max-w-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              The premier AI-powered metadata optimization, computer vision quality inspector, and Google monetization suite for professional microstock contributors.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                isLight ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
              }`}>
                ✓ 100% Agency Compliant
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                isLight ? 'text-indigo-700 bg-indigo-50 border-indigo-200' : 'text-indigo-300 bg-indigo-500/10 border-indigo-500/30'
              }`}>
                Google AdSense Ready
              </span>
            </div>
          </div>

          {/* Microstock Tools */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
              Contributor Tools
            </h4>
            <ul className={`space-y-1.5 text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <li>
                <button
                  type="button"
                  onClick={onOpenEarnings}
                  className="hover:text-indigo-500 transition text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Microstock Earnings & ROI Calculator</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenNicheRadar}
                  className="hover:text-indigo-500 transition text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                  <span>Real-Time Niche Opportunity Radar</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenMultiCsv}
                  className="hover:text-indigo-500 transition text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Multi-Marketplace CSV Hub</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenGuideHub}
                  className="hover:text-indigo-500 transition text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span>Stock Contributor Masterclass</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Google Monetize Compliance */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
              Legal & Compliance
            </h4>
            <ul className={`space-y-1.5 text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <li>
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  className="hover:text-indigo-500 transition text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Privacy Policy (GDPR / CCPA)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenTerms}
                  className="hover:text-indigo-500 transition text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenDisclaimer}
                  className="hover:text-indigo-500 transition text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Earnings & Affiliate Disclaimer</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="hover:text-indigo-500 transition text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                  <span>Contact & Support</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Official Agency Portals */}
          <div className="md:col-span-2 space-y-2.5">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
              Agency Portals
            </h4>
            <ul className={`space-y-1.5 text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <li>
                <a
                  href="https://stock.adobe.com/contributor"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-indigo-500 transition flex items-center gap-1"
                >
                  <span>Adobe Contributor</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://submit.shutterstock.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-indigo-500 transition flex items-center gap-1"
                >
                  <span>Shutterstock Submit</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://contributor.freepik.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-indigo-500 transition flex items-center gap-1"
                >
                  <span>Freepik Contributor</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://wirestock.io/?ref=adobemeta"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-indigo-500 transition flex items-center gap-1"
                >
                  <span>Wirestock Sync</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={`pt-6 border-t ${
          isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800/80 text-slate-500'
        } flex flex-col sm:flex-row items-center justify-between gap-3 text-xs`}>
          <p>© {new Date().getFullYear()} AdobeMeta Pro. All rights reserved.</p>
          <p className="flex items-center gap-1 text-[11px]">
            Engineered for microstock contributors worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};
