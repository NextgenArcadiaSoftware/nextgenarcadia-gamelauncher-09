
import React from 'react';
import { X } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';

interface TimerKeyboardProps {
  onKeyPress: (key: string) => void;
}

export function TimerKeyboard({ onKeyPress }: TimerKeyboardProps) {
  const { toast } = useToast();
  const [connectionError, setConnectionError] = React.useState(false);
  const [lastResponse, setLastResponse] = React.useState<string | null>(null);
  const rows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  // Map keys to game codes and descriptive names
  const keyToGameMap: Record<string, {code: string, name: string}> = {
    'E': {code: 'EAX', name: 'Elven Assassin'},
    'F': {code: 'FNJ', name: 'Fruit Ninja VR'},
    'C': {code: 'CBR', name: 'Crisis Brigade 2'},
    'V': {code: 'AIO', name: 'All-in-One Sports VR'},
    'P': {code: 'RPE', name: 'Richies Plank Experience'},
    'I': {code: 'IBC', name: 'iB Cricket'},
    'U': {code: 'UDC', name: 'Undead Citadel'},
    'A': {code: 'ARS', name: 'Arizona Sunshine'},
    'S': {code: 'SBS', name: 'Subside'},
    'G': {code: 'PVR', name: 'Propagation VR'},
    'R': {code: 'CRD', name: 'Creed Rise to Glory'},
    'W': {code: 'BTS', name: 'Beat Saber'}
  };

  const handleKeyClick = (key: string) => {
    console.log(`Timer Keyboard - Key pressed: ${key}`);
    
    // Use port 5001 for the C++ server
    const serverUrl = 'http://localhost:5001';
    
    // Check if this is a special game launch key
    const isGameKey = keyToGameMap[key] !== undefined;
    
    // Determine endpoint and payload based on key
    let endpoint = 'keypress';
    let payload = { command: `KEY_${key.toUpperCase()}_PRESSED` };
    let description = `Sent command: KEY_${key.toUpperCase()}_PRESSED`;
    
    if (key === 'X') {
      // X key is special - close all games
      endpoint = 'close';
      payload = { command: "CLOSE_GAME" };
      description = "Terminating all games...";
    } 
    else if (isGameKey) {
      // For game launch keys, include game information
      const gameInfo = keyToGameMap[key];
      payload = { 
        command: `LAUNCH_GAME_${gameInfo.code}`,
        gameCode: gameInfo.code,
        key: key.toLowerCase() 
      };
      description = `Launching ${gameInfo.name} (${gameInfo.code})`;
    }
    
    console.log(`Sending to C++ server:`, payload);
    
    fetch(`${serverUrl}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setConnectionError(false);
      return response.text().then(text => {
        // Try to parse as JSON if possible
        try {
          return JSON.parse(text);
        } catch (e) {
          // If not JSON, return as text
          return { message: text || `Command received` };
        }
      });
    })
    .then(data => {
      console.log('C++ server response:', data);
      setLastResponse(data.message || `Command sent: ${JSON.stringify(payload.command)}`);
      
      toast({
        title: "Game Command",
        description: description
      });
      
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
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Could not connect to the C++ server"
      });
      
      // Try electron method as fallback
      if (window.electron) {
        console.log("Falling back to Electron keypress simulation");
        window.electron.ipcRenderer.send('simulate-keypress', key.toLowerCase());
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
            Unable to connect to the C++ server. Please check that the C++ server is running.
          </AlertDescription>
        </Alert>
      )}
      
      {lastResponse && (
        <Alert className="mb-4 bg-green-500/20 border-green-500">
          <AlertTitle>Server Response</AlertTitle>
          <AlertDescription>
            {lastResponse}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-2">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((key) => {
              const isGameKey = keyToGameMap[key] !== undefined;
              return (
                <button
                  key={key}
                  onClick={() => handleKeyClick(key)}
                  className={`w-12 h-12 rounded-lg ${
                    key === 'X'
                      ? 'bg-[#ea384c] text-white animate-pulse shadow-[0_0_15px_rgba(234,56,76,0.7)]'
                      : isGameKey 
                        ? 'bg-[#34D399] text-white hover:bg-[#10B981] shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                        : 'bg-white/10 text-white hover:bg-white/20'
                  } font-bold text-lg transition-colors 
                  duration-200 flex items-center justify-center
                  border ${
                    key === 'X' 
                      ? 'border-[#ea384c]/50' 
                      : isGameKey 
                        ? 'border-[#34D399]/50'
                        : 'border-white/10'
                  } backdrop-blur-sm
                  active:scale-95 transform`}
                  title={
                    key === 'X' 
                      ? 'Close all games' 
                      : isGameKey 
                        ? `Launch ${keyToGameMap[key].name}` 
                        : `Press ${key}`
                  }
                >
                  {key}
                </button>
              );
            })}
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
