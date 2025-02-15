
import { useEffect, useState } from 'react';
import { useToast } from './ui/use-toast';
import { TimerDisplay } from './game-launch/TimerDisplay';
import { RatingScreen } from './game-launch/RatingScreen';

interface RFIDCountdownProps {
  onExit: () => void;
  duration?: number;
  activeGame?: string | null;
}

export function RFIDCountdown({ onExit, duration = 8, activeGame }: RFIDCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [showRating, setShowRating] = useState(false);
  const { toast } = useToast();

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
        title: "✨ Starting Game",
        description: `Launching ${activeGame}`,
      });
    }
  }, [activeGame, toast]);

  useEffect(() => {
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
  }, [targetWord]);

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

  if (showRating) {
    return <RatingScreen activeGame={activeGame} onSubmit={handleRatingSubmit} />;
  }

  return (
    <TimerDisplay
      timeLeft={timeLeft}
      activeGame={activeGame}
      onExit={onExit}
    />
  );
}
