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
  ArrowUpRight,
  PhoneCall,
  PhoneOff,
  Globe,
  Radio,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export type AiAssistantMode =
  | 'auto'
  | 'best_friend'
  | 'vision_seo'
  | 'multi_agency_5x'
  | 'image_synth'
  | 'audit_doctor'
  | 'rank_hijack'
  | 'batch_10x'
  | 'earning_advisor'
  | 'video_4k_seo'
  | 'prompt_alchemist'
  | 'code_tech_guru';

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
  onSendChat: (
    overridePrompt?: string,
    overrideMode?: AiAssistantMode,
    voiceOptions?: {
      voiceLang?: string;
      isLiveVoiceCall?: boolean;
      deepMastermind?: boolean;
      webSearchGrounding?: boolean;
    }
  ) => void;
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
  customApiKey?: string;
  showToast: (msg: string) => void;
}

const VOICE_LANGUAGES = [
  { code: 'en-US', label: '🇺🇸 English (US)', name: 'English (US)' },
  { code: 'en-GB', label: '🇬🇧 English (UK)', name: 'English (UK)' },
  { code: 'bn-BD', label: '🇧🇩 Bengali (BD)', name: 'Bengali' },
  { code: 'hi-IN', label: '🇮🇳 Hindi (HI)', name: 'Hindi' },
  { code: 'ur-PK', label: '🇵🇰 Urdu (UR)', name: 'Urdu' },
  { code: 'ar-SA', label: '🇸🇦 Arabic (AR)', name: 'Arabic' },
  { code: 'es-ES', label: '🇪🇸 Spanish (ES)', name: 'Spanish' },
  { code: 'fr-FR', label: '🇫🇷 French (FR)', name: 'French' },
  { code: 'de-DE', label: '🇩🇪 German (DE)', name: 'German' },
  { code: 'pt-BR', label: '🇧🇷 Portuguese (BR)', name: 'Portuguese' },
  { code: 'id-ID', label: '🇮🇩 Indonesian (ID)', name: 'Indonesian' },
  { code: 'ja-JP', label: '🇯🇵 Japanese (JA)', name: 'Japanese' }
];

export type AiVoicePersonaId = 'Kore' | 'Aoede' | 'Zephyr' | 'Leda' | 'Charon' | 'Fenrir' | 'Puck' | 'Orus';

