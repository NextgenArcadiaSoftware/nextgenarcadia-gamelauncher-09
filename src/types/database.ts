
import type { Database as OriginalDatabase } from '@/integrations/supabase/types';

export interface Database extends OriginalDatabase {
  public: {
    Tables: {
      games: {
        Row: {
          id: string;
          title: string;
          description: string;
          genre: string;
          release_date: string;
          thumbnail: string;
          trailer?: string;
          executable_path?: string;
          launch_code?: string;
          status: 'enabled' | 'disabled';
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          genre: string;
          release_date: string;
          thumbnail: string;
          trailer?: string;
          executable_path?: string;
          launch_code?: string;
          status?: 'enabled' | 'disabled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          genre?: string;
          release_date?: string;
          thumbnail?: string;
          trailer?: string;
          executable_path?: string;
          launch_code?: string;
          status?: 'enabled' | 'disabled';
          created_at?: string;
          updated_at?: string;
        };
      };
      settings: {
        Row: {
          id: string;
          timer_duration: number;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id: string;
          timer_duration?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          timer_duration?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      game_sessions: {
        Row: {
          id: string;
          game_id?: string;
          started_at?: string;
          ended_at?: string;
          duration: number;
        };
        Insert: {
          id?: string;
          game_id?: string;
          started_at?: string;
          ended_at?: string;
          duration?: number;
        };
        Update: {
          id?: string;
          game_id?: string;
          started_at?: string;
          ended_at?: string;
          duration?: number;
        };
      };
      game_ratings: {
        Row: {
          id: string;
          game_id?: string;
          rating: number;
          created_at?: string;
        };
        Insert: {
          id?: string;
          game_id?: string;
          rating: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          game_id?: string;
          rating?: number;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
