
import { Search, Library, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Link } from "react-router-dom";
import { useToast } from "./ui/use-toast";
import { AddGameDialog } from "./AddGameDialog";

export function Header() {
  const { toast } = useToast();

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-6">
        <img 
          src="/lovable-uploads/82c15066-5851-4a30-a1f4-c8fc42e685bd.png" 
          alt="Next Gen Arcadia Logo" 
          className="w-12 h-12"
        />
        <h1 className="text-xl font-bold tracking-wide">
          Next Gen Arcadia
        </h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative w-64">
          <Input
            type="search"
            placeholder="Search games..."
            className="glass pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
        <Link to="/library">
          <Button variant="secondary" size="icon" className="glass">
            <Library className="w-5 h-5" />
          </Button>
        </Link>
        <AddGameDialog onAddGame={() => {}} />
        <Button
          variant="destructive"
          size="icon"
          className="bg-red-600 hover:bg-red-700"
          onClick={() => {
            toast({
              title: "Exiting",
              description: "Closing the launcher...",
            });
          }}
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
