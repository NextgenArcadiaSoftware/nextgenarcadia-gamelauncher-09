import { Play, Clock, Video } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface GameCardProps {
  title: string;
  thumbnail: string;
  description: string;
  genre: string;
  releaseDate: string;
  trailer?: string;
  onPlay: (duration: number) => void;
}

export function GameCard({
  title,
  thumbnail,
  description,
  genre,
  releaseDate,
  trailer,
  onPlay,
}: GameCardProps) {
  return (
    <div className="game-card group">
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
                  Trailer
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
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="default" 
                size="sm" 
                className="w-full glass"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Game
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800">
              <DialogHeader>
                <DialogTitle>Select Play Duration</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 p-4">
                {[5, 10, 15, 20].map((duration) => (
                  <Button
                    key={duration}
                    onClick={() => {
                      onPlay(duration);
                      const dialog = document.querySelector('[role="dialog"]');
                      if (dialog) {
                        const closeButton = dialog.querySelector('[data-state="closed"]');
                        if (closeButton instanceof HTMLElement) {
                          closeButton.click();
                        }
                      }
                    }}
                    className="h-20 text-lg glass"
                  >
                    <Clock className="w-6 h-6 mr-2" />
                    {duration} mins
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}