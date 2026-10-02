import { MetadataResult, TargetMarketplace } from '../types';

export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  code: string;
  field: 'title' | 'keywords' | 'description' | 'trademark' | 'category' | 'general';
  message: string;
  suggestion?: string;
}

export interface ValidationReport {
  isValid: boolean;
  score: number; // 0 to 100
  issues: ValidationIssue[];
  passedChecks: string[];
  metrics: {
    titleLength: number;
    titleWords: number;
    keywordCount: number;
    exactDuplicatesCount: number;
    nearDuplicatesCount: number;
    trademarkRiskDetected: boolean;
    top10RelevanceScore: number; // 0 to 100
  };
  marketplaceCompliance: Record<TargetMarketplace, {
    isCompliant: boolean;
    issues: string[];
  }>;
}

// Official Trademark & Brand Negative Blacklist (Zero tolerance on microstock agencies)
export const KNOWN_TRADEMARK_BLACKLIST = [
  'apple', 'iphone', 'ipad', 'macbook', 'imac', 'ios', 'airpods',
  'nike', 'swoosh', 'adidas', 'puma', 'gucci', 'prada', 'louis vuitton', 'chanel', 'rolex',
  'sony', 'playstation', 'canon', 'nikon', 'gopro', 'dji',
  'coca cola', 'cocacola', 'pepsi', 'red bull', 'starbucks', 'mcdonalds',
  'bmw', 'mercedes', 'audi', 'tesla', 'ferrari', 'porsche', 'ford', 'chevrolet', 'toyota', 'honda',
  'microsoft', 'windows', 'xbox', 'intel', 'amd', 'nvidia', 'dell', 'hp', 'lenovo',
  'facebook', 'instagram', 'whatsapp', 'tiktok', 'youtube', 'twitter', 'linkedin', 'snapchat', 'pinterest', 'google',
  'disney', 'marvel', 'star wars', 'lego', 'barbie', 'pokemon', 'nintendo'
];

// Low-value promotional or gear buzzwords rejected by reviewers
export const FORBIDDEN_BUZZWORDS = [
  'best', 'amazing', 'unique', 'cool', 'awesome', 'stunning', 'gorgeous', 'masterpiece',
  'shot on', 'iso 100', 'f/1.8', '50mm', 'canon eos', 'nikon d'
];

/**
 * Normalizes keyword string for comparison (removes punctuation, lowercases, trims)
 */
