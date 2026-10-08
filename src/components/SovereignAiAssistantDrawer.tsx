import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Clock,
  Trash2,
  Image as ImageIcon,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Maximize2,
  Minimize2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Download,
  FileDown,
  ShieldCheck,
  TrendingUp,
  Wand2,
  Eye,
  DollarSign,
  Send,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export type AiAssistantMode =
  | 'auto'
  | 'vision_seo'
  | 'multi_agency_5x'
  | 'image_synth'
  | 'audit_doctor'
  | 'rank_hijack'
  | 'batch_10x'
  | 'earning_advisor';

export interface StructuredChatMetadata {
  title: string;
  alternativeTitles?: {
    b2bCommercial: string;
    highVolumeSeo: string;
    editorialStory: string;
  };
  agencyTitles?: {
    adobeStock: string;
    shutterstock: string;
    freepik: string;
    getty: string;
    vecteezy: string;
  };
  category?: string;
  top10Keywords: string[];
  all49Keywords: string[];
  aiPrompt?: string;
  seoScore?: number;
  estimatedCpc?: string;
}

interface SovereignAiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: 'light' | 'dark';
  chatMessages: any[];
  chatSessions: any[];
  activeChatSessionId: string;
  showChatHistorySidebar: boolean;
  setShowChatHistorySidebar: React.Dispatch<React.SetStateAction<boolean>>;
  onStartNewChat: () => void;
  onSelectChatSession: (id: string) => void;
  onDeleteChatSession: (id: string, e: React.MouseEvent) => void;
  chatInput: string;
  setChatInput: (val: string) => void;
  chatAttachedImage: {
    previewUrl: string;
    base64: string;
    mimeType: string;
    fileName: string;
  } | null;
  setChatAttachedImage: (val: any) => void;
  onChatImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendChat: (overridePrompt?: string, overrideMode?: AiAssistantMode) => void;
  isChatLoading: boolean;
  activeMode: AiAssistantMode;
  setActiveMode: (mode: AiAssistantMode) => void;
  onPushToStudioQueue?: (payload: {
    title: string;
    category: string;
    keywords: string[];
    previewUrl?: string;
    fileName?: string;
  }) => void;
  activeWorkspaceAsset?: {
    fileName: string;
    title?: string;
    keywords?: string[];
    previewUrl?: string;
  } | null;
  totalQueueCount?: number;
  showToast: (msg: string) => void;
}

