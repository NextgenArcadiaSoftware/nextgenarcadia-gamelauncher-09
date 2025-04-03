
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
  const rows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const handleKeyClick = (key: string) => {
    console.log(`Timer Keyboard - Key pressed: ${key}`);
    
    // For X key, use the close endpoint instead of keypress
    const endpoint = key === 'X' ? 'close' : 'keypress';
    const payload = key === 'X' ? {} : { key: key.toLowerCase() };
    
    fetch(`http://localhost:5001/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setConnectionError(false);
      return response.json();
    })
    .then(data => {
      console.log('C++ server response:', data);
      toast({
        title: "Game Command",
        description: key === 'X' ? "Terminating all games..." : `Key sent: ${key}`
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
        description: "Could not connect to the game launcher service"
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
            Unable to connect to the game launcher service. Please check that the C++ server is running on port 5001.
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
