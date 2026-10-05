import React, { useState } from 'react';
import { Target, DollarSign, ArrowRight } from 'lucide-react';

interface ContributorGoalWidgetProps {
  completedCount: number;
  onOpenMonetize?: () => void;
  themeMode?: 'light' | 'dark';
}

export const ContributorGoalWidget: React.FC<ContributorGoalWidgetProps> = ({ 
  completedCount, 
  onOpenMonetize,
  themeMode = 'light'
}) => {
  const isLight = themeMode === 'light';
  const [goal, setGoal] = useState<number>(() => {
    const saved = localStorage.getItem('contributor_monthly_goal');
    return saved ? parseInt(saved, 10) : 100;
  });
  const [isEditing, setIsEditing] = useState(false);

  const setTarget = (val: number) => {
    setGoal(val);
    localStorage.setItem('contributor_monthly_goal', val.toString());
    setIsEditing(false);
  };

  const progress = Math.min(100, Math.round((completedCount / goal) * 100));

  const getRankTitle = (count: number) => {
    if (count >= 200) return 'Elite Master Contributor';
    if (count >= 100) return 'Gold Level Contributor';
    if (count >= 50) return 'Silver Contributor';
    return 'Rising Contributor';
  };

  const rankTitle = getRankTitle(completedCount);

  // Real-time commercial valuation calculation (accurate to actual completedCount)
  const estStockMonthly = (completedCount * 1.8 * 0.98).toFixed(0);
  const estAdSenseMonthly = ((completedCount * 450) / 1000 * 4.25).toFixed(0);
  const estCombinedMonthly = (Number(estStockMonthly) + Number(estAdSenseMonthly)).toFixed(0);
  const estAnnualValue = (Number(estCombinedMonthly) * 12).toLocaleString();

  return (
    <div className={`${
      isLight 
        ? 'bg-white border-neutral-200/90 text-neutral-900 shadow-2xs' 
        : 'bg-[#111318] border-neutral-800 text-neutral-100 shadow-xl'
    } border rounded-2xl p-4 sm:p-5 space-y-4 transition-colors duration-200`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
            isLight ? 'bg-[#f6f5f2] border-neutral-200/80 text-neutral-900' : 'bg-neutral-900 border-neutral-800 text-amber-400'
          }`}>
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-bold tracking-tight">
                Contributor Portfolio Milestone
              </span>
              <span className="text-neutral-400">·</span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
                {rankTitle}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              <strong className={`font-mono tabular-nums ${isLight ? 'text-neutral-900' : 'text-white'}`}>{completedCount}</strong> of {goal} assets processed ({progress}%)
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition cursor-pointer ${
            isLight
              ? 'bg-[#fbfaf8] border-neutral-200/90 text-neutral-700 hover:border-neutral-900 hover:text-black'
              : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-600 hover:text-white'
          }`}
        >
          Goal: <span className="font-mono font-bold">{goal}</span> (Change)
        </button>
      </div>

      {/* Goal target selector dropdown if editing */}
      {isEditing && (
        <div className={`p-3 rounded-xl ${
          isLight ? 'bg-[#fbfaf8] border-neutral-200/80' : 'bg-neutral-900 border-neutral-800'
        } border flex items-center justify-between text-xs gap-2 flex-wrap`}>
          <span className="text-[11px] font-medium text-neutral-500">Select Monthly Asset Target:</span>
          <div className="flex items-center gap-1.5">
            {[25, 50, 100, 250, 500].map((t) => (
              <button
                key={t}
                onClick={() => setTarget(t)}
                className={`px-3 py-1 rounded-full text-xs font-bold font-mono transition cursor-pointer ${
                  goal === t
                    ? (isLight ? 'bg-neutral-950 text-white' : 'bg-white text-black')
                    : (isLight ? 'bg-white border border-neutral-200 text-neutral-600 hover:text-black' : 'bg-neutral-800 text-neutral-400 hover:text-white')
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className={`w-full h-2 ${
        isLight ? 'bg-neutral-100' : 'bg-neutral-900'
      } rounded-full overflow-hidden`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isLight ? 'bg-neutral-950' : 'bg-amber-400'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Earning & Monetization Live Valuation Ticker */}
      <div className={`pt-3 border-t ${
        isLight ? 'border-neutral-100' : 'border-neutral-800/80'
      } flex flex-wrap items-center justify-between gap-3 text-xs`}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-1 text-neutral-500">
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
            <span>Est. Royalty:</span>
            <strong className={`font-mono ${isLight ? 'text-neutral-900' : 'text-white'}`}>${estStockMonthly}/mo</strong>
          </span>
          <span className="text-neutral-300 dark:text-neutral-700">·</span>
          <span className="text-neutral-500">
            AdSense Traffic: <strong className={`font-mono ${isLight ? 'text-neutral-900' : 'text-white'}`}>${estAdSenseMonthly}/mo</strong>
          </span>
          <span className="text-neutral-300 dark:text-neutral-700">·</span>
          <span className="text-neutral-500">
            Annual Value: <strong className="font-mono text-emerald-600 dark:text-emerald-400">${estAnnualValue}/yr</strong>
          </span>
        </div>

        {onOpenMonetize && (
          <button
            type="button"
            onClick={onOpenMonetize}
            className={`inline-flex items-center gap-1 text-[11px] font-bold transition cursor-pointer hover:underline ${
              isLight ? 'text-neutral-900' : 'text-amber-400'
            }`}
          >
            <span>Open Earning Simulator</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