const AI_MODES: {
  id: AiAssistantMode;
  label: string;
  shortLabel: string;
  icon: React.FC<{ className?: string }>;
  badgeColor: string;
  placeholder: string;
  quickPrompts: string[];
}[] = [
  {
    id: 'auto',
    label: '⚡ Sovereign Co-Pilot (All-in-One)',
    shortLabel: '⚡ Co-Pilot',
    icon: Sparkles,
    badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    placeholder: 'Ask anything, upload an image for 49 tags, or type "Generate image of..."',
    quickPrompts: [
      'Generate 49 Rank #1 tags for luxury golden Ramadan background',
      'Generate image of futuristic AI cybersecurity shield with copy space',
      'Top 5 highest-paying Adobe Stock niches this month'
    ]
  },
  {
    id: 'vision_seo',
    label: '👁️ Vision 49-Tag SEO Architect',
    shortLabel: '👁️ Vision SEO',
    icon: Eye,
    badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    placeholder: 'Upload/paste an image or describe your subject for <70 char Title + 49 Keywords...',
    quickPrompts: [
      'Analyze my uploaded image for Adobe Stock & Shutterstock (<70 chars)',
      'Give me Subject-First Title + 49 singular keywords for corporate team meeting',
      'Generate vector EPS metadata for minimalist geometric logo pack'
    ]
  },
  {
    id: 'multi_agency_5x',
    label: '🌐 5-Agency Universal Metadata Matrix',
    shortLabel: '🌐 5-Agency Matrix',
    icon: Layers,
    badgeColor: 'text-sky-400 border-sky-500/40 bg-sky-500/10',
    placeholder: 'Enter any visual subject to generate Adobe, Shutterstock, Freepik, Getty & Vecteezy metadata...',
    quickPrompts: [
      'Generate 5-Agency Universal Metadata Matrix for isometric cloud cybersecurity vector',
      'Create Adobe (<70 chars), Shutterstock narrative & Freepik 30 tags for Eid Mubarak gold background',
      'Universal 5-Agency titles & 49 weighted tags for renewable solar energy grid'
    ]
  },
  {
    id: 'image_synth',
    label: '🎨 AI Visual & Commercial Prompt Synth',
    shortLabel: '🎨 Image & Prompt',
    icon: Wand2,
    badgeColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
    placeholder: 'Describe any visual to synthesize artwork preview + Midjourney v6.1 prompt + 49 tags...',
    quickPrompts: [
      'Generate image of luxury emerald & gold Islamic arch with negative copy space',
      'Generate image of sustainable solar energy smart city at golden hour',
      'Generate image of 3D glass fintech analytics dashboard minimal background'
    ]
  },
  {
    id: 'audit_doctor',
    label: '🛡️ Rejection & Trademark Doctor',
    shortLabel: '🛡️ Audit Doctor',
    icon: ShieldCheck,
    badgeColor: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
    placeholder: 'Paste your title & keywords or attach an image to check rejection & trademark risks...',
    quickPrompts: [
      'Audit my active studio asset for Adobe Stock rejection & trademark risks',
      'Clean & fix this title: "Stunning Apple iPhone 16 Pro Max on Nike desk IMG_4021"',
      'Why does Adobe Stock reject assets for "Technical Issues" or "Similars"?'
    ]
  },
  {
    id: 'rank_hijack',
    label: '📈 Competitor Hijack & Rank #1',
    shortLabel: '📈 Rank #1 Hijack',
    icon: TrendingUp,
    badgeColor: 'text-violet-400 border-violet-500/40 bg-violet-500/10',
    placeholder: 'Enter a competitor title or niche to outrank them with Top 10 weighted tags...',
    quickPrompts: [
      'Hijack Rank #1 keywords for "abstract dark blue technology background"',
      'Give me 3 high-converting buyer-intent titles for healthcare telemedicine',
      'Top 10 priority search weight keywords for Eid & Ramadan vectors'
    ]
  },
  {
    id: 'batch_10x',
    label: '🚀 10x Portfolio Series Architect',
    shortLabel: '🚀 10x Series',
    icon: Sparkles,
    badgeColor: 'text-fuchsia-400 border-fuchsia-500/40 bg-fuchsia-500/10',
    placeholder: 'Enter a profitable niche to generate 10 commercial asset ideas + prompts + master 49 tags...',
    quickPrompts: [
      'Generate 10x high-selling microstock series for AI Fintech & Biometric Banking',
      'Build a 10-asset vector series for Sustainable Green Packaging & Eco Badges',
      'Create 10 commercial background concepts with copy space for Luxury Real Estate'
    ]
  },
  {
    id: 'earning_advisor',
    label: '💰 High-CPC & Google Monetization',
    shortLabel: '💰 Earning & CPC',
    icon: DollarSign,
    badgeColor: 'text-amber-300 border-amber-400/40 bg-amber-500/10',
    placeholder: 'Ask for daily upload plans, high-CPC Google AdSense niches, or $1,000/mo roadmap...',
    quickPrompts: [
      'Give me a 30-day upload plan to reach $500/month on Adobe Stock & Freepik',
      'Highest CPC keywords for Google AdSense & SaaS monetization in 2026',
      'Which vector vs photo assets get the highest download-to-view ratio?'
    ]
  }
];

