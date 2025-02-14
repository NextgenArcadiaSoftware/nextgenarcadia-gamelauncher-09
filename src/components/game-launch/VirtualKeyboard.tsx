
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

  return (
    <div className="glass p-6 rounded-xl space-y-2 animate-scale-in max-w-2xl w-full">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1.5">
          {row.map((key) => (
            <KeyboardButton
              key={key}
              letter={key}
              isPressed={inputWord.toLowerCase().includes(key.toLowerCase())}
              onClick={onKeyPress}
            />
          ))}
        </div>
      ))}
      
      <div className="flex justify-between px-2 mt-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="px-4 py-2 bg-gray-200 text-black hover:bg-gray-300 transition-all duration-200"
            onClick={() => null}
          >
            123
          </Button>
          <Button
            variant="outline"
            className="px-4 py-2 bg-gray-200 text-black hover:bg-gray-300 transition-all duration-200"
            onClick={() => null}
          >
            🌐
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="px-4 py-2 bg-gray-200 text-black hover:bg-gray-300 transition-all duration-200 min-w-[100px]"
            onClick={onBackspace}
          >
            ←
          </Button>
          <Button
            variant="outline"
            className="px-4 py-2 bg-gray-200 text-black hover:bg-gray-300 transition-all duration-200 min-w-[100px]"
            onClick={onEnter}
          >
            Go
          </Button>
        </div>
      </div>
    </div>
  );
}
