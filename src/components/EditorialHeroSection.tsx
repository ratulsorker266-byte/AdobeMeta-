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
  Terminal
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
  onOpenBlackOps
}) => {
  const [activeDepartment, setActiveDepartment] = useState<'all' | 'metadata' | 'creative' | 'monetize'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewStoreIdx, setPreviewStoreIdx] = useState<number>(0);
  const [isHoveringSpecimen, setIsHoveringSpecimen] = useState<boolean>(false);

  const isLight = themeMode === 'light';

  // 8 Specialized Creative Stores (Dokans) in the Coffy.net Market Grid
  const marketStores: BoutiqueStoreItem[] = [
    {
      id: 'store-metadata',
      storeNumber: '01 . STORE',
      title: 'Metadata & EPS Vector Studio',
      category: 'METADATA · GHOSTSCRIPT EPS · 49 WEIGHTED TAGS',
      department: 'metadata',
      image: store01MetadataEps,
      badge: 'FLAGSHIP STUDIO',
      statLabel: `${itemsCount > 0 ? `${itemsCount} Queued` : '49/49 SEO'}`,
      description: '5-layer conversion metadata with 119ms Ghostscript EPS preview and 75% First-10 Slot Lock for maximum downloads.',
      features: ['119ms EPS Preview', '49 Weighted Tags', 'Direct IPTC & XMP'],
      ctaText: 'Enter Studio',
      actionType: 'view',
      targetView: 'upload',
      sampleTitle: 'Isometric Cloud Security Server Architecture Vector Illustration',
      sampleKeywords: ['isometric cloud security', 'cyber infrastructure', 'enterprise server', 'digital transformation', 'data protection', 'network firewall', 'cloud computing', 'editable vector', 'eps 10', 'commercial illustration']
    },
    {
      id: 'store-calendar',
      storeNumber: '02 . STORE',
      title: 'Seasonal Demand Calendar',
      category: 'CALENDAR · 12-MONTH EVENTS · BUYER TIMELINE',
      department: 'creative',
      image: storeCalendarHub,
      badge: 'SEASONAL RADAR',
      statLabel: '365-Day Forecast',
      description: 'Discover high-demand microstock events, global holidays, and commercial buying windows 60 days ahead of search spikes.',
      features: ['60-Day Lead Window', 'Holiday Niches', 'Prompt Sync'],
      ctaText: 'Open Calendar',
      actionType: 'view',
      targetView: 'calendar',
      sampleTitle: 'Black Friday E-Commerce Retail Promotion Banner With Copy Space',
      sampleKeywords: ['autumn harvest festival', 'black friday sale banner', 'cyber monday retail', 'new year celebration', 'corporate annual report', 'holiday shopping', 'seasonal promotion', 'retail discount']
    },
    {
      id: 'store-prompts',
      storeNumber: '03 . STORE',
      title: 'AI Prompt Engineering Lab',
      category: 'PROMPT MAKER · MIDJOURNEY V6 · FIREFLY 3',
      department: 'creative',
      image: storePromptStudio,
      badge: 'PROMPT LAB',
      statLabel: 'Commercial Ready',
      description: 'Generate commercial stock photography, isolated 3D render, and clean flat vector prompts engineered for agency approval.',
      features: ['Zero-Artifact Formula', 'Copy-Space Framing', 'Midjourney & Firefly'],
      ctaText: 'Open Prompt Lab',
      actionType: 'view',
      targetView: 'prompts',
      sampleTitle: 'Minimalist Ceramic Product Podium In Warm Sunlight With Copy Space',
      sampleKeywords: ['minimalist studio lighting', 'isolated on white', 'commercial copy space', '8k octane render', 'flat vector illustration', 'product podium', 'architectural shadows', 'clean background']
    },
    {
      id: 'store-monetize',
      storeNumber: '04 . STORE',
      title: 'Google Monetize & Earning Hub',
      category: 'MONETIZATION · ADSENSE HUB · ROYALTY SIMULATOR',
      department: 'monetize',
      image: storeMonetizeVault,
      badge: '$38.50 CPC HUB',
      statLabel: 'Passive ROI',
      description: 'Calculate combined microstock download royalties and Google AdSense display revenue with 1-click ads.txt generator.',
      features: ['AdSense Simulator', 'Official ads.txt', 'High-CPC Keywords'],
      ctaText: 'Open Earning Hub',
      actionType: 'view',
      targetView: 'monetize',
      sampleTitle: 'Fintech Wealth Management Dashboard And Biometric Banking Security',
      sampleKeywords: ['fintech banking security', 'renewable solar grid', 'enterprise cloud ai', 'biotech laboratory', 'wealth management', 'financial analytics', 'passive income', 'digital investment']
    },
    {
      id: 'store-seo-rank',
      storeNumber: '05 . STORE',
      title: '100% Rank #1 SEO Booster',
      category: 'ALGORITHM · TOP 10 SLOTS · SEARCH WEIGHTING',
      department: 'metadata',
      image: store05Rank1Seo,
      badge: 'RANK #1 ENGINE',
      statLabel: '75% Top-10 Weight',
      description: 'Lock your exact buyer search query into Keyword Slots #1–#10 and first 4 title words to rank on Page 1.',
      features: ['First-10 Slot Lock', '<70 Char Calibrator', 'Live Search Audit'],
      ctaText: 'Open Rank Booster',
      actionType: 'view',
      targetView: 'seo-rank',
      sampleTitle: 'Sustainable Alpine Forest With Golden Sunbeams And Morning Mist',
      sampleKeywords: ['sustainable alpine forest', 'golden sun rays', 'scenic wilderness', 'carbon neutral nature', 'ecological conservation', 'environmental protection', 'clean ecosystem', 'forest canopy']
    },
    {
      id: 'store-trends',
      storeNumber: '06 . STORE',
      title: 'Live Market Trends Radar',
      category: 'TRENDS · RISING SEARCHES · BUYER DEMAND',
      department: 'creative',
      image: store06MarketTrends,
      badge: 'LIVE PULSE',
      statLabel: 'Real-Time Data',
      description: 'Explore live surging search terms, low-competition visual niches, and trending commercial color palettes across agencies.',
      features: ['Breakout Queries', 'Style Forecast', '1-Click Tag Copy'],
      ctaText: 'Explore Trends',
      actionType: 'view',
      targetView: 'trends',
      sampleTitle: 'Biophilic Modern Office Interior With Natural Sunlight And Plants',
      sampleKeywords: ['biophilic office interior', 'neural network node', 'sustainable packaging', 'electric mobility', 'clean energy grid', 'modern workspace', 'green architecture', 'future technology']
    },
    {
      id: 'store-competitor',
      storeNumber: '07 . STORE',
      title: 'Competitor Spy & Tag Extractor',
      category: 'COMPETITOR SPY · REVERSE TAGS · GAP ANALYSIS',
      department: 'metadata',
      image: storeCompetitorSpy,
      badge: 'SPY RADAR',
      statLabel: 'Top 1% Benchmark',
      description: 'Reverse-engineer top-selling stock assets in any niche. Extract hidden high-converting tags and uncover keyword gaps.',
      features: ['Bestseller Tag Spy', 'Strategy Breakdown', 'Instant Copy'],
      ctaText: 'Launch Spy Tool',
      actionType: 'view',
      targetView: 'competitor',
      sampleTitle: 'Global Supply Chain Logistics And Automated Warehouse Robotics',
      sampleKeywords: ['corporate leadership', 'global supply chain', 'digital transformation', 'automated warehouse', 'smart logistics', 'freight distribution', 'commercial transport', 'business strategy']
    },
    {
      id: 'store-csv-export',
      storeNumber: '08 . STORE',
      title: 'Multi-Agency CSV & Tools Hub',
      category: 'EXPORT HUB · ADOBE · SHUTTERSTOCK · FREEPIK',
      department: 'monetize',
      image: store08MultiCsvHub,
      badge: '12 PRO TOOLS',
      statLabel: '5 Agencies Ready',
      description: 'One-click formatted CSV exports for Adobe Stock, Shutterstock, Freepik, Getty & Vecteezy plus IP Shield and Release Inspector.',
      features: ['5-Agency CSV Hub', 'Trademark IP Shield', 'Release Inspector'],
      ctaText: 'Open Tools Suite',
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
        : 'bg-[#08090b] text-[#f2f2f0]'
    } font-sans transition-colors duration-300`}>

      {/* Architectural Subtle Grid Hairline Backdrop */}
      <div
        className={`pointer-events-none absolute inset-0 ${
          isLight
            ? 'bg-[radial-gradient(#d6d3cd_1px,transparent_1px)] [background-size:28px_28px] opacity-40'
            : 'bg-[radial-gradient(#23252c_1px,transparent_1px)] [background-size:28px_28px] opacity-35'
        }`}
      />

      {/* ============================================================ */}
      {/* ULTRA-MINIMALIST COFFY.NET HEADER (Feather-light 1px border) */}
      {/* ============================================================ */}
      <header className={`sticky top-0 z-50 w-full ${
        isLight ? 'bg-[#fbfaf8]/90 border-b border-neutral-200/70' : 'bg-[#08090b]/90 border-b border-neutral-900'
      } backdrop-blur-xl transition-colors duration-200`}>
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 h-16 sm:h-18 flex items-center justify-between">
          
          {/* Zone 1: Brand Identity */}
          <div className="flex items-center">
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

          {/* Zone 2: Whisper-Quiet Editorial Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-[11px] font-semibold tracking-[0.16em] uppercase">
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
              <span>Market</span>
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
              <span>Studio</span>
            </button>

            <button
              onClick={() => onNavigateView('seo-rank')}
              className={`transition cursor-pointer relative py-1 whitespace-nowrap ${
                isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Rank SEO</span>
            </button>

            <button
              onClick={() => onNavigateView('calendar')}
              className={`transition cursor-pointer relative py-1 whitespace-nowrap ${
                isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Calendar</span>
            </button>

            <button
              onClick={() => onNavigateView('prompts')}
              className={`hidden lg:inline-block transition cursor-pointer relative py-1 whitespace-nowrap ${
                isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Prompts</span>
            </button>

            <button
              onClick={() => onNavigateView('monetize')}
              className={`hidden xl:inline-block transition cursor-pointer relative py-1 whitespace-nowrap ${
                isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Monetize</span>
            </button>

            <button
              onClick={() => {
                if (onOpenAbout) onOpenAbout();
              }}
              className={`hidden xl:inline-block transition cursor-pointer whitespace-nowrap ${
                isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>About</span>
            </button>
          </nav>

          {/* Zone 3: Minimalist Controls & Text AI Chat Trigger */}
          <div className="flex items-center gap-2">
            {onOpenBlackOps && (
              <button
                type="button"
                onClick={onOpenBlackOps}
                className={`px-3 py-1.5 rounded-full text-[10.5px] font-mono font-bold tracking-[0.12em] uppercase flex items-center gap-1.5 border transition cursor-pointer ${
                  isLight
                    ? 'bg-emerald-950 hover:bg-black text-emerald-300 border-emerald-700/80 shadow-2xs'
                    : 'bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border-emerald-500/45 shadow-[0_0_18px_rgba(16,185,129,0.25)]'
                }`}
                title="Open Classified Black-Ops Intelligence & Forensic Scrubber (Ctrl+K)"
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Black-Ops</span>
              </button>
            )}

            {onToggleWaterWorld && (
              <button
                type="button"
                onClick={onToggleWaterWorld}
                className={`px-3 py-1.5 rounded-full text-[10.5px] font-semibold tracking-[0.1em] uppercase flex items-center gap-1.5 border transition cursor-pointer ${
                  isWaterWorldActive
                    ? isLight
                      ? 'bg-sky-50/90 hover:bg-sky-100 text-sky-900 border-sky-300/90 shadow-2xs'
                      : 'bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border-sky-500/40'
                    : isLight
                    ? 'bg-white hover:bg-neutral-100 text-neutral-500 border-neutral-200/90'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border-neutral-800'
                }`}
                title="Toggle Interactive Crystal Water World & Buoyancy Physics"
              >
                <Droplets className={`w-3.5 h-3.5 ${isWaterWorldActive ? 'text-sky-500' : 'text-neutral-400'}`} />
                <span className="hidden md:inline">{isWaterWorldActive ? 'Water FX' : 'Water OFF'}</span>
              </button>
            )}

            {onOpenChat && (
              <button
                onClick={onOpenChat}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.1em] uppercase flex items-center gap-1.5 border transition cursor-pointer ${
                  isLight
                    ? 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-200/90 shadow-2xs'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-800'
                }`}
                title="Open Minimalist Text AI Assistant"
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">AI Chat</span>
              </button>
            )}

            <a
              href="mailto:ratulsorker266@gmail.com"
              aria-label="Contact Studio"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer ${
                isLight 
                  ? 'text-neutral-500 hover:text-black hover:bg-neutral-200/50' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
              title="Contact Studio (ratulsorker266@gmail.com)"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>

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
              <span>Open Studio</span>
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
            {/* Quiet Editorial Kicker (Zero-Pill Unboxed Metadata) */}
            <div className="flex flex-wrap items-center gap-2 text-[10.5px] font-mono tracking-[0.2em] uppercase text-neutral-400">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className={isLight ? 'text-neutral-900 font-semibold' : 'text-neutral-200 font-semibold'}>ZERO-CLICK AUTOPILOT ON</span>
              <span aria-hidden="true">·</span>
              <span>49/49 ADOBE STOCK SEO</span>
              <span aria-hidden="true">·</span>
              <span>DROP FILES ANYWHERE</span>
            </div>

            {/* Museum-Grade Editorial Headline */}
            <h1 className={`text-[34px] sm:text-[50px] xl:text-[60px] font-bold tracking-[-0.035em] leading-[1.03] ${
              isLight ? 'text-neutral-950' : 'text-white'
            }`}>
              Autonomous Stock{' '}
              <span className="font-editorial italic font-normal text-amber-500 aquatic-caustic-text">Metadata</span>{' '}
              &amp; Creative Stores.
            </h1>

            <p className={`text-[14px] sm:text-[15.5px] font-normal max-w-2xl leading-relaxed ${
              isLight ? 'text-neutral-600' : 'text-neutral-400'
            }`}>
              Feather-light, zero-click automation for stock contributors. Simply drop your <code className="text-xs font-mono px-1.5 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800/80">.eps</code>, photos, or footage anywhere—Autopilot automatically renders vector previews, locks Top-10 Adobe Stock keywords, and prepares your CSV.
            </p>

            {/* Primary Action Row */}
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                onClick={onStartGenerating}
                className={`px-6 py-3 rounded-full text-xs font-bold tracking-[0.14em] uppercase transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                  isLight
                    ? 'bg-neutral-950 hover:bg-black text-white'
                    : 'bg-white hover:bg-neutral-200 text-neutral-950'
                }`}
              >
                <span>Drop or Select Files (Auto-Runs)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigateView('upload')}
                className={`px-5 py-3 rounded-full text-xs font-semibold tracking-[0.12em] uppercase border transition cursor-pointer flex items-center gap-2 ${
                  isLight
                    ? 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-200/90'
                    : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border-neutral-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Open Autopilot Studio</span>
              </button>
            </div>

            {/* Unboxed Quantitative Telemetry Strip */}
            <div className={`pt-4 border-t flex flex-wrap items-center gap-x-6 gap-y-2 text-xs ${
              isLight ? 'border-neutral-200/70 text-neutral-500' : 'border-neutral-900 text-neutral-400'
            }`}>
              <div>
                <strong className={`font-mono font-bold tabular-nums ${isLight ? 'text-neutral-950' : 'text-white'}`}>49/49</strong> Weighted Tags
              </div>
              <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
              <div>
                <strong className={`font-mono font-bold tabular-nums ${isLight ? 'text-neutral-950' : 'text-white'}`}>119ms</strong> Ghostscript EPS
              </div>
              <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
              <div>
                <strong className={`font-mono font-bold tabular-nums ${isLight ? 'text-neutral-950' : 'text-white'}`}>&lt;70 Chars</strong> Adobe Stock Title Rule
              </div>
              <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
              <div>
                <strong className={`font-mono font-bold tabular-nums ${isLight ? 'text-neutral-950' : 'text-white'}`}>08</strong> Active Stores
              </div>
            </div>
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
              className={`rounded-2xl border p-5 transition-all duration-300 ${
              isLight
                ? 'bg-white border-neutral-200/90 shadow-[0_12px_40px_-15px_rgba(0,0,0,0.07)]'
                : 'bg-[#0f1116] border-neutral-800/90 shadow-2xl'
            }`}>
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

              {/* Specimen Visual & Title Preview */}
              <div className="flex items-center gap-3.5 mb-4">
                <img
                  src={activePreviewStore.image}
                  alt={activePreviewStore.title}
                  className="w-18 h-14 rounded-xl object-cover border border-neutral-200/60 dark:border-neutral-800 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mb-0.5">
                    <span>SUBJECT-FIRST TITLE ({activePreviewStore.sampleTitle.length}/70 CHARS)</span>
                    <span>98% SCORE</span>
                  </div>
                  <p className={`text-xs font-semibold leading-snug truncate ${
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
                    const slotWeights = [99, 96, 94, 92, 90, 88];
                    const weightPct = slotWeights[kIdx] || 85;
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
                        <span
                          className={`text-[9px] font-mono px-1 rounded ${
                            kIdx === 0
                              ? 'bg-emerald-500/25 text-emerald-300 dark:bg-emerald-600 dark:text-white font-bold'
                              : isLight
                              ? 'bg-emerald-100 text-emerald-800 font-semibold'
                              : 'bg-emerald-950 text-emerald-400 font-semibold'
                          }`}
                        >
                          {weightPct}%
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Store Switcher Dots & Instant Black-Ops X-Ray Trigger inside Specimen */}
              <div className="mt-4 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/80 flex items-center justify-between gap-2">
                {onOpenBlackOps ? (
                  <button
                    type="button"
                    onClick={onOpenBlackOps}
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition ${
                      isLight
                        ? 'text-emerald-700 hover:text-black'
                        : 'text-emerald-400 hover:text-emerald-300'
                    }`}
                  >
                    <Terminal className="w-3 h-3" />
                    <span>ALGO-HACK X-RAY READY · 49/49 LOCK</span>
                  </button>
                ) : (
                  <span className="text-[10.5px] text-neutral-400">
                    Hover or click any store below to preview
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
        {/* WORLD'S #1 METADATA × ALGORITHMIC HACK CONNECTION DECK       */}
        {/* ============================================================ */}
        <div
          data-bounce-card="true"
          className={`mt-10 rounded-2xl border p-5 sm:p-6 transition-all ${
            isLight
              ? 'bg-white/90 border-neutral-200/90 shadow-[0_12px_36px_-16px_rgba(14,165,233,0.12)]'
              : 'bg-[#0b0e13]/95 border-neutral-800/90 shadow-2xl'
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 mb-4 border-b border-neutral-200/70 dark:border-neutral-800/80">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>WORLD&apos;S #1 METADATA × ALGORITHMIC HACK ARCHITECTURE</span>
              </div>
              <h3
                className={`text-base sm:text-lg font-bold tracking-tight ${
                  isLight ? 'text-neutral-950' : 'text-white'
                }`}
              >
                Why Ordinary Metadata Fails — And How Our 4-Stage Algorithmic Hack Ranks #1
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {onOpenBlackOps && (
                <button
                  type="button"
                  onClick={onOpenBlackOps}
                  className={`px-3.5 py-2 rounded-xl text-[10.5px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border transition cursor-pointer ${
                    isLight
                      ? 'bg-neutral-950 hover:bg-black text-emerald-300 border-neutral-950'
                      : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Launch Black-Ops X-Ray (Ctrl+K)</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onNavigateView('upload')}
                className={`px-3.5 py-2 rounded-xl text-[10.5px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border transition cursor-pointer ${
                  isLight
                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/40'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Run Autopilot Studio</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                stage: 'STAGE 01 // PACKET INTERCEPT',
                title: '75% First-10 Slot Lock',
                metric: '99% SLOT #1 WEIGHT',
                desc: 'Adobe Stock gives 75% of all search ranking power to Keyword Slots #1–#10. Our engine locks your exact Title subject into Slot #1 automatically.',
              },
              {
                stage: 'STAGE 02 // BUYER INTENT HIJACK',
                title: '49/49 B2B Compound Taxonomy',
                metric: '$3.80–$19.50 RPD',
                desc: 'Replaces weak generic tags with high-paying Enterprise B2B compound search phrases that corporate agencies license at Extended rates.',
              },
              {
                stage: 'STAGE 03 // PIXEL LSB + EYE-TRACKING',
                title: 'RGB Bit-0 & 140ms Heatmap',
                metric: 'PHI=1.618 + STEGO',
                desc: 'Locks 49 tags inside Pixel RGB Bit-0 and runs a 140ms Neural Buyer Eye-Tracking Saliency Heatmap with Golden Ratio alignment.',
              },
              {
                stage: 'STAGE 04 // 10-MODULE BLACK-OPS',
                title: '6-Country & 50-Query Sim',
                metric: '100% PAGE-1 LOCK',
                desc: 'Interleaves English + Tokyo/Berlin/Paris/Seoul native buyer tags and runs a 50-Query Monte Carlo Rank #1 Simulator with 7-Series Empire export.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => (idx === 2 && onOpenBlackOps ? onOpenBlackOps() : onNavigateView('upload'))}
                className={`p-3.5 rounded-xl border transition cursor-pointer ${
                  isLight
                    ? 'bg-[#faf9f6] hover:bg-white border-neutral-200/80 hover:border-neutral-900'
                    : 'bg-[#11141c] hover:bg-[#151923] border-neutral-800/90 hover:border-emerald-500/40'
                }`}
              >
                <div className="flex items-center justify-between text-[9.5px] font-mono font-bold tracking-wider uppercase mb-1.5">
                  <span className="text-neutral-400">{item.stage}</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{item.metric}</span>
                </div>
                <div
                  className={`text-xs font-bold mb-1 ${
                    isLight ? 'text-neutral-950' : 'text-white'
                  }`}
                >
                  {item.title}
                </div>
                <p
                  className={`text-[11px] leading-relaxed ${
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
                  <div className="space-y-1 pt-0.5">
                    <div className="text-[9.5px] font-mono tracking-[0.13em] uppercase text-neutral-400 truncate">
                      {store.category}
                    </div>
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

                {/* Store Sub-Features Micro-List */}
                <div className={`mt-4 pt-3 border-t flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] font-medium ${
                  isLight ? 'border-neutral-100 text-neutral-500' : 'border-neutral-800/80 text-neutral-400'
                }`}>
                  {store.features.map((feat, fIdx) => (
                    <React.Fragment key={fIdx}>
                      <span>{feat}</span>
                      {fIdx < store.features.length - 1 && (
                        <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </section>

      {/* ============================================================ */}
      {/* ARCHITECTURAL WORKFLOW & MONETIZATION PROOF STRIP */}
      {/* ============================================================ */}
      <section id="why-choose-section" className={`relative z-10 border-t ${
        isLight ? 'border-neutral-200/70 bg-white' : 'border-neutral-900 bg-[#060709]'
      } py-14 transition-colors duration-200`}>
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div onClick={() => onNavigateView('upload')} className="space-y-1.5 cursor-pointer group">
              <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400 group-hover:text-amber-500 transition-colors">
                01 . 75% FIRST-10 LOCK
              </div>
              <h3 className={`text-sm font-bold tracking-tight ${isLight ? 'text-neutral-950' : 'text-white'}`}>
                Title-to-Slot #1 Correlation
              </h3>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Locks primary subjects and exact buyer search phrases into Slots #1–#10 for maximum Adobe Stock search weight.
              </p>
            </div>

            <div onClick={() => onNavigateView('upload')} className="space-y-1.5 cursor-pointer group">
              <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400 group-hover:text-emerald-500 transition-colors">
                02 . GHOSTSCRIPT EPS ENGINE
              </div>
              <h3 className={`text-sm font-bold tracking-tight ${isLight ? 'text-neutral-950' : 'text-white'}`}>
                119ms True Vector Rendering
              </h3>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Renders PostScript `.eps` and `.ai` vectors into crisp previews in 119ms and prioritizes subject keywords first.
              </p>
            </div>

            <div onClick={() => onNavigateView('seo-rank')} className="space-y-1.5 cursor-pointer group">
              <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400 group-hover:text-amber-500 transition-colors">
                03 . BUYER PSYCHOLOGY
              </div>
              <h3 className={`text-sm font-bold tracking-tight ${isLight ? 'text-neutral-950' : 'text-white'}`}>
                49/49 Full-Capacity Taxonomy
              </h3>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Combines high-RPD B2B concepts, long-tail 3-word buyer phrases, and separated descriptive attributes.
              </p>
            </div>

            <div onClick={() => onNavigateView('monetize')} className="space-y-1.5 cursor-pointer group">
              <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400 group-hover:text-emerald-500 transition-colors">
                04 . DIRECT IPTC &amp; CSV
              </div>
              <h3 className={`text-sm font-bold tracking-tight ${isLight ? 'text-neutral-950' : 'text-white'}`}>
                1-Click Embedded Export
              </h3>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Embeds EXIF/IPTC/XMP directly into JPGs &amp; EPS files and exports 100% compliant CSVs for all 5 agencies.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
