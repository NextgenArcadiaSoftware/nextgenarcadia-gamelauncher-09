
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
