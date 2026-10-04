export type TabType = 
  | 'home'
  | 'support'
  | 'app-download'
  | 'game-zone'
  | 'savings-calc'
  | 'loan-calc'
  | 'featured-products'
  | 'branches';

export interface SupportStep {
  stepNumber: number;
  title: string;
  content: string;
  imageUrl: string;
}

export interface SupportTopic {
  id: string;
  title: string;
  shortDesc: string;
  videoUrl: string;
  steps: SupportStep[];
}

export interface BranchInfo {
  stt: number;
  name: string;
  office: string;
  address: string;
  imageUrl: string;
  mapUrl: string;
  phone: string;
  displayPhone: string;
  isHeadquarters: boolean;
}

export interface FeaturedProduct {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  badge: string;
}

export interface VoucherItem {
  id: string;
  game: 'flappy' | 'snake';
  gameName: string;
  voucherCode: string;
  reward: string;
  score: number;
  timestamp: string;
}
