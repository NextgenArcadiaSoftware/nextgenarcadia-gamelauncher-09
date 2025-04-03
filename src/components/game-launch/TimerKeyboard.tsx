
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

  // Game launch mapping
  const keyGameMapping: Record<string, string> = {
    'E': 'Elven Assassin',
    'F': 'Fruit Ninja VR',
    'C': 'Crisis Brigade 2',
    'V': 'All-in-One Sports VR',
    'R': 'Richies Plank Experience',
    'I': 'iB Cricket',
    'U': 'Undead Citadel',
    'A': 'Arizona Sunshine',
    'S': 'Subside',
    'P': 'Propagation VR'
  };

  const handleKeyClick = (key: string) => {
    console.log(`Timer Keyboard - Key pressed: ${key}`);
    
    // Use port 5001 for the C++ server
    const serverUrl = 'http://localhost:5001'; 
    
    // Special handling for X key (close games)
    if (key === 'X') {
      fetch(`${serverUrl}/close`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: "CLOSE_GAME" })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setConnectionError(false);
        return response.text().then(text => {
          try {
            return JSON.parse(text);
          } catch (e) {
            return { message: text || "Command received" };
          }
        });
      })
      .then(data => {
        console.log('C++ server response:', data);
        setLastResponse(data.message || "Close command sent successfully");
        
        toast({
          title: "Game Command",
          description: "Terminating all games..."
        });
      })
      .catch(error => {
        console.error('Error sending close command to C++ server:', error);
        setConnectionError(true);
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Could not connect to the C++ server"
        });
        
        // Try electron method as fallback
        if (window.electron) {
          console.log("Falling back to Electron keypress simulation");
          window.electron.ipcRenderer.send('simulate-keypress', 'stop');
        }
      });
    } 
    // Regular key handling
    else {
      const keyLower = key.toLowerCase();
      
      fetch(`${serverUrl}/keypress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: keyLower })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setConnectionError(false);
        return response.text().then(text => {
          try {
            return JSON.parse(text);
          } catch (e) {
            return { message: text || `Key ${key} received` };
          }
        });
      })
      .then(data => {
        console.log('C++ server response:', data);
        
        // Check if this key launches a game
        const gameName = keyGameMapping[key];
        const message = gameName 
          ? `Launching ${gameName}...` 
          : `Key ${key} sent successfully`;
          
        setLastResponse(data.message || message);
        
        toast({
          title: "Game Command",
          description: message
        });
        
        // Create and dispatch a real DOM keyboard event
        const event = new KeyboardEvent("keydown", {
          key: keyLower,
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
          window.electron.ipcRenderer.send('simulate-keypress', keyLower);
        }
      });
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
              const isGameKey = keyGameMapping[key] !== undefined;
              const isXKey = key === 'X';
              
              let keyClass = "w-12 h-12 rounded-lg bg-white/10 text-white hover:bg-white/20 font-bold text-lg";
              let keyStyle = {};
              let keyTitle = "";
              
              if (isXKey) {
                keyClass = "w-12 h-12 rounded-lg bg-[#ea384c] text-white animate-pulse font-bold text-lg";
                keyStyle = { boxShadow: '0 0 15px rgba(234,56,76,0.7)' };
                keyTitle = "Close all games";
              } else if (isGameKey) {
                keyClass = "w-12 h-12 rounded-lg bg-blue-500 text-white hover:bg-blue-600 font-bold text-lg";
                keyStyle = { boxShadow: '0 0 15px rgba(59,130,246,0.5)' };
                keyTitle = `Launch ${keyGameMapping[key]}`;
              }
              
              return (
                <button
                  key={key}
                  onClick={() => handleKeyClick(key)}
                  className={`${keyClass} transition-colors duration-200 flex items-center justify-center
                  border ${isXKey ? 'border-[#ea384c]/50' : isGameKey ? 'border-blue-500/30' : 'border-white/10'} backdrop-blur-sm
                  active:scale-95 transform`}
                  style={keyStyle}
                  title={keyTitle}
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
