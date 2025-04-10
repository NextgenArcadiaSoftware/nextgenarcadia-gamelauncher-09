
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, ArrowLeft } from 'lucide-react';

interface GameLaunchInfoProps {
  gameName: string;
  imageUrl: string;
  description: string;
  tags: string[];
  tagColors: Record<string, string>;
  onLaunch: () => void;
  loading?: boolean;
}

export const GameLaunchInfo: React.FC<GameLaunchInfoProps> = ({
  gameName,
  imageUrl,
  description,
  tags,
  tagColors,
  onLaunch,
  loading = false
}) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-[#1A1F2C] to-[#2A2F3C] min-h-screen text-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mr-4 text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Library
          </Button>
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA] bg-clip-text text-transparent">
            {gameName}
          </h1>
        </div>
        
        <div className="glass p-8 rounded-2xl space-y-8 relative overflow-hidden border border-white/20 bg-[#222232]/50 backdrop-blur-xl">
          <div className="text-center">
            <img 
              src={imageUrl} 
              alt={gameName} 
              className="rounded-xl mx-auto mb-8 max-h-[300px]"
            />
            
            <p className="text-xl text-white/80 mb-6">
              {description}
            </p>
            
            <div className="flex gap-4 justify-center flex-wrap">
              {tags.map((tag, index) => {
                const colorClass = tagColors[tag] || 'bg-blue-500/30 border-blue-500/30';
                return (
                  <span 
                    key={index} 
                    className={`inline-block px-4 py-1 rounded-full text-sm text-white/90 ${colorClass} backdrop-blur-sm`}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button
              onClick={onLaunch}
              disabled={loading}
              className="text-xl font-semibold py-6 px-12 bg-gradient-to-r from-[#7E69AB] to-[#9b87f5] hover:from-[#9b87f5] hover:to-[#7E69AB] text-white h-auto"
            >
              <Play className="mr-2 h-6 w-6" />
              Launch Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
