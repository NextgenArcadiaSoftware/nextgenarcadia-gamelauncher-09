
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { AddGameDialog } from "./AddGameDialog";
import { Link } from "react-router-dom";
import { Library, Timer, ActivitySquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useToast } from "./ui/use-toast";

interface Session {
  startTime: string;
  duration: number;
}

export function OwnerDashboard({ onClose, onTimerDurationChange }: { 
  onClose: () => void;
  onTimerDurationChange: (minutes: number) => void;
}) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pin, setPin] = useState("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [timerDuration, setTimerDuration] = useState(8);
  const { toast } = useToast();

  const OWNER_PIN = "123456"; // This should be stored securely in a real application

  useEffect(() => {
    // Load sessions from localStorage
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
      <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
        <div className="bg-card p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4">Owner Access</h2>
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter 6-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={6}
              pattern="\d{6}"
              required
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
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
      <div className="bg-card p-8 rounded-lg shadow-lg w-[800px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Owner Dashboard</h2>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        <Tabs defaultValue="sessions">
          <TabsList className="w-full">
            <TabsTrigger value="sessions" className="flex gap-2">
              <ActivitySquare className="w-4 h-4" />
              Sessions
            </TabsTrigger>
            <TabsTrigger value="games" className="flex gap-2">
              <Library className="w-4 h-4" />
              Games
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex gap-2">
              <Timer className="w-4 h-4" />
              Timer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sessions" className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Session History</h3>
            <div className="space-y-2">
              {sessions.map((session, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span>{new Date(session.startTime).toLocaleString()}</span>
                  <span>{session.duration} minutes</span>
                </div>
              ))}
              {sessions.length === 0 && (
                <p className="text-muted-foreground">No sessions recorded yet.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="games" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Game Management</h3>
              <div className="flex gap-2">
                <AddGameDialog onAddGame={() => {}} />
                <Link to="/library">
                  <Button variant="outline" className="flex gap-2">
                    <Library className="w-4 h-4" />
                    Library
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Timer Settings</h3>
            <div className="flex gap-4 items-center">
              <Input
                type="number"
                min="1"
                max="60"
                value={timerDuration}
                onChange={(e) => setTimerDuration(Number(e.target.value))}
                className="w-32"
              />
              <span>minutes</span>
              <Button onClick={handleTimerUpdate}>Update Timer</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
