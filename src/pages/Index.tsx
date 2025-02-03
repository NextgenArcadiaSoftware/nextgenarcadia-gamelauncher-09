import { useState } from "react";
import { GameCard } from "@/components/GameCard";
import { AddGameDialog } from "@/components/AddGameDialog";
import { Button } from "@/components/ui/button";
import { LogOut, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex flex-col space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-5xl font-bold next-gen-title">
              Next Gen Arcadia
            </h1>
            <div className="flex items-center gap-6">
              <div className="relative w-64">
                <Input
                  type="search"
                  placeholder="Search games..."
                  className="glass pl-10"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              <AddGameDialog onAddGame={handleAddGame} />
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  toast({
                    title: "Exiting",
                    description: "Closing the launcher...",
                  });
                }}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Featured Game */}
          <div className="glass p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
            <div className="relative z-10 max-w-xl">
              <h2 className="text-4xl font-bold mb-4">Featured Game</h2>
              <p className="text-lg text-gray-300 mb-6">
                Discover the latest and most exciting games in our collection
              </p>
              <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                Explore Now
              </Button>
            </div>
          </div>

          {/* Game Grid */}
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
    </div>
  );
};

export default Index;