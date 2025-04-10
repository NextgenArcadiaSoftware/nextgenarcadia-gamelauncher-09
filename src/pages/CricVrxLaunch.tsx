
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Play, ArrowLeft } from 'lucide-react';
import { TimerDisplay } from '@/components/game-launch/TimerDisplay';
import { RatingScreen } from '@/components/game-launch/RatingScreen';
import { supabase } from '@/integrations/supabase/client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

const CricVrxLaunch: React.FC = () => {
  const [showTimer, setShowTimer] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [timerDuration, setTimerDuration] = useState(300); // Default 5 minutes
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const gameName = "CRICVRX";
  
  useEffect(() => {
    const fetchTimerSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('timer_duration')
          .eq('id', 'global')
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
  }, []);

  const launchGame = async () => {
    setLoading(true);
    try {
      // CRICVRX uses the 'q' key
      const res = await fetch(`${API_URL}/keypress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: 'q' }),
      });
      
      if (res.ok) {
        const id = await createGameSession(gameName);
        if (id) {
          setSessionId(id);
          console.log(`Created game session with ID: ${id}`);
        }
        
        setShowTimer(true);
        
        toast({
          title: "Game Launched",
          description: `Successfully launched ${gameName}`,
        });
      } else {
        toast({
          title: "Launch Failed",
          description: `Error: ${res.status} ${res.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending key to Python server:', error);
      toast({
        title: "Launch Failed",
        description: `Could not connect to the server at ${API_URL}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createGameSession = async (gameName: string): Promise<string | null> => {
    try {
      const { data: gameData } = await supabase
        .from('games')
        .select('id')
        .eq('title', gameName)
        .single();

      if (!gameData) {
        console.error('Game not found:', gameName);
        return null;
      }

      // Check for any active sessions for this game
      const { data: existingSessions } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('game_id', gameData.id)
        .is('completed', false)
        .limit(1);

      if (existingSessions && existingSessions.length > 0) {
        console.log('Active session already exists for this game, ID:', existingSessions[0].id);
        return existingSessions[0].id;
      }

      console.log('Creating new session for game:', gameName);
      
      const durationInMinutes = Math.ceil(timerDuration / 60);
      
      const { data: newSession, error } = await supabase
        .from('game_sessions')
        .insert({
          game_id: gameData.id,
          duration: durationInMinutes,
          completed: false
        })
        .select('id')
        .single();
      
      if (error) {
        console.error('Error creating game session:', error);
        return null;
      } else {
        console.log('Game session created successfully, ID:', newSession.id);
        return newSession.id;
      }
    } catch (error) {
      console.error('Error creating game session:', error);
      return null;
    }
  };

  const closeGame = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (res.ok) {
        setShowTimer(false);
        
        // Mark session as completed
        if (sessionId) {
          await completeGameSession(sessionId);
        }
        
        setShowRating(true);
        
        toast({
          title: "Game Closed",
          description: "Successfully closed the game",
        });
      } else {
        toast({
          title: "Close Failed",
          description: `Error: ${res.status} ${res.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending close command to Python server:', error);
      toast({
        title: "Close Failed",
        description: `Could not send close command to the server at ${API_URL}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const completeGameSession = async (id: string) => {
    try {
      console.log('Marking session as completed:', id);
      const { error } = await supabase
        .from('game_sessions')
        .update({
          completed: true,
          ended_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error completing game session:', error);
      } else {
        console.log('Session marked as completed successfully');
      }
    } catch (error) {
      console.error('Error marking session as completed:', error);
    }
  };

  const handleTimerExit = () => {
    closeGame();
  };

  const handleRatingSubmit = async (rating: number) => {
    // Record the rating
    try {
      if (sessionId) {
        // Get the game ID for this session
        const { data: sessionData } = await supabase
          .from('game_sessions')
          .select('game_id')
          .eq('id', sessionId)
          .single();
          
        if (sessionData && sessionData.game_id) {
          // Add rating for this game
          await supabase
            .from('game_ratings')
            .insert({
              game_id: sessionData.game_id,
              rating
            });
          
          console.log('Rating recorded successfully');
        }
      } else {
        // Fallback to looking up game ID by name
        const { data: gameData } = await supabase
          .from('games')
          .select('id')
          .eq('title', gameName)
          .single();
          
        if (gameData) {
          await supabase
            .from('game_ratings')
            .insert({
              game_id: gameData.id,
              rating
            });
        }
      }
    } catch (error) {
      console.error('Error recording rating:', error);
    }
    
    toast({
      title: "Thank You!",
      description: `You rated ${gameName} ${rating} stars.`,
    });
    
    navigate('/');
  };

  if (showRating) {
    return (
      <RatingScreen
        activeGame={gameName}
        onSubmit={handleRatingSubmit}
      />
    );
  }

  if (showTimer) {
    return (
      <TimerDisplay 
        timeLeft={timerDuration} 
        activeGame={gameName} 
        onExit={handleTimerExit} 
      />
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-[#1A1F2C] to-[#2A2F3C] min-h-screen text-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mr-4 text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Library
          </Button>
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA] bg-clip-text text-transparent">
            {gameName}
          </h1>
        </div>
        
        <div className="glass p-8 rounded-2xl space-y-8 relative overflow-hidden border border-white/20 bg-[#222232]/50 backdrop-blur-xl">
          <div className="text-center">
            <img 
              src="/lovable-uploads/f8c126a3-87f1-4ea8-b8d8-76597554d0be.png" 
              alt={gameName} 
              className="rounded-xl mx-auto mb-8 max-h-[300px]"
            />
            
            <p className="text-xl text-white/80 mb-6">
              Experience the thrill of cricket in virtual reality with CRICVRX. Step onto the field, bat in hand, and face bowlers from around the world in this immersive cricket simulation.
            </p>
            
            <div className="flex gap-4 justify-center">
              <span className="inline-block px-4 py-1 rounded-full text-sm text-white/90 bg-blue-500/30 backdrop-blur-sm border border-blue-500/30">
                Virtual Reality
              </span>
              <span className="inline-block px-4 py-1 rounded-full text-sm text-white/90 bg-green-500/30 backdrop-blur-sm border border-green-500/30">
                Sports
              </span>
              <span className="inline-block px-4 py-1 rounded-full text-sm text-white/90 bg-yellow-500/30 backdrop-blur-sm border border-yellow-500/30">
                Cricket
              </span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button
              onClick={launchGame}
              disabled={loading}
              className="text-xl font-semibold py-6 px-12 bg-gradient-to-r from-[#7E69AB] to-[#9b87f5] hover:from-[#9b87f5] hover:to-[#7E69AB] text-white h-auto"
            >
              <Play className="mr-2 h-6 w-6" />
              Launch Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CricVrxLaunch;
