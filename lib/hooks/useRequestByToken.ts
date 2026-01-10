/**
 * Hook to fetch a single request by share token
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { WebRequestFeed, WebRequestResponse } from '@/types/database';

interface RequestDetail {
  request: WebRequestFeed | null;
  responses: WebRequestResponse[];
}

/**
 * Fetch request and responses by share token
 */
async function fetchRequestByToken(shareToken: string): Promise<RequestDetail> {
  try {
    // Fetch request from web_request_feed
    const { data: request, error: requestError } = await supabase
      .from('web_request_feed')
      .select('*')
      .eq('share_token', shareToken)
      .single();

    if (requestError) {
      console.error('Error fetching request:', requestError);
      throw new Error('Request not found');
    }

    if (!request) {
      throw new Error('Request not found');
    }

    // Fetch responses from web_request_responses
    const { data: responses, error: responsesError } = await supabase
      .from('web_request_responses')
      .select('*')
      .eq('request_id', request.id)
      .order('created_at', { ascending: false });

    if (responsesError) {
      console.error('Error fetching responses:', responsesError);
      // Don't throw - responses are optional
    }

    return {
      request,
      responses: responses || [],
    };
  } catch (error: any) {
    console.error('Error in fetchRequestByToken:', error);
    throw new Error(error.message || 'Failed to load request');
  }
}

/**
 * Hook to fetch request details by share token
 */
export function useRequestByToken(shareToken: string) {
  const query = useQuery({
    queryKey: ['request', shareToken],
    queryFn: () => fetchRequestByToken(shareToken),
    staleTime: 1 * 60 * 1000, // 1 minute - responses can be added frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!shareToken,
  });

  return {
    request: query.data?.request || null,
    responses: query.data?.responses || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
}
