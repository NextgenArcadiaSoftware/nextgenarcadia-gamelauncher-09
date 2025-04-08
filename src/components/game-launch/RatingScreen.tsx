
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface RatingScreenProps {
  activeGame: string | null | undefined;
  onSubmit: (rating: number) => void;
}

export function RatingScreen({ activeGame, onSubmit }: RatingScreenProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  // Handle submission with animation before calling onSubmit
  const handleSubmitRating = () => {
    setIsExiting(true);
    
    // Call the actual submission function after exit animation starts
    setTimeout(() => {
      onSubmit(rating);
      
      // Navigate to home after a short delay for the thank you message
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }, 300);
  };

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.div 
          className="fixed inset-0 bg-gradient-to-br from-[#F97316] via-[#ea384c] to-[#FEC6A1] flex flex-col items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-bold text-white mb-8 text-center"
          >
            How was your experience?
          </motion.div>
          
          {activeGame && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-white/80 mb-8"
            >
              {activeGame}
            </motion.div>
          )}
          
          <motion.div 
            className="flex gap-2 mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                className="transform transition-all duration-200 hover:scale-110"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Star
                  className={`w-12 h-12 ${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-white/30'
                  } transition-colors duration-200`}
                />
              </motion.button>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              size="lg"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-xl px-8 py-6"
              onClick={handleSubmitRating}
            >
              Submit Rating
            </Button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          className="fixed inset-0 bg-gradient-to-br from-[#4ade80] to-[#22c55e] flex flex-col items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className="text-4xl font-bold text-white text-center"
          >
            Thank You for Your Rating!
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl text-white/80 mt-4"
          >
            Redirecting to home...
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
