
import { Button } from "./ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { Badge } from "./ui/badge";
import type { Game } from "@/types/game";

interface GameShowcaseProps {
  games: Game[];
  onPlayGame: (title: string, executablePath: string) => void;
  canPlayGames: boolean;
}

export function GameShowcase({ games, onPlayGame, canPlayGames }: GameShowcaseProps) {
  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-3xl">
      <Carousel className="w-full">
        <CarouselContent>
          {games.map((game) => (
            <CarouselItem key={game.id}>
              <div className="relative w-full h-[600px]">
                <img 
                  src={game.thumbnail} 
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <Badge variant="secondary" className="mb-4 bg-white/10 backdrop-blur-sm">
                    SHOWCASE
                  </Badge>
                  <h2 className="text-4xl font-bold text-white mb-2">{game.title}</h2>
                  <p className="text-lg text-white/80 mb-6">{game.description}</p>
                  <Button 
                    onClick={() => game.executable_path && onPlayGame(game.title, game.executable_path)}
                    disabled={!canPlayGames}
                    className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white px-8"
                  >
                    GET
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
}
