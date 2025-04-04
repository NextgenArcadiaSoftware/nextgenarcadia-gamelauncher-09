
import { useNavigate } from 'react-router-dom';
import { RFIDCountdown } from '@/components/RFIDCountdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { sendGameWebhook } from '@/services/GameService'; // Import the webhook method
import { useToast } from '@/components/ui/use-toast';

export default function BeatSaberLaunch() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Optional method to demonstrate webhook usage
  const handleWebhookGameStart = async () => {
    try {
      const result = await sendGameWebhook('Beat Saber', 'start');
      toast({
        title: "Game Started",
        description: result.message || "Beat Saber launched via webhook"
      });
    } catch (error) {
      toast({
        title: "Launch Error",
        description: "Failed to start Beat Saber",
        variant: "destructive"
      });
    }
  };

  const handleWebhookGameStop = async () => {
    try {
      const result = await sendGameWebhook('Beat Saber', 'stop');
      toast({
        title: "Game Stopped",
        description: result.message || "Beat Saber stopped via webhook"
      });
    } catch (error) {
      toast({
        title: "Stop Error", 
        description: "Failed to stop Beat Saber",
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
      
      {/* Optional webhook buttons for demonstration */}
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
        activeGame="Beat Saber"
        trailer="https://www.youtube.com/watch?v=vL39Sg2AqWg"
        steamUrl="steam://rungameid/620980"
        useWebhookOnly={true}
      />
    </div>
  );
}
