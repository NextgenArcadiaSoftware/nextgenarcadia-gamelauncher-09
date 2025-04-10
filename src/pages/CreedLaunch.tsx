
import React from 'react';
import { GameLaunchTemplate } from '@/components/game-launch/GameLaunchTemplate';

const CreedLaunch: React.FC = () => {
  const gameData = {
    name: "Creed: Rise to Glory Championship Edition",
    key: "g",
    description: "Step into the ring as Adonis Creed and experience the thrill of professional boxing in VR. Train with Rocky Balboa and face challenging opponents in intense matches.",
    imagePath: "/lovable-uploads/af1a36b9-7e7b-4f03-814d-ea2c073181e0.png",
    tags: ["Virtual Reality", "Sports", "Action"]
  };

  return <GameLaunchTemplate gameData={gameData} />;
};

export default CreedLaunch;
