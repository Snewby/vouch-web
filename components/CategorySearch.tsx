/**
 * Category search component - searches across categories and subcategories
 */

'use client';

import { useState, useEffect } from 'react';
import type { CategoryOption } from '@/lib/hooks/useAllCategoriesFlat';

interface CategorySearchProps {
  categories: CategoryOption[];
  loading: boolean;
  value: string; // category or subcategory ID
  onSelect: (id: string, categoryId: string, subcategoryId: string | null) => void;
  required?: boolean;
  placeholder?: string;
}

export function CategorySearch({
  categories,
  loading,
  value,
  onSelect,
  required = false,
  placeholder = 'Search for a business type (e.g., restaurant, barber, plumber)...',
}: CategorySearchProps) {
  const [searchValue, setSearchValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<CategoryOption[]>([]);

  // Find selected option
  const selectedOption = categories.find((cat) => cat.id === value);

  useEffect(() => {
    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase();
      const filtered = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchLower) ||
        (cat.parentName && cat.parentName.toLowerCase().includes(searchLower))
      );
      setFilteredCategories(filtered);
      setShowDropdown(true);
    } else {
      setFilteredCategories(categories);
      setShowDropdown(false);
    }
  }, [searchValue, categories]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSelect = (option: CategoryOption) => {
    // If subcategory selected, return both category and subcategory IDs
    // If category selected, return only category ID
    const categoryId = option.isSubcategory ? option.parentId! : option.id;
    const subcategoryId = option.isSubcategory ? option.id : null;

    onSelect(option.id, categoryId, subcategoryId);
    setSearchValue('');
    setShowDropdown(false);
  };

  const handleInputFocus = () => {
    if (categories.length > 0) {
      setFilteredCategories(categories);
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
    onSelect('', '', null);
    setSearchValue('');
  };

  return (
    <div className="relative">
      {/* Display selected value or input */}
      {value && !searchValue ? (
        <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white flex items-center justify-between">
          <span className="text-gray-900">{selectedOption?.displayName || value}</span>
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
          required={required && !value}
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
      {showDropdown && filteredCategories.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredCategories.slice(0, 50).map((option) => (
            <button
              key={option.id}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(option);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
            >
              {option.parentName && (
                <span className="text-sm text-gray-500">({option.parentName}) </span>
              )}
              <span className="font-semibold text-gray-900">{option.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {showDropdown && searchValue.trim() && filteredCategories.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg px-4 py-3 text-gray-500 text-sm">
          No matches found
        </div>
      )}
    </div>
  );
}
