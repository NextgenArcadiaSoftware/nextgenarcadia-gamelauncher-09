
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
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['A', 'B', 'C'],
    ['D', 'E', 'F'],
    ['G', 'H', 'I'],
    ['J', 'K', 'L'],
    ['M', 'N', 'O'],
    ['P', 'Q', 'R'],
    ['S', 'T', 'U'],
    ['V', 'W', 'X'],
    ['Y', 'Z', ' '],
  ];

  const isInputComplete = inputWord.length === 3;

  return (
    <div className="glass p-6 rounded-3xl w-full max-w-md">
      <div className="grid grid-cols-3 gap-4">
        {keys.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((key, keyIndex) => (
              <KeyboardButton
                key={`${rowIndex}-${keyIndex}`}
                onClick={() => key !== ' ' && onKeyPress(key)}
                disabled={isInputComplete || key === ' '}
              >
                {key === ' ' ? '' : key}
              </KeyboardButton>
            ))}
          </React.Fragment>
        ))}
        <KeyboardButton onClick={onBackspace}>
          <Delete className="w-6 h-6 mx-auto" />
        </KeyboardButton>
        <KeyboardButton onClick={onEnter} disabled={!isInputComplete}>
          <CornerDownLeft className="w-6 h-6 mx-auto" />
        </KeyboardButton>
      </div>
    </div>
  );
}
