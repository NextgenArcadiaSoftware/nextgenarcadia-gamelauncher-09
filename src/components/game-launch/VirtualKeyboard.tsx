
import React, { useEffect, useState } from 'react';
import { Delete, CornerDownLeft } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  inputWord: string;
}

export function VirtualKeyboard({ onKeyPress, onBackspace, onEnter, inputWord }: VirtualKeyboardProps) {
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
    console.log(`Virtual Keyboard - Sending key: ${key}`);
    
    // Convert key to lowercase for consistency
    const keyToSend = key.toLowerCase();
    
    // For X key, use the close endpoint instead of keypress
    const endpoint = key === 'X' ? 'close' : 'keypress';
    const payload = key === 'X' ? 
      {} : 
      { key: keyToSend };
    
    console.log(`Sending to C++ server:`, payload);
    
    // Use port 5001 for the C++ server
    const serverUrl = 'http://localhost:5001';
    
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
      try {
        const keyboardEvent = new KeyboardEvent('keydown', {
          key: keyToSend,
          code: `Key${key.toUpperCase()}`,
          keyCode: key.toUpperCase().charCodeAt(0),
          bubbles: true,
          cancelable: true,
          view: window
        });
        document.dispatchEvent(keyboardEvent);
        console.log(`DOM keyboard event dispatched for key: ${key}`);
      } catch (err) {
        console.error('Error dispatching keyboard event:', err);
      }
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
      
      // Try electron method as fallback
      if (window.electron) {
        console.log("Falling back to Electron keypress simulation");
        window.electron.ipcRenderer.send('simulate-keypress', keyToSend);
        
        // For X key specifically, also send the end-game command
        if (key === 'X') {
          console.log("Sending end-game command via Electron");
          window.electron.ipcRenderer.send('end-game');
        }
      }
    });

    // Call the provided callback
    onKeyPress(key);
  };

  return (
    <div className="p-4 bg-black/20 backdrop-blur-sm rounded-lg">
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
                    ? 'bg-red-600 text-white animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.7)]' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                } 
                font-bold text-lg transition-colors 
                duration-200 flex items-center justify-center
                border ${key === 'X' ? 'border-red-500' : 'border-white/10'} backdrop-blur-sm
                active:scale-95 transform`}
                data-key={key.toLowerCase()}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
        <div className="flex justify-center gap-1 mt-2">
          <button
            onClick={onBackspace}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 
                     text-white transition-colors duration-200
                     border border-white/10 backdrop-blur-sm"
          >
            <Delete className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleKeyClick(' ')}
            className="px-16 py-2 rounded-lg bg-white/10 hover:bg-white/20 
                     text-white transition-colors duration-200
                     border border-white/10 backdrop-blur-sm"
          >
            Space
          </button>
          <button
            onClick={onEnter}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 
                     text-white transition-colors duration-200
                     border border-white/10 backdrop-blur-sm"
          >
            <CornerDownLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
