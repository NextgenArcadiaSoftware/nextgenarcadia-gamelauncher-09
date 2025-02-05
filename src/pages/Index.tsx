import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { RFIDCountdown } from "@/components/RFIDCountdown";
import { Header } from "@/components/Header";
import { CategoryBar } from "@/components/CategoryBar";
import { GameGrid } from "@/components/GameGrid";
import { Button } from "@/components/ui/button";

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
      title: "Beat Saber",
      description: "The ultimate VR rhythm game with lightsabers",
      genre: "Rhythm",
      releaseDate: "2024",
      thumbnail: "/lovable-uploads/09374846-fe58-4998-868a-5691a68042c5.png",
      trailer: "https://www.youtube.com/watch?v=vL39Sg2AqWg",
    },
    {
      id: 2,
      title: "Pavlov VR",
      description: "Multiplayer shooter with realistic combat",
      genre: "FPS",
      releaseDate: "2024",
      thumbnail: "/lovable-uploads/a6a527be-670f-4238-9b4e-4cd389187b90.png",
      trailer: "https://www.youtube.com/watch?v=wBzw9ZJ5r9A",
    },
    {
      id: 3,
      title: "Ghosts of Tabor",
      description: "Tactical survival in a post-apocalyptic world",
      genre: "Survival",
      releaseDate: "2024",
      thumbnail: "/lovable-uploads/2f7ba916-4fc9-4136-b3cc-9f1e2ba0be94.png",
      trailer: "https://www.youtube.com/watch?v=3vZG5oH8M0Y",
    },
    {
      id: 4,
      title: "Hard Bullet",
      description: "Action-packed VR combat simulator",
      genre: "Action",
      releaseDate: "2024",
      thumbnail: "/lovable-uploads/cac2759b-8463-4e08-b1ea-aeb608ac84a9.png",
      trailer: "https://www.youtube.com/watch?v=K2NxwJZb0i0",
    },
    {
      id: 5,
      title: "Arizona Sunshine",
      description: "Zombie apocalypse survival in VR",
      genre: "Horror",
      releaseDate: "2024",
      thumbnail: "/lovable-uploads/cf7a9406-76de-470d-971d-ebb18c291622.png",
      trailer: "https://www.youtube.com/watch?v=l_gWDl_f6V8",
    },
    {
      id: 6,
      title: "Blade & Sorcery",
      description: "Medieval fantasy combat simulator",
      genre: "Action",
      releaseDate: "2024",
      thumbnail: "/lovable-uploads/d38b1a33-5653-43f5-802b-51546fe7fefb.png",
      trailer: "https://www.youtube.com/watch?v=BNxFA0qmOqY",
    }
  ]);

  const [activeGame, setActiveGame] = useState<{
    title: string;
    timeLeft: number;
  } | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showRFIDCountdown, setShowRFIDCountdown] = useState(false);

  const { toast } = useToast();

  const categories = ["All", "Action", "FPS", "Horror", "Rhythm", "Survival"];

  const filteredGames = selectedCategory === "All" 
    ? games 
    : games.filter(game => game.genre === selectedCategory);

  const handleAddGame = (newGame: Omit<Game, "id">) => {
    setGames([...games, { ...newGame, id: games.length + 1 }]);
  };

  const handlePlayGame = (title: string, duration: number) => {
    setActiveGame({ title, timeLeft: duration * 60 });
    const interval = setInterval(() => {
      setActiveGame((prev) => {
        if (!prev) return null;
        const newTime = prev.timeLeft - 1;
        if (newTime <= 0) {
          clearInterval(interval);
          return null;
        }
        return { ...prev, timeLeft: newTime };
      });
    }, 1000);
  };

  useEffect(() => {
    // Only set up electron listeners if we're in an electron environment
    const isElectron = window.electron !== undefined;
    
    if (isElectron) {
      // @ts-ignore - electron is available in desktop environment
      window.electron.ipcRenderer.on('rfid-detected', (_, rfidData) => {
        console.log('RFID Detected:', rfidData);
        setShowRFIDCountdown(true);
        toast({
          title: "RFID Card Detected",
          description: "Starting 8 minute session...",
        });
      });

      return () => {
        // @ts-ignore - electron is available in desktop environment
        window.electron.ipcRenderer.removeAllListeners('rfid-detected');
      };
    }
  }, []);

  return (
    <div className="min-h-screen">
      {showRFIDCountdown ? (
        <RFIDCountdown onExit={() => setShowRFIDCountdown(false)} />
      ) : (
        <div className="max-w-7xl mx-auto p-8">
          <div className="flex flex-col space-y-8">
            <Header />
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

      {/* Countdown Overlay */}
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

