
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

interface RFIDCountdownProps {
  onExit: () => void;
  duration?: number;
}

export function RFIDCountdown({ onExit, duration = 8 }: RFIDCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert minutes to seconds
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          toast({
            title: "Session Ended",
            description: `Your ${duration}-minute session has ended.`,
          });
          onExit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onExit, toast, duration]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-50">
      <div className="text-9xl font-mono mb-8 text-green-500 animate-pulse tracking-widest">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>
      <div className="text-2xl text-green-400 mb-8">
        Time Remaining
      </div>
      <Button
        size="lg"
        variant="destructive"
        className="bg-red-600 hover:bg-red-700 text-xl px-8 py-6"
        onClick={onExit}
      >
        Exit Session
      </Button>
    </div>
  );
}
