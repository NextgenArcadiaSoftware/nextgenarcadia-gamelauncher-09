
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { RatingScreen } from '@/components/game-launch/RatingScreen';
import { useRFIDDetection } from '@/hooks/useRFIDDetection';

export default function SportsLaunch() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [serverResponse, setServerResponse] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [showRating, setShowRating] = useState(false);
  const [gameEnding, setGameEnding] = useState(false);
  const [rfidDetected, setRfidDetected] = useState(false);
  const activeGame = "All-in-One Sports VR";
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

  // Set up global key event listener for both the X key and Python program
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      console.log(`Global keydown detected: ${e.key}`);
      
      // RFID simulation with number keys (10+ digits)
      if (/^\d$/.test(e.key) && !rfidDetected) {
        setTimeout(() => {
          setRfidDetected(true);
          toast({
            title: "RFID Detected",
            description: "Redirecting to CPP launcher...",
          });
          
          // Navigate to CPP launcher after RFID detection
          setTimeout(() => navigate('/cpp-launcher'), 1500);
        }, 1000);
        return;
      }
      
      // Special handling for X key to end the game
      if (e.key.toLowerCase() === 'x') {
        console.log('X key detected, ending game');
        setRequestStatus('Sending close command to server...');
        
        handleGameEnd();
      }
    };

    // Add the global event listener
    document.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      // Clean up
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [navigate, toast, rfidDetected]);
  
  // Function to handle game ending and showing rating screen
  const handleGameEnd = () => {
    setGameEnding(true);
    
    // Send close command to Python server
    fetch(`${API_URL}/close`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json; charset=utf-8",
        "Accept-Charset": "UTF-8" 
      },
      body: JSON.stringify({}),
      signal: AbortSignal.timeout(3000)
    })
    .then(response => {
      console.log('Server responded with status:', response.status);
      setRequestStatus(`Server responded with status: ${response.status}`);
      
      if (response.status === 204 || response.ok) {
        toast({
          title: "Game Termination",
          description: "Successfully sent close command to server",
          variant: "default"
        });
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.status === 204 ? 
        "Game close command successful" : 
        response.text().then(text => new TextDecoder('utf-8').decode(new TextEncoder().encode(text)));
    })
    .then(text => {
      console.log('Close game response:', text);
      setServerResponse(text);
      
      // Show rating screen instead of immediate navigation
      setShowRating(true);
    })
    .catch(error => {
      console.error('Error closing game:', error);
      setServerResponse(`Error: ${error.message}`);
      
      // Fallback Electron method
      if (window.electron) {
        console.log("Falling back to Electron method for game termination");
        window.electron.ipcRenderer.send('end-game');
        
        toast({
          title: "Fallback Method",
          description: "Using Electron to terminate games",
          variant: "destructive"
        });
        
        // Show rating screen even on error
        setShowRating(true);
      }
    });
  };
  
  // Simulating RFID detection for easy testing
  const simulateRFID = () => {
    setRfidDetected(true);
    toast({
      title: "RFID Detected",
      description: "Redirecting to CPP launcher...",
    });
    
    // Navigate to CPP launcher after RFID detection
    setTimeout(() => navigate('/cpp-launcher'), 1500);
  };
  
  // Handle rating submission and return to home
  const handleRatingSubmit = (rating: number) => {
    toast({
      title: "Thank You!",
      description: `You rated ${activeGame} ${rating} stars.`,
    });
    
    // Navigate to home after rating
    setTimeout(() => navigate('/'), 1500);
  };
  
  // Show rating screen if game is ending
  if (showRating) {
    return <RatingScreen activeGame={activeGame} onSubmit={handleRatingSubmit} />;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
      <Button 
        variant="outline" 
        size="lg"
        className="fixed top-8 left-8 z-50 bg-white text-black hover:bg-white/90 gap-2 text-xl font-bold shadow-lg border-2"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="h-6 w-6" />
        Back to Games
      </Button>
      
      {(serverResponse || requestStatus) && (
        <div className="fixed top-24 left-8 z-50 bg-black/80 text-green-500 p-4 rounded-md font-mono whitespace-pre max-w-lg overflow-auto max-h-[80vh]">
          {requestStatus && <div className="mb-2 text-yellow-300">{requestStatus}</div>}
          {serverResponse && <div>{serverResponse}</div>}
        </div>
      )}
      
      {/* Test button for RFID simulation */}
      <Button
        variant="default"
        size="lg"
        className="fixed top-8 right-8 z-50 bg-purple-600 hover:bg-purple-700"
        onClick={simulateRFID}
      >
        Simulate RFID Scan
      </Button>
      
      <div className="container mx-auto h-screen flex flex-col items-center justify-center text-white">
        <h1 className="text-5xl font-bold mb-8">All-in-One Sports VR</h1>
        <p className="text-xl mb-12 max-w-2xl text-center">
          Experience multiple sports in virtual reality! Play tennis, basketball, 
          baseball, golf, and more in this immersive collection of sports games.
        </p>
        
        <div className="flex gap-4">
          <Button 
            size="lg" 
            className="bg-green-600 hover:bg-green-700 text-xl px-8 py-6"
            onClick={simulateRFID}
          >
            Scan RFID to Play
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="border-white/30 bg-white/10 hover:bg-white/20 text-xl px-8 py-6"
            onClick={() => navigate('/')}
          >
            Back to Library
          </Button>
        </div>
      </div>
    </div>
  );
}
