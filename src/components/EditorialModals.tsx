import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight, ShieldCheck, Sparkles, BookOpen, Star, HelpCircle } from 'lucide-react';
import { AdobeMetaProLogo } from './AdobeMetaProLogo';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl bg-[#faf8f5] text-neutral-900 rounded-3xl p-7 sm:p-9 shadow-2xl border border-stone-200 overflow-hidden font-sans"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-stone-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="space-y-6">
            <AdobeMetaProLogo size="md" showText={true} />

            <div className="space-y-2">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-neutral-500 uppercase">
                THE MISSION BEHIND THE PLATFORM
              </span>
              <h3 className="font-editorial text-3xl text-neutral-900 font-normal leading-tight">
                Designed for Discovery, <br />
                <span className="italic">Built for Creators</span>
              </h3>
            </div>

            <p className="text-[14px] leading-relaxed text-neutral-600">
              Adobe Meta Pro was founded to solve the single largest bottleneck in the stock photography and digital asset industry: discoverability. Every day, exceptional photographs, vector illustrations, and 3D renders remain undiscovered because of suboptimal titles and unordered keywords.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-stone-200/80 space-y-1.5 shadow-xs">
                <div className="text-[12px] font-semibold text-neutral-900">Commercial Intent</div>
                <p className="text-[11.5px] text-neutral-500 leading-snug">
                  Aligns tags with terms commercial buyers search to license imagery.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200/80 space-y-1.5 shadow-xs">
                <div className="text-[12px] font-semibold text-neutral-900">Adobe Guidelines</div>
                <p className="text-[11.5px] text-neutral-500 leading-snug">
                  100% compliant with August 2026 title and top-10 keyword rules.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200/80 space-y-1.5 shadow-xs">
                <div className="text-[12px] font-semibold text-neutral-900">Zero Commission</div>
                <p className="text-[11.5px] text-neutral-500 leading-snug">
                  100% of your stock earnings and royalties remain entirely yours.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-neutral-500">
              <span>Architected by Ratul Sorker</span>
              <button
                onClick={onClose}
                className="bg-neutral-900 hover:bg-black text-white text-xs font-medium px-5 py-2 rounded-full transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const PricingModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-3xl bg-[#faf8f5] text-neutral-900 rounded-3xl p-7 sm:p-10 shadow-2xl border border-stone-200 overflow-hidden font-sans"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-stone-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="space-y-6">
            <div className="space-y-1.5 text-center max-w-md mx-auto">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-neutral-500 uppercase">
                TRANSPARENT CREATOR PRICING
              </span>
              <h3 className="font-editorial text-3xl text-neutral-900 font-normal">
                Invest in <span className="italic">Higher Royalties</span>
              </h3>
              <p className="text-[13px] text-neutral-600">
                Unlock high-ranking stock discoverability with no hidden subscription traps.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {/* Free Plan */}
              <div className="p-6 rounded-2xl bg-white border border-stone-200 space-y-4 shadow-xs">
                <div>
                  <div className="text-[12px] font-semibold uppercase tracking-wider text-neutral-500">Starter Plan</div>
                  <div className="font-editorial text-3xl font-medium text-neutral-900 mt-1">$0 <span className="text-xs text-neutral-400 font-sans">/ forever</span></div>
                  <p className="text-[12px] text-neutral-600 mt-1">Essential metadata generation for casual photographers.</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-stone-100 text-[12px] text-neutral-700">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-900" />
                    <span>Up to 25 assets per day</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-900" />
                    <span>Adobe Stock CSV export</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-900" />
                    <span>Top 10 keyword prioritization</span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-full border border-neutral-300 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 transition"
                >
                  Current Tier
                </button>
              </div>

              {/* Founder VIP Pro Plan */}
              <div className="p-6 rounded-2xl bg-neutral-900 text-white space-y-4 shadow-xl relative overflow-hidden">
                <div className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider bg-[#c49e63] text-black px-2.5 py-0.5 rounded-full">
                  VIP GRANT
                </div>

                <div>
                  <div className="text-[12px] font-semibold uppercase tracking-wider text-neutral-400">Founder VIP Pro</div>
                  <div className="font-editorial text-3xl font-medium text-white mt-1">$0 <span className="text-xs text-[#c49e63] font-sans">/ 100% Free VIP Access</span></div>
                  <p className="text-[12px] text-neutral-300 mt-1">Complete commercial metadata &amp; earning workstation.</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-neutral-800 text-[12px] text-neutral-200">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#c49e63]" />
                    <span>Unlimited batch processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#c49e63]" />
                    <span>Vector EPS PostScript rasterizer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#c49e63]" />
                    <span>100% Rank #1 Algorithm Booster</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#c49e63]" />
                    <span>Multi-agency CSV &amp; ZIP export</span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-full bg-[#c49e63] hover:bg-[#b58f54] text-neutral-950 text-xs font-bold transition shadow"
                >
                  Active Pro Contributor
                </button>
              </div>
            </div>

            <div className="text-center pt-2">
              <span className="text-[11px] text-neutral-500">
                100% satisfaction guarantee · No credit card required · Free VIP Access granted
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const ResourcesModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl bg-[#faf8f5] text-neutral-900 rounded-3xl p-7 sm:p-9 shadow-2xl border border-stone-200 overflow-hidden font-sans max-h-[85vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-stone-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-neutral-500 uppercase">
                CONTRIBUTOR KNOWLEDGE BASE
              </span>
              <h3 className="font-editorial text-3xl text-neutral-900 font-normal">
                Adobe Stock <span className="italic">Metadata Guide</span>
              </h3>
            </div>

            <div className="space-y-4 text-[13px] text-neutral-700">
              <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1.5">
                <div className="font-semibold text-neutral-900 flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#c49e63]" />
                  <span>The Power of the First 10 Keywords</span>
                </div>
                <p className="text-neutral-600 text-[12px] leading-relaxed">
                  Adobe Stock weights the first 10 keyword slots significantly heavier than the rest. Adobe Meta Pro places your asset's primary subject, setting, and critical commercial search terms in these 10 slots.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1.5">
                <div className="font-semibold text-neutral-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-neutral-800" />
                  <span>Titles Under 70 Characters</span>
                </div>
                <p className="text-neutral-600 text-[12px] leading-relaxed">
                  Avoid long narrative sentences or keyword stuffing in titles. Keep titles under 70 characters and describe what is visually present in the image.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1.5">
                <div className="font-semibold text-neutral-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Zero Trademark Violations</span>
                </div>
                <p className="text-neutral-600 text-[12px] leading-relaxed">
                  Never include brands, logos, software names (e.g. Apple, Nike, Photoshop), or artist names in your stock metadata. Our automatic scrubber removes them before submission.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={onClose}
                className="bg-neutral-900 hover:bg-black text-white text-xs font-medium px-5 py-2 rounded-full transition"
              >
                Got It
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
