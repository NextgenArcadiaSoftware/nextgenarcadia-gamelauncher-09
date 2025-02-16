
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';

export default function RollerCoasterLaunch() {
  const navigate = useNavigate();

  return (
    <RFIDCountdown 
      onExit={() => navigate('/')} 
      activeGame="RollerCoaster Legends"
      trailer="https://www.youtube.com/watch?v=2rI6_ArUDyE"
    />
  );
}
