import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Play, 
  Copy, 
  Check, 
  MoreHorizontal, 
  Compass, 
  Search, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Image as ImageIcon,
  Layers,
  ChevronRight,
  TrendingUp,
  Award,
  Download
} from 'lucide-react';
import { AdobeMetaProLogo } from './AdobeMetaProLogo';
import alpineLakeImage from '../assets/images/alpine_lake_hero_1790944060377.jpg';

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
  currentView?: string;
  itemsCount?: number;
}

export const EditorialHeroSection: React.FC<EditorialHeroProps> = ({
  onStartGenerating,
  onWatchDemo,
  onOpenPricing,
  onOpenResources,
  onOpenAbout,
  onOpenFeatures,
  onOpenLogin,
  onToggleTheme,
  themeMode,
  user,
  onNavigateView,
  currentView = 'upload',
  itemsCount = 0
}) => {
  const [activeTab, setActiveTab] = useState<'title' | 'keywords' | 'description'>('keywords');
  const [copied, setCopied] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const sampleTitle = "Majestic snow-capped alpine mountains reflecting in serene lake at dawn";
  const sampleDescription = "Pristine vertical landscape photograph of sharp snowy mountain peaks reflecting in glassy alpine waters during golden hour in Canadian Rockies.";
  
  const sampleKeywords = [
    'mountain landscape',
    'lake',
    'nature',
    'scenic view',
    'reflection',
    'sunset',
    'travel',
    'outdoors',
    'wilderness',
    'adventure',
    'snowy mountains',
    'calm water',
    'environment',
    'peaceful',
    'landscape photography',
    'hiking',
    'exploration',
    'serene'
  ];

  const handleCopyMetadata = () => {
    let textToCopy = '';
    if (activeTab === 'keywords') {
      textToCopy = sampleKeywords.join(', ');
    } else if (activeTab === 'title') {
      textToCopy = sampleTitle;
    } else {
      textToCopy = sampleDescription;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#faf8f5] text-[#16171a] font-sans transition-colors duration-300">
      
      {/* Editorial Decorative Background Arcs & Fine Lines (Matches Reference) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Primary warm golden bezier arc sweeping from hero eyebrow behind image */}
        <path
          d="M-50 160C280 120 480 340 760 210C1040 80 1220 180 1500 240"
          stroke="#dfcfbe"
          strokeWidth="1.2"
          strokeDasharray="none"
          opacity="0.85"
        />

        {/* Delicate circular node dot at intersection */}
        <circle cx="1030" cy="186" r="4.5" fill="#c49e63" />
        <circle cx="1030" cy="186" r="9" stroke="#dfcfbe" strokeWidth="1" opacity="0.6" />

        {/* Lower sweeping arc across the bottom */}
        <path
          d="M1250 890C1320 830 1390 760 1490 740"
          stroke="#dfcfbe"
          strokeWidth="1.2"
          opacity="0.8"
        />

        {/* Subtle decorative leaf silhouette watermarks in bottom left corner */}
        <g opacity="0.16" transform="translate(-40, 720)">
          <path
            d="M50 180C70 120 120 60 200 40C180 90 140 160 80 190Z"
            fill="#a39686"
          />
          <path
            d="M90 200C120 150 180 110 260 100C230 150 180 190 110 210Z"
            fill="#8e8172"
          />
          <path
            d="M30 160C40 100 80 50 140 20C130 65 105 120 50 170Z"
            fill="#b5a999"
          />
        </g>
      </svg>

      {/* Main Container */}
      <div className="relative z-10 max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-14 pt-7 pb-16">
        
        {/* ============================================================ */}
        {/* HEADER NAVIGATION (Exact Reference Layout) */}
        {/* ============================================================ */}
        <header className="flex items-center justify-between py-2 mb-14 sm:mb-20">
          {/* Left: Original Brand Monogram Logo */}
          <div className="flex items-center">
            <AdobeMetaProLogo 
              size="md" 
              showText={true} 
              onClick={() => onNavigateView('upload')} 
            />
          </div>

          {/* Center: Editorial Nav Links */}
          <nav className="hidden md:flex items-center gap-9 lg:gap-11 text-[13.5px] font-medium text-neutral-600">
            <button
              onClick={() => {
                onNavigateView('upload');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="relative py-1 text-neutral-900 transition cursor-pointer hover:text-neutral-950 font-semibold"
            >
              Home
              <span className="absolute bottom-[-4px] left-0 right-0 h-[1.5px] bg-neutral-900 rounded-full" />
            </button>

            <button
              onClick={() => {
                if (onOpenFeatures) onOpenFeatures();
                const el = document.getElementById('why-choose-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="py-1 hover:text-neutral-900 transition cursor-pointer"
            >
              Features
            </button>

            <button
              onClick={() => {
                if (onOpenPricing) onOpenPricing();
                else onNavigateView('monetize');
              }}
              className="py-1 hover:text-neutral-900 transition cursor-pointer"
            >
              Pricing
            </button>

            <button
              onClick={() => {
                if (onOpenResources) onOpenResources();
                else onNavigateView('seo-rank');
              }}
              className="py-1 hover:text-neutral-900 transition cursor-pointer"
            >
              Resources
            </button>

            <button
              onClick={() => {
                if (onOpenAbout) onOpenAbout();
              }}
              className="py-1 hover:text-neutral-900 transition cursor-pointer"
            >
              About
            </button>
          </nav>

          {/* Right: Controls, Sign In & Primary Action */}
          <div className="flex items-center gap-5 sm:gap-6">
            {/* Theme Toggle (subtle outline circle) */}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme mode"
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-700 hover:text-neutral-950 hover:bg-stone-200/50 transition cursor-pointer"
              title="Toggle Day/Night view"
            >
              {themeMode === 'light' ? (
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            {/* Sign In text link */}
            <button
              onClick={onOpenLogin}
              className="text-[13.5px] font-medium text-neutral-700 hover:text-neutral-950 transition cursor-pointer"
            >
              {user && user.displayName ? user.displayName.split(' ')[0] : 'Sign In'}
            </button>

            {/* Primary Action Button (Solid pill with arrow) */}
            <button
              onClick={onStartGenerating}
              className="bg-neutral-900 hover:bg-black text-white text-[13px] font-medium px-5 py-2.5 rounded-full transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* ============================================================ */}
        {/* HERO SECTION: 2-COLUMN EDITORIAL COMPOSITION */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[560px]">
          
          {/* ---------------------------------------------------------- */}
          {/* LEFT COLUMN: EDITORIAL TYPOGRAPHY & CALL TO ACTIONS */}
          {/* ---------------------------------------------------------- */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-7 sm:space-y-8 pr-0 lg:pr-6">
            
            {/* Eyebrow Label */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2"
            >
              <span className="text-[11px] sm:text-[11.5px] font-semibold tracking-[0.22em] text-neutral-500 uppercase">
                SMART METADATA. HIGHER VISIBILITY.
              </span>
            </motion.div>

            {/* Main Editorial Headline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-editorial text-[44px] sm:text-[58px] lg:text-[66px] leading-[1.08] tracking-[-0.018em] text-neutral-900 font-normal">
                Turn Your Images <br />
                Into <span className="italic font-normal text-neutral-800 tracking-normal">Opportunities</span>
              </h1>
            </motion.div>

            {/* Human Editorial Description */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="text-[15px] sm:text-[16px] leading-[1.65] text-neutral-600 max-w-[500px]"
            >
              Adobe Meta Pro helps you create accurate, search-optimized metadata for Adobe Stock and other marketplaces — so your creativity gets found, downloaded and valued.
            </motion.p>

            {/* CTA Buttons Row */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 pt-1"
            >
              {/* Primary CTA */}
              <button
                onClick={onStartGenerating}
                className="group bg-neutral-900 hover:bg-black text-white text-[13.5px] font-medium px-6 py-3.5 rounded-full transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer"
              >
                <span>Start Generating</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>

              {/* Secondary CTA: Watch Demo */}
              <button
                onClick={onWatchDemo}
                className="group text-neutral-700 hover:text-neutral-950 text-[13.5px] font-medium px-4 py-3.5 flex items-center gap-2.5 transition cursor-pointer"
              >
                <span className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center transition-colors group-hover:border-neutral-900">
                  <Play className="w-3 h-3 text-neutral-800 fill-neutral-800 ml-0.5" />
                </span>
                <span>Watch Demo</span>
              </button>
            </motion.div>

            {/* Metrics / Statistics Proof Row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-3 gap-6 sm:gap-8 pt-6 border-t border-neutral-200/70 max-w-[480px]"
            >
              <div>
                <div className="font-editorial text-2xl sm:text-[26px] font-medium text-neutral-900 tracking-tight">
                  10M+
                </div>
                <div className="text-[11.5px] text-neutral-500 font-medium mt-0.5">
                  Images Processed
                </div>
              </div>

              <div>
                <div className="font-editorial text-2xl sm:text-[26px] font-medium text-neutral-900 tracking-tight">
                  99%
                </div>
                <div className="text-[11.5px] text-neutral-500 font-medium mt-0.5">
                  Metadata Accuracy
                </div>
              </div>

              <div>
                <div className="font-editorial text-2xl sm:text-[26px] font-medium text-neutral-900 tracking-tight">
                  5+
                </div>
                <div className="text-[11.5px] text-neutral-500 font-medium mt-0.5">
                  Marketplaces Supported
                </div>
              </div>
            </motion.div>
          </div>

          {/* ---------------------------------------------------------- */}
          {/* RIGHT COLUMN: HERO IMAGE + REAL METADATA INSPECTOR PANEL */}
          {/* ---------------------------------------------------------- */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end items-center mt-6 lg:mt-0">
            
            {/* Visual Container */}
            <div className="relative w-full max-w-[560px] h-[520px] sm:h-[550px] flex items-center justify-center">
              
              {/* Central Alpine Landscape Photo (Exact Reference Style) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-[240px] sm:w-[280px] lg:w-[290px] h-[380px] sm:h-[440px] rounded-2xl overflow-hidden shadow-2xl shadow-stone-400/30 border border-stone-200/60"
              >
                <img
                  src={alpineLakeImage}
                  alt="Majestic Alpine Lake Mountain Dawn - Adobe Stock Metadata Asset"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                
                {/* Subtle vignette gradient at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                
                {/* Visual Verification Badge on bottom of image */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white/90 bg-black/30 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/15">
                  <span className="font-medium">Raw Landscape Asset</span>
                  <span className="text-[10px] text-white/70">Adobe Stock Compliant</span>
                </div>
              </motion.div>

              {/* Floating Intelligence Badge 1: Top Right */}
              <motion.div
                initial={{ opacity: 0, y: -12, x: 12 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-4 sm:top-8 right-2 sm:right-6 z-20 bg-white/95 backdrop-blur-md rounded-xl p-3 sm:p-3.5 shadow-lg shadow-stone-300/40 border border-stone-100 flex items-center gap-3 transition-transform hover:-translate-y-0.5"
              >
                <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-neutral-700">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div className="pr-1">
                  <div className="text-[12px] font-semibold text-neutral-900 leading-tight">
                    AI-Powered
                  </div>
                  <div className="text-[10.5px] text-neutral-500 font-medium">
                    Metadata Generation
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </motion.div>

              {/* Floating Intelligence Badge 2: Bottom Left */}
              <motion.div
                initial={{ opacity: 0, y: 12, x: -12 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.7, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-6 sm:bottom-12 left-0 sm:left-2 z-20 bg-white/95 backdrop-blur-md rounded-xl p-3 sm:p-3.5 shadow-lg shadow-stone-300/40 border border-stone-100 flex items-center gap-3 transition-transform hover:-translate-y-0.5"
              >
                <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-neutral-700">
                  <Compass className="w-4 h-4" />
                </div>
                <div className="pr-1">
                  <div className="text-[12px] font-semibold text-neutral-900 leading-tight">
                    Search Engine
                  </div>
                  <div className="text-[10.5px] text-neutral-500 font-medium">
                    Optimized
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </motion.div>

              {/* Real Metadata Inspector Card (Overlapping to the right, exactly as reference!) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 sm:right-[-12px] lg:right-[-20px] top-[14%] sm:top-[12%] z-30 w-[240px] sm:w-[275px] bg-white rounded-2xl p-4 sm:p-5 shadow-2xl shadow-stone-400/35 border border-stone-100/90"
              >
                {/* Tab Controls: Title | Keywords | Description */}
                <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-stone-100 text-[12px]">
                  <button
                    onClick={() => setActiveTab('title')}
                    className={`transition pb-1 cursor-pointer ${
                      activeTab === 'title'
                        ? 'font-semibold text-neutral-900 relative after:absolute after:bottom-[-5px] after:left-0 after:right-0 after:h-[1.5px] after:bg-neutral-900'
                        : 'text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    Title
                  </button>

                  <button
                    onClick={() => setActiveTab('keywords')}
                    className={`transition pb-1 cursor-pointer ${
                      activeTab === 'keywords'
                        ? 'font-semibold text-neutral-900 relative after:absolute after:bottom-[-5px] after:left-0 after:right-0 after:h-[1.5px] after:bg-neutral-900'
                        : 'text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    Keywords
                  </button>

                  <button
                    onClick={() => setActiveTab('description')}
                    className={`transition pb-1 cursor-pointer ${
                      activeTab === 'description'
                        ? 'font-semibold text-neutral-900 relative after:absolute after:bottom-[-5px] after:left-0 after:right-0 after:h-[1.5px] after:bg-neutral-900'
                        : 'text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    Description
                  </button>
                </div>

                {/* Tab Content Display */}
                <div className="min-h-[175px] sm:min-h-[190px] flex flex-col justify-start">
                  {activeTab === 'keywords' && (
                    <div className="flex flex-wrap gap-1.5 max-h-[185px] overflow-y-auto scrollbar-none pr-0.5">
                      {sampleKeywords.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-[#f3f1ed] text-[#42444b] text-[10.5px] font-medium px-2.5 py-1 rounded-full border border-stone-200/50 hover:bg-[#eae6e0] transition-colors cursor-default"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {activeTab === 'title' && (
                    <div className="space-y-2 py-1">
                      <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
                        Recommended Stock Title (65 chars)
                      </div>
                      <p className="text-[12px] font-medium text-neutral-800 leading-snug bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                        {sampleTitle}
                      </p>
                      <div className="text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
                        <Check className="w-3 h-3" /> Under 70 char Adobe Stock limit
                      </div>
                    </div>
                  )}

                  {activeTab === 'description' && (
                    <div className="space-y-2 py-1">
                      <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
                        Commercial Context Description
                      </div>
                      <p className="text-[11.5px] text-neutral-700 leading-relaxed bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                        {sampleDescription}
                      </p>
                      <div className="text-[10px] text-neutral-400">
                        High search-intent relevance
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Actions Row */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-100">
                  {/* Primary Copy Button */}
                  <button
                    onClick={handleCopyMetadata}
                    className="flex-1 bg-neutral-900 hover:bg-black text-white text-[11px] font-medium py-2 px-3 rounded-full flex items-center justify-center gap-1.5 transition active:scale-[0.98] cursor-pointer shadow-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied to Clipboard</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Metadata</span>
                      </>
                    )}
                  </button>

                  {/* More Action Menu button */}
                  <div className="relative ml-2">
                    <button
                      onClick={() => setShowMoreMenu(!showMoreMenu)}
                      className="w-8 h-8 rounded-full border border-stone-200/80 flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-stone-50 transition cursor-pointer"
                      aria-label="More metadata options"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>

                    {showMoreMenu && (
                      <div className="absolute right-0 bottom-full mb-1.5 w-44 bg-white rounded-xl shadow-xl border border-stone-200 p-1.5 text-[11px] z-50">
                        <button
                          onClick={() => {
                            onStartGenerating();
                            setShowMoreMenu(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-stone-100 flex items-center gap-2 text-neutral-800"
                        >
                          <Sparkles className="w-3 h-3 text-neutral-500" />
                          <span>Generate for My Asset</span>
                        </button>
                        <button
                          onClick={() => {
                            onNavigateView('seo-rank');
                            setShowMoreMenu(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-stone-100 flex items-center gap-2 text-neutral-800"
                        >
                          <Award className="w-3 h-3 text-neutral-500" />
                          <span>Check 100% Rank SEO</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </motion.div>

            </div>

          </div>

        </div>

        {/* ============================================================ */}
        {/* SECTION 2: WHY CHOOSE ADOBE META PRO (Exact Reference Layout) */}
        {/* ============================================================ */}
        <section id="why-choose-section" className="pt-24 sm:pt-28 pb-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12 sm:mb-16">
            {/* Left Headline */}
            <div className="lg:col-span-4 space-y-2">
              <div className="text-[11px] sm:text-[11.5px] font-semibold tracking-[0.22em] text-neutral-500 uppercase">
                WHY CHOOSE ADOBE META PRO
              </div>
              <h2 className="font-editorial text-3xl sm:text-4xl text-neutral-900 leading-tight">
                More Than Just <br />
                Keywords
              </h2>
              <div className="w-10 h-[1.5px] bg-neutral-300 mt-3" />
            </div>

            {/* Right: 4-Column Architectural Feature Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
              
              {/* Feature 1: Image Understanding */}
              <div className="space-y-3 group cursor-default">
                <div className="w-10 h-10 rounded-full bg-stone-100/90 border border-stone-200/60 flex items-center justify-center text-neutral-800 transition-colors group-hover:bg-neutral-900 group-hover:text-white">
                  <Compass className="w-4 h-4" />
                </div>
                <h3 className="text-[14px] font-semibold text-neutral-900 leading-snug">
                  Image Understanding
                </h3>
                <p className="text-[12.5px] leading-relaxed text-neutral-600">
                  Detects subject, objects, context, style and commercial intent.
                </p>
              </div>

              {/* Feature 2: Search-Driven Metadata */}
              <div className="space-y-3 group cursor-default">
                <div className="w-10 h-10 rounded-full bg-stone-100/90 border border-stone-200/60 flex items-center justify-center text-neutral-800 transition-colors group-hover:bg-neutral-900 group-hover:text-white">
                  <Search className="w-4 h-4" />
                </div>
                <h3 className="text-[14px] font-semibold text-neutral-900 leading-snug">
                  Search-Driven Metadata
                </h3>
                <p className="text-[12.5px] leading-relaxed text-neutral-600">
                  Creates relevant, high-value keywords buyers actually search for.
                </p>
              </div>

              {/* Feature 3: Marketplace Ready */}
              <div className="space-y-3 group cursor-default">
                <div className="w-10 h-10 rounded-full bg-stone-100/90 border border-stone-200/60 flex items-center justify-center text-neutral-800 transition-colors group-hover:bg-neutral-900 group-hover:text-white">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-[14px] font-semibold text-neutral-900 leading-snug">
                  Marketplace Ready
                </h3>
                <p className="text-[12.5px] leading-relaxed text-neutral-600">
                  Perfect formatting for Adobe Stock, Shutterstock and more.
                </p>
              </div>

              {/* Feature 4: Fast & Reliable */}
              <div className="space-y-3 group cursor-default">
                <div className="w-10 h-10 rounded-full bg-stone-100/90 border border-stone-200/60 flex items-center justify-center text-neutral-800 transition-colors group-hover:bg-neutral-900 group-hover:text-white">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-[14px] font-semibold text-neutral-900 leading-snug">
                  Fast &amp; Reliable
                </h3>
                <p className="text-[12.5px] leading-relaxed text-neutral-600">
                  Batch processing, history, versioning and export — all in one place.
                </p>
              </div>

            </div>
          </div>

          {/* Editorial Footer Divider / Ticker (Exact Reference) */}
          <div className="flex items-center justify-center gap-4 py-8 border-t border-neutral-200/70 text-[11px] tracking-[0.2em] uppercase text-neutral-500 font-medium">
            <span className="hidden sm:inline-block w-16 h-[1px] bg-neutral-300" />
            <span>BUILT FOR CREATORS</span>
            <span className="text-neutral-300">/</span>
            <span>DESIGNED FOR DISCOVERY</span>
            <span className="hidden sm:inline-block w-16 h-[1px] bg-neutral-300" />
          </div>

        </section>

      </div>

    </div>
  );
};
