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
  ChevronRight
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Professional Contributor Suite</h2>
              <p className="text-xs text-slate-400 mt-0.5">Specialized microstock SEO, compliance, and vector engineering tools</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-900/50 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className={`p-4 rounded-xl border bg-gradient-to-br ${tool.color} cursor-pointer transition flex flex-col justify-between group hover:border-indigo-400/50 hover:shadow-lg`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-700/50">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition">
                        {tool.name}
                      </h3>
                    </div>
                    {tool.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/70 border border-slate-700/60 text-slate-300">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-white">
                  <span>Open Tool</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>All modules verified for Adobe Stock, Shutterstock, and Freepik</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
