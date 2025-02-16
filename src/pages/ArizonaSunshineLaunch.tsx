
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';

export default function ArizonaSunshineLaunch() {
  const navigate = useNavigate();

  return (
    <RFIDCountdown 
      onExit={() => navigate('/')} 
      activeGame="Arizona Sunshine II"
      trailer="https://www.youtube.com/watch?v=V0IdVLowEqc"
    />
  );
}
