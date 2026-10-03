import React, { useState, useEffect } from 'react';
import { DollarSign, ExternalLink, Sparkles, TrendingUp, ShieldCheck, Zap, Star } from 'lucide-react';

interface GoogleAdSenseBannerProps {
  slotId?: string;
  format?: 'leaderboard' | 'rectangle' | 'in-feed' | 'sticky-footer';
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
      <div className={`w-full my-3 ${
        isLight 
          ? 'bg-white border-stone-200/90 shadow-xs' 
          : 'bg-[#111319] border-stone-800 shadow-md'
      } border rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 transition-all duration-200`}>
        <div className="flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-xl ${
            isLight ? 'bg-stone-100 text-neutral-900 border border-stone-200/60' : 'bg-stone-800 text-stone-100 border border-stone-700/60'
          } flex items-center justify-center shrink-0`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 text-[11px]">
              <span className={`font-semibold ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>
                {creative.badge}
              </span>
              <span className="text-neutral-400">·</span>
              <span className="text-neutral-400 font-medium">
                Sponsored
              </span>
            </div>
            <h4 className={`text-sm font-semibold ${isLight ? 'text-neutral-900' : 'text-white'} tracking-tight`}>
              {creative.title}
            </h4>
            <p className={`text-xs ${isLight ? 'text-neutral-600' : 'text-neutral-400'} max-w-xl mt-0.5 line-clamp-2`}>
              {creative.desc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 ml-auto sm:ml-0">
          <a
            href={creative.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${
              isLight 
                ? 'bg-neutral-900 hover:bg-black text-white' 
                : 'bg-white hover:bg-neutral-100 text-neutral-950 font-semibold'
            } text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer`}
          >
            <span>{creative.ctaText}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => setAdDismissed(true)}
            className={`${isLight ? 'text-neutral-400 hover:text-neutral-700' : 'text-neutral-500 hover:text-neutral-300'} p-1.5 rounded-lg text-xs transition cursor-pointer`}
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
        <div className={`w-full max-w-7xl ${
          isLight 
            ? 'bg-white border-stone-200/90 shadow-xs' 
            : 'bg-[#111319] border-stone-800 shadow-md'
        } border rounded-2xl p-3.5 sm:p-4 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-3`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 ${
              isLight ? 'bg-stone-100 border-stone-200 text-neutral-800' : 'bg-stone-800 border-stone-700 text-stone-200'
            } border rounded-xl shrink-0`}>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs">
                <span className={`font-semibold ${isLight ? 'text-neutral-900' : 'text-white'} tracking-tight`}>
                  Featured Creator Partner
                </span>
                <span className="text-neutral-400">·</span>
                <span className={`text-[10.5px] ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  Google AdSense Compliant
                </span>
              </div>
              <p className={`text-[11.5px] ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                Unlock 4K AI Upscaling &amp; Automated Multi-Agency Distribution with 25% Off Contributor Pro.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://stock.adobe.com/contributor"
              target="_blank"
              rel="noopener noreferrer"
              className={`${
                isLight 
                  ? 'bg-neutral-900 hover:bg-black text-white' 
                  : 'bg-white hover:bg-neutral-100 text-neutral-950 font-semibold'
              } text-xs px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer`}
            >
              <span>Explore Deals</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => setAdDismissed(true)}
              className={`${isLight ? 'text-neutral-400 hover:text-neutral-700' : 'text-neutral-500 hover:text-neutral-300'} text-xs p-1 cursor-pointer`}
              title="Close Ad"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STICKY FOOTER ANCHOR AD (Highest AdSense RPM on mobile and desktop)
  if (format === 'sticky-footer') {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 p-2 sm:p-3 pointer-events-none flex justify-center animate-slide-up">
        <div className={`pointer-events-auto max-w-4xl w-full ${isLight ? 'bg-white/95 border-slate-200/90 text-slate-800 shadow-2xl' : 'bg-slate-900/95 border-indigo-500/40 text-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.8)]'} backdrop-blur-xl border rounded-2xl p-3 flex items-center justify-between gap-3`}>
          <div className="flex items-center gap-3">
            <span className={`text-[9px] font-black uppercase ${isLight ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-500/20 text-indigo-300'} px-2 py-0.5 rounded-md border border-indigo-500/30`}>
              Sponsored
            </span>
            <div className="text-xs">
              <span className="font-bold mr-1.5">Wirestock AI Contributor:</span>
              <span className={isLight ? 'text-slate-600' : 'text-slate-300'}>
                Auto-distribute stock vectors and photos to 7+ global agencies in 1-click.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://wirestock.io/?ref=adobemeta"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
            >
              <span>Explore Deal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => setAdDismissed(true)}
              className={`${isLight ? 'text-slate-400 hover:text-slate-600' : 'text-slate-500 hover:text-slate-300'} p-1 text-xs hover:bg-slate-800/40 rounded-lg transition`}
              title="Close Ad"
            >
              ✕
            </button>
          </div>
        </div>
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
