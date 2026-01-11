/**
 * Fetch all categories and subcategories in a flat list
 * For unified search experience
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';

export interface CategoryOption {
  id: string;
  name: string;
  parentId: string | null;
  parentName: string | null;
  displayName: string; // e.g., "Restaurant (Food & Drink)" or "Food & Drink"
  isSubcategory: boolean;
  sortOrder: number;
}

/**
 * Fetch all categories and subcategories as a flat list
 */
async function fetchAllCategoriesFlat(): Promise<CategoryOption[]> {
  try {
    // Get category list ID
    const { data: categoryList, error: categoryListError } = await supabase
      .from('lists')
      .select('id')
      .eq('name', 'category')
      .single();

    if (categoryListError || !categoryList) {
      throw new Error('Category list not found');
    }

    // Get subcategory list ID
    const { data: subcategoryList, error: subcategoryListError } = await supabase
      .from('lists')
      .select('id')
      .eq('name', 'subcategory')
      .single();

    if (subcategoryListError || !subcategoryList) {
      throw new Error('Subcategory list not found');
    }

    // Fetch all categories
    const { data: categories, error: categoriesError } = await supabase
      .from('list_items')
      .select('id, name, sort_order')
      .eq('list_id', categoryList.id)
      .is('parent_id', null)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (categoriesError) throw categoriesError;

    // Fetch all subcategories with parent info
    const { data: subcategories, error: subcategoriesError } = await supabase
      .from('list_items')
      .select('id, name, parent_id, sort_order')
      .eq('list_id', subcategoryList.id)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (subcategoriesError) throw subcategoriesError;

    // Create a map of category IDs to names
    const categoryMap = new Map<string, string>();
    (categories || []).forEach((cat) => {
      categoryMap.set(cat.id, cat.name);
    });

    // Build flat list
    const flatList: CategoryOption[] = [];

    // Add all categories
    (categories || []).forEach((cat) => {
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
    (subcategories || []).forEach((sub) => {
      const parentName = sub.parent_id ? categoryMap.get(sub.parent_id) || null : null;
      flatList.push({
        id: sub.id,
        name: sub.name,
        parentId: sub.parent_id,
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
    console.error('Error loading categories:', error);
    throw new Error(error.message || 'Failed to load categories');
  }
}

/**
 * Hook to get all categories and subcategories in a flat list
 */
export function useAllCategoriesFlat() {
  const query = useQuery({
    queryKey: ['categories-flat'],
    queryFn: fetchAllCategoriesFlat,
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
