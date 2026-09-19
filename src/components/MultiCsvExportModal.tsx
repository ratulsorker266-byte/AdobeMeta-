import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Download, Copy, Check, FileSpreadsheet, Package, Sparkles, AlertCircle } from 'lucide-react';
import { BulkItem } from '../types';
import JSZip from 'jszip';
import { embedJpegMetadata } from '../lib/metadataEmbedder';

interface MultiCsvExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: BulkItem[];
  showToast: (msg: string) => void;
}

export const MultiCsvExportModal: React.FC<MultiCsvExportModalProps> = ({
  isOpen,
  onClose,
  items,
  showToast,
}) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [isRenamingZip, setIsRenamingZip] = useState(false);
  const [renameProgress, setRenameProgress] = useState(0);
  const [useRenamedInCsv, setUseRenamedInCsv] = useState(false);

  if (!isOpen) return null;

  const completedItems = items.filter((i) => i.result);

  // Helper to generate a collision-safe map of SEO slugs
  const getSeoFilenameMap = () => {
    const map = new Map<string, string>();
    const usedNames = new Set<string>();

    completedItems.forEach((item) => {
      const originalName = item.file.name;
      const lastDot = originalName.lastIndexOf('.');
      const ext = lastDot !== -1 ? originalName.substring(lastDot) : '.jpg';
      const rawTitle = item.result?.recommendedTitle || '';
      
      const cleanSlug = rawTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .substring(0, 75) || 'commercial-stock-visual';

      let uniqueName = `${cleanSlug}${ext}`;
      let counter = 1;
      while (usedNames.has(uniqueName.toLowerCase())) {
        uniqueName = `${cleanSlug}-${counter}${ext}`;
        counter++;
      }
      usedNames.add(uniqueName.toLowerCase());
      map.set(item.id, uniqueName);
    });

    return map;
  };

  const seoNameMap = getSeoFilenameMap();

  const getEffectiveFilename = (item: BulkItem, forceRenamed?: boolean) => {
    if (forceRenamed || useRenamedInCsv) {
      return seoNameMap.get(item.id) || item.file.name;
    }
    return item.file.name;
  };

  // 1. Adobe Stock CSV format: Filename,Title,Keywords,Category
  const getAdobeStockCsv = (forceRenamed?: boolean) => {
    let csv = '\uFEFFFilename,Title,Keywords,Category\n';
    completedItems.forEach((item) => {
      if (!item.result) return;
      const filename = getEffectiveFilename(item, forceRenamed).replace(/"/g, '""');
      const title = (item.result.recommendedTitle || '').replace(/\r?\n/g, ' ').replace(/"/g, '""');
      // Adobe Stock accepts up to 49 keywords
      const keywords = (item.result.keywords || []).slice(0, 49).map((k) => k.trim()).filter(Boolean).join(', ').replace(/"/g, '""');
      csv += `"${filename}","${title}","${keywords}",""\n`;
    });
    return csv;
  };

  // 2. Shutterstock CSV format: Filename,Description,Keywords,Categories
  const getShutterstockCsv = (forceRenamed?: boolean) => {
    let csv = '\uFEFFFilename,Description,Keywords,Categories\n';
    completedItems.forEach((item) => {
      if (!item.result) return;
      const filename = getEffectiveFilename(item, forceRenamed).replace(/"/g, '""');
      const desc = (item.result.recommendedTitle || item.result.shortDescription || '').replace(/\r?\n/g, ' ').replace(/"/g, '""');
      // Shutterstock requires 50 keywords max, min 7
      const keywords = (item.result.keywords || []).slice(0, 50).map((k) => k.trim()).filter(Boolean).join(', ').replace(/"/g, '""');
      csv += `"${filename}","${desc}","${keywords}","Technology, Lifestyle"\n`;
    });
    return csv;
  };

  // 3. Freepik CSV format: File name,Title,Tags
  const getFreepikCsv = (forceRenamed?: boolean) => {
    let csv = '\uFEFFFile name,Title,Tags\n';
    completedItems.forEach((item) => {
      if (!item.result) return;
      const filename = getEffectiveFilename(item, forceRenamed).replace(/"/g, '""');
      const title = (item.result.recommendedTitle || '').replace(/\r?\n/g, ' ').replace(/"/g, '""');
      const tags = (item.result.keywords || []).slice(0, 30).map((k) => k.trim()).filter(Boolean).join(', ').replace(/"/g, '""');
      csv += `"${filename}","${title}","${tags}"\n`;
    });
    return csv;
  };

  // 4. Universal / Vecteezy CSV: Filename,Title,Description,Keywords,License
  const getUniversalCsv = (forceRenamed?: boolean) => {
    let csv = '\uFEFFFilename,Title,Description,Keywords,License\n';
    completedItems.forEach((item) => {
      if (!item.result) return;
      const filename = getEffectiveFilename(item, forceRenamed).replace(/"/g, '""');
      const title = (item.result.recommendedTitle || '').replace(/\r?\n/g, ' ').replace(/"/g, '""');
      const desc = (item.result.shortDescription || item.result.recommendedTitle || '').replace(/\r?\n/g, ' ').replace(/"/g, '""');
      const keywords = (item.result.keywords || []).map((k) => k.trim()).filter(Boolean).join(', ').replace(/"/g, '""');
      csv += `"${filename}","${title}","${desc}","${keywords}","Commercial"\n`;
    });
    return csv;
  };

  const downloadCsv = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(`✓ Downloaded ${filename}`);
  };

  const copyToClipboard = (content: string, formatId: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFormat(formatId);
    showToast(`Copied ${formatId} data to clipboard!`);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  // 5. Download All CSVs in 1 ZIP
  const downloadAllCsvsZip = async () => {
    try {
      const zip = new JSZip();
      const prefix = useRenamedInCsv ? 'Renamed_' : 'Original_';
      zip.file(`${prefix}Adobe_Stock_Metadata.csv`, getAdobeStockCsv());
      zip.file(`${prefix}Shutterstock_Metadata.csv`, getShutterstockCsv());
      zip.file(`${prefix}Freepik_Metadata.csv`, getFreepikCsv());
      zip.file(`${prefix}Universal_Vecteezy_Metadata.csv`, getUniversalCsv());

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Stock_All_Marketplaces_CSVs_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast('✓ Downloaded All Marketplace CSVs ZIP!');
    } catch (e) {
      console.error(e);
      showToast('Failed to bundle CSVs.');
    }
  };

  // 6. Bulk Rename Files to SEO Slug & Download Embedded ZIP
  const downloadRenamedImagesZip = async () => {
    if (completedItems.length === 0) return;
    setIsRenamingZip(true);
    setRenameProgress(0);

    try {
      const zip = new JSZip();
      let count = 0;

      for (const item of completedItems) {
        if (!item.result) continue;
        const seoName = seoNameMap.get(item.id) || item.file.name;

        let finalBlob: Blob = item.file;
        let finalSeoName = seoName;
        try {
          finalBlob = await embedJpegMetadata(
            item.file,
            item.result.recommendedTitle || '',
            item.result.keywords || []
          );
          if (finalBlob.type === 'image/jpeg' && !/\.jpe?g$/i.test(finalSeoName)) {
            finalSeoName = finalSeoName.replace(/\.[^/.]+$/, '') + '.jpg';
          }
        } catch {
          finalBlob = item.file;
        }

        zip.file(finalSeoName, finalBlob);
        count++;
        setRenameProgress(Math.round((count / completedItems.length) * 100));
      }

      // Add matching CSVs that specifically reference the RENAMED filenames inside this ZIP
      zip.file('Adobe_Stock_Renamed.csv', getAdobeStockCsv(true));
      zip.file('Shutterstock_Renamed.csv', getShutterstockCsv(true));
      zip.file('Freepik_Renamed.csv', getFreepikCsv(true));
      zip.file('Universal_Catalog_Renamed.csv', getUniversalCsv(true));

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SEO_Renamed_Images_With_Metadata_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast('✓ Successfully downloaded SEO-renamed images ZIP!');
    } catch (err) {
      console.error('Rename zip error:', err);
      showToast('Failed to generate renamed ZIP.');
    } finally {
      setIsRenamingZip(false);
    }
  };

  const formats = [
    {
      id: 'adobe',
      name: 'Adobe Stock',
      badge: 'Max 49 KW',
      color: 'blue',
      desc: 'Compatible with Adobe Stock Contributor Portal (Filename, Title, Keywords, Category)',
      getFile: getAdobeStockCsv,
      filename: `adobe_stock_${Date.now()}.csv`,
    },
    {
      id: 'shutterstock',
      name: 'Shutterstock',
      badge: '50 KW Max',
      color: 'red',
      desc: 'Optimized description length and keyword caps for Shutterstock submission',
      getFile: getShutterstockCsv,
      filename: `shutterstock_${Date.now()}.csv`,
    },
    {
      id: 'freepik',
      name: 'Freepik',
      badge: '30 Tags',
      color: 'emerald',
      desc: 'Header: File name, Title, Tags (comma delimited tags up to 30)',
      getFile: getFreepikCsv,
      filename: `freepik_${Date.now()}.csv`,
    },
    {
      id: 'universal',
      name: 'Universal / Vecteezy',
      badge: 'Full Meta',
      color: 'purple',
      desc: 'Universal format with full description, titles, and unlimited keywords',
      getFile: getUniversalCsv,
      filename: `universal_stock_${Date.now()}.csv`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 15, opacity: 0 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              Multi-Marketplace 1-Click CSV Exporter
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Export ready-to-upload spreadsheets formatted for each major microstock agency ({completedItems.length} items ready)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition p-2 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {completedItems.length === 0 ? (
            <div className="p-6 text-center text-slate-400 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-semibold text-slate-300">No completed items found</p>
              <p className="text-xs text-slate-500 mt-1">Upload and analyze images first to generate metadata.</p>
            </div>
          ) : (
            <>
              {/* Quick Actions Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={downloadAllCsvsZip}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold p-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition"
                >
                  <Package className="w-4 h-4" />
                  <span>Download All 4 CSVs in 1 ZIP</span>
                </button>

                <button
                  onClick={downloadRenamedImagesZip}
                  disabled={isRenamingZip}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white text-xs font-bold p-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>
                    {isRenamingZip ? `Packaging SEO Names (${renameProgress}%)` : 'Rename Files to SEO Slug & ZIP'}
                  </span>
                </button>
              </div>

              {/* Format Cards */}
              <div className="space-y-2.5 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    Select Specific Agency Format
                  </div>

                  {/* Filename Target Selector */}
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
                    <span className="text-slate-500 px-1 text-[10px] uppercase font-bold">CSV Filename:</span>
                    <button
                      onClick={() => setUseRenamedInCsv(false)}
                      className={`px-2 py-0.5 rounded font-medium transition ${
                        !useRenamedInCsv
                          ? 'bg-indigo-600 text-white shadow'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Original Names
                    </button>
                    <button
                      onClick={() => setUseRenamedInCsv(true)}
                      className={`px-2 py-0.5 rounded font-medium transition ${
                        useRenamedInCsv
                          ? 'bg-emerald-600 text-white shadow'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      SEO Renamed
                    </button>
                  </div>
                </div>

                {formats.map((fmt) => (
                  <div
                    key={fmt.id}
                    className="p-3.5 bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{fmt.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {fmt.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">{fmt.desc}</p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        onClick={() => copyToClipboard(fmt.getFile(), fmt.id)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1.5"
                        title="Copy CSV to clipboard"
                      >
                        {copiedFormat === fmt.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span>{copiedFormat === fmt.id ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        onClick={() => downloadCsv(fmt.getFile(), fmt.filename)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download CSV</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sample Preview */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-400">
                <div className="flex items-center justify-between text-slate-300 font-semibold mb-1">
                  <span>SEO Filename Preview Example</span>
                  <span className="text-[10px] text-indigo-400">Automatic Slug Generator</span>
                </div>
                <p className="font-mono text-[11px] text-slate-400 truncate">
                  {completedItems[0]
                    ? `${completedItems[0].file.name} ➔ ${seoNameMap.get(completedItems[0].id) || completedItems[0].file.name}`
                    : 'DSC_0091.jpg ➔ modern-creative-business-team-in-office.jpg'}
                </p>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
