/**
 * Location autocomplete with create-new functionality
 */

'use client';

import { useState, useEffect } from 'react';
import type { HierarchyItem } from '@/types/database';

interface LocationAutocompleteProps {
  areas: HierarchyItem[];
  loading: boolean;
  value: string;
  onSelect: (areaId: string, areaName: string) => void;
  onChange: (value: string) => void;
  required?: boolean;
  showParentContext?: boolean; // Show parent in dropdown like "Westminster (London)"
}

export function LocationAutocomplete({
  areas,
  loading,
  value,
  onSelect,
  onChange,
  required = true,
  showParentContext = false,
}: LocationAutocompleteProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredAreas, setFilteredAreas] = useState<HierarchyItem[]>([]);

  // Build parent lookup map for displaying context
  const parentMap = new Map<string, string>();
  areas.forEach((area) => {
    if (area.parent_id) {
      const parent = areas.find((a) => a.id === area.parent_id);
      if (parent) {
        parentMap.set(area.id, parent.name);
      }
    }
  });

  useEffect(() => {
    if (value.trim()) {
      const filtered = areas.filter((area) =>
        area.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredAreas(filtered);
      setShowDropdown(true);
    } else {
      setFilteredAreas(areas);
      setShowDropdown(false);
    }
  }, [value, areas]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSelect = (area: HierarchyItem) => {
    onSelect(area.id, area.name);
    setShowDropdown(false);
  };

  const handleInputFocus = () => {
    if (value.trim() || areas.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleInputBlur = () => {
    // Delay to allow click on dropdown item
    setTimeout(() => setShowDropdown(false), 300);
  };

  const exactMatch = areas.find(
    (area) => area.name.toLowerCase() === value.toLowerCase()
  );

  return (
    <div className="relative">
      <input
        type="text"
        required={required}
        placeholder="Start typing location..."
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled={loading}
      />

      {showDropdown && filteredAreas.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredAreas.slice(0, 10).map((area) => {
            const parentName = showParentContext ? parentMap.get(area.id) : null;
            return (
              <button
                key={area.id}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent input blur
                  handleSelect(area);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium">{area.name}</span>
                {parentName && (
                  <span className="ml-2 text-sm text-gray-500">({parentName})</span>
                )}
                {area.metadata?.user_generated && (
                  <span className="ml-2 text-xs text-gray-500">(user-added)</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {value.trim() && !exactMatch && filteredAreas.length === 0 && (
        <div className="mt-2 text-sm text-gray-600">
          <span className="inline-block bg-green-50 border border-green-200 rounded px-3 py-1">
            ✓ "{value}" will be added as a new location
          </span>
        </div>
      )}
    </div>
  );
}
