
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ArizonaSunshineLaunch() {
  const navigate = useNavigate();

  return (
    <div>
      <Button 
        variant="ghost" 
        className="fixed top-4 left-4 z-50"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <RFIDCountdown 
        onExit={() => navigate('/')} 
        activeGame="Arizona Sunshine II"
        trailer="https://www.youtube.com/watch?v=V0IdVLowEqc"
      />
    </div>
  );
}