export const SovereignAiAssistantDrawer: React.FC<SovereignAiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  themeMode,
  chatMessages,
  chatSessions,
  activeChatSessionId,
  showChatHistorySidebar,
  setShowChatHistorySidebar,
  onStartNewChat,
  onSelectChatSession,
  onDeleteChatSession,
  chatInput,
  setChatInput,
  chatAttachedImage,
  setChatAttachedImage,
  onChatImageUpload,
  onSendChat,
  isChatLoading,
  activeMode,
  setActiveMode,
  onPushToStudioQueue,
  activeWorkspaceAsset,
  totalQueueCount = 0,
  showToast
}) => {
  const isLight = themeMode === 'light';
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgIdx, setSpeakingMsgIdx] = useState<number | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isDragOverChat, setIsDragOverChat] = useState(false);

  const chatFileInputRef = useRef<HTMLInputElement | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const currentModeConfig = AI_MODES.find((m) => m.id === activeMode) || AI_MODES[0];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    }
  }, [chatMessages, isChatLoading, isOpen, isExpanded]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    };
  }, []);

  const copyWithFeedback = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`✓ Copied ${label} to clipboard!`);
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 1800);
  };

  // Voice Dictation (Speech-to-Text)
  const toggleVoiceInput = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Voice dictation is supported in Chrome, Edge, and Safari.');
      return;
    }

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        if (transcript) {
          setChatInput(chatInput ? `${chatInput} ${transcript}` : transcript);
          showToast('🎙️ Voice captured!');
        }
      };
      recognitionRef.current = recognition;
      recognition.start();
    } catch (_) {
      setIsListening(false);
    }
  };

  // Text-to-Speech Read Aloud
  const toggleSpeakMessage = (text: string, idx: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast('Text-to-speech is not supported in this browser.');
      return;
    }
    if (speakingMsgIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingMsgIdx(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanSpeech = text.replace(/[*#_`~>-]/g, ' ').replace(/\s+/g, ' ').trim();
    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.04;
    utterance.onend = () => setSpeakingMsgIdx(null);
    utterance.onerror = () => setSpeakingMsgIdx(null);
    setSpeakingMsgIdx(idx);
    window.speechSynthesis.speak(utterance);
  };

  // Export single metadata card directly as Agency-Formatted CSV (Adobe, Shutterstock, Freepik)
  const handleDownloadSingleCsv = (
    meta: StructuredChatMetadata,
    fileName?: string,
    agency: 'adobe' | 'shutterstock' | 'freepik' = 'adobe'
  ) => {
    const safeName = fileName || 'adobemeta-ai-asset.jpg';
    const esc = (s: string) => `"${String(s || '').replace(/"/g, '""')}"`;
    let csvContent = '';
    let prefix = 'AdobeStock';

    if (agency === 'shutterstock') {
      prefix = 'Shutterstock';
      const desc = meta.agencyTitles?.shutterstock || meta.alternativeTitles?.editorialStory || meta.title;
      csvContent =
        'Filename,Description,Keywords,Categories\n' +
        `${esc(safeName)},${esc(desc)},${esc(meta.all49Keywords.join(', '))},${esc(meta.category || 'Business/Finance')}\n`;
    } else if (agency === 'freepik') {
      prefix = 'Freepik';
      const fpTitle = meta.agencyTitles?.freepik || meta.alternativeTitles?.highVolumeSeo || meta.title;
      csvContent =
        'File name;Title;Keywords\n' +
        `${esc(safeName)};${esc(fpTitle)};${esc(meta.all49Keywords.slice(0, 30).join(', '))}\n`;
    } else {
      csvContent =
        'Filename,Title,Keywords,Category\n' +
        `${esc(safeName)},${esc(meta.title)},${esc(meta.all49Keywords.join(', '))},${esc(meta.category || 'Graphic Resources')}\n`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${prefix}_${safeName.replace(/\.[^/.]+$/, '')}_Metadata.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`✓ Downloaded ${prefix} CSV directly from Sovereign AI 6.0!`);
  };

  // Download generated image/SVG as high-res PNG
  const handleDownloadGeneratedArtwork = (dataUrl: string, title?: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width || 1200;
      canvas.height = img.height || 750;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        const slug = (title || 'sovereign-ai-artwork')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .slice(0, 36);
        a.download = `${slug}.png`;
        a.click();
        showToast('✓ High-Resolution Commercial PNG downloaded!');
      }
    };
    img.src = dataUrl;
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOverChat(true);
            }}
            onDragLeave={() => setIsDragOverChat(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOverChat(false);
              const file = e.dataTransfer?.files?.[0];
              if (file && chatFileInputRef.current) {
                const dt = new DataTransfer();
                dt.items.add(file);
                chatFileInputRef.current.files = dt.files;
                onChatImageUpload({ target: chatFileInputRef.current } as any);
              }
            }}
            className={`relative flex flex-col overflow-hidden sovereign-prism-card transition-all duration-300 ${
              isExpanded
                ? 'w-[94vw] sm:w-[760px] lg:w-[920px] h-[82vh] max-h-[780px] rounded-3xl shadow-[0_35px_100px_rgba(0,0,0,0.75)]'
                : 'w-[350px] sm:w-[410px] h-[540px] rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.6)]'
            } ${
              isLight
                ? 'crystal-architectural-slab-light text-neutral-900'
                : 'crystal-architectural-slab-dark text-neutral-100'
            }`}
          >
            {/* Drag & Drop Visual Overlay */}
            {isDragOverChat && (
              <div className="absolute inset-0 z-50 bg-emerald-950/85 backdrop-blur-md border-2 border-dashed border-emerald-400 rounded-2xl flex flex-col items-center justify-center p-6 text-center pointer-events-none">
                <ImageIcon className="w-10 h-10 text-emerald-400 mb-2 animate-bounce" />
                <p className="text-sm font-bold text-white">Drop Image / EPS / PSD for Instant 49-Tag Vision SEO</p>
                <p className="text-xs text-emerald-300 mt-1">Subject-First Title (&lt;70 chars) + Top 10 Weighted Tags</p>
              </div>
            )}

            {/* Top Executive Command Bar */}
            <div
              className={`px-3.5 py-2.5 border-b flex items-center justify-between z-20 ${
                isLight ? 'bg-white border-neutral-200/90' : 'bg-[#0d1017] border-neutral-800'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <button
                  type="button"
                  onClick={() => setShowChatHistorySidebar((prev) => !prev)}
                  className={`px-2 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                    showChatHistorySidebar
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-500'
                      : isLight
                      ? 'bg-neutral-100 hover:bg-neutral-200/80 border-neutral-200 text-neutral-700'
                      : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-200'
                  }`}
                  title="Saved Chat Sessions"
                >
                  <Clock className="w-3 h-3" />
                  <span>{chatSessions.length}</span>
                </button>

                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="text-xs font-extrabold tracking-tight truncate">
                      Sovereign AI Co-Pilot 6.0
                    </h3>
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 font-mono text-[8.5px] font-bold">
                      8-MODE QUANTUM
                    </span>
                  </div>
                  <p className="text-[9.5px] text-neutral-400 truncate">
                    {currentModeConfig.label}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={onStartNewChat}
                  className={`px-2 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                    isLight
                      ? 'bg-neutral-950 text-white border-neutral-950 hover:bg-neutral-800'
                      : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                  }`}
                  title="Start New Conversation"
                >
                  <Plus className="w-3 h-3" />
                  <span>New</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className={`p-1.5 rounded-lg border transition cursor-pointer ${
                    isLight
                      ? 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:text-black'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white'
                  }`}
                  title={isExpanded ? 'Compact Drawer View' : 'Expand to Full Studio Command View'}
                >
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    isLight
                      ? 'text-neutral-500 hover:text-black hover:bg-neutral-100'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                  title="Close AI Co-Pilot"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 6 Specialized AI Intelligence Modes Selector Bar */}
            <div
              className={`px-2.5 py-1.5 border-b flex items-center gap-1.5 overflow-x-auto scrollbar-none z-10 ${
                isLight ? 'bg-[#f4f2ed] border-neutral-200/80' : 'bg-[#090b10] border-neutral-800/90'
              }`}
            >
              {AI_MODES.map((m) => {
                const isSelected = activeMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setActiveMode(m.id)}
                    className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? m.badgeColor
                        : isLight
                        ? 'bg-white border-neutral-200/90 text-neutral-600 hover:text-neutral-950'
                        : 'bg-neutral-900/90 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>{m.shortLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Live Studio Workspace Sync Bar (When user has uploaded assets in Studio) */}
            {activeWorkspaceAsset && (
              <div
                className={`px-3 py-1.5 border-b flex items-center justify-between gap-2 text-[10px] ${
                  isLight
                    ? 'bg-amber-50/90 border-amber-200/80 text-amber-900'
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-200'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0 truncate">
                  <Layers className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate font-semibold">
                    Studio Sync ({totalQueueCount} in queue): {activeWorkspaceAsset.fileName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const prompt = activeWorkspaceAsset.title
                      ? `Audit and upgrade my active Studio asset "${activeWorkspaceAsset.fileName}" (Current Title: "${activeWorkspaceAsset.title}"). Give me a higher-converting Rank #1 Title (<70 chars), Top 10 Priority Keywords, and Full 49 SEO Keywords.`
                      : `Generate Rank #1 Title (<70 chars), Top 10 Priority Keywords, and Full 49 SEO Keywords for my active Studio asset "${activeWorkspaceAsset.fileName}".`;
                    onSendChat(prompt, 'vision_seo');
                  }}
                  disabled={isChatLoading}
                  className="shrink-0 px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-extrabold hover:bg-amber-400 transition cursor-pointer flex items-center gap-1"
                >
                  <span>Optimize Asset</span>
                  <ArrowUpRight className="w-2.5 h-2.5" />
                </button>
              </div>
            )}

            {/* Main Body Wrapper */}
            <div className="relative flex-1 flex flex-col overflow-hidden">
              {/* Slide-Out Saved Conversation History Sidebar */}
              <AnimatePresence>
                {showChatHistorySidebar && (
                  <motion.div
                    initial={{ x: '-100%', opacity: 0.5 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '-100%', opacity: 0 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className={`absolute inset-y-0 left-0 w-[245px] z-30 border-r flex flex-col shadow-2xl ${
                      isLight
                        ? 'bg-white/98 border-neutral-200 text-neutral-900'
                        : 'bg-[#0e1118]/98 border-neutral-800 text-neutral-100'
                    } backdrop-blur-md`}
                  >
                    <div
                      className={`px-3 py-2.5 border-b flex items-center justify-between ${
                        isLight ? 'border-neutral-200/80' : 'border-neutral-800'
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                        Conversation Vault
                      </span>
                      <button
                        type="button"
                        onClick={onStartNewChat}
                        className="text-[10px] font-bold text-emerald-500 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> New Chat
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                      {chatSessions.map((session) => {
                        const isCurrent = session.id === activeChatSessionId;
                        const msgCount = Math.max(0, (session.messages?.length || 1) - 1);
                        return (
                          <div
                            key={session.id}
                            onClick={() => onSelectChatSession(session.id)}
                            className={`group flex items-center justify-between gap-1.5 px-2.5 py-2 rounded-xl text-left text-xs transition cursor-pointer border ${
                              isCurrent
                                ? isLight
                                  ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
                                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-semibold'
                                : isLight
                                ? 'bg-neutral-50 hover:bg-neutral-100 border-transparent text-neutral-700'
                                : 'bg-neutral-900/50 hover:bg-neutral-800/80 border-transparent text-neutral-300'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-[11px] leading-tight">
                                {session.title || 'New Chat'}
                              </div>
                              <div
                                className={`text-[9.5px] mt-0.5 ${
                                  isCurrent ? 'opacity-80' : 'text-neutral-400'
                                }`}
                              >
                                {msgCount} msg{msgCount === 1 ? '' : 's'} ·{' '}
                                {new Date(session.updatedAt || Date.now()).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => onDeleteChatSession(session.id, e)}
                              className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 hover:text-red-400 transition ${
                                isCurrent ? 'opacity-90' : ''
                              }`}
                              title="Delete conversation"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mode-Specific Quick Actions Bar */}
              <div
                className={`px-3 py-1.5 border-b flex items-center gap-1.5 overflow-x-auto scrollbar-none ${
                  isLight ? 'bg-[#faf8f5] border-neutral-200/60' : 'bg-[#0b0d13] border-neutral-800/80'
                }`}
              >
                <button
                  type="button"
                  onClick={() => chatFileInputRef.current?.click()}
                  className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition flex items-center gap-1 cursor-pointer"
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>+ Attach Image / EPS / PSD</span>
                </button>
                {currentModeConfig.quickPrompts.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSendChat(q, activeMode)}
                    disabled={isChatLoading}
                    className={`shrink-0 text-[10px] font-medium px-2.5 py-1 rounded-full border transition cursor-pointer ${
                      isLight
                        ? 'bg-white border-neutral-200/90 text-neutral-700 hover:border-neutral-900 hover:text-black'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-emerald-500/40 hover:text-white'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Chat Messages Feed */}
              <div
                onClick={() => {
                  if (showChatHistorySidebar) setShowChatHistorySidebar(false);
                }}
                className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs leading-relaxed"
              >
                {chatMessages.map((msg, i) => {
                  const isUser = msg.role === 'user';
                  const textPartObj = Array.isArray(msg.parts)
                    ? msg.parts.find((p: any) => typeof p?.text === 'string')
                    : null;
                  const textContent = textPartObj?.text || msg.parts?.[0]?.text || '';
                  const imgPreview = msg.imagePreview;
                  const generatedImageUrl = msg.generatedImageUrl;
                  const structuredMeta: StructuredChatMetadata | undefined = msg.generatedMetadata;

                  return (
                    <div
                      key={i}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`${
                          isExpanded ? 'max-w-[82%]' : 'max-w-[90%]'
                        } rounded-2xl px-3.5 py-2.5 whitespace-pre-wrap ${
                          isUser
                            ? isLight
                              ? 'bg-neutral-950 text-white rounded-br-xs'
                              : 'bg-emerald-500 text-slate-950 font-semibold rounded-br-xs'
                            : isLight
                            ? 'bg-white border border-neutral-200/90 text-neutral-900 rounded-bl-xs shadow-xs'
                            : 'bg-[#121621] border border-neutral-800 text-neutral-100 rounded-bl-xs shadow-md'
                        }`}
                      >
                        {/* User Attached Image Preview */}
                        {imgPreview && (
                          <div className="mb-2.5 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-black/25">
                            <img
                              src={imgPreview}
                              alt={msg.imageFileName || 'Attached asset'}
                              className="max-h-36 w-auto object-contain mx-auto"
                            />
                            {msg.imageFileName && (
                              <div className="px-2.5 py-1 text-[9.5px] font-mono truncate bg-black/40 text-white">
                                📷 {msg.imageFileName}
                              </div>
                            )}
                          </div>
                        )}

                        {/* AI Synthesized Visual Artwork Card */}
                        {generatedImageUrl && (
                          <div className="mb-3 rounded-xl overflow-hidden border border-emerald-500/30 bg-slate-950 shadow-lg">
                            <img
                              src={generatedImageUrl}
                              alt="AI Synthesized Commercial Visual"
                              className="w-full max-h-56 object-cover"
                            />
                            <div className="px-3 py-2 bg-slate-900/95 border-t border-slate-800 flex items-center justify-between gap-2">
                              <span className="text-[10px] font-mono text-emerald-400 truncate">
                                ✨ {msg.generatedImageModel || 'Studio Visual Synthesizer'}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDownloadGeneratedArtwork(
                                      generatedImageUrl,
                                      structuredMeta?.title || 'commercial-stock-visual'
                                    )
                                  }
                                  className="px-2 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] flex items-center gap-1 transition cursor-pointer"
                                >
                                  <Download className="w-3 h-3" />
                                  <span>Download PNG</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Message Text */}
                        <div className="leading-relaxed">{textContent}</div>

                        {/* Interactive 1-Click Quantum Metadata & Multi-Agency SEO Card */}
                        {!isUser && structuredMeta && (
                          <div
                            className={`mt-3 p-3 rounded-xl border space-y-2.5 ${
                              isLight
                                ? 'bg-[#f8f6f2] border-neutral-200/90 text-neutral-900'
                                : 'bg-[#090c12] border-white/10 text-neutral-100'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 border-b pb-2 border-neutral-200/70 dark:border-white/10 flex-wrap">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono text-[9.5px] font-bold">
                                  SEO {structuredMeta.seoScore || 99}/100
                                </span>
                                <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 font-mono text-[9.5px] font-bold">
                                  {structuredMeta.title.length}/70 CHARS
                                </span>
                                <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-mono text-[9.5px] font-bold">
                                  CPC {structuredMeta.estimatedCpc || '$3.45'}
                                </span>
                              </div>
                              <span className="text-[9.5px] font-mono text-emerald-400 font-bold">
                                {structuredMeta.all49Keywords.length}/49 WEIGHTED TAGS
                              </span>
                            </div>

                            {/* Multi-Angle Title Copy Strip (Primary, B2B, Shutterstock Narrative) */}
                            {structuredMeta.alternativeTitles && (
                              <div className="space-y-1">
                                <div className="text-[9.5px] font-mono uppercase tracking-wider text-neutral-400">
                                  1-Click Multi-Angle Titles:
                                </div>
                                <div className="grid grid-cols-1 gap-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      copyWithFeedback(
                                        structuredMeta.title,
                                        `t_main_${i}`,
                                        'Adobe Stock Subject-First Title'
                                      )
                                    }
                                    className={`text-left px-2 py-1 rounded-lg border text-[10px] flex items-center justify-between gap-1.5 transition cursor-pointer ${
                                      isLight
                                        ? 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-900'
                                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-100'
                                    }`}
                                  >
                                    <span className="truncate">
                                      <strong className="text-amber-500">Adobe (&lt;70c):</strong> {structuredMeta.title}
                                    </span>
                                    <Copy className="w-2.5 h-2.5 shrink-0 text-amber-400" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      copyWithFeedback(
                                        structuredMeta.alternativeTitles!.b2bCommercial,
                                        `t_b2b_${i}`,
                                        'B2B Enterprise Title'
                                      )
                                    }
                                    className={`text-left px-2 py-1 rounded-lg border text-[10px] flex items-center justify-between gap-1.5 transition cursor-pointer ${
                                      isLight
                                        ? 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-900'
                                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-100'
                                    }`}
                                  >
                                    <span className="truncate">
                                      <strong className="text-cyan-400">B2B / Getty:</strong> {structuredMeta.alternativeTitles.b2bCommercial}
                                    </span>
                                    <Copy className="w-2.5 h-2.5 shrink-0 text-cyan-400" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      copyWithFeedback(
                                        structuredMeta.alternativeTitles!.editorialStory,
                                        `t_shutter_${i}`,
                                        'Shutterstock Narrative Description'
                                      )
                                    }
                                    className={`text-left px-2 py-1 rounded-lg border text-[10px] flex items-center justify-between gap-1.5 transition cursor-pointer ${
                                      isLight
                                        ? 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-900'
                                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-100'
                                    }`}
                                  >
                                    <span className="truncate">
                                      <strong className="text-emerald-400">Shutterstock:</strong> {structuredMeta.alternativeTitles.editorialStory}
                                    </span>
                                    <Copy className="w-2.5 h-2.5 shrink-0 text-emerald-400" />
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Interactive Top-10 Heavyweight Tags Preview Chips */}
                            {structuredMeta.top10Keywords.length > 0 && (
                              <div className="space-y-1">
                                <div className="text-[9.5px] font-mono uppercase tracking-wider text-amber-400 flex items-center justify-between">
                                  <span>⚡ Top 10 Priority Slots (75% Search Weight)</span>
                                  <span>Click any tag to copy</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {structuredMeta.top10Keywords.slice(0, 10).map((kw, kIdx) => (
                                    <button
                                      key={kIdx}
                                      type="button"
                                      onClick={() => copyWithFeedback(kw, `kw_${i}_${kIdx}`, `Slot #${kIdx + 1}: "${kw}"`)}
                                      className={`px-1.5 py-0.5 rounded text-[9.5px] font-medium border transition cursor-pointer flex items-center gap-1 ${
                                        kIdx === 0
                                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                                          : isLight
                                          ? 'bg-white border-neutral-200 text-neutral-800 hover:border-amber-400'
                                          : 'bg-white/5 border-white/10 text-neutral-200 hover:border-amber-400/50'
                                      }`}
                                    >
                                      <span className="font-mono text-[8.5px] opacity-75">#{kIdx + 1}</span>
                                      <span>{kw}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* One-Click Action Buttons Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-0.5">
                              <button
                                type="button"
                                onClick={() =>
                                  copyWithFeedback(
                                    structuredMeta.title,
                                    `title_${i}`,
                                    'Commercial Title'
                                  )
                                }
                                className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                                  copiedKey === `title_${i}`
                                    ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                                    : isLight
                                    ? 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-200'
                                }`}
                              >
                                {copiedKey === `title_${i}` ? (
                                  <Check className="w-3 h-3" />
                                ) : (
                                  <Copy className="w-3 h-3 text-amber-400" />
                                )}
                                <span>Copy Title</span>
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  copyWithFeedback(
                                    structuredMeta.top10Keywords.join(', '),
                                    `top10_${i}`,
                                    'Top 10 Priority Tags'
                                  )
                                }
                                className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                                  copiedKey === `top10_${i}`
                                    ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                                    : isLight
                                    ? 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-200'
                                }`}
                              >
                                {copiedKey === `top10_${i}` ? (
                                  <Check className="w-3 h-3" />
                                ) : (
                                  <Copy className="w-3 h-3 text-cyan-400" />
                                )}
                                <span>Copy Top 10</span>
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  copyWithFeedback(
                                    structuredMeta.all49Keywords.join(', '),
                                    `all49_${i}`,
                                    `All ${structuredMeta.all49Keywords.length} SEO Keywords`
                                  )
                                }
                                className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition cursor-pointer col-span-2 sm:col-span-1 ${
                                  copiedKey === `all49_${i}`
                                    ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                                    : 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/40 text-emerald-400'
                                }`}
                              >
                                {copiedKey === `all49_${i}` ? (
                                  <Check className="w-3 h-3" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                                <span>Copy 49 Tags</span>
                              </button>

                              {structuredMeta.aiPrompt && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    copyWithFeedback(
                                      structuredMeta.aiPrompt!,
                                      `prompt_${i}`,
                                      'Commercial AI Prompt'
                                    )
                                  }
                                  className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                                    isLight
                                      ? 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-200'
                                  }`}
                                >
                                  <Wand2 className="w-3 h-3 text-purple-400" />
                                  <span>Copy Prompt</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleDownloadSingleCsv(structuredMeta, msg.imageFileName, 'adobe')}
                                className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                                  isLight
                                    ? 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-200'
                                }`}
                                title="Download Official Adobe Stock CSV"
                              >
                                <FileDown className="w-3 h-3 text-emerald-400" />
                                <span>Adobe CSV</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDownloadSingleCsv(structuredMeta, msg.imageFileName, 'shutterstock')}
                                className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                                  isLight
                                    ? 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-200'
                                }`}
                                title="Download Official Shutterstock CSV"
                              >
                                <FileDown className="w-3 h-3 text-sky-400" />
                                <span>Shutterstock CSV</span>
                              </button>

                              {onPushToStudioQueue && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    onPushToStudioQueue({
                                      title: structuredMeta.title,
                                      category: structuredMeta.category || 'Graphic Resources',
                                      keywords: structuredMeta.all49Keywords,
                                      previewUrl: generatedImageUrl || imgPreview,
                                      fileName: msg.imageFileName || 'ai-synthesized-asset.jpg'
                                    })
                                  }
                                  className="px-2.5 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 text-[10px] font-bold flex items-center justify-center gap-1 transition cursor-pointer col-span-2 sm:col-span-1"
                                >
                                  <ArrowUpRight className="w-3 h-3" />
                                  <span>Send to Studio</span>
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Bottom Message Toolbar (Voice Readout & Full Copy) */}
                        {!isUser && textContent.length > 20 && (
                          <div className="mt-2 pt-1.5 border-t border-neutral-200/60 dark:border-neutral-800/80 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => toggleSpeakMessage(textContent, i)}
                              className="text-[10px] font-semibold text-neutral-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition"
                              title="Listen to AI Response"
                            >
                              {speakingMsgIdx === i ? (
                                <>
                                  <VolumeX className="w-3 h-3 text-amber-400" />
                                  <span className="text-amber-400">Stop Audio</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3 h-3" />
                                  <span>Listen</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                copyWithFeedback(textContent, `msg_${i}`, 'AI Response')
                              }
                              className="text-[10px] font-semibold text-emerald-500 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              {copiedKey === `msg_${i}` ? (
                                <>
                                  <Check className="w-2.5 h-2.5" /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-2.5 h-2.5" /> Copy Full Response
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isChatLoading && (
                  <div className="flex justify-start">
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-[11px] flex items-center gap-2.5 border ${
                        isLight
                          ? 'bg-white border-neutral-200 text-neutral-600'
                          : 'bg-[#121621] border-neutral-800 text-neutral-300'
                      }`}
                    >
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                      <span>
                        Sovereign AI Co-Pilot ({currentModeConfig.shortLabel}) is synthesizing...
                      </span>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Attached Image Preview Strip (Before Sending) */}
              {chatAttachedImage && (
                <div
                  className={`px-3 py-2 border-t flex items-center justify-between gap-2 ${
                    isLight
                      ? 'bg-emerald-50/90 border-emerald-200'
                      : 'bg-emerald-950/40 border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={chatAttachedImage.previewUrl}
                      alt="Preview"
                      className="w-9 h-9 rounded-lg object-cover border border-emerald-500/40 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-[10.5px] font-bold truncate text-emerald-600 dark:text-emerald-400">
                        {chatAttachedImage.fileName}
                      </div>
                      <div className="text-[9.5px] text-neutral-400">
                        Ready for Vision SEO (&lt;70 char Title + 49 Keywords)
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setChatAttachedImage(null)}
                    className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-neutral-400 hover:text-red-400 transition cursor-pointer"
                    title="Remove attached image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Bottom Input Composer with Image Upload, Paste Support & Voice Dictation */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSendChat(undefined, activeMode);
                }}
                className={`p-2.5 border-t flex items-center gap-1.5 ${
                  isLight ? 'bg-white border-neutral-200/90' : 'bg-[#0d1017] border-neutral-800'
                }`}
              >
                <input
                  ref={chatFileInputRef}
                  type="file"
                  accept="image/*,.eps,.ai,.psd"
                  onChange={onChatImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => chatFileInputRef.current?.click()}
                  disabled={isChatLoading}
                  className={`p-2 rounded-xl border transition cursor-pointer shrink-0 ${
                    chatAttachedImage
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : isLight
                      ? 'bg-[#fbfaf8] hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                      : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
                  }`}
                  title="Attach Image, EPS, or PSD for Vision SEO"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  disabled={isChatLoading}
                  className={`p-2 rounded-xl border transition cursor-pointer shrink-0 ${
                    isListening
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-pulse'
                      : isLight
                      ? 'bg-[#fbfaf8] hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                      : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
                  }`}
                  title={isListening ? 'Stop Voice Dictation' : 'Voice Input (Speak your prompt)'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onPaste={(e) => {
                    const files = e.clipboardData?.files;
                    if (files && files.length > 0 && chatFileInputRef.current) {
                      const imgFile = Array.from(files).find((f) => f.type.startsWith('image/'));
                      if (imgFile) {
                        e.preventDefault();
                        const dt = new DataTransfer();
                        dt.items.add(imgFile);
                        chatFileInputRef.current.files = dt.files;
                        onChatImageUpload({ target: chatFileInputRef.current } as any);
                      }
                    }
                  }}
                  placeholder={
                    chatAttachedImage
                      ? 'Press Send for 49 tags or add instructions...'
                      : currentModeConfig.placeholder
                  }
                  disabled={isChatLoading}
                  className={`flex-1 text-xs rounded-xl px-3 py-2 border focus:outline-none transition min-w-0 ${
                    isLight
                      ? 'bg-[#fbfaf8] border-neutral-200 text-neutral-900 focus:border-neutral-900'
                      : 'bg-neutral-950 border-neutral-800 text-white focus:border-emerald-500/50'
                  }`}
                />

                <button
                  type="submit"
                  disabled={isChatLoading || (!chatInput.trim() && !chatAttachedImage)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer disabled:opacity-40 shrink-0 flex items-center gap-1 ${
                    isLight
                      ? 'bg-neutral-950 hover:bg-black text-white'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
