
export type { Database } from '@/integrations/supabase/types';

// Define additional types for analytics
export interface MonthlyAnalytics {
  month: number;
  year: number;
  total_sessions: number;
  unique_games_played: number;
  avg_duration: number;
  completed_sessions: number;
  game_title: string;
  avg_rating?: number;
}

export interface GameRating {
  title: string;
  averageRating: number;
  totalRatings: number;
}

export interface PopularGame {
  title: string;
  count: number;
  percentage?: number;
}
