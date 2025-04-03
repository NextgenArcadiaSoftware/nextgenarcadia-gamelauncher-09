
import { useState } from 'react';

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState('');

  return {
    searchTerm,
    setSearchTerm,
  };
}
