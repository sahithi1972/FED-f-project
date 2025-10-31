export type ImpactTimespan = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface ImpactLog {
  id: string;
  userId: string;
  wasteReduced: number;
  moneySaved: number;
  co2Reduced: number;
  waterSaved: number;
  timespan: ImpactTimespan;
  loggedAt: Date;
}

export interface ImpactTotals {
  wasteReduced: number;
  moneySaved: number;
  co2Reduced: number;
  waterSaved: number;
}

export interface ImpactStats {
  total: ImpactTotals;
  weekly: ImpactTotals;
  impactScore: number;
  logCount: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  profileImage: string | null;
  impactScore: number;
  recipesCreated: number;
  totalLikes: number;
  impactLogCount: number;
}

export interface CommunityTotal {
  totals: ImpactTotals;
  totalLogs: number;
  totalUsers: number;
  averagePerUser: ImpactTotals;
}