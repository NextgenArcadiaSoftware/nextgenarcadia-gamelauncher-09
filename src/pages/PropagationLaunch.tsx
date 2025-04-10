
import React from 'react';
import { GameLaunchTemplate } from '@/components/game-launch/GameLaunchTemplate';

const PropagationLaunch: React.FC = () => {
  const gameData = {
    name: "Propagation VR",
    key: "g",
    description: "Fight for survival in a post-apocalyptic world overrun by mutated creatures. Use your reflexes and aim to survive increasingly difficult waves of enemies.",
    imagePath: "/lovable-uploads/be53debf-e66a-4b71-8445-6a4694a2d95e.png",
    tags: ["Virtual Reality", "Horror", "Shooter"]
  };

  return <GameLaunchTemplate gameData={gameData} />;
};

export default PropagationLaunch;
