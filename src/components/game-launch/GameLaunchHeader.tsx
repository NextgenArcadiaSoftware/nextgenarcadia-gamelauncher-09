
import React from 'react';

interface GameLaunchHeaderProps {
  activeGame: string | null | undefined;
  inputWord: string;
  targetWord: string;
}

export function GameLaunchHeader({ activeGame, inputWord, targetWord }: GameLaunchHeaderProps) {
  return (
    <div className="text-center mb-8 space-y-4">
      <h1 className="text-4xl font-bold text-white">
        {activeGame}
      </h1>
      <p className="text-xl text-white/90">
        Enter Launch Code: {targetWord}
      </p>
    </div>
  );
}
