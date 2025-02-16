
import { useEffect, useState } from 'react';
import { Delete } from 'lucide-react';
import { Button } from '../ui/button';
import { VirtualKeyboard } from './VirtualKeyboard';

interface TimerDisplayProps {
  timeLeft: number;
  activeGame: string | null | undefined;
  onExit: () => void;
}

export function TimerDisplay({ timeLeft: initialTime, activeGame, onExit }: TimerDisplayProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [inputWord, setInputWord] = useState('');

  useEffect(() => {
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
  }, []);

  const handleExit = async () => {
    try {
      console.log("Attempting to send 'z' key to server...");
      
      const response = await fetch("http://127.0.0.1:5001/keypress", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ key: 'z' }),
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Key sent successfully to server");
      
      // Call the provided exit callback
      onExit();
    } catch (error) {
      console.error('Error sending exit keystroke:', error);
      onExit(); // Still exit even if key simulation fails
    }
  };

  const handleKeyPress = (key: string) => {
    setInputWord(prev => prev + key);
  };

  const handleBackspace = () => {
    setInputWord(prev => prev.slice(0, -1));
  };

  const handleEnter = () => {
    // Clear input after enter
    setInputWord('');
  };

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
      <div className="w-full max-w-3xl px-4 space-y-8">
        <div className="bg-black/20 backdrop-blur-sm p-4 rounded-lg mb-4">
          <input
            type="text"
            value={inputWord}
            readOnly
            className="w-full bg-transparent text-white text-2xl text-center border-none outline-none"
            placeholder="Type using the keyboard below..."
          />
        </div>
        <VirtualKeyboard
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onEnter={handleEnter}
          inputWord={inputWord}
        />
        <Button
          size="lg"
          variant="destructive"
          className="w-full bg-black/20 backdrop-blur-sm hover:bg-black/30 text-xl px-8 py-6 animate-scale-in flex items-center gap-2 justify-center mt-4"
          onClick={handleExit}
        >
          <Delete className="w-6 h-6" />
          Exit Session
        </Button>
      </div>
    </div>
  );
}
