
import { useEffect, useState } from 'react';
import { useToast } from '../ui/use-toast';
import { VirtualKeyboard } from './VirtualKeyboard';

interface GameLaunchScreenProps {
  game: {
    title: string;
    description: string;
    thumbnail: string;
    genre: string;
  };
  onContinue: () => void;
}

export function GameLaunchScreen({
  game,
  onContinue
}: GameLaunchScreenProps) {
  const [showLaunchScreen, setShowLaunchScreen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (/^\d$/.test(event.key) && !showLaunchScreen) {
        toast({
          title: "✨ RFID Detected",
          description: `${game.title} is ready to launch`
        });
        setShowLaunchScreen(true);
      }

      // Handle F key press directly in the event listener
      if (event.key.toLowerCase() === 'f') {
        console.log('F key pressed through keyboard event');
        simulateFPress();
      }
    };
    
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [game.title, showLaunchScreen, toast]);

  const simulateFPress = () => {
    console.log('Simulating F key press');
    
    // Create a temporary input field
    const inputField = document.createElement('input');
    document.body.appendChild(inputField);
    inputField.focus();
    
    // Simulate keydown event
    const keyDownEvent = new KeyboardEvent('keydown', {
      key: 'f',
      code: 'KeyF',
      keyCode: 70,
      which: 70,
      bubbles: true,
      cancelable: true
    });
    inputField.dispatchEvent(keyDownEvent);
    
    // Simulate keypress event
    const keyPressEvent = new KeyboardEvent('keypress', {
      key: 'f',
      code: 'KeyF',
      keyCode: 70,
      which: 70,
      bubbles: true,
      cancelable: true
    });
    inputField.dispatchEvent(keyPressEvent);
    
    // Set the value and trigger input event
    inputField.value = 'f';
    inputField.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Simulate keyup event
    const keyUpEvent = new KeyboardEvent('keyup', {
      key: 'f',
      code: 'KeyF',
      keyCode: 70,
      which: 70,
      bubbles: true,
      cancelable: true
    });
    inputField.dispatchEvent(keyUpEvent);
    
    // Clean up
    document.body.removeChild(inputField);
    
    // Also send via Electron IPC if available
    if (window.electron) {
      console.log('Sending F key press to electron main process');
      window.electron.ipcRenderer.send('simulate-keypress', 'f');
    }
    
    toast({
      title: "Key Press Sent",
      description: "F key press registered"
    });
    
    onContinue();
  };

  const handleKeyPress = (key: string) => {
    if (key.toLowerCase() === 'f') {
      simulateFPress();
    }
  };

  // RFID Detection Screen
  if (!showLaunchScreen) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 opacity-80" />
          <div className="absolute inset-0 mix-blend-overlay opacity-30">
            <img src={game.thumbnail} alt={`${game.title} Background`} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="relative z-10 max-w-4xl w-full mx-auto p-8">
          <div className="glass p-8 rounded-3xl space-y-8 relative overflow-hidden border border-white/20">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-white mb-4 font-display" style={{
                textShadow: '0 0 20px rgba(59,130,246,0.5), 0 0 40px rgba(59,130,246,0.3)'
              }}>
                {game.title}
              </h1>
            </div>

            <div className="space-y-8">
              <div className="animate-[pulse_2s_ease-in-out_infinite] text-white text-4xl font-bold py-4 text-center tracking-wide">
                TAP RFID CARD TO START
              </div>
              <div className="flex justify-center">
                <div className="w-32 h-32 flex items-center justify-center bg-blue-500/20 rounded-2xl border-4 border-white/20 backdrop-blur-sm">
                  <span className="text-4xl text-white">🎮</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game launch screen
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 opacity-80" />
        <div className="absolute inset-0 mix-blend-overlay opacity-30">
          <img src={game.thumbnail} alt={`${game.title} Background`} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl w-full mx-auto p-8">
        <div className="glass p-8 rounded-3xl space-y-8 relative overflow-hidden border border-white/20">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4 font-display" style={{
              textShadow: '0 0 20px rgba(59,130,246,0.5), 0 0 40px rgba(59,130,246,0.3)'
            }}>
              {game.title}
            </h1>
            <div className="flex justify-center gap-4">
              <span className="inline-block px-4 py-1 rounded-full text-sm text-white/90 bg-blue-500/30 backdrop-blur-sm border border-blue-500/30">
                Virtual Reality
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-white/90 text-xl leading-relaxed">
              {game.description}
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 mt-8">
            <div className="animate-[pulse_2s_ease-in-out_infinite] text-white text-2xl font-bold">
              Press F When Ready
            </div>
            <button 
              onClick={simulateFPress} 
              className="w-32 h-32 text-6xl font-bold text-white bg-blue-500 rounded-2xl hover:bg-blue-600 transform transition-all duration-200 hover:scale-105 active:scale-95 border-4 border-white/20"
            >
              F
            </button>
          </div>

          <div className="mt-8">
            <VirtualKeyboard
              onKeyPress={handleKeyPress}
              onBackspace={() => {}}
              onEnter={() => {}}
              inputWord=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
