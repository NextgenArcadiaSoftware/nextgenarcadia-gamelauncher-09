
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';

export default function CreedLaunch() {
  const navigate = useNavigate();

  return (
    <RFIDCountdown 
      onExit={() => navigate('/')} 
      activeGame="Creed: Rise to Glory Championship Edition"
      trailer="https://www.youtube.com/watch?v=EgbCMJ54xeM"
    />
  );
}
