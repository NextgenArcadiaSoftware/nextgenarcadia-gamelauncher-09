
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { sendGameWebhook } from '@/services/GameService';
import { useToast } from '@/components/ui/use-toast';

export default function SubsideLaunch() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleWebhookGameStart = async () => {
    try {
      const result = await sendGameWebhook('Subside', 'start');
      toast({
        title: "Game Started",
        description: result.message || "Subside launched via webhook"
      });
    } catch (error) {
      toast({
        title: "Launch Error",
        description: "Failed to start Subside",
        variant: "destructive"
      });
    }
  };

  const handleWebhookGameStop = async () => {
    try {
      const result = await sendGameWebhook('Subside', 'stop');
      toast({
        title: "Game Stopped",
        description: result.message || "Subside stopped via webhook"
      });
    } catch (error) {
      toast({
        title: "Stop Error",
        description: "Failed to stop Subside",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="relative min-h-screen">
      <Button 
        variant="default" 
        size="lg"
        className="fixed top-8 left-8 z-50 bg-white/80 text-black hover:bg-white gap-2 text-xl font-bold shadow-lg border-2"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="h-6 w-6" />
        Back to Games
      </Button>
      
      <div className="fixed top-8 right-8 z-50 flex gap-2">
        <Button 
          variant="default" 
          onClick={handleWebhookGameStart}
          className="bg-green-500 hover:bg-green-600"
        >
          Start Game (Webhook)
        </Button>
        <Button 
          variant="destructive" 
          onClick={handleWebhookGameStop}
        >
          Stop Game (Webhook)
        </Button>
      </div>
      
      <RFIDCountdown 
        onExit={() => navigate('/')} 
        activeGame="Subside"
        trailer="https://www.youtube.com/watch?v=ZLpIGWcCuYw"
        useWebhookOnly={true}
      />
    </div>
  );
}
