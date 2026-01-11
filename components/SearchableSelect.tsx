/**
 * Searchable select component - reusable autocomplete dropdown
 */

'use client';

import { useState, useEffect } from 'react';

interface Option {
  id: string;
  name: string;
}

interface SearchableSelectProps {
  options: Option[];
  loading: boolean;
  value: string;
  placeholder?: string;
  onSelect: (id: string, name: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export function SearchableSelect({
  options,
  loading,
  value,
  placeholder = 'Start typing...',
  onSelect,
  required = false,
  disabled = false,
}: SearchableSelectProps) {
  const [searchValue, setSearchValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);

  // Find selected option name
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

  const handleSelect = (option: Option) => {
    onSelect(option.id, option.name);
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
    // Delay to allow click on dropdown item
    setTimeout(() => {
      setShowDropdown(false);
      setSearchValue('');
    }, 200);
  };

  const handleClear = () => {
    onSelect('', '');
    setSearchValue('');
  };

  return (
    <div className="relative">
      {/* Display selected value or input */}
      {value && !searchValue ? (
        <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white flex items-center justify-between">
          <span className="text-gray-900">{selectedOption?.name || value}</span>
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 ml-2"
            disabled={disabled}
          >
            ✕
          </button>
        </div>
      ) : (
        <input
          type="text"
          required={required && !value}
          placeholder={placeholder}
          value={searchValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading || disabled}
        />
      )}

      {/* Dropdown */}
      {showDropdown && filteredOptions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
            >
              {option.name}
            </button>
          ))}
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
