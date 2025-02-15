
import { Button } from "./ui/button";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative flex items-center">
      {showLeftArrow && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 z-10 bg-black/20 backdrop-blur-sm rounded-full w-8 h-8"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-4 w-4 text-white" />
        </Button>
      )}
      
      <div 
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-8 touch-pan-x"
        onScroll={checkScrollButtons}
      >
        {categories.map((category) => (
          <Button
            key={category}
            variant="ghost"
            onClick={() => onCategorySelect(category)}
            className={`rounded-full px-6 transition-all duration-300 min-w-fit ${
              selectedCategory === category 
                ? "bg-white text-black hover:bg-white/90" 
                : "text-white hover:bg-white/10"
            }`}
          >
            {category}
          </Button>
        ))}
      </div>

      {showRightArrow && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 z-10 bg-black/20 backdrop-blur-sm rounded-full w-8 h-8"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-4 w-4 text-white" />
        </Button>
      )}
    </div>
  );
}
