
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { RFIDCountdown } from '@/components/RFIDCountdown';

export default function CrisBrigadeLaunch() {
  const [showTimer, setShowTimer] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    toast({
      title: "✨ Game Ready",
      description: "Crisis Brigade 2 Reloaded is ready to launch"
    });
  }, [toast]);

  const handleFPress = () => {
    const fKeyEvent = new KeyboardEvent('keydown', {
      key: 'f',
      code: 'KeyF',
      keyCode: 70,
      which: 70,
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(fKeyEvent);
    setShowTimer(true);
  };

  if (showTimer) {
    return <RFIDCountdown 
      onExit={() => navigate('/')} 
      duration={8}
      activeGame="Crisis Brigade 2 Reloaded"
    />;
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(225deg, #3B82F6 0%, #1E3A8A 100%)',
          opacity: 0.8
        }} />
        <div className="absolute inset-0 mix-blend-overlay opacity-30">
          <img src="/lovable-uploads/crisis-brigade.png" alt="Crisis Brigade Background" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl w-full mx-auto p-8">
        <div className="glass p-8 rounded-3xl space-y-8 relative overflow-hidden border border-blue-500/20">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4 font-display" style={{
              textShadow: '0 0 20px rgba(59,130,246,0.5), 0 0 40px rgba(59,130,246,0.3)'
            }}>
              CRISIS BRIGADE 2
            </h1>
            <div className="flex justify-center gap-4">
              <span className="inline-block px-4 py-1 rounded-full text-sm text-white/90 bg-blue-500/30 backdrop-blur-sm border border-blue-500/30">
                Action
              </span>
              <span className="inline-block px-4 py-1 rounded-full text-sm text-white/90 bg-blue-500/30 backdrop-blur-sm border border-blue-500/30">
                Shooter
              </span>
            </div>
          </div>

          <div className="animate-[pulse_2s_ease-in-out_infinite] text-white text-7xl font-bold py-8">
            PRESS F TO START
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleFPress}
              className="w-32 h-32 text-6xl font-bold text-white bg-blue-500 rounded-2xl hover:bg-blue-600 
                       transform transition-all duration-200 hover:scale-105 active:scale-95
                       border-4 border-white/20 shadow-lg backdrop-blur-sm"
            >
              F
            </button>
          </div>

          <div className="text-center">
            <p className="text-white/90 text-xl leading-relaxed">
              Join the elite Crisis Brigade force! Take on dangerous missions, 
              protect civilians, and face intense tactical combat scenarios in VR.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            {['Story Mode', 'Time Attack', 'Co-op Mission'].map((feature, index) => (
              <div key={index} className="p-4 rounded-xl bg-blue-500/10 backdrop-blur-sm">
                <span className="text-white font-semibold">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
