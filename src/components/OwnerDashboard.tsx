
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import type { Game } from "@/types/game";

interface OwnerDashboardProps {
  onClose: () => void;
  onAddGame: (game: Game) => void;
}

const defaultGames: Omit<Game, "id" | "created_at" | "updated_at">[] = [
  {
    title: "Fruit Ninja VR",
    description: "Slice your way through a delicious lineup of fruits and compete for high scores.",
    genre: "Action",
    release_date: "2016-07-07",
    thumbnail: "/lovable-uploads/09374846-fe58-4998-868a-5691a68042c5.png",
    trailer: "https://www.youtube.com/watch?v=hPY4TRRHwZc",
    executable_path: "steam://rungameid/486780",
    status: "enabled"
  },
  {
    title: "Elven Assassin",
    description: "Defend your castle from hordes of orcs with your bow and arrow.",
    genre: "Action",
    release_date: "2016-12-01",
    thumbnail: "/lovable-uploads/0c397672-8051-4e6f-bb5b-36548c8d7381.png",
    trailer: "https://www.youtube.com/watch?v=D94cNMNyMy4",
    executable_path: "steam://rungameid/503770",
    status: "enabled"
  },
  {
    title: "Crisis Brigade 2 Reloaded",
    description: "Fast-paced VR shooting gallery game inspired by classic light gun games.",
    genre: "Action",
    release_date: "2020-05-21",
    thumbnail: "/lovable-uploads/1a1125bb-7f6a-42dd-a5f3-8a095ae5e5dd.png",
    trailer: "https://www.youtube.com/watch?v=pZHvTXD7QEw",
    executable_path: "steam://rungameid/1294750",
    status: "enabled"
  }
];

export function OwnerDashboard({ onClose }: OwnerDashboardProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [timerDuration, setTimerDuration] = useState(8);
  const { toast } = useToast();

  useEffect(() => {
    fetchGames();
    fetchSettings();
  }, []);

  const fetchGames = async () => {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('title');
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch games"
      });
      return;
    }

    if (!data || data.length === 0) {
      // Insert default games if no games exist
      for (const game of defaultGames) {
        const { error: insertError } = await supabase
          .from('games')
          .insert([game])
          .select();
        
        if (insertError) {
          toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to insert ${game.title}`
          });
        }
      }
      // Fetch games again after inserting defaults
      const { data: updatedData } = await supabase
        .from('games')
        .select('*')
        .order('title');
      
      setGames(updatedData as Game[]);
    } else {
      setGames(data as Game[]);
    }
  };

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('settings')
      .select('timer_duration')
      .eq('id', 'global')
      .single();
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch settings"
      });
      return;
    }

    if (data) {
      setTimerDuration(data.timer_duration);
    }
  };

  const handleGameStatusToggle = async (id: string, currentStatus: 'enabled' | 'disabled') => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    
    const { error } = await supabase
      .from('games')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update game status"
      });
      return;
    }

    setGames(prev => 
      prev.map(game => 
        game.id === id 
          ? { ...game, status: newStatus as 'enabled' | 'disabled' }
          : game
      )
    );

    const game = games.find(g => g.id === id);
    toast({
      title: "Success",
      description: `${game?.title} has been ${newStatus}`
    });
  };

  const handleTimerUpdate = async (value: number[]) => {
    setTimerDuration(value[0]);
    
    const { error } = await supabase
      .from('settings')
      .update({ timer_duration: value[0] })
      .eq('id', 'global');

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update timer duration"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Timer duration updated"
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Game Management</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Timer Settings</h3>
            <div className="space-y-2">
              <Label>Session Duration (minutes)</Label>
              <div className="flex items-center space-x-4">
                <Slider
                  value={[timerDuration]}
                  onValueChange={handleTimerUpdate}
                  min={1}
                  max={60}
                  step={1}
                  className="w-[300px]"
                />
                <span className="font-mono">{timerDuration} min</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Game Visibility</h3>
            <div className="space-y-4">
              {games.map((game) => (
                <div key={game.id} className="flex items-center justify-between p-4 bg-card rounded-lg border">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={game.thumbnail} 
                      alt={game.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="text-base font-medium">{game.title}</h4>
                      <p className="text-sm text-muted-foreground">{game.genre}</p>
                    </div>
                  </div>
                  <Switch
                    checked={game.status === 'enabled'}
                    onCheckedChange={() => handleGameStatusToggle(game.id, game.status)}
                  />
                </div>
              ))}
              {games.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No games found</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
