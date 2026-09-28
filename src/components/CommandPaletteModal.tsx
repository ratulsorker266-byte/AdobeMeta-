import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Layers,
  Sparkles,
  Download,
  FileSpreadsheet,
  DollarSign,
  Compass,
  Grid,
  ShieldAlert,
  Target,
  Radar,
  Wand2,
  FileCode,
  UserCheck,
  TrendingUp,
  CalendarDays,
  Gamepad2,
  Settings,
  HelpCircle,
  Trash2,
  ArrowRight,
  Command,
  X
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  category: 'Workspace' | 'Export' | 'Intelligence & Tools' | 'Monetization' | 'System';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  keywords?: string[];
  action: () => void;
}

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateView: (view: 'upload' | 'trends' | 'competitor' | 'prompts' | 'calendar') => void;
  onToggleMode: (mode: 'spatial' | 'classic') => void;
  workspaceMode: 'spatial' | 'classic';
  onStartProcessing: () => void;
  onExportAdobeCsv: () => void;
  onExportShutterstockCsv: () => void;
  onExportZip: () => void;
  onOpenMultiCsv: () => void;
  onOpenToolsHub: () => void;
  onOpenEarning: () => void;
  onOpenTool: (toolId: string) => void;
  onClearQueue: () => void;
  itemsCount: number;
  completedCount: number;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigateView,
  onToggleMode,
  workspaceMode,
  onStartProcessing,
  onExportAdobeCsv,
  onExportShutterstockCsv,
  onExportZip,
  onOpenMultiCsv,
  onOpenToolsHub,
  onOpenEarning,
  onOpenTool,
  onClearQueue,
  itemsCount,
  completedCount,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const allCommands: CommandItem[] = [
    // Workspace Actions
    {
      id: 'studio_view',
      title: 'Go to Metadata Studio',
      category: 'Workspace',
      description: 'Primary workspace for photo, vector, and video metadata',
      icon: Layers,
      shortcut: 'G S',
      keywords: ['home', 'upload', 'studio', 'main'],
      action: () => onNavigateView('upload'),
    },
    {
      id: 'toggle_spatial',
      title: workspaceMode === 'spatial' ? 'Switch to Classic Batch Grid' : 'Enter Architectural Digital Space',
      category: 'Workspace',
      description: workspaceMode === 'spatial' ? 'Dense bulk table workflow' : '3D Modern architectural digital house view',
      icon: workspaceMode === 'spatial' ? Grid : Compass,
      shortcut: 'Tab',
      keywords: ['mode', 'switch', '3d', 'classic', 'view', 'grid', 'spatial'],
      action: () => onToggleMode(workspaceMode === 'spatial' ? 'classic' : 'spatial'),
    },
    {
      id: 'start_keywording',
      title: 'Start Dual-Agent Keywording',
      category: 'Workspace',
      description: `Analyze all ${itemsCount} assets in queue with visual AI`,
      icon: Sparkles,
      shortcut: '↵',
      keywords: ['process', 'generate', 'analyze', 'start', 'run'],
      action: onStartProcessing,
    },
    {
      id: 'clear_queue',
      title: 'Clear File Queue',
      category: 'Workspace',
      description: `Remove all ${itemsCount} staged assets from workspace`,
      icon: Trash2,
      keywords: ['remove', 'delete', 'reset', 'empty'],
      action: onClearQueue,
    },

    // Export Actions
    {
      id: 'export_adobe',
      title: 'Export Adobe Stock Official CSV',
      category: 'Export',
      description: 'UTF-8 BOM compliant with strict 70-character titles',
      icon: Download,
      shortcut: '⌘ E',
      keywords: ['adobe', 'csv', 'download', 'export', 'spreadsheet'],
      action: onExportAdobeCsv,
    },
    {
      id: 'export_shutterstock',
      title: 'Export Shutterstock Verified CSV',
      category: 'Export',
      description: '5+ word descriptions, 7-50 keywords, single category mapping',
      icon: FileSpreadsheet,
      keywords: ['shutterstock', 'csv', 'download', 'export'],
      action: onExportShutterstockCsv,
    },
    {
      id: 'export_zip',
      title: 'Download All Files in 1 Tagged ZIP',
      category: 'Export',
      description: 'Embedded IPTC JPEGs + Adobe XMP sidecars + Official CSVs',
      icon: Download,
      shortcut: '⌘ D',
      keywords: ['zip', 'all', 'archive', 'download', 'package'],
      action: onExportZip,
    },
    {
      id: 'open_multi_csv',
      title: 'Open All-Agencies Multi-CSV Hub',
      category: 'Export',
      description: 'Export for Freepik, Getty Images, Vecteezy, and Dreamstime',
      icon: FileSpreadsheet,
      keywords: ['freepik', 'getty', 'vecteezy', 'multi', 'agencies'],
      action: onOpenMultiCsv,
    },

    // Intelligence & Tools
    {
      id: 'tools_hub',
      title: 'Open Contributor Tools Suite (12 Tools)',
      category: 'Intelligence & Tools',
      description: 'Vector studio, IP shield, rank auditor, release inspector, and games',
      icon: Sparkles,
      shortcut: '⌘ T',
      keywords: ['suite', 'all', 'hub', 'tools', 'everything'],
      action: onOpenToolsHub,
    },
    {
      id: 'vector_studio',
      title: 'EPS & Vector Metadata Studio',
      category: 'Intelligence & Tools',
      description: 'Inject DSC PostScript comments & XMP metadata packets into vectors',
      icon: FileCode,
      keywords: ['eps', 'vector', 'svg', 'ai', 'illustrator'],
      action: () => onOpenTool('vector_studio'),
    },
    {
      id: 'trademark_shield',
      title: 'Trademark & IP Infringement Shield',
      category: 'Intelligence & Tools',
      description: 'Audit titles & tags against 500+ microstock-banned brand names',
      icon: ShieldAlert,
      keywords: ['ip', 'copyright', 'trademark', 'brand', 'rejection'],
      action: () => onOpenTool('trademark_shield'),
    },
    {
      id: 'rank_predictor',
      title: 'Algorithmic Rank & SEO Predictor',
      category: 'Intelligence & Tools',
      description: 'Simulate search engine positioning and weight top 10 keywords',
      icon: Target,
      keywords: ['rank', 'seo', 'top 10', 'algorithm', 'score'],
      action: () => onOpenTool('rank_predictor'),
    },
    {
      id: 'niche_radar',
      title: 'Real-Time Niche Opportunity Radar',
      category: 'Intelligence & Tools',
      description: 'Identify low-competition, high-RPM commercial photo themes',
      icon: Radar,
      keywords: ['niche', 'demand', 'opportunity', 'competition', 'scout'],
      action: () => onOpenTool('niche_radar'),
    },
    {
      id: 'reverse_prompt',
      title: 'Reverse Image Prompt Engineer',
      category: 'Intelligence & Tools',
      description: 'Generate Midjourney & Firefly prompts from any stock image',
      icon: Wand2,
      keywords: ['prompt', 'midjourney', 'reverse', 'ai', 'firefly'],
      action: () => onOpenTool('reverse_prompt'),
    },
    {
      id: 'release_inspector',
      title: 'Model & Property Release Inspector',
      category: 'Intelligence & Tools',
      description: 'Verify recognizable faces and private architectural property',
      icon: UserCheck,
      keywords: ['release', 'model', 'property', 'faces', 'legal'],
      action: () => onOpenTool('release_inspector'),
    },
    {
      id: 'market_trends',
      title: 'Browse Live Marketplace Trends',
      category: 'Intelligence & Tools',
      description: 'Seasonal demand surges and buyer purchasing volume',
      icon: TrendingUp,
      keywords: ['trends', 'month', 'buyer', 'surge', 'market'],
      action: () => onNavigateView('trends'),
    },
    {
      id: 'seasonal_calendar',
      title: 'Seasonal Contributor Calendar',
      category: 'Intelligence & Tools',
      description: '90-day advance stock submission timing guide',
      icon: CalendarDays,
      keywords: ['calendar', 'season', 'holidays', 'dates'],
      action: () => onNavigateView('calendar'),
    },
    {
      id: 'arcade_games',
      title: 'Play Contributor Mini-Games',
      category: 'Intelligence & Tools',
      description: 'Retro Snake, Flappy Stock Drone & Keyword Blitz while AI runs',
      icon: Gamepad2,
      keywords: ['games', 'arcade', 'snake', 'flappy', 'fun'],
      action: () => onOpenTool('contributor_arcade'),
    },

    // Monetization
    {
      id: 'earning_monetize',
      title: 'Earning Strategy & Google Monetization Center',
      category: 'Monetization',
      description: 'Microstock royalty calculator, portfolio scaling, and Google AdSense guidance',
      icon: DollarSign,
      shortcut: '⌘ M',
      keywords: ['earn', 'money', 'adsense', 'google', 'revenue', 'royalty', 'calculator'],
      action: onOpenEarning,
    },
  ];

  const filteredCommands = allCommands.filter((cmd) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.description.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q) ||
      (cmd.keywords && cmd.keywords.some((k) => k.includes(q)))
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className="bg-slate-900 border border-slate-700/80 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
        >
          {/* Top Search Input */}
          <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/50">
            <Search className="w-5 h-5 text-indigo-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a command or search tools (e.g. 'export', 'adobe', 'rank', 'vector')..."
              className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
            />
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              <span>ESC to exit</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredCommands.length > 0 ? (
              filteredCommands.map((cmd, idx) => {
                const Icon = cmd.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={cmd.id}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    onClick={() => {
                      cmd.action();
                      onClose();
                    }}
                    className={`px-3.5 py-2.5 rounded-xl cursor-pointer transition flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-indigo-600/20 border border-indigo-500/40 text-white'
                        : 'hover:bg-slate-800/50 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white truncate">{cmd.title}</span>
                          <span className="text-[10px] text-slate-400">· {cmd.category}</span>
                        </div>
                        <p className="text-xs text-slate-400 truncate">{cmd.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {cmd.shortcut && (
                        <kbd className="hidden sm:inline-block font-mono text-[10px] text-slate-400 bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded">
                          {cmd.shortcut}
                        </kbd>
                      )}
                      <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-slate-600'}`} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-slate-400 text-sm">
                No matching commands found for "{query}".
              </div>
            )}
          </div>

          {/* Bottom Keyboard Hint Bar */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span>Use <kbd className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">↑</kbd> <kbd className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">↓</kbd> to navigate</span>
              <span><kbd className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">↵</kbd> to run</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {filteredCommands.length} commands available
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
