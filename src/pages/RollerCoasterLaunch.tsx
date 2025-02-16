
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function RollerCoasterLaunch() {
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
        activeGame="RollerCoaster Legends"
        trailer="https://www.youtube.com/watch?v=2rI6_ArUDyE"
      />
    </div>
  );
}
