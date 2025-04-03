
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function FruitNinjaLaunch() {
  const navigate = useNavigate();
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Check for CORS issues
  useEffect(() => {
    const checkConnection = async () => {
      try {
        await fetch('http://localhost:5001/health', {
          method: 'GET',
          headers: { 'Accept-Charset': 'UTF-8' },
          mode: 'cors',
        });
        setConnectionError(null);
      } catch (error) {
        console.error('Connection test error:', error);
        setConnectionError(
          "Unable to connect to the game server. If running locally, please ensure CORS is enabled on the server."
        );
      }
    };
    
    checkConnection();
  }, []);

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
