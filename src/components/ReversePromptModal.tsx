import React, { useState } from 'react';
import { Wand2, Copy, Check, Sparkles, Upload, RefreshCw, Layers, ShieldCheck, ArrowRight, Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';

export const ReversePromptModal = ({
  isOpen,
  onClose,
  customApiKey,
  showToast,
}: {
  isOpen: boolean;
  onClose: () => void;
  customApiKey: string;
  showToast: (msg: string) => void;
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [promptData, setPromptData] = useState<{
    midjourneyPrompt: string;
    fireflyPrompt: string;
    fluxPrompt: string;
    negativePrompt: string;
    styleBreakdown: string;
    lightingAndLens: string;
    commercialReplicationTips: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
      setPromptData(null);
    };
    reader.readAsDataURL(file);
  };

  const handleGeneratePrompts = async () => {
    if (!imagePreview) return;
    setIsGenerating(true);

    try {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (customApiKey) {
        headers['x-api-key'] = customApiKey;
      }

      const res = await fetch('/api/reverse-image-prompt', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          imageBase64: imagePreview,
          mimeType,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reverse engineer image prompt.');
      }

      setPromptData(data);
      showToast('Prompts reverse-engineered successfully!');
    } catch (err: any) {
      showToast(err.message || 'Error reverse engineering prompt');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Copied to clipboard!');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-5xl w-full p-6 md:p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500" />

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
                <Wand2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                AI Reverse Prompt Generator <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Image to Prompt</span>
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Upload any top-selling stock photo or vector to deconstruct its exact Midjourney, Flux.1, and Adobe Firefly prompts with camera lens, lighting, and style parameters.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition font-bold"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Upload & Preview Side */}
          <div className="lg:col-span-4 space-y-4">
            {!imagePreview ? (
              <label className="border-2 border-dashed border-slate-700 hover:border-purple-500 bg-slate-950/60 hover:bg-slate-800/40 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition min-h-[280px]">
                <Upload className="w-10 h-10 text-purple-400 mb-3" />
                <span className="text-sm font-bold text-slate-200">Select or Drop Reference Image</span>
                <span className="text-xs text-slate-500 mt-1">JPG, PNG, WEBP (Any stock visual)</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            ) : (
              <div className="space-y-4">
                <div className="aspect-video sm:aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative group">
                  <img src={imagePreview} alt="Reference" className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition text-xs font-bold text-white gap-2">
                    <Upload className="w-4 h-4" /> Change Image
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>

                <button
                  onClick={handleGeneratePrompts}
                  disabled={isGenerating}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Deconstructing Image Matrix...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Extract Generator Prompts</span>
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl text-xs text-slate-400 space-y-2">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Commercial Stock Safe
              </div>
              <p>Prompts are engineered without trademarked names or artist copyrights to pass Adobe Stock and Shutterstock AI compliance.</p>
            </div>
          </div>

          {/* Results Side */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            {!promptData ? (
              <div className="bg-slate-950/50 border border-dashed border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[360px]">
                <Wand2 className="w-12 h-12 text-slate-700 mb-3" />
                <h3 className="text-lg font-bold text-slate-400">No Image Deconstructed Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Upload a photo or vector on the left and click "Extract Generator Prompts" to get instant prompts for Midjourney, Adobe Firefly, and Flux.1.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2">
                {/* Midjourney Prompt */}
                <div className="bg-slate-950/80 border border-purple-900/40 p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Midjourney v6.1 Prompt
                    </span>
                    <button
                      onClick={() => copyToClipboard(promptData.midjourneyPrompt, 'mj')}
                      className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1 rounded-lg transition"
                    >
                      {copiedKey === 'mj' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'mj' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-mono bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                    {promptData.midjourneyPrompt}
                  </p>
                </div>

                {/* Adobe Firefly Prompt */}
                <div className="bg-slate-950/80 border border-indigo-900/40 p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Adobe Firefly Image 3 Prompt
                    </span>
                    <button
                      onClick={() => copyToClipboard(promptData.fireflyPrompt, 'ff')}
                      className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1 rounded-lg transition"
                    >
                      {copiedKey === 'ff' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'ff' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-mono bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                    {promptData.fireflyPrompt}
                  </p>
                </div>

                {/* Flux.1 Prompt */}
                <div className="bg-slate-950/80 border border-blue-900/40 p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Flux.1 / SDXL Prompt
                    </span>
                    <button
                      onClick={() => copyToClipboard(promptData.fluxPrompt, 'flux')}
                      className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1 rounded-lg transition"
                    >
                      {copiedKey === 'flux' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'flux' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-mono bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                    {promptData.fluxPrompt}
                  </p>
                </div>

                {/* Negative Prompt & Rejection Shield */}
                <div className="bg-slate-950/80 border border-rose-900/40 p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                      Negative Prompt (Anti-Stock Rejection Shield)
                    </span>
                    <button
                      onClick={() => copyToClipboard(promptData.negativePrompt, 'neg')}
                      className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1 rounded-lg transition"
                    >
                      {copiedKey === 'neg' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'neg' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-rose-200 leading-relaxed font-mono bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                    {promptData.negativePrompt}
                  </p>
                </div>

                {/* Lighting & Commercial Tips */}
                {promptData.commercialReplicationTips && (
                  <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-2xl text-xs text-amber-200 flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-amber-300 mb-1">Commercial Production Note:</span>
                      <p className="leading-relaxed">{promptData.commercialReplicationTips}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
