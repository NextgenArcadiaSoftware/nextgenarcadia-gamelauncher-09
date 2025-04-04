
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
import CppLauncher from "./pages/CppLauncher";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Screensaver />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/library" element={<Library />} />
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
          <Route path="/unknown-game" element={<UnknownGameLaunch />} />
          <Route path="/cpp-launcher" element={<CppLauncher />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
