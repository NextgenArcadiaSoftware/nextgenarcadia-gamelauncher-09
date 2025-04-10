
import React from 'react';
import { GameLaunchTemplate } from '@/components/game-launch/GameLaunchTemplate';

const CricketLaunch: React.FC = () => {
  const gameData = {
    name: "iB Cricket",
    key: "i",
    description: "Step onto the pitch in this realistic cricket simulator. Face professional bowlers, perfect your batting technique, and experience the stadium atmosphere.",
    imagePath: "/lovable-uploads/f8c126a3-87f1-4ea8-b8d8-76597554d0be.png",
    tags: ["Virtual Reality", "Sports", "Cricket"]
  };

  return <GameLaunchTemplate gameData={gameData} />;
};

export default CricketLaunch;
