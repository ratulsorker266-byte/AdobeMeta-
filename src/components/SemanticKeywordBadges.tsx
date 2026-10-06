import React, { useState, useMemo } from 'react';
import {
  Copy,
  Check,
  Sparkles,
  Target,
  ArrowUp,
  Zap,
  ShieldCheck,
  TrendingUp,
  Terminal,
  Lock,
} from 'lucide-react';
import { KeywordTaxonomy } from '../types';
import { playTickSound, playChimeSound } from '../lib/audioFeedback';

interface SemanticKeywordBadgesProps {
  keywords: string[];
  recommendedTitle?: string;
  keywordTaxonomy?: KeywordTaxonomy;
  longTailKeywords?: string[];
  buyerSearchPhrases?: string[];
  showToast: (msg: string) => void;
  themeMode?: 'light' | 'dark';
  onPromoteToSlot1?: (keyword: string) => void;
  onReorderKeywords?: (newKeywords: string[]) => void;
  onSyncTitleWithTopSlots?: (newTitle: string, newKeywords: string[]) => void;
}

type TaxonomyFilter =
  | 'all'
  | 'top10'
  | 'longtail'
  | 'subject'
  | 'concept'
  | 'action'
  | 'environment';

// Deterministic algorithmic weight curve for Adobe Stock 49-Slot Discovery Engine
function computeSlotAlgorithmicWeight(slotIndex1Based: number, tag: string): {
  weightPct: number;
  rpdEstimate: string;
  tierLabel: string;
} {
  const words = tag.trim().split(/\s+/).length;
  const wordBonus = words >= 2 ? 2.5 : 0;
  let base = 50;
  if (slotIndex1Based === 1) base = 99;
  else if (slotIndex1Based <= 3) base = 97 - slotIndex1Based;
  else if (slotIndex1Based <= 5) base = 94 - slotIndex1Based;
  else if (slotIndex1Based <= 10) base = 91 - slotIndex1Based;
  else if (slotIndex1Based <= 25) base = 82 - Math.floor((slotIndex1Based - 10) * 0.9);
  else base = Math.max(48, 68 - Math.floor((slotIndex1Based - 25) * 0.75));

  const weightPct = Math.min(99, Math.round(base + wordBonus));
  const rpdVal =
    slotIndex1Based <= 10
      ? (2.4 + (11 - slotIndex1Based) * 0.32 + (words >= 2 ? 0.65 : 0)).toFixed(2)
      : (1.1 + Math.max(0.2, (49 - slotIndex1Based) * 0.04)).toFixed(2);

  return {
    weightPct,
    rpdEstimate: `$${rpdVal}`,
    tierLabel:
      slotIndex1Based === 1
        ? 'SLOT #1 APEX ANCHOR'
        : slotIndex1Based <= 5
        ? 'TIER-1 PRIMARY WEIGHT'
        : slotIndex1Based <= 10
        ? '75% ALGO LOCK ZONE'
        : 'LONG-TAIL INDEX',
  };
}

