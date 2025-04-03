
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const OnscreenKeyboard = () => {
  const { toast } = useToast();
  const [connectionError, setConnectionError] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const [lastStatus, setLastStatus] = useState<number | null>(null);

  // Game mapping configuration
  const gameButtons = [
    { key: 'f', name: 'Fruit Ninja' },
    { key: 'c', name: 'Crisis VRigade' },
    { key: 's', name: 'Subside' },
    { key: 'p', name: 'Plank Experience' },
    { key: 'i', name: 'iBCricket' },
    { key: 'a', name: 'Arizona Sunshine' },
    { key: 'u', name: 'Undead Citadel' },
    { key: 'e', name: 'Elven Assassin' },
    { key: 'r', name: 'RollerCoaster Legends' },
    { key: 'v', name: 'All-In-One Sports' },
    { key: 'g', name: 'Creed Rise to Glory' },
    { key: 'w', name: 'Beat Saber' }
  ];

  // Check server connectivity on mount
  useEffect(() => {
    checkServerConnectivity();
    
    // Set up periodic connectivity checks
    const intervalId = setInterval(checkServerConnectivity, 10000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const checkServerConnectivity = () => {
    fetch('http://localhost:5001/health', {
      signal: AbortSignal.timeout(2000)
    })
      .then(response => {
        if (response.ok || response.status === 204 || response.status === 404) {
          // 404 might mean the server is running but health endpoint is not implemented
          setConnectionError(false);
        } else {
          throw new Error(`Server returned: ${response.status}`);
        }
      })
      .catch(() => {
        setConnectionError(true);
      });
  };

  const sendCommand = async (key: string) => {
    console.log(`Sending command for game key: ${key}`);
    
    try {
      const response = await fetch('http://localhost:5001/keypress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
        signal: AbortSignal.timeout(3000)
      });

      console.log(`Server responded with status: ${response.status}`);
      setLastStatus(response.status);
      setConnectionError(false);
      
      // Get game name for toast
      const game = gameButtons.find(g => g.key === key);
      
      // Handle empty responses (204 No Content)
      let responseText = '';
      if (response.status === 204) {
        responseText = `Key ${key} sent successfully`;
      } else {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        responseText = await response.text();
      }
      
      console.log('C++ server response:', responseText);
      setLastResponse(responseText);
      
      toast({
        title: "Game Launched",
        description: `Launching ${game?.name || key}...`,
        variant: "default"
      });
      
      // Create and dispatch a real DOM keyboard event for compatibility
      const event = new KeyboardEvent("keydown", {
        key: key.toLowerCase(),
        code: `Key${key.toUpperCase()}`,
        keyCode: key.charCodeAt(0),
        bubbles: true,
        cancelable: true,
        view: window
      });
      document.dispatchEvent(event);
      
    } catch (error) {
      console.error('Error sending command:', error);
      setConnectionError(true);
      
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Could not connect to the C++ server"
      });
      
      // Try fallback methods through Electron
      if (window.electron) {
        console.log("Falling back to Electron keypress simulation");
        window.electron.ipcRenderer.send('simulate-keypress', key.toLowerCase());
      }
    }
  };

  const closeAllGames = async () => {
    console.log('Closing all games...');
    
    try {
      const response = await fetch('http://localhost:5001/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
        signal: AbortSignal.timeout(3000)
      });

      console.log(`Server responded with status: ${response.status}`);
      setLastStatus(response.status);
      setConnectionError(false);
      
      // Handle empty responses (204 No Content)
      let responseText = '';
      if (response.status === 204) {
        responseText = "All games closed successfully";
      } else {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        responseText = await response.text();
      }
      
      console.log('C++ server response:', responseText);
      setLastResponse(responseText);
      
      toast({
        title: "Games Closed",
        description: "All running games have been terminated",
        variant: "destructive"
      });
      
      // Create and dispatch a real DOM keyboard event for X key
      const event = new KeyboardEvent("keydown", {
        key: 'x',
        code: 'KeyX',
        keyCode: 'X'.charCodeAt(0),
        bubbles: true,
        cancelable: true,
        view: window
      });
      document.dispatchEvent(event);
      
    } catch (error) {
      console.error('Error closing games:', error);
      setConnectionError(true);
      
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Could not connect to the C++ server to close games"
      });
      
      // Fallback to Electron
      if (window.electron) {
        console.log("Falling back to Electron end-game command");
        window.electron.ipcRenderer.send('end-game');
      }
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-background">
      <h1 className="text-3xl font-bold mb-6">Game Launcher Keyboard</h1>
      
      {connectionError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            Unable to connect to the C++ server. 
            <button 
              className="ml-2 text-white underline" 
              onClick={() => checkServerConnectivity()}
            >
              Retry Connection
            </button>
          </AlertDescription>
        </Alert>
      )}
      
      {(lastResponse || lastStatus) && !connectionError && (
        <Alert className="mb-6 bg-black/50 border-green-500">
          <AlertTitle>Server Response</AlertTitle>
          <AlertDescription className="font-mono text-green-500">
            {lastStatus && <div>Status: {lastStatus}</div>}
            {lastResponse && <div className="whitespace-pre-line">{lastResponse}</div>}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {gameButtons.map((game) => (
          <button
            key={game.key}
            onClick={() => sendCommand(game.key)}
            className="p-4 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-lg border border-blue-500 flex flex-col items-center justify-center h-24"
          >
            <span className="font-bold">{game.name}</span>
            <span className="text-sm mt-1">({game.key})</span>
          </button>
        ))}
      </div>
      
      <button
        onClick={closeAllGames}
        className="w-full p-4 text-xl bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors shadow-lg border border-red-500 animate-pulse"
      >
        Close All Games
      </button>
    </div>
  );
};

export default OnscreenKeyboard;
