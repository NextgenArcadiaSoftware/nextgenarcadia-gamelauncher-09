
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Keyboard, Timer, Play, X, Activity, Settings, Eye, EyeOff, Server } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TimerDisplay } from '@/components/game-launch/TimerDisplay';
import { RatingScreen } from '@/components/game-launch/RatingScreen';
import { supabase } from '@/integrations/supabase/client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

const GAME_KEYS = {
  "f": {
    name: "Fruit Ninja",
    image: "/lovable-uploads/9b088570-531a-47cf-b176-28bb534ba66f.png"
  },
  "c": {
    name: "Crisis VRigade 2",
    image: "/lovable-uploads/bb8b5b5b-bf33-4e0c-b9af-a05408636bce.png"
  },
  "s": {
    name: "Subside Demo",
    image: "/lovable-uploads/be53debf-e66a-4b71-8445-6a4694a2d95e.png"
  },
  "p": {
    name: "Richie's Plank Experience",
    image: "/lovable-uploads/cf7a9406-76de-470d-971d-ebb18c291622.png"
  },
  "i": {
    name: "iBCricket",
    image: "/lovable-uploads/f8c126a3-87f1-4ea8-b8d8-76597554d0be.png"
  },
  "a": {
    name: "Arizona Sunshine",
    image: "/lovable-uploads/4e2b1ea9-0729-4f84-b8c4-974e08cd8c30.png"
  },
  "u": {
    name: "Undead Citadel Demo",
    image: "/lovable-uploads/cac2759b-8463-4e08-b1ea-aeb608ac84a9.png"
  },
  "e": {
    name: "Elven Assassin",
    image: "/lovable-uploads/b2c65729-f024-40c7-9c6e-dc2b75f1c789.png"
  },
  "r": {
    name: "RollerCoaster Legends",
    image: "/lovable-uploads/ad0b4a73-7182-4cd0-a370-e527f21a9f87.png"
  },
  "v": {
    name: "All-In-One Sports VR",
    image: "/lovable-uploads/f12eb427-db97-42db-975b-2ccadfb41224.png"
  },
  "g": {
    name: "Creed Rise to Glory",
    image: "/lovable-uploads/af1a36b9-7e7b-4f03-814d-ea2c073181e0.png"
  },
  "w": {
    name: "Beat Saber",
    image: "/lovable-uploads/2f7ba916-4fc9-4136-b3cc-9f1e2ba0be94.png"
  },
  "z": {
    name: "Close All Games",
    image: ""
  }
};

const CppLauncher: React.FC = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [showTimer, setShowTimer] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [timerDuration, setTimerDuration] = useState(300); // Default 5 minutes, will be overridden by settings
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch global timer settings on component mount
  useEffect(() => {
    const fetchTimerSettings = async () => {
      try {
        // Fetch the timer settings from the settings table
        const { data, error } = await supabase
          .from('settings')
          .select('timer_duration')
          .eq('id', 1)
          .single();
        
        if (error) {
          console.error('Error fetching timer settings:', error);
          return;
        }
        
        if (data && data.timer_duration) {
          // Convert from minutes to seconds
          const durationInSeconds = data.timer_duration * 60;
          console.log(`Using timer duration from settings: ${data.timer_duration} minutes (${durationInSeconds} seconds)`);
          setTimerDuration(durationInSeconds);
        }
      } catch (error) {
        console.error('Error fetching timer settings:', error);
      }
    };
    
    fetchTimerSettings();
    checkServerConnection();
    
    const intervalId = setInterval(checkServerConnection, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  const checkServerConnection = async () => {
    setServerStatus('checking');
    try {
      const res = await fetch(`${API_URL}/keypress`, {
        method: 'HEAD',
        signal: AbortSignal.timeout(2000)
      });
      
      if (res.ok || res.status === 404) {
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
        
        const gameName = GAME_KEYS[key as keyof typeof GAME_KEYS].name;
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
    // Show rating screen instead of immediately closing games
    setShowRating(true);
    setShowTimer(false);
  };

  const handleRatingSubmit = async (rating: number) => {
    // Close games after rating
    await closeGames();
    
    // Show toast with rating
    toast({
      title: "Thank You!",
      description: `You rated ${activeGame} ${rating} stars.`,
    });
    
    // Navigate to home page
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  // Show rating screen
  if (showRating && activeGame) {
    return (
      <RatingScreen 
        activeGame={activeGame} 
        onSubmit={handleRatingSubmit} 
      />
    );
  }

  // Show timer display
  if (showTimer && activeGame) {
    return (
      <TimerDisplay 
        timeLeft={timerDuration} 
        activeGame={activeGame} 
        onExit={handleTimerExit} 
      />
    );
  }

  // Main launcher UI
  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-[#1A1F2C] to-[#2A2F3C] min-h-screen text-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA] bg-clip-text text-transparent">
            VR Game Control Center
          </h1>
          <Button 
            variant="outline" 
            className="border-[#7E69AB]/50 text-[#D6BCFA] hover:bg-[#33274F]/50 text-lg"
            onClick={() => navigate('/game-flow')}
          >
            Try New Game Flow
          </Button>
        </div>
        
        <Card className="bg-[#222232] border-[#33274F] text-white shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-[#D6BCFA] text-2xl">VR Game Library</CardTitle>
            <CardDescription className="text-[#9b87f5]/80 text-base">
              Select a game to launch in VR
            </CardDescription>
          </CardHeader>
          <Separator className="bg-[#6E59A5]/30 mb-2" />
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Object.entries(GAME_KEYS).filter(([k]) => k !== 'z').map(([key, game]) => (
                <Button 
                  key={key}
                  onClick={() => sendKey(key)}
                  disabled={loading}
                  className="flex flex-col items-center justify-center h-40 p-0 
                             bg-[#222232] hover:bg-[#33274F]
                             border border-[#7E69AB]/30 shadow-md
                             transition-all duration-300 group relative rounded-xl"
                >
                  <div className="absolute inset-0 w-full h-full">
                    <img 
                      src={game.image || "/placeholder.svg"} 
                      alt={game.name}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#222232] via-[#222232]/60 to-transparent" />
                  </div>
                  
                  <div className="relative z-10 flex flex-col items-center justify-center h-full w-full p-2">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#7E69AB] mb-2 group-hover:bg-[#9b87f5] transition-colors">
                      <Keyboard className="h-8 w-8 text-white group-hover:hidden" />
                      <Play className="h-8 w-8 text-white hidden group-hover:block" />
                    </div>
                    <span className="text-2xl font-bold text-[#D6BCFA] group-hover:text-white">{key.toUpperCase()}</span>
                    <span className="text-sm text-center text-[#E5DEFF]/80 group-hover:text-white/90 transition-colors mt-1">{game.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              onClick={closeGames} 
              variant="destructive"
              className="bg-[#ea384c] hover:bg-[#c01933] text-white px-8 text-lg"
              disabled={loading}
            >
              <X className="mr-2 h-6 w-6" /> Close All Games
            </Button>
          </CardFooter>
        </Card>

        {serverStatus === 'disconnected' && (
          <Card className="bg-red-900/20 border-red-700 text-white mb-8 animate-pulse">
            <CardContent className="p-4 flex items-center">
              <div>
                <h3 className="text-xl font-semibold text-red-300">Server Connection Issue</h3>
                <p className="text-base text-red-200/80">
                  Unable to connect to the game server. Service may be unavailable.
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={checkServerConnection}
                className="ml-auto border-red-700 bg-red-900/50 text-red-300 hover:bg-red-800 text-base"
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
