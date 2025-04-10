import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Play, ArrowLeft } from 'lucide-react';
import { TimerDisplay } from '@/components/game-launch/TimerDisplay';
import { RatingScreen } from '@/components/game-launch/RatingScreen';
import { supabase } from '@/integrations/supabase/client';
import { useRFIDDetection } from '@/hooks/useRFIDDetection';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

const CrisBrigadeLaunch: React.FC = () => {
  const [showTimer, setShowTimer] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [timerDuration, setTimerDuration] = useState(300); // Default 5 minutes
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { rfidDetected, simulateRFID } = useRFIDDetection();
  
  const gameName = "Crisis Brigade 2 Reloaded";
  
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
    if (!rfidDetected) {
      toast({
        title: "RFID Required",
        description: "Please tap your RFID card before launching the game",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/keypress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: 'c' }),
      });
      
      if (res.ok) {
        await createGameSession(gameName);
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

  const handleTimerExit = () => {
    closeGame();
  };

  const handleRatingSubmit = (rating: number) => {
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
              src="/lovable-uploads/bb8b5b5b-bf33-4e0c-b9af-a05408636bce.png" 
              alt={gameName} 
              className="rounded-xl mx-auto mb-8 max-h-[300px]"
            />
            
            <p className="text-xl text-white/80 mb-6">
              Take cover! Engage in high-octane light gun action as you fight against waves of criminals. Fast-paced shooting with arcade-style gameplay.
            </p>
            
            <div className="flex gap-4 justify-center">
              <span className="inline-block px-4 py-1 rounded-full text-sm text-white/90 bg-blue-500/30 backdrop-blur-sm border border-blue-500/30">
                Virtual Reality
              </span>
              <span className="inline-block px-4 py-1 rounded-full text-sm text-white/90 bg-orange-500/30 backdrop-blur-sm border border-orange-500/30">
                Shooter
              </span>
              <span className="inline-block px-4 py-1 rounded-full text-sm text-white/90 bg-red-500/30 backdrop-blur-sm border border-red-500/30">
                Action
              </span>
            </div>
          </div>
          
          {!rfidDetected ? (
            <div className="space-y-6 text-center">
              <div className="animate-pulse text-white/80 text-xl p-4 border border-dashed border-white/30 rounded-lg bg-white/5">
                Please tap your RFID card to activate game launching
              </div>
              
              <Button 
                onClick={simulateRFID} 
                variant="outline" 
                className="border-white/30 text-white/80 hover:bg-white/10"
              >
                Simulate RFID Card
              </Button>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default CrisBrigadeLaunch;
