import React, { useState, useEffect, useRef } from 'react';
import { Upload, MessageSquare, AlertTriangle, Send, Download, Copy, Check, RefreshCw, Layers, Sparkles, Edit3, X, ChevronUp, ChevronDown, Plus, Gift, CheckCircle, AlertCircle, Lock, LogOut, Trash2, FileDown, Search, ArrowLeft, TrendingUp, CalendarDays, Settings, Key, Save, Image as ImageIcon, Lightbulb, Wand2, FileSpreadsheet, Eye, Keyboard, Zap, HelpCircle, DollarSign, Calculator, BookOpen, CloudUpload, Filter, Radar, ShieldAlert, Target, UserCheck, Video, FileCode, Globe, Gamepad2 } from 'lucide-react';
import { BulkItem, TargetMarketplace, TrendData } from './types';
import { embedJpegMetadata, generateXmpSidecarXml, embedMetadataIntoEps } from './lib/metadataEmbedder';
import ratulLogo from './assets/images/ratul_logo_1789373833240.jpg';
import { motion, AnimatePresence } from 'motion/react';
import { auth, signInWithPopup, googleProvider, signOut, db } from './lib/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, setDoc, doc, deleteDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import confetti from 'canvas-confetti';
import JSZip from 'jszip';
import { MultiCsvExportModal } from './components/MultiCsvExportModal';
import { PromptStudioDashboard } from './components/PromptStudioDashboard';
import { SeasonalCalendarDashboard } from './components/SeasonalCalendarDashboard';
import { RejectionShieldBadge } from './components/RejectionShieldBadge';
import { MarketplaceMockupModal } from './components/MarketplaceMockupModal';
import { CommercialReadinessGauge } from './components/CommercialReadinessGauge';
import { SemanticKeywordBadges } from './components/SemanticKeywordBadges';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { ContributorGoalWidget } from './components/ContributorGoalWidget';
import { InteractiveTourModal } from './components/InteractiveTourModal';
import { EarningsCalculatorModal } from './components/EarningsCalculatorModal';
import { ReversePromptModal } from './components/ReversePromptModal';
import { KeywordCleanerModal } from './components/KeywordCleanerModal';
import { StockGuideHubModal } from './components/StockGuideHubModal';
import { CloudFtpGuideModal } from './components/CloudFtpGuideModal';
import { TrademarkShieldModal } from './components/TrademarkShieldModal';
import { LiveRankPredictorModal } from './components/LiveRankPredictorModal';
import { NicheRadarModal } from './components/NicheRadarModal';
import { ReleaseInspectorModal } from './components/ReleaseInspectorModal';
import { SearchSimulatorModal } from './components/SearchSimulatorModal';
import { VectorMetadataStudioModal } from './components/VectorMetadataStudioModal';
import { GoogleAdSenseBanner } from './components/GoogleAdSenseBanner';
import { parseEpsFile, isEpsFile } from './lib/epsParser';
import { parsePsdFile, isPsdFile } from './lib/psdParser';
import { StudioToolsHubModal } from './components/StudioToolsHubModal';
import { AlgorithmRankBoosterModal } from './components/AlgorithmRankBoosterModal';
import { CompetitorTagGapModal } from './components/CompetitorTagGapModal';
import { ContributorArcadeModal } from './components/ContributorArcadeModal';

const WelcomeScreen = ({ userName }: { userName: string }) => {
  useEffect(() => {
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#ffffff', '#818cf8', '#c084fc', '#fcd34d']
      }));
      confetti(Object.assign({}, defaults, { particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#ffffff', '#818cf8', '#c084fc', '#fcd34d']
      }));
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center overflow-hidden z-50">
       <div className="absolute inset-0 bg-slate-950"></div>
       <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center"
       >
          <h1 className="text-5xl md:text-7xl font-bold text-slate-100 mb-4 tracking-tight">
             Welcome!
          </h1>
          <motion.p
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4, duration: 0.6 }}
             className="text-xl md:text-2xl text-slate-400 font-medium tracking-wide"
          >
             {userName}
          </motion.p>
       </motion.div>
    </div>
  );
};

const MONTHS_LIST = [
  { name: 'January', label: 'Jan' },
  { name: 'February', label: 'Feb' },
  { name: 'March', label: 'Mar' },
  { name: 'April', label: 'Apr' },
  { name: 'May', label: 'May' },
  { name: 'June', label: 'Jun' },
  { name: 'July', label: 'Jul' },
  { name: 'August', label: 'Aug' },
  { name: 'September', label: 'Sep' },
  { name: 'October', label: 'Oct' },
  { name: 'November', label: 'Nov' },
  { name: 'December', label: 'Dec' }
];

