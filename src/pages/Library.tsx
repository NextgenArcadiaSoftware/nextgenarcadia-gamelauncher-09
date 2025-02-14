import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { Library as LibraryIcon, ArrowLeft, Trash2, Search, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Game } from "@/types/game";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Library = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGames(data as Game[]);
    } catch (error) {
      console.error('Error fetching games:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch games",
      });
    }
  };

  const handleToggleGame = async (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    const newStatus = game?.status === 'enabled' ? 'disabled' as const : 'enabled' as const;

    try {
      const { error } = await supabase
        .from('games')
        .update({ status: newStatus })
        .eq('id', gameId);

      if (error) throw error;

      setGames(prevGames =>
        prevGames.map(game =>
          game.id === gameId
            ? { ...game, status: newStatus }
            : game
        )
      );

      toast({
        title: `Game ${newStatus === 'enabled' ? 'Enabled' : 'Disabled'}`,
        description: `${game?.title} has been ${newStatus === 'enabled' ? 'enabled' : 'disabled'}.`,
      });
    } catch (error) {
      console.error('Error updating game:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update game status",
      });
    }
  };

  const handleDeleteGame = async (gameId: string) => {
    try {
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', gameId);

      if (error) throw error;

      setGames(prevGames => prevGames.filter(game => game.id !== gameId));
      toast({
        title: "Game Deleted",
        description: "The game has been removed from your library",
      });
    } catch (error) {
      console.error('Error deleting game:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete game",
      });
    }
  };

  const handleEditGame = async (game: Game) => {
    try {
      const { error } = await supabase
        .from('games')
        .update({
          title: game.title,
          description: game.description,
          genre: game.genre,
          release_date: game.release_date,
          thumbnail: game.thumbnail,
          trailer: game.trailer,
          executable_path: game.executable_path,
        })
        .eq('id', game.id);

      if (error) throw error;

      setGames(prevGames =>
        prevGames.map(g =>
          g.id === game.id ? game : g
        )
      );

      setEditingGame(null);
      toast({
        title: "Game Updated",
        description: "The game has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating game:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update game",
      });
    }
  };

  const filteredGames = games.filter(game => 
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-8">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center glass p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/10">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <LibraryIcon className="w-6 h-6" />
                <h1 className="text-xl font-bold">Game Library</h1>
              </div>
            </div>
            <div className="relative w-64">
              <Input
                type="search"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl pl-10 bg-white/10 border-white/10 focus:border-white/20"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
            </div>
          </div>

          {/* Game List */}
          <div className="space-y-4">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className="glass p-6 rounded-2xl flex items-center justify-between group hover:bg-white/5 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{game.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {game.genre} • {new Date(game.release_date).getFullYear()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={game.status === 'enabled'}
                      onCheckedChange={() => handleToggleGame(game.id)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {game.status === 'enabled' ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <Dialog onOpenChange={(open) => !open && setEditingGame(null)}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
                        onClick={() => setEditingGame(game)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass border-white/10 sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Game</DialogTitle>
                      </DialogHeader>
                      {editingGame && (
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          handleEditGame(editingGame);
                        }} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                              id="title"
                              value={editingGame.title}
                              onChange={(e) =>
                                setEditingGame({ ...editingGame, title: e.target.value })
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={editingGame.description}
                              onChange={(e) =>
                                setEditingGame({ ...editingGame, description: e.target.value })
                              }
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="genre">Genre</Label>
                              <Input
                                id="genre"
                                value={editingGame.genre}
                                onChange={(e) =>
                                  setEditingGame({ ...editingGame, genre: e.target.value })
                                }
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="release_date">Release Date</Label>
                              <Input
                                id="release_date"
                                type="date"
                                value={editingGame.release_date}
                                onChange={(e) =>
                                  setEditingGame({ ...editingGame, release_date: e.target.value })
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
                              value={editingGame.thumbnail}
                              onChange={(e) =>
                                setEditingGame({ ...editingGame, thumbnail: e.target.value })
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="trailer">Trailer URL (Optional)</Label>
                            <Input
                              id="trailer"
                              type="url"
                              value={editingGame.trailer || ''}
                              onChange={(e) =>
                                setEditingGame({ ...editingGame, trailer: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="executable_path">Steam Game ID or Executable Path</Label>
                            <Input
                              id="executable_path"
                              type="text"
                              placeholder="steam://rungameid/123456 or C:\Games\game.exe"
                              value={editingGame.executable_path || ''}
                              onChange={(e) =>
                                setEditingGame({ ...editingGame, executable_path: e.target.value })
                              }
                              required
                            />
                          </div>
                          <Button type="submit" className="w-full">
                            Save Changes
                          </Button>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass border-white/10">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Game</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {game.title}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/10 hover:bg-white/20">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => handleDeleteGame(game.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
            {filteredGames.length === 0 && (
              <div className="text-center py-12 text-muted-foreground glass rounded-2xl">
                {searchQuery ? (
                  <>No games found matching your search.</>
                ) : (
                  <>No games in your library yet. Add some games to get started!</>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
