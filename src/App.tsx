import React, { useState, useEffect } from 'react';
import { Upload, Download, Copy, Check, RefreshCw, Layers, Sparkles, Edit3, X, ChevronUp, ChevronDown, Plus, LogOut, Trash2, FileDown, Search, ArrowLeft, TrendingUp, CalendarDays, Settings, Key, Save, Image as ImageIcon } from 'lucide-react';
import { BulkItem, TargetMarketplace, TrendData } from './types';
import { embedJpegMetadata } from './lib/metadataEmbedder';
import ratulLogo from './assets/images/ratul_logo_1789373833240.jpg';
import { motion, AnimatePresence } from 'motion/react';
import { auth, signInWithPopup, googleProvider, signOut, db } from './lib/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, setDoc, doc, deleteDoc } from 'firebase/firestore';
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
       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950"></div>
       <motion.div
          initial={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 text-center"
       >
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 drop-shadow-[0_0_20px_rgba(251,191,36,0.4)] mb-4">
             Welcome!
          </h1>
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5, duration: 0.8 }}
             className="text-2xl md:text-3xl text-indigo-200 font-bold tracking-wide"
          >
             {userName}
          </motion.p>
       </motion.div>
    </div>
  );
};

const TrendsDashboard = ({ onBack, customApiKey }: { onBack: () => void, customApiKey: string }) => {
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </div>
      )}
    </motion.div>
  );
}

