
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

  // Debug log to check thumbnail path
  console.log('Thumbnail path:', thumbnail);

  return (
    <div className="group relative overflow-hidden rounded-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl">
      {showTapCard && !canPlayGames ? (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-black/95 to-black/90 backdrop-blur-sm flex flex-col items-center justify-center gap-8 z-50 animate-fade-in"
        >
          <div className="flex flex-col items-center gap-4 text-center px-6">
            <div className="animate-[pulse_2s_ease-in-out_infinite] text-orange-500 text-3xl font-bold next-gen-title">
              TAP CARD TO START GAME
            </div>
            <p className="text-gray-400 text-sm">
              Please present your RFID card to begin your gaming session
            </p>
            <Button
              variant="outline"
              className="mt-4 glass border-0 hover:bg-white/20"
              onClick={() => setShowTapCard(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
      
      {showTapToStart && canPlayGames ? (
        <div 
          className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center gap-8 z-50 cursor-pointer animate-fade-in"
          onClick={() => {
            onPlay();
            setShowTapToStart(false);
          }}
        >
          <div className="animate-[pulse_1s_ease-in-out_infinite] text-green-500 text-2xl font-bold next-gen-title">
            TAP TO START
          </div>
        </div>
      ) : null}
      
      <div className="relative h-48 overflow-hidden">
        <img 
          src={thumbnail || placeholderImage}
          alt={title}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="glass border-0 p-6 space-y-4 backdrop-blur-xl">
        <h3 className="text-xl font-bold next-gen-title group-hover:text-orange-500 transition-colors duration-300">{title}</h3>
        <p className="text-sm text-gray-300 line-clamp-2 group-hover:text-white/90 transition-colors duration-300">{description}</p>
        <div className="flex justify-between text-sm text-gray-300">
          <span className="glass border-0 px-3 py-1 rounded-full text-xs backdrop-blur-sm bg-white/5">
            {genre}
          </span>
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            onClick={handlePlayButtonClick}
          >
            <Play className="w-4 h-4 mr-2" />
            PLAY GAME
          </Button>
        </div>
        {trailer && (
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full glass border-0 hover:bg-white/20 transition-all duration-300 group"
              >
                <Video className="w-4 h-4 mr-2 group-hover:text-orange-500" />
                Watch Trailer
              </Button>
            </DialogTrigger>
            <DialogContent className="glass border-white/10 sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle className="next-gen-title text-white">{title} - Trailer</DialogTitle>
              </DialogHeader>
              <div className="relative w-full h-0 pt-[56.25%]">
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  src={getYouTubeEmbedUrl(trailer)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
