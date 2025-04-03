
import React from 'react';
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
  const [connectionError, setConnectionError] = React.useState(false);
  const rows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const handleKeyClick = (key: string) => {
    console.log(`Virtual Keyboard - Sending key: ${key}`);
    
    // For the 'U' key, ensure we're sending the correct case
    const keyToSend = key === 'U' ? 'u' : key.toLowerCase();
    
    // For X key, use the close endpoint instead of keypress
    const endpoint = key === 'X' ? 'close' : 'keypress';
    const payload = key === 'X' ? {} : { key: keyToSend };
    
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
        description: key === 'X' ? "Terminating all games..." : `Launching game with key: ${key}`
      });
    })
    .catch(error => {
      console.error('Error sending keypress to C++ server:', error);
      setConnectionError(true);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Could not connect to the game launcher service"
      });
    });

    // Create and dispatch keyboard event
    const keyboardEvent = new KeyboardEvent('keydown', {
      key: keyToSend,
      code: `Key${key.toUpperCase()}`,
      keyCode: key.toUpperCase().charCodeAt(0),
      bubbles: true,
      cancelable: true,
      composed: true
    });
    document.dispatchEvent(keyboardEvent);

    // Call the provided callback
    onKeyPress(key);
  };

  return (
    <div className="p-4 bg-black/20 backdrop-blur-sm rounded-lg">
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
