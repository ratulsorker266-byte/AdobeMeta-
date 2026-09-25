import React, { useState } from 'react';
import { TrendingUp, Flame, Sparkles, Zap, ArrowUpRight, Copy, Check } from 'lucide-react';
import { arcadeAudio } from './games/ArcadeSoundEngine';

interface LiveTrendingTickerProps {
  onSelectTrend?: (keyword: string) => void;
  showToast: (msg: string) => void;
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
  showToast
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const handleTrendClick = (item: TrendItem) => {
    arcadeAudio.playCoin();
    navigator.clipboard.writeText(item.tag);
    setCopiedId(item.id);
    showToast(`✓ Copied trending tag: "${item.tag}" (${item.growth} surge)`);
    if (onSelectTrend) {
      onSelectTrend(item.tag);
    }
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="w-full bg-slate-950/80 border-y border-slate-800/80 backdrop-blur-md py-2 px-3 sm:px-4 overflow-hidden relative shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        {/* Left Live Badge */}
        <div className="flex items-center gap-1.5 shrink-0 bg-indigo-950/70 border border-indigo-500/30 px-2.5 py-1 rounded-full shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Marketplace</span> Buyer Surge
          </span>
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
                className={`group px-3 py-1 rounded-xl text-xs font-semibold transition flex items-center gap-2 whitespace-nowrap shrink-0 border ${
                  item.isHot
                    ? 'bg-slate-900/90 hover:bg-slate-800 border-amber-500/30 hover:border-amber-400 text-slate-200'
                    : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
                title={`Click to copy & apply "${item.tag}"`}
              >
                <span className="text-white group-hover:text-amber-300 transition font-bold">
                  {item.tag}
                </span>

                <span className="font-mono text-[10px] font-black text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.2 rounded-md">
                  {item.growth}
                </span>

                <span className="text-[9px] uppercase tracking-wider text-slate-400 hidden md:inline">
                  {item.category}
                </span>

                {isCopied ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
                )}
              </button>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-1 text-[10px] text-slate-500 shrink-0 font-medium">
          <span>Click any trend to copy</span>
        </div>
      </div>
    </div>
  );
};
