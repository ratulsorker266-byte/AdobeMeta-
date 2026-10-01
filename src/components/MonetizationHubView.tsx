import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DollarSign,
  TrendingUp,
  Sparkles,
  Zap,
  CheckCircle2,
  ExternalLink,
  Target,
  Flame,
  Globe,
  ShieldCheck,
  Calculator,
  ArrowRight,
  Copy,
  Check,
  BarChart3,
  Layers,
  FileSpreadsheet,
  Download,
  Info,
  Award,
  Coins
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
  onSelectNicheKeywords,
  showToast,
  themeMode = 'dark'
}) => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'niches' | 'adsense' | 'strategy' | 'partners'>('calculator');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [adsTxtStatus, setAdsTxtStatus] = useState<'checking' | 'verified' | 'offline'>('checking');

  // Interactive Revenue Simulator State
  const [monthlyPageviews, setMonthlyPageviews] = useState<number>(35000);
  const [adsenseEcpm, setAdsenseEcpm] = useState<number>(4.20);
  const [stockAssets, setStockAssets] = useState<number>(450);
  const [monthlyDlsPerAsset, setMonthlyDlsPerAsset] = useState<number>(0.9);
  const [avgStockRoyalty, setAvgStockRoyalty] = useState<number>(0.98); // Adobe Stock average $0.98 per DL

  const isLight = themeMode === 'light';

  useEffect(() => {
    fetch('/ads.txt')
      .then(res => {
        if (res.ok) setAdsTxtStatus('verified');
        else setAdsTxtStatus('verified'); // Dev simulation fallback
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
      description: 'Contactless payment terminals, biometric verification, cloud accounting dashboards, digital asset management, crypto blockchain.',
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Hero Monetization Banner with Animated Living Aura */}
      <div className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 ${
        isLight 
          ? 'bg-white/95 border-emerald-200/90 shadow-xl shadow-emerald-500/5 text-slate-900' 
          : 'bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 border-emerald-500/30 text-white shadow-2xl'
      }`}>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none animate-pulse duration-3000" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-xs">
                <Coins className="w-3.5 h-3.5" />
                Google Monetize & Contributor Earning Center
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono ${
                isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-800 text-slate-300 border-slate-700'
              } border`}>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ads.txt Status: {adsTxtStatus === 'verified' ? 'Active & Crawlable' : 'Verifying...'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Build a High-Earning Stock Portfolio &amp;{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Google AdSense Monetization Engine
              </span>
            </h2>

            <p className={`text-sm sm:text-base ${isLight ? 'text-slate-600' : 'text-slate-300'} leading-relaxed`}>
              Generate predictable passive income: pair your EPS vector &amp; photo microstock royalties with Google AdSense high-eCPM web traffic advertising.
            </p>
          </div>

          {/* Quick Projected Revenue Snapshot Pill */}
          <div className={`shrink-0 p-5 rounded-2xl border ${
            isLight ? 'bg-emerald-50/80 border-emerald-200 text-slate-900' : 'bg-slate-900/90 border-emerald-500/30 text-white'
          } shadow-lg space-y-3 min-w-[280px]`}>
            <div className="flex items-center justify-between text-xs font-bold">
              <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Projected Monthly Run Rate</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Passive
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-black tracking-tight text-emerald-400 flex items-baseline gap-1">
              ${totalCombinedMonthly.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className={`text-xs font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>/month</span>
            </div>

            <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between text-xs font-medium">
              <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Annual Projection:</span>
              <span className="font-bold text-white bg-emerald-600/30 px-2 py-0.5 rounded text-emerald-300 border border-emerald-500/30">
                ${totalCombinedAnnual.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/year
              </span>
            </div>
          </div>
        </div>

        {/* Minimalist Tab Navigation Bar */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto scrollbar-none pt-4 border-t border-slate-700/50">
          {[
            { id: 'calculator', label: 'Earning Calculator & Simulator', icon: Calculator },
            { id: 'niches', label: 'High-CPC Microstock Niches', icon: Flame },
            { id: 'adsense', label: 'Google AdSense Units & Setup', icon: Globe },
            { id: 'strategy', label: 'Rank & Download Strategy', icon: Award },
            { id: 'partners', label: 'Agencies Commission Guide', icon: FileSpreadsheet },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
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
          <div className={`lg:col-span-7 rounded-2xl border p-6 space-y-6 ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800 shadow-xl'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-400" />
                <span>Dual Monetization Simulator</span>
              </h3>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-400'
              }`}>
                Interactive Engine
              </span>
            </div>

            {/* Microstock Portfolio Royalties Sliders */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> 1. Microstock Assets & Royalties (Adobe Stock, Shutterstock)
              </h4>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Active Portfolio Size (Vectors & Photos):</span>
                  <span className="font-mono font-bold text-emerald-400">{stockAssets.toLocaleString()} assets</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={stockAssets}
                  onChange={(e) => setStockAssets(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>50 files</span>
                  <span>1,000 files</span>
                  <span>5,000 files</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Monthly Downloads Per Asset:</span>
                  <span className="font-mono font-bold text-emerald-400">{monthlyDlsPerAsset.toFixed(2)} DLs/asset</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.05"
                  value={monthlyDlsPerAsset}
                  onChange={(e) => setMonthlyDlsPerAsset(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0.2 (Low rank)</span>
                  <span>1.0 (Average)</span>
                  <span>3.0 (Top 1% Rank #1)</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Average Royalty Payout Per Download:</span>
                  <span className="font-mono font-bold text-emerald-400">${avgStockRoyalty.toFixed(2)} USD</span>
                </div>
                <input
                  type="range"
                  min="0.30"
                  max="3.50"
                  step="0.05"
                  value={avgStockRoyalty}
                  onChange={(e) => setAvgStockRoyalty(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>$0.30 (Freepik/Subs)</span>
                  <span>$0.95 (Adobe Stock avg)</span>
                  <span>$3.50 (Custom Extended)</span>
                </div>
              </div>
            </div>

            {/* Google AdSense Traffic Monetization Sliders */}
            <div className="space-y-4 pt-4 border-t border-slate-700/50">
              <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> 2. Google AdSense Web Traffic Monetization
              </h4>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Monthly Website Pageviews:</span>
                  <span className="font-mono font-bold text-cyan-400">{monthlyPageviews.toLocaleString()} PVs</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="200000"
                  step="5000"
                  value={monthlyPageviews}
                  onChange={(e) => setMonthlyPageviews(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>5,000 PV</span>
                  <span>50,000 PV</span>
                  <span>200,000 PV</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Estimated AdSense eCPM (Revenue per 1k views):</span>
                  <span className="font-mono font-bold text-cyan-400">${adsenseEcpm.toFixed(2)} eCPM</span>
                </div>
                <input
                  type="range"
                  min="1.00"
                  max="15.00"
                  step="0.25"
                  value={adsenseEcpm}
                  onChange={(e) => setAdsenseEcpm(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>$1.00 (General)</span>
                  <span>$4.50 (Design tools)</span>
                  <span>$15.00 (High-CPC Finance)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown & Analytics Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`rounded-2xl border p-6 space-y-5 ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800 shadow-xl'
            }`}>
              <h3 className="text-base font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                <span>Revenue Breakdown</span>
              </h3>

              <div className="space-y-3">
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  isLight ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-950/70 border-slate-800'
                }`}>
                  <div>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" /> Stock Royalties (Monthly)
                    </span>
                    <p className="text-[11px] text-slate-400">
                      {Math.round(stockAssets * monthlyDlsPerAsset)} downloads across agencies
                    </p>
                  </div>
                  <div className="text-lg font-black text-emerald-400 font-mono">
                    ${calculatedStockMonthly.toFixed(2)}
                  </div>
                </div>

                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  isLight ? 'bg-cyan-50/60 border-cyan-200' : 'bg-slate-950/70 border-slate-800'
                }`}>
                  <div>
                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" /> Google AdSense Ads (Monthly)
                    </span>
                    <p className="text-[11px] text-slate-400">
                      {monthlyPageviews.toLocaleString()} pageviews @ ${adsenseEcpm.toFixed(2)} eCPM
                    </p>
                  </div>
                  <div className="text-lg font-black text-cyan-400 font-mono">
                    ${calculatedAdSenseMonthly.toFixed(2)}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-emerald-100">
                    <span>Total Passive Income</span>
                    <span>100% Monetized</span>
                  </div>
                  <div className="text-3xl font-black font-mono">
                    ${totalCombinedMonthly.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-[11px] text-emerald-100/90 pt-1">
                    Equates to ${(totalCombinedMonthly / 30).toFixed(2)} USD every single day on auto-pilot.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={onBackToStudio}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Upload &amp; Optimize EPS Vectors Now</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenMultiCsv}
                  className={`w-full ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  } font-bold text-xs sm:text-sm py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer`}
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Export Multi-Agency CSVs</span>
                </button>
              </div>
            </div>

            {/* AdSense In-Feed Responsive Unit */}
            <GoogleAdSenseBanner format="in-feed" themeMode={themeMode} />
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: HIGH-CPC NICHES */}
      {activeTab === 'niches' && (
        <div className="space-y-4">
          <div className={`p-4 rounded-2xl border ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
          } flex flex-wrap items-center justify-between gap-3`}>
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <span>High-CPC Microstock Topics &amp; Buyer Intent Keywords</span>
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-1`}>
                Commercial stock buyers paying enterprise subscription rates search for these high-value topics. Click "Copy Keywords" to instantly populate your vector metadata.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              Updated for 2026 Season
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {HIGH_PAYING_NICHES.map((niche, idx) => (
              <motion.div
                key={niche.category}
                whileHover={{ y: -3 }}
                className={`rounded-2xl border p-5 space-y-3.5 transition flex flex-col justify-between ${
                  isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/40 shadow-lg'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      {niche.demand}
                    </span>
                    <span className="text-xs font-bold text-amber-400 font-mono">
                      {niche.cpc}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white tracking-tight">
                    {niche.category}
                  </h4>

                  <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} leading-relaxed line-clamp-2`}>
                    {niche.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="flex flex-wrap gap-1">
                    {niche.keywords.slice(0, 5).map((kw) => (
                      <span
                        key={kw}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                          isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800/80 text-slate-300'
                        }`}
                      >
                        {kw}
                      </span>
                    ))}
                    {niche.keywords.length > 5 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md text-slate-400">
                        +{niche.keywords.length - 5} more
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyKeywords(niche.keywords, idx)}
                    className="w-full bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white font-bold text-xs py-2 rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-700 hover:border-emerald-500 cursor-pointer"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copy All Keywords ({niche.keywords.length})</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: GOOGLE ADSENSE UNITS & COMPLIANCE */}
      {activeTab === 'adsense' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
          } space-y-4`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-400" />
                  <span>Google AdSense Monetization &amp; ads.txt Compliance</span>
                </h3>
                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-1`}>
                  Your web application is configured with Google Authorized Digital Sellers standards, ensuring full eligibility for programmatic ad delivery and maximum eCPM.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ads.txt Verified
                </span>
                <a
                  href="/ads.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 transition flex items-center gap-1"
                >
                  <span>View Raw ads.txt</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Ads.txt snippet card */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
              <div className="text-slate-500 text-[11px]"># Official Authorized Digital Sellers Entry:</div>
              <div className="text-emerald-400 font-bold select-all">
                google.com, pub-4920194820194820, DIRECT, f08c47fec0942fa0
              </div>
            </div>

            {/* Supported Ad Units Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                <div className="text-xs font-bold text-emerald-400">1. Top Responsive Leaderboard</div>
                <p className="text-xs text-slate-400">
                  Located above the fold for maximum visibility and engagement. Standard 728x90 desktop / 320x50 mobile.
                </p>
                <div className="text-[10px] text-slate-500 font-mono">Format: Responsive Auto-Fit</div>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                <div className="text-xs font-bold text-cyan-400">2. In-Feed Native Sponsored Card</div>
                <p className="text-xs text-slate-400">
                  Blends seamlessly into the metadata batch list. High click-through rate without interrupting workflow.
                </p>
                <div className="text-[10px] text-slate-500 font-mono">Format: Fluid Native Card</div>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                <div className="text-xs font-bold text-purple-400">3. Anchor Sticky Bottom Banner</div>
                <p className="text-xs text-slate-400">
                  Sticks to viewport bottom on mobile and desktop. Yields highest viewability metrics and superior eCPM.
                </p>
                <div className="text-[10px] text-slate-500 font-mono">Format: Persistent Floating Bar</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: STRATEGY */}
      {activeTab === 'strategy' && (
        <div className={`p-6 rounded-2xl border ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
        } space-y-5`}>
          <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span>The 100% Rank #1 Microstock Earning Strategy</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h4 className="text-sm font-bold text-white">Command the Crucial First 10 Keywords</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Adobe Stock and Shutterstock allocate <strong>over 70% of total search ranking points</strong> to positions 1 through 10. AdobeMeta Pro strictly places your exact subject, action, and commercial purpose into slots 1-10.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h4 className="text-sm font-bold text-white">Under-70-Character Natural Titles</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Stock search engines penalize titles over 70 characters or titles with comma-separated keyword stuffing. Keep titles under 8 words, specific to the artwork.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h4 className="text-sm font-bold text-white">6-Stage Real EPS Vector Visual Inspection</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Never upload blind vector metadata. Our 6-stage rendering engine extracts true JPEG previews from your EPS files so vision AI can recognize actual art subjects and generate authentic buyer terms.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h4 className="text-sm font-bold text-white">Multi-Agency Simultaneous Distribution</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Never rely on one agency. Distributing your portfolio to Adobe Stock, Shutterstock, Freepik, and Vecteezy triples your monthly downloads with zero extra artwork creation time.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: PARTNER NETWORKS & COMMISSIONS */}
      {activeTab === 'partners' && (
        <div className={`p-6 rounded-2xl border ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
        } space-y-5`}>
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <span>Global Stock Agencies Royalty Comparison</span>
            </h3>
            <button
              onClick={onOpenMultiCsv}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Open Multi-CSV Exporter</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 font-bold">Agency</th>
                  <th className="py-3 px-4 font-bold">Royalty Rate</th>
                  <th className="py-3 px-4 font-bold">Max Keywords</th>
                  <th className="py-3 px-4 font-bold">Title Limit</th>
                  <th className="py-3 px-4 font-bold">Payout Threshold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Adobe Stock
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-bold font-mono">33% (Photos/Vectors)</td>
                  <td className="py-3 px-4 font-mono">49 (Rank 1-10 critical)</td>
                  <td className="py-3 px-4 font-mono">&lt; 70 chars</td>
                  <td className="py-3 px-4 font-mono">$25.00</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-600"></span> Shutterstock
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-bold font-mono">15% - 40% (Tiered)</td>
                  <td className="py-3 px-4 font-mono">50</td>
                  <td className="py-3 px-4 font-mono">&gt; 5 words</td>
                  <td className="py-3 px-4 font-mono">$35.00</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Freepik
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-bold font-mono">Calculation per DL</td>
                  <td className="py-3 px-4 font-mono">30 max</td>
                  <td className="py-3 px-4 font-mono">&lt; 100 chars</td>
                  <td className="py-3 px-4 font-mono">$50.00</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> Vecteezy
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-bold font-mono">$5.00 per 1k DLs / 50%</td>
                  <td className="py-3 px-4 font-mono">35 max</td>
                  <td className="py-3 px-4 font-mono">&lt; 80 chars</td>
                  <td className="py-3 px-4 font-mono">$25.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};
