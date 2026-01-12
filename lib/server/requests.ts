/**
 * Server-side data fetching utilities for requests
 * Used for SSR and metadata generation
 */

import { createClient } from '@supabase/supabase-js';
import { WebRequestFeed, WebRequestResponse } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  );
}

// Create a Supabase client for server-side use
const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

interface RequestDetail {
  request: WebRequestFeed | null;
  responses: WebRequestResponse[];
}

/**
 * Fetch request and responses by share token (server-side)
 */
export async function fetchRequestByToken(shareToken: string): Promise<RequestDetail> {
  try {
    // Fetch request from web_request_feed
    const { data: request, error: requestError } = await supabaseServer
      .from('web_request_feed')
      .select('*')
      .eq('share_token', shareToken)
      .single();

    if (requestError || !request) {
      return { request: null, responses: [] };
    }

    // Fetch responses from web_request_responses
    const { data: responses, error: responsesError } = await supabaseServer
      .from('web_request_responses')
      .select('*')
      .eq('request_id', request.id)
      .order('created_at', { ascending: false });

    if (responsesError) {
      console.error('Error fetching responses:', responsesError);
    }

    return {
      request,
      responses: responses || [],
    };
  } catch (error: any) {
    console.error('Error in fetchRequestByToken:', error);
    return { request: null, responses: [] };
  }
}
