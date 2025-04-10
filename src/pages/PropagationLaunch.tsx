
import React from 'react';
import { GameLaunchTemplate } from '@/components/game-launch/GameLaunchTemplate';

const PropagationLaunch: React.FC = () => {
  const gameData = {
    name: "Propagation VR",
    key: "g",
    description: "Fight for survival in a post-apocalyptic world overrun by mutated creatures. Use your reflexes and aim to survive increasingly difficult waves of enemies.",
    imagePath: "/lovable-uploads/59651183-1862-4bb1-8290-3008f0f81f16.png",
    tags: ["Virtual Reality", "Horror", "Shooter"]
  };

  return <GameLaunchTemplate gameData={gameData} />;
};

export default PropagationLaunch;
