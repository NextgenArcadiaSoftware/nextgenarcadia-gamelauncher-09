
import { useEffect, useState } from 'react';
import { useToast } from './ui/use-toast';
import { TimerDisplay } from './game-launch/TimerDisplay';
import { RatingScreen } from './game-launch/RatingScreen';
import { GameLaunchScreen } from './game-launch/GameLaunchScreen';
import { supabase } from '@/integrations/supabase/client';

interface RFIDCountdownProps {
  onExit: () => void;
  duration?: number;
  activeGame?: string | null;
}

export function RFIDCountdown({ onExit, duration = 8, activeGame }: RFIDCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [showRating, setShowRating] = useState(false);
  const [showLaunchScreen, setShowLaunchScreen] = useState(true);
  const { toast } = useToast();

  // Set up real-time subscription to timer changes
  useEffect(() => {
    const channel = supabase
      .channel('settings_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'settings',
          filter: 'id=eq.global'
        },
        (payload) => {
          const newDuration = payload.new.timer_duration;
          setTimeLeft(newDuration * 60);
          toast({
            title: "Timer Updated",
            description: `Session time updated to ${newDuration} minutes`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  // Initial timer duration fetch
  useEffect(() => {
    const fetchTimerDuration = async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('timer_duration')
        .eq('id', 'global')
        .single();

      if (error) {
        console.error('Error fetching timer duration:', error);
        return;
      }

      if (data) {
        setTimeLeft(data.timer_duration * 60);
      }
    };

    fetchTimerDuration();
  }, []);

  // Convert game title to launch code
  const getGameCode = (gameTitle: string | null | undefined): string => {
    if (!gameTitle) return "XXX";
    
    // These codes match exactly with the Python backend GAMES dictionary
    const codeMap: Record<string, string> = {
      "Elven Assassin": "EAX",
      "Fruit Ninja VR": "FNJ",
      "Crisis Brigade 2 Reloaded": "CBR",
      "All-in-One Sports VR": "AIO",
      "Richies Plank Experience": "RPE",
      "iB Cricket": "IBC",
      "Undead Citadel": "UDC",
      "Arizona Sunshine": "ARS",
      "Subside": "SBS",
      "Propagation VR": "PVR"
    };
    
    return codeMap[gameTitle] || "XXX";
  };

  const targetWord = getGameCode(activeGame);

  useEffect(() => {
    if (activeGame) {
      toast({
        title: "✨ RFID Detected",
        description: `Getting ${activeGame} ready...`,
      });
    }
  }, [activeGame, toast]);

  useEffect(() => {
    if (!showLaunchScreen) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setShowRating(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // When timer starts, simulate typing the launch code for the Python backend
      if (window.electron) {
        targetWord.split('').forEach((char, index) => {
          setTimeout(() => {
            window.electron?.ipcRenderer.send('simulate-keypress', char);
          }, index * 100); // Type each character with a small delay
        });
      }

      return () => clearInterval(interval);
    }
  }, [showLaunchScreen, targetWord]);

  const handleRatingSubmit = (rating: number) => {
    // When exiting, send the stop command to the Python backend
    if (window.electron) {
      window.electron.ipcRenderer.send('stop-game', targetWord);
    }
    
    toast({
      title: "Thank You!",
      description: `You rated ${activeGame} ${rating} stars.`,
    });
    onExit();
  };

  const gameData = {
    title: activeGame || 'Unknown Game',
    description: activeGame ? `Get ready to experience ${activeGame} in virtual reality!` : '',
    thumbnail: `/lovable-uploads/${activeGame?.toLowerCase().replace(/\s+/g, '-')}.png`,
    genre: 'VR Game'
  };

  if (showRating) {
    return <RatingScreen activeGame={activeGame} onSubmit={handleRatingSubmit} />;
  }

  if (showLaunchScreen) {
    return (
      <GameLaunchScreen 
        game={gameData}
        onContinue={() => setShowLaunchScreen(false)}
      />
    );
  }

  return (
    <TimerDisplay
      timeLeft={timeLeft}
      activeGame={activeGame}
      onExit={onExit}
    />
  );
}
