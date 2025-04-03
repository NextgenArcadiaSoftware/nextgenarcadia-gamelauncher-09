
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { sendKeyPress, closeGames, checkServerHealth } from '@/services/GameService';

interface TimerKeyboardProps {
  onKeyPress: (key: string) => void;
}

export function TimerKeyboard({ onKeyPress }: TimerKeyboardProps) {
  const { toast } = useToast();
  const [connectionError, setConnectionError] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const [lastStatus, setLastStatus] = useState<number | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const rows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  // Check server connectivity on mount
  useEffect(() => {
    checkServerConnectivity();
    
    // Set up periodic connectivity checks
    const intervalId = setInterval(checkServerConnectivity, 10000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const checkServerConnectivity = async () => {
    const isHealthy = await checkServerHealth();
    setConnectionError(!isHealthy);
    
    if (isHealthy) {
      setReconnectAttempts(0);
    }
  };

  const handleKeyClick = async (key: string) => {
    console.log(`Timer Keyboard - Key pressed: ${key}`);
    
    try {
      // For X key, use the closeGames method
      if (key === 'X') {
        const result = await closeGames();
        console.log('Close games response:', result);
        
        // Set the status and response message
        setLastStatus(result.status || 200);
        setLastResponse(result.message || "Successfully closed all games");
        setConnectionError(false);
        
        toast({
          title: "Game Termination",
          description: "Closing all active games...",
          variant: "destructive"
        });
      } else {
        // For other keys, use the sendKeyPress method
        const result = await sendKeyPress(key);
        console.log('Keypress response:', result);
        
        // Set the status and response message
        setLastStatus(result.status || 200);
        setLastResponse(result.message || `Successfully sent key ${key}`);
        setConnectionError(false);
        
        // Show toast based on key
        if (key === 'F') { // Fruit Ninja
          toast({
            title: "Game Launched",
            description: "Launching Fruit Ninja VR...",
            variant: "default"
          });
        } else if (key === 'E') { // Elven Assassin
          toast({
            title: "Game Launched",
            description: "Launching Elven Assassin...",
            variant: "default"
          });
        } else if (key === 'C') { // Crisis Brigade
          toast({
            title: "Game Launched",
            description: "Launching Crisis Brigade 2...",
            variant: "default"
          });
        } else if (key === 'V') { // All-in-One Sports
          toast({
            title: "Game Launched",
            description: "Launching All-in-One Sports VR...",
            variant: "default"
          });
        } else if (key === 'I') { // iB Cricket
          toast({
            title: "Game Launched",
            description: "Launching iB Cricket...",
            variant: "default"
          });
        } else {
          toast({
            title: "Command Sent",
            description: `Key ${key} command processed`,
            variant: "default"
          });
        }
      }
      
      // Create and dispatch a real DOM keyboard event
      const event = new KeyboardEvent("keydown", {
        key: key.toLowerCase(),
        code: `Key${key}`,
        keyCode: key.charCodeAt(0),
        bubbles: true,
        cancelable: true,
        view: window
      });
      document.dispatchEvent(event);
    } catch (error) {
      console.error('Error sending keypress to C++ server:', error);
      setConnectionError(true);
      
      // Increment reconnect attempts
      setReconnectAttempts(prev => prev + 1);
      
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Could not connect to the C++ server"
      });
      
      // Try fallback methods through Electron
      if (window.electron) {
        console.log("Falling back to Electron keypress simulation");
        window.electron.ipcRenderer.send('simulate-keypress', key.toLowerCase());
        
        // For X key specifically, also send the end-game command
        if (key === 'X') {
          console.log("Sending end-game command via Electron");
          window.electron.ipcRenderer.send('end-game');
        }
      }
    }
    
    // Call the original onKeyPress handler
    onKeyPress(key);
  };

  return (
    <div className="p-4 bg-black/30 backdrop-blur-sm rounded-lg max-w-4xl mx-auto">
      {connectionError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            Unable to connect to the C++ server. {reconnectAttempts > 0 && `Attempted ${reconnectAttempts} reconnects.`}
            <button 
              className="ml-2 text-white underline" 
              onClick={() => checkServerConnectivity()}
            >
              Retry Connection
            </button>
          </AlertDescription>
        </Alert>
      )}
      
      {(lastResponse || lastStatus) && !connectionError && (
        <Alert className="mb-4 bg-black/50 border-green-500">
          <AlertTitle>Server Response</AlertTitle>
          <AlertDescription className="font-mono text-green-500">
            {lastStatus && <div>Status: {lastStatus}</div>}
            {lastResponse && <div className="whitespace-pre-line">{lastResponse}</div>}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-2">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyClick(key)}
                className={`w-12 h-12 rounded-lg ${
                  key === 'X'
                    ? 'bg-[#ea384c] text-white animate-pulse shadow-[0_0_15px_rgba(234,56,76,0.7)]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                } font-bold text-lg transition-colors 
                duration-200 flex items-center justify-center
                border ${key === 'X' ? 'border-[#ea384c]/50' : 'border-white/10'} backdrop-blur-sm
                active:scale-95 transform`}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
        <div className="flex justify-center gap-1 mt-2">
          <button
            onClick={() => handleKeyClick('Space')}
            className="px-16 py-2 rounded-lg bg-white/10 hover:bg-white/20 
                     text-white transition-colors duration-200
                     border border-white/10 backdrop-blur-sm"
          >
            Space
          </button>
        </div>
      </div>
    </div>
  );
}
