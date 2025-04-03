
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Game } from '@/types/game';
import { CategoryBar } from '@/components/CategoryBar';
import { GameGrid } from '@/components/GameGrid';
import { SearchBar } from '@/components/SearchBar';
import { useCategory } from '@/hooks/useCategory';
import { useSearch } from '@/hooks/useSearch';
import { useGames } from '@/hooks/useGames';
import { Screensaver } from '@/components/Screensaver';
import { Header } from '@/components/Header';
import { Background } from '@/components/Background';
import { useSettings } from '@/hooks/useSettings';
import { useToast } from '@/components/ui/use-toast';

export default function Index() {
  const [showScreensaver, setShowScreensaver] = useState(false);
  const [timer, setTimer] = useState(null);
  const containerRef = useRef(null);
  const { categories, selectedCategory, setSelectedCategory } = useCategory();
  const { searchTerm } = useSearch();
  const { games, error } = useGames(selectedCategory, searchTerm);
  const { settings } = useSettings();
  const { toast } = useToast();

  const handleInactivity = () => {
    setShowScreensaver(true);
  };

  const resetInactivityTimer = () => {
    setShowScreensaver(false);
    if (timer) clearTimeout(timer);

    // @ts-ignore
    setTimer(setTimeout(handleInactivity, settings?.screensaverTimeout * 1000 || 60000));
  };

  useEffect(() => {
    resetInactivityTimer();

    const handleEvent = () => {
      resetInactivityTimer();
    };

    const events = ['mousemove', 'mousedown', 'scroll', 'keydown'];
    events.forEach(event => window.addEventListener(event, handleEvent));

    return () => {
      if (timer) clearTimeout(timer);
      events.forEach(event => window.removeEventListener(event, handleEvent));
    };
  }, [settings]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background />

      <Header />
      
      <div className="container px-4 py-8 mx-auto mt-8">
        <CategoryBar 
          categories={categories} 
          selectedCategory={selectedCategory} 
          onCategorySelect={setSelectedCategory} 
        />
        <SearchBar />
        <GameGrid 
          games={games} 
          onPlayGame={() => {}} 
          canPlayGames={true}
        />
      </div>
      
      {/* Add keyboard link */}
      <div className="fixed bottom-4 right-4 z-50">
        <Link 
          to="/keyboard" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2"
        >
          <span className="hidden sm:inline">Game Launcher</span> Keyboard
        </Link>
      </div>
      
      {showScreensaver && <Screensaver />}
    </div>
  );
}
