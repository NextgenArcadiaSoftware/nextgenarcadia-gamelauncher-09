
import { Search, Library, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Link } from "react-router-dom";
import { useToast } from "./ui/use-toast";

export function Header() {
  const { toast } = useToast();

  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold tracking-wide text-white next-gen-title">
          NextGen Arcadia
        </h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative w-64 group">
          <Input 
            type="search" 
            placeholder="Search games..." 
            className="glass border-0 pl-10 transition-all duration-300 focus:ring-2 ring-purple-500/50" 
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-purple-400 transition-colors duration-300" />
        </div>
        <Link to="/library">
          <Button 
            variant="secondary" 
            size="icon" 
            className="glass border-0 hover:bg-white/20 transition-all duration-300"
          >
            <Library className="w-5 h-5" />
          </Button>
        </Link>
        <Button 
          variant="destructive" 
          size="icon" 
          className="glass border-0 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-xl transition-all duration-300" 
          onClick={() => {
            toast({
              title: "Exiting",
              description: "Closing the launcher..."
            });
          }}
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
