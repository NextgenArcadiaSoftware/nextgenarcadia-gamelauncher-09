
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
    launch_code: "", // Added launch_code field
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.title || !formData.description || !formData.genre || !formData.release_date) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields"
      });
      return;
    }
    
    // If no thumbnail is provided, use a placeholder
    const gameData = {
      ...formData,
      thumbnail: formData.thumbnail || "/placeholder.svg"
    };
    
    onAddGame(gameData);
    setOpen(false);
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      genre: "",
      release_date: "",
      thumbnail: "",
      trailer: "",
      executable_path: "",
      launch_code: "",
    });
    
    toast({
      title: "Game added",
      description: `${formData.title} has been added to your library.`
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
      <DialogContent className="sm:max-w-[425px] glass border-white/10">
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
              className="bg-white/10 border-white/20"
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
              className="bg-white/10 border-white/20 min-h-[100px]"
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
                className="bg-white/10 border-white/20"
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
                className="bg-white/10 border-white/20"
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
              placeholder="/placeholder.svg"
              className="bg-white/10 border-white/20"
            />
            <p className="text-xs text-gray-400">Leave empty to use default placeholder</p>
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
              placeholder="https://www.youtube.com/watch?v=..."
              className="bg-white/10 border-white/20"
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
              className="bg-white/10 border-white/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="launch_code">Launch Code (Optional)</Label>
            <Input
              id="launch_code"
              type="text"
              placeholder="GAME"
              value={formData.launch_code}
              onChange={(e) =>
                setFormData({ ...formData, launch_code: e.target.value })
              }
              className="bg-white/10 border-white/20"
            />
            <p className="text-xs text-gray-400">Short code for launching the game (e.g., NINJA for Fruit Ninja)</p>
          </div>
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
            Add Game
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
