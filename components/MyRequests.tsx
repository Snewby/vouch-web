/**
 * Display user's created requests (from localStorage)
 * Shows on homepage for quick access
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMyRequestTokens } from '@/lib/localStorage';
import { supabase } from '@/lib/supabase';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { formatRelativeDate } from '@/lib/utils';
import type { WebRequestFeed } from '@/types/database';

export function MyRequests() {
  const [myRequests, setMyRequests] = useState<WebRequestFeed[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMyRequests = async () => {
      const tokens = getMyRequestTokens();

      if (tokens.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('web_request_feed')
          .select('*')
          .in('share_token', tokens)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setMyRequests(data || []);
      } catch (err) {
        console.error('Failed to load my requests:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMyRequests();
  }, []);

  // Don't show if no requests
  if (!loading && myRequests.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Your Requests</h2>
        <Badge variant="secondary">{myRequests.length}</Badge>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-sm text-gray-600">Loading your requests...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myRequests.map((request, index) => (
            <div key={request.id}>
              <Link
                href={`/request/${request.share_token}`}
                className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {request.business_type_name && (
                        <Badge variant="default" className="text-xs">
                          {request.business_type_name}
                        </Badge>
                      )}
                      {request.location_name && (
                        <Badge variant="outline" className="text-xs">
                          📍 {request.location_name}
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
                      {request.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {formatRelativeDate(request.created_at)}
                    </p>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <div className="text-lg font-semibold text-blue-600">
                      {request.response_count}
                    </div>
                    <div className="text-xs text-gray-500">
                      {request.response_count === 1 ? 'response' : 'responses'}
                    </div>
                  </div>
                </div>
              </Link>

              {index < myRequests.length - 1 && (
                <Separator className="my-3" />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          💡 Your requests are saved on this device. Create more to keep track of recommendations!
        </p>
      </div>
    </div>
  );
}
