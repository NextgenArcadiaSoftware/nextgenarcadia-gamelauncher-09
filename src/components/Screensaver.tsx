
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
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          onClick={() => setIsVisible(false)}
        >
          {/* Multi-layered animated gradients */}
          <div 
            className="absolute inset-0 animate-gradient" 
            style={{
              background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
              filter: 'brightness(0.8) saturate(1.2)',
              backgroundSize: '400% 400%'
            }}
          />
          
          <div 
            className="absolute inset-0 animate-gradient mix-blend-overlay" 
            style={{
              background: 'linear-gradient(45deg, #12c2e9, #c471ed, #f64f59)',
              backgroundSize: '400% 400%',
              animationDelay: '-4s'
            }}
          />
          
          <div 
            className="absolute inset-0 animate-gradient mix-blend-soft-light" 
            style={{
              background: 'linear-gradient(135deg, #00F5A0, #00D9F5)',
              backgroundSize: '400% 400%',
              animationDelay: '-8s'
            }}
          />

          {/* Animated mesh gradient overlay */}
          <div 
            className="absolute inset-0 animate-gradient opacity-30" 
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.1) 100%)',
              backgroundSize: '200% 200%',
              animationDuration: '20s'
            }}
          />
          
          {/* Blur effect */}
          <div className="absolute inset-0 backdrop-blur-[100px]" />
          
          {/* Content */}
          <div className="relative z-10 text-center space-y-8">
            <motion.img 
              src="/lovable-uploads/92349df3-c447-40b7-8e36-af1bdaf6071a.png"
              alt="NextGen Arcadia Logo"
              className="w-64 mx-auto mb-8"
              animate={{ 
                scale: [1, 1.05, 1],
                filter: [
                  'drop-shadow(0 0 20px rgba(255,255,255,0.3))',
                  'drop-shadow(0 0 40px rgba(255,255,255,0.6))',
                  'drop-shadow(0 0 20px rgba(255,255,255,0.3))'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.h1 
              className="text-7xl font-display font-bold text-white mb-4 tracking-tight"
              animate={{ 
                textShadow: [
                  '0 0 20px rgba(255,255,255,0.3)',
                  '0 0 40px rgba(255,255,255,0.6)',
                  '0 0 20px rgba(255,255,255,0.3)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              NextGen Arcadia
            </motion.h1>
            <motion.p 
              className="text-xl text-white/70"
              animate={{ 
                opacity: [0.7, 1, 0.7],
                y: [0, -10, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Click anywhere to continue...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
