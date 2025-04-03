
import { useEffect, useState } from 'react';
import { useToast } from './ui/use-toast';
import { TimerDisplay } from './game-launch/TimerDisplay';
import { RatingScreen } from './game-launch/RatingScreen';
import { GameLaunchScreen } from './game-launch/GameLaunchScreen';
import { supabase } from '@/integrations/supabase/client';
import { sendKeyPress, closeGames } from '@/services/GameService';

interface RFIDCountdownProps {
  onExit: () => void;
  activeGame?: string | null;
  trailer?: string;  
  steamUrl?: string; // Support for direct Steam URLs
}

export function RFIDCountdown({ onExit, activeGame, trailer, steamUrl }: RFIDCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showRating, setShowRating] = useState(false);
  const [showGameScreen, setShowGameScreen] = useState(true);
  const [lastServerStatus, setLastServerStatus] = useState<number | null>(null);
  const [serverResponse, setServerResponse] = useState<string | null>(null);
  const { toast } = useToast();

  const isElectronAvailable = Boolean(window.electron);

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
          if (isMounted) setTimeLeft(5 * 60);
          throw error;
        }

        if (data && isMounted) {
          console.log('Setting initial timer duration:', data.timer_duration);
          setTimeLeft(data.timer_duration * 60);
        } else if (isMounted) {
          console.log('No timer data found, using default of 5 minutes');
          setTimeLeft(5 * 60);
        }
      } catch (error) {
        console.error('Error fetching timer duration:', error);
      }
    };

    fetchTimerDuration();

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
            setTimeLeft(newDuration * 60);
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

  const getGameCode = (gameTitle: string | null | undefined): string => {
    if (!gameTitle) return "XXX";
    
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
    if (!showGameScreen && timeLeft !== null) {
      if (steamUrl && isElectronAvailable) {
        console.log(`Launching Steam game with URL: ${steamUrl}`);
        window.electron.ipcRenderer.send('launch-steam-game', steamUrl);
      } 
      else if (targetWord && isElectronAvailable) {
        try {
          const keyMapping: Record<string, string> = {
            'EAX': 'e',
            'FNJ': 'f',
            'CBR': 'c',
            'AIO': 'v',
            'RPE': 'p',
            'IBC': 'i',
            'UDC': 'u',
            'ARS': 'a',
            'SBS': 's',
            'PVR': 'g'
          };
          
          const launchKey = keyMapping[targetWord];
          
          if (launchKey) {
            console.log(`Launching game with key: ${launchKey} for game: ${activeGame}`);
            
            // Use the GameService to send the key press
            sendKeyPress(launchKey)
              .then(result => {
                setLastServerStatus(result.status || 200);
                setServerResponse(result.message || `Successfully launched ${activeGame}`);
                
                toast({
                  title: "Game Launching",
                  description: `Launching ${activeGame}...`,
                });
                
                console.log('Game launch response:', result);
              })
              .catch(error => {
                console.error('Error launching game:', error);
                setServerResponse(`Error: ${error instanceof Error ? error.message : String(error)}`);
                
                toast({
                  variant: "destructive",
                  title: "Launch Error",
                  description: "Failed to connect to game launcher service"
                });
                
                if (window.electron) {
                  console.log("Falling back to Electron keypress simulation");
                  window.electron.ipcRenderer.send('simulate-keypress', launchKey);
                }
              });
          } else {
            console.log(`No launch key mapping found for game: ${activeGame}`);
          }
        } catch (error) {
          console.error('Error in game launch logic:', error);
        }
      } else if (!isElectronAvailable) {
        console.log('Electron API not available - in browser preview mode');
        toast({
          title: "Browser Preview Mode",
          description: "Game launch simulation - Electron APIs unavailable in browser",
          variant: "default"
        });
      }
    }
  }, [showGameScreen, timeLeft, targetWord, steamUrl, toast, isElectronAvailable, activeGame]);

  useEffect(() => {
    if (isElectronAvailable) {
      console.log('Setting up webhook stop timer listener');
      
      const handleWebhookStopTimer = (payload: any) => {
        console.log('Webhook stop timer received with payload:', payload);
        
        toast({
          title: "External Stop Command",
          description: "Timer stopped via webhook command",
        });
        
        setShowRating(true);
      };
      
      window.electron.ipcRenderer.on('webhook-stop-timer', handleWebhookStopTimer);
      
      return () => {
        window.electron.ipcRenderer.removeAllListeners('webhook-stop-timer');
      };
    }
  }, [toast, isElectronAvailable]);

  const handleRatingSubmit = async (rating: number) => {
    if (isElectronAvailable) {
      try {
        // Use the GameService to close the games
        const result = await closeGames(activeGame || undefined);
        console.log('Close games response:', result);
        
        setServerResponse(result.message || "Games closed successfully");
        
        toast({
          title: "Game Session Ended",
          description: "Closing all active games",
          variant: "default"
        });
      } catch (error) {
        console.error('Error closing games:', error);
        
        if (window.electron) {
          window.electron.ipcRenderer.send('end-game');
        }
      }
    }
    
    if (activeGame) {
      try {
        const { data: gameData } = await supabase
          .from('games')
          .select('id')
          .eq('title', activeGame)
          .single();

        if (gameData) {
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
    trailer: trailer
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

  if (timeLeft === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading timer settings...</div>
      </div>
    );
  }

  return (
    <>
      {serverResponse && (
        <div className="fixed top-24 right-8 z-50 bg-black/80 text-green-500 p-4 rounded-md font-mono max-w-md overflow-auto">
          {serverResponse}
        </div>
      )}
      
      <TimerDisplay
        timeLeft={timeLeft}
        activeGame={activeGame}
        onExit={() => {
          if (showGameScreen) {
            onExit();
          } else {
            setShowRating(true);
          }
        }}
      />
    </>
  );
}
