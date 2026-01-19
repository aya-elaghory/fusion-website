import React from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  suggestions: { text: string; name: string }[];
  onSuggestionClick: (name: string) => void;
  isFocused: boolean;
  setSearchQuery: (v: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onChange,
  onFocus,
  onBlur,
  suggestions,
  onSuggestionClick,
  isFocused,
  setSearchQuery,
}) => (
  <div className="relative mr-2 w-full">
    <input
      type="text"
      value={searchQuery}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder="Search Products"
      className="w-full px-8 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-700 text-sm mb-1 lg:mb-0"
    />
    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    {searchQuery && (
      <button
        type="button"
        onClick={() => setSearchQuery("")}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>
    )}
    {suggestions.length > 0 && isFocused && (
      <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-30">
        <ul className="p-2 space-y-1">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className={`text-sm text-gray-600 cursor-pointer hover:bg-green-50 p-1 rounded ${
                !suggestion.name ? "cursor-default" : ""
              }`}
              onClick={() => onSuggestionClick(suggestion.name)}
            >
              {suggestion.text}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

export default SearchBar;
