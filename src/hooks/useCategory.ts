
import { useState } from 'react';

// Define categories for the application
const gameCategories = ['All', 'Action', 'Adventure', 'Shooter', 'Sports', 'Rhythm', 'Puzzle', 'Horror'];

export function useCategory() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  return {
    categories: gameCategories,
    selectedCategory,
    setSelectedCategory,
  };
}
