
import { useEffect } from 'react';
import { useToast } from '../ui/use-toast';

interface GameLaunchScreenProps {
  game: {
    title: string;
    description: string;
    thumbnail: string;
    genre: string;
  };
  onContinue: () => void;
}

export function GameLaunchScreen({ game, onContinue }: GameLaunchScreenProps) {
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "✨ Game Ready",
      description: `${game.title} is ready to launch`,
    });
  }, [game.title, toast]);

  if (game.title === "Fruit Ninja VR") {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
        {/* Animated fruit slicing background */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(225deg, #FF4800 0%, #FF0000 100%)',
              opacity: 0.8
            }}
          />
          <div className="absolute inset-0 mix-blend-overlay opacity-30">
            <img 
              src={game.thumbnail} 
              alt="Fruit Ninja Background"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl w-full mx-auto p-8">
          <div className="glass p-8 rounded-3xl space-y-8 relative overflow-hidden border border-white/20">
            {/* Game Logo/Title */}
            <div className="text-center">
              <h1 className="text-6xl font-bold text-white mb-4 font-display"
                  style={{
                    textShadow: '0 0 20px rgba(255,0,0,0.5), 0 0 40px rgba(255,0,0,0.3)'
                  }}>
                FRUIT NINJA VR
              </h1>
              <div className="flex justify-center gap-4">
                <span className="inline-block px-4 py-1 rounded-full text-sm text-white/90 bg-red-500/30 backdrop-blur-sm border border-red-500/30">
                  Action
                </span>
                <span className="inline-block px-4 py-1 rounded-full text-sm text-white/90 bg-red-500/30 backdrop-blur-sm border border-red-500/30">
                  Virtual Reality
                </span>
              </div>
            </div>

            {/* Game Description */}
            <div className="text-center">
              <p className="text-white/90 text-xl leading-relaxed">
                Become a fruit-slicing master in VR! Slice and dice your way through waves of juicy fruits, 
                while avoiding explosive bombs. Experience the thrill of being a true ninja in virtual reality!
              </p>
            </div>

            {/* Game Features */}
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                'Classic Mode',
                'Zen Mode',
                'Arcade Mode'
              ].map((feature) => (
                <div key={feature} className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                  <span className="text-white font-semibold">{feature}</span>
                </div>
              ))}
            </div>

            {/* Start Button */}
            <div className="flex flex-col items-center gap-4 mt-8">
              <div className="animate-[pulse_2s_ease-in-out_infinite] text-white text-2xl font-bold">
                Your Dojo Awaits
              </div>
              <button
                onClick={onContinue}
                className="px-12 py-4 bg-red-500 hover:bg-red-600 rounded-full text-white font-bold text-lg transition-all transform hover:scale-105 active:scale-95"
              >
                Begin Training
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default launch screen for other games
  return (
    <div className="fixed inset-0 animate-gradient flex flex-col items-center justify-center z-50 p-6"
      style={{
        background: 'linear-gradient(225deg, #F97316 0%, #D946EF 50%, #8B5CF6 100%)',
        backgroundSize: '400% 400%'
      }}>
      <div className="glass p-8 rounded-3xl max-w-4xl w-full space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={game.thumbnail} 
            alt={game.title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2">{game.title}</h1>
          <span className="inline-block px-3 py-1 rounded-full text-sm text-white/90 bg-white/20 backdrop-blur-sm">
            {game.genre}
          </span>
          
          <p className="mt-4 text-white/80 text-lg">
            {game.description}
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-[pulse_2s_ease-in-out_infinite] text-white text-2xl font-bold">
                Ready to Start
              </div>
              <button
                onClick={onContinue}
                className="px-8 py-3 bg-white rounded-full text-black font-semibold hover:bg-white/90 transition-colors"
              >
                Begin Game
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
