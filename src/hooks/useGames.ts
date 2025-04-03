
import { useEffect, useState } from 'react';
import { Game } from '@/types/game';
import { supabase } from '@/integrations/supabase/client';

export function useGames(category: string, searchTerm: string) {
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchGames() {
      setLoading(true);
      setError(null);
      
      try {
        let query = supabase.from('games').select('*');
        
        // Apply category filter if not 'All'
        if (category && category !== 'All') {
          query = query.eq('genre', category);
        }
        
        // Apply search filter if search term exists
        if (searchTerm) {
          query = query.ilike('title', `%${searchTerm}%`);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        setGames(data || []);
      } catch (err) {
        console.error('Error fetching games:', err);
        setError('Failed to load games. Please try again later.');
        setGames([]);
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, [category, searchTerm]);

  return { games, loading, error };
}
