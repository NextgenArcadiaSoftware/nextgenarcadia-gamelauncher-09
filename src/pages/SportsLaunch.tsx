
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export default function SportsLaunch() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [serverResponse, setServerResponse] = useState<string | null>(null);

  // Set up global key event listener for both the X key and C++ program
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      console.log(`Global keydown detected: ${e.key}`);
      
      // Special handling for X key to end the game
      if (e.key.toLowerCase() === 'x') {
        console.log('X key detected, ending game');
        
        // Send close command to C++ server
        fetch("http://localhost:5001/close", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({})
        })
        .then(response => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return response.text();
        })
        .then(text => {
          console.log('Close game response:', text);
          setServerResponse(text);
          
          // Parse and display specific server responses
          const responseLines = text.split('\n').filter(line => line.trim() !== '');
          responseLines.forEach(line => {
            if (line.includes('[≡ƒÆÇ] Terminating all games...')) {
              toast({
                title: "Game Termination",
                description: "Closing all active games...",
                variant: "destructive"
              });
            } else if (line.includes('[≡ƒöÑ] Killed:')) {
              const gameName = line.split('Killed:')[1].trim();
              toast({
                title: "Game Closed",
                description: `Terminated: ${gameName}`,
                variant: "destructive"
              });
            } else if (line.includes('[≡ƒÆÇ] All games terminated.')) {
              toast({
                title: "Termination Complete",
                description: "All games have been successfully closed.",
                variant: "default"
              });
            }
          });
          
          // Navigate back after short delay
          setTimeout(() => navigate('/'), 1500);
        })
        .catch(error => {
          console.error('Error closing game:', error);
          
          // Fallback Electron method
          if (window.electron) {
            console.log("Falling back to Electron method for game termination");
            window.electron.ipcRenderer.send('end-game');
            
            // Still navigate back
            setTimeout(() => navigate('/'), 1500);
          }
        });
      }
    };

    // Add the global event listener
    document.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      // Clean up
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [navigate, toast]);

  return (
    <div className="relative min-h-screen">
      <Button 
        variant="outline" 
        size="lg"
        className="fixed top-8 left-8 z-50 bg-white text-black hover:bg-white/90 gap-2 text-xl font-bold shadow-lg border-2"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="h-6 w-6" />
        Back to Games
      </Button>
      
      {serverResponse && (
        <div className="fixed top-24 left-8 z-50 bg-black/80 text-green-500 p-4 rounded-md font-mono whitespace-pre">
          {serverResponse}
        </div>
      )}
      
      <RFIDCountdown 
        onExit={() => navigate('/')} 
        activeGame="All-in-One Sports VR"
        trailer="https://www.youtube.com/watch?v=uXDM7LgRSWc"
      />
    </div>
  );
}
