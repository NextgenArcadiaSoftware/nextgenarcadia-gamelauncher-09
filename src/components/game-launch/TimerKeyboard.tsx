
import React from 'react';
import { X } from 'lucide-react';
import { useToast } from '../ui/use-toast';

interface TimerKeyboardProps {
  onKeyPress: (key: string) => void;
}

export function TimerKeyboard({ onKeyPress }: TimerKeyboardProps) {
  const { toast } = useToast();
  const rows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const handleKeyClick = (key: string) => {
    console.log(`Timer Keyboard - Key pressed: ${key}`);
    onKeyPress(key);
    
    toast({
      title: "Key Pressed",
      description: `${key} key pressed`
    });
  };

  return (
    <div className="p-4 bg-black/30 backdrop-blur-sm rounded-lg max-w-4xl mx-auto">
      <div className="grid gap-2">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyClick(key)}
                className={`w-12 h-12 rounded-lg ${
                  key === 'X'
                    ? 'bg-[#ea384c] text-white animate-pulse shadow-[0_0_15px_rgba(234,56,76,0.7)]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                } font-bold text-lg transition-colors 
                duration-200 flex items-center justify-center
                border ${key === 'X' ? 'border-[#ea384c]/50' : 'border-white/10'} backdrop-blur-sm
                active:scale-95 transform`}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
        <div className="flex justify-center gap-1 mt-2">
          <button
            onClick={() => handleKeyClick('Space')}
            className="px-16 py-2 rounded-lg bg-white/10 hover:bg-white/20 
                     text-white transition-colors duration-200
                     border border-white/10 backdrop-blur-sm"
          >
            Space
          </button>
        </div>
      </div>
    </div>
  );
}
