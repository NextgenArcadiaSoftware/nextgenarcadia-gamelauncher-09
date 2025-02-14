
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { RFIDCountdown } from "@/components/RFIDCountdown";
import { Header } from "@/components/Header";
import { CategoryBar } from "@/components/CategoryBar";
import { GameGrid } from "@/components/GameGrid";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { OwnerDashboard } from "@/components/OwnerDashboard";
import { AddGameDialog } from "@/components/AddGameDialog";
import { GameShowcase } from "@/components/GameShowcase";
import { supabase } from "@/integrations/supabase/client";
import type { Game } from "@/types/game";

const Index = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showRFIDCountdown, setShowRFIDCountdown] = useState(false);
  const [showOwnerDashboard, setShowOwnerDashboard] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(8);
  const [canPlayGames, setCanPlayGames] = useState(false);
  const { toast } = useToast();

  const categories = ["All", "Action", "FPS", "Horror", "Rhythm", "Survival"];

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setGames(data || []);
    } catch (error) {
      console.error('Error fetching games:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch games",
      });
    }
  };

  const handleAddGame = async (newGame: Omit<Game, "id" | "status" | "created_at" | "updated_at">) => {
    try {
      const { data, error } = await supabase
        .from('games')
        .insert([{ ...newGame, status: 'enabled' }])
        .select()
        .single();

      if (error) throw error;

      setGames(prevGames => [data, ...prevGames]);
      toast({
        title: "Game Added",
        description: "The game has been added to your library",
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

  const handlePlayGame = async (title: string, executablePath: string) => {
    if (!canPlayGames) {
      toast({
        variant: "destructive",
        title: "Session Required",
        description: "Please scan an RFID card to start a gaming session.",
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/launch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: executablePath })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Game Started",
        description: `${title} has been launched`,
      });
    } catch (error) {
      console.error('Launch error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to launch game. Please make sure the game launcher is running.",
      });
    }
  };

  const filteredGames = selectedCategory === "All" 
    ? games 
    : games.filter(game => game.genre === selectedCategory);

  const handleExitSession = () => {
    setShowRFIDCountdown(false);
    setCanPlayGames(false);
  };

  // RFID detection
  useEffect(() => {
    console.log('Setting up RFID key press listener');

    const handleRFIDSimulation = () => {
      console.log('RFID simulation triggered');
      setShowRFIDCountdown(true);
      setCanPlayGames(true);
      
      toast({
        title: "RFID Card Detected",
        description: `Starting ${sessionDuration} minute session...`,
      });
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (/^\d$/.test(event.key)) {
        handleRFIDSimulation();
      }
    };

    window.addEventListener('keypress', handleKeyPress);

    return () => {
      console.log('Removing RFID key press listener');
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [toast, sessionDuration]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F97316] via-[#D946EF] to-[#8B5CF6]">
      {showRFIDCountdown ? (
        <RFIDCountdown 
          onExit={handleExitSession}
          duration={sessionDuration}
        />
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          <div className="flex flex-col space-y-8">
            <div className="glass p-6 rounded-3xl flex justify-between items-center">
              <Header />
              <div className="flex gap-4">
                <AddGameDialog onAddGame={handleAddGame} />
                <Button
                  variant="outline"
                  className="glass border-0 hover:bg-white/20 flex gap-2"
                  onClick={() => setShowOwnerDashboard(true)}
                >
                  <Settings className="w-4 h-4" />
                  Owner Dashboard
                </Button>
              </div>
            </div>
            
            {/* Game Showcase */}
            <GameShowcase 
              games={games.slice(0, 3)} 
              onPlayGame={handlePlayGame}
              canPlayGames={canPlayGames}
            />

            <div className="glass p-8 rounded-3xl space-y-6">
              <h2 className="text-2xl font-bold text-white">Top Arcade Games</h2>
              <CategoryBar 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
              />
              <GameGrid 
                games={filteredGames}
                onPlayGame={handlePlayGame}
                canPlayGames={canPlayGames}
              />
            </div>
          </div>
        </div>
      )}

      {showOwnerDashboard && (
        <OwnerDashboard
          onClose={() => setShowOwnerDashboard(false)}
          onTimerDurationChange={setSessionDuration}
        />
      )}
    </div>
  );
};

export default Index;
