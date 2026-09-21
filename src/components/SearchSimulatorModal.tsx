import React, { useState } from 'react';
import { Eye, Search, Layers, ExternalLink, SlidersHorizontal, Check, Copy, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface EngineSimResult {
  title: string;
  keywords: string[];
  thumbnailUrl?: string;
  category?: string;
}

export const SearchSimulatorModal = ({
  isOpen,
  onClose,
  sampleItem,
  showToast,
}: {
  isOpen: boolean;
  onClose: () => void;
  sampleItem?: EngineSimResult | null;
  showToast: (msg: string) => void;
}) => {
  const [activeTab, setActiveTab] = useState<'side-by-side' | 'adobe' | 'shutterstock'>('side-by-side');
  const [activeFilter, setActiveFilter] = useState<string>('relevance');

  if (!isOpen) return null;

  const itemTitle = sampleItem?.title || 'Diverse Business Team Collaborating in Modern Sustainable Solar Office Space';
  const itemKeywords = sampleItem?.keywords || ['business team', 'solar energy', 'modern office', 'collaboration', 'clean tech', 'corporate meeting', 'diverse group', 'sustainability', 'professionals'];
  const previewImg = sampleItem?.thumbnailUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-5xl w-full p-6 md:p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-rose-600" />

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
                <Search className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                Dual Agency Search Engine Simulator <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Live Buyer View</span>
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Visualize how buyers actually see and discover your content on Adobe Stock vs Shutterstock search results pages.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition font-bold"
          >
            ✕
          </button>
        </div>

        {/* View Switcher */}
        <div className="flex items-center justify-between gap-3 mb-6 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('side-by-side')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'side-by-side' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Side-by-Side View
            </button>
            <button
              onClick={() => setActiveTab('adobe')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'adobe' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Adobe Stock Only
            </button>
            <button
              onClick={() => setActiveTab('shutterstock')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'shutterstock' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Shutterstock Only
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 pr-2">
            <span className="font-semibold">Simulated Buyer Sort:</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-white font-mono text-[11px]">Most Relevant</span>
          </div>
        </div>

        {/* Simulator Content */}
        <div className={`grid gap-6 ${activeTab === 'side-by-side' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Adobe Stock Buyer Simulation */}
          {(activeTab === 'side-by-side' || activeTab === 'adobe') && (
            <div className="bg-slate-950 border border-blue-900/40 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Adobe Stock Catalog View</span>
                </div>
                <span className="text-[10px] text-blue-400 font-bold bg-blue-950/60 border border-blue-800/40 px-2 py-0.5 rounded">
                  Sensei AI Search Ranked
                </span>
              </div>

              {/* Simulated Card */}
              <div className="bg-slate-900/90 rounded-xl overflow-hidden border border-slate-800 group">
                <div className="relative aspect-[16/10] bg-slate-950 flex items-center justify-center overflow-hidden">
                  <img src={previewImg} alt={itemTitle} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white px-2 py-0.5 rounded">
                    Adobe Stock #92847192
                  </div>
                  <div className="absolute bottom-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow">
                    License
                  </div>
                </div>
                <div className="p-3.5 space-y-2">
                  <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{itemTitle}</h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>By: Contributor Pro</span>
                    <span className="text-emerald-400 font-semibold">Standard Commercial</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[9px] uppercase font-bold text-slate-500 block mb-1">
                      Adobe High-Weight Index Tags (First 10):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {itemKeywords.slice(0, 7).map((kw, i) => (
                        <span key={i} className="text-[9px] bg-blue-950/60 text-blue-300 border border-blue-800/30 px-1.5 py-0.5 rounded">
                          #{i + 1} {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                <div className="flex items-center gap-1.5 text-blue-300 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Adobe Stock Algorithm Indexing Signals:</span>
                </div>
                <p>• Sensei scans image composition + matches first 5 keywords against customer query.</p>
                <p>• Clean title with 8-12 words without comma stuffing provides maximum Click-Through Rate (CTR).</p>
              </div>
            </div>
          )}

          {/* Shutterstock Buyer Simulation */}
          {(activeTab === 'side-by-side' || activeTab === 'shutterstock') && (
            <div className="bg-slate-950 border border-rose-900/40 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Shutterstock mSearch Grid</span>
                </div>
                <span className="text-[10px] text-rose-400 font-bold bg-rose-950/60 border border-rose-800/40 px-2 py-0.5 rounded">
                  Editorial / Commercial
                </span>
              </div>

              {/* Simulated Card */}
              <div className="bg-slate-900/90 rounded-xl overflow-hidden border border-slate-800 group">
                <div className="relative aspect-[16/10] bg-slate-950 flex items-center justify-center overflow-hidden">
                  <img src={previewImg} alt={itemTitle} className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-[10px] font-mono text-slate-300 px-2 py-0.5 rounded">
                    Royalty-free stock photo
                  </div>
                  <div className="absolute top-2 right-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow">
                    Download
                  </div>
                </div>
                <div className="p-3.5 space-y-2">
                  <h4 className="text-xs font-bold text-slate-100 line-clamp-2 leading-relaxed">{itemTitle}</h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="text-rose-300 font-mono text-[10px]">ID: 24891029</span>
                    <span>JPEG • 6000 x 4000 px</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[9px] uppercase font-bold text-slate-500 block mb-1">
                      Related Tag Filters Generated:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {itemKeywords.slice(0, 6).map((kw, i) => (
                        <span key={i} className="text-[9px] bg-rose-950/60 text-rose-300 border border-rose-800/30 px-1.5 py-0.5 rounded">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                <div className="flex items-center gap-1.5 text-rose-300 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Shutterstock mSearch Signals:</span>
                </div>
                <p>• Minimum 5 words required in description; narrative captions rank 30% higher.</p>
                <p>• Up to 50 tags accepted; full coverage across synonyms drives international buyer hits.</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              showToast('Simulation complete. Asset is visually optimized!');
              onClose();
            }}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-lg"
          >
            Ready to Export Metadata
          </button>
        </div>
      </motion.div>
    </div>
  );
};
