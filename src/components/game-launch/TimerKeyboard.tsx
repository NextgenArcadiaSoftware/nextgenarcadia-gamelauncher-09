
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';

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

  const checkServerConnectivity = () => {
    fetch('http://localhost:5001/health', {
      signal: AbortSignal.timeout(2000)
    })
      .then(response => {
        if (response.ok || response.status === 204) {
          setConnectionError(false);
          setReconnectAttempts(0);
        } else {
          // Handle 404 status which might still mean server is running but endpoint not available
          if (response.status === 404) {
            console.log("Server running but health endpoint is missing");
            setConnectionError(false);
            setReconnectAttempts(0);
          } else {
            throw new Error(`Server returned: ${response.status}`);
          }
        }
      })
      .catch(() => {
        setConnectionError(true);
      });
  };

  const handleKeyClick = (key: string) => {
    console.log(`Timer Keyboard - Key pressed: ${key}`);
    
    // Use port 5001 for the C++ server
    const serverUrl = 'http://localhost:5001'; 
    
    // For X key, use the close endpoint instead of keypress
    const endpoint = key === 'X' ? 'close' : 'keypress';
    
    // Simplified payload for C++ server
    const payload = key === 'X' 
      ? {} // C++ server doesn't need any payload for close
      : { key: key.toLowerCase() };
    
    console.log(`Sending to C++ server:`, payload);
    
    fetch(`${serverUrl}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Set timeout to avoid hanging requests
      signal: AbortSignal.timeout(2000)
    })
    .then(response => {
      console.log(`Server responded with status: ${response.status}`);
      setLastStatus(response.status);
      setConnectionError(false);
      
      // Handle empty responses (204 No Content)
      if (response.status === 204) {
        return key === 'X' ? 
          "Game close command successful" : 
          `Key ${key} sent successfully`;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.text();
    })
    .then(text => {
      console.log('C++ server response:', text);
      
      // Set the response message
      setLastResponse(text);
      
      // Show toast based on key and status
      if (key === 'X') {
        toast({
          title: "Game Termination",
          description: "Closing all active games...",
          variant: "destructive"
        });
      } else if (key === 'F') { // Fruit Ninja
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
      } else {
        toast({
          title: "Command Sent",
          description: `Key ${key} command processed`,
          variant: "default"
        });
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
    })
    .catch(error => {
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
    });
    
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
