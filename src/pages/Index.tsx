
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { RFIDCountdown } from "@/components/RFIDCountdown";
import { Header } from "@/components/Header";
import { CategoryBar } from "@/components/CategoryBar";
import { GameGrid } from "@/components/GameGrid";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { OwnerDashboard } from "@/components/OwnerDashboard";

interface Game {
  id: number;
  title: string;
  description: string;
  genre: string;
  releaseDate: string;
  thumbnail: string;
  trailer?: string;
  executablePath?: string;
  enabled?: boolean;
}

const Index = () => {
  const [games, setGames] = useState<Game[]>([
    {
      id: 1,
      title: "Beat Saber",
      description: "The ultimate VR rhythm game with lightsabers",
      genre: "Rhythm",
      releaseDate: "2024",
      thumbnail: "/lovable-uploads/09374846-fe58-4998-868a-5691a68042c5.png",
      trailer: "https://www.youtube.com/watch?v=vL39Sg2AqWg",
      enabled: true,
    },
    {
      id: 2,
      title: "Pavlov VR",
      description: "Multiplayer shooter with realistic combat",
      genre: "FPS",
      releaseDate: "2024",
      thumbnail: "/lovable-uploads/a6a527be-670f-4238-9b4e-4cd389187b90.png",
      trailer: "https://www.youtube.com/watch?v=wBzw9ZJ5r9A",
      enabled: true,
    },
    {
      id: 3,
      title: "Ghosts of Tabor",
      description: "Tactical survival in a post-apocalyptic world",
      genre: "Survival",
      releaseDate: "2024",
      thumbnail: "/lovable-uploads/2f7ba916-4fc9-4136-b3cc-9f1e2ba0be94.png",
      trailer: "https://www.youtube.com/watch?v=3vZG5oH8M0Y",
      enabled: true,
    },
    {
      id: 4,
      title: "Hard Bullet",
      description: "Action-packed VR combat simulator",
      genre: "Action",
      releaseDate: "2024",
      thumbnail: "/lovable-uploads/cac2759b-8463-4e08-b1ea-aeb608ac84a9.png",
      trailer: "https://www.youtube.com/watch?v=K2NxwJZb0i0",
      enabled: true,
    },
    {
      id: 5,
      title: "Arizona Sunshine",
      description: "Zombie apocalypse survival in VR",
      genre: "Horror",
      releaseDate: "2024",
      thumbnail: "/lovable-uploads/cf7a9406-76de-470d-971d-ebb18c291622.png",
      trailer: "https://www.youtube.com/watch?v=l_gWDl_f6V8",
      enabled: true,
    },
    {
      id: 6,
      title: "Blade & Sorcery",
      description: "Medieval fantasy combat simulator",
      genre: "Action",
      releaseDate: "2024",
      thumbnail: "/lovable-uploads/d38b1a33-5653-43f5-802b-51546fe7fefb.png",
      trailer: "https://www.youtube.com/watch?v=BNxFA0qmOqY",
      enabled: true,
    }
  ]);

  const [activeGame, setActiveGame] = useState<{
    title: string;
    timeLeft: number;
  } | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showRFIDCountdown, setShowRFIDCountdown] = useState(false);
  const [showOwnerDashboard, setShowOwnerDashboard] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(8);
  const { toast } = useToast();

  const categories = ["All", "Action", "FPS", "Horror", "Rhythm", "Survival"];

  // Filter enabled games first, then apply category filter
  const filteredGames = games
    .filter(game => game.enabled)
    .filter(game => selectedCategory === "All" || game.genre === selectedCategory);

  const handleAddGame = (newGame: Omit<Game, "id">) => {
    setGames([...games, { ...newGame, id: games.length + 1, enabled: true }]);
  };

  const handlePlayGame = (title: string, duration: number) => {
    setActiveGame({ title, timeLeft: duration * 60 });
  };

  // RFID detection simulation with improved logging and session tracking
  useEffect(() => {
    console.log('Setting up RFID key press listener');

    const handleRFIDSimulation = () => {
      console.log('RFID simulation triggered');
      setShowRFIDCountdown(true);
      
      // Record the session
      const newSession = {
        startTime: new Date().toISOString(),
        duration: sessionDuration
      };
      
      const savedSessions = localStorage.getItem("rfid_sessions");
      const sessions = savedSessions ? JSON.parse(savedSessions) : [];
      sessions.push(newSession);
      localStorage.setItem("rfid_sessions", JSON.stringify(sessions));

      toast({
        title: "RFID Card Detected",
        description: `Starting ${sessionDuration} minute session...`,
      });
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      console.log('Key pressed:', event.key);
      if (event.key.toLowerCase() === 'r') {
        console.log('R key detected, triggering RFID simulation');
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
    <div className="min-h-screen">
      {showRFIDCountdown ? (
        <RFIDCountdown 
          onExit={() => setShowRFIDCountdown(false)}
          duration={sessionDuration}
        />
      ) : (
        <div className="max-w-7xl mx-auto p-8">
          <div className="flex flex-col space-y-8">
            <div className="flex justify-between items-center">
              <Header />
              <Button
                variant="outline"
                className="flex gap-2"
                onClick={() => setShowOwnerDashboard(true)}
              >
                <Settings className="w-4 h-4" />
                Owner Dashboard
              </Button>
            </div>
            <CategoryBar 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
            <GameGrid 
              games={filteredGames}
              onPlayGame={handlePlayGame}
            />
          </div>
        </div>
      )}

      {showOwnerDashboard && (
        <OwnerDashboard
          onClose={() => setShowOwnerDashboard(false)}
          onTimerDurationChange={setSessionDuration}
        />
      )}

      {activeGame && (
        <div className="countdown-overlay">
          <h2 className="text-6xl font-bold mb-4">{activeGame.title}</h2>
          <div className="text-8xl font-mono mb-8">
            {Math.floor(activeGame.timeLeft / 60)}:
            {(activeGame.timeLeft % 60).toString().padStart(2, "0")}
          </div>
          <div className="flex gap-4">
            <Button
              size="lg"
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              onClick={() => setActiveGame(null)}
            >
              Exit Game
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="bg-gray-800 hover:bg-gray-700"
              onClick={() => setActiveGame(null)}
            >
              Back to Menu
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
