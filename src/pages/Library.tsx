import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { Library as LibraryIcon, ArrowLeft } from "lucide-react";

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

const Library = () => {
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

  const { toast } = useToast();

  const handleToggleGame = (gameId: number) => {
    setGames(prevGames =>
      prevGames.map(game =>
        game.id === gameId
          ? { ...game, enabled: !game.enabled }
          : game
      )
    );

    const game = games.find(g => g.id === gameId);
    toast({
      title: `Game ${game?.enabled ? 'Disabled' : 'Enabled'}`,
      description: `${game?.title} has been ${game?.enabled ? 'disabled' : 'enabled'}.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex flex-col space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center glass p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon" className="glass">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <LibraryIcon className="w-6 h-6" />
              <h1 className="text-xl font-bold">Game Library</h1>
            </div>
          </div>

          {/* Game List */}
          <div className="space-y-4">
            {games.map((game) => (
              <div
                key={game.id}
                className="glass p-4 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div>
                    <h3 className="font-bold">{game.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {game.genre} • {game.releaseDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={game.enabled}
                      onCheckedChange={() => handleToggleGame(game.id)}
                    />
                    <span className="text-sm">
                      {game.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
