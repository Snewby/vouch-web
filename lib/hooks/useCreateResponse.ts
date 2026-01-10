/**
 * Hook to create a new response
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { CreateResponseInput } from '@/types/response';
import { RecResponse } from '@/types/database';

/**
 * Create a new response
 */
async function createResponse(input: CreateResponseInput): Promise<RecResponse> {
  try {
    const { data, error } = await supabase
      .from('rec_responses')
      .insert({
        request_id: input.request_id,
        is_guest: input.is_guest,
        responder_name: input.responder_name || null,
        business_name: input.business_name,
        email: input.email || null,
        instagram: input.instagram || null,
        website: input.website || null,
        location: input.location || null,
        notes: input.notes || null,
        user_id: null, // Anonymous for POC
        business_id: null, // Text-based response
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating response:', error);
      throw error;
    }

    if (!data) {
      throw new Error('Failed to create response - no data returned');
    }

    return data;
  } catch (error: any) {
    console.error('Error in createResponse:', error);
    throw new Error(error.message || 'Failed to create response');
  }
}

/**
 * Hook to create a response
 */
export function useCreateResponse() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createResponse,
    onSuccess: (data, variables) => {
      // Invalidate the specific request's cache to show new response
      queryClient.invalidateQueries({ queryKey: ['request'] });
      // Also invalidate requests list to update response count
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });

  return {
    createResponse: mutation.mutate,
    createResponseAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error?.message || null,
    data: mutation.data,
    isSuccess: mutation.isSuccess,
  };
}
