
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import type { Game } from "@/types/game";
import { GameCard } from "./GameCard";
import { Slider } from "./ui/slider";
import { cn } from "@/lib/utils";

interface GameShowcaseProps {
  games: Game[];
  onPlayGame: (title: string, executablePath: string) => void;
  canPlayGames: boolean;
}

export function GameShowcase({ games, onPlayGame, canPlayGames }: GameShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= games.length ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 < 0 ? games.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  if (!games.length) {
    return null;
  }

  const currentGame = games[currentIndex];
  const progress = ((currentIndex + 1) / games.length) * 100;

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

        {/* Progress Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {games.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentIndex 
                  ? "bg-white scale-125" 
                  : "bg-white/30 hover:bg-white/50"
              )}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
          <div 
            className="h-full bg-white transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {games.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 hover:border-white/30 opacity-0 group-hover/showcase:opacity-100 transition-opacity duration-200"
            onClick={handlePrevious}
            disabled={isTransitioning}
          >
            <ChevronLeft className="h-4 w-4 text-white" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 hover:border-white/30 opacity-0 group-hover/showcase:opacity-100 transition-opacity duration-200"
            onClick={handleNext}
            disabled={isTransitioning}
          >
            <ChevronRight className="h-4 w-4 text-white" />
          </Button>
        </>
      )}
    </div>
  );
}
