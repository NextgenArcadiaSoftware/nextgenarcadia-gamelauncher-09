
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function SportsLaunch() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Set up global key event listener for the C++ program
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      console.log(`Global keydown detected: ${e.key}`);
      
      // Special handling for 'V' key to launch All-in-One Sports VR
      if (e.key.toLowerCase() === 'v') {
        console.log('V key detected - Launching All-in-One Sports VR');
        
        // First try the keypress endpoint with simplified payload
        fetch("http://localhost:5001/keypress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: 'v' })
        })
        .then(response => {
          console.log(`Keypress response status: ${response.status}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text().then(text => {
            try {
              // Try to parse as JSON if possible
              return JSON.parse(text);
            } catch (e) {
              // If not JSON, return as text
              return { message: text || "Command received" };
            }
          });
        })
        .then(data => {
          console.log('C++ server response:', data);
          toast({
            title: "Game Launch",
            description: "Launching All-in-One Sports VR..."
          });
          
          // Also try a second request with the specific game information
          // This is a backup in case the first format doesn't work
          return fetch("http://localhost:5001/keypress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              key: 'v', 
              command: 'KEY_V_PRESSED', 
              game: 'All-in-One Sports VR' 
            })
          }).catch(err => {
            // Silently handle this second request error
            console.log('Second format request error (ignoring):', err);
          });
        })
        .catch(error => {
          console.error('Error sending V key to C++ server:', error);
          
          // Try the fallback approach with a different format
          console.log('Trying fallback approach...');
          fetch("http://localhost:5001/keypress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              command: "KEY_V_PRESSED",
              game: "All-in-One Sports VR"
            })
          })
          .then(response => {
            if (!response.ok) throw new Error(`Fallback HTTP error: ${response.status}`);
            console.log('Fallback approach succeeded');
            toast({
              title: "Game Launch",
              description: "Launching All-in-One Sports VR..."
            });
          })
          .catch(fallbackError => {
            console.error('Fallback approach also failed:', fallbackError);
            toast({
              variant: "destructive",
              title: "Launch Error",
              description: "Could not connect to game launcher"
            });
            
            // If Electron is available, try that as a last resort
            if (window.electron) {
              console.log("Falling back to Electron keypress simulation");
              window.electron.ipcRenderer.send('simulate-keypress', 'v');
            }
          });
        });
      }
    };

    // Add the global event listener
    document.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      // Clean up
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [toast]);

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
      <RFIDCountdown 
        onExit={() => navigate('/')} 
        activeGame="All-in-One Sports VR"
        trailer="https://www.youtube.com/watch?v=uXDM7LgRSWc"
      />
    </div>
  );
}
