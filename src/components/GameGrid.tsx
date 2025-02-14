
import { GameCard } from "./GameCard";
import type { Game } from "@/types/game";

interface GameGridProps {
  games: Game[];
  onPlayGame: (title: string, executablePath: string) => void;
  canPlayGames: boolean;
}

export function GameGrid({ games, onPlayGame, canPlayGames }: GameGridProps) {
  const enabledGames = games.filter(game => game.status === 'enabled');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {enabledGames.map((game) => (
        <GameCard
          key={game.id}
          title={game.title}
          description={game.description}
          genre={game.genre}
          release_date={game.release_date}
          thumbnail={game.thumbnail}
          trailer={game.trailer}
          onPlay={() => game.executable_path && onPlayGame(game.title, game.executable_path)}
          canPlayGames={canPlayGames}
        />
      ))}
      {enabledGames.length === 0 && (
        <div className="col-span-3 text-center py-8 text-muted-foreground">
          No games available. Add some games to get started!
        </div>
      )}
    </div>
  );
}
