
import React from 'react';
import { GameLaunchTemplate } from '@/components/game-launch/GameLaunchTemplate';

const CricVrxLaunch: React.FC = () => {
  const gameData = {
    name: "CRICVRX",
    key: "q",
    description: "Experience the thrill of cricket in virtual reality with CRICVRX. Step onto the field, bat in hand, and face bowlers from around the world in this immersive cricket simulation.",
    imagePath: "/lovable-uploads/f8c126a3-87f1-4ea8-b8d8-76597554d0be.png",
    tags: ["Virtual Reality", "Sports", "Cricket"]
  };

  return <GameLaunchTemplate gameData={gameData} />;
};

export default CricVrxLaunch;
