import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, RefreshCw, Check, Copy, Sparkles, ArrowRight, Zap, Ban } from 'lucide-react';
import { motion } from 'motion/react';

// Comprehensive microstock trademark & prohibited brand dictionary with instant generic replacements
const TRADEMARK_DATABASE: { [brand: string]: { category: string; risk: 'critical' | 'high' | 'moderate'; safeAlternative: string; reason: string } } = {
  // Tech & Hardware
  'iphone': { category: 'Tech Brand', risk: 'critical', safeAlternative: 'smartphone, modern mobile device, touchscreen phone', reason: 'Registered Apple Inc. trademark. Guaranteed account rejection or strike.' },
  'ipad': { category: 'Tech Brand', risk: 'critical', safeAlternative: 'tablet computer, digital tablet, touch device', reason: 'Apple Inc. trademark.' },
  'apple': { category: 'Tech Brand', risk: 'moderate', safeAlternative: 'fresh fruit (if fruit), tech device (if electronic)', reason: 'Avoid tech context usage for electronic subjects.' },
  'macbook': { category: 'Tech Brand', risk: 'critical', safeAlternative: 'laptop computer, modern notebook, portable computer', reason: 'Apple Inc. trademark.' },
  'airpods': { category: 'Tech Brand', risk: 'critical', safeAlternative: 'wireless earbuds, bluetooth headphones, modern audio device', reason: 'Apple Inc. trademark.' },
  'samsung': { category: 'Tech Brand', risk: 'critical', safeAlternative: 'android smartphone, modern mobile display', reason: 'Samsung Electronics Co., Ltd. trademark.' },
  'galaxy': { category: 'Tech Brand', risk: 'moderate', safeAlternative: 'space cosmos (if astronomy), mobile device (if phone)', reason: 'Registered trademark when referring to phones/tablets.' },
  'google': { category: 'Tech Brand', risk: 'critical', safeAlternative: 'search engine, internet search, online technology', reason: 'Google LLC trademark.' },
  'android': { category: 'Tech Brand', risk: 'high', safeAlternative: 'mobile operating system, mobile software', reason: 'Google LLC trademark.' },
  'windows': { category: 'Tech Brand', risk: 'moderate', safeAlternative: 'glass windowpane (if architecture), operating system (if software)', reason: 'Microsoft Corporation trademark.' },
  'microsoft': { category: 'Tech Brand', risk: 'critical', safeAlternative: 'software corporation, office software suite', reason: 'Microsoft Corporation trademark.' },
  'playstation': { category: 'Gaming', risk: 'critical', safeAlternative: 'video game console, gaming device, gamepad', reason: 'Sony Interactive Entertainment trademark.' },
  'xbox': { category: 'Gaming', risk: 'critical', safeAlternative: 'game console, video gaming controller', reason: 'Microsoft Corporation trademark.' },
  'nintendo': { category: 'Gaming', risk: 'critical', safeAlternative: 'handheld gaming console, portable video game', reason: 'Nintendo Co., Ltd. trademark.' },
  'tesla': { category: 'Automotive', risk: 'critical', safeAlternative: 'electric vehicle, modern ev sedan, autonomous car', reason: 'Tesla Motors trademark.' },
  'bmw': { category: 'Automotive', risk: 'critical', safeAlternative: 'luxury sedan, german automobile, modern car', reason: 'Bayerische Motoren Werke AG trademark.' },
  'mercedes': { category: 'Automotive', risk: 'critical', safeAlternative: 'executive sedan, luxury vehicle, modern transport', reason: 'Mercedes-Benz Group AG trademark.' },
  'ferrari': { category: 'Automotive', risk: 'critical', safeAlternative: 'red sports car, exotic supercar, performance vehicle', reason: 'Ferrari N.V. trademark.' },
  'porsche': { category: 'Automotive', risk: 'critical', safeAlternative: 'sports car, luxury coupe, racing automobile', reason: 'Porsche AG trademark.' },
  'nike': { category: 'Apparel', risk: 'critical', safeAlternative: 'athletic running shoes, sports sneakers, workout footwear', reason: 'Nike Inc. registered trademark & swoosh motif.' },
  'adidas': { category: 'Apparel', risk: 'critical', safeAlternative: 'athletic trainers, streetwear sneakers, fitness shoes', reason: 'Adidas AG trademark & three-stripe emblem.' },
  'gucci': { category: 'Fashion', risk: 'critical', safeAlternative: 'designer luxury handbag, Italian fashion accessory', reason: 'Guccio Gucci S.p.A. trademark.' },
  'rolex': { category: 'Luxury', risk: 'critical', safeAlternative: 'luxury Swiss wristwatch, mechanical timepiece', reason: 'Rolex SA trademark.' },
  'coca-cola': { category: 'Beverage', risk: 'critical', safeAlternative: 'carbonated cola soda, fizzy soft drink, refreshing beverage', reason: 'The Coca-Cola Company trademark.' },
  'coke': { category: 'Beverage', risk: 'critical', safeAlternative: 'cola beverage, soda glass with ice', reason: 'The Coca-Cola Company trademark.' },
  'pepsi': { category: 'Beverage', risk: 'critical', safeAlternative: 'carbonated soft drink, blue soda can', reason: 'PepsiCo Inc. trademark.' },
  'starbucks': { category: 'Food & Drink', risk: 'critical', safeAlternative: 'coffeehouse beverage, iced latte cup, coffee to-go', reason: 'Starbucks Corporation trademark.' },
  'mcdonalds': { category: 'Food & Drink', risk: 'critical', safeAlternative: 'fast food burger, takeout fries, quick service restaurant', reason: 'McDonald\'s Corporation trademark.' },
  'disney': { category: 'Entertainment', risk: 'critical', safeAlternative: 'fairy tale castle, theme park entertainment, fantasy kingdom', reason: 'The Walt Disney Company trademark.' },
  'marvel': { category: 'Entertainment', risk: 'critical', safeAlternative: 'superhero comic character, action fiction hero', reason: 'Marvel Characters, Inc. trademark.' },
  'barbie': { category: 'Toys', risk: 'critical', safeAlternative: 'fashion doll, blonde toy figurine, children toy', reason: 'Mattel Inc. trademark.' },
  'lego': { category: 'Toys', risk: 'critical', safeAlternative: 'plastic interlocking bricks, construction toy blocks', reason: 'LEGO Juris A/S trademark.' },
  'instagram': { category: 'Social Media', risk: 'critical', safeAlternative: 'social media mobile app, digital feed, photo sharing application', reason: 'Meta Platforms, Inc. trademark.' },
  'facebook': { category: 'Social Media', risk: 'critical', safeAlternative: 'social network platform, online community interface', reason: 'Meta Platforms, Inc. trademark.' },
  'tiktok': { category: 'Social Media', risk: 'critical', safeAlternative: 'short video mobile platform, vertical video feed', reason: 'ByteDance Ltd. trademark.' },
  'twitter': { category: 'Social Media', risk: 'critical', safeAlternative: 'microblogging network, online news feed', reason: 'X Corp. trademark.' },
  'youtube': { category: 'Social Media', risk: 'critical', safeAlternative: 'video streaming platform, online media portal', reason: 'Google LLC trademark.' },
  'photoshop': { category: 'Software', risk: 'critical', safeAlternative: 'image editing software, digital photo manipulation', reason: 'Adobe Inc. trademark.' },
};

