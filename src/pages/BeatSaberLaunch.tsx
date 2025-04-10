
import React from 'react';
import { GameLaunchTemplate } from '@/components/game-launch/GameLaunchTemplate';

const BeatSaberLaunch: React.FC = () => {
  const gameData = {
    name: "Beat Saber",
    key: "w",
    description: "Experience the thrill of slicing blocks to the beat of the music in this immersive rhythm-based VR game. Challenge yourself with different difficulty levels and tracks!",
    imagePath: "/lovable-uploads/2f7ba916-4fc9-4136-b3cc-9f1e2ba0be94.png",
    tags: ["Virtual Reality", "Music", "Rhythm"]
  };

  return <GameLaunchTemplate gameData={gameData} />;
};

export default BeatSaberLaunch;
