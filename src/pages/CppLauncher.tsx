
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

export default function CppLauncher() {
  const navigate = useNavigate();
  const [isLaunching, setIsLaunching] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleLaunch = async () => {
    setIsLaunching(true);
    try {
      const response = await fetch('http://localhost:5001/launch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept-Charset': 'UTF-8'
        },
        body: JSON.stringify({}),
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.text();
      console.log('Launch response:', data);
      
      toast({
        title: 'VR Cricket',
        description: 'Game launched successfully',
      });
    } catch (error) {
      console.error('Error launching VR Cricket:', error);
      toast({
        title: 'Error',
        description: 'Failed to launch VR Cricket',
        variant: 'destructive',
      });
    } finally {
      setIsLaunching(false);
    }
  };

  const handleExit = async () => {
    setIsExiting(true);
    try {
      const response = await fetch('http://localhost:5001/close', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept-Charset': 'UTF-8'
        },
        body: JSON.stringify({}),
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.text();
      console.log('Exit response:', data);
      
      toast({
        title: 'VR Cricket',
        description: 'Game exited successfully',
      });
    } catch (error) {
      console.error('Error exiting VR Cricket:', error);
      toast({
        title: 'Error',
        description: 'Failed to exit VR Cricket',
        variant: 'destructive',
      });
    } finally {
      setIsExiting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black p-8">
      <Button 
        variant="outline" 
        size="lg"
        className="fixed top-8 left-8 z-50 bg-white/80 text-black hover:bg-white gap-2 text-xl font-bold shadow-lg border-2"
        onClick={() => navigate('/')}
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
          disabled={isLaunching}
        >
          <Play className="h-12 w-12" />
          {isLaunching ? 'Launching...' : 'Launch'}
        </Button>

        <Button
          variant="default"
          size="lg"
          className="h-40 text-3xl font-bold bg-red-600 hover:bg-red-700 transition-all duration-300 rounded-xl shadow-lg flex items-center justify-center gap-4"
          onClick={handleExit}
          disabled={isExiting}
        >
          <X className="h-12 w-12" />
          {isExiting ? 'Exiting...' : 'Exit'}
        </Button>
      </div>
    </div>
  );
}
