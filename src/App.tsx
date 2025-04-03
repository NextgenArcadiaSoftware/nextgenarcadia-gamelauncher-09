import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Screensaver } from "./components/Screensaver";
import Index from "./pages/Index";
import Library from "./pages/Library";
import NotFound from "./pages/NotFound";
import FruitNinjaLaunch from "./pages/FruitNinjaLaunch";
import ElvenAssassinLaunch from "./pages/ElvenAssassinLaunch";
import CrisBrigadeLaunch from "./pages/CrisBrigadeLaunch";
import SportsLaunch from "./pages/SportsLaunch";
import PlankLaunch from "./pages/PlankLaunch";
import CricketLaunch from "./pages/CricketLaunch";
import UndeadCitadelLaunch from "./pages/UndeadCitadelLaunch";
import ArizonaSunshineLaunch from "./pages/ArizonaSunshineLaunch";
import SubsideLaunch from "./pages/SubsideLaunch";
import PropagationLaunch from "./pages/PropagationLaunch";
import CreedLaunch from "./pages/CreedLaunch";
import BeatSaberLaunch from "./pages/BeatSaberLaunch";
import RollerCoasterLaunch from "./pages/RollerCoasterLaunch";
import UnknownGameLaunch from "./pages/UnknownGameLaunch";
import GameKeyboard from "./pages/GameKeyboard";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <Screensaver />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/library" element={<Library />} />
              <Route path="/keyboard" element={<GameKeyboard />} />
              <Route path="/fruit-ninja" element={<FruitNinjaLaunch />} />
              <Route path="/elven-assassin" element={<ElvenAssassinLaunch />} />
              <Route path="/crisis-brigade" element={<CrisBrigadeLaunch />} />
              <Route path="/sports" element={<SportsLaunch />} />
              <Route path="/plank" element={<PlankLaunch />} />
              <Route path="/cricket" element={<CricketLaunch />} />
              <Route path="/undead-citadel" element={<UndeadCitadelLaunch />} />
              <Route path="/arizona-sunshine" element={<ArizonaSunshineLaunch />} />
              <Route path="/subside" element={<SubsideLaunch />} />
              <Route path="/propagation" element={<PropagationLaunch />} />
              <Route path="/creed" element={<CreedLaunch />} />
              <Route path="/beat-saber" element={<BeatSaberLaunch />} />
              <Route path="/roller-coaster" element={<RollerCoasterLaunch />} />
              <Route path="/unknown-game" element={<UnknownGameLaunch />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
