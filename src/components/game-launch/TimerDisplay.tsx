
import { useEffect, useState } from 'react';
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
    <div className="fixed inset-0 bg-gradient-to-br from-[#FEF7CD] via-[#FDE1D3] to-[#FFDEE2] flex flex-col items-center justify-start pt-16 z-50">
      {/* Game Title */}
      {activeGame && (
        <div className="text-2xl text-gray-800/80 mb-8 font-medium tracking-wide animate-fade-in">
          {activeGame}
        </div>
      )}

      {/* Timer Section */}
      <div className="glass p-8 rounded-3xl mb-12 min-w-[300px] text-center">
        <div className="text-8xl font-mono mb-2 text-gray-800 tracking-widest font-bold">
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
        <div className="text-lg text-gray-600 font-medium">
          Time Remaining
        </div>
      </div>

      {/* Exit Button */}
      <div className="flex flex-col items-center gap-3 mb-12">
        <button
          onClick={handleExit}
          className="w-32 h-32 rounded-full bg-white/90 text-[#ea384c] text-6xl font-bold 
                   shadow-lg hover:shadow-xl border border-[#ea384c]/10
                   transition-all duration-300 hover:scale-105 hover:bg-white"
        >
          Z
        </button>
        <span className="text-gray-700 text-lg font-medium">
          Exit Session
        </span>
      </div>
      
      {/* Keyboard Section */}
      <div className="w-full max-w-3xl px-6">
        <div className="glass p-4 rounded-2xl mb-4">
          <input
            type="text"
            value={inputWord}
            readOnly
            className="w-full bg-transparent text-gray-800 text-2xl text-center border-none outline-none"
            placeholder="Type using the keyboard below..."
          />
        </div>
        <VirtualKeyboard
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onEnter={handleEnter}
          inputWord={inputWord}
        />
      </div>
    </div>
  );
}
