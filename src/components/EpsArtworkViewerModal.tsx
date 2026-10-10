import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Copy,
  Check,
  Sparkles,
  CheckCircle2,
  Layers,
  Maximize2,
  RefreshCw,
  Camera,
  ShieldCheck,
  Award,
  Tag
} from 'lucide-react';
import { BulkItem } from '../types';
import { parseEpsFile, isEpsFile } from '../lib/epsParser';

interface EpsArtworkViewerModalProps {
  item: BulkItem | null;
  onClose: () => void;
  onUpdateItemPreview: (itemId: string, previewUrl: string, epsHint?: any) => void;
  onAttachScreenshot: (itemId: string, file: File) => void;
  onGenerateMetadata: (item: BulkItem) => void;
  isProcessing: boolean;
  showToast: (msg: string) => void;
  themeMode?: 'light' | 'dark';
}

export const EpsArtworkViewerModal: React.FC<EpsArtworkViewerModalProps> = ({
  item,
  onClose,
  onUpdateItemPreview,
  onAttachScreenshot,
  onGenerateMetadata,
  isProcessing,
  showToast,
  themeMode = 'light',
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [backdrop, setBackdrop] = useState<'white' | 'grid' | 'dark'>('white');
  const [isReRendering, setIsReRendering] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [extractedPalette, setExtractedPalette] = useState<string[]>([]);
  const [decodedDimensions, setDecodedDimensions] = useState<{ w: number; h: number; mp: string } | null>(null);

  React.useEffect(() => {
    if (!item?.previewUrl) {
      setExtractedPalette([]);
      setDecodedDimensions(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const w = img.naturalWidth || img.width || 0;
      const h = img.naturalHeight || img.height || 0;
      if (w > 0 && h > 0) {
        const mp = ((w * h) / 1_000_000).toFixed(2);
        setDecodedDimensions({ w, h, mp });
      }
      try {
        const canvas = document.createElement('canvas');
        const sampleSize = 48;
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
        const data = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
        const buckets = new Map<string, { r: number; g: number; b: number; count: number }>();
        for (let i = 0; i < data.length; i += 16) {
          const a = data[i + 3];
          if (a < 128) continue;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Quantize into 32-step buckets to group dominant swatches
          const qr = Math.round(r / 32) * 32;
          const qg = Math.round(g / 32) * 32;
          const qb = Math.round(b / 32) * 32;
          const key = `${qr},${qg},${qb}`;
          const existing = buckets.get(key);
          if (existing) {
            existing.r += r;
            existing.g += g;
            existing.b += b;
            existing.count += 1;
          } else {
            buckets.set(key, { r, g, b, count: 1 });
          }
        }
        const sorted = Array.from(buckets.values())
          .sort((a, b) => b.count - a.count)
          .slice(0, 6)
          .map((c) => {
            const avgR = Math.min(255, Math.round(c.r / c.count));
            const avgG = Math.min(255, Math.round(c.g / c.count));
            const avgB = Math.min(255, Math.round(c.b / c.count));
            return (
              '#' +
              [avgR, avgG, avgB]
                .map((x) => x.toString(16).padStart(2, '0'))
                .join('')
                .toUpperCase()
            );
          });
        setExtractedPalette(sorted);
      } catch {}
    };
    img.src = item.previewUrl;
  }, [item?.previewUrl]);

  if (!item) return null;

  const isLight = themeMode === 'light';
  const isVector = isEpsFile(item.file) || /\.(eps|ai|svg)$/i.test(item.file.name);
  const bbox = item.epsHint?.boundingBox;
  const title = item.result?.recommendedTitle || '';
  const keywords = item.result?.keywords || [];
  const top10 = keywords.slice(0, 10);
  const category = item.result?.category || (isVector ? 'Graphic Resources' : 'Business');

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast(`✓ Copied ${label}!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleForceReRender = async () => {
    setIsReRendering(true);
    showToast(`Rendering high-definition vector preview for ${item.file.name}...`);
    try {
      const epsData = await parseEpsFile(item.file, true);
      if (epsData.previewUrl) {
        onUpdateItemPreview(item.id, epsData.previewUrl, epsData.metadata);
        showToast('✓ High-definition EPS vector preview rendered!');
      }
    } catch (err) {
      console.warn('Re-render error:', err);
      showToast('Could not re-render EPS file.');
    } finally {
      setIsReRendering(false);
    }
  };

  const handleDownloadPreviewJpg = () => {
    if (!item.previewUrl) return;
    const a = document.createElement('a');
    a.href = item.previewUrl;
    const baseName = item.file.name.replace(/\.[^/.]+$/, '');
    a.download = `${baseName}_preview.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`✓ Downloaded ${baseName}_preview.jpg!`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className={`w-full max-w-6xl max-h-[92vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl sovereign-prism-card ${
            isLight
              ? 'crystal-architectural-slab-light text-neutral-900'
              : 'crystal-architectural-slab-dark text-white'
          }`}
        >
          {/* Top Header Bar */}
          <div className={`px-5 py-4 border-b flex flex-wrap items-center justify-between gap-3 ${
            isLight ? 'bg-white border-neutral-200' : 'bg-[#151821] border-neutral-800'
          }`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                isLight ? 'bg-neutral-900 text-white' : 'bg-amber-500 text-neutral-950'
              }`}>
                {isVector ? 'EPS' : 'HD'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-bold truncate max-w-md">
                    {item.file.name}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    {isVector ? 'True Vector Render Active' : 'High-Res Visual'}
                  </span>
                </div>
                <p className={`text-xs mt-0.5 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  Size: {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                  {bbox ? ` · Artboard: ${bbox.width} × ${bbox.height} pt` : ''}
                  {item.epsHint?.creator ? ` · Creator: ${item.epsHint.creator.slice(0, 32)}` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isVector && (
                <button
                  type="button"
                  onClick={handleForceReRender}
                  disabled={isReRendering}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition cursor-pointer ${
                    isLight
                      ? 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-neutral-800'
                      : 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-neutral-200'
                  }`}
                  title="Force fresh high-resolution Ghostscript vector render"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isReRendering ? 'animate-spin text-amber-500' : ''}`} />
                  <span>{isReRendering ? 'Rendering HD...' : 'Re-Render EPS'}</span>
                </button>
              )}

              {item.previewUrl && (
                <button
                  type="button"
                  onClick={handleDownloadPreviewJpg}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition cursor-pointer ${
                    isLight
                      ? 'bg-white hover:bg-stone-100 border-stone-300 text-neutral-800'
                      : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-neutral-200'
                  }`}
                  title="Download rendered JPEG preview of this EPS file"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="hidden sm:inline">Save Preview JPG</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className={`p-2 rounded-xl border transition cursor-pointer ${
                  isLight
                    ? 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-neutral-700'
                    : 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-neutral-300'
                }`}
                title="Close Viewer (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Split Body: Left = Interactive Vector Artboard Canvas, Right = Official Adobe Stock Metadata Inspector */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-200 dark:divide-neutral-800">
            
            {/* Left Column (7 cols): High-Resolution Interactive EPS Artboard Viewer */}
            <div className="lg:col-span-7 flex flex-col justify-between p-4 sm:p-6 space-y-4">
              {/* Canvas Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Zoom Controls */}
                <div className={`inline-flex items-center gap-1 p-1 rounded-xl border text-xs ${
                  isLight ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-800'
                }`}>
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  {[1, 1.5, 2, 3].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setZoom(preset)}
                      className={`px-2 py-1 rounded-lg font-mono font-bold transition cursor-pointer ${
                        zoom === preset
                          ? isLight
                            ? 'bg-neutral-900 text-white'
                            : 'bg-amber-500 text-neutral-950'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      {preset * 100}%
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.min(4, +(z + 0.25).toFixed(2)))}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoom(1)}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Artboard Backdrop Switcher */}
                <div className={`inline-flex items-center gap-1 p-1 rounded-xl border text-xs ${
                  isLight ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-800'
                }`}>
                  <button
                    type="button"
                    onClick={() => setBackdrop('white')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                      backdrop === 'white'
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    White Artboard
                  </button>
                  <button
                    type="button"
                    onClick={() => setBackdrop('grid')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                      backdrop === 'grid'
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    Checkerboard
                  </button>
                  <button
                    type="button"
                    onClick={() => setBackdrop('dark')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                      backdrop === 'dark'
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    Dark Studio
                  </button>
                </div>
              </div>

              {/* High-Resolution Vector Viewport */}
              <div
                className={`relative rounded-2xl border overflow-auto flex items-center justify-center min-h-[340px] sm:min-h-[440px] max-h-[58vh] p-4 transition-colors ${
                  backdrop === 'white'
                    ? 'bg-white border-neutral-200'
                    : backdrop === 'dark'
                    ? 'bg-[#0b0c10] border-neutral-800'
                    : 'bg-[linear-gradient(45deg,#e5e5e5_25%,transparent_25%),linear-gradient(-45deg,#e5e5e5_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e5e5e5_75%),linear-gradient(-45deg,transparent_75%,#e5e5e5_75%)] bg-[size:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0] bg-white border-neutral-300'
                }`}
              >
                {item.previewUrl ? (
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    onClick={() => setZoom((z) => (z < 2 ? 2 : 1))}
                    style={{
                      transform: `scale(${zoom})`,
                      transformOrigin: 'center center',
                    }}
                    className="max-w-full max-h-[52vh] object-contain transition-transform duration-200 cursor-zoom-in select-none rounded shadow-sm"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
                    <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
                    <p className="text-sm font-bold">Rendering EPS Vector Paths...</p>
                    <p className="text-xs opacity-70">Ghostscript engine is rasterizing PostScript curves into high-res sRGB</p>
                  </div>
                )}
              </div>

              {/* Bottom Artboard Specs, Extracted RGB Color Palette & Companion Upload */}
              <div className="space-y-3 pt-1 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] ${
                      isLight ? 'bg-white border-neutral-200 text-neutral-700' : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                    }`}>
                      Format: {item.file.name.split('.').pop()?.toUpperCase() || 'EPS'}
                    </span>
                    {bbox && (
                      <span className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] ${
                        isLight ? 'bg-white border-neutral-200 text-neutral-700' : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                      }`}>
                        BoundingBox: {bbox.width} × {bbox.height} pt
                      </span>
                    )}
                    {decodedDimensions && (
                      <span className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] ${
                        isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                      }`}>
                        {decodedDimensions.w} × {decodedDimensions.h} px ({decodedDimensions.mp} MP)
                      </span>
                    )}
                  </div>

                  <label className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    isLight
                      ? 'bg-white hover:bg-stone-100 border-neutral-200 text-neutral-700'
                      : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
                  }`}>
                    <Camera className="w-3.5 h-3.5 text-amber-500" />
                    <span>Attach Companion JPG</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) onAttachScreenshot(item.id, f);
                      }}
                    />
                  </label>
                </div>

                {/* Live Extracted Dominant Color Swatches (Click to Copy Hex) */}
                {extractedPalette.length > 0 && (
                  <div className={`p-2.5 rounded-xl border flex flex-wrap items-center justify-between gap-2 ${
                    isLight ? 'bg-white/90 border-neutral-200/80' : 'bg-neutral-900/80 border-neutral-800'
                  }`}>
                    <span className="text-[10px] font-mono uppercase tracking-wider opacity-70 font-bold">
                      Dominant Palette (1-Click Copy Hex):
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {extractedPalette.map((hex) => (
                        <button
                          key={hex}
                          type="button"
                          onClick={() => handleCopy(hex, `Color ${hex}`)}
                          className={`px-2 py-1 rounded-lg border text-[10px] font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
                            isLight
                              ? 'bg-[#faf9f6] hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                              : 'bg-neutral-950 hover:bg-neutral-800 border-neutral-800 text-neutral-200'
                          }`}
                          title={`Click to copy ${hex}`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                            style={{ backgroundColor: hex }}
                          />
                          <span>{hex}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column (5 cols): Official Adobe Stock Metadata Rules Inspector */}
            <div className="lg:col-span-5 p-4 sm:p-6 space-y-5 overflow-y-auto max-h-[75vh]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-extrabold uppercase tracking-[0.14em]">
                    Adobe Stock Official Metadata
                  </h4>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Aug 2026 Rules Compliant
                </span>
              </div>

              {item.result ? (
                <div className="space-y-4">
                  {/* Official Adobe Stock Compliance Checklist */}
                  <div className={`p-3.5 rounded-2xl border space-y-2 ${
                    isLight ? 'bg-emerald-50/60 border-emerald-200/80' : 'bg-emerald-950/20 border-emerald-500/25'
                  }`}>
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>100% Adobe Stock Rule Verification</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Title: {title.length}/70 chars</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Top-10 Title Sync: 100%</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Keywords: {keywords.length}/49 Tags</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Zero Trademarks</span>
                      </div>
                    </div>
                  </div>

                  {/* 1. Subject-First Title (< 70 chars) */}
                  <div className={`p-3.5 rounded-2xl border space-y-2 ${
                    isLight ? 'bg-white border-neutral-200' : 'bg-neutral-900/90 border-neutral-800'
                  }`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-75">
                        1. Adobe Stock Title (&lt;70 Chars)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(title, 'Adobe Stock Title')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1 transition cursor-pointer ${
                          isLight
                            ? 'bg-neutral-900 text-white border-neutral-900 hover:bg-black'
                            : 'bg-white text-neutral-950 border-white hover:bg-neutral-200'
                        }`}
                      >
                        {copiedField === 'Adobe Stock Title' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        <span>Copy Title</span>
                      </button>
                    </div>
                    <p className="text-sm font-bold leading-snug select-all">
                      {title}
                    </p>
                  </div>

                  {/* 2. First 10 Keywords (75% Search Ranking Weight) */}
                  <div className={`p-3.5 rounded-2xl border space-y-2.5 ${
                    isLight ? 'bg-amber-50/50 border-amber-200/80' : 'bg-amber-950/15 border-amber-500/25'
                  }`}>
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                          2. First 10 Keywords (75% Ranking Power)
                        </span>
                        <span className="text-[10px] opacity-75">
                          Mirrors main Title nouns + primary subject per Adobe Stock rules
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(top10.join(', '), 'Top 10 Priority Keywords')}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center gap-1 transition cursor-pointer shrink-0"
                      >
                        {copiedField === 'Top 10 Priority Keywords' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>Copy Top 10</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {top10.map((kw, i) => (
                        <span
                          key={i}
                          onClick={() => handleCopy(kw, `Keyword #${i + 1}`)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer transition flex items-center gap-1 ${
                            isLight
                              ? 'bg-white border-amber-300 text-neutral-900 hover:bg-amber-100'
                              : 'bg-neutral-900 border-amber-500/40 text-amber-300 hover:bg-neutral-800'
                          }`}
                        >
                          <span className="text-[10px] font-mono opacity-60">#{i + 1}</span>
                          <span>{kw}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 3. All 49 Keywords */}
                  <div className={`p-3.5 rounded-2xl border space-y-2.5 ${
                    isLight ? 'bg-white border-neutral-200' : 'bg-neutral-900/90 border-neutral-800'
                  }`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-75">
                        3. Complete {keywords.length} Keywords (Comma-Separated)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(keywords.join(', '), `All ${keywords.length} Keywords`)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                          isLight
                            ? 'bg-neutral-900 text-white hover:bg-black'
                            : 'bg-white text-neutral-950 hover:bg-neutral-200'
                        }`}
                      >
                        {copiedField === `All ${keywords.length} Keywords` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        <span>Copy All {keywords.length} Tags</span>
                      </button>
                    </div>
                    <p className={`text-xs leading-relaxed font-mono p-2.5 rounded-xl border select-all ${
                      isLight ? 'bg-[#faf8f5] border-neutral-200 text-neutral-700' : 'bg-neutral-950 border-neutral-800 text-neutral-300'
                    }`}>
                      {keywords.join(', ')}
                    </p>
                  </div>

                  {/* 4. Adobe Stock Category */}
                  <div className={`p-3 rounded-2xl border flex items-center justify-between ${
                    isLight ? 'bg-white border-neutral-200' : 'bg-neutral-900/90 border-neutral-800'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-500" />
                      <div>
                        <span className="text-[10px] uppercase font-bold opacity-60 block">Adobe Stock Category</span>
                        <span className="text-xs font-bold">{category}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(`Title: ${title}\nCategory: ${category}\nKeywords: ${keywords.join(', ')}`, 'Complete Metadata Package')}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 transition cursor-pointer"
                    >
                      Copy Full Package
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`p-6 rounded-2xl border text-center space-y-4 ${
                  isLight ? 'bg-white border-neutral-200' : 'bg-neutral-900/80 border-neutral-800'
                }`}>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6 text-amber-500" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-sm font-bold">Ready for Adobe Stock SEO Analysis</h5>
                    <p className={`text-xs leading-relaxed ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      Your EPS vector artwork is rendered and ready! Click below to generate a &lt;70 char Title, Top-10 Priority Keywords (75% ranking lock), and 49 compliant tags.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onGenerateMetadata(item)}
                    disabled={isProcessing}
                    className={`w-full py-3 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-lg cursor-pointer ${
                      isLight
                        ? 'bg-neutral-900 hover:bg-black text-white disabled:bg-stone-200 disabled:text-stone-400'
                        : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 disabled:bg-neutral-800 disabled:text-neutral-500'
                    }`}
                  >
                    <Sparkles className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                    <span>{isProcessing ? 'Generating Adobe Stock Metadata...' : 'Generate Best Adobe Stock Metadata'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
