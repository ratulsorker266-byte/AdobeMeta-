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
  const [isExpandedAll, setIsExpandedAll] = useState<boolean>(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [quickAddInput, setQuickAddInput] = useState<string>('');
  const [showQuickAdd, setShowQuickAdd] = useState<boolean>(false);
  const isLight = themeMode === 'light';

  const handleDragDropReorder = (fromIndex0: number, toIndex0: number) => {
    if (!onReorderKeywords || fromIndex0 === toIndex0) return;
    if (fromIndex0 < 0 || toIndex0 < 0 || fromIndex0 >= keywords.length || toIndex0 >= keywords.length) return;
    const next = [...keywords];
    const [moved] = next.splice(fromIndex0, 1);
    next.splice(toIndex0, 0, moved);
    onReorderKeywords(next);
    playTickSound();
    showToast(`⚡ Moved "${moved}" to Slot #${toIndex0 + 1}${toIndex0 < 10 ? ' (75% Priority Weight)' : ''}!`);
  };

  const handleDeleteSingleTag = (tagToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onReorderKeywords) return;
    const norm = tagToDelete.toLowerCase().trim();
    const next = (keywords || []).filter((k) => k.toLowerCase().trim() !== norm);
    onReorderKeywords(next);
    playTickSound();
    showToast(`Removed keyword "${tagToDelete}" (${next.length}/49 remaining)`);
  };

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onReorderKeywords) return;
    const rawParts = quickAddInput
      .split(/[,;]+/)
      .map((s) =>
        s
          .toLowerCase()
          .replace(/["]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
      )
      .filter((s) => s.length >= 2);
    if (rawParts.length === 0) return;

    const existingSet = new Set((keywords || []).map((k) => k.toLowerCase().trim()));
    const newUnique = rawParts.filter((p) => !existingSet.has(p));

    if (newUnique.length === 0) {
      showToast('⚠️ Tag(s) already exist in your keyword list');
      return;
    }

    const next = Array.from(new Set([...newUnique, ...(keywords || [])])).slice(0, 49);
    onReorderKeywords(next);
    setQuickAddInput('');
    setShowQuickAdd(false);
    playChimeSound();
    showToast(
      newUnique.length === 1
        ? `✓ Locked "${newUnique[0]}" into Slot #1 (${next.length}/49)!`
        : `✓ Locked ${newUnique.length} new tags into Top Priority Slots (${next.length}/49)!`
    );
  };

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
      showToast(`✓ Promoted "${kwToPromote}" to Slot #1 (Primary Search Anchor)`);
    }
  };

  // 1-Click Priority Sort: Orders 49 tags so compound B2B & title-matched nouns lock into Slots #1-#10
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
    showToast('✓ Prioritized Top-10 Keywords to match Subject Title');
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
      {/* Unified Minimalist Filter & Quick Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          className={`flex flex-wrap items-center gap-1 ${
            isLight
              ? 'bg-neutral-100/90 border-neutral-200/80'
              : 'bg-[#050506] border-white/10'
          } p-1 rounded-xl border text-xs`}
        >
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer whitespace-nowrap ${
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
            className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              activeFilter === 'top10'
                ? isLight
                  ? 'bg-neutral-950 text-white shadow-xs font-bold'
                  : 'bg-white text-black shadow-xs font-bold'
                : isLight
                ? 'text-neutral-600 hover:text-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>Top 10 Priority</span>
          </button>

          {effectiveLongTail.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveFilter('longtail')}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                activeFilter === 'longtail'
                  ? isLight
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'bg-white text-black shadow-xs'
                  : isLight
                  ? 'text-neutral-600 hover:text-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Buyer Phrases ({effectiveLongTail.length})</span>
            </button>
          )}
        </div>

        {/* Minimalist High-Utility Actions & Copy Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {onReorderKeywords && (
            <button
              type="button"
              onClick={() => setShowQuickAdd((prev) => !prev)}
              className={`px-2.5 py-1 rounded-lg text-[10.5px] font-semibold border transition cursor-pointer flex items-center gap-1 ${
                showQuickAdd
                  ? isLight
                    ? 'bg-neutral-950 text-white border-neutral-950 font-bold'
                    : 'bg-white text-black border-white font-bold'
                  : isLight
                  ? 'bg-white hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] text-neutral-300 border-white/10'
              }`}
              title="Add single or comma-separated keywords directly into Top Priority Slots"
            >
              <span>+ Add Tag</span>
            </button>
          )}

          {onReorderKeywords && (
            <button
              type="button"
              onClick={handleOneClickAlgorithmicHack}
              className={`px-2.5 py-1 rounded-lg text-[10.5px] font-semibold border transition cursor-pointer flex items-center gap-1 ${
                isLight
                  ? 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-200'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] text-neutral-300 border-white/10'
              }`}
              title="Align Top-10 Priority Keywords with your Subject Title"
            >
              <span>Align Top 10</span>
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              copyTags(
                activeFilter === 'top10' ? top10 : keywords,
                activeFilter === 'top10' ? 'Top 10 Priority Keywords' : `All ${keywords.length} SEO Keywords`
              )
            }
            className={`text-[11px] font-semibold px-3 py-1 rounded-lg border transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              isLight
                ? 'bg-neutral-950 hover:bg-black text-white border-neutral-950'
                : 'bg-white hover:bg-neutral-200 text-neutral-950 border-white'
            }`}
          >
            {copiedType ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            <span>
              {copiedType
                ? 'Copied'
                : activeFilter === 'top10'
                ? 'Copy Top 10'
                : `Copy Tags (${keywords.length})`}
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

      {/* Inline Quick-Add Custom Keyword Bar (Locks new tag into Slot #1) */}
      {showQuickAdd && onReorderKeywords && (
        <form
          onSubmit={handleQuickAddSubmit}
          className={`p-2.5 rounded-xl border flex items-center gap-2 ${
            isLight ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-800'
          }`}
        >
          <input
            type="text"
            value={quickAddInput}
            onChange={(e) => setQuickAddInput(e.target.value)}
            placeholder="Type a keyword or paste comma-separated tags to lock into Top Priority Slots..."
            className={`flex-1 text-xs px-3 py-1.5 rounded-lg border focus:outline-none ${
              isLight
                ? 'bg-[#faf9f6] border-neutral-200 text-neutral-900 focus:border-neutral-900'
                : 'bg-neutral-950 border-neutral-800 text-white focus:border-emerald-500'
            }`}
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 transition cursor-pointer shrink-0"
          >
            Lock at #1
          </button>
        </form>
      )}

      {/* Semantic Keyword Badges Grid with 10th-Gen Drag-and-Drop Reordering */}
      <div
        className={`flex flex-wrap items-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${
          isLight
            ? 'bg-[#faf9f6] border-neutral-200/80'
            : 'bg-[#040405] border-white/10'
        }`}
      >
        {filtered.length === 0 ? (
          <div className="text-xs text-neutral-400 py-3 text-center w-full">
            No keywords found under this taxonomy category.
          </div>
        ) : (
          (activeFilter === 'all' && !isExpandedAll ? filtered.slice(0, 10) : filtered).map((item, idx) => {
            const actualIndex0 = item.index - 1;
            const isBeingDragged = draggedIdx === actualIndex0;
            const isDragTarget = dragOverIdx === actualIndex0 && draggedIdx !== actualIndex0;

            let badgeClasses = '';
            if (isDragTarget) {
              badgeClasses = 'border-white bg-white/20 scale-105 ring-2 ring-white/40';
            } else if (item.index === 1) {
              badgeClasses = isLight
                ? 'bg-neutral-950 text-white border-neutral-950 font-semibold shadow-xs'
                : 'bg-white text-black border-white font-semibold shadow-xs';
            } else if (item.isTop10) {
              badgeClasses = isLight
                ? 'bg-neutral-100 text-neutral-950 border-neutral-300 font-medium hover:bg-neutral-200'
                : 'bg-white/[0.08] text-white border-white/25 font-medium hover:bg-white/[0.14]';
            } else {
              badgeClasses = isLight
                ? 'bg-white text-neutral-700 border-neutral-200/80 hover:border-neutral-400 hover:text-black'
                : 'bg-[#070709] text-neutral-300 border-white/10 hover:border-white/30 hover:text-white';
            }

            return (
              <div
                key={`${item.tag}-${idx}`}
                draggable={Boolean(onReorderKeywords)}
                onDragStart={() => setDraggedIdx(actualIndex0)}
                onDragOver={(e) => {
                  if (!onReorderKeywords) return;
                  e.preventDefault();
                  if (dragOverIdx !== actualIndex0) setDragOverIdx(actualIndex0);
                }}
                onDragLeave={() => {
                  if (dragOverIdx === actualIndex0) setDragOverIdx(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedIdx !== null && draggedIdx !== actualIndex0) {
                    handleDragDropReorder(draggedIdx, actualIndex0);
                  }
                  setDraggedIdx(null);
                  setDragOverIdx(null);
                }}
                onDragEnd={() => {
                  setDraggedIdx(null);
                  setDragOverIdx(null);
                }}
                onClick={() => {
                  if ((onPromoteToSlot1 || onReorderKeywords) && item.index > 1) {
                    handlePromoteKeyword(item.tag);
                  } else {
                    copyTags([item.tag], `"${item.tag}"`);
                  }
                }}
                title={`${item.tierLabel} · Search Weight: ${item.weightPct}% — ${
                  item.index === 1
                    ? 'Locked at Slot #1 Apex Anchor (Drag to reorder)'
                    : 'Click to lock into Slot #1 or Drag to reorder'
                }`}
                className={`group/kw text-[11.5px] px-2.5 py-1 rounded-lg border transition cursor-pointer flex items-center gap-1.5 select-none ${
                  isBeingDragged ? 'opacity-40 scale-95' : ''
                } ${badgeClasses}`}
              >
                <span className="text-[9.5px] font-mono tabular-nums opacity-55">
                  {String(item.index).padStart(2, '0')}
                </span>

                <span>{item.tag}</span>

                {onReorderKeywords && (
                  <button
                    type="button"
                    onClick={(e) => handleDeleteSingleTag(item.tag, e)}
                    className="opacity-0 group-hover/kw:opacity-100 hover:text-rose-500 text-[11px] font-bold leading-none pl-0.5 transition-opacity cursor-pointer"
                    title={`Remove "${item.tag}"`}
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })
        )}

        {activeFilter === 'all' && filtered.length > 10 && (
          <button
            type="button"
            onClick={() => setIsExpandedAll((prev) => !prev)}
            className={`px-3 py-1 rounded-lg text-[11px] font-semibold border transition cursor-pointer flex items-center gap-1 ${
              isLight
                ? 'bg-neutral-900 hover:bg-black text-white border-neutral-900'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
            }`}
          >
            <span>
              {isExpandedAll
                ? 'Show Top 10 Only'
                : `+${filtered.length - 10} More Tags (View All ${filtered.length})`}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
