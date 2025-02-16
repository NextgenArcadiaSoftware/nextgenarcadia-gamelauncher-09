
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export default function SportsLaunch() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Verify the server is running
    fetch('http://localhost:5001/health')
      .then(response => response.json())
      .then(data => {
        if (data.status === 'healthy') {
          console.log('Game launcher server is running');
        }
      })
      .catch(error => {
        console.error('Game launcher server not responding:', error);
        toast({
          title: "Server Error",
          description: "Game launcher server is not running. Please start the server.",
          variant: "destructive"
        });
      });
  }, [toast]);

  return (
    <RFIDCountdown 
      onExit={() => navigate('/')} 
      activeGame="All-in-One Sports VR"
    />
  );
}
