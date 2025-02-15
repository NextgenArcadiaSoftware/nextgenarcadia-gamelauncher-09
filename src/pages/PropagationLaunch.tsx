
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { RFIDCountdown } from '@/components/RFIDCountdown';

export default function PropagationLaunch() {
  const [showTimer, setShowTimer] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFPress = () => {
    setShowTimer(true);
  };

  if (showTimer) {
    return <RFIDCountdown 
      onExit={() => navigate('/')} 
      activeGame="Propagation VR"
    />;
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(225deg, #525252 0%, #171717 100%)',
          opacity: 0.8
        }} />
        <div className="absolute inset-0 mix-blend-overlay opacity-30">
          <img src="/lovable-uploads/propagation.png" alt="Propagation Background" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl w-full mx-auto p-8">
        <div className="glass p-8 rounded-3xl space-y-8 relative overflow-hidden border border-neutral-500/20">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4 font-display" style={{
              textShadow: '0 0 20px rgba(115,115,115,0.5), 0 0 40px rgba(115,115,115,0.3)'
            }}>
              PROPAGATION VR
            </h1>
            <div className="flex justify-center gap-4">
              <span className="inline-block px-4 py-1 rounded-full text-sm text-white/90 bg-neutral-500/30 backdrop-blur-sm border border-neutral-500/30">
                Horror
              </span>
              <span className="inline-block px-4 py-1 rounded-full text-sm text-white/90 bg-neutral-500/30 backdrop-blur-sm border border-neutral-500/30">
                Survival
              </span>
            </div>
          </div>

          <div className="animate-[pulse_2s_ease-in-out_infinite] text-white text-7xl font-bold py-8">
            TAP RFID TO START
          </div>

          <div className="flex justify-center">
            <div className="w-32 h-32 flex items-center justify-center bg-neutral-500/20 rounded-2xl border-4 border-white/20 backdrop-blur-sm">
              <span className="text-4xl text-white">🎮</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-white/90 text-xl leading-relaxed">
              Survive a terrifying outbreak in this intense VR horror experience. 
              Face your fears and fight for survival in a world overrun by infected creatures.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            {['Story Mode', 'Survival', 'Co-op'].map((feature, index) => (
              <div key={index} className="p-4 rounded-xl bg-neutral-500/10 backdrop-blur-sm">
                <span className="text-white font-semibold">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
