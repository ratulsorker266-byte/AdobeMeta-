export type TargetMarketplace = 'adobe_stock' | 'shutterstock' | 'freepik' | '123rf' | 'dreamstime' | 'vecteezy' | 'getty';

export type MetadataResult = {
  recommendedTitle: string;
  shortDescription: string;
  keywords: string[];
  priorityKeywords: string[];
  overallSubmissionRiskScore: number;
  riskLabel: string;
  salesPotentialScore?: number;
  acceptanceProbability?: number;
  rejectionFlags?: string[];
  technicalQualityScore: number;
  copyrightRiskScore: number;
  explanation: string;
  detectedDefects: string[];
  trademarkRisk?: 'none' | 'low' | 'medium' | 'high';
  detectedTrademarks?: string[];
  modelReleaseRequired?: boolean;
  propertyReleaseRequired?: boolean;
  releaseExplanation?: string;
};

export interface BulkItem {
  id: string;
  file: File;
  previewUrl: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  result?: MetadataResult;
  error?: string;
  isHistory?: boolean;
  celebrated?: boolean;
  epsHint?: {
    title?: string;
    keywords?: string[];
    description?: string;
    boundingBox?: any;
    colorPalette?: string[];
  };
  psdHint?: {
    title?: string;
    width?: number;
    height?: number;
    colorMode?: string;
    layerCount?: number;
  };
}

export interface StockPromptResult {
  midjourneyPrompt: string;
  fireflyPrompt: string;
  fluxPrompt: string;
  negativePrompt: string;
  commercialTips: string;
  suggestedTitle: string;
  suggestedKeywords: string[];
}

export interface SeasonalDeadline {
  id: string;
  title: string;
  eventDate: string;
  submissionWindow: string;
  daysRemaining: number;
  urgency: 'critical' | 'moderate' | 'upcoming';
  season: string;
  topNiches: string[];
  buyerDemandNotes: string;
  searchKeyword: string;
}

export interface MarketplaceRule {
  key: TargetMarketplace;
  name: string;
  keywordLimit: number;
  aiAccepted: boolean;
  lastVerified: string;
}

export interface TrendItem {
  topic: string;
  description: string;
  keywords: string[];
  targetMonth?: string;
  actionGuide?: string;
  bestFor?: string;
}

export interface TrendData {
  monthName?: string;
  monthOverview?: string;
  whatToCreate?: string[];
  currentTrends: TrendItem[];
  upcomingTrends: TrendItem[];
}
