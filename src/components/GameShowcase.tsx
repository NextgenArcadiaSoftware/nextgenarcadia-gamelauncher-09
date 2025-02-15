
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import type { Game } from "@/types/game";
import { GameCard } from "./GameCard";
import { cn } from "@/lib/utils";

interface GameShowcaseProps {
  games: Game[];
  onPlayGame: (title: string, executablePath: string) => void;
  canPlayGames: boolean;
}

export function GameShowcase({ games, onPlayGame, canPlayGames }: GameShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const currentTouch = e.touches[0].clientX;
    const diff = touchStart - currentTouch;

    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
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
    <div 
      className="relative group/showcase select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
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

        {/* Navigation Arrows - Always visible on touch devices */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 hover:border-white/30"
            onClick={handlePrevious}
            disabled={isTransitioning}
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </Button>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 hover:border-white/30"
            onClick={handleNext}
            disabled={isTransitioning}
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </Button>
        </div>

        {/* Progress Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {games.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
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
    </div>
  );
}
