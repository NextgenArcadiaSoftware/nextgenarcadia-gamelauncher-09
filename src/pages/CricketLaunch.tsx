
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export default function CricketLaunch() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Set up key event listener for X key to end game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'x') {
        console.log('X key detected, ending game');
        toast({
          title: "Game Ended",
          description: "Ending current game session..."
        });
        
        // Send close command to C++ server
        fetch("http://localhost:5001/close", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json; charset=utf-8",
            "Accept-Charset": "UTF-8"
          },
          body: JSON.stringify({ 
            command: "CLOSE_GAME",
            gameName: "iB Cricket" 
          })
        })
        .then(response => {
          if (!response.ok && response.status !== 204) throw new Error(`HTTP error! status: ${response.status}`);
          
          if (response.status === 204) {
            console.log('Close game command successful');
            return "Game close command successful";
          }
          
          return response.text().then(text => new TextDecoder('utf-8').decode(new TextEncoder().encode(text)));
        })
        .then(data => console.log('Close game response:', data))
        .catch(error => {
          console.error('Error closing game:', error);
          // Even if the C++ server is unavailable, still navigate back
          setTimeout(() => navigate('/'), 1000);
        });
        
        // Navigate back after short delay
        setTimeout(() => navigate('/'), 1000);
      }
    };

    // Add global event listener
    document.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, toast]);

  return (
    <div className="relative min-h-screen">
      <Button 
        variant="default" 
        size="lg"
        className="fixed top-8 left-8 z-50 bg-white/80 text-black hover:bg-white gap-2 text-xl font-bold shadow-lg border-2"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="h-6 w-6" />
        Back to Games
      </Button>
      <RFIDCountdown 
        onExit={() => navigate('/')} 
        activeGame="iB Cricket"
        trailer="https://www.youtube.com/watch?v=CJElM1v0xBw"
      />
    </div>
  );
}
