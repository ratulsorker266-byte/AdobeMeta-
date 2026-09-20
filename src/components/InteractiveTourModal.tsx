import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, ArrowRight, ArrowLeft, Check, Upload, Sliders, ShieldCheck, FileSpreadsheet, Eye, Zap } from 'lucide-react';

interface InteractiveTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
}

const TOUR_STEPS = [
  {
    icon: Upload,
    badge: "Step 1 of 5",
    title: "100-File Bulk Ingestion",
    description: "Drag and drop up to 100 photos, illustrations, or vectors at once. The platform automatically compresses high-res files locally into ultra-fast thumbnails to keep your browser running smoothly.",
    highlight: "Supports JPG, PNG, WebP, SVG and auto-extracts EXIF/IPTC data.",
    color: "from-indigo-500/20 to-blue-500/20",
    iconColor: "text-indigo-400"
  },
  {
    icon: Sliders,
    badge: "Step 2 of 5",
    title: "Marketplace Rules & Turbo Engine",
    description: "Select your target marketplace (Adobe Stock max 49 keywords, Shutterstock, Freepik, etc.). Toggle Turbo Mode for instant concurrent AI processing powered by Gemini Vision.",
    highlight: "Strictly deduplicates, strips punctuation, and puts the most commercially critical search terms in the top 10.",
    color: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400"
  },
  {
    icon: ShieldCheck,
    badge: "Step 3 of 5",
    title: "Rejection Shield & Compliance Score",
    description: "Every asset passes through a simulated microstock moderation inspector. It checks for trademark risks (Apple, Nike, etc.), alerts if Model/Property releases are needed, and verifies commercial viability.",
    highlight: "Catches quality pitfalls before upload so your rejection rate stays near 0%.",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400"
  },
  {
    icon: Eye,
    badge: "Step 4 of 5",
    title: "Live Buyer Search Simulation",
    description: "Click 'Preview As Buyer' on any asset to inspect how your file will display on Adobe Stock search result pages, complete with title wrapping, license tags, and ranking visibility.",
    highlight: "Inspect how real buyers perceive your thumbnail and first 5 keywords.",
    color: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-400"
  },
  {
    icon: FileSpreadsheet,
    badge: "Step 5 of 5",
    title: "ZIP Embedding & Multi-Platform CSV",
    description: "Export full-fidelity embedded JPEGs with IPTC/EXIF headers AND companion Adobe .xmp sidecars in a single ZIP. Generate ready-to-upload CSVs custom-formatted for Adobe Stock, Shutterstock, and Freepik.",
    highlight: "100% compliant with Adobe Bridge, Lightroom, Illustrator, and stock submission portals.",
    color: "from-emerald-500/20 to-indigo-500/20",
    iconColor: "text-emerald-400"
  }
];

export const InteractiveTourModal: React.FC<InteractiveTourModalProps> = ({
  isOpen,
  onClose,
  currentStep,
  onNext,
  onPrev
}) => {
  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep] || TOUR_STEPS[0];
  const isLast = currentStep === TOUR_STEPS.length - 1;
  const StepIcon = step.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span className="text-sm font-bold text-slate-200">Master Contributor Guide</span>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-indigo-900/50 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded-full">
                {step.badge}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition"
              title="Close guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-5">
            {/* Step Icon & Hero Banner */}
            <div className={`p-4 rounded-xl bg-gradient-to-br ${step.color} border border-slate-700/50 flex items-center gap-4`}>
              <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-center shrink-0 shadow-inner">
                <StepIcon className={`w-6 h-6 ${step.iconColor}`} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-wide">{step.title}</h3>
                <p className="text-xs text-slate-300 mt-0.5">{step.highlight}</p>
              </div>
            </div>

            {/* Explanation paragraph */}
            <p className="text-sm text-slate-300 leading-relaxed">
              {step.description}
            </p>

            {/* Step Dots indicator */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {TOUR_STEPS.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentStep
                      ? 'w-6 bg-indigo-500'
                      : idx < currentStep
                      ? 'w-2 bg-emerald-500/70'
                      : 'w-2 bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <button
              onClick={onPrev}
              disabled={currentStep === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:hover:text-slate-400 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-300 transition"
              >
                Skip Tour
              </button>

              <button
                onClick={isLast ? onClose : onNext}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-indigo-600/30"
              >
                {isLast ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Start Creating
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
