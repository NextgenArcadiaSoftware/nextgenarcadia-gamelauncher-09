
import React from 'react';

interface GameLaunchHeaderProps {
  activeGame: string | null | undefined;
  inputWord: string;
  targetWord: string;
}

export function GameLaunchHeader({ activeGame, inputWord, targetWord }: GameLaunchHeaderProps) {
  const getGameLaunchCode = (gameTitle: string | null | undefined): string => {
    if (!gameTitle) return "XXX";
    
    const codeMap: Record<string, string> = {
      "Elven Assassin": "EAX",
      "Fruit Ninja VR": "FNJ",
      "Crisis Brigade 2 Reloaded": "CBR",
      "All-in-One Sports VR": "AIO",
      "Richies Plank Experience": "RPE",
      "iB Cricket": "IBC",
      "Undead Citadel": "UDC",
      "Arizona Sunshine": "ARS",
      "Subside": "SBS",
      "Propagation VR": "PVR"
    };
    
    return codeMap[gameTitle] || "XXX";
  };

  return (
    <div className="text-center mb-8 space-y-4">
      <h1 className="text-4xl font-bold text-white">
        {activeGame}
      </h1>
      <div className="glass p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <p className="text-xl font-medium text-white">Game Name</p>
          <p className="text-xl font-medium text-white">Launch Code</p>
          <p className="text-lg text-white/90">{activeGame || "Select a game"}</p>
          <p className="text-lg text-white/90">{getGameLaunchCode(activeGame)}</p>
        </div>
      </div>
    </div>
  );
}
