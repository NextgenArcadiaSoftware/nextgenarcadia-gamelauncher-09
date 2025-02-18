
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { VirtualKeyboard } from './VirtualKeyboard';

interface TimerDisplayProps {
  timeLeft: number;
  activeGame: string | null | undefined;
  onExit: () => void;
}

export function TimerDisplay({
  timeLeft: initialTime,
  activeGame,
  onExit
}: TimerDisplayProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [inputWord, setInputWord] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
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
        body: JSON.stringify({
          key: 'z'
        }),
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

  const handleKeyPress = (key: string) => {
    setInputWord(prev => prev + key);
  };

  const handleBackspace = () => {
    setInputWord(prev => prev.slice(0, -1));
  };

  const handleEnter = () => {
    setInputWord('');
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#F97316] via-[#D946EF] to-[#8B5CF6] flex flex-col items-center justify-between py-6 z-50 animate-gradient">
      {/* Top Section */}
      <div className="flex flex-col items-center">
        {activeGame && (
          <div className="text-2xl text-white/90 mb-4 font-medium tracking-wide animate-fade-in">
            {activeGame}
          </div>
        )}

        {/* Timer Section */}
        <div className="glass p-8 rounded-3xl mb-6 min-w-[300px] text-center">
          <div className="text-8xl font-mono mb-2 text-white tracking-widest font-bold">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
          <div className="text-lg text-white/80 font-medium">
            Time Remaining
          </div>
        </div>
      </div>

      {/* Middle Section - Exit Button */}
      <div className="flex flex-col items-center gap-3 mb-6">
        <button
          onClick={handleExit}
          className="w-28 h-28 bg-white/90 text-[#ea384c] font-bold shadow-lg hover:shadow-xl border border-[#ea384c]/10 transition-all duration-300 hover:scale-105 hover:bg-white text-4xl rounded-sm"
        >
          Z
        </button>
      </div>
      
      {/* Bottom Section - Keyboard */}
      <div className="w-full max-w-3xl px-6">
        <VirtualKeyboard
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onEnter={handleEnter}
          inputWord={inputWord}
          onExit={handleExit}  // Added this prop
        />
      </div>
    </div>
  );
}
