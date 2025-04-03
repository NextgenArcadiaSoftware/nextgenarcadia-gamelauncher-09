
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export default function SportsLaunch() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Set up global key event listener for both the X key and C++ program
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      console.log(`Global keydown detected: ${e.key}`);
      
      // Special handling for X key to end the game
      if (e.key.toLowerCase() === 'x') {
        console.log('X key detected, ending game');
        toast({
          title: "Game Ended",
          description: "Ending current game session..."
        });
        
        // Send close command to C++ server
        fetch("http://localhost:5001/close", {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        })
        .then(response => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return response.text();
        })
        .then(text => {
          console.log('Close game response:', text);
          // Show game termination toast with the C++ server response
          toast({
            variant: "destructive",
            title: "Games Terminated",
            description: text || "All games closed successfully"
          });
          
          // Navigate back after short delay
          setTimeout(() => navigate('/'), 1000);
        })
        .catch(error => {
          console.error('Error closing game:', error);
          // Even if the C++ server is unavailable, still navigate back
          setTimeout(() => navigate('/'), 1000);
        });
      }
      
      // The C++ program will listen for other key events
    };

    // Add the global event listener
    document.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      // Clean up
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [navigate, toast]);

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
