
import { GameCard } from "./GameCard";

interface Game {
  id: number;
  title: string;
  description: string;
  genre: string;
  releaseDate: string;
  thumbnail: string;
  trailer?: string;
  executablePath?: string;
}

interface GameGridProps {
  games: Game[];
  onPlayGame: (title: string, executablePath: string) => void;
  canPlayGames: boolean;
}

export function GameGrid({ games, onPlayGame, canPlayGames }: GameGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game) => (
        <GameCard
          key={game.id}
          {...game}
          onPlay={() => game.executablePath && onPlayGame(game.title, game.executablePath)}
          canPlayGames={canPlayGames}
        />
      ))}
    </div>
  );
}
