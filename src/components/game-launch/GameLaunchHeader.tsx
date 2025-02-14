
interface GameLaunchHeaderProps {
  activeGame: string | null | undefined;
  inputWord: string;
  targetWord: string;
}

export function GameLaunchHeader({ activeGame, inputWord, targetWord }: GameLaunchHeaderProps) {
  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-white animate-fade-in mb-8">
        Enter Launch Code
      </h2>
      
      {activeGame && (
        <div className="animate-fade-in mb-4">
          <div className="text-white/80 text-xl">Game: {activeGame}</div>
        </div>
      )}
    </div>
  );
}
