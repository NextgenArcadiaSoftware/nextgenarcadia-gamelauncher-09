
import React from 'react';
import { Delete, CornerDownLeft } from 'lucide-react';
import { KeyboardButton } from './KeyboardButton';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  inputWord: string;
}

export function VirtualKeyboard({ onKeyPress, onBackspace, onEnter, inputWord }: VirtualKeyboardProps) {
  const keys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const isInputComplete = inputWord.length === 3;

  const simulateKeyPress = (key: string) => {
    // Create and dispatch keydown event
    const keydownEvent = new KeyboardEvent('keydown', {
      key: key,
      code: `Key${key}`,
      keyCode: key.charCodeAt(0),
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(keydownEvent);

    // Create and dispatch keyup event
    const keyupEvent = new KeyboardEvent('keyup', {
      key: key,
      code: `Key${key}`,
      keyCode: key.charCodeAt(0),
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(keyupEvent);

    // Also send to electron for the Python backend
    if (window.electron) {
      window.electron.ipcRenderer.send('simulate-keypress', key);
    }
  };

  const handleKeyPress = (key: string) => {
    simulateKeyPress(key);
    onKeyPress(key);
  };

  const handleBackspace = () => {
    // Simulate backspace key press
    const backspaceEvent = new KeyboardEvent('keydown', {
      key: 'Backspace',
      code: 'Backspace',
      keyCode: 8,
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(backspaceEvent);
    
    if (window.electron) {
      window.electron.ipcRenderer.send('simulate-keypress', 'backspace');
    }
    onBackspace();
  };

  const handleEnter = () => {
    // Simulate enter key press
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(enterEvent);
    
    if (window.electron) {
      window.electron.ipcRenderer.send('simulate-keypress', 'enter');
    }
    onEnter();
  };

  return (
    <div className="glass p-6 rounded-3xl w-full max-w-3xl">
      <div className="space-y-2">
        {keys.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {rowIndex === 2 && <div className="w-8" />} {/* Shift spacing */}
            {row.map((key) => (
              <KeyboardButton
                key={key}
                onClick={() => handleKeyPress(key)}
                disabled={isInputComplete}
              >
                {key}
              </KeyboardButton>
            ))}
            {rowIndex === 2 && (
              <KeyboardButton onClick={handleBackspace}>
                <Delete className="w-4 h-4" />
              </KeyboardButton>
            )}
          </div>
        ))}
        <div className="flex justify-between gap-1 mt-1">
          <KeyboardButton onClick={() => {}} disabled>123</KeyboardButton>
          <KeyboardButton onClick={() => {}} disabled>🌐</KeyboardButton>
          <KeyboardButton variant="wide" onClick={() => {}} disabled>space</KeyboardButton>
          <KeyboardButton onClick={() => {}} disabled>.</KeyboardButton>
          <KeyboardButton onClick={handleEnter} disabled={!isInputComplete}>
            Go
          </KeyboardButton>
        </div>
      </div>
    </div>
  );
}
