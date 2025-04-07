
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRFIDDetection } from '@/hooks/useRFIDDetection';

export default function CreedLaunch() {
  const navigate = useNavigate();
  const { rfidDetected, simulateRFID } = useRFIDDetection();

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
      
      {/* Test button for RFID simulation */}
      <Button
        variant="default"
        size="lg"
        className="fixed top-8 right-8 z-50 bg-purple-600 hover:bg-purple-700"
        onClick={simulateRFID}
      >
        Simulate RFID Scan
      </Button>
      
      <RFIDCountdown 
        onExit={() => navigate('/')} 
        activeGame="Creed: Rise to Glory Championship Edition"
        trailer="https://www.youtube.com/watch?v=EgbCMJ54xeM"
        steamUrl="steam://rungameid/2147530"
      />
    </div>
  );
}