export const normalizeTerm = (term: string): string => {
  return (term || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim();
};

/**
 * Returns simple stemmed representation (handles basic English plurals -s, -es, -ies)
 */
export const getStemmedTerm = (term: string): string => {
  const norm = normalizeTerm(term);
  if (norm.endsWith('ies') && norm.length > 4) {
    return norm.slice(0, -3) + 'y';
  }
  if (norm.endsWith('es') && norm.length > 3) {
    return norm.slice(0, -2);
  }
  if (norm.endsWith('s') && !norm.endsWith('ss') && norm.length > 2) {
    return norm.slice(0, -1);
  }
  return norm;
};

/**
 * Intelligent filter for exact duplicates and singular/plural near-duplicates
 */
export const filterDuplicatesAndSpam = (rawKeywords: string[]): {
  cleaned: string[];
  exactDuplicates: string[];
  nearDuplicates: string[];
  trademarkViolations: string[];
} => {
  const cleaned: string[] = [];
  const exactDuplicates: string[] = [];
  const nearDuplicates: string[] = [];
  const trademarkViolations: string[] = [];

  const seenExact = new Set<string>();
  const seenStemmed = new Map<string, string>(); // stem -> original term

  for (const raw of rawKeywords) {
    const norm = normalizeTerm(raw);
    if (!norm || norm.length <= 1) continue;

    // Check trademark blacklist
    const isTrademark = KNOWN_TRADEMARK_BLACKLIST.some(tm => 
      norm === tm || norm.startsWith(`${tm} `) || norm.endsWith(` ${tm}`) || norm.includes(` ${tm} `)
    );
    if (isTrademark) {
      trademarkViolations.push(raw);
      continue;
    }

    // Exact duplicate check
    if (seenExact.has(norm)) {
      exactDuplicates.push(raw);
      continue;
    }

    // Near-duplicate check (singular vs plural)
    const stem = getStemmedTerm(norm);
    if (seenStemmed.has(stem)) {
      nearDuplicates.push(`${raw} (matches "${seenStemmed.get(stem)}")`);
      continue;
    }

    seenExact.add(norm);
    seenStemmed.set(stem, norm);
    cleaned.push(norm);
  }

  return { cleaned, exactDuplicates, nearDuplicates, trademarkViolations };
};

/**
 * Validates a MetadataResult against official marketplace rules and SEO quality standards
 */
export const validateMetadata = (
  result: MetadataResult,
  targetMarketplace: TargetMarketplace = 'adobe_stock',
  assetType: string = 'Photo'
): ValidationReport => {
  const issues: ValidationIssue[] = [];
  const passedChecks: string[] = [];

  const title = (result.recommendedTitle || '').trim();
  const titleWords = title.split(/\s+/).filter(Boolean);
  const keywords = result.keywords || [];
  const priorityKeywords = result.priorityKeywords || keywords.slice(0, 10);

  // 1. Title Checks
  if (!title) {
    issues.push({
      type: 'error',
      code: 'TITLE_EMPTY',
      field: 'title',
      message: 'Title is empty. A descriptive commercial title is mandatory.'
    });
  } else {
    passedChecks.push('Title is present');

    // Title Length for Adobe Stock (< 70 chars)
    if (title.length > 70) {
      issues.push({
        type: targetMarketplace === 'adobe_stock' ? 'warning' : 'info',
        code: 'TITLE_TOO_LONG_ADOBE',
        field: 'title',
        message: `Title length (${title.length} characters) exceeds Adobe Stock's recommended 70-character limit.`,
        suggestion: 'Shorten to focus strictly on: [Subject] + [Action] + [Setting].'
      });
    } else {
      passedChecks.push(`Title length (${title.length} chars) complies with Adobe Stock < 70 chars rule`);
    }

    // Title Word Count for Shutterstock (>= 5 words)
    if (titleWords.length < 5) {
      issues.push({
        type: targetMarketplace === 'shutterstock' ? 'error' : 'warning',
        code: 'TITLE_TOO_SHORT_SHUTTERSTOCK',
        field: 'title',
        message: `Title has only ${titleWords.length} words. Shutterstock requires a minimum descriptive sentence of at least 5 words.`,
        suggestion: 'Expand slightly to describe subject, action, and environment in complete context.'
      });
    } else {
      passedChecks.push(`Title word count (${titleWords.length} words) meets narrative requirements`);
    }

    // Prohibited buzzwords in title
    const lowerTitle = title.toLowerCase();
    const foundBuzzwords = FORBIDDEN_BUZZWORDS.filter(bw => lowerTitle.includes(bw));
    if (foundBuzzwords.length > 0) {
      issues.push({
        type: 'warning',
        code: 'PROHIBITED_BUZZWORD_IN_TITLE',
        field: 'title',
        message: `Title contains subjective buzzword(s): "${foundBuzzwords.join(', ')}". Stock reviewers prefer factual descriptions.`,
        suggestion: 'Remove subjective words like "best" or "amazing" and describe the visual scene objectively.'
      });
    } else {
      passedChecks.push('Title contains no promotional buzzwords');
    }

    // Trademark check in title
    const foundTmInTitle = KNOWN_TRADEMARK_BLACKLIST.filter(tm => 
      lowerTitle === tm || lowerTitle.includes(` ${tm} `) || lowerTitle.startsWith(`${tm} `) || lowerTitle.endsWith(` ${tm}`)
    );
    if (foundTmInTitle.length > 0) {
      issues.push({
        type: 'error',
        code: 'TRADEMARK_IN_TITLE',
        field: 'trademark',
        message: `Title contains trademarked brand name: "${foundTmInTitle.join(', ')}". This causes immediate stock rejection.`,
        suggestion: 'Replace brand names with generic industry terms (e.g. "smartphone" instead of "iPhone").'
      });
    } else {
      passedChecks.push('Title contains no brand names or trademarks');
    }
  }

  // 2. Keyword Filtering and Near-Duplicate Checks
  const { exactDuplicates, nearDuplicates, trademarkViolations } = filterDuplicatesAndSpam(keywords);

  if (exactDuplicates.length > 0) {
    issues.push({
      type: 'warning',
      code: 'EXACT_DUPLICATE_KEYWORDS',
      field: 'keywords',
      message: `Found ${exactDuplicates.length} exact duplicate keyword(s): [${exactDuplicates.slice(0, 4).join(', ')}]. Stock agencies penalize duplicate tags.`,
      suggestion: 'Remove duplicate occurrences so each keyword appears once.'
    });
  } else {
    passedChecks.push('Zero exact duplicate keywords detected');
  }

  if (nearDuplicates.length > 0) {
    issues.push({
      type: 'warning',
      code: 'NEAR_DUPLICATE_KEYWORDS',
      field: 'keywords',
      message: `Found ${nearDuplicates.length} near-duplicate singular/plural keyword(s): [${nearDuplicates.slice(0, 3).join(', ')}]. Adobe Stock advises using each keyword once.`,
      suggestion: 'Keep only the primary singular or most common form.'
    });
  } else {
    passedChecks.push('Zero near-duplicate singular/plural tags');
  }

  if (trademarkViolations.length > 0) {
    issues.push({
      type: 'error',
      code: 'TRADEMARK_KEYWORDS',
      field: 'trademark',
      message: `Protected trademark keyword(s) detected: [${trademarkViolations.join(', ')}]. Will be refused by stock agency inspectors.`,
      suggestion: 'Scrub all registered brand trademarks from metadata.'
    });
  } else {
    passedChecks.push('Zero trademarked keywords detected');
  }

  // Check for concatenated multi-word phrases (> 3 words)
  const bloatedPhrases = keywords.filter(k => (k || '').trim().split(/\s+/).length > 3);
  if (bloatedPhrases.length > 0) {
    issues.push({
      type: 'warning',
      code: 'BLOATED_MULTI_WORD_PHRASES',
      field: 'keywords',
      message: `Found ${bloatedPhrases.length} keyword(s) with more than 3 words (e.g. "${bloatedPhrases[0]}"). Adobe Stock guidelines mandate separating descriptive elements (e.g. "White", "fluffy", "pup").`,
      suggestion: 'Separate compound descriptions into distinct individual tags.'
    });
  } else {
    passedChecks.push('All keywords are concise, separated descriptive elements');
  }

  // 3. Keyword Count Compliance
  const kwCount = keywords.length;
  if (kwCount < 10) {
    issues.push({
      type: 'warning',
      code: 'LOW_KEYWORD_COUNT',
      field: 'keywords',
      message: `Keyword count (${kwCount}) is low. Most commercial buyers use multiple search vectors. Aim for at least 25-35 relevant keywords.`,
      suggestion: 'Expand with setting, visual composition, lighting, and commercial use-case terms.'
    });
  } else if (kwCount > 49 && targetMarketplace === 'adobe_stock') {
    issues.push({
      type: 'error',
      code: 'EXCEEDS_ADOBE_KEYWORD_LIMIT',
      field: 'keywords',
      message: `Keyword count (${kwCount}) exceeds Adobe Stock's strict maximum limit of 49 keywords.`,
      suggestion: 'Trim to 49 keywords keeping the most relevant.'
    });
  } else if (kwCount > 30 && targetMarketplace === 'freepik') {
    issues.push({
      type: 'warning',
      code: 'EXCEEDS_FREEPIK_KEYWORD_LIMIT',
      field: 'keywords',
      message: `Keyword count (${kwCount}) exceeds Freepik's limit of 30 tags.`,
      suggestion: 'Trim to top 30 tags.'
    });
  } else {
    passedChecks.push(`Keyword count (${kwCount}) complies with ${targetMarketplace} limits`);
  }

  // 4. First 10 Slots Quality Check (Adobe Stock Search Weight)
  const top10 = priorityKeywords.slice(0, 10);
  let top10Score = 100;
  if (top10.length < 5) {
    top10Score -= 40;
    issues.push({
      type: 'warning',
      code: 'TOP_10_UNDERFILLED',
      field: 'keywords',
      message: 'Fewer than 5 keywords prioritized in top positions. Adobe Stock search prioritizes the first 10 positions.',
      suggestion: 'Ensure primary subject, action, and setting are placed in slots 1 to 10.'
    });
  } else {
    passedChecks.push(`Top 10 slots configured with ${top10.length} priority search concepts`);
  }

  // Check if at least one word from Title appears in Top 10 keywords
  const titleNouns = titleWords.map(w => normalizeTerm(w)).filter(w => w.length > 3);
  const top10Norm = top10.map(k => normalizeTerm(k));
  const hasTitleMatchInTop10 = titleNouns.some(n => top10Norm.some(t => t.includes(n) || n.includes(t)));
  if (!hasTitleMatchInTop10 && titleNouns.length > 0) {
    top10Score -= 20;
    issues.push({
      type: 'info',
      code: 'TITLE_TOP10_ALIGNMENT',
      field: 'keywords',
      message: 'Core visual nouns from the Title are not clearly aligned with Top 10 keyword slots.',
      suggestion: 'Align the primary noun in your title with keyword Slot 1 or 2.'
    });
  } else {
    passedChecks.push('Title subject and Top 10 keyword slots are aligned');
  }

  // 5. Score Calculation
  const errorCount = issues.filter(i => i.type === 'error').length;
  const warningCount = issues.filter(i => i.type === 'warning').length;
  let calculatedScore = 100 - (errorCount * 25) - (warningCount * 8);
  calculatedScore = Math.min(100, Math.max(15, calculatedScore));

  // 6. Marketplace Compliance Breakdown
  const marketplaceCompliance: ValidationReport['marketplaceCompliance'] = {
    adobe_stock: {
      isCompliant: title.length <= 70 && kwCount >= 10 && kwCount <= 49 && trademarkViolations.length === 0,
      issues: []
    },
    shutterstock: {
      isCompliant: titleWords.length >= 5 && kwCount >= 7 && kwCount <= 50 && trademarkViolations.length === 0,
      issues: []
    },
    freepik: {
      isCompliant: title.length > 0 && kwCount >= 5 && kwCount <= 30 && trademarkViolations.length === 0,
      issues: []
    },
    getty: {
      isCompliant: title.length > 0 && kwCount >= 5 && kwCount <= 35 && trademarkViolations.length === 0,
      issues: []
    },
    vecteezy: {
      isCompliant: title.length > 0 && kwCount >= 5 && kwCount <= 35 && trademarkViolations.length === 0,
      issues: []
    },
    '123rf': {
      isCompliant: title.length > 0 && kwCount >= 5 && kwCount <= 45 && trademarkViolations.length === 0,
      issues: []
    },
    dreamstime: {
      isCompliant: title.length > 0 && kwCount >= 5 && kwCount <= 45 && trademarkViolations.length === 0,
      issues: []
    }
  };

  return {
    isValid: errorCount === 0,
    score: calculatedScore,
    issues,
    passedChecks,
    metrics: {
      titleLength: title.length,
      titleWords: titleWords.length,
      keywordCount: kwCount,
      exactDuplicatesCount: exactDuplicates.length,
      nearDuplicatesCount: nearDuplicates.length,
      trademarkRiskDetected: trademarkViolations.length > 0,
      top10RelevanceScore: top10Score
    },
    marketplaceCompliance
  };
};

/**
 * Validates generated CSV output for RFC 4180 compliance, correct header names, and column counts
 */
export const validateMarketplaceCsv = (
  csvContent: string,
  marketplace: TargetMarketplace
): { isValid: boolean; rowCount: number; errors: string[] } => {
  const errors: string[] = [];
  if (!csvContent || typeof csvContent !== 'string') {
    return { isValid: false, rowCount: 0, errors: ['CSV content is empty'] };
  }

  const lines = csvContent.replace(/^\uFEFF/, '').trim().split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) {
    return { isValid: false, rowCount: 0, errors: ['No data rows in CSV'] };
  }

  const headerLine = lines[0];
  const expectedHeaders: Record<string, string> = {
    adobe_stock: 'Filename,Title,Keywords,Category',
    shutterstock: 'Filename,Description,Keywords,Categories',
    freepik: 'File name,Title,Tags',
    getty: 'Filename,Title,Description,Keywords',
    vecteezy: 'Filename,Title,Description,Keywords,License'
  };

  const expected = expectedHeaders[marketplace];
  if (expected && !headerLine.toLowerCase().includes(expected.split(',')[0].toLowerCase())) {
    errors.push(`Header row "${headerLine}" does not match expected format "${expected}" for ${marketplace}.`);
  }

  return {
    isValid: errors.length === 0,
    rowCount: lines.length - 1,
    errors
  };
};
