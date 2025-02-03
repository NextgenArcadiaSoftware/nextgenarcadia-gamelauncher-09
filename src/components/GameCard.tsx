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
        className="w-full h-48 object-cover rounded-t-2xl"
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
                <Button variant="outline" size="sm" className="w-full">
                  <Video className="w-4 h-4 mr-2" />
                  Trailer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>{title} - Trailer</DialogTitle>
                </DialogHeader>
                <video controls className="w-full rounded-lg">
                  <source src={trailer} type="video/mp4" />
                </video>
              </DialogContent>
            </Dialog>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Play
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select Play Duration</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 p-4">
                {[5, 10, 15, 20].map((duration) => (
                  <Button
                    key={duration}
                    onClick={() => onPlay(duration)}
                    className="h-20 text-lg"
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