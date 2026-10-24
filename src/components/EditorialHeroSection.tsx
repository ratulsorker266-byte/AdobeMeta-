import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
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
  User as UserIcon,
  DollarSign,
  Menu,
  X,
  Search,
  Compass,
  Layers,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { AdobeMetaProLogo } from './AdobeMetaProLogo';
import { GoogleAdSenseBanner } from './GoogleAdSenseBanner';
import { GlobalAssetStoreVault, GlobalStorePack } from './GlobalAssetStoreVault';
import metadataEpsStudio from '../assets/images/metadata_eps_studio_1792575006913.jpg';
import storeCalendarHub from '../assets/images/store_calendar_hub_1791105379723.jpg';
import promptAtelierCover from '../assets/images/prompt_atelier_cover_1792575024241.jpg';
import storeMonetizeVault from '../assets/images/store_monetize_vault_1791105408515.jpg';
import store05Rank1Seo from '../assets/images/store05_rank1_seo_1791118951820.jpg';
import store06MarketTrends from '../assets/images/store06_market_trends_1791118972607.jpg';
import storeCompetitorSpy from '../assets/images/store_competitor_spy_1791105421040.jpg';
import store08MultiCsvHub from '../assets/images/store08_multi_csv_hub_1791118986226.jpg';
import alpineLakeHero from '../assets/images/alpine_lake_hero_1790944060377.jpg';
import coffyMotionGraphics from '../assets/images/coffy_motion_graphics_1791019037281.jpg';
import imageUpscalerStudio from '../assets/images/image_upscaler_studio_1792574976548.jpg';
import videoUpscalerStudio from '../assets/images/video_upscaler_studio_1792574991474.jpg';
import globalAssetStoreCover from '../assets/images/global_asset_store_1792574530925.jpg';

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
  onOpenUpscaler?: (tab?: 'image' | 'video') => void;
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
  actionType: 'view' | 'modal_csv' | 'modal_tools' | 'modal_upscaler' | 'modal_video_upscaler';
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
  onOpenUpscaler,
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
  const [showGlobalVaultExpanded, setShowGlobalVaultExpanded] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewStoreIdx, setPreviewStoreIdx] = useState<number>(0);
  const [isHoveringSpecimen, setIsHoveringSpecimen] = useState<boolean>(false);
  const [showHeaderControlsMenu, setShowHeaderControlsMenu] = useState<boolean>(false);
  const [showMobileNav, setShowMobileNav] = useState<boolean>(false);
  const [isHeroDragging, setIsHeroDragging] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [activeSpecimenAgency, setActiveSpecimenAgency] = useState<'adobe' | 'shutterstock' | 'freepik' | 'getty' | 'vecteezy'>('adobe');
  const [customSpecimenTitle, setCustomSpecimenTitle] = useState<string>('');
  const [customSpecimenTags, setCustomSpecimenTags] = useState<string[]>([]);

  const [tilt, setTilt] = useState<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const [specularPos, setSpecularPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const galleryScrollRef = useRef<HTMLDivElement>(null);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isLiteMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Rotate max 7 degrees for subtle elegant 3D tilt
    const rotateY = ((x - centerX) / centerX) * 7;
    const rotateX = -((y - centerY) / centerY) * 7;
    
    setTilt({ x: rotateX, y: rotateY, active: true });
    setSpecularPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    });
  };

  const handleCardMouseLeave = () => {
    setIsHoveringSpecimen(false);
    setTilt({ x: 0, y: 0, active: false });
  };

  const scrollGallery = (direction: 'left' | 'right') => {
    if (galleryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      galleryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const isLight = themeMode === 'light';
  const isBn = false;

  // Lightweight Passive Scroll Listener (Zero Interval Re-renders)
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > 24;
      setIsScrolled((prev) => (prev === scrolled ? prev : scrolled));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // 8 Specialized Creative Modules in the Enterprise Workspace Directory (100% Adobe Stock SEO & Manual Curation)
  const marketStores: BoutiqueStoreItem[] = [
    {
      id: 'store-metadata',
      storeNumber: '01 · CORE WORKBENCH',
      title: 'Manual Metadata & EPS Vector Studio',
      category: 'METADATA · GHOSTSCRIPT EPS · 49 WEIGHTED TAGS',
      department: 'metadata',
      image: metadataEpsStudio,
      badge: 'CORE STUDIO',
      statLabel: `${itemsCount > 0 ? `${itemsCount} Queued` : '49-Tag SEO Ready'}`,
      description: 'Craft subject-first commercial titles and 49 rank-ordered keywords with native EPS vector preview and direct IPTC/XMP file embedding.',
      features: ['EPS Vector Preview', '49 Weighted Tags', 'Direct IPTC & XMP'],
      ctaText: 'Open Studio',
      actionType: 'view',
      targetView: 'upload',
      sampleTitle: 'Cloud Computing Server Architecture in Modern Datacenter',
      sampleKeywords: [
        'cloud computing', 'datacenter', 'server', 'network', 'cyber security',
        'database', 'technology', 'storage', 'hardware', 'no people',
        'hosting', 'infrastructure', 'internet', 'mainframe', 'telecommunication',
        'digital', 'system', 'connection', 'rack', 'computer',
        'information', 'communication', 'equipment', 'backup', 'ethernet',
        'switch', 'processor', 'cables', 'center', 'room',
        'electronic', 'power', 'business', 'enterprise', 'modern',
        'interior', 'wire', 'cooling', 'engineering', 'maintenance',
        'safety', 'access', 'led', 'light', 'industrial',
        'speed', 'bandwidth', 'fiber optic', 'security'
      ]
    },
    {
      id: 'store-calendar',
      storeNumber: '02 · PLANNING',
      title: 'Seasonal Commercial Demand Calendar',
      category: 'CALENDAR · 12-MONTH BUYER TIMELINE · SEASONAL EVENTS',
      department: 'creative',
      image: storeCalendarHub,
      badge: 'DEMAND FORECAST',
      statLabel: '12-Month Lead Time',
      description: 'Plan commercial photo and vector production around global purchasing cycles and seasonal holidays 60 days ahead of peak buyer demand.',
      features: ['60-Day Lead Window', 'Holiday Niches', 'Manual Event Sync'],
      ctaText: 'Open Calendar',
      actionType: 'view',
      targetView: 'calendar',
      sampleTitle: 'Autumn Harvest Festival Banner with Seasonal Ripe Pumpkins',
      sampleKeywords: [
        'pumpkin', 'autumn', 'harvest', 'thanksgiving', 'halloween',
        'squash', 'october', 'november', 'fall', 'no people',
        'gourd', 'orange', 'seasonal', 'vegetable', 'agriculture',
        'holiday', 'decoration', 'rustic', 'food', 'market',
        'farm', 'nature', 'ripe', 'fresh', 'raw',
        'organic', 'wood', 'table', 'tradition', 'celebration',
        'abundance', 'leaves', 'foliage', 'cinnamon', 'cozy',
        'warm', 'copy space', 'still life', 'background', 'arrangement',
        'plant', 'produce', 'healthy', 'ingredient', 'yellow',
        'golden', 'wooden', 'top view', 'horizontal'
      ]
    },
    {
      id: 'store-prompts',
      storeNumber: '03 · CONCEPT ATELIER',
      title: 'Master Commercial Prompt & Optics Atelier',
      category: 'COMMERCIAL PROMPTS · HASSELBLAD OPTICS · COMPOSITION CURATION',
      department: 'creative',
      image: promptAtelierCover,
      badge: 'PROMPT ATELIER',
      statLabel: '0% Similarity Risk',
      description: 'Artisanal commercial prompt engineering with Hasselblad medium-format optics, intentional negative copy space, and 5 distinct non-similar editorial archetypes to eliminate stock rejections.',
      features: ['Medium-Format Optics', 'B2B Commercial Intent', '5 Distinct Archetypes', 'Negative Space Curation'],
      ctaText: 'Open Prompt Atelier',
      actionType: 'view',
      targetView: 'prompts',
      sampleTitle: 'Natural Travertine Stone Cylinder Product Display Podium',
      sampleKeywords: [
        'podium', 'pedestal', 'travertine', 'stone', 'cylinder',
        'display', 'minimalist', 'sunlight', 'shadow', 'no people',
        'mockup', 'cosmetics', 'packaging', 'marble', 'luxury',
        'stage', 'platform', 'geometry', 'architectural', 'clean',
        'modern', 'neutral', 'beige', 'texture', 'empty',
        'showcase', 'presentation', 'botanical', 'studio', 'product photography',
        'contemporary', 'simple', 'aesthetic', 'round', 'composition',
        'copy space', 'elegance', 'dappled light', 'earthy', 'organic',
        'beauty', 'skincare', 'stand', 'plaster', 'warm',
        'horizontal', 'front view', 'interior', 'still life'
      ]
    },
    {
      id: 'store-monetize',
      storeNumber: '04 · ANALYTICS',
      title: 'Royalty & Google AdSense Revenue Engine',
      category: 'MONETIZATION · ADSENSE HUB · ROYALTY SIMULATOR',
      department: 'monetize',
      image: storeMonetizeVault,
      badge: 'REVENUE MODEL',
      statLabel: 'Portfolio Yield',
      description: 'Calculate microstock download earnings alongside Google AdSense display income with verified ads.txt digital authorization.',
      features: ['AdSense Simulator', 'Official ads.txt', 'High-CPC Niches'],
      ctaText: 'Open Revenue Hub',
      actionType: 'view',
      targetView: 'monetize',
      sampleTitle: 'Modern Biometric Digital Banking Interface on Mobile Device',
      sampleKeywords: [
        'digital banking', 'fintech', 'mobile banking', 'smartphone', 'biometric',
        'security', 'finance', 'payment', 'transaction', 'one person',
        'fingerprint', 'authentication', 'banking app', 'online payment', 'investment',
        'money', 'credit card', 'technology', 'touchscreen', 'wealth',
        'account', 'transfer', 'savings', 'holding', 'hand',
        'screen', 'interface', 'application', 'modern', 'business',
        'economy', 'commerce', 'cashless', 'smart', 'connection',
        'cellular', 'lifestyle', 'close up', 'adult', 'male',
        'female', 'indoors', 'daylight', 'protection', 'safe',
        'encrypted', 'data', 'concept', 'wallet'
      ]
    },
    {
      id: 'store-seo-rank',
      storeNumber: '05 · OPTIMIZATION',
      title: 'Title & Top-10 Keyword Ranking Calibrator',
      category: 'SEARCH RELEVANCE · TOP 10 SLOTS · KEYWORD QUALITY',
      department: 'metadata',
      image: store05Rank1Seo,
      badge: 'SEARCH CALIBRATOR',
      statLabel: 'First-10 Weighting',
      description: 'Ensure your primary subject matches the first 4 title words and top-10 keyword slots where ~80% of Adobe Stock search weight resides.',
      features: ['Keyword Quality Score', '<70 Char Calibrator', 'Relevance Audit'],
      ctaText: 'Open Calibrator',
      actionType: 'view',
      targetView: 'seo-rank',
      sampleTitle: 'Autonomous Electric Vehicle Charging at Modern Architectural Hub',
      sampleKeywords: [
        'electric vehicle', 'ev charging', 'autonomous driving', 'modern architecture', 'smart city',
        'clean energy', 'green mobility', 'charging station', 'futuristic car', 'technology',
        'commercial automotive', 'urban infrastructure', 'sustainability', 'high tech', 'no people',
        'innovation', 'transportation', 'power station', 'cable', 'battery',
        'connected car', 'metropolis', 'corporate campus', 'exterior', 'clean design',
        'energy efficiency', 'contemporary', 'horizontal', 'daylight', 'copy space'
      ]
    },
    {
      id: 'store-trends',
      storeNumber: '06 · RESEARCH',
      title: 'Commercial Market Niche Intelligence',
      category: 'TRENDS · COMMERCIAL DEMAND · BUYER VOLUME',
      department: 'creative',
      image: store06MarketTrends,
      badge: 'MARKET RESEARCH',
      statLabel: 'Search Demand',
      description: 'Discover high-demand commercial topics, corporate B2B requirements, and low-competition gaps across major microstock agencies.',
      features: ['High-Intent Queries', 'Commercial Demand', '1-Click Tag Copy'],
      ctaText: 'Explore Trends',
      actionType: 'view',
      targetView: 'trends',
      sampleTitle: 'Biophilic Modern Corporate Office with Natural Wood and Plants',
      sampleKeywords: [
        'office', 'interior', 'biophilic', 'architecture', 'workspace',
        'indoor plants', 'sustainable', 'modern', 'timber', 'no people',
        'corporate', 'business', 'boardroom', 'green building', 'natural light',
        'desk', 'furniture', 'contemporary', 'environment', 'workplace',
        'minimalist', 'open plan', 'wood', 'plant', 'commercial real estate',
        'wellness', 'headquarters', 'empty', 'spacious', 'window',
        'building', 'design', 'urban', 'professional', 'calm',
        'ergonomic', 'glass', 'concrete', 'leaf', 'clean',
        'daylight', 'bright', 'eco friendly', 'company', 'industry',
        'healthy', 'concept', 'horizontal', 'wide angle'
      ]
    },
    {
      id: 'store-competitor',
      storeNumber: '07 · BENCHMARK',
      title: 'Commercial Competitor Tag & Framing Inspector',
      category: 'COMPETITOR BENCHMARK · REVERSE TAGS · GAP ANALYSIS',
      department: 'metadata',
      image: storeCompetitorSpy,
      badge: 'BENCHMARK TOOL',
      statLabel: 'Metadata Extraction',
      description: 'Analyze best-selling commercial stock visuals to deconstruct their subject framing, title mechanics, and top-ranked keyword orders.',
      features: ['Bestseller Tag Analysis', 'Strategy Breakdown', 'Instant Copy'],
      ctaText: 'Open Inspector',
      actionType: 'view',
      targetView: 'competitor',
      sampleTitle: 'Automated Logistics Warehouse Forklift Moving Cargo Pallets',
      sampleKeywords: [
        'warehouse', 'logistics', 'forklift', 'cargo', 'pallet',
        'shipping', 'storage', 'distribution', 'freight', 'one person',
        'supply chain', 'industrial', 'commercial', 'transport', 'package',
        'delivery', 'box', 'rack', 'shelves', 'inventory',
        'storehouse', 'worker', 'operator', 'machinery', 'driving',
        'indoor', 'facility', 'automation', 'management', 'order',
        'fulfillment', 'heavy equipment', 'trade', 'economy', 'safety',
        'container', 'depot', 'carrying', 'handling', 'goods',
        'retail', 'import', 'export', 'wholesale', 'business',
        'modern', 'service', 'job', 'horizontal'
      ]
    },
    {
      id: 'store-csv-export',
      storeNumber: '08 · DISTRIBUTION',
      title: '7-Agency CSV & IPTC Direct Embed Hub',
      category: 'EXPORT HUB · ADOBE · SHUTTERSTOCK · FREEPIK · GETTY',
      department: 'monetize',
      image: store08MultiCsvHub,
      badge: '7-AGENCY SUITE',
      statLabel: '7 Agencies + JSON',
      description: 'Export verified commercial metadata CSVs for Adobe Stock, Shutterstock, Freepik, Getty, Vecteezy, 123RF, and Dreamstime in 1 click.',
      features: ['7-Agency CSV Hub', 'SEO File Renamer', 'Master JSON Export'],
      ctaText: 'Open 7-Agency Hub',
      actionType: 'modal_csv',
      sampleTitle: 'Travertine Marble Stone Desk with Stationery Business Card',
      sampleKeywords: [
        'business card', 'stationery', 'mockup', 'travertine', 'stone',
        'branding', 'identity', 'marble', 'minimalist', 'no people',
        'corporate identity', 'paper', 'card', 'desk', 'table',
        'presentation', 'template', 'elegant', 'luxury', 'texture',
        'clean', 'modern', 'copy space', 'empty', 'blank',
        'studio', 'craft', 'graphic design', 'layout', 'print',
        'professional', 'surface', 'neutral', 'beige', 'shadow',
        'sunlight', 'simple', 'contemporary', 'brand', 'marketing',
        'office', 'workspace', 'flat lay', 'top view', 'still life',
        'horizontal', 'aesthetic', 'art', 'stationery mockup'
      ]
    },
    {
      id: 'store-image-upscaler',
      storeNumber: '09 · OPTICAL SUPER-RESOLUTION',
      title: '8K Ultra Image Super-Resolution Atelier',
      category: 'OPTICAL ENGINE · 2K TO 8K BATCH · 300 DPI · MULTI-PASS CAS',
      department: 'metadata',
      image: imageUpscalerStudio,
      badge: '8K OPTICAL ATELIER',
      statLabel: '33.2 MP (8K UHD)',
      description: 'Studio-grade 2K to 8K Ultra-HD photo batch resolution engine (300 DPI) with Contrast-Adaptive Sharpening (CAS) and physical micro-grain preservation. 100% Free with zero API cost.',
      features: ['2K to 8K Ultra-HD', '300 DPI Microstock Standard', 'Batch Photo Processing', 'CAS Edge Sharpening'],
      ctaText: 'Launch 8K Image Atelier',
      actionType: 'modal_upscaler',
      sampleTitle: 'Ultra High Resolution 8K Texture Photograph of Travertine Marble',
      sampleKeywords: [
        '8k texture', 'high resolution', 'super resolution', '300 dpi', 'macro detail',
        'travertine', 'stone', 'marble', 'tactile surface', 'sharp focus',
        'commercial photography', 'stock visual', 'unsharp mask', 'no blur', 'print quality',
        'billboard standard', 'large format', 'depth of field', 'studio lighting', 'copy space'
      ]
    },
    {
      id: 'store-video-upscaler',
      storeNumber: '10 · CINEMA SUPER-RESOLUTION',
      title: '8K Video Cinema Resolution Atelier (Up to 10s)',
      category: '10S VIDEO BATCH · 2K TO 8K UHD · 24-30 FPS · FRAME-BY-FRAME',
      department: 'creative',
      image: videoUpscalerStudio,
      badge: '8K CINEMA ATELIER',
      statLabel: '24-30 FPS 8K Master',
      description: 'Super-resolve short B-roll stock video clips up to 10 seconds into 2K, 4K, 6K, and 8K Ultra-HD. Frame-by-frame canvas GPU stream recorder with batch video queue.',
      features: ['10s Video Super-Resolution', '2K to 8K Ultra-HD', 'Batch Video Queue', 'Frame-by-Frame Stream'],
      ctaText: 'Launch 8K Video Atelier',
      actionType: 'modal_video_upscaler',
      sampleTitle: 'Cinematic 8K B-Roll Footage of Rotating Travertine Stone Podium',
      sampleKeywords: [
        '8k video', 'super resolution', 'b-roll footage', 'cinematic stock video', '4k uhd',
        'commercial video', 'high bitrate', 'frame by frame', 'motion graphics', 'pedestal',
        'travertine', 'luxury product display', 'smooth animation', 'adobe stock video', 'stock footage'
      ]
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
    } else if (store.actionType === 'modal_upscaler' && onOpenUpscaler) {
      onOpenUpscaler('image');
    } else if (store.actionType === 'modal_video_upscaler' && onOpenUpscaler) {
      onOpenUpscaler('video');
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
        horizonBeam: 'from-transparent via-neutral-300 to-transparent',
        spotlightColor: 'rgba(0, 0, 0, 0.04)',
        accentBadge: 'text-neutral-900 border-neutral-300 bg-neutral-100',
      }
    : {
        orbOne: 'bg-white/[0.02]',
        orbTwo: 'bg-neutral-900/40',
        orbThree: 'bg-white/[0.01]',
        horizonBeam: 'from-transparent via-white/15 to-transparent',
        spotlightColor: 'rgba(255, 255, 255, 0.03)',
        accentBadge: 'text-white border-white/20 bg-white/5',
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
      <header className={`sticky top-0 z-50 w-full px-3 sm:px-6 lg:px-10 xl:px-14 transition-all duration-300 ${
        isScrolled ? 'pt-2' : 'pt-3 sm:pt-4'
      }`}>
        <div className={`max-w-[1440px] mx-auto px-3.5 sm:px-6 lg:px-7 rounded-2xl flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300 ${
          isScrolled ? 'h-14 shadow-2xl' : 'h-15 sm:h-16'
        } ${
          isLight
            ? 'crystal-glass-panel-light'
            : 'crystal-glass-panel-dark'
        }`}>
          
          {/* Zone 1: Brand Identity (Clean, compact, no huge subtitle pushing links) */}
          <div className="flex items-center shrink-0 min-w-0">
            <AdobeMetaProLogo
              size="md"
              showText={true}
              showSubtitle={false}
              layout="horizontal"
              theme={isLight ? 'light' : 'dark'}
              onClick={() => {
                setActiveDepartment('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>

          {/* Zone 2: Clean Editorial Navigation Links with Generous Spacing */}
          {/* Desktop XL+ (1280px+): All 6 links */}
          <nav className="hidden xl:flex items-center gap-6 2xl:gap-8 text-[13px] font-sans font-medium tracking-[0.02em] shrink-0">
            <button
              onClick={() => {
                setActiveDepartment('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`lumina-directional-link cursor-pointer relative py-1 whitespace-nowrap transition-colors duration-200 ${
                activeDepartment === 'all'
                  ? (isLight ? 'text-black font-semibold' : 'text-white font-semibold') 
                  : (isLight ? 'text-neutral-500 hover:text-black' : 'text-zinc-400 hover:text-white')
              }`}
            >
              <span>Workspace</span>
              {activeDepartment === 'all' && (
                <span className={`absolute bottom-0 left-0 right-0 h-[1.5px] rounded-full ${isLight ? 'bg-neutral-950' : 'bg-white'}`} />
              )}
            </button>

            <button
              onClick={() => {
                const storeEl = document.getElementById('global-commercial-store-vault');
                if (storeEl) storeEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`lumina-directional-link cursor-pointer relative py-1 whitespace-nowrap transition-colors duration-200 ${
                isLight ? 'text-neutral-900 hover:text-black font-semibold' : 'text-zinc-300 hover:text-white font-medium'
              }`}
            >
              <span>Global Store</span>
            </button>

            <button
              onClick={() => onNavigateView('upload')}
              className={`lumina-directional-link cursor-pointer relative py-1 whitespace-nowrap transition-colors duration-200 flex items-center gap-1.5 ${
                isLight ? 'text-amber-800 font-bold' : 'text-amber-300 hover:text-amber-200 font-bold'
              }`}
              title="Suno Custom Studio Mode (suno.com/create?mode=CUSTOM)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Create (Custom)</span>
            </button>

            <button
              onClick={() => onNavigateView('seo-rank')}
              className={`lumina-directional-link cursor-pointer relative py-1 whitespace-nowrap transition-colors duration-200 ${
                isLight ? 'text-neutral-500 hover:text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Search SEO</span>
            </button>

            <button
              onClick={() => onNavigateView('calendar')}
              className={`lumina-directional-link cursor-pointer relative py-1 whitespace-nowrap transition-colors duration-200 ${
                isLight ? 'text-neutral-500 hover:text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Calendar</span>
            </button>

            <button
              onClick={() => onNavigateView('prompts')}
              className={`lumina-directional-link cursor-pointer relative py-1 whitespace-nowrap transition-colors duration-200 ${
                isLight ? 'text-neutral-500 hover:text-black' : 'text-zinc-400 hover:text-white'
              }`}
              title="Distinct Prompt Engineering Atelier (Nano Banana Pro, ChatGPT, Midjourney)"
            >
              <span>Prompts</span>
            </button>

            <button
              onClick={() => onNavigateView('monetize')}
              className={`lumina-directional-link cursor-pointer relative py-1 whitespace-nowrap transition-colors duration-200 ${
                isLight ? 'text-neutral-500 hover:text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Monetize</span>
            </button>
          </nav>

          {/* Large Screens (1024px - 1279px): Essential links with ample room */}
          <nav className="hidden lg:flex xl:hidden items-center gap-3.5 lg:gap-5 text-[12px] font-sans font-medium tracking-[0.02em] shrink-0">
            <button
              onClick={() => {
                const storeEl = document.getElementById('global-commercial-store-vault');
                if (storeEl) storeEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`lumina-directional-link cursor-pointer relative py-1 whitespace-nowrap transition-colors duration-200 ${
                isLight ? 'text-neutral-900 hover:text-black font-semibold' : 'text-zinc-200 hover:text-white font-medium'
              }`}
            >
              <span>Global Store</span>
            </button>

            <button
              onClick={() => onNavigateView('upload')}
              className={`lumina-directional-link cursor-pointer relative py-1 whitespace-nowrap transition-colors duration-200 ${
                isLight ? 'text-neutral-600 hover:text-black' : 'text-zinc-300 hover:text-white'
              }`}
            >
              <span>Studio</span>
            </button>

            <button
              onClick={() => onNavigateView('prompts')}
              className={`lumina-directional-link cursor-pointer relative py-1 whitespace-nowrap transition-colors duration-200 ${
                isLight ? 'text-neutral-600 hover:text-black' : 'text-zinc-300 hover:text-white'
              }`}
              title="Prompt Atelier"
            >
              <span>Prompts</span>
            </button>

            <button
              onClick={() => onNavigateView('monetize')}
              className={`lumina-directional-link cursor-pointer relative py-1 whitespace-nowrap transition-colors duration-200 ${
                isLight ? 'text-neutral-600 hover:text-black' : 'text-zinc-300 hover:text-white'
              }`}
            >
              <span>Monetize</span>
            </button>
          </nav>

          {/* Zone 3: Clean, Non-Overlapping Controls (Search + System + Theme + Open Studio + Mobile Hamburger) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 relative">
            {onOpenCommandPalette && (
              <button
                type="button"
                onClick={onOpenCommandPalette}
                className={`lumina-tactile-button px-2.5 py-1.5 rounded-xl text-[11px] font-mono hidden lg:flex items-center gap-2 border cursor-pointer shrink-0 ${
                  isLight
                    ? 'bg-[#faf8f5] hover:bg-neutral-100 text-neutral-600 hover:text-neutral-950 border-neutral-200/90'
                    : 'bg-white/[0.03] hover:bg-white/[0.08] text-neutral-400 hover:text-white border-white/10'
                }`}
                title="Quick Command & Search Palette (⌘K or Ctrl+K)"
              >
                <Search className="w-3 h-3 text-neutral-400" />
                <span>Search</span>
                <kbd className={`px-1.5 py-0.5 text-[9.5px] rounded font-mono ${
                  isLight ? 'bg-neutral-200/70 text-neutral-700' : 'bg-white/10 text-neutral-300'
                }`}>⌘K</kbd>
              </button>
            )}

            {/* Consolidated System, Audit, Studio Desk & Account Menu */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => {
                  setShowHeaderControlsMenu((prev) => !prev);
                  setShowMobileNav(false);
                }}
                className={`lumina-tactile-button px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 border cursor-pointer shrink-0 relative ${
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
                <span>System</span>
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
                        WORKSPACE &amp; TOOLS
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
                            <span>Studio Desk &amp; Guidelines</span>
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
                          <span>Lite Performance Mode</span>
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
                          <span>About &amp; Adobe Stock Guide</span>
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
                            <span>Studio Preferences &amp; Theme</span>
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                        </button>
                      )}

                      <div className={`my-1.5 border-t ${isLight ? 'border-neutral-200' : 'border-neutral-800'}`} />

                      <div className="px-2.5 pt-0.5 text-[9.5px] font-mono uppercase tracking-[0.16em] text-neutral-400">
                        ACCOUNT &amp; SESSION
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
                                <span>Log Out / Sign Out</span>
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
                              <span>Sign In / Create Account</span>
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Day / Night Mode Toggle */}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme mode (Pure Black / Warm Sunlight)"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer shrink-0 ${
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

            {/* Primary Workbench CTA */}
            <button
              onClick={() => onNavigateView('upload')}
              className={`text-[12px] font-bold tracking-[0.02em] px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl hidden sm:flex items-center gap-1.5 cursor-pointer whitespace-nowrap group shrink-0 transition-all duration-200 ${
                isLight
                  ? 'bg-neutral-950 hover:bg-black text-white shadow-sm'
                  : 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold shadow-[0_0_20px_rgba(245,158,11,0.35)]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span className="transition-transform duration-200 group-hover:-translate-x-0.5">Create ⚡ (Custom)</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>

            {/* Mobile / Tablet Menu Button (Zero Overlap Guaranteed!) */}
            <button
              type="button"
              onClick={() => {
                setShowMobileNav((prev) => !prev);
                setShowHeaderControlsMenu(false);
              }}
              className={`p-2 rounded-xl flex xl:hidden items-center justify-center border cursor-pointer shrink-0 transition ${
                showMobileNav
                  ? isLight
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-black border-white'
                  : isLight
                  ? 'bg-white/80 hover:bg-white text-neutral-800 border-neutral-200/90'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-200 border-white/15'
              }`}
              aria-label="Toggle navigation menu"
              title="Menu"
            >
              {showMobileNav ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Responsive Mobile / Tablet Dropdown Drawer (Zero Clutter, Completely Accessible) */}
        <AnimatePresence>
          {showMobileNav && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className={`max-w-[1440px] mx-auto mt-2 p-4 rounded-2xl border shadow-2xl z-50 xl:hidden ${
                isLight
                  ? 'bg-white/95 border-neutral-200 text-neutral-900'
                  : 'bg-[#0b0e14]/95 border-neutral-800 text-neutral-100'
              } backdrop-blur-2xl space-y-3`}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setShowMobileNav(false);
                    setActiveDepartment('all');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`p-2.5 rounded-xl text-left border flex items-center gap-2 cursor-pointer transition ${
                    isLight ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200/80' : 'bg-neutral-900/60 hover:bg-neutral-900 border-white/10'
                  }`}
                >
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>Workspace</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMobileNav(false);
                    const storeEl = document.getElementById('global-commercial-store-vault');
                    if (storeEl) storeEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`p-2.5 rounded-xl text-left border flex items-center gap-2 cursor-pointer transition ${
                    isLight ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200/80' : 'bg-neutral-900/60 hover:bg-neutral-900 border-white/10'
                  }`}
                >
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Global Store</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMobileNav(false);
                    onNavigateView('upload');
                  }}
                  className={`p-2.5 rounded-xl text-left border flex items-center gap-2 cursor-pointer transition ${
                    isLight ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200/80' : 'bg-neutral-900/60 hover:bg-neutral-900 border-white/10'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Studio Workbench</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMobileNav(false);
                    onNavigateView('seo-rank');
                  }}
                  className={`p-2.5 rounded-xl text-left border flex items-center gap-2 cursor-pointer transition ${
                    isLight ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200/80' : 'bg-neutral-900/60 hover:bg-neutral-900 border-white/10'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-sky-400" />
                  <span>Search SEO</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMobileNav(false);
                    onNavigateView('calendar');
                  }}
                  className={`p-2.5 rounded-xl text-left border flex items-center gap-2 cursor-pointer transition ${
                    isLight ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200/80' : 'bg-neutral-900/60 hover:bg-neutral-900 border-white/10'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-rose-400" />
                  <span>Seasonal Calendar</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMobileNav(false);
                    onNavigateView('prompts');
                  }}
                  className={`p-2.5 rounded-xl text-left border flex items-center gap-2 cursor-pointer transition ${
                    isLight ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200/80' : 'bg-neutral-900/60 hover:bg-neutral-900 border-white/10'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Prompt Atelier (Anti-Similarity)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMobileNav(false);
                    onNavigateView('monetize');
                  }}
                  className={`p-2.5 rounded-xl text-left border flex items-center gap-2 cursor-pointer transition ${
                    isLight ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200/80' : 'bg-neutral-900/60 hover:bg-neutral-900 border-white/10'
                  }`}
                >
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Monetize Hub</span>
                </button>

                {onOpenUpscaler && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMobileNav(false);
                      onOpenUpscaler('image');
                    }}
                    className={`p-2.5 rounded-xl text-left border flex items-center gap-2 cursor-pointer transition ${
                      isLight ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900' : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>8K Upscaler Studio (Photo &amp; Video)</span>
                  </button>
                )}
              </div>

              <div className="pt-2 border-t border-neutral-200/70 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                {onOpenCommandPalette && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMobileNav(false);
                      onOpenCommandPalette();
                    }}
                    className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 cursor-pointer ${
                      isLight ? 'bg-neutral-100 text-neutral-800 border-neutral-200' : 'bg-white/5 text-neutral-200 border-white/10'
                    }`}
                  >
                    <Search className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Search (⌘K)</span>
                  </button>
                )}

                {onOpenProToolkit && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMobileNav(false);
                      onOpenProToolkit('presubmit');
                    }}
                    className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 cursor-pointer ${
                      isLight ? 'bg-neutral-100 text-neutral-800 border-neutral-200' : 'bg-white/5 text-neutral-200 border-white/10'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Pre-Submit Audit</span>
                  </button>
                )}

                {user ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMobileNav(false);
                      if (onLogout) onLogout();
                    }}
                    className="px-3 py-1.5 rounded-xl border border-red-500/30 text-red-500 font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMobileNav(false);
                      onOpenLogin();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ============================================================ */}
      {/* REFINED ARCHITECTURAL LUXURY HERO MONOLITH                   */}
      {/* ============================================================ */}
      <div className="relative z-10 pt-12 sm:pt-16 pb-28 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14">
        <div
          onMouseMove={(e) => {
            if (isLiteMode) return;
            const rect = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
            e.currentTarget.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
          }}
          style={{ '--spot-x': '650px', '--spot-y': '260px' } as React.CSSProperties}
          className={`rounded-[32px] p-7 sm:p-12 lg:p-16 xl:p-20 relative overflow-hidden transition-colors duration-300 sovereign-prism-card ${
            isLight ? 'crystal-architectural-slab-light' : 'crystal-architectural-slab-dark'
          }`}
        >
          {/* Full-Width Cinematic Photography Background with Dark Gradient Scrim */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          >
            <img
              src={globalAssetStoreCover}
              alt="Architectural studio gallery background"
              className={`w-full h-full object-cover object-center transition-all duration-700 ${
                isLight ? 'opacity-20 filter contrast-105 brightness-105' : 'opacity-30 filter brightness-90 contrast-115'
              }`}
            />
            {/* Ambient Aurora Glow Mesh (Celestial Cyan & Soft Violet Aurora) - Only in Dark Theme */}
            {!isLight && <div aria-hidden="true" className="hero-aurora-mesh" />}
            {/* Contrast Scrim Gradient ensuring WCAG AA legibility while revealing the alpine landscape clearly */}
            <div
              className={`absolute inset-0 ${
                isLight
                  ? 'bg-gradient-to-r from-white/78 via-white/40 to-white/10'
                  : 'bg-gradient-to-t from-[#05060A] via-[#05060A]/85 to-[#05060A]/50'
              }`}
            />
            {/* Subtle light-mode bottom fade so workbench and dropzone blend effortlessly */}
            {isLight && (
              <div className="absolute inset-0 bg-gradient-to-t from-white/55 via-transparent to-transparent pointer-events-none" />
            )}
          </div>
          {/* Interactive Cursor-Tracking Warm Ambient Caustic Spotlight */}
          {!isLiteMode && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[2]"
              style={{
                background: `radial-gradient(650px circle at var(--spot-x, 650px) var(--spot-y, 260px), ${skinPalette.spotlightColor}, transparent 70%)`,
              }}
            />
          )}

          {/* Top-Left & Bottom-Right Subtle Specular Hairlines */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute top-0 inset-x-10 h-[1.5px] bg-gradient-to-r z-[3] ${
              isLight ? 'from-transparent via-neutral-300 to-transparent' : 'from-transparent via-cyan-400/40 to-transparent'
            }`}
          />
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute bottom-0 inset-x-24 h-[1px] bg-gradient-to-r z-[3] ${
              isLight ? 'from-transparent via-neutral-200 to-transparent' : 'from-transparent via-white/10 to-transparent'
            }`}
          />

          {/* Luminous Live Market Intelligence & Contributor Status Ticker */}
          <div className={`mb-7 sm:mb-8 pb-4 border-b flex flex-wrap items-center justify-between gap-3 relative z-10 ${
            isLight ? 'border-neutral-200/70' : 'border-white/10'
          }`}>
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <div className="luminous-market-ticker px-3.5 py-1.5 rounded-full flex items-center gap-2 text-[10.5px] font-mono tracking-wider uppercase text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 cyan-pulse-dot shrink-0" />
                <span className="font-semibold text-white tracking-widest">LIVE ATELIER INDEX</span>
                <span className="opacity-40 text-cyan-200">|</span>
                <span className="text-cyan-300 font-bold">$1,940/DAY YIELD</span>
                <span className="opacity-40 text-cyan-200 hidden sm:inline">|</span>
                <span className="text-emerald-400 font-semibold hidden sm:inline">7 AGENCIES READY</span>
              </div>

              <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono tracking-wider text-neutral-300">
                <span className="opacity-40">·</span>
                <span>49 Weighted Keywords</span>
                <span className="opacity-40">·</span>
                <span>Top-10 Rank Control</span>
                <span className="opacity-40">·</span>
                <span>IPTC Direct Embed</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2.5 text-[10.5px] font-mono tabular-nums text-neutral-300">
              <span className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/10 text-white font-semibold">
                Vector EPS · JPG · 4K
              </span>
              <button
                type="button"
                onClick={() => onNavigateView('monetize')}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition cursor-pointer"
              >
                <span>Google Monetize Hub</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
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
              {/* Grand Cinematic Headline with Cormorant Garamond and Electric Cyan Sheen */}
              <h1 className={`text-[46px] sm:text-[66px] xl:text-[80px] font-serif font-bold tracking-[-0.025em] leading-[1.03] ${
                isLight ? 'text-neutral-950' : 'text-white'
              }`}>
                <span className="block">
                  <span className={isLight ? 'text-neutral-950' : 'text-white'}>Manual Metadata</span>{' '}
                  <span className={`font-serif italic font-normal text-[1.08em] ${isLight ? 'text-cyan-700' : 'wow-text-cyan'} pr-1.5`}>
                    Architecture
                  </span>
                </span>
                <span className="block mt-1 sm:mt-1.5">
                  <span className={isLight ? 'text-neutral-500' : 'text-cyan-400 font-mono text-[0.8em]'}>&amp;</span>{' '}
                  <span className={`font-serif italic font-normal text-[1.08em] ${isLight ? 'text-neutral-700' : 'wow-text-platinum'} pr-1`}>
                    Artisanal
                  </span>{' '}
                  <span className={isLight ? 'text-neutral-950' : 'wow-text-cyan'}>Search Dominance.</span>
                </span>
              </h1>

              <p className={`text-[15.5px] sm:text-[16.5px] font-sans font-normal max-w-xl leading-[1.72] tracking-normal ${
                isLight ? 'text-neutral-600' : 'text-zinc-300'
              }`}>
                A bespoke, high-precision manual workbench for elite stock contributors. Zero robotic AI artifacts. Hand-calibrated subject-first titles under 70 characters, 4-tier rank-ordered 49 keywords with 75% search authority locked in Slots 1–10, and multi-agency Google monetization.
              </p>
            </div>

            <div className="space-y-4">
              {/* Instant Minimalist Executive Dropzone Bar with Prismatic Cyan Border */}
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
                className={`p-5 sm:p-6 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 sovereign-prism-card group relative overflow-hidden ${
                  isHeroDragging
                    ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_40px_rgba(0,240,255,0.3)]'
                    : isLight
                    ? 'crystal-glass-panel-light hover:border-neutral-900'
                    : 'crystal-glass-panel-dark hover:border-cyan-400/50 hover:shadow-[0_0_35px_rgba(0,240,255,0.18)]'
                }`}
              >
                {/* Prismatic Top Edge Caustic */}
                <div aria-hidden="true" className="prismatic-edge-caustic opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-center gap-3.5 relative z-10">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                    isLight
                      ? 'bg-neutral-950 text-white border-neutral-800'
                      : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/60'
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
                  <span className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg transition-all ${
                    isLight
                      ? 'bg-neutral-950 text-white'
                      : 'cyan-glow-button'
                  }`}>
                    <span>Select Files</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>

              {/* Clean Directional Quick-Launch Links (Minimalist Editorial Typography) */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => onNavigateView('upload')}
                  className={`lumina-directional-link cursor-pointer gap-1.5 font-bold ${
                    isLight ? 'text-amber-800 hover:text-amber-900' : 'text-amber-300 hover:text-amber-200'
                  }`}
                  title="Launch Suno Custom Studio (suno.com/create?mode=CUSTOM)"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Suno Custom Studio (?mode=CUSTOM)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-90" />
                </button>
                <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                {onOpenUpscaler && (
                  <>
                    <button
                      type="button"
                      onClick={() => onOpenUpscaler('image')}
                      className={`lumina-directional-link cursor-pointer gap-1.5 font-bold ${
                        isLight ? 'text-amber-700 hover:text-amber-900' : 'text-amber-300 hover:text-amber-200'
                      }`}
                      title="Launch 8K Ultra-HD Image & Video Super-Resolution Studio (100% Free)"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>8K Ultra Upscaler (Photo & Video)</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-90" />
                    </button>
                    <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                  </>
                )}
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
              onMouseMove={handleCardMouseMove}
              onMouseEnter={() => setIsHoveringSpecimen(true)}
              onMouseLeave={handleCardMouseLeave}
              style={{
                transform: tilt.active
                  ? `perspective(1000px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
                  : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
                transition: tilt.active ? 'transform 0.08s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className={`rounded-2xl p-6 sm:p-7 relative overflow-hidden phantom-monolith-card sovereign-prism-card flex-1 flex flex-col justify-between transition-all duration-300 ${
              isLight
                ? 'crystal-glass-panel-light'
                : 'crystal-glass-panel-dark border-cyan-500/25 hover:border-cyan-400/60 shadow-[0_0_35px_rgba(0,240,255,0.14)]'
            }`}>
              {/* Prismatic Cyan Edge Caustic */}
              <div aria-hidden="true" className="prismatic-edge-caustic" />
              {/* Dynamic 3D Electric Cyan & Platinum Specular Light Following Cursor */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                style={{
                  opacity: tilt.active ? 1 : 0,
                  background: `radial-gradient(circle 350px at ${specularPos.x}% ${specularPos.y}%, rgba(0, 240, 255, 0.22), transparent 70%)`,
                }}
              />
              {/* Top Specimen Header + Minimalist Agency Selector */}
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-neutral-200/60 dark:border-white/10 gap-2">
                <div className="flex items-center gap-2 text-[10.5px] font-mono tracking-[0.08em] uppercase tabular-nums truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 cyan-pulse-dot shrink-0" />
                  <span className="text-cyan-300 font-bold">{activePreviewStore.storeNumber}</span>
                  <span className="text-neutral-500">·</span>
                  <span className="text-neutral-300 font-medium hidden sm:inline">LIVE SPECIMEN SANDBOX</span>
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
                      <div className="flex items-center gap-2">
                        <span className="font-bold tracking-wider text-cyan-300">TIER-1 SLOTS 01–08</span>
                        <span className="opacity-40">·</span>
                        <span className="text-emerald-400 font-semibold">75% SEARCH POWER</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsHoveringSpecimen(true);
                          const baseTitle = customSpecimenTitle || activePreviewStore.sampleTitle;
                          const titleTokens = baseTitle
                            .toLowerCase()
                            .replace(/[^a-z0-9\s]/g, ' ')
                            .split(/\s+/)
                            .filter((w) => w.length > 2);
                          const scored = [...activeTags].sort((a, b) => {
                            const aInTitle = titleTokens.some((t) => a.toLowerCase().includes(t));
                            const bInTitle = titleTokens.some((t) => b.toLowerCase().includes(t));
                            if (aInTitle && !bInTitle) return -1;
                            if (!aInTitle && bInTitle) return 1;
                            return 0;
                          });
                          setCustomSpecimenTags(scored);
                          if (showToast) {
                            showToast('⚡ 100x Rank #1 Calibrated! Title & Slots 1–10 100% Synchronized for First-Page Search.');
                          }
                        }}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md border flex items-center gap-1 transition cursor-pointer ${
                          isLight
                            ? 'bg-neutral-900 text-white hover:bg-black border-neutral-900 font-bold'
                            : 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-200 border-cyan-400/40 font-bold'
                        }`}
                        title="1-Click Rank #1 Calibrator: Synchronize primary title nouns into slots 1-5 for instant search rank dominance"
                      >
                        <span>⚡ Calibrate Rank #1</span>
                      </button>
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

                    {/* 100x First-Page Search Authority Guarantee Bar */}
                    <div className={`p-2.5 rounded-xl border text-[10px] font-mono flex items-center justify-between gap-2 ${
                      isLight
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-emerald-950/25 border-emerald-500/25 text-emerald-300'
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-bold">FIRST-PAGE SEARCH INDEX: 100%</span>
                      </div>
                      <span className="opacity-80">Slots 01–10 75% Weight · Zero Trademarks</span>
                    </div>

                    <div className={`text-[10px] font-mono pt-0.5 truncate ${
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
          {/* STREAMLINED MINIMALIST COMPLIANCE & MONETIZE EXECUTIVE STRIP */}
          {/* ============================================================ */}
          <div className="mt-8 pt-6 border-t border-neutral-200/60 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-400">
                AUDIT SUITE
              </span>
              {[
                { tab: 'presubmit' as const, label: '01 · 4MP & EPS Pre-Check' },
                { tab: 'rejection' as const, label: '02 · Rejection & AI Shield' },
                { tab: 'kwscore' as const, label: '03 · IPTC Direct Embed' },
                { tab: 'tracker' as const, label: '04 · Royalty & Earning Tracker' },
              ].map((item) => (
                <button
                  key={item.tab}
                  type="button"
                  onClick={() =>
                    onOpenProToolkit ? onOpenProToolkit(item.tab) : onNavigateView('upload')
                  }
                  className={`lumina-directional-link text-[11.5px] font-medium flex items-center gap-1 cursor-pointer transition ${
                    isLight ? 'text-neutral-600 hover:text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-50" />
                </button>
              ))}

              {onOpenUpscaler && (
                <button
                  type="button"
                  onClick={() => onOpenUpscaler('image')}
                  className={`lumina-directional-link text-[11.5px] font-semibold flex items-center gap-1 cursor-pointer transition ${
                    isLight ? 'text-amber-800 hover:text-black' : 'text-amber-400 hover:text-white'
                  }`}
                  title="Upscayl-Grade 2K to 8K Image & 10s Video Super-Resolution"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>05 · 8K Ultra Upscaler (Free)</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => onNavigateView('monetize')}
              className={`text-[11.5px] font-semibold flex items-center gap-2 cursor-pointer px-3.5 py-1.5 rounded-full border transition ${
                isLight 
                  ? 'bg-neutral-900 text-white border-neutral-900 hover:bg-black' 
                  : 'bg-white/[0.08] text-white border-white/15 hover:bg-white/[0.15] hover:border-white/30'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google Monetize &amp; Earning Hub</span>
              <ArrowUpRight className="w-3 h-3 text-neutral-400" />
            </button>
          </div>
        </div>

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
            <h2 className={`text-2xl sm:text-4xl font-serif font-bold tracking-[-0.02em] leading-[1.15] ${
              isLight ? 'text-neutral-950' : 'text-white'
            }`}>
              Specialized{' '}
              <span className={`italic font-normal text-[1.08em] ${isLight ? 'text-neutral-700' : 'wow-text-silver'} pr-1`}>
                Creative
              </span>{' '}
              Workspaces
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Modules (10)' },
                { id: 'metadata', label: 'Metadata & 8K Image (03)' },
                { id: 'creative', label: 'Calendar & 8K Video (04)' },
                { id: 'monetize', label: 'Royalty & 7-CSV (03)' },
              ].map((tab) => {
                const isActive = activeDepartment === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveDepartment(tab.id as any);
                      if (galleryScrollRef.current) {
                        galleryScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                      }
                    }}
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

            {/* Cinematic Horizontal Navigation Buttons */}
            <div className="flex items-center gap-1.5 shrink-0 pl-1">
              <button
                type="button"
                onClick={() => scrollGallery('left')}
                aria-label="Previous creative modules"
                title="Previous creative modules"
                className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                  isLight
                    ? 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-300 shadow-2xs'
                    : 'bg-white/[0.04] hover:bg-white/[0.12] text-zinc-300 hover:text-white border-white/12'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollGallery('right')}
                aria-label="Next creative modules"
                title="Next creative modules"
                className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                  isLight
                    ? 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-300 shadow-2xs'
                    : 'bg-white/[0.04] hover:bg-white/[0.12] text-zinc-300 hover:text-white border-white/12'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Official High-Yield Google Monetized Leaderboard Unit */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 mb-8">
        <GoogleAdSenseBanner
          format="leaderboard"
          themeMode={themeMode}
          onOpenMonetizeHub={() => onNavigateView('monetize')}
        />
      </div>

      {/* ============================================================ */}
      {/* CINEMATIC HORIZONTAL SCROLL GALLERY (SNAP-TO-CARD SMOOTH)    */}
      {/* ============================================================ */}
      <section className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 pb-32">
        
        <div
          ref={galleryScrollRef}
          className="flex items-stretch gap-6 sm:gap-7 overflow-x-auto scrollbar-none pb-6 pt-2 snap-x snap-mandatory scroll-smooth"
        >
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
                className={`min-w-[290px] sm:min-w-[330px] md:min-w-[360px] max-w-[360px] shrink-0 snap-start group cursor-pointer rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 sovereign-prism-card relative overflow-hidden gallery-card-glow ${
                  isLight
                    ? 'crystal-glass-panel-light hover:border-neutral-900'
                    : 'crystal-glass-panel-dark'
                }`}
              >
                {/* Frosted Prismatic Edge Caustic on Hover */}
                <div
                  aria-hidden="true"
                  className="prismatic-edge-caustic opacity-0 group-hover:opacity-100 transition-opacity duration-400"
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
                      loading="lazy"
                      decoding="async"
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

      {/* High-RPM In-Feed Native Google Monetized Partner Unit */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 mb-8">
        <GoogleAdSenseBanner
          format="in-feed"
          themeMode={themeMode}
          onOpenMonetizeHub={() => onNavigateView('monetize')}
        />
      </div>

      {/* ============================================================ */}
      {/* GLOBAL COMMERCIAL METADATA, PROMPT & NICHE STORE VAULT       */}
      {/* ============================================================ */}
      <div id="global-commercial-store-vault" className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 pb-24">
        <div className={`rounded-3xl p-6 sm:p-8 border transition-all ${
          isLight
            ? 'crystal-glass-panel-light border-neutral-200/80'
            : 'crystal-glass-panel-dark border-white/10'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10.5px] font-mono tracking-[0.18em] uppercase text-neutral-400">
                <span>02. READY-TO-EXPORT COMMERCIAL VAULT</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  12 Master Packs · 588 Verified Tags
                </span>
              </div>
              <h3 className={`text-lg sm:text-xl font-bold tracking-tight ${isLight ? 'text-neutral-950' : 'text-white'}`}>
                Pre-Calibrated Commercial Metadata &amp; Midjourney Prompt Bundles
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowGlobalVaultExpanded((prev) => !prev)}
              className={`lumina-tactile-button px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shrink-0 ${
                showGlobalVaultExpanded
                  ? isLight
                    ? 'bg-neutral-200 text-neutral-900'
                    : 'bg-white/10 text-white border border-white/20'
                  : isLight
                  ? 'bg-neutral-950 text-white'
                  : 'bg-white hover:bg-zinc-200 text-black font-semibold'
              }`}
            >
              <span>{showGlobalVaultExpanded ? 'Hide Commercial Vault' : 'Explore 12 Commercial Packs (588 Tags)'}</span>
              <ArrowUpRight className={`w-3.5 h-3.5 transition-transform duration-200 ${showGlobalVaultExpanded ? 'rotate-90' : ''}`} />
            </button>
          </div>

          {showGlobalVaultExpanded && (
            <div className="mt-8 pt-6 border-t border-neutral-200/60 dark:border-white/10">
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
          )}
        </div>
      </div>

    </div>
  );
};
