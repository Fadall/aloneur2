import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

export const SearchBar = ({ searchQuery, onSearchChange, handleSearch }: SearchBarProps) => {
  return (
    <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher un plat..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button type="submit" className="absolute right-3 top-2.5">
            <Search className="text-gray-400" size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};