
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CppServerStatus } from '@/components/game-launch/CppServerStatus';

export default function FruitNinjaLaunch() {
  const navigate = useNavigate();
  const [connectionError, setConnectionError] = useState<string | null>(null);

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
      
      <div className="fixed top-24 left-8 right-8 mx-auto max-w-xl z-50">
        <CppServerStatus />
        
        {connectionError && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              {connectionError}
              <p className="mt-2 font-mono text-xs">
                If running locally, make sure the C++ server has CORS headers enabled.
              </p>
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      <RFIDCountdown 
        onExit={() => navigate('/')} 
        activeGame="Fruit Ninja VR"
        trailer="https://www.youtube.com/watch?v=gV6_2NhRPUo"
      />
    </div>
  );
}
