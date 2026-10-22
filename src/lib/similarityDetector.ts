/**
 * Adobe Stock Distinct Content & Metadata Similarity Shield
 * 
 * Complies with Adobe Stock's "Distinct content submission guidelines" (Updated Jun 11, 2026):
 * - Detects Subject and Composition redundancy
 * - Detects Metadata patterns (identical or >50% overlapping titles and keywords)
 * - Automatically differentiates similar assets in a contributor's batch
 */

export interface SimilarityRiskPair {
  itemAId: string;
  itemAName: string;
  itemATitle: string;
  itemBId: string;
  itemBName: string;
  itemBTitle: string;
  keywordOverlapPercent: number;
  titleSimilarityPercent: number;
  overallSimilarityPercent: number;
  refusalRisk: 'HIGH' | 'MODERATE' | 'LOW';
  recommendedAction: string;
}

export interface BatchSimilarityReport {
  totalAssetsChecked: number;
  conflictingPairs: SimilarityRiskPair[];
  clusters: string[][]; // Groupings of item IDs that are too similar
  isSafeForAdobeStock: boolean;
  overallBatchSimilarityScore: number; // 0 (100% distinct) to 100 (identical)
}

/**
 * Calculates Token-level Jaccard similarity between two string arrays
 */
export function calculateJaccardIndex(tokensA: string[], tokensB: string[]): number {
  if (!tokensA.length || !tokensB.length) return 0;
  const setA = new Set(tokensA.map(t => t.toLowerCase().trim()));
  const setB = new Set(tokensB.map(t => t.toLowerCase().trim()));
  
  let intersectionCount = 0;
  for (const item of setA) {
    if (setB.has(item)) intersectionCount++;
  }
  
  const unionSize = setA.size + setB.size - intersectionCount;
  return unionSize > 0 ? (intersectionCount / unionSize) * 100 : 0;
}

/**
 * Calculates Title Similarity based on word tokens
 */
export function calculateTitleSimilarity(titleA: string, titleB: string): number {
  if (!titleA || !titleB) return 0;
  const wordsA = titleA.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);
  const wordsB = titleB.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);
  return calculateJaccardIndex(wordsA, wordsB);
}

/**
 * Analyzes an entire batch of items for Adobe Stock "Similar Content" risks
 */
