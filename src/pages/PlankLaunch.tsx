
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';

export default function PlankLaunch() {
  const navigate = useNavigate();

  return (
    <RFIDCountdown 
      onExit={() => navigate('/')} 
      activeGame="Richies Plank Experience"
      trailer="https://www.youtube.com/watch?v=xwNF8MvZLZE"
    />
  );
}