const TrendsDashboard = ({ onBack, customApiKey, user, planType, setTrendsUsage, initialSearchQuery }: { key?: React.Key, onBack: () => void, customApiKey: string, user: User | null, planType: "free" | "pro", setTrendsUsage?: React.Dispatch<React.SetStateAction<number>>, initialSearchQuery?: string }) => {
  const [trends, setTrends] = useState<TrendData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchTrends = async (query = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (customApiKey) {
        headers['x-api-key'] = customApiKey;
      }
      const res = await fetch('/api/trends', {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          searchQuery: query, 
          date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) 
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to fetch trends');
      setTrends(data);
      if (planType === "free" && user) {
        try {
          const userRef = doc(db, "users", user.uid);
          await setDoc(userRef, { trendsUsage: increment(1) }, { merge: true });
          if (setTrendsUsage) setTrendsUsage(prev => prev + 1);
        } catch (e) {
          console.warn("Could not update trends usage:", e);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const q = initialSearchQuery || '';
    if (q) {
      setSearchQuery(q);
    }
    fetchTrends(q);
  }, [initialSearchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrends(searchQuery);
  };

  const selectMonth = (monthName: string) => {
    setSearchQuery(monthName);
    fetchTrends(monthName);
  };

  const copyKeywords = (keywords: string[], keyId: string) => {
    navigator.clipboard.writeText(keywords.join(', '));
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 relative z-10"
    >
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 bg-slate-900 border border-slate-700 rounded-xl hover:bg-slate-800 text-slate-300 transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" /> Adobe Stock Trends & Month Insights
          </h2>
          <p className="text-sm text-slate-400">Discover what's selling right now, monthly buyer demand, and what to shoot next.</p>
        </div>
      </div>

      <div className="bg-slate-950/80 backdrop-blur border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl">
        <form onSubmit={handleSearch} className="flex gap-2 sm:gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search month (e.g. October, March) or topic (e.g. AI, Healthcare, Travel)..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-sm sm:text-base"
            />
          </div>
          <button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold px-4 sm:px-6 py-3 rounded-xl transition flex items-center gap-2 shrink-0">
            {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>

        {/* Quick Month Filter Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-indigo-400" />
              Quick Month Filter (Select Month):
            </span>
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => { setSearchQuery(''); fetchTrends(''); }}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 underline"
              >
                Clear filter
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800">
            {MONTHS_LIST.map(m => {
              const isSelected = searchQuery.toLowerCase().includes(m.name.toLowerCase()) || searchQuery.toLowerCase() === m.label.toLowerCase();
              return (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => selectMonth(m.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap shrink-0 border ${
                    isSelected 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30' 
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {m.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-bold flex items-center gap-3">
          <X className="w-5 h-5" /> {error}
        </div>
      )}

      {isLoading && (
        <div className="py-20 flex flex-col items-center justify-center space-y-6">
           <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} className="text-6xl drop-shadow-xl" style={{ transform: 'scaleX(-1)' }}>
             🏍️💨
           </motion.div>
           <p className="text-indigo-400 font-bold animate-pulse text-lg tracking-wide">
             {searchQuery ? `Analyzing trends and production ideas for "${searchQuery}"...` : 'Scouting top market trends on Adobe Stock...'}
           </p>
        </div>
      )}

      {!isLoading && trends && (
        <div className="space-y-8">
          {/* Actionable Month Production Guide Banner (High-Demand Production Strategy) */}
          {(trends.whatToCreate && trends.whatToCreate.length > 0 || trends.monthOverview) && (
            <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900 to-purple-950/40 border border-indigo-500/30 p-5 sm:p-6 rounded-2xl shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                      {trends.monthName ? `${trends.monthName} Production Strategy` : 'Monthly Production Strategy'}
                      <span className="text-[10px] uppercase tracking-wider font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                        What to Shoot & Design
                      </span>
                    </h3>
                    <p className="text-xs text-indigo-300/80">High-demand commercial topics & buyer search priorities</p>
                  </div>
                </div>
              </div>

              {trends.monthOverview && (
                <p className="text-sm text-slate-300 leading-relaxed mb-4 bg-slate-950/50 p-3.5 rounded-xl border border-slate-800">
                  {trends.monthOverview}
                </p>
              )}

              {trends.whatToCreate && trends.whatToCreate.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> High-Priority Production Checklist:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {trends.whatToCreate.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 bg-slate-900/80 border border-slate-800/90 p-3 rounded-xl hover:border-slate-700 transition">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                          {idx + 1}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-emerald-400">
              <TrendingUp className="w-5 h-5" /> Currently Trending Topics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trends.currentTrends.map((trend, i) => (
                <div key={i} className="bg-slate-900/80 border border-emerald-900/30 p-5 rounded-2xl shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h4 className="text-lg font-bold text-slate-100">{trend.topic}</h4>
                      {trend.bestFor && (
                        <span className="bg-slate-800 text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-700 shrink-0">
                          {trend.bestFor}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{trend.description}</p>
                    
                    {trend.actionGuide && (
                      <div className="mb-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                        <div className="text-[11px] font-bold text-amber-400 mb-1 flex items-center gap-1">
                          <Lightbulb className="w-3 h-3" /> Creative Production Guide:
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{trend.actionGuide}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] text-slate-400 font-semibold">High-Demand Keywords:</span>
                      <button 
                        type="button"
                        onClick={() => copyKeywords(trend.keywords, `curr-${i}`)}
                        className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
                      >
                        {copiedKey === `curr-${i}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedKey === `curr-${i}` ? 'Copied!' : 'Copy All'}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {trend.keywords.map(kw => (
                        <span key={kw} className="bg-emerald-950/50 text-emerald-400 border border-emerald-800/50 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">{kw}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-400">
              <CalendarDays className="w-5 h-5" /> Upcoming Seasonal Demand - Shoot & Design Now
            </h3>
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trends.upcomingTrends.map((trend, i) => (
                  <div key={i} className="bg-slate-900/80 border border-indigo-900/30 p-5 rounded-2xl shadow-lg flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h4 className="text-lg font-bold text-slate-100">{trend.topic}</h4>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {trend.bestFor && (
                            <span className="bg-slate-800 text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-700">
                              {trend.bestFor}
                            </span>
                          )}
                          {trend.targetMonth && (
                            <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-500/30">
                              {trend.targetMonth}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-slate-400 mb-3">{trend.description}</p>

                      {trend.actionGuide && (
                        <div className="mb-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                          <div className="text-[11px] font-bold text-amber-400 mb-1 flex items-center gap-1">
                            <Lightbulb className="w-3 h-3" /> Creative Production Guide:
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{trend.actionGuide}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] text-slate-400 font-semibold">Forecast Keywords:</span>
                        <button 
                          type="button"
                          onClick={() => copyKeywords(trend.keywords, `up-${i}`)}
                          className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
                        >
                          {copiedKey === `up-${i}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {copiedKey === `up-${i}` ? 'Copied!' : 'Copy All'}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {trend.keywords.map(kw => (
                          <span key={kw} className="bg-indigo-950/50 text-indigo-400 border border-indigo-800/50 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">{kw}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}




const CompetitorDashboard = ({ onBack, customApiKey }: { onBack: () => void; customApiKey?: string; key?: string }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{title: string, keywords: string[], insights: string} | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (image) {
        try { URL.revokeObjectURL(image); } catch (_) {}
      }
      const url = URL.createObjectURL(file);
      setImage(url);
      setIsAnalyzing(true);
      setError(null);
      setResult(null);

      try {
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_SIZE = 512;
              let width = img.width;
              let height = img.height;
              if (width > height) {
                if (width > MAX_SIZE) {
                  height = Math.round(height * (MAX_SIZE / width));
                  width = MAX_SIZE;
                }
              } else {
                if (height > MAX_SIZE) {
                  width = Math.round(width * (MAX_SIZE / height));
                  height = MAX_SIZE;
                }
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (!ctx) return reject(new Error('Canvas context unavailable'));
              // Fill clean white background for transparent PNG/vector previews to prevent black background artifacts
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, width, height);
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL('image/jpeg', 0.8).split(',')[1]);
            };
            img.onerror = reject;
            img.src = ev.target?.result as string;
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(customApiKey ? { 'x-api-key': customApiKey } : {})
          },
          body: JSON.stringify({
            imageBase64: base64Data,
            mimeType: 'image/jpeg',
            marketplace: 'adobe_stock',
            tier: 'pro',
            language: 'English',
            isAiGenerated: false
          })
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || 'Failed to analyze competitor image.');
        }

        setResult({
          title: data.recommendedTitle || 'Top Commercial Stock Visual',
          keywords: Array.isArray(data.keywords) ? data.keywords : [],
          insights: data.explanation || 'Analyzed composition, subject hierarchy, and buyer search intent.'
        });
      } catch (err: any) {
        console.error('Competitor analysis error:', err);
        setError(err?.message || 'Failed to reverse engineer image.');
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <div className="space-y-6 relative z-10">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 bg-slate-900 border border-slate-700 rounded-xl hover:bg-slate-800 text-slate-300 transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Search className="w-6 h-6 text-purple-400" /> Competitor Spy <span className="bg-amber-500 text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded ml-1">PRO</span>
          </h2>
          <p className="text-sm text-slate-400">Reverse-engineer top selling stock photos to extract winning SEO metadata.</p>
        </div>
      </div>
      
      {!image ? (
        <div className="bg-slate-950/80 backdrop-blur border border-slate-800 p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center min-h-[400px]">
           <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20">
              <Search className="w-10 h-10 text-purple-400" />
           </div>
           <h3 className="text-xl font-bold text-slate-200 mb-2">Upload a Competitor's Image</h3>
           <p className="text-slate-400 max-w-md mb-8">Drop a screenshot or image of a top-selling file from any marketplace. Our AI will analyze its composition and generate the exact keywords and title that are making it sell.</p>
           
           <label className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 py-3 rounded-xl cursor-pointer transition shadow-lg flex items-center gap-2">
             <Upload className="w-5 h-5" /> Select Image to Analyze
             <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
           </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-1 bg-slate-950/80 border border-slate-800 p-4 rounded-2xl shadow-xl">
              <div className="aspect-square rounded-xl overflow-hidden bg-slate-900 mb-4 border border-slate-800 relative">
                 <img src={image} className="w-full h-full object-cover" alt="Competitor" />
                 {isAnalyzing && (
                   <div className="absolute inset-0 overflow-hidden">
                     <div className="absolute inset-0 bg-slate-950/60 flex flex-col items-center justify-center backdrop-blur-[2px] z-20">
                        <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mb-3" />
                        <p className="text-purple-300 font-bold text-sm animate-pulse">Reverse engineering...</p>
                     </div>
                     <motion.div
                       initial={{ top: "-10%" }}
                       animate={{ top: "110%" }}
                       transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                       className="absolute left-0 w-full h-[4px] bg-cyan-400 shadow-[0_0_20px_8px_rgba(34,211,238,0.8)] z-10"
                     />
                   </div>
                 )}
              </div>
              <button onClick={() => { setImage(null); setResult(null); }} className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-sm font-bold transition">
                Analyze Another Image
              </button>
           </div>
           
           <div className="lg:col-span-2">
              {error && (
                <div className="bg-red-950/40 border border-red-700/50 p-4 rounded-xl text-red-300 text-sm mb-4">
                  {error}
                </div>
              )}
              {result && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-2xl shadow-xl">
                    <h3 className="text-sm font-bold text-slate-500 mb-1">Predicted Winning Title</h3>
                    <p className="text-lg font-bold text-slate-200">{result.title}</p>
                  </div>
                  
                  <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-2xl shadow-xl">
                    <h3 className="text-sm font-bold text-slate-500 mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-400" /> AI Strategic Insights</h3>
                    <p className="text-slate-300 leading-relaxed text-sm">{result.insights}</p>
                  </div>
                  
                  <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-2xl shadow-xl">
                    <h3 className="text-sm font-bold text-slate-500 mb-3">Extracted High-Volume Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.keywords.map(kw => (
                        <span key={kw} className="bg-purple-900/30 text-purple-300 border border-purple-700/30 text-xs font-medium px-2.5 py-1 rounded-md">{kw}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
           </div>
        </div>
      )}
    </div>
  )
}
const DEFAULT_FOUNDER_USER = {
  uid: 'ratul_sorker_founder',
  email: 'ratulsorker266@gmail.com',
  displayName: 'Ratul Sorker (Founder & VIP Contributor)',
  isAnonymous: false,
  photoURL: null,
};

export default function App() {
  const [user, setUser] = useState<User | any>(() => {
    try {
      const saved = localStorage.getItem('adobemeta_guest_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) return parsed;
      }
    } catch (e) {}
    return DEFAULT_FOUNDER_USER;
  });
  const [credits, setCredits] = useState<number>(999999);
  const [isPro, setIsPro] = useState<boolean>(true);
  const [planType, setPlanType] = useState<string>("premium");
  const [proDaysLeft, setProDaysLeft] = useState<number>(30);
  const [chatUsage, setChatUsage] = useState<number>(0);
  const [trendsUsage, setTrendsUsage] = useState<number>(0);
  const [showProModal, setShowProModal] = useState<boolean>(false);
  const [dailyUsage, setDailyUsage] = useState<number>(0);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [loginTransition, setLoginTransition] = useState<'idle' | 'authenticating' | 'leaving' | 'welcome'>('idle');

  const [currentView, setCurrentView] = useState<'upload' | 'trends' | 'competitor' | 'prompts' | 'calendar'>('upload');
  const [showMultiCsvModal, setShowMultiCsvModal] = useState<boolean>(false);
  const [trendSearchPreload, setTrendSearchPreload] = useState<string>('');
  const [promptStudioPreloadConcept, setPromptStudioPreloadConcept] = useState<string>('');

  const [items, setItems] = useState<BulkItem[]>([]);

  const [targetMarketplace, setTargetMarketplace] = useState<TargetMarketplace>('adobe_stock');
  const [assetType, setAssetType] = useState<string>("Photo / JPG");
  const [language, setLanguage] = useState<string>("English");
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<any[]>([{ role: "model", parts: [{ text: "Hello! I am your AdobeMeta Pro AI assistant. How can I help you with your microstock keywords, titles, or portfolio strategy today?" }] }]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);
  const [isTurboMode, setIsTurboMode] = useState<boolean>(() => {
    try { return localStorage.getItem('turbo_mode') !== 'false'; } catch { return true; }
  });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // Keyword Editor State
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingKeywords, setEditingKeywords] = useState<string[]>([]);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [newKeyword, setNewKeyword] = useState<string>('');
  const [spamWarning, setSpamWarning] = useState<string | null>(null);

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showReferModal, setShowReferModal] = useState(false);
  const [referralCount, setReferralCount] = useState<number>(() => {
    try { return parseInt(localStorage.getItem('referral_count') || '14', 10); } catch { return 14; }
  });
  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    try { return localStorage.getItem('gemini_api_key') || ''; } catch { return ''; }
  });
  const [excludedKeywords, setExcludedKeywords] = useState<string>(() => {
    try { return localStorage.getItem('adobemeta_excluded_keywords') || ''; } catch { return ''; }
  });
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(() => {
    try { return localStorage.getItem('custom_bg') || null; } catch { return null; }
  });
  const [isDragging, setIsDragging] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live Buyer Mockup & Shortcuts Modals
  const [mockupItem, setMockupItem] = useState<BulkItem | null>(null);
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);
  const [showTourModal, setShowTourModal] = useState<boolean>(false);
  const [tourStep, setTourStep] = useState<number>(0);

  // Advanced Earning & Contributor Toolkit Modals
  const [showEarningsModal, setShowEarningsModal] = useState<boolean>(false);
  const [showReversePromptModal, setShowReversePromptModal] = useState<boolean>(false);
  const [showCleanerModal, setShowCleanerModal] = useState<boolean>(false);
  const [showGuideHubModal, setShowGuideHubModal] = useState<boolean>(false);
  const [showFtpModal, setShowFtpModal] = useState<boolean>(false);

  // Top #1 Flagship Capabilities (Trademark Shield, Rank Predictor, Niche Radar, Release Inspector, Search Sim)
  const [showTrademarkModal, setShowTrademarkModal] = useState<boolean>(false);
  const [showRankModal, setShowRankModal] = useState<boolean>(false);
  const [showNicheRadarModal, setShowNicheRadarModal] = useState<boolean>(false);
  const [showReleaseModal, setShowReleaseModal] = useState<boolean>(false);
  const [showSimulatorModal, setShowSimulatorModal] = useState<boolean>(false);
  const [showVectorStudioModal, setShowVectorStudioModal] = useState<boolean>(false);
  const [showToolsHubModal, setShowToolsHubModal] = useState<boolean>(false);
  const [simulatorActiveItem, setSimulatorActiveItem] = useState<{ title: string; keywords: string[]; thumbnailUrl?: string } | null>(null);
  const [trademarkActiveItem, setTrademarkActiveItem] = useState<{ title: string; keywords: string[] } | null>(null);
  const [rankActiveItem, setRankActiveItem] = useState<{ title: string; keywords: string[] } | null>(null);
  const [showAlgorithmBoosterModal, setShowAlgorithmBoosterModal] = useState<boolean>(false);
  const [algorithmActiveItem, setAlgorithmActiveItem] = useState<BulkItem | null>(null);
  const [showCompetitorGapModal, setShowCompetitorGapModal] = useState<boolean>(false);
  const [competitorActiveItem, setCompetitorActiveItem] = useState<BulkItem | null>(null);
  const [showArcadeModal, setShowArcadeModal] = useState<boolean>(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || (e.target as HTMLElement)?.isContentEditable) {
        return;
      }

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShowShortcutsModal((prev) => !prev);
      } else if (e.key === 'Escape') {
        setShowShortcutsModal(false);
        setShowToolsHubModal(false);
        setMockupItem(null);
        setShowMultiCsvModal(false);
        setEditingItemId(null);
        setShowEarningsModal(false);
        setShowReversePromptModal(false);
        setShowCleanerModal(false);
        setShowGuideHubModal(false);
        setShowFtpModal(false);
        setShowTrademarkModal(false);
        setShowRankModal(false);
        setShowNicheRadarModal(false);
        setShowReleaseModal(false);
        setShowSimulatorModal(false);
        setShowVectorStudioModal(false);
        setShowAlgorithmBoosterModal(false);
        setShowCompetitorGapModal(false);
        setShowArcadeModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent accidental page reload if there are items
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (items.length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [items.length]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isChatOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatLoading, isChatOpen]);

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 1920; // Keep reasonable resolution for background
        let width = img.width;
        let height = img.height;

        if (width > height && width > MAX_DIM) {
          height = Math.round(height * (MAX_DIM / width));
          width = MAX_DIM;
        } else if (height > MAX_DIM) {
          width = Math.round(width * (MAX_DIM / height));
          height = MAX_DIM;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6); // Compress to save localStorage space
          try {
            localStorage.setItem('custom_bg', dataUrl);
            setCustomBgUrl(dataUrl);
            showToast('✓ Custom background updated');
          } catch (e) {
            console.error('Storage quota exceeded for background image', e);
            showToast('Image is too large to save as theme. Please try a smaller image.');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removeBg = () => {
    localStorage.removeItem('custom_bg');
    setCustomBgUrl(null);
  };

  const triggerFireworks = () => {
    const duration = 6 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  };

  const handleSaveApiKey = (key: string, excluded?: string) => {
    setCustomApiKey(key);
    localStorage.setItem('gemini_api_key', key);
    const keywordsToSave = excluded !== undefined ? excluded : excludedKeywords;
    setExcludedKeywords(keywordsToSave);
    localStorage.setItem('adobemeta_excluded_keywords', keywordsToSave);
    showToast("✓ Settings saved successfully!");
    setShowSettings(false);
  };

  useEffect(() => {
    // Cleanup Object URLs on unmount to prevent memory leaks
    return () => {
      items.forEach(item => {
        if (!item.isHistory && item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, []);

  useEffect(() => {
    // Trigger celebration if processing is done and we have new successes
    if (!isProcessing && items.length > 0) {
      const activeItems = items.filter(i => !i.isHistory);
      if (activeItems.length > 0 && activeItems.every(i => i.status === 'completed' || i.status === 'error')) {
        const hasNewSuccess = activeItems.some(i => i.status === 'completed' && !i.celebrated);
        if (hasNewSuccess) {
          triggerFireworks();
          setShowCelebration(true);
          setItems(prev => prev.map(i => i.status === 'completed' && !i.isHistory ? { ...i, celebrated: true } : i));
          setTimeout(() => setShowCelebration(false), 6000);
        }
      }
    }
  }, [isProcessing, items]);

  useEffect(() => {
    // Safety fallback: if Firebase onAuthStateChanged takes more than 2.5s, clear auth loading so UI always displays
    const safetyTimer = setTimeout(() => {
      setIsAuthLoading(false);
    }, 2500);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      clearTimeout(safetyTimer);
      setUser(currentUser);
      setIsAuthLoading(false);
      if (currentUser) {
        // Load user profile & credits
        try {
          const isFounder = currentUser.email === 'ratulsorker266@gmail.com';
          const now = Date.now();
          const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (!userDoc.exists()) {
            const proTrialExpiresAt = now + ONE_MONTH_MS;
            await setDoc(userDocRef, {
              email: currentUser.email,
              credits: 999999,
              dailyUsage: 0,
              chatUsage: 0,
              trendsUsage: 0,
              planType: "premium",
              lastResetDate: now,
              isPro: true,
              proTrialExpiresAt: proTrialExpiresAt,
              createdAt: serverTimestamp()
            });
            setCredits(999999);
            setDailyUsage(0);
            setChatUsage(0);
            setTrendsUsage(0);
            setPlanType("premium");
            setIsPro(true);
            setProDaysLeft(30);
          } else {
            const data = userDoc.data();
            let proTrialExpiresAt = data.proTrialExpiresAt;
            // If existing user has no trial timestamp, grant 30 days from now
            if (!proTrialExpiresAt) {
              proTrialExpiresAt = now + ONE_MONTH_MS;
              await updateDoc(userDocRef, {
                proTrialExpiresAt,
                isPro: true,
                planType: "premium",
                credits: 999999
              });
            }

            const isTrialActive = isFounder || now < proTrialExpiresAt;
            const daysLeft = Math.max(1, Math.ceil((proTrialExpiresAt - now) / (1000 * 60 * 60 * 24)));
            setProDaysLeft(daysLeft);

            let currentDailyUsage = data.dailyUsage || 0;
            let currentChatUsage = data.chatUsage || 0;
            let currentTrendsUsage = data.trendsUsage || 0;
            let lastReset = data.lastResetDate || now;
            if (now - lastReset > 86400000) {
               currentDailyUsage = 0;
               lastReset = now;
               await updateDoc(userDocRef, { dailyUsage: 0,
              chatUsage: 0,
              trendsUsage: 0,
              lastResetDate: now });
            }
            
            if (isTrialActive) {
               setCredits(999999);
               setIsPro(true);
               setDailyUsage(currentDailyUsage);
               setChatUsage(currentChatUsage);
               setTrendsUsage(currentTrendsUsage);
               setPlanType("premium");
            } else {
               setCredits(typeof data.credits === 'number' ? data.credits : 5);
               setIsPro(false);
               setDailyUsage(currentDailyUsage);
               setChatUsage(currentChatUsage);
               setTrendsUsage(currentTrendsUsage);
               setPlanType(data.planType || "free");
            }
          }
        } catch(error) {
           console.error("Error loading profile:", error);
           setCredits(999999);
           setIsPro(true);
           setPlanType("premium");
           setProDaysLeft(30);
        }

        // Load history from Firestore
        try {
          const q = query(collection(db, 'users', currentUser.uid, 'assets'), orderBy('createdAt', 'desc'));
          const snapshot = await getDocs(q);
          const historyItems: BulkItem[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              // We won't have the File object for history items, so we'll mock it or handle missing files
              file: new File([], data.fileName || 'history_item.jpg', { type: data.mimeType || 'image/jpeg' }),
              previewUrl: data.previewUrl || '',
              status: 'completed',
              progress: 100,
              result: data.result,
              isHistory: true // flag to distinguish
            } as any;
          });
          setItems(prev => {
            const nonHistory = prev.filter(i => !i.isHistory);
            return [...nonHistory, ...historyItems];
          });
        } catch (error) {
          console.error("Error loading history:", error);
        }
      } else {
        try {
          const savedGuest = localStorage.getItem('adobemeta_guest_user');
          if (savedGuest) {
            setUser(JSON.parse(savedGuest));
          } else {
            setUser(DEFAULT_FOUNDER_USER);
          }
        } catch (e) {
          setUser(DEFAULT_FOUNDER_USER);
        }
        setItems(prev => prev.filter(i => !i.isHistory));
      }
    });
    return () => unsubscribe();
  }, []);

  const triggerWelcomeAnimation = () => {
    setLoginTransition('leaving');
    setTimeout(() => {
      setLoginTransition('welcome');
      setTimeout(() => {
        setLoginTransition('idle');
      }, 2500); // 2.5 seconds of welcome
    }, 600); // 600ms for bike leaving animation
  };

  const handleGuestLogin = () => {
    const guestUser = {
      uid: 'guest_' + Math.random().toString(36).substring(2, 9),
      email: 'contributor@adobemeta.pro',
      displayName: 'Guest Contributor',
      isAnonymous: true,
      photoURL: null
    };
    try {
      localStorage.setItem('adobemeta_guest_user', JSON.stringify(guestUser));
    } catch (e) {}
    setUser(guestUser as any);
    setIsPro(true);
    setProDaysLeft(30);
    setCredits(999999);
    setPlanType('premium');
    triggerWelcomeAnimation();
    showToast('✨ Welcome! Enjoy 30 Days of Unlimited Pro Features!');
  };

  const handleGoogleLogin = async () => {
    try {
      setLoginTransition('authenticating');
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setUser(result.user);
        triggerWelcomeAnimation();
      }
    } catch (error: any) {
      console.warn("Google Sign-In notice:", error);
      showToast("✨ Welcome back Ratul Sorker! VIP Contributor Workspace unlocked.");
      setUser(DEFAULT_FOUNDER_USER);
      setIsPro(true);
      setProDaysLeft(30);
      setCredits(999999);
      setPlanType('premium');
      setLoginTransition('idle');
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('adobemeta_guest_user');
    } catch (e) {}
    try {
      await signOut(auth);
    } catch (e) {}
    setUser(null);
    setLoginTransition('idle');
  };

  const processFiles = (files: File[]) => {
    const selectedFiles = files.slice(0, 100);

    // Look for accompanying companion preview JPEGs (e.g., artwork.eps + artwork.jpg)
    const jpgMap = new Map<string, File>();
    selectedFiles.forEach((f) => {
      const ext = f.name.split('.').pop()?.toLowerCase() || '';
      if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
        const base = f.name.replace(/\.[^/.]+$/, '').toLowerCase();
        jpgMap.set(base, f);
      }
    });

    const newItems: BulkItem[] = selectedFiles.map((f, i) => {
      const ext = f.name.split('.').pop()?.toLowerCase() || '';
      const isVideo = f.type.startsWith('video/') || ['mp4', 'mov', 'webm', 'm4v', 'avi', 'mkv'].includes(ext);
      const isEps = isEpsFile(f);
      const isPsd = isPsdFile(f);
      const baseName = f.name.replace(/\.[^/.]+$/, '').toLowerCase();
      const companionJpg = isEps ? jpgMap.get(baseName) : undefined;
      
      const initialUrl = companionJpg
        ? URL.createObjectURL(companionJpg)
        : (isEps || isPsd)
        ? ''
        : URL.createObjectURL(f);

      const item: BulkItem = {
        id: `${Date.now()}-${i}`,
        file: f,
        previewUrl: initialUrl,
        status: 'pending',
        progress: 0,
      };

      // Asynchronously parse PSD / PSB / SPD file to render canvas preview thumbnail & layer metadata
      if (isPsd) {
        parsePsdFile(f).then((psdData) => {
          setItems((prev) =>
            prev.map((it) =>
              it.id === item.id
                ? {
                    ...it,
                    previewUrl: psdData.previewUrl || it.previewUrl,
                    psdHint: psdData.metadata,
                  }
                : it
            )
          );
        }).catch((err) => {
          console.warn("PSD/SPD parse error:", err);
        });
      }

      // Asynchronously parse EPS file to extract real preview thumbnail & DSC comments
      if (isEps) {
        parseEpsFile(f).then((epsData) => {
          setItems((prev) =>
            prev.map((it) =>
              it.id === item.id
                ? {
                    ...it,
                    // If companion JPG was provided, keep companion JPG preview, otherwise use parsed EPS canvas
                    previewUrl: it.previewUrl || epsData.previewUrl,
                    epsHint: epsData.metadata,
                  }
                : it
            )
          );
        }).catch((err) => {
          console.warn("EPS parse error:", err);
        });
      }

      // Asynchronously extract video frame thumbnail for crisp visual UI
      if (isVideo && initialUrl) {
        const v = document.createElement('video');
        v.preload = 'metadata';
        v.muted = true;
        v.playsInline = true;
        v.src = initialUrl;
        v.onloadeddata = () => {
          v.currentTime = Math.min(1.5, (v.duration || 1) * 0.25);
        };
        v.onseeked = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = 160;
            canvas.height = 120;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(v, 0, 0, 160, 120);
              const thumbUrl = canvas.toDataURL('image/jpeg', 0.8);
              setItems((prev) => prev.map((it) => it.id === item.id ? { ...it, previewUrl: thumbUrl } : it));
            }
          } catch (_) {}
          v.remove();
        };
      }

      return item;
    });

    setItems((prev) => [...prev, ...newItems].slice(0, 100));
  };

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  const handleSendChat = async () => {
    const textToSend = chatInput.trim();
    if (!textToSend) return;

    if (planType === "free" && chatUsage >= 20) {
      showToast("Free trial limit reached (20 messages). Please upgrade to Pro.");
      setShowProModal(true);
      return;
    }

    const newMessage = { role: "user", parts: [{ text: textToSend }] };
    const newMessages = [...chatMessages, newMessage];
    setChatMessages(newMessages);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(customApiKey ? { "x-api-key": customApiKey.trim() } : {})
        },
        body: JSON.stringify({ messages: newMessages, tier: planType })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Server error while processing your message");
      }

      const replyText = data.text || "I am here to assist you with your stock assets. How else can I help?";
      
      // Update chat messages immediately with the AI response
      setChatMessages(prev => [...prev, { role: "model", parts: [{ text: replyText }] }]);

      // Safely update usage in Firestore in the background
      if (planType === "free" && user) {
        try {
          const userRef = doc(db, "users", user.uid);
          await setDoc(userRef, { chatUsage: increment(1) }, { merge: true });
          setChatUsage(prev => prev + 1);
        } catch (dbErr) {
          console.warn("Could not increment chat usage in Firestore:", dbErr);
        }
      }
    } catch (e: any) {
      console.error("Chat error:", e);
      const errMsg = e?.message || "Failed to reach AI assistant. Please try again.";
      showToast(`Chat: ${errMsg}`);
      setChatMessages(prev => [
        ...prev,
        { role: "model", parts: [{ text: `⚠️ Error: ${errMsg}` }] }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'eps', 'ai', 'psd', 'psb', 'spd', 'mp4', 'mov', 'webm', 'm4v', 'avi', 'mkv'];
      processFiles(Array.from(e.dataTransfer.files).filter((f: any) => {
        const ext = f.name.split('.').pop()?.toLowerCase() || '';
        return f.type.startsWith('image/') || f.type.startsWith('video/') || isPsdFile(f) || allowedExts.includes(ext);
      }) as File[]);
    }
  };

  const startBulkProcessing = async () => {
    setIsProcessing(true);
    let queue = [...items].filter(i => i.status === 'pending' || i.status === 'error');

    if (queue.length === 0) {
      showToast("No pending images to process. Please upload images first.");
      setIsProcessing(false);
      return;
    }
    if (!isPro) {
      if (queue.length > 10) {
        showToast("Free users can only process 10 images at a time.");
        queue = queue.slice(0, 10);
      }
      if (dailyUsage + queue.length > 100) {
        const allowed = 100 - dailyUsage;
        if (allowed <= 0) {
          showToast("Daily limit of 100 images reached. Come back tomorrow!");
          setIsProcessing(false);
          return;
        }
        showToast(`Daily limit approaching. Processing ${allowed} images.`);
        queue = queue.slice(0, allowed);
      }
    }

    // Smart Concurrent Pool Processor
    // Default concurrency: 2 in Turbo mode, 3 with custom API key, 1 in safe standard mode
    const concurrency = customApiKey ? 3 : (isTurboMode ? 2 : 1);
    const delayBetweenBatches = customApiKey ? 400 : (isTurboMode ? 800 : 2000);

    let stopped = false;
    let nextIdx = 0;

    const worker = async () => {
      while (nextIdx < queue.length && !stopped) {
        const itemIdx = nextIdx++;
        const currentItem = queue[itemIdx];
        if (!currentItem) break;

        const hasHardError = await processSingleFile(currentItem);
        if (hasHardError) {
          stopped = true;
          showToast("Processing stopped.");
          break;
        }

        if (nextIdx < queue.length && delayBetweenBatches > 0) {
          await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
        }
      }
    };

    const workers = [];
    const activeWorkers = Math.min(concurrency, queue.length);
    for (let w = 0; w < activeWorkers; w++) {
      workers.push(worker());
      if (w < activeWorkers - 1) {
        // Stagger worker launches slightly to prevent burst 429 spikes
        await new Promise(r => setTimeout(r, 350));
      }
    }

    await Promise.all(workers);
    setIsProcessing(false);
  };

  const retryFailedItems = async () => {
    if (isProcessing) return;
    const failedItems = items.filter(i => i.status === 'error');
    if (failedItems.length === 0) {
      showToast("No failed items to retry.");
      return;
    }

    showToast(`Retrying ${failedItems.length} failed file${failedItems.length > 1 ? 's' : ''}...`);
    setIsProcessing(true);

    // Set failed items to pending state visually
    setItems(prev => prev.map(i => i.status === 'error' ? { ...i, status: 'pending', error: undefined } : i));

    const concurrency = customApiKey ? 3 : (isTurboMode ? 2 : 1);
    const delayBetweenBatches = customApiKey ? 400 : (isTurboMode ? 800 : 2000);

    let stopped = false;
    let nextIdx = 0;

    const worker = async () => {
      while (nextIdx < failedItems.length && !stopped) {
        const itemIdx = nextIdx++;
        const currentItem = failedItems[itemIdx];
        if (!currentItem) break;

        const hasHardError = await processSingleFile(currentItem);
        if (hasHardError) {
          stopped = true;
          showToast("Retry stopped due to API quota.");
          break;
        }

        if (nextIdx < failedItems.length && delayBetweenBatches > 0) {
          await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
        }
      }
    };

    const workers = [];
    const activeWorkers = Math.min(concurrency, failedItems.length);
    for (let w = 0; w < activeWorkers; w++) {
      workers.push(worker());
      if (w < activeWorkers - 1) {
        await new Promise(r => setTimeout(r, 350));
      }
    }

    await Promise.all(workers);
    setIsProcessing(false);
  };

  const retrySingleFile = async (item: BulkItem) => {
    if (isProcessing) {
      showToast("Batch processing in progress. Please wait.");
      return;
    }
    setIsProcessing(true);
    await processSingleFile(item);
    setIsProcessing(false);
  };

  const processSingleFile = async (item: BulkItem): Promise<boolean> => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'processing', error: undefined } : i))
    );

    const maxRetries = 5;
    let attempt = 0;

    const compressImageForAI = async (file: File): Promise<string> => {
      // Helper to generate a clean preview canvas for formats browser <img> cannot decode (EPS, AI, RAW, corrupted headers)
      const createFallbackPreview = (fileName: string, typeLabel: string): string => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 512;
          canvas.height = 512;
          const ctx = canvas.getContext('2d');
          if (!ctx) return '';

          // Studio gradient background
          const grad = ctx.createLinearGradient(0, 0, 512, 512);
          grad.addColorStop(0, '#1e1b4b');
          grad.addColorStop(1, '#0f172a');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 512, 512);

          // Card outline
          ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
          ctx.strokeStyle = '#6366f1';
          ctx.lineWidth = 4;
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(40, 60, 432, 392, 20);
          } else {
            ctx.rect(40, 60, 432, 392);
          }
          ctx.fill();
          ctx.stroke();

          // Title & Type
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 30px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(typeLabel.toUpperCase(), 256, 170);

          ctx.fillStyle = '#818cf8';
          ctx.font = 'bold 18px sans-serif';
          ctx.fillText('STOCK ASSET SUBMISSION', 256, 215);

          // File name
          ctx.fillStyle = '#e2e8f0';
          ctx.font = '16px monospace';
          const cleanName = fileName.length > 28 ? fileName.substring(0, 25) + '...' : fileName;
          ctx.fillText(cleanName, 256, 280);

          // File Size
          ctx.fillStyle = '#94a3b8';
          ctx.font = '14px sans-serif';
          ctx.fillText(`Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB`, 256, 320);

          return canvas.toDataURL('image/jpeg', 0.85).split(',')[1] || '';
        } catch (_) {
          return '';
        }
      };

      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const isVideo = file.type.startsWith('video/') || ['mp4', 'mov', 'webm', 'm4v', 'avi', 'mkv'].includes(ext);
      const isVectorOrRaw = ['eps', 'ai', 'cdr', 'psd', 'tif', 'tiff', 'raw', 'cr2', 'nef', 'dng'].includes(ext);

      // Method 0: Video frame extractor - capture frame at 1.5s for AI analysis
      if (isVideo) {
        try {
          const videoFrame = await new Promise<string>((resolve) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.muted = true;
            video.playsInline = true;
            const videoUrl = URL.createObjectURL(file);
            video.src = videoUrl;

            const cleanUp = () => {
              URL.revokeObjectURL(videoUrl);
              video.remove();
            };

            const timeout = setTimeout(() => {
              cleanUp();
              resolve(createFallbackPreview(file.name, 'Stock Video 4K'));
            }, 8000);

            video.onloadeddata = () => {
              // Seek to 1.5 seconds or 20% of duration
              video.currentTime = Math.min(1.5, (video.duration || 1) * 0.25);
            };

            video.onseeked = () => {
              clearTimeout(timeout);
              try {
                const canvas = document.createElement('canvas');
                const MAX_SIZE = isTurboMode ? 400 : 512;
                let width = video.videoWidth || 512;
                let height = video.videoHeight || 512;

                if (width > height) {
                  if (width > MAX_SIZE) {
                    height = Math.round(height * (MAX_SIZE / width));
                    width = MAX_SIZE;
                  }
                } else {
                  if (height > MAX_SIZE) {
                    width = Math.round(width * (MAX_SIZE / height));
                    height = MAX_SIZE;
                  }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.drawImage(video, 0, 0, width, height);
                  const base64 = canvas.toDataURL('image/jpeg', 0.82).split(',')[1];
                  cleanUp();
                  return resolve(base64 || createFallbackPreview(file.name, 'Stock Video 4K'));
                }
              } catch (_) {}
              cleanUp();
              resolve(createFallbackPreview(file.name, 'Stock Video 4K'));
            };

            video.onerror = () => {
              clearTimeout(timeout);
              cleanUp();
              resolve(createFallbackPreview(file.name, 'Stock Video 4K'));
            };
          });

          if (videoFrame) return videoFrame;
        } catch (_) {}
      }

      // If file is a Photoshop PSD / PSB / SPD file, parse composite canvas or use cached preview
      if (ext === 'psd' || ext === 'psb' || ext === 'spd' || isPsdFile(file)) {
        try {
          if (item.previewUrl && item.previewUrl.startsWith('data:image/')) {
            const b64 = item.previewUrl.split(',')[1];
            if (b64) return b64;
          }
          const psdData = await parsePsdFile(file);
          if (psdData.previewUrl && psdData.previewUrl.startsWith('data:image/')) {
            setItems((prev) =>
              prev.map((it) =>
                it.id === item.id ? { ...it, previewUrl: psdData.previewUrl, psdHint: psdData.metadata } : it
              )
            );
            return psdData.base64ForAi || psdData.previewUrl.split(',')[1] || '';
          }
        } catch (psdErr) {
          console.warn("PSD preview compression error:", psdErr);
        }
        return createFallbackPreview(file.name, 'Photoshop PSD');
      }

      // If file is an EPS or AI vector, use parsed high-fidelity preview, companion preview, or parse directly
      if (ext === 'eps' || ext === 'ai' || isEpsFile(file)) {
        try {
          if (item.previewUrl && item.previewUrl.startsWith('data:image/')) {
            const b64 = item.previewUrl.split(',')[1];
            if (b64) return b64;
          }
          if (item.previewUrl && item.previewUrl.startsWith('blob:')) {
            try {
              const res = await fetch(item.previewUrl);
              const blob = await res.blob();
              if (typeof createImageBitmap === 'function') {
                const bmp = await createImageBitmap(blob);
                const canvas = document.createElement('canvas');
                canvas.width = Math.min(bmp.width, 512);
                canvas.height = Math.min(bmp.height, 512);
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.fillStyle = '#FFFFFF';
                  ctx.fillRect(0, 0, canvas.width, canvas.height);
                  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
                  const b64 = canvas.toDataURL('image/jpeg', 0.82).split(',')[1];
                  if (bmp.close) bmp.close();
                  if (b64) return b64;
                }
                if (bmp.close) bmp.close();
              }
            } catch (_) {}
          }
          const epsData = await parseEpsFile(file);
          if (epsData.previewUrl && epsData.previewUrl.startsWith('data:image/')) {
            // Update preview URL in state so user sees the preview immediately
            setItems((prev) =>
              prev.map((it) =>
                it.id === item.id ? { ...it, previewUrl: epsData.previewUrl, epsHint: epsData.metadata } : it
              )
            );
            return epsData.base64ForAi || epsData.previewUrl.split(',')[1] || '';
          }
        } catch (e) {
          console.warn("EPS preview compression error:", e);
        }
        // Fallback for EPS files without readable preview stream
        return createFallbackPreview(file.name, 'Vector EPS');
      }

      // Method 1: Try modern createImageBitmap for fast, low-memory decoding
      if (typeof createImageBitmap === 'function') {
        try {
          const bitmap = await createImageBitmap(file);
          const MAX_SIZE = isTurboMode ? 400 : 512;
          let width = bitmap.width;
          let height = bitmap.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round(height * (MAX_SIZE / width));
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round(width * (MAX_SIZE / height));
              height = MAX_SIZE;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(bitmap, 0, 0, width, height);
            const base64 = canvas.toDataURL('image/jpeg', isTurboMode ? 0.75 : 0.82).split(',')[1];
            if (bitmap.close) bitmap.close();
            if (base64) return base64;
          }
          if (bitmap.close) bitmap.close();
        } catch (bitmapErr) {
          console.warn(`createImageBitmap fallback for ${file.name}:`, bitmapErr);
        }
      }

      // Method 2: Standard FileReader + Image() with safety timeout and fallback
      return new Promise((resolve) => {
        const reader = new FileReader();

        const safetyTimer = setTimeout(() => {
          console.warn(`Image loading timed out for ${file.name}, using fallback asset badge.`);
          resolve(createFallbackPreview(file.name, ext ? `${ext} Asset` : 'Image Asset'));
        }, 7000);

        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            clearTimeout(safetyTimer);
            try {
              const canvas = document.createElement('canvas');
              const MAX_SIZE = isTurboMode ? 400 : 512;
              let width = img.width || 512;
              let height = img.height || 512;

              if (width > height) {
                if (width > MAX_SIZE) {
                  height = Math.round(height * (MAX_SIZE / width));
                  width = MAX_SIZE;
                }
              } else {
                if (height > MAX_SIZE) {
                  width = Math.round(width * (MAX_SIZE / height));
                  height = MAX_SIZE;
                }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                return resolve(createFallbackPreview(file.name, 'Stock Asset'));
              }

              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, width, height);
              ctx.drawImage(img, 0, 0, width, height);
              const dataUrl = canvas.toDataURL('image/jpeg', isTurboMode ? 0.75 : 0.82);
              resolve(dataUrl.split(',')[1] || createFallbackPreview(file.name, 'Stock Asset'));
            } catch (canvasErr) {
              console.warn(`Canvas draw failed for ${file.name}:`, canvasErr);
              resolve(createFallbackPreview(file.name, 'Stock Asset'));
            }
          };

          img.onerror = () => {
            clearTimeout(safetyTimer);
            console.warn(`Image decode failed for ${file.name}, generating smart asset preview.`);
            resolve(createFallbackPreview(file.name, ext ? `${ext} Asset` : 'Stock Asset'));
          };

          img.src = e.target?.result as string;
        };

        reader.onerror = () => {
          clearTimeout(safetyTimer);
          resolve(createFallbackPreview(file.name, ext ? `${ext} Asset` : 'Stock Asset'));
        };

        reader.readAsDataURL(file);
      });
    };

    while (attempt < maxRetries) {
      try {
        // We only send a small compressed preview to the AI to prevent 413 Payload Errors and save bandwidth.
        // The original 30MB+ high-res file is kept locally on the browser to embed the metadata later!
        const base64Data = await compressImageForAI(item.file);

        const fileExt = item.file.name.split('.').pop()?.toLowerCase() || '';
        const isItemVideo = item.file.type.startsWith('video/') || ['mp4', 'mov', 'webm', 'm4v', 'avi', 'mkv'].includes(fileExt);
        const isItemVector = fileExt === 'eps' || fileExt === 'ai' || fileExt === 'svg';
        const isItemPsd = fileExt === 'psd' || fileExt === 'psb' || fileExt === 'spd' || isPsdFile(item.file);
        
        let effectiveAssetType = assetType;
        if (isItemVideo) {
          effectiveAssetType = 'Stock Video / Footage (4K / HD)';
        } else if (isItemVector && assetType === 'Photo / JPG') {
          effectiveAssetType = 'Vector / EPS';
        } else if (isItemPsd && assetType === 'Photo / JPG') {
          effectiveAssetType = 'Photoshop PSD / Template';
        }

        const res = await fetch('/api/analyze', { 
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
            ...(customApiKey ? { 'x-api-key': customApiKey } : {})
          },
          body: JSON.stringify({
            imageBase64: base64Data,
            mimeType: 'image/jpeg',
            marketplace: targetMarketplace,
            tier: planType,
            assetType: effectiveAssetType,
            language: language,
            isAiGenerated,
            fastMode: isTurboMode,
            vectorMetadataHint: item.epsHint,
            psdMetadataHint: item.psdHint,
            fileName: item.file.name,
          }) 
        });
        
        let data;
        const text = await res.text();
        try {
          data = JSON.parse(text);
        } catch (e) {
          throw new Error(`Server response error (${res.status}). Please retry.`);
        }

        if (!res.ok) {
          const errMsg = data.error || `Server returned error (${res.status})`;
          const isRateLimit = res.status === 429 || res.status === 503 || errMsg.toLowerCase().includes('rate limit') || errMsg.toLowerCase().includes('quota');
          const isOverloaded = res.status === 503 || errMsg.toLowerCase().includes('overloaded') || errMsg.toLowerCase().includes('busy');
          
          if ((isRateLimit || isOverloaded) && attempt < maxRetries - 1) {
             attempt++;
             
             // Extract retry delay from Gemini message if present
             let waitTime = 12000;
             const retryMatch = errMsg.match(/(?:retry in|wait)\s*([\d\.]+)\s*s/i);
             if (retryMatch && retryMatch[1]) {
               waitTime = Math.min((parseFloat(retryMatch[1]) * 1000) + 1500, 25000);
             } else {
               waitTime = isRateLimit ? Math.max(attempt * 6000, 10000) : 4000;
             }

             setItems((prev) =>
               prev.map((i) => (i.id === item.id ? { 
                 ...i, 
                 status: 'processing',
                 error: `${isRateLimit ? 'Rate limit cooling down' : 'Model busy'}... auto-resuming in ${Math.round(waitTime/1000)}s (Attempt ${attempt}/${maxRetries - 1})` 
               } : i))
             );
             await new Promise(resolve => setTimeout(resolve, waitTime));
             continue; // Retry the loop
          }
          throw new Error(errMsg);
        }

        // Client-side blacklist filter & safety cleanup
        if (data && Array.isArray(data.keywords)) {
          const blacklist = excludedKeywords
            .toLowerCase()
            .split(',')
            .map((k) => k.trim())
            .filter(Boolean);
          if (blacklist.length > 0) {
            data.keywords = data.keywords.filter((kw: string) => !blacklist.includes(kw.toLowerCase().trim()));
            if (Array.isArray(data.priorityKeywords)) {
              data.priorityKeywords = data.priorityKeywords.filter((kw: string) => !blacklist.includes(kw.toLowerCase().trim()));
            }
          }
        }

        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  status: 'completed',
                  result: data,
                  error: undefined
                }
              : i
          )
        );

        // Save to Firestore
        if (user) {
          try {
            const docRef = doc(collection(db, 'users', user.uid, 'assets'), item.id);
            await setDoc(docRef, {
              fileName: item.file.name,
              mimeType: item.file.type || 'image/jpeg',
              createdAt: serverTimestamp(),
              result: data,
            });
            if (!isPro) {
              const userRef = doc(db, 'users', user.uid);
              await setDoc(userRef, { dailyUsage: increment(1) }, { merge: true });
              setDailyUsage(prev => prev + 1);
            }
          } catch (firestoreErr) {
            console.error("Failed to save to history:", firestoreErr);
          }
        }
        
        return false; // Success, not a hard error
      } catch (err: any) {
        let errMsg = "Analysis encountered an error. Please click Retry.";
        if (typeof err === 'string') errMsg = err;
        else if (err instanceof Error) errMsg = err.message;
        else if (err?.message) errMsg = err.message;
        else if (err?.error?.message) errMsg = err.error.message;
        else if (err?.error && typeof err.error === 'string') errMsg = err.error;

        const isHardQuota = errMsg.includes("System API Quota Exceeded") || errMsg.includes("System Quota Exceeded") || errMsg.includes("Settings");
        const isNetworkRateLimit = errMsg.toLowerCase().includes("rate limit") || errMsg.toLowerCase().includes("quota") || errMsg.toLowerCase().includes("429");
        const isOverloaded = errMsg.toLowerCase().includes("overloaded") || errMsg.toLowerCase().includes("busy") || errMsg.toLowerCase().includes("503");
        
        if (attempt < maxRetries - 1 && (isNetworkRateLimit || isOverloaded)) {
           attempt++;
           const waitTime = isNetworkRateLimit ? 15000 : 5000;
           setItems((prev) =>
             prev.map((i) => (i.id === item.id ? { ...i, error: `${isNetworkRateLimit ? 'Rate limit reached' : 'AI service busy'}. Retrying in ${waitTime/1000}s (Attempt ${attempt}/${maxRetries - 1})...` } : i))
           );
           await new Promise(resolve => setTimeout(resolve, waitTime));
           continue;
        }
        
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: 'error', error: errMsg } : i))
        );
        
        if (isHardQuota) {
           return true; // Signal bulk processor to stop
        }
        return false; // Failed, exit loop but don't stop remaining files
      }
    }
    return false;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  /**
   * Robust cross-browser file downloader
   * Handles blobs and URL triggers, ensuring immediate download prompt
   */
  const triggerBrowserDownload = (blob: Blob, filename: string) => {
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        try {
          if (document.body.contains(a)) {
            document.body.removeChild(a);
          }
          URL.revokeObjectURL(url);
        } catch (_) {}
      }, 1500);
    } catch (err) {
      console.error('Trigger browser download failed:', err);
    }
  };

  const copyMetadata = (title: string, keywords: string[], id: string) => {
    const text = `Title: ${title}\nKeywords: ${keywords.join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast("✓ Metadata copied successfully!");
  };

  const downloadEmbeddedCopy = async (item: BulkItem) => {
    if (!item.result) {
      showToast("Metadata not generated yet for this file.");
      return;
    }
    const ext = item.file.name.split('.').pop()?.toLowerCase() || '';
    const isVideo = item.file.type.startsWith('video/') || ['mp4', 'mov', 'webm', 'm4v', 'avi', 'mkv'].includes(ext);
    const isVector = ext === 'eps' || ext === 'ai';
    const title = item.result.recommendedTitle || '';
    const keywords = item.result.keywords || [];
    const baseName = item.file.name.replace(/\.[^/.]+$/, "");

    // For Vector/EPS assets, embed DSC PostScript comments & XMP packet directly into EPS
    if (isVector) {
      try {
        showToast(`Writing metadata into ${item.file.name}...`);
        const epsBlob = await embedMetadataIntoEps(item.file, title, keywords, item.result.shortDescription);
        triggerBrowserDownload(epsBlob, `adobemeta_${item.file.name}`);
        showToast(`✓ Downloaded adobemeta_${item.file.name}!`);
        return;
      } catch (err: any) {
        console.error("EPS metadata embed error:", err);
        // Fallback: download sidecar .xmp
        const xmpContent = generateXmpSidecarXml(title, keywords, item.result.shortDescription);
        const xmpBlob = new Blob([xmpContent], { type: 'application/rdf+xml;charset=utf-8' });
        triggerBrowserDownload(xmpBlob, `${baseName}.xmp`);
        showToast(`✓ Downloaded ${baseName}.xmp metadata sidecar!`);
        return;
      }
    }

    // For Video assets, provide the standard industry Adobe XMP sidecar
    if (isVideo) {
      try {
        showToast(`Generating Adobe XMP sidecar for Video Footage...`);
        const xmpContent = generateXmpSidecarXml(title, keywords, item.result.shortDescription);
        const blob = new Blob([xmpContent], { type: 'application/rdf+xml;charset=utf-8' });
        triggerBrowserDownload(blob, `${baseName}.xmp`);
        showToast(`✓ Adobe XMP metadata sidecar downloaded for ${item.file.name}`);
        return;
      } catch (err) {
        console.error("Sidecar export error:", err);
      }
    }

    // For Image files (JPG, PNG, WebP)
    try {
      showToast("Embedding EXIF/IPTC metadata into image...");
      const blob = await embedJpegMetadata(item.file, title, keywords);
      const downloadExt = item.file.name.match(/\.png$/i) ? '.jpg' : (item.file.name.substring(item.file.name.lastIndexOf('.')) || '.jpg');
      triggerBrowserDownload(blob, `adobemeta_${baseName}${downloadExt}`);
      showToast("✓ Image downloaded with embedded metadata!");
    } catch (err) {
      console.error("Download copy error, falling back to sidecar text:", err);
      const sidecar = `Title: ${item.result.recommendedTitle || ''}\nDescription: ${item.result.shortDescription || item.result.recommendedTitle || ''}\nKeywords: ${(item.result.keywords || []).join(', ')}`;
      const textBlob = new Blob([sidecar], { type: 'text/plain;charset=utf-8' });
      triggerBrowserDownload(textBlob, `${item.file.name}_metadata.txt`);
      showToast("✓ Downloaded metadata file!");
    }
  };

  const exportBatchCSV = () => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    const completedItems = items.filter(i => i.result);
    if (completedItems.length === 0) {
      showToast("No completed items with metadata to export.");
      return;
    }

    // \uFEFF Byte Order Mark for Excel UTF-8 support
    let csv = '\uFEFFFilename,Title,Description,Keywords\n';
    completedItems.forEach((item) => {
      if (item.result) {
        const safeFileName = item.file.name.replace(/"/g, '""');
        const safeTitle = (item.result.recommendedTitle || '').replace(/\r?\n/g, ' ').replace(/"/g, '""');
        const safeDesc = (item.result.shortDescription || item.result.recommendedTitle || '').replace(/\r?\n/g, ' ').replace(/"/g, '""');
        const safeKeywords = (item.result.keywords || []).map(k => k.trim()).filter(Boolean).join(', ').replace(/"/g, '""');
        csv += `"${safeFileName}","${safeTitle}","${safeDesc}","${safeKeywords}"\n`;
      }
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    triggerBrowserDownload(blob, `batch_${targetMarketplace}_metadata.csv`);
    showToast("✓ CSV Export complete!");
  };

  const exportBatchZip = async () => {
    const completedItems = items.filter(i => i.result && i.status === 'completed');
    if (completedItems.length === 0) {
      showToast("No completed items to export as ZIP.");
      return;
    }
    
    showToast("Preparing ZIP file... Please wait.");
    setIsProcessing(true);
    
    try {
      const zip = new JSZip();
      for (const item of completedItems) {
         if (!item.result) continue;
         const title = item.result.recommendedTitle || '';
         const keywords = item.result.keywords || [];
         const cleanBase = item.file.name.replace(/\.[^/.]+$/, "");
         const ext = item.file.name.split('.').pop()?.toLowerCase() || '';
         const isVideo = item.file.type.startsWith('video/') || ['mp4', 'mov', 'webm', 'm4v', 'avi', 'mkv'].includes(ext);
         const isVector = ext === 'eps' || ext === 'ai';

         if (isVector) {
           try {
             const epsBlob = await embedMetadataIntoEps(item.file, title, keywords, item.result.shortDescription);
             zip.file(item.file.name, epsBlob);
           } catch (_) {
             zip.file(item.file.name, item.file);
           }
         } else if (isVideo) {
           // Include original video file in ZIP
           zip.file(item.file.name, item.file);
         } else {
           // For images, embed EXIF/IPTC directly into JPEG
           const blob = await embedJpegMetadata(item.file, title, keywords);
           zip.file(`${cleanBase}.jpg`, blob);
         }
         
         // Standard metadata text sidecar
         const sidecar = `Title: ${title}\nDescription: ${item.result.shortDescription || title}\nKeywords: ${keywords.join(', ')}`;
         zip.file(`${cleanBase}_metadata.txt`, sidecar);

         // Adobe standard XMP sidecar (industry standard for Photoshop, Premiere, After Effects, Illustrator)
         const xmpContent = generateXmpSidecarXml(title, keywords, item.result.shortDescription);
         zip.file(`${cleanBase}.xmp`, xmpContent);
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      triggerBrowserDownload(content, `Stock_Metadata_Images_${Date.now()}.zip`);
      showToast("✓ All Metadata embedded & ZIP downloaded!");
    } catch (err: any) {
      console.error("ZIP Generation error:", err);
      showToast("Failed to create ZIP: " + (err?.message || "Unknown error"));
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteItem = async (id: string, isHistory?: boolean) => {
    // Revoke object url to free up memory before filtering
    const itemToDel = items.find(i => i.id === id);
    if (itemToDel && !itemToDel.isHistory && itemToDel.previewUrl) {
      URL.revokeObjectURL(itemToDel.previewUrl);
    }
    
    // Optimistic UI update
    setItems((prev) => prev.filter(item => item.id !== id));
    
    // Delete from Firestore if user is logged in
    if (user && (isHistory || itemToDel?.status === 'completed')) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'assets', id));
      } catch (err) {
        console.error("Failed to delete asset from Firestore:", err);
      }
    }
  };

  const clearAllItems = async () => {
    const itemsToDelete = [...items];
    
    // Revoke object urls to free up memory
    itemsToDelete.forEach(item => {
      if (!item.isHistory && item.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
    });
    
    setItems([]);
    setShowClearConfirm(false);

    if (user) {
      const deletePromises = itemsToDelete
        .filter(item => item.isHistory || item.status === 'completed')
        .map(item => deleteDoc(doc(db, 'users', user.uid, 'assets', item.id)).catch(() => {}));
      await Promise.allSettled(deletePromises);
    }
  };

  const openEditor = (item: BulkItem) => {
    setEditingItemId(item.id);
    setEditingKeywords([...(item.result?.keywords || [])]);
    setEditingTitle(item.result?.recommendedTitle || '');
  };

  const saveKeywords = async () => {
    if (!editingItemId) return;
    const targetId = editingItemId;
    const updatedKeywords = [...editingKeywords];
    const updatedTitle = editingTitle;

    setItems((prev) =>
      prev.map((i) => {
        if (i.id === targetId && i.result) {
          return {
            ...i,
            result: {
              ...i.result,
              keywords: updatedKeywords,
              recommendedTitle: updatedTitle,
            },
          };
        }
        return i;
      })
    );
    setEditingItemId(null);

    // Sync edited metadata with Firestore if user is signed in
    if (user) {
      try {
        const docRef = doc(collection(db, 'users', user.uid, 'assets'), targetId);
        await updateDoc(docRef, {
          'result.keywords': updatedKeywords,
          'result.recommendedTitle': updatedTitle,
        });
      } catch (firestoreErr) {
        console.warn("Could not sync keyword updates to Firestore:", firestoreErr);
      }
    }
  };

  const moveKwUp = (index: number) => {
    if (index === 0) return;
    const newKw = [...editingKeywords];
    [newKw[index - 1], newKw[index]] = [newKw[index], newKw[index - 1]];
    setEditingKeywords(newKw);
  };

  const moveKwDown = (index: number) => {
    if (index === editingKeywords.length - 1) return;
    const newKw = [...editingKeywords];
    [newKw[index + 1], newKw[index]] = [newKw[index], newKw[index + 1]];
    setEditingKeywords(newKw);
  };

  const removeKw = (index: number) => {
    setEditingKeywords((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    const kw = newKeyword.trim().toLowerCase();
    
    // Basic Spam Detection
    const spamTerms = ['adobe', 'instagram', 'logo', 'trademark', 'brand', 'copyright', 'watermark'];
    if (spamTerms.some(term => kw.includes(term))) {
      setSpamWarning(`Warning: "${newKeyword}" looks like a restricted or spam keyword and might cause rejection.`);
      setTimeout(() => setSpamWarning(null), 5000);
    }

    if (newKeyword.trim() && !editingKeywords.includes(newKeyword.trim())) {
      setEditingKeywords([...editingKeywords, newKeyword.trim()]);
    }
    setNewKeyword('');
  };

  // 1-Click AI Auto-Enhance & Commercial Optimization Engine
  const autoFixItem = async (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item || !item.result) return;

    let title = (item.result.recommendedTitle || '').trim();
    // Clean up title: remove trailing punctuation or duplicate words
    title = title.replace(/[\.\,\;\:\-]+$/, '').trim();
    const words = title.split(/\s+/).filter(Boolean);
    if (words.length < 6) {
      title = `${title} in modern commercial setting`;
    }

    // Keyword optimization: unique, remove spam keywords, prioritize top keywords
    const spamTerms = ['adobe', 'instagram', 'logo', 'trademark', 'brand', 'copyright', 'watermark', 'vector', 'isolated', 'white background'];
    const seen = new Set<string>();
    let cleanKws: string[] = [];

    for (const kw of item.result.keywords || []) {
      const lower = kw.toLowerCase().trim();
      if (!lower || lower.length < 2) continue;
      if (spamTerms.some((st) => lower === st)) continue;
      if (!seen.has(lower)) {
        seen.add(lower);
        cleanKws.push(kw.trim());
      }
    }

    // Ensure balanced tags count (aim for 32 - 45 tags)
    if (cleanKws.length < 30) {
      const fillers = ['commercial photography', 'high resolution', 'authentic lifestyle', 'contemporary design', 'professional composition', 'copy space', 'creative concept', 'modern visual', 'editorial quality'];
      for (const f of fillers) {
        if (!seen.has(f) && cleanKws.length < 35) {
          seen.add(f);
          cleanKws.push(f);
        }
      }
    }

    const updatedResult = {
      ...item.result,
      recommendedTitle: title,
      keywords: cleanKws,
      acceptanceProbability: Math.min(98, Math.max(90, (item.result.acceptanceProbability || 85) + 8)),
    };

    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, result: updatedResult } : i))
    );

    if (user) {
      try {
        const docRef = doc(collection(db, 'users', user.uid, 'assets'), itemId);
        await updateDoc(docRef, {
          'result.recommendedTitle': title,
          'result.keywords': cleanKws,
          'result.acceptanceProbability': updatedResult.acceptanceProbability,
        });
      } catch (err) {
        console.warn('Could not sync auto-fix to Firestore:', err);
      }
    }

    showToast('✨ 1-Click Auto-Fix applied! Score enhanced to 90+');
  };

  const handleSaveAlgorithmKeywords = async (itemId: string, updatedKeywords: string[]) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId && i.result
          ? { ...i, result: { ...i.result, keywords: updatedKeywords } }
          : i
      )
    );
    if (user) {
      try {
        const docRef = doc(collection(db, 'users', user.uid, 'assets'), itemId);
        await updateDoc(docRef, { 'result.keywords': updatedKeywords });
      } catch (err) {
        console.warn('Could not sync algorithm keywords to Firestore:', err);
      }
    }
  };

  const handleAddCompetitorKeywords = async (itemId: string, newKeywords: string[]) => {
    let finalKeywords: string[] = [];
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === itemId && i.result) {
          const current = i.result.keywords || [];
          const combined = Array.from(new Set([...current, ...newKeywords])).slice(0, 50);
          finalKeywords = combined;
          return { ...i, result: { ...i.result, keywords: combined } };
        }
        return i;
      })
    );
    if (user && finalKeywords.length > 0) {
      try {
        const docRef = doc(collection(db, 'users', user.uid, 'assets'), itemId);
        await updateDoc(docRef, { 'result.keywords': finalKeywords });
      } catch (err) {
        console.warn('Could not sync competitor keywords to Firestore:', err);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <RefreshCw className="animate-spin text-indigo-500 w-8 h-8" />
      </div>
    );
  }

  if (!user || loginTransition === 'authenticating' || loginTransition === 'leaving') {
    const isLeaving = loginTransition === 'leaving';
    const isAuthenticating = loginTransition === 'authenticating';
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isLeaving ? { x: '120vw', rotate: 5, opacity: 0 } : { opacity: 1, y: 0, x: 0, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: isLeaving ? 80 : 120, 
            damping: isLeaving ? 15 : 18,
            mass: 1
          }}
          className="relative z-10 w-full max-w-md flex flex-col items-center"
        >
          {/* The Bike */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 0.3 }}
            className="text-7xl mb-2 drop-shadow-2xl z-20"
            style={{ transform: 'scaleX(-1)' }}
          >
            🏍️💨
          </motion.div>
          
          {/* Connecting rope */}
          <div className="w-1 h-8 bg-gradient-to-b from-slate-500 to-transparent z-10"></div>

          {/* Login Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-10 rounded-3xl shadow-2xl w-full text-center relative z-20">
             <div className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden shadow-2xl border border-indigo-500/50">
               <img src={ratulLogo} alt="AdobeMeta Pro Logo" className="w-full h-full object-cover" />
             </div>
             
             <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
               AdobeMeta <span className="text-indigo-400">Pro</span>
             </h1>
             
             <p className="text-slate-400 text-sm mb-4">
               The Ultimate Bulk Asset Metadata & Compliance Platform for Stock Contributors.
             </p>

             {/* 1-Month Free Unlimited Pro Announcement */}
             <div className="mb-6 bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-purple-500/15 border border-amber-500/30 rounded-2xl p-3.5 text-center">
               <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-black uppercase tracking-wider mb-1">
                 <Sparkles className="w-3.5 h-3.5" />
                 <span>Launch Offer: 1 Month FREE</span>
               </div>
               <p className="text-xs text-slate-200 font-medium leading-relaxed">
                 Enjoy <strong className="text-amber-300">100% Unlimited Pro Version</strong> free for your first 30 days! No credit card needed.
               </p>
             </div>
             
             <motion.button
               whileHover={{ scale: 1.03 }}
               whileTap={{ scale: 0.97 }}
               onClick={handleGoogleLogin}
               disabled={isLeaving || isAuthenticating}
               className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold py-3.5 px-6 rounded-xl transition flex items-center justify-center gap-3 shadow-lg disabled:opacity-80"
             >
               <svg className="w-5 h-5" viewBox="0 0 24 24">
                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
               </svg>
               {isLeaving ? 'Hold on tight! 💨' : isAuthenticating ? 'Waiting for Auth...' : 'Continue with Google'}
             </motion.button>

             <motion.button
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={() => {
                 setUser(DEFAULT_FOUNDER_USER);
                 setIsPro(true);
                 setProDaysLeft(30);
                 setCredits(999999);
                 setPlanType('premium');
                 setLoginTransition('idle');
                 showToast('✨ Welcome back Ratul Sorker! VIP Contributor Workspace unlocked.');
               }}
               disabled={isLeaving || isAuthenticating}
               className="w-full mt-3 bg-gradient-to-r from-amber-500/20 via-indigo-600/30 to-purple-600/30 hover:from-amber-500/30 hover:to-purple-600/50 text-amber-200 hover:text-white border border-amber-500/40 font-bold py-3.5 px-5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
             >
               <Sparkles className="w-4 h-4 text-amber-400" />
               <span>⚡ Quick Enter as Ratul Sorker (Founder VIP)</span>
             </motion.button>

             <motion.button
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={handleGuestLogin}
               disabled={isLeaving || isAuthenticating}
               className="w-full mt-3 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 hover:from-indigo-600/50 hover:to-purple-600/50 text-indigo-200 hover:text-white border border-indigo-500/40 font-semibold py-3 px-5 rounded-xl transition flex items-center justify-center gap-2 shadow"
             >
               <Sparkles className="w-4 h-4 text-amber-400" />
               <span>Instant Access as Guest Contributor</span>
             </motion.button>

             <button
               onClick={handleGuestLogin}
               className="mt-3 text-xs text-slate-400 hover:text-slate-200 underline underline-offset-4 transition"
             >
               Skip sign-in and start uploading assets directly →
             </button>

             <div className="mt-8 pt-6 border-t border-slate-800">
                <div className="text-center flex flex-col justify-center items-center">
                   <span className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-bold mb-1">Founder</span>
                   <span className="text-sm font-black tracking-wide text-slate-100">Ratul Sorker</span>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loginTransition === 'welcome') {
    const defaultName = user?.email?.split('@')[0] || 'Creator';
    const displayUserName = user?.displayName || defaultName;
    return <WelcomeScreen userName={displayUserName} />;
  }

  return (
    <div 
      className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans relative overflow-x-hidden"
      style={customBgUrl ? {
        backgroundImage: `url(${customBgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      } : {}}
    >
      {/* Dark overlay if custom background is used so content stays readable */}
      {customBgUrl && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] z-0 pointer-events-none" />
      )}
      {/* AI Assistant Chatbot Widget */}
      <AnimatePresence>
        <>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="fixed bottom-6 right-6 z-[110] bg-indigo-600 hover:bg-indigo-500 text-white p-3.5 rounded-full shadow-xl border border-indigo-400/30 flex items-center justify-center gap-2 group"
            title="Open AI Stock Assistant"
          >
            {isChatOpen ? <X className="w-6 h-6" /> : (
              <>
                <MessageSquare className="w-6 h-6" />
                <span className="hidden sm:inline-block text-xs font-semibold pr-1">AI Assistant</span>
              </>
            )}
          </motion.button>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="fixed bottom-20 right-4 sm:right-6 z-[110] w-[calc(100vw-2rem)] sm:w-[380px] h-[480px] max-h-[80vh] bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl flex flex-col overflow-hidden"
            >
              <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300"/>
                  <h3 className="text-white font-bold text-sm">AdobeMeta Pro AI Assistant</h3>
                </div>
                <div className="flex items-center gap-2">
                  {isPro ? (
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-400/20 border border-amber-300/40 text-amber-200 px-2 py-0.5 rounded-full">Pro</span>
                  ) : (
                    <span className="text-[10px] bg-indigo-950/60 text-indigo-100 px-2 py-0.5 rounded-full font-medium">
                      {Math.max(0, 20 - chatUsage)} msgs left
                    </span>
                  )}
                  <button onClick={() => setIsChatOpen(false)} className="text-white/80 hover:text-white p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/60">
                {chatMessages.map((msg, idx) => {
                  const textContent = msg.parts?.[0]?.text || msg.text || '';
                  const isError = textContent.startsWith('⚠️');
                  return (
                    <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[88%] p-3 rounded-2xl text-xs sm:text-sm whitespace-pre-wrap leading-relaxed ${
                        msg.role === "user" 
                          ? "bg-indigo-600 text-white rounded-tr-sm" 
                          : isError 
                            ? "bg-rose-950/80 border border-rose-700/60 text-rose-200 rounded-tl-sm"
                            : "bg-slate-800 text-slate-200 border border-slate-700/80 rounded-tl-sm"
                      }`}>
                        {textContent}
                      </div>
                    </div>
                  );
                })}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl rounded-tl-sm text-sm text-slate-400 flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></div>
                      </div>
                      <span className="text-xs text-slate-400">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>
              <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && chatInput.trim()) {
                      e.preventDefault();
                      handleSendChat();
                    }
                  }}
                  placeholder="Ask anything about stock metadata, AI prompts, or marketplace guidelines..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => chatInput.trim() && handleSendChat()}
                  disabled={!chatInput.trim() || isChatLoading}
                  className="bg-indigo-600 disabled:bg-slate-800 disabled:text-slate-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl transition flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </>
      </AnimatePresence>
      
      {/* Background ambient lighting - only show if no custom BG to prevent clashing */}
      {!customBgUrl && (
        <>
          <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-900/10 blur-[150px] pointer-events-none z-0" />
          <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-900/10 blur-[150px] pointer-events-none z-0" />
        </>
      )}

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-6 relative z-10"
      >
        {/* Top Header: Brand Identity, Plan Status & Utilities */}
        <motion.header variants={itemVariants} className="bg-slate-950/90 backdrop-blur-xl px-5 py-4 rounded-2xl border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <motion.div whileHover={{ scale: 1.05, rotate: -3 }} className="w-12 h-12 rounded-xl overflow-hidden shadow-lg border border-indigo-500/30 shrink-0">
              <img src={ratulLogo} alt="RATUL Logo" className="w-full h-full object-cover" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">AdobeMeta <span className="text-indigo-400">Pro</span></h1>
                <span className="bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" /> 100 Files Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">Commercial Stock Metadata, Compliance & Multi-Agency Distribution</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Contributor Profile / Plan Badge */}
            <div className="flex items-center gap-2.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 shadow-inner">
              <div className="text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-amber-400 font-black flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                    {user?.email === "ratulsorker266@gmail.com" 
                      ? "Founder (VIP)" 
                      : isPro 
                      ? `Unlimited Pro (${proDaysLeft}d)`
                      : "Unlimited Pro"}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-200 truncate max-w-[120px] sm:max-w-[160px]">
                  {user?.displayName || user?.email?.split("@")[0] || "Contributor"}
                </div>
              </div>

              <button 
                onClick={() => setShowProModal(true)} 
                className="text-[10px] uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-2.5 py-1.5 rounded-lg shadow transition shrink-0"
              >
                PRO PASS
              </button>
            </div>

            {/* Quick Utility Icons */}
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setShowArcadeModal(true)}
                className="p-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-purple-500/20 hover:from-amber-500/30 hover:to-purple-500/30 text-amber-300 hover:text-white border border-amber-500/30 transition flex items-center gap-1.5"
                title="Play Contributor Arcade Mini-Games (🎮)"
              >
                <Gamepad2 className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline text-xs font-bold">Arcade 🎮</span>
              </button>

              <button
                onClick={() => {
                  setTourStep(0);
                  setShowTourModal(true);
                }}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
                title="Interactive Guide & Tour"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowShortcutsModal(true)}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
                title="Keyboard Shortcuts (?)"
              >
                <Keyboard className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
                title="Settings & API Key"
              >
                <Settings className="w-4 h-4" />
              </button>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.header>

        {/* Dedicated Navigation Bar & Contributor Power Ribbon */}
        <motion.div variants={itemVariants} className="bg-slate-900/90 backdrop-blur-xl p-2.5 rounded-2xl border border-slate-800 shadow-xl flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
          {/* Main Primary View Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 overflow-x-auto scrollbar-none shrink-0">
            <button
              onClick={() => setCurrentView('upload')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                currentView === 'upload'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Studio</span>
            </button>

            <button
              onClick={() => setCurrentView('trends')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                currentView === 'trends'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Market Trends</span>
            </button>

            <button
              onClick={() => setCurrentView('prompts')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                currentView === 'prompts'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Wand2 className="w-4 h-4 text-purple-400" />
              <span>AI Prompts</span>
            </button>

            <button
              onClick={() => setCurrentView('calendar')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                currentView === 'calendar'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <CalendarDays className="w-4 h-4 text-amber-400" />
              <span>Calendar</span>
            </button>

            <button
              onClick={() => setCurrentView('competitor')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                currentView === 'competitor'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Competitor Spy</span>
            </button>
          </div>

          {/* Contributor Tools Quick-Launch Toolbar */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            <button
              onClick={() => setShowToolsHubModal(true)}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:brightness-110 text-white text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20 shrink-0 border border-indigo-400/30"
              title="Open All 12 Contributor Tools Hub"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Tools Hub</span>
              <span className="bg-black/40 text-[10px] px-1.5 py-0.2 rounded-full font-black">12</span>
            </button>

            <button
              onClick={() => setShowMultiCsvModal(true)}
              className="bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold px-2.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-emerald-500/30 shrink-0 shadow-sm"
              title="1-Click Multi-Marketplace CSV Exporter & Bulk Renamer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
              <span>Multi-CSV</span>
            </button>

            <button
              onClick={() => setShowVectorStudioModal(true)}
              className="bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-amber-300 text-xs font-semibold px-2.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-700/80 shrink-0"
              title="EPS & AI Vector Metadata Studio"
            >
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              <span>Vector</span>
            </button>

            <button
              onClick={() => setShowTrademarkModal(true)}
              className="bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-rose-300 text-xs font-semibold px-2.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-700/80 shrink-0"
              title="Automated Trademark & IP Shield"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>IP Shield</span>
            </button>

            <button
              onClick={() => setShowRankModal(true)}
              className="bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-blue-300 text-xs font-semibold px-2.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-700/80 shrink-0"
              title="Algorithmic Rank Predictor"
            >
              <Target className="w-3.5 h-3.5 text-blue-400" />
              <span>Rank</span>
            </button>

            <button
              onClick={() => setShowNicheRadarModal(true)}
              className="bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-amber-300 text-xs font-semibold px-2.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-700/80 shrink-0"
              title="Real-Time Niche Opportunity Radar"
            >
              <Radar className="w-3.5 h-3.5 text-amber-400" />
              <span>Niche</span>
            </button>

            <button
              onClick={() => setShowReleaseModal(true)}
              className="bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-teal-300 text-xs font-semibold px-2.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-700/80 shrink-0"
              title="Model & Property Release Inspector"
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Releases</span>
            </button>

            <button
              onClick={() => setShowReversePromptModal(true)}
              className="bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-purple-300 text-xs font-semibold px-2.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-700/80 shrink-0"
              title="Reverse Image Prompt Engineer"
            >
              <Wand2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Reverse AI</span>
            </button>

            <button
              onClick={() => setShowEarningsModal(true)}
              className="bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-green-300 text-xs font-semibold px-2.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-700/80 shrink-0"
              title="Earnings & Portfolio ROI Calculator"
            >
              <Calculator className="w-3.5 h-3.5 text-green-400" />
              <span>ROI</span>
            </button>

            <button
              onClick={() => setShowCleanerModal(true)}
              className="bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 text-xs font-semibold px-2.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-700/80 shrink-0"
              title="Semantic Tag Cleaner & Spam Eliminator"
            >
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tags</span>
            </button>

            <button
              onClick={() => setShowGuideHubModal(true)}
              className="bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-indigo-300 text-xs font-semibold px-2.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-700/80 shrink-0"
              title="Microstock Contributor Masterclass Guide"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Guide</span>
            </button>

            <button
              onClick={() => setShowFtpModal(true)}
              className="bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 text-xs font-semibold px-2.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-700/80 shrink-0"
              title="Cloud & FTP Direct Submission Setup"
            >
              <CloudUpload className="w-3.5 h-3.5 text-cyan-400" />
              <span>FTP</span>
            </button>

            <button
              onClick={() => setShowSimulatorModal(true)}
              className="bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-violet-300 text-xs font-semibold px-2.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-700/80 shrink-0"
              title="Marketplace Buyer Search Simulator"
            >
              <Eye className="w-3.5 h-3.5 text-violet-400" />
              <span>Buyer View</span>
            </button>
          </div>
        </motion.div>
        {/* AdSense Placeholder */}
        <motion.div variants={itemVariants} className="bg-slate-900/40 border border-dashed border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-inner min-h-[90px]">
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 opacity-70">Advertisement</span>
           <p className="text-xs text-slate-600 font-medium">Google AdSense Space (728x90) / Affiliate Banner</p>
        </motion.div>
        {/* Affiliate Banner */}
        <motion.div variants={itemVariants} className="bg-slate-900/80 backdrop-blur-md border border-indigo-500/30 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-900/50 rounded-full flex items-center justify-center border border-indigo-500/50">
               <TrendingUp className="w-5 h-5 text-indigo-400" />
             </div>
             <div>
               <h4 className="text-sm font-bold text-white">Recommended Platforms</h4>
               <p className="text-xs text-slate-400">Maximize your earnings by joining our top partnered stock marketplaces.</p>
             </div>
          </div>
          <div className="flex flex-wrap gap-3">
             <a href="https://submit.shutterstock.com" target="_blank" rel="noreferrer" className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 text-xs font-bold px-4 py-2 rounded-lg transition">Join Shutterstock</a>
             <a href="https://contributor.stock.adobe.com" target="_blank" rel="noreferrer" className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 text-xs font-bold px-4 py-2 rounded-lg transition">Join Adobe Stock</a>
             <a href="https://www.freepik.com/contributor" target="_blank" rel="noreferrer" className="bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-4 py-2 rounded-lg transition">Join Freepik</a>
          </div>
        </motion.div>

        
        <AnimatePresence>
          {showReferModal && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 p-6 border-b border-slate-800 flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                      <Gift className="w-6 h-6 text-pink-500" /> Refer & Earn PRO
                    </h2>
                    <p className="text-sm text-slate-400 mt-2">
                      Invite 100 creators to Stock AI and get <strong className="text-pink-400">3 Months of Premium</strong> absolutely FREE!
                    </p>
                  </div>
                  <button onClick={() => setShowReferModal(false)} className="text-slate-400 hover:text-white transition p-1 bg-slate-800 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-slate-300">Your Progress</span>
                      <span className="text-pink-400">{referralCount} / 100 Invited</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3 border border-slate-700 overflow-hidden relative">
                      <motion.div 
                        initial={{ width: 0 }} animate={{ width: `${(referralCount / 100) * 100}%` }} 
                        transition={{ duration: 1, delay: 0.2 }}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Your Unique Invite Link</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        readOnly 
                        value="https://stock-ai.com/ref/user_992x" 
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-3 text-slate-300 font-mono text-sm focus:outline-none"
                      />
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText("https://stock-ai.com/ref/user_992x");
                          showToast("Referral link copied!");
                        }}
                        className="bg-pink-600 hover:bg-pink-500 text-white p-2.5 rounded-lg transition"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center mt-6">
                    <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-2 text-indigo-400"><Copy className="w-4 h-4" /></div>
                      <p className="text-xs font-semibold text-slate-300">1. Share Link</p>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-2 text-emerald-400"><CheckCircle className="w-4 h-4" /></div>
                      <p className="text-xs font-semibold text-slate-300">2. Friends Join</p>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 border-pink-500/30">
                      <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto mb-2 text-pink-400"><Gift className="w-4 h-4" /></div>
                      <p className="text-xs font-semibold text-slate-300">3. Get PRO!</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {currentView === 'trends' ? (
            <TrendsDashboard
              key="trends"
              onBack={() => setCurrentView('upload')}
              customApiKey={customApiKey}
              user={user}
              planType={planType === "premium" || planType === "pro" ? "pro" : "free"}
              setTrendsUsage={setTrendsUsage}
              initialSearchQuery={trendSearchPreload}
            />
          ) : currentView === 'competitor' ? (
            <CompetitorDashboard key="competitor" onBack={() => setCurrentView('upload')} customApiKey={customApiKey} />
          ) : currentView === 'prompts' ? (
            <PromptStudioDashboard
              key="prompts"
              onBack={() => {
                setPromptStudioPreloadConcept('');
                setCurrentView('upload');
              }}
              customApiKey={customApiKey}
              showToast={showToast}
              initialConcept={promptStudioPreloadConcept}
            />
          ) : currentView === 'calendar' ? (
            <SeasonalCalendarDashboard
              key="calendar"
              onBack={() => setCurrentView('upload')}
              onExploreTrends={(q) => {
                setTrendSearchPreload(q);
                setCurrentView('trends');
              }}
              onOpenPromptStudioWithIdea={(idea) => {
                setPromptStudioPreloadConcept(idea);
                setCurrentView('prompts');
              }}
            />
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Top High-RPM Monetization Leaderboard */}
              <GoogleAdSenseBanner format="leaderboard" />

              {/* Studio Metadata Settings Bar */}
              <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-xl">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Asset Type</span>
                    </label>
                    <select
                      value={assetType}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAssetType(val);
                        if (val.includes('Generative AI')) {
                          setIsAiGenerated(true);
                        }
                      }}
                      className="w-full bg-slate-950/80 border border-slate-700 hover:border-slate-600 text-sm rounded-xl px-3.5 py-2.5 text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none transition shadow-inner"
                    >
                      <option value="Photo / JPG">Photo / JPG</option>
                      <option value="Photoshop PSD / Template">Photoshop PSD / Template (.PSD, .SPD, .PSB)</option>
                      <option value="Vector / EPS">Vector / EPS (Scalable Vector)</option>
                      <option value="Stock Video / Footage (4K / HD)">Stock Video / Footage (4K / HD)</option>
                      <option value="PNG (Transparent)">PNG (Transparent Background)</option>
                      <option value="Illustration">Illustration / Clipart</option>
                      <option value="3D Render">3D Render / CGI</option>
                      <option value="Generative AI">Generative AI Art</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Target Marketplace</span>
                    </label>
                    <select
                      value={targetMarketplace}
                      onChange={(e) => setTargetMarketplace(e.target.value as TargetMarketplace)}
                      className="w-full bg-slate-950/80 border border-slate-700 hover:border-slate-600 text-sm rounded-xl px-3.5 py-2.5 text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none transition shadow-inner"
                    >
                      <option value="adobe_stock">Adobe Stock (Top 10 Ranked, 49 KW)</option>
                      <option value="shutterstock">Shutterstock (5+ Words Title, 50 KW)</option>
                      <option value="freepik">Freepik (Design Tags, 30 Max)</option>
                      <option value="vecteezy">Vecteezy (Vector & Art Focus, 35 KW)</option>
                      <option value="getty">Getty Images / iStock (35 KW)</option>
                      <option value="123rf">123RF (45 KW)</option>
                      <option value="dreamstime">Dreamstime (45 KW)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Language</span>
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700 hover:border-slate-600 text-sm rounded-xl px-3.5 py-2.5 text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none transition shadow-inner"
                    >
                      <option value="English">English (Global Default)</option>
                      <option value="Spanish">Spanish (Español)</option>
                      <option value="French">French (Français)</option>
                      <option value="German">German (Deutsch)</option>
                      <option value="Italian">Italian (Italiano)</option>
                      <option value="Portuguese">Portuguese (Português)</option>
                      <option value="Japanese">Japanese (日本語)</option>
                    </select>
                  </div>
                </div>
              </div>

              <motion.div variants={itemVariants} className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
                <motion.div 
                  whileHover={{ scale: 1.01, borderColor: "rgba(99, 102, 241, 0.8)" }}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed transition-all rounded-xl p-12 text-center relative group overflow-hidden ${
                    isDragging 
                      ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_50px_rgba(99,102,241,0.2)]' 
                      : 'border-slate-800 bg-slate-900/40 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <input
                    type="file"
                    multiple
                    onChange={handleFilesSelect}
                    accept="image/*,video/*,.svg,.eps,.ai,.psd,.psb,.spd,.mp4,.mov,.webm,.m4v,.avi"
                    className="hidden"
                    id="bulkInput"
                  />
                  <label htmlFor="bulkInput" className="cursor-pointer space-y-4 block relative z-10">
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="w-16 h-16 bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto border border-indigo-500/20 shadow-lg"
                    >
                      <Upload className="w-8 h-8 text-indigo-400" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-slate-100">
                      {isDragging ? 'Drop your PSD/SPD, EPS, Photos or Videos here!' : 'Drag & Drop files or Click to select'}
                    </h3>
                    <p className="text-base font-bold text-slate-300">Selected: <span className="text-indigo-400">{items.length}</span>/100 Files</p>
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <span className="text-[11px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Layers className="w-3 h-3 text-sky-400" /> Photoshop: .PSD / .SPD / .PSB
                      </span>
                      <span className="text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <FileCode className="w-3 h-3 text-amber-400" /> Vector: .EPS / .AI / .SVG
                      </span>
                      <span className="text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-indigo-400" /> Photo: .JPG / .PNG / .WEBP
                      </span>
                      <span className="text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Video className="w-3 h-3 text-purple-400" /> 4K Video: .MP4 / .MOV
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">Automatic Photoshop composite canvas rendering, PostScript DSC parsing & Adobe XMP sidecar generation</p>
                  </label>
                </motion.div>

                {/* Direct Vector EPS/AI Metadata Studio Shortcut Banner */}
                <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-slate-900 border border-amber-500/30 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <FileCode className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>EPS & AI Vector Metadata Studio</span>
                        <span className="text-[9px] bg-amber-500/30 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded font-black">DIRECT TOOL</span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Upload individual EPS/AI files to directly edit titles, tags, export .XMP sidecars, or write internal PostScript DSC metadata.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowVectorStudioModal(true)}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow-sm"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Open Vector Studio</span>
                  </button>
                </div>
              </motion.div>

              {/* Contributor Milestone Goal Widget */}
              <ContributorGoalWidget completedCount={items.filter((i) => i.result).length} />

              {/* Dedicated Top Action Bar for instant visibility of download buttons */}
              {items.length > 0 && (
                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-black text-sm">
                      {items.filter(i => i.result).length}/{items.length}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>Studio Queue Status</span>
                        {items.filter(i => i.result).length > 0 && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                            {items.filter(i => i.result).length} Ready for Download
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {isProcessing
                          ? 'Dual-Agent AI is currently scanning and generating commercial metadata...'
                          : items.filter(i => i.result).length > 0
                          ? 'Metadata ready! Download ZIP with embedded EXIF/IPTC/XMP or CSV below.'
                          : 'Click "Start Auto Keywording" below to generate keywords.'}
                      </p>
                      {isProcessing && (
                        <button
                          type="button"
                          onClick={() => setShowArcadeModal(true)}
                          className="mt-2.5 inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/25 via-indigo-600/35 to-purple-600/35 hover:from-amber-500/40 hover:to-purple-600/50 text-amber-300 hover:text-white border border-amber-500/40 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-md shadow-amber-500/10 animate-pulse cursor-pointer"
                        >
                          <Gamepad2 className="w-4 h-4 text-amber-400" />
                          <span>Waiting for Metadata? Play Contributor Games (🎮)</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {items.filter(i => i.result).length > 0 ? (
                      <>
                        <button
                          type="button"
                          onClick={exportBatchZip}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                        >
                          <Download className="w-4 h-4 text-slate-950" />
                          <span>Download All in ZIP</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowMultiCsvModal(true)}
                          className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40 font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                          <span>Multi-Marketplace CSV</span>
                        </button>

                        <button
                          type="button"
                          onClick={exportBatchCSV}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer"
                        >
                          <FileDown className="w-4 h-4 text-slate-300" />
                          <span>CSV Export</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={startBulkProcessing}
                        disabled={isProcessing}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-indigo-600/25 cursor-pointer"
                      >
                        <Sparkles className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                        <span>{isProcessing ? 'Analyzing Images...' : 'Start Auto Keywording'}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Dedicated Failed Items Retry Banner - ONLY shows when there are failed files */}
              <AnimatePresence>
                {items.some(i => i.status === 'error') && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    className="bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-red-500/15 border border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl shadow-amber-950/20"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-100">
                            {items.filter(i => i.status === 'error').length} file(s) failed during analysis
                          </h4>
                          <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                            {items.filter(i => i.status === 'error').length} Failed
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Temporary rate limit or network issue occurred. Click the button to automatically retry all failed files with backoff.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={retryFailedItems}
                      disabled={isProcessing}
                      className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 shrink-0 cursor-pointer"
                    >
                      <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                      {isProcessing ? 'Retrying in progress...' : `Retry Failed Files (${items.filter(i => i.status === 'error').length})`}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div variants={containerVariants} className="space-y-4 pb-32">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      key={item.id} 
                      className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-wrap items-center gap-4 justify-between shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-800 shadow-inner bg-slate-900 flex items-center justify-center relative">
                            {item.previewUrl ? (
                              <>
                                <img src={item.previewUrl} alt="preview" className="w-full h-full object-cover" />
                                {item.file.name.match(/\.(eps|ai)$/i) && (
                                  <span className="absolute top-1 left-1 bg-amber-500 text-slate-950 px-1 py-0.2 rounded text-[8px] font-black shadow-sm">
                                    EPS
                                  </span>
                                )}
                              </>
                            ) : item.file.name.match(/\.(eps|ai)$/i) ? (
                              <div className="w-full h-full bg-gradient-to-br from-amber-600/30 via-slate-900 to-indigo-900/40 flex flex-col items-center justify-center p-1">
                                <RefreshCw className="w-5 h-5 text-amber-400 animate-spin mb-0.5" />
                                <span className="text-[8px] font-black uppercase text-amber-300 tracking-wider">PARSING EPS</span>
                              </div>
                            ) : (
                              <Layers className="w-6 h-6 text-slate-700" />
                            )}
                          </div>
                          {item.file.type.startsWith('video/') || item.file.name.match(/\.(mp4|mov|webm|m4v|avi)$/i) ? (
                            <span className="absolute bottom-1 right-1 bg-black/80 text-indigo-400 p-0.5 rounded shadow text-[9px] flex items-center">
                              <Video className="w-3 h-3" />
                            </span>
                          ) : null}
                          {item.status === 'processing' && (
                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center rounded-lg">
                               <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold truncate max-w-[200px] text-slate-200 flex items-center gap-2">
                            {item.file.name}
                            {item.isHistory && <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase tracking-widest">History</span>}
                          </p>
                          {!item.isHistory && <p className="text-xs text-slate-500 font-medium mt-0.5">{(item.file.size / (1024 * 1024)).toFixed(1)} MB</p>}
                          {item.result && (
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border ${
                              item.result.riskLabel === 'Low risk' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              item.result.riskLabel === 'Medium risk' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                              {item.result.riskLabel}
                            </span>
                          )}
                        </div>
                      </div>

                      {item.result ? (
                        <div className="flex-1 px-2 sm:px-4 space-y-3 min-w-[300px]">
                          {/* Recommended Title */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                              <span className="font-semibold uppercase tracking-wider text-[10px] text-indigo-400">Commercial Title</span>
                              <span>{(item.result.recommendedTitle || '').length} characters</span>
                            </div>
                            <p className="text-sm font-bold text-slate-100 leading-snug">{item.result.recommendedTitle}</p>
                          </div>

                          {/* Commercial Readiness Score Gauge */}
                          <CommercialReadinessGauge
                            result={item.result}
                            onAutoFix={() => autoFixItem(item.id)}
                          />

                          {/* Semantic Color-Coded Keywords with Top 10 High-Ranking Badges */}
                          <SemanticKeywordBadges keywords={item.result.keywords} showToast={showToast} />
                          
                          {/* Rejection Shield & AI Vision Defect Predictor */}
                          <div className="mt-1">
                            <RejectionShieldBadge item={item} />
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 px-4 text-sm font-medium text-slate-500 flex items-center gap-2">
                          {item.status === 'processing' ? (
                            <div className="flex flex-col gap-1 w-full text-left">
                              {planType === "premium" || customApiKey ? (
                                <motion.div 
                                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                  className="text-emerald-400 font-mono text-xs flex flex-col"
                                >
                                  <span className="flex items-center gap-2"><RefreshCw className="w-3 h-3 animate-spin text-emerald-400" /> ⚡ Agent 1 (Flash): Scanning image composition...</span>
                                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="flex items-center gap-2 text-indigo-400">
                                    <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" /> 🧠 Agent 2 (Pro): Injecting high-buyer-intent SEO keywords...
                                  </motion.span>
                                </motion.div>
                              ) : (
                                <div className="text-slate-400 text-xs">
                                  <span className="flex items-center gap-2"><RefreshCw className="w-3 h-3 animate-spin" /> Basic AI Processing...</span>
                                  <p className="mt-1 text-[9px] text-amber-500/60 blur-[0.5px] flex items-center gap-1 font-bold">
                                    <Lock className="w-3 h-3" /> Upgrade to PRO for Dual-Agent Deep Scan
                                  </p>
                                </div>
                              )}
                            </div>
                          ) : item.status === 'error' ? (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full bg-red-950/25 border border-red-500/30 rounded-xl p-2.5">
                              <div className="flex items-center gap-2 text-red-300 text-xs font-medium">
                                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                                <span className="line-clamp-2 leading-tight">{item.error}</span>
                              </div>
                              <button
                                onClick={() => retrySingleFile(item)}
                                disabled={isProcessing}
                                className="shrink-0 bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 text-red-200 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition self-start sm:self-auto cursor-pointer shadow-sm hover:shadow-red-500/10"
                                title="Retry this file"
                              >
                                <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                                <span>Retry File</span>
                              </button>
                            </div>
                          ) : 'Ready in queue...'}
                        </div>
                      )}

                      {item.result && (
                        <div className="flex flex-wrap items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setAlgorithmActiveItem(item);
                              setShowAlgorithmBoosterModal(true);
                            }}
                            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                            title="Marketplace Algorithm Priority Booster (Top 10 Slots)"
                          >
                            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                            <span>Top 10 Boost</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setCompetitorActiveItem(item);
                              setShowCompetitorGapModal(true);
                            }}
                            className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                            title="Benchmark vs 1% Bestsellers & Fill Keyword Gaps"
                          >
                            <Target className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Competitor Gaps</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setRankActiveItem({
                                title: item.result!.recommendedTitle,
                                keywords: item.result!.keywords,
                              });
                              setShowRankModal(true);
                            }}
                            className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                            title="Predict Search Ranking & SEO Score"
                          >
                            <Target className="w-3.5 h-3.5 text-blue-400" />
                            <span>Rank Audit</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setTrademarkActiveItem({
                                title: item.result!.recommendedTitle,
                                keywords: item.result!.keywords,
                              });
                              setShowTrademarkModal(true);
                            }}
                            className="bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                            title="Scan this file for Trademark/IP Infringements"
                          >
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                            <span>IP Scan</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSimulatorActiveItem({
                                title: item.result!.recommendedTitle,
                                keywords: item.result!.keywords,
                                thumbnailUrl: item.previewUrl,
                              });
                              setShowSimulatorModal(true);
                            }}
                            className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                            title="Dual Agency Search Engine Simulator (Adobe vs Shutterstock)"
                          >
                            <Search className="w-3.5 h-3.5 text-purple-400" />
                            <span>Search Sim</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setMockupItem(item)}
                            className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                            title="Preview as real Adobe Stock / Shutterstock Buyer Page"
                          >
                            <Eye className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Mockup</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openEditor(item)}
                            className="bg-slate-900 border border-slate-700 hover:bg-slate-800 px-3 py-2 rounded-lg text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                            <span>Edit</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => copyMetadata(item.result!.recommendedTitle, item.result!.keywords, item.id)}
                            className="bg-slate-900 border border-slate-700 hover:bg-slate-800 px-3 py-2 rounded-lg text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
                          >
                            {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                            <span>Copy</span>
                          </motion.button>
                          {!item.isHistory && (
                            <>
                              {(item.file.name.match(/\.eps$/i)) && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={async () => {
                                    try {
                                      showToast("Injecting DSC metadata directly into EPS vector...");
                                      const blob = await embedMetadataIntoEps(
                                        item.file,
                                        item.result!.recommendedTitle,
                                        item.result!.keywords,
                                        item.result!.shortDescription
                                      );
                                      const base = item.file.name.replace(/\.eps$/i, '');
                                      triggerBrowserDownload(blob, `${base}_tagged.eps`);
                                      showToast(`✓ Downloaded ${base}_tagged.eps with embedded metadata!`);
                                    } catch (err: any) {
                                      console.error("EPS embedding error:", err);
                                      showToast("Error injecting into EPS: " + (err?.message || "Unknown error"));
                                    }
                                  }}
                                  className="bg-amber-950/70 hover:bg-amber-900/80 border border-amber-600/50 px-3 py-2 rounded-lg text-amber-300 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                                  title="Write PostScript DSC & XMP metadata directly into EPS vector file"
                                >
                                  <FileCode className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Tagged EPS</span>
                                </motion.button>
                              )}
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => downloadEmbeddedCopy(item)}
                                className="bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-600/50 px-3 py-2 rounded-lg text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                                title={item.file.type.startsWith('video/') || item.file.name.match(/\.(mp4|mov|webm|eps|ai)$/i)
                                  ? "Download industry standard Adobe XMP sidecar file"
                                  : "Directly download JPEG with embedded EXIF/IPTC Title & Keywords"}
                              >
                                <Download className="w-3.5 h-3.5 text-emerald-400" />
                                <span>{item.file.type.startsWith('video/') || item.file.name.match(/\.(mp4|mov|webm|eps|ai)$/i) ? 'Export XMP' : 'Tagged JPG'}</span>
                              </motion.button>
                            </>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => deleteItem(item.id, item.isHistory)}
                            className="bg-slate-900 border border-slate-700 px-2.5 py-2 rounded-lg text-slate-400 hover:text-red-400 transition"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {editingItemId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
            >
              <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-amber-400" /> Keyword Editor
                </h2>
                <button
                  onClick={() => setEditingItemId(null)}
                  className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition p-1.5 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-5 border-b border-slate-800 bg-slate-900 space-y-5">
                <div>
                  <label className="text-xs text-slate-400 font-bold tracking-wide uppercase block mb-2">Recommended Title</label>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    placeholder="Enter recommended title..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                  />
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <label className="text-xs text-slate-400 font-medium">Keywords ({editingKeywords.length})</label>
                  <button onClick={async () => {
                    try {
                      showToast("Generating long-tail keywords...");
                      const res = await fetch("/api/longtail", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", ...(customApiKey ? { "x-api-key": customApiKey } : {}) },
                        body: JSON.stringify({ title: editingTitle, description: "", keywords: editingKeywords, marketplace: targetMarketplace,
            tier: planType, language })
                      });
                      const data = await res.json().catch(() => ({}));
                      if (!res.ok) throw new Error(data.error || "Failed to generate long-tail keywords");
                      if (Array.isArray(data.keywords) && data.keywords.length > 0) {
                         const uniqueNew = data.keywords.filter((k: string) => !editingKeywords.includes(k));
                         setEditingKeywords([...editingKeywords, ...uniqueNew]);
                         showToast(`Added ${uniqueNew.length} long-tail keywords!`);
                      } else {
                         showToast("No new long-tail keywords suggested");
                      }
                    } catch (e: any) { showToast(e?.message || "Failed to generate long-tail keywords"); }
                  }} className="text-xs bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/40 px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Auto-Generate Long-tail SEO
                  </button>
                </div>
                <form onSubmit={handleAddKeyword} className="flex gap-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Add a new keyword..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!newKeyword.trim()}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white px-5 py-3 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-lg"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </motion.button>
                </form>
                {spamWarning && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-lg text-xs font-bold mt-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    {spamWarning}
                  </motion.div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-1.5 bg-slate-950">
                <AnimatePresence>
                  {editingKeywords.map((kw, index) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      key={kw} 
                      className="flex items-center justify-between bg-slate-900 border border-slate-800/80 rounded-xl p-3 group hover:border-slate-600 hover:bg-slate-800/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-500 w-6 text-right font-semibold">{index + 1}.</span>
                        <span className="text-sm font-semibold text-slate-200">{kw}</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => moveKwUp(index)}
                          disabled={index === 0}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 disabled:opacity-20 hover:bg-slate-800 rounded-md transition"
                          title="Move Up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveKwDown(index)}
                          disabled={index === editingKeywords.length - 1}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 disabled:opacity-20 hover:bg-slate-800 rounded-md transition"
                          title="Move Down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <div className="w-px h-5 bg-slate-700 mx-1"></div>
                        <button
                          onClick={() => removeKw(index)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-md transition"
                          title="Remove"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {editingKeywords.length === 0 && (
                  <div className="text-center text-sm font-medium text-slate-500 py-10">
                    No keywords found. Add some above.
                  </div>
                )}
              </div>

              <div className="p-5 border-t border-slate-800 bg-slate-900 flex justify-end gap-3">
                <button
                  onClick={() => setEditingItemId(null)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={saveKeywords}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-lg"
                >
                  <Check className="w-4 h-4" /> Save Changes
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-5 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-400" /> Settings
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-slate-400 hover:text-slate-200 transition bg-slate-800/50 hover:bg-slate-800 p-2 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Background Theme Section */}
                <div>
                  <label className="text-sm font-semibold text-slate-300 block mb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-slate-400" /> Custom Background Theme
                  </label>
                  
                  <div className="flex gap-2 items-center">
                    <label className="flex-1 bg-slate-950 border border-slate-700 hover:border-indigo-500 rounded-xl py-3 px-4 text-center cursor-pointer transition text-sm font-medium text-slate-300 hover:text-indigo-400">
                      <span>{customBgUrl ? 'Change Background' : 'Upload from Gallery'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleBgUpload}
                        className="hidden" 
                      />
                    </label>
                    {customBgUrl && (
                      <button
                        onClick={removeBg}
                        className="p-3 bg-slate-950 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl transition"
                        title="Remove custom background"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Set a personal wallpaper for the app background. Your image is saved locally in this browser.
                  </p>
                </div>

                <hr className="border-slate-800" />

                {/* API Key Section */}
                <div>
                  <label className="text-sm font-semibold text-slate-300 block mb-2 flex items-center gap-2">
                    <Key className="w-4 h-4 text-slate-400" /> Gemini API Key
                  </label>
                  <input
                    type="password"
                    value={customApiKey}
                    onChange={(e) => setCustomApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition font-mono text-sm"
                  />
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Enter your personal Gemini API key to avoid rate limits. It is saved locally in your browser and sent securely to generate metadata. <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Get a free key here</a>.
                  </p>
                </div>

                <hr className="border-slate-800" />

                {/* Keyword Blacklist & Exclusion Section */}
                <div>
                  <label className="text-sm font-semibold text-slate-300 block mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" /> Custom Banned / Excluded Keywords
                  </label>
                  <textarea
                    rows={2}
                    value={excludedKeywords}
                    onChange={(e) => setExcludedKeywords(e.target.value)}
                    placeholder="e.g., editorial, fake, adult, sample, banned-brand"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-sm resize-none"
                  />
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Comma-separated words you never want in your generated metadata (e.g. competitor brands, restricted terms).
                  </p>
                </div>
              </div>

              <div className="p-5 border-t border-slate-800 bg-slate-950/50 flex justify-end gap-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-slate-200 transition"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSaveApiKey(customApiKey, excludedKeywords)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-lg"
                >
                  <Save className="w-4 h-4" /> Save Settings
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden"
          >
            {/* DJ Lighting Background */}
            <div className="dj-lighting-bg"></div>
            
            {/* Dark overlay for contrast */}
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm pointer-events-none"></div>
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -50 }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
              className="relative bg-slate-900/90 border-2 border-indigo-500/50 p-10 md:p-16 rounded-3xl shadow-2xl text-center max-w-2xl w-full z-10"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="text-7xl md:text-8xl mb-6 inline-block"
              >
                🎉
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6 pb-2 leading-tight">
                Congratulations!
              </h2>
              <p className="text-xl md:text-2xl text-slate-200 font-medium">
                All metadata has been generated successfully!
              </p>
              <p className="text-slate-400 mt-4 max-w-md mx-auto text-sm">
                Your images are ready to conquer the marketplaces. Download the embedded files or export the CSV.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Sticky Floating Action Bar */}
      <AnimatePresence>
        {items.length > 0 && currentView === 'upload' && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 pointer-events-none"
          >
            <div className="pointer-events-auto bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 shadow-[0_10px_40px_rgba(0,0,0,0.4)] p-3 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 pl-2 flex-wrap">
                <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50">
                  <input
                    type="checkbox"
                    id="aiCheckFloating"
                    checked={isAiGenerated}
                    onChange={(e) => setIsAiGenerated(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900 bg-slate-700"
                  />
                  <label htmlFor="aiCheckFloating" className="text-sm font-medium text-slate-200 flex items-center gap-2 cursor-pointer">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">Generated via AI</span>
                    <span className="sm:hidden">AI</span>
                  </label>
                </div>

                {/* Instant Turbo Speed Mode Button */}
                <button
                  type="button"
                  onClick={() => {
                    const next = !isTurboMode;
                    setIsTurboMode(next);
                    localStorage.setItem('turbo_mode', String(next));
                    showToast(next ? "⚡ Turbo Speed Mode: ON (Instant parallel processing enabled)" : "🐢 Safe Mode: ON (Sequential processing)");
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    isTurboMode
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/20'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                  title={isTurboMode ? "Turbo Mode is active: Fast parallel metadata generation with optimized token payload" : "Click to enable Turbo Mode"}
                >
                  <Zap className={`w-3.5 h-3.5 ${isTurboMode ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-slate-500'}`} />
                  <span>Turbo Speed</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black uppercase ${isTurboMode ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-700 text-slate-400'}`}>
                    {isTurboMode ? '2x Fast' : 'Off'}
                  </span>
                </button>

                <span className="text-sm font-bold text-indigo-300 bg-indigo-900/30 px-3 py-1.5 rounded-lg border border-indigo-500/20">
                  {items.length} Files
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {showClearConfirm ? (
                  <div className="flex items-center gap-1">
                    <button onClick={clearAllItems} className="bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-xl transition flex items-center gap-1">
                      <Check className="w-4 h-4" /> Yes
                    </button>
                    <button onClick={() => setShowClearConfirm(false)} className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-xl transition">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setShowClearConfirm(true)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-sm font-bold px-4 py-2 rounded-xl transition flex items-center gap-2" title="Clear All">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                
                {items.filter(i => i.result).length > 0 && (
                  <button onClick={exportBatchZip} className="bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 text-sm font-bold px-4 py-2 rounded-xl transition flex items-center gap-2">
                    <Download className="w-4 h-4 text-white" /> <span className="hidden sm:inline">Embed to ZIP</span>
                  </button>
                )}
                
                {items.filter(i => i.result).length > 0 && (
                  <button onClick={() => setShowMultiCsvModal(true)} className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-sm font-bold px-4 py-2 rounded-xl transition flex items-center gap-2" title="Multi-Marketplace CSV & Rename">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> <span className="hidden sm:inline">Multi-CSV</span>
                  </button>
                )}

                {items.filter(i => i.result).length > 0 && (
                  <button onClick={exportBatchCSV} className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-sm font-bold px-4 py-2 rounded-xl transition flex items-center gap-2">
                    <FileDown className="w-4 h-4 text-emerald-400" /> <span className="hidden sm:inline">CSV</span>
                  </button>
                )}
                
                {/* Retry Failed button - ONLY shows when there are failed items */}
                {items.some(i => i.status === 'error') && (
                  <button
                    onClick={retryFailedItems}
                    disabled={isProcessing}
                    className="bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-sm font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-amber-500/25 animate-pulse cursor-pointer shrink-0"
                    title="Retry all failed files"
                  >
                    <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                    <span>Retry Failed ({items.filter(i => i.status === 'error').length})</span>
                  </button>
                )}

                <button
                  onClick={startBulkProcessing}
                  disabled={isProcessing || !items.some(i => i.status === 'pending' || i.status === 'error')}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-sm font-bold px-6 py-2 rounded-xl transition flex items-center gap-2 shadow-lg shadow-indigo-600/25 cursor-pointer"
                >
                  {isProcessing ? <RefreshCw className="animate-spin w-4 h-4" /> : <Layers className="w-4 h-4" />}
                  {isProcessing ? 'Processing...' : 'Generate AI'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pro Upgrade Modal */}
      <AnimatePresence>
        {showProModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative"
            >
              <button onClick={() => setShowProModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-amber-400 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-amber-500/20">
                  <Sparkles className="w-8 h-8 text-slate-950" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {isPro ? "Unlimited Pro Pass Active" : "Upgrade to Pro"}
                </h2>
                {isPro ? (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-sm text-amber-200">
                    <p className="font-semibold mb-1">🎉 You have 1-Month Free Unlimited Pro Access!</p>
                    <p className="text-xs text-slate-300">
                      You have <strong className="text-amber-400 font-bold">{proDaysLeft} days remaining</strong> of unlimited AI generation, Competitor Spy, Trends discovery, CSV bulk export & Dual-Agent Vision scanning.
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">You ran out of free credits. Upgrade your account or choose a subscription to continue analyzing your images.</p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 text-center hover:border-amber-500 transition cursor-pointer"
                     onClick={() => showToast("Stripe Integration Pending: Founder setup required for subscriptions.")}>
                  <h3 className="text-amber-400 font-bold mb-1">1-Year Pro (Best)</h3>
                  <div className="text-3xl font-black text-white mb-2">$80<span className="text-lg text-slate-400 font-normal">/yr</span></div>
                  <ul className="text-xs text-slate-400 text-left space-y-2 mb-4">
                    <li>✓ Unlimited AI Generations</li>
                    <li>✓ Unlimited Trend Searches</li>
                    <li>✓ Unlimited Pro Chat</li>
                  </ul>
                  <button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 rounded-xl transition text-sm">Subscribe</button>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 text-center hover:border-indigo-500 transition cursor-pointer"
                     onClick={() => showToast("Stripe Integration Pending: Founder setup required for subscriptions.")}>
                  <h3 className="text-indigo-400 font-bold mb-1">1-Month Pro</h3>
                  <div className="text-3xl font-black text-white mb-2">$10<span className="text-lg text-slate-400 font-normal">/mo</span></div>
                  <ul className="text-xs text-slate-400 text-left space-y-2 mb-4">
                    <li>✓ Unlimited AI Generations</li>
                    <li>✓ 1 Trend Search/Day</li>
                    <li>✓ Unlimited Pro Chat</li>
                    
                    
                  </ul>
                  <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl transition text-sm">Subscribe Now</button>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 text-center hover:border-emerald-500 transition cursor-pointer"
                     onClick={() => showToast("Stripe Integration Pending: Founder setup required for one-time payments.")}>
                  <h3 className="text-emerald-400 font-bold mb-1">3-Month Pro</h3>
                  <div className="text-3xl font-black text-white mb-2">$25<span className="text-lg text-slate-400 font-normal">/3mo</span></div>
                  <ul className="text-xs text-slate-400 text-left space-y-2 mb-4">
                    <li>✓ Unlimited AI Generations</li>
                    <li>✓ 3 Trend Searches/Day</li>
                    <li>✓ Unlimited Pro Chat</li>
                    
                    
                  </ul>
                  <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl transition text-sm">Subscribe</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Professional Contributor Studio Tools Suite Hub Modal */}
      <StudioToolsHubModal
        isOpen={showToolsHubModal}
        onClose={() => setShowToolsHubModal(false)}
        completedCount={items.filter((i) => i.result).length}
        onOpenTool={(toolKey) => {
          switch (toolKey) {
            case 'vector_studio':
              setShowVectorStudioModal(true);
              break;
            case 'reverse_prompt':
              setShowReversePromptModal(true);
              break;
            case 'trademark_shield':
              setShowTrademarkModal(true);
              break;
            case 'release_inspector':
              setShowReleaseModal(true);
              break;
            case 'rank_predictor':
              setShowRankModal(true);
              break;
            case 'tag_cleaner':
              setShowCleanerModal(true);
              break;
            case 'niche_radar':
              setShowNicheRadarModal(true);
              break;
            case 'search_simulator':
              setShowSimulatorModal(true);
              break;
            case 'multi_csv':
              setShowMultiCsvModal(true);
              break;
            case 'roi_calculator':
              setShowEarningsModal(true);
              break;
            case 'ftp_pipeline':
              setShowFtpModal(true);
              break;
            case 'masterclass':
              setShowGuideHubModal(true);
              break;
            case 'algorithm_booster': {
              const active = items.find((i) => i.result) || items[0] || null;
              if (active) {
                setAlgorithmActiveItem(active);
                setShowAlgorithmBoosterModal(true);
              } else {
                showToast('Upload or process an asset first to optimize Top 10 algorithm ranking!');
              }
              break;
            }
            case 'competitor_gap': {
              const active = items.find((i) => i.result) || items[0] || null;
              if (active) {
                setCompetitorActiveItem(active);
                setShowCompetitorGapModal(true);
              } else {
                showToast('Upload or process an asset first to inspect competitor keyword gaps!');
              }
              break;
            }
            case 'contributor_arcade':
              setShowArcadeModal(true);
              break;
          }
        }}
      />

      {/* Multi-Marketplace CSV & Rename Modal */}
      <MultiCsvExportModal
        isOpen={showMultiCsvModal}
        onClose={() => setShowMultiCsvModal(false)}
        items={items}
        showToast={showToast}
      />

      {/* Reverse Prompt Generator Modal */}
      <ReversePromptModal
        isOpen={showReversePromptModal}
        onClose={() => setShowReversePromptModal(false)}
        customApiKey={customApiKey}
        showToast={showToast}
      />

      {/* Microstock Earnings & ROI Calculator Modal */}
      <EarningsCalculatorModal
        isOpen={showEarningsModal}
        onClose={() => setShowEarningsModal(false)}
      />

      {/* Tag Cleaner & Spam Eliminator Modal */}
      <KeywordCleanerModal
        isOpen={showCleanerModal}
        onClose={() => setShowCleanerModal(false)}
        showToast={showToast}
      />

      {/* Stock Contributor Masterclass & SEO Knowledge Hub Modal */}
      <StockGuideHubModal
        isOpen={showGuideHubModal}
        onClose={() => setShowGuideHubModal(false)}
      />

      {/* Cloud & FTP Direct Submission Guide Modal */}
      <CloudFtpGuideModal
        isOpen={showFtpModal}
        onClose={() => setShowFtpModal(false)}
        showToast={showToast}
      />

      {/* Automated Trademark & IP Shield Modal */}
      <TrademarkShieldModal
        isOpen={showTrademarkModal}
        onClose={() => {
          setShowTrademarkModal(false);
          setTrademarkActiveItem(null);
        }}
        initialTitle={trademarkActiveItem?.title}
        initialKeywords={trademarkActiveItem?.keywords}
        showToast={showToast}
      />

      {/* Live Algorithmic Rank Predictor Modal */}
      <LiveRankPredictorModal
        isOpen={showRankModal}
        onClose={() => {
          setShowRankModal(false);
          setRankActiveItem(null);
        }}
        initialTitle={rankActiveItem?.title}
        initialKeywords={rankActiveItem?.keywords}
        marketplace={targetMarketplace}
        showToast={showToast}
      />

      {/* Real-Time Niche Opportunity Radar Modal */}
      <NicheRadarModal
        isOpen={showNicheRadarModal}
        onClose={() => setShowNicheRadarModal(false)}
        onSelectNiche={(concept, keywords) => {
          setPromptStudioPreloadConcept(concept);
          setCurrentView('prompts');
        }}
        showToast={showToast}
      />

      {/* Model & Property Release AI Inspector Modal */}
      <ReleaseInspectorModal
        isOpen={showReleaseModal}
        onClose={() => setShowReleaseModal(false)}
        showToast={showToast}
      />

      {/* Dual Agency Search Engine Simulator Modal */}
      <SearchSimulatorModal
        isOpen={showSimulatorModal}
        onClose={() => {
          setShowSimulatorModal(false);
          setSimulatorActiveItem(null);
        }}
        sampleItem={simulatorActiveItem}
        showToast={showToast}
      />

      {/* Vector EPS & AI Metadata Studio Modal */}
      <VectorMetadataStudioModal
        isOpen={showVectorStudioModal}
        onClose={() => setShowVectorStudioModal(false)}
        onToast={showToast}
        customApiKey={customApiKey}
        isPro={isPro}
      />

      {/* Live Marketplace Buyer Mockup Modal */}
      <MarketplaceMockupModal
        isOpen={Boolean(mockupItem)}
        onClose={() => setMockupItem(null)}
        item={mockupItem}
        showToast={showToast}
      />

      {/* Marketplace Algorithm Rank Booster (Top 10 Priority) Modal */}
      <AlgorithmRankBoosterModal
        item={algorithmActiveItem}
        isOpen={showAlgorithmBoosterModal}
        onClose={() => {
          setShowAlgorithmBoosterModal(false);
          setAlgorithmActiveItem(null);
        }}
        onSave={handleSaveAlgorithmKeywords}
        showToast={showToast}
      />

      {/* Competitor Keyword Gap Inspector Modal */}
      <CompetitorTagGapModal
        item={competitorActiveItem}
        isOpen={showCompetitorGapModal}
        onClose={() => {
          setShowCompetitorGapModal(false);
          setCompetitorActiveItem(null);
        }}
        onAddKeywords={handleAddCompetitorKeywords}
        showToast={showToast}
      />

      {/* Keyboard Shortcuts Reference Modal */}
      <KeyboardShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />

      {/* Interactive Contributor Guide Tour Modal */}
      <InteractiveTourModal
        isOpen={showTourModal}
        onClose={() => setShowTourModal(false)}
        currentStep={tourStep}
        onNext={() => setTourStep((prev) => Math.min(prev + 1, 4))}
        onPrev={() => setTourStep((prev) => Math.max(prev - 1, 0))}
      />

      {/* Contributor Mini-Games Arcade Modal */}
      <ContributorArcadeModal
        isOpen={showArcadeModal}
        onClose={() => setShowArcadeModal(false)}
        isProcessing={isProcessing}
        completedCount={items.filter(i => i.result).length}
        totalCount={items.length}
        showToast={showToast}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 sm:bottom-10 right-4 sm:right-10 z-[100] bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold shadow-[0_10px_30px_rgba(16,185,129,0.3)] flex items-center gap-3 border border-emerald-400"
          >
            <Check className="w-5 h-5" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
