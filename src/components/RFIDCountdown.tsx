
import { useEffect, useState } from 'react';
import { useToast } from './ui/use-toast';
import { TimerDisplay } from './game-launch/TimerDisplay';
import { RatingScreen } from './game-launch/RatingScreen';
import { VirtualKeyboard } from './game-launch/VirtualKeyboard';
import { InputDisplay } from './game-launch/InputDisplay';
import { GameLaunchHeader } from './game-launch/GameLaunchHeader';

interface RFIDCountdownProps {
  onExit: () => void;
  duration?: number;
  activeGame?: string | null;
}

export function RFIDCountdown({ onExit, duration = 8, activeGame }: RFIDCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [showRating, setShowRating] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [inputWord, setInputWord] = useState('');
  const { toast } = useToast();

  // Convert game title to launch code
  const getGameCode = (gameTitle: string | null | undefined): string => {
    if (!gameTitle) return "XXX";
    
    // These codes must match exactly with the Python backend GAMES dictionary
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
        title: "✨ Launch Code Required",
        description: `Enter the code ${targetWord} to start ${activeGame}`,
      });
    }
  }, [activeGame, toast, targetWord]);

  useEffect(() => {
    if (showTimer) {
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
  }, [showTimer, targetWord]);

  const handleKeyPress = (key: string) => {
    if (inputWord.length < 3) {
      setInputWord(prev => prev + key);
    }
  };

  const handleBackspace = () => {
    setInputWord(prev => prev.slice(0, -1));
  };

  const handleEnter = () => {
    if (inputWord === targetWord) {
      toast({
        title: "✨ Code Accepted",
        description: "Launching game...",
      });
      setShowTimer(true);
    } else {
      toast({
        title: "❌ Invalid Code",
        description: "Please try again",
        variant: "destructive",
      });
      setInputWord('');
    }
  };

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

  if (showTimer) {
    return (
      <TimerDisplay
        timeLeft={timeLeft}
        activeGame={activeGame}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="fixed inset-0 animate-gradient flex flex-col items-center justify-center z-50 p-6" 
         style={{
           background: 'linear-gradient(225deg, #F97316 0%, #D946EF 50%, #8B5CF6 100%)',
           backgroundSize: '400% 400%'
         }}>
      <GameLaunchHeader
        activeGame={activeGame}
        inputWord={inputWord}
        targetWord={targetWord}
      />
      
      <InputDisplay
        inputWord={inputWord}
        targetWord={targetWord}
      />
      
      <VirtualKeyboard
        inputWord={inputWord}
        onKeyPress={handleKeyPress}
        onBackspace={handleBackspace}
        onEnter={handleEnter}
      />
    </div>
  );
}
