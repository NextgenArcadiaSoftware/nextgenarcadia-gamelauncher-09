import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { RFIDCountdown } from "@/components/RFIDCountdown";
import { Header } from "@/components/Header";
import { CategoryBar } from "@/components/CategoryBar";
import { GameGrid } from "@/components/GameGrid";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { OwnerDashboard } from "@/components/OwnerDashboard";
import { GameShowcase } from "@/components/GameShowcase";
import { supabase } from "@/integrations/supabase/client";
import type { Game } from "@/types/game";

const GAME_TRIGGERS: Record<string, string> = {
  "Elven Assassin": "start_elven",
  "Fruit Ninja VR": "start_ninja",
  "Crisis Brigade 2 Reloaded": "start_crisis",
  "All-In-One Sports VR": "start_sports",
  "Richies Plank Experience": "start_plank",
  "iB Cricket": "start_cricket",
  "Undead Citadel": "start_citadel",
  "Arizona Sunshine": "start_arizona",
  "Subside": "start_subside",
  "Propagation VR": "start_prop"
};

const ALL_IN_ONE_SPORTS = {
  title: "All-in-One Sports VR",
  description: "Experience multiple sports in VR! Play basketball, baseball, tennis, archery and more in this fun-packed sports compilation.",
  genre: "Sports",
  release_date: "2023-12-01",
  thumbnail: "/lovable-uploads/9b088570-531a-47cf-b176-28bb534ba66f.png",
  executable_path: "steam://rungameid/2076590",
  launch_code: "SPORTS",
  status: "enabled",
  trailer: "https://www.youtube.com/watch?v=PZ63kQzGnmY"
} as const;

const FRUIT_NINJA = {
  title: "Fruit Ninja VR",
  description: "Slice and dice your way through waves of fruit in this classic game reimagined for VR! Become a fruit-slicing master ninja in immersive virtual reality.",
  genre: "Action",
  release_date: "2023-12-01",
  thumbnail: "/lovable-uploads/32039c8f-e15c-4555-9a7d-5bdfd0db596f.png",
  executable_path: "steam://rungameid/923360",
  launch_code: "NINJA",
  status: "enabled",
  trailer: "https://www.youtube.com/watch?v=UvCz24ZvY2M"
} as const;

const RICHIES_PLANK = {
  title: "Richies Plank Experience",
  description: "Face your fears in VR! Walk a narrow plank 80 stories high above a bustling city. A unique VR experience that puts your courage to the test.",
  genre: "Simulation",
  release_date: "2023-12-01",
  thumbnail: "/lovable-uploads/bb8b5b5b-bf33-4e0c-b9af-a05408636bce.png",
  executable_path: "steam://rungameid/517160",
  launch_code: "PLANK",
  status: "enabled",
  trailer: "https://www.youtube.com/watch?v=KB2GlRn-TrY"
} as const;

const ELVEN_ASSASSIN = {
  title: "Elven Assassin",
  description: "Become an elite Elven Archer and defend your castle from hordes of orcs and dragons in this action-packed VR archery game!",
  genre: "Action",
  release_date: "2023-12-01",
  thumbnail: "/lovable-uploads/c7421927-0f62-420f-87a6-2d35d6600141.png",
  executable_path: "steam://rungameid/503770",
  launch_code: "ELVEN",
  status: "enabled",
  trailer: "https://www.youtube.com/watch?v=d1RnYfFZK2k"
} as const;

const UNDEAD_CITADEL = {
  title: "Undead Citadel",
  description: "Battle through hordes of the undead in this medieval combat VR game. Wield swords, axes, and more as you fight to survive in a dark fantasy world.",
  genre: "Action",
  release_date: "2023-12-01",
  thumbnail: "/lovable-uploads/22b9e9da-62e9-4f60-8f96-5f13916991f6.png",
  executable_path: "steam://rungameid/819190",
  launch_code: "CITADEL",
  status: "enabled",
  trailer: "https://www.youtube.com/watch?v=V0kOqPM6h1Y"
} as const;

const ARIZONA_SUNSHINE = {
  title: "Arizona Sunshine II",
  description: "Survive the zombie apocalypse in the sun-scorched desert of Arizona. Team up with your canine companion and face hordes of zombies in this thrilling VR shooter sequel.",
  genre: "FPS",
  release_date: "2023-12-01",
  thumbnail: "/lovable-uploads/4e2b1ea9-0729-4f84-b8c4-974e08cd8c30.png",
  executable_path: "steam://rungameid/2159470",
  launch_code: "ARIZONA",
  status: "enabled",
  trailer: "https://www.youtube.com/watch?v=VUuKNtUwpYQ"
} as const;