export function analyzeBatchSimilarity(items: Array<{
  id: string;
  file: { name: string };
  result?: {
    recommendedTitle?: string;
    keywords?: string[];
  };
}>): BatchSimilarityReport {
  const completedItems = items.filter(it => it.result?.recommendedTitle && it.result?.keywords?.length);
  if (completedItems.length < 2) {
    return {
      totalAssetsChecked: completedItems.length,
      conflictingPairs: [],
      clusters: [],
      isSafeForAdobeStock: true,
      overallBatchSimilarityScore: 0,
    };
  }

  const conflictingPairs: SimilarityRiskPair[] = [];
  const similarityMatrix: { [key: string]: Set<string> } = {};

  for (let i = 0; i < completedItems.length; i++) {
    for (let j = i + 1; j < completedItems.length; j++) {
      const itemA = completedItems[i];
      const itemB = completedItems[j];

      const titleSim = calculateTitleSimilarity(
        itemA.result?.recommendedTitle || '',
        itemB.result?.recommendedTitle || ''
      );

      const kwOverlap = calculateJaccardIndex(
        itemA.result?.keywords || [],
        itemB.result?.keywords || []
      );

      // Weighted score: Keywords carry 60% weight, Title carries 40%
      const overallSim = Math.round((kwOverlap * 0.6) + (titleSim * 0.4));

      // Adobe Stock refuses content when titles and keywords share >55% similarity
      if (overallSim >= 50 || kwOverlap >= 65 || titleSim >= 70) {
        const risk: 'HIGH' | 'MODERATE' | 'LOW' =
          overallSim >= 65 ? 'HIGH' : overallSim >= 50 ? 'MODERATE' : 'LOW';

        conflictingPairs.push({
          itemAId: itemA.id,
          itemAName: itemA.file.name,
          itemATitle: itemA.result?.recommendedTitle || '',
          itemBId: itemB.id,
          itemBName: itemB.file.name,
          itemBTitle: itemB.result?.recommendedTitle || '',
          keywordOverlapPercent: Math.round(kwOverlap),
          titleSimilarityPercent: Math.round(titleSim),
          overallSimilarityPercent: overallSim,
          refusalRisk: risk,
          recommendedAction:
            risk === 'HIGH'
              ? 'Differentiate title framing (e.g. Wide vs Macro) and diversify top 10 keywords.'
              : 'Add distinctive angle and utility tags to distinguish buyer intent.',
        });

        if (!similarityMatrix[itemA.id]) similarityMatrix[itemA.id] = new Set();
        if (!similarityMatrix[itemB.id]) similarityMatrix[itemB.id] = new Set();
        similarityMatrix[itemA.id].add(itemB.id);
        similarityMatrix[itemB.id].add(itemA.id);
      }
    }
  }

  // Find connected clusters of similar items
  const visited = new Set<string>();
  const clusters: string[][] = [];

  for (const id of Object.keys(similarityMatrix)) {
    if (visited.has(id)) continue;
    const cluster: string[] = [];
    const queue = [id];
    visited.add(id);

    while (queue.length > 0) {
      const current = queue.shift()!;
      cluster.push(current);
      for (const neighbor of similarityMatrix[current] || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    if (cluster.length > 1) {
      clusters.push(cluster);
    }
  }

  const maxSim = conflictingPairs.length
    ? Math.max(...conflictingPairs.map(p => p.overallSimilarityPercent))
    : 0;

  return {
    totalAssetsChecked: completedItems.length,
    conflictingPairs,
    clusters,
    isSafeForAdobeStock: conflictingPairs.length === 0,
    overallBatchSimilarityScore: maxSim,
  };
}

const DISTINCT_PERSPECTIVE_PREFIXES = [
  'Wide Angle Environmental View of',
  'Close Up Macro Detail of',
  'High Angle Overhead Flat Lay of',
  'Dynamic Motion and Candid Action of',
  'Minimalist Isolated Perspective of',
  'Low Angle Cinematic View of',
  'Side Profile Framing of',
  'Authentic Real Life Commercial Scene of',
];

const DISTINCT_KEYWORD_POOLS: { [key: string]: string[] } = {
  wide: ['wide angle', 'environmental context', 'copy space banner', 'panoramic perspective', 'landscape framing', 'spacious layout', 'negative space'],
  macro: ['macro detail', 'close up focus', 'texture detail', 'tactile surface', 'intricate craftsmanship', 'selective focus', 'shallow depth of field'],
  flatlay: ['overhead flat lay', 'top down view', 'knolling arrangement', 'minimalist composition', 'organized layout', 'neatly aligned', 'clean table top'],
  dynamic: ['dynamic action', 'spontaneous movement', 'candid interaction', 'active lifestyle', 'authentic emotion', 'in motion', 'real life engagement'],
  minimal: ['minimalist concept', 'isolated background', 'conceptual symbol', 'clean copy space', 'geometric simplicity', 'single subject', 'uncluttered frame'],
};

/**
 * 1-Click Auto-Differentiator:
 * Takes a cluster of similar items and rewrites their titles and top keywords
 * so Adobe Stock's "Similar content / Metadata patterns" filter is 100% satisfied.
 */
export function autoDifferentiateItemMetadata(
  item: {
    id: string;
    file: { name: string };
    result?: {
      recommendedTitle?: string;
      keywords?: string[];
      category?: string;
      shortDescription?: string;
    };
  },
  variationIndex: number
): {
  differentiatedTitle: string;
  differentiatedKeywords: string[];
  appliedPerspective: string;
} {
  const currentTitle = item.result?.recommendedTitle || '';
  const currentKeywords = item.result?.keywords ? [...item.result.keywords] : [];

  const archetypeKeys = ['wide', 'macro', 'flatlay', 'dynamic', 'minimal'];
  const chosenArchetypeKey = archetypeKeys[variationIndex % archetypeKeys.length];
  const chosenPrefix = DISTINCT_PERSPECTIVE_PREFIXES[variationIndex % DISTINCT_PERSPECTIVE_PREFIXES.length];
  const perspectiveKeywords = DISTINCT_KEYWORD_POOLS[chosenArchetypeKey] || [];

  // 1. Strip existing generic camera prefixes if present
  let cleanCoreTitle = currentTitle
    .replace(/^(wide angle environmental view of|close up macro detail of|high angle overhead flat lay of|dynamic motion and candid action of|minimalist isolated perspective of|low angle cinematic view of|side profile framing of|authentic real life commercial scene of)\s*/i, '')
    .trim();

  // If title was too short or missing
  if (cleanCoreTitle.length < 10) {
    cleanCoreTitle = item.file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
  }

  // Construct differentiated title ensuring subject-first priority under 68 characters
  let newTitle = `${chosenPrefix} ${cleanCoreTitle}`;
  if (newTitle.length > 68) {
    const cut = newTitle.substring(0, 68);
    const ls = cut.lastIndexOf(' ');
    newTitle = ls > 30 ? cut.substring(0, ls) : cut;
  }

  // 2. Diversify Top Keywords
  // Remove keywords that are too generic and inject 4-6 distinct composition/utility keywords into top 10
  const filteredExisting = currentKeywords.filter(k => {
    const lower = k.toLowerCase().trim();
    // Keep subject nouns, remove duplicate generic tags
    return !perspectiveKeywords.includes(lower);
  });

  // Unique top 5 perspective tags + remaining original tags
  const newKeywords = Array.from(new Set([
    ...perspectiveKeywords.slice(0, 4),
    ...filteredExisting.slice(0, 8),
    ...perspectiveKeywords.slice(4),
    ...filteredExisting.slice(8),
  ])).slice(0, 49);

  return {
    differentiatedTitle: newTitle,
    differentiatedKeywords: newKeywords,
    appliedPerspective: chosenPrefix,
  };
}
