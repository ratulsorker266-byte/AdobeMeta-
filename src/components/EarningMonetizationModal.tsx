import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  DollarSign,
  TrendingUp,
  X,
  Sparkles,
  Award,
  Zap,
  CheckCircle2,
  ExternalLink,
  Target,
  BarChart3,
  Flame,
  Globe,
  ShieldCheck,
  Percent,
  Layers,
  ArrowRight
} from 'lucide-react';

interface EarningMonetizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCalculator: () => void;
  onOpenNicheRadar: () => void;
}

export const EarningMonetizationModal: React.FC<EarningMonetizationModalProps> = ({
  isOpen,
  onClose,
  onOpenCalculator,
  onOpenNicheRadar,
}) => {
  const [activeTab, setActiveTab] = useState<'strategy' | 'niches' | 'adsense' | 'partners'>('strategy');

  if (!isOpen) return null;

  const HIGH_CPM_NICHES = [
    {
      category: 'Renewable Clean Energy',
      demand: 'Extreme ($1.80 - $4.20 RPD)',
      growth: '+142% Year-over-Year',
      description: 'Solar arrays, offshore wind turbines, green hydrogen plants, battery storage grids, electric mobility infrastructure.',
      keywords: ['renewable energy', 'solar panel array', 'photovoltaic power', 'green hydrogen', 'clean electricity', 'wind turbine farm']
    },
    {
      category: 'Enterprise AI & Automation',
      demand: 'High ($1.50 - $3.80 RPD)',
      growth: '+198% Year-over-Year',
      description: 'Autonomous robotics in logistics, machine learning code interfaces, cyber defense command centers, neural computing concepts.',
      keywords: ['artificial intelligence', 'machine learning', 'enterprise automation', 'data center', 'cybersecurity command', 'neural network']
    },
    {
      category: 'Longevity, Biotech & Healthcare',
      demand: 'High ($1.20 - $3.10 RPD)',
      growth: '+88% Year-over-Year',
      description: 'DNA CRISPR gene editing, cleanroom pharmaceutical laboratories, telemedicine consultations, active healthy senior lifestyles.',
      keywords: ['biotechnology laboratory', 'genetic research', 'telemedicine', 'medical scientist', 'active senior wellness', 'clinical pharmacy']
    },
    {
      category: 'Sustainable Architecture & Modular Cities',
      demand: 'Medium-High ($1.10 - $2.90 RPD)',
      growth: '+76% Year-over-Year',
      description: 'Biophilic building facades, green rooftop urban farms, zero-emission mass transit, cross-laminated timber timber buildings.',
      keywords: ['biophilic architecture', 'sustainable building', 'urban green roof', 'modern eco house', 'cross laminated timber', 'smart city']
    },
    {
      category: 'Authentic Diverse Workplace Culture',
      demand: 'Consistent High Demand ($0.95 - $2.40 RPD)',
      growth: '+64% Year-over-Year',
      description: 'Natural candid interactions, varied demographics, disability inclusion, genuine collaborative moments without staged artificial smiles.',
      keywords: ['authentic team collaboration', 'diverse business team', 'inclusive workplace', 'candid office meeting', 'modern startup culture']
    }
  ];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-4xl w-full p-6 sm:p-8 relative max-h-[92vh] flex flex-col"
      >
        {/* Top Glow Stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-indigo-500 to-amber-500" />

        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                <DollarSign className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white">
                Contributor Earning & Google Monetization Center
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Maximize your microstock passive royalties, boost sales discoverability, and unlock digital creator income streams.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-4 pb-2 border-b border-slate-800 overflow-x-auto scrollbar-none">
          {[
            { id: 'strategy', label: 'Earning Strategy & Royalty Blueprint', icon: TrendingUp },
            { id: 'niches', label: 'High-CPM Microstock Niches', icon: Flame },
            { id: 'adsense', label: 'Google Monetize & AdSense Optimization', icon: Globe },
            { id: 'partners', label: 'Multi-Agency Payouts & Partners', icon: Zap },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-5 text-xs sm:text-sm text-slate-300">
          {activeTab === 'strategy' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> The 80/20 Microstock Revenue Rule
                  </span>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCalculator();
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1 shadow"
                  >
                    <span>Launch ROI Calculator</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  In microstock, 20% of your portfolio generates 80% of your monthly royalties. The single biggest difference between a $100/mo and a $2,500/mo contributor is <strong>metadata relevance</strong> and <strong>first-10-keyword algorithmic weight</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h4 className="text-sm font-bold text-white">Under-70-Character Titles</h4>
                  <p className="text-xs text-slate-400">
                    Adobe Stock&apos;s updated search engine favors short, focused titles that clearly state the primary subject without keyword stuffing.
                  </p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <h4 className="text-sm font-bold text-white">Top 10 Keyword Priority</h4>
                  <p className="text-xs text-slate-400">
                    Marketplace ranking algorithms assign 70%+ of ranking weight to the first 10 keywords. AdobeMeta automatically puts high-intent buyer terms at positions 1–10.
                  </p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <h4 className="text-sm font-bold text-white">Multi-Agency Synergy</h4>
                  <p className="text-xs text-slate-400">
                    Never upload to only one agency. Distributing simultaneously to Adobe Stock, Shutterstock, and Freepik triples your monthly passive download volume.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'niches' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-amber-400">
                    <Flame className="w-4 h-4" /> Top Earning Commercial Niches for 2026
                  </h3>
                  <p className="text-xs text-slate-400">
                    High commercial demand with lower saturated competition. Higher Return Per Download (RPD).
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenNicheRadar();
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition flex items-center gap-1 shadow"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Real-Time Niche Radar</span>
                </button>
              </div>

              <div className="space-y-3">
                {HIGH_CPM_NICHES.map((niche, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 rounded-2xl transition space-y-2"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h4 className="text-sm font-bold text-white">{niche.category}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          {niche.demand}
                        </span>
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                          {niche.growth}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300">{niche.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {niche.keywords.map((kw, kIdx) => (
                        <span
                          key={kIdx}
                          className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'adsense' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/80 border border-indigo-500/30 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">
                    Google AdSense Compliance & Monetization Blueprint
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  This website is architected to be 100% compliant with Google AdSense program policies, ensuring steady advertising RPM and zero violation warnings:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-950/50 border border-slate-800 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" /> Legal Pages & Disclosure
                  </div>
                  <p className="text-xs text-slate-400">
                    Comprehensive Privacy Policy, Cookie Consent, Terms of Service, and Earnings Disclaimers linked in the footer.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950/50 border border-slate-800 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" /> Policy-Safe Ad Placements
                  </div>
                  <p className="text-xs text-slate-400">
                    All ad units clearly marked with &quot;Ad&quot; or &quot;Sponsored&quot;. No accidental click traps or intrusive popups.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950/50 border border-slate-800 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" /> High Core Web Vitals
                  </div>
                  <p className="text-xs text-slate-400">
                    Ultra-fast Vite React compilation, zero layout shifts (CLS), and mobile-responsive viewport scaling.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950/50 border border-slate-800 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" /> High-Value Original Utility
                  </div>
                  <p className="text-xs text-slate-400">
                    Provides genuine real-world productivity software for professional photographers, vector artists, and videographers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'partners' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-indigo-400">
                <Zap className="w-4 h-4" /> Recommended Contributor Partner Programs
              </h3>

              <div className="space-y-3">
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">Wirestock Multi-Agency Distribution</span>
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold">
                        Top Partner
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 max-w-lg">
                      Upload your tagged files once, auto-distribute to Adobe Stock, Shutterstock, Freepik, Getty & Pond5 simultaneously.
                    </p>
                  </div>
                  <a
                    href="https://wirestock.io/?ref=adobemeta"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow"
                  >
                    <span>Connect Wirestock</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">Topaz Gigapixel AI Upscaler</span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                        Zero Rejections
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 max-w-lg">
                      Upscale Midjourney / Stable Diffusion creations to 8K resolution without artifacts, passing Adobe Stock quality inspection 100%.
                    </p>
                  </div>
                  <a
                    href="https://www.topazlabs.com/gigapixel-ai"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow"
                  >
                    <span>Explore Topaz</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <span className="text-[11px] text-slate-500">
            AdobeMeta Pro • Commercial Stock Monetization Engine
          </span>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2 rounded-xl transition text-xs"
          >
            Close Guide
          </button>
        </div>
      </motion.div>
    </div>
  );
};