const IB_CRICKET = {
  title: "iB Cricket",
  description: "Experience the thrill of cricket in VR! Play in stunning stadiums, face challenging bowlers, and perfect your batting technique in this immersive cricket simulation.",
  genre: "Sports",
  release_date: "2023-12-01",
  thumbnail: "/lovable-uploads/be53debf-e66a-4b71-8445-6a4694a2d95e.png",
  executable_path: "steam://rungameid/957950",
  launch_code: "CRICKET",
  status: "enabled",
  trailer: "https://www.youtube.com/watch?v=CqZpFWJaCvg"
} as const;

const PROPAGATION = {
  title: "Propagation VR",
  description: "Face terrifying creatures in this intense VR horror shooter. Fight for survival in a dark and atmospheric world overrun by mysterious entities.",
  genre: "Horror",
  release_date: "2023-12-01",
  thumbnail: "/lovable-uploads/55ebaec7-e228-4b04-a2a3-c033d76bca1c.png",
  executable_path: "steam://rungameid/1363430",
  launch_code: "PROP",
  status: "enabled",
  trailer: "https://www.youtube.com/watch?v=WWKqTyUobSQ"
} as const;

const SUBSIDE = {
  title: "Subside",
  description: "Dive into an underwater survival adventure in VR. Explore mysterious depths, solve puzzles, and uncover the secrets of the deep.",
  genre: "Adventure",
  release_date: "2023-12-01",
  thumbnail: "/lovable-uploads/1f22119b-c9b1-4260-8503-8bc42fdef5b8.png",
  executable_path: "steam://rungameid/1908810",
  launch_code: "SUBSIDE",
  status: "enabled",
  trailer: "https://www.youtube.com/watch?v=JGjqt8TCxQU"
} as const;

const CRISIS_BRIGADE = {
  title: "Crisis Brigade 2 Reloaded",
  description: "Join the elite tactical unit in this action-packed VR shooter. Take on dangerous missions and eliminate threats in intense combat scenarios.",
  genre: "FPS",
  release_date: "2023-12-01",
  thumbnail: "/lovable-uploads/0c397672-8051-4e6f-bb5b-36548c8d7381.png",
  executable_path: "steam://rungameid/1900720",
  launch_code: "CRISIS",
  status: "enabled",
  trailer: "https://www.youtube.com/watch?v=7eMTJmXrQjg"
} as const;

