
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';

export default function PropagationLaunch() {
  const navigate = useNavigate();

  return (
    <RFIDCountdown 
      onExit={() => navigate('/')} 
      activeGame="Propagation VR"
      trailer="https://www.youtube.com/watch?v=wwj_5R3eEYM"
    />
  );
}
