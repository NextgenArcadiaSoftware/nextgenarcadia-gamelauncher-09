import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { RFIDCountdown } from '@/components/RFIDCountdown';
export default function ElvenAssassinLaunch() {
  const [step, setStep] = useState<'rfid' | 'ready' | 'timer'>('rfid');
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (/^\d$/.test(event.key) && step === 'rfid') {
        toast({
          title: "✨ RFID Detected",
          description: "Elven Assassin is ready to launch"
        });
        setStep('ready');
      }
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [toast, step]);
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
    setStep('timer');
  };
  if (step === 'timer') {
    return <RFIDCountdown onExit={() => navigate('/')} duration={8} activeGame="Elven Assassin" />;
  }
  return <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{
        background: 'linear-gradient(225deg, #2D3436 0%, #000000 100%)',
        opacity: 0.9
      }} />
        <div className="absolute inset-0 mix-blend-overlay opacity-40">
          <img src="/lovable-uploads/elven-assassin.png" alt="Elven Assassin Background" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl w-full mx-auto p-8">
        <div className="glass p-8 rounded-3xl space-y-8 relative overflow-hidden border border-emerald-500/20">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4 font-display" style={{
            textShadow: '0 0 20px rgba(16,185,129,0.5), 0 0 40px rgba(16,185,129,0.3)'
          }}>
              ELVEN ASSASSIN
            </h1>
            <div className="flex justify-center gap-4">
              <span className="inline-block px-4 py-1 rounded-full text-sm text-white/90 bg-emerald-500/30 backdrop-blur-sm border border-emerald-500/30">
                Fantasy
              </span>
              <span className="inline-block px-4 py-1 rounded-full text-sm text-white/90 bg-emerald-500/30 backdrop-blur-sm border border-emerald-500/30">
                Archery
              </span>
            </div>
          </div>

          {step === 'rfid' ? <div className="space-y-8">
              <div className="animate-[pulse_2s_ease-in-out_infinite] text-white text-7xl font-bold py-8">
                TAP RFID CARD TO START
              </div>
              <div className="flex justify-center">
                <div className="w-32 h-32 flex items-center justify-center bg-emerald-500/20 rounded-2xl border-4 border-white/20 backdrop-blur-sm">
                  <span className="text-4xl text-white">🎮</span>
                </div>
              </div>
            </div> : <div className="space-y-8">
              <div className="animate-[pulse_2s_ease-in-out_infinite] text-white text-7xl font-bold py-8">
                PRESS F WHEN READY
              </div>
              <div className="flex justify-center">
                <button onClick={handleFPress} className="w-32 h-32 text-6xl font-bold text-white bg-emerald-500 rounded-2xl hover:bg-emerald-600 
                           transform transition-all duration-200 hover:scale-105 active:scale-95
                           border-4 border-white/20 shadow-lg backdrop-blur-sm">
                  F
                </button>
              </div>
            </div>}

          <div className="text-center">
            <p className="text-white/90 text-xl leading-relaxed">
              Defend your realm as an elite elven archer! Use your bow and arrow to protect 
              the village from waves of orcs and trolls in this immersive VR experience.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            {['Solo Defense', 'Multiplayer', 'Custom Maps'].map((feature, index) => {})}
          </div>
        </div>
      </div>
    </div>;
}