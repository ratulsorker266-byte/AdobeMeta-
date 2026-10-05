import React, { useState, useEffect } from 'react';
import { Terminal, ShieldCheck, Copy, Check, Zap, Radio, ChevronUp, ChevronDown, ClipboardCheck } from 'lucide-react';
import { playTickSound, playChimeSound } from '../lib/audioFeedback';

interface AutonomousHackerHudBarProps {
  onOpenTerminal: () => void;
  onInterceptedUrl?: (urlOrTopic: string) => void;
  showToast: (msg: string) => void;
  themeMode: 'light' | 'dark';
}

interface LiveInterceptPacket {
  codename: string;
  niche: string;
  rpd: string;
  gapRatio: string;
  hijackTitle: string;
  topTags: string[];
}

const LIVE_INTERCEPT_STREAM: LiveInterceptPacket[] = [
  {
    codename: 'OP-QUANTUM-01',
    niche: 'Post-Quantum Cryptography Vector',
    rpd: '$3.80–$17.50 RPD',
    gapRatio: '0.11 ULTRA-LOW SUPPLY',
    hijackTitle: 'Quantum Cryptography And Zero Trust Cloud Security Vector',
    topTags: [
      'quantum cryptography',
      'zero trust architecture',
      'cybersecurity vector',
      'cloud security',
      'enterprise firewall',
      'encrypted network',
      'data protection',
      'isometric server',
      'digital shield',
      'information security',
    ],
  },
  {
    codename: 'OP-LIQUID-AI-02',
    niche: 'AI Data Center Liquid Cooling 3D',
    rpd: '$4.20–$19.80 RPD',
    gapRatio: '0.08 CRITICAL GAP',
    hijackTitle: 'Isometric AI Data Center Liquid Cooling Server Architecture',
    topTags: [
      'ai data center',
      'liquid cooling server',
      'isometric architecture',
      'cloud infrastructure',
      'gpu cluster',
      'high performance computing',
      'green technology',
      'thermal management',
      'enterprise hardware',
      'editable vector',
    ],
  },
  {
    codename: 'OP-BIOTECH-03',
    niche: 'CRISPR Gene Therapy Molecular Vector',
    rpd: '$3.50–$16.40 RPD',
    gapRatio: '0.13 LOW COMPETITION',
    hijackTitle: 'CRISPR Gene Editing DNA Helix Molecular Biotechnology Vector',
    topTags: [
      'crispr gene editing',
      'dna helix vector',
      'molecular biotechnology',
      'genetic engineering',
      'medical innovation',
      'genomic research',
      'pharmaceutical science',
      'biotech illustration',
      'healthcare future',
      'scientific diagram',
    ],
  },
  {
    codename: 'OP-SILHOUETTE-04',
    niche: 'Sacred Geometry & Luxury Silhouette Pack',
    rpd: '$2.90–$14.00 RPD',
    gapRatio: '0.14 HIGH VELOCITY',
    hijackTitle: 'Minimalist Sacred Geometry And Botanical Silhouette Vector Set',
    topTags: [
      'sacred geometry vector',
      'minimalist silhouette',
      'black and white icon',
      'botanical line art',
      'luxury emblem',
      'laser cut template',
      'monochrome illustration',
      'clean vector path',
      'branding element',
      'eps 10 graphic',
    ],
  },
  {
    codename: 'OP-SOLID-EV-05',
    niche: 'Solid-State EV Battery Blueprint',
    rpd: '$3.95–$18.20 RPD',
    gapRatio: '0.09 ENTERPRISE GAP',
    hijackTitle: 'Autonomous Electric Vehicle Solid State Battery Blueprint Vector',
    topTags: [
      'solid state battery',
      'electric vehicle blueprint',
      'clean energy storage',
      'lithium ion alternative',
      'automotive engineering',
      'sustainable mobility',
      'isometric battery cell',
      'power grid technology',
      'industrial innovation',
      'commercial vector',
    ],
  },
];

