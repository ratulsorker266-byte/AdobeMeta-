import React, { useState } from 'react';
import { Radar, TrendingUp, Sparkles, Search, ArrowUpRight, Flame, Layers, ExternalLink, Check, Copy, Filter } from 'lucide-react';
import { motion } from 'motion/react';

interface HighDemandNiche {
  id: string;
  nicheTitle: string;
  category: 'Tech & AI' | 'Green & Climate' | 'Healthcare' | 'Industry & Business' | 'Lifestyle';
  buyerSearchVelocity: 'Explosive' | 'Very High' | 'High';
  existingSupplyLevel: 'Very Low' | 'Low' | 'Moderate';
  opportunityScore: number; // 1-100
  suggestedAssetTypes: string[];
  recommendedKeywords: string[];
  sampleWinningTitle: string;
  reason: string;
}

const NICHES_DATA: HighDemandNiche[] = [
  {
    id: 'niche-1',
    nicheTitle: 'Autonomous Drone Fleet Inspections in Solar & Wind Farms',
    category: 'Green & Climate',
    buyerSearchVelocity: 'Explosive',
    existingSupplyLevel: 'Very Low',
    opportunityScore: 98,
    suggestedAssetTypes: ['4K Video', 'Photo', 'Vector Infographic'],
    recommendedKeywords: ['drone inspection', 'renewable energy', 'solar panel farm', 'wind turbine technician', 'autonomous aerial drone', 'clean technology', 'predictive maintenance', 'green infrastructure'],
    sampleWinningTitle: 'Autonomous Industrial Drone Inspecting Modern Solar Farm and Wind Turbines at Sunrise',
    reason: 'Energy corporations and B2B media are actively buying clean energy tech assets, but 90% of stock photos are generic lightbulbs.'
  },
  {
    id: 'niche-2',
    nicheTitle: 'Senior Citizens & Elderly Adults using Smart Health Wearables & AR',
    category: 'Healthcare',
    buyerSearchVelocity: 'Explosive',
    existingSupplyLevel: 'Very Low',
    opportunityScore: 96,
    suggestedAssetTypes: ['Authentic Photo', 'Lifestyle Portrait', 'AI Illustration'],
    recommendedKeywords: ['elderly technology', 'senior smart watch', 'telehealth consultation', 'digital health monitoring', 'active aging', 'geriatric wellness', 'wearable bio sensor', 'retirement lifestyle'],
    sampleWinningTitle: 'Smiling Senior Woman Checking Vital Signs on Smart Health Watch During Morning Routine',
    reason: 'Global healthcare providers are digitizing rapidly. Existing stock models look staged or depressed; natural, empowered seniors sell out immediately.'
  },
  {
    id: 'niche-3',
    nicheTitle: 'Green Hydrogen Production & Industrial Electrolyzer Plants',
    category: 'Industry & Business',
    buyerSearchVelocity: 'Very High',
    existingSupplyLevel: 'Very Low',
    opportunityScore: 95,
    suggestedAssetTypes: ['3D Isometric Vector', 'Clean Photo', 'Diagram'],
    recommendedKeywords: ['green hydrogen', 'electrolysis plant', 'clean fuel technology', 'hydrogen energy storage', 'decarbonization', 'sustainable industry', 'zero emissions power', 'chemical engineer'],
    sampleWinningTitle: 'Clean Energy Industrial Green Hydrogen Electrolyzer Plant Facility with Blue Piping Systems',
    reason: 'Government and corporate ESG reports have massive budgets for hydrogen graphics, yet stock libraries have almost zero authentic representation.'
  },
  {
    id: 'niche-4',
    nicheTitle: 'Humanoid Robotics in Warehouse Logistics & Automated Supply Chain',
    category: 'Tech & AI',
    buyerSearchVelocity: 'Explosive',
    existingSupplyLevel: 'Low',
    opportunityScore: 94,
    suggestedAssetTypes: ['Realistic AI Photography', 'Vector UI', 'Illustration'],
    recommendedKeywords: ['humanoid robot', 'automated warehouse', 'smart logistics', 'artificial intelligence worker', 'industrial robotics', 'e-commerce fulfillment', 'autonomous sorting', 'supply chain automation'],
    sampleWinningTitle: 'Modern Humanoid Robot Collaborating with Warehouse Worker to Organize Delivery Packages',
    reason: 'Logistics firms, startups, and tech blogs require futuristic yet realistic AI robots working alongside real people.'
  },
  {
    id: 'niche-5',
    nicheTitle: 'Neurodivergent & ADHD Modern Workplace Accommodations',
    category: 'Lifestyle',
    buyerSearchVelocity: 'High',
    existingSupplyLevel: 'Very Low',
    opportunityScore: 92,
    suggestedAssetTypes: ['Commercial Photo', 'Flat Vector', 'Icon Set'],
    recommendedKeywords: ['neurodiversity workplace', 'adhd professional', 'sensory friendly office', 'inclusive workplace', 'mental health corporate', 'focus tools', 'workplace diversity', 'calm workspace'],
    sampleWinningTitle: 'Diverse Professional Using Noise Cancelling Headphones in Sensory Friendly Modern Office Space',
    reason: 'HR departments and enterprise companies are investing heavily in DE&I imagery focusing on mental health and neuroinclusivity.'
  },
  {
    id: 'niche-6',
    nicheTitle: 'Smart Vertical Farming & Automated Hydroponic Agriculture',
    category: 'Green & Climate',
    buyerSearchVelocity: 'Very High',
    existingSupplyLevel: 'Low',
    opportunityScore: 91,
    suggestedAssetTypes: ['High-Res Photo', 'AI Synthesis', 'Vector Blueprint'],
    recommendedKeywords: ['vertical farming', 'smart agriculture', 'indoor hydroponics', 'led grow lights', 'sustainable food production', 'agritech farm', 'urban agriculture', 'automated harvest'],
    sampleWinningTitle: 'Agritech Scientist Inspecting Fresh Greens in Modern Indoor Vertical Hydroponic Farm Facility',
    reason: 'Food tech and climate venture funds constantly license vertical agriculture images for investor presentations.'
  }
];

