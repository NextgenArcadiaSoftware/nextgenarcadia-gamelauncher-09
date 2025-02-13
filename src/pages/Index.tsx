
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
}

const Index = () => {
  const [games, setGames] = useState<Game[]>([
    {
      id: 1,
      title: "Undead Citadel Demo",
      description: "Medieval action combat with hordes of undead",
      genre: "Action",
      releaseDate: "2024",
      thumbnail: "/lovable-uploads/09374846-fe58-4998-868a-5691a68042c5.png",
      executablePath: "C:\\Users\\User\\Desktop\\Undead Citadel Demo.url",
    },
    {
      id: 2,
      title: "Pavlov VR",
      description: "Multiplayer shooter with realistic combat",
      genre: "FPS",
      releaseDate: "2024",
      thumbnail: "/lovable-uploads/a6a527be-670f-4238-9b4e-4cd389187b90.png",
      trailer: "https://www.youtube.com/watch?v=wBzw9ZJ5r9A",
      executablePath: "C:\\Program Files (x86)\\Steam\\steamapps\\common\\All-In-One Sports VR\\AllInOneSports.exe",
    },
    {
      id: 3,
      title: "Ghosts of Tabor",
      description: "Tactical survival in a post-apocalyptic world",
      genre: "Survival",
      releaseDate: "2024",
      thumbnail: "/lovable-uploads/2f7ba916-4fc9-4136-b3cc-9f1e2ba0be94.png",
      trailer: "https://www.youtube.com/watch?v=3vZG5oH8M0Y",
      executablePath: "C:\\Program Files\\Steam\\steamapps\\common\\Ghosts of Tabor\\GhostsOfTabor.exe",
    },
    {
      id: 4,
      title: "Hard Bullet",
      description: "Action-packed VR combat simulator",
      genre: "Action",
      releaseDate: "2024",
      thumbnail: "/lovable-uploads/cac2759b-8463-4e08-b1ea-aeb608ac84a9.png",
      trailer: "https://www.youtube.com/watch?v=K2NxwJZb0i0",
      executablePath: "C:\\Program Files\\Steam\\steamapps\\common\\Hard Bullet\\Hard Bullet.exe",
    },
    {
      id: 5,
      title: "Arizona Sunshine",
      description: "Zombie apocalypse survival in VR",
      genre: "Horror",
      releaseDate: "2024",
      thumbnail: "/lovable-uploads/cf7a9406-76de-470d-971d-ebb18c291622.png",
      trailer: "https://www.youtube.com/watch?v=l_gWDl_f6V8",
      executablePath: "C:\\Program Files\\Steam\\steamapps\\common\\Arizona Sunshine\\ArizonaSunshine.exe",
    },
    {
      id: 6,
      title: "Blade & Sorcery",
      description: "Medieval fantasy combat simulator",
      genre: "Action",
      releaseDate: "2024",
      thumbnail: "/lovable-uploads/d38b1a33-5653-43f5-802b-51546fe7fefb.png",
      trailer: "https://www.youtube.com/watch?v=BNxFA0qmOqY",
      executablePath: "C:\\Program Files\\Steam\\steamapps\\common\\Blade & Sorcery\\BladeAndSorcery.exe",
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
  const [canPlayGames, setCanPlayGames] = useState(false);
  const { toast } = useToast();

  const categories = ["All", "Action", "FPS", "Horror", "Rhythm", "Survival"];

  const filteredGames = selectedCategory === "All" 
    ? games 
    : games.filter(game => game.genre === selectedCategory);

  const handleAddGame = (newGame: Omit<Game, "id">) => {
    setGames([...games, { ...newGame, id: games.length + 1 }]);
  };

  const handlePlayGame = async (title: string, executablePath: string) => {
    if (!canPlayGames) {
      toast({
        variant: "destructive",
        title: "Session Required",
        description: "Please scan an RFID card to start a gaming session.",
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/launch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: executablePath })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Game Started",
        description: `${title} has been launched`,
      });
    } catch (error) {
      console.error('Launch error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to launch game. Please make sure the game launcher is running.",
      });
    }
  };

  // RFID detection
  useEffect(() => {
    console.log('Setting up RFID key press listener');

    const handleRFIDSimulation = () => {
      console.log('RFID simulation triggered');
      setShowRFIDCountdown(true);
      setCanPlayGames(true);
      
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

  const handleExitSession = () => {
    setShowRFIDCountdown(false);
    setCanPlayGames(false);
  };

  return (
    <div className="min-h-screen">
      {showRFIDCountdown ? (
        <RFIDCountdown 
          onExit={handleExitSession}
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
              canPlayGames={canPlayGames}
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
    </div>
  );
};

export default Index;
