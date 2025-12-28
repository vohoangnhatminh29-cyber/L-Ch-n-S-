
export enum RiskLevel {
  LOW = 'THẤP',
  MEDIUM = 'TRUNG BÌNH',
  HIGH = 'CAO'
}

export interface AnalysisResult {
  riskLevel: RiskLevel;
  explanation: string;
  isScam: boolean;
  patternsFound: string[];
  recommendations: string[];
  locationInfo?: {
    region: string;
    details: string;
    mapUri?: string;
    isInternational?: boolean;
    originCountry?: string;
  };
}

export interface ScamScenario {
  id: string;
  title: string;
  category: string;
  description: string;
  signs: string[];
  prevention: string;
  targetAudience?: string[];
}

export interface ScamNews {
  id?: string;
  created_at?: string;
  title: string;
  url: string;
  source: string;
  date: string;
  snippet: string;
}

export interface ScamVideo {
  id: string;
  title: string;
  url: string;
  embedUrl: string;
  thumbnail: string;
  source: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ScamAlert {
  id: string;
  type: 'URGENT' | 'COMMUNITY' | 'HOT';
  timestamp: string;
  content: string;
}

export interface SafetyRule {
  id: string;
  title: string;
  content: string;
  icon: string;
}

export interface HandlingStep {
  condition: string;
  actions: string[];
}

export interface CommunityReport {
  id: string | number;
  target: string;
  description: string;
  timestamp: string;
}

export interface Question {
  id: number;
  level: 1 | 2 | 3;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}
