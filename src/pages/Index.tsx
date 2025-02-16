
import { Button } from "@/components/ui/button";
import { GameShowcase } from "@/components/GameShowcase";
import { Link } from "react-router-dom";

const defaultGames = [{
  id: "creed-demo",
  title: "Creed: Rise to Glory Championship Edition",
  description: "Step into the ring as Adonis Creed and experience the thrill of boxing in VR",
  genre: "Sports",
  release_date: "2024-03-14",
  thumbnail: "/lovable-uploads/bb8b5b5b-bf33-4e0c-b9af-a05408636bce.png",
  trailer: "https://www.youtube.com/watch?v=EgbCMJ54xeM",
  status: "enabled" as const
}];

export default function Index() {
  return (
    <div className="container py-8 space-y-8">
      <GameShowcase 
        games={defaultGames} 
        onPlayGame={() => {}} 
        canPlayGames={false} 
      />
      <div className="flex justify-center">
        <Link to="/library">
          <Button size="lg" className="text-lg">
            View All Games
          </Button>
        </Link>
      </div>
    </div>
  );
}
