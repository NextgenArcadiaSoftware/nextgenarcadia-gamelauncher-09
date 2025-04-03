
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function FruitNinjaLaunch() {
  const navigate = useNavigate();
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Check for CORS issues
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Use a timeout to avoid hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        await fetch('http://localhost:5001/health', {
          method: 'GET',
          headers: { 
            'Accept-Charset': 'UTF-8',
            'Accept': 'application/json'
          },
          mode: 'cors',
          credentials: 'same-origin',
          signal: controller.signal,
          cache: 'no-cache'
        });

        clearTimeout(timeoutId);
        setConnectionError(null);
      } catch (error) {
        console.error('Connection test error:', error);
        setConnectionError(
          "Unable to connect to the game server. If running locally, please ensure CORS is enabled on the server."
        );
      }
    };
    
    checkConnection();

    // Set up an interval to retry the connection
    const intervalId = setInterval(() => {
      if (connectionError) {
        setRetryCount(prev => prev + 1);
        checkConnection();
      }
    }, 10000); // Retry every 10 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, [connectionError]);

  const handleRetryConnection = () => {
    setRetryCount(prev => prev + 1);
    // Force a new connection check
    setConnectionError("Checking connection...");
  };

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
      
      {connectionError && (
        <Alert variant="destructive" className="fixed top-24 left-8 right-8 mx-auto max-w-xl z-50">
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            {connectionError}
            <p className="mt-2 font-mono text-xs">
              If running locally, make sure the C++ server has CORS headers enabled.
            </p>
            <div className="mt-3">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handleRetryConnection}
                className="text-xs"
              >
                Retry Connection {retryCount > 0 ? `(${retryCount})` : ''}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <RFIDCountdown 
        onExit={() => navigate('/')} 
        activeGame="Fruit Ninja VR"
        trailer="https://www.youtube.com/watch?v=gV6_2NhRPUo"
      />
    </div>
  );
}
