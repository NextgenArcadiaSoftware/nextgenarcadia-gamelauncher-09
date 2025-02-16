
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';

export default function SportsLaunch() {
  const navigate = useNavigate();

  return (
    <RFIDCountdown 
      onExit={() => navigate('/')} 
      activeGame="All-in-One Sports VR"
      trailer="https://www.youtube.com/watch?v=uXDM7LgRSWc"
    />
  );
}