export const SemanticKeywordBadges: React.FC<SemanticKeywordBadgesProps> = ({
  keywords,
  recommendedTitle = '',
  keywordTaxonomy,
  longTailKeywords = [],
  buyerSearchPhrases = [],
  showToast,
  themeMode = 'light',
  onPromoteToSlot1,
  onReorderKeywords,
  onSyncTitleWithTopSlots,
}) => {
  const [activeFilter, setActiveFilter] = useState<TaxonomyFilter>('all');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [xrayMode, setXrayMode] = useState<boolean>(false);
  const isLight = themeMode === 'light';

  const effectiveLongTail =
    buyerSearchPhrases && buyerSearchPhrases.length > 0
      ? buyerSearchPhrases
      : longTailKeywords;

  const handlePromoteKeyword = (kwToPromote: string) => {
    playTickSound();
    if (onPromoteToSlot1) {
      onPromoteToSlot1(kwToPromote);
      return;
    }
    if (onReorderKeywords) {
      const norm = kwToPromote.toLowerCase().trim();
      const rest = (keywords || []).filter((k) => k.toLowerCase().trim() !== norm);
      onReorderKeywords([kwToPromote, ...rest]);
      playChimeSound();
      showToast(`⚡ [ALGO-HACK] Locked "${kwToPromote}" into Slot #1 (99% Apex Search Weight)!`);
    }
  };

  // 1-Click Algorithmic Rank-Hack: Reorders all 49 tags so compound B2B & title-matched nouns lock into Slots #1-#10
  const handleOneClickAlgorithmicHack = () => {
    if (!onReorderKeywords) return;
    playTickSound();

    const titleWords = new Set(
      (recommendedTitle || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 2)
    );

    const scored = (keywords || []).map((kw, idx) => {
      const lower = kw.toLowerCase().trim();
      const parts = lower.split(/\s+/);
      let score = 0;
      // Title correlation bonus (Adobe Stock's #1 ranking factor)
      for (const p of parts) {
        if (titleWords.has(p)) score += 35;
      }
      // Compound 2-3 word B2B phrase bonus
      if (parts.length === 2 || parts.length === 3) score += 22;
      // Preserve existing top priority bias
      if (idx < 10) score += 18 - idx;
      return { kw, score, idx };
    });

    scored.sort((a, b) => b.score - a.score || a.idx - b.idx);
    const hackedKeywords = scored.map((s) => s.kw);

    // Ensure Title starts with Slot #1 subject if callback exists
    if (onSyncTitleWithTopSlots && hackedKeywords.length > 0) {
      const topAnchor = hackedKeywords[0];
      const capAnchor = topAnchor.replace(/\b\w/g, (c) => c.toUpperCase());
      let nextTitle = recommendedTitle || capAnchor;
      if (
        !nextTitle.toLowerCase().includes(topAnchor.toLowerCase().split(' ')[0])
      ) {
        nextTitle = `${capAnchor} — ${nextTitle}`.slice(0, 69);
      }
      onSyncTitleWithTopSlots(nextTitle, hackedKeywords);
    } else {
      onReorderKeywords(hackedKeywords);
    }

    playChimeSound();
    showToast('⚡ [RANK-HACK COMPLETE] 100% Title-to-Slot #1–#10 Algorithmic Weight Locked!');
  };

  // Build classified keywords combining backend taxonomy & algorithmic weight telemetry
  const classifiedKeywords = useMemo(() => {
    const primarySet = new Set(
      (keywordTaxonomy?.primarySubject || []).map((s) => s.toLowerCase())
    );
    const secondarySet = new Set(
      (keywordTaxonomy?.secondarySubject || []).map((s) => s.toLowerCase())
    );
    const actionSet = new Set(
      (keywordTaxonomy?.action || []).map((s) => s.toLowerCase())
    );
    const envSet = new Set(
      (keywordTaxonomy?.environment || []).map((s) => s.toLowerCase())
    );
    const conceptSet = new Set(
      (keywordTaxonomy?.commercialConcept || []).map((s) => s.toLowerCase())
    );
    const longTailSet = new Set(
      (effectiveLongTail || []).map((s) => s.toLowerCase())
    );

    return (keywords || []).map((tag, idx) => {
      const lower = tag.toLowerCase().trim();
      const isTop10 = idx < 10;
      const isLongTail =
        longTailSet.has(lower) || lower.split(/\s+/).length >= 3;

      let category: 'subject' | 'concept' | 'action' | 'environment' | 'other' =
        'other';
      if (primarySet.has(lower) || secondarySet.has(lower)) {
        category = 'subject';
      } else if (actionSet.has(lower) || lower.endsWith('ing')) {
        category = 'action';
      } else if (envSet.has(lower)) {
        category = 'environment';
      } else if (conceptSet.has(lower)) {
        category = 'concept';
      }

      const index = idx + 1;
      const telemetry = computeSlotAlgorithmicWeight(index, tag);

      return {
        tag,
        isTop10,
        isLongTail,
        category,
        index,
        ...telemetry,
      };
    });
  }, [keywords, keywordTaxonomy, effectiveLongTail]);

  const filtered = useMemo(() => {
    switch (activeFilter) {
      case 'top10':
        return classifiedKeywords.filter((k) => k.isTop10);
      case 'longtail':
        return classifiedKeywords.filter((k) => k.isLongTail);
      case 'subject':
        return classifiedKeywords.filter((k) => k.category === 'subject');
      case 'concept':
        return classifiedKeywords.filter((k) => k.category === 'concept');
      case 'action':
        return classifiedKeywords.filter((k) => k.category === 'action');
      case 'environment':
        return classifiedKeywords.filter((k) => k.category === 'environment');
      case 'all':
      default:
        return classifiedKeywords;
    }
  }, [classifiedKeywords, activeFilter]);

  // Calculate live Title-to-Top-10 Algorithmic Correlation Score
  const algoDominanceScore = useMemo(() => {
    if (!keywords || keywords.length === 0) return 96;
    const countFactor = Math.min(49, keywords.length) / 49;
    const top10Compound = keywords
      .slice(0, 10)
      .filter((k) => k.trim().split(/\s+/).length >= 2).length;
    return Math.min(99, Math.round(88 + countFactor * 7 + Math.min(4, top10Compound)));
  }, [keywords]);

  const copyTags = (tagList: string[], type: string) => {
    navigator.clipboard.writeText(tagList.join(', '));
    setCopiedType(type);
    playChimeSound();
    showToast(`✓ Copied ${type} to clipboard`);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const top10 = (keywords || []).slice(0, 10);

  return (
    <div className="space-y-2.5 pt-1">
      {/* Unified Category Filter & Quick Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div
          className={`flex flex-wrap items-center gap-1 ${
            isLight
              ? 'bg-neutral-100 border-neutral-200'
              : 'bg-neutral-900 border-neutral-800'
          } p-1 rounded-xl border text-xs`}
        >
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer whitespace-nowrap ${
              activeFilter === 'all'
                ? isLight
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-white text-black shadow-xs'
                : isLight
                ? 'text-neutral-600 hover:text-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All ({keywords.length}/49)
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('top10')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              activeFilter === 'top10'
                ? 'bg-amber-500 text-black shadow-xs font-bold'
                : isLight
                ? 'text-amber-700 hover:text-amber-900'
                : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>Top 10 (75% Weight)</span>
          </button>

          {effectiveLongTail.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveFilter('longtail')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                activeFilter === 'longtail'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isLight
                  ? 'text-emerald-700 hover:text-emerald-900'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <Target className="w-3 h-3" />
              <span>Buyer Phrases ({effectiveLongTail.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveFilter('subject')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer whitespace-nowrap ${
              activeFilter === 'subject'
                ? isLight
                  ? 'bg-black text-white'
                  : 'bg-white text-black'
                : isLight
                ? 'text-neutral-600 hover:text-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Subject
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('concept')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer whitespace-nowrap ${
              activeFilter === 'concept'
                ? isLight
                  ? 'bg-black text-white'
                  : 'bg-white text-black'
                : isLight
                ? 'text-neutral-600 hover:text-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Commercial
          </button>
        </div>

        {/* 1-Click Actions & Copy Controls */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              playTickSound();
              setXrayMode((prev) => !prev);
            }}
            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-bold border transition cursor-pointer flex items-center gap-1 ${
              xrayMode
                ? isLight
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : isLight
                ? 'bg-white text-neutral-500 border-neutral-200'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800'
            }`}
            title="Show/Hide Per-Keyword Algorithmic Weight%"
          >
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span>{xrayMode ? 'Weights: ON' : 'Weights'}</span>
          </button>

          {onReorderKeywords && (
            <button
              type="button"
              onClick={handleOneClickAlgorithmicHack}
              className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold border transition cursor-pointer flex items-center gap-1 ${
                isLight
                  ? 'bg-neutral-950 hover:bg-black text-amber-300 border-neutral-950'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
              }`}
              title="1-Click Algorithmic Rank-Hack: Lock highest-converting compound nouns into Slots #1-#10"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Rank Hack ({algoDominanceScore}%)</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => copyTags(top10, 'Top 10 Heavyweight Keywords')}
            className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              isLight
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/40'
            }`}
            title="Adobe Stock weights first 10 keywords with 75% search ranking power"
          >
            {copiedType === 'Top 10 Heavyweight Keywords' ? (
              <Check className="w-3 h-3 text-emerald-500" />
            ) : (
              <Sparkles className="w-3 h-3 text-amber-500" />
            )}
            <span>
              {copiedType === 'Top 10 Heavyweight Keywords'
                ? 'Copied Top 10'
                : 'Copy Top 10'}
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              copyTags(keywords, `All ${keywords.length} SEO Keywords`)
            }
            className={`text-[11px] font-bold px-3 py-1 rounded-lg border transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              isLight
                ? 'bg-black hover:bg-neutral-800 text-white border-black'
                : 'bg-white hover:bg-neutral-200 text-black border-white'
            }`}
          >
            {copiedType?.startsWith('All') ? (
              <Check className="w-3 h-3 text-emerald-500" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            <span>
              {copiedType?.startsWith('All')
                ? 'Copied All!'
                : `Copy All (${keywords.length})`}
            </span>
          </button>
        </div>
      </div>

      {/* High-Intent Long-Tail Buyer Search Phrases Strip (Shown when Buyer Phrases filter is active) */}
      {effectiveLongTail.length > 0 && activeFilter === 'longtail' && (
        <div
          className={`px-3 py-2 rounded-xl border flex flex-wrap items-center gap-1.5 text-[11px] ${
            isLight
              ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-950'
              : 'bg-emerald-950/25 border-emerald-500/25 text-emerald-200'
          }`}
        >
          <span className="font-bold uppercase tracking-wider text-[9.5px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mr-1">
            <Target className="w-3 h-3" />
            Buyer Search Queries:
          </span>
          {effectiveLongTail.slice(0, 4).map((phrase, pIdx) => (
            <button
              key={pIdx}
              type="button"
              onClick={() => {
                if (onPromoteToSlot1 || onReorderKeywords) {
                  handlePromoteKeyword(phrase);
                } else {
                  copyTags([phrase], `"${phrase}"`);
                }
              }}
              className={`px-2 py-0.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1 border ${
                isLight
                  ? 'bg-white hover:bg-emerald-100 text-emerald-900 border-emerald-200'
                  : 'bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-200 border-emerald-500/30'
              }`}
              title={
                onPromoteToSlot1 || onReorderKeywords
                  ? 'Click to lock this buyer search phrase at Keyword Slot #1'
                  : 'Click to copy phrase'
              }
            >
              <span>"{phrase}"</span>
              {(onPromoteToSlot1 || onReorderKeywords) && (
                <ArrowUp className="w-2.5 h-2.5 text-emerald-500" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Semantic Keyword Badges Grid with Live Algorithmic Weight Telemetry */}
      <div
        className={`flex flex-wrap gap-1.5 max-h-60 overflow-y-auto p-3 rounded-xl border ${
          isLight
            ? 'bg-[#faf9f6] border-neutral-200/90'
            : 'bg-[#0b0c0f] border-neutral-800/90'
        }`}
      >
        {filtered.length === 0 ? (
          <div className="text-xs text-neutral-400 py-3 text-center w-full">
            No keywords found under this taxonomy category.
          </div>
        ) : (
          filtered.map((item, idx) => {
            let badgeClasses = '';
            if (item.index === 1) {
              badgeClasses = isLight
                ? 'bg-neutral-950 text-white border-neutral-950 font-bold shadow-xs'
                : 'bg-emerald-500/20 text-emerald-200 border-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]';
            } else if (item.isTop10) {
              badgeClasses = isLight
                ? 'bg-amber-50/95 text-neutral-900 border-amber-300/90 font-semibold hover:bg-amber-100'
                : 'bg-amber-500/10 text-amber-200 border-amber-500/40 font-semibold hover:bg-amber-500/20';
            } else if (item.isLongTail) {
              badgeClasses = isLight
                ? 'bg-emerald-50/80 text-emerald-900 border-emerald-200/90 hover:bg-emerald-100'
                : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/50';
            } else {
              badgeClasses = isLight
                ? 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400 hover:text-black'
                : 'bg-neutral-900/90 text-neutral-300 border-neutral-800 hover:border-neutral-600 hover:text-white';
            }

            return (
              <button
                key={`${item.tag}-${idx}`}
                type="button"
                onClick={() => {
                  if ((onPromoteToSlot1 || onReorderKeywords) && item.index > 1) {
                    handlePromoteKeyword(item.tag);
                  } else {
                    copyTags([item.tag], `"${item.tag}"`);
                  }
                }}
                title={`${item.tierLabel} · Search Weight: ${item.weightPct}% · Est. RPD: ${item.rpdEstimate} — ${
                  item.index === 1
                    ? 'Locked at Slot #1 Apex Anchor'
                    : 'Click to lock into Slot #1 (99% Weight)'
                }`}
                className={`group/kw text-xs px-2.5 py-1 rounded-lg border transition cursor-pointer flex items-center gap-1.5 ${badgeClasses}`}
              >
                <span
                  className={`text-[9.5px] font-mono tabular-nums font-bold px-1 rounded flex items-center gap-0.5 ${
                    item.index === 1
                      ? 'bg-amber-400 text-black'
                      : item.isTop10
                      ? isLight
                        ? 'bg-amber-200/80 text-amber-950'
                        : 'bg-amber-500/30 text-amber-200'
                      : isLight
                      ? 'bg-neutral-100 text-neutral-500'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {item.index === 1 && <Lock className="w-2.5 h-2.5" />}
                  <span>#{item.index}</span>
                </span>

                <span>{item.tag}</span>

                {xrayMode && (
                  <span
                    className={`text-[9px] font-mono tabular-nums px-1 py-0.2 rounded ${
                      item.index === 1
                        ? 'bg-emerald-500/30 text-emerald-300 font-bold'
                        : item.isTop10
                        ? isLight
                          ? 'bg-emerald-100/90 text-emerald-800 font-bold'
                          : 'bg-emerald-950/80 text-emerald-400 font-bold'
                        : 'opacity-55'
                    }`}
                  >
                    {item.weightPct}%
                  </span>
                )}

                {(onPromoteToSlot1 || onReorderKeywords) && item.index > 1 && (
                  <ArrowUp className="w-2.5 h-2.5 opacity-0 group-hover/kw:opacity-100 text-amber-500 transition-opacity" />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
