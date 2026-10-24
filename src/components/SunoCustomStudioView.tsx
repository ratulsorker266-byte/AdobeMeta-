import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Sparkles,
  Wand2,
  Plus,
  Search,
  Download,
  Copy,
  Check,
  Trash2,
  Maximize2,
  FileSpreadsheet,
  Layers,
  Globe,
  UploadCloud,
  Shuffle,
  Settings,
  User as UserIcon,
  FolderArchive,
  Zap,
  CheckCircle2,
  ArrowRight,
  Eye,
  Film,
  Image as ImageIcon,
  RefreshCw,
  X,
  Target,
  FileText,
  SlidersHorizontal,
  Clock,
  Flame,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { BulkItem, TargetMarketplace, MetadataResult } from '../types';
import { playShutterSound, playChimeSound, playTickSound, isSoundEnabled, setSoundEnabled } from '../lib/audioFeedback';
import { AdobeMetaProLogo } from './AdobeMetaProLogo';
import { SAMPLE_SHOWCASE_ASSETS } from '../lib/sampleAssets';

export interface SunoCustomStudioViewProps {
  items: BulkItem[];
  setItems: React.Dispatch<React.SetStateAction<BulkItem[]>>;
  onDropFiles: (files: File[]) => void;
  onStartBulkProcessing: (singleItemId?: string) => void | Promise<void>;
  isProcessing: boolean;
  targetMarketplace: TargetMarketplace;
  setTargetMarketplace: (m: TargetMarketplace) => void;
  assetType: string;
  setAssetType: (t: string) => void;
  language: string;
  setLanguage: (l: string) => void;
  onOpenUpscaler: (tab?: 'image' | 'video') => void;
  onOpenMultiCsv: () => void;
  onExportZip: () => void;
  onExportCsv: () => void;
  onAutoFixItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
  onNavigateView: (view: string) => void;
  user: any;
  onOpenLogin: () => void;
  showToast: (msg: string) => void;
  themeMode?: 'light' | 'dark';
}

// Curated Suno-style Prompt & Style Inspiration Dice
const PROMPT_INSPIRATIONS = [
  {
    title: 'Minimalist Travertine Marble Podium for Luxury Cosmetics',
    prompt: 'Commercial product photography of a circular travertine marble pedestal, warm soft morning sunlight, architectural shadows, minimalist beige linen backdrop, 8k resolution, hasselblad medium format, generous copy space, no people',
    styles: ['Travertine Minimalist', 'Hasselblad 8K', 'Commercial Studio', 'Negative Space'],
    category: 'Graphic Resources'
  },
  {
    title: 'Modern Biophilic Corporate Office Architecture with Vertical Green Garden',
    prompt: 'Wide angle architectural view of contemporary biophilic corporate headquarters, timber beams, indoor living plant wall, natural diffused daylight, professional business interior, sustainable architecture',
    styles: ['Biophilic Architecture', 'B2B Corporate', 'Sustainable Interior', 'Clean Design'],
    category: 'Buildings and Architecture'
  },
  {
    title: 'Cloud Computing Server Infrastructure with Fiber Optic Neon Glow',
    prompt: 'High-end datacenter server rack room, glowing blue and amber fiber optic cables, high-speed cloud computing infrastructure, enterprise cybersecurity, modern industrial technology',
    styles: ['Fintech & Cloud', 'Cybersecurity', 'High-Speed Telecom', 'Industrial Tech'],
    category: 'Technology'
  },
  {
    title: 'Artisan Espresso Crema Pouring into Ceramic Studio Cup',
    prompt: 'Macro high-speed photography of golden espresso crema pouring into matte white ceramic cup, steam swirls, dark roasted coffee beans, artisanal coffee culture, shallow depth of field',
    styles: ['Artisan Culinary', 'Macro Optics', 'Golden Crema', 'Commercial Food'],
    category: 'Food and Drink'
  },
  {
    title: 'Autonomous Electric Vehicle Fast Charging Station in Smart City',
    prompt: 'Sleek futuristic electric vehicle plugged into high-voltage charging hub, clean urban glass architecture, dusk lighting with glowing LED indicators, sustainable green transport',
    styles: ['Clean Mobility', 'Smart City EV', 'Automotive Stock', 'Modern Exterior'],
    category: 'Transportation'
  }
];

