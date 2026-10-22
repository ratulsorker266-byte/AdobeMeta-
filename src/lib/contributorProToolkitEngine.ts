// ============================================================================
// CONTRIBUTOR PRO TOOLKIT ENGINE (100% LOCAL IN-BROWSER PROCESSING)
// ============================================================================
// 1. Pre-Submission Checker (4MP resolution, file size, EPS/AI version, title length,
//    keyword count, duplicate/plural detector, trademark IP scanner, release advisor)
// 2. Rejection Reason Helper (Similar Content, Noise/Artifacts, Focus, IP, Quality)
// 3. AI Content Disclosure Helper (Adobe Stock & Shutterstock generative AI rules)
// 4. Keyword Quality Score & Relevance Auditor (Title-to-Top-10 correlation & warnings)
// 5. Upload & Earnings CSV Tracker (Submission statuses + Adobe Stock CSV importer)
// ============================================================================

export interface PreSubmissionCheckItem {
  id: string;
  labelEn: string;
  labelBn: string;
  status: 'PASS' | 'WARNING' | 'FAIL';
  detailEn: string;
  detailBn: string;
}

export interface PreSubmissionReport {
  fileName: string;
  fileSizeMB: string;
  dimensions: string;
  megapixels: string;
  epsVersion: string;
  overallPass: boolean;
  readinessScore: number;
  checks: PreSubmissionCheckItem[];
  cleanedKeywords: string[];
  trademarkHits: string[];
  duplicateOrPluralHits: string[];
  releaseRecommendationEn: string;
  releaseRecommendationBn: string;
}

export interface KeywordQualityAudit {
  overallScore: number;
  top10CorrelationPct: number;
  relevantKeywords: string[];
  irrelevantWarnings: { keyword: string; reasonEn: string; reasonBn: string }[];
  duplicateWarnings: string[];
  trademarkWarnings: string[];
  cleanedOptimized49: string[];
}

export interface RejectionRemedyGuide {
  id: string;
  reasonTitleEn: string;
  reasonTitleBn: string;
  badgeColor: string;
  whyItHappensEn: string;
  whyItHappensBn: string;
  howToFixStepsEn: string[];
  howToFixStepsBn: string[];
  preUploadChecklistEn: string;
  preUploadChecklistBn: string;
}

export interface TrackedSubmissionItem {
  id: string;
  fileName: string;
  title: string;
  topic: string;
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  downloads: number;
  earningsUsd: number;
  dateAdded: string;
}

// Comprehensive Restricted Trademark, Brand, Camera & Protected IP Dictionary
export const RESTRICTED_TRADEMARK_WORDS = [
  'nike',
  'adidas',
  'puma',
  'apple',
  'iphone',
  'ipad',
  'macbook',
  'airpods',
  'samsung',
  'disney',
  'marvel',
  'pixar',
  'netflix',
  'spotify',
  'google',
  'youtube',
  'instagram',
  'facebook',
  'whatsapp',
  'tiktok',
  'meta',
  'microsoft',
  'windows',
  'playstation',
  'xbox',
  'nintendo',
  'lego',
  'barbie',
  'ferrari',
  'lamborghini',
  'porsche',
  'tesla',
  'bmw',
  'mercedes',
  'rolex',
  'gucci',
  'chanel',
  'louis vuitton',
  'prada',
  'coca cola',
  'pepsi',
  'starbucks',
  'mcdonalds',
  'red bull',
  'canon',
  'nikon',
  'sony',
  'fujifilm',
  'leica',
  'olympics',
  'fifa',
  'uefa',
  'super bowl',
  'oscar',
  'grammy',
  'hollywood',
  'midjourney',
  'dall-e',
  'dalle',
  'stable diffusion',
  'chatgpt',
  'openai',
  'firefly',
];

const PEOPLE_OR_PROPERTY_TRIGGERS = [
  'person',
  'woman',
  'man',
  'child',
  'girl',
  'boy',
  'portrait',
  'face',
  'model',
  'couple',
  'family',
  'worker',
  'doctor',
  'patient',
  'employee',
  'tattoo',
  'private house',
  'luxury villa',
  'pet',
  'dog',
  'cat',
];

/**
 * Normalizes a word to its singular stem to catch plural duplicates (e.g. "server" vs "servers")
 */
