/**
 * Hook to create a new request
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { CreateRequestInput } from '@/types/request';
import { RecRequest } from '@/types/database';

/**
 * Create a new request
 */
async function createRequest(input: CreateRequestInput): Promise<RecRequest> {
  try {
    const { data, error } = await supabase
      .from('rec_requests')
      .insert({
        title: input.title,
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
