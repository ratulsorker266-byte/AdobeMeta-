import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, ShieldCheck, Download, Copy, Check, Eye, EyeOff, Star, Heart, ShoppingBag, Sparkles, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { BulkItem } from '../types';

interface MarketplaceMockupModalProps {
  item: BulkItem | null;
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const MarketplaceMockupModal: React.FC<MarketplaceMockupModalProps> = ({
  item,
  isOpen,
  onClose,
  showToast,
}) => {
  const [activeMarketplace, setActiveMarketplace] = useState<'adobe' | 'shutterstock' | 'freepik'>('adobe');
  const [showWatermark, setShowWatermark] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen || !item || !item.result) return null;

  const result = item.result;
  const title = result.recommendedTitle || 'Commercial Stock Visual';
  const keywords = result.keywords || [];
  const fakeAssetId = Math.floor(100000000 + Math.random() * 900000000);

  const copyKeywords = () => {
    navigator.clipboard.writeText(keywords.join(', '));
    setCopied(true);
    showToast('Copied all tags to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header with Agency Selector */}
        <div className="px-5 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Live Marketplace Buyer Preview</h3>
                <span className="text-[10px] uppercase tracking-wider font-extrabold bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-0.5 rounded-full">
                  Mockup
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Visualize how international commercial buyers see your visual before submission
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Agency switcher pills */}
            <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setActiveMarketplace('adobe')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeMarketplace === 'adobe'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Adobe Stock
              </button>
              <button
                onClick={() => setActiveMarketplace('shutterstock')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeMarketplace === 'shutterstock'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Shutterstock
              </button>
              <button
                onClick={() => setActiveMarketplace('freepik')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeMarketplace === 'freepik'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Freepik
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mockup Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Simulated Marketplace Container */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
            {/* Simulated Agency Top Banner */}
            <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <span className="font-black tracking-tight text-white flex items-center gap-1.5">
                  {activeMarketplace === 'adobe' && <span className="text-red-500 font-extrabold text-sm">Adobe</span>}
                  {activeMarketplace === 'shutterstock' && <span className="text-rose-500 font-extrabold text-sm">shutterstock</span>}
                  {activeMarketplace === 'freepik' && <span className="text-blue-500 font-extrabold text-sm">freepik</span>}
                  <span className="text-slate-300 font-medium text-xs">
                    {activeMarketplace === 'adobe' ? 'Stock' : activeMarketplace === 'freepik' ? 'Company' : ''}
                  </span>
                </span>
                <span className="hidden sm:inline text-slate-600">|</span>
                <span className="hidden sm:inline text-slate-400">Standard Commercial License</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowWatermark(!showWatermark)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition"
                  title="Toggle agency security watermark grid"
                >
                  {showWatermark ? <EyeOff className="w-3.5 h-3.5 text-indigo-400" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showWatermark ? 'Watermark: ON' : 'Watermark: OFF'}</span>
                </button>
              </div>
            </div>

            {/* Main Stage: Image & Purchase Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
              {/* Left Side: Image with Watermark Simulation */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center group select-none">
                  {item.previewUrl ? (
                    <img
                      src={item.previewUrl}
                      alt={title}
                      className="max-h-[460px] w-full object-contain"
                    />
                  ) : (
                    <div className="h-72 w-full flex items-center justify-center text-slate-500">
                      <ImageIcon className="w-12 h-12 opacity-40" />
                    </div>
                  )}

                  {/* Watermark Overlay */}
                  {showWatermark && (
                    <div className="absolute inset-0 pointer-events-none flex flex-col justify-around overflow-hidden opacity-25">
                      {[...Array(6)].map((_, rIdx) => (
                        <div
                          key={rIdx}
                          className="flex justify-around items-center -rotate-12 whitespace-nowrap text-xs font-black tracking-widest text-white uppercase select-none"
                        >
                          <span>{activeMarketplace === 'adobe' ? 'Adobe Stock' : activeMarketplace === 'shutterstock' ? 'shutterstock' : 'freepik'}</span>
                          <span>#{fakeAssetId}</span>
                          <span>{activeMarketplace === 'adobe' ? 'Adobe Stock' : activeMarketplace === 'shutterstock' ? 'shutterstock' : 'freepik'}</span>
                          <span>#{fakeAssetId}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Commercial Badge in Corner */}
                  <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] text-slate-200 border border-slate-700/60 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Commercial Ready</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 mt-2 px-1">
                  <span>File: {item.file.name}</span>
                  <span>Asset ID: #{fakeAssetId}</span>
                </div>
              </div>

              {/* Right Side: Buyer Purchase & Metadata Specs */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {activeMarketplace === 'adobe' && 'Adobe Stock Contributor Asset'}
                    {activeMarketplace === 'shutterstock' && 'Shutterstock Commercial Catalog'}
                    {activeMarketplace === 'freepik' && 'Freepik Premium Collection'}
                  </div>

                  <h1 className="text-lg font-bold text-white leading-snug">
                    {title}
                  </h1>

                  {/* Rating & Contributor Line */}
                  <div className="flex items-center gap-3 text-xs text-slate-400 pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>4.9</span>
                      <span className="text-slate-500">(Top Selling Tier)</span>
                    </div>
                    <span>•</span>
                    <span className="text-slate-300">By Pro Stock Creator</span>
                  </div>

                  {/* Pricing / Licensing Box */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-400">Standard License</div>
                        <div className="text-lg font-extrabold text-emerald-400">$9.99 USD</div>
                      </div>
                      <span className="text-[11px] bg-emerald-950 text-emerald-300 px-2 py-1 rounded-md font-bold border border-emerald-800/60">
                        High Demand
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
                        onClick={() => showToast('Buyer license action simulation')}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>License Asset</span>
                      </button>
                      <button
                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-700"
                        onClick={() => showToast('Saved to buyer lightbox simulation')}
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-400" />
                        <span>Save to Lightbox</span>
                      </button>
                    </div>
                  </div>

                  {/* Technical Asset Specs */}
                  <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/80 text-xs space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-300">Technical Specifications</div>
                    <div className="grid grid-cols-2 gap-2 text-slate-400 text-[11px]">
                      <div>Format: <span className="text-slate-200 font-medium">JPEG High-Res</span></div>
                      <div>Color Space: <span className="text-slate-200 font-medium">sRGB Commercial</span></div>
                      <div>Release: <span className="text-slate-200 font-medium">{result.modelReleaseRequired ? 'Model Required' : 'Not Required'}</span></div>
                      <div>Orientation: <span className="text-slate-200 font-medium">Landscape / 16:9</span></div>
                    </div>
                  </div>
                </div>

                {/* Keyword Cloud Footer */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">
                      Search Tags ({keywords.length})
                    </span>
                    <button
                      onClick={copyKeywords}
                      className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy All'}</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 bg-slate-950/50 rounded-xl border border-slate-800/60">
                    {keywords.map((kw, i) => (
                      <span
                        key={i}
                        className={`text-[11px] px-2 py-0.5 rounded-md border ${
                          i < 10
                            ? 'bg-indigo-950/60 text-indigo-200 border-indigo-500/30 font-semibold'
                            : 'bg-slate-900 text-slate-300 border-slate-800'
                        }`}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
