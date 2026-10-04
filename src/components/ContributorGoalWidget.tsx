import React, { useState, useEffect } from 'react';
import { Target, Trophy, Flame, ChevronRight, Award, DollarSign, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

interface ContributorGoalWidgetProps {
  completedCount: number;
  onOpenMonetize?: () => void;
  themeMode?: 'light' | 'dark';
}

export const ContributorGoalWidget: React.FC<ContributorGoalWidgetProps> = ({ 
  completedCount, 
  onOpenMonetize,
  themeMode = 'dark'
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

  const getRank = (count: number) => {
    if (count >= 200) return { title: 'Elite Master Contributor', badge: 'bg-purple-950 text-purple-300 border-purple-800' };
    if (count >= 100) return { title: 'Gold Level Contributor', badge: 'bg-amber-950 text-amber-300 border-amber-800' };
    if (count >= 50) return { title: 'Silver Contributor', badge: 'bg-slate-800 text-slate-200 border-slate-700' };
    return { title: 'Rising Contributor', badge: 'bg-indigo-950 text-indigo-300 border-indigo-800' };
  };

  const rank = getRank(completedCount);

  // Real-time commercial valuation calculation (accurate to actual completedCount)
  const estStockMonthly = (completedCount * 1.8 * 0.98).toFixed(0);
  const estAdSenseMonthly = ((completedCount * 450) / 1000 * 4.25).toFixed(0);
  const estCombinedMonthly = (Number(estStockMonthly) + Number(estAdSenseMonthly)).toFixed(0);
  const estAnnualValue = (Number(estCombinedMonthly) * 12).toLocaleString();

  return (
    <div className={`${isLight ? 'bg-white border-slate-200 shadow-md text-slate-800' : 'bg-slate-950/80 border-slate-800/90 shadow-xl text-slate-100'} border rounded-2xl p-4 sm:p-5 space-y-4 relative overflow-hidden group`}>
      {/* Background Accent Gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Contributor Portfolio &amp; Milestone Engine
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${rank.badge}`}>
                {rank.title}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`text-[11px] font-medium ${isLight ? 'text-slate-500 hover:text-indigo-600' : 'text-slate-400 hover:text-indigo-300'} transition cursor-pointer`}
          >
            Target: <span className={`${isLight ? 'text-slate-900' : 'text-white'} font-bold`}>{goal} assets</span> (Edit)
          </button>
        </div>
      </div>

      {/* Goal target selector dropdown if editing */}
      {isEditing && (
        <div className={`p-3 rounded-xl ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'} border flex items-center justify-between text-xs gap-2 flex-wrap`}>
          <span className="text-[11px] font-medium">Select Monthly Goal:</span>
          <div className="flex items-center gap-1.5">
            {[25, 50, 100, 250, 500].map((t) => (
              <button
                key={t}
                onClick={() => setTarget(t)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  goal === t
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isLight ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar & Counter */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <strong className={`${isLight ? 'text-slate-900' : 'text-white'} font-black`}>{completedCount}</strong> of {goal} assets ready for submission
          </span>
          <span className="text-[11px] font-bold text-indigo-400">{progress}% Completed</span>
        </div>

        <div className={`w-full h-2.5 ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800/80'} rounded-full overflow-hidden border p-0.5`}>
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(99,102,241,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Earning & Monetization Live Valuation Ticker */}
      <div className={`pt-3 border-t ${isLight ? 'border-slate-100 bg-slate-50/60' : 'border-slate-800/80 bg-slate-900/40'} -mx-4 -mb-4 px-4 py-3 rounded-b-2xl flex flex-wrap items-center justify-between gap-3`}>
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className={`font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Est. Portfolio Royalty:</span>
              <strong className="text-emerald-400 font-bold">${estStockMonthly}/mo</strong>
              <span className="text-slate-500 text-[10px]">·</span>
              <span className={`font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>AdSense Traffic:</span>
              <strong className="text-indigo-400 font-bold">${estAdSenseMonthly}/mo</strong>
            </div>
            <p className="text-[10px] text-slate-400">
              Projected Annual Dual-Stream Value: <strong className="text-emerald-400">${estAnnualValue}/year</strong>
            </p>
          </div>
        </div>

        {onOpenMonetize && (
          <button
            type="button"
            onClick={onOpenMonetize}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition cursor-pointer hover:underline"
          >
            <span>Open Monetization Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
