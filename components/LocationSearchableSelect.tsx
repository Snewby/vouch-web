/**
 * Searchable location select with parent context display
 * Shows hierarchy like "Westminster (London)", "Soho (Westminster)"
 */

'use client';

import { useState, useEffect } from 'react';
import type { HierarchyItem } from '@/types/database';

interface LocationSearchableSelectProps {
  options: HierarchyItem[];
  loading: boolean;
  value: string;
  placeholder?: string;
  onSelect: (id: string) => void;
}

export function LocationSearchableSelect({
  options,
  loading,
  value,
  placeholder = 'Search locations...',
  onSelect,
}: LocationSearchableSelectProps) {
  const [searchValue, setSearchValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<HierarchyItem[]>([]);

  // Build parent lookup map
  const parentMap = new Map<string, string>();
  options.forEach((option) => {
    if (option.parent_id) {
      const parent = options.find((o) => o.id === option.parent_id);
      if (parent) {
        parentMap.set(option.id, parent.name);
      }
    }
  });

  // Find selected option
  const selectedOption = options.find((opt) => opt.id === value);

  useEffect(() => {
    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase();
      const filtered = options
        .filter((option) =>
          option.name.toLowerCase().includes(searchLower)
        )
        .sort((a, b) => {
          const aName = a.name.toLowerCase();
          const bName = b.name.toLowerCase();

          // Exact match comes first
          const aExact = aName === searchLower;
          const bExact = bName === searchLower;
          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;

          // Starts with search term comes before contains
          const aStarts = aName.startsWith(searchLower);
          const bStarts = bName.startsWith(searchLower);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;

          // Top-level (no parent) comes before children
          const aTopLevel = !a.parent_id;
          const bTopLevel = !b.parent_id;
          if (aTopLevel && !bTopLevel) return -1;
          if (!aTopLevel && bTopLevel) return 1;

          // Alphabetical
          return aName.localeCompare(bName);
        });
      setFilteredOptions(filtered);
      setShowDropdown(true);
    } else {
      setFilteredOptions(options);
      setShowDropdown(false);
    }
  }, [searchValue, options]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSelect = (option: HierarchyItem) => {
    onSelect(option.id);
    setSearchValue('');
    setShowDropdown(false);
  };

  const handleInputFocus = () => {
    if (options.length > 0) {
      setFilteredOptions(options);
      setShowDropdown(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
      setSearchValue('');
    }, 200);
  };

  const handleClear = () => {
    onSelect('');
    setSearchValue('');
  };

  return (
    <div className="relative">
      {/* Display selected value or input */}
      {value && !searchValue ? (
        <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white flex items-center justify-between">
          <span className="text-gray-900">{selectedOption?.name || value}</span>
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 ml-2"
          >
            ✕
          </button>
        </div>
      ) : (
        <input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
      )}

      {/* Dropdown */}
      {showDropdown && filteredOptions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredOptions.slice(0, 50).map((option) => {
            const parentName = parentMap.get(option.id);
            return (
              <button
                key={option.id}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(option);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                {parentName && (
                  <span className="text-sm text-gray-500">({parentName}) </span>
                )}
                <span className="font-semibold text-gray-900">{option.name}</span>
                {option.metadata?.user_generated && (
                  <span className="ml-2 text-xs text-gray-500">(user-added)</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* No results message */}
      {showDropdown && searchValue.trim() && filteredOptions.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg px-4 py-3 text-gray-500 text-sm">
          No matches found
        </div>
      )}
    </div>
  );
}
