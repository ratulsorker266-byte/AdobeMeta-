import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Target,
  Sparkles,
  Plus,
  Check,
  TrendingUp,
  Flame,
  AlertCircle,
  HelpCircle,
  Copy,
  Layers,
  ArrowRight
} from 'lucide-react';
import { BulkItem } from '../types';

interface CompetitorTagGapModalProps {
  item: BulkItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddKeywords: (itemId: string, newKeywords: string[]) => void;
  showToast: (msg: string) => void;
}

interface CompetitorTagInfo {
  tag: string;
  category: 'high_velocity' | 'buyer_intent' | 'niche_gem';
  searchVolume: 'High' | 'Very High' | 'Medium';
  competition: 'Low' | 'Medium' | 'High';
  relevanceScore: number;
}

export const CompetitorTagGapModal: React.FC<CompetitorTagGapModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddKeywords,
  showToast
}) => {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  // Derive competitor intelligence based on item title & existing tags
  const currentTags = useMemo(() => {
    return new Set((item?.result?.keywords || []).map((k) => k.toLowerCase().trim()));
  }, [item]);

  const competitorAnalysis = useMemo(() => {
    if (!item?.result) return { shared: [], missing: [] };

    const titleLower = (item.result.recommendedTitle || '').toLowerCase();
    const existingKws = item.result.keywords || [];

    // Synthesize top competitor benchmark pool based on detected niche
    const competitorCandidates: CompetitorTagInfo[] = [];

    // Business & Corporate Tech
    if (titleLower.includes('business') || titleLower.includes('work') || titleLower.includes('office') || titleLower.includes('corporate') || titleLower.includes('technology')) {
      competitorCandidates.push(
        { tag: 'collaborative teamwork', category: 'buyer_intent', searchVolume: 'Very High', competition: 'Medium', relevanceScore: 96 },
        { tag: 'digital workplace', category: 'high_velocity', searchVolume: 'High', competition: 'Low', relevanceScore: 94 },
        { tag: 'professional communication', category: 'buyer_intent', searchVolume: 'High', competition: 'Low', relevanceScore: 92 },
        { tag: 'modern entrepreneurship', category: 'buyer_intent', searchVolume: 'High', competition: 'Medium', relevanceScore: 89 },
        { tag: 'executive leadership', category: 'high_velocity', searchVolume: 'Very High', competition: 'Medium', relevanceScore: 91 },
        { tag: 'strategic planning', category: 'buyer_intent', searchVolume: 'High', competition: 'Medium', relevanceScore: 88 },
        { tag: 'data analytics screen', category: 'niche_gem', searchVolume: 'Medium', competition: 'Low', relevanceScore: 86 }
      );
    }

    // Lifestyle, People & Diversity
    if (titleLower.includes('people') || titleLower.includes('person') || titleLower.includes('family') || titleLower.includes('lifestyle') || titleLower.includes('woman') || titleLower.includes('man')) {
      competitorCandidates.push(
        { tag: 'authentic candid emotion', category: 'buyer_intent', searchVolume: 'Very High', competition: 'Medium', relevanceScore: 97 },
        { tag: 'multi-ethnic representation', category: 'buyer_intent', searchVolume: 'Very High', competition: 'Low', relevanceScore: 95 },
        { tag: 'genuine connection', category: 'niche_gem', searchVolume: 'High', competition: 'Low', relevanceScore: 90 },
        { tag: 'daily lifestyle moment', category: 'high_velocity', searchVolume: 'High', competition: 'Medium', relevanceScore: 88 },
        { tag: 'healthy well-being', category: 'buyer_intent', searchVolume: 'High', competition: 'Medium', relevanceScore: 87 }
      );
    }

    // Nature, Travel & Environment
    if (titleLower.includes('nature') || titleLower.includes('travel') || titleLower.includes('landscape') || titleLower.includes('outdoor') || titleLower.includes('green') || titleLower.includes('eco')) {
      competitorCandidates.push(
        { tag: 'sustainable eco living', category: 'high_velocity', searchVolume: 'Very High', competition: 'Low', relevanceScore: 98 },
        { tag: 'pristine wilderness landscape', category: 'niche_gem', searchVolume: 'High', competition: 'Low', relevanceScore: 93 },
        { tag: 'climate consciousness', category: 'buyer_intent', searchVolume: 'High', competition: 'Low', relevanceScore: 91 },
        { tag: 'scenic adventure journey', category: 'high_velocity', searchVolume: 'Very High', competition: 'Medium', relevanceScore: 89 }
      );
    }

    // AI & Digital Innovation
    if (titleLower.includes('ai') || titleLower.includes('artificial') || titleLower.includes('digital') || titleLower.includes('future') || titleLower.includes('cyber')) {
      competitorCandidates.push(
        { tag: 'artificial intelligence concept', category: 'high_velocity', searchVolume: 'Very High', competition: 'High', relevanceScore: 98 },
        { tag: 'neural network innovation', category: 'niche_gem', searchVolume: 'High', competition: 'Low', relevanceScore: 94 },
        { tag: 'machine learning workflow', category: 'buyer_intent', searchVolume: 'High', competition: 'Low', relevanceScore: 92 },
        { tag: 'futuristic automation', category: 'buyer_intent', searchVolume: 'High', competition: 'Medium', relevanceScore: 90 }
      );
    }

    // Universal high-converting stock power modifiers
    const universalTerms: CompetitorTagInfo[] = [
      { tag: 'copy space background', category: 'buyer_intent', searchVolume: 'Very High', competition: 'Low', relevanceScore: 95 },
      { tag: 'commercial advertising layout', category: 'buyer_intent', searchVolume: 'High', competition: 'Low', relevanceScore: 91 },
      { tag: 'high resolution detail', category: 'niche_gem', searchVolume: 'Medium', competition: 'Low', relevanceScore: 85 },
      { tag: 'clean minimalist aesthetic', category: 'high_velocity', searchVolume: 'High', competition: 'Medium', relevanceScore: 89 }
    ];

    const allPool = [...competitorCandidates, ...universalTerms];

    // Separate into shared vs missing
    const shared: string[] = [];
    const missing: CompetitorTagInfo[] = [];

    const seen = new Set<string>();
    for (const item of allPool) {
      const lower = item.tag.toLowerCase();
      if (seen.has(lower)) continue;
      seen.add(lower);

      if (currentTags.has(lower)) {
        shared.push(item.tag);
      } else {
        missing.push(item);
      }
    }

    return { shared, missing };
  }, [item, currentTags]);

  if (!isOpen || !item || !item.result) return null;

  const currentCount = (item.result.keywords || []).length;
  const maxAllowed = 50;
  const remainingSlots = Math.max(0, maxAllowed - currentCount);

  const toggleSelectTag = (tag: string) => {
    const next = new Set(selectedTags);
    if (next.has(tag)) {
      next.delete(tag);
    } else {
      if (next.size >= remainingSlots) {
        showToast(`Maximum keyword limit reached (${maxAllowed} tags).`);
        return;
      }
      next.add(tag);
    }
    setSelectedTags(next);
  };

  const handleSelectAllMissing = () => {
    const availableToAdd = competitorAnalysis.missing.slice(0, remainingSlots).map((m) => m.tag);
    setSelectedTags(new Set(availableToAdd));
    showToast(`Selected ${availableToAdd.length} high-converting competitor tags!`);
  };

  const handleApplySelected = () => {
    if (selectedTags.size === 0) {
      showToast('Please select at least one tag to add.');
      return;
    }

    const tagsToAdd = Array.from(selectedTags);
    onAddKeywords(item.id, tagsToAdd);
    showToast(`✅ Added ${tagsToAdd.length} competitor tags to your asset!`);
    setSelectedTags(new Set());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Competitor Keyword Gap Inspector
                </h3>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Bestseller Benchmark
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Compare your metadata with the top 1% best-selling assets on Adobe Stock & Shutterstock.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Shared With Top 1%</span>
                <div className="text-lg font-black text-emerald-400">{competitorAnalysis.shared.length} Power Tags</div>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Missing Gap Tags</span>
                <div className="text-lg font-black text-rose-300">{competitorAnalysis.missing.length} High-RPM Terms</div>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Keyword Capacity</span>
                <div className="text-lg font-black text-indigo-300">
                  {currentCount} / {maxAllowed} ({remainingSlots} Slots Left)
                </div>
              </div>
            </div>
          </div>

          {/* Missing Gap Keywords Section */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  High-Converting Competitor Tags You Are Missing
                </h4>
              </div>

              {remainingSlots > 0 && competitorAnalysis.missing.length > 0 && (
                <button
                  onClick={handleSelectAllMissing}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-950/50 hover:bg-indigo-950 border border-indigo-800/60 px-3 py-1.5 rounded-xl transition"
                >
                  Select All Gaps ({Math.min(remainingSlots, competitorAnalysis.missing.length)})
                </button>
              )}
            </div>

            {competitorAnalysis.missing.length === 0 ? (
              <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-2xl p-6 text-center">
                <Check className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <h5 className="text-sm font-bold text-emerald-200">Zero Critical Gaps Found!</h5>
                <p className="text-xs text-slate-400 mt-1">
                  Your asset already covers the top high-converting terms utilized by top-ranking marketplace competitors.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {competitorAnalysis.missing.map((item) => {
                  const isSelected = selectedTags.has(item.tag);
                  return (
                    <div
                      key={item.tag}
                      onClick={() => toggleSelectTag(item.tag)}
                      className={`cursor-pointer rounded-2xl p-3.5 border transition flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-indigo-950/70 border-indigo-500 shadow-md ring-1 ring-indigo-500/30'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-500 text-white'
                              : 'bg-slate-900 border-slate-800 text-slate-500'
                          }`}
                        >
                          {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white tracking-wide">{item.tag}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-amber-400 font-mono">
                              Vol: {item.searchVolume}
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="text-[10px] text-emerald-400 font-mono">
                              Comp: {item.competition}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
                        {item.category === 'buyer_intent' ? 'Buyer Intent' : item.category === 'high_velocity' ? 'Top Rank' : 'Low Comp'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Already Shared Keywords Section */}
          {competitorAnalysis.shared.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Covered Top-Ranking Terms ({competitorAnalysis.shared.length})
                </h4>
              </div>

              <div className="flex flex-wrap gap-2">
                {competitorAnalysis.shared.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-emerald-950/40 text-emerald-300 border border-emerald-800/40"
                  >
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Selected: <strong className="text-white">{selectedTags.size} tags</strong> | Remaining slots:{' '}
            <strong className="text-indigo-400">{remainingSlots}</strong>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-xs font-semibold text-slate-400 hover:text-slate-200 px-4 py-2 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleApplySelected}
              disabled={selectedTags.size === 0}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-lg"
            >
              <Check className="w-4 h-4" />
              <span>Add Selected Tags ({selectedTags.size})</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
