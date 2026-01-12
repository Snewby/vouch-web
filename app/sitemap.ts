/**
 * Sitemap generator for SEO
 * Dynamically generates sitemap with all public requests
 */

import { createClient } from '@supabase/supabase-js';
import type { MetadataRoute } from 'next';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Fetch all public requests
    const { data: requests } = await supabase
      .from('web_request_feed')
      .select('share_token, updated_at')
      .eq('is_public', true)
      .order('updated_at', { ascending: false })
      .limit(1000);

    const requestUrls = (requests || []).map((request) => ({
      url: `https://vouch.app/request/${request.share_token}`,
      lastModified: new Date(request.updated_at),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));

    return [
      {
        url: 'https://vouch.app',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: 'https://vouch.app/create',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      ...requestUrls,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return basic sitemap if there's an error
    return [
      {
        url: 'https://vouch.app',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: 'https://vouch.app/create',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
    ];
  }
}
