
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
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const gamesPerPage = 3;
  const totalPages = Math.ceil(games.length / gamesPerPage);
  const startIndex = currentPage * gamesPerPage;

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
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
  }, [currentPage]);

  if (!games.length) {
    return null;
  }

  const visibleGames = games.slice(startIndex, startIndex + gamesPerPage);
  const progress = ((currentPage + 1) / totalPages) * 100;

  return (
    <div 
      className="relative group/showcase select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="glass p-8 rounded-3xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleGames.map((game) => (
            <div
              key={game.id}
              className={cn(
                "transition-all duration-300",
                isTransitioning ? "opacity-0" : "opacity-100"
              )}
            >
              <GameCard
                title={game.title}
                thumbnail={game.thumbnail}
                description={game.description}
                genre={game.genre}
                release_date={game.release_date}
                trailer={game.trailer}
                launch_code={game.launch_code}
                onPlay={() => game.executable_path && onPlayGame(game.title, game.executable_path)}
                canPlayGames={canPlayGames}
              />
            </div>
          ))}
        </div>

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
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index === currentPage 
                  ? "bg-white scale-125" 
                  : "bg-white/30 hover:bg-white/50"
              )}
              onClick={() => setCurrentPage(index)}
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
