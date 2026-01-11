/**
 * Cached areas and neighbourhoods hooks
 * Ported from mobile app with web adaptations
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { HierarchyItem } from '@/types/database';

/**
 * Fetch hierarchy items by list name
 */
async function fetchHierarchyItems(
  listName: string,
  parentId?: string | null
): Promise<HierarchyItem[]> {
  try {
    // Get the list ID
    const { data: list, error: listError } = await supabase
      .from('lists')
      .select('id')
      .eq('name', listName)
      .single();

    if (listError || !list) {
      throw new Error(`List '${listName}' not found`);
    }

    // Build query
    let query = supabase
      .from('list_items')
      .select('id, name, code_name, parent_id, list_id, metadata, sort_order')
      .eq('list_id', list.id);

    // Filter by parent if specified
    if (parentId !== undefined) {
      if (parentId === null) {
        query = query.is('parent_id', null);
      } else {
        query = query.eq('parent_id', parentId);
      }
    }

    query = query.order('sort_order', { ascending: true }).order('name', { ascending: true });

    const { data, error: itemsError } = await query;

    if (itemsError) throw itemsError;

    return data || [];
  } catch (error: any) {
    console.error(`Error loading ${listName} items:`, error);
    throw new Error(error.message || `Failed to load ${listName} items`);
  }
}

/**
 * Cached areas hook - 6 hour cache for geographic data
 * Fetches all areas regardless of parent_id
 */
export function useCachedAreas() {
  const query = useQuery({
    queryKey: ['areas'],
    queryFn: () => fetchHierarchyItems('area'),
    staleTime: 6 * 60 * 60 * 1000, // 6 hours
    gcTime: 6 * 60 * 60 * 1000, // 6 hours
  });

  return {
    areas: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    isStale: query.isStale,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
}

/**
 * Cached neighbourhoods hook - depends on area selection
 */
export function useCachedNeighbourhoods(areaId?: string) {
  const query = useQuery({
    queryKey: ['neighbourhoods', areaId],
    queryFn: () => fetchHierarchyItems('neighbourhood', areaId || undefined),
    staleTime: 6 * 60 * 60 * 1000, // 6 hours
    gcTime: 6 * 60 * 60 * 1000, // 6 hours
    enabled: true,
  });

  return {
    neighbourhoods: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    isStale: query.isStale,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
}
