import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, Clock, TrendingUp } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { useAppStore } from '../store/app';
import { debounce } from '../utils';
import type { SearchFilters } from '../types';

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  isLoading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading = false }) => {
  const {
    searchQuery,
    searchFilters,
    searchHistory,
    setSearchQuery,
    setSearchFilters,
    addToSearchHistory,
  } = useAppStore();

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Debounced search function
  const debouncedSearch = debounce((query: string) => {
    if (query.trim()) {
      // Get search suggestions (mock for now)
      const mockSuggestions = [
        `${query} documents`,
        `${query} images`,
        `${query} presentations`,
        `${query} data analysis`,
        `${query} research papers`,
      ].slice(0, 5);
      setSuggestions(mockSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(localQuery);
  }, [localQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setSearchQuery(localQuery);
      addToSearchHistory(localQuery);
      onSearch(localQuery, searchFilters);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalQuery(suggestion);
    setSearchQuery(suggestion);
    addToSearchHistory(suggestion);
    onSearch(suggestion, searchFilters);
    setShowSuggestions(false);
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updated = { ...searchFilters, ...newFilters };
    setSearchFilters(updated);
  };

  const clearSearch = () => {
    setLocalQuery('');
    setSearchQuery('');
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Main Search Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search files, content, or enter natural language query..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onFocus={() => setShowSuggestions(localQuery.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            leftIcon={<Search className="w-5 h-5" />}
            rightIcon={
              <div className="flex items-center space-x-2">
                {localQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="text-secondary-400 hover:text-secondary-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-1 rounded ${showFilters ? 'text-primary-600' : 'text-secondary-400 hover:text-secondary-600'}`}
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            }
            className="pr-20 text-lg py-4"
          />
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Button
              type="submit"
              loading={isLoading}
              disabled={!localQuery.trim()}
              className="px-6"
            >
              Search
            </Button>
          </div>
        </div>
      </form>

      {/* Search Suggestions */}
      {showSuggestions && (suggestions.length > 0 || searchHistory.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 z-50"
        >
          <Card className="border border-secondary-200 shadow-lg">
            {suggestions.length > 0 && (
              <div className="p-2">
                <div className="flex items-center space-x-2 px-3 py-2 text-sm text-secondary-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>Suggestions</span>
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 text-sm text-secondary-700 hover:bg-secondary-100 rounded-md transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Search className="w-4 h-4 text-secondary-400" />
                      <span>{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {searchHistory.length > 0 && (
              <>
                {suggestions.length > 0 && <hr className="border-secondary-200" />}
                <div className="p-2">
                  <div className="flex items-center space-x-2 px-3 py-2 text-sm text-secondary-600">
                    <Clock className="w-4 h-4" />
                    <span>Recent searches</span>
                  </div>
                  {searchHistory.slice(0, 5).map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(item)}
                      className="w-full text-left px-3 py-2 text-sm text-secondary-700 hover:bg-secondary-100 rounded-md transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-secondary-400" />
                        <span>{item}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </Card>
        </motion.div>
      )}

      {/* Advanced Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-4"
        >
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Content Types */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Content Types
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Types' },
                    { value: 'image', label: 'Images' },
                    { value: 'document', label: 'Documents' },
                    { value: 'video', label: 'Videos' },
                    { value: 'audio', label: 'Audio' },
                  ].map((type) => (
                    <label key={type.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={searchFilters.contentTypes.includes(type.value)}
                        onChange={(e) => {
                          const types = e.target.checked
                            ? [...searchFilters.contentTypes, type.value]
                            : searchFilters.contentTypes.filter(t => t !== type.value);
                          handleFilterChange({ contentTypes: types });
                        }}
                        className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-secondary-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Date Range
                </label>
                <div className="space-y-2">
                  <Input
                    type="date"
                    placeholder="From"
                    onChange={(e) => {
                      const start = e.target.value ? new Date(e.target.value) : undefined;
                      handleFilterChange({
                        dateRange: start ? { ...searchFilters.dateRange, start } : undefined
                      });
                    }}
                  />
                  <Input
                    type="date"
                    placeholder="To"
                    onChange={(e) => {
                      const end = e.target.value ? new Date(e.target.value) : undefined;
                      handleFilterChange({
                        dateRange: end ? { ...searchFilters.dateRange, end } : undefined
                      });
                    }}
                  />
                </div>
              </div>

              {/* Size Range */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  File Size
                </label>
                <div className="space-y-2">
                  <select
                    className="w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-secondary-900"
                    onChange={(e) => {
                      const value = e.target.value;
                      let sizeRange;
                      if (value === 'small') sizeRange = { min: 0, max: 1024 * 1024 }; // < 1MB
                      else if (value === 'medium') sizeRange = { min: 1024 * 1024, max: 10 * 1024 * 1024 }; // 1-10MB
                      else if (value === 'large') sizeRange = { min: 10 * 1024 * 1024, max: Infinity }; // > 10MB
                      handleFilterChange({ sizeRange });
                    }}
                  >
                    <option value="">Any size</option>
                    <option value="small">Small (&lt; 1MB)</option>
                    <option value="medium">Medium (1-10MB)</option>
                    <option value="large">Large (&gt; 10MB)</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;
