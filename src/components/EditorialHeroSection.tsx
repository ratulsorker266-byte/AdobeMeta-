import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowUpRight,
  Copy, 
  Check, 
  Mail, 
  Sun, 
  Moon, 
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Lock,
  Droplets,
  Terminal,
  ShieldCheck,
  Globe,
  SlidersHorizontal
} from 'lucide-react';
import { AdobeMetaProLogo } from './AdobeMetaProLogo';
import store01MetadataEps from '../assets/images/store01_metadata_eps_1791118931620.jpg';
import storeCalendarHub from '../assets/images/store_calendar_hub_1791105379723.jpg';
import storePromptStudio from '../assets/images/store_prompt_studio_1791105394619.jpg';
import storeMonetizeVault from '../assets/images/store_monetize_vault_1791105408515.jpg';
import store05Rank1Seo from '../assets/images/store05_rank1_seo_1791118951820.jpg';
import store06MarketTrends from '../assets/images/store06_market_trends_1791118972607.jpg';
import storeCompetitorSpy from '../assets/images/store_competitor_spy_1791105421040.jpg';
import store08MultiCsvHub from '../assets/images/store08_multi_csv_hub_1791118986226.jpg';

interface EditorialHeroProps {
  onStartGenerating: () => void;
  onQuickDropFiles?: (files: File[]) => void;
  onWatchDemo: () => void;
  onOpenPricing?: () => void;
  onOpenResources?: () => void;
  onOpenAbout?: () => void;
  onOpenFeatures?: () => void;
  onOpenLogin: () => void;
  onToggleTheme: () => void;
  themeMode: 'light' | 'dark';
  user: any;
  onNavigateView: (view: string) => void;
  onOpenMultiCsv?: () => void;
  onOpenToolsHub?: () => void;
  onOpenChat?: () => void;
  currentView?: string;
  itemsCount?: number;
  isWaterWorldActive?: boolean;
  onToggleWaterWorld?: () => void;
  onOpenBlackOps?: () => void;
  onOpenProToolkit?: (tab?: 'presubmit' | 'rejection' | 'aidisclosure' | 'tracker' | 'embed' | 'kwscore') => void;
  isLiteMode?: boolean;
  onToggleLiteMode?: () => void;
  uiLang?: 'en' | 'bn';
  onToggleLang?: () => void;
}

export interface BoutiqueStoreItem {
  id: string;
  storeNumber: string;
  title: string;
  category: string;
  department: 'all' | 'metadata' | 'creative' | 'monetize';
  image: string;
  badge: string;
  statLabel: string;
  description: string;
  features: string[];
  ctaText: string;
  actionType: 'view' | 'modal_csv' | 'modal_tools';
  targetView?: string;
  sampleTitle: string;
  sampleKeywords: string[];
}

