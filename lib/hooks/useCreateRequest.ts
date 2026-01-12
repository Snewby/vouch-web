/**
 * Hook to create a new request
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { CreateRequestInput } from '@/types/request';
import { RecRequest } from '@/types/database';

/**
 * Generate title from category/subcategory and area
 */
async function generateTitle(
  categoryId: string | null,
  subcategoryId: string | null,
  areaId: string
): Promise<string> {
  try {
    // Get area name
    const { data: areaItem, error: areaError } = await supabase
      .from('list_items')
      .select('name')
      .eq('id', areaId)
      .single();

    if (areaError) throw areaError;
    const areaName = areaItem?.name || 'Unknown Location';

    // Get subcategory or category name
    let businessTypeName = '';

    if (subcategoryId) {
      const { data: subcatItem, error: subcatError } = await supabase
        .from('list_items')
        .select('name')
        .eq('id', subcategoryId)
        .single();

      if (!subcatError && subcatItem) {
        businessTypeName = subcatItem.name;
      }
    }

    if (!businessTypeName && categoryId) {
      const { data: catItem, error: catError } = await supabase
        .from('list_items')
        .select('name')
        .eq('id', categoryId)
        .single();

      if (!catError && catItem) {
        businessTypeName = catItem.name;
      }
    }

    // Generate title: "Restaurant in Shoreditch" or "Food & Drink in Hackney"
    return businessTypeName ? `${businessTypeName} in ${areaName}` : `Recommendation in ${areaName}`;
  } catch (error) {
    console.error('Error generating title:', error);
    return 'Recommendation Request';
  }
}

/**
 * Create a new request
 */
async function createRequest(input: CreateRequestInput): Promise<RecRequest> {
  try {
    // Auto-generate title if not provided
    let title = input.title;
    if (!title || title.trim() === '') {
      title = await generateTitle(
        input.category_id,
        input.subcategory_id || null,
        input.area_id
      );
    }

    const { data, error } = await supabase
      .from('rec_requests')
      .insert({
        title,
        context: input.context || null,
        category_id: input.category_id,
        subcategory_id: input.subcategory_id || null,
        area_id: input.area_id,
        neighbourhood_id: input.neighbourhood_id || null,
        city_id: input.city_id || null,
        is_public: true,
        user_id: null, // Anonymous for POC
        status: 'open',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating request:', error);
      throw error;
    }

    if (!data) {
      throw new Error('Failed to create request - no data returned');
    }

    return data;
  } catch (error: any) {
    console.error('Error in createRequest:', error);
    throw new Error(error.message || 'Failed to create request');
  }
}

/**
 * Hook to create a request
 */
export function useCreateRequest() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      // Invalidate requests cache to refresh the feed
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });

  return {
    createRequest: mutation.mutate,
    createRequestAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error?.message || null,
    data: mutation.data,
    isSuccess: mutation.isSuccess,
  };
}
