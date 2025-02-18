
import React from 'react';
import { Delete, CornerDownLeft } from 'lucide-react';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  inputWord: string;
  onExit?: () => void;
}

export function VirtualKeyboard({
  onKeyPress,
  onBackspace,
  onEnter,
  inputWord,
  onExit
}: VirtualKeyboardProps) {
  const rows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const sendKeyToServer = async (key: string) => {
    try {
      const response = await fetch("http://127.0.0.1:5001/keypress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ key: key.toLowerCase() }),
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`Key ${key} sent successfully to server`);
    } catch (error) {
      console.error('Error sending keystroke:', error);
    }
  };

  const handleKeyClick = async (key: string) => {
    console.log(`Virtual Keyboard - Sending key: ${key}`);
    
    // Handle Z key separately for exit
    if (key === 'Z' && onExit) {
      await sendKeyToServer('z');
      onExit();
      return;
    }
    
    // Send the key to the server
    await sendKeyToServer(key);

    // Dispatch keyboard event
    const keyboardEvent = new KeyboardEvent('keydown', {
      key: key.toLowerCase(),
      code: `Key${key.toUpperCase()}`,
      keyCode: key.toUpperCase().charCodeAt(0),
      bubbles: true,
      cancelable: true,
      composed: true
    });
    document.dispatchEvent(keyboardEvent);

    onKeyPress(key);
  };

  const handleBackspaceClick = async () => {
    await sendKeyToServer('backspace');
    onBackspace();
  };

  const handleEnterClick = async () => {
    await sendKeyToServer('enter');
    onEnter();
  };

  const handleSpaceClick = async () => {
    await sendKeyToServer(' ');
    onKeyPress(' ');
  };

  return (
    <div className="glass p-6 rounded-2xl py-[11px]">
      <div className="grid gap-2">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-2">
            {row.map(key => (
              <button
                key={key}
                onClick={() => handleKeyClick(key)}
                className="w-12 h-12 rounded-xl bg-white/80 hover:bg-white 
                          text-gray-800 font-medium text-lg transition-all 
                          duration-200 flex items-center justify-center
                          shadow-sm hover:shadow border border-gray-200/20
                          active:scale-95"
                data-key={key.toLowerCase()}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
        <div className="flex justify-center gap-2 mt-3">
          <button
            onClick={handleBackspaceClick}
            className="px-4 py-2 rounded-xl bg-white/80 hover:bg-white 
                     text-gray-800 transition-all duration-200 shadow-sm hover:shadow
                     border border-gray-200/20"
          >
            <Delete className="w-5 h-5" />
          </button>
          <button
            onClick={handleSpaceClick}
            className="px-16 py-2 rounded-xl bg-white/80 hover:bg-white 
                     text-gray-800 transition-all duration-200 shadow-sm hover:shadow
                     border border-gray-200/20"
          >
            Space
          </button>
          <button
            onClick={handleEnterClick}
            className="px-4 py-2 rounded-xl bg-white/80 hover:bg-white 
                     text-gray-800 transition-all duration-200 shadow-sm hover:shadow
                     border border-gray-200/20"
          >
            <CornerDownLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
