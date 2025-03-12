
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PlankLaunch() {
  const navigate = useNavigate();

  return (
    <div>
      <Button 
        variant="ghost" 
        size="lg"
        className="fixed top-8 left-8 z-50 text-white hover:bg-white/20 gap-2 text-xl"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="h-6 w-6" />
        Back to Games
      </Button>
      <RFIDCountdown 
        onExit={() => navigate('/')} 
        activeGame="Richies Plank Experience"
        trailer="https://www.youtube.com/watch?v=xwNF8MvZLZE"
      />
    </div>
  );
}
