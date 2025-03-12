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
export function GameShowcase({
  games,
  onPlayGame,
  canPlayGames
}: GameShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prevIndex => prevIndex + 1 >= games.length ? 0 : prevIndex + 1);
  };
  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prevIndex => prevIndex - 1 < 0 ? games.length - 1 : prevIndex - 1);
  };
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const currentTouch = e.touches[0].clientX;
    const diff = touchStart - currentTouch;
    if (Math.abs(diff) > 50) {
      // Minimum swipe distance
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
  const progress = (currentIndex + 1) / games.length * 100;
  return <div className="relative group/showcase select-none" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      
    </div>;
}