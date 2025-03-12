
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NavigationArrows() {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-2 items-center">
      <div className="glass p-2 rounded-xl backdrop-blur-sm border border-white/20 shadow-lg">
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-1"></div>
          <Button 
            variant="ghost" 
            size="icon"
            className="bg-white/10 hover:bg-white/30 text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
          <div className="col-span-1"></div>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="bg-white/10 hover:bg-white/30 text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="bg-white/10 hover:bg-white/30 text-white"
            onClick={() => navigate('/')}
          >
            <Home className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="bg-white/10 hover:bg-white/30 text-white"
            onClick={() => navigate(1)}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
          
          <div className="col-span-1"></div>
          <Button 
            variant="ghost" 
            size="icon"
            className="bg-white/10 hover:bg-white/30 text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowDown className="h-5 w-5" />
          </Button>
          <div className="col-span-1"></div>
        </div>
      </div>
    </div>
  );
}
