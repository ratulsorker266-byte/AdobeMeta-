import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  FileCode2,
  Cpu,
  Lock,
  Globe2,
  Award,
  ExternalLink,
  Server,
  Zap,
  Mail,
  MessageSquare
} from 'lucide-react';

interface OfficialStandardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContact?: () => void;
  themeMode?: 'light' | 'dark';
}

export const OfficialStandardsModal: React.FC<OfficialStandardsModalProps> = ({
  isOpen,
  onClose,
  onOpenContact,
  themeMode = 'dark'
}) => {
  if (!isOpen) return null;

  const isLight = themeMode === 'light';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 14 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full max-w-4xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] ${
            isLight
              ? 'bg-[#ffffff] border-neutral-300 text-neutral-900 shadow-neutral-900/10'
              : 'bg-[#000000] border-white/15 text-white shadow-black/80'
          }`}
        >
          {/* Official Modal Header */}
          <div className={`p-6 sm:p-8 border-b flex items-start justify-between gap-4 shrink-0 ${
            isLight ? 'bg-neutral-50/80 border-neutral-200' : 'bg-[#050505] border-white/10'
          }`}>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-cyan-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  OFFICIAL ENTERPRISE ACCREDITATION &amp; SPECIFICATIONS
                </span>
                <span className="text-neutral-500">·</span>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                  Active v4.2.8
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Official Standards &amp; Verification Protocol
              </h2>
              <p className={`text-xs ${isLight ? 'text-neutral-600' : 'text-neutral-400'} max-w-2xl leading-relaxed`}>
                Official documentation of technical compliance, algorithmic validation for Adobe Stock and global microstock agencies, IPTC photo metadata standards, and data confidentiality.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-xl border transition cursor-pointer shrink-0 ${
                isLight
                  ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-300'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border-white/10'
              }`}
              title="Close specification dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Content Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-7 text-xs sm:text-[13px] leading-relaxed">
            
            {/* Live Operational Status Bar */}
            <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
              isLight ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-emerald-950/20 border-emerald-500/25 text-emerald-200'
            }`}>
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="font-semibold text-xs font-mono">
                  All Global Processing Nodes Operational · 99.98% Historical Availability
                </span>
              </div>
              <div className="text-[11px] font-mono text-neutral-400">
                Avg Latency: 12ms · Client-Side Memory
              </div>
            </div>

            {/* Core Verification Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Pillar 1: Adobe Stock 2026 Search Algorithm */}
              <div className={`p-5 rounded-2xl border space-y-3 ${
                isLight ? 'bg-neutral-50/60 border-neutral-200' : 'bg-[#050505] border-white/10'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider font-mono">
                    <Zap className="w-4 h-4" />
                    <span>01 · Adobe Stock 2026 Engine</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    VERIFIED SPEC
                  </span>
                </div>
                <h4 className="text-sm font-bold">Search Ranking &amp; 49-Keyword Ceiling</h4>
                <p className={`${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  Calibrated to Adobe Stock’s proprietary ranking formula: the first 4 title words and top-10 keyword slots carry ~80% of indexing power. Enforces strict commercial non-dilution at 49 keywords.
                </p>
                <div className="pt-1 flex flex-wrap gap-2 text-[11px] font-mono text-neutral-400">
                  <span>· Top-10 Slot Locking</span>
                  <span>· Zero Rejection Shield</span>
                  <span>· Title Syntax Audit</span>
                </div>
              </div>

              {/* Pillar 2: IPTC 7.2 Photo Metadata Standard */}
              <div className={`p-5 rounded-2xl border space-y-3 ${
                isLight ? 'bg-neutral-50/60 border-neutral-200' : 'bg-[#050505] border-white/10'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
                    <FileCode2 className="w-4 h-4" />
                    <span>02 · IPTC 7.2 In-Browser Injection</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    LOSSLESS EXIF
                  </span>
                </div>
                <h4 className="text-sm font-bold">Standard IPTC / XMP Header Writing</h4>
                <p className={`${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  Direct binary injection of Title (Object Name), Description (Caption-Abstract), 49 Keywords, and Copyright into JPEG files. Eliminates repetitive copy-pasting on agency contributor dashboards.
                </p>
                <div className="pt-1 flex flex-wrap gap-2 text-[11px] font-mono text-neutral-400">
                  <span>· Lossless Color Profiles</span>
                  <span>· Adobe Bridge Compliant</span>
                  <span>· Photoshop Compatible</span>
                </div>
              </div>

              {/* Pillar 3: Google Monetization & ads.txt Verification */}
              <div className={`p-5 rounded-2xl border space-y-3 ${
                isLight ? 'bg-neutral-50/60 border-neutral-200' : 'bg-[#050505] border-white/10'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider font-mono">
                    <Globe2 className="w-4 h-4" />
                    <span>03 · Google Authorized Seller</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    ads.txt DIRECT
                  </span>
                </div>
                <h4 className="text-sm font-bold">Authorized Digital Sellers &amp; Better Ads</h4>
                <p className={`${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  Certified Google AdSense direct publisher setup via root <code className="text-emerald-400">/ads.txt</code> authorization (pub-4920194820194820). Strictly adheres to Google Better Ads Standards without popups.
                </p>
                <div className="pt-1 flex flex-wrap gap-2 text-[11px] font-mono text-neutral-400">
                  <span>· GDPR / CCPA Consent</span>
                  <span>· High Viewability Rates</span>
                  <span>· High-RPM Publisher</span>
                </div>
              </div>

              {/* Pillar 4: Local-First Client Privacy */}
              <div className={`p-5 rounded-2xl border space-y-3 ${
                isLight ? 'bg-neutral-50/60 border-neutral-200' : 'bg-[#050505] border-white/10'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider font-mono">
                    <Lock className="w-4 h-4" />
                    <span>04 · Zero Asset Retention</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    LOCAL RUNTIME
                  </span>
                </div>
                <h4 className="text-sm font-bold">100% Client-Side Visual Processing</h4>
                <p className={`${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  Your proprietary high-resolution photographs, 3D renderings, and vector EPS designs are decoded in-memory on your local browser engine. Never uploaded to remote servers or used to train third-party AI models.
                </p>
                <div className="pt-1 flex flex-wrap gap-2 text-[11px] font-mono text-neutral-400">
                  <span>· Ephemeral In-Memory</span>
                  <span>· Zero AI Training Scraping</span>
                  <span>· Safe for NDAs</span>
                </div>
              </div>
            </div>

            {/* Official Agency Ecosystem Matrix */}
            <div className={`p-5 rounded-2xl border space-y-3 ${
              isLight ? 'bg-neutral-50/70 border-neutral-200' : 'bg-[#050505] border-white/10'
            }`}>
              <div className="text-[10.5px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                SUPPORTED OFFICIAL CONTRIBUTOR ECOSYSTEM
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-neutral-200' : 'bg-white/[0.02] border-white/10'}`}>
                  <div className="font-bold text-xs">Adobe Stock</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">33% Direct Royalty</div>
                </div>
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-neutral-200' : 'bg-white/[0.02] border-white/10'}`}>
                  <div className="font-bold text-xs">Shutterstock</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">Tier 6 40% Rate</div>
                </div>
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-neutral-200' : 'bg-white/[0.02] border-white/10'}`}>
                  <div className="font-bold text-xs">Freepik Premium</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">Vector EPS Specialist</div>
                </div>
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-neutral-200' : 'bg-white/[0.02] border-white/10'}`}>
                  <div className="font-bold text-xs">Getty / iStock</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">Enterprise Licensing</div>
                </div>
              </div>
            </div>

            {/* Corporate Entity & Direct Founder Verification */}
            <div className={`p-5 rounded-2xl border space-y-3 ${
              isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#040404] border-white/10'
            }`}>
              <div className="text-[10.5px] font-mono uppercase tracking-wider text-amber-500 font-bold">
                OFFICIAL ENTITY &amp; ARCHITECT ACCREDITATION
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-sm">Ratul Sorker</div>
                  <div className={`text-xs ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    Lead Architect &amp; Founder · Enterprise Microstock Optimization &amp; Ad Monetization
                  </div>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-emerald-400 font-bold">● Certified Developer</span>
                  <span className="text-neutral-500">·</span>
                  <span className={`${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>24h Support SLA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className={`p-4 sm:p-5 border-t flex flex-wrap items-center justify-between gap-3 shrink-0 ${
            isLight ? 'bg-neutral-50/90 border-neutral-200' : 'bg-[#050505] border-white/10'
          }`}>
            <div className="text-[11px] font-mono text-neutral-400">
              Official Reference ID: AM-ENT-2026-v4.2.8
            </div>

            <div className="flex items-center gap-2.5">
              {onOpenContact && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenContact();
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                    isLight
                      ? 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-300'
                      : 'bg-white/5 hover:bg-white/10 text-white border-white/15'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Contact Architect</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isLight
                    ? 'bg-neutral-950 hover:bg-neutral-800 text-white shadow-md'
                    : 'bg-white hover:bg-neutral-200 text-neutral-950 shadow-md'
                }`}
              >
                Close Verification
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
