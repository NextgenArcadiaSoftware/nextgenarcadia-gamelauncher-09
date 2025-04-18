
import { useEffect, useState } from 'react';
import { useToast } from '../ui/use-toast';
import { VirtualKeyboard } from './VirtualKeyboard';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface GameLaunchScreenProps {
  game: {
    title: string;
    description: string;
    thumbnail: string;
    genre: string;
  };
  onContinue: () => void;
}

export function GameLaunchScreen({
  game,
  onContinue
}: GameLaunchScreenProps) {
  const [showLaunchScreen, setShowLaunchScreen] = useState(false);
  const [rfidInput, setRfidInput] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const gameLaunchKeys: Record<string, string> = {
    "Fruit Ninja VR": "f",
    "Crisis Brigade 2 Reloaded": "c",
    "Subside": "s",
    "Propagation VR": "p",
    "iB Cricket": "i",
    "Arizona Sunshine II": "a",
    "Undead Citadel": "u",
    "Elven Assassin": "e",
    "Richies Plank Experience": "r",
    "All-in-One Sports VR": "v",
    "Creed: Rise to Glory Championship Edition": "g",
    "Beat Saber": "w",
    "RollerCoaster Legends": "p"
  };

  const currentLaunchKey = gameLaunchKeys[game.title] || "x";

  useEffect(() => {
    if (!gameLaunchKeys[game.title]) {
      navigate('/unknown-game');
      return;
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      if (/^\d$/.test(event.key)) {
        setRfidInput(prev => {
          const newInput = prev + event.key;
          // Check if we have a complete RFID number (10+ digits)
          if (newInput.length >= 10) {
            setShowLaunchScreen(true);
            toast({
              title: "✅ RFID Card Detected",
              description: "You can now launch the game"
            });
            return '';
          }
          return newInput;
        });
        return;
      }

      if (event.key.toLowerCase() === currentLaunchKey && showLaunchScreen) {
        handleGameStart();
      }
    };
    
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [game.title, showLaunchScreen, toast, onContinue, currentLaunchKey, navigate]);

  const handleGameStart = () => {
    toast({
      title: "🎮 Game Starting",
      description: "Starting your VR session"
    });
    onContinue();
  };

  const simulateKeyPress = (key: string) => {
    try {
      if (key.toLowerCase() === currentLaunchKey && showLaunchScreen) {
        handleGameStart();
      }

      toast({
        title: "Key Pressed",
        description: `${key.toUpperCase()} key press simulated`
      });
    } catch (error) {
      console.error('Error simulating key press:', error);
      toast({
        title: "Error",
        description: "Failed to simulate key press",
        variant: "destructive"
      });
    }
  };

  // Animation variants for smoother transitions
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  if (!showLaunchScreen) {
    return (
      <motion.div 
        className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 opacity-80" />
          <div className="absolute inset-0 mix-blend-overlay opacity-30">
            <img src={game.thumbnail} alt={`${game.title} Background`} className="w-full h-full object-cover" />
          </div>
        </div>

        <motion.div 
          className="relative z-10 max-w-4xl w-full mx-auto p-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="glass p-8 rounded-3xl space-y-8 relative overflow-hidden border border-white/20">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-white mb-4 font-display" style={{
                textShadow: '0 0 20px rgba(59,130,246,0.5), 0 0 40px rgba(59,130,246,0.3)'
              }}>
                {game.title}
              </h1>
            </div>

            <div className="space-y-8">
              <div className="animate-[pulse_2s_ease-in-out_infinite] text-white text-4xl font-bold py-4 text-center tracking-wide">
                TAP RFID CARD TO START
              </div>
              <div className="flex justify-center">
                <button 
                  onClick={() => navigate('/')}
                  className="w-64 h-32 flex flex-col items-center justify-center bg-white/80 text-black hover:bg-white rounded-2xl border-4 border-white/20 backdrop-blur-sm gap-2 font-bold shadow-lg transition-all duration-200 hover:scale-105"
                  style={{
                    boxShadow: '0 0 25px 5px rgba(255, 255, 255, 0.4), 0 0 10px 1px rgba(255, 255, 255, 0.7)'
                  }}
                >
                  <ArrowLeft className="h-8 w-8" />
                  <span>Back to Games</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 opacity-80" />
        <div className="absolute inset-0 mix-blend-overlay opacity-30">
          <img src={game.thumbnail} alt={`${game.title} Background`} className="w-full h-full object-cover" />
        </div>
      </div>

      <motion.div 
        className="relative z-10 max-w-4xl w-full mx-auto p-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="glass p-8 rounded-3xl space-y-8 relative overflow-hidden border border-white/20">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4 font-display" style={{
              textShadow: '0 0 20px rgba(59,130,246,0.5), 0 0 40px rgba(59,130,246,0.3)'
            }}>
              {game.title}
            </h1>
            <div className="flex justify-center gap-4">
              <span className="inline-block px-4 py-1 rounded-full text-sm text-white/90 bg-blue-500/30 backdrop-blur-sm border border-blue-500/30">
                Virtual Reality
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-white/90 text-xl leading-relaxed">
              {game.description}
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 mt-8">
            <div className="animate-[pulse_2s_ease-in-out_infinite] text-white text-2xl font-bold">
              Press {currentLaunchKey.toUpperCase()} When Ready
            </div>
            <motion.button 
              onClick={() => simulateKeyPress(currentLaunchKey)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-32 h-32 text-6xl font-bold text-white bg-blue-500 rounded-2xl hover:bg-blue-600 transition-all duration-200 border-4 border-white/20"
            >
              {currentLaunchKey.toUpperCase()}
            </motion.button>
          </div>

          <div className="mt-8 flex justify-center">
            <VirtualKeyboard
              onKeyPress={simulateKeyPress}
              gameKey={currentLaunchKey}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
