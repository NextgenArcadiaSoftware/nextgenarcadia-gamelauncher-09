
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, X } from 'lucide-react';

export default function CppLauncher() {
  const navigate = useNavigate();

  const handleLaunch = async () => {
    try {
      const response = await fetch('http://localhost:5007/webhook/game-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'start',
          game: 'C++ App'
        }),
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      console.log('Launch command sent successfully');
    } catch (error) {
      console.error('Error sending launch command:', error);
    }
  };

  const handleExit = async () => {
    try {
      const response = await fetch('http://localhost:5007/webhook/game-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'stop',
          game: 'C++ App'
        }),
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      console.log('Exit command sent successfully');
    } catch (error) {
      console.error('Error sending exit command:', error);
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
        C++ Application Launcher
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Button
          variant="default"
          size="lg"
          className="h-40 text-3xl font-bold bg-green-600 hover:bg-green-700 transition-all duration-300 rounded-xl shadow-lg flex items-center justify-center gap-4"
          onClick={handleLaunch}
        >
          <Play className="h-12 w-12" />
          Launch
        </Button>

        <Button
          variant="default"
          size="lg"
          className="h-40 text-3xl font-bold bg-red-600 hover:bg-red-700 transition-all duration-300 rounded-xl shadow-lg flex items-center justify-center gap-4"
          onClick={handleExit}
        >
          <X className="h-12 w-12" />
          Exit
        </Button>
      </div>
    </div>
  );
}
