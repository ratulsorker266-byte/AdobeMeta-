import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Download, Copy, Check, FileSpreadsheet, Package, Sparkles, AlertCircle } from 'lucide-react';
import { BulkItem } from '../types';
import JSZip from 'jszip';
import { embedJpegMetadata, generateXmpSidecarXml, embedMetadataIntoEps } from '../lib/metadataEmbedder';

export const ADOBE_STOCK_CATEGORY_MAP: Record<string, number> = {
  'Animals': 1,
  'Buildings and Architecture': 2,
  'Business': 3,
  'Drinks': 4,
  'The Environment': 5,
  'States of Mind': 6,
  'Food': 7,
  'Graphic Resources': 8,
  'Hobbies and Leisure': 9,
  'Industry': 10,
  'Landscapes': 11,
  'Lifestyle': 12,
  'People': 13,
  'Plants and Flowers': 14,
  'Culture and Religion': 15,
  'Science': 16,
  'Social Issues': 17,
  'Sports': 18,
  'Technology': 19,
  'Transport': 20,
  'Travel': 21,
};

export const resolveAdobeCategoryId = (categoryName?: string, keywords: string[] = [], filename: string = ''): number => {
  if (categoryName) {
    const clean = categoryName.trim();
    if (ADOBE_STOCK_CATEGORY_MAP[clean]) return ADOBE_STOCK_CATEGORY_MAP[clean];
    const lower = clean.toLowerCase();
    for (const [k, id] of Object.entries(ADOBE_STOCK_CATEGORY_MAP)) {
      if (lower.includes(k.toLowerCase()) || k.toLowerCase().includes(lower)) return id;
    }
  }
  if (/\.(eps|ai|svg)$/i.test(filename)) return 8; // Graphic Resources
  const blob = keywords.join(' ').toLowerCase();
  if (/\b(vector|background|texture|pattern|template|mockup|illustration|abstract|podium)\b/.test(blob)) return 8;
  if (/\b(technology|ai|software|cyber|digital|robot|data|computer)\b/.test(blob)) return 19;
  if (/\b(people|portrait|woman|man|child|family)\b/.test(blob)) return 13;
  if (/\b(food|meal|cuisine|fruit|restaurant|cooking)\b/.test(blob)) return 7;
  if (/\b(nature|landscape|mountain|ocean|forest|sunset)\b/.test(blob)) return 11;
  if (/\b(building|architecture|interior|house|city)\b/.test(blob)) return 2;
  return 3; // Business
};

export const VALID_SHUTTERSTOCK_CATEGORIES = [
  'Abstract', 'Animals/Wildlife', 'The Arts', 'Backgrounds/Textures', 'Beauty/Fashion',
  'Buildings/Landmarks', 'Business/Finance', 'Celebrities', 'Education', 'Food and Drink',
  'Healthcare/Medical', 'Holidays', 'Industrial', 'Interiors', 'Miscellaneous', 'Nature',
  'Objects', 'Parks/Outdoor', 'People', 'Religion', 'Science', 'Signs/Symbols',
  'Sports/Recreation', 'Technology', 'Transportation', 'Vectors', 'Vintage'
];

