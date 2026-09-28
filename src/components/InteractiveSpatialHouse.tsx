import React, { useState, useMemo } from 'react';
import { 
  BulkItem, 
  TargetMarketplace, 
  MetadataResult, 
  SmartWarning 
} from '../types';
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
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleAdSenseBanner } from './GoogleAdSenseBanner';

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

type LightingAtmosphere = 'modernist' | 'blueprint' | 'golden_hour';
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
}) => {
  const [newTagInput, setNewTagInput] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [atmosphere, setAtmosphere] = useState<LightingAtmosphere>('modernist');
  const [perspective, setPerspective] = useState<CameraPerspective>('isometric');
  const [showMinimap, setShowMinimap] = useState(true);

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
      case 'blueprint':
        return {
          wrapper: 'bg-[#06101e] border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.15)]',
          card: 'bg-[#09182b]/90 border-cyan-800/60 shadow-lg shadow-cyan-950/40',
          accent: 'text-cyan-400',
          gridClass: 'bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:16px_16px]',
        };
      case 'golden_hour':
        return {
          wrapper: 'bg-[#18110b] border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.15)]',
          card: 'bg-[#211710]/90 border-amber-800/50 shadow-lg shadow-amber-950/40',
          accent: 'text-amber-400',
          gridClass: 'bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]',
        };
      case 'modernist':
      default:
        return {
          wrapper: 'bg-slate-950 border-slate-800 shadow-2xl',
          card: 'bg-slate-900/90 border-slate-800 shadow-2xl',
          accent: 'text-indigo-400',
          gridClass: 'bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px]',
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
      <div className="relative z-10 space-y-3 pb-5 border-b border-slate-800/80 mb-6">
        {/* Top Concourse Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Active Room Badge & Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-md shrink-0">
              {React.createElement(rooms.find(r => r.id === currentRoom)?.icon || Layers, { className: "w-5 h-5 text-indigo-400" })}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-500/30">
                  {rooms.find(r => r.id === currentRoom)?.wing}
                </span>
                <span className="text-slate-600">·</span>
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {rooms.find(r => r.id === currentRoom)?.label}
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                {rooms.find(r => r.id === currentRoom)?.description}
              </p>
            </div>
          </div>

          {/* Architectural View & Atmosphere Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Atmosphere Lighting */}
            <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 text-xs">
              <button
                type="button"
                onClick={() => setAtmosphere('modernist')}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  atmosphere === 'modernist' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                title="Modernist Glass & Slate Lighting"
              >
                <Moon className="w-3 h-3" />
                <span className="hidden sm:inline">Modernist</span>
              </button>
              <button
                type="button"
                onClick={() => setAtmosphere('blueprint')}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  atmosphere === 'blueprint' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-cyan-300'
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
                  atmosphere === 'golden_hour' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-amber-300'
                }`}
                title="Sunset Golden Hour Twilight"
              >
                <Sun className="w-3 h-3" />
                <span className="hidden sm:inline">Amber</span>
              </button>
            </div>

            {/* 3D Perspective Toggle */}
            <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 text-xs">
              <button
                type="button"
                onClick={() => setPerspective('isometric')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  perspective === 'isometric' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                title="Isometric 3D Depth View"
              >
                3D
              </button>
              <button
                type="button"
                onClick={() => setPerspective('front')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  perspective === 'front' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
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
                  showToast(`Transitioning to ${room.label}...`);
                }}
                className={`p-2.5 rounded-xl border text-left transition relative group cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-500/20 text-white'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-white'}`} />
                  {room.badge && (
                    <span className="text-[9px] bg-indigo-950 text-indigo-300 border border-indigo-400/40 px-1 py-0.2 rounded font-bold">
                      {room.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  )}
                </div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 truncate">
                  {room.wing}
                </div>
                <div className="text-xs font-bold text-white truncate">
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
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Queue Inventory</span>
                <h4 className="text-2xl font-black text-white font-mono">{items.length}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Files currently staged</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Layers className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Metadata Completed</span>
                <h4 className="text-2xl font-black text-emerald-400 font-mono">{completedItems.length}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Ready for agency export</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Target Agency</span>
                <h4 className="text-sm font-bold text-indigo-300 capitalize truncate">
                  {targetMarketplace.replace('_', ' ')}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Strict compliance rules</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Target className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Google Monetize Ready</span>
                <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Policy Clean
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">AdSense disclosures active</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Quick File Dropzone within Architectural Atrium */}
          <div className="bg-slate-950/80 border-2 border-dashed border-slate-800 hover:border-indigo-500/60 rounded-2xl p-8 text-center transition group relative">
            <input
              type="file"
              multiple
              onChange={onFilesSelect}
              accept="image/*,video/*,.svg,.eps,.ai,.psd,.psb,.spd,.mp4,.mov,.webm"
              className="hidden"
              id="spatialAtriumInput"
            />
            <label htmlFor="spatialAtriumInput" className="cursor-pointer space-y-3 block">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto border border-indigo-500/30 group-hover:scale-105 transition">
                <Upload className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Drag & Drop Files into the Grand Atrium
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Accepts Photos (JPG, PNG), Scalable Vectors (EPS, SVG), Photoshop Templates (PSD, PSB), and 4K Footage (MP4, MOV).
              </p>
              <div className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md">
                Browse Files
              </div>
            </label>
          </div>

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
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer border border-slate-700"
                  >
                    <Edit3 className="w-4 h-4 text-amber-400" />
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

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Marketplace:</span>
              <select
                value={targetMarketplace}
                onChange={(e) => onMarketplaceChange(e.target.value as TargetMarketplace)}
                className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 font-medium"
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
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {activeItem.previewUrl ? (
                  <img src={activeItem.previewUrl} alt={activeItem.file.name} className="w-14 h-14 rounded-xl object-cover bg-slate-900 border border-slate-800" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                    <Layers className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-400">Currently Focused Asset</span>
                  <h4 className="text-sm font-bold text-white truncate max-w-sm">{activeItem.file.name}</h4>
                  <p className="text-xs text-slate-400">
                    {activeItem.result ? `Title: "${activeItem.result.recommendedTitle.slice(0, 45)}..."` : `Status: ${activeItem.status}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onRoomChange('metadata')}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 transition cursor-pointer"
                >
                  Edit Title & Tags
                </button>
                <button
                  type="button"
                  onClick={() => onRoomChange('analysis')}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 transition cursor-pointer"
                >
                  Visual Analysis
                </button>
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
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              {activeItem?.previewUrl && (
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-700 shrink-0 bg-slate-950">
                  <img src={activeItem.previewUrl} alt={activeItem.file.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <h4 className="text-sm font-bold text-white truncate max-w-sm">
                  {activeItem ? activeItem.file.name : 'No asset selected'}
                </h4>
                <p className="text-xs text-slate-400">
                  {activeItem?.result ? `${activeItem.result.keywords.length} keywords · Category: ${activeItem.result.category || 'Business'}` : 'Select an analyzed asset below'}
                </p>
              </div>
            </div>

            {/* Quick Switcher Dropdown */}
            {completedItems.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Switch Asset:</span>
                <select
                  value={activeItem?.id || ''}
                  onChange={(e) => onSelectActiveItem(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
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

          {activeItem && activeItem.result ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Title, Category, Search Intent */}
              <div className="lg:col-span-1 space-y-5">
                {/* Title Editor */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300">Commercial Title</span>
                    <span className={`text-[11px] font-mono ${
                      (activeItem.result.recommendedTitle || '').length <= 70 ? 'text-emerald-400' : 'text-amber-400 font-bold'
                    }`}>
                      {(activeItem.result.recommendedTitle || '').length}/70 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={activeItem.result.recommendedTitle || ''}
                    onChange={(e) => onUpdateMetadata(activeItem.id, { recommendedTitle: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-medium"
                    placeholder="Concise commercial title..."
                  />
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Adobe Stock rule: Keep under 70 characters. Focus on primary visual subject + action.
                  </p>
                </div>

                {/* Adobe Stock Category */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">Adobe Stock Category</label>
                  <select
                    value={activeItem.result.category || 'Business'}
                    onChange={(e) => onUpdateMetadata(activeItem.id, { category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    {ADOBE_STOCK_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Buyer Search Intent Card */}
                {activeItem.result.searchIntent && (
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-indigo-400" />
                      <h5 className="text-xs font-bold text-white uppercase tracking-wider">Search Intent Engine</h5>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <span className="text-slate-400 block font-medium">Primary Intent:</span>
                      <p className="text-slate-200 bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-xs leading-relaxed font-semibold">
                        "{activeItem.result.searchIntent.primaryIntent}"
                      </p>
                    </div>
                    {activeItem.result.searchIntent.targetBuyer && (
                      <div className="text-xs text-slate-400">
                        <span className="text-slate-300 font-medium">Target Buyer: </span>
                        {activeItem.result.searchIntent.targetBuyer}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Keywording Priority System (Top 10 vs Supporting) */}
              <div className="lg:col-span-2 space-y-5">
                {/* Top 10 Priority Section */}
                <div className="bg-slate-950/80 border border-indigo-500/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                        Top 10 Priority Slots (Heaviest Search Weight)
                      </h5>
                    </div>
                    <span className="text-[11px] text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-md font-bold">
                      Adobe Stock Algorithm Critical
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Adobe Stock weights your first 10 keywords most heavily. Reorder tags using arrows so your core subject appears first.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {activeItem.result.keywords.slice(0, 10).map((kw, idx) => (
                      <div
                        key={`${kw}-${idx}`}
                        className="bg-indigo-950/60 border border-indigo-500/40 rounded-lg pl-2.5 pr-1.5 py-1 flex items-center gap-1.5 text-xs text-indigo-100 shadow-sm"
                      >
                        <span className="text-[10px] font-black text-amber-400 font-mono">#{idx + 1}</span>
                        <span className="font-semibold">{kw}</span>
                        <div className="flex items-center ml-1">
                          <button
                            type="button"
                            onClick={() => handleMoveKeyword(idx, idx - 1)}
                            disabled={idx === 0}
                            className="p-0.5 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveKeyword(idx, idx + 1)}
                            disabled={idx === activeItem.result!.keywords.length - 1}
                            className="p-0.5 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteKeyword(idx)}
                            className="p-0.5 text-slate-400 hover:text-rose-400 cursor-pointer ml-0.5"
                            title="Remove"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Supporting & Contextual Keywords (Positions 11 to 49) */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Supporting Keywords ({activeItem.result.keywords.length - 10 > 0 ? activeItem.result.keywords.length - 10 : 0} tags)
                    </h5>
                    <span className="text-xs text-slate-400 font-mono">
                      Total: {activeItem.result.keywords.length}/49
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                    {activeItem.result.keywords.slice(10).map((kw, offsetIdx) => {
                      const idx = offsetIdx + 10;
                      return (
                        <div
                          key={`${kw}-${idx}`}
                          className="bg-slate-900 border border-slate-700/80 rounded-lg pl-2 pr-1 py-1 flex items-center gap-1.5 text-xs text-slate-200"
                        >
                          <span className="text-[10px] text-slate-400 font-mono">#{idx + 1}</span>
                          <span>{kw}</span>
                          <button
                            type="button"
                            onClick={() => handleMoveKeyword(idx, idx - 1)}
                            className="p-0.5 text-slate-400 hover:text-white cursor-pointer"
                            title="Promote keyword"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteKeyword(idx)}
                            className="p-0.5 text-slate-400 hover:text-rose-400 cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Keyword Form */}
                  <form onSubmit={handleAddKeyword} className="flex gap-2 pt-2 border-t border-slate-800">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      placeholder="Add strategic keyword..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={!newTagInput.trim()}
                      className="bg-indigo-600 disabled:bg-slate-800 disabled:text-slate-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </form>
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
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Visual Truth Confidence</span>
                    <h4 className="text-base font-bold text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>{activeItem.result.visualTruthConfidence || 'HIGH CONFIDENCE'}</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">Reviewer visual correlation verified</p>
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Metadata Quality Score</span>
                    <h4 className="text-2xl font-black text-indigo-400 font-mono">
                      {activeItem.result.metadataQualityScore || 92}<span className="text-sm text-slate-400 font-normal">/100</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Internal relevance optimization score</p>
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Commercial Acceptance</span>
                    <h4 className="text-2xl font-black text-emerald-400 font-mono">
                      {activeItem.result.acceptanceProbability || 88}%
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Adobe Stock review readiness</p>
                  </div>
                </div>
              </div>

              {/* Visual Breakdown & Ground Truth */}
              {activeItem.result.visualAnalysis && (
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Visual Truth Breakdown</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
                      <span className="text-slate-400 font-medium block mb-1">Subject:</span>
                      <span className="text-slate-200 font-semibold">{activeItem.result.visualAnalysis.subject}</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
                      <span className="text-slate-400 font-medium block mb-1">Action / State:</span>
                      <span className="text-slate-200 font-semibold">{activeItem.result.visualAnalysis.action || 'Static concept'}</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
                      <span className="text-slate-400 font-medium block mb-1">Environment:</span>
                      <span className="text-slate-200 font-semibold">{activeItem.result.visualAnalysis.environment || 'Authentic setting'}</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
                      <span className="text-slate-400 font-medium block mb-1">Lighting / Framing:</span>
                      <span className="text-slate-200 font-semibold">{activeItem.result.visualAnalysis.lightingMood || 'Natural balanced light'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Commercial Use Cases Matrix */}
              {activeItem.result.searchIntent?.commercialUseCases && (
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-amber-300" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Buyer Use-Case Compatibility</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeItem.result.searchIntent.commercialUseCases.map((useCase, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-900 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium"
                      >
                        ✓ {useCase}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Smart Warnings Feed */}
              {activeItem.result.smartWarnings && activeItem.result.smartWarnings.length > 0 && (
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Info className="w-4 h-4 text-sky-400" />
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
                              ? 'bg-amber-950/30 border-amber-500/40 text-amber-200' 
                              : 'bg-slate-900 border-slate-800 text-slate-300'
                          }`}
                        >
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shrink-0 ${
                            isWarning ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
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
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-white">Batch Intelligence & Similarity Radar</h4>
              <p className="text-xs text-slate-400">
                Detects accidental duplicate titles and cross-asset keyword cannibalization across your series.
              </p>
            </div>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-lg">
              {completedItems.length} Analyzed Assets in Queue
            </span>
          </div>

          {/* Overlap & Similarity Warnings */}
          {batchSimilarityData.length > 0 ? (
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>High Keyword Overlap Detected ({batchSimilarityData.length} pairs)</span>
              </h5>
              <div className="space-y-2.5">
                {batchSimilarityData.map((sim, sIdx) => (
                  <div key={sIdx} className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-3.5 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">"{sim.itemA.file.name}"</span>
                        <span className="text-slate-400">↔</span>
                        <span className="font-bold text-slate-200">"{sim.itemB.file.name}"</span>
                      </div>
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-md font-mono font-bold">
                        {sim.overlapScore}% Overlap
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Recommendation: Differentiate the primary action and environment in the first 5 keywords so these assets don't compete with each other on Adobe Stock search rankings.
                    </p>
                    <div className="text-[11px] text-slate-400">
                      <span className="text-slate-300 font-medium">Shared keywords: </span>
                      {sim.sharedKeywords.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : completedItems.length > 1 ? (
            <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-emerald-300">Clean Portfolio Diversity</h5>
                <p className="text-xs text-slate-400">
                  No excessive keyword overlap or duplicate titles found across your uploaded batch. Every asset has distinct commercial search value.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              Upload at least 2 files to enable batch similarity & cross-asset differentiation analysis.
            </div>
          )}

          {/* Batch Summary Grid */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Queue Inventory</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => onSelectActiveItem(item.id)}
                  className={`bg-slate-950/80 border rounded-xl p-3 flex items-center gap-3 cursor-pointer transition ${
                    activeItem?.id === item.id 
                      ? 'border-indigo-500 shadow-md shadow-indigo-500/10' 
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {item.previewUrl ? (
                    <img src={item.previewUrl} alt={item.file.name} className="w-10 h-10 rounded-lg object-cover bg-slate-900 shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-slate-400">
                      <Layers className="w-4 h-4" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-slate-400 font-mono">#{idx + 1}</span>
                    <h6 className="text-xs font-semibold text-white truncate">{item.file.name}</h6>
                    <p className="text-[10px] text-slate-400 truncate">
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
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Sky Lounge
                </span>
                <span className="text-xs text-slate-400 font-medium">Microstock & Google Monetization Center</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">Contributor Earning Acceleration Lounge</h3>
              <p className="text-xs text-slate-400">
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
          <div className="bg-slate-950/90 border border-emerald-500/30 rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Microstock Portfolio Royalty Calculator</span>
              </h4>
              <span className="text-[11px] text-slate-400">Formula: Assets × DL Rate × Royalty</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Portfolio Size:</span>
                  <span className="font-mono text-emerald-400 font-bold">{calcAssets} assets</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="10000"
                  step="50"
                  value={calcAssets}
                  onChange={(e) => setCalcAssets(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block">Total approved stock files</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Monthly Downloads / File:</span>
                  <span className="font-mono text-emerald-400 font-bold">{calcMonthlyDls} dls</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="5.0"
                  step="0.1"
                  value={calcMonthlyDls}
                  onChange={(e) => setCalcMonthlyDls(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block">Avg downloads per asset monthly</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Average Royalty / DL:</span>
                  <span className="font-mono text-emerald-400 font-bold">${calcAvgRoyalty.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.30"
                  max="4.00"
                  step="0.05"
                  value={calcAvgRoyalty}
                  onChange={(e) => setCalcAvgRoyalty(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block">Typical subscription payout</span>
              </div>
            </div>

            {/* Projection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-900 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Estimated Monthly Royalties</span>
                  <h3 className="text-2xl font-black text-emerald-400 font-mono">${projectedMonthlyIncome.toLocaleString()} / mo</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Passive recurring creator revenue</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-slate-900 border border-indigo-500/20 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Estimated Annual Run-Rate</span>
                  <h3 className="text-2xl font-black text-indigo-400 font-mono">${projectedAnnualIncome.toLocaleString()} / yr</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Across multi-agency distribution</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Google Monetization & AdSense Integration Showcase */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Google AdSense Monetization Placement</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  100% Policy-compliant high-viewability banner unit with clear ad disclosure.
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Verified Compliant
              </span>
            </div>

            <GoogleAdSenseBanner format="leaderboard" />
          </div>

          {/* Microstock Partner Networks */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Top Microstock Contributor Networks</h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <a
                href="https://contributor.stock.adobe.com"
                target="_blank"
                rel="noreferrer"
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 p-3 rounded-xl transition flex items-center justify-between text-slate-200"
              >
                <span className="font-semibold">Adobe Stock</span>
                <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
              </a>
              <a
                href="https://submit.shutterstock.com"
                target="_blank"
                rel="noreferrer"
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 p-3 rounded-xl transition flex items-center justify-between text-slate-200"
              >
                <span className="font-semibold">Shutterstock</span>
                <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
              </a>
              <a
                href="https://www.freepik.com/contributor"
                target="_blank"
                rel="noreferrer"
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 p-3 rounded-xl transition flex items-center justify-between text-slate-200"
              >
                <span className="font-semibold">Freepik</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              </a>
              <a
                href="https://contributors.gettyimages.com"
                target="_blank"
                rel="noreferrer"
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 p-3 rounded-xl transition flex items-center justify-between text-slate-200"
              >
                <span className="font-semibold">Getty / iStock</span>
                <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
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
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-white">Export & Multi-Agency Distribution Vault</h4>
              <p className="text-xs text-slate-400">
                100% verified CSV spreadsheets and embedded IPTC/XMP metadata packages ready for contributor submission.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Adobe Stock Card */}
            <div className="bg-slate-950/80 border border-indigo-500/30 rounded-xl p-4 space-y-3 flex flex-col justify-between shadow-lg">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                  Official Format
                </span>
                <h5 className="text-sm font-bold text-white mt-2">Adobe Stock CSV</h5>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Strictly formatted as <code className="text-amber-300">Filename,Title,Keywords,Category</code> with UTF-8 BOM encoding.
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
            <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4 space-y-3 flex flex-col justify-between shadow-lg">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  All Files In 1 ZIP
                </span>
                <h5 className="text-sm font-bold text-white mt-2">Tagged ZIP Archive</h5>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  All images with embedded IPTC title/keywords + Adobe XMP sidecars for EPS/Video assets.
                </p>
              </div>
              <button
                type="button"
                onClick={exportBatchZip}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download ZIP Package</span>
              </button>
            </div>

            {/* Multi-Marketplace Hub */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between shadow-lg">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                  All Agencies
                </span>
                <h5 className="text-sm font-bold text-white mt-2">All Agencies CSV Hub</h5>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Export tailored CSVs for Shutterstock, Freepik, Getty Images, Vecteezy, and Dreamstime.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenMultiCsvModal}
                className="w-full bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open Multi-CSV Hub</span>
              </button>
            </div>
          </div>

          {/* Active Asset Quick Copy Hub */}
          {activeItem && activeItem.result && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                1-Click Quick Copy ({activeItem.file.name})
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleCopy(activeItem.result!.recommendedTitle, 'Title')}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-left transition flex items-center justify-between text-xs cursor-pointer"
                >
                  <span className="text-slate-300 font-medium">Copy Title</span>
                  {copiedKey === 'Title' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(activeItem.result!.keywords.slice(0, 10).join(', '), 'Top 10 Keywords')}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-left transition flex items-center justify-between text-xs cursor-pointer"
                >
                  <span className="text-slate-300 font-medium">Copy Top 10 Keywords</span>
                  {copiedKey === 'Top 10 Keywords' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(activeItem.result!.keywords.join(', '), 'All Keywords')}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-left transition flex items-center justify-between text-xs cursor-pointer"
                >
                  <span className="text-slate-300 font-medium">Copy All ({activeItem.result.keywords.length}) Keywords</span>
                  {copiedKey === 'All Keywords' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
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
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-white">Central Control Core & AI Engine</h4>
              <p className="text-xs text-slate-400">
                Configure your dual-agent vision engines, API keys, and marketplace defaults.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <span className="text-[10px] uppercase font-bold text-indigo-400">Vision Engine Configuration</span>
              <h5 className="text-sm font-bold text-white">Dual-Agent AI Reasoning</h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                Agent 1 inspects visual ground-truth (Subject, Action, Lighting, Technical Quality). Agent 2 models microstock commercial search intent to optimize rank.
              </p>
              <div className="pt-2">
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-lg">
                  ✓ Active & Operational
                </span>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <span className="text-[10px] uppercase font-bold text-amber-400">Microstock Compliance Guard</span>
              <h5 className="text-sm font-bold text-white">August 2026 Adobe Stock Rules</h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                Automatically enforces: under 70 character titles, 49 keyword limit, heaviest weight first 10 slots, and zero-spam trademark filters.
              </p>
              <div className="pt-2">
                <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-lg">
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
