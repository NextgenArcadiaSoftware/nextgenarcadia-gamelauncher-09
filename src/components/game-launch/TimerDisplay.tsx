import { useEffect, useState, useRef } from 'react';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TimerKeyboard } from './TimerKeyboard';

interface TimerDisplayProps {
  timeLeft: number;
  activeGame: string | null | undefined;
  onExit: () => void;
}

export function TimerDisplay({ timeLeft: initialTime, activeGame, onExit }: TimerDisplayProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const sessionCompletionRef = useRef(false);
  const sessionCreatedRef = useRef(false);
  const { toast } = useToast();

  // Check if Electron is available
  const isElectronAvailable = Boolean(window.electron);

  // Create a session when the component mounts
  useEffect(() => {
    const createGameSession = async () => {
      if (!activeGame || sessionCreatedRef.current) return;
      
      try {
        // Get game ID first
        const { data: gameData } = await supabase
          .from('games')
          .select('id')
          .eq('title', activeGame)
          .single();

        if (gameData) {
          console.log('Creating new session for game:', activeGame);
          sessionCreatedRef.current = true;
          
          // Create a new session
          const { error } = await supabase
            .from('game_sessions')
            .insert({
              game_id: gameData.id,
              duration: Math.ceil(initialTime / 60), // Convert seconds to minutes
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

    createGameSession();
    
    return () => {
      // If component unmounts before session is completed, we still want to mark it
      if (!sessionCompletionRef.current && activeGame && sessionCreatedRef.current) {
        markSessionComplete();
      }
    };
  }, [activeGame, initialTime]);

  // Timer effect
  useEffect(() => {
    // Reset the timer if initialTime changes
    setTimeLeft(initialTime);
    setSessionCompleted(false);
    sessionCompletionRef.current = false;
    
    const interval = setInterval(async () => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          
          // Only mark the session as completed when timer ends and if not already marked
          if (activeGame && !sessionCompletionRef.current && sessionCreatedRef.current) {
            sessionCompletionRef.current = true; // Set immediately to prevent race conditions
            markSessionComplete();
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [initialTime, activeGame]);

  // Listen for the STOP_GAME message from external hardware button
  useEffect(() => {
    // Check if electron is available
    if (isElectronAvailable) {
      console.log('Setting up external button listener');
      
      // Create the listener function
      const handleExternalButton = () => {
        console.log('External stop button detected');
        // Show toast notification
        toast({
          title: "External Button Pressed",
          description: "Session ending..."
        });
        
        // Mark session as completed if not already done
        if (activeGame && !sessionCompletionRef.current && sessionCreatedRef.current) {
          sessionCompletionRef.current = true;
          markSessionComplete();
        }
        
        // End the timer immediately
        setTimeLeft(0);
        // Trigger exit after a short delay to allow the user to see what's happening
        setTimeout(onExit, 1500);
      };
      
      // Register the listener with electron IPC
      window.electron.ipcRenderer.on('external-button-pressed', handleExternalButton);
      
      // Clean up the listener when component unmounts
      return () => {
        window.electron.ipcRenderer.removeAllListeners('external-button-pressed');
      };
    }
  }, [activeGame, onExit, toast, isElectronAvailable]);

  const markSessionComplete = async () => {
    if (!activeGame) return;
    
    try {
      // Get game ID first
      const { data: gameData } = await supabase
        .from('games')
        .select('id')
        .eq('title', activeGame)
        .single();

      if (gameData) {
        console.log('Marking session complete for game:', activeGame, 'with ID:', gameData.id);
        // Update the latest session for this game as completed
        const { data, error } = await supabase
          .from('game_sessions')
          .update({ completed: true })
          .eq('game_id', gameData.id)
          .is('completed', false)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (error) {
          console.error('Error in update query:', error);
        } else {
          console.log('Session marked as completed, response:', data);
        }
        
        setSessionCompleted(true);
      }
    } catch (error) {
      console.error('Error marking session as completed:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleKeyPress = (key: string) => {
    console.log(`Key pressed from on-screen keyboard: ${key}`);
    
    if (key === 'X') {
      toast({
        title: "Exit Key Pressed",
        description: "Exiting game session..."
      });
      
      // Send close command to Python server
      fetch("http://localhost:5002/close", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      })
      .then(response => response.json())
      .then(data => console.log('Close games response:', data))
      .catch(error => console.error('Error closing games:', error));
      
      // Exit after short delay
      setTimeout(() => onExit(), 1000);
    } else if (isElectronAvailable) {
      window.electron.ipcRenderer.send('simulate-keypress', key.toLowerCase());
      toast({
        title: "Key Pressed",
        description: `Sending ${key} key to the game`
      });
    } else {
      toast({
        variant: "default",
        title: "Browser Preview Mode",
        description: `Keypress simulation - Electron APIs unavailable in browser`
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#F97316] via-[#ea384c] to-[#FEC6A1] flex flex-col items-center justify-center z-50 animate-fade-in">
      <Button 
        variant="ghost" 
        className="absolute top-4 right-4 text-white hover:bg-white/20"
        onClick={onExit}
      >
        <X className="h-6 w-6" />
        Exit
      </Button>
      
      <div className="text-9xl font-mono mb-8 text-white animate-pulse tracking-widest">
        {formatTime(timeLeft)}
      </div>
      
      <div className="text-2xl text-white/90 mb-4 animate-fade-in">
        Time Remaining
      </div>
      
      {activeGame && (
        <div className="text-xl text-white/80 mb-6 animate-fade-in">
          Currently Playing: {activeGame}
        </div>
      )}

      <div className="fixed bottom-4 left-0 right-0 flex justify-center animate-fade-in-up">
        <TimerKeyboard onKeyPress={handleKeyPress} />
      </div>
    </div>
  );
}
