import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Play, X, Gamepad } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TimerDisplay } from './TimerDisplay';
import { RatingScreen } from './RatingScreen';
import { supabase } from '@/integrations/supabase/client';
import placeholderImage from '@/assets/placeholder.svg';

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

export const GameSelectionFlow: React.FC = () => {
  const [showRFIDScreen, setShowRFIDScreen] = useState(true);
  const [showGameSelection, setShowGameSelection] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [timerDuration, setTimerDuration] = useState(300); // Default 5 minutes
  const [loading, setLoading] = useState(false);
  const [rfidInput, setRfidInput] = useState('');
  const [serverStatus, setServerStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [showRating, setShowRating] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTimerSettings = async () => {
      try {
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

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (showRFIDScreen && /^\d$/.test(event.key)) {
        setRfidInput(prev => {
          const newInput = prev + event.key;
          if (newInput.length >= 10) {
            handleRFIDSuccess();
            return '';
          }
          return newInput;
        });
      }
    };
    
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [showRFIDScreen]);

  const handleRFIDSuccess = () => {
    setShowRFIDScreen(false);
    setShowGameSelection(true);
    toast({
      title: "✅ RFID Card Detected",
      description: "You can now select a game to play"
    });
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
        const gameName = GAME_KEYS[key as keyof typeof GAME_KEYS].name;
        setActiveGame(gameName);
        setShowGameSelection(false);
        setShowTimer(true);
        
        await createGameSession(gameName);
        
        toast({
          title: "Game Launched",
          description: `Successfully launched ${gameName}`,
        });
      } else {
        toast({
          title: "Game Launch Failed",
          description: `Error: ${res.status} ${res.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending key to Python server:', error);
      toast({
        title: "Game Launch Failed",
        description: `Could not connect to the server at ${API_URL}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createGameSession = async (gameName: string) => {
    try {
      const { data: gameData } = await supabase
        .from('games')
        .select('id')
        .eq('title', gameName)
        .single();

      if (!gameData) {
        console.error('Game not found:', gameName);
        return;
      }

      const { data: existingSessions } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('game_id', gameData.id)
        .is('completed', false)
        .limit(1);

      if (existingSessions && existingSessions.length > 0) {
        console.log('Active session already exists for this game');
        return;
      }

      console.log('Creating new session for game:', gameName);
      
      const durationInMinutes = Math.ceil(timerDuration / 60);
      
      const { error } = await supabase
        .from('game_sessions')
        .insert({
          game_id: gameData.id,
          duration: durationInMinutes,
          completed: false
        });
      
      if (error) {
        console.error('Error creating game session:', error);
      } else {
        console.log('Game session created successfully');
      }
    } catch (error) {
      console.error('Error creating game session:', error);
    }
  };

  const markSessionComplete = async () => {
    if (!activeGame) return;
    
    try {
      const { data: gameData } = await supabase
        .from('games')
        .select('id')
        .eq('title', activeGame)
        .single();

      if (gameData) {
        console.log('Marking session complete for game:', activeGame);
        const { error } = await supabase
          .from('game_sessions')
          .update({ 
            completed: true,
            ended_at: new Date().toISOString()
          })
          .eq('game_id', gameData.id)
          .is('completed', false)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (error) {
          console.error('Error marking session as completed:', error);
        } else {
          console.log('Session marked as completed successfully');
        }
      }
    } catch (error) {
      console.error('Error marking session as completed:', error);
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
        if (activeGame) {
          await markSessionComplete();
        }
        
        setShowTimer(false);
        setShowRating(true);
        
        toast({
          title: "Games Closed",
          description: "Successfully closed all games",
        });
      } else {
        toast({
          title: "Close Command Failed",
          description: `Error: ${res.status} ${res.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending close command to Python server:', error);
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
  };

  const handleRatingSubmit = (rating: number) => {
    toast({
      title: "Thank You!",
      description: `You rated ${activeGame} ${rating} stars.`,
    });
    
    setActiveGame(null);
    setShowRating(false);
    setShowGameSelection(true);
  };

  const handleReturnToLibrary = () => {
    navigate('/');
  };

  if (showRating && activeGame) {
    return (
      <RatingScreen
        activeGame={activeGame}
        onSubmit={handleRatingSubmit}
      />
    );
  }

  if (showRFIDScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#1A1F2C] to-[#2A2F3C] flex flex-col items-center justify-center z-50">
        <div className="text-center max-w-3xl mx-auto p-8">
          <h1 className="text-4xl font-bold text-[#D6BCFA] mb-6">Welcome to VR Game Center</h1>
          <div className="glass p-8 rounded-3xl space-y-8 relative overflow-hidden border border-white/20 bg-[#222232]/50 backdrop-blur-xl">
            <div className="animate-[pulse_2s_ease-in-out_infinite] text-white text-3xl font-bold py-4 text-center tracking-wide">
              TAP RFID CARD TO START
            </div>
            <div className="text-xl text-white/80 mb-8">
              Please tap your RFID card on the reader to begin your VR gaming session
            </div>
            
            <Button 
              onClick={handleRFIDSuccess}
              className="mx-auto bg-[#6E59A5] hover:bg-[#7E69AB] text-white p-8 h-auto text-xl font-bold"
            >
              Simulate RFID Card Tap
            </Button>
            
            <div className="mt-8">
              <Button variant="outline" onClick={handleReturnToLibrary}>
                Return to Library
              </Button>
            </div>
          </div>
        </div>
        
        {serverStatus === 'disconnected' && (
          <Card className="fixed bottom-4 left-4 bg-red-900/20 border-red-700 text-white max-w-md animate-pulse">
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
    );
  }

  if (showGameSelection) {
    return (
      <div className="container mx-auto p-4 bg-gradient-to-br from-[#1A1F2C] to-[#2A2F3C] min-h-screen text-white">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA] bg-clip-text text-transparent">
            Select Your VR Game
          </h1>
          
          <Card className="bg-[#222232] border-[#33274F] text-white shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-[#D6BCFA]">VR Game Library</CardTitle>
              <CardDescription className="text-[#9b87f5]/80">
                Click on a game to launch in VR
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
                    className="flex flex-col items-center justify-center h-40 p-0 overflow-hidden
                             bg-[#222232] hover:bg-[#33274F]
                             border border-[#7E69AB]/30 shadow-md
                             transition-all duration-300 group relative rounded-xl"
                  >
                    <div className="absolute inset-0 w-full h-full">
                      <img 
                        src={game.image || placeholderImage} 
                        alt={game.name}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = placeholderImage;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#222232] via-[#222232]/60 to-transparent" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center justify-center h-full w-full p-2">
                      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#7E69AB] mb-2 group-hover:bg-[#9b87f5] transition-colors">
                        <Gamepad className="h-5 w-5 text-white group-hover:hidden" />
                        <Play className="h-5 w-5 text-white hidden group-hover:block" />
                      </div>
                      <span className="text-lg font-bold text-[#D6BCFA] group-hover:text-white">{key.toUpperCase()}</span>
                      <span className="text-xs text-center text-[#E5DEFF]/80 group-hover:text-white/90 transition-colors mt-1">{game.name}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                onClick={handleReturnToLibrary}
                variant="outline"
                className="border-[#7E69AB]/50 text-[#D6BCFA] hover:bg-[#33274F]/50"
              >
                Back to Library
              </Button>
              
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
        </div>
        
        {serverStatus === 'disconnected' && (
          <Card className="bg-red-900/20 border-red-700 text-white mb-8 animate-pulse max-w-lg mx-auto">
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
    );
  }

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
    <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
      <Button onClick={() => setShowRFIDScreen(true)}>
        Start Game Flow
      </Button>
    </div>
  );
};
