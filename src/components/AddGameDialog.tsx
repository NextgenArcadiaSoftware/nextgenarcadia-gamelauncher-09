import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Plus } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface AddGameDialogProps {
  onAddGame: (game: {
    title: string;
    description: string;
    genre: string;
    releaseDate: string;
    thumbnail: string;
    trailer?: string;
    executablePath?: string;
  }) => void;
}

export function AddGameDialog({ onAddGame }: AddGameDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    releaseDate: "",
    thumbnail: "",
    trailer: "",
    executablePath: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddGame(formData);
    setOpen(false);
    toast({
      title: "Game Added",
      description: "The game has been added to your library",
    });
    setFormData({
      title: "",
      description: "",
      genre: "",
      releaseDate: "",
      thumbnail: "",
      trailer: "",
      executablePath: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="glass hover:bg-white/20">
          <Plus className="w-4 h-4 mr-2" />
          Add Game
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Game</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Input
                id="genre"
                value={formData.genre}
                onChange={(e) =>
                  setFormData({ ...formData, genre: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="releaseDate">Release Date</Label>
              <Input
                id="releaseDate"
                type="date"
                value={formData.releaseDate}
                onChange={(e) =>
                  setFormData({ ...formData, releaseDate: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail URL</Label>
            <Input
              id="thumbnail"
              type="url"
              value={formData.thumbnail}
              onChange={(e) =>
                setFormData({ ...formData, thumbnail: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="trailer">Trailer URL (Optional)</Label>
            <Input
              id="trailer"
              type="url"
              value={formData.trailer}
              onChange={(e) =>
                setFormData({ ...formData, trailer: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="executablePath">Executable Path</Label>
            <Input
              id="executablePath"
              type="text"
              placeholder="C:\Games\YourGame\game.exe"
              value={formData.executablePath}
              onChange={(e) =>
                setFormData({ ...formData, executablePath: e.target.value })
              }
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Add Game
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}