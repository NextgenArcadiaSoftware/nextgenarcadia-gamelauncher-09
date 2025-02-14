
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Screensaver() {
  const [isVisible, setIsVisible] = useState(false);
  let timeoutId: NodeJS.Timeout;

  const resetTimer = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
    timeoutId = setTimeout(() => setIsVisible(true), 15000); // 15 seconds
  };

  useEffect(() => {
    // Initial setup
    resetTimer();

    // Add event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, resetTimer));

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => document.removeEventListener(event, resetTimer));
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setIsVisible(false)}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-violet-900/90 animate-gradient-shift backdrop-blur-lg" />
          <div className="relative z-10 text-center">
            <h1 className="text-7xl font-display font-bold text-white mb-4 tracking-tight animate-pulse">
              NextGen Arcadia
            </h1>
            <p className="text-xl text-white/70 animate-bounce">
              Click anywhere to continue...
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
