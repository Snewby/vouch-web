/**
 * Hook to fetch location hierarchy and build descendant lookup
 * Enables searching "London" to show all boroughs and neighbourhoods under it
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { HierarchyItem } from '@/types/database';

export interface LocationHierarchy {
  areas: HierarchyItem[];
  descendantsMap: Map<string, string[]>; // Maps parent_id -> [child_ids]
}

/**
 * Fetch all locations from city, area, and neighbourhood lists
 * Builds complete 3-level hierarchy: city > area (borough) > neighbourhood
 */
async function fetchLocationHierarchy(): Promise<LocationHierarchy> {
  try {
    // Get all three list IDs
    const { data: lists, error: listsError } = await supabase
      .from('lists')
      .select('id, name')
      .in('name', ['city', 'area', 'neighbourhood']);

    if (listsError) throw listsError;
    if (!lists || lists.length === 0) {
      throw new Error('Location lists not found');
    }

    const listIds = lists.map(l => l.id);

    // Fetch all items from city, area, and neighbourhood lists
    const { data: allLocations, error: locationsError } = await supabase
      .from('list_items')
      .select('id, name, code_name, parent_id, list_id, metadata, sort_order')
      .in('list_id', listIds)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (locationsError) throw locationsError;

    // Build descendants map across all 3 levels
    const descendantsMap = new Map<string, string[]>();

    // First pass: collect immediate children
    (allLocations || []).forEach((location) => {
      if (location.parent_id) {
        const existing = descendantsMap.get(location.parent_id) || [];
        descendantsMap.set(location.parent_id, [...existing, location.id]);
      }
    });

    // Second pass: recursively collect all descendants (across all levels)
    const getAllDescendants = (parentId: string): string[] => {
      const immediateChildren = descendantsMap.get(parentId) || [];
      const allDescendants = [...immediateChildren];

      immediateChildren.forEach((childId) => {
        const grandchildren = getAllDescendants(childId);
        allDescendants.push(...grandchildren);
      });

      return allDescendants;
    };

    // Build complete descendants map (includes all nested children across all levels)
    const completeDescendantsMap = new Map<string, string[]>();
    (allLocations || []).forEach((location) => {
      const descendants = getAllDescendants(location.id);
      if (descendants.length > 0) {
        completeDescendantsMap.set(location.id, descendants);
      }
    });

    return {
      areas: allLocations || [],
      descendantsMap: completeDescendantsMap,
    };
  } catch (error: any) {
    console.error('Error loading location hierarchy:', error);
    throw new Error(error.message || 'Failed to load location hierarchy');
  }
}

/**
 * Hook to get location hierarchy with descendant lookup
 */
export function useLocationHierarchy() {
  const query = useQuery({
    queryKey: ['location-hierarchy'],
    queryFn: fetchLocationHierarchy,
    staleTime: 6 * 60 * 60 * 1000, // 6 hours
    gcTime: 6 * 60 * 60 * 1000, // 6 hours
  });

  /**
   * Get all location IDs including descendants
   * Example: getLocationWithDescendants('london_id') returns ['london_id', 'westminster_id', 'hackney_id', ...]
   */
  const getLocationWithDescendants = (locationId: string): string[] => {
    if (!query.data) return [locationId];

    const descendants = query.data.descendantsMap.get(locationId) || [];
    return [locationId, ...descendants];
  };

  return {
    areas: query.data?.areas || [],
    descendantsMap: query.data?.descendantsMap || new Map(),
    getLocationWithDescendants,
    loading: query.isLoading,
    error: query.error?.message || null,
    isStale: query.isStale,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
}
