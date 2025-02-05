
import { Clock } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "./ui/dialog";
import { useToast } from "./ui/use-toast";

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
      // Use electron's IPC to launch the game
      // @ts-ignore - electron is available in desktop environment
      window.electron.ipcRenderer.send('launch-game', executablePath);
      
      // Start the timer and notify parent component with 8 minutes duration
      onPlay(8);

      toast({
        title: "Game Started",
        description: `${title} launched with 8 minute timer`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to launch game",
      });
    }
  };

  return (
    <div 
      className="game-card group cursor-pointer transform transition-all duration-200 hover:scale-105"
      onClick={handleStartGame}
    >
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
        <div className="flex items-center justify-center gap-2 text-green-500">
          <Clock className="w-5 h-5" />
          <span>Tap to play (8 mins)</span>
        </div>
      </div>
    </div>
  );
}
