
import { Button } from "./ui/button";
import { Settings } from "lucide-react";
import { useState } from "react";
import { OwnerDashboard } from "./OwnerDashboard";
import { PinVerification } from "./PinVerification";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function Header() {
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [showOwnerDashboard, setShowOwnerDashboard] = useState(false);
  const { toast } = useToast();

  const handleAddGame = async (game: any) => {
    try {
      const { data, error } = await supabase
        .from('games')
        .insert([
          { 
            ...game,
            status: 'enabled'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Game added successfully",
      });
    } catch (error) {
      console.error('Error adding game:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add game",
      });
    }
  };

  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-white next-gen-title">
          NextGen Arcadia
        </h1>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 hover:border-white/30"
        onClick={() => setShowPinDialog(true)}
      >
        <Settings className="h-4 w-4 text-white" />
      </Button>

      <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Owner Verification</DialogTitle>
          </DialogHeader>
          <PinVerification
            onSuccess={() => {
              setShowPinDialog(false);
              setShowOwnerDashboard(true);
            }}
            onCancel={() => setShowPinDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {showOwnerDashboard && (
        <OwnerDashboard
          onClose={() => setShowOwnerDashboard(false)}
          onAddGame={handleAddGame}
        />
      )}
    </div>
  );
}
