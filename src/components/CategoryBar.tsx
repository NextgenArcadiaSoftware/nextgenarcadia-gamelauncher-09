
import { Button } from "./ui/button";

interface CategoryBarProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export function CategoryBar({ 
  categories, 
  selectedCategory, 
  onCategorySelect 
}: CategoryBarProps) {
  return (
    <div className="glass p-4 rounded-2xl flex gap-4 overflow-x-auto scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "secondary"}
          onClick={() => onCategorySelect(category)}
          className={`whitespace-nowrap border-0 rounded-xl transition-all duration-300 hover:scale-105 ${
            selectedCategory === category 
              ? "glass bg-white/20 hover:bg-white/30 shadow-lg" 
              : "glass hover:bg-white/20"
          }`}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
