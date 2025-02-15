
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { RFIDCountdown } from '@/components/RFIDCountdown';

export default function PropagationLaunch() {
  const [step, setStep] = useState<'rfid' | 'ready' | 'timer'>('rfid');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (/^\d$/.test(event.key) && step === 'rfid') {
        toast({
          title: "✨ RFID Detected",
          description: "Propagation VR is ready to launch"
        });
        setStep('ready');
      }
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [toast, step]);

  const handleFPress = () => {
    setStep('timer');
  };

  if (step === 'timer') {
    return <RFIDCountdown 
      onExit={() => navigate('/')} 
      duration={8}
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

          {step === 'rfid' ? (
            <div className="space-y-8">