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
  const [mouseSpotlight, setMouseSpotlight] = useState<{ x: number; y: number }>({ x: 650, y: 260 });
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [countedWeight, setCountedWeight] = useState<number>(0);
  const [countedTags, setCountedTags] = useState<number>(0);

  const isLight = themeMode === 'light';
  const isBn = false;

  useEffect(() => {
    const root = document.documentElement;
    root.removeAttribute('data-skin');
  }, [isLight]);

  // Intelligent Navigation State & Smooth Counting Magic Moment on Awakening
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let frame = 0;
    const totalFrames = 36;
    const counterTimer = setInterval(() => {
      frame += 1;
      const progress = Math.min(1, frame / totalFrames);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCountedWeight(Math.round(75 * eased));
      setCountedTags(Math.round(49 * eased));
      if (frame >= totalFrames) clearInterval(counterTimer);
    }, 24);

    return () => {
      window.removeEventListener('scroll', onScroll);
      clearInterval(counterTimer);
    };
  }, []);

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

  const skinPalette = isLight
    ? {
        orbOne: 'bg-amber-300/25',
        orbTwo: 'bg-emerald-300/20',
        orbThree: 'bg-sky-300/20',
        horizonBeam: 'from-transparent via-amber-500/50 to-transparent',
        spotlightColor: 'rgba(212, 175, 55, 0.09)',
        accentBadge: 'text-amber-700 border-amber-400/50 bg-amber-500/10',
      }
    : {
        orbOne: 'bg-amber-500/18',
        orbTwo: 'bg-emerald-500/18',
        orbThree: 'bg-sky-500/14',
        horizonBeam: 'from-transparent via-amber-400/80 to-transparent',
        spotlightColor: 'rgba(212, 175, 55, 0.11)',
        accentBadge: 'text-amber-300 border-amber-400/40 bg-amber-500/15',
      };

  return (
    <div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMouseSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      className={`relative w-full overflow-hidden bg-transparent ${
        isLight ? 'text-[#111215]' : 'text-[#f4f4f6]'
      } font-sans transition-colors duration-500`}
    >

      {/* Interactive Cursor-Tracked Prismatic Aura Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(720px circle at ${mouseSpotlight.x}px ${mouseSpotlight.y}px, ${skinPalette.spotlightColor}, transparent 70%)`,
        }}
      />

      {/* Top Specular Prismatic Horizon Line */}
      <div className="pointer-events-none select-none absolute inset-x-0 top-0 h-24 overflow-hidden z-0">
        <div
          className={`absolute top-16 inset-x-0 h-[1px] bg-gradient-to-r ${skinPalette.horizonBeam} opacity-80`}
        />
      </div>

      {/* ============================================================ */}
      {/* FLOATING 3D OPTICAL CRYSTAL GLASS HEADER (DAY & NIGHT MODE) */}
      {/* ============================================================ */}
      <header className={`sticky top-0 z-50 w-full px-4 sm:px-8 lg:px-14 transition-all duration-300 ${
        isScrolled ? 'pt-2' : 'pt-4'
      }`}>
        <div className={`max-w-[1440px] mx-auto px-6 sm:px-9 rounded-2xl flex items-center justify-between gap-6 transition-all duration-300 ${
          isScrolled ? 'h-14 shadow-2xl' : 'h-16'
        } ${
          isLight
            ? 'crystal-glass-panel-light'
            : 'crystal-glass-panel-dark'
        }`}>
          
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

          {/* Zone 2: Clean Editorial Navigation Links */}
          <nav className="hidden lg:flex items-center gap-9 text-[12px] font-medium tracking-[0.05em]">
            <button
              onClick={() => {
                setActiveDepartment('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`lumina-directional-link cursor-pointer relative py-1 whitespace-nowrap ${
                activeDepartment === 'all'
                  ? (isLight ? 'text-black font-semibold' : 'text-white font-semibold') 
                  : (isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white')
              }`}
            >
              <span>{isBn ? 'মার্কেট' : 'Workspace'}</span>
              {activeDepartment === 'all' && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-emerald-400 via-amber-400 to-sky-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => onNavigateView('upload')}
              className={`lumina-directional-link cursor-pointer relative py-1 whitespace-nowrap ${
                isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>{isBn ? 'স্টুডিও' : 'Studio'}</span>
            </button>

            <button
              onClick={() => onNavigateView('seo-rank')}
              className={`lumina-directional-link cursor-pointer relative py-1 whitespace-nowrap ${
                isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>{isBn ? 'সার্চ এসইও' : 'Search SEO'}</span>
            </button>

            <button
              onClick={() => onNavigateView('calendar')}
              className={`lumina-directional-link cursor-pointer relative py-1 whitespace-nowrap ${
                isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>{isBn ? 'ক্যালেন্ডার' : 'Calendar'}</span>
            </button>

            <button
              onClick={() => onNavigateView('monetize')}
              className={`hidden xl:inline-flex lumina-directional-link cursor-pointer relative py-1 whitespace-nowrap ${
                isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>{isBn ? 'আয় ও মনিটাইজ' : 'Monetize'}</span>
            </button>
          </nav>

          {/* Zone 3: Pre-Check + Controls + Day/Night Mode + Studio CTA */}
          <div className="flex items-center gap-2.5 shrink-0 relative">
            {onOpenProToolkit && (
              <button
                type="button"
                onClick={() => onOpenProToolkit('presubmit')}
                className={`lumina-tactile-button px-3.5 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 border cursor-pointer ${
                  isLight
                    ? 'bg-emerald-50/90 hover:bg-emerald-100 text-emerald-900 border-emerald-300/80'
                    : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/35'
                }`}
                title="Pre-Submission Checker, Rejection Helper, AI Disclosure & Earnings Tracker"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline">Audit</span>
              </button>
            )}

            {/* Consolidated Quick Controls & Modes Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowHeaderControlsMenu((prev) => !prev)}
                className={`lumina-tactile-button px-3 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 border cursor-pointer ${
                  showHeaderControlsMenu
                    ? isLight
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-black border-white'
                    : isLight
                    ? 'bg-white/80 hover:bg-white text-neutral-700 border-neutral-200/90'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/15'
                }`}
                title="More Tools, Black-Ops Terminal, Lite Mode & Display Settings"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{isBn ? 'কন্ট্রোল' : 'System'}</span>
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
              className={`lumina-tactile-button text-[11px] font-semibold tracking-[0.06em] px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs group ${
                isLight
                  ? 'bg-neutral-950 hover:bg-black text-white'
                  : 'bg-white hover:bg-neutral-200 text-black'
              }`}
            >
              <span className="transition-transform duration-200 group-hover:-translate-x-0.5">{isBn ? 'স্টুডিও খুলুন' : 'Open Studio'}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>

        </div>
      </header>

      {/* ============================================================ */}
      {/* ULTRA-MINIMAL EXECUTIVE ARCHITECTURAL HERO (MAXIMUM SPACE)   */}
      {/* ============================================================ */}
      <div className="relative z-10 pt-8 sm:pt-12 pb-16 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14">
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.992 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className={`rounded-[28px] p-8 sm:p-12 lg:p-16 relative overflow-hidden transition-all duration-500 ${
            isLight ? 'crystal-architectural-slab-light' : 'crystal-architectural-slab-dark'
          }`}
        >
          {/* Top-Left Specular Glass Reflection Glint */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 inset-x-12 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center relative z-10">
          
          {/* Left 7 Columns: Progressive Hero Awakening Typography & Dropzone */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-7 text-left"
          >
            {/* Unboxed Editorial Kicker with Smooth Counting Metrics */}
            <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-mono tracking-[0.08em] uppercase tabular-nums text-emerald-600 dark:text-emerald-400">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Zero-Error Vision Engine</span>
              <span aria-hidden="true" className="opacity-35">/</span>
              <span>{countedTags}-Tag Precision</span>
              <span aria-hidden="true" className="opacity-35">/</span>
              <span>{countedWeight}% Top-10 Weight</span>
            </div>

            {/* Editorial Display Headline */}
            <h1 className={`text-[38px] sm:text-[52px] xl:text-[62px] font-bold tracking-[-0.04em] leading-[1.04] text-balance ${
              isLight ? 'text-neutral-950' : 'text-white'
            }`}>
              Precision Stock{' '}
              <span className="font-editorial italic font-normal luxury-headline-gradient">
                Metadata
              </span>{' '}
              Architecture.
            </h1>

            <p className={`text-[15px] sm:text-[16px] font-normal max-w-xl leading-[1.65] ${
              isLight ? 'text-neutral-600' : 'text-neutral-300'
            }`}>
              Drop any EPS vector, PSD, or high-res photo, or press <kbd className="px-1.5 py-0.5 text-[11px] font-mono rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Ctrl+V</kbd>. Generates 100% visually verified titles, zero-duplicate keywords, and ready-to-submit agency CSVs.
            </p>

            {/* Instant Minimalist Executive Dropzone Bar */}
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
              className={`p-5 sm:p-6 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 sovereign-prism-card group ${
                isHeroDragging
                  ? 'border-emerald-400 bg-emerald-500/15 scale-[1.01]'
                  : isLight
                  ? 'crystal-glass-panel-light hover:border-neutral-900'
                  : 'crystal-glass-panel-dark hover:border-amber-400/50'
              }`}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border backdrop-blur-xl transition-transform duration-300 group-hover:scale-105 ${
                  isLight
                    ? 'bg-neutral-950 text-amber-300 border-neutral-800 shadow-sm'
                    : 'bg-white/10 text-amber-300 border-white/20'
                }`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-xs sm:text-sm font-semibold flex flex-wrap items-center gap-2 ${
                    isLight ? 'text-neutral-950' : 'text-white'
                  }`}>
                    <span>Drop EPS, AI, PSD, JPG or Paste (Ctrl+V)</span>
                  </div>
                  <div className={`text-[11.5px] mt-0.5 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    100% Ground-Truth Vision · {countedTags} Pure Keywords · Instant CSV &amp; XMP
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 relative z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onWatchDemo();
                  }}
                  className={`lumina-tactile-button px-3.5 py-2.5 rounded-xl text-[11.5px] font-semibold border cursor-pointer backdrop-blur-md ${
                    isLight
                      ? 'bg-white/80 hover:bg-white text-neutral-800 border-neutral-200/90'
                      : 'bg-white/5 hover:bg-white/10 text-neutral-200 border-white/15'
                  }`}
                >
                  Live Demo
                </button>
                <span className={`lumina-tactile-button px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm ${
                  isLight
                    ? 'bg-neutral-950 text-white'
                    : 'bg-white text-neutral-950'
                }`}>
                  <span>Select Files</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right 5 Columns: Live Interactive Store Telemetry & SEO Specimen Card */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div
              data-bounce-card="true"
              onMouseEnter={() => setIsHoveringSpecimen(true)}
              onMouseLeave={() => setIsHoveringSpecimen(false)}
              className={`rounded-2xl p-6 sm:p-7 transition-all duration-300 relative overflow-hidden phantom-monolith-card sovereign-prism-card ${
              isLight
                ? 'crystal-glass-panel-light'
                : 'crystal-glass-panel-dark'
            }`}>
              {/* Top Specimen Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-200/60 dark:border-white/10">
                <div className="flex items-center gap-2 text-[10.5px] font-mono tracking-[0.06em] uppercase tabular-nums text-neutral-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Specimen · {activePreviewStore.storeNumber}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenStore(activePreviewStore)}
                  className={`lumina-directional-link text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
                    isLight ? 'text-neutral-900 hover:text-amber-600' : 'text-white hover:text-amber-400'
                  }`}
                >
                  <span>{activePreviewStore.ctaText}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Specimen Visual & Before/After Title Comparison */}
              <div className="flex items-start gap-4 mb-5">
                <img
                  src={activePreviewStore.image}
                  alt={activePreviewStore.title}
                  className="w-20 h-16 rounded-xl object-cover border border-neutral-200/60 dark:border-white/10 shrink-0 transition-transform duration-500 hover:scale-105"
                />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center justify-between text-[10.5px] font-mono tabular-nums">
                    <span className="text-neutral-400">
                      Adobe Stock Title
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {activePreviewStore.sampleTitle.length}/70 chars · 100% Pure
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
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[10.5px] font-mono tabular-nums text-neutral-400">
                  <span>Top-10 Priority Keywords ({countedWeight}% Weight)</span>
                  <button
                    type="button"
                    onClick={(e) => handleQuickCopyTags(activePreviewStore, e)}
                    className={`font-sans font-semibold text-[11px] flex items-center gap-1 cursor-pointer ${
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
                        <span>Copy</span>
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
                            ? 'bg-white/70 text-neutral-700 border-neutral-200/80'
                            : 'bg-white/[0.04] text-neutral-300 border-white/10'
                        }`}
                      >
                        <span className="text-[9.5px] font-mono tabular-nums opacity-55">0{kIdx + 1}</span>
                        <span>{kw}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Store Switcher Dots & Metadata Inspector Trigger */}
              <div className="mt-5 pt-3.5 border-t border-neutral-200/60 dark:border-white/10 flex items-center justify-between gap-2">
                {onOpenBlackOps ? (
                  <button
                    type="button"
                    onClick={onOpenBlackOps}
                    className={`lumina-directional-link text-[11px] font-medium flex items-center gap-1.5 cursor-pointer transition ${
                      isLight
                        ? 'text-neutral-600 hover:text-black'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Binary &amp; Competitor Inspector (Ctrl+K)</span>
                  </button>
                ) : (
                  <span className="text-[10.5px] text-neutral-400">
                    Select any module below to launch
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
          {/* INTEGRATED ARCHITECTURAL HAIRLINE SUITE (MINIMALIST RIBBON)  */}
          {/* ============================================================ */}
          <div className="mt-12 pt-8 border-t border-neutral-200/70 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {[
              {
                tab: 'presubmit' as const,
                stage: '01 / PRE-CHECK',
                title: '4MP, EPS & Trademark Audit',
                desc: 'Verify resolution, vector compatibility & zero trademark risk.',
              },
              {
                tab: 'rejection' as const,
                stage: '02 / COMPLIANCE',
                title: 'Rejection Fix & AI Disclosure',
                desc: 'Resolve moderation flags & validate generative AI compliance.',
              },
              {
                tab: 'kwscore' as const,
                stage: '03 / EMBEDDING',
                title: 'IPTC & XMP Direct Writer',
                desc: 'Embed verified Title & 49 Keywords directly into JPG & EPS.',
              },
              {
                tab: 'tracker' as const,
                stage: '04 / TELEMETRY',
                title: 'Submission & Royalty Tracker',
                desc: 'Monitor portfolio approval rates & high-earning stock niches.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() =>
                  onOpenProToolkit ? onOpenProToolkit(item.tab) : onNavigateView('upload')
                }
                className={`p-4 rounded-2xl transition cursor-pointer group sovereign-prism-card ${
                  isLight
                    ? 'bg-white/55 hover:bg-white/90 border border-neutral-200/70 hover:border-neutral-900'
                    : 'bg-white/[0.025] hover:bg-white/[0.06] border border-white/10 hover:border-white/25'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono tracking-[0.12em] uppercase mb-1.5 text-emerald-600 dark:text-emerald-400">
                  <span>{item.stage}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div
                  className={`text-xs font-semibold mb-1 ${
                    isLight ? 'text-neutral-950' : 'text-white'
                  }`}
                >
                  {item.title}
                </div>
                <p
                  className={`text-[11px] leading-relaxed line-clamp-1 ${
                    isLight ? 'text-neutral-500' : 'text-neutral-400'
                  }`}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* MINIMALIST ARCHITECTURAL DIRECTORY HEADER & FILTER BAR       */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 pt-2 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        >
          <div className="space-y-1">
            <div className="text-[10.5px] font-mono tracking-[0.16em] uppercase text-emerald-600 dark:text-emerald-400">
              01 / ENTERPRISE MODULES
            </div>
            <h2 className={`text-xl sm:text-2xl font-bold tracking-[-0.025em] ${
              isLight ? 'text-neutral-950' : 'text-white'
            }`}>
              Specialized Creative Workspaces
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Modules (08)' },
              { id: 'metadata', label: 'Metadata & SEO (03)' },
              { id: 'creative', label: 'Calendar & Prompts (03)' },
              { id: 'monetize', label: 'Royalty & CSV (02)' },
            ].map((tab) => {
              const isActive = activeDepartment === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveDepartment(tab.id as any)}
                  className={`lumina-tactile-button text-[11px] font-semibold px-4 py-2 rounded-xl border transition cursor-pointer whitespace-nowrap backdrop-blur-md ${
                    isActive
                      ? isLight
                        ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                        : 'bg-white text-black border-white'
                      : isLight
                      ? 'crystal-glass-panel-light text-neutral-700 hover:border-neutral-900 hover:text-black'
                      : 'crystal-glass-panel-dark text-neutral-300 hover:border-white/40 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ============================================================ */}
      {/* ARCHITECTURAL BOUTIQUE GALLERY GRID (GENEROUS BREATHING ROOM) */}
      {/* ============================================================ */}
      <section className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 pb-28">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
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
                className={`group cursor-pointer rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 sovereign-prism-card ${
                  isLight
                    ? 'crystal-glass-panel-light hover:border-neutral-900'
                    : 'crystal-glass-panel-dark hover:border-amber-400/50'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Store Number & Live Status Line (Zero-Pill Unboxed Metadata) */}
                  <div className="flex items-center justify-between text-[10px] font-mono tabular-nums tracking-[0.14em] uppercase text-neutral-400">
                    <span>{store.storeNumber}</span>
                    <span className={isLight ? 'text-neutral-700 font-semibold' : 'text-neutral-300 font-semibold'}>
                      {store.statLabel}
                    </span>
                  </div>

                  {/* Signature Architectural Cover Image Card */}
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-neutral-900">
                    <img
                      src={store.image}
                      alt={store.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {/* Subtle Contrast Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent opacity-65 group-hover:opacity-80 transition-opacity duration-300" />

                    {/* Subtle Top-Left Store Kicker */}
                    <div className="absolute top-3 left-3.5 text-[9px] font-mono font-semibold tracking-[0.16em] uppercase text-white/95">
                      {store.badge}
                    </div>

                    {/* Quick Sample SEO Copy Button on Top-Right */}
                    {store.sampleKeywords && (
                      <button
                        type="button"
                        onClick={(e) => handleQuickCopyTags(store, e)}
                        className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg text-[9.5px] font-semibold bg-white/95 hover:bg-white text-black flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-xs cursor-pointer whitespace-nowrap"
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
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white">
                      <span className="text-[10.5px] font-semibold tracking-[0.12em] uppercase">
                        {store.ctaText}
                      </span>
                      <span className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center transform group-hover:translate-x-0.5 transition-transform shadow-xs">
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  {/* Details Typography Block */}
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
