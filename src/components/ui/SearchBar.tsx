import React from 'react';
import { Search } from 'lucide-react';

const SearchBar: React.FC = () => {
  const handleSearchClick = () => {
    console.log('Search icon clicked!'); // Replace with your search logic
  };

  return (
    <div className="relative flex items-center">
      <input
        type="text"
        placeholder="Search..."
        className="pl-8 pr-4 py-1 md:pl-10 md:pr-4 md:py-2 w-44 md:w-72 bg-gray-100 rounded-full text-sm md:text-base text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
      />
      <Search
        className="absolute left-2 h-4 w-4 md:h-5 md:w-5 text-gray-500 cursor-pointer"
        onClick={handleSearchClick}
      />
    </div>
  );
};

export default SearchBar;
