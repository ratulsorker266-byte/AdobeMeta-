import React, { useState } from 'react';
import { BookOpen, DollarSign, TrendingUp, ShieldCheck, CheckCircle2, Search, ExternalLink, Sparkles, AlertTriangle, ArrowRight, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface GuideArticle {
  id: string;
  category: 'earnings' | 'seo' | 'compliance' | 'rejection';
  title: string;
  readTime: string;
  summary: string;
  content: string[];
  keyTakeaways: string[];
}

const ARTICLES: GuideArticle[] = [
  {
    id: 'monthly-1000-strategy',
    category: 'earnings',
    title: 'Blueprint: How to Reach $1,000/Month Passive Income from Microstock',
    readTime: '5 min read',
    summary: 'The mathematical roadmap to building a reliable 4-figure monthly income across Adobe Stock, Shutterstock, and Freepik with modern AI & vectors.',
    content: [
      'Reaching $1,000/month requires treating your stock portfolio as a compounding investment asset. In 2026, the average return per download (RPD) sits between $0.40 and $0.95 across major agencies.',
      'To make $1,000 monthly, you need approximately 1,200 to 2,000 monthly downloads. At an average download-per-asset (DPA) rate of 0.25 to 0.40, your target portfolio size should be 3,000 to 5,000 commercially viable assets.',
      'Focus on high-demand, evergreen commercial concepts: healthcare workflows, renewable energy infrastructure, diverse small-business operations, and authentic emotional connections rather than generic objects.',
      'Always distribute your assets across multiple agencies using automated CSV exports to double and triple your revenue per creative creation.'
    ],
    keyTakeaways: [
      'Target Portfolio: 3,000 - 5,000 curated high-relevance assets',
      'Upload frequency: 100 - 200 files every month consistently',
      'Multi-agency distribution multiplies monthly income by 2.8x'
    ]
  },
  {
    id: 'avoid-adobe-rejections',
    category: 'rejection',
    title: 'Top 7 Reasons Adobe Stock & Freepik Reject Assets (And How to Fix Them)',
    readTime: '6 min read',
    summary: 'A deep dive into Quality Issues, Intellectual Property violations, and AI artifacts that cause 90% of contributor rejections.',
    content: [
      '1. Technical Quality / Blur: Zoom in to 100% and inspect edges. Compression artifacts, aggressive digital noise, and color fringing will trigger immediate rejection by automatic agency inspection bots.',
      '2. Visible Trademarks & Logos: Even microscopic logos on shoe soles, laptop casings, car steering wheels, or shirt embroidery must be cleanly cloned out.',
      '3. Missing Releases: Any recognizable face, tattoo, unique private architecture, or private property requires an attached and signed release form.',
      '4. Generative AI Artifacts: Anatomy errors (extra fingers, asymmetrical eyes, distorted teeth) and nonsensical text will trigger swift rejections. Run through prompt generators with proper negative weights.',
      '5. Keyword Spam: Stuffing irrelevant keywords to manipulate search ranking will get your contributor account flagged or banned. Keep keywords between 30 and 49 relevant terms.'
    ],
    keyTakeaways: [
      'Always check images at 100% zoom before batch submission',
      'Sanitize all logos, brand symbols, and license plates',
      'Check Model Release requirements before tagging as commercial'
    ]
  },
  {
    id: 'top-10-algorithm-mastery',
    category: 'seo',
    title: 'Cracking the Adobe Stock & Freepik Search Algorithm with Top-10 Weighting',
    readTime: '4 min read',
    summary: 'Why the first 10 keywords matter more than the remaining 39, and how to structure titles for maximum buyer CTR.',
    content: [
      'Adobe Stock’s search engine evaluates the sequence of your keywords. The first 5 to 10 keywords in your metadata carry up to 70% of the initial search query match weight.',
      'Begin with the primary subject: who or what is the main visual focal point? For example: "doctor", "telemedicine", "patient consultation".',
      'Secondary keywords should cover the physical environment and lighting, such as "modern clinic", "hospital room", "natural daylight".',
      'Third-tier keywords represent emotional, business, and conceptual themes: "healthcare innovation", "compassion", "digital health technology".',
      'For Shutterstock, ensure your title is a natural narrative sentence answering Who, What, and Where with at least 5 to 12 descriptive words.'
    ],
    keyTakeaways: [
      'Top 10 tags = 70% of ranking weight on Adobe Stock',
      'Titles must answer Subject + Action + Setting',
      'No keyword stuffing in title—keep natural phrasing'
    ]
  },
  {
    id: 'high-demand-niches-2026',
    category: 'earnings',
    title: 'Top 10 High-Demand, Low-Competition Stock Niches for 2026',
    readTime: '5 min read',
    summary: 'Discover profitable topics where buyer search volume is high but existing portfolio competition remains surprisingly low.',
    content: [
      '1. Autonomous EV Charging Infrastructure: High industrial buyer demand, low existing vector/photo supply.',
      '2. Senior Citizens Adopting Modern Smart Tech: Realistic photos of elderly people using health tracking rings, smart home displays, and VR rehabilitation.',
      '3. Regenerative Agriculture & Precision Farming: Drones inspecting vertical farms, hydroponic greenhouses, and solar-powered irrigation.',
      '4. Mental Health Therapy & Neurodiversity: Respectful, authentic depictions of ADHD, autism support, art therapy, and workplace wellness.',
      '5. Remote Green Energy Technicians: Wind turbine maintenance, offshore solar technicians, battery storage installations.'
    ],
    keyTakeaways: [
      'Avoid over-saturated topics (generic coffee cups, empty keyboards)',
      'Focus on technical, healthcare, and green-energy concepts',
      'Submit seasonal niches 90 to 120 days before calendar events'
    ]
  }
];

export const StockGuideHubModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [selectedArticle, setSelectedArticle] = useState<GuideArticle | null>(ARTICLES[0]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'earnings' | 'seo' | 'rejection'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredArticles = ARTICLES.filter((art) => {
    const matchesFilter = activeFilter === 'all' || art.category === activeFilter;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-5xl w-full p-6 md:p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500" />

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white">
                Stock Contributor Masterclass & SEO Knowledge Hub
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Field-tested strategies for maximizing download rates, passing stock inspection, and turning digital assets into predictable passive revenue.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition font-bold"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              All Guides
            </button>
            <button
              onClick={() => setActiveFilter('earnings')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeFilter === 'earnings' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              Earnings Strategy
            </button>
            <button
              onClick={() => setActiveFilter('seo')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeFilter === 'seo' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              SEO & Ranking
            </button>
            <button
              onClick={() => setActiveFilter('rejection')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeFilter === 'rejection' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              Rejection Shield
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Article List */}
          <div className="lg:col-span-5 space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  selectedArticle?.id === art.id
                    ? 'bg-blue-950/40 border-blue-500 text-white shadow-lg'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  <span
                    className={
                      art.category === 'earnings'
                        ? 'text-emerald-400'
                        : art.category === 'seo'
                        ? 'text-indigo-400'
                        : 'text-rose-400'
                    }
                  >
                    {art.category}
                  </span>
                  <span className="text-slate-500">{art.readTime}</span>
                </div>
                <h4 className="text-sm font-bold leading-snug">{art.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{art.summary}</p>
              </div>
            ))}
          </div>

          {/* Article Reader View */}
          <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800 p-6 rounded-2xl max-h-[500px] overflow-y-auto">
            {selectedArticle && (
              <div className="space-y-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    {selectedArticle.category} Strategy Guide
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1 leading-snug">
                    {selectedArticle.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 italic">{selectedArticle.summary}</p>
                </div>

                <div className="space-y-3 text-xs md:text-sm text-slate-300 leading-relaxed">
                  {selectedArticle.content.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2">
                  <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4" /> Actionable Key Takeaways
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-200">
                    {selectedArticle.keyTakeaways.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