export const NicheRadarModal = ({
  isOpen,
  onClose,
  onSelectNiche,
  showToast,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectNiche?: (concept: string, keywords: string[]) => void;
  showToast: (msg: string) => void;
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = ['All', 'Green & Climate', 'Tech & AI', 'Healthcare', 'Industry & Business', 'Lifestyle'];

  const filteredNiches = NICHES_DATA.filter((n) => {
    const matchesCat = selectedCategory === 'All' || n.category === selectedCategory;
    const matchesSearch =
      n.nicheTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.recommendedKeywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleCopyKeywords = (keywords: string[], id: string) => {
    navigator.clipboard.writeText(keywords.join(', '));
    setCopiedId(id);
    showToast('High-demand keywords copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-5xl w-full p-6 md:p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500" />

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                <Radar className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                Real-Time Niche Opportunity Radar <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">High Demand • Low Competition</span>
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Zero-in on untapped microstock markets with massive buyer search volume and almost zero existing competition.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition font-bold"
          >
            ✕
          </button>
        </div>

        {/* Category & Search Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search niche topics..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Niche Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto pr-2">
          {filteredNiches.map((niche) => (
            <div
              key={niche.id}
              className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-4 hover:border-amber-500/50 transition relative group"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider mb-1">
                    <span className="text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded">
                      {niche.category}
                    </span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Flame className="w-3 h-3" /> {niche.buyerSearchVelocity} Demand
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug group-hover:text-amber-300 transition">
                    {niche.nicheTitle}
                  </h3>
                </div>

                <div className="text-right shrink-0 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">Opportunity</span>
                  <span className="text-lg font-black text-amber-400">{niche.opportunityScore}</span>
                  <span className="text-[10px] text-slate-500">/100</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {niche.reason}
              </p>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Top-Performing Title Concept:
                </span>
                <p className="text-xs font-semibold text-slate-200 italic">
                  "{niche.sampleWinningTitle}"
                </p>
              </div>

              {/* Tags and Action */}
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {niche.recommendedKeywords.slice(0, 5).map((kw) => (
                    <span key={kw} className="bg-slate-900 text-slate-400 text-[10px] px-2 py-0.5 rounded border border-slate-800">
                      {kw}
                    </span>
                  ))}
                  {niche.recommendedKeywords.length > 5 && (
                    <span className="text-[10px] text-slate-500 self-center">
                      +{niche.recommendedKeywords.length - 5} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                  <button
                    onClick={() => handleCopyKeywords(niche.recommendedKeywords, niche.id)}
                    className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedId === niche.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === niche.id ? 'Copied' : 'Copy Tags'}</span>
                  </button>

                  {onSelectNiche && (
                    <button
                      onClick={() => {
                        onSelectNiche(niche.sampleWinningTitle, niche.recommendedKeywords);
                        showToast(`Niche "${niche.nicheTitle}" loaded into Studio!`);
                        onClose();
                      }}
                      className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold px-3 py-1 rounded-lg transition flex items-center gap-1"
                    >
                      <span>Create for this Niche</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
