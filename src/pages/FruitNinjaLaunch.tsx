
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { RFIDCountdown } from '@/components/RFIDCountdown';

export default function FruitNinjaLaunch() {
  const [showTimer, setShowTimer] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    toast({
      title: "✨ Game Ready",
      description: "Fruit Ninja VR is ready to launch"
    });
  }, [toast]);

  const handleFPress = () => {
    // Simulate F key press
    const fKeyEvent = new KeyboardEvent('keydown', {
      key: 'f',
      code: 'KeyF',
      keyCode: 70,
      which: 70,
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(fKeyEvent);

    // Start timer
    setShowTimer(true);
  };

  if (showTimer) {
    return <RFIDCountdown 
      onExit={() => navigate('/')} 
      duration={8}
      activeGame="Fruit Ninja VR"
    />;
  }

  return <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      {/* Animated fruit slicing background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{
        background: 'linear-gradient(225deg, #FF4800 0%, #FF0000 100%)',
        opacity: 0.8
      }} />
        <div className="absolute inset-0 mix-blend-overlay opacity-30">
          <img src="/lovable-uploads/32039c8f-e15c-4555-9a7d-5bdfd0db596f.png" alt="Fruit Ninja Background" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl w-full mx-auto p-8">
        <div className="glass p-8 rounded-3xl space-y-8 relative overflow-hidden border border-white/20">
          {/* Game Logo/Title */}
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4 font-display" style={{
            textShadow: '0 0 20px rgba(255,0,0,0.5), 0 0 40px rgba(255,0,0,0.3)'
          }}>
              FRUIT NINJA VR
            </h1>
            <div className="flex justify-center gap-4">
              <span className="inline-block px-4 py-1 rounded-full text-sm text-white/90 bg-red-500/30 backdrop-blur-sm border border-red-500/30">
                Action
              </span>
              <span className="inline-block px-4 py-1 rounded-full text-sm text-white/90 bg-red-500/30 backdrop-blur-sm border border-red-500/30">
                Virtual Reality
              </span>
            </div>
          </div>

          {/* Press F to Start */}
          <div className="animate-[pulse_2s_ease-in-out_infinite] text-white text-7xl font-bold py-8">
            PRESS F TO START
          </div>

          {/* Big F Button */}
          <div className="flex justify-center">
            <button
              onClick={handleFPress}
              className="w-32 h-32 text-6xl font-bold text-white bg-red-500 rounded-2xl hover:bg-red-600 
                       transform transition-all duration-200 hover:scale-105 active:scale-95
                       border-4 border-white/20 shadow-lg backdrop-blur-sm"
            >
              F
            </button>
          </div>

          {/* Game Description */}
          <div className="text-center">
            <p className="text-white/90 text-xl leading-relaxed">
              Become a fruit-slicing master in VR! Slice and dice your way through waves of juicy fruits, 
              while avoiding explosive bombs. Experience the thrill of being a true ninja in virtual reality!
            </p>
          </div>

          {/* Game Features */}
          <div className="grid grid-cols-3 gap-4 text-center">
            {['Classic Mode', 'Zen Mode', 'Arcade Mode'].map(feature => 
              <div key={feature} className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <span className="text-white font-semibold">{feature}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>;
}
