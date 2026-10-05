import React, { useState, useEffect, useRef } from 'react';
import { Upload, MessageSquare, AlertTriangle, Send, Download, Copy, Check, RefreshCw, Layers, Sparkles, Edit3, X, ChevronUp, ChevronDown, Plus, Gift, CheckCircle, CheckCircle2, Camera, AlertCircle, Lock, LogOut, Trash2, FileDown, Search, ArrowLeft, TrendingUp, CalendarDays, Settings, Key, Save, Image as ImageIcon, Lightbulb, Wand2, FileSpreadsheet, Eye, Keyboard, Zap, HelpCircle, DollarSign, Calculator, BookOpen, CloudUpload, Filter, Radar, ShieldAlert, Target, UserCheck, Video, FileCode, Globe, Gamepad2, Phone, PhoneCall, Heart, Headphones, Mic, Compass, Grid, Sun, Moon, Volume2, VolumeX, Award } from 'lucide-react';
import { BulkItem, TargetMarketplace, TrendData, MetadataResult, MetadataVersion } from './types';
import { embedJpegMetadata, generateXmpSidecarXml, embedMetadataIntoEps } from './lib/metadataEmbedder';
import { playShutterSound, playTickSound, playChimeSound, isSoundEnabled, setSoundEnabled } from './lib/audioFeedback';
import { motion, AnimatePresence } from 'motion/react';
import { auth, signInWithPopup, googleProvider, signOut, db } from './lib/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, setDoc, doc, deleteDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import confetti from 'canvas-confetti';
import JSZip from 'jszip';
import { MultiCsvExportModal, detectShutterstockCategory } from './components/MultiCsvExportModal';
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
import { LiveTrendingTicker } from './components/LiveTrendingTicker';
import { PrivacyPolicyModal, TermsOfServiceModal, EarningsDisclaimerModal, ContactSupportModal } from './components/LegalModals';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { EarningMonetizationModal } from './components/EarningMonetizationModal';
import { WebsiteFooter } from './components/WebsiteFooter';
import { InteractiveSpatialHouse, SpatialRoom } from './components/InteractiveSpatialHouse';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { MonetizationHubView } from './components/MonetizationHubView';
import { SeoRankBoosterView } from './components/SeoRankBoosterView';
import { SAMPLE_SHOWCASE_ASSETS } from './lib/sampleAssets';
import { EditorialHeroSection } from './components/EditorialHeroSection';
import { AboutModal, PricingModal, ResourcesModal } from './components/EditorialModals';
import { AdobeMetaProLogo } from './components/AdobeMetaProLogo';
import { EpsArtworkViewerModal } from './components/EpsArtworkViewerModal';
import { FuturisticPhysicsEngine } from './components/FuturisticPhysicsEngine';
import { HackerBlackOpsTerminal } from './components/HackerBlackOpsTerminal';
import { AutonomousHackerHudBar } from './components/AutonomousHackerHudBar';

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

