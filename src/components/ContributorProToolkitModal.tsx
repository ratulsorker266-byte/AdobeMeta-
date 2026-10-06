import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Upload,
  Sparkles,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  X,
  HelpCircle,
  BarChart3,
  FileCode,
  Plus,
  Trash2,
  Lock,
} from 'lucide-react';
import {
  runPreSubmissionAudit,
  REJECTION_REMEDY_GUIDES,
  calculateKeywordQualityScore,
  sanitizeForGenerativeAiPolicy,
  PreSubmissionReport,
  TrackedSubmissionItem,
} from '../lib/contributorProToolkitEngine';
import { embedJpegMetadata, generateXmpSidecarXml, embedMetadataIntoEps } from '../lib/metadataEmbedder';
import { playTickSound, playChimeSound } from '../lib/audioFeedback';

interface ContributorProToolkitModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'presubmit' | 'rejection' | 'aidisclosure' | 'tracker' | 'embed' | 'kwscore';
  uiLang: 'en' | 'bn';
  onToggleLang: () => void;
  themeMode: 'light' | 'dark';
  showToast: (msg: string) => void;
}

const DEFAULT_TRACKED_ITEMS: TrackedSubmissionItem[] = [
  {
    id: 'trk-1',
    fileName: 'isometric_cloud_security_01.eps',
    title: 'Isometric Cloud Security And Enterprise Data Protection Vector',
    topic: 'Cybersecurity & Cloud Vector',
    status: 'APPROVED',
    downloads: 42,
    earningsUsd: 68.4,
    dateAdded: '2026-09-18',
  },
  {
    id: 'trk-2',
    fileName: 'biotech_dna_helix_02.jpg',
    title: 'CRISPR Gene Therapy And Molecular DNA Helix Illustration',
    topic: 'Biotech & Healthcare',
    status: 'APPROVED',
    downloads: 29,
    earningsUsd: 49.3,
    dateAdded: '2026-09-22',
  },
  {
    id: 'trk-3',
    fileName: 'minimalist_sacred_geometry_03.eps',
    title: 'Minimalist Sacred Geometry And Botanical Line Icon Set',
    topic: 'Vector Logos & Icons',
    status: 'SUBMITTED',
    downloads: 0,
    earningsUsd: 0,
    dateAdded: '2026-10-02',
  },
  {
    id: 'trk-4',
    fileName: 'street_coffee_cup_logo.jpg',
    title: 'Morning Coffee Cup On Wooden Table',
    topic: 'Food & Lifestyle',
    status: 'REJECTED',
    downloads: 0,
    earningsUsd: 0,
    dateAdded: '2026-09-29',
  },
];

