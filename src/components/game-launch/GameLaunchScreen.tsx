
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { GameLaunchHeader } from './GameLaunchHeader';

interface Game {
  title: string;
  description: string;
  thumbnail: string;
  genre: string;
  trailer?: string;
}

interface GameLaunchScreenProps {
  game: Game;
  onContinue: () => void;
}

export function GameLaunchScreen({ game, onContinue }: GameLaunchScreenProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    setIsLoading(true);
    // Use a small timeout to prevent state updates during render
    setTimeout(() => {
      onContinue();
    }, 10);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0f172a] to-black text-white">
      <GameLaunchHeader game={game} />
      
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-4xl w-full bg-black/30 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/10">
          <h2 className="text-3xl font-bold mb-6 text-center">Ready to Play?</h2>
          
          <div className="text-center mb-8">
            <p className="text-lg text-gray-300 mb-6">Click continue to start your gaming session</p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-xl px-8 py-6 h-auto font-bold tracking-wider shadow-lg"
              onClick={handleContinue}
              disabled={isLoading}
            >
              {isLoading ? "Starting..." : "Start Game"}
            </Button>
          </div>
          
          {game.trailer && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-2 text-center">Game Trailer</h3>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${game.trailer.split('v=')[1]}`} 
                  title={`${game.title} trailer`} 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
