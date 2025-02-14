
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

interface GameCardProps {
  title: string;
  thumbnail: string;
  description: string;
  genre: string;
  release_date: string; // Changed from releaseDate to release_date
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
  const [showTapToStart, setShowTapToStart] = useState(false);

  const handlePlayButtonClick = () => {
    if (canPlayGames) {
      setShowTapToStart(true);
    } else {
      onPlay();
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105">
      {showTapToStart ? (
        <div 
          className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center gap-8 z-50 cursor-pointer"
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
      
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="glass border-0 p-6 space-y-4">
        <h3 className="text-xl font-bold next-gen-title">{title}</h3>
        <p className="text-sm text-gray-300">{description}</p>
        <div className="flex justify-between text-sm text-gray-300">
          <span className="glass border-0 px-3 py-1 rounded-full text-xs">
            {genre}
          </span>
          <span className="glass border-0 px-3 py-1 rounded-full text-xs">
            {new Date(release_date).toLocaleDateString()}
          </span>
        </div>
        <div className="flex gap-2">
          {trailer && (
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full glass border-0 hover:bg-white/20"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Watch Trailer
                </Button>
              </DialogTrigger>
              <DialogContent className="glass border-white/10 sm:max-w-[800px]">
                <DialogHeader>
                  <DialogTitle className="next-gen-title">{title} - Trailer</DialogTitle>
                </DialogHeader>
                <iframe
                  className="w-full aspect-video rounded-lg"
                  src={trailer.replace('watch?v=', 'embed/')}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </DialogContent>
            </Dialog>
          )}
          <Button 
            variant="default" 
            size="sm" 
            className="w-full glass border-0 hover:bg-white/20"
            onClick={handlePlayButtonClick}
          >
            <Play className="w-4 h-4 mr-2" />
            Play Game
          </Button>
        </div>
      </div>
    </div>
  );
}
