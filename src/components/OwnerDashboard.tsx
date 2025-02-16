
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

    setGames(data || []);
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

  const handleGameStatusToggle = async (id: string, currentStatus: string) => {
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
          ? { ...game, status: newStatus }
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
