
import React from 'react';
import { GameLaunchTemplate } from '@/components/game-launch/GameLaunchTemplate';

const ArizonaSunshineLaunch: React.FC = () => {
  const gameData = {
    name: "Arizona Sunshine II",
    key: "a",
    description: "Survive the zombie apocalypse in the scorching heat of Arizona. Explore, scavenge for supplies, and fight off the undead in this immersive VR adventure.",
    imagePath: "/lovable-uploads/4e2b1ea9-0729-4f84-b8c4-974e08cd8c30.png",
    tags: ["Virtual Reality", "Zombie", "Survival"]
  };

  return <GameLaunchTemplate gameData={gameData} />;
};

export default ArizonaSunshineLaunch;
