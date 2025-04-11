import { useState, useEffect } from 'react';
import { Routes, Route, Outlet, useNavigate, useLocation } from 'react-router-dom';

import Index from './pages/Index';
import Library from './pages/Library';
import CppLauncher from './pages/CppLauncher';
import FruitNinjaLaunch from './pages/FruitNinjaLaunch';
import ElvenAssassinLaunch from './pages/ElvenAssassinLaunch';
import CrisBrigadeLaunch from './pages/CrisBrigadeLaunch';
import SportsLaunch from './pages/SportsLaunch';
import PlankLaunch from './pages/PlankLaunch';
import CricketLaunch from './pages/CricketLaunch';
import UndeadCitadelLaunch from './pages/UndeadCitadelLaunch';
import ArizonaSunshineLaunch from './pages/ArizonaSunshineLaunch';
import SubsideLaunch from './pages/SubsideLaunch';
import PropagationLaunch from './pages/PropagationLaunch';
import CreedLaunch from './pages/CreedLaunch';
import NotFound from './pages/NotFound';
import UnknownGameLaunch from './pages/UnknownGameLaunch';
import BeatSaberLaunch from './pages/BeatSaberLaunch';
import RollerCoasterLaunch from './pages/RollerCoasterLaunch';
import CybridLaunch from './pages/CybridLaunch';
import CricVrxLaunch from './pages/CricVrxLaunch';

import './App.css';
import { Toaster } from './components/ui/toaster';
import { Screensaver } from './components/Screensaver';
import { GameSelectionFlow } from './components/game-launch/GameSelectionFlow';
import { initializeTimerTo8Minutes } from './lib/update-timer-settings';

const inactivityTimeout = import.meta.env.VITE_SCREENSAVER_TIMEOUT ? parseInt(import.meta.env.VITE_SCREENSAVER_TIMEOUT) : 30000;

function App() {
  const [showScreensaver, setShowScreensaver] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const navigate = useNavigate();
  const location = useLocation();

  const handleUserInteraction = () => {
    setLastInteraction(Date.now());
    if (showScreensaver) {
      setShowScreensaver(false);
    }
  };

  const handleCloseScreensaver = () => {
    setShowScreensaver(false);
    navigate('/');
  };

  useEffect(() => {
    const initSettings = async () => {
      await initializeTimerTo8Minutes();
    };
    
    initSettings();
    
    const timer = setTimeout(() => {
      const timeSinceLastInteraction = Date.now() - lastInteraction;
      if (timeSinceLastInteraction >= inactivityTimeout && location.pathname !== '/') {
        setShowScreensaver(true);
      }
    }, inactivityTimeout);

    return () => {
      clearTimeout(timer);
    };
  }, [lastInteraction, location.pathname, navigate]);

  useEffect(() => {
    document.addEventListener('mousemove', handleUserInteraction);
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('mousemove', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  return (
    <div className="app" onClick={handleUserInteraction} onMouseMove={handleUserInteraction} onTouchStart={handleUserInteraction}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/library" element={<Library />} />
        <Route path="/cpp-launcher" element={<CppLauncher />} />
        <Route path="/game-flow" element={<GameSelectionFlow />} />
        <Route path="/fruitninjalaunch" element={<FruitNinjaLaunch />} />
        <Route path="/elvenassassinlaunch" element={<ElvenAssassinLaunch />} />
        <Route path="/crisisbrigadelaunch" element={<CrisBrigadeLaunch />} />
        <Route path="/sportslaunch" element={<SportsLaunch />} />
        <Route path="/planklaunch" element={<PlankLaunch />} />
        <Route path="/cricketlaunch" element={<CricketLaunch />} />
        <Route path="/undeadcitadellaunch" element={<UndeadCitadelLaunch />} />
        <Route path="/arizonalaunch" element={<ArizonaSunshineLaunch />} />
        <Route path="/subsidelaunch" element={<SubsideLaunch />} />
        <Route path="/propagationlaunch" element={<PropagationLaunch />} />
        <Route path="/creedlaunch" element={<CreedLaunch />} />
        <Route path="/beatlaunch" element={<BeatSaberLaunch />} />
        <Route path="/rollerlaunch" element={<RollerCoasterLaunch />} />
        <Route path="/cybridlaunch" element={<CybridLaunch />} />
        <Route path="/cricvrxlaunch" element={<CricVrxLaunch />} />
        <Route path="/unknowngamelaunch/:id" element={<UnknownGameLaunch />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Outlet />
      {showScreensaver && <Screensaver onClose={handleCloseScreensaver} />}
      <Toaster />
    </div>
  );
}

export default App;