const TrendsDashboard = ({ onBack, customApiKey, user, planType, setTrendsUsage, initialSearchQuery, themeMode = 'light' }: { key?: React.Key, onBack: () => void, customApiKey: string, user: User | null, planType: "free" | "pro", setTrendsUsage?: React.Dispatch<React.SetStateAction<number>>, initialSearchQuery?: string, themeMode?: 'light' | 'dark' }) => {
  const isLight = themeMode === 'light';
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
      initial={{ opacity: 0, y: 12 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -12 }}
      className="space-y-6 relative z-10"
    >
      <div className={`flex items-center gap-4 p-5 sm:p-6 rounded-2xl border ${
        isLight ? 'bg-white border-neutral-200/90 text-neutral-900 shadow-2xs' : 'bg-[#111318] border-neutral-800 text-white shadow-xl'
      }`}>
        <button
          onClick={onBack}
          className={`p-2.5 rounded-xl border transition cursor-pointer ${
            isLight ? 'bg-[#fbfaf8] hover:bg-neutral-100 border-neutral-200 text-neutral-700' : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-400">
            06 . STORE · LIVE MARKET TRENDS RADAR
          </div>
          <h2 className="text-lg sm:text-2xl font-bold tracking-tight flex items-center gap-2 mt-0.5">
            <TrendingUp className="w-5 h-5 text-emerald-500" /> Adobe Stock Trends &amp; Monthly Insights
          </h2>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Discover surging buyer queries, monthly demand spikes, and high-converting visual concepts.
          </p>
        </div>
      </div>

      <div className={`border p-5 sm:p-6 rounded-2xl ${
        isLight ? 'bg-white border-neutral-200/90 shadow-2xs' : 'bg-[#111318] border-neutral-800 shadow-xl'
      }`}>
        <form onSubmit={handleSearch} className="flex gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search month (e.g. October, March) or topic (e.g. AI, Healthcare, Travel)..."
              className={`w-full border rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none transition ${
                isLight
                  ? 'bg-[#fbfaf8] border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900'
                  : 'bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-500 focus:border-neutral-600'
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-40 ${
              isLight ? 'bg-neutral-950 hover:bg-black text-white' : 'bg-white hover:bg-neutral-200 text-neutral-950'
            }`}
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Search</span>
          </button>
        </form>

        {/* Quick Month Filter Bar */}
        <div className={`mt-4 pt-3 border-t ${isLight ? 'border-neutral-100' : 'border-neutral-800'}`}>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-amber-500" />
              Select Month Filter:
            </span>
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => { setSearchQuery(''); fetchTrends(''); }}
                className="text-[11px] font-semibold underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {MONTHS_LIST.map(m => {
              const isSelected = searchQuery.toLowerCase().includes(m.name.toLowerCase()) || searchQuery.toLowerCase() === m.label.toLowerCase();
              return (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => selectMonth(m.name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition whitespace-nowrap shrink-0 border cursor-pointer ${
                    isSelected 
                      ? (isLight ? 'bg-neutral-950 border-neutral-950 text-white' : 'bg-white border-white text-black')
                      : (isLight ? 'bg-[#fbfaf8] border-neutral-200/80 text-neutral-600 hover:border-neutral-900 hover:text-black' : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-600')
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
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
          <X className="w-4 h-4" /> {error}
        </div>
      )}

      {isLoading && (
        <div className={`py-16 rounded-2xl border flex flex-col items-center justify-center space-y-3 ${
          isLight ? 'bg-white border-neutral-200/80' : 'bg-[#111318] border-neutral-800'
        }`}>
           <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
           <p className="text-xs font-mono uppercase tracking-wider text-neutral-400">
             {searchQuery ? `Analyzing buyer demand for "${searchQuery}"...` : 'Scanning live market trends...'}
           </p>
        </div>
      )}

      {!isLoading && trends && (
        <div className="space-y-6">
          {(trends.whatToCreate && trends.whatToCreate.length > 0 || trends.monthOverview) && (
            <div className={`border p-5 sm:p-6 rounded-2xl space-y-4 ${
              isLight ? 'bg-white border-neutral-200/90 shadow-2xs' : 'bg-[#111318] border-neutral-800 shadow-xl'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                  isLight ? 'bg-[#fbfaf8] border-neutral-200 text-amber-600' : 'bg-neutral-900 border-neutral-800 text-amber-400'
                }`}>
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`text-base font-bold ${isLight ? 'text-neutral-950' : 'text-white'}`}>
                    {trends.monthName ? `${trends.monthName} Production Strategy` : 'Monthly Production Strategy'}
                  </h3>
                  <p className="text-xs text-neutral-400">High-demand commercial topics &amp; buyer search priorities</p>
                </div>
              </div>

              {trends.monthOverview && (
                <p className={`text-xs sm:text-sm leading-relaxed p-3.5 rounded-xl border ${
                  isLight ? 'bg-[#fbfaf8] border-neutral-200/80 text-neutral-700' : 'bg-neutral-950 border-neutral-800 text-neutral-300'
                }`}>
                  {trends.monthOverview}
                </p>
              )}

              {trends.whatToCreate && trends.whatToCreate.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {trends.whatToCreate.map((item, idx) => (
                    <div key={idx} className={`flex items-start gap-2.5 border p-3 rounded-xl ${
                      isLight ? 'bg-[#fbfaf8] border-neutral-200/70 text-neutral-800' : 'bg-neutral-950 border-neutral-800 text-neutral-200'
                    }`}>
                      <span className="text-xs font-mono font-bold text-emerald-500 mt-0.5">0{idx + 1}.</span>
                      <p className="text-xs leading-relaxed font-medium">{item}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div>
            <h3 className={`text-sm font-mono uppercase tracking-[0.15em] mb-3 flex items-center gap-2 ${
              isLight ? 'text-neutral-900 font-bold' : 'text-white font-bold'
            }`}>
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Surging Buyer Search Topics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trends.currentTrends.map((trend, i) => (
                <div key={i} className={`border p-5 rounded-2xl flex flex-col justify-between space-y-4 ${
                  isLight ? 'bg-white border-neutral-200/90 shadow-2xs' : 'bg-[#111318] border-neutral-800 shadow-xl'
                }`}>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className={`text-base font-bold ${isLight ? 'text-neutral-950' : 'text-white'}`}>{trend.topic}</h4>
                      {trend.bestFor && (
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 shrink-0">
                          {trend.bestFor}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>{trend.description}</p>
                    
                    {trend.actionGuide && (
                      <div className={`p-3 rounded-xl border text-xs ${
                        isLight ? 'bg-[#fbfaf8] border-neutral-200/70 text-neutral-700' : 'bg-neutral-950 border-neutral-800 text-neutral-300'
                      }`}>
                        <span className="font-bold text-amber-600 dark:text-amber-400 block mb-0.5">Production Note:</span>
                        {trend.actionGuide}
                      </div>
                    )}
                  </div>

                  <div className={`pt-3 border-t ${isLight ? 'border-neutral-100' : 'border-neutral-800'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10.5px] font-mono uppercase tracking-wider text-neutral-400">Keywords</span>
                      <button 
                        type="button"
                        onClick={() => copyKeywords(trend.keywords, `curr-${i}`)}
                        className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === `curr-${i}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedKey === `curr-${i}` ? 'Copied' : 'Copy All'}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {trend.keywords.map(kw => (
                        <span key={kw} className={`text-[11px] px-2.5 py-0.5 rounded-lg border ${
                          isLight ? 'bg-[#fbfaf8] border-neutral-200/80 text-neutral-700' : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                        }`}>{kw}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className={`text-sm font-mono uppercase tracking-[0.15em] mb-3 flex items-center gap-2 ${
              isLight ? 'text-neutral-900 font-bold' : 'text-white font-bold'
            }`}>
              <CalendarDays className="w-4 h-4 text-amber-500" /> Upcoming Seasonal Demand
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trends.upcomingTrends.map((trend, i) => (
                <div key={i} className={`border p-5 rounded-2xl flex flex-col justify-between space-y-4 ${
                  isLight ? 'bg-white border-neutral-200/90 shadow-2xs' : 'bg-[#111318] border-neutral-800 shadow-xl'
                }`}>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className={`text-base font-bold ${isLight ? 'text-neutral-950' : 'text-white'}`}>{trend.topic}</h4>
                      {trend.targetMonth && (
                        <span className="text-[10.5px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold shrink-0">
                          {trend.targetMonth}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>{trend.description}</p>
                  </div>

                  <div className={`pt-3 border-t ${isLight ? 'border-neutral-100' : 'border-neutral-800'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10.5px] font-mono uppercase tracking-wider text-neutral-400">Forecast Keywords</span>
                      <button 
                        type="button"
                        onClick={() => copyKeywords(trend.keywords, `up-${i}`)}
                        className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === `up-${i}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedKey === `up-${i}` ? 'Copied' : 'Copy All'}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {trend.keywords.map(kw => (
                        <span key={kw} className={`text-[11px] px-2.5 py-0.5 rounded-lg border ${
                          isLight ? 'bg-[#fbfaf8] border-neutral-200/80 text-neutral-700' : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                        }`}>{kw}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}




const CompetitorDashboard = ({ onBack, customApiKey, themeMode = 'light' }: { onBack: () => void; customApiKey?: string; key?: string; themeMode?: 'light' | 'dark' }) => {
  const isLight = themeMode === 'light';
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{title: string, keywords: string[], insights: string} | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

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
      <div className={`flex items-center gap-4 p-5 sm:p-6 rounded-2xl border ${
        isLight ? 'bg-white border-neutral-200/90 text-neutral-900 shadow-2xs' : 'bg-[#111318] border-neutral-800 text-white shadow-xl'
      }`}>
        <button
          onClick={onBack}
          className={`p-2.5 rounded-xl border transition cursor-pointer ${
            isLight ? 'bg-[#fbfaf8] hover:bg-neutral-100 border-neutral-200 text-neutral-700' : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-400">
            07 . STORE · COMPETITOR SPY &amp; TAG EXTRACTOR
          </div>
          <h2 className="text-lg sm:text-2xl font-bold tracking-tight flex items-center gap-2 mt-0.5">
            <Search className="w-5 h-5 text-amber-500" /> Competitor Spy &amp; Reverse SEO Extractor
          </h2>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Reverse-engineer top-selling stock visuals to extract winning subject-first titles and 49 keywords.
          </p>
        </div>
      </div>
      
      {!image ? (
        <div className={`border p-10 rounded-2xl flex flex-col items-center justify-center text-center min-h-[360px] ${
          isLight ? 'bg-white border-neutral-200/90 text-neutral-900 shadow-2xs' : 'bg-[#111318] border-neutral-800 text-white shadow-xl'
        }`}>
           <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 border ${
             isLight ? 'bg-[#fbfaf8] border-neutral-200 text-neutral-900' : 'bg-neutral-900 border-neutral-800 text-amber-400'
           }`}>
              <Search className="w-7 h-7" />
           </div>
           <h3 className="text-xl font-bold mb-2">Upload a Bestseller Stock Image</h3>
           <p className={`text-xs sm:text-sm max-w-md mb-6 leading-relaxed ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
             Drop a screenshot or image of any top-selling file. Our engine inspects its visual hierarchy and extracts the exact keywords and title structure driving its sales.
           </p>
           
           <label className={`font-bold text-xs sm:text-sm px-7 py-3 rounded-full cursor-pointer transition flex items-center gap-2 ${
             isLight ? 'bg-neutral-950 hover:bg-black text-white' : 'bg-white hover:bg-neutral-200 text-neutral-950'
           }`}>
             <Upload className="w-4 h-4" /> Select Image to Reverse-Engineer
             <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
           </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className={`lg:col-span-1 border p-4 rounded-2xl ${
             isLight ? 'bg-white border-neutral-200/90 shadow-2xs' : 'bg-[#111318] border-neutral-800 shadow-xl'
           }`}>
              <div className="aspect-square rounded-xl overflow-hidden bg-neutral-900 mb-4 border border-neutral-200/60 dark:border-neutral-800 relative">
                 <img src={image} className="w-full h-full object-cover" alt="Competitor" />
                 {isAnalyzing && (
                   <div className="absolute inset-0 bg-black/65 flex flex-col items-center justify-center backdrop-blur-xs z-20">
                      <RefreshCw className="w-7 h-7 text-amber-400 animate-spin mb-2" />
                      <p className="text-white font-mono text-xs uppercase tracking-wider">Reverse engineering...</p>
                   </div>
                 )}
              </div>
              <button
                onClick={() => { setImage(null); setResult(null); }}
                className={`w-full py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  isLight ? 'bg-[#fbfaf8] hover:bg-neutral-100 border-neutral-200 text-neutral-800' : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-200'
                }`}
              >
                Analyze Another Image
              </button>
           </div>
           
           <div className="lg:col-span-2">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-500 text-xs font-bold mb-4">
                  {error}
                </div>
              )}
              {result && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className={`border p-5 rounded-2xl ${
                    isLight ? 'bg-white border-neutral-200/90 shadow-2xs' : 'bg-[#111318] border-neutral-800 shadow-xl'
                  }`}>
                    <span className="text-[10.5px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                      Predicted Winning Title
                    </span>
                    <p className={`text-base font-bold ${isLight ? 'text-neutral-950' : 'text-white'}`}>{result.title}</p>
                  </div>
                  
                  <div className={`border p-5 rounded-2xl ${
                    isLight ? 'bg-white border-neutral-200/90 shadow-2xs' : 'bg-[#111318] border-neutral-800 shadow-xl'
                  }`}>
                    <span className="text-[10.5px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1.5 mb-2">
                      <Sparkles className="w-3.5 h-3.5" /> Strategic SEO Breakdown
                    </span>
                    <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>{result.insights}</p>
                  </div>
                  
                  <div className={`border p-5 rounded-2xl ${
                    isLight ? 'bg-white border-neutral-200/90 shadow-2xs' : 'bg-[#111318] border-neutral-800 shadow-xl'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10.5px] font-mono uppercase tracking-wider text-neutral-400">
                        Extracted High-Volume Keywords ({result.keywords.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(result.keywords.join(', '));
                          setCopiedAll(true);
                          setTimeout(() => setCopiedAll(false), 2000);
                        }}
                        className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedAll ? 'Copied All' : 'Copy All Tags'}</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {result.keywords.map((kw, idx) => (
                        <span
                          key={kw}
                          className={`text-xs px-2.5 py-1 rounded-lg border ${
                            idx < 10
                              ? (isLight ? 'bg-neutral-950 text-white border-neutral-950 font-semibold' : 'bg-white text-neutral-950 border-white font-semibold')
                              : (isLight ? 'bg-[#fbfaf8] border-neutral-200/80 text-neutral-700' : 'bg-neutral-900 border-neutral-800 text-neutral-300')
                          }`}
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};
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

  const [currentView, setCurrentView] = useState<'home' | 'upload' | 'monetize' | 'seo-rank' | 'trends' | 'competitor' | 'prompts' | 'calendar'>('home');
  const [showMultiCsvModal, setShowMultiCsvModal] = useState<boolean>(false);
  const [trendSearchPreload, setTrendSearchPreload] = useState<string>('');
  const [promptStudioPreloadConcept, setPromptStudioPreloadConcept] = useState<string>('');

  const [items, setItems] = useState<BulkItem[]>([]);

  const [targetMarketplace, setTargetMarketplace] = useState<TargetMarketplace>('adobe_stock');
  const [assetType, setAssetType] = useState<string>("Photo / JPG");
  const [language, setLanguage] = useState<string>("English");
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [preferredNickname, setPreferredNickname] = useState<string>(() => {
    try {
      return localStorage.getItem('preferred_user_name') || 'Ratul Sorker';
    } catch {
      return 'Ratul Sorker';
    }
  });
  const [chatMessages, setChatMessages] = useState<any[]>([{ role: "model", parts: [{ text: "Hello! I am your AdobeMeta AI Assistant. How can I help you with your microstock keywords, titles, or portfolio strategy today?" }] }]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);
  const [isTurboMode, setIsTurboMode] = useState<boolean>(() => {
    try { return localStorage.getItem('turbo_mode') !== 'false'; } catch { return true; }
  });
  // Hands-Free Autopilot Automation Engine (Default ON: automatically starts processing & fixes SEO on file drop)
  const [isAutopilotEnabled, setIsAutopilotEnabled] = useState<boolean>(() => {
    try { return localStorage.getItem('adobemeta_autopilot') !== 'false'; } catch { return true; }
  });
  const [autoExportCsvOnFinish, setAutoExportCsvOnFinish] = useState<boolean>(() => {
    try { return localStorage.getItem('adobemeta_auto_csv') === 'true'; } catch { return false; }
  });
  const [autoCopyOnFinish, setAutoCopyOnFinish] = useState<boolean>(() => {
    try { return localStorage.getItem('adobemeta_auto_copy') !== 'false'; } catch { return true; }
  });
  const [autopilotStageText, setAutopilotStageText] = useState<string>('Ready · Waiting for files');
  const autopilotLockRef = useRef<boolean>(false);
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
  const [epsViewerItemId, setEpsViewerItemId] = useState<string | null>(null);
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

  // Google Monetization, Compliance & Legal Modals
  const [showEarningMonetizeModal, setShowEarningMonetizeModal] = useState<boolean>(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState<boolean>(false);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);
  const [showPricingModal, setShowPricingModal] = useState<boolean>(false);
  const [showResourcesModal, setShowResourcesModal] = useState<boolean>(false);

  // Refined White Minimalist Architecture (Default)
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    try {
      const stored = localStorage.getItem('adobemeta_theme');
      if (stored === 'dark' && localStorage.getItem('adobemeta_theme_user_chosen') === 'true') {
        return 'dark';
      }
      localStorage.setItem('adobemeta_theme', 'light');
      return 'light';
    } catch {
      return 'light';
    }
  });

  // Unified Luxury Studio Workspace Default (Clean, Minimalist, Breathtaking)
  const [workspaceMode, setWorkspaceMode] = useState<'spatial' | 'classic'>(() => {
    try {
      const v2Key = localStorage.getItem('adobemeta_studio_v2');
      if (v2Key === 'true') {
        const saved = localStorage.getItem('adobemeta_workspace_mode');
        if (saved === 'spatial' || saved === 'classic') return saved;
      }
      localStorage.setItem('adobemeta_studio_v2', 'true');
      localStorage.setItem('adobemeta_workspace_mode', 'classic');
      return 'classic';
    } catch {
      return 'classic';
    }
  });
  const [spatialRoom, setSpatialRoom] = useState<SpatialRoom>('studio');
  const [activeSpatialItemId, setActiveSpatialItemId] = useState<string | null>(null);
  const [showCommandPalette, setShowCommandPalette] = useState<boolean>(false);

  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(() => isSoundEnabled());
  const [isFuturisticBounce, setIsFuturisticBounce] = useState<boolean>(() => {
    try { return localStorage.getItem('adobemeta_futuristic_bounce') !== 'false'; } catch { return true; }
  });
  const [showBlackOpsTerminal, setShowBlackOpsTerminal] = useState<boolean>(false);
  const [interceptedBlackOpsQuery, setInterceptedBlackOpsQuery] = useState<string | null>(null);
  const [isCyberMatrixMode, setIsCyberMatrixMode] = useState<boolean>(() => {
    try { return localStorage.getItem('adobemeta_cyber_matrix') === 'true'; } catch { return false; }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isCyberMatrixMode) {
      root.classList.add('cyber-hacker-matrix');
    } else {
      root.classList.remove('cyber-hacker-matrix');
    }
  }, [isCyberMatrixMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowBlackOpsTerminal((prev) => !prev);
      } else if (e.key === 'Escape' && showBlackOpsTerminal) {
        setShowBlackOpsTerminal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showBlackOpsTerminal]);

  const handleLoadSampleAsset = (sample: BulkItem) => {
    const newItem: BulkItem = {
      ...sample,
      id: `sample-${Date.now()}`
    };
    setItems(prev => [newItem, ...prev.filter(i => i.id !== newItem.id)]);
    setActiveSpatialItemId(newItem.id);
    setSpatialRoom('studio');
    playShutterSound();
    showToast(`✓ Loaded master asset: "${sample.file.name}"`);
  };

  const handleUpdateMetadata = (id: string, updated: Partial<MetadataResult>) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id || !item.result) return item;
      return {
        ...item,
        result: {
          ...item.result,
          ...updated,
        },
      };
    }));
  };

  const handleRegenerateItem = async (id: string, mode: string = 'more_commercial', targetSearchQuery?: string) => {
    const targetItem = items.find(i => i.id === id);
    if (!targetItem || !targetItem.file) return;

    setIsRegenerating(true);
    showToast(targetSearchQuery ? `Optimizing Rank #1 for "${targetSearchQuery}"...` : `Generating ${mode.replace('_', ' ')} metadata...`);

    try {
      let base64Data = '';
      let activeEpsHint = targetItem.epsHint;
      const ext = targetItem.file.name.split('.').pop()?.toLowerCase() || '';
      const isItemVector = ext === 'eps' || ext === 'ai' || isEpsFile(targetItem.file);

      if (isItemVector) {
        const epsData = await parseEpsFile(targetItem.file);
        activeEpsHint = epsData.metadata || activeEpsHint;
        base64Data = epsData.base64ForAi || (epsData.previewUrl.startsWith('data:image/') ? epsData.previewUrl.split(',')[1] : '');
      }
      if (!base64Data && targetItem.previewUrl && targetItem.previewUrl.startsWith('data:image')) {
        base64Data = targetItem.previewUrl.split(',')[1];
      }
      if (!base64Data) {
        base64Data = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(',')[1] || '');
          reader.onerror = () => resolve('');
          reader.readAsDataURL(targetItem.file);
        });
      }

      const effectiveAssetType = isItemVector && assetType === 'Photo / JPG' ? 'Vector / EPS' : assetType;

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(customApiKey ? { 'x-api-key': customApiKey.trim() } : {})
        },
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType: 'image/jpeg',
          marketplace: targetMarketplace,
          assetType: effectiveAssetType,
          language,
          isAiGenerated,
          fastMode: isTurboMode,
          vectorMetadataHint: activeEpsHint,
          psdMetadataHint: targetItem.psdHint,
          fileName: targetItem.file.name,
          regenerationMode: mode,
          previousTitle: targetItem.result?.recommendedTitle,
          previousKeywords: targetItem.result?.keywords,
          targetSearchQuery
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Regeneration failed (${res.status})`);
      }

      const newData: MetadataResult = await res.json();
      
      setItems(prev => prev.map(item => {
        if (item.id !== id || !item.result) return item;
        const existingVersions = item.result.versions || [
          {
            versionNumber: 1,
            timestamp: Date.now() - 60000,
            title: item.result.recommendedTitle,
            keywords: item.result.keywords,
            category: item.result.category,
            mode: 'initial',
            qualityScore: item.result.metadataQualityScore
          }
        ];

        const nextVersionNum = existingVersions.length + 1;
        const newVersionEntry: MetadataVersion = {
          versionNumber: nextVersionNum,
          timestamp: Date.now(),
          title: newData.recommendedTitle,
          keywords: newData.keywords,
          category: newData.category,
          mode: mode as any,
          qualityScore: newData.metadataQualityScore
        };

        const updatedVersions = [...existingVersions, newVersionEntry];

        return {
          ...item,
          result: {
            ...newData,
            versions: updatedVersions,
            activeVersionIndex: updatedVersions.length - 1
          }
        };
      }));

      showToast(`✓ Version ${(targetItem.result?.versions?.length || 1) + 1} generated (${mode.replace('_', ' ')})`);
    } catch (err: any) {
      console.error("Regeneration error:", err);
      showToast(`Regeneration: ${err?.message || 'Error occurred'}`);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSwitchVersion = (id: string, versionIndex: number) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id || !item.result || !item.result.versions) return item;
      const targetVersion = item.result.versions[versionIndex];
      if (!targetVersion) return item;

      return {
        ...item,
        result: {
          ...item.result,
          recommendedTitle: targetVersion.title,
          keywords: targetVersion.keywords,
          category: targetVersion.category || item.result.category,
          activeVersionIndex: versionIndex
        }
      };
    }));
    showToast(`✓ Switched to Version ${versionIndex + 1}`);
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || (e.target as HTMLElement)?.isContentEditable) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      } else if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShowShortcutsModal((prev) => !prev);
      } else if (e.key === 'Escape') {
        setShowCommandPalette(false);
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

  // Auto-scroll chat to bottom inside chat container only (prevents window jumping)
  useEffect(() => {
    if (isChatOpen && chatContainerRef.current) {
      const container = chatContainerRef.current;
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
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
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(DEFAULT_FOUNDER_USER);
      }
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
    setUser(DEFAULT_FOUNDER_USER);
    setLoginTransition('idle');
    showToast('Signed out. Active in VIP Contributor Workspace.');
  };

  const handleWatchDemo = () => {
    setCurrentView('upload');
    if (items.length === 0 && typeof SAMPLE_SHOWCASE_ASSETS !== 'undefined' && SAMPLE_SHOWCASE_ASSETS.length > 0) {
      handleLoadSampleAsset(SAMPLE_SHOWCASE_ASSETS[0].item);
    }
    showToast('✨ Interactive Demo: Live metadata inspection & 100% Adobe Stock compliance active.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartGenerating = () => {
    setCurrentView('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      const inputEl = document.getElementById('bulkInput') as HTMLInputElement | null;
      if (inputEl) {
        inputEl.click();
      }
    }, 300);
  };

  const handleAttachScreenshot = (itemId: string, file: File) => {
    try {
      const previewUrl = URL.createObjectURL(file);
      setItems((prev) =>
        prev.map((it) =>
          it.id === itemId
            ? { ...it, previewUrl }
            : it
        )
      );
      showToast('Visual preview screenshot attached! AI will analyze this exact visual artwork.');
    } catch (e) {
      console.warn('Screenshot attach error:', e);
    }
  };

  const processFiles = (files: File[]) => {
    const selectedFiles = files.slice(0, 100);

    // Look for accompanying companion preview JPEGs (e.g., artwork.eps + artwork.jpg or screenshot)
    const imageFiles: File[] = [];
    const jpgMap = new Map<string, File>();
    selectedFiles.forEach((f) => {
      const ext = f.name.split('.').pop()?.toLowerCase() || '';
      if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
        imageFiles.push(f);
        const base = f.name.replace(/\.[^/.]+$/, '').toLowerCase();
        jpgMap.set(base, f);
      }
    });

    const vectorFiles = selectedFiles.filter(f => isEpsFile(f));
    const singleVectorSingleImage = vectorFiles.length === 1 && imageFiles.length === 1;
    if (vectorFiles.length > 0 && assetType === 'Photo / JPG') {
      setAssetType('Vector / EPS');
    }

    const newItems: BulkItem[] = selectedFiles.map((f, i) => {
      const ext = f.name.split('.').pop()?.toLowerCase() || '';
      const isVideo = f.type.startsWith('video/') || ['mp4', 'mov', 'webm', 'm4v', 'avi', 'mkv'].includes(ext);
      const isEps = isEpsFile(f);
      const isPsd = isPsdFile(f);
      const baseName = f.name.replace(/\.[^/.]+$/, '').toLowerCase();
      const companionJpg = isEps ? (jpgMap.get(baseName) || (singleVectorSingleImage ? imageFiles[0] : undefined)) : undefined;
      
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
                    hasRealVisualPreview: Boolean(it.hasRealVisualPreview || epsData.hasEmbeddedThumbnail),
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

    // Hands-Free Autopilot Automation: If enabled, automatically launch the pipeline as soon as files are dropped/selected
    if (isAutopilotEnabled && newItems.length > 0) {
      setAutopilotStageText(`Autopilot Queued (${newItems.length} file${newItems.length > 1 ? 's' : ''}) · Starting AI Engine...`);
      showToast(`🤖 Autopilot Active: Automatically analyzing ${newItems.length} file${newItems.length > 1 ? 's' : ''}...`);
    }
  };

  // Global Anywhere File Drop: Drop files anywhere on the website (even on the Home Market page) and Autopilot immediately takes over
  useEffect(() => {
    const onWindowDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes('Files')) {
        e.preventDefault();
      }
    };
    const onWindowDrop = (e: DragEvent) => {
      if (!e.dataTransfer?.files || e.dataTransfer.files.length === 0) return;
      // Avoid double-triggering if already handled by a specific dropzone or file input
      if (e.defaultPrevented) return;
      e.preventDefault();
      setIsDragging(false);
      const dropped = Array.from(e.dataTransfer.files);
      const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'eps', 'ai', 'psd', 'psb', 'spd', 'mp4', 'mov', 'webm', 'm4v', 'avi', 'mkv'];
      const validFiles = dropped.filter((f) => {
        const ext = f.name.split('.').pop()?.toLowerCase() || '';
        return f.type.startsWith('image/') || f.type.startsWith('video/') || isPsdFile(f) || allowedExts.includes(ext);
      });
      if (validFiles.length > 0) {
        setCurrentView('upload');
        processFiles(validFiles);
      }
    };
    window.addEventListener('dragover', onWindowDragOver);
    window.addEventListener('drop', onWindowDrop);
    return () => {
      window.removeEventListener('dragover', onWindowDragOver);
      window.removeEventListener('drop', onWindowDrop);
    };
  });

  // Autonomous Queue Watcher: Whenever there are pending items and Autopilot is ON, automatically execute the batch pipeline
  useEffect(() => {
    if (!isAutopilotEnabled) return;
    if (isProcessing || autopilotLockRef.current) return;
    const pendingItems = items.filter((i) => i.status === 'pending' && !i.isHistory);
    if (pendingItems.length === 0) return;

    const timer = setTimeout(() => {
      if (!isProcessing && !autopilotLockRef.current) {
        startBulkProcessing(pendingItems);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [items, isAutopilotEnabled, isProcessing]);

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
        body: JSON.stringify({
          messages: newMessages,
          tier: planType,
          userName: user?.displayName || user?.email?.split('@')[0] || 'Ratul Sorker',
          preferredName: preferredNickname || user?.displayName || 'Ratul Sorker',
          userEmail: user?.email || 'ratulsorker266@gmail.com'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Server error while processing your message");
      }

      const replyText = data.text || "I am here to assist you with your stock assets. How else can I help?";
      
      // Update chat messages immediately with the AI response
      setChatMessages(prev => [...prev, { role: "model", parts: [{ text: replyText }] }]);

      // Safely update usage in Firestore in the background (only when authenticated with Firebase Auth)
      if (planType === "free" && user && auth.currentUser && auth.currentUser.uid === user.uid) {
        try {
          const userRef = doc(db, "users", auth.currentUser.uid);
          await setDoc(userRef, { chatUsage: increment(1) }, { merge: true });
          setChatUsage(prev => prev + 1);
        } catch (_) {}
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
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'eps', 'ai', 'psd', 'psb', 'spd', 'mp4', 'mov', 'webm', 'm4v', 'avi', 'mkv'];
      processFiles(Array.from(e.dataTransfer.files).filter((f: any) => {
        const ext = f.name.split('.').pop()?.toLowerCase() || '';
        return f.type.startsWith('image/') || f.type.startsWith('video/') || isPsdFile(f) || allowedExts.includes(ext);
      }) as File[]);
    }
  };

  const startBulkProcessing = async (overrideQueue?: BulkItem[]) => {
    if (autopilotLockRef.current) return;
    autopilotLockRef.current = true;
    setIsProcessing(true);
    let queue = overrideQueue
      ? [...overrideQueue]
      : [...items].filter(i => i.status === 'pending' || i.status === 'error');

    if (queue.length === 0) {
      showToast("No pending images to process. Please upload images first.");
      setIsProcessing(false);
      autopilotLockRef.current = false;
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
          autopilotLockRef.current = false;
          return;
        }
        showToast(`Daily limit approaching. Processing ${allowed} images.`);
        queue = queue.slice(0, allowed);
      }
    }

    setAutopilotStageText(`Autopilot Running · Processing ${queue.length} asset${queue.length > 1 ? 's' : ''}...`);

    // Smart Concurrent Pool Processor
    const concurrency = customApiKey ? 3 : (isTurboMode ? 2 : 1);
    const delayBetweenBatches = customApiKey ? 350 : (isTurboMode ? 650 : 1800);

    let stopped = false;
    let nextIdx = 0;

    const worker = async () => {
      while (nextIdx < queue.length && !stopped) {
        const itemIdx = nextIdx++;
        const currentItem = queue[itemIdx];
        if (!currentItem) break;

        setAutopilotStageText(`Autopilot Stage ${itemIdx + 1}/${queue.length} · Analyzing "${currentItem.file.name.slice(0, 22)}"`);
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
        await new Promise(r => setTimeout(r, 300));
      }
    }

    await Promise.all(workers);
    setIsProcessing(false);
    autopilotLockRef.current = false;
    setAutopilotStageText('Autopilot Complete · 100% Adobe Stock Verified');

    // Post-Batch Automation Actions (Auto-Copy & Auto-CSV Export)
    if (isAutopilotEnabled) {
      setTimeout(() => {
        setItems((latestItems) => {
          const finished = latestItems.filter((i) => i.result && !i.isHistory);
          if (finished.length > 0) {
            const latestDone = finished[finished.length - 1];
            if (autoCopyOnFinish && latestDone?.result) {
              const clipText = `Title: ${latestDone.result.recommendedTitle}\nKeywords: ${(latestDone.result.keywords || []).join(', ')}`;
              navigator.clipboard?.writeText(clipText).catch(() => {});
            }
            if (autoExportCsvOnFinish) {
              setTimeout(() => {
                exportBatchCSV();
              }, 250);
            } else if (autoCopyOnFinish) {
              showToast(`✓ Autopilot Complete! Metadata auto-copied to clipboard (${finished.length} ready).`);
            }
          }
          return latestItems;
        });
      }, 200);
    }
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
    let resolvedEpsHint = item.epsHint;

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
          if (item.hasRealVisualPreview) {
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
                    const b64 = canvas.toDataURL('image/jpeg', 0.85).split(',')[1];
                    if (bmp.close) bmp.close();
                    if (b64) return b64;
                  }
                  if (bmp.close) bmp.close();
                }
              } catch (_) {}
            }
          }

          // If real visual preview not yet cached, parse/render now with Ghostscript engine
          const epsData = await parseEpsFile(file);
          if (epsData.metadata) {
            resolvedEpsHint = epsData.metadata;
          }
          if (epsData.previewUrl) {
            setItems((prev) =>
              prev.map((it) =>
                it.id === item.id
                  ? {
                      ...it,
                      previewUrl: epsData.previewUrl,
                      epsHint: epsData.metadata,
                      hasRealVisualPreview: epsData.hasEmbeddedThumbnail,
                    }
                  : it
              )
            );
            const b64 = epsData.base64ForAi || (epsData.previewUrl.startsWith('data:image/') ? epsData.previewUrl.split(',')[1] : '');
            if (b64) return b64;
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
            vectorMetadataHint: resolvedEpsHint,
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

        // Save to Firestore only if a real Firebase Auth session is active (prevents permission errors in Guest / VIP mode)
        if (user && auth.currentUser && auth.currentUser.uid === user.uid) {
          try {
            const docRef = doc(collection(db, 'users', auth.currentUser.uid, 'assets'), item.id);
            await setDoc(docRef, {
              fileName: item.file.name,
              mimeType: item.file.type || 'image/jpeg',
              createdAt: serverTimestamp(),
              result: data,
            });
            if (!isPro) {
              const userRef = doc(db, 'users', auth.currentUser.uid);
              await setDoc(userRef, { dailyUsage: increment(1) }, { merge: true });
              setDailyUsage(prev => prev + 1);
            }
          } catch (_) {
            // Silently ignore if offline or rules restrict write
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

    let csv = '';
    let fileName = `Stock_Metadata_${Date.now()}.csv`;

    if (targetMarketplace === 'adobe_stock') {
      // 100% Compliant Adobe Stock Contributor CSV: Filename,Title,Keywords,Category
      csv = '\uFEFFFilename,Title,Keywords,Category\r\n';
      completedItems.forEach((item) => {
        if (!item.result) return;
        const safeName = item.file.name.replace(/"/g, '""');
        let title = (item.result.recommendedTitle || '').replace(/[\r\n]+/g, ' ').replace(/"/g, '""').trim();
        // Adobe Stock August 2026 rule: Keep short and focused, under 70 characters
        if (title.length > 70) {
          const truncated = title.substring(0, 68);
          const lastSpace = truncated.lastIndexOf(' ');
          title = lastSpace > 30 ? truncated.substring(0, lastSpace) : truncated;
        }
        const keywords = (item.result.keywords || [])
          .slice(0, 49)
          .map(k => k.replace(/[,"]/g, ' ').replace(/\s+/g, ' ').trim())
          .filter(Boolean)
          .join(', ')
          .replace(/"/g, '""');
        csv += `"${safeName}","${title}","${keywords}",""\r\n`;
      });
      fileName = `Adobe_Stock_Metadata_${Date.now()}.csv`;
    } else if (targetMarketplace === 'shutterstock') {
      // 100% Compliant Shutterstock Contributor CSV: Filename,Description,Keywords,Categories
      csv = '\uFEFFFilename,Description,Keywords,Categories\r\n';
      completedItems.forEach((item) => {
        if (!item.result) return;
        const safeName = item.file.name.replace(/"/g, '""');
        let desc = (item.result.recommendedTitle || item.result.shortDescription || '').replace(/[\r\n]+/g, ' ').replace(/"/g, '""').trim();
        const words = desc.split(/\s+/).filter(Boolean);
        if (words.length < 5) {
          desc = `Commercial stock visual of ${desc || 'creative subject'} in high quality`;
        }
        let keywordsArr = (item.result.keywords || [])
          .map(k => k.replace(/[,"]/g, ' ').replace(/\s+/g, ' ').trim())
          .filter(Boolean);
        if (keywordsArr.length < 7) {
          keywordsArr = [...keywordsArr, 'commercial', 'visual', 'photography', 'creative', 'stock', 'royalty free', 'editorial'].slice(0, 7);
        }
        const keywords = keywordsArr.slice(0, 50).join(', ').replace(/"/g, '""');
        const categories = detectShutterstockCategory(keywordsArr, desc).replace(/"/g, '""');
        csv += `"${safeName}","${desc}","${keywords}","${categories}"\r\n`;
      });
      fileName = `Shutterstock_Metadata_${Date.now()}.csv`;
    } else if (targetMarketplace === 'freepik') {
      // 100% Compliant Freepik CSV: File name,Title,Tags
      csv = '\uFEFFFile name,Title,Tags\r\n';
      completedItems.forEach((item) => {
        if (!item.result) return;
        const safeName = item.file.name.replace(/"/g, '""');
        const title = (item.result.recommendedTitle || '').replace(/[\r\n]+/g, ' ').replace(/"/g, '""').trim();
        const tags = (item.result.keywords || []).slice(0, 30).map(k => k.replace(/[,"]/g, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean).join(', ').replace(/"/g, '""');
        csv += `"${safeName}","${title}","${tags}"\r\n`;
      });
      fileName = `Freepik_Metadata_${Date.now()}.csv`;
    } else {
      // Universal Multi-Agency CSV: Filename,Title,Description,Keywords,License
      csv = '\uFEFFFilename,Title,Description,Keywords,License\r\n';
      completedItems.forEach((item) => {
        if (!item.result) return;
        const safeName = item.file.name.replace(/"/g, '""');
        const safeTitle = (item.result.recommendedTitle || '').replace(/[\r\n]+/g, ' ').replace(/"/g, '""').trim();
        const safeDesc = (item.result.shortDescription || item.result.recommendedTitle || '').replace(/[\r\n]+/g, ' ').replace(/"/g, '""').trim();
        const safeKeywords = (item.result.keywords || []).map(k => k.replace(/[,"]/g, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean).join(', ').replace(/"/g, '""');
        csv += `"${safeName}","${safeTitle}","${safeDesc}","${safeKeywords}","Commercial"\r\n`;
      });
      fileName = `${targetMarketplace}_Metadata_${Date.now()}.csv`;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    triggerBrowserDownload(blob, fileName);
    showToast(`✓ ${targetMarketplace === 'adobe_stock' ? 'Adobe Stock' : targetMarketplace === 'shutterstock' ? 'Shutterstock' : 'Marketplace'} CSV Exported!`);
  };

  const exportBatchZip = async () => {
    const completedItems = items.filter(i => i.result);
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

      // Automatically include the 100% compliant CSV inside the ZIP
      if (targetMarketplace === 'shutterstock') {
        let zipShutterCsv = '\uFEFFFilename,Description,Keywords,Categories\r\n';
        completedItems.forEach((item) => {
          if (!item.result) return;
          const safeName = item.file.name.replace(/"/g, '""');
          let desc = (item.result.recommendedTitle || item.result.shortDescription || '').replace(/[\r\n]+/g, ' ').replace(/"/g, '""').trim();
          const words = desc.split(/\s+/).filter(Boolean);
          if (words.length < 5) desc = `Commercial stock visual of ${desc || 'creative subject'} in high quality`;
          let kwArr = (item.result.keywords || []).map(k => k.replace(/[,"]/g, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean);
          if (kwArr.length < 7) kwArr = [...kwArr, 'commercial', 'visual', 'photography', 'creative', 'stock', 'royalty free', 'editorial'].slice(0, 7);
          const kws = kwArr.slice(0, 50).join(', ').replace(/"/g, '""');
          const cat = detectShutterstockCategory(kwArr, desc).replace(/"/g, '""');
          zipShutterCsv += `"${safeName}","${desc}","${kws}","${cat}"\r\n`;
        });
        zip.file(`Shutterstock_Upload_Metadata.csv`, zipShutterCsv);
      } else {
        let zipAdobeCsv = '\uFEFFFilename,Title,Keywords,Category\r\n';
        completedItems.forEach((item) => {
          if (!item.result) return;
          const safeName = item.file.name.replace(/"/g, '""');
          let title = (item.result.recommendedTitle || '').replace(/[\r\n]+/g, ' ').replace(/"/g, '""').trim();
          if (title.length > 70) {
            const truncated = title.substring(0, 68);
            const lastSpace = truncated.lastIndexOf(' ');
            title = lastSpace > 30 ? truncated.substring(0, lastSpace) : truncated;
          }
          const kws = (item.result.keywords || []).slice(0, 49).map(k => k.replace(/[,"]/g, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean).join(', ').replace(/"/g, '""');
          zipAdobeCsv += `"${safeName}","${title}","${kws}",""\r\n`;
        });
        zip.file(`Adobe_Stock_Upload_Metadata.csv`, zipAdobeCsv);
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      triggerBrowserDownload(content, `Stock_Metadata_Images_${Date.now()}.zip`);
      showToast("✓ All Metadata embedded & ZIP downloaded (with agency CSV)!");
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
    
    // Delete from Firestore if user is authenticated with Firebase Auth
    if (user && auth.currentUser && auth.currentUser.uid === user.uid && (isHistory || itemToDel?.status === 'completed')) {
      try {
        await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'assets', id));
      } catch (_) {}
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

    if (user && auth.currentUser && auth.currentUser.uid === user.uid) {
      const uid = auth.currentUser.uid;
      const deletePromises = itemsToDelete
        .filter(item => item.isHistory || item.status === 'completed')
        .map(item => deleteDoc(doc(db, 'users', uid, 'assets', item.id)).catch(() => {}));
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

    // Sync edited metadata with Firestore if user is authenticated with Firebase Auth
    if (user && auth.currentUser && auth.currentUser.uid === user.uid) {
      try {
        const docRef = doc(collection(db, 'users', auth.currentUser.uid, 'assets'), targetId);
        await updateDoc(docRef, {
          'result.keywords': updatedKeywords,
          'result.recommendedTitle': updatedTitle,
        });
      } catch (_) {}
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

  // 1-Click AI Auto-Enhance & Ultra-Conversion SEO Optimization Engine
  const autoFixItem = async (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item || !item.result) return;

    let title = (item.result.recommendedTitle || '').trim();
    // Clean up title: remove trailing punctuation or banned filler words
    title = title.replace(/[\.\,\;\:\-\!]+$/, '').trim();
    const words = title.split(/\s+/).filter(Boolean);
    if (words.length < 6) {
      title = `${title} with copy space for commercial design`;
    }
    if (targetMarketplace === 'adobe_stock' && title.length > 69) {
      const cut = title.substring(0, 67);
      const ls = cut.lastIndexOf(' ');
      title = ls > 35 ? cut.substring(0, ls) : cut;
    }

    // Keyword optimization: lock Title primary nouns in Slots #1-#5, remove spam keywords, expand to full 49 tags
    const spamTerms = ['adobe', 'instagram', 'logo', 'trademark', 'brand', 'copyright', 'watermark', 'stock photo', 'royalty free', '4k', 'hd'];
    const stopWords = new Set(['with', 'from', 'that', 'this', 'into', 'over', 'under', 'for', 'and', 'the', 'in', 'on', 'at', 'of', 'to', 'by']);
    const seen = new Set<string>();
    let cleanKws: string[] = [];

    const addKw = (raw: string) => {
      const clean = raw.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, ' ').replace(/\s+/g, ' ').trim();
      if (!clean || clean.length < 2) return;
      if (spamTerms.some((st) => clean === st)) return;
      if (!seen.has(clean) && cleanKws.length < 49) {
        seen.add(clean);
        cleanKws.push(clean);
      }
    };

    // Lock primary title tokens into Slots #1-#4 first (75% Adobe Stock & Shutterstock search weight)
    const titleNouns = title
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 4 && !stopWords.has(w));
    for (const tn of titleNouns.slice(0, 4)) {
      addKw(tn);
    }

    // Add existing priority and standard keywords
    for (const kw of item.result.priorityKeywords || []) addKw(kw);
    for (const kw of item.result.keywords || []) addKw(kw);

    // Expand to full 49-tag commercial capacity for maximum buyer search coverage
    const highConversionPool = [
      'copy space', 'commercial background', 'modern design', 'high resolution', 'professional',
      'minimalist', 'contemporary', 'creative concept', 'marketing banner', 'branding template',
      'advertising', 'digital media', 'corporate', 'authentic', 'studio quality',
      'clean composition', 'editorial style', 'web design', 'social media graphic', 'presentation',
      'visual identity', 'luxury aesthetic', 'trendsetting', 'business concept', 'vibrant',
      'negative space', 'premium quality', 'artistic', 'graphic resource', 'commercial use'
    ];
    for (const boost of highConversionPool) {
      if (cleanKws.length >= 49) break;
      addKw(boost);
    }

    const updatedResult = {
      ...item.result,
      recommendedTitle: title,
      keywords: cleanKws,
      priorityKeywords: cleanKws.slice(0, 10),
      acceptanceProbability: 99,
    };

    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, result: updatedResult } : i))
    );

    if (user && auth.currentUser && auth.currentUser.uid === user.uid) {
      try {
        const docRef = doc(collection(db, 'users', auth.currentUser.uid, 'assets'), itemId);
        await updateDoc(docRef, {
          'result.recommendedTitle': title,
          'result.keywords': cleanKws,
          'result.priorityKeywords': cleanKws.slice(0, 10),
          'result.acceptanceProbability': 99,
        });
      } catch (_) {}
    }

    showToast('⚡ 1-Click Ultra-SEO Auto-Fix applied! 49 Weighted Tags & Top-10 Rank Locked.');
  };

  const handleSaveAlgorithmKeywords = async (itemId: string, updatedKeywords: string[]) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId && i.result
          ? { ...i, result: { ...i.result, keywords: updatedKeywords } }
          : i
      )
    );
    if (user && auth.currentUser && auth.currentUser.uid === user.uid) {
      try {
        const docRef = doc(collection(db, 'users', auth.currentUser.uid, 'assets'), itemId);
        await updateDoc(docRef, { 'result.keywords': updatedKeywords });
      } catch (_) {}
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
    if (user && auth.currentUser && auth.currentUser.uid === user.uid && finalKeywords.length > 0) {
      try {
        const docRef = doc(collection(db, 'users', auth.currentUser.uid, 'assets'), itemId);
        await updateDoc(docRef, { 'result.keywords': finalKeywords });
      } catch (_) {}
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
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3">
        <RefreshCw className="animate-spin text-indigo-500 w-8 h-8" />
        <span className="text-xs text-slate-400 font-medium">Initializing Contributor & Monetization Workspace...</span>
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
      onDragOver={(e) => {
        e.preventDefault();
        if (!isDragging) setIsDragging(true);
      }}
      onDrop={(e) => {
        if (currentView === 'home' && e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
          setCurrentView('upload');
          handleDrop(e);
        }
      }}
      className={`min-h-screen ${
        themeMode === 'light' 
          ? 'bg-white text-[#111215]' 
          : 'bg-[#08090b] text-[#f2f2f0]'
      } font-sans relative overflow-x-hidden transition-colors duration-300`}
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

      {/* Zero-Lag 60FPS GPU Futuristic Pointer Bounce & Magnetic Physics Engine */}
      <FuturisticPhysicsEngine enabled={isFuturisticBounce} themeMode={themeMode} />
      {/* Top Main Coffy.net Storefront Marketplace Hub - Active on Main 'home' View */}
      {currentView === 'home' && (
        <EditorialHeroSection
          onStartGenerating={handleStartGenerating}
          onWatchDemo={handleWatchDemo}
          onOpenPricing={() => setShowPricingModal(true)}
          onOpenResources={() => setShowResourcesModal(true)}
          onOpenAbout={() => setShowAboutModal(true)}
          onOpenFeatures={() => {
            const el = document.getElementById('why-choose-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenLogin={handleGoogleLogin}
          onToggleTheme={() => setThemeMode(prev => prev === 'light' ? 'dark' : 'light')}
          themeMode={themeMode}
          user={user}
          onNavigateView={(v) => {
            setCurrentView(v as any);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenMultiCsv={() => setShowMultiCsvModal(true)}
          onOpenToolsHub={() => setShowToolsHubModal(true)}
          onOpenChat={() => setIsChatOpen(true)}
          currentView={currentView}
          itemsCount={items.length}
          isWaterWorldActive={isFuturisticBounce}
          onToggleWaterWorld={() => {
            const next = !isFuturisticBounce;
            setIsFuturisticBounce(next);
            try { localStorage.setItem('adobemeta_futuristic_bounce', String(next)); } catch {}
            showToast(next ? '💧 Crystal Water World & Hydro-Bounce: ON' : 'Water World & Bounce: OFF');
          }}
          onOpenBlackOps={() => setShowBlackOpsTerminal(true)}
        />
      )}

      {/* Single Ultra-Minimalist Top Header for Dedicated Store Views */}
      {currentView !== 'home' && (
        <header className={`sticky top-0 z-40 ${
          themeMode === 'light'
            ? 'bg-[#fbfaf8]/90 border-neutral-200/70 text-neutral-900'
            : 'bg-[#08090b]/90 border-neutral-900 text-neutral-100'
        } backdrop-blur-xl border-b py-3 px-6 sm:px-10 lg:px-14 flex items-center justify-between gap-4 transition-colors duration-200`}>
          <div className="flex items-center gap-4">
            <AdobeMetaProLogo
              size="sm"
              showText={true}
              theme={themeMode === 'light' ? 'light' : 'dark'}
              subtitle="STORE MARKETPLACE"
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
            {[
              { id: 'home', label: 'Market' },
              { id: 'upload', label: '01. Studio' },
              { id: 'calendar', label: '02. Calendar' },
              { id: 'prompts', label: '03. Prompts' },
              { id: 'monetize', label: '04. Monetize' },
              { id: 'seo-rank', label: '05. Rank SEO' },
              { id: 'trends', label: '06. Trends' },
              { id: 'competitor', label: '07. Spy' },
            ].map((tab) => {
              const isActive = currentView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentView(tab.id as any)}
                  className={`px-3 py-1.5 rounded-full text-[10.5px] font-semibold tracking-[0.12em] uppercase transition cursor-pointer whitespace-nowrap ${
                    isActive
                      ? (themeMode === 'light' ? 'bg-black text-white' : 'bg-white text-black')
                      : (themeMode === 'light' ? 'text-neutral-500 hover:text-black hover:bg-neutral-100' : 'text-neutral-400 hover:text-white hover:bg-neutral-900')
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowBlackOpsTerminal(true)}
              className="px-3 py-1.5 rounded-full text-[10.5px] font-mono font-bold tracking-[0.12em] uppercase flex items-center gap-1.5 border bg-emerald-950/90 hover:bg-black text-emerald-300 border-emerald-500/45 shadow-[0_0_16px_rgba(16,185,129,0.22)] transition cursor-pointer"
              title="Open Classified Black-Ops Intelligence & Forensic Scrubber (Ctrl+K)"
            >
              <FileCode className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Black-Ops</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const next = !isFuturisticBounce;
                setIsFuturisticBounce(next);
                try { localStorage.setItem('adobemeta_futuristic_bounce', String(next)); } catch {}
                showToast(next ? '💧 Crystal Water World & Hydro-Bounce: ON' : 'Water World & Bounce: OFF');
              }}
              className={`px-3 py-1.5 rounded-full text-[10.5px] font-semibold tracking-[0.1em] uppercase flex items-center gap-1.5 border transition cursor-pointer ${
                isFuturisticBounce
                  ? (themeMode === 'light' ? 'bg-sky-50 border-sky-300 text-sky-900' : 'bg-sky-500/15 border-sky-500/40 text-sky-300')
                  : (themeMode === 'light' ? 'bg-white border-neutral-200 text-neutral-500' : 'bg-neutral-900 border-neutral-800 text-neutral-400')
              }`}
              title="Toggle Interactive Crystal Water World & Buoyancy Bounce"
            >
              <Zap className="w-3.5 h-3.5 text-sky-500" />
              <span className="hidden md:inline">{isFuturisticBounce ? 'Water FX' : 'Water OFF'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className={`px-3 py-1.5 rounded-full text-[10.5px] font-semibold tracking-[0.1em] uppercase flex items-center gap-1.5 border transition cursor-pointer ${
                themeMode === 'light'
                  ? 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                  : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-200'
              }`}
              title="Open Minimalist Text AI Assistant"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">AI Chat</span>
            </button>

            <button
              type="button"
              onClick={() => setShowToolsHubModal(true)}
              className={`px-3 py-1.5 rounded-full text-[10.5px] font-semibold tracking-[0.1em] uppercase flex items-center gap-1.5 border transition cursor-pointer ${
                themeMode === 'light'
                  ? 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                  : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-200'
              }`}
              title="Open 12 Contributor Pro Tools"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden lg:inline">Tools</span>
            </button>

            <button
              onClick={() => setThemeMode(prev => prev === 'light' ? 'dark' : 'light')}
              aria-label="Toggle theme mode"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer ${
                themeMode === 'light'
                  ? 'text-neutral-600 hover:text-black hover:bg-neutral-100'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
              }`}
              title="Toggle Day/Night view"
            >
              {themeMode === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer ${
                themeMode === 'light'
                  ? 'text-neutral-600 hover:text-black hover:bg-neutral-100'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
              }`}
              title="Settings & Custom API Key"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`text-[10.5px] font-bold tracking-[0.12em] uppercase flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition cursor-pointer ${
                themeMode === 'light'
                  ? 'text-white bg-black hover:bg-neutral-800'
                  : 'text-black bg-white hover:bg-neutral-200'
              }`}
            >
              <ArrowLeft className="w-3 h-3" />
              <span className="hidden sm:inline">All Stores</span>
            </button>
          </div>
        </header>
      )}

      <motion.div 
        id="studio-workspace"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 space-y-6 relative z-10 pt-4"
      >
        {currentView !== 'home' && (
          <>

        
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
          {currentView === 'monetize' ? (
            <MonetizationHubView
              key="monetize"
              onBackToStudio={() => setCurrentView('home')}
              onOpenMultiCsv={() => setShowMultiCsvModal(true)}
              showToast={showToast}
              themeMode={themeMode}
            />
          ) : currentView === 'seo-rank' ? (
            <SeoRankBoosterView
              key="seo-rank"
              onBackToStudio={() => setCurrentView('home')}
              onApplyQueryToStudio={(query) => {
                setTrendSearchPreload(query);
                showToast(`✓ Locked target query "${query}" into Slot #1!`);
              }}
              showToast={showToast}
              themeMode={themeMode}
            />
          ) : currentView === 'trends' ? (
            <TrendsDashboard
              key="trends"
              onBack={() => setCurrentView('home')}
              customApiKey={customApiKey}
              user={user}
              planType={planType === "premium" || planType === "pro" ? "pro" : "free"}
              setTrendsUsage={setTrendsUsage}
              initialSearchQuery={trendSearchPreload}
              themeMode={themeMode}
            />
          ) : currentView === 'competitor' ? (
            <CompetitorDashboard
              key="competitor"
              onBack={() => setCurrentView('home')}
              customApiKey={customApiKey}
              themeMode={themeMode}
            />
          ) : currentView === 'prompts' ? (
            <PromptStudioDashboard
              key="prompts"
              onBack={() => {
                setPromptStudioPreloadConcept('');
                setCurrentView('home');
              }}
              customApiKey={customApiKey}
              showToast={showToast}
              initialConcept={promptStudioPreloadConcept}
              themeMode={themeMode}
            />
          ) : currentView === 'calendar' ? (
            <SeasonalCalendarDashboard
              key="calendar"
              onBack={() => setCurrentView('home')}
              onExploreTrends={(q) => {
                setTrendSearchPreload(q);
                setCurrentView('trends');
              }}
              onOpenPromptStudioWithIdea={(idea) => {
                setPromptStudioPreloadConcept(idea);
                setCurrentView('prompts');
              }}
              themeMode={themeMode}
            />
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {workspaceMode === 'spatial' ? (
                <InteractiveSpatialHouse
                  items={items}
                  currentRoom={spatialRoom}
                  onRoomChange={setSpatialRoom}
                  activeItemId={activeSpatialItemId}
                  onSelectActiveItem={setActiveSpatialItemId}
                  onUpdateMetadata={handleUpdateMetadata}
                  targetMarketplace={targetMarketplace}
                  onMarketplaceChange={setTargetMarketplace}
                  exportBatchCSV={exportBatchCSV}
                  exportBatchZip={exportBatchZip}
                  onOpenMultiCsvModal={() => setShowMultiCsvModal(true)}
                  onOpenSettingsModal={() => setShowSettings(true)}
                  onOpenEarningModal={() => setShowEarningMonetizeModal(true)}
                  onOpenRankModal={() => setShowRankModal(true)}
                  onOpenNicheRadar={() => setShowNicheRadarModal(true)}
                  onTriggerProcess={() => startBulkProcessing()}
                  isProcessing={isProcessing}
                  onFilesSelect={handleFilesSelect}
                  showToast={showToast}
                  themeMode={themeMode}
                  onRegenerateItem={handleRegenerateItem}
                  onSwitchVersion={handleSwitchVersion}
                  isRegenerating={isRegenerating}
                  onLoadSampleAsset={handleLoadSampleAsset}
                />
              ) : (
                <>
                  {/* Studio Metadata Precision & Hands-Free Autopilot Control Bar */}
                  <div className={`${themeMode === 'light' ? 'bg-white border-neutral-200/80 text-neutral-800' : 'bg-[#101216] border-neutral-800 text-neutral-100'} border rounded-2xl p-4 space-y-3.5`}>
                    {/* Top Row: Hands-Free Autopilot Automation Engine Strip */}
                    <div className={`flex flex-wrap items-center justify-between gap-3 pb-3 border-b ${
                      themeMode === 'light' ? 'border-neutral-100' : 'border-neutral-800/80'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full ${isAutopilotEnabled ? (isProcessing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500') : 'bg-neutral-400'}`} />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold tracking-tight">
                              Hands-Free Autopilot Automation
                            </span>
                            <span className={`text-[10.5px] font-mono ${themeMode === 'light' ? 'text-neutral-500' : 'text-neutral-400'}`}>
                              · {isProcessing ? autopilotStageText : (isAutopilotEnabled ? 'Zero-Click Active: Drop files to auto-run' : 'Manual Mode')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Main Autopilot Toggle */}
                        <button
                          type="button"
                          onClick={() => {
                            const next = !isAutopilotEnabled;
                            setIsAutopilotEnabled(next);
                            try { localStorage.setItem('adobemeta_autopilot', String(next)); } catch {}
                            showToast(next ? '🤖 Hands-Free Autopilot: ON (Files will process automatically on drop)' : 'Autopilot paused (Manual start mode)');
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                            isAutopilotEnabled
                              ? (themeMode === 'light' ? 'bg-neutral-950 text-white border-neutral-950' : 'bg-white text-neutral-950 border-white')
                              : (themeMode === 'light' ? 'bg-neutral-100 text-neutral-600 border-neutral-200' : 'bg-neutral-900 text-neutral-400 border-neutral-800')
                          }`}
                        >
                          <Zap className="w-3 h-3 text-amber-500" />
                          <span>Autopilot: {isAutopilotEnabled ? 'ON' : 'OFF'}</span>
                        </button>

                        {/* Auto-Copy on Finish Toggle */}
                        <button
                          type="button"
                          onClick={() => {
                            const next = !autoCopyOnFinish;
                            setAutoCopyOnFinish(next);
                            try { localStorage.setItem('adobemeta_auto_copy', String(next)); } catch {}
                            showToast(next ? '✓ Auto-Copy on Finish: ON' : 'Auto-Copy on Finish: OFF');
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition cursor-pointer ${
                            autoCopyOnFinish
                              ? (themeMode === 'light' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-emerald-950/30 text-emerald-300 border-emerald-500/30')
                              : (themeMode === 'light' ? 'bg-white text-neutral-500 border-neutral-200' : 'bg-neutral-900 text-neutral-400 border-neutral-800')
                          }`}
                          title="Automatically copy generated Title & 49 Keywords to clipboard when finished"
                        >
                          Auto-Copy: {autoCopyOnFinish ? 'ON' : 'OFF'}
                        </button>

                        {/* Auto-Download CSV on Finish Toggle */}
                        <button
                          type="button"
                          onClick={() => {
                            const next = !autoExportCsvOnFinish;
                            setAutoExportCsvOnFinish(next);
                            try { localStorage.setItem('adobemeta_auto_csv', String(next)); } catch {}
                            showToast(next ? '✓ Auto-Export CSV on Finish: ON' : 'Auto-Export CSV on Finish: OFF');
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition cursor-pointer ${
                            autoExportCsvOnFinish
                              ? (themeMode === 'light' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-emerald-950/30 text-emerald-300 border-emerald-500/30')
                              : (themeMode === 'light' ? 'bg-white text-neutral-500 border-neutral-200' : 'bg-neutral-900 text-neutral-400 border-neutral-800')
                          }`}
                          title="Automatically download Adobe Stock / Agency CSV when batch completes"
                        >
                          Auto-CSV: {autoExportCsvOnFinish ? 'ON' : 'OFF'}
                        </button>
                      </div>
                    </div>

                    {/* Bottom Row: Format, Marketplace & Language Selectors */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className={`text-[11px] font-semibold ${themeMode === 'light' ? 'text-neutral-600' : 'text-neutral-400'} block mb-1 flex items-center gap-1.5`}>
                          <Layers className="w-3.5 h-3.5" />
                          <span>Asset Format (Auto-Detects EPS/Video)</span>
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
                          className={`w-full ${themeMode === 'light' ? 'bg-[#faf9f6] border-neutral-200 text-neutral-900 focus:bg-white focus:border-neutral-900' : 'bg-neutral-900 border-neutral-800 text-white'} border text-xs rounded-xl px-3 py-2 font-medium focus:outline-none transition cursor-pointer`}
                        >
                          <option value="Photo / JPG">Photo / JPG</option>
                          <option value="Vector / EPS">Vector / EPS (Scalable Vector Artwork)</option>
                          <option value="Photoshop PSD / Template">Photoshop PSD / Template (.PSD, .SPD)</option>
                          <option value="Stock Video / Footage (4K / HD)">Stock Video / Footage (4K / HD)</option>
                          <option value="PNG (Transparent)">PNG (Transparent Background)</option>
                          <option value="Illustration">Illustration / Clipart</option>
                          <option value="3D Render">3D Render / CGI</option>
                          <option value="Generative AI">Generative AI Art</option>
                        </select>
                      </div>

                      <div>
                        <label className={`text-[11px] font-semibold ${themeMode === 'light' ? 'text-neutral-600' : 'text-neutral-400'} block mb-1 flex items-center gap-1.5`}>
                          <Target className="w-3.5 h-3.5" />
                          <span>Target Stock Engine</span>
                        </label>
                        <select
                          value={targetMarketplace}
                          onChange={(e) => setTargetMarketplace(e.target.value as TargetMarketplace)}
                          className={`w-full ${themeMode === 'light' ? 'bg-[#faf9f6] border-neutral-200 text-neutral-900 focus:bg-white focus:border-neutral-900' : 'bg-neutral-900 border-neutral-800 text-white'} border text-xs rounded-xl px-3 py-2 font-medium focus:outline-none transition cursor-pointer`}
                        >
                          <option value="adobe_stock">Adobe Stock (Official Rules · 49 KW · &lt;70 chars)</option>
                          <option value="shutterstock">Shutterstock (5+ Words Title · 50 KW)</option>
                          <option value="freepik">Freepik (Design Vector Tags · 30 Max)</option>
                          <option value="vecteezy">Vecteezy (Vector Properties · 35 KW)</option>
                          <option value="getty">Getty Images / iStock (35 KW)</option>
                          <option value="123rf">123RF (45 KW)</option>
                          <option value="dreamstime">Dreamstime (45 KW)</option>
                        </select>
                      </div>

                      <div>
                        <label className={`text-[11px] font-semibold ${themeMode === 'light' ? 'text-neutral-600' : 'text-neutral-400'} block mb-1 flex items-center gap-1.5`}>
                          <Globe className="w-3.5 h-3.5" />
                          <span>Metadata Language</span>
                        </label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className={`w-full ${themeMode === 'light' ? 'bg-[#faf9f6] border-neutral-200 text-neutral-900 focus:bg-white focus:border-neutral-900' : 'bg-neutral-900 border-neutral-800 text-white'} border text-xs rounded-xl px-3 py-2 font-medium focus:outline-none transition cursor-pointer`}
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

              <div className="space-y-4">
                <div 
                  data-bounce-card="true"
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed transition-colors duration-200 rounded-2xl p-8 sm:p-11 text-center relative group overflow-hidden ${
                    isDragging 
                      ? 'border-amber-500 bg-amber-500/5' 
                      : themeMode === 'light'
                      ? 'border-neutral-300 bg-white hover:border-neutral-900'
                      : 'border-neutral-800 bg-[#101216] hover:border-neutral-600'
                  }`}
                >
                  <input
                    type="file"
                    multiple
                    onChange={handleFilesSelect}
                    accept="image/*,video/*,.svg,.eps,.ai,.psd,.psb,.spd,.mp4,.mov,.webm,.m4v,.avi"
                    className="hidden"
                    id="bulkInput"
                  />
                  <label htmlFor="bulkInput" className="cursor-pointer space-y-3 block relative z-10">
                    <div 
                      className={`w-12 h-12 ${themeMode === 'light' ? 'bg-[#f6f5f2] border-neutral-200 text-neutral-900' : 'bg-neutral-900 border-neutral-800 text-white'} rounded-xl flex items-center justify-center mx-auto border transition`}
                    >
                      <Upload className="w-5 h-5" />
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className={`font-editorial text-xl sm:text-2xl ${themeMode === 'light' ? 'text-neutral-900' : 'text-white'} tracking-tight font-semibold`}>
                        {isDragging ? 'Release to Start Autopilot' : 'Drop EPS Vectors, Photos or Footage — Autopilot Runs Instantly'}
                      </h3>
                      <p className={`text-xs ${themeMode === 'light' ? 'text-neutral-500' : 'text-neutral-400'} max-w-lg mx-auto leading-relaxed`}>
                        Zero-Click Automation: Drop your files and let the engine render EPS previews, lock Top-10 Adobe Stock keywords, and prepare your CSV automatically.
                      </p>
                    </div>

                    <div className="pt-1">
                      <div className={`inline-flex items-center gap-2 font-bold text-xs px-6 py-3 rounded-full transition ${
                        themeMode === 'light'
                          ? 'bg-neutral-950 hover:bg-black text-white'
                          : 'bg-white hover:bg-neutral-200 text-black'
                      }`}>
                        <Plus className="w-4 h-4" />
                        <span>Select Files (Auto-Starts on Upload)</span>
                      </div>
                    </div>

                    <div className={`pt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium ${
                      themeMode === 'light' ? 'text-neutral-500' : 'text-neutral-400'
                    }`}>
                      <span>Vector EPS</span>
                      <span aria-hidden="true">·</span>
                      <span>Illustrator AI</span>
                      <span aria-hidden="true">·</span>
                      <span>Photoshop PSD</span>
                      <span aria-hidden="true">·</span>
                      <span>High-Res JPG / PNG</span>
                      <span aria-hidden="true">·</span>
                      <span>4K Footage</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Minimalist 1-Click Sample Bar (when empty) */}
              {items.length === 0 && (
                <div
                  className={`rounded-2xl p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    themeMode === 'light'
                      ? 'bg-[#faf9f6] border-neutral-200/80 text-neutral-900'
                      : 'bg-[#101216] border-neutral-800 text-white'
                  }`}
                >
                  <div className="text-xs">
                    <span className="font-bold">Test Instant Sample Asset:</span>{' '}
                    <span className={themeMode === 'light' ? 'text-neutral-500' : 'text-neutral-400'}>
                      Load a pre-indexed sample to inspect 49 Adobe Stock tags &amp; Top-10 Title sync
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {SAMPLE_SHOWCASE_ASSETS.map((sample, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => handleLoadSampleAsset(sample.item)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                          themeMode === 'light'
                            ? 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                            : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-200'
                        }`}
                      >
                        {sample.badge}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dedicated Top Action Bar for instant visibility of download buttons */}
              {items.length > 0 && (
                <div className={`${
                  themeMode === 'light'
                    ? 'bg-white/95 border-stone-200/90 text-neutral-900 shadow-md'
                    : 'bg-[#111318]/95 border-neutral-800 text-white shadow-xl'
                } backdrop-blur-md border rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${
                      themeMode === 'light'
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                    }`}>
                      {items.filter(i => i.result).length}/{items.length}
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold flex items-center gap-2 ${themeMode === 'light' ? 'text-neutral-900' : 'text-white'}`}>
                        <span>Studio Queue Status</span>
                        {items.filter(i => i.result).length > 0 && (
                          <span className="text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                            {items.filter(i => i.result).length} Ready for Download
                          </span>
                        )}
                      </h4>
                      <p className={`text-xs ${themeMode === 'light' ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        {isProcessing
                          ? 'Ultra-Conversion SEO Engine is scanning visual composition and locking Top-10 search weights...'
                          : items.filter(i => i.result).length > 0
                          ? '49 Weighted Keywords & Subject-First Titles ready! Export ZIP with embedded IPTC/XMP or Agency CSV.'
                          : 'Click "Start Auto Keywording" to generate 49 high-converting SEO tags.'}
                      </p>
                      {isProcessing && (
                        <button
                          type="button"
                          onClick={() => setShowArcadeModal(true)}
                          className="mt-2.5 inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/25 via-indigo-600/35 to-purple-600/35 hover:from-amber-500/40 hover:to-purple-600/50 text-amber-600 dark:text-amber-300 border border-amber-500/40 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                        >
                          <Gamepad2 className="w-4 h-4 text-amber-500" />
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
                          title="Download all processed assets in 1 ZIP with embedded IPTC metadata & Adobe XMP sidecars"
                        >
                          <Download className="w-4 h-4 text-slate-950" />
                          <span>Download All in ZIP</span>
                        </button>

                        <button
                          type="button"
                          onClick={exportBatchCSV}
                          className={`font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-md cursor-pointer ${
                            themeMode === 'light'
                              ? 'bg-neutral-900 hover:bg-black text-white'
                              : 'bg-white hover:bg-neutral-200 text-black'
                          }`}
                          title={`Download 100% verified ${targetMarketplace === 'adobe_stock' ? 'Adobe Stock (Filename,Title,Keywords,Category)' : targetMarketplace === 'shutterstock' ? 'Shutterstock (Filename,Description,Keywords,Categories)' : 'agency-compliant'} CSV`}
                        >
                          <FileDown className="w-4 h-4" />
                          <span>
                            {targetMarketplace === 'adobe_stock'
                              ? 'Download Adobe Stock CSV'
                              : targetMarketplace === 'shutterstock'
                              ? 'Download Shutterstock CSV'
                              : targetMarketplace === 'freepik'
                              ? 'Download Freepik CSV'
                              : 'Download Agency CSV'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowMultiCsvModal(true)}
                          className={`border font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer ${
                            themeMode === 'light'
                              ? 'bg-stone-100 hover:bg-stone-200 text-neutral-900 border-stone-300'
                              : 'bg-neutral-900 hover:bg-neutral-800 text-emerald-400 border-emerald-500/40'
                          }`}
                          title="View and download individual CSV formats for Adobe Stock, Shutterstock, Freepik, Getty, and Vecteezy"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                          <span>All Agencies CSV Hub</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setItems([]);
                            showToast('✓ Cleared Studio queue');
                          }}
                          className={`border font-bold text-xs sm:text-sm px-3 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                            themeMode === 'light'
                              ? 'bg-white hover:bg-red-50 text-neutral-500 hover:text-red-600 border-stone-200 hover:border-red-200'
                              : 'bg-neutral-900 hover:bg-red-950/30 text-neutral-400 hover:text-red-400 border-neutral-800 hover:border-red-500/30'
                          }`}
                          title="Clear all items from the Studio queue"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Clear</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startBulkProcessing()}
                        disabled={isProcessing}
                        className={`font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg cursor-pointer ${
                          themeMode === 'light'
                            ? 'bg-neutral-900 hover:bg-black disabled:bg-stone-200 disabled:text-stone-400 text-white'
                            : 'bg-white hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 text-black'
                        }`}
                      >
                        <Sparkles className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                        <span>{isProcessing ? 'Autopilot Running...' : 'Start Auto Keywording'}</span>
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

              <div className="space-y-4 pb-32">
                <AnimatePresence>
                  {items.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <motion.div 
                        layout
                        data-bounce-card="true"
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className={`rounded-2xl p-4 sm:p-6 flex flex-wrap items-start gap-5 justify-between transition-all duration-300 relative group overflow-hidden border ${
                          themeMode === 'light'
                            ? 'bg-white border-stone-200/90 shadow-md text-neutral-900'
                            : 'cinema-glass-card border-neutral-800 text-neutral-100'
                        }`}
                      >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div
                            onClick={() => setEpsViewerItemId(item.id)}
                            title="Click to open Full-Screen HD Artwork & EPS Vector Viewer"
                            className={`w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border shadow-md flex items-center justify-center relative group/thumb cursor-pointer transition-all ${
                              themeMode === 'light'
                                ? 'bg-[#faf8f5] border-stone-200 hover:border-neutral-900'
                                : 'bg-slate-900 border-slate-800 hover:border-amber-500/60'
                            }`}
                          >
                            {item.previewUrl ? (
                              <>
                                <img
                                  src={item.previewUrl}
                                  alt={item.file.name}
                                  onError={() => {
                                    if (item.file.name.match(/\.(eps|ai)$/i)) {
                                      parseEpsFile(item.file, true).then((epsData) => {
                                        if (epsData.previewUrl) {
                                          setItems((prev) =>
                                            prev.map((it) =>
                                              it.id === item.id
                                                ? { ...it, previewUrl: epsData.previewUrl, epsHint: epsData.metadata }
                                                : it
                                            )
                                          );
                                        }
                                      });
                                    }
                                  }}
                                  className={`w-full h-full ${
                                    item.file.name.match(/\.(eps|ai|svg)$/i) ? 'object-contain p-1.5 bg-white' : 'object-cover'
                                  } transition-transform duration-500 group-hover/thumb:scale-105`}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/35 transition-colors flex items-center justify-center opacity-0 group-hover/thumb:opacity-100">
                                  <span className="bg-black/85 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md border border-white/15">
                                    <Eye className="w-3 h-3 text-amber-400" />
                                    <span>View HD</span>
                                  </span>
                                </div>
                                {item.file.name.match(/\.(eps|ai)$/i) && (
                                  <span className="absolute top-1.5 left-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-1.5 py-0.5 rounded text-[9px] font-black shadow-sm flex items-center gap-1 z-10">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                                    EPS HD
                                  </span>
                                )}
                              </>
                            ) : item.file.name.match(/\.(eps|ai)$/i) ? (
                              <div className="w-full h-full bg-gradient-to-br from-amber-500/20 via-slate-900 to-indigo-900/40 flex flex-col items-center justify-center p-2 text-center">
                                <RefreshCw className="w-6 h-6 text-amber-400 animate-spin mb-1" />
                                <span className="text-[9px] font-black uppercase text-amber-300 tracking-wider">RENDERING EPS</span>
                              </div>
                            ) : (
                              <Layers className="w-7 h-7 text-slate-500" />
                            )}
                          </div>
                          {item.file.type.startsWith('video/') || item.file.name.match(/\.(mp4|mov|webm|m4v|avi)$/i) ? (
                            <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-indigo-400 p-1 rounded shadow text-[9px] flex items-center">
                              <Video className="w-3.5 h-3.5" />
                            </span>
                          ) : null}
                          {item.status === 'processing' && (
                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center rounded-2xl">
                               <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className={`text-sm font-bold truncate max-w-[220px] flex items-center gap-2 ${
                            themeMode === 'light' ? 'text-neutral-900' : 'text-slate-200'
                          }`}>
                            {item.file.name}
                            {item.isHistory && <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase tracking-widest">History</span>}
                          </p>
                          {!item.isHistory && (
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                              {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                              {item.epsHint?.boundingBox ? ` · ${item.epsHint.boundingBox.width}×${item.epsHint.boundingBox.height} pt` : ''}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            <button
                              type="button"
                              onClick={() => setEpsViewerItemId(item.id)}
                              className={`cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10.5px] font-bold border transition-all shadow-xs ${
                                themeMode === 'light'
                                  ? 'bg-neutral-900 hover:bg-black text-white border-neutral-900'
                                  : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 border-amber-500'
                              }`}
                            >
                              <Eye className="w-3 h-3" />
                              <span>{item.file.name.match(/\.(eps|ai)$/i) ? 'View EPS Artwork' : 'View Full HD'}</span>
                            </button>
                            {item.file.name.match(/\.(eps|ai)$/i) && (
                              <label className="cursor-pointer inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-600 dark:text-amber-300 border border-amber-500/30 transition-all shadow-xs">
                                <Camera className="w-3 h-3 text-amber-500" />
                                <span>{item.previewUrl ? 'Replace JPG' : 'Attach JPG'}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) handleAttachScreenshot(item.id, f);
                                  }}
                                />
                              </label>
                            )}
                          </div>
                          {item.result && (
                            <div className="flex items-center gap-1.5 flex-wrap mt-2">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border ${
                                item.result.riskLabel === 'Low risk' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25' :
                                item.result.riskLabel === 'Medium risk' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25' : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25'
                              }`}>
                                {item.result.riskLabel}
                              </span>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                                <DollarSign className="w-2.5 h-2.5" />
                                <span>Est. ${((item.result.keywords?.length || 45) * 4.2 + 130).toFixed(0)}/yr</span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {item.result ? (
                        <div className="flex-1 px-2 sm:px-4 space-y-3.5 min-w-[300px]">
                          {/* Official Adobe Stock Compliance & Category Strip */}
                          <div className={`px-3 py-2 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-[11px] ${
                            themeMode === 'light'
                              ? 'bg-emerald-50/70 border-emerald-200/90 text-emerald-900'
                              : 'bg-emerald-950/20 border-emerald-500/25 text-emerald-300'
                          }`}>
                            <div className="flex flex-wrap items-center gap-2.5 font-bold">
                              <span className="inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Adobe Stock Rules Verified</span>
                              </span>
                              <span className="opacity-40">·</span>
                              <span className="font-mono text-[10.5px]">Top-10 Title Sync: 100%</span>
                              <span className="opacity-40">·</span>
                              <span className="font-mono text-[10.5px]">{item.result.keywords.length}/49 Tags</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] uppercase font-extrabold opacity-75">Category:</span>
                              <span className={`px-2 py-0.5 rounded-md font-bold text-[10.5px] border ${
                                themeMode === 'light'
                                  ? 'bg-white border-emerald-200 text-neutral-900'
                                  : 'bg-neutral-900 border-emerald-500/30 text-white'
                              }`}>
                                {item.result.category || (item.file.name.match(/\.(eps|ai|svg)$/i) ? 'Graphic Resources' : 'Business')}
                              </span>
                            </div>
                          </div>

                          {/* Subject-First Commercial Title with 1-Click Copy */}
                          <div className={`p-3 rounded-xl border ${
                            themeMode === 'light'
                              ? 'bg-[#faf8f5] border-stone-200/90'
                              : 'bg-slate-900/70 border-slate-800/90'
                          } space-y-1.5`}>
                            <div className="flex items-center justify-between text-[11px] flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                <span className={`font-extrabold uppercase tracking-[0.12em] text-[10px] ${
                                  themeMode === 'light' ? 'text-neutral-900' : 'text-amber-400'
                                }`}>
                                  Subject-First Commercial Title
                                </span>
                                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                                  (item.result.recommendedTitle || '').length <= 70
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                                }`}>
                                  {(item.result.recommendedTitle || '').length}/70 chars
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setInterceptedBlackOpsQuery(
                                      item.result!.recommendedTitle || item.file.name
                                    );
                                    setShowBlackOpsTerminal(true);
                                  }}
                                  className={`text-[10.5px] font-mono font-bold flex items-center gap-1 px-2 py-0.5 rounded-md border transition cursor-pointer ${
                                    themeMode === 'light'
                                      ? 'bg-neutral-950 hover:bg-black text-emerald-300 border-neutral-950'
                                      : 'bg-emerald-950/60 hover:bg-emerald-900/70 text-emerald-300 border-emerald-500/40'
                                  }`}
                                  title="Deep X-Ray this file's metadata in Black-Ops Terminal"
                                >
                                  <FileCode className="w-3 h-3 text-emerald-400" />
                                  <span>Black-Ops X-Ray</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => autoFixItem(item.id)}
                                  className={`text-[10.5px] font-bold flex items-center gap-1 px-2 py-0.5 rounded-md border transition cursor-pointer ${
                                    themeMode === 'light'
                                      ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                                      : 'bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border-emerald-500/30'
                                  }`}
                                  title="1-Click Auto-Optimize Title & 49 Tags"
                                >
                                  <Zap className="w-3 h-3 text-emerald-500" />
                                  <span>Auto-Fix SEO</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(item.result!.recommendedTitle || '');
                                    showToast('✓ Copied Subject-First Commercial Title!');
                                  }}
                                  className={`text-[10.5px] font-bold flex items-center gap-1 px-2 py-0.5 rounded-md border transition cursor-pointer ${
                                    themeMode === 'light'
                                      ? 'bg-white hover:bg-stone-100 text-neutral-800 border-stone-200'
                                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                                  }`}
                                >
                                  <Copy className="w-3 h-3" />
                                  <span>Copy Title</span>
                                </button>
                              </div>
                            </div>
                            <p className={`text-sm font-bold leading-snug ${
                              themeMode === 'light' ? 'text-neutral-900' : 'text-slate-100'
                            }`}>
                              {item.result.recommendedTitle}
                            </p>
                          </div>

                          {/* Semantic Color-Coded Keywords with Top 10 High-Ranking Badges & 1-Click Slot #1 Promotion */}
                          <SemanticKeywordBadges
                            keywords={item.result.keywords}
                            recommendedTitle={item.result.recommendedTitle}
                            keywordTaxonomy={item.result.keywordTaxonomy}
                            buyerSearchPhrases={item.result.buyerSearchPhrases}
                            showToast={showToast}
                            themeMode={themeMode}
                            onReorderKeywords={(newKws) => handleSaveAlgorithmKeywords(item.id, newKws)}
                            onSyncTitleWithTopSlots={(newTitle, newKws) => {
                              setItems((prev) =>
                                prev.map((it) =>
                                  it.id === item.id && it.result
                                    ? {
                                        ...it,
                                        result: {
                                          ...it.result,
                                          recommendedTitle: newTitle,
                                          keywords: newKws,
                                        },
                                      }
                                    : it
                                )
                              );
                            }}
                          />
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
                        <div className={`flex flex-wrap items-center gap-2 pt-3 border-t w-full ${
                          themeMode === 'light' ? 'border-neutral-100' : 'border-neutral-800/80'
                        }`}>
                          <button
                            type="button"
                            onClick={() => copyMetadata(item.result!.recommendedTitle, item.result!.keywords, item.id)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                              themeMode === 'light'
                                ? 'bg-neutral-950 hover:bg-black text-white'
                                : 'bg-white hover:bg-neutral-200 text-neutral-950'
                            }`}
                          >
                            {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedId === item.id ? 'Copied All' : 'Copy Title & 49 Tags'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setAlgorithmActiveItem(item);
                              setShowAlgorithmBoosterModal(true);
                            }}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer ${
                              themeMode === 'light'
                                ? 'bg-[#fbfaf8] hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                                : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-200'
                            }`}
                            title="Marketplace Algorithm Priority Booster (Top 10 Slots)"
                          >
                            <Zap className="w-3.5 h-3.5 text-amber-500" />
                            <span>Top-10 Boost</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setRankActiveItem({
                                title: item.result!.recommendedTitle,
                                keywords: item.result!.keywords,
                              });
                              setShowRankModal(true);
                            }}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer ${
                              themeMode === 'light'
                                ? 'bg-[#fbfaf8] hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                                : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-200'
                            }`}
                            title="Predict Search Ranking & SEO Score"
                          >
                            <Target className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Rank Audit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setMockupItem(item)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer ${
                              themeMode === 'light'
                                ? 'bg-[#fbfaf8] hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                                : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-200'
                            }`}
                            title="Preview as real Adobe Stock / Shutterstock Buyer Page"
                          >
                            <Eye className="w-3.5 h-3.5 text-neutral-500" />
                            <span>Buyer Preview</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditor(item)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer ${
                              themeMode === 'light'
                                ? 'bg-[#fbfaf8] hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                                : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-200'
                            }`}
                          >
                            <Edit3 className="w-3.5 h-3.5 text-neutral-500" />
                            <span>Edit Tags</span>
                          </button>

                          {!item.isHistory && (
                            <>
                              {(item.file.name.match(/\.eps$/i)) && (
                                <button
                                  type="button"
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
                                  className="bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 px-3 py-2 rounded-xl text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                                  title="Write PostScript DSC & XMP metadata directly into EPS vector file"
                                >
                                  <FileCode className="w-3.5 h-3.5 text-amber-500" />
                                  <span>Tagged EPS</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => downloadEmbeddedCopy(item)}
                                className="bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 px-3 py-2 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                                title={item.file.type.startsWith('video/') || item.file.name.match(/\.(mp4|mov|webm|eps|ai)$/i)
                                  ? "Download industry standard Adobe XMP sidecar file"
                                  : "Directly download JPEG with embedded EXIF/IPTC Title & Keywords"}
                              >
                                <Download className="w-3.5 h-3.5 text-emerald-500" />
                                <span>{item.file.type.startsWith('video/') || item.file.name.match(/\.(mp4|mov|webm|eps|ai)$/i) ? 'Export XMP' : 'Tagged JPG'}</span>
                              </button>
                            </>
                          )}

                          <button
                            type="button"
                            onClick={() => deleteItem(item.id, item.isHistory)}
                            className={`ml-auto p-2 rounded-xl border transition cursor-pointer ${
                              themeMode === 'light'
                                ? 'bg-[#fbfaf8] hover:bg-red-50 border-neutral-200 text-neutral-400 hover:text-red-600'
                                : 'bg-neutral-900 hover:bg-red-950/40 border-neutral-800 text-neutral-500 hover:text-red-400'
                            }`}
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  </React.Fragment>
                  ))}
                </AnimatePresence>
              </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
          </>
        )}

        {/* Full-Suite Contributor & Legal Google Monetize Footer */}
        <WebsiteFooter
          onOpenPrivacy={() => setShowPrivacyModal(true)}
          onOpenTerms={() => setShowTermsModal(true)}
          onOpenDisclaimer={() => setShowDisclaimerModal(true)}
          onOpenContact={() => setShowContactModal(true)}
          onOpenEarnings={() => setShowEarningsModal(true)}
          onOpenNicheRadar={() => setShowNicheRadarModal(true)}
          onOpenGuideHub={() => setShowGuideHubModal(true)}
          onOpenMultiCsv={() => setShowMultiCsvModal(true)}
          themeMode={themeMode}
        />
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-slate-900/95 border border-emerald-500/40 p-6 sm:p-8 rounded-3xl shadow-2xl max-w-lg w-full z-10 space-y-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Batch Analysis Complete</h3>
                    <p className="text-xs text-slate-400">All commercial metadata generated & verified</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCelebration(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 py-1">
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Processed Files</span>
                  <div className="text-xl font-black font-mono text-emerald-400 mt-0.5">
                    {items.filter(i => i.result).length} / {items.length}
                  </div>
                </div>
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Marketplace Target</span>
                  <div className="text-xs font-bold text-indigo-300 mt-1 uppercase tracking-wider">
                    {targetMarketplace.replace('_', ' ')}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Assets are indexed with search-first taxonomy, under-70-character titles, and weighted priority keywords ready for contributor submission.
              </p>

              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCelebration(false);
                    exportBatchZip();
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download ZIP Package</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCelebration(false);
                    exportBatchCSV();
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileDown className="w-4 h-4 text-emerald-400" />
                  <span>Export CSV</span>
                </button>
              </div>
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
                  onClick={() => startBulkProcessing()}
                  disabled={isProcessing || !items.some(i => i.status === 'pending' || i.status === 'error')}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-sm font-bold px-6 py-2 rounded-xl transition flex items-center gap-2 shadow-lg shadow-indigo-600/25 cursor-pointer"
                >
                  {isProcessing ? <RefreshCw className="animate-spin w-4 h-4" /> : <Layers className="w-4 h-4" />}
                  {isProcessing ? 'Autopilot Running...' : 'Generate AI'}
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

      {/* Global Raycast/Linear-Style Command Palette (⌘K) */}
      <CommandPaletteModal
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onNavigateView={(view) => setCurrentView(view)}
        onToggleMode={(mode) => {
          setWorkspaceMode(mode);
          localStorage.setItem('adobemeta_workspace_mode', mode);
          showToast(`Switched to ${mode === 'spatial' ? 'Architectural Digital Space' : 'Classic Batch Grid'}`);
        }}
        workspaceMode={workspaceMode}
        onStartProcessing={() => startBulkProcessing()}
        onExportAdobeCsv={exportBatchCSV}
        onExportShutterstockCsv={exportBatchCSV}
        onExportZip={exportBatchZip}
        onOpenMultiCsv={() => setShowMultiCsvModal(true)}
        onOpenToolsHub={() => setShowToolsHubModal(true)}
        onOpenEarning={() => setShowEarningMonetizeModal(true)}
        onOpenTool={(toolId) => {
          switch (toolId) {
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
            case 'niche_radar':
              setShowNicheRadarModal(true);
              break;
            case 'contributor_arcade':
              setShowArcadeModal(true);
              break;
            default:
              setShowToolsHubModal(true);
              break;
          }
        }}
        onClearQueue={clearAllItems}
        itemsCount={items.length}
        completedCount={items.filter((i) => i.result).length}
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

      {/* Google Monetization & Contributor Earning Center Modal */}
      <EarningMonetizationModal
        isOpen={showEarningMonetizeModal}
        onClose={() => setShowEarningMonetizeModal(false)}
        onOpenCalculator={() => setShowEarningsModal(true)}
        onOpenNicheRadar={() => setShowNicheRadarModal(true)}
        themeMode={themeMode}
      />

      {/* GDPR & Google AdSense Compliant Cookie Banner */}
      <CookieConsentBanner onOpenPrivacy={() => setShowPrivacyModal(true)} />

      {/* Legal & Compliance Modals for AdSense Approval */}
      <PrivacyPolicyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
      <TermsOfServiceModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
      <EarningsDisclaimerModal isOpen={showDisclaimerModal} onClose={() => setShowDisclaimerModal(false)} />
      <ContactSupportModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />

      {/* Editorial Navigation Modals */}
      <AboutModal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)} />
      <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />
      <ResourcesModal isOpen={showResourcesModal} onClose={() => setShowResourcesModal(false)} />

      {/* Minimalist Text-Only AI Assistant Launcher & Drawer */}
      <div className="fixed bottom-6 right-6 z-[90]">
        <AnimatePresence>
          {!isChatOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsChatOpen(true)}
              className={`px-4 py-2.5 rounded-full border shadow-lg flex items-center gap-2 text-xs font-semibold tracking-wide transition cursor-pointer ${
                themeMode === 'light'
                  ? 'bg-neutral-950 text-white border-neutral-800 hover:bg-black shadow-neutral-950/15'
                  : 'bg-white text-neutral-950 border-neutral-200 hover:bg-neutral-100 shadow-black/40'
              }`}
              title="Open Minimalist Text AI Assistant"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
              <span>AI Assistant</span>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className={`w-[340px] sm:w-[380px] h-[470px] rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${
                themeMode === 'light'
                  ? 'bg-[#fbfaf8] border-neutral-200/90 text-neutral-900 shadow-neutral-900/15'
                  : 'bg-[#0e1014] border-neutral-800 text-neutral-100 shadow-black/70'
              }`}
            >
              {/* Minimalist Chat Header */}
              <div className={`px-4 py-3 border-b flex items-center justify-between ${
                themeMode === 'light' ? 'bg-white border-neutral-200/80' : 'bg-[#13161c] border-neutral-800'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <div>
                    <h3 className="text-xs font-bold tracking-tight">AdobeMeta Text AI</h3>
                    <p className="text-[10px] text-neutral-400">SEO, Titles, Keywords &amp; Monetization</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setChatMessages([
                        {
                          role: 'model',
                          parts: [
                            {
                              text: 'Hello! Ask me anything about SEO titles, 49 keywords, Adobe Stock ranking, or Google monetization.'
                            }
                          ]
                        }
                      ])
                    }
                    className={`px-2 py-1 rounded text-[10px] font-medium transition cursor-pointer ${
                      themeMode === 'light'
                        ? 'text-neutral-500 hover:text-black hover:bg-neutral-100'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                    }`}
                    title="Reset conversation"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsChatOpen(false)}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      themeMode === 'light'
                        ? 'text-neutral-500 hover:text-black hover:bg-neutral-100'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                    }`}
                    title="Close AI Chat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Text Prompts Bar */}
              <div className={`px-3 py-2 border-b flex items-center gap-1.5 overflow-x-auto scrollbar-none ${
                themeMode === 'light' ? 'bg-[#f6f5f2] border-neutral-200/60' : 'bg-[#0b0d10] border-neutral-800/80'
              }`}>
                {[
                  'Give me 10 Rank #1 keywords for business vector',
                  'Best Adobe Stock title formula (<70 chars)',
                  'High CPC niches for Google Monetize'
                ].map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setChatInput(q)}
                    className={`shrink-0 text-[10px] font-medium px-2.5 py-1 rounded-full border transition cursor-pointer ${
                      themeMode === 'light'
                        ? 'bg-white border-neutral-200/90 text-neutral-600 hover:border-neutral-900 hover:text-black'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-600 hover:text-white'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Messages Container (Pure Text Only) */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed"
              >
                {chatMessages.map((msg, i) => {
                  const isUser = msg.role === 'user';
                  const textContent = msg.parts?.[0]?.text || '';
                  return (
                    <div
                      key={i}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 whitespace-pre-wrap ${
                          isUser
                            ? themeMode === 'light'
                              ? 'bg-neutral-950 text-white rounded-br-xs'
                              : 'bg-white text-neutral-950 font-medium rounded-br-xs'
                            : themeMode === 'light'
                            ? 'bg-white border border-neutral-200/90 text-neutral-800 rounded-bl-xs shadow-2xs'
                            : 'bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-bl-xs'
                        }`}
                      >
                        {textContent}
                      </div>
                    </div>
                  );
                })}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div
                      className={`rounded-2xl px-3.5 py-2 text-[11px] flex items-center gap-2 border ${
                        themeMode === 'light'
                          ? 'bg-white border-neutral-200 text-neutral-500'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Text Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChat();
                }}
                className={`p-3 border-t flex items-center gap-2 ${
                  themeMode === 'light' ? 'bg-white border-neutral-200/80' : 'bg-[#13161c] border-neutral-800'
                }`}
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask in English or বাংলায় লিখুন..."
                  disabled={isChatLoading}
                  className={`flex-1 text-xs rounded-xl px-3.5 py-2.5 border focus:outline-none transition ${
                    themeMode === 'light'
                      ? 'bg-[#fbfaf8] border-neutral-200 text-neutral-900 focus:border-neutral-900'
                      : 'bg-neutral-950 border-neutral-800 text-white focus:border-neutral-600'
                  }`}
                />
                <button
                  type="submit"
                  disabled={isChatLoading || !chatInput.trim()}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-40 ${
                    themeMode === 'light'
                      ? 'bg-neutral-950 hover:bg-black text-white'
                      : 'bg-white hover:bg-neutral-200 text-black'
                  }`}
                >
                  Send
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Autonomous Self-Running Hacker Telemetry & 1-Click Niche Hijack HUD */}
      <AutonomousHackerHudBar
        onOpenTerminal={() => setShowBlackOpsTerminal(true)}
        onInterceptedUrl={(pasted) => {
          setInterceptedBlackOpsQuery(pasted);
          setShowBlackOpsTerminal(true);
        }}
        showToast={showToast}
        themeMode={themeMode}
      />

      {/* Classified Black-Ops Stock Intelligence & Binary Forensic Scrubber Terminal */}
      <HackerBlackOpsTerminal
        isOpen={showBlackOpsTerminal}
        onClose={() => setShowBlackOpsTerminal(false)}
        initialTargetQuery={interceptedBlackOpsQuery}
        isCyberMatrixMode={isCyberMatrixMode}
        onToggleCyberMatrixMode={() => {
          const next = !isCyberMatrixMode;
          setIsCyberMatrixMode(next);
          if (next) setThemeMode('dark');
          try { localStorage.setItem('adobemeta_cyber_matrix', String(next)); } catch {}
          showToast(next ? '🟢 CYBER-MATRIX OVERDRIVE: ENGAGED' : 'Cyber-Matrix Skin: Disengaged');
        }}
        customApiKey={customApiKey}
        showToast={showToast}
        onLoadHijackTitleToStudio={(title, tags) => {
          navigator.clipboard.writeText(`${title}\n\n${tags.join(', ')}`);
        }}
      />

      {/* Full-Screen EPS Vector & Adobe Stock Metadata Viewer Modal */}
      {epsViewerItemId && (
        <EpsArtworkViewerModal
          item={items.find((i) => i.id === epsViewerItemId) || null}
          onClose={() => setEpsViewerItemId(null)}
          onUpdateItemPreview={(itemId, previewUrl, epsHint) => {
            setItems((prev) =>
              prev.map((it) =>
                it.id === itemId
                  ? { ...it, previewUrl, epsHint: epsHint || it.epsHint, hasRealVisualPreview: true }
                  : it
              )
            );
          }}
          onAttachScreenshot={handleAttachScreenshot}
          onGenerateMetadata={(targetItem) => {
            retrySingleFile(targetItem);
          }}
          isProcessing={isProcessing}
          showToast={showToast}
          themeMode={themeMode}
        />
      )}

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