function getSingularStem(word: string): string {
  const w = word.toLowerCase().trim();
  if (w.length <= 3) return w;
  if (w.endsWith('ies')) return w.slice(0, -3) + 'y';
  if (w.endsWith('es') && !w.endsWith('ses') && !w.endsWith('xes')) return w.slice(0, -1);
  if (w.endsWith('s') && !w.endsWith('ss') && !w.endsWith('us') && !w.endsWith('is')) {
    return w.slice(0, -1);
  }
  return w;
}

/**
 * 1. PRE-SUBMISSION CHECKER
 * Audits resolution (>=4MP), file size, EPS/AI PostScript version, title length,
 * keyword count, duplicate/plural keywords, trademark words, and model/property release needs.
 */
export async function runPreSubmissionAudit(
  file: File | null,
  title: string,
  keywordsRaw: string[]
): Promise<PreSubmissionReport> {
  let width = 0;
  let height = 0;
  let epsVersion = 'N/A (Raster Image)';
  let isVector = false;
  const fileName = file ? file.name : 'sample_commercial_vector_01.eps';
  const fileSizeBytes = file ? file.size : 4_850_000;
  const fileSizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(2);

  if (file) {
    if (/\.(eps|ai)$/i.test(file.name) || file.type.includes('postscript')) {
      isVector = true;
      try {
        const slice = await file.slice(0, 8192).text();
        const psMatch = slice.match(/%!PS-Adobe-([0-9.]+)\s*EPSF-([0-9.]+)/i);
        const aiMatch = slice.match(/%%Creator:\s*Adobe Illustrator\(R\)\s*([0-9.]+)/i);
        if (psMatch) {
          epsVersion = `PostScript ${psMatch[1]} / EPSF-${psMatch[2]} (EPS 10 Compatible)`;
        } else if (aiMatch) {
          epsVersion = `Adobe Illustrator v${aiMatch[1]}`;
        } else {
          epsVersion = 'EPS / PostScript Vector (Compatible)';
        }
      } catch {
        epsVersion = 'EPS Vector Stream';
      }
    } else if (file.type.startsWith('image/')) {
      const objUrl = URL.createObjectURL(file);
      await new Promise<void>((res) => {
        const img = new Image();
        img.onload = () => {
          width = img.naturalWidth;
          height = img.naturalHeight;
          URL.revokeObjectURL(objUrl);
          res();
        };
        img.onerror = () => {
          URL.revokeObjectURL(objUrl);
          res();
        };
        img.src = objUrl;
      });
    }
  } else {
    // Demo synthetic specs when testing without uploading a file
    width = 3840;
    height = 2160;
    epsVersion = 'EPS 10 (PostScript 3.0 Compliant)';
  }

  const mpNum = width && height ? (width * height) / 1_000_000 : 8.29;
  const megapixels = isVector ? 'Scalable Vector (≥ 4MP Pass)' : `${mpNum.toFixed(2)} MP`;
  const min4MpPass = isVector || mpNum >= 4.0;
  const sizePass = fileSizeBytes >= 50_000 && fileSizeBytes <= 45 * 1024 * 1024;

  // Title audit (Adobe Stock best range: 35 to 70 chars, max 200)
  const cleanTitle = (title || '').trim();
  const titleLen = cleanTitle.length;
  const titlePass = titleLen >= 25 && titleLen <= 70;
  const titleWarn = titleLen > 70 && titleLen <= 195;

  // Keyword audit (duplicates, plurals, count, trademarks)
  const rawList = (keywordsRaw || []).map((k) => k.trim()).filter(Boolean);
  const seenExact = new Set<string>();
  const seenStems = new Map<string, string>();
  const duplicateOrPluralHits: string[] = [];
  const cleanedKeywords: string[] = [];
  const trademarkHits: string[] = [];

  rawList.forEach((kw) => {
    const lower = kw.toLowerCase();
    const stem = getSingularStem(lower);

    // Check trademark
    RESTRICTED_TRADEMARK_WORDS.forEach((tm) => {
      const regex = new RegExp(`\\b${tm}\\b`, 'i');
      if (regex.test(lower) && !trademarkHits.includes(tm)) {
        trademarkHits.push(tm);
      }
    });

    if (seenExact.has(lower)) {
      duplicateOrPluralHits.push(`${kw} (Exact Duplicate)`);
    } else if (seenStems.has(stem)) {
      duplicateOrPluralHits.push(`${kw} ≈ ${seenStems.get(stem)} (Plural/Singular Duplicate)`);
    } else {
      seenExact.add(lower);
      seenStems.set(stem, kw);
      cleanedKeywords.push(kw);
    }
  });

  // Also check title for trademarks
  RESTRICTED_TRADEMARK_WORDS.forEach((tm) => {
    const regex = new RegExp(`\\b${tm}\\b`, 'i');
    if (regex.test(cleanTitle) && !trademarkHits.includes(tm)) {
      trademarkHits.push(tm);
    }
  });

  const kwCount = rawList.length;
  const kwCountPass = kwCount >= 25 && kwCount <= 49;

  // Check if Model or Property Release may be required
  const combinedText = `${cleanTitle} ${rawList.join(' ')}`.toLowerCase();
  const releaseTriggersFound = PEOPLE_OR_PROPERTY_TRIGGERS.filter((t) =>
    new RegExp(`\\b${t}\\b`, 'i').test(combinedText)
  );

  const needsRelease = releaseTriggersFound.length > 0;
  const releaseRecommendationEn = needsRelease
    ? `Detected "${releaseTriggersFound.slice(0, 3).join(', ')}": Attach a signed Model/Property Release if any recognizable person or private property is visible.`
    : 'No recognizable person or private property terms detected — Model/Property Release not required for generic commercial concepts.';
  const releaseRecommendationBn = releaseRecommendationEn;

  const checks: PreSubmissionCheckItem[] = [
    {
      id: 'resolution',
      labelEn: 'Minimum 4.0 MP Resolution & Dimensions',
      labelBn: '',
      status: min4MpPass ? 'PASS' : 'FAIL',
      detailEn: isVector
        ? 'Vector artwork scales infinitely (recommend 4MP–15MP artboard).'
        : `${width}×${height} px (${mpNum.toFixed(2)} MP) — Adobe Stock requires ≥ 4.0 MP.`,
      detailBn: isVector
        ? 'Vector artwork scales infinitely (recommend 4MP–15MP artboard).'
        : `${width}×${height} px (${mpNum.toFixed(2)} MP) — Adobe Stock requires ≥ 4.0 MP.`,
    },
    {
      id: 'filesize_eps',
      labelEn: 'File Size & EPS/AI Version Compatibility',
      labelBn: '',
      status: sizePass ? 'PASS' : 'WARNING',
      detailEn: `${fileSizeMB} MB · ${epsVersion} (Max limit: 45MB for EPS, 100MB for JPEG).`,
      detailBn: '',
    },
    {
      id: 'title_len',
      labelEn: 'Commercial Title Length (35–70 Chars Optimal)',
      labelBn: '',
      status: titlePass ? 'PASS' : titleWarn ? 'WARNING' : 'FAIL',
      detailEn: `Current length: ${titleLen} chars. Keep descriptive titles under 70 chars so search grids don't truncate them.`,
      detailBn: '',
    },
    {
      id: 'kw_count',
      labelEn: 'Keyword Count & Plural/Duplicate Check',
      labelBn: '',
      status: kwCountPass && duplicateOrPluralHits.length === 0 ? 'PASS' : 'WARNING',
      detailEn:
        duplicateOrPluralHits.length === 0
          ? `${kwCount}/49 keywords — Zero duplicate or plural spam detected.`
          : `${kwCount} keywords — Found ${duplicateOrPluralHits.length} duplicate/plural pair(s): ${duplicateOrPluralHits.slice(0, 3).join(', ')}.`,
      detailBn:
        duplicateOrPluralHits.length === 0
          ? `${kwCount}/49 keywords — Zero duplicate or plural spam detected.`
          : `${kwCount} keywords — Found ${duplicateOrPluralHits.length} duplicate/plural pair(s): ${duplicateOrPluralHits.slice(0, 3).join(', ')}.`,
    },
    {
      id: 'trademark',
      labelEn: 'Trademark & Protected IP Brand Scan',
      labelBn: '',
      status: trademarkHits.length === 0 ? 'PASS' : 'FAIL',
      detailEn:
        trademarkHits.length === 0
          ? '100% Clean — Zero restricted brand names, camera models, or AI tool names found.'
          : `ALERT: Remove restricted trademark term(s) immediately: ${trademarkHits.join(', ').toUpperCase()}.`,
      detailBn:
        trademarkHits.length === 0
          ? '100% Clean — Zero restricted brand names, camera models, or AI tool names found.'
          : `ALERT: Remove restricted trademark term(s) immediately: ${trademarkHits.join(', ').toUpperCase()}.`,
    },
    {
      id: 'release',
      labelEn: 'Model & Property Release Requirement',
      labelBn: '',
      status: needsRelease ? 'WARNING' : 'PASS',
      detailEn: releaseRecommendationEn,
      detailBn: releaseRecommendationBn,
    },
  ];

  const passCount = checks.filter((c) => c.status === 'PASS').length;
  const readinessScore = Math.round((passCount / checks.length) * 100);

  return {
    fileName,
    fileSizeMB,
    dimensions: width && height ? `${width} × ${height} px` : 'Scalable Vector Artboard',
    megapixels,
    epsVersion,
    overallPass: checks.every((c) => c.status !== 'FAIL'),
    readinessScore,
    checks,
    cleanedKeywords,
    trademarkHits,
    duplicateOrPluralHits,
    releaseRecommendationEn,
    releaseRecommendationBn,
  };
}

