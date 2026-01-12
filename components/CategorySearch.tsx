/**
 * Category search component - searches across categories and subcategories
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import type { CategoryOption } from '@/lib/hooks/useAllCategoriesFlat';

interface CategorySearchProps {
  categories: CategoryOption[];
  loading: boolean;
  value: string; // category or subcategory ID
  onSelect: (
    id: string,
    categoryId: string,
    subcategoryId: string | null,
    isNew: boolean,
    newName?: string
  ) => void;
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
  const lastNotifiedValue = useRef<string>('');

  // Find selected option
  const selectedOption = categories.find((cat) => cat.id === value);

  // Check if current search would create a new business type
  const isCreatingNew = searchValue.trim() && !categories.find(
    (cat) => cat.name.toLowerCase() === searchValue.toLowerCase()
  ) && !categories.some((cat) =>
    cat.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    (cat.parentName && cat.parentName.toLowerCase().includes(searchValue.toLowerCase()))
  );

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

  // Notify parent when creating new business type (only when value changes)
  useEffect(() => {
    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase();
      const exactMatch = categories.find(
        (cat) => cat.name.toLowerCase() === searchLower
      );
      const hasResults = categories.some((cat) =>
        cat.name.toLowerCase().includes(searchLower) ||
        (cat.parentName && cat.parentName.toLowerCase().includes(searchLower))
      );

      if (!exactMatch && !hasResults) {
        // Only notify if the value actually changed
        if (lastNotifiedValue.current !== searchValue.trim()) {
          lastNotifiedValue.current = searchValue.trim();
          onSelect('', '', null, true, searchValue.trim());
        }
      } else {
        // Reset if we're no longer creating new
        if (lastNotifiedValue.current) {
          lastNotifiedValue.current = '';
        }
      }
    } else {
      // Reset when search is cleared
      if (lastNotifiedValue.current) {
        lastNotifiedValue.current = '';
      }
    }
  }, [searchValue, categories, onSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSelect = (option: CategoryOption) => {
    // If subcategory selected, return both category and subcategory IDs
    // If category selected, return only category ID
    const categoryId = option.isSubcategory ? option.parentId! : option.id;
    const subcategoryId = option.isSubcategory ? option.id : null;

    onSelect(option.id, categoryId, subcategoryId, false);
    setSearchValue('');
    setShowDropdown(false);
  };

  // Check if there's an exact match
  const exactMatch = categories.find(
    (cat) => cat.name.toLowerCase() === searchValue.toLowerCase()
  );

  const handleInputFocus = () => {
    if (categories.length > 0) {
      setFilteredCategories(categories);
      setShowDropdown(true);
    }
  };

  const handleInputBlur = () => {
    // Delay to allow click on dropdown item or form submit button
    setTimeout(() => {
      setShowDropdown(false);
      // Don't clear search value - let the form handle it
      // This allows "Create Request" button click to work with new business types
    }, 200);
  };

  const handleClear = () => {
    onSelect('', '', null, false);
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

      {/* Create new business type indicator */}
      {searchValue.trim() && !exactMatch && filteredCategories.length === 0 && (
        <div className="mt-2 text-sm text-gray-600">
          <span className="inline-block bg-green-50 border border-green-200 rounded px-3 py-1">
            ✓ "{searchValue}" will be added as a new business type
          </span>
        </div>
      )}
    </div>
  );
}
