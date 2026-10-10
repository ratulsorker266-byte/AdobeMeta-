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
  onNavigateView: (view: 'home' | 'upload' | 'monetize' | 'seo-rank' | 'trends' | 'competitor' | 'prompts' | 'calendar') => void;
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
  onOpenSettings?: () => void;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  itemsCount: number;
  completedCount: number;
  items?: Array<{
    id: string;
    fileName: string;
    title?: string;
    keywords?: string[];
    category?: string;
    hasResult: boolean;
  }>;
  onInspectAsset?: (id: string) => void;
  onCopyAssetMetadata?: (id: string) => void;
  onCycleTheme?: () => void;
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
  onOpenSettings,
  onOpenAuth,
  onLogout,
  itemsCount,
  completedCount,
  items = [],
  onInspectAsset,
  onCopyAssetMetadata,
  onCycleTheme,
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

  // Dynamic Ghost Search commands for live queued assets
  const assetSearchCommands: CommandItem[] = items.slice(0, 30).map((asset) => ({
    id: `asset_${asset.id}`,
    title: asset.title ? `${asset.fileName} — "${asset.title.slice(0, 48)}"` : `Asset: ${asset.fileName} (Staged)`,
    category: 'Workspace',
    description: asset.hasResult
      ? `${(asset.keywords || []).length} tags · ${asset.category || 'Business'} · Click to copy metadata`
      : 'Staged in Manual Workbench · Click to inspect HD preview',
    icon: FileCode,
    shortcut: asset.hasResult ? 'Copy Meta' : 'Inspect',
    keywords: [
      asset.fileName.toLowerCase(),
      (asset.title || '').toLowerCase(),
      (asset.category || '').toLowerCase(),
      ...(asset.keywords || []).map((k) => k.toLowerCase()),
      'asset',
      'file',
      'queue',
      'ghost',
    ],
    action: () => {
      onNavigateView('upload');
      if (asset.hasResult && onCopyAssetMetadata) {
        onCopyAssetMetadata(asset.id);
      } else if (onInspectAsset) {
        onInspectAsset(asset.id);
      }
    },
  }));

  const allCommands: CommandItem[] = [
    // Workspace Actions
    {
      id: 'home_view',
      title: 'Go to Main Storefront Directory',
      category: 'Workspace',
      description: 'Return to the 8-module architectural home hub',
      icon: Compass,
      shortcut: 'G H',
      keywords: ['home', 'storefront', 'market', 'directory', 'hub'],
      action: () => onNavigateView('home'),
    },
    {
      id: 'studio_view',
      title: 'Go to Metadata Studio',
      category: 'Workspace',
      description: 'Primary workspace for photo, vector, and video metadata',
      icon: Layers,
      shortcut: 'G S',
      keywords: ['home', 'upload', 'studio', 'main', 'workbench'],
      action: () => onNavigateView('upload'),
    },
    {
      id: 'seo_rank_view',
      title: 'Open Rank #1 Search Calibrator',
      category: 'Intelligence & Tools',
      description: 'Calibrate <70 char titles and Top-10 weighted keyword slots',
      icon: Target,
      shortcut: 'G R',
      keywords: ['seo', 'rank', 'calibrator', 'hijack', 'top 10', 'ghost search'],
      action: () => onNavigateView('seo-rank'),
    },
    {
      id: 'competitor_spy_view',
      title: 'Open Competitor Spy & Tag Gap Analyzer',
      category: 'Intelligence & Tools',
      description: 'Inspect top-selling Adobe Stock & Shutterstock competitor metadata',
      icon: Search,
      shortcut: 'G C',
      keywords: ['competitor', 'spy', 'gap', 'analyze', 'ghost', 'search', 'reverse'],
      action: () => onNavigateView('competitor'),
    },
    {
      id: 'prompt_studio_view',
      title: 'Open Generative AI Stock Prompt Studio',
      category: 'Intelligence & Tools',
      description: 'Craft Midjourney v6.1, Firefly Image 3 & Flux commercial stock prompts',
      icon: Wand2,
      shortcut: 'G P',
      keywords: ['prompt', 'midjourney', 'firefly', 'flux', 'ai', 'generate'],
      action: () => onNavigateView('prompts'),
    },
    {
      id: 'monetize_hub_view',
      title: 'Open Royalty & Google AdSense Hub',
      category: 'Monetization',
      description: 'Interactive royalty simulator, High-CPC niches & ads.txt verification',
      icon: DollarSign,
      shortcut: 'G M',
      keywords: ['monetize', 'adsense', 'royalty', 'cpc', 'ads.txt'],
      action: () => onNavigateView('monetize'),
    },
    ...(onCycleTheme
      ? [
          {
            id: 'cycle_luxury_theme',
            title: 'Cycle Signature Theme (Champagne Velvet / Sunlight / Pure Black)',
            category: 'System' as const,
            description: 'Switch between Sovereign Champagne Velvet, Warm Sunlight & Pure Obsidian Black',
            icon: Sparkles,
            keywords: ['theme', 'color', 'dark', 'light', 'black', 'sunlight', 'velvet', 'marjito'],
            action: onCycleTheme,
          },
        ]
      : []),
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
      title: 'Generate All Metadata (Batch Process)',
      category: 'Workspace',
      description: `Analyze all ${itemsCount} assets in queue with visual AI`,
      icon: Sparkles,
      shortcut: '↵',
      keywords: ['process', 'generate', 'analyze', 'start', 'run', 'all', 'bulk'],
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
      title: 'Open 7-Agency Multi-CSV Hub',
      category: 'Export',
      description: 'Export for Adobe, Shutterstock, Freepik, Getty, Vecteezy, 123RF & Dreamstime',
      icon: FileSpreadsheet,
      keywords: ['freepik', 'getty', 'vecteezy', 'multi', 'agencies', '123rf', 'dreamstime', 'json'],
      action: onOpenMultiCsv,
    },

    // Intelligence & Tools
    {
      id: 'keyword_mixer',
      title: 'Open Live Visual Similar Image Keyword Mixer (ImStocker Style)',
      category: 'Intelligence & Tools',
      description: 'Select 3–12 similar bestseller images and blend 49 keywords by consensus frequency',
      icon: Layers,
      shortcut: '⌘ M',
      keywords: ['mixer', 'imstocker', 'similar', 'blend', 'combine', 'frequency', 'keywords'],
      action: () => onOpenTool('keyword_mixer'),
    },
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
      id: 'keyword_cleaner',
      title: 'Keyword Cleaner & Spam Eliminator',
      category: 'Intelligence & Tools',
      description: 'Deduplicate singular/plural stems, strip trademarks & format up to 49 tags',
      icon: Sparkles,
      keywords: ['clean', 'deduplicate', 'spam', 'stem', 'plural', 'cleaner'],
      action: () => onOpenTool('keyword_cleaner'),
    },
    {
      id: 'search_simulator',
      title: 'Dual Agency Search Engine Simulator',
      category: 'Intelligence & Tools',
      description: 'Preview live buyer search cards on Adobe Stock vs Shutterstock side-by-side',
      icon: Search,
      keywords: ['simulator', 'preview', 'buyer', 'search', 'adobe', 'shutterstock'],
      action: () => onOpenTool('search_simulator'),
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
    ...assetSearchCommands,
    ...(onOpenSettings
      ? [
          {
            id: 'system_settings',
            title: 'Open Settings & Custom API Key',
            category: 'System' as const,
            description: 'Configure Gemini API key, excluded keywords, background & account session',
            icon: Settings,
            keywords: ['settings', 'api', 'key', 'account', 'config'],
            action: onOpenSettings,
          },
        ]
      : []),
    ...(onOpenAuth
      ? [
          {
            id: 'system_auth',
            title: 'Sign In / Contributor Account Profile',
            category: 'System' as const,
            description: 'Sign in with Google or Email to sync your metadata history across devices',
            icon: UserCheck,
            keywords: ['login', 'signin', 'signup', 'account', 'profile', 'google'],
            action: onOpenAuth,
          },
        ]
      : []),
    ...(onLogout
      ? [
          {
            id: 'system_logout',
            title: 'Log Out / Reset Active Session',
            category: 'System' as const,
            description: 'Sign out of your contributor account and clear active session',
            icon: X,
            keywords: ['logout', 'signout', 'exit', 'session', 'clear'],
            action: onLogout,
          },
        ]
      : []),
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
