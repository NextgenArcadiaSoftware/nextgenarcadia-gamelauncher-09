import React, { useState, useEffect } from 'react';
import { GameLaunchHeader } from './GameLaunchHeader';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { Play, ArrowRight } from 'lucide-react';

interface GameData {
  title: string;
  description: string;
  thumbnail: string;
  genre: string;
  trailer?: string;
}

interface GameLaunchScreenProps {
  game: GameData;
  onContinue: () => void;
}

export function GameLaunchScreen({ game, onContinue }: GameLaunchScreenProps) {
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerLoaded, setTrailerLoaded] = useState(false);
  const [trailerError, setTrailerError] = useState(false);
  const { toast } = useToast();
  const trailerUrl = getYouTubeEmbedUrl(game.trailer);
  
  // Handle sending game info to C++ server
  const sendGameInfoToServer = () => {
    console.log(`Sending game info to C++ server for: ${game.title}`);
    
    fetch('http://localhost:5001/keypress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        command: 'GAME_LAUNCH',
        game: game.title
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      console.log(`Successfully sent game info to C++ server for: ${game.title}`);
      return response.text().then(text => {
        try {
          return JSON.parse(text);
        } catch (e) {
          return { message: text || 'Command received' };
        }
      });
    })
    .then(data => {
      console.log('C++ server response:', data);
      toast({
        title: "Game Launch",
        description: `Launching ${game.title}...`
      });
      
      // Continue with the normal flow
      onContinue();
    })
    .catch(error => {
      console.error('Error sending game info to C++ server:', error);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Could not connect to the game launcher"
      });
      
      // Continue with the normal flow even if there's an error
      // This ensures the user experience isn't blocked
      onContinue();
      
      // Try Electron method as fallback if available
      if (window.electron) {
        console.log("Falling back to Electron for game launch notification");
        window.electron.ipcRenderer.send('game-launch', game.title);
      }
    });
  };

  function getYouTubeEmbedUrl(url?: string) {
    if (!url) return null;
    
    // Extract YouTube video ID
    const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0&loop=1&playlist=${videoId}`;
    }
    
    return url; // Return original URL if not YouTube
  }
  
  const handleTrailerError = () => {
    console.error("Error loading trailer");
    setTrailerError(true);
    setTrailerLoaded(false);
  };
  
  const handleTrailerLoad = () => {
    console.log("Trailer loaded successfully");
    setTrailerLoaded(true);
    setTrailerError(false);
  };
  
  useEffect(() => {
    // If trailer URL is provided, automatically show it after a short delay
    if (trailerUrl) {
      const timer = setTimeout(() => {
        setShowTrailer(true);
      }, 500); // Short delay for smoother transition
      
      return () => clearTimeout(timer);
    }
  }, [trailerUrl]);

  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-gray-900 via-black to-gray-800 overflow-hidden flex flex-col">
      {/* Background effect */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Header */}
      <GameLaunchHeader />
      
      {/* Main content */}
      <div className="flex flex-col md:flex-row flex-grow pt-16 px-4 md:px-8 items-center justify-center gap-8 relative z-10 max-w-7xl mx-auto w-full">
        {/* Left side - Game info */}
        <div className="md:w-1/2 space-y-6 max-w-xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
            {game.title}
          </h1>
          
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
              {game.genre}
            </span>
          </div>
          
          <p className="text-gray-300 text-lg">
            {game.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-8 py-6 text-xl"
              onClick={sendGameInfoToServer}
            >
              <Play className="h-6 w-6" />
              Play Now
            </Button>
          </div>
        </div>
        
        {/* Right side - Visuals (Trailer or Image) */}
        <div className="md:w-1/2 aspect-video flex items-center justify-center">
          {trailerUrl && showTrailer ? (
            <div className={`w-full aspect-video rounded-xl overflow-hidden transition-all duration-500 ${trailerLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <iframe
                src={trailerUrl}
                title={`${game.title} trailer`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={handleTrailerLoad}
                onError={handleTrailerError}
              />
            </div>
          ) : (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-800 border border-gray-700">
              <img 
                src={game.thumbnail || "/placeholder.svg"} 
                alt={game.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              
              {game.trailer && !showTrailer && (
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer group"
                  onClick={() => setShowTrailer(true)}
                >
                  <div className="w-20 h-20 rounded-full bg-blue-600 group-hover:bg-blue-500 flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                    <Play className="h-10 w-10 text-white" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Continue button */}
      <div className="absolute bottom-8 right-8 animate-bounce">
        <Button 
          className="w-32 h-32 text-6xl font-bold text-white bg-blue-500 rounded-2xl hover:bg-blue-600 transform transition-all duration-200 hover:scale-105 active:scale-95 border-4 border-white/20"
          onClick={sendGameInfoToServer}
        >
          <ArrowRight className="h-14 w-14" />
        </Button>
      </div>
    </div>
  );
}
