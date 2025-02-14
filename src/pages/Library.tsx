
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { Library as LibraryIcon, ArrowLeft, Trash2 } from "lucide-react";
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

const Library = () => {
  const [games, setGames] = useState<Game[]>([]);
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex flex-col space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center glass p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon" className="glass">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <LibraryIcon className="w-6 h-6" />
              <h1 className="text-xl font-bold">Game Library</h1>
            </div>
          </div>

          {/* Game List */}
          <div className="space-y-4">
            {games.map((game) => (
              <div
                key={game.id}
                className="glass p-4 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div>
                    <h3 className="font-bold">{game.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {game.genre} • {new Date(game.release_date).getFullYear()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={game.status === 'enabled'}
                      onCheckedChange={() => handleToggleGame(game.id)}
                    />
                    <span className="text-sm">
                      {game.status === 'enabled' ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Game</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {game.title}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
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
            {games.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No games in your library yet. Add some games to get started!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
