
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';

export default function ElvenAssassinLaunch() {
  const navigate = useNavigate();

  return (
    <RFIDCountdown 
      onExit={() => navigate('/')} 
      activeGame="Elven Assassin"
      trailer="https://www.youtube.com/watch?v=eBOD4yqxQnY"
    />
  );
}
