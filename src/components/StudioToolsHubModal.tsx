import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  FileCode,
  ShieldAlert,
  Target,
  Wand2,
  Filter,
  UserCheck,
  Calculator,
  BookOpen,
  CloudUpload,
  FileSpreadsheet,
  Radar,
  Eye,
  Sparkles,
  ChevronRight,
  Zap,
  Flame,
  Gamepad2
} from 'lucide-react';

interface StudioToolsHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTool: (toolKey: string) => void;
  completedCount: number;
}

interface ToolCard {
  id: string;
  name: string;
  category: 'Vector & AI' | 'Compliance' | 'SEO & Discovery' | 'Monetization';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge?: string;
  requiresFiles?: boolean;
}

export const StudioToolsHubModal: React.FC<StudioToolsHubModalProps> = ({
  isOpen,
  onClose,
  onOpenTool,
  completedCount
}) => {
  if (!isOpen) return null;

  const tools: ToolCard[] = [
    {
      id: 'keyword_mixer',
      name: 'Live Visual Similar Image Keyword Mixer',
      category: 'SEO & Discovery',
      description: 'ImStocker-style visual keyword mixer: select 3–12 similar bestselling images and automatically blend & rank 49 keywords by consensus frequency.',
      icon: Sparkles,
      color: 'from-amber-500/20 to-emerald-500/20 border-amber-500/40 text-amber-300',
      badge: 'ImStocker Mixer'
    },
    {
      id: 'vector_studio',
      name: 'EPS & Vector Studio',
      category: 'Vector & AI',
      description: 'Inject DSC PostScript comments, embed Adobe XMP packets, and generate sidecar files for EPS/AI vectors.',
      icon: FileCode,
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
      badge: 'EPS • AI • SVG'
    },
    {
      id: 'reverse_prompt',
      name: 'Reverse Prompt Engineer',
      category: 'Vector & AI',
      description: 'Convert any image or vector artwork into high-converting Midjourney, Firefly & Flux prompts.',
      icon: Wand2,
      color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400',
      badge: 'Computer Vision'
    },
    {
      id: 'trademark_shield',
      name: 'Trademark & IP Shield',
      category: 'Compliance',
      description: 'Audit titles, descriptions and tags against 500+ microstock-banned brand names and copyright rules.',
      icon: ShieldAlert,
      color: 'from-rose-500/20 to-red-500/20 border-rose-500/30 text-rose-400',
      badge: 'Zero Rejection'
    },
    {
      id: 'release_inspector',
      name: 'Model & Property Release',
      category: 'Compliance',
      description: 'Detect recognizable human faces, landmarks, private estates and generate required release advice.',
      icon: UserCheck,
      color: 'from-teal-500/20 to-emerald-500/20 border-teal-500/30 text-teal-400',
      badge: 'Legal Shield'
    },
    {
      id: 'algorithm_booster',
      name: 'Algorithm Rank Booster (Top 10)',
      category: 'SEO & Discovery',
      description: '1-Click algorithmic priority sorting. Positions high-converting commercial tags into slots #1-#10 for maximum marketplace visibility.',
      icon: Zap,
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
      badge: 'Algorithm #1'
    },
    {
      id: 'competitor_gap',
      name: 'Competitor Tag Gap Inspector',
      category: 'SEO & Discovery',
      description: 'Benchmark metadata against top 1% best-selling competitor stock visuals and 1-click add missing high-RPM tags.',
      icon: Target,
      color: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/30 text-indigo-400',
      badge: 'Bestseller Gaps'
    },
    {
      id: 'rank_predictor',
      name: 'Algorithmic Rank Predictor',
      category: 'SEO & Discovery',
      description: 'Simulate the Adobe Stock & Shutterstock search algorithm weighting (Top 10 keywords & title power).',
      icon: Target,
      color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400',
      badge: 'Top 10 Boost'
    },
    {
      id: 'tag_cleaner',
      name: 'Semantic Tag Cleaner',
      category: 'SEO & Discovery',
      description: 'Deduplicate tags, eliminate banned punctuation, sort by relevance, and format clean commas.',
      icon: Filter,
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
      badge: 'Utility'
    },
    {
      id: 'niche_radar',
      name: 'Real-Time Niche Radar',
      category: 'SEO & Discovery',
      description: 'Find low-competition, high-sales content gaps where commercial stock buyers lack good assets.',
      icon: Radar,
      color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30 text-amber-400',
      badge: 'Market Intel'
    },
    {
      id: 'search_simulator',
      name: 'Marketplace Simulator',
      category: 'SEO & Discovery',
      description: 'Preview exactly how your thumbnail and metadata will appear to real buyers on Adobe Stock.',
      icon: Eye,
      color: 'from-indigo-500/20 to-violet-500/20 border-indigo-500/30 text-indigo-400',
      badge: 'Buyer View'
    },
    {
      id: 'multi_csv',
      name: 'Multi-Marketplace CSV & Rename',
      category: 'Monetization',
      description: 'Export 1-click CSVs tailored for Adobe Stock, Shutterstock, Freepik, Vecteezy, and Getty.',
      icon: FileSpreadsheet,
      color: 'from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-400',
      badge: completedCount > 0 ? `${completedCount} Ready` : 'Batch Ready',
      requiresFiles: true
    },
    {
      id: 'roi_calculator',
      name: 'Earnings & Portfolio ROI',
      category: 'Monetization',
      description: 'Forecast monthly passive earnings based on upload velocity, portfolio size, and RPD benchmarks.',
      icon: Calculator,
      color: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400',
      badge: 'Monetization'
    },
    {
      id: 'ftp_pipeline',
      name: 'Cloud & FTP Pipeline',
      category: 'Monetization',
      description: 'Step-by-step setup for direct high-speed batch FTP submissions to Adobe Stock and Shutterstock.',
      icon: CloudUpload,
      color: 'from-cyan-500/20 to-sky-500/20 border-cyan-500/30 text-cyan-400',
      badge: 'Automation'
    },
    {
      id: 'masterclass',
      name: 'Stock Masterclass Guide',
      category: 'Monetization',
      description: 'Expert knowledge base covering microstock SEO rules, acceptance criteria, and best practices.',
      icon: BookOpen,
      color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400',
      badge: 'Knowledge'
    }
  ];

  const categories = ['All', 'Vector & AI', 'Compliance', 'SEO & Discovery', 'Monetization'];
  const [activeCategory, setActiveCategory] = React.useState('All');

  const filteredTools = activeCategory === 'All'
    ? tools
    : tools.filter(t => t.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        className="w-full max-w-5xl bg-[#050507] border border-white/[0.1] rounded-[32px] shadow-[0_32px_90px_rgba(0,0,0,0.92)] overflow-hidden flex flex-col my-auto max-h-[88vh]"
      >
        {/* Modal Header */}
        <div className="p-7 sm:p-9 border-b border-white/[0.08] flex items-center justify-between bg-black/60 shrink-0">
          <div className="space-y-1.5">
            <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-neutral-500">
              EXECUTIVE CONTRIBUTOR SUITE · 15 SPECIALIZED ENGINES
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-white tracking-[-0.025em]">
              Studio{' '}
              <span className="font-editorial italic font-semibold text-[1.08em] luxury-headline-gradient pr-1">
                Specialist
              </span>{' '}
              Directory
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Precision microstock SEO, vector XMP engineering, and agency compliance modules.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-7 sm:px-9 py-4 border-b border-white/[0.07] bg-[#08080b] flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-[0.04em] whitespace-nowrap transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-white text-neutral-950 shadow-sm'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] text-neutral-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tools Grid — Spacious Architectural Cards */}
        <div className="p-7 sm:p-9 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                whileHover={{ y: -2 }}
                onClick={() => {
                  onClose();
                  onOpenTool(tool.id);
                }}
                className="p-6 rounded-2xl border border-white/[0.08] bg-[#0a0a0e] hover:bg-[#101016] hover:border-white/[0.22] cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#f3e5ab] group-hover:bg-white group-hover:text-neutral-950 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-neutral-500">
                          {tool.category}
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#f3e5ab] transition-colors mt-0.5">
                          {tool.name}
                        </h3>
                      </div>
                    </div>
                    {tool.badge && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 shrink-0">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed pl-[52px]">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.14em] text-neutral-400 group-hover:text-white">
                  <span>Launch Specialist Module</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-7 sm:px-9 py-4 border-t border-white/[0.08] bg-black/80 flex items-center justify-between text-xs text-neutral-400 shrink-0">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Verified for Adobe Stock · Shutterstock · Freepik · Getty</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white/[0.06] hover:bg-white/[0.12] text-white rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
