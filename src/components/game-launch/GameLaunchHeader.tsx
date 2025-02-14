
interface GameLaunchHeaderProps {
  activeGame: string | null | undefined;
  inputWord: string;
  targetWord: string;
}

export function GameLaunchHeader({ activeGame, inputWord, targetWord }: GameLaunchHeaderProps) {
  return (
    <div className="text-center mb-6">
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden">
          <img 
            src={`https://source.unsplash.com/random/800x600/?${encodeURIComponent(activeGame?.toLowerCase() || 'game')}`}
            alt={activeGame || 'Game'} 
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-3xl font-bold text-white animate-fade-in">
          {activeGame}
        </h2>
      </div>
      
      <div className="text-xl font-mono text-white mb-4 animate-fade-in">
        Your Input: <span className="text-green-300">{inputWord || '(type the code)'}</span>
      </div>

      {activeGame && (
        <div className="glass p-4 rounded-xl animate-fade-in space-y-2">
          <div className="text-white/80">Launch Code:</div>
          <div className="text-white font-mono text-2xl bg-black/20 px-4 py-2 rounded-lg">
            {targetWord}
          </div>
        </div>
      )}
    </div>
  );
}
