import React, { useState } from 'react';
import { Sparkles, Copy, Check, Filter, Trash2, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

const COMMON_SPAM_WORDS = new Set([
  'best', 'amazing', 'super', 'awesome', 'cool', 'nice', 'photo', 'image', 'picture', 'shot',
  'wallpaper', 'hd', '4k', '8k', 'download', 'free', 'buy', 'stock', 'click', 'graphic', 'isolated',
  'vector', 'background'
]);

export const KeywordCleanerModal = ({
  isOpen,
  onClose,
  showToast,
}: {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}) => {
  const [rawText, setRawText] = useState('');
  const [removeSpam, setRemoveSpam] = useState(true);
  const [removeSingularPlural, setRemoveSingularPlural] = useState(true);
  const [maxKeywordLimit, setMaxKeywordLimit] = useState<number>(49);
  const [cleanedKeywords, setCleanedKeywords] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCleanKeywords = () => {
    if (!rawText.trim()) return;

    // Split by comma, newline, tab or semicolon
    const items = rawText
      .split(/[,;\n\r\t]+/)
      .map((k) => k.replace(/["'#.]/g, '').trim())
      .filter((k) => k.length > 1);

    const seen = new Set<string>();
    const cleaned: string[] = [];

    items.forEach((k) => {
      const lower = k.toLowerCase();
      // Spam filter
      if (removeSpam && COMMON_SPAM_WORDS.has(lower)) {
        return;
      }
      // Deduplicate case-insensitively
      if (!seen.has(lower)) {
        seen.add(lower);
        cleaned.push(lower);
      }
    });

    // Enforce limit
    const finalResult = cleaned.slice(0, maxKeywordLimit);
    setCleanedKeywords(finalResult);
    showToast(`Cleaned & deduplicated ${finalResult.length} tags!`);
  };

  const handleCopy = () => {
    if (cleanedKeywords.length === 0) return;
    navigator.clipboard.writeText(cleanedKeywords.join(', '));
    setCopied(true);
    showToast('Copied cleaned tags to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-3xl w-full p-6 md:p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500" />

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400">
                <Filter className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                Duplicate & Spam Tag Eliminator
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Clean old keyword lists, strip spam/banned terms, deduplicate case-insensitively, and format cleanly for any stock agency.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition font-bold"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">
              Paste comma, newline, or tab separated keywords
            </label>
            <textarea
              rows={5}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="e.g. business, office, work, Business, WORK, laptop, best wallpaper, hd picture, coffee, desk..."
              className="w-full bg-slate-950/80 border border-slate-700 rounded-2xl p-4 text-xs md:text-sm text-white focus:outline-none focus:border-teal-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/50 p-4 rounded-2xl border border-slate-800 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold">
              <input
                type="checkbox"
                checked={removeSpam}
                onChange={(e) => setRemoveSpam(e.target.checked)}
                className="accent-teal-500 w-4 h-4 rounded"
              />
              <span>Remove Spam / Banned Words</span>
            </label>

            <div className="col-span-2 flex items-center justify-end gap-2">
              <span className="text-slate-400 font-semibold">Limit to:</span>
              <button
                type="button"
                onClick={() => setMaxKeywordLimit(30)}
                className={`px-2.5 py-1 rounded-lg font-bold ${maxKeywordLimit === 30 ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
              >
                30 (Freepik)
              </button>
              <button
                type="button"
                onClick={() => setMaxKeywordLimit(49)}
                className={`px-2.5 py-1 rounded-lg font-bold ${maxKeywordLimit === 49 ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
              >
                49 (Adobe)
              </button>
              <button
                type="button"
                onClick={() => setMaxKeywordLimit(50)}
                className={`px-2.5 py-1 rounded-lg font-bold ${maxKeywordLimit === 50 ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
              >
                50 (Shutterstock)
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCleanKeywords}
              disabled={!rawText.trim()}
              className="flex-1 py-3 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Clean & Deduplicate Tags</span>
            </button>
            <button
              onClick={() => {
                setRawText('');
                setCleanedKeywords([]);
              }}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {cleanedKeywords.length > 0 && (
            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Cleaned Tags ({cleanedKeywords.length})
                </span>
                <button
                  onClick={handleCopy}
                  className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied All!' : 'Copy Clean List'}</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                {cleanedKeywords.map((kw, i) => (
                  <span
                    key={kw}
                    className="bg-teal-950/60 border border-teal-800/40 text-teal-300 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1"
                  >
                    <span className="text-[10px] text-teal-500/70 font-mono">{i + 1}.</span>
                    <span>{kw}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
