
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
      <div className="flex items-center gap-4">
        <div className="relative w-64 group">
          <Input 
            type="search" 
            placeholder="Search games..." 
            className="rounded-full bg-white/10 border-0 pl-10 transition-all duration-300 focus:ring-2 focus:ring-white/20" 
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
        </div>
        <Link to="/library">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-white/10 transition-all duration-300"
          >
            <Library className="w-5 h-5" />
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full hover:bg-white/10 transition-all duration-300" 
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