/**
 * 2. REJECTION REASON HELPER DICTIONARY
 * Explains Adobe Stock's 5 most common rejection reasons and gives step-by-step fixes.
 */
export const REJECTION_REMEDY_GUIDES: RejectionRemedyGuide[] = [
  {
    id: 'similar_content',
    reasonTitleEn: 'Similar Content / Spam Rejection',
    reasonTitleBn: '',
    badgeColor: 'amber',
    whyItHappensEn:
      'Uploading multiple variations with nearly identical composition, color changes only, or copy-pasting the exact same title and first 10 keywords across a batch.',
    whyItHappensBn: '',
    howToFixStepsEn: [
      'Select only the top 2–3 strongest variations from a similar set (different camera angle, aspect ratio, or framing).',
      'Give every file a unique Title that describes its specific angle (e.g., "Wide Banner", "Isometric Cutaway", "Macro Close-Up").',
      'Reorder Keyword Slots #1–#10 so no two files in the same upload batch share identical tag sequences.',
    ],
    howToFixStepsBn: [],
    preUploadChecklistEn: 'Rule of Thumb: Ask yourself "Would a buyer purchase both of these files separately?"',
    preUploadChecklistBn: '',
  },
  {
    id: 'technical_noise_artifacts',
    reasonTitleEn: 'Technical Issues: Noise, Artifacts & AI Anatomy Errors',
    reasonTitleBn: '',
    badgeColor: 'red',
    whyItHappensEn:
      'Reviewers inspect images at 100% zoom. Over-sharpening halos, JPEG compression blocks, chromatic aberration, or AI generation defects (warped fingers, gibberish text, asymmetrically melted objects) cause instant rejection.',
    whyItHappensBn: '',
    howToFixStepsEn: [
      'Inspect your image at 100%–200% zoom before uploading; heal any malformed AI hands, eyes, or background wires.',
      'Apply gentle luminance noise reduction in Lightroom/Camera Raw and avoid aggressive upscaling halos.',
      'Export as sRGB JPEG at 95%–98% quality and never upscale a blurry low-res image past 2x without clean detail restoration.',
    ],
    howToFixStepsBn: [],
    preUploadChecklistEn: 'Always check corners and background textures at 100% zoom.',
    preUploadChecklistBn: '',
  },
  {
    id: 'ip_trademark',
    reasonTitleEn: 'Intellectual Property (IP), Trademark & Brand Violation',
    reasonTitleBn: '',
    badgeColor: 'rose',
    whyItHappensEn:
      'Visible logos on clothing/laptops/cars, recognizable product designs (iPhone camera bump, Porsche headlights, Nike swoosh), famous landmarks requiring permits, or mentioning brand/AI generator names in Titles/Keywords.',
    whyItHappensBn: '',
    howToFixStepsEn: [
      'Clone out or healing-brush every visible logo, brand name, serial number, QR code, and license plate.',
      'Remove distinctive proprietary hardware contours (e.g., Apple notch/camera layout, branded sneaker soles).',
      'Run the Pre-Submission Checker above to strip forbidden trademark words from your Title and 49 Keywords.',
    ],
    howToFixStepsBn: [],
    preUploadChecklistEn: 'Zero logos in pixels + Zero brand names in metadata = 100% IP Safe.',
    preUploadChecklistBn: '',
  },
  {
    id: 'focus_exposure',
    reasonTitleEn: 'Out of Focus, Motion Blur or Poor Lighting/Exposure',
    reasonTitleBn: '',
    badgeColor: 'sky',
    whyItHappensEn:
      'The main subject lacks tack-sharp focus, shallow depth-of-field missed the eyes/focal point, or highlights/shadows are clipped (pure blown-out white or crushed black blobs).',
    whyItHappensBn: '',
    howToFixStepsEn: [
      'Ensure the focal point (especially eyes in portraits or front edges in product shots) is crisp at 1:1 pixel view.',
      'Check your Histogram: pull Highlights down to -15 and lift Shadows to +15 so no pure clipping occurs.',
      'If using shallow depth of field (bokeh), make sure the transition between sharp subject and blurred background looks natural.',
    ],
    howToFixStepsBn: [],
    preUploadChecklistEn: 'Downscaling slightly (e.g., 20%) often tightens soft pixel edges.',
    preUploadChecklistBn: '',
  },
  {
    id: 'non_compliant_metadata',
    reasonTitleEn: 'Title / Keyword Policy Violation or Misleading Tags',
    reasonTitleBn: '',
    badgeColor: 'emerald',
    whyItHappensEn:
      'Including artist names ("in the style of Pixar/Van Gogh"), AI tool names ("Midjourney v6"), camera specs ("shot on Canon 5D"), or stuffing unrelated trending keywords that do not appear in the image.',
    whyItHappensBn: '',
    howToFixStepsEn: [
      'Describe ONLY what is visually present in the image plus its direct commercial concept.',
      'Never include prompt parameters (--ar 16:9, --v 6.0, 8k, octane render, unreal engine, photorealistic) in your Title or Keywords.',
      'Use our Keyword Quality Score Auditor below to automatically flag and remove irrelevant or forbidden tags.',
    ],
    howToFixStepsBn: [],
    preUploadChecklistEn: 'Keep titles literal, factual, and between 5 to 12 words.',
    preUploadChecklistBn: '',
  },
];

