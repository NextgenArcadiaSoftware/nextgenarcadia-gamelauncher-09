
import { Button } from "./ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import type { Game } from "@/types/game";
import placeholderImage from "../assets/placeholder.svg";

interface GameShowcaseProps {
  games: Game[];
  onPlayGame: (title: string, executablePath: string) => void;
  canPlayGames: boolean;
}

export function GameShowcase({ games, onPlayGame, canPlayGames }: GameShowcaseProps) {
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    const videoId = url.split('v=')[1]?.split('&')[0];
    if (!videoId) return '';
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-3xl animate-fade-in">
      <Carousel className="w-full">
        <CarouselContent>
          {games.map((game) => (
            <CarouselItem key={game.id}>
              <div className="relative w-full h-[600px]">
                {game.trailer ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="w-full h-full cursor-pointer">
                        <img 
                          src={game.thumbnail || placeholderImage}
                          alt={game.title}
                          className="w-full h-full object-cover animate-scale-in"
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="glass border-white/10 sm:max-w-[800px]">
                      <DialogHeader>
                        <DialogTitle className="next-gen-title text-white">{game.title} - Trailer</DialogTitle>
                      </DialogHeader>
                      <div className="relative w-full h-0 pt-[56.25%]">
                        <iframe
                          className="absolute top-0 left-0 w-full h-full rounded-lg"
                          src={getYouTubeEmbedUrl(game.trailer)}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <img 
                    src={game.thumbnail || placeholderImage}
                    alt={game.title}
                    className="w-full h-full object-cover animate-scale-in"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black/90 via-black/40 to-transparent animate-fade-in" />
                <div className="absolute bottom-0 left-0 p-8 w-full animate-slide-in-right">
                  <Badge variant="secondary" className="mb-4 bg-white/10 backdrop-blur-sm animate-fade-in">
                    SHOWCASE
                  </Badge>
                  <h2 className="text-4xl font-bold text-white mb-2 animate-fade-in">{game.title}</h2>
                  <p className="text-lg text-white/80 mb-6 animate-fade-in">{game.description}</p>
                  <Button 
                    onClick={() => game.executable_path && onPlayGame(game.title, game.executable_path)}
                    disabled={!canPlayGames}
                    className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white px-8 animate-scale-in"
                  >
                    PLAY NOW
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
