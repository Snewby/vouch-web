/**
 * Filters component for the request feed
 */

import { useState } from 'react';
import type { HierarchyItem } from '@/types/database';
import type { RequestFilters as RequestFiltersType } from '@/types/request';

interface RequestFiltersProps {
  categories: HierarchyItem[];
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

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, location: e.target.value || undefined });
  };

  const handleBusinessTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, businessType: e.target.value || undefined });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    onFilterChange({});
  };

  const hasActiveFilters = filters.location || filters.businessType || filters.search;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="md:col-span-5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search requests..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  onFilterChange({ ...filters, search: undefined });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </form>

        {/* Location Filter */}
        <div className="md:col-span-3">
          <select
            value={filters.location || ''}
            onChange={handleLocationChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">All Locations</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>

        {/* Business Type Filter */}
        <div className="md:col-span-3">
          <select
            value={filters.businessType || ''}
            onChange={handleBusinessTypeChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">All Types</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="md:col-span-1">
            <button
              onClick={handleClearFilters}
              className="w-full px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
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
