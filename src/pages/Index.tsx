import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { RFIDCountdown } from "@/components/RFIDCountdown";
import { Header } from "@/components/Header";
import { CategoryBar } from "@/components/CategoryBar";
import { GameGrid } from "@/components/GameGrid";
import { Settings } from "lucide-react";
import { OwnerDashboard } from "@/components/OwnerDashboard";
import { GameShowcase } from "@/components/GameShowcase";
import { supabase } from "@/integrations/supabase/client";
import type { Game } from "@/types/game";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const GAME_TRIGGERS: Record<string, string> = {
  "Elven Assassin": "e",
  "Fruit Ninja VR": "f",
  "Crisis Brigade 2 Reloaded": "c",
  "All-In-One Sports VR": "v",
  "Richies Plank Experience": "p",
  "iB Cricket": "i",
  "Undead Citadel": "u",
  "Arizona Sunshine II": "a",
  "Subside": "s",
  "Propagation VR": "g",
  "Creed: Rise to Glory Championship Edition": "g",
  "Beat Saber": "w",
  "RollerCoaster Legends": "r"
};

const ROLLERCOASTER_LEGENDS = {
  title: "RollerCoaster Legends",
  description: "Experience thrilling virtual reality roller coaster rides through breathtaking environments. Feel the rush of excitement as you twist, turn, and dive through incredible landscapes in this immersive VR adventure.",
  genre: "Adventure",
  release_date: "2023-12-01",
  thumbnail: "/placeholder.svg",
  executable_path: "steam://rungameid/901520",
  launch_code: "ROLLER",
  status: "enabled" as const,
  trailer: "https://www.youtube.com/watch?v=OpnTbOz_POE"
};

const BEAT_SABER = {
  title: "Beat Saber",
  description: "Swing your sabers through the beats in the most popular VR rhythm game! Cut through blocks to your favorite music and become a legend in this immersive musical journey.",
  genre: "Rhythm",
  release_date: "2023-12-01",
  thumbnail: "/placeholder.svg",
  executable_path: "steam://rungameid/620980",
  launch_code: "BEAT",
  status: "enabled" as const,
  trailer: "https://www.youtube.com/watch?v=vL39Sg2AqWg"
};

const CREED = {
  title: "Creed: Rise to Glory Championship Edition",
  description: "Step into the ring as Adonis Creed and experience the thrill of professional boxing in VR. Train with Rocky Balboa, face challenging opponents, and rise through the ranks to become a champion in this immersive boxing experience.",
  genre: "Sports",
  release_date: "2023-12-01",
  thumbnail: "/placeholder.svg",
  executable_path: "steam://rungameid/2147530",
  launch_code: "CREED",
  status: "enabled",
  trailer: "https://www.youtube.com/watch?v=EgbCMJ54xeM"
};

const ALL_IN_ONE_SPORTS = {
  title: "All-in-One Sports VR",
  description: "Experience multiple sports in VR! Play basketball, baseball, tennis, archery and more in this fun-packed sports compilation.",
  genre: "Sports",
  release_date: "2023-12-01",
  thumbnail: "/placeholder.svg",
  executable_path: "steam://rungameid/2076590",
  launch_code: "SPORTS",
  status: "enabled",
  trailer: "https://www.youtube.com/watch?v=LNRD5qxDhHY"
};

const FRUIT_NINJA = {
  title: "Fruit Ninja VR",
  description: "Slice and dice your way through waves of fruit in this classic game reimagined for VR! Become a fruit-slicing master ninja in immersive virtual reality.",
  genre: "Action",
  release_date: "2023-12-01",
  thumbnail: "/placeholder.svg",
  executable_path: "steam://rungameid/923360",
  launch_code: "NINJA",
  status: "enabled",
  trailer: "https://www.youtube.com/watch?v=hX_ohz6pP_I"
};

