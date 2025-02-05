
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
    <div className="flex gap-4 overflow-x-auto pb-2 glass p-4 rounded-lg">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "secondary"}
          onClick={() => onCategorySelect(category)}
          className={`glass whitespace-nowrap ${
            selectedCategory === category 
              ? "bg-primary/20 hover:bg-primary/30" 
              : "hover:bg-gray-800/50"
          }`}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
