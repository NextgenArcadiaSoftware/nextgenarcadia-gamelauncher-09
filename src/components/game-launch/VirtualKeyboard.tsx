
import React, { useEffect, useState } from 'react';
import { useToast } from '../ui/use-toast';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace?: () => void;
  onEnter?: () => void;
  inputWord?: string;
  gameKey?: string;
}

export function VirtualKeyboard({ 
  onKeyPress, 
  onBackspace, 
  onEnter, 
  inputWord,
  gameKey
}: VirtualKeyboardProps) {
  const { toast } = useToast();
  const [connectionError, setConnectionError] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const [lastStatus, setLastStatus] = useState<number | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    checkServerConnectivity();
    
    const intervalId = setInterval(checkServerConnectivity, 10000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const checkServerConnectivity = () => {
    fetch('http://localhost:5002/close', {
      method: 'POST',
      signal: AbortSignal.timeout(2000),
      headers: { 
        'Accept-Charset': 'UTF-8',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.ok || response.status === 204 || response.status === 404) {
          setConnectionError(false);
          setReconnectAttempts(0);
        } else {
          throw new Error(`Server returned: ${response.status}`);
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
    
    console.log(`Sending to Python server:`, payload);
    
    // Use port 5002 for the Python server
    const serverUrl = 'http://localhost:5002';
    
    fetch(`${serverUrl}/${endpoint}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json; charset=utf-8",
        "Accept-Charset": "UTF-8"
      },
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
      
      // Ensure UTF-8 decoding of response text
      return response.text().then(text => new TextDecoder('utf-8').decode(new TextEncoder().encode(text)));
    })
    .then(text => {
      console.log('Python server response:', text);
      
      // Set the response message
      setLastResponse(text);
      
      // Show toast based on key and status
      if (key === 'X') {
        toast({
          title: "Game Termination",
          description: "Closing all active games...",
          variant: "destructive"
        });
      } else {
        const gameNames: Record<string, string> = {
          'f': "Fruit Ninja VR",
          'e': "Elven Assassin",
          'c': "Crisis Brigade 2",
          'v': "All-in-One Sports VR"
        };
        
        if (gameNames[keyToSend]) {
          toast({
            title: "Game Launched",
            description: `Launching ${gameNames[keyToSend]}...`,
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
      console.error('Error sending keypress to Python server:', error);
      setConnectionError(true);
      
      // Increment reconnect attempts
      setReconnectAttempts(prev => prev + 1);
      
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Could not connect to the Python server"
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
            Unable to connect to the Python server. {reconnectAttempts > 0 && `Attempted ${reconnectAttempts} reconnects.`}
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
      
      <div className="flex justify-center gap-4">
        {gameKey && (
          <Button
            onClick={() => handleKeyClick(gameKey)}
            className="w-24 h-24 rounded-2xl bg-blue-600 text-white text-2xl font-bold
                     shadow-[0_0_15px_rgba(59,130,246,0.7)] border border-blue-500/50
                     hover:bg-blue-700 transition-all duration-300"
          >
            {gameKey.toUpperCase()}
          </Button>
        )}
        
        <Button
          onClick={() => handleKeyClick('X')}
          className="w-24 h-24 rounded-2xl bg-red-600 text-white text-2xl font-bold
                   shadow-[0_0_15px_rgba(220,38,38,0.7)] border border-red-500/50
                   hover:bg-red-700 transition-all duration-300"
        >
          X
        </Button>
      </div>
    </div>
  );
}
