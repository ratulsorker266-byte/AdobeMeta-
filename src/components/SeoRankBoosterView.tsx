import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Award,
  Lock,
  Sparkles,
  Zap,
  Target,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  FileCode,
  Search,
  Eye,
  Info,
  AlertTriangle
} from 'lucide-react';

interface SeoRankBoosterViewProps {
  onBackToStudio: () => void;
  onApplyQueryToStudio?: (query: string) => void;
  showToast: (msg: string) => void;
  themeMode?: 'light' | 'dark';
}

export const SeoRankBoosterView: React.FC<SeoRankBoosterViewProps> = ({
  onBackToStudio,
  onApplyQueryToStudio,
  showToast,
  themeMode = 'dark'
}) => {
  const [testQuery, setTestQuery] = useState('ramadan kareem vector lantern banner');
  const [titleFormat, setTitleFormat] = useState<'clean' | 'detailed'>('clean');
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);

  const isLight = themeMode === 'light';

  // Computed simulation of ranking factors for the query
  const cleanTokens = testQuery
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const slot1 = testQuery.trim();
  const simulatedSlots = [
    { num: 1, tag: slot1, weight: '75% Search Dominance (Primary Locked Query)', tier: 'critical' },
    { num: 2, tag: cleanTokens.slice(0, 2).join(' ') || 'vector graphic', weight: 'High Intent Subject', tier: 'high' },
    { num: 3, tag: cleanTokens[cleanTokens.length - 1] || 'banner design', weight: 'Format & Type', tier: 'high' },
    { num: 4, tag: 'editable eps vector', weight: 'Commercial Vector Attribute', tier: 'high' },
    { num: 5, tag: 'commercial illustration', weight: 'Purchase Usage', tier: 'high' },
    { num: 6, tag: 'holiday celebration', weight: 'Context & Theme', tier: 'context' },
    { num: 7, tag: 'islamic culture', weight: 'Cultural Relevance', tier: 'context' },
    { num: 8, tag: 'traditional lantern', weight: 'Visual Element', tier: 'context' },
    { num: 9, tag: 'crescent moon design', weight: 'Iconic Attribute', tier: 'context' },
    { num: 10, tag: 'arabic typography', weight: 'Stylistic Modifier', tier: 'context' }
  ];

  const generatedTitle =
    titleFormat === 'clean'
      ? `${testQuery.charAt(0).toUpperCase() + testQuery.slice(1)} Illustration`
      : `${testQuery.charAt(0).toUpperCase() + testQuery.slice(1)} with Traditional Lanterns and Crescent Moon for Holiday Celebration`;

  const handleCopyTitle = () => {
    navigator.clipboard.writeText(generatedTitle);
    setCopiedTitle(true);
    showToast('✓ Title copied to clipboard!');
    setTimeout(() => setCopiedTitle(false), 2000);
  };

  const handleCopyAllSlots = () => {
    const text = simulatedSlots.map(s => s.tag).join(', ');
    navigator.clipboard.writeText(text);
    setCopiedTags(true);
    showToast('✓ Top 10 Ranked Keywords copied!');
    setTimeout(() => setCopiedTags(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Top Header Card */}
      <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden ${
        isLight
          ? 'bg-white border-indigo-200/90 shadow-xl shadow-indigo-500/5 text-slate-900'
          : 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border-indigo-500/30 text-white shadow-2xl'
      }`}>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              100% Rank #1 Search Algorithm Engine
            </span>
            <span className="text-xs font-medium text-slate-400">
              Adobe Stock &amp; Shutterstock Sensei Algorithms
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            How to Rank #1 on Adobe Stock &amp; Shutterstock for Vector EPS Files
          </h2>

          <p className={`text-sm sm:text-base ${isLight ? 'text-slate-600' : 'text-slate-300'} leading-relaxed`}>
            Adobe Stock’s search engine assigns <strong>75% of ranking weight</strong> to your Title's first 4 words and Keyword Slot #1. Test any phrase below to see how our algorithm locks it into position #1.
          </p>
        </div>
      </div>

      {/* Interactive Query Simulator */}
      <div className={`p-6 rounded-2xl border space-y-5 ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800 shadow-xl'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" />
            <span>Search Term Slot #1 Locking Simulator</span>
          </h3>
          <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
            Real-Time Algorithm Preview
          </span>
        </div>

        {/* Input bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="e.g. ramadan kareem vector lantern banner"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white' : 'bg-slate-950 border-slate-700 text-white'
              } focus:ring-2 focus:ring-indigo-500 focus:outline-none transition font-sans`}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              if (onApplyQueryToStudio) {
                onApplyQueryToStudio(testQuery);
              }
              onBackToStudio();
              showToast(`✓ Applied "${testQuery}" to Studio lock queue!`);
            }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition flex items-center justify-center gap-2 shrink-0 shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Lock into Studio Assets</span>
          </button>
        </div>

        {/* Algorithm Generated Title Box */}
        <div className={`p-4 rounded-xl border space-y-2 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-400" /> Algorithm Recommended Title (&lt; 70 characters)
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                generatedTitle.length <= 70 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {generatedTitle.length}/70 chars
              </span>
              <button
                type="button"
                onClick={handleCopyTitle}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold cursor-pointer"
              >
                {copiedTitle ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedTitle ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
          <p className="text-sm font-bold text-white font-mono bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 select-all">
            {generatedTitle}
          </p>
        </div>

        {/* Top 10 Algorithm Priority Slots */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-400" /> Top 10 Keyword Slots (Carries 70%+ of Search Volume)
            </span>
            <button
              type="button"
              onClick={handleCopyAllSlots}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              {copiedTags ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copiedTags ? 'Copied All 10' : 'Copy All 10 Slots'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {simulatedSlots.map((slot) => (
              <div
                key={slot.num}
                className={`p-3 rounded-xl border flex flex-col justify-between ${
                  slot.num === 1
                    ? 'bg-gradient-to-br from-indigo-950/80 to-purple-950/80 border-indigo-500/60 ring-2 ring-indigo-500/30'
                    : slot.num <= 3
                    ? 'bg-slate-900/90 border-indigo-500/30'
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                    slot.num === 1
                      ? 'bg-indigo-500 text-white'
                      : slot.num <= 5
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    Slot #{slot.num}
                  </span>
                  {slot.num === 1 && (
                    <span className="text-[9px] font-bold text-indigo-300 flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" /> LOCKED
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-white truncate" title={slot.tag}>
                  {slot.tag}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                  {slot.weight}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Golden Rules for Vector Contributors */}
      <div className={`p-6 rounded-2xl border ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
      } space-y-4`}>
        <h3 className="text-base font-bold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>The 4 Golden Rules of 100% Adobe Stock SEO Ranking</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">1</span>
              Rule of Title-Tag Front Synchronization
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Whatever words appear first in your title MUST be the exact keyword phrase in Slot #1. This triggers Adobe Stock's Sensei algorithm match index with 100% correlation.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black">2</span>
              Rule of 49 Keywords vs 50
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Adobe Stock accepts a maximum of 49 keywords. Submitting 50 will trigger a rejection warning. AdobeMeta automatically limits your tag array to 49 optimized keywords.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-black">3</span>
              Zero Blind Vector Metadata
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Never use generic placeholders. Our 6-stage EPS visual engine inspects the actual vector artwork (colors, silhouettes, shapes, symbols) before generating terms.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-black">4</span>
              Zero Brand/Trademark Contamination
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Never include brand names (iPhone, Nike, Tesla, Windows) in keywords. Our automated Trademark Shield intercepts and cleans banned brand names before export.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
