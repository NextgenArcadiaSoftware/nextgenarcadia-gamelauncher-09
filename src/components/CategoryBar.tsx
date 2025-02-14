
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
    <div className="glass p-4 rounded-xl flex gap-4 overflow-x-auto">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "secondary"}
          onClick={() => onCategorySelect(category)}
          className={`whitespace-nowrap border-0 ${
            selectedCategory === category 
              ? "glass bg-white/20 hover:bg-white/30" 
              : "glass hover:bg-white/20"
          }`}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
