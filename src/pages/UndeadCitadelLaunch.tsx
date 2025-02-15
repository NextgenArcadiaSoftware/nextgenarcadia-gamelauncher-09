
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';

export default function UndeadCitadelLaunch() {
  const navigate = useNavigate();

  return (
    <RFIDCountdown 
      onExit={() => navigate('/')} 
      activeGame="Undead Citadel"
    />
  );
}
