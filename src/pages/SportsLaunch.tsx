
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export default function SportsLaunch() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Set up global key event listener for the C++ program
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      console.log(`Global keydown detected: ${e.key}`);
      
      // Special handling for 'V' key to launch All-in-One Sports VR
      if (e.key.toLowerCase() === 'v') {
        try {
          fetch("http://localhost:5001/keypress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              key: 'v', 
              command: 'KEY_V_PRESSED', 
              game: 'All-in-One Sports VR' 
            })
          })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            console.log('C++ server response:', data);
            toast({
              title: "Game Launch",
              description: "Launching All-in-One Sports VR..."
            });
          })
          .catch(error => {
            console.error('Error sending V key to C++ server:', error);
            toast({
              variant: "destructive",
              title: "Launch Error",
              description: "Could not connect to game launcher"
            });
          });
        } catch (error) {
          console.error('Error in V key press handling:', error);
        }
      }
    };

    // Add the global event listener
    document.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      // Clean up
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [toast]);

  return (
    <div className="relative min-h-screen">
      <Button 
        variant="outline" 
        size="lg"
        className="fixed top-8 left-8 z-50 bg-white text-black hover:bg-white/90 gap-2 text-xl font-bold shadow-lg border-2"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="h-6 w-6" />
        Back to Games
      </Button>
      <RFIDCountdown 
        onExit={() => navigate('/')} 
        activeGame="All-in-One Sports VR"
        trailer="https://www.youtube.com/watch?v=uXDM7LgRSWc"
      />
    </div>
  );
}