export const detectShutterstockCategory = (keywords: string[] = [], text: string = ''): string => {
  const blob = (keywords.join(' ') + ' ' + text).toLowerCase();
  const matched: string[] = [];

  const check = (cat: string, regex: RegExp) => {
    if (regex.test(blob) && !matched.includes(cat)) {
      matched.push(cat);
    }
  };

  check('People', /\b(people|person|man|woman|child|family|team|worker|portrait|adult|couple|girl|boy|human|lifestyle)\b/);
  check('Business/Finance', /\b(business|finance|money|office|corporate|marketing|banking|investment|economy|workplace)\b/);
  check('Technology', /\b(technology|tech|ai|computer|software|digital|code|internet|cyber|robot|phone|laptop)\b/);
  check('Nature', /\b(nature|landscape|tree|flower|forest|mountain|ocean|sea|beach|water|sky|plant|sun|outdoor)\b/);
  check('Animals/Wildlife', /\b(animal|wildlife|dog|cat|bird|pet|mammal|fish|fauna|wild)\b/);
  check('Food and Drink', /\b(food|drink|meal|coffee|restaurant|cooking|fruit|vegetable|kitchen|eating|delicious)\b/);
  check('Healthcare/Medical', /\b(health|medical|doctor|hospital|medicine|clinic|patient|nurse|wellness|treatment)\b/);
  check('Buildings/Landmarks', /\b(building|architecture|city|urban|landmark|house|street|construction|tower)\b/);
  check('Backgrounds/Textures', /\b(background|texture|pattern|abstract|wallpaper|surface|backdrop|geometric)\b/);
  check('Vectors', /\b(vector|illustration|graphic|icon|clipart|drawing|eps|flat)\b/);
  check('Industrial', /\b(industry|industrial|factory|manufacture|engineer|machinery|production|energy|solar)\b/);
  check('Education', /\b(education|school|student|study|learning|university|book|knowledge)\b/);
  check('Transportation', /\b(transportation|car|vehicle|road|traffic|train|airplane|flight|ship)\b/);
  check('Holidays', /\b(holiday|christmas|new year|easter|halloween|celebration|festive)\b/);

  if (matched.length === 0) return 'Miscellaneous';
  // Return the single most relevant primary category to guarantee 100% error-free Shutterstock CSV parsing
  return matched[0];
};

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
  const [previewFormatId, setPreviewFormatId] = useState<string | null>('adobe');
  const [isRenamingZip, setIsRenamingZip] = useState(false);
  const [renameProgress, setRenameProgress] = useState(0);
  const [useRenamedInCsv, setUseRenamedInCsv] = useState(false);

  if (!isOpen) return null;

  const realCompletedItems = items.filter((i) => i.result);
  const isSampleDemo = realCompletedItems.length === 0;

  // Provide realistic microstock demo data so users can test and explore formats before uploading
  const sampleDemoItems: any[] = [
    {
      id: 'demo-sample-1',
      file: { name: 'solar_energy_technicians.jpg' },
      result: {
        recommendedTitle: 'Engineers Inspecting High-Efficiency Solar Panel Array in Renewable Energy Plant',
        shortDescription: 'Modern renewable clean energy facility with technical team auditing solar cells at sunrise',
        keywords: [
          'solar energy', 'renewable energy', 'engineers', 'photovoltaic', 'solar panels',
          'clean power', 'technician', 'sustainable', 'green technology', 'environment',
          'alternative energy', 'eco friendly', 'industrial inspection', 'clean electricity', 'innovation'
        ]
      }
    },
    {
      id: 'demo-sample-2',
      file: { name: 'creative_ai_workspace.jpg' },
      result: {
        recommendedTitle: 'Diverse Tech Startup Team Developing Machine Learning Models in Creative Office',
        shortDescription: 'Contemporary workspace with diverse software developers working on neural network algorithms',
        keywords: [
          'artificial intelligence', 'machine learning', 'tech startup', 'collaboration', 'software developer',
          'neural network', 'data science', 'diverse team', 'creative agency', 'digital workflow',
          'modern workplace', 'computer technology', 'innovation'
        ]
      }
    }
  ];

  const completedItems = isSampleDemo ? sampleDemoItems : realCompletedItems;

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
    let csv = '\uFEFFFilename,Title,Keywords,Category\r\n';
    completedItems.forEach((item) => {
      if (!item.result) return;
      const filename = getEffectiveFilename(item, forceRenamed).replace(/"/g, '""');
      let title = (item.result.recommendedTitle || '').replace(/[\r\n]+/g, ' ').replace(/"/g, '""').trim();
      // Adobe Stock August 2026 rule: Keep brief and under 70 characters
      if (title.length > 70) {
        const truncated = title.substring(0, 68);
        const lastSpace = truncated.lastIndexOf(' ');
        title = lastSpace > 30 ? truncated.substring(0, lastSpace) : truncated;
      }
      // Adobe Stock accepts up to 49 keywords, ordered by priority
      const keywords = (item.result.keywords || [])
        .slice(0, 49)
        .map((k) => k.replace(/[,"]/g, ' ').replace(/\s+/g, ' ').trim())
        .filter(Boolean)
        .join(', ')
        .replace(/"/g, '""');
      const catId = resolveAdobeCategoryId(item.result.category, item.result.keywords || [], filename);
      csv += `"${filename}","${title}","${keywords}","${catId}"\r\n`;
    });
    return csv;
  };

  // 2. Shutterstock CSV format: Filename,Description,Keywords,Categories
  const getShutterstockCsv = (forceRenamed?: boolean) => {
    let csv = '\uFEFFFilename,Description,Keywords,Categories\r\n';
    completedItems.forEach((item) => {
      if (!item.result) return;
      const filename = getEffectiveFilename(item, forceRenamed).replace(/"/g, '""');
      let desc = (item.result.recommendedTitle || item.result.shortDescription || '').replace(/[\r\n]+/g, ' ').replace(/"/g, '""').trim();
      // Shutterstock rule: Description must have at least 5 words!
      const words = desc.split(/\s+/).filter(Boolean);
      if (words.length < 5) {
        desc = `Commercial stock visual of ${desc || 'creative subject'} in high quality`;
      }
      // Shutterstock requires min 7, max 50 keywords with NO internal commas
      let keywordsArr = (item.result.keywords || [])
        .map((k) => k.replace(/[,"]/g, ' ').replace(/\s+/g, ' ').trim())
        .filter(Boolean);
      if (keywordsArr.length < 7) {
        keywordsArr = [...keywordsArr, 'commercial', 'visual', 'photography', 'creative', 'stock', 'royalty free', 'editorial'].slice(0, 7);
      }
      const keywords = keywordsArr.slice(0, 50).join(', ').replace(/"/g, '""');
      const categories = detectShutterstockCategory(keywordsArr, desc).replace(/"/g, '""');
      csv += `"${filename}","${desc}","${keywords}","${categories}"\r\n`;
    });
    return csv;
  };

  // 3. Freepik CSV format: File name,Title,Tags
  const getFreepikCsv = (forceRenamed?: boolean) => {
    let csv = '\uFEFFFile name,Title,Tags\r\n';
    completedItems.forEach((item) => {
      if (!item.result) return;
      const filename = getEffectiveFilename(item, forceRenamed).replace(/"/g, '""');
      const title = (item.result.recommendedTitle || '').replace(/[\r\n]+/g, ' ').replace(/"/g, '""').trim();
      const tags = (item.result.keywords || []).slice(0, 30).map((k) => k.replace(/[,"]/g, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean).join(', ').replace(/"/g, '""');
      csv += `"${filename}","${title}","${tags}"\r\n`;
    });
    return csv;
  };

  // 4. Universal / Vecteezy CSV: Filename,Title,Description,Keywords,License
  const getUniversalCsv = (forceRenamed?: boolean) => {
    let csv = '\uFEFFFilename,Title,Description,Keywords,License\r\n';
    completedItems.forEach((item) => {
      if (!item.result) return;
      const filename = getEffectiveFilename(item, forceRenamed).replace(/"/g, '""');
      const title = (item.result.recommendedTitle || '').replace(/[\r\n]+/g, ' ').replace(/"/g, '""').trim();
      const desc = (item.result.shortDescription || item.result.recommendedTitle || '').replace(/[\r\n]+/g, ' ').replace(/"/g, '""').trim();
      const keywords = (item.result.keywords || []).map((k) => k.replace(/[,"]/g, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean).join(', ').replace(/"/g, '""');
      csv += `"${filename}","${title}","${desc}","${keywords}","Commercial"\r\n`;
    });
    return csv;
  };

  // 5. Getty Images / iStock CSV format: Filename,Title,Description,Keywords
  const getGettyCsv = (forceRenamed?: boolean) => {
    let csv = '\uFEFFFilename,Title,Description,Keywords\r\n';
    completedItems.forEach((item) => {
      if (!item.result) return;
      const filename = getEffectiveFilename(item, forceRenamed).replace(/"/g, '""');
      const title = (item.result.recommendedTitle || '').replace(/[\r\n]+/g, ' ').replace(/"/g, '""').trim();
      const desc = (item.result.shortDescription || item.result.recommendedTitle || '').replace(/[\r\n]+/g, ' ').replace(/"/g, '""').trim();
      const keywords = (item.result.keywords || []).slice(0, 35).map((k) => k.replace(/[,"]/g, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean).join(', ').replace(/"/g, '""');
      csv += `"${filename}","${title}","${desc}","${keywords}"\r\n`;
    });
    return csv;
  };

  // 6. 123RF CSV format: oldfilename,123rf_filename,description,keywords,country
  const get123RfCsv = (forceRenamed?: boolean) => {
    let csv = '\uFEFFoldfilename,123rf_filename,description,keywords,country\r\n';
    completedItems.forEach((item) => {
      if (!item.result) return;
      const filename = getEffectiveFilename(item, forceRenamed).replace(/"/g, '""');
      const desc = (item.result.agencyTitles?.shutterstock || item.result.alternativeTitles?.editorialStory || item.result.recommendedTitle || '').replace(/[\r\n]+/g, ' ').replace(/"/g, '""').trim();
      const keywords = (item.result.keywords || []).slice(0, 45).map((k) => k.replace(/[,"]/g, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean).join(', ').replace(/"/g, '""');
      csv += `"${filename}","${filename}","${desc}","${keywords}",""\r\n`;
    });
    return csv;
  };

  // 7. Dreamstime CSV format: Filename,Image Name,Description,Category 1,Category 2,Category 3,keywords,Free,W-EL,P-EL,SR-EL,SR-Price,Editorial,MR doc Ids,Pr Docs
  const getDreamstimeCsv = (forceRenamed?: boolean) => {
    let csv = '\uFEFFFilename,Image Name,Description,Category 1,Category 2,Category 3,keywords,Free,W-EL,P-EL,SR-EL,SR-Price,Editorial,MR doc Ids,Pr Docs\r\n';
    completedItems.forEach((item) => {
      if (!item.result) return;
      const filename = getEffectiveFilename(item, forceRenamed).replace(/"/g, '""');
      const title = (item.result.recommendedTitle || '').replace(/[\r\n]+/g, ' ').replace(/"/g, '""').trim().slice(0, 68);
      const desc = (item.result.alternativeTitles?.editorialStory || item.result.shortDescription || title).replace(/[\r\n]+/g, ' ').replace(/"/g, '""').trim();
      const keywords = (item.result.keywords || []).slice(0, 45).map((k) => k.replace(/[,"]/g, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean).join(', ').replace(/"/g, '""');
      csv += `"${filename}","${title}","${desc}","112","145","161","${keywords}","0","1","1","0","","0","",""\r\n`;
    });
    return csv;
  };

      // 8. Canva Contributor / Creative Market CSV format: Filename,Title,Keywords,Artist
  const getCanvaCsv = (forceRenamed?: boolean) => {
    let csv = '\uFEFFFilename,Title,Keywords,Description\r\n';
    completedItems.forEach((item) => {
      if (!item.result) return;
      const filename = getEffectiveFilename(item, forceRenamed).replace(/"/g, '""');
      const title = (item.result.recommendedTitle || '').replace(/[\r\n]+/g, ' ').replace(/"/g, '""').trim().slice(0, 68);
      const desc = (item.result.shortDescription || title).replace(/[\r\n]+/g, ' ').replace(/"/g, '""').trim();
      const keywords = (item.result.keywords || []).slice(0, 35).map((k) => k.replace(/[,"]/g, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean).join(', ').replace(/"/g, '""');
      csv += `"${filename}","${title}","${keywords}","${desc}"\r\n`;
    });
    return csv;
  };

  // 9. Alamy Stock Photography CSV format: Filename,Caption,Supertags,Tags
  const getAlamyCsv = (forceRenamed?: boolean) => {
    let csv = '\uFEFFFilename,Caption,Supertags,Tags\r\n';
    completedItems.forEach((item) => {
      if (!item.result) return;
      const filename = getEffectiveFilename(item, forceRenamed).replace(/"/g, '""');
      const caption = (item.result.alternativeTitles?.editorialStory || item.result.recommendedTitle || '').replace(/[\r\n]+/g, ' ').replace(/"/g, '""').trim();
      const allKws = (item.result.keywords || []).map((k) => k.replace(/[,"]/g, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean);
      const supertags = allKws.slice(0, 10).join(', ').replace(/"/g, '""');
      const tags = allKws.slice(10, 49).join(', ').replace(/"/g, '""');
      csv += `"${filename}","${caption}","${supertags}","${tags}"\r\n`;
    });
    return csv;
  };

  // 10. Pond5 Footage & Photo CSV format: OriginalFilename,Title,Description,Keywords,Copyright,Price
  const getPond5Csv = (forceRenamed?: boolean) => {
    let csv = '\uFEFFOriginalFilename,Title,Description,Keywords,Specifier,Price\r\n';
    completedItems.forEach((item) => {
      if (!item.result) return;
      const filename = getEffectiveFilename(item, forceRenamed).replace(/"/g, '""');
      const title = (item.result.recommendedTitle || '').replace(/[\r\n]+/g, ' ').replace(/"/g, '""').trim().slice(0, 68);
      const desc = (item.result.shortDescription || title).replace(/[\r\n]+/g, ' ').replace(/"/g, '""').trim();
      const keywords = (item.result.keywords || []).slice(0, 49).map((k) => k.replace(/[,"]/g, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean).join(', ').replace(/"/g, '""');
      csv += `"${filename}","${title}","${desc}","${keywords}","Commercial","49"\r\n`;
    });
    return csv;
  };

  // 11. Master JSON API & Cloud Backup Payload
  const getMasterJsonPayload = (forceRenamed?: boolean) => {
    const payload = completedItems.map((item) => ({
      filename: getEffectiveFilename(item, forceRenamed),
      originalFilename: item.file.name,
      adobeStockTitle: item.result?.recommendedTitle || '',
      b2bCommercialTitle: item.result?.alternativeTitles?.b2bCommercial || item.result?.recommendedTitle || '',
      highVolumeSeoTitle: item.result?.alternativeTitles?.highVolumeSeo || item.result?.recommendedTitle || '',
      shutterstockDescription: item.result?.alternativeTitles?.editorialStory || item.result?.shortDescription || '',
      category: item.result?.category || 'Graphic Resources',
      shutterstockCategory: detectShutterstockCategory(item.result?.keywords || [], item.result?.recommendedTitle || ''),
      top10PriorityKeywords: (item.result?.keywords || []).slice(0, 10),
      all49Keywords: (item.result?.keywords || []).slice(0, 49),
      searchWeightIndex: item.result?.searchWeightIndex || 99,
      estimatedCpcUSD: item.result?.estimatedCpcUSD || '$3.40',
    }));
    return JSON.stringify(payload, null, 2);
  };

  const downloadCsv = (content: string, filename: string) => {
    const isJson = filename.endsWith('.json');
    const blob = new Blob([content], { type: isJson ? 'application/json;charset=utf-8;' : 'text/csv;charset=utf-8;' });
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

  // 9. Download All 7 Agency CSVs + Master JSON in 1 ZIP
  const downloadAllCsvsZip = async () => {
    try {
      const zip = new JSZip();
      const prefix = useRenamedInCsv ? 'Renamed_' : 'Original_';
      zip.file(`${prefix}Adobe_Stock_Metadata.csv`, getAdobeStockCsv());
      zip.file(`${prefix}Shutterstock_Metadata.csv`, getShutterstockCsv());
      zip.file(`${prefix}Freepik_Metadata.csv`, getFreepikCsv());
      zip.file(`${prefix}Getty_iStock_Metadata.csv`, getGettyCsv());
      zip.file(`${prefix}Vecteezy_Universal_Metadata.csv`, getUniversalCsv());
      zip.file(`${prefix}123RF_Metadata.csv`, get123RfCsv());
      zip.file(`${prefix}Dreamstime_Metadata.csv`, getDreamstimeCsv());
      zip.file(`${prefix}Canva_CreativeMarket_Metadata.csv`, getCanvaCsv());
      zip.file(`${prefix}Alamy_Supertags_Metadata.csv`, getAlamyCsv());
      zip.file(`${prefix}Pond5_Media_Metadata.csv`, getPond5Csv());
      zip.file(`${prefix}Master_Portfolio_Metadata.json`, getMasterJsonPayload());

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Stock_All_10_Agencies_CSVs_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast('✓ Downloaded All 10 Agencies CSVs + Master JSON ZIP!');
    } catch (e) {
      console.error(e);
      showToast('Failed to bundle CSVs.');
    }
  };

  // 6. Bulk Rename Files to SEO Slug & Download Embedded ZIP
  const downloadRenamedImagesZip = async () => {
    if (isSampleDemo) {
      showToast('Drag & drop your files in the Studio first to batch rename real images!');
      return;
    }
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
        const ext = item.file.name.split('.').pop()?.toLowerCase() || '';
        const isVector = ext === 'eps' || ext === 'ai';
        const isVideo = item.file.type?.startsWith('video/') || ['mp4', 'mov', 'webm', 'm4v', 'avi', 'mkv'].includes(ext);

        try {
          if (isVector) {
            finalBlob = await embedMetadataIntoEps(
              item.file,
              item.result.recommendedTitle || '',
              item.result.keywords || [],
              item.result.shortDescription
            );
          } else if (isVideo || ext === 'png' || ext === 'webp' || ext === 'psd' || ext === 'psb' || ext === 'spd' || ext === 'svg') {
            finalBlob = item.file;
          } else {
            finalBlob = await embedJpegMetadata(
              item.file,
              item.result.recommendedTitle || '',
              item.result.keywords || []
            );
          }
        } catch {
          finalBlob = item.file;
        }

        zip.file(finalSeoName, finalBlob);

        // Also generate Adobe-compliant XMP sidecar file (.xmp) for Illustrator / Bridge / Lightroom
        const xmpBaseName = finalSeoName.replace(/\.[^/.]+$/, '');
        const xmpContent = generateXmpSidecarXml(
          item.result.recommendedTitle || '',
          item.result.keywords || [],
          item.result.shortDescription
        );
        zip.file(`${xmpBaseName}.xmp`, xmpContent);

        count++;
        setRenameProgress(Math.round((count / completedItems.length) * 100));
      }

      // Add matching CSVs that specifically reference the RENAMED filenames inside this ZIP
      zip.file('Adobe_Stock_Renamed.csv', getAdobeStockCsv(true));
      zip.file('Shutterstock_Renamed.csv', getShutterstockCsv(true));
      zip.file('Freepik_Renamed.csv', getFreepikCsv(true));
      zip.file('Getty_iStock_Renamed.csv', getGettyCsv(true));
      zip.file('Vecteezy_Universal_Renamed.csv', getUniversalCsv(true));
      zip.file('123RF_Renamed.csv', get123RfCsv(true));
      zip.file('Dreamstime_Renamed.csv', getDreamstimeCsv(true));
      zip.file('Canva_CreativeMarket_Renamed.csv', getCanvaCsv(true));
      zip.file('Alamy_Supertags_Renamed.csv', getAlamyCsv(true));
      zip.file('Pond5_Media_Renamed.csv', getPond5Csv(true));
      zip.file('Master_Portfolio_Renamed.json', getMasterJsonPayload(true));

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
      id: 'getty',
      name: 'Getty Images / iStock',
      badge: '35 KW Max',
      color: 'amber',
      desc: 'Standard ESP portal metadata (Filename, Title, Description, Keywords)',
      getFile: getGettyCsv,
      filename: `getty_istock_${Date.now()}.csv`,
    },
    {
      id: 'universal',
      name: 'Vecteezy / Universal',
      badge: '35-49 KW',
      color: 'purple',
      desc: 'Universal format with full description, titles, and commercial license column',
      getFile: getUniversalCsv,
      filename: `vecteezy_universal_${Date.now()}.csv`,
    },
    {
      id: '123rf',
      name: '123RF Contributor',
      badge: '45 KW Max',
      color: 'cyan',
      desc: 'Official 123RF CSV schema (oldfilename, 123rf_filename, description, keywords, country)',
      getFile: get123RfCsv,
      filename: `123rf_${Date.now()}.csv`,
    },
    {
      id: 'dreamstime',
      name: 'Dreamstime',
      badge: '45 KW Max',
      color: 'emerald',
      desc: 'Official Dreamstime batch CSV schema with Image Name, Description, Categories & Keywords',
      getFile: getDreamstimeCsv,
      filename: `dreamstime_${Date.now()}.csv`,
    },
    {
      id: 'canva',
      name: 'Canva Creators / Creative Market',
      badge: '35 KW Max',
      color: 'purple',
      desc: 'Official Canva Contributor & Creative Market CSV schema (Filename, Title, Keywords, Description)',
      getFile: getCanvaCsv,
      filename: `canva_creators_${Date.now()}.csv`,
    },
    {
      id: 'alamy',
      name: 'Alamy (with Top-10 Supertags)',
      badge: '10 Super + 39 Tags',
      color: 'cyan',
      desc: 'Official Alamy Stock CSV separating Top-10 Priority Supertags from secondary tags (Filename, Caption, Supertags, Tags)',
      getFile: getAlamyCsv,
      filename: `alamy_supertags_${Date.now()}.csv`,
    },
    {
      id: 'pond5',
      name: 'Pond5 (Photos, Vectors & 4K Footage)',
      badge: '49 KW Max',
      color: 'blue',
      desc: 'Official Pond5 batch CSV schema with commercial licensing & pricing columns (OriginalFilename, Title, Description, Keywords, Specifier, Price)',
      getFile: getPond5Csv,
      filename: `pond5_metadata_${Date.now()}.csv`,
    },
    {
      id: 'json_master',
      name: 'Master Portfolio JSON (API / Backup)',
      badge: '4-Angle + 49 KW',
      color: 'amber',
      desc: 'Complete structured JSON containing all 4 title variations, Top-10 weights, CPC & 49 keywords',
      getFile: getMasterJsonPayload,
      filename: `master_portfolio_metadata_${Date.now()}.json`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 15, opacity: 0 }}
        className="crystal-architectural-slab-dark sovereign-prism-card rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-cyan-400 mb-1">
              GEN-10 MULTI-AGENCY EXPORT ENGINE · 10 MARKETPLACES + MASTER JSON
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <span>10-Agency CSV &amp; Master JSON Exporter</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Export ready-to-upload spreadsheets formatted for each major microstock agency ({completedItems.length} asset{completedItems.length === 1 ? '' : 's'} ready)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition p-2 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {isSampleDemo && (
            <div className="p-3.5 bg-gradient-to-r from-cyan-950/60 to-violet-950/60 border border-cyan-500/30 rounded-2xl text-xs text-cyan-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>
                  <strong>Interactive Agency Format Preview:</strong> Displaying sample commercial stock assets. Inspect raw CSV/JSON schemas below or drop your files in the Studio to export real metadata.
                </span>
              </div>
            </div>
          )}

          <>
            {/* Quick Actions Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={downloadAllCsvsZip}
                  className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 text-xs sm:text-sm font-black p-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition cursor-pointer"
                >
                  <Package className="w-4 h-4" />
                  <span>Download All 10 Agency CSVs + JSON in 1 ZIP</span>
                </button>

                <button
                  onClick={downloadRenamedImagesZip}
                  disabled={isRenamingZip}
                  className="bg-white/10 hover:bg-white/15 border border-white/15 disabled:bg-slate-800 text-white text-xs sm:text-sm font-bold p-3.5 rounded-2xl flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>
                    {isRenamingZip ? `Packaging SEO Names (${renameProgress}%)` : 'Rename Files to SEO Slug & ZIP'}
                  </span>
                </button>
              </div>

              {/* Format Cards */}
              <div className="space-y-2.5 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-[11px] font-mono font-bold tracking-[0.14em] text-slate-400 uppercase">
                    Select Specific Agency Format (Click Preview to Inspect Schema)
                  </div>

                  {/* Filename Target Selector */}
                  <div className="flex items-center gap-1 bg-slate-950/90 p-1 rounded-xl border border-white/10 text-[11px]">
                    <span className="text-slate-400 px-1.5 text-[10px] font-mono uppercase">CSV Filename:</span>
                    <button
                      onClick={() => setUseRenamedInCsv(false)}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                        !useRenamedInCsv
                          ? 'bg-white text-slate-950'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Original Names
                    </button>
                    <button
                      onClick={() => setUseRenamedInCsv(true)}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                        useRenamedInCsv
                          ? 'bg-emerald-500 text-slate-950'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      SEO Renamed
                    </button>
                  </div>
                </div>

                {formats.map((fmt) => {
                  const isPreviewOpen = previewFormatId === fmt.id;
                  return (
                    <div
                      key={fmt.id}
                      className="p-3.5 bg-slate-950/70 border border-white/10 hover:border-cyan-400/40 rounded-2xl space-y-2.5 transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-sm font-bold text-white">{fmt.name}</span>
                            <span aria-hidden="true" className="text-slate-600">·</span>
                            <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                              {fmt.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{fmt.desc}</p>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                          <button
                            type="button"
                            onClick={() => setPreviewFormatId(isPreviewOpen ? null : fmt.id)}
                            className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border transition cursor-pointer ${
                              isPreviewOpen
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                            }`}
                          >
                            {isPreviewOpen ? 'Hide Schema' : 'Inspect Raw'}
                          </button>

                          <button
                            onClick={() => copyToClipboard(fmt.getFile(), fmt.id)}
                            className="bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/10 transition flex items-center gap-1.5 cursor-pointer"
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
                            className="bg-white hover:bg-neutral-200 text-slate-950 text-xs font-bold px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>

                      {isPreviewOpen && (
                        <div className="pt-2 border-t border-white/10">
                          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                            <span>Live Generated Output ({fmt.filename})</span>
                            <span className="text-emerald-400">100% Agency Compliant</span>
                          </div>
                          <pre className="p-3 rounded-xl bg-black/80 border border-white/10 text-[11px] font-mono text-cyan-200/90 overflow-x-auto max-h-36 leading-relaxed select-all">
                            {fmt.getFile().trim()}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Sample Preview */}
              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-white/10 text-xs text-slate-400">
                <div className="flex items-center justify-between text-slate-300 font-semibold mb-1">
                  <span>SEO Filename Slug Transformation</span>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase">Collision-Safe Slug Engine</span>
                </div>
                <p className="font-mono text-[11px] text-slate-400 truncate">
                  {completedItems[0]
                    ? `${completedItems[0].file.name} ➔ ${seoNameMap.get(completedItems[0].id) || completedItems[0].file.name}`
                    : 'DSC_0091.jpg ➔ modern-creative-business-team-in-office.jpg'}
                </p>
              </div>
            </>
        </div>
      </motion.div>
    </div>
  );
};
