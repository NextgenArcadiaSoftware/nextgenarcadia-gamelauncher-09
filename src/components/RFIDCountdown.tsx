
import { useEffect, useState } from 'react';
import { useToast } from './ui/use-toast';
import { Delete } from 'lucide-react';
import { Button } from './ui/button';
import { GameLaunchHeader } from './game-launch/GameLaunchHeader';
import { InputDisplay } from './game-launch/InputDisplay';
import { VirtualKeyboard } from './game-launch/VirtualKeyboard';
import { TimerDisplay } from './game-launch/TimerDisplay';
import { RatingScreen } from './game-launch/RatingScreen';

interface RFIDCountdownProps {
  onExit: () => void;
  duration?: number;
  activeGame?: string | null;
}

export function RFIDCountdown({ onExit, duration = 8, activeGame }: RFIDCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [inputWord, setInputWord] = useState('');
  const [targetWord, setTargetWord] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set target word based on active game
    if (!activeGame) return;
    
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

    const code = gameCodeMap[activeGame];
    if (code) {
      setTargetWord(code);
    }
  }, [activeGame]);

  useEffect(() => {
    if (!showKeyboard) {
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
  }, [showKeyboard]);

  const handleKeyPress = (key: string) => {
    if (inputWord.length < targetWord.length) {
      const newInput = inputWord + key.toLowerCase();
      setInputWord(newInput);
      
      if (newInput.toLowerCase() === targetWord.toLowerCase()) {
        handleEnter();
      }
    }
  };

  const handleBackspace = () => {
    setInputWord(prev => prev.slice(0, -1));
  };

  const handleEnter = () => {
    if (inputWord.toLowerCase() === targetWord.toLowerCase()) {
      setShowKeyboard(false);
      toast({
        title: "✨ Game Starting",
        description: `${activeGame} is launching...`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "❌ Invalid Code",
        description: "The code doesn't match. Please try again.",
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

  if (showKeyboard) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#F97316] via-[#ea384c] to-[#FEC6A1] flex flex-col items-center justify-center z-50 animate-fade-in p-4">
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

        <Button
          variant="ghost"
          onClick={onExit}
          className="mt-8 text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2"
        >
          <Delete className="w-4 h-4" />
          Exit Session
        </Button>
      </div>
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
