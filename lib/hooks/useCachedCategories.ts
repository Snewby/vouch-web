/**
 * Cached categories and subcategories hooks
 * Ported from mobile app with web adaptations
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { HierarchyItem } from '@/types/database';
import { CategoryOption } from './useAllCategoriesFlat';

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
 * Fetch all categories AND subcategories from both lists
 * Returns in CategoryOption format for unified search experience
 */
async function fetchAllCategoriesAndSubcategories(): Promise<CategoryOption[]> {
  try {
    // Fetch categories
    const categories = await fetchHierarchyItems('category');

    // Fetch subcategories
    const subcategories = await fetchHierarchyItems('subcategory');

    // Create a map of category IDs to names
    const categoryMap = new Map<string, string>();
    categories.forEach((cat) => {
      categoryMap.set(cat.id, cat.name);
    });

    // Build flat list with CategoryOption format
    const flatList: CategoryOption[] = [];

    // Add all categories
    categories.forEach((cat) => {
      flatList.push({
        id: cat.id,
        name: cat.name,
        parentId: null,
        parentName: null,
        displayName: cat.name,
        isSubcategory: false,
        sortOrder: cat.sort_order || 999,
      });
    });

    // Add all subcategories with parent context
    subcategories.forEach((sub) => {
      const parentName = sub.parent_id ? categoryMap.get(sub.parent_id) || null : null;
      flatList.push({
        id: sub.id,
        name: sub.name,
        parentId: sub.parent_id || null,
        parentName,
        displayName: parentName ? `${sub.name} (${parentName})` : sub.name,
        isSubcategory: true,
        sortOrder: sub.sort_order || 999,
      });
    });

    // Sort by sort_order then by name
    flatList.sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }
      return a.name.localeCompare(b.name);
    });

    return flatList;
  } catch (error: any) {
    console.error('Error loading categories and subcategories:', error);
    throw new Error(error.message || 'Failed to load categories');
  }
}

/**
 * Cached categories hook - 24 hour cache since categories rarely change
 * Fetches ALL categories and subcategories for hierarchical search
 * Now returns CategoryOption[] format for consistency
 */
export function useCachedCategories() {
  const query = useQuery({
    queryKey: ['categories'],
    queryFn: fetchAllCategoriesAndSubcategories,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  return {
    categories: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    isStale: query.isStale,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
}

/**
 * Cached subcategories hook - depends on category selection
 */
export function useCachedSubcategories(categoryId?: string) {
  const query = useQuery({
    queryKey: ['subcategories', categoryId],
    queryFn: () => fetchHierarchyItems('subcategory', categoryId || null),
    staleTime: 12 * 60 * 60 * 1000, // 12 hours
    gcTime: 12 * 60 * 60 * 1000, // 12 hours
    enabled: !!categoryId,
  });

  return {
    subcategories: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    isStale: query.isStale,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
}
