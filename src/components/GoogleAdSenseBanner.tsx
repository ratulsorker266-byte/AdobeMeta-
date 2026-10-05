import React, { useState, useEffect } from 'react';
import { ExternalLink, Sparkles, TrendingUp } from 'lucide-react';

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
}

const IN_FEED_CREATIVES: SponsorCreative[] = [
  {
    title: 'Wirestock 1-Click Multi-Agency Sync',
    desc: 'Auto-publish this metadata to Adobe Stock, Shutterstock, Freepik, Getty & Pond5 simultaneously. Earn 85% royalties.',
    badge: 'Contributor Partner',
    ctaText: 'Sync All Agencies',
    url: 'https://wirestock.io/?ref=adobemeta',
  },
  {
    title: 'Topaz Gigapixel AI: Upscale to 8K',
    desc: 'Bypass stock rejection for low resolution. Turn 2K AI generated art into razor-sharp 300 DPI commercial vector & photos.',
    badge: 'Asset Quality Booster',
    ctaText: 'Get 20% Discount',
    url: 'https://www.topazlabs.com/gigapixel-ai',
  },
  {
    title: 'Adobe Stock Contributor VIP Portal',
    desc: 'Earn high-paying enterprise royalties and join the GenAI bonus payout program for accepted commercial visuals.',
    badge: 'Official Market',
    ctaText: 'Start Uploading',
    url: 'https://stock.adobe.com/contributor',
  }
];

export const GoogleAdSenseBanner: React.FC<GoogleAdSenseBannerProps> = ({
  format = 'leaderboard',
  themeMode = 'light',
}) => {
  const [adDismissed, setAdDismissed] = useState(false);
  const [creativeIdx] = useState(0);
  const isLight = themeMode === 'light';

  useEffect(() => {
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
          ? 'bg-white border-neutral-200/90 shadow-2xs' 
          : 'bg-[#111319] border-neutral-800 shadow-md'
      } border rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 transition-all duration-200`}>
        <div className="flex items-center gap-3.5">
          <div className={`w-10 h-10 rounded-xl ${
            isLight ? 'bg-[#f6f5f2] text-neutral-900 border border-neutral-200/80' : 'bg-neutral-800 text-neutral-100 border border-neutral-700'
          } flex items-center justify-center shrink-0`}>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5 text-[10.5px] font-mono uppercase tracking-wider">
              <span className={`font-semibold ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>
                {creative.badge}
              </span>
              <span className="text-neutral-400">·</span>
              <span className="text-neutral-400">
                Sponsored
              </span>
            </div>
            <h4 className={`text-sm font-bold ${isLight ? 'text-neutral-900' : 'text-white'} tracking-tight`}>
              {creative.title}
            </h4>
            <p className={`text-xs ${isLight ? 'text-neutral-500' : 'text-neutral-400'} max-w-xl mt-0.5 line-clamp-2`}>
              {creative.desc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
          <a
            href={creative.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${
              isLight 
                ? 'bg-neutral-950 hover:bg-black text-white' 
                : 'bg-white hover:bg-neutral-200 text-neutral-950'
            } text-xs font-bold px-4 py-2 rounded-full transition flex items-center gap-1.5 shadow-2xs cursor-pointer`}
          >
            <span>{creative.ctaText}</span>
            <ExternalLink className="w-3 h-3" />
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
      <div className="w-full my-2 flex flex-col items-center justify-center">
        <div className={`w-full ${
          isLight 
            ? 'bg-white border-neutral-200/90 shadow-2xs' 
            : 'bg-[#111319] border-neutral-800 shadow-md'
        } border rounded-2xl p-3.5 sm:px-5 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-3`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 ${
              isLight ? 'bg-[#f6f5f2] border-neutral-200/80 text-neutral-800' : 'bg-neutral-800 border-neutral-700 text-neutral-200'
            } border rounded-xl shrink-0`}>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs">
                <span className={`font-bold ${isLight ? 'text-neutral-900' : 'text-white'} tracking-tight`}>
                  Featured Creator Partner
                </span>
                <span className="text-neutral-400">·</span>
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-neutral-400">
                  Google AdSense Verified
                </span>
              </div>
              <p className={`text-xs ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
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
                  ? 'bg-neutral-950 hover:bg-black text-white' 
                  : 'bg-white hover:bg-neutral-200 text-neutral-950'
              } text-xs font-bold px-4 py-1.5 rounded-full transition flex items-center gap-1.5 cursor-pointer`}
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

  // STICKY FOOTER ANCHOR AD (Subtle, non-overlapping bottom-left pill)
  if (format === 'sticky-footer') {
    return null;
  }

  // RECTANGLE FORMAT
  return (
    <div className={`${isLight ? 'bg-white border-neutral-200/90 text-neutral-800 shadow-2xs' : 'bg-[#111319] border-neutral-800 text-neutral-200'} border rounded-2xl p-4 text-center space-y-2`}>
      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-neutral-400">
        <span>Sponsored</span>
        <button onClick={() => setAdDismissed(true)} className="hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer">✕</button>
      </div>
      <p className="text-xs font-semibold">
        Best Microstock AI Cameras &amp; Vector Workflows for 2026
      </p>
      <a
        href="https://stock.adobe.com/contributor"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
      >
        View Recommended Deals
      </a>
    </div>
  );
};
