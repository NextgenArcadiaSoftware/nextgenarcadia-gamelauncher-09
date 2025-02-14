
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

  // RFID Code detected simulation
  useEffect(() => {
    // Simulate RFID input (this would be replaced by actual RFID reader input)
    const rfidCode = "0014662252";
    console.log('RFID Code detected:', rfidCode);

    // Show toast when game starts
    toast({
      title: "✨ Game Starting",
      description: `${activeGame} is launching...`,
    });
  }, [activeGame, toast]);

  // Timer countdown
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

      return () => clearInterval(interval);
    }
  }, [showTimer]);

  const handleKeyPress = (key: string) => {
    if (inputWord.length < targetWord.length) {
      setInputWord(prev => prev + key);
    }
  };

  const handleBackspace = () => {
    setInputWord(prev => prev.slice(0, -1));
  };

  const handleEnter = () => {
    if (inputWord.toLowerCase() === targetWord.toLowerCase()) {
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

  // Game-specific launch codes
  const targetWord = activeGame === "Fruit Ninja VR" ? "NINJA" :
                    activeGame === "Richies Plank Experience" ? "PLANK" :
                    activeGame === "Elven Assassin" ? "ELVEN" :
                    activeGame === "All-in-One Sports VR" ? "SPORTS" :
                    activeGame === "Crisis Brigade 2 Reloaded" ? "CRISIS" :
                    activeGame === "Undead Citadel" ? "CITADEL" :
                    activeGame === "Arizona Sunshine" ? "ARIZONA" :
                    activeGame === "iB Cricket" ? "CRICKET" :
                    activeGame === "Subside" ? "SUBSIDE" :
                    activeGame === "Propagation VR" ? "PROP" : "";

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
