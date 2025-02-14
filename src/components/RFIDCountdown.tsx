
import { useEffect, useState } from 'react';
import { useToast } from './ui/use-toast';
import { Delete } from 'lucide-react';
import { Button } from './ui/button';
import { GameLaunchHeader } from './game-launch/GameLaunchHeader';
import { InputDisplay } from './game-launch/InputDisplay';
import { VirtualKeyboard } from './game-launch/VirtualKeyboard';
import { TimerDisplay } from './game-launch/TimerDisplay';

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
  const { toast } = useToast();

  useEffect(() => {
    if (activeGame) {
      const gameWord = activeGame === "All-In-One Sports VR" ? "start_sports" :
                      activeGame === "Fruit Ninja VR" ? "start_ninja" :
                      activeGame === "Crisis Brigade 2 Reloaded" ? "start_crisis" :
                      activeGame === "Richies Plank Experience" ? "start_plank" :
                      activeGame === "iB Cricket" ? "start_cricket" :
                      activeGame === "Undead Citadel" ? "start_citadel" :
                      activeGame === "Arizona Sunshine" ? "start_arizona" :
                      activeGame === "Subside" ? "start_subside" :
                      activeGame === "Propagation VR" ? "start_prop" :
                      activeGame === "Elven Assassin" ? "start_elven" :
                      "start_game";
      console.log('Setting target word:', gameWord, 'for game:', activeGame);
      setTargetWord(gameWord);
    }
  }, [activeGame]);

  useEffect(() => {
    if (!showKeyboard) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            toast({
              title: "Session Ended",
              description: `Your ${duration}-minute session has ended.${activeGame ? ` ${activeGame} will close automatically.` : ''}`,
            });
            onExit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [showKeyboard, onExit, toast, duration, activeGame]);

  const handleKeyPress = (key: string) => {
    console.log('Key pressed:', key);
    if (inputWord.length < targetWord.length) {
      const newInput = inputWord + key.toLowerCase();
      console.log('New input:', newInput, 'Target:', targetWord);
      setInputWord(newInput);
      
      if (newInput.toLowerCase() === targetWord.toLowerCase()) {
        console.log('Input matches target, launching game');
        handleEnter();
      }
    }
  };

  const handleBackspace = () => {
    setInputWord(prev => prev.slice(0, -1));
  };

  const handleEnter = () => {
    console.log('Checking input:', inputWord, 'against target:', targetWord);
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
