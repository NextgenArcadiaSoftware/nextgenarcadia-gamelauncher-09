
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Keyboard, Timer, Play, X, Activity, Settings, Eye, EyeOff, Server } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TimerDisplay } from '@/components/game-launch/TimerDisplay';

// Using the Python server port now
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

// Game key mappings
const GAME_KEYS = {
  "f": "Fruit Ninja",
  "c": "Crisis VRigade 2",
  "s": "Subside Demo",
  "p": "Richie's Plank Experience",
  "i": "iBCricket",
  "a": "Arizona Sunshine",
  "u": "Undead Citadel Demo",
  "e": "Elven Assassin",
  "r": "RollerCoaster Legends",
  "v": "All-In-One Sports VR",
  "g": "Creed Rise to Glory",
  "w": "Beat Saber",
  "z": "Close All Games"
};

const CppLauncher: React.FC = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [showTimer, setShowTimer] = useState(false);
  const [timerDuration, setTimerDuration] = useState(300); // 5 minutes default
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check server connectivity on component mount
  useEffect(() => {
    checkServerConnection();
    
    // Set up periodic health checks
    const intervalId = setInterval(checkServerConnection, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  const checkServerConnection = async () => {
    setServerStatus('checking');
    try {
      // Use a HEAD request instead of POST to /close
      const res = await fetch(`${API_URL}/keypress`, {
        method: 'HEAD',
        signal: AbortSignal.timeout(2000) // 2 second timeout
      });
      
      if (res.ok || res.status === 404) {
        // Even a 404 means the server is running
        setServerStatus('connected');
        console.log("Server health check successful");
      } else {
        setServerStatus('disconnected');
        console.error("Server returned error:", res.status, res.statusText);
      }
    } catch (error) {
      setServerStatus('disconnected');
      console.error('Error checking server connection:', error);
    }
  };

  const handleTestConnection = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setResponse(JSON.stringify(data, null, 2));
        toast({
          title: "Connection Successful",
          description: "Successfully connected to the Python key listener",
        });
      } else {
        setResponse(`Error: ${res.status} ${res.statusText}`);
        toast({
          title: "Connection Failed",
          description: `Error: ${res.status} ${res.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error connecting to Python server:', error);
      setResponse(`Error: ${error instanceof Error ? error.message : String(error)}`);
      toast({
        title: "Connection Failed",
        description: `Could not connect to the server at ${API_URL}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendKey = async (key: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/keypress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setResponse(JSON.stringify(data, null, 2));
        
        // Set the active game and show timer
        const gameName = GAME_KEYS[key as keyof typeof GAME_KEYS];
        setActiveGame(gameName);
        setShowTimer(true);
        
        toast({
          title: "Game Launched",
          description: `Successfully sent key "${key}" to launch ${gameName}`,
        });
      } else {
        const errorText = await res.text();
        setResponse(`Error: ${res.status} ${res.statusText}\n${errorText}`);
        toast({
          title: "Key Send Failed",
          description: `Error: ${res.status} ${res.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending key to Python server:', error);
      setResponse(`Error: ${error instanceof Error ? error.message : String(error)}`);
      toast({
        title: "Key Send Failed",
        description: `Could not send key to the server at ${API_URL}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const closeGames = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setResponse(JSON.stringify(data, null, 2));
        
        // Reset active game and hide timer
        setActiveGame(null);
        setShowTimer(false);
        
        toast({
          title: "Games Closed",
          description: "Successfully sent close command to terminate all games",
        });
      } else {
        setResponse(`Error: ${res.status} ${res.statusText}`);
        toast({
          title: "Close Command Failed",
          description: `Error: ${res.status} ${res.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending close command to Python server:', error);
      setResponse(`Error: ${error instanceof Error ? error.message : String(error)}`);
      toast({
        title: "Close Command Failed",
        description: `Could not send close command to the server at ${API_URL}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTimerExit = () => {
    closeGames();
    setShowTimer(false);
  };

  if (showTimer && activeGame) {
    return (
      <TimerDisplay 
        timeLeft={timerDuration} 
        activeGame={activeGame} 
        onExit={handleTimerExit} 
      />
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-[#1A1F2C] to-[#2A2F3C] min-h-screen text-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA] bg-clip-text text-transparent">
            VR Game Control Center
          </h1>
          <Button 
            variant="outline" 
            className="border-[#7E69AB]/50 text-[#D6BCFA] hover:bg-[#33274F]/50"
            onClick={() => navigate('/game-flow')}
          >
            Try New Game Flow
          </Button>
        </div>
        
        <Card className="bg-[#222232] border-[#33274F] text-white shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-[#D6BCFA]">VR Game Library</CardTitle>
            <CardDescription className="text-[#9b87f5]/80">
              Select a game to launch in VR
            </CardDescription>
          </CardHeader>
          <Separator className="bg-[#6E59A5]/30 mb-2" />
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Object.entries(GAME_KEYS).filter(([k]) => k !== 'z').map(([key, gameName]) => (
                <Button 
                  key={key}
                  onClick={() => sendKey(key)}
                  disabled={loading}
                  className="flex flex-col items-center justify-center h-28 
                           bg-gradient-to-br from-[#33274F] to-[#222232]
                           hover:from-[#6E59A5] hover:to-[#33274F]
                           border border-[#7E69AB]/30 shadow-md
                           transition-all duration-300 group"
                >
                  <div className="relative">
                    <Keyboard className="h-6 w-6 mb-1 text-[#9b87f5] group-hover:opacity-0 
                                        transition-opacity duration-300 absolute top-0 left-1/2 -translate-x-1/2" />
                    <Play className="h-6 w-6 mb-1 text-white opacity-0 group-hover:opacity-100 
                                   transition-opacity duration-300 absolute top-0 left-1/2 -translate-x-1/2" />
                  </div>
                  <div className="h-6" /> {/* Spacer for icon */}
                  <span className="text-lg font-bold text-[#D6BCFA] group-hover:text-white">{key.toUpperCase()}</span>
                  <span className="text-xs text-center text-[#E5DEFF]/80 group-hover:text-white/90 transition-colors">{gameName}</span>
                </Button>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              onClick={closeGames} 
              variant="destructive"
              className="bg-[#ea384c] hover:bg-[#c01933] text-white px-8"
              disabled={loading}
            >
              <X className="mr-2 h-5 w-5" /> Close All Games
            </Button>
          </CardFooter>
        </Card>

        {serverStatus === 'disconnected' && (
          <Card className="bg-red-900/20 border-red-700 text-white mb-8 animate-pulse">
            <CardContent className="p-4 flex items-center">
              <div>
                <h3 className="text-lg font-semibold text-red-300">Server Connection Issue</h3>
                <p className="text-sm text-red-200/80">
                  Unable to connect to the game server. Service may be unavailable.
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={checkServerConnection}
                className="ml-auto border-red-700 bg-red-900/50 text-red-300 hover:bg-red-800"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CppLauncher;
