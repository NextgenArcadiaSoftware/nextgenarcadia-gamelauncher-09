
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function FruitNinjaLaunch() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      <Button 
        variant="default" 
        size="lg"
        className="fixed top-8 left-8 z-50 bg-white/20 hover:bg-white/30 text-white gap-2 text-xl font-bold"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="h-6 w-6" />
        Back to Games
      </Button>
      <RFIDCountdown 
        onExit={() => navigate('/')} 
        activeGame="Fruit Ninja VR"
        trailer="https://www.youtube.com/watch?v=gV6_2NhRPUo"
      />
    </div>
  );
}
