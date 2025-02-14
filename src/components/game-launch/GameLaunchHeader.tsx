
interface GameLaunchHeaderProps {
  activeGame: string | null | undefined;
  inputWord: string;
  targetWord: string;
}

export function GameLaunchHeader({ activeGame, inputWord, targetWord }: GameLaunchHeaderProps) {
  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-white mb-4 animate-fade-in">
        Launch {activeGame}
      </h2>
      
      {activeGame && (
        <div className="glass p-6 rounded-xl animate-fade-in space-y-4 max-w-md mx-auto mb-6">
          <div className="text-white/80 text-lg">Required Launch Code:</div>
          <div className="text-white font-mono text-4xl bg-black/20 px-6 py-4 rounded-lg font-bold tracking-wider">
            {targetWord}
          </div>
        </div>
      )}

      <div className="text-xl font-mono text-white/80 animate-fade-in">
        Your Input: <span className="text-green-300 font-bold">{inputWord || '...'}</span>
      </div>
    </div>
  );
}
