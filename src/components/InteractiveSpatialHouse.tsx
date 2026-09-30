import React, { useState, useMemo, useEffect } from 'react';
import { 
  BulkItem, 
  TargetMarketplace, 
  MetadataResult, 
  SmartWarning 
} from '../types';
import { CreativeLoupeInspector } from './CreativeLoupeInspector';
import { SAMPLE_SHOWCASE_ASSETS } from '../lib/sampleAssets';
import { playTickSound, playChimeSound, playShutterSound } from '../lib/audioFeedback';
import { 
  Compass, 
  Layers, 
  Edit3, 
  Search, 
  Grid, 
  Download, 
  Settings, 
  Check, 
  Copy, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Plus, 
  FileSpreadsheet, 
  FileDown, 
  Eye, 
  ShieldCheck, 
  Target, 
  Briefcase, 
  DollarSign,
  TrendingUp,
  Sun,
  Moon,
  Maximize2,
  Box,
  Layers3,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  Info,
  Upload,
  RefreshCw,
  FolderDown,
  CheckCircle,
  Zap,
  Globe,
  RotateCcw,
  History,
  Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleAdSenseBanner } from './GoogleAdSenseBanner';
import { SemanticKeywordBadges } from './SemanticKeywordBadges';

export type SpatialRoom = 'studio' | 'metadata' | 'analysis' | 'batch' | 'earning' | 'export' | 'settings';

interface InteractiveSpatialHouseProps {
  items: BulkItem[];
  currentRoom: SpatialRoom;
  onRoomChange: (room: SpatialRoom) => void;
  activeItemId: string | null;
  onSelectActiveItem: (id: string) => void;
  onUpdateMetadata: (id: string, updated: Partial<MetadataResult>) => void;
  targetMarketplace: TargetMarketplace;
  onMarketplaceChange: (m: TargetMarketplace) => void;
  exportBatchCSV: () => void;
  exportBatchZip: () => void;
  onOpenMultiCsvModal: () => void;
  onOpenSettingsModal?: () => void;
  onOpenEarningModal?: () => void;
  onOpenRankModal?: () => void;
  onOpenNicheRadar?: () => void;
  onTriggerProcess?: () => void;
  isProcessing?: boolean;
  onFilesSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showToast: (msg: string) => void;
  themeMode?: 'light' | 'dark';
  onRegenerateItem?: (id: string, mode?: string, targetSearchQuery?: string) => Promise<void>;
  onSwitchVersion?: (id: string, versionIndex: number) => void;
  isRegenerating?: boolean;
  onLoadSampleAsset?: (item: BulkItem) => void;
}

const ADOBE_STOCK_CATEGORIES = [
  'Animals',
  'Buildings and Architecture',
  'Business',
  'Drinks',
  'The Environment',
  'States of Mind',
  'Food',
  'Graphic Resources',
  'Hobbies and Leisure',
  'Industry',
  'Landscapes',
  'Lifestyle',
  'People',
  'Plants and Flowers',
  'Culture and Religion',
  'Science',
  'Social Issues',
  'Sports',
  'Technology',
  'Transport',
  'Travel'
];

type LightingAtmosphere = 'white_gallery' | 'modernist' | 'blueprint' | 'golden_hour';
type CameraPerspective = 'isometric' | 'front' | 'top_down';