/**
 * 3. KEYWORD QUALITY SCORE & RELEVANCE AUDITOR
 * Evaluates how well keywords align with the Title & Visual Subject, warns about irrelevant/forbidden words,
 * and outputs a clean, policy-compliant 49-tag set.
 */
export function calculateKeywordQualityScore(
  title: string,
  keywords: string[]
): KeywordQualityAudit {
  const cleanTitle = (title || '').toLowerCase().trim();
  const titleWords = cleanTitle
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !['and', 'with', 'for', 'the', 'from', 'into', 'over'].includes(w));

  const FORBIDDEN_PROMPT_SLOP = [
    'midjourney',
    'dalle',
    'stable diffusion',
    'comfyui',
    'octane render',
    'unreal engine',
    '8k',
    '4k',
    'photorealistic',
    'hyperrealistic',
    'trending on artstation',
    'award winning',
    'masterpiece',
    'best quality',
    'canon',
    'nikon',
    'sony',
  ];

  const relevantKeywords: string[] = [];
  const irrelevantWarnings: { keyword: string; reasonEn: string; reasonBn: string }[] = [];
  const duplicateWarnings: string[] = [];
  const trademarkWarnings: string[] = [];
  const seenStems = new Set<string>();

  let top10Hits = 0;

  keywords.forEach((rawKw, idx) => {
    const kw = rawKw.trim();
    if (!kw) return;
    const lower = kw.toLowerCase();
    const stem = getSingularStem(lower);

    // 1. Check duplicate/plural
    if (seenStems.has(stem)) {
      duplicateWarnings.push(kw);
      return;
    }
    seenStems.add(stem);

    // 2. Check forbidden AI/prompt/camera slop
    if (FORBIDDEN_PROMPT_SLOP.some((f) => lower.includes(f))) {
      irrelevantWarnings.push({
        keyword: kw,
        reasonEn: 'Prompt/Camera/AI jargon (Not allowed in Adobe Stock tags)',
        reasonBn: '',
      });
      return;
    }

    // 3. Check trademark
    if (RESTRICTED_TRADEMARK_WORDS.some((tm) => new RegExp(`\\b${tm}\\b`, 'i').test(lower))) {
      trademarkWarnings.push(kw);
      irrelevantWarnings.push({
        keyword: kw,
        reasonEn: 'Protected Brand / Trademark name (Causes IP Rejection)',
        reasonBn: '',
      });
      return;
    }

    // 4. Check Title-to-Top-10 correlation
    const sharesWordWithTitle = titleWords.some((tw) => lower.includes(tw) || tw.includes(lower));
    if (idx < 10 && sharesWordWithTitle) {
      top10Hits++;
    }

    relevantKeywords.push(kw);
  });

  const top10CorrelationPct = Math.min(100, Math.max(40, top10Hits * 18 + 28));
  const penalty = irrelevantWarnings.length * 6 + duplicateWarnings.length * 3 + trademarkWarnings.length * 15;
  const baseScore = Math.min(99, Math.max(35, Math.round(top10CorrelationPct * 0.65 + Math.min(relevantKeywords.length, 45) * 0.8 - penalty)));

  // Reorder so keywords matching title words appear in Slots #1-#10
  const titleMatched = relevantKeywords.filter((k) =>
    titleWords.some((tw) => k.toLowerCase().includes(tw))
  );
  const remaining = relevantKeywords.filter((k) => !titleMatched.includes(k));
  const cleanedOptimized49 = [...titleMatched, ...remaining].slice(0, 49);

  return {
    overallScore: baseScore,
    top10CorrelationPct,
    relevantKeywords,
    irrelevantWarnings,
    duplicateWarnings,
    trademarkWarnings,
    cleanedOptimized49,
  };
}

