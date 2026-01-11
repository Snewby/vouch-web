/**
 * Filters component for the request feed
 */

import { useState } from 'react';
import type { CategoryOption } from '@/lib/hooks/useAllCategoriesFlat';
import type { HierarchyItem } from '@/types/database';
import type { RequestFilters as RequestFiltersType } from '@/types/request';
import { LocationSearchableSelect } from './LocationSearchableSelect';
import { CategorySearch } from './CategorySearch';

interface RequestFiltersProps {
  categories: CategoryOption[];
  areas: HierarchyItem[];
  filters: RequestFiltersType;
  onFilterChange: (filters: RequestFiltersType) => void;
}

export function RequestFilters({
  categories,
  areas,
  filters,
  onFilterChange,
}: RequestFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ ...filters, search: searchInput || undefined });
  };

  const handleLocationChange = (id: string) => {
    onFilterChange({ ...filters, location: id || undefined });
  };

  const handleBusinessTypeChange = (id: string, categoryId: string, subcategoryId: string | null) => {
    // For filtering, we just use the selected ID (could be category or subcategory)
    onFilterChange({ ...filters, businessType: id || undefined });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    onFilterChange({});
  };

  const hasActiveFilters = filters.location || filters.businessType || filters.search;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="md:col-span-5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search requests..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  onFilterChange({ ...filters, search: undefined });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>
        </form>

        {/* Location Filter */}
        <div className="md:col-span-3">
          <LocationSearchableSelect
            options={areas}
            loading={false}
            value={filters.location || ''}
            placeholder="All Locations"
            onSelect={handleLocationChange}
          />
        </div>

        {/* Business Type Filter */}
        <div className="md:col-span-3">
          <CategorySearch
            categories={categories}
            loading={false}
            value={filters.businessType || ''}
            onSelect={handleBusinessTypeChange}
            placeholder="All Types"
          />
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="md:col-span-1">
            <button
              onClick={handleClearFilters}
              className="w-full px-4 py-2.5 sm:py-2 text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors border border-gray-300 md:border-0 rounded-lg md:rounded-none min-h-[44px] font-medium md:font-normal"
              title="Clear filters"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
