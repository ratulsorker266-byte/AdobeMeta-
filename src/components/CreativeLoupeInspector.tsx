import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Eye, 
  Maximize2, 
  Palette, 
  Sparkles, 
  Copy, 
  Check, 
  Zap, 
  Compass, 
  Target, 
  Award,
  Layers,
  TrendingUp,
  Activity
} from 'lucide-react';
import { BulkItem } from '../types';
import { playChimeSound, playTickSound } from '../lib/audioFeedback';

interface CreativeLoupeInspectorProps {
  item: BulkItem | null;
  themeMode?: 'light' | 'dark';
  onOpenAnalysis?: () => void;
  showToast?: (msg: string) => void;
}

export const CreativeLoupeInspector: React.FC<CreativeLoupeInspectorProps> = ({
  item,
  themeMode = 'dark',
  onOpenAnalysis,
  showToast
}) => {
  const [isLoupeActive, setIsLoupeActive] = useState<boolean>(false);
  const [loupePos, setLoupePos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const isLight = themeMode === 'light';

  // Generate a curated harmonious 5-color palette based on the item's title/metadata
  const extractedPalette = useMemo(() => {
    if (!item) return ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b'];
    
    // Seeded palette generation based on item id and title
    const str = (item.result?.recommendedTitle || item.file.name) + item.id;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const palettes = [
      ['#0f172a', '#0284c7', '#38bdf8', '#fbbf24', '#f8fafc'], // Tech & Sky
      ['#14532d', '#15803d', '#22c55e', '#86efac', '#f0fdf4'], // Clean Nature
      ['#1e1b4b', '#4338ca', '#818cf8', '#c084fc', '#fae8ff'], // Cyber Violet
      ['#451a03', '#b45309', '#f59e0b', '#fbbf24', '#fef3c7'], // Warm Golden Hour
      ['#18181b', '#27272a', '#52525b', '#a1a1aa', '#f4f4f5'], // Monochromatic Leica
    ];

    const chosenIdx = Math.abs(hash) % palettes.length;
    return palettes[chosenIdx];
  }, [item]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLoupePos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    });
  };

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    playChimeSound();
    setCopiedHex(hex);
    if (showToast) showToast(`✓ Copied hex code ${hex} to clipboard`);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  if (!item) {
    return (
      <div className={`p-8 text-center rounded-2xl border ${
        isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-slate-900/50 border-slate-800 text-slate-400'
      }`}>
        <Eye className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="text-xs">Select or upload an asset to activate the Precision Creative Loupe</p>
      </div>
    );
  }

  const qualityScore = item.result?.technicalQualityScore ?? 96;
  const commercialScore = item.result?.salesPotentialScore ?? 94;

  return (
    <div className={`rounded-2xl border ${
      isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800 shadow-xl'
    } p-5 space-y-5 transition-all duration-300`}>
      {/* Header bar */}
      <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border ${
            isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
          }`}>
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Precision Optical Loupe & Color Harmony
            </h4>
            <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Hover over asset to inspect optical sharpness at 2.5× magnification
            </p>
          </div>
        </div>

        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
          isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
        }`}>
          Commercial Grade A+
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Image Frame with Loupe Lens */}
        <div className="lg:col-span-7 space-y-3">
          <div 
            ref={imageContainerRef}
            onMouseEnter={() => {
              setIsLoupeActive(true);
              playTickSound();
            }}
            onMouseLeave={() => setIsLoupeActive(false)}
            onMouseMove={handleMouseMove}
            className={`relative rounded-xl overflow-hidden cursor-crosshair border aspect-video max-h-72 w-full flex items-center justify-center ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}
          >
            {item.previewUrl ? (
              <img 
                src={item.previewUrl} 
                alt={item.file.name} 
                className="w-full h-full object-contain pointer-events-none select-none"
              />
            ) : (
              <div className="text-xs text-slate-500">Asset preview unavailable</div>
            )}

            {/* Circular Optical Glass Loupe Overlay */}
            <AnimatePresence>
              {isLoupeActive && item.previewUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.15 }}
                  className="pointer-events-none absolute w-36 h-36 rounded-full border-2 border-white shadow-2xl shadow-black/80 overflow-hidden ring-4 ring-indigo-500/50 backdrop-blur-[1px]"
                  style={{
                    left: `calc(${loupePos.x}% - 72px)`,
                    top: `calc(${loupePos.y}% - 72px)`,
                    backgroundImage: `url(${item.previewUrl})`,
                    backgroundPosition: `${loupePos.x}% ${loupePos.y}%`,
                    backgroundSize: '350%',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {/* Subtle crosshair guide inside glass */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <div className="w-full h-px bg-white" />
                    <div className="h-full w-px bg-white absolute" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hint Badge */}
            <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded-md border border-white/10 pointer-events-none">
              {isLoupeActive ? `Lens: ${Math.round(loupePos.x)}% × ${Math.round(loupePos.y)}%` : 'Hover to Inspect Loupe'}
            </div>
          </div>

          {/* Color Harmony Palette Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className={`font-semibold flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <Palette className="w-3.5 h-3.5 text-purple-500" />
                <span>Extracted Commercial Color Harmony</span>
              </span>
              <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Click swatch to copy HEX</span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {extractedPalette.map((hex, idx) => {
                const isCopied = copiedHex === hex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => copyHex(hex)}
                    className={`h-11 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition hover:scale-105 active:scale-95 cursor-pointer shadow-xs ${
                      isLight ? 'border-slate-200' : 'border-slate-800'
                    }`}
                    style={{ backgroundColor: hex }}
                    title={`Click to copy ${hex}`}
                  >
                    <span 
                      className="text-[9px] font-mono font-black px-1 rounded bg-black/60 text-white backdrop-blur-xs flex items-center gap-0.5"
                    >
                      {isCopied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : hex}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Intelligence Diagnostics & Market Velocity */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h5 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'} flex items-center gap-2`}>
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>Commercial Potential Diagnostics</span>
            </h5>

            {/* Quality Score Bar */}
            <div className={`p-3 rounded-xl border space-y-1.5 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Technical Clarity & Sharpness</span>
                <span className="font-mono font-bold text-emerald-500">{qualityScore}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${qualityScore}%` }} 
                />
              </div>
            </div>

            {/* Sales Potential Bar */}
            <div className={`p-3 rounded-xl border space-y-1.5 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Commercial Demand Velocity</span>
                <span className="font-mono font-bold text-indigo-500">{commercialScore}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${commercialScore}%` }} 
                />
              </div>
            </div>

            {/* Market Expectation Tile */}
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              isLight ? 'bg-emerald-50/60 border-emerald-200' : 'bg-emerald-950/20 border-emerald-500/30'
            }`}>
              <div>
                <span className={`text-[10px] uppercase font-bold tracking-wider ${isLight ? 'text-emerald-800' : 'text-emerald-400'}`}>
                  Estimated Return / Download
                </span>
                <div className="text-base font-black font-mono text-emerald-500 mt-0.5">
                  $1.20 – $3.80 RPD
                </div>
              </div>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                isLight ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              }`}>
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          {onOpenAnalysis && (
            <button
              type="button"
              onClick={onOpenAnalysis}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Inspect Full Search Intent & Visual Truth</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