const STYLE_TAG_SUGGESTIONS = [
  'Travertine Minimalist',
  'Hasselblad 8K Optics',
  'Commercial Studio',
  'Negative Copy Space',
  'B2B Enterprise',
  'Vector Flat Scalable',
  'Macro High-Speed',
  'Biophilic Design',
  'Fintech Biometrics',
  'Golden Hour Ambient',
  'Clean Composition',
  'No People'
];

export const SunoCustomStudioView: React.FC<SunoCustomStudioViewProps> = ({
  items,
  setItems,
  onDropFiles,
  onStartBulkProcessing,
  isProcessing,
  targetMarketplace,
  setTargetMarketplace,
  assetType,
  setAssetType,
  language,
  setLanguage,
  onOpenUpscaler,
  onOpenMultiCsv,
  onExportZip,
  onExportCsv,
  onAutoFixItem,
  onDeleteItem,
  onClearAll,
  onNavigateView,
  user,
  onOpenLogin,
  showToast,
  themeMode = 'dark'
}) => {
  // Suno Custom Mode toggles
  const [isCustomMode, setIsCustomMode] = useState<boolean>(true);
  const [promptText, setPromptText] = useState<string>('');
  const [titleInput, setTitleInput] = useState<string>('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Commercial Studio', 'Negative Copy Space']);
  const [styleInput, setStyleInput] = useState<string>('');
  const [excludeKeywords, setExcludeKeywords] = useState<string>('watermark, text, blurry, duplicate, logo');
  const [modelVersion, setModelVersion] = useState<string>('v4.5-stock-master');
  
  // Feed filtering & search
  const [feedFilter, setFeedFilter] = useState<'all' | 'completed' | 'photos' | 'vectors' | 'footage'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePlayingIndex, setActivePlayingIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioPlaybackProgress, setAudioPlaybackProgress] = useState<number>(0);
  const [soundFxEnabled, setSoundFxEnabled] = useState<boolean>(() => isSoundEnabled());

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioIntervalRef = useRef<any>(null);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const title = (item.result?.recommendedTitle || item.file.name).toLowerCase();
        const kws = (item.result?.keywords || []).join(' ').toLowerCase();
        if (!title.includes(q) && !kws.includes(q)) return false;
      }

      // Type / Status filter
      if (feedFilter === 'completed') return item.status === 'completed';
      if (feedFilter === 'vectors') {
        const ext = item.file.name.split('.').pop()?.toLowerCase();
        return ext === 'eps' || ext === 'ai' || ext === 'svg';
      }
      if (feedFilter === 'photos') {
        const ext = item.file.name.split('.').pop()?.toLowerCase();
        return ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'webp';
      }
      if (feedFilter === 'footage') {
        const ext = item.file.name.split('.').pop()?.toLowerCase();
        return ext === 'mp4' || ext === 'mov' || ext === 'webm' || ext === 'avi';
      }

      return true;
    });
  }, [items, searchQuery, feedFilter]);

  const activePlayingItem = filteredItems[activePlayingIndex] || items[0] || null;

  // Web Audio Synthesizer Tone for "Play" simulation
  const playSimulatedAudioTrack = () => {
    if (!soundFxEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;

      // Soft ambient chord (F# minor 9th / Suno dreamscape)
      const freqs = [185.0, 220.0, 277.18, 329.63, 440.0];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(f, now);
        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2.8);
      });
    } catch (_) {}
  };

  const handleTogglePlay = (index?: number) => {
    if (index !== undefined && index !== activePlayingIndex) {
      setActivePlayingIndex(index);
      setIsPlayingAudio(true);
      setAudioPlaybackProgress(0);
      playSimulatedAudioTrack();
      playTickSound();
      return;
    }

    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    } else {
      setIsPlayingAudio(true);
      playSimulatedAudioTrack();
    }
  };

  // Playback timeline tick
  useEffect(() => {
    if (isPlayingAudio) {
      audioIntervalRef.current = setInterval(() => {
        setAudioPlaybackProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 1.2;
        });
      }, 100);
    } else {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    }

    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, [isPlayingAudio]);

  // Dice roll random inspiration
  const handleRandomizePrompt = () => {
    playTickSound();
    const randomIndex = Math.floor(Math.random() * PROMPT_INSPIRATIONS.length);
    const chosen = PROMPT_INSPIRATIONS[randomIndex];
    setPromptText(chosen.prompt);
    setTitleInput(chosen.title);
    setSelectedStyles(chosen.styles);
    showToast(`🎲 Loaded: "${chosen.title}"`);
  };

  // Add / remove style tag
  const handleToggleStyleTag = (tag: string) => {
    playTickSound();
    if (selectedStyles.includes(tag)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== tag));
    } else {
      setSelectedStyles([...selectedStyles, tag]);
    }
  };

  const handleAddCustomStyle = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = styleInput.trim();
    if (trimmed && !selectedStyles.includes(trimmed)) {
      setSelectedStyles([...selectedStyles, trimmed]);
      setStyleInput('');
      playTickSound();
    }
  };

  // Suno "Create" action button
  const handleCreateAction = () => {
    playShutterSound();

    // If no files are attached yet, generate a simulated high-converting stock asset based on prompt
    if (items.length === 0) {
      const sample = SAMPLE_SHOWCASE_ASSETS[0].item;
      const createdItem: BulkItem = {
        ...sample,
        id: `suno-gen-${Date.now()}`,
        file: new File([''], `${(titleInput || 'commercial_stock_asset').toLowerCase().replace(/\s+/g, '_')}.jpg`, { type: 'image/jpeg' }),
        result: {
          ...sample.result!,
          recommendedTitle: titleInput || 'Modern Biophilic Architectural Design in Warm Ambient Light',
          keywords: Array.from(new Set([...(sample.result?.keywords || []), ...selectedStyles.map((s) => s.toLowerCase())])).slice(0, 49)
        }
      };

      setItems([createdItem]);
      showToast('✓ Generated 49-Slot Commercial Metadata from Custom Parameters!');
      playChimeSound();
      return;
    }

    // Trigger processing on current queue
    onStartBulkProcessing();
  };

  const isLight = themeMode === 'light';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isLight ? 'bg-[#f4f5f8] text-[#090a0f]' : 'bg-[#06070a] text-[#f4f4f6]'
    }`}>
      {/* ==================================================================== */}
      {/* SUNO WORKSTATION WRAPPER: SLIM LEFT RAIL + DOCK + FEED + BOTTOM BAR */}
      {/* ==================================================================== */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* ================================================================== */}
        {/* 1. SLIM LEFT NAVIGATION RAIL (SUNO ICON SIDEBAR)                   */}
        {/* ================================================================== */}
        <aside className={`w-16 sm:w-18 shrink-0 flex flex-col items-center justify-between py-4 border-r select-none z-30 ${
          isLight ? 'bg-white border-neutral-200/80 shadow-xs' : 'bg-[#08090d] border-white/10'
        }`}>
          {/* Top Logo & App Trigger */}
          <div className="flex flex-col items-center gap-6">
            <button
              type="button"
              onClick={() => onNavigateView('home')}
              className="p-1.5 rounded-xl hover:scale-105 transition cursor-pointer"
              title="Return to Home View"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-black font-black font-serif text-base shadow-[0_0_20px_rgba(245,158,11,0.35)]">
                A
              </div>
            </button>

            {/* Navigation Icons */}
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigateView('home')}
                className={`p-2.5 rounded-xl transition cursor-pointer ${
                  isLight ? 'text-neutral-500 hover:text-black hover:bg-neutral-100' : 'text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
                title="Home & Showcase"
              >
                <Layers className="w-5 h-5" />
              </button>

              <button
                type="button"
                className={`p-2.5 rounded-xl transition cursor-pointer shadow-md ${
                  isLight ? 'bg-neutral-950 text-white' : 'bg-white text-black ring-2 ring-white/20'
                }`}
                title="Create Studio (Active: Custom Mode)"
              >
                <Sparkles className="w-5 h-5 text-amber-500" />
              </button>

              <button
                type="button"
                onClick={() => onOpenUpscaler('image')}
                className={`p-2.5 rounded-xl transition cursor-pointer ${
                  isLight ? 'text-neutral-500 hover:text-black hover:bg-neutral-100' : 'text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
                title="8K Ultra Image & Video Upscaler"
              >
                <Maximize2 className="w-5 h-5 text-amber-400" />
              </button>

              <button
                type="button"
                onClick={onOpenMultiCsv}
                className={`p-2.5 rounded-xl transition cursor-pointer ${
                  isLight ? 'text-neutral-500 hover:text-black hover:bg-neutral-100' : 'text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
                title="7-Agency CSV Hub"
              >
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateView('seo-rank')}
                className={`p-2.5 rounded-xl transition cursor-pointer ${
                  isLight ? 'text-neutral-500 hover:text-black hover:bg-neutral-100' : 'text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
                title="Search SEO & Top-10 Calibrator"
              >
                <Zap className="w-5 h-5 text-cyan-400" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateView('monetize')}
                className={`p-2.5 rounded-xl transition cursor-pointer ${
                  isLight ? 'text-neutral-500 hover:text-black hover:bg-neutral-100' : 'text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
                title="Google Monetize & AdSense Vault"
              >
                <Flame className="w-5 h-5 text-rose-400" />
              </button>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const next = !soundFxEnabled;
                setSoundFxEnabled(next);
                setSoundEnabled(next);
                showToast(next ? '🔊 Studio Sound Effects Enabled' : '🔇 Studio Sound Effects Muted');
              }}
              className={`p-2 rounded-xl transition cursor-pointer ${
                soundFxEnabled
                  ? (isLight ? 'text-amber-600 bg-amber-50' : 'text-amber-400 bg-amber-500/15')
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Toggle Audio Feedback"
            >
              {soundFxEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {user ? (
              <div
                className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-xs font-bold font-mono"
                title={user.email || 'Active User'}
              >
                {(user.displayName || user.email || 'U')[0].toUpperCase()}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="p-2 rounded-xl text-neutral-400 hover:text-white transition cursor-pointer"
                title="Sign In / Create Account"
              >
                <UserIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </aside>

        {/* ================================================================== */}
        {/* 2. MIDDLE-LEFT CREATION DOCK (SUNO CUSTOM CREATE PANEL)            */}
        {/* ================================================================== */}
        <section className={`w-full lg:w-[420px] xl:w-[450px] shrink-0 border-r flex flex-col justify-between overflow-y-auto scrollbar-thin z-20 ${
          isLight ? 'bg-white border-neutral-200/90' : 'bg-[#090b10] border-white/10'
        }`}>
          <div className="p-5 sm:p-6 space-y-6">

            {/* Top Bar: "Create" Header + "Custom Mode" Toggle */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">Create</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold uppercase tracking-wider">
                  Suno Studio v4.5
                </span>
              </div>

              {/* Suno Custom Mode Switch */}
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold ${isCustomMode ? 'text-amber-400 font-bold' : 'text-neutral-400'}`}>
                  Custom
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomMode(!isCustomMode);
                    playTickSound();
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    isCustomMode
                      ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                      : (isLight ? 'bg-neutral-300' : 'bg-neutral-800')
                  }`}
                  title="Toggle Custom Mode parameters"
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-black absolute top-1 transition-transform ${
                      isCustomMode ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* ========================================================== */}
            {/* SUNO CUSTOM MODE CONTROLS                                  */}
            {/* ========================================================== */}
            {isCustomMode ? (
              <div className="space-y-5">

                {/* 1. Prompt / Lyrics / Visual Scenario Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold flex items-center gap-1.5 text-neutral-300">
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>Commercial Prompt &amp; Subject Scenario</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleRandomizePrompt}
                      className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer transition"
                      title="Load inspirational stock concept"
                    >
                      <Shuffle className="w-3 h-3" />
                      <span>Surprise Me</span>
                    </button>
                  </div>

                  <div className="relative">
                    <textarea
                      rows={4}
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                      placeholder="Describe the subject, composition, Hasselblad optics, lighting, and negative space (e.g. Minimalist travertine stone pedestal in warm morning sunlight, generous copy space, 8k)..."
                      className={`w-full text-xs p-3.5 rounded-2xl border resize-none focus:outline-none transition leading-relaxed ${
                        isLight
                          ? 'bg-[#f7f6f2] border-neutral-300 text-neutral-900 focus:border-amber-500 focus:bg-white'
                          : 'bg-[#0d0e14] border-white/10 text-white focus:border-amber-400/60 focus:bg-[#12141c]'
                      }`}
                    />
                  </div>
                </div>

                {/* 2. Drag & Drop Artwork Attachment Box */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Artwork Attachment (EPS, PSD, JPG, 4K)</span>
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {items.length > 0 ? `${items.length} Attached` : 'Optional'}
                    </span>
                  </label>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
                        onDropFiles(Array.from(e.dataTransfer.files));
                        playTickSound();
                      }
                    }}
                    className={`p-4 rounded-2xl border-2 border-dashed text-center flex items-center justify-center gap-3 cursor-pointer transition ${
                      isLight
                        ? 'border-neutral-300 hover:border-neutral-900 bg-neutral-50/50'
                        : 'border-white/15 hover:border-amber-400/50 bg-white/[0.02] hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold">
                        {items.length > 0 ? `+ Add More Artwork Files` : 'Drop Artwork or Click to Browse'}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        Supports Vector EPS, AI, PSD, JPG, PNG &amp; 4K Footage
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,video/*,.svg,.eps,.ai,.psd,.psb,.spd,.mp4,.mov,.webm"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          onDropFiles(Array.from(e.target.files));
                          playTickSound();
                        }
                      }}
                    />
                  </div>
                </div>

                {/* 3. Style of Music / Visual Style Chips */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold flex items-center gap-1.5 text-neutral-300">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Style of Visual (Tags &amp; Genres)</span>
                    </label>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {selectedStyles.length} active
                    </span>
                  </div>

                  {/* Suggestion Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {STYLE_TAG_SUGGESTIONS.map((tag) => {
                      const isSelected = selectedStyles.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleStyleTag(tag)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border transition cursor-pointer select-none ${
                            isSelected
                              ? 'bg-amber-400 text-black border-amber-400 font-bold shadow-xs'
                              : (isLight ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-700' : 'bg-white/[0.04] hover:bg-white/[0.09] border-white/10 text-neutral-300')
                          }`}
                        >
                          {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Style Input */}
                  <form onSubmit={handleAddCustomStyle} className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={styleInput}
                      onChange={(e) => setStyleInput(e.target.value)}
                      placeholder="Add custom visual style / keyword tag..."
                      className={`flex-1 text-xs px-3 py-2 rounded-xl border focus:outline-none transition ${
                        isLight ? 'bg-white border-neutral-300 text-neutral-900' : 'bg-[#0d0e14] border-white/10 text-white'
                      }`}
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/15 cursor-pointer transition"
                    >
                      Add
                    </button>
                  </form>
                </div>

                {/* 4. Subject-First Title (<70 chars Adobe Stock lock) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold flex items-center gap-1.5 text-neutral-300">
                      <Target className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Commercial Title</span>
                    </label>
                    <span className={`text-[10.5px] font-mono ${
                      titleInput.length <= 70 ? 'text-emerald-400 font-bold' : 'text-amber-400'
                    }`}>
                      {titleInput.length}/70 chars · Adobe Stock Standard
                    </span>
                  </div>

                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    placeholder="Enter subject-first title or leave blank to auto-generate..."
                    className={`w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none transition ${
                      isLight ? 'bg-white border-neutral-300 text-neutral-900' : 'bg-[#0d0e14] border-white/10 text-white'
                    }`}
                  />
                </div>

                {/* 5. Target Marketplace & Format Dropdowns */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[10.5px] font-bold text-neutral-400 block mb-1">
                      Target Marketplace
                    </label>
                    <select
                      value={targetMarketplace}
                      onChange={(e) => setTargetMarketplace(e.target.value as TargetMarketplace)}
                      className={`w-full text-xs p-2 rounded-xl border focus:outline-none cursor-pointer ${
                        isLight ? 'bg-white border-neutral-300 text-neutral-900' : 'bg-[#0d0e14] border-white/10 text-white'
                      }`}
                    >
                      <option value="adobe_stock">Adobe Stock (49 KW · &lt;70c)</option>
                      <option value="shutterstock">Shutterstock (50 KW)</option>
                      <option value="freepik">Freepik (30 KW)</option>
                      <option value="vecteezy">Vecteezy (35 KW)</option>
                      <option value="getty">Getty / iStock (35 KW)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10.5px] font-bold text-neutral-400 block mb-1">
                      Engine / Quality Tier
                    </label>
                    <select
                      value={modelVersion}
                      onChange={(e) => setModelVersion(e.target.value)}
                      className={`w-full text-xs p-2 rounded-xl border focus:outline-none cursor-pointer ${
                        isLight ? 'bg-white border-neutral-300 text-neutral-900' : 'bg-[#0d0e14] border-white/10 text-white'
                      }`}
                    >
                      <option value="v4.5-stock-master">StockMeta v4.5 (8K Ultra)</option>
                      <option value="v4.0-fast">StockMeta v4.0 (Turbo Fast)</option>
                      <option value="v3.5-iptc">v3.5 (IPTC Deep Embed)</option>
                    </select>
                  </div>
                </div>

                {/* 6. Exclude / Negative Keywords */}
                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold text-neutral-400 flex items-center justify-between">
                    <span>Exclude Negative Tags (Blacklist)</span>
                    <span className="text-[9.5px] font-mono text-neutral-500">Auto-filtered</span>
                  </label>
                  <input
                    type="text"
                    value={excludeKeywords}
                    onChange={(e) => setExcludeKeywords(e.target.value)}
                    placeholder="watermark, logo, text, blur..."
                    className={`w-full text-[11px] px-3 py-1.5 rounded-xl border focus:outline-none ${
                      isLight ? 'bg-white border-neutral-300 text-neutral-800' : 'bg-[#0d0e14] border-white/10 text-neutral-300'
                    }`}
                  />
                </div>

              </div>
            ) : (
              /* Simple Mode Fallback */
              <div className="space-y-4 py-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                  <Wand2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base">Simple 1-Click Mode</h3>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  Drop any artwork or type a brief idea to auto-produce 49 rank-ordered Adobe Stock keywords and under 70-character title in 1 click.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCustomMode(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/15 cursor-pointer transition"
                >
                  Switch to Custom Mode
                </button>
              </div>
            )}
          </div>

          {/* ========================================================== */}
          {/* BOTTOM SUNO "CREATE" BUTTON                                */}
          {/* ========================================================== */}
          <div className={`p-5 sm:p-6 border-t ${
            isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#08090e] border-white/10'
          }`}>
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleCreateAction}
              className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xl ${
                isProcessing
                  ? 'bg-neutral-600 text-neutral-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black shadow-[0_0_30px_rgba(245,158,11,0.35)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] active:scale-[0.98]'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Processing Studio Assets...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Create Metadata · 0 Credits (Free)</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* ================================================================== */}
        {/* 3. RIGHT FEED PANEL (SUNO LIVE GENERATION FEED & ASSET QUEUE)     */}
        {/* ================================================================== */}
        <main className={`flex-1 flex flex-col overflow-y-auto ${
          isLight ? 'bg-[#f8f9fc]' : 'bg-[#06070a]'
        }`}>

          {/* Top Feed Header Bar */}
          <div className={`px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10 backdrop-blur-md ${
            isLight ? 'bg-white/90 border-neutral-200/80' : 'bg-[#06070a]/90 border-white/10'
          }`}>
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl border border-white/10 bg-white/[0.02] text-xs">
              {(['all', 'completed', 'photos', 'vectors', 'footage'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFeedFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer capitalize ${
                    feedFilter === tab
                      ? (isLight ? 'bg-neutral-900 text-white' : 'bg-white text-black font-bold shadow-xs')
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {tab === 'all' ? `All (${items.length})` : tab}
                </button>
              ))}
            </div>

            {/* Search Input & Action Tools */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search assets or tags..."
                  className={`text-xs pl-8 pr-3 py-1.5 rounded-xl border focus:outline-none transition ${
                    isLight ? 'bg-white border-neutral-300 text-neutral-900' : 'bg-[#0d0e14] border-white/10 text-white'
                  }`}
                />
              </div>

              {items.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      items.forEach((it) => onAutoFixItem(it.id));
                      showToast('✓ Calibrated all assets to Rank #1 Title & Top-10 Sync!');
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 flex items-center gap-1.5 transition cursor-pointer"
                    title="1-Click Calibrate all assets"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Calibrate All</span>
                  </button>

                  <button
                    type="button"
                    onClick={onExportZip}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border border-white/15 bg-white/5 hover:bg-white/10 text-white flex items-center gap-1.5 transition cursor-pointer"
                    title="Download ZIP"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">ZIP</span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenMultiCsv}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                    title="Export 7-Agency CSV"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>7-CSV</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Feed Content Area */}
          <div className="p-6 space-y-4 flex-1">
            {filteredItems.length === 0 ? (
              /* Empty State */
              <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold">No Generations in Feed Yet</h3>
                  <p className="text-xs text-neutral-400 max-w-sm">
                    Enter your visual concept on the left and hit "Create", or drop an artwork file to see Suno-style metadata cards appear here.
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const sample = SAMPLE_SHOWCASE_ASSETS[0].item;
                      setItems([sample]);
                      playChimeSound();
                      showToast('✓ Loaded master stock asset into Suno Feed!');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-black hover:bg-amber-300 transition cursor-pointer shadow-md"
                  >
                    Load Sample Asset
                  </button>
                </div>
              </div>
            ) : (
              /* Suno Track/Asset Generation List */
              <div className="space-y-2.5">
                {filteredItems.map((item, idx) => {
                  const isCurrentPlaying = activePlayingIndex === idx;
                  const res = item.result;
                  const title = res?.recommendedTitle || item.file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
                  const keywords = res?.keywords || [];
                  const ext = item.file.name.split('.').pop()?.toUpperCase() || 'JPG';

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.03 }}
                      onClick={() => setActivePlayingIndex(idx)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group ${
                        isCurrentPlaying
                          ? (isLight ? 'bg-white border-amber-500/60 shadow-md ring-1 ring-amber-500/30' : 'bg-[#10131c] border-amber-400/40 shadow-xl ring-1 ring-amber-400/20')
                          : (isLight ? 'bg-white/80 hover:bg-white border-neutral-200' : 'bg-[#0b0c12] hover:bg-[#0e1017] border-white/10 hover:border-white/20')
                      }`}
                    >
                      {/* Left: Thumbnail & Play Trigger */}
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePlay(idx);
                          }}
                          className="relative w-16 h-16 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0 group/thumb cursor-pointer"
                        >
                          <img
                            src={item.previewUrl || ''}
                            alt={item.file.name}
                            className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                          />
                          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                            isCurrentPlaying && isPlayingAudio ? 'opacity-100' : 'opacity-0 group-hover/thumb:opacity-100'
                          }`}>
                            {isCurrentPlaying && isPlayingAudio ? (
                              <Pause className="w-6 h-6 text-amber-400 fill-amber-400" />
                            ) : (
                              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                            )}
                          </div>
                        </div>

                        {/* Title & Metadata Line */}
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">
                              {ext}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-400">
                              {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                            </span>
                            {res && (
                              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                                99% Acceptance
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-bold truncate max-w-xl group-hover:text-amber-300 transition-colors">
                            {title}
                          </h4>

                          {/* Suno Audio / Algorithmic Dominance Waveform Visualizer */}
                          <div className="flex items-center gap-2 pt-0.5">
                            <div className="flex items-end gap-0.5 h-3">
                              {[35, 60, 90, 45, 80, 100, 65, 40, 75, 95, 55, 85].map((h, bIdx) => (
                                <div
                                  key={bIdx}
                                  style={{ height: `${isCurrentPlaying && isPlayingAudio ? Math.max(20, (h * (Math.sin(audioPlaybackProgress + bIdx) + 1.2)) / 2) : h * 0.4}%` }}
                                  className={`w-0.5 rounded-full transition-all duration-150 ${
                                    isCurrentPlaying && isPlayingAudio ? 'bg-amber-400' : 'bg-neutral-600'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[10.5px] font-mono text-neutral-400">
                              RPD: $3.20 · 75% Search Lock
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Keywords Preview & Quick Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {keywords.length > 0 && (
                          <div className="hidden xl:flex items-center gap-1 max-w-xs overflow-hidden">
                            {keywords.slice(0, 3).map((kw, kIdx) => (
                              <span
                                key={kIdx}
                                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/10 text-neutral-300 truncate"
                              >
                                {kw}
                              </span>
                            ))}
                            {keywords.length > 3 && (
                              <span className="text-[10px] font-mono text-neutral-400">
                                +{keywords.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(title);
                            playTickSound();
                            showToast('✓ Copied Title (<70c Adobe Stock)!');
                          }}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300 cursor-pointer transition"
                          title="Copy Title"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const tags = keywords.slice(0, 49).join(', ');
                            navigator.clipboard.writeText(tags);
                            playTickSound();
                            showToast(`✓ Copied ${keywords.slice(0, 49).length} Adobe Stock tags!`);
                          }}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-bold border border-white/10 bg-white/5 hover:bg-white/10 text-neutral-200 cursor-pointer transition"
                          title="Copy 49 Keywords"
                        >
                          <span>Tags (49)</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenUpscaler('image');
                          }}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-bold border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 cursor-pointer transition"
                          title="Upscale to 8K Ultra-HD (300 DPI)"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteItem(item.id);
                            showToast('Removed item from feed');
                          }}
                          className="p-1.5 rounded-xl text-neutral-500 hover:text-red-400 transition cursor-pointer"
                          title="Delete asset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ==================================================================== */}
      {/* 4. PERSISTENT BOTTOM PLAYER / TRANSPORT BAR (SUNO SIGNATURE DOCK)   */}
      {/* ==================================================================== */}
      <footer className={`h-20 shrink-0 border-t px-6 flex items-center justify-between gap-4 z-40 ${
        isLight ? 'bg-white border-neutral-200 shadow-xl' : 'bg-[#08090d] border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]'
      }`}>
        {/* Left: Active Playing Asset */}
        <div className="flex items-center gap-3.5 min-w-0 max-w-sm sm:max-w-md">
          {activePlayingItem ? (
            <>
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/50 border border-white/10 shrink-0">
                <img
                  src={activePlayingItem.previewUrl || ''}
                  alt="Current Playing"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 space-y-0.5">
                <h5 className="text-xs font-bold truncate text-white">
                  {activePlayingItem.result?.recommendedTitle || activePlayingItem.file.name}
                </h5>
                <div className="text-[10px] font-mono text-neutral-400 flex items-center gap-1.5">
                  <span>Adobe Stock · 49 Keywords</span>
                  <span>·</span>
                  <span className="text-emerald-400 font-bold">100% Calibrated</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-xs text-neutral-400 font-mono">
              Ready to create in Suno Custom Mode
            </div>
          )}
        </div>

        {/* Center: Waveform & Playback Transport */}
        <div className="flex flex-col items-center gap-1.5 flex-1 max-w-xl">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (filteredItems.length > 0) {
                  const prevIdx = (activePlayingIndex - 1 + filteredItems.length) % filteredItems.length;
                  setActivePlayingIndex(prevIdx);
                  playTickSound();
                }
              }}
              className="text-neutral-400 hover:text-white transition cursor-pointer"
              title="Previous Asset"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleTogglePlay()}
              className="w-10 h-10 rounded-full bg-amber-400 hover:bg-amber-300 text-black flex items-center justify-center transition cursor-pointer shadow-md hover:scale-105 active:scale-95"
              title={isPlayingAudio ? 'Pause' : 'Play Studio Ambient Track'}
            >
              {isPlayingAudio ? (
                <Pause className="w-5 h-5 fill-black" />
              ) : (
                <Play className="w-5 h-5 fill-black ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                if (filteredItems.length > 0) {
                  const nextIdx = (activePlayingIndex + 1) % filteredItems.length;
                  setActivePlayingIndex(nextIdx);
                  playTickSound();
                }
              }}
              className="text-neutral-400 hover:text-white transition cursor-pointer"
              title="Next Asset"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Scrubber Bar */}
          <div className="w-full flex items-center gap-2 text-[10px] font-mono text-neutral-500">
            <span>0:{Math.floor(audioPlaybackProgress * 0.3).toString().padStart(2, '0')}</span>
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden relative cursor-pointer">
              <div
                style={{ width: `${audioPlaybackProgress}%` }}
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-100"
              />
            </div>
            <span>0:30</span>
          </div>
        </div>

        {/* Right: Quick Tools */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onOpenUpscaler('image')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 flex items-center gap-1.5 transition cursor-pointer"
            title="Launch 8K Upscaler Studio"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>8K Upscale</span>
          </button>

          <button
            type="button"
            onClick={onOpenMultiCsv}
            className="px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 flex items-center gap-1.5 transition cursor-pointer"
            title="Open 7-Agency CSV Hub"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>7-CSV</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
