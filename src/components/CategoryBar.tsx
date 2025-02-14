
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
    <div className="glass p-4 rounded-xl flex gap-4 overflow-x-auto scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "secondary"}
          onClick={() => onCategorySelect(category)}
          className={`whitespace-nowrap border-0 transition-all duration-300 hover:scale-105 ${
            selectedCategory === category 
              ? "bg-gray-900 text-white hover:bg-gray-800" 
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
