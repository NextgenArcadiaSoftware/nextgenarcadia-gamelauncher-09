
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface OwnerDashboardProps {
  onClose: () => void;
  onAddGame: (game: any) => void;
}

export function OwnerDashboard({ onClose }: OwnerDashboardProps) {
  const [defaultGames, setDefaultGames] = useState<{ title: string; status: string }[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchGames();
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

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Game Management</DialogTitle>
        </DialogHeader>
        
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
      </DialogContent>
    </Dialog>
  );
}
