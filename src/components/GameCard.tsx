
import { Play, Video } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import placeholderImage from "../assets/placeholder.svg";

const getImageUrl = (path: string) => {
  console.log("Processing image path:", path);
  
  if (!path) {
    console.log("Empty path, using placeholder");
    return placeholderImage;
  }
  
  if (path.startsWith('data:')) {
    return path;
  }
  
  if (path === 'placeholder.svg' || path === '/placeholder.svg') {
    return placeholderImage;
  }
  
  if (path.startsWith('http')) {
    return path;
  }
  
  if (path.startsWith('/lovable-uploads/')) {
    console.log("Using lovable upload path:", path);
    return path;
  }
  
  const finalPath = path.startsWith('/') ? path : `/${path}`;
  console.log("Final image path:", finalPath);
  return finalPath;
};

interface GameCardProps {
  title: string;
  thumbnail: string;
  description: string;
  genre: string;
  release_date: string;
  trailer?: string;
  executablePath?: string;
  launch_code?: string;
  onPlay: () => void;
  canPlayGames: boolean;
}

export function GameCard({
  title,
  thumbnail,
  description,
  genre,
  release_date,
  trailer,
  executablePath,
  onPlay,
  canPlayGames,
}: GameCardProps) {
  const [imageSrc, setImageSrc] = useState<string>(placeholderImage);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`Loading image for "${title}" from path:`, thumbnail);
    
    const imageUrl = getImageUrl(thumbnail);
    const img = new Image();
    
    img.onload = () => {
      console.log(`Image for "${title}" loaded successfully:`, imageUrl);
      setImageSrc(imageUrl);
    };
    
    img.onerror = () => {
      console.error(`Failed to load image for "${title}" from:`, thumbnail);
      console.log(`Using placeholder for "${title}" instead`);
      setImageSrc(placeholderImage);
    };
    
    img.src = imageUrl;
  }, [thumbnail, title]);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  const handlePlayButtonClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    
    // Check if this is a Steam URL
    if (executablePath && executablePath.startsWith('steam://')) {
      console.log(`Launching Steam game with URL: ${executablePath}`);
      
      // Send to Electron to handle the Steam URL protocol
      if (window.electron) {
        window.electron.ipcRenderer.send('launch-steam-game', executablePath);
      } else {
        // Fallback for web-only environments
        window.open(executablePath, '_blank');
      }
      return;
    }
    
    // Handle dedicated launch pages
    const launchScreenRoutes: Record<string, string> = {
      "Fruit Ninja VR": "/fruitninjalaunch",
      "Elven Assassin": "/elvenassassinlaunch",
      "Crisis Brigade 2 Reloaded": "/crisisbrigadelaunch",
      "All-in-One Sports VR": "/sportslaunch",
      "Richies Plank Experience": "/planklaunch",
      "iB Cricket": "/cricketlaunch",
      "Undead Citadel": "/undeadcitadellaunch",
      "Arizona Sunshine II": "/arizonalaunch",
      "Subside": "/subsidelaunch",
      "Propagation VR": "/propagationlaunch",
      "Creed: Rise to Glory Championship Edition": "/creedlaunch",
      "Beat Saber": "/beatlaunch",
      "RollerCoaster Legends": "/rollerlaunch",
      "CYBRID": "/cybridlaunch",
      "CRICVRX": "/cricvrxlaunch"
    };

    const route = launchScreenRoutes[title];
    if (route) {
      navigate(route);
    } else {
      onPlay();
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    
    try {
      let videoId = '';
      
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1];
      } else if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get('v') || '';
      } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('youtube.com/embed/')[1];
      }
      
      videoId = videoId.split('&')[0];
      videoId = videoId.split('?')[0];
      videoId = videoId.split('/')[0];
      
      if (!videoId) return '';
      
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`;
    } catch (error) {
      console.error('Error parsing YouTube URL:', error);
      return '';
    }
  };

  const handleImageError = () => {
    console.log('Image failed to load:', thumbnail);
    setImageSrc(placeholderImage);
  };

  const videoUrl = trailer;

  return (
    <div 
      className="nintendo-card group"
      onTouchStart={handleTouchStart}
    >
      <div className="relative h-[280px] overflow-hidden rounded-[2rem]">
        <img 
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
          onError={() => {
            console.log(`Image error occurred for "${title}", setting placeholder`);
            setImageSrc(placeholderImage);
          }}
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)'
        }} />
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
              <span className="inline-block px-3 py-1 rounded-full text-xs text-white/90 bg-white/20 backdrop-blur-sm">
                {genre}
              </span>
            </div>
            <div className="flex gap-2">
              {trailer && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="icon"
                      className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                    >
                      <Video className="w-6 h-6 text-white hover:text-orange-500 transition-colors" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass max-w-4xl w-full">
                    <DialogHeader>
                      <DialogTitle>{title} - Trailer</DialogTitle>
                    </DialogHeader>
                    <div className="relative w-full h-0 pt-[56.25%] rounded-2xl overflow-hidden">
                      {isDialogOpen && (
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={getYouTubeEmbedUrl(trailer)}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <Button 
                size="icon"
                className="w-12 h-12 rounded-full bg-white hover:bg-white/90 text-black"
                onClick={handlePlayButtonClick}
              >
                <Play className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
