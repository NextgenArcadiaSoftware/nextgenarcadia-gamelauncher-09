
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Library from "@/pages/Library";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import { AuthProvider } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/AuthGuard";

// Game Launch Pages
import ArizonaSunshineLaunch from "@/pages/ArizonaSunshineLaunch";
import CricketLaunch from "@/pages/CricketLaunch";
import CrisBrigadeLaunch from "@/pages/CrisBrigadeLaunch";
import ElvenAssassinLaunch from "@/pages/ElvenAssassinLaunch";
import FruitNinjaLaunch from "@/pages/FruitNinjaLaunch";
import PlankLaunch from "@/pages/PlankLaunch";
import PropagationLaunch from "@/pages/PropagationLaunch";
import SportsLaunch from "@/pages/SportsLaunch";
import SubsideLaunch from "@/pages/SubsideLaunch";
import UndeadCitadelLaunch from "@/pages/UndeadCitadelLaunch";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route 
            path="/library" 
            element={
              <AuthGuard requireAdmin>
                <Library />
              </AuthGuard>
            } 
          />
          <Route path="/launch/arizona-sunshine" element={<ArizonaSunshineLaunch />} />
          <Route path="/launch/cricket" element={<CricketLaunch />} />
          <Route path="/launch/crisis-brigade" element={<CrisBrigadeLaunch />} />
          <Route path="/launch/elven-assassin" element={<ElvenAssassinLaunch />} />
          <Route path="/launch/fruit-ninja" element={<FruitNinjaLaunch />} />
          <Route path="/launch/plank" element={<PlankLaunch />} />
          <Route path="/launch/propagation" element={<PropagationLaunch />} />
          <Route path="/launch/sports" element={<SportsLaunch />} />
          <Route path="/launch/subside" element={<SubsideLaunch />} />
          <Route path="/launch/undead-citadel" element={<UndeadCitadelLaunch />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
