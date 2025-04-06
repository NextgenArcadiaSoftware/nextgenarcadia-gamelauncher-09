
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import NotFound from './pages/NotFound';
import Index from './pages/Index';
import Library from './pages/Library';
import CppLauncher from './pages/CppLauncher';
import FruitNinjaLaunch from './pages/FruitNinjaLaunch';
import ElvenAssassinLaunch from './pages/ElvenAssassinLaunch';
import CrisBrigadeLaunch from './pages/CrisBrigadeLaunch';
import PlankLaunch from './pages/PlankLaunch';
import CricketLaunch from './pages/CricketLaunch';
import ArizonaSunshineLaunch from './pages/ArizonaSunshineLaunch';
import UndeadCitadelLaunch from './pages/UndeadCitadelLaunch';
import PropagationLaunch from './pages/PropagationLaunch';
import SubsideLaunch from './pages/SubsideLaunch';
import SportsLaunch from './pages/SportsLaunch';
import CreedLaunch from './pages/CreedLaunch';
import BeatSaberLaunch from './pages/BeatSaberLaunch';
import RollerCoasterLaunch from './pages/RollerCoasterLaunch';
import UnknownGameLaunch from './pages/UnknownGameLaunch';
import { GameSelectionFlow } from './components/game-launch/GameSelectionFlow';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/library" element={<Library />} />
        <Route path="/cpp-launcher" element={<CppLauncher />} />
        <Route path="/game-flow" element={<GameSelectionFlow />} />
        <Route path="/games/fruit-ninja" element={<FruitNinjaLaunch />} />
        <Route path="/games/elven-assassin" element={<ElvenAssassinLaunch />} />
        <Route path="/games/crisis-brigade" element={<CrisBrigadeLaunch />} />
        <Route path="/games/richies-plank" element={<PlankLaunch />} />
        <Route path="/games/ib-cricket" element={<CricketLaunch />} />
        <Route path="/games/arizona-sunshine" element={<ArizonaSunshineLaunch />} />
        <Route path="/games/undead-citadel" element={<UndeadCitadelLaunch />} />
        <Route path="/games/propagation" element={<PropagationLaunch />} />
        <Route path="/games/subside" element={<SubsideLaunch />} />
        <Route path="/games/sports" element={<SportsLaunch />} />
        <Route path="/games/creed" element={<CreedLaunch />} />
        <Route path="/games/beat-saber" element={<BeatSaberLaunch />} />
        <Route path="/games/rollercoaster" element={<RollerCoasterLaunch />} />
        <Route path="/unknown-game" element={<UnknownGameLaunch />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
