import React, { useState, useEffect } from 'react';
import { Target, Trophy, Flame, ChevronRight, Award } from 'lucide-react';

interface ContributorGoalWidgetProps {
  completedCount: number;
}

export const ContributorGoalWidget: React.FC<ContributorGoalWidgetProps> = ({ completedCount }) => {
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

  return (
    <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3 relative overflow-hidden group">
      {/* Background Accent Gradient */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Monthly Submission Milestone</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${rank.badge}`}>
                {rank.title}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-[11px] font-medium text-slate-400 hover:text-indigo-300 transition"
          >
            Target: <span className="text-white font-bold">{goal} assets</span>
          </button>
        </div>
      </div>

      {/* Goal target selector dropdown if editing */}
      {isEditing && (
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs gap-2">
          <span className="text-slate-400 text-[11px]">Set Monthly Target:</span>
          <div className="flex items-center gap-1.5">
            {[25, 50, 100, 250].map((t) => (
              <button
                key={t}
                onClick={() => setTarget(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  goal === t
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
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
          <span className="text-slate-400 text-[11px]">
            <strong className="text-white font-black">{completedCount}</strong> of {goal} completed
          </span>
          <span className="text-[11px] font-bold text-indigo-400">{progress}%</span>
        </div>

        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(99,102,241,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
