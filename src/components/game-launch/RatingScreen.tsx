
import { useState } from 'react';
import { Button } from '../ui/button';
import { Star } from 'lucide-react';

interface RatingScreenProps {
  activeGame: string | null | undefined;
  onSubmit: (rating: number) => void;
}

export function RatingScreen({ activeGame, onSubmit }: RatingScreenProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#F97316] via-[#ea384c] to-[#FEC6A1] flex flex-col items-center justify-center z-50 animate-fade-in p-4">
      <div className="text-4xl font-bold text-white mb-8 text-center">
        How was your experience?
      </div>
      {activeGame && (
        <div className="text-xl text-white/80 mb-8">
          {activeGame}
        </div>
      )}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className="transform transition-all duration-200 hover:scale-110"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
          >
            <Star
              className={`w-12 h-12 ${
                star <= (hoveredRating || rating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-white/30'
              } transition-colors duration-200`}
            />
          </button>
        ))}
      </div>
      <Button
        size="lg"
        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-xl px-8 py-6"
        onClick={() => onSubmit(rating)}
      >
        Submit Rating
      </Button>
    </div>
  );
}
