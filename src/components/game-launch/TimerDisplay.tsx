
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { X, Power } from 'lucide-react';

interface TimerDisplayProps {
  timeLeft: number;
  activeGame: string | null | undefined;
  onExit: () => void;
}

export function TimerDisplay({ timeLeft: initialTime, activeGame, onExit }: TimerDisplayProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    // Reset the timer if initialTime changes
    setTimeLeft(initialTime);
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [initialTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAltF4 = () => {
    // Use the electron API to send Alt+F4 keystroke
    if (window.electron) {
      window.electron.ipcRenderer.send('simulate-keypress', { key: 'F4', alt: true });
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#F97316] via-[#ea384c] to-[#FEC6A1] flex flex-col items-center justify-center z-50 animate-fade-in">
      <Button 
        variant="ghost" 
        className="absolute top-4 right-4 text-white hover:bg-white/20"
        onClick={onExit}
      >
        <X className="h-6 w-6" />
        Exit
      </Button>
      
      <div className="text-9xl font-mono mb-8 text-white animate-pulse tracking-widest">
        {formatTime(timeLeft)}
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
        variant="destructive"
        size="lg"
        className="mt-8 px-8 py-6 text-xl font-bold flex items-center gap-3 hover:bg-red-800 transition-colors animate-pulse"
        onClick={handleAltF4}
      >
        <Power className="h-6 w-6" />
        Alt+F4
      </Button>
    </div>
  );
}
