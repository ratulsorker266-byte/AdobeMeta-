export type TargetMarketplace = 'adobe_stock' | 'shutterstock' | 'freepik' | '123rf' | 'dreamstime' | 'vecteezy';

export interface BulkItem {
  id: string;
  file: File;
  previewUrl: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  result?: {
    recommendedTitle: string;
    shortDescription: string;
    keywords: string[];
    priorityKeywords: string[];
    overallSubmissionRiskScore: number;
    riskLabel: string;
    technicalQualityScore: number;
    copyrightRiskScore: number;
    explanation: string;
    detectedDefects: string[];
  };
  error?: string;
  isHistory?: boolean;
  celebrated?: boolean;
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
}

export interface TrendData {
  currentTrends: TrendItem[];
  upcomingTrends: TrendItem[];
}
