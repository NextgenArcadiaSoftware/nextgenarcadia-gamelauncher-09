import { useState } from "react";
import { GameCard } from "@/components/GameCard";
import { AddGameDialog } from "@/components/AddGameDialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Game {
  id: number;
  title: string;
  description: string;
  genre: string;
  releaseDate: string;
  thumbnail: string;
  trailer?: string;
}

const Index = () => {
  const [games, setGames] = useState<Game[]>([
    {
      id: 1,
      title: "Cyber Nexus",
      description: "A futuristic cyberpunk adventure with stunning visuals",
      genre: "Action RPG",
      releaseDate: "2024-03-15",
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      trailer: "https://example.com/trailer.mp4",
    },
    {
      id: 2,
      title: "Robot Warriors",
      description: "Battle against mechanical foes in this intense action game",
      genre: "Action",
      releaseDate: "2024-02-20",
      thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    },
  ]);

  const { toast } = useToast();

  const handleAddGame = (newGame: Omit<Game, "id">) => {
    setGames([...games, { ...newGame, id: games.length + 1 }]);
  };

  const handlePlayGame = (duration: number) => {
    toast({
      title: "Game Started",
      description: `Timer set for ${duration} minutes`,
    });
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Arcade Launcher
          </h1>
          <div className="flex gap-4">
            <AddGameDialog onAddGame={handleAddGame} />
            <Button
              variant="destructive"
              onClick={() => {
                toast({
                  title: "Exiting",
                  description: "Closing the launcher...",
                });
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Exit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard
              key={game.id}
              {...game}
              onPlay={handlePlayGame}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;