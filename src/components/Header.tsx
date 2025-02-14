
import { Search, Library, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Link } from "react-router-dom";
import { useToast } from "./ui/use-toast";

export function Header() {
  const { toast } = useToast();

  return (
    <div className="glass p-6 rounded-xl flex justify-between items-center transition-all duration-300">
      <div className="flex items-center gap-6">
        <div className="relative group">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 opacity-40 group-hover:opacity-100 transition-opacity duration-300 blur" />
          <img 
            src="/lovable-uploads/f12eb427-db97-42db-975b-2ccadfb41224.png" 
            alt="NextGen Arcadia Logo" 
            className="relative w-12 h-12 transform hover:scale-110 transition-transform duration-300" 
          />
        </div>
        <h1 className="text-xl font-bold tracking-wide next-gen-title bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
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
            className="glass border-0 hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <Library className="w-5 h-5" />
          </Button>
        </Link>
        <Button 
          variant="destructive" 
          size="icon" 
          className="glass border-0 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-lg transition-all duration-300 hover:scale-105" 
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