const RICHIES_PLANK = {
  title: "Richies Plank Experience",
  description: "Face your fears in VR! Walk a narrow plank 80 stories high above a bustling city. A unique VR experience that puts your courage to the test.",
  genre: "Simulation",
  release_date: "2023-12-01",
  thumbnail: "/lovable-uploads/af1a36b9-7e7b-4f03-814d-ea2c073181e0.png",
  executable_path: "steam://rungameid/517160",
  launch_code: "PLANK",
  status: "enabled",
  trailer: "https://www.youtube.com/watch?v=8pFz-DqWZq0"
};

const ELVEN_ASSASSIN = {
  title: "Elven Assassin",
  description: "Become an elite Elven Archer and defend your castle from hordes of orcs and dragons in this action-packed VR archery game!",
  genre: "Action",
  release_date: "2023-12-01",
  thumbnail: "/placeholder.svg",
  executable_path: "steam://rungameid/503770",
  launch_code: "ELVEN",
  status: "enabled",
  trailer: "https://www.youtube.com/watch?v=N7nX9nZlvx4"
};

const UNDEAD_CITADEL = {
  title: "Undead Citadel",
  description: "Battle through hordes of the undead in this medieval combat VR game. Wield swords, axes, and more as you fight to survive in a dark fantasy world.",
  genre: "Action",
  release_date: "2023-12-01",
  thumbnail: "/placeholder.svg",
  executable_path: "steam://rungameid/819190",
  launch_code: "CITADEL",
  status: "enabled",
  trailer: "https://www.youtube.com/watch?v=5QI8cPCAO9Q"
};

const ARIZONA_SUNSHINE = {
  title: "Arizona Sunshine II",
  description: "Survive the zombie apocalypse in the sun-scorched desert of Arizona. Team up with your canine companion and face hordes of zombies in this thrilling VR shooter sequel.",
  genre: "FPS",
  release_date: "2023-12-01",
  thumbnail: "/placeholder.svg",
  executable_path: "steam://rungameid/2159470",
  launch_code: "ARIZONA",
  status: "enabled" as const,
  trailer: "https://www.youtube.com/watch?v=eZ65ppbWuAE"
};

const IB_CRICKET = {
  title: "iB Cricket",
  description: "Experience the thrill of cricket in VR! Play in stunning stadiums, face challenging bowlers, and perfect your batting technique in this immersive cricket simulation.",
  genre: "Sports",
  release_date: "2023-12-01",
  thumbnail: "/placeholder.svg",
  executable_path: "steam://rungameid/957950",
  launch_code: "CRICKET",
  status: "enabled",
  trailer: "https://www.youtube.com/watch?v=CqZpFWJaCvg"
};

const PROPAGATION = {
  title: "Propagation VR",
  description: "Face terrifying creatures in this intense VR horror shooter. Fight for survival in a dark and atmospheric world overrun by mysterious entities.",
  genre: "Horror",
  release_date: "2023-12-01",
  thumbnail: "/placeholder.svg",
  executable_path: "steam://rungameid/1363430",
  launch_code: "PROP",
  status: "enabled",
  trailer: "https://www.youtube.com/watch?v=WWKqTyUobSQ"
};

const SUBSIDE = {
  title: "Subside",
  description: "Dive into an underwater survival adventure in VR. Explore mysterious depths, solve puzzles, and uncover the secrets of the deep.",
  genre: "Adventure",
  release_date: "2023-12-01",
  thumbnail: "/placeholder.svg",
  executable_path: "steam://rungameid/1908810",
  launch_code: "SUBSIDE",
  status: "enabled",
  trailer: "https://www.youtube.com/watch?v=8mJj4M_ZuBc"
};

const CRISIS_BRIGADE = {
  title: "Crisis Brigade 2 Reloaded",
  description: "Join the elite tactical unit in this action-packed VR shooter. Take on dangerous missions and eliminate threats in intense combat scenarios.",
  genre: "FPS",
  release_date: "2023-12-01",
  thumbnail: "/placeholder.svg",
  executable_path: "steam://rungameid/1900720",
  launch_code: "CRISIS",
  status: "enabled",
  trailer: "https://www.youtube.com/watch?v=7iiMxGrcHXU"
};

