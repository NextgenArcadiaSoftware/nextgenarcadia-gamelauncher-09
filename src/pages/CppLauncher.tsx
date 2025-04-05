
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, X, Loader } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { ErrorBoundary } from 'react-error-boundary';

interface ApiResponse {
  status: 'success' | 'error';
  message?: string;
  error?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function CppLauncher() {
  const navigate = useNavigate();
  const [isLaunching, setIsLaunching] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [controller, setController] = useState<AbortController | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup ongoing requests on unmount
      controller?.abort();
    };
  }, [controller]);

  const makeRequest = async (endpoint: string) => {
    const newController = new AbortController();
    setController(newController);
    const timeoutId = setTimeout(() => newController.abort(), 5000);

    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: newController.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData: ApiResponse = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      return await response.json() as ApiResponse;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const handleLaunch = async () => {
    setIsLaunching(true);
    try {
      const data = await makeRequest('launch');
      toast({
        title: 'VR Cricket',
        description: data.message || 'Game launched successfully',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Launch error:', error);
      toast({
        title: 'Launch Failed',
        description: `Failed to launch VR Cricket: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsLaunching(false);
    }
  };

  const handleExit = async () => {
    setIsExiting(true);
    try {
      const data = await makeRequest('close');
      toast({
        title: 'VR Cricket',
        description: data.message || 'Game exited successfully',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Exit error:', error);
      toast({
        title: 'Exit Failed',
        description: `Failed to exit VR Cricket: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsExiting(false);
    }
  };

  return (
    <ErrorBoundary
      fallback={<div className="text-red-500 p-4">Launcher component crashed</div>}
      onError={(error) => console.error('Component error:', error)}
    >
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black p-8">
        <Button 
          variant="outline" 
          size="lg"
          className="fixed top-8 left-8 z-50 bg-white/80 text-black hover:bg-white gap-2 text-xl font-bold shadow-lg border-2"
          onClick={() => navigate('/')}
          aria-label="Return to games list"
        >
          <ArrowLeft className="h-6 w-6" />
          Back to Games
        </Button>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-12 text-center">
          VR Cricket Launcher
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <Button
            variant="default"
            size="lg"
            className="h-40 text-3xl font-bold bg-green-600 hover:bg-green-700 transition-all duration-300 rounded-xl shadow-lg flex items-center justify-center gap-4"
            onClick={handleLaunch}
            disabled={isLaunching || isExiting}
            aria-label={isLaunching ? 'Launching game' : 'Launch game'}
          >
            {isLaunching ? (
              <Loader className="h-12 w-12 animate-spin" />
            ) : (
              <Play className="h-12 w-12" />
            )}
            {isLaunching ? 'Launching...' : 'Launch'}
          </Button>

          <Button
            variant="default"
            size="lg"
            className="h-40 text-3xl font-bold bg-red-600 hover:bg-red-700 transition-all duration-300 rounded-xl shadow-lg flex items-center justify-center gap-4"
            onClick={handleExit}
            disabled={isExiting || isLaunching}
            aria-label={isExiting ? 'Exiting game' : 'Exit game'}
          >
            {isExiting ? (
              <Loader className="h-12 w-12 animate-spin" />
            ) : (
              <X className="h-12 w-12" />
            )}
            {isExiting ? 'Exiting...' : 'Exit'}
          </Button>
        </div>
      </div>
    </ErrorBoundary>
  );
}
