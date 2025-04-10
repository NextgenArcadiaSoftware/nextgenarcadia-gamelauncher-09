
import React from 'react';
import { GameLaunchTemplate } from '@/components/game-launch/GameLaunchTemplate';

const RollerCoasterLaunch: React.FC = () => {
  const gameData = {
    name: "RollerCoaster Legends",
    key: "r",
    description: "Experience the ultimate thrill ride in virtual reality with RollerCoaster Legends. Soar through fantastical environments with breathtaking drops and loops that will test your courage.",
    imagePath: "/lovable-uploads/ad0b4a73-7182-4cd0-a370-e527f21a9f87.png",
    tags: ["Virtual Reality", "Experience", "Simulation"]
  };

  return <GameLaunchTemplate gameData={gameData} />;
};

export default RollerCoasterLaunch;
