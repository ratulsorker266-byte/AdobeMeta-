import React, { useState, useMemo } from 'react';
import { Copy, Check, Sparkles, Compass, Target, Layers } from 'lucide-react';
import { KeywordTaxonomy } from '../types';

interface SemanticKeywordBadgesProps {
  keywords: string[];
  keywordTaxonomy?: KeywordTaxonomy;
  longTailKeywords?: string[];
  showToast: (msg: string) => void;
  themeMode?: 'light' | 'dark';
}

type TaxonomyFilter = 'all' | 'top10' | 'longtail' | 'subject' | 'concept' | 'action' | 'environment';

export const SemanticKeywordBadges: React.FC<SemanticKeywordBadgesProps> = ({ 
  keywords, 
  keywordTaxonomy,
  longTailKeywords = [],
  showToast,
  themeMode = 'light'
}) => {
  const [activeFilter, setActiveFilter] = useState<TaxonomyFilter>('all');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const isLight = themeMode === 'light';

  // Build classified keywords combining backend taxonomy & heuristic mapping
  const classifiedKeywords = useMemo(() => {
    const primarySet = new Set((keywordTaxonomy?.primarySubject || []).map(s => s.toLowerCase()));
    const secondarySet = new Set((keywordTaxonomy?.secondarySubject || []).map(s => s.toLowerCase()));
    const actionSet = new Set((keywordTaxonomy?.action || []).map(s => s.toLowerCase()));
    const envSet = new Set((keywordTaxonomy?.environment || []).map(s => s.toLowerCase()));
    const conceptSet = new Set((keywordTaxonomy?.commercialConcept || []).map(s => s.toLowerCase()));
    const longTailSet = new Set((longTailKeywords || []).map(s => s.toLowerCase()));

    return (keywords || []).map((tag, idx) => {
      const lower = tag.toLowerCase().trim();
      const isTop10 = idx < 10;
      const isLongTail = longTailSet.has(lower) || lower.split(/\s+/).length >= 3;

      let category: 'subject' | 'concept' | 'action' | 'environment' | 'other' = 'other';
      if (primarySet.has(lower) || secondarySet.has(lower)) {
        category = 'subject';
      } else if (actionSet.has(lower) || lower.endsWith('ing')) {
        category = 'action';
      } else if (envSet.has(lower)) {
        category = 'environment';
      } else if (conceptSet.has(lower)) {
        category = 'concept';
      }

      return {
        tag,
        isTop10,
        isLongTail,
        category,
        index: idx + 1
      };
    });
  }, [keywords, keywordTaxonomy, longTailKeywords]);

  const filtered = useMemo(() => {
    switch (activeFilter) {
      case 'top10':
        return classifiedKeywords.filter(k => k.isTop10);
      case 'longtail':
        return classifiedKeywords.filter(k => k.isLongTail);
      case 'subject':
        return classifiedKeywords.filter(k => k.category === 'subject');
      case 'concept':
        return classifiedKeywords.filter(k => k.category === 'concept');
      case 'action':
        return classifiedKeywords.filter(k => k.category === 'action');
      case 'environment':
        return classifiedKeywords.filter(k => k.category === 'environment');
      case 'all':
      default:
        return classifiedKeywords;
    }
  }, [classifiedKeywords, activeFilter]);

  const copyTags = (tagList: string[], type: string) => {
    navigator.clipboard.writeText(tagList.join(', '));
    setCopiedType(type);
    showToast(`✓ Copied ${type} to clipboard`);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const top10 = (keywords || []).slice(0, 10);

  return (
    <div className="space-y-3 pt-1">
      {/* Category Filter Bar & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className={`flex flex-wrap items-center gap-1 ${isLight ? 'bg-slate-100/90 border-slate-200' : 'bg-slate-900 border-slate-800'} p-1 rounded-xl border text-xs`}>
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
              activeFilter === 'all'
                ? isLight ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'bg-slate-800 text-white shadow-xs'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({keywords.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('top10')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'top10'
                ? isLight ? 'bg-indigo-600 text-white shadow-xs' : 'bg-indigo-600 text-white shadow-xs'
                : isLight ? 'text-indigo-700 hover:text-indigo-900' : 'text-indigo-400 hover:text-indigo-300'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Top 10 Heavyweight</span>
          </button>

          {longTailKeywords.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveFilter('longtail')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition flex items-center gap-1.5 cursor-pointer ${
                activeFilter === 'longtail'
                  ? isLight ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-600 text-white shadow-xs'
                  : isLight ? 'text-emerald-700 hover:text-emerald-900' : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <Target className="w-3 h-3" />
              <span>Long-Tail Intent</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveFilter('subject')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
              activeFilter === 'subject'
                ? isLight ? 'bg-slate-800 text-white' : 'bg-slate-700 text-white'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Subject
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('concept')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
              activeFilter === 'concept'
                ? isLight ? 'bg-slate-800 text-white' : 'bg-slate-700 text-white'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Concept
          </button>
        </div>

        {/* 1-Click Copy Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => copyTags(top10, 'Top 10 Keywords')}
            className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition flex items-center gap-1 cursor-pointer ${
              isLight
                ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                : 'bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border-indigo-500/40'
            }`}
            title="Adobe Stock weights first 10 keywords heaviest in search algorithm"
          >
            {copiedType === 'Top 10 Keywords' ? <Check className="w-3 h-3 text-emerald-500" /> : <Sparkles className="w-3 h-3 text-indigo-500" />}
            <span>{copiedType === 'Top 10 Keywords' ? 'Copied' : 'Copy Top 10'}</span>
          </button>

          <button
            type="button"
            onClick={() => copyTags(keywords, 'All Keywords')}
            className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition flex items-center gap-1 cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            {copiedType === 'All Keywords' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-slate-500" />}
            <span>{copiedType === 'All Keywords' ? 'Copied' : 'Copy All'}</span>
          </button>
        </div>
      </div>

      {/* Semantic Keyword Badges Grid */}
      <div className={`flex flex-wrap gap-1.5 max-h-52 overflow-y-auto p-3 rounded-xl border ${
        isLight ? 'bg-slate-50/70 border-slate-200/90' : 'bg-slate-950/70 border-slate-800'
      }`}>
        {filtered.length === 0 ? (
          <div className="text-xs text-slate-400 py-3 text-center w-full">
            No keywords found under this taxonomy category.
          </div>
        ) : (
          filtered.map((item, idx) => {
            let badgeClasses = '';
            if (item.isTop10) {
              badgeClasses = isLight
                ? 'bg-indigo-50/80 text-indigo-900 border-indigo-200/90 font-medium'
                : 'bg-indigo-950/60 text-indigo-200 border-indigo-500/40 font-medium';
            } else if (item.isLongTail) {
              badgeClasses = isLight
                ? 'bg-emerald-50/80 text-emerald-900 border-emerald-200/90'
                : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40';
            } else {
              badgeClasses = isLight
                ? 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white';
            }

            return (
              <span
                key={`${item.tag}-${idx}`}
                className={`text-xs px-2.5 py-1 rounded-lg border transition cursor-default select-all flex items-center gap-1.5 ${badgeClasses}`}
              >
                {item.isTop10 && (
                  <span className={`text-[9px] font-mono font-bold px-1 rounded ${
                    isLight ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-900/80 text-indigo-300'
                  }`}>
                    #{item.index}
                  </span>
                )}
                <span>{item.tag}</span>
              </span>
            );
          })
        )}
      </div>
    </div>
  );
};
