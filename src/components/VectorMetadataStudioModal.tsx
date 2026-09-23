import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Upload, 
  FileCode, 
  Sparkles, 
  Download, 
  Check, 
  Copy, 
  RefreshCw, 
  ShieldCheck, 
  Layers, 
  AlertCircle, 
  FileSpreadsheet, 
  Info, 
  Code, 
  Eye, 
  Trash2,
  Wand2,
  FileCheck
} from 'lucide-react';
import { generateXmpSidecarXml, embedMetadataIntoEps } from '../lib/metadataEmbedder';

interface VectorMetadataStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
  customApiKey?: string;
  isPro?: boolean;
}

export function VectorMetadataStudioModal({
  isOpen,
  onClose,
  onToast,
  customApiKey,
  isPro = false
}: VectorMetadataStudioModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);
  const [previewTab, setPreviewTab] = useState<'editor' | 'xmp_preview' | 'postscript_preview'>('editor');
  const [extractedHeader, setExtractedHeader] = useState<{ title?: string; creator?: string; boundingBox?: string }>({});
  const [copiedXmp, setCopiedXmp] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = async (uploadedFile: File) => {
    const ext = uploadedFile.name.split('.').pop()?.toLowerCase() || '';
    if (ext !== 'eps' && ext !== 'ai') {
      onToast('Please upload an .EPS or .AI vector file.');
      return;
    }

    setFile(uploadedFile);
    setTitle('');
    setDescription('');
    setKeywords([]);
    setExtractedHeader({});

    // Read first 32KB to parse existing PostScript comments (%%Title, %%Creator, %%BoundingBox, %%Keywords)
    try {
      const slice = await uploadedFile.slice(0, 32768).text();
      const titleMatch = slice.match(/%%Title:\s*(.+)/i);
      const creatorMatch = slice.match(/%%Creator:\s*(.+)/i);
      const bboxMatch = slice.match(/%%BoundingBox:\s*(.+)/i);
      const kwMatch = slice.match(/%%Keywords:\s*(.+)/i);

      const parsedTitle = titleMatch ? titleMatch[1].replace(/[\r\n]/g, '').trim() : '';
      const parsedCreator = creatorMatch ? creatorMatch[1].replace(/[\r\n]/g, '').trim() : '';
      const parsedBbox = bboxMatch ? bboxMatch[1].replace(/[\r\n]/g, '').trim() : '';

      setExtractedHeader({
        title: parsedTitle || undefined,
        creator: parsedCreator || undefined,
        boundingBox: parsedBbox || undefined
      });

      if (parsedTitle) {
        setTitle(parsedTitle);
        setDescription(`${parsedTitle} scalable vector graphic illustration template.`);
      } else {
        const cleanName = uploadedFile.name
          .replace(/\.(eps|ai)$/i, '')
          .replace(/[-_]+/g, ' ')
          .trim();
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1) + ' Vector Illustration');
        setDescription(`${cleanName} editable scalable vector background template.`);
      }

      if (kwMatch && kwMatch[1]) {
        const existingTags = kwMatch[1]
          .split(/[,;]+/)
          .map(k => k.trim())
          .filter(Boolean);
        if (existingTags.length > 0) {
          setKeywords(Array.from(new Set([...existingTags, 'vector', 'eps', 'scalable', 'graphic'])));
        } else {
          setKeywords(['vector', 'eps', 'illustration', 'graphic', 'editable', 'design element']);
        }
      } else {
        setKeywords(['vector', 'eps', 'illustration', 'graphic', 'editable', 'design element', 'scalable']);
      }

      onToast(`Loaded ${uploadedFile.name} successfully!`);
    } catch (err) {
      console.warn('EPS parse error:', err);
    }
  };

  const handleAiSuggest = async () => {
    if (!file && !title) {
      onToast('Upload a vector file or enter a vector title first.');
      return;
    }

    setIsGeneratingAI(true);
    onToast('Generating high-ranking vector metadata with Gemini AI...');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(customApiKey ? { 'x-api-key': customApiKey } : {})
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              parts: [
                {
                  text: `You are a microstock vector SEO specialist for Adobe Stock, Shutterstock, Freepik, and Vecteezy.
Generate commercial vector metadata for the vector graphic: "${title || file?.name}".
Format your answer strictly as a JSON object:
{
  "recommendedTitle": "High-converting 60-80 character title ending with 'vector illustration' or 'vector template'",
  "shortDescription": "1-sentence descriptive caption specifying color palette, design style, and commercial use-case",
  "keywords": ["vector", "eps", "scalable", "editable", ...40 high-relevance single or 2-word vector tags]
}
Return ONLY valid raw JSON.`
                }
              ]
            }
          ],
          systemInstruction: 'You are a microstock vector SEO specialist. Strictly return JSON only.'
        })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const rawText = data.text || '';
      const cleanJsonStr = rawText.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJsonStr);

      if (parsed.recommendedTitle) setTitle(parsed.recommendedTitle);
      if (parsed.shortDescription) setDescription(parsed.shortDescription);
      if (Array.isArray(parsed.keywords) && parsed.keywords.length > 0) {
        setKeywords(parsed.keywords.map((k: string) => k.toLowerCase().trim()).filter(Boolean));
      }
      onToast('AI vector metadata generated!');
    } catch (e: any) {
      console.error('Vector AI suggestion error:', e);
      onToast('Generated fallback vector tags.');
      if (!title && file) {
        setTitle(file.name.replace(/\.(eps|ai)$/i, '') + ' Vector Illustration');
      }
      const defaultVectorTags = [
        'vector', 'eps', 'graphic', 'illustration', 'scalable', 'editable',
        'design element', 'template', 'isolated', 'modern', 'digital art',
        'flat design', 'background', 'clipart', 'creative', 'symbol', 'icon'
      ];
      setKeywords(prev => Array.from(new Set([...prev, ...defaultVectorTags])));
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const addTag = (e?: React.KeyboardEvent) => {
    if (e && e.key !== 'Enter' && e.key !== ',') return;
    if (e) e.preventDefault();
    const clean = tagInput.replace(/,/g, '').trim().toLowerCase();
    if (!clean) return;
    if (!keywords.includes(clean)) {
      setKeywords([...keywords, clean]);
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setKeywords(keywords.filter(t => t !== tagToRemove));
  };

  const handleDownloadXmp = () => {
    if (!title.trim()) {
      onToast('Please enter a title before exporting.');
      return;
    }
    const xmpContent = generateXmpSidecarXml(title, keywords, description);
    const blob = new Blob([xmpContent], { type: 'application/rdf+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const baseName = file ? file.name.replace(/\.(eps|ai)$/i, '') : 'vector_metadata';
    a.download = `${baseName}.xmp`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    onToast(`✓ Downloaded ${baseName}.xmp sidecar!`);
  };

  const handleEmbedInternalVector = async () => {
    if (!file) {
      onToast('Please upload an EPS file to inject internal metadata.');
      return;
    }
    if (!title.trim()) {
      onToast('Please enter a title before embedding.');
      return;
    }

    setIsInjecting(true);
    try {
      onToast('Injecting PostScript DSC comments & Adobe XMP block into EPS...');
      const injectedBlob = await embedMetadataIntoEps(file, title, keywords, description);
      const url = URL.createObjectURL(injectedBlob);
      const a = document.createElement('a');
      a.href = url;
      const baseName = file.name.replace(/\.(eps|ai)$/i, '');
      a.download = `${baseName}_tagged.eps`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      onToast(`✓ Success! Downloaded ${baseName}_tagged.eps with embedded metadata!`);
    } catch (err: any) {
      console.error('EPS embed error:', err);
      onToast(`Error writing metadata: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsInjecting(false);
    }
  };

  const copyXmpXml = () => {
    const xmpContent = generateXmpSidecarXml(title, keywords, description);
    navigator.clipboard.writeText(xmpContent);
    setCopiedXmp(true);
    setTimeout(() => setCopiedXmp(false), 2000);
    onToast('Copied XMP XML to clipboard!');
  };

  const generatedXmp = generateXmpSidecarXml(title || 'Vector Title', keywords, description || title);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Vector EPS & AI Metadata Studio</h3>
                <span className="text-[10px] uppercase tracking-wider font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  XMP & PostScript DSC
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Directly inspect, edit, and write internal metadata to EPS vectors or export Adobe XMP sidecars
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Dropzone for EPS / AI */}
          {!file ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-slate-700 bg-slate-950/40 hover:border-amber-500/50 hover:bg-slate-950/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".eps,.ai,application/postscript,application/illustrator"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="hidden"
              />
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                <Upload className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-200">Upload Vector File (.EPS / .AI)</h4>
              <p className="text-xs text-slate-400 mt-1">
                Drag & drop or click to choose your Adobe Illustrator or EPS vector graphic
              </p>
              <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-slate-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Supports Adobe PostScript Level 2/3, DSC Comments, & XMP Packet injection</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <FileCode className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{file.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                    {extractedHeader.creator && (
                      <>
                        <span>•</span>
                        <span className="text-amber-400/90 font-mono text-[11px]">
                          Creator: {extractedHeader.creator.substring(0, 24)}
                        </span>
                      </>
                    )}
                    {extractedHeader.boundingBox && (
                      <>
                        <span>•</span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          BBox: {extractedHeader.boundingBox}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition"
                >
                  Change File
                </button>
                <button
                  onClick={() => {
                    setFile(null);
                    setTitle('');
                    setDescription('');
                    setKeywords([]);
                  }}
                  className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2.5 py-1.5 rounded-lg border border-red-500/20 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".eps,.ai,application/postscript,application/illustrator"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-800 gap-4">
            <button
              onClick={() => setPreviewTab('editor')}
              className={`pb-2.5 text-xs font-bold transition flex items-center gap-1.5 border-b-2 ${
                previewTab === 'editor'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Metadata Fields</span>
            </button>
            <button
              onClick={() => setPreviewTab('xmp_preview')}
              className={`pb-2.5 text-xs font-bold transition flex items-center gap-1.5 border-b-2 ${
                previewTab === 'xmp_preview'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Adobe XMP XML Sidecar</span>
            </button>
            <button
              onClick={() => setPreviewTab('postscript_preview')}
              className={`pb-2.5 text-xs font-bold transition flex items-center gap-1.5 border-b-2 ${
                previewTab === 'postscript_preview'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Internal DSC Header Preview</span>
            </button>
          </div>

          {/* TAB 1: METADATA EDITOR */}
          {previewTab === 'editor' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Vector Title / Headline (Microstock SEO)
                </label>
                <button
                  onClick={handleAiSuggest}
                  disabled={isGeneratingAI}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow transition"
                >
                  <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingAI ? 'Generating AI...' : 'AI Auto-Generate Vector SEO'}</span>
                </button>
              </div>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Modern Geometric Abstract Background Scalable Vector Graphic Illustration"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-medium focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition"
              />

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Description / Caption (Embedded Subject)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of the vector graphic elements, color gradients, and intended microstock use cases..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-medium focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition custom-scrollbar"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Vector Keywords ({keywords.length}/50)
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Press <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 border border-slate-700">Enter</kbd> or comma to add tag
                  </span>
                </div>

                <div className="bg-slate-950 border border-slate-700 rounded-xl p-3 focus-within:border-amber-500 transition">
                  <div className="flex flex-wrap gap-1.5 mb-2 max-h-40 overflow-y-auto custom-scrollbar">
                    {keywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-800/90 text-amber-300/90 border border-amber-500/20 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium group"
                      >
                        <span>{kw}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(kw)}
                          className="text-slate-500 group-hover:text-red-400 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {keywords.length === 0 && (
                      <span className="text-xs text-slate-600 py-1 italic">
                        No keywords yet. Click "AI Auto-Generate" or type below.
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={addTag}
                      placeholder="Add tag and press Enter..."
                      className="bg-transparent text-sm text-white placeholder-slate-600 outline-none flex-1 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => addTag()}
                      className="text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-lg font-bold transition"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: XMP SIDECAR XML PREVIEW */}
          {previewTab === 'xmp_preview' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-indigo-400" />
                  Adobe XMP Core 5.6 XML standard parsed by Adobe Bridge, Photoshop, and Illustrator
                </span>
                <button
                  onClick={copyXmpXml}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5 transition"
                >
                  {copiedXmp ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedXmp ? 'Copied XML' : 'Copy XML'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-emerald-400/90 overflow-x-auto max-h-72 custom-scrollbar">
                {generatedXmp}
              </pre>
            </div>
          )}

          {/* TAB 3: INTERNAL DSC POSTSCRIPT PREVIEW */}
          {previewTab === 'postscript_preview' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-indigo-400" />
                PostScript Document Structuring Conventions (DSC) written directly inside the .EPS binary/ASCII stream:
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-xs font-mono">
                <div className="text-slate-400">%%Title: <span className="text-amber-300 font-bold">{title || '(untitled)'}</span></div>
                <div className="text-slate-400">%%Keywords: <span className="text-emerald-300">{keywords.join(', ') || '(none)'}</span></div>
                <div className="text-slate-400">%%Subject: <span className="text-indigo-300">{description || title || '(none)'}</span></div>
                <div className="text-slate-400">%%Notice: <span className="text-slate-500">Metadata injected by AdobeMeta Pro AI</span></div>
                <div className="text-amber-500/80 pt-2 border-t border-slate-800">
                  %begin_xmp_code <br />
                  &nbsp;&nbsp;&lt;?xpacket begin="﻿" ... /&gt; (Full Adobe XMP metadata packet embedded) <br />
                  %end_xmp_code
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Compatible with Adobe Stock, Shutterstock, Freepik, Getty & Vecteezy</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadXmp}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm"
              title="Download separate .xmp sidecar file"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Export .XMP Sidecar</span>
            </button>

            <button
              onClick={handleEmbedInternalVector}
              disabled={!file || isInjecting}
              className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg disabled:shadow-none"
              title="Writes metadata directly inside the EPS vector file"
            >
              <Download className={`w-4 h-4 ${isInjecting ? 'animate-bounce' : ''}`} />
              <span>{isInjecting ? 'Writing Metadata...' : 'Write & Download Tagged EPS'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
