
import { useEffect, useState } from 'react';
import { useToast } from '../ui/use-toast';
import { ArrowLeft, Power } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { launchGameByCode, closeGames, gameLaunchCodes, checkServerHealth } from '@/services/GameService';
import { Alert, AlertDescription } from '../ui/alert';

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
  const [rfidInput, setRfidInput] = useState('');
  const [serverStatus, setServerStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [serverResponse, setServerResponse] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get the launch code for the current game
  const gameCode = gameLaunchCodes[game.title] || "x";

  // Check server connectivity on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isHealthy = await checkServerHealth(0, true); // silent mode
        setServerStatus(isHealthy ? 'connected' : 'error');
      } catch (error) {
        setServerStatus('error');
      }
    };
    
    checkConnection();
    
    // Check connection periodically
    const intervalId = setInterval(checkConnection, 10000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!gameLaunchCodes[game.title]) {
      navigate('/unknown-game');
      return;
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      if (/^\d$/.test(event.key)) {
        setRfidInput(prev => {
          const newInput = prev + event.key;
          // Check if we have a complete RFID number (10+ digits)
          if (newInput.length >= 10) {
            setShowLaunchScreen(true);
            // Using setTimeout to avoid the React state update during render issue
            setTimeout(() => {
              toast({
                title: "✅ RFID Card Detected",
                description: "You can now launch the game"
              });
            }, 0);
            return '';
          }
          return newInput;
        });
        return;
      }

      if (event.key.toLowerCase() === gameCode && showLaunchScreen) {
        handleGameStart();
      }
    };
    
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [game.title, showLaunchScreen, toast, onContinue, gameCode, navigate]);

  const handleGameStart = async () => {
    try {
      if (serverStatus === 'connected') {
        // Send launch command to C++ server
        const result = await launchGameByCode(gameCode);
        setServerResponse(`Game launch successful: ${result.message || "Game starting..."}`);
        
        toast({
          title: "🎮 Game Starting",
          description: "Launch command sent to C++ server"
        });
      } else {
        setServerResponse("C++ server not connected. Using fallback method...");
        
        toast({
          title: "⚠️ Server Unavailable",
          description: "Using fallback launch method"
        });
        
        // Try fallback method through Electron if available
        if (window.electron) {
          window.electron.ipcRenderer.send('simulate-keypress', gameCode);
        }
      }
      
      // Continue with the regular flow
      onContinue();
    } catch (error) {
      console.error("Error launching game:", error);
      setServerResponse(`Error: ${error instanceof Error ? error.message : String(error)}`);
      
      toast({
        title: "❌ Launch Error",
        description: "Failed to communicate with game server",
        variant: "destructive"
      });
      
      // Still continue with the regular flow
      onContinue();
    }
  };
  
  const handleEmergencyStop = async () => {
    try {
      const result = await closeGames();
      setServerResponse(`Games stopped: ${result.message || "All games closed successfully"}`);
      
      toast({
        title: "🛑 Emergency Stop",
        description: "All games have been terminated",
        variant: "destructive"
      });
    } catch (error) {
      console.error("Error stopping games:", error);
      setServerResponse(`Error stopping games: ${error instanceof Error ? error.message : String(error)}`);
      
      // Try fallback method
      if (window.electron) {
        window.electron.ipcRenderer.send('end-game');
      }
      
      toast({
        title: "⚠️ Stop Error",
        description: "Using fallback method to terminate games",
        variant: "destructive"
      });
    }
  };

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
              
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => navigate('/')}
                  className="w-64 h-32 flex flex-col items-center justify-center bg-white/80 text-black hover:bg-white rounded-2xl border-4 border-white/20 backdrop-blur-sm gap-2 font-bold shadow-lg transition-all duration-200 hover:scale-105"
                  style={{
                    boxShadow: '0 0 25px 5px rgba(255, 255, 255, 0.4), 0 0 10px 1px rgba(255, 255, 255, 0.7)'
                  }}
                >
                  <ArrowLeft className="h-8 w-8" />
                  <span>Back to Games</span>
                </button>
                
                <button 
                  onClick={handleEmergencyStop}
                  className="w-64 h-32 flex flex-col items-center justify-center bg-red-500/80 text-white hover:bg-red-600 rounded-2xl border-4 border-red-400/20 backdrop-blur-sm gap-2 font-bold shadow-lg transition-all duration-200 hover:scale-105"
                  style={{
                    boxShadow: '0 0 25px 5px rgba(239, 68, 68, 0.4), 0 0 10px 1px rgba(239, 68, 68, 0.7)'
                  }}
                >
                  <Power className="h-8 w-8" />
                  <span>Emergency Stop</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {serverResponse && (
          <div className="fixed bottom-8 left-8 right-8 mx-auto max-w-2xl">
            <Alert variant={serverStatus === 'error' ? "destructive" : "default"} className="bg-black/70 border border-white/20">
              <AlertDescription className="font-mono text-sm">
                {serverResponse}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    );
  }

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
              
              {serverStatus === 'connected' ? (
                <span className="inline-block px-4 py-1 rounded-full text-sm text-green-100 bg-green-500/30 backdrop-blur-sm border border-green-500/30">
                  Server Connected
                </span>
              ) : serverStatus === 'connecting' ? (
                <span className="inline-block px-4 py-1 rounded-full text-sm text-yellow-100 bg-yellow-500/30 backdrop-blur-sm border border-yellow-500/30">
                  Connecting...
                </span>
              ) : (
                <span className="inline-block px-4 py-1 rounded-full text-sm text-red-100 bg-red-500/30 backdrop-blur-sm border border-red-500/30">
                  Server Unavailable
                </span>
              )}
            </div>
          </div>

          <div className="text-center">
            <p className="text-white/90 text-xl leading-relaxed">
              {game.description}
            </p>
          </div>

          <div className="flex flex-col items-center gap-8 mt-8">
            <div className="flex gap-6">
              <Button 
                onClick={handleGameStart}
                size="lg" 
                className="w-48 h-16 text-2xl font-bold bg-blue-600 hover:bg-blue-700 transform transition-all duration-200 hover:scale-105"
              >
                Start Game
              </Button>
              
              <Button 
                onClick={handleEmergencyStop}
                size="lg" 
                variant="destructive"
                className="w-48 h-16 text-2xl font-bold transform transition-all duration-200 hover:scale-105"
              >
                Stop Games
              </Button>
            </div>
            
            {serverResponse && (
              <Alert variant={serverStatus === 'error' ? "destructive" : "default"} className="bg-black/70 border border-white/20 max-w-lg">
                <AlertDescription className="font-mono text-sm">
                  {serverResponse}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
