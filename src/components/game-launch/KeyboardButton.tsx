
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
      className={`w-12 h-12 text-xl font-bold bg-white/10 border-white/20 
        hover:bg-white/20 transition-all duration-200 hover:scale-110
        ${isPressed ? 'bg-green-500/20 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : ''}`}
      onClick={() => onClick(letter)}
    >
      {letter}
    </Button>
  );
}
