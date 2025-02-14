
interface GameLaunchHeaderProps {
  activeGame: string | null | undefined;
  inputWord: string;
  targetWord: string;
}

export function GameLaunchHeader({ activeGame, inputWord, targetWord }: GameLaunchHeaderProps) {
  return (
    <div className="text-center mb-6">
      <h2 className="text-3xl font-bold text-white mb-4 animate-fade-in">
        Launch {activeGame}
      </h2>
      
      <div className="text-2xl font-mono text-white mb-4 animate-fade-in">
        Your Input: <span className="text-green-300">{inputWord || '(type the code)'}</span>
      </div>

      {activeGame && (
        <div className="glass p-4 rounded-xl animate-fade-in space-y-2">
          <div className="text-white/80">Required Launch Code:</div>
          <div className="text-white font-mono text-xl bg-black/20 px-4 py-2 rounded-lg">
            {targetWord}
          </div>
        </div>
      )}
    </div>
  );
}
