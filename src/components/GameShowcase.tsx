
import { Button } from "./ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import type { Game } from "@/types/game";
import { Play, Video } from "lucide-react";
import placeholderImage from "../assets/placeholder.svg";
import { useState } from "react";

interface GameShowcaseProps {
  games: Game[];
  onPlayGame: (title: string, executablePath: string) => void;
  canPlayGames: boolean;
}

// Move function declarations before they're used
const getImageUrl = (path: string) => {
  if (!path) return placeholderImage;
  if (path.startsWith('data:')) return path;
  if (path === 'placeholder.svg') return placeholderImage;
  if (path.startsWith('http')) return path;
  return path.startsWith('/') ? path : `/${path}`;
};

export function GameShowcase({ games, onPlayGame, canPlayGames }: GameShowcaseProps) {
  const [imageSources, setImageSources] = useState<Record<string, string>>({});

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    const videoId = url.split('v=')[1]?.split('&')[0];
    if (!videoId) return '';
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const handleImageError = (gameId: string, genre: string) => {
    console.log('Image failed to load for game:', gameId);
    setImageSources(prev => ({
      ...prev,
      [gameId]: `https://source.unsplash.com/random/1200x800/?${encodeURIComponent(genre.toLowerCase())}`
    }));
  };

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-3xl animate-fade-in">
      <Carousel className="w-full">
        <CarouselContent>
          {games.map((game) => (
            <CarouselItem key={game.id}>
              <div className="relative w-full h-[400px]">
                {game.trailer ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="w-full h-full cursor-pointer">
                        <img 
                          src={imageSources[game.id] || getImageUrl(game.thumbnail)}
                          alt={game.title}
                          className="w-full h-full object-cover animate-scale-in"
                          onError={() => handleImageError(game.id, game.genre)}
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
                    src={imageSources[game.id] || getImageUrl(game.thumbnail)}
                    alt={game.title}
                    className="w-full h-full object-cover animate-scale-in"
                    onError={() => handleImageError(game.id, game.genre)}
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/90 via-black/40 to-transparent animate-fade-in" />
                <div className="absolute bottom-0 left-0 p-6 w-full animate-slide-in-right">
                  <Badge variant="secondary" className="mb-2 bg-white/10 backdrop-blur-sm animate-fade-in">
                    FEATURED
                  </Badge>
                  <h2 className="text-3xl font-bold text-white mb-2 animate-fade-in">{game.title}</h2>
                  <p className="text-base text-white/80 mb-4 line-clamp-2 animate-fade-in">{game.description}</p>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => game.executable_path && onPlayGame(game.title, game.executable_path)}
                      disabled={!canPlayGames}
                      className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white px-6 animate-scale-in"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      PLAY NOW
                    </Button>
                    {game.trailer && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline"
                            className="bg-white/10 hover:bg-white/20 animate-scale-in"
                          >
                            <Video className="w-4 h-4 mr-2" />
                            Watch Trailer
                          </Button>
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
                    )}
                  </div>
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
