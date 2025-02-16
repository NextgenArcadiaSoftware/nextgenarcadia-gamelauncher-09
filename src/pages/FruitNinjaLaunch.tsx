
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';

export default function FruitNinjaLaunch() {
  const navigate = useNavigate();

  return (
    <RFIDCountdown 
      onExit={() => navigate('/')} 
      activeGame="Fruit Ninja VR"
      trailer="https://www.youtube.com/watch?v=gV6_2NhRPUo"
    />
  );
}
