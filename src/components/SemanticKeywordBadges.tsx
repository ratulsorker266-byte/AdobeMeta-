import React, { useState, useMemo } from 'react';
import { Copy, Check, Filter, Sparkles, Layers } from 'lucide-react';

interface SemanticKeywordBadgesProps {
  keywords: string[];
  showToast: (msg: string) => void;
}

type TagCategory = 'all' | 'subject' | 'mood' | 'concept' | 'technical';

export const SemanticKeywordBadges: React.FC<SemanticKeywordBadgesProps> = ({ keywords, showToast }) => {
  const [activeFilter, setActiveFilter] = useState<TagCategory>('all');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Categorize keywords heuristically based on stock taxonomy
  const categorized = useMemo(() => {
    const moodWords = new Set(['happy', 'joy', 'smile', 'warm', 'cozy', 'dramatic', 'bright', 'sunset', 'sunrise', 'golden', 'peaceful', 'calm', 'vibrant', 'dark', 'cinematic', 'lifestyle', 'friendly', 'serene', 'energetic', 'cheerful', 'moody', 'light']);
    const conceptWords = new Set(['business', 'innovation', 'success', 'growth', 'finance', 'technology', 'future', 'freedom', 'health', 'wellness', 'connection', 'development', 'leadership', 'strategy', 'sustainability', 'teamwork', 'security', 'digital', 'smart', 'eco', 'investment', 'work', 'corporate', 'education']);
    const technicalWords = new Set(['copy space', 'copyspace', 'isolated', 'white background', 'close up', 'closeup', 'macro', 'aerial', 'overhead', 'top view', 'flat lay', 'flatlay', 'horizontal', 'vertical', 'wide angle', 'panoramic', 'bokeh', 'shallow depth', 'focus', 'minimal', 'minimalist', 'clean background', 'cut out', 'studio shot']);

    return (keywords || []).map((tag, idx) => {
      const lower = tag.toLowerCase().trim();
      let category: 'subject' | 'mood' | 'concept' | 'technical' = 'subject';

      if (technicalWords.has(lower) || lower.includes('space') || lower.includes('view') || lower.includes('background') || lower.includes('angle') || lower.includes('shot')) {
        category = 'technical';
      } else if (conceptWords.has(lower) || lower.includes('tech') || lower.includes('future') || lower.includes('lead') || lower.includes('market')) {
        category = 'concept';
      } else if (moodWords.has(lower) || lower.includes('light') || lower.includes('sun') || lower.includes('warm') || lower.includes('happy')) {
        category = 'mood';
      }

      return { tag, category, isTop10: idx < 10 };
    });
  }, [keywords]);

  const filtered = categorized.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  const copyTags = (tagList: string[], type: string) => {
    navigator.clipboard.writeText(tagList.join(', '));
    setCopiedType(type);
    showToast(`Copied ${type} to clipboard!`);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const top10 = (keywords || []).slice(0, 10);

  const getBadgeStyle = (category: string, isTop10: boolean) => {
    if (isTop10) {
      return 'bg-indigo-950/70 text-indigo-200 border-indigo-500/40 ring-1 ring-indigo-500/20 font-semibold';
    }
    switch (category) {
      case 'concept':
        return 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40 hover:border-emerald-600';
      case 'mood':
        return 'bg-purple-950/40 text-purple-300 border-purple-800/40 hover:border-purple-600';
      case 'technical':
        return 'bg-amber-950/40 text-amber-300 border-amber-800/40 hover:border-amber-600';
      default:
        return 'bg-blue-950/40 text-blue-300 border-blue-800/40 hover:border-blue-600';
    }
  };

  return (
    <div className="space-y-3 pt-2">
      {/* Category filter pills & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded-lg transition font-medium text-[11px] ${
              activeFilter === 'all'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({keywords.length})
          </button>
          <button
            onClick={() => setActiveFilter('subject')}
            className={`px-2 py-1 rounded-lg transition font-medium text-[11px] flex items-center gap-1 ${
              activeFilter === 'subject'
                ? 'bg-blue-600 text-white shadow'
                : 'text-blue-400 hover:text-blue-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Subject
          </button>
          <button
            onClick={() => setActiveFilter('concept')}
            className={`px-2 py-1 rounded-lg transition font-medium text-[11px] flex items-center gap-1 ${
              activeFilter === 'concept'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Concept
          </button>
          <button
            onClick={() => setActiveFilter('mood')}
            className={`px-2 py-1 rounded-lg transition font-medium text-[11px] flex items-center gap-1 ${
              activeFilter === 'mood'
                ? 'bg-purple-600 text-white shadow'
                : 'text-purple-400 hover:text-purple-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            Mood
          </button>
          <button
            onClick={() => setActiveFilter('technical')}
            className={`px-2 py-1 rounded-lg transition font-medium text-[11px] flex items-center gap-1 ${
              activeFilter === 'technical'
                ? 'bg-amber-600 text-white shadow'
                : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Composition
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => copyTags(top10, 'Top 10 High-Ranking Tags')}
            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-950 border border-indigo-500/40 hover:bg-indigo-900/60 text-indigo-300 flex items-center gap-1 transition shadow-sm"
            title="Adobe Stock weights the first 10 keywords heaviest in search algorithm"
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>{copiedType === 'Top 10 High-Ranking Tags' ? 'Copied Top 10' : 'Copy Top 10'}</span>
          </button>

          <button
            onClick={() => copyTags(keywords, 'All Tags')}
            className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 transition"
          >
            {copiedType === 'All Tags' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
            <span>{copiedType === 'All Tags' ? 'Copied' : 'Copy All'}</span>
          </button>
        </div>
      </div>

      {/* Semantic Keyword Cloud */}
      <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
        {filtered.map((item, idx) => (
          <span
            key={idx}
            className={`text-xs px-2.5 py-1 rounded-lg border transition cursor-default select-all flex items-center gap-1.5 ${getBadgeStyle(
              item.category,
              item.isTop10
            )}`}
          >
            {item.isTop10 && (
              <span className="text-[9px] font-black opacity-60">#{idx + 1}</span>
            )}
            <span>{item.tag}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