export const TrademarkShieldModal = ({
  isOpen,
  onClose,
  initialTitle,
  initialKeywords,
  onApplyCleaned,
  showToast,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialTitle?: string;
  initialKeywords?: string[];
  onApplyCleaned?: (cleanTitle: string, cleanKeywords: string[]) => void;
  showToast: (msg: string) => void;
}) => {
  const defaultSample = 'Young entrepreneur holding Apple iPhone 15 Pro wearing Nike sneakers drinking Starbucks coffee inside Tesla vehicle';
  const [inputText, setInputText] = useState(
    initialTitle || initialKeywords?.join(', ') || defaultSample
  );
  const [scanResult, setScanResult] = useState<{
    detectedTrademarks: { word: string; category: string; risk: 'critical' | 'high' | 'moderate'; safeAlternative: string; reason: string }[];
    sanitizedText: string;
    accountSafetyScore: number;
    strikeRiskLevel: 'Safe' | 'Warning' | 'High Risk';
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const runScanWithText = React.useCallback((text: string, notify = true) => {
    if (!text || !text.trim()) return;

    const words = text.split(/[\s,;]+/);
    const detected: { word: string; category: string; risk: 'critical' | 'high' | 'moderate'; safeAlternative: string; reason: string }[] = [];
    const seenWords = new Set<string>();

    let safeReplaced = text;

    words.forEach((w) => {
      const cleanW = w.toLowerCase().replace(/[^a-z0-9-]/g, '');
      if (TRADEMARK_DATABASE[cleanW] && !seenWords.has(cleanW)) {
        seenWords.add(cleanW);
        const info = TRADEMARK_DATABASE[cleanW];
        detected.push({
          word: w,
          category: info.category,
          risk: info.risk,
          safeAlternative: info.safeAlternative,
          reason: info.reason,
        });

        // Replace with first safe alternative in sanitized version
        const primaryAlternative = info.safeAlternative.split(',')[0].trim();
        const regex = new RegExp(`\\b${cleanW}\\b`, 'gi');
        safeReplaced = safeReplaced.replace(regex, primaryAlternative);
      }
    });

    const criticalCount = detected.filter((d) => d.risk === 'critical').length;
    const safetyScore = Math.max(10, 100 - criticalCount * 35 - detected.length * 15);
    const strikeRiskLevel = criticalCount > 0 ? 'High Risk' : detected.length > 0 ? 'Warning' : 'Safe';

    setScanResult({
      detectedTrademarks: detected,
      sanitizedText: safeReplaced,
      accountSafetyScore: safetyScore,
      strikeRiskLevel,
    });

    if (notify) {
      if (detected.length === 0) {
        showToast('100% Commercial Clean! No trademarks detected.');
      } else {
        showToast(`Warning: ${detected.length} trademarked terms detected!`);
      }
    }
  }, [showToast]);

  React.useEffect(() => {
    if (isOpen) {
      const textToScan = initialTitle || initialKeywords?.join(', ') || defaultSample;
      setInputText(textToScan);
      runScanWithText(textToScan, false);
    }
  }, [initialTitle, initialKeywords, isOpen, runScanWithText]);

  if (!isOpen) return null;

  const runScan = () => {
    runScanWithText(inputText, true);
  };

  const handleApply = () => {
    if (!scanResult) return;
    if (onApplyCleaned) {
      const parts = scanResult.sanitizedText.split(',').map((s) => s.trim()).filter(Boolean);
      const newTitle = parts[0] || '';
      const newKeywords = parts.slice(1);
      onApplyCleaned(newTitle, newKeywords);
      showToast('Applied safe generic alternatives!');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-4xl w-full p-6 md:p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500" />

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                Automated Trademark & IP Shield <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Account Protection</span>
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Prevent instant account strikes, copyright rejections, and contributor bans across Adobe Stock, Shutterstock, and Freepik.
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
              Input Title, Keywords, or Description to Scan for Trademarks
            </label>
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. Businessman holding Apple iPhone 15 Pro, drinking Starbucks iced coffee in modern office, wearing Nike shoes..."
              className="w-full bg-slate-950/80 border border-slate-700 rounded-2xl p-4 text-xs md:text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={runScan}
              disabled={!inputText.trim()}
              className="flex-1 py-3 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Scan Metadata for Brand Trademarks</span>
            </button>
          </div>

          {scanResult && (
            <div className="space-y-5">
              {/* Score header */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Account Safety Score</span>
                  <div className="text-3xl font-black text-white flex items-baseline gap-1">
                    <span className={scanResult.accountSafetyScore > 80 ? 'text-emerald-400' : scanResult.accountSafetyScore > 50 ? 'text-amber-400' : 'text-rose-400'}>
                      {scanResult.accountSafetyScore}
                    </span>
                    <span className="text-xs text-slate-500">/ 100</span>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Strike Risk Level</span>
                  <div className="flex items-center gap-2 mt-1">
                    {scanResult.strikeRiskLevel === 'Safe' ? (
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black px-3 py-1 rounded-lg flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" /> 100% Commercial Clean
                      </span>
                    ) : scanResult.strikeRiskLevel === 'Warning' ? (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black px-3 py-1 rounded-lg flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" /> Potential Rejection Risk
                      </span>
                    ) : (
                      <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-black px-3 py-1 rounded-lg flex items-center gap-1.5">
                        <Ban className="w-3.5 h-3.5" /> High Strike / Ban Risk
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Trademarks Flagged</span>
                  <div className="text-2xl font-black text-white mt-1">
                    {scanResult.detectedTrademarks.length} Violations
                  </div>
                </div>
              </div>

              {/* Detected items list */}
              {scanResult.detectedTrademarks.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" /> Detected Trademark Infringements & Safe Replacements
                  </h4>
                  <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-1">
                    {scanResult.detectedTrademarks.map((item, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-950/90 border border-rose-900/50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-rose-400 bg-rose-950/60 border border-rose-800/40 px-2 py-0.5 rounded text-[11px] line-through">
                              "{item.word}"
                            </span>
                            <span className="text-slate-500">({item.category})</span>
                            <span className="text-rose-500 font-bold uppercase text-[9px]">{item.risk} risk</span>
                          </div>
                          <p className="text-slate-400 text-[11px]">{item.reason}</p>
                        </div>
                        <div className="bg-emerald-950/40 border border-emerald-500/30 p-2.5 rounded-xl sm:text-right shrink-0">
                          <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">Use Generic Alternative:</span>
                          <span className="font-bold text-emerald-200">{item.safeAlternative}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Sanitized Version Card */}
                  <div className="bg-slate-950/80 border border-emerald-500/30 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" /> 100% Safe Sanitized Output (Ready for Stock Upload)
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(scanResult.sanitizedText);
                          setCopied(true);
                          showToast('Safe metadata copied!');
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-xl transition flex items-center gap-1.5"
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied' : 'Copy Safe Version'}</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-mono bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                      {scanResult.sanitizedText}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl text-center space-y-2">
                  <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">Clean & Safe for Commercial Licensing!</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    No protected brand names, registered hardware models, or trademarked characters were found in this metadata. You are safe from copyright strikes.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
