import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { X, Power } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TimerDisplayProps {
  timeLeft: number;
  activeGame: string | null | undefined;
  onExit: () => void;
}

export function TimerDisplay({ timeLeft: initialTime, activeGame, onExit }: TimerDisplayProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const { toast } = useToast();

  useEffect(() => {
    // Reset the timer if initialTime changes
    setTimeLeft(initialTime);
    
    const interval = setInterval(async () => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          
          // Mark the session as completed when timer ends
          if (activeGame) {
            const markSessionComplete = async () => {
              try {
                // Get game ID first
                const { data: gameData } = await supabase
                  .from('games')
                  .select('id')
                  .eq('title', activeGame)
                  .single();

                if (gameData) {
                  // Update the latest session for this game as completed
                  await supabase
                    .from('game_sessions')
                    .update({ completed: true })
                    .eq('game_id', gameData.id)
                    .is('completed', false)
                    .order('created_at', { ascending: false })
                    .limit(1);
                }
              } catch (error) {
                console.error('Error marking session as completed:', error);
              }
            };
            
            markSessionComplete();
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [initialTime, activeGame]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAltF4 = () => {
    // Use the electron API to send Alt+F4 keystroke
    if (window.electron) {
      console.log('Sending Alt+F4 command to electron');
      window.electron.ipcRenderer.send('simulate-keypress', { key: 'F4', alt: true });
      toast({
        title: "Exiting game",
        description: "Sent Alt+F4 command to close the active application"
      });
    } else {
      console.error('Electron API not available');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not send Alt+F4 command - Electron API not available"
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#F97316] via-[#ea384c] to-[#FEC6A1] flex flex-col items-center justify-center z-50 animate-fade-in">
      <Button 
        variant="ghost" 
        className="absolute top-4 right-4 text-white hover:bg-white/20"
        onClick={onExit}
      >
        <X className="h-6 w-6" />
        Exit
      </Button>
      
      <div className="text-9xl font-mono mb-8 text-white animate-pulse tracking-widest">
        {formatTime(timeLeft)}
      </div>
      
      <div className="text-2xl text-white/90 mb-4 animate-fade-in">
        Time Remaining
      </div>
      
      {activeGame && (
        <div className="text-xl text-white/80 mb-8 animate-fade-in">
          Currently Playing: {activeGame}
        </div>
      )}

      <Button
        variant="destructive"
        size="lg"
        className="mt-8 px-8 py-6 text-xl font-bold flex items-center gap-3 hover:bg-red-800 transition-colors animate-pulse shadow-lg shadow-red-900/30"
        onClick={handleAltF4}
      >
        <Power className="h-6 w-6" />
        Alt+F4
      </Button>
    </div>
  );
}
