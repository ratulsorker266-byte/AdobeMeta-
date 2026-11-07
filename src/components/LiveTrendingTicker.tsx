import React, { useState } from 'react';
import { TrendingUp, Flame, Sparkles, Zap, ArrowUpRight, Copy, Check } from 'lucide-react';
import { playTickSound } from '../lib/audioFeedback';

interface LiveTrendingTickerProps {
  onSelectTrend?: (keyword: string) => void;
  showToast: (msg: string) => void;
  themeMode?: 'light' | 'dark';
}

interface TrendItem {
  id: string;
  tag: string;
  growth: string;
  category: 'Tech' | 'Seasonal' | 'Business' | 'Lifestyle';
  buyers: string;
  isHot?: boolean;
}

const TREND_DATA: TrendItem[] = [
  { id: '1', tag: 'Autumn Golden Hour Forest', growth: '+340%', category: 'Seasonal', buyers: 'High Demand', isHot: true },
  { id: '2', tag: 'Generative AI Robotics Lab', growth: '+280%', category: 'Tech', buyers: 'Very High', isHot: true },
  { id: '3', tag: 'Solar Energy Engineers', growth: '+215%', category: 'Tech', buyers: 'Commercial', isHot: true },
  { id: '4', tag: 'Fintech Mobile Investment App', growth: '+195%', category: 'Business', buyers: 'Enterprise' },
  { id: '5', tag: 'Senior Telemedicine Doctor', growth: '+170%', category: 'Lifestyle', buyers: 'Medical' },
  { id: '6', tag: 'Sustainable Eco Packaging', growth: '+155%', category: 'Business', buyers: 'Ecommerce' },
  { id: '7', tag: 'Cozy Hygge Home Interior', growth: '+140%', category: 'Lifestyle', buyers: 'Advertising' },
  { id: '8', tag: 'Electric Vehicle Fast Charging', growth: '+125%', category: 'Tech', buyers: 'Commercial' }
];

export const LiveTrendingTicker: React.FC<LiveTrendingTickerProps> = ({
  onSelectTrend,
  showToast,
  themeMode = 'dark'
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const isLight = themeMode === 'light';

  const handleTrendClick = (item: TrendItem) => {
    playTickSound();
    navigator.clipboard.writeText(item.tag);
    setCopiedId(item.id);
    showToast(`✓ Copied trending tag: "${item.tag}" (${item.growth} surge)`);
    if (onSelectTrend) {
      onSelectTrend(item.tag);
    }
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className={`w-full ${isLight ? 'bg-emerald-50/70 border-t border-emerald-200/80' : 'bg-gradient-to-r from-[#011610] via-[#022419] to-[#011610] border-t border-emerald-500/25'} backdrop-blur-md py-1.5 px-3 sm:px-4 overflow-hidden relative shadow-sm`}>
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        {/* Left Clean Label */}
        <div className="flex items-center gap-2 shrink-0 text-[11px] font-mono tracking-wider uppercase text-emerald-400 font-semibold">
          <span>Market Demand</span>
          <span className="opacity-30">/</span>
        </div>

        {/* Scrollable / Marquee Ticker Track */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex-1 flex items-center gap-2.5 overflow-x-auto scrollbar-none py-0.5"
        >
          {TREND_DATA.map((item) => {
            const isCopied = copiedId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTrendClick(item)}
                className={`group px-3 py-1 rounded-xl text-xs font-semibold transition flex items-center gap-2 whitespace-nowrap shrink-0 border cursor-pointer ${
                  isLight
                    ? item.isHot
                      ? 'bg-white hover:bg-emerald-50/60 border-amber-300 hover:border-amber-400 text-neutral-900 shadow-xs'
                      : 'bg-white hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300 text-neutral-800 shadow-2xs'
                    : item.isHot
                    ? 'bg-[#021d15]/90 hover:bg-[#032a20] border-rose-500/35 hover:border-rose-400 text-neutral-200 hover:shadow-[0_0_15px_rgba(244,42,65,0.2)]'
                    : 'bg-[#011610]/80 hover:bg-[#022419] border-emerald-500/25 hover:border-emerald-400 text-neutral-300'
                }`}
                title={`Click to copy & apply "${item.tag}"`}
              >
                <span className={`${isLight ? 'text-neutral-900 group-hover:text-emerald-700' : 'text-white group-hover:text-emerald-300'} transition font-bold`}>
                  {item.tag}
                </span>

                <span className={`font-mono text-[10px] font-black ${
                  isLight
                    ? 'text-emerald-700 bg-emerald-100/60 border-emerald-300'
                    : 'text-emerald-300 bg-emerald-950/70 border-emerald-500/40'
                } border px-1.5 py-0.2 rounded-md`}>
                  {item.growth}
                </span>

                <span className={`text-[9px] uppercase tracking-wider ${isLight ? 'text-neutral-500' : 'text-emerald-300/60'} hidden md:inline`}>
                  {item.category}
                </span>

                {isCopied ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className={`w-3 h-3 ${isLight ? 'text-neutral-400 group-hover:text-neutral-600' : 'text-neutral-400 group-hover:text-emerald-300'}`} />
                )}
              </button>
            );
          })}
        </div>

        <div className={`hidden lg:flex items-center gap-1 text-[10px] ${isLight ? 'text-neutral-500 font-medium' : 'text-emerald-200/60 font-medium'} shrink-0`}>
          <span>Click any trend to copy</span>
        </div>
      </div>
    </div>
  );
};
