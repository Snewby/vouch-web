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
async function fetchRequests(
  filters?: RequestFilters,
  locationIds?: string[]
): Promise<WebRequestFeed[]> {
  try {
    let query = supabase.from('web_request_feed').select('*');

    // Apply location filter (hierarchical - includes descendants)
    if (locationIds && locationIds.length > 0) {
      query = query.in('area_id', locationIds);
    }

    if (filters?.businessType) {
      // Check both category_id and subcategory_id to support hierarchical filtering
      query = query.or(
        `category_id.eq.${filters.businessType},subcategory_id.eq.${filters.businessType}`
      );
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
 * Accepts locationIds for hierarchical filtering (includes parent + all descendants)
 */
export function useRequests(filters?: RequestFilters, locationIds?: string[]) {
  const query = useQuery({
    queryKey: ['requests', filters, locationIds],
    queryFn: () => fetchRequests(filters, locationIds),
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
