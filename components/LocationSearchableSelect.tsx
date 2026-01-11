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
      const filtered = options.filter((option) =>
        option.name.toLowerCase().includes(searchValue.toLowerCase())
      );
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
                <span className="font-medium">{option.name}</span>
                {parentName && (
                  <span className="ml-2 text-sm text-gray-500">({parentName})</span>
                )}
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
