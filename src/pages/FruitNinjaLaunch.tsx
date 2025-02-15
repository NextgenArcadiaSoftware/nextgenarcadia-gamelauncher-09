import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
export default function FruitNinjaLaunch() {
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    toast({
      title: "✨ Game Ready",
      description: "Fruit Ninja VR is ready to launch"
    });
  }, [toast]);
  const handleContinue = () => {
    navigate('/');
  };
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

          {/* Game Description */}
          <div className="text-center">
            <p className="text-white/90 text-xl leading-relaxed">
              Become a fruit-slicing master in VR! Slice and dice your way through waves of juicy fruits, 
              while avoiding explosive bombs. Experience the thrill of being a true ninja in virtual reality!
            </p>
          </div>

          {/* Game Features */}
          <div className="grid grid-cols-3 gap-4 text-center">
            {['Classic Mode', 'Zen Mode', 'Arcade Mode'].map(feature => {})}
          </div>

          {/* Start Button */}
          <div className="flex flex-col items-center gap-4 mt-8">
            <div className="animate-[pulse_2s_ease-in-out_infinite] text-white text-2xl font-bold">PRESS F TO START</div>
            
            
          </div>
        </div>
      </div>
    </div>;
}