export const EditorialHeroSection: React.FC<EditorialHeroProps> = ({
  onStartGenerating,
  onQuickDropFiles,
  onWatchDemo,
  onOpenAbout,
  onToggleTheme,
  themeMode,
  onNavigateView,
  onOpenMultiCsv,
  onOpenToolsHub,
  onOpenChat,
  itemsCount = 0,
  isWaterWorldActive = true,
  onToggleWaterWorld,
  onOpenBlackOps,
  onOpenProToolkit,
  isLiteMode = false,
  onToggleLiteMode,
  uiLang = 'en',
  onToggleLang
}) => {
  const [activeDepartment, setActiveDepartment] = useState<'all' | 'metadata' | 'creative' | 'monetize'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewStoreIdx, setPreviewStoreIdx] = useState<number>(0);
  const [isHoveringSpecimen, setIsHoveringSpecimen] = useState<boolean>(false);
  const [showHeaderControlsMenu, setShowHeaderControlsMenu] = useState<boolean>(false);
  const [isHeroDragging, setIsHeroDragging] = useState<boolean>(false);
  const [activeSkin, setActiveSkin] = useState<'obsidian' | 'matrix' | 'sapphire' | 'ivory'>(() => {
    try {
      const saved = localStorage.getItem('adobemeta_luxury_skin') as any;
      if (saved === 'obsidian' || saved === 'matrix' || saved === 'sapphire' || saved === 'ivory') {
        return saved;
      }
    } catch {}
    return themeMode === 'light' ? 'ivory' : 'obsidian';
  });

  const isLight = themeMode === 'light';
  const isBn = false;

  useEffect(() => {
    const root = document.documentElement;
    if (isLight) {
      root.removeAttribute('data-skin');
    } else {
      const skinToApply = activeSkin === 'ivory' ? 'obsidian' : activeSkin;
      root.setAttribute('data-skin', skinToApply);
    }
  }, [activeSkin, isLight]);

  const handleSelectSkin = (skin: 'obsidian' | 'matrix' | 'sapphire' | 'ivory') => {
    setActiveSkin(skin);
    try {
      localStorage.setItem('adobemeta_luxury_skin', skin);
    } catch {}
    if (skin === 'ivory' && !isLight) {
      onToggleTheme();
    } else if (skin !== 'ivory' && isLight) {
      onToggleTheme();
    }
  };

  // 8 Specialized Creative Modules in the Enterprise Workspace Directory
  const marketStores: BoutiqueStoreItem[] = [
    {
      id: 'store-metadata',
      storeNumber: '01 · CORE ENGINE',
      title: 'Metadata & EPS Vector Studio',
      category: 'METADATA · GHOSTSCRIPT EPS · 49 WEIGHTED TAGS',
      department: 'metadata',
      image: store01MetadataEps,
      badge: 'CORE STUDIO',
      statLabel: `${itemsCount > 0 ? `${itemsCount} Queued` : '49-Tag Compliance'}`,
      description: 'Generate vision-verified titles and 49 rank-ordered keywords with native EPS vector rendering and direct IPTC/XMP embedding.',
      features: ['EPS Vector Preview', '49 Weighted Tags', 'Direct IPTC & XMP'],
      ctaText: 'Open Studio',
      actionType: 'view',
      targetView: 'upload',
      sampleTitle: 'Isometric Cloud Security Server Architecture Vector Illustration',
      sampleKeywords: ['isometric cloud security', 'cyber infrastructure', 'enterprise server', 'digital transformation', 'data protection', 'network firewall', 'cloud computing', 'editable vector', 'eps 10', 'commercial illustration']
    },
    {
      id: 'store-calendar',
      storeNumber: '02 · PLANNING',
      title: 'Seasonal Demand Calendar',
      category: 'CALENDAR · 12-MONTH EVENTS · BUYER TIMELINE',
      department: 'creative',
      image: storeCalendarHub,
      badge: 'DEMAND FORECAST',
      statLabel: '12-Month Lead Time',
      description: 'Plan commercial production around global seasonal events and agency purchasing cycles 60 days ahead of peak buyer demand.',
      features: ['60-Day Lead Window', 'Holiday Niches', 'Prompt Sync'],
      ctaText: 'Open Calendar',
      actionType: 'view',
      targetView: 'calendar',
      sampleTitle: 'Black Friday E-Commerce Retail Promotion Banner With Copy Space',
      sampleKeywords: ['autumn harvest festival', 'black friday sale banner', 'cyber monday retail', 'new year celebration', 'corporate annual report', 'holiday shopping', 'seasonal promotion', 'retail discount']
    },
    {
      id: 'store-prompts',
      storeNumber: '03 · SYNTHESIS',
      title: 'Commercial Prompt Lab',
      category: 'PROMPT MAKER · MIDJOURNEY V6 · FIREFLY 3',
      department: 'creative',
      image: storePromptStudio,
      badge: 'PROMPT STUDIO',
      statLabel: 'Agency Compliant',
      description: 'Build structured commercial stock photography, 3D render, and clean vector prompts formatted for Midjourney, Firefly, and Flux.',
      features: ['Zero-Artifact Formula', 'Copy-Space Framing', 'Midjourney & Firefly'],
      ctaText: 'Open Prompt Lab',
      actionType: 'view',
      targetView: 'prompts',
      sampleTitle: 'Minimalist Ceramic Product Podium In Warm Sunlight With Copy Space',
      sampleKeywords: ['minimalist studio lighting', 'isolated on white', 'commercial copy space', '8k octane render', 'flat vector illustration', 'product podium', 'architectural shadows', 'clean background']
    },
    {
      id: 'store-monetize',
      storeNumber: '04 · ANALYTICS',
      title: 'Royalty & AdSense Analytics',
      category: 'MONETIZATION · ADSENSE HUB · ROYALTY SIMULATOR',
      department: 'monetize',
      image: storeMonetizeVault,
      badge: 'REVENUE MODEL',
      statLabel: 'Portfolio Yield',
      description: 'Forecast microstock download royalties alongside Google AdSense display revenue and generate compliant ads.txt configurations.',
      features: ['AdSense Simulator', 'Official ads.txt', 'High-CPC Keywords'],
      ctaText: 'Open Analytics',
      actionType: 'view',
      targetView: 'monetize',
      sampleTitle: 'Fintech Wealth Management Dashboard And Biometric Banking Security',
      sampleKeywords: ['fintech banking security', 'renewable solar grid', 'enterprise cloud ai', 'biotech laboratory', 'wealth management', 'financial analytics', 'passive income', 'digital investment']
    },
    {
      id: 'store-seo-rank',
      storeNumber: '05 · OPTIMIZATION',
      title: 'Title & Top-10 Keyword Calibrator',
      category: 'SEARCH RELEVANCE · TOP 10 SLOTS · KEYWORD QUALITY',
      department: 'metadata',
      image: store05Rank1Seo,
      badge: 'SEARCH CALIBRATOR',
      statLabel: 'First-10 Weighting',
      description: 'Align your primary visual subject with the first 4 title words and top 10 keyword slots for Adobe Stock and Shutterstock search.',
      features: ['Keyword Quality Score', '<70 Char Calibrator', 'Relevance Audit'],
      ctaText: 'Open Calibrator',
      actionType: 'view',
      targetView: 'seo-rank',
      sampleTitle: 'Sustainable Alpine Forest With Golden Sunbeams And Morning Mist',
      sampleKeywords: ['sustainable alpine forest', 'golden sun rays', 'scenic wilderness', 'carbon neutral nature', 'ecological conservation', 'environmental protection', 'clean ecosystem', 'forest canopy']
    },
    {
      id: 'store-trends',
      storeNumber: '06 · INTELLIGENCE',
      title: 'Market Trends & Niche Research',
      category: 'TRENDS · RISING SEARCHES · BUYER DEMAND',
      department: 'creative',
      image: store06MarketTrends,
      badge: 'MARKET RESEARCH',
      statLabel: 'Search Demand',
      description: 'Research high-demand commercial topics, emerging enterprise concepts, and low-competition visual niches across major agencies.',
      features: ['Breakout Queries', 'Style Forecast', '1-Click Tag Copy'],
      ctaText: 'Explore Trends',
      actionType: 'view',
      targetView: 'trends',
      sampleTitle: 'Biophilic Modern Office Interior With Natural Sunlight And Plants',
      sampleKeywords: ['biophilic office interior', 'neural network node', 'sustainable packaging', 'electric mobility', 'clean energy grid', 'modern workspace', 'green architecture', 'future technology']
    },
    {
      id: 'store-competitor',
      storeNumber: '07 · BENCHMARK',
      title: 'Reverse Image & Tag Inspector',
      category: 'COMPETITOR SPY · REVERSE TAGS · GAP ANALYSIS',
      department: 'metadata',
      image: storeCompetitorSpy,
      badge: 'BENCHMARK TOOL',
      statLabel: 'Metadata Extraction',
      description: 'Inspect top-performing stock visuals in any category to analyze their subject framing, title structure, and keyword taxonomy.',
      features: ['Bestseller Tag Spy', 'Strategy Breakdown', 'Instant Copy'],
      ctaText: 'Open Inspector',
      actionType: 'view',
      targetView: 'competitor',
      sampleTitle: 'Global Supply Chain Logistics And Automated Warehouse Robotics',
      sampleKeywords: ['corporate leadership', 'global supply chain', 'digital transformation', 'automated warehouse', 'smart logistics', 'freight distribution', 'commercial transport', 'business strategy']
    },
    {
      id: 'store-csv-export',
      storeNumber: '08 · DISTRIBUTION',
      title: 'Multi-Agency CSV & Compliance Hub',
      category: 'EXPORT HUB · ADOBE · SHUTTERSTOCK · FREEPIK',
      department: 'monetize',
      image: store08MultiCsvHub,
      badge: 'EXPORT SUITE',
      statLabel: '5 Agencies Ready',
      description: 'Export formatted metadata CSVs for Adobe Stock, Shutterstock, Freepik, Getty, and Vecteezy with built-in IP and release checks.',
      features: ['5-Agency CSV Hub', 'Trademark IP Shield', 'Release Inspector'],
      ctaText: 'Open Export Hub',
      actionType: 'modal_tools',
      sampleTitle: 'Luxury Embossed Gold Foil Stationery Mockup On Travertine Stone',
      sampleKeywords: ['luxury stationery mockup', 'embossed gold foil', 'travertine stone', 'corporate identity', 'minimalist branding', 'editorial presentation', 'brand guidelines', 'paper texture']
    }
  ];

  const filteredStores = activeDepartment === 'all'
    ? marketStores
    : marketStores.filter(s => s.department === activeDepartment);

  const activePreviewStore = marketStores[previewStoreIdx] || marketStores[0];

  // Autonomous Zero-Command Specimen Deck Rotation (Cycles smoothly every 4.5s unless hovered)
  useEffect(() => {
    if (isHoveringSpecimen) return;
    const timer = setInterval(() => {
      if (document.hidden) return;
      setPreviewStoreIdx((prev) => (prev + 1) % marketStores.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isHoveringSpecimen, marketStores.length]);

  const handleOpenStore = (store: BoutiqueStoreItem) => {
    if (store.actionType === 'view' && store.targetView) {
      onNavigateView(store.targetView);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (store.actionType === 'modal_csv' && onOpenMultiCsv) {
      onOpenMultiCsv();
    } else if (store.actionType === 'modal_tools' && onOpenToolsHub) {
      onOpenToolsHub();
    } else {
      onStartGenerating();
    }
  };

  const handleQuickCopyTags = (store: BoutiqueStoreItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!store.sampleKeywords) return;
    navigator.clipboard.writeText(store.sampleKeywords.join(', '));
    setCopiedId(store.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={`relative w-full overflow-hidden ${
      isLight 
        ? 'bg-[#fbfaf8] text-[#111215]' 
        : 'bg-[#050608] text-[#f4f4f6]'
    } font-sans transition-colors duration-300`}>

      {/* Subtle Architectural Grid Backdrop */}
      <div
        className={`pointer-events-none absolute inset-0 ${
          isLight
            ? 'bg-[radial-gradient(#e5e3dc_1px,transparent_1px)] [background-size:24px_24px] opacity-60'
            : 'bg-[radial-gradient(#1b202c_1px,transparent_1px)] [background-size:24px_24px] opacity-65'
        }`}
      />

      {/* PHANTOM GHOST SPECTRAL AURORA ORBS & COLOSSAL MONSTER GIANT WATERMARK */}
      <div className="pointer-events-none select-none absolute inset-x-0 top-0 h-[780px] overflow-hidden z-0">
        <div
          className={`absolute -top-32 left-1/4 w-[540px] h-[540px] rounded-full blur-[130px] animate-ghost-drift ${
            isLight ? 'bg-emerald-400/15' : 'bg-emerald-500/14'
          }`}
        />
        <div
          className={`absolute top-24 right-1/5 w-[480px] h-[480px] rounded-full blur-[140px] animate-aurora-2 ${
            isLight ? 'bg-amber-400/15' : 'bg-cyan-500/12'
          }`}
        />
        <div
          aria-hidden="true"
          className={`absolute top-20 left-1/2 -translate-x-1/2 text-[14vw] font-black tracking-[-0.06em] uppercase leading-none whitespace-nowrap animate-colossal-breath ${
            isLight ? 'text-neutral-950/[0.03]' : 'text-white/[0.035]'
          }`}
        >
          PHANTOM TITAN
        </div>
      </div>

      {/* ============================================================ */}
      {/* ULTRA-MINIMALIST COFFY.NET HEADER (Feather-light & Breathable) */}
      {/* ============================================================ */}
      <header className={`sticky top-0 z-50 w-full ${
        isLight ? 'bg-[#fbfaf8]/90 border-b border-neutral-200/70' : 'bg-[#08090b]/90 border-b border-neutral-900'
      } backdrop-blur-xl transition-colors duration-200`}>
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 h-16 flex items-center justify-between gap-4">
          
          {/* Zone 1: Brand Identity */}
          <div className="flex items-center shrink-0">
            <AdobeMetaProLogo
              size="sm"
              showText={true}
              layout="horizontal"
              theme={isLight ? 'light' : 'dark'}
              onClick={() => {
                setActiveDepartment('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>

          {/* Zone 2: Whisper-Quiet Editorial Navigation Links (Clean 4-link core) */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-semibold tracking-[0.16em] uppercase">
            <button
              onClick={() => {
                setActiveDepartment('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`transition cursor-pointer relative py-1 whitespace-nowrap ${
                activeDepartment === 'all'
                  ? (isLight ? 'text-black font-bold' : 'text-white font-bold') 
                  : (isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white')
              }`}
            >
              <span>{isBn ? 'মার্কেট' : 'Market'}</span>
              {activeDepartment === 'all' && (
                <span className={`absolute bottom-0 left-0 right-0 h-[1.5px] ${isLight ? 'bg-black' : 'bg-white'}`} />
              )}
            </button>

            <button
              onClick={() => onNavigateView('upload')}
              className={`transition cursor-pointer relative py-1 whitespace-nowrap ${
                isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>{isBn ? 'স্টুডিও' : 'Studio'}</span>
            </button>

            <button
              onClick={() => onNavigateView('seo-rank')}
              className={`transition cursor-pointer relative py-1 whitespace-nowrap ${
                isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>{isBn ? 'সার্চ এসইও' : 'Search SEO'}</span>
            </button>

            <button
              onClick={() => onNavigateView('calendar')}
              className={`transition cursor-pointer relative py-1 whitespace-nowrap ${
                isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>{isBn ? 'ক্যালেন্ডার' : 'Calendar'}</span>
            </button>

            <button
              onClick={() => onNavigateView('monetize')}
              className={`hidden xl:inline-block transition cursor-pointer relative py-1 whitespace-nowrap ${
                isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>{isBn ? 'আয় ও মনিটাইজ' : 'Monetize'}</span>
            </button>
          </nav>

          {/* Zone 3: Uncluttered Action Bar (Pre-Check + Language + Quick Controls Popover + Open Studio) */}
          <div className="flex items-center gap-2 shrink-0 relative">
            {onOpenProToolkit && (
              <button
                type="button"
                onClick={() => onOpenProToolkit('presubmit')}
                className={`px-3 py-1.5 rounded-full text-[10.5px] font-bold tracking-[0.06em] uppercase flex items-center gap-1.5 border transition cursor-pointer ${
                  isLight
                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/40'
                }`}
                title="Pre-Submission Checker, Rejection Helper, AI Disclosure & Earnings Tracker"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline">Pre-Check</span>
              </button>
            )}

            {/* Consolidated Quick Controls & Modes Trigger (Eliminates Header Clutter) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowHeaderControlsMenu((prev) => !prev)}
                className={`px-2.5 py-1.5 rounded-full text-[10.5px] font-semibold tracking-[0.08em] uppercase flex items-center gap-1.5 border transition cursor-pointer ${
                  showHeaderControlsMenu
                    ? isLight
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-black border-white'
                    : isLight
                    ? 'bg-white hover:bg-neutral-100 text-neutral-700 border-neutral-200/90'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800'
                }`}
                title="More Tools, Black-Ops Terminal, Lite Mode & Display Settings"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{isBn ? 'কন্ট্রোল' : 'Controls'}</span>
              </button>

              <AnimatePresence>
                {showHeaderControlsMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowHeaderControlsMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute right-0 mt-2 w-64 rounded-2xl border p-2 shadow-2xl z-50 ${
                        isLight
                          ? 'bg-white/95 border-neutral-200 text-neutral-900'
                          : 'bg-[#0e1116]/95 border-neutral-800 text-neutral-100'
                      } backdrop-blur-xl space-y-1`}
                    >
                      <div className="px-2.5 py-1 text-[9.5px] font-mono uppercase tracking-[0.16em] text-neutral-400">
                        {isBn ? 'লাক্সারি থিম স্কিন (৪টি)' : 'SIGNATURE LUXURY THEME'}
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 px-1 pb-2 border-b border-neutral-200/70 dark:border-neutral-800">
                        {[
                          { id: 'obsidian' as const, label: 'Obsidian Gold', dot: 'bg-amber-400' },
                          { id: 'matrix' as const, label: 'Cyber Matrix', dot: 'bg-emerald-400' },
                          { id: 'sapphire' as const, label: 'Royal Sapphire', dot: 'bg-sky-400' },
                          { id: 'ivory' as const, label: 'Editorial Ivory', dot: 'bg-stone-300 border border-stone-500' },
                        ].map((sk) => {
                          const isSelected =
                            (isLight && sk.id === 'ivory') || (!isLight && activeSkin === sk.id);
                          return (
                            <button
                              key={sk.id}
                              type="button"
                              onClick={() => handleSelectSkin(sk.id)}
                              className={`px-2.5 py-1.5 rounded-xl text-[10.5px] font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                                isSelected
                                  ? isLight
                                    ? 'bg-neutral-950 text-white border-neutral-950'
                                    : 'bg-white text-black border-white'
                                  : isLight
                                  ? 'bg-neutral-100/80 hover:bg-neutral-200/70 text-neutral-700 border-neutral-200'
                                  : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 border-neutral-800'
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full shrink-0 ${sk.dot}`} />
                              <span className="truncate">{sk.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="px-2.5 pt-1 text-[9.5px] font-mono uppercase tracking-[0.16em] text-neutral-400">
                        {isBn ? 'টুলস এবং পারফরম্যান্স' : 'WORKSPACE & PERFORMANCE'}
                      </div>

                      {onOpenBlackOps && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowHeaderControlsMenu(false);
                            onOpenBlackOps();
                          }}
                          className="w-full px-3 py-2 rounded-xl text-left text-xs font-mono font-bold flex items-center justify-between bg-emerald-950/90 hover:bg-black text-emerald-300 border border-emerald-500/35 transition cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Black-Ops Terminal</span>
                          </span>
                          <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                            Ctrl+K
                          </span>
                        </button>
                      )}

                      {onToggleLiteMode && (
                        <button
                          type="button"
                          onClick={() => {
                            onToggleLiteMode();
                          }}
                          className={`w-full px-3 py-2 rounded-xl text-left text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                            isLight ? 'hover:bg-neutral-100' : 'hover:bg-neutral-800/80'
                          }`}
                        >
                          <span>{isBn ? '⚡ লাইট মোড (ফাস্ট ফোন)' : '⚡ Lite Mode (Low-End Phone)'}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isLiteMode
                                ? 'bg-amber-500 text-black'
                                : isLight
                                ? 'bg-neutral-200 text-neutral-700'
                                : 'bg-neutral-800 text-neutral-400'
                            }`}
                          >
                            {isLiteMode ? 'ON' : 'OFF'}
                          </span>
                        </button>
                      )}

                      {onToggleWaterWorld && (
                        <button
                          type="button"
                          onClick={() => {
                            onToggleWaterWorld();
                          }}
                          className={`w-full px-3 py-2 rounded-xl text-left text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                            isLight ? 'hover:bg-neutral-100' : 'hover:bg-neutral-800/80'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Droplets className="w-3.5 h-3.5 text-sky-500" />
                            <span>{isBn ? 'ওয়াটার ফিজিক্স FX' : 'Crystal Water FX'}</span>
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isWaterWorldActive
                                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                                : isLight
                                ? 'bg-neutral-200 text-neutral-700'
                                : 'bg-neutral-800 text-neutral-400'
                            }`}
                          >
                            {isWaterWorldActive ? 'ON' : 'OFF'}
                          </span>
                        </button>
                      )}

                      {onOpenChat && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowHeaderControlsMenu(false);
                            onOpenChat();
                          }}
                          className={`w-full px-3 py-2 rounded-xl text-left text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                            isLight ? 'hover:bg-neutral-100' : 'hover:bg-neutral-800/80'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                            <span>{isBn ? 'এআই চ্যাট অ্যাসিস্ট্যান্ট' : 'AI Chat Assistant'}</span>
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                        </button>
                      )}

                      {onOpenAbout && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowHeaderControlsMenu(false);
                            onOpenAbout();
                          }}
                          className={`w-full px-3 py-2 rounded-xl text-left text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                            isLight ? 'hover:bg-neutral-100' : 'hover:bg-neutral-800/80'
                          }`}
                        >
                          <span>{isBn ? 'প্রম্পট ও অ্যাবাউট গাইড' : 'About & Studio Guide'}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                        </button>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme mode"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer ${
                isLight 
                  ? 'text-neutral-500 hover:text-black hover:bg-neutral-200/50' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => onNavigateView('upload')}
              className={`text-[10.5px] font-bold tracking-[0.14em] uppercase px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs ${
                isLight
                  ? 'bg-neutral-950 hover:bg-black text-white'
                  : 'bg-white hover:bg-neutral-200 text-black'
              }`}
            >
              <span>{isBn ? 'স্টুডিও খুলুন' : 'Open Studio'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>
      </header>

      {/* ============================================================ */}
      {/* BREATHABLE EDITORIAL HERO & INTERACTIVE METADATA PREVIEW DECK */}
      {/* ============================================================ */}
      <div className="relative z-10 pt-10 sm:pt-14 pb-10 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left 7 Columns: Editorial Headline, Department Switcher & Primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-5 text-left"
          >
            {/* Quiet Editorial Kicker */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-[0.16em] text-emerald-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>
                IFRIT AUTONOMOUS ENGINE · ZERO-CLICK DROP OR CTRL+V PASTE ANYWHERE
              </span>
            </div>

            {/* Colossal Monster-Scale Editorial Headline */}
            <h1 className={`text-[36px] sm:text-[52px] xl:text-[62px] font-black tracking-[-0.04em] leading-[1.03] ${
              isLight ? 'text-neutral-950' : 'text-white'
            }`}>
              Autonomous Stock{' '}
              <span className="font-editorial italic font-normal luxury-headline-gradient">
                Metadata
              </span>{' '}
              &amp; SEO Monolith.
            </h1>

            <p className={`text-[14px] sm:text-[15.5px] font-normal max-w-xl leading-relaxed ${
              isLight ? 'text-neutral-600' : 'text-neutral-400'
            }`}>
              Drop any EPS vector, PSD, photo, or press <kbd className="px-1.5 py-0.5 text-[11px] font-mono rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">Ctrl+V</kbd> anywhere on screen. The engine renders vector previews, locks Top-10 Adobe Stock search weights (75% ranking power), and prepares your agency CSV automatically.
            </p>

            {/* Instant Ifrit Ghost Dropzone Bar right inside the Hero */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isHeroDragging) setIsHeroDragging(true);
              }}
              onDragLeave={() => setIsHeroDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsHeroDragging(false);
                if (e.dataTransfer?.files && e.dataTransfer.files.length > 0 && onQuickDropFiles) {
                  onQuickDropFiles(Array.from(e.dataTransfer.files));
                } else {
                  onStartGenerating();
                }
              }}
              onClick={onStartGenerating}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isHeroDragging
                  ? 'border-emerald-400 bg-emerald-500/15 scale-[1.01]'
                  : isLight
                  ? 'bg-white hover:bg-neutral-50 border-neutral-300 shadow-sm'
                  : 'bg-[#0b0e14]/90 hover:bg-[#10151f] border-emerald-500/30 hover:border-emerald-400/60 shadow-[0_12px_36px_-12px_rgba(16,185,129,0.2)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  isLight
                    ? 'bg-neutral-950 text-white border-neutral-950'
                    : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                }`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-xs sm:text-sm font-bold flex items-center gap-2 ${
                    isLight ? 'text-neutral-950' : 'text-white'
                  }`}>
                    <span>Drop EPS, AI, PSD, JPG or Press Ctrl+V</span>
                    <span className="text-[9.5px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Instant Autopilot
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    Zero-click ghost execution · Automatically extracts artwork, 49 tags, title &amp; CSV
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onWatchDemo();
                  }}
                  className={`px-3 py-2 rounded-xl text-[11px] font-semibold border transition cursor-pointer ${
                    isLight
                      ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800'
                  }`}
                >
                  1-Click Live Demo
                </button>
                <span className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                  isLight
                    ? 'bg-neutral-950 text-white'
                    : 'bg-emerald-500 text-neutral-950'
                }`}>
                  <span>Select Files</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Pre-Submission Audit Quick Action */}
            {onOpenProToolkit && (
              <div className="pt-1 flex flex-wrap items-center gap-2.5 text-xs">
                <button
                  type="button"
                  onClick={() => onOpenProToolkit('presubmit')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border font-semibold text-[11px] transition cursor-pointer ${
                    isLight
                      ? 'bg-white hover:bg-neutral-100 border-neutral-300 text-neutral-900'
                      : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Pre-Submission Audit</span>
                </button>
              </div>
            )}
          </motion.div>

          {/* Right 5 Columns: Live Interactive Store Telemetry & SEO Specimen Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div
              data-bounce-card="true"
              onMouseEnter={() => setIsHoveringSpecimen(true)}
              onMouseLeave={() => setIsHoveringSpecimen(false)}
              className={`rounded-2xl border p-5 transition-all duration-300 relative overflow-hidden phantom-monolith-card ${
              isLight
                ? 'bg-white border-neutral-200/90 shadow-[0_12px_40px_-15px_rgba(0,0,0,0.07)]'
                : 'bg-[#0b0e14]/95 border-emerald-500/30 shadow-2xl'
            }`}>
              {/* Subtle Ghost Laser Scan Line inside Specimen Card */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent animate-laser-scan"
              />
              {/* Top Specimen Header */}
              <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-neutral-200/60 dark:border-neutral-800/80">
                <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.16em] uppercase text-neutral-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>LIVE SEO SPECIMEN · {activePreviewStore.storeNumber}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenStore(activePreviewStore)}
                  className={`text-[10.5px] font-bold tracking-[0.1em] uppercase flex items-center gap-1 cursor-pointer ${
                    isLight ? 'text-neutral-900 hover:text-amber-600' : 'text-white hover:text-amber-400'
                  }`}
                >
                  <span>{activePreviewStore.ctaText}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Specimen Visual & Before/After Title Comparison */}
              <div className="flex items-start gap-3.5 mb-4">
                <img
                  src={activePreviewStore.image}
                  alt={activePreviewStore.title}
                  className="w-18 h-16 rounded-xl object-cover border border-neutral-200/60 dark:border-neutral-800 shrink-0"
                />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-neutral-400 line-through truncate max-w-[190px]">
                      Raw: &quot;IMG_4092 vector graphic design.eps&quot;
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {activePreviewStore.sampleTitle.length}/70 CHARS · 99% MATCH
                    </span>
                  </div>
                  <p className={`text-xs font-semibold leading-snug line-clamp-2 ${
                    isLight ? 'text-neutral-900' : 'text-neutral-100'
                  }`}>
                    {activePreviewStore.sampleTitle}
                  </p>
                </div>
              </div>

              {/* First-10 Slot Lock Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.12em] text-neutral-400">
                  <span>TOP-10 WEIGHTED KEYWORDS (75% SEARCH POWER)</span>
                  <button
                    type="button"
                    onClick={(e) => handleQuickCopyTags(activePreviewStore, e)}
                    className={`font-sans font-semibold text-[10.5px] flex items-center gap-1 cursor-pointer ${
                      isLight ? 'text-neutral-800 hover:text-black' : 'text-neutral-200 hover:text-white'
                    }`}
                  >
                    {copiedId === activePreviewStore.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Sample</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {activePreviewStore.sampleKeywords.slice(0, 6).map((kw, kIdx) => {
                    return (
                      <span
                        key={kw}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 border ${
                          kIdx === 0
                            ? isLight
                              ? 'bg-neutral-950 text-white border-neutral-950 font-semibold'
                              : 'bg-white text-neutral-950 border-white font-semibold'
                            : isLight
                            ? 'bg-[#f7f6f2] text-neutral-700 border-neutral-200/80'
                            : 'bg-neutral-900 text-neutral-300 border-neutral-800'
                        }`}
                      >
                        <span className="text-[9.5px] font-mono opacity-60">#{kIdx + 1}</span>
                        <span>{kw}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Store Switcher Dots & Metadata Inspector Trigger */}
              <div className="mt-4 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/80 flex items-center justify-between gap-2">
                {onOpenBlackOps ? (
                  <button
                    type="button"
                    onClick={onOpenBlackOps}
                    className={`text-[11px] font-medium flex items-center gap-1.5 cursor-pointer transition ${
                      isLight
                        ? 'text-neutral-600 hover:text-black'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Open Metadata &amp; Binary Inspector (Ctrl+K)</span>
                  </button>
                ) : (
                  <span className="text-[10.5px] text-neutral-400">
                    Hover or click any module below to preview
                  </span>
                )}
                <div className="flex items-center gap-1">
                  {marketStores.map((st, idx) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setPreviewStoreIdx(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        previewStoreIdx === idx
                          ? (isLight ? 'w-5 bg-neutral-950' : 'w-5 bg-white')
                          : (isLight ? 'w-1.5 bg-neutral-300 hover:bg-neutral-500' : 'w-1.5 bg-neutral-700 hover:bg-neutral-500')
                      }`}
                      title={`Preview ${st.title}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* ============================================================ */}
        {/* CONTRIBUTOR PRE-SUBMISSION, AI DISCLOSURE & TRACKER SUITE    */}
        {/* ============================================================ */}
        <div
          data-bounce-card="true"
          className={`mt-10 rounded-2xl border p-5 sm:p-6 transition-all ${
            isLight
              ? 'bg-white/90 border-neutral-200/90 shadow-[0_12px_36px_-16px_rgba(14,165,233,0.12)]'
              : 'bg-[#0b0e13]/95 border-neutral-800/90 shadow-2xl'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 mb-4 border-b border-neutral-200/70 dark:border-neutral-800/80">
            <h3
              className={`text-sm sm:text-base font-bold tracking-tight flex items-center gap-2 ${
                isLight ? 'text-neutral-950' : 'text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>
                {isBn
                  ? 'কন্ট্রিবিউটর টুলকিট (যেকোনো কার্ডে ক্লিক করে ওপেন করুন)'
                  : 'Contributor Protection & Optimization Suite (Click any card to launch)'}
              </span>
            </h3>
            <span className="text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400">
              {isBn ? '১০০% ব্রাউজার ভিত্তিক · কোনো সার্ভার আপলোড নেই' : '100% LOCAL IN-BROWSER'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {[
              {
                tab: 'presubmit' as const,
                stage: '01 · PRE-CHECK',
                title: isBn ? 'ফাইল ও ট্রেডমার্ক প্রি-চেক' : '4MP, EPS & Trademark Check',
                desc: isBn
                  ? 'আপলোডের আগে 4MP রেজোলিউশন, EPS ভার্সন, ডুপ্লিকেট ট্যাগ ও ট্রেডমার্ক চেক।'
                  : 'Verify ≥4MP resolution, EPS version, duplicate tags, and restricted trademarks.',
              },
              {
                tab: 'rejection' as const,
                stage: '02 · REJECTION & AI',
                title: isBn ? 'রিজেকশন সমাধান ও AI গাইড' : 'Rejection Fix & AI Policy',
                desc: isBn
                  ? 'Similar content বা Noise রিজেকশন সমাধান ও জেনারেটিভ AI ফ্ল্যাগ গাইড।'
                  : 'Fix Similar Content or Noise rejections and validate Generative AI flags.',
              },
              {
                tab: 'kwscore' as const,
                stage: '03 · IPTC & SCORE',
                title: isBn ? 'কীওয়ার্ড স্কোর ও ফাইলে এম্বেড' : 'Keyword Score & IPTC Embed',
                desc: isBn
                  ? 'কীওয়ার্ড প্রাসঙ্গিকতা স্কোর এবং সরাসরি JPG/EPS ও .xmp ফাইলে এম্বেড।'
                  : 'Score keyword relevance and embed IPTC/XMP directly into JPG/EPS or .xmp.',
              },
              {
                tab: 'tracker' as const,
                stage: '04 · CSV TRACKER',
                title: isBn ? 'আপলোড ও আর্নিং CSV ট্র্যাকার' : 'Submission & Earnings Tracker',
                desc: isBn
                  ? 'ফাইল স্ট্যাটাস ও আর্নিং CSV ইমপোর্ট করে টপ-সেলিং টপিক বিশ্লেষণ।'
                  : 'Track submission status and analyze Adobe Stock earnings CSV locally.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() =>
                  onOpenProToolkit ? onOpenProToolkit(item.tab) : onNavigateView('upload')
                }
                className={`p-3.5 rounded-xl border transition cursor-pointer group ${
                  isLight
                    ? 'bg-[#faf9f6] hover:bg-white border-neutral-200/80 hover:border-neutral-900'
                    : 'bg-[#11141c] hover:bg-[#151923] border-neutral-800/90 hover:border-emerald-500/40'
                }`}
              >
                <div className="flex items-center justify-between text-[9.5px] font-mono font-bold tracking-wider uppercase mb-1 text-emerald-600 dark:text-emerald-400">
                  <span>{item.stage}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div
                  className={`text-xs font-bold mb-1 ${
                    isLight ? 'text-neutral-950' : 'text-white'
                  }`}
                >
                  {item.title}
                </div>
                <p
                  className={`text-[11px] leading-snug line-clamp-2 ${
                    isLight ? 'text-neutral-500' : 'text-neutral-400'
                  }`}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* DEPARTMENT FILTER BAR & DIRECTORY HEADER */}
        {/* ============================================================ */}
        <div className={`mt-12 pt-8 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isLight ? 'border-neutral-200/70' : 'border-neutral-900'
        }`}>
          <div>
            <h2 className={`text-sm font-bold uppercase tracking-[0.16em] ${
              isLight ? 'text-neutral-900' : 'text-white'
            }`}>
              Specialized Creative Stores Directory (08)
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Select a specialized store below to launch its dedicated workspace
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All Stores (08)' },
              { id: 'metadata', label: 'Metadata & SEO (03)' },
              { id: 'creative', label: 'Calendar & Prompts (03)' },
              { id: 'monetize', label: 'Earning & CSV (02)' },
            ].map((tab) => {
              const isActive = activeDepartment === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveDepartment(tab.id as any)}
                  className={`text-[10.5px] font-semibold tracking-[0.12em] uppercase px-3.5 py-1.5 rounded-full border transition cursor-pointer whitespace-nowrap ${
                    isActive
                      ? isLight
                        ? 'bg-neutral-950 text-white border-neutral-950 shadow-2xs'
                        : 'bg-white text-black border-white'
                      : isLight
                      ? 'bg-white text-neutral-500 border-neutral-200/90 hover:border-neutral-900 hover:text-black'
                      : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* COFFY.NET BOUTIQUE STOREFRONT GALLERY GRID (8 DOKANS) */}
      {/* ============================================================ */}
      <section className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 pb-20">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredStores.map((store, idx) => (
              <motion.div
                key={store.id}
                layout
                data-bounce-card="true"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, delay: idx * 0.03, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => {
                  const foundIdx = marketStores.findIndex(m => m.id === store.id);
                  if (foundIdx !== -1) setPreviewStoreIdx(foundIdx);
                }}
                onClick={() => handleOpenStore(store)}
                className={`group cursor-pointer rounded-2xl border p-4 flex flex-col justify-between transition-all duration-300 ${
                  isLight
                    ? 'bg-white border-neutral-200/85 hover:border-neutral-900 hover:shadow-[0_14px_35px_-12px_rgba(0,0,0,0.1)]'
                    : 'bg-[#0e1015] border-neutral-800/90 hover:border-neutral-600 hover:shadow-2xl'
                }`}
              >
                <div className="space-y-3.5">
                  {/* Top Store Number & Live Status Line (Zero-Pill Unboxed Metadata) */}
                  <div className="flex items-center justify-between text-[10px] font-mono tabular-nums tracking-[0.16em] uppercase text-neutral-400">
                    <span>{store.storeNumber}</span>
                    <span className={isLight ? 'text-neutral-700 font-semibold' : 'text-neutral-300 font-semibold'}>
                      {store.statLabel}
                    </span>
                  </div>

                  {/* Coffy Signature Cover Image Card */}
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-neutral-900">
                    <img
                      src={store.image}
                      alt={store.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {/* Subtle Contrast Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-300" />

                    {/* Subtle Top-Left Store Kicker */}
                    <div className="absolute top-2.5 left-3 text-[9px] font-mono font-semibold tracking-[0.16em] uppercase text-white/95">
                      {store.badge}
                    </div>

                    {/* Quick Sample SEO Copy Button on Top-Right */}
                    {store.sampleKeywords && (
                      <button
                        type="button"
                        onClick={(e) => handleQuickCopyTags(store, e)}
                        className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[9.5px] font-semibold bg-white/95 hover:bg-white text-black flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-xs cursor-pointer whitespace-nowrap"
                        title="Copy store sample SEO keywords"
                      >
                        {copiedId === store.id ? (
                          <>
                            <Check className="w-2.5 h-2.5 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-2.5 h-2.5" />
                            <span>Copy Tags</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Bottom Hover Enter Store Bar */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                      <span className="text-[10.5px] font-semibold tracking-[0.14em] uppercase">
                        {store.ctaText}
                      </span>
                      <span className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center transform group-hover:translate-x-0.5 transition-transform shadow-xs">
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  {/* Coffy Details Typography Block */}
                  <div className="space-y-1.5 pt-1">
                    <h3 className={`text-[15.5px] font-bold tracking-tight leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors ${
                      isLight ? 'text-neutral-950' : 'text-white'
                    }`}>
                      {store.title}
                    </h3>
                    <p className={`text-xs leading-relaxed line-clamp-2 ${
                      isLight ? 'text-neutral-500' : 'text-neutral-400'
                    }`}>
                      {store.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </section>

    </div>
  );
};
