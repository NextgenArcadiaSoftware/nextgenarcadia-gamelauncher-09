
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
    <div className="text-center mb-4 space-y-4">
      <div className="text-3xl font-bold text-white animate-bounce">
        {!selectedGame ? "Pick Your Game! 🎮" : `${gameLaunchCodes[selectedGame]?.emoji} ${selectedGame}`}
      </div>
      
      <div className="glass p-4 rounded-2xl border-2 border-white/20">
        <div className="flex flex-col items-center gap-3">
          <div className="text-xl text-white/90">
            {!selectedGame ? "Choose your game below!" : "Type this magic code:"}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="w-[240px] h-[50px] text-lg justify-between text-white bg-black/40 
                         border-2 border-white/20 hover:bg-black/60 hover:scale-105 
                         transition-all duration-300 rounded-xl"
              >
                {selectedGame ? `${gameLaunchCodes[selectedGame].emoji} ${selectedGame}` : "🎮 Show Games"}
                <ChevronDown className="h-5 w-5 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-[260px] bg-[#1A1F2C] border-2 border-white/20 rounded-xl"
              align="center"
            >
              <DropdownMenuGroup>
                {Object.entries(gameLaunchCodes).map(([game, {code, description, emoji}]) => (
                  <DropdownMenuItem 
                    key={game} 
                    className="flex flex-col items-start py-2 px-3 focus:bg-white/10 hover:bg-white/5 
                             cursor-pointer transition-all duration-200"
                    onClick={() => handleGameSelect(game, code)}
                  >
                    <span className="font-bold text-base text-white">{emoji} {game}</span>
                    <div className="flex justify-between w-full items-center mt-1">
                      <span className="text-white/90 text-sm font-mono">{code}</span>
                      <span className="text-white/80 text-xs">{description}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {selectedGame && (
            <div className="w-full text-center bg-white/10 p-3 rounded-xl">
              <p className="text-xl font-bold text-white mb-1">Magic Code:</p>
              <p className="text-3xl text-white font-mono tracking-[0.3em]">
                {gameLaunchCodes[selectedGame].code}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
