import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Play, 
  Copy, 
  Check, 
  Sparkles, 
  Layers, 
  ChevronRight, 
  TrendingUp, 
  Award, 
  Download, 
  Mail, 
  Sun, 
  Moon, 
  DollarSign, 
  Flame, 
  ShieldCheck, 
  Search, 
  Compass, 
  Zap, 
  Maximize2 
} from 'lucide-react';
import { AdobeMetaProLogo } from './AdobeMetaProLogo';
import coffyVectorArt from '../assets/images/coffy_vector_art_1791019002718.jpg';
import coffyCinemaFilm from '../assets/images/coffy_cinema_film_1791019014036.jpg';
import coffyBrandingPack from '../assets/images/coffy_branding_pack_1791019025042.jpg';
import coffyMotionGraphics from '../assets/images/coffy_motion_graphics_1791019037281.jpg';
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
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const isLight = themeMode === 'light';

  // Coffy Design Inspired Showcase Projects
  const showcaseProjects = [
    {
      id: 1,
      title: 'Futuristic Cyber Data Architecture',
      category: 'Vector EPS . 100% Rank SEO',
      image: coffyVectorArt,
      metaTitle: 'Futuristic Isometric Data Architecture with Cybernetic Neon Nodes',
      keywords: ['isometric vector', 'cyber infrastructure', 'data architecture', 'artificial intelligence', 'quantum computing', 'network grid', 'cloud database', 'technology concept'],
      description: 'Ultra-crisp 3D isometric vector illustration of next-gen cloud data servers, glowing fiber cables and floating cryptographic nodes.',
      cpcRate: '$28.40 CPC',
      downloads: '1.4k DLs'
    },
    {
      id: 2,
      title: 'Misty Alpine Spruce Forest Dawn',
      category: 'Commercial Landscape . 49 Keywords',
      image: coffyCinemaFilm,
      metaTitle: 'Cinematic Misty Spruce Forest at Dawn with Golden Sun Rays',
      keywords: ['misty forest', 'alpine trees', 'golden sun rays', 'dawn landscape', 'scenic wilderness', 'foggy morning', 'evergreen pine', 'nature photography'],
      description: 'Anamorphic 35mm film photograph of dense coniferous spruce canopy immersed in golden dawn fog with radiant sunbeams.',
      cpcRate: '$14.20 CPC',
      downloads: '2.8k DLs'
    },
    {
      id: 3,
      title: 'Minimalist Travertine Luxury Stationery',
      category: 'Packaging . Print & Commercial',
      image: coffyBrandingPack,
      metaTitle: 'Luxury Travertine Stationery and Embossed Gold Foil Packaging Mockup',
      keywords: ['stationery mockup', 'embossed gold foil', 'travertine stone', 'luxury branding', 'minimalist packaging', 'corporate identity', 'business card mockup'],
      description: 'Minimalist editorial packaging mockup showcasing warm travertine texture, natural window shadows, and embossed golden typography.',
      cpcRate: '$22.80 CPC',
      downloads: '980 DLs'
    },
    {
      id: 4,
      title: 'Iridescent Fluid Dynamics Wave',
      category: 'Motion Graphics . 4K Visual Asset',
      image: coffyMotionGraphics,
      metaTitle: 'Abstract Dynamic Iridescent Fluid Wave with Holographic Ribbons',
      keywords: ['holographic wave', 'iridescent ribbon', 'fluid motion', 'abstract 3d', 'octane render', 'dynamic curve', 'futuristic background', 'vibrant gradient'],
      description: 'Mesmerizing 3D fluid dynamics render with chromatic iridescent ribbons floating over a deep matte black void.',
      cpcRate: '$34.00 CPC',
      downloads: '3.1k DLs'
    }
  ];

  const handleCopyProject = (p: typeof showcaseProjects[0], e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${p.metaTitle}\n\nKeywords: ${p.keywords.join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={`relative w-full overflow-hidden ${
      isLight 
        ? 'bg-[#ffffff] text-[#111215]' 
        : 'bg-[#08090b] text-[#f2f2f0]'
    } font-sans transition-colors duration-300`}>
      
      {/* ============================================================ */}
      {/* COFFY DESIGN SITE HEADER (Exact 3-Zone Contract) */}
      {/* ============================================================ */}
      <header className={`sticky top-0 z-50 w-full ${
        isLight ? 'bg-white/95 border-b border-neutral-100' : 'bg-[#08090b]/95 border-b border-neutral-900'
      } backdrop-blur-md transition-colors duration-200`}>
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 h-20 flex items-center justify-between">
          
          {/* Zone 1: Navigation on Left (Exact Coffy Style) */}
          <nav className="flex items-center gap-7 sm:gap-9 text-[11px] sm:text-[11.5px] font-bold tracking-[0.2em] uppercase">
            <button
              onClick={() => {
                onNavigateView('upload');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`transition cursor-pointer relative py-1 ${
                currentView === 'upload' 
                  ? (isLight ? 'text-black font-black' : 'text-white font-black') 
                  : (isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white')
              }`}
            >
              <span>WORK</span>
              {currentView === 'upload' && (
                <span className={`absolute bottom-0 left-0 right-0 h-[2px] ${isLight ? 'bg-black' : 'bg-white'}`} />
              )}
            </button>

            <button
              onClick={() => {
                onNavigateView('monetize');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`transition cursor-pointer relative py-1 flex items-center gap-1.5 ${
                currentView === 'monetize' 
                  ? (isLight ? 'text-black font-black' : 'text-white font-black') 
                  : (isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white')
              }`}
            >
              <span>MONETIZE</span>
              {currentView === 'monetize' && (
                <span className={`absolute bottom-0 left-0 right-0 h-[2px] ${isLight ? 'bg-black' : 'bg-white'}`} />
              )}
            </button>

            <button
              onClick={() => {
                onNavigateView('seo-rank');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`hidden sm:inline-block transition cursor-pointer relative py-1 ${
                currentView === 'seo-rank' 
                  ? (isLight ? 'text-black font-black' : 'text-white font-black') 
                  : (isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white')
              }`}
            >
              <span>SEO RANK</span>
              {currentView === 'seo-rank' && (
                <span className={`absolute bottom-0 left-0 right-0 h-[2px] ${isLight ? 'bg-black' : 'bg-white'}`} />
              )}
            </button>

            <button
              onClick={() => {
                if (onOpenAbout) onOpenAbout();
              }}
              className={`hidden md:inline-block transition cursor-pointer ${
                isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>ABOUT</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('coffy-contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else window.location.href = 'mailto:ratulsorker266@gmail.com';
              }}
              className={`hidden lg:inline-block transition cursor-pointer ${
                isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>CONTACT</span>
            </button>
          </nav>

          {/* Zone 2: Centered Signature Identity (Exact Coffy Layout) */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => {
                onNavigateView('upload');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group flex flex-col items-center cursor-pointer text-center"
            >
              <span className={`text-[17px] sm:text-[19px] font-black tracking-[0.24em] uppercase transition-opacity group-hover:opacity-80 ${
                isLight ? 'text-black' : 'text-white'
              }`}>
                ADOBEMETA PRO
              </span>
              <span className="text-[8px] sm:text-[8.5px] font-semibold tracking-[0.38em] uppercase text-neutral-400 mt-0.5">
                CREATIVE METADATA STUDIO
              </span>
            </button>
          </div>

          {/* Zone 3: Social / Controls & Quick Action on Right */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Direct Email Affordance (Coffy Mail Icon) */}
            <a
              href="mailto:ratulsorker266@gmail.com"
              aria-label="Contact Studio"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer ${
                isLight 
                  ? 'text-neutral-600 hover:text-black hover:bg-neutral-100' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
              title="Contact Studio (ratulsorker266@gmail.com)"
            >
              <Mail className="w-4 h-4" />
            </a>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme mode"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer ${
                isLight 
                  ? 'text-neutral-600 hover:text-black hover:bg-neutral-100' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onStartGenerating}
              className={`text-[11.5px] font-bold tracking-[0.16em] uppercase px-4 sm:px-5 py-2.5 rounded-full transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                isLight
                  ? 'bg-black hover:bg-neutral-800 text-white shadow-xs'
                  : 'bg-white hover:bg-neutral-200 text-black font-black shadow-xs'
              }`}
            >
              <span className="hidden sm:inline">LAUNCH</span>
              <span>STUDIO</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* ============================================================ */}
      {/* COFFY DESIGN MASTHEAD (Iconic Razor-Sharp Typography) */}
      {/* ============================================================ */}
      <div className="pt-16 sm:pt-24 pb-12 sm:pb-16 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14">
        
        {/* Coffy Masthead Large Headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-4"
        >
          <div className="text-[11px] sm:text-[12px] font-bold tracking-[0.32em] uppercase text-neutral-400">
            MICROSTOCK COMMERCIAL INTELLIGENCE &amp; SEO RANK BOOSTER
          </div>

          <h1 className={`text-[32px] sm:text-[54px] md:text-[68px] lg:text-[76px] font-black tracking-[0.08em] sm:tracking-[0.12em] uppercase leading-none ${
            isLight ? 'text-black' : 'text-white'
          }`}>
            METADATA <span className="text-amber-500">.</span> VECTOR <span className="text-emerald-500">.</span> MONETIZE
          </h1>

          <p className={`text-[13px] sm:text-[15px] font-medium tracking-wide max-w-2xl mx-auto leading-relaxed ${
            isLight ? 'text-neutral-600' : 'text-neutral-400'
          }`}>
            The definitive creative platform for Adobe Stock, Shutterstock &amp; Freepik contributors. 
            Real Ghostscript EPS visual rendering, 100% Rank #1 keywords, and Google AdSense earning integration.
          </p>

          {/* Quick Action Ribbon */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onStartGenerating}
              className={`text-[12px] font-bold tracking-[0.18em] uppercase px-7 py-3 rounded-full transition flex items-center gap-2 cursor-pointer ${
                isLight
                  ? 'bg-black text-white hover:bg-neutral-800'
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              <span>Drop &amp; Analyze EPS Vectors</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateView('monetize')}
              className={`text-[12px] font-bold tracking-[0.18em] uppercase px-6 py-3 rounded-full border transition flex items-center gap-2 cursor-pointer ${
                isLight 
                  ? 'border-neutral-200 hover:border-black text-black bg-neutral-50 hover:bg-white' 
                  : 'border-neutral-800 hover:border-white text-white bg-neutral-900/60 hover:bg-neutral-900'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google Monetization Hub</span>
            </button>
          </div>
        </motion.div>

      </div>

      {/* ============================================================ */}
      {/* COFFY DESIGN WORK SHOWCASE GRID (The Signature Coffy Look) */}
      {/* ============================================================ */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 pb-20">
        
        {/* Gallery Grid: 2 Columns on Tablet, 4 Columns on Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {showcaseProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
              className="group cursor-pointer flex flex-col space-y-3"
            >
              {/* Cover Image Container with Smooth Coffy Scale */}
              <div className={`relative aspect-[16/10] overflow-hidden rounded-xl ${
                isLight ? 'bg-neutral-100 shadow-sm' : 'bg-neutral-900 shadow-md'
              }`}>
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Live Commercial Stat Badge */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-black/60 backdrop-blur-md text-white border border-white/10">
                  <span className="text-emerald-400">{project.cpcRate}</span>
                </div>

                {/* Hover Reveal Action Bar */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-[10px] font-mono text-neutral-300">
                    {project.downloads}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleCopyProject(project, e)}
                      className="px-2.5 py-1 bg-white text-black text-[10.5px] font-bold rounded-md flex items-center gap-1 hover:bg-neutral-200 transition shadow-sm cursor-pointer"
                    >
                      {copiedId === project.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy SEO</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Coffy Details Block (Exact CSS Class Preservation) */}
              <div className="space-y-1 pt-1">
                <div className={`text-[14px] font-bold tracking-tight leading-snug ${
                  isLight ? 'text-black' : 'text-white'
                }`}>
                  {project.title}
                </div>
                <div className="text-[11px] font-medium tracking-wide text-neutral-400">
                  {project.category}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Selected Project Expanded Inspector Drawer (If Clicked) */}
        <AnimatePresence>
          {selectedProject !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8 overflow-hidden"
            >
              {(() => {
                const p = showcaseProjects.find(item => item.id === selectedProject);
                if (!p) return null;
                return (
                  <div className={`p-6 sm:p-8 rounded-2xl border ${
                    isLight 
                      ? 'bg-neutral-50 border-neutral-200 text-black' 
                      : 'bg-neutral-900/90 border-neutral-800 text-white'
                  } space-y-4`}>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-emerald-500">
                          ACTIVE ASSET METADATA INSPECTOR
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
                          {p.metaTitle}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={onStartGenerating}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Open in Batch Studio</span>
                        </button>
                        <button
                          onClick={() => setSelectedProject(null)}
                          className={`text-xs px-3 py-2 rounded-xl border ${
                            isLight ? 'border-neutral-300 text-neutral-600' : 'border-neutral-700 text-neutral-300'
                          } hover:bg-neutral-200/50 cursor-pointer`}
                        >
                          Close
                        </button>
                      </div>
                    </div>

                    <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>
                      {p.description}
                    </p>

                    <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
                      <div className="text-[11px] font-bold tracking-wider uppercase text-neutral-400 mb-2">
                        Top Ranking Keywords (Positions 1-8):
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {p.keywords.map((kw, i) => (
                          <span
                            key={i}
                            className={`text-xs px-2.5 py-1 rounded-md font-mono ${
                              isLight 
                                ? 'bg-white text-neutral-800 border border-neutral-200' 
                                : 'bg-neutral-800 text-neutral-200 border border-neutral-700'
                            }`}
                          >
                            #{i + 1} {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

      </section>

      {/* ============================================================ */}
      {/* COFFY DESIGN ARCHITECTURAL CAPABILITIES STRIP */}
      {/* ============================================================ */}
      <section id="why-choose-section" className={`border-t ${
        isLight ? 'border-neutral-100 bg-[#fafafa]' : 'border-neutral-900 bg-[#060708]'
      } py-16 sm:py-20 transition-colors duration-200`}>
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10">
            
            {/* Capability 1 */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-bold tracking-[0.24em] uppercase text-neutral-400">
                01 . ENGINE
              </div>
              <h3 className={`text-base font-bold tracking-tight ${isLight ? 'text-black' : 'text-white'}`}>
                Ghostscript PostScript Parser
              </h3>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                119ms high-fidelity visual rendering for vector EPS and AI files. Zero dummy cards, true artwork inspection.
              </p>
            </div>

            {/* Capability 2 */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-bold tracking-[0.24em] uppercase text-neutral-400">
                02 . RANKING
              </div>
              <h3 className={`text-base font-bold tracking-tight ${isLight ? 'text-black' : 'text-white'}`}>
                Top 10 Keyword Locking
              </h3>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                Enforces the 75% search weighting required by Adobe Stock and Shutterstock algorithms for page 1 visibility.
              </p>
            </div>

            {/* Capability 3 */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-bold tracking-[0.24em] uppercase text-neutral-400">
                03 . EARNING
              </div>
              <h3 className={`text-base font-bold tracking-tight ${isLight ? 'text-black' : 'text-white'}`}>
                Google Monetization Suite
              </h3>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                Interactive revenue simulators, high-viewability AdSense units, and official ads.txt compliance.
              </p>
            </div>

            {/* Capability 4 */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-bold tracking-[0.24em] uppercase text-neutral-400">
                04 . EXPORT
              </div>
              <h3 className={`text-base font-bold tracking-tight ${isLight ? 'text-black' : 'text-white'}`}>
                Multi-Agency 1-Click CSV
              </h3>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                Instant formatting for Adobe Stock, Shutterstock, Freepik &amp; Getty Images, with direct IPTC embedding.
              </p>
            </div>

          </div>

          {/* Minimalist Coffy Baseline Ticker */}
          <div className="mt-14 pt-8 border-t border-neutral-200 dark:border-neutral-900 flex flex-wrap items-center justify-between text-[11px] font-bold tracking-[0.24em] uppercase text-neutral-400">
            <span>ADOBEMETA PRO STUDIO</span>
            <div className="flex items-center gap-3">
              <span>AUGUST 2026 EDITION</span>
              <span>·</span>
              <span>100% PASSIVE EARNING ENGINE</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
