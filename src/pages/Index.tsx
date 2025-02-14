
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
  status: "enabled"
} as const;

const FRUIT_NINJA = {
  title: "Fruit Ninja VR",
  description: "Slice and dice your way through waves of fruit in this classic game reimagined for VR! Become a fruit-slicing master ninja in immersive virtual reality.",
  genre: "Action",
  release_date: "2023-12-01",
  thumbnail: "/lovable-uploads/32039c8f-e15c-4555-9a7d-5bdfd0db596f.png",
  executable_path: "steam://rungameid/923360",
  launch_code: "NINJA",
  status: "enabled"
} as const;

const ELVEN_ASSASSIN = {
  title: "Elven Assassin",
  description: "Become an elite Elven Archer and defend your castle from hordes of orcs and dragons in this action-packed VR archery game!",
  genre: "Action",
  release_date: "2023-12-01",
  thumbnail: "/lovable-uploads/f8c126a3-87f1-4ea8-b8d8-76597554d0be.png",
  executable_path: "steam://rungameid/503770",
  launch_code: "ELVEN",
  status: "enabled"
} as const;

const Index = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showRFIDCountdown, setShowRFIDCountdown] = useState(false);
  const [showOwnerDashboard, setShowOwnerDashboard] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(8);
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

  const simulateKeyboardInput = (text: string) => {
    text.split('').forEach(char => {
      const keyEvent = new KeyboardEvent('keypress', {
        key: char,
        code: `Key${char.toUpperCase()}`,
        charCode: char.charCodeAt(0),
        keyCode: char.charCodeAt(0),
        which: char.charCodeAt(0),
        bubbles: true,
      });
      document.dispatchEvent(keyEvent);
    });

    const enterEvent = new KeyboardEvent('keypress', {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
      keyCode: 13,
      which: 13,
      bubbles: true,
    });
    document.dispatchEvent(enterEvent);
  };

  const handlePlayGame = async (title: string, executablePath: string) => {
    if (!canPlayGames) {
      return;
    }

    try {
      const triggerWord = GAME_TRIGGERS[title] || 'start_game';
      console.log('Using trigger word:', triggerWord, 'for game:', title);
      
      simulateKeyboardInput(triggerWord);
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
    if (activeGame) {
      const triggerWord = activeGame ? GAME_TRIGGERS[activeGame] : 'start_game';
      const stopCommand = triggerWord.replace('start_', 'stop_');
      console.log('Using stop command:', stopCommand, 'for game:', activeGame);
      
      simulateKeyboardInput(stopCommand);
      setActiveGame(null);
    }
    setShowRFIDCountdown(false);
    setCanPlayGames(false);
  };

  useEffect(() => {
    console.log('Setting up RFID key press listener');

    const handleRFIDSimulation = () => {
      console.log('RFID simulation triggered');
      setShowRFIDCountdown(true);
      setCanPlayGames(true);
      
      const simulateStartSession = () => {
        'start_game'.split('').forEach(char => {
          const keyEvent = new KeyboardEvent('keypress', {
            key: char,
            code: `Key${char.toUpperCase()}`,
            charCode: char.charCodeAt(0),
            keyCode: char.charCodeAt(0),
            which: char.charCodeAt(0),
            bubbles: true,
          });
          document.dispatchEvent(keyEvent);
        });

        const enterEvent = new KeyboardEvent('keypress', {
          key: 'Enter',
          code: 'Enter',
          charCode: 13,
          keyCode: 13,
          which: 13,
          bubbles: true,
        });
        document.dispatchEvent(enterEvent);
      };

      simulateStartSession();
      
      toast({
        title: "RFID Card Detected",
        description: `Starting ${sessionDuration} minute session...`,
      });
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (/^\d$/.test(event.key)) {
        handleRFIDSimulation();
      }
    };

    const addInitialGames = async () => {
      try {
        // Check for All-in-One Sports
        const { data: existingSportsGame } = await supabase
          .from('games')
          .select('title')
          .eq('title', ALL_IN_ONE_SPORTS.title)
          .single();

        if (!existingSportsGame) {
          await supabase.from('games').insert([ALL_IN_ONE_SPORTS]);
          console.log('Added All-in-One Sports VR to the database');
        }

        // Check for Fruit Ninja
        const { data: existingNinjaGame } = await supabase
          .from('games')
          .select('title')
          .eq('title', FRUIT_NINJA.title)
          .single();

        if (!existingNinjaGame) {
          await supabase.from('games').insert([FRUIT_NINJA]);
          console.log('Added Fruit Ninja VR to the database');
        }

        // Check for Elven Assassin
        const { data: existingElvenGame } = await supabase
          .from('games')
          .select('title')
          .eq('title', ELVEN_ASSASSIN.title)
          .single();

        if (!existingElvenGame) {
          await supabase.from('games').insert([ELVEN_ASSASSIN]);
          console.log('Added Elven Assassin to the database');
        }

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
  }, [toast, sessionDuration]);

  const filteredGames = selectedCategory === "All" 
    ? games 
    : games.filter(game => game.genre === selectedCategory);

  return (
    <div className="min-h-screen animate-gradient-shift" style={{
      background: 'linear-gradient(225deg, #F97316 0%, #D946EF 50%, #8B5CF6 100%)',
      backgroundSize: '400% 400%'
    }}>
      {showRFIDCountdown ? (
        <RFIDCountdown 
          onExit={handleExitSession}
          duration={sessionDuration}
          activeGame={activeGame}
        />
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
          <div className="flex flex-col space-y-8">
            <div className="glass p-4 flex justify-between items-center rounded-3xl transition-all duration-300">
              <Header />
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
          onTimerDurationChange={setSessionDuration}
          onAddGame={handleAddGame}
        />
      )}
    </div>
  );
};

export default Index;
