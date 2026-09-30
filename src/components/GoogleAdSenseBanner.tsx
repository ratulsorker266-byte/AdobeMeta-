import React, { useState, useEffect } from 'react';
import { DollarSign, ExternalLink, Sparkles, TrendingUp, ShieldCheck, Zap, Star } from 'lucide-react';

interface GoogleAdSenseBannerProps {
  slotId?: string;
  format?: 'leaderboard' | 'rectangle' | 'in-feed';
  showAdPlaceholder?: boolean;
  themeMode?: 'light' | 'dark';
}

interface SponsorCreative {
  title: string;
  desc: string;
  badge: string;
  ctaText: string;
  url: string;
  tag: string;
  iconBg: string;
}

const IN_FEED_CREATIVES: SponsorCreative[] = [
  {
    title: 'Wirestock 1-Click Multi-Agency Sync',
    desc: 'Auto-publish this metadata to Adobe Stock, Shutterstock, Freepik, Getty & Pond5 simultaneously. Earn 85% royalties.',
    badge: 'Stock Contributor Deal',
    ctaText: 'Sync All Agencies',
    url: 'https://wirestock.io/?ref=adobemeta',
    tag: 'Recommended Partner',
    iconBg: 'from-blue-600 to-indigo-600'
  },
  {
    title: 'Topaz Gigapixel AI: Upscale to 8K',
    desc: 'Bypass stock rejection for low resolution. Turn 2K AI generated art into razor-sharp 300 DPI commercial vector & photos.',
    badge: 'Asset Quality Booster',
    ctaText: 'Get 20% Discount',
    url: 'https://www.topazlabs.com/gigapixel-ai',
    tag: 'Zero Quality Loss',
    iconBg: 'from-amber-500 to-orange-600'
  },
  {
    title: 'Adobe Stock Contributor VIP Portal',
    desc: 'Earn high-paying enterprise royalties and join the GenAI bonus payout program for accepted commercial visuals.',
    badge: 'Official Market',
    ctaText: 'Start Uploading',
    url: 'https://stock.adobe.com/contributor',
    tag: 'Direct Agency Access',
    iconBg: 'from-rose-600 to-red-600'
  }
];

export const GoogleAdSenseBanner: React.FC<GoogleAdSenseBannerProps> = ({
  slotId = 'ca-pub-monetize-slot',
  format = 'leaderboard',
  showAdPlaceholder = true,
  themeMode = 'dark',
}) => {
  const [adDismissed, setAdDismissed] = useState(false);
  const [creativeIdx, setCreativeIdx] = useState(0);
  const isLight = themeMode === 'light';

  useEffect(() => {
    // Attempt to push to Google AdSense adsbygoogle array if live script loaded
    if (typeof window !== 'undefined') {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (_) {}
    }
  }, []);

  if (adDismissed) return null;

  // IN-FEED NATIVE AD: Naturally inserted between metadata asset cards
  if (format === 'in-feed') {
    const creative = IN_FEED_CREATIVES[creativeIdx % IN_FEED_CREATIVES.length];

    return (
      <div className={`w-full my-3 ${isLight ? 'bg-white border-slate-200/90 shadow-sm' : 'bg-gradient-to-r from-slate-900/80 via-indigo-950/30 to-slate-900/80 border-indigo-500/30'} backdrop-blur-md border hover:border-indigo-500/60 rounded-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 transition-all duration-300`}>
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${creative.iconBg} text-white flex items-center justify-center shrink-0 shadow-md`}>
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] uppercase font-black ${isLight ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-amber-400 bg-amber-500/10 border-amber-500/30'} px-2 py-0.5 rounded-full border flex items-center gap-1`}>
                <Star className="w-2.5 h-2.5 fill-current" />
                {creative.badge}
              </span>
              <span className={`text-[9px] font-bold ${isLight ? 'text-slate-500 bg-slate-100 border-slate-200' : 'text-slate-400 bg-slate-800 border-slate-700'} px-1.5 py-0.2 rounded border`}>
                Ad • Sponsored
              </span>
            </div>
            <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'} tracking-wide`}>
              {creative.title}
            </h4>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'} max-w-xl mt-0.5 line-clamp-2`}>
              {creative.desc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 ml-auto sm:ml-0">
          <a
            href={creative.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>{creative.ctaText}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => setAdDismissed(true)}
            className={`${isLight ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'} p-1.5 rounded-lg text-xs transition cursor-pointer`}
            title="Dismiss ad"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  // TOP LEADERBOARD BANNER
  if (format === 'leaderboard') {
    return (
      <div className="w-full my-3 flex flex-col items-center justify-center">
        <div className={`w-full max-w-7xl ${isLight ? 'bg-white border-slate-200/90 shadow-sm' : 'bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-slate-800/90 shadow-lg'} border rounded-2xl p-3 sm:p-4 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-3`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 ${isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'} border rounded-xl shrink-0`}>
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'} tracking-wide`}>Featured Creator Partner</span>
                <span className={`text-[9px] font-bold ${isLight ? 'text-slate-500 bg-slate-100 border-slate-200' : 'text-slate-400 bg-slate-800/80 border-slate-700'} px-1.5 py-0.2 rounded border`}>Ad</span>
              </div>
              <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-300'}`}>
                Unlock 4K AI Upscaling & Automated Multi-Agency Distribution with 25% Off Contributor Pro.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://stock.adobe.com/contributor"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <span>Explore Deals</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => setAdDismissed(true)}
              className={`${isLight ? 'text-slate-400 hover:text-slate-600' : 'text-slate-500 hover:text-slate-300'} text-xs p-1 cursor-pointer`}
              title="Close Ad"
            >
              ✕
            </button>
          </div>
        </div>
        <span className={`text-[9px] ${isLight ? 'text-slate-400' : 'text-slate-600'} uppercase tracking-wider mt-1`}>Google AdSense Placement Zone</span>
      </div>
    );
  }

  // RECTANGLE FORMAT
  return (
    <div className={`${isLight ? 'bg-white border-slate-200/90 text-slate-800 shadow-sm' : 'bg-slate-950 border-slate-800 text-slate-200'} border rounded-2xl p-4 text-center space-y-2`}>
      <div className={`flex items-center justify-between text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
        <span>Sponsored</span>
        <button onClick={() => setAdDismissed(true)} className={`${isLight ? 'hover:text-slate-700' : 'hover:text-slate-300'} cursor-pointer`}>✕</button>
      </div>
      <p className="text-xs font-semibold">
        Best Microstock AI Cameras & Lighting Rigs for 2026
      </p>
      <a
        href="https://stock.adobe.com/contributor"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
      >
        View Recommended Deals
      </a>
    </div>
  );
};
