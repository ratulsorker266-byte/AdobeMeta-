import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, AlertTriangle, ChevronDown, ChevronUp, Sparkles, Target, Shield, Tag, FileText } from 'lucide-react';
import { MetadataResult } from '../types';

interface CommercialReadinessGaugeProps {
  result: MetadataResult;
}

export const CommercialReadinessGauge: React.FC<CommercialReadinessGaugeProps> = ({ result }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  // 1. Title Score (max 25)
  const titleWords = (result.recommendedTitle || '').trim().split(/\s+/).filter(Boolean).length;
  let titleScore = 15;
  if (titleWords >= 7 && titleWords <= 16) {
    titleScore = 25;
  } else if (titleWords >= 5) {
    titleScore = 20;
  }

  // 2. Keyword Volume & Quality (max 25)
  const kwCount = (result.keywords || []).length;
  let kwScore = 15;
  if (kwCount >= 30 && kwCount <= 50) {
    kwScore = 25;
  } else if (kwCount >= 20) {
    kwScore = 20;
  }

  // 3. Shield & Trademark Safety (max 25)
  const hasTrademarks = (result.detectedTrademarks || []).length > 0;
  const flagCount = (result.rejectionFlags || []).length;
  let shieldScore = 25;
  if (hasTrademarks) {
    shieldScore -= 15;
  }
  if (flagCount > 0) {
    shieldScore -= Math.min(10, flagCount * 5);
  }
  shieldScore = Math.max(5, shieldScore);

  // 4. Commercial Viability / Acceptance Probability (max 25)
  const rawProb = typeof result.acceptanceProbability === 'number' ? result.acceptanceProbability : 85;
  const probScore = Math.round((rawProb / 100) * 25);

  const totalScore = Math.min(100, Math.max(20, titleScore + kwScore + shieldScore + probScore));

  const strokeColor =
    totalScore >= 85 ? '#10b981' : totalScore >= 70 ? '#f59e0b' : '#ef4444';
  const textColor =
    totalScore >= 85 ? 'text-emerald-400' : totalScore >= 70 ? 'text-amber-400' : 'text-rose-400';
  const badgeBg =
    totalScore >= 85 ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300' : totalScore >= 70 ? 'bg-amber-950/60 border-amber-800/60 text-amber-300' : 'bg-rose-950/60 border-rose-800/60 text-rose-300';

  // SVG circle calculations
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (totalScore / 100) * circumference;

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 space-y-2.5 transition">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Circular SVG Gauge */}
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg className="w-14 h-14 -rotate-90 transform" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r={radius}
                stroke="#1e293b"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="28"
                cy="28"
                r={radius}
                stroke={strokeColor}
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`text-xs font-black leading-none ${textColor}`}>{totalScore}</span>
              <span className="text-[8px] text-slate-500 font-bold uppercase">/ 100</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Commercial Readiness Score</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeBg}`}>
                {totalScore >= 90 ? 'Elite Ready' : totalScore >= 75 ? 'Optimized' : 'Needs Review'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Multi-marketplace acceptance probability & SEO indexing strength
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="text-xs font-medium text-slate-400 hover:text-indigo-400 transition flex items-center gap-1 shrink-0 p-1.5 rounded-lg hover:bg-slate-800"
          title="View 4-Pillar Score Breakdown"
        >
          <span className="text-[11px]">{showBreakdown ? 'Hide' : 'Details'}</span>
          {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expandable Breakdown Drawer */}
      {showBreakdown && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="pt-2 border-t border-slate-800 space-y-2 text-xs"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Title Pillar */}
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-[11px]">
                <FileText className="w-3 h-3 text-indigo-400" />
                <span>Title SEO</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">{titleWords} words</span>
                <span className="font-bold text-indigo-400">{titleScore}/25</span>
              </div>
            </div>

            {/* Keyword Pillar */}
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-[11px]">
                <Tag className="w-3 h-3 text-purple-400" />
                <span>Tag Depth</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">{kwCount} tags</span>
                <span className="font-bold text-purple-400">{kwScore}/25</span>
              </div>
            </div>

            {/* Shield Pillar */}
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-[11px]">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>Compliance</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">{hasTrademarks ? 'Trademarks' : 'Clean'}</span>
                <span className="font-bold text-emerald-400">{shieldScore}/25</span>
              </div>
            </div>

            {/* Viability Pillar */}
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-[11px]">
                <Target className="w-3 h-3 text-amber-400" />
                <span>Acceptance</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">{rawProb}%</span>
                <span className="font-bold text-amber-400">{probScore}/25</span>
              </div>
            </div>
          </div>

          <div className="p-2 bg-indigo-950/30 border border-indigo-500/20 rounded-lg text-[11px] text-indigo-200 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>
              {totalScore >= 90
                ? 'High-ranking commercial readiness. Perfectly balanced keywords and title format.'
                : 'Pro Tip: Maintain 30-49 keywords and 8-12 words in the title for maximum search traffic.'}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
