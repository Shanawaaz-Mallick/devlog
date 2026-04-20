import React from 'react';
import { useFilterContext } from '../context/FilterContext';
import { Search, X, Tag as TagIcon, XCircle } from 'lucide-react';

interface FilterBarProps {
  availableTags: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({ availableTags }) => {
  const { filters, setFilters, resetFilters } = useFilterContext();

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const hasFilters = filters.tags.length > 0 || filters.searchQuery !== '' || filters.dateRange !== null;

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            className="input pl-11 bg-white"
            placeholder="Query logs by keyword..."
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
          />
          {filters.searchQuery && (
            <button 
              onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
              className="absolute right-4 top-3 text-gray-400 hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {hasFilters && (
            <button 
              onClick={resetFilters}
              className="btn btn-secondary border-red-200 text-red-500 hover:bg-red-50 gap-2 font-black uppercase text-[10px] tracking-widest px-6"
            >
              <XCircle className="h-4 w-4" />
              Reset Index
            </button>
          )}
        </div>
      </div>

      {/* Tag filter */}
      <div className="flex flex-wrap gap-2 items-center px-2">
        <span className="text-[10px] font-black text-gray-400 flex items-center gap-2 uppercase tracking-widest mr-2">
          <TagIcon className="h-3 w-3" />
          Quick Filters
        </span>
        {availableTags.map(tag => (
          <button 
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
              filters.tags.includes(tag)
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
            }`}
          >
            {tag}
          </button>
        ))}
        {availableTags.length === 0 && (
          <span className="text-xs text-gray-300 italic">No available metadata tags</span>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
