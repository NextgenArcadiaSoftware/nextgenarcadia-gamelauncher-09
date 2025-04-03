
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { closeGames, sendKeyPress, checkServerHealth } from '@/services/GameService';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function SportsLaunch() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [serverResponse, setServerResponse] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  // Check server connectivity on mount
  useEffect(() => {
    const checkConnection = async () => {
      setConnectionStatus('connecting');
      try {
        const isHealthy = await checkServerHealth();
        
        if (isHealthy) {
          setConnectionStatus('connected');
          setReconnectAttempts(0);
          console.log('Successfully connected to C++ game server');
        } else {
          throw new Error('Health check failed');
        }
      } catch (error) {
        console.error('Connection test error:', error);
        setConnectionStatus('error');
        setReconnectAttempts(prev => prev + 1);
      }
    };
    
    checkConnection();
    
    // Set up periodic connectivity checks
    const intervalId = setInterval(checkConnection, 10000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Set up key event listener for X key to end game
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'x') {
        console.log('X key detected, ending game');
        
        toast({
          title: "Game Ended",
          description: "Ending current game session..."
        });
        
        try {
          // Send close command using our GameService
          const result = await closeGames("All-in-One Sports VR");
          
          // Display server response
          setServerResponse(result.message || "Game successfully closed");
          setRequestStatus(`Server responded with status: ${result.status}`);
          
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
          setServerResponse(`Error: ${error instanceof Error ? error.message : String(error)}`);
          
          // Even if the C++ server is unavailable, still navigate back
          toast({
            title: "Error",
            description: "Could not communicate with game server",
            variant: "destructive"
          });
          
          // Try fallback method through Electron
          if (window.electron) {
            console.log("Falling back to Electron method for game termination");
            window.electron.ipcRenderer.send('end-game');
            
            toast({
              title: "Fallback Method",
              description: "Using Electron to terminate games",
              variant: "default"
            });
          }
          
          setTimeout(() => navigate('/'), 1000);
        }
      }
      
      // Handle direct launch key
      const launchKeys = ['v', 'f', 'c', 'e', 'i', 'r', 'p', 'a', 's', 'u', 'g', 'w'];
      const launchKey = e.key.toLowerCase();
      
      if (launchKeys.includes(launchKey)) {
        console.log(`Launch key detected: ${launchKey}`);
        
        try {
          // Send keypress command to C++ server
          const result = await sendKeyPress(launchKey);
          
          // Display server response
          setServerResponse(result.message || `Game launch command sent: ${launchKey}`);
          setRequestStatus(`Server responded with status: ${result.status}`);
          
          toast({
            title: "Launch Command Sent",
            description: `Launching game with key: ${launchKey.toUpperCase()}`
          });
          
        } catch (error) {
          console.error('Error sending launch command:', error);
          setServerResponse(`Error: ${error instanceof Error ? error.message : String(error)}`);
          
          toast({
            title: "Launch Error",
            description: "Could not send launch command to server",
            variant: "destructive"
          });
          
          // Try fallback method through Electron
          if (window.electron) {
            console.log("Falling back to Electron method for game launch");
            window.electron.ipcRenderer.send('simulate-keypress', launchKey);
          }
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

  const handleManualRetry = async () => {
    setConnectionStatus('connecting');
    
    try {
      const isHealthy = await checkServerHealth();
      
      if (isHealthy) {
        setConnectionStatus('connected');
        setReconnectAttempts(0);
        
        toast({
          title: "Connection Restored",
          description: "Successfully connected to game server"
        });
        
      } else {
        throw new Error('Health check failed');
      }
    } catch (error) {
      console.error('Manual retry failed:', error);
      setConnectionStatus('error');
      setReconnectAttempts(prev => prev + 1);
      
      toast({
        title: "Connection Failed",
        description: "Could not connect to game server",
        variant: "destructive"
      });
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
      
      {connectionStatus === 'error' && (
        <Alert variant="destructive" className="fixed top-24 left-8 z-50 max-w-md">
          <AlertTitle>C++ Server Connection Error</AlertTitle>
          <AlertDescription>
            Cannot connect to the C++ game server at http://localhost:5001
            {reconnectAttempts > 0 && ` (${reconnectAttempts} reconnect attempts)`}
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleManualRetry}
              >
                Retry Connection
              </Button>
            </div>
            <p className="mt-2 font-mono text-xs">
              Make sure the C++ server is running with proper CORS headers enabled.
            </p>
          </AlertDescription>
        </Alert>
      )}
      
      {connectionStatus === 'connected' && (
        <Alert variant="default" className="fixed top-24 left-8 z-50 max-w-md bg-green-100 border-green-500">
          <AlertTitle className="text-green-800">Server Connected</AlertTitle>
          <AlertDescription className="text-green-700">
            Successfully connected to C++ game server
          </AlertDescription>
        </Alert>
      )}
      
      {(serverResponse || requestStatus) && (
        <div className="fixed top-40 left-8 z-50 bg-black/80 text-green-500 p-4 rounded-md font-mono whitespace-pre max-w-lg overflow-auto max-h-[80vh]">
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
