import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sliders, FileText, Search, Filter, Plus, Trash2, Zap, Target,
  ArrowDown, ArrowUp, Edit2, Check, Copy, AlertTriangle, CheckCircle2,
  Sparkles, RefreshCw, Layers, ShieldCheck, ArrowRight, ArrowUpRight,
  GripVertical, Maximize2, LayoutGrid
} from 'lucide-react';
import { BulkItem, MetadataResult } from '../types';

interface SplitManualWorkbenchProps {
  activeItem: BulkItem | null;
  onUpdateItem: (updatedItem: BulkItem) => void;
  themeMode?: 'light' | 'dark';
  showToast: (msg: string) => void;
  onOpenPrecisionStudio?: () => void;
  className?: string;
}

export const SplitManualWorkbench: React.FC<SplitManualWorkbenchProps> = ({
  activeItem,
  onUpdateItem,
  themeMode = 'dark',
  showToast,
  onOpenPrecisionStudio,
  className = '',
}) => {
  const isLight = themeMode === 'light';

  // Fallback default draft if no active item yet
  const [draftTitle, setDraftTitle] = useState<string>('');
  const [draftCategory, setDraftCategory] = useState<string>('Graphic Resources');
  const [draftKeywords, setDraftKeywords] = useState<string[]>([]);
  const [activeAgency, setActiveAgency] = useState<'adobe' | 'shutterstock' | 'freepik' | 'getty' | 'vecteezy'>('adobe');

  // Manual Deck View Mode: 'visual' (Drag & Drop 50-Slot) vs 'raw' (Textarea)
  const [deckMode, setDeckMode] = useState<'visual' | 'raw'>('visual');
  const [rawDelimiter, setRawDelimiter] = useState<',' | ';' | '\n'>(',');
  const [rawTextInput, setRawTextInput] = useState<string>('');
  const [newKeywordInput, setNewKeywordInput] = useState<string>('');

  // Drag & Drop State
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  // Inline Editing
  const [editingTagIdx, setEditingTagIdx] = useState<number | null>(null);
  const [editingTagVal, setEditingTagVal] = useState<string>('');

  // Find & Replace Drawer
  const [showFindReplace, setShowFindReplace] = useState<boolean>(false);
  const [findQuery, setFindQuery] = useState<string>('');
  const [replaceQuery, setReplaceQuery] = useState<string>('');
  const [replaceTarget, setReplaceTarget] = useState<'all' | 'title' | 'keywords'>('all');

  // Disallowed / Negative Keywords Scanner
  const [showNegativeFilter, setShowNegativeFilter] = useState<boolean>(false);
  const [negativeInput, setNegativeInput] = useState<string>('isolated, 4k, 8k, best, stunning, beautiful, awesome, hd');

  // Commercial Copy Space Precision Grid & Calibration
  const [showCopySpaceGrid, setShowCopySpaceGrid] = useState<boolean>(false);

  // Commercial Copy Space Calibration Engine
  const handleApplyCopySpaceFormula = () => {
    let newTitle = draftTitle.trim();
    if (!newTitle.toLowerCase().includes('copy space')) {
      const suffix = ' With Copy Space';
      if ((newTitle + suffix).length <= 70) {
        newTitle = newTitle + suffix;
      } else {
        newTitle = (newTitle.slice(0, 70 - suffix.length).trim() + suffix).trim();
      }
    }
    const copySpaceTags = ['copy space', 'negative space', 'empty background', 'room for text', 'minimalist composition'];
    const filteredExisting = draftKeywords.filter(k => !copySpaceTags.includes(k.toLowerCase()));
    const nextTags = [...copySpaceTags, ...filteredExisting].slice(0, 49);
    commitChanges(newTitle, nextTags);
    showToast('✓ Calibrated Commercial Copy Space formula (+35% RPM potential)');
  };

  // Synchronize when activeItem changes
  useEffect(() => {
    if (activeItem?.result) {
      setDraftTitle(activeItem.result.recommendedTitle || '');
      setDraftCategory(activeItem.result.category || 'Graphic Resources');
      setDraftKeywords([...activeItem.result.keywords]);
      setRawTextInput(activeItem.result.keywords.join(', '));
    } else {
      // Sovereign baseline sample
      const sampleTitle = 'Artisanal Clay Tea Cups On Rustic Wooden Table With Copy Space';
      const sampleTags = [
        'clay tea cup', 'traditional pottery', 'rustic wooden table', 'copy space', 'hot beverage',
        'terracotta craft', 'organic steam', 'morning tea', 'handcrafted ceramic', 'cozy cafe',
        'bangladeshi heritage', 'cha stall', 'still life photography', 'warm daylight', 'food and drink',
        'minimalist background', 'hospitality banner', 'authentic artisan', 'steam rising', 'earthy tones'
      ];
      setDraftTitle(sampleTitle);
      setDraftKeywords(sampleTags);
      setRawTextInput(sampleTags.join(', '));
    }
  }, [activeItem]);

  // Keep raw input updated when delimiter changes
  useEffect(() => {
    const sep = rawDelimiter === '\n' ? '\n' : `${rawDelimiter} `;
    setRawTextInput(draftKeywords.join(sep));
  }, [rawDelimiter]);

  // Push updates back up to activeItem
  const commitChanges = (newTitle: string, newKeywords: string[], newCategory = draftCategory) => {
    setDraftTitle(newTitle);
    setDraftKeywords(newKeywords);
    const sep = rawDelimiter === '\n' ? '\n' : `${rawDelimiter} `;
    setRawTextInput(newKeywords.join(sep));

    if (activeItem && activeItem.result) {
      const updated: BulkItem = {
        ...activeItem,
        result: {
          ...activeItem.result,
          recommendedTitle: newTitle.trim(),
          category: newCategory,
          keywords: newKeywords,
          priorityKeywords: newKeywords.slice(0, 10),
          agencyTitles: {
            ...activeItem.result.agencyTitles,
            adobeStock: newTitle.trim().slice(0, 70),
            shutterstock: `${newTitle.trim()} featuring ${newKeywords.slice(0, 3).join(', ')} for commercial design`,
          }
        }
      };
      onUpdateItem(updated);
    }
  };

  // Title character compliance
  const titleCharCount = draftTitle.trim().length;
  const isTitleCompliant = titleCharCount >= 15 && titleCharCount <= 70;

  // Title to Top-10 Synchronization calculation
  const titleWords = useMemo(() => {
    const stop = new Set(['with', 'from', 'into', 'over', 'under', 'the', 'for', 'in', 'on', 'at', 'to', 'of', 'a', 'an', 'and', 'or', 'by']);
    return draftTitle.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length >= 3 && !stop.has(w));
  }, [draftTitle]);

  const top10Keywords = draftKeywords.slice(0, 10);
  const syncMatches = useMemo(() => {
    return top10Keywords.filter(k => {
      const kTokens = k.toLowerCase().split(/\s+/);
      return kTokens.some(kt => titleWords.includes(kt) || draftTitle.toLowerCase().includes(kt));
    });
  }, [top10Keywords, titleWords, draftTitle]);

  const syncPercentage = Math.min(100, Math.round((syncMatches.length / Math.max(1, Math.min(10, top10Keywords.length))) * 100));

  // Negative words list and scanner
  const negativeList = useMemo(() => {
    return negativeInput.split(/[,;\n]+/).map(s => s.trim().toLowerCase()).filter(s => s.length >= 2);
  }, [negativeInput]);

  const isTagDisallowed = (tag: string) => {
    const lower = tag.toLowerCase();
    return negativeList.some(neg => lower === neg || lower.includes(neg));
  };

  const disallowedCount = useMemo(() => {
    return draftKeywords.filter(isTagDisallowed).length;
  }, [draftKeywords, negativeList]);

  // Drag and Drop Slot Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIdx !== index) {
      setDragOverIdx(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIndex) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      return;
    }

    const next = [...draftKeywords];
    const [moved] = next.splice(draggedIdx, 1);
    next.splice(targetIndex, 0, moved);

    commitChanges(draftTitle, next);
    showToast(`✓ Shifted "${moved}" to Slot #${targetIndex + 1}`);
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  // Slot Manipulation Actions
  const handlePinSlot1 = (index: number) => {
    if (index === 0) return;
    const next = [...draftKeywords];
    const [selected] = next.splice(index, 1);
    next.unshift(selected);
    commitChanges(draftTitle, next);
    showToast(`✓ Locked "${selected}" into Slot #1!`);
  };

  const handleRemoveTag = (index: number) => {
    const next = draftKeywords.filter((_, i) => i !== index);
    commitChanges(draftTitle, next);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const next = [...draftKeywords];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    commitChanges(draftTitle, next);
  };

  const handleMoveDown = (index: number) => {
    if (index >= draftKeywords.length - 1) return;
    const next = [...draftKeywords];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    commitChanges(draftTitle, next);
  };

  const handleAddKeyword = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parts = newKeywordInput.split(',').map(s => s.trim().toLowerCase()).filter(s => s.length >= 2);
    if (parts.length === 0) return;

    const existingLower = new Set(draftKeywords.map(k => k.toLowerCase()));
    const added: string[] = [];
    for (const p of parts) {
      if (!existingLower.has(p) && draftKeywords.length + added.length < 49) {
        existingLower.add(p);
        added.push(p);
      }
    }
    if (added.length > 0) {
      commitChanges(draftTitle, [...draftKeywords, ...added]);
      setNewKeywordInput('');
      showToast(`✓ Added ${added.length} tag(s)!`);
    }
  };

  // Inline Tag Editing Handlers
  const handleStartTagEdit = (idx: number) => {
    setEditingTagIdx(idx);
    setEditingTagVal(draftKeywords[idx] || '');
  };

  const handleCommitTagEdit = (idx: number) => {
    const trimmed = editingTagVal.trim().toLowerCase();
    if (!trimmed) {
      handleRemoveTag(idx);
    } else {
      const next = [...draftKeywords];
      next[idx] = trimmed;
      commitChanges(draftTitle, next);
      showToast(`✓ Updated Slot #${idx + 1} to "${trimmed}"`);
    }
    setEditingTagIdx(null);
    setEditingTagVal('');
  };

  // Find & Replace Execution
  const handleExecuteFindReplace = () => {
    if (!findQuery.trim()) {
      showToast('Please enter a term to search for');
      return;
    }
    const targetRegex = new RegExp(findQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    let titleChanged = false;
    let newTitle = draftTitle;
    let replacedTagCount = 0;

    if (replaceTarget === 'all' || replaceTarget === 'title') {
      if (targetRegex.test(draftTitle)) {
        newTitle = draftTitle.replace(targetRegex, replaceQuery.trim()).replace(/\s+/g, ' ').trim();
        titleChanged = true;
      }
    }

    let nextTags = [...draftKeywords];
    if (replaceTarget === 'all' || replaceTarget === 'keywords') {
      nextTags = [];
      const seen = new Set<string>();
      for (const tag of draftKeywords) {
        if (targetRegex.test(tag)) {
          const replaced = tag.replace(targetRegex, replaceQuery.trim()).replace(/\s+/g, ' ').trim();
          if (replaced.length >= 2 && !seen.has(replaced.toLowerCase())) {
            seen.add(replaced.toLowerCase());
            nextTags.push(replaced);
            replacedTagCount++;
          }
        } else if (!seen.has(tag.toLowerCase())) {
          seen.add(tag.toLowerCase());
          nextTags.push(tag);
        }
      }
    }

    commitChanges(newTitle, nextTags);
    showToast(`✓ Replaced in ${titleChanged ? 'Title + ' : ''}${replacedTagCount} tag(s)`);
    setFindQuery('');
    setReplaceQuery('');
    setShowFindReplace(false);
  };

  // Negative Purge Action
  const handlePurgeDisallowed = () => {
    const beforeCount = draftKeywords.length;
    const cleaned = draftKeywords.filter(tag => !isTagDisallowed(tag));
    const removedCount = beforeCount - cleaned.length;
    commitChanges(draftTitle, cleaned);
    showToast(`✓ Purged ${removedCount} disallowed negative tag(s)`);
  };

  // Sync Raw Delimited Text Buffer
  const handleSyncRawTextToDeck = () => {
    const parts = rawTextInput.split(/[,;\r?\n]+/).map(s => s.trim().toLowerCase()).filter(s => s.length >= 2);
    const seen = new Set<string>();
    const deduplicated: string[] = [];
    for (const p of parts) {
      if (!seen.has(p) && deduplicated.length < 49) {
        seen.add(p);
        deduplicated.push(p);
      }
    }
    commitChanges(draftTitle, deduplicated);
    showToast(`✓ Synchronized ${deduplicated.length} tags to 50-slot deck`);
  };

  // Multi-Agency Export Copy
  const handleCopyPreset = (format: 'adobe' | 'shutterstock' | 'freepik' | 'csv') => {
    let text = '';
    if (format === 'adobe') {
      text = `Title: ${draftTitle}\nKeywords: ${draftKeywords.join(', ')}`;
    } else if (format === 'shutterstock') {
      text = `Description: ${draftTitle}\nKeywords: ${draftKeywords.join(', ')}`;
    } else if (format === 'freepik') {
      text = draftKeywords.join(', ');
    } else if (format === 'csv') {
      const escape = (s: string) => `"${s.replace(/"/g, '""')}"`;
      const fn = activeItem?.file.name || 'custom-commercial-asset.eps';
      text = `"Filename","Title","Keywords","Category"\n${escape(fn)},${escape(draftTitle)},${escape(draftKeywords.join(', '))},${escape(draftCategory)}`;
    }
    navigator.clipboard.writeText(text);
    showToast(`✓ Copied ${format.toUpperCase()} export preset to clipboard`);
  };

  const previewImage = activeItem?.previewUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

  return (
    <div className={`rounded-[32px] border transition-all ${
      isLight
        ? 'bg-[#faf9f6] border-emerald-900/15 text-neutral-900 shadow-xl'
        : 'bg-[#050508] border-emerald-500/20 text-neutral-100 shadow-[0_0_50px_rgba(0,106,78,0.15)]'
    } ${className}`}>
      {/* Top Console Header Bar with Generous Negative Space */}
      <div className={`px-7 py-5 sm:px-9 sm:py-6 border-b flex flex-wrap items-center justify-between gap-5 ${
        isLight
          ? 'border-neutral-200 bg-white/70'
          : 'border-white/10 bg-gradient-to-r from-emerald-950/60 via-black/80 to-emerald-950/40'
      }`}>
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/30 shrink-0">
            <Sliders className="w-5 h-5 text-amber-300" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10.5px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                ALWAYS-OPEN LIVE WORKBENCH
              </span>
              <span className="text-neutral-400 text-xs hidden sm:inline">&middot;</span>
              <span className="text-xs font-mono text-neutral-300 truncate max-w-[200px] sm:max-w-md">
                {activeItem?.file?.name || 'Active Workspace Session'}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Dual-Column Manual Precision Console
            </h3>
          </div>
        </div>

        {/* Console Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Delimiter / Mode switch */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
            <button
              type="button"
              onClick={() => setDeckMode('visual')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                deckMode === 'visual'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>50-Slot Deck</span>
            </button>
            <button
              type="button"
              onClick={() => setDeckMode('raw')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                deckMode === 'raw'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Raw Buffer</span>
            </button>
          </div>

          {onOpenPrecisionStudio && (
            <button
              type="button"
              onClick={onOpenPrecisionStudio}
              className={`px-3.5 py-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-neutral-100 text-neutral-900 border-neutral-300'
                  : 'bg-white/5 hover:bg-white/10 text-emerald-300 border-white/10'
              }`}
              title="Expand to Fullscreen Modal Studio"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fullscreen Studio</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Split Grid: Left 5 Cols (Visual Anchor & Formula) / Right 7 Cols (50-Slot Drag Deck & Cleaners) with Airy Breathing Room */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-200 dark:divide-white/10">
        {/* ========================================================= */}
        {/* LEFT COLUMN (5 Cols): VISUAL ASSET, TITLE & AGENCY ENGINE */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-9 space-y-6">
          {/* Visual Asset Preview, Copy Space Grid & File Specs */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-4 ${
            isLight ? 'bg-white border-neutral-200 shadow-sm' : 'bg-black/40 border-white/10'
          }`}>
            <div className="flex items-center gap-4">
              {/* Asset Thumbnail with Rule-of-Thirds Grid Overlay for Copy Space Verification */}
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-white/15 shrink-0 bg-neutral-950 group">
                <img
                  src={previewImage}
                  alt="Active Asset Preview"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Rule of Thirds Copy Space Overlay */}
                {showCopySpaceGrid && (
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none border border-cyan-400/50">
                    <div className="border-r border-b border-cyan-400/30" />
                    <div className="border-r border-b border-cyan-400/30" />
                    <div className="border-b border-cyan-400/30 bg-emerald-500/20 flex items-center justify-center">
                      <span className="text-[7.5px] font-mono text-emerald-300 font-bold uppercase tracking-tighter">Text</span>
                    </div>
                    <div className="border-r border-b border-cyan-400/30" />
                    <div className="border-r border-b border-cyan-400/30 flex items-center justify-center">
                      <span className="text-[7.5px] font-mono text-cyan-300 font-bold uppercase tracking-tighter">Focus</span>
                    </div>
                    <div className="border-b border-cyan-400/30 bg-emerald-500/25 flex items-center justify-center">
                      <span className="text-[7.5px] font-mono text-emerald-300 font-bold uppercase tracking-tighter">Copy</span>
                    </div>
                    <div className="border-r border-cyan-400/30" />
                    <div className="border-r border-cyan-400/30" />
                    <div className="bg-emerald-500/20 flex items-center justify-center">
                      <span className="text-[7.5px] font-mono text-emerald-300 font-bold uppercase tracking-tighter">Space</span>
                    </div>
                  </div>
                )}

                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-black/85 text-emerald-400 border border-white/10">
                  {activeItem?.file?.name?.split('.').pop()?.toUpperCase() || 'EPS'}
                </span>
              </div>

              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex items-center justify-between text-[10.5px] font-mono text-neutral-400">
                  <span className="uppercase tracking-wider">Format Standard</span>
                  <span className="text-emerald-400 font-bold">100% Commercial Vector/Photo</span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white truncate">
                  {activeItem?.file?.name || 'custom-commercial-asset.eps'}
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {draftCategory} &middot; Ready for Adobe Sensei &amp; Shutterstock catalog ingestion.
                </p>

                <div className="flex items-center gap-2.5 pt-1 text-[11px] font-mono text-neutral-400">
                  <span>Tags: <strong className="text-emerald-400">{draftKeywords.length}</strong>/49</span>
                  <span>&middot;</span>
                  <span>Title Sync: <strong className="text-amber-300">{syncPercentage}%</strong></span>
                </div>
              </div>
            </div>

            {/* Copy Space Precision Inspector Toggle & Yield Badge */}
            <div className="pt-3 border-t border-neutral-200/60 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowCopySpaceGrid(prev => !prev)}
                className={`px-3 py-1.5 rounded-lg text-[10.5px] font-mono font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                  showCopySpaceGrid
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-xs'
                    : isLight
                    ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300'
                }`}
                title="Toggle Rule-of-Thirds Copy Space Grid to visually verify room for typography & ad slogans"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
                <span>{showCopySpaceGrid ? 'Grid Overlay: Active' : 'Copy Space Grid'}</span>
              </button>

              <button
                type="button"
                onClick={handleApplyCopySpaceFormula}
                className="px-3.5 py-1.5 rounded-lg text-[10.5px] font-mono font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 transition flex items-center gap-1 cursor-pointer"
                title="Inject 'With Copy Space' and top negative-space keywords (+35% commercial buyer revenue)"
              >
                <Zap className="w-3 h-3 text-amber-300" />
                <span>+35% RPM Copy Space Formula</span>
              </button>
            </div>
          </div>

          {/* Agency Matrix Switcher */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10.5px] font-mono text-neutral-400">
              <span className="uppercase tracking-wider">AGENCY PRESET SPECIFICATION</span>
              <span className="text-emerald-400 font-semibold">Live Conversion Matrix</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5 text-[10px] font-mono font-bold">
              {[
                { id: 'adobe', label: 'Adobe (<70c)' },
                { id: 'shutterstock', label: 'Shutter (50 KW)' },
                { id: 'freepik', label: 'Freepik (30 KW)' },
                { id: 'getty', label: 'Getty (35 KW)' },
                { id: 'vecteezy', label: 'Vecteezy' },
              ].map((ag) => (
                <button
                  key={ag.id}
                  type="button"
                  onClick={() => setActiveAgency(ag.id as any)}
                  className={`py-1 px-1 text-center rounded-lg border transition truncate cursor-pointer ${
                    activeAgency === ag.id
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                      : isLight ? 'bg-white border-neutral-200 text-neutral-700' : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  {ag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subject-First Commercial Title Studio */}
          <div className={`p-4 rounded-2xl border space-y-3 ${
            isLight ? 'bg-white border-neutral-200' : 'bg-black/50 border-emerald-500/20'
          }`}>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-emerald-400 uppercase tracking-wider">
                SUBJECT-FIRST TITLE ENGINE
              </span>
              <span className={`font-bold tabular-nums ${isTitleCompliant ? 'text-emerald-400' : 'text-amber-400'}`}>
                {titleCharCount}/70 Chars
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={draftTitle}
                onChange={(e) => commitChanges(e.target.value, draftKeywords)}
                placeholder="[Primary Subject] + [Action/Pose] + [Setting] + [Copy Space]..."
                className={`w-full text-xs font-semibold rounded-xl px-3.5 py-2.5 border focus:outline-none transition ${
                  isLight
                    ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-emerald-500'
                    : 'bg-neutral-950 border-white/15 text-white focus:border-emerald-400'
                }`}
              />
            </div>

            {/* Tachometer Bar */}
            <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden border border-white/5">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  titleCharCount <= 70
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                    : 'bg-gradient-to-r from-amber-500 to-rose-500'
                }`}
                style={{ width: `${Math.min(100, (titleCharCount / 70) * 100)}%` }}
              />
            </div>

            {/* Title Formula Quick Inserters */}
            <div className="flex flex-wrap items-center gap-1 pt-1">
              {['With Copy Space', 'Isolated On White', 'Top View Flat Lay', 'Studio Lighting'].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    if (!draftTitle.toLowerCase().includes(chip.toLowerCase())) {
                      const next = `${draftTitle.trim()} ${chip}`.replace(/\s+/g, ' ').trim().slice(0, 70);
                      commitChanges(next, draftKeywords);
                    }
                  }}
                  className={`text-[9.5px] font-mono px-2 py-0.5 rounded border font-medium transition cursor-pointer ${
                    isLight ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800' : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300'
                  }`}
                >
                  + {chip}
                </button>
              ))}
            </div>

            {/* Manual Title Tuning Transformers */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 pt-2 border-t border-white/10 text-[10px] font-mono">
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-neutral-400">Tuning:</span>
                <button
                  type="button"
                  onClick={() => {
                    const transformed = draftTitle.replace(/\b\w/g, c => c.toUpperCase());
                    commitChanges(transformed, draftKeywords);
                    showToast('✓ Title Case applied');
                  }}
                  className={`px-1.5 py-0.5 rounded border transition cursor-pointer ${
                    isLight ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800' : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300'
                  }`}
                >
                  Title Case
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const transformed = draftTitle.charAt(0).toUpperCase() + draftTitle.slice(1).toLowerCase();
                    commitChanges(transformed, draftKeywords);
                    showToast('✓ Sentence case applied');
                  }}
                  className={`px-1.5 py-0.5 rounded border transition cursor-pointer ${
                    isLight ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800' : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300'
                  }`}
                >
                  Sentence case
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const cleaned = draftTitle.replace(/\.+$/, '').trim();
                    commitChanges(cleaned, draftKeywords);
                    showToast('✓ Removed trailing punctuation');
                  }}
                  className={`px-1.5 py-0.5 rounded border transition cursor-pointer ${
                    isLight ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800' : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300'
                  }`}
                >
                  Strip Period
                </button>
                {titleCharCount > 70 && (
                  <button
                    type="button"
                    onClick={() => {
                      const trimmed = draftTitle.slice(0, 70).replace(/\s+\S*$/, '');
                      commitChanges(trimmed, draftKeywords);
                      showToast(`✓ Trimmed to ${trimmed.length} characters under limit`);
                    }}
                    className="px-1.5 py-0.5 rounded border bg-amber-500/20 border-amber-400 text-amber-300 font-bold transition cursor-pointer"
                  >
                    Trim &lt;70c
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  const cleanedTitleWords = titleWords.filter(w => !draftKeywords.includes(w));
                  commitChanges(draftTitle, [...cleanedTitleWords, ...draftKeywords].slice(0, 49));
                  showToast('✓ Mirrored Title words into Priority Keyword Slots!');
                }}
                className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Zap className="w-3 h-3 text-amber-300" />
                <span>Mirror Title to Slots 1–5</span>
              </button>
            </div>
          </div>

          {/* Quick Export Clipboard Bar */}
          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[10.5px] font-mono">
            <span className="text-neutral-400">1-Click Export Preset:</span>
            <div className="flex items-center gap-1">
              {(['adobe', 'shutterstock', 'freepik', 'csv'] as const).map(fmt => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => handleCopyPreset(fmt)}
                  className={`px-2.5 py-1 rounded-lg border font-bold transition cursor-pointer ${
                    isLight
                      ? 'bg-white hover:bg-neutral-50 border-neutral-300 text-neutral-800'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300 hover:text-white'
                  }`}
                >
                  {fmt.charAt(0).toUpperCase() + fmt.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN (7 Cols): 50-SLOT DRAG DECK & MANUAL TOOLS   */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-9 space-y-6">
          {/* Sub-Toolbar: Mode Switcher & Tool Drawers */}
          <div className={`p-3 rounded-2xl border flex flex-wrap items-center justify-between gap-2 ${
            isLight ? 'bg-white border-neutral-200' : 'bg-black/40 border-white/10'
          }`}>
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setShowFindReplace(prev => !prev)}
                className={`px-2.5 py-1 rounded-lg border transition flex items-center gap-1 cursor-pointer ${
                  showFindReplace
                    ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300 font-bold'
                    : isLight ? 'bg-neutral-100 border-neutral-300 text-neutral-800' : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Find &amp; Replace</span>
              </button>

              <button
                type="button"
                onClick={() => setShowNegativeFilter(prev => !prev)}
                className={`px-2.5 py-1 rounded-lg border transition flex items-center gap-1 cursor-pointer ${
                  showNegativeFilter || disallowedCount > 0
                    ? disallowedCount > 0
                      ? 'bg-rose-500/20 border-rose-500/60 text-rose-300 font-bold'
                      : 'bg-emerald-600/30 border-emerald-400 text-emerald-300 font-bold'
                    : isLight ? 'bg-neutral-100 border-neutral-300 text-neutral-800' : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Negative Scanner</span>
                {disallowedCount > 0 && (
                  <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                    {disallowedCount}
                  </span>
                )}
              </button>
            </div>

            {/* Quick Cleaners */}
            <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => {
                  const seen = new Set<string>();
                  const deduplicated: string[] = [];
                  for (const k of draftKeywords) {
                    const base = k.toLowerCase().replace(/s$/, '');
                    if (!seen.has(base)) {
                      seen.add(base);
                      deduplicated.push(k);
                    }
                  }
                  commitChanges(draftTitle, deduplicated);
                  showToast(`✓ Deduplicated tags (${draftKeywords.length - deduplicated.length} removed)`);
                }}
                className={`px-2 py-0.5 rounded border transition cursor-pointer ${
                  isLight ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800' : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300'
                }`}
              >
                Deduplicate
              </button>
              <button
                type="button"
                onClick={() => {
                  const cleaned = draftKeywords.filter(k => !/\b(best|amazing|stunning|beautiful|awesome|4k|8k|hd|isolated)\b/i.test(k));
                  commitChanges(draftTitle, cleaned);
                  showToast('✓ Stripped promotional fillers');
                }}
                className={`px-2 py-0.5 rounded border transition cursor-pointer ${
                  isLight ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800' : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300'
                }`}
              >
                Strip Fillers
              </button>
              <button
                type="button"
                onClick={() => {
                  const sorted = [...draftKeywords].sort((a, b) => a.localeCompare(b));
                  commitChanges(draftTitle, sorted);
                  showToast('✓ Alphabetized keyword deck');
                }}
                className={`px-2 py-0.5 rounded border transition cursor-pointer ${
                  isLight ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800' : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300'
                }`}
              >
                Sort A–Z
              </button>
              <button
                type="button"
                onClick={() => {
                  const reversed = [...draftKeywords].reverse();
                  commitChanges(draftTitle, reversed);
                  showToast('✓ Reversed keyword order');
                }}
                className={`px-2 py-0.5 rounded border transition cursor-pointer ${
                  isLight ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800' : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300'
                }`}
              >
                Reverse
              </button>
            </div>
          </div>

          {/* Drawer: Find & Replace */}
          {showFindReplace && (
            <div className={`p-4 rounded-2xl border space-y-2.5 animate-fade-in ${
              isLight ? 'bg-white border-neutral-300 shadow-sm' : 'bg-black/90 border-emerald-500/40'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400">
                <span>MANUAL FIND &amp; REPLACE ENGINE</span>
                <button
                  type="button"
                  onClick={() => setShowFindReplace(false)}
                  className="text-neutral-400 hover:text-white text-xs cursor-pointer"
                >
                  &times; Close
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={findQuery}
                  onChange={(e) => setFindQuery(e.target.value)}
                  placeholder="Find word (e.g. vector)..."
                  className={`text-xs rounded-lg px-2.5 py-1.5 border focus:outline-none ${
                    isLight ? 'bg-neutral-50 border-neutral-300 text-neutral-900' : 'bg-neutral-950 border-white/15 text-white focus:border-emerald-400'
                  }`}
                />
                <input
                  type="text"
                  value={replaceQuery}
                  onChange={(e) => setReplaceQuery(e.target.value)}
                  placeholder="Replace with..."
                  className={`text-xs rounded-lg px-2.5 py-1.5 border focus:outline-none ${
                    isLight ? 'bg-neutral-50 border-neutral-300 text-neutral-900' : 'bg-neutral-950 border-white/15 text-white focus:border-emerald-400'
                  }`}
                />
                <div className="flex gap-1.5">
                  <select
                    value={replaceTarget}
                    onChange={(e) => setReplaceTarget(e.target.value as any)}
                    className={`flex-1 text-xs rounded-lg px-2 py-1.5 border focus:outline-none cursor-pointer ${
                      isLight ? 'bg-neutral-50 border-neutral-300 text-neutral-900' : 'bg-neutral-950 border-white/15 text-white'
                    }`}
                  >
                    <option value="all">All</option>
                    <option value="title">Title Only</option>
                    <option value="keywords">Keywords Only</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleExecuteFindReplace}
                    disabled={!findQuery.trim()}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 transition cursor-pointer"
                  >
                    Replace
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Drawer: Negative Scanner */}
          {showNegativeFilter && (
            <div className={`p-4 rounded-2xl border space-y-2.5 animate-fade-in ${
              isLight ? 'bg-white border-neutral-300 shadow-sm' : 'bg-black/90 border-rose-500/40'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono font-bold text-rose-400">
                <span>DISALLOWED &amp; NEGATIVE KEYWORDS SCANNER</span>
                <button
                  type="button"
                  onClick={() => setShowNegativeFilter(false)}
                  className="text-neutral-400 hover:text-white text-xs cursor-pointer"
                >
                  &times; Close
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={negativeInput}
                  onChange={(e) => setNegativeInput(e.target.value)}
                  placeholder="Comma-separated forbidden terms..."
                  className={`flex-1 text-xs font-mono rounded-lg px-2.5 py-1.5 border focus:outline-none ${
                    isLight ? 'bg-neutral-50 border-neutral-300 text-neutral-900' : 'bg-neutral-950 border-white/15 text-white focus:border-rose-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={handlePurgeDisallowed}
                  disabled={disallowedCount === 0}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-40 transition cursor-pointer whitespace-nowrap flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Purge {disallowedCount} Tag(s)</span>
                </button>
              </div>
            </div>
          )}

          {/* MODE 1: RAW DELIMITED TEXT BUFFER */}
          {deckMode === 'raw' && (
            <div className={`p-4 rounded-2xl border space-y-3 ${
              isLight ? 'bg-white border-neutral-300 shadow-sm' : 'bg-black/60 border-emerald-500/30'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-bold uppercase tracking-wider">
                  Raw Monospace Buffer (Live 50-Slot Sync)
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-neutral-400">Delimiter:</span>
                  {([' , ', ' ; ', '\n'] as const).map(d => {
                    const val = d.trim() as ',' | ';' | '\n';
                    const label = d === '\n' ? 'Line Break' : d.trim();
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setRawDelimiter(val)}
                        className={`px-2 py-0.5 rounded border transition cursor-pointer font-bold ${
                          rawDelimiter === val
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : isLight ? 'bg-neutral-100 border-neutral-300 text-neutral-800' : 'bg-white/5 border-white/10 text-neutral-400'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <textarea
                rows={7}
                value={rawTextInput}
                onChange={(e) => setRawTextInput(e.target.value)}
                placeholder="paste keywords here, separated by comma, semicolon, or newline..."
                className={`w-full font-mono text-xs leading-relaxed rounded-xl p-3 border focus:outline-none transition resize-y ${
                  isLight
                    ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-emerald-500'
                    : 'bg-neutral-950 border-white/15 text-emerald-200 focus:border-emerald-400'
                }`}
              />

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="text-neutral-400">
                  Tags in buffer: <strong className="text-emerald-400">{rawTextInput.split(/[,;\n]+/).filter(s => s.trim().length >= 2).length}</strong> / 49 max
                </div>
                <button
                  type="button"
                  onClick={handleSyncRawTextToDeck}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-md shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Sync Buffer to 50-Slot Deck</span>
                </button>
              </div>
            </div>
          )}

          {/* MODE 2: VISUAL DRAG & DROP 50-SLOT DECK */}
          {deckMode === 'visual' && (
            <div className="space-y-3.5">
              {/* Quick Tag Injector */}
              <form onSubmit={handleAddKeyword} className="flex gap-2">
                <input
                  type="text"
                  value={newKeywordInput}
                  onChange={(e) => setNewKeywordInput(e.target.value)}
                  placeholder="+ Type keyword and press Enter (or comma-separated list)..."
                  className={`flex-1 rounded-xl px-3.5 py-2 text-xs font-medium border focus:outline-none ${
                    isLight
                      ? 'bg-white border-neutral-300 text-neutral-900'
                      : 'bg-neutral-950 border-white/15 text-white focus:border-emerald-400'
                  }`}
                />
                <button
                  type="submit"
                  disabled={!newKeywordInput.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 transition flex items-center gap-1 cursor-pointer shadow-md shadow-emerald-600/20 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </form>

              {/* TIER 1: SLOTS 1–5 (50% SEARCH WEIGHT) */}
              <div className={`p-3.5 rounded-2xl border ${
                isLight ? 'bg-amber-50/70 border-amber-300' : 'bg-gradient-to-r from-amber-500/10 via-black/40 to-amber-500/5 border-amber-400/40'
              } space-y-2`}>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>TIER 1 &middot; SLOTS #1 TO #5 (PRIMARY RANK WEIGHT)</span>
                  </span>
                  <span className="text-[10px] text-amber-400/80 uppercase">Drag to Reorder</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {draftKeywords.slice(0, 5).map((kw, i) => {
                    const isFlagged = isTagDisallowed(kw);
                    const isEditing = editingTagIdx === i;
                    const isBeingDragged = draggedIdx === i;
                    const isOver = dragOverIdx === i;

                    return (
                      <div
                        key={kw + i}
                        draggable
                        onDragStart={(e) => handleDragStart(e, i)}
                        onDragOver={(e) => handleDragOver(e, i)}
                        onDrop={(e) => handleDrop(e, i)}
                        onDragEnd={handleDragEnd}
                        className={`p-2.5 rounded-xl border flex flex-col justify-between group cursor-grab active:cursor-grabbing transition-all ${
                          isBeingDragged ? 'opacity-40 scale-95 border-dashed border-amber-400' : ''
                        } ${
                          isOver ? 'ring-2 ring-emerald-400 bg-emerald-950/40' : ''
                        } ${
                          isFlagged
                            ? 'bg-rose-500/20 border-rose-500 text-rose-200 shadow-[0_0_15px_rgba(244,42,65,0.2)]'
                            : 'border-amber-400/50 bg-amber-500/10 hover:border-amber-400'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <div className="flex items-center gap-1">
                            <GripVertical className="w-3 h-3 text-neutral-400 opacity-40 group-hover:opacity-100" />
                            <span className="text-[9.5px] font-mono font-bold bg-amber-400 text-neutral-950 w-4 h-4 rounded flex items-center justify-center shrink-0">
                              #{i + 1}
                            </span>
                            {isFlagged && <AlertTriangle className="w-3 h-3 text-rose-400" />}
                          </div>

                          <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => handleMoveDown(i)}
                              disabled={i === 4}
                              className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer"
                              title="Shift down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(i)}
                              className="p-1 hover:bg-rose-500/20 rounded text-rose-400 cursor-pointer"
                              title="Delete tag"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={editingTagVal}
                              onChange={(e) => setEditingTagVal(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCommitTagEdit(i);
                                if (e.key === 'Escape') setEditingTagIdx(null);
                              }}
                              autoFocus
                              className="w-full text-xs font-bold rounded px-1 py-0.5 bg-black border border-amber-400 text-white focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleCommitTagEdit(i)}
                              className="text-emerald-400 p-0.5 cursor-pointer"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div
                            onDoubleClick={() => handleStartTagEdit(i)}
                            className="text-xs font-bold text-white truncate cursor-pointer hover:text-amber-200 flex items-center justify-between"
                            title="Double-click to edit inline"
                          >
                            <span className="truncate">{kw}</span>
                            <Edit2
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartTagEdit(i);
                              }}
                              className="w-2.5 h-2.5 opacity-0 group-hover:opacity-70 text-neutral-400 hover:text-white shrink-0 ml-1"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TIER 2: SLOTS 6–10 (25% SEARCH WEIGHT) */}
              <div className={`p-3.5 rounded-2xl border ${
                isLight ? 'bg-emerald-50/60 border-emerald-300' : 'bg-gradient-to-r from-emerald-500/10 via-black/40 to-emerald-500/5 border-emerald-500/35'
              } space-y-2`}>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-300">
                  <span className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-emerald-400" />
                    <span>TIER 2 &middot; SLOTS #6 TO #10 (SECONDARY WEIGHT)</span>
                  </span>
                  <span className="text-[10px] text-emerald-400/80 uppercase">Drag to Reorder</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {draftKeywords.slice(5, 10).map((kw, idx) => {
                    const actualIdx = 5 + idx;
                    const isFlagged = isTagDisallowed(kw);
                    const isEditing = editingTagIdx === actualIdx;
                    const isBeingDragged = draggedIdx === actualIdx;
                    const isOver = dragOverIdx === actualIdx;

                    return (
                      <div
                        key={kw + actualIdx}
                        draggable
                        onDragStart={(e) => handleDragStart(e, actualIdx)}
                        onDragOver={(e) => handleDragOver(e, actualIdx)}
                        onDrop={(e) => handleDrop(e, actualIdx)}
                        onDragEnd={handleDragEnd}
                        className={`p-2.5 rounded-xl border flex flex-col justify-between group cursor-grab active:cursor-grabbing transition-all ${
                          isBeingDragged ? 'opacity-40 scale-95 border-dashed border-emerald-400' : ''
                        } ${
                          isOver ? 'ring-2 ring-emerald-400 bg-emerald-950/40' : ''
                        } ${
                          isFlagged
                            ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                            : 'border-emerald-500/40 bg-emerald-500/10 hover:border-emerald-400'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <div className="flex items-center gap-1">
                            <GripVertical className="w-3 h-3 text-neutral-400 opacity-40 group-hover:opacity-100" />
                            <span className="text-[9.5px] font-mono font-bold bg-emerald-500 text-white w-4 h-4 rounded flex items-center justify-center shrink-0">
                              #{actualIdx + 1}
                            </span>
                            {isFlagged && <AlertTriangle className="w-3 h-3 text-rose-400" />}
                          </div>

                          <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => handlePinSlot1(actualIdx)}
                              className="text-[9px] font-mono font-bold text-amber-300 hover:underline px-1 cursor-pointer"
                              title="Promote to Slot #1"
                            >
                              Pin #1
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(actualIdx)}
                              className="p-1 hover:bg-rose-500/20 rounded text-rose-400 cursor-pointer"
                              title="Delete tag"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={editingTagVal}
                              onChange={(e) => setEditingTagVal(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCommitTagEdit(actualIdx);
                                if (e.key === 'Escape') setEditingTagIdx(null);
                              }}
                              autoFocus
                              className="w-full text-xs font-bold rounded px-1 py-0.5 bg-black border border-emerald-400 text-white focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleCommitTagEdit(actualIdx)}
                              className="text-emerald-400 p-0.5 cursor-pointer"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div
                            onDoubleClick={() => handleStartTagEdit(actualIdx)}
                            className="text-xs font-bold text-white truncate cursor-pointer hover:text-emerald-200 flex items-center justify-between"
                            title="Double-click to edit inline"
                          >
                            <span className="truncate">{kw}</span>
                            <Edit2
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartTagEdit(actualIdx);
                              }}
                              className="w-2.5 h-2.5 opacity-0 group-hover:opacity-70 text-neutral-400 hover:text-white shrink-0 ml-1"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TIER 3: SLOTS 11–49 (DISCOVERY NET) */}
              <div className={`p-3.5 rounded-2xl border ${
                isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-black/40 border-white/10'
              } space-y-2`}>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-neutral-300">
                  <span>TIER 3 &middot; SLOTS #11 TO #{draftKeywords.length} (LONG-TAIL DISCOVERY)</span>
                  <span className="text-[10px] text-neutral-400">{draftKeywords.slice(10).length} tags</span>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto pr-1">
                  {draftKeywords.slice(10).map((kw, idx) => {
                    const actualIdx = 10 + idx;
                    const isFlagged = isTagDisallowed(kw);
                    const isEditing = editingTagIdx === actualIdx;
                    const isBeingDragged = draggedIdx === actualIdx;
                    const isOver = dragOverIdx === actualIdx;

                    if (isEditing) {
                      return (
                        <span key={kw + actualIdx} className="inline-flex items-center gap-1 bg-black border border-emerald-400 rounded-xl px-2 py-0.5">
                          <input
                            type="text"
                            value={editingTagVal}
                            onChange={(e) => setEditingTagVal(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleCommitTagEdit(actualIdx);
                              if (e.key === 'Escape') setEditingTagIdx(null);
                            }}
                            autoFocus
                            className="text-xs font-bold bg-transparent text-white focus:outline-none w-28"
                          />
                          <button
                            type="button"
                            onClick={() => handleCommitTagEdit(actualIdx)}
                            className="text-emerald-400 p-0.5 cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </span>
                      );
                    }

                    return (
                      <span
                        key={kw + actualIdx}
                        draggable
                        onDragStart={(e) => handleDragStart(e, actualIdx)}
                        onDragOver={(e) => handleDragOver(e, actualIdx)}
                        onDrop={(e) => handleDrop(e, actualIdx)}
                        onDragEnd={handleDragEnd}
                        onDoubleClick={() => handleStartTagEdit(actualIdx)}
                        className={`text-xs px-2.5 py-1 rounded-xl border flex items-center gap-1.5 group cursor-grab active:cursor-grabbing transition-all ${
                          isBeingDragged ? 'opacity-40 scale-95 border-dashed border-emerald-400' : ''
                        } ${
                          isOver ? 'ring-2 ring-emerald-400 bg-emerald-950/40' : ''
                        } ${
                          isFlagged
                            ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                            : isLight
                            ? 'bg-white border-neutral-200 text-neutral-800'
                            : 'bg-white/[0.04] border-white/10 text-neutral-200 hover:border-emerald-400'
                        }`}
                      >
                        <GripVertical className="w-2.5 h-2.5 text-neutral-500 opacity-0 group-hover:opacity-100" />
                        <span className="text-[9px] font-mono text-neutral-500">#{actualIdx + 1}</span>
                        <span>{kw}</span>
                        {isFlagged && <AlertTriangle className="w-3 h-3 text-rose-400" />}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePinSlot1(actualIdx);
                          }}
                          className="text-[9px] text-amber-300 hover:underline opacity-0 group-hover:opacity-100 transition cursor-pointer"
                          title="Promote to Slot #1"
                        >
                          Pin
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartTagEdit(actualIdx);
                          }}
                          className="text-neutral-500 hover:text-white opacity-0 group-hover:opacity-100 transition cursor-pointer"
                          title="Edit keyword"
                        >
                          <Edit2 className="w-2.5 h-2.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveTag(actualIdx);
                          }}
                          className="text-neutral-500 hover:text-rose-400 transition cursor-pointer"
                          title="Delete tag"
                        >
                          &times;
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
