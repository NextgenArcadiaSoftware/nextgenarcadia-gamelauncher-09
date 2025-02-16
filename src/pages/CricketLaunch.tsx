
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';

export default function CricketLaunch() {
  const navigate = useNavigate();

  return (
    <RFIDCountdown 
      onExit={() => navigate('/')} 
      activeGame="iB Cricket"
      trailer="https://www.youtube.com/watch?v=CJElM1v0xBw"
    />
  );
}
