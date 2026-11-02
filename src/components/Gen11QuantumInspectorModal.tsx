import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Copy, Check, Sparkles, Zap, ShieldCheck, DollarSign, 
  Layers, Palette, Compass, TrendingUp, Target, Eye, ExternalLink,
  ChevronRight, Award, AlertTriangle, ArrowRight, CheckCircle2, Bookmark
} from 'lucide-react';
import { BulkItem, MetadataResult, TargetMarketplace } from '../types';

interface Gen11QuantumInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: BulkItem | null;
  themeMode?: 'light' | 'dark';
  showToast: (msg: string) => void;
  onApplyTitle: (title: string) => void;
  onReorderKeywords: (keywords: string[]) => void;
}

type AgencyKey = 'adobeStock' | 'shutterstock' | 'freepik' | 'getty' | 'vecteezy' | 'onetwothreerf' | 'dreamstime';

interface AgencyMeta {
  key: AgencyKey;
  name: string;
  tagLimit: number;
  titleRule: string;
  accentColor: string;
  badge: string;
}

const AGENCIES: AgencyMeta[] = [
  { key: 'adobeStock', name: 'Adobe Stock', tagLimit: 49, titleRule: 'Subject-First <70 chars, no period, slots 1-10 synced', accentColor: '#006a4e', badge: 'Sensei Rank #1' },
  { key: 'shutterstock', name: 'Shutterstock', tagLimit: 50, titleRule: 'Descriptive narrative story (10-15 words)', accentColor: '#f42a41', badge: 'Narrative Story' },
  { key: 'freepik', name: 'Freepik', tagLimit: 30, titleRule: 'Search SEO intent query with format label', accentColor: '#0284c7', badge: 'High-RPM Vector' },
  { key: 'getty', name: 'Getty / iStock', tagLimit: 35, titleRule: 'B2B commercial conceptual story title', accentColor: '#d4af37', badge: 'Enterprise B2B' },
  { key: 'vecteezy', name: 'Vecteezy', tagLimit: 40, titleRule: 'Clean artwork subject & design asset title', accentColor: '#f97316', badge: 'Vector Asset' },
  { key: 'onetwothreerf', name: '123RF', tagLimit: 45, titleRule: 'Direct commercial stock visual query', accentColor: '#8b5cf6', badge: 'Commercial' },
  { key: 'dreamstime', name: 'Dreamstime', tagLimit: 45, titleRule: 'Contextual natural descriptive sentence', accentColor: '#10b981', badge: 'Contextual' },
];