export const AutonomousHackerHudBar: React.FC<AutonomousHackerHudBarProps> = ({
  onOpenTerminal,
  onInterceptedUrl,
  showToast,
  themeMode,
}) => {
  const [packetIdx, setPacketIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [minimized, setMinimized] = useState<boolean>(() => {
    try {
      return localStorage.getItem('adobemeta_hud_minimized') === 'true';
    } catch {
      return false;
    }
  });
  const [interceptedClip, setInterceptedClip] = useState<string | null>(null);
  const [swarmPeersCount, setSwarmPeersCount] = useState<number>(1);

  // World-First Cross-Tab Quantum Swarm Sync (BroadcastChannel Mesh across multiple open browser tabs)
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;
    const channel = new BroadcastChannel('adobemeta_quantum_swarm_v1');
    const tabId = Math.random().toString(36).slice(2, 9);
    const activePeers = new Set<string>([tabId]);

    const broadcastPresence = () => {
      try {
        channel.postMessage({ type: 'SWARM_HEARTBEAT', tabId, packetIdx });
      } catch {}
    };

    channel.onmessage = (ev) => {
      const msg = ev.data;
      if (!msg || typeof msg !== 'object') return;
      if (msg.tabId) {
        activePeers.add(msg.tabId);
        setSwarmPeersCount(activePeers.size);
      }
      if (msg.type === 'SWARM_PACKET_SYNC' && typeof msg.packetIdx === 'number') {
        setPacketIdx(msg.packetIdx % LIVE_INTERCEPT_STREAM.length);
      }
      if (msg.type === 'SWARM_CLIP_INTERCEPT' && typeof msg.clip === 'string') {
        setInterceptedClip(msg.clip);
      }
    };

    broadcastPresence();
    const hb = setInterval(broadcastPresence, 4000);

    return () => {
      clearInterval(hb);
      channel.close();
    };
  }, []);

  // Self-running autonomous ticker rotates every 6.5 seconds without any user command
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.hidden) return;
      setPacketIdx((prev) => {
        const next = (prev + 1) % LIVE_INTERCEPT_STREAM.length;
        try {
          if ('BroadcastChannel' in window) {
            const ch = new BroadcastChannel('adobemeta_quantum_swarm_v1');
            ch.postMessage({ type: 'SWARM_PACKET_SYNC', packetIdx: next });
            ch.close();
          }
        } catch {}
        return next;
      });
    }, 6500);
    return () => clearInterval(interval);
  }, []);

  // Zero-Command Global Paste Interceptor: if user presses Ctrl+V anywhere on the page (outside an input),
  // automatically intercept the stock URL or topic and open Black-Ops X-Ray!
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      const pasted = e.clipboardData?.getData('text')?.trim();
      if (pasted && pasted.length > 3) {
        setInterceptedClip(pasted.slice(0, 60));
        playChimeSound();
        showToast(`⚡ [ZERO-COMMAND INTERCEPT] Scanning "${pasted.slice(0, 38)}..."`);
        if (onInterceptedUrl) {
          onInterceptedUrl(pasted);
        } else {
          onOpenTerminal();
        }
      }
    };
    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, [onInterceptedUrl, onOpenTerminal, showToast]);

  const current = LIVE_INTERCEPT_STREAM[packetIdx];
  const isLight = themeMode === 'light';

  const handleQuickHijackCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const payload = `${current.hijackTitle}\n\n${current.topTags.join(', ')}`;
    navigator.clipboard.writeText(payload);
    setCopied(true);
    playChimeSound();
    showToast(`⚡ [AUTO-HIJACK] Copied "${current.niche}" Title + Top-10 Tags!`);
    setTimeout(() => setCopied(false), 1800);
  };

  const toggleMinimize = (val: boolean, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playTickSound();
    setMinimized(val);
    try {
      localStorage.setItem('adobemeta_hud_minimized', String(val));
    } catch {}
  };

  if (minimized) {
    return (
      <div className="fixed bottom-4 left-4 z-[90]">
        <button
          type="button"
          onClick={(e) => toggleMinimize(false, e)}
          className={`px-3.5 py-2 rounded-full border font-mono text-[10.5px] font-bold tracking-wider uppercase flex items-center gap-2 transition cursor-pointer backdrop-blur-xl ${
            isLight
              ? 'bg-white/95 border-neutral-200/90 text-neutral-900 shadow-md hover:border-emerald-500'
              : 'bg-[#080d0b]/95 border-emerald-500/45 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.28)] hover:border-emerald-400'
          }`}
          title="Expand Autonomous Hacker Radar Pill"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>AUTO-DAEMON · {current.rpd}</span>
          <ChevronUp className="w-3.5 h-3.5 text-emerald-500" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-lg z-[90] pointer-events-auto">
      <div
        onClick={onOpenTerminal}
        className={`rounded-2xl border px-3.5 py-2.5 backdrop-blur-xl transition-all cursor-pointer font-mono ${
          isLight
            ? 'bg-white/95 border-neutral-200/90 text-neutral-900 shadow-[0_14px_38px_-10px_rgba(0,0,0,0.12)] hover:border-emerald-500/60'
            : 'bg-[#050a08]/95 border-emerald-500/40 text-emerald-100 shadow-[0_0_35px_rgba(16,185,129,0.25)] hover:border-emerald-400'
        }`}
      >
        <div
          className={`flex items-center justify-between gap-2 text-[10px] pb-1.5 border-b ${
            isLight ? 'border-neutral-200/70 text-emerald-700' : 'border-emerald-500/20 text-emerald-400'
          }`}
        >
          <div className="flex items-center gap-1.5 truncate">
            <Radio className="w-3 h-3 text-emerald-500 animate-pulse shrink-0" />
            <span className="font-bold tracking-[0.12em] uppercase">
              {interceptedClip ? `CLIPBOARD INTERCEPTED` : `AUTO-DAEMON · ${current.codename}`}
            </span>
            <span
              className={`hidden sm:inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold border ${
                isLight
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              }`}
              title="Cross-Tab Quantum Swarm Sync + Pixel LSB Vault Active"
            >
              <ShieldCheck className="w-2.5 h-2.5" />
              <span>LSB VAULT · {swarmPeersCount} {swarmPeersCount > 1 ? 'SWARM NODES' : 'NODE'}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`font-bold ${isLight ? 'text-amber-600' : 'text-amber-400'}`}>
              {current.rpd}
            </span>
            <button
              type="button"
              onClick={(e) => toggleMinimize(true, e)}
              className={`p-0.5 rounded transition ${
                isLight ? 'hover:bg-neutral-100 text-neutral-500' : 'hover:bg-emerald-500/20 text-emerald-400'
              }`}
              title="Minimize to Sleek Pill"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="pt-1.5 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div
              className={`flex items-center gap-1.5 text-[11px] font-bold truncate ${
                isLight ? 'text-neutral-950' : 'text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">{current.niche}</span>
            </div>
            <div
              className={`text-[10px] truncate mt-0.5 flex items-center gap-1.5 ${
                isLight ? 'text-neutral-500' : 'text-emerald-400/80'
              }`}
            >
              <ClipboardCheck className="w-3 h-3 shrink-0 text-amber-500" />
              <span>Tip: Press Ctrl+V anywhere to auto-X-Ray any link</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleQuickHijackCopy}
              className={`px-2.5 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition ${
                isLight
                  ? 'bg-neutral-950 hover:bg-black text-white'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-black font-black shadow-[0_0_15px_rgba(16,185,129,0.35)]'
              }`}
              title="1-Click Copy Hijacked Title & Top-10 Priority Tags"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'COPIED' : 'HIJACK'}</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenTerminal();
              }}
              className={`px-2.5 py-1.5 rounded-lg border font-bold text-[10px] uppercase flex items-center gap-1 cursor-pointer transition ${
                isLight
                  ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200'
                  : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-500/40'
              }`}
              title="Open Full Black-Ops Terminal (Ctrl+K)"
            >
              <Zap className="w-3 h-3 text-amber-500" />
              <span className="hidden sm:inline">X-RAY</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
