
import React from 'react';
import { GameLaunchTemplate } from '@/components/game-launch/GameLaunchTemplate';

const SportsLaunch: React.FC = () => {
  const gameData = {
    name: "All-In-One Sports VR",
    key: "v",
    description: "Experience the thrill of multiple sports in one comprehensive VR package. From tennis to basketball, golf to bowling - test your athletic skills across various disciplines.",
    imagePath: "/lovable-uploads/f12eb427-db97-42db-975b-2ccadfb41224.png",
    tags: ["Virtual Reality", "Sports", "Simulation"]
  };

  return <GameLaunchTemplate gameData={gameData} />;
};

export default SportsLaunch;
