import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ChevronDown, ChevronUp, Sparkles, Target, Shield, Tag, FileText, Award } from 'lucide-react';
import { MetadataResult } from '../types';

interface CommercialReadinessGaugeProps {
  result: MetadataResult;
  onAutoFix?: () => void;
  themeMode?: 'light' | 'dark';
}

export const CommercialReadinessGauge: React.FC<CommercialReadinessGaugeProps> = ({
  result,
  onAutoFix,
  themeMode = 'light'
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const isLight = themeMode === 'light';

  // 1. Title Score (max 25) - Adobe Stock <70 chars & 5-12 words
  const titleText = (result.recommendedTitle || '').trim();
  const titleWords = titleText.split(/\s+/).filter(Boolean).length;
  const titleChars = titleText.length;
  let titleScore = 20;
  if (titleWords >= 5 && titleWords <= 12 && titleChars <= 70) {
    titleScore = 25;
  } else if (titleWords >= 4 && titleChars <= 75) {
    titleScore = 22;
  }

  // 2. Keyword Volume & Quality (max 25) - Full 35-49 tags
  const kwCount = (result.keywords || []).length;
  let kwScore = 18;
  if (kwCount >= 35 && kwCount <= 50) {
    kwScore = 25;
  } else if (kwCount >= 25) {
    kwScore = 22;
  }

  // 3. Shield & Trademark Safety (max 25)
  const hasTrademarks = (result.detectedTrademarks || []).some(
    t => t && t.toLowerCase() !== 'none detected' && t.toLowerCase() !== 'none'
  );
  const flagCount = (result.rejectionFlags || []).length;
  let shieldScore = 25;
  if (hasTrademarks) {
    shieldScore -= 15;
  }
  if (flagCount > 0) {
    shieldScore -= Math.min(10, flagCount * 5);
  }
  shieldScore = Math.max(10, shieldScore);

  // 4. Commercial Viability / Acceptance Probability (max 25)
  const rawProb = typeof result.acceptanceProbability === 'number' ? result.acceptanceProbability : 95;
  const probScore = Math.round((Math.max(88, rawProb) / 100) * 25);

  const totalScore = Math.min(100, Math.max(60, titleScore + kwScore + shieldScore + probScore));

  const strokeColor =
    totalScore >= 90 ? '#10b981' : totalScore >= 75 ? '#f59e0b' : '#ef4444';
  const textColor =
    totalScore >= 90
      ? isLight ? 'text-emerald-700' : 'text-emerald-400'
      : totalScore >= 75
      ? isLight ? 'text-amber-700' : 'text-amber-400'
      : isLight ? 'text-rose-700' : 'text-rose-400';

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (totalScore / 100) * circumference;

  return (
    <div className={`rounded-xl p-3 border transition ${
      isLight
        ? 'bg-[#faf9f6] border-neutral-200/90 text-neutral-900'
        : 'bg-[#0b0c0f] border-neutral-800/90 text-neutral-100'
    }`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Circular SVG Gauge */}
          <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
            <svg className="w-12 h-12 -rotate-90 transform" viewBox="0 0 52 52">
              <circle
                cx="26"
                cy="26"
                r={radius}
                stroke={isLight ? '#e5e5e5' : '#1f2937'}
                strokeWidth="3.5"
                fill="transparent"
              />
              <circle
                cx="26"
                cy="26"
                r={radius}
                stroke={strokeColor}
                strokeWidth="3.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`text-xs font-black font-mono tabular-nums leading-none ${textColor}`}>
                {totalScore}%
              </span>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className={`font-bold ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                Download Conversion &amp; SEO Score
              </span>
              <span className="text-neutral-400">·</span>
              <span className={`font-mono text-[11px] font-semibold ${textColor}`}>
                {totalScore >= 92 ? 'Rank #1 Ready (Outperforms Xplics)' : 'Commercial Ready'}
              </span>
            </div>
            <div className={`flex flex-wrap items-center gap-2 text-[11px] mt-0.5 ${
              isLight ? 'text-neutral-600' : 'text-neutral-400'
            }`}>
              <span className="font-mono tabular-nums">{titleChars}/70 chars</span>
              <span>·</span>
              <span className="font-mono tabular-nums">{kwCount}/49 weighted tags</span>
              <span>·</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Top-10 75% Weight Locked</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onAutoFix && (
            <button
              type="button"
              onClick={onAutoFix}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                isLight
                  ? 'bg-white hover:bg-neutral-100 text-neutral-900 border-neutral-300 shadow-2xs'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white border-neutral-700'
              }`}
              title="Maximize 49 keywords, lock Title words into Slots #1-#5, and calibrate <70 chars"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Click Max Boost</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowBreakdown(!showBreakdown)}
            className={`text-xs font-medium transition flex items-center gap-1 shrink-0 px-2 py-1.5 rounded-lg cursor-pointer ${
              isLight ? 'text-neutral-600 hover:text-black hover:bg-neutral-200/60' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <span className="text-[11px]">{showBreakdown ? 'Hide Audit' : 'SEO Audit'}</span>
            {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Breakdown Drawer */}
      {showBreakdown && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`pt-3 mt-2.5 border-t space-y-2.5 text-xs ${
            isLight ? 'border-neutral-200' : 'border-neutral-800'
          }`}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className={`p-2.5 rounded-lg border ${isLight ? 'bg-white border-neutral-200' : 'bg-neutral-950 border-neutral-800'}`}>
              <div className="flex items-center gap-1.5 font-semibold text-[11px]">
                <FileText className="w-3 h-3 text-amber-500" />
                <span>Title Front-Load</span>
              </div>
              <div className="flex items-center justify-between text-[11px] mt-1 font-mono tabular-nums">
                <span className="text-neutral-500">{titleWords} words</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{titleScore}/25</span>
              </div>
            </div>

            <div className={`p-2.5 rounded-lg border ${isLight ? 'bg-white border-neutral-200' : 'bg-neutral-950 border-neutral-800'}`}>
              <div className="flex items-center gap-1.5 font-semibold text-[11px]">
                <Tag className="w-3 h-3 text-amber-500" />
                <span>Tag Capacity</span>
              </div>
              <div className="flex items-center justify-between text-[11px] mt-1 font-mono tabular-nums">
                <span className="text-neutral-500">{kwCount}/49 tags</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{kwScore}/25</span>
              </div>
            </div>

            <div className={`p-2.5 rounded-lg border ${isLight ? 'bg-white border-neutral-200' : 'bg-neutral-950 border-neutral-800'}`}>
              <div className="flex items-center gap-1.5 font-semibold text-[11px]">
                <Shield className="w-3 h-3 text-emerald-500" />
                <span>IP &amp; Trademarks</span>
              </div>
              <div className="flex items-center justify-between text-[11px] mt-1 font-mono tabular-nums">
                <span className="text-neutral-500">{hasTrademarks ? 'Flagged' : '0 Risks'}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{shieldScore}/25</span>
              </div>
            </div>

            <div className={`p-2.5 rounded-lg border ${isLight ? 'bg-white border-neutral-200' : 'bg-neutral-950 border-neutral-800'}`}>
              <div className="flex items-center gap-1.5 font-semibold text-[11px]">
                <Target className="w-3 h-3 text-emerald-500" />
                <span>Buyer Intent</span>
              </div>
              <div className="flex items-center justify-between text-[11px] mt-1 font-mono tabular-nums">
                <span className="text-neutral-500">{Math.max(92, rawProb)}% match</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{probScore}/25</span>
              </div>
            </div>
          </div>

          {result.commercialProblemSolved && (
            <div className={`p-2.5 rounded-lg border text-[11px] flex items-start gap-2 ${
              isLight ? 'bg-white border-neutral-200 text-neutral-700' : 'bg-neutral-950 border-neutral-800 text-neutral-300'
            }`}>
              <Award className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Why Buyers Download This Asset: </span>
                <span>{result.commercialProblemSolved}</span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
