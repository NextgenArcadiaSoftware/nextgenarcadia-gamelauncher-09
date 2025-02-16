
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

interface OwnerDashboardProps {
  onClose: () => void;
  onAddGame: (game: any) => void;
}

export function OwnerDashboard({ onClose }: OwnerDashboardProps) {
  const [defaultGames, setDefaultGames] = useState<{ title: string; status: string }[]>([]);
  const [timerDuration, setTimerDuration] = useState(8);
  const { toast } = useToast();

  useEffect(() => {
    fetchGames();
    fetchSettings();
  }, []);

  const fetchGames = async () => {
    const { data, error } = await supabase
      .from('games')
      .select('title, status');
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch games"
      });
      return;
    }

    setDefaultGames(data || []);
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

  const handleGameStatusToggle = async (title: string, currentStatus: string) => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    
    const { error } = await supabase
      .from('games')
      .update({ status: newStatus })
      .eq('title', title);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update game status"
      });
      return;
    }

    setDefaultGames(prev => 
      prev.map(game => 
        game.title === title 
          ? { ...game, status: newStatus }
          : game
      )
    );

    toast({
      title: "Success",
      description: `${title} has been ${newStatus}`
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
              {defaultGames.map((game) => (
                <div key={game.title} className="flex items-center justify-between p-4 bg-card rounded-lg border">
                  <span className="text-base font-medium">{game.title}</span>
                  <Switch
                    checked={game.status === 'enabled'}
                    onCheckedChange={() => handleGameStatusToggle(game.title, game.status)}
                  />
                </div>
              ))}
              {defaultGames.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No games found</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
