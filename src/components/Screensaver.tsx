
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
          {/* Base gradient layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-purple-600/90 to-pink-500/90 animate-gradient-shift" style={{
            backgroundSize: '400% 400%',
            animation: 'gradient-shift 10s ease infinite',
          }} />
          
          {/* Secondary gradient layer */}
          <div className="absolute inset-0 bg-gradient-to-tl from-blue-600/50 via-violet-600/50 to-fuchsia-500/50 animate-gradient-shift mix-blend-overlay" style={{
            backgroundSize: '400% 400%',
            animation: 'gradient-shift 15s ease infinite',
          }} />
          
          {/* Additional color layers */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-teal-500/30 to-emerald-600/30 animate-gradient-shift mix-blend-color" style={{
            backgroundSize: '400% 400%',
            animation: 'gradient-shift 20s ease infinite',
          }} />
          
          <div className="absolute inset-0 bg-gradient-to-bl from-rose-400/20 via-orange-500/20 to-amber-600/20 animate-gradient-shift mix-blend-soft-light" style={{
            backgroundSize: '400% 400%',
            animation: 'gradient-shift 25s ease infinite',
          }} />
          
          {/* Blur effect */}
          <div className="absolute inset-0 backdrop-blur-lg" />
          
          {/* Content */}
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
