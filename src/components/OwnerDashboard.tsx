
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface OwnerDashboardProps {
  onClose: () => void;
  onAddGame: (game: any) => void;
}

export function OwnerDashboard({ onClose }: OwnerDashboardProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Owner Dashboard</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Owner Dashboard is being rebuilt...</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
