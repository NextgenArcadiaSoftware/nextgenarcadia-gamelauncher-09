
import { useEffect, useState } from 'react';
import { useToast } from './ui/use-toast';
import { TimerDisplay } from './game-launch/TimerDisplay';
import { RatingScreen } from './game-launch/RatingScreen';

interface RFIDCountdownProps {
  onExit: () => void;
  duration?: number;
  activeGame?: string | null;
}

export function RFIDCountdown({ onExit, duration = 8, activeGame }: RFIDCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [showRating, setShowRating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Start countdown immediately
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowRating(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate RFID input (this would be replaced by actual RFID reader input)
    const rfidCode = "0014662252";
    console.log('RFID Code detected:', rfidCode);

    // Show toast when game starts
    toast({
      title: "✨ Game Starting",
      description: `${activeGame} is launching...`,
    });

    return () => clearInterval(interval);
  }, [activeGame, toast]);

  const handleRatingSubmit = (rating: number) => {
    toast({
      title: "Thank You!",
      description: `You rated ${activeGame} ${rating} stars.`,
    });
    onExit();
  };

  if (showRating) {
    return <RatingScreen activeGame={activeGame} onSubmit={handleRatingSubmit} />;
  }

  return (
    <TimerDisplay
      timeLeft={timeLeft}
      activeGame={activeGame}
      onExit={onExit}
    />
  );
}
