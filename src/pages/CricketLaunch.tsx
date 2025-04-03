
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export default function CricketLaunch() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Add direct keypress handling for debugging/demonstration
  const handleDirectLaunch = () => {
    console.log('Sending direct launch command for iB Cricket');
    
    // Send to C++ server with explicit game name
    fetch("http://localhost:5001/keypress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        key: 'i',
        command: 'GAME_LAUNCH',
        game: 'iB Cricket'
      })
    })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return response.text().then(text => {
        try {
          return JSON.parse(text);
        } catch (e) {
          return { message: text || "Command received" };
        }
      });
    })
    .then(data => {
      console.log('Game launch response:', data);
      toast({
        title: "Game Launching",
        description: "Launching iB Cricket...",
      });
    })
    .catch(error => {
      console.error('Error launching game:', error);
      toast({
        variant: "destructive",
        title: "Launch Error",
        description: "Failed to connect to game launcher service"
      });
      
      // Fall back to Electron method if available
      if (window.electron) {
        console.log("Falling back to Electron keypress simulation");
        window.electron.ipcRenderer.send('simulate-keypress', 'i');
      }
    });
  };

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
      
      <Button
        variant="default"
        size="lg" 
        className="fixed top-8 right-8 z-50 bg-green-600 text-white hover:bg-green-700 gap-2 text-xl font-bold shadow-lg"
        onClick={handleDirectLaunch}
      >
        Launch iB Cricket
      </Button>
      
      <RFIDCountdown 
        onExit={() => navigate('/')} 
        activeGame="iB Cricket"
        trailer="https://www.youtube.com/watch?v=CJElM1v0xBw"
      />
    </div>
  );
}
