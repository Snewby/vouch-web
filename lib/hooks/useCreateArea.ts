/**
 * Hook to create or find an area by name
 */

import { useMutation } from '@tanstack/react-query';
import { supabase } from '../supabase';

/**
 * Call the get_or_create_area database function
 */
async function getOrCreateArea(areaName: string): Promise<string> {
  try {
    const { data, error } = await supabase.rpc('get_or_create_area', {
      area_name: areaName,
    });

    if (error) {
      console.error('Error in get_or_create_area:', error);
      throw error;
    }

    if (!data) {
      throw new Error('Failed to get or create area - no ID returned');
    }

    return data; // Returns the area UUID
  } catch (error: any) {
    console.error('Error in getOrCreateArea:', error);
    throw new Error(error.message || 'Failed to get or create area');
  }
}

/**
 * Hook to get or create an area
 */
export function useCreateArea() {
  const mutation = useMutation({
    mutationFn: getOrCreateArea,
  });

  return {
    getOrCreateArea: mutation.mutate,
    getOrCreateAreaAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error?.message || null,
    data: mutation.data,
  };
}
