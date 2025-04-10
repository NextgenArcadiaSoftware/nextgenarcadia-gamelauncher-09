
import React from 'react';
import { GameLaunchTemplate } from '@/components/game-launch/GameLaunchTemplate';

const PlankLaunch: React.FC = () => {
  const gameData = {
    name: "Richies Plank Experience",
    key: "p",
    description: "Test your fear of heights as you walk a plank 80 stories above the ground. A unique sensory experience that will challenge your perception of reality.",
    imagePath: "/lovable-uploads/cf7a9406-76de-470d-971d-ebb18c291622.png",
    tags: ["Virtual Reality", "Experience", "Heights"]
  };

  return <GameLaunchTemplate gameData={gameData} />;
};

export default PlankLaunch;
