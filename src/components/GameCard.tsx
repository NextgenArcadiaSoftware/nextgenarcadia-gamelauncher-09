import { Play, Clock, Video } from "lucide-react";
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
import { useState, useEffect } from "react";

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
  const [isRFIDAuthorized, setIsRFIDAuthorized] = useState(false);

  useEffect(() => {
    const handleRFIDDetection = (_event: any, data: { uid: string, isAuthorized: boolean }) => {
      setIsRFIDAuthorized(data.isAuthorized);
      toast({
        title: data.isAuthorized ? "Access Granted" : "Access Denied",
        description: data.isAuthorized 
          ? "RFID card authorized. You can now launch games." 
          : "Unauthorized RFID card detected.",
        variant: data.isAuthorized ? "default" : "destructive"
      });
    };

    // @ts-ignore - electron is available in desktop environment
    if (window.electron) {
      // @ts-ignore
      window.electron.ipcRenderer.on('rfid-detected', handleRFIDDetection);
    }

    return () => {
      // @ts-ignore
      if (window.electron) {
        // @ts-ignore
        window.electron.ipcRenderer.removeListener('rfid-detected', handleRFIDDetection);
      }
    };
  }, [toast]);

  const handleStartGame = async () => {
    if (!executablePath) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No executable path specified for this game",
      });
      return;
    }

    if (!isRFIDAuthorized) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Please scan an authorized RFID card first",
      });
      return;
    }

    try {
      const isElectron = window.electron !== undefined;
      
      if (isElectron) {
        // @ts-ignore - electron is available in desktop environment
        window.electron.ipcRenderer.send('launch-game', executablePath);
      } else {
        console.log('Game launch attempted in non-Electron environment');
      }
      
      onPlay(8);

      toast({
        title: "Game Started",
        description: `${title} launched with 8 minute timer`,
      });

      setShowTapToStart(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to launch game",
      });
    }
  };

  const handlePlayButtonClick = () => {
    if (!isRFIDAuthorized) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Please scan an authorized RFID card first",
      });
      return;
    }
    setShowTapToStart(true);
  };

  return (
    <div className="game-card group transform transition-all duration-200 hover:scale-105">
      {showTapToStart ? (
        <div 
          className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center gap-8 z-50"
        >
          <div className="animate-[pulse_1s_ease-in-out_infinite] text-green-500 text-2xl font-bold next-gen-title">
            TAP TO START
          </div>
          <div className="flex items-center gap-2 text-green-500">
            <Clock className="w-5 h-5" />
            <span>Session time: 8 mins</span>
          </div>
          <Button
            variant="default"
            size="lg"
            className="mt-4 bg-green-600 hover:bg-green-700"
            onClick={handleStartGame}
          >
            <Play className="w-6 h-6 mr-2" />
            Launch Game
          </Button>
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
            className={`w-full glass ${!isRFIDAuthorized ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handlePlayButtonClick}
            disabled={!isRFIDAuthorized}
          >
            <Play className="w-4 h-4 mr-2" />
            Play Game
          </Button>
        </div>
      </div>
    </div>
  );
}