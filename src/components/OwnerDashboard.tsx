
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { AddGameDialog } from "./AddGameDialog";
import { Link } from "react-router-dom";
import { Library, Timer, ActivitySquare, LucideIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useToast } from "./ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import type { Game } from "@/types/game";

interface Session {
  startTime: string;
  duration: number;
}

interface TabItem {
  value: string;
  label: string;
  icon: LucideIcon;
}

export function OwnerDashboard({ 
  onClose, 
  onTimerDurationChange,
  onAddGame 
}: { 
  onClose: () => void;
  onTimerDurationChange: (minutes: number) => void;
  onAddGame: (game: Omit<Game, "id" | "status" | "created_at" | "updated_at">) => void;
}) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pin, setPin] = useState("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [timerDuration, setTimerDuration] = useState(8);
  const { toast } = useToast();

  const OWNER_PIN = "123456"; // This should be stored securely in a real application

  const tabs: TabItem[] = [
    { value: "sessions", label: "Sessions", icon: ActivitySquare },
    { value: "games", label: "Games", icon: Library },
    { value: "settings", label: "Timer", icon: Timer },
  ];

  useEffect(() => {
    const savedSessions = localStorage.getItem("rfid_sessions");
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === OWNER_PIN) {
      setIsAuthorized(true);
      toast({
        title: "Access Granted",
        description: "Welcome to the owner dashboard",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect PIN",
        variant: "destructive",
      });
    }
  };

  const handleTimerUpdate = () => {
    onTimerDurationChange(timerDuration);
    toast({
      title: "Timer Updated",
      description: `Session duration set to ${timerDuration} minutes`,
    });
  };

  if (!isAuthorized) {
    return (
      <Dialog open={true} onOpenChange={() => onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Owner Access</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Enter your 6-digit PIN to access the owner dashboard.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter 6-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={6}
              pattern="\d{6}"
              required
              className="text-center text-2xl tracking-widest"
            />
            <div className="flex gap-2">
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="outline" onClick={onClose} className="w-full">
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Owner Dashboard</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Manage your arcade settings and view session history.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="sessions" className="w-full">
          <TabsList className="w-full grid grid-cols-3 gap-4">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 py-3"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="sessions" className="space-y-4 mt-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Session History</h3>
              <div className="space-y-3">
                {sessions.map((session, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    <span className="text-sm">
                      {new Date(session.startTime).toLocaleString()}
                    </span>
                    <span className="font-medium text-primary">
                      {session.duration} minutes
                    </span>
                  </div>
                ))}
                {sessions.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">
                    No sessions recorded yet.
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="games" className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Game Management</h3>
              <div className="flex gap-2">
                <AddGameDialog onAddGame={onAddGame} />
                <Link to="/library">
                  <Button variant="outline" className="flex gap-2">
                    <Library className="w-4 h-4" />
                    Library
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 mt-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Timer Settings</h3>
              <div className="flex gap-4 items-center">
                <Input
                  type="number"
                  min="1"
                  max="60"
                  value={timerDuration}
                  onChange={(e) => setTimerDuration(Number(e.target.value))}
                  className="w-32"
                />
                <span className="text-muted-foreground">minutes</span>
                <Button onClick={handleTimerUpdate}>Update Timer</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
