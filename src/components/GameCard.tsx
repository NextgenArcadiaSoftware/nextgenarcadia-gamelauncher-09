import { Play, Video } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import placeholderImage from "../assets/placeholder.svg";

const getImageUrl = (path: string) => {
  if (!path) return placeholderImage;
  if (path.startsWith('data:')) return path;
  if (path === 'placeholder.svg') return placeholderImage;
  if (path.startsWith('http')) return path;
  return path.startsWith('/') ? path : `/${path}`;
};

interface GameCardProps {
  title: string;
  thumbnail: string;
  description: string;
  genre: string;
  release_date: string;
  trailer?: string;
  executablePath?: string;
  launch_code?: string;
  onPlay: () => void;
  canPlayGames: boolean;
}

export function GameCard({
  title,
  thumbnail,
  description,
  genre,
  release_date,
  trailer,
  onPlay,
  canPlayGames,
}: GameCardProps) {
  const [imageSrc, setImageSrc] = useState(getImageUrl(thumbnail));
  const navigate = useNavigate();

  const handleTouchStart = (e: React.TouchEvent) => {
    // Prevent default touch behavior to avoid conflicts
    e.stopPropagation();
  };

  const handlePlayButtonClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    // Map of games to their launch screen routes
    const launchScreenRoutes: Record<string, string> = {
      "Fruit Ninja VR": "/fruitninjalaunch",
      "Elven Assassin": "/elvenassassinlaunch",
      "Crisis Brigade 2 Reloaded": "/crisisbrigadelaunch",
      "All-in-One Sports VR": "/sportslaunch",
      "Richies Plank Experience": "/planklaunch",
      "iB Cricket": "/cricketlaunch",
      "Undead Citadel": "/undeadcitadellaunch",
      "Arizona Sunshine": "/arizonalaunch",
      "Subside": "/subsidelaunch",
      "Propagation VR": "/propagationlaunch"
    };

    const route = launchScreenRoutes[title];
    if (route) {
      navigate(route);
    } else {
      onPlay();
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtu.be')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    const videoId = url.split('v=')[1]?.split('&')[0];
    if (!videoId) return '';
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const handleImageError = () => {
    console.log('Image failed to load:', thumbnail);
    setImageSrc(`https://source.unsplash.com/random/800x600/?${encodeURIComponent(genre.toLowerCase())}`);
  };

  return (
    <div 
      className="nintendo-card group"
      onTouchStart={handleTouchStart}
    >
      <div className="relative h-[280px] overflow-hidden rounded-[2rem]">
        <img 
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)'
        }} />
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
              <span className="inline-block px-3 py-1 rounded-full text-xs text-white/90 bg-white/20 backdrop-blur-sm">
                {genre}
              </span>
            </div>
            <div className="flex gap-2">
              {trailer && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      size="icon"
                      className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                    >
                      <Video className="w-6 h-6" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass max-w-4xl w-full">
                    <DialogHeader>
                      <DialogTitle>{title} - Trailer</DialogTitle>
                    </DialogHeader>
                    <div className="relative w-full h-0 pt-[56.25%] rounded-2xl overflow-hidden">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={getYouTubeEmbedUrl(trailer)}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <Button 
                size="icon"
                className="w-12 h-12 rounded-full bg-white hover:bg-white/90 text-black"
                onClick={handlePlayButtonClick}
              >
                <Play className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
