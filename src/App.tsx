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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Screensaver />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/library" element={<Library />} />
          <Route path="/fruitninjalaunch" element={<FruitNinjaLaunch />} />
          {/* Other game launch screens will be added here as they're created */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