export const ContributorProToolkitModal: React.FC<ContributorProToolkitModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'presubmit',
  uiLang,
  onToggleLang,
  themeMode,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<
    'presubmit' | 'rejection' | 'aidisclosure' | 'tracker' | 'embed' | 'kwscore'
  >(initialTab);

  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Shared Title & Keywords state for testing / auditing
  const [auditTitle, setAuditTitle] = useState<string>(
    'Isometric Cloud Security And Enterprise Firewall Vector Illustration'
  );
  const [auditKeywordsInput, setAuditKeywordsInput] = useState<string>(
    'cloud security, enterprise firewall, isometric server, cybersecurity vector, data protection, network infrastructure, digital shield, information security, cloud computing, server cluster, corporate technology, encrypted network, threat intelligence, privacy compliance, workflow automation, editable vector, eps 10, commercial illustration, clean copy space, b2b marketing, tech startup, system integration, biometric lock, cryptographic key, minimalist icon'
  );

  // Tab 1: Pre-Submission Checker State
  const [preSubReport, setPreSubReport] = useState<PreSubmissionReport | null>(null);
  const [isCheckingFile, setIsCheckingFile] = useState<boolean>(false);
  const preSubFileInputRef = useRef<HTMLInputElement>(null);

  // Tab 2: Rejection Reason Helper State
  const [selectedRejectionId, setSelectedRejectionId] = useState<string>('similar_content');

  // Tab 3: AI Content Disclosure State
  const [isAiGeneratedFlag, setIsAiGeneratedFlag] = useState<boolean>(true);
  const [aiContentType, setAiContentType] = useState<'illustration' | 'photo'>('illustration');
  const [aiHasHumanLikeness, setAiHasHumanLikeness] = useState<boolean>(false);

  // Tab 4: Upload & Earnings Tracker State
  const [trackedItems, setTrackedItems] = useState<TrackedSubmissionItem[]>(() => {
    try {
      const saved = localStorage.getItem('adobemeta_contributor_tracker_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_TRACKED_ITEMS;
  });
  const [newTrkFile, setNewTrkFile] = useState<string>('');
  const [newTrkTopic, setNewTrkTopic] = useState<string>('Cybersecurity & Cloud Vector');
  const [newTrkStatus, setNewTrkStatus] = useState<'SUBMITTED' | 'APPROVED' | 'REJECTED'>('SUBMITTED');
  const csvImportInputRef = useRef<HTMLInputElement>(null);

  // Tab 5: Direct IPTC/XMP Metadata Embedder State
  const [embedFile, setEmbedFile] = useState<File | null>(null);
  const [isEmbedding, setIsEmbedding] = useState<boolean>(false);
  const embedInputRef = useRef<HTMLInputElement>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const isLight = themeMode === 'light';
  const isBn = false;

  const parsedKeywords = auditKeywordsInput
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);

  const handleCopy = (text: string, id: string, msg: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    playChimeSound();
    showToast(msg);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Run Pre-Submission Check
  const handleRunPreSubCheck = async (file: File | null) => {
    setIsCheckingFile(true);
    playTickSound();
    try {
      const report = await runPreSubmissionAudit(file, auditTitle, parsedKeywords);
      setPreSubReport(report);
      playChimeSound();
    } finally {
      setIsCheckingFile(false);
    }
  };

  // Save Tracker to LocalStorage
  const saveTrackerList = (next: TrackedSubmissionItem[]) => {
    setTrackedItems(next);
    try {
      localStorage.setItem('adobemeta_contributor_tracker_v1', JSON.stringify(next));
    } catch {}
  };

  const handleAddTrackedAsset = () => {
    if (!newTrkFile.trim()) return;
    playTickSound();
    const item: TrackedSubmissionItem = {
      id: `trk-${Date.now()}`,
      fileName: newTrkFile.trim(),
      title: newTrkFile.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '),
      topic: newTrkTopic.trim() || 'General Commercial',
      status: newTrkStatus,
      downloads: 0,
      earningsUsd: 0,
      dateAdded: new Date().toISOString().slice(0, 10),
    };
    saveTrackerList([item, ...trackedItems]);
    setNewTrkFile('');
    showToast(isBn ? 'ফাইলটি ট্র্যাকারে যুক্ত হয়েছে!' : 'File added to Upload Tracker!');
  };

  // Parse Imported Adobe Stock / Agency Earnings CSV
  const handleImportEarningsCsv = async (file: File) => {
    playTickSound();
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      if (lines.length < 2) {
        showToast('CSV file is empty or invalid');
        return;
      }
      const imported: TrackedSubmissionItem[] = [];
      for (let i = 1; i < Math.min(lines.length, 100); i++) {
        const cols = lines[i].split(',').map((c) => c.replace(/^"|"$/g, '').trim());
        if (cols.length >= 2) {
          const fname = cols[0] || `asset_${i}.jpg`;
          const titleOrTopic = cols[1] || 'Commercial Stock Asset';
          const dl = parseInt(cols[2] || '1', 10) || 1;
          const earn = parseFloat((cols[3] || '1.50').replace(/[^0-9.]/g, '')) || 1.5;
          imported.push({
            id: `csv-${Date.now()}-${i}`,
            fileName: fname,
            title: titleOrTopic,
            topic: cols[4] || 'Imported CSV Topic',
            status: 'APPROVED',
            downloads: dl,
            earningsUsd: earn,
            dateAdded: new Date().toISOString().slice(0, 10),
          });
        }
      }
      if (imported.length > 0) {
        saveTrackerList([...imported, ...trackedItems]);
        playChimeSound();
        showToast(
          isBn
            ? `${imported.length}টি ফাইলের আর্নিং ডেটা ইমপোর্ট হয়েছে!`
            : `Imported ${imported.length} rows from Earnings CSV!`
        );
      }
    } catch {
      showToast('Could not parse CSV file');
    }
  };

  // Direct IPTC/XMP Metadata Embed in Browser
  const handleEmbedIntoOwnFile = async () => {
    if (!embedFile) return;
    setIsEmbedding(true);
    playTickSound();
    try {
      const isEps = /\.(eps|ai)$/i.test(embedFile.name);
      const blob = isEps
        ? await embedMetadataIntoEps(embedFile, auditTitle, parsedKeywords, auditTitle)
        : await embedJpegMetadata(embedFile, auditTitle, parsedKeywords);

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = isEps
        ? `IPTC_XMP_${embedFile.name}`
        : `IPTC_EMBEDDED_${embedFile.name.replace(/\.[^.]+$/, '')}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
      playChimeSound();
      showToast(
        isBn
          ? 'আপনার ফাইলের ভেতর সরাসরি IPTC/XMP মেটাডেটা লিখে ডাউনলোড করা হয়েছে!'
          : 'Embedded IPTC/XMP Title & Keywords directly into your file!'
      );
    } finally {
      setIsEmbedding(false);
    }
  };

  const handleDownloadBridgeXmpSidecar = () => {
    playTickSound();
    const xml = generateXmpSidecarXml(auditTitle, parsedKeywords, auditTitle);
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const baseName = embedFile ? embedFile.name.replace(/\.[^.]+$/, '') : 'adobe_bridge_metadata';
    a.download = `${baseName}.xmp`;
    a.click();
    URL.revokeObjectURL(url);
    playChimeSound();
    showToast(isBn ? 'Adobe Bridge .xmp Sidecar ডাউনলোড হয়েছে!' : 'Downloaded Adobe Bridge .xmp Sidecar!');
  };

  const kwAudit = calculateKeywordQualityScore(auditTitle, parsedKeywords);
  const aiSanitized = sanitizeForGenerativeAiPolicy(auditTitle, parsedKeywords);

  // Calculate Topic Earnings Breakdown
  const topicSummary = trackedItems.reduce<
    Record<string, { count: number; downloads: number; earnings: number }>
  >((acc, item) => {
    if (!acc[item.topic]) acc[item.topic] = { count: 0, downloads: 0, earnings: 0 };
    acc[item.topic].count += 1;
    acc[item.topic].downloads += item.downloads;
    acc[item.topic].earnings += item.earningsUsd;
    return acc;
  }, {});

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.96, y: 12, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.96, y: 12, opacity: 0 }}
          className={`w-full max-w-6xl max-h-[92vh] flex flex-col rounded-2xl border overflow-hidden shadow-2xl ${
            isLight
              ? 'bg-[#fbfaf8] border-neutral-200 text-neutral-900'
              : 'bg-[#0b0d12] border-neutral-800 text-neutral-100'
          }`}
        >
          {/* Top Header with Privacy Guarantee & BN/EN Toggle */}
          <div
            className={`px-5 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 ${
              isLight ? 'bg-white border-neutral-200/80' : 'bg-[#0f1219] border-neutral-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-500">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center flex-wrap gap-2">
                  <h2 className="text-sm sm:text-base font-bold tracking-tight">
                    {isBn
                      ? 'কন্ট্রিবিউটর প্রো চেক ও আর্নিং টুলকিট'
                      : 'Contributor Pre-Submission & Compliance Toolkit'}
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>
                      {isBn
                        ? 'আপনার ফাইল সার্ভারে যায় না, সব ব্রাউজারেই প্রসেস হয়'
                        : '100% Local Browser Processing — Files Never Leave Your Device'}
                    </span>
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {isBn
                    ? 'আপলোডের আগে রিজেকশন রোধ, AI পলিসি গাইডলাইন, ফাইল মেটাডেটা এম্বেড এবং আর্নিং ট্র্যাকার'
                    : 'Prevent rejections before uploading, verify generative AI disclosure rules, embed IPTC/XMP, and track earnings'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg border border-neutral-300 dark:border-neutral-700 flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 6 Practical Contributor Tabs */}
          <div
            className={`px-5 pt-3 border-b flex flex-wrap items-center gap-1.5 pb-3 ${
              isLight ? 'bg-[#f6f5f2] border-neutral-200/80' : 'bg-[#090b0f] border-neutral-800'
            }`}
          >
            {[
              {
                id: 'presubmit',
                labelEn: '1. Pre-Submission Checker',
                labelBn: '১. প্রি-সাবমিশন চেকার',
                icon: ShieldCheck,
              },
              {
                id: 'rejection',
                labelEn: '2. Rejection Reason Helper',
                labelBn: '২. রিজেকশন সমাধান হেল্পার',
                icon: HelpCircle,
              },
              {
                id: 'aidisclosure',
                labelEn: '3. AI Content Disclosure Helper',
                labelBn: '৩. AI ডিসক্লোজার গাইড',
                icon: Sparkles,
              },
              {
                id: 'kwscore',
                labelEn: '4. Keyword Quality Score',
                labelBn: '৪. কীওয়ার্ড কোয়ালিটি স্কোর',
                icon: BarChart3,
              },
              {
                id: 'embed',
                labelEn: '5. Direct File IPTC/XMP Embed',
                labelBn: '৫. ফাইলে মেটাডেটা এম্বেড (.xmp)',
                icon: FileCode,
              },
              {
                id: 'tracker',
                labelEn: '6. Upload & Earnings CSV Tracker',
                labelBn: '৬. আপলোড ও আর্নিং ট্র্যাকার',
                icon: FileSpreadsheet,
              },
            ].map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    playTickSound();
                    setActiveTab(t.id as any);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                    active
                      ? isLight
                        ? 'bg-neutral-950 text-white border-neutral-950'
                        : 'bg-emerald-500 text-black border-emerald-400'
                      : isLight
                      ? 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{isBn ? t.labelBn : t.labelEn}</span>
                </button>
              );
            })}
          </div>

          {/* Main Content Deck */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Shared Title & Keywords Input Bar for Tabs 1, 3, 4, 5 */}
            {activeTab !== 'rejection' && activeTab !== 'tracker' && (
              <div
                className={`p-4 rounded-xl border space-y-3 ${
                  isLight ? 'bg-white border-neutral-200/90' : 'bg-[#11141c] border-neutral-800'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                  <div className="lg:col-span-5 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>{isBn ? 'আপনার ফাইলের টাইটেল (Title):' : 'Asset Title to Check / Embed:'}</span>
                      <span
                        className={`font-mono text-[11px] ${
                          auditTitle.length <= 70 ? 'text-emerald-500' : 'text-amber-500'
                        }`}
                      >
                        {auditTitle.length}/70 chars
                      </span>
                    </div>
                    <input
                      type="text"
                      value={auditTitle}
                      onChange={(e) => setAuditTitle(e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2 text-xs focus:outline-none ${
                        isLight
                          ? 'bg-[#fbfaf8] border-neutral-300 text-neutral-900'
                          : 'bg-neutral-950 border-neutral-800 text-white'
                      }`}
                    />
                  </div>

                  <div className="lg:col-span-7 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>
                        {isBn
                          ? 'কীওয়ার্ড তালিকা (কমা দিয়ে আলাদা করা):'
                          : 'Keywords List (Comma-separated):'}
                      </span>
                      <span className="font-mono text-[11px] text-emerald-500">
                        {parsedKeywords.length}/49 tags
                      </span>
                    </div>
                    <input
                      type="text"
                      value={auditKeywordsInput}
                      onChange={(e) => setAuditKeywordsInput(e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2 text-xs focus:outline-none ${
                        isLight
                          ? 'bg-[#fbfaf8] border-neutral-300 text-neutral-900'
                          : 'bg-neutral-950 border-neutral-800 text-white'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 1: PRE-SUBMISSION CHECKER                                */}
            {/* ============================================================ */}
            {activeTab === 'presubmit' && (
              <div className="space-y-4">
                <div
                  className={`p-5 rounded-xl border space-y-4 ${
                    isLight ? 'bg-white border-neutral-200' : 'bg-[#11141c] border-neutral-800'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold">
                        {isBn
                          ? 'আপলোডের আগে ৬-ধাপের ফাইল ও মেটাডেটা চেকার'
                          : '6-Point Pre-Submission File & Metadata Inspector'}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {isBn
                          ? 'ন্যূনতম 4MP রেজোলিউশন, ফাইল সাইজ, EPS/AI ভার্সন, টাইটেল দৈর্ঘ্য, ডুপ্লিকেট/বহুবচন কীওয়ার্ড, ট্রেডমার্ক শব্দ (Nike, Disney) এবং রিলিজ লাগবে কি না তা চেক করুন।'
                          : 'Checks minimum 4MP resolution, file size, EPS/AI version, title length, duplicate/plural keywords, restricted trademarks (Nike, Disney, etc.), and Model/Property release requirements.'}
                      </p>
                    </div>

                    <input
                      ref={preSubFileInputRef}
                      type="file"
                      accept="image/*,.eps,.ai"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        if (f) handleRunPreSubCheck(f);
                      }}
                    />

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={isCheckingFile}
                        onClick={() => preSubFileInputRef.current?.click()}
                        className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{isBn ? 'আপনার ফাইল সিলেক্ট করে চেক করুন' : 'Select Your File to Check'}</span>
                      </button>

                      <button
                        type="button"
                        disabled={isCheckingFile}
                        onClick={() => handleRunPreSubCheck(null)}
                        className={`px-4 py-2.5 rounded-xl border font-bold text-xs cursor-pointer ${
                          isLight
                            ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800'
                            : 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-neutral-200'
                        }`}
                      >
                        {isBn ? 'টাইটেল ও কীওয়ার্ড এখনই চেক করুন' : 'Check Title & Keywords Now'}
                      </button>
                    </div>
                  </div>

                  {preSubReport ? (
                    <div className="space-y-4 pt-2">
                      {/* Top Summary Bar */}
                      <div
                        className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${
                          preSubReport.overallPass
                            ? 'bg-emerald-500/10 border-emerald-500/30'
                            : 'bg-red-500/10 border-red-500/30'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {preSubReport.overallPass ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          )}
                          <div>
                            <div className="text-xs font-bold">
                              {preSubReport.fileName} · {preSubReport.dimensions} ({preSubReport.megapixels})
                            </div>
                            <div className="text-[11px] opacity-80">
                              {preSubReport.epsVersion} · Readiness Score: {preSubReport.readinessScore}%
                            </div>
                          </div>
                        </div>

                        {(preSubReport.duplicateOrPluralHits.length > 0 ||
                          preSubReport.trademarkHits.length > 0) && (
                          <button
                            type="button"
                            onClick={() => {
                              setAuditKeywordsInput(preSubReport.cleanedKeywords.join(', '));
                              handleRunPreSubCheck(null);
                              showToast(
                                isBn
                                  ? 'ডুপ্লিকেট ও ট্রেডমার্ক শব্দগুলো ক্লিন করা হয়েছে!'
                                  : 'Removed duplicate/plural & trademark keywords!'
                              );
                            }}
                            className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-black font-bold text-xs cursor-pointer"
                          >
                            {isBn ? '১-ক্লিকে ডুপ্লিকেট ও ট্রেডমার্ক মুছুন' : '1-Click Clean Duplicates & Trademarks'}
                          </button>
                        )}
                      </div>

                      {/* 6 Detailed Checks Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {preSubReport.checks.map((chk) => (
                          <div
                            key={chk.id}
                            className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${
                              isLight
                                ? 'bg-[#fbfaf8] border-neutral-200'
                                : 'bg-neutral-950 border-neutral-800'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="text-xs font-bold">
                                {isBn ? chk.labelBn : chk.labelEn}
                              </div>
                              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                {isBn ? chk.detailBn : chk.detailEn}
                              </p>
                            </div>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                                chk.status === 'PASS'
                                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                  : chk.status === 'WARNING'
                                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                  : 'bg-red-500/20 text-red-600 dark:text-red-400'
                              }`}
                            >
                              {chk.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-neutral-500 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl">
                      {isBn
                        ? 'ওপরের "আপনার ফাইল সিলেক্ট করে চেক করুন" বা "টাইটেল ও কীওয়ার্ড এখনই চেক করুন" বাটনে ক্লিক করুন।'
                        : 'Click "Select Your File to Check" or "Check Title & Keywords Now" above to run the 6-point pre-submission audit.'}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 2: REJECTION REASON HELPER                               */}
            {/* ============================================================ */}
            {activeTab === 'rejection' && (
              <div className="space-y-4">
                <div
                  className={`p-5 rounded-xl border space-y-4 ${
                    isLight ? 'bg-white border-neutral-200' : 'bg-[#11141c] border-neutral-800'
                  }`}
                >
                  <div>
                    <h3 className="text-sm font-bold">
                      {isBn
                        ? 'Adobe Stock রিজেকশন কারণ ও সমাধান গাইড'
                        : 'Adobe Stock Rejection Reason Diagnostic & Fix Helper'}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {isBn
                        ? 'আপনার ফাইল কোন কারণে রিজেক্ট হয়েছে তা নিচে সিলেক্ট করুন—কেন হয়েছে এবং কীভাবে ঠিক করে আবার আপলোড করবেন তা জেনে নিন।'
                        : 'Select the rejection reason you received from Adobe Stock to see exactly why it happened and step-by-step instructions to fix it.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {REJECTION_REMEDY_GUIDES.map((g) => {
                      const active = selectedRejectionId === g.id;
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => {
                            playTickSound();
                            setSelectedRejectionId(g.id);
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                            active
                              ? 'bg-amber-500 text-black border-amber-400'
                              : isLight
                              ? 'bg-[#fbfaf8] text-neutral-700 border-neutral-200 hover:border-neutral-400'
                              : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          {isBn ? g.reasonTitleBn : g.reasonTitleEn}
                        </button>
                      );
                    })}
                  </div>

                  {(() => {
                    const guide =
                      REJECTION_REMEDY_GUIDES.find((g) => g.id === selectedRejectionId) ||
                      REJECTION_REMEDY_GUIDES[0];
                    const steps = isBn ? guide.howToFixStepsBn : guide.howToFixStepsEn;
                    return (
                      <div
                        className={`p-4 rounded-xl border space-y-3 ${
                          isLight ? 'bg-[#fbfaf8] border-neutral-200' : 'bg-neutral-950 border-neutral-800'
                        }`}
                      >
                        <div className="text-sm font-bold text-amber-500">
                          {isBn ? guide.reasonTitleBn : guide.reasonTitleEn}
                        </div>

                        <div className="space-y-1">
                          <div className="text-xs font-bold">
                            {isBn ? 'কেন এই রিজেকশন হয়?' : 'Why Reviewers Reject for This Reason:'}
                          </div>
                          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                            {isBn ? guide.whyItHappensBn : guide.whyItHappensEn}
                          </p>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <div className="text-xs font-bold text-emerald-500">
                            {isBn
                              ? 'কীভাবে ঠিক করবেন (Step-by-Step Fix):'
                              : 'How to Fix It Before Re-Submitting:'}
                          </div>
                          <ul className="space-y-1.5 text-xs">
                            {steps.map((st, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{st}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-amber-600 dark:text-amber-400">
                          💡 {isBn ? guide.preUploadChecklistBn : guide.preUploadChecklistEn}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 3: AI CONTENT DISCLOSURE HELPER                          */}
            {/* ============================================================ */}
            {activeTab === 'aidisclosure' && (
              <div className="space-y-4">
                <div
                  className={`p-5 rounded-xl border space-y-4 ${
                    isLight ? 'bg-white border-neutral-200' : 'bg-[#11141c] border-neutral-800'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold">
                        {isBn
                          ? 'Generative AI Content Disclosure ও পলিসি গাইডলাইন'
                          : 'Generative AI Content Disclosure & Policy Sanitizer'}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {isBn
                          ? 'আপনি যদি AI দিয়ে তৈরি ফাইল আপলোড করেন, তবে Adobe Stock-এর অফিশিয়াল নিয়ম অনুযায়ী কোন ফ্ল্যাগ দেবেন এবং টাইটেল/কীওয়ার্ডে কী রাখা যাবে তা এখানে প্রস্তুত করুন।'
                          : 'Ensures your AI-generated assets follow official Adobe Stock & Shutterstock Generative AI disclosure rules and strips forbidden prompt/artist/brand terms.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setAuditTitle(aiSanitized.compliantTitle);
                        setAuditKeywordsInput(aiSanitized.compliantKeywords.join(', '));
                        playChimeSound();
                        showToast(
                          isBn
                            ? 'টাইটেল ও কীওয়ার্ড AI পলিসি অনুযায়ী ক্লিন করা হয়েছে!'
                            : 'Sanitized Title & Keywords for Generative AI Policy compliance!'
                        );
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs cursor-pointer"
                    >
                      {isBn
                        ? '১-ক্লিকে টাইটেল ও কীওয়ার্ড AI পলিসি অনুযায়ী ক্লিন করুন'
                        : '1-Click Sanitize Title & Keywords for AI Policy'}
                    </button>
                  </div>

                  {/* Interactive Portal Checklist Simulator */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div
                      className={`lg:col-span-6 p-4 rounded-xl border space-y-3 text-xs ${
                        isLight ? 'bg-[#fbfaf8] border-neutral-200' : 'bg-neutral-950 border-neutral-800'
                      }`}
                    >
                      <div className="font-bold text-emerald-500 uppercase">
                        {isBn
                          ? 'Adobe Stock পোর্টালে যা সিলেক্ট করবেন:'
                          : 'Required Adobe Stock Contributor Portal Settings:'}
                      </div>

                      <label className="flex items-center gap-2.5 cursor-pointer font-semibold">
                        <input
                          type="checkbox"
                          checked={isAiGeneratedFlag}
                          onChange={(e) => setIsAiGeneratedFlag(e.target.checked)}
                          className="w-4 h-4 accent-emerald-500"
                        />
                        <span>
                          ☑️ &ldquo;Created using generative AI tools&rdquo; (Must be checked!)
                        </span>
                      </label>

                      <div className="flex items-center gap-3 pt-1">
                        <span className="text-neutral-500">
                          {isBn ? 'ফাইলের ধরন (Category Type):' : 'Recommended Asset Type:'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setAiContentType('illustration')}
                          className={`px-2.5 py-1 rounded border font-bold ${
                            aiContentType === 'illustration'
                              ? 'bg-emerald-500 text-black border-emerald-400'
                              : 'border-neutral-700'
                          }`}
                        >
                          Illustration (Vectors / Stylized AI)
                        </button>
                        <button
                          type="button"
                          onClick={() => setAiContentType('photo')}
                          className={`px-2.5 py-1 rounded border font-bold ${
                            aiContentType === 'photo'
                              ? 'bg-emerald-500 text-black border-emerald-400'
                              : 'border-neutral-700'
                          }`}
                        >
                          Photo (Photorealistic Only)
                        </button>
                      </div>

                      <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={aiHasHumanLikeness}
                          onChange={(e) => setAiHasHumanLikeness(e.target.checked)}
                          className="w-4 h-4 accent-amber-500"
                        />
                        <span>
                          {isBn
                            ? 'ছবিতে রিয়েলিস্টিক মানুষের মুখ আছে (থাকলে Property Release দিতে হবে)'
                            : 'Depicts a realistic human face (Requires Generative AI Property Release)'}
                        </span>
                      </label>
                    </div>

                    <div
                      className={`lg:col-span-6 p-4 rounded-xl border space-y-2.5 text-xs ${
                        isLight ? 'bg-[#fbfaf8] border-neutral-200' : 'bg-neutral-950 border-neutral-800'
                      }`}
                    >
                      <div className="font-bold text-amber-500 uppercase">
                        {isBn ? 'অফিশিয়াল জেনারেটিভ AI নিয়মাবলী:' : 'Official Generative AI Submission Rules:'}
                      </div>
                      <ul className="space-y-1.5">
                        {(isBn
                          ? aiSanitized.checklistGuidelinesBn
                          : aiSanitized.checklistGuidelinesEn
                        ).map((rule, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 4: KEYWORD QUALITY SCORE & RELEVANCE AUDITOR             */}
            {/* ============================================================ */}
            {activeTab === 'kwscore' && (
              <div className="space-y-4">
                <div
                  className={`p-5 rounded-xl border space-y-4 ${
                    isLight ? 'bg-white border-neutral-200' : 'bg-[#11141c] border-neutral-800'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold">
                        {isBn
                          ? 'কীওয়ার্ড কোয়ালিটি স্কোর ও প্রাসঙ্গিকতা অডিটর'
                          : 'Keyword Quality Score & Title Relevance Auditor'}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {isBn
                          ? 'কীওয়ার্ডগুলো আপনার টাইটেলের সাথে কতটা প্রাসঙ্গিক তা স্কোর করে দেখায় এবং অপ্রাসঙ্গিক বা নিষিদ্ধ শব্দ থাকলে সতর্ক করে।'
                          : 'Scores how strongly your keywords align with your Title subject, warns about irrelevant or forbidden tags, and prioritizes your Top-10 slots.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAuditKeywordsInput(kwAudit.cleanedOptimized49.join(', '));
                          playChimeSound();
                          showToast(
                            isBn
                              ? 'অপ্রাসঙ্গিক শব্দ মুছে Top-10 স্লট সাজানো হয়েছে!'
                              : 'Removed warnings and reordered Top-10 relevant keywords!'
                          );
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs cursor-pointer"
                      >
                        {isBn ? '১-ক্লিকে অপ্রাসঙ্গিক শব্দ মুছে সাজান' : '1-Click Clean & Optimize Top-10 Order'}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            kwAudit.cleanedOptimized49.join(', '),
                            'kw-clean-copy',
                            'Copied Cleaned Keywords!'
                          )
                        }
                        className="px-3.5 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === 'kw-clean-copy' ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{isBn ? 'কপি করুন' : 'Copy Clean Tags'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Score Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div
                      className={`p-3.5 rounded-xl border ${
                        isLight ? 'bg-[#fbfaf8] border-neutral-200' : 'bg-neutral-950 border-neutral-800'
                      }`}
                    >
                      <div className="text-neutral-500 uppercase text-[10px]">
                        {isBn ? 'কীওয়ার্ড কোয়ালিটি স্কোর' : 'KEYWORD QUALITY SCORE'}
                      </div>
                      <div className="text-xl font-black text-emerald-500 mt-0.5">
                        {kwAudit.overallScore}/100
                      </div>
                    </div>

                    <div
                      className={`p-3.5 rounded-xl border ${
                        isLight ? 'bg-[#fbfaf8] border-neutral-200' : 'bg-neutral-950 border-neutral-800'
                      }`}
                    >
                      <div className="text-neutral-500 uppercase text-[10px]">
                        {isBn ? 'টাইটেল ও প্রথম ১০ ট্যাগের মিল' : 'TITLE-TO-TOP-10 ALIGNMENT'}
                      </div>
                      <div className="text-xl font-black text-amber-500 mt-0.5">
                        {kwAudit.top10CorrelationPct}%
                      </div>
                    </div>

                    <div
                      className={`p-3.5 rounded-xl border ${
                        isLight ? 'bg-[#fbfaf8] border-neutral-200' : 'bg-neutral-950 border-neutral-800'
                      }`}
                    >
                      <div className="text-neutral-500 uppercase text-[10px]">
                        {isBn ? 'সতর্কতা / অপ্রাসঙ্গিক শব্দ' : 'WARNINGS / IRRELEVANT TAGS'}
                      </div>
                      <div className="text-xl font-black mt-0.5">
                        {kwAudit.irrelevantWarnings.length + kwAudit.duplicateWarnings.length}
                      </div>
                    </div>
                  </div>

                  {/* Warnings List if any */}
                  {kwAudit.irrelevantWarnings.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 space-y-1.5 text-xs">
                      <div className="font-bold text-red-500">
                        {isBn
                          ? 'নিচের শব্দগুলো পলিসি ভঙ্গ বা রিজেকশন ঘটাতে পারে:'
                          : 'Flagged Irrelevant or Policy-Violating Keywords:'}
                      </div>
                      {kwAudit.irrelevantWarnings.map((w, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span>
                            <strong>{w.keyword}</strong> — {isBn ? w.reasonBn : w.reasonEn}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Top-10 Priority Preview */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold">
                      {isBn
                        ? 'আপনার অপ্টিমাইজড কীওয়ার্ড তালিকা (প্রথম ১০টি ট্যাগ নীল/সবুজ বর্ডারে হাইলাইট করা):'
                        : 'Optimized Keyword Order (First 10 Priority Slots Highlighted):'}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {kwAudit.cleanedOptimized49.map((kw, idx) => (
                        <span
                          key={idx}
                          className={`px-2.5 py-1 rounded-lg text-xs border ${
                            idx < 10
                              ? 'bg-emerald-500/15 border-emerald-500/50 font-bold text-emerald-600 dark:text-emerald-300'
                              : isLight
                              ? 'bg-neutral-100 border-neutral-200 text-neutral-700'
                              : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                          }`}
                        >
                          #{idx + 1} {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 5: DIRECT FILE IPTC/XMP EMBED & BRIDGE SIDECAR           */}
            {/* ============================================================ */}
            {activeTab === 'embed' && (
              <div className="space-y-4">
                <div
                  className={`p-5 rounded-xl border space-y-4 ${
                    isLight ? 'bg-white border-neutral-200' : 'bg-[#11141c] border-neutral-800'
                  }`}
                >
                  <div>
                    <h3 className="text-sm font-bold">
                      {isBn
                        ? 'নিজের ফাইলে সরাসরি IPTC/XMP মেটাডেটা এম্বেড এবং Bridge .xmp Sidecar'
                        : 'Direct In-Browser IPTC/XMP File Embedder & Adobe Bridge .xmp Generator'}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {isBn
                        ? 'আপনার JPG/PNG বা EPS ভেক্টর ফাইলের ভেতর সরাসরি টাইটেল ও ৪৯টি কীওয়ার্ড লিখে নিন, যাতে Adobe Stock বা Shutterstock-এ আপলোড করার সাথে সাথে অটোমেটিক টাইটেল ও ট্যাগ বসে যায়!'
                        : 'Writes your Title and 49 Keywords directly into your JPEG/PNG (EXIF/IPTC) or EPS vector (PostScript DSC + XMP packet), or exports a standalone Adobe Bridge .xmp sidecar.'}
                    </p>
                  </div>

                  <input
                    ref={embedInputRef}
                    type="file"
                    accept="image/*,.eps,.ai"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      setEmbedFile(f);
                    }}
                  />

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => embedInputRef.current?.click()}
                      className={`px-4 py-2.5 rounded-xl border font-bold text-xs flex items-center gap-2 cursor-pointer ${
                        isLight
                          ? 'bg-[#fbfaf8] border-neutral-300 text-neutral-900'
                          : 'bg-neutral-950 border-neutral-700 text-white'
                      }`}
                    >
                      <Upload className="w-4 h-4 text-emerald-500" />
                      <span>
                        {embedFile
                          ? `${embedFile.name} (${(embedFile.size / 1024).toFixed(1)} KB)`
                          : isBn
                          ? '১. আপনার JPG / PNG / EPS ফাইল সিলেক্ট করুন'
                          : '1. Select Your JPG / PNG / EPS File'}
                      </span>
                    </button>

                    <button
                      type="button"
                      disabled={!embedFile || isEmbedding}
                      onClick={handleEmbedIntoOwnFile}
                      className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>
                        {isBn
                          ? '২. মেটাডেটা এম্বেড করা ফাইল ডাউনলোড করুন'
                          : '2. Download File with Embedded IPTC/XMP'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadBridgeXmpSidecar}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileCode className="w-4 h-4" />
                      <span>
                        {isBn ? 'Adobe Bridge .xmp Sidecar ডাউনলোড' : 'Download Adobe Bridge .xmp Sidecar'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 6: UPLOAD & EARNINGS CSV TRACKER                         */}
            {/* ============================================================ */}
            {activeTab === 'tracker' && (
              <div className="space-y-4">
                <div
                  className={`p-5 rounded-xl border space-y-4 ${
                    isLight ? 'bg-white border-neutral-200' : 'bg-[#11141c] border-neutral-800'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold">
                        {isBn
                          ? 'আপলোড স্ট্যাটাস ও আর্নিং CSV ট্র্যাকার'
                          : 'Contributor Upload Status & Earnings CSV Analytics'}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {isBn
                          ? 'কোন ফাইল Submitted, Approved বা Rejected তা ট্র্যাক করুন এবং আর্নিং CSV ইমপোর্ট করে দেখুন কোন টপিকে সবচেয়ে বেশি সেল হচ্ছে।'
                          : 'Track which files are Submitted, Approved, or Rejected, or import your earnings CSV to see which topics generate the highest revenue.'}
                      </p>
                    </div>

                    <input
                      ref={csvImportInputRef}
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleImportEarningsCsv(f);
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => csvImportInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>{isBn ? 'আর্নিং CSV ইমপোর্ট করুন' : 'Import Adobe/Agency Earnings CSV'}</span>
                    </button>
                  </div>

                  {/* Add New File Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                    <input
                      type="text"
                      value={newTrkFile}
                      onChange={(e) => setNewTrkFile(e.target.value)}
                      placeholder={isBn ? 'ফাইলের নাম (যেমন vector_05.eps)' : 'Filename (e.g. vector_05.eps)'}
                      className={`sm:col-span-4 rounded-xl border px-3 py-2 text-xs ${
                        isLight ? 'bg-[#fbfaf8] border-neutral-300' : 'bg-neutral-950 border-neutral-800'
                      }`}
                    />
                    <input
                      type="text"
                      value={newTrkTopic}
                      onChange={(e) => setNewTrkTopic(e.target.value)}
                      placeholder={isBn ? 'টপিক বা নিশ' : 'Topic / Niche'}
                      className={`sm:col-span-4 rounded-xl border px-3 py-2 text-xs ${
                        isLight ? 'bg-[#fbfaf8] border-neutral-300' : 'bg-neutral-950 border-neutral-800'
                      }`}
                    />
                    <select
                      value={newTrkStatus}
                      onChange={(e) => setNewTrkStatus(e.target.value as any)}
                      className={`sm:col-span-2 rounded-xl border px-2.5 py-2 text-xs font-bold ${
                        isLight ? 'bg-[#fbfaf8] border-neutral-300' : 'bg-neutral-950 border-neutral-800'
                      }`}
                    >
                      <option value="SUBMITTED">SUBMITTED</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddTrackedAsset}
                      className="sm:col-span-2 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isBn ? 'যোগ করুন' : 'Add File'}</span>
                    </button>
                  </div>

                  {/* Top Earning Topics Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {Object.entries(topicSummary)
                      .sort((a, b) => b[1].earnings - a[1].earnings)
                      .slice(0, 3)
                      .map(([topic, stat]) => (
                        <div
                          key={topic}
                          className={`p-3.5 rounded-xl border text-xs ${
                            isLight ? 'bg-[#fbfaf8] border-neutral-200' : 'bg-neutral-950 border-neutral-800'
                          }`}
                        >
                          <div className="text-[10px] text-neutral-500 uppercase">
                            {isBn ? 'টপ আর্নিং টপিক' : 'TOP PERFORMING TOPIC'}
                          </div>
                          <div className="font-bold truncate mt-0.5">{topic}</div>
                          <div className="flex items-center justify-between mt-1.5 text-emerald-500 font-bold">
                            <span>{stat.downloads} Downloads</span>
                            <span>${stat.earnings.toFixed(2)} USD</span>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Tracked Assets Table */}
                  <div className="max-h-60 overflow-y-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead
                        className={`sticky top-0 text-[10px] uppercase border-b ${
                          isLight
                            ? 'bg-neutral-100 border-neutral-200 text-neutral-600'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                        }`}
                      >
                        <tr>
                          <th className="py-2 px-3">File</th>
                          <th className="py-2 px-3">Topic / Niche</th>
                          <th className="py-2 px-3">Status</th>
                          <th className="py-2 px-3">Downloads</th>
                          <th className="py-2 px-3">Earnings</th>
                          <th className="py-2 px-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                        {trackedItems.map((item) => (
                          <tr key={item.id}>
                            <td className="py-2 px-3 font-mono font-semibold">{item.fileName}</td>
                            <td className="py-2 px-3">{item.topic}</td>
                            <td className="py-2 px-3">
                              <select
                                value={item.status}
                                onChange={(e) => {
                                  const next = trackedItems.map((it) =>
                                    it.id === item.id ? { ...it, status: e.target.value as any } : it
                                  );
                                  saveTrackerList(next);
                                }}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                  item.status === 'APPROVED'
                                    ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
                                    : item.status === 'REJECTED'
                                    ? 'bg-red-500/15 text-red-500 border-red-500/30'
                                    : 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                                }`}
                              >
                                <option value="SUBMITTED">SUBMITTED</option>
                                <option value="APPROVED">APPROVED</option>
                                <option value="REJECTED">REJECTED</option>
                              </select>
                            </td>
                            <td className="py-2 px-3 font-bold">{item.downloads}</td>
                            <td className="py-2 px-3 font-bold text-emerald-500">
                              ${item.earningsUsd.toFixed(2)}
                            </td>
                            <td className="py-2 px-3 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  saveTrackerList(trackedItems.filter((it) => it.id !== item.id))
                                }
                                className="text-neutral-400 hover:text-red-500 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
