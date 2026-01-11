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
 * Fetch all areas and build hierarchy map
 */
async function fetchLocationHierarchy(): Promise<LocationHierarchy> {
  try {
    // Get area list ID
    const { data: list, error: listError } = await supabase
      .from('lists')
      .select('id')
      .eq('name', 'area')
      .single();

    if (listError || !list) {
      throw new Error('Area list not found');
    }

    // Fetch all areas
    const { data: areas, error: areasError } = await supabase
      .from('list_items')
      .select('id, name, code_name, parent_id, list_id, metadata, sort_order')
      .eq('list_id', list.id)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (areasError) throw areasError;

    // Build descendants map
    const descendantsMap = new Map<string, string[]>();

    // First pass: collect immediate children
    (areas || []).forEach((area) => {
      if (area.parent_id) {
        const existing = descendantsMap.get(area.parent_id) || [];
        descendantsMap.set(area.parent_id, [...existing, area.id]);
      }
    });

    // Second pass: recursively collect all descendants
    const getAllDescendants = (parentId: string): string[] => {
      const immediateChildren = descendantsMap.get(parentId) || [];
      const allDescendants = [...immediateChildren];

      immediateChildren.forEach((childId) => {
        const grandchildren = getAllDescendants(childId);
        allDescendants.push(...grandchildren);
      });

      return allDescendants;
    };

    // Build complete descendants map (includes all nested children)
    const completeDescendantsMap = new Map<string, string[]>();
    (areas || []).forEach((area) => {
      const descendants = getAllDescendants(area.id);
      if (descendants.length > 0) {
        completeDescendantsMap.set(area.id, descendants);
      }
    });

    return {
      areas: areas || [],
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
