import React, { useState, useEffect } from 'react';
import { ExternalLink, Sparkles, TrendingUp, DollarSign, X, CheckCircle2, ChevronUp, Globe, Settings, ShieldCheck } from 'lucide-react';

interface GoogleAdSenseBannerProps {
  slotId?: string;
  format?: 'leaderboard' | 'rectangle' | 'in-feed' | 'sticky-footer';
  showAdPlaceholder?: boolean;
  themeMode?: 'light' | 'dark';
  onOpenMonetizeHub?: () => void;
}

interface SponsorCreative {
  title: string;
  desc: string;
  badge: string;
  ctaText: string;
  url: string;
  revenueTag?: string;
}

const SPONSOR_CREATIVES: SponsorCreative[] = [
  {
    title: 'Wirestock 1-Click Multi-Agency Sync',
    desc: 'Auto-publish this metadata to Adobe Stock, Shutterstock, Freepik, Getty & Pond5 simultaneously. Earn 85% royalties without manual uploads.',
    badge: 'Official Contributor Partner',
    ctaText: 'Sync All Agencies',
    url: 'https://wirestock.io/?ref=adobemeta',
    revenueTag: 'High Yield ($1.80 RPD)'
  },
  {
    title: 'Adobe Stock Contributor VIP Royalty Portal',
    desc: 'Earn high-paying enterprise royalties and join the GenAI bonus payout program for accepted commercial visuals.',
    badge: 'Official Market',
    ctaText: 'Start Uploading & Earning',
    url: 'https://stock.adobe.com/contributor',
    revenueTag: '33% Royalty Rate'
  },
  {
    title: 'Topaz Gigapixel AI: Upscale to 8K Commercial Resolution',
    desc: 'Bypass stock rejection for low resolution. Turn 2K AI generated art into razor-sharp 300 DPI commercial vector & photos.',
    badge: 'Asset Quality Booster',
    ctaText: 'Get 20% Discount',
    url: 'https://www.topazlabs.com/gigapixel-ai',
    revenueTag: 'Rejection Shield'
  },
  {
    title: 'Shutterstock Contributor Level 6 Earnings Boost',
    desc: 'Scale from 15% up to 40% royalties per download. Leverage high-volume B2B buyer subscriptions worldwide.',
    badge: 'Agency Partner',
    ctaText: 'Submit to Shutterstock',
    url: 'https://submit.shutterstock.com/',
    revenueTag: 'Up to 40% Payout'
  },
  {
    title: 'Freepik Premium Contributor Network',
    desc: 'Distribute vector EPS and illustrations to over 100M creative designers with guaranteed per-download compensation.',
    badge: 'Vector Specialist',
    ctaText: 'Join Freepik Contributor',
    url: 'https://contributor.freepik.com/',
    revenueTag: 'High Volume Tier'
  }
];

