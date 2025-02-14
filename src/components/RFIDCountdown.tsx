
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

  // Define game codes with EXACT 3-letter codes
  const gameCodeMap: Record<string, string> = {
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

  // Get the target code for the active game
  const targetCode = activeGame ? (gameCodeMap[activeGame] || '') : '';

  useEffect(() => {
    // Debug logging to track active game and target code
    if (activeGame) {
      console.log('Active game:', activeGame);
      console.log('Target code:', targetCode);
      console.log('Game codes available:', Object.keys(gameCodeMap));
    }
  }, [activeGame, targetCode]);

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

      toast({
        title: "✨ Game Starting",
        description: `${activeGame} is launching...`,
      });

      return () => clearInterval(interval);
    }
  }, [showTimer, activeGame, toast]);

  const handleKeyPress = (key: string) => {
    if (inputWord.length < targetCode.length) {
      const newInput = inputWord + key.toUpperCase(); // Convert to uppercase to match target code
      setInputWord(newInput);
      console.log('Current input:', newInput, 'Target:', targetCode);
    }
  };

  const handleBackspace = () => {
    setInputWord(prev => prev.slice(0, -1));
  };

  const handleEnter = () => {
    console.log('Comparing:', inputWord, 'with', targetCode);
    if (inputWord === targetCode) {
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
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-blue-800 to-blue-900 flex flex-col items-center justify-center z-50 animate-fade-in p-6">
      <GameLaunchHeader
        activeGame={activeGame}
        inputWord={inputWord}
        targetWord={targetCode}
      />
      
      <InputDisplay
        inputWord={inputWord}
        targetWord={targetCode}
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
