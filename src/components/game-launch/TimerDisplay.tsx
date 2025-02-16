
import { useEffect, useState } from 'react';
import { Delete } from 'lucide-react';
import { Button } from '../ui/button';

interface TimerDisplayProps {
  timeLeft: number;
  activeGame: string | null | undefined;
  onExit: () => void;
}

export function TimerDisplay({ timeLeft: initialTime, activeGame, onExit }: TimerDisplayProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

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
      console.log("Attempting to send 'shift+8' key to server...");
      
      // First send shift key
      const shiftResponse = await fetch("http://127.0.0.1:5001/keypress", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ key: 'shift' }),
        mode: 'cors'
      });

      if (!shiftResponse.ok) {
        throw new Error(`HTTP error! status: ${shiftResponse.status}`);
      }
      
      // Then send 8 key while shift is pressed
      const eightResponse = await fetch("http://127.0.0.1:5001/keypress", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ key: '8' }),
        mode: 'cors'
      });

      if (!eightResponse.ok) {
        throw new Error(`HTTP error! status: ${eightResponse.status}`);
      }

      console.log("Keys sent successfully to server");
      
      // Call the provided exit callback
      onExit();
    } catch (error) {
      console.error('Error sending exit keystroke:', error);
      onExit(); // Still exit even if key simulation fails
    }
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
      <Button
        size="lg"
        variant="destructive"
        className="bg-black/20 backdrop-blur-sm hover:bg-black/30 text-xl px-8 py-6 animate-scale-in flex items-center gap-2"
        onClick={handleExit}
      >
        <Delete className="w-6 h-6" />
        Exit Session
      </Button>
    </div>
  );
}
