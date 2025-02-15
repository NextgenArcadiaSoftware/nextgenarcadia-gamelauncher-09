
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';

export default function CrisBrigadeLaunch() {
  const navigate = useNavigate();

  return (
    <RFIDCountdown 
      onExit={() => navigate('/')} 
      activeGame="Crisis Brigade 2 Reloaded"
    />
  );
}
