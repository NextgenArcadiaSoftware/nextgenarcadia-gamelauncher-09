
import { Button } from '../ui/button';

interface KeyboardButtonProps {
  letter: string;
  isPressed: boolean;
  onClick: (key: string) => void;
}

export function KeyboardButton({ letter, isPressed, onClick }: KeyboardButtonProps) {
  return (
    <Button
      variant="outline"
      className={`w-10 h-10 text-lg font-medium bg-gray-200 hover:bg-gray-300 text-black border-0
        transition-all duration-200 rounded-md ${isPressed ? 'bg-gray-300' : ''}`}
      onClick={() => onClick(letter)}
    >
      {letter}
    </Button>
  );
}
