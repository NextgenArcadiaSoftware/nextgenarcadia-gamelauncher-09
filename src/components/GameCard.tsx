
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
  const [showTapCard, setShowTapCard] = useState(false);
  const [showTapToStart, setShowTapToStart] = useState(false);
  const [imageSrc, setImageSrc] = useState(getImageUrl(thumbnail));
  const [currentInput, setCurrentInput] = useState('');

  const gameCodeMap: Record<string, string> = {
    "Elven Assassin": "EAX",
    "Fruit Ninja VR": "FNJ",
    "Crisis Brigade 2 Reloaded": "CBR",
    "All-in-One Sports VR": "AIO",
    "Richies Plank Experience": "RPE",
    "iB Cricket": "IBC",
    "Undead Citadel": "UDC",
    "Arizona Sunshine": "ARS",
    "Subside": "SBS",
    "Propagation VR": "PVR"
  };

  const handlePlayButtonClick = () => {
    if (!canPlayGames) {
      setShowTapCard(true);
    } else {
      setShowTapToStart(true);
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

  const launchCode = gameCodeMap[title];

  return (
    <div className="nintendo-card group">
      {showTapCard && !canPlayGames ? (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-50 animate-fade-in rounded-[2rem] overflow-hidden"
          style={{
            background: 'linear-gradient(-45deg, #22c55e, #16a34a, #15803d, #166534)',
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
          <div className="flex flex-col items-center gap-4">
            <div className="animate-[pulse_1s_ease-in-out_infinite] text-white text-2xl font-bold">
              ENTER CODE: {launchCode}
            </div>
            <div className="text-white/60 text-sm">
              Click anywhere to continue
            </div>
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
                      className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                    >
                      <Video className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass">
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
