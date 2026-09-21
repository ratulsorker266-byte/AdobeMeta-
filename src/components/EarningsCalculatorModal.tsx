import React, { useState } from 'react';
import { DollarSign, TrendingUp, Calculator, ArrowRight, ShieldCheck, Award, Zap, HelpCircle, Layers, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const EarningsCalculatorModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [portfolioSize, setPortfolioSize] = useState<number>(350);
  const [monthlyUploads, setMonthlyUploads] = useState<number>(60);
  const [assetType, setAssetType] = useState<'mixed' | 'photo' | 'vector' | 'ai'>('mixed');
  const [qualityTier, setQualityTier] = useState<'average' | 'high' | 'pro'>('high');
  const [selectedAgencies, setSelectedAgencies] = useState<{ [key: string]: boolean }>({
    adobe: true,
    shutterstock: true,
    freepik: true,
    getty: false,
    vecteezy: true,
  });

  if (!isOpen) return null;

  // Base download rates per asset per month based on quality and agency
  const agencyRates: { [key: string]: { name: string; rpd: number; dpa: number } } = {
    adobe: { name: 'Adobe Stock', rpd: 0.95, dpa: 0.28 },
    shutterstock: { name: 'Shutterstock', rpd: 0.58, dpa: 0.22 },
    freepik: { name: 'Freepik', rpd: 0.12, dpa: 1.10 },
    getty: { name: 'Getty / iStock', rpd: 1.45, dpa: 0.14 },
    vecteezy: { name: 'Vecteezy', rpd: 0.25, dpa: 0.45 },
  };

  const qualityMultiplier = qualityTier === 'average' ? 0.75 : qualityTier === 'high' ? 1.25 : 1.85;
  const assetMultiplier = assetType === 'vector' ? 1.3 : assetType === 'ai' ? 1.15 : assetType === 'photo' ? 1.0 : 1.1;

  // Calculate monthly earnings per enabled agency
  let totalMonthlyEarnings = 0;
  const agencyBreakdown: { name: string; earnings: number; downloads: number }[] = [];

  Object.keys(selectedAgencies).forEach((key) => {
    if (selectedAgencies[key]) {
      const cfg = agencyRates[key];
      const monthlyDownloads = Math.round(portfolioSize * cfg.dpa * qualityMultiplier * assetMultiplier);
      const earnings = Number((monthlyDownloads * cfg.rpd).toFixed(2));
      totalMonthlyEarnings += earnings;
      agencyBreakdown.push({
        name: cfg.name,
        earnings,
        downloads: monthlyDownloads,
      });
    }
  });

  // Annual projection factoring compounding new uploads
  const oneYearPortfolio = portfolioSize + monthlyUploads * 12;
  const annualProjectedEarnings = Math.round(totalMonthlyEarnings * 12 * 1.35); // 35% compound growth from added assets

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-4xl w-full p-6 md:p-8 relative overflow-hidden"
      >
        {/* Glow Header */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-indigo-500 to-amber-500" />

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                <Calculator className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white">
                Microstock Earnings & ROI Calculator
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Estimate your monthly passive income and annual returns based on real microstock contributor benchmark metrics.
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
          {/* Controls */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-slate-300">Current Portfolio Size (Accepted Files)</span>
                <span className="text-emerald-400 font-bold">{portfolioSize.toLocaleString()} assets</span>
              </div>
              <input
                type="range"
                min="50"
                max="10000"
                step="50"
                value={portfolioSize}
                onChange={(e) => setPortfolioSize(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>50 beginner</span>
                <span>1,000 mid-tier</span>
                <span>5,000+ pro</span>
                <span>10,000 top studio</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-slate-300">New Monthly Uploads</span>
                <span className="text-indigo-400 font-bold">+{monthlyUploads} files / mo</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={monthlyUploads}
                onChange={(e) => setMonthlyUploads(Number(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Projected 1-Year Portfolio: <strong className="text-slate-200">{oneYearPortfolio.toLocaleString()} files</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Asset Category</label>
                <select
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="mixed">Mixed Portfolio</option>
                  <option value="vector">Vectors & Illustrations (+30% RPD)</option>
                  <option value="photo">Commercial Photography</option>
                  <option value="ai">AI Generated (+15% Velocity)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Commercial Quality Tier</label>
                <select
                  value={qualityTier}
                  onChange={(e) => setQualityTier(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="average">Standard / Hobbyist</option>
                  <option value="high">High Commercial (Good SEO)</option>
                  <option value="pro">Pro Agency (Top 10 Ranked)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-2">Target Stock Agencies</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.keys(agencyRates).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      setSelectedAgencies((prev) => ({
                        ...prev,
                        [key]: !prev[key],
                      }))
                    }
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition text-left ${
                      selectedAgencies[key]
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${selectedAgencies[key] ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span className="truncate">{agencyRates[key].name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Projection */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-slate-950/70 border border-slate-800 p-6 rounded-2xl">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> Estimated Income Projection
              </span>

              <div className="mt-4 mb-6">
                <div className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-baseline gap-2">
                  <span>${totalMonthlyEarnings.toLocaleString()}</span>
                  <span className="text-sm font-semibold text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Estimated <strong className="text-amber-400">${annualProjectedEarnings.toLocaleString()} / year</strong> passive revenue with compounding new uploads.
                </p>
              </div>

              {/* Agency Breakdown Table */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Agency Monthly Revenue Share</h4>
                {agencyBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
                    <span className="font-semibold text-slate-200">{item.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400">{item.downloads} downloads</span>
                      <span className="font-bold text-emerald-400">${item.earnings.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Rank higher with AdobeMeta Pro Top-10 Tag Optimization</span>
              </div>
              <button
                onClick={onClose}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl transition shadow-lg shadow-emerald-600/20"
              >
                Apply to My Assets
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
