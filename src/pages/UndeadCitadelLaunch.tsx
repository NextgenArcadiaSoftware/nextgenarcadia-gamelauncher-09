
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { RFIDCountdown } from '@/components/RFIDCountdown';

export default function UndeadCitadelLaunch() {
  const [showTimer, setShowTimer] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFPress = () => {
    setShowTimer(true);
  };

  if (showTimer) {
    return <RFIDCountdown 
      onExit={() => navigate('/')} 
      activeGame="Undead Citadel"
    />;
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(225deg, #7C3AED 0%, #4C1D95 100%)',
          opacity: 0.8
        }} />
        <div className="absolute inset-0 mix-blend-overlay opacity-30">
          <img src="/lovable-uploads/undead.png" alt="Undead Citadel Background" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl w-full mx-auto p-8">
        <div className="glass p-8 rounded-3xl space-y-8 relative overflow-hidden border border-violet-500/20">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4 font-display" style={{
              textShadow: '0 0 20px rgba(124,58,237,0.5), 0 0 40px rgba(124,58,237,0.3)'
            }}>
              UNDEAD CITADEL
            </h1>
            <div className="flex justify-center gap-4">
              <span className="inline-block px-4 py-1 rounded-full text-sm text-white/90 bg-violet-500/30 backdrop-blur-sm border border-violet-500/30">
                Action
              </span>
              <span className="inline-block px-4 py-1 rounded-full text-sm text-white/90 bg-violet-500/30 backdrop-blur-sm border border-violet-500/30">
                Horror
              </span>
            </div>
          </div>

          <div className="animate-[pulse_2s_ease-in-out_infinite] text-white text-7xl font-bold py-8">
            TAP RFID TO START
          </div>

          <div className="flex justify-center">
            <div className="w-32 h-32 flex items-center justify-center bg-violet-500/20 rounded-2xl border-4 border-white/20 backdrop-blur-sm">
              <span className="text-4xl text-white">🎮</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-white/90 text-xl leading-relaxed">
              Battle the undead in medieval combat! Wield swords, axes, and shields as you 
              fight through hordes of zombies in this intense VR action game.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            {['Campaign', 'Arena Mode', 'Weapon Skills'].map((feature, index) => (
              <div key={index} className="p-4 rounded-xl bg-violet-500/10 backdrop-blur-sm">
                <span className="text-white font-semibold">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
