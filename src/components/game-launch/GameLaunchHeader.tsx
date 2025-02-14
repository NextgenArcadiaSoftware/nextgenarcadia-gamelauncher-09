
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

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
  const gameLaunchCodes: Record<string, {
    code: string;
    description: string;
  }> = {
    "Elven Assassin": {
      code: "EAX",
      description: "Elite archer combat"
    },
    "Fruit Ninja VR": {
      code: "FNJ",
      description: "Fruit slicing action"
    },
    "Crisis Brigade 2 Reloaded": {
      code: "CBR",
      description: "Tactical shooter"
    },
    "All-in-One Sports VR": {
      code: "AIO",
      description: "Multi-sport experience"
    },
    "Richies Plank Experience": {
      code: "RPE",
      description: "Height simulation"
    },
    "iB Cricket": {
      code: "IBC",
      description: "Cricket simulation"
    },
    "Undead Citadel": {
      code: "UDC",
      description: "Medieval combat"
    },
    "Arizona Sunshine": {
      code: "ARS",
      description: "Zombie survival"
    },
    "Subside": {
      code: "SBS",
      description: "Underwater adventure"
    },
    "Propagation VR": {
      code: "PVR",
      description: "Horror survival"
    }
  };

  return <div className="text-center mb-8 space-y-4">
      <h1 className="text-4xl font-bold text-white">
        {activeGame}
      </h1>
      <div className="glass p-4 rounded-lg">
        <div className="flex flex-col items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-between text-white bg-black/40 border-white/10 hover:bg-black/60">
                Launch Codes
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[280px] bg-[#1A1F2C] border border-white/10">
              <DropdownMenuGroup>
                {Object.entries(gameLaunchCodes).map(([game, {code, description}]) => (
                  <DropdownMenuItem 
                    key={game} 
                    className="flex flex-col items-start p-2 focus:bg-white/10 hover:bg-white/5 cursor-pointer"
                    onClick={() => {
                      if (window.electron) {
                        window.electron.ipcRenderer.send('simulate-keypress', code);
                      }
                    }}
                  >
                    <span className="font-semibold text-white">{game}</span>
                    <div className="flex justify-between w-full text-sm">
                      <span className="text-white/90">{code}</span>
                      <span className="text-white/60 text-xs">{description}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="text-left">
              <p className="text-sm font-medium text-white/70">Current Game</p>
              <p className="text-lg text-white">{activeGame || "Select a game"}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-white/70">Launch Code</p>
              <p className="text-lg text-white">{activeGame ? gameLaunchCodes[activeGame]?.code : "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>;
}
