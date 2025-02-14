
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
    <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant="ghost"
          onClick={() => onCategorySelect(category)}
          className={`rounded-full px-6 transition-all duration-300 ${
            selectedCategory === category 
              ? "bg-white text-black hover:bg-white/90" 
              : "text-white hover:bg-white/10"
          }`}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
