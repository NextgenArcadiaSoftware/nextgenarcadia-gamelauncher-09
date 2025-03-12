
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function UnknownGameLaunch() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 opacity-80" />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <div className="glass p-8 rounded-3xl space-y-8 max-w-2xl w-full text-center border border-white/20">
          <h1 className="text-6xl font-bold text-white mb-4 font-display">
            Unknown Game
          </h1>
          
          <p className="text-white/90 text-xl mb-8">
            This game is not available or could not be found.
          </p>

          <Button 
            variant="outline" 
            size="lg"
            className="bg-white text-black hover:bg-white/90 gap-2 text-xl font-bold shadow-lg border-2"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-6 w-6" />
            Back to Games
          </Button>
        </div>
      </div>
    </div>
  );
}
