
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CricketLaunch() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      <Button 
        variant="outline" 
        size="lg"
        className="fixed top-8 left-8 z-50 bg-white text-black hover:bg-white/90 gap-2 text-xl font-bold shadow-lg border-2"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="h-6 w-6" />
        Back to Games
      </Button>
      <RFIDCountdown 
        onExit={() => navigate('/')} 
        activeGame="iB Cricket"
        trailer="https://www.youtube.com/watch?v=CJElM1v0xBw"
      />
    </div>
  );
}
