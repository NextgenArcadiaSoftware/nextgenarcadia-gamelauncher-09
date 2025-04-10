
import React from 'react';
import { GameLaunchTemplate } from '@/components/game-launch/GameLaunchTemplate';

const SubsideLaunch: React.FC = () => {
  const gameData = {
    name: "Subside",
    key: "s",
    description: "Dive into a surreal underwater world where reality shifts and bends around you. Solve puzzles and uncover the mysteries of the deep in this atmospheric experience.",
    imagePath: "/lovable-uploads/be53debf-e66a-4b71-8445-6a4694a2d95e.png",
    tags: ["Virtual Reality", "Puzzle", "Atmospheric"]
  };

  return <GameLaunchTemplate gameData={gameData} />;
};

export default SubsideLaunch;