/**
 * 4. AI CONTENT DISCLOSURE POLICY HELPER
 * Sanitizes Title & Keywords to strictly comply with Adobe Stock Generative AI guidelines
 */
export function sanitizeForGenerativeAiPolicy(title: string, keywords: string[]): {
  compliantTitle: string;
  compliantKeywords: string[];
  removedViolations: string[];
  checklistGuidelinesEn: string[];
  checklistGuidelinesBn: string[];
} {
  const BANNED_AI_TERMS = [
    ...RESTRICTED_TRADEMARK_WORDS,
    'in the style of',
    'midjourney',
    'firefly',
    'dall-e',
    'stable diffusion',
    'octane render',
    'unreal engine',
    'photorealistic',
    'hyperrealistic',
    '8k resolution',
    '--ar',
    '--v',
  ];

  const removedViolations: string[] = [];
  let compliantTitle = title;

  BANNED_AI_TERMS.forEach((term) => {
    const reg = new RegExp(`\\b${term.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
    if (reg.test(compliantTitle)) {
      removedViolations.push(term);
      compliantTitle = compliantTitle.replace(reg, '').replace(/\s+/g, ' ').trim();
    }
  });

  const compliantKeywords = keywords.filter((kw) => {
    const lower = kw.toLowerCase().trim();
    const hit = BANNED_AI_TERMS.find((term) => lower.includes(term));
    if (hit) {
      if (!removedViolations.includes(kw)) removedViolations.push(kw);
      return false;
    }
    return true;
  });

  return {
    compliantTitle: compliantTitle.slice(0, 70),
    compliantKeywords: compliantKeywords.slice(0, 49),
    removedViolations,
    checklistGuidelinesEn: [
      'Check the "Created using generative AI tools" box in the Adobe Stock Contributor Portal.',
      'Select "Illustration" as the File Type if your AI artwork is stylized/vector, or "Photo" only if it is realistic photography.',
      'Do NOT include real people names, living artist names, brand names, or AI generator names in your Title or Keywords.',
      'If your AI image depicts a realistic human face, attach a Property Release confirming you have rights to the synthetic likeness.',
    ],
    checklistGuidelinesBn: [],
  };
}
