
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

interface RFIDCountdownProps {
  onExit: () => void;
}

export function RFIDCountdown({ onExit }: RFIDCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(8 * 60); // 8 minutes in seconds
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onExit]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="text-8xl font-mono mb-8 text-green-500 animate-pulse">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>
      <Button
        size="lg"
        variant="destructive"
        className="bg-red-600 hover:bg-red-700"
        onClick={onExit}
      >
        Exit Session
      </Button>
    </div>
  );
}
