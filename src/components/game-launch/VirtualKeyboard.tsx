
import { Keyboard, ArrowLeft, CornerDownLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { KeyboardButton } from './KeyboardButton';

interface VirtualKeyboardProps {
  inputWord: string;
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
}

export function VirtualKeyboard({ inputWord, onKeyPress, onBackspace, onEnter }: VirtualKeyboardProps) {
  const keys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  // Convert input to uppercase for comparison
  const upperInput = inputWord.toUpperCase();

  return (
    <div className="glass p-6 rounded-xl space-y-4 animate-scale-in max-w-3xl w-full">
      <div className="flex items-center gap-2 mb-6 justify-center">
        <Keyboard className="w-6 h-6 text-white/80" />
        <span className="text-white/80 text-lg">Type the launch code to begin</span>
      </div>
      
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-2">
          {row.map((key) => (
            <KeyboardButton
              key={key}
              letter={key}
              isPressed={upperInput.includes(key)}
              onClick={onKeyPress}
            />
          ))}
        </div>
      ))}
      
      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="outline"
          className="px-6 py-4 bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-110 flex items-center gap-2"
          onClick={onBackspace}
        >
          <ArrowLeft className="w-5 h-5" />
          Backspace
        </Button>
        <Button
          variant="outline"
          className="px-6 py-4 bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-110 flex items-center gap-2"
          onClick={onEnter}
        >
          <CornerDownLeft className="w-5 h-5" />
          Enter
        </Button>
      </div>
    </div>
  );
}
