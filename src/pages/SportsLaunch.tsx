
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { closeGames } from '@/services/GameService';

export default function SportsLaunch() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [serverResponse, setServerResponse] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);

  // Set up global key event listener for both the X key and C++ program
  useEffect(() => {
    const handleGlobalKeyDown = async (e: KeyboardEvent) => {
      console.log(`Global keydown detected: ${e.key}`);
      
      // Special handling for X key to end the game
      if (e.key.toLowerCase() === 'x') {
        console.log('X key detected, ending game');
        setRequestStatus('Sending close command to server...');
        
        try {
          // Send close command using our GameService
          const result = await closeGames("All-in-One Sports VR");
          
          // Display server response
          setServerResponse(result.message || "Game successfully closed");
          setRequestStatus(`Server responded with status: ${result.status}`);
          
          console.log('Close game response:', result);
          
          // Show toast for successful game termination
          toast({
            title: "Game Closed",
            description: result.message || "All running games have been terminated",
            variant: "default"
          });
          
          // Navigate back after short delay to allow toasts to be visible
          setTimeout(() => navigate('/'), 2000);
        } catch (error) {
          console.error('Error closing game:', error);
          setServerResponse(`Error: ${error instanceof Error ? error.message : String(error)}`);
          
          // Fallback Electron method
          if (window.electron) {
            console.log("Falling back to Electron method for game termination");
            window.electron.ipcRenderer.send('end-game');
            
            toast({
              title: "Fallback Method",
              description: "Using Electron to terminate games",
              variant: "destructive"
            });
            
            // Still navigate back
            setTimeout(() => navigate('/'), 1500);
          } else {
            setTimeout(() => navigate('/'), 1500);
          }
        }
      }
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
      
      {(serverResponse || requestStatus) && (
        <div className="fixed top-24 left-8 z-50 bg-black/80 text-green-500 p-4 rounded-md font-mono whitespace-pre max-w-lg overflow-auto max-h-[80vh]">
          {requestStatus && <div className="mb-2 text-yellow-300">{requestStatus}</div>}
          {serverResponse && <div>{serverResponse}</div>}
        </div>
      )}
      
      <RFIDCountdown 
        onExit={() => navigate('/')} 
        activeGame="All-in-One Sports VR"
        trailer="https://www.youtube.com/watch?v=uXDM7LgRSWc"
      />
    </div>
  );
}
