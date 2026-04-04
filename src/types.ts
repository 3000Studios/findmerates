export enum RateCategory {
  MORTGAGE = 'mortgage',
  CD = 'cd',
  AUTO_LOAN = 'auto_loan',
  PERSONAL_LOAN = 'personal_loan',
  REFINANCE = 'refinance',
  INSURANCE = 'insurance',
  SAVINGS = 'savings',
}

export interface RateResult {
  id: string;
  provider: string;
  providerLogo?: string;
  rate: number;
  apr?: number;
  term: string;
  category: RateCategory;
  location?: string;
  lastUpdated: string;
  minCreditScore?: number;
  details: string[];
  ctaUrl: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isPro: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SavedSearch {
  id: string;
  uid: string;
  query: string;
  category: RateCategory;
  filters: Record<string, any>;
  createdAt: string;
}

export interface RateAlert {
  id: string;
  uid: string;
  category: RateCategory;
  targetRate: number;
  condition: 'less_than' | 'greater_than';
  isActive: boolean;
  createdAt: string;
}
