
import { useEffect, useState } from 'react';
import { useToast } from './ui/use-toast';
import { TimerDisplay } from './game-launch/TimerDisplay';
import { RatingScreen } from './game-launch/RatingScreen';
import { GameLaunchScreen } from './game-launch/GameLaunchScreen';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';

interface RFIDCountdownProps {
  onExit: () => void;
  activeGame?: string | null;
  trailer?: string;  
}

export function RFIDCountdown({ onExit, activeGame, trailer }: RFIDCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showRating, setShowRating] = useState(false);
  const [showGameScreen, setShowGameScreen] = useState(true);
  const { toast } = useToast();
  const location = useLocation();

  // Handle RFID card inputs on launch pages
  useEffect(() => {
    const handleRFIDInput = (event: KeyboardEvent) => {
      const isLaunchPage = location.pathname.toLowerCase().includes('launch');
      
      // If this is a digit (RFID input) and we're already on a launch page, refresh
      if (/^\d$/.test(event.key) && isLaunchPage && !showGameScreen) {
        console.log("RFID card presented during active game session, refreshing page");
        window.location.reload();
      }
    };
    
    window.addEventListener('keypress', handleRFIDInput);
    return () => window.removeEventListener('keypress', handleRFIDInput);
  }, [location.pathname, showGameScreen]);

  // Initial timer duration fetch and subscription setup
  useEffect(() => {
    let isMounted = true;

    const fetchTimerDuration = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('timer_duration')
          .eq('id', 'global')
          .single();

        if (error) {
          console.error('Error fetching timer duration:', error);
          // Set a default value if fetching fails
          if (isMounted) setTimeLeft(5 * 60); // 5 minutes in seconds
          throw error;
        }

        if (data && isMounted) {
          console.log('Setting initial timer duration:', data.timer_duration);
          setTimeLeft(data.timer_duration * 60); // Convert minutes to seconds
        } else if (isMounted) {
          // Set a default value if no data
          console.log('No timer data found, using default of 5 minutes');
          setTimeLeft(5 * 60); // 5 minutes in seconds
        }
      } catch (error) {
        console.error('Error fetching timer duration:', error);
      }
    };

    fetchTimerDuration(); // Make sure to call the function

    // Set up real-time subscription for timer updates
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
          if (isMounted) {
            const newDuration = payload.new.timer_duration;
            console.log('Received new timer duration:', newDuration);
            setTimeLeft(newDuration * 60); // Convert minutes to seconds
            toast({
              title: "Timer Updated",
              description: `Session time updated to ${newDuration} minutes`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [toast]);

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
    if (!showGameScreen && timeLeft !== null && targetWord) {
      // When timer starts, simulate typing the launch code for the Python backend
      if (window.electron) {
        targetWord.split('').forEach((char, index) => {
          setTimeout(() => {
            window.electron?.ipcRenderer.send('simulate-keypress', char);
          }, index * 100); // Type each character with a small delay
        });
      }
    }
  }, [showGameScreen, timeLeft, targetWord]);

  const handleRatingSubmit = async (rating: number) => {
    // When exiting, send the stop command to the Python backend
    if (window.electron) {
      window.electron.ipcRenderer.send('stop-game', targetWord);
    }
    
    if (activeGame) {
      try {
        // Get game ID first
        const { data: gameData } = await supabase
          .from('games')
          .select('id')
          .eq('title', activeGame)
          .single();

        if (gameData) {
          // Record the rating
          await supabase
            .from('game_ratings')
            .insert({
              game_id: gameData.id,
              rating
            });
        }
      } catch (error) {
        console.error('Error recording game rating:', error);
      }
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
    genre: 'VR Game',
    trailer: trailer // Pass the trailer to the game data
  };

  if (showRating) {
    return <RatingScreen activeGame={activeGame} onSubmit={handleRatingSubmit} />;
  }

  if (showGameScreen) {
    return (
      <GameLaunchScreen 
        game={gameData}
        onContinue={() => setShowGameScreen(false)}
      />
    );
  }

  // Show loading state if timer hasn't been fetched yet
  if (timeLeft === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading timer settings...</div>
      </div>
    );
  }

  return (
    <TimerDisplay
      timeLeft={timeLeft}
      activeGame={activeGame}
      onExit={() => {
        // We'll show the rating screen when the timer is complete
        // otherwise we'll just exit directly
        if (showGameScreen) {
          onExit();
        } else {
          setShowRating(true);
        }
      }}
    />
  );
}
