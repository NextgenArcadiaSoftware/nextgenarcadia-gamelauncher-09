
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
    fetch('http://localhost:5001/health')
      .then(response => {
        if (response.ok) {
          setConnectionError(false);
          setReconnectAttempts(0);
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
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setConnectionError(false);
      return response.text();
    })
    .then(text => {
      console.log('C++ server raw response:', text);
      
      // Set the formatted response message with special formatting preserved
      setLastResponse(text);
      
      // Process specific response patterns from C++ server
      if (text.includes('[🎮] Launched:') || text.includes('[≡ƒÄ«] Launched:')) {
        const gamePath = text.match(/Launched: (.+)/)?.[1] || '';
        toast({
          title: "Game Launched",
          description: gamePath.split('\\').pop() || gamePath,
          variant: "default"
        });
      }  
      else if (text.includes('[≡ƒÆÇ] Terminating all games...')) {
        toast({
          title: "Game Termination",
          description: "Closing all active games...",
          variant: "destructive"
        });
      }
      else if (text.match(/\[≡ƒöÑ\] Killed: (.+)/)) {
        const killedGame = text.match(/\[≡ƒöÑ\] Killed: (.+)/)?.[1] || '';
        toast({
          title: "Game Closed",
          description: `Terminated: ${killedGame}`,
          variant: "destructive"
        });
      }
      else if (text.includes('[≡ƒÆÇ] All games terminated.')) {
        toast({
          title: "Termination Complete",
          description: "All games have been successfully closed.",
          variant: "default"
        });
      }
      else if (text.includes('[💀] Terminating') || text.includes('[🔥] Killed:')) {
        toast({
          title: "Game Closed",
          description: key === 'X' ? "Terminating all games..." : text,
          variant: "destructive"
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
      
      {lastResponse && !connectionError && (
        <Alert className="mb-4 bg-black/50 border-green-500">
          <AlertTitle>Server Response</AlertTitle>
          <AlertDescription className="whitespace-pre-line font-mono text-green-500">
            {lastResponse}
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
