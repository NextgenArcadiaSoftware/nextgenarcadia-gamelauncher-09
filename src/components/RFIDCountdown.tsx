
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { Keyboard } from 'lucide-react';

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
    if (inputWord.length < targetWord.length) {
      setInputWord(prev => prev + key.toLowerCase());
    }
  };

  const handleBackspace = () => {
    setInputWord(prev => prev.slice(0, -1));
  };

  const handleEnter = () => {
    if (inputWord.toLowerCase() === targetWord.toLowerCase()) {
      setShowKeyboard(false);
      toast({
        title: "Game Starting",
        description: `${activeGame} is launching...`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Code",
        description: "Please try again",
      });
      setInputWord('');
    }
  };

  const keys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  if (showKeyboard) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#F97316] via-[#ea384c] to-[#FEC6A1] flex flex-col items-center justify-center z-50 animate-fade-in">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-white mb-2 animate-fade-in">Launch Code:</h2>
          <div className="text-white/90 font-mono text-xl bg-black/20 px-4 py-2 rounded-lg animate-scale-in">
            {targetWord}
          </div>
          {activeGame && (
            <div className="mt-4 text-white/80 text-sm glass p-2 rounded-lg animate-fade-in">
              Launch Code for {activeGame}:<br />
              {activeGame}: {targetWord}
            </div>
          )}
        </div>

        <div className="mb-8 flex gap-2">
          {targetWord.split('').map((_, index) => (
            <div
              key={index}
              className={`w-12 h-12 border-2 ${
                inputWord[index] 
                  ? 'border-green-500 bg-green-500/20' 
                  : 'border-white/50 bg-white/10'
              } rounded-lg flex items-center justify-center text-2xl font-bold text-white animate-scale-in`}
            >
              {inputWord[index] || ''}
            </div>
          ))}
        </div>
        
        <div className="glass p-8 rounded-xl space-y-4 animate-scale-in">
          <div className="flex items-center gap-2 mb-6">
            <Keyboard className="w-6 h-6 text-white/80" />
            <span className="text-white/80 text-sm">Type the launch code to start</span>
          </div>
          
          {keys.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-2">
              {row.map((key) => (
                <Button
                  key={key}
                  variant="outline"
                  className="w-12 h-12 text-xl font-bold bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-110"
                  onClick={() => handleKeyPress(key)}
                >
                  {key}
                </Button>
              ))}
            </div>
          ))}
          
          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              className="px-8 py-6 bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-110"
              onClick={handleBackspace}
            >
              Backspace
            </Button>
            <Button
              variant="outline"
              className="px-8 py-6 bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-110"
              onClick={handleEnter}
            >
              Enter
            </Button>
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={onExit}
          className="mt-8 text-white/80 hover:text-white hover:bg-white/10"
        >
          Exit Session
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#F97316] via-[#ea384c] to-[#FEC6A1] flex flex-col items-center justify-center z-50 animate-fade-in">
      <div className="text-9xl font-mono mb-8 text-white animate-pulse tracking-widest">
        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </div>
      <div className="text-2xl text-white/90 mb-4 animate-fade-in">
        Time Remaining
      </div>
      {activeGame && (
        <div className="text-xl text-white/80 mb-8 animate-fade-in">
          Currently Playing: {activeGame}
        </div>
      )}
      <Button
        size="lg"
        variant="destructive"
        className="bg-black/20 backdrop-blur-sm hover:bg-black/30 text-xl px-8 py-6 animate-scale-in"
        onClick={onExit}
      >
        Exit Session
      </Button>
    </div>
  );
}
