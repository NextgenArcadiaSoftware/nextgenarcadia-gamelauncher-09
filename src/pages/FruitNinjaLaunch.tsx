
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CppServerStatus } from '@/components/game-launch/CppServerStatus';
import { launchGameByCode, closeGames, checkServerHealth } from '@/services/GameService';
import { useToast } from '@/components/ui/use-toast';

export default function FruitNinjaLaunch() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [serverResponse, setServerResponse] = useState<string | null>(null);
  
  // Auto-launch the game when component mounts
  useEffect(() => {
    const autoLaunch = async () => {
      try {
        // First check if the server is healthy
        const isHealthy = await checkServerHealth();
        
        if (isHealthy) {
          // Launch the game
          const result = await launchGameByCode('f'); // 'f' is for Fruit Ninja VR
          setServerResponse(result.message || "Fruit Ninja VR launch initiated");
          
          toast({
            title: "Game Launching",
            description: "Launching Fruit Ninja VR..."
          });
        } else {
          setConnectionError("Cannot connect to game server");
          
          // Try fallback method through Electron
          if (window.electron) {
            window.electron.ipcRenderer.send('simulate-keypress', 'f');
            
            toast({
              title: "Using Fallback",
              description: "Launching via Electron since server is unavailable",
              variant: "default"
            });
          }
        }
      } catch (error) {
        console.error('Error auto-launching game:', error);
        setConnectionError(`Error launching game: ${error instanceof Error ? error.message : String(error)}`);
        
        // Try fallback method through Electron
        if (window.electron) {
          window.electron.ipcRenderer.send('simulate-keypress', 'f');
          
          toast({
            title: "Using Fallback",
            description: "Launching via Electron due to server error",
            variant: "default"
          });
        }
      }
    };
    
    // Add a small delay before auto-launching to allow for UI to render
    const timeoutId = setTimeout(() => {
      autoLaunch();
    }, 1000);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [toast]);

  // Set up key event listener for X key to end game
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'x') {
        console.log('X key detected, ending game');
        
        toast({
          title: "Game Ending",
          description: "Ending current game session..."
        });
        
        try {
          const result = await closeGames("Fruit Ninja VR");
          setServerResponse(result.message || "Game successfully closed");
          
          // Navigate back after short delay
          setTimeout(() => navigate('/'), 1500);
        } catch (error) {
          console.error('Error closing game:', error);
          
          // Try fallback method through Electron
          if (window.electron) {
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

  const handleManualLaunch = async () => {
    try {
      const result = await launchGameByCode('f');
      setServerResponse(result.message || "Fruit Ninja VR launch initiated");
      setConnectionError(null);
      
      toast({
        title: "Game Launching",
        description: "Launching Fruit Ninja VR..."
      });
    } catch (error) {
      console.error('Error launching game manually:', error);
      setConnectionError(`Error launching game: ${error instanceof Error ? error.message : String(error)}`);
      
      // Try fallback method through Electron
      if (window.electron) {
        window.electron.ipcRenderer.send('simulate-keypress', 'f');
        
        toast({
          title: "Using Fallback",
          description: "Launching via Electron due to server error",
          variant: "default"
        });
      }
    }
  };
  
  const handleEndGame = async () => {
    try {
      const result = await closeGames("Fruit Ninja VR");
      setServerResponse(result.message || "Game successfully closed");
      
      toast({
        title: "Game Ended",
        description: "Successfully terminated the game"
      });
      
      // Navigate back after short delay
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Error ending game:', error);
      
      // Try fallback method through Electron
      if (window.electron) {
        window.electron.ipcRenderer.send('end-game');
      }
      
      toast({
        title: "Using Fallback",
        description: "Terminating via Electron due to server error",
        variant: "default"
      });
      
      setTimeout(() => navigate('/'), 1000);
    }
  };

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
      
      <div className="fixed top-24 left-8 right-8 mx-auto max-w-xl z-50">
        <CppServerStatus onRetry={handleManualLaunch} />
        
        {connectionError && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              {connectionError}
              <p className="mt-2 font-mono text-xs">
                If running locally, make sure the C++ server has CORS headers enabled.
              </p>
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleManualLaunch}
                  className="mr-2"
                >
                  Retry Launch
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleEndGame}
                >
                  End Game
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {serverResponse && !connectionError && (
          <Alert className="mt-4 bg-green-100 border-green-500">
            <AlertTitle className="text-green-800">Server Response</AlertTitle>
            <AlertDescription className="text-green-700">
              <p className="whitespace-pre-line font-mono">{serverResponse}</p>
              <div className="mt-2 flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleManualLaunch}
                  variant="default"
                  className="bg-green-700 hover:bg-green-800"
                >
                  Launch Again
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleEndGame}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50"
                >
                  End Game
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      <RFIDCountdown 
        onExit={() => navigate('/')} 
        activeGame="Fruit Ninja VR"
        trailer="https://www.youtube.com/watch?v=gV6_2NhRPUo"
      />
    </div>
  );
}
