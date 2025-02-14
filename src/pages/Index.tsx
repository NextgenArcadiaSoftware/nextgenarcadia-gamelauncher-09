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

const MOCK_GAMES: Omit<Game, "id" | "created_at" | "updated_at">[] = [
  {
    title: "Street Fighter VI",
    description: "The legendary fighting game series returns with its sixth mainline entry! Choose from 18 diverse fighters and battle in stunning arenas worldwide.",
    genre: "Action",
    release_date: "2023-06-02",
    thumbnail: "/lovable-uploads/82c15066-5851-4a30-a1f4-c8fc42e685bd.png",
    trailer: "https://www.youtube.com/watch?v=9nB1nfwmiLQ",
    executable_path: "C:\\Games\\StreetFighter6\\SF6.exe",
    status: "enabled"
  },
  {
    title: "Mortal Kombat 1",
    description: "Experience the all-new Mortal Kombat Universe created by the Fire God Liu Kang. A reborn Mortal Kombat with reimagined versions of iconic characters.",
    genre: "Action",
    release_date: "2023-09-19",
    thumbnail: "/lovable-uploads/09374846-fe58-4998-868a-5691a68042c5.png",
    trailer: "https://www.youtube.com/watch?v=jnVTPkCWzcI",
    executable_path: "C:\\Games\\MK1\\MK1.exe",
    status: "enabled"
  },
  {
    title: "Beat Saber",
    description: "An immersive rhythm game where you slash the beats of adrenaline-pumping music as they fly towards you, surrounded by a futuristic world.",
    genre: "Rhythm",
    release_date: "2019-05-21",
    thumbnail: "/lovable-uploads/cac2759b-8463-4e08-b1ea-aeb608ac84a9.png",
    trailer: "https://www.youtube.com/watch?v=vL39Sg2AqWg",
    executable_path: "C:\\Games\\BeatSaber\\Beat Saber.exe",
    status: "enabled"
  },
  {
    title: "DOOM Eternal",
    description: "Rip and tear through hell's armies in this fast-paced first person shooter. Become the Slayer and stop the demonic invasion.",
    genre: "FPS",
    release_date: "2020-03-20",
    thumbnail: "/lovable-uploads/2f7ba916-4fc9-4136-b3cc-9f1e2ba0be94.png",
    trailer: "https://www.youtube.com/watch?v=FkklG9MA0vM",
    executable_path: "C:\\Games\\DOOMEternal\\DOOMEternalx64vk.exe",
    status: "enabled"
  },
  {
    title: "Resident Evil Village",
    description: "Experience survival horror like never before in the 8th major installment in the Resident Evil franchise. Fight for survival in a mysterious village.",
    genre: "Horror",
    release_date: "2021-05-07",
    thumbnail: "/lovable-uploads/cf7a9406-76de-470d-971d-ebb18c291622.png",
    trailer: "https://www.youtube.com/watch?v=tjfTxFzGh3Q",
    executable_path: "C:\\Games\\RE8\\re8.exe",
    status: "enabled"
  },
  {
    title: "Lethal Company",
    description: "A co-op horror survival game where you explore abandoned moons to collect scrap and valuable resources. Work together to survive the horrors that await.",
    genre: "Survival",
    release_date: "2023-10-23",
    thumbnail: "/lovable-uploads/d38b1a33-5653-43f5-802b-51546fe7fefb.png",
    trailer: "https://www.youtube.com/watch?v=mpzeBbn-olY",
    executable_path: "C:\\Games\\LethalCompany\\Lethal Company.exe",
    status: "enabled"
  }
];

const Index = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showRFIDCountdown, setShowRFIDCountdown] = useState(false);
  const [showOwnerDashboard, setShowOwnerDashboard] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(8);
  const [canPlayGames, setCanPlayGames] = useState(false);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const { toast } = useToast();

  const categories = ["All", "Action", "FPS", "Horror", "Rhythm", "Survival"];

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

      if (!data || data.length === 0) {
        const { data: insertedData, error: insertError } = await supabase
          .from('games')
          .insert(MOCK_GAMES)
          .select();

        if (insertError) throw insertError;
        
        setGames(insertedData as Game[]);
      } else {
        setGames(data as Game[]);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch games",
      });
      setGames(MOCK_GAMES.map((game, index) => ({
        ...game,
        id: `mock-${index}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })));
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
      return; // The GameCard component now handles showing the tap card screen
    }

    try {
      const simulateStartGame = () => {
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

      simulateStartGame();
      setActiveGame(title);
      console.log('Game started:', title, 'Path:', executablePath);
    } catch (error) {
      console.error('Launch error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to launch game. Please make sure the game launcher is running.",
      });
    }
  };

  const handleExitSession = () => {
    if (activeGame) {
      const simulateStopGame = () => {
        'stop_game'.split('').forEach(char => {
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

      simulateStopGame();
      setActiveGame(null);
    }
    setShowRFIDCountdown(false);
    setCanPlayGames(false);
  };

  const filteredGames = selectedCategory === "All" 
    ? games 
    : games.filter(game => game.genre === selectedCategory);

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

    window.addEventListener('keypress', handleKeyPress);

    return () => {
      console.log('Removing RFID key press listener');
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [toast, sessionDuration]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F97316] via-[#D946EF] to-[#8B5CF6] animate-gradient-shift">
      {showRFIDCountdown ? (
        <RFIDCountdown 
          onExit={handleExitSession}
          duration={sessionDuration}
          activeGame={activeGame}
        />
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
          <div className="flex flex-col space-y-8">
            <div className="glass p-6 rounded-3xl flex justify-between items-center backdrop-blur-xl border border-white/20 shadow-xl">
              <Header />
              <Button
                variant="outline"
                className="glass border-0 hover:bg-white/20 flex gap-2 transition-all duration-300 hover:scale-105"
                onClick={() => setShowOwnerDashboard(true)}
              >
                <Settings className="w-4 h-4" />
                Owner Dashboard
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
              <h2 className="text-2xl font-bold text-white next-gen-title">Top Arcade Games</h2>
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