const Index = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showRFIDCountdown, setShowRFIDCountdown] = useState(false);
  const [showOwnerDashboard, setShowOwnerDashboard] = useState(false);
  const [canPlayGames, setCanPlayGames] = useState(false);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const { toast } = useToast();

  const categories = ["All", "Action", "FPS", "Horror", "Sports", "Simulation"];

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setGames(data as Game[]);
      } else {
        console.error('No games found in the database');
        toast({
          variant: "destructive",
          title: "Error",
          description: "No games found in the database",
        });
        setGames([]);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch games",
      });
      setGames([]);
    }
  };

  const handleAddGame = async (newGame: Omit<Game, "id" | "status" | "created_at" | "updated_at">) => {
    try {
      const { data, error } = await supabase
        .from('games')
        .insert([{ ...newGame, status: 'enabled' as const }])
        .select()
        .single();

      if (error) throw error;

      setGames(prevGames => [data as Game, ...prevGames]);
      toast({
        title: "Game Added",
        description: "The game has been added to your library",
      });
    } catch (error) {
      console.error('Error adding game:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add game",
      });
    }
  };

  const handlePlayGame = async (title: string, executablePath: string) => {
    if (!canPlayGames) {
      return;
    }

    try {
      setActiveGame(title);
      console.log('Game started:', title, 'Path:', executablePath);
    } catch (error) {
      console.error('Error starting game:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start game",
      });
    }
  };

  const handleExitSession = () => {
    setActiveGame(null);
    setShowRFIDCountdown(false);
    setCanPlayGames(false);
  };

  useEffect(() => {
    console.log('Setting up RFID key press listener');

    const handleRFIDSimulation = () => {
      console.log('RFID simulation triggered');
      setShowRFIDCountdown(true);
      setCanPlayGames(true);
      
      toast({
        title: "RFID Card Detected",
        description: "Starting session...",
      });
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (/^\d$/.test(event.key)) {
        handleRFIDSimulation();
      }
      
      if (event.key.toLowerCase() === 'f' && window.electron) {
        console.log('F key pressed, sending to Python backend');
        window.electron.ipcRenderer.send('simulate-keypress', 'f');
      }
    };

    const addInitialGames = async () => {
      try {
        await supabase
          .from('games')
          .delete()
          .eq('title', FRUIT_NINJA.title);

        await supabase
          .from('games')
          .delete()
          .eq('title', RICHIES_PLANK.title);

        await supabase
          .from('games')
          .delete()
          .eq('title', ELVEN_ASSASSIN.title);

        await supabase
          .from('games')
          .delete()
          .eq('title', UNDEAD_CITADEL.title);

        await supabase
          .from('games')
          .delete()
          .eq('title', ARIZONA_SUNSHINE.title);

        await supabase
          .from('games')
          .delete()
          .eq('title', IB_CRICKET.title);

        await supabase
          .from('games')
          .delete()
          .eq('title', PROPAGATION.title);

        await supabase
          .from('games')
          .delete()
          .eq('title', SUBSIDE.title);

        await supabase
          .from('games')
          .delete()
          .eq('title', CRISIS_BRIGADE.title);

        const { data: existingSportsGame } = await supabase
          .from('games')
          .select('title')
          .eq('title', ALL_IN_ONE_SPORTS.title)
          .single();

        if (!existingSportsGame) {
          await supabase.from('games').insert([ALL_IN_ONE_SPORTS]);
          console.log('Added All-in-One Sports VR to the database');
        }

        await supabase.from('games').insert([FRUIT_NINJA]);
        console.log('Added/Updated Fruit Ninja VR to the database');

        await supabase.from('games').insert([RICHIES_PLANK]);
        console.log('Added/Updated Richies Plank Experience to the database');

        await supabase.from('games').insert([ELVEN_ASSASSIN]);
        console.log('Added/Updated Elven Assassin to the database');

        await supabase.from('games').insert([UNDEAD_CITADEL]);
        console.log('Added/Updated Undead Citadel to the database');

        await supabase.from('games').insert([ARIZONA_SUNSHINE]);
        console.log('Added/Updated Arizona Sunshine II to the database');

        await supabase.from('games').insert([IB_CRICKET]);
        console.log('Added/Updated iB Cricket to the database');

        await supabase.from('games').insert([PROPAGATION]);
        console.log('Added/Updated Propagation VR to the database');

        await supabase.from('games').insert([SUBSIDE]);
        console.log('Added/Updated Subside to the database');

        await supabase.from('games').insert([CRISIS_BRIGADE]);
        console.log('Added/Updated Crisis Brigade 2 Reloaded to the database');

        fetchGames(); // Refresh the games list
      } catch (error) {
        console.error('Error adding initial games:', error);
      }
    };

    addInitialGames();

    window.addEventListener('keypress', handleKeyPress);

    return () => {
      console.log('Removing RFID key press listener');
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [toast]);

  const filteredGames = selectedCategory === "All" 
    ? games 
    : games.filter(game => game.genre === selectedCategory);

  return (
    <div className="min-h-screen animate-gradient" style={{
      background: 'linear-gradient(225deg, #F97316 0%, #D946EF 50%, #8B5CF6 100%)',
      backgroundSize: '400% 400%'
    }}>
      {showRFIDCountdown ? (
        <RFIDCountdown 
          onExit={handleExitSession}
          activeGame={activeGame}
        />
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
          <div className="flex flex-col space-y-8">
            <div className="glass p-4 flex justify-between items-center rounded-3xl transition-all duration-300">
              <Header />
              <Button
                variant="ghost"
                className="text-white hover:text-white/80"
                onClick={() => setShowOwnerDashboard(true)}
              >
                <Settings className="w-6 h-6" />
              </Button>
            </div>

            <div className="transform hover:scale-[1.02] transition-transform duration-300">
              <GameShowcase 
                games={games.slice(0, 3)} 
                onPlayGame={handlePlayGame}
                canPlayGames={canPlayGames}
              />
            </div>

            <div className="glass p-8 rounded-3xl space-y-6 backdrop-blur-xl border border-white/20 shadow-xl">
              <h2 className="text-2xl font-bold text-white next-gen-title">VR Games</h2>
              <CategoryBar 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
              />
              <GameGrid 
                games={filteredGames}
                onPlayGame={handlePlayGame}
                canPlayGames={canPlayGames}
              />
            </div>
          </div>
        </div>
      )}

      {showOwnerDashboard && (
        <OwnerDashboard
          onClose={() => setShowOwnerDashboard(false)}
          onAddGame={handleAddGame}
        />
      )}
    </div>
  );
};

export default Index;