import confetti from 'canvas-confetti';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [loginTransition, setLoginTransition] = useState<'idle' | 'authenticating' | 'leaving' | 'welcome'>('idle');

  const [currentView, setCurrentView] = useState<'upload' | 'trends'>('upload');

  const [items, setItems] = useState<BulkItem[]>([]);

  const [targetMarketplace, setTargetMarketplace] = useState<TargetMarketplace>('adobe_stock');
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // Keyword Editor State
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingKeywords, setEditingKeywords] = useState<string[]>([]);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [newKeyword, setNewKeyword] = useState<string>('');

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
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
          } catch (e) {
            console.error('Storage quota exceeded for background image', e);
            alert('Image is too large to save as theme. Please try a smaller image.');
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
          setItems(historyItems);
        } catch (error) {
          console.error("Error loading history:", error);
        }
      } else {
        setItems([]);
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/') || f.name.endsWith('.svg') || f.name.endsWith('.eps')));
    }
  };

  const startBulkProcessing = async () => {
    setIsProcessing(true);
    // If a custom API key is provided, we can process much faster.
    // Otherwise, use concurrency 1 with a larger delay to respect the free tier rate limits (15 RPM)
    const concurrency = customApiKey ? 5 : 1;
    const queue = [...items].filter(i => i.status === 'pending' || i.status === 'error');

    for (let i = 0; i < queue.length; i += concurrency) {
      const chunk = queue.slice(i, i + concurrency);
      const results = await Promise.all(chunk.map((item) => processSingleFile(item)));
      
      // If any of the files in the chunk returned true for hard quota error, stop the loop entirely
      if (results.some(hasHardError => hasHardError)) {
        showToast("System Quota Exceeded. Processing stopped.");
        break;
      }
      
      // Only delay if using the default free-tier key to respect basic limits
      if (i + concurrency < queue.length && !customApiKey) {
        await new Promise(resolve => setTimeout(resolve, 4500));
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
            isAiGenerated
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
          if (res.status === 403) {
            throw new Error(data.error || "System Quota Exceeded. Please add your own API key in Settings.");
          }
          if ((res.status === 429 || res.status === 503) && attempt < maxRetries - 1) {
             attempt++;
             
             // Extract retry delay from Gemini message if present (e.g. "retry in 52.17s")
             let waitTime = 40000;
             const retryMatch = data.error?.match(/retry in ([\d\.]+)s/i);
             if (retryMatch && retryMatch[1]) {
               waitTime = (parseFloat(retryMatch[1]) * 1000) + 2000; // Add 2s buffer
             }

             setItems((prev) =>
               prev.map((i) => (i.id === item.id ? { ...i, error: `Quota/Rate limit hit. Retrying in ${Math.round(waitTime/1000)}s (Attempt ${attempt}/${maxRetries - 1})...` } : i))
             );
             await new Promise(resolve => setTimeout(resolve, waitTime));
             continue; // Retry the loop
          }
          throw new Error(data.error || 'Failed');
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
      const blob = await embedJpegMetadata(
        item.file,
        item.result.recommendedTitle,
        item.result.keywords
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `stockmeta_${item.file.name}`;
      a.click();
    } catch (err) {
      alert('EXIF/IPTC embedding supported for JPG images. Downloading sidecar metadata.');
    }
  };

  const exportBatchCSV = () => {
    let csv = 'Filename,Title,Keywords\n';
    items.forEach((item) => {
      if (item.result) {
        const title = `"${item.result.recommendedTitle.replace(/"/g, '""')}"`;
        const keywords = `"${item.result.keywords.join(', ')}"`;
        csv += `"${item.file.name}",${title},${keywords}\n`;
      }
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `batch_${targetMarketplace}_metadata.csv`;
    a.click();
  };

  const exportBatchZip = async () => {
    const completedItems = items.filter(i => i.result && i.status === 'completed');
    if (completedItems.length === 0) return;
    
    showToast("Preparing ZIP file... Please wait.");
    setIsProcessing(true);
    
    try {
      const zip = new JSZip();
      for (const item of completedItems) {
         if (!item.result) continue;
         const blob = await embedJpegMetadata(item.file, item.result.recommendedTitle, item.result.keywords);
         zip.file(`meta_${item.file.name}`, blob);
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Stock_Metadata_Images_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast("✓ All Metadata embedded & ZIP downloaded!");
    } catch (err) {
      showToast("Failed to create ZIP (some images may not be JPG)");
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
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-10 rounded-3xl shadow-2xl shadow-indigo-900/20 w-full text-center relative z-20">
             <div className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/30 border border-indigo-500/50">
               <img src={ratulLogo} alt="AdobeMeta Pro Logo" className="w-full h-full object-cover" />
             </div>
             
             <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
               AdobeMeta <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Pro</span>
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
                   <span className="text-sm font-black tracking-wide bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">Ratul Sorker</span>
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
            <motion.div whileHover={{ scale: 1.05, rotate: -5 }} className="w-14 h-14 rounded-xl overflow-hidden shadow-lg shadow-indigo-600/30 border border-indigo-500/30">
              <img src={ratulLogo} alt="RATUL Logo" className="w-full h-full object-cover" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">AdobeMeta <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Pro</span></h1>
              <p className="text-xs text-slate-400 mt-1 font-medium">Bulk Asset Metadata & Compliance Platform (100 Files Bundle)</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="text-right flex flex-col justify-center bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800/80 shadow-inner">
              <span className="text-[9px] uppercase tracking-[0.2em] text-indigo-400 font-bold mb-0.5">Founder</span>
              <span className="text-sm font-black tracking-wide bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">Ratul Sorker</span>
            </div>
            
            <div className="hidden sm:block w-px h-10 bg-slate-800"></div>

            {currentView === 'upload' && (
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">Target Marketplace Platform</label>
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
            )}

            <div className="flex gap-2">
              {currentView === 'upload' ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentView('trends')}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                  >
                    <TrendingUp className="w-4 h-4" /> Discover Trends
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={exportBatchCSV}
                    disabled={!items.some((i) => i.result)}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:shadow-none text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                  >
                    <Download className="w-4 h-4" /> Export Batch CSV
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

        <AnimatePresence mode="wait">
          {currentView === 'trends' ? (
            <TrendsDashboard key="trends" onBack={() => setCurrentView('upload')} customApiKey={customApiKey} />
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
                        </div>
                      ) : (
                        <div className="flex-1 px-4 text-sm font-medium text-slate-500 flex items-center gap-2">
                          {item.status === 'processing' ? (
                            <span className="text-indigo-400 flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Analyzing with Gemini AI...</span>
                          ) : item.status === 'error' ? (
                            <span className="text-red-400">{item.error}</span>
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
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white px-5 py-3 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </motion.button>
                </form>
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
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
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
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
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
              className="relative bg-slate-900/90 border-2 border-indigo-500/50 p-10 md:p-16 rounded-3xl shadow-[0_0_100px_rgba(99,102,241,0.5)] text-center max-w-2xl w-full z-10"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="text-7xl md:text-8xl mb-6 inline-block"
              >
                🎉
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-6 pb-2 leading-tight drop-shadow-sm">
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
