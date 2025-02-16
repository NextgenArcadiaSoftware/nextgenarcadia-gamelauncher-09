
import { useEffect, useState } from 'react';
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
      onExit();
    } catch (error) {
      console.error('Error sending exit keystroke:', error);
      onExit();
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
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={handleExit}
          className="w-32 h-32 rounded-full bg-[#ea384c] text-white text-6xl font-bold 
                   shadow-[0_0_20px_rgba(234,56,76,0.5),0_0_40px_rgba(234,56,76,0.3)] 
                   hover:shadow-[0_0_30px_rgba(234,56,76,0.7),0_0_50px_rgba(234,56,76,0.5)] 
                   transition-all duration-300 hover:scale-110 animate-pulse"
        >
          Z
        </button>
        <span className="text-white text-xl font-medium tracking-wide animate-fade-in">
          Exit Session
        </span>
      </div>
    </div>
  );
}
