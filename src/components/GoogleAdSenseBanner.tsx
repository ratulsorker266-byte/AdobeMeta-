import React, { useState } from 'react';
import { DollarSign, ExternalLink, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

interface GoogleAdSenseBannerProps {
  slotId?: string;
  format?: 'leaderboard' | 'rectangle' | 'in-feed';
  showAdPlaceholder?: boolean;
}

export const GoogleAdSenseBanner: React.FC<GoogleAdSenseBannerProps> = ({
  slotId = 'ca-pub-monetize-slot',
  format = 'leaderboard',
  showAdPlaceholder = true,
}) => {
  const [adDismissed, setAdDismissed] = useState(false);

  if (adDismissed) return null;

  if (format === 'leaderboard') {
    return (
      <div className="w-full my-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800/90 rounded-2xl p-3 sm:p-4 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide">Sponsored Creator Partner</span>
                <span className="text-[9px] font-bold text-slate-400 bg-slate-800/80 px-1.5 py-0.2 rounded border border-slate-700">Ad</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Unlock 4K AI Upscaling & Automated Wirestock Sync with 25% Off Contributor Pro.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://stock.adobe.com/contributor"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-md"
            >
              <span>Explore Deals</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => setAdDismissed(true)}
              className="text-slate-500 hover:text-slate-300 text-xs p-1"
              title="Close Ad"
            >
              ✕
            </button>
          </div>
        </div>
        <span className="text-[9px] text-slate-600 uppercase tracking-wider mt-1">Google AdSense Placement Zone</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center space-y-2">
      <div className="flex items-center justify-between text-[10px] text-slate-500">
        <span>Sponsored</span>
        <button onClick={() => setAdDismissed(true)} className="hover:text-slate-300">✕</button>
      </div>
      <p className="text-xs font-semibold text-slate-200">
        Best Microstock AI Cameras & Lighting Rigs for 2026
      </p>
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="inline-block text-[11px] font-bold text-indigo-400 hover:text-indigo-300 underline"
      >
        View Recommended Gear
      </a>
    </div>
  );
};