export const GoogleAdSenseBanner: React.FC<GoogleAdSenseBannerProps> = ({
  slotId = '6892019482',
  format = 'leaderboard',
  themeMode = 'light',
  onOpenMonetizeHub,
}) => {
  const [adDismissed, setAdDismissed] = useState(false);
  const [creativeIdx, setCreativeIdx] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [publisherId, setPublisherId] = useState<string>('ca-pub-4920194820194820');
  const isLight = themeMode === 'light';

  useEffect(() => {
    // Check for user-configured custom AdSense publisher ID in localStorage
    try {
      const storedPub = localStorage.getItem('adobemeta_adsense_pub_id');
      if (storedPub && storedPub.trim().length > 5) {
        setPublisherId(storedPub.trim());
      }
    } catch (_) {}

    // Rotate creative occasionally
    const rand = Math.floor(Math.random() * SPONSOR_CREATIVES.length);
    setCreativeIdx(rand);

    // Safe trigger of Google AdSense client script
    if (typeof window !== 'undefined') {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (_) {}
    }
  }, []);

  if (adDismissed) return null;

  const creative = SPONSOR_CREATIVES[creativeIdx % SPONSOR_CREATIVES.length];

  // ==========================================
  // IN-FEED NATIVE AD (Embedded between assets)
  // ==========================================
  if (format === 'in-feed') {
    return (
      <div className={`w-full my-4 ${
        isLight 
          ? 'bg-white border-neutral-200/90 shadow-2xs' 
          : 'bg-[#0a0d14] border-white/10 shadow-md'
      } border rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 transition-all duration-200 sovereign-prism-card relative overflow-hidden`}>
        {/* Prismatic Cyan Accent Edge */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
        
        {/* Official Google AdSense Ins Element (Indexed by Googlebot & AdSense script) */}
        <ins
          className="adsbygoogle hidden"
          style={{ display: 'none' }}
          data-ad-client={publisherId}
          data-ad-slot={slotId}
          data-ad-format="fluid"
          data-ad-layout-key="-fb+5w+4e-db+86"
        />

        <div className="flex items-center gap-3.5 min-w-0">
          <div className={`w-11 h-11 rounded-xl ${
            isLight ? 'bg-cyan-50 text-cyan-700 border border-cyan-200/80' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
          } flex items-center justify-center shrink-0`}>
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5 text-[10.5px] font-mono uppercase tracking-wider">
              <span className={`font-semibold ${isLight ? 'text-cyan-800' : 'text-cyan-300'}`}>
                {creative.badge}
              </span>
              <span className="text-neutral-400">·</span>
              <span className="text-neutral-400">
                Google AdSense High-RPM Partner
              </span>
              {creative.revenueTag && (
                <>
                  <span className="text-neutral-400 hidden sm:inline">·</span>
                  <span className="text-emerald-500 font-bold hidden sm:inline">
                    {creative.revenueTag}
                  </span>
                </>
              )}
            </div>
            <h4 className={`text-sm font-bold ${isLight ? 'text-neutral-900' : 'text-white'} tracking-tight truncate`}>
              {creative.title}
            </h4>
            <p className={`text-xs ${isLight ? 'text-neutral-500' : 'text-neutral-400'} max-w-xl mt-0.5 line-clamp-1`}>
              {creative.desc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
          {onOpenMonetizeHub && (
            <button
              type="button"
              onClick={onOpenMonetizeHub}
              className={`text-xs font-mono px-2.5 py-2 rounded-xl border transition cursor-pointer hidden md:flex items-center gap-1 ${
                isLight ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-600' : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300'
              }`}
              title="Open Google Monetize Hub"
            >
              <Globe className="w-3 h-3 text-emerald-500" />
              <span>Monetize Hub</span>
            </button>
          )}

          <a
            href={creative.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${
              isLight 
                ? 'bg-neutral-950 hover:bg-black text-white' 
                : 'bg-white hover:bg-neutral-100 text-neutral-950 font-bold shadow-sm'
            } text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer`}
          >
            <span>{creative.ctaText}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={() => setAdDismissed(true)}
            className={`${isLight ? 'text-neutral-400 hover:text-neutral-700' : 'text-neutral-500 hover:text-neutral-300'} p-1.5 rounded-lg text-xs transition cursor-pointer`}
            title="Dismiss ad"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // TOP LEADERBOARD BANNER (728x90 Adaptive)
  // ==========================================
  if (format === 'leaderboard') {
    return (
      <div className="w-full my-3 flex flex-col items-center justify-center">
        {/* Official Google AdSense Ins Element */}
        <ins
          className="adsbygoogle hidden"
          style={{ display: 'none' }}
          data-ad-client={publisherId}
          data-ad-slot={slotId}
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />

        <div className={`w-full ${
          isLight 
            ? 'bg-white border-neutral-200/90 shadow-2xs' 
            : 'bg-[#0a0d14] border-white/10 shadow-lg'
        } border rounded-2xl p-3.5 sm:px-6 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-3 sovereign-prism-card`}>
          
          {/* Subtle Ambient Cyan / Platinum Hairline */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/35 to-transparent"
          />

          <div className="flex items-center gap-3.5 min-w-0">
            <div className={`p-2.5 ${
              isLight ? 'bg-emerald-50 border-emerald-200/80 text-emerald-800' : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
            } border rounded-xl shrink-0`}>
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs">
                <span className={`font-bold ${isLight ? 'text-neutral-900' : 'text-white'} tracking-tight`}>
                  Google Monetized Publisher Unit
                </span>
                <span className="text-neutral-400">·</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-500 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  ads.txt Verified
                </span>
                <span className="text-neutral-400 hidden lg:inline">·</span>
                <span className="text-[10.5px] font-mono text-neutral-400 hidden lg:inline">
                  {publisherId}
                </span>
              </div>
              <p className={`text-xs ${isLight ? 'text-neutral-600' : 'text-neutral-300'} mt-0.5 truncate max-w-xl`}>
                {creative.title}: {creative.desc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {onOpenMonetizeHub && (
              <button
                type="button"
                onClick={onOpenMonetizeHub}
                className={`text-xs font-mono px-3 py-1.5 rounded-xl border transition cursor-pointer hidden md:flex items-center gap-1.5 ${
                  isLight ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700' : 'bg-white/5 hover:bg-white/10 border-white/15 text-neutral-200'
                }`}
                title="Configure Google AdSense & ads.txt settings"
              >
                <Settings className="w-3.5 h-3.5 text-amber-500" />
                <span>Monetize Settings</span>
              </button>
            )}

            <a
              href={creative.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${
                isLight 
                  ? 'bg-neutral-950 hover:bg-black text-white' 
                  : 'bg-white hover:bg-neutral-100 text-neutral-950 font-bold shadow-sm'
              } text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer`}
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              <span>{creative.ctaText}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => setAdDismissed(true)}
              className={`${isLight ? 'text-neutral-400 hover:text-neutral-700' : 'text-neutral-500 hover:text-neutral-300'} text-xs p-1.5 cursor-pointer`}
              title="Close Ad"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // STICKY FOOTER ANCHOR AD (High Viewability)
  // ==========================================
  if (format === 'sticky-footer') {
    if (isMinimized) {
      return (
        <div className="fixed bottom-3 right-4 z-40">
          <button
            onClick={() => setIsMinimized(false)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-xl border cursor-pointer ${
              isLight
                ? 'bg-white text-neutral-800 border-neutral-300 hover:border-neutral-500'
                : 'bg-[#0f1118] text-white border-white/20 hover:border-white/40'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Google Monetize Hub</span>
            <ChevronUp className="w-3 h-3" />
          </button>
        </div>
      );
    }

    return (
      <div className="fixed bottom-0 inset-x-0 z-40 p-2 sm:p-3 pointer-events-none">
        {/* Official Google AdSense Ins Element */}
        <ins
          className="adsbygoogle hidden"
          style={{ display: 'none' }}
          data-ad-client={publisherId}
          data-ad-slot={slotId}
          data-ad-format="horizontal"
        />

        <div className={`max-w-4xl mx-auto pointer-events-auto rounded-2xl p-3 sm:px-5 border shadow-2xl transition-all duration-300 flex items-center justify-between gap-3 ${
          isLight
            ? 'crystal-glass-panel-light text-neutral-900 border-neutral-300/80'
            : 'crystal-glass-panel-dark text-white border-white/20'
        }`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="min-w-0 text-left">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                <span>Google AdSense Slot {slotId}</span>
                <span>·</span>
                <span className="text-emerald-500 font-bold">Active Monetization</span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline text-neutral-400">{publisherId}</span>
              </div>
              <div className="text-xs font-bold truncate">
                Adobe Stock &amp; Microstock Contributor Bonus Program · Earn $0.85 - $3.50+ RPD
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenMonetizeHub && (
              <button
                type="button"
                onClick={onOpenMonetizeHub}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border transition cursor-pointer hidden sm:flex items-center gap-1 ${
                  isLight ? 'bg-white border-neutral-300 text-neutral-800' : 'bg-white/10 border-white/20 text-white'
                }`}
              >
                <Globe className="w-3 h-3 text-emerald-400" />
                <span>Monetize</span>
              </button>
            )}

            <a
              href={creative.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer ${
                isLight ? 'bg-neutral-950 text-white' : 'bg-white hover:bg-zinc-200 text-black font-semibold'
              }`}
            >
              <span>Explore Earnings</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-xs p-1 text-neutral-400 hover:text-white cursor-pointer"
              title="Minimize banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RECTANGLE FORMAT (Sidebar / Dashboard Box)
  // ==========================================
  return (
    <div className={`${isLight ? 'bg-white border-neutral-200/90 text-neutral-800 shadow-2xs' : 'bg-[#0f1118] border-neutral-800 text-neutral-200'} border rounded-2xl p-4 text-center space-y-2 sovereign-prism-card`}>
      {/* Official Google AdSense Ins Element */}
      <ins
        className="adsbygoogle hidden"
        style={{ display: 'none' }}
        data-ad-client={publisherId}
        data-ad-slot={slotId}
        data-ad-format="rectangle"
      />

      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-neutral-400">
        <span>Sponsored Publisher Slot</span>
        <button onClick={() => setAdDismissed(true)} className="hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer">
          <X className="w-3 h-3" />
        </button>
      </div>
      <p className="text-xs font-bold">
        {creative.title}
      </p>
      <p className="text-[11px] text-neutral-400 line-clamp-2">
        {creative.desc}
      </p>
      <a
        href={creative.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer pt-1"
      >
        {creative.ctaText} →
      </a>
    </div>
  );
};
