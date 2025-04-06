
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Keyboard } from 'lucide-react';

// Using the Python server port now
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

// Game key mappings
const GAME_KEYS = {
  "f": "Fruit Ninja",
  "c": "Crisis VRigade 2",
  "s": "Subside Demo",
  "p": "Richie's Plank Experience",
  "i": "iBCricket",
  "a": "Arizona Sunshine",
  "u": "Undead Citadel Demo",
  "e": "Elven Assassin",
  "r": "RollerCoaster Legends",
  "v": "All-In-One Sports VR",
  "g": "Creed Rise to Glory",
  "w": "Beat Saber",
  "z": "Close All Games"
};

const CppLauncher: React.FC = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  // Check server connectivity on component mount
  useEffect(() => {
    checkServerConnection();
    
    // Set up periodic health checks
    const intervalId = setInterval(checkServerConnection, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  const checkServerConnection = async () => {
    setServerStatus('checking');
    try {
      const res = await fetch(`${API_URL}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(2000) // 2 second timeout
      });
      
      if (res.ok) {
        setServerStatus('connected');
        const data = await res.json();
        console.log("Server health check:", data);
      } else {
        setServerStatus('disconnected');
        console.error("Server returned error:", res.status, res.statusText);
      }
    } catch (error) {
      setServerStatus('disconnected');
      console.error('Error checking server connection:', error);
    }
  };

  const handleTestConnection = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setResponse(JSON.stringify(data, null, 2));
        toast({
          title: "Connection Successful",
          description: "Successfully connected to the Python key listener",
        });
      } else {
        setResponse(`Error: ${res.status} ${res.statusText}`);
        toast({
          title: "Connection Failed",
          description: `Error: ${res.status} ${res.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error connecting to Python server:', error);
      setResponse(`Error: ${error instanceof Error ? error.message : String(error)}`);
      toast({
        title: "Connection Failed",
        description: `Could not connect to the server at ${API_URL}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendKey = async (key: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/keypress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setResponse(JSON.stringify(data, null, 2));
        toast({
          title: "Key Sent",
          description: `Successfully sent key "${key}" to launch ${GAME_KEYS[key]}`,
        });
      } else {
        const errorText = await res.text();
        setResponse(`Error: ${res.status} ${res.statusText}\n${errorText}`);
        toast({
          title: "Key Send Failed",
          description: `Error: ${res.status} ${res.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending key to Python server:', error);
      setResponse(`Error: ${error instanceof Error ? error.message : String(error)}`);
      toast({
        title: "Key Send Failed",
        description: `Could not send key to the server at ${API_URL}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const closeGames = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setResponse(JSON.stringify(data, null, 2));
        toast({
          title: "Games Closed",
          description: "Successfully sent close command to terminate all games",
        });
      } else {
        setResponse(`Error: ${res.status} ${res.statusText}`);
        toast({
          title: "Close Command Failed",
          description: `Error: ${res.status} ${res.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending close command to Python server:', error);
      setResponse(`Error: ${error instanceof Error ? error.message : String(error)}`);
      toast({
        title: "Close Command Failed",
        description: `Could not send close command to the server at ${API_URL}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Game Launcher</h1>
      
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-3 h-3 rounded-full ${
          serverStatus === 'connected' ? 'bg-green-500' : 
          serverStatus === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'
        }`}></div>
        <p>
          Python Key Listener: {
            serverStatus === 'connected' ? 'Connected' : 
            serverStatus === 'disconnected' ? 'Disconnected' : 'Checking...'
          }
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={checkServerConnection}
          disabled={serverStatus === 'checking'}
        >
          Refresh
        </Button>
      </div>
      
      <p className="mb-4">Server Address: {API_URL}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Test Connection</h2>
          <Button 
            onClick={handleTestConnection} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Testing...' : 'Test Connection'}
          </Button>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Close All Games</h2>
          <Button 
            onClick={closeGames} 
            disabled={loading}
            variant="destructive"
            className="w-full"
          >
            {loading ? 'Closing...' : 'Close All Games'}
          </Button>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-3">Launch Games</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
        {Object.entries(GAME_KEYS).filter(([k]) => k !== 'z').map(([key, gameName]) => (
          <Button 
            key={key}
            onClick={() => sendKey(key)}
            disabled={loading}
            className="flex flex-col items-center justify-center h-24 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Keyboard className="h-5 w-5 mb-1" />
            <span className="text-lg font-bold">{key.toUpperCase()}</span>
            <span className="text-xs text-center">{gameName}</span>
          </Button>
        ))}
      </div>
      
      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <h3 className="font-semibold mb-2">Server Response:</h3>
          <pre className="whitespace-pre-wrap overflow-auto bg-black text-green-400 p-3 rounded-md">{response}</pre>
        </div>
      )}
    </div>
  );
};

export default CppLauncher;
