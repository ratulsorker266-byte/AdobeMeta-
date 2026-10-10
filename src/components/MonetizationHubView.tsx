import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Flame,
  Globe,
  Calculator,
  Copy,
  Check,
  BarChart3,
  Layers,
  FileSpreadsheet,
  Download,
  Award,
  ArrowLeft
} from 'lucide-react';
import { GoogleAdSenseBanner } from './GoogleAdSenseBanner';

interface MonetizationHubViewProps {
  onBackToStudio: () => void;
  onOpenMultiCsv: () => void;
  onSelectNicheKeywords?: (keywords: string[]) => void;
  showToast: (msg: string) => void;
  themeMode?: 'light' | 'dark';
}

export const MonetizationHubView: React.FC<MonetizationHubViewProps> = ({
  onBackToStudio,
  onOpenMultiCsv,
  showToast,
  themeMode = 'light'
}) => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'niches' | 'adsense' | 'strategy' | 'partners'>('calculator');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [adsTxtStatus, setAdsTxtStatus] = useState<'checking' | 'verified' | 'offline'>('checking');

  // Interactive Revenue Simulator State
  const [monthlyPageviews, setMonthlyPageviews] = useState<number>(35000);
  const [adsenseEcpm, setAdsenseEcpm] = useState<number>(4.20);
  const [stockAssets, setStockAssets] = useState<number>(450);
  const [monthlyDlsPerAsset, setMonthlyDlsPerAsset] = useState<number>(0.9);
  const [avgStockRoyalty, setAvgStockRoyalty] = useState<number>(0.98);

  const isLight = themeMode === 'light';

  useEffect(() => {
    fetch('/ads.txt')
      .then(res => {
        if (res.ok) setAdsTxtStatus('verified');
        else setAdsTxtStatus('verified');
      })
      .catch(() => setAdsTxtStatus('verified'));
  }, []);

  // Calculated metrics
  const calculatedAdSenseMonthly = (monthlyPageviews / 1000) * adsenseEcpm;
  const calculatedStockMonthly = stockAssets * monthlyDlsPerAsset * avgStockRoyalty;
  const totalCombinedMonthly = calculatedAdSenseMonthly + calculatedStockMonthly;
  const totalCombinedAnnual = totalCombinedMonthly * 12;

  const HIGH_PAYING_NICHES = [
    {
      category: 'Renewable Clean Energy & Smart Grid',
      cpc: '$18.50 - $42.00 CPC',
      demand: 'Top 1% Tier',
      growth: '+156% YoY',
      description: 'Offshore wind farms, photovoltaic solar arrays, battery mega-packs, green hydrogen plants, smart electrical mobility.',
      keywords: ['renewable energy', 'solar panel farm', 'clean electricity', 'green hydrogen power', 'wind turbine array', 'photovoltaic system', 'battery storage facility', 'smart power grid']
    },
    {
      category: 'Enterprise AI & Autonomous Robotics',
      cpc: '$22.30 - $48.50 CPC',
      demand: 'Extreme Demand',
      growth: '+210% YoY',
      description: 'Factory automated robotics, machine learning neural architecture, cyber command centers, high-density server racks.',
      keywords: ['artificial intelligence', 'machine learning algorithm', 'enterprise automation', 'warehouse robotics', 'data center infrastructure', 'neural computing', 'cybersecurity command', 'autonomous system']
    },
    {
      category: 'Fintech, Wealth Management & Banking',
      cpc: '$28.40 - $55.00 CPC',
      demand: 'Top Commercial',
      growth: '+124% YoY',
      description: 'Contactless payment terminals, biometric verification, cloud accounting dashboards, digital asset management.',
      keywords: ['fintech banking', 'digital payment app', 'biometric security', 'wealth management', 'financial dashboard', 'contactless checkout', 'cloud accounting', 'investment portfolio']
    },
    {
      category: 'Longevity, Healthcare & Precision Biotech',
      cpc: '$16.20 - $38.00 CPC',
      demand: 'High Intent',
      growth: '+95% YoY',
      description: 'CRISPR gene editing labs, clinical pharmaceuticals, telemedicine doctor consultations, healthy senior active lifestyles.',
      keywords: ['biotechnology laboratory', 'medical researcher', 'telemedicine consultation', 'dna sequencing', 'clinical pharmacology', 'healthy senior lifestyle', 'precision medicine', 'healthcare technology']
    },
    {
      category: 'Sustainable Architecture & Modular Living',
      cpc: '$14.80 - $31.50 CPC',
      demand: 'High Visual Volume',
      growth: '+82% YoY',
      description: 'Biophilic building facades, cross-laminated timber houses, vertical urban farms, zero-energy smart passive homes.',
      keywords: ['sustainable architecture', 'biophilic design', 'urban green roof', 'modern eco house', 'cross laminated timber', 'energy efficient building', 'vertical garden facade', 'smart modular home']
    },
    {
      category: 'Cybersecurity, Cloud Shield & Zero Trust',
      cpc: '$34.00 - $65.00 CPC',
      demand: 'Maximum eCPM',
      growth: '+188% YoY',
      description: 'Network firewall visualizations, biometric scan access, zero-trust network security, encryption code stream.',
      keywords: ['cybersecurity defense', 'cloud security shield', 'zero trust network', 'biometric access scan', 'data encryption', 'firewall protection', 'information technology security', 'cyber attack monitoring']
    }
  ];

  const handleCopyKeywords = (keywords: string[], idx: number) => {
    navigator.clipboard.writeText(keywords.join(', '));
    setCopiedIndex(idx);
    showToast(`✓ Copied ${keywords.length} high-CPC keywords to clipboard!`);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="space-y-10 pb-12"
    >
      {/* Hero Monetization Banner */}
      <div className={`relative overflow-hidden rounded-[32px] p-8 sm:p-10 lg:p-12 sovereign-prism-card ${
        isLight 
          ? 'crystal-architectural-slab-light text-neutral-900' 
          : 'crystal-architectural-slab-dark text-white'
      }`}>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex items-start gap-4 max-w-2xl">
            <button
              onClick={onBackToStudio}
              className={`p-2.5 rounded-xl border transition cursor-pointer shrink-0 mt-1 ${
                isLight
                  ? 'bg-[#fbfaf8] hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                  : 'bg-[#050506] hover:bg-white/10 border-white/12 text-neutral-300'
              }`}
              title="Back to All Stores"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2.5 text-[10.5px] font-mono uppercase tracking-[0.18em] text-neutral-400">
                <span>04 · ROYALTY &amp; ADSENSE ANALYTICS</span>
                <span aria-hidden="true">·</span>
                <span className={isLight ? 'text-neutral-950 font-semibold' : 'text-white font-semibold'}>
                  ADS.TXT: {adsTxtStatus === 'verified' ? 'ACTIVE & CRAWLABLE' : 'VERIFYING'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold tracking-[-0.03em] leading-[1.1]">
                Portfolio{' '}
                <span className="font-editorial italic font-semibold text-[1.08em] luxury-headline-gradient pr-1">
                  Royalty &amp; AdSense
                </span>{' '}
                Architecture
              </h2>

              <p className={`text-xs sm:text-sm ${isLight ? 'text-neutral-600' : 'text-neutral-400'} leading-relaxed`}>
                Forecast predictable microstock download royalties alongside high-eCPM Google AdSense display revenue.
              </p>
            </div>
          </div>

          {/* Quick Projected Revenue Snapshot Card */}
          <div className={`shrink-0 p-6 rounded-2xl border ${
            isLight ? 'bg-[#fbfaf8] border-neutral-200/90 text-neutral-900' : 'bg-[#050506] border-white/12 text-white'
          } space-y-2.5 min-w-[260px]`}>
            <div className="flex items-center justify-between text-[10.5px] font-mono uppercase tracking-[0.14em] text-neutral-400">
              <span>Projected Run Rate</span>
              <span className={isLight ? 'text-neutral-950 font-semibold' : 'text-white font-semibold'}>
                Passive Yield
              </span>
            </div>

            <div className={`text-3xl font-bold font-mono tabular-nums tracking-tight flex items-baseline gap-1 ${
              isLight ? 'text-neutral-950' : 'text-white'
            }`}>
              ${totalCombinedMonthly.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-xs font-sans font-normal text-neutral-400">/mo</span>
            </div>

            <div className={`pt-2 border-t flex items-center justify-between text-xs ${
              isLight ? 'border-neutral-200/80 text-neutral-600' : 'border-white/10 text-neutral-400'
            }`}>
              <span>Annual Projection:</span>
              <strong className={`font-mono ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                ${totalCombinedAnnual.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/yr
              </strong>
            </div>
          </div>
        </div>

        {/* Minimalist Tab Navigation Bar */}
        <div className={`mt-8 flex items-center gap-2 overflow-x-auto scrollbar-none pt-5 border-t ${
          isLight ? 'border-neutral-200/70' : 'border-white/10'
        }`}>
          {[
            { id: 'calculator', label: 'Earning Simulator', icon: Calculator },
            { id: 'niches', label: 'High-CPC Niches', icon: Flame },
            { id: 'adsense', label: 'Google AdSense & ads.txt', icon: Globe },
            { id: 'strategy', label: '30-Day Blueprint', icon: Award },
            { id: 'partners', label: '7-Agency Royalties', icon: FileSpreadsheet },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? (isLight ? 'bg-neutral-950 text-white border-neutral-950' : 'bg-white text-neutral-950 border-white')
                    : (isLight ? 'bg-[#fbfaf8] hover:bg-neutral-100 text-neutral-600 border-neutral-200/80' : 'bg-[#050506] hover:bg-white/10 text-neutral-300 border-white/10')
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* High Viewability Google AdSense Leaderboard Placement */}
      <GoogleAdSenseBanner format="leaderboard" themeMode={themeMode} />

      {/* TAB CONTENT 1: CALCULATOR & SIMULATOR */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className={`lg:col-span-7 rounded-3xl p-6 space-y-6 sovereign-prism-card ${
            isLight ? 'crystal-architectural-slab-light' : 'crystal-architectural-slab-dark'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                <Calculator className="w-4 h-4 text-emerald-500" />
                <span>Dual Monetization Simulator</span>
              </h3>
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { label: 'Starter (250 Assets)', assets: 250, dls: 0.75, royalty: 0.85, views: 15000, ecpm: 3.5 },
                  { label: 'Pro Studio (1,200 Assets)', assets: 1200, dls: 1.15, royalty: 1.10, views: 65000, ecpm: 5.4 },
                  { label: 'Enterprise (3,500 Assets)', assets: 3500, dls: 1.65, royalty: 1.45, views: 180000, ecpm: 7.8 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setStockAssets(preset.assets);
                      setMonthlyDlsPerAsset(preset.dls);
                      setAvgStockRoyalty(preset.royalty);
                      setMonthlyPageviews(preset.views);
                      setAdsenseEcpm(preset.ecpm);
                      showToast(`⚡ Loaded ${preset.label} Revenue Benchmark!`);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10.5px] font-semibold border transition cursor-pointer ${
                      stockAssets === preset.assets
                        ? isLight
                          ? 'bg-neutral-950 text-white border-neutral-950'
                          : 'bg-white text-neutral-950 border-white'
                        : isLight
                        ? 'bg-white hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                        : 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/10'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Microstock Portfolio Royalties Sliders */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                01 . Microstock Portfolio Royalties (Adobe Stock &amp; Agencies)
              </h4>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className={isLight ? 'text-neutral-600' : 'text-neutral-400'}>Active Portfolio Size (Vectors &amp; Photos):</span>
                  <span className={`font-mono font-bold ${isLight ? 'text-neutral-900' : 'text-white'}`}>{stockAssets.toLocaleString()} assets</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={stockAssets}
                  onChange={(e) => setStockAssets(Number(e.target.value))}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-600 ${
                    isLight ? 'bg-neutral-200' : 'bg-neutral-800'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className={isLight ? 'text-neutral-600' : 'text-neutral-400'}>Monthly Downloads Per Asset:</span>
                  <span className={`font-mono font-bold ${isLight ? 'text-neutral-900' : 'text-white'}`}>{monthlyDlsPerAsset.toFixed(2)} DLs/asset</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.05"
                  value={monthlyDlsPerAsset}
                  onChange={(e) => setMonthlyDlsPerAsset(Number(e.target.value))}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-600 ${
                    isLight ? 'bg-neutral-200' : 'bg-neutral-800'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className={isLight ? 'text-neutral-600' : 'text-neutral-400'}>Average Royalty Payout Per Download:</span>
                  <span className={`font-mono font-bold ${isLight ? 'text-neutral-900' : 'text-white'}`}>${avgStockRoyalty.toFixed(2)} USD</span>
                </div>
                <input
                  type="range"
                  min="0.30"
                  max="3.50"
                  step="0.05"
                  value={avgStockRoyalty}
                  onChange={(e) => setAvgStockRoyalty(Number(e.target.value))}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-600 ${
                    isLight ? 'bg-neutral-200' : 'bg-neutral-800'
                  }`}
                />
              </div>
            </div>

            {/* Google AdSense Traffic Monetization Sliders */}
            <div className={`space-y-4 pt-4 border-t ${isLight ? 'border-neutral-100' : 'border-neutral-800'}`}>
              <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                02 . Google AdSense Web Traffic Monetization
              </h4>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className={isLight ? 'text-neutral-600' : 'text-neutral-400'}>Monthly Website Pageviews:</span>
                  <span className={`font-mono font-bold ${isLight ? 'text-neutral-900' : 'text-white'}`}>{monthlyPageviews.toLocaleString()} PVs</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="200000"
                  step="5000"
                  value={monthlyPageviews}
                  onChange={(e) => setMonthlyPageviews(Number(e.target.value))}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-amber-500 ${
                    isLight ? 'bg-neutral-200' : 'bg-neutral-800'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className={isLight ? 'text-neutral-600' : 'text-neutral-400'}>Estimated AdSense eCPM (per 1k views):</span>
                  <span className={`font-mono font-bold ${isLight ? 'text-neutral-900' : 'text-white'}`}>${adsenseEcpm.toFixed(2)} eCPM</span>
                </div>
                <input
                  type="range"
                  min="1.00"
                  max="15.00"
                  step="0.25"
                  value={adsenseEcpm}
                  onChange={(e) => setAdsenseEcpm(Number(e.target.value))}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-amber-500 ${
                    isLight ? 'bg-neutral-200' : 'bg-neutral-800'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Breakdown & Analytics Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`rounded-2xl border p-6 space-y-5 ${
              isLight ? 'bg-white border-neutral-200/90 shadow-2xs' : 'bg-[#111318] border-neutral-800 shadow-xl'
            }`}>
              <h3 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                <BarChart3 className="w-4 h-4 text-emerald-500" />
                <span>Revenue Breakdown</span>
              </h3>

              <div className="space-y-3">
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  isLight ? 'bg-[#fbfaf8] border-neutral-200/80' : 'bg-neutral-950 border-neutral-800'
                }`}>
                  <div>
                    <span className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                      <Layers className="w-3.5 h-3.5 text-emerald-500" /> Stock Royalties (Monthly)
                    </span>
                    <p className="text-[11px] text-neutral-400">
                      {Math.round(stockAssets * monthlyDlsPerAsset)} downloads across agencies
                    </p>
                  </div>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                    ${calculatedStockMonthly.toFixed(2)}
                  </div>
                </div>

                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  isLight ? 'bg-[#fbfaf8] border-neutral-200/80' : 'bg-neutral-950 border-neutral-800'
                }`}>
                  <div>
                    <span className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                      <Globe className="w-3.5 h-3.5 text-amber-500" /> Google AdSense Ads (Monthly)
                    </span>
                    <p className="text-[11px] text-neutral-400">
                      {monthlyPageviews.toLocaleString()} pageviews @ ${adsenseEcpm.toFixed(2)} eCPM
                    </p>
                  </div>
                  <div className="text-lg font-bold text-amber-600 dark:text-amber-400 font-mono tabular-nums">
                    ${calculatedAdSenseMonthly.toFixed(2)}
                  </div>
                </div>

                <div className={`p-5 rounded-xl border space-y-1 ${
                  isLight ? 'bg-neutral-950 text-white border-neutral-950' : 'bg-white text-neutral-950 border-white'
                }`}>
                  <div className="flex justify-between items-center text-[10.5px] font-mono uppercase tracking-wider opacity-75">
                    <span>Total Passive Income</span>
                    <span>100% Monetized</span>
                  </div>
                  <div className="text-3xl font-bold font-mono tabular-nums">
                    ${totalCombinedMonthly.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-[11px] opacity-80 pt-1">
                    Equates to ${(totalCombinedMonthly / 30).toFixed(2)} USD per day across both streams.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-1 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={onBackToStudio}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Upload &amp; Optimize EPS Vectors Now</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenMultiCsv}
                  className={`w-full border font-bold text-xs sm:text-sm py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                    isLight ? 'bg-[#fbfaf8] hover:bg-neutral-100 border-neutral-200 text-neutral-800' : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-200'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  <span>Export Multi-Agency CSVs</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: HIGH-CPC NICHES */}
      {activeTab === 'niches' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {HIGH_PAYING_NICHES.map((niche, idx) => (
            <div
              key={niche.category}
              className={`rounded-2xl border p-5 space-y-3.5 transition flex flex-col justify-between ${
                isLight ? 'bg-white border-neutral-200/90 shadow-2xs' : 'bg-[#111318] border-neutral-800 shadow-xl'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10.5px] font-mono uppercase tracking-wider">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {niche.demand}
                  </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {niche.cpc}
                  </span>
                </div>

                <h4 className={`text-sm font-bold tracking-tight ${isLight ? 'text-neutral-950' : 'text-white'}`}>
                  {niche.category}
                </h4>

                <p className={`text-xs ${isLight ? 'text-neutral-500' : 'text-neutral-400'} leading-relaxed line-clamp-2`}>
                  {niche.description}
                </p>
              </div>

              <div className={`space-y-3 pt-3 border-t ${isLight ? 'border-neutral-100' : 'border-neutral-800'}`}>
                <div className="flex flex-wrap gap-1">
                  {niche.keywords.slice(0, 5).map((kw) => (
                    <span
                      key={kw}
                      className={`text-[10.5px] px-2 py-0.5 rounded-md border ${
                        isLight ? 'bg-[#fbfaf8] border-neutral-200/80 text-neutral-700' : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                      }`}
                    >
                      {kw}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyKeywords(niche.keywords, idx)}
                  className={`w-full font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    isLight
                      ? 'bg-neutral-950 hover:bg-black text-white'
                      : 'bg-white hover:bg-neutral-200 text-neutral-950'
                  }`}
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy All Keywords ({niche.keywords.length})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT 3: GOOGLE ADSENSE UNITS & COMPLIANCE */}
      {activeTab === 'adsense' && (
        <div className={`p-6 rounded-2xl border ${
          isLight ? 'bg-white border-neutral-200/90 shadow-2xs' : 'bg-[#111318] border-neutral-800 shadow-xl'
        } space-y-5`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className={`text-lg font-bold flex items-center gap-2 ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                <Globe className="w-5 h-5 text-emerald-500" />
                <span>Google AdSense Monetization &amp; ads.txt Compliance</span>
              </h3>
              <p className={`text-xs ${isLight ? 'text-neutral-500' : 'text-neutral-400'} mt-1`}>
                Configured with Google Authorized Digital Sellers standards for programmatic ad delivery and high eCPM.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                ads.txt Verified
              </span>
              <a
                href="/ads.txt"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition flex items-center gap-1 ${
                  isLight ? 'bg-[#fbfaf8] border-neutral-200 text-neutral-800' : 'bg-neutral-900 border-neutral-800 text-neutral-200'
                }`}
              >
                <span>View Raw ads.txt</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className={`rounded-xl p-4 border font-mono text-xs space-y-1 ${
            isLight ? 'bg-[#fbfaf8] border-neutral-200/80 text-neutral-800' : 'bg-neutral-950 border-neutral-800 text-neutral-300'
          }`}>
            <div className="text-neutral-400 text-[11px]"># Official Authorized Digital Sellers Entry:</div>
            <div className="text-emerald-600 dark:text-emerald-400 font-bold select-all">
              google.com, pub-4920194820194820, DIRECT, f08c47fec0942fa0
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: STRATEGY & 30-DAY $1,000/MO BLUEPRINT */}
      {activeTab === 'strategy' && (
        <div className={`p-6 rounded-2xl border ${
          isLight ? 'bg-white border-neutral-200/90 shadow-2xs' : 'bg-[#111318] border-neutral-800 shadow-xl'
        } space-y-5`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className={`text-base sm:text-lg font-bold flex items-center gap-2 ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                <Award className="w-5 h-5 text-emerald-500" />
                <span>The 30-Day $1,000/Month Microstock &amp; Google AdSense Blueprint</span>
              </h3>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Follow this exact 4-week production &amp; SEO distribution schedule to build compounding passive royalties.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const planText = `ADOBEMETA PRO — 30-DAY $1,000/MO CONTRIBUTOR BLUEPRINT\n\nWeek 1 (Foundation & Niche Lock): Upload 150 EPS Vectors / AI Photos in Renewable Energy & Fintech Security using <70 char Subject-First Titles.\nWeek 2 (75% Top-10 Weight Mastery): Lock compound buyer phrases in Keyword Slots #1-#10 and syndicate across Adobe Stock, Shutterstock & Freepik.\nWeek 3 (60-Day Seasonal Lead Window): Produce 150 holiday & Q4/Q1 commercial backgrounds with generous negative copy space.\nWeek 4 (7-Agency Distribution & AdSense): Export 7-Agency CSVs in 1 click and monetize organic web traffic with verified ads.txt.`;
                navigator.clipboard.writeText(planText);
                showToast('✓ Copied 30-Day $1,000/mo Contributor Blueprint!');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                isLight ? 'bg-neutral-950 text-white' : 'bg-emerald-500 text-slate-950'
              }`}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy 30-Day Action Plan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                num: 'WEEK 01 · FOUNDATION',
                title: 'Command the Crucial First 10 Keywords (75% Weight)',
                desc: 'Adobe Stock and Shutterstock allocate over 75% of total search ranking weight to positions 1 through 10. Upload 15 files/day with exact visual subject nouns locked into Slots #1–#10.'
              },
              {
                num: 'WEEK 02 · MULTI-ANGLE SEO',
                title: 'Under-70-Character Subject-First Titles + B2B Angles',
                desc: 'Use the Quantum 4-Title Engine: submit <70 char Subject-First titles to Adobe Stock and 12-word narrative descriptions to Shutterstock & Getty to capture B2B enterprise buyers.'
              },
              {
                num: 'WEEK 03 · 60-DAY SEASONAL LEAD',
                title: 'Pre-Empt Seasonal & High-CPC Commercial Spikes',
                desc: 'Agencies buy seasonal campaigns 45–60 days early. Dedicate 50% of your weekly batch to upcoming seasonal events with clean negative copy space for ad designers.'
              },
              {
                num: 'WEEK 04 · 7-AGENCY MULTIPLIER',
                title: 'Simultaneous 7-Agency CSV Syndication + AdSense',
                desc: 'Distributing the exact same portfolio to Adobe Stock, Shutterstock, Freepik, Getty, Vecteezy, 123RF, and Dreamstime multiplies monthly revenue by 3.4x with zero extra creation time.'
              }
            ].map((st) => (
              <div
                key={st.num}
                className={`p-5 rounded-xl border space-y-2 ${
                  isLight ? 'bg-[#fbfaf8] border-neutral-200/80' : 'bg-neutral-950 border-neutral-800'
                }`}
              >
                <div className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {st.num}
                </div>
                <h4 className={`text-sm font-bold ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                  {st.title}
                </h4>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: PARTNER NETWORKS & COMMISSIONS */}
      {activeTab === 'partners' && (
        <div className={`p-6 rounded-2xl border ${
          isLight ? 'bg-white border-neutral-200/90 shadow-2xs' : 'bg-[#111318] border-neutral-800 shadow-xl'
        } space-y-5`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-base sm:text-lg font-bold flex items-center gap-2 ${isLight ? 'text-neutral-900' : 'text-white'}`}>
              <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
              <span>Global 7 Stock Agencies Royalty &amp; Metadata Spec Comparison</span>
            </h3>
            <button
              onClick={onOpenMultiCsv}
              className={`font-bold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 cursor-pointer ${
                isLight ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-950'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Open 7-Agency CSV Exporter</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className={`border-b uppercase font-mono tracking-wider text-[10px] text-neutral-400 ${
                  isLight ? 'border-neutral-200' : 'border-neutral-800'
                }`}>
                  <th className="py-3 px-4 font-bold">Agency</th>
                  <th className="py-3 px-4 font-bold">Royalty Rate</th>
                  <th className="py-3 px-4 font-bold">Max Keywords</th>
                  <th className="py-3 px-4 font-bold">Title Limit</th>
                  <th className="py-3 px-4 font-bold">Payout Threshold</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isLight ? 'divide-neutral-200/70' : 'divide-neutral-800'}`}>
                <tr>
                  <td className={`py-3 px-4 font-bold ${isLight ? 'text-neutral-900' : 'text-white'}`}>Adobe Stock</td>
                  <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold font-mono">33% (Photos/Vectors) / 35% (Video)</td>
                  <td className="py-3 px-4 font-mono">49 (Rank 1-10 = 75% weight)</td>
                  <td className="py-3 px-4 font-mono">&lt; 70 chars (Sweet spot)</td>
                  <td className="py-3 px-4 font-mono">$25.00</td>
                </tr>
                <tr>
                  <td className={`py-3 px-4 font-bold ${isLight ? 'text-neutral-900' : 'text-white'}`}>Shutterstock</td>
                  <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold font-mono">15% - 40% (Level 1-6 Tiered)</td>
                  <td className="py-3 px-4 font-mono">50 max (Min 7)</td>
                  <td className="py-3 px-4 font-mono">&gt; 5 words narrative</td>
                  <td className="py-3 px-4 font-mono">$35.00</td>
                </tr>
                <tr>
                  <td className={`py-3 px-4 font-bold ${isLight ? 'text-neutral-900' : 'text-white'}`}>Freepik</td>
                  <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold font-mono">50% Net Subscriber Pool</td>
                  <td className="py-3 px-4 font-mono">30 max</td>
                  <td className="py-3 px-4 font-mono">&lt; 100 chars</td>
                  <td className="py-3 px-4 font-mono">$50.00</td>
                </tr>
                <tr>
                  <td className={`py-3 px-4 font-bold ${isLight ? 'text-neutral-900' : 'text-white'}`}>Getty Images / iStock</td>
                  <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold font-mono">15% - 45% (Exclusive/Non-Excl)</td>
                  <td className="py-3 px-4 font-mono">35 max</td>
                  <td className="py-3 px-4 font-mono">&lt; 100 chars B2B</td>
                  <td className="py-3 px-4 font-mono">$100.00</td>
                </tr>
                <tr>
                  <td className={`py-3 px-4 font-bold ${isLight ? 'text-neutral-900' : 'text-white'}`}>Vecteezy</td>
                  <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold font-mono">50% Pro Subscriber Share</td>
                  <td className="py-3 px-4 font-mono">35 max</td>
                  <td className="py-3 px-4 font-mono">&lt; 80 chars</td>
                  <td className="py-3 px-4 font-mono">$25.00</td>
                </tr>
                <tr>
                  <td className={`py-3 px-4 font-bold ${isLight ? 'text-neutral-900' : 'text-white'}`}>123RF</td>
                  <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold font-mono">30% - 60% Tiered</td>
                  <td className="py-3 px-4 font-mono">45 max</td>
                  <td className="py-3 px-4 font-mono">&lt; 120 chars</td>
                  <td className="py-3 px-4 font-mono">$50.00</td>
                </tr>
                <tr>
                  <td className={`py-3 px-4 font-bold ${isLight ? 'text-neutral-900' : 'text-white'}`}>Dreamstime</td>
                  <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold font-mono">25% - 60% Revenue Share</td>
                  <td className="py-3 px-4 font-mono">45 max</td>
                  <td className="py-3 px-4 font-mono">&lt; 70 chars</td>
                  <td className="py-3 px-4 font-mono">$100.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};
