
import React from 'react';
import { Delete, CornerDownLeft } from 'lucide-react';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  inputWord: string;
}

export function VirtualKeyboard({ onKeyPress, onBackspace, onEnter, inputWord }: VirtualKeyboardProps) {
  const rows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const handleKeyClick = (key: string) => {
    console.log(`Sending key: ${key}`);
    
    // Send key press to Flask server
    fetch("http://127.0.0.1:5001/keypress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: key.toLowerCase() })
    })
    .then(response => response.json())
    .then(data => console.log('Server response:', data))
    .catch(error => console.error('Error:', error));

    // Dispatch DOM event for frontend
    const keydownEvent = new KeyboardEvent('keydown', {
      key: key.toLowerCase(),
      code: `Key${key.toUpperCase()}`,
      keyCode: key.charCodeAt(0),
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(keydownEvent);

    // Call the provided callback
    onKeyPress(key);
  };

  return (
    <div className="p-4 bg-black/20 backdrop-blur-sm rounded-lg">
      <div className="grid gap-2">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyClick(key)}
                className="w-12 h-12 rounded-lg bg-white/10 hover:bg-white/20 
                          text-white font-bold text-lg transition-colors 
                          duration-200 flex items-center justify-center
                          border border-white/10 backdrop-blur-sm
                          active:scale-95 transform"
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
