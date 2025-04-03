
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { checkServerHealth } from '@/services/GameService';
import { useToast } from '../ui/use-toast';

interface CppServerStatusProps {
  onRetry?: () => void;
  silent?: boolean;
}

export function CppServerStatus({ onRetry, silent = false }: CppServerStatusProps) {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const { toast } = useToast();

  // Check server connectivity
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isHealthy = await checkServerHealth(0, silent);
        
        if (isHealthy) {
          setConnectionStatus('connected');
          setReconnectAttempts(0);
        } else {
          throw new Error('Health check failed');
        }
      } catch (error) {
        setConnectionStatus('error');
        setReconnectAttempts(prev => prev + 1);
      }
    };
    
    checkConnection();
    
    // Set up periodic connectivity checks, but with a longer interval
    const intervalId = setInterval(checkConnection, 30000); // Check every 30 seconds instead of 15
    
    return () => {
      clearInterval(intervalId);
    };
  }, [silent]);

  const handleManualRetry = async () => {
    setConnectionStatus('checking');
    
    try {
      const isHealthy = await checkServerHealth(0, false);
      
      if (isHealthy) {
        setConnectionStatus('connected');
        setReconnectAttempts(0);
        
        toast({
          title: "Connection Restored",
          description: "Successfully connected to C++ game launcher server"
        });
        
        if (onRetry) onRetry();
      } else {
        throw new Error('Health check failed');
      }
    } catch (error) {
      setConnectionStatus('error');
      setReconnectAttempts(prev => prev + 1);
      
      toast({
        title: "Connection Failed",
        description: "Could not connect to C++ game launcher",
        variant: "destructive"
      });
    }
  };

  // If silent mode is enabled, don't show any UI during checking or error states
  if (silent && connectionStatus !== 'connected') {
    return null;
  }

  if (connectionStatus === 'checking') {
    return (
      <Alert className="bg-yellow-100 border-yellow-500">
        <AlertTitle className="text-yellow-800">Checking Server Connection</AlertTitle>
        <AlertDescription className="text-yellow-700">
          Testing connection to C++ game server...
        </AlertDescription>
      </Alert>
    );
  }

  if (connectionStatus === 'error') {
    return (
      <Alert variant="destructive">
        <AlertTitle>C++ Server Connection Error</AlertTitle>
        <AlertDescription>
          <p>Cannot connect to C++ game launcher at http://localhost:5001</p>
          {reconnectAttempts > 0 && <p className="mt-1">Reconnect attempts: {reconnectAttempts}</p>}
          <div className="mt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleManualRetry}
            >
              Retry Connection
            </Button>
          </div>
          <p className="mt-2 font-mono text-xs">
            Make sure the C++ server is running with proper CORS headers enabled.
            <br />
            Game launches will default to Electron fallback mode.
          </p>
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert variant="default" className="bg-green-100 border-green-500">
      <AlertTitle className="text-green-800">C++ Server Connected</AlertTitle>
      <AlertDescription className="text-green-700">
        <p>Successfully connected to C++ game launcher server</p>
        <p className="mt-1 text-xs">All game launch commands will be sent directly to the C++ server</p>
      </AlertDescription>
    </Alert>
  );
}
