
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

  // Get the target word based on the active game
  const targetWord = activeGame === "Fruit Ninja VR" ? "FNJ" :
                    activeGame === "Richies Plank Experience" ? "RPE" :
                    activeGame === "Elven Assassin" ? "EAX" :
                    activeGame === "All-In-One Sports VR" ? "AIO" :
                    activeGame === "Crisis Brigade 2 Reloaded" ? "CBR" :
                    activeGame === "Undead Citadel" ? "UDC" :
                    activeGame === "Arizona Sunshine II" ? "ARS" :
                    activeGame === "iB Cricket" ? "IBC" :
                    activeGame === "Subside" ? "SBS" :
                    activeGame === "Propagation VR" ? "PVR" : "";

  // RFID Code detected simulation
  useEffect(() => {
    // Simulate RFID input (this would be replaced by actual RFID reader input)
    const rfidCode = "0014662252";
    console.log('RFID Code detected:', rfidCode);

    // Show toast when game starts
    if (activeGame) {
      toast({
        title: "✨ Launch Code Required",
        description: `Enter the code to start ${activeGame}`,
      });
    }
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
