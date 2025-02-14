
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import type { Game } from "@/types/game";
import { GameCard } from "./GameCard";

interface GameShowcaseProps {
  games: Game[];
  onPlayGame: (title: string, executablePath: string) => void;
  canPlayGames: boolean;
}

export function GameShowcase({ games, onPlayGame, canPlayGames }: GameShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= games.length ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 < 0 ? games.length - 1 : prevIndex - 1
    );
  };

  if (!games.length) {
    return null;
  }

  const currentGame = games[currentIndex];

  return (
    <div className="relative group/showcase">
      <div className="glass p-8 rounded-3xl relative overflow-hidden">
        <GameCard
          key={currentGame.id}
          title={currentGame.title}
          thumbnail={currentGame.thumbnail}
          description={currentGame.description}
          genre={currentGame.genre}
          release_date={currentGame.release_date}
          trailer={currentGame.trailer}
          launch_code={currentGame.launch_code}
          onPlay={() => currentGame.executable_path && onPlayGame(currentGame.title, currentGame.executable_path)}
          canPlayGames={canPlayGames}
        />
      </div>

      {games.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 hover:border-white/30 opacity-0 group-hover/showcase:opacity-100 transition-opacity duration-200"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-4 w-4 text-white" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 hover:border-white/30 opacity-0 group-hover/showcase:opacity-100 transition-opacity duration-200"
            onClick={handleNext}
          >
            <ChevronRight className="h-4 w-4 text-white" />
          </Button>
        </>
      )}
    </div>
  );
}
