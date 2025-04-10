import { useEffect, useState, useRef } from 'react';
import { useToast } from './ui/use-toast';
import { TimerDisplay } from './game-launch/TimerDisplay';
import { RatingScreen } from './game-launch/RatingScreen';
import { GameLaunchScreen } from './game-launch/GameLaunchScreen';
import { GameLaunchInfo } from './game-launch/GameLaunchInfo';
import { supabase } from '@/integrations/supabase/client';

interface RFIDCountdownProps {
  onExit: () => void;
  activeGame?: string | null;
  trailer?: string;  
  steamUrl?: string; // Support for direct Steam URLs
  cppLauncherMode?: boolean; // New prop to indicate CPP launcher mode
  cppLauncherKey?: string; // Key to send to CPP launcher
}

export function RFIDCountdown({ 
  onExit, 
  activeGame, 
  trailer, 
  steamUrl, 
  cppLauncherMode = false,
  cppLauncherKey
}: RFIDCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showRating, setShowRating] = useState(false);
  const [showGameScreen, setShowGameScreen] = useState(true);
  const [showLaunchInfo, setShowLaunchInfo] = useState(false);
  const [lastServerStatus, setLastServerStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const sessionRecorded = useRef(false);
  const { toast } = useToast();
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';
  const isElectronAvailable = Boolean(window.electron);

  useEffect(() => {
    let isMounted = true;

    const fetchTimerDuration = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('timer_duration')
          .eq('id', 'global')
          .single();

        if (error) {
          console.error('Error fetching timer duration:', error);
          if (isMounted) setTimeLeft(5 * 60);
          throw error;
        }

        if (data && isMounted) {
          console.log('Setting initial timer duration:', data.timer_duration);
          setTimeLeft(data.timer_duration * 60);
        } else if (isMounted) {
          console.log('No timer data found, using default of 5 minutes');
          setTimeLeft(5 * 60);
        }
      } catch (error) {
        console.error('Error fetching timer duration:', error);
      }
    };

    fetchTimerDuration();

    const channel = supabase
      .channel('settings_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'settings',
          filter: 'id=eq.global'
        },
        (payload) => {
          if (isMounted) {
            const newDuration = payload.new.timer_duration;
            console.log('Received new timer duration:', newDuration);
            setTimeLeft(newDuration * 60);
            toast({
              title: "Timer Updated",
              description: `Session time updated to ${newDuration} minutes`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [toast]);

  // Get game descriptions based on the game title
  const getGameDescription = (gameTitle: string | null | undefined): string => {
    if (!gameTitle) return "Experience this exciting VR game!";
    
    const descriptions: Record<string, string> = {
      "Elven Assassin": "Become an elite Elven Archer defending your village from hordes of orcs in this immersive VR archery game. Experience precise bow mechanics and tactical gameplay.",
      "Fruit Ninja VR": "Slice your way through juicy fruit with precise sword movements in this VR adaptation of the classic mobile game. Experience the satisfaction of perfect cuts in immersive 3D.",
      "Crisis Brigade 2 Reloaded": "Take cover! Engage in high-octane light gun action as you fight against waves of criminals. Fast-paced shooting with arcade-style gameplay.",
      "All-in-One Sports VR": "Experience the thrill of multiple sports in one comprehensive VR package. From tennis to basketball, golf to bowling - test your athletic skills across various disciplines.",
      "Richies Plank Experience": "Test your fear of heights as you walk a plank 80 stories above the ground. A unique sensory experience that will challenge your perception of reality.",
      "iB Cricket": "Step onto the pitch in this realistic cricket simulator. Face professional bowlers, perfect your batting technique, and experience the stadium atmosphere.",
      "Undead Citadel": "Wield medieval weapons against the undead in this visceral combat game. Block, slash, and dismember your way through hordes of medieval zombies.",
      "Arizona Sunshine": "Survive the zombie apocalypse in the scorching heat of Arizona. Explore, scavenge for supplies, and fight off the undead in this immersive VR adventure.",
      "Subside": "Dive into a surreal underwater world where reality shifts and bends around you. Solve puzzles and uncover the mysteries of the deep in this atmospheric experience.",
      "Propagation VR": "Fight for survival in a post-apocalyptic world overrun by mutated creatures. Use your reflexes and aim to survive increasingly difficult waves of enemies.",
      "CRICVRX": "Experience the thrill of cricket in virtual reality with CRICVRX. Step onto the field, bat in hand, and face bowlers from around the world in this immersive cricket simulation.",
      "CYBRID": "Experience a revolutionary blend of Virtual Reality and Cyberpunk themes in CYBRID. Navigate through neon-lit dystopian environments and engage in high-stakes futuristic combat."
    };
    
    return descriptions[gameTitle] || `Experience the excitement of ${gameTitle} in virtual reality!`;
  };

  // Get game tags based on the game title
  const getGameTags = (gameTitle: string | null | undefined): string[] => {
    if (!gameTitle) return ["VR Game"];
    
    const tags: Record<string, string[]> = {
      "Elven Assassin": ["Virtual Reality", "Archery", "Fantasy"],
      "Fruit Ninja VR": ["Virtual Reality", "Arcade", "Action"],
      "Crisis Brigade 2 Reloaded": ["Virtual Reality", "Shooter", "Action"],
      "All-in-One Sports VR": ["Virtual Reality", "Sports", "Simulation"],
      "Richies Plank Experience": ["Virtual Reality", "Experience", "Heights"],
      "iB Cricket": ["Virtual Reality", "Sports", "Cricket"],
      "Undead Citadel": ["Virtual Reality", "Action", "Medieval"],
      "Arizona Sunshine": ["Virtual Reality", "Zombie", "Survival"],
      "Subside": ["Virtual Reality", "Puzzle", "Atmospheric"],
      "Propagation VR": ["Virtual Reality", "Horror", "Shooter"],
      "CRICVRX": ["Virtual Reality", "Sports", "Cricket"],
      "CYBRID": ["Virtual Reality", "Cyberpunk", "Action"]
    };
    
    return tags[gameTitle] || ["Virtual Reality"];
  };

  // Get tag color classes based on tag name
  const getTagColors = (): Record<string, string> => {
    return {
      "Virtual Reality": "bg-blue-500/30 border-blue-500/30",
      "Sports": "bg-green-500/30 border-green-500/30",
      "Cricket": "bg-yellow-500/30 border-yellow-500/30",
      "Action": "bg-red-500/30 border-red-500/30",
      "Shooter": "bg-orange-500/30 border-orange-500/30",
      "Arcade": "bg-pink-500/30 border-pink-500/30",
      "Fantasy": "bg-indigo-500/30 border-indigo-500/30",
      "Medieval": "bg-amber-500/30 border-amber-500/30",
      "Zombie": "bg-lime-500/30 border-lime-500/30",
      "Horror": "bg-rose-500/30 border-rose-500/30",
      "Survival": "bg-emerald-500/30 border-emerald-500/30",
      "Puzzle": "bg-cyan-500/30 border-cyan-500/30",
      "Atmospheric": "bg-teal-500/30 border-teal-500/30",
      "Experience": "bg-violet-500/30 border-violet-500/30",
      "Heights": "bg-fuchsia-500/30 border-fuchsia-500/30",
      "Simulation": "bg-sky-500/30 border-sky-500/30",
      "Cyberpunk": "bg-purple-500/30 border-purple-500/30"
    };
  };

  // Get image URL for the game
  const getGameImageUrl = (gameTitle: string | null | undefined): string => {
    if (!gameTitle) return "/placeholder.svg";
    
    // Custom image mappings
    const customImages: Record<string, string> = {
      "CYBRID": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1636850/capsule_616x353.jpg?t=1742365820",
      "CRICVRX": "/lovable-uploads/f8c126a3-87f1-4ea8-b8d8-76597554d0be.png"
    };
    
    if (customImages[gameTitle]) {
      return customImages[gameTitle];
    }
    
    // Try to find a matching image in lovable-uploads
    const formattedTitle = gameTitle.toLowerCase().replace(/\s+/g, '-');
    return `/lovable-uploads/${formattedTitle}.png`;
  };

  const launchGame = async () => {
    setLoading(true);
    
    if (cppLauncherMode && cppLauncherKey) {
      console.log(`Launching game with CPP launcher key: ${cppLauncherKey} for game: ${activeGame}`);
        
        fetch(`${API_URL}/keypress`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json; charset=utf-8",
            "Accept-Charset": "UTF-8"
          },
          body: JSON.stringify({ key: cppLauncherKey }),
          signal: AbortSignal.timeout(3000)
        })
        .then(response => {
          console.log(`Server responded with status: ${response.status}`);
          setLastServerStatus(response.status);
          
          if (response.status === 204 || response.ok) {
            toast({
              title: "Game Launching",
              description: `Launching ${activeGame}...`,
            });
            return response.status === 204 ? 
              `Successfully launched ${activeGame}` : 
              response.text().then(text => new TextDecoder('utf-8').decode(new TextEncoder().encode(text)));
          } else {
            throw new Error(`HTTP error: ${response.status}`);
          }
        })
        .then(data => {
          console.log('Game launch response:', data);
        })
        .catch(error => {
          console.error('Error launching game:', error);
          toast({
            variant: "destructive",
            title: "Launch Error",
            description: "Failed to connect to game launcher service"
          });
          
          if (isElectronAvailable) {
            console.log("Falling back to Electron keypress simulation");
            window.electron.ipcRenderer.send('simulate-keypress', cppLauncherKey);
          }
        });
    }
    else if (steamUrl && isElectronAvailable) {
      console.log(`Launching Steam game with URL: ${steamUrl}`);
      window.electron.ipcRenderer.send('launch-steam-game', steamUrl);
    } 
    else if (activeGame && isElectronAvailable) {
      try {
        const keyMapping: Record<string, string> = {
          'Elven Assassin': 'e',
          'Fruit Ninja VR': 'f',
          'Crisis Brigade 2 Reloaded': 'c',
          'All-in-One Sports VR': 'v',
          'Richies Plank Experience': 'p',
          'iB Cricket': 'i',
          'Undead Citadel': 'u',
          'Arizona Sunshine': 'a',
          'Subside': 's',
          'Propagation VR': 'g',
          'CRICVRX': 'q',
          'CYBRID': 'y'
        };
        
        const launchKey = keyMapping[activeGame];
        
        if (launchKey) {
          console.log(`Launching game with key: ${launchKey} for game: ${activeGame}`);
          
          fetch("http://localhost:5001/keypress", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json; charset=utf-8",
              "Accept-Charset": "UTF-8"
            },
            body: JSON.stringify({ key: launchKey }),
            signal: AbortSignal.timeout(3000)
          })
          .then(response => {
            console.log(`Server responded with status: ${response.status}`);
            setLastServerStatus(response.status);
            
            if (response.status === 204 || response.ok) {
              toast({
                title: "Game Launching",
                description: `Launching ${activeGame}...`,
              });
              return response.status === 204 ? 
                `Successfully launched ${activeGame}` : 
                response.text().then(text => new TextDecoder('utf-8').decode(new TextEncoder().encode(text)));
            } else {
              throw new Error(`HTTP error: ${response.status}`);
            }
          })
          .then(data => {
            console.log('Game launch response:', data);
          })
          .catch(error => {
            console.error('Error launching game:', error);
            toast({
              variant: "destructive",
              title: "Launch Error",
              description: "Failed to connect to game launcher service"
            });
            
            console.log("Falling back to Electron keypress simulation");
            window.electron.ipcRenderer.send('simulate-keypress', launchKey);
          });
        } else {
          console.log(`No launch key mapping found for game: ${activeGame}`);
        }
      } catch (error) {
        console.error('Error in game launch logic:', error);
      }
    } else if (!isElectronAvailable) {
      console.log('Electron API not available - in browser preview mode');
      toast({
        title: "Browser Preview Mode",
        description: "Game launch simulation - Electron APIs unavailable in browser",
        variant: "default"
      });
    }
    
    // Record the session
    try {
      // Get game ID first
      if (activeGame) {
        const { data: gameData } = await supabase
          .from('games')
          .select('id')
          .eq('title', activeGame)
          .single();

        if (gameData) {
          console.log('Creating new session for game:', activeGame);
          sessionRecorded.current = true;
          
          // Create a new session
          const { error } = await supabase
            .from('game_sessions')
            .insert({
              game_id: gameData.id,
              duration: Math.ceil((timeLeft || 300) / 60), // Convert seconds to minutes
              completed: false
            });
          
          if (error) {
            console.error('Error creating game session:', error);
          } else {
            console.log('Game session created successfully');
          }
        }
      }
    } catch (error) {
      console.error('Error creating game session:', error);
    }
    
    setShowLaunchInfo(false);
    setShowGameScreen(false);
    setLoading(false);
  };

  // Record game session when starting the game
  useEffect(() => {
    const recordGameSession = async () => {
      if (!activeGame || sessionRecorded.current || showGameScreen) return;
      
      try {
        // Get game ID first
        const { data: gameData } = await supabase
          .from('games')
          .select('id')
          .eq('title', activeGame)
          .single();

        if (gameData) {
          console.log('Creating new session for game:', activeGame);
          sessionRecorded.current = true;
          
          // Create a new session
          const { error } = await supabase
            .from('game_sessions')
            .insert({
              game_id: gameData.id,
              duration: Math.ceil((timeLeft || 300) / 60), // Convert seconds to minutes
              completed: false
            });
          
          if (error) {
            console.error('Error creating game session:', error);
          } else {
            console.log('Game session created successfully');
          }
        }
      } catch (error) {
        console.error('Error creating game session:', error);
      }
    };

    if (!showGameScreen && !sessionRecorded.current) {
      recordGameSession();
    }
  }, [activeGame, timeLeft, showGameScreen]);

  const getGameCode = (gameTitle: string | null | undefined): string => {
    if (!gameTitle) return "XXX";
    
    const codeMap: Record<string, string> = {
      "Elven Assassin": "EAX",
      "Fruit Ninja VR": "FNJ",
      "Crisis Brigade 2 Reloaded": "CBR",
      "All-in-One Sports VR": "AIO",
      "Richies Plank Experience": "RPE",
      "iB Cricket": "IBC",
      "Undead Citadel": "UDC",
      "Arizona Sunshine": "ARS",
      "Subside": "SBS",
      "Propagation VR": "PVR",
      "CRICVRX": "CVX",
      "CYBRID": "CYB"
    };
    
    return codeMap[gameTitle] || "XXX";
  };

  const targetWord = getGameCode(activeGame);

  useEffect(() => {
    if (!showGameScreen && timeLeft !== null) {
      if (cppLauncherMode && cppLauncherKey) {
        console.log(`Launching game with CPP launcher key: ${cppLauncherKey} for game: ${activeGame}`);
        
        fetch(`${API_URL}/keypress`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json; charset=utf-8",
            "Accept-Charset": "UTF-8"
          },
          body: JSON.stringify({ key: cppLauncherKey }),
          signal: AbortSignal.timeout(3000)
        })
        .then(response => {
          console.log(`Server responded with status: ${response.status}`);
          setLastServerStatus(response.status);
          
          if (response.status === 204 || response.ok) {
            toast({
              title: "Game Launching",
              description: `Launching ${activeGame}...`,
            });
            return response.status === 204 ? 
              `Successfully launched ${activeGame}` : 
              response.text().then(text => new TextDecoder('utf-8').decode(new TextEncoder().encode(text)));
          } else {
            throw new Error(`HTTP error: ${response.status}`);
          }
        })
        .then(data => {
          console.log('Game launch response:', data);
        })
        .catch(error => {
          console.error('Error launching game:', error);
          toast({
            variant: "destructive",
            title: "Launch Error",
            description: "Failed to connect to game launcher service"
          });
          
          if (isElectronAvailable) {
            console.log("Falling back to Electron keypress simulation");
            window.electron.ipcRenderer.send('simulate-keypress', cppLauncherKey);
          }
        });
      }
      else if (steamUrl && isElectronAvailable) {
        console.log(`Launching Steam game with URL: ${steamUrl}`);
        window.electron.ipcRenderer.send('launch-steam-game', steamUrl);
      } 
      else if (targetWord && isElectronAvailable) {
        try {
          const keyMapping: Record<string, string> = {
            'EAX': 'e',
            'FNJ': 'f',
            'CBR': 'c',
            'AIO': 'v',
            'RPE': 'p',
            'IBC': 'i',
            'UDC': 'u',
            'ARS': 'a',
            'SBS': 's',
            'PVR': 'g',
            'CVX': 'q',
            'CYB': 'y'
          };
          
          const launchKey = keyMapping[targetWord];
          
          if (launchKey) {
            console.log(`Launching game with key: ${launchKey} for game: ${activeGame}`);
            
            fetch("http://localhost:5001/keypress", {
              method: "POST",
              headers: { 
                "Content-Type": "application/json; charset=utf-8",
                "Accept-Charset": "UTF-8"
              },
              body: JSON.stringify({ key: launchKey }),
              signal: AbortSignal.timeout(3000)
            })
            .then(response => {
              console.log(`Server responded with status: ${response.status}`);
              setLastServerStatus(response.status);
              
              if (response.status === 204 || response.ok) {
                toast({
                  title: "Game Launching",
                  description: `Launching ${activeGame}...`,
                });
                return response.status === 204 ? 
                  `Successfully launched ${activeGame}` : 
                  response.text().then(text => new TextDecoder('utf-8').decode(new TextEncoder().encode(text)));
              } else {
                throw new Error(`HTTP error: ${response.status}`);
              }
            })
            .then(data => {
              console.log('Game launch response:', data);
            })
            .catch(error => {
              console.error('Error launching game:', error);
              toast({
                variant: "destructive",
                title: "Launch Error",
                description: "Failed to connect to game launcher service"
              });
              
              console.log("Falling back to Electron keypress simulation");
              window.electron.ipcRenderer.send('simulate-keypress', launchKey);
            });
          } else {
            console.log(`No launch key mapping found for game: ${activeGame}`);
          }
        } catch (error) {
          console.error('Error in game launch logic:', error);
        }
      } else if (!isElectronAvailable) {
        console.log('Electron API not available - in browser preview mode');
        toast({
          title: "Browser Preview Mode",
          description: "Game launch simulation - Electron APIs unavailable in browser",
          variant: "default"
        });
      }
    }
  }, [showGameScreen, timeLeft, targetWord, steamUrl, toast, isElectronAvailable, activeGame, cppLauncherMode, cppLauncherKey, API_URL]);

  useEffect(() => {
    if (isElectronAvailable) {
      console.log('Setting up webhook stop timer listener');
      
      const handleWebhookStopTimer = (payload: any) => {
        console.log('Webhook stop timer received with payload:', payload);
        
        toast({
          title: "External Stop Command",
          description: "Timer stopped via webhook command",
        });
        
        setShowRating(true);
      };
      
      window.electron.ipcRenderer.on('webhook-stop-timer', handleWebhookStopTimer);
      
      return () => {
        window.electron.ipcRenderer.removeAllListeners('webhook-stop-timer');
      };
    }
  }, [toast, isElectronAvailable]);

  const handleRatingSubmit = async (rating: number) => {
    if (cppLauncherMode) {
      try {
        fetch(`${API_URL}/close`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json; charset=utf-8",
            "Accept-Charset": "UTF-8"
          },
          signal: AbortSignal.timeout(3000)
        })
        .then(response => {
          console.log(`Server responded with status: ${response.status}`);
          if (response.status === 204 || response.ok) {
            toast({
              title: "Game Session Ended",
              description: "Closing all active games",
              variant: "default"
            });
          } else {
            throw new Error(`Server error: ${response.status}`);
          }
        })
        .catch(error => {
          console.error('Error closing games:', error);
          if (isElectronAvailable) {
            window.electron.ipcRenderer.send('end-game');
          }
        });
      } catch (error) {
        console.error('Error in stop command:', error);
      }
    }
    else if (isElectronAvailable) {
      try {
        fetch("http://localhost:5001/close", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json; charset=utf-8",
            "Accept-Charset": "UTF-8"
          },
          signal: AbortSignal.timeout(3000)
        })
        .then(response => {
          console.log(`Server responded with status: ${response.status}`);
          if (response.status === 204 || response.ok) {
            toast({
              title: "Game Session Ended",
              description: "Closing all active games",
              variant: "default"
            });
          } else {
            throw new Error(`Server error: ${response.status}`);
          }
        })
        .catch(error => {
          console.error('Error closing games:', error);
          window.electron.ipcRenderer.send('end-game');
        });
      } catch (error) {
        console.error('Error in stop command:', error);
      }
    }
    
    if (activeGame) {
      try {
        // Mark session as completed
        const { data: gameData } = await supabase
          .from('games')
          .select('id')
          .eq('title', activeGame)
          .single();

        if (gameData) {
          // Update the latest session for this game as completed
          await supabase
            .from('game_sessions')
            .update({ 
              completed: true,
              ended_at: new Date().toISOString()
            })
            .eq('game_id', gameData.id)
            .is('completed', false)
            .order('started_at', { ascending: false })
            .limit(1);
            
          // Add rating
          await supabase
            .from('game_ratings')
            .insert({
              game_id: gameData.id,
              rating
            });
        }
      } catch (error) {
        console.error('Error completing game session and recording rating:', error);
      }
    }
    
    toast({
      title: "Thank You!",
      description: `You rated ${activeGame} ${rating} stars.`,
    });
    onExit();
  };

  const gameData = {
    title: activeGame || 'Unknown Game',
    description: activeGame ? `Get ready to experience ${activeGame} in virtual reality!` : '',
    thumbnail: `/lovable-uploads/${activeGame?.toLowerCase().replace(/\s+/g, '-')}.png`,
    genre: 'VR Game',
    trailer: trailer
  };

  if (showRating) {
    return <RatingScreen activeGame={activeGame} onSubmit={handleRatingSubmit} />;
  }

  if (showLaunchInfo) {
    return (
      <GameLaunchInfo
        gameName={activeGame || "Unknown Game"}
        imageUrl={getGameImageUrl(activeGame)}
        description={getGameDescription(activeGame)}
        tags={getGameTags(activeGame)}
        tagColors={getTagColors()}
        onLaunch={launchGame}
        loading={loading}
      />
    );
  }

  if (showGameScreen) {
    return (
      <GameLaunchScreen 
        game={gameData}
        onContinue={() => setShowLaunchInfo(true)}
      />
    );
  }

  if (timeLeft === null) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <div className="text-xl">Loading timer settings...</div>
      </div>
    );
  }

  return (
    <TimerDisplay
      timeLeft={timeLeft}
      activeGame={activeGame}
      onExit={() => {
        if (showGameScreen) {
          onExit();
        } else {
          setShowRating(true);
        }
      }}
    />
  );
}
