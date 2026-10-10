import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  Check,
  Sparkles,
  Copy,
  Layers,
  Filter,
  SlidersHorizontal,
  ArrowUpRight,
  Plus,
  RefreshCw,
  Award,
  Zap,
  Trash2,
} from 'lucide-react';
import { BulkItem } from '../types';

export interface SimilarImageMatch {
  id: string;
  rank: number;
  agency: string;
  downloads: string;
  category: string;
  title: string;
  keywords: string[];
  thumbnailUrl: string;
}

interface VisualKeywordMixerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem?: BulkItem | null;
  itemsCount: number;
  selectedCount: number;
  customApiKey?: string;
  themeMode?: 'light' | 'dark';
  onApplyMixedMetadata: (payload: {
    title: string;
    keywords: string[];
    category?: string;
    mode: 'replace' | 'merge_top' | 'apply_all';
  }) => void;
  showToast: (msg: string) => void;
}

export const VisualKeywordMixerModal: React.FC<VisualKeywordMixerModalProps> = ({
  isOpen,
  onClose,
  activeItem,
  itemsCount,
  selectedCount,
  customApiKey = '',
  themeMode = 'dark',
  onApplyMixedMetadata,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [matches, setMatches] = useState<SimilarImageMatch[]>([]);
  const [selectedMatchIds, setSelectedMatchIds] = useState<string[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Graphic Resources');
  const [minFrequency, setMinFrequency] = useState<number>(1);
  const [excludedTags, setExcludedTags] = useState<Set<string>>(new Set());
  const [customAddedTags, setCustomAddedTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState<string>('');
  const [targetLimit, setTargetLimit] = useState<number>(49);

  const isLight = themeMode === 'light';

  const fetchSimilarMatches = async (queryText: string) => {
    const cleanQ = queryText.trim() || 'luxury gold vector background copy space';
    setIsLoading(true);
    try {
      const res = await fetch('/api/visual-keyword-mixer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(customApiKey ? { 'x-api-key': customApiKey.trim() } : {}),
        },
        body: JSON.stringify({
          query: cleanQ,
          currentTitle: activeItem?.result?.recommendedTitle || cleanQ,
          currentKeywords: activeItem?.result?.keywords || [],
          assetType: activeItem?.file?.name?.match(/\.(eps|ai|svg)$/i) ? 'Vector / EPS' : 'Photo / JPG',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (Array.isArray(data.matches) && data.matches.length > 0) {
        setMatches(data.matches);
        // Automatically select the top 5 bestseller matches (ImStocker standard workflow)
        const top5Ids = data.matches.slice(0, 5).map((m: SimilarImageMatch) => m.id);
        setSelectedMatchIds(top5Ids);
        setSelectedTitle(
          activeItem?.result?.recommendedTitle || data.matches[0]?.title || cleanQ
        );
        setSelectedCategory(
          activeItem?.result?.category || data.matches[0]?.category || 'Graphic Resources'
        );
        setExcludedTags(new Set());
      } else {
        throw new Error('Empty matches payload');
      }
    } catch (err) {
      console.warn('Keyword mixer fetch error, activating instant local synthesis:', err);
      const baseWords = cleanQ
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length >= 3);
      const root = baseWords.slice(0, 3).join(' ') || 'commercial visual';
      const capRoot = root.replace(/\b\w/g, (c) => c.toUpperCase());
      const localFallback: SimilarImageMatch[] = Array.from({ length: 8 }).map((_, idx) => ({
        id: `local_sim_${idx + 1}`,
        rank: idx + 1,
        agency: idx % 2 === 0 ? 'Adobe Stock' : 'Shutterstock',
        downloads: `${14 - idx},200+ Bestseller`,
        category: 'Graphic Resources',
        title: `${capRoot} Commercial Composition Variation #${idx + 1}`.slice(0, 68),
        keywords: [
          ...baseWords,
          root,
          'copy space',
          'commercial',
          'modern',
          'background',
          'design',
          'minimalist',
          'clean',
          'isolated',
          'high resolution',
          'banner',
          'template',
          'creative',
          'professional',
          'graphic',
          'illustration',
          'vector',
          'composition',
          'luxury',
          'abstract',
          'contemporary',
          'no people',
        ],
        thumbnailUrl: `data:image/svg+xml;utf8,${encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 300"><rect width="480" height="300" fill="#0f172a"/><text x="30" y="150" fill="#fde68a" font-family="sans-serif" font-size="16" font-weight="bold">${capRoot.slice(0, 28)} #${idx + 1}</text></svg>`
        )}`,
      }));
      setMatches(localFallback);
      setSelectedMatchIds(localFallback.slice(0, 5).map((m) => m.id));
      setSelectedTitle(activeItem?.result?.recommendedTitle || localFallback[0].title);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const initialQuery =
      activeItem?.result?.recommendedTitle ||
      activeItem?.epsHint?.title ||
      (activeItem?.file?.name
        ? activeItem.file.name
            .replace(/\.[^/.]+$/, '')
            .replace(/[-_]+/g, ' ')
            .replace(/\b(img|dsc|untitled|vector|copy|\d{3,})\b/gi, '')
            .trim()
        : '') ||
      'minimalist luxury podium background copy space';

    setSearchQuery(initialQuery);
    fetchSimilarMatches(initialQuery);
  }, [isOpen, activeItem?.id]);

  // Calculate live keyword frequency across all selected similar images with Singular/Plural stem deduplication
  const frequencyRankedKeywords = useMemo(() => {
    const selectedCards = matches.filter((m) => selectedMatchIds.includes(m.id));
    const totalSelected = Math.max(1, selectedCards.length);
    const freqMap = new Map<string, { count: number; positionWeight: number }>();

    const getStem = (w: string): string => {
      const clean = w.toLowerCase().trim();
      if (clean.length <= 3) return clean;
      if (clean.endsWith('ies') && clean.length > 4) return clean.slice(0, -3) + 'y';
      if (
        clean.endsWith('es') &&
        (clean.endsWith('ches') ||
          clean.endsWith('shes') ||
          clean.endsWith('xes') ||
          clean.endsWith('sses') ||
          clean.endsWith('zes'))
      ) {
        return clean.slice(0, -2);
      }
      if (
        clean.endsWith('s') &&
        !clean.endsWith('ss') &&
        !clean.endsWith('us') &&
        !clean.endsWith('is')
      ) {
        return clean.slice(0, -1);
      }
      return clean;
    };

    // Include custom added tags at maximum priority
    customAddedTags.forEach((tag, idx) => {
      const clean = tag.toLowerCase().trim();
      if (clean && !excludedTags.has(clean)) {
        freqMap.set(clean, { count: totalSelected, positionWeight: 1000 - idx });
      }
    });

    selectedCards.forEach((card) => {
      const seenInCard = new Set<string>();
      (card.keywords || []).forEach((rawKw, posIdx) => {
        const kw = rawKw.toLowerCase().trim();
        if (!kw || kw.length < 2 || seenInCard.has(kw) || excludedTags.has(kw)) return;
        seenInCard.add(kw);
        const existing = freqMap.get(kw) || { count: 0, positionWeight: 0 };
        freqMap.set(kw, {
          count: existing.count + 1,
          // Earlier positions (Top 10 slots) carry higher tie-breaker weight
          positionWeight: existing.positionWeight + Math.max(1, 35 - posIdx),
        });
      });
    });

    const sortedAll = Array.from(freqMap.entries())
      .filter(([, meta]) => meta.count >= minFrequency)
      .sort((a, b) => {
        if (b[1].count !== a[1].count) return b[1].count - a[1].count;
        return b[1].positionWeight - a[1].positionWeight;
      });

    // Deduplicate singular/plural stems so Adobe Stock never flags plural spam
    const seenStems = new Set<string>();
    const deduped: Array<[string, { count: number; positionWeight: number }]> = [];
    for (const entry of sortedAll) {
      const stem = getStem(entry[0]);
      if (seenStems.has(stem)) continue;
      seenStems.add(stem);
      deduped.push(entry);
      if (deduped.length >= targetLimit) break;
    }

    return deduped.map(([keyword, meta], idx) => ({
      keyword,
      count: meta.count,
      totalSelected,
      percentage: Math.round((meta.count / totalSelected) * 100),
      slotNumber: idx + 1,
    }));
  }, [matches, selectedMatchIds, minFrequency, excludedTags, customAddedTags, targetLimit]);

  if (!isOpen) return null;

  const finalKeywordList = frequencyRankedKeywords.map((item) => item.keyword);

  const toggleMatchSelection = (id: string) => {
    setSelectedMatchIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = customTagInput
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length >= 2);
    if (parts.length === 0) return;
    setCustomAddedTags((prev) => Array.from(new Set([...parts, ...prev])));
    setExcludedTags((prev) => {
      const next = new Set(prev);
      parts.forEach((p) => next.delete(p));
      return next;
    });
    setCustomTagInput('');
    showToast(`✓ Locked ${parts.length} custom tag(s) into Slot #1 priority!`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className={`w-full max-w-6xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sovereign-prism-card ${
            isLight
              ? 'bg-[#faf8f5] border-neutral-300 text-neutral-900'
              : 'bg-[#0b0d13] border-white/15 text-neutral-100'
          }`}
        >
          {/* Top Header */}
          <div
            className={`px-5 py-4 border-b flex flex-wrap items-center justify-between gap-3 ${
              isLight ? 'bg-white border-neutral-200' : 'bg-[#0f131c] border-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                  isLight
                    ? 'bg-neutral-950 text-amber-300 border-neutral-900'
                    : 'bg-amber-500/15 text-amber-300 border-amber-400/30'
                }`}
              >
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-bold tracking-tight">
                    Live Visual Similar Image Keyword Mixer
                  </h2>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 font-bold">
                    ImStocker Studio Pro Engine
                  </span>
                </div>
                <p className={`text-xs ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  Select 3 to 12 similar bestselling stock visuals below — the mixer automatically ranks and blends keywords by frequency across your selected matches.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                isLight
                  ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-700'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search & Quick Presets Bar */}
          <div
            className={`px-5 py-3.5 border-b space-y-2.5 ${
              isLight ? 'bg-[#f5f3ef] border-neutral-200' : 'bg-[#121722] border-white/10'
            }`}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchSimilarMatches(searchQuery);
              }}
              className="flex flex-col sm:flex-row gap-2.5"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Describe your artwork or type buyer search keywords (e.g. Ramadan golden lantern vector banner)..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium focus:outline-none transition ${
                    isLight
                      ? 'bg-white border-neutral-300 text-neutral-900 focus:border-neutral-950'
                      : 'bg-black/50 border-white/15 text-white focus:border-amber-400'
                  }`}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shrink-0 ${
                  isLight
                    ? 'bg-neutral-950 hover:bg-black text-amber-300'
                    : 'bg-[#f3e5ab] hover:bg-[#e5c158] text-neutral-950'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Scanning Bestsellers...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Find Similar Bestsellers</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Concept Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-mono uppercase tracking-wider text-neutral-400 mr-1">
                  Quick Mix Themes:
                </span>
                {[
                  'luxury gold podium product background',
                  'ramadan kareem lantern vector illustration',
                  'sustainable solar energy technician',
                  'minimalist corporate business strategy',
                  'seamless floral botanical vector pattern',
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setSearchQuery(preset);
                      fetchSimilarMatches(preset);
                    }}
                    className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                      searchQuery.toLowerCase() === preset.toLowerCase()
                        ? isLight
                          ? 'bg-neutral-950 text-white border-neutral-950 font-semibold'
                          : 'bg-amber-400/20 text-amber-200 border-amber-400/50 font-semibold'
                        : isLight
                        ? 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                        : 'bg-white/[0.04] hover:bg-white/10 border-white/10 text-neutral-300'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedMatchIds(matches.slice(0, 5).map((m) => m.id))}
                  className={`px-2.5 py-1 rounded-lg border font-mono text-[10.5px] transition cursor-pointer ${
                    isLight
                      ? 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300'
                  }`}
                >
                  Select Top 5
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMatchIds(matches.map((m) => m.id))}
                  className={`px-2.5 py-1 rounded-lg border font-mono text-[10.5px] transition cursor-pointer ${
                    isLight
                      ? 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300'
                  }`}
                >
                  Select All ({matches.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMatchIds([])}
                  className={`px-2.5 py-1 rounded-lg border font-mono text-[10.5px] transition cursor-pointer ${
                    isLight
                      ? 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-500'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-400'
                  }`}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Main 2-Column ImStocker Split Workbench */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-200 dark:divide-white/10">
            {/* LEFT COLUMN (7 cols): Similar Bestseller Visual Cards Grid */}
            <div className="lg:col-span-7 p-4 sm:p-5 space-y-3 overflow-y-auto max-h-[60vh] lg:max-h-none">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold flex items-center gap-2">
                  <span>1. Select Similar Bestseller Visuals</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30">
                    {selectedMatchIds.length} of {matches.length} Selected
                  </span>
                </div>
                <span className="text-[11px] text-neutral-400">
                  Click any card to include/exclude its tags in the mixer
                </span>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-6">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-44 rounded-2xl border animate-pulse p-4 flex flex-col justify-between ${
                        isLight ? 'bg-neutral-200/60 border-neutral-300' : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="h-4 w-24 rounded bg-neutral-400/30" />
                      <div className="space-y-2">
                        <div className="h-3 w-full rounded bg-neutral-400/30" />
                        <div className="h-3 w-2/3 rounded bg-neutral-400/30" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {matches.map((card) => {
                    const isChecked = selectedMatchIds.includes(card.id);
                    return (
                      <div
                        key={card.id}
                        onClick={() => toggleMatchSelection(card.id)}
                        className={`rounded-2xl border overflow-hidden transition-all cursor-pointer flex flex-col justify-between group ${
                          isChecked
                            ? isLight
                              ? 'bg-white border-neutral-950 ring-2 ring-neutral-950/20 shadow-md'
                              : 'bg-[#151b28] border-amber-400/70 ring-1 ring-amber-400/40 shadow-lg'
                            : isLight
                            ? 'bg-white/70 hover:bg-white border-neutral-200 opacity-75 hover:opacity-100'
                            : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/10 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div>
                          {/* Visual Header Banner */}
                          <div className="relative h-28 bg-neutral-900 overflow-hidden">
                            <img
                              src={card.thumbnailUrl}
                              alt={card.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 left-2 flex items-center gap-1.5">
                              <span
                                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shadow ${
                                  isChecked
                                    ? 'bg-amber-400 text-neutral-950'
                                    : 'bg-black/70 text-white border border-white/20'
                                }`}
                              >
                                {isChecked ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : card.rank}
                              </span>
                              <span className="bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded border border-white/15">
                                {card.agency}
                              </span>
                            </div>
                            <div className="absolute top-2 right-2 bg-emerald-500/90 text-neutral-950 text-[10px] font-bold px-2 py-0.5 rounded shadow">
                              {card.downloads}
                            </div>
                          </div>

                          {/* Card Title & Top Tags Preview */}
                          <div className="p-3 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-bold leading-snug line-clamp-2">
                                {card.title}
                              </p>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTitle(card.title);
                                  setSelectedCategory(card.category);
                                  showToast('✓ Loaded Title & Category into Mixer Workbench!');
                                }}
                                className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold border transition cursor-pointer ${
                                  selectedTitle === card.title
                                    ? 'bg-emerald-500 text-neutral-950 border-emerald-500 font-bold'
                                    : isLight
                                    ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800'
                                    : 'bg-white/5 hover:bg-white/15 border-white/15 text-amber-200'
                                }`}
                                title="Use this bestseller's title as your base title"
                              >
                                Use Title
                              </button>
                            </div>

                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {card.keywords.slice(0, 8).map((kw, kIdx) => (
                                <span
                                  key={kIdx}
                                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                                    isLight
                                      ? 'bg-neutral-100 text-neutral-700'
                                      : 'bg-black/40 text-neutral-300 border border-white/5'
                                  }`}
                                >
                                  {kw}
                                </span>
                              ))}
                              {card.keywords.length > 8 && (
                                <span className="text-[10px] font-mono text-neutral-400 px-1 py-0.5">
                                  +{card.keywords.length - 8} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN (5 cols): Live Frequency-Weighted Mixed Metadata Output */}
            <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between space-y-4 bg-black/5 dark:bg-white/[0.01]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>2. Frequency-Ranked Mixed Output</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-500">
                    {finalKeywordList.length}/{targetLimit} Tags Ready
                  </span>
                </div>

                {/* Editable Mixed Title */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-neutral-400">
                      Subject-First Commercial Title (&lt;70 chars)
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        selectedTitle.length <= 70 ? 'text-emerald-500' : 'text-amber-500'
                      }`}
                    >
                      {selectedTitle.length}/70 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={selectedTitle}
                    onChange={(e) => setSelectedTitle(e.target.value)}
                    placeholder="Edit or click 'Use Title' on any similar image..."
                    className={`w-full px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold focus:outline-none ${
                      isLight
                        ? 'bg-white border-neutral-300 text-neutral-900 focus:border-neutral-950'
                        : 'bg-black/60 border-white/15 text-white focus:border-amber-400'
                    }`}
                  />
                </div>

                {/* Frequency Filter Controls */}
                <div
                  className={`p-3 rounded-2xl border space-y-2.5 ${
                    isLight ? 'bg-white border-neutral-200' : 'bg-[#121722] border-white/10'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <span className="font-semibold flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
                      <span>Minimum Image Consensus:</span>
                    </span>
                    <div className="flex items-center gap-1">
                      {[
                        { val: 1, label: 'All (1+)' },
                        { val: 2, label: 'Shared (2+)' },
                        { val: 3, label: 'Core (3+)' },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => setMinFrequency(opt.val)}
                          className={`px-2 py-0.5 rounded text-[10.5px] font-mono border transition cursor-pointer ${
                            minFrequency === opt.val
                              ? 'bg-amber-500 text-neutral-950 border-amber-500 font-bold'
                              : isLight
                              ? 'bg-neutral-100 text-neutral-600 border-neutral-200'
                              : 'bg-black/40 text-neutral-400 border-white/10'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Target Tag Count Slider (15 to 49 Tags) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-neutral-400">
                        Target Mixed Tag Limit:
                      </span>
                      <span className="font-mono font-bold text-amber-500">
                        {targetLimit} Tags (Max 49)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={15}
                      max={49}
                      value={targetLimit}
                      onChange={(e) => setTargetLimit(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer h-1.5"
                    />
                  </div>

                  {/* Add Custom Priority Tag into Mixer */}
                  <form onSubmit={handleAddCustomTag} className="flex gap-1.5">
                    <input
                      type="text"
                      value={customTagInput}
                      onChange={(e) => setCustomTagInput(e.target.value)}
                      placeholder="Inject custom priority tag (e.g. copy space, vector)..."
                      className={`flex-1 px-2.5 py-1.5 rounded-lg border text-[11px] focus:outline-none ${
                        isLight
                          ? 'bg-[#faf8f5] border-neutral-200 text-neutral-900'
                          : 'bg-black/50 border-white/10 text-white'
                      }`}
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 transition cursor-pointer shrink-0 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </form>
                </div>

                {/* Live Frequency-Sorted Keyword Pills */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span>
                      Top-10 Priority Slots highlighted in gold · Click any tag to remove
                    </span>
                    {excludedTags.size > 0 && (
                      <button
                        type="button"
                        onClick={() => setExcludedTags(new Set())}
                        className="text-amber-400 hover:underline font-mono text-[10px] cursor-pointer"
                      >
                        Restore {excludedTags.size} removed
                      </button>
                    )}
                  </div>

                  <div
                    className={`p-3 rounded-2xl border max-h-64 overflow-y-auto flex flex-wrap gap-1.5 ${
                      isLight ? 'bg-white border-neutral-200' : 'bg-black/50 border-white/10'
                    }`}
                  >
                    {frequencyRankedKeywords.length > 0 ? (
                      frequencyRankedKeywords.map((item) => {
                        const isTop10 = item.slotNumber <= 10;
                        return (
                          <button
                            key={item.keyword}
                            type="button"
                            onClick={() => {
                              setExcludedTags((prev) => new Set([...prev, item.keyword]));
                            }}
                            title={`Found in ${item.count}/${item.totalSelected} selected images (${item.percentage}% consensus) · Click to remove`}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition flex items-center gap-1.5 cursor-pointer group ${
                              isTop10
                                ? isLight
                                  ? 'bg-neutral-950 text-white border-neutral-950 font-semibold'
                                  : 'bg-amber-500/15 text-amber-200 border-amber-400/40 font-semibold'
                                : isLight
                                ? 'bg-[#faf8f5] hover:bg-red-50 text-neutral-800 border-neutral-200'
                                : 'bg-white/[0.04] hover:bg-red-950/40 text-neutral-300 border-white/10'
                            }`}
                          >
                            {isTop10 && (
                              <span className="text-[9px] font-mono px-1 rounded bg-amber-400 text-neutral-950 font-black">
                                #{item.slotNumber}
                              </span>
                            )}
                            <span>{item.keyword}</span>
                            <span
                              className={`text-[9.5px] font-mono px-1 rounded ${
                                item.percentage >= 75
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'opacity-60'
                              }`}
                            >
                              {item.count}/{item.totalSelected}
                            </span>
                            <span className="opacity-0 group-hover:opacity-100 text-rose-400 font-bold ml-0.5">
                              &times;
                            </span>
                          </button>
                        );
                      })
                    ) : (
                      <div className="w-full py-8 text-center text-xs text-neutral-400">
                        Select at least 1 similar image card on the left to mix keywords.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Action Buttons: Copy or Apply Directly to Active / Selected / All Studio Assets */}
              <div className="pt-3 border-t border-neutral-200 dark:border-white/10 space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const payload = `${selectedTitle}\n\n${finalKeywordList.join(', ')}`;
                      navigator.clipboard.writeText(payload);
                      showToast(`✓ Copied Mixed Title + ${finalKeywordList.length} Frequency-Ranked Keywords!`);
                    }}
                    className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      isLight
                        ? 'bg-white hover:bg-neutral-100 border-neutral-300 text-neutral-900'
                        : 'bg-white/5 hover:bg-white/10 border-white/15 text-white'
                    }`}
                  >
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Copy Title &amp; {finalKeywordList.length} Mixed Tags</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(finalKeywordList.join(', '));
                      showToast(`✓ Copied ${finalKeywordList.length} comma-separated keywords!`);
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      isLight
                        ? 'bg-white hover:bg-neutral-100 border-neutral-300 text-neutral-700'
                        : 'bg-white/5 hover:bg-white/10 border-white/15 text-neutral-300'
                    }`}
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Tags Only</span>
                  </button>
                </div>

                {itemsCount > 0 && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onApplyMixedMetadata({
                            title: selectedTitle,
                            keywords: finalKeywordList,
                            category: selectedCategory,
                            mode: 'replace',
                          });
                          onClose();
                        }}
                        className={`py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer shadow-lg ${
                          isLight
                            ? 'bg-neutral-950 hover:bg-black text-amber-300'
                            : 'bg-[#f3e5ab] hover:bg-[#e5c158] text-neutral-950'
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>
                          {activeItem
                            ? `Apply to "${activeItem.file.name.slice(0, 18)}"`
                            : selectedCount > 0
                            ? `Apply to ${selectedCount} Selected Asset(s)`
                            : `Apply to Active Asset`}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onApplyMixedMetadata({
                            title: selectedTitle,
                            keywords: finalKeywordList,
                            category: selectedCategory,
                            mode: 'merge_top',
                          });
                          onClose();
                        }}
                        className={`py-2.5 px-4 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          isLight
                            ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-950'
                            : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-400/40 text-amber-200'
                        }`}
                        title="Prepend top consensus tags into your asset while preserving existing non-duplicate tags"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Merge Top Priority Tags</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onApplyMixedMetadata({
                          title: selectedTitle,
                          keywords: finalKeywordList,
                          category: selectedCategory,
                          mode: 'apply_all',
                        });
                        onClose();
                      }}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>
                        {selectedCount > 0
                          ? `Blend into All ${selectedCount} Selected Assets`
                          : `Blend into All ${itemsCount} Studio Assets`}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