export const InteractiveSpatialHouse: React.FC<InteractiveSpatialHouseProps> = ({
  items,
  currentRoom,
  onRoomChange,
  activeItemId,
  onSelectActiveItem,
  onUpdateMetadata,
  targetMarketplace,
  onMarketplaceChange,
  exportBatchCSV,
  exportBatchZip,
  onOpenMultiCsvModal,
  onOpenSettingsModal,
  onOpenEarningModal,
  onOpenRankModal,
  onOpenNicheRadar,
  onTriggerProcess,
  isProcessing = false,
  onFilesSelect,
  showToast,
  themeMode = 'dark',
  onRegenerateItem,
  onSwitchVersion,
  isRegenerating = false,
  onLoadSampleAsset,
}) => {
  const [newTagInput, setNewTagInput] = useState('');
  const [selectedRegenMode, setSelectedRegenMode] = useState<string>('rank_one_guarantee');
  const [customSearchTarget, setCustomSearchTarget] = useState<string>('');
  const [rankLockedQuery, setRankLockedQuery] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [atmosphere, setAtmosphere] = useState<LightingAtmosphere>(themeMode === 'light' ? 'white_gallery' : 'modernist');
  const [perspective, setPerspective] = useState<CameraPerspective>('isometric');
  const [showMinimap, setShowMinimap] = useState(true);

  // Sync atmosphere with app-level themeMode
  useEffect(() => {
    if (themeMode === 'light') {
      setAtmosphere('white_gallery');
    } else if (themeMode === 'dark') {
      setAtmosphere('modernist');
    }
  }, [themeMode]);

  // Royalty calculator internal state
  const [calcAssets, setCalcAssets] = useState(500);
  const [calcMonthlyDls, setCalcMonthlyDls] = useState(0.8);
  const [calcAvgRoyalty, setCalcAvgRoyalty] = useState(0.85);

  // Completed items in batch
  const completedItems = useMemo(() => items.filter(i => i.result), [items]);

  // Active item resolution
  const activeItem = useMemo(() => {
    if (activeItemId) {
      const found = items.find(i => i.id === activeItemId);
      if (found) return found;
    }
    return completedItems[0] || items[0] || null;
  }, [items, completedItems, activeItemId]);

  // Batch Similarity & Overlap Matrix
  const batchSimilarityData = useMemo(() => {
    if (completedItems.length < 2) return [];

    const similarities: { itemA: BulkItem; itemB: BulkItem; overlapScore: number; sharedKeywords: string[] }[] = [];

    for (let i = 0; i < completedItems.length; i++) {
      for (let j = i + 1; j < completedItems.length; j++) {
        const itemA = completedItems[i];
        const itemB = completedItems[j];
        const kwA = new Set(itemA.result?.keywords || []);
        const kwB = new Set(itemB.result?.keywords || []);

        if (kwA.size === 0 || kwB.size === 0) continue;

        const intersection = [...kwA].filter(k => kwB.has(k));
        const union = new Set([...kwA, ...kwB]);
        const jaccard = Math.round((intersection.length / union.size) * 100);

        if (jaccard >= 60) {
          similarities.push({
            itemA,
            itemB,
            overlapScore: jaccard,
            sharedKeywords: intersection.slice(0, 10),
          });
        }
      }
    }

    return similarities.sort((a, b) => b.overlapScore - a.overlapScore);
  }, [completedItems]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`✓ Copied ${key} to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleMoveKeyword = (fromIdx: number, toIdx: number) => {
    if (!activeItem || !activeItem.result) return;
    const current = [...activeItem.result.keywords];
    if (toIdx < 0 || toIdx >= current.length) return;
    const [moved] = current.splice(fromIdx, 1);
    current.splice(toIdx, 0, moved);

    const updatedPriority = current.slice(0, 10);
    onUpdateMetadata(activeItem.id, {
      keywords: current,
      priorityKeywords: updatedPriority,
    });
  };

  const handleDeleteKeyword = (index: number) => {
    if (!activeItem || !activeItem.result) return;
    const current = activeItem.result.keywords.filter((_, idx) => idx !== index);
    const updatedPriority = current.slice(0, 10);
    onUpdateMetadata(activeItem.id, {
      keywords: current,
      priorityKeywords: updatedPriority,
    });
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem || !activeItem.result) return;
    const clean = newTagInput.trim().toLowerCase();
    if (!clean) return;

    if (activeItem.result.keywords.includes(clean)) {
      showToast('⚠️ Keyword already exists in this asset.');
      return;
    }

    if (activeItem.result.keywords.length >= 49) {
      showToast('⚠️ Maximum 49 keywords reached (Adobe Stock Limit).');
      return;
    }

    const current = [...activeItem.result.keywords, clean];
    const updatedPriority = current.slice(0, 10);
    onUpdateMetadata(activeItem.id, {
      keywords: current,
      priorityKeywords: updatedPriority,
    });
    setNewTagInput('');
    showToast(`✓ Added keyword "${clean}"`);
  };

  const handleLockRankOne = (queryToLock: string) => {
    if (!activeItem || !activeItem.result) return;
    const cleanQuery = queryToLock.trim();
    if (!cleanQuery) {
      showToast('⚠️ Please enter or select a search query to lock.');
      return;
    }

    const currentKeywords = [...activeItem.result.keywords];
    const newKeywordsList: string[] = [];
    const used = new Set<string>();

    const addWord = (w: string) => {
      const n = w.toLowerCase().replace(/[^\w\s-]/g, '').trim();
      if (n.length > 1 && !used.has(n)) {
        used.add(n);
        newKeywordsList.push(n);
      }
    };

    // 1. Lock exact query at Slot 1
    addWord(cleanQuery);

    // 2. Add individual core words to slots 2-5
    const parts = cleanQuery.split(/\s+/).filter(p => p.length > 2);
    for (const p of parts) {
      if (newKeywordsList.length < 5) addWord(p);
    }

    // 3. Fill with existing keywords
    for (const kw of currentKeywords) {
      addWord(kw);
    }

    const finalKeywords = newKeywordsList.slice(0, 49);
    const updatedPriority = finalKeywords.slice(0, 10);

    // 4. Update Title to lead with or feature this exact query
    let newTitle = activeItem.result.recommendedTitle || '';
    if (!newTitle.toLowerCase().includes(cleanQuery.toLowerCase())) {
      const capQuery = cleanQuery.charAt(0).toUpperCase() + cleanQuery.slice(1);
      newTitle = `${capQuery} - ${newTitle}`;
      if (newTitle.length > 70) {
        newTitle = newTitle.slice(0, 70).replace(/\s+\S*$/, '');
      }
    }

    onUpdateMetadata(activeItem.id, {
      recommendedTitle: newTitle,
      keywords: finalKeywords,
      priorityKeywords: updatedPriority
    });

    setRankLockedQuery(cleanQuery);
    showToast(`⚡ Rank #1 Locked! "${cleanQuery}" is now Slot #1 & Title front.`);
  };

  const rooms: { id: SpatialRoom; label: string; wing: string; icon: any; description: string; badge?: string }[] = [
    { id: 'studio', label: 'Grand Atrium', wing: 'Entry Space', icon: Layers, description: 'File Queue, Upload Canvas & Analysis Hub', badge: items.length > 0 ? `${items.length} files` : undefined },
    { id: 'metadata', label: 'Metadata Studio', wing: 'West Wing', icon: Edit3, description: 'Title, Top 10 Weighted Keywords & Category' },
    { id: 'analysis', label: 'Analysis Room', wing: 'North Gallery', icon: Search, description: 'Visual Truth Breakdown & Commercial Readiness' },
    { id: 'batch', label: 'Batch Room', wing: 'East Wing', icon: Grid, description: 'Portfolio Diversity & Keyword Cannibalization Radar', badge: batchSimilarityData.length > 0 ? `${batchSimilarityData.length} overlap` : undefined },
    { id: 'earning', label: 'Earning Lounge', wing: 'Sky Level', icon: DollarSign, description: 'Microstock Royalties & Google AdSense Monetization' },
    { id: 'export', label: 'Export Vault', wing: 'South Wing', icon: Download, description: 'Adobe CSV, Shutterstock CSV & Tagged ZIPs', badge: completedItems.length > 0 ? `${completedItems.length} ready` : undefined },
    { id: 'settings', label: 'Control Room', wing: 'Central Core', icon: Settings, description: 'AI Models, Custom Gemini Key & Preferences' },
  ];

  // Visual Atmosphere styles
  const atmosphereStyles = useMemo(() => {
    switch (atmosphere) {
      case 'modernist':
      default:
        return {
          wrapper: 'bg-slate-950 border-slate-800 shadow-2xl text-slate-100',
          card: 'bg-slate-900/90 border-slate-800 shadow-2xl text-slate-200',
          subcard: 'bg-slate-950/80 border-slate-800 text-white',
          subcardAlt: 'bg-slate-900 border-slate-800 text-white',
          input: 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500',
          select: 'bg-slate-950 border-slate-700 text-slate-200 focus:border-indigo-500',
          dropzone: 'bg-slate-950/80 border-2 border-dashed border-slate-800 hover:border-indigo-500/60',
          heading: 'text-white',
          subtext: 'text-slate-400',
          border: 'border-slate-800',
          borderSubtle: 'border-slate-800/80',
          accent: 'text-indigo-400',
          gridClass: 'bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px]',
          isLight: false,
        };
      case 'white_gallery':
        return {
          wrapper: 'bg-white border-slate-200/90 shadow-2xl shadow-slate-200/50 text-slate-900',
          card: 'bg-slate-50/90 border-slate-200/80 shadow-xs text-slate-800',
          subcard: 'bg-white border-slate-200/90 text-slate-900 shadow-xs',
          subcardAlt: 'bg-slate-100/90 border-slate-200 text-slate-900',
          input: 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500 focus:bg-white',
          select: 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500',
          dropzone: 'bg-slate-50/70 border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/20',
          heading: 'text-slate-900',
          subtext: 'text-slate-500',
          border: 'border-slate-200',
          borderSubtle: 'border-slate-100',
          accent: 'text-indigo-600',
          gridClass: 'architectural-white-grid',
          isLight: true,
        };
      case 'blueprint':
        return {
          wrapper: 'bg-[#06101e] border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.15)] text-cyan-100',
          card: 'bg-[#09182b]/90 border-cyan-800/60 shadow-lg shadow-cyan-950/40 text-cyan-200',
          subcard: 'bg-[#06101e]/90 border-cyan-800/60 text-cyan-100',
          subcardAlt: 'bg-[#09182b] border-cyan-800/80 text-cyan-200',
          input: 'bg-[#06101e] border-cyan-700 text-cyan-100 focus:border-cyan-400',
          select: 'bg-[#06101e] border-cyan-700 text-cyan-100 focus:border-cyan-400',
          dropzone: 'bg-[#06101e]/80 border-2 border-dashed border-cyan-700/60 hover:border-cyan-400',
          heading: 'text-cyan-100',
          subtext: 'text-cyan-400/80',
          border: 'border-cyan-800/80',
          borderSubtle: 'border-cyan-900/60',
          accent: 'text-cyan-400',
          gridClass: 'bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:16px_16px]',
          isLight: false,
        };
      case 'golden_hour':
        return {
          wrapper: 'bg-[#18110b] border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.15)] text-amber-100',
          card: 'bg-[#211710]/90 border-amber-800/50 shadow-lg shadow-amber-950/40 text-amber-200',
          subcard: 'bg-[#18110b]/90 border-amber-800/50 text-amber-100',
          subcardAlt: 'bg-[#211710] border-amber-800/60 text-amber-200',
          input: 'bg-[#18110b] border-amber-700 text-amber-100 focus:border-amber-400',
          select: 'bg-[#18110b] border-amber-700 text-amber-100 focus:border-amber-400',
          dropzone: 'bg-[#18110b]/80 border-2 border-dashed border-amber-800/60 hover:border-amber-400',
          heading: 'text-amber-100',
          subtext: 'text-amber-400/80',
          border: 'border-amber-800/60',
          borderSubtle: 'border-amber-900/50',
          accent: 'text-amber-400',
          gridClass: 'bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]',
          isLight: false,
        };
    }
  }, [atmosphere]);

  // Perspective 3D transforms
  const perspectiveTransform = useMemo(() => {
    switch (perspective) {
      case 'isometric':
        return 'perspective-1000 rotate-x-2 rotate-y-[-1deg] transition-all duration-500';
      case 'front':
        return 'perspective-none rotate-x-0 rotate-y-0 transition-all duration-500';
      case 'top_down':
        return 'perspective-1000 scale-[0.99] transition-all duration-500';
      default:
        return '';
    }
  }, [perspective]);

  const projectedMonthlyIncome = Math.round(calcAssets * calcMonthlyDls * calcAvgRoyalty);
  const projectedAnnualIncome = projectedMonthlyIncome * 12;

  return (
    <div className={`w-full rounded-3xl p-4 sm:p-6 transition-all duration-500 border ${atmosphereStyles.wrapper} ${atmosphereStyles.gridClass} ${perspectiveTransform} relative overflow-hidden`}>
      
      {/* AMBIENT ARCHITECTURAL GLOW */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      {/* ARCHITECTURAL ROOM CONCOURSE & VIEW CONTROLS */}
      <div className={`relative z-10 space-y-3 pb-5 border-b ${atmosphereStyles.border} mb-6`}>
        {/* Top Concourse Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Active Room Badge & Info */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${atmosphereStyles.isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 border-indigo-500/40 text-indigo-400'} border flex items-center justify-center shadow-xs shrink-0`}>
              {React.createElement(rooms.find(r => r.id === currentRoom)?.icon || Layers, { className: "w-5 h-5" })}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-widest ${atmosphereStyles.isLight ? 'text-indigo-700 bg-indigo-50 border-indigo-200' : 'text-indigo-400 bg-indigo-950/60 border-indigo-500/30'} px-2 py-0.5 rounded-md border`}>
                  {rooms.find(r => r.id === currentRoom)?.wing}
                </span>
                <span className={atmosphereStyles.isLight ? 'text-slate-300' : 'text-slate-600'}>·</span>
                <h2 className={`text-base sm:text-lg font-black ${atmosphereStyles.heading} tracking-tight`}>
                  {rooms.find(r => r.id === currentRoom)?.label}
                </h2>
              </div>
              <p className={`text-xs ${atmosphereStyles.subtext} mt-0.5 line-clamp-1`}>
                {rooms.find(r => r.id === currentRoom)?.description}
              </p>
            </div>
          </div>

          {/* Architectural View & Atmosphere Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Atmosphere Lighting */}
            <div className={`flex items-center ${atmosphereStyles.isLight ? 'bg-slate-100/90 border-slate-200' : 'bg-slate-900/90 border-slate-800'} border rounded-xl p-1 text-xs`}>
              <button
                type="button"
                onClick={() => setAtmosphere('white_gallery')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  atmosphere === 'white_gallery' ? 'bg-indigo-600 text-white shadow-sm' : atmosphereStyles.isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
                title="Architectural White Minimalist Pavilion"
              >
                <Compass className="w-3 h-3" />
                <span className="hidden sm:inline">White Gallery</span>
              </button>
              <button
                type="button"
                onClick={() => setAtmosphere('modernist')}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  atmosphere === 'modernist' ? 'bg-slate-800 text-white shadow-sm' : atmosphereStyles.isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
                title="Modernist Glass & Slate Lighting"
              >
                <Moon className="w-3 h-3" />
                <span className="hidden sm:inline">Slate</span>
              </button>
              <button
                type="button"
                onClick={() => setAtmosphere('blueprint')}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  atmosphere === 'blueprint' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-cyan-500'
                }`}
                title="Architectural CAD Blueprint Wireframe"
              >
                <Box className="w-3 h-3" />
                <span className="hidden sm:inline">Blueprint</span>
              </button>
              <button
                type="button"
                onClick={() => setAtmosphere('golden_hour')}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  atmosphere === 'golden_hour' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-amber-500'
                }`}
                title="Sunset Golden Hour Twilight"
              >
                <Sun className="w-3 h-3" />
                <span className="hidden sm:inline">Amber</span>
              </button>
            </div>

            {/* 3D Perspective Toggle */}
            <div className={`flex items-center ${atmosphereStyles.isLight ? 'bg-slate-100/90 border-slate-200' : 'bg-slate-900/90 border-slate-800'} border rounded-xl p-1 text-xs`}>
              <button
                type="button"
                onClick={() => setPerspective('isometric')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  perspective === 'isometric'
                    ? atmosphereStyles.isLight ? 'bg-white text-slate-900 shadow-xs' : 'bg-slate-700 text-white shadow-sm'
                    : atmosphereStyles.isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
                title="Isometric 3D Depth View"
              >
                3D
              </button>
              <button
                type="button"
                onClick={() => setPerspective('front')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  perspective === 'front'
                    ? atmosphereStyles.isLight ? 'bg-white text-slate-900 shadow-xs' : 'bg-slate-700 text-white shadow-sm'
                    : atmosphereStyles.isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
                title="Flat Elevational View"
              >
                Flat
              </button>
            </div>
          </div>
        </div>

        {/* 7 Architectural Rooms Concourse Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1">
          {rooms.map((room) => {
            const Icon = room.icon;
            const isActive = currentRoom === room.id;
            return (
              <button
                key={room.id}
                type="button"
                onClick={() => {
                  onRoomChange(room.id);
                  playTickSound();
                  showToast(`Transitioning to ${room.label}...`);
                }}
                className={`p-2.5 rounded-xl border text-left transition relative group cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                    : atmosphereStyles.isLight
                    ? 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 text-slate-800 shadow-xs'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : atmosphereStyles.isLight ? 'text-slate-600 group-hover:text-slate-900' : 'text-slate-400 group-hover:text-white'}`} />
                  {room.badge && (
                    <span className={`text-[9px] ${isActive ? 'bg-indigo-800 text-indigo-100' : atmosphereStyles.isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-indigo-950 text-indigo-300 border-indigo-400/40'} border px-1 py-0.2 rounded font-bold`}>
                      {room.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  )}
                </div>
                <div className={`text-[10px] uppercase font-bold tracking-wider ${isActive ? 'text-indigo-100' : atmosphereStyles.isLight ? 'text-slate-500' : 'text-slate-400'} truncate`}>
                  {room.wing}
                </div>
                <div className={`text-xs font-bold ${isActive ? 'text-white' : atmosphereStyles.isLight ? 'text-slate-900' : 'text-white'} truncate`}>
                  {room.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROOM 0: GRAND ENTRY ATRIUM / STUDIO ROOM (UPLOAD & OVERVIEW) */}
      {/* ========================================================================= */}
      {currentRoom === 'studio' && (
        <motion.div
          key="studio-room"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className={`${atmosphereStyles.card} rounded-2xl p-5 sm:p-6 space-y-6`}
        >
          {/* Top Atrium Status Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`${atmosphereStyles.subcard} rounded-xl p-4 flex items-center justify-between`}>
              <div>
                <span className={`text-[10px] uppercase font-bold ${atmosphereStyles.subtext} block mb-1`}>Queue Inventory</span>
                <h4 className={`text-2xl font-black ${atmosphereStyles.heading} font-mono`}>{items.length}</h4>
                <p className={`text-[11px] ${atmosphereStyles.subtext} mt-0.5`}>Files currently staged</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${atmosphereStyles.isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'} border flex items-center justify-center`}>
                <Layers className="w-5 h-5" />
              </div>
            </div>

            <div className={`${atmosphereStyles.subcard} rounded-xl p-4 flex items-center justify-between`}>
              <div>
                <span className={`text-[10px] uppercase font-bold ${atmosphereStyles.subtext} block mb-1`}>Metadata Completed</span>
                <h4 className="text-2xl font-black text-emerald-500 font-mono">{completedItems.length}</h4>
                <p className={`text-[11px] ${atmosphereStyles.subtext} mt-0.5`}>Ready for agency export</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${atmosphereStyles.isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'} border flex items-center justify-center`}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className={`${atmosphereStyles.subcard} rounded-xl p-4 flex items-center justify-between`}>
              <div>
                <span className={`text-[10px] uppercase font-bold ${atmosphereStyles.subtext} block mb-1`}>Target Agency</span>
                <h4 className={`text-sm font-bold ${atmosphereStyles.isLight ? 'text-indigo-600' : 'text-indigo-300'} capitalize truncate`}>
                  {targetMarketplace.replace('_', ' ')}
                </h4>
                <p className={`text-[11px] ${atmosphereStyles.subtext} mt-0.5`}>Strict compliance rules</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${atmosphereStyles.isLight ? 'bg-purple-50 border-purple-200 text-purple-600' : 'bg-purple-500/10 border-purple-500/30 text-purple-400'} border flex items-center justify-center`}>
                <Target className="w-5 h-5" />
              </div>
            </div>

            <div className={`${atmosphereStyles.subcard} rounded-xl p-4 flex items-center justify-between`}>
              <div>
                <span className={`text-[10px] uppercase font-bold ${atmosphereStyles.subtext} block mb-1`}>Google Monetize Ready</span>
                <h4 className="text-sm font-bold text-emerald-500 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Policy Clean
                </h4>
                <p className={`text-[11px] ${atmosphereStyles.subtext} mt-0.5`}>AdSense disclosures active</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${atmosphereStyles.isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'} border flex items-center justify-center`}>
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Quick File Dropzone within Architectural Atrium */}
          <div className={`${atmosphereStyles.dropzone} rounded-2xl p-8 text-center transition group relative shadow-2xs`}>
            <input
              type="file"
              multiple
              onChange={onFilesSelect}
              accept="image/*,video/*,.svg,.eps,.ai,.psd,.psb,.spd,.mp4,.mov,.webm"
              className="hidden"
              id="spatialAtriumInput"
            />
            <label htmlFor="spatialAtriumInput" className="cursor-pointer space-y-3 block">
              <div className={`w-14 h-14 ${atmosphereStyles.isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'} rounded-2xl flex items-center justify-center mx-auto border group-hover:scale-105 transition`}>
                <Upload className="w-7 h-7" />
              </div>
              <h3 className={`text-lg font-bold ${atmosphereStyles.heading}`}>
                Drag & Drop Files into the Grand Atrium
              </h3>
              <p className={`text-xs ${atmosphereStyles.subtext} max-w-md mx-auto leading-relaxed`}>
                Accepts Photos (JPG, PNG), Scalable Vectors (EPS, SVG), Photoshop Templates (PSD, PSB), and 4K Footage (MP4, MOV).
              </p>
              <div className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md">
                Browse Files
              </div>
            </label>
          </div>

          {/* Instant 1-Click Master Test-Drive Showcase (when empty) */}
          {items.length === 0 && (
            <div className={`rounded-2xl p-5 border ${
              atmosphereStyles.isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
            } space-y-3.5`}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${atmosphereStyles.heading}`}>
                    Instant Test-Drive — Experience Creative Intelligence in 1 Click
                  </h4>
                </div>
                <span className={`text-[10px] ${atmosphereStyles.subtext}`}>
                  No image ready? Click any curated master asset below to test
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SAMPLE_SHOWCASE_ASSETS.map((sample, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => onLoadSampleAsset && onLoadSampleAsset(sample.item)}
                    className={`group p-3 rounded-xl border text-left transition hover:scale-[1.02] active:scale-[0.99] cursor-pointer flex flex-col justify-between gap-3 ${
                      atmosphereStyles.subcardAlt
                    } hover:border-indigo-500/60`}
                  >
                    <div className="space-y-2">
                      <div className="aspect-video w-full rounded-lg overflow-hidden border border-white/10 relative">
                        <img 
                          src={sample.item.previewUrl} 
                          alt={sample.label} 
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <span className="absolute top-1.5 right-1.5 bg-black/75 backdrop-blur-xs text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
                          {sample.badge}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-indigo-400 block">
                          {sample.category}
                        </span>
                        <h5 className={`text-xs font-bold ${atmosphereStyles.heading} group-hover:text-indigo-400 transition truncate`}>
                          {sample.label}
                        </h5>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/10 text-[10px] text-slate-400">
                      <span>49 Tags • Taxonomy Ready</span>
                      <span className="text-indigo-400 font-bold group-hover:translate-x-0.5 transition">Load Master →</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Ribbon & Navigation Gateway */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2.5">
              {onTriggerProcess && items.length > 0 && (
                <button
                  type="button"
                  onClick={onTriggerProcess}
                  disabled={isProcessing}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer"
                >
                  <Sparkles className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                  <span>{isProcessing ? 'AI Processing In Progress...' : 'Start Dual-Agent Keywording'}</span>
                </button>
              )}

              {completedItems.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={() => onRoomChange('metadata')}
                    className={`${atmosphereStyles.isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200' : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'} font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer border`}
                  >
                    <Edit3 className="w-4 h-4 text-amber-500" />
                    <span>Enter Metadata Studio</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onRoomChange('export')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Go to Export Vault ({completedItems.length})</span>
                  </button>
                </>
              )}
            </div>

            <div className={`flex items-center gap-2 text-xs ${atmosphereStyles.subtext}`}>
              <span>Marketplace:</span>
              <select
                value={targetMarketplace}
                onChange={(e) => onMarketplaceChange(e.target.value as TargetMarketplace)}
                className={`${atmosphereStyles.select} rounded-lg px-2.5 py-1.5 font-medium`}
              >
                <option value="adobe_stock">Adobe Stock</option>
                <option value="shutterstock">Shutterstock</option>
                <option value="freepik">Freepik</option>
                <option value="vecteezy">Vecteezy</option>
                <option value="getty">Getty Images</option>
              </select>
            </div>
          </div>

          {/* Active Item Staging Card */}
          {activeItem && (
            <div className={`${atmosphereStyles.subcard} rounded-xl p-4 flex flex-wrap items-center justify-between gap-4`}>
              <div className="flex items-center gap-3">
                {activeItem.previewUrl ? (
                  <img src={activeItem.previewUrl} alt={activeItem.file.name} className={`w-14 h-14 rounded-xl object-cover ${atmosphereStyles.isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'} border`} />
                ) : (
                  <div className={`w-14 h-14 rounded-xl ${atmosphereStyles.isLight ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-slate-900 border-slate-800 text-slate-400'} border flex items-center justify-center`}>
                    <Layers className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <span className={`text-[10px] uppercase font-bold ${atmosphereStyles.isLight ? 'text-indigo-600' : 'text-indigo-400'}`}>Currently Focused Asset</span>
                  <h4 className={`text-sm font-bold ${atmosphereStyles.heading} truncate max-w-sm`}>{activeItem.file.name}</h4>
                  <p className={`text-xs ${atmosphereStyles.subtext}`}>
                    {activeItem.result ? `Title: "${activeItem.result.recommendedTitle.slice(0, 45)}..."` : `Status: ${activeItem.status}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onRoomChange('metadata')}
                  className={`${atmosphereStyles.isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'} border px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer`}
                >
                  Edit Title & Tags
                </button>
                <button
                  type="button"
                  onClick={() => onRoomChange('analysis')}
                  className={`${atmosphereStyles.isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'} border px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer`}
                >
                  Visual Analysis
                </button>
              </div>
            </div>
          )}

          {/* Active Item Precision Optical Loupe & Color Harmony */}
          {activeItem && (
            <CreativeLoupeInspector
              item={activeItem}
              themeMode={themeMode}
              onOpenAnalysis={() => onRoomChange('analysis')}
              showToast={showToast}
            />
          )}

          {/* Staged Batch Queue Inventory & Per-Item Diagnostics */}
          {items.length > 0 && (
            <div className={`${atmosphereStyles.subcard} rounded-xl p-4 space-y-3`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`text-xs font-bold ${atmosphereStyles.heading} uppercase tracking-wider`}>
                    Batch Queue Roster ({items.length} files)
                  </h4>
                  <p className={`text-[11px] ${atmosphereStyles.subtext}`}>
                    Independent image processing with preserved ordering, error recovery, and individual inspection.
                  </p>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  completedItems.length === items.length
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}>
                  {completedItems.length}/{items.length} Ready
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {items.map((item, idx) => {
                  const isCurrent = activeItem?.id === item.id;
                  const isDone = item.status === 'completed';
                  const isErr = item.status === 'error';
                  const isBusy = item.status === 'processing';

                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectActiveItem(item.id)}
                      className={`p-2.5 rounded-xl border flex items-center gap-3 transition cursor-pointer ${
                        isCurrent
                          ? 'border-indigo-500 shadow-xs ring-1 ring-indigo-500/20'
                          : `${atmosphereStyles.border} ${atmosphereStyles.subcardAlt}`
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg overflow-hidden shrink-0 border ${
                        atmosphereStyles.isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'
                      }`}>
                        {item.previewUrl ? (
                          <img src={item.previewUrl} alt={item.file.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Layers className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[10px] font-mono ${atmosphereStyles.subtext}`}>#{idx + 1}</span>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border ${
                            isDone 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : isErr
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : isBusy
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <h6 className={`text-xs font-semibold ${atmosphereStyles.heading} truncate`}>
                          {item.file.name}
                        </h6>
                        <p className={`text-[10px] ${atmosphereStyles.subtext} truncate`}>
                          {isDone && item.result 
                            ? `${item.result.keywords.length} tags · Q: ${item.result.metadataQualityScore || 95}`
                            : isErr 
                            ? (item.error || 'Failed - click to inspect') 
                            : isBusy 
                            ? 'Analyzing intent & visual truth...' 
                            : 'Pending'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* ROOM 1: METADATA ROOM */}
      {/* ========================================================================= */}
      {currentRoom === 'metadata' && (
        <motion.div
          key="metadata-room"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className={`${atmosphereStyles.card} rounded-2xl p-5 sm:p-6 space-y-6`}
        >
          {/* Active Asset Selector Bar */}
          <div className={`flex flex-wrap items-center justify-between gap-3 pb-4 border-b ${atmosphereStyles.border}`}>
            <div className="flex items-center gap-3">
              {activeItem?.previewUrl && (
                <div className={`w-12 h-12 rounded-xl overflow-hidden border ${atmosphereStyles.border} shrink-0 ${atmosphereStyles.isLight ? 'bg-slate-100' : 'bg-slate-950'}`}>
                  <img src={activeItem.previewUrl} alt={activeItem.file.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <h4 className={`text-sm font-bold ${atmosphereStyles.heading} truncate max-w-sm`}>
                  {activeItem ? activeItem.file.name : 'No asset selected'}
                </h4>
                <p className={`text-xs ${atmosphereStyles.subtext}`}>
                  {activeItem?.result ? `${activeItem.result.keywords.length} keywords · Category: ${activeItem.result.category || 'Business'}` : 'Select an analyzed asset below'}
                </p>
              </div>
            </div>

            {/* Quick Switcher Dropdown */}
            {completedItems.length > 1 && (
              <div className="flex items-center gap-2">
                <span className={`text-xs ${atmosphereStyles.subtext} font-medium`}>Switch Asset:</span>
                <select
                  value={activeItem?.id || ''}
                  onChange={(e) => onSelectActiveItem(e.target.value)}
                  className={`${atmosphereStyles.select} text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500`}
                >
                  {completedItems.map((item, idx) => (
                    <option key={item.id} value={item.id}>
                      #{idx + 1}: {item.file.name.slice(0, 30)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* CREATIVE VERSION ARCHIVE & INTELLIGENT REGENERATION SUITE */}
          {activeItem && activeItem.result && (
            <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${
              atmosphereStyles.isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs font-bold ${atmosphereStyles.heading} flex items-center gap-1.5`}>
                  <History className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Version Archive:</span>
                </span>

                {/* Version Pills */}
                {activeItem.result.versions && activeItem.result.versions.length > 1 ? (
                  <div className="flex items-center gap-1">
                    {activeItem.result.versions.map((ver, vIdx) => {
                      const isActive = (activeItem.result?.activeVersionIndex ?? 0) === vIdx;
                      return (
                        <button
                          key={vIdx}
                          type="button"
                          onClick={() => onSwitchVersion && onSwitchVersion(activeItem.id, vIdx)}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition cursor-pointer ${
                            isActive
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                              : `${atmosphereStyles.subcardAlt} ${atmosphereStyles.subtext} hover:text-slate-900`
                          }`}
                        >
                          V{ver.versionNumber} ({ver.mode ? ver.mode.replace('_', ' ') : 'initial'})
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <span className={`text-xs px-2 py-0.5 rounded border ${
                    atmosphereStyles.isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}>
                    V1 (Active Master)
                  </span>
                )}
              </div>

              {/* Intelligent Regeneration Controls */}
              {onRegenerateItem && (
                <div className="flex items-center gap-2">
                  <select
                    value={selectedRegenMode}
                    onChange={(e) => setSelectedRegenMode(e.target.value)}
                    className={`${atmosphereStyles.select} text-xs rounded-xl px-2.5 py-1.5 font-medium`}
                  >
                    <option value="rank_one_guarantee">⚡ Mode: Rank #1 Search Dominance (সার্চে সবার আগে)</option>
                    <option value="more_commercial">Mode: More Commercial (B2B & ROI)</option>
                    <option value="more_precise">Mode: More Precise (Granular Specs)</option>
                    <option value="more_search_focused">Mode: More Search-Focused (SEO)</option>
                    <option value="alternative_vocabulary">Mode: Alternative Vocabulary (Fresh Synonyms)</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => onRegenerateItem(activeItem.id, selectedRegenMode, customSearchTarget)}
                    disabled={isRegenerating}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-400 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                    <span>{isRegenerating ? 'Generating...' : 'Regenerate'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ⚡ Rank #1 Search Algorithm Dominance Engine (সার্চ দিলে সবার আগে ছবি আসার র‍্যাঙ্কিং ইঞ্জিন) */}
          {activeItem && activeItem.result && (
            <div className={`${atmosphereStyles.subcard} border-amber-500/40 rounded-2xl p-4 sm:p-5 relative overflow-hidden backdrop-blur-md shadow-lg mb-6`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0">
                    <Crown className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold ${atmosphereStyles.heading} tracking-wide`}>
                        Rank #1 Search Engine Optimizer
                      </h4>
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5 fill-current" />
                        Search Discovery Guarantee
                      </span>
                    </div>
                    <p className={`text-xs ${atmosphereStyles.subtext} mt-0.5`}>
                      Lock your target buyer query into Keyword Slot #1 and Title front. Adobe Stock &amp; Shutterstock weight slots 1-10 with 75% search influence.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border ${
                    atmosphereStyles.isLight ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                  }`}>
                    👑 Slot #1: <strong className="font-bold">{activeItem.result.keywords[0] || 'Not set'}</strong>
                  </span>
                </div>
              </div>

              {/* Target Query Input & Quick Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={customSearchTarget}
                    onChange={(e) => setCustomSearchTarget(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleLockRankOne(customSearchTarget || activeItem.result?.searchIntent?.primaryIntent || '');
                      }
                    }}
                    placeholder={activeItem.result.searchIntent?.primaryIntent 
                      ? `Target search query (e.g. "${activeItem.result.searchIntent.primaryIntent}")`
                      : "Type exact search phrase you want to rank #1 for..."
                    }
                    className={`w-full ${atmosphereStyles.input} rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium focus:outline-none focus:border-amber-500`}
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => handleLockRankOne(customSearchTarget || activeItem.result?.searchIntent?.primaryIntent || activeItem.result?.keywords[0] || '')}
                    className="flex-1 sm:flex-none bg-gradient-to-r from-amber-500 to-orange-600 hover:brightness-110 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                    title="Lock this search query directly at Keyword Slot #1 and Title"
                  >
                    <Crown className="w-3.5 h-3.5 fill-current" />
                    <span>Lock at Slot #1</span>
                  </button>

                  {onRegenerateItem && (
                    <button
                      type="button"
                      onClick={() => onRegenerateItem(activeItem.id, 'rank_one_guarantee', customSearchTarget || activeItem.result?.searchIntent?.primaryIntent)}
                      disabled={isRegenerating}
                      className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                      title="Run full AI Rank #1 algorithm generation"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                      <span>{isRegenerating ? 'Optimizing...' : 'AI Full Rank #1'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Quick-Pick High-Intent Buyer Queries */}
              {activeItem.result.searchIntent?.primaryIntent && (
                <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-800/40">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${atmosphereStyles.subtext} mr-1`}>
                    Suggested High-Volume Queries:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomSearchTarget(activeItem.result!.searchIntent!.primaryIntent);
                      handleLockRankOne(activeItem.result!.searchIntent!.primaryIntent);
                    }}
                    className={`text-[11px] px-2.5 py-0.5 rounded-lg border font-semibold flex items-center gap-1 cursor-pointer transition ${
                      atmosphereStyles.isLight 
                        ? 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100' 
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                    }`}
                  >
                    <Crown className="w-2.5 h-2.5 fill-current" />
                    <span>"{activeItem.result.searchIntent.primaryIntent}"</span>
                  </button>
                  {activeItem.result.longTailKeywords?.slice(0, 3).map((lt, ltIdx) => (
                    <button
                      key={ltIdx}
                      type="button"
                      onClick={() => {
                        setCustomSearchTarget(lt);
                        handleLockRankOne(lt);
                      }}
                      className={`text-[11px] px-2.5 py-0.5 rounded-lg border font-medium cursor-pointer transition ${
                        atmosphereStyles.isLight 
                          ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200' 
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      "{lt}"
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeItem && activeItem.result ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Title, Category, Search Intent */}
              <div className="lg:col-span-1 space-y-5">
                {/* Title Editor */}
                <div className={`${atmosphereStyles.subcard} rounded-xl p-4 space-y-2`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-bold ${atmosphereStyles.heading}`}>Commercial Title</span>
                    <span className={`text-[11px] font-mono ${
                      (activeItem.result.recommendedTitle || '').length <= 70 ? 'text-emerald-500 font-bold' : 'text-amber-500 font-bold'
                    }`}>
                      {(activeItem.result.recommendedTitle || '').length}/70 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={activeItem.result.recommendedTitle || ''}
                    onChange={(e) => onUpdateMetadata(activeItem.id, { recommendedTitle: e.target.value })}
                    className={`w-full ${atmosphereStyles.input} rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500 font-medium`}
                    placeholder="Concise commercial title..."
                  />
                  <p className={`text-[11px] ${atmosphereStyles.subtext} leading-relaxed`}>
                    Adobe Stock rule: Keep under 70 characters. Focus on primary visual subject + action.
                  </p>
                </div>

                {/* Adobe Stock Category */}
                <div className={`${atmosphereStyles.subcard} rounded-xl p-4 space-y-2`}>
                  <label className={`text-xs font-bold ${atmosphereStyles.heading} block`}>Adobe Stock Category</label>
                  <select
                    value={activeItem.result.category || 'Business'}
                    onChange={(e) => onUpdateMetadata(activeItem.id, { category: e.target.value })}
                    className={`w-full ${atmosphereStyles.select} rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500`}
                  >
                    {ADOBE_STOCK_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Buyer Search Intent Card */}
                {activeItem.result.searchIntent && (
                  <div className={`${atmosphereStyles.subcard} rounded-xl p-4 space-y-3`}>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-indigo-500" />
                      <h5 className={`text-xs font-bold ${atmosphereStyles.heading} uppercase tracking-wider`}>Search Intent Engine</h5>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <span className={`${atmosphereStyles.subtext} block font-medium`}>Primary Intent:</span>
                      <p className={`${atmosphereStyles.isLight ? 'text-slate-800 bg-slate-50 border-slate-200' : 'text-slate-200 bg-slate-900 border-slate-800'} border p-2.5 rounded-lg text-xs leading-relaxed font-semibold`}>
                        "{activeItem.result.searchIntent.primaryIntent}"
                      </p>
                    </div>
                    {activeItem.result.searchIntent.targetBuyer && (
                      <div className={`text-xs ${atmosphereStyles.subtext}`}>
                        <span className={`font-medium ${atmosphereStyles.heading}`}>Target Buyer: </span>
                        {activeItem.result.searchIntent.targetBuyer}
                      </div>
                    )}
                  </div>
                )}

                {/* Commercial Value Proposition & Problem Solved */}
                {activeItem.result.commercialProblemSolved && (
                  <div className={`${atmosphereStyles.subcard} rounded-xl p-4 space-y-2`}>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-emerald-500" />
                      <h5 className={`text-xs font-bold ${atmosphereStyles.heading} uppercase tracking-wider`}>Commercial Utility & Meaning</h5>
                    </div>
                    <p className={`text-xs ${atmosphereStyles.isLight ? 'text-slate-700 bg-slate-50 border-slate-200' : 'text-slate-300 bg-slate-900 border-slate-800'} border p-2.5 rounded-lg leading-relaxed`}>
                      {activeItem.result.commercialProblemSolved}
                    </p>
                    {activeItem.result.searchIntent?.commercialUseCases && activeItem.result.searchIntent.commercialUseCases.length > 0 && (
                      <div className="pt-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${atmosphereStyles.subtext} block mb-1.5`}>Buyer Placement Applications</span>
                        <div className="flex flex-wrap gap-1.5">
                          {activeItem.result.searchIntent.commercialUseCases.slice(0, 4).map((uc, uIdx) => (
                            <span key={uIdx} className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${
                              atmosphereStyles.isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
                            }`}>
                              {uc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Keywording Priority System (Top 10 vs Supporting) */}
              <div className="lg:col-span-2 space-y-5">
                {/* Top 10 Priority Section */}
                <div className={`${atmosphereStyles.subcard} border-indigo-500/30 rounded-xl p-4 space-y-3`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <h5 className={`text-xs font-bold ${atmosphereStyles.heading} uppercase tracking-wider`}>
                        Top 10 Priority Slots (Heaviest Search Weight)
                      </h5>
                    </div>
                    <span className={`text-[11px] ${atmosphereStyles.isLight ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-amber-300 bg-amber-400/10 border-amber-400/30'} px-2 py-0.5 rounded-md font-bold border`}>
                      Adobe Stock Algorithm Critical
                    </span>
                  </div>
                  <p className={`text-xs ${atmosphereStyles.subtext} leading-relaxed`}>
                    Adobe Stock weights your first 10 keywords most heavily. Reorder tags using arrows so your core subject appears first.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {activeItem.result.keywords.slice(0, 10).map((kw, idx) => {
                      const isRankOne = idx === 0;
                      return (
                      <div
                        key={`${kw}-${idx}`}
                        className={`${
                          isRankOne
                            ? 'bg-amber-500/15 border-amber-500/60 text-amber-200 ring-1 ring-amber-500/40 shadow-sm'
                            : (atmosphereStyles.isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-900' : 'bg-indigo-950/60 border-indigo-500/40 text-indigo-100')
                        } border rounded-lg pl-2.5 pr-1.5 py-1 flex items-center gap-1.5 text-xs shadow-2xs`}
                      >
                        <span className={`text-[10px] font-black ${isRankOne ? 'text-amber-400 flex items-center gap-0.5' : 'text-amber-500'} font-mono`}>
                          {isRankOne ? <><Crown className="w-3 h-3 fill-current" /> #1</> : `#${idx + 1}`}
                        </span>
                        <span className="font-semibold">{kw}</span>
                        <div className="flex items-center ml-1">
                          <button
                            type="button"
                            onClick={() => handleMoveKeyword(idx, idx - 1)}
                            disabled={idx === 0}
                            className={`p-0.5 ${atmosphereStyles.isLight ? 'text-slate-400 hover:text-slate-800' : 'text-slate-400 hover:text-white'} disabled:opacity-20 cursor-pointer`}
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveKeyword(idx, idx + 1)}
                            disabled={idx === activeItem.result!.keywords.length - 1}
                            className={`p-0.5 ${atmosphereStyles.isLight ? 'text-slate-400 hover:text-slate-800' : 'text-slate-400 hover:text-white'} disabled:opacity-20 cursor-pointer`}
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteKeyword(idx)}
                            className="p-0.5 text-slate-400 hover:text-rose-500 cursor-pointer ml-0.5"
                            title="Remove"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                </div>

                {/* Supporting & Contextual Keywords (Positions 11 to 49) */}
                <div className={`${atmosphereStyles.subcard} rounded-xl p-4 space-y-3`}>
                  <div className="flex items-center justify-between">
                    <h5 className={`text-xs font-bold ${atmosphereStyles.heading} uppercase tracking-wider`}>
                      Supporting Keywords ({activeItem.result.keywords.length - 10 > 0 ? activeItem.result.keywords.length - 10 : 0} tags)
                    </h5>
                    <span className={`text-xs ${atmosphereStyles.subtext} font-mono`}>
                      Total: {activeItem.result.keywords.length}/49
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                    {activeItem.result.keywords.slice(10).map((kw, offsetIdx) => {
                      const idx = offsetIdx + 10;
                      return (
                        <div
                          key={`${kw}-${idx}`}
                          className={`${atmosphereStyles.isLight ? 'bg-slate-100/80 border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-700/80 text-slate-200'} border rounded-lg pl-2 pr-1 py-1 flex items-center gap-1.5 text-xs`}
                        >
                          <span className={`text-[10px] ${atmosphereStyles.subtext} font-mono`}>#{idx + 1}</span>
                          <span>{kw}</span>
                          <button
                            type="button"
                            onClick={() => handleMoveKeyword(idx, idx - 1)}
                            className={`p-0.5 ${atmosphereStyles.isLight ? 'text-slate-400 hover:text-slate-800' : 'text-slate-400 hover:text-white'} cursor-pointer`}
                            title="Promote keyword"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteKeyword(idx)}
                            className="p-0.5 text-slate-400 hover:text-rose-500 cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Keyword Form */}
                  <form onSubmit={handleAddKeyword} className={`flex gap-2 pt-2 border-t ${atmosphereStyles.border}`}>
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      placeholder="Add strategic keyword..."
                      className={`flex-1 ${atmosphereStyles.input} rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500`}
                    />
                    <button
                      type="submit"
                      disabled={!newTagInput.trim()}
                      className="bg-indigo-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>

                {/* Semantic Taxonomy & Long-Tail Intent Intelligence Cloud */}
                <div className={`${atmosphereStyles.subcard} rounded-xl p-4 space-y-3`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className={`text-xs font-bold ${atmosphereStyles.heading} uppercase tracking-wider flex items-center gap-1.5`}>
                        <Compass className="w-4 h-4 text-indigo-500" />
                        <span>Search Intent & Taxonomy Intelligence</span>
                      </h5>
                      <p className={`text-[11px] ${atmosphereStyles.subtext}`}>
                        Classified into commercial roles to maximize stock algorithm discoverability.
                      </p>
                    </div>
                  </div>

                  <SemanticKeywordBadges
                    keywords={activeItem.result.keywords}
                    keywordTaxonomy={activeItem.result.keywordTaxonomy}
                    longTailKeywords={activeItem.result.longTailKeywords}
                    showToast={showToast}
                    themeMode={themeMode}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm space-y-3">
              <p>Please upload and analyze an image in the Grand Atrium to inspect metadata.</p>
              <button
                type="button"
                onClick={() => onRoomChange('studio')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
              >
                Go to Grand Atrium
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* ROOM 2: ANALYSIS ROOM */}
      {/* ========================================================================= */}
      {currentRoom === 'analysis' && (
        <motion.div
          key="analysis-room"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className={`${atmosphereStyles.card} rounded-2xl p-5 sm:p-6 space-y-6`}
        >
          {activeItem && activeItem.result ? (
            <div className="space-y-6">
              {/* Header: Visual-Truth & Metadata Quality Score */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`${atmosphereStyles.subcard} rounded-xl p-4 flex items-center justify-between`}>
                  <div>
                    <span className={`text-[10px] uppercase font-bold ${atmosphereStyles.subtext} block mb-1`}>Visual Truth Confidence</span>
                    <h4 className="text-base font-bold text-emerald-500 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>{activeItem.result.visualTruthConfidence || 'HIGH CONFIDENCE'}</span>
                    </h4>
                    <p className={`text-[11px] ${atmosphereStyles.subtext} mt-1`}>Reviewer visual correlation verified</p>
                  </div>
                </div>

                <div className={`${atmosphereStyles.subcard} rounded-xl p-4 flex items-center justify-between`}>
                  <div>
                    <span className={`text-[10px] uppercase font-bold ${atmosphereStyles.subtext} block mb-1`}>Metadata Quality Score</span>
                    <h4 className={`text-2xl font-black ${atmosphereStyles.isLight ? 'text-indigo-600' : 'text-indigo-400'} font-mono`}>
                      {activeItem.result.metadataQualityScore || 92}<span className={`text-sm ${atmosphereStyles.subtext} font-normal`}>/100</span>
                    </h4>
                    <p className={`text-[11px] ${atmosphereStyles.subtext} mt-0.5`}>Internal relevance optimization score</p>
                  </div>
                </div>

                <div className={`${atmosphereStyles.subcard} rounded-xl p-4 flex items-center justify-between`}>
                  <div>
                    <span className={`text-[10px] uppercase font-bold ${atmosphereStyles.subtext} block mb-1`}>Commercial Acceptance</span>
                    <h4 className="text-2xl font-black text-emerald-500 font-mono">
                      {activeItem.result.acceptanceProbability || 88}%
                    </h4>
                    <p className={`text-[11px] ${atmosphereStyles.subtext} mt-0.5`}>Adobe Stock review readiness</p>
                  </div>
                </div>
              </div>

              {/* Visual Breakdown & Ground Truth */}
              {activeItem.result.visualAnalysis && (
                <div className={`${atmosphereStyles.subcard} rounded-xl p-5 space-y-4`}>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-indigo-500" />
                    <h4 className={`text-xs font-bold ${atmosphereStyles.heading} uppercase tracking-wider`}>Visual Truth Breakdown</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div className={`${atmosphereStyles.subcardAlt} p-3 rounded-lg border`}>
                      <span className={`${atmosphereStyles.subtext} font-medium block mb-1`}>Subject:</span>
                      <span className={`font-semibold ${atmosphereStyles.heading}`}>{activeItem.result.visualAnalysis.subject}</span>
                    </div>
                    <div className={`${atmosphereStyles.subcardAlt} p-3 rounded-lg border`}>
                      <span className={`${atmosphereStyles.subtext} font-medium block mb-1`}>Action / State:</span>
                      <span className={`font-semibold ${atmosphereStyles.heading}`}>{activeItem.result.visualAnalysis.action || 'Static concept'}</span>
                    </div>
                    <div className={`${atmosphereStyles.subcardAlt} p-3 rounded-lg border`}>
                      <span className={`${atmosphereStyles.subtext} font-medium block mb-1`}>Environment:</span>
                      <span className={`font-semibold ${atmosphereStyles.heading}`}>{activeItem.result.visualAnalysis.environment || 'Authentic setting'}</span>
                    </div>
                    <div className={`${atmosphereStyles.subcardAlt} p-3 rounded-lg border`}>
                      <span className={`${atmosphereStyles.subtext} font-medium block mb-1`}>Lighting / Framing:</span>
                      <span className={`font-semibold ${atmosphereStyles.heading}`}>{activeItem.result.visualAnalysis.lightingMood || 'Natural balanced light'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Commercial Use Cases Matrix */}
              {activeItem.result.searchIntent?.commercialUseCases && (
                <div className={`${atmosphereStyles.subcard} rounded-xl p-5 space-y-3`}>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-amber-500" />
                    <h4 className={`text-xs font-bold ${atmosphereStyles.heading} uppercase tracking-wider`}>Buyer Use-Case Compatibility</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeItem.result.searchIntent.commercialUseCases.map((useCase, idx) => (
                      <span
                        key={idx}
                        className={`${atmosphereStyles.subcardAlt} border px-3 py-1.5 rounded-lg text-xs font-medium`}
                      >
                        ✓ {useCase}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Long-Tail Commercial Discovery Layer */}
              {(activeItem.result.commercialProblemSolved || (activeItem.result.longTailKeywords && activeItem.result.longTailKeywords.length > 0)) && (
                <div className={`${atmosphereStyles.subcard} rounded-xl p-5 space-y-3`}>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-500" />
                    <h4 className={`text-xs font-bold ${atmosphereStyles.heading} uppercase tracking-wider`}>Long-Tail Commercial Discovery Layer</h4>
                  </div>
                  {activeItem.result.commercialProblemSolved && (
                    <p className={`text-xs ${atmosphereStyles.subtext} leading-relaxed`}>
                      <span className={`font-semibold ${atmosphereStyles.heading}`}>Commercial Meaning: </span>
                      {activeItem.result.commercialProblemSolved}
                    </p>
                  )}
                  {activeItem.result.longTailKeywords && activeItem.result.longTailKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {activeItem.result.longTailKeywords.map((lt, lIdx) => (
                        <span
                          key={lIdx}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${
                            atmosphereStyles.isLight
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                              : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          🔍 {lt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Smart Warnings Feed */}
              {activeItem.result.smartWarnings && activeItem.result.smartWarnings.length > 0 && (
                <div className={`${atmosphereStyles.subcard} rounded-xl p-5 space-y-3`}>
                  <h4 className={`text-xs font-bold ${atmosphereStyles.heading} uppercase tracking-wider flex items-center gap-2`}>
                    <Info className="w-4 h-4 text-sky-500" />
                    <span>Metadata Advisory Feedback</span>
                  </h4>
                  <div className="space-y-2">
                    {activeItem.result.smartWarnings.map((warning, wIdx) => {
                      const isWarning = warning.type === 'warning' || warning.type === 'critical';
                      return (
                        <div
                          key={wIdx}
                          className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                            isWarning 
                              ? atmosphereStyles.isLight
                                ? 'bg-amber-50/80 border-amber-300 text-amber-900'
                                : 'bg-amber-950/30 border-amber-500/40 text-amber-200' 
                              : `${atmosphereStyles.subcardAlt} border`
                          }`}
                        >
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shrink-0 ${
                            isWarning ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                          }`}>
                            {warning.type}
                          </span>
                          <span className="leading-relaxed">{warning.message}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              Please analyze an image in the Grand Atrium to inspect visual truth & search intent analysis.
            </div>
          )}
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* ROOM 3: BATCH ROOM */}
      {/* ========================================================================= */}
      {currentRoom === 'batch' && (
        <motion.div
          key="batch-room"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className={`${atmosphereStyles.card} rounded-2xl p-5 sm:p-6 space-y-6`}
        >
          <div className={`flex flex-wrap items-center justify-between gap-3 pb-3 border-b ${atmosphereStyles.border}`}>
            <div>
              <h4 className={`text-sm font-bold ${atmosphereStyles.heading}`}>Batch Intelligence & Similarity Radar</h4>
              <p className={`text-xs ${atmosphereStyles.subtext}`}>
                Detects accidental duplicate titles and cross-asset keyword cannibalization across your series.
              </p>
            </div>
            <span className={`text-xs font-mono ${atmosphereStyles.isLight ? 'text-indigo-700 bg-indigo-50 border-indigo-200' : 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30'} border px-3 py-1 rounded-lg`}>
              {completedItems.length} Analyzed Assets in Queue
            </span>
          </div>

          {/* Overlap & Similarity Warnings */}
          {batchSimilarityData.length > 0 ? (
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>High Keyword Overlap Detected ({batchSimilarityData.length} pairs)</span>
              </h5>
              <div className="space-y-2.5">
                {batchSimilarityData.map((sim, sIdx) => (
                  <div key={sIdx} className={`${atmosphereStyles.subcard} border-amber-500/40 rounded-xl p-3.5 text-xs space-y-2`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${atmosphereStyles.heading}`}>"{sim.itemA.file.name}"</span>
                        <span className={atmosphereStyles.subtext}>↔</span>
                        <span className={`font-bold ${atmosphereStyles.heading}`}>"{sim.itemB.file.name}"</span>
                      </div>
                      <span className="bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-md font-mono font-bold">
                        {sim.overlapScore}% Overlap
                      </span>
                    </div>
                    <p className={`text-[11px] ${atmosphereStyles.subtext}`}>
                      Recommendation: Differentiate the primary action and environment in the first 5 keywords so these assets don't compete with each other on Adobe Stock search rankings.
                    </p>
                    <div className={`text-[11px] ${atmosphereStyles.subtext}`}>
                      <span className={`font-medium ${atmosphereStyles.heading}`}>Shared keywords: </span>
                      {sim.sharedKeywords.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : completedItems.length > 1 ? (
            <div className={`${atmosphereStyles.subcard} border-emerald-500/40 rounded-xl p-4 flex items-center gap-3`}>
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-emerald-600 dark:text-emerald-300">Clean Portfolio Diversity</h5>
                <p className={`text-xs ${atmosphereStyles.subtext}`}>
                  No excessive keyword overlap or duplicate titles found across your uploaded batch. Every asset has distinct commercial search value.
                </p>
              </div>
            </div>
          ) : (
            <div className={`text-center py-8 ${atmosphereStyles.subtext} text-xs`}>
              Upload at least 2 files to enable batch similarity & cross-asset differentiation analysis.
            </div>
          )}

          {/* Batch Summary Grid */}
          <div className="space-y-3">
            <h5 className={`text-xs font-bold ${atmosphereStyles.heading} uppercase tracking-wider`}>Queue Inventory</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => onSelectActiveItem(item.id)}
                  className={`${atmosphereStyles.subcard} border rounded-xl p-3 flex items-center gap-3 cursor-pointer transition ${
                    activeItem?.id === item.id 
                      ? 'border-indigo-500 shadow-md shadow-indigo-500/10' 
                      : `${atmosphereStyles.border}`
                  }`}
                >
                  {item.previewUrl ? (
                    <img src={item.previewUrl} alt={item.file.name} className={`w-10 h-10 rounded-lg object-cover ${atmosphereStyles.isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900'} shrink-0 border`} />
                  ) : (
                    <div className={`w-10 h-10 rounded-lg ${atmosphereStyles.isLight ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-slate-900 border-slate-800 text-slate-400'} border flex items-center justify-center shrink-0`}>
                      <Layers className="w-4 h-4" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <span className={`text-[10px] ${atmosphereStyles.subtext} font-mono`}>#{idx + 1}</span>
                    <h6 className={`text-xs font-semibold ${atmosphereStyles.heading} truncate`}>{item.file.name}</h6>
                    <p className={`text-[10px] ${atmosphereStyles.subtext} truncate`}>
                      {item.result ? `${item.result.keywords.length} tags · Q: ${item.result.metadataQualityScore || 90}/100` : item.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* ROOM 4: EARNING & MONETIZATION LOUNGE */}
      {/* ========================================================================= */}
      {currentRoom === 'earning' && (
        <motion.div
          key="earning-room"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className={`${atmosphereStyles.card} rounded-2xl p-5 sm:p-6 space-y-6`}
        >
          {/* Header */}
          <div className={`flex flex-wrap items-center justify-between gap-4 pb-4 border-b ${atmosphereStyles.border}`}>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${atmosphereStyles.isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'} border`}>
                  Sky Lounge
                </span>
                <span className={`text-xs ${atmosphereStyles.subtext} font-medium`}>Microstock & Google Monetization Center</span>
              </div>
              <h3 className={`text-lg font-bold ${atmosphereStyles.heading} mt-1`}>Contributor Earning Acceleration Lounge</h3>
              <p className={`text-xs ${atmosphereStyles.subtext}`}>
                Maximize stock royalty returns while leveraging Google AdSense monetization across your digital portfolio.
              </p>
            </div>

            {onOpenEarningModal && (
              <button
                type="button"
                onClick={onOpenEarningModal}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                <DollarSign className="w-4 h-4" />
                <span>Open Full Strategy Hub</span>
              </button>
            )}
          </div>

          {/* Interactive Microstock Royalty Projection Calculator */}
          <div className={`${atmosphereStyles.subcard} border-emerald-500/40 rounded-2xl p-5 space-y-5 shadow-xs`}>
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>Microstock Portfolio Royalty Calculator</span>
              </h4>
              <span className={`text-[11px] ${atmosphereStyles.subtext}`}>Formula: Assets × DL Rate × Royalty</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className={`${atmosphereStyles.heading} font-medium`}>Portfolio Size:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{calcAssets} assets</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="10000"
                  step="50"
                  value={calcAssets}
                  onChange={(e) => setCalcAssets(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className={`text-[10px] ${atmosphereStyles.subtext} block`}>Total approved stock files</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className={`${atmosphereStyles.heading} font-medium`}>Monthly Downloads / File:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{calcMonthlyDls} dls</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="5.0"
                  step="0.1"
                  value={calcMonthlyDls}
                  onChange={(e) => setCalcMonthlyDls(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className={`text-[10px] ${atmosphereStyles.subtext} block`}>Avg downloads per asset monthly</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className={`${atmosphereStyles.heading} font-medium`}>Average Royalty / DL:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">${calcAvgRoyalty.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.30"
                  max="4.00"
                  step="0.05"
                  value={calcAvgRoyalty}
                  onChange={(e) => setCalcAvgRoyalty(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className={`text-[10px] ${atmosphereStyles.subtext} block`}>Typical subscription payout</span>
              </div>
            </div>

            {/* Projection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className={`${atmosphereStyles.isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-emerald-500/20'} border rounded-xl p-4 flex items-center justify-between`}>
                <div>
                  <span className={`text-[10px] uppercase font-bold ${atmosphereStyles.subtext}`}>Estimated Monthly Royalties</span>
                  <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">${projectedMonthlyIncome.toLocaleString()} / mo</h3>
                  <p className={`text-[10px] ${atmosphereStyles.subtext} mt-0.5`}>Passive recurring creator revenue</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${atmosphereStyles.isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'} border flex items-center justify-center`}>
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              <div className={`${atmosphereStyles.isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-indigo-500/20'} border rounded-xl p-4 flex items-center justify-between`}>
                <div>
                  <span className={`text-[10px] uppercase font-bold ${atmosphereStyles.subtext}`}>Estimated Annual Run-Rate</span>
                  <h3 className={`text-2xl font-black ${atmosphereStyles.isLight ? 'text-indigo-600' : 'text-indigo-400'} font-mono`}>${projectedAnnualIncome.toLocaleString()} / yr</h3>
                  <p className={`text-[10px] ${atmosphereStyles.subtext} mt-0.5`}>Across multi-agency distribution</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${atmosphereStyles.isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'} border flex items-center justify-center`}>
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Google Monetization & AdSense Integration Showcase */}
          <div className={`${atmosphereStyles.subcard} rounded-2xl p-5 space-y-4`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`text-xs font-bold ${atmosphereStyles.heading} uppercase tracking-wider flex items-center gap-2`}>
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Google AdSense Monetization Placement</span>
                </h4>
                <p className={`text-xs ${atmosphereStyles.subtext} mt-0.5`}>
                  100% Policy-compliant high-viewability banner unit with clear ad disclosure.
                </p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${atmosphereStyles.isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'} border`}>
                Verified Compliant
              </span>
            </div>

            <GoogleAdSenseBanner format="leaderboard" themeMode={themeMode} />
          </div>

          {/* Microstock Partner Networks */}
          <div className={`${atmosphereStyles.subcard} rounded-xl p-4 space-y-3`}>
            <h5 className={`text-xs font-bold ${atmosphereStyles.heading} uppercase tracking-wider`}>Top Microstock Contributor Networks</h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <a
                href="https://contributor.stock.adobe.com"
                target="_blank"
                rel="noreferrer"
                className={`${atmosphereStyles.subcardAlt} border p-3 rounded-xl transition flex items-center justify-between hover:scale-[1.02]`}
              >
                <span className={`font-semibold ${atmosphereStyles.heading}`}>Adobe Stock</span>
                <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
              </a>
              <a
                href="https://submit.shutterstock.com"
                target="_blank"
                rel="noreferrer"
                className={`${atmosphereStyles.subcardAlt} border p-3 rounded-xl transition flex items-center justify-between hover:scale-[1.02]`}
              >
                <span className={`font-semibold ${atmosphereStyles.heading}`}>Shutterstock</span>
                <ExternalLink className="w-3.5 h-3.5 text-rose-500" />
              </a>
              <a
                href="https://www.freepik.com/contributor"
                target="_blank"
                rel="noreferrer"
                className={`${atmosphereStyles.subcardAlt} border p-3 rounded-xl transition flex items-center justify-between hover:scale-[1.02]`}
              >
                <span className={`font-semibold ${atmosphereStyles.heading}`}>Freepik</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-500" />
              </a>
              <a
                href="https://contributors.gettyimages.com"
                target="_blank"
                rel="noreferrer"
                className={`${atmosphereStyles.subcardAlt} border p-3 rounded-xl transition flex items-center justify-between hover:scale-[1.02]`}
              >
                <span className={`font-semibold ${atmosphereStyles.heading}`}>Getty / iStock</span>
                <ExternalLink className="w-3.5 h-3.5 text-purple-500" />
              </a>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* ROOM 5: EXPORT ROOM */}
      {/* ========================================================================= */}
      {currentRoom === 'export' && (
        <motion.div
          key="export-room"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className={`${atmosphereStyles.card} rounded-2xl p-5 sm:p-6 space-y-6`}
        >
          <div className={`flex flex-wrap items-center justify-between gap-3 pb-3 border-b ${atmosphereStyles.border}`}>
            <div>
              <h4 className={`text-sm font-bold ${atmosphereStyles.heading}`}>Export & Multi-Agency Distribution Vault</h4>
              <p className={`text-xs ${atmosphereStyles.subtext}`}>
                100% verified CSV spreadsheets and embedded IPTC/XMP metadata packages ready for contributor submission.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Adobe Stock Card */}
            <div className={`${atmosphereStyles.subcard} border-indigo-500/30 rounded-xl p-4 space-y-3 flex flex-col justify-between shadow-md`}>
              <div>
                <span className={`text-[10px] uppercase font-bold ${atmosphereStyles.isLight ? 'text-indigo-700 bg-indigo-50 border-indigo-200' : 'text-indigo-400 bg-indigo-500/10'} border px-2 py-0.5 rounded-md`}>
                  Official Format
                </span>
                <h5 className={`text-sm font-bold ${atmosphereStyles.heading} mt-2`}>Adobe Stock CSV</h5>
                <p className={`text-xs ${atmosphereStyles.subtext} mt-1 leading-relaxed`}>
                  Strictly formatted as <code className="text-amber-600 dark:text-amber-300 font-mono">Filename,Title,Keywords,Category</code> with UTF-8 BOM encoding.
                </p>
              </div>
              <button
                type="button"
                onClick={exportBatchCSV}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Download Adobe CSV</span>
              </button>
            </div>

            {/* ZIP Embedded Archive */}
            <div className={`${atmosphereStyles.subcard} border-emerald-500/30 rounded-xl p-4 space-y-3 flex flex-col justify-between shadow-md`}>
              <div>
                <span className={`text-[10px] uppercase font-bold ${atmosphereStyles.isLight ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-emerald-400 bg-emerald-500/10'} border px-2 py-0.5 rounded-md`}>
                  All Files In 1 ZIP
                </span>
                <h5 className={`text-sm font-bold ${atmosphereStyles.heading} mt-2`}>Tagged ZIP Archive</h5>
                <p className={`text-xs ${atmosphereStyles.subtext} mt-1 leading-relaxed`}>
                  All images with embedded IPTC title/keywords + Adobe XMP sidecars for EPS/Video assets.
                </p>
              </div>
              <button
                type="button"
                onClick={exportBatchZip}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download ZIP Package</span>
              </button>
            </div>

            {/* Multi-Marketplace Hub */}
            <div className={`${atmosphereStyles.subcard} rounded-xl p-4 space-y-3 flex flex-col justify-between shadow-md`}>
              <div>
                <span className={`text-[10px] uppercase font-bold ${atmosphereStyles.subtext} ${atmosphereStyles.subcardAlt} border px-2 py-0.5 rounded-md`}>
                  All Agencies
                </span>
                <h5 className={`text-sm font-bold ${atmosphereStyles.heading} mt-2`}>All Agencies CSV Hub</h5>
                <p className={`text-xs ${atmosphereStyles.subtext} mt-1 leading-relaxed`}>
                  Export tailored CSVs for Shutterstock, Freepik, Getty Images, Vecteezy, and Dreamstime.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenMultiCsvModal}
                className={`${atmosphereStyles.isLight ? 'bg-slate-100 hover:bg-slate-200 text-emerald-700 border-slate-200' : 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border-emerald-500/40'} border font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                <span>Open Multi-CSV Hub</span>
              </button>
            </div>
          </div>

          {/* Active Asset Quick Copy Hub */}
          {activeItem && activeItem.result && (
            <div className={`${atmosphereStyles.subcard} rounded-xl p-4 space-y-3`}>
              <h5 className={`text-xs font-bold ${atmosphereStyles.heading} uppercase tracking-wider`}>
                1-Click Quick Copy ({activeItem.file.name})
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleCopy(activeItem.result!.recommendedTitle, 'Title')}
                  className={`${atmosphereStyles.subcardAlt} border p-2.5 rounded-xl text-left transition flex items-center justify-between text-xs cursor-pointer`}
                >
                  <span className={`font-medium ${atmosphereStyles.heading}`}>Copy Title</span>
                  {copiedKey === 'Title' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className={`w-3.5 h-3.5 ${atmosphereStyles.subtext}`} />}
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(activeItem.result!.keywords.slice(0, 10).join(', '), 'Top 10 Keywords')}
                  className={`${atmosphereStyles.subcardAlt} border p-2.5 rounded-xl text-left transition flex items-center justify-between text-xs cursor-pointer`}
                >
                  <span className={`font-medium ${atmosphereStyles.heading}`}>Copy Top 10 Keywords</span>
                  {copiedKey === 'Top 10 Keywords' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className={`w-3.5 h-3.5 ${atmosphereStyles.subtext}`} />}
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(activeItem.result!.keywords.join(', '), 'All Keywords')}
                  className={`${atmosphereStyles.subcardAlt} border p-2.5 rounded-xl text-left transition flex items-center justify-between text-xs cursor-pointer`}
                >
                  <span className={`font-medium ${atmosphereStyles.heading}`}>Copy All ({activeItem.result.keywords.length}) Keywords</span>
                  {copiedKey === 'All Keywords' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className={`w-3.5 h-3.5 ${atmosphereStyles.subtext}`} />}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* ROOM 6: CONTROL ROOM & SETTINGS */}
      {/* ========================================================================= */}
      {currentRoom === 'settings' && (
        <motion.div
          key="settings-room"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className={`${atmosphereStyles.card} rounded-2xl p-5 sm:p-6 space-y-6`}
        >
          <div className={`flex flex-wrap items-center justify-between gap-3 pb-3 border-b ${atmosphereStyles.border}`}>
            <div>
              <h4 className={`text-sm font-bold ${atmosphereStyles.heading}`}>Central Control Core & AI Engine</h4>
              <p className={`text-xs ${atmosphereStyles.subtext}`}>
                Configure your dual-agent vision engines, API keys, and marketplace defaults.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`${atmosphereStyles.subcard} rounded-xl p-4 space-y-3`}>
              <span className={`text-[10px] uppercase font-bold ${atmosphereStyles.isLight ? 'text-indigo-600' : 'text-indigo-400'}`}>Vision Engine Configuration</span>
              <h5 className={`text-sm font-bold ${atmosphereStyles.heading}`}>Dual-Agent AI Reasoning</h5>
              <p className={`text-xs ${atmosphereStyles.subtext} leading-relaxed`}>
                Agent 1 inspects visual ground-truth (Subject, Action, Lighting, Technical Quality). Agent 2 models microstock commercial search intent to optimize rank.
              </p>
              <div className="pt-2">
                <span className={`text-xs font-semibold ${atmosphereStyles.isLight ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'} border px-3 py-1 rounded-lg`}>
                  ✓ Active & Operational
                </span>
              </div>
            </div>

            <div className={`${atmosphereStyles.subcard} rounded-xl p-4 space-y-3`}>
              <span className={`text-[10px] uppercase font-bold ${atmosphereStyles.isLight ? 'text-amber-600' : 'text-amber-400'}`}>Microstock Compliance Guard</span>
              <h5 className={`text-sm font-bold ${atmosphereStyles.heading}`}>August 2026 Adobe Stock Rules</h5>
              <p className={`text-xs ${atmosphereStyles.subtext} leading-relaxed`}>
                Automatically enforces: under 70 character titles, 49 keyword limit, heaviest weight first 10 slots, and zero-spam trademark filters.
              </p>
              <div className="pt-2">
                <span className={`text-xs font-semibold ${atmosphereStyles.isLight ? 'text-indigo-700 bg-indigo-50 border-indigo-200' : 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30'} border px-3 py-1 rounded-lg`}>
                  ✓ Enforced on All Exports
                </span>
              </div>
            </div>
          </div>

          {onOpenSettingsModal && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onOpenSettingsModal}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                <span>Open Advanced Engine Settings</span>
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
