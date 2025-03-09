
import { supabase } from "@/integrations/supabase/client";
import type { Game } from "@/types/game";

// Default games to insert if none exist
const defaultGames: Omit<Game, "id" | "created_at" | "updated_at">[] = [
  {
    title: "Fruit Ninja VR",
    description: "Slice your way through a delicious lineup of fruits and compete for high scores.",
    genre: "Action",
    release_date: "2016-07-07",
    thumbnail: "/placeholder.svg",
    trailer: "https://www.youtube.com/watch?v=hPY4TRRHwZc",
    executable_path: "steam://rungameid/486780",
    status: "enabled"
  },
  {
    title: "Elven Assassin",
    description: "Defend your castle from hordes of orcs with your bow and arrow.",
    genre: "Action",
    release_date: "2016-12-01",
    thumbnail: "/placeholder.svg",
    trailer: "https://www.youtube.com/watch?v=D94cNMNyMy4",
    executable_path: "steam://rungameid/503770",
    status: "enabled"
  },
  {
    title: "Crisis Brigade 2 Reloaded",
    description: "Fast-paced VR shooting gallery game inspired by classic light gun games.",
    genre: "Action",
    release_date: "2020-05-21",
    thumbnail: "/placeholder.svg",
    trailer: "https://www.youtube.com/watch?v=pZHvTXD7QEw",
    executable_path: "steam://rungameid/1294750",
    status: "enabled"
  },
  {
    title: "Creed: Rise to Glory Championship Edition",
    description: "Step into the ring in this intense VR boxing experience featuring iconic characters from the Creed and Rocky universe.",
    genre: "Sports",
    release_date: "2023-04-04",
    thumbnail: "/placeholder.svg",
    trailer: "https://www.youtube.com/watch?v=EgbCMJ54xeM",
    executable_path: "steam://rungameid/804490",
    status: "enabled"
  },
  {
    title: "Beat Saber",
    description: "The ultimate VR rhythm game. Slash the beats, move to the music, and play the way you want to play.",
    genre: "Rhythm",
    release_date: "2019-05-21",
    thumbnail: "/lovable-uploads/1b5bd71c-b0e9-4c92-ab66-af7bc3967abb.png",
    trailer: "https://www.youtube.com/watch?v=vL39Sg2AqWg",
    executable_path: "steam://rungameid/620980",
    status: "enabled"
  },
  {
    title: "Richies Plank Experience",
    description: "Face your fears in VR! Walk a narrow plank 80 stories high above a bustling city.",
    genre: "Simulation",
    release_date: "2016-12-21",
    thumbnail: "/lovable-uploads/af1a36b9-7e7b-4f03-814d-ea2c073181e0.png",
    trailer: "https://www.youtube.com/watch?v=faNsP7ExSt0",
    executable_path: "steam://rungameid/517160",
    status: "enabled"
  },
  {
    title: "RollerCoaster Legends",
    description: "Experience thrilling roller coaster rides in stunning virtual environments.",
    genre: "Adventure",
    release_date: "2017-12-21",
    thumbnail: "/placeholder.svg",
    trailer: "https://www.youtube.com/watch?v=OpnTbOz_POE",
    executable_path: "steam://rungameid/901520",
    status: "enabled"
  },
  {
    title: "Arizona Sunshine II",
    description: "Face the zombie apocalypse in VR! Jump into the action-packed American Southwest.",
    genre: "Action",
    release_date: "2023-12-07",
    thumbnail: "/placeholder.svg",
    trailer: "https://www.youtube.com/watch?v=kNaSe37rcG4",
    executable_path: "steam://rungameid/1540210",
    status: "enabled"
  }
];

// Initialize default games if none exist
export async function getDefaultGames() {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .order('title');
  
  if (error) {
    console.error('Error fetching games:', error);
    return [];
  }

  if (!data || data.length === 0) {
    for (const game of defaultGames) {
      const { error: insertError } = await supabase
        .from('games')
        .insert([game]);
      
      if (insertError) {
        console.error(`Failed to insert ${game.title}:`, insertError);
      }
    }
    const { data: updatedData } = await supabase
      .from('games')
      .select('*')
      .order('title');
    
    return updatedData || [];
  }

  return data;
}

// Initialize settings with default values if not exists
export async function initializeSettings() {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 'global')
    .single();
  
  if (error || !data) {
    const { error: insertError } = await supabase
      .from('settings')
      .insert([{ id: 'global', timer_duration: 8 }]);
    
    if (insertError) {
      console.error('Failed to insert settings:', insertError);
    }
  }
}

// Get timer duration from settings
export async function getTimerDuration() {
  const { data, error } = await supabase
    .from('settings')
    .select('timer_duration')
    .eq('id', 'global')
    .single();
  
  if (error) {
    console.error('Error fetching timer duration:', error);
    return 8; // Default value
  }

  return data?.timer_duration || 8;
}

// Record a game session
export async function recordGameSession(gameId: string, duration: number) {
  const now = new Date().toISOString();
  
  const { error } = await supabase
    .from('game_sessions')
    .insert([{
      game_id: gameId,
      duration: duration,
      ended_at: now
    }]);
  
  if (error) {
    console.error('Error recording game session:', error);
  }
}

// Record a game rating
export async function recordGameRating(gameId: string, rating: number) {
  const { error } = await supabase
    .from('game_ratings')
    .insert([{
      game_id: gameId,
      rating: rating
    }]);
  
  if (error) {
    console.error('Error recording game rating:', error);
  }
}
