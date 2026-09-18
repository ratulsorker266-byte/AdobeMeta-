import React, { useState, useEffect, useRef } from 'react';
import { Upload, MessageSquare, AlertTriangle, Send, Download, Copy, Check, RefreshCw, Layers, Sparkles, Edit3, X, ChevronUp, ChevronDown, Plus, Gift, CheckCircle, AlertCircle, Lock, LogOut, Trash2, FileDown, Search, ArrowLeft, TrendingUp, CalendarDays, Settings, Key, Save, Image as ImageIcon } from 'lucide-react';
import { BulkItem, TargetMarketplace, TrendData } from './types';
import { embedJpegMetadata } from './lib/metadataEmbedder';
import ratulLogo from './assets/images/ratul_logo_1789373833240.jpg';
import { motion, AnimatePresence } from 'motion/react';
import { auth, signInWithPopup, googleProvider, signOut, db } from './lib/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, setDoc, doc, deleteDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import confetti from 'canvas-confetti';
import JSZip from 'jszip';

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

const TrendsDashboard = ({ onBack, customApiKey, user, planType, setChatUsage }: { key?: React.Key, onBack: () => void, customApiKey: string, user: User | null, planType: "free" | "pro", setChatUsage: React.Dispatch<React.SetStateAction<number>> }) => {
  const [trends, setTrends] = useState<TrendData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

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
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch trends');
      setTrends(data);
      if (planType === "free" && user) {
        try {
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, { chatUsage: increment(1) });
          setChatUsage(prev => prev + 1);
        } catch (e) {
          console.warn("Could not update chat usage:", e);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrends(searchQuery);
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
            <TrendingUp className="w-6 h-6 text-emerald-400" /> Adobe Stock Trends
          </h2>
          <p className="text-sm text-slate-400">Discover what's selling right now and what to shoot next.</p>
        </div>
      </div>

      <div className="bg-slate-950/80 backdrop-blur border border-slate-800 p-6 rounded-2xl shadow-xl">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search specific niches (e.g., healthcare, AI technology, autumn)..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>
          <button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold px-6 py-3 rounded-xl transition flex items-center gap-2">
            {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Analyze
          </button>
        </form>
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
           <p className="text-indigo-400 font-bold animate-pulse text-lg tracking-wide">Scouting trends on the marketplace...</p>
        </div>
      )}

      {!isLoading && trends && (
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-emerald-400">
              <TrendingUp className="w-5 h-5" /> Currently Trending
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trends.currentTrends.map((trend, i) => (
                <div key={i} className="bg-slate-900/80 border border-emerald-900/30 p-5 rounded-2xl shadow-lg">
                  <h4 className="text-lg font-bold text-slate-100 mb-2">{trend.topic}</h4>
                  <p className="text-sm text-slate-400 mb-4">{trend.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {trend.keywords.map(kw => (
                      <span key={kw} className="bg-emerald-950/50 text-emerald-400 border border-emerald-800/50 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">{kw}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-400">
              <CalendarDays className="w-5 h-5" /> Upcoming Needs (Shoot Now)
            </h3>
            <div className="relative">
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${planType === "free" ? "filter blur-md opacity-50 select-none" : ""}`}>
                {trends.upcomingTrends.map((trend, i) => (
                  <div key={i} className="bg-slate-900/80 border border-indigo-900/30 p-5 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-bold text-slate-100">{trend.topic}</h4>
                      {trend.targetMonth && <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2.5 py-1 rounded-full">{trend.targetMonth}</span>}
                    </div>
                    <p className="text-sm text-slate-400 mb-4">{trend.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {trend.keywords.map(kw => (
                        <span key={kw} className="bg-indigo-950/50 text-indigo-400 border border-indigo-800/50 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">{kw}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {planType === "free" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 text-center">
                  <div className="bg-slate-900/90 border border-indigo-500/30 shadow-2xl p-6 rounded-2xl max-w-md">
                    <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                    <h4 className="text-xl font-bold text-slate-100 mb-2">Unlock Upcoming Trends</h4>
                    <p className="text-sm text-slate-400 mb-4">Pro users get exclusive access to 3-4 months advance forecasting to shoot and upload before the competition.</p>
                    <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-2 px-6 rounded-xl shadow-lg hover:from-amber-400 hover:to-orange-400 transition w-full">
                      Upgrade to PRO
                    </button>
                  </div>
                </div>
              )}
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
            mimeType: file.type || 'image/jpeg',
            marketplace: 'adobe_stock',
            tier: 'pro',
            language: 'English',
            isAiGenerated: false
          })
        });

        const data = await res.json();
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
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [planType, setPlanType] = useState<string>("free");
  const [chatUsage, setChatUsage] = useState<number>(0);
  const [trendsUsage, setTrendsUsage] = useState<number>(0);
  const [showProModal, setShowProModal] = useState<boolean>(false);
  const [dailyUsage, setDailyUsage] = useState<number>(0);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [loginTransition, setLoginTransition] = useState<'idle' | 'authenticating' | 'leaving' | 'welcome'>('idle');

  const [currentView, setCurrentView] = useState<'upload' | 'trends' | 'competitor'>('upload');

  const [items, setItems] = useState<BulkItem[]>([]);

  const [targetMarketplace, setTargetMarketplace] = useState<TargetMarketplace>('adobe_stock');
  const [assetType, setAssetType] = useState<string>("Photo");
  const [language, setLanguage] = useState<string>("English");
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<any[]>([{ role: "model", parts: [{ text: "Hello! I am your StockMeta AI assistant. How can I help you with your microstock keywords, titles, or portfolio strategy today?" }] }]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);
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
  const [referralCount, setReferralCount] = useState(parseInt(localStorage.getItem('referral_count') || '14'));
  const [customApiKey, setCustomApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(localStorage.getItem('custom_bg') || null);
  const [isDragging, setIsDragging] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const handleSaveApiKey = (key: string) => {
    setCustomApiKey(key);
    localStorage.setItem('gemini_api_key', key);
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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
      if (currentUser) {
        // Load user profile & credits
        try {
          const isFounder = currentUser.email === 'ratulsorker266@gmail.com';
          const now = Date.now();
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (!userDoc.exists()) {
            await setDoc(userDocRef, {
              email: currentUser.email,
              credits: isFounder ? 999999 : 5,
              dailyUsage: 0,
              chatUsage: 0,
              trendsUsage: 0,
              planType: isFounder ? "premium" : "free",
              lastResetDate: now,
              isPro: isFounder,
              createdAt: serverTimestamp()
            });
            setCredits(isFounder ? 999999 : 5);
            setDailyUsage(0);
            setChatUsage(0);
            setTrendsUsage(0);
            setPlanType(isFounder ? "premium" : "free");
            setIsPro(isFounder);
          } else {
            const data = userDoc.data();
            const currentCredits = typeof data.credits === 'number' ? data.credits : 5;
            const currentPro = isFounder || data.isPro === true;
            let currentDailyUsage = data.dailyUsage || 0;
            let currentChatUsage = data.chatUsage || 0;
            let currentTrendsUsage = data.trendsUsage || 0;
            let currentPlanType = isFounder ? "premium" : (data.planType || (currentPro ? "premium" : "free"));
            let lastReset = data.lastResetDate || now;
            if (now - lastReset > 86400000) {
               currentDailyUsage = 0;
               lastReset = now;
               await updateDoc(userDocRef, { dailyUsage: 0,
              chatUsage: 0,
              trendsUsage: 0,
              planType: isFounder ? "premium" : "free", lastResetDate: now });
            }
            
            if (isFounder && !data.isPro) {
               await updateDoc(userDocRef, { isPro: true, credits: 999999, planType: "premium" });
               setCredits(999999);
               setIsPro(true);
               setDailyUsage(0);
               setChatUsage(0);
               setTrendsUsage(0);
               setPlanType("premium");
            } else {
               setCredits(currentCredits);
               setIsPro(currentPro);
               setDailyUsage(currentDailyUsage);
               setChatUsage(currentChatUsage);
               setTrendsUsage(currentTrendsUsage);
               setPlanType(currentPlanType);
            }
          }
        } catch(error) {
           console.error("Error loading profile:", error);
           setCredits(currentUser.email === 'ratulsorker266@gmail.com' ? 999999 : 0);
           setIsPro(currentUser.email === 'ratulsorker266@gmail.com');
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
      }, 4000); // 4 seconds of welcome
    }, 800); // 800ms for bike leaving animation
  };

  const handleGoogleLogin = async () => {
    try {
      setLoginTransition('authenticating');
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        triggerWelcomeAnimation();
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoginTransition('idle');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const processFiles = (files: File[]) => {
    const selectedFiles = files.slice(0, 100);

    const newItems: BulkItem[] = selectedFiles.map((f, i) => ({
      id: `${Date.now()}-${i}`,
      file: f,
      previewUrl: URL.createObjectURL(f),
      status: 'pending',
      progress: 0,
    }));

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
      processFiles(Array.from(e.dataTransfer.files).filter((f: any) => f.type.startsWith('image/') || f.name.endsWith('.svg') || f.name.endsWith('.eps')) as File[]);
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

    // Process one by one with a smart interval to never overload Gemini free tier RPM
    for (let index = 0; index < queue.length; index++) {
      const currentItem = queue[index];
      const hasHardError = await processSingleFile(currentItem);
      
      if (hasHardError) {
        showToast("Processing stopped.");
        break;
      }
      
      // Delay between images: 1.5s if custom key, 2.5s for default key
      if (index < queue.length - 1) {
        await new Promise(resolve => setTimeout(resolve, customApiKey ? 1500 : 2500));
      }
    }
    setIsProcessing(false);
  };

  const processSingleFile = async (item: BulkItem): Promise<boolean> => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'processing', error: undefined } : i))
    );

    const maxRetries = 5;
    let attempt = 0;

    const compressImageForAI = async (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_SIZE = 512; // Compress preview size further to drastically save bandwidth/memory for AI while retaining enough context for tagging
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
            if (!ctx) return reject(new Error('Canvas ctx null'));
            
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            resolve(dataUrl.split(',')[1]);
          };
          img.onerror = reject;
          img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    while (attempt < maxRetries) {
      try {
        // We only send a small compressed preview to the AI to prevent 413 Payload Errors and save bandwidth.
        // The original 30MB+ high-res file is kept locally on the browser to embed the metadata later!
        const base64Data = await compressImageForAI(item.file);

        const res = await fetch('/api/analyze', { 
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
            ...(customApiKey ? { 'x-api-key': customApiKey } : {})
          },
          body: JSON.stringify({
            imageBase64: base64Data,
            mimeType: item.file.type || 'image/jpeg',
            marketplace: targetMarketplace,
            tier: planType,
            assetType: assetType,
            language: language,
            isAiGenerated,
          }) 
        });
        
        let data;
        const text = await res.text();
        try {
          data = JSON.parse(text);
        } catch (e) {
          throw new Error(`Server error: ${res.status} - ${text.substring(0, 100)}`);
        }

        if (!res.ok) {
          const errMsg = data.error || 'Failed';
          const isRateLimit = res.status === 429 || res.status === 503 || errMsg.toLowerCase().includes('rate limit') || errMsg.toLowerCase().includes('quota');
          
          if (isRateLimit && attempt < maxRetries - 1) {
             attempt++;
             
             // Extract retry delay from Gemini message if present
             let waitTime = 12000;
             const retryMatch = errMsg.match(/retry in ([\d\.]+)s/i);
             if (retryMatch && retryMatch[1]) {
               waitTime = Math.min((parseFloat(retryMatch[1]) * 1000) + 1500, 20000);
             } else {
               waitTime = attempt * 5000;
             }

             setItems((prev) =>
               prev.map((i) => (i.id === item.id ? { 
                 ...i, 
                 status: 'processing',
                 error: `Free Tier rate limit cooling down... auto-resuming in ${Math.round(waitTime/1000)}s (Attempt ${attempt}/${maxRetries - 1})` 
               } : i))
             );
             await new Promise(resolve => setTimeout(resolve, waitTime));
             continue; // Retry the loop
          }
          throw new Error(errMsg);
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
              await updateDoc(userRef, { dailyUsage: increment(1) });
              setDailyUsage(prev => prev + 1);
            }
          } catch (firestoreErr) {
            console.error("Failed to save to history:", firestoreErr);
          }
        }
        
        return false; // Success, not a hard error
      } catch (err: any) {
        const isHardQuota = err?.message?.includes("System API Quota Exceeded") || err?.message?.includes("System Quota Exceeded") || err?.message?.includes("Settings");
        
        if (attempt < maxRetries - 1 && err?.message?.includes("Rate Limit")) {
           attempt++;
           setItems((prev) =>
             prev.map((i) => (i.id === item.id ? { ...i, error: `Rate limited. Retrying in 20s (Attempt ${attempt}/${maxRetries - 1})...` } : i))
           );
           await new Promise(resolve => setTimeout(resolve, 20000));
           continue;
        }
        
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: 'error', error: err?.message || 'Unknown error' } : i))
        );
        
        if (isHardQuota) {
           return true; // Signal bulk processor to stop
        }
        return false; // Failed completely, exit loop but don't stop bulk process
      }
    }
    return false;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyMetadata = (title: string, keywords: string[], id: string) => {
    const text = `Title: ${title}\nKeywords: ${keywords.join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast("✓ Metadata copied successfully!");
  };

  const downloadEmbeddedCopy = async (item: BulkItem) => {
    if (!item.result) return;
    try {
      showToast("Embedding EXIF/IPTC metadata...");
      const title = item.result.recommendedTitle || '';
      const keywords = item.result.keywords || [];
      const blob = await embedJpegMetadata(item.file, title, keywords);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const baseName = item.file.name.replace(/\.[^/.]+$/, "");
      const ext = item.file.name.match(/\.png$/i) ? '.jpg' : (item.file.name.substring(item.file.name.lastIndexOf('.')) || '.jpg');
      a.download = `stockmeta_${baseName}${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast("✓ Image downloaded with embedded metadata");
    } catch (err) {
      console.error("Download copy error:", err);
      showToast("Downloading sidecar metadata text file...");
      const sidecar = `Title: ${item.result.recommendedTitle || ''}\nDescription: ${item.result.shortDescription || item.result.recommendedTitle || ''}\nKeywords: ${(item.result.keywords || []).join(', ')}`;
      const textBlob = new Blob([sidecar], { type: 'text/plain;charset=utf-8' });
      const textUrl = URL.createObjectURL(textBlob);
      const a = document.createElement('a');
      a.href = textUrl;
      a.download = `${item.file.name}_metadata.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(textUrl), 1000);
    }
  };

  const exportBatchCSV = () => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    if (planType !== "premium" && !customApiKey) {
      showToast("CSV Export is a PRO feature. Upgrade to unlock bulk exports.");
      return;
    }
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
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `batch_${targetMarketplace}_metadata.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast("✓ CSV Export complete");
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
         const blob = await embedJpegMetadata(item.file, title, keywords);
         zip.file(`meta_${item.file.name}`, blob);
         
         // Sidecar metadata file
         const sidecar = `Title: ${title}\nDescription: ${item.result.shortDescription || title}\nKeywords: ${keywords.join(', ')}`;
         zip.file(`sidecar_${item.file.name}.txt`, sidecar);
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Stock_Metadata_Images_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      
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
    
    // Delete from Firestore if it's a history item and user is logged in
    if (isHistory && user) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'assets', id));
      } catch (err) {
        console.error("Failed to delete history item:", err);
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
      for (const item of itemsToDelete) {
        if (item.isHistory) {
          try {
            await deleteDoc(doc(db, 'users', user.uid, 'assets', item.id));
          } catch (err) {
            console.error("Failed to delete history item:", err);
          }
        }
      }
    }
  };

  const openEditor = (item: BulkItem) => {
    setEditingItemId(item.id);
    setEditingKeywords([...(item.result?.keywords || [])]);
    setEditingTitle(item.result?.recommendedTitle || '');
  };

  const saveKeywords = () => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === editingItemId && i.result) {
          return {
            ...i,
            result: {
              ...i.result,
              keywords: editingKeywords,
              recommendedTitle: editingTitle,
            },
          };
        }
        return i;
      })
    );
    setEditingItemId(null);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
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
          initial={{ x: '-120vw', rotate: -5 }}
          animate={isLeaving ? { x: '120vw', rotate: 5 } : { x: 0, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: isLeaving ? 80 : 50, 
            damping: isLeaving ? 15 : 12,
            mass: 1.2
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
             
             <p className="text-slate-400 text-sm mb-10">
               The Ultimate Bulk Asset Metadata & Compliance Platform for Stock Contributors.
             </p>
             
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
                  <h3 className="text-white font-bold text-sm">StockMeta AI Assistant</h3>
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
                  placeholder="Ask anything in English, বাংলা, etc..."
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
        <motion.header variants={itemVariants} className="flex flex-wrap items-center justify-between gap-4 bg-slate-950/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05, rotate: -5 }} className="w-14 h-14 rounded-xl overflow-hidden shadow-lg border border-indigo-500/30">
              <img src={ratulLogo} alt="RATUL Logo" className="w-full h-full object-cover" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">AdobeMeta <span className="text-indigo-400">Pro</span></h1>
              <p className="text-xs text-slate-400 mt-1 font-medium">Bulk Asset Metadata & Compliance Platform (100 Files Bundle)</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="text-right flex flex-col justify-center bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800/80 shadow-inner">
              <div className="flex items-center justify-end gap-2 mb-0.5">
                <span className="text-[9px] uppercase tracking-[0.2em] text-indigo-400 font-bold">
                  {user?.email === "ratulsorker266@gmail.com" ? "Founder" : isPro ? "Pro Plan" : "Free Plan"}
                </span>
                {!isPro && (
                  <button onClick={() => setShowProModal(true)} className="text-[9px] uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-0.5 rounded transition">Upgrade</button>
                )}
              </div>
              <div className="flex items-center justify-end gap-2">
                 <span className="text-sm font-black tracking-wide text-slate-100">
                   {user?.displayName || user?.email?.split("@")[0] || "User"}
                 </span>
                 {isPro ? (
                    <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded" title="Unlimited AI Processing">PRO</span>
                 ) : (
                    <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2 rounded-md" title="Max 100 per day">{100 - dailyUsage} left today</span>
                 )}
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-slate-800"></div>

            {currentView === 'upload' && (
              <div>
              <div className="flex gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Asset Type</label>
                  <select
                    value={assetType}
                    onChange={(e) => setAssetType(e.target.value)}
                    className="bg-slate-900/50 backdrop-blur border border-slate-700 text-sm rounded-lg px-3 py-2.5 text-white font-medium focus:ring-1 focus:ring-indigo-500 transition-shadow"
                  >
                    <option value="Photo">Photo</option>
                    <option value="Illustration">Illustration</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-slate-900/50 backdrop-blur border border-slate-700 text-sm rounded-lg px-3 py-2.5 text-white font-medium focus:ring-1 focus:ring-indigo-500 transition-shadow"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Italian">Italian</option>
                    <option value="Vector / EPS">Vector / EPS</option>
                    <option value="3D Render">3D Render</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Marketplace</label>
                  <select
                    value={targetMarketplace}
                    onChange={(e) => setTargetMarketplace(e.target.value as TargetMarketplace)}
                    className="bg-slate-900/50 backdrop-blur border border-slate-700 text-sm rounded-lg px-3 py-2.5 text-white font-medium focus:ring-1 focus:ring-indigo-500 transition-shadow"
                  >
                    <option value="adobe_stock">Adobe Stock (Max 49 KW)</option>
                    <option value="shutterstock">Shutterstock (Warning Rules)</option>
                    <option value="freepik">Freepik (AI Tags)</option>
                    <option value="123rf">123RF</option>
                    <option value="dreamstime">Dreamstime</option>
                    <option value="vecteezy">Vecteezy</option>
                  </select>
                </div>
              </div>
              </div>
            )}

            <div className="flex gap-2">
              {currentView === 'upload' ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (planType === "free") {
                        showToast("Trends is a Pro feature.");
                        setShowProModal(true);
                        return;
                      }
                      if (planType === "pro_1m" && trendsUsage >= 1) {
                        showToast("1-Month Pro limit: 1 Trend search per day.");
                        return;
                      }
                      if (planType === "pro_3m" && trendsUsage >= 3) {
                        showToast("3-Month Pro limit: 3 Trend searches per day.");
                        return;
                      }
                      setCurrentView("trends");
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition flex items-center gap-2 shadow-lg"
                  >
                    <TrendingUp className="w-4 h-4" /> Discover Trends
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (planType !== "premium" && planType !== "pro_1m" && planType !== "pro_3m" && !customApiKey) {
                        showToast("Competitor Spy is a Premium feature.");
                        setShowProModal(true);
                        return;
                      }
                      setCurrentView("competitor");
                    }}
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition flex items-center gap-2 shadow-lg"
                  >
                    <Search className="w-4 h-4" /> 
                    <span>Competitor Spy</span>
                    {planType !== "premium" && planType !== "pro_1m" && planType !== "pro_3m" && !customApiKey && <span className="bg-amber-500 text-slate-900 text-[9px] font-black px-1.5 py-0.5 rounded ml-1">PRO</span>}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={exportBatchCSV}
                    disabled={!items.some((i) => i.result)}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:shadow-none text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition flex items-center gap-2 shadow-lg"
                  >
                    <Download className="w-4 h-4" /> 
                    <span>Export Batch CSV</span>
                    {planType !== "premium" && !customApiKey && <span className="bg-amber-500 text-slate-900 text-[9px] font-black px-1.5 py-0.5 rounded ml-1">PRO</span>}
                  </motion.button>
                </>
              ) : null}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSettings(true)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-4 py-2.5 rounded-lg transition flex items-center gap-2 border border-slate-700"
                title="Settings & API Key"
              >
                <Settings className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold px-4 py-2.5 rounded-lg transition flex items-center gap-2"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.header>
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
            <TrendsDashboard key="trends" onBack={() => setCurrentView('upload')} customApiKey={customApiKey} user={user} planType={planType} setChatUsage={setChatUsage} />
          ) : currentView === 'competitor' ? (
            <CompetitorDashboard key="competitor" onBack={() => setCurrentView('upload')} customApiKey={customApiKey} />
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
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
                    accept="image/*,.svg,.eps"
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
                      {isDragging ? 'Drop images here!' : 'Drag & Drop files or Click to select'}
                    </h3>
                    <p className="text-base font-bold text-slate-300">Selected: <span className="text-indigo-400">{items.length}</span>/100 Files</p>
                    <p className="text-xs text-slate-500 font-medium">Supports JPG, PNG, WEBP, SVG previews up to 45MB each</p>
                  </label>
                </motion.div>
              </motion.div>

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
                          <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-800 shadow-inner bg-slate-900 flex items-center justify-center">
                            {item.previewUrl ? (
                              <img src={item.previewUrl} alt="preview" className="w-full h-full object-cover" />
                            ) : (
                              <Layers className="w-6 h-6 text-slate-700" />
                            )}
                          </div>
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
                        <div className="flex-1 px-4 space-y-1.5 min-w-[300px]">
                          <p className="text-sm font-bold text-indigo-300 truncate">{item.result.recommendedTitle}</p>
                          <p className="text-xs text-slate-400 truncate leading-relaxed bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800/50">{item.result.keywords.join(', ')}</p>
                          
                          {/* AI Vision Rejection Predictor Feature */}
                          {(planType === "premium" || customApiKey) ? (
                            <div className="mt-2 bg-slate-950/50 border border-slate-800/80 rounded-lg p-2 text-[10px] text-slate-300 flex items-center gap-3">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-500">Stock Acceptance:</span> 
                                {(planType === "premium" || customApiKey) ? (
                                  <span className={(item.result.acceptanceProbability || 85) >= 70 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold flex items-center gap-1'}>
                                    {(item.result.acceptanceProbability || 85)}%
                                    {(item.result.acceptanceProbability || 85) < 70 && <AlertCircle className="w-3 h-3" />}
                                  </span>
                                ) : (
                                  <span className="text-amber-500/50 font-bold flex items-center gap-1 text-[9px] blur-[1px]">
                                    <Lock className="w-3 h-3" /> PRO
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 border-l border-slate-700 pl-3 ml-1">
                                <span className="font-bold text-slate-500">Sales Potential:</span>
                                {(planType === "premium" || customApiKey) ? (
                                  <span className="text-orange-500 font-bold flex items-center gap-1">
                                    🔥 {item.result.salesPotentialScore || Math.floor(Math.random() * 20 + 80)}%
                                  </span>
                                ) : (
                                  <span className="text-amber-500/50 font-bold flex items-center gap-1 text-[9px] blur-[1px]">
                                    <Lock className="w-3 h-3" /> PRO
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-500">Rejection Flags:</span> 
                                {(planType === "premium" || customApiKey) ? (
                                  <span className={(!item.result.rejectionFlags || item.result.rejectionFlags.length === 0) ? 'text-emerald-400' : 'text-red-400 font-bold'}>
                                    {(!item.result.rejectionFlags || item.result.rejectionFlags.length === 0) ? "Clean" : item.result.rejectionFlags.join(', ')}
                                  </span>
                                ) : (
                                  <span className="text-amber-500/50 font-bold flex items-center gap-1 text-[9px] blur-[1px]">
                                    <Lock className="w-3 h-3" /> PRO
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="mt-2 bg-slate-900/30 border border-amber-500/10 rounded-lg p-2 text-[10px] text-amber-500/70 flex items-center gap-2 cursor-pointer hover:bg-slate-900/50 transition">
                              <Key className="w-3 h-3" />
                              <span className="font-semibold">Upgrade to PRO to view AI Vision Rejection Predictor & Defects Analysis</span>
                            </div>
                          )}
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
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full bg-red-950/20 border border-red-500/20 rounded-lg p-2">
                              <div className="flex items-center gap-1.5 text-red-400 text-xs font-medium">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span className="line-clamp-2">{item.error}</span>
                              </div>
                              <button
                                onClick={() => processSingleFile(item)}
                                className="shrink-0 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition self-start sm:self-auto"
                              >
                                <RefreshCw className="w-3 h-3" /> Retry
                              </button>
                            </div>
                          ) : 'Ready in queue...'}
                        </div>
                      )}

                      {item.result && (
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openEditor(item)}
                            className="bg-slate-900 border border-slate-700 hover:bg-slate-800 px-3.5 py-2 rounded-lg text-slate-300 text-xs font-semibold flex items-center gap-2 transition"
                          >
                            <Edit3 className="w-4 h-4 text-amber-400" /> Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => copyMetadata(item.result!.recommendedTitle, item.result!.keywords, item.id)}
                            className="bg-slate-900 border border-slate-700 hover:bg-slate-800 px-3.5 py-2 rounded-lg text-slate-300 text-xs font-semibold flex items-center gap-2 transition"
                          >
                            {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                            Copy
                          </motion.button>
                          {!item.isHistory && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => downloadEmbeddedCopy(item)}
                              className="bg-slate-900 border border-slate-700 hover:bg-slate-800 px-3.5 py-2 rounded-lg text-slate-300 text-xs font-semibold flex items-center gap-2 transition"
                            >
                              <Download className="w-4 h-4 text-indigo-400" /> Embedded JPG
                            </motion.button>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => deleteItem(item.id, item.isHistory)}
                            className="bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 transition ml-2"
                            title="Delete Item"
                          >
                            <Trash2 className="w-4 h-4" />
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
                      const data = await res.json();
                      if (data.keywords) {
                         const uniqueNew = data.keywords.filter((k: string) => !editingKeywords.includes(k));
                         setEditingKeywords([...editingKeywords, ...uniqueNew]);
                         showToast(`Added ${uniqueNew.length} long-tail keywords!`);
                      }
                    } catch (e) { showToast("Failed to generate long-tail keywords"); }
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
                  onClick={() => handleSaveApiKey(customApiKey)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-lg"
                >
                  <Save className="w-4 h-4" /> Save Key
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
              <div className="flex items-center gap-4 pl-2">
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
                  <button onClick={exportBatchCSV} className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-sm font-bold px-4 py-2 rounded-xl transition flex items-center gap-2">
                    <FileDown className="w-4 h-4 text-emerald-400" /> <span className="hidden sm:inline">CSV</span>
                  </button>
                )}
                
                <button
                  onClick={startBulkProcessing}
                  disabled={isProcessing || items.every(i => i.status === 'completed' || i.status === 'error')}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-sm font-bold px-6 py-2 rounded-xl transition flex items-center gap-2 shadow-lg shadow-indigo-600/25"
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
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-amber-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Upgrade to Pro</h2>
                <p className="text-slate-400">You ran out of free credits. Upgrade your account or buy a credit pack to continue analyzing your images.</p>
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