const Index = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showRFIDCountdown, setShowRFIDCountdown] = useState(false);
  const [showOwnerDashboard, setShowOwnerDashboard] = useState(false);
  const [canPlayGames, setCanPlayGames] = useState(false);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rfidStage, setRfidStage] = useState<'initial' | 'authenticated' | 'game-selected'>('initial');
  const [selectedGameForLaunch, setSelectedGameForLaunch] = useState<Game | null>(null);
  const { toast } = useToast();
  const categories = ["All", "Action", "FPS", "Horror", "Sports", "Simulation", "Adventure", "Rhythm"];
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    setIsLoading(true);
    console.log('Starting game fetch from Supabase...');
    
    try {
      const { data: testData, error: testError } = await supabase
        .from('games')
        .select('count');
      
      if (testError) {
        console.error('Supabase connection test failed:', testError);
        throw new Error(`Connection test failed: ${testError.message}`);
      }
      
      console.log('Supabase connection test successful, fetching games...');
      
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('title');
      
      if (error) {
        console.error('Supabase fetch error:', error);
        throw new Error(`Data fetch failed: ${error.message}`);
      }
      
      console.log('Games data received:', data);
      
      if (data && data.length > 0) {
        console.log(`Successfully fetched ${data.length} games`);
        
        const typedGames = data.map(game => ({
          ...game,
          id: game.id || crypto.randomUUID(),
          status: game.status || "enabled",
          thumbnail: game.thumbnail || "/placeholder.svg"
        })) as Game[];
        
        setGames(typedGames);
        console.log('Games state updated with:', typedGames);
      } else {
        console.log('No games found in database, adding default games');
        await addDefaultGames();
      }
    } catch (error) {
      console.error('Error fetching games:', error);
      toast({
        variant: "destructive",
        title: "Database Connection Error",
        description: "Failed to connect to the database. Adding default games instead."
      });
      
      await addDefaultGames();
    } finally {
      setIsLoading(false);
    }
  };
  
  const addDefaultGames = async () => {
    try {
      const defaultGames = [ALL_IN_ONE_SPORTS, FRUIT_NINJA, RICHIES_PLANK, ELVEN_ASSASSIN, 
        UNDEAD_CITADEL, ARIZONA_SUNSHINE, IB_CRICKET, PROPAGATION, SUBSIDE, 
        CRISIS_BRIGADE, CREED, BEAT_SABER, ROLLERCOASTER_LEGENDS] as Game[];
      
      console.log(`Adding ${defaultGames.length} default games to database`);
      
      for (const game of defaultGames) {
        const { error } = await supabase
          .from('games')
          .insert({
            title: game.title,
            description: game.description,
            genre: game.genre,
            release_date: game.release_date,
            thumbnail: game.thumbnail || "/placeholder.svg",
            executable_path: game.executable_path,
            trailer: game.trailer,
            launch_code: game.launch_code,
            status: "enabled"
          });
        
        if (error) {
          console.error(`Error adding default game ${game.title}:`, error);
        } else {
          console.log(`Successfully added default game: ${game.title}`);
        }
      }
      
      setGames(defaultGames);
      toast({
        title: "Using Default Games",
        description: "Added default games to your library"
      });
    } catch (error) {
      console.error('Error adding default games:', error);
      const defaultGames = [ALL_IN_ONE_SPORTS, FRUIT_NINJA, RICHIES_PLANK, ELVEN_ASSASSIN, 
        UNDEAD_CITADEL, ARIZONA_SUNSHINE, IB_CRICKET, PROPAGATION, SUBSIDE, 
        CRISIS_BRIGADE, CREED, BEAT_SABER, ROLLERCOASTER_LEGENDS] as Game[];
      
      setGames(defaultGames);
    }
  };

  const handleAddGame = async (newGame: Omit<Game, "id" | "status" | "created_at" | "updated_at">) => {
    try {
      const {
        data,
        error
      } = await supabase.from('games').insert([{
        ...newGame,
        status: 'enabled' as const
      }]).select();
      if (error) throw error;
      if (data && data[0]) {
        setGames(prevGames => [data[0] as Game, ...prevGames]);
        toast({
          title: "Game Added",
          description: "The game has been added to your library"
        });
      }
    } catch (error) {
      console.error('Error adding game:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add game"
      });
    }
  };

  const handlePlayGame = async (title: string, executablePath: string) => {
    if (!canPlayGames) {
      setShowRFIDCountdown(true);
      return;
    }

    try {
      const gameToLaunch = games.find(game => game.title === title);
      
      if (gameToLaunch) {
        setSelectedGameForLaunch(gameToLaunch);
        setRfidStage('game-selected');
        setActiveGame(title);
        
        const launchKey = GAME_TRIGGERS[title];
        
        if (launchKey) {
          console.log(`Launching game with key: ${launchKey} for game: ${title}`);
          
          try {
            const res = await fetch(`${API_URL}/keypress`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ key: launchKey }),
            });
            
            if (res.ok) {
              toast({
                title: "Game Launched",
                description: `Successfully launched ${title}`,
              });
            } else {
              toast({
                title: "Game Launch Failed",
                description: `Error: ${res.status} ${res.statusText}`,
                variant: "destructive",
              });
            }
          } catch (error) {
            console.error('Error sending key to Python server:', error);
            toast({
              title: "Game Launch Failed",
              description: `Could not connect to the server at ${API_URL}`,
              variant: "destructive",
            });
          }
        } else {
          console.log(`No launch key mapping found for game: ${title}`);
          console.log('Game started:', title, 'Path:', executablePath);
        }
      }
    } catch (error) {
      console.error('Error starting game:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start game"
      });
    }
  };

  const handleExitSession = async () => {
    try {
      const res = await fetch(`${API_URL}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (res.ok) {
        toast({
          title: "Games Closed",
          description: "Successfully closed all games",
        });
      } else {
        toast({
          title: "Close Command Failed",
          description: `Error: ${res.status} ${res.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending close command to Python server:', error);
    }
    
    setActiveGame(null);
    setShowRFIDCountdown(false);
    setCanPlayGames(false);
    setRfidStage('initial');
    setSelectedGameForLaunch(null);
  };

  useEffect(() => {
    console.log('Setting up RFID key press listener');
    const handleRFIDSimulation = () => {
      console.log('RFID simulation triggered');
      setShowRFIDCountdown(true);
      setCanPlayGames(true);
      setRfidStage('authenticated');
      toast({
        title: "RFID Card Detected",
        description: "Starting session..."
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
  }, [toast]);

  const filteredGames = selectedCategory === "All" ? games : games.filter(game => game.genre === selectedCategory);
  console.log('Filtered games:', filteredGames);
  console.log('Selected category:', selectedCategory);

  return (
    <div className="min-h-screen animate-gradient" style={{
      background: 'linear-gradient(225deg, #F97316 0%, #D946EF 50%, #8B5CF6 100%)',
      backgroundSize: '400% 400%'
    }}>
      {showRFIDCountdown ? (
        <RFIDCountdown 
          onExit={handleExitSession} 
          activeGame={activeGame} 
          cppLauncherMode={true}
          cppLauncherKey={selectedGameForLaunch ? GAME_TRIGGERS[selectedGameForLaunch.title] : undefined}
        />
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
          <div className="flex flex-col space-y-8">
            <div className="glass p-4 flex justify-between items-center rounded-3xl transition-all duration-300">
              <Header />
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-white border-r-transparent"></div>
                <p className="mt-2 text-white">Loading games...</p>
              </div>
            ) : (
              <>
                <div className="transform hover:scale-[1.02] transition-transform duration-300">
                  <GameShowcase games={games.slice(0, 3)} onPlayGame={handlePlayGame} canPlayGames={true} />
                </div>

                <div className="glass p-8 rounded-3xl space-y-6 backdrop-blur-xl border border-white/20 shadow-xl">
                  <h2 className="text-2xl font-bold text-white next-gen-title">VR Games</h2>
                  <CategoryBar categories={categories} selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} />
                  <GameGrid games={filteredGames} onPlayGame={handlePlayGame} canPlayGames={true} />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showOwnerDashboard && <OwnerDashboard onClose={() => setShowOwnerDashboard(false)} onAddGame={handleAddGame} />}
    </div>
  );
};

export default Index;