const AI_VOICE_PERSONAS: {
  id: AiVoicePersonaId;
  label: string;
  gender: 'female' | 'male';
  style: string;
  pitch: number;
  rate: number;
}[] = [
  { id: 'Kore', label: '♀ Kore · Warm Best Friend (Female)', gender: 'female', style: 'Warm & Natural', pitch: 1.04, rate: 1.02 },
  { id: 'Aoede', label: '♀ Aoede · Soulful & Melodic (Female)', gender: 'female', style: 'Expressive & Soft', pitch: 1.08, rate: 1.0 },
  { id: 'Zephyr', label: '♀ Zephyr · Crisp Studio Pro (Female)', gender: 'female', style: 'Clear & Bright', pitch: 1.05, rate: 1.04 },
  { id: 'Leda', label: '♀ Leda · Calm Mentor (Female)', gender: 'female', style: 'Gentle & Wise', pitch: 1.02, rate: 0.98 },
  { id: 'Charon', label: '♂ Charon · Deep Wise Friend (Male)', gender: 'male', style: 'Deep & Confident', pitch: 0.88, rate: 0.99 },
  { id: 'Fenrir', label: '♂ Fenrir · Bold Executive (Male)', gender: 'male', style: 'Strong & Direct', pitch: 0.84, rate: 1.02 },
  { id: 'Puck', label: '♂ Puck · Energetic Buddy (Male)', gender: 'male', style: 'Fast & Lively', pitch: 0.95, rate: 1.06 },
  { id: 'Orus', label: '♂ Orus · Smooth Baritone (Male)', gender: 'male', style: 'Calm & Rich', pitch: 0.86, rate: 0.98 }
];

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
    label: '🌐 7-Agency Universal Metadata Matrix',
    shortLabel: '🌐 7-Agency Matrix',
    icon: Layers,
    badgeColor: 'text-sky-400 border-sky-500/40 bg-sky-500/10',
    placeholder: 'Enter any visual subject to generate Adobe, Shutterstock, Freepik, Getty, Vecteezy, 123RF & Dreamstime metadata...',
    quickPrompts: [
      'Generate 7-Agency Universal Metadata Matrix for isometric cloud cybersecurity vector',
      'Create Adobe (<70 chars), Shutterstock narrative & Freepik 30 tags for Eid Mubarak gold background',
      'Universal 7-Agency titles & 49 weighted tags for renewable solar energy grid'
    ]
  },
  {
    id: 'image_synth',
    label: '🎨 AI Visual & Commercial Prompt Synth',
    shortLabel: '🎨 Image & Prompt',
    icon: Wand2,
    badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
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
  },
  {
    id: 'best_friend',
    label: '🤝 Unfiltered Best-Friend Mastermind',
    shortLabel: '🤝 Best Friend',
    icon: Sparkles,
    badgeColor: 'text-emerald-300 border-emerald-400/40 bg-emerald-500/15',
    placeholder: 'Ask me anything candidly about microstock rankings, Google AdSense, or portfolio growth...',
    quickPrompts: [
      'What is the exact secret formula to 10x earnings on Adobe Stock and Shutterstock?',
      'Which critical mistakes cause stock visuals to get rejected or rank on page 50?',
      'Give me a step-by-step roadmap to build $1,000/mo passive royalty income from scratch'
    ]
  },
  {
    id: 'video_4k_seo',
    label: '🎬 4K Stock Video & Footage Director',
    shortLabel: '🎬 4K Video SEO',
    icon: Eye,
    badgeColor: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10',
    placeholder: 'Describe your 4K video / drone / B-roll clip for high-royalty ($25-$120) SEO tags...',
    quickPrompts: [
      'Generate 4K stock footage title & 49 tags for aerial drone solar farm at sunset',
      'What 4K B-roll video niches pay the highest royalty on Adobe Stock & Pond5?',
      'Give me 5 cinematic slow-motion stock video concepts businesses buy daily'
    ]
  },
  {
    id: 'prompt_alchemist',
    label: '🧪 Prompt Alchemist (MJ v6.1 & Firefly)',
    shortLabel: '🧪 Prompt Lab',
    icon: Wand2,
    badgeColor: 'text-pink-400 border-pink-500/40 bg-pink-500/10',
    placeholder: 'Enter any topic to get 5 commercial prompt angles (Photo, 3D, Vector, Macro, Abstract)...',
    quickPrompts: [
      'Give me 5 Midjourney v6.1 & Firefly 3 commercial prompts for AI Cybersecurity',
      'Create zero-artifact photorealistic prompts with copy space for Luxury Skincare',
      'Best prompt formula to avoid hand/text defects in Adobe Stock AI submissions'
    ]
  },
  {
    id: 'code_tech_guru',
    label: '💻 Code, Automation & Tech Guru',
    shortLabel: '💻 Code & Tech',
    icon: Layers,
    badgeColor: 'text-teal-400 border-teal-500/40 bg-teal-500/10',
    placeholder: 'Ask for Python/JS automation scripts, Illustrator JSX scripts, or any coding help...',
    quickPrompts: [
      'Write an Adobe Illustrator JSX script to auto-export artboards to EPS 10 & JPG',
      'How to automate ExifTool batch IPTC keyword injection for 500 JPG files?',
      'Explain how search engine ranking algorithms weight title vs top-10 tags'
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
  customApiKey = '',
  showToast
}) => {
  const isLight = themeMode === 'light';
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgIdx, setSpeakingMsgIdx] = useState<number | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isDragOverChat, setIsDragOverChat] = useState(false);

  // Two-Way Omnilingual Live Voice Call State
  const [voiceLang, setVoiceLang] = useState<string>('bn-BD');
  const [isLiveVoiceCall, setIsLiveVoiceCall] = useState(false);
  const [autoSpeakReplies, setAutoSpeakReplies] = useState(true);
  const [liveTranscriptPreview, setLiveTranscriptPreview] = useState('');
  const [aiVoicePersona, setAiVoicePersona] = useState<AiVoicePersonaId>('Kore');
  const [deepMastermindMode, setDeepMastermindMode] = useState<boolean>(true);
  const [webSearchGrounding, setWebSearchGrounding] = useState<boolean>(false);
  const [showControlPanel, setShowControlPanel] = useState(false);
  const [cardTabMap, setCardTabMap] = useState<Record<number, 'titles' | 'tags' | 'export'>>({});
  const [controlPanelTab, setControlPanelTab] = useState<'engines' | 'voice'>('engines');

  const chatFileInputRef = useRef<HTMLInputElement | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const silenceTimerRef = useRef< any >(null);
  const speechQueueActiveRef = useRef<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const lastSpokenMsgCountRef = useRef<number>(chatMessages.length);
  const isLiveVoiceCallRef = useRef<boolean>(false);
  const isChatLoadingRef = useRef<boolean>(isChatLoading);
  const voiceLangRef = useRef<string>(voiceLang);
  const aiVoicePersonaRef = useRef<AiVoicePersonaId>(aiVoicePersona);
  const activeModeRef = useRef<AiAssistantMode>(activeMode);
  const onSendChatRef = useRef(onSendChat);
  const webAudioCtxRef = useRef<AudioContext | null>(null);
  const activeBufferSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const speechKeepAliveIntervalRef = useRef<any>(null);

  // Initialize and unlock persistent HTMLAudioElement & Web Audio Context on user interaction
  const getOrUnlockAudioPlayer = (): HTMLAudioElement => {
    if (!audioPlayerRef.current && typeof window !== 'undefined') {
      const audio = new Audio();
      audio.preload = 'auto';
      audioPlayerRef.current = audio;
    }
    if (typeof window !== 'undefined') {
      try {
        const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx && !webAudioCtxRef.current) {
          webAudioCtxRef.current = new AudioCtx();
        }
        if (webAudioCtxRef.current && webAudioCtxRef.current.state === 'suspended') {
          webAudioCtxRef.current.resume().catch(() => {});
        }
      } catch (_) {}
    }
    return audioPlayerRef.current!;
  };

  useEffect(() => {
    isLiveVoiceCallRef.current = isLiveVoiceCall;
  }, [isLiveVoiceCall]);

  useEffect(() => {
    isChatLoadingRef.current = isChatLoading;
  }, [isChatLoading]);

  useEffect(() => {
    voiceLangRef.current = voiceLang;
  }, [voiceLang]);

  useEffect(() => {
    aiVoicePersonaRef.current = aiVoicePersona;
  }, [aiVoicePersona]);

  useEffect(() => {
    activeModeRef.current = activeMode;
  }, [activeMode]);

  useEffect(() => {
    onSendChatRef.current = onSendChat;
  }, [onSendChat]);

  // Preload browser speechSynthesis voices so getVoices() is never empty on first call
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener?.('voiceschanged', handleVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener?.('voiceschanged', handleVoicesChanged);
      };
    }
  }, []);

  const currentModeConfig = AI_MODES.find((m) => m.id === activeMode) || AI_MODES[0];
  const currentLangObj = VOICE_LANGUAGES.find((l) => l.code === voiceLang) || VOICE_LANGUAGES[0];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    }
  }, [chatMessages, isChatLoading, isOpen, isExpanded]);

  useEffect(() => {
    return () => {
      stopAllAudioAndMic();
    };
  }, []);

  const stopAllAudioAndMic = () => {
    speechQueueActiveRef.current = false;
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (speechKeepAliveIntervalRef.current) {
      clearInterval(speechKeepAliveIntervalRef.current);
      speechKeepAliveIntervalRef.current = null;
    }
    if (activeBufferSourceRef.current) {
      try {
        activeBufferSourceRef.current.onended = null;
        activeBufferSourceRef.current.stop();
        activeBufferSourceRef.current.disconnect();
      } catch (_) {}
      activeBufferSourceRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (_) {}
    }
    if (audioPlayerRef.current) {
      try {
        audioPlayerRef.current.onended = null;
        audioPlayerRef.current.onerror = null;
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
      } catch (_) {}
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.stop();
      } catch (_) {}
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (_) {}
    }
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      } catch (_) {}
      mediaStreamRef.current = null;
    }
    setIsListening(false);
    setSpeakingMsgIdx(null);
  };

  const copyWithFeedback = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`✓ Copied ${label} to clipboard!`);
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 1800);
  };

  // Detect appropriate language BCP-47 tag from actual text content (Bengali, Hindi, Arabic, etc.)
  const detectSpeechLangFromText = (text: string): string => {
    if (/[\u0980-\u09FF]/.test(text)) return 'bn-BD';
    if (/[\u0900-\u097F]/.test(text)) return 'hi-IN';
    if (/[\u0600-\u06FF]/.test(text)) return 'ar-SA';
    if (/[\u3040-\u30FF\u4E00-\u9FAF]/.test(text)) return 'ja-JP';
    return voiceLangRef.current || 'en-US';
  };

  // Fallback Server-Side Audio Recorder & Gemini Multimodal Transcriber when browser Web Speech API is restricted
  const startServerAudioRecorderFallback = async (stream: MediaStream, continuousCallMode: boolean) => {
    try {
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      setIsListening(true);
      setLiveTranscriptPreview('🎙️ Listening via Neural Audio Stream... (Click Mic or pause to send)');

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        setIsListening(false);
        setLiveTranscriptPreview('⏳ Transcribing voice...');
        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        stream.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;

        if (audioBlob.size < 400) {
          setLiveTranscriptPreview('');
          return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Url = String(reader.result || '');
          try {
            const activeLangObj =
              VOICE_LANGUAGES.find((l) => l.code === voiceLangRef.current) || VOICE_LANGUAGES[0];
            const res = await fetch('/api/transcribe', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(customApiKey ? { 'x-api-key': customApiKey } : {})
              },
              body: JSON.stringify({
                audioDataUrl: base64Url,
                lang: activeLangObj.name
              })
            });
            const data = await res.json();
            setLiveTranscriptPreview('');
            const cleanSpoken = String(data?.transcript || '').trim();
            if (cleanSpoken) {
              setChatInput(cleanSpoken);
              onSendChatRef.current(cleanSpoken, activeModeRef.current, {
                voiceLang: activeLangObj.name,
                isLiveVoiceCall: true
              });
            } else if (continuousCallMode && isLiveVoiceCallRef.current && !isChatLoadingRef.current) {
              startListeningSession(true);
            }
          } catch (_) {
            setLiveTranscriptPreview('');
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      recorder.start();
      // Auto-stop after 6 seconds in hands-free mode or when user clicks mic button again
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          try {
            mediaRecorderRef.current.stop();
          } catch (_) {}
        }
      }, 6500);
    } catch (_) {
      setIsListening(false);
      setLiveTranscriptPreview('');
    }
  };

  // Start Microphone Listening (Requests hardware mic permission first, then runs Web Speech API or Neural Audio Fallback)
  const startListeningSession = async (continuousCallMode: boolean) => {
    if (typeof window === 'undefined') return;

    // Unlock audio element during user gesture
    getOrUnlockAudioPlayer();

    // Explicitly request hardware microphone permission via getUserMedia so browser prompts user & unlocks iframe mic
    let acquiredStream: MediaStream | null = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        acquiredStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = acquiredStream;
      } catch (permErr: any) {
        setIsListening(false);
        setLiveTranscriptPreview('');
        setIsLiveVoiceCall(false);
        isLiveVoiceCallRef.current = false;
        showToast('⚠️ Microphone permission required! Please click "Allow" on the browser microphone prompt.');
        return;
      }
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (acquiredStream) {
        await startServerAudioRecorderFallback(acquiredStream, continuousCallMode);
        return;
      }
      showToast('Voice conversation is supported in Chrome, Edge, and Safari.');
      return;
    }

    // Release test stream tracks before starting SpeechRecognition so both don't compete for mic on mobile
    if (acquiredStream) {
      try {
        acquiredStream.getTracks().forEach((t) => t.stop());
      } catch (_) {}
      mediaStreamRef.current = null;
    }

    // Stop any ongoing AI speech before listening to user
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (_) {}
    }
    if (audioPlayerRef.current) {
      try {
        audioPlayerRef.current.pause();
      } catch (_) {}
    }
    setSpeakingMsgIdx(null);

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.stop();
      } catch (_) {}
      recognitionRef.current = null;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = voiceLangRef.current || 'bn-BD';

      let finalCaptured = '';
      let latestInterim = '';
      let hasDispatched = false;

      const dispatchCapturedSpeech = () => {
        if (hasDispatched) return;
        const cleanSpoken = (finalCaptured + ' ' + latestInterim).replace(/\s+/g, ' ').trim();
        if (!cleanSpoken) return;
        hasDispatched = true;

        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
        try {
          recognition.onend = null;
          recognition.stop();
        } catch (_) {}

        setIsListening(false);
        setLiveTranscriptPreview('');

        const activeLangObj =
          VOICE_LANGUAGES.find((l) => l.code === voiceLangRef.current) || VOICE_LANGUAGES[0];

        // Automatically send the spoken message to the AI and get spoken reply back!
        onSendChatRef.current(cleanSpoken, activeModeRef.current, {
          voiceLang: activeLangObj.name,
          isLiveVoiceCall: true
        });
      };

      recognition.onstart = () => {
        setIsListening(true);
        setLiveTranscriptPreview('');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const chunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalCaptured += chunk + ' ';
          } else {
            interim += chunk;
          }
        }
        latestInterim = interim;
        const combined = (finalCaptured + ' ' + interim).replace(/\s+/g, ' ').trim();
        setLiveTranscriptPreview(combined);
        setChatInput(combined);

        // Smart 850ms turbo silence detector: once user pauses speaking, auto-submit immediately!
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
        if (combined.length >= 2) {
          silenceTimerRef.current = setTimeout(() => {
            dispatchCapturedSpeech();
          }, 850);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (hasDispatched) return;

        const cleanSpoken = (finalCaptured + ' ' + latestInterim).replace(/\s+/g, ' ').trim();
        setLiveTranscriptPreview('');

        if (cleanSpoken) {
          dispatchCapturedSpeech();
        } else if ((continuousCallMode || isLiveVoiceCallRef.current) && !isChatLoadingRef.current) {
          // If user hasn't spoken yet during active call, keep listening smoothly
          setTimeout(() => {
            if (isLiveVoiceCallRef.current && !isChatLoadingRef.current) {
              startListeningSession(true);
            }
          }, 450);
        }
      };

      recognition.onerror = (errEvent: any) => {
        if (errEvent?.error === 'not-allowed' || errEvent?.error === 'service-not-allowed') {
          setIsListening(false);
          setLiveTranscriptPreview('');
          setIsLiveVoiceCall(false);
          isLiveVoiceCallRef.current = false;
          showToast('⚠️ Microphone permission denied. Please allow microphone access in browser.');
        } else if (errEvent?.error === 'aborted') {
          // Intentional stop, ignore
        } else {
          setIsListening(false);
          if (isLiveVoiceCallRef.current && !isChatLoadingRef.current) {
            setTimeout(() => {
              if (isLiveVoiceCallRef.current && !isChatLoadingRef.current) {
                startListeningSession(true);
              }
            }, 500);
          }
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (_) {
      setIsListening(false);
    }
  };

  // Toggle Standard Mic Button (Speaks & Auto-Submits with Voice Reply)
  const toggleVoiceInput = () => {
    getOrUnlockAudioPlayer();
    if (isListening) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        try {
          mediaRecorderRef.current.stop();
        } catch (_) {}
        return;
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      setIsListening(false);
      return;
    }
    setAutoSpeakReplies(true);
    startListeningSession(isLiveVoiceCall);
  };

  // Toggle Hands-Free Two-Way Live Voice Call Mode
  const toggleLiveVoiceCall = () => {
    getOrUnlockAudioPlayer();
    if (isLiveVoiceCall) {
      setIsLiveVoiceCall(false);
      isLiveVoiceCallRef.current = false;
      stopAllAudioAndMic();
      showToast('📴 Live Voice Call ended.');
    } else {
      setIsLiveVoiceCall(true);
      isLiveVoiceCallRef.current = true;
      setAutoSpeakReplies(true);
      showToast(`🎙️ Live Voice Call Active (${currentLangObj.label})! Speak naturally now...`);
      setTimeout(() => {
        startListeningSession(true);
      }, 150);
    }
  };

  // Neural + Cloud + Native Multilingual Text-to-Speech Engine (Speaks AI response & auto-resumes mic in Live Call Mode)
  const speakMessageAloud = async (
    text: string,
    idx: number,
    resumeMicOnEnd: boolean = false,
    overrideVoiceName?: AiVoicePersonaId
  ) => {
    if (typeof window === 'undefined') return;

    if (speakingMsgIdx === idx && !resumeMicOnEnd && !overrideVoiceName) {
      stopAllAudioAndMic();
      return;
    }

    // Pause microphone while AI is speaking so AI doesn't hear its own voice
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch (_) {}
      setIsListening(false);
    }

    if (activeBufferSourceRef.current) {
      try {
        activeBufferSourceRef.current.onended = null;
        activeBufferSourceRef.current.stop();
        activeBufferSourceRef.current.disconnect();
      } catch (_) {}
      activeBufferSourceRef.current = null;
    }

    if (speechKeepAliveIntervalRef.current) {
      clearInterval(speechKeepAliveIntervalRef.current);
      speechKeepAliveIntervalRef.current = null;
    }

    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (_) {}
    }

    // Only strip the raw 49-comma-separated keyword list at the very bottom so 100% of the human explanation, steps, and titles are spoken aloud!
    const conversationalOnly = text
      .replace(/\*\*(?:Top 10 Priority Keywords|Full 49 SEO Keywords|Midjourney \/ Firefly Prompt)[\s\S]*$/i, '')
      .replace(/NEXT_QUESTIONS:[\s\S]*$/i, '')
      .replace(/[*#_`~>-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const cleanSpeech =
      conversationalOnly.length >= 6
        ? conversationalOnly
        : 'My friend, I have prepared your Rank 1 commercial title and all 49 SEO keywords in the card below.';

    speechQueueActiveRef.current = true;
    setSpeakingMsgIdx(idx);

    let finishedCalled = false;
    const onSpeechFinished = () => {
      if (finishedCalled) return;
      finishedCalled = true;
      speechQueueActiveRef.current = false;
      if (speechKeepAliveIntervalRef.current) {
        clearInterval(speechKeepAliveIntervalRef.current);
        speechKeepAliveIntervalRef.current = null;
      }
      setSpeakingMsgIdx(null);
      if ((resumeMicOnEnd || isLiveVoiceCallRef.current) && isOpen) {
        setTimeout(() => {
          if (isLiveVoiceCallRef.current && !isChatLoadingRef.current) {
            startListeningSession(true);
          }
        }, 300);
      }
    };

    const targetLang = detectSpeechLangFromText(cleanSpeech);
    const effectiveVoiceId: AiVoicePersonaId =
      overrideVoiceName || aiVoicePersonaRef.current || aiVoicePersona || 'Kore';
    const personaCfg =
      AI_VOICE_PERSONAS.find((v) => v.id === effectiveVoiceId) || AI_VOICE_PERSONAS[0];
    const wantMale = personaCfg.gender === 'male';

    // Comprehensive OS/Browser Male vs Female Voice Classifier
    const findDedicatedNativeGenderVoice = (langCode: string, isMale: boolean) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
      const voices = window.speechSynthesis.getVoices();
      const langPrefix = langCode.split('-')[0].toLowerCase();
      const langVoices = voices.filter((v) => v.lang.toLowerCase().startsWith(langPrefix));
      const MALE_VOICE_REGEX =
        /\b(male|man|guy|david|mark|daniel|george|james|richard|thomas|oliver|liam|noah|william|rishi|prabhat|pradeep|bashkar|hemant|madhur|niraj|sagar|sundar|subir|steffan|alex|christopher|eric|ryan|roger|brian|andrew|jacob|aaron|fred|jorge|diego|carlos|henri|thomas|stefan|conrad|maverick)\b/i;
      const FEMALE_VOICE_REGEX =
        /\b(female|woman|zira|aria|jenny|susan|hazel|catherine|helen|linda|samantha|victoria|karen|moira|tessa|veena|lekha|kalpana|swara|heera|tanishaa|nabanita|shruti|pallavi|ava|emma|sonia|natasha|claire|marie|anna|paulina|monica|lucia|kyoko)\b/i;

      // 1. First look for an exact language match with explicit gender name
      const exactGenderMatch = langVoices.find((v) => {
        const n = v.name.toLowerCase();
        return isMale ? MALE_VOICE_REGEX.test(n) : FEMALE_VOICE_REGEX.test(n);
      });
      if (exactGenderMatch) return exactGenderMatch;

      // 2. If user wants Male and the language is English or Latin-script, pick any installed system Male voice (e.g., Microsoft David / Mark / Google UK English Male)
      if (isMale && !/[\u0980-\u09FF\u0900-\u097F\u0600-\u06FF]/.test(cleanSpeech)) {
        const anyEnglishMale = voices.find(
          (v) => v.lang.toLowerCase().startsWith('en') && MALE_VOICE_REGEX.test(v.name.toLowerCase())
        );
        if (anyEnglishMale) return anyEnglishMale;
      }
      return null;
    };

    // Web Audio API True Male Baritone Formant & Pitch Synthesizer
    // Converts female-only cloud TTS streams (like Google Translate bn/hi/en) into a genuine, rich Male Baritone voice!
    const playCloudSegmentsWithMaleBaritoneDSP = async (
      segments: string[],
      persona: typeof personaCfg
    ): Promise<boolean> => {
      try {
        getOrUnlockAudioPlayer();
        const ctx = webAudioCtxRef.current;
        if (!ctx) return false;
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }

        // Distinct male pitch detune (in cents) & playback rate per Male persona so Charon, Fenrir, Puck, and Orus each have their own masculine character!
        const maleDspProfile: Record<string, { detuneCents: number; rate: number; bassBoostDb: number }> = {
          Charon: { detuneCents: -420, rate: 1.12, bassBoostDb: 5.5 }, // Deep Wise Friend
          Fenrir: { detuneCents: -480, rate: 1.15, bassBoostDb: 6.5 }, // Bold Executive
          Puck: { detuneCents: -340, rate: 1.16, bassBoostDb: 4.0 },   // Energetic Buddy
          Orus: { detuneCents: -450, rate: 1.10, bassBoostDb: 6.0 }    // Smooth Baritone
        };
        const dsp = maleDspProfile[persona.id] || maleDspProfile.Charon;

        for (let i = 0; i < segments.length; i++) {
          if (!speechQueueActiveRef.current) {
            onSpeechFinished();
            return true;
          }
          const dataUrl = segments[i];
          const base64Part = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
          const binaryStr = window.atob(base64Part);
          const bytes = new Uint8Array(binaryStr.length);
          for (let b = 0; b < binaryStr.length; b++) {
            bytes[b] = binaryStr.charCodeAt(b);
          }

          const audioBuffer = await ctx.decodeAudioData(bytes.buffer.slice(0));
          if (!speechQueueActiveRef.current) {
            onSpeechFinished();
            return true;
          }

          await new Promise<void>((resolve) => {
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            // Shift pitch down into natural male fundamental frequency (110Hz–135Hz) while keeping natural conversational speed
            source.playbackRate.value = dsp.rate;
            if ('detune' in source && source.detune) {
              source.detune.value = dsp.detuneCents;
            }

            // Warm Male Chest Resonance Filter (Low-shelf boost at 190Hz + High-shelf softening at 3600Hz to remove female treble)
            const bassFilter = ctx.createBiquadFilter();
            bassFilter.type = 'lowshelf';
            bassFilter.frequency.value = 190;
            bassFilter.gain.value = dsp.bassBoostDb;

            const trebleFilter = ctx.createBiquadFilter();
            trebleFilter.type = 'highshelf';
            trebleFilter.frequency.value = 3600;
            trebleFilter.gain.value = -4.5;

            source.connect(bassFilter);
            bassFilter.connect(trebleFilter);
            trebleFilter.connect(ctx.destination);

            activeBufferSourceRef.current = source;
            source.onended = () => {
              if (activeBufferSourceRef.current === source) {
                activeBufferSourceRef.current = null;
              }
              resolve();
            };
            source.start(0);
          });
        }

        onSpeechFinished();
        return true;
      } catch (_) {
        return false;
      }
    };

    // 1. Try Server-Side Gemini 3.8 Neural TTS / Full-Length Multi-Segment Cloud Audio Queue
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(customApiKey ? { 'x-api-key': customApiKey.trim() } : {})
        },
        body: JSON.stringify({
          text: cleanSpeech,
          voiceName: effectiveVoiceId,
          lang: targetLang
        })
      });
      if (res.ok) {
        const data = await res.json();
        const segments: string[] =
          Array.isArray(data.audioSegments) && data.audioSegments.length > 0
            ? data.audioSegments
            : data.audioDataUrl
            ? [data.audioDataUrl]
            : [];

        if (segments.length > 0) {
          // CRITICAL FIX: If the server fell back to 'cloud-multilingual-tts' (which is always a Female voice),
          // NEVER play it raw when the user selected a Male voice!
          if (data.engine === 'cloud-multilingual-tts' && wantMale) {
            // Option A: If the user's device has a dedicated native Male voice for this language, use it!
            const nativeMaleVoice = findDedicatedNativeGenderVoice(targetLang, true);
            if (nativeMaleVoice) {
              fallbackBrowserSpeech(cleanSpeech, onSpeechFinished, effectiveVoiceId);
              return;
            }
            // Option B: Otherwise, transform the cloud stream through our Web Audio Male Baritone Formant & Pitch DSP!
            const dspPlayed = await playCloudSegmentsWithMaleBaritoneDSP(segments, personaCfg);
            if (dspPlayed) {
              return;
            }
          }

          const audio = getOrUnlockAudioPlayer();
          audio.pause();

          // Play every segment sequentially from first to last so long answers NEVER stop halfway!
          let segIdx = 0;
          const playNextSegment = async () => {
            if (!speechQueueActiveRef.current || segIdx >= segments.length) {
              onSpeechFinished();
              return;
            }
            audio.src = segments[segIdx];
            if (data.engine === 'cloud-multilingual-tts' && wantMale) {
              // Last-resort HTMLAudio pitch shift if WebAudio was unavailable
              (audio as any).preservesPitch = false;
              (audio as any).mozPreservesPitch = false;
              (audio as any).webkitPreservesPitch = false;
              audio.playbackRate = 0.84;
            } else {
              (audio as any).preservesPitch = true;
              (audio as any).mozPreservesPitch = true;
              (audio as any).webkitPreservesPitch = true;
              audio.playbackRate = data.engine === 'gemini-neural-tts' ? personaCfg.rate : 1.03;
            }

            audio.onended = () => {
              segIdx += 1;
              if (segIdx < segments.length && speechQueueActiveRef.current) {
                playNextSegment();
              } else {
                onSpeechFinished();
              }
            };
            audio.onerror = () => {
              segIdx += 1;
              if (segIdx < segments.length && speechQueueActiveRef.current) {
                playNextSegment();
              } else {
                fallbackBrowserSpeech(cleanSpeech, onSpeechFinished, effectiveVoiceId);
              }
            };

            try {
              await audio.play();
            } catch (_) {
              fallbackBrowserSpeech(cleanSpeech, onSpeechFinished, effectiveVoiceId);
            }
          };

          await playNextSegment();
          return;
        }
      }
    } catch (_) {
      // Fallback to native browser SpeechSynthesis
    }

    fallbackBrowserSpeech(cleanSpeech, onSpeechFinished, effectiveVoiceId);
  };

  // Sentence-by-Sentence Chained Native Speech Engine (Bypasses Chrome's 15-second / 200-char cutoff bug so 100% of long text is read!)
  const fallbackBrowserSpeech = (
    cleanSpeech: string,
    onDone: () => void,
    overrideVoiceId?: AiVoicePersonaId
  ) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onDone();
      return;
    }
    try {
      const effectiveVoiceId: AiVoicePersonaId =
        overrideVoiceId || aiVoicePersonaRef.current || aiVoicePersona || 'Kore';
      const personaCfg =
        AI_VOICE_PERSONAS.find((v) => v.id === effectiveVoiceId) || AI_VOICE_PERSONAS[0];
      window.speechSynthesis.cancel();
      const targetLang = detectSpeechLangFromText(cleanSpeech);

      const voices = window.speechSynthesis.getVoices();
      const langPrefix = targetLang.split('-')[0].toLowerCase();
      const langVoices = voices.filter((v) => v.lang.toLowerCase().startsWith(langPrefix));
      const wantMale = personaCfg.gender === 'male';

      const MALE_VOICE_REGEX =
        /\b(male|man|guy|david|mark|daniel|george|james|richard|thomas|oliver|liam|noah|william|rishi|prabhat|pradeep|bashkar|hemant|madhur|niraj|sagar|sundar|subir|steffan|alex|christopher|eric|ryan|roger|brian|andrew|jacob|aaron|fred|jorge|diego|carlos|henri|stefan|conrad|maverick)\b/i;
      const FEMALE_VOICE_REGEX =
        /\b(female|woman|zira|aria|jenny|susan|hazel|catherine|helen|linda|samantha|victoria|karen|moira|tessa|veena|lekha|kalpana|swara|heera|tanishaa|nabanita|shruti|pallavi|ava|emma|sonia|natasha|claire|marie|anna|paulina|monica|lucia|kyoko)\b/i;

      const genderMatched =
        langVoices.find((v) => {
          const n = v.name.toLowerCase();
          return wantMale ? MALE_VOICE_REGEX.test(n) : FEMALE_VOICE_REGEX.test(n);
        }) ||
        (wantMale && !/[\u0980-\u09FF\u0900-\u097F\u0600-\u06FF]/.test(cleanSpeech)
          ? voices.find(
              (v) => v.lang.toLowerCase().startsWith('en') && MALE_VOICE_REGEX.test(v.name.toLowerCase())
            )
          : undefined);

      // If user wants Male and there's no explicitly named Male voice in langVoices, avoid picking a known Female voice if another neutral voice exists
      const nonFemaleLangVoice = wantMale
        ? langVoices.find((v) => !FEMALE_VOICE_REGEX.test(v.name.toLowerCase()))
        : undefined;

      const matchedVoice =
        genderMatched ||
        nonFemaleLangVoice ||
        voices.find((v) => v.lang.toLowerCase() === targetLang.toLowerCase()) ||
        langVoices[0] ||
        voices.find((v) => v.default);

      // Split into <= 165 character sentence chunks so Chrome SpeechSynthesis NEVER times out at 15 seconds
      const rawSentences = cleanSpeech
        .slice(0, 4500)
        .split(/(?<=[।.!?;\n])\s+/)
        .map((s) => s.trim())
        .filter(Boolean);

      const chunks: string[] = [];
      for (const s of rawSentences) {
        if (s.length <= 165) {
          chunks.push(s);
        } else {
          const words = s.split(/\s+/);
          let cur = '';
          for (const w of words) {
            if ((cur + ' ' + w).trim().length <= 165) {
              cur = (cur + ' ' + w).trim();
            } else {
              if (cur) chunks.push(cur);
              cur = w.slice(0, 165);
            }
          }
          if (cur) chunks.push(cur);
        }
      }

      if (chunks.length === 0) {
        onDone();
        return;
      }

      // Chrome 15-second SpeechSynthesis keep-alive watchdog
      if (speechKeepAliveIntervalRef.current) {
        clearInterval(speechKeepAliveIntervalRef.current);
      }
      speechKeepAliveIntervalRef.current = setInterval(() => {
        if (
          speechQueueActiveRef.current &&
          typeof window !== 'undefined' &&
          'speechSynthesis' in window &&
          window.speechSynthesis.speaking
        ) {
          try {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          } catch (_) {}
        }
      }, 9000);

      let cIdx = 0;
      const speakNextSentence = () => {
        if (!speechQueueActiveRef.current || cIdx >= chunks.length) {
          onDone();
          return;
        }
        const utterance = new SpeechSynthesisUtterance(chunks[cIdx]);
        utterance.lang = matchedVoice?.lang || targetLang;
        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }
        // If no dedicated male voice was found on the OS, shift pitch down to 0.72 so even a default system voice sounds distinctly Male!
        utterance.pitch = genderMatched
          ? personaCfg.pitch
          : wantMale
          ? 0.72
          : personaCfg.pitch;
        utterance.rate = personaCfg.rate;

        utterance.onend = () => {
          cIdx += 1;
          if (cIdx < chunks.length && speechQueueActiveRef.current) {
            speakNextSentence();
          } else {
            onDone();
          }
        };
        utterance.onerror = () => {
          cIdx += 1;
          if (cIdx < chunks.length && speechQueueActiveRef.current) {
            speakNextSentence();
          } else {
            onDone();
          }
        };
        window.speechSynthesis.speak(utterance);
      };

      speakNextSentence();
    } catch (_) {
      onDone();
    }
  };

  // Automatically speak new AI responses when Live Voice Call or Auto-Speak is enabled
  useEffect(() => {
    if (!isOpen) return;
    if (chatMessages.length > lastSpokenMsgCountRef.current) {
      const newestIndex = chatMessages.length - 1;
      const newestMsg = chatMessages[newestIndex];
      lastSpokenMsgCountRef.current = chatMessages.length;

      if (newestMsg && newestMsg.role === 'model' && (isLiveVoiceCall || autoSpeakReplies)) {
        const textPart = Array.isArray(newestMsg.parts)
          ? newestMsg.parts.find((p: any) => typeof p?.text === 'string')?.text
          : '';
        if (textPart && !textPart.startsWith('⚠️ Error:')) {
          speakMessageAloud(textPart, newestIndex, isLiveVoiceCall);
        }
      }
    } else {
      lastSpokenMsgCountRef.current = chatMessages.length;
    }
  }, [chatMessages, isLiveVoiceCall, autoSpeakReplies, isOpen]);

  // Manual Listen Button Handler
  const toggleSpeakMessage = (text: string, idx: number) => {
    speakMessageAloud(text, idx, false);
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
    showToast(`✓ Downloaded ${prefix} CSV directly from Contributor Studio Desk!`);
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
            className={`relative flex flex-col overflow-hidden sovereign-prism-card transition-all duration-300 border ${
              isExpanded
                ? 'w-[96vw] sm:w-[900px] lg:w-[1100px] h-[88vh] max-h-[880px] rounded-3xl shadow-[0_35px_120px_rgba(0,0,0,0.95)]'
                : 'w-[95vw] sm:w-[480px] md:w-[540px] h-[680px] sm:h-[720px] max-h-[90vh] rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.95)]'
            } ${
              isLight
                ? 'bg-white border-neutral-300 text-neutral-900 shadow-2xl'
                : 'bg-[#011710] border-emerald-500/35 text-neutral-100 shadow-[0_0_60px_rgba(244,42,65,0.25)]'
            }`}
          >
            {/* Drag & Drop Visual Overlay */}
            {isDragOverChat && (
              <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md border-2 border-dashed border-emerald-400 rounded-3xl flex flex-col items-center justify-center p-8 text-center pointer-events-none">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 mb-3 animate-bounce">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <p className="text-base font-bold text-white">Drop Visual Asset for Instant 49-Tag Vision SEO</p>
                <p className="text-xs text-emerald-300 mt-1">Generates Subject-First Title (&lt;70c) + Top 10 Weighted Tags</p>
              </div>
            )}

            {/* =================================================================== */}
            {/* 1. EXECUTIVE COMMAND HEADER (CLEAN, SPACIOUS, ZERO CLUTTER)         */}
            {/* =================================================================== */}
            <div
              className={`px-5 py-4 border-b flex items-center justify-between gap-3 z-20 ${
                isLight ? 'bg-white border-neutral-200' : 'bg-[#021f17] border-emerald-500/20'
              }`}
            >
              {/* Left: Identity & Engine Status */}
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
                  isLight
                    ? 'bg-neutral-900 text-white border-neutral-700 shadow-sm'
                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35 shadow-[0_0_15px_rgba(16,185,129,0.22)]'
                }`}>
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[13.5px] font-bold tracking-tight truncate ${isLight ? 'text-neutral-950' : 'text-white'}`}>
                      AI Contributor Director 🇧🇩
                    </span>
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0 shadow-[0_0_6px_#f43f5e]" />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5 truncate font-sans">
                    <span className="text-emerald-300 font-semibold">{currentModeConfig.shortLabel}</span>
                    <span className="opacity-40">·</span>
                    <span className="text-neutral-300">{currentLangObj.name}</span>
                    <span className="opacity-40">·</span>
                    <span className="text-rose-400 font-mono font-medium">Lal-Sobuj Edition</span>
                  </div>
                </div>
              </div>

              {/* Right: Clean Action Controls with Adequate Spacing */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Engine Deck Switcher Pill */}
                <button
                  type="button"
                  onClick={() => {
                    setShowControlPanel((prev) => !prev);
                    setShowChatHistorySidebar(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    showControlPanel
                      ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                      : isLight
                      ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-800'
                      : 'bg-emerald-950/40 hover:bg-emerald-900/50 border-emerald-500/30 text-emerald-200'
                  }`}
                  title="Configure AI Specialist Engines, Voice & Grounding Settings"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Engines</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showControlPanel ? 'rotate-180 text-emerald-400' : 'text-neutral-400'}`} />
                </button>

                {/* Live Voice Call Button */}
                <button
                  type="button"
                  onClick={toggleLiveVoiceCall}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    isLiveVoiceCall
                      ? 'bg-rose-500 text-white border-rose-400 shadow-[0_0_16px_rgba(244,63,94,0.5)] animate-pulse'
                      : isLight
                      ? 'bg-neutral-900 text-white border-neutral-900 hover:bg-black'
                      : 'bg-rose-500/15 text-rose-300 border-rose-500/40 hover:bg-rose-500/25'
                  }`}
                  title={isLiveVoiceCall ? 'End Hands-Free Voice Conversation' : 'Start Hands-Free Two-Way Voice Call'}
                >
                  {isLiveVoiceCall ? <PhoneOff className="w-3.5 h-3.5" /> : <PhoneCall className="w-3.5 h-3.5 text-rose-400" />}
                  <span className="hidden sm:inline">{isLiveVoiceCall ? 'End Call' : 'Voice'}</span>
                </button>

                {/* History Vault Button */}
                <button
                  type="button"
                  onClick={() => {
                    setShowChatHistorySidebar((prev) => !prev);
                    setShowControlPanel(false);
                  }}
                  className={`p-2 rounded-xl border transition cursor-pointer ${
                    showChatHistorySidebar
                      ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                      : isLight
                      ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-700'
                      : 'bg-emerald-950/40 hover:bg-emerald-900/50 border-emerald-500/30 text-emerald-200'
                  }`}
                  title="Conversation History Vault"
                >
                  <Clock className="w-3.5 h-3.5" />
                </button>

                {/* New Chat Button */}
                <button
                  type="button"
                  onClick={onStartNewChat}
                  className={`p-2 rounded-xl border transition cursor-pointer ${
                    isLight
                      ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-700'
                      : 'bg-white/[0.06] hover:bg-white/[0.12] border-white/12 text-neutral-300'
                  }`}
                  title="Start New Conversation"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>

                {/* Expand / Minimize */}
                <button
                  type="button"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className={`p-2 rounded-xl border transition cursor-pointer ${
                    isLight
                      ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-700'
                      : 'bg-white/[0.06] hover:bg-white/[0.12] border-white/12 text-neutral-300'
                  }`}
                  title={isExpanded ? 'Compact View' : 'Expand Full Studio View'}
                >
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  className={`p-2 rounded-xl transition cursor-pointer ${
                    isLight
                      ? 'text-neutral-500 hover:text-black hover:bg-neutral-100'
                      : 'text-neutral-400 hover:text-white hover:bg-white/10'
                  }`}
                  title="Close Assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* =================================================================== */}
            {/* 2. ADVANCED 2-TAB CONTROL DECK: ENGINES & VOICE MATRIX             */}
            {/* =================================================================== */}
            <AnimatePresence>
              {showControlPanel && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`border-b overflow-hidden z-20 ${
                    isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#050508] border-white/10'
                  }`}
                >
                  <div className="p-4 sm:p-5 space-y-4">
                    {/* Top Segmented Tab Switcher */}
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center p-1 rounded-xl bg-white/[0.05] border border-white/10">
                        <button
                          type="button"
                          onClick={() => setControlPanelTab('engines')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                            controlPanelTab === 'engines'
                              ? 'bg-cyan-500 text-black shadow-sm'
                              : 'text-neutral-300 hover:text-white'
                          }`}
                        >
                          12 Specialist Engines
                        </button>
                        <button
                          type="button"
                          onClick={() => setControlPanelTab('voice')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                            controlPanelTab === 'voice'
                              ? 'bg-cyan-500 text-black shadow-sm'
                              : 'text-neutral-300 hover:text-white'
                          }`}
                        >
                          Voice, Persona &amp; Grounding
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const next = !deepMastermindMode;
                            setDeepMastermindMode(next);
                            showToast(next ? '🧠 Deep Mastermind: ON (100% Unfiltered Secrets)' : 'Standard Mode');
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-bold border transition cursor-pointer ${
                            deepMastermindMode
                              ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                              : 'bg-white/[0.04] border-white/10 text-neutral-400'
                          }`}
                          title="Reveals 100% unfiltered insider formulas and real numbers"
                        >
                          {deepMastermindMode ? '🧠 Deep Mastermind: ON' : '🧠 Deep: OFF'}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const next = !webSearchGrounding;
                            setWebSearchGrounding(next);
                            showToast(next ? '🌐 Live Google Search Grounding: ON' : 'Web Search: OFF');
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-bold border transition cursor-pointer ${
                            webSearchGrounding
                              ? 'bg-sky-500/20 border-sky-400/50 text-sky-300'
                              : 'bg-white/[0.04] border-white/10 text-neutral-400'
                          }`}
                          title="Ground answers with live 2026 Google Web Search"
                        >
                          {webSearchGrounding ? '🌐 Web Search: ON' : '🌐 Web Search'}
                        </button>
                      </div>
                    </div>

                    {/* Tab 1: 12 Specialist Engines Grid */}
                    {controlPanelTab === 'engines' && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto pr-1">
                        {AI_MODES.map((m) => {
                          const isSelected = activeMode === m.id;
                          const IconComp = m.icon;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => {
                                setActiveMode(m.id);
                                setShowControlPanel(false);
                                showToast(`⚡ Switched to ${m.label}`);
                              }}
                              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                isSelected
                                  ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                                  : isLight
                                  ? 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                                  : 'bg-[#000000] hover:bg-white/[0.05] border-white/10 text-neutral-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <IconComp className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-neutral-400'}`} />
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                              </div>
                              <div className="mt-2">
                                <div className="text-xs font-bold leading-tight truncate">{m.shortLabel}</div>
                                <div className="text-[10px] text-neutral-400 truncate mt-0.5">{m.label.split('(')[0]}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Tab 2: Voice, Persona & Grounding Matrix */}
                    {controlPanelTab === 'voice' && (
                      <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[11px] font-mono text-cyan-400 font-bold block mb-1">
                              🌐 Language &amp; Dialect (12 Languages)
                            </label>
                            <select
                              value={voiceLang}
                              onChange={(e) => {
                                const nextLang = e.target.value;
                                setVoiceLang(nextLang);
                                const found = VOICE_LANGUAGES.find((l) => l.code === nextLang);
                                showToast(`🌐 Voice & AI Language set to ${found?.name || nextLang}`);
                              }}
                              className="w-full text-xs font-semibold rounded-xl px-3 py-2 bg-neutral-900 border border-white/15 text-white focus:outline-none cursor-pointer"
                            >
                              {VOICE_LANGUAGES.map((lang) => (
                                <option key={lang.code} value={lang.code}>
                                  {lang.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] font-mono text-cyan-400 font-bold block mb-1">
                              🎙️ AI Voice Persona (Female &amp; Male)
                            </label>
                            <select
                              value={aiVoicePersona}
                              onChange={(e) => {
                                const nextVoice = e.target.value as AiVoicePersonaId;
                                aiVoicePersonaRef.current = nextVoice;
                                setAiVoicePersona(nextVoice);
                                getOrUnlockAudioPlayer();
                                const vObj = AI_VOICE_PERSONAS.find((v) => v.id === nextVoice);
                                showToast(`🎙️ Switched to ${vObj?.label || nextVoice}`);
                              }}
                              className="w-full text-xs font-semibold rounded-xl px-3 py-2 bg-neutral-900 border border-white/15 text-amber-300 focus:outline-none cursor-pointer"
                            >
                              <optgroup label="♀ Female Voices (Warm & Expressive)">
                                {AI_VOICE_PERSONAS.filter((v) => v.gender === 'female').map((v) => (
                                  <option key={v.id} value={v.id}>
                                    {v.label}
                                  </option>
                                ))}
                              </optgroup>
                              <optgroup label="♂ Male Voices (Deep & Confident)">
                                {AI_VOICE_PERSONAS.filter((v) => v.gender === 'male').map((v) => (
                                  <option key={v.id} value={v.id}>
                                    {v.label}
                                  </option>
                                ))}
                              </optgroup>
                            </select>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3 flex-wrap">
                          <button
                            type="button"
                            onClick={() => {
                              const sampleText = 'Hello! I am your Contributor Studio Director. You can consult with me on commercial stock metadata, Adobe Stock approval, and Google monetization.';
                              speakMessageAloud(sampleText, -99, false);
                            }}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                              speakingMsgIdx === -99
                                ? 'bg-amber-500 text-black border-amber-400 animate-pulse'
                                : 'bg-white/[0.06] hover:bg-white/[0.12] border-white/12 text-amber-300'
                            }`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{speakingMsgIdx === -99 ? 'Speaking Sample...' : 'Test Voice Persona'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const next = !autoSpeakReplies;
                              setAutoSpeakReplies(next);
                              if (!next) {
                                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                                  window.speechSynthesis.cancel();
                                }
                                setSpeakingMsgIdx(null);
                              }
                              showToast(next ? '🔊 AI Auto-Voice Reply: ON' : '🔇 AI Auto-Voice Reply: OFF');
                            }}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                              autoSpeakReplies
                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                : 'bg-white/[0.04] border-white/10 text-neutral-400'
                            }`}
                          >
                            {autoSpeakReplies ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                            <span>{autoSpeakReplies ? 'Auto-Voice: ON' : 'Auto-Voice: OFF'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* =================================================================== */}
            {/* 3. LIVE TWO-WAY VOICE CALL BANNER (ONLY VISIBLE WHEN CALL ACTIVE)   */}
            {/* =================================================================== */}
            {isLiveVoiceCall && (
              <div
                className={`px-3.5 py-2 border-b flex items-center justify-between gap-3 z-10 ${
                  isLight
                    ? 'bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white border-emerald-500/40'
                    : 'bg-gradient-to-r from-emerald-950/95 via-[#0a131a] to-emerald-950/95 text-white border-emerald-500/40'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400/50 shrink-0">
                    <Radio
                      className={`w-3.5 h-3.5 ${
                        isListening
                          ? 'text-rose-400 animate-ping'
                          : speakingMsgIdx !== null
                          ? 'text-amber-400 animate-bounce'
                          : 'text-emerald-400 animate-pulse'
                      }`}
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10.5px] font-extrabold tracking-wide text-emerald-300 block truncate">
                      {isListening
                        ? `🎙️ Listening (${currentLangObj.label})... Speak now`
                        : isChatLoading
                        ? '⚡ AI Formulating Voice Reply...'
                        : speakingMsgIdx !== null
                        ? '🔊 AI Speaking Reply Aloud...'
                        : '🎙️ Live Two-Way Voice Ready'}
                    </span>
                    <p className="text-[9.5px] text-neutral-300 truncate">
                      {liveTranscriptPreview
                        ? `"${liveTranscriptPreview}"`
                        : 'Speak naturally — I will reply aloud automatically'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {!isListening && !isChatLoading && (
                    <button
                      type="button"
                      onClick={() => startListeningSession(true)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[10px] cursor-pointer transition"
                    >
                      Speak
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={toggleLiveVoiceCall}
                    className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-[10px] cursor-pointer transition"
                  >
                    End
                  </button>
                </div>
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

              {/* Chat Messages Feed */}
              <div
                onClick={() => {
                  if (showChatHistorySidebar) setShowChatHistorySidebar(false);
                  if (showControlPanel) setShowControlPanel(false);
                }}
                className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-sm leading-relaxed"
              >
                {/* Live Workbench Direct Sync Dock (If user has uploaded files in the workspace) */}
                {activeWorkspaceAsset && (
                  <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 shadow-lg ${
                    isLight
                      ? 'bg-neutral-50 border-neutral-300 text-neutral-900'
                      : 'bg-emerald-950/40 border-emerald-500/35 text-white shadow-[0_0_30px_rgba(16,185,129,0.15)]'
                  }`}>
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                            WORKBENCH ASSET CONNECTED
                          </span>
                          <span className="text-[10.5px] px-2 py-0.5 rounded bg-white/10 text-neutral-300 font-mono">
                            {totalQueueCount} in Queue
                          </span>
                        </div>
                        <div className="text-xs sm:text-sm font-bold truncate mt-0.5 text-white">
                          {activeWorkspaceAsset.fileName}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const prompt = activeWorkspaceAsset.title
                          ? `Audit and upgrade my active Studio asset "${activeWorkspaceAsset.fileName}" (Current Title: "${activeWorkspaceAsset.title}"). Give me a higher-converting Rank #1 Title (<70 chars), Top 10 Priority Keywords, and Full 49 SEO Keywords.`
                          : `Generate Rank #1 Title (<70 chars), Top 10 Priority Keywords, and Full 49 SEO Keywords for my active Studio asset "${activeWorkspaceAsset.fileName}".`;
                        onSendChat(prompt, 'vision_seo');
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold lal-sobuj-glow-button flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Calibrate 2026 Title &amp; 49 Tags</span>
                    </button>
                  </div>
                )}

                {/* Advanced Executive Presets & Launch Matrix (When conversation is new) */}
                {chatMessages.length <= 1 && (
                  <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 ${
                    isLight
                      ? 'bg-neutral-50 border-neutral-300'
                      : 'bg-[#000000] border-white/12 shadow-xl'
                  }`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>EXECUTIVE WORKSTATION PRESETS · 2026 ENGINE</span>
                      </div>
                      <span className="text-[11px] font-mono text-neutral-400">1-Click Fast Launch</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() =>
                          onSendChat(
                            'Generate Adobe Stock 2026 compliant subject-first title (<70 chars) and 49 weighted keywords for my visual asset.',
                            'vision_seo'
                          )
                        }
                        className="p-3.5 rounded-2xl border text-left transition-all cursor-pointer bg-white/[0.03] hover:bg-white/[0.08] border-white/10 hover:border-emerald-400/50 group"
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-white group-hover:text-emerald-300 transition">
                          <Eye className="w-4 h-4 text-emerald-400" />
                          <span>Vision 49-Tag Calibrator</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                          Subject-first title (&lt;70c) + top 10 search priority slot locks.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onSendChat(
                            'Audit my stock asset title and keywords for Adobe Stock rejection reasons, trademark violations, and AI disclosure requirements.',
                            'audit_doctor'
                          )
                        }
                        className="p-3.5 rounded-2xl border text-left transition-all cursor-pointer bg-white/[0.03] hover:bg-white/[0.08] border-white/10 hover:border-rose-400/50 group"
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-white group-hover:text-rose-300 transition">
                          <ShieldCheck className="w-4 h-4 text-rose-400" />
                          <span>Rejection &amp; Trademark Shield</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                          Detect trademark bans, duplicate stem penalties, and technical faults.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onSendChat(
                            'Which commercial microstock themes and high-CPC Google AdSense keywords are paying contributors the highest monthly royalties right now?',
                            'earning_advisor'
                          )
                        }
                        className="p-3.5 rounded-2xl border text-left transition-all cursor-pointer bg-white/[0.03] hover:bg-white/[0.08] border-white/10 hover:border-amber-400/50 group"
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-white group-hover:text-amber-300 transition">
                          <DollarSign className="w-4 h-4 text-amber-400" />
                          <span>Google AdSense &amp; High-RPM Niches</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                          Highest paying buyer-intent search themes and $1,000/mo roadmap.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onSendChat(
                            'Generate 7-Agency Universal Metadata Matrix for Adobe Stock, Shutterstock, Freepik, Getty Images, and Vecteezy.',
                            'multi_agency_5x'
                          )
                        }
                        className="p-3.5 rounded-2xl border text-left transition-all cursor-pointer bg-white/[0.03] hover:bg-white/[0.08] border-white/10 hover:border-sky-400/50 group"
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-white group-hover:text-sky-300 transition">
                          <Layers className="w-4 h-4 text-sky-400" />
                          <span>7-Agency Universal Matrix</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                          Universal title &amp; 49 tags adapted to every major stock agency.
                        </p>
                      </button>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-3 flex-wrap">
                      <button
                        type="button"
                        onClick={() => chatFileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span>Upload Visual Asset (EPS, AI, PSD, JPG, 4K)</span>
                      </button>

                      <div className="text-[11px] text-neutral-400 font-mono">
                        Supports Drag &amp; Drop anywhere in chat
                      </div>
                    </div>
                  </div>
                )}

                {chatMessages.map((msg, i) => {
                  const isUser = msg.role === 'user';
                  const textPartObj = Array.isArray(msg.parts)
                    ? msg.parts.find((p: any) => typeof p?.text === 'string')
                    : null;
                  const textContent = textPartObj?.text || msg.parts?.[0]?.text || '';
                  const imgPreview = msg.imagePreview;
                  const generatedImageUrl = msg.generatedImageUrl;
                  const structuredMeta: StructuredChatMetadata | undefined = msg.generatedMetadata;
                  const activeCardTab = cardTabMap[i] || 'titles';

                  return (
                    <div
                      key={i}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`${
                          isExpanded ? 'max-w-[82%]' : 'max-w-[92%]'
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
                        )}

                        {/* Message Text with Rich Bold & Section Highlighting */}
                        <div className="leading-relaxed space-y-1.5">
                          {textContent.split('\n').map((line: string, lIdx: number) => {
                            const trimmed = line.trim();
                            if (!trimmed) return <div key={lIdx} className="h-1" />;
                            // Render bold **segments** cleanly
                            const parts = line.split(/(\*\*[^*]+\*\*)/g);
                            return (
                              <div key={lIdx} className="leading-[1.65]">
                                {parts.map((part: string, pIdx: number) => {
                                  if (part.startsWith('**') && part.endsWith('**')) {
                                    return (
                                      <strong
                                        key={pIdx}
                                        className={
                                          isUser
                                            ? 'font-extrabold'
                                            : isLight
                                            ? 'font-bold text-neutral-950'
                                            : 'font-bold text-amber-300'
                                        }
                                      >
                                        {part.slice(2, -2)}
                                      </strong>
                                    );
                                  }
                                  return <span key={pIdx}>{part}</span>;
                                })}
                              </div>
                            );
                          })}
                        </div>

                        {/* Live Google Search Grounding Sources (if present) */}
                        {!isUser && Array.isArray(msg.groundingSources) && msg.groundingSources.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-neutral-200/60 dark:border-neutral-800 flex flex-wrap items-center gap-1.5">
                            <span className="text-[9.5px] font-mono uppercase tracking-wider text-sky-400 font-bold">
                              🌐 Live Web Sources:
                            </span>
                            {msg.groundingSources.map((src: { title: string; uri: string }, sIdx: number) => (
                              <a
                                key={sIdx}
                                href={src.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[9.5px] px-2 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:underline truncate max-w-[180px]"
                              >
                                {src.title}
                              </a>
                            ))}
                          </div>
                        )}

                        {/* =================================================================== */}
                        {/* ORGANIZED 3-TAB METADATA WORKSTATION CARD (ZERO CLUTTER)            */}
                        {/* =================================================================== */}
                        {!isUser && structuredMeta && (
                          <div
                            className={`mt-3 rounded-xl border overflow-hidden ${
                              isLight
                                ? 'bg-[#f8f6f2] border-neutral-200/90 text-neutral-900'
                                : 'bg-[#090c12] border-white/10 text-neutral-100'
                            }`}
                          >
                            {/* Card Header: Telemetry Badges & Segmented Tab Switcher */}
                            <div className="px-3 py-2 border-b border-neutral-200/70 dark:border-white/10 flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-1.5">
                                <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono text-[9px] font-bold">
                                  SEO {structuredMeta.seoScore || 99}%
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 font-mono text-[9px] font-bold">
                                  {structuredMeta.title.length}/70c
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-mono text-[9px] font-bold">
                                  {structuredMeta.all49Keywords.length} Tags
                                </span>
                              </div>

                              {/* 3 Clean Tabs: Titles | Top Tags | Export */}
                              <div
                                className={`flex items-center p-0.5 rounded-lg border ${
                                  isLight ? 'bg-neutral-200/70 border-neutral-300' : 'bg-neutral-900 border-neutral-800'
                                }`}
                              >
                                {(
                                  [
                                    { id: 'titles', label: 'Titles' },
                                    { id: 'tags', label: 'Top 10 & 49 Tags' },
                                    { id: 'export', label: 'CSV & Studio' }
                                  ] as const
                                ).map((tab) => (
                                  <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() =>
                                      setCardTabMap((prev) => ({ ...prev, [i]: tab.id }))
                                    }
                                    className={`px-2 py-0.5 rounded-md text-[9.5px] font-bold transition cursor-pointer ${
                                      activeCardTab === tab.id
                                        ? isLight
                                          ? 'bg-white text-neutral-950 shadow-2xs'
                                          : 'bg-emerald-500 text-slate-950'
                                        : 'text-neutral-400 hover:text-neutral-200'
                                    }`}
                                  >
                                    {tab.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Tab Body */}
                            <div className="p-3 space-y-2">
                              {activeCardTab === 'titles' && (
                                <div className="space-y-1.5">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      copyWithFeedback(
                                        structuredMeta.title,
                                        `t_main_${i}`,
                                        'Adobe Stock Title (<70 chars)'
                                      )
                                    }
                                    className={`w-full text-left px-2.5 py-1.5 rounded-lg border text-[10.5px] flex items-center justify-between gap-2 transition cursor-pointer ${
                                      isLight
                                        ? 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-900'
                                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-100'
                                    }`}
                                  >
                                    <span className="truncate">
                                      <strong className="text-amber-400">Adobe (&lt;70c):</strong>{' '}
                                      {structuredMeta.title}
                                    </span>
                                    <Copy className="w-3 h-3 shrink-0 text-amber-400" />
                                  </button>

                                  {structuredMeta.alternativeTitles && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          copyWithFeedback(
                                            structuredMeta.alternativeTitles!.b2bCommercial,
                                            `t_b2b_${i}`,
                                            'B2B Enterprise Title'
                                          )
                                        }
                                        className={`w-full text-left px-2.5 py-1.5 rounded-lg border text-[10.5px] flex items-center justify-between gap-2 transition cursor-pointer ${
                                          isLight
                                            ? 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-900'
                                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-100'
                                        }`}
                                      >
                                        <span className="truncate">
                                          <strong className="text-cyan-400">B2B / Getty:</strong>{' '}
                                          {structuredMeta.alternativeTitles.b2bCommercial}
                                        </span>
                                        <Copy className="w-3 h-3 shrink-0 text-cyan-400" />
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          copyWithFeedback(
                                            structuredMeta.alternativeTitles!.editorialStory,
                                            `t_shutter_${i}`,
                                            'Shutterstock Description'
                                          )
                                        }
                                        className={`w-full text-left px-2.5 py-1.5 rounded-lg border text-[10.5px] flex items-center justify-between gap-2 transition cursor-pointer ${
                                          isLight
                                            ? 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-900'
                                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-100'
                                        }`}
                                      >
                                        <span className="truncate">
                                          <strong className="text-emerald-400">Shutterstock:</strong>{' '}
                                          {structuredMeta.alternativeTitles.editorialStory}
                                        </span>
                                        <Copy className="w-3 h-3 shrink-0 text-emerald-400" />
                                      </button>
                                    </>
                                  )}

                                  {/* Quick Primary Copy Bar */}
                                  <div className="grid grid-cols-2 gap-1.5 pt-1">
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
                                      <Copy className="w-3 h-3 text-amber-400" />
                                      <span>Copy Primary Title</span>
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
                                      className="px-2.5 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-[10px] font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                                    >
                                      <Copy className="w-3 h-3" />
                                      <span>Copy All 49 Tags</span>
                                    </button>
                                  </div>
                                </div>
                              )}

                              {activeCardTab === 'tags' && (
                                <div className="space-y-2">
                                  <div className="flex flex-wrap gap-1">
                                    {structuredMeta.top10Keywords.slice(0, 10).map((kw, kIdx) => (
                                      <button
                                        key={kIdx}
                                        type="button"
                                        onClick={() =>
                                          copyWithFeedback(
                                            kw,
                                            `kw_${i}_${kIdx}`,
                                            `Slot #${kIdx + 1}: "${kw}"`
                                          )
                                        }
                                        className={`px-2 py-0.5 rounded-md text-[9.5px] font-medium border transition cursor-pointer flex items-center gap-1 ${
                                          kIdx === 0
                                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                                            : isLight
                                            ? 'bg-white border-neutral-200 text-neutral-800 hover:border-amber-400'
                                            : 'bg-white/5 border-white/10 text-neutral-200 hover:border-amber-400/50'
                                        }`}
                                      >
                                        <span className="font-mono text-[8.5px] opacity-75">
                                          #{kIdx + 1}
                                        </span>
                                        <span>{kw}</span>
                                      </button>
                                    ))}
                                  </div>

                                  <div className="grid grid-cols-2 gap-1.5 pt-1">
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
                                        isLight
                                          ? 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                                          : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-200'
                                      }`}
                                    >
                                      <Copy className="w-3 h-3 text-cyan-400" />
                                      <span>Copy Top 10</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        copyWithFeedback(
                                          structuredMeta.all49Keywords.join(', '),
                                          `all49_tab_${i}`,
                                          `All ${structuredMeta.all49Keywords.length} SEO Keywords`
                                        )
                                      }
                                      className="px-2.5 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-[10px] font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                                    >
                                      <Copy className="w-3 h-3" />
                                      <span>Copy All 49 Tags</span>
                                    </button>
                                  </div>
                                </div>
                              )}

                              {activeCardTab === 'export' && (
                                <div className="grid grid-cols-2 gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDownloadSingleCsv(
                                        structuredMeta,
                                        msg.imageFileName,
                                        'adobe'
                                      )
                                    }
                                    className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                                      isLight
                                        ? 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-200'
                                    }`}
                                  >
                                    <FileDown className="w-3 h-3 text-emerald-400" />
                                    <span>Adobe CSV</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDownloadSingleCsv(
                                        structuredMeta,
                                        msg.imageFileName,
                                        'shutterstock'
                                      )
                                    }
                                    className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                                      isLight
                                        ? 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-200'
                                    }`}
                                  >
                                    <FileDown className="w-3 h-3 text-sky-400" />
                                    <span>Shutterstock CSV</span>
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
                                      <span>Copy AI Prompt</span>
                                    </button>
                                  )}

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
                                      className="px-2.5 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 text-[10px] font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                                    >
                                      <ArrowUpRight className="w-3 h-3" />
                                      <span>Send to Studio</span>
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Bottom Message Toolbar (Voice Readout, Instant Transform & Full Copy) */}
                        {!isUser && textContent.length > 20 && (
                          <div className="mt-2.5 pt-2 border-t border-neutral-200/60 dark:border-neutral-800/80 space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => toggleSpeakMessage(textContent, i)}
                                  className={`px-2 py-0.5 rounded-md border text-[10px] font-bold flex items-center gap-1 cursor-pointer transition ${
                                    speakingMsgIdx === i
                                      ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                                      : isLight
                                      ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-700'
                                      : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-emerald-400'
                                  }`}
                                  title="Listen to AI Response Aloud"
                                >
                                  {speakingMsgIdx === i ? (
                                    <>
                                      <VolumeX className="w-3 h-3" />
                                      <span>Stop Voice</span>
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
                                  disabled={isChatLoading}
                                  onClick={() =>
                                    onSendChat(
                                      'Explain this in clear, actionable, simple terms with real-world examples and exact numbers.',
                                      activeMode,
                                      {
                                        voiceLang: 'English (US)',
                                        isLiveVoiceCall,
                                        deepMastermind: true,
                                        webSearchGrounding
                                      }
                                    )
                                  }
                                  className={`px-2 py-0.5 rounded-md border text-[9.5px] font-semibold transition cursor-pointer ${
                                    isLight
                                      ? 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                                      : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
                                  }`}
                                  title="Explain this entire answer in natural friend-to-friend Bengali"
                                >
                                  💡 Simplify & Break Down
                                </button>

                                <button
                                  type="button"
                                  disabled={isChatLoading}
                                  onClick={() =>
                                    onSendChat(
                                      'Go 10x deeper on this! Reveal the exact insider formulas, step-by-step execution secrets, and real numbers without hiding anything.',
                                      activeMode,
                                      {
                                        voiceLang: currentLangObj.name,
                                        isLiveVoiceCall,
                                        deepMastermind: true,
                                        webSearchGrounding
                                      }
                                    )
                                  }
                                  className={`px-2 py-0.5 rounded-md border text-[9.5px] font-semibold transition cursor-pointer ${
                                    isLight
                                      ? 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                                      : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-amber-300'
                                  }`}
                                  title="Ask AI to go 10x deeper and reveal every insider secret"
                                >
                                  🔥 10x Deeper Secret
                                </button>
                              </div>

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
                                    <Copy className="w-2.5 h-2.5" /> Copy
                                  </>
                                )}
                              </button>
                            </div>

                            {/* 1-Click Contextual Follow-Up Question Chips (Shown on latest AI message) */}
                            {i === chatMessages.length - 1 &&
                              Array.isArray(msg.followUpSuggestions) &&
                              msg.followUpSuggestions.length > 0 && (
                                <div className="pt-1.5 flex flex-wrap gap-1.5">
                                  {msg.followUpSuggestions.map((followQ: string, fIdx: number) => (
                                    <button
                                      key={fIdx}
                                      type="button"
                                      disabled={isChatLoading}
                                      onClick={() =>
                                        onSendChat(followQ, activeMode, {
                                          voiceLang: currentLangObj.name,
                                          isLiveVoiceCall,
                                          deepMastermind: deepMastermindMode,
                                          webSearchGrounding
                                        })
                                      }
                                      className={`text-[10px] font-medium px-2.5 py-1 rounded-xl border text-left transition cursor-pointer flex items-center gap-1 ${
                                        isLight
                                          ? 'bg-[#faf8f5] hover:bg-neutral-900 hover:text-white border-neutral-200/90 text-neutral-700'
                                          : 'bg-white/[0.03] hover:bg-emerald-500/15 border-white/10 hover:border-emerald-500/40 text-neutral-300 hover:text-emerald-300'
                                      }`}
                                    >
                                      <Sparkles className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                                      <span>{followQ}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
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
                        Studio Desk Specialist ({currentModeConfig.shortLabel}) is analyzing guidelines...
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

              {/* Bottom Input Composer with Generous Spacing, Drag & Paste, Voice Dictation */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSendChat(undefined, activeMode, {
                    voiceLang: currentLangObj.name,
                    isLiveVoiceCall,
                    deepMastermind: deepMastermindMode,
                    webSearchGrounding
                  });
                }}
                className={`p-4 sm:p-5 border-t flex items-center gap-2.5 ${
                  isLight ? 'bg-white border-neutral-200' : 'bg-[#050507] border-white/10'
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
                  className={`p-3 rounded-2xl border transition cursor-pointer shrink-0 ${
                    chatAttachedImage
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : isLight
                      ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-700'
                      : 'bg-white/[0.05] hover:bg-white/[0.1] border-white/12 text-cyan-400'
                  }`}
                  title="Attach Image, EPS, or PSD for Vision SEO"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  disabled={isChatLoading}
                  className={`p-3 rounded-2xl border transition cursor-pointer shrink-0 ${
                    isListening
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-pulse'
                      : isLight
                      ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-700'
                      : 'bg-white/[0.05] hover:bg-white/[0.1] border-white/12 text-neutral-300'
                  }`}
                  title={isListening ? 'Stop Voice Dictation' : 'Voice Dictation (Speak your prompt)'}
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
                      ? 'Press Send for 49 tags or add specific guidelines...'
                      : currentModeConfig.placeholder
                  }
                  disabled={isChatLoading}
                  className={`flex-1 text-xs sm:text-sm rounded-2xl px-4 py-3 border focus:outline-none transition min-w-0 ${
                    isLight
                      ? 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-neutral-900'
                      : 'bg-white/[0.04] border-white/15 text-white placeholder:text-neutral-500 focus:border-emerald-400/70 focus:bg-white/[0.06]'
                  }`}
                />

                <button
                  type="submit"
                  disabled={isChatLoading || (!chatInput.trim() && !chatAttachedImage)}
                  className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer disabled:opacity-40 shrink-0 flex items-center gap-2 shadow-lg ${
                    isLight
                      ? 'bg-neutral-950 hover:bg-black text-white'
                      : 'lal-sobuj-glow-button shadow-[0_0_24px_rgba(244,42,65,0.4)]'
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
