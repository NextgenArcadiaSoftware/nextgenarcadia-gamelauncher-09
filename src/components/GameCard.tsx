
import { Play, Clock, Video } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useToast } from "./ui/use-toast";
import { useState } from "react";

interface GameCardProps {
  title: string;
  thumbnail: string;
  description: string;
  genre: string;
  releaseDate: string;
  trailer?: string;
  executablePath?: string;
  onPlay: (duration: number) => void;
}

export function GameCard({
  title,
  thumbnail,
  description,
  genre,
  releaseDate,
  trailer,
  executablePath,
  onPlay,
}: GameCardProps) {
  const { toast } = useToast();
  const [showTapToStart, setShowTapToStart] = useState(false);

  const handleStartGame = async () => {
    if (!executablePath) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No executable path specified for this game",
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/launch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: executablePath })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Try to parse JSON, but don't fail if it's not JSON
      let data;
      try {
        data = await response.json();
      } catch (e) {
        // If response is not JSON, assume success if status was ok
        data = { status: "Launched" };
      }
      
      if (data.status === "Launched" || response.ok) {
        // Start the timer and notify parent component
        onPlay(8);
        
        toast({
          title: "Game Started",
          description: `${title} launched with 8 minute timer`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to launch game. Make sure the launcher app is running.",
        });
      }
    } catch (error) {
      console.error('Launch error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cannot connect to game launcher. Please make sure it's running.",
      });
    }
  };

  const handlePlayButtonClick = () => {
    setShowTapToStart(true);
  };

  return (
    <div className="game-card group transform transition-all duration-200 hover:scale-105">
      {showTapToStart ? (
        <div 
          className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center gap-8 z-50 cursor-pointer"
          onClick={handleStartGame}
        >
          <div className="animate-[pulse_1s_ease-in-out_infinite] text-green-500 text-2xl font-bold next-gen-title">
            TAP TO START
          </div>
          <div className="flex items-center gap-2 text-green-500">
            <Clock className="w-5 h-5" />
            <span>Session time: 8 mins</span>
          </div>
        </div>
      ) : null}
      
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-4 space-y-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
        <div className="flex justify-between text-sm text-gray-400">
          <span>{genre}</span>
          <span>{releaseDate}</span>
        </div>
        <div className="flex gap-2">
          {trailer && (
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full glass"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Watch Trailer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] bg-gray-900 border-gray-800">
                <DialogHeader>
                  <DialogTitle>{title} - Trailer</DialogTitle>
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
            className="w-full glass"
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
