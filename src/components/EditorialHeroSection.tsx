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
  SlidersHorizontal,
  Settings,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { AdobeMetaProLogo } from './AdobeMetaProLogo';
import { GlobalAssetStoreVault, GlobalStorePack } from './GlobalAssetStoreVault';
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
  onLogout?: () => void;
  onOpenSettings?: () => void;
  onToggleTheme: () => void;
  themeMode: 'light' | 'dark';
  gen10Skin?: 'velvet' | 'black';
  user: any;
  onNavigateView: (view: string) => void;
  onOpenMultiCsv?: () => void;
  onOpenToolsHub?: () => void;
  onOpenChat?: () => void;
  currentView?: string;
  itemsCount?: number;
  onOpenProToolkit?: (tab?: 'presubmit' | 'rejection' | 'aidisclosure' | 'tracker' | 'embed' | 'kwscore') => void;
  onOpenCommandPalette?: () => void;
  isLiteMode?: boolean;
  onToggleLiteMode?: () => void;
  uiLang?: 'en' | 'bn';
  onToggleLang?: () => void;
  onLoadStorePack?: (pack: GlobalStorePack) => void;
  showToast?: (msg: string) => void;
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
  onOpenLogin,
  onLogout,
  onOpenSettings,
  onToggleTheme,
  themeMode,
  gen10Skin = 'velvet',
  user,
  onNavigateView,
  onOpenMultiCsv,
  onOpenToolsHub,
  onOpenChat,
  itemsCount = 0,
  onOpenProToolkit,
  onOpenCommandPalette,
  isLiteMode = false,
  onToggleLiteMode,
  uiLang = 'en',
  onToggleLang,
  onLoadStorePack,
  showToast
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
  const [activeSpecimenAgency, setActiveSpecimenAgency] = useState<'adobe' | 'shutterstock' | 'freepik' | 'getty' | 'vecteezy'>('adobe');
  const [customSpecimenTitle, setCustomSpecimenTitle] = useState<string>('');
  const [customSpecimenTags, setCustomSpecimenTags] = useState<string[]>([]);
  const [heroTilt, setHeroTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });

  const isLight = themeMode === 'light';
  const isBn = false;

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
      title: '7-Agency CSV & Compliance Hub',
      category: 'EXPORT HUB · ADOBE · SHUTTERSTOCK · FREEPIK · GETTY',
      department: 'monetize',
      image: store08MultiCsvHub,
      badge: '7-AGENCY SUITE',
      statLabel: '7 Agencies + JSON',
      description: 'Export formatted metadata CSVs for Adobe Stock, Shutterstock, Freepik, Getty, Vecteezy, 123RF, and Dreamstime in 1 click.',
      features: ['7-Agency CSV Hub', 'SEO Slug Renamer', 'Master JSON Export'],
      ctaText: 'Open 7-Agency CSV Hub',
      actionType: 'modal_csv',
      sampleTitle: 'Luxury Embossed Gold Foil Stationery Mockup On Travertine Stone',
      sampleKeywords: ['luxury stationery mockup', 'embossed gold foil', 'travertine stone', 'corporate identity', 'minimalist branding', 'editorial presentation', 'brand guidelines', 'paper texture']
    }
  ];

  const filteredStores = activeDepartment === 'all'
    ? marketStores
    : marketStores.filter(s => s.department === activeDepartment);

  const activePreviewStore = marketStores[previewStoreIdx] || marketStores[0];

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
        orbOne: 'bg-white/90',
        orbTwo: 'bg-amber-100/45',
        orbThree: 'bg-stone-200/40',
        horizonBeam: 'from-transparent via-amber-700/25 to-transparent',
        spotlightColor: 'rgba(255, 255, 255, 0.5)',
        accentBadge: 'text-amber-900 border-amber-400/50 bg-amber-500/10',
      }
    : {
        orbOne: 'bg-white/[0.025]',
        orbTwo: 'bg-neutral-900/40',
        orbThree: 'bg-white/[0.015]',
        horizonBeam: 'from-transparent via-white/35 to-transparent',
        spotlightColor: 'rgba(255, 255, 255, 0.045)',
        accentBadge: 'text-white border-white/25 bg-white/10',
      };

  return (
    <div
      className={`relative w-full overflow-hidden bg-transparent ${
        isLight ? 'text-[#111215]' : 'text-[#f4f4f6]'
      } font-sans transition-colors duration-500`}
    >

      {/* ============================================================ */}
      {/* FLOATING 3D OPTICAL CRYSTAL GLASS HEADER (DAY & NIGHT MODE) */}
      {/* ============================================================ */}
      <header className={`sticky top-0 z-50 w-full px-4 sm:px-8 lg:px-14 transition-all duration-300 ${
        isScrolled ? 'pt-2' : 'pt-4'
      }`}>
        <div className={`max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-7 rounded-2xl flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300 ${
          isScrolled ? 'h-14 shadow-2xl' : 'h-16'
        } ${
          isLight
            ? 'crystal-glass-panel-light'
            : 'crystal-glass-panel-dark'
        }`}>
          
          {/* Zone 1: Brand Identity */}
          <div className="flex items-center shrink-0 min-w-0">
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
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-[12px] font-medium tracking-[0.04em] min-w-0">
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
                <span className={`absolute bottom-0 left-0 right-0 h-[1.5px] rounded-full ${isLight ? 'bg-neutral-950' : 'bg-white'}`} />
              )}
            </button>

            <button
              onClick={() => {
                const storeEl = document.getElementById('global-commercial-store-vault');
                if (storeEl) storeEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`lumina-directional-link cursor-pointer relative py-1 whitespace-nowrap ${
                isLight ? 'text-neutral-900 hover:text-black font-semibold' : 'text-white hover:text-neutral-200 font-semibold'
              }`}
            >
              <span>Global Store</span>
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

          {/* Zone 3: Minimalist Command Trigger + System Menu + Day/Night Mode + Primary Studio CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 relative">
            {onOpenCommandPalette && (
              <button
                type="button"
                onClick={onOpenCommandPalette}
                className={`lumina-tactile-button px-2.5 py-1.5 rounded-xl text-[11px] font-mono hidden md:flex items-center gap-2 border cursor-pointer ${
                  isLight
                    ? 'bg-[#faf8f5] hover:bg-neutral-100 text-neutral-600 hover:text-neutral-950 border-neutral-200/90'
                    : 'bg-white/[0.03] hover:bg-white/[0.08] text-neutral-400 hover:text-white border-white/10'
                }`}
                title="Quick Command & Search Palette (⌘K or Ctrl+K)"
              >
                <span>Search</span>
                <kbd className={`px-1.5 py-0.5 text-[9.5px] rounded font-mono ${
                  isLight ? 'bg-neutral-200/70 text-neutral-700' : 'bg-white/10 text-neutral-300'
                }`}>⌘K</kbd>
              </button>
            )}

            {/* Consolidated System, Audit, Studio Desk & Account Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowHeaderControlsMenu((prev) => !prev)}
                className={`lumina-tactile-button px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 border cursor-pointer relative ${
                  showHeaderControlsMenu
                    ? isLight
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-black border-white'
                    : isLight
                    ? 'bg-white/80 hover:bg-white text-neutral-700 border-neutral-200/90'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/15'
                }`}
                title="Pre-Check Audit, Studio Desk, Performance & Account Settings"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isBn ? 'কন্ট্রোল' : 'System'}</span>
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
                        {isBn ? 'টুলস এবং পারফরম্যান্স' : 'WORKSPACE & TOOLS'}
                      </div>

                      {onOpenProToolkit && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowHeaderControlsMenu(false);
                            onOpenProToolkit('presubmit');
                          }}
                          className={`w-full px-3 py-2 rounded-xl text-left text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                            isLight ? 'hover:bg-neutral-100' : 'hover:bg-neutral-800/80'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Pre-Submit Audit &amp; Tracker</span>
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
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
                            <span>{isBn ? 'স্টুডিও ডেস্ক' : 'Studio Desk & Concierge'}</span>
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
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
                          <span>{isBn ? 'লাইট মোড (ফাস্ট ফোন)' : 'Lite Performance Mode'}</span>
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

                      {onOpenSettings && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowHeaderControlsMenu(false);
                            onOpenSettings();
                          }}
                          className={`w-full px-3 py-2 rounded-xl text-left text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                            isLight ? 'hover:bg-neutral-100' : 'hover:bg-neutral-800/80'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Settings className="w-3.5 h-3.5 text-amber-400" />
                            <span>{isBn ? 'স্টুডিও প্রেফারেন্স ও থিম' : 'Studio Preferences & Theme'}</span>
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                        </button>
                      )}

                      <div className={`my-1.5 border-t ${isLight ? 'border-neutral-200' : 'border-neutral-800'}`} />

                      <div className="px-2.5 pt-0.5 text-[9.5px] font-mono uppercase tracking-[0.16em] text-neutral-400">
                        {isBn ? 'অ্যাকাউন্ট ও সেশন' : 'ACCOUNT & SESSION'}
                      </div>

                      {user ? (
                        <div className="space-y-1.5 pt-0.5">
                          <div className={`px-3 py-2 rounded-xl border flex items-center gap-2.5 ${
                            isLight ? 'bg-neutral-50 border-neutral-200/80' : 'bg-neutral-900/80 border-neutral-800'
                          }`}>
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 font-bold text-xs shrink-0">
                              {(user.displayName || user.email || 'U')[0].toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-[11px] font-bold truncate">
                                {user.displayName || user.email?.split('@')[0] || 'Contributor'}
                              </div>
                              <div className="text-[10px] text-neutral-400 truncate">
                                {user.email || 'Active Studio Session'}
                              </div>
                            </div>
                          </div>

                          {onLogout && (
                            <button
                              type="button"
                              onClick={() => {
                                setShowHeaderControlsMenu(false);
                                onLogout();
                              }}
                              className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold flex items-center justify-between bg-red-500/15 hover:bg-red-500/25 text-red-500 dark:text-red-400 border border-red-500/30 transition cursor-pointer"
                            >
                              <span className="flex items-center gap-2">
                                <LogOut className="w-3.5 h-3.5" />
                                <span>{isBn ? 'লগ আউট করুন (Log Out)' : 'Log Out / Sign Out'}</span>
                              </span>
                              <span className="text-[9.5px] font-mono uppercase px-1.5 py-0.5 rounded bg-red-500/20">
                                EXIT
                              </span>
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-1.5 pt-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              setShowHeaderControlsMenu(false);
                              onOpenLogin();
                            }}
                            className={`w-full px-3 py-2 rounded-xl text-left text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                              isLight
                                ? 'bg-neutral-900 hover:bg-black text-white'
                                : 'bg-white hover:bg-neutral-200 text-neutral-950'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <UserIcon className="w-3.5 h-3.5 text-emerald-500" />
                              <span>{isBn ? 'লগইন / অ্যাকাউন্ট খুলুন' : 'Sign In / Create Account'}</span>
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                          </button>

                          {onLogout && (
                            <button
                              type="button"
                              onClick={() => {
                                setShowHeaderControlsMenu(false);
                                onLogout();
                              }}
                              className="w-full px-3 py-1.5 rounded-xl text-left text-[11px] font-semibold flex items-center justify-between text-red-500 dark:text-red-400 hover:bg-red-500/10 border border-red-500/20 transition cursor-pointer"
                            >
                              <span className="flex items-center gap-2">
                                <LogOut className="w-3.5 h-3.5" />
                                <span>{isBn ? 'লগ আউট / সেশন রিসেট' : 'Log Out / Clear Session'}</span>
                              </span>
                            </button>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme mode (Pure Black / Warm Sunlight)"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer ${
                isLight 
                  ? 'text-neutral-700 hover:text-black hover:bg-neutral-200/50' 
                  : 'text-neutral-300 hover:text-white hover:bg-white/10'
              }`}
              title={
                isLight
                  ? 'Current: Warm Sunlight · Click for Pure Premium Black'
                  : 'Current: Pure Premium Black · Click for Warm Sunlight'
              }
            >
              {isLight ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => onNavigateView('upload')}
              className={`lumina-tactile-button text-[11px] font-semibold tracking-[0.04em] px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs group shrink-0 ${
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
      {/* REFINED ARCHITECTURAL LUXURY HERO MONOLITH                   */}
      {/* ============================================================ */}
      <div className="relative z-10 pt-12 sm:pt-16 pb-28 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14">
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.992 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setMouseSpotlight({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
          }}
          className={`rounded-[32px] p-7 sm:p-12 lg:p-16 xl:p-20 relative overflow-hidden transition-all duration-500 sovereign-prism-card ${
            isLight ? 'crystal-architectural-slab-light' : 'crystal-architectural-slab-dark'
          }`}
        >
          {/* Interactive Cursor-Tracking Warm Champagne AmbientCaustic Spotlight */}
          {!isLiteMode && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 transition-opacity duration-500"
              style={{
                background: `radial-gradient(640px circle at ${mouseSpotlight.x}px ${mouseSpotlight.y}px, ${skinPalette.spotlightColor}, transparent 70%)`,
              }}
            />
          )}

          {/* Top-Left & Bottom-Right Warm Champagne & Velvet Refraction Orbs */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute -top-28 -left-24 w-[440px] h-[440px] rounded-full blur-[115px] ${skinPalette.orbOne}`}
          />
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute -bottom-28 -right-24 w-[440px] h-[440px] rounded-full blur-[125px] ${skinPalette.orbTwo}`}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 inset-x-10 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 inset-x-24 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent"
          />

          {/* Minimalist Editorial Kicker at Top of Hero */}
          <div className={`mb-7 sm:mb-8 pb-4 border-b flex flex-wrap items-center justify-between gap-3 relative z-10 ${
            isLight ? 'border-neutral-200/70' : 'border-white/10'
          }`}>
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono tracking-[0.12em] uppercase tabular-nums">
              <span className={isLight ? 'text-neutral-950 font-semibold' : 'text-white font-semibold'}>
                CONTRIBUTOR ATELIER
              </span>
              <span aria-hidden="true" className="opacity-30">·</span>
              <span className={isLight ? 'text-neutral-600' : 'text-neutral-300'}>
                49 Weighted Keywords
              </span>
              <span aria-hidden="true" className="opacity-30">·</span>
              <span className={isLight ? 'text-neutral-600' : 'text-neutral-300'}>
                Top-10 Priority Control
              </span>
              <span aria-hidden="true" className="opacity-30 hidden sm:inline">·</span>
              <span className={isLight ? 'hidden sm:inline text-neutral-700' : 'hidden sm:inline text-neutral-300'}>
                7-Agency CSV &amp; IPTC
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2.5 text-[10.5px] font-mono tabular-nums text-neutral-400">
              <span>Vector EPS · JPG · 4K</span>
              <span aria-hidden="true">·</span>
              <span className={isLight ? 'text-neutral-900 font-medium' : 'text-white font-medium'}>Direct Embed</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-stretch relative z-10">
          
          {/* Left 7 Columns: Progressive Hero Awakening Typography & Dropzone */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-between space-y-6 text-left"
          >
            <div className="space-y-5">
              {/* Editorial Display Headline with Explicit Line Rhythm (Zero Awkward Word Gaps) */}
              <h1 className={`text-[38px] sm:text-[52px] xl:text-[62px] font-bold tracking-[-0.034em] leading-[1.06] ${
                isLight ? 'text-neutral-950' : 'text-white'
              }`}>
                <span className="block">
                  Precision Stock{' '}
                  <span className="font-editorial italic font-semibold text-[1.08em] luxury-headline-gradient pr-1.5 tracking-[-0.015em]">
                    Metadata
                  </span>
                </span>
                <span className="block mt-1">
                  &amp;{' '}
                  <span className="font-editorial italic font-medium text-[1.06em] tracking-[-0.015em]">
                    Editorial
                  </span>{' '}
                  Craft.
                </span>
              </h1>

              <p className={`text-[15.5px] sm:text-[16.5px] font-normal max-w-xl leading-[1.72] tracking-[-0.008em] ${
                isLight ? 'text-neutral-600' : 'text-neutral-300'
              }`}>
                A calm, high-precision workbench for commercial stock contributors. Inspect EPS vectors, fine-tune subject-first titles under 70 characters, lock your top 10 priority keywords, and export verified CSVs for 7 global agencies.
              </p>
            </div>

            <div className="space-y-4">
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
                className={`p-5 sm:p-6 rounded-2xl transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 sovereign-prism-card group ${
                  isHeroDragging
                    ? 'border-white bg-white/10'
                    : isLight
                    ? 'crystal-glass-panel-light hover:border-neutral-900'
                    : 'crystal-glass-panel-dark hover:border-white/35'
                }`}
              >
                <div className="flex items-center gap-3.5 relative z-10">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                    isLight
                      ? 'bg-neutral-950 text-white border-neutral-800'
                      : 'bg-white/[0.06] text-white border-white/15'
                  }`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-xs sm:text-sm font-semibold flex flex-wrap items-center gap-2 ${
                      isLight ? 'text-neutral-950' : 'text-white'
                    }`}>
                      <span>Open EPS, AI, PSD, JPG or 4K Footage in Workbench</span>
                    </div>
                    <div className={`text-[11.5px] mt-0.5 ${isLight ? 'text-neutral-500' : 'text-neutral-300'}`}>
                      Full Manual Title &amp; Tag Control · 49 Keywords · 7-Agency CSV &amp; IPTC Write
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
                    className={`lumina-tactile-button px-3.5 py-2.5 rounded-xl text-[11.5px] font-semibold border cursor-pointer ${
                      isLight
                        ? 'bg-[#faf8f5] hover:bg-neutral-100 text-neutral-800 border-neutral-300'
                        : 'bg-[#050506] hover:bg-white/10 text-neutral-200 border-white/15 hover:border-white/30'
                    }`}
                  >
                    Load Sample
                  </button>
                  <span className={`lumina-tactile-button px-4.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md ${
                    isLight
                      ? 'bg-neutral-950 text-white'
                      : 'bg-white text-black hover:bg-neutral-200'
                  }`}>
                    <span>Select Files</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>

              {/* Clean Directional Quick-Launch Links (Minimalist Editorial Typography) */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs font-medium">
                {onOpenMultiCsv && (
                  <>
                    <button
                      type="button"
                      onClick={onOpenMultiCsv}
                      className={`lumina-directional-link cursor-pointer gap-1.5 ${
                        isLight ? 'text-neutral-700 hover:text-black' : 'text-neutral-300 hover:text-white'
                      }`}
                    >
                      <span>7-Agency CSV Hub</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                    </button>
                    <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => onNavigateView('seo-rank')}
                  className={`lumina-directional-link cursor-pointer gap-1.5 ${
                    isLight ? 'text-neutral-700 hover:text-black' : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  <span>Title &amp; Top-10 Calibrator</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-75" />
                </button>
                <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                <button
                  type="button"
                  onClick={() => onNavigateView('monetize')}
                  className={`lumina-directional-link cursor-pointer gap-1.5 ${
                    isLight ? 'text-neutral-700 hover:text-black' : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  <span>Royalty &amp; AdSense Analytics</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </button>
                <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                <button
                  type="button"
                  onClick={() => {
                    const storeEl = document.getElementById('global-commercial-store-vault');
                    if (storeEl) storeEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`lumina-directional-link cursor-pointer gap-1.5 font-semibold ${
                    isLight ? 'text-neutral-950 hover:text-black' : 'text-white hover:text-neutral-200'
                  }`}
                >
                  <span>Global Store (588+ Tags)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right 5 Columns: Live Interactive Multi-Agency Manual Specimen Card */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col"
          >
            <div
              onMouseEnter={() => setIsHoveringSpecimen(true)}
              onMouseLeave={() => setIsHoveringSpecimen(false)}
              className={`rounded-2xl p-6 sm:p-7 relative overflow-hidden phantom-monolith-card sovereign-prism-card flex-1 flex flex-col justify-between ${
              isLight
                ? 'crystal-glass-panel-light'
                : 'crystal-glass-panel-dark'
            }`}>
              {/* Top Specimen Header + Minimalist Agency Selector */}
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-neutral-200/60 dark:border-white/10 gap-2">
                <div className="flex items-center gap-2 text-[10.5px] font-mono tracking-[0.08em] uppercase tabular-nums text-neutral-400 truncate">
                  <span>{activePreviewStore.storeNumber}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={activeSpecimenAgency}
                    onChange={(e) => setActiveSpecimenAgency(e.target.value as any)}
                    aria-label="Select agency format preview"
                    className={`text-[10.5px] font-mono font-semibold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-none ${
                      isLight
                        ? 'bg-white/90 border-neutral-200 text-neutral-800 hover:border-neutral-400'
                        : 'bg-white/[0.05] border-white/10 text-neutral-200 hover:border-white/25'
                    }`}
                  >
                    <option value="adobe">Adobe Stock (&lt;70c)</option>
                    <option value="shutterstock">Shutterstock (50 KW)</option>
                    <option value="freepik">Freepik (30 KW)</option>
                    <option value="getty">Getty / iStock (35 KW)</option>
                    <option value="vecteezy">Vecteezy (35 KW)</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleOpenStore(activePreviewStore)}
                    className={`lumina-directional-link text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
                      isLight ? 'text-neutral-900 hover:text-amber-600' : 'text-white hover:text-amber-400'
                    }`}
                  >
                    <span>Open</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Specimen Visual & Dynamic Interactive Agency Title Sandbox */}
              {(() => {
                const baseTitle = customSpecimenTitle || activePreviewStore.sampleTitle;
                const kws = customSpecimenTags.length > 0 ? customSpecimenTags : activePreviewStore.sampleKeywords;
                const formattedTitle =
                  activeSpecimenAgency === 'shutterstock'
                    ? `${baseTitle} featuring ${kws.slice(0, 3).join(', ')} for commercial design and enterprise marketing`
                    : activeSpecimenAgency === 'freepik'
                    ? `${baseTitle.slice(0, 56)} — Editable Commercial Asset`
                    : activeSpecimenAgency === 'getty'
                    ? `Conceptual B2B view of ${baseTitle.charAt(0).toLowerCase() + baseTitle.slice(1)}`
                    : activeSpecimenAgency === 'vecteezy'
                    ? `${baseTitle} (Scalable Commercial Graphic)`
                    : baseTitle;

                const agencyRuleBadge =
                  activeSpecimenAgency === 'adobe'
                    ? `${baseTitle.length}/70 chars`
                    : activeSpecimenAgency === 'shutterstock'
                    ? `50 Tags · Narrative`
                    : activeSpecimenAgency === 'freepik'
                    ? `30 Vector Tags`
                    : activeSpecimenAgency === 'getty'
                    ? `35 B2B Tags`
                    : `35 Clean Tags`;

                return (
                  <div className="flex items-start gap-4 mb-5">
                    <img
                      src={activePreviewStore.image}
                      alt={activePreviewStore.title}
                      className="w-20 h-16 rounded-xl object-cover border border-neutral-200/60 dark:border-white/10 shrink-0 transition-transform duration-500 hover:scale-105"
                    />
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-center justify-between text-[10.5px] font-mono tabular-nums">
                        <span className="text-neutral-400">
                          Subject-First Title
                        </span>
                        <span className={baseTitle.length <= 70 ? (isLight ? 'text-neutral-900 font-semibold' : 'text-white font-semibold') : 'text-amber-500 font-semibold'}>
                          {agencyRuleBadge}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={formattedTitle}
                        onChange={(e) => {
                          setIsHoveringSpecimen(true);
                          setCustomSpecimenTitle(e.target.value);
                        }}
                        title="Live Sandbox: Click to edit and test title character compliance"
                        className={`w-full text-xs font-semibold leading-snug rounded-lg px-2 py-1 -mx-1 border border-transparent hover:border-neutral-300 dark:hover:border-white/20 focus:border-white focus:outline-none transition ${
                          isLight ? 'bg-transparent focus:bg-white text-neutral-900' : 'bg-transparent focus:bg-neutral-950 text-neutral-100'
                        }`}
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Interactive First-10 Slot Lock Sandbox (Click any tag to promote to Slot #1) */}
              {(() => {
                const activeTags = customSpecimenTags.length > 0 ? customSpecimenTags : activePreviewStore.sampleKeywords;
                const agencySpecNote =
                  activeSpecimenAgency === 'adobe'
                    ? 'Adobe Rule: First 10 tags carry ~80% algorithmic search weight · Zero brand names'
                    : activeSpecimenAgency === 'shutterstock'
                    ? 'Shutterstock Rule: Up to 50 tags + descriptive editorial narrative caption'
                    : activeSpecimenAgency === 'freepik'
                    ? 'Freepik Rule: Top 30 vector & editable commercial design keywords'
                    : activeSpecimenAgency === 'getty'
                    ? 'Getty / iStock Rule: Conceptual B2B vocabulary · Strict disambiguation ready'
                    : 'Vecteezy Rule: Clean commercial vector tags · Zero spam or duplicate stems';
                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10.5px] font-mono tabular-nums text-neutral-400">
                      <span>Top Priority Keywords (Click to Lock #1)</span>
                      <span>01–08 / 49</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {activeTags.slice(0, 8).map((kw, kIdx) => {
                        return (
                          <button
                            key={kw}
                            type="button"
                            onClick={() => {
                              setIsHoveringSpecimen(true);
                              const reordered = [kw, ...activeTags.filter((t) => t !== kw)];
                              setCustomSpecimenTags(reordered);
                            }}
                            title={kIdx === 0 ? 'Locked at Slot #1 (99% Search Weight)' : `Click to promote "${kw}" to Slot #1`}
                            className={`text-[11px] px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 border transition cursor-pointer ${
                              kIdx === 0
                                ? isLight
                                  ? 'bg-neutral-950 text-white border-neutral-950 font-semibold'
                                  : 'bg-white text-black border-white font-bold shadow-xs'
                                : isLight
                                ? 'bg-white/70 hover:bg-white text-neutral-700 border-neutral-200/80'
                                : 'bg-[#050506] hover:bg-white/10 text-neutral-200 border-white/12 hover:border-white/30'
                            }`}
                          >
                            <span className="text-[9.5px] font-mono tabular-nums opacity-55">0{kIdx + 1}</span>
                            <span>{kw}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className={`text-[10.5px] font-mono pt-1 truncate ${
                      isLight ? 'text-neutral-500' : 'text-neutral-400'
                    }`}>
                      {agencySpecNote}
                    </div>
                  </div>
                );
              })()}

              {/* Store Switcher Dots & Single Active Format Copy Trigger */}
              <div className="mt-6 pt-4 border-t border-neutral-200/60 dark:border-white/10 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const baseTitle = customSpecimenTitle || activePreviewStore.sampleTitle;
                    const kws = customSpecimenTags.length > 0 ? customSpecimenTags : activePreviewStore.sampleKeywords;
                    navigator.clipboard.writeText(`${baseTitle}\n\n${kws.join(', ')}`);
                    setCopiedId(`${activePreviewStore.id}_full`);
                    setTimeout(() => setCopiedId(null), 1800);
                  }}
                  className={`text-[10.5px] font-mono tracking-[0.06em] uppercase flex items-center gap-1.5 cursor-pointer transition ${
                    copiedId === `${activePreviewStore.id}_full`
                      ? 'text-white font-bold'
                      : isLight
                      ? 'text-neutral-600 hover:text-neutral-950'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {copiedId === `${activePreviewStore.id}_full` ? (
                    <>
                      <Check className="w-3 h-3 text-white" />
                      <span>Copied Title + Tags</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 opacity-70" />
                      <span>Copy Specimen</span>
                    </>
                  )}
                </button>
                <div className="flex items-center gap-1.5">
                  {marketStores.map((st, idx) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        setPreviewStoreIdx(idx);
                        setCustomSpecimenTitle('');
                        setCustomSpecimenTags([]);
                      }}
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
          <div className="mt-14 pt-10 border-t border-neutral-200/70 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
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
                    : 'bg-[#050506] hover:bg-[#0c0c0e] border border-white/10 hover:border-white/30 shadow-lg'
                }`}
              >
                <div className={`flex items-center justify-between text-[10px] font-mono tracking-[0.12em] uppercase mb-1.5 ${
                  isLight ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
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
          className="mt-28 pt-8 border-t border-neutral-200/60 dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        >
          <div className="space-y-2">
            <div className="text-[10.5px] font-mono tracking-[0.2em] uppercase text-neutral-400">
              01. ENTERPRISE MODULES
            </div>
            <h2 className={`text-2xl sm:text-4xl font-bold tracking-[-0.03em] leading-[1.1] ${
              isLight ? 'text-neutral-950' : 'text-white'
            }`}>
              Specialized{' '}
              <span className="font-editorial italic font-semibold text-[1.08em] luxury-headline-gradient pr-1">
                Creative
              </span>{' '}
              Workspaces
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
      <section className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 pb-32">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
                className={`group cursor-pointer rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 sovereign-prism-card relative overflow-hidden ${
                  isLight
                    ? 'crystal-glass-panel-light hover:border-neutral-900'
                    : 'crystal-glass-panel-dark hover:border-white/35'
                }`}
              >
                {/* Subtle Top Specular White Hairline on Card Hover */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />

                <div className="space-y-4 relative z-10">
                  {/* Top Store Number & Live Status Line (Zero-Pill Unboxed Metadata) */}
                  <div className="flex items-center justify-between text-[10px] font-mono tabular-nums tracking-[0.14em] uppercase text-neutral-400">
                    <span>{store.storeNumber}</span>
                    <span className={isLight ? 'text-neutral-700 font-semibold' : 'text-neutral-200 font-semibold'}>
                      {store.statLabel}
                    </span>
                  </div>

                  {/* Signature Architectural Cover Image Card */}
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-inset ring-white/15 group-hover:ring-white/35 shadow-md transition-all duration-500">
                    <img
                      src={store.image}
                      alt={store.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      referrerPolicy="no-referrer"
                    />

                    {/* Subtle Contrast Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-300" />

                    {/* Subtle Top-Left Store Kicker */}
                    <div className="absolute top-3 left-3.5 text-[9px] font-mono font-semibold tracking-[0.16em] uppercase text-white/95 drop-shadow-xs">
                      {store.badge}
                    </div>

                    {/* Quick Sample SEO Copy Button on Top-Right */}
                    {store.sampleKeywords && (
                      <button
                        type="button"
                        onClick={(e) => handleQuickCopyTags(store, e)}
                        className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg text-[9.5px] font-semibold bg-white/95 hover:bg-white text-black flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-sm cursor-pointer whitespace-nowrap"
                        title="Copy store sample SEO keywords"
                      >
                        {copiedId === store.id ? (
                          <>
                            <Check className="w-2.5 h-2.5 text-black" />
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
                      <span className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center transform group-hover:translate-x-0.5 transition-transform shadow-sm">
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  {/* Details Typography Block */}
                  <div className="space-y-1.5 pt-1">
                    <h3 className={`text-[15.5px] font-bold tracking-tight leading-snug transition-colors ${
                      isLight ? 'text-neutral-950' : 'text-white group-hover:text-neutral-200'
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

      {/* ============================================================ */}
      {/* GLOBAL COMMERCIAL METADATA, PROMPT & NICHE STORE VAULT       */}
      {/* ============================================================ */}
      <GlobalAssetStoreVault
        isLight={isLight}
        showToast={showToast}
        onLoadPackIntoWorkbench={(pack) => {
          if (onLoadStorePack) {
            onLoadStorePack(pack);
          } else {
            onNavigateView('upload');
          }
        }}
      />

    </div>
  );
};
