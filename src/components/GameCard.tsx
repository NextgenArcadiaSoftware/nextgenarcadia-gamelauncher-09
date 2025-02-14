
import { Play, Video } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useState } from "react";
import placeholderImage from "../assets/placeholder.svg";

interface GameCardProps {
  title: string;
  thumbnail: string;
  description: string;
  genre: string;
  release_date: string;
  trailer?: string;
  executablePath?: string;
  onPlay: () => void;
  canPlayGames: boolean;
}

// Move function declarations before they're used
const getImageUrl = (path: string) => {
  if (!path) return placeholderImage;
  if (path.startsWith('data:')) return path;
  if (path === 'placeholder.svg') return placeholderImage;
  if (path.startsWith('http')) return path;
  // Remove any leading slashes and add public path
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/${cleanPath}`;
};

export function GameCard({
  title,
  thumbnail,
  description,
  genre,
  release_date,
  trailer,
  onPlay,
  canPlayGames
}: GameCardProps) {
  const [showTapCard, setShowTapCard] = useState(false);
  const [showTapToStart, setShowTapToStart] = useState(false);
  const [imageSrc, setImageSrc] = useState(getImageUrl(thumbnail));

  const handlePlayButtonClick = () => {
    if (!canPlayGames) {
      setShowTapCard(true);
    } else {
      setShowTapToStart(true);
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    const videoId = url.split('v=')[1]?.split('&')[0];
    if (!videoId) return '';
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const handleImageError = () => {
    console.log('Image failed to load:', thumbnail);
    setImageSrc(`https://source.unsplash.com/random/800x600/?${encodeURIComponent(genre.toLowerCase())}`);
  };

  return (
    <div className="nintendo-card group">
      {showTapCard && !canPlayGames ? (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-50 animate-fade-in rounded-[2rem] overflow-hidden"
          style={{
            background: 'linear-gradient(-45deg, #ea384c, #22c55e, #ea384c, #22c55e)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
          }}
        >
          <style>
            {`
              @keyframes gradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
            `}
          </style>
          <div className="backdrop-blur-xl w-full h-full flex flex-col items-center justify-center gap-4">
            <div className="flex flex-col items-center gap-4 text-center px-6">
              <div className="animate-[pulse_2s_ease-in-out_infinite] text-white text-2xl font-bold drop-shadow-lg">
                TAP CARD TO START
              </div>
              <p className="text-white text-sm drop-shadow">
                Present your RFID card
              </p>
              <Button
                variant="outline"
                className="mt-2 bg-white/10 hover:bg-white/20 text-white border-0"
                onClick={() => setShowTapCard(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : null}
      
      {showTapToStart && canPlayGames ? (
        <div 
          className="absolute inset-0 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center z-50 cursor-pointer animate-fade-in rounded-[2rem]"
          onClick={() => {
            onPlay();
            setShowTapToStart(false);
          }}
        >
          <div className="animate-[pulse_1s_ease-in-out_infinite] text-white text-2xl font-bold">
            START GAME
          </div>
        </div>
      ) : null}
      
      <div className="relative h-[280px] overflow-hidden rounded-[2rem]">
        <img 
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
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
                      className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                    >
                      <Video className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass sm:max-w-[800px]">
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
                className="rounded-full bg-white hover:bg-white/90 text-black"
                onClick={handlePlayButtonClick}
              >
                <Play className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
