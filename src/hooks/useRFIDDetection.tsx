
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export function useRFIDDetection() {
  const [rfidDetected, setRfidDetected] = useState(false);
  const [rfidInput, setRfidInput] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key)) {
        setRfidInput(prev => {
          const newInput = prev + e.key;
          // Check if we have a complete RFID number (10+ digits)
          if (newInput.length >= 10) {
            setTimeout(() => {
              setRfidDetected(true);
              toast({
                title: "RFID Detected",
                description: "Redirecting to game launcher...",
              });
              
              // Navigate to game selection flow instead of directly to CPP launcher
              setTimeout(() => navigate('/game-flow'), 1500);
            }, 500);
            return '';
          }
          return newInput;
        });
      }
    };
    
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [navigate, toast]);

  // Function to simulate RFID detection manually
  const simulateRFID = () => {
    setRfidDetected(true);
    toast({
      title: "RFID Detected",
      description: "Redirecting to game launcher...",
    });
    setTimeout(() => navigate('/game-flow'), 1500);
  };

  return { rfidDetected, simulateRFID };
}
