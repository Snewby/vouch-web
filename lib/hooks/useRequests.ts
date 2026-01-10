/**
 * Hooks for fetching and filtering requests
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { WebRequestFeed } from '@/types/database';
import { RequestFilters } from '@/types/request';

/**
 * Fetch all public requests from web_request_feed view
 */
async function fetchRequests(filters?: RequestFilters): Promise<WebRequestFeed[]> {
  try {
    let query = supabase.from('web_request_feed').select('*');

    // Apply filters
    if (filters?.location) {
      query = query.eq('area_id', filters.location);
    }

    if (filters?.businessType) {
      query = query.eq('category_id', filters.businessType);
    }

    if (filters?.search) {
      // Search in title and context
      query = query.or(
        `title.ilike.%${filters.search}%,context.ilike.%${filters.search}%`
      );
    }

    // Always order by created_at desc
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching requests:', error);
      throw error;
    }

    return data || [];
  } catch (error: any) {
    console.error('Error in fetchRequests:', error);
    throw new Error(error.message || 'Failed to load requests');
  }
}

/**
 * Hook to fetch all requests with optional filters
 */
export function useRequests(filters?: RequestFilters) {
  const query = useQuery({
    queryKey: ['requests', filters],
    queryFn: () => fetchRequests(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes - requests are dynamic
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    requests: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}
