/**
 * Hook to create or find a subcategory by name
 * Used for user-generated business types
 */

import { useMutation } from '@tanstack/react-query';
import { supabase } from '../supabase';

/**
 * Call the get_or_create_subcategory database function
 */
async function getOrCreateSubcategory(subcategoryName: string): Promise<string> {
  try {
    const { data, error } = await supabase.rpc('get_or_create_subcategory', {
      subcategory_name: subcategoryName,
    });

    if (error) {
      console.error('Error in get_or_create_subcategory:', error);
      throw error;
    }

    if (!data) {
      throw new Error('Failed to get or create subcategory - no ID returned');
    }

    return data; // Returns the subcategory UUID
  } catch (error: any) {
    console.error('Error in getOrCreateSubcategory:', error);
    throw new Error(error.message || 'Failed to get or create subcategory');
  }
}

/**
 * Hook to get or create a subcategory
 */
export function useCreateSubcategory() {
  const mutation = useMutation({
    mutationFn: getOrCreateSubcategory,
  });

  return {
    getOrCreateSubcategory: mutation.mutate,
    getOrCreateSubcategoryAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error?.message || null,
    data: mutation.data,
  };
}
