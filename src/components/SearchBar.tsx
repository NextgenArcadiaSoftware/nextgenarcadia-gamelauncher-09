
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { useSearch } from '@/hooks/useSearch';

export function SearchBar() {
  const { searchTerm, setSearchTerm } = useSearch();

  return (
    <div className="w-full relative mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-black/20 text-white border-white/20 focus-visible:ring-white/30"
        />
      </div>
    </div>
  );
}
