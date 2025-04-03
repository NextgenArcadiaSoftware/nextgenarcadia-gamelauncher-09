
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { closeGames } from '@/services/GameService';

export default function CricketLaunch() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [serverResponse, setServerResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Set up key event listener for X key to end game
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'x') {
        console.log('X key detected, ending game');
        setIsLoading(true);
        
        toast({
          title: "Game Ended",
          description: "Ending current game session..."
        });
        
        try {
          // Send close command using our GameService
          const result = await closeGames("iB Cricket");
          
          // Display server response
          setServerResponse(result.message || "Game successfully closed");
          console.log('Close game response:', result);
          
          // Show another toast with the server's response
          toast({
            title: "Server Response",
            description: result.message || "Game closed successfully"
          });
          
          // Navigate back after short delay
          setTimeout(() => navigate('/'), 1500);
        } catch (error) {
          console.error('Error closing game:', error);
          setIsLoading(false);
          
          // Even if the C++ server is unavailable, still navigate back
          toast({
            title: "Error",
            description: "Could not communicate with game server",
            variant: "destructive"
          });
          
          if (window.electron) {
            console.log("Falling back to Electron method for game termination");
            window.electron.ipcRenderer.send('end-game');
          }
          
          setTimeout(() => navigate('/'), 1000);
        }
      }
    };

    // Add global event listener
    document.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, toast]);

  return (
    <div className="relative min-h-screen">
      <Button 
        variant="default" 
        size="lg"
        className="fixed top-8 left-8 z-50 bg-white/80 text-black hover:bg-white gap-2 text-xl font-bold shadow-lg border-2"
        onClick={() => navigate('/')}
        disabled={isLoading}
      >
        <ArrowLeft className="h-6 w-6" />
        Back to Games
      </Button>
      
      {serverResponse && (
        <div className="fixed top-24 left-8 z-50 bg-black/80 text-green-500 p-4 rounded-md font-mono max-w-md">
          {serverResponse}
        </div>
      )}
      
      <RFIDCountdown 
        onExit={() => navigate('/')} 
        activeGame="iB Cricket"
        trailer="https://www.youtube.com/watch?v=CJElM1v0xBw"
      />
    </div>
  );
}
