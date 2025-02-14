
import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface GameLaunchHeaderProps {
  activeGame: string | null | undefined;
  inputWord: string;
  targetWord: string;
}

export function GameLaunchHeader({
  activeGame,
  inputWord,
  targetWord
}: GameLaunchHeaderProps) {
  const { toast } = useToast();
  const [selectedGame, setSelectedGame] = useState<string | null>(activeGame || null);

  const gameLaunchCodes: Record<string, {
    code: string;
    description: string;
    emoji: string;
  }> = {
    "Elven Assassin": {
      code: "EAX",
      description: "Shoot arrows! 🎯",
      emoji: "🏹"
    },
    "Fruit Ninja VR": {
      code: "FNJ",
      description: "Cut fruits! 🍎",
      emoji: "⚔️"
    },
    "Crisis Brigade 2 Reloaded": {
      code: "CBR",
      description: "Be a hero! 👮",
      emoji: "🎯"
    },
    "All-in-One Sports VR": {
      code: "AIO",
      description: "Play sports! ⚽",
      emoji: "🏅"
    },
    "Richies Plank Experience": {
      code: "RPE",
      description: "Walk high! 🌟",
      emoji: "🏢"
    },
    "iB Cricket": {
      code: "IBC",
      description: "Play cricket! 🏏",
      emoji: "🏏"
    },
    "Undead Citadel": {
      code: "UDC",
      description: "Be brave! ⚔️",
      emoji: "🏰"
    },
    "Arizona Sunshine": {
      code: "ARS",
      description: "Adventure time! 🌵",
      emoji: "🌞"
    },
    "Subside": {
      code: "SBS",
      description: "Swim deep! 🌊",
      emoji: "🐠"
    },
    "Propagation VR": {
      code: "PVR",
      description: "Be spooky! 👻",
      emoji: "🎮"
    }
  };

  const handleGameSelect = (game: string, code: string) => {
    setSelectedGame(game);
    if (window.electron) {
      window.electron.ipcRenderer.send('simulate-keypress', code);
      toast({
        title: "🎮 Let's Play!",
        description: `You picked ${game}! Now type the magic code: ${code}`,
      });
    }
  };

  return (
    <div className="text-center mb-8 space-y-6">
      <div className="text-4xl font-bold text-white animate-bounce">
        {!selectedGame ? "Pick Your Game! 🎮" : `${gameLaunchCodes[selectedGame]?.emoji} ${selectedGame}`}
      </div>
      
      <div className="glass p-6 rounded-3xl border-4 border-white/20">
        <div className="flex flex-col items-center gap-6">
          <div className="text-2xl text-white/90 mb-2">
            {!selectedGame ? "Touch the button to see games!" : "Great choice! Now type the magic code:"}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="w-[280px] h-[60px] text-xl justify-between text-white bg-black/40 
                         border-4 border-white/20 hover:bg-black/60 hover:scale-105 
                         transition-all duration-300 rounded-2xl"
              >
                {selectedGame ? `${gameLaunchCodes[selectedGame].emoji} ${selectedGame}` : "🎮 Show Games"}
                <ChevronDown className="h-6 w-6 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[300px] bg-[#1A1F2C] border-4 border-white/20 rounded-2xl">
              <DropdownMenuGroup>
                {Object.entries(gameLaunchCodes).map(([game, {code, description, emoji}]) => (
                  <DropdownMenuItem 
                    key={game} 
                    className="flex flex-col items-start p-4 focus:bg-white/10 hover:bg-white/5 
                             cursor-pointer transition-all duration-200 hover:scale-[0.98]"
                    onClick={() => handleGameSelect(game, code)}
                  >
                    <span className="font-bold text-xl text-white">{emoji} {game}</span>
                    <div className="flex justify-between w-full items-center mt-2">
                      <span className="text-white/90 text-lg font-mono">{code}</span>
                      <span className="text-white/80 text-base">{description}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {selectedGame && (
            <div className="grid grid-cols-1 gap-4 w-full text-center bg-white/10 p-4 rounded-2xl">
              <div>
                <p className="text-2xl font-bold text-white mb-2">Your Magic Code Is:</p>
                <p className="text-4xl text-white font-mono tracking-[0.5em]">
                  {gameLaunchCodes[selectedGame].code}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
