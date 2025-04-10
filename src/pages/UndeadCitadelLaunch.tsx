
import React from 'react';
import { GameLaunchTemplate } from '@/components/game-launch/GameLaunchTemplate';

const UndeadCitadelLaunch: React.FC = () => {
  const gameData = {
    name: "Undead Citadel",
    key: "u",
    description: "Wield medieval weapons against the undead in this visceral combat game. Block, slash, and dismember your way through hordes of medieval zombies.",
    imagePath: "/lovable-uploads/cac2759b-8463-4e08-b1ea-aeb608ac84a9.png",
    tags: ["Virtual Reality", "Medieval", "Action"]
  };

  return <GameLaunchTemplate gameData={gameData} />;
};

export default UndeadCitadelLaunch;
