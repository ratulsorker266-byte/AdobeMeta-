import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Award,
  Lock,
  Sparkles,
  Target,
  ShieldCheck,
  Copy,
  Check,
  Search,
  ArrowLeft
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
  themeMode = 'light'
}) => {
  const [testQuery, setTestQuery] = useState('ramadan kareem vector lantern banner');
  const [titleFormat] = useState<'clean' | 'detailed'>('clean');
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);

  const isLight = themeMode === 'light';

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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Top Header Card */}
      <div className={`p-6 sm:p-8 rounded-2xl border relative overflow-hidden ${
        isLight
          ? 'bg-white border-neutral-200/90 shadow-2xs text-neutral-900'
          : 'bg-[#111318] border-neutral-800 text-white shadow-xl'
      }`}>
        <div className="relative z-10 flex items-start gap-4 max-w-3xl">
          <button
            onClick={onBackToStudio}
            className={`p-2.5 rounded-xl border transition cursor-pointer shrink-0 mt-0.5 ${
              isLight
                ? 'bg-[#fbfaf8] hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
            }`}
            title="Back to All Stores"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-400">
              <span>05 . STORE · 100% RANK #1 SEARCH ENGINE</span>
              <span>·</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">ADOBE SENSEI &amp; SHUTTERSTOCK</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-bold tracking-tight leading-tight">
              Rank #1 on Adobe Stock &amp; Shutterstock for Vector EPS &amp; Photos
            </h2>

            <p className={`text-xs sm:text-sm ${isLight ? 'text-neutral-600' : 'text-neutral-400'} leading-relaxed`}>
              Adobe Stock’s search engine assigns <strong>75% of ranking weight</strong> to your Title's first 4 words and Keyword Slot #1–#10. Test any buyer phrase below to see how our algorithm locks it into position #1.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Query Simulator */}
      <div className={`p-6 rounded-2xl border space-y-5 ${
        isLight ? 'bg-white border-neutral-200/90 shadow-2xs' : 'bg-[#111318] border-neutral-800 shadow-xl'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-neutral-900' : 'text-white'}`}>
            <Target className="w-4 h-4 text-amber-500" />
            <span>Search Term Slot #1 Locking Simulator</span>
          </h3>
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
            Real-Time Algorithm Preview
          </span>
        </div>

        {/* Input bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400" />
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="e.g. ramadan kareem vector lantern banner"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium ${
                isLight
                  ? 'bg-[#fbfaf8] border-neutral-200 text-neutral-900 focus:bg-white focus:border-neutral-900'
                  : 'bg-neutral-950 border-neutral-800 text-white focus:border-neutral-600'
              } focus:outline-none transition font-sans`}
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
            className={`font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition flex items-center justify-center gap-2 shrink-0 cursor-pointer ${
              isLight
                ? 'bg-neutral-950 hover:bg-black text-white'
                : 'bg-white hover:bg-neutral-200 text-neutral-950'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>Lock into Studio Assets</span>
          </button>
        </div>

        {/* Algorithm Generated Title Box */}
        <div className={`p-4 rounded-xl border space-y-2 ${
          isLight ? 'bg-[#fbfaf8] border-neutral-200/80' : 'bg-neutral-950 border-neutral-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-mono font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Algorithm Recommended Title (&lt; 70 characters)
            </span>
            <div className="flex items-center gap-2.5">
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                generatedTitle.length <= 70 ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
              }`}>
                {generatedTitle.length}/70 chars
              </span>
              <button
                type="button"
                onClick={handleCopyTitle}
                className={`text-xs font-bold flex items-center gap-1 cursor-pointer ${
                  isLight ? 'text-neutral-900 hover:text-black' : 'text-white hover:text-amber-400'
                }`}
              >
                {copiedTitle ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedTitle ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
          <p className={`text-sm font-bold font-mono p-3 rounded-lg border select-all ${
            isLight ? 'bg-white text-neutral-900 border-neutral-200/80' : 'bg-neutral-900/80 text-white border-neutral-800'
          }`}>
            {generatedTitle}
          </p>
        </div>

        {/* Top 10 Algorithm Priority Slots */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isLight ? 'text-neutral-700' : 'text-neutral-300'
            }`}>
              <Award className="w-4 h-4 text-emerald-500" /> Top 10 Keyword Slots (Carries 75% of Search Volume)
            </span>
            <button
              type="button"
              onClick={handleCopyAllSlots}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
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
                    ? isLight
                      ? 'bg-neutral-950 text-white border-neutral-950'
                      : 'bg-white text-neutral-950 border-white'
                    : isLight
                    ? 'bg-[#fbfaf8] border-neutral-200/80 text-neutral-900'
                    : 'bg-neutral-950 border-neutral-800 text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    slot.num === 1
                      ? 'bg-amber-500 text-black'
                      : slot.num <= 5
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : (isLight ? 'bg-neutral-200/70 text-neutral-600' : 'bg-neutral-800 text-neutral-400')
                  }`}>
                    Slot #{slot.num}
                  </span>
                  {slot.num === 1 && (
                    <span className="text-[9px] font-mono font-bold flex items-center gap-0.5 opacity-80">
                      <Lock className="w-2.5 h-2.5" /> LOCKED
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold truncate" title={slot.tag}>
                  {slot.tag}
                </div>
                <div className={`text-[10px] mt-1 line-clamp-1 ${
                  slot.num === 1 ? 'opacity-75' : 'text-neutral-400'
                }`}>
                  {slot.weight}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Golden Rules for Vector Contributors */}
      <div className={`p-6 rounded-2xl border ${
        isLight ? 'bg-white border-neutral-200/90 shadow-2xs' : 'bg-[#111318] border-neutral-800 shadow-xl'
      } space-y-4`}>
        <h3 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-neutral-900' : 'text-white'}`}>
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <span>The 4 Golden Rules of 100% Adobe Stock SEO Ranking</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              num: '01',
              title: 'Rule of Title-Tag Front Synchronization',
              desc: 'Whatever words appear first in your title MUST be the exact keyword phrase in Slot #1. This triggers Adobe Stock Sensei algorithm match index with 100% correlation.'
            },
            {
              num: '02',
              title: 'Rule of 49 Keywords vs 50',
              desc: 'Adobe Stock accepts a maximum of 49 keywords. Submitting 50 triggers a warning. AdobeMeta automatically locks your tag array to 49 weighted keywords.'
            },
            {
              num: '03',
              title: 'Zero Blind Vector Metadata',
              desc: 'Never use generic placeholders. Our 6-stage EPS visual engine inspects the actual vector artwork (colors, silhouettes, shapes) before generating buyer terms.'
            },
            {
              num: '04',
              title: 'Zero Brand/Trademark Contamination',
              desc: 'Never include brand names (iPhone, Nike, Tesla, Windows) in keywords. Our automated Trademark Shield intercepts and cleans restricted brand names before export.'
            }
          ].map((rule) => (
            <div
              key={rule.num}
              className={`p-4 rounded-xl border space-y-1.5 ${
                isLight ? 'bg-[#fbfaf8] border-neutral-200/80' : 'bg-neutral-950 border-neutral-800'
              }`}
            >
              <div className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                RULE {rule.num}
              </div>
              <h4 className={`text-sm font-bold ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                {rule.title}
              </h4>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                {rule.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
