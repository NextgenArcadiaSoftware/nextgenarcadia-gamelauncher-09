
import { Button } from "./ui/button";
import { Settings } from "lucide-react";
import { useState } from "react";
import { OwnerDashboard } from "./OwnerDashboard";

export function Header() {
  const [showOwnerDashboard, setShowOwnerDashboard] = useState(false);

  const handleAddGame = (game: any) => {
    console.log('Game added:', game);
  };

  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-white next-gen-title">
          NextGen Arcadia
        </h1>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 hover:border-white/30"
        onClick={() => setShowOwnerDashboard(true)}
      >
        <Settings className="h-4 w-4 text-white" />
      </Button>

      {showOwnerDashboard && (
        <OwnerDashboard
          onClose={() => setShowOwnerDashboard(false)}
          onAddGame={handleAddGame}
        />
      )}
    </div>
  );
}