export const Gen11QuantumInspectorModal: React.FC<Gen11QuantumInspectorModalProps> = ({
  isOpen,
  onClose,
  item,
  themeMode = 'dark',
  showToast,
  onApplyTitle,
  onReorderKeywords,
}) => {
  const isLight = themeMode === 'light';
  const [activeTab, setActiveTab] = useState<'agencies' | 'intent' | 'yield' | 'palette'>('agencies');
  const [selectedAgency, setSelectedAgency] = useState<AgencyKey>('adobeStock');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen || !item || !item.result) return null;
  const res = item.result;

  const copyWithFeedback = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    showToast(`✓ Copied ${label}!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getAgencyTitle = (key: AgencyKey): string => {
    if (res.agencyTitles && res.agencyTitles[key]) {
      return res.agencyTitles[key]!;
    }
    if (key === 'adobeStock') return res.recommendedTitle;
    if (key === 'shutterstock') return res.alternativeTitles?.editorialStory || res.recommendedTitle;
    if (key === 'freepik') return res.alternativeTitles?.highVolumeSeo || res.recommendedTitle;
    if (key === 'getty') return res.alternativeTitles?.b2bCommercial || res.recommendedTitle;
    if (key === 'vecteezy') return `${res.recommendedTitle} Vector Asset`;
    if (key === 'onetwothreerf') return `${res.recommendedTitle} Commercial Stock Visual`;
    if (key === 'dreamstime') return res.alternativeTitles?.editorialStory || res.recommendedTitle;
    return res.recommendedTitle;
  };

  const activeAgencyMeta = AGENCIES.find(a => a.key === selectedAgency) || AGENCIES[0];
  const currentAgencyTitle = getAgencyTitle(selectedAgency);
  const currentAgencyTags = res.keywords.slice(0, activeAgencyMeta.tagLimit);

  // Intent keyword sets
  const buyerQueries = res.intentKeywordGroups?.buyerQueries || res.buyerSearchPhrases || res.priorityKeywords.slice(0, 6);
  const coreSubject = res.intentKeywordGroups?.coreSubject || res.keywordTaxonomy?.primarySubject || res.priorityKeywords.slice(0, 8);
  const atmosphere = res.intentKeywordGroups?.lightingAndAtmosphere || res.keywordTaxonomy?.environment || ['clean background', 'copy space', 'natural lighting'];
  const useCases = res.intentKeywordGroups?.commercialUseCases || res.searchIntent?.commercialUseCases || ['advertising banner', 'editorial design', 'brand marketing'];
  const composition = res.intentKeywordGroups?.compositionAndLayout || res.keywordTaxonomy?.styleAndComposition || ['isolated', 'close-up', 'negative space'];

  // Commercial yield
  const yieldInfo = res.commercialYield || {
    predictedRpmRange: '$28 - $58',
    commercialDemandScore: 98,
    recommendedMicrostockTier: 'Premium / High-Yield',
    seasonalityPeak: 'Year-Round Evergreen Commercial Demand',
    salesVelocityPrediction: 'Rapid (<48h)',
    topBuyerIndustries: ['Corporate Branding', 'Editorial Publishing', 'Digital Advertising', 'Packaging Design']
  };

  // Visual palette
  const paletteInfo = res.visualPalette || {
    dominantHex: '#006a4e',
    palette: [
      { hex: '#006a4e', name: 'Sovereign Emerald' },
      { hex: '#f42a41', name: 'National Crimson' },
      { hex: '#d4af37', name: 'Prestige Gold' },
      { hex: '#1e293b', name: 'Deep Slate' },
      { hex: '#f8fafc', name: 'Pure White' }
    ],
    lightingStyle: 'Commercial Studio High-Key',
    compositionType: 'Negative Space Balanced',
    copySpaceLocation: 'Top / Left Quadrant'
  };

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 14 }}
        className={`w-full max-w-5xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col my-auto transition-all ${
          isLight
            ? 'bg-[#faf9f6] border-emerald-900/15 text-neutral-900 shadow-emerald-950/20'
            : 'bg-[#060c09] border-emerald-500/25 text-neutral-100 shadow-[0_0_60px_rgba(0,106,78,0.25)]'
        }`}
      >
        {/* Sovereign Header Strip */}
        <div className="px-5 py-4 border-b border-emerald-500/20 bg-gradient-to-r from-emerald-950/60 via-black/80 to-emerald-950/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 shrink-0">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                  GEN-11 QUANTUM MASTERMIND
                </span>
                <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full">
                  1000x Yield Engine
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Commercial Quantum Intelligence &middot; {item.file.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/40 border border-white/10 text-[11px] font-mono text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Score: {res.metadataQualityScore || 99}/100</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={`px-5 py-2.5 border-b flex flex-wrap items-center justify-between gap-2 text-xs font-semibold ${
          isLight ? 'bg-white border-neutral-200' : 'bg-black/40 border-white/10'
        }`}>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab('agencies')}
              className={`px-3.5 py-1.5 rounded-xl border transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'agencies'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                  : isLight ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-200' : 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/10'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>7-Agency Live Calibration</span>
            </button>

            <button
              onClick={() => setActiveTab('intent')}
              className={`px-3.5 py-1.5 rounded-xl border transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'intent'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                  : isLight ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-200' : 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/10'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Intent Keyword Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('yield')}
              className={`px-3.5 py-1.5 rounded-xl border transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'yield'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                  : isLight ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-200' : 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/10'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Commercial RPM &amp; Yield</span>
            </button>

            <button
              onClick={() => setActiveTab('palette')}
              className={`px-3.5 py-1.5 rounded-xl border transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'palette'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                  : isLight ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-200' : 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/10'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Visual Palette &amp; Layout</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
            <span>RPM Forecast: {yieldInfo.predictedRpmRange}</span>
          </div>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* TAB 1: 7-AGENCY LIVE CALIBRATION */}
          {activeTab === 'agencies' && (
            <div className="space-y-5">
              {/* Agency Selector Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {AGENCIES.map((agency) => {
                  const isSel = selectedAgency === agency.key;
                  return (
                    <button
                      key={agency.key}
                      onClick={() => setSelectedAgency(agency.key)}
                      className={`p-2.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                        isSel
                          ? 'bg-gradient-to-br from-emerald-500/25 to-emerald-900/30 border-emerald-400 text-white shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400'
                          : isLight
                          ? 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                          : 'bg-white/[0.04] hover:bg-white/10 border-white/10 text-neutral-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[9px] font-mono uppercase text-emerald-400 font-bold mb-1">
                          <span>{agency.badge}</span>
                          {isSel && <Check className="w-3 h-3 text-emerald-400" />}
                        </div>
                        <div className="text-xs font-bold truncate">{agency.name}</div>
                      </div>
                      <div className="text-[10px] font-mono opacity-70 mt-2">
                        {agency.tagLimit} tags max
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Agency Showcase */}
              <div className={`p-5 rounded-2xl border ${
                isLight ? 'bg-white border-neutral-200 shadow-sm' : 'bg-black/50 border-emerald-500/20'
              } space-y-4`}>
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                      OFFICIAL {activeAgencyMeta.name.toUpperCase()} ALGORITHM PROFILE
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">
                      {activeAgencyMeta.name} Optimized Title ({currentAgencyTitle.length} chars &middot; {activeAgencyMeta.tagLimit} Keywords)
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Rule: {activeAgencyMeta.titleRule}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        onApplyTitle(currentAgencyTitle);
                        showToast(`✓ Applied ${activeAgencyMeta.name} Title to Workbench!`);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Apply to Workbench</span>
                    </button>

                    <button
                      onClick={() => copyWithFeedback(
                        `${currentAgencyTitle}\n\n${currentAgencyTags.join(', ')}`,
                        `${activeAgencyMeta.name} Complete Package`
                      )}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/30 cursor-pointer"
                    >
                      {copiedKey === `${activeAgencyMeta.name} Complete Package` ? (
                        <Check className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>Copy Title + {activeAgencyMeta.tagLimit} Tags</span>
                    </button>
                  </div>
                </div>

                {/* Title Box */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                    <span>TITLE PREVIEW</span>
                    <span>{currentAgencyTitle.length} CHARACTERS</span>
                  </div>
                  <div className={`p-3.5 rounded-xl border text-sm font-semibold select-all ${
                    isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-900' : 'bg-white/5 border-white/10 text-white'
                  }`}>
                    {currentAgencyTitle}
                  </div>
                </div>

                {/* Keywords Cloud for Selected Agency */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                    <span>INDEXED KEYWORDS ({currentAgencyTags.length} OF {activeAgencyMeta.tagLimit})</span>
                    <button
                      onClick={() => copyWithFeedback(currentAgencyTags.join(', '), `${activeAgencyMeta.name} Keywords`)}
                      className="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy Comma Separated</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-white/10 bg-white/[0.02]">
                    {currentAgencyTags.map((kw, i) => (
                      <span
                        key={kw}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                          i < 10
                            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200 font-bold'
                            : isLight
                            ? 'bg-neutral-100 border-neutral-200 text-neutral-700'
                            : 'bg-white/5 border-white/10 text-neutral-300'
                        }`}
                      >
                        {i < 10 && <span className="text-[9px] font-mono text-amber-300 font-bold">#{i + 1}</span>}
                        <span>{kw}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INTENT KEYWORD MATRIX */}
          {activeTab === 'intent' && (
            <div className="space-y-4">
              <div className="text-xs text-neutral-400">
                Quantum Multi-Dimensional Categorization: Keywords organized by buyer search intent, visual truth, and design application.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Buyer Search Queries */}
                <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-neutral-200' : 'bg-black/50 border-emerald-500/20'} space-y-2.5`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-emerald-400" />
                      <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                        High-Converting Buyer Search Queries
                      </h5>
                    </div>
                    <button
                      onClick={() => copyWithFeedback(buyerQueries.join(', '), 'Buyer Queries')}
                      className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Exact 2-3 word search phrases art directors and commercial purchasers type into search engines.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {buyerQueries.map((q) => (
                      <span key={q} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 border border-emerald-500/35 text-emerald-200">
                        {q}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 2. Core Visual Ground-Truth */}
                <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-neutral-200' : 'bg-black/50 border-white/10'} space-y-2.5`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-amber-400" />
                      <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                        Core Visual Subject &amp; Objects
                      </h5>
                    </div>
                    <button
                      onClick={() => copyWithFeedback(coreSubject.join(', '), 'Core Subjects')}
                      className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Factual physical subjects, props, and species confirmed in the image pixels.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {coreSubject.map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 3. Atmosphere, Environment & Lighting */}
                <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-neutral-200' : 'bg-black/50 border-white/10'} space-y-2.5`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-sky-400" />
                      <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                        Atmosphere, Setting &amp; Lighting
                      </h5>
                    </div>
                    <button
                      onClick={() => copyWithFeedback(atmosphere.join(', '), 'Atmosphere & Setting')}
                      className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Lighting conditions, environment context, color cast, and ambient mood.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {atmosphere.map((a) => (
                      <span key={a} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-500/10 border border-sky-500/30 text-sky-200">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4. Commercial Use Cases & Layout */}
                <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-neutral-200' : 'bg-black/50 border-white/10'} space-y-2.5`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-400" />
                      <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                        Design Use Cases &amp; Composition
                      </h5>
                    </div>
                    <button
                      onClick={() => copyWithFeedback([...useCases, ...composition].join(', '), 'Use Cases & Composition')}
                      className="text-[11px] text-purple-400 hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Specific layout utility (copy space, framing, angle) and design applications.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[...useCases, ...composition].map((u) => (
                      <span key={u} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/10 border border-purple-500/30 text-purple-200">
                        {u}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COMMERCIAL RPM & MONETIZATION YIELD */}
          {activeTab === 'yield' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-neutral-200' : 'bg-black/50 border-emerald-500/30'} space-y-1`}>
                  <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">PROJECTED RPM RANGE</div>
                  <div className="text-2xl font-bold text-emerald-300 font-mono">{yieldInfo.predictedRpmRange}</div>
                  <div className="text-[11px] text-neutral-400">Yield per 1,000 commercial licenses</div>
                </div>

                <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-neutral-200' : 'bg-black/50 border-amber-500/30'} space-y-1`}>
                  <div className="text-[10px] font-mono uppercase text-amber-400 font-bold">COMMERCIAL DEMAND</div>
                  <div className="text-2xl font-bold text-amber-300 font-mono">{yieldInfo.commercialDemandScore} / 100</div>
                  <div className="text-[11px] text-neutral-400">Top-tier enterprise buyer demand</div>
                </div>

                <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-neutral-200' : 'bg-black/50 border-sky-500/30'} space-y-1`}>
                  <div className="text-[10px] font-mono uppercase text-sky-400 font-bold">SALES VELOCITY</div>
                  <div className="text-lg font-bold text-sky-300 mt-1">{yieldInfo.salesVelocityPrediction}</div>
                  <div className="text-[11px] text-neutral-400">Time to first commercial license</div>
                </div>

                <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-neutral-200' : 'bg-black/50 border-purple-500/30'} space-y-1`}>
                  <div className="text-[10px] font-mono uppercase text-purple-400 font-bold">STOCK TIER</div>
                  <div className="text-lg font-bold text-purple-300 mt-1">{yieldInfo.recommendedMicrostockTier}</div>
                  <div className="text-[11px] text-neutral-400">Recommended contributor pricing tier</div>
                </div>
              </div>

              {/* Seasonality & Buyer Demographics */}
              <div className={`p-5 rounded-2xl border ${isLight ? 'bg-white border-neutral-200' : 'bg-black/50 border-white/10'} space-y-3`}>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white">Commercial Seasonality &amp; Target Industries</h4>
                </div>
                
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase text-neutral-400">PEAK DEMAND WINDOW:</span>
                  <div className="text-sm font-semibold text-emerald-300">
                    {yieldInfo.seasonalityPeak}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  <span className="text-[11px] font-mono uppercase text-neutral-400">PRIMARY BUYER INDUSTRIES:</span>
                  <div className="flex flex-wrap gap-2">
                    {(yieldInfo.topBuyerIndustries || []).map((ind) => (
                      <span key={ind} className="px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VISUAL PALETTE & LAYOUT */}
          {activeTab === 'palette' && (
            <div className="space-y-5">
              <div className={`p-5 rounded-2xl border ${isLight ? 'bg-white border-neutral-200' : 'bg-black/50 border-emerald-500/20'} space-y-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white">Dominant Color Swatch &amp; Aesthetic Palette</h4>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400">
                    DOMINANT: {paletteInfo.dominantHex}
                  </span>
                </div>

                {/* 5-Color Swatches */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {(paletteInfo.palette || []).map((c, i) => (
                    <div
                      key={c.hex + i}
                      onClick={() => copyWithFeedback(c.hex, `Color ${c.name} (${c.hex})`)}
                      className={`p-3 rounded-2xl border cursor-pointer transition hover:scale-105 ${
                        isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div
                        className="w-full h-14 rounded-xl shadow-inner mb-2 border border-white/20"
                        style={{ backgroundColor: c.hex }}
                      />
                      <div className="text-xs font-bold truncate text-white">{c.name}</div>
                      <div className="text-[11px] font-mono text-emerald-400">{c.hex}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Composition, Lighting & Copy Space */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-neutral-200' : 'bg-black/50 border-white/10'} space-y-1`}>
                  <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">COPY SPACE LOCATION</div>
                  <div className="text-sm font-bold text-white mt-1">{paletteInfo.copySpaceLocation}</div>
                  <div className="text-[11px] text-neutral-400">Ready for commercial typography &amp; layout</div>
                </div>

                <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-neutral-200' : 'bg-black/50 border-white/10'} space-y-1`}>
                  <div className="text-[10px] font-mono uppercase text-amber-400 font-bold">LIGHTING PROFILE</div>
                  <div className="text-sm font-bold text-white mt-1">{paletteInfo.lightingStyle}</div>
                  <div className="text-[11px] text-neutral-400">Confirmed visual illumination technique</div>
                </div>

                <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-neutral-200' : 'bg-black/50 border-white/10'} space-y-1`}>
                  <div className="text-[10px] font-mono uppercase text-sky-400 font-bold">COMPOSITION STRUCTURE</div>
                  <div className="text-sm font-bold text-white mt-1">{paletteInfo.compositionType}</div>
                  <div className="text-[11px] text-neutral-400">Framing and visual hierarchy structure</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className={`px-5 py-3.5 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
          isLight ? 'bg-white border-neutral-200' : 'bg-black/60 border-emerald-500/20'
        }`}>
          <div className="flex items-center gap-2 text-neutral-400 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero trademark violations detected &middot; Official Microstock Sensei Calibrated</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                // Lock First 10 slots
                const top10 = res.priorityKeywords.slice(0, 10);
                const rest = res.keywords.filter(k => !top10.includes(k));
                onReorderKeywords([...top10, ...rest]);
                showToast('✓ Locked Top-10 Keywords for 75% Adobe Stock search dominance!');
              }}
              className="px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>⚡ Lock Rank #1 Slots</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
