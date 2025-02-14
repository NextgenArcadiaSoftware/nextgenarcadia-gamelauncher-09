
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
import type { Game } from "@/types/game";

interface AddGameDialogProps {
  onAddGame: (game: Omit<Game, "id" | "status" | "created_at" | "updated_at">) => void;
}

export function AddGameDialog({ onAddGame }: AddGameDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    release_date: "",
    thumbnail: "",
    trailer: "",
    executable_path: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddGame(formData);
    setOpen(false);
    setFormData({
      title: "",
      description: "",
      genre: "",
      release_date: "",
      thumbnail: "",
      trailer: "",
      executable_path: "",
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
              <Label htmlFor="release_date">Release Date</Label>
              <Input
                id="release_date"
                type="date"
                value={formData.release_date}
                onChange={(e) =>
                  setFormData({ ...formData, release_date: e.target.value })
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
            <Label htmlFor="executable_path">Steam Game ID or Executable Path</Label>
            <Input
              id="executable_path"
              type="text"
              placeholder="steam://rungameid/123456 or C:\Games\game.exe"
              value={formData.executable_path}
              onChange={(e) =>
                setFormData({ ...formData, executable_path: e.target.value })
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